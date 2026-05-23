import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Check, Heart, Target, ChevronLeft, ChevronRight, Zap, Sparkles, Loader2, MapPin, Clock } from "lucide-react";

interface PageProps {
  onNext: () => void;
  briefingData?: {
    location: string;
    time: string;
    energyLevel: number;
    confidenceLevel: number;
    venueIntel?: {
      friendliness_score: number;
      typical_crowd: string;
      noise_level: string;
    };
    openers?: Array<{
      text: string;
      difficulty: string;
    }>;
  };
}

export  function MORNINGPREP({ onNext, briefingData }: PageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({
    breathing: false,
    affirmations: false,
    visualization: false,
    physicalWarmup: false
  });

  const [breathingState, setBreathingState] = useState<{
    phase: "inhale" | "hold" | "exhale" | "idle";
    secondsLeft: number;
    cyclesCompleted: number;
  }>({
    phase: "idle",
    secondsLeft: 0,
    cyclesCompleted: 0
  });

  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [selectedAffirmations, setSelectedAffirmations] = useState<string[]>([]);
  const [customAffirmation, setCustomAffirmation] = useState("");

  // Breathing timer logic
  useEffect(() => {
    if (!isBreathingActive || breathingState.phase === "idle") return;

    const timer = setInterval(() => {
      setBreathingState(prev => {
        let nextPhase = prev.phase;
        let nextSeconds = prev.secondsLeft - 1;
        let nextCycles = prev.cyclesCompleted;

        if (nextSeconds <= 0) {
          if (prev.phase === "inhale") {
            nextPhase = "hold";
            nextSeconds = 2;
          } else if (prev.phase === "hold") {
            nextPhase = "exhale";
            nextSeconds = 5;
          } else if (prev.phase === "exhale") {
            nextCycles = prev.cyclesCompleted + 1;
            if (nextCycles >= 3) {
              setIsBreathingActive(false);
              setCompletedSteps(prev => ({ ...prev, breathing: true }));
              return prev;
            }
            nextPhase = "inhale";
            nextSeconds = 5;
          }
        }

        return {
          phase: nextPhase,
          secondsLeft: nextSeconds,
          cyclesCompleted: nextCycles
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathingState.phase]);

  const getPersonalizedAffirmations = () => {
    const baseAffirmations = [
      "I will meet 2–3 people today.",
      "Small conversations are enough.",
      "I am capable and worthy of connection."
    ];

    if (!briefingData) return baseAffirmations;

    const personalized = [...baseAffirmations];

    if (briefingData.confidenceLevel <= 2) {
      personalized.push("I only need to try. Outcomes are secondary.");
      personalized.push("Rejection reflects nothing about my worth.");
    } else if (briefingData.confidenceLevel >= 4) {
      personalized.push("I bring genuine energy to every conversation.");
      personalized.push("People naturally want to talk to me.");
    }

    if (briefingData.venueIntel?.friendliness_score >= 75) {
      personalized.push("People here are naturally open—I fit right in.");
    } else if (briefingData.venueIntel?.friendliness_score <= 50) {
      personalized.push("I will find the one person who's interested in talking.");
      personalized.push("Quality over quantity—one great conversation is a win.");
    }

    if (briefingData.energyLevel <= 2) {
      personalized.push("Even low-energy interactions matter.");
      personalized.push("I'll pace myself and rest as needed.");
    } else if (briefingData.energyLevel >= 4) {
      personalized.push("I have the energy to make a real impact today.");
    }

    return personalized;
  };

  const getPersonalizedVisualization = () => {
    if (!briefingData) {
      return {
        title: "Standard Visualization",
        steps: [
          "See yourself entering the location calmly",
          "Make eye contact with 2-3 people",
          "Use one of your openers naturally",
          "Have a 5-minute conversation flowing",
          "Exit gracefully feeling proud"
        ]
      };
    }

    return {
      title: `${briefingData.location} Visualization`,
      steps: [
        `Walk into ${briefingData.location} feeling calm and present`,
        briefingData.venueIntel?.noise_level === "loud" 
          ? "Navigate the noise with ease, finding a natural spot"
          : "Find a comfortable spot where conversation flows naturally",
        `Spot someone who matches the typical crowd: ${briefingData.venueIntel?.typical_crowd || "friendly people"}`,
        `Use one of your openers with genuine confidence`,
        "Listen more than you talk—ask them questions",
        "Feel the conversation flowing naturally for 5+ minutes",
        "Exchange information or end gracefully feeling accomplished"
      ]
    };
  };

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingState({
      phase: "inhale",
      secondsLeft: 5,
      cyclesCompleted: 0
    });
  };

  const toggleAffirmation = (affirmation: string) => {
    setSelectedAffirmations(prev =>
      prev.includes(affirmation)
        ? prev.filter(a => a !== affirmation)
        : [...prev, affirmation]
    );
  };

  const addCustomAffirmation = () => {
    if (customAffirmation.trim()) {
      setSelectedAffirmations(prev => [...prev, customAffirmation]);
      setCustomAffirmation("");
    }
  };

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch(currentStep) {
      case 0: return completedSteps.breathing;
      case 1: return selectedAffirmations.length > 0;
      case 2: return completedSteps.visualization;
      case 3: return completedSteps.physicalWarmup;
      default: return false;
    }
  };

  const personalizedAffirmations = getPersonalizedAffirmations();
  const visualization = getPersonalizedVisualization();
  const completedCount = Object.values(completedSteps).filter(v => v).length;

  const stepTitles = ["Breathe", "Affirm", "Visualize", "Energize"];
  const stepIcons = [Zap, Heart, Sparkles, Zap];
  const stepColors = [
    "from-blue-500 to-cyan-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-purple-600",
    "from-orange-500 to-red-600"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex flex-col">
      
      {/* HEADER */}
      <div className="p-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Heart className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Mental Preparation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Center Yourself
            </h1>
            {briefingData && (
              <div className="flex items-center justify-center gap-4 text-sm text-purple-300 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {briefingData.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(briefingData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>

          {/* PROGRESS INDICATOR */}
          <div className="flex items-center justify-between mb-6">
            {[0, 1, 2, 3].map((step) => {
              const Icon = stepIcons[step];
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      step === currentStep
                        ? 'bg-gradient-to-br ' + stepColors[step] + ' border-white scale-110'
                        : step < currentStep
                        ? 'bg-green-500 border-green-400'
                        : 'bg-purple-900/50 border-purple-500/30'
                    }`}>
                      {step < currentStep ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <span className="text-xs mt-2 font-medium">{stepTitles[step]}</span>
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 flex-1 -mx-2 ${
                      step < currentStep ? 'bg-green-500' : 'bg-purple-500/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          
          {/* STEP 1: BREATHING */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stepColors[0]} rounded-2xl flex items-center justify-center`}>
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-purple-100">Breathe</h2>
                    <p className="text-purple-300">Calm your nervous system</p>
                  </div>
                </div>

                <p className="text-purple-200 mb-6">5 second inhale → 2 second hold → 5 second exhale. Repeat 3 times.</p>
                
                <div className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 p-8 rounded-2xl border-2 border-purple-500/30 text-center mb-6">
                  <div className="text-6xl font-bold mb-4 h-20 flex items-center justify-center">
                    {isBreathingActive ? (
                      <span className={`animate-pulse ${
                        breathingState.phase === 'inhale' ? 'text-blue-400' :
                        breathingState.phase === 'hold' ? 'text-purple-400' :
                        'text-pink-400'
                      }`}>
                        {breathingState.secondsLeft}
                      </span>
                    ) : breathingState.cyclesCompleted > 0 ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-purple-400">Ready</span>
                    )}
                  </div>
                  
                  {isBreathingActive && (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-purple-300 uppercase tracking-widest font-bold">
                        {breathingState.phase === 'inhale' && '🫁 Breathe In'}
                        {breathingState.phase === 'hold' && '⏸️ Hold'}
                        {breathingState.phase === 'exhale' && '💨 Breathe Out'}
                      </p>
                      <p className="text-xs text-purple-400">Cycle {breathingState.cyclesCompleted + 1} of 3</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {!isBreathingActive && breathingState.cyclesCompleted < 3 && (
                    <button
                      onClick={startBreathing}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl text-lg"
                    >
                      <Play className="w-6 h-6" />
                      Start Breathing
                    </button>
                  )}
                  {isBreathingActive && (
                    <button
                      onClick={() => setIsBreathingActive(false)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl text-lg"
                    >
                      <Pause className="w-6 h-6" />
                      Pause
                    </button>
                  )}
                  {breathingState.cyclesCompleted > 0 && (
                    <button
                      onClick={() => {
                        setIsBreathingActive(false);
                        setBreathingState({ phase: "idle", secondsLeft: 0, cyclesCompleted: 0 });
                        setCompletedSteps(prev => ({ ...prev, breathing: false }));
                      }}
                      className="flex-1 px-6 py-4 bg-purple-700/50 hover:bg-purple-600/50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      <RotateCcw className="w-6 h-6" />
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AFFIRMATIONS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stepColors[1]} rounded-2xl flex items-center justify-center`}>
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-purple-100">Affirm</h2>
                    <p className="text-purple-300">Choose affirmations that resonate</p>
                  </div>
                </div>

                <p className="text-purple-200 mb-6">Select at least one affirmation to continue:</p>

                <div className="space-y-3 mb-6">
                  {personalizedAffirmations.map((affirmation, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleAffirmation(affirmation)}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                        selectedAffirmations.includes(affirmation)
                          ? 'bg-pink-500/20 border-pink-400/50 shadow-lg'
                          : 'bg-purple-950/40 border-purple-500/20 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                          selectedAffirmations.includes(affirmation)
                            ? 'bg-pink-400/50 border-pink-300'
                            : 'border-purple-400'
                        }`}>
                          {selectedAffirmations.includes(affirmation) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <p className={`text-lg font-medium ${
                          selectedAffirmations.includes(affirmation)
                            ? 'text-pink-100'
                            : 'text-purple-200'
                        }`}>
                          "{affirmation}"
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-purple-500/20 pt-6">
                  <p className="text-sm text-purple-300 mb-3">Add your own affirmation:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAffirmation}
                      onChange={(e) => setCustomAffirmation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomAffirmation()}
                      placeholder="Type and press Enter..."
                      className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={addCustomAffirmation}
                      className="px-6 py-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-xl transition-all font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VISUALIZATION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stepColors[2]} rounded-2xl flex items-center justify-center`}>
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-purple-100">Visualize</h2>
                    <p className="text-purple-300">{visualization.title}</p>
                  </div>
                </div>

                <p className="text-purple-200 mb-6">Read through each step slowly. Close your eyes and see yourself doing each one:</p>
                
                <div className="space-y-3 mb-6">
                  {visualization.steps.map((step, idx) => (
                    <div key={idx} className="p-5 bg-purple-950/40 rounded-xl border border-purple-700/30">
                      <p className="text-purple-200">
                        <span className="font-bold text-purple-300 text-lg">{idx + 1}.</span> {step}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCompletedSteps(prev => ({ ...prev, visualization: true }))}
                  className={`w-full px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl text-lg ${
                    completedSteps.visualization
                      ? 'bg-green-600/50 cursor-default'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                  }`}
                >
                  <Check className="w-6 h-6" />
                  {completedSteps.visualization ? 'Visualization Complete' : 'Mark Complete'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PHYSICAL WARMUP */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stepColors[3]} rounded-2xl flex items-center justify-center`}>
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-purple-100">Energize</h2>
                    <p className="text-purple-300">Release physical tension</p>
                  </div>
                </div>

                <p className="text-purple-200 mb-6">Do these exercises to shake off nervous energy:</p>
                
                <div className="space-y-3 mb-6">
                  <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="font-bold text-purple-100 mb-2 text-lg">🤲 Shake Your Hands (20 seconds)</p>
                    <p className="text-purple-300">Loosely shake your hands and arms—let tension melt away</p>
                  </div>
                  <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="font-bold text-purple-100 mb-2 text-lg">🚶 Walk Around (30 seconds)</p>
                    <p className="text-purple-300">Walk briskly, swing your arms, move your body</p>
                  </div>
                  <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="font-bold text-purple-100 mb-2 text-lg">😊 Face Stretches (15 seconds)</p>
                    <p className="text-purple-300">Smile wide, raise eyebrows, relax jaw. Repeat 3x.</p>
                  </div>
                  <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="font-bold text-purple-100 mb-2 text-lg">💪 Shoulder Rolls (10 seconds)</p>
                    <p className="text-purple-300">Roll shoulders backward, feel your posture strengthen</p>
                  </div>
                </div>

                <button
                  onClick={() => setCompletedSteps(prev => ({ ...prev, physicalWarmup: true }))}
                  className={`w-full px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl text-lg ${
                    completedSteps.physicalWarmup
                      ? 'bg-green-600/50 cursor-default'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                  }`}
                >
                  <Check className="w-6 h-6" />
                  {completedSteps.physicalWarmup ? 'Warmup Complete' : 'Mark Complete'}
                </button>
              </div>

              {/* OPENERS PREVIEW */}
              {briefingData?.openers && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md p-6 rounded-3xl border-2 border-green-500/30 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-green-100">Your Openers</h3>
                  </div>
                  <div className="space-y-3">
                    {briefingData.openers.map((opener, idx) => (
                      <div key={idx} className="p-4 bg-green-950/40 rounded-xl border-l-4 border-green-500/50">
                        <p className="font-bold text-green-100 mb-1">"{opener.text}"</p>
                        <p className="text-xs text-green-400">Difficulty: {opener.difficulty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOTIVATIONAL MESSAGE */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-500/30 shadow-2xl">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-pink-100 mb-2 text-lg">You've Got This</h3>
                    <p className="text-pink-200 mb-3">
                      You've prepared mentally. You have your openers. You know what to look for. The hardest part is already done—now go show up with genuine interest in people.
                    </p>
                    <p className="text-sm text-pink-400 italic">
                      "Courage is not the absence of fear. It's moving forward despite it."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-purple-950 via-purple-900/95 to-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={goToPrevStep}
                className="px-6 py-4 bg-purple-700/50 hover:bg-purple-600/50 rounded-2xl font-bold transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            
            <button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                canProceed()
                  ? currentStep === 3
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-2xl'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl'
                  : 'bg-gray-700/50 cursor-not-allowed opacity-50'
              }`}
            >
              {!canProceed() && <Loader2 className="w-6 h-6 animate-spin" />}
              {canProceed() && currentStep < 3 && <ChevronRight className="w-6 h-6" />}
              {canProceed() && currentStep === 3 && <Sparkles className="w-6 h-6" />}
              {currentStep === 3 ? "I'm Ready - Let's Go! 🚀" : canProceed() ? 'Continue' : 'Complete This Step First'}
            </button>
          </div>
          
          <p className="text-center text-xs text-purple-300 mt-3">
            Step {currentStep + 1} of 4 • {completedCount} completed
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        button:focus-visible,
        input:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}