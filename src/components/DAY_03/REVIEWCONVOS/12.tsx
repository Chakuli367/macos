import React, { useState, useMemo } from 'react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { MessageCircle, Clock, MapPin, Star, TrendingUp, Lightbulb, AlertCircle, CheckCircle, Plus, Trash2, Edit3, BarChart3, Brain, PlayCircle, X, ChevronDown, ChevronUp, Sparkles, Target, Zap } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Conversation {
  id: string;
  person: string;
  location: string;
  duration: number; // in minutes
  quality: number; // 1-5
  whatWorked: string[];
  whatAwkward: string[];
  timestamp: number;
  notes: string;
}

interface Pattern {
  type: 'strength' | 'weakness';
  description: string;
  frequency: number;
  suggestion: string;
}

interface PlaybackMessage {
  speaker: 'you' | 'them';
  message: string;
  alternative?: string;
  aiSuggestion?: string;
}

interface REVIEWCONVProps {
    onNext?: () => void;
}

// ============================================================================
// MOCK DATA & UTILITIES
// ============================================================================

const COMMON_WORKED_ITEMS = [
  'Made eye contact',
  'Asked open-ended questions',
  'Active listening',
  'Smiled and nodded',
  'Found common ground',
  'Used their name',
  'Showed genuine interest',
  'Shared a personal story',
  'Asked follow-up questions',
  'Maintained good posture'
];

const COMMON_AWKWARD_ITEMS = [
  'Long awkward silence',
  'Ran out of topics',
  'Interrupted them',
  'Didn\'t know how to exit',
  'Talked too much about myself',
  'Struggled with eye contact',
  'Nervous body language',
  'Forgot their name',
  'Topic fell flat',
  'Felt judged'
];

const LOCATIONS = ['Office', 'Coffee Shop', 'Gym', 'Restaurant', 'Home', 'Park', 'Event', 'Online', 'Store', 'Custom'];

const analyzePatterns = (conversations: Conversation[]): Pattern[] => {
  if (conversations.length === 0) return [];

  const patterns: Pattern[] = [];
  
  // Analyze what worked
  const workedItems: { [key: string]: number } = {};
  conversations.forEach(conv => {
    conv.whatWorked.forEach(item => {
      workedItems[item] = (workedItems[item] || 0) + 1;
    });
  });

  const topStrength = Object.entries(workedItems).sort((a, b) => b[1] - a[1])[0];
  if (topStrength && topStrength[1] >= 2) {
    patterns.push({
      type: 'strength',
      description: `You consistently excel at: ${topStrength[0]}`,
      frequency: topStrength[1],
      suggestion: 'Keep leveraging this strength in future conversations!'
    });
  }

  // Analyze awkward moments
  const awkwardItems: { [key: string]: number } = {};
  conversations.forEach(conv => {
    conv.whatAwkward.forEach(item => {
      awkwardItems[item] = (awkwardItems[item] || 0) + 1;
    });
  });

  const topWeakness = Object.entries(awkwardItems).sort((a, b) => b[1] - a[1])[0];
  if (topWeakness && topWeakness[1] >= 2) {
    patterns.push({
      type: 'weakness',
      description: `Common struggle: ${topWeakness[0]}`,
      frequency: topWeakness[1],
      suggestion: 'Practice "Conversation Flow" exercises to improve this area'
    });
  }

  // Quality trend analysis
  if (conversations.length >= 3) {
    const recentAvg = conversations.slice(0, 3).reduce((sum, c) => sum + c.quality, 0) / 3;
    const olderAvg = conversations.slice(3).reduce((sum, c) => sum + c.quality, 0) / conversations.slice(3).length;
    
    if (recentAvg > olderAvg + 0.5) {
      patterns.push({
        type: 'strength',
        description: 'Your conversation quality is improving!',
        frequency: conversations.length,
        suggestion: 'You\'re on the right track. Keep practicing!'
      });
    } else if (recentAvg < olderAvg - 0.5) {
      patterns.push({
        type: 'weakness',
        description: 'Recent conversations have been challenging',
        frequency: conversations.length,
        suggestion: 'Consider reviewing what worked in past successful conversations'
      });
    }
  }

  return patterns;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function REVIEWCONV({ onNext }: REVIEWCONVProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPatterns, setShowPatterns] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [playbackConv, setPlaybackConv] = useState<string | null>(null);
  const [playbackMessages, setPlaybackMessages] = useState<PlaybackMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newSpeaker, setNewSpeaker] = useState<'you' | 'them'>('you');
  
  // Form state
  const [formData, setFormData] = useState({
    person: '',
    location: 'Coffee Shop',
    customLocation: '',
    duration: 5,
    quality: 3,
    whatWorked: [] as string[],
    whatAwkward: [] as string[],
    customWorked: '',
    customAwkward: '',
    notes: ''
  });

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const patterns = useMemo(() => analyzePatterns(conversations), [conversations]);
  
  const stats = useMemo(() => {
    if (conversations.length === 0) return { avgQuality: 0, totalTime: 0, totalConvs: 0 };
    
    const avgQuality = conversations.reduce((sum, c) => sum + c.quality, 0) / conversations.length;
    const totalTime = conversations.reduce((sum, c) => sum + c.duration, 0);
    
    return {
      avgQuality: avgQuality.toFixed(1),
      totalTime,
      totalConvs: conversations.length
    };
  }, [conversations]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAddConversation = () => {
    if (!formData.person.trim()) return;

    const finalLocation = formData.location === 'Custom' && formData.customLocation.trim() 
      ? formData.customLocation 
      : formData.location;

    const newConv: Conversation = {
      id: Date.now().toString(),
      person: formData.person,
      location: finalLocation,
      duration: formData.duration,
      quality: formData.quality,
      whatWorked: formData.whatWorked,
      whatAwkward: formData.whatAwkward,
      notes: formData.notes,
      timestamp: Date.now()
    };

    setConversations([newConv, ...conversations]);
    resetForm();
    setIsAddingNew(false);
  };

  const resetForm = () => {
    setFormData({
      person: '',
      location: 'Coffee Shop',
      customLocation: '',
      duration: 5,
      quality: 3,
      whatWorked: [],
      whatAwkward: [],
      customWorked: '',
      customAwkward: '',
      notes: ''
    });
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id));
  };

  const toggleWorkedItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      whatWorked: prev.whatWorked.includes(item)
        ? prev.whatWorked.filter(i => i !== item)
        : [...prev.whatWorked, item]
    }));
  };

  const toggleAwkwardItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      whatAwkward: prev.whatAwkward.includes(item)
        ? prev.whatAwkward.filter(i => i !== item)
        : [...prev.whatAwkward, item]
    }));
  };

  const addCustomWorked = () => {
    if (!formData.customWorked.trim()) return;
    setFormData(prev => ({
      ...prev,
      whatWorked: [...prev.whatWorked, prev.customWorked.trim()],
      customWorked: ''
    }));
  };

  const addCustomAwkward = () => {
    if (!formData.customAwkward.trim()) return;
    setFormData(prev => ({
      ...prev,
      whatAwkward: [...prev.whatAwkward, prev.customAwkward.trim()],
      customAwkward: ''
    }));
  };

  const removeWorkedItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      whatWorked: prev.whatWorked.filter(i => i !== item)
    }));
  };

  const removeAwkwardItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      whatAwkward: prev.whatAwkward.filter(i => i !== item)
    }));
  };

  const startPlayback = (convId: string) => {
    setPlaybackConv(convId);
    setPlaybackMessages([]);
  };

  const addPlaybackMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: PlaybackMessage = {
      speaker: newSpeaker,
      message: newMessage
    };

    // Add AI suggestion for user messages
    if (newSpeaker === 'you') {
      const suggestions = [
        'Try asking a follow-up question to show interest',
        'Consider sharing a related personal experience',
        'Good! This shows active listening',
        'You could transition to a new topic here',
        'Try using their name to build rapport'
      ];
      newMsg.aiSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    setPlaybackMessages([...playbackMessages, newMsg]);
    setNewMessage('');
    setNewSpeaker('them');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">Conversation Analysis</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Log & Analyze Conversations
          </h1>
          <p className="text-base md:text-lg text-purple-200">
            Track your daily interactions and discover patterns in your social skills, log here to analyze your conversations if you have already had a conversation
          </p>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-purple-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">Avg Quality</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.avgQuality}/5</p>
          </div>

          <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-pink-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">Total Time</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalTime}m</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-indigo-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-purple-300 text-xs md:text-sm font-medium">Conversations</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalConvs}</p>
          </div>
        </div>

        {/* AI PATTERN DETECTION */}
        {patterns.length > 0 && (
          <div className="mb-6 md:mb-8">
            <button
              onClick={() => setShowPatterns(!showPatterns)}
              className="w-full flex items-center justify-between p-4 md:p-5 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all shadow-2xl mb-4"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-purple-100">AI Pattern Detection</h2>
                <span className="text-xs md:text-sm text-purple-400 font-medium">({patterns.length} insights)</span>
              </div>
              {showPatterns ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
            </button>

            {showPatterns && (
              <div className="space-y-3 md:space-y-4">
                {patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className={`bg-gradient-to-br backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 shadow-xl ${
                      pattern.type === 'strength'
                        ? 'from-green-900/40 to-emerald-900/40 border-green-500/30'
                        : 'from-orange-900/40 to-red-900/40 border-orange-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      {pattern.type === 'strength' ? (
                        <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-orange-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-base md:text-lg mb-2">{pattern.description}</h3>
                        <p className="text-sm md:text-base text-purple-200 mb-3">
                          Detected in {pattern.frequency} conversation{pattern.frequency > 1 ? 's' : ''}
                        </p>
                        <div className="flex items-start gap-2 p-3 bg-purple-950/40 rounded-xl border border-purple-500/20">
                          <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-purple-100">{pattern.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD NEW CONVERSATION */}
        <div className="mb-6 md:mb-8">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full p-5 md:p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-3xl font-bold text-base md:text-lg transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6 md:w-7 md:h-7" />
              Log New Conversation
            </button>
          ) : (
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-5 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-5 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Plus className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-purple-100">New Conversation</h2>
                </div>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-purple-400" />
                </button>
              </div>

              <div className="space-y-4 md:space-y-5">
                {/* Person & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Person's Name</label>
                    <input
                      type="text"
                      value={formData.person}
                      onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                      placeholder="e.g., Sarah, John, Barista"
                      className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    >
                      {LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    {formData.location === 'Custom' && (
                      <input
                        type="text"
                        value={formData.customLocation}
                        onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                        placeholder="Enter custom location..."
                        className="w-full px-4 py-3 mt-2 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      />
                    )}
                  </div>
                </div>

                {/* Duration & Quality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-3">
                      Duration: <span className="text-white font-bold">{formData.duration}</span> minutes
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #a78bfa 0%, #a78bfa ${(formData.duration / 120) * 100}%, rgba(88, 28, 135, 0.5) ${(formData.duration / 120) * 100}%, rgba(88, 28, 135, 0.5) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-purple-400 mt-1">
                      <span>1m</span>
                      <span>120m</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-3">Interaction Quality</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setFormData({ ...formData, quality: rating })}
                          className="flex-1 transition-transform active:scale-90"
                        >
                          <Star
                            className={`w-8 h-8 md:w-10 md:h-10 ${
                              rating <= formData.quality
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-purple-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* What Worked */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-3">What Worked</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_WORKED_ITEMS.map(item => (
                      <button
                        key={item}
                        onClick={() => toggleWorkedItem(item)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.whatWorked.includes(item)
                            ? 'bg-green-600 text-white border-2 border-green-400'
                            : 'bg-purple-950/50 text-purple-300 border-2 border-purple-700/30 hover:border-purple-600/50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Worked Items */}
                  {formData.whatWorked.filter(item => !COMMON_WORKED_ITEMS.includes(item)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.whatWorked.filter(item => !COMMON_WORKED_ITEMS.includes(item)).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white border-2 border-green-400 rounded-xl text-sm font-medium"
                        >
                          <span>{item}</span>
                          <button
                            onClick={() => removeWorkedItem(item)}
                            className="hover:bg-green-700 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.customWorked}
                      onChange={(e) => setFormData({ ...formData, customWorked: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomWorked()}
                      placeholder="Add custom item..."
                      className="flex-1 px-4 py-2 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                    <button
                      onClick={addCustomWorked}
                      disabled={!formData.customWorked.trim()}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* What Felt Awkward */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-3">What Felt Awkward</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_AWKWARD_ITEMS.map(item => (
                      <button
                        key={item}
                        onClick={() => toggleAwkwardItem(item)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.whatAwkward.includes(item)
                            ? 'bg-orange-600 text-white border-2 border-orange-400'
                            : 'bg-purple-950/50 text-purple-300 border-2 border-purple-700/30 hover:border-purple-600/50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* Custom Awkward Items */}
                  {formData.whatAwkward.filter(item => !COMMON_AWKWARD_ITEMS.includes(item)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.whatAwkward.filter(item => !COMMON_AWKWARD_ITEMS.includes(item)).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white border-2 border-orange-400 rounded-xl text-sm font-medium"
                        >
                          <span>{item}</span>
                          <button
                            onClick={() => removeAwkwardItem(item)}
                            className="hover:bg-orange-700 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.customAwkward}
                      onChange={(e) => setFormData({ ...formData, customAwkward: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomAwkward()}
                      placeholder="Add custom item..."
                      className="flex-1 px-4 py-2 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                    <button
                      onClick={addCustomAwkward}
                      disabled={!formData.customAwkward.trim()}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any other observations or context..."
                    className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAddConversation}
                  disabled={!formData.person.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Save Conversation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONVERSATION HISTORY */}
        {conversations.length > 0 && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl md:text-2xl font-bold text-purple-100">Conversation History</h2>
            </div>

            {conversations.map(conv => (
              <div key={conv.id} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-bold text-white">{conv.person}</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= conv.quality
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-purple-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-purple-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {conv.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {conv.duration} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <div style={{ border: "1px solid gray", padding: "20px" }}>
  <p>📅 Calendar placeholder</p>
</div>

                        {new Date(conv.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startPlayback(conv.id)}
                      className="p-2 md:p-2.5 bg-purple-800/40 hover:bg-purple-700/40 rounded-xl border border-purple-500/30 transition-all"
                      title="Replay & Analyze"
                    >
                      <PlayCircle className="w-5 h-5 text-purple-400" />
                    </button>
                    <button
                      onClick={() => deleteConversation(conv.id)}
                      className="p-2 md:p-2.5 hover:bg-red-900/50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* What Worked */}
                {conv.whatWorked.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="font-bold text-green-300 text-sm">What Worked</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {conv.whatWorked.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg text-sm text-green-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* What Felt Awkward */}
                {conv.whatAwkward.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <h4 className="font-bold text-orange-300 text-sm">What Felt Awkward</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {conv.whatAwkward.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-900/30 border border-orange-500/30 rounded-lg text-sm text-orange-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {conv.notes && (
                  <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
                    <p className="text-sm text-purple-200">{conv.notes}</p>
                  </div>
                )}

                {/* PLAYBACK SIMULATION */}
                {playbackConv === conv.id && (
                  <div className="mt-6 p-5 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border-2 border-indigo-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <PlayCircle className="w-6 h-6 text-indigo-400" />
                      <h4 className="text-lg font-bold text-white">Conversation Playback & Analysis</h4>
                    </div>

                    {/* Messages */}
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {playbackMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${msg.speaker === 'you' ? 'ml-auto' : 'mr-auto'}`}>
                            <div className={`p-4 rounded-2xl ${
                              msg.speaker === 'you'
                                ? 'bg-purple-600/40 border border-purple-400/30'
                                : 'bg-indigo-800/40 border border-indigo-500/30'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-purple-200">
                                  {msg.speaker === 'you' ? 'You' : conv.person}
                                </span>
                              </div>
                              <p className="text-sm text-white">{msg.message}</p>
                            </div>
                            
                            {msg.aiSuggestion && (
                              <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-xl flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-yellow-300 mb-1">AI Suggestion</p>
                                  <p className="text-xs text-yellow-100">{msg.aiSuggestion}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {playbackMessages.length === 0 && (
                        <div className="text-center py-8 text-purple-400">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">Start reconstructing the conversation...</p>
                        </div>
                      )}
                    </div>

                    {/* Add Message Input */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setNewSpeaker('you')}
                          className={`flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            newSpeaker === 'you'
                              ? 'bg-purple-600 text-white border-2 border-purple-400'
                              : 'bg-purple-950/50 text-purple-300 border-2 border-purple-700/30'
                          }`}
                        >
                          You Said
                        </button>
                        <button
                          onClick={() => setNewSpeaker('them')}
                          className={`flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            newSpeaker === 'them'
                              ? 'bg-indigo-600 text-white border-2 border-indigo-400'
                              : 'bg-purple-950/50 text-purple-300 border-2 border-purple-700/30'
                          }`}
                        >
                          They Said
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addPlaybackMessage()}
                          placeholder={`What did ${newSpeaker === 'you' ? 'you' : conv.person} say?`}
                          className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        />
                        <button
                          onClick={addPlaybackMessage}
                          disabled={!newMessage.trim()}
                          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setPlaybackConv(null);
                          setPlaybackMessages([]);
                          setNewMessage('');
                        }}
                        className="w-full px-4 py-3 bg-purple-950/30 rounded-xl border-2 border-purple-500/20 hover:border-purple-400/50 transition-all text-purple-300 text-sm font-medium"
                      >
                        Close Playback
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {conversations.length === 0 && !isAddingNew && (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-12 md:p-16 rounded-3xl border-2 border-purple-500/30 text-center">
            <MessageCircle className="w-20 h-20 text-purple-500/50 mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-purple-100 mb-3">No Conversations Yet</h3>
            <p className="text-purple-300 mb-6 max-w-md mx-auto">
              Start logging your daily interactions to unlock AI-powered insights and improve your social skills!
            </p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl inline-flex items-center gap-3"
            >
              <Plus className="w-6 h-6" />
              Log Your First Conversation
            </button>
          </div>
        )}

        {/* FOOTER TIPS */}
        <div className="mt-12 p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-3xl border-2 border-purple-500/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-purple-100 text-lg mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-sm text-purple-300">
                <li>• Log conversations within 24 hours for best accuracy</li>
                <li>• Be honest about awkward moments - they're growth opportunities!</li>
                <li>• Use the playback feature to practice better responses</li>
                <li>• Review AI patterns weekly to track your progress</li>
              </ul>
            </div>
          </div>

          {/* 💥 ADD THIS NAVIGATION BUTTON */}
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

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        button, a, input, select, textarea {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        button {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(124, 58, 237, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.7);
        }

        /* Range input styling */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
          height: 8px;
        }

        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -8px;
          box-shadow: 0 2px 8px rgba(167, 139, 250, 0.5);
          border: 3px solid white;
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }

        input[type="range"]::-moz-range-thumb {
          background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
          height: 24px;
          width: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(167, 139, 250, 0.5);
        }

        input[type="range"]:focus {
          outline: none;
        }

        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3);
        }
      `}</style>
    </div>
  );
}