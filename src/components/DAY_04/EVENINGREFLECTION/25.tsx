import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, Users, Zap, Moon, CheckCircle, TrendingUp, 
  Sparkles, Flame, Trophy, Calendar, Clock, ArrowRight,
  MessageCircle, Star, Plus, Minus, ChevronRight, Award,
  Brain, Heart, Shield, Coffee, Lightbulb, Smile, Meh, Frown
} from 'lucide-react';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONVERSATION_TYPES = [
  { id: 'small-talk', label: 'Small Talk', icon: '💬', xp: 10, color: 'from-blue-500 to-cyan-500' },
  { id: 'deep-conv', label: 'Deep Conversation', icon: '🧠', xp: 25, color: 'from-purple-500 to-pink-500' },
  { id: 'networking', label: 'Networking', icon: '🤝', xp: 20, color: 'from-green-500 to-emerald-500' },
  { id: 'public-speak', label: 'Public Speaking', icon: '🎤', xp: 50, color: 'from-orange-500 to-red-500' },
  { id: 'conflict-res', label: 'Conflict Resolution', icon: '⚖️', xp: 40, color: 'from-yellow-500 to-orange-500' },
  { id: 'group-activity', label: 'Group Activity', icon: '👥', xp: 30, color: 'from-indigo-500 to-purple-500' },
];

const SKILLS_FOCUS = [
  { id: 'active-listen', label: 'Active Listening', icon: '👂', category: 'Communication' },
  { id: 'body-language', label: 'Body Language', icon: '🕺', category: 'Presence' },
  { id: 'confidence', label: 'Confidence', icon: '💪', category: 'Mindset' },
  { id: 'empathy', label: 'Empathy', icon: '❤️', category: 'Connection' },
  { id: 'storytelling', label: 'Storytelling', icon: '📖', category: 'Communication' },
  { id: 'humor', label: 'Humor', icon: '😄', category: 'Engagement' },
  { id: 'questions', label: 'Asking Questions', icon: '❓', category: 'Communication' },
  { id: 'boundaries', label: 'Setting Boundaries', icon: '🛡️', category: 'Self-Care' },
];

const MOOD_OPTIONS = [
  { id: 'amazing', label: 'Amazing', icon: '🤩', color: 'from-green-500 to-emerald-500' },
  { id: 'good', label: 'Good', icon: '😊', color: 'from-blue-500 to-cyan-500' },
  { id: 'okay', label: 'Okay', icon: '😐', color: 'from-yellow-500 to-orange-500' },
  { id: 'challenging', label: 'Challenging', icon: '😰', color: 'from-orange-500 to-red-500' },
];

const MOTIVATIONAL_QUOTES = [
  "Tomorrow's success starts with tonight's commitment.",
  "Small steps today, giant leaps tomorrow.",
  "Your future self will thank you for this commitment.",
  "Consistency is the bridge between goals and accomplishment.",
  "Every conversation is an opportunity to grow.",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const COMMITDAY4: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Day 3 Reflection
  const [day3Rating, setDay3Rating] = useState(0);
  const [day3Mood, setDay3Mood] = useState('');
  const [day3Learnings, setDay3Learnings] = useState('');
  const [day3Wins, setDay3Wins] = useState(['', '', '']);
  
  // Day 4 Commitments
  const [peopleCount, setPeopleCount] = useState(3);
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState('');
  
  // UI State
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const totalXP = useMemo(() => {
    return selectedConversations.reduce((sum, convId) => {
      const conv = CONVERSATION_TYPES.find(c => c.id === convId);
      return sum + (conv?.xp || 0);
    }, 0) * peopleCount;
  }, [selectedConversations, peopleCount]);

  const completionPercentage = useMemo(() => {
    let completed = 0;
    let total = 7;
    
    if (day3Rating > 0) completed++;
    if (day3Mood) completed++;
    if (day3Learnings.trim().length > 10) completed++;
    if (day3Wins.filter(w => w.trim().length > 0).length >= 2) completed++;
    if (peopleCount > 0) completed++;
    if (selectedConversations.length > 0) completed++;
    if (selectedSkills.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  }, [day3Rating, day3Mood, day3Learnings, day3Wins, peopleCount, selectedConversations, selectedSkills]);

 // Replace the complex validation logic with this:
const isValid = true;

  const difficultyLevel = useMemo(() => {
    const score = peopleCount * 10 + selectedConversations.length * 5 + selectedSkills.length * 3;
    if (score < 30) return { label: 'Beginner', color: 'from-green-500 to-emerald-500', icon: '🌱' };
    if (score < 60) return { label: 'Intermediate', color: 'from-blue-500 to-cyan-500', icon: '🔥' };
    if (score < 90) return { label: 'Advanced', color: 'from-purple-500 to-pink-500', icon: '⚡' };
    return { label: 'Expert', color: 'from-orange-500 to-red-500', icon: '💎' };
  }, [peopleCount, selectedConversations, selectedSkills]);

  const bedtimeRecommendation = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 22 || hour < 6) return { message: 'Perfect time to commit and sleep! 🌙', color: 'text-green-400' };
    if (hour >= 20) return { message: 'Great timing! Wind down soon. 🌆', color: 'text-blue-400' };
    return { message: 'Early planner! Set a bedtime reminder. ⏰', color: 'text-yellow-400' };
  }, [currentTime]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const toggleConversation = (id: string) => {
    setSelectedConversations(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const updateWin = (index: number, value: string) => {
    const newWins = [...day3Wins];
    newWins[index] = value;
    setDay3Wins(newWins);
  };

  const handleFinish = () => {
    if (!isValid) {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }
    
    setShowConfetti(true);
    setTimeout(() => {
      const commitmentData = {
        day3Reflection: {
          rating: day3Rating,
          mood: day3Mood,
          learnings: day3Learnings,
          wins: day3Wins.filter(w => w.trim().length > 0),
          timestamp: Date.now(),
        },
        day4Commitments: {
          peopleCount,
          conversationTypes: selectedConversations,
          skillsFocus: selectedSkills,
          customNotes,
          expectedXP: totalXP,
          difficulty: difficultyLevel.label,
          createdAt: Date.now(),
        }
      };
      
      // Pass data to parent
      onNext();
    }, 2000);
  };

  const applyRecommendedPreset = () => {
    setPeopleCount(3);
    setSelectedConversations(['small-talk', 'networking']);
    setSelectedSkills(['active-listen', 'confidence', 'questions']);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER WITH PROGRESS */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Moon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs md:text-sm px-3 py-1 bg-purple-800/50 rounded-full border border-purple-500/30 font-medium">
                    Day 3 → 4
                  </span>
                  <span className="text-xs md:text-sm px-3 py-1 bg-green-800/50 rounded-full border border-green-500/30 font-medium">
                    {completionPercentage}% Complete
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
                  Commit & Prepare for Tomorrow
                </h1>
              </div>
            </div>
            
            {/* Time Display */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-xl border border-purple-500/30">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-mono text-purple-200">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500 shadow-lg"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          {/* Quote */}
          <p className="text-center text-purple-300 italic mt-4 text-sm md:text-base">"{quote}"</p>
        </div>

        {/* DAY 3 REFLECTION SECTION */}
        <div className="mb-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-purple-100">Day 3 Reflection</h2>
          </div>

          {/* Rating System */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-300 mb-3">How was Day 3?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setDay3Rating(rating)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    day3Rating >= rating
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-400 scale-105'
                      : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <Star className={`w-6 h-6 mx-auto ${day3Rating >= rating ? 'fill-white text-white' : 'text-purple-500'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-300 mb-3">Your mood today?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setDay3Mood(mood.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    day3Mood === mood.id
                      ? `bg-gradient-to-br ${mood.color} border-white/50 scale-105`
                      : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.icon}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Learnings */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Key learnings from Day 3 <span className="text-purple-500">({day3Learnings.length}/500)</span>
            </label>
            <textarea
              value={day3Learnings}
              onChange={(e) => setDay3Learnings(e.target.value.slice(0, 500))}
              placeholder="What did you learn about yourself today? What surprised you? What would you do differently?"
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
              rows={4}
            />
          </div>

          {/* Wins Tracker */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3">3 Wins from Today 🏆</label>
            <div className="space-y-3">
              {day3Wins.map((win, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-700/50 rounded-full flex items-center justify-center border border-purple-500/30">
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={win}
                    onChange={(e) => updateWin(idx, e.target.value)}
                    placeholder={`Win #${idx + 1}`}
                    className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                  {win.trim().length > 0 && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DAY 4 COMMITMENTS SECTION */}
        <div className="mb-8 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-purple-100">Tomorrow's Commitments</h2>
            </div>
            <button
              onClick={applyRecommendedPreset}
              className="text-xs md:text-sm px-4 py-2 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg border border-purple-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Recommended
            </button>
          </div>

          {/* People Counter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Number of people to approach
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                className="w-12 h-12 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl border-2 border-purple-500/30 flex items-center justify-center transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {peopleCount}
                </div>
                <div className="text-sm text-purple-400 mt-1">people</div>
              </div>
              <button
                onClick={() => setPeopleCount(Math.min(20, peopleCount + 1))}
                className="w-12 h-12 bg-purple-800/50 hover:bg-purple-700/50 rounded-xl border-2 border-purple-500/30 flex items-center justify-center transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Types */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Types of conversations ({selectedConversations.length} selected)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CONVERSATION_TYPES.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => toggleConversation(conv.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedConversations.includes(conv.id)
                      ? `bg-gradient-to-br ${conv.color} border-white/50 scale-105`
                      : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{conv.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{conv.label}</div>
                      <div className="text-xs text-purple-300">+{conv.xp} XP each</div>
                    </div>
                    {selectedConversations.includes(conv.id) && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Focus */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Skills to focus on ({selectedSkills.length} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SKILLS_FOCUS.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedSkills.includes(skill.id)
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 scale-105'
                      : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <div className="text-xs font-medium">{skill.label}</div>
                  <div className="text-xs text-purple-400 mt-1">{skill.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Additional notes or specific goals
            </label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Any specific situations, people, or challenges you want to focus on tomorrow?"
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* COMMITMENT PREVIEW CARD */}
        <div className="mb-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl md:text-2xl font-bold text-purple-100">Commitment Summary</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <Users className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">{peopleCount}</div>
              <div className="text-xs text-purple-300">People</div>
            </div>

            <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <MessageCircle className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">{selectedConversations.length}</div>
              <div className="text-xs text-purple-300">Conv Types</div>
            </div>

            <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <Brain className="w-6 h-6 text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-white">{selectedSkills.length}</div>
              <div className="text-xs text-purple-300">Skills</div>
            </div>

            <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <Zap className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold text-white">{totalXP}</div>
              <div className="text-xs text-purple-300">Est. XP</div>
            </div>
          </div>

          <div className={`p-4 bg-gradient-to-br ${difficultyLevel.color} rounded-xl text-center`}>
            <div className="text-3xl mb-2">{difficultyLevel.icon}</div>
            <div className="text-lg font-bold text-white mb-1">Difficulty: {difficultyLevel.label}</div>
            <div className="text-sm text-white/80">You've got this! 💪</div>
          </div>
        </div>

        {/* SLEEP REMINDER CARD */}
        <div className="mb-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl md:text-2xl font-bold text-purple-100">Rest & Recharge</h2>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-lg font-medium ${bedtimeRecommendation.color}`}>
                {bedtimeRecommendation.message}
              </p>
              <p className="text-sm text-purple-400 mt-1">
                Quality sleep = Better social performance tomorrow
              </p>
            </div>
            <Clock className="w-12 h-12 text-purple-400" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
              <div className="text-xl mb-1">😴</div>
              <div className="text-xs text-purple-300">8h sleep</div>
            </div>
            <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
              <div className="text-xl mb-1">📱</div>
              <div className="text-xs text-purple-300">No screens</div>
            </div>
            <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
              <div className="text-xl mb-1">🧘</div>
              <div className="text-xs text-purple-300">Visualize</div>
            </div>
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div className="flex gap-4">
        <button
    onClick={handleFinish}
    
    // REMOVED conditional logic and replaced with the PERMANENTLY ACTIVE style
    className={`flex-1 px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:scale-105`}
  >
    {/* REMOVED conditional content, keeping only the active text and icons */}
    <>
      <CheckCircle className="w-6 h-6" />
      Commit & Sleep Well
      <ArrowRight className="w-6 h-6" />
    </>
</button>
        </div>

        {/* VALIDATION WARNING */}
        {showValidation && !isValid && (
          <div className="mt-4 p-4 bg-red-900/50 border-2 border-red-500/50 rounded-xl animate-shake">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="font-bold text-white">Missing Required Information</p>
                <p className="text-sm text-red-200">Please complete all sections to commit:</p>
                <ul className="text-xs text-red-300 mt-2 space-y-1">
                  {day3Rating === 0 && <li>• Rate your Day 3 experience</li>}
                  {!day3Mood && <li>• Select your mood</li>}
                  {day3Learnings.trim().length < 10 && <li>• Write your key learnings (min 10 chars)</li>}
                  {peopleCount === 0 && <li>• Set number of people to approach</li>}
                  {selectedConversations.length === 0 && <li>• Choose at least one conversation type</li>}
                  {selectedSkills.length === 0 && <li>• Select at least one skill to focus on</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* CONFETTI ANIMATION */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-ping">✨</div>
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS UNLOCKED (if any) */}
        {isValid && (peopleCount >= 5 || selectedSkills.length >= 5) && (
          <div className="mt-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500/50 rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Achievement Unlocked! 🏆</h3>
                <p className="text-sm text-yellow-200">
                  {peopleCount >= 5 && "Ambitious Connector - 5+ people commitment"}
                  {selectedSkills.length >= 5 && peopleCount < 5 && "Skill Master - 5+ skills focus"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 p-3 bg-yellow-950/50 rounded-xl border border-yellow-700/30 text-center">
                <div className="text-2xl mb-1">💎</div>
                <div className="text-xs text-yellow-300">+100 Bonus XP</div>
              </div>
              <div className="flex-1 p-3 bg-yellow-950/50 rounded-xl border border-yellow-700/30 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-xs text-yellow-300">Streak Protected</div>
              </div>
              <div className="flex-1 p-3 bg-yellow-950/50 rounded-xl border border-yellow-700/30 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-xs text-yellow-300">Premium Badge</div>
              </div>
            </div>
          </div>
        )}

        {/* MOTIVATIONAL FOOTER */}
        <div className="mt-8 text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <p className="text-purple-300 text-sm">
              {isValid 
                ? "You're all set! Get some rest and crush Day 4 tomorrow! 💪" 
                : "Fill in all sections to unlock your commitment"
              }
            </p>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          
          {isValid && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-purple-300">You've got this! Tomorrow is going to be amazing.</span>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM STYLES */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Better touch targets for mobile */
        button, input, textarea {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(88, 28, 135, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.8);
        }

        /* Focus styles for accessibility */
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        /* Smooth transitions */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Disable text selection on buttons */
        button {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default COMMITDAY4;