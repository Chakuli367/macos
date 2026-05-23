import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Trophy, Target, Flame } from 'lucide-react';

export default function ProgressVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const milestones = [
    { 
      id: 1, 
      title: 'Foundation', 
      description: 'Building the basics',
      progress: 100,
      color: '#FF6B9D',
      icon: Target
    },
    { 
      id: 2, 
      title: 'Growth Phase', 
      description: 'Expanding capabilities',
      progress: 100,
      color: '#FFA07A',
      icon: Flame
    },
    { 
      id: 3, 
      title: 'Acceleration', 
      description: 'Rapid development',
      progress: 75,
      color: '#98D8C8',
      icon: Zap
    },
    { 
      id: 4, 
      title: 'Excellence', 
      description: 'Achieving mastery',
      progress: 45,
      color: '#A78BFA',
      icon: Sparkles
    },
    { 
      id: 5, 
      title: 'Victory', 
      description: 'Ultimate goal',
      progress: 20,
      color: '#FFD700',
      icon: Trophy
    }
  ];

  const totalProgress = milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % milestones.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes grow {
          from { width: 0; }
        }
        .progress-bar {
          animation: grow 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-[slide-in_0.8s_ease-out]">
          <h1 className="text-7xl font-black text-white mb-4 tracking-tight" 
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>
            PROGRESS JOURNEY
          </h1>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 border border-white/20">
            <p className="text-2xl font-bold text-white">
              {totalProgress.toFixed(0)}% Complete
            </p>
          </div>
        </div>

        {/* Main circular progress */}
        <div className="flex justify-center mb-20">
          <div className="relative w-80 h-80">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="20"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - totalProgress / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B9D" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-black text-white mb-2">
                  {totalProgress.toFixed(0)}%
                </div>
                <div className="text-sm uppercase tracking-widest text-white/60 font-semibold">
                  Overall
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone cards */}
        <div className="grid gap-6">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isActive = index === activeIndex;
            
            return (
              <div
                key={milestone.id}
                className="group relative"
                style={{
                  animation: `slide-in ${0.5 + index * 0.1}s ease-out`
                }}
              >
                <div 
                  className={`
                    relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border-2 transition-all duration-500
                    ${isActive ? 'border-white/40 scale-105' : 'border-white/10 hover:border-white/20'}
                  `}
                  style={{
                    boxShadow: isActive ? `0 0 40px ${milestone.color}40` : 'none'
                  }}
                >
                  <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                      style={{ 
                        backgroundColor: milestone.color + '20',
                        border: `2px solid ${milestone.color}60`
                      }}
                    >
                      <Icon 
                        className="w-8 h-8 relative z-10" 
                        style={{ color: milestone.color }}
                      />
                      {isActive && (
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle, ${milestone.color}40 0%, transparent 70%)`,
                            animation: 'pulse-glow 2s ease-in-out infinite'
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {milestone.title}
                        </h3>
                        <span 
                          className="text-xl font-black tabular-nums"
                          style={{ color: milestone.color }}
                        >
                          {milestone.progress}%
                        </span>
                      </div>
                      <p className="text-white/60 mb-3 text-sm">
                        {milestone.description}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full relative progress-bar"
                          style={{
                            width: `${milestone.progress}%`,
                            background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}CC)`,
                            boxShadow: `0 0 10px ${milestone.color}80`
                          }}
                        >
                          <div 
                            className="absolute inset-0 bg-white/30"
                            style={{
                              animation: isActive ? 'pulse-glow 1.5s ease-in-out infinite' : 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-black text-white mb-2">
              {milestones.filter(m => m.progress === 100).length}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider font-semibold">
              Completed
            </div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-black text-white mb-2">
              {milestones.filter(m => m.progress > 0 && m.progress < 100).length}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider font-semibold">
              In Progress
            </div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-black text-white mb-2">
              {milestones.length}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider font-semibold">
              Total Goals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}