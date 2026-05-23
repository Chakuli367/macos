import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, X, Plus, Users, Target, TrendingUp, Flame, Trophy, 
  Heart, ThumbsUp, MessageCircle, Clock, CheckCircle, Zap,
  Camera, Link, ChevronDown, ChevronRight, Star, Award,
  Calendar, BarChart3, Smile, Brain, Sparkles, Menu,
  ArrowLeft, MoreVertical, Pin, Bell, Search, Filter
} from 'lucide-react';

// ============================================
// MOCK DATA
// ============================================

const MOCK_GROUP = {
  id: 'grp_001',
  name: 'Communication Masters',
  icon: '💪',
  members: 12,
  activeNow: 8,
  todayGoal: 500,
  todayProgress: 347,
  streak: 7,
  todayActions: 23
};

const MOCK_MEMBERS = [
  { id: 'u1', name: 'Sarah Chen', avatar: '👩', mood: '💪', xpToday: 180, streak: 12, lastAction: '2h ago', status: 'active' },
  { id: 'u2', name: 'Mike Johnson', avatar: '👨', mood: '🚀', xpToday: 150, streak: 8, lastAction: '20m ago', status: 'active' },
  { id: 'u3', name: 'You', avatar: '😊', mood: '💡', xpToday: 120, streak: 15, lastAction: '45m ago', status: 'active' },
  { id: 'u4', name: 'Emma Davis', avatar: '👩‍🦰', mood: '🎯', xpToday: 90, streak: 5, lastAction: '1h ago', status: 'active' },
  { id: 'u5', name: 'John Smith', avatar: '👨‍🦱', mood: '🧠', xpToday: 0, streak: 3, lastAction: '2h ago', status: 'away' },
  { id: 'u6', name: 'Lisa Brown', avatar: '👩‍🦳', mood: '⚡', xpToday: 0, streak: 1, lastAction: '1d ago', status: 'away' }
];

const MOCK_MESSAGES = [
  {
    id: 'msg_1',
    type: 'MILESTONE',
    milestone: {
      icon: '🎊',
      title: 'GROUP MILESTONE!',
      description: '1000 actions completed this month',
      reward: '+200 XP to everyone',
      celebration: "You're crushing it together!"
    },
    timestamp: new Date(Date.now() - 5 * 60000),
    reactions: {}
  },
  {
    id: 'msg_2',
    type: 'ACTION',
    user: MOCK_MEMBERS[0],
    action: {
      category: 'Eye Contact Practice',
      description: 'Had a 10-min conversation with a cashier. Maintained eye contact 80% of the time!',
      insights: 'Reminding myself they\'re human too helped me stay calm and present.',
      duration: 10,
      difficulty: 'MEDIUM',
      mood: 'confident',
      xpEarned: 50
    },
    reactions: { fire: 12, heart: 8, clap: 5 },
    comments: [
      { id: 'c1', user: MOCK_MEMBERS[1], text: 'Amazing Sarah! Keep it up! 🔥', time: '1h ago' },
      { id: 'c2', user: MOCK_MEMBERS[3], text: 'This inspires me to try today!', time: '50m ago' }
    ],
    timestamp: new Date(Date.now() - 2 * 60 * 60000)
  },
  {
    id: 'msg_3',
    type: 'REFLECTION',
    user: MOCK_MEMBERS[2],
    reflection: {
      mood: '😊',
      energy: 4,
      lesson: 'Pausing before responding makes me sound more thoughtful',
      gratitude: 'Grateful for this supportive community',
      tomorrow: 'Will practice active listening in meetings',
      xpEarned: 30
    },
    reactions: { muscle: 5, heart: 3 },
    comments: [],
    timestamp: new Date(Date.now() - 45 * 60000)
  },
  {
    id: 'msg_4',
    type: 'CHALLENGE_COMPLETE',
    user: MOCK_MEMBERS[1],
    challenge: {
      name: '3-Day Conversation Streak',
      progress: [
        { day: 1, action: 'Coffee shop chat', done: true },
        { day: 2, action: 'Work presentation', done: true },
        { day: 3, action: 'Networking event', done: true }
      ],
      badge: '🎯 Consistency Champion',
      xpEarned: 100
    },
    reactions: { fire: 15, party: 10, clap: 8 },
    comments: [
      { id: 'c3', user: MOCK_MEMBERS[0], text: 'Legendary Mike! 🏆', time: '15m ago' }
    ],
    timestamp: new Date(Date.now() - 20 * 60000)
  },
  {
    id: 'msg_5',
    type: 'QUESTION',
    user: MOCK_MEMBERS[4],
    question: {
      situation: 'Job interview tomorrow',
      struggle: 'I freeze when asked unexpected questions',
      tried: 'Practiced with ChatGPT, recorded myself',
      needHelp: 'How do you stay calm under pressure?'
    },
    reactions: { pray: 8, heart: 12 },
    comments: [
      { id: 'c4', user: MOCK_MEMBERS[0], text: 'Take 3 deep breaths before answering. Works every time! 🧘‍♀️', time: '30m ago', helpful: 15 },
      { id: 'c5', user: MOCK_MEMBERS[1], text: 'Remember: they WANT you to succeed. They\'re rooting for you!', time: '25m ago', helpful: 10 }
    ],
    timestamp: new Date(Date.now() - 60 * 60000)
  },
  {
    id: 'msg_6',
    type: 'WIN',
    user: MOCK_MEMBERS[3],
    win: {
      title: 'First networking event!',
      story: 'Talked to 5 strangers, exchanged 3 contacts, and got invited to a coffee chat next week!',
      before: 'Used to avoid these events completely',
      after: 'Now I actually enjoyed it!',
      xpEarned: 150
    },
    reactions: { fire: 25, party: 20, trophy: 15 },
    comments: [
      { id: 'c6', user: MOCK_MEMBERS[0], text: 'This is HUGE Emma! 🎉🎉🎉', time: '2h ago' },
      { id: 'c7', user: MOCK_MEMBERS[2], text: 'So proud of you!!!', time: '2h ago' }
    ],
    timestamp: new Date(Date.now() - 3 * 60 * 60000)
  }
];

const ACTION_TYPES = [
  { id: 'practice', label: 'Log Practice', icon: '🎯', color: 'from-purple-600 to-indigo-600' },
  { id: 'reflection', label: 'Daily Reflection', icon: '📝', color: 'from-blue-600 to-cyan-600' },
  { id: 'challenge', label: 'Complete Challenge', icon: '🏆', color: 'from-yellow-600 to-orange-600' },
  { id: 'question', label: 'Ask Question', icon: '❓', color: 'from-pink-600 to-rose-600' },
  { id: 'win', label: 'Share Win', icon: '🎉', color: 'from-green-600 to-emerald-600' },
  { id: 'tip', label: 'Share Tip', icon: '💡', color: 'from-violet-600 to-purple-600' }
];

const REACTION_TYPES = [
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'muscle', emoji: '💪', label: 'Strong' },
  { id: 'heart', emoji: '❤️', label: 'Love' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'trophy', emoji: '🏆', label: 'Trophy' },
  { id: 'pray', emoji: '🙏', label: 'Support' }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatTimestamp = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getMessageBgColor = (type, isCurrentUser) => {
  if (type === 'MILESTONE') return 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30';
  if (isCurrentUser) return 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/30';
  return 'bg-purple-900/30 border-purple-700/30';
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ActionGroupFeed() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState(null);
  const [showMemberSidebar, setShowMemberSidebar] = useState(false);
  const [showGroupStats, setShowGroupStats] = useState(false);
  const [newComment, setNewComment] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);

  // Form Data States
  const [practiceData, setPracticeData] = useState({
    skill: 'Eye Contact',
    story: '',
    duration: '',
    difficulty: 'Medium',
    insights: ''
  });

  const [reflectionData, setReflectionData] = useState({
    mood: '😊',
    energy: 3,
    lesson: '',
    tomorrow: ''
  });

  const [winData, setWinData] = useState({
    title: '',
    story: '',
    before: '',
    after: ''
  });

  const [questionData, setQuestionData] = useState({
    situation: '',
    struggle: '',
    tried: '',
    needHelp: ''
  });

  const [challengeData, setChallengeData] = useState({
    name: '',
    days: [],
    currentDay: 1
  });

  // Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReaction = (messageId, reactionId) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentCount = msg.reactions[reactionId] || 0;
        return {
          ...msg,
          reactions: { ...msg.reactions, [reactionId]: currentCount + 1 }
        };
      }
      return msg;
    }));
    setShowReactionPicker(null);
  };

  const handleAddComment = (messageId) => {
    if (!newComment[messageId]?.trim()) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          comments: [
            ...msg.comments,
            {
              id: `c${Date.now()}`,
              user: MOCK_MEMBERS[2],
              text: newComment[messageId],
              time: 'now'
            }
          ]
        };
      }
      return msg;
    }));

    setNewComment(prev => ({ ...prev, [messageId]: '' }));
  };

  // Handle Action Submissions
  const handleSubmitPractice = () => {
    if (!practiceData.story.trim() || !practiceData.insights.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'ACTION',
      user: MOCK_MEMBERS[2],
      action: {
        category: practiceData.skill,
        description: practiceData.story,
        insights: practiceData.insights,
        duration: parseInt(practiceData.duration) || 10,
        difficulty: practiceData.difficulty.toUpperCase(),
        mood: 'confident',
        xpEarned: parseInt(practiceData.duration) * (practiceData.difficulty === 'Hard' ? 5 : practiceData.difficulty === 'Medium' ? 3 : 2)
      },
      reactions: {},
      comments: [],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Reset form
    setPracticeData({
      skill: 'Eye Contact',
      story: '',
      duration: '',
      difficulty: 'Medium',
      insights: ''
    });
    
    setShowActionModal(false);
    setSelectedActionType(null);
  };

  const handleSubmitReflection = () => {
    if (!reflectionData.lesson.trim() || !reflectionData.tomorrow.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'REFLECTION',
      user: MOCK_MEMBERS[2],
      reflection: {
        mood: reflectionData.mood,
        energy: reflectionData.energy,
        lesson: reflectionData.lesson,
        gratitude: 'Grateful for this supportive community',
        tomorrow: reflectionData.tomorrow,
        xpEarned: 30
      },
      reactions: {},
      comments: [],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Reset form
    setReflectionData({
      mood: '😊',
      energy: 3,
      lesson: '',
      tomorrow: ''
    });
    
    setShowActionModal(false);
    setSelectedActionType(null);
  };

  const handleSubmitWin = () => {
    if (!winData.title.trim() || !winData.story.trim() || !winData.before.trim() || !winData.after.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'WIN',
      user: MOCK_MEMBERS[2],
      win: {
        title: winData.title,
        story: winData.story,
        before: winData.before,
        after: winData.after,
        xpEarned: 150
      },
      reactions: {},
      comments: [],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Reset form
    setWinData({
      title: '',
      story: '',
      before: '',
      after: ''
    });
    
    setShowActionModal(false);
    setSelectedActionType(null);
  };

  const handleSubmitQuestion = () => {
    if (!questionData.situation.trim() || !questionData.struggle.trim() || !questionData.needHelp.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'QUESTION',
      user: MOCK_MEMBERS[2],
      question: {
        situation: questionData.situation,
        struggle: questionData.struggle,
        tried: questionData.tried,
        needHelp: questionData.needHelp
      },
      reactions: {},
      comments: [],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Reset form
    setQuestionData({
      situation: '',
      struggle: '',
      tried: '',
      needHelp: ''
    });
    
    setShowActionModal(false);
    setSelectedActionType(null);
  };

  const handleSubmitChallenge = () => {
    if (!challengeData.name.trim() || challengeData.days.length < 3) {
      alert('Please complete at least 3 days of the challenge');
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'CHALLENGE_COMPLETE',
      user: MOCK_MEMBERS[2],
      challenge: {
        name: challengeData.name,
        progress: challengeData.days,
        badge: '🎯 Consistency Champion',
        xpEarned: 100
      },
      reactions: {},
      comments: [],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Reset form
    setChallengeData({
      name: '',
      days: [],
      currentDay: 1
    });
    
    setShowActionModal(false);
    setSelectedActionType(null);
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderMessage = (message) => {
    const isCurrentUser = message.user?.id === 'u3';
    const isSystem = message.type === 'MILESTONE';

    return (
      <div
        key={message.id}
        className={`mb-4 ${isSystem ? 'mx-auto max-w-md' : isCurrentUser ? 'ml-auto mr-0 max-w-[85%] md:max-w-[70%]' : 'mr-auto ml-0 max-w-[85%] md:max-w-[70%]'}`}
      >
        {/* User Info (for non-system messages) */}
        {!isSystem && message.user && (
          <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && (
              <>
                <div className="text-2xl">{message.user.avatar}</div>
                <span className="text-sm font-semibold text-purple-200">{message.user.name}</span>
                <span className="text-lg">{message.user.mood}</span>
              </>
            )}
            {isCurrentUser && (
              <>
                <span className="text-lg">{message.user.mood}</span>
                <span className="text-sm font-semibold text-purple-200">You</span>
                <div className="text-2xl">{message.user.avatar}</div>
              </>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div className={`rounded-2xl border-2 p-4 ${getMessageBgColor(message.type, isCurrentUser)} backdrop-blur-sm`}>
          {/* MILESTONE MESSAGE */}
          {message.type === 'MILESTONE' && (
            <div className="text-center">
              <div className="text-5xl mb-3">{message.milestone.icon}</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{message.milestone.title}</h3>
              <p className="text-purple-100 mb-2">{message.milestone.description}</p>
              <div className="inline-block px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-400 font-bold text-sm">
                {message.milestone.reward}
              </div>
              <p className="text-purple-300 text-sm mt-2 italic">{message.milestone.celebration}</p>
            </div>
          )}

          {/* ACTION MESSAGE */}
          {message.type === 'ACTION' && message.action && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-bold text-purple-100">{message.action.category}</h4>
                  <div className="flex gap-2 text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full ${
                      message.action.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' :
                      message.action.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {message.action.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                      {message.action.duration} mins
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-purple-100 mb-3">{message.action.description}</p>

              <div className="bg-purple-950/40 rounded-xl p-3 mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <h5 className="text-xs font-bold text-purple-300 mb-1">What helped:</h5>
                    <p className="text-sm text-purple-200">{message.action.insights}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-yellow-400 font-bold">+{message.action.xpEarned} XP</span>
                <span className="text-purple-400">•</span>
                <span className="text-purple-300 capitalize">{message.action.mood}</span>
              </div>
            </div>
          )}

          {/* REFLECTION MESSAGE */}
          {message.type === 'REFLECTION' && message.reflection && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">📝</div>
                <h4 className="font-bold text-purple-100">Daily Reflection</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-purple-400 block mb-1">Feeling</span>
                    <span className="text-3xl">{message.reflection.mood}</span>
                  </div>
                  <div>
                    <span className="text-xs text-purple-400 block mb-1">Energy</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Zap
                          key={i}
                          size={16}
                          className={i < message.reflection.energy ? 'text-yellow-400' : 'text-purple-700'}
                          fill={i < message.reflection.energy ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/40 rounded-xl p-3">
                  <h5 className="text-xs font-bold text-purple-300 mb-1">Today I learned:</h5>
                  <p className="text-sm text-purple-100">{message.reflection.lesson}</p>
                </div>

                <div className="text-sm text-purple-300 italic">
                  "Tomorrow: {message.reflection.tomorrow}"
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-purple-400 font-bold">+{message.reflection.xpEarned} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* CHALLENGE COMPLETE MESSAGE */}
          {message.type === 'CHALLENGE_COMPLETE' && message.challenge && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-3xl">🏆</div>
                <div>
                  <h4 className="font-bold text-purple-100">Challenge Complete!</h4>
                  <p className="text-sm text-purple-300">{message.challenge.name}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {message.challenge.progress.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-purple-950/40 rounded-lg p-2">
                    <CheckCircle size={20} className="text-green-400" />
                    <div>
                      <span className="text-xs text-purple-400">Day {item.day}</span>
                      <p className="text-sm text-purple-100">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-2 border-yellow-500/30 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{message.challenge.badge}</div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Trophy size={14} className="text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+{message.challenge.xpEarned} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION MESSAGE */}
          {message.type === 'QUESTION' && message.question && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">❓</div>
                <h4 className="font-bold text-purple-100">Need Help</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-purple-300 mb-1">The Situation:</h5>
                  <p className="text-sm text-purple-100">{message.question.situation}</p>
                </div>

                <div className="bg-red-500/10 rounded-lg p-3">
                  <h5 className="text-xs font-bold text-red-400 mb-1">What's challenging:</h5>
                  <p className="text-sm text-purple-100">{message.question.struggle}</p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-purple-300 mb-1">What I've tried:</h5>
                  <p className="text-sm text-purple-100">{message.question.tried}</p>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-3">
                  <h5 className="text-xs font-bold text-blue-400 mb-1">Looking for:</h5>
                  <p className="text-sm text-purple-100 font-semibold">{message.question.needHelp}</p>
                </div>
              </div>
            </div>
          )}

          {/* WIN MESSAGE */}
          {message.type === 'WIN' && message.win && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-3xl">🎉</div>
                <h4 className="font-bold text-purple-100 text-lg">{message.win.title}</h4>
              </div>

              <p className="text-purple-100 mb-3 text-base">{message.win.story}</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-red-500/10 rounded-lg p-3">
                  <h5 className="text-xs font-bold text-red-400 mb-1">Before:</h5>
                  <p className="text-sm text-purple-200">{message.win.before}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <h5 className="text-xs font-bold text-green-400 mb-1">After:</h5>
                  <p className="text-sm text-purple-200">{message.win.after}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/30 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Award size={16} className="text-green-400" />
                  <span className="text-green-400 font-bold">+{message.win.xpEarned} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Reactions Bar */}
          {!isSystem && (
            <div className="mt-3 pt-3 border-t border-purple-700/30">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  {Object.entries(message.reactions).map(([key, count]) => {
                    const reaction = REACTION_TYPES.find(r => r.id === key);
                    return count > 0 && reaction ? (
                      <button
                        key={key}
                        onClick={() => handleReaction(message.id, key)}
                        className="flex items-center gap-1 text-sm hover:scale-110 transition-transform"
                      >
                        <span>{reaction.emoji}</span>
                        <span className="text-purple-300">{count}</span>
                      </button>
                    ) : null;
                  })}
                </div>

                <button
                  onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  ➕
                </button>
              </div>

              {/* Reaction Picker */}
              {showReactionPicker === message.id && (
                <div className="mt-2 flex gap-2 p-2 bg-purple-950/50 rounded-lg">
                  {REACTION_TYPES.map(reaction => (
                    <button
                      key={reaction.id}
                      onClick={() => handleReaction(message.id, reaction.id)}
                      className="text-2xl hover:scale-125 transition-transform"
                      title={reaction.label}
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          {!isSystem && message.comments && message.comments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-700/30 space-y-2">
              {message.comments.map(comment => (
                <div key={comment.id} className="flex gap-2 bg-purple-950/30 rounded-lg p-2">
                  <div className="text-xl">{comment.user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-purple-200">{comment.user.name}</span>
                      <span className="text-xs text-purple-400">{comment.time}</span>
                      {comment.helpful && (
                        <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                          <ThumbsUp size={10} /> {comment.helpful}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-100">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Input */}
          {!isSystem && (
            <div className="mt-3 pt-3 border-t border-purple-700/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment[message.id] || ''}
                  onChange={(e) => setNewComment(prev => ({ ...prev, [message.id]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(message.id)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-700/30 rounded-lg text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => handleAddComment(message.id)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                  disabled={!newComment[message.id]?.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {!isSystem && (
          <div className={`text-xs text-purple-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-800/95 to-indigo-800/95 backdrop-blur-md border-b border-purple-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => window.history.back()}>
              <ArrowLeft size={24} />
            </button>
            
            <div 
              onClick={() => setShowGroupStats(!showGroupStats)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-3xl">{MOCK_GROUP.icon}</div>
              <div>
                <h1 className="font-bold text-lg">{MOCK_GROUP.name}</h1>
                <p className="text-xs text-purple-300">
                  {MOCK_GROUP.members} members • {MOCK_GROUP.activeNow} active now
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-purple-700/50 rounded-lg transition-colors">
              <Search size={20} />
            </button>
            <button 
              onClick={() => setShowMemberSidebar(!showMemberSidebar)}
              className="p-2 hover:bg-purple-700/50 rounded-lg transition-colors"
            >
              <Users size={20} />
            </button>
            <button className="p-2 hover:bg-purple-700/50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Pinned Section */}
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center gap-2 p-3 bg-purple-950/50 rounded-lg border border-purple-700/30">
            <Target size={16} className="text-yellow-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-purple-200">Group Goal: {MOCK_GROUP.todayGoal} XP</span>
                <span className="text-sm font-bold text-purple-100">{MOCK_GROUP.todayProgress}/{MOCK_GROUP.todayGoal}</span>
              </div>
              <div className="h-2 bg-purple-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${(MOCK_GROUP.todayProgress / MOCK_GROUP.todayGoal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">{MOCK_GROUP.streak}-Day Group Streak! 🔥</span>
          </div>
        </div>
      </header>

      {/* Group Stats Modal */}
      {showGroupStats && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setShowGroupStats(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl border-2 border-purple-500/50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-100">Group Stats</h2>
                <button onClick={() => setShowGroupStats(false)} className="p-2 hover:bg-purple-700/50 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Today's Progress */}
                <div>
                  <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                    <BarChart3 size={20} />
                    Today's Progress
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                      <div className="text-2xl font-bold text-yellow-400">{MOCK_GROUP.todayProgress}</div>
                      <div className="text-xs text-purple-300">XP Earned</div>
                    </div>
                    <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                      <div className="text-2xl font-bold text-green-400">{MOCK_GROUP.todayActions}</div>
                      <div className="text-xs text-purple-300">Actions Done</div>
                    </div>
                    <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                      <div className="text-2xl font-bold text-blue-400">{MOCK_GROUP.activeNow}/12</div>
                      <div className="text-xs text-purple-300">Active Now</div>
                    </div>
                    <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                      <div className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                        <Flame size={20} /> {MOCK_GROUP.streak}
                      </div>
                      <div className="text-xs text-purple-300">Day Streak</div>
                    </div>
                  </div>
                </div>

                {/* Top Performers */}
                <div>
                  <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                    <Trophy size={20} />
                    Top Performers Today
                  </h3>
                  <div className="space-y-2">
                    {MOCK_MEMBERS.filter(m => m.xpToday > 0).slice(0, 3).map((member, idx) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-purple-950/40 rounded-xl border border-purple-700/30">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div className="text-2xl">{member.avatar}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{member.name}</div>
                          <div className="text-xs text-purple-400">{member.lastAction}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-400">{member.xpToday}</div>
                          <div className="text-xs text-purple-300">XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week Overview */}
                <div>
                  <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                    <Calendar size={20} />
                    This Week
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-purple-400 mb-1">{day}</div>
                        <div className={`w-full h-16 rounded-lg flex items-center justify-center text-2xl ${
                          idx < 5 ? 'bg-green-500/20' : idx === 5 ? 'bg-yellow-500/20' : 'bg-purple-950/40'
                        }`}>
                          {idx < 5 ? '🟢' : idx === 5 ? '🟡' : '⚪'}
                        </div>
                        <div className="text-xs text-purple-300 mt-1">{[450, 520, 380, 210, 490, 510, 347][idx]} XP</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Sidebar */}
      {showMemberSidebar && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end md:items-center justify-end p-0 md:p-4"
          onClick={() => setShowMemberSidebar(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-t-3xl md:rounded-3xl w-full md:w-96 md:h-[600px] border-2 border-purple-500/50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-purple-800/95 backdrop-blur-md p-4 border-b border-purple-700/50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-purple-100">Members ({MOCK_MEMBERS.length})</h2>
                <button onClick={() => setShowMemberSidebar(false)} className="p-2 hover:bg-purple-700/50 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Active Members */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                  🟢 ACTIVE NOW ({MOCK_MEMBERS.filter(m => m.status === 'active').length})
                </h3>
                <div className="space-y-2">
                  {MOCK_MEMBERS.filter(m => m.status === 'active').map(member => (
                    <div key={member.id} className="p-3 bg-purple-950/40 rounded-xl border border-purple-700/30 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                          <div className="text-3xl">{member.avatar}</div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{member.name}</div>
                          <div className="text-xs text-purple-400">Last: {member.lastAction}</div>
                        </div>
                        <div className="text-xl">{member.mood}</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 font-bold">{member.xpToday} XP</span>
                          <span className="text-orange-400 flex items-center gap-1">
                            <Flame size={14} /> {member.streak}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold transition-colors">
                            View
                          </button>
                          <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold transition-colors">
                            Challenge
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Members */}
              <div>
                <h3 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                  ⚪ AWAY ({MOCK_MEMBERS.filter(m => m.status === 'away').length})
                </h3>
                <div className="space-y-2">
                  {MOCK_MEMBERS.filter(m => m.status === 'away').map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-purple-950/20 rounded-xl border border-purple-700/20">
                      <div className="text-2xl opacity-60">{member.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-purple-300">{member.name}</div>
                        <div className="text-xs text-purple-500">Last seen {member.lastAction}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <main className="pb-32 md:pb-24 px-4 pt-4">
        <div className="max-w-4xl mx-auto">
          {messages.map(message => renderMessage(message))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Action Modal */}
      {showActionModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[70] flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => !selectedActionType && setShowActionModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-t-3xl md:rounded-3xl w-full md:max-w-3xl border-2 border-purple-500/50 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {!selectedActionType ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-100">What did you do today?</h2>
                    <button onClick={() => setShowActionModal(false)} className="p-2 hover:bg-purple-700/50 rounded-lg">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ACTION_TYPES.map(action => (
                      <button
                        key={action.id}
                        onClick={() => setSelectedActionType(action)}
                        className={`p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400 transition-all text-left bg-gradient-to-r ${action.color} bg-opacity-10 hover:scale-105 active:scale-95`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl">{action.icon}</span>
                          <h3 className="font-bold text-white text-lg">{action.label}</h3>
                        </div>
                        <p className="text-sm text-purple-200">Share your {action.label.toLowerCase()}</p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedActionType(null)}
                        className="p-2 hover:bg-purple-700/50 rounded-lg"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div>
                        <h2 className="text-2xl font-bold text-purple-100">{selectedActionType.label}</h2>
                        <p className="text-sm text-purple-300">Tell your story</p>
                      </div>
                    </div>
                    <button onClick={() => {
                      setShowActionModal(false);
                      setSelectedActionType(null);
                    }} className="p-2 hover:bg-purple-700/50 rounded-lg">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Form based on action type */}
                  <div className="space-y-4">
                    {selectedActionType.id === 'practice' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">What skill did you practice?</label>
                          <select className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400">
                            <option>Eye Contact</option>
                            <option>Active Listening</option>
                            <option>Conversation Starters</option>
                            <option>Public Speaking</option>
                            <option>Body Language</option>
                            <option>Empathy</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">Tell your story</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                            rows={4}
                            placeholder="What happened? Be specific..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">Duration (minutes)</label>
                            <input 
                              type="number" 
                              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400"
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">Difficulty</label>
                            <select className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400">
                              <option>Easy</option>
                              <option>Medium</option>
                              <option>Hard</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">💡 What helped you succeed?</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                            rows={3}
                            placeholder="Share your insights..."
                          />
                        </div>
                      </>
                    )}

                    {selectedActionType.id === 'reflection' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">How are you feeling?</label>
                          <div className="grid grid-cols-6 gap-2">
                            {['😊', '😌', '🤔', '😤', '😔', '🥳'].map(emoji => (
                              <button key={emoji} className="text-4xl p-3 bg-purple-950/50 hover:bg-purple-800/50 rounded-xl transition-colors">
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">Energy Level</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(level => (
                              <button key={level} className="flex-1 p-3 bg-purple-950/50 hover:bg-purple-600/50 rounded-xl transition-colors">
                                <Zap size={20} className="mx-auto" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">Today I learned...</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                            rows={4}
                            placeholder="What insight did you gain today?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">Tomorrow I will...</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                            placeholder="Set your intention"
                          />
                        </div>
                      </>
                    )}

                    {selectedActionType.id === 'win' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">What's your win?</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                            placeholder="Give it a catchy title!"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">Tell the full story</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                            rows={5}
                            placeholder="What happened? How did it feel?"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-red-400 mb-2">Before</label>
                            <textarea 
                              className="w-full px-4 py-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-red-400 resize-none"
                              rows={3}
                              placeholder="Where you started..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-green-400 mb-2">After</label>
                            <textarea 
                              className="w-full px-4 py-3 bg-green-500/10 border-2 border-green-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-green-400 resize-none"
                              rows={3}
                              placeholder="Where you are now..."
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {selectedActionType.id === 'question' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">The Situation</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                            placeholder="What's happening?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">What's challenging?</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                            rows={3}
                            placeholder="What are you struggling with?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-200 mb-2">What have you tried?</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                            rows={2}
                            placeholder="List what you've already attempted..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-blue-400 mb-2">What help do you need?</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-blue-400 resize-none"
                            rows={2}
                            placeholder="Be specific about what would help..."
                          />
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <Send size={20} />
                        Share with Group
                      </button>
                      <button 
                        onClick={() => {
                          setShowActionModal(false);
                          setSelectedActionType(null);
                        }}
                        className="px-6 py-4 bg-purple-800/50 border-2 border-purple-500/50 rounded-xl font-bold hover:bg-purple-700/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/95 to-purple-800/95 backdrop-blur-md border-t border-purple-700/50 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowActionModal(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 text-lg"
          >
            <Plus size={24} />
            What did you do today?
          </button>
        </div>
      </div>
    </div>
  );
}