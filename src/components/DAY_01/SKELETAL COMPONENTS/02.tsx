import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles, Target, Award, Brain, Heart, Zap, Users, Star, Smile, Frown, Meh, Camera, Trophy, TrendingUp, AlertCircle } from "lucide-react";

const SmileWarmUp = ({ onNext }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [smileLevel, setSmileLevel] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);
  const [holdTimer, setHoldTimer] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({
    polite: false,
    warm: false,
    enthusiastic: false
  });
  const [pageAnimating, setPageAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Hold timer effect
  useEffect(() => {
    let interval;
    if (isHolding && holdTimer < 10) {
      interval = setInterval(() => {
        setHoldTimer(prev => {
          if (prev >= 10) {
            setIsHolding(false);
            setShowSparkles(true);
            setTimeout(() => setShowSparkles(false), 2000);
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdTimer]);

  const changePage = (newPage) => {
    setPageAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageAnimating(false);
    }, 300);
  };

  const practiceSmile = (type) => {
    setPracticeCount(prev => prev + 1);
    setCompletedExercises(prev => ({ ...prev, [type]: true }));
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1500);
  };

  const startHolding = () => {
    setIsHolding(true);
    setHoldTimer(0);
  };

  const stopHolding = () => {
    setIsHolding(false);
  };

  const allExercisesComplete = Object.values(completedExercises).every(v => v);

  const getSmileEmoji = (level) => {
    if (level === 0) return "😐";
    if (level === 1) return "🙂";
    if (level === 2) return "😊";
    return "😄";
  };

  const getSmilePath = (level) => {
    const baseY = 70;
    const curves = {
      0: `M 30 ${baseY} Q 50 ${baseY} 70 ${baseY}`,
      1: `M 30 ${baseY} Q 50 ${baseY + 5} 70 ${baseY}`,
      2: `M 30 ${baseY} Q 50 ${baseY + 10} 70 ${baseY}`,
      3: `M 30 ${baseY} Q 50 ${baseY + 15} 70 ${baseY}`
    };
    return curves[level] || curves[0];
  };

  const pages = [
    {
      title: "Why Smiling Matters",
      subtitle: "The Universal Language of Connection",
      icon: <Heart className="w-6 h-6 md:w-7 md:h-7 text-pink-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                <Smile className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100 animate-fade-in">The Power of a Smile</h3>
                <p className="text-xs md:text-sm text-purple-300 animate-fade-in-delay-1">Your most powerful social tool</p>
              </div>
            </div>
            
            <div className="space-y-4 animate-fade-in-delay-2">
              <div className="p-4 md:p-5 bg-purple-950/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-slide-in-right">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl md:text-5xl animate-pulse">🧠</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">Instant Mood Booster</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Smiling triggers the release of dopamine, endorphins, and serotonin—your brain's natural happiness chemicals. Even forcing a smile can improve your mood.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-purple-950/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl md:text-5xl animate-bounce-slow">🤝</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">Makes You Instantly Likeable</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Research shows that people who smile are perceived as more trustworthy, competent, and attractive. You're 33% more approachable when smiling.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 hover:border-green-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-2">
                <div className="flex items-start gap-3">
                  <div className="text-4xl md:text-5xl animate-wiggle">✨</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">Contagious Positivity</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Mirror neurons make smiling contagious. When you smile at someone, their brain automatically wants to smile back. You literally spread happiness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Science of Genuine Smiles",
      subtitle: "Duchenne vs Fake Smiles",
      icon: <Brain className="w-6 h-6 md:w-7 md:h-7 text-cyan-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 animate-pulse" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">What Makes a Smile Genuine?</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl md:rounded-2xl p-5 md:p-6 border-2 border-green-700/30 animate-slide-in-left">
                <div className="text-6xl md:text-7xl mb-4 text-center animate-bounce-slow">😊</div>
                <h4 className="text-lg md:text-xl font-bold text-green-100 mb-3 text-center">Duchenne Smile (Genuine)</h4>
                <ul className="space-y-2 text-sm md:text-base text-green-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Eyes crinkle with crow's feet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Cheeks rise naturally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Whole face lights up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Lasts 0.5-4 seconds naturally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Symmetrical on both sides</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-xl md:rounded-2xl p-5 md:p-6 border-2 border-red-700/30 animate-slide-in-right">
                <div className="text-6xl md:text-7xl mb-4 text-center animate-shake">😬</div>
                <h4 className="text-lg md:text-xl font-bold text-red-100 mb-3 text-center">Fake Smile (Social)</h4>
                <ul className="space-y-2 text-sm md:text-base text-red-200">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Eyes remain unchanged</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Only mouth moves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Feels forced or stiff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Held too long or too brief</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>May look asymmetrical</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 md:p-5 bg-blue-950/40 rounded-xl border-2 border-blue-700/30 animate-fade-in animation-delay-2">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <p className="text-lg md:text-xl font-bold text-blue-100">The Secret</p>
              </div>
              <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                The key to a genuine smile is engaging the orbicularis oculi muscle around your eyes. This muscle is involuntary in genuine emotion, but with practice, you can activate it consciously to create authentic-looking smiles.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Common Smile Mistakes",
      subtitle: "What to Avoid",
      icon: <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-orange-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-orange-400 animate-pulse" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-100">Avoid These Mistakes</h3>
            </div>
            
            <div className="space-y-4">
  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl animate-shake">😁</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">
          Too Wide/Showing Too Much Gum
        </p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed break-words">
          An overly wide smile can look forced or manic. Aim for a natural width where your upper teeth show but not excessive gum tissue.
        </p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-1 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl">😬</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">
          Tight/Tense Smile
        </p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed break-words">
          Clenching your teeth or tensing your jaw makes you look uncomfortable or fake. Keep your facial muscles relaxed.
        </p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-2 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl">🙂</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">
          Dead Eyes (Mouth-Only Smile)
        </p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed break-words">
          Smiling only with your mouth while your eyes stay cold is the biggest giveaway of inauthenticity. Always engage your eyes.
        </p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-3 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl animate-wiggle">🥴</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">
          Asymmetrical/Crooked Smile
        </p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed break-words">
          One side higher than the other can signal insincerity or confusion. Practice symmetry in a mirror.
        </p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-4 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl">😐</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">
          Held Too Long
        </p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed break-words">
          A genuine smile naturally fades after 1-4 seconds. Holding it longer makes it look rehearsed or creepy.
        </p>
      </div>
    </div>
  </div>
</div>



            </div>
          </div>
        
      )
    },
    {
      title: "The Perfect Smile Formula",
      subtitle: "Master the Technique",
      icon: <Star className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 animate-spin-slow" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">The 5-Step Perfect Smile</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 md:p-6 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl md:rounded-2xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-left">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-blue-100 mb-2">Think of Something Pleasant</p>
                    <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                      Before smiling, recall a happy memory or think of someone you love. This activates genuine emotion that shows in your eyes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl md:rounded-2xl border-2 border-purple-700/30 hover:scale-[1.02] transition-all animate-slide-in-left animation-delay-1">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">Relax Your Jaw</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Let your jaw hang loose. Tension kills authenticity. Your mouth should feel comfortable, not strained.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl md:rounded-2xl border-2 border-green-700/30 hover:scale-[1.02] transition-all animate-slide-in-left animation-delay-2">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">Engage Your Eyes First</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Let the smile start in your eyes. Imagine pushing your cheeks up with your eyes. This creates natural crow's feet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-xl md:rounded-2xl border-2 border-orange-700/30 hover:scale-[1.02] transition-all animate-slide-in-left animation-delay-3">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-orange-100 mb-2">Lift Your Cheeks Naturally</p>
                    <p className="text-sm md:text-base text-orange-200 leading-relaxed">
                      Let your mouth corners rise as your cheeks lift. Don't force your mouth wide—let it follow your cheeks naturally.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl md:rounded-2xl border-2 border-pink-700/30 hover:scale-[1.02] transition-all animate-slide-in-left animation-delay-4">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl flex-shrink-0">
                    5
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-pink-100 mb-2">Hold for 1-3 Seconds, Then Release</p>
                    <p className="text-sm md:text-base text-pink-200 leading-relaxed">
                      A genuine smile isn't permanent. Let it fade naturally after a moment, then you can smile again if appropriate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 md:p-5 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl border-2 border-yellow-700/30 animate-fade-in animation-delay-4">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400 animate-bounce-slow" />
                <p className="text-lg md:text-xl font-bold text-yellow-100">Pro Tip</p>
              </div>
              <p className="text-sm md:text-base text-yellow-200 leading-relaxed">
                Practice in front of a mirror daily for 2 minutes. Record yourself to see how your smile looks to others. Muscle memory develops in 21 days!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Practice",
      subtitle: "Master Different Smile Types",
      icon: <Target className="w-6 h-6 md:w-7 md:h-7 text-purple-300" />,
      content: (
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <h3 className="text-lg md:text-xl font-bold text-purple-100 mb-3">Practice Makes Perfect</h3>
            <p className="text-sm md:text-base text-purple-200 leading-relaxed mb-5">
              Master these three essential smile types. Click each to practice and track your progress!
            </p>

            {/* Smile Level Adjuster */}
            <div className="mb-6 md:mb-8 p-5 md:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl md:rounded-2xl border-2 border-purple-700/30 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm md:text-base font-bold text-purple-100">Adjust Smile Intensity</p>
                <span className="text-2xl md:text-3xl animate-bounce-slow">{getSmileEmoji(smileLevel)}</span>
              </div>
              
              {/* Animated SVG Face */}
              <div className="mb-4 flex justify-center">
                <svg width="120" height="120" viewBox="0 0 100 100" className="animate-float">
                  <circle cx="50" cy="50" r="45" fill="url(#faceGradient)" stroke="#a78bfa" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  {/* Eyes */}
                  <ellipse cx="35" cy="40" rx="3" ry={smileLevel > 0 ? 2 : 4} fill="#4c1d95" className="animate-blink"/>
                  <ellipse cx="65" cy="40" rx="3" ry={smileLevel > 0 ? 2 : 4} fill="#4c1d95" className="animate-blink animation-delay-1"/>
                  {/* Crow's feet when smiling */}
                  {smileLevel > 1 && (
                    <>
                      <path d="M 28 38 L 25 35" stroke="#9333ea" strokeWidth="1.5" className="animate-fade-in"/>
                      <path d="M 28 42 L 25 45" stroke="#9333ea" strokeWidth="1.5" className="animate-fade-in"/>
                      <path d="M 72 38 L 75 35" stroke="#9333ea" strokeWidth="1.5" className="animate-fade-in"/>
                      <path d="M 72 42 L 75 45" stroke="#9333ea" strokeWidth="1.5" className="animate-fade-in"/>
                    </>
                  )}
                  {/* Smile mouth */}
                  <path d={getSmilePath(smileLevel)} stroke="#4c1d95" strokeWidth="2.5" fill="none" strokeLinecap="round" className="transition-all duration-500"/>
                  {/* Cheek blush when smiling */}
                  {smileLevel > 1 && (
                    <>
                      <circle cx="25" cy="55" r="8" fill="#ec4899" opacity="0.3" className="animate-pulse"/>
                      <circle cx="75" cy="55" r="8" fill="#ec4899" opacity="0.3" className="animate-pulse"/>
                    </>
                  )}
                </svg>
              </div>

              <input
                type="range"
                min="0"
                max="3"
                value={smileLevel}
                onChange={(e) => setSmileLevel(Number(e.target.value))}
                className="w-full h-3 bg-purple-950/50 rounded-full appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs md:text-sm text-purple-300 mt-2">
                <span>Neutral</span>
                <span>Polite</span>
                <span>Warm</span>
                <span>Enthusiastic</span>
              </div>
            </div>

            {/* Practice Cards */}
            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl md:rounded-2xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-right">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">🙂</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-blue-100">Polite Smile</p>
                      <p className="text-xs md:text-sm text-blue-300">For strangers & acquaintances</p>
                    </div>
                  </div>
                  {completedExercises.polite && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <p className="text-sm md:text-base text-blue-200 mb-4">
                  Gentle, closed-mouth smile. Eyes slightly engaged. Hold for 1-2 seconds.
                </p>
                <button
                  onClick={() => practiceSmile('polite')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Polite Smile
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl md:rounded-2xl border-2 border-purple-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">😊</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-purple-100">Warm Smile</p>
                      <p className="text-xs md:text-sm text-purple-300">For friends & colleagues</p>
                    </div>
                  </div>
                  {completedExercises.warm && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <p className="text-sm md:text-base text-purple-200 mb-4">
                  Teeth showing, eyes fully engaged with crow's feet. Natural and inviting. Hold 2-3 seconds.
                </p>
                <button
                  onClick={() => practiceSmile('warm')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Warm Smile
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-xl md:rounded-2xl border-2 border-orange-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">😄</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-orange-100">Enthusiastic Smile</p>
                      <p className="text-xs md:text-sm text-orange-300">For celebrations & excitement</p>
                    </div>
                  </div>
                  {completedExercises.enthusiastic && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <p className="text-sm md:text-base text-orange-200 mb-4">
                  Big, bright smile with full teeth showing. Eyes sparkling. Maximum warmth and energy!
                </p>
                <button
                  onClick={() => practiceSmile('enthusiastic')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Enthusiastic Smile
                </button>
              </div>
            </div>

            {/* Hold Challenge */}
            <div className="mt-6 p-5 md:p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl md:rounded-2xl border-2 border-green-700/30 animate-fade-in animation-delay-3">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 animate-bounce-slow" />
                <p className="text-lg md:text-xl font-bold text-green-100">Challenge: Hold Your Smile</p>
              </div>
              <p className="text-sm md:text-base text-green-200 mb-4">
                Can you hold a genuine smile for 10 seconds? Press and hold the button!
              </p>
              <button
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                className={`w-full px-4 py-4 rounded-xl font-bold transition-all shadow-lg ${
                  isHolding
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 scale-105'
                    : holdTimer >= 10
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600'
                    : 'bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                {holdTimer >= 10 ? '🎉 Challenge Complete!' : isHolding ? `Hold... ${holdTimer.toFixed(1)}s` : 'Press & Hold to Start'}
              </button>
              {holdTimer > 0 && holdTimer < 10 && (
                <div className="mt-3 h-3 bg-green-950/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-100"
                    style={{ width: `${(holdTimer / 10) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <p className="text-3xl md:text-4xl font-bold text-purple-100 mb-1">{practiceCount}</p>
                <p className="text-xs md:text-sm text-purple-300">Smiles Practiced</p>
              </div>
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <p className="text-3xl md:text-4xl font-bold text-purple-100 mb-1">
                  {Object.values(completedExercises).filter(v => v).length}/3
                </p>
                <p className="text-xs md:text-sm text-purple-300">Types Mastered</p>
              </div>
            </div>

            {allExercisesComplete && (
              <div className="mt-6 p-5 md:p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl md:rounded-2xl border-2 border-green-400/50 text-center animate-slide-in-up">
                <div className="text-5xl md:text-6xl mb-3 animate-bounce">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">You're a Smile Master!</h3>
                <p className="text-sm md:text-base text-green-100">
                  You've practiced all three smile types. Remember to use them naturally in your daily interactions!
                </p>
              </div>
            )}
          </div>

          {/* Sparkle overlay */}
          {showSparkles && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-sparkle"
                  style={{
                    left: `${50 + Math.cos((i * Math.PI * 2) / 12) * 30}%`,
                    top: `${50 + Math.sin((i * Math.PI * 2) / 12) * 30}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: "Ready to Shine",
      subtitle: "Applying Your Smile in Real Life",
      icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">You're Ready to Shine! ✨</h3>
                <p className="text-xs md:text-sm text-purple-300">How to use your new skill</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-right">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-blue-100 mb-2">When Meeting Someone New</p>
                    <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                      Start with a polite smile as you approach. As you shake hands or greet them, transition to a warm smile. This shows you're friendly but not overeager.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border-2 border-purple-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-1">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">In Casual Conversations</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Use warm smiles throughout. Don't hold them constantly—let them come and go naturally as you listen and respond. Smile especially when the other person says something funny or interesting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-2">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">When Sharing Good News</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Break out the enthusiastic smile! Let your excitement show. This is when you want maximum energy and full engagement of eyes and mouth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-xl border-2 border-orange-700/30 animate-slide-in-up animation-delay-3">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 animate-spin-slow" />
                  <p className="text-lg md:text-xl font-bold text-orange-100">Cultural Tip</p>
                </div>
                <p className="text-sm md:text-base text-orange-200 leading-relaxed">
                  Different cultures have different smiling norms. In some cultures, excessive smiling can seem insincere. When in doubt, mirror the other person's smile intensity.
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl border-2 border-pink-700/30 animate-slide-in-up animation-delay-4">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 md:w-7 md:h-7 text-pink-400 animate-bounce-slow" />
                  <p className="text-lg md:text-xl font-bold text-pink-100">Daily Practice</p>
                </div>
                <p className="text-sm md:text-base text-pink-200 leading-relaxed mb-3">
                  Set a reminder to practice your smile 3 times a day in the mirror. Within a week, it will feel completely natural and automatic.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-pink-950/50 rounded-full text-xs md:text-sm text-pink-200 border border-pink-700/30">Morning routine</span>
                  <span className="px-3 py-1.5 bg-pink-950/50 rounded-full text-xs md:text-sm text-pink-200 border border-pink-700/30">Before social events</span>
                  <span className="px-3 py-1.5 bg-pink-950/50 rounded-full text-xs md:text-sm text-pink-200 border border-pink-700/30">Before bed</span>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-xl border-2 border-indigo-700/30 animate-slide-in-up animation-delay-5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-indigo-400 animate-pulse" />
                  <p className="text-lg md:text-xl font-bold text-indigo-100">Track Your Progress</p>
                </div>
                <p className="text-sm md:text-base text-indigo-200 leading-relaxed">
                  After each social interaction, note: Did I smile genuinely? Did others smile back? How did it affect the conversation? You'll see improvement in days!
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-20 overflow-hidden">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.1; }
        }
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }

        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-delay-1 { animation: fade-in 0.8s ease-out 0.2s backwards; }
        .animate-fade-in-delay-2 { animation: fade-in 0.8s ease-out 0.4s backwards; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out infinite; }
        .animate-blink { animation: blink 4s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1s ease-out forwards; }
        
        .animation-delay-1 { animation-delay: 0.15s; }
        .animation-delay-2 { animation-delay: 0.3s; }
        .animation-delay-3 { animation-delay: 0.45s; }
        .animation-delay-4 { animation-delay: 0.6s; }
        .animation-delay-5 { animation-delay: 0.75s; }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }
      `}</style>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-400 rounded-full opacity-20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
        <div className="px-4 md:px-6 lg:px-10 py-3 md:py-4">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-purple-800/40 backdrop-blur-sm rounded-full border-2 border-purple-500/30 animate-pulse-slow">
              <Smile className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 animate-bounce-slow" />
              <span className="text-sm md:text-base font-bold text-purple-100">Smile Warm-Up Module</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:px-10 lg:py-8 max-w-6xl mx-auto">
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8 animate-slide-in-up">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => changePage(idx)}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${
                idx === currentPage 
                  ? 'w-12 md:w-16 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg' 
                  : 'w-2 md:w-2.5 bg-purple-700/50 hover:bg-purple-600/70'
              }`}
            />
          ))}
        </div>

        {/* Page Header */}
        <div className={`text-center mb-6 md:mb-8 ${pageAnimating ? 'opacity-0' : 'animate-slide-in-up'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-bounce-slow">
              {pages[currentPage].icon}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-300 bg-clip-text text-transparent">
              {pages[currentPage].title}
            </h1>
          </div>
          <p className="text-sm md:text-base lg:text-lg text-purple-300 font-medium animate-fade-in-delay-1">
            {pages[currentPage].subtitle}
          </p>
        </div>

        {/* Page Content */}
        <div className={`mb-8 md:mb-10 ${pageAnimating ? 'opacity-0' : ''}`}>
          {pages[currentPage].content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 md:gap-4 max-w-3xl mx-auto animate-slide-in-up animation-delay-1">
          <button
            onClick={() => changePage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-purple-900/50 hover:bg-purple-800/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl md:rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all shadow-xl font-bold text-sm md:text-base backdrop-blur-sm hover:scale-105 active:scale-95"
          >
            
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex-1 text-center">
            <p className="text-xs md:text-sm text-purple-300 font-medium">
              Page {currentPage + 1} of {pages.length}
            </p>
          </div>

          {currentPage < pages.length - 1 ? (
            <button
              onClick={() => changePage(currentPage + 1)}
              className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl md:rounded-2xl border-2 border-purple-400/50 transition-all shadow-xl font-bold text-sm md:text-base backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl md:rounded-2xl border-2 border-green-400/50 transition-all shadow-xl font-bold text-sm md:text-base backdrop-blur-sm hover:scale-105 active:scale-95 animate-pulse"
            >
              <span>Complete Module</span>
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmileWarmUp;