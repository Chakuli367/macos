import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Zap, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/connections');
  };

  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[60vh] md:min-h-[50vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8
                        bg-gradient-to-br from-purple-900/80 to-indigo-900/80 text-center
                        rounded-2xl shadow-xl max-w-3xl mx-auto">

      {/* Badge */}
      <div className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-purple-950/50 rounded-full border border-purple-500/30 shadow-md mb-3 sm:mb-4 text-xs sm:text-sm">
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
        <span className="text-amber-300 font-semibold">Action Support & Confidence Builder</span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-100 mb-3 sm:mb-4">
        Need Support for a Specific Action?
      </h1>

      {/* Short description */}
      <p className="text-purple-200 text-xs sm:text-sm md:text-base max-w-sm sm:max-w-md mb-4 sm:mb-5 px-2">
        Get guidance and support for any task or social interaction you want to tackle.
      </p>

      {/* Call to Action */}
      <button
        onClick={handleClick}
        className="flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-2xl
                   bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400/50
                   hover:from-purple-500 hover:to-pink-500 hover:scale-105 active:scale-95 transition-all duration-200
                   animate-pulse-slow"
      >
        <Target className="w-4 h-4 mr-2 sm:mr-3" />
        Get Support
        <ArrowRight className="w-4 h-4 ml-2 sm:ml-3" />
      </button>

      {/* Gradient pulse animation */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
