import React, { useState, useEffect } from "react";
import { 
  Sparkles, Users, MessageCircle, TrendingUp, CheckCircle, 
  ArrowRight, Target, Heart, Zap, Clock, Trophy, Flame,
  Brain, Star, ChevronDown, ChevronUp, Play, Lightbulb,
  Award, TrendingDown, BarChart3, BookOpen, Video, Mic
} from 'lucide-react';

interface Objective {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  color: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
}

const INTRODAY4: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [checkedObjectives, setCheckedObjectives] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedTips, setExpandedTips] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [readinessScore, setReadinessScore] = useState(0);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [aiCoachMessage, setAiCoachMessage] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const objectives: Objective[] = [
    {
      id: 1,
      icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Recognize people you met before",
      description: "Build on existing connections by remembering faces and names",
      benefit: "Shows attentiveness & builds trust",
      color: "from-blue-500 to-cyan-500",
      xp: 50,
      difficulty: 'easy',
      tips: [
        "Use memory tricks: Associate their name with a feature",
        "Reference your last conversation: 'How did that project go?'",
        "Be honest if you forgot: 'Remind me your name? I'm terrible with names!'"
      ]
    },
    {
      id: 2,
      icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Follow up naturally",
      description: "Reference past conversations to show you were listening",
      benefit: "Strengthens rapport & connection",
      color: "from-purple-500 to-pink-500",
      xp: 75,
      difficulty: 'medium',
      tips: [
        "Keep mental notes during conversations",
        "Ask follow-up questions: 'Did you finish that book?'",
        "Show genuine interest in their updates"
      ]
    },
    {
      id: 3,
      icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Extend conversation length",
      description: "Go deeper with open-ended questions and active listening",
      benefit: "Creates meaningful exchanges",
      color: "from-emerald-500 to-teal-500",
      xp: 100,
      difficulty: 'hard',
      tips: [
        "Use 'Tell me more about that...' to go deeper",
        "Share related personal stories",
        "Ask 'why' and 'how' instead of yes/no questions"
      ]
    },
    {
      id: 4,
      icon: <Brain className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Apply micro-skills consciously",
      description: "Intentionally use eye contact, body language, and vocal variety",
      benefit: "Builds unconscious competence",
      color: "from-orange-500 to-red-500",
      xp: 125,
      difficulty: 'hard',
      tips: [
        "60% eye contact during listening, 40% while speaking",
        "Mirror their energy level subtly",
        "Vary your tone to show engagement"
      ]
    }
  ];

  const practiceScenarios = [
    {
      id: 1,
      title: "Coffee Shop Reunion",
      description: "You see someone you met at a networking event 2 weeks ago",
      challenge: "Approach them and reference your previous conversation",
      difficulty: "medium"
    },
    {
      id: 2,
      title: "Workplace Follow-up",
      description: "A colleague mentioned they had a big presentation last week",
      challenge: "Ask how it went and extend the conversation",
      difficulty: "easy"
    },
    {
      id: 3,
      title: "Group Setting",
      description: "You're at a party with 3 people you've met individually before",
      challenge: "Navigate the group dynamic while acknowledging each person",
      difficulty: "hard"
    }
  ];

  const aiCoachMessages = [
    "You're showing great commitment by reviewing each objective! 🌟",
    "Taking time to understand = better real-world performance 📈",
    "Your attention to detail will pay off in actual conversations 💪",
    "Building connections is a skill, and you're investing in mastering it! 🚀"
  ];

  // Timer for time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate readiness score
  useEffect(() => {
    const baseScore = (checkedObjectives.length / objectives.length) * 70;
    const timeBonus = Math.min(timeSpent / 120 * 20, 20); // Max 20% for 2min
    const tipsBonus = expandedTips !== null ? 10 : 0;
    setReadinessScore(Math.round(baseScore + timeBonus + tipsBonus));
  }, [checkedObjectives, timeSpent, expandedTips]);

  // AI coach messages
  useEffect(() => {
    if (checkedObjectives.length > 0 && checkedObjectives.length <= aiCoachMessages.length) {
      setAiCoachMessage(aiCoachMessages[checkedObjectives.length - 1]);
      setTimeout(() => setAiCoachMessage(""), 4000);
    }
  }, [checkedObjectives.length]);

  const toggleObjective = (id: number) => {
    setCheckedObjectives(prev => {
      if (prev.includes(id)) {
        return prev.filter(objId => objId !== id);
      } else {
        const newChecked = [...prev, id];
        if (newChecked.length === objectives.length) {
          triggerConfetti();
        }
        return newChecked;
      }
    });
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const toggleTips = (id: number) => {
    setExpandedTips(expandedTips === id ? null : id);
  };

  const totalXP = objectives.reduce((sum, obj) => 
    checkedObjectives.includes(obj.id) ? sum + obj.xp : sum, 0
  );

  const progress = (checkedObjectives.length / objectives.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canProceed = checkedObjectives.length >= 3 && timeSpent >= 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">Day 4 • 15 min</span>
            <span className="text-purple-400">•</span>
            <Clock className="w-4 h-4 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">{formatTime(timeSpent)}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent leading-tight">
            Deepening Connections
          </h1>
          
          <p className="text-base md:text-lg text-purple-200 mb-4">
            Transform surface-level interactions into meaningful relationships
          </p>

          {/* MOTIVATION CARD */}
          <div className="max-w-2xl mx-auto mb-6">
            <button
              onClick={() => setShowMotivation(!showMotivation)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-amber-500/30 hover:border-amber-400/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span className="text-sm md:text-base font-medium text-amber-100">Why Day 4 Matters</span>
              </div>
              {showMotivation ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
            </button>
            
            {showMotivation && (
              <div className="mt-3 p-5 bg-purple-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 text-left animate-slide-down">
                <p className="text-sm md:text-base text-purple-200 leading-relaxed mb-3">
                  Most people stop at small talk. You're learning to go deeper. Real friendships and professional relationships come from <span className="font-bold text-purple-100">follow-through and genuine interest</span>.
                </p>
                <div className="flex items-start gap-3 p-3 bg-purple-950/50 rounded-xl">
                  <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-xs md:text-sm text-purple-300 italic">
                    "The quality of your life is determined by the quality of your relationships." - Research shows strong social connections increase lifespan by 50%.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS OVERVIEW */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <h2 className="text-lg md:text-xl font-bold text-purple-100">Your Readiness</h2>
              </div>
              <div className="text-right">
                <p className="text-3xl md:text-4xl font-bold text-white">{readinessScore}%</p>
                <p className="text-xs md:text-sm text-purple-300">
                  {readinessScore < 50 && "Keep going!"}
                  {readinessScore >= 50 && readinessScore < 80 && "Getting there!"}
                  {readinessScore >= 80 && "Ready to crush it! 🔥"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-3 md:h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-xl md:text-2xl font-bold text-white">{checkedObjectives.length}/{objectives.length}</p>
                <p className="text-xs text-purple-300">Reviewed</p>
              </div>
              <div className="text-center p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <p className="text-xl md:text-2xl font-bold text-white">{totalXP}</p>
                <p className="text-xs text-purple-300">XP Preview</p>
              </div>
              <div className="text-center p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-xl md:text-2xl font-bold text-white">{formatTime(timeSpent)}</p>
                <p className="text-xs text-purple-300">Time Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* OBJECTIVES */}
        <div className="space-y-4 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-purple-100">Today's Objectives</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-800/40 rounded-full border border-purple-500/30">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-purple-200">350 XP Total</span>
            </div>
          </div>

          {objectives.map((objective, index) => {
            const isChecked = checkedObjectives.includes(objective.id);
            const isExpanded = expandedTips === objective.id;
            
            return (
              <div
                key={objective.id}
                className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 transition-all shadow-xl hover:shadow-2xl ${
                  isChecked 
                    ? 'border-green-500/50 bg-gradient-to-br from-green-900/20 to-purple-900/50' 
                    : 'border-purple-500/30 hover:border-purple-400/50'
                }`}
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* CHECKBOX */}
                    <button
                      onClick={() => toggleObjective(objective.id)}
                      className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 scale-110'
                          : 'bg-purple-950/50 border-purple-600 hover:border-purple-400'
                      }`}
                    >
                      {isChecked && <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                    </button>

                    {/* ICON */}
                    <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${objective.color} shadow-lg`}>
                      {objective.icon}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                          {objective.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            objective.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            objective.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {objective.difficulty === 'easy' && '🌱'}
                            {objective.difficulty === 'medium' && '🔥'}
                            {objective.difficulty === 'hard' && '💎'}
                          </span>
                          <span className="px-2 py-1 bg-purple-700/50 rounded-lg text-xs font-bold text-purple-200 border border-purple-500/30">
                            +{objective.xp} XP
                          </span>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-purple-300 mb-2">
                        {objective.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <p className="text-xs md:text-sm text-pink-300 italic">
                          {objective.benefit}
                        </p>
                      </div>

                      {/* TIPS TOGGLE */}
                      <button
                        onClick={() => toggleTips(objective.id)}
                        className="flex items-center gap-2 text-xs md:text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {isExpanded ? 'Hide Pro Tips' : 'Show Pro Tips'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {/* TIPS CONTENT */}
                      {isExpanded && (
                        <div className="mt-3 p-4 bg-purple-950/50 rounded-xl border border-purple-700/30 space-y-2 animate-slide-down">
                          {objective.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs md:text-sm text-purple-200">{tip}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI COACH MESSAGE */}
        {aiCoachMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 animate-slide-up">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-300 mb-1">AI Coach</p>
                <p className="text-sm text-blue-200">{aiCoachMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICE MODE */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => setShowPracticeMode(!showPracticeMode)}
            className="w-full flex items-center justify-between p-5 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md rounded-3xl border-2 border-indigo-500/30 hover:border-indigo-400/50 transition-all shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 text-indigo-400" />
              <div className="text-left">
                <h3 className="text-lg md:text-xl font-bold text-indigo-100">Quick Practice Scenarios</h3>
                <p className="text-sm text-indigo-300">Test your understanding before going live</p>
              </div>
            </div>
            {showPracticeMode ? <ChevronUp className="w-6 h-6 text-indigo-400" /> : <ChevronDown className="w-6 h-6 text-indigo-400" />}
          </button>

          {showPracticeMode && (
            <div className="mt-4 space-y-3 animate-slide-down">
              {practiceScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={`p-5 bg-purple-900/40 backdrop-blur-sm rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedScenario === scenario.id
                      ? 'border-indigo-400/50 bg-indigo-900/30'
                      : 'border-purple-500/30 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-base md:text-lg font-bold text-white">{scenario.title}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      scenario.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                      scenario.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-purple-300 mb-2">{scenario.description}</p>
                  {selectedScenario === scenario.id && (
                    <div className="mt-3 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                      <p className="text-sm font-bold text-indigo-300 mb-2">Your Challenge:</p>
                      <p className="text-sm text-purple-200">{scenario.challenge}</p>
                      <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-sm hover:from-indigo-500 hover:to-purple-500 transition-all">
                        Start Practice
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATS & INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-bold text-purple-100">Community Stats</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">1,247</p>
            <p className="text-sm text-purple-300">people completed Day 4 this week</p>
          </div>

          <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-pink-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-purple-100">Success Rate</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">87%</p>
            <p className="text-sm text-purple-300">report improved connections after Day 4</p>
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="sticky bottom-4 z-10">
          
          <button
  onClick={onNext}
  className="w-full px-6 py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white scale-100 hover:scale-105"
>
  <span>Begin Day 4 Challenge</span>
  <ArrowRight className="w-6 h-6" />
</button>

          
          {!canProceed && (
            <p className="text-center text-xs text-purple-400 mt-2">
              Take your time to understand each objective • Minimum 30 seconds
            </p>
          )}
        </div>

        {/* CONFETTI */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        html {
          scroll-behavior: smooth;
        }

        button:disabled {
          cursor: not-allowed;
        }

        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default INTRODAY4;