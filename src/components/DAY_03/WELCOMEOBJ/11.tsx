import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Target, TrendingUp, MessageCircle, ChevronRight, CheckCircle, 
  Calendar, Award, Zap, ArrowRight, BarChart3, Lightbulb, ChevronDown,
  ChevronUp, Smile, Meh, Frown, ThumbsUp, ThumbsDown, Flame, Trophy,
  Send, Bot, User, Star, Clock, MapPin, Users, Heart, Brain, 
  TrendingDown, Activity, Eye, Mic, Volume2, Play, Pause
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface YesterdayAction {
  id: string;
  label: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timestamp: number;
  stars?: number;
  reflection?: string;
  context?: {
    location?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    duration?: number;
    otherPeople?: number;
  };
  detailedAnalysis?: {
    emotionBefore?: string;
    emotionDuring?: string;
    emotionAfter?: string;
    whatWorked?: string[];
    whatDidnt?: string[];
    lessonsLearned?: string;
    specificDialogue?: string;
    wouldDoAgain?: boolean;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface REVIEWCONVProps {
    onNext?: () => void;
}

// ============================================================================
// MOCK DATA (Replace with real backend data)
// ============================================================================

const MOCK_YESTERDAY_ACTIONS: YesterdayAction[] = [
  {
    id: '1',
    label: 'Initiated conversation with barista',
    difficulty: 'medium',
    category: 'Initiative',
    timestamp: Date.now() - 86400000,
    stars: 4,
    reflection: 'Felt good after!',
    context: {
      location: 'Coffee shop',
      timeOfDay: 'morning',
      duration: 3,
      otherPeople: 1
    }
  },
  {
    id: '2',
    label: 'Complimented a colleague',
    difficulty: 'easy',
    category: 'Connection',
    timestamp: Date.now() - 82800000,
    stars: 5,
    context: {
      location: 'Office',
      timeOfDay: 'afternoon',
      otherPeople: 1
    }
  },
  {
    id: '3',
    label: 'Asked for feedback in meeting',
    difficulty: 'hard',
    category: 'Development',
    timestamp: Date.now() - 79200000,
    stars: 3,
    reflection: 'Was nervous but glad I did it',
    context: {
      location: 'Office',
      timeOfDay: 'afternoon',
      duration: 5,
      otherPeople: 6
    }
  }
];

const DIFFICULTY_CONFIG = {
  easy: { xp: 10, color: '#a78bfa', label: 'Easy', icon: '🌱' },
  medium: { xp: 25, color: '#c084fc', label: 'Medium', icon: '🔥' },
  hard: { xp: 50, color: '#e879f9', label: 'Hard', icon: '💎' },
};

const EMOTIONS = [
  { label: 'Nervous', emoji: '😰', value: 'nervous' },
  { label: 'Excited', emoji: '🤩', value: 'excited' },
  { label: 'Calm', emoji: '😌', value: 'calm' },
  { label: 'Awkward', emoji: '😅', value: 'awkward' },
  { label: 'Confident', emoji: '😎', value: 'confident' },
  { label: 'Proud', emoji: '🎉', value: 'proud' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WELCOME({ onNext }: REVIEWCONVProps) {
  const [stage, setStage] = useState<'welcome' | 'overview' | 'review' | 'insights' | 'chat'>('welcome');
  const [actions, setActions] = useState<YesterdayAction[]>(MOCK_YESTERDAY_ACTIONS);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowAnimation(true);
  }, [stage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const currentAction = actions[currentActionIndex];
  const totalActions = actions.length;
  const reviewedActions = actions.filter(a => a.detailedAnalysis).length;
  const progressPercent = (reviewedActions / totalActions) * 100;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const updateActionAnalysis = (actionId: string, updates: Partial<YesterdayAction['detailedAnalysis']>) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { 
            ...action, 
            detailedAnalysis: { ...action.detailedAnalysis, ...updates } 
          }
        : action
    ));
  };

  const handleNextAction = () => {
    if (currentActionIndex < totalActions - 1) {
      setCurrentActionIndex(prev => prev + 1);
    } else {
      setStage('insights');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(chatInput, actions),
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (input: string, actions: YesterdayAction[]): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('nervous') || lowerInput.includes('anxious')) {
      return "It's completely normal to feel nervous! I noticed you rated your coffee shop conversation a 4/5 despite initial nerves. That shows real growth. The anxiety often decreases with each interaction. What specific part made you most nervous?";
    }
    
    if (lowerInput.includes('went well') || lowerInput.includes('good')) {
      return "That's fantastic! 🎉 Looking at your actions, you completed 3 interactions yesterday with an average rating of 4/5. Your colleague compliment got 5 stars - that's a pattern worth repeating. What do you think made those moments successful?";
    }
    
    if (lowerInput.includes('improve') || lowerInput.includes('better')) {
      return "Great mindset! Based on your feedback session (3/5 stars), it seems harder interactions are growth opportunities. I'd suggest: 1) Prepare 2-3 questions beforehand, 2) Practice active listening, 3) Start with lower-stakes conversations. What feels most challenging?";
    }

    if (lowerInput.includes('feedback') || lowerInput.includes('meeting')) {
      return "Asking for feedback in a meeting is a HARD difficulty action - that took real courage! Even though you rated it 3/5, you did it. That's what matters. What specific response surprised you or made you uncomfortable?";
    }
    
    return `I can see you're reflecting on yesterday's ${actions.length} actions. You're building real skills! Tell me more about what's on your mind - was there a specific interaction that stood out to you?`;
  };

  const calculateInsights = () => {
    const avgRating = actions.reduce((sum, a) => sum + (a.stars || 0), 0) / actions.length;
    const morningActions = actions.filter(a => a.context?.timeOfDay === 'morning').length;
    const topCategory = actions.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCategoryName = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
      avgRating: avgRating.toFixed(1),
      totalXP: actions.reduce((sum, a) => sum + DIFFICULTY_CONFIG[a.difficulty].xp, 0),
      morningActions,
      topCategory: topCategoryName,
      superpower: avgRating >= 4 ? "You're building strong connection skills!" : "You're learning and growing!",
      recommendation: "Try 'Active Listening Practice' today - it builds on your strengths"
    };
  };

  // ============================================================================
  // RENDER STAGES
  // ============================================================================

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
        <div className={`max-w-2xl w-full transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Calendar className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Day 3 of 30</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Review & Reflect
            </h1>
            
            <p className="text-lg text-purple-200 mb-8">
              Yesterday you took action! Now let's analyze what worked and level up your skills.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">Day 2 Complete!</h2>
                <p className="text-purple-300">You logged {totalActions} actions yesterday</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-white">{totalActions}</p>
                <p className="text-xs text-purple-300">Actions</p>
              </div>
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                <Zap className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">
                  {actions.reduce((sum, a) => sum + DIFFICULTY_CONFIG[a.difficulty].xp, 0)}
                </p>
                <p className="text-xs text-purple-300">XP Earned</p>
              </div>
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                <Star className="w-6 h-6 text-pink-400 mb-2" />
                <p className="text-2xl font-bold text-white">
                  {(actions.reduce((sum, a) => sum + (a.stars || 0), 0) / actions.length).toFixed(1)}
                </p>
                <p className="text-xs text-purple-300">Avg Rating</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-bold text-purple-100 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Today's Goals
              </h3>
              <div className="space-y-2">
                {[
                  'Deep dive into each action',
                  'Identify what worked and what didn\'t',
                  'Extract key lessons',
                  'Chat with AI coach for personalized insights'
                ].map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-purple-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStage('overview')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Let's Review
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center text-purple-400 text-sm italic">
            "Reflection turns experience into insight" ✨
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setStage('welcome')}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-purple-100 mb-2">Yesterday's Actions</h1>
            <p className="text-purple-300">Click any action to begin deep analysis</p>
          </div>

          <div className="grid gap-4 mb-6">
            {actions.map((action, idx) => {
              const isExpanded = expandedAction === action.id;
              const isReviewed = !!action.detailedAnalysis?.emotionBefore;
              const timeStr = new Date(action.timestamp).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              });

              return (
                <div
                  key={action.id}
                  className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-xl overflow-hidden transition-all hover:border-purple-400/50"
                >
                  <button
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">{DIFFICULTY_CONFIG[action.difficulty].icon}</span>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{action.label}</h3>
                            <div className="flex items-center gap-3 flex-wrap text-sm text-purple-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {timeStr}
                              </span>
                              {action.context?.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {action.context.location}
                                </span>
                              )}
                              <span className="px-2 py-1 bg-purple-800/50 rounded-full">
                                {action.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (action.stars || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-purple-700'
                                }`}
                              />
                            ))}
                          </div>
                          {isReviewed && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-300 font-medium">Reviewed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isExpanded ? <ChevronUp className="w-6 h-6 text-purple-400" /> : <ChevronDown className="w-6 h-6 text-purple-400" />}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4 border-t border-purple-500/20 pt-4">
                      {action.reflection && (
                        <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                          <p className="text-sm text-purple-200">{action.reflection}</p>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setCurrentActionIndex(idx);
                          setStage('review');
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
                      >
                        {isReviewed ? 'Update Review' : 'Start Deep Dive'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-100">Review Progress</h3>
              <span className="text-2xl font-bold text-white">{reviewedActions}/{totalActions}</span>
            </div>
            <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-purple-300 mt-2">{Math.round(progressPercent)}% complete</p>

            {reviewedActions === totalActions && (
              <button
                onClick={() => setStage('insights')}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                View Insights & Chat with AI
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'review' && currentAction) {
    const analysis = currentAction.detailedAnalysis || {};

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setStage('overview')}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-4"
            >
              ← Back to Overview
            </button>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-purple-100 mb-2">Deep Dive Analysis</h1>
                <p className="text-purple-300">Action {currentActionIndex + 1} of {totalActions}</p>
              </div>
              <span className="text-5xl">{DIFFICULTY_CONFIG[currentAction.difficulty].icon}</span>
            </div>

            <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30 mb-4">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentActionIndex + 1) / totalActions) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Action Summary */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">{currentAction.label}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                  <p className="text-sm text-purple-300 mb-1">Difficulty</p>
                  <p className="text-lg font-bold text-white">{DIFFICULTY_CONFIG[currentAction.difficulty].label}</p>
                </div>
                <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                  <p className="text-sm text-purple-300 mb-1">Category</p>
                  <p className="text-lg font-bold text-white">{currentAction.category}</p>
                </div>
              </div>
            </div>

            {/* Emotional Journey */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-400" />
                Emotional Journey
              </h3>
              
              <div className="space-y-4">
                {['Before', 'During', 'After'].map((phase) => {
                  const key = `emotion${phase}` as keyof typeof analysis;
                  return (
                    <div key={phase}>
                      <p className="text-sm text-purple-300 mb-2">{phase} the interaction:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {EMOTIONS.map(emotion => (
                          <button
                            key={emotion.value}
                            onClick={() => updateActionAnalysis(currentAction.id, { [key]: emotion.value })}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              analysis[key] === emotion.value
                                ? 'bg-purple-600 border-purple-400 scale-105'
                                : 'bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50'
                            }`}
                          >
                            <div className="text-2xl mb-1">{emotion.emoji}</div>
                            <div className="text-xs text-purple-200">{emotion.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What Worked */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <ThumbsUp className="w-6 h-6 text-green-400" />
                What Went Well?
              </h3>
              <textarea
                placeholder="What specifically worked? Body language, words you said, timing, etc."
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none min-h-[120px]"
                value={analysis.whatWorked?.join('\n') || ''}
                onChange={(e) => updateActionAnalysis(currentAction.id, { 
                  whatWorked: e.target.value.split('\n').filter(s => s.trim()) 
                })}
              />
            </div>

            {/* What Could Improve */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                What Could Be Better?
              </h3>
              <textarea
                placeholder="What would you do differently? What felt uncomfortable? No judgment - this is learning!"
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none min-h-[120px]"
                value={analysis.whatDidnt?.join('\n') || ''}
                onChange={(e) => updateActionAnalysis(currentAction.id, { 
                  whatDidnt: e.target.value.split('\n').filter(s => s.trim()) 
                })}
              />
            </div>

            {/* Key Lessons */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Key Lesson Learned
              </h3>
              <textarea
                placeholder="What's the ONE thing you'll remember and apply next time?"
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none min-h-[100px]"
                value={analysis.lessonsLearned || ''}
                onChange={(e) => updateActionAnalysis(currentAction.id, { 
                  lessonsLearned: e.target.value 
                })}
              />
            </div>

            {/* Would You Do It Again? */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h3 className="text-xl font-bold text-purple-100 mb-4">Would you do this again?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateActionAnalysis(currentAction.id, { wouldDoAgain: true })}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    analysis.wouldDoAgain === true
                      ? 'bg-green-600 border-green-400 scale-105'
                      : 'bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-lg font-bold text-white">Yes!</div>
                  <div className="text-sm text-purple-200">I'd do it again</div>
                </button>
                <button
                  onClick={() => updateActionAnalysis(currentAction.id, { wouldDoAgain: false })}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    analysis.wouldDoAgain === false
                      ? 'bg-orange-600 border-orange-400 scale-105'
                      : 'bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🤔</div>
                  <div className="text-lg font-bold text-white">Maybe</div>
                  <div className="text-sm text-purple-200">Need more practice</div>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              {currentActionIndex > 0 && (
                <button
                  onClick={() => setCurrentActionIndex(prev => prev - 1)}
                  className="flex-1 px-6 py-4 bg-purple-950/40 border-2 border-purple-500/30 rounded-2xl font-bold hover:border-purple-400/50 transition-all"
                >
                  ← Previous
                </button>
              )}
              <button
                onClick={handleNextAction}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {currentActionIndex < totalActions - 1 ? 'Next Action' : 'View Insights'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'insights') {
    const insights = calculateInsights();
    const emotionalJourneys = actions
      .filter(a => a.detailedAnalysis?.emotionBefore)
      .map(a => ({
        action: a.label,
        before: a.detailedAnalysis?.emotionBefore,
        during: a.detailedAnalysis?.emotionDuring,
        after: a.detailedAnalysis?.emotionAfter
      }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setStage('overview')}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-4"
            >
              ← Back to Overview
            </button>
            <h1 className="text-4xl font-bold text-purple-100 mb-2">Your Insights</h1>
            <p className="text-purple-300">AI-powered analysis of your progress</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Overall Stats */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-100 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Performance Summary
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300">Average Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{insights.avgRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300">Total XP Earned</span>
                  <span className="text-2xl font-bold text-white">{insights.totalXP}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300">Actions Completed</span>
                  <span className="text-2xl font-bold text-white">{totalActions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300">Top Category</span>
                  <span className="text-lg font-bold text-purple-200">{insights.topCategory}</span>
                </div>
              </div>
            </div>

            {/* Superpower & Recommendations */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-amber-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Your Superpower
                </h3>
                <p className="text-amber-100 text-lg">{insights.superpower}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  Next Step
                </h3>
                <p className="text-blue-100">{insights.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Emotional Progression */}
          {emotionalJourneys.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-purple-100 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-pink-400" />
                Emotional Progression
              </h2>
              <div className="space-y-4">
                {emotionalJourneys.map((journey, idx) => (
                  <div key={idx} className="bg-purple-950/40 p-5 rounded-2xl border border-purple-700/30">
                    <p className="text-white font-bold mb-3">{journey.action}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-xs text-purple-400 mb-1">Before</p>
                        <p className="text-2xl">
                          {EMOTIONS.find(e => e.value === journey.before)?.emoji || '🤔'}
                        </p>
                        <p className="text-xs text-purple-300 mt-1">
                          {EMOTIONS.find(e => e.value === journey.before)?.label}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-purple-500" />
                      <div className="text-center flex-1">
                        <p className="text-xs text-purple-400 mb-1">During</p>
                        <p className="text-2xl">
                          {EMOTIONS.find(e => e.value === journey.during)?.emoji || '🤔'}
                        </p>
                        <p className="text-xs text-purple-300 mt-1">
                          {EMOTIONS.find(e => e.value === journey.during)?.label}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-purple-500" />
                      <div className="text-center flex-1">
                        <p className="text-xs text-purple-400 mb-1">After</p>
                        <p className="text-2xl">
                          {EMOTIONS.find(e => e.value === journey.after)?.emoji || '🤔'}
                        </p>
                        <p className="text-xs text-purple-300 mt-1">
                          {EMOTIONS.find(e => e.value === journey.after)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Lessons */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-purple-100 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Key Lessons Extracted
            </h2>
            <div className="space-y-3">
              {actions
                .filter(a => a.detailedAnalysis?.lessonsLearned)
                .map((action, idx) => (
                  <div key={idx} className="flex gap-4 bg-purple-950/40 p-5 rounded-2xl border border-purple-700/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-purple-400 mb-1">{action.label}</p>
                      <p className="text-white">{action.detailedAnalysis?.lessonsLearned}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Chat with AI Button */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl text-center">
            <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Ready for Personalized Coaching?</h2>
            <p className="text-purple-200 mb-6">
              Chat with our AI coach to dive deeper into your experiences, get custom advice, and plan your next actions.
            </p>
            <button
              onClick={() => setStage('chat')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              <MessageCircle className="w-6 h-6" />
              Start AI Coaching Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'chat') {
    const insights = calculateInsights(); // Calculate insights for chat stage
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto h-screen flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-md border-b-2 border-purple-500/30 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStage('insights')}
                  className="p-2 hover:bg-purple-800/40 rounded-xl transition-colors"
                >
                  ← Back
                </button>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Coach</h2>
                  <p className="text-sm text-purple-300">Here to help you grow</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-300 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Initial AI Message */}
            {chatMessages.length === 0 && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-5 rounded-3xl rounded-tl-none border-2 border-indigo-500/30 shadow-xl">
                    <p className="text-white leading-relaxed mb-4">
                      Hey there! 👋 I've reviewed all {totalActions} of your actions from yesterday. You earned {insights.totalXP} XP with an average rating of {insights.avgRating}/5 - that's solid progress!
                    </p>
                    <p className="text-white leading-relaxed">
                      I'm here to discuss your experiences, help you understand what worked, and plan even better interactions. What would you like to talk about?
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "What made me nervous?",
                        "How can I improve?",
                        "What went well?",
                        "Plan tomorrow's actions"
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setChatInput(suggestion);
                            handleSendMessage();
                          }}
                          className="px-4 py-2 bg-purple-800/40 hover:bg-purple-700/40 rounded-xl text-sm text-purple-200 border border-purple-500/30 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className={`p-5 rounded-3xl border-2 shadow-xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 backdrop-blur-md border-purple-400/30 rounded-tr-none'
                      : 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md border-indigo-500/30 rounded-tl-none'
                  }`}>
                    <p className="text-white leading-relaxed">{message.content}</p>
                    <p className="text-xs text-purple-400 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t-2 border-purple-500/30 p-4 bg-purple-900/50 backdrop-blur-md flex-shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything about your actions, get advice, or plan tomorrow..."
                className="flex-1 px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI can make mistakes. Double-check important info.</span>
            </div>
          </div>

          {onNext && (
          <div className="mt-12">
            <button
              onClick={onNext}
              className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 text-white"
            >
              <Target className="w-6 h-6" />
              Continue to Next Prep Step
            </button>
          </div>
        )}
        
        </div>
      </div>
    );
  }

  return null;
}