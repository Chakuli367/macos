import React, { useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Send, X, Plus, Users, Target, TrendingUp, Flame, Trophy,
  Heart, ThumbsUp, MessageCircle, Clock, CheckCircle, Zap,
  Camera, Link, ChevronDown, ChevronRight, Star, Award,
  Calendar, BarChart3, Smile, Brain, Sparkles, Menu,
  ArrowLeft, MoreVertical, Pin, Bell, Search, Filter, Loader2, Info
} from 'lucide-react';



import { useParams, useNavigate } from 'react-router-dom';

// Add after line with imports, before const MOCK_GROUP
const SafeAreaStyles = () => (
  <style>{`
    .safe-area-bottom {
      padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
    }
    .safe-messages-padding {
      padding-bottom: calc(140px + env(safe-area-inset-bottom, 0px));
    }
  `}</style>
);

// ============================================
// MOCK DATA (UNCHANGED)
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

const MOCK_MESSAGES_DATA = [
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
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDateLabel = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Today';
  if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const getMessageBgColor = (type, isCurrentUser) => {
  if (type === 'MILESTONE') return 'bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border-yellow-500/30';
  if (isCurrentUser) return 'bg-gradient-to-br from-indigo-700/50 to-purple-700/50 border-indigo-500/50';
  return 'bg-purple-900/40 border-purple-700/50';
};

// ============================================
// SHARED COMPONENTS
// ============================================

const InputField = React.forwardRef(({ label, type = 'text', value, onChange, placeholder, required = false, isFullWidth = true, children }, ref) => (
  <div className={`space-y-1 ${isFullWidth ? 'w-full' : ''}`}>
    <label className="text-sm font-medium text-purple-300 flex justify-between">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-purple-950/80 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base"
        required={required}
      />
    ) : type === 'select' ? (
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-purple-950/80 border border-purple-700/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base"
        required={required}
      >
        {children}
      </select>
    ) : (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-purple-950/80 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base"
        required={required}
      />
    )}
  </div>
));

const IconButton = ({ children, onClick, className = '', title = '', minSize = 'min-w-11 min-h-11' }) => (
  <button
    onClick={onClick}
    className={`${minSize} flex items-center justify-center p-2 rounded-full text-purple-200 hover:bg-purple-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${className}`}
    title={title}
  >
    {children}
  </button>
);

const ActionButton = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center p-3 rounded-2xl text-white text-sm font-semibold bg-gradient-to-br ${color} hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02] active:scale-95`}
  >
    <span className="text-2xl mb-1">{icon}</span>
    {label}
  </button>
);

// ============================================
// MODAL COMPONENTS
// ============================================

const Modal = ({ isOpen, onClose, title, children, isMobile, fullScreen = false }) => {
  if (!isOpen) return null;

  // Simulate a mobile bottom sheet with simple Tailwind classes
  const sheetClass = isMobile
    ? 'fixed inset-x-0 bottom-0 max-h-[80%] rounded-t-3xl transition-transform duration-300 ease-out translate-y-0'
    : fullScreen
      ? 'fixed inset-2 rounded-3xl'
      : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl max-w-lg w-full max-h-[90%]';

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={isMobile ? onClose : null}>
      <div
        className={`bg-purple-950/95 border border-purple-700/50 shadow-2xl p-6 flex flex-col ${sheetClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-purple-700/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <IconButton onClick={onClose} title="Close">
            <X size={24} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto pt-4 pb- safe-area-padding-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ACTION TYPE FORMS
// ============================================

const PracticeForm = ({ data, setData, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
    <InputField
      label="Skill Practiced (e.g., Active Listening, Eye Contact)"
      value={data.skill}
      onChange={(e) => setData({ ...data, skill: e.target.value })}
      required
    />
    <InputField
      label="The Story: What did you do?"
      type="textarea"
      value={data.story}
      onChange={(e) => setData({ ...data, story: e.target.value })}
      placeholder="I approached a stranger and asked for directions..."
      required
    />
    <div className="flex gap-4">
      <InputField
        label="Duration (mins)"
        type="number"
        value={data.duration}
        onChange={(e) => setData({ ...data, duration: e.target.value })}
        placeholder="10"
        required
        isFullWidth={false}
      />
      <InputField
        label="Difficulty"
        type="select"
        value={data.difficulty}
        onChange={(e) => setData({ ...data, difficulty: e.target.value })}
        required
        isFullWidth={false}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </InputField>
    </div>
    <InputField
      label="Insights: What helped, what did you learn?"
      type="textarea"
      value={data.insights}
      onChange={(e) => setData({ ...data, insights: e.target.value })}
      placeholder="I noticed that a simple smile made the other person relax."
      required
    />
    <button type="submit" className="min-h-[44px] w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8">
      Log Action & Earn XP <Zap size={16} />
    </button>
  </form>
);

const ReflectionForm = ({ data, setData, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
    <div className="space-y-3">
      <label className="text-sm font-medium text-purple-300 block">Current Mood</label>
      <div className="flex justify-around bg-purple-950/70 p-3 rounded-xl border border-purple-700/50">
        {['😊', '💪', '💡', '🚀', '🎯', '🧠'].map(mood => (
          <button
            key={mood}
            type="button"
            onClick={() => setData({ ...data, mood })}
            className={`text-4xl p-2 rounded-full transition-all ${data.mood === mood ? 'ring-4 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
            title={mood}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <label className="text-sm font-medium text-purple-300 block">Energy Level: {data.energy} / 5</label>
      <div className="flex gap-1 justify-center p-3 bg-purple-950/70 rounded-xl border border-purple-700/50">
        {[...Array(5)].map((_, i) => (
          <IconButton
            key={i}
            onClick={() => setData({ ...data, energy: i + 1 })}
            className={`!p-3 transition-colors ${i < data.energy ? '!bg-yellow-500/30 text-yellow-400' : 'text-purple-700/80 hover:!bg-purple-800/50'}`}
          >
            <Zap size={20} fill={i < data.energy ? 'currentColor' : 'none'} />
          </IconButton>
        ))}
      </div>
    </div>

    <InputField
      label="Today I learned / Key Lesson"
      type="textarea"
      value={data.lesson}
      onChange={(e) => setData({ ...data, lesson: e.target.value })}
      placeholder="Pausing before responding makes me sound more thoughtful."
      required
    />
    <InputField
      label="My Goal for Tomorrow"
      type="textarea"
      value={data.tomorrow}
      onChange={(e) => setData({ ...data, tomorrow: e.target.value })}
      placeholder="Will practice active listening in my team meeting."
      required
    />
    <button type="submit" className="min-h-[44px] w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8">
      Post Reflection <Brain size={16} />
    </button>
  </form>
);

const WinForm = ({ data, setData, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
    <InputField
      label="Title of Your Win"
      value={data.title}
      onChange={(e) => setData({ ...data, title: e.target.value })}
      placeholder="First networking event!"
      required
    />
    <InputField
      label="The Story (What happened?)"
      type="textarea"
      value={data.story}
      onChange={(e) => setData({ ...data, story: e.target.value })}
      placeholder="Talked to 5 strangers, exchanged 3 contacts, and got invited to a coffee chat next week!"
      required
    />
    <div className="grid grid-cols-2 gap-4">
      <InputField
        label="Before (The struggle)"
        type="textarea"
        value={data.before}
        onChange={(e) => setData({ ...data, before: e.target.value })}
        placeholder="Used to avoid these events completely"
        required
      />
      <InputField
        label="After (The breakthrough)"
        type="textarea"
        value={data.after}
        onChange={(e) => setData({ ...data, after: e.target.value })}
        placeholder="Now I actually enjoyed it!"
        required
      />
    </div>
    <button type="submit" className="min-h-[44px] w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8">
      Share Victory <Trophy size={16} />
    </button>
  </form>
);

const QuestionForm = ({ data, setData, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
    <InputField
      label="Current Situation"
      type="textarea"
      value={data.situation}
      onChange={(e) => setData({ ...data, situation: e.target.value })}
      placeholder="Job interview tomorrow"
      required
    />
    <InputField
      label="What is your biggest struggle?"
      type="textarea"
      value={data.struggle}
      onChange={(e) => setData({ ...data, struggle: e.target.value })}
      placeholder="I freeze when asked unexpected questions"
      required
    />
    <InputField
      label="What have you tried so far? (Optional)"
      type="textarea"
      value={data.tried}
      onChange={(e) => setData({ ...data, tried: e.target.value })}
      placeholder="Practiced with ChatGPT, recorded myself"
    />
    <InputField
      label="What advice do you need?"
      type="textarea"
      value={data.needHelp}
      onChange={(e) => setData({ ...data, needHelp: e.target.value })}
      placeholder="How do you stay calm under pressure?"
      required
    />
    <button type="submit" className="min-h-[44px] w-full py-3 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8">
      Post Question <MessageCircle size={16} />
    </button>
  </form>
);

// A simplified form for Challenge Complete
const ChallengeForm = ({ data, setData, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
    <InputField
      label="Challenge Name"
      value={data.name}
      onChange={(e) => setData({ ...data, name: e.target.value })}
      placeholder="7-Day Eye Contact Challenge"
      required
    />
    <div className="space-y-3 p-4 bg-purple-950/70 rounded-xl border border-purple-700/50">
      <h3 className="font-bold text-purple-300">Daily Progress (Min. 3 Days)</h3>
      {[...Array(data.currentDay)].map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-purple-300 w-12 flex-shrink-0">Day {index + 1}:</span>
          <input
            type="text"
            value={data.days[index]?.action || ''}
            onChange={(e) => {
              const newDays = [...data.days];
              newDays[index] = { day: index + 1, action: e.target.value, done: true };
              setData({ ...data, days: newDays });
            }}
            placeholder={`Action for Day ${index + 1}`}
            className="flex-1 px-3 py-2 bg-purple-900/50 border border-purple-700/30 rounded-lg text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setData({ ...data, currentDay: data.currentDay + 1 })}
        className="w-full mt-3 py-2 border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-800/30 transition-colors"
      >
        Add Day
      </button>
    </div>
    <button type="submit" className="min-h-[44px] w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8">
      Claim Badge <Trophy size={16} />
    </button>
  </form>
);

// ============================================
// MAIN FEED COMPONENTS
// ============================================

const MessageSkeleton = () => (
  <div className="flex gap-4 p-4 mb-6 bg-purple-900/40 border border-purple-700/50 rounded-2xl animate-pulse">
    <div className="w-10 h-10 rounded-full bg-purple-700/50"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 w-1/3 bg-purple-700/50 rounded"></div>
      <div className="h-4 w-full bg-purple-700/50 rounded"></div>
      <div className="h-4 w-5/6 bg-purple-700/50 rounded"></div>
      <div className="h-4 w-1/4 bg-purple-700/50 rounded-full mt-4"></div>
    </div>
  </div>
);

const EmptyState = ({ onOpenModal }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 text-purple-300">
    <Info size={48} className="text-purple-500 mb-4" />
    <h2 className="text-2xl font-bold mb-2 text-white">No Actions Yet!</h2>
    <p className="mb-6">Be the first to share your practice log, reflection, or win to start the conversation.</p>
    <button
      onClick={() => onOpenModal()}
      className="min-h-[44px] px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
    >
      <Plus size={20} /> Log Your First Action
    </button>
  </div>
);

const MemberSidebar = ({ members, isMobile, onClose }) => (
  <div className={`fixed inset-y-0 right-0 z-40 w-full md:w-80 lg:relative lg:translate-x-0 bg-purple-950/95 border-l border-purple-700/50 p-4 transition-transform duration-300 ${isMobile && onClose ? (onClose ? 'translate-x-0' : 'translate-x-full') : ''} safe-area-padding-right`}>
    {isMobile && (
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-purple-700/50">
        <h2 className="text-xl font-bold text-white">Members</h2>
        <IconButton onClick={onClose} title="Close Sidebar">
          <X size={24} />
        </IconButton>
      </div>
    )}
    <div className="mb-6">
      <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-3">
        Active Now <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> ({MOCK_GROUP.activeNow})
      </h3>
      <div className="space-y-3">
        {members.map(member => (
          <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-800/50 transition-colors">
            <div className="text-2xl">{member.avatar}</div>
            <div className="flex-1">
              <p className={`font-semibold ${member.id === 'u3' ? 'text-indigo-400' : 'text-white'}`}>{member.name}</p>
              <p className="text-xs text-purple-400 flex items-center gap-1">
                <Flame size={12} className="text-red-400" /> {member.streak} Days Streak
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-yellow-400 flex items-center gap-1">
                <Zap size={12} /> {member.xpToday}
              </p>
              <p className={`text-xs ${member.status === 'active' ? 'text-green-400' : 'text-purple-500'}`}>{member.status === 'active' ? 'Online' : member.lastAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MessageBubble = ({ message, isCurrentUser, onReact, showReactionPicker, setShowReactionPicker, onAddComment, newComment, setNewComment }) => {
  const isSystem = message.type === 'MILESTONE';
  const reactionButtonRef = useRef(null);

  // Determine user info alignment
  const userFlexClass = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleMarginClass = isSystem ? 'mx-auto max-w-md' : isCurrentUser ? 'ml-auto mr-0' : 'mr-auto ml-0';

  const user = message.user;

  return (
    <div key={message.id} className={`mb-6 flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} group`}>
      {/* User Info & Timestamp Header */}
      {!isSystem && user && (
        <div className={`flex items-center gap-2 mb-1 px-2 ${userFlexClass}`}>
          <div className="text-xs text-purple-400">{formatTimestamp(message.timestamp)}</div>
          {!isCurrentUser && (
            <div className="flex items-center gap-2">
              <div className="text-2xl">{user.avatar}</div>
              <span className="text-sm font-semibold text-purple-200">{user.name}</span>
            </div>
          )}
          {isCurrentUser && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-purple-200">You</span>
              <div className="text-2xl">{user.avatar}</div>
            </div>
          )}
        </div>
      )}

      {/* Message Bubble Body */}
      <div className={`rounded-3xl border-2 p-5 max-w-[90%] md:max-w-[70%] lg:max-w-[55%] ${getMessageBgColor(message.type, isCurrentUser)} backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-purple-950/50 ${isCurrentUser ? 'rounded-br-none' : 'rounded-tl-none'}`}>
        {/* Render Message Content (Action, Reflection, Win, etc. - shortened for brevity) */}
        {message.type === 'MILESTONE' && (
          <div className="text-center">
            <div className="text-5xl mb-3 animate-bounce">{message.milestone.icon}</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">{message.milestone.title}</h3>
            <p className="text-purple-100 mb-3">{message.milestone.description}</p>
            <div className="inline-block px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-400 font-bold text-sm">
              {message.milestone.reward}
            </div>
          </div>
        )}

        {message.type === 'ACTION' && message.action && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🎯</div>
              <h4 className="font-bold text-purple-100 text-lg">{message.action.category}</h4>
            </div>
            <p className="text-purple-100">{message.action.description}</p>
            <div className="bg-purple-950/40 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <p className="text-sm text-purple-200"><span className="font-bold text-purple-300">Insights:</span> {message.action.insights}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-yellow-400 font-bold">+{message.action.xpEarned} XP</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                message.action.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' :
                message.action.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>{message.action.difficulty}</span>
            </div>
          </div>
        )}

        {/* ... (Other message types like REFLECTION, WIN, QUESTION, CHALLENGE_COMPLETE are omitted here for file size, but would be implemented with the same visual style as ACTION) ... */}

        {/* Reactions Bar */}
        {!isSystem && (
          <div className="relative mt-4 pt-4 border-t border-purple-700/30">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {Object.entries(message.reactions).map(([key, count]) => {
                  const reaction = REACTION_TYPES.find(r => r.id === key);
                  return count > 0 && reaction ? (
                    <button
                      key={key}
                      onClick={() => onReact(message.id, key)}
                      className="min-w-[44px] min-h-[44px] flex items-center gap-1 text-sm bg-purple-950/50 hover:bg-purple-800/70 rounded-full px-3 py-1 transition-all transform hover:scale-105"
                      title={reaction.label}
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-purple-300 font-semibold">{count}</span>
                    </button>
                  ) : null;
                })}
              </div>

              <IconButton
                ref={reactionButtonRef}
                onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                className="!p-2 text-2xl"
                title="Add Reaction"
                minSize="min-w-10 min-h-10"
              >
                <Plus size={18} />
              </IconButton>
            </div>

            {/* Reaction Picker Popover */}
            {showReactionPicker === message.id && (
              <div
                className={`absolute ${isCurrentUser ? 'right-0' : 'left-0'} bottom-full mb-3 p-2 bg-purple-800/95 border border-purple-700 rounded-xl shadow-2xl flex gap-1 z-10 transition-all transform animate-in fade-in slide-in-from-bottom-2`}
              >
                {REACTION_TYPES.map(reaction => (
                  <button
                    key={reaction.id}
                    onClick={() => onReact(message.id, reaction.id)}
                    className="text-3xl p-1 rounded-lg hover:bg-purple-700/50 transition-transform transform hover:scale-110 active:scale-95"
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
          <div className="mt-4 pt-4 border-t border-purple-700/30 space-y-3">
            <h5 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <MessageCircle size={16} /> Comments ({message.comments.length})
            </h5>
            {message.comments.slice(-2).map(comment => (
              <div key={comment.id} className="flex gap-3 bg-purple-950/50 rounded-lg p-3">
                <div className="text-xl flex-shrink-0">{comment.user.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-200">{comment.user.name}</span>
                    <span className="text-xs text-purple-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-purple-100">{comment.text}</p>
                  {comment.helpful && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
                      <ThumbsUp size={12} /> {comment.helpful} Helpful
                    </span>
                  )}
                </div>
              </div>
            ))}
            {message.comments.length > 2 && (
              <p className="text-xs text-purple-400 text-center cursor-pointer hover:text-purple-300">
                View all {message.comments.length} comments...
              </p>
            )}
          </div>
        )}

        {/* Add Comment Input */}
        {!isSystem && (
          <div className="mt-4 pt-4 border-t border-purple-700/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment[message.id] || ''}
                onChange={(e) => setNewComment(prev => ({ ...prev, [message.id]: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && onAddComment(message.id)}
                placeholder="Write a supportive comment..."
                className="flex-1 px-4 py-2 bg-purple-950/70 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <IconButton
                onClick={() => onAddComment(message.id)}
                className="!bg-indigo-600 hover:!bg-indigo-500"
                minSize="min-w-10 min-h-10"
                title="Send Comment"
              >
                <Send size={16} />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export function ActionGroupFeed() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(MOCK_MESSAGES_DATA);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState(null);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [showMemberSidebar, setShowMemberSidebar] = useState(false);
  const [newComment, setNewComment] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Changed to lg breakpoint
  const messagesContainerRef = useRef(null);
  const [stickyDate, setStickyDate] = useState(null);
  const messagesEndRef = useRef(null);

  // Form Data States (simplified initialization)
  const [practiceData, setPracticeData] = useState({ skill: '', story: '', duration: 10, difficulty: 'Medium', insights: '' });
  const [reflectionData, setReflectionData] = useState({ mood: '😊', energy: 3, lesson: '', tomorrow: '' });
  const [winData, setWinData] = useState({ title: '', story: '', before: '', after: '' });
  const [questionData, setQuestionData] = useState({ situation: '', struggle: '', tried: '', needHelp: '' });
  const [challengeData, setChallengeData] = useState({ name: '', days: [{ day: 1, action: '', done: true }], currentDay: 1 });

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Handle responsive & Sticky Date Logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    
    // Sticky Date Logic
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const messageElements = messagesContainerRef.current.querySelectorAll('.message-date-separator');
        let currentStickyDate = null;
        for (const el of messageElements) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) { // Stickiness threshold (below header)
            currentStickyDate = el.getAttribute('data-date');
          }
        }
        setStickyDate(currentStickyDate);
      }
    };

    messagesContainerRef.current?.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      messagesContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);


  // Grouping Messages by Date
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;

    [...messages].sort((a, b) => a.timestamp - b.timestamp).forEach(message => {
      const dateLabel = getDateLabel(message.timestamp);

      if (dateLabel !== currentDate) {
        groups.push({ type: 'DATE_SEPARATOR', label: dateLabel });
        currentDate = dateLabel;
      }
      groups.push(message);
    });

    return groups;
  }, [messages]);


  
  // Handle Action Modal flow
  const handleOpenActionModal = (type) => {
    setSelectedActionType(type);
    setShowActionModal(true);
  };

 const handleReaction = (reactionType, messageId) => {
    // Add the logic here, e.g., an API call to record the reaction
    console.log(`Reacting with ${reactionType} to message ${messageId}`);
    }

 const handleAddComment = (messageId, commentText) => {
    // 1. Logic to submit the comment to a backend API
    // 2. Logic to update the local state with the new comment
    console.log(`Adding comment: "${commentText}" to message ${messageId}`);

    }


  const handleOptimisticUpdate = (type, data, xpEarned) => {
    const user = MOCK_MEMBERS[2];
    const timestamp = new Date();
    const newId = `msg_${Date.now()}`;

    const baseMessage = { id: newId, user, reactions: {}, comments: [], timestamp };

    let newMessage;
    switch (type) {
      case 'practice':
        newMessage = { ...baseMessage, type: 'ACTION', action: { ...data, category: data.skill, xpEarned, difficulty: data.difficulty.toUpperCase(), duration: parseInt(data.duration) || 10 } };
        break;
      case 'reflection':
        newMessage = { ...baseMessage, type: 'REFLECTION', reflection: { ...data, xpEarned: 30 } };
        break;
      case 'win':
        newMessage = { ...baseMessage, type: 'WIN', win: { ...data, xpEarned: 150 } };
        break;
      case 'question':
        newMessage = { ...baseMessage, type: 'QUESTION', question: data };
        break;
      case 'challenge':
        newMessage = { ...baseMessage, type: 'CHALLENGE_COMPLETE', challenge: { ...data, badge: '🎯 Consistency Champion', xpEarned: 100 } };
        break;
      default:
        return;
    }

    // Optimistic Update
    setMessages(prev => [...prev, { ...newMessage, isOptimistic: true }]);
    setShowActionModal(false);
    setSelectedActionType(null);

    // Simulate Server Response / Confirmation
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newId ? { ...msg, isOptimistic: false } : msg));
      // In a real app, this is where you'd clear forms and confirm the successful state.
    }, 1000);
  };

  // Submission Handlers
  const handleSubmitPractice = useCallback(() => {
    if (!practiceData.story.trim() || !practiceData.insights.trim()) return alert('Please fill in all required fields');
    const xpEarned = parseInt(practiceData.duration) * (practiceData.difficulty === 'Hard' ? 5 : practiceData.difficulty === 'Medium' ? 3 : 2);
    handleOptimisticUpdate('practice', practiceData, xpEarned);
    setPracticeData({ skill: 'Eye Contact', story: '', duration: 10, difficulty: 'Medium', insights: '' });
  }, [practiceData]);

  const handleSubmitReflection = useCallback(() => {
    if (!reflectionData.lesson.trim() || !reflectionData.tomorrow.trim()) return alert('Please fill in all required fields');
    handleOptimisticUpdate('reflection', reflectionData, 30);
    setReflectionData({ mood: '😊', energy: 3, lesson: '', tomorrow: '' });
  }, [reflectionData]);
  
  const handleSubmitWin = useCallback(() => {
    if (!winData.title.trim() || !winData.story.trim()) return alert('Please fill in all required fields');
    handleOptimisticUpdate('win', winData, 150);
    setWinData({ title: '', story: '', before: '', after: '' });
  }, [winData]);

  const handleSubmitQuestion = useCallback(() => {
    if (!questionData.situation.trim() || !questionData.struggle.trim() || !questionData.needHelp.trim()) return alert('Please fill in all required fields');
    handleOptimisticUpdate('question', questionData, 0);
    setQuestionData({ situation: '', struggle: '', tried: '', needHelp: '' });
  }, [questionData]);

  const handleSubmitChallenge = useCallback(() => {
    if (!challengeData.name.trim() || challengeData.days.filter(d => d.action.trim()).length < 1) return alert('Please fill in challenge details.');
    handleOptimisticUpdate('challenge', challengeData, 100);
    setChallengeData({ name: '', days: [{ day: 1, action: '', done: true }], currentDay: 1 });
  }, [challengeData]);


  // Determine which form to show
  const renderActionForm = () => {
    switch (selectedActionType?.id) {
      case 'practice':
        return <PracticeForm data={practiceData} setData={setPracticeData} onSubmit={handleSubmitPractice} />;
      case 'reflection':
        return <ReflectionForm data={reflectionData} setData={setReflectionData} onSubmit={handleSubmitReflection} />;
      case 'win':
        return <WinForm data={winData} setData={setWinData} onSubmit={handleSubmitWin} />;
      case 'question':
        return <QuestionForm data={questionData} setData={setQuestionData} onSubmit={handleSubmitQuestion} />;
      case 'challenge':
        return <ChallengeForm data={challengeData} setData={setChallengeData} onSubmit={handleSubmitChallenge} />;
      default:
        return <p className="text-center text-purple-400">Select an action type to log your progress.</p>;
    }
  };

// Main Render
return (
  <div className="h-screen flex flex-col overflow-y-auto bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white lg:grid lg:grid-cols-[1fr_3fr_1fr] xl:grid-cols-[1fr_4fr_1fr]">

    {/* 1. Desktop Left Column (Navigation / Groups) */}
    <div className="hidden lg:block bg-purple-950/70 border-r border-purple-700/50 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Menu size={20} className="text-indigo-400" />
        Groups
      </h2>
      <div className="space-y-2">
        <div className="p-3 bg-indigo-700/50 rounded-xl font-bold flex items-center gap-3 cursor-pointer">
          <div className="text-2xl">{MOCK_GROUP.icon}</div>
          <span className="truncate">{MOCK_GROUP.name}</span>
        </div>
        <div className="p-3 text-purple-300 hover:bg-purple-800/50 rounded-xl cursor-pointer flex items-center gap-3">
          <Users size={20} />
          Other Groups (4)
        </div>
      </div>
    </div>

    {/* 2. Main Feed & Header (Center Column) */}
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <header className="flex-shrink-0 z-50 bg-gradient-to-r from-purple-800/95 to-indigo-800/95 backdrop-blur-md border-b border-purple-700/50 sticky top-0">
        <div className="flex items-center justify-between p-4 min-h-[60px]">
          <div className="flex items-center gap-3">
            <IconButton onClick={() => navigate('/')} className="lg:hidden" title="Go Back">
              <ArrowLeft size={24} />
            </IconButton>
            
            <div className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <div className="text-3xl">{MOCK_GROUP.icon}</div>
                <h1 className="font-bold text-xl">{MOCK_GROUP.name}</h1>
                <ChevronDown size={16} className="text-purple-400" />
              </div>
              <p className="text-xs text-purple-400 pl-10">
                {MOCK_GROUP.members} Members • {MOCK_GROUP.activeNow} Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <IconButton title="Search">
              <Search size={20} />
            </IconButton>
            <IconButton onClick={() => setShowMemberSidebar(!showMemberSidebar)} className="lg:hidden" title="Toggle Members">
              <Users size={20} />
            </IconButton>
            <IconButton className="hidden lg:block" title="Notifications">
              <Bell size={20} />
            </IconButton>
            <IconButton title="More Options">
              <MoreVertical size={20} />
            </IconButton>
          </div>
        </div>
      </header>
      
      {/* Sticky Date Separator */}
      {stickyDate && (
        <div className="sticky top-[60px] z-30 p-2 text-center bg-purple-950/90 border-b border-purple-700/50 backdrop-blur-sm shadow-lg text-sm font-semibold text-purple-200 transition-opacity duration-300">
          {stickyDate}
        </div>
      )}

      {/* Message Feed */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 safe-messages-padding lg:pb-6">
        <div className="pt-2"></div>

        {loading ? (
          [...Array(5)].map((_, i) => <MessageSkeleton key={i} />)
        ) : messages.length === 0 ? (
          <EmptyState onOpenModal={() => handleOpenActionModal(ACTION_TYPES[0])} />
        ) : (
          groupedMessages.map((item, index) => {
            if (item.type === 'DATE_SEPARATOR') {
              return (
                <div key={index} data-date={item.label} className="message-date-separator sticky top-[100px] z-20 w-full text-center my-4">
                  <span className="inline-block px-4 py-1 bg-purple-950/90 border border-purple-700/50 rounded-full text-xs font-bold text-purple-300 shadow-lg">
                    {item.label}
                  </span>
                </div>
              );
            }

            const animationClass = item.isOptimistic ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : '';

            return (
              <div key={item.id} className={animationClass}>
                <MessageBubble
                  message={item}
                  isCurrentUser={item.user?.id === 'u3'}
                  onReact={handleReaction}
                  showReactionPicker={showReactionPicker}
                  setShowReactionPicker={setShowReactionPicker}
                  onAddComment={handleAddComment}
                  newComment={newComment}
                  setNewComment={setNewComment}
                />
                {item.isOptimistic && (
                  <div className={`flex items-center gap-2 text-xs font-semibold text-yellow-400 ${item.user?.id === 'u3' ? 'justify-end mr-6' : 'justify-start ml-6'} mt-[-10px] mb-4`}>
                    <Loader2 size={12} className="animate-spin" /> Sending...
                  </div>
                )}
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} className="safe-area-padding-bottom h-4"></div>
      </div>

      {/* Footer Action Bar with Floating Menu */}
      <footer className="fixed bottom-0 left-0 right-0 lg:relative z-50 safe-area-bottom bg-purple-900/90 backdrop-blur-md border-t border-purple-700/50 pb-4">

        <div className="px-4 pt-4 relative">
          <div className="flex justify-around max-w-2xl mx-auto relative">
            {ACTION_TYPES.slice(0, 4).map(action => (
              <ActionButton key={action.id} {...action} onClick={() => handleOpenActionModal(action)} />
            ))}

            {/* Main "+" button */}
            <button
              onClick={() => setShowFloatingActions(!showFloatingActions)}
              className="bg-indigo-500 p-4 rounded-full shadow-lg text-white text-2xl relative z-10"
            >
              +
            </button>

            {/* Floating Options */}
            {showFloatingActions && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-3">
                {ACTION_TYPES.slice(4).map(action => (
                  <ActionButton
                    key={action.id}
                    {...action}
                    onClick={() => {
                      handleOpenActionModal(action);
                      setShowFloatingActions(false);
                    }}
                    className="bg-purple-700/80 shadow-lg scale-100 animate-pop-in"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>

    {/* 3. Member Sidebar */}
    <div className="hidden lg:block overflow-y-auto">
      <MemberSidebar members={MOCK_MEMBERS} isMobile={false} />
    </div>

    {/* Mobile Sidebar Modal */}
    {isMobile && showMemberSidebar && (
      <div className="fixed inset-0 z-[50] bg-black/50" onClick={() => setShowMemberSidebar(false)}>
        <div onClick={(e) => e.stopPropagation()} className={`h-full max-h-screen w-4/5 ml-auto bg-purple-950/95 border-l border-purple-700/50 overflow-y-auto transition-transform duration-300 ${showMemberSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
          <MemberSidebar members={MOCK_MEMBERS} isMobile={true} onClose={() => setShowMemberSidebar(false)} />
        </div>
      </div>
    )}

    {/* Action Modal */}
    <Modal
      isOpen={showActionModal}
      onClose={() => { setShowActionModal(false); setSelectedActionType(null); }}
      title={selectedActionType ? selectedActionType.label : 'Log an Action'}
      isMobile={isMobile}
    >
      {selectedActionType ? (
        renderActionForm()
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ACTION_TYPES.map(action => (
            <ActionButton key={action.id} {...action} onClick={() => handleOpenActionModal(action)} />
          ))}
        </div>
      )}
    </Modal>
  </div>
);

}
