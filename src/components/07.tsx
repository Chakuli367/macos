import React, { useState, useEffect, useRef } from 'react';
import { Eye, Check, RotateCcw, Sparkles } from 'lucide-react';

// Constants
const MAX_REPS = 1;
const FILL_DURATION = 3000;
const HOLD_DURATION = 2000;
const EMPTY_DURATION = 1000;

type Phase = 'idle' | 'filling' | 'holding' | 'emptying';

interface NameInputScreenProps {
  onStart: (name: string) => void;
}

interface PracticeScreenProps {
  userName: string;
}

const useEyeAnimation = (isActive: boolean, onComplete: () => void) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [fillProgress, setFillProgress] = useState<number>(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || phase === 'idle') return;

    let startTime: number | undefined;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (phase === 'filling') {
        const progress = Math.min(100, (elapsed / FILL_DURATION) * 100);
        setFillProgress(progress);
        if (elapsed < FILL_DURATION) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setPhase('holding');
        }
      } else if (phase === 'holding') {
        if (elapsed >= HOLD_DURATION) {
          setPhase('emptying');
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      } else if (phase === 'emptying') {
        const progress = Math.max(0, 100 - (elapsed / EMPTY_DURATION) * 100);
        setFillProgress(progress);
        if (elapsed < EMPTY_DURATION) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, phase, onComplete]);

  const start = () => {
    setPhase('filling');
    setFillProgress(0);
  };

  const reset = () => {
    setPhase('idle');
    setFillProgress(0);
  };

  return { phase, fillProgress, start, reset };
};

const Confetti: React.FC = () => {
  const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const delay = Math.random() * 2;
        const duration = 3 + Math.random() * 2;
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 40;
        
        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-pulse"
            style={{
              left: `${startX}%`,
              top: '-20px',
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onStart }) => {
  const [userName, setUserName] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-105">
          {/* Icon with glow */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-full shadow-lg">
                <Eye className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            Eye Contact Trainer
          </h1>
          
          <p className="text-center text-indigo-200 mb-8 text-sm leading-relaxed">
            Build confidence through consistent eye contact practice
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-200 ml-1">
                What's your name?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  onKeyPress={(e) => e.key === 'Enter' && userName.trim() && onStart(userName)}
                />
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-center transition-transform duration-300 ${isFocused ? 'scale-x-100' : 'scale-x-0'}`} />
              </div>
            </div>

            <button
              onClick={() => userName.trim() && onStart(userName)}
              disabled={!userName.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Practice
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="mt-6 text-center text-indigo-300/60 text-sm">
          Press Enter to continue
        </div>
      </div>
    </div>
  );
};

const PracticeScreen: React.FC<PracticeScreenProps> = ({ userName }) => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [fillProgress, setFillProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [reps, setReps] = useState<number>(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!isHolding) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    startTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) return;
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(100, (elapsed / FILL_DURATION) * 100);
      
      setFillProgress(progress);

      if (progress < 100 && isHolding) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (progress >= 100) {
        // Completed!
        setIsHolding(false);
        setReps(prev => prev + 1);
        if (reps + 1 >= MAX_REPS) {
          setIsCompleted(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          setShowTip(true);
          setTimeout(() => setShowTip(false), 5000);
        }
        setTimeout(() => {
          setFillProgress(0);
        }, 1000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHolding, reps]);

  const handleMouseDown = () => {
    if (isCompleted) return;
    setIsHolding(true);
    startTimeRef.current = undefined;
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    // Drain water faster if not completed
    if (fillProgress < 100 && fillProgress > 0) {
      const currentProgress = fillProgress;
      const drainStart = performance.now();
      const drainDuration = 800;
      
      const drain = (timestamp: number) => {
        const elapsed = timestamp - drainStart;
        const newProgress = currentProgress * (1 - elapsed / drainDuration);
        
        if (newProgress > 0 && elapsed < drainDuration) {
          setFillProgress(newProgress);
          requestAnimationFrame(drain);
        } else {
          setFillProgress(0);
        }
      };
      
      requestAnimationFrame(drain);
    }
  };

  const resetPractice = () => {
    setIsHolding(false);
    setReps(0);
    setIsCompleted(false);
    setShowTip(false);
    setFillProgress(0);
    startTimeRef.current = undefined;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-full h-3 overflow-hidden border border-white/20 shadow-lg">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${(reps / MAX_REPS) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          <p className="text-center mt-3 text-indigo-200 font-medium flex items-center justify-center gap-2">
            {reps}/{MAX_REPS} Repetition Complete 
            {isCompleted && <Check className="w-5 h-5 text-green-400" />}
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          {/* Instructions */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              {isCompleted ? '🎉 Skill Mastered!' : 'Look at the center and hold your gaze'}
            </h2>
            <p className="text-indigo-200 text-lg">
              {isCompleted 
                ? `Congratulations ${userName}! You've completed your practice.` 
                : `Say aloud: "Hi, I'm ${userName}. Nice to meet you."`}
            </p>
          </div>

          {/* Circle animation */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Outer glow ring */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl transition-opacity duration-300 ${isHolding ? 'opacity-40 animate-pulse' : 'opacity-20'}`} />
              
              {/* Main circle frame */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-600/40 to-purple-600/40 backdrop-blur-xl border-4 border-white/30 shadow-2xl overflow-hidden">
                {/* Fill progress */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 transition-none ease-linear"
                  style={{ height: `${fillProgress}%` }}
                >
                  {/* Wave effect */}
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      transformOrigin: 'center'
                    }} />
                  </div>
                </div>

                {/* Center point */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-white rounded-full shadow-lg animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping" />
                </div>

                {/* Eye overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                    <Eye className="relative w-20 h-20 md:w-24 md:h-24 text-white/80" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>

            {/* Phase indicator */}
            <div className="mt-8 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
              <p className="text-white font-semibold text-lg">
                {isCompleted ? '✅ Complete!' : isHolding ? '🎯 Hold Steady!' : fillProgress > 0 ? '💧 Keep Holding...' : '👁️ Press & Hold Below'}
              </p>
            </div>
          </div>

          {/* Tip box */}
          {showTip && (
            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 shadow-lg animate-pulse">
              <p className="text-yellow-200 text-center font-medium flex items-center justify-center gap-2">
                💡 Pro Tip: Break eye contact naturally every 5-7 seconds
              </p>
            </div>
          )}

          {/* Control buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              disabled={isCompleted}
              className={`px-12 py-6 bg-gradient-to-r text-white text-xl font-bold rounded-2xl shadow-2xl transform transition-all duration-300 flex items-center gap-3 border-2 border-white/30 select-none ${
                isCompleted 
                  ? 'from-gray-600 to-gray-700 cursor-not-allowed opacity-50' 
                  : isHolding 
                    ? 'from-green-600 to-emerald-600 scale-95 shadow-green-500/50' 
                    : 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-105 active:scale-95 shadow-purple-500/50'
              }`}
            >
              <Eye className="w-7 h-7" />
              {isHolding ? '🎯 Holding...' : '👆 Press & Hold to Fill'}
            </button>
            
            {(isCompleted || reps > 0 || fillProgress > 0) && (
              <button
                onClick={resetPractice}
                className="px-10 py-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-slate-500/50 transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-white/30"
              >
                <RotateCcw className="w-6 h-6" />
                Reset
              </button>
            )}
          </div>

          {/* Success message */}
          {isCompleted && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-green-500/30 rounded-full">
                  <Check className="w-8 h-8 text-green-300" />
                </div>
                <p className="text-green-200 text-lg font-semibold">
                  Well done, {userName}! You've completed the practice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const EyeContactTrainer: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(true);

  const handleStart = (name: string) => {
    if (!name.trim()) return;
    setUserName(name);
    setShowNameInput(false);
  };

  return showNameInput ? (
    <NameInputScreen onStart={handleStart} />
  ) : (
    <PracticeScreen userName={userName} />
  );
};

export default EyeContactTrainer;