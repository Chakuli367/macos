import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

// ========== UPDATED TYPE DEFINITIONS ==========

export interface Task {
  task_number: number;
  description: string;
  done: boolean;
}

export interface Lesson {
  id: number;
  day: number;
  date: string;
  title: string;
  tasks: Task[];
  completed: boolean;
  locked: boolean;
}

export interface TaskOverview {
  days: Array<{
    day: number;
    date: string;
    title: string;
    tasks: Array<{
      task_number: number;
      description: string;
    }>;
  }>;
}

export interface CourseData {
  goal_name: string;
  created_at: string;
  course_id: string;
  task_overview: TaskOverview;
  task_completion?: {
    [dayNumber: string]: {
      [taskNumber: string]: boolean;
    };
  };
}


// ========== UPDATE TASK STATUS ==========

/**
 * Update a specific task's completion status in new structure
 * @param userId - The user's ID
 * @param date - The lesson date (not used in new structure, kept for compatibility)
 * @param taskIndex - Index of the task (0, 1, 2)
 * @param done - New completion status
 */
export async function fetchUserLessons(userId: string): Promise<Lesson[]> {
  try {
    console.log('🔍 Fetching lessons for user:', userId);
    
    const coursesRef = collection(db, 'users', userId, 'datedcourses');
    const coursesSnapshot = await getDocs(coursesRef);
    
    if (coursesSnapshot.empty) {
      console.error('❌ No courses found');
      console.log('📍 Path checked: users/' + userId + '/datedcourses');
      return [];
    }

    console.log('📦 Found', coursesSnapshot.docs.length, 'document(s)');
    
    // Try each document until we find one with task_overview
    let courseData: any = null;
    let courseDocId: string = '';
    
    for (const doc of coursesSnapshot.docs) {
      console.log('📄 Checking document:', doc.id);
      const data = doc.data();
      console.log('📊 Document keys:', Object.keys(data));
      
      if (data.task_overview && data.task_overview.days) {
        courseData = data;
        courseDocId = doc.id;
        console.log('✅ Found valid task_overview in document:', doc.id);
        break;
      } else {
        console.log('⚠️  Document', doc.id, 'has no valid task_overview');
        console.log('   - Has task_overview?', !!data.task_overview);
        console.log('   - Has days array?', !!(data.task_overview?.days));
      }
    }
    
    if (!courseData) {
      console.error('❌ No valid task_overview found in any document');
      return [];
    }

    console.log('✅ Using document:', courseDocId);
    console.log('✅ Days found:', courseData.task_overview.days.length);

    const taskCompletionMap = courseData.task_completion || {};

    // Transform days into lesson format
    const lessonsArray: Lesson[] = courseData.task_overview.days.map((day: any, index: number) => {
      console.log(`📝 Day ${day.day}: ${day.title} (${day.tasks?.length || 0} tasks)`);
      
      const dayCompletionMap = taskCompletionMap[day.day] || {};
      
      const tasksWithStatus: Task[] = (day.tasks || []).map((task: any) => ({
  task_number: task.task_number,
  description: task.description,
  done: dayCompletionMap[task.task_number] || false
}));

const allTasksCompleted = tasksWithStatus.length > 0 && 
  tasksWithStatus.every(task => task.done);

// Check if previous day is completed
let previousDayCompleted = true;
if (index > 0) {
  const prevDay = index; // Day number is 1-indexed, array is 0-indexed
  const prevDayTasks = taskCompletionMap[prevDay];
  previousDayCompleted = prevDayTasks && 
    Object.keys(prevDayTasks).length >= 3 &&
    Object.values(prevDayTasks).every(v => v === true);
}

return {
  id: day.day,
  day: day.day,
  date: day.date,
  title: day.title,
  tasks: tasksWithStatus,
  completed: day.completed || allTasksCompleted, // ← READ FROM FIRESTORE FIRST!
  locked: index > 0 && !previousDayCompleted
};
    });

    console.log('✅ Successfully loaded', lessonsArray.length, 'lessons');
    return lessonsArray;

  } catch (error) {
    console.error('❌ Error in fetchUserLessons:', error);
    return [];
  }
}

// ========== REMOVED FUNCTIONS (No longer needed) ==========

/**
 * ❌ REMOVED: saveReflection - No reflection field in new structure
 */

/**
 * ❌ REMOVED: markLessonComplete - Completion is auto-calculated from tasks
 */

// ========== GET USER STATS ==========

/**
 * Get user stats (for dashboard)
 * @param userId - The user's ID
 */
export async function getUserStats(userId: string) {
  try {
    const coursesRef = collection(db, 'users', userId, 'datedcourses');
    const coursesSnapshot = await getDocs(coursesRef);

    if (coursesSnapshot.empty) {
      return {
        completedLessons: 0,
        totalLessons: 0,
        xpEarned: 0,
        streak: 0,
        timeInvested: '0h'
      };
    }

    const firstCourseDoc = coursesSnapshot.docs[0];
    const courseData = firstCourseDoc.data() as CourseData;

    if (!courseData.task_overview?.days) {
      return {
        completedLessons: 0,
        totalLessons: 0,
        xpEarned: 0,
        streak: 0,
        timeInvested: '0h'
      };
    }

    const totalLessons = courseData.task_overview.days.length;
    const taskCompletionMap = courseData.task_completion || {};

    // Count completed lessons (all 3 tasks done)
    let completedLessons = 0;
    courseData.task_overview.days.forEach(day => {
      const dayTasks = taskCompletionMap[day.day] || {};
      const tasksCount = day.tasks.length;
      const completedCount = Object.values(dayTasks).filter(v => v === true).length;
      
      if (completedCount === tasksCount) {
        completedLessons++;
      }
    });

    const xpEarned = completedLessons * 150; // Base XP per lesson

    // Calculate streak (consecutive days completed)
    let streak = 0;
    for (let i = 1; i <= totalLessons; i++) {
      const dayTasks = taskCompletionMap[i] || {};
      const allCompleted = Object.keys(dayTasks).length === 3 && 
        Object.values(dayTasks).every(v => v === true);
      
      if (allCompleted) {
        streak++;
      } else {
        break; // Break on first incomplete day
      }
    }

    // Estimate time (assume 30 min per completed lesson)
    const timeInMinutes = completedLessons * 30;
    const timeInvested = `${(timeInMinutes / 60).toFixed(1)}h`;

    return {
      completedLessons,
      totalLessons,
      xpEarned,
      streak,
      timeInvested
    };

  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    return {
      completedLessons: 0,
      totalLessons: 0,
      xpEarned: 0,
      streak: 0,
      timeInvested: '0h'
    };
  }
}