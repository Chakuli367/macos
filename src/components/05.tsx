
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  Clock, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Target,
  Sparkles,
  Lock,
  Calendar,
  TrendingUp,
  BookOpen,
  Play
} from 'lucide-react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, getDocs, getDoc } from 'firebase/firestore';
import { fetchUserLessons, getUserStats } from '../services/lessonService'

export default function TodayLessonHero({ onStartLesson, activeDay }) {
  const [user, setUser] = useState(null);
  const [displayLesson, setdisplayLesson] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [lessonProgress, setLessonProgress] = useState(null); // Track in-lesson progress
  const [lessonsByDate, setLessonsByDate] = useState({}); // Store lessons timeline from Firebase
  const [currentDayNumber, setCurrentDayNumber] = useState(1); // Track which day we're on

  // Total subpages in a lesson
  const totalSubpages = 9; // ['intro', 'motivation', 'lesson', 'why', 'quote', 'consequences', 'tasks', 'reflection', 'complete']

  // --- PLACEHOLDER LESSON DATA ---
const PLACEHOLDER_LESSONS = {
  1: { id: 'lesson-1', title: 'The Power of First Impressions', summary: 'Understand the science behind initial social interactions and how to maximize your presence.', duration: '10 min', xp: 50, difficulty: 'easy', completed: false, locked: false, date: new Date().toISOString() },
  2: { id: 'lesson-2', title: 'Mastering Active Listening', summary: 'Learn advanced techniques to truly listen, remember details, and make people feel heard.', duration: '15 min', xp: 75, difficulty: 'medium', completed: false, locked: false, date: new Date().toISOString() },
  3: { id: 'lesson-3', title: 'Body Language Decoded', summary: 'Control your non-verbal cues and learn to read others\' unspoken signals in any setting.', duration: '20 min', xp: 100, difficulty: 'medium', completed: false, locked: false, date: new Date().toISOString() },
  4: { id: 'lesson-4', title: 'Crafting Engaging Conversations', summary: 'Move beyond small talk: discover topics and frameworks for deep, memorable dialogue.', duration: '15 min', xp: 90, difficulty: 'medium', completed: false, locked: false, date: new Date().toISOString() },
  5: { id: 'lesson-5', title: 'The Art of Follow-Up', summary: 'Turn new connections into lasting relationships with strategic, effective follow-up methods.', duration: '10 min', xp: 60, difficulty: 'easy', completed: false, locked: false, date: new Date().toISOString() },
};
// --- END PLACEHOLDER LESSON DATA ---

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // If activeDay prop is set, we skip real data fetching and rely on placeholder logic
      if (activeDay) {
        setLoading(false);
        return;
      }

      if (currentUser) {
        await loadLessonData(currentUser.uid);
        // Set up real-time listener for lesson progress
        setupProgressListener(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [activeDay]); // <-- ADDED activeDay TO DEPENDENCY ARRAY


 useEffect(() => {
    console.log('🔍 ========== AUTO-OPEN CHECK ==========');
    
    const autoOpenData = sessionStorage.getItem('autoOpenLesson');
    console.log('📦 SessionStorage raw data:', autoOpenData);
    
    if (autoOpenData && displayLesson) {
      try {
        const parsed = JSON.parse(autoOpenData);
        console.log('📖 Parsed data:', parsed);
        console.log('📖 Timestamp:', parsed.timestamp);
        console.log('⏱️ Time elapsed:', Date.now() - parsed.timestamp, 'ms');
        
        if (Date.now() - parsed.timestamp < 10000) {
          console.log('✅ Auto-opening lesson:', displayLesson.title);
          
          if (onStartLesson) {
            const lessonToOpen = {
              ...displayLesson,
              dayNumber: currentDayNumber,
              day: currentDayNumber,
              index: currentDayNumber - 1
            };
            onStartLesson(lessonToOpen);
          }
          
          sessionStorage.removeItem('autoOpenLesson');
          console.log('🗑️ Cleared sessionStorage');
        } else {
          console.warn('⏰ Timestamp expired');
          sessionStorage.removeItem('autoOpenLesson');
        }
      } catch (e) {
        console.error('❌ Error parsing sessionStorage:', e);
      }
    } else {
      console.log('⚠️ No auto-open data or lesson not loaded yet');
    }
  }, [displayLesson, currentDayNumber, onStartLesson]);


  

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

 const [noCourse, setNoCourse] = useState(false); // add at top with other states



const loadLessonData = async (userId) => {
  try {
    setLoading(true);
    
    // Fetch user stats (keep this if getUserStats exists)
    let stats;
    try {
      stats = await getUserStats(userId);
    } catch (error) {
      console.log("Stats service unavailable, using defaults");
      stats = {
        streak: 0,
        xpEarned: 0,
        completedLessons: 0,
        totalLessons: 5,
        timeInvested: '0h'
      };
    }

    // Get task_overview from the 'life_skills' document
    const socialSkillsDocRef = doc(db, 'users', userId, 'datedcourses', 'life_skills');
    const socialSkillsDoc = await getDoc(socialSkillsDocRef);
    
    if (!socialSkillsDoc.exists()) {
      console.log("No life_skills course found");
      setdisplayLesson(null);
      setUserStats(stats);
      setNoCourse(true);
      setLoading(false);
      return;
    }

    const courseData = socialSkillsDoc.data();
    
    console.log("📚 Course data:", courseData);

    // ============ Read from task_overview.days ============
    if (!courseData.task_overview || !courseData.task_overview.days) {
      console.log("No task_overview found");
      setNoCourse(true);
      setLoading(false);
      return;
    }

    const days = courseData.task_overview.days;
    console.log("✅ Found", days.length, "days");

    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find which day matches today or the most recent past date
    let currentDayData = null;
    let currentDayNumber = 1;

    for (let i = 0; i < days.length; i++) {
      const dayDate = new Date(days[i].date);
      dayDate.setHours(0, 0, 0, 0);
      
      if (dayDate <= today) {
        currentDayData = days[i];
        currentDayNumber = days[i].day;
      } else {
        break; // Stop at future dates
      }
    }

    // If no day matches (all future dates), use first day
    if (!currentDayData) {
      currentDayData = days[0];
      currentDayNumber = 1;
    }

    console.log("📅 Current day:", currentDayNumber, "-", currentDayData.title);

    // Check if all tasks in this day are completed
    const allTasksDone = currentDayData.tasks.every(task => task.done === true);
    
    // Calculate total completed lessons across all days
    const completedDaysCount = days.filter(day => 
      day.tasks.every(task => task.done === true)
    ).length;

    // Create lesson object
    const todayLesson = {
      id: `lesson-day-${currentDayNumber}`,
      title: currentDayData.title,
      summary: `Day ${currentDayNumber} of your social skills journey`,
      duration: `${currentDayData.tasks.length * 5} min`,
      xp: 50 + (currentDayNumber * 10),
      difficulty: currentDayNumber === 1 ? 'easy' : (currentDayNumber <= 3 ? 'medium' : 'hard'),
      completed: allTasksDone,
      locked: false,
      date: currentDayData.date,
      tasks: currentDayData.tasks,
      dayNumber: currentDayNumber
    };

    console.log("✨ Today's lesson:", todayLesson);

    // Update stats with real data
    const updatedStats = {
      ...stats,
      completedLessons: completedDaysCount,
      totalLessons: days.length,
      // Calculate XP from completed tasks
      xpEarned: days.reduce((total, day) => {
        const completedTasks = day.tasks.filter(t => t.done === true).length;
        return total + (completedTasks * (50 + day.day * 10));
      }, 0)
    };

    setCurrentDayNumber(currentDayNumber);
    setdisplayLesson(todayLesson);
    setUserStats(updatedStats);
    setNoCourse(false);
    
  } catch (error) {
    console.error('Error loading lesson data:', error);
    setNoCourse(true);
  } finally {
    setLoading(false);
  }
};

// Helper to check if all tasks in a day are completed
const isDayCompleted = (dayData) => {
  if (!dayData || !dayData.tasks) return false;
  if (!Array.isArray(dayData.tasks)) return false;
  if (dayData.tasks.length === 0) return false;
  
  return dayData.tasks.every(task => task.done === true);
};


  // Calculate in-lesson progress percentage
  // Calculate in-lesson progress percentage
  // Calculate in-lesson progress percentage
const getInLessonProgress = () => {
  if (activeDay) return 0; // Bypass progress for placeholder content

  if (!lessonProgress || !displayLesson) return 0;
  if (lessonProgress.lessonId !== displayLesson.id) return 0;
  
  return ((lessonProgress.currentSubpage + 1) / totalSubpages) * 100;
};

  const isLessonInProgress = lessonProgress && 
    displayLesson && 
    lessonProgress.lessonId === displayLesson?.id &&
    lessonProgress.currentSubpage > 0 &&
    lessonProgress.currentSubpage < totalSubpages - 1;


    if (noCourse) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-3xl border border-pink-400/30 shadow-lg p-12 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Go Create Your Pvcvlan</h2>
      <p className="text-white/80 mb-6">You don't have any active lessons yet. Start by creating your plan!</p>
      <button
        onClick={() => window.location.href = `/conversation/${user?.uid}`}
        className="bg-white text-pink-600 font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
      >
        Start Now
      </button>
    </div>
  );
}

  // Loading state
  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-3xl border border-purple-400/30 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/10">

        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-slate-400 text-lg">Loading your journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-3xl border border-purple-500/20 p-8 md:p-12">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-3xl font-bold text-white mb-2">Start Your Journey</h2>
          <p className="text-slate-400 mb-6">Sign in to access your personalized lessons</p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all">
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  // No lesson available
  if (!displayLesson) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-3xl border border-purple-500/20 p-8 md:p-12">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white mb-2">All Caught Up!</h2>
          <p className="text-slate-400">You've completed all available lessons</p>
        </div>
      </div>
    );
  }

  // --- DATA SELECTION LOGIC (PRIORITIZES activeDay PROP) ---
const finalDisplayLesson = (activeDay && PLACEHOLDER_LESSONS[activeDay]) ? PLACEHOLDER_LESSONS[activeDay] : displayLesson;
const displayDayNumber = activeDay || currentDayNumber;
  
  const progressPercentage = userStats ? (userStats.completedLessons / userStats.totalLessons) * 100 : 0;
  const inLessonProgress = getInLessonProgress();
  // --- END DATA SELECTION LOGIC ---

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`
          }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [null, (Math.random() - 0.5) * 200]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-12">
        {/* Top Stats Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">{userStats?.streak || 0} Day Streak</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/30"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">{userStats?.xpEarned || 0} XP</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30"
          >
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold">{userStats?.completedLessons || 0}/{userStats?.totalLessons || 5} Lessons</span>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Lesson Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-bold text-sm">
                  Day {displayDayNumber}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(finalDisplayLesson.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-200 via-blue-200 to-purple-300 bg-clip-text text-transparent">
                  {finalDisplayLesson.title}
                </span>
              </h1>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                {finalDisplayLesson.summary}
              </p>

              {/* In-Lesson Progress Indicator */}
              <AnimatePresence>
                {isLessonInProgress && !activeDay && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <BookOpen className="w-5 h-5 text-purple-400" />
                        </motion.div>
                        <span className="text-sm font-bold text-purple-300">IN PROGRESS</span>
                      </div>
                      <span className="text-purple-400 font-bold text-sm">
                        Step {lessonProgress.currentSubpage + 1}/{totalSubpages}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${inLessonProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      {Math.round(inLessonProgress)}% through this lesson
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lesson Details */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{finalDisplayLesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">+{finalDisplayLesson.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    finalDisplayLesson.difficulty === 'easy' ? 'bg-green-400' :
                    finalDisplayLesson.difficulty === 'medium' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <span className="text-sm text-slate-400 capitalize">{finalDisplayLesson.difficulty}</span>
                </div>
              </div>

              {/* CTA Button */}
              {finalDisplayLesson.completed ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-3 bg-green-500/20 border border-green-500/50 px-8 py-4 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold text-lg">Completed!</span>
                </motion.div>
              ) : finalDisplayLesson.locked ? (
                <motion.div
                  className="inline-flex items-center gap-3 bg-slate-700/50 border border-slate-600/50 px-8 py-4 rounded-xl cursor-not-allowed"
                >
                  <Lock className="w-6 h-6 text-slate-500" />
                  <span className="text-slate-500 font-semibold text-lg">Complete Previous Lesson First</span>
                </motion.div>
              ) : (
                <motion.button
  onClick={() => {
    console.log('🎯 ========== BUTTON CLICKED ==========');
    console.log('1️⃣ activeDay prop:', activeDay);
    console.log('2️⃣ displayDayNumber:', displayDayNumber);
    console.log('3️⃣ finalDisplayLesson:', finalDisplayLesson);
    console.log('4️⃣ displayLesson:', displayLesson);
    
    const lessonToSend = {
      ...finalDisplayLesson,
      dayNumber: displayDayNumber,
      day: displayDayNumber,
      index: displayDayNumber - 1
    };
    
    console.log('5️⃣ ========== SENDING TO onStartLesson ==========');
    console.log(JSON.stringify(lessonToSend, null, 2));
    
    // Show alert with data
    alert(`Sending Day ${displayDayNumber}\n\nCheck console for details (you have 5 seconds)`);
    
    if (onStartLesson) {
      onStartLesson(lessonToSend);
    } else {
      console.error('❌ onStartLesson is undefined!');
    }
  }}
  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)" }}
  whileTap={{ scale: 0.98 }}
  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/30"
>
  <span className="relative z-10 flex items-center gap-3">
    {isLessonInProgress ? (
      <>
        <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        Continue Lesson
      </>
    ) : (
      <>
        Start Today's Lesson
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </>
    )}
  </span>
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
    initial={{ x: '-100%' }}
    whileHover={{ x: 0 }}
    transition={{ duration: 0.3 }}
  />
</motion.button>
              )}
            </motion.div>
          </div>

          {/* Right Side - Progress Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block"
          >
            <div className="relative">
              {/* Circular Progress */}
              <div className="relative w-64 h-64 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.1)"
                    strokeWidth="12"
                  />
                  {/* Overall Progress Circle */}
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 110}
                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - progressPercentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* In-Lesson Progress Circle (Inner) */}
                  {isLessonInProgress && (
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="90"
                      fill="none"
                      stroke="url(#gradientInner)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 90}
                      animate={{ 
                        strokeDashoffset: 2 * Math.PI * 90 * (1 - inLessonProgress / 100),
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        strokeDashoffset: { duration: 0.5 },
                        opacity: { duration: 2, repeat: Infinity }
                      }}
                    />
                  )}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="gradientInner" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="text-center"
                  >
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="text-slate-400 text-sm font-medium">Complete</div>
                    {isLessonInProgress && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-cyan-400 text-xs font-bold"
                      >
                        {Math.round(inLessonProgress)}% in lesson
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 right-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-yellow-400 font-bold text-lg">{userStats?.xpEarned || 0}</div>
                    <div className="text-yellow-300/70 text-xs">Total XP</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-blue-400 font-bold text-lg">{userStats?.timeInvested || '0h'}</div>
                    <div className="text-blue-300/70 text-xs">Time Invested</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Progress Bar (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:hidden mt-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm font-medium">Journey Progress</span>
            <span className="text-purple-400 font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Mobile In-Lesson Progress */}
          {isLessonInProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-400 text-sm font-medium">Current Lesson</span>
                <span className="text-cyan-400 font-bold">{Math.round(inLessonProgress)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  animate={{ width: `${inLessonProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}