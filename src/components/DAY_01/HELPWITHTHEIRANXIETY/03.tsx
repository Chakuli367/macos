import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, Circle, Heart, Wind, ArrowRight, ArrowLeft, 
  Play, Users, Coffee, Briefcase, Home, MapPin, Calendar,
  Sun, Cloud, Moon, MessageCircle, Zap, Award, TrendingUp,
  Volume2, VolumeX, Camera, Activity, Trophy, Sparkles,
  RefreshCw, X, Menu, Target, Send, Bot, User as UserIcon
} from 'lucide-react';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust path to your firebase config
import { getApiKeys } from './apikeys';
// API Configuration
const API_BASE = 'https://your-api.com';
const USE_MOCK_DATA = false;





// Utility: Haptic feedback
const haptic = {
  light: () => navigator.vibrate && navigator.vibrate(10),
  medium: () => navigator.vibrate && navigator.vibrate(50),
  success: () => navigator.vibrate && navigator.vibrate([50, 30, 50, 30, 100]),
  breatheIn: () => navigator.vibrate && navigator.vibrate(100),
  breatheOut: () => navigator.vibrate && navigator.vibrate(150),
  alert: () => navigator.vibrate && navigator.vibrate([200, 100, 200])
};

export default function AnxietyReduction10X( {onComplete } ) {
  const [currentPage, setCurrentPage] = useState('task-selection');
  const [conversationId] = useState(`conv_${Date.now()}`);
  
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [context, setContext] = useState({
    who: null,
    where: null,
    when: null,
    worry: null,
    anxietyLevel: 3,
    energyLevel: 3
  });
  
  const [exerciseSequence, setExerciseSequence] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercisesCompleted, setExercisesCompleted] = useState([]);
  const [currentDay, setCurrentDay] = useState(1); // Track which day user is on
  
  // Breathing state
  const [breathingPhase, setBreathingPhase] = useState('ready');
  const [breathingSize, setBreathingSize] = useState(25);
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const breathingDuration = context.anxietyLevel >= 4 ? 5000 : 3000;
  const breathingCycles = 3;
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // Self-talk state
  const [selfTalkPhrases, setSelfTalkPhrases] = useState([]);
  const [customPhrase, setCustomPhrase] = useState('');
  
  // Physical exercise state
  const [physicalExercise, setPhysicalExercise] = useState('shake');
  const [physicalTimer, setPhysicalTimer] = useState(30);
  
  // Grounding state
  const [groundingAnswers, setGroundingAnswers] = useState({
    see: '', hear: '', feel: ''
  });
  
  // AI state
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Reflection state
  const [reflection, setReflection] = useState({
    difficulty: null,
    exercisesHelped: null,
    whatWentWell: '',
    whatWasHard: '',
    finalAnxiety: 3,
    finalConfidence: 3
  });
  
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyTimer, setEmergencyTimer] = useState(60);
  const userId = 'B7MZs55jCnOu6aA8ZHRH1Dqvblw1';


  // FIXED apiCall function - place this INSIDE your component
const apiCall = async (endpoint, method = 'GET', body = null) => {
  // For anxiety chat endpoint
  if (endpoint === '/api/ai/chat') {
    let data: any = null;
    let success = false;

    // Fetch API keys from Firebase
    let apiKeys: string[] = [];
    try {
      apiKeys = await getApiKeys();
      if (apiKeys.length === 0) {
        console.warn('⚠️ No API keys available in Firebase');
        return {
          response: "I'm here to support you. Take a deep breath - you've got this.",
          suggestions: null
        };
      }
    } catch (error) {
      console.error('❌ Failed to fetch API keys from Firebase:', error);
      return {
        response: "I'm here to support you. Take a deep breath - you've got this.",
        suggestions: null
      };
    }

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        console.log(`🔵 Making API call with key ${i + 1}:`, {
          user_id: userId,
          conversation_id: conversationId,
          ...body
        });

        const response = await fetch('https://pythonbackend-74es.onrender.com/anxiety-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Use dynamic API key
          },
          body: JSON.stringify({
            user_id: userId,
            conversation_id: conversationId,
            ...body
          })
        });

        console.log(`📡 Response status with key ${i + 1}:`, response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`❌ API key ${i + 1} failed:`, errorText);
          continue; // try next key
        }

        data = await response.json();
        console.log('✅ Success response:', data);
        success = true;
        break; // stop trying further keys
      } catch (err) {
        console.warn(`🔥 Request failed with API key ${i + 1}:`, err);
      }
    }

    if (success) return data;

    console.warn('⚠️ All API keys failed, returning fallback response.');
    return {
      response: "I'm here to support you. Take a deep breath - you've got this.",
      suggestions: null
    };
  }

  return null;
};







// FIXED sendChatMessage function
const sendChatMessage = async () => {
  if (!chatInput.trim() || chatLoading) return;
  
  const userMessage = {
    role: 'user',
    content: chatInput,
    timestamp: Date.now()
  };
  
  setChatMessages(prev => [...prev, userMessage]);
  const currentInput = chatInput;
  setChatInput('');
  setChatLoading(true);
  
  console.log('💬 Sending chat message:', currentInput);
  
  const response = await apiCall('/api/ai/chat', 'POST', {
    message_type: 'user_message',
    context: {
      task: selectedTask,
      user_state: context,
      user_input: currentInput,
      chat_history: chatMessages
    }
  });
  
  setChatLoading(false);
  
  if (response && response.response) {
    const aiMessage = {
      role: 'assistant',
      content: response.response,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, aiMessage]);
  } else {
    // Fallback response
    const aiMessage = {
      role: 'assistant',
      content: "I understand you're feeling anxious. That's completely normal. Let's work through this together.",
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, aiMessage]);
  }
};



  // Add these helper functions BEFORE the useEffect (around line 235)
const getLessonType = (lessonTitle) => {
  const title = lessonTitle?.toLowerCase() || '';
  if (title.includes('social') || title.includes('friend')) return 'friend';
  if (title.includes('work') || title.includes('productivity')) return 'colleague';
  if (title.includes('self')) return 'stranger';
  return 'friend'; // default
};

const getLessonLocation = (lessonTitle) => {
  const title = lessonTitle?.toLowerCase() || '';
  if (title.includes('dinner') || title.includes('party')) return 'cafe';
  if (title.includes('work') || title.includes('productivity')) return 'office';
  if (title.includes('self')) return 'home';
  return 'event'; // default
};


  
  // HARDCODED USER ID FOR TESTING

const datedCourseId = 'social_skills'; // Replace with actual course ID
// Fetch tasks from Firestore on mount
useEffect(() => {
  console.log('🔥 Firestore useEffect started...');

  const path = `users/${userId}/datedcourses/social_skills`;
  console.log('📄 Firestore path:', path);

  const datedCourseDocRef = doc(db, 'users', userId, 'datedcourses', 'social_skills');
  console.log('📘 Document reference created:', datedCourseDocRef);

  const unsubscribe = onSnapshot(
    datedCourseDocRef,
    (docSnap) => {
      console.log('📡 Snapshot triggered.');
      console.log('➡️ Snapshot exists:', docSnap.exists());

      if (!docSnap.exists()) {
        console.warn('❌ No course document found at:', path);
        return;
      }

      const data = docSnap.data();
      console.log('📦 Raw Firestore document data:', data);

      if (!data) {
        console.warn('⚠️ Document has no data.');
        return;
      }

      const overview = data.task_overview;
      console.log('🧩 Extracted task_overview:', overview);

      if (!overview) {
        console.warn('⚠️ No task_overview field found.');
        return;
      }

      if (!overview.days || !Array.isArray(overview.days)) {
        console.warn('⚠️ task_overview.days missing or not an array:', overview.days);
        return;
      }

      console.log(`📅 Found ${overview.days.length} days in task_overview.`);

      const allTasks = overview.days
  .filter((day, dayIndex) => dayIndex + 1 === currentDay) // Only get tasks for current day
  .flatMap((day, dayIndex) => {
    console.log(`🔍 Processing Day ${currentDay} (filtered):`, day);
        console.log(`🔍 Processing Day ${dayIndex + 1}:`, day);

        if (!day.tasks || !Array.isArray(day.tasks)) {
          console.warn(`⚠️ No tasks array found for day ${dayIndex + 1}.`);
          return [];
        }

        return day.tasks.map((task, i) => {
          console.log(`🧠 Task ${i + 1} for Day ${dayIndex + 1}:`, task);
          return {
            id: `task_${dayIndex}_${i}`,
            title: task.title || task.task || `Task ${i + 1}`,
            type: task.type || 'friend',
            location: task.location || 'event',
            scheduled_time: task.scheduled_time || new Date().toISOString(),
            time_of_day: task.time_of_day || 'morning',
            done: task.done || false,
          };
        });
      });

      console.log(`✅ Successfully processed ${allTasks.length} total tasks.`);
      setTasks(allTasks);
      console.log('🧭 State updated with tasks:', allTasks);
    },
    (error) => {
      console.error('🔥 Firestore snapshot error:', error);
    }
  );

  console.log('👂 Firestore listener attached.');

  return () => {
    console.log('🧹 Cleaning up Firestore listener.');
    unsubscribe();
  };
}, [currentDay]);

  
  // AI chat helper
  const getAIResponse = async (messageType, userInput = null) => {
    setAiLoading(true);
    const response = await apiCall('/api/ai/chat', 'POST', {
      conversation_id: conversationId,
      message_type: messageType,
      context: {
        task: selectedTask,
        user_state: context,
        user_input: userInput,
        exercise_history: exercisesCompleted
      }
    });
    setAiLoading(false);
    
    if (response) {
      setAiMessage(response.response);
      return response;
    }
    return null;
  };
  
  // Breathing animation
  // Breathing animation
useEffect(() => {
  if (!isBreathing || breathingPhase === 'ready' || breathingPhase === 'complete') return;
  
  let animationFrame;
  const startTime = Date.now();
  const startSize = breathingSize;
  let targetSize, duration;
  
  if (breathingPhase === 'inhale') {
    targetSize = 100;
    duration = breathingDuration;
    haptic.breatheIn();
  } else if (breathingPhase === 'hold') {
    // Just wait for the hold duration, don't animate
    const timer = setTimeout(() => {
      setBreathingPhase('exhale');
    }, breathingDuration);
    
    return () => clearTimeout(timer);
  } else if (breathingPhase === 'exhale') {
    targetSize = 25;
    duration = breathingDuration;
    haptic.breatheOut();
  }
  
  // Only run animation for inhale and exhale
  if (breathingPhase === 'hold') return;
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easeProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const newSize = startSize + (targetSize - startSize) * easeProgress;
    setBreathingSize(newSize);
    
    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      // Animation complete
      if (breathingPhase === 'inhale') {
        setBreathingPhase('hold');
      } else if (breathingPhase === 'exhale') {
        const newCycle = breathingCycle + 1;
        setBreathingCycle(newCycle);
        
        if (newCycle >= breathingCycles) {
          setIsBreathing(false);
          setBreathingPhase('complete');
          logExerciseComplete('breathing');
        } else {
          setBreathingPhase('inhale');
        }
      }
    }
  };
  
  animationFrame = requestAnimationFrame(animate);
  
  return () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };
}, [breathingPhase, isBreathing]);
  
  // Physical exercise timer
  useEffect(() => {
    if (currentPage === 'physical' && physicalTimer > 0) {
      const timer = setTimeout(() => {
        setPhysicalTimer(prev => prev - 1);
        if (physicalTimer === 1) {
          logExerciseComplete('physical');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, physicalTimer]);
  
  // Emergency mode timer
  useEffect(() => {
    if (showEmergency && emergencyTimer > 0) {
      const timer = setTimeout(() => {
        setEmergencyTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showEmergency && emergencyTimer === 0) {
      getAIResponse('emergency_followup');
    }
  }, [showEmergency, emergencyTimer]);
  

  // Fetch user's current day
useEffect(() => {
  console.log('🔍 Fetching user current day...');
  
  const userDocRef = doc(db, 'users', userId);
  
  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const day = userData.currentDay || userData.current_day || 1; // Adjust field name as needed
        console.log('📅 User is on day:', day);
        setCurrentDay(day);
      } else {
        console.warn('⚠️ User document not found, defaulting to day 1');
        setCurrentDay(1);
      }
    },
    (error) => {
      console.error('🔥 Error fetching user day:', error);
    }
  );
  
  return () => unsubscribe();
}, [userId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Log exercise completion
  const logExerciseComplete = async (exerciseType) => {
    const newCompleted = [...exercisesCompleted, exerciseType];
    setExercisesCompleted(newCompleted);
    haptic.success();
    
    await apiCall('/api/exercises/complete', 'POST', {
      task_id: selectedTask?.id,
      exercise_type: exerciseType,
      duration_seconds: exerciseType === 'breathing' ? breathingDuration * breathingCycles / 1000 : 180,
      anxiety_before: context.anxietyLevel,
      anxiety_after: Math.max(1, context.anxietyLevel - 1)
    });
    
    await getAIResponse('motivation');
  };
  
  // Task selection handler
  const handleTaskSelect = async (task) => {
    setSelectedTask(task);
    haptic.medium();
    setContext(prev => ({
      ...prev,
      who: task.type,
      where: task.location,
      when: task.time_of_day
    }));
    setCurrentPage('buddy-reassurance');
    await getAIResponse('greeting');
  };
  
  // Context complete handler
  const handleContextComplete = async () => {
    haptic.medium();
    
    const response = await apiCall('/api/ai/chat', 'POST', {
      conversation_id: conversationId,
      message_type: 'exercise_recommendation',
      context: {
        task: selectedTask,
        user_state: context
      }
    });
    
    if (response && response.suggestions) {
      setExerciseSequence(response.suggestions);
    } else {
      let sequence = [];
      if (context.anxietyLevel >= 4 && context.energyLevel <= 2) {
        sequence = ['grounding', 'breathing', 'ai-chat', 'self-talk'];
      } else if (context.anxietyLevel >= 4) {
        sequence = ['physical', 'breathing', 'ai-chat', 'self-talk'];
      } else {
        sequence = ['breathing', 'ai-chat', 'self-talk'];
      }
      setExerciseSequence(sequence);
    }
    
    setCurrentPage('exercise-flow');
  };
  
  // Navigate to next exercise
  const nextExercise = () => {
    if (currentExerciseIndex < exerciseSequence.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      haptic.light();
    } else {
      setCurrentPage('reflection');
      getAIResponse('reflection_prompt');
    }
  };
  
  // Submit reflection
  const submitReflection = async () => {
    await apiCall('/api/reflection', 'POST', {
      task_id: selectedTask?.id,
      ...reflection
    });
    
    await getAIResponse('reflection_analysis');
    setCurrentPage('complete');
    haptic.success();
  };
  
  // Send chat message

  // Get progress percentage
  const getProgressPercentage = () => {
    const pages = ['task-selection', 'buddy-reassurance', 'context-assessment', 'exercise-flow', 'reflection', 'complete'];
    const index = pages.indexOf(currentPage);
    return ((index + 1) / pages.length) * 100;
  };
  
  // Icon mappings
  const whoIcons = {
    friend: Users,
    colleague: Briefcase,
    stranger: MessageCircle,
    group: Users,
    acquaintance: Users
  };
  
  const whereIcons = {
    home: Home,
    cafe: Coffee,
    office: Briefcase,
    outdoor: Sun,
    event: Sparkles,
    virtual: Activity
  };
  
  const whenIcons = {
    morning: Sun,
    afternoon: Cloud,
    evening: Sun,
    night: Moon
  };
  
  const worryIcons = {
    what_to_say: MessageCircle,
    being_judged: Users,
    awkward_silence: Zap,
    wanting_to_leave: ArrowLeft
  };
  
  // Main render
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 relative overflow-x-hidden">
      <div id="page-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Progress bar */}
      {currentPage !== 'task-selection' && !showEmergency && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-purple-900/50 z-40">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}
      
      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto pt-8 pb-20">
        {currentPage === 'task-selection' && (
          <div className="space-y-6 animate-fadeIn p-4 md:p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
                <span className="text-xs md:text-sm font-medium text-purple-200">Anxiety Reduction</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
                Let's get you mentally prepared for these actions !!
              </h1>
              <p className="text-sm md:text-base text-purple-200">Which interaction would you like to prepare for?</p>
            </div>
            
            {aiMessage && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl md:rounded-3xl p-4 md:p-5 mb-6 shadow-xl">
                <div className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <p className="text-purple-100 text-sm md:text-base">{aiMessage}</p>
                </div>
              </div>
            )}
            
            <div className="grid gap-3 md:gap-4">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-purple-300 text-sm md:text-base">Loading your upcoming tasks...</p>
                </div>
              ) : (
                tasks.map((task) => {
                  const WhoIcon = whoIcons[task.type] || Users;
                  const WhereIcon = whereIcons[task.location] || MapPin;
                  
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleTaskSelect(task)}
                      className="group bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 hover:border-purple-400/50 rounded-2xl md:rounded-3xl p-5 md:p-6 text-left transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                          <WhoIcon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-purple-100 text-base md:text-lg mb-2">{task.title}</h3>
                          <div className="flex flex-wrap gap-2 text-xs md:text-sm text-purple-300">
                            <span className="flex items-center gap-1 px-2 py-1 bg-purple-800/40 rounded-lg">
                              <WhereIcon className="w-3 h-3 md:w-4 md:h-4" />
                              {task.location}
                            </span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-purple-800/40 rounded-lg">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                              {new Date(task.scheduled_time).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            
            <button
              onClick={() => setShowEmergency(true)}
              className="w-full bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-md border-2 border-red-500/30 text-red-200 py-4 rounded-2xl md:rounded-3xl font-semibold hover:border-red-400/50 transition shadow-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Emergency 60-Second Reset
            </button>
          </div>
        )}

        {currentPage === 'buddy-reassurance' && (
  <div className="space-y-6 animate-fadeIn p-4 md:p-6">
    <button
      onClick={() => setCurrentPage('task-selection')}
      className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-4 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-base">Back</span>
    </button>
    
    <div className="text-center mb-8">
      <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
        <Heart className="w-12 h-12 md:w-14 md:h-14 text-white" />
      </div>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-100 mb-4">You're Not Alone</h2>
      <p className="text-lg md:text-xl text-purple-200">Your anxiety is completely valid and understandable</p>
    </div>
    
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl">
      <h3 className="text-2xl md:text-3xl font-bold text-purple-100 mb-6 flex items-center gap-3">
        <Users className="w-7 h-7 md:w-8 md:h-8 text-purple-400" />
        Meet Your Internal Buddy
      </h3>
      
      <div className="space-y-5 mb-6">
        <p className="text-base md:text-lg text-purple-200 leading-relaxed">
          Right now, there's someone else using this app, feeling exactly what you're feeling. They're nervous too. They're worried too. They're preparing for their interaction just like you.
        </p>
        
        <div className="bg-purple-950/50 rounded-2xl p-6 border-2 border-purple-700/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <UserIcon className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-purple-100 text-base md:text-lg">Your Anonymous Buddy</p>
              <p className="text-sm md:text-base text-purple-400">Also preparing right now</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-purple-300 italic leading-relaxed">
            "I'm nervous about my meeting today too. But we've got this. We're both taking steps to prepare and that's what matters."
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-purple-200 leading-relaxed">Your feelings are normal human responses to social situations</p>
        </div>
        
        <div className="flex items-start gap-4 p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-purple-200 leading-relaxed">Thousands of people practice these exercises daily</p>
        </div>
        
        <div className="flex items-start gap-4 p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-purple-200 leading-relaxed">You're taking action, which already puts you ahead</p>
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl md:rounded-3xl p-6 md:p-7 mb-6 shadow-xl">
      <div className="flex gap-4 mb-4">
        <Sparkles className="w-7 h-7 text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-purple-100 mb-3 text-lg md:text-xl">Why You Feel This Way</h4>
          <p className="text-base md:text-lg text-purple-200 leading-relaxed">
            Your brain is trying to protect you by anticipating challenges. This "anxiety" is actually your mind's way of preparing you to perform well. It's a sign that this interaction matters to you.
          </p>
        </div>
      </div>
    </div>
    
    <button
      onClick={() => setCurrentPage('context-assessment')}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl md:rounded-3xl font-bold text-lg md:text-xl hover:from-purple-500 hover:to-pink-500 transition shadow-xl flex items-center justify-center gap-2"
    >
      I'm Ready to Prepare
      <ArrowRight className="w-6 h-6" />
    </button>
  </div>
)}

        {currentPage === 'context-assessment' && (
          <div className="space-y-6 animate-fadeIn p-4 md:p-6">
            <button
              onClick={() => setCurrentPage('buddy-reassurance')}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-100 mb-2">Let's understand your state</h2>
              <p className="text-sm md:text-base text-purple-300">This helps me personalize your exercises</p>
            </div>
            
            {aiMessage && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl md:rounded-3xl p-4 md:p-5 mb-6 shadow-xl">
                <div className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <p className="text-purple-100 text-sm md:text-base">{aiMessage}</p>
                </div>
              </div>
            )}
            
            <div className="mb-6 md:mb-8">
              <label className="block font-semibold text-base md:text-lg text-purple-100 mb-3">What's your biggest worry?</label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {[
                  { id: 'what_to_say', label: 'What to say', icon: MessageCircle },
                  { id: 'being_judged', label: 'Being judged', icon: Users },
                  { id: 'awkward_silence', label: 'Awkward silence', icon: Zap },
                  { id: 'wanting_to_leave', label: 'Wanting to leave', icon: ArrowLeft }
                ].map(worry => (
                  <button
                    key={worry.id}
                    onClick={() => {
                      setContext(prev => ({ ...prev, worry: worry.id }));
                      haptic.light();
                    }}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-lg ${
                      context.worry === worry.id
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 scale-105'
                        : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                    }`}
                  >
                    <worry.icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${
                      context.worry === worry.id ? 'text-white' : 'text-purple-400'
                    }`} />
                    <p className="text-xs md:text-sm font-medium text-center text-purple-100">{worry.label}</p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl">
              <label className="block font-semibold text-base md:text-lg text-purple-100 mb-4">How are you feeling right now?</label>
              
              <div className="relative w-full aspect-square max-w-md mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-yellow-900/30 to-red-900/30 rounded-xl border-2 border-purple-700/30"></div>
                
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs md:text-sm font-medium text-purple-300">
                  High Energy
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs md:text-sm font-medium text-purple-300">
                  Low Energy
                </div>
                <div className="absolute top-1/2 -left-20 md:-left-24 -translate-y-1/2 -rotate-90 text-xs md:text-sm font-medium text-purple-300">
                  Low Anxiety
                </div>
                <div className="absolute top-1/2 -right-20 md:-right-24 -translate-y-1/2 rotate-90 text-xs md:text-sm font-medium text-purple-300">
                  High Anxiety
                </div>
                
                <div
                  className="absolute w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-2xl cursor-move z-10"
                  style={{
                    left: `${(context.anxietyLevel / 5) * 100}%`,
                    top: `${((5 - context.energyLevel) / 5) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const rect = e.currentTarget.parentElement.getBoundingClientRect();
                    const moveHandler = (e) => {
                      const touch = e.touches[0];
                      const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                      const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
                      setContext(prev => ({
                        ...prev,
                        anxietyLevel: Math.round(x * 5) || 1,
                        energyLevel: Math.round((1 - y) * 5) || 1
                      }));
                      haptic.light();
                    };
                    document.addEventListener('touchmove', moveHandler);
                    document.addEventListener('touchend', () => {
                      document.removeEventListener('touchmove', moveHandler);
                    }, { once: true });
                  }}
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.parentElement.getBoundingClientRect();
                    const moveHandler = (e) => {
                      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                      setContext(prev => ({
                        ...prev,
                        anxietyLevel: Math.round(x * 5) || 1,
                        energyLevel: Math.round((1 - y) * 5) || 1
                      }));
                    };
                    document.addEventListener('mousemove', moveHandler);
                    document.addEventListener('mouseup', () => {
                      document.removeEventListener('mousemove', moveHandler);
                    }, { once: true });
                  }}
                />
              </div>
              
              <div className="text-center mt-10 md:mt-12">
                <p className="text-base md:text-lg font-semibold text-purple-100">
                  Anxiety: <span className="text-pink-400">{context.anxietyLevel}/5</span>
                  {' • '}
                  Energy: <span className="text-purple-400">{context.energyLevel}/5</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleContextComplete}
              disabled={!context.worry}
              className={`w-full py-4 rounded-2xl md:rounded-3xl font-bold transition flex items-center justify-center gap-2 shadow-xl text-sm md:text-base ${
                context.worry
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                  : 'bg-purple-950/30 text-purple-500 cursor-not-allowed border-2 border-purple-700/30'
              }`}
            >
              Get My Personalized Plan
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {currentPage === 'exercise-flow' && (
          <div className="space-y-6 animate-fadeIn p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => currentExerciseIndex > 0 && setCurrentExerciseIndex(prev => prev - 1)}
                className="text-purple-300 hover:text-purple-100 disabled:opacity-30 transition-colors"
                disabled={currentExerciseIndex === 0}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-2">
                {exerciseSequence.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 md:h-3 rounded-full transition-all ${
                      idx === currentExerciseIndex
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8 md:w-10'
                        : idx < currentExerciseIndex
                        ? 'bg-green-500 w-2 md:w-3'
                        : 'bg-purple-700/30 w-2 md:w-3'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setShowEmergency(true)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Zap className="w-6 h-6" />
              </button>
            </div>
            
            {aiMessage && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl md:rounded-3xl p-4 md:p-5 mb-6 shadow-xl">
                <div className="flex gap-3">
                  
                </div>
              </div>
            )}
            
            {exerciseSequence[currentExerciseIndex] === 'breathing' && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl">
                <h3 className="font-bold text-xl md:text-2xl text-purple-100 mb-2 flex items-center gap-2">
                  <Wind className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                  Breathing Exercise
                </h3>
                <p className="text-sm md:text-base text-purple-300 mb-6">
                  Follow the circle: breathe in as it grows, hold, breathe out as it shrinks.
                </p>
                
                <div className="flex flex-col items-center justify-center py-12 min-h-[400px]">
                  <div className="relative w-64 h-64">
                    <div
                      className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transition-all shadow-2xl"
                      style={{
                        width: `${breathingSize}%`,
                        height: `${breathingSize}%`,
                        opacity: 0.8,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-center">
                        <p className="font-bold text-2xl md:text-3xl capitalize text-white mb-2 drop-shadow-lg">
                          {breathingPhase === 'ready' ? 'Ready' :
                           breathingPhase === 'complete' ? 'Complete!' :
                           breathingPhase}
                        </p>
                        {isBreathing && breathingPhase !== 'complete' && (
                          <p className="text-sm text-purple-200">
                            Cycle {breathingCycle + 1}/{breathingCycles}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {breathingPhase === 'ready' && (
                  <button
                    onClick={() => {
                      setIsBreathing(true);
                      setBreathingPhase('inhale');
                      setBreathingSize(25);
                      setBreathingCycle(0);
                      haptic.medium();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-blue-500 hover:to-purple-500 transition font-bold flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
                  >
                    <Play className="w-5 h-5" />
                    Start Breathing
                  </button>
                )}
                
                {breathingPhase === 'complete' && (
                  <button
                    onClick={nextExercise}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-green-500 hover:to-emerald-500 transition font-bold flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Next Exercise
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {exerciseSequence[currentExerciseIndex] === 'ai-chat' && (
  <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 z-50">
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl mb-4 flex-shrink-0">
        <h3 className="font-bold text-2xl md:text-4xl text-white mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          Talk to me !
        </h3>
        <p className="text-lg md:text-xl text-white ml-11 md:ml-13">
          Share what's on your mind. I'm here to listen and help you process your feelings.
        </p>
      </div>
      
      {/* Chat Messages Area - Takes up remaining space */}
      <div className="flex-1 min-h-0 bg-purple-950/50 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 overflow-y-auto border-2 border-purple-700/30 shadow-2xl">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Bot className="w-16 h-16 md:w-20 md:h-20 text-purple-400 mb-6 animate-pulse" />
            <p className="text-xl md:text-2xl text-white font-semibold">Start by sharing what's worrying you...</p>
            <p className="text-base md:text-lg text-purple-300 mt-2">I'm here to help you work through it</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500' 
                    : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                }`}>
                  {msg.role === 'user' ? (
                    <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  )}
                </div>
                <div className={`flex-1 p-4 md:p-5 rounded-2xl md:rounded-3xl text-base md:text-xl shadow-xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-pink-900/50 to-purple-900/50 border-2 border-pink-500/30'
                    : 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500/30'
                }`}>
                  <p className="text-white leading-relaxed font-medium">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500/30 shadow-xl">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl flex-shrink-0">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Type your thoughts here..."
            className="flex-1 px-5 md:px-6 py-4 md:py-5 bg-purple-950/50 border-2 border-purple-700/30 rounded-xl md:rounded-2xl text-white text-lg md:text-xl placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-medium"
            disabled={chatLoading}
          />
          <button
  onClick={sendChatMessage}
  disabled={!chatInput.trim() || chatLoading}
  class="px-3 md:px-4 py-2 md:py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg md:rounded-xl hover:from-green-500 hover:to-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-100 active:scale-95"
>
  <Send class="w-4 h-4 md:w-5 md:h-5 text-white" />
</button>
        </div>
        
        {chatMessages.length >= 3 && (
          <button
            onClick={() => {
              logExerciseComplete('ai-chat');
              nextExercise();
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl hover:from-green-500 hover:to-emerald-500 transition font-bold flex items-center justify-center gap-3 shadow-2xl text-lg md:text-xl transform hover:scale-105 active:scale-95"
          >
            <CheckCircle className="w-6 h-6 md:w-7 md:h-7" />
            Feeling Better - Continue
            <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        )}
        
        {chatMessages.length < 3 && chatMessages.length > 0 && (
          <div className="text-center py-2">
            <p className="text-base md:text-lg text-purple-300 font-medium">
              Keep chatting... ({3 - chatMessages.length} more {3 - chatMessages.length === 1 ? 'message' : 'messages'} to continue)
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}



            {exerciseSequence[currentExerciseIndex] === 'self-talk' && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl">
                <h3 className="font-bold text-xl md:text-2xl text-purple-100 mb-2">Positive Self-Talk</h3>
                <p className="text-sm md:text-base text-purple-300 mb-6">
                  Choose phrases that resonate with you, or create your own
                </p>
                
                <div className="space-y-3 mb-6">
                  {(selfTalkPhrases.length > 0 ? selfTalkPhrases : [
                    "I am allowed to feel nervous. It's okay.",
                    "One small conversation is enough.",
                    "I don't need to be perfect.",
                    "My presence matters."
                  ]).map((phrase, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-green-900/40 to-blue-900/40 backdrop-blur-sm border-2 border-green-500/30 rounded-xl md:rounded-2xl p-4 md:p-5 hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                      onClick={() => haptic.light()}
                    >
                      <p className="text-sm md:text-base text-purple-100 font-medium">{phrase}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-purple-200 mb-2">Create your own affirmation:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPhrase}
                      onChange={(e) => setCustomPhrase(e.target.value)}
                      placeholder="Type your phrase here..."
                      className="flex-1 px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-700/30 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      onClick={async () => {
                        if (customPhrase.trim()) {
                          setSelfTalkPhrases(prev => [...prev, customPhrase]);
                          setCustomPhrase('');
                          haptic.success();
                          await getAIResponse('self_talk_feedback', customPhrase);
                        }
                      }}
                      className="px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl md:rounded-2xl hover:from-green-500 hover:to-emerald-500 transition font-bold shadow-xl text-sm md:text-base"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    setAiLoading(true);
                    const response = await getAIResponse('self_talk_generation');
                    if (response && response.suggestions) {
                      setSelfTalkPhrases(response.suggestions);
                    }
                  }}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md text-blue-200 border-2 border-blue-500/30 py-3 md:py-4 rounded-xl md:rounded-2xl hover:border-blue-400/50 transition font-bold flex items-center justify-center gap-2 mb-4 shadow-xl text-sm md:text-base"
                >
                  <Sparkles className="w-5 h-5" />
                  {aiLoading ? 'Generating...' : 'Generate AI Suggestions'}
                </button>
                
                <button
                  onClick={() => {
                    logExerciseComplete('self_talk');
                    nextExercise();
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-green-500 hover:to-emerald-500 transition font-bold flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete & Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {exerciseSequence[currentExerciseIndex] === 'physical' && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl">
                <h3 className="font-bold text-xl md:text-2xl text-purple-100 mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
                  Physical Release
                </h3>
                <p className="text-sm md:text-base text-purple-300 mb-6">
                  Release nervous energy through movement
                </p>
                
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
                  {[
                    { id: 'shake', label: 'Shake it out', emoji: '🤸' },
                    { id: 'stretch', label: 'Neck rolls', emoji: '🧘' },
                    { id: 'walk', label: 'Walk around', emoji: '🚶' },
                    { id: 'power-pose', label: 'Power pose', emoji: '💪' }
                  ].map(exercise => (
                    <button
                      key={exercise.id}
                      onClick={() => {
                        setPhysicalExercise(exercise.id);
                        setPhysicalTimer(30);
                        haptic.light();
                      }}
                      className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all shadow-lg ${
                        physicalExercise === exercise.id
                          ? 'bg-gradient-to-br from-orange-600 to-pink-600 border-orange-400 scale-105'
                          : 'bg-purple-950/50 border-purple-700/30 hover:border-orange-500/50'
                      }`}
                    >
                      <span className="text-3xl md:text-4xl block mb-2">{exercise.emoji}</span>
                      <p className="text-xs md:text-sm font-medium text-purple-100">{exercise.label}</p>
                    </button>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-orange-900/40 to-yellow-900/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-8 md:p-10 mb-6 text-center border-2 border-orange-500/30 shadow-xl">
                  <p className="text-5xl md:text-6xl font-bold text-orange-300 mb-2">{physicalTimer}s</p>
                  <p className="text-sm md:text-base text-purple-200 font-medium">Keep moving!</p>
                </div>
                
                {physicalTimer === 0 && (
                  <button
                    onClick={nextExercise}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-green-500 hover:to-emerald-500 transition font-bold flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Feeling Better! Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {exerciseSequence[currentExerciseIndex] === 'grounding' && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl">
                <h3 className="font-bold text-xl md:text-2xl text-purple-100 mb-2">5-4-3-2-1 Grounding</h3>
                <p className="text-sm md:text-base text-purple-300 mb-6">
                  Connect with your present surroundings
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block font-medium text-purple-200 mb-2 text-sm md:text-base">👁️ Name 5 things you can SEE:</label>
                    <input
                      type="text"
                      value={groundingAnswers.see}
                      onChange={(e) => setGroundingAnswers(prev => ({ ...prev, see: e.target.value }))}
                      placeholder="e.g., blue wall, laptop, plant..."
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-700/30 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium text-purple-200 mb-2 text-sm md:text-base">👂 Name 4 things you can HEAR:</label>
                    <input
                      type="text"
                      value={groundingAnswers.hear}
                      onChange={(e) => setGroundingAnswers(prev => ({ ...prev, hear: e.target.value }))}
                      placeholder="e.g., birds, traffic, music..."
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-700/30 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium text-purple-200 mb-2 text-sm md:text-base">✋ Name 3 things you can FEEL:</label>
                    <input
                      type="text"
                      value={groundingAnswers.feel}
                      onChange={(e) => setGroundingAnswers(prev => ({ ...prev, feel: e.target.value }))}
                      placeholder="e.g., chair under me, phone in hand..."
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-700/30 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logExerciseComplete('grounding');
                    nextExercise();
                  }}
                  disabled={!groundingAnswers.see || !groundingAnswers.hear || !groundingAnswers.feel}
                  className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-xl text-sm md:text-base ${
                    groundingAnswers.see && groundingAnswers.hear && groundingAnswers.feel
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500'
                      : 'bg-purple-950/30 text-purple-500 cursor-not-allowed border-2 border-purple-700/30'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete & Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {currentPage === 'reflection' && (
          <div className="space-y-6 animate-fadeIn p-4 md:p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-purple-100 mb-2">Great work! 🎉</h2>
              <p className="text-sm md:text-base text-purple-300">Let's reflect on your experience</p>
            </div>
            
            {aiMessage && (
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-md border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-5 mb-6 shadow-xl">
                <div className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-purple-100 text-sm md:text-base">{aiMessage}</p>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 space-y-6 shadow-2xl">
              <div>
                <label className="block font-medium text-purple-200 mb-3 text-sm md:text-base">How do you feel now?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['😊 Great', '😐 Okay', '😟 Still anxious'].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setReflection(prev => ({ ...prev, difficulty: ['easy', 'medium', 'hard'][idx] }));
                        haptic.light();
                      }}
                      className={`py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-lg text-xs md:text-sm ${
                        reflection.difficulty === ['easy', 'medium', 'hard'][idx]
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 scale-105 text-white'
                          : 'bg-purple-950/50 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-purple-200 mb-3 text-sm md:text-base">Did the exercises help?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['✅ Yes', '❌ Not really'].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setReflection(prev => ({ ...prev, exercisesHelped: idx === 0 }));
                        haptic.light();
                      }}
                      className={`py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-lg text-sm md:text-base ${
                        reflection.exercisesHelped === (idx === 0)
                          ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-400 scale-105 text-white'
                          : 'bg-purple-950/50 border-purple-700/30 text-purple-300 hover:border-green-600/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-purple-200 mb-2 text-sm md:text-base">What went well? (Optional)</label>
                <textarea
                  value={reflection.whatWentWell}
                  onChange={(e) => setReflection(prev => ({ ...prev, whatWentWell: e.target.value }))}
                  placeholder="Share your wins..."
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-700/30 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block font-medium text-purple-200 mb-2 text-sm md:text-base">Current Anxiety Level: {reflection.finalAnxiety}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={reflection.finalAnxiety}
                  onChange={(e) => setReflection(prev => ({ ...prev, finalAnxiety: parseInt(e.target.value) }))}
                  className="w-full h-3 md:h-4 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                  }}
                />
              </div>
              
              <div>
                <label className="block font-medium text-purple-200 mb-2 text-sm md:text-base">Confidence Level: {reflection.finalConfidence}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={reflection.finalConfidence}
                  onChange={(e) => setReflection(prev => ({ ...prev, finalConfidence: parseInt(e.target.value) }))}
                  className="w-full h-3 md:h-4 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #9ca3af 0%, #60a5fa 50%, #22c55e 100%)`
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={submitReflection}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-2xl md:rounded-3xl hover:from-green-500 hover:to-blue-500 transition font-bold flex items-center justify-center gap-2 shadow-2xl text-sm md:text-base"
            >
              Complete Session
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {currentPage === 'complete' && (
          <div className="space-y-6 animate-fadeIn p-4 md:p-6 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl">
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Amazing Work! 🎉
            </h2>
            
            {aiMessage && (
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-md border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xl">
                <p className="text-purple-100 text-base md:text-lg">{aiMessage}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-green-500/30 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-xl">
                <div className="text-3xl md:text-4xl mb-2">📉</div>
                <p className="text-xs md:text-sm text-purple-300">Anxiety Reduced</p>
                <p className="text-2xl md:text-3xl font-bold text-green-400">
                  {context.anxietyLevel - reflection.finalAnxiety} levels
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-blue-500/30 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-xl">
                <div className="text-3xl md:text-4xl mb-2">📈</div>
                <p className="text-xs md:text-sm text-purple-300">Confidence Gained</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-400">
                  +{reflection.finalConfidence} levels
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xl">
              <h3 className="font-bold text-lg md:text-xl text-purple-100 mb-3">Your Next Micro-Goal</h3>
              <p className="text-sm md:text-base text-purple-200 mb-4">
                During your interaction, try to: <span className="font-semibold text-purple-100">Ask one genuine question</span>
              </p>
              <p className="text-xs md:text-sm text-purple-400">Small steps lead to big confidence gains!</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentPage('task-selection');
                  setSelectedTask(null);
                  setExercisesCompleted([]);
                  setCurrentExerciseIndex(0);
                  setChatMessages([]);
                  setReflection({
                    difficulty: null,
                    exercisesHelped: null,
                    whatWentWell: '',
                    whatWasHard: '',
                    finalAnxiety: 3,
                    finalConfidence: 3
                  });
                }}
                className="flex-1 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-2 border-purple-500/30 text-purple-200 py-3 md:py-4 rounded-xl md:rounded-2xl hover:border-purple-400/50 transition font-bold shadow-xl text-sm md:text-base"
              >
                Analyze other tasks
              </button>
              
              <button
                onClick={() => onComplete()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-purple-500 hover:to-pink-500 transition font-bold flex items-center justify-center gap-2 shadow-2xl text-sm md:text-base"
              >
                <TrendingUp className="w-5 h-5" />
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Emergency mode overlay */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-6 animate-fadeIn">
          <button
            onClick={() => {
              setShowEmergency(false);
              setEmergencyTimer(60);
            }}
            className="absolute top-6 right-6 text-purple-300 hover:text-purple-100 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="text-center mb-12">
            <p className="text-purple-400 text-sm mb-2">Emergency Reset</p>
            <p className="text-white text-6xl md:text-7xl font-bold">{emergencyTimer}s</p>
          </div>
          
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm animate-pulse"
              style={{
                animation: 'breathe 4s ease-in-out infinite'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-2xl md:text-3xl font-bold">Just Breathe</p>
            </div>
          </div>
          
          <p className="text-purple-200 text-base md:text-lg text-center max-w-md mb-8">
            You're safe. This feeling will pass. Focus on your breath.
          </p>
          
          {emergencyTimer === 0 && (
            <button
              onClick={() => {
                setShowEmergency(false);
                setEmergencyTimer(60);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl md:rounded-3xl font-bold hover:from-purple-500 hover:to-pink-500 transition shadow-2xl"
            >
              I'm Feeling Better
            </button>
          )}
        </div>
      )}
      
      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        button, input, textarea, select {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        button {
          -webkit-user-select: none;
          user-select: none;
        }

        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa 0%, #e879f9 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa 0%, #e879f9 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a78bfa 0%, #e879f9 100%);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
        }
      `}</style>
    </div>
  );
}