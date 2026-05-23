import { useState, useEffect } from 'react';
import { Sparkles, Trophy, Flame, TrendingUp, Target, Award, CheckCircle, ArrowRight, Zap, Calendar } from 'lucide-react';

export default function MiniTaskTracker() {
  const [animate, setAnimate] = useState(false);

  // Mock data - in real implementation, this would come from Firebase
  const mockStats = {
    totalXP: 450,
    currentStreak: 5,
    todayActions: 2,
    dailyGoal: 3,
    weeklyAverage: 2.4,
    totalActions: 18
  };

  const recentActions = [
    { label: 'Compliment Someone', difficulty: 'easy', time: '2h ago', icon: '🌱' },
    { label: 'Initiate Conversation', difficulty: 'medium', time: '5h ago', icon: '🔥' },
  ];

  const nextAchievements = [
    { title: 'Social Warrior', progress: 18, threshold: 25, icon: '⚡' },
    { title: 'Streak Master', progress: 5, threshold: 7, icon: '🔥' },
  ];

  useEffect(() => {
    setAnimate(true);
  }, []);

  const goalProgress = (mockStats.todayActions / mockStats.dailyGoal) * 100;

  return (
    <div className={`w-full max-w-md lg:max-w-2xl xl:max-w-3xl transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Main Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden">
        
        {/* Header with Badge */}
        <div className="relative p-5 md:p-6 lg:p-8 pb-4">
          {/* Animated glow effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/20 to-transparent blur-2xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-purple-300" />
              <span className="text-xs lg:text-sm font-medium text-purple-200">Social Skills Tracker</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Action Tracker Pro
            </h2>
            
            <p className="text-sm lg:text-base xl:text-lg text-purple-300 mb-3 lg:mb-4">
              Level up your social skills through daily practice
            </p>

            {/* New CTA Text */}
            <div className="inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl border border-purple-400/40 mb-4">
              <Target className="w-4 h-4 lg:w-5 lg:h-5 text-pink-300" />
              <span className="text-sm lg:text-base font-semibold text-purple-100">Log your tasks and track your progress</span>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-yellow-500/20 rounded-full border border-yellow-400/30">
                <Trophy className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-yellow-400" />
                <span className="text-xs lg:text-sm font-bold text-yellow-100">{mockStats.totalXP} XP</span>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-orange-500/20 rounded-full border border-orange-400/30">
                <Flame className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-orange-400" />
                <span className="text-xs lg:text-sm font-bold text-orange-100">{mockStats.currentStreak} day streak</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-green-500/20 rounded-full border border-green-400/30">
                <Target className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-green-400" />
                <span className="text-xs lg:text-sm font-bold text-green-100">{mockStats.todayActions}/{mockStats.dailyGoal} today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - 2 columns on large screens */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Left Column */}
          <div className="space-y-4">
            {/* Today's Progress */}
            <div className="px-5 md:px-6 lg:px-8">
              <div className="bg-purple-950/40 backdrop-blur-sm rounded-2xl border border-purple-700/30 p-4 lg:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                    <span className="text-sm lg:text-base font-bold text-purple-100">Today's Goal</span>
                  </div>
                  <span className="text-lg lg:text-xl font-bold text-white">{mockStats.todayActions}/{mockStats.dailyGoal}</span>
                </div>
                
                <div className="h-3 lg:h-4 bg-purple-900/50 rounded-full overflow-hidden border border-purple-700/30">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${Math.min(goalProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs lg:text-sm text-purple-300 mt-2 text-right">{Math.round(goalProgress)}% complete</p>
              </div>
            </div>

            {/* Recent Actions */}
            <div className="px-5 md:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                <h3 className="text-sm lg:text-base font-bold text-purple-100">Recent Actions</h3>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                {recentActions.map((action, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 lg:p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 hover:border-purple-600/50 transition-all"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className="text-2xl lg:text-3xl">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-bold text-white truncate">{action.label}</p>
                      <p className="text-xs lg:text-sm text-purple-400">{action.time}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Mini Stats Grid */}
            <div className="px-5 md:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 p-3 lg:p-4 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400" />
                    <span className="text-xs lg:text-sm text-purple-300 font-medium">Weekly Avg</span>
                  </div>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-white">{mockStats.weeklyAverage}</p>
                  <p className="text-xs lg:text-sm text-purple-400">per day</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-800/40 to-purple-900/40 p-3 lg:p-4 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-yellow-400" />
                    <span className="text-xs lg:text-sm text-purple-300 font-medium">Total</span>
                  </div>
                  <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-white">{mockStats.totalActions}</p>
                  <p className="text-xs lg:text-sm text-purple-400">actions</p>
                </div>
              </div>
            </div>

            {/* Next Achievements */}
            <div className="px-5 md:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
                <h3 className="text-sm lg:text-base font-bold text-purple-100">Next Achievements</h3>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                {nextAchievements.map((achievement, idx) => (
                  <div 
                    key={idx}
                    className="p-3 lg:p-4 bg-purple-950/30 rounded-xl border border-purple-700/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl lg:text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm lg:text-base font-bold text-white">{achievement.title}</p>
                        <p className="text-xs lg:text-sm text-purple-400">{achievement.progress}/{achievement.threshold}</p>
                      </div>
                    </div>
                    <div className="h-2 lg:h-2.5 bg-purple-900/50 rounded-full overflow-hidden border border-purple-700/30">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                        style={{ width: `${(achievement.progress / achievement.threshold) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-5 md:px-6 lg:px-8 pb-6 pt-4 lg:pt-6">
          <button
            onClick={() => {
              // Navigate to full page - in real implementation:
              // window.location.href = '/social-skills-tracker';
              // or use your router: navigate('/social-skills-tracker');
              console.log('Navigate to full Social Skills Tracker page');
            }}
            className="w-full group relative overflow-hidden px-6 py-4 lg:py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base lg:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="relative flex items-center justify-center gap-2 lg:gap-3">
              <span>View Full Tracker</span>
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
      </div>

      {/* Floating Particles Effect (Optional) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
            style={{
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 4s infinite;
        }

        button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}