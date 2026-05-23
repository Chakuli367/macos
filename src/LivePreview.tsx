import React, { useState, useEffect } from 'react';
import { Users, Radio } from 'lucide-react';

const LivePreview = ({ group, posts, onJoin, onBack }) => {
  const [countdown, setCountdown] = useState(60);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    if (!autoAdvance) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-advance after 60 seconds
    const advanceTimer = setTimeout(() => {
      if (autoAdvance) onJoin();
    }, 60000);

    return () => {
      clearInterval(timer);
      clearTimeout(advanceTimer);
    };
  }, [autoAdvance, onJoin]);

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{group.icon}</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {group.memberCount || 0} people in "{group.name}" right now
          </h1>
          <p className="text-purple-300">
            Preview for {countdown} seconds...
          </p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Radio className="w-5 h-5 text-green-400 animate-pulse" />
          <span className="text-green-300 font-semibold">LIVE</span>
        </div>

        {/* Posts Preview (Read-Only) */}
        <div className="space-y-4 mb-8 opacity-90 pointer-events-none">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="p-6 bg-purple-950/50 rounded-xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  {post.author?.avatar || '👤'}
                </div>
                <div>
                  <p className="text-white font-semibold">{post.author?.name || 'Anonymous'}</p>
                  <p className="text-purple-400 text-xs">
                    {post.template?.icon} {post.template?.title}
                  </p>
                </div>
              </div>
              
              <p className="text-purple-200 line-clamp-3">
                {Object.values(post.content || {})[0]}
              </p>

              <div className="flex items-center gap-4 mt-3 text-sm text-purple-400">
                <span>💜 {post.reactions?.meToo || 0}</span>
                <span>💬 {post.responseCount || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Join Button (Pulses after 30 sec) */}
        <button
          onClick={() => {
            setAutoAdvance(false);
            onJoin();
          }}
          className={`w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl
                   transition-all transform hover:scale-105 ${countdown < 30 ? 'animate-pulse' : ''}`}
        >
          Join This Space
        </button>

        <button
          onClick={onBack}
          className="w-full mt-4 px-6 py-3 text-purple-300 hover:text-white transition-colors"
        >
          ← Choose Different Struggle
        </button>

      </div>
    </div>
  );
};

export default LivePreview;