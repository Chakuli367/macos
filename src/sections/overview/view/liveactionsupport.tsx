import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flame, Trophy, Target, Clock, Zap, Brain, MessageSquare, CheckCircle, Star, TrendingUp, Award, Users, Lightbulb, BarChart3, Heart, Volume2, Camera, Play, Pause, RotateCcw, ChevronRight, Sparkles, Gift, Crown } from 'lucide-react';



const EnhancedTaskHub = ({ task, userId, userProfile }) => {
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

  // After imports
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
  
  if (userId && task?.id) {
    loadProgress();
  }
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
  
  if (userId && task?.id) {
    saveProgress();
  }
}, [currentStep, completedSteps, sessionTime, comboMultiplier, reflection, userId, task?.id]);

  useEffect(() => {
    // Simulate AI tip generation
    const tips = [
      "Your confidence increases by 23% when you practice in the morning!",
      "You're in your peak performance zone right now - great timing!",
      "Remember: 89% of people appreciate being approached kindly.",
      "Your body language improves after taking 3 deep breaths.",
      "You've completed similar tasks 12 times - you know this!"
    ];
    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  }, [currentStep]);

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
    
    // Save user stats
    try {
      const userStatsKey = `user-stats:${userId}`;
      const stats = {
        xp: newXP,
        level,
        streak,
        lastActivity: new Date().toISOString()
      };
      await window.storage.set(userStatsKey, JSON.stringify(stats));
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
      
      // Save task completion
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
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Boss Battle': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const currentStepData = currentTask.steps[currentStep] || currentTask.steps[currentTask.steps.length - 1];
  const progress = ((currentStep) / currentTask.steps.length) * 100;

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

  // Loading check
  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        
        
        {/* Header Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 border-2 border-purple-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xs md:text-sm text-purple-300">Level {level}</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{xp} XP</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 border-2 border-orange-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs md:text-sm text-purple-300">Streak</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{streak} days</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 border-2 border-pink-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-pink-400" />
              <span className="text-xs md:text-sm text-purple-300">Combo</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{comboMultiplier.toFixed(1)}x</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-xs md:text-sm text-purple-300">Session</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{formatTime(sessionTime)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 border-2 border-green-500/30 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs md:text-sm text-purple-300">Success</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{liveStats.successRate}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Task Area */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            
            {/* Current Task Header */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-purple-500/30 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-6 h-6 text-purple-400" />
                    <span className="text-sm text-purple-300">{currentTask.category}</span>
                    <span className={`text-sm font-semibold ${getDifficultyColor(currentTask.difficulty)}`}>
                      {currentTask.difficulty}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentTask.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-purple-200">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentTask.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {currentTask.xpReward} XP
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
            </div>

            {/* AI Coaching Alert */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-blue-500/30">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-white mb-1">AI Coach Insight</div>
                  <p className="text-sm text-blue-100">{aiTip}</p>
                </div>
              </div>
            </div>

            {/* Current Step Detail */}
            {currentStep < currentTask.steps.length && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {currentStepData.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold text-white">+{Math.floor(currentStepData.xp * comboMultiplier)} XP</span>
                  </div>
                </div>

                <p className="text-purple-100 mb-6">{currentStepData.description}</p>

                {/* AI Personalized Coaching */}
                <div className="bg-purple-950/50 rounded-2xl p-4 mb-6 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
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
                      <Target className="w-4 h-4" />
                      Pro Tips
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
                      <MessageSquare className="w-4 h-4" />
                      Examples
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

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-purple-950/30 rounded-xl">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all active:scale-90"
                  >
                    {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <div className="text-3xl font-bold text-white">{formatTime(sessionTime)}</div>
                  <button
                    onClick={() => setSessionTime(0)}
                    className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 transition-all active:scale-90"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={completeStep}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Step
                  </button>
                  <button
                    onClick={skipStep}
                    className="px-6 py-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 font-semibold transition-all active:scale-95"
                  >
                    Skip
                  </button>
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
    
    // Auto-save reflection
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
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            
            {/* Daily Challenges */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-6 border-2 border-yellow-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Daily Challenges</h3>
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

            {/* Live Stats */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-6 border-2 border-blue-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Live Analytics</h3>
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
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-6 border-2 border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Next Up</h3>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`bg-purple-950/50 rounded-xl p-3 ${task.locked ? 'opacity-50' : 'hover:bg-purple-950/70 cursor-pointer'} transition-all`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-white flex-1">{task.title}</span>
                      {task.locked && <Crown className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <span className="text-xs text-purple-300">+{task.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            {achievements.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md rounded-3xl p-6 border-2 border-yellow-500/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Recent Wins</h3>
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
    </div>
  );
};

export default EnhancedTaskHub;