import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const initializeNewUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      name: userData.name || 'New User',
      username: userData.username || `@user_${userId.substring(0, 6)}`,
      email: userData.email,
      avatar: userData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      bio: 'New to Purple Learning Hub',
      status: 'Ready to learn!',
      mood: '🚀',
      league: 'BRONZE',
      isOnline: true,
      friends: [],
      nameLower: (userData.name || 'New User').toLowerCase(),
      usernameLower: (userData.username || `@user_${userId.substring(0, 6)}`).toLowerCase(),
      stats: {
        totalXP: 0,
        weeklyXP: 0,
        monthlyXP: 0,
        streak: 0,
        longestStreak: 0,
        tasksCompleted: 0,
        lessonsCompleted: 0,
        level: 1,
        coins: 0,
        gems: 0,
        crowns: 0,
        combo: 0,
        studyTime: 0,
        completionRate: 0,
        rank: 0,
        weeklyRank: 0,
        friendsCount: 0,
        groupsCount: 0,
        achievementsCount: 0,
        challengesCompleted: 0,
        challengesJoined: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('User initialized successfully');
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
};