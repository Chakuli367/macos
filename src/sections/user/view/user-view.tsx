import { useState, useEffect , useRef   } from 'react';
import ReactDOM from "react-dom";
import React from 'react';
// ... your other imports
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Sparkles, Trophy, CheckCircle, Lock, Play, ChevronRight,
  Star, Flame, TrendingUp, Target, Zap, Brain, ArrowLeft, Calendar,
  Clock, Crown, Shield, ArrowRight, Heart, Feather, TriangleAlert,
  Loader2, AlertCircle, MapPin, Navigation, LogOut, Users, Award, 
  Gift, Volume2, VolumeX, Eye, Lightbulb, MessageCircle, Timer, Check,CheckCircle2, X, Layers
} from 'lucide-react';
import { auth, db } from '../../../firebase.js'; // ← Add db here
import { onAuthStateChanged } from 'firebase/auth'; // ← Remove collection from here
import { doc, updateDoc, collection, getDocs   } from 'firebase/firestore'; // ← Add this line
import GoogleSignIn from './GoogleSignIn';
import ActionSchedulerPage from './ActionSchedulerPage'; // Adjust path as needed
import { Bell } from "lucide-react";
import FirstLessonPrompt from './betweenpage';
import mixpanelService from 'src/services/servicesmixpanel.ts'; // Adjust path based on your structure
import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from '../../../firebase'; // Adjust path to your firebase config
import {getDoc } from "firebase/firestore";
import SmallTalkNavigator from './smalltalk';
import Lottie from "lottie-react";
import Day1Navigator from "src/components/DAY_01/MAINNAVIGATOR";
import Day2Navigator from "src/components/DAY_02/Day2Navigator";
import Day3Navigator from "src/components/DAY_03/Day3Navigator";
import Day4Navigator from "src/components/DAY_04/Day4Navigator";
import LessonsOnboardingTrailer from "./onboarding1.js";
import IRLConnectionsHub from './irlconnections'
import IRLConnectionsValueHero from './HerosectionIRL'
import { useRouter } from 'next/router';
import  FindAPlace01 from "src/components/DAY_01/FINDAPLACE/01";
import module3 from "./module3.js"
import TALKFrameworkNavigator from './module4.js';
import module2 from "./module2.js"
import SmallTalkNavigator12 from './smalltalk';
import animationData from 'src/PHOTOS/animation.json';
import onboarding1 from "./onboarding1";
import { useMentorStore } from 'src/store/useMentorStore';
import Module06 from "./module06";
import Module07 from "./module07";
import Module08 from "./module08";
import Module09 from "./module09";
import {
  mentorScriptBeforeLesson,
} from 'src/mentor/mentorScript.js';
import {
  mentorScriptAfterLesson,
} from 'src/mentor/mentorScriptAfterLesson.js';



// Import your services
import {
fetchUserLessons,
getUserStats,
type Lesson,
type Task
} from '../../../services/lessonService';


const analytics = getAnalytics(app);

const Day1CompletionOverlay = ({ onDismiss }) => {
  // Assuming Trophy, ArrowRight, X icons are available via the imports
  return (
    <AnimatePresence>
      <motion.div
        // Backdrop overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          // Modal content box
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full m-4 text-center relative"
        >
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Day 1 Complete! You're Awesome!</h2>
          <p className="text-gray-600 mb-8">
            Congratulations on finishing your first day! Click below to access your exclusive Day 1 completion guide and next steps.
          </p>
          <button
            onClick={onDismiss}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Claim Your Reward! <ArrowRight className="inline ml-2 w-5 h-5" />
          </button>
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
const [user, setUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);
const [currentView, setCurrentView] = useState('timeline');
const [selectedLesson, setSelectedLesson] = useState(null);
const [showOnboarding, setShowOnboarding] = React.useState(false);
const [currentSubpage, setCurrentSubpage] = useState(0);
const [journalEntry, setJournalEntry] = useState('');
const [tasks, setTasks] = useState([]);
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [showObstaclesPage, setShowObstaclesPage] = useState(false);
const [userConcern, setUserConcern] = useState('');
const [aiConversation, setAiConversation] = useState([]);
const [isHubOpen, setIsHubOpen] = useState(false);
const [showDay1CompletionOverlay, setShowDay1CompletionOverlay] = useState(false);
const [isAiThinking, setIsAiThinking] = useState(false);
const [day1Complete, setDay1Complete] = useState(false);
const [completedCount, setCompletedCount] = useState(0);
const [totalCount, setTotalCount] = useState(0);
const [selectedDayNumber, setSelectedDayNumber] = useState(1);
const [checkingDay1, setCheckingDay1] = useState(true);
const { active, stepIndex, script, nextStep } = useMentorStore();



// Add this with your other useState declarations

const [loadingProgress, setLoadingProgress] = useState(0);
const [userStats, setUserStats] = useState({
completedLessons: 0,
totalLessons: 0,
xpEarned: 0,
streak: 0,
timeInvested: '0h'
});
const subpageTypes = [ 'intro','chaku',  'reflection', 'complete'];
// Inside your main component function (e.g., UserView, after your existing useState/useEffect calls)

// State to control the visibility of the overlay


// Assuming your user progress state is called 'progress' and has a 'day1Complete' field
// Replace 'progress' with your actual state variable if it's named differently.
// const [progress, setProgress] = useState(...); 
const [userData, setUserData] = useState(null);

const [progress, setProgress] = useState(null);

const [profile, setProfile] = useState(null);

const [dayNumber, setDayNumber] = useState(1);
const [currentStepIndex, setCurrentStepIndex] = useState(0); 
const { startJourney, isJourneyCompleted } = useMentorStore();



const contentVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 0.95 },
};

// --- 2. Screen Data Array ---
const screens = [
  {
    title: `Day ${dayNumber} Complete!`,
    icon: (
      <motion.div
        initial={{ scale: 0, rotate: -120 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="mb-6"
      >
        <div className="w-24 h-24 mx-auto bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-12 h-12 text-white" />
        </div>
      </motion.div>
    ),
    text: "Strong start. Now lock in your Day 1 win by understanding what actually matters next.",
    button: "Claim Your Reward",
    stats: (
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <p className="text-3xl font-bold text-white">
            +{userData?.xp || 100}
          </p>
          <p className="text-purple-200 text-sm">XP</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <p className="text-3xl font-bold text-white">{dayNumber}</p>
          <p className="text-purple-200 text-sm">Streak</p>
        </div>
      </div>
    ),
  },
  {
    title: "What Happens Now",
    icon: null,
    text: "Day 2 success depends on one thing: momentum. Your reward is designed to keep you moving without friction.",
    button: "Next",
  },
  {
    title: "Your Reward",
    icon: null,
    text: "You'll unlock your personalized 'Next Step Guide'—exact actions to follow so you don’t fall off tomorrow.",
    button: "Show Guide",
  },
  {
    title: "Your Daily Schedule",
    icon: null,
    text: "This is where you’ll see exactly what to do each day. No confusion. No guessing. Open it before you start your day — it’s your blueprint.",
    button: "Next",
  },
  {
    title: "Live Action Support",
    icon: null,
    text: "When you’re stuck or unsure what to say in a real conversation, open Live Action Support. You type your situation — you get instant guidance.",
    button: "Next",
  },
  {
    title: "Track Your Actions",
    icon: null,
    text: "If you don’t use Live Support, you can still mark what you completed. This keeps you accountable and stops you from drifting.",
    button: "Next",
  },
  {
    title: "Now Act",
    icon: null,
    text: "You already know what you said you would do today. Stop delaying. Go do it now — before momentum disappears.",
    button: "Finish",
  },
];

const currentScreen = screens[currentStepIndex];
const isLastStep = currentStepIndex === screens.length - 1;




const topicModules = [
  {
    id: 'conversation_mastery',
    title: 'Conversation Mastery',
    description: 'Master the art of engaging conversations',
    icon: '💬',
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/40',
    lessons: [
      {
        id: 'small_talk',
        title: 'Small Talk Fundamentals',
        isTopicModule: true,
        summary: 'Learn to start and maintain casual conversations effortlessly',
        duration: '25 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'deep_conversations',
        title: 'Deep Conversations',
        summary: 'Move beyond surface-level and create meaningful connections',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'confidence_building',
    title: 'Confidence Building',
    description: 'Build unshakeable self-confidence',
    icon: '🦁',
    color: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/40',
    lessons: [
      {
        id: 'body_language',
        title: 'Body Language Power',
        summary: 'Command respect through powerful body language',
        duration: '20 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'voice_control',
        title: 'Voice & Tone Mastery',
        summary: 'Speak with authority and magnetism',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'emotional_intelligence',
    title: 'Emotional Intelligence',
    description: 'Understand and manage emotions effectively',
    icon: '🧠',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/40',
    lessons: [
      {
        id: 'empathy_skills',
        title: 'Empathy & Understanding',
        summary: 'Connect deeply by understanding others\' emotions',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'fear_management',
    title: 'Managing the Fear Response',
    description: 'Understand and regulate your anxiety response',
    icon: '❤️',
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-500/40',
    lessons: [
      {
        id: 'fear_response',
        title: 'Managing the Fear Response',
        isTopicModule: true,
        summary: 'Regulate anxiety at a biological level before it takes over',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'blank_mind',
    title: 'When Your Mind Goes Blank',
    description: 'Recover composure when you freeze mid-conversation',
    icon: '👻',
    color: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500/40',
    lessons: [
      {
        id: 'mind_blank',
        title: 'When Your Mind Goes Blank',
        isTopicModule: true,
        summary: 'Tools to recover naturally in 5 seconds',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'overthinking_loop',
    title: 'Overcoming Overthinking',
    description: 'Break the post-conversation replay loop',
    icon: '🔁',
    color: 'from-cyan-600 to-teal-600',
    borderColor: 'border-cyan-500/40',
    lessons: [
      {
        id: 'overthinking',
        title: 'Overcoming Overthinking',
        isTopicModule: true,
        summary: 'Interrupt the loop before it consumes your night',
        duration: '35 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'boundaries',
    title: 'Setting Emotional Boundaries',
    description: 'Protect your energy without damaging relationships',
    icon: '🛡️',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/40',
    lessons: [
      {
        id: 'emotional_boundaries',
        title: 'Setting Emotional Boundaries',
        isTopicModule: true,
        summary: 'The language and tools to protect yourself sustainably',
        duration: '35 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  }
];


// --- 3. Step Navigation Logic ---
const handleNextStep123 = () => {
  if (isLastStep) {
    handleCelebrationComplete();
  } else {
    setCurrentStepIndex(currentStepIndex + 1);
  }
};


useEffect(() => {
  const seen = localStorage.getItem("lessons_onboarding_seen");
  if (!seen) {
    setShowOnboarding(true);
  }
}, []);







useEffect(() => {
    // 1. Check if progress data is available and day 1 is complete.
    // 2. The localStorage check prevents the overlay from showing on every single page load after it's been seen once.
    const hasSeenOverlay = localStorage.getItem('day1OverlaySeen');

    // Replace `progress` with your actual state variable for user data
    if (progress && progress.day1Complete && !hasSeenOverlay) {
        setShowDay1CompletionOverlay(true);
    }
}, [progress]); // Add all relevant user/progress state variables here

useEffect(() => {
  if (!active || !script[stepIndex]) return;

  const { target, text, signal } = script[stepIndex];

  const checkAndHighlight = () => {
    const targetElement = document.querySelector(target);

    if (!targetElement) {
      setTimeout(checkAndHighlight, 200);
      return;
    }

    import('driver.js').then(({ driver }) => {
      const driverInstance = driver({
        animate: true,
        opacity: 0.3,
        padding: 20,
        allowClose: false,
        showButtons: [],
      });

      driverInstance.highlight({
        element: target,
        popover: {
          title: 'Step ' + (stepIndex + 1),
          description: text,
          position: 'top',
          showButtons: [],
        },
      });

      // ⬇️ WAIT FOR EXTERNAL SIGNAL
      const handleSignal = () => {
        window.removeEventListener(signal, handleSignal);
        driverInstance.destroy();
        nextStep();
      };

      window.addEventListener(signal, handleSignal);
    });
  };

  setTimeout(checkAndHighlight, 100);
}, [active, stepIndex]);




// Initialize Mixpanel when app loads
useEffect(() => {
  mixpanelService.init();
  console.log('🎯 Mixpanel initialized in App');
}, []);

// In your loadUserData function (already in your code):

const ROUTER_COMPONENTS: React.FC<NavigatorProps>[] = [
  /*Day1Navigator as React.FC<NavigatorProps>, */
  /*Day2Navigator as React.FC<NavigatorProps>, */
  /* Day3Navigator as React.FC<NavigatorProps>, */
  Day4Navigator as React.FC<NavigatorProps>,
]


useEffect(() => {
  let cancelled = false;
  let syncTimeout = null;

  // CRITICAL: Skip all sync operations if we're in a lesson
  if (currentView === 'lesson') {
    console.log('â¸ï¸ Skipping checkDay1 - in lesson');
    return;
  }

  const syncLessonCompletionFromFirestore = async () => {
    try {
      // CRITICAL: Double-check we're not in a lesson before syncing
      if (currentView === 'lesson') {
        console.log('â¸ï¸ Skipping sync - lesson in progress');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        console.warn("syncLessonCompletion: no auth user");
        return;
      }

      // Read the datedcourses/social_skills doc
      const ref = doc(db, "users", user.uid, "datedcourses", "social_skills");
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        console.warn("syncLessonCompletion: social_skills doc not found");
        return;
      }

      const data = snap.data();
      const days = Array.isArray(data?.task_overview?.days) ? data.task_overview.days : [];

      console.debug("syncLessonCompletion: days from firestore:", days);

      // If lessons not loaded yet, don't overwrite -- wait until lessons exist
      setLessons(prevLessons => {
        // If prevLessons is empty, just return it (we'll re-run when lessons load)
        if (!Array.isArray(prevLessons) || prevLessons.length === 0) return prevLessons;

        // CRITICAL: One more check before updating state
        if (currentView === 'lesson') {
          console.log('â¸ï¸ Aborting lesson update - user in lesson view');
          return prevLessons;
        }

        // Map each lesson to include completed flag from `days`
        const mapped = prevLessons.map((lesson, idx) => {
          // day numbering might be 1-based; try idx+1 and lesson.day if present
          const dayNum = (lesson.day != null) ? Number(lesson.day) : idx + 1;
          const dayRecord = days.find(d => Number(d.day) === dayNum);
          const completed = !!dayRecord?.completed;

          // only mutate if changed to avoid re-renders
          if (lesson.completed === completed) return lesson;
          return { ...lesson, completed };
        });

        if (!cancelled) {
          console.debug("syncLessonCompletion: updated lessons ->", mapped);
        }
        return mapped;
      });

      // Also set the day1Complete boolean for any UI branches
      const day1 = days.find(d => Number(d.day) === 1);
      if (!cancelled && currentView !== 'lesson') {
        setDay1Complete(!!day1?.completed);
      }

    } catch (err) {
      console.error("syncLessonCompletion: error", err);
    }
  };

  // Delay initial sync by 2 seconds to let navigation settle after redirect
  syncTimeout = setTimeout(() => {
    if (currentView !== 'lesson' && !cancelled) {
      console.log('ðŸ"„ Running delayed initial sync');
      syncLessonCompletionFromFirestore();
    }
  }, 2000);

  // Re-run periodically every 15 seconds
  const interval = setInterval(() => {
    if (!cancelled) {
      syncLessonCompletionFromFirestore();
    }
  }, 15000);

  return () => {
    cancelled = true;
    clearTimeout(syncTimeout);
    clearInterval(interval);
  };
}, [currentView]); 
                      

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);

    if (currentUser) {
      console.log('✅ User authenticated:', currentUser.email);
      
      // 🎯 MIXPANEL: Track user login
      mixpanelService.identifyUser(currentUser.uid, {
        email: currentUser.email,
        name: currentUser.displayName,
        signup_date: currentUser.metadata.creationTime
      });
      mixpanelService.trackLogin(currentUser.uid);
      
      loadUserData();
    } else {
      console.log('👤 No user authenticated');
    }
  });

  return () => unsubscribe();
}, []);

const QuizSubpage = ({ lesson, onNext }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  // This will come from Firestore - example structure
  const quiz = lesson.quiz || {
    questions: [
      {
        question: "What's the main concept from today's lesson?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        explanation: "This is correct because..."
      }
    ]
  };

  const handleAnswerSelect = (index) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  // NEW: Conditional rendering block for the full-screen Hub overlay
  

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === quiz.questions[currentQuestion].correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (quizComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl mx-auto px-4"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}
          >
            {passed ? (
              <CheckCircle className="w-12 h-12 text-green-400" />
            ) : (
              <Brain className="w-12 h-12 text-orange-400" />
            )}
          </motion.div>

          <h2 className="text-4xl font-bold text-white mb-4">
            {passed ? "Great Job!" : "Keep Learning!"}
          </h2>
          
          <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
            <p className="text-6xl font-bold text-purple-400 mb-2">{percentage}%</p>
            <p className="text-slate-300 text-lg">
              You got {score} out of {quiz.questions.length} correct
            </p>
          </div>

          {passed ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-green-300">
                ✨ Excellent! You've proven you understand the material. Ready to move forward!
              </p>
            </div>
          ) : (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
              <p className="text-orange-300">
                💡 Good effort! You can continue, but consider reviewing the lesson later.
              </p>
            </div>
          )}

          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium"
          >
            Continue Journey <ArrowRight className="inline ml-2 w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Knowledge Check</h2>
          </div>
          <p className="text-slate-400">Test your understanding of today's lesson</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-700/30 rounded-xl p-6 mb-6"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">
            {quiz.questions[currentQuestion].question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === quiz.questions[currentQuestion].correctIndex;
              
              let bgColor = 'bg-slate-600/30 hover:bg-slate-600/50';
              let borderColor = 'border-slate-500/50';
              
              if (showFeedback) {
                if (isCorrectAnswer) {
                  bgColor = 'bg-green-500/20';
                  borderColor = 'border-green-500/50';
                } else if (isSelected && !isCorrectAnswer) {
                  bgColor = 'bg-red-500/20';
                  borderColor = 'border-red-500/50';
                }
              } else if (isSelected) {
                bgColor = 'bg-purple-500/20';
                borderColor = 'border-purple-500/50';
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgColor} ${borderColor} ${
                    showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      showFeedback && isCorrectAnswer
                        ? 'bg-green-500 border-green-500'
                        : showFeedback && isSelected && !isCorrectAnswer
                        ? 'bg-red-500 border-red-500'
                        : isSelected
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-slate-400'
                    }`}>
                      {showFeedback && isCorrectAnswer && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                      {showFeedback && isSelected && !isCorrectAnswer && (
                        <AlertCircle className="w-5 h-5 text-white" />
                      )}
                      {!showFeedback && (
                        <span className={isSelected ? 'text-white font-bold' : 'text-slate-400'}>
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-200 text-lg">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 mb-6 ${
              isCorrect 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-orange-500/10 border border-orange-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <Brain className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              )}
              <div>
                <h4 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-300' : 'text-orange-300'}`}>
                  {isCorrect ? "Correct! 🎉" : "Not quite..."}
                </h4>
                <p className="text-slate-300">
                  {quiz.questions[currentQuestion].explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {!showFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium"
            >
              {currentQuestion < quiz.questions.length - 1 ? (
                <>Next Question <ChevronRight className="inline ml-2 w-5 h-5" /></>
              ) : (
                <>See Results <Trophy className="inline ml-2 w-5 h-5" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Update renderSubpage function to include quiz
function renderSubpage(lesson, tasks, toggleTask, journalEntry, setJournalEntry, onNext, onComplete, onBackToTimeline, type, loadUserData) {
  const subpages = {
    intro: <IntroSubpage lesson={lesson} onNext={onNext} />,
    chaku: <ChakuSubpage lesson={lesson} currentDayNumber={selectedDayNumber} onNext={onNext} loadUserData={loadUserData}  onBackToTimeline={onBackToTimeline}/>,
    //motivation: <MotivationSubpage lesson={lesson} onNext={onNext} />,
    //lesson: <LessonSubpage lesson={lesson} onNext={onNext} />,
    //quiz: <QuizSubpage lesson={lesson} onNext={onNext} />,
    //why: <WhySubpage lesson={lesson} onNext={onNext} />,
    //quote: <QuoteSubpage lesson={lesson} onNext={onNext} />,
    //consequences: <ConsequencesSubpage lesson={lesson} onNext={onNext} />,
    //tasks: <TasksSubpage tasks={tasks} toggleTask={toggleTask} onNext={onNext} />,
    //scheduler: <ActionSchedulerPage tasks={tasks} onComplete={(scheduledTasks) => {
      //console.log('Scheduled tasks:', scheduledTasks);
      //onNext();
    //}} onBack={() => {/* handle back */}} />,
    //obstacles: <ObstaclesPage tasks={tasks} onNext={onNext} />,
    reflection: <ReflectionSubpage journalEntry={journalEntry} setJournalEntry={setJournalEntry} onComplete={onComplete} />,
    complete: <CompletionSubpage lesson={lesson} onBackToTimeline={onBackToTimeline} />
  };
  return subpages[type];
}

const handleSelectLesson = (lesson, index) => {
  console.log('🎯 handleSelectLesson called:', { lesson, index });
  
  // ✅ STOP MENTOR IF TOPIC MODULE
  if (lesson.isTopicModule) {
    console.log('🛑 Stopping mentor for topic module');
    const { stop } = useMentorStore.getState();
    stop();
  }
  
  // Rest of your code...
  setSelectedLesson(lesson); 
  setCurrentSubpage(0);
  setSelectedDayNumber(index + 1); 
  
  setTimeout(() => {
    setCurrentView('lesson');
  }, 50);
};



useEffect(() => {
  const checkDay1 = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const ref = doc(db, "users", user.uid, "datedcourses", "social_skills");
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data();
      const days = Array.isArray(data?.task_overview?.days)
        ? data.task_overview.days
        : [];

      const d1 = days.find(d => Number(d.day) === 1);
      const isComplete = d1?.completed === true;

      setDay1Complete(isComplete);
    } catch (err) {
      console.error("Error checking Day 1 status:", err);
    }
  };

  checkDay1();
}, []);

// Auto-open lesson from dashboard
// Auto-open lesson from dashboard

// Auth state listener
// Auth state listener
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);

    if (currentUser) {
      console.log('✅ User authenticated:', currentUser.email);
      loadUserData(); // ONLY call here
    } else {
      console.log('👤 No user authenticated');
    }
  });

  return () => unsubscribe();
}, []); // Remove loadUserData() call from here - DON'T CALL IT TWICE!

// Auto-open lesson from dashboard
useEffect(() => {
  // Skip if already in lesson view
  if (currentView === 'lesson') {
    console.log('â¸ï¸ Skipping auto-open - already in lesson');
    return;
  }

  // Check sessionStorage first (from dashboard redirect)
  const storedLesson = sessionStorage.getItem('autoOpenLesson');
  if (storedLesson && lessons.length > 0) {
    try {
      const { lessonIndex, dayNumber } = JSON.parse(storedLesson);
      const lesson = lessons[lessonIndex];
      
      if (lesson) {
        console.log('ðŸ"— Auto-opening from sessionStorage:', lesson, 'Day:', dayNumber);
        
        // Clear the storage immediately to prevent re-opening
        sessionStorage.removeItem('autoOpenLesson');
        
        // Small delay to ensure state is ready
        setTimeout(() => {
          handleSelectLesson(lesson, lessonIndex);
        }, 100);
      }
    } catch (error) {
      console.error('Error parsing stored lesson:', error);
      sessionStorage.removeItem('autoOpenLesson');
    }
    return; // Exit early - don't check URL params
  }

  // Check URL params as fallback
  const params = new URLSearchParams(window.location.search);
  const lessonIndex = params.get('openLesson');
  
  if (lessonIndex !== null && lessons.length > 0) {
    const index = parseInt(lessonIndex);
    const lesson = lessons[index];
    
    if (lesson) {
      console.log('ðŸ"— Auto-opening from URL:', lesson);
      handleSelectLesson(lesson, index);
      // Clean up URL
      window.history.replaceState({}, '', '/user');
    }
  }
}, [lessons, currentView]);


useEffect(() => {
  // SKIP if in lesson view
  if (currentView === 'lesson') {
    console.log('⏸️ Skipping lesson completion check - in lesson');
    return;
  }

  const updateLessonCompletion = async () => {
    const user = auth.currentUser;
    if (!user) return;


    const ref = doc(db, "users", user.uid, "datedcourses", "social_skills");
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const days = snap.data()?.task_overview?.days || [];
    setLessons(prev =>
      prev.map((lesson, i) => {
        const d = days.find(day => Number(day.day) === i + 1);
        return { ...lesson, completed: !!d?.completed };
      })
    );
  };

  updateLessonCompletion();
}, [currentView]); // <-- ADD DEPENDENCY


const loadUserData = async () => {
  try {
    console.log('🔄 Starting to load user data...');
    console.log('👤 Current User UID:', auth.currentUser?.uid);
    console.log('📧 Current User Email:', auth.currentUser?.email);

    if (!auth.currentUser) {
      console.error('❌ No authenticated user');
      return;
    }

    setLoading(true);
    setError(null);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => (prev >= 90 ? prev : prev + 10));
    }, 200);

    // Fetch data
    const [lessonsData, stats] = await Promise.all([
      fetchUserLessons(auth.currentUser.uid),
      getUserStats(auth.currentUser.uid)
    ]);

    console.log('📚 Fetched Lessons:', lessonsData);
    console.log('📊 User Stats:', stats);

    // Set lessons with proper mapping
    const mappedLessons = lessonsData.map((lesson, index) => ({
      ...lesson,
      // Ensure we have all required fields
      id: lesson.id || `day_${lesson.day}`,
      title: lesson.title || `Day ${lesson.day}`,
      summary: lesson.summary || lesson.tasks?.[0]?.description || 'Complete today\'s challenges',
      duration: lesson.duration || `${(lesson.tasks?.length || 3) * 10} min`,
      xp: lesson.xp || (lesson.tasks?.length || 3) * 50,
      completed: lesson.completed === true,
      day: lesson.day || (index + 1),
      tasks: lesson.tasks || []
    }));

    setLessons(mappedLessons);
    setUserStats(stats);

    clearInterval(progressInterval);
    setLoadingProgress(100);

    setTimeout(() => setLoading(false), 500);
  } catch (err) {
    console.error('❌ Error loading data:', err);
    setError('Failed to load lessons. Please try again.');
    setLoading(false);
  }
};

const handleSignOut = async () => {
try {
await auth.signOut();
console.log('✅ Signed out successfully');
} catch (error) {
console.error('❌ Sign out error:', error);
}
};



// Add this helper function at the top of your component
const saveCurrentProgress = async (lessonId, subpageIndex) => {
  if (!auth.currentUser) return;
  
  try {
    const coursesRef = collection(db, 'users', auth.currentUser.uid, 'datedcourses');
    const coursesSnapshot = await getDocs(coursesRef);
    
    if (!coursesSnapshot.empty) {
      const firstCourseDoc = coursesSnapshot.docs[0];
      const courseDocRef = doc(db, 'users', auth.currentUser.uid, 'datedcourses', firstCourseDoc.id);
      
      await updateDoc(courseDocRef, {
        active_lesson_progress: {
          lessonId: lessonId,
          currentSubpage: subpageIndex,
          lastUpdated: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Update handleNextSubpage
const handleNextSubpage = async () => {
  if (currentSubpage < subpageTypes.length - 1) {
    const newSubpage = currentSubpage + 1;
    setCurrentSubpage(newSubpage);
    await saveCurrentProgress(selectedLesson.id, newSubpage);
  }
};

// Update handlePreviousSubpage
const handlePreviousSubpage = async () => {
  if (currentSubpage > 0) {
    const newSubpage = currentSubpage - 1;
    setCurrentSubpage(newSubpage);
    await saveCurrentProgress(selectedLesson.id, newSubpage);
  } else {
    setCurrentView('timeline');
  }
};

const handleCompleteLesson = async () => {
  if (!selectedLesson || !auth.currentUser) return;

  try {
    // 🎯 MIXPANEL: Track lesson completed
    mixpanelService.trackLessonDone({
      lessonId: selectedLesson.id,
      lessonNumber: selectedLesson.day,
      lessonName: selectedLesson.title,
      moduleName: 'Social Skills',
      timeSpent: 0,
      completionPercentage: 100
    });

   

    // ✅ Update user state AFTER logic
    await loadUserData();
    setCurrentView('timeline');

  } catch (err) {
    console.error('❌ Error completing lesson:', err);
    alert('Failed to complete lesson. Please try again.');
  }
};


const handleSubmitConcern = async () => {
  if (!userConcern.trim()) return;
  
  // Add user message to conversation
  const userMessage = { type: 'user', text: userConcern.trim() };
  setAiConversation([...aiConversation, userMessage]);
  setIsAiThinking(true);
  
  try {
    // YOUR AI ENDPOINT HERE
    const response = await fetch('YOUR_AI_ENDPOINT_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userConcern.trim(),
        context: `The user scheduled tasks and has a concern about following through. Help them overcome this obstacle with tough love and practical advice. Their concern: "${userConcern.trim()}"`,
        // Add any other params your endpoint needs
      })
    });
    
    const data = await response.json();
    const aiMessage = { type: 'ai', text: data.response }; // Adjust based on your API response
    
    setAiConversation(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('AI Error:', error);
    setAiConversation(prev => [...prev, { 
      type: 'ai', 
      text: 'Sorry, I had trouble connecting. But here\'s what I know: whatever concern you have, it\'s valid but not a reason to quit. The key is to start anyway.' 
    }]);
  } finally {
    setUserConcern('');
    setIsAiThinking(false);
  }
};

const handleProceedToCommitment = () => {
  setShowObstaclesPage(false);
  setShowCommitment(true);
};



const toggleTask = async (index) => {
  if (!selectedLesson || !auth.currentUser) return;
  try {
    const newStatus = !tasks[index].done;
    const updated = [...tasks];
    updated[index].done = newStatus;
    setTasks(updated);
    
    // Pass userId, date, taskIndex, done
    await updateTaskStatus(
      auth.currentUser.uid,  // ✅ userId
      selectedLesson.date,    // ✅ date (not id!)
      index,                  // ✅ taskIndex
      newStatus               // ✅ done status
    );
  } catch (err) {
    console.error('❌ Error:', err);
    const reverted = [...tasks];
    reverted[index].done = !reverted[index].done;
    setTasks(reverted);
  }
};



// Show auth loading
if (authLoading) {
return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center">
<Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
</div>
);
}

// Show login page if not authenticated
if (!user) {
return <LoginPage />;
}

// Show loading state
if (loading) {
return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
<motion.div className="max-w-md w-full text-center px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
<motion.div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center" animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}>
<Sparkles className="text-white w-10 h-10" />
</motion.div>
<motion.h2 className="text-3xl font-bold mb-4" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
Loading Your Journey
</motion.h2>
<div className="w-full bg-slate-700 rounded-full h-3 mb-6 overflow-hidden">
<motion.div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${loadingProgress}%` }} />
</div>
</motion.div>
</div>
);
}

// Show error state
if (error) {
return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
<div className="max-w-md w-full text-center px-4">
<AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
<h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
<p className="text-slate-400 mb-6">{error}</p>
<button onClick={loadUserData} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
Try Again
</button>
</div>
</div>
);
}

// Lesson view
if (currentView === 'lesson' && selectedLesson) {
const overallProgress = ((currentSubpage + 1) / subpageTypes.length) * 100;

return (
<motion.div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-slate-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
<header className="bg-transparent border-b border-slate-700/30 pt-16">
<div className="w-full px-6 lg:px-12 py-6">
<div className="flex items-center justify-between mb-6">
<button onClick={handlePreviousSubpage} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
<ArrowLeft className="w-4 h-4" />


</button>
<div className="flex items-center space-x-4">
<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
<Target className="text-white w-6 h-6" />
</div>
<div>
<h1 className="text-xl font-bold">{selectedLesson.title}</h1>
<p className="text-sm text-slate-400">Step {currentSubpage + 1} of {subpageTypes.length}</p>
</div>
</div>
<button onClick={handleSignOut} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
<LogOut className="w-5 h-5" />
</button>
</div>
<div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50 max-w-4xl mx-auto">
<div className="flex justify-between items-center mb-3">
<span className="text-sm font-semibold text-slate-300">{Math.round(overallProgress)}% Complete</span>
<div className="flex space-x-2">
{subpageTypes.map((_, i) => (
<div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i <= currentSubpage ? 'bg-purple-400 scale-110' : 'bg-slate-600'}`} />
))}
</div>
</div>
<div className="h-4 bg-slate-700/80 rounded-full overflow-hidden shadow-inner">
<motion.div 
  initial={{ width: 0 }} 
  animate={{ width: `${overallProgress}%` }} 
  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 shadow-lg"
  transition={{ duration: 0.5, ease: "easeOut" }}
/>
</div>
</div>
</div>
</header>
<main className="flex items-center justify-center px-4 py-8">
  <div
    className="w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 flex flex-col"
    style={{ background: 'linear-gradient(160deg, #3b1f6e 0%, #1e1150 50%, #2d1a6b 100%)', minHeight: '70vh', maxHeight: '80vh' }}
  >
    {/* Inner header */}
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
        <Target className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">{selectedLesson.title}</p>
        <p className="text-purple-300 text-xs">Your AI Coach — Step {currentSubpage + 1}</p>
      </div>
      <span className="text-purple-300 text-xs">{subpageTypes.length} steps</span>
    </div>
    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto">
      {renderSubpage(selectedLesson, tasks, toggleTask, journalEntry, setJournalEntry, handleNextSubpage, handleCompleteLesson, () => setCurrentView('timeline'), subpageTypes[currentSubpage], loadUserData)}
    </div>
  </div>
</main>
</motion.div>
);
}

// Timeline view
// Timeline view
// Timeline view
return (
  <>
    {showOnboarding && !active && (  // ✅ ADD !active
      <LessonsOnboardingTrailer
        onComplete={() => {
          localStorage.setItem("lessons_onboarding_seen", "true");
          setShowOnboarding(false);
        }}
        onSkip={() => {
          localStorage.setItem("lessons_onboarding_seen", "true");
          setShowOnboarding(false);
        }}
      />
    )}
    <TimelineView
      user={user}
      lessons={lessons}
      userStats={userStats}
      handleSelectLesson={handleSelectLesson}
      handleSignOut={handleSignOut}
      isHubOpen={isHubOpen}
      setIsHubOpen={setIsHubOpen}
      currentView={currentView} 
    />
  </>
);
}

// Login Page Component
function LoginPage() {
return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
<div className="absolute inset-0">
{[...Array(20)].map((_, i) => (
<motion.div
key={i}
className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
initial={{ x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) }}
animate={{ y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)], opacity: [0, 1, 0] }}
transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
/>
))}
</div>

<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-md w-full">
<div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="flex justify-center mb-6">
<div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
<Sparkles className="w-10 h-10 text-white" />
</div>
</motion.div>

<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-8">
<h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
<p className="text-slate-400">Continue your learning journey</p>
</motion.div>

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-3 mb-8">
<div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 p-4 rounded-xl text-center border border-purple-500/30">
<Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
<p className="text-xs text-purple-300 font-medium">Earn XP</p>
</div>
<div className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 p-4 rounded-xl text-center border border-blue-500/30">
<Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
<p className="text-xs text-blue-300 font-medium">Track Goals</p>
</div>
<div className="bg-gradient-to-br from-green-800/40 to-green-900/40 p-4 rounded-xl text-center border border-green-500/30">
<Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
<p className="text-xs text-green-300 font-medium">Level Up</p>
</div>
</motion.div>

<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
<GoogleSignIn />
</motion.div>

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-6">
<p className="text-xs text-slate-500">
By signing in, you agree to our{' '}
<a href="#" className="text-purple-400 hover:text-purple-300">Terms</a>
{' '}and{' '}
<a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
</p>
</motion.div>
</div>
</motion.div>
</div>
);
}

// Topic Modules Section Component
function TopicModulesSection({ modules, onSelectLesson }) {
  const [expandedModule, setExpandedModule] = useState(null);

  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Layers className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Topic Modules</h2>
        </div>
        <p className="text-slate-400 text-base ml-1">
          Deep-dive into specific skills at your own pace
        </p>
      </motion.div>

      <div className="w-full max-w-3xl mx-auto max-h-[80vh] overflow-y-auto rounded-2xl bg-slate-900/40 border border-slate-700/40 p-4 relative z-[1]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {modules.map((module, index) => (
            <TopicModuleCard
              key={module.id}
              id={index === 0 ? "Lessonplan" : undefined}
              module={module}
              index={index}
              isExpanded={expandedModule === module.id}
              onToggle={() =>
                setExpandedModule(expandedModule === module.id ? null : module.id)
              }
              onSelectLesson={onSelectLesson}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TopicModuleCard({ id, module, index, isExpanded, onToggle, onSelectLesson }) {
  const totalXP = module.lessons.reduce((sum, l) => sum + (l.xp || 0), 0);
  const completedCount = module.lessons.filter(l => l.completed).length;
  const progress = module.lessons.length > 0 ? (completedCount / module.lessons.length) * 100 : 0;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative z-[1] group"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
          ${isExpanded
            ? 'bg-slate-800/80 border-slate-600/60 shadow-2xl shadow-black/40'
            : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-800/60 hover:shadow-xl hover:shadow-black/30'
          }`}
        onClick={onToggle}
      >
        {/* Gradient top bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${module.color}`} />

        {/* Ambient glow behind card */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${module.color} opacity-[0.06] rounded-full blur-2xl pointer-events-none`} />

        <div className="p-3">
          {/* Icon + Title row */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${module.color} bg-opacity-20 flex items-center justify-center text-base shadow shrink-0`}>
                {module.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-xs leading-snug">{module.title}</h3>
                <p className="text-slate-400 text-[10px] mt-0.5 leading-snug line-clamp-1">{module.description}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 mt-0.5"
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-colors ${isExpanded ? 'text-white' : 'text-slate-500'} rotate-90`} />
            </motion.div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-900/60 rounded px-1.5 py-1">
              <BookOpen className="w-2.5 h-2.5 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium">{module.lessons.length}L</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/60 rounded px-1.5 py-1">
              <Zap className="w-2.5 h-2.5 text-yellow-400" />
              <span className="text-[10px] text-yellow-400 font-medium">+{totalXP}</span>
            </div>
            {completedCount > 0 && (
              <div className="flex items-center gap-1 bg-green-500/10 rounded px-1.5 py-1">
                <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                <span className="text-[10px] text-green-400 font-medium">{completedCount}/{module.lessons.length}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-slate-700/60 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${module.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          {progress === 0 && (
            <p className="text-[10px] text-slate-600 mt-1">Not started</p>
          )}
        </div>

        {/* Expanded lessons */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-1.5 border-t border-slate-700/50 pt-3">
                {module.lessons.map((lesson, idx) => {
                  const isLocked = lesson.locked;
                  const isCompleted = lesson.completed;

                  return (
                    <motion.button
                      key={lesson.id}
                      id={idx === 0 ? "first-topic-lesson" : undefined}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLocked) onSelectLesson(lesson, index);
                      }}
                      disabled={isLocked}
                      className={`w-full text-left rounded-lg p-2 border transition-all group/lesson
                        ${isCompleted
                          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/15'
                          : isLocked
                          ? 'bg-slate-900/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                          : 'bg-slate-900/60 border-slate-700/40 hover:border-slate-500/60 hover:bg-slate-900/80 cursor-pointer'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0
                            ${isCompleted ? 'bg-green-500/20' : isLocked ? 'bg-slate-700/50' : `bg-gradient-to-br ${module.color} bg-opacity-30`}`}>
                            {isCompleted
                              ? <CheckCircle className="w-3 h-3 text-green-400" />
                              : isLocked
                              ? <Lock className="w-3 h-3 text-slate-500" />
                              : <Play className="w-3 h-3 text-white" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold truncate ${isCompleted ? 'text-green-300' : isLocked ? 'text-slate-500' : 'text-white'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-[10px] text-slate-500 line-clamp-1 leading-snug mt-0.5">{lesson.summary}</p>
                          </div>
                        </div>
<div className="flex flex-col items-end gap-0.5 shrink-0">
                          <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                            ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            +{lesson.xp}
                          </div>
                          <span className="text-[10px] text-slate-500">{lesson.duration}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}



// Topic Lesson Card Component
function TopicLessonCard({ lesson, moduleColor, onSelect }) {
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;
  const { active, stepIndex, script } = useMentorStore();
  const topicModules = [
  {
    id: 'conversation_mastery',
    title: 'Conversation Mastery',
    description: 'Master the art of engaging conversations',
    icon: '💬',
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/40',
    lessons: [
      {
        id: 'small_talk',
        title: 'Small Talk Fundamentals',
        isTopicModule: true,
        summary: 'Learn to start and maintain casual conversations effortlessly',
        duration: '25 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'deep_conversations',
        title: 'Deep Conversations',
        summary: 'Move beyond surface-level and create meaningful connections',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'confidence_building',
    title: 'Confidence Building',
    description: 'Build unshakeable self-confidence',
    icon: '🦁',
    color: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/40',
    lessons: [
      {
        id: 'body_language',
        title: 'Body Language Power',
        summary: 'Command respect through powerful body language',
        duration: '20 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'voice_control',
        title: 'Voice & Tone Mastery',
        summary: 'Speak with authority and magnetism',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'emotional_intelligence',
    title: 'Emotional Intelligence',
    description: 'Understand and manage emotions effectively',
    icon: '🧠',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/40',
    lessons: [
      {
        id: 'empathy_skills',
        title: 'Empathy & Understanding',
        summary: 'Connect deeply by understanding others\' emotions',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'fear_management',
    title: 'Managing the Fear Response',
    description: 'Understand and regulate your anxiety response',
    icon: '❤️',
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-500/40',
    lessons: [
      {
        id: 'fear_response',
        title: 'Managing the Fear Response',
        isTopicModule: true,
        summary: 'Regulate anxiety at a biological level before it takes over',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'blank_mind',
    title: 'When Your Mind Goes Blank',
    description: 'Recover composure when you freeze mid-conversation',
    icon: '👻',
    color: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500/40',
    lessons: [
      {
        id: 'mind_blank',
        title: 'When Your Mind Goes Blank',
        isTopicModule: true,
        summary: 'Tools to recover naturally in 5 seconds',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'overthinking_loop',
    title: 'Overcoming Overthinking',
    description: 'Break the post-conversation replay loop',
    icon: '🔁',
    color: 'from-cyan-600 to-teal-600',
    borderColor: 'border-cyan-500/40',
    lessons: [
      {
        id: 'overthinking',
        title: 'Overcoming Overthinking',
        isTopicModule: true,
        summary: 'Interrupt the loop before it consumes your night',
        duration: '35 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'boundaries',
    title: 'Setting Emotional Boundaries',
    description: 'Protect your energy without damaging relationships',
    icon: '🛡️',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/40',
    lessons: [
      {
        id: 'emotional_boundaries',
        title: 'Setting Emotional Boundaries',
        isTopicModule: true,
        summary: 'The language and tools to protect yourself sustainably',
        duration: '35 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  }
];

  useEffect(() => {
    if (!active || !script[stepIndex]) return;

    const { target, text, signal } = script[stepIndex];

    const checkAndHighlight = () => {
      const targetElement = document.querySelector(target);

      if (!targetElement) {
        setTimeout(checkAndHighlight, 200);
        return;
      }

      import('driver.js').then(({ driver }) => {
        const driverInstance = driver({
          animate: true,
          opacity: 0.3,
          padding: 20,
          allowClose: false,
          showButtons: [],
        });

        driverInstance.highlight({
          element: target,
          popover: {
            title: 'Step ' + (stepIndex + 1),
            description: text,
            position: 'top',
            showButtons: [],
          },
        });

        // ⬇️ WAIT FOR EXTERNAL SIGNAL
        const handleSignal = () => {
          window.removeEventListener(signal, handleSignal);
          driverInstance.destroy();
          useMentorStore.getState().nextStep();
        };

        window.addEventListener(signal, handleSignal);
      });
    };

    setTimeout(checkAndHighlight, 100);
  }, [active, stepIndex]);



  return (
    <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  whileHover={!isLocked ? { scale: 1.02, x: 10 } : {}}
  className={`relative z-[100000] group bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer ${
    isCompleted
      ? 'border-green-500/50 bg-green-500/5'
      : isLocked
      ? 'border-slate-700/40 opacity-60 cursor-not-allowed'
      : 'border-slate-700/50 hover:border-slate-600'
  }`}
  onClick={() => !isLocked && onSelect()}
>

      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isCompleted
              ? 'bg-green-500/20'
              : isLocked
              ? 'bg-slate-700/20'
              : `bg-gradient-to-br ${moduleColor} bg-opacity-20`
          }`}
        >
          {isCompleted ? (
            <Trophy className="w-6 h-6 text-green-400" />
          ) : isLocked ? (
            <Lock className="w-6 h-6 text-slate-400" />
          ) : (
            <Target className="w-6 h-6 text-purple-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold mb-1">{lesson.title}</h4>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{lesson.summary}</p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>+{lesson.xp} XP</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {isCompleted ? (
            <div className="px-3 py-2 bg-green-500/20 rounded-lg text-green-400 text-xs font-medium">
              Completed
            </div>
          ) : isLocked ? (
            <div className="px-3 py-2 bg-slate-700/20 rounded-lg text-slate-500 text-xs font-medium">
              Locked
            </div>
          ) : (
            <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1">
              Start
              <Play className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


// Timeline View Component
function TimelineView({ Id  , user, lessons, userStats, handleSelectLesson, handleSignOut, isHubOpen, setIsHubOpen, currentView }) {

  const firstLessonCompleted = lessons.length > 0 && lessons[0].completed;
  const [day1Complete, setDay1Complete] = useState(false);
  const completedCount = lessons ? lessons.filter(l => l.completed).length : 0;
  const totalCount = lessons ? lessons.length : 0;
  

  useEffect(() => {
  if (currentView === 'lesson') {
    console.log('⏸️ Skipping checkDay1 - in lesson');
    setCheckingDay1(false);
    return;
  }
  
  const checkDay1 = async () => {
    const user = auth.currentUser;
    if (!user) {
      setCheckingDay1(false);
      return;
    }

    try {
      const ref = doc(db, "users", user.uid, "datedcourses", "social_skills");
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setCheckingDay1(false);
        return;
      }

      const data = snap.data();
      const days = Array.isArray(data?.task_overview?.days)
        ? data.task_overview.days
        : [];

      const d1 = days.find(d => Number(d.day) === 1);
      const isComplete = d1?.completed === true;

      setDay1Complete(isComplete);
    } catch (err) {
      console.error("Error checking Day 1 status:", err);
    } finally {
      setCheckingDay1(false);
    }
  };

  checkDay1();
}, []);






  // 1. 🛑 IMMEDIATE EARLY RETURN FOR THE HUB 🛑
  if (isHubOpen) {
    return (
      <div className="fixed inset-0 z-[1000] overflow-y-auto bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
        <IRLConnectionsHub onClose={() => setIsHubOpen(false)} />
        <button
          onClick={() => setIsHubOpen(false)}
          className="absolute top-4 right-4 z-[1001] p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all"
        >
          <X className="w-6 h-6" /> 
          
        </button>
      </div>
    );
  }

  

// Calculate which day the user is on based on completed lessons
const completedDays = lessons.filter(l => l.completed).length;
const currentUnlockedDay = Math.min(completedDays + 1, 5);

const topicModules = [
  {
    id: 'conversation_mastery',
    title: 'Conversation Mastery',
    description: 'Master the art of engaging conversations',
    icon: '💬',
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/40',
    lessons: [
      {
        id: 'small_talk',
        title: 'Small Talk Fundamentals',
        isTopicModule: true,
        summary: 'Learn to start and maintain casual conversations effortlessly',
        duration: '25 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'deep_conversations',
        title: 'Deep Conversations',
        summary: 'Move beyond surface-level and create meaningful connections',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'confidence_building',
    title: 'Confidence Building',
    description: 'Build unshakeable self-confidence',
    icon: '🦁',
    color: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/40',
    lessons: [
      {
        id: 'body_language',
        title: 'Body Language Power',
        summary: 'Command respect through powerful body language',
        duration: '20 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'voice_control',
        title: 'Voice & Tone Mastery',
        summary: 'Speak with authority and magnetism',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'emotional_intelligence',
    title: 'Emotional Intelligence',
    description: 'Understand and manage emotions effectively',
    icon: '🧠',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/40',
    lessons: [
      {
        id: 'empathy_skills',
        title: 'Empathy & Understanding',
        summary: 'Connect deeply by understanding others\' emotions',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'fear_management',
    title: 'Managing the Fear Response',
    description: 'Understand and regulate your anxiety response',
    icon: '❤️',
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-500/40',
    lessons: [
      {
        id: 'fear_response',
        title: 'Managing the Fear Response',
        isTopicModule: true,
        summary: 'Regulate anxiety at a biological level before it takes over',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'blank_mind',
    title: 'When Your Mind Goes Blank',
    description: 'Recover composure when you freeze mid-conversation',
    icon: '👻',
    color: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500/40',
    lessons: [
      {
        id: 'mind_blank',
        title: 'When Your Mind Goes Blank',
        isTopicModule: true,
        summary: 'Tools to recover naturally in 5 seconds',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'overthinking_loop',
    title: 'Overcoming Overthinking',
    description: 'Break the post-conversation replay loop',
    icon: '🔁',
    color: 'from-cyan-600 to-teal-600',
    borderColor: 'border-cyan-500/40',
    lessons: [
      {
        id: 'overthinking',
        title: 'Overcoming Overthinking',
        isTopicModule: true,
        summary: 'Interrupt the loop before it consumes your night',
        duration: '35 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  },
  {
    id: 'boundaries',
    title: 'Setting Emotional Boundaries',
    description: 'Protect your energy without damaging relationships',
    icon: '🛡️',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/40',
    lessons: [
      {
        id: 'emotional_boundaries',
        title: 'Setting Emotional Boundaries',
        isTopicModule: true,
        summary: 'The language and tools to protect yourself sustainably',
        duration: '35 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  }
];


return (
  <motion.div
    className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >

    


    {/* HEADER */}
    <header className="bg-transparent border-b border-slate-700/30 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between relative z-[100001]" >

          <div>
            <h1 className="text-2xl font-bold text-white">Your Learning Journey</h1>
            <p className="text-sm text-slate-400">5-Day Transformation Path</p>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </header>

    {/* CONTENT */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* STATS */}
      <div id="stats-container" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <StatsCard
          icon={<Trophy className="w-6 h-6 text-yellow-400" />}
          value={`${completedCount}/${totalCount}`}
          label="Lessons completed"
          color="purple"
        />
        <StatsCard
          icon={<Flame className="w-6 h-6 text-orange-400" />}
          value={userStats.streak}
          label="Days in a row"
          color="green"
        />
      </div>

      

      <div id="topic-modules-section">
      {/* TOPIC MODULES */}
      <TopicModulesSection
        onClick={() => {
          window.dispatchEvent(new Event('LESSON_STARTED'));
        }}
        modules={topicModules}
        onSelectLesson={handleSelectLesson}
      />
      </div>

      {/* LESSON JOURNEY (ANCHOR CONTAINER) */}
      <div id="journey-timeline" className="relative">
        <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
          <MapPin className="w-8 h-8 text-purple-400" />
          Your 5-Day Journey
        </h2>

        {/* ===== TRANSPARENT OVERLAY LAYER ===== */}
      

        {/* ===== LESSON CARDS (UNDERLAY) ===== */}
        <div className="relative z-10 pt-8">
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No lessons available yet
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 transform -translate-x-1/2 hidden md:block" />

              <div className="space-y-12">
                {lessons.map((lesson, index) => {
  const isLocked = true; // later: replace with real logic

  return (
    <div key={lesson.id} className="relative">
      {/* ACTUAL LESSON CARD */}
      <div  className={`${isLocked ? "pointer-events-none" : ""}`}>
        <LessonCard
          lesson={lesson}
          
          index={index}
          lessons={lessons}
          handleSelectLesson={handleSelectLesson}
          displayDayNumber={index + 1}
        />
      </div>

      {/* LOCK OVERLAY */}
      {isLocked && (
        <div className="
          absolute inset-0 
          bg-black/70 
          z-30 
          flex flex-col items-center justify-center 
          rounded-2xl
        ">
          <Lock className="w-10 h-10 text-white mb-3" />
          
          {/* Under Construction Sign */}
          <div className="flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-500 px-6 py-3 rounded-lg mb-2">
            <div className="text-yellow-500 text-2xl">🚧</div>
            <p className="text-yellow-500 font-bold text-lg tracking-wide">
              UNDER CONSTRUCTION
            </p>
            <div className="text-yellow-500 text-2xl">🚧</div>
          </div>

          <p className="text-white font-semibold text-sm tracking-wide">
            Locked
          </p>
        </div>
      )}
    </div>
  );
})}

              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  </motion.div>
);


}

// Helper Components
function StatsCard({ icon, value, label, color }) {
return (
<div className={`bg-gradient-to-br from-${color}-800/60 to-${color}-900/60 backdrop-blur-sm p-6 rounded-2xl border border-${color}-500/30`}>
<div className="flex items-center justify-between mb-2">
{icon}
<span className={`text-${color}-300 text-sm font-medium`}>Progress</span>
</div>
<p className="text-3xl font-bold text-white">{value}</p>
<p className={`text-${color}-300 text-xs mt-1`}>{label}</p>
</div>
);
}

function LessonCard({ lesson, index, lessons, handleSelectLesson, displayDayNumber }) {
  const isLocked = false;
  const isLeft = index % 2 === 0;
  const { active, stepIndex, script } = useMentorStore(); // ✅ ADD THIS

  // ✅ ADD THIS USEEFFECT
  useEffect(() => {
    if (!active || !script[stepIndex]) return;

    const { target, text, signal } = script[stepIndex];

    const checkAndHighlight = () => {
      const targetElement = document.querySelector(target);

      if (!targetElement) {
        setTimeout(checkAndHighlight, 200);
        return;
      }

      import('driver.js').then(({ driver }) => {
        const driverInstance = driver({
          animate: true,
          opacity: 0.3,
          padding: 20,
          allowClose: false,
          showButtons: [],
        });

        driverInstance.highlight({
          element: target,
          popover: {
            title: 'Step ' + (stepIndex + 1),
            description: text,
            position: 'top',
            showButtons: [],
          },
        });

        // ⬇️ WAIT FOR EXTERNAL SIGNAL
        const handleSignal = () => {
          window.removeEventListener(signal, handleSignal);
          driverInstance.destroy();
          useMentorStore.getState().nextStep();
        };

        window.addEventListener(signal, handleSignal);
      });
    };

    setTimeout(checkAndHighlight, 100);
  }, [active, stepIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: index * 0.15 }} 
      className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
    >
      <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <motion.div 
          animate={lesson.completed ? { scale: [1, 1.2, 1] } : {}} 
          transition={{ duration: 2, repeat: Infinity }} 
          className={`w-8 h-8 rounded-full border-4 ${
            lesson.completed 
              ? 'bg-green-500 border-green-300' 
              : isLocked 
              ? 'bg-slate-700 border-slate-600' 
              : 'bg-blue-500 border-blue-300'
          } flex items-center justify-center`}
        >
          {lesson.completed ? (
            <CheckCircle className="w-4 h-4 text-white" />
          ) : isLocked ? (
            <Lock className="w-4 h-4 text-slate-400" />
          ) : (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </motion.div>
      </div>

      <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
        <motion.div 
          whileHover={!isLocked ? { scale: 1.03, y: -5 } : {}} 
          className={`relative group bg-gradient-to-br ${
            lesson.completed 
              ? 'from-green-800/40 to-green-900/40 border-green-500/40' 
              : isLocked 
              ? 'from-slate-800/40 to-slate-900/40 border-slate-700/40 opacity-60' 
              : 'from-purple-800/40 to-blue-900/40 border-purple-500/40 hover:border-purple-400/60'
          } backdrop-blur-sm rounded-2xl border-2 p-6 transition-all cursor-pointer`} 
          onClick={() => {
            if (!isLocked) {
              console.log('🎯 LessonCard clicked!', { lesson, index, displayDayNumber });
              handleSelectLesson(lesson, index);
            }
          }}
        >
          <div className="absolute -top-3 -right-3">
            <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
              lesson.completed 
                ? 'bg-green-500 text-white' 
                : isLocked 
                ? 'bg-slate-700 text-slate-400' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
            }`}>
              Day {displayDayNumber}
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(lesson.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
            lesson.completed 
              ? 'bg-green-500/20' 
              : isLocked 
              ? 'bg-slate-700/20' 
              : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
          }`}>
            {lesson.completed ? (
              <Trophy className="w-8 h-8 text-green-400" />
            ) : isLocked ? (
              <Lock className="w-8 h-8 text-slate-400" />
            ) : (
              <BookOpen className="w-8 h-8 text-purple-400" />
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{lesson.title}</h3>
          <p className="text-slate-300 text-sm mb-4 line-clamp-3">{lesson.summary}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>+{lesson.xp} XP</span>
              </div>
            </div>
          </div>

          {lesson.completed ? (
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Completed!</span>
              </div>
            </div>
          ) : isLocked ? (
            <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <Lock className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-500">Complete Day {index} first</span>
            </div>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white font-medium">
              <Play className="w-5 h-5" />
              <span>Start Lesson</span>
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}



// Subpage components (simplified versions - include your full implementations)
const IntroSubpage = ({ lesson, onNext }) => {
  const [showCommitment, setShowCommitment] = useState(false);
  const [commit, setCommit] = useState({
    time: false,
    space: false,
    action: false,
    commit: false
  });
  const { active, stepIndex, script } = useMentorStore(); // âœ… ADD THIS

  const allDone = Object.values(commit).every(Boolean);

  const handleStart = () => {
    if (!allDone) return setShowCommitment(true);
    onNext();
  };

  return (
  <div className="w-full min-h-screen p-6 flex flex-col">

    {/* Header */}
    <div className="text-center mb-6">
      <h1 className="text-2xl font-semibold text-white">{lesson.title}</h1>
      <p className="text-slate-400 text-sm max-w-sm mx-auto">{lesson.summary}</p>
    </div>

    {/* Start Button */}
    <button
      onClick={handleStart}
      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-white font-semibold"
    >
      Start
    </button>

    {/* Commitment Modal */}
    {showCommitment && (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-[999]"
        onClick={() => setShowCommitment(false)}
      >
        <div
          className="bg-slate-800 p-5 rounded-2xl w-full max-w-sm shadow-xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Ready to start?
          </h3>

          <div className="space-y-2 mb-4">
            {[
              { key: "time", label: "I have time" },
              { key: "space", label: "I'm in a quiet space" },
              { key: "action", label: "I'm ready" },
              { key: "commit", label: "I'll finish this" }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() =>
                  setCommit((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                }
                className={`w-full p-3 rounded-xl border text-left transition ${
                  commit[item.key]
                    ? "bg-green-600/30 border-green-500 text-white"
                    : "bg-slate-700 border-slate-600 text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            disabled={!allDone}
            onClick={() => allDone && onNext()}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              allDone
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-slate-700 text-slate-500"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    )}
  </div>
);

};


const DAY_NAVIGATORS = [Day1Navigator, Day2Navigator, Day3Navigator, Day4Navigator];

// ASSUMPTION: The component that renders ChakuSubpage now passes a
// prop like 'currentDayNumber' based on the timeline index (index + 1).
const ChakuSubpage = ({
  lesson: userData,
  currentDayNumber,
  onNext,
  loadUserData,
  onBackToTimeline,
}) => {
  const dayNumber = currentDayNumber || 1;
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { active, stepIndex, script } = useMentorStore();

  // --- ANIMATION VARIANTS ---
  const contentVariants = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.95 },
  };

  // --- SCREENS DATA ---
  const screens = [
    {
      title: `Day ${dayNumber} Complete!`,
      icon: (
        <motion.div
          initial={{ scale: 0, rotate: -120 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </motion.div>
      ),
      text: "Strong start. Now lock in your Day 1 win by understanding what actually matters next.",
      button: "Claim Your Reward",
      stats: (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-3xl font-bold text-white">+{userData?.xp || 100}</p>
            <p className="text-purple-200 text-sm">XP</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-3xl font-bold text-white">{dayNumber}</p>
            <p className="text-purple-200 text-sm">Streak</p>
          </div>
        </div>
      ),
    },
    {
      title: "What Happens Now",
      icon: null,
      text: "Day 2 success depends on one thing: momentum. Your reward is designed to keep you moving without friction.",
      button: "Next",
    },
    {
      title: "Your Reward",
      icon: null,
      text: "You'll unlock your personalized 'Next Step Guide'—exact actions to follow so you don’t fall off tomorrow.",
      button: "Show Guide",
    },
    {
      title: "Your Daily Schedule",
      icon: (
        <div className="mb-6">
          <img
            src="/assets/schedule.png"
            alt="Daily Schedule"
            className="w-64 h-auto rounded-xl shadow-2xl mx-auto border-2 border-purple-500/30"
          />
        </div>
      ),
      text: "This is where you’ll see exactly what to do each day. No confusion. No guessing. Open it before you start your day — it’s your blueprint.",
      button: "Next",
    },
    {
      title: "Live Action Support",
      icon: (
        <div className="mb-6">
          <img
            src="/assets/liveaction.png"
            alt="Live Support"
            className="w-64 h-auto rounded-xl shadow-2xl mx-auto border-2 border-purple-500/30"
          />
        </div>
      ),
      text: "When you’re stuck or unsure what to say in a real conversation, open Live Action Support. You type your situation — you get instant guidance.",
      button: "Next",
    },
    {
      title: "Track Your Actions",
      icon: (
        <div className="mb-6">
          <img
            src="/assets/tasktracker.png"
            alt="Track Actions"
            className="w-64 h-auto rounded-xl shadow-2xl mx-auto border-2 border-purple-500/30"
          />
        </div>
      ),
      text: "If you don’t use Live Support, you can still mark what you completed. This keeps you accountable and stops you from drifting.",
      button: "Next",
    },
    {
      title: "Now Click here to find your next task",
      icon: null,
      text: "You already know what you said you would do today. Stop delaying. Go do it now — before momentum disappears.",
      button: "Finish",
    },
  ];

  const currentScreen = screens[currentStepIndex];
  const isLastStep = currentStepIndex === screens.length - 1;

  // --- NAVIGATOR LOGIC ---
  const DAY_NAVIGATORS_LIST = [Day1Navigator, Day2Navigator, Day3Navigator, Day4Navigator];
  const availableNavigatorsCount = DAY_NAVIGATORS_LIST.length;
  let navigatorIndex = dayNumber > availableNavigatorsCount ? availableNavigatorsCount - 1 : Math.max(dayNumber - 1, 0);
  const CurrentNavigator = DAY_NAVIGATORS_LIST[navigatorIndex];

  // Lesson ID to Module Component Mapping
const lessonToModuleMap = {
  // Starting Interactions module
  'opening_lines': SmallTalkNavigator12,
  'approach_anxiety': SmallTalkNavigator12,
  'reading_situations': SmallTalkNavigator12,
  
  // Small Talk module
  'small_talk_fundamentals': module2,
  'transition_deeper': module2,
  'keeping_flow': module2,
  
  // Conversation Tactics module
  'active_listening': module3,
  'storytelling': module3,
  'handling_awkward': module3,
  
  // Tips & Tricks module
  'humor_charm': SmallTalkNavigator12,
  'body_language_secrets': SmallTalkNavigator12,
  'memorable_exits': SmallTalkNavigator12,
  
  // Building Connections module
  'genuine_interest': TALKFrameworkNavigator,
  'following_up': TALKFrameworkNavigator,
  'maintaining_connections': TALKFrameworkNavigator,

  // Managing the Fear Response (module06)
  'fear_response': Module06,
  'managing_anxiety': Module06,

  // When Your Mind Goes Blank (module07)
  'mind_blank': Module07,
  'blank_recovery': Module07,

  // Overcoming Overthinking (module08)
  'overthinking': Module08,
  'rumination': Module08,

  // Setting Emotional Boundaries (module09)
  'emotional_boundaries': Module09,
  'setting_limits': Module09,
};


  // At the top with other useEffects
useEffect(() => {
  if (userData.isTopicModule && active) {
    console.log('⏸️ Pausing driver for topic module');
    const { stop } = useMentorStore.getState();
    stop(); // ✅ Kill driver completely
  }
}, [userData.isTopicModule, active]);

  // --- ANALYTICS EVENTS ---
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "day_start", { day: dayNumber, user: auth.currentUser?.uid });
    }
  }, [dayNumber]);

  // âœ… ADD THIS USEEFFECT FOR TOPIC MODULES
  useEffect(() => {
    // Only run for topic modules when they're in fullscreen portal
    if (!userData.isTopicModule || !active || !script[stepIndex]) return;

    const { target, text, signal } = script[stepIndex];

    const checkAndHighlight = () => {
      const targetElement = document.querySelector(target);

      if (!targetElement) {
        console.log('â³ Waiting for element in portal:', target);
        setTimeout(checkAndHighlight, 200);
        return;
      }

      console.log('âœ… Found element in portal:', target);

      import('driver.js').then(({ driver }) => {
        const driverInstance = driver({
          animate: true,
          opacity: 0.3,
          padding: 20,
          allowClose: false,
          showButtons: [],
        });

        driverInstance.highlight({
          element: target,
          popover: {
            title: 'Step ' + (stepIndex + 1),
            description: text,
            position: 'top',
            showButtons: [],
          },
        });

        // âœ… WAIT FOR SIGNAL if needed
        if (signal) {
          const handleSignal = () => {
            window.removeEventListener(signal, handleSignal);
            driverInstance.destroy();
            useMentorStore.getState().nextStep();
          };
          window.addEventListener(signal, handleSignal);
        } else {
          // Regular click listener
          const handleClick = () => {
            targetElement.removeEventListener('click', handleClick);
            driverInstance.destroy();
            useMentorStore.getState().nextStep();
          };
          targetElement.addEventListener('click', handleClick);
        }
      });
    };

    setTimeout(checkAndHighlight, 100);
  }, [active, stepIndex, script, userData.isTopicModule]);


  useEffect(() => {
    if (analytics && CurrentNavigator) {
      logEvent(analytics, "navigator_opened", {
        day: dayNumber,
        navigator: CurrentNavigator?.name,
        user: auth.currentUser?.uid,
      });
    }
  }, [CurrentNavigator]);

  useEffect(() => {
    if (analytics && showCelebration) {
      logEvent(analytics, "step_viewed", { day: dayNumber, step: currentStepIndex, user: auth.currentUser?.uid });
    }
  }, [currentStepIndex, showCelebration]);

  const handleNextStep123 = () => {
  // Existing Firebase Analytics
  if (analytics && showCelebration) {
    logEvent(analytics, "step_action", {
      day: dayNumber,
      step: currentStepIndex,
      action: currentScreen.button,
      user: auth.currentUser?.uid,
    });
  }

  // 🎯 MIXPANEL: Track step progression
  mixpanelService.trackEvent('Celebration Step', {
    day_number: dayNumber,
    step_index: currentStepIndex,
    step_title: currentScreen.title,
    button_text: currentScreen.button,
    user_id: auth.currentUser?.uid
  });

  if (isLastStep) handleCelebrationComplete();
  else setCurrentStepIndex(currentStepIndex + 1);
};

  const handleRouterComplete = async () => {
  // FOR TOPIC MODULES: Close the module and start after-lesson journey
  if (userData.isTopicModule) {
    console.log('🎯 Topic module completed!');
    
    if (loadUserData) await loadUserData();
    
    // ✅ CLOSE THE PORTAL FIRST
    onBackToTimeline();
    
    // ✅ WAIT FOR PORTAL TO CLOSE
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ✅ START AFTER-LESSON JOURNEY
    console.log('🚀 Starting after-lesson journey...');
    
    return; // Exit early
  }

  // FOR DAY LESSONS: Update Firestore and show celebration
  if (auth.currentUser && userData?.day) {
    try {
      const ref = doc(db, "users", auth.currentUser.uid, "datedcourses", "social_skills");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const updatedDays =
          data.task_overview?.days?.map((d) =>
            d.day === userData.day ? { ...d, completed: true } : d
          ) || [];
        await updateDoc(ref, { "task_overview.days": updatedDays });
      }
    } catch (e) {
      console.error("Error updating Firestore:", e);
    }
  }
  
  setShowCelebration(true);
};



  const handleCelebrationComplete = async () => {
  // Existing Firebase Analytics
  if (analytics) {
    logEvent(analytics, "day_complete", { day: dayNumber, user: auth.currentUser?.uid });
  }

  // 🎯 MIXPANEL: Track day completion
  mixpanelService.trackEvent('Day Completed', {
    day_number: dayNumber,
    user_id: auth.currentUser?.uid,
    xp_earned: userData?.xp || 100,
    completed_at: new Date().toISOString()
  });

  setShowCelebration(false);
  if (loadUserData) await loadUserData();
  if (dayNumber === 1) onBackToTimeline();
  else onNext();
};

  // --- SCROLL & LOCK ---
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // ✅ PAUSE onboarding when module opens

  

  // --- NO CONTENT FALLBACK ---
  if (!CurrentNavigator) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">No Content Available for Day {dayNumber}</h2>
        <button onClick={onNext} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl">
          Skip to Next Section →
        </button>
      </div>
    );
  }

  // In ChakuSubpage, add this check at the top:
// In ChakuSubpage, replace the existing isTopicModule check with this:


// In ChakuSubpage, when rendering topic module:
if (userData.isTopicModule) {
  const ModuleComponent = lessonToModuleMap[userData.id] || SmallTalkNavigator12;
  
  
  
 return (
  <>
    {typeof window !== "undefined" &&
      ReactDOM.createPortal(
        <div
          data-portal-active="true"
          className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onBackToTimeline}
        >
          <div
            className="relative w-[90vw] max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ 
              height: 'calc(85vh - env(safe-area-inset-bottom))',
              marginBottom: 'env(safe-area-inset-bottom)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onBackToTimeline}
              className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable module content */}
            <div 
              className="w-full h-full overflow-y-auto bg-slate-900"
              style={{ 
                paddingBottom: 'env(safe-area-inset-bottom)'
              }}
            >
              <ModuleComponent
                lessonContent={userData}
                onCompleteNavigator={handleRouterComplete}
                onBackToTimeline={onBackToTimeline}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
  </>
);

}





  // --- CELEBRATION MODAL ---
  if (showCelebration) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[9999] bg-purple-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#fbbf24", "#3b82f6", "#a855f7"][i % 3],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 150],
                y: [0, (Math.random() - 0.5) * 150],
              }}
              transition={{ duration: 1.8, delay: i * 0.03, repeat: Infinity, repeatDelay: 2 }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center text-center px-4 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center"
            >
              {currentScreen.icon}
              <h1 className="text-4xl font-bold text-white mb-2">{currentScreen.title}</h1>
              {currentStepIndex === 0 && currentScreen.stats}
              <p className="text-purple-200 text-lg mt-4 mb-8 max-w-sm">{currentScreen.text}</p>
            </motion.div>
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleNextStep123}
            className="mt-10 bg-green-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg"
          >
            {currentScreen.button}
            <ArrowRight className="inline ml-2 w-4 h-4" />
          </motion.button>

          <button onClick={handleCelebrationComplete} className="mt-4 text-purple-300 text-xs">
            Skip Celebration →
          </button>
        </div>
      </motion.div>
    );
  }

  // --- FULLSCREEN NAVIGATOR RENDER ---
  return (
    <>
      <div className="w-full min-h-screen bg-slate-900 text-white">
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{dayNumber}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Day {dayNumber} Experience</h3>
                <p className="text-sm text-slate-400">Interactive Journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <CurrentNavigator key={dayNumber} lessonContent={userData} onCompleteNavigator={handleRouterComplete} />,
          document.body
        )}
    </>
  );
};



const MotivationSubpage = ({ lesson, onNext }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-4">
    <div className="bg-gradient-to-br from-purple-700/30 to-blue-500/30 p-8 rounded-3xl border border-blue-600/40 backdrop-blur-md">
      <div className="text-center mb-8">
        <motion.div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
          <Heart className="text-white w-10 h-10" />
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-2">Why This Matters</h2>
      </div>
      <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
        <p className="text-slate-200 text-lg leading-relaxed">{lesson.motivation}</p>
      </div>
      <div className="text-center">
        <button onClick={onNext} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl">
          I'm Ready <ArrowRight className="inline ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

const LessonSubpage = ({ lesson, onNext, apiEndpoint }: any) => {
  const [showGuide, setShowGuide] = useState(false);
  const [stage, setStage] = useState<'intro' | 'questions' | 'contrast' | 'synthesis'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [contrastWorking, setContrastWorking] = useState('');
  const [contrastNotWorking, setContrastNotWorking] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [synthesis, setSynthesis] = useState('');

  const startGuide = async () => {
    setShowGuide(true);
    setIsLoading(true);
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Based on this lesson: "${lesson.lesson}", generate 3 thoughtful Socratic questions to help someone apply this to their specific situation. Return as JSON array of strings.`,
          lesson: lesson.lesson
        })
      });
      
      const data = await response.json();
      setAiQuestions(data.questions || [
        "What specific situation in your life does this lesson remind you of?",
        "If you could change one thing about how you handle this, what would it be?",
        "What would success look like for you in 30 days?"
      ]);
    } catch (error) {
      setAiQuestions([
        "What specific situation in your life does this lesson remind you of?",
        "If you could change one thing about how you handle this, what would it be?",
        "What would success look like for you in 30 days?"
      ]);
    }
    
    setIsLoading(false);
  };

  const handleFlipToAnswer = () => {
    setIsFlipped(true);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');
    setIsFlipped(false);

    if (currentQuestion < aiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage('contrast');
    }
  };

  const handleContrastSubmit = async () => {
    if (!contrastWorking.trim() || !contrastNotWorking.trim()) return;
    
    setIsLoading(true);
    setStage('synthesis');

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Based on the lesson: "${lesson.lesson}", the user's answers: ${answers.join('. ')}, what's working: "${contrastWorking}", and what's not working: "${contrastNotWorking}", create a personalized action plan with 3 specific steps and one key insight.`,
          lesson: lesson.lesson,
          answers: answers,
          working: contrastWorking,
          notWorking: contrastNotWorking
        })
      });
      
      const data = await response.json();
      setSynthesis(data.synthesis || "Your unique path forward combines what's already working with targeted improvements. Focus on building momentum from your strengths while addressing the gaps you've identified.");
    } catch (error) {
      setSynthesis("Your unique path forward combines what's already working with targeted improvements. Focus on building momentum from your strengths while addressing the gaps you've identified.");
    }
    
    setIsLoading(false);
  };

  const closeGuide = () => {
    setShowGuide(false);
    setStage('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setIsFlipped(false);
    setCurrentAnswer('');
    setContrastWorking('');
    setContrastNotWorking('');
    setSynthesis('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      {!showGuide ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">Today's Lesson</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none mb-8">
            <p className="text-slate-300 leading-relaxed text-base md:text-lg">{lesson.lesson}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={startGuide}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Let's Explore This Together
            </button>
            
            <button 
              onClick={onNext}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={closeGuide}
            className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
            Back to Lesson
          </button>

          {stage === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 border border-slate-700/50 text-center"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-400" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Let's Make This Real For You
              </h3>
              <p className="text-slate-300 text-lg mb-8">
                I'll ask you a few thoughtful questions to understand your unique situation
              </p>
              <button
                onClick={() => setStage('questions')}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    Begin Journey
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {stage === 'questions' && (
            <div style={{ perspective: '1000px' }}>
              <motion.div
                className="relative w-full"
                style={{ minHeight: '400px' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                  >
                    {!isFlipped ? (
                      <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 md:p-12">
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-purple-400 text-sm font-medium">
                              Question {currentQuestion + 1} of {aiQuestions.length}
                            </span>
                            <div className="flex gap-2">
                              {aiQuestions.map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-2 w-2 rounded-full ${
                                    idx <= currentQuestion ? 'bg-purple-500' : 'bg-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                            {aiQuestions[currentQuestion]}
                          </h3>
                        </div>

                        <button
                          onClick={handleFlipToAnswer}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 mt-8"
                        >
                          Share My Thoughts
                          <ArrowRight className="w-5 h-5 inline ml-2" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 md:p-12">
                        <div className="mb-4">
                          <label className="text-purple-400 text-sm font-medium block mb-2">
                            Your Thoughts
                          </label>
                          <textarea
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            placeholder="Take your time... there's no right answer, only your truth."
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px] resize-none"
                            autoFocus
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setIsFlipped(false)}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleSubmitAnswer}
                            disabled={!currentAnswer.trim()}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {currentQuestion < aiQuestions.length - 1 ? 'Next Question' : 'Continue'}
                            <ArrowRight className="w-4 h-4 inline ml-2" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {stage === 'contrast' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 border border-slate-700/50"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Let's Find The Gap
              </h3>
              <p className="text-slate-300 text-center mb-8">
                Understanding what's working and what's not will reveal your path forward
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <label className="text-emerald-400 font-medium">What's Working</label>
                  </div>
                  <textarea
                    value={contrastWorking}
                    onChange={(e) => setContrastWorking(e.target.value)}
                    placeholder="What's going well? What are you proud of?"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[150px] resize-none"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <label className="text-amber-400 font-medium">What Needs Attention</label>
                  </div>
                  <textarea
                    value={contrastNotWorking}
                    onChange={(e) => setContrastNotWorking(e.target.value)}
                    placeholder="What's challenging? What would you like to improve?"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[150px] resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleContrastSubmit}
                disabled={!contrastWorking.trim() || !contrastNotWorking.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reveal My Path Forward
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            </motion.div>
          )}

          {stage === 'synthesis' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-purple-900/50 via-slate-800 to-blue-900/50 rounded-2xl p-8 md:p-12 border border-purple-500/30"
            >
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-spin" />
                  <p className="text-slate-300">Crafting your personalized insights...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Your Personalized Path
                    </h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                    <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line">
                      {synthesis}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={closeGuide}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={onNext}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                    >
                      Continue to Next
                      <ChevronRight className="w-4 h-4 inline ml-2" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const WhySubpage = ({ lesson, onNext }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-4">
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-10 rounded-3xl border border-green-600/30 backdrop-blur-sm">
      <h2 className="text-4xl font-bold text-slate-50 mb-6">The Deeper Why</h2>
      <p className="text-slate-300 text-lg leading-relaxed">{lesson.why}</p>
      <div className="text-center mt-8">
        <button onClick={onNext} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
          Next <ChevronRight className="inline ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

const QuoteSubpage = ({ lesson, onNext }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-4 text-center">
    <div className="relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <Feather className="w-16 h-16 mx-auto text-purple-400 mb-6" />
      </motion.div>
      <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-12 rounded-3xl border border-purple-500/30">
        <div className="absolute -top-6 -left-6 text-purple-500/20 text-9xl font-serif">"</div>
        <div className="absolute -bottom-6 -right-6 text-purple-500/20 text-9xl font-serif">"</div>
        <p className="text-3xl md:text-4xl font-light text-slate-100 italic leading-relaxed relative z-10">
          {lesson.quote}
        </p>
      </div>
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium"
      >
        Continue <ChevronRight className="inline ml-2 w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);

const ConsequencesSubpage = ({ lesson, onNext }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-4">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold text-white mb-2">The Choice Is Yours</h2>
      <p className="text-slate-400">Every action has consequences. Choose wisely.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm p-8 rounded-2xl border border-green-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-green-400">If You Take Action</h3>
        </div>
        <p className="text-slate-200 text-lg leading-relaxed">
          {lesson.consequences.positive}
        </p>
        <div className="mt-6 flex items-center gap-2 text-green-400">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">The path to growth</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <TriangleAlert className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-red-400">If You Stay Still</h3>
        </div>
        <p className="text-slate-200 text-lg leading-relaxed">
          {lesson.consequences.negative}
        </p>
        <div className="mt-6 flex items-center gap-2 text-red-400">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium">The comfort zone trap</span>
        </div>
      </motion.div>
    </div>

    <div className="text-center mt-8">
      <button
        onClick={onNext}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium"
      >
        I Choose Growth <ArrowRight className="inline ml-2 w-5 h-5" />
      </button>
    </div>
  </motion.div>
);

const TasksSubpage = ({ tasks, toggleTask, onNext }: any) => {
  const completedCount = tasks.filter((t: any) => t.done).length;
  const allCompleted = completedCount === tasks.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl font-bold text-white">Your Action Steps</h2>
          </div>
          <p className="text-slate-400">Complete these tasks to master today's lesson</p>
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
              <span className="text-sm text-slate-300">{completedCount} of {tasks.length} completed</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {tasks.map((task: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-700/30 backdrop-blur-sm p-6 rounded-xl border ${
                task.done ? 'border-green-500/50 bg-green-500/5' : 'border-slate-600/50'
              } cursor-pointer hover:border-blue-500/50 transition-all`}
              onClick={() => toggleTask(index)}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'
                }`}>
                  {task.done && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`text-lg ${task.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {task.task}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onNext}
            disabled={!allCompleted}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              allCompleted
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {allCompleted ? (
              <>Continue to Reflection <ArrowRight className="inline ml-2 w-5 h-5" /></>
            ) : (
              <>Complete All Tasks First</>
            )}
          </button>
          {!allCompleted && (
            <p className="text-slate-500 text-sm mt-2">Tap tasks to mark them complete</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Add this BEFORE the ReflectionSubpage component


const ActionSchedulerPage = ({ tasks, onComplete, onBack }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [selectedTime, setSelectedTime] = useState({ hour: 3, minute: 0, period: 'PM' });
  const [selectedDay, setSelectedDay] = useState('today');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('15min');
  const [location, setLocation] = useState('');
  const [showCommitment, setShowCommitment] = useState(false);
  const [commitmentText, setCommitmentText] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  // Clock hand angles
  const hourAngle = ((selectedTime.hour % 12) * 30) + (selectedTime.minute * 0.5);
  const minuteAngle = selectedTime.minute * 6;

  const dayOptions = [
    { value: 'today', label: 'Today', date: new Date() },
    { value: 'tomorrow', label: 'Tomorrow', date: new Date(Date.now() + 86400000) },
    { value: 'this_week', label: 'This Week', date: new Date(Date.now() + 259200000) }
  ];

  const reminderOptions = [
    { value: '15min', label: '15 min before' },
    { value: '1hour', label: '1 hour before' },
    { value: 'morning', label: 'Morning of' }
  ];

  const currentTask = tasks[currentTaskIndex];

  // Analytics tracking
  const trackEvent = (eventName, properties = {}) => {
    console.log('📊 Analytics:', eventName, properties);
  };

  const handleTimeChange = (type, value) => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);

    if (type === 'hour') {
      setSelectedTime(prev => ({ ...prev, hour: value }));
    } else if (type === 'minute') {
      setSelectedTime(prev => ({ ...prev, minute: value }));
    } else if (type === 'period') {
      setSelectedTime(prev => ({ ...prev, period: value }));
    }
  };

  const getScheduledDateTime = () => {
    const dayOption = dayOptions.find(d => d.value === selectedDay);
    const date = new Date(dayOption.date);
    
    let hour = selectedTime.hour;
    if (selectedTime.period === 'PM' && hour !== 12) hour += 12;
    if (selectedTime.period === 'AM' && hour === 12) hour = 0;
    
    date.setHours(hour, selectedTime.minute, 0, 0);
    return date;
  };

  const handleScheduleTask = () => {
    const scheduledDateTime = getScheduledDateTime();
    
    const scheduled = {
      task: currentTask,
      time: selectedTime,
      day: selectedDay,
      dateTime: scheduledDateTime,
      reminder: reminderEnabled ? reminderTime : null,
      location: location || null
    };

    setScheduledTasks([...scheduledTasks, scheduled]);
    trackEvent('task_scheduled', { task_index: currentTaskIndex });

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setLocation('');
    } else {
      setShowCommitment(true);
    }
  };

  const addToCalendar = (scheduled) => {
    const startTime = new Date(scheduled.dateTime).toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(scheduled.dateTime.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d+/g, '');
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Action: ' + scheduled.task.task)}&dates=${startTime}/${endTime}&details=${encodeURIComponent('Task from your learning journey')}&location=${encodeURIComponent(scheduled.location || '')}`;

    window.open(googleCalendarUrl, '_blank');
  };

  const handleFinalCommitment = () => {
    if (commitmentText.toUpperCase() === 'I COMMIT') {
      trackEvent('commitment_completed', { total_tasks: scheduledTasks.length });
      onComplete(scheduledTasks);
    }
  };

  if (showCommitment) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">Your Commitment Contract</h2>
            <p className="text-slate-400">Make it official</p>
          </div>

          <div className="bg-slate-700/30 rounded-2xl p-6 mb-6 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">You've scheduled:</h3>
            {scheduledTasks.map((scheduled, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium mb-2">{scheduled.task.task}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {dayOptions.find(d => d.value === scheduled.day)?.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {scheduled.time.hour}:{scheduled.time.minute.toString().padStart(2, '0')} {scheduled.time.period}
                      </span>
                      {scheduled.reminder && (
                        <span className="flex items-center gap-1 text-green-400">
                          <Bell className="w-4 h-4" />
                          {reminderOptions.find(r => r.value === scheduled.reminder)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => addToCalendar(scheduled)} className="ml-4 text-purple-400 hover:text-purple-300 transition-colors" title="Add to Calendar">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/30 mb-6">
            <p className="text-slate-200 text-lg mb-4 text-center">
              "I commit to completing these actions at the scheduled times."
            </p>
            <div className="mb-4">
              <label className="block text-slate-300 mb-2">Type "I COMMIT" to confirm:</label>
              <input type="text" value={commitmentText} onChange={(e) => setCommitmentText(e.target.value)} placeholder="I COMMIT" className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-200 text-center text-xl font-bold uppercase placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleFinalCommitment} disabled={commitmentText.toUpperCase() !== 'I COMMIT'} className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${commitmentText.toUpperCase() === 'I COMMIT' ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
              Lock In My Commitment <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-2">When Will You Take Action?</h2>
          <p className="text-slate-400 mb-4">The difference between wanting and doing? A specific time.</p>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Task {currentTaskIndex + 1} of {tasks.length}</span>
          </div>
        </div>

        <motion.div key={currentTaskIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/30 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{currentTask.task}</h3>
              <p className="text-slate-400 text-sm">Schedule exactly when you'll do this</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Select Time</h3>
            
            <div className="relative w-80 h-80 mx-auto mb-6">
              <motion.div animate={isRotating ? { rotate: [0, 5, -5, 0] } : {}} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-2xl border-8 border-slate-600" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.7)' }}>
                <div className="absolute inset-0 rounded-full opacity-10" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }} />
                
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-slate-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg" />

                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30) - 90;
                  const isMainHour = i % 3 === 0;
                  return (
                    <div key={i} className="absolute top-1/2 left-1/2" style={{ transform: `rotate(${angle + 90}deg) translateY(-140px)`, transformOrigin: '0 0' }}>
                      <div className={`${isMainHour ? 'w-1 h-6 bg-slate-300' : 'w-0.5 h-3 bg-slate-400'} mx-auto`} />
                      {isMainHour && (
                        <div className="text-slate-300 text-xl font-bold mt-2 text-center" style={{ transform: `rotate(${-angle - 90}deg)` }}>
                          {i === 0 ? 12 : i}
                        </div>
                      )}
                    </div>
                  );
                })}

                <motion.div animate={{ rotate: hourAngle }} transition={{ type: "spring", stiffness: 100 }} className="absolute top-1/2 left-1/2 origin-bottom" style={{ width: '8px', height: '80px', marginLeft: '-4px', marginTop: '-80px' }}>
                  <div className="w-full h-full bg-gradient-to-b from-slate-300 to-slate-400 rounded-full shadow-lg" />
                </motion.div>

                <motion.div animate={{ rotate: minuteAngle }} transition={{ type: "spring", stiffness: 100 }} className="absolute top-1/2 left-1/2 origin-bottom" style={{ width: '6px', height: '110px', marginLeft: '-3px', marginTop: '-110px' }}>
                  <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-500 rounded-full shadow-lg" />
                </motion.div>
              </motion.div>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Hour</label>
                  <select value={selectedTime.hour} onChange={(e) => handleTimeChange('hour', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-center font-bold focus:outline-none focus:border-blue-500">
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Minute</label>
                  <select value={selectedTime.minute} onChange={(e) => handleTimeChange('minute', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-center font-bold focus:outline-none focus:border-blue-500">
                    {[0, 15, 30, 45].map((min) => (
                      <option key={min} value={min}>{min.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Period</label>
                  <select value={selectedTime.period} onChange={(e) => handleTimeChange('period', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-center font-bold focus:outline-none focus:border-blue-500">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Choose Day</h3>
              <div className="grid grid-cols-3 gap-3">
                {dayOptions.map((day) => (
                  <motion.button key={day.value} onClick={() => setSelectedDay(day.value)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`p-4 rounded-xl border-2 transition-all ${selectedDay === day.value ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-700/30 border-slate-600'}`}>
                    <Calendar className={`w-6 h-6 mx-auto mb-2 ${selectedDay === day.value ? 'text-blue-400' : 'text-slate-400'}`} />
                    <p className={`text-sm font-medium ${selectedDay === day.value ? 'text-blue-300' : 'text-slate-300'}`}>{day.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white">Reminder</h3>
                <button onClick={() => setReminderEnabled(!reminderEnabled)} className={`p-2 rounded-lg transition-colors ${reminderEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {reminderEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
              </div>
              
              {reminderEnabled && (
                <div className="space-y-2">
                  {reminderOptions.map((option) => (
                    <button key={option.value} onClick={() => setReminderTime(option.value)} className={`w-full text-left p-3 rounded-lg border transition-all ${reminderTime === option.value ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-slate-700/30 border-slate-600 text-slate-300'}`}>
                      <div className="flex items-center gap-2">
                        {reminderTime === option.value && <Check className="w-4 h-4" />}
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Location (Optional)</h3>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Coffee shop, Gym..." className="w-full bg-slate-700/30 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500" />
              </div>
            </div>

            <button onClick={handleScheduleTask} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all">
              Schedule This Task <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>

            {scheduledTasks.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm font-medium">Progress</span>
                  <span className="text-purple-400 text-sm font-bold">{scheduledTasks.length}/{tasks.length}</span>
                </div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(scheduledTasks.length / tasks.length) * 100}%` }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ObstaclesPage = ({ onNext, tasks }) => {
  // Safety check
  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-800/50 rounded-2xl p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Tasks Found</h3>
          <p className="text-slate-400 mb-6">There are no tasks to work through.</p>
          <button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
          >
            Continue Anyway <ArrowRight className="inline ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskConversations, setTaskConversations] = useState({}); // {taskIndex: [{type: 'user'/'ai', text: '...'}]}
  const [userConcern, setUserConcern] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showBreakAnimation, setShowBreakAnimation] = useState(false);
  const [brokenTasks, setBrokenTasks] = useState(new Set()); // Track which tasks are broken free
  const chatEndRef = useRef(null);

  const currentTask = tasks[currentTaskIndex];
  const currentConversation = taskConversations[currentTaskIndex] || [];
  const hasConversation = currentConversation.length > 0;
  const isTaskBroken = brokenTasks.has(currentTaskIndex);
  const allTasksAddressed = brokenTasks.size === tasks.length;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation, isAiThinking]);

  const handleSubmitConcern = async () => {
    if (!userConcern.trim()) return;
    
    // Add user message to conversation
    const newMessage = { type: 'user', text: userConcern.trim(), timestamp: Date.now() };
    const updatedConversations = {
      ...taskConversations,
      [currentTaskIndex]: [...currentConversation, newMessage]
    };
    setTaskConversations(updatedConversations);
    setUserConcern('');
    setIsAiThinking(true);

    try {
      // REPLACE WITH YOUR AI ENDPOINT
      const response = await fetch('YOUR_AI_ENDPOINT_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage.text,
          task: currentTask.task,
          conversationHistory: currentConversation,
          context: `The user is working on this task: "${currentTask.task}". They have a concern. Help them overcome it with tough love, practical advice, and motivation. Previous conversation: ${JSON.stringify(currentConversation.slice(-4))}`,
        })
      });
      
      const data = await response.json();
      
      // Add AI response to conversation
      const aiMessage = { type: 'ai', text: data.response, timestamp: Date.now() };
      setTaskConversations(prev => ({
        ...prev,
        [currentTaskIndex]: [...(prev[currentTaskIndex] || []), aiMessage]
      }));
      
    } catch (error) {
      console.error('AI Error:', error);
      const aiMessage = { 
        type: 'ai', 
        text: "I hear your concern. Here's the truth: obstacles are just tests of commitment. The fact you're thinking about this shows you care. Now let's push through anyway. You're stronger than this doubt.",
        timestamp: Date.now()
      };
      setTaskConversations(prev => ({
        ...prev,
        [currentTaskIndex]: [...(prev[currentTaskIndex] || []), aiMessage]
      }));
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleBreakFree = () => {
    setShowBreakAnimation(true);
    
    setTimeout(() => {
      setBrokenTasks(prev => new Set([...prev, currentTaskIndex]));
      setShowBreakAnimation(false);
      
      // Move to next task if available
      if (currentTaskIndex < tasks.length - 1) {
        setTimeout(() => {
          setCurrentTaskIndex(currentTaskIndex + 1);
        }, 1000);
      }
    }, 2000);
  };

  const handleSkipTask = () => {
    // Mark as broken without any conversation
    const skipMessage = {
      [currentTaskIndex]: [
        { type: 'user', text: "No concerns - I'm ready!", timestamp: Date.now() },
        { type: 'ai', text: "That's the spirit! Confidence is your superpower. Let's do this! 💪", timestamp: Date.now() }
      ]
    };
    setTaskConversations(prev => ({ ...prev, ...skipMessage }));
    setBrokenTasks(prev => new Set([...prev, currentTaskIndex]));
    
    if (currentTaskIndex < tasks.length - 1) {
      setTimeout(() => {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }, 500);
    }
  };

  const handleGoToTask = (index) => {
    if (!showBreakAnimation && !isAiThinking) {
      setCurrentTaskIndex(index);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-6xl mx-auto px-4"
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-5xl font-bold text-white mb-3">Break Free From Doubt</h2>
          <p className="text-slate-400 text-lg mb-4">Every concern is a cage. Let's shatter them together.</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {tasks.map((_, index) => {
              const isCurrent = index === currentTaskIndex;
              const isBroken = brokenTasks.has(index);
              const hasChat = taskConversations[index]?.length > 0;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleGoToTask(index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  disabled={showBreakAnimation || isAiThinking}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    isBroken 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 cursor-pointer' 
                      : isCurrent 
                      ? 'bg-orange-500 text-white ring-4 ring-orange-300 scale-110' 
                      : hasChat
                      ? 'bg-blue-500 text-white cursor-pointer'
                      : 'bg-slate-700 text-slate-400 cursor-pointer'
                  }`}
                >
                  {isBroken ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
          
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-5 py-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Current Task & Cage */}
          <div>
            <motion.div
              key={currentTaskIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/30 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentTask.task}</h3>
                  <p className="text-slate-400">Talk through any doubts or concerns</p>
                </div>
              </div>
            </motion.div>

            {/* The Cage */}
            {!isTaskBroken ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-4 relative overflow-hidden shadow-2xl ${
                  hasConversation ? 'border-orange-500 shadow-orange-500/20' : 'border-slate-600'
                }`}>
                  {/* Animated Cage Bars */}
                  <div className="absolute inset-0 flex justify-around pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={showBreakAnimation ? {
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                          rotate: [0, Math.random() * 180 - 90],
                          opacity: [1, 0]
                        } : {}}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`w-2 h-full ${hasConversation ? 'bg-gradient-to-b from-orange-500 to-red-500' : 'bg-slate-600/50'}`}
                        style={hasConversation ? { boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)' } : {}}
                      />
                    ))}
                  </div>

                  {/* Lock at Top */}
                  {hasConversation && (
                    <motion.div
                      animate={showBreakAnimation ? {
                        y: -100,
                        rotate: 360,
                        scale: 0,
                        opacity: 0
                      } : {}}
                      transition={{ duration: 1 }}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
                    >
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    {/* Conversation Area */}
                    {hasConversation && (
                      <div className={`bg-slate-900/70 rounded-xl p-4 mb-4 max-h-[400px] overflow-y-auto ${hasConversation ? 'pt-12' : ''}`}>
                        <div className="space-y-4">
                          {currentConversation.map((message, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[85%] rounded-2xl p-4 ${
                                message.type === 'user' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'bg-slate-700/80 text-slate-200 border border-slate-600'
                              }`}>
                                {message.type === 'ai' && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <Brain className="w-4 h-4 text-purple-400" />
                                    <span className="text-purple-400 font-semibold text-xs">AI Coach</span>
                                  </div>
                                )}
                                <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                              </div>
                            </motion.div>
                          ))}
                          
                          {isAiThinking && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex justify-start"
                            >
                              <div className="bg-slate-700/80 rounded-2xl p-4 border border-slate-600">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                  <span className="text-slate-400 text-sm">AI is thinking...</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          
                          <div ref={chatEndRef} />
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!hasConversation && (
                      <div className="text-center py-8 mb-4">
                        <Lock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg mb-2">This cage is empty...</p>
                        <p className="text-slate-500 text-sm">Share your doubts. Let's break them together.</p>
                      </div>
                    )}

                    {/* Input Area */}
                    {!showBreakAnimation && (
                      <div className="bg-slate-800/70 rounded-xl p-4">
                        <textarea
                          value={userConcern}
                          onChange={(e) => setUserConcern(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmitConcern();
                            }
                          }}
                          placeholder="Type your concern here... (Press Enter to send)"
                          className="w-full h-24 bg-slate-900/50 border-2 border-slate-600 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none text-sm"
                          disabled={isAiThinking}
                        />

                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={handleSubmitConcern}
                            disabled={!userConcern.trim() || isAiThinking}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                              userConcern.trim() && !isAiThinking
                                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {isAiThinking ? 'Sending...' : 'Send Message'}
                          </button>
                          
                          {!hasConversation && (
                            <button
                              onClick={handleSkipTask}
                              className="px-4 py-2 rounded-lg font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-sm"
                            >
                              No Concerns 💪
                            </button>
                          )}
                        </div>

                        {hasConversation && !isAiThinking && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 pt-4 border-t border-slate-700"
                          >
                            <p className="text-slate-400 text-xs mb-3 text-center">
                              Feel confident? Ready to move forward?
                            </p>
                            <button
                              onClick={handleBreakFree}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/50 transition-all"
                            >
                              💥 BREAK FREE! 💥
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Break Animation Overlay */}
                    {showBreakAnimation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center z-30 bg-slate-900/50 backdrop-blur-sm rounded-xl"
                      >
                        <motion.div
                          animate={{
                            scale: [0, 3, 0],
                            rotate: [0, 180, 360],
                            opacity: [1, 1, 0]
                          }}
                          transition={{ duration: 2 }}
                          className="text-9xl"
                        >
                          💥
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              // Broken Cage - Freedom
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border-4 border-green-500 relative overflow-hidden">
                  {/* Broken Bars */}
                  <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-full bg-slate-600"
                        style={{
                          transform: `rotate(${Math.random() * 30 - 15}deg) translateY(${Math.random() * 20}px)`
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    <h3 className="text-4xl font-bold text-green-400 mb-4">FREEDOM! ✨</h3>
                    <p className="text-green-200 text-lg mb-2">
                      You conquered this task!
                    </p>
                    <p className="text-slate-400 text-sm mb-6">
                      {currentConversation.filter(m => m.type === 'user').length} concerns addressed
                    </p>

                    {currentTaskIndex < tasks.length - 1 ? (
                      <button
                        onClick={() => setCurrentTaskIndex(currentTaskIndex + 1)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
                      >
                        Next Task <ArrowRight className="inline ml-2 w-5 h-5" />
                      </button>
                    ) : (
                      <p className="text-green-300">Click another task or continue below!</p>
                    )}
                  </div>

                  {/* Confetti Effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: '50%',
                          y: '50%',
                          scale: 0,
                          opacity: 1
                        }}
                        animate={{
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          scale: [0, 1, 0],
                          opacity: [1, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.05,
                          ease: "easeOut"
                        }}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: ['#22c55e', '#10b981', '#fbbf24', '#f59e0b'][i % 4]
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - All Tasks Overview */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-7 h-7 text-yellow-400" />
              Your Journey
            </h3>
            
            <div className="space-y-4">
              {tasks.map((task, index) => {
                const taskChat = taskConversations[index] || [];
                const isCurrent = index === currentTaskIndex;
                const isBroken = brokenTasks.has(index);
                const hasChat = taskChat.length > 0;
                const messageCount = taskChat.filter(m => m.type === 'user').length;
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleGoToTask(index)}
                    disabled={showBreakAnimation || isAiThinking}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left rounded-xl p-5 border-2 transition-all ${
                      isBroken
                        ? 'bg-green-900/20 border-green-500/50'
                        : isCurrent
                        ? 'bg-orange-900/20 border-orange-500 ring-2 ring-orange-400'
                        : hasChat
                        ? 'bg-blue-900/20 border-blue-500/50'
                        : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isBroken
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-orange-500'
                          : hasChat
                          ? 'bg-blue-500'
                          : 'bg-slate-700'
                      }`}>
                        {isBroken ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <span className="text-white font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold mb-2 ${
                          isBroken ? 'text-green-300' : isCurrent ? 'text-orange-300' : hasChat ? 'text-blue-300' : 'text-slate-400'
                        }`}>
                          {task.task}
                        </h4>
                        
                        {hasChat && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`${isBroken ? 'text-green-400' : 'text-blue-400'}`}>
                              💬 {messageCount} {messageCount === 1 ? 'message' : 'messages'}
                            </span>
                          </div>
                        )}
                        
                        {isBroken && (
                          <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                            <Flame className="w-4 h-4" />
                            <span className="font-medium">Conquered!</span>
                          </div>
                        )}
                        
                        {!hasChat && !isCurrent && (
                          <p className="text-slate-600 text-sm">Waiting...</p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-6 bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 font-medium">Progress</span>
                <span className="text-2xl font-bold text-white">
                  {brokenTasks.size}/{tasks.length}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(brokenTasks.size / tasks.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Total Messages:</span>
                  <span className="text-white font-medium">
                    {Object.values(taskConversations).reduce((sum, conv) => sum + conv.filter(m => m.type === 'user').length, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tasks with Doubts:</span>
                  <span className="text-white font-medium">
                    {Object.keys(taskConversations).length}/{tasks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        {allTasksAddressed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/50 mb-6">
              <h3 className="text-3xl font-bold text-white mb-3">🎉 All Cages Broken! 🎉</h3>
              <p className="text-slate-300 text-lg mb-4">
                You've faced every doubt and shattered every barrier. Nothing can stop you now.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300">Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300">Energized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300">Unstoppable</span>
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-12 py-4 rounded-xl shadow-lg shadow-purple-500/50 transition-all"
            >
              Continue Your Journey <ArrowRight className="inline ml-2 w-6 h-6" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ReflectionSubpage = ({ journalEntry, setJournalEntry, onComplete }: any) => {
  const [localEntry, setLocalEntry] = useState(journalEntry);
  const canComplete = localEntry.trim().length > 20;

  const handleComplete = () => {
    setJournalEntry(localEntry);
    onComplete();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Reflect & Integrate</h2>
          </div>
          <p className="text-slate-400">Write down your thoughts and insights from today's lesson</p>
        </div>

        <div className="mb-6">
          <textarea
            value={localEntry}
            onChange={(e) => setLocalEntry(e.target.value)}
            placeholder="What did you learn? How will you apply this? What surprised you?..."
            className="w-full h-64 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
          <div className="flex justify-between items-center mt-2 px-2">
            <span className="text-slate-500 text-sm">
              {localEntry.length} characters
            </span>
            <span className="text-slate-500 text-sm">
              {canComplete ? '✓ Ready to complete' : 'Write at least 20 characters'}
            </span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              canComplete
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Complete Lesson <CheckCircle className="inline ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CompletionSubpage = ({ lesson, onBackToTimeline }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Trophy className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent mb-4"
      >
        Lesson Complete!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-slate-300 mb-8"
      >
        You've earned <span className="text-yellow-400 font-bold">+{lesson.xp} XP</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-4">What's Next?</h3>
        <p className="text-slate-300 text-lg mb-6">
          You've taken the first step. Now it's time to put this into practice in the real world.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 p-4 rounded-xl">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm">Keep your streak alive</p>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-xl">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm">Practice daily</p>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm">Track your progress</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-4 justify-center"
      >
        <button
          onClick={onBackToTimeline}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium"
        >
          Back to Journey <Navigation className="inline ml-2 w-5 h-5" />
        </button>
      </motion.div>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
              y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
              scale: 0
            }}
            animate={{
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.02,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* --- START ADDITION: Conditional rendering of the overlay --- */}

      


    
    {/* --- END ADDITION --- */}
    </motion.div>



  );

}