import React, { useState, useEffect } from "react";
import { Sparkles, Heart, TrendingUp, Award, Download, RotateCcw, CheckCircle, AlertCircle, Lightbulb, Target, Flame, Trophy, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

const HandleSilence =  ({ onNext, lesson }) => {
  const [userName, setUserName] = useState("");
  const [showPermissionSlip, setShowPermissionSlip] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [selectedWorry, setSelectedWorry] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentReframe, setCurrentReframe] = useState(0);
  const [showWorryTool, setShowWorryTool] = useState(false);
  const [showReframes, setShowReframes] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("exhale");
  const [comfortZoneSize, setComfortZoneSize] = useState(60);
  // Breathing animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const worryExercises = [
    {
      worry: "What if I say something stupid?",
      reality: [
        "✅ They'll forget in 5 minutes",
        "✅ Everyone's done it",
        "✅ It shows you're human"
      ],
      reframe: "If I say something weird, I'll be memorable and authentic. Perfection is boring."
    },
    {
      worry: "What if they reject me?",
      reality: [
        "✅ Not everyone is a match",
        "✅ It's about compatibility, not worth",
        "✅ You'll survive and grow stronger"
      ],
      reframe: "Rejection is redirection toward better opportunities. Every 'no' brings me closer to 'yes'."
    },
    {
      worry: "What if there's awkward silence?",
      reality: [
        "✅ Silence is natural in conversations",
        "✅ It shows you're comfortable",
        "✅ It gives both people time to think"
      ],
      reframe: "Silence is confidence. I don't need to fill every second with noise."
    },
    {
      worry: "What if I embarrass myself?",
      reality: [
        "✅ Embarrassment fades quickly",
        "✅ People are focused on themselves",
        "✅ Vulnerability creates connection"
      ],
      reframe: "Embarrassing moments make the best stories. They prove I'm putting myself out there."
    }
  ];

  const failureReframes = [
    { front: "Got rejected", back: "Eliminated a mismatch early", color: "from-red-500/20 to-pink-500/20" },
    { front: "Awkward silence", back: "Showed I'm comfortable with stillness", color: "from-orange-500/20 to-amber-500/20" },
    { front: "Forgot their name", back: "Honest moment = authentic connection", color: "from-purple-500/20 to-indigo-500/20" },
    { front: "Joke didn't land", back: "Tested the room's humor with confidence", color: "from-blue-500/20 to-cyan-500/20" },
    { front: "Got ghosted", back: "Saved time on someone who wasn't right", color: "from-green-500/20 to-emerald-500/20" },
    { front: "Said something weird", back: "Showed my authentic personality", color: "from-pink-500/20 to-rose-500/20" }
  ];

  const encouragingMessages = [
    "Failure is feedback! 🎯",
    "You're building resilience! 💪",
    "Every attempt expands your comfort zone! 🌟",
    "Growth happens outside perfection! 🚀",
    "You tried - that's what matters! ✨",
    "Mistakes are proof you're learning! 📚",
    "Courage is trying despite fear! 🦁"
  ];

  const handleLogFailure = () => {
    setFailureCount(prev => prev + 1);
    setComfortZoneSize(prev => Math.min(prev + 2, 90));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const getResilienceLevel = () => {
    if (failureCount === 0) return { label: "Ready to Start", emoji: "🌱", color: "text-gray-400" };
    if (failureCount < 5) return { label: "Building Resilience", emoji: "🔥", color: "text-orange-400" };
    if (failureCount < 15) return { label: "Failure Veteran", emoji: "💎", color: "text-purple-400" };
    if (failureCount < 30) return { label: "Unstoppable Force", emoji: "⚡", color: "text-yellow-400" };
    return { label: "Rejection Immune", emoji: "👑", color: "text-pink-400" };
  };

  const resilienceLevel = getResilienceLevel();
  const randomMessage = encouragingMessages[failureCount % encouragingMessages.length];

  useEffect(() => {
  const interval = setInterval(() => {
    setComfortZoneSize(prev => Math.min(prev + 0.5, 100));
  }, 100);
  return () => clearInterval(interval);
}, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-20">

    {/* HEADER */}
    <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
      <div className="px-4 md:px-6 lg:px-10 py-4 md:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-purple-100">Failure is Your Superpower</h1>
              <p className="text-xs md:text-sm text-purple-300">Interactive Growth Therapy</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-100">{failureCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto">

      {/* HERO SECTION */}
      <div className="mb-6 md:mb-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">Growth Through Imperfection</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            You Will Fail Sometimes
          </h2>
          <p className="text-lg md:text-xl text-purple-200 mb-2">And That's Perfectly Okay</p>
          <p className="text-sm md:text-base text-purple-400 italic max-w-2xl mx-auto">
            Every successful person has failed more times than most people have tried. Your "failures" are proof you're living courageously.
          </p>
        </div>
      </div>

      {/* COMFORT ZONE EXPANSION */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-6 md:p-8 mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl md:text-2xl font-bold text-purple-100">Comfort Zone Expansion</h3>
        </div>

        <div className="flex items-center justify-center mb-6 relative h-64 md:h-80">
          {/* Outer circle - Growth Zone */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-purple-700/30 flex items-center justify-center">
              <span className="absolute top-4 text-xs md:text-sm text-purple-400 font-medium">Growth Zone</span>
            </div>
          </div>

          {/* Inner circle - Comfort Zone (animated auto-expand) */}
          <div 
            className="rounded-full bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-sm border-4 border-purple-400/50 shadow-2xl flex items-center justify-center transition-all duration-1000"
            style={{ 
              width: `${comfortZoneSize}%`, 
              height: `${comfortZoneSize}%`,
            }}
          >
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-2">Comfort Zone</p>
              <p className="text-sm md:text-base text-purple-200">{comfortZoneSize}% expanded</p>
            </div>
          </div>
        </div>

        <p className="text-center text-purple-300 text-sm md:text-base mb-6">
          Every "failure" expands your comfort zone. Watch it grow as you try new things!
        </p>

        {failureCount > 0 && (
          <div className="mt-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-white mb-2">
              {randomMessage}
            </p>
            <p className="text-purple-300 text-sm md:text-base">
              +10 XP • Resilience Level: <span className={`font-bold ${resilienceLevel.color}`}>
                {resilienceLevel.emoji} {resilienceLevel.label}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* WORRY DEFLATOR */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-6 md:p-8 mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl md:text-2xl font-bold text-purple-100">Anxiety Deflator</h3>
          </div>
          <button
            onClick={() => setShowWorryTool(!showWorryTool)}
            className="text-purple-400 hover:text-purple-300"
          >
            {showWorryTool ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>

        {showWorryTool && (
          <div className="space-y-4">
            <p className="text-purple-300 text-sm md:text-base mb-4">
              Select a common worry and watch it transform into empowerment:
            </p>

            <div className="grid gap-4">
              {worryExercises.map((exercise, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWorry(selectedWorry === idx ? null : idx)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    selectedWorry === idx
                      ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/50 shadow-xl'
                      : 'bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-white text-base md:text-lg">{exercise.worry}</p>
                    {selectedWorry === idx ? <ChevronUp className="w-5 h-5 text-orange-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
                  </div>

                  {selectedWorry === idx && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-purple-950/50 p-4 rounded-xl border border-purple-700/30">
                        <p className="text-sm font-bold text-purple-300 mb-3">Reality Check:</p>
                        <div className="space-y-2">
                          {exercise.reality.map((point, pIdx) => (
                            <p key={pIdx} className="text-sm text-purple-200">{point}</p>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border-2 border-green-400/50">
                        <p className="text-sm font-bold text-green-300 mb-2">Powerful Reframe:</p>
                        <p className="text-base text-white font-medium italic">"{exercise.reframe}"</p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAILURE REFRAMES */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-6 md:p-8 mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl md:text-2xl font-bold text-purple-100">Failure Reframes</h3>
          </div>
          <button
            onClick={() => setShowReframes(!showReframes)}
            className="text-purple-400 hover:text-purple-300"
          >
            {showReframes ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>

        {showReframes && (
          <>
            <p className="text-purple-300 text-sm md:text-base mb-6">
              Click any card to flip and see the empowering truth:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {failureReframes.map((reframe, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentReframe(currentReframe === idx ? -1 : idx)}
                  className="cursor-pointer perspective-1000"
                >
                  <div className={`relative h-40 md:h-48 transition-transform duration-500 transform-style-3d ${currentReframe === idx ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className={`absolute inset-0 backface-hidden p-6 rounded-2xl border-2 flex items-center justify-center ${currentReframe === idx ? 'invisible' : 'visible'} bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-400/30`}>
                      <p className="text-xl md:text-2xl font-bold text-white text-center">{reframe.front}</p>
                    </div>

                    {/* Back */}
                    <div className={`absolute inset-0 backface-hidden p-6 rounded-2xl border-2 flex items-center justify-center rotate-y-180 ${currentReframe === idx ? 'visible' : 'invisible'} bg-gradient-to-br ${reframe.color} border-green-400/30`}>
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <p className="text-lg md:text-xl font-bold text-white">{reframe.back}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* NEXT BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            if (onNext) onNext();
          }}
          className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
        >
          Finish Lesson
        </button>
      </div>

      {/* CONFETTI */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}
    </div>

    <style>{`
      .perspective-1000 {
        perspective: 1000px;
      }
      .transform-style-3d {
        transform-style: preserve-3d;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      .rotate-y-180 {
        transform: rotateY(180deg);
      }

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
    `}</style>
  </div>
);

};

export default HandleSilence;