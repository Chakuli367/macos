import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Eye, Smile, Mic, Hand, Users, MessageCircle, Target, Trophy, Star, Zap, Award, TrendingUp, Sparkles, Clock, RotateCcw, Play } from "lucide-react";

const ReviewSkills = ({ onNext }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageAnimating, setPageAnimating] = useState(false);
  const [checkedSkills, setCheckedSkills] = useState({
    eyeContact: false,
    bodyLanguage: false,
    smile: false,
    voiceTone: false,
    gestures: false,
    conversation: false
  });
  const [practiceCount, setPracticeCount] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // XP and Level calculation
  useEffect(() => {
    const checkedCount = Object.values(checkedSkills).filter(v => v).length;
    const newXp = checkedCount * 50 + practiceCount * 10;
    setXp(newXp);
    setLevel(Math.floor(newXp / 100) + 1);
  }, [checkedSkills, practiceCount]);

  const changePage = (newPage) => {
    setPageAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageAnimating(false);
    }, 300);
  };

  const toggleSkill = (skill) => {
    setCheckedSkills(prev => {
      const newState = { ...prev, [skill]: !prev[skill] };
      if (!prev[skill]) {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1500);
      }
      return newState;
    });
  };

  const practiceSkill = (skill) => {
    toggleSkill(skill);
    setPracticeCount(prev => prev + 1);
  };

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsTimerRunning(true);
  };

  const allSkillsChecked = Object.values(checkedSkills).every(v => v);
  const readinessScore = Math.round((Object.values(checkedSkills).filter(v => v).length / 6) * 100);

  const skills = [
    {
      id: 'eyeContact',
      icon: <Eye className="w-6 h-6 md:w-7 md:h-7" />,
      title: 'Eye Contact',
      subtitle: 'Hold 2-3 seconds',
      description: '2–3 sec hold, repeat 5x with "Hi, I\'m [Name]."',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-900/40 to-cyan-900/40',
      borderColor: 'border-blue-700/30',
      emoji: '👁️',
      tips: [
        'Look at the bridge of their nose if direct eye contact feels intense',
        'Break naturally every 3 seconds to avoid staring',
        'Practice in the mirror first'
      ]
    },
    {
      id: 'bodyLanguage',
      icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
      title: 'Open Body Language',
      subtitle: 'Uncrossed & facing forward',
      description: 'Arms uncrossed, torso facing forward, shoulders relaxed.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-900/40 to-pink-900/40',
      borderColor: 'border-purple-700/30',
      emoji: '🧍',
      tips: [
        'Keep arms at sides or use gentle gestures',
        'Face the person directly, not at an angle',
        'Relax your shoulders—tension shows'
      ]
    },
    {
      id: 'smile',
      icon: <Smile className="w-6 h-6 md:w-7 md:h-7" />,
      title: 'Smile Naturally',
      subtitle: 'Friendly & relaxed',
      description: 'Friendly, relaxed smile. Engage your eyes, not just mouth.',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-900/40 to-orange-900/40',
      borderColor: 'border-yellow-700/30',
      emoji: '😊',
      tips: [
        'Think of something that makes you happy',
        'Let the smile reach your eyes (Duchenne smile)',
        'Don\'t hold it constantly—let it come and go naturally'
      ]
    },
    {
      id: 'voiceTone',
      icon: <Mic className="w-6 h-6 md:w-7 md:h-7" />,
      title: 'Tone of Voice',
      subtitle: 'Calm, upbeat, moderate pace',
      description: 'Calm, slightly upbeat, moderate pace. No filler words.',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-900/40 to-rose-900/40',
      borderColor: 'border-pink-700/30',
      emoji: '🎙️',
      tips: [
        'Speak from your chest, not your throat',
        'Pause instead of saying "um" or "uh"',
        'Vary your pitch to sound engaging'
      ]
    },
    {
      id: 'gestures',
      icon: <Hand className="w-6 h-6 md:w-7 md:h-7" />,
      title: 'Gestures',
      subtitle: 'Minimal & purposeful',
      description: 'Minimal hand movements, avoid fidgeting or over-gesturing.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-900/40 to-emerald-900/40',
      borderColor: 'border-green-700/30',
      emoji: '👋',
      tips: [
        'Use gestures to emphasize key points only',
        'Keep hands visible (not in pockets)',
        'Avoid touching face, hair, or objects nervously'
      ]
    },
    {
      id: 'conversation',
      icon: <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />,
      title: 'Conversation Framework',
      subtitle: 'Greeting → Question → Follow-up',
      description: 'Greeting → Observation/Question → Follow-up → Exit',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-900/40 to-purple-900/40',
      borderColor: 'border-indigo-700/30',
      emoji: '💬',
      tips: [
        'Start: "Hi, I\'m [Name]. Nice to meet you!"',
        'Middle: Ask about them, listen actively',
        'End: "It was great talking to you. Hope to see you again!"'
      ]
    }
  ];

  // Create pages: 6 skill pages + 1 practice session + 1 readiness check = 8 total pages
  const pages = [
    // Pages 0-5: Individual skill cards
    ...skills.map((skill, skillIndex) => ({
      title: skill.title,
      subtitle: `Skill ${skillIndex + 1} of 6`,
      icon: skill.icon,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          {/* XP Bar */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center font-bold text-lg md:text-xl shadow-xl">
                  {level}
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-purple-100">Level {level}</p>
                  <p className="text-xs text-purple-300">{xp} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold text-yellow-400">{readinessScore}%</p>
                <p className="text-xs text-purple-300">Ready</p>
              </div>
            </div>
            <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 transition-all duration-1000 animate-pulse-slow"
                style={{ width: `${(xp % 100)}%` }}
              />
            </div>
          </div>

          {/* Single Skill Card - Large */}
          <div className={`bg-gradient-to-br ${skill.bgColor} backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border-2 ${skill.borderColor} animate-slide-in-up`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-xl`}>
                  <span className="text-4xl md:text-5xl">{skill.emoji}</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{skill.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{skill.subtitle}</p>
                </div>
              </div>
              {checkedSkills[skill.id] ? (
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-400 animate-bounce" />
              ) : (
                <Circle className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
              )}
            </div>
            
            <div className="mb-6 p-5 md:p-6 bg-black/30 rounded-xl border-2 border-white/10">
              <p className="text-base md:text-lg text-white leading-relaxed mb-4">
                {skill.description}
              </p>
            </div>

            <div className="mb-6 p-5 md:p-6 bg-black/20 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <p className="text-base md:text-lg font-bold text-white">Essential Tips:</p>
              </div>
              <ul className="space-y-3">
                {skill.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base text-gray-200">
                    <span className="text-yellow-400 text-xl mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 p-5 md:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border-2 border-indigo-700/30">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-yellow-400 animate-bounce-slow" />
                <p className="text-base md:text-lg font-bold text-white">Practice Challenge</p>
              </div>
              <p className="text-sm md:text-base text-gray-200 mb-4">
                {skill.id === 'eyeContact' && 'Look in the mirror and practice holding eye contact for 2-3 seconds while saying "Hi, I\'m [Name]" 5 times.'}
                {skill.id === 'bodyLanguage' && 'Stand in front of a mirror. Check: Are your arms uncrossed? Is your torso facing forward? Shoulders relaxed?'}
                {skill.id === 'smile' && 'Practice your smile in the mirror. Make sure it reaches your eyes. Think of something happy to make it genuine.'}
                {skill.id === 'voiceTone' && 'Record yourself saying "Hello, nice to meet you" and listen back. Is your tone warm and clear?'}
                {skill.id === 'gestures' && 'Practice speaking for 30 seconds without fidgeting. Keep your hands visible and use minimal, purposeful gestures.'}
                {skill.id === 'conversation' && 'Practice the full framework: Greeting → Ask a question → Listen → Follow-up → Graceful exit.'}
              </p>
            </div>

            <button
              onClick={() => practiceSkill(skill.id)}
              className={`w-full px-6 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg transition-all shadow-2xl ${
                checkedSkills[skill.id]
                  ? 'bg-green-600 hover:bg-green-500 cursor-default'
                  : `bg-gradient-to-r ${skill.color} hover:scale-105`
              }`}
            >
              {checkedSkills[skill.id] ? (
                <span className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  Skill Mastered! +50 XP
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" />
                  Mark as Practiced
                </span>
              )}
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="text-center">
            <p className="text-sm text-purple-300">
              Skill {skillIndex + 1} of 6 • {Object.values(checkedSkills).filter(v => v).length} completed
            </p>
          </div>
        </div>
      )
    })),
    // Page 6: Practice Session
    {
      title: "Quick Practice Session",
      subtitle: "Apply All Skills Together",
      icon: <Play className="w-6 h-6 md:w-7 md:h-7 text-green-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            
            {/* Timer Display */}
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl mb-4 animate-pulse-slow">
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-white">{timer}</p>
                  <p className="text-xs md:text-sm text-purple-200">seconds</p>
                </div>
              </div>
              <p className="text-sm md:text-base text-purple-200">
                {timer === 0 ? 'Ready to practice?' : isTimerRunning ? 'Practice now!' : 'Time\'s up!'}
              </p>
            </div>

            {/* Practice Scenarios */}
            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border-2 border-blue-700/30 animate-slide-in-right">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl md:text-4xl">🤝</span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-blue-100">Scenario 1: First Meeting</h3>
                    <p className="text-xs text-blue-300">Practice your opening</p>
                  </div>
                </div>
                <div className="mb-4 p-3 md:p-4 bg-blue-950/40 rounded-lg border border-blue-700/30">
                  <p className="text-sm md:text-base text-blue-200 mb-3 italic">
                    "Hi, I'm [Your Name]. Nice to meet you!"
                  </p>
                  <div className="space-y-2 text-xs md:text-sm text-blue-300">
                    <p>✓ Make eye contact (2-3 sec)</p>
                    <p>✓ Smile warmly</p>
                    <p>✓ Open body language</p>
                    <p>✓ Calm, clear voice</p>
                  </div>
                </div>
                <button
                  onClick={() => startTimer(10)}
                  disabled={isTimerRunning}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Practice 10 Seconds
                  </span>
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border-2 border-purple-700/30 animate-slide-in-right animation-delay-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl md:text-4xl">💬</span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-100">Scenario 2: Small Talk</h3>
                    <p className="text-xs text-purple-300">Keep the conversation flowing</p>
                  </div>
                </div>
                <div className="mb-4 p-3 md:p-4 bg-purple-950/40 rounded-lg border border-purple-700/30">
                  <p className="text-sm md:text-base text-purple-200 mb-3 italic">
                    "How has your week been? I've been working on..."
                  </p>
                  <div className="space-y-2 text-xs md:text-sm text-purple-300">
                    <p>✓ Maintain eye contact while listening</p>
                    <p>✓ Nod to show engagement</p>
                    <p>✓ Ask follow-up questions</p>
                    <p>✓ Minimal gestures</p>
                  </div>
                </div>
                <button
                  onClick={() => startTimer(20)}
                  disabled={isTimerRunning}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Practice 20 Seconds
                  </span>
                </button>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-700/30 animate-slide-in-right animation-delay-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl md:text-4xl">👋</span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-green-100">Scenario 3: Graceful Exit</h3>
                    <p className="text-xs text-green-300">End on a positive note</p>
                  </div>
                </div>
                <div className="mb-4 p-3 md:p-4 bg-green-950/40 rounded-lg border border-green-700/30">
                  <p className="text-sm md:text-base text-green-200 mb-3 italic">
                    "It was great talking to you! Hope to see you again soon."
                  </p>
                  <div className="space-y-2 text-xs md:text-sm text-green-300">
                    <p>✓ Final eye contact with smile</p>
                    <p>✓ Warm, sincere tone</p>
                    <p>✓ Open body language</p>
                    <p>✓ Optional: handshake or wave</p>
                  </div>
                </div>
                <button
                  onClick={() => startTimer(10)}
                  disabled={isTimerRunning}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all shadow-lg hover:scale-105 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Practice 10 Seconds
                  </span>
                </button>
              </div>
            </div>

            {!isTimerRunning && timer === 0 && (
              <div className="mt-6 p-4 md:p-5 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl border-2 border-yellow-700/30 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400 animate-bounce-slow" />
                  <p className="text-lg font-bold text-yellow-100">Pro Tip</p>
                </div>
                <p className="text-sm text-yellow-200 leading-relaxed">
                  Practice each scenario out loud in front of a mirror. Record yourself to see how you actually come across. The more you practice, the more natural it becomes!
                </p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: "Final Readiness Check",
      subtitle: "Are You Ready to Shine?",
      icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />,
      content: (
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl border-2 border-purple-500/30 animate-slide-in-up">
            
            {/* Confidence Meter */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-purple-100">How Confident Do You Feel?</h3>
                  <p className="text-sm text-purple-300">Rate yourself honestly</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-yellow-400">{confidenceLevel}</p>
                  <p className="text-xs text-purple-300">/ 10</p>
                </div>
              </div>
              
              <input
                type="range"
                min="1"
                max="10"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                className="w-full h-4 bg-purple-950/50 rounded-full appearance-none cursor-pointer slider-confidence"
              />
              
              <div className="flex justify-between text-xs text-purple-300 mt-2">
                <span>Not Ready</span>
                <span>Somewhat Ready</span>
                <span>Very Ready</span>
              </div>
            </div>

            {/* Skills Summary */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold text-purple-100 mb-4">Your Skills Mastery</h3>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{skill.emoji}</span>
                        <span className="text-sm font-medium text-purple-200">{skill.title}</span>
                      </div>
                      {checkedSkills[skill.id] ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-500`}
                        style={{ width: checkedSkills[skill.id] ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Score */}
            <div className="mb-6 p-5 md:p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border-2 border-purple-700/30">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-2xl mb-4 animate-bounce-slow">
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-white">{readinessScore}%</p>
                    <p className="text-xs text-yellow-100">Ready</p>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-purple-100 mb-2">
                  {readinessScore >= 80 ? 'You\'re Ready! 🎉' : readinessScore >= 50 ? 'Almost There! 💪' : 'Keep Practicing! 📚'}
                </h3>
                <p className="text-sm md:text-base text-purple-300">
                  {readinessScore >= 80 
                    ? 'You\'ve mastered all the essential skills. Go out there and shine!'
                    : readinessScore >= 50
                    ? 'You\'re making great progress. Review any unchecked skills and you\'ll be ready!'
                    : 'Take your time to practice each skill. You\'ve got this!'}
                </p>
              </div>
            </div>

            {/* Final Checklist */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-bold text-purple-100">Final Checklist:</h3>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${allSkillsChecked ? 'bg-green-900/30 border border-green-700/30' : 'bg-purple-950/30 border border-purple-700/30'}`}>
                  {allSkillsChecked ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-500" />}
                  <span className="text-purple-200">Reviewed all 6 core skills</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${practiceCount >= 3 ? 'bg-green-900/30 border border-green-700/30' : 'bg-purple-950/30 border border-purple-700/30'}`}>
                  {practiceCount >= 3 ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-500" />}
                  <span className="text-purple-200">Completed practice sessions ({practiceCount}/3)</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${confidenceLevel >= 7 ? 'bg-green-900/30 border border-green-700/30' : 'bg-purple-950/30 border border-purple-700/30'}`}>
                  {confidenceLevel >= 7 ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-500" />}
                  <span className="text-purple-200">Confidence level 7+ ({confidenceLevel}/10)</span>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            {readinessScore >= 80 && confidenceLevel >= 7 && (
              <div className="p-5 md:p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl md:rounded-2xl border-2 border-green-400/50 text-center animate-slide-in-up">
                <div className="text-5xl md:text-6xl mb-3 animate-bounce">🚀</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">You're Absolutely Ready!</h3>
                <p className="text-sm md:text-base text-green-100 mb-4">
                  You've practiced all the skills and you're feeling confident. Now it's time to put everything into action in the real world!
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm text-green-100">
                  <span className="px-3 py-1.5 bg-green-700/50 rounded-full">✓ Skills Mastered</span>
                  <span className="px-3 py-1.5 bg-green-700/50 rounded-full">✓ Confidence High</span>
                  <span className="px-3 py-1.5 bg-green-700/50 rounded-full">✓ Ready to Shine</span>
                </div>
              </div>
            )}

            {readinessScore < 80 && (
              <div className="p-4 md:p-5 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl border-2 border-yellow-700/30 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-400 animate-pulse" />
                  <p className="text-lg font-bold text-yellow-100">Keep Going!</p>
                </div>
                <p className="text-sm text-yellow-200 leading-relaxed">
                  Go back to Page 1 and practice any skills you haven't checked yet. Every skill you master brings you closer to social confidence!
                </p>
              </div>
            )}
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1s ease-out forwards; }
        
        .animation-delay-1 { animation-delay: 0.15s; }
        .animation-delay-2 { animation-delay: 0.3s; }

        .slider-confidence::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
        }
        .slider-confidence::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
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
              <Target className="w-4 h-4 md:w-5 md:h-5 text-purple-300 animate-bounce-slow" />
              <span className="text-sm md:text-base font-bold text-purple-100">Skills Review Module</span>
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
        <div className={`text-center mb-6 md:mb-8 ${pageAnimating ? 'opacity-0' : 'animate-slide-in-up'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-bounce-slow">
              {pages[currentPage].icon}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-300 bg-clip-text text-transparent">
              {pages[currentPage].title}
            </h1>
          </div>
          <p className="text-sm md:text-base lg:text-lg text-purple-300 font-medium animate-fade-in">
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
              Step {currentPage + 1} of {pages.length}
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
              disabled={readinessScore < 80 || confidenceLevel < 7}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-xl font-bold text-sm md:text-base backdrop-blur-sm ${
                readinessScore >= 80 && confidenceLevel >= 7
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-green-400/50 hover:scale-105 active:scale-95 animate-pulse'
                  : 'bg-gray-600 border-gray-500/30 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>I'm Ready!</span>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>

        {/* Disabled button hint */}
        {currentPage === pages.length - 1 && (readinessScore < 80 || confidenceLevel < 7) && (
          <div className="text-center mt-4 animate-fade-in">
            <p className="text-xs md:text-sm text-yellow-300">
              💡 Complete all skills and reach 7+ confidence to proceed
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
  );
};

export default ReviewSkills;