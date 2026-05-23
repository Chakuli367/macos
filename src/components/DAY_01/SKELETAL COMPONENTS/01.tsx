import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles, Target, Award, TrendingUp, Zap, Users, Brain, Heart, Trophy, Star, Clock, MessageCircle } from "lucide-react";

const OpenBodyLanguage = ({ onNext }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [checklist, setChecklist] = useState({
    arms: false,
    shoulders: false,
    breathing: false
  });
  const [pulseScale, setPulseScale] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [armAngle, setArmAngle] = useState(45);
  const [pageAnimating, setPageAnimating] = useState(false);
  const [showTrailer, setShowTrailer] = useState(true);


  useEffect(() => {
    // Hide trailer after 3 seconds
    const timer = setTimeout(() => {
      setShowTrailer(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(prev => prev === 1 ? 1.15 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Arm relaxation animation
  useEffect(() => {
    if (checklist.arms) {
      const interval = setInterval(() => {
        setArmAngle(prev => Math.max(prev - 2, 15));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [checklist.arms]);

  const toggleCheck = (key) => {
    setChecklist(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      if (Object.values(newState).every(v => v)) {
        setShowSuccess(true);
      }
      return newState;
    });
  };

  const allChecked = Object.values(checklist).every(v => v);

  const changePage = (newPage) => {
    setPageAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageAnimating(false);
    }, 300);
  };

  const pages = [
    {
      title: "First Impressions Matter",
      subtitle: "The 7-Second Rule",
      icon: <Zap className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                <Clock className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100 animate-fade-in">First Impressions Are Everything</h3>
                <p className="text-xs md:text-sm text-purple-300 animate-fade-in-delay-1">You have 7 seconds to make an impact</p>
              </div>
            </div>
            
            <div className="space-y-4 animate-fade-in-delay-2">
              <div className="p-4 md:p-5 bg-purple-950/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-slide-in-right">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl md:text-5xl animate-pulse">⚡</div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-purple-100 mb-2">7 seconds</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Research shows that people form judgments about you within the first 7 seconds of meeting you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-purple-950/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl md:text-5xl animate-bounce-slow">💪</div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-purple-100 mb-2">55% of communication</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Your body language accounts for over 55% of communication, making it more powerful than your actual words.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 hover:border-green-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-2">
                <div className="flex items-start gap-3">
                  <div className="text-4xl md:text-5xl animate-pulse">🚀</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">The Power of Open Body Language</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Open body language signals confidence, trustworthiness, and approachability. It literally opens the door to better relationships, opportunities, and social connections.
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
      title: "What Science Says",
      subtitle: "Evidence-Based Benefits",
      icon: <Brain className="w-6 h-6 md:w-7 md:h-7 text-cyan-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <Award className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 animate-spin-slow" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">What Science Says</h3>
            </div>
            
            <div className="space-y-4 md:space-y-5">
              <div className="group p-4 md:p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl md:rounded-2xl border-2 border-green-700/30 hover:border-green-500/50 transition-all hover:scale-[1.03] hover:shadow-2xl animate-slide-in-left">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2 group-hover:text-green-50 transition-colors">
                      Increases perceived confidence by 40%
                    </p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Open posture makes you appear more self-assured and capable
                    </p>
                    <div className="mt-3 h-2 bg-green-950/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-progress-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group p-4 md:p-6 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl md:rounded-2xl border-2 border-blue-700/30 hover:border-blue-500/50 transition-all hover:scale-[1.03] hover:shadow-2xl animate-slide-in-left animation-delay-1">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold text-blue-100 mb-2 group-hover:text-blue-50 transition-colors">
                      Reduces stress hormones by 25%
                    </p>
                    <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                      Your posture actually changes your brain chemistry
                    </p>
                    <div className="mt-3 h-2 bg-blue-950/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-progress-25" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl md:rounded-2xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.03] hover:shadow-2xl animate-slide-in-left animation-delay-2">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2 group-hover:text-purple-50 transition-colors">
                      Improves rapport and trust
                    </p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      People are 3x more likely to approach someone with open body language
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400 animate-pulse" />
                      <div className="flex-1 h-2 bg-purple-950/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-progress-100" />
                      </div>
                      <span className="text-purple-300 text-sm font-bold">3x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Cost of Closed Body Language",
      subtitle: "What You're Losing",
      icon: <Heart className="w-6 h-6 md:w-7 md:h-7 text-red-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-red-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <div className="text-5xl md:text-6xl animate-shake">⚠️</div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-100">The Cost of Closed Body Language</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 animate-fade-in">
                <p className="text-sm md:text-base text-orange-200 leading-relaxed mb-4">
                  Crossed arms, hunched shoulders, and shallow breathing send powerful negative signals. They make you appear defensive, anxious, or unapproachable.
                </p>
                <p className="text-sm md:text-base text-orange-200 leading-relaxed font-medium">
                  This can cost you job opportunities, romantic connections, friendships, and professional advancement. Many people don't even realize they're doing it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 animate-fade-in-delay-1">
                <div className="p-4 bg-red-950/30 rounded-xl border border-red-700/30 hover:border-red-500/50 transition-all hover:scale-105 animate-slide-in-right">
                  <div className="text-3xl md:text-4xl mb-2 animate-bounce-slow">💼</div>
                  <p className="text-sm md:text-base font-bold text-red-100 mb-1">Career Impact</p>
                  <p className="text-xs md:text-sm text-red-300">Missed job opportunities & promotions</p>
                </div>

                <div className="p-4 bg-red-950/30 rounded-xl border border-red-700/30 hover:border-red-500/50 transition-all hover:scale-105 animate-slide-in-right animation-delay-1">
                  <div className="text-3xl md:text-4xl mb-2 animate-bounce-slow">💔</div>
                  <p className="text-sm md:text-base font-bold text-red-100 mb-1">Social Life</p>
                  <p className="text-xs md:text-sm text-red-300">Fewer romantic & friendship connections</p>
                </div>

                <div className="p-4 bg-red-950/30 rounded-xl border border-red-700/30 hover:border-red-500/50 transition-all hover:scale-105 animate-slide-in-right animation-delay-2">
                  <div className="text-3xl md:text-4xl mb-2 animate-bounce-slow">😰</div>
                  <p className="text-sm md:text-base font-bold text-red-100 mb-1">Mental Health</p>
                  <p className="text-xs md:text-sm text-red-300">Increased stress & anxiety levels</p>
                </div>

                <div className="p-4 bg-red-950/30 rounded-xl border border-red-700/30 hover:border-red-500/50 transition-all hover:scale-105 animate-slide-in-right animation-delay-3">
                  <div className="text-3xl md:text-4xl mb-2 animate-bounce-slow">🚫</div>
                  <p className="text-sm md:text-base font-bold text-red-100 mb-1">First Impressions</p>
                  <p className="text-xs md:text-sm text-red-300">Seen as defensive or untrustworthy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Master the Three Pillars",
      subtitle: "Interactive Practice Session",
      icon: <Target className="w-6 h-6 md:w-7 md:h-7 text-purple-300" />,
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-purple-500/30 mb-6 md:mb-8 animate-slide-in-up">
            <h3 className="text-lg md:text-xl font-bold text-purple-100 mb-3">Three Elements to Master</h3>
            <p className="text-sm md:text-base text-purple-200 leading-relaxed">
              Open body language is built on three fundamental pillars. Practice each one below and watch how they transform your presence.
            </p>
          </div>

          

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-purple-500/30 animate-fade-in-delay-2">
            <h3 className="text-lg md:text-xl font-bold text-purple-100 mb-4 md:mb-5">Click each to practice:</h3>
            <div className="space-y-3 md:space-y-4">
              {[
                { 
                  key: 'arms', 
                  label: 'Uncross Your Arms', 
                  tip: 'Keep arms relaxed at your sides or use natural gestures',
                  why: 'Crossed arms create a physical barrier and signal defensiveness',
                  icon: '🤲'
                },
                { 
                  key: 'shoulders', 
                  label: 'Relax Your Shoulders', 
                  tip: 'Roll them back and down, away from your ears',
                  why: 'Tense shoulders signal stress and reduce confidence',
                  icon: '💆'
                },
                { 
                  key: 'breathing', 
                  label: 'Breathe Steadily & Deeply', 
                  tip: 'Slow, diaphragmatic breaths from your belly',
                  why: 'Deep breathing calms your nervous system instantly',
                  icon: '🫁'
                }
              ].map(({ key, label, tip, why, icon }, idx) => (
                <button
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl md:rounded-2xl transition-all border-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] animate-slide-in-left ${
                    checklist[key]
                      ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50 animate-pulse-success'
                      : 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30 hover:border-purple-400/50'
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 animate-bounce-slow">
                      {checklist[key] ? (
                        <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-green-400" />
                      ) : (
                        <Circle className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <span className="text-2xl md:text-3xl animate-wiggle">{icon}</span>
                        <p className={`font-bold text-base md:text-lg transition-colors ${checklist[key] ? 'text-green-300' : 'text-purple-100'}`}>
                          {label}
                        </p>
                      </div>
                      <p className="text-xs md:text-sm text-purple-300 font-medium mb-2 bg-purple-950/30 px-3 py-1.5 rounded-lg">{tip}</p>
                      <p className="text-xs md:text-sm text-purple-400 italic">{why}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {allChecked && (
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl text-center border-2 border-green-400/50 animate-slide-in-up">
              <div className="text-5xl md:text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-pulse">Excellent Work!</h3>
              <p className="text-base md:text-lg text-green-100">You've mastered the three pillars! Practice daily for 21 days to make them automatic.</p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Ready for Your Next Task",
      subtitle: "How to Approach Your Next Challenge",
      icon: <Trophy className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                <Trophy className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">You're Ready! 🚀</h3>
                <p className="text-xs md:text-sm text-purple-300">Here's how to apply what you learned</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-right">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-blue-100 mb-2">Before You Start</p>
                    <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                      Take 2 minutes to practice your open body language. Stand tall, uncross your arms, roll your shoulders back, and take 3 deep breaths. Feel the confidence building.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border-2 border-purple-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-1">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">During the Interaction</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Maintain your open posture throughout. If you notice yourself closing up, gently readjust. Remember: your body language is doing half the communication for you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-2">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">After You Finish</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Reflect on how it felt. Did people respond differently to you? Log your experience and celebrate your progress. Every interaction is practice!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-xl border-2 border-orange-700/30 animate-slide-in-up animation-delay-3">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 animate-spin-slow" />
                  <p className="text-lg md:text-xl font-bold text-orange-100">Pro Tip</p>
                </div>
                <p className="text-sm md:text-base text-orange-200 leading-relaxed">
                  Set a reminder on your phone every hour to check your posture. This simple habit will transform your body language in just one week. Your confidence will skyrocket! 🚀
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl border-2 border-pink-700/30 animate-slide-in-up animation-delay-4">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-pink-400 animate-bounce-slow" />
                  <p className="text-lg md:text-xl font-bold text-pink-100">Remember</p>
                </div>
                <p className="text-sm md:text-base text-pink-200 leading-relaxed mb-3">
                  Open body language isn't just about looking confident—it's about BECOMING confident. Your physiology shapes your psychology.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-pink-950/50 rounded-full text-xs md:text-sm text-pink-200 border border-pink-700/30">Progress over perfection</span>
                  <span className="px-3 py-1.5 bg-pink-950/50 rounded-full text-xs md:text-sm text-pink-200 border border-pink-700/30">Practice makes permanent</span>
                  <span className="px-3 py-1.5 bg-pink-950/50 rounded-full text-xs md:text-sm text-pink-200 border border-pink-700/30">You've got this!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (showTrailer) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #4a2c6d 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '-200px',
        right: '-150px',
        filter: 'blur(80px)',
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(75, 0, 130, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        bottom: '-150px',
        left: '-100px',
        filter: 'blur(80px)',
      }}></div>

      {/* Navigation */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <button style={{
          background: 'rgba(138, 43, 226, 0.2)',
          border: '1px solid rgba(138, 43, 226, 0.3)',
          color: '#e0d0ff',
          padding: '10px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}>
          ← Prev
        </button>
        <button style={{
          background: 'rgba(138, 43, 226, 0.2)',
          border: '1px solid rgba(138, 43, 226, 0.3)',
          color: '#e0d0ff',
          padding: '10px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}>
          Next →
        </button>
        <button style={{
          background: 'rgba(138, 43, 226, 0.2)',
          border: '1px solid rgba(138, 43, 226, 0.3)',
          color: '#e0d0ff',
          padding: '10px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}>
          ✕ Quit
        </button>
      </div>

      {/* Main Content Card */}
      <div style={{
        backgroundColor: 'rgba(45, 27, 78, 0.4)',
        backdropFilter: 'blur(20px)',
        padding: '50px 40px',
        borderRadius: '30px',
        textAlign: 'center',
        color: '#fff',
        fontFamily: '"Inter", sans-serif',
        maxWidth: '650px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        animation: 'slideUp 0.6s ease-out',
      }}>
        {/* Main Heading */}
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '20px',
          fontWeight: '700',
          lineHeight: '1.3',
          letterSpacing: '-0.5px',
        }}>
          Now I'm just gonna share a few{' '}
          <span style={{
            background: 'linear-gradient(135deg, #b19cd9 0%, #d4a5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
          }}>
            basic principles
          </span>{' '}
          for communication.
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '30px',
          opacity: '0.95',
          fontWeight: '400',
          color: '#e0d0ff',
        }}>
          It may seem very simple but is very{' '}
          <span style={{
            fontWeight: '700',
            color: '#c4a7ff',
          }}>
            important
          </span>.
        </p>

        {/* Principles Box */}
        <div style={{
          fontSize: '1rem',
          margin: '25px 0',
          padding: '25px',
          background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.3) 0%, rgba(138, 43, 226, 0.2) 100%)',
          borderRadius: '20px',
          lineHeight: '1.8',
          border: '1px solid rgba(138, 43, 226, 0.3)',
        }}>
          <p style={{ marginBottom: '10px' }}>
            These principles are about{' '}
            <span style={{ fontWeight: '600', color: '#d4a5ff' }}>
              listening actively
            </span>,
          </p>
          <p style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: '600', color: '#c4a7ff' }}>
              expressing yourself clearly
            </span>,
          </p>
          <p>
            and{' '}
            <span style={{ fontWeight: '600', color: '#b19cd9' }}>
              connecting genuinely
            </span>{' '}
            with others.
          </p>
        </div>

        {/* Benefits Box */}
        <div style={{
          fontSize: '0.95rem',
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.25) 0%, rgba(138, 43, 226, 0.15) 100%)',
          borderRadius: '20px',
          lineHeight: '1.7',
          border: '1px solid rgba(138, 43, 226, 0.25)',
          color: '#e0d0ff',
        }}>
          <p>
            Following them helps you <strong style={{ color: '#d4a5ff' }}>avoid misunderstandings</strong>, <strong style={{ color: '#d4a5ff' }}>build trust</strong>, and make conversations feel <strong style={{ color: '#d4a5ff' }}>natural and meaningful</strong>.
          </p>
        </div>

        {/* CTA Button */}
        <button style={{
          marginTop: '35px',
          background: 'linear-gradient(135deg, #7b2cbf 0%, #9d4edd 50%, #c77dff 100%)',
          border: 'none',
          color: '#fff',
          padding: '16px 40px',
          borderRadius: '16px',
          cursor: 'pointer',
          fontFamily: '"Inter", sans-serif',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 10px 30px rgba(138, 43, 226, 0.5)',
          transition: 'all 0.3s ease',
          letterSpacing: '0.5px',
        }}>
          Set Your Times
        </button>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(138, 43, 226, 0.6);
          background: rgba(138, 43, 226, 0.3);
        }
      `}</style>
    </div>
  );
}




  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-20 overflow-hidden">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes success-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
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
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes progress-40 {
          from { width: 0%; }
          to { width: 40%; }
        }
        @keyframes progress-25 {
          from { width: 0%; }
          to { width: 25%; }
        }
        @keyframes progress-100 {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s backwards;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s backwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-progress-40 {
          animation: progress-40 1.5s ease-out forwards;
        }
        .animate-progress-25 {
          animation: progress-25 1.5s ease-out forwards;
        }
        .animate-progress-100 {
          animation: progress-100 2s ease-out forwards;
        }
        .animate-pulse-success {
          animation: pulse-success 2s ease-in-out infinite;
        }
        .animation-delay-1 {
          animation-delay: 0.15s;
        }
        .animation-delay-2 {
          animation-delay: 0.3s;
        }
        .animation-delay-3 {
          animation-delay: 0.45s;
        }
        .animation-delay-4 {
          animation-delay: 0.6s;
        }

        .page-transition-enter {
          animation: slide-in-up 0.4s ease-out;
        }
        .page-transition-exit {
          animation: fade-in 0.3s ease-out reverse;
        }
      `}</style>

      {/* Floating particles background */}
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
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-300 animate-spin-slow" />
              <span className="text-sm md:text-base font-bold text-purple-100">Social Skills Module</span>
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
                  ? 'w-12 md:w-16 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                  : 'w-2 md:w-2.5 bg-purple-700/50 hover:bg-purple-600/70'
              }`}
            />
          ))}
        </div>

        {/* Page Header */}
        <div className={`text-center mb-6 md:mb-8 ${pageAnimating ? 'page-transition-exit' : 'page-transition-enter'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-bounce-slow">
              {pages[currentPage].icon}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              {pages[currentPage].title}
            </h1>
          </div>
          <p className="text-sm md:text-base lg:text-lg text-purple-300 font-medium animate-fade-in-delay-1">
            {pages[currentPage].subtitle}
          </p>
        </div>

        {/* Page Content */}
        <div className={`mb-8 md:mb-10 ${pageAnimating ? 'page-transition-exit' : 'page-transition-enter'}`}>
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

          <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 bg-purple-900/40 rounded-full border-2 border-purple-500/30 backdrop-blur-sm">
            <span className="text-sm md:text-base font-bold text-purple-200">
              {currentPage + 1} / {pages.length}
            </span>
          </div>

          {currentPage < pages.length - 1 ? (
            <button
              onClick={() => changePage(Math.min(pages.length - 1, currentPage + 1))}
              className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl md:rounded-2xl transition-all shadow-xl font-bold text-sm md:text-base border-2 border-purple-400/30 hover:scale-105 active:scale-95"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <button 
              onClick={onNext}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-xl font-bold text-sm md:text-base border-2 hover:scale-105 active:scale-95 ${
                allChecked 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-green-400/50 animate-pulse-slow' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-purple-400/30'
              }`}
            >
              {allChecked ? (
                <>
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Complete Module</span>
                  <span className="sm:hidden">Complete</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Continue Anyway</span>
                  <span className="sm:hidden">Continue</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {currentPage === pages.length - 2 && !allChecked && (
          <p className="text-center text-amber-400 font-medium mt-4 md:mt-6 text-xs md:text-sm bg-amber-900/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-amber-500/30 max-w-md mx-auto animate-pulse">
            💡 Complete all three practices for the full experience!
          </p>
        )}

        {currentPage === pages.length - 2 && allChecked && (
          <p className="text-center text-green-400 font-bold mt-4 md:mt-6 text-sm md:text-base bg-green-900/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-green-500/30 max-w-md mx-auto animate-bounce-slow">
            🎉 Amazing! You're ready for the next skill!
          </p>
        )}

        {currentPage === pages.length - 1 && (
          <p className="text-center text-purple-300 font-medium mt-4 md:mt-6 text-xs md:text-sm bg-purple-900/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-500/30 max-w-md mx-auto animate-fade-in animation-delay-2">
            ✨ You've completed this module! Click "Complete Module" to continue your journey.
          </p>
        )}
      </div>
    </div>
  );
};

export default OpenBodyLanguage;