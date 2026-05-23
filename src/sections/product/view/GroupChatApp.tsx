import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { getDoc, setDoc } from 'firebase/firestore';

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Plus, CheckCircle, Circle, Clock, Flame, Trophy, Users, Camera, MessageCircle, TrendingUp, X, Send, Heart, ThumbsUp, Star, Target, Zap, Award, Calendar, BarChart3, ChevronDown, ChevronUp, Sparkles, User, LogOut, Edit3, Trash2 } from 'lucide-react';

// Action Types Configuration
const ACTION_TYPES = {
PRACTICE: { label: 'Practice', icon: '🎯', color: 'from-blue-500 to-blue-600', points: 10 },
WIN: { label: 'Win', icon: '🏆', color: 'from-yellow-500 to-orange-500', points: 20 },
SHARE: { label: 'Share', icon: '💬', color: 'from-green-500 to-emerald-600', points: 15 },
REFLECT: { label: 'Reflect', icon: '🤔', color: 'from-purple-500 to-pink-500', points: 10 }
};

// Predefined Actions
const PREDEFINED_ACTIONS = [
{ label: 'Morning Workout', type: 'PRACTICE', duration: 30, category: 'Fitness' },
{ label: 'Read 10 Pages', type: 'PRACTICE', duration: 20, category: 'Learning' },
{ label: 'Meditation Session', type: 'PRACTICE', duration: 15, category: 'Wellness' },
{ label: 'Complete Project Task', type: 'WIN', duration: 60, category: 'Work' },
{ label: 'Help a Friend', type: 'SHARE', duration: 30, category: 'Social' },
{ label: 'Journal Entry', type: 'REFLECT', duration: 15, category: 'Personal' },
];

// Mock initial data
//const INITIAL_ACTIONS = [
//{ id: '1', userId: 'user1', userName: 'You', type: 'PRACTICE', title: 'Morning Workout', duration: 30, status: 'committed', deadline: new Date(Date.now() + 3600000), createdAt: Date.now() - 7200000, category: 'Fitness' },
//{ id: '2', userId: 'user1', userName: 'You', type: 'WIN', title: 'Complete Project', duration: 45, status: 'completed', deadline: new Date(), createdAt: Date.now() - 3600000, completedAt: Date.now() - 1800000, category: 'Work' },
//{ id: '3', userId: 'user2', userName: 'Sarah', type: 'PRACTICE', title: 'Morning Yoga', duration: 20, status: 'completed', deadline: new Date(), createdAt: Date.now() - 5400000, completedAt: Date.now() - 900000, category: 'Wellness' },
//];

//const INITIAL_CHECKINS = [
//{ id: 'c1', actionId: '2', userId: 'user1', userName: 'You', text: 'Crushed it! 💪 Finished ahead of schedule.', timestamp: Date.now() - 1800000, reactions: { '🔥': 2, '💪': 3 }, image: null },
//{ id: 'c2', actionId: '3', userId: 'user2', userName: 'Sarah', text: 'Great session today! Feeling energized.', timestamp: Date.now() - 900000, reactions: { '❤️': 1, '🔥': 2 }, image: null },
//];

function GroupChat({ groupId, groupName, groupMembers, activeMembers, onBack }) {


const currentGroup = {
  id: groupId || 'group1',
  name: groupName || 'Fitness Warriors',
  members: groupMembers || 15,
  activeMembers: activeMembers || 8
};


const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');

const [view, setView] = useState('home');
const [showActionModal, setShowActionModal] = useState(false);
const [showFloatingMenu, setShowFloatingMenu] = useState(false);
const [showCheckInModal, setShowCheckInModal] = useState(null);
const [showQuickActions, setShowQuickActions] = useState(false);
const [showHistory, setShowHistory] = useState(false);
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [userProfile, setUserProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [notification, setNotification] = useState(null);
const [showConfetti, setShowConfetti] = useState(false);

const [authLoading, setAuthLoading] = useState(true);
const [actions, setActions] = useState([]);
const [checkIns, setCheckIns] = useState([]);
const [newActionTitle, setNewActionTitle] = useState('');
const [newActionType, setNewActionType] = useState('PRACTICE');
const [newActionDuration, setNewActionDuration] = useState(30);
const [checkInText, setCheckInText] = useState('');
const [dailyGoal, setDailyGoal] = useState(3);

// Load actions from Firebase
useEffect(() => {
  if (!currentUser?.uid) return;
  
  const actionsRef = collection(db, 'actions');
  const q = query(
    actionsRef, 
    where('groupId', '==', currentGroup.id),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const actionsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deadline: doc.data().deadline?.toDate(),
      createdAt: doc.data().createdAt?.toMillis(),
      completedAt: doc.data().completedAt?.toMillis()
    }));
    setActions(actionsData);
    setLoading(false);
  });
  
  return () => unsubscribe();
}, [currentUser?.uid, currentGroup.id]);

// Load check-ins from Firebase


// Load chat messages from Firebase
useEffect(() => {
  if (!currentUser?.uid) return;
  
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('groupId', '==', currentGroup.id),
    orderBy('timestamp', 'asc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messagesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis()
    }));
    setMessages(messagesData);
  });
  
  return () => unsubscribe();
}, [currentUser?.uid, currentGroup.id]);



// Listen to Firebase auth state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setCurrentUser(user);
      
      // Load or create user profile
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          // Create new user profile
          const newProfile = {
            name: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL,
            streak: 0,
            points: 0,
            level: 1,
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    } else {
      setCurrentUser(null);
      setUserProfile(null);
    }
    setAuthLoading(false);
  });

  return () => unsubscribe();
}, []);


// Load chat messages from Firebase
useEffect(() => {
  if (!currentUser?.uid) return;
  
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('groupId', '==', currentGroup.id),
    orderBy('timestamp', 'asc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messagesData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toMillis() || Date.now()
      };
    });
    setMessages(messagesData);
    
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      const messagesContainer = document.querySelector('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  });
  
  return () => unsubscribe();
}, [currentUser?.uid, currentGroup.id]);


// Calculate stats
const todayActions = actions.filter(a => {
const today = new Date().setHours(0, 0, 0, 0);
const tomorrow = today + 24 * 60 * 60 * 1000;
return a.createdAt >= today && a.createdAt < tomorrow;
});

const completedActions = actions.filter(a => a.status === 'completed');
const totalXP = completedActions.reduce((sum, a) => sum + ACTION_TYPES[a.type].points, 0);
const currentStreak = userProfile?.streak || 0;
const todayXP = todayActions.filter(a => a.status === 'completed').reduce((sum, a) => sum + ACTION_TYPES[a.type].points, 0);
const goalProgress = (todayActions.length / dailyGoal) * 100;

// Weekly activity data
const getWeeklyData = () => {
const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const today = new Date();
const weekData = [];

for (let i = 6; i >= 0; i--) {
const date = new Date(today);
date.setDate(date.getDate() - i);
date.setHours(0, 0, 0, 0);

const nextDate = new Date(date);
nextDate.setDate(nextDate.getDate() + 1);

const count = actions.filter(a =>
a.createdAt >= date.getTime() && a.createdAt < nextDate.getTime()
).length;

weekData.push({
day: days[date.getDay()],
actions: count,
date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
});
}

return weekData;
};

const weeklyChartData = getWeeklyData();
const maxWeeklyActions = Math.max(...weeklyChartData.map(d => d.actions), 1);


// Chat message handlers
const sendMessage = async () => {
  if (!newMessage.trim()) return;

  try {
    const message = {
      groupId: currentGroup.id,
      userId: currentUser.uid,
      userName: userProfile?.name || currentUser.displayName || 'User',
      userPhotoURL: currentUser.photoURL || null,
      text: newMessage,
      timestamp: serverTimestamp(),
      reactions: {}
    };

    await addDoc(collection(db, 'messages'), message);
    setNewMessage('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      const messagesContainer = document.querySelector('.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  } catch (error) {
    console.error('Error sending message:', error);
    showNotification('❌ Failed to send message');
  }
};

const addMessageReaction = async (messageId, emoji) => {
  try {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    const reactions = { ...message.reactions };
    const reactionKey = `${emoji}_${currentUser.uid}`;
    
    if (reactions[reactionKey]) {
      delete reactions[reactionKey];
    } else {
      reactions[reactionKey] = {
        emoji,
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName || 'User'
      };
    }
    
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, { reactions });
  } catch (error) {
    console.error('Error adding reaction:', error);
  }
};

const deleteMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, 'messages', messageId));
  } catch (error) {
    console.error('Error deleting message:', error);
    showNotification('❌ Failed to delete message');
  }
};


// Handlers
const showNotification = (message) => {
setNotification(message);
setTimeout(() => setNotification(null), 3000);
};

const triggerConfetti = () => {
setShowConfetti(true);
setTimeout(() => setShowConfetti(false), 3000);
};

// REPLACE ENTIRE FUNCTION WITH:
const createAction = async () => {
  if (!newActionTitle.trim()) return;

  try {
    const newAction = {
      userId: currentUser.uid,
      userName: userProfile?.name || currentUser.displayName || 'User',
      groupId: currentGroup.id,
      type: newActionType,
      title: newActionTitle,
      duration: newActionDuration,
      status: 'committed',
      deadline: new Date(Date.now() + newActionDuration * 60000),
      createdAt: serverTimestamp(),
      category: 'Custom'
    };

    await addDoc(collection(db, 'actions'), newAction);
    
    const xp = ACTION_TYPES[newActionType].points;
    showNotification(`🎉 Action committed! +${xp} XP when completed`);
    setNewActionTitle('');
    setShowActionModal(false);
    setShowFloatingMenu(false);
  } catch (error) {
    console.error('Error creating action:', error);
    showNotification('❌ Failed to create action');
  }
};


const createQuickAction = async (template) => {
  if (!template) return;

  try {
    const newAction = {
      userId: currentUser.uid,
userName: userProfile?.name || currentUser.displayName || 'User',
      groupId: currentGroup.id,
      type: template.type,
      title: template.label,
      duration: template.duration,
      status: 'committed',
      deadline: new Date(Date.now() + template.duration * 60000),
      createdAt: serverTimestamp(),
      category: template.category
    };

    await addDoc(collection(db, 'actions'), newAction);
    
    const xp = ACTION_TYPES[template.type].points;
    showNotification(`🎯 ${template.label} committed! +${xp} XP when completed`);
    setShowQuickActions(false);
  } catch (error) {
    console.error('Error creating quick action:', error);
    showNotification('❌ Failed to create action');
  }
};

const completeAction = async (actionId) => {
  try {
    const actionRef = doc(db, 'actions', actionId);
    await updateDoc(actionRef, {
      status: 'completed',
      completedAt: serverTimestamp()
    });

    const action = actions.find(a => a.id === actionId);
    if (action) {
      const xp = ACTION_TYPES[action.type].points;
      showNotification(`✅ Completed! +${xp} XP earned!`);
      triggerConfetti();
    }
  } catch (error) {
    console.error('Error completing action:', error);
    showNotification('❌ Failed to complete action');
  }
};

const deleteAction = async (actionId) => {
  try {
    await deleteDoc(doc(db, 'actions', actionId));
    showNotification('Action deleted');
  } catch (error) {
    console.error('Error deleting action:', error);
    showNotification('❌ Failed to delete action');
  }
};

// REPLACE WITH:
const submitCheckIn = async () => {
  if (!checkInText.trim() || !showCheckInModal) return;

  try {
    const newCheckIn = {
      actionId: showCheckInModal,
      userId: currentUser.uid,
      userName: userProfile?.name || currentUser.displayName || 'User',
      groupId: currentGroup.id,
      text: checkInText,
      timestamp: serverTimestamp(),
      reactions: {},
      image: null
    };

    await addDoc(collection(db, 'checkIns'), newCheckIn);
    await completeAction(showCheckInModal);
    
    setCheckInText('');
    setShowCheckInModal(null);
  } catch (error) {
    console.error('Error submitting check-in:', error);
    showNotification('❌ Failed to submit check-in');
  }
};

// REPLACE WITH:
const addReaction = async (checkInId, emoji) => {
  try {
    const checkIn = checkIns.find(c => c.id === checkInId);
    if (!checkIn) return;
    
    const reactions = { ...checkIn.reactions };
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    
    const checkInRef = doc(db, 'checkIns', checkInId);
    await updateDoc(checkInRef, { reactions });
  } catch (error) {
    console.error('Error adding reaction:', error);
  }
};

const formatTimeAgo = (timestamp) => {
const minutes = Math.floor((Date.now() - timestamp) / 60000);
if (minutes < 1) return 'Just now';
if (minutes < 60) return `${minutes}m ago`;
const hours = Math.floor(minutes / 60);
if (hours < 24) return `${hours}h ago`;
return `${Math.floor(hours / 24)}d ago`;
};

// Show loading while checking auth
if (authLoading) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-purple-300 text-lg">Loading...</p>
      </div>
    </div>
  );
}

// Redirect if not authenticated
if (!currentUser) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div className="text-center">
        <p className="text-purple-300 text-xl mb-4">Please log in to continue</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

return (
<div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-20">

{loading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-purple-300 text-lg">Loading...</p>
    </div>
  </div>
)}

{/* HEADER */}
<div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
<div className="px-4 md:px-6 lg:px-10 py-3 md:py-4">
<div className="flex items-center justify-between gap-3">
{/* User Info */}
<div className="flex items-center gap-2 md:gap-3">
<div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-700 flex items-center justify-center border-2 border-purple-400 shadow-lg">
<User className="w-4 h-4 md:w-5 md:h-5" />
</div>
<div className="hidden sm:block">
<p className="text-sm md:text-base font-bold text-purple-100">{userProfile?.name || currentUser.displayName || 'User'}</p>
<p className="text-xs text-purple-300">Level {userProfile?.level || 1}</p>
</div>
</div>

{/* Group Name */}
<div className="flex-1 text-center">
<h1 className="text-lg md:text-xl font-bold text-purple-100">{currentGroup.name}</h1>
<p className="text-xs text-purple-300">{currentGroup.activeMembers} active members</p>
</div>

{/* Stats Pills */}
<div className="flex items-center gap-2 md:gap-3">
<div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-orange-500/20 rounded-full border border-orange-400/30">
<Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
<span className="text-xs md:text-sm font-bold text-orange-100">{userProfile?.streak || 0}</span>
</div>

<div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-green-500/20 rounded-full border border-green-400/30">
<Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" />
<span className="text-xs md:text-sm font-bold text-green-100">{todayActions.length}/{dailyGoal}</span>
</div>
</div>
</div>
</div>
</div>

{/* NAVIGATION TABS */}
<div className="sticky top-[72px] z-40 bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-indigo-900/90 backdrop-blur-sm border-b border-purple-500/20">
<div className="flex items-center justify-around px-4">
{['home', 'progress', 'feed', 'chat'].map(tab => (
<button
key={tab}
onClick={() => setView(tab)}
className={`flex-1 py-3 md:py-4 text-sm md:text-base font-semibold capitalize transition-all ${
view === tab
? 'text-white border-b-2 border-purple-400'
: 'text-purple-400 hover:text-purple-300'
}`}
>
{tab}
</button>
))}
</div>
</div>

<div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto">

{/* HOME VIEW */}
{view === 'home' && (
<>
{/* Welcome */}
<div className="mb-6 md:mb-8">
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-100 mb-2">
Welcome back, {(userProfile?.name || currentUser.displayName || 'User').split(' ')[0]}!
</h2>
<p className="text-sm md:text-base text-purple-200 italic">
"Every conversation is a chance to grow."
</p>
</div>

{/* TODAY'S COMMITMENTS */}
<div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-5 md:p-6 lg:p-8 mb-6 md:mb-8">
<div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
<Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
</div>
<div>
<h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100 mb-1">My Commitments</h3>
<p className="text-xs md:text-sm text-purple-300">Today's actions</p>
</div>
</div>

{/* Progress Bar */}
<div className="mb-5">
<div className="flex items-center justify-between mb-2">
<p className="text-sm md:text-base text-purple-300 font-medium">Daily Goal Progress</p>
<p className="text-lg md:text-xl font-bold text-white">{todayActions.length}/{dailyGoal}</p>
</div>
<div className="h-3 md:h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
<div
className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
style={{ width: `${Math.min(goalProgress, 100)}%` }}
/>
</div>
<p className="text-xs md:text-sm text-purple-300 mt-2 text-right font-medium">{Math.round(goalProgress)}% complete</p>
</div>

{/* Action List */}
{todayActions.length === 0 ? (
<div className="text-center py-8 bg-purple-950/30 rounded-2xl border border-purple-700/30">
<Target className="w-16 h-16 text-purple-500/50 mx-auto mb-3" />
<p className="text-base text-purple-300 mb-2">No commitments yet today</p>
<p className="text-sm text-purple-400">Create your first action below! 🚀</p>
</div>
) : (
<div className="space-y-3">
{todayActions.map(action => {
const typeConfig = ACTION_TYPES[action.type];
return (
<div key={action.id} className="p-4 bg-purple-950/40 rounded-2xl border border-purple-700/30 hover:border-purple-600/50 transition-all">
<div className="flex items-start justify-between">
<div className="flex-1">
<div className="flex items-center gap-3 mb-2">
<span className="text-3xl">{typeConfig.icon}</span>
<div>
<h4 className="font-bold text-white text-base">{action.title}</h4>
<p className="text-xs text-purple-400">{action.duration} min • {action.category}</p>
</div>
</div>
<div className="flex items-center gap-2 text-xs text-purple-400">
{action.status === 'completed' ? (
<span className="flex items-center gap-1 text-green-400">
<CheckCircle className="w-4 h-4" />
Completed {formatTimeAgo(action.completedAt)}
</span>
) : (
<span className="flex items-center gap-1">
<Clock className="w-4 h-4" />
Due in {Math.ceil((action.deadline - Date.now()) / 60000)} min
</span>
)}
</div>
</div>
{action.status !== 'completed' && (
<button
onClick={() => setShowCheckInModal(action.id)}
className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-sm font-bold transition-all shadow-lg"
>
Check In
</button>
)}
</div>
</div>
);
})}
</div>
)}
</div>

{/* QUICK ACTIONS */}
<div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-5 md:p-6 mb-6 md:mb-8">
<button
onClick={() => setShowQuickActions(!showQuickActions)}
className="w-full flex items-center justify-between mb-4"
>
<div className="flex items-center gap-3">
<Zap className="w-6 h-6 text-yellow-400" />
<h3 className="text-xl font-bold text-purple-100">Quick Actions</h3>
</div>
{showQuickActions ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
</button>

{showQuickActions && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
{PREDEFINED_ACTIONS.map((action, idx) => {
const typeConfig = ACTION_TYPES[action.type];
return (
<button
key={idx}
onClick={() => createQuickAction(action)}
className="p-4 bg-gradient-to-br from-purple-800/40 to-indigo-800/40 rounded-2xl border border-purple-500/20 hover:border-purple-400/50 transition-all text-left hover:scale-[1.02]"
>
<div className="flex items-center gap-3 mb-2">
<span className="text-3xl">{typeConfig.icon}</span>
<div>
<h4 className="font-bold text-white text-sm">{action.label}</h4>
<p className="text-xs text-purple-400">+{typeConfig.points} XP • {action.duration} min</p>
</div>
</div>
<p className="text-xs text-purple-500">{action.category}</p>
</button>
);
})}
</div>
)}
</div>
</>
)}

{/* PROGRESS VIEW */}
{view === 'progress' && (
<>
{/* Stats Grid */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
<div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-3xl border-2 border-purple-500/30 shadow-xl">
<div className="flex items-center gap-2 mb-2">
<Trophy className="w-6 h-6 text-yellow-400" />
<span className="text-purple-300 text-sm font-medium">Total XP</span>
</div>
<p className="text-4xl font-bold text-white mb-1">{totalXP}</p>
<p className="text-purple-400 text-sm">Level {currentUser.level}</p>
</div>

<div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-3xl border-2 border-pink-500/30 shadow-xl">
<div className="flex items-center gap-2 mb-2">
<Flame className="w-6 h-6 text-orange-400" />
<span className="text-purple-300 text-sm font-medium">Streak</span>
</div>
<p className="text-4xl font-bold text-white mb-1">{currentStreak}</p>
<p className="text-purple-400 text-sm">days</p>
</div>

<div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-3xl border-2 border-indigo-500/30 shadow-xl">
<div className="flex items-center gap-2 mb-2">
<CheckCircle className="w-6 h-6 text-green-400" />
<span className="text-purple-300 text-sm font-medium">Actions</span>
</div>
<p className="text-4xl font-bold text-white mb-1">{completedActions.length}</p>
<p className="text-purple-400 text-sm">completed</p>
</div>

<div className="bg-gradient-to-br from-purple-800/60 to-indigo-900/60 backdrop-blur-sm p-5 rounded-3xl border-2 border-purple-500/30 shadow-xl">
<div className="flex items-center gap-2 mb-2">
<TrendingUp className="w-6 h-6 text-emerald-400" />
<span className="text-purple-300 text-sm font-medium">Today</span>
</div>
<p className="text-4xl font-bold text-white mb-1">{todayActions.length}</p>
<p className="text-purple-400 text-sm">actions</p>
</div>
</div>

{/* Weekly Chart */}
<div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 mb-8 shadow-2xl">
<div className="flex items-center gap-3 mb-6">
<BarChart3 className="w-6 h-6 text-purple-400" />
<h2 className="text-2xl font-bold text-purple-100">Weekly Activity</h2>
</div>

<div className="flex items-end justify-between gap-3 h-40">
{weeklyChartData.map((day, idx) => (
<div key={idx} className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-purple-950/50 rounded-t-xl relative overflow-hidden border border-purple-700/30" style={{ height: '100%' }}>
<div
className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-xl transition-all duration-500 shadow-lg"
style={{ height: `${(day.actions / maxWeeklyActions) * 100}%` }}
/>
{day.actions > 0 && (
<span className="absolute top-1 left-1/2 -translate-x-1/2 text-sm font-bold text-white drop-shadow">
{day.actions}
</span>
)}
</div>
<p className="text-sm font-bold text-purple-200">{day.day}</p>
</div>
))}
</div>
</div>
</>
)}

{/* FEED VIEW */}
{view === 'feed' && (
<div className="space-y-4">
<h2 className="text-2xl font-bold text-purple-100 mb-4">Group Activity</h2>

{checkIns.length === 0 ? (
<div className="text-center py-16 bg-purple-900/20 rounded-3xl border-2 border-purple-500/20">
<MessageCircle className="w-20 h-20 text-purple-500/50 mx-auto mb-4" />
<p className="text-purple-300 text-lg mb-2">No check-ins yet</p>
<p className="text-purple-400">Complete actions and share your progress!</p>
</div>
) : (
checkIns.map(checkIn => {
const action = actions.find(a => a.id === checkIn.actionId);
return (
<div key={checkIn.id} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 rounded-3xl border-2 border-purple-500/30 shadow-xl">
<div className="flex items-start gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center border-2 border-purple-400">
<User className="w-5 h-5" />
</div>
<div className="flex-1">
<p className="font-bold text-white">{checkIn.userName}</p>
<p className="text-sm text-purple-400">{formatTimeAgo(checkIn.timestamp)}</p>
</div>
<CheckCircle className="w-6 h-6 text-green-400" />
</div>

{action && (
<div className="mb-3 p-3 bg-purple-950/40 rounded-xl">
<p className="text-sm text-purple-300">Completed: <span className="font-bold text-white">{action.title}</span></p>
<p className="text-xs text-purple-400">+{ACTION_TYPES[action.type].points} XP</p>
</div>
)}

<p className="text-white mb-3">{checkIn.text}</p>

<div className="flex items-center gap-2">
{Object.entries(checkIn.reactions).map(([emoji, count]) => (
<button
key={emoji}
onClick={() => addReaction(checkIn.id, emoji)}
className="px-3 py-1 bg-purple-800/40 rounded-full border border-purple-700/30 hover:border-purple-500/50 transition-all text-sm"
>
{emoji} {count}
</button>
))}
<button
onClick={() => addReaction(checkIn.id, '🔥')}
className="px-3 py-1 bg-purple-800/40 rounded-full border border-purple-700/30 hover:border-purple-500/50 transition-all text-sm"
>
+ React
</button>
</div>
</div>
);
})
)}
</div>
)}

{/* CHAT VIEW */}
{view === 'chat' && (
<div className="flex flex-col h-[calc(100vh-240px)]">
<h2 className="text-2xl font-bold text-purple-100 mb-4">Group Chat</h2>

<div className="flex-1 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden flex flex-col">
{/* Messages Container */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">
{messages.length === 0 ? (
<div className="flex items-center justify-center h-full">
<div className="text-center">
<MessageCircle className="w-20 h-20 text-purple-500/50 mx-auto mb-4" />
<p className="text-purple-300 text-lg mb-2">No messages yet</p>
<p className="text-purple-400">Start the conversation!</p>
</div>
</div>
) : (
messages.map((message, index) => {
const isOwnMessage = message.userId === currentUser.uid;
const showAvatar = index === 0 || messages[index - 1].userId !== message.userId;

return (
<div key={message.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
{/* Avatar */}
<div className="flex-shrink-0">
{showAvatar ? (
<div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center border-2 border-purple-400">
<User className="w-5 h-5" />
</div>
) : (
<div className="w-10 h-10" />
)}
</div>

{/* Message Content */}
<div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
{showAvatar && (
<div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
<p className="text-sm font-semibold text-purple-200">{message.userName}</p>
<p className="text-xs text-purple-400">{formatTimeAgo(message.timestamp)}</p>
</div>
)}

<div className={`relative group ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
<div className={`px-4 py-3 rounded-2xl ${
isOwnMessage
? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm'
: 'bg-purple-950/60 text-white rounded-tl-sm'
}`}>
<p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
</div>

{/* Message Actions */}
<div className={`absolute top-0 ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2`}>
<button
onClick={() => addMessageReaction(message.id, '👍')}
className="p-1.5 bg-purple-800/60 hover:bg-purple-700/60 rounded-full transition-all"
title="Like"
>
<ThumbsUp className="w-4 h-4" />
</button>
<button
onClick={() => addMessageReaction(message.id, '❤️')}
className="p-1.5 bg-purple-800/60 hover:bg-purple-700/60 rounded-full transition-all"
title="Love"
>
<Heart className="w-4 h-4" />
</button>
<button
onClick={() => addMessageReaction(message.id, '🔥')}
className="p-1.5 bg-purple-800/60 hover:bg-purple-700/60 rounded-full transition-all"
title="Fire"
>
<Flame className="w-4 h-4" />
</button>
{isOwnMessage && (
<button
onClick={() => deleteMessage(message.id)}
className="p-1.5 bg-red-800/60 hover:bg-red-700/60 rounded-full transition-all"
title="Delete"
>
<Trash2 className="w-4 h-4" />
</button>
)}
</div>

{/* Reactions */}
{message.reactions && Object.keys(message.reactions).length > 0 && (
<div className={`flex items-center gap-1 mt-1 flex-wrap ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
{Object.entries(
Object.values(message.reactions).reduce((acc, reaction) => {
acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
return acc;
}, {})
).map(([emoji, count]) => (
<button
key={emoji}
onClick={() => addMessageReaction(message.id, emoji)}
className="px-2 py-0.5 bg-purple-800/40 rounded-full border border-purple-700/30 hover:border-purple-500/50 transition-all text-xs flex items-center gap-1"
>
<span>{emoji}</span>
<span className="text-purple-300">{count}</span>
</button>
))}
</div>
)}
</div>
</div>
</div>
);
})
)}
</div>

{/* Message Input */}
<div className="p-4 border-t-2 border-purple-500/20 bg-purple-950/30">
<div className="flex items-end gap-3">
<div className="flex-1">
<textarea
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
onKeyDown={(e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
sendMessage();
}
}}
placeholder="Type a message..."
rows={1}
className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none max-h-32"
style={{ minHeight: '44px' }}
/>
</div>
<button
onClick={sendMessage}
disabled={!newMessage.trim()}
className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center gap-2"
>
<Send className="w-5 h-5" />
</button>
</div>
<p className="text-xs text-purple-400 mt-2 text-center">
Press Enter to send • Shift + Enter for new line
</p>
</div>
</div>
</div>
)}
</div>


{/* FLOATING ACTION BUTTON */}
<div className="fixed bottom-6 right-6 z-50">
{showFloatingMenu && (
<>
<div
className="fixed inset-0 bg-black/50 backdrop-blur-sm"
onClick={() => setShowFloatingMenu(false)}
/>
<div className="absolute bottom-20 right-0 space-y-3 animate-fade-in">
<button
onClick={() => {
setShowActionModal(true);
setShowFloatingMenu(false);
}}
className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl shadow-2xl text-white font-bold transition-all hover:scale-105 w-full"
>
<Target className="w-6 h-6" />
<span>New Action</span>
</button>

<button
onClick={() => {
setShowQuickActions(true);
setShowFloatingMenu(false);
}}
className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-2xl text-white font-bold transition-all hover:scale-105 w-full"
>
<Zap className="w-6 h-6" />
<span>Quick Action</span>
</button>
</div>
</>
)}

<button
onClick={() => setShowFloatingMenu(!showFloatingMenu)}
className={`w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${
showFloatingMenu ? 'rotate-45' : ''
}`}
>
<Plus className="w-8 h-8 text-white" />
</button>
</div>

{/* CREATE ACTION MODAL */}
{showActionModal && (
<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
<div
className="absolute inset-0 bg-black/60 backdrop-blur-sm"
onClick={() => setShowActionModal(false)}
/>

<div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-t-3xl md:rounded-3xl border-2 border-purple-500/30 shadow-2xl w-full max-w-lg animate-slide-up">
<div className="p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-2xl font-bold text-white">Create New Action</h3>
<button
onClick={() => setShowActionModal(false)}
className="p-2 hover:bg-purple-800/50 rounded-xl transition-all"
>
<X className="w-6 h-6 text-purple-300" />
</button>
</div>

<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-purple-300 mb-2">Action Title</label>
<input
type="text"
value={newActionTitle}
onChange={(e) => setNewActionTitle(e.target.value)}
placeholder="What will you do?"
className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
/>
</div>

<div>
<label className="block text-sm font-medium text-purple-300 mb-2">Action Type</label>
<div className="grid grid-cols-2 gap-3">
{Object.entries(ACTION_TYPES).map(([key, config]) => (
<button
key={key}
onClick={() => setNewActionType(key)}
className={`p-4 rounded-xl font-semibold transition-all ${
newActionType === key
? `bg-gradient-to-r ${config.color} text-white scale-105 border-2 border-purple-400/50`
: 'bg-purple-950/50 text-purple-300 border-2 border-purple-700/30 hover:border-purple-600/50'
}`}
>
<div className="text-2xl mb-1">{config.icon}</div>
<div className="text-sm">{config.label}</div>
</button>
))}
</div>
</div>

<div>
<label className="block text-sm font-medium text-purple-300 mb-2">Duration (minutes)</label>
<input
type="number"
value={newActionDuration}
onChange={(e) => setNewActionDuration(parseInt(e.target.value) || 30)}
min="5"
max="240"
className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
/>
</div>

<button
onClick={createAction}
disabled={!newActionTitle.trim()}
className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
>
Create Action (+{ACTION_TYPES[newActionType].points} XP)
</button>
</div>
</div>
</div>
</div>
)}

{/* CHECK-IN MODAL */}
{showCheckInModal && (
<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
<div
className="absolute inset-0 bg-black/60 backdrop-blur-sm"
onClick={() => setShowCheckInModal(null)}
/>

<div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-t-3xl md:rounded-3xl border-2 border-purple-500/30 shadow-2xl w-full max-w-lg animate-slide-up">
<div className="p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-2xl font-bold text-white">Complete Action</h3>
<button
onClick={() => setShowCheckInModal(null)}
className="p-2 hover:bg-purple-800/50 rounded-xl transition-all"
>
<X className="w-6 h-6 text-purple-300" />
</button>
</div>

{(() => {
const action = actions.find(a => a.id === showCheckInModal);
if (!action) return null;

return (
<div className="mb-4 p-4 bg-purple-950/40 rounded-xl">
<div className="flex items-center gap-3">
<span className="text-3xl">{ACTION_TYPES[action.type].icon}</span>
<div>
<p className="font-bold text-white">{action.title}</p>
<p className="text-sm text-purple-400">+{ACTION_TYPES[action.type].points} XP</p>
</div>
</div>
</div>
);
})()}

<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-purple-300 mb-2">How did it go?</label>
<textarea
value={checkInText}
onChange={(e) => setCheckInText(e.target.value)}
placeholder="Share your experience, learnings, or reflections..."
rows={4}
className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
/>
</div>

<button
onClick={submitCheckIn}
disabled={!checkInText.trim()}
className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
>
<CheckCircle className="w-6 h-6" />
Complete & Share
</button>
</div>
</div>
</div>
</div>
)}

{/* CONFETTI */}
{showConfetti && (
<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
<div className="text-9xl animate-bounce">🎉</div>
</div>
)}

{/* NOTIFICATION */}
{notification && (
<div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-24 md:max-w-md bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-up border-2 border-purple-400/50 backdrop-blur-sm z-40">
<p className="font-bold text-center">{notification}</p>
</div>
)}

<style>{`
@keyframes slide-up {
from {
transform: translateY(100px);
opacity: 0;
}
to {
transform: translateY(0);
opacity: 1;
}
}

@keyframes fade-in {
from {
opacity: 0;
transform: scale(0.95);
}
to {
opacity: 1;
transform: scale(1);
}
}

.animate-slide-up {
animation: slide-up 0.3s ease-out;
}

.animate-fade-in {
animation: fade-in 0.2s ease-out;
}

html {
scroll-behavior: smooth;
-webkit-overflow-scrolling: touch;
}

button, a, input, select, textarea {
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
}

button {
-webkit-user-select: none;
user-select: none;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
outline: 2px solid #a78bfa;
outline-offset: 2px;
}

* {
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
`}</style>
</div>
);
}

export default GroupChat;