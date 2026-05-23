import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  currentUser: () => auth.currentUser,
  
  onAuthStateChanged: (callback) => {
    return auth.onAuthStateChanged(callback);
  }
};

// ============================================
// USER SERVICE
// ============================================
export const userService = {
  // Get complete user profile
  getUserComplete: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get user's friends list
  getFriends: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) return [];
      
      const friendIds = userDoc.data().friends || [];
      if (friendIds.length === 0) return [];

      // Get all friend profiles
      const friendsPromises = friendIds.map(friendId => 
        getDoc(doc(db, 'users', friendId))
      );
      
      const friendsDocs = await Promise.all(friendsPromises);
      return friendsDocs
        .filter(doc => doc.exists())
        .map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting friends:', error);
      return [];
    }
  },

  // Search users by name or username
  searchUsers: async (searchQuery, limitCount = 20) => {
    try {
      const usersRef = collection(db, 'users');
      
      // Search by name (case-insensitive)
      const nameQuery = query(
        usersRef,
        where('nameLower', '>=', searchQuery.toLowerCase()),
        where('nameLower', '<=', searchQuery.toLowerCase() + '\uf8ff'),
        limit(limitCount)
      );
      
      const nameSnapshot = await getDocs(nameQuery);
      const nameResults = nameSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Search by username
      const usernameQuery = query(
        usersRef,
        where('usernameLower', '>=', searchQuery.toLowerCase()),
        where('usernameLower', '<=', searchQuery.toLowerCase() + '\uf8ff'),
        limit(limitCount)
      );
      
      const usernameSnapshot = await getDocs(usernameQuery);
      const usernameResults = usernameSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Combine and deduplicate results
      const allResults = [...nameResults, ...usernameResults];
      const uniqueResults = Array.from(
        new Map(allResults.map(user => [user.id, user])).values()
      );

      return uniqueResults.slice(0, limitCount);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  // Update user profile
  updateUser: async (uid, updates) => {
    try {
      const userRef = doc(db, 'users', uid);
      
      // Add lowercase fields for searching
      if (updates.name) {
        updates.nameLower = updates.name.toLowerCase();
      }
      if (updates.username) {
        updates.usernameLower = updates.username.toLowerCase();
      }
      
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
  updateStats: async (uid, stats) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        stats: stats,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  // Add XP to user
  addXP: async (uid, amount) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'stats.totalXP': increment(amount),
        'stats.weeklyXP': increment(amount),
        'stats.monthlyXP': increment(amount),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }
};

// ============================================
// FRIENDSHIP SERVICE
// ============================================
export const friendshipService = {
  // Send friend request
  sendRequest: async (fromId, toId) => {
    try {
      // Check if request already exists
      const existingQuery = query(
        collection(db, 'friendRequests'),
        where('fromId', '==', fromId),
        where('toId', '==', toId),
        where('status', '==', 'pending')
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      if (!existingSnapshot.empty) {
        throw new Error('Friend request already sent');
      }

      // Check if they're already friends
      const userDoc = await getDoc(doc(db, 'users', fromId));
      const friends = userDoc.data()?.friends || [];
      if (friends.includes(toId)) {
        throw new Error('Already friends');
      }

      // Create friend request
      const requestRef = await addDoc(collection(db, 'friendRequests'), {
        fromId,
        toId,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Get sender info for notification
      const senderDoc = await getDoc(doc(db, 'users', fromId));
      const senderName = senderDoc.data()?.name || 'Someone';

      // Create notification
      await addDoc(collection(db, 'notifications'), {
        userId: toId,
        type: 'friend_request',
        fromId,
        fromName: senderName,
        message: `${senderName} sent you a friend request`,
        icon: '👥',
        read: false,
        createdAt: serverTimestamp(),
        requestId: requestRef.id
      });

      return requestRef.id;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  // Accept friend request
  acceptRequest: async (requestId) => {
    try {
      const requestDoc = await getDoc(doc(db, 'friendRequests', requestId));
      if (!requestDoc.exists()) {
        throw new Error('Friend request not found');
      }

      const { fromId, toId } = requestDoc.data();

      // Update friend request status
      await updateDoc(doc(db, 'friendRequests', requestId), {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });

      // Add each other as friends
      await updateDoc(doc(db, 'users', fromId), {
        friends: arrayUnion(toId),
        'stats.friendsCount': increment(1)
      });

      await updateDoc(doc(db, 'users', toId), {
        friends: arrayUnion(fromId),
        'stats.friendsCount': increment(1)
      });

      // Get accepter info
      const accepterDoc = await getDoc(doc(db, 'users', toId));
      const accepterName = accepterDoc.data()?.name || 'Someone';

      // Notify the requester
      await addDoc(collection(db, 'notifications'), {
        userId: fromId,
        type: 'friend_accepted',
        fromId: toId,
        fromName: accepterName,
        message: `${accepterName} accepted your friend request`,
        icon: '✅',
        read: false,
        createdAt: serverTimestamp()
      });

      // Create activity
      await addDoc(collection(db, 'activities'), {
        userId: toId,
        userName: accepterName,
        action: 'became friends with',
        target: accepterDoc.data()?.name || 'Unknown',
        icon: '🤝',
        color: '#10b981',
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  // Reject friend request
  rejectRequest: async (requestId) => {
    try {
      await updateDoc(doc(db, 'friendRequests', requestId), {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  },

  // Remove friend
  removeFriend: async (userId, friendId) => {
    try {
      // Remove from both users' friend lists
      await updateDoc(doc(db, 'users', userId), {
        friends: arrayRemove(friendId),
        'stats.friendsCount': increment(-1)
      });

      await updateDoc(doc(db, 'users', friendId), {
        friends: arrayRemove(userId),
        'stats.friendsCount': increment(-1)
      });
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },

  // Get pending friend requests
  getPendingRequests: async (userId) => {
    try {
      const q = query(
        collection(db, 'friendRequests'),
        where('toId', '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const requests = [];

      for (const doc of snapshot.docs) {
        const requestData = doc.data();
        const senderDoc = await getDoc(doc(db, 'users', requestData.fromId));
        
        requests.push({
          id: doc.id,
          ...requestData,
          sender: senderDoc.exists() ? { id: senderDoc.id, ...senderDoc.data() } : null
        });
      }

      return requests;
    } catch (error) {
      console.error('Error getting pending requests:', error);
      return [];
    }
  }
};

// ============================================
// GROUP SERVICE
// ============================================
export const groupService = {
  // Get all groups
  getAllGroups: async () => {
    try {
      const groupsSnapshot = await getDocs(collection(db, 'groups'));
      return groupsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting groups:', error);
      return [];
    }
  },

  // Join group
  joinGroup: async (groupId, userId) => {
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        memberIds: arrayUnion(userId),
        members: increment(1)
      });

      await updateDoc(doc(db, 'users', userId), {
        'stats.groupsCount': increment(1)
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  // Leave group
  leaveGroup: async (groupId, userId) => {
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        memberIds: arrayRemove(userId),
        members: increment(-1)
      });

      await updateDoc(doc(db, 'users', userId), {
        'stats.groupsCount': increment(-1)
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  },

  // Create post in group
  createPost: async (groupId, userId, content) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      const postRef = await addDoc(collection(db, 'posts'), {
        groupId,
        userId,
        user: {
          name: userData.name,
          avatar: userData.avatar,
          username: userData.username
        },
        content,
        reactions: {
          fire: 0,
          heart: 0,
          thumbsUp: 0
        },
        commentsCount: 0,
        createdAt: serverTimestamp()
      });

      return postRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get group posts
  getGroupPosts: async (groupId, limitCount = 20) => {
    try {
      const q = query(
        collection(db, 'posts'),
        where('groupId', '==', groupId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  // Add reaction to post
  addReaction: async (groupId, postId, reactionType) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        [`reactions.${reactionType}`]: increment(1)
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }
};

// ============================================
// CHALLENGE SERVICE
// ============================================
export const challengeService = {
  // Get active challenges
  getActiveChallenges: async () => {
    try {
      const q = query(
        collection(db, 'challenges'),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting challenges:', error);
      return [];
    }
  },

  // Get user's challenges
  getUserChallenges: async (userId) => {
    try {
      const q = query(
        collection(db, 'userChallenges'),
        where('userId', '==', userId),
        where('completed', '==', false)
      );

      const snapshot = await getDocs(q);
      const userChallenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get challenge details
      const challengeIds = [...new Set(userChallenges.map(uc => uc.challengeId))];
      const challengePromises = challengeIds.map(id => 
        getDoc(doc(db, 'challenges', id))
      );

      const challengeDocs = await Promise.all(challengePromises);
      const challengesMap = {};
      challengeDocs.forEach(doc => {
        if (doc.exists()) {
          challengesMap[doc.id] = { id: doc.id, ...doc.data() };
        }
      });

      // Merge user progress with challenge data
      return userChallenges.map(uc => ({
        ...challengesMap[uc.challengeId],
        userProgress: uc
      }));
    } catch (error) {
      console.error('Error getting user challenges:', error);
      return [];
    }
  },

  // Join challenge
  joinChallenge: async (challengeId, userId) => {
    try {
      // Check if already joined
      const existingQuery = query(
        collection(db, 'userChallenges'),
        where('userId', '==', userId),
        where('challengeId', '==', challengeId)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      if (!existingSnapshot.empty) {
        throw new Error('Already joined this challenge');
      }

      // Join challenge
      await addDoc(collection(db, 'userChallenges'), {
        userId,
        challengeId,
        progress: 0,
        completed: false,
        joinedAt: serverTimestamp()
      });

      // Increment participant count
      await updateDoc(doc(db, 'challenges', challengeId), {
        participants: increment(1)
      });

      await updateDoc(doc(db, 'users', userId), {
        'stats.challengesJoined': increment(1)
      });
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  },

  // Update challenge progress
  updateProgress: async (challengeId, userId, progress) => {
    try {
      const q = query(
        collection(db, 'userChallenges'),
        where('userId', '==', userId),
        where('challengeId', '==', challengeId)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        throw new Error('User challenge not found');
      }

      const userChallengeId = snapshot.docs[0].id;
      const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
      const target = challengeDoc.data()?.target || 100;

      const isCompleted = progress >= target;

      await updateDoc(doc(db, 'userChallenges', userChallengeId), {
        progress,
        completed: isCompleted,
        completedAt: isCompleted ? serverTimestamp() : null
      });

      if (isCompleted) {
        const reward = challengeDoc.data()?.reward || 0;
        await userService.addXP(userId, reward);
        
        await updateDoc(doc(db, 'users', userId), {
          'stats.challengesCompleted': increment(1)
        });
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }
};

// ============================================
// NOTIFICATION SERVICE
// ============================================
export const notificationService = {
  // Get user notifications
  getUserNotifications: async (userId) => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (userId, notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc =>
        updateDoc(doc.ref, {
          read: true,
          readAt: serverTimestamp()
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  // Listen to notifications in real-time
  listenToNotifications: (userId, callback) => {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    });
  }
};

// ============================================
// ACTIVITY SERVICE
// ============================================
export const activityService = {
  // Get recent activities
  getRecentActivities: async (limitCount = 50) => {
    try {
      const q = query(
        collection(db, 'activities'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  },

  // Get friends' activities
  getFriendsActivities: async (userId, limitCount = 50) => {
    try {
      // Get user's friends
      const userDoc = await getDoc(doc(db, 'users', userId));
      const friendIds = userDoc.data()?.friends || [];

      if (friendIds.length === 0) return [];

      // Get activities from friends
      const q = query(
        collection(db, 'activities'),
        where('userId', 'in', friendIds),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting friends activities:', error);
      return [];
    }
  }
};

// ============================================
// LEADERBOARD SERVICE
// ============================================
export const leaderboardService = {
  // Get weekly leaderboard
  getWeeklyLeaderboard: async (limitCount = 100) => {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('stats.weeklyXP', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        ...doc.data(),
        weeklyXP: doc.data().stats?.weeklyXP || 0
      }));
    } catch (error) {
      console.error('Error getting weekly leaderboard:', error);
      return [];
    }
  },

  // Get global leaderboard
  getGlobalLeaderboard: async (limitCount = 100) => {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('stats.totalXP', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting global leaderboard:', error);
      return [];
    }
  }
};

// ============================================
// LEAGUE SERVICE
// ============================================
export const leagueService = {
  // Get league leaderboard
  getLeagueLeaderboard: async (league, limitCount = 50) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('league', '==', league),
        orderBy('stats.totalXP', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting league leaderboard:', error);
      return [];
    }
  },

  // Calculate league based on XP
  calculateLeague: (totalXP) => {
    if (totalXP >= 5000) return 'DIAMOND';
    if (totalXP >= 2000) return 'PLATINUM';
    if (totalXP >= 1000) return 'GOLD';
    if (totalXP >= 500) return 'SILVER';
    return 'BRONZE';
  }
};

// ============================================
// ACHIEVEMENT SERVICE
// ============================================
export const achievementService = {
  // Get user achievements
  getUserAchievements: async (userId) => {
    try {
      const q = query(
        collection(db, 'userAchievements'),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }
};