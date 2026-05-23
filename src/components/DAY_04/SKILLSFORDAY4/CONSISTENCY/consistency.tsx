import React, { useState, useEffect } from 'react';
import { Shield, Battery, Thermometer, Wind, Target, CheckCircle, TrendingUp, Award, Zap, AlertCircle, Lightbulb, Play, RotateCcw, ChevronRight, Star, Trophy, Lock, Sparkles, Heart, Brain, Flame, Clock, Users, MessageCircle, Camera, Calendar, BarChart3, Activity, Coffee, Moon, Sun, Sunrise, Home, Building, Volume2, X, Check, ArrowRight, TrendingDown, Pause, FastForward } from 'lucide-react';

const ConsistencyMastery = ({ onNext }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    quizAnswers: [],
    consistencyScore: 0,
    killerProfile: [],
    energyPattern: {},
    mva: '',
    anchorHabit: '',
    energyMenu: { high: '', medium: '', low: '' },
    consistencyTrigger: { time: '', place: '', frequency: 'daily' },
    emergencyBackup: '',
    scenarioChoices: [],
    completedSteps: [],
    totalXP: 0,
    streakDays: 0
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);

  // Generate mock 30-day data for consistency quiz
  useEffect(() => {
    const mockData = Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      let actions = 0;
      if (day <= 7) actions = Math.floor(Math.random() * 4) + 3; // Strong start
      else if (day <= 14) actions = Math.floor(Math.random() * 3) + 2; // Declining
      else if (day <= 21) actions = Math.floor(Math.random() * 2) + 1; // The grind
      else actions = Math.floor(Math.random() * 2); // Drop off
      return { day, actions };
    });
    setDayData(mockData);
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setUserData(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, 'system-complete'],
      streakDays: 1
    }));
    triggerConfetti();
    if (onNext) {
      setTimeout(() => onNext(), 2000);
    }
  };

  const scenarios = [
    {
      id: 'exhausted',
      title: "You're exhausted after a 12-hour workday",
      description: "It's 9 PM. You're mentally drained. Your social action goal was to have one meaningful conversation today. What do you do?",
      options: [
        { id: 'A', text: "Skip today and rest (break streak)", consequence: "Your streak breaks. Research shows missing one day makes you 3x more likely to quit entirely.", correct: false },
        { id: 'B', text: "Do your MVA: Send one genuine text (1 min)", consequence: "Perfect! You maintained momentum without burnout. The streak continues, and your brain reinforces the habit loop.", correct: true },
        { id: 'C', text: "Push through and do the full action anyway", consequence: "You risk burnout. Consistency isn't about heroics—it's about sustainable systems. Save this energy for tomorrow.", correct: false }
      ],
      lesson: "Adaptation > Abandonment. Your MVA exists for exactly this moment."
    },
    {
      id: 'awkward',
      title: "You had an awkward interaction yesterday",
      description: "Yesterday's conversation went poorly. You feel embarrassed. Today, you're supposed to practice again. What do you do?",
      options: [
        { id: 'A', text: "Take a few days to recover emotionally", consequence: "Taking 'a few days' usually becomes permanent. Emotions will pass faster if you act despite them.", correct: false },
        { id: 'B', text: "Push through with the same difficulty level", consequence: "This might work, but it's risky. You're forcing through resistance rather than working with it.", correct: false },
        { id: 'C', text: "Lower the difficulty: Just smile at 3 people today", consequence: "Brilliant! You're maintaining the habit while respecting your emotional state. This is adaptive consistency.", correct: true }
      ],
      lesson: "Consistency means showing up, not showing off. Adjust intensity, never skip entirely."
    },
    {
      id: 'plateau',
      title: "It's been 3 weeks, you see no obvious results",
      description: "You've been consistent for 21 days. You don't feel more confident yet. Your brain says 'this isn't working.' What do you do?",
      options: [
        { id: 'A', text: "This approach isn't working, try something else", consequence: "You're quitting right before the breakthrough. Day 21 is when motivation dies but neural pathways are forming. This is THE critical moment.", correct: false },
        { id: 'B', text: "Double your efforts to see faster results", consequence: "Overcompensating leads to burnout. You don't need MORE—you need SUSTAINED. Trust the timeline.", correct: false },
        { id: 'C', text: "Trust the process, maintain your pace", consequence: "Perfect. You understand the science. Days 22-35 feel like nothing is happening, but your basal ganglia is rewiring. Results appear suddenly around day 40.", correct: true }
      ],
      lesson: "The plateau is progress. Your brain is changing beneath conscious awareness."
    },
    {
      id: 'vacation',
      title: "You're on vacation for a week",
      description: "You're traveling. Your normal routine is impossible. Your consistency streak is at risk. What do you do?",
      options: [
        { id: 'A', text: "Take the week off, restart after vacation", consequence: "One week off = 3 weeks of lost progress. Your neural pathways start degrading after 48 hours of no activation.", correct: false },
        { id: 'B', text: "Maintain your exact same routine", consequence: "Rigidity breaks consistency. When you can't adapt, you eventually quit. Flexibility is a feature, not a bug.", correct: false },
        { id: 'C', text: "Adapt: Talk to hotel staff, fellow travelers, locals", consequence: "Excellent! Consistency isn't about identical actions—it's about maintaining the PATTERN. You just proved the habit is portable.", correct: true }
      ],
      lesson: "Consistency = Pattern Maintenance, not rigid repetition. Adapt the action to the context."
    }
  ];

  const steps = [
    {
      id: 'crisis',
      title: 'The Consistency Crisis',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 p-6 rounded-2xl border-2 border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-red-400" />
              Why Most People Fail at Social Growth
            </h3>
            <p className="text-red-100 text-lg leading-relaxed mb-4">
              It's not about knowing what to do. It's about <span className="font-bold text-orange-300">doing it consistently</span> when motivation fades.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-950/40 p-5 rounded-xl border-2 border-purple-700/30 text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">92%</div>
              <p className="text-purple-200 text-sm">Quit within 2 weeks</p>
            </div>
            <div className="bg-purple-950/40 p-5 rounded-xl border-2 border-purple-700/30 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">14</div>
              <p className="text-purple-200 text-sm">Days until motivation dies</p>
            </div>
            <div className="bg-purple-950/40 p-5 rounded-xl border-2 border-purple-700/30 text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">3x</div>
              <p className="text-purple-200 text-sm">Progress lost per week off</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              The Motivation Cliff
            </h4>
            <div className="mb-4">
              <p className="text-purple-200 text-sm mb-3">Here's what happens to most people:</p>
              <div className="h-40 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
                <div className="relative h-full">
                  <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                    {dayData.slice(0, 21).map((d, i) => {
                      const maxActions = 6;
                      const height = (d.actions / maxActions) * 100;
                      let color = 'bg-green-500';
                      if (i > 7 && i <= 14) color = 'bg-yellow-500';
                      if (i > 14) color = 'bg-red-500';
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end px-0.5">
                          <div 
                            className={`w-full ${color} rounded-t transition-all`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-purple-400 mt-2">
                <span>Day 1</span>
                <span>Day 7 (Peak)</span>
                <span>Day 14 (Decline)</span>
                <span>Day 21 (The Grind)</span>
              </div>
            </div>
            <div className="bg-red-900/20 p-4 rounded-xl border border-red-700/30">
              <p className="text-red-200 text-sm font-medium mb-2">The Hidden Cost:</p>
              <ul className="text-red-300 text-sm space-y-1">
                <li>• Inconsistent action = No compound growth</li>
                <li>• Brain doesn't rewire without repetition</li>
                <li>• One week off = 3 weeks of progress lost</li>
                <li>• You stay in the learning phase forever</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
            <Lightbulb className="w-6 h-6 text-yellow-400 mb-3" />
            <h4 className="font-bold text-white mb-2">The Real Problem</h4>
            <p className="text-purple-100">
              You don't have a knowledge problem. You have a <span className="font-bold text-pink-300">consistency system problem</span>. 
              Let's fix it.
            </p>
          </div>
        </div>
        )}
        </div>
      )
    },
    {
      id: 'science',
      title: 'The Science of Habits',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-2xl border-2 border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Brain className="w-7 h-7 text-purple-400" />
              How Habits Actually Form
            </h3>
            <p className="text-purple-100 mb-2">
              Understanding the neuroscience changes everything. Here's what's really happening in your brain.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
            <h4 className="font-bold text-white mb-4">The 66-Day Reality (Not 21)</h4>
            <div className="space-y-4">
              <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sunrise className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-white mb-2">Days 1-14: Honeymoon Phase</h5>
                    <p className="text-purple-200 text-sm mb-2">
                      <span className="font-bold text-green-300">What's happening:</span> Dopamine is high. Everything feels exciting.
                    </p>
                    <p className="text-purple-300 text-xs">
                      Your prefrontal cortex is driving behavior (requires conscious effort)
                    </p>
                  </div>
                </div>
                <div className="bg-green-900/20 px-3 py-2 rounded-lg">
                  <p className="text-green-200 text-xs font-medium">⚠️ Trap: Overcommitting because it feels easy</p>
                </div>
              </div>

              <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flame className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-white mb-2">Days 15-35: The Grind</h5>
                    <p className="text-purple-200 text-sm mb-2">
                      <span className="font-bold text-orange-300">What's happening:</span> Motivation crashes. Excuses emerge.
                    </p>
                    <p className="text-purple-300 text-xs">
                      Battle between prefrontal cortex (discipline) and limbic system (comfort)
                    </p>
                  </div>
                </div>
                <div className="bg-orange-900/20 px-3 py-2 rounded-lg">
                  <p className="text-orange-200 text-xs font-medium">⚠️ Trap: Quitting because "it's not working" (it is)</p>
                </div>
              </div>

              <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-white mb-2">Days 36-66: Automation</h5>
                    <p className="text-purple-200 text-sm mb-2">
                      <span className="font-bold text-blue-300">What's happening:</span> Basal ganglia takes over. Habit forms.
                    </p>
                    <p className="text-purple-300 text-xs">
                      Behavior becomes automatic—requires minimal conscious effort
                    </p>
                  </div>
                </div>
                <div className="bg-blue-900/20 px-3 py-2 rounded-lg">
                  <p className="text-blue-200 text-xs font-medium">✅ Goal: Reach Day 66 = permanent neural pathway</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Battery className="w-5 h-5 text-yellow-400" />
              The Energy Tank Model
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm font-medium">Morning You</span>
                    <span className="text-green-300 text-sm font-bold">100%</span>
                  </div>
                  <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-full" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm font-medium">After Work You</span>
                    <span className="text-yellow-300 text-sm font-bold">40%</span>
                  </div>
                  <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[40%]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm font-medium">Evening You</span>
                    <span className="text-red-300 text-sm font-bold">15%</span>
                  </div>
                  <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-600 w-[15%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-900/20 p-4 rounded-xl border border-yellow-700/30">
              <p className="text-yellow-200 text-sm font-medium mb-2">Critical Insight:</p>
              <p className="text-yellow-300 text-sm">
                Willpower is finite. Systems that require high energy will fail when you're depleted. 
                You need <span className="font-bold">energy-matched actions</span>.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
            <Target className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="font-bold text-white mb-2">The Key Takeaway</h4>
            <p className="text-purple-100">
              Consistency isn't about motivation or willpower. It's about designing a system that works 
              <span className="font-bold text-pink-300"> even when you're at 15% energy</span>.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'diagnosis',
      title: 'Your Consistency Killers',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-6 rounded-2xl border-2 border-orange-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Target className="w-7 h-7 text-orange-400" />
              What's Killing YOUR Consistency?
            </h3>
            <p className="text-orange-100 mb-2">
              Everyone has different failure points. Let's identify yours.
            </p>
          </div>

          <div className="space-y-4">
            <div 
              className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedOptions.includes('energy') 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
              onClick={() => {
                if (selectedOptions.includes('energy')) {
                  setSelectedOptions(selectedOptions.filter(o => o !== 'energy'));
                } else {
                  setSelectedOptions([...selectedOptions, 'energy']);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Battery className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">The Energy Killer</h4>
                    {selectedOptions.includes('energy') && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <span className="font-bold text-red-300">Symptom:</span> "I'm too tired after work to practice"
                  </p>
                  <p className="text-purple-300 text-xs">
                    You only take action when energy is high (morning/weekends). By evening, you skip it.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedOptions.includes('mood') 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
              onClick={() => {
                if (selectedOptions.includes('mood')) {
                  setSelectedOptions(selectedOptions.filter(o => o !== 'mood'));
                } else {
                  setSelectedOptions([...selectedOptions, 'mood']);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">The Mood Killer</h4>
                    {selectedOptions.includes('mood') && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <span className="font-bold text-orange-300">Symptom:</span> "I only do it when I feel confident"
                  </p>
                  <p className="text-purple-300 text-xs">
                    You need to be in the "right mood" to act. Bad days = no action. Waiting for motivation.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedOptions.includes('environment') 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
              onClick={() => {
                if (selectedOptions.includes('environment')) {
                  setSelectedOptions(selectedOptions.filter(o => o !== 'environment'));
                } else {
                  setSelectedOptions([...selectedOptions, 'environment']);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">The Environment Killer</h4>
                    {selectedOptions.includes('environment') && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <span className="font-bold text-blue-300">Symptom:</span> "I can't find opportunities to practice"
                  </p>
                  <p className="text-purple-300 text-xs">
                    You only act in comfortable, familiar settings. New places feel too intimidating.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedOptions.includes('perfectionism') 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
              onClick={() => {
                if (selectedOptions.includes('perfectionism')) {
                  setSelectedOptions(selectedOptions.filter(o => o !== 'perfectionism'));
                } else {
                  setSelectedOptions([...selectedOptions, 'perfectionism']);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">The Perfectionism Killer</h4>
                    {selectedOptions.includes('perfectionism') && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <span className="font-bold text-purple-300">Symptom:</span> "If I can't do it perfectly, I skip it"
                  </p>
                  <p className="text-purple-300 text-xs">
                    You need ideal conditions to act. If something feels "off," you postpone until it's "right."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {selectedOptions.length > 0 && (
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-5 rounded-xl border border-green-500/30 animate-slide-up">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h4 className="font-bold text-white">Your Consistency Profile</h4>
              </div>
              <p className="text-green-200 text-sm mb-3">
                You selected <span className="font-bold">{selectedOptions.length}</span> killer{selectedOptions.length !== 1 ? 's' : ''}. 
                This is why your past attempts failed. Now let's fix them.
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map(option => (
                  <div key={option} className="px-3 py-1 bg-green-700/30 rounded-full border border-green-500/30 text-green-200 text-xs font-medium">
                    {option.charAt(0).toUpperCase() + option.slice(1)} Killer
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
            <Lightbulb className="w-6 h-6 text-yellow-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Good News</h4>
            <p className="text-purple-100">
              Self-awareness is 50% of the solution. Now that you know YOUR specific killers, 
              we can build defenses against them. Next: Your personalized toolkit.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'toolkit',
      title: 'Your Consistency Toolkit',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 rounded-2xl border-2 border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400" />
              5 Battle-Tested Techniques
            </h3>
            <p className="text-purple-100">
              Each technique targets one of your killers. Choose the ones that match your profile.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">1. Minimum Viable Action (MVA)</h4>
                  <p className="text-purple-200 text-sm mb-3">
                    Beats: <span className="font-bold text-green-300">Perfectionism & Energy Killers</span>
                  </p>
                  <p className="text-purple-300 text-sm mb-3">
                    Make your daily action SO SMALL that you can't fail. This removes the barrier of "perfect conditions."
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 mb-4">
                <p className="text-purple-200 text-sm font-medium mb-3">Examples of MVAs:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Instead of: "Have a great conversation"</p>
                      <p className="text-green-300 text-xs">MVA: "Say hi to 1 person"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Instead of: "Network at event"</p>
                      <p className="text-green-300 text-xs">MVA: "Introduce yourself to 1 person"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Instead of: "Be more social"</p>
                      <p className="text-green-300 text-xs">MVA: "Smile at 3 people"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Instead of: "Reach out to friends"</p>
                      <p className="text-green-300 text-xs">MVA: "Send 1 genuine text"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-900/20 p-4 rounded-xl border border-green-700/30">
                <p className="text-green-200 text-sm font-medium mb-1">Why it works:</p>
                <p className="text-green-300 text-xs">
                  A 1-minute action done 365 days &gt; A 1-hour action done 10 days. 
                  Consistency beats intensity every time.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Coffee className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">2. The Anchor Habit</h4>
                  <p className="text-purple-200 text-sm mb-3">
                    Beats: <span className="font-bold text-blue-300">Environment & Mood Killers</span>
                  </p>
                  <p className="text-purple-300 text-sm mb-3">
                    Stack your social action onto an existing routine. No motivation required—it just happens.
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 mb-4">
                <p className="text-purple-200 text-sm font-medium mb-3">The Formula:</p>
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30 mb-3">
                  <p className="text-blue-200 text-center font-mono text-sm">
                    After [EXISTING HABIT], I will [SOCIAL ACTION]
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <p className="text-purple-300">After my morning coffee → Compliment the barista</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Activity className="w-4 h-4 text-green-400" />
                    <p className="text-purple-300">After my gym workout → Chat with 1 person</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-purple-400" />
                    <p className="text-purple-300">After lunch → Join a colleague in the break room</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-700/30">
                <p className="text-blue-200 text-sm font-medium mb-1">Why it works:</p>
                <p className="text-blue-300 text-xs">
                  Your brain already has a trigger (coffee). You're piggybacking on existing neural pathways 
                  instead of building new ones from scratch.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Battery className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">3. Energy-Matched Actions</h4>
                  <p className="text-purple-200 text-sm mb-3">
                    Beats: <span className="font-bold text-yellow-300">Energy Killer</span>
                  </p>
                  <p className="text-purple-300 text-sm mb-3">
                    Different actions for different energy states. Stay consistent without burning out.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-green-900/20 p-4 rounded-xl border border-green-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Sun className="w-5 h-5 text-green-400" />
                    <p className="text-green-200 font-medium text-sm">High Energy (80-100%)</p>
                  </div>
                  <p className="text-green-300 text-xs">
                    Initiate conversations, approach strangers, take social risks, lead group activities
                  </p>
                </div>

                <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-yellow-400" />
                    <p className="text-yellow-200 font-medium text-sm">Medium Energy (40-79%)</p>
                  </div>
                  <p className="text-yellow-300 text-xs">
                    Join existing conversations, respond warmly, attend social events, reconnect with friends
                  </p>
                </div>

                <div className="bg-red-900/20 p-4 rounded-xl border border-red-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Moon className="w-5 h-5 text-red-400" />
                    <p className="text-red-200 font-medium text-sm">Low Energy (0-39%)</p>
                  </div>
                  <p className="text-red-300 text-xs">
                    Smile at 3 people, send 1 text, make brief eye contact, listen actively (no initiating)
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-orange-900/20 p-4 rounded-xl border border-orange-700/30">
                <p className="text-orange-200 text-sm font-medium mb-1">Why it works:</p>
                <p className="text-orange-300 text-xs">
                  You're not fighting your energy—you're working WITH it. The habit stays alive even on hard days.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">4. Streaks Don't Die Rule</h4>
                  <p className="text-purple-200 text-sm mb-3">
                    Beats: <span className="font-bold text-pink-300">All Killers</span>
                  </p>
                  <p className="text-purple-300 text-sm mb-3">
                    Mathematical truth: 1 is infinitely better than 0. Never let the streak break.
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 mb-4">
                <p className="text-purple-200 text-sm font-medium mb-3">The Emergency Backup:</p>
                <p className="text-purple-300 text-sm mb-3">
                  Set an action SO EASY that you can do it even in worst-case scenarios:
                </p>
                <div className="space-y-2">
                  <div className="bg-pink-900/20 p-3 rounded-lg border border-pink-700/30">
                    <p className="text-pink-200 text-xs font-medium mb-1">If I can't do my main action...</p>
                    <p className="text-pink-300 text-xs">I'll at least send ONE genuine text to someone (30 seconds)</p>
                  </div>
                  <div className="bg-pink-900/20 p-3 rounded-lg border border-pink-700/30">
                    <p className="text-pink-200 text-xs font-medium mb-1">If I'm traveling...</p>
                    <p className="text-pink-300 text-xs">I'll at least ask a hotel staff member how their day is going</p>
                  </div>
                  <div className="bg-pink-900/20 p-3 rounded-lg border border-pink-700/30">
                    <p className="text-pink-200 text-xs font-medium mb-1">If I'm sick...</p>
                    <p className="text-pink-300 text-xs">I'll at least smile at my reflection and do a voice memo check-in</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/20 p-4 rounded-xl border border-red-700/30">
                <p className="text-red-200 text-sm font-medium mb-1">Why it works:</p>
                <p className="text-red-300 text-xs">
                  Missing one day makes you 3x more likely to quit. Your backup prevents the domino effect.
                  The streak is the system.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">5. The Context Lock</h4>
                  <p className="text-purple-200 text-sm mb-3">
                    Beats: <span className="font-bold text-indigo-300">Environment & Mood Killers</span>
                  </p>
                  <p className="text-purple-300 text-sm mb-3">
                    Same time + Same place = Autopilot. Remove decision fatigue entirely.
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 mb-4">
                <p className="text-purple-200 text-sm font-medium mb-3">The Formula:</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-700/30 text-center">
                    <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                    <p className="text-indigo-200 text-xs font-medium mb-1">WHEN</p>
                    <p className="text-indigo-300 text-xs">Specific time</p>
                    <p className="text-indigo-400 text-xs italic mt-1">e.g., 9:00 AM</p>
                  </div>
                  <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-700/30 text-center">
                    <Building className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                    <p className="text-indigo-200 text-xs font-medium mb-1">WHERE</p>
                    <p className="text-indigo-300 text-xs">Specific place</p>
                    <p className="text-indigo-400 text-xs italic mt-1">e.g., Coffee shop</p>
                  </div>
                  <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-700/30 text-center">
                    <Target className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                    <p className="text-indigo-200 text-xs font-medium mb-1">WHAT</p>
                    <p className="text-indigo-300 text-xs">Specific action</p>
                    <p className="text-indigo-400 text-xs italic mt-1">e.g., Talk to barista</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-700/30">
                <p className="text-indigo-200 text-sm font-medium mb-1">Why it works:</p>
                <p className="text-indigo-300 text-xs">
                  Your brain loves patterns. When context is identical, behavior becomes automatic. 
                  You stop needing to "decide" whether to do it.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
            <Sparkles className="w-6 h-6 text-yellow-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Your Toolkit is Ready</h4>
            <p className="text-purple-100">
              You now have 5 techniques. In the next step, you'll build your personalized consistency system 
              using the ones that match YOUR killer profile.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'scenarios',
      title: 'Pressure-Test Scenarios',
      icon: Play,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-6 rounded-2xl border-2 border-orange-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Play className="w-7 h-7 text-orange-400" />
              Real-World Decision Training
            </h3>
            <p className="text-orange-100 mb-2">
              Let's practice the moments that will test your consistency. What would you do?
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {scenarios.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                    idx === currentScenario
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white scale-110 shadow-xl'
                      : idx < currentScenario
                      ? 'bg-green-500/30 text-green-300 border-2 border-green-500/50'
                      : 'bg-purple-900/30 text-purple-400 border-2 border-purple-700/30'
                  }`}
                >
                  {idx < currentScenario ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2 text-lg">Scenario {currentScenario + 1}</h4>
                <p className="text-xl font-bold text-purple-100 mb-3">{scenarios[currentScenario].title}</p>
                <p className="text-purple-200 text-sm">{scenarios[currentScenario].description}</p>
              </div>
            </div>

            {!showFeedback ? (
              <div className="space-y-3">
                <p className="text-purple-200 font-medium mb-4">What do you do?</p>
                {scenarios[currentScenario].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setLastChoice(option);
                      setShowFeedback(true);
                      setUserData(prev => ({
                        ...prev,
                        scenarioChoices: [...prev.scenarioChoices, { scenario: currentScenario, choice: option.id, correct: option.correct }],
                        totalXP: prev.totalXP + (option.correct ? 50 : 25)
                      }));
                    }}
                    className="w-full p-5 bg-purple-900/30 hover:bg-purple-800/40 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-700/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/40 transition-colors">
                        <span className="font-bold text-purple-200">{option.id}</span>
                      </div>
                      <p className="text-purple-100 text-sm">{option.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-5 rounded-xl border-2 ${
                  lastChoice.correct
                    ? 'bg-green-900/20 border-green-500/50'
                    : 'bg-orange-900/20 border-orange-500/50'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {lastChoice.correct ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <h4 className="font-bold text-green-100 text-lg">Excellent Choice! 🎉</h4>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-6 h-6 text-orange-400" />
                        <h4 className="font-bold text-orange-100 text-lg">Learning Moment</h4>
                      </>
                    )}
                  </div>
                  <p className={`text-sm mb-4 ${lastChoice.correct ? 'text-green-200' : 'text-orange-200'}`}>
                    {lastChoice.consequence}
                  </p>
                </div>

                <div className="bg-purple-950/30 p-5 rounded-xl border border-purple-700/30">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-purple-200 font-medium text-sm mb-2">Key Lesson:</p>
                      <p className="text-purple-300 text-sm">{scenarios[currentScenario].lesson}</p>
                    </div>
                  </div>
                </div>

                {currentScenario < scenarios.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentScenario(currentScenario + 1);
                      setShowFeedback(false);
                      setLastChoice(null);
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Next Scenario
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserData(prev => ({
                        ...prev,
                        completedSteps: [...prev.completedSteps, 'scenarios']
                      }));
                      triggerConfetti();
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Complete Scenarios
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {userData.scenarioChoices.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
              <Award className="w-6 h-6 text-purple-400 mb-3" />
              <h4 className="font-bold text-white mb-2">Progress</h4>
              <p className="text-purple-100 text-sm">
                You've completed {userData.scenarioChoices.length} scenario{userData.scenarioChoices.length !== 1 ? 's' : ''}. 
                {userData.scenarioChoices.filter(c => c.correct).length > 0 && 
                  ` You made ${userData.scenarioChoices.filter(c => c.correct).length} optimal decision${userData.scenarioChoices.filter(c => c.correct).length !== 1 ? 's' : ''}!`
                }
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'system-builder',
      title: 'Build Your System',
      icon: Target,
      content: (
        <div className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 p-6 rounded-2xl border-2 border-emerald-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Target className="w-7 h-7 text-emerald-400" />
              Your Personal Consistency System
            </h3>
            <p className="text-emerald-100">
              Let's build YOUR custom system. Fill out each component based on what you've learned.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-green-300">1</span>
                </div>
                <h4 className="text-lg font-bold text-white">Your Minimum Viable Action (MVA)</h4>
              </div>
              <p className="text-purple-200 text-sm mb-3">
                What's the smallest social action you can do daily? (Must be less than 5 minutes)
              </p>
              <input
                type="text"
                value={userData.mva}
                onChange={(e) => setUserData({ ...userData, mva: e.target.value })}
                placeholder="e.g., 'Smile and say hi to 1 person'"
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 text-sm"
              />
              {userData.mva && (
                <div className="mt-3 flex items-center gap-2 text-green-300 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Great! This is doable even when you're exhausted.</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-300">2</span>
                </div>
                <h4 className="text-lg font-bold text-white">Your Anchor Habit</h4>
              </div>
              <p className="text-purple-200 text-sm mb-3">
                Stack your action onto an existing routine: "After ___, I will do my MVA"
              </p>
              <input
                type="text"
                value={userData.anchorHabit}
                onChange={(e) => setUserData({ ...userData, anchorHabit: e.target.value })}
                placeholder="e.g., 'After my morning coffee' or 'After I check my phone'"
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 text-sm"
              />
              {userData.anchorHabit && (
                <div className="mt-3 bg-blue-900/20 p-3 rounded-lg border border-blue-700/30">
                  <p className="text-blue-200 text-sm">
                    Your trigger: <span className="font-bold">After {userData.anchorHabit}</span> → Do your MVA
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-yellow-300">3</span>
                </div>
                <h4 className="text-lg font-bold text-white">Your Energy Menu</h4>
              </div>
              <p className="text-purple-200 text-sm mb-4">
                Different actions for different energy states. This keeps you consistent without burnout.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-green-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    High Energy (80-100%)
                  </label>
                  <input
                    type="text"
                    value={userData.energyMenu.high}
                    onChange={(e) => setUserData({ 
                      ...userData, 
                      energyMenu: { ...userData.energyMenu, high: e.target.value }
                    })}
                    placeholder="e.g., 'Initiate 3 conversations with strangers'"
                    className="w-full px-4 py-3 bg-green-950/30 border-2 border-green-500/30 rounded-xl text-white placeholder-green-400/50 focus:outline-none focus:border-green-400 text-sm"
                  />
                </div>

                <div>
                  <label className="text-yellow-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Medium Energy (40-79%)
                  </label>
                  <input
                    type="text"
                    value={userData.energyMenu.medium}
                    onChange={(e) => setUserData({ 
                      ...userData, 
                      energyMenu: { ...userData.energyMenu, medium: e.target.value }
                    })}
                    placeholder="e.g., 'Join existing conversation or send 2 texts'"
                    className="w-full px-4 py-3 bg-yellow-950/30 border-2 border-yellow-500/30 rounded-xl text-white placeholder-yellow-400/50 focus:outline-none focus:border-yellow-400 text-sm"
                  />
                </div>

                <div>
                  <label className="text-red-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Low Energy (0-39%)
                  </label>
                  <input
                    type="text"
                    value={userData.energyMenu.low}
                    onChange={(e) => setUserData({ 
                      ...userData, 
                      energyMenu: { ...userData.energyMenu, low: e.target.value }
                    })}
                    placeholder="e.g., 'Smile at 3 people or send 1 genuine text'"
                    className="w-full px-4 py-3 bg-red-950/30 border-2 border-red-500/30 rounded-xl text-white placeholder-red-400/50 focus:outline-none focus:border-red-400 text-sm"
                  />
                </div>
              </div>

              {userData.energyMenu.low && (
                <div className="mt-4 bg-orange-900/20 p-3 rounded-lg border border-orange-700/30">
                  <p className="text-orange-200 text-xs">
                    ✅ Perfect! Now you can stay consistent even when exhausted.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-300">4</span>
                </div>
                <h4 className="text-lg font-bold text-white">Your Consistency Trigger</h4>
              </div>
              <p className="text-purple-200 text-sm mb-4">
                Lock in the context: WHEN + WHERE + HOW OFTEN
              </p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-purple-300 text-xs font-medium mb-2 block">Time</label>
                  <input
                    type="time"
                    value={userData.consistencyTrigger.time}
                    onChange={(e) => setUserData({ 
                      ...userData, 
                      consistencyTrigger: { ...userData.consistencyTrigger, time: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-purple-950/50 border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>

                <div>
                  <label className="text-purple-300 text-xs font-medium mb-2 block">Place</label>
                  <input
                    type="text"
                    value={userData.consistencyTrigger.place}
                    onChange={(e) => setUserData({ 
                      ...userData, 
                      consistencyTrigger: { ...userData.consistencyTrigger, place: e.target.value }
                    })}
                    placeholder="e.g., Coffee shop"
                    className="w-full px-3 py-2 bg-purple-950/50 border-2 border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>

                <div>
                  <label className="text-purple-300 text-xs font-medium mb-2 block">Frequency</label>
                  <select
                    value={userData.consistencyTrigger.frequency}
                    onChange={(e) => setUserData({ 
                      ...userData, 
                      consistencyTrigger: { ...userData.consistencyTrigger, frequency: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-purple-950/50 border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="mwf">Mon/Wed/Fri</option>
                    <option value="tth">Tue/Thu</option>
                  </select>
                </div>
              </div>

              {userData.consistencyTrigger.time && userData.consistencyTrigger.place && (
                <div className="mt-4 bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
                  <p className="text-indigo-200 text-sm font-medium mb-2">Your Consistency Lock:</p>
                  <p className="text-indigo-300 text-sm">
                    Every <span className="font-bold">{userData.consistencyTrigger.frequency}</span> at{' '}
                    <span className="font-bold">{userData.consistencyTrigger.time}</span> in{' '}
                    <span className="font-bold">{userData.consistencyTrigger.place}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-pink-300">5</span>
                </div>
                <h4 className="text-lg font-bold text-white">Your Emergency Backup</h4>
              </div>
              <p className="text-purple-200 text-sm mb-3">
                When everything goes wrong, what's the ABSOLUTE MINIMUM you'll do? (Must be less than 2 minutes)
              </p>
              <input
                type="text"
                value={userData.emergencyBackup}
                onChange={(e) => setUserData({ ...userData, emergencyBackup: e.target.value })}
                placeholder="e.g., 'Send ONE genuine text message to someone'"
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 text-sm"
              />
              {userData.emergencyBackup && (
                <div className="mt-3 bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                  <p className="text-red-200 text-xs font-medium">
                    🚨 Streak Saver: This prevents the domino effect of missing days.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-300">6</span>
                </div>
                <h4 className="text-lg font-bold text-white">Your Accountability</h4>
              </div>
              <p className="text-purple-200 text-sm mb-4">
                Who will know if you skip? How will you track?
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-cyan-300 text-sm font-medium mb-2 block">Accountability Partner</label>
                  <input
                    type="text"
                    value={userData.accountability}
                    onChange={(e) => setUserData({ ...userData, accountability: e.target.value })}
                    placeholder="e.g., 'My friend Alex' or 'My partner' or 'Public Instagram stories'"
                    className="w-full px-4 py-3 bg-cyan-950/30 border-2 border-cyan-500/30 rounded-xl text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="text-cyan-300 text-sm font-medium mb-2 block">Tracking Method</label>
                  <select
                    value={userData.trackingMethod}
                    onChange={(e) => setUserData({ ...userData, trackingMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-cyan-950/30 border-2 border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="">Select tracking method...</option>
                    <option value="app">Mobile app tracker</option>
                    <option value="calendar">Calendar/planner</option>
                    <option value="journal">Physical journal</option>
                    <option value="spreadsheet">Spreadsheet</option>
                    <option value="habit-tracker">Habit tracker app</option>
                  </select>
                </div>
              </div>

              {userData.accountability && userData.trackingMethod && (
                <div className="mt-4 bg-cyan-900/20 p-3 rounded-lg border border-cyan-700/30">
                  <p className="text-cyan-200 text-xs">
                    ✅ Accountability increases success rate by 65%. You're set up to win.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!userData.mva || !userData.anchorHabit || !userData.emergencyBackup}
              className="w-full px-8 py-5 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl font-bold text-lg hover:from-emerald-500 hover:to-green-500 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View My Complete System
             <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          </div>
          )}

          {/* Step 2: System Summary */}
          {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-800/40 backdrop-blur-sm rounded-full border border-green-500/30">
                <Trophy className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium text-green-200">Your System</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 bg-clip-text text-transparent">
                Your Consistency Contract
              </h1>
              <p className="text-lg text-purple-300">Screenshot this for your records</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md p-8 rounded-3xl border-4 border-green-500/50 shadow-2xl">
              <div className="text-center mb-8">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">My 66-Day Consistency System</h2>
                <p className="text-purple-300 text-sm">Created: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-950/50 p-6 rounded-2xl border-2 border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-green-400" />
                    <h3 className="font-bold text-white text-lg">My Minimum Viable Action</h3>
                  </div>
                  <p className="text-purple-100 text-xl font-medium pl-9">"{userData.mva}"</p>
                </div>

                <div className="bg-purple-950/50 p-6 rounded-2xl border-2 border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Coffee className="w-6 h-6 text-blue-400" />
                    <h3 className="font-bold text-white text-lg">My Anchor Habit</h3>
                  </div>
                  <p className="text-purple-100 text-lg pl-9">
                    After <span className="font-bold text-blue-300">{userData.anchorHabit}</span>, I will do my MVA
                  </p>
                </div>

                <div className="bg-purple-950/50 p-6 rounded-2xl border-2 border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Battery className="w-6 h-6 text-yellow-400" />
                    <h3 className="font-bold text-white text-lg">My Energy Menu</h3>
                  </div>
                  <div className="space-y-3 pl-9">
                    {userData.energyMenu.high && (
                      <div className="flex items-start gap-2">
                        <Sun className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-300 text-sm font-medium">High Energy:</p>
                          <p className="text-purple-100">{userData.energyMenu.high}</p>
                        </div>
                      </div>
                    )}
                    {userData.energyMenu.medium && (
                      <div className="flex items-start gap-2">
                        <Activity className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-300 text-sm font-medium">Medium Energy:</p>
                          <p className="text-purple-100">{userData.energyMenu.medium}</p>
                        </div>
                      </div>
                    )}
                    {userData.energyMenu.low && (
                      <div className="flex items-start gap-2">
                        <Moon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 text-sm font-medium">Low Energy:</p>
                          <p className="text-purple-100">{userData.energyMenu.low}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {userData.consistencyTrigger.time && (
                  <div className="bg-purple-950/50 p-6 rounded-2xl border-2 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-purple-400" />
                      <h3 className="font-bold text-white text-lg">My Consistency Trigger</h3>
                    </div>
                    <p className="text-purple-100 text-lg pl-9">
                      Every <span className="font-bold">{userData.consistencyTrigger.frequency}</span> at{' '}
                      <span className="font-bold text-purple-300">{userData.consistencyTrigger.time}</span>{' '}
                      {userData.consistencyTrigger.place && (
                        <>in <span className="font-bold text-purple-300">{userData.consistencyTrigger.place}</span></>
                      )}
                    </p>
                  </div>
                )}

                <div className="bg-red-950/30 p-6 rounded-2xl border-2 border-red-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Flame className="w-6 h-6 text-red-400" />
                    <h3 className="font-bold text-white text-lg">My Emergency Backup</h3>
                  </div>
                  <p className="text-red-100 text-lg pl-9">
                    If I absolutely can't do my MVA: "<span className="font-bold">{userData.emergencyBackup}</span>"
                  </p>
                  <p className="text-red-300 text-sm pl-9 mt-2">
                    🚨 This keeps my streak alive on worst-case days
                  </p>
                </div>

                {userData.accountability && (
                  <div className="bg-cyan-950/30 p-6 rounded-2xl border-2 border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-6 h-6 text-cyan-400" />
                      <h3 className="font-bold text-white text-lg">My Accountability</h3>
                    </div>
                    <p className="text-cyan-100 pl-9">
                      Partner: <span className="font-bold">{userData.accountability}</span>
                    </p>
                    {userData.trackingMethod && (
                      <p className="text-cyan-100 pl-9 mt-2">
                        Tracking via: <span className="font-bold">{userData.trackingMethod}</span>
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6 rounded-2xl border-2 border-yellow-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <h3 className="font-bold text-white text-lg">My Commitment</h3>
                  </div>
                  <p className="text-yellow-100 text-lg pl-9 font-medium">
                    I commit to following this system for the next 66 days. I understand that:
                  </p>
                  <ul className="text-yellow-200 text-sm pl-12 mt-3 space-y-1">
                    <li>• Days 1-14 will feel easy (don't overcommit)</li>
                    <li>• Days 15-35 will feel hard (this is normal)</li>
                    <li>• Days 36-50 will feel boring (stick with it)</li>
                    <li>• Days 51-66 will feel automatic (success)</li>
                    <li>• Missing 1 day makes me 3x more likely to quit</li>
                    <li>• 1 minute of action &gt; 0 minutes of perfect planning</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-purple-500/30 text-center">
                <p className="text-purple-200 text-sm mb-4">Signature & Date</p>
                <div className="text-2xl font-bold text-white mb-2">________________________</div>
                <p className="text-purple-400 text-sm">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-6 py-4 bg-purple-900/50 hover:bg-purple-800/50 rounded-xl border border-purple-500/30 transition-all text-sm font-medium"
              >
                ← Edit My System
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                Take First Action Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: First Action */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-800/40 backdrop-blur-sm rounded-full border border-orange-500/30">
                <Zap className="w-5 h-5 text-orange-300" />
                <span className="text-sm font-medium text-orange-200">Launch</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                Let's Start RIGHT NOW
              </h1>
              <p className="text-lg text-purple-300">Don't wait. Take your first action before you close this.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-8 rounded-3xl border-2 border-orange-500/30 shadow-2xl">
              <div className="text-center mb-6">
                <Zap className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Your First MVA</h2>
                <p className="text-orange-100 text-lg mb-6">
                  Do this <span className="font-bold">within the next 5 minutes</span>:
                </p>
                <div className="bg-yellow-950/30 p-6 rounded-2xl border-2 border-yellow-500/40 mb-6">
                  <p className="text-2xl font-bold text-white">"{userData.mva}"</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30 text-center">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-200 text-sm font-medium">Time Limit</p>
                  <p className="text-2xl font-bold text-white">5 min</p>
                </div>
                <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-purple-200 text-sm font-medium">Difficulty</p>
                  <p className="text-2xl font-bold text-white">Easy</p>
                </div>
                <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30 text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-purple-200 text-sm font-medium">Reward</p>
                  <p className="text-2xl font-bold text-white">Day 1</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30 mb-6">
                <Lightbulb className="w-6 h-6 text-yellow-400 mb-3" />
                <h4 className="font-bold text-white mb-2">Why Right Now?</h4>
                <p className="text-purple-100 text-sm">
                  Research shows people who take immediate action are <span className="font-bold">5x more likely</span> to maintain 
                  consistency than those who "plan to start tomorrow." Don't let momentum die.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-7 h-7" />
                I Did It! Start My 66-Day Journey
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                What Happens Next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold text-green-300">1</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Tomorrow: Repeat your MVA</p>
                    <p className="text-purple-300 text-sm">Use your anchor habit as the trigger</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold text-blue-300">2</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Day 7: First milestone celebration</p>
                    <p className="text-purple-300 text-sm">You've proven you can show up. Keep going.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold text-yellow-300">3</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Day 14: The motivation cliff</p>
                    <p className="text-purple-300 text-sm">Use your energy menu. This is when most people quit—not you.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold text-orange-300">4</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Day 21-35: The grind phase</p>
                    <p className="text-purple-300 text-sm">Deploy emergency backup if needed. Just don't break the streak.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold text-purple-300">5</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Day 40+: It starts feeling natural</p>
                    <p className="text-purple-300 text-sm">You'll notice you're doing it without thinking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold text-pink-300">6</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Day 66: Habit locked in</p>
                    <p className="text-purple-300 text-sm">Neural pathway formed. You're a consistent person now.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 p-6 rounded-2xl border-2 border-red-500/30">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-2 text-lg">Critical Reminder</h4>
                  <p className="text-red-200 text-sm mb-3">
                    If you skip tomorrow, you're 3x more likely to quit entirely. The system only works if you USE it.
                  </p>
                  <p className="text-red-300 text-sm">
                    Set an alarm right now for tomorrow at <span className="font-bold">{userData.consistencyTrigger.time || 'your trigger time'}</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Your Consistency Score Tracker
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Track these metrics daily to measure your consistency:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm font-medium">Streak Count</span>
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">Day 1</p>
                  <p className="text-purple-400 text-xs">Primary metric</p>
                </div>

                <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm font-medium">Completion Rate</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">100%</p>
                  <p className="text-purple-400 text-xs">Actions done / planned</p>
                </div>

                <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm font-medium">Energy Adaptation</span>
                    <Battery className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">0/0</p>
                  <p className="text-purple-400 text-xs">Times you adjusted vs quit</p>
                </div>

                <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm font-medium">Days to Automation</span>
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">65</p>
                  <p className="text-purple-400 text-xs">Days remaining</p>
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-8 py-6 rounded-2xl border-2 border-purple-500/30">
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-2xl font-bold text-white mb-2">
                  You're not just building a habit.
                </p>
                <p className="text-xl text-purple-200">
                  You're becoming a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">consistent person</span>.
                </p>
                <p className="text-sm text-purple-400 mt-4 italic">
                  "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      {steps[5].content}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        input:focus, select:focus {
          outline: none;
        }

        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}

export default ConsistencyMastery;