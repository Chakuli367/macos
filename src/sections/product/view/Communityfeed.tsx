import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Trophy, Users, ChevronUp, ChevronDown, MessageCircle, Share2, Award, Bookmark, MoreHorizontal, Image, Video, Link, Smile, X, Send, Filter, Plus, Flame, Star, Heart, ThumbsUp, Edit3, Trash2, Flag } from 'lucide-react';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, doc, serverTimestamp, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Mock data for initial seeding
const MOCK_POSTS = [
  {
    id: '1',
    author: {
      id: 'u1',
      name: 'Sarah Martin',
      username: 'sarah_learns',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      league: 'GOLD',
      xp: 2450
    },
    title: 'Finally had a 30-minute conversation without anxiety! 🎉',
    content: 'I used the active listening techniques from last week\'s challenge. Asked open-ended questions, maintained eye contact, and actually ENJOYED the conversation. This is huge for me!',
    tags: ['social-anxiety', 'win', 'conversation', 'active-listening'],
    votes: 456,
    userVote: null,
    commentCount: 23,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    awards: [
      { type: 'fire', count: 5 },
      { type: 'heart', count: 12 },
      { type: 'star', count: 3 }
    ]
  },
  {
    id: '2',
    author: {
      id: 'u2',
      name: 'Mike Chen',
      username: 'mike_progress',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      league: 'SILVER',
      xp: 1200
    },
    title: 'How do you handle awkward silences in conversations?',
    content: 'I always panic when there\'s a pause in the conversation. Any tips? I feel like I need to fill every second with words and it\'s exhausting. Would love to hear your strategies!',
    tags: ['advice-needed', 'conversation', 'social-anxiety'],
    votes: 234,
    userVote: null,
    commentCount: 67,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    awards: [
      { type: 'heart', count: 8 }
    ]
  },
  {
    id: '3',
    author: {
      id: 'u3',
      name: 'Emma Thompson',
      username: 'emma_social',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      league: 'PLATINUM',
      xp: 3800
    },
    title: '5 Conversation Starters That Actually Work 💬',
    content: 'After testing dozens of openers, here are my top 5:\n\n1. "What\'s been the highlight of your week?"\n2. "I\'m curious, what got you into [their field/hobby]?"\n3. "If you could learn any skill instantly, what would it be?"\n4. "What\'s something you\'re looking forward to?"\n5. "Tell me about something you\'re passionate about"\n\nThey all lead to genuine conversations!',
    tags: ['tips', 'conversation-starters', 'advice', 'resources'],
    votes: 892,
    userVote: 1,
    commentCount: 145,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    awards: [
      { type: 'fire', count: 23 },
      { type: 'star', count: 45 },
      { type: 'heart', count: 67 }
    ]
  },
  {
    id: '4',
    author: {
      id: 'u4',
      name: 'Alex Rivera',
      username: 'alex_growth',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      league: 'BRONZE',
      xp: 450
    },
    title: 'Started a conversation with a stranger at the coffee shop today',
    content: 'Small win but it felt huge. We talked about books for like 10 minutes. Heart was racing but I did it! 💪',
    tags: ['win', 'small-talk', 'confidence'],
    votes: 178,
    userVote: null,
    commentCount: 34,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    awards: [
      { type: 'fire', count: 8 },
      { type: 'heart', count: 15 }
    ]
  }
];

const AWARD_ICONS = {
  fire: { emoji: '🔥', color: 'text-orange-400', label: 'Fire' },
  heart: { emoji: '❤️', color: 'text-pink-400', label: 'Heart' },
  star: { emoji: '⭐', color: 'text-yellow-400', label: 'Star' }
};

const LEAGUES = {
  BRONZE: { name: 'Bronze', color: 'bg-orange-500/20 text-orange-400' },
  SILVER: { name: 'Silver', color: 'bg-gray-400/20 text-gray-300' },
  GOLD: { name: 'Gold', color: 'bg-yellow-500/20 text-yellow-400' },
  PLATINUM: { name: 'Platinum', color: 'bg-gray-300/20 text-gray-200' },
  DIAMOND: { name: 'Diamond', color: 'bg-blue-400/20 text-blue-300' }
};

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('hot');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [expandedPost, setExpandedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'Anonymous',
          username: user.email?.split('@')[0] || 'user',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          league: 'GOLD',
          xp: 2000
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // ONE-TIME SEED: Check if posts exist, if not, seed with MOCK_POSTS
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        const postsRef = collection(db, 'community_posts');
        const snapshot = await getDocs(postsRef);
        
        // Only seed if database is empty
        if (snapshot.empty) {
          console.log('🌱 Seeding database with mock posts...');
          
          for (const mockPost of MOCK_POSTS) {
            // Remove the hardcoded 'id' field to avoid conflicts
            const { id, ...postDataWithoutId } = mockPost;
            
            // Add to community_posts collection (Firestore will auto-generate ID)
            const postRef = await addDoc(postsRef, {
              ...postDataWithoutId,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            // Also add to user's personal posts collection
            const userPostRef = doc(db, `users/${mockPost.author.id}/user_posts/${postRef.id}`);
            await setDoc(userPostRef, {
              postId: postRef.id,
              title: mockPost.title,
              content: mockPost.content,
              tags: mockPost.tags,
              votes: mockPost.votes,
              commentCount: mockPost.commentCount,
              createdAt: serverTimestamp()
            });
          }
          
          console.log('✅ Database seeded successfully!');
        } else {
          console.log('✅ Database already has posts, skipping seed.');
        }
      } catch (error) {
        console.error('❌ Error seeding database:', error);
      }
    };

    seedDatabase();
  }, [db]);

  // REAL-TIME LISTENER: Subscribe to posts from Firestore
  useEffect(() => {
    const postsRef = collection(db, 'community_posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          userVote: null // TODO: Load user's vote from a separate votes collection
        };
      });
      
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching posts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Handle vote
  const handleVote = async (postId, voteType) => {
    if (!currentUser) {
      alert('Please sign in to vote');
      return;
    }

    try {
      const postRef = doc(db, 'community_posts', postId);
      const post = posts.find(p => p.id === postId);
      
      let newVotes = post.votes;
      let newUserVote = voteType;
      
      if (post.userVote === voteType) {
        newUserVote = null;
        newVotes = post.votes - voteType;
      } else if (post.userVote) {
        newVotes = post.votes - post.userVote + voteType;
      } else {
        newVotes = post.votes + voteType;
      }
      
      await updateDoc(postRef, { votes: newVotes });

      // Update local state for instant feedback
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, votes: newVotes, userVote: newUserVote } : p
      ));

    } catch (error) {
      console.error('❌ Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  // Handle create post
  const handleCreatePost = async () => {
    if (!currentUser) {
      alert('Please sign in to create a post');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const postData = {
        author: currentUser,
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
        votes: 1,
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        awards: []
      };

      // Add to community_posts collection
      const postRef = await addDoc(collection(db, 'community_posts'), postData);

      // Add to user's personal posts collection: users/<uid>/user_posts/<postId>
      const userPostRef = doc(db, `users/${currentUser.id}/user_posts/${postRef.id}`);
      await setDoc(userPostRef, {
        postId: postRef.id,
        title: newPost.title,
        content: newPost.content,
        tags: postData.tags,
        votes: 1,
        commentCount: 0,
        createdAt: serverTimestamp()
      });

      setNewPost({ title: '', content: '', tags: '' });
      setShowCreatePost(false);
      
      console.log('✅ Post created successfully!');
    } catch (error) {
      console.error('❌ Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  // Sort posts based on selected tab
  const sortedPosts = [...posts].sort((a, b) => {
    switch (selectedTab) {
      case 'hot':
        return b.votes - a.votes;
      case 'new':
        return b.createdAt - a.createdAt;
      case 'top':
        return b.votes - a.votes;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="w-full text-white p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-300">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            Community Feed
          </h2>
          <p className="text-purple-300 text-sm">Share experiences, ask questions, and connect with others</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'hot', icon: <Flame size={14} />, label: 'Hot' },
            { id: 'new', icon: <Clock size={14} />, label: 'New' },
            { id: 'top', icon: <Trophy size={14} />, label: 'Top' },
            { id: 'following', icon: <Users size={14} />, label: 'Following' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap text-sm ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:bg-purple-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="w-full mb-4 p-3 bg-purple-900/40 border-2 border-purple-500/30 rounded-xl text-purple-300 hover:border-purple-400 transition-all flex items-center gap-2 group text-sm"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform flex-shrink-0" />
          <span className="text-left">What's on your mind? Share a win, ask advice...</span>
        </button>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post title..."
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
              />

              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind? (Share your experience, ask a question, give advice...)"
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                rows={6}
              />

              <input
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="Tags (comma separated): e.g., social-anxiety, win, conversation"
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleCreatePost}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Post to Community
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-6 py-3 bg-purple-800/50 border-2 border-purple-500/50 rounded-xl font-bold hover:bg-purple-700/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12 bg-purple-900/40 rounded-2xl border-2 border-purple-500/30">
              <p className="text-purple-300 mb-4">No posts yet. Be the first to share!</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Create First Post
              </button>
            </div>
          ) : (
            sortedPosts.map(post => (
              <div
                key={post.id}
                className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all overflow-hidden"
              >
                <div className="flex gap-2 md:gap-4 p-3 md:p-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-0.5 pt-1 flex-shrink-0">
                    <button
                      onClick={() => handleVote(post.id, 1)}
                      className={`p-0.5 md:p-1 rounded hover:bg-purple-700/50 transition-colors ${
                        post.userVote === 1 ? 'text-orange-400' : 'text-purple-400'
                      }`}
                    >
                      <ChevronUp size={20} className="md:w-6 md:h-6" />
                    </button>
                    <span className={`font-bold text-sm md:text-lg ${
                      post.userVote === 1 ? 'text-orange-400' :
                      post.userVote === -1 ? 'text-blue-400' :
                      'text-purple-200'
                    }`}>
                      {post.votes}
                    </span>
                    <button
                      onClick={() => handleVote(post.id, -1)}
                      className={`p-0.5 md:p-1 rounded hover:bg-purple-700/50 transition-colors ${
                        post.userVote === -1 ? 'text-blue-400' : 'text-purple-400'
                      }`}
                    >
                      <ChevronDown size={20} className="md:w-6 md:h-6" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    {/* Author Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-purple-500/50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white text-sm md:text-base truncate">{post.author.name}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${LEAGUES[post.author.league].color}`}>
                            {LEAGUES[post.author.league].name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-purple-400">
                          <span className="hidden sm:inline">@{post.author.username}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Title */}
                    <h3 className="text-base md:text-xl font-bold text-white mb-2 hover:text-purple-300 cursor-pointer leading-tight">
                      {post.title}
                    </h3>

                    {/* Post Content */}
                    <p className={`text-purple-100 mb-2 text-sm md:text-base leading-relaxed ${
                      expandedPost === post.id ? '' : 'line-clamp-3'
                    }`}>
                      {post.content}
                    </p>

                    {post.content.length > 200 && (
                      <button
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className="text-purple-400 hover:text-purple-300 text-xs md:text-sm font-semibold mb-2"
                      >
                        {expandedPost === post.id ? 'Show less' : 'Read more...'}
                      </button>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-purple-800/50 rounded-full text-xs text-purple-200 font-semibold hover:bg-purple-700/50 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Awards */}
                    {post.awards && post.awards.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {post.awards.map((award, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-950/50 rounded-lg"
                          >
                            <span className="text-base md:text-lg">{AWARD_ICONS[award.type].emoji}</span>
                            <span className={`text-xs font-bold ${AWARD_ICONS[award.type].color}`}>
                              {award.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4 pt-2 border-t border-purple-700/30">
                      <button className="flex items-center gap-1 md:gap-2 text-purple-300 hover:text-purple-100 transition-colors text-xs md:text-sm font-semibold">
                        <MessageCircle size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
                        <span className="hidden sm:inline">{post.commentCount} Comments</span>
                        <span className="sm:hidden">{post.commentCount}</span>
                      </button>
                      <button className="flex items-center gap-1 md:gap-2 text-purple-300 hover:text-purple-100 transition-colors text-xs md:text-sm font-semibold">
                        <Share2 size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                      <button className="flex items-center gap-1 md:gap-2 text-purple-300 hover:text-purple-100 transition-colors text-xs md:text-sm font-semibold">
                        <Award size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
                        <span className="hidden md:inline">Award</span>
                      </button>
                      <button className="flex items-center gap-1 md:gap-2 text-purple-300 hover:text-purple-100 transition-colors text-xs md:text-sm font-semibold">
                        <Bookmark size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
                        <span className="hidden md:inline">Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {sortedPosts.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-purple-900/40 border-2 border-purple-500/30 rounded-xl text-purple-200 font-bold hover:bg-purple-800/50 hover:border-purple-400 transition-all">
              Load More Posts
            </button>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CommunityFeed;