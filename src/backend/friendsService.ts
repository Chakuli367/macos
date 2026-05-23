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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);
export const rtdb = getDatabase(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

// ============================================
// 2. AUTHENTICATION SERVICE
// ============================================

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
      const rankings = [];
      
      for (let i = 0; i < snapshot.docs.length; i++) {
        const userDoc = snapshot.docs[i];
        const statsSnap = await getDoc(doc(db, 'users', userDoc.id, 'stats', 'current'));
        
        if (statsSnap.exists()) {
          rankings.push({
            userId: userDoc.id,
            totalXP: statsSnap.data().totalXP || 0,
            name: userDoc.data().name,
            avatar: userDoc.data().avatar,
            username: userDoc.data().username,
            league: userDoc.data().league,
            level: statsSnap.data().level || 1,
            streak: statsSnap.data().streak || 0
          });
        }
      }
      
      // Sort by totalXP
      rankings.sort((a, b) => b.totalXP - a.totalXP);
      
      // Add ranks
      rankings.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      return rankings;
    } catch (error) {
      console.error('Error getting global leaderboard:', error);
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
      const snapshot = await getDocs(q);
      
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
      
      const snapshot = await getDocs(q);
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
  },


// ============================================
// 20. EXPORT ALL SERVICES
// ============================================


   

  // Update online status
  async updateOnlineStatus(uid, isOnline) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        isOnline,
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      throw error;
    }
  },

  // Get user settings
  async getUserSettings(uid) {
    try {
      const settingsRef = doc(db, 'users', uid, 'settings', 'preferences');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        return settingsSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  // Update user settings
  async updateSettings(uid, settings) {
    try {
      const settingsRef = doc(db, 'users', uid, 'settings', 'preferences');
      await updateDoc(settingsRef, settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Block user
  async blockUser(userId, blockedUserId) {
    try {
      const blockRef = doc(db, 'users', userId, 'blockedUsers', blockedUserId);
      await setDoc(blockRef, {
        userId: blockedUserId,
        blockedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  // Unblock user
  async unblockUser(userId, blockedUserId) {
    try {
      const blockRef = doc(db, 'users', userId, 'blockedUsers', blockedUserId);
      await deleteDoc(blockRef);
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  },

  // Get blocked users
  async getBlockedUsers(userId) {
    try {
      const blockedQuery = query(collection(db, 'users', userId, 'blockedUsers'));
      const snapshot = await getDocs(blockedQuery);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting blocked users:', error);
      throw error;
    }
  },

};


// ============================================
// 4. FRIENDSHIP SERVICE (COMPLETE)
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
  async acceptRequest(requestId) {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        throw new Error('Friend request not found');
      }
      
      const request = requestSnap.data();
      
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
      
      await Promise.all([
        updateDoc(stats1Ref, { friendsCount: increment(1) }),
        updateDoc(stats2Ref, { friendsCount: increment(1) })
      ]);
      
      // Delete request
      await deleteDoc(requestRef);
      
      // Notify sender
      const accepter = await userService.getUser(request.toUserId);
      await notificationService.create(request.fromUserId, {
        type: 'friend',
        message: `${accepter.name} accepted your friend request`,
        relatedId: request.toUserId,
        icon: '✅'
      });
      
      // Check achievements
      const stats1 = (await getDoc(stats1Ref)).data();
      const stats2 = (await getDoc(stats2Ref)).data();
      await achievementService.checkAchievements(request.fromUserId, stats1);
      await achievementService.checkAchievements(request.toUserId, stats2);
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

  // Get group posts
  async getGroupPosts(groupId, limitCount = 20) {
    try {
      const postsQuery = query(
        collection(db, 'groups', groupId, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(postsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting group posts:', error);
      throw error;
    }
  },

  // Add reaction to post
  async addReaction(groupId, postId, reactionType) {
    try {
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      await updateDoc(postRef, {
        [`reactions.${reactionType}`]: increment(1)
      });
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

export const challengeService = {
  // Create challenge
  async createChallenge(challengeData) {
    try {
      const challengeRef = doc(collection(db, 'challenges'));
      await setDoc(challengeRef, {
        id: challengeRef.id,
        ...challengeData,
        participants: 0,
        isActive: true,
        createdAt: serverTimestamp()
      });
      return challengeRef.id;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  },

  // Get active challenges
  async getActiveChallenges() {
    try {
      const challengesQuery = query(
        collection(db, 'challenges'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(challengesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting active challenges:', error);
      throw error;
    }
  },

  // Get user's active challenges
  async getUserChallenges(userId) {
    try {
      const challenges = await this.getActiveChallenges();
      
      const userChallenges = await Promise.all(
        challenges.map(async (challenge) => {
          const progress = await this.getUserProgress(challenge.id, userId);
          return {
            ...challenge,
            userProgress: progress
          };
        })
      );
      
      return userChallenges;
    } catch (error) {
      console.error('Error getting user challenges:', error);
      throw error;
    }
  },

  // Join challenge
  async joinChallenge(challengeId, userId) {
    try {
      const progressRef = doc(db, 'challenges', challengeId, 'participants', userId);
      const progressSnap = await getDoc(progressRef);
      
      if (!progressSnap.exists()) {
        await setDoc(progressRef, {
          userId,
          challengeId,
          progress: 0,
          isCompleted: false,
          joinedAt: serverTimestamp()
        });
        
        const challengeRef = doc(db, 'challenges', challengeId);
        await updateDoc(challengeRef, {
          participants: increment(1)
        });
        
        const challenge = await getDoc(challengeRef);
        await notificationService.create(userId, {
          type: 'challenge',
          message: `You joined: ${challenge.data().title}`,
          relatedId: challengeId,
          icon: '🎯'
        });
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  },

  // Update challenge progress
  async updateProgress(challengeId, userId, progressAmount) {
    try {
      const progressRef = doc(db, 'challenges', challengeId, 'participants', userId);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const data = progressSnap.data();
        const newProgress = data.progress + progressAmount;
        
        const challengeSnap = await getDoc(doc(db, 'challenges', challengeId));
        const challenge = challengeSnap.data();
        
        const isCompleted = newProgress >= challenge.target;
        
        await updateDoc(progressRef, {
          progress: newProgress,
          isCompleted,
          completedAt: isCompleted ? serverTimestamp() : null
        });
        
        if (isCompleted && !data.isCompleted) {
          // Award rewards
          if (challenge.rewardType === 'XP') {
            await userService.addXP(userId, challenge.reward);
          } else if (challenge.rewardType === 'COINS') {
            await userService.addCoins(userId, challenge.reward);
          }
          
          const statsRef = doc(db, 'users', userId, 'stats', 'current');
          await updateDoc(statsRef, {
            challengesCompleted: increment(1)
          });
          
          await notificationService.create(userId, {
            type: 'challenge',
            message: `Challenge completed! +${challenge.reward} ${challenge.rewardType}`,
            relatedId: challengeId,
            icon: '🏆'
          });
          
          await activityService.create(userId, {
            action: 'completed',
            target: challenge.title,
            targetType: 'challenge',
            icon: '🎯',
            color: '#8b5cf6'
          });
          
          // Check achievements
          const stats = (await getDoc(statsRef)).data();
          await achievementService.checkAchievements(userId, stats);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  // Get user's challenge progress
  async getUserProgress(challengeId, userId) {
    try {
      const progressRef = doc(db, 'challenges', challengeId, 'participants', userId);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        return progressSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  },

  // Get challenge leaderboard
  async getChallengeLeaderboard(challengeId) {
    try {
      const participantsQuery = query(
        collection(db, 'challenges', challengeId, 'participants'),
        orderBy('progress', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(participantsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting challenge leaderboard:', error);
      throw error;
    }
  }
};

// ============================================
// 8. NOTIFICATION SERVICE (COMPLETE)
// ============================================

export const notificationService = {
  // Create notification
  async create(userId, notificationData) {
    try {
      const notifRef = doc(collection(db, 'notifications', userId, 'items'));
      await setDoc(notifRef, {
        id: notifRef.id,
        userId,
        ...notificationData,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
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
  async getWeeklyLeaderboard(limitCount = 100) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const rankings = [];
      
      for (let i = 0; i < snapshot.docs.length; i++) {
        const userDoc = snapshot.docs[i];
        const statsSnap = await getDoc(doc(db, 'users', userDoc.id, 'stats', 'current'));
        
        if (statsSnap.exists() && statsSnap.data().weeklyXP > 0) {
          rankings.push({
            userId: userDoc.id,
            weeklyXP: statsSnap.data().weeklyXP || 0,
            name: userDoc.data().name,
            avatar: userDoc.data().avatar,
            username: userDoc.data().username,
            league: userDoc.data().league,
            streak: statsSnap.data().streak || 0,
            crowns: statsSnap.data().crowns || 0
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



}