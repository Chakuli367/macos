import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import PropTypes from 'prop-types';
import {
  Flame, Trophy, Target, Clock, Zap, Brain, MessageSquare,
  CheckCircle, Star, TrendingUp, Award, Users, Lightbulb,
  BarChart3, Heart, Volume2, Camera, Play, Pause, RotateCcw,
  ChevronRight, Sparkles, Gift, Crown, AlertTriangle, X,
  ChevronDown, ChevronUp, SkipForward
} from 'lucide-react';


const EnhancedTaskHub = ({ task: propTask, userId: propUserId, userProfile: propUserProfile }) => {

  EnhancedTaskHub.propTypes = {
    userId: PropTypes.string.isRequired,
    userProfile: PropTypes.shape({
      xp: PropTypes.number,
      level: PropTypes.number,
      streak: PropTypes.number,
      successRate: PropTypes.number
    }).isRequired,
    task: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string,
      difficulty: PropTypes.string,
      totalSteps: PropTypes.number.isRequired,
      estimatedTime: PropTypes.string,
      xpReward: PropTypes.number,
      steps: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired
  };

  const [userProfile, setUserProfile] = useState(propUserProfile);
  const [currentStep, setCurrentStep] = useState(0);
  const [xp, setXp] = useState(userProfile?.xp || 0);
  const [level, setLevel] = useState(userProfile?.level || 1);
  const [streak, setStreak] = useState(userProfile?.streak || 0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [sessionTime, setSessionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState('neutral');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [aiTip, setAiTip] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [taskQueue, setTaskQueue] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [task, setTask] = useState(propTask);
  const [userId, setUserId] = useState(propUserId);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showCompletionOnboarding, setShowCompletionOnboarding] = useState(false);
  const [completionOnboardingStep, setCompletionOnboardingStep] = useState(0);
  const [statsExpanded, setStatsExpanded] = useState(false);

  // Post-rejection & panic features
  const [showPanicMode, setShowPanicMode] = useState(false);
  const [showPostMortem, setShowPostMortem] = useState(false);
  const [postMortemPhase, setPostMortemPhase] = useState(1); // 1 = quick comfort, 2 = deep dive
  const [interactionOutcome, setInteractionOutcome] = useState(null);
  const [postMortemData, setPostMortemData] = useState({
    awkwardnessRating: 5,
    theirReaction: '',
    yourBody: '',
    recording: ''
  });
  const [rejectionCount, setRejectionCount] = useState(0);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [showPatternAnalysis, setShowPatternAnalysis] = useState(false);
  const [expectedRejections, setExpectedRejections] = useState(20);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const currentTask = task;

  const upcomingTasks = [
    { id: 2, title: "Share an Opinion in a Group Chat", difficulty: "Easy", xp: 100, locked: false },
    { id: 3, title: "Invite Someone to Lunch", difficulty: "Hard", xp: 250, locked: false },
    { id: 4, title: "Lead a Small Team Discussion", difficulty: "Boss Battle", xp: 500, locked: true }
  ];

  const dailyChallenges = [
    { id: 1, title: "Say hi to 3 different people", progress: 2, total: 3, xp: 75 },
    { id: 2, title: "Make eye contact 10 times", progress: 7, total: 10, xp: 50 },
    { id: 3, title: "Share one interesting thing", progress: 0, total: 1, xp: 100 }
  ];

  const liveStats = {
    successRate: 87,
    avgCompletion: 78,
    momentum: "High",
    bestTime: "10:00 AM - 11:00 AM",
    communityActive: 234
  };

  const onboardingSteps = [
    {
      title: "Welcome to Live Action Support! 🎮",
      description: "I'm your AI coach here to guide you through real-time social challenges. Let me show you around!",
      highlight: null
    },
    {
      title: "Track Your Progress",
      description: "Watch your XP, streak, and combo multiplier grow as you complete steps. The better you do, the more rewards you earn!",
      highlight: "stats"
    },
    {
      title: "Follow Step-by-Step Guidance",
      description: "Each task is broken into manageable steps with personalized tips, examples, and AI coaching tailored just for you.",
      highlight: "main"
    },
    {
      title: "Use the Timer — Right at the Top",
      description: "Hit play when you're ready to attempt a step. The timer tracks your session and builds momentum. It's right below your task title so you can't miss it!",
      highlight: "timer"
    },
    {
      title: "Complete & Reflect",
      description: "Mark steps complete to earn XP and boost your combo. After finishing, reflect on what you learned to maximize growth!",
      highlight: "buttons"
    },
    {
      title: "You're Ready! 🚀",
      description: "Time to start your first challenge. Remember: progress over perfection. You've got this!",
      highlight: null
    }
  ];

  const completionOnboardingSteps = [
    {
      title: "Congratulations! 🎉",
      description: "You just completed your first social challenge! This is huge - you're already building real confidence.",
      icon: "🏆"
    },
    {
      title: "Your XP & Progress",
      description: "You earned XP that levels you up! Higher levels unlock harder challenges and bigger rewards. Check your stats at the top.",
      icon: "⚡"
    },
    {
      title: "Maintain Your Streak",
      description: "Complete at least one task daily to build your streak. Streaks multiply your XP and show your consistency!",
      icon: "🔥"
    },
    {
      title: "Reflection Matters",
      description: "Taking time to reflect helps cement what you learned. It's the secret to real growth - not just points.",
      icon: "💭"
    },
    {
      title: "Daily Challenges",
      description: "Check the sidebar for quick daily challenges. They're small wins that keep momentum going between big tasks!",
      icon: "🎯"
    },
    {
      title: "Ready to Level Up? 🚀",
      description: "You've got the basics down. Now let's start with your first real lesson and build those skills!",
      icon: "📚"
    }
  ];

  useEffect(() => {
    const loadRejectionData = async () => {
      try {
        const rejectionKey = `rejection-history:${userId}`;
        const result = await window.storage.get(rejectionKey);
        if (result) {
          const data = JSON.parse(result.value);
          setRejectionCount(data.count || 0);
          setAttemptHistory(data.history || []);
        }
      } catch (error) {
        console.log('No rejection history found');
      }
    };
    if (userId) loadRejectionData();
  }, [userId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskParam = urlParams.get('task');

    if (taskParam && !propTask) {
      try {
        const parsedTask = JSON.parse(decodeURIComponent(taskParam));
        setTask(parsedTask);
      } catch (error) {
        console.error('Failed to parse task:', error);
      }
    }

    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
      else setUserId(undefined);
    });

    return () => unsubscribe();
  }, [propTask, propUserId]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progressKey = `task-progress:${userId}:${task.id}`;
        const result = await window.storage.get(progressKey);
        if (result) {
          const data = JSON.parse(result.value);
          setCurrentStep(data.currentStep || 0);
          setCompletedSteps(data.completedSteps || []);
          setSessionTime(data.sessionTime || 0);
          setComboMultiplier(data.comboMultiplier || 1);
          setReflection(data.reflection || '');
        }
      } catch (error) {
        console.log('No previous progress found, starting fresh');
      }
    };
    if (userId && task?.id) loadProgress();
  }, [userId, task?.id]);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        const progressKey = `task-progress:${userId}:${task.id}`;
        const progressData = {
          currentStep,
          completedSteps,
          sessionTime,
          comboMultiplier,
          reflection,
          lastUpdated: new Date().toISOString()
        };
        await window.storage.set(progressKey, JSON.stringify(progressData));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    };
    if (userId && task?.id) saveProgress();
  }, [currentStep, completedSteps, sessionTime, comboMultiplier, reflection, userId, task?.id]);

  useEffect(() => {
    const tips = [
      "Your confidence increases by 23% when you practice in the morning!",
      "You're in your peak performance zone right now - great timing!",
      "Remember: 89% of people appreciate being approached kindly.",
      "Your body language improves after taking 3 deep breaths.",
      "You've completed similar tasks 12 times - you know this!"
    ];
    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  }, [currentStep]);

  useEffect(() => {
    const checkFirstTime = async () => {
      if (userId && task?.id) {
        try {
          const onboardingKey = `onboarding-completed:${userId}`;
          await window.storage.get(onboardingKey);
          setShowOnboarding(false);
        } catch (error) {
          setShowOnboarding(true);
        }
      }
    };
    checkFirstTime();
  }, [userId, task?.id]);

  useEffect(() => {
    const checkCompletionOnboarding = async () => {
      if (userId && task?.id && currentStep >= task.steps.length) {
        try {
          const completionOnboardingKey = `completion-onboarding:${userId}`;
          await window.storage.get(completionOnboardingKey);
          setShowCompletionOnboarding(false);
        } catch (error) {
          setShowCompletionOnboarding(true);
        }
      }
    };
    checkCompletionOnboarding();
  }, [userId, task?.id, currentStep]);

  const completeOnboarding = async () => {
    try {
      const onboardingKey = `onboarding-completed:${userId}`;
      await window.storage.set(onboardingKey, JSON.stringify({
        completedAt: new Date().toISOString(),
        version: 1
      }));
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      setShowOnboarding(false);
    }
  };

  const completeCompletionOnboarding = async () => {
    try {
      const completionOnboardingKey = `completion-onboarding:${userId}`;
      await window.storage.set(completionOnboardingKey, JSON.stringify({
        completedAt: new Date().toISOString()
      }));
      setShowCompletionOnboarding(false);
    } catch (error) {
      console.error('Failed to save completion onboarding:', error);
      setShowCompletionOnboarding(false);
    }
  };

  const handleAttemptComplete = (wasSuccessful) => {
    if (!wasSuccessful) {
      setPostMortemPhase(1);
      setShowPostMortem(true);
      setInteractionOutcome('rejected');
    } else {
      setInteractionOutcome('success');
      completeStep();
    }
  };

  const saveAttemptToHistory = async (outcome) => {
    const attempt = {
      timestamp: new Date().toISOString(),
      taskId: task.id,
      stepId: currentStep,
      outcome,
      ...postMortemData
    };
    const newHistory = [...attemptHistory, attempt];
    const newCount = outcome === 'rejected' ? rejectionCount + 1 : rejectionCount;
    setAttemptHistory(newHistory);
    setRejectionCount(newCount);
    try {
      const rejectionKey = `rejection-history:${userId}`;
      await window.storage.set(rejectionKey, JSON.stringify({ count: newCount, history: newHistory }));
    } catch (error) {
      console.error('Failed to save rejection history:', error);
    }
  };

  const analyzePatterns = () => {
    if (attemptHistory.length < 3) return null;
    const recentFailures = attemptHistory.filter(a => a.outcome === 'rejected').slice(-5);
    return {
      avgAwkwardness: recentFailures.reduce((sum, a) => sum + a.awkwardnessRating, 0) / recentFailures.length,
      commonReactions: [...new Set(recentFailures.map(a => a.theirReaction))],
      commonBodyIssues: [...new Set(recentFailures.map(a => a.yourBody))]
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completeStep = async () => {
    if (currentStep < currentTask.steps.length) {
      const step = currentTask.steps[currentStep];
      const earnedXP = Math.floor(step.xp * comboMultiplier);
      const newXP = xp + earnedXP;
      setXp(newXP);
      setCompletedSteps([...completedSteps, currentStep]);
      setComboMultiplier(prev => Math.min(prev + 0.2, 3));
      setShowReward(true);
      try {
        const userStatsKey = `user-stats:${userId}`;
        await window.storage.set(userStatsKey, JSON.stringify({
          xp: newXP, level, streak, lastActivity: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to save user stats:', error);
      }
      setTimeout(() => {
        setShowReward(false);
        setCurrentStep(prev => prev + 1);
      }, 2000);
      if (currentStep === currentTask.steps.length - 1) {
        setAchievements([...achievements, {
          title: "Task Master!",
          icon: "trophy",
          time: new Date().toLocaleTimeString()
        }]);
        try {
          const completionKey = `task-completed:${userId}:${task.id}`;
          await window.storage.set(completionKey, JSON.stringify({
            taskId: task.id,
            completedAt: new Date().toISOString(),
            xpEarned: currentTask.xpReward,
            reflection
          }));
        } catch (error) {
          console.error('Failed to save completion:', error);
        }
      }
    }
  };

  const skipStep = () => {
    setComboMultiplier(1);
    setCurrentStep(prev => Math.min(prev + 1, currentTask.steps.length));
    setShowSkipConfirm(false);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Boss Battle': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/50 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-purple-200">Please log in to access live action support.</p>
        </div>
      </div>
    );
  }

  if (!task || !task.steps) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading task...
      </div>
    );
  }

  const currentStepData = task.steps[currentStep];
  const progress = (currentStep / task.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ─── SLIM STATS HEADER (collapsed by default) ─── */}
        <div className="mb-4 md:mb-6">
          {/* Always-visible slim bar */}
          <div
            className="flex items-center justify-between bg-purple-900/40 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-500/20 cursor-pointer"
            onClick={() => setStatsExpanded(!statsExpanded)}
          >
            <div className="flex items-center gap-4 flex-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-white">{xp} XP</span>
                <span className="text-xs text-purple-400">Lv.{level}</span>
              </div>
              <div className="w-px h-4 bg-purple-600/50 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-white">{streak}d</span>
              </div>
              <div className="w-px h-4 bg-purple-600/50 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-bold text-white">{comboMultiplier.toFixed(1)}x</span>
                <span className="text-xs text-purple-400">combo</span>
              </div>
              <div className="w-px h-4 bg-purple-600/50 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">{liveStats.successRate}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <span className="text-xs text-purple-400 hidden sm:block">{statsExpanded ? 'Hide' : 'Details'}</span>
              {statsExpanded
                ? <ChevronUp className="w-4 h-4 text-purple-400" />
                : <ChevronDown className="w-4 h-4 text-purple-400" />}
            </div>
          </div>

          {/* Expanded stats (shown on click) */}
          {statsExpanded && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md rounded-2xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-purple-300">Level {level}</span>
                </div>
                <div className="text-xl font-bold text-white">{xp} XP</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md rounded-2xl p-4 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-purple-300">Streak</span>
                </div>
                <div className="text-xl font-bold text-white">{streak} days</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md rounded-2xl p-4 border border-pink-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-purple-300">Combo</span>
                </div>
                <div className="text-xl font-bold text-white">{comboMultiplier.toFixed(1)}x</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md rounded-2xl p-4 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-purple-300">Session</span>
                </div>
                <div className="text-xl font-bold text-white">{formatTime(sessionTime)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md rounded-2xl p-4 border border-green-500/20 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-purple-300">Success</span>
                </div>
                <div className="text-xl font-bold text-white">{liveStats.successRate}%</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* ─── MAIN TASK AREA ─── */}
          <div className="lg:col-span-2 space-y-4 md:space-y-5">

            {/* Task Header Card */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-5 md:p-7 border-2 border-purple-500/30 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-300">{currentTask.category}</span>
                    <span className={`text-sm font-semibold ${getDifficultyColor(currentTask.difficulty)}`}>
                      {currentTask.difficulty}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentTask.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-purple-200">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {currentTask.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" /> {currentTask.xpReward} XP
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 transition-colors">
                    <Volume2 className="w-5 h-5 text-purple-300" />
                  </button>
                  <button className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 transition-colors">
                    <Camera className="w-5 h-5 text-purple-300" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-purple-200">
                  <span>Step {currentStep + 1} of {currentTask.totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* ─── TIMER — Directly below progress bar, prominent & high up ─── */}
              <div className="mt-5 flex items-center gap-3 bg-purple-950/40 rounded-2xl p-4 border border-purple-500/20">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-3 rounded-xl transition-all active:scale-90 flex items-center gap-2 font-semibold text-white ${
                    isTimerRunning
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span className="text-sm hidden sm:inline">{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <div className="text-2xl font-bold text-white font-mono flex-1">{formatTime(sessionTime)}</div>
                <div className="text-xs text-purple-400 flex-1 hidden md:block">
                  {isTimerRunning ? '⏱ Running — good luck!' : 'Hit Start when you\'re ready to try'}
                </div>
                <button
                  onClick={() => setSessionTime(0)}
                  className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 transition-all active:scale-90"
                  title="Reset timer"
                >
                  <RotateCcw className="w-5 h-5 text-purple-300" />
                </button>
              </div>
            </div>

            {/* AI Coaching Alert */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white mb-0.5">AI Coach</div>
                <p className="text-sm text-blue-100">{aiTip}</p>
              </div>
            </div>

            {/* Current Step Detail */}
            {currentStep < currentTask.steps.length && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-5 md:p-7 border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{currentStepData.title}</h2>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold text-white">+{Math.floor(currentStepData.xp * comboMultiplier)} XP</span>
                  </div>
                </div>

                <p className="text-purple-100 mb-5">{currentStepData.description}</p>

                {/* AI Personalized Coaching */}
                <div className="bg-purple-950/50 rounded-2xl p-4 mb-5 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-purple-200 mb-1">Personalized for You</div>
                      <p className="text-sm text-purple-100">{currentStepData.aiCoaching}</p>
                    </div>
                  </div>
                </div>

                {/* Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {currentStepData.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-purple-100 flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Examples
                    </h3>
                    <ul className="space-y-2">
                      {currentStepData.examples.map((example, i) => (
                        <li key={i} className="text-sm text-purple-100 flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ─── ACTION BUTTONS — Primary focus, no need to scroll ─── */}
                <div className="space-y-3">
                  {/* Primary success button — dominant */}
                  <button
                    onClick={() => handleAttemptComplete(true)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
                  >
                    <CheckCircle className="w-6 h-6" />
                    It Went Well ✓
                  </button>

                  {/* Secondary row — failure + skip, smaller */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttemptComplete(false)}
                      className="flex-1 py-3 rounded-xl bg-purple-800/40 hover:bg-purple-800/60 border border-orange-500/30 text-orange-300 font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      😬 It didn't go as planned
                    </button>
                    <button
                      onClick={() => setShowSkipConfirm(true)}
                      className="px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-sm font-medium transition-all active:scale-95 flex items-center gap-1"
                      title="Skip this step"
                    >
                      <SkipForward className="w-4 h-4" />
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Completion State */}
            {currentStep >= currentTask.steps.length && (
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-green-500/30 shadow-2xl text-center">
                <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Task Complete! 🎉</h2>
                <p className="text-green-100 mb-6">You earned {currentTask.xpReward} XP and strengthened your social skills!</p>
                <div className="bg-green-950/50 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Reflection</h3>
                  <textarea
                    value={reflection}
                    onChange={async (e) => {
                      const newReflection = e.target.value;
                      setReflection(newReflection);
                      try {
                        const reflectionKey = `reflection:${userId}:${task.id}`;
                        await window.storage.set(reflectionKey, newReflection);
                      } catch (error) {
                        console.error('Failed to save reflection:', error);
                      }
                    }}
                    placeholder="How did it go? What did you learn?"
                    className="w-full h-24 bg-green-950/50 border border-green-500/30 rounded-xl p-3 text-white placeholder-green-300/50 resize-none focus:outline-none focus:ring-2 focus:ring-green-400/20"
                  />
                </div>
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all active:scale-95">
                  Next Challenge
                </button>
              </div>
            )}

            {/* Mobile-only: Rejection tracker shown inline below main task */}
            <div className="lg:hidden bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md rounded-3xl p-5 border-2 border-orange-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Rejection Progress</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-white">{rejectionCount}/{expectedRejections}</div>
                <div className="flex-1">
                  <div className="h-2.5 bg-orange-950/50 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{ width: `${Math.min((rejectionCount / expectedRejections) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-orange-300">
                    {rejectionCount < expectedRejections
                      ? `${expectedRejections - rejectionCount} more to go — You're on track! 🎯`
                      : "You've hit your target! 💪"}
                  </p>
                </div>
              </div>
              {attemptHistory.length >= 3 && (
                <button
                  onClick={() => setShowPatternAnalysis(true)}
                  className="w-full mt-3 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 text-orange-200 text-sm font-semibold transition-all"
                >
                  📊 See What's Going Wrong
                </button>
              )}
            </div>
          </div>

          {/* ─── SIDEBAR ─── */}
          <div className="space-y-4 md:space-y-5">

            {/* Daily Challenges */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-5 border-2 border-yellow-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-bold text-white">Daily Challenges</h3>
              </div>
              <div className="space-y-3">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-purple-950/50 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-white">{challenge.title}</span>
                      <span className="text-xs text-yellow-400 font-semibold">+{challenge.xp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-purple-950/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-purple-300">{challenge.progress}/{challenge.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Progress Tracker — desktop sidebar only */}
            <div className="hidden lg:block bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md rounded-3xl p-5 border-2 border-orange-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Rejection Progress</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-white mb-1">{rejectionCount}/{expectedRejections}</div>
                <div className="text-sm text-orange-200">Expected rejections this month</div>
                <div className="text-xs text-orange-300 mt-1">
                  {rejectionCount < expectedRejections
                    ? `${expectedRejections - rejectionCount} more to go — You're on track! 🎯`
                    : "You've hit your target! 💪"}
                </div>
              </div>
              <div className="h-3 bg-orange-950/50 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min((rejectionCount / expectedRejections) * 100, 100)}%` }}
                />
              </div>
              {attemptHistory.length >= 3 && (
                <button
                  onClick={() => setShowPatternAnalysis(true)}
                  className="w-full py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 text-orange-200 text-sm font-semibold transition-all"
                >
                  📊 See What's Going Wrong
                </button>
              )}
            </div>

            {/* Live Analytics */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-5 border-2 border-blue-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Live Analytics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">Success Rate</span>
                  <span className="text-lg font-bold text-green-400">{liveStats.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">Momentum</span>
                  <span className="text-lg font-bold text-yellow-400">{liveStats.momentum}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">Best Time</span>
                  <span className="text-xs font-semibold text-purple-300">{liveStats.bestTime}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-200">{liveStats.communityActive} active now</span>
                </div>
              </div>
            </div>

            {/* Task Queue */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-5 border-2 border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Next Up</h3>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`bg-purple-950/50 rounded-xl p-3 ${t.locked ? 'opacity-50' : 'hover:bg-purple-950/70 cursor-pointer'} transition-all`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-white flex-1">{t.title}</span>
                      {t.locked && <Crown className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${getDifficultyColor(t.difficulty)}`}>{t.difficulty}</span>
                      <span className="text-xs text-purple-300">+{t.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            {achievements.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md rounded-3xl p-5 border-2 border-yellow-500/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-base font-bold text-white">Recent Wins</h3>
                </div>
                <div className="space-y-2">
                  {achievements.map((achievement, i) => (
                    <div key={i} className="bg-yellow-950/30 rounded-xl p-3 flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{achievement.title}</div>
                        <div className="text-xs text-yellow-200">{achievement.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reward Animation */}
        {showReward && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-2xl md:text-4xl font-bold px-8 py-4 rounded-2xl shadow-2xl animate-bounce">
              +{Math.floor(currentStepData.xp * comboMultiplier)} XP! 🎉
            </div>
          </div>
        )}
      </div>

      {/* ─── STICKY PANIC BUTTON (Floating Action Button) ─── */}
      {currentStep < (task?.steps?.length || 0) && (
        <button
          onClick={() => setShowPanicMode(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-500 hover:to-pink-600 text-white font-bold shadow-2xl shadow-red-900/50 border-2 border-red-400/50 transition-all active:scale-95 animate-pulse hover:animate-none"
          title="Emergency help"
        >
          <span className="text-xl">🆘</span>
          <span className="hidden sm:inline text-sm">I Need Help</span>
        </button>
      )}

      {/* ─── SKIP CONFIRM POPOVER ─── */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-7 max-w-sm w-full border-2 border-purple-500/40 shadow-2xl text-center">
            <div className="text-5xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-white mb-2">Skip this step?</h3>
            <p className="text-purple-200 text-sm mb-6">Trying (even if it goes badly) builds more confidence than skipping. But it's your call.</p>
            <div className="space-y-2">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
              >
                I'll give it a try
              </button>
              <button
                onClick={skipStep}
                className="w-full py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-sm font-medium transition-all"
              >
                Skip anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ONBOARDING OVERLAY ─── */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-purple-500/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {['👋', '📊', '📝', '⏱️', '✅', '🎉'][onboardingStep]}
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{onboardingSteps[onboardingStep].title}</h2>
              <p className="text-lg text-purple-200 leading-relaxed">{onboardingSteps[onboardingStep].description}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              {onboardingSteps.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all ${idx === onboardingStep ? 'w-8 bg-purple-400' : 'w-2 bg-purple-700'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              {onboardingStep > 0 && (
                <button onClick={() => setOnboardingStep(prev => prev - 1)} className="px-6 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-white font-semibold transition-all">
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (onboardingStep < onboardingSteps.length - 1) setOnboardingStep(prev => prev + 1);
                  else completeOnboarding();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
              >
                {onboardingStep < onboardingSteps.length - 1 ? 'Next' : 'Start My Journey!'}
              </button>
              {onboardingStep < onboardingSteps.length - 1 && (
                <button onClick={completeOnboarding} className="px-6 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-semibold transition-all">
                  Skip
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPLETION ONBOARDING ─── */}
      {showCompletionOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-green-500/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{completionOnboardingSteps[completionOnboardingStep].icon}</div>
              <h2 className="text-3xl font-bold text-white mb-3">{completionOnboardingSteps[completionOnboardingStep].title}</h2>
              <p className="text-lg text-green-200 leading-relaxed">{completionOnboardingSteps[completionOnboardingStep].description}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              {completionOnboardingSteps.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all ${idx === completionOnboardingStep ? 'w-8 bg-green-400' : 'w-2 bg-green-700'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              {completionOnboardingStep > 0 && (
                <button onClick={() => setCompletionOnboardingStep(prev => prev - 1)} className="px-6 py-3 rounded-xl bg-green-600/20 hover:bg-green-600/40 text-white font-semibold transition-all">
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (completionOnboardingStep < completionOnboardingSteps.length - 1) setCompletionOnboardingStep(prev => prev + 1);
                  else { completeCompletionOnboarding(); window.location.href = '/products'; }
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all"
              >
                {completionOnboardingStep < completionOnboardingSteps.length - 1 ? 'Next' : 'Go to Community!'}
              </button>
              <button onClick={completeCompletionOnboarding} className="px-6 py-3 rounded-xl bg-green-600/20 hover:bg-green-600/40 text-green-300 font-semibold transition-all">
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PANIC MODE MODAL ─── */}
      {showPanicMode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-900 to-pink-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-red-500/50 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">You're Okay. Breathe. 🫂</h2>
            <p className="text-lg text-red-100 mb-6 text-center">It's completely normal to feel anxious. Here's what to do RIGHT NOW:</p>
            <div className="space-y-4 mb-6">
              <div className="bg-red-950/50 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2">🚪 Exit Strategy</h3>
                <p className="text-red-100 text-sm">"Sorry, I need to take a call" or "I just remembered something" — then WALK AWAY. It's okay to abort.</p>
              </div>
              <div className="bg-red-950/50 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2">🫁 Breathing (Do this now)</h3>
                <p className="text-red-100 text-sm">4 seconds in. Hold 4 seconds. 6 seconds out. Repeat 3 times.</p>
              </div>
              <div className="bg-red-950/50 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2">💭 Reality Check</h3>
                <p className="text-red-100 text-sm">This feeling will pass. You're not in danger. You're building courage just by trying.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPanicMode(false)}
                className="flex-1 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-white font-semibold transition-all"
              >
                I'm Better Now
              </button>
              <button
                onClick={() => { setShowPanicMode(false); skipStep(); }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold transition-all"
              >
                Abort Mission — Skip This
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── POST-MORTEM MODAL (2-Phase) ─── */}
      {showPostMortem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-purple-500/50 shadow-2xl my-8">

            {/* Phase 1: Quick comfort screen */}
            {postMortemPhase === 1 && (
              <div className="text-center">
                <div className="text-6xl mb-5">💙</div>
                <h2 className="text-3xl font-bold text-white mb-3">You tried. That's what matters.</h2>
                <p className="text-purple-200 text-lg mb-6 leading-relaxed">
                  Not everything goes perfectly — and that's okay. Every attempt, even rejected ones, builds real confidence over time.
                </p>
                <div className="bg-purple-950/50 rounded-2xl p-5 mb-6 text-left">
                  <p className="text-sm font-semibold text-purple-300 mb-2">Quick check-in:</p>
                  <p className="text-white font-medium mb-3">How are you feeling right now?</p>
                  <div className="flex flex-wrap gap-2">
                    {['😤 Frustrated', '😔 Embarrassed', '😐 Okay actually', '😅 Kinda relieved', '💪 Ready to retry'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPostMortemData({ ...postMortemData, recording: opt })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${postMortemData.recording === opt ? 'bg-purple-500/40 border-purple-400 text-white' : 'bg-purple-950/50 border-purple-700/30 text-purple-300 hover:border-purple-500/50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      saveAttemptToHistory('rejected');
                      setShowPostMortem(false);
                      setPostMortemData({ awkwardnessRating: 5, theirReaction: '', yourBody: '', recording: '' });
                    }}
                    className="flex-1 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 font-semibold transition-all"
                  >
                    I'm good, continue
                  </button>
                  <button
                    onClick={() => setPostMortemPhase(2)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
                  >
                    Tell me what to improve →
                  </button>
                </div>
              </div>
            )}

            {/* Phase 2: Deep dive analysis */}
            {postMortemPhase === 2 && (
              <>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Let's Figure Out What Happened 🔍</h2>
                <p className="text-purple-200 mb-6 text-center text-sm">Not about blame — it's about collecting data to improve.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-white font-semibold mb-3">How awkward was it? (1-10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={postMortemData.awkwardnessRating}
                      onChange={(e) => setPostMortemData({ ...postMortemData, awkwardnessRating: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-purple-300 mt-1">
                      <span>Not awkward</span>
                      <span className="text-2xl font-bold text-white">{postMortemData.awkwardnessRating}</span>
                      <span>Very awkward</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">What did THEIR face/body do?</label>
                    <select
                      value={postMortemData.theirReaction}
                      onChange={(e) => setPostMortemData({ ...postMortemData, theirReaction: e.target.value })}
                      className="w-full bg-purple-950/50 border border-purple-500/30 rounded-xl p-3 text-white"
                    >
                      <option value="">Select reaction...</option>
                      <option value="smiled">Smiled / seemed friendly</option>
                      <option value="neutral">Neutral / no strong reaction</option>
                      <option value="looked-away">Looked away / avoided eye contact</option>
                      <option value="short-answers">Gave very short answers</option>
                      <option value="seemed-uncomfortable">Seemed uncomfortable</option>
                      <option value="walked-away">Walked away / ended conversation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">What did YOUR body do?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Made eye contact', 'Looked at ground', 'Fidgeted', 'Spoke too quietly', 'Spoke too fast', 'Said "um" a lot', 'Crossed arms'].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-purple-200 text-sm bg-purple-950/40 rounded-xl px-3 py-2 cursor-pointer">
                          <input
                            type="checkbox" className="rounded"
                            onChange={(e) => {
                              const current = postMortemData.yourBody.split(',').filter(Boolean);
                              if (e.target.checked) setPostMortemData({ ...postMortemData, yourBody: [...current, option].join(',') });
                              else setPostMortemData({ ...postMortemData, yourBody: current.filter(i => i !== option).join(',') });
                            }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 bg-purple-950/50 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-2 text-sm">💭 Alternative Explanations (NOT your fault):</h3>
                  <ul className="text-sm text-purple-200 space-y-1">
                    <li>• They were distracted / having a bad day</li>
                    <li>• Bad timing — they were busy</li>
                    <li>• They're also shy and don't know how to respond</li>
                    <li>• This is ONE data point, not proof you're broken</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    saveAttemptToHistory('rejected');
                    setShowPostMortem(false);
                    setPostMortemPhase(1);
                    setPostMortemData({ awkwardnessRating: 5, theirReaction: '', yourBody: '', recording: '' });
                  }}
                  className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
                >
                  Save & Continue
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── PATTERN ANALYSIS MODAL ─── */}
      {showPatternAnalysis && attemptHistory.length >= 3 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-indigo-500/50 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">📊 Here's What I'm Seeing</h2>
            {(() => {
              const patterns = analyzePatterns();
              if (!patterns) return null;
              return (
                <div className="space-y-4">
                  <div className="bg-indigo-950/50 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">Your Average Awkwardness: {patterns.avgAwkwardness.toFixed(1)}/10</h3>
                    {patterns.avgAwkwardness > 7 && (
                      <p className="text-indigo-200 text-sm">You're rating things as very awkward. Remember: You're your harshest critic.</p>
                    )}
                  </div>
                  {patterns.commonReactions.length > 0 && (
                    <div className="bg-indigo-950/50 rounded-xl p-4">
                      <h3 className="font-bold text-white mb-2">What people usually do:</h3>
                      <ul className="text-indigo-200 text-sm space-y-1">
                        {patterns.commonReactions.map((r, i) => <li key={i}>• {r}</li>)}
                      </ul>
                    </div>
                  )}
                  {patterns.commonBodyIssues.length > 0 && (
                    <div className="bg-indigo-950/50 rounded-xl p-4">
                      <h3 className="font-bold text-white mb-2">🎯 Pattern Found — You often:</h3>
                      <ul className="text-indigo-200 text-sm space-y-1">
                        {patterns.commonBodyIssues.filter(Boolean).map((issue, i) => <li key={i}>• {issue}</li>)}
                      </ul>
                      <p className="text-yellow-300 text-sm mt-3 font-semibold">👆 THIS is what to work on next!</p>
                    </div>
                  )}
                  <div className="bg-green-950/30 rounded-xl p-4 border border-green-500/30">
                    <h3 className="font-bold text-white mb-2">✅ Progress Check:</h3>
                    <p className="text-green-200 text-sm">You've tried {attemptHistory.length} times. Most people quit after 2–3 attempts. You're already in the top 20% just by keeping going.</p>
                  </div>
                </div>
              );
            })()}
            <button
              onClick={() => setShowPatternAnalysis(false)}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all"
            >
              Got It — Let's Keep Going
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTaskHub;