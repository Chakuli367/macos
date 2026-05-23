// createSampleUsers.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sample user data
const sampleUsers = [
  {
    email: 'alex.johnson@example.com',
    password: 'password123',
    name: 'Alex Johnson',
    username: 'alexj',
    bio: 'Passionate learner and coding enthusiast 🚀',
    status: 'Learning new things every day!',
    mood: '🚀',
    league: 'GOLD',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=9333ea&color=fff&size=200',
    stats: {
      totalXP: 2450,
      weeklyXP: 420,
      monthlyXP: 1850,
      streak: 12,
      longestStreak: 25,
      tasksCompleted: 87,
      lessonsCompleted: 34,
      level: 5,
      coins: 450,
      gems: 12,
      crowns: 34,
      combo: 5,
      maxCombo: 15,
      studyTime: 2340,
      completionRate: 92,
      friendsCount: 8,
      groupsCount: 3,
      achievementsCount: 7,
      challengesCompleted: 15,
      postsCount: 23,
      reactionsReceived: 145
    }
  },
  {
    email: 'sarah.williams@example.com',
    password: 'password123',
    name: 'Sarah Williams',
    username: 'sarahw',
    bio: 'Coffee lover ☕ | Growth mindset advocate',
    status: 'On a 15-day streak! 🔥',
    mood: '💪',
    league: 'PLATINUM',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=c084fc&color=fff&size=200',
    stats: {
      totalXP: 4200,
      weeklyXP: 580,
      monthlyXP: 2300,
      streak: 15,
      longestStreak: 30,
      tasksCompleted: 142,
      lessonsCompleted: 56,
      level: 8,
      coins: 780,
      gems: 25,
      crowns: 56,
      combo: 8,
      maxCombo: 20,
      studyTime: 4560,
      completionRate: 95,
      friendsCount: 15,
      groupsCount: 5,
      achievementsCount: 12,
      challengesCompleted: 28,
      postsCount: 45,
      reactionsReceived: 289
    }
  },
  {
    email: 'mike.chen@example.com',
    password: 'password123',
    name: 'Mike Chen',
    username: 'mikec',
    bio: 'Always learning, always growing 🌱',
    status: 'Crushing my goals!',
    mood: '🎯',
    league: 'SILVER',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=7c3aed&color=fff&size=200',
    stats: {
      totalXP: 890,
      weeklyXP: 210,
      monthlyXP: 890,
      streak: 5,
      longestStreak: 8,
      tasksCompleted: 45,
      lessonsCompleted: 18,
      level: 2,
      coins: 180,
      gems: 5,
      crowns: 18,
      combo: 3,
      maxCombo: 7,
      studyTime: 1200,
      completionRate: 85,
      friendsCount: 4,
      groupsCount: 2,
      achievementsCount: 3,
      challengesCompleted: 7,
      postsCount: 12,
      reactionsReceived: 67
    }
  },
  {
    email: 'emma.davis@example.com',
    password: 'password123',
    name: 'Emma Davis',
    username: 'emmad',
    bio: 'Lifelong learner | Bookworm 📚',
    status: 'Reading is my superpower!',
    mood: '🧠',
    league: 'DIAMOND',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=a78bfa&color=fff&size=200',
    stats: {
      totalXP: 6780,
      weeklyXP: 750,
      monthlyXP: 3200,
      streak: 23,
      longestStreak: 45,
      tasksCompleted: 234,
      lessonsCompleted: 89,
      level: 13,
      coins: 1250,
      gems: 42,
      crowns: 89,
      combo: 12,
      maxCombo: 25,
      studyTime: 7800,
      completionRate: 97,
      friendsCount: 25,
      groupsCount: 8,
      achievementsCount: 18,
      challengesCompleted: 45,
      postsCount: 78,
      reactionsReceived: 456
    }
  },
  {
    email: 'james.brown@example.com',
    password: 'password123',
    name: 'James Brown',
    username: 'jamesb',
    bio: 'Tech enthusiast | Problem solver',
    status: 'Building amazing things!',
    mood: '😊',
    league: 'GOLD',
    avatar: 'https://ui-avatars.com/api/?name=James+Brown&background=8b5cf6&color=fff&size=200',
    stats: {
      totalXP: 1850,
      weeklyXP: 340,
      monthlyXP: 1450,
      streak: 8,
      longestStreak: 15,
      tasksCompleted: 67,
      lessonsCompleted: 28,
      level: 4,
      coins: 320,
      gems: 8,
      crowns: 28,
      combo: 4,
      maxCombo: 10,
      studyTime: 1890,
      completionRate: 88,
      friendsCount: 6,
      groupsCount: 3,
      achievementsCount: 5,
      challengesCompleted: 12,
      postsCount: 18,
      reactionsReceived: 98
    }
  },
  {
    email: 'olivia.martinez@example.com',
    password: 'password123',
    name: 'Olivia Martinez',
    username: 'oliviam',
    bio: 'Artist | Creative thinker 🎨',
    status: 'Creating every day!',
    mood: '🔥',
    league: 'SILVER',
    avatar: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=d946ef&color=fff&size=200',
    stats: {
      totalXP: 1120,
      weeklyXP: 280,
      monthlyXP: 1020,
      streak: 7,
      longestStreak: 12,
      tasksCompleted: 52,
      lessonsCompleted: 21,
      level: 3,
      coins: 230,
      gems: 6,
      crowns: 21,
      combo: 3,
      maxCombo: 8,
      studyTime: 1450,
      completionRate: 87,
      friendsCount: 5,
      groupsCount: 2,
      achievementsCount: 4,
      challengesCompleted: 9,
      postsCount: 15,
      reactionsReceived: 78
    }
  },
  {
    email: 'daniel.wilson@example.com',
    password: 'password123',
    name: 'Daniel Wilson',
    username: 'danielw',
    bio: 'Fitness & Learning | Double the gains 💪',
    status: 'No excuses, just progress!',
    mood: '🚀',
    league: 'PLATINUM',
    avatar: 'https://ui-avatars.com/api/?name=Daniel+Wilson&background=ec4899&color=fff&size=200',
    stats: {
      totalXP: 3650,
      weeklyXP: 520,
      monthlyXP: 2100,
      streak: 18,
      longestStreak: 28,
      tasksCompleted: 128,
      lessonsCompleted: 48,
      level: 7,
      coins: 650,
      gems: 18,
      crowns: 48,
      combo: 7,
      maxCombo: 18,
      studyTime: 3890,
      completionRate: 93,
      friendsCount: 12,
      groupsCount: 4,
      achievementsCount: 10,
      challengesCompleted: 22,
      postsCount: 34,
      reactionsReceived: 234
    }
  },
  {
    email: 'sophia.lee@example.com',
    password: 'password123',
    name: 'Sophia Lee',
    username: 'sophial',
    bio: 'Aspiring entrepreneur | Lifelong student',
    status: 'Learning to build my dreams!',
    mood: '🎯',
    league: 'BRONZE',
    avatar: 'https://ui-avatars.com/api/?name=Sophia+Lee&background=f97316&color=fff&size=200',
    stats: {
      totalXP: 420,
      weeklyXP: 150,
      monthlyXP: 420,
      streak: 3,
      longestStreak: 5,
      tasksCompleted: 23,
      lessonsCompleted: 9,
      level: 1,
      coins: 85,
      gems: 2,
      crowns: 9,
      combo: 2,
      maxCombo: 4,
      studyTime: 560,
      completionRate: 82,
      friendsCount: 3,
      groupsCount: 1,
      achievementsCount: 2,
      challengesCompleted: 4,
      postsCount: 6,
      reactionsReceived: 34
    }
  },
  {
    email: 'ryan.taylor@example.com',
    password: 'password123',
    name: 'Ryan Taylor',
    username: 'ryant',
    bio: 'Gamer turned coder | Level up IRL',
    status: 'Grinding daily quests!',
    mood: '😊',
    league: 'GOLD',
    avatar: 'https://ui-avatars.com/api/?name=Ryan+Taylor&background=06b6d4&color=fff&size=200',
    stats: {
      totalXP: 2890,
      weeklyXP: 460,
      monthlyXP: 1950,
      streak: 11,
      longestStreak: 20,
      tasksCompleted: 98,
      lessonsCompleted: 38,
      level: 6,
      coins: 520,
      gems: 14,
      crowns: 38,
      combo: 6,
      maxCombo: 14,
      studyTime: 2670,
      completionRate: 91,
      friendsCount: 9,
      groupsCount: 4,
      achievementsCount: 8,
      challengesCompleted: 18,
      postsCount: 28,
      reactionsReceived: 167
    }
  },
  {
    email: 'mia.anderson@example.com',
    password: 'password123',
    name: 'Mia Anderson',
    username: 'miaa',
    bio: 'Music & Math | Finding patterns everywhere 🎵',
    status: 'Harmony in learning!',
    mood: '💪',
    league: 'SILVER',
    avatar: 'https://ui-avatars.com/api/?name=Mia+Anderson&background=10b981&color=fff&size=200',
    stats: {
      totalXP: 1450,
      weeklyXP: 310,
      monthlyXP: 1350,
      streak: 9,
      longestStreak: 14,
      tasksCompleted: 61,
      lessonsCompleted: 24,
      level: 3,
      coins: 290,
      gems: 7,
      crowns: 24,
      combo: 4,
      maxCombo: 9,
      studyTime: 1780,
      completionRate: 89,
      friendsCount: 7,
      groupsCount: 3,
      achievementsCount: 6,
      challengesCompleted: 11,
      postsCount: 20,
      reactionsReceived: 112
    }
  }
];

// Function to create a single user
async function createUser(userData) {
  try {
    console.log(`Creating user: ${userData.name}...`);
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const uid = userCredential.user.uid;
    
    console.log(`✓ Auth created for ${userData.name} (${uid})`);
    
    // Use batch for atomic writes
    const batch = writeBatch(db);
    
    // Main user document
    const userRef = doc(db, 'users', uid);
    batch.set(userRef, {
      uid,
      email: userData.email,
      name: userData.name,
      username: userData.username,
      avatar: userData.avatar,
      bio: userData.bio,
      status: userData.status,
      mood: userData.mood,
      league: userData.league,
      isOnline: true,
      isPremium: false,
      isVerified: false,
      interests: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // User stats subcollection
    const statsRef = doc(db, 'users', uid, 'stats', 'current');
    batch.set(statsRef, {
      uid,
      ...userData.stats,
      lastStreakDate: serverTimestamp(),
      rank: 0,
      weeklyRank: 0,
      monthlyRank: 0
    });
    
    // User settings subcollection
    const settingsRef = doc(db, 'users', uid, 'settings', 'preferences');
    batch.set(settingsRef, {
      uid,
      notifications: {
        email: true,
        push: true,
        friendRequests: true,
        messages: true,
        achievements: true,
        challenges: true,
        groupActivity: true,
        weeklyReport: true
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        showActivity: true,
        allowFriendRequests: true,
        allowMessages: 'everyone'
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        dailyGoalXP: 100,
        studyReminder: true,
        reminderTime: '09:00'
      }
    });
    
    // Commit batch
    await batch.commit();
    
    console.log(`✅ Successfully created: ${userData.name}\n`);
    
    return { uid, ...userData };
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User ${userData.email} already exists, skipping...\n`);
      return null;
    }
    console.error(`❌ Error creating ${userData.name}:`, error.message);
    throw error;
  }
}

// Function to create friendships between users
async function createFriendships(createdUsers) {
  console.log('\n📋 Creating friendships...\n');
  
  try {
    const batch = writeBatch(db);
    let friendshipCount = 0;
    
    // Create friendships for first 5 users (interconnected network)
    const friendshipPairs = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 2], [1, 3], [1, 5],
      [2, 4], [2, 6],
      [3, 4], [3, 7],
      [4, 5], [4, 8],
      [5, 6], [5, 9],
      [6, 7],
      [7, 8],
      [8, 9]
    ];
    
    for (const [idx1, idx2] of friendshipPairs) {
      if (createdUsers[idx1] && createdUsers[idx2]) {
        const user1 = createdUsers[idx1];
        const user2 = createdUsers[idx2];
        
        // Create friendship document
        const friendshipRef = doc(db, 'friendships', `${user1.uid}_${user2.uid}`);
        batch.set(friendshipRef, {
          id: `${user1.uid}_${user2.uid}`,
          userId1: user1.uid,
          userId2: user2.uid,
          status: 'accepted',
          createdAt: serverTimestamp(),
          acceptedAt: serverTimestamp()
        });
        
        friendshipCount++;
      }
    }
    
    await batch.commit();
    console.log(`✅ Created ${friendshipCount} friendships\n`);
    
  } catch (error) {
    console.error('❌ Error creating friendships:', error.message);
  }
}

// Function to create sample groups
async function createGroups() {
  console.log('\n📋 Creating sample groups...\n');
  
  const groups = [
    {
      id: 'coding-masters',
      name: 'Coding Masters',
      description: 'Learn programming together',
      icon: '💻',
      category: 'Technology',
      memberCount: 156,
      activeNow: 23,
      creatorId: 'system'
    },
    {
      id: 'language-learners',
      name: 'Language Learners',
      description: 'Master new languages',
      icon: '🌍',
      category: 'Languages',
      memberCount: 234,
      activeNow: 45,
      creatorId: 'system'
    },
    {
      id: 'fitness-warriors',
      name: 'Fitness Warriors',
      description: 'Get fit together',
      icon: '💪',
      category: 'Health',
      memberCount: 189,
      activeNow: 34,
      creatorId: 'system'
    },
    {
      id: 'book-club',
      name: 'Book Club',
      description: 'Read and discuss books',
      icon: '📚',
      category: 'Reading',
      memberCount: 167,
      activeNow: 28,
      creatorId: 'system'
    },
    {
      id: 'creative-minds',
      name: 'Creative Minds',
      description: 'Share creative projects',
      icon: '🎨',
      category: 'Arts',
      memberCount: 142,
      activeNow: 19,
      creatorId: 'system'
    }
  ];
  
  try {
    const batch = writeBatch(db);
    
    for (const group of groups) {
      const groupRef = doc(db, 'groups', group.id);
      batch.set(groupRef, {
        ...group,
        createdAt: serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log(`✅ Created ${groups.length} groups\n`);
    
  } catch (error) {
    console.error('❌ Error creating groups:', error.message);
  }
}

// Function to create sample challenges
async function createChallenges() {
  console.log('\n📋 Creating sample challenges...\n');
  
  const challenges = [
    {
      id: 'daily-streak-7',
      title: '7-Day Streak',
      description: 'Complete tasks for 7 days in a row',
      icon: '🔥',
      type: 'DAILY',
      difficulty: 'EASY',
      target: 7,
      reward: 100,
      rewardType: 'XP',
      participants: 342,
      timeLeft: '5d 12h',
      isActive: true
    },
    {
      id: 'complete-50-tasks',
      title: 'Task Master',
      description: 'Complete 50 tasks this month',
      icon: '✅',
      type: 'MONTHLY',
      difficulty: 'MEDIUM',
      target: 50,
      reward: 500,
      rewardType: 'XP',
      participants: 234,
      timeLeft: '15d 3h',
      isActive: true
    },
    {
      id: 'learn-10-lessons',
      title: 'Knowledge Seeker',
      description: 'Complete 10 lessons',
      icon: '📚',
      type: 'WEEKLY',
      difficulty: 'EASY',
      target: 10,
      reward: 250,
      rewardType: 'XP',
      participants: 456,
      timeLeft: '3d 8h',
      isActive: true
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Make 5 new friends',
      icon: '🦋',
      type: 'MONTHLY',
      difficulty: 'EASY',
      target: 5,
      reward: 200,
      rewardType: 'XP',
      participants: 189,
      timeLeft: '20d 5h',
      isActive: true
    },
    {
      id: 'study-marathon',
      title: 'Study Marathon',
      description: 'Study for 10 hours this week',
      icon: '⏱️',
      type: 'WEEKLY',
      difficulty: 'HARD',
      target: 600,
      reward: 1000,
      rewardType: 'XP',
      participants: 123,
      timeLeft: '4d 16h',
      isActive: true
    }
  ];
  
  try {
    const batch = writeBatch(db);
    
    for (const challenge of challenges) {
      const challengeRef = doc(db, 'challenges', challenge.id);
      batch.set(challengeRef, {
        ...challenge,
        createdAt: serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log(`✅ Created ${challenges.length} challenges\n`);
    
  } catch (error) {
    console.error('❌ Error creating challenges:', error.message);
  }
}

// Main execution function
async function createAllSampleData() {
  console.log('\n🚀 Starting sample data creation...\n');
  console.log('=' .repeat(50));
  
  try {
    // Create users
    console.log('\n👥 Creating users...\n');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const user = await createUser(userData);
      if (user) {
        createdUsers.push(user);
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✅ Created ${createdUsers.length} users successfully!`);
    
    // Create friendships
    await createFriendships(createdUsers);
    
    // Create groups
    await createGroups();
    
    // Create challenges
    await createChallenges();
    
    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 ALL SAMPLE DATA CREATED SUCCESSFULLY!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Friendships: Created`);
    console.log(`   - Groups: 5`);
    console.log(`   - Challenges: 5`);
    console.log('\n💡 You can now log in with any user:');
    console.log('   Email: [user-email]');
    console.log('   Password: password123\n');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
createAllSampleData();