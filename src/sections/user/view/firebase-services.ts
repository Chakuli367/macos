// ============================================
// COMPLETE FIREBASE BACKEND - PURPLE LEARNING HUB
// All Services with Error Handling & Real-time Support
// ============================================

// ============================================
// 1. FIREBASE CONFIGURATION
// ============================================

// firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { 
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { 
  getDatabase,
  ref as dbRef,
  set,
  onValue,
  onDisconnect
} from 'firebase/database';

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);
export const rtdb = getDatabase(app);

// Enable offline persistence


// ============================================
// 2. AUTHENTICATION SERVICE
// ============================================
// Add this to your lessonService.ts file

export async function getUserStats(userId: string) {
  try {
    const ref = doc(db, "users", userId, "datedcourses", "social_skills");
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      return {
        completedLessons: 0,
        totalLessons: 5,
        xpEarned: 0,
        streak: 0,
        timeInvested: '0h'
      };
    }

    const data = snap.data();
    const days = Array.isArray(data?.task_overview?.days) ? data.task_overview.days : [];
    
    // Calculate completed lessons
    const completedLessons = days.filter(d => d.completed === true).length;
    
    // Calculate total XP earned from your xp field
    const xpEarned = data.xp || 0;
    
    // Get streak from your streak field
    const streak = data.streak || 0;
    
    // Calculate time invested from task timeSpent
    const totalMinutes = days.reduce((total, day) => {
      const dayTime = day.tasks?.reduce((dayTotal, task) => {
        return dayTotal + (task.timeSpent || 0);
      }, 0) || 0;
      return total + dayTime;
    }, 0);
    
    const hoursInvested = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const timeInvested = hoursInvested > 0 
      ? `${hoursInvested}h ${remainingMinutes}m` 
      : totalMinutes > 0 
      ? `${remainingMinutes}m`
      : '0h';

    return {
      completedLessons,
      totalLessons: days.length || 5,
      xpEarned,
      streak,
      timeInvested
    };
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      completedLessons: 0,
      totalLessons: 5,
      xpEarned: 0,
      streak: 0,
      timeInvested: '0h'
    };
  }
}


export const authService = {

  
  // Sign up new user
  async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      if (userData.name) {
        await updateProfile(user, { displayName: userData.name });
      }
      
      // Create user profile in Firestore
      await userService.createUser(user.uid, {
        email,
        name: userData.name,
        username: userData.username,
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
        bio: userData.bio || '',
        status: 'New to the community!',
        mood: '🚀',
        league: 'BRONZE'
      });
      
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update online status
      await userService.updateOnlineStatus(userCredential.user.uid, true);
      
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        await userService.updateOnlineStatus(userId, false);
      }
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};

// ============================================
// 3. USER SERVICE (COMPLETE)
// ============================================

export const userService = {
  // Create new user profile
  async createUser(uid, userData) {
    try {
      const batch = writeBatch(db);
      
      // Main user document
      const userRef = doc(db, 'users', uid);
      batch.set(userRef, {
        uid,
        ...userData,
        isOnline: true,
        isPremium: false,
        isVerified: false,
        interests: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // User stats
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      batch.set(statsRef, {
        uid,
        totalXP: 0,
        weeklyXP: 0,
        monthlyXP: 0,
        streak: 0,
        longestStreak: 0,
        lastStreakDate: null,
        tasksCompleted: 0,
        lessonsCompleted: 0,
        level: 1,
        coins: 0,
        gems: 0,
        crowns: 0,
        combo: 0,
        maxCombo: 0,
        studyTime: 0,
        completionRate: 0,
        rank: 0,
        weeklyRank: 0,
        monthlyRank: 0,
        friendsCount: 0,
        groupsCount: 0,
        achievementsCount: 0,
        challengesCompleted: 0,
        postsCount: 0,
        reactionsReceived: 0
      });

       
      
      // User settings
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
      
      await batch.commit();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUser(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get complete user profile with stats and settings
  async getUserComplete(uid) {
    try {
      const [userSnap, statsSnap, settingsSnap] = await Promise.all([
        getDoc(doc(db, 'users', uid)),
        getDoc(doc(db, 'users', uid, 'stats', 'current')),
        getDoc(doc(db, 'users', uid, 'settings', 'preferences'))
      ]);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data(),
          stats: statsSnap.exists() ? statsSnap.data() : {},
          settings: settingsSnap.exists() ? settingsSnap.data() : {}
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting complete user:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUser(uid, updates) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update user stats
  async updateStats(uid, statsUpdate) {
    try {
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      await updateDoc(statsRef, statsUpdate);
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  // Add XP to user
  async addXP(uid, xpAmount) {
    try {
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      await updateDoc(statsRef, {
        totalXP: increment(xpAmount),
        weeklyXP: increment(xpAmount),
        monthlyXP: increment(xpAmount)
      });
      
      // Check for level up
      await this.checkLevelUp(uid);
      
      // Check for league promotion
      await leagueService.updateUserLeague(uid);
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  },

  // Check and update level
  async checkLevelUp(uid) {
    try {
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const totalXP = statsSnap.data().totalXP;
        const currentLevel = statsSnap.data().level;
        const newLevel = Math.floor(totalXP / 500) + 1; // 500 XP per level
        
        if (newLevel > currentLevel) {
          await updateDoc(statsRef, { level: newLevel });
          
          await notificationService.create(uid, {
            type: 'achievement',
            message: `Level Up! You reached Level ${newLevel}!`,
            relatedId: uid,
            icon: '⬆️'
          });
          
          // Award level up rewards
          await this.addCoins(uid, newLevel * 10);
        }
      }
    } catch (error) {
      console.error('Error checking level up:', error);
      throw error;
    }
  },

  // Add coins
  async addCoins(uid, amount) {
    try {
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      await updateDoc(statsRef, {
        coins: increment(amount)
      });
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  },

  // Spend coins
  async spendCoins(uid, amount) {
    try {
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists() && statsSnap.data().coins >= amount) {
        await updateDoc(statsRef, {
          coins: increment(-amount)
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error spending coins:', error);
      throw error;
    }
  },

  // Update streak
  async updateStreak(uid) {
    try {
      const statsRef = doc(db, 'users', uid, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        const lastDate = data.lastStreakDate?.toDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (lastDate) {
          const lastDateMidnight = new Date(lastDate);
          lastDateMidnight.setHours(0, 0, 0, 0);
          const diffTime = today - lastDateMidnight;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            // Continue streak
            const newStreak = (data.streak || 0) + 1;
            await updateDoc(statsRef, {
              streak: newStreak,
              longestStreak: Math.max(newStreak, data.longestStreak || 0),
              lastStreakDate: serverTimestamp()
            });
          } else if (diffDays > 1) {
            // Reset streak
            await updateDoc(statsRef, {
              streak: 1,
              lastStreakDate: serverTimestamp()
            });
          }
        } else {
          // First day
          await updateDoc(statsRef, {
            streak: 1,
            longestStreak: 1,
            lastStreakDate: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  // Get user's friends
  async getFriends(uid) {
    try {
      const friendshipsQuery1 = query(
        collection(db, 'friendships'),
        where('status', '==', 'accepted'),
        where('userId1', '==', uid)
      );
      
      const friendshipsQuery2 = query(
        collection(db, 'friendships'),
        where('status', '==', 'accepted'),
        where('userId2', '==', uid)
      );
      
      const [snap1, snap2] = await Promise.all([
        getDocs(friendshipsQuery1),
        getDocs(friendshipsQuery2)
      ]);
      
      const friendIds = [
        ...snap1.docs.map(doc => doc.data().userId2),
        ...snap2.docs.map(doc => doc.data().userId1)
      ];
      
      const friends = await Promise.all(
        friendIds.map(id => this.getUserWithStats(id))
      );
      
      return friends.filter(f => f !== null);
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  },

  // Get user with stats
  async getUserWithStats(uid) {
    try {
      const [userSnap, statsSnap] = await Promise.all([
        getDoc(doc(db, 'users', uid)),
        getDoc(doc(db, 'users', uid, 'stats', 'current'))
      ]);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data(),
          stats: statsSnap.exists() ? statsSnap.data() : {}
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user with stats:', error);
      throw error;
    }
  },

  // Search users
 // Search users
async searchUsers(searchQuery, limitCount = 20) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('username', '>=', searchQuery.toLowerCase()),
      where('username', '<=', searchQuery.toLowerCase() + '\uf8ff'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const results = [];
    
    for (let i = 0; i < snapshot.docs.length; i++) {
      const userDoc = snapshot.docs[i];
      const statsSnap = await getDoc(doc(db, 'users', userDoc.id, 'stats', 'current'));
      
      results.push({
        id: userDoc.id,
        userId: userDoc.id,
        name: userDoc.data().name,
        avatar: userDoc.data().avatar,
        username: userDoc.data().username,
        bio: userDoc.data().bio || '',
        league: userDoc.data().league || 'BRONZE',
        isOnline: userDoc.data().isOnline || false,
        stats: {
          totalXP: statsSnap.exists() ? (statsSnap.data().totalXP || 0) : 0,
          weeklyXP: statsSnap.exists() ? (statsSnap.data().weeklyXP || 0) : 0,
          streak: statsSnap.exists() ? (statsSnap.data().streak || 0) : 0,
          level: statsSnap.exists() ? (statsSnap.data().level || 1) : 1,
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
},

  // Update weekly ranks (should be called by a scheduled job)
  async updateWeeklyRanks() {
    try {
      const leaderboard = await this.getWeeklyLeaderboard(1000);
      
      const batch = writeBatch(db);
      leaderboard.forEach((user) => {
        const statsRef = doc(db, 'users', user.userId, 'stats', 'current');
        batch.update(statsRef, { weeklyRank: user.rank });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error updating weekly ranks:', error);
      throw error;
    }
  },

  // Reset weekly XP (should be called weekly)
  async resetWeeklyXP() {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        const statsRef = doc.ref.collection('stats').doc('current');
        batch.update(statsRef, { weeklyXP: 0 });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error resetting weekly XP:', error);
      throw error;
    }
  },

  // Helper: Get week number
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }
};

// ============================================
// 12. LEAGUE SERVICE (COMPLETE)
// ============================================

export const leagueService = {
  leagues: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'],
  
  thresholds: {
    BRONZE: 0,
    SILVER: 500,
    GOLD: 1000,
    PLATINUM: 2000,
    DIAMOND: 5000
  },

  // Calculate user league
  calculateLeague(totalXP) {
    if (totalXP >= this.thresholds.DIAMOND) return 'DIAMOND';
    if (totalXP >= this.thresholds.PLATINUM) return 'PLATINUM';
    if (totalXP >= this.thresholds.GOLD) return 'GOLD';
    if (totalXP >= this.thresholds.SILVER) return 'SILVER';
    return 'BRONZE';
  },

  // Update user league
  async updateUserLeague(userId) {
    try {
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const totalXP = statsSnap.data().totalXP;
        const user = await userService.getUser(userId);
        const currentLeague = user?.league;
        const newLeague = this.calculateLeague(totalXP);
        
        if (currentLeague !== newLeague) {
          await userService.updateUser(userId, { league: newLeague });
          
          await notificationService.create(userId, {
            type: 'achievement',
            message: `Promoted to ${newLeague} League!`,
            relatedId: userId,
            icon: '🏆'
          });
          
          // Award league promotion rewards
          const leagueIndex = this.leagues.indexOf(newLeague);
          const xpReward = (leagueIndex + 1) * 100;
          const coinReward = (leagueIndex + 1) * 25;
          
          await userService.addXP(userId, xpReward);
          await userService.addCoins(userId, coinReward);
        }
      }
    } catch (error) {
      console.error('Error updating user league:', error);
      throw error;
    }
  },

  // Get league leaderboard
  async getLeagueLeaderboard(league, limitCount = 50) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('league', '==', league),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(usersQuery);
      const rankings = [];
      
      for (const userDoc of snapshot.docs) {
        const statsSnap = await getDoc(doc(db, 'users', userDoc.id, 'stats', 'current'));
        
        if (statsSnap.exists()) {
          rankings.push({
            userId: userDoc.id,
            name: userDoc.data().name,
            avatar: userDoc.data().avatar,
            username: userDoc.data().username,
            weeklyXP: statsSnap.data().weeklyXP || 0,
            totalXP: statsSnap.data().totalXP || 0
          });
        }
      }
      
      rankings.sort((a, b) => b.weeklyXP - a.weeklyXP);
      rankings.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      return rankings;
    } catch (error) {
      console.error('Error getting league leaderboard:', error);
      throw error;
    }
  }
};

// ============================================
// 13. STORAGE SERVICE (COMPLETE)
// ============================================

export const storageService = {
  // Upload avatar
  async uploadAvatar(userId, file) {
    try {
      const avatarRef = ref(storage, `avatars/${userId}/${Date.now()}_${file.name}`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);
      
      await userService.updateUser(userId, { avatar: url });
      
      return url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Upload post image
  async uploadPostImage(userId, file) {
    try {
      const imageRef = ref(storage, `posts/${userId}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      
      return url;
    } catch (error) {
      console.error('Error uploading post image:', error);
      throw error;
    }
  },

  // Upload group image
  async uploadGroupImage(groupId, file) {
    try {
      const imageRef = ref(storage, `groups/${groupId}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      
      return url;
    } catch (error) {
      console.error('Error uploading group image:', error);
      throw error;
    }
  },

  // Upload message attachment
  async uploadMessageAttachment(conversationId, file) {
    try {
      const attachmentRef = ref(storage, `messages/${conversationId}/${Date.now()}_${file.name}`);
      await uploadBytes(attachmentRef, file);
      const url = await getDownloadURL(attachmentRef);
      
      return url;
    } catch (error) {
      console.error('Error uploading message attachment:', error);
      throw error;
    }
  },

  // Delete file
  async deleteFile(fileUrl) {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// ============================================
// 14. ANALYTICS SERVICE
// ============================================

export const analyticsService = {
  // Track user action
  async trackAction(userId, action, metadata = {}) {
    try {
      const actionRef = doc(collection(db, 'analytics', userId, 'actions'));
      await setDoc(actionRef, {
        id: actionRef.id,
        userId,
        action,
        metadata,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking action:', error);
      throw error;
    }
  },

  // Get user analytics
  async getUserAnalytics(userId, startDate, endDate) {
    try {
      const actionsQuery = query(
        collection(db, 'analytics', userId, 'actions'),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(actionsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  },

  // Get weekly report
  async getWeeklyReport(userId) {
    try {
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (!statsSnap.exists()) return null;
      
      const stats = statsSnap.data();
      const achievements = await achievementService.getUserAchievements(userId);
      
      return {
        weeklyXP: stats.weeklyXP || 0,
        tasksCompleted: stats.tasksCompleted || 0,
        lessonsCompleted: stats.lessonsCompleted || 0,
        streak: stats.streak || 0,
        studyTime: stats.studyTime || 0,
        newAchievements: achievements.filter(a => {
          const earnedDate = a.earnedAt?.toDate();
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return earnedDate >= weekAgo;
        }).length,
        rank: stats.weeklyRank || 0
      };
    } catch (error) {
      console.error('Error getting weekly report:', error);
      throw error;
    }
  }
};

// ============================================
// 15. REAL-TIME PRESENCE SERVICE
// ============================================

export const presenceService = {
  // Set user online
  async setUserOnline(userId) {
    try {
      const userStatusRef = dbRef(rtdb, `status/${userId}`);
      const isOnlineForDatabase = {
        state: 'online',
        lastChanged: Date.now()
      };
      
      const isOfflineForDatabase = {
        state: 'offline',
        lastChanged: Date.now()
      };
      
      // Create a reference to the special '.info/connected' path
      const connectedRef = dbRef(rtdb, '.info/connected');
      
      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          // Set online status
          set(userStatusRef, isOnlineForDatabase);
          
          // Set offline status when user disconnects
          onDisconnect(userStatusRef).set(isOfflineForDatabase);
        }
      });
      
      // Also update Firestore
      await userService.updateOnlineStatus(userId, true);
    } catch (error) {
      console.error('Error setting user online:', error);
      throw error;
    }
  },

  // Listen to user presence
  listenToUserPresence(userId, callback) {
    const userStatusRef = dbRef(rtdb, `status/${userId}`);
    
    return onValue(userStatusRef, (snapshot) => {
      const status = snapshot.val();
      callback(status);
    });
  },

  // Get online friends count
  async getOnlineFriendsCount(userId) {
    try {
      const friends = await userService.getFriends(userId);
      let onlineCount = 0;
      
      for (const friend of friends) {
        if (friend.isOnline) {
          onlineCount++;
        }
      }
      
      return onlineCount;
    } catch (error) {
      console.error('Error getting online friends count:', error);
      throw error;
    }
  }
};

// ============================================
// 16. SEARCH SERVICE
// ============================================

export const searchService = {
  // Search everything
  async searchAll(searchQuery, limitCount = 20) {
    try {
      const [users, groups] = await Promise.all([
        userService.searchUsers(searchQuery, limitCount),
        this.searchGroups(searchQuery, limitCount)
      ]);
      
      return {
        users,
        groups
      };
    } catch (error) {
      console.error('Error searching all:', error);
      throw error;
    }
  },

  // Search groups
  async searchGroups(searchQuery, limitCount = 20) {
    try {
      const groupsRef = collection(db, 'groups');
      const q = query(
        groupsRef,
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error searching groups:', error);
      throw error;
    }
  }
};

// ============================================
// 17. TASK SERVICE
// ============================================

export const taskService = {
  // Create task
  async createTask(userId, taskData) {
    try {
      const taskRef = doc(collection(db, 'users', userId, 'tasks'));
      await setDoc(taskRef, {
        id: taskRef.id,
        userId,
        ...taskData,
        completed: false,
        createdAt: serverTimestamp()
      });
      return taskRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get user tasks
  async getUserTasks(userId) {
    try {
      const tasksQuery = query(
        collection(db, 'users', userId, 'tasks'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user tasks:', error);
      throw error;
    }
  },

  // Complete task
  async completeTask(userId, taskId) {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, {
      completed: true,
      completedAt: serverTimestamp()
    });
    
    // Update stats
    const statsRef = doc(db, 'users', userId, 'stats', 'current');
    await updateDoc(statsRef, {
      tasksCompleted: increment(1)
    });
    
    // Add XP
    await userService.addXP(userId, 10);
    
    // Update streak
    await userService.updateStreak(userId);
    
    // ✅ Auto-track challenge progress
    await challengeService.autoTrackProgress(userId, 'task_completed');
    
    // Create activity
    const task = await getDoc(taskRef);
    await activityService.create(userId, {
      action: 'completed',
      target: task.data().title,
      targetType: 'task',
      icon: '✅',
      color: '#8b5cf6'
    });
    
    // Check achievements
    const stats = (await getDoc(statsRef)).data();
    await achievementService.checkAchievements(userId, stats);
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
},



  // Delete task
  async deleteTask(userId, taskId) {
    try {
      const taskRef = doc(db, 'users', userId, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Update task
  async updateTask(userId, taskId, updates) {
    try {
      const taskRef = doc(db, 'users', userId, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
};

// ============================================
// 18. LESSON SERVICE
// ============================================

export const lessonService = {
  // Create lesson
  async createLesson(lessonData) {
    try {
      const lessonRef = doc(collection(db, 'lessons'));
      await setDoc(lessonRef, {
        id: lessonRef.id,
        ...lessonData,
        createdAt: serverTimestamp()
      });
      return lessonRef.id;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Get all lessons
  async getAllLessons() {
    try {
      const lessonsQuery = query(
        collection(db, 'lessons'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(lessonsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting lessons:', error);
      throw error;
    }
  },

  // Complete lesson
  async completeLesson(userId, lessonId) {
    try {
      const completionRef = doc(db, 'users', userId, 'completedLessons', lessonId);
      await setDoc(completionRef, {
        lessonId,
        completedAt: serverTimestamp()
      });
      
      // Update stats
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        lessonsCompleted: increment(1)
      });
      
      // Add XP
      await userService.addXP(userId, 50);
      
      // Add crown
      await updateDoc(statsRef, {
        crowns: increment(1)
      });
      
      // Create activity
      const lesson = await getDoc(doc(db, 'lessons', lessonId));
      await activityService.create(userId, {
        action: 'completed',
        target: lesson.data().title,
        targetType: 'lesson',
        icon: '📚',
        color: '#a78bfa'
      });
      
      // Check achievements
      const stats = (await getDoc(statsRef)).data();
      await achievementService.checkAchievements(userId, stats);
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  },

  // Get user progress
  async getUserProgress(userId) {
    try {
      const completedQuery = query(
        collection(db, 'users', userId, 'completedLessons')
      );
      const snapshot = await getDocs(completedQuery);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }
};

// ============================================
// 19. REWARD SERVICE
// ============================================

export const rewardService = {
  // Daily reward
  async claimDailyReward(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return null;
      
      const lastClaim = userSnap.data().lastDailyReward?.toDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (lastClaim) {
        const lastClaimDate = new Date(lastClaim);
        lastClaimDate.setHours(0, 0, 0, 0);
        
        if (lastClaimDate.getTime() === today.getTime()) {
          throw new Error('Daily reward already claimed today');
        }
      }
      
      // Award daily reward
      const xpReward = 50;
      const coinReward = 25;
      
      await userService.addXP(userId, xpReward);
      await userService.addCoins(userId, coinReward);
      
      await updateDoc(userRef, {
        lastDailyReward: serverTimestamp()
      });
      
      await notificationService.create(userId, {
        type: 'achievement',
        message: `Daily reward claimed! +${xpReward} XP, +${coinReward} coins`,
        relatedId: userId,
        icon: '🎁'
      });
      
      return { xp: xpReward, coins: coinReward };
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      throw error;
    }
  },

  // Streak bonus
  async calculateStreakBonus(userId) {
    try {
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (!statsSnap.exists()) return 0;
      
      const streak = statsSnap.data().streak || 0;
      
      // Bonus increases with streak
      if (streak >= 30) return 3.0;
      if (streak >= 14) return 2.0;
      if (streak >= 7) return 1.5;
      if (streak >= 3) return 1.2;
      
      return 1.0;
    } catch (error) {
      console.error('Error calculating streak bonus:', error);
      throw error;
    }
  }
};

// ============================================
// 20. EXPORT ALL SERVICES
// ============================================


export const friendshipService = {
  // Send friend request
  async sendRequest(fromUserId, toUserId) {
    try {
      // Check if already friends or request exists
      const existingQuery = query(
        collection(db, 'friendRequests'),
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      );
      const existingSnap = await getDocs(existingQuery);
      
      if (!existingSnap.empty) {
        throw new Error('Friend request already sent');
      }
      
      const requestRef = doc(collection(db, 'friendRequests'));
      await setDoc(requestRef, {
        id: requestRef.id,
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Get sender info
      const sender = await userService.getUser(fromUserId);
      
      await notificationService.create(toUserId, {
        type: 'friend',
        message: `${sender.name} sent you a friend request`,
        relatedId: fromUserId,
        icon: '👥'
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  // Accept friend request
  // Accept friend request
async acceptRequest(requestId) {
  try {
    const requestRef = doc(db, 'friendRequests', requestId);
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      throw new Error('Friend request not found');
    }
    
    const request = requestSnap.data();
    
    if (!request.fromUserId || !request.toUserId) {
      throw new Error('Invalid friend request data');
    }
    
    // Create friendship
    const friendshipRef = doc(collection(db, 'friendships'));
    await setDoc(friendshipRef, {
      id: friendshipRef.id,
      userId1: request.fromUserId,
      userId2: request.toUserId,
      status: 'accepted',
      createdAt: serverTimestamp(),
      acceptedAt: serverTimestamp()
    });
    
    // Update friend counts
    const stats1Ref = doc(db, 'users', request.fromUserId, 'stats', 'current');
    const stats2Ref = doc(db, 'users', request.toUserId, 'stats', 'current');
    
    const [stats1Snap, stats2Snap] = await Promise.all([
      getDoc(stats1Ref),
      getDoc(stats2Ref)
    ]);
    
    if (!stats1Snap.exists()) {
      await setDoc(stats1Ref, { friendsCount: 1 });
    } else {
      await updateDoc(stats1Ref, { friendsCount: increment(1) });
    }
    
    if (!stats2Snap.exists()) {
      await setDoc(stats2Ref, { friendsCount: 1 });
    } else {
      await updateDoc(stats2Ref, { friendsCount: increment(1) });
    }
    
    // Delete request
    await deleteDoc(requestRef);
    
    // Notify sender
    try {
      const accepter = await userService.getUser(request.toUserId);
      if (accepter) {
        await notificationService.create(request.fromUserId, {
          type: 'friend',
          message: `${accepter.name} accepted your friend request`,
          relatedId: request.toUserId,
          icon: '✅'
        });
      }
    } catch (err) {
      console.error('Notification error:', err);
    }
    
    // Check achievements
    try {
      const stats1 = stats1Snap.exists() ? stats1Snap.data() : {};
      const stats2 = stats2Snap.exists() ? stats2Snap.data() : {};
      await achievementService.checkAchievements(request.fromUserId, stats1);
      await achievementService.checkAchievements(request.toUserId, stats2);
    } catch (err) {
      console.error('Achievement check error:', err);
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
},

// Reject friend request
async rejectRequest(requestId) {
  try {
    const requestRef = doc(db, 'friendRequests', requestId);
    await deleteDoc(requestRef);
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
},

// Get pending requests for user
async getPendingRequests(userId) {
  try {
    const requestsQuery = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(requestsQuery);
    
    const requests = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const request = doc.data();
        const fromUser = await userService.getUser(request.fromUserId);
        return {
          id: doc.id,
          ...request,
          fromUser
        };
      })
    );
    
    return requests;
  } catch (error) {
    console.error('Error getting pending requests:', error);
    throw error;
  }
},

// Remove friend
async removeFriend(userId, friendId) {
  try {
    const friendshipsQuery = query(
      collection(db, 'friendships'),
      where('status', '==', 'accepted')
    );
    const snapshot = await getDocs(friendshipsQuery);
    
    const friendship = snapshot.docs.find(doc => {
      const data = doc.data();
      return (data.userId1 === userId && data.userId2 === friendId) ||
             (data.userId1 === friendId && data.userId2 === userId);
    });
    
    if (friendship) {
      await deleteDoc(friendship.ref);
      
      // Update friend counts
      const stats1Ref = doc(db, 'users', userId, 'stats', 'current');
      const stats2Ref = doc(db, 'users', friendId, 'stats', 'current');
      
      await Promise.all([
        updateDoc(stats1Ref, { friendsCount: increment(-1) }),
        updateDoc(stats2Ref, { friendsCount: increment(-1) })
      ]);
    }
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}
};

// ============================================
// 5. MESSAGING SERVICE (COMPLETE)
// ============================================

export const messagingService = {
  // Create or get conversation
  async getOrCreateConversation(userId1, userId2) {
    try {
      const participants = [userId1, userId2].sort();
      
      // Check if conversation exists
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', '==', participants)
      );
      const snapshot = await getDocs(conversationsQuery);
      
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      
      // Create new conversation
      const [user1, user2] = await Promise.all([
        userService.getUser(userId1),
        userService.getUser(userId2)
      ]);
      
      const conversationRef = doc(collection(db, 'conversations'));
      const conversationData = {
        id: conversationRef.id,
        participants,
        participantDetails: {
          [userId1]: {
            name: user1.name,
            avatar: user1.avatar,
            username: user1.username
          },
          [userId2]: {
            name: user2.name,
            avatar: user2.avatar,
            username: user2.username
          }
        },
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: '',
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0
        },
        isTyping: {
          [userId1]: false,
          [userId2]: false
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(conversationRef, conversationData);
      return { id: conversationRef.id, ...conversationData };
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  },

  // Send message
  async sendMessage(conversationId, senderId, content, type = 'text', mediaUrl = null) {
    try {
      const messageRef = doc(collection(db, 'messages', conversationId, 'messages'));
      
      const messageData = {
        id: messageRef.id,
        conversationId,
        senderId,
        content,
        type,
        mediaUrl,
        read: false,
        edited: false,
        deleted: false,
        reactions: {},
        createdAt: serverTimestamp()
      };
      
      await setDoc(messageRef, messageData);
      
      // Update conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationSnap = await getDoc(conversationRef);
      const conversation = conversationSnap.data();
      
      const otherUserId = conversation.participants.find(id => id !== senderId);
      
      await updateDoc(conversationRef, {
        lastMessage: type === 'text' ? content : `[${type}]`,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: senderId,
        [`unreadCount.${otherUserId}`]: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // Send notification
      const sender = await userService.getUser(senderId);
      await notificationService.create(otherUserId, {
        type: 'message',
        message: `${sender.name} sent you a message`,
        relatedId: conversationId,
        icon: '💬'
      });
      
      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get messages
  async getMessages(conversationId, limitCount = 50) {
    try {
      const messagesQuery = query(
        collection(db, 'messages', conversationId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(messagesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Mark messages as read
  async markAsRead(conversationId, userId) {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${userId}`]: 0
      });
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  // Update typing status
  async updateTypingStatus(conversationId, userId, isTyping) {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`isTyping.${userId}`]: isTyping
      });
    } catch (error) {
      console.error('Error updating typing status:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(conversationId, messageId) {
    try {
      const messageRef = doc(db, 'messages', conversationId, 'messages', messageId);
      await updateDoc(messageRef, {
        deleted: true,
        content: '[Message deleted]'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Edit message
  async editMessage(conversationId, messageId, newContent) {
    try {
      const messageRef = doc(db, 'messages', conversationId, 'messages', messageId);
      await updateDoc(messageRef, {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  // React to message
  async reactToMessage(conversationId, messageId, userId, reaction) {
    try {
      const messageRef = doc(db, 'messages', conversationId, 'messages', messageId);
      await updateDoc(messageRef, {
        [`reactions.${userId}`]: reaction
      });
    } catch (error) {
      console.error('Error reacting to message:', error);
      throw error;
    }
  },

  // Get user conversations
  async getUserConversations(userId) {
    try {
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );
      const snapshot = await getDocs(conversationsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  // Listen to messages (real-time)
  listenToMessages(conversationId, callback) {
    const messagesQuery = query(
      collection(db, 'messages', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  },

  // Listen to conversation updates (real-time)
  listenToConversation(conversationId, callback) {
    const conversationRef = doc(db, 'conversations', conversationId);
    
    return onSnapshot(conversationRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      }
    });
  }
};

// ============================================
// 6. GROUP SERVICE (COMPLETE)
// ============================================

export const groupService = {
  // Create group
  async createGroup(creatorId, groupData) {
    try {
      const groupRef = doc(collection(db, 'groups'));
      await setDoc(groupRef, {
        id: groupRef.id,
        ...groupData,
        creatorId,
        memberCount: 1,
        activeNow: 0,
        createdAt: serverTimestamp()
      });
      
      // Add creator as member
      await this.joinGroup(groupRef.id, creatorId);
      return groupRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  // Get group
  async getGroup(groupId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (groupSnap.exists()) {
        return { id: groupSnap.id, ...groupSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  },

  // Get all groups
  async getAllGroups() {
    try {
      const groupsQuery = query(
        collection(db, 'groups'),
        orderBy('memberCount', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(groupsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all groups:', error);
      throw error;
    }
  },

  // Join group
  async joinGroup(groupId, userId) {
    try {
      const memberRef = doc(db, 'groups', groupId, 'members', userId);
      await setDoc(memberRef, {
        userId,
        joinedAt: serverTimestamp(),
        role: 'member'
      });
      
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        memberCount: increment(1)
      });
      
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        groupsCount: increment(1)
      });
      
      // Create activity
      const group = await this.getGroup(groupId);
      await activityService.create(userId, {
        action: 'joined',
        target: group.name,
        targetType: 'group',
        icon: '👥',
        color: '#c084fc'
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  // Leave group
  async leaveGroup(groupId, userId) {
    try {
      const memberRef = doc(db, 'groups', groupId, 'members', userId);
      await deleteDoc(memberRef);
      
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        memberCount: increment(-1)
      });
      
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        groupsCount: increment(-1)
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  },

  // Get group members
  async getGroupMembers(groupId) {
    try {
      const membersQuery = query(collection(db, 'groups', groupId, 'members'));
      const snapshot = await getDocs(membersQuery);
      
      const memberIds = snapshot.docs.map(doc => doc.data().userId);
      const members = await Promise.all(
        memberIds.map(id => userService.getUser(id))
      );
      
      return members.filter(m => m !== null);
    } catch (error) {
      console.error('Error getting group members:', error);
      throw error;
    }
  },

  // Create post in group
  async createPost(groupId, userId, content) {
    try {
      const postRef = doc(collection(db, 'groups', groupId, 'posts'));
      const user = await userService.getUser(userId);
      
      await setDoc(postRef, {
        id: postRef.id,
        groupId,
        userId,
        user: {
          name: user.name,
          avatar: user.avatar,
          username: user.username
        },
        content,
        reactions: {
          fire: 0,
          heart: 0,
          thumbsUp: 0
        },
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update user post count
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        postsCount: increment(1)
      });
      
      return postRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

async createStructuredPost(groupId, userId, postData) {
    try {
      const postRef = doc(collection(db, 'groups', groupId, 'posts'));
      const user = await userService.getUser(userId);
      
      await setDoc(postRef, {
        id: postRef.id,
        groupId,
        userId,
        user: {
          name: user.name,
          avatar: user.avatar,
          username: user.username
        },
        type: 'STRUCTURED',
        structuredContent: postData.content,
        template: postData.template,
        reactions: {
          helpful: 0,
          inspiring: 0,
          relatable: 0
        },
        comments: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // ... rest of the function
    } catch (error) {
      console.error('Error creating structured post:', error);
      throw error;
    }
  },
  
  // 👇 ALSO ADD THIS
  async addComment(groupId, postId, userId, content) {
    try {
      const user = await userService.getUser(userId);
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnap.data();
      const comments = post.comments || [];
      
      const newComment = {
        id: `comment_${Date.now()}`,
        userId,
        user: {
          name: user.name,
          avatar: user.avatar,
          username: user.username
        },
        content,
        createdAt: new Date(),
        reactions: {}
      };
      
      comments.push(newComment);
      
      await updateDoc(postRef, {
        comments,
        commentCount: comments.length,
        updatedAt: serverTimestamp()
      });
      
      // Notify post author if different from commenter
      if (post.userId !== userId) {
        await notificationService.create(post.userId, {
          type: 'group',
          message: `${user.name} commented on your post`,
          relatedId: postId,
          icon: '💬'
        });
      }
      
      return newComment.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

// Add comment to post
async addComment(groupId, postId, userId, content) {
  try {
    const user = await userService.getUser(userId);
    const postRef = doc(db, 'groups', groupId, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const post = postSnap.data();
    const comments = post.comments || [];
    
    const newComment = {
      id: `comment_${Date.now()}`,
      userId,
      user: {
        name: user.name,
        avatar: user.avatar,
        username: user.username
      },
      content,
      createdAt: new Date(),
      reactions: {}
    };
    
    comments.push(newComment);
    
    await updateDoc(postRef, {
      comments,
      commentCount: comments.length,
      updatedAt: serverTimestamp()
    });
    
    // Notify post author if different from commenter
    if (post.userId !== userId) {
      await notificationService.create(post.userId, {
        type: 'group',
        message: `${user.name} commented on your post`,
        relatedId: postId,
        icon: '💬'
      });
    }
    
    return newComment.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
},


  // Get group posts (UPDATED VERSION)
async getGroupPosts(groupId, limitCount = 50) {
  try {
    const postsQuery = query(
      collection(db, 'groups', groupId, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(postsQuery);
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Ensure comments array exists
      if (!data.comments) {
        data.comments = [];
      }
      
      // Ensure reactions object exists with correct structure
      if (!data.reactions) {
        data.reactions = {
          helpful: 0,
          inspiring: 0,
          relatable: 0
        };
      }
      
      // Handle old posts that might have fire/heart reactions
      if (data.reactions.fire !== undefined || data.reactions.heart !== undefined) {
        // Convert old reaction structure to new one
        data.reactions = {
          helpful: data.reactions.thumbsUp || 0,
          inspiring: data.reactions.fire || 0,
          relatable: data.reactions.heart || 0
        };
      }
      
      return {
        id: doc.id,
        ...data
      };
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting group posts:', error);
    throw error;
  }
},

  // Add reaction to post (UPDATED VERSION)
async addReaction(groupId, postId, reactionType) {
  try {
    const postRef = doc(db, 'groups', groupId, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const post = postSnap.data();
    const reactions = post.reactions || {};
    
    // Valid reaction types
    const validReactions = ['helpful', 'inspiring', 'relatable'];
    
    if (!validReactions.includes(reactionType)) {
      throw new Error('Invalid reaction type');
    }
    
    // Increment the reaction
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    
    await updateDoc(postRef, {
      reactions,
      updatedAt: serverTimestamp()
    });
    
    // Update stats for post author
    if (post.userId) {
      const statsRef = doc(db, 'users', post.userId, 'stats', 'current');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        await updateDoc(statsRef, {
          reactionsReceived: increment(1)
        });
      }
    }
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
},

  // Delete post
  async deletePost(groupId, postId) {
    try {
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Edit post
  async editPost(groupId, postId, newContent) {
    try {
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      await updateDoc(postRef, {
        content: newContent,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing post:', error);
      throw error;
    }
  },

  // Create comment on post
  async createComment(groupId, postId, userId, content, parentCommentId = null) {
    try {
      const commentRef = doc(collection(db, 'groups', groupId, 'posts', postId, 'comments'));
      const user = await userService.getUser(userId);
      
      await setDoc(commentRef, {
        id: commentRef.id,
        postId,
        userId,
        user: {
          name: user.name,
          avatar: user.avatar,
          username: user.username
        },
        content,
        reactions: {},
        parentCommentId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Increment comment count
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });
      
      return commentRef.id;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Get comments
  async getComments(groupId, postId, limitCount = 50) {
    try {
      const commentsQuery = query(
        collection(db, 'groups', groupId, 'posts', postId, 'comments'),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(commentsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  // Update group
  async updateGroup(groupId, updates) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  // Delete group
  async deleteGroup(groupId) {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await deleteDoc(groupRef);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

   // Invite user to group
  async inviteToGroup(groupId, inviterId, invitedUserId) {
    try {
      // Check if user is already a member
      const memberRef = doc(db, 'groups', groupId, 'members', invitedUserId);
      const memberSnap = await getDoc(memberRef);
      
      if (memberSnap.exists()) {
        throw new Error('User is already a member of this group');
      }
      
      // Check if invite already exists
      const existingInviteQuery = query(
        collection(db, 'groupInvites'),
        where('groupId', '==', groupId),
        where('invitedUserId', '==', invitedUserId),
        where('status', '==', 'pending')
      );
      const existingSnap = await getDocs(existingInviteQuery);
      
      if (!existingSnap.empty) {
        throw new Error('Invite already sent');
      }
      
      // Create invite
      const inviteRef = doc(collection(db, 'groupInvites'));
      const [group, inviter, invitedUser] = await Promise.all([
        this.getGroup(groupId),
        userService.getUser(inviterId),
        userService.getUser(invitedUserId)
      ]);
      
      await setDoc(inviteRef, {
        id: inviteRef.id,
        groupId,
        groupName: group.name,
        groupIcon: group.icon,
        inviterId,
        inviterName: inviter.name,
        inviterAvatar: inviter.avatar,
        invitedUserId,
        invitedUserName: invitedUser.name,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Send notification
      await notificationService.create(invitedUserId, {
        type: 'group',
        message: `${inviter.name} invited you to join ${group.name}`,
        relatedId: inviteRef.id,
        icon: '👥'
      });
      
      return inviteRef.id;
    } catch (error) {
      console.error('Error inviting to group:', error);
      throw error;
    }
  },

  // Accept group invite
  async acceptGroupInvite(inviteId) {
    try {
      const inviteRef = doc(db, 'groupInvites', inviteId);
      const inviteSnap = await getDoc(inviteRef);
      
      if (!inviteSnap.exists()) {
        throw new Error('Invite not found');
      }
      
      const invite = inviteSnap.data();
      
      if (invite.status !== 'pending') {
        throw new Error('Invite is no longer valid');
      }
      
      // Join the group
      await this.joinGroup(invite.groupId, invite.invitedUserId);
      
      // Update invite status
      await updateDoc(inviteRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
      
      // Notify inviter
      await notificationService.create(invite.inviterId, {
        type: 'group',
        message: `${invite.invitedUserName} accepted your group invite`,
        relatedId: invite.groupId,
        icon: '✅'
      });
      
      return invite.groupId;
    } catch (error) {
      console.error('Error accepting group invite:', error);
      throw error;
    }
  },

  // Decline group invite
  async declineGroupInvite(inviteId) {
    try {
      const inviteRef = doc(db, 'groupInvites', inviteId);
      const inviteSnap = await getDoc(inviteRef);
      
      if (!inviteSnap.exists()) {
        throw new Error('Invite not found');
      }
      
      await updateDoc(inviteRef, {
        status: 'declined',
        declinedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error declining group invite:', error);
      throw error;
    }
  },

  // Get user's pending group invites
  async getUserGroupInvites(userId) {
    try {
      const invitesQuery = query(
        collection(db, 'groupInvites'),
        where('invitedUserId', '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(invitesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user group invites:', error);
      throw error;
    }
  },

  // Get group's pending invites
  async getGroupPendingInvites(groupId) {
    try {
      const invitesQuery = query(
        collection(db, 'groupInvites'),
        where('groupId', '==', groupId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(invitesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting group pending invites:', error);
      throw error;
    }
  },

  // Listen to group posts (real-time)
  listenToGroupPosts(groupId, callback) {
    const postsQuery = query(
      collection(db, 'groups', groupId, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    return onSnapshot(postsQuery, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
  }
};

// ============================================
// 7. CHALLENGE SERVICE (COMPLETE)
// ============================================



// ============================================
// FRIEND CHALLENGE SERVICE
// ============================================

export const challengeService = {
  // Create a friend challenge
  createFriendChallenge: async (fromUserId, toUserId, challengeData) => {
  try {
    // ✅ CRITICAL: Extract and REMOVE the template ID from challengeData
    const { 
      id: templateId,  // Extract template ID
      ...cleanTemplateData  // Everything else WITHOUT the id field
    } = challengeData;
    
    // ✅ Generate Firestore document ID
    const challengeRef = doc(collection(db, 'challenges'));
    const challengeId = challengeRef.id;
    
    console.log('🔍 Creating friend challenge:');
    console.log('   Template ID (not used as document ID):', templateId);
    console.log('   Firestore Document ID (ACTUAL ID):', challengeId);
    
    const [fromUser, toUser] = await Promise.all([
      userService.getUser(fromUserId),
      userService.getUser(toUserId)
    ]);
    
    if (!fromUser || !toUser) {
      throw new Error('Could not find user data');
    }
    
    // ✅ Build challenge object with ONLY Firestore ID
    const challenge = {
      id: challengeId,              // ✅ Firestore document ID (e.g., "3cOJdGTIJq594zVvFXPJ")
      templateId: templateId,        // ✅ Store original template ID for reference (e.g., "task_master")
      fromUserId,
      toUserId,
      fromUser: {
        userId: fromUserId,
        name: fromUser.name,
        avatar: fromUser.avatar,
        username: fromUser.username
      },
      toUser: {
        userId: toUserId,
        name: toUser.name,
        avatar: toUser.avatar,
        username: toUser.username
      },
      ...cleanTemplateData,          // ✅ Spread template data (WITHOUT id field!)
      status: 'pending',
      progress: {
        [fromUserId]: 0,
        [toUserId]: 0
      },
      winner: null,
      createdAt: serverTimestamp(),
      startedAt: null,
      completedAt: null,
      expiresAt: new Date(Date.now() + cleanTemplateData.duration * 24 * 60 * 60 * 1000)
    };
    
    // ✅ Verify the challenge object has correct ID
    console.log('🔍 Challenge object to be saved:');
    console.log('   challenge.id:', challenge.id);
    console.log('   challenge.templateId:', challenge.templateId);
    
    // ✅ Save to Firestore
    await setDoc(challengeRef, challenge);
    console.log('✅ Challenge saved to Firestore with ID:', challengeId);
    
    // ✅ VERIFY the document was saved correctly
    const verifyDoc = await getDoc(challengeRef);
    if (!verifyDoc.exists()) {
      throw new Error('Challenge document was not created');
    }
    
    const savedChallenge = verifyDoc.data();
    console.log('🔍 Verification - Document saved with:');
    console.log('   Firestore doc.id:', verifyDoc.id);
    console.log('   Stored challenge.id field:', savedChallenge.id);
    console.log('   Stored challenge.templateId field:', savedChallenge.templateId);
    
    // ✅ CRITICAL: Use the Firestore document ID (NOT template ID) in notification
    const notificationId = challengeId;  // Use Firestore ID!
    
    console.log('🔍 Sending notification with relatedId:', notificationId);
    
    await notificationService.create(toUserId, {
      type: 'challenge',
      message: `${fromUser.name} challenged you to: ${cleanTemplateData.title}`,
      relatedId: notificationId,  // ✅ This MUST be the Firestore document ID!
      icon: '⚔️'
    });
    
    console.log('✅ Notification created with relatedId:', notificationId);
    
    // Create activity
    await activityService.create(fromUserId, {
      action: 'challenged',
      target: toUser.name,
      targetType: 'friend-challenge',
      icon: '⚔️',
      color: '#f59e0b'
    });
    
    console.log('✅ Challenge creation complete. Document ID:', challengeId);
    
    return challengeId;
  } catch (error) {
    console.error('❌ Error creating friend challenge:', error);
    throw error;
  }

},

 // In friendsService.ts - Replace the acceptChallenge function
acceptChallenge: async (challengeId, userId) => {
  try {
    console.log('🔍 Backend: acceptChallenge called');
    console.log('🔍 challengeId:', challengeId);
    console.log('🔍 userId:', userId);
    
    // Validate inputs
    if (!challengeId || typeof challengeId !== 'string') {
      throw new Error(`Invalid challengeId: ${challengeId}`);
    }
    
    if (!userId || typeof userId !== 'string') {
      throw new Error(`Invalid userId: ${userId}`);
    }
    
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);
    
    console.log('🔍 Challenge exists:', challengeSnap.exists());
    
    if (!challengeSnap.exists()) {
      console.error('❌ Challenge not found in Firestore');
      console.error('❌ Attempted challengeId:', challengeId);
      
      // Try to find ALL challenges to debug
      const allChallengesSnap = await getDocs(collection(db, 'challenges'));
      console.log('🔍 Total challenges in DB:', allChallengesSnap.size);
      console.log('🔍 Available challenge IDs:', allChallengesSnap.docs.map(d => d.id));
      
      throw new Error('Challenge not found');
    }
    
    const challenge = challengeSnap.data();
    console.log('🔍 Challenge data:', challenge);
    
    if (!challenge.fromUserId || !challenge.toUserId) {
      throw new Error('Invalid friend challenge data');
    }
    
    if (challenge.toUserId !== userId) {
      throw new Error('You cannot accept this challenge');
    }
    
    console.log('✅ Validation passed, updating challenge status...');
    
    await updateDoc(challengeRef, {
      status: 'active',
      startedAt: serverTimestamp()
    });
    
    console.log('✅ Challenge updated to active');
    
    // Notify challenger
    await notificationService.create(challenge.fromUserId, {
      type: 'challenge',
      message: `${challenge.toUser.name} accepted your challenge!`,
      relatedId: challengeId,
      icon: '✅'
    });
    
    // Create activities
    await activityService.create(userId, {
      action: 'accepted challenge from',
      target: challenge.fromUser.name,
      targetType: 'friend-challenge',
      icon: '✅',
      color: '#10b981'
    });
    
    console.log('✅ Challenge acceptance complete');
    
  } catch (error) {
    console.error('❌ Error in acceptChallenge:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
},
  

  // Decline challenge
  declineChallenge: async (challengeId, userId) => {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        status: 'declined',
        declinedAt: serverTimestamp()
      });
      
      const challenge = (await getDoc(challengeRef)).data();
      
      // Notify challenger
      await notificationService.create(challenge.fromUserId, {
        type: 'challenge',
        message: `${challenge.toUser.name} declined your challenge`,
        relatedId: challengeId,
        icon: '❌'
      });
      
    } catch (error) {
      console.error('Error declining challenge:', error);
      throw error;
    }
  },

  // Update challenge progress
  updateChallengeProgress: async (challengeId, userId, progressAmount) => {
  try {
    console.log('🔍 Updating challenge progress');
    console.log('🔍 Challenge ID:', challengeId);
    console.log('🔍 User ID:', userId);
    console.log('🔍 Progress Amount:', progressAmount);
    
    // ✅ Validate inputs
    if (!challengeId || typeof challengeId !== 'string') {
      throw new Error(`Invalid challengeId: ${challengeId}`);
    }
    
    if (!userId || typeof userId !== 'string') {
      throw new Error(`Invalid userId: ${userId}`);
    }
    
    if (typeof progressAmount !== 'number' || progressAmount < 0) {
      throw new Error(`Invalid progressAmount: ${progressAmount}`);
    }
    
    // ✅ Check if it's a template ID (contains underscore) - reject it
    if (challengeId.includes('_') || challengeId.includes('-')) {
      console.error('❌ Attempted to use template ID as challenge ID:', challengeId);
      throw new Error('Invalid challenge ID format. This appears to be a template ID, not a challenge document ID.');
    }
    
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);
    
    console.log('🔍 Challenge exists:', challengeSnap.exists());
    
    if (!challengeSnap.exists()) {
      console.error('❌ Challenge not found in Firestore');
      console.error('❌ Attempted challengeId:', challengeId);
      
      // Debug: Show available challenges
      const allChallengesSnap = await getDocs(collection(db, 'challenges'));
      console.log('🔍 Total challenges in DB:', allChallengesSnap.size);
      console.log('🔍 Available challenge IDs:', allChallengesSnap.docs.map(d => d.id));
      
      throw new Error('Challenge not found');
    }
    
    const challenge = challengeSnap.data();
    console.log('🔍 Challenge data:', {
      id: challenge.id,
      templateId: challenge.templateId,
      status: challenge.status,
      fromUserId: challenge.fromUserId,
      toUserId: challenge.toUserId,
      currentProgress: challenge.progress
    });
    
    // ✅ Validate challenge status
    if (challenge.status !== 'active') {
      console.error('❌ Challenge is not active. Current status:', challenge.status);
      throw new Error(`Challenge is not active. Current status: ${challenge.status}`);
    }
    
    // ✅ Validate user is a participant
    if (userId !== challenge.fromUserId && userId !== challenge.toUserId) {
      console.error('❌ User is not a participant in this challenge');
      throw new Error('You are not a participant in this challenge');
    }
    
    // ✅ Calculate new progress
    const currentProgress = challenge.progress?.[userId] || 0;
    const newProgress = currentProgress + progressAmount;
    
    console.log('🔍 Progress update:');
    console.log('   - Current:', currentProgress);
    console.log('   - Adding:', progressAmount);
    console.log('   - New:', newProgress);
    console.log('   - Target:', challenge.target);
    
    // ✅ Prevent negative progress
    if (newProgress < 0) {
      console.error('❌ Progress cannot be negative');
      throw new Error('Progress cannot be negative');
    }
    
    // ✅ Update progress
    await updateDoc(challengeRef, {
      [`progress.${userId}`]: newProgress,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Progress updated successfully');
    
    // ✅ Check if challenge is complete
    if (newProgress >= challenge.target) {
      console.log('🏆 Challenge target reached! Completing challenge...');
      await challengeService.completeChallenge(challengeId, userId);
      console.log('✅ Challenge completed');
      return; // Exit early, completion will send notifications
    }
    
    // ✅ Get opponent info
    const opponentId = userId === challenge.fromUserId ? challenge.toUserId : challenge.fromUserId;
    const opponentProgress = challenge.progress?.[opponentId] || 0;
    
    console.log('🔍 Opponent progress:', opponentProgress);
    
    // ✅ Notify opponent about progress
    try {
      const user = await userService.getUser(userId);
      
      if (user) {
        await notificationService.create(opponentId, {
          type: 'challenge',
          message: `${user.name} made progress on your challenge: ${newProgress}/${challenge.target}`,
          relatedId: challengeId,
          icon: '📊'
        });
        
        console.log('✅ Opponent notified about progress');
      }
    } catch (notifError) {
      console.error('⚠️ Failed to send opponent notification:', notifError);
      // Don't throw - progress was updated successfully
    }
    
    // ✅ Create activity feed entry
    try {
      await activityService.create(userId, {
        action: 'made progress on',
        target: challenge.title,
        targetType: 'friend-challenge',
        icon: '📈',
        color: '#3b82f6',
        metadata: {
          challengeId,
          progress: newProgress,
          target: challenge.target,
          percentage: Math.round((newProgress / challenge.target) * 100)
        }
      });
      
      console.log('✅ Activity created');
    } catch (activityError) {
      console.error('⚠️ Failed to create activity:', activityError);
      // Don't throw - progress was updated successfully
    }
    
    // ✅ Check if opponent also completed
    if (opponentProgress >= challenge.target) {
      console.log('⚠️ Opponent has also completed the challenge');
      // Determine winner based on completion time or other criteria
      // This is handled in completeChallenge function
    }
    
    console.log('✅ Challenge progress update complete');
    
  } catch (error) {
    console.error('❌ Error updating challenge progress:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
},

  // Add this to challengeService
autoTrackProgress: async (userId, actionType) => {
  try {
    console.log('🔍 Auto-tracking challenge progress for action:', actionType);
    
    // Get user's active challenges
    const activeChallengesQuery = query(
      collection(db, 'challenges'),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(activeChallengesQuery);
    
    // Filter challenges where user is a participant
    const userChallenges = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(challenge => 
        challenge.fromUserId === userId || challenge.toUserId === userId
      );
    
    console.log('🔍 Found active challenges:', userChallenges.length);
    
    // Map action types to challenge template IDs
    const actionToChallengeMap = {
      'task_completed': ['task_master'],
      'lesson_completed': ['lesson_sprint'],
      'xp_earned': ['xp_race'],
      'group_post': ['group_participation'],
      'crown_earned': ['crown_collector'],
      'streak_updated': ['streak_battle']
    };
    
    const relevantTemplateIds = actionToChallengeMap[actionType] || [];
    
    if (relevantTemplateIds.length === 0) {
      console.log('⚠️ No challenges map to this action type');
      return;
    }
    
    // Update progress for matching challenges
    for (const challenge of userChallenges) {
      if (relevantTemplateIds.includes(challenge.templateId)) {
        console.log('✅ Updating progress for challenge:', challenge.title);
        
        await challengeService.updateChallengeProgress(
          challenge.id,
          userId,
          1 // Increment by 1
        );
      }
    }
    
  } catch (error) {
    console.error('❌ Error in auto-track progress:', error);
    // Don't throw - this is a background operation
  }
},

// Add this to challengeService object (around line 2200)

// Get user's challenges (replaces getUserFriendChallenges)
getUserChallenges: async (userId) => {
  try {
    console.log('🔍 Getting challenges for user:', userId);
    
    const sentQuery = query(
      collection(db, 'challenges'),
      where('fromUserId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const receivedQuery = query(
      collection(db, 'challenges'),
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const [sentSnap, receivedSnap] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);
    
    const challenges = [
      ...sentSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(), 
        type: 'sent',
        isSender: true 
      })),
      ...receivedSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(), 
        type: 'received',
        isSender: false 
      }))
    ];
    
    // Sort by date (most recent first)
    challenges.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    console.log('✅ Found challenges:', challenges.length);
    
    return challenges;
  } catch (error) {
    console.error('❌ Error getting user challenges:', error);
    throw error;
  }
},


  // Complete challenge
  completeChallenge: async (challengeId, winnerId) => {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      const challengeSnap = await getDoc(challengeRef);
      
      if (!challengeSnap.exists()) return;
      
      const challenge = challengeSnap.data();
      
      await updateDoc(challengeRef, {
        status: 'completed',
        winner: winnerId,
        completedAt: serverTimestamp()
      });
      
      const winner = await userService.getUser(winnerId);
      const loserId = winnerId === challenge.fromUserId ? challenge.toUserId : challenge.fromUserId;
      const loser = await userService.getUser(loserId);
      
      // Award winner
      const winnerXP = challenge.reward?.xp || 100;
      const winnerCoins = challenge.reward?.coins || 50;
      
      await userService.addXP(winnerId, winnerXP);
      await userService.addCoins(winnerId, winnerCoins);
      
      // Award loser (participation)
      await userService.addXP(loserId, Math.floor(winnerXP * 0.3));
      await userService.addCoins(loserId, Math.floor(winnerCoins * 0.3));
      
      // Notifications
      await notificationService.create(winnerId, {
        type: 'challenge',
        message: `🏆 You won the challenge against ${loser.name}! +${winnerXP} XP, +${winnerCoins} coins`,
        relatedId: challengeId,
        icon: '🏆'
      });
      
      await notificationService.create(loserId, {
        type: 'challenge',
        message: `${winner.name} completed the challenge first. Better luck next time!`,
        relatedId: challengeId,
        icon: '🎯'
      });
      
      // Activities
      await activityService.create(winnerId, {
        action: 'won challenge against',
        target: loser.name,
        targetType: 'friend-challenge',
        icon: '🏆',
        color: '#fbbf24'
      });
      
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  },

  // Get user's friend challenges
  getUserFriendChallenges: async (userId) => {
    try {
      const sentQuery = query(
        collection(db, 'challenges'),
        where('fromUserId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const receivedQuery = query(
        collection(db, 'challenges'),
        where('toUserId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const [sentSnap, receivedSnap] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);
      
      const challenges = [
        ...sentSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'sent' })),
        ...receivedSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'received' }))
      ];
      
      // Sort by date
      challenges.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      
      return challenges;
    } catch (error) {
      console.error('Error getting user challenges:', error);
      throw error;
    }
  },

  // Get active challenges between two users
  getChallengesBetweenUsers: async (userId1, userId2) => {
    try {
      const query1 = query(
        collection(db, 'challenges'),
        where('fromUserId', '==', userId1),
        where('toUserId', '==', userId2),
        where('status', 'in', ['pending', 'active'])
      );
      
      const query2 = query(
        collection(db, 'challenges'),
        where('fromUserId', '==', userId2),
        where('toUserId', '==', userId1),
        where('status', 'in', ['pending', 'active'])
      );
      
      const [snap1, snap2] = await Promise.all([
        getDocs(query1),
        getDocs(query2)
      ]);
      
      return [
        ...snap1.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...snap2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];
    } catch (error) {
      console.error('Error getting challenges between users:', error);
      throw error;
    }
  },

  // Listen to challenge updates
  listenToChallengeUpdates: (challengeId, callback) => {
    const challengeRef = doc(db, 'challenges', challengeId);
    
    return onSnapshot(challengeRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      }
    });
  },

  // Get challenge templates
  getChallengeTemplates: () => {
    return [
      {
        id: 'xp_race',
        title: 'XP Race',
        description: 'First to earn 500 XP wins',
        icon: '⚡',
        target: 500,
        duration: 7, // days
        difficulty: 'MEDIUM',
        reward: { xp: 200, coins: 100 }
      },
      {
        id: 'streak_battle',
        title: 'Streak Battle',
        description: 'Maintain the longest streak',
        icon: '🔥',
        target: 7,
        duration: 7,
        difficulty: 'MEDIUM',
        reward: { xp: 300, coins: 150 }
      },
      {
        id: 'task_master',
        title: 'Task Master',
        description: 'Complete 20 tasks first',
        icon: '✅',
        target: 20,
        duration: 7,
        difficulty: 'HARD',
        reward: { xp: 400, coins: 200 }
      },
      {
        id: 'lesson_sprint',
        title: 'Lesson Sprint',
        description: 'Complete 10 lessons',
        icon: '📚',
        target: 10,
        duration: 5,
        difficulty: 'MEDIUM',
        reward: { xp: 500, coins: 250 }
      },
      {
        id: 'group_participation',
        title: 'Social Butterfly',
        description: 'Make 15 group posts',
        icon: '💬',
        target: 15,
        duration: 7,
        difficulty: 'EASY',
        reward: { xp: 150, coins: 75 }
      },
      {
        id: 'crown_collector',
        title: 'Crown Collector',
        description: 'Earn 5 crowns',
        icon: '👑',
        target: 5,
        duration: 7,
        difficulty: 'HARD',
        reward: { xp: 350, coins: 175 }
      }
    ];
  },

  // Get active challenges
  };

// ============================================
// 8. NOTIFICATION SERVICE (COMPLETE)
// ============================================

export const notificationService = {
  // Create notification
  // In notificationService.create
async create(userId, notificationData) {
  try {
    console.log('🔍 Creating notification for user:', userId);
    console.log('🔍 Notification data:', notificationData);
    
    const notifRef = doc(collection(db, 'notifications', userId, 'items'));
    const notificationId = notifRef.id;
    
    const notification = {
      id: notificationId,
      userId,
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    };
    
    console.log('🔍 Final notification object:', notification);
    
    await setDoc(notifRef, notification);
    
    console.log('✅ Notification created with ID:', notificationId);
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    throw error;
  }
},

  // Get user notifications
  async getUserNotifications(userId, limitCount = 50) {
    try {
      const notifsQuery = query(
        collection(db, 'notifications', userId, 'items'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(notifsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Mark as read
  async markAsRead(userId, notificationId) {
    try {
      const notifRef = doc(db, 'notifications', userId, 'items', notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all as read
  async markAllAsRead(userId) {
    try {
      const notifsQuery = query(
        collection(db, 'notifications', userId, 'items'),
        where('read', '==', false)
      );
      const snapshot = await getDocs(notifsQuery);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(userId, notificationId) {
    try {
      const notifRef = doc(db, 'notifications', userId, 'items', notificationId);
      await deleteDoc(notifRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount(userId) {
    try {
      const notifsQuery = query(
        collection(db, 'notifications', userId, 'items'),
        where('read', '==', false)
      );
      const snapshot = await getDocs(notifsQuery);
      return snapshot.docs.length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },

  // Listen to notifications (real-time)
  listenToNotifications(userId, callback) {
    const notifsQuery = query(
      collection(db, 'notifications', userId, 'items'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return onSnapshot(notifsQuery, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(notifications);
    });
  }
};

// ============================================
// 9. ACTIVITY SERVICE (COMPLETE)
// ============================================

export const activityService = {
  // Create activity
  async create(userId, activityData) {
    try {
      const activityRef = doc(collection(db, 'activities'));
      
      const user = await userService.getUser(userId);
      
      await setDoc(activityRef, {
        id: activityRef.id,
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        ...activityData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities(limitCount = 50) {
    try {
      const activitiesQuery = query(
        collection(db, 'activities'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(activitiesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  },

  // Get friends' activities
  async getFriendsActivities(userId, limitCount = 50) {
    try {
      const friends = await userService.getFriends(userId);
      const friendIds = friends.map(f => f.id);
      
      if (friendIds.length === 0) return [];
      
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('userId', 'in', friendIds.slice(0, 10)),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(activitiesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting friends activities:', error);
      throw error;
    }
  },

  // Get user's activities
  async getUserActivities(userId, limitCount = 50) {
    try {
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(activitiesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw error;
    }
  },

  // Listen to activities (real-time)
  listenToActivities(callback, limitCount = 50) {
    const activitiesQuery = query(
      collection(db, 'activities'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    return onSnapshot(activitiesQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(activities);
    });
  }
};

// ============================================
// 10. ACHIEVEMENT SERVICE (COMPLETE)
// ============================================

export const achievementService = {
  achievements: {
    'first_task': {
      name: 'Getting Started',
      description: 'Complete your first task',
      icon: '🎯',
      criteria: { tasksCompleted: 1 },
      reward: { xp: 50, coins: 10 }
    },
    'week_warrior': {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      criteria: { streak: 7 },
      reward: { xp: 200, coins: 50 }
    },
    'social_butterfly': {
      name: 'Social Butterfly',
      description: 'Make 10 friends',
      icon: '🦋',
      criteria: { friendsCount: 10 },
      reward: { xp: 150, coins: 30 }
    },
    'group_leader': {
      name: 'Group Leader',
      description: 'Create your first group',
      icon: '👑',
      criteria: { groupsCount: 1 },
      reward: { xp: 100, coins: 25 }
    },
    'challenge_master': {
      name: 'Challenge Master',
      description: 'Complete 50 challenges',
      icon: '🏆',
      criteria: { challengesCompleted: 50 },
      reward: { xp: 500, coins: 100 }
    },
    'level_10': {
      name: 'Rising Star',
      description: 'Reach level 10',
      icon: '⭐',
      criteria: { level: 10 },
      reward: { xp: 300, coins: 75 }
    },
    'super_streak': {
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      criteria: { streak: 30 },
      reward: { xp: 1000, coins: 250 }
    }
  },

  // Check and award achievements
  async checkAchievements(userId, stats) {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      const earnedIds = userAchievements.map(a => a.id);
      
      for (const [id, achievement] of Object.entries(this.achievements)) {
        if (!earnedIds.includes(id)) {
          let criteriaMet = true;
          
          for (const [key, value] of Object.entries(achievement.criteria)) {
            if (!stats[key] || stats[key] < value) {
              criteriaMet = false;
              break;
            }
          }
          
          if (criteriaMet) {
            await this.awardAchievement(userId, id, achievement);
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  },

  // Award achievement
  async awardAchievement(userId, achievementId, achievement) {
    try {
      const achievementRef = doc(db, 'users', userId, 'achievements', achievementId);
      
      await setDoc(achievementRef, {
        id: achievementId,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        earnedAt: serverTimestamp(),
        reward: achievement.reward
      });
      
      // Award rewards
      if (achievement.reward.xp) {
        await userService.addXP(userId, achievement.reward.xp);
      }
      if (achievement.reward.coins) {
        await userService.addCoins(userId, achievement.reward.coins);
      }
      
      // Update achievement count
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        achievementsCount: increment(1)
      });
      
      // Create notification
      await notificationService.create(userId, {
        type: 'achievement',
        message: `Achievement Unlocked: ${achievement.name}!`,
        relatedId: achievementId,
        icon: achievement.icon
      });
      
      // Create activity
      await activityService.create(userId, {
        action: 'achieved',
        target: achievement.name,
        targetType: 'achievement',
        icon: achievement.icon,
        color: '#ffd700'
      });
    } catch (error) {
      console.error('Error awarding achievement:', error);
      throw error;
    }
  },

  // Get user achievements
  async getUserAchievements(userId) {
    try {
      const achievementsQuery = query(
        collection(db, 'users', userId, 'achievements'),
        orderBy('earnedAt', 'desc')
      );
      const snapshot = await getDocs(achievementsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  }
};

// ============================================
// 11. LEADERBOARD SERVICE (COMPLETE)
// ============================================

export const leaderboardService = {
  // Get weekly leaderboard
  // Get weekly leaderboard
async getWeeklyLeaderboard(limitCount = 100) {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(usersQuery);
    const rankings = [];
    
    for (let i = 0; i < snapshot.docs.length; i++) {
      const userDoc = snapshot.docs[i];
      const statsSnap = await getDoc(doc(db, 'users', userDoc.id, 'stats', 'current'));
      
      if (statsSnap.exists() && statsSnap.data().weeklyXP > 0) {
        rankings.push({
          userId: userDoc.id,
          totalXP: statsSnap.data().totalXP || 0,  // ADD THIS LINE
          weeklyXP: statsSnap.data().weeklyXP || 0,
          name: userDoc.data().name,
          avatar: userDoc.data().avatar,
          username: userDoc.data().username,
          league: userDoc.data().league,
          streak: statsSnap.data().streak || 0,
          crowns: statsSnap.data().crowns || 0,
          level: statsSnap.data().level || 1  // ADD THIS TOO (optional but good to have)
        });
      }
    }
    
    // Sort by weeklyXP
    rankings.sort((a, b) => b.weeklyXP - a.weeklyXP);
    
    // Add ranks
    rankings.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    return rankings;
  } catch (error) {
    console.error('Error getting weekly leaderboard:', error);
    throw error;
  }
},

  // Get global leaderboard
  async getGlobalLeaderboard(limitCount = 100) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error searching groups:', error);
      throw error;
    }
  }
};



// Default export
export default {
  auth: authService,
  user: userService,
  friendship: friendshipService,
  messaging: messagingService,
  group: groupService,
  challenge: challengeService,
  notification: notificationService,
  activity: activityService,
  achievement: achievementService,
  leaderboard: leaderboardService,
  league: leagueService,
  storage: storageService,
  analytics: analyticsService,
  presence: presenceService,
  search: searchService,
  task: taskService,
  lesson: lessonService,
  reward: rewardService 
};

export const socialTraitsService = {
  // Initialize default traits for new user
  async initializeTraits(userId) {
    try {
      const traitsRef = doc(db, 'users', userId, 'traits', 'current');
      await setDoc(traitsRef, {
        conversation: { current: 45, future: 85, icon: 'MessageCircle', color: '#a855f7' },
        listening: { current: 60, future: 90, icon: 'Heart', color: '#c084fc' },
        confidence: { current: 35, future: 80, icon: 'Zap', color: '#d946ef' },
        networking: { current: 40, future: 75, icon: 'Users', color: '#9333ea' },
        empathy: { current: 70, future: 95, icon: 'Sparkles', color: '#e879f9' },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error initializing traits:', error);
      throw error;
    }
  },

  // Get user traits
  async getTraits(userId) {
    try {
      const traitsRef = doc(db, 'users', userId, 'traits', 'current');
      const traitsSnap = await getDoc(traitsRef);
      
      if (traitsSnap.exists()) {
        return traitsSnap.data();
      }
      
      // Initialize if doesn't exist
      await this.initializeTraits(userId);
      return await this.getTraits(userId);
    } catch (error) {
      console.error('Error getting traits:', error);
      throw error;
    }
  },

  // Update specific trait
  async updateTrait(userId, traitName, current, future) {
    try {
      const traitsRef = doc(db, 'users', userId, 'traits', 'current');
      await updateDoc(traitsRef, {
        [`${traitName}.current`]: current,
        [`${traitName}.future`]: future,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating trait:', error);
      throw error;
    }
  }
};

// ============================================
// SOCIAL SKILLS SERVICE
// ============================================
export const socialSkillsService = {
  // Initialize default skills for new user
  async initializeSkills(userId) {
    try {
      const batch = writeBatch(db);
      
      const skills = [
        { 
          name: 'Conversation Initiation', 
          level: 45, 
          xp: 2250, 
          maxXp: 5000,
          color: '#a855f7', 
          trend: [30, 32, 35, 38, 40, 45] 
        },
        { 
          name: 'Listening & Empathy', 
          level: 70, 
          xp: 3500, 
          maxXp: 5000,
          color: '#c084fc', 
          trend: [55, 58, 62, 65, 68, 70] 
        },
        { 
          name: 'Confidence & Assertiveness', 
          level: 35, 
          xp: 1750, 
          maxXp: 5000,
          color: '#d946ef', 
          trend: [20, 23, 26, 29, 32, 35] 
        },
        { 
          name: 'Networking', 
          level: 40, 
          xp: 2000, 
          maxXp: 5000,
          color: '#9333ea', 
          trend: [25, 28, 32, 35, 38, 40] 
        }
      ];

      skills.forEach(skill => {
        const skillRef = doc(db, 'users', userId, 'socialSkills', 'skills', skill.name);
        batch.set(skillRef, {
          ...skill,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error initializing skills:', error);
      throw error;
    }
  },

  // Get user skills
  async getSkills(userId) {
    try {
      const skillsQuery = query(
        collection(db, 'users', userId, 'skills')
      );
      const snapshot = await getDocs(skillsQuery);
      
      if (snapshot.empty) {
        await this.initializeSkills(userId);
        return await this.getSkills(userId);
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting skills:', error);
      throw error;
    }
  },

  // Update skill progress
  async updateSkillProgress(userId, skillName, xpGained) {
    try {
      const skillRef = doc(db, 'users', userId, 'socialSkills', 'skills', skillName);
      const skillSnap = await getDoc(skillRef);
      
      if (skillSnap.exists()) {
        const currentData = skillSnap.data();
        const newXp = currentData.xp + xpGained;
        const newLevel = Math.floor(newXp / 50);
        
        // Update trend array
        const newTrend = [...currentData.trend, newLevel];
        if (newTrend.length > 6) newTrend.shift();
        
        await updateDoc(skillRef, {
          xp: newXp,
          level: newLevel,
          trend: newTrend,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating skill progress:', error);
      throw error;
    }
  }
};

// ============================================
// SOCIAL ACTIONS SERVICE
// ============================================
export const socialActionsService = {
  // Log a social action
  async logAction(userId, actionData) {
    try {
      const actionRef = doc(collection(db, 'users', userId, 'actions'));
      
      await setDoc(actionRef, {
        id: actionRef.id,
        userId,
        action: actionData.action,
        skill: actionData.skill,
        xp: actionData.xp,
        difficulty: actionData.difficulty,
        createdAt: serverTimestamp()
      });

      // Update corresponding skill
      await socialSkillsService.updateSkillProgress(userId, actionData.skill, actionData.xp);

      // Update user stats
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        totalXP: increment(actionData.xp),
        weeklyXP: increment(actionData.xp)
      });

      return actionRef.id;
    } catch (error) {
      console.error('Error logging action:', error);
      throw error;
    }
  },

  // Get user actions
  async getActions(userId, limitCount = 50) {
    try {
      const actionsQuery = query(
        collection(db, 'users', userId, 'actions'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(actionsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting actions:', error);
      throw error;
    }
  },

  // Get action frequency data for charts
  async getActionFrequency(userId) {
    try {
      const actions = await this.getActions(userId, 100);
      
      const frequency = {};
      actions.forEach(action => {
        if (!frequency[action.skill]) {
          frequency[action.skill] = 0;
        }
        frequency[action.skill]++;
      });

      return Object.entries(frequency).map(([action, count]) => ({
        action,
        count
      }));
    } catch (error) {
      console.error('Error getting action frequency:', error);
      throw error;
    }
  }
};

// ============================================
// SOCIAL ARCHETYPE SERVICE
// ============================================
export const socialArchetypeService = {
  archetypes: {
    observer: {
      name: 'Observer',
      icon: '👁️',
      color: '#a855f7',
      traits: ['Thoughtful', 'Analytical', 'Cautious']
    },
    connector: {
      name: 'Connector',
      icon: '🤝',
      color: '#c084fc',
      traits: ['Social', 'Engaging', 'Empathetic']
    },
    supporter: {
      name: 'Supporter',
      icon: '💚',
      color: '#9333ea',
      traits: ['Caring', 'Loyal', 'Encouraging']
    },
    influencer: {
      name: 'Influencer',
      icon: '⭐',
      color: '#d946ef',
      traits: ['Charismatic', 'Confident', 'Inspiring']
    }
  },

  // Calculate archetype based on traits
  calculateArchetype(traits) {
    const scores = {
      observer: traits.listening?.current || 0,
      connector: (traits.networking?.current || 0) + (traits.conversation?.current || 0),
      supporter: traits.empathy?.current || 0,
      influencer: (traits.confidence?.current || 0) + (traits.conversation?.current || 0)
    };

    return Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
  },

  // Get user archetype
  async getUserArchetype(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          current: userSnap.data().currentArchetype || 'observer',
          future: userSnap.data().futureArchetype || 'connector'
        };
      }
      
      return { current: 'observer', future: 'connector' };
    } catch (error) {
      console.error('Error getting user archetype:', error);
      throw error;
    }
  },

  // Update user archetype
  async updateArchetype(userId, archetypeType, archetype) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`${archetypeType}Archetype`]: archetype,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating archetype:', error);
      throw error;
    }
  }
};

// ============================================
// SOCIAL MILESTONES SERVICE
// ============================================
export const socialMilestonesService = {
  // Initialize milestones for new user
  async initializeMilestones(userId) {
    try {
      const batch = writeBatch(db);
      
      const milestones = [
        { name: 'First Compliment', completed: false, date: 'Upcoming', order: 1 },
        { name: 'Group Activity', completed: false, date: 'Upcoming', order: 2 },
        { name: '5 Conversations', completed: false, date: 'Upcoming', order: 3 },
        { name: 'Networking Event', completed: false, date: 'Upcoming', order: 4 },
        { name: 'Public Speaking', completed: false, date: 'Upcoming', order: 5 }
      ];

      milestones.forEach(milestone => {
        const milestoneRef = doc(collection(db, 'users', userId, 'milestones'));
        batch.set(milestoneRef, {
          ...milestone,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error initializing milestones:', error);
      throw error;
    }
  },

  // Get user milestones
  async getMilestones(userId) {
    try {
      const milestonesQuery = query(
        collection(db, 'users', userId, 'milestones'),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(milestonesQuery);
      
      if (snapshot.empty) {
        await this.initializeMilestones(userId);
        return await this.getMilestones(userId);
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting milestones:', error);
      throw error;
    }
  },

  // Complete milestone
  async completeMilestone(userId, milestoneId) {
    try {
      const milestoneRef = doc(db, 'users', userId, 'socialMilestones', milestoneId);
      
      await updateDoc(milestoneRef, {
        completed: true,
        completedAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });

      // Award XP
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await updateDoc(statsRef, {
        totalXP: increment(100),
        weeklyXP: increment(100)
      });
    } catch (error) {
      console.error('Error completing milestone:', error);
      throw error;
    }
  }
};

// ============================================
// SOCIAL CHALLENGES SERVICE
// ============================================
export const socialChallengesService = {
  // Initialize challenges for new user
  async initializeChallenges(userId) {
    try {
      const batch = writeBatch(db);
      
      const challenges = [
        {
          title: 'Start 3 conversations with strangers',
          xp: 300,
          streak: 0,
          badge: '🗣️',
          target: 3,
          progress: 0,
          completed: false
        },
        {
          title: 'Give 5 genuine compliments',
          xp: 150,
          streak: 0,
          badge: '💬',
          target: 5,
          progress: 0,
          completed: false
        },
        {
          title: 'Attend a networking event',
          xp: 500,
          streak: 0,
          badge: '🎯',
          target: 1,
          progress: 0,
          completed: false
        },
        {
          title: 'Practice active listening for 1 week',
          xp: 400,
          streak: 0,
          badge: '👂',
          target: 7,
          progress: 0,
          completed: false
        }
      ];

      challenges.forEach(challenge => {
        const challengeRef = doc(collection(db, 'users', userId, 'challenges'));
        batch.set(challengeRef, {
          ...challenge,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error initializing challenges:', error);
      throw error;
    }
  },

  // Get user challenges
  async getChallenges(userId) {
    try {
      const challengesQuery = query(
        collection(db, 'users', userId, 'challenges')
      );
      
      const snapshot = await getDocs(challengesQuery);
      
      if (snapshot.empty) {
        await this.initializeChallenges(userId);
        return await this.getChallenges(userId);
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting challenges:', error);
      throw error;
    }
  },

  // Update challenge progress
  async updateProgress(userId, challengeId, progressIncrement = 1) {
    try {
      const challengeRef = doc(db, 'users', userId, 'socialChallenges', challengeId);
      const challengeSnap = await getDoc(challengeRef);
      
      if (challengeSnap.exists()) {
        const currentData = challengeSnap.data();
        const newProgress = currentData.progress + progressIncrement;
        const isCompleted = newProgress >= currentData.target;
        
        await updateDoc(challengeRef, {
          progress: newProgress,
          completed: isCompleted,
          ...(isCompleted && { completedAt: serverTimestamp() }),
          updatedAt: serverTimestamp()
        });

        // Award XP if completed
        if (isCompleted && !currentData.completed) {
          const statsRef = doc(db, 'users', userId, 'stats', 'current');
          await updateDoc(statsRef, {
            totalXP: increment(currentData.xp),
            weeklyXP: increment(currentData.xp)
          });
        }

        return isCompleted;
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  },

  // Complete challenge
  async completeChallenge(userId, challengeId) {
    try {
      const challengeRef = doc(db, 'users', userId, 'socialChallenges', challengeId);
      const challengeSnap = await getDoc(challengeRef);
      
      if (challengeSnap.exists()) {
        const challenge = challengeSnap.data();
        
        await updateDoc(challengeRef, {
          completed: true,
          completedAt: serverTimestamp()
        });

        // Award XP
        const statsRef = doc(db, 'users', userId, 'stats', 'current');
        await updateDoc(statsRef, {
          totalXP: increment(challenge.xp),
          weeklyXP: increment(challenge.xp)
        });

        return true;
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }
};

// ============================================
// SOCIAL REFLECTIONS SERVICE
// ============================================
export const socialReflectionsService = {
  // Create weekly reflection
  async createReflection(userId, reflectionData) {
    try {
      const reflectionRef = doc(collection(db, 'users', userId, 'socialReflections'));
      
      await setDoc(reflectionRef, {
        id: reflectionRef.id,
        userId,
        mood: reflectionData.mood,
        text: reflectionData.text || '',
        weekOf: new Date(),
        createdAt: serverTimestamp()
      });

      return reflectionRef.id;
    } catch (error) {
      console.error('Error creating reflection:', error);
      throw error;
    }
  },

  // Get user reflections
  async getReflections(userId, limitCount = 10) {
    try {
      const reflectionsQuery = query(
        collection(db, 'users', userId, 'socialReflections'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(reflectionsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reflections:', error);
      throw error;
    }
  },

  // Get latest reflection
  async getLatestReflection(userId) {
    try {
      const reflections = await this.getReflections(userId, 1);
      return reflections[0] || null;
    } catch (error) {
      console.error('Error getting latest reflection:', error);
      throw error;
    }
  }
};

// ============================================
// INITIALIZE USER SOCIAL PROFILE
// ============================================
export const initializeSocialProfile = async (userId) => {
  try {
    await Promise.all([
      socialTraitsService.initializeTraits(userId),
      socialSkillsService.initializeSkills(userId),
      socialMilestonesService.initializeMilestones(userId),
      socialChallengesService.initializeChallenges(userId)
    ]);

    // Set initial archetype
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      currentArchetype: 'observer',
      futureArchetype: 'connector',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Social profile initialized for user:', userId);
  } catch (error) {
    console.error('Error initializing social profile:', error);
    throw error;
  }
};

// ============================================
// SOCIAL ONBOARDING SERVICE
// ============================================
export const socialOnboardingService = {
  // Check if user has completed onboarding
  hasCompletedOnboarding: async (userId) => {
    try {
      console.log('🔍 Checking onboarding status for:', userId);
      
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log('❌ No user document found - onboarding needed');
        return false;
      }
      
      const data = userSnap.data();
      const completed = data.onboardingCompleted === true;
      
      console.log(`✅ Onboarding status: ${completed}`);
      return completed;
    } catch (error) {
      console.error('❌ Error checking onboarding:', error);
      return false;
    }
  },

  // Save onboarding results
  saveOnboardingResults: async (userId, profileData) => {
    try {
      console.log('💾 Saving onboarding results for:', userId);
      console.log('📊 Profile data received:', profileData);

      const batch = writeBatch(db);
      
      // ============================================
      // 1. UPDATE MAIN USER DOCUMENT
      // ============================================
      const userRef = doc(db, 'users', userId);
      batch.set(userRef, {
        onboardingCompleted: true,
        onboardingCompletedAt: serverTimestamp(),
        currentArchetype: profileData.archetypes.current,
        futureArchetype: profileData.archetypes.future,
        goals: profileData.goals,
        commitment: profileData.commitment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // ============================================
      // 2. SAVE TRAITS (CURRENT & FUTURE)
      // ============================================
      const traitsRef = doc(db, 'users', userId, 'traits', 'current');
      const traitsData = {};
      
      Object.keys(profileData.traits.current).forEach(traitName => {
        traitsData[traitName] = {
          current: profileData.traits.current[traitName],
          future: profileData.traits.future[traitName],
          color: {
            conversation: '#a855f7',
            listening: '#c084fc',
            confidence: '#d946ef',
            networking: '#9333ea',
            empathy: '#e879f9'
          }[traitName]
        };
      });
      
      batch.set(traitsRef, {
        ...traitsData,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Traits data prepared:', traitsData);

      // ============================================
      // 3. COMMIT BATCH
      // ============================================
      await batch.commit();
      console.log('✅ Batch write completed');

      // ============================================
      // 4. INITIALIZE SKILLS (creates multiple docs)
      // ============================================
      console.log('🔄 Initializing skills...');
      const skillsBatch = writeBatch(db);
      
      const skills = [
        { 
          name: 'Conversation Initiation', 
          level: 1,
          xp: 0, 
          maxXp: 500,
          color: '#a855f7', 
          trend: [0, 0, 0, 0, 0, 0] 
        },
        { 
          name: 'Listening & Empathy', 
          level: 1,
          xp: 0, 
          maxXp: 500,
          color: '#c084fc', 
          trend: [0, 0, 0, 0, 0, 0] 
        },
        { 
          name: 'Confidence & Assertiveness', 
          level: 1,
          xp: 0, 
          maxXp: 500,
          color: '#d946ef', 
          trend: [0, 0, 0, 0, 0, 0] 
        },
        { 
          name: 'Networking', 
          level: 1,
          xp: 0, 
          maxXp: 500,
          color: '#9333ea', 
          trend: [0, 0, 0, 0, 0, 0] 
        }
      ];

      skills.forEach(skill => {
        const skillRef = doc(collection(db, 'users', userId, 'skills'));
        skillsBatch.set(skillRef, {
          ...skill,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await skillsBatch.commit();
      console.log('✅ Skills initialized');

      // ============================================
      // 5. INITIALIZE MILESTONES
      // ============================================
      console.log('🔄 Initializing milestones...');
      const milestonesBatch = writeBatch(db);
      
      const milestones = [
        { name: 'Started Journey', completed: true, date: new Date().toLocaleDateString(), order: 1 },
        { name: 'First Week Complete', completed: false, date: 'Upcoming', order: 2 },
        { name: 'First Month Milestone', completed: false, date: 'Upcoming', order: 3 },
        { name: '50 Actions Logged', completed: false, date: 'Upcoming', order: 4 },
        { name: 'Level 5 Reached', completed: false, date: 'Upcoming', order: 5 }
      ];

      milestones.forEach(milestone => {
        const milestoneRef = doc(collection(db, 'users', userId, 'milestones'));
        milestonesBatch.set(milestoneRef, {
          ...milestone,
          createdAt: serverTimestamp()
        });
      });

      await milestonesBatch.commit();
      console.log('✅ Milestones initialized');

      // ============================================
      // 6. INITIALIZE CHALLENGES (BASED ON GOALS)
      // ============================================
      console.log('🔄 Initializing challenges based on goals...');
      const challengesBatch = writeBatch(db);
      
      const goalBasedChallenges = [];
      
      // Add challenges based on selected goals
      if (profileData.goals.includes('confidence')) {
        goalBasedChallenges.push({
          title: 'Speak up in 3 group conversations',
          xp: 300,
          streak: 0,
          badge: '💪',
          target: 3,
          progress: 0,
          completed: false
        });
      }
      
      if (profileData.goals.includes('friends')) {
        goalBasedChallenges.push({
          title: 'Start 5 conversations with new people',
          xp: 250,
          streak: 0,
          badge: '🤝',
          target: 5,
          progress: 0,
          completed: false
        });
      }
      
      if (profileData.goals.includes('networking')) {
        goalBasedChallenges.push({
          title: 'Attend a networking event',
          xp: 500,
          streak: 0,
          badge: '🎯',
          target: 1,
          progress: 0,
          completed: false
        });
      }
      
      if (profileData.goals.includes('conversations')) {
        goalBasedChallenges.push({
          title: 'Practice small talk for 7 days',
          xp: 400,
          streak: 0,
          badge: '💬',
          target: 7,
          progress: 0,
          completed: false
        });
      }
      
      // Default challenge for everyone
      goalBasedChallenges.push({
        title: 'Complete your first social action',
        xp: 100,
        streak: 0,
        badge: '🌟',
        target: 1,
        progress: 0,
        completed: false
      });

      goalBasedChallenges.forEach(challenge => {
        const challengeRef = doc(collection(db, 'users', userId, 'challenges'));
        challengesBatch.set(challengeRef, {
          ...challenge,
          createdAt: serverTimestamp()
        });
      });

      await challengesBatch.commit();
      console.log('✅ Challenges initialized:', goalBasedChallenges.length);

      // ============================================
      // 7. INITIALIZE TIMELINE
      // ============================================
      console.log('🔄 Initializing timeline...');
      const timelineBatch = writeBatch(db);
      
      const timelineEvents = [
        {
          stage: 'The Beginning',
          icon: '🌱',
          color: '#a855f7',
          description: `You started as a ${profileData.archetypes.current}. Your journey to becoming a ${profileData.archetypes.future} begins now!`,
          order: 1
        },
        {
          stage: 'Your Goals Set',
          icon: '🎯',
          color: '#c084fc',
          description: `You've committed to: ${profileData.goals.map(g => g.replace('_', ' ')).join(', ')}`,
          order: 2
        }
      ];

      timelineEvents.forEach(event => {
        const eventRef = doc(collection(db, 'users', userId, 'timeline'));
        timelineBatch.set(eventRef, {
          ...event,
          createdAt: serverTimestamp()
        });
      });

      await timelineBatch.commit();
      console.log('✅ Timeline initialized');

      // ============================================
      // 8. INITIALIZE USER STATS
      // ============================================
      console.log('🔄 Initializing stats...');
      const statsRef = doc(db, 'users', userId, 'stats', 'current');
      await setDoc(statsRef, {
        totalXP: 0,
        weeklyXP: 0,
        streak: 0,
        longestStreak: 0,
        tasksCompleted: 0,
        level: 1,
        coins: 0,
        crowns: 0
      });

      console.log('✅ All onboarding data saved successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error saving onboarding results:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
};


// ============================================
// SOCIAL TIMELINE SERVICE
// ============================================
export const socialTimelineService = {
  // Initialize timeline for new user
  async initializeTimeline(userId) {
    try {
      const batch = writeBatch(db);
      
      const events = [
        {
          stage: 'The Beginning',
          icon: '🌱',
          color: '#a855f7',
          description: 'You started your social skills journey feeling shy but motivated to grow.',
          order: 1
        },
        {
          stage: 'First Breakthrough',
          icon: '🔥',
          color: '#d946ef',
          description: 'You had your first successful conversation with a stranger!',
          order: 2
        },
        {
          stage: 'Growth Phase',
          icon: '🚀',
          color: '#c084fc',
          description: "You're now consistently practicing social skills every day.",
          order: 3
        }
      ];

      events.forEach(event => {
        const eventRef = doc(collection(db, 'users', userId, 'timeline'));
        batch.set(eventRef, {
          ...event,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error initializing timeline:', error);
      throw error;
    }
  },

  // Get timeline events
  async getTimelineEvents(userId) {
    try {
      console.log('📅 Fetching timeline events for user:', userId);
      
      const timelineQuery = query(
        collection(db, 'users', userId, 'timeline'),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(timelineQuery);
      
      console.log('📅 Timeline snapshot size:', snapshot.size);
      
      if (snapshot.empty) {
        console.log('📅 No timeline found, initializing...');
        await this.initializeTimeline(userId);
        return await this.getTimelineEvents(userId);
      }
      
      const events = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      console.log('✅ Timeline events fetched:', events);
      return events;
    } catch (error) {
      console.error('❌ Error getting timeline events:', error);
      return [];
    }
  },

  // Add new timeline event
  async addTimelineEvent(userId, eventData) {
    try {
      const eventRef = doc(collection(db, 'users', userId, 'timeline'));
      
      await setDoc(eventRef, {
        ...eventData,
        createdAt: serverTimestamp()
      });

      return eventRef.id;
    } catch (error) {
      console.error('Error adding timeline event:', error);
      throw error;
    }
  },

  // Update timeline event
  async updateTimelineEvent(userId, eventId, updates) {
    try {
      const eventRef = doc(db, 'users', userId, 'timeline', eventId);
      
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating timeline event:', error);
      throw error;
    }
  }
};

// ============================================
// EXPORT ALL SERVICES
// ============================================
export const socialSkillsServices = {
  traits: socialTraitsService,
  skills: socialSkillsService,
  actions: socialActionsService,
  archetypes: socialArchetypeService,
  milestones: socialMilestonesService,
  challenges: socialChallengesService,
  reflections: socialReflectionsService,
  timeline: socialTimelineService,
  onboarding: socialOnboardingService,
  initializeProfile: initializeSocialProfile
  
};
