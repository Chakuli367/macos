import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Mic, Volume2, VolumeX, Heart, Zap, Users, Star, TrendingUp, AlertCircle, Award, Brain, Radio, Waves, Activity, Target, Trophy, Sparkles, Play, Pause, RotateCcw } from "lucide-react";

const VoiceToneControl = ({ onNext }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnimating, setPageAnimating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState({
    warmth: false,
    confidence: false,
    energy: false,
    clarity: false
  });
  const [practiceCount, setPracticeCount] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [selectedTone, setSelectedTone] = useState(null);
  const [volumeLevel, setVolumeLevel] = useState(50);
  const [pitchLevel, setPitchLevel] = useState(50);
  const [paceLevel, setPaceLevel] = useState(50);
  const [audioWaves, setAudioWaves] = useState(Array(20).fill(30));

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 0.1);
        // Simulate audio waves
        setAudioWaves(prev => prev.map(() => Math.random() * 70 + 30));
      }, 100);
    } else {
      setRecordingTime(0);
      setAudioWaves(Array(20).fill(30));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const changePage = (newPage) => {
    setPageAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageAnimating(false);
    }, 300);
  };

  const practiceVoice = (type) => {
    setPracticeCount(prev => prev + 1);
    setCompletedExercises(prev => ({ ...prev, [type]: true }));
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
    }
  };

  const allExercisesComplete = Object.values(completedExercises).every(v => v);

  const getToneColor = (tone) => {
    const colors = {
      warmth: "from-pink-500 to-rose-600",
      confidence: "from-blue-500 to-indigo-600",
      energy: "from-orange-500 to-amber-600",
      clarity: "from-green-500 to-emerald-600"
    };
    return colors[tone] || "from-purple-500 to-pink-600";
  };

  const pages = [
    {
      title: "The Power of Your Voice",
      subtitle: "Your Voice is Your Superpower",
      icon: <Volume2 className="w-6 h-6 md:w-7 md:h-7 text-pink-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                <Mic className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100 animate-fade-in">Why Your Voice Matters</h3>
                <p className="text-xs md:text-sm text-purple-300 animate-fade-in-delay-1">More than just words</p>
              </div>
            </div>
            
            <div className="space-y-4 animate-fade-in-delay-2">
              <div className="p-4 md:p-5 bg-purple-950/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-slide-in-right">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl md:text-5xl animate-pulse">🎭</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">38% of Communication is Vocal</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Research shows that 38% of how people perceive you comes from your vocal tone, pitch, and pace—not your words. Your voice reveals confidence, warmth, and authenticity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-purple-950/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl md:text-5xl animate-bounce-slow">💎</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">Creates Instant Trust</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      A warm, steady voice activates trust centers in the listener's brain. People decide if they trust you within 7 seconds—and your voice is key.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 hover:border-green-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-2">
                <div className="flex items-start gap-3">
                  <div className="text-4xl md:text-5xl animate-wiggle">🔥</div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">Influences Emotions</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Your vocal tone can make people feel excited, calm, curious, or connected. Master your voice, and you master the emotional atmosphere.
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
      title: "Common Voice Mistakes",
      subtitle: "What Kills Your Impact",
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
      <div className="text-4xl md:text-5xl">😬</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">Uptalk (Rising at End)</p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed mb-2 break-words">
          Ending statements like questions makes you sound uncertain. "I think this is a good idea?" ❌
        </p>
        <p className="text-sm text-green-300">✓ Fix: Drop your pitch at the end of statements.</p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-1 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl animate-shake">🗣️</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">Monotone Delivery</p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed mb-2 break-words">
          Speaking in one flat tone puts people to sleep. No variation = no engagement.
        </p>
        <p className="text-sm text-green-300">✓ Fix: Vary your pitch and volume for emphasis.</p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-2 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl">😰</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">Filler Words (Um, Like, Uh)</p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed mb-2 break-words">
          "Um" and "like" destroy credibility. They signal you're unsure or unprepared.
        </p>
        <p className="text-sm text-green-300">✓ Fix: Pause silently instead. Silence is power.</p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-3 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl">🏃</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">Speaking Too Fast</p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed mb-2 break-words">
          Rushing through words makes you seem nervous and hard to understand.
        </p>
        <p className="text-sm text-green-300">✓ Fix: Breathe. Pause between sentences. Let words land.</p>
      </div>
    </div>
  </div>

  <div className="group p-4 md:p-5 bg-red-950/40 rounded-xl border-2 border-red-700/30 hover:border-red-500/50 transition-all hover:scale-[1.02] animate-slide-in-right animation-delay-4 w-full max-w-3xl mx-auto text-center">
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="text-4xl md:text-5xl">🥶</div>
      <div>
        <p className="text-lg md:text-xl font-bold text-red-100 mb-2 break-words">Cold/Flat Tone</p>
        <p className="text-sm md:text-base text-red-200 leading-relaxed mb-2 break-words">
          Sounding robotic or detached makes people feel uncomfortable around you.
        </p>
        <p className="text-sm text-green-300">✓ Fix: Smile while talking. It naturally warms your voice.</p>
      </div>
    </div>
  </div>
</div>

          </div>
        </div>
      )
    },
    {
      title: "The Perfect Voice Formula",
      subtitle: "Master Your Vocal Presence",
      icon: <Star className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 animate-spin-slow" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">The 5-Step Perfect Voice</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 md:p-6 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl md:rounded-2xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-left">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-blue-100 mb-2">Breathe from Your Diaphragm</p>
                    <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                      Deep belly breaths give you power and control. Shallow chest breathing makes you sound weak and breathless. Place your hand on your stomach—it should expand when you breathe in.
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
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">Relax Your Throat & Jaw</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Tension creates a thin, strained sound. Drop your jaw slightly. Imagine yawning to open your throat. Your voice will sound richer and more resonant.
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
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">Project from Your Chest</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Speak from your chest, not your nose or throat. Place your hand on your chest—you should feel vibration. This creates warmth and authority.
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
                    <p className="text-lg md:text-xl font-bold text-orange-100 mb-2">Use Vocal Variety</p>
                    <p className="text-sm md:text-base text-orange-200 leading-relaxed">
                      Change your pitch, volume, and pace to emphasize key words. Pause before important points. Speed up when excited. Slow down for emphasis.
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
                    <p className="text-lg md:text-xl font-bold text-pink-100 mb-2">Smile While You Speak</p>
                    <p className="text-sm md:text-base text-pink-200 leading-relaxed">
                      Smiling changes the shape of your vocal tract and makes your voice sound warmer and more inviting. People can literally hear a smile through the phone!
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
                Record yourself speaking for 30 seconds. Listen back. You'll be shocked at how you actually sound. Practice daily and compare recordings weekly!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Practice",
      subtitle: "Master Different Vocal Tones",
      icon: <Target className="w-6 h-6 md:w-7 md:h-7 text-purple-300" />,
      content: (
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <h3 className="text-lg md:text-xl font-bold text-purple-100 mb-3">Practice Makes Perfect</h3>
            <p className="text-sm md:text-base text-purple-200 leading-relaxed mb-5">
              Master these four essential vocal tones. Practice each one out loud!
            </p>

            

            {/* Practice Cards */}
            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl md:rounded-2xl border-2 border-pink-700/30 hover:scale-[1.02] transition-all animate-slide-in-right">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">🌸</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-pink-100">Warmth & Friendliness</p>
                      <p className="text-xs md:text-sm text-pink-300">For building rapport</p>
                    </div>
                  </div>
                  {completedExercises.warmth && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <div className="mb-4 p-3 bg-pink-950/40 rounded-lg border border-pink-700/30">
                  <p className="text-sm md:text-base text-pink-200 italic">
                    "Hey! It's so great to see you. How have you been?"
                  </p>
                </div>
                <p className="text-sm md:text-base text-pink-200 mb-4">
                  Soft volume, gentle pitch, slower pace. Smile as you speak. Let warmth radiate through your voice.
                </p>
                <button
                  onClick={() => practiceVoice('warmth')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Warm Tone
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl md:rounded-2xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">💪</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-blue-100">Confidence & Authority</p>
                      <p className="text-xs md:text-sm text-blue-300">For leadership moments</p>
                    </div>
                  </div>
                  {completedExercises.confidence && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <div className="mb-4 p-3 bg-blue-950/40 rounded-lg border border-blue-700/30">
                  <p className="text-sm md:text-base text-blue-200 italic">
                    "I believe this is the right direction. Let's move forward with it."
                  </p>
                </div>
                <p className="text-sm md:text-base text-blue-200 mb-4">
                  Moderate-loud volume, lower pitch, steady pace. No hesitation. Drop pitch at end of sentences.
                </p>
                <button
                  onClick={() => practiceVoice('confidence')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Confident Tone
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-xl md:rounded-2xl border-2 border-orange-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">⚡</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-orange-100">Energy & Enthusiasm</p>
                      <p className="text-xs md:text-sm text-orange-300">For exciting news</p>
                    </div>
                  </div>
                  {completedExercises.energy && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <div className="mb-4 p-3 bg-orange-950/40 rounded-lg border border-orange-700/30">
                  <p className="text-sm md:text-base text-orange-200 italic">
                    "This is incredible! We just hit our biggest milestone yet!"
                  </p>
                </div>
                <p className="text-sm md:text-base text-orange-200 mb-4">
                  Louder volume, varied pitch, faster pace. Let excitement shine. Use vocal energy to match your words!
                </p>
                <button
                  onClick={() => practiceVoice('energy')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Energetic Tone
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl md:rounded-2xl border-2 border-green-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">🎯</span>
                    <div>
                      <p className="text-lg md:text-xl font-bold text-green-100">Clarity & Precision</p>
                      <p className="text-xs md:text-sm text-green-300">For important information</p>
                    </div>
                  </div>
                  {completedExercises.clarity && <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />}
                </div>
                <div className="mb-4 p-3 bg-green-950/40 rounded-lg border border-green-700/30">
                  <p className="text-sm md:text-base text-green-200 italic">
                    "The meeting is at 3 PM in conference room B. Please bring your reports."
                  </p>
                </div>
                <p className="text-sm md:text-base text-green-200 mb-4">
                  Clear articulation, moderate volume, steady pace. Emphasize key details. No mumbling or rushing.
                </p>
                <button
                  onClick={() => practiceVoice('clarity')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  Practiced Clear Tone
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <p className="text-3xl md:text-4xl font-bold text-purple-100 mb-1">{practiceCount}</p>
                <p className="text-xs md:text-sm text-purple-300">Practice Sessions</p>
              </div>
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <p className="text-3xl md:text-4xl font-bold text-purple-100 mb-1">
                  {Object.values(completedExercises).filter(v => v).length}/4
                </p>
                <p className="text-xs md:text-sm text-purple-300">Tones Mastered</p>
              </div>
            </div>

            {allExercisesComplete && (
              <div className="mt-6 p-5 md:p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl md:rounded-2xl border-2 border-green-400/50 text-center animate-slide-in-up">
                <div className="text-5xl md:text-6xl mb-3 animate-bounce">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Voice Master Unlocked!</h3>
                <p className="text-sm md:text-base text-green-100">
                  You've practiced all four vocal tones. Now use them naturally in real conversations!
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
      title: "Real-World Application",
      subtitle: "Using Your Voice in Daily Life",
      icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100">You're Ready to Speak with Impact! 🎙️</h3>
                <p className="text-xs md:text-sm text-purple-300">Apply your vocal mastery</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border-2 border-blue-700/30 hover:scale-[1.02] transition-all animate-slide-in-right">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-blue-100 mb-2">Phone Calls & Video Meetings</p>
                    <p className="text-sm md:text-base text-blue-200 leading-relaxed">
                      Your voice is everything here! Smile while talking. Stand or sit up straight for better projection. Vary your tone to maintain engagement. Pause for emphasis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border-2 border-purple-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-1">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-purple-100 mb-2">First Impressions</p>
                    <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                      Start with warmth, then match their energy. Use moderate volume and clear articulation. Your opening "Hello, nice to meet you" sets the entire tone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 hover:scale-[1.02] transition-all animate-slide-in-right animation-delay-2">
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <p className="text-lg md:text-xl font-bold text-green-100 mb-2">Presentations & Public Speaking</p>
                    <p className="text-sm md:text-base text-green-200 leading-relaxed">
                      Start strong with confidence. Use pauses for drama. Vary your volume and pitch to maintain interest. End key points with a lower pitch for authority.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-orange-900/40 to-amber-900/40 rounded-xl border-2 border-orange-700/30 animate-slide-in-up animation-delay-3">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 md:w-7 md:h-7 text-orange-400 animate-pulse" />
                  <p className="text-lg md:text-xl font-bold text-orange-100">Context Switching</p>
                </div>
                <p className="text-sm md:text-base text-orange-200 leading-relaxed">
                  Match your vocal tone to the situation. Casual with friends? Warm and relaxed. Job interview? Confident and clear. Bad news? Slower and softer. Read the room with your voice.
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl border-2 border-pink-700/30 animate-slide-in-up animation-delay-4">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 md:w-7 md:h-7 text-pink-400 animate-bounce-slow" />
                  <p className="text-lg md:text-xl font-bold text-pink-100">Daily Warm-Up Routine</p>
                </div>
                <p className="text-sm md:text-base text-pink-200 leading-relaxed mb-3">
                  Your voice is a muscle. Warm it up every morning with these quick exercises:
                </p>
                <div className="space-y-2 text-sm md:text-base text-pink-200">
                  <p>• Hum for 30 seconds to warm up vocal cords</p>
                  <p>• Say "Red leather, yellow leather" 5 times (articulation)</p>
                  <p>• Practice scales: "Do Re Mi Fa Sol La Ti Do"</p>
                  <p>• Read something out loud with exaggerated emotion</p>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-xl border-2 border-indigo-700/30 animate-slide-in-up animation-delay-5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-indigo-400 animate-pulse" />
                  <p className="text-lg md:text-xl font-bold text-indigo-100">Track Your Progress</p>
                </div>
                <p className="text-sm md:text-base text-indigo-200 leading-relaxed">
                  Record yourself weekly. Compare recordings monthly. Notice: Are you speaking too fast? Using filler words? Sounding monotone? Self-awareness is the first step to mastery!
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl border-2 border-yellow-700/30 animate-fade-in animation-delay-4">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400 animate-bounce-slow" />
                  <p className="text-lg md:text-xl font-bold text-yellow-100">The Ultimate Goal</p>
                </div>
                <p className="text-sm md:text-base text-yellow-200 leading-relaxed">
                  Your voice should feel natural and effortless. When you master these techniques, they become automatic. You'll adapt your tone unconsciously to every situation. That's when you know you've truly mastered vocal control!
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
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1s ease-out forwards; }
        
        .animation-delay-1 { animation-delay: 0.15s; }
        .animation-delay-2 { animation-delay: 0.3s; }
        .animation-delay-3 { animation-delay: 0.45s; }
        .animation-delay-4 { animation-delay: 0.6s; }
        .animation-delay-5 { animation-delay: 0.75s; }

        .slider-pink::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        }
        .slider-pink::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        }
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .slider-blue::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .slider-orange::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }
        .slider-orange::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
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
              <Mic className="w-4 h-4 md:w-5 md:h-5 text-pink-400 animate-bounce-slow" />
              <span className="text-sm md:text-base font-bold text-purple-100">Voice Tone Control Module</span>
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
                  ? 'w-12 md:w-16 bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg' 
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-200 via-rose-200 to-purple-300 bg-clip-text text-transparent">
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
              className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl md:rounded-2xl border-2 border-pink-400/50 transition-all shadow-xl font-bold text-sm md:text-base backdrop-blur-sm hover:scale-105 active:scale-95"
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

export default VoiceToneControl;