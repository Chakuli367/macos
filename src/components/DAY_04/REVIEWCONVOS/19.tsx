import React, { useState, useEffect, useMemo } from 'react';
import { MessageCircle, Clock, Users, TrendingUp, CheckCircle, Sparkles, ArrowRight, Plus, Trash2, Star, Zap, Target, Award, ChevronRight, Edit3, Save, X, MapPin, Flame, Trophy, BarChart3, Calendar, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

const REFLECTDAY3 = ({ onNext }) => {
  const [interactions, setInteractions] = useState([]);
  const [currentStep, setCurrentStep] = useState('overview'); // overview, add, reflect, complete
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [reflectionStep, setReflectionStep] = useState(0);
  const [notification, setNotification] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [todayXP, setTodayXP] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    location: '',
    person: '',
    duration: 15,
    engagement: 3,
    opening: null,
    flow: null,
    cues: null,
    exit: null,
    takeaway1: '',
    takeaway2: ''
  });

  const REFLECTION_QUESTIONS = [
    {
      id: 'opening',
      question: 'Did I open confidently?',
      icon: Sparkles,
      color: 'purple',
      options: [
        { value: 'excellent', label: 'Very Confident', icon: '💎', color: 'purple' },
        { value: 'good', label: 'Moderately', icon: '🔥', color: 'orange' },
        { value: 'needs_work', label: 'Needs Work', icon: '🌱', color: 'green' }
      ]
    },
    {
      id: 'flow',
      question: 'Did I maintain flow?',
      icon: TrendingUp,
      color: 'blue',
      options: [
        { value: 'excellent', label: 'Smooth Flow', icon: '💎', color: 'purple' },
        { value: 'good', label: 'Some Pauses', icon: '🔥', color: 'orange' },
        { value: 'needs_work', label: 'Struggled', icon: '🌱', color: 'green' }
      ]
    },
    {
      id: 'cues',
      question: 'Did I notice engagement cues?',
      icon: Target,
      color: 'pink',
      options: [
        { value: 'excellent', label: 'Very Aware', icon: '💎', color: 'purple' },
        { value: 'good', label: 'Somewhat', icon: '🔥', color: 'orange' },
        { value: 'needs_work', label: 'Missed Cues', icon: '🌱', color: 'green' }
      ]
    },
    {
      id: 'exit',
      question: 'Did I exit gracefully?',
      icon: CheckCircle,
      color: 'emerald',
      options: [
        { value: 'excellent', label: 'Smooth Exit', icon: '💎', color: 'purple' },
        { value: 'good', label: 'Okay Exit', icon: '🔥', color: 'orange' },
        { value: 'needs_work', label: 'Awkward', icon: '🌱', color: 'green' }
      ]
    }
  ];

  const stats = useMemo(() => {
    const completed = interactions.filter(i => i.reflected).length;
    const totalEngagement = interactions.reduce((sum, i) => sum + i.engagement, 0);
    const avgEngagement = interactions.length > 0 ? Math.round((totalEngagement / interactions.length / 5) * 100) : 0;
    
    return {
      total: interactions.length,
      completed,
      avgEngagement,
      xpEarned: todayXP
    };
  }, [interactions, todayXP]);

  const showNotification = (message, xp = 0) => {
    if (xp > 0) {
      setTodayXP(prev => prev + xp);
    }
    setNotification({ message, xp });
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const addInteraction = () => {
    const newInteraction = {
      id: Date.now().toString(),
      location: formData.location,
      person: formData.person,
      duration: formData.duration,
      engagement: formData.engagement,
      timestamp: Date.now(),
      reflected: false
    };
    
    setInteractions([...interactions, newInteraction]);
    showNotification('Interaction logged! +10 XP', 10);
    
    setFormData({
      location: '',
      person: '',
      duration: 15,
      engagement: 3,
      opening: null,
      flow: null,
      cues: null,
      exit: null,
      takeaway1: '',
      takeaway2: ''
    });
    
    setCurrentStep('overview');
  };

  const startReflection = (interaction) => {
    setSelectedInteraction(interaction);
    setReflectionStep(0);
    setCurrentStep('reflect');
  };

  const answerQuestion = (questionId, value) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const nextReflectionStep = () => {
    if (reflectionStep < REFLECTION_QUESTIONS.length) {
      setReflectionStep(prev => prev + 1);
    }
  };

  const completeReflection = () => {
    const updatedInteractions = interactions.map(i => 
      i.id === selectedInteraction.id 
        ? { 
            ...i, 
            reflected: true,
            reflection: {
              opening: formData.opening,
              flow: formData.flow,
              cues: formData.cues,
              exit: formData.exit,
              takeaways: [formData.takeaway1, formData.takeaway2].filter(t => t.trim())
            }
          }
        : i
    );
    
    setInteractions(updatedInteractions);
    
    const baseXP = 50;
    const qualityBonus = (formData.takeaway1 && formData.takeaway2) ? 15 : 0;
    const totalXP = baseXP + qualityBonus;
    
    showNotification(`Reflection complete! +${totalXP} XP 🎉`, totalXP);
    triggerConfetti();
    
    setFormData({
      location: '',
      person: '',
      duration: 15,
      engagement: 3,
      opening: null,
      flow: null,
      cues: null,
      exit: null,
      takeaway1: '',
      takeaway2: ''
    });
    
    setCurrentStep('overview');
    setSelectedInteraction(null);
    setReflectionStep(0);
  };

  const deleteInteraction = (id) => {
    setInteractions(interactions.filter(i => i.id !== id));
    showNotification('Interaction deleted');
  };

  const completeAndExit = () => {
    if (stats.completed === stats.total && stats.total > 0) {
      triggerConfetti();
      showNotification('All reflections complete! +25 XP Bonus', 25);
    }
    onNext();
  };

  // OVERVIEW SCREEN
  if (currentStep === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER */}
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
              <span className="text-xs md:text-sm font-medium text-purple-200">Day 3 Reflection</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Review Your Conversations
            </h1>
            
            <p className="text-base md:text-lg text-purple-200">
              Analyze each interaction to identify patterns and improve your social skills.
            </p>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-xs md:text-sm font-medium">Logged</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-pink-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-purple-300 text-xs md:text-sm font-medium">Reflected</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.completed}</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-indigo-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-purple-300 text-xs md:text-sm font-medium">Quality</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.avgEngagement}%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-800/60 to-indigo-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-purple-300 text-xs md:text-sm font-medium">XP Earned</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.xpEarned}</p>
            </div>
          </div>

          {/* ADD INTERACTION BUTTON */}
          <button
            onClick={() => setCurrentStep('add')}
            className="w-full mb-6 md:mb-8 p-5 md:p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg transition-all shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Log New Interaction (+10 XP)
          </button>

          {/* INTERACTIONS LIST */}
          <div className="space-y-4">
            {interactions.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-purple-500/30 text-center">
                <MessageCircle className="w-16 h-16 md:w-20 md:h-20 text-purple-500/50 mx-auto mb-4" />
                <p className="text-purple-300 text-base md:text-lg mb-2 font-medium">No interactions logged yet</p>
                <p className="text-purple-400 text-sm md:text-base">Click above to log your first conversation!</p>
              </div>
            ) : (
              interactions.map(interaction => (
                <div
                  key={interaction.id}
                  className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-white">{interaction.person}</h3>
                          <div className="flex items-center gap-2 text-sm text-purple-300">
                            <MapPin className="w-4 h-4" />
                            <span>{interaction.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-purple-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{interaction.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= interaction.engagement
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-purple-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {interaction.reflected && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-xl w-fit">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-300 font-medium">Reflection Complete</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!interaction.reflected && (
                        <button
                          onClick={() => startReflection(interaction)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Reflect
                        </button>
                      )}
                      <button
                        onClick={() => deleteInteraction(interaction.id)}
                        className="p-2 hover:bg-red-900/50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {interaction.reflected && interaction.reflection && (
                    <div className="mt-4 pt-4 border-t-2 border-purple-700/30 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(interaction.reflection).filter(([key]) => key !== 'takeaways').map(([key, value]) => (
                          <div key={key} className="px-3 py-2 bg-purple-950/50 rounded-xl border border-purple-700/30">
                            <p className="text-xs text-purple-400 capitalize mb-1">{key}</p>
                            <p className="text-sm font-semibold text-white capitalize">{value?.replace('_', ' ')}</p>
                          </div>
                        ))}
                      </div>
                      {interaction.reflection.takeaways?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-purple-300 font-semibold">Key Takeaways:</p>
                          {interaction.reflection.takeaways.map((takeaway, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-purple-200">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* COMPLETE BUTTON */}
          {interactions.length > 0 && (
            <button
              onClick={completeAndExit}
              className="w-full mt-8 p-5 md:p-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg transition-all shadow-2xl hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
            >
              <CheckCircle className="w-6 h-6" />
              {stats.completed === stats.total ? 'Complete Day 3 Review!' : 'Save & Continue'}
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* NOTIFICATIONS */}
        {notification && (
          <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 md:px-6 py-4 rounded-2xl shadow-2xl animate-slide-up border-2 border-purple-400/50 backdrop-blur-sm z-50">
            <p className="font-bold text-center">
              {notification.message}
              {notification.xp > 0 && <span className="ml-2">+{notification.xp} XP</span>}
            </p>
          </div>
        )}

        {/* CONFETTI */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-8xl md:text-9xl animate-bounce">🎉</div>
          </div>
        )}

        <style>{`
          @keyframes slide-up {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up { animation: slide-up 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  // ADD INTERACTION SCREEN
  if (currentStep === 'add') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentStep('overview')}
            className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Cancel</span>
          </button>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Log Interaction</h2>
                <p className="text-sm text-purple-300">Capture the details of your conversation</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Coffee Shop, Office, Gym"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Person</label>
                <input
                  type="text"
                  value={formData.person}
                  onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                  placeholder="e.g., Sarah (colleague), Mike (friend)"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Duration (minutes)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, duration: Math.max(5, formData.duration - 5) })}
                    className="p-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-center text-white text-xl font-bold">
                    {formData.duration}
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, duration: formData.duration + 5 })}
                    className="p-3 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Engagement Level</label>
                <div className="flex items-center justify-center gap-2 p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFormData({ ...formData, engagement: star })}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-8 h-8 md:w-10 md:h-10 ${
                          star <= formData.engagement
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-purple-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addInteraction}
                disabled={!formData.location || !formData.person}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
              >
                <Save className="w-6 h-6" />
                Save Interaction (+10 XP)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REFLECTION SCREEN
  if (currentStep === 'reflect') {
    const currentQuestion = REFLECTION_QUESTIONS[reflectionStep];
    const progress = ((reflectionStep + 1) / (REFLECTION_QUESTIONS.length + 1)) * 100;

    if (reflectionStep < REFLECTION_QUESTIONS.length) {
      const QuestionIcon = currentQuestion.icon;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <button
              onClick={() => {
                setCurrentStep('overview');
                setReflectionStep(0);
                setSelectedInteraction(null);
              }}
              className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="font-medium">Cancel Reflection</span>
            </button>

            {/* PROGRESS BAR */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-purple-300 font-medium">Question {reflectionStep + 1} of {REFLECTION_QUESTIONS.length}</p>
                <p className="text-sm text-purple-300 font-medium">{Math.round(progress)}%</p>
              </div>
              <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <QuestionIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">{currentQuestion.question}</h2>
                <p className="text-purple-300">Reflecting on: <span className="font-semibold text-white">{selectedInteraction.person}</span></p>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      answerQuestion(currentQuestion.id, option.value);
                      setTimeout(nextReflectionStep, 300);
                    }}
                    className="w-full p-6 bg-gradient-to-br from-purple-800/40 to-indigo-800/40 hover:from-purple-700/60 hover:to-indigo-700/60 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-left shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-4"
                  >
                    <span className="text-5xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-white mb-1">{option.label}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // TAKEAWAYS SCREEN
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <button
              onClick={() => {
                setCurrentStep('overview');
                setReflectionStep(0);
                setSelectedInteraction(null);
              }}
              className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="font-medium">Cancel</span>
            </button>

            {/* PROGRESS BAR */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-purple-300 font-medium">Final Step: Key Takeaways</p>
                <p className="text-sm text-purple-300 font-medium">100%</p>
              </div>
              <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Key Takeaways</h2>
                <p className="text-purple-300">What did you learn from this interaction?</p>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Takeaway #1 <span className="text-purple-400">(Required)</span>
                  </label>
                  <textarea
                    value={formData.takeaway1}
                    onChange={(e) => setFormData({ ...formData, takeaway1: e.target.value })}
                    placeholder="e.g., Made better eye contact when speaking"
                    maxLength={150}
                    rows={3}
                    className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                  />
                  <p className="text-xs text-purple-400 mt-1 text-right">{formData.takeaway1.length}/150</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Takeaway #2 <span className="text-purple-400">(Bonus +15 XP)</span>
                  </label>
                  <textarea
                    value={formData.takeaway2}
                    onChange={(e) => setFormData({ ...formData, takeaway2: e.target.value })}
                    placeholder="e.g., Need to ask more follow-up questions"
                    maxLength={150}
                    rows={3}
                    className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                  />
                  <p className="text-xs text-purple-400 mt-1 text-right">{formData.takeaway2.length}/150</p>
                </div>
              </div>

              {/* SUMMARY BOX */}
              <div className="p-5 bg-purple-950/30 rounded-2xl border border-purple-700/30 mb-6">
                <p className="text-sm text-purple-300 mb-3 font-semibold">Reflection Summary:</p>
                <div className="grid grid-cols-2 gap-3">
                  {REFLECTION_QUESTIONS.map(q => (
                    <div key={q.id} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-purple-200 capitalize">{q.id}: {formData[q.id]?.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={completeReflection}
                disabled={!formData.takeaway1.trim()}
                className="w-full px-6 py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                Complete Reflection (+{formData.takeaway2.trim() ? '65' : '50'} XP)
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default REFLECTDAY3;