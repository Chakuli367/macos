import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Flame, Target, Users, TrendingUp, Heart, Share2, Bookmark, MessageCircle, Sparkles, Crown, Award, Zap, Eye, Clock, Send, Filter, Search, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const CommunityStories = ({ userId = 'currentUser', userName = 'You', userAvatar = '👤' }) => {
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [activeViewers, setActiveViewers] = useState(3);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [reactionAnimation, setReactionAnimation] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bookmarkedStories, setBookmarkedStories] = useState(new Set());
  const [confetti, setConfetti] = useState([]);
  const progressTimerRef = useRef(null);
  const viewerTimerRef = useRef(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [newStory, setNewStory] = useState({
    action: '',
    description: '',
    details: '',
    category: 'Conversation Starter',
    difficulty: 'Medium',
    duration: '',
    location: '',
    emotion: '',
    anonymousFlag: false
  });

  // Mock data with enhanced fields
  const mockStories = [
    {
      storyID: '1',
      userID: 'user1',
      username: 'Alex Chen',
      avatar: '👤',
      action: 'Sincere Interest Technique',
      description: 'Spoke to 3 strangers today',
      details: 'Asked open-ended questions about their day and listened actively without interrupting. Made genuine eye contact and nodded appropriately.',
      category: 'Conversation Starter',
      difficulty: 'Medium',
      duration: '15 min',
      location: 'Coffee Shop',
      emotion: 'Confident',
      timestamp: Date.now() - 3600000,
      seenBy: [],
      reactions: { fire: 45, clap: 23, heart: 18, wow: 12 },
      comments: [
        { user: 'Jordan M', text: 'This is so inspiring! 🔥', timestamp: Date.now() - 1800000 },
        { user: 'Sam R', text: 'Great technique! Going to try this tomorrow', timestamp: Date.now() - 900000 }
      ],
      anonymousFlag: false,
      streak: 7,
      trending: true,
      views: 234,
      completionRate: 87,
      xpEarned: 50
    },
    {
      storyID: '2',
      userID: null,
      username: 'Anonymous',
      avatar: '🎭',
      action: 'First Cold Approach',
      description: 'Started conversation at coffee shop',
      details: 'Used a simple opener about the book they were reading. Heart was racing but managed to keep calm tone. We talked for 10 minutes!',
      category: 'Cold Approach',
      difficulty: 'Hard',
      duration: '10 min',
      location: 'Local Cafe',
      emotion: 'Nervous but proud',
      timestamp: Date.now() - 7200000,
      seenBy: ['currentUser'],
      reactions: { fire: 89, clap: 67, heart: 45, wow: 34 },
      comments: [
        { user: 'Taylor', text: 'You did it! That\'s huge! 💪', timestamp: Date.now() - 3600000 }
      ],
      anonymousFlag: true,
      streak: 3,
      trending: true,
      views: 456,
      completionRate: 92,
      xpEarned: 100
    },
    {
      storyID: '3',
      userID: 'user3',
      username: 'Jordan Martinez',
      avatar: '👨',
      action: 'Pivot Method Mastery',
      description: 'Networking event - 5 deep connections',
      details: 'Successfully transitioned from small talk to deeper topics using shared interests as bridges. Got 3 business cards and 2 coffee invites!',
      category: 'Networking',
      difficulty: 'Medium',
      duration: '45 min',
      location: 'Tech Meetup',
      emotion: 'Energized',
      timestamp: Date.now() - 10800000,
      seenBy: [],
      reactions: { fire: 56, clap: 43, heart: 28, wow: 19 },
      comments: [],
      anonymousFlag: false,
      streak: 14,
      trending: false,
      views: 189,
      completionRate: 78,
      xpEarned: 75,
      badge: '🏆'
    },
    {
      storyID: '4',
      userID: 'user4',
      username: 'Sam Rivera',
      avatar: '👩',
      action: 'Eye Contact Mastery',
      description: 'Maintained eye contact entire conversation',
      details: 'Practiced the 3-second rule and broke eye contact naturally. Felt more present and connected. The other person commented on my confidence!',
      category: 'Body Language',
      difficulty: 'Easy',
      duration: '10 min',
      location: 'Gym',
      emotion: 'Accomplished',
      timestamp: Date.now() - 14400000,
      seenBy: ['currentUser'],
      reactions: { fire: 72, clap: 58, heart: 41, wow: 22 },
      comments: [
        { user: 'Alex', text: 'Eye contact is so underrated!', timestamp: Date.now() - 7200000 }
      ],
      anonymousFlag: false,
      streak: 21,
      trending: false,
      views: 312,
      completionRate: 85,
      xpEarned: 60,
      badge: '👑'
    },
    {
      storyID: '5',
      userID: 'user5',
      username: 'Taylor Kim',
      avatar: '🧑',
      action: 'Group Conversation Entry',
      description: 'Joined group discussion at party',
      details: 'Waited for natural pause, added value to conversation with relevant story, got positive feedback. Felt like part of the group instantly!',
      category: 'Group Dynamics',
      difficulty: 'Hard',
      duration: '30 min',
      location: 'House Party',
      emotion: 'Thrilled',
      timestamp: Date.now() - 18000000,
      seenBy: [],
      reactions: { fire: 64, clap: 52, heart: 37, wow: 28 },
      comments: [],
      anonymousFlag: false,
      streak: 5,
      trending: true,
      views: 267,
      completionRate: 81,
      xpEarned: 85
    },
    {
      storyID: '6',
      userID: null,
      username: 'Anonymous Warrior',
      avatar: '🎭',
      action: 'Rejection Therapy',
      description: 'Asked for discount, got rejected gracefully',
      details: 'Used Jia Jiang\'s rejection therapy method. Stayed calm, smiled, and thanked them anyway. Felt absolutely liberated!',
      category: 'Comfort Zone',
      difficulty: 'Hard',
      duration: '2 min',
      location: 'Retail Store',
      emotion: 'Liberated',
      timestamp: Date.now() - 21600000,
      seenBy: ['currentUser'],
      reactions: { fire: 123, clap: 98, heart: 76, wow: 54 },
      comments: [
        { user: 'Jordan', text: 'This is the way! 🚀', timestamp: Date.now() - 10800000 },
        { user: 'Alex', text: 'Rejection therapy changed my life', timestamp: Date.now() - 5400000 }
      ],
      anonymousFlag: true,
      streak: 1,
      trending: true,
      views: 589,
      completionRate: 95,
      xpEarned: 150,
      badge: '⚡'
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setStories(mockStories);
    
    // Simulate real-time viewer updates
    viewerTimerRef.current = setInterval(() => {
      setActiveViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);

    return () => {
      if (viewerTimerRef.current) clearInterval(viewerTimerRef.current);
    };
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Conversation Starter': 'from-blue-500 to-cyan-500',
      'Cold Approach': 'from-red-500 to-pink-500',
      'Networking': 'from-purple-500 to-indigo-500',
      'Body Language': 'from-green-500 to-emerald-500',
      'Group Dynamics': 'from-yellow-500 to-orange-500',
      'Comfort Zone': 'from-pink-500 to-rose-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-500/20 border-green-500/50';
      case 'Medium': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'Hard': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const handleStoryClick = (index) => {
    setCurrentStoryIndex(index);
    setProgress(0);
    setIsPaused(false);
    setShowComments(false);
    markAsSeen(index);
    playSound('whoosh');
  };

  const markAsSeen = (index) => {
    setStories(prev => {
      const updated = [...prev];
      if (!updated[index].seenBy.includes(userId)) {
        updated[index].seenBy = [...updated[index].seenBy, userId];
      }
      return updated;
    });
  };

  const handleReaction = (type) => {
    if (currentStoryIndex === null) return;
    
    setStories(prev => {
      const updated = [...prev];
      updated[currentStoryIndex].reactions[type] = (updated[currentStoryIndex].reactions[type] || 0) + 1;
      return updated;
    });

    // Trigger reaction animation
    setReactionAnimation(type);
    setTimeout(() => setReactionAnimation(null), 1000);
    
    // Trigger confetti for high engagement
    if (type === 'fire' || type === 'wow') {
      triggerConfetti();
    }
    
    playSound('pop');
  };

  const triggerConfetti = () => {
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1 + Math.random() * 0.5
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  };

  const toggleBookmark = (storyId) => {
    setBookmarkedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
        playSound('bookmark');
      }
      return newSet;
    });
  };

  const handleComment = () => {
    if (!comment.trim() || currentStoryIndex === null) return;
    
    setStories(prev => {
      const updated = [...prev];
      updated[currentStoryIndex].comments.push({
        user: userName,
        text: comment,
        timestamp: Date.now()
      });
      return updated;
    });
    
    setComment('');
    playSound('send');
  };

  const playSound = (type) => {
    if (!soundEnabled) return;
    // Sound would be played here with Web Audio API
    console.log(`Playing sound: ${type}`);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
      setShowComments(false);
      markAsSeen(currentStoryIndex + 1);
      playSound('swipe');
    } else {
      setCurrentStoryIndex(null);
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
      setShowComments(false);
      playSound('swipe');
    }
  };

  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const isStorySeen = (story) => {
    return story.seenBy.includes(userId);
  };

  const filteredStories = stories.filter(story => {
    const matchesCategory = filterCategory === 'all' || story.category === filterCategory;
    const matchesSearch = story.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Auto-progress timer
  useEffect(() => {
    if (currentStoryIndex === null || isPaused || showComments) return;

    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 0.5;
      });
    }, 25);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentStoryIndex, isPaused, showComments]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentStoryIndex === null) return;
      if (e.key === 'ArrowLeft') prevStory();
      if (e.key === 'ArrowRight') nextStory();
      if (e.key === 'Escape') setCurrentStoryIndex(null);
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStoryIndex]);

  // Touch handlers for swipe
  const touchStartRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 50) {
        setCurrentStoryIndex(null);
      } else if (deltaY < -50) {
        setShowComments(true);
      }
    } else {
      if (deltaX > 50) prevStory();
      if (deltaX < -50) nextStory();
    }
  };

  const categories = ['all', 'Conversation Starter', 'Cold Approach', 'Networking', 'Body Language', 'Group Dynamics', 'Comfort Zone'];

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
       

        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
          >
            <Filter className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Filter</span>
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-fadeIn">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {cat === 'all' ? 'All Stories' : cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stories Feed - Horizontal Scroll */}
      <div className="mt-10 mb-8">
  {/* ================= SHARED STORIES BORDER ================= */}
  <div
    className="
      relative
      rounded-[80px]
      p-[4px]
      bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500
      shadow-[0_0_100px_rgba(168,85,247,0.8),0_0_50px_rgba(168,85,247,0.6),inset_0_0_30px_rgba(168,85,247,0.3)]
    "
  >
    {/* ================= INNER GLASS CONTAINER ================= */}
    <div className="rounded-[76px] bg-gradient-to-b from-purple-900/95 to-purple-950/95 backdrop-blur-xl px-8 py-6 shadow-inner">
      {/* ================= STORIES ROW ================= */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide items-center justify-start">
        {/* ===== ADD STORY ===== */}
        <div
          onClick={() => setShowCreateStory(true)}
          className="flex-shrink-0 cursor-pointer text-center"
        >
          <div
            className="
              w-20 h-20 rounded-full
              bg-gradient-to-br from-purple-800 to-black
              flex items-center justify-center
              text-4xl font-bold text-white
              hover:scale-110 transition-transform
              shadow-lg
            "
          >
            +
          </div>
          <p className="text-xs mt-2 text-purple-200 max-w-[80px]">
            Your Story
          </p>
        </div>
        {/* ===== USER STORIES ===== */}
        {filteredStories.map((story, index) => {
          const unseen = !isStorySeen(story)
          return (
            <div
              key={story.storyID}
              onClick={() => handleStoryClick(index)}
              className="flex-shrink-0 cursor-pointer text-center relative"
            >
              <div
                className={`
                  w-20 h-20 rounded-full
                  flex items-center justify-center text-4xl
                  transition-transform hover:scale-105
                  ${unseen
                    ? 'bg-gradient-to-br from-purple-700 to-purple-900 shadow-lg'
                    : 'bg-gray-800/80'}
                `}
              >
                {story.avatar}
              </div>
              <p className="text-xs mt-2 text-purple-200 truncate max-w-[80px]">
                {story.username}
              </p>
              {/* NEW INDICATOR */}
              {unseen && (
                <span className="absolute top-0 right-2 w-3 h-3 rounded-full bg-purple-500 border-2 border-purple-950" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  </div>
</div>


      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center animate-fadeIn p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 p-6 border-b border-white/20 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Share Your Story
              </h2>
              <button
                onClick={() => setShowCreateStory(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Action/Title */}
              <div>
                <label className="block text-white font-semibold mb-2">What did you do? *</label>
                <input
                  type="text"
                  value={newStory.action}
                  onChange={(e) => setNewStory({...newStory, action: e.target.value})}
                  placeholder="e.g., Started conversation with stranger"
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">Quick description *</label>
                <input
                  type="text"
                  value={newStory.description}
                  onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                  placeholder="e.g., Asked 3 people about their day"
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-white font-semibold mb-2">Tell us more *</label>
                <textarea
                  value={newStory.details}
                  onChange={(e) => setNewStory({...newStory, details: e.target.value})}
                  placeholder="Share the full story, how you felt, what happened..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Category *</label>
                  <select
                    value={newStory.category}
                    onChange={(e) => setNewStory({...newStory, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/20 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Conversation Starter">Conversation Starter</option>
                    <option value="Cold Approach">Cold Approach</option>
                    <option value="Networking">Networking</option>
                    <option value="Body Language">Body Language</option>
                    <option value="Group Dynamics">Group Dynamics</option>
                    <option value="Comfort Zone">Comfort Zone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Difficulty *</label>
                  <select
                    value={newStory.difficulty}
                    onChange={(e) => setNewStory({...newStory, difficulty: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/20 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Duration & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Duration</label>
                  <input
                    type="text"
                    value={newStory.duration}
                    onChange={(e) => setNewStory({...newStory, duration: e.target.value})}
                    placeholder="e.g., 15 min"
                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={newStory.location}
                    onChange={(e) => setNewStory({...newStory, location: e.target.value})}
                    placeholder="e.g., Coffee Shop"
                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Emotion */}
              <div>
                <label className="block text-white font-semibold mb-2">How did you feel?</label>
                <input
                  type="text"
                  value={newStory.emotion}
                  onChange={(e) => setNewStory({...newStory, emotion: e.target.value})}
                  placeholder="e.g., Confident, Nervous, Proud"
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-white font-semibold">Post Anonymously</p>
                  <p className="text-gray-400 text-sm">Your identity will be hidden</p>
                </div>
                <button
                  onClick={() => setNewStory({...newStory, anonymousFlag: !newStory.anonymousFlag})}
                  className={`w-14 h-8 rounded-full transition-all ${
                    newStory.anonymousFlag ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                    newStory.anonymousFlag ? 'ml-7' : 'ml-1'
                  }`} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => {
                  if (!newStory.action || !newStory.description || !newStory.details) {
                    alert('Please fill in all required fields (*)');
                    return;
                  }
                  
                  const story = {
                    storyID: Date.now().toString(),
                    userID: newStory.anonymousFlag ? null : userId,
                    username: newStory.anonymousFlag ? 'Anonymous' : userName,
                    avatar: newStory.anonymousFlag ? '🎭' : userAvatar,
                    action: newStory.action,
                    description: newStory.description,
                    details: newStory.details,
                    category: newStory.category,
                    difficulty: newStory.difficulty,
                    duration: newStory.duration || 'Not specified',
                    location: newStory.location || 'Not specified',
                    emotion: newStory.emotion || 'Accomplished',
                    timestamp: Date.now(),
                    seenBy: [],
                    reactions: { fire: 0, clap: 0, heart: 0, wow: 0 },
                    comments: [],
                    anonymousFlag: newStory.anonymousFlag,
                    streak: 1,
                    trending: false,
                    views: 0,
                    completionRate: 100,
                    xpEarned: 50
                  };
                  
                  setStories([story, ...stories]);
                  setShowCreateStory(false);
                  setNewStory({
                    action: '',
                    description: '',
                    details: '',
                    category: 'Conversation Starter',
                    difficulty: 'Medium',
                    duration: '',
                    location: '',
                    emotion: '',
                    anonymousFlag: false
                  });
                  
                  alert('Story posted successfully! 🎉');
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold text-lg hover:shadow-xl transition-all"
              >
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Story Viewer Modal */}
      {currentStoryIndex !== null && (
        <div 
          className="fixed inset-0 bg-black z-[9999] flex items-center justify-center animate-fadeIn"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Confetti */}
          {confetti.map(c => (
            <div
              key={c.id}
              className="absolute top-0 w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                background: ['#ff0080', '#7928ca', '#00ff88', '#ffaa00', '#00aaff'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}

          <div className={`relative w-full max-w-md h-full md:h-[95vh] bg-gradient-to-br ${getCategoryColor(stories[currentStoryIndex].category)} overflow-hidden`}>
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 animate-gradient"></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
              {stories.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full bg-white transition-all duration-100 ${
                      idx < currentStoryIndex ? 'w-full' :
                      idx === currentStoryIndex ? '' : 'w-0'
                    }`}
                    style={idx === currentStoryIndex ? { width: `${progress}%` } : {}}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-5 left-0 right-0 flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(stories[currentStoryIndex].category)} flex items-center justify-center text-2xl border-2 border-white shadow-lg`}>
                  {stories[currentStoryIndex].avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-base flex items-center gap-2">
                    {stories[currentStoryIndex].username}
                    {stories[currentStoryIndex].badge && <span>{stories[currentStoryIndex].badge}</span>}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <p className="text-white/90">{getTimeAgo(stories[currentStoryIndex].timestamp)}</p>
                    <span className="text-white/60">•</span>
                    <div className="flex items-center gap-1 text-white/90">
                      <Eye className="w-3 h-3" />
                      <span>{activeViewers} viewing</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-all shadow-lg border border-white/20"
                >
                  {isPaused ? <Play className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-white" />}
                </button>
                <button
                  onClick={() => setCurrentStoryIndex(null)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-all shadow-lg border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Story Content */}
            <div className="h-full flex items-center justify-center px-6 py-24 relative z-[1]">
              <div className="w-full space-y-6 animate-slideUp">
                {/* Category Badge */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-xl rounded-full mb-4 border border-white/30 shadow-lg">
                    <span className="text-sm text-white font-semibold">{stories[currentStoryIndex].category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getDifficultyBg(stories[currentStoryIndex].difficulty)} border`}>
                      {stories[currentStoryIndex].difficulty}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl font-black text-white mb-3 drop-shadow-2xl animate-slideDown">
                    {stories[currentStoryIndex].action}
                  </h2>
                  <p className="text-xl text-white/95 font-medium drop-shadow-lg">
                    {stories[currentStoryIndex].description}
                  </p>
                </div>

                {/* Details Card */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 space-y-5 border border-white/30 shadow-2xl hover:bg-white/15 transition-all">
                  <div>
                    <p className="text-white text-base leading-relaxed font-medium">
                      {stories[currentStoryIndex].details}
                    </p>
                  </div>

                  {/* XP Earned */}
                  {stories[currentStoryIndex].xpEarned && (
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-bold">+{stories[currentStoryIndex].xpEarned} XP</span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <Target className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-white/70">Difficulty</p>
                        <p className={`text-sm font-bold ${getDifficultyColor(stories[currentStoryIndex].difficulty)}`}>
                          {stories[currentStoryIndex].difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <Clock className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-white/70">Duration</p>
                        <p className="text-sm font-bold text-white">
                          {stories[currentStoryIndex].duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <Users className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-white/70">Location</p>
                        <p className="text-sm font-bold text-white truncate max-w-[100px]">
                          {stories[currentStoryIndex].location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-xs text-white/70">Feeling</p>
                        <p className="text-sm font-bold text-white truncate max-w-[100px]">
                          {stories[currentStoryIndex].emotion}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-around pt-4 border-t border-white/20">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stories[currentStoryIndex].views}</p>
                      <p className="text-xs text-white/70">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stories[currentStoryIndex].completionRate}%</p>
                      <p className="text-xs text-white/70">Completion</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stories[currentStoryIndex].comments.length}</p>
                      <p className="text-xs text-white/70">Comments</p>
                    </div>
                  </div>

                  {/* Streak Display */}
                  {stories[currentStoryIndex].streak > 0 && (
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30">
                        <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                        <span className="text-white font-black text-xl">
                          {stories[currentStoryIndex].streak} Day Streak!
                        </span>
                        {stories[currentStoryIndex].streak >= 7 && <Award className="w-6 h-6 text-yellow-400" />}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Areas */}
            <div className="absolute inset-0 flex z-0">
              <div className="w-1/3 h-full cursor-pointer" onClick={prevStory} />
              <div className="w-1/3 h-full" onClick={() => setIsPaused(!isPaused)} />
              <div className="w-1/3 h-full cursor-pointer" onClick={nextStory} />
            </div>

            {/* Navigation Buttons */}
            {currentStoryIndex > 0 && (
              <button
                onClick={prevStory}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 z-20 transition-all shadow-lg border border-white/20 hover:scale-110"
              >
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>
            )}
            {currentStoryIndex < stories.length - 1 && (
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 z-20 transition-all shadow-lg border border-white/20 hover:scale-110"
              >
                <ChevronRight className="w-7 h-7 text-white" />
              </button>
            )}

            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-10">
              {/* Quick Actions */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  onClick={() => toggleBookmark(stories[currentStoryIndex].storyID)}
                  className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all border shadow-lg ${
                    bookmarkedStories.has(stories[currentStoryIndex].storyID)
                      ? 'bg-pink-500 border-pink-400'
                      : 'bg-white/15 border-white/20 hover:bg-white/25'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarkedStories.has(stories[currentStoryIndex].storyID) ? 'text-white fill-white' : 'text-white'}`} />
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-all border border-white/20 shadow-lg relative"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  {stories[currentStoryIndex].comments.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-xs font-bold text-white">{stories[currentStoryIndex].comments.length}</span>
                    </div>
                  )}
                </button>
                <button className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-all border border-white/20 shadow-lg">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Reaction Bar */}
              {!showComments && (
                <div className="flex items-center justify-center gap-3 animate-slideUp">
                  {[
                    { type: 'fire', emoji: '🔥', label: 'Fire' },
                    { type: 'clap', emoji: '👏', label: 'Clap' },
                    { type: 'heart', emoji: '❤️', label: 'Love' },
                    { type: 'wow', emoji: '😮', label: 'Wow' }
                  ].map(reaction => (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(reaction.type)}
                      className={`flex items-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-xl rounded-full hover:bg-white/25 transition-all border border-white/20 shadow-lg hover:scale-110 ${
                        reactionAnimation === reaction.type ? 'animate-bounce scale-125' : ''
                      }`}
                    >
                      <span className="text-2xl">{reaction.emoji}</span>
                      <span className="text-white font-bold text-base">
                        {stories[currentStoryIndex].reactions[reaction.type] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              {showComments && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/30 shadow-2xl max-h-64 overflow-y-auto animate-slideUp">
                  <div className="space-y-3 mb-4">
                    {stories[currentStoryIndex].comments.map((c, idx) => (
                      <div key={idx} className="bg-white/10 rounded-2xl p-3 border border-white/20">
                        <p className="text-white font-semibold text-sm mb-1">{c.user}</p>
                        <p className="text-white/90 text-sm">{c.text}</p>
                        <p className="text-white/60 text-xs mt-1">{getTimeAgo(c.timestamp)}</p>
                      </div>
                    ))}
                    {stories[currentStoryIndex].comments.length === 0 && (
                      <p className="text-white/60 text-center py-4">No comments yet. Be the first!</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white placeholder-white/60 border border-white/20 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={handleComment}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-confetti {
          animation: confetti ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default CommunityStories;