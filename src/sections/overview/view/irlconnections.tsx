import { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Search, Filter, Calendar, Clock, MessageCircle, Coffee, Phone, Mail, Target, Zap, Trophy, Flame, TrendingUp, Edit3, Trash2, CheckCircle, Star, AlertCircle, Heart, Sparkles, Award, BarChart3, ChevronDown, ChevronUp, User, LogOut, Loader2, X, Send, Lightbulb, BookOpen, ArrowRight, Activity } from 'lucide-react';

// Firebase imports
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, setDoc, updateDoc, deleteDoc, where } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================

const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  databaseURL: "https://goalgrid-c5e9c-default-rtdb.firebaseio.com",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================================
// CONSTANTS
// ============================================================================

const CONNECTION_TYPES = [
  { value: 'friend', label: 'Friend', icon: '👥', color: 'purple' },
  { value: 'colleague', label: 'Colleague', icon: '💼', color: 'blue' },
  { value: 'mentor', label: 'Mentor', icon: '🎓', color: 'green' },
  { value: 'casual', label: 'Casual', icon: '🤝', color: 'yellow' },
  { value: 'family', label: 'Family', icon: '❤️', color: 'pink' },
  { value: 'interest', label: 'Interest Group', icon: '🎯', color: 'indigo' },
];

const TASK_TYPES = [
  { value: 'message', label: 'Send Message', icon: MessageCircle, xp: 10 },
  { value: 'call', label: 'Phone Call', icon: Phone, xp: 25 },
  { value: 'meetup', label: 'Meet in Person', icon: Coffee, xp: 50 },
  { value: 'email', label: 'Send Email', icon: Mail, xp: 10 },
  { value: 'followup', label: 'Follow Up', icon: Target, xp: 15 },
];

const CONVERSATION_STARTERS = {
  friend: [
    "Hey! It's been a while. How have you been?",
    "I was just thinking about [shared memory]. Made me smile!",
    "Saw something that reminded me of you. Want to catch up soon?"
  ],
  colleague: [
    "Hope your week is going well! Any exciting projects?",
    "Would love to hear your thoughts on [topic]",
    "Free for a quick coffee chat this week?"
  ],
  mentor: [
    "I'd love your advice on [topic]",
    "Hope you're well! I've been working on [project]",
    "Would you have time for a brief call?"
  ],
  casual: [
    "Hey! How's everything going?",
    "It was great meeting you at [place]. Want to stay in touch?",
    "Hope you're doing well!"
  ]
};

const REFLECTION_PROMPTS = [
  "What went well in this interaction?",
  "What surprised you about this conversation?",
  "What did you learn about this person?",
  "How did you feel during the interaction?",
  "What would you do differently next time?",
  "What's a good next step with this connection?"
];

const MOTIVATIONAL_QUOTES = [
  "Every connection is a step toward growth.",
  "Relationships are built one conversation at a time.",
  "Your network is your net worth.",
  "Authentic connections change everything.",
  "Small gestures create lasting bonds.",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function IRLConnectionsHub() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interactions, setInteractions] = useState([]);
  
  // UI State
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notification, setNotification] = useState(null);
  const [dailyQuote, setDailyQuote] = useState('');
  const [showLiveCoach, setShowLiveCoach] = useState(false);
  const [coachMessage, setCoachMessage] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionData, setReflectionData] = useState({});
  const [expandedConnection, setExpandedConnection] = useState(null);

  // Form States
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'friend',
    context: '',
    interests: '',
    notes: '',
    priority: 'medium'
  });

  const [newTask, setNewTask] = useState({
    connectionId: '',
    type: 'message',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  // ============================================================================
  // FIREBASE AUTH
  // ============================================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      showNotification(`Welcome, ${result.user.displayName || 'User'}! 🎉`);
    } catch (error) {
      console.error('Sign in failed:', error);
      showNotification('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setConnections([]);
    setTasks([]);
    setInteractions([]);
  };

  // ============================================================================
  // FIREBASE DATA SYNC
  // ============================================================================

  useEffect(() => {
    if (!user) return;

    // Sync Connections
    const connectionsRef = collection(db, 'users', user.uid, 'connections');
    const connectionsQuery = query(connectionsRef, orderBy('createdAt', 'desc'));
    const unsubConnections = onSnapshot(connectionsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConnections(data);
    });

    // Sync Tasks
    const tasksRef = collection(db, 'users', user.uid, 'connectionTasks');
    const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(data);
    });

    // Sync Interactions
    const interactionsRef = collection(db, 'users', user.uid, 'interactions');
    const interactionsQuery = query(interactionsRef, orderBy('timestamp', 'desc'));
    const unsubInteractions = onSnapshot(interactionsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInteractions(data);
    });

    return () => {
      unsubConnections();
      unsubTasks();
      unsubInteractions();
    };
  }, [user]);

  useEffect(() => {
    const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  // ============================================================================
  // FIREBASE OPERATIONS
  // ============================================================================

  const addConnection = async () => {
    if (!user || !newConnection.name.trim()) return;
    
    const connectionData = {
      ...newConnection,
      lastInteraction: null,
      interactionCount: 0,
      createdAt: Date.now(),
      status: 'not_contacted'
    };

    const connectionsRef = collection(db, 'users', user.uid, 'connections');
    const newDoc = doc(connectionsRef);
    await setDoc(newDoc, connectionData);

    setNewConnection({
      name: '',
      type: 'friend',
      context: '',
      interests: '',
      notes: '',
      priority: 'medium'
    });
    setShowAddConnection(false);
    showNotification('✨ Connection added successfully!');
  };

  const addTask = async () => {
    if (!user || !newTask.connectionId || !newTask.description.trim()) return;

    const taskData = {
      ...newTask,
      completed: false,
      createdAt: Date.now(),
      xp: TASK_TYPES.find(t => t.value === newTask.type)?.xp || 10
    };

    const tasksRef = collection(db, 'users', user.uid, 'connectionTasks');
    const newDoc = doc(tasksRef);
    await setDoc(newDoc, taskData);

    setNewTask({
      connectionId: '',
      type: 'message',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setShowAddTask(false);
    showNotification('🎯 Task created!');
  };

  const completeTask = async (taskId, connectionId) => {
    if (!user) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task
    const taskRef = doc(db, 'users', user.uid, 'connectionTasks', taskId);
    await updateDoc(taskRef, { completed: true, completedAt: Date.now() });

    // Update connection
    const connectionRef = doc(db, 'users', user.uid, 'connections', connectionId);
    const connection = connections.find(c => c.id === connectionId);
    await updateDoc(connectionRef, {
      lastInteraction: Date.now(),
      interactionCount: (connection?.interactionCount || 0) + 1,
      status: 'reconnected'
    });

    // Add interaction
    const interactionData = {
      connectionId,
      taskId,
      taskType: task.type,
      timestamp: Date.now(),
      xp: task.xp,
      reflection: ''
    };
    const interactionsRef = collection(db, 'users', user.uid, 'interactions');
    const newDoc = doc(interactionsRef);
    await setDoc(newDoc, interactionData);

    showNotification(`🎉 +${task.xp} XP! Task completed!`);
    setActiveTask(null);
    setShowReflection(true);
    setReflectionData({ interactionId: newDoc.id, connectionId });
  };

  const saveReflection = async (interactionId, reflection, feeling, nextStep) => {
    if (!user) return;

    const interactionRef = doc(db, 'users', user.uid, 'interactions', interactionId);
    await updateDoc(interactionRef, { reflection, feeling, nextStep });

    showNotification('📝 Reflection saved!');
    setShowReflection(false);
    setReflectionData({});
  };

  const deleteConnection = async (id) => {
    if (!user) return;
    const connectionRef = doc(db, 'users', user.uid, 'connections', id);
    await deleteDoc(connectionRef);
    showNotification('Connection removed');
  };

  const deleteTask = async (id) => {
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'connectionTasks', id);
    await deleteDoc(taskRef);
    showNotification('Task deleted');
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const stats = useMemo(() => {
    const totalConnections = connections.length;
    const totalInteractions = interactions.length;
    const totalXP = interactions.reduce((sum, i) => sum + (i.xp || 0), 0);
    const activeTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;

    const last7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentInteractions = interactions.filter(i => i.timestamp >= last7Days).length;

    const connectionsWithRecentInteraction = connections.filter(c => 
      c.lastInteraction && c.lastInteraction >= last7Days
    ).length;

    return {
      totalConnections,
      totalInteractions,
      totalXP,
      activeTasks,
      completedTasks,
      recentInteractions,
      connectionsWithRecentInteraction
    };
  }, [connections, tasks, interactions]);

  const filteredConnections = useMemo(() => {
    let filtered = connections;

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.interests?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType);
    }

    return filtered;
  }, [connections, searchQuery, filterType]);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const startLiveCoach = (task, connection) => {
    setActiveTask({ task, connection });
    setShowLiveCoach(true);
    
    const starters = CONVERSATION_STARTERS[connection.type] || CONVERSATION_STARTERS.casual;
    const randomStarter = starters[Math.floor(Math.random() * starters.length)];
    
    setCoachMessage(`Here's a conversation starter: "${randomStarter}"\n\nRemember: Be genuine, show interest, and listen actively. You've got this! 💪`);
  };

  const getConnectionStatus = (connection) => {
    if (!connection.lastInteraction) return { label: 'Not Contacted', color: 'gray' };
    
    const daysSince = Math.floor((Date.now() - connection.lastInteraction) / (24 * 60 * 60 * 1000));
    
    if (daysSince === 0) return { label: 'Contacted Today', color: 'green' };
    if (daysSince <= 7) return { label: 'Recent', color: 'blue' };
    if (daysSince <= 30) return { label: 'Follow-up Due', color: 'yellow' };
    return { label: 'Needs Attention', color: 'red' };
  };

  const getTasksForConnection = (connectionId) => {
    return tasks.filter(t => t.connectionId === connectionId && !t.completed);
  };

  const getInteractionsForConnection = (connectionId) => {
    return interactions.filter(i => i.connectionId === connectionId);
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-xl text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SIGN IN PAGE
  // ============================================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
              <span className="text-xs md:text-sm font-medium text-purple-200">IRL Connections</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Your Connection Hub
            </h1>
            
            <p className="text-base md:text-lg text-purple-200 mb-8">
              Build meaningful relationships through deliberate action.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Welcome!</h2>
            <p className="text-purple-300 text-center mb-6 text-sm md:text-base">Sign in to manage your connections</p>
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 md:py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-purple-400 text-xs md:text-sm italic">
              "{dailyQuote}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN APP
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-20">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
        <div className="px-4 md:px-6 lg:px-10 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-purple-400 shadow-lg" />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-700 flex items-center justify-center border-2 border-purple-400">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm md:text-base font-bold text-purple-100">{user?.displayName || 'User'}</p>
                <p className="text-xs text-purple-300">Level {Math.floor(stats.totalXP / 100) + 1}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                <span className="text-xs md:text-sm font-bold text-blue-100">{stats.totalConnections}</span>
              </div>

              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-green-500/20 rounded-full border border-green-400/30">
                <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" />
                <span className="text-xs md:text-sm font-bold text-green-100">{stats.activeTasks}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
                <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                <span className="text-xs md:text-sm font-bold text-purple-100">{stats.totalXP} XP</span>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:px-10 max-w-7xl mx-auto">
        
        {/* WELCOME */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-100 mb-2">
            Hey {user?.displayName?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-sm md:text-base text-purple-200 italic">"{dailyQuote}"</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <button
            onClick={() => setShowAddConnection(true)}
            className="p-5 md:p-6 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-3xl border-2 border-purple-400/50 transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-1">Add Connection</h3>
                <p className="text-sm text-purple-100">Track someone new</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowAddTask(true)}
            className="p-5 md:p-6 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-3xl border-2 border-indigo-400/50 transition-all shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-1">Create Task</h3>
                <p className="text-sm text-purple-100">Plan an interaction</p>
              </div>
            </div>
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-purple-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">Connections</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalConnections}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-pink-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">This Week</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-white">{stats.recentInteractions}</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-indigo-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">Active Tasks</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-white">{stats.activeTasks}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-800/60 to-indigo-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-purple-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">Total XP</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalXP}</p>
          </div>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-4 md:p-5 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connections..."
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-sm md:text-base"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white text-sm md:text-base focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            >
              <option value="all">All Types</option>
              {CONNECTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONNECTIONS LIST */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-purple-100 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Your Connections
              <span className="text-sm text-purple-400">({filteredConnections.length})</span>
            </h2>
          </div>

          {filteredConnections.length === 0 ? (
            <div className="text-center py-16 bg-purple-900/20 rounded-3xl border-2 border-purple-500/20">
              <Users className="w-20 h-20 text-purple-500/50 mx-auto mb-4" />
              <p className="text-purple-300 text-lg mb-2 font-medium">No connections yet</p>
              <p className="text-purple-400 text-base mb-6">Start by adding your first connection!</p>
              <button
                onClick={() => setShowAddConnection(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Connection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredConnections.map(connection => {
                const status = getConnectionStatus(connection);
                const connectionTasks = getTasksForConnection(connection.id);
                const connectionInteractions = getInteractionsForConnection(connection.id);
                const isExpanded = expandedConnection === connection.id;
                const typeConfig = CONNECTION_TYPES.find(t => t.value === connection.type);

                return (
                  <div
                    key={connection.id}
                    className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-xl overflow-hidden transition-all hover:shadow-2xl"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{typeConfig?.icon}</span>
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-white">{connection.name}</h3>
                              <p className="text-sm text-purple-300">{typeConfig?.label}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              status.color === 'green' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                              status.color === 'blue' ? 'bg-blue-500/20 border-blue-400/30 text-blue-300' :
                              status.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                              status.color === 'red' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
                              'bg-gray-500/20 border-gray-400/30 text-gray-300'
                            }`}>
                              {status.label}
                            </span>
                            
                            {connection.context && (
                              <span className="px-3 py-1 bg-purple-800/50 rounded-full text-xs text-purple-300 border border-purple-700/30">
                                {connection.context}
                              </span>
                            )}

                            {connectionTasks.length > 0 && (
                              <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 border border-orange-400/30 font-medium">
                                {connectionTasks.length} pending
                              </span>
                            )}
                          </div>

                          {connection.lastInteraction && (
                            <p className="text-xs text-purple-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last contact: {new Date(connection.lastInteraction).toLocaleDateString()}
                              <span className="ml-2">({connection.interactionCount} total)</span>
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => setExpandedConnection(isExpanded ? null : connection.id)}
                            className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
                          </button>
                          <button
                            onClick={() => deleteConnection(connection.id)}
                            className="p-2 hover:bg-red-900/50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2">
                        {TASK_TYPES.slice(0, 3).map(taskType => {
                          const TaskIcon = taskType.icon;
                          return (
                            <button
                              key={taskType.value}
                              onClick={() => {
                                setNewTask({ ...newTask, connectionId: connection.id, type: taskType.value });
                                setShowAddTask(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 bg-purple-950/50 hover:bg-purple-900/50 border border-purple-700/30 hover:border-purple-600/50 rounded-xl text-xs font-medium transition-all"
                            >
                              <TaskIcon className="w-4 h-4" />
                              {taskType.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="mt-6 space-y-4 pt-6 border-t-2 border-purple-500/20">
                          {connection.interests && (
                            <div>
                              <p className="text-sm font-bold text-purple-200 mb-2">Interests:</p>
                              <p className="text-sm text-purple-300">{connection.interests}</p>
                            </div>
                          )}

                          {connection.notes && (
                            <div>
                              <p className="text-sm font-bold text-purple-200 mb-2">Notes:</p>
                              <p className="text-sm text-purple-300">{connection.notes}</p>
                            </div>
                          )}

                          {/* Active Tasks */}
                          {connectionTasks.length > 0 && (
                            <div>
                              <p className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Active Tasks ({connectionTasks.length})
                              </p>
                              <div className="space-y-2">
                                {connectionTasks.map(task => {
                                  const TaskIcon = TASK_TYPES.find(t => t.value === task.type)?.icon;
                                  return (
                                    <div key={task.id} className="flex items-center justify-between p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                                      <div className="flex items-center gap-3 flex-1">
                                        {TaskIcon && <TaskIcon className="w-4 h-4 text-purple-400" />}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-white truncate">{task.description}</p>
                                          {task.dueDate && (
                                            <p className="text-xs text-purple-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => startLiveCoach(task, connection)}
                                          className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-xs font-bold transition-all shadow-lg"
                                        >
                                          Start
                                        </button>
                                        <button
                                          onClick={() => deleteTask(task.id)}
                                          className="p-1.5 hover:bg-red-900/50 rounded-lg transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Recent Interactions */}
                          {connectionInteractions.length > 0 && (
                            <div>
                              <p className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Recent Activity ({connectionInteractions.length})
                              </p>
                              <div className="space-y-2">
                                {connectionInteractions.slice(0, 3).map(interaction => (
                                  <div key={interaction.id} className="p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs text-purple-400">
                                        {new Date(interaction.timestamp).toLocaleDateString()}
                                      </span>
                                      <span className="text-xs font-bold text-green-400">+{interaction.xp} XP</span>
                                    </div>
                                    {interaction.reflection && (
                                      <p className="text-sm text-purple-300">{interaction.reflection}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD CONNECTION MODAL */}
      {showAddConnection && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add Connection
              </h2>
              <button
                onClick={() => setShowAddConnection(false)}
                className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Name *</label>
                <input
                  type="text"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Connection Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONNECTION_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setNewConnection({ ...newConnection, type: type.value })}
                      className={`p-3 rounded-xl border-2 font-medium transition-all ${
                        newConnection.type === type.value
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400/50'
                          : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                      }`}
                    >
                      <span className="text-xl mb-1 block">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Context / Where Met</label>
                <input
                  type="text"
                  value={newConnection.context}
                  onChange={(e) => setNewConnection({ ...newConnection, context: e.target.value })}
                  placeholder="Met at conference, college friend, etc."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Interests / Topics</label>
                <input
                  type="text"
                  value={newConnection.interests}
                  onChange={(e) => setNewConnection({ ...newConnection, interests: e.target.value })}
                  placeholder="Tech, sports, music, etc."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Notes</label>
                <textarea
                  value={newConnection.notes}
                  onChange={(e) => setNewConnection({ ...newConnection, notes: e.target.value })}
                  placeholder="Last conversation topics, mutual friends, things to remember..."
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                />
              </div>

              <button
                onClick={addConnection}
                disabled={!newConnection.name.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6" />
                Create Task
              </h2>
              <button
                onClick={() => setShowAddTask(false)}
                className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Connection *</label>
                <select
                  value={newTask.connectionId}
                  onChange={(e) => setNewTask({ ...newTask, connectionId: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                >
                  <option value="">Select a connection...</option>
                  {connections.map(conn => (
                    <option key={conn.id} value={conn.id}>{conn.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Task Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TASK_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setNewTask({ ...newTask, type: type.value })}
                        className={`p-3 rounded-xl border-2 font-medium transition-all flex items-center gap-2 ${
                          newTask.type === type.value
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400/50'
                            : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Description *</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="What do you want to do?"
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              <button
                onClick={addTask}
                disabled={!newTask.connectionId || !newTask.description.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Task (+{TASK_TYPES.find(t => t.value === newTask.type)?.xp || 10} XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE COACH MODAL */}
      {showLiveCoach && activeTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Live Coach
              </h2>
              <button
                onClick={() => setShowLiveCoach(false)}
                className="p-2 hover:bg-green-800/50 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-green-950/50 rounded-2xl border-2 border-green-500/30">
                <p className="text-sm font-bold text-green-200 mb-2">Task:</p>
                <p className="text-white">{activeTask.task.description}</p>
                <p className="text-sm text-green-300 mt-2">With: {activeTask.connection.name}</p>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-2xl border-2 border-yellow-500/30">
                <p className="text-sm font-bold text-yellow-200 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Coach's Tip:
                </p>
                <p className="text-white text-sm leading-relaxed whitespace-pre-line">{coachMessage}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    completeTask(activeTask.task.id, activeTask.connection.id);
                    setShowLiveCoach(false);
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold transition-all shadow-xl"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Complete Task
                </button>
                <button
                  onClick={() => setShowLiveCoach(false)}
                  className="px-6 py-4 bg-purple-950/50 hover:bg-purple-900/50 border-2 border-purple-500/30 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REFLECTION MODAL */}
      {showReflection && reflectionData.interactionId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Reflection Time
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-purple-200">Take a moment to reflect on this interaction:</p>

              {REFLECTION_PROMPTS.slice(0, 3).map((prompt, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-purple-200 mb-2">{prompt}</label>
                  <textarea
                    placeholder="Your thoughts..."
                    rows={2}
                    className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none text-sm"
                  />
                </div>
              ))}

             <button
                onClick={() => {
                  saveReflection(reflectionData.interactionId, 'Reflection saved', 'positive', 'Follow up next week');
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold transition-all shadow-xl"
              >
                <Send className="w-5 h-5 inline mr-2" />
                Save Reflection
              </button>

              <button
                onClick={() => {
                  setShowReflection(false);
                  setReflectionData({});
                }}
                className="w-full px-6 py-4 bg-purple-950/50 hover:bg-purple-900/50 border-2 border-purple-500/30 rounded-2xl font-bold transition-all"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl border-2 border-purple-400/50">
            <p className="text-white font-bold">{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
}