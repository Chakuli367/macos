import React from 'react';
import { MessageCircle, Radio, Users, Zap, Lock } from 'lucide-react';

const LivingFeed = ({ 
  selectedGroup, 
  posts, 
  activePeers, 
  onCreatePost,
  unlockedFeatures,
  emotionalScore 
}) => {
  
  // Filter urgent posts
  const urgentPosts = posts.filter(p => p.template?.type === 'NEED_SUPPORT_NOW');

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Urgent Alert Banner */}
      {urgentPosts.length > 0 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-red-900/30 to-orange-900/30 
                       border-2 border-red-500/50 rounded-xl animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-200 font-bold">
                  {urgentPosts.length} {urgentPosts.length === 1 ? 'person needs' : 'people need'} support right now
                </p>
                <p className="text-red-300 text-sm">Tap to help</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold">
              Respond
            </button>
          </div>
        </div>
      )}

      {/* Group Header (if selected) */}
      {selectedGroup && (
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl border-2 border-purple-500/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedGroup.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedGroup.name}</h2>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <span className="text-purple-300 flex items-center gap-1">
                    <Users className="w-4 h-4" /> {selectedGroup.memberCount || 0}
                  </span>
                  <span className="text-green-300 flex items-center gap-1">
                    <Radio className="w-4 h-4" /> {activePeers.length} active
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCreatePost}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                       hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold
                       flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
<div className="flex gap-3 mb-6 border-b border-purple-500/30 pb-4">
  <button className="px-4 py-2 bg-purple-600 rounded-lg font-semibold">
    💬 Feed
  </button>

  <button
    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
      unlockedFeatures.liveChat
        ? "bg-purple-900/50 hover:bg-purple-800/50"
        : "bg-gray-800 opacity-50 cursor-not-allowed"
    }`}
    disabled={!unlockedFeatures.liveChat}
  >
    🎙️ Live: {activePeers.filter(p => p.inLiveChat).length}
    {!unlockedFeatures.liveChat && <Lock className="w-4 h-4" />}
  </button>

  <button
    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
      unlockedFeatures.quietRoom
        ? "bg-purple-900/50 hover:bg-purple-800/50"
        : "bg-gray-800 opacity-50 cursor-not-allowed"
    }`}
    disabled={!unlockedFeatures.quietRoom}
  >
    🤫 Quiet: 8
    {!unlockedFeatures.quietRoom && <Lock className="w-4 h-4" />}
  </button>
</div>


  {/* Posts */}
  <div className="space-y-4">
    {posts.length === 0 ? (
      <div className="text-center py-12 p-8 bg-purple-900/30 rounded-xl border-2 border-purple-500/30">
        <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <p className="text-purple-300 mb-4">No posts yet. Be the first to share!</p>
        <button
          onClick={onCreatePost}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold"
        >
          Create First Post
        </button>
      </div>
    ) : (
      posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))
    )}
  </div>

  {/* Floating Action Button */}
  <button
    onClick={onCreatePost}
    className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600
             hover:from-purple-500 hover:to-pink-500 rounded-full shadow-2xl
             flex items-center justify-center transform hover:scale-110 transition-all z-40"
  >
    <MessageCircle className="w-8 h-8" />
  </button>

</div>
);
};
export default LivingFeed;