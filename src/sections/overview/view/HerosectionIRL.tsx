import { Users, MapPin, Heart, ArrowRight, TrendingUp, Zap, Clock } from 'lucide-react';

const IRLConnectionsValueHero = ({ onOpenHub }) => {
  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-3xl shadow-3xl border-2 border-purple-500/50 relative overflow-hidden my-12 tour-irl-hero-value">

      
      {/* Visual background elements for energy */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="45" fill="url(#gradient)" opacity="0.1" />
          <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: '#FF6F91', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#4F46E5', stopOpacity: 0}} />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-12 text-white">
        
        {/* Left Column: Headline and CTA */}
        <div className="lg:w-1/2">
          <div className="flex items-center mb-4">
            <Users className="w-10 h-10 text-pink-400 mr-4 p-1 bg-white/20 rounded-full" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Turn Social Efforts into Real Progress.
            </h2>
          </div>
          <p className="text-purple-200 mb-8 text-xl">
            Stop guessing about your social journey. Our IRL Connections Hub gives you the data and motivation to build lasting relationships and confidently track your growth.
          </p>

          {/* Main Call to Action Button (Calls onOpenHub) */}
          <button
            onClick={onOpenHub}
            className="w-full sm:w-auto px-10 py-4 bg-pink-500 text-white font-bold text-xl rounded-xl shadow-2xl hover:bg-pink-400 transition-all transform hover:scale-[1.03] flex items-center justify-center gap-3 active:bg-pink-600"
          >
            Launch Connection Tracker <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
        
        {/* Right Column: Key Benefits/Features */}
        <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Feature Card 1: Skill Tracking */}
          <div className="p-5 bg-purple-700/50 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg hover:shadow-2xl transition-all">
            <TrendingUp className="w-6 h-6 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Track & Score Social Skills</h3>
            <p className="text-sm text-purple-200">
              Log each real-life interaction and get quantitative feedback on eye contact, conversation flow, and confidence level.
            </p>
          </div>

          {/* Feature Card 2: Relationship Depth */}
          <div className="p-5 bg-purple-700/50 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg hover:shadow-2xl transition-all">
            <Heart className="w-6 h-6 text-red-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Measure Relationship Depth</h3>
            <p className="text-sm text-purple-200">
              Go beyond just meeting people. Track follow-up frequency, conversation history, and relationship status.
            </p>
          </div>

          {/* Feature Card 3: Milestone & XP */}
          <div className="p-5 bg-purple-700/50 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg hover:shadow-2xl transition-all">
            <Zap className="w-6 h-6 text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Earn XP for Milestones</h3>
            <p className="text-sm text-purple-200">
              Gamify your progress! Get Experience Points (XP) and unlock badges for initiating conversations and scheduling follow-ups.
            </p>
          </div>

          {/* Feature Card 4: Review Time */}
          <div className="p-5 bg-purple-700/50 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg hover:shadow-2xl transition-all">
            <Clock className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Timed Reflection Prompts</h3>
            <p className="text-sm text-purple-200">
              Receive notifications to review your latest interactions, helping you solidify lessons and plan your next move.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- THIS LINE IS THE KEY TO MAKING IT AVAILABLE ---
export default IRLConnectionsValueHero;