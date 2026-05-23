import { useState, useEffect } from 'react';
import { Brain, Heart, Clock, Target, Award, Zap, TrendingUp, Users, MessageCircle, Lightbulb, CheckCircle, XCircle, ChevronRight, ChevronLeft, Sparkles, Trophy, Flame, Eye, Ear, Star, Lock, Unlock, Play, Pause, RotateCcw, ArrowRight, Calendar, Bell } from 'lucide-react';

interface SUSTAINEDCONProps {
    onNext?: () => void;
}

export default function SustainedConnection({ onNext }: SUSTAINEDCONProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    conversationLength: 3,
    recallScore: 0,
    curiosityLayer: 1,
    listeningScore: 0,
    challengeCompleted: false,
    beforeMetrics: {
      avgLength: 3.2,
      recall: 15,
      layer: 1
    }
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState(null);

  // Step 1: 3-Minute Wall State
  const [sliderValue, setSliderValue] = useState(3);

  // Step 2: Hidden Costs State
  const [revealedCosts, setRevealedCosts] = useState([]);

  // Step 3: Conversation Simulator State
  const [simulatorStep, setSimulatorStep] = useState(0);
  const [simulatorScore, setSimulatorScore] = useState(0);
  const [conversationTime, setConversationTime] = useState(0);

  // Step 4: Memory Challenge State
  const [memoryPhase, setMemoryPhase] = useState('intro');
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryDetails, setMemoryDetails] = useState([
    { detail: 'Just moved to the city', remembered: false },
    { detail: 'Has a dog named Luna', remembered: false },
    { detail: 'Starting a new job Monday', remembered: false },
    { detail: 'Misses hiking from old city', remembered: false }
  ]);

  // Step 5: Curiosity Layer State
  const [currentLayer, setCurrentLayer] = useState(1);
  const [layerAnswers, setLayerAnswers] = useState([]);

  // Step 6: Listening Practice State
  const [listeningPhase, setListeningPhase] = useState('intro');
  const [listeningCues, setListeningCues] = useState([]);
  const [listeningScore, setListeningScore] = useState(0);

  // Step 7: Challenge State
  const [challengeSetup, setChallengeSetup] = useState({
    target: '',
    prepared: false,
    completed: false
  });

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const hiddenCosts = [
    {
      id: 'career',
      icon: '💼',
      title: 'Career Impact',
      description: 'Promotions go to people who build rapport, not just competence',
      stat: '73% of promotions involve strong relationships'
    },
    {
      id: 'loneliness',
      icon: '😔',
      title: 'Loneliness',
      description: 'You have 100 contacts but no one to call when you need support',
      stat: '82% feel lonely despite many connections'
    },
    {
      id: 'opportunities',
      icon: '🚪',
      title: 'Missed Opportunities',
      description: 'The best collaborations happen in minute 8-12 of conversation',
      stat: 'Deep insights emerge after 7+ minutes'
    },
    {
      id: 'identity',
      icon: '🎭',
      title: 'Shallow Identity',
      description: 'People only know surface-you, never the real you',
      stat: 'Real connections require vulnerability'
    }
  ];

  const conversationScenarios = [
    {
      question: 'Person A: "How was your weekend?"\nPerson B: "Good, pretty relaxed."',
      options: [
        { text: '"Nice!"', correct: false, killer: 'No Follow-Through', explanation: 'Conversation ends here. No curiosity shown.' },
        { text: '"Yeah, mine too."', correct: false, killer: 'Self-Centered Pivot', explanation: 'You redirected to yourself too quickly.' },
        { text: '"What did you do?"', correct: true, killer: null, explanation: 'Perfect! You kept curiosity alive.' }
      ]
    },
    {
      question: 'Person B: "Just watched some movies."\nWhat do you say?',
      options: [
        { text: '"Cool, what movies?"', correct: true, killer: null, explanation: 'Great follow-up! Showing genuine interest.' },
        { text: '"Nice."', correct: false, killer: 'No Follow-Through', explanation: 'Dead end. No depth created.' },
        { text: '"I love movies!"', correct: false, killer: 'Self-Centered Pivot', explanation: 'About you again, not them.' }
      ]
    },
    {
      question: 'Person B: "This indie film about connection."\nYour response?',
      options: [
        { text: '"What made it memorable?"', correct: true, killer: null, explanation: 'Excellent! You\'re going deeper.' },
        { text: '"I\'ve seen that!"', correct: false, killer: 'Self-Centered Pivot', explanation: 'Making it about your experience.' },
        { text: '"Cool, cool."', correct: false, killer: 'No Follow-Through', explanation: 'Conversation flatlines here.' }
      ]
    }
  ];

  const progressPercentage = (currentStep / 8) * 100;

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completeStep = () => {
    showNotification('Step completed! 🎉');
    triggerConfetti();
    setTimeout(() => nextStep(), 1500);
  };

  // Step 1: The 3-Minute Wall
  const renderStep1 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-400/30 mb-4">
          <Clock className="w-5 h-5 text-red-400" />
          <span className="text-sm font-medium text-red-200">The 3-Minute Wall</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Why Do Your Conversations Die?
        </h1>
        <p className="text-lg text-purple-200">Let's discover where you're getting stuck</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Conversation Timeline</h3>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-bold text-white">0-3 minutes</span>
              </div>
              <span className="text-sm text-purple-300">Easy, comfortable</span>
            </div>
            <div className="h-6 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-full" />
            </div>
            <p className="text-sm text-purple-300 italic">✅ You're here - small talk flows easily</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-white">3-7 minutes</span>
              </div>
              <span className="text-sm text-purple-300">Awkward silences begin</span>
            </div>
            <div className="h-6 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[40%]" />
            </div>
            <p className="text-sm text-orange-300 italic">⚠️ You struggle here - running out of things to say</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="font-bold text-white">7-10+ minutes</span>
              </div>
              <span className="text-sm text-purple-300">Real connection happens</span>
            </div>
            <div className="h-6 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-700 w-[20%]" />
            </div>
            <p className="text-sm text-red-300 italic">❌ Never reach this - where deep bonds form</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Self-Assessment</h3>
        <p className="text-purple-200 mb-6">How long do your conversations typically last?</p>
        
        <div className="space-y-6">
          <input
            type="range"
            min="1"
            max="10"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-4 bg-purple-950/50 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${(sliderValue / 10) * 100}%, rgb(88, 28, 135) ${(sliderValue / 10) * 100}%, rgb(88, 28, 135) 100%)`
            }}
          />
          
          <div className="flex justify-between text-sm text-purple-300">
            <span>&lt; 3 min</span>
            <span>3-5 min</span>
            <span>5-7 min</span>
            <span>7-10 min</span>
          </div>

          <div className="text-center p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
            <p className="text-3xl font-bold text-white mb-2">{sliderValue} minutes</p>
            <p className="text-purple-200">Your average conversation length</p>
          </div>
        </div>

        {sliderValue < 7 && (
          <div className="mt-6 p-6 bg-orange-900/30 rounded-2xl border-2 border-orange-500/50">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-orange-100 mb-2">Insight Unlocked</p>
                <p className="text-orange-200 text-sm">
                  You're losing <span className="font-bold text-orange-100">{Math.round((1 - sliderValue/10) * 100)}%</span> of connection opportunities by stopping too early. 
                  Real bonds form after the 7-minute mark.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setUserData({ ...userData, conversationLength: sliderValue });
            completeStep();
          }}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          Continue to Next Step
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  // Step 2: The Cost
  const renderStep2 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-400/30 mb-4">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-sm font-medium text-red-200">The Hidden Price</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          What Short Conversations Cost You
        </h1>
        <p className="text-lg text-purple-200">The real consequences of staying surface-level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-red-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">3-Minute Conversation</h3>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-red-950/30 rounded-xl border border-red-700/30">
              <p className="text-red-200 text-sm">"Hey, how's it going?"</p>
            </div>
            <div className="p-3 bg-red-950/30 rounded-xl border border-red-700/30">
              <p className="text-red-200 text-sm">"Good, you?"</p>
            </div>
            <div className="p-3 bg-red-950/30 rounded-xl border border-red-700/30">
              <p className="text-red-200 text-sm">"Yeah, busy!"</p>
            </div>
            <div className="p-3 bg-red-950/30 rounded-xl border border-red-700/30">
              <p className="text-red-200 text-sm">"Cool, see you around"</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-300">Result:</span>
              <span className="font-bold text-red-100">Acquaintance (forever)</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-red-300">Trust Level:</span>
                <span className="font-bold text-red-100">20%</span>
              </div>
              <div className="h-3 bg-red-950/50 rounded-full overflow-hidden border border-red-700/30">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-600 w-[20%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-800/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">10-Minute Conversation</h3>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-green-950/30 rounded-xl border border-green-700/30">
              <p className="text-green-200 text-sm">"Hey! How's it going?"</p>
            </div>
            <div className="p-3 bg-green-950/30 rounded-xl border border-green-700/30">
              <p className="text-green-200 text-sm">"Honestly? Exhausted from..."</p>
            </div>
            <div className="p-3 bg-green-950/30 rounded-xl border border-green-700/30">
              <p className="text-green-200 text-sm">"Oh really? What happened?"</p>
            </div>
            <div className="p-3 bg-green-950/30 rounded-xl border border-green-700/30">
              <p className="text-green-200 text-sm">[Deep story + follow-ups...]</p>
            </div>
            <div className="p-3 bg-green-950/30 rounded-xl border border-green-700/30">
              <p className="text-green-200 text-sm">"Thanks for listening, means a lot"</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-300">Result:</span>
              <span className="font-bold text-green-100">Real Connection</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-green-300">Trust Level:</span>
                <span className="font-bold text-green-100">70%</span>
              </div>
              <div className="h-3 bg-green-950/50 rounded-full overflow-hidden border border-green-700/30">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Unlock the Hidden Costs</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {hiddenCosts.map((cost) => (
            <button
              key={cost.id}
              onClick={() => {
                if (!revealedCosts.includes(cost.id)) {
                  setRevealedCosts([...revealedCosts, cost.id]);
                }
              }}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                revealedCosts.includes(cost.id)
                  ? 'bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/50 shadow-xl'
                  : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{cost.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg mb-2">{cost.title}</h4>
                  {revealedCosts.includes(cost.id) ? (
                    <>
                      <p className="text-purple-200 text-sm mb-3">{cost.description}</p>
                      <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                        <p className="text-xs text-purple-300 font-medium">{cost.stat}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-purple-400 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Click to reveal</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {revealedCosts.length === hiddenCosts.length && (
          <button
            onClick={completeStep}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            I Understand the Cost - Continue
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );

  // Step 3: The Science
  const renderStep3 = () => {
    const currentScenario = conversationScenarios[simulatorStep];
    
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-4">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">The Science</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Why Conversations Die
          </h1>
          <p className="text-lg text-purple-200">Learn the 3 killers and how to avoid them</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white">Conversation Simulator</h3>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-purple-800/50 rounded-full border border-purple-600/30">
                <span className="text-sm font-bold text-purple-200">Scenario {simulatorStep + 1}/3</span>
              </div>
              <div className="px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                <span className="text-sm font-bold text-green-200">{conversationTime} min</span>
              </div>
            </div>
          </div>

          {simulatorStep < conversationScenarios.length ? (
            <>
              <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30 mb-6">
                <p className="text-purple-100 whitespace-pre-line">{currentScenario.question}</p>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-white mb-4">What happens next?</p>
                {currentScenario.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (option.correct) {
                        setSimulatorScore(simulatorScore + 1);
                        setConversationTime(conversationTime + 2);
                        showNotification('✅ Great choice! +2 minutes');
                        setTimeout(() => setSimulatorStep(simulatorStep + 1), 2000);
                      } else {
                        showNotification(`❌ ${option.killer}: ${option.explanation}`);
                      }
                    }}
                    className="w-full p-5 bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-sm rounded-2xl border-2 border-purple-500/20 hover:border-purple-400/50 transition-all text-left shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      {option.correct ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                      <p className="text-white font-medium">{option.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Simulation Complete!</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
                  <p className="text-purple-300 text-sm mb-1">Score</p>
                  <p className="text-3xl font-bold text-white">{simulatorScore}/3</p>
                </div>
                <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
                  <p className="text-purple-300 text-sm mb-1">Time Kept</p>
                  <p className="text-3xl font-bold text-white">{conversationTime} min</p>
                </div>
              </div>
              <button
                onClick={completeStep}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl inline-flex items-center gap-2"
              >
                Continue to Memory Training
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-md p-6 rounded-3xl border-2 border-red-500/30">
            <div className="text-4xl mb-3">🚫</div>
            <h4 className="font-bold text-white mb-2">Killer #1</h4>
            <p className="text-red-200 text-sm mb-2">No Follow-Through</p>
            <p className="text-red-300 text-xs">Every statement has 3 follow-up doors</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 backdrop-blur-md p-6 rounded-3xl border-2 border-orange-500/30">
            <div className="text-4xl mb-3">↩️</div>
            <h4 className="font-bold text-white mb-2">Killer #2</h4>
            <p className="text-orange-200 text-sm mb-2">Self-Centered Pivot</p>
            <p className="text-orange-300 text-xs">Stay with THEM for 2-3 exchanges first</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 backdrop-blur-md p-6 rounded-3xl border-2 border-yellow-500/30">
            <div className="text-4xl mb-3">❓</div>
            <h4 className="font-bold text-white mb-2">Killer #3</h4>
            <p className="text-yellow-200 text-sm mb-2">Interview Mode</p>
            <p className="text-yellow-300 text-xs">Listen → Reflect → Then ask</p>
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Memory Challenge
  const renderStep4 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30 mb-4">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-200">The Foundation</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          The Recall Muscle
        </h1>
        <p className="text-lg text-purple-200">People feel seen when you remember</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        {memoryPhase === 'intro' && (
          <>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Memory Challenge</h3>
            <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30 mb-6">
              <p className="text-purple-200 mb-4">Watch this conversation and remember key details about Alex:</p>
              <div className="space-y-3 p-4 bg-purple-900/30 rounded-xl">
                <p className="text-purple-100 text-sm">💬 "Just moved to the city last week"</p>
                <p className="text-purple-100 text-sm">🐕 "My dog Luna is loving the new apartment"</p>
                <p className="text-purple-100 text-sm">💼 "Starting my new job on Monday, pretty nervous"</p>
                <p className="text-purple-100 text-sm">🏔️ "Really miss the hiking trails from my old city"</p>
              </div>
            </div>
            <button
              onClick={() => setMemoryPhase('test')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl"
            >
              I'm Ready - Test My Memory
            </button>
          </>
        )}

        {memoryPhase === 'test' && (
          <>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">30 Seconds Later...</h3>
            <p className="text-purple-200 mb-6">You see Alex again. What do you say?</p>
            
            <div className="space-y-4">
              <button
                onClick={() => showNotification('❌ Too generic - they won\'t remember you')}
                className="w-full p-5 bg-red-900/30 rounded-2xl border-2 border-red-500/30 text-left hover:border-red-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <p className="text-white">"Hey, how's it going?"</p>
                </div>
                <p className="text-red-300 text-sm mt-2 ml-9">Generic - no recall shown</p>
              </button>

              <button
                onClick={() => {
                  showNotification('✅ Perfect! You showed you were listening!');
                  setMemoryPhase('buildup');
                  setMemoryScore(memoryScore + 1);
                }}
                className="w-full p-5 bg-green-900/30 rounded-2xl border-2 border-green-500/30 text-left hover:border-green-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <p className="text-white">"Hey Alex! How's Luna settling into the new place?"</p>
                </div>
                <p className="text-green-300 text-sm mt-2 ml-9">Specific recall = instant bond</p>
              </button>
            </div>
          </>
        )}

        {memoryPhase === 'buildup' && (
          <>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Build From It</h3>
            <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30 mb-6">
              <p className="text-purple-100">Alex: "Oh wow, you remembered! She's loving it. Found a great park nearby."</p>
            </div>
            <p className="text-purple-200 mb-4">Now deepen the conversation:</p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  showNotification('✅ Excellent! You\'re building on the recall!');
                  setMemoryPhase('complete');
                  setMemoryScore(memoryScore + 1);
                }}
                className="w-full p-5 bg-green-900/30 rounded-2xl border-2 border-green-500/30 text-left hover:border-green-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <p className="text-white">"That's great! How are you feeling about starting Monday?"</p>
                </div>
                <p className="text-green-300 text-sm mt-2 ml-9">Recalls + deepens with another detail</p>
              </button>

              <button
                onClick={() => showNotification('⚠️ Good, but missed opportunity to go deeper')}
                className="w-full p-5 bg-orange-900/30 rounded-2xl border-2 border-orange-500/30 text-left hover:border-orange-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-400" />
                  <p className="text-white">"Nice! I should check that park out."</p>
                </div>
                <p className="text-orange-300 text-sm mt-2 ml-9">Shifted to yourself too quickly</p>
              </button>
            </div>
          </>
        )}

        {memoryPhase === 'complete' && (
          <>
            <div className="text-center py-12">
              <Star className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Memory Master!</h3>
              <div className="max-w-md mx-auto mb-6">
                <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
                  <p className="text-purple-300 text-sm mb-2">Recall Score</p>
                  <p className="text-5xl font-bold text-white mb-2">{Math.round((memoryScore / 2) * 100)}%</p>
                  <p className="text-purple-200 text-sm">You showed genuine interest!</p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-800/40 to-indigo-800/40 rounded-2xl border-2 border-purple-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <p className="font-bold text-white mb-2">Key Insight</p>
                    <p className="text-purple-200 text-sm">
                      Sustained connection isn't about being interesting—it's about being INTERESTED and REMEMBERING.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={completeStep}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl inline-flex items-center gap-2"
              >
                Continue to Curiosity Method
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Step 5: Curiosity Method
  const renderStep5 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-4">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-200">The Flow State</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Curiosity-Driven Conversations
        </h1>
        <p className="text-lg text-purple-200">The 3-Layer Method to go deep naturally</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Interactive Conversation Tree</h3>
        
        <div className="space-y-6">
          <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
            <p className="text-purple-100 font-medium mb-4">They say: "Been stressed lately"</p>
          </div>

          <div className="space-y-4">
            <div className={`p-6 rounded-2xl border-2 transition-all ${
              currentLayer >= 1 
                ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50' 
                : 'bg-purple-950/30 border-purple-700/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 font-bold">1</span>
                </div>
                <h4 className="font-bold text-white">SURFACE CURIOSITY</h4>
                {currentLayer >= 1 && <CheckCircle className="w-6 h-6 text-green-400 ml-auto" />}
              </div>
              <p className="text-purple-200 text-sm mb-2">Ask about context and facts</p>
              <div className="p-3 bg-purple-900/30 rounded-xl">
                <p className="text-purple-100 text-sm">"What's been stressing you out?"</p>
              </div>
              {currentLayer >= 1 && (
                <div className="mt-3 p-3 bg-green-950/30 rounded-xl border border-green-700/30">
                  <p className="text-green-200 text-sm">They respond: "Work project deadline"</p>
                </div>
              )}
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all ${
              currentLayer >= 2 
                ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/50' 
                : 'bg-purple-950/30 border-purple-700/30 opacity-50'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <h4 className="font-bold text-white">DEEPER CURIOSITY</h4>
                {currentLayer >= 2 && <CheckCircle className="w-6 h-6 text-blue-400 ml-auto" />}
              </div>
              <p className="text-purple-200 text-sm mb-2">Ask about emotion and meaning</p>
              <div className="p-3 bg-purple-900/30 rounded-xl">
                <p className="text-purple-100 text-sm">"What makes this one harder than others?"</p>
              </div>
              {currentLayer >= 2 && (
                <div className="mt-3 p-3 bg-blue-950/30 rounded-xl border border-blue-700/30">
                  <p className="text-blue-200 text-sm">They respond: "First time leading a team and worried I'll fail"</p>
                </div>
              )}
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all ${
              currentLayer >= 3 
                ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/50' 
                : 'bg-purple-950/30 border-purple-700/30 opacity-50'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <h4 className="font-bold text-white">CORE CURIOSITY</h4>
                {currentLayer >= 3 && <CheckCircle className="w-6 h-6 text-purple-400 ml-auto" />}
              </div>
              <p className="text-purple-200 text-sm mb-2">Ask about values and identity</p>
              <div className="p-3 bg-purple-900/30 rounded-xl">
                <p className="text-purple-100 text-sm">"What would 'failing' look like to you?"</p>
              </div>
              {currentLayer >= 3 && (
                <div className="mt-3 p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                  <p className="text-purple-200 text-sm">Real connection achieved! They open up about their values and fears.</p>
                  <div className="flex items-center gap-2 mt-3 text-green-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">8 minutes elapsed ✅</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentLayer < 3 && (
            <button
              onClick={() => setCurrentLayer(currentLayer + 1)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Progress to Layer {currentLayer + 1}
              <ArrowRight className="w-6 h-6" />
            </button>
          )}

          {currentLayer === 3 && (
            <>
              <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl border-2 border-yellow-500/30">
                <div className="flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white mb-2">Framework Mastered!</p>
                    <p className="text-yellow-200 text-sm mb-3">You now understand how to naturally deepen any conversation in 3 progressive layers.</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-yellow-950/30 rounded-lg text-center">
                        <p className="text-yellow-300">SURFACE</p>
                        <p className="text-yellow-100 font-bold">Facts</p>
                        <p className="text-yellow-400">~3min</p>
                      </div>
                      <div className="p-2 bg-yellow-950/30 rounded-lg text-center">
                        <p className="text-yellow-300">MEANING</p>
                        <p className="text-yellow-100 font-bold">Feelings</p>
                        <p className="text-yellow-400">~5min</p>
                      </div>
                      <div className="p-2 bg-yellow-950/30 rounded-lg text-center">
                        <p className="text-yellow-300">IDENTITY</p>
                        <p className="text-yellow-100 font-bold">Values</p>
                        <p className="text-yellow-400">~7-10min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={completeStep}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Continue to Active Listening
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Step 6: Active Listening
  const renderStep6 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30 mb-4">
          <Ear className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium text-green-200">The Toolkit</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Active Listening Mastery
        </h1>
        <p className="text-lg text-purple-200">Keep them talking without talking</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Your Listening Toolkit</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl border-2 border-green-500/30">
            <div className="text-3xl mb-3">😊</div>
            <h4 className="font-bold text-white mb-2">Nod</h4>
            <p className="text-green-200 text-sm">Shows you're following along</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl border-2 border-blue-500/30">
            <div className="text-3xl mb-3">😮</div>
            <h4 className="font-bold text-white mb-2">React</h4>
            <p className="text-blue-200 text-sm">Validates their emotion</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border-2 border-purple-500/30">
            <div className="text-3xl mb-3">🤔</div>
            <h4 className="font-bold text-white mb-2">Lean In</h4>
            <p className="text-purple-200 text-sm">Shows deep engagement</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl border-2 border-orange-500/30">
            <div className="text-3xl mb-3">💭</div>
            <h4 className="font-bold text-white mb-2">Brief Reflection</h4>
            <p className="text-orange-200 text-sm">"That's huge" / "Wow"</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-2xl border-2 border-yellow-500/30 md:col-span-2">
            <div className="text-3xl mb-3">⏸️</div>
            <h4 className="font-bold text-white mb-2">Pause</h4>
            <p className="text-yellow-200 text-sm">Let silence breathe - don't rush to fill it</p>
          </div>
        </div>

        {listeningPhase === 'intro' && (
          <>
            <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30 mb-6">
              <p className="text-purple-200 mb-4">
                <strong className="text-white">Practice Scenario:</strong> Someone is telling you about a difficult situation at work.
              </p>
              <p className="text-purple-100 italic">
                "...and then my manager just dismissed my idea in front of everyone. I felt so small, like my contributions don't matter."
              </p>
            </div>

            <p className="text-purple-200 mb-4">Which listening cue would you use right now?</p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  showNotification('✅ Perfect timing! Validates their emotion');
                  setListeningScore(listeningScore + 1);
                  setListeningPhase('continue');
                }}
                className="w-full p-5 bg-green-900/30 rounded-2xl border-2 border-green-500/30 text-left hover:border-green-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">😮</div>
                  <div>
                    <p className="text-white font-bold">React</p>
                    <p className="text-green-200 text-sm">Show empathy for how they felt</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => showNotification('❌ Too quick - let them finish first')}
                className="w-full p-5 bg-red-900/30 rounded-2xl border-2 border-red-500/30 text-left hover:border-red-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💭</div>
                  <div>
                    <p className="text-white font-bold">Ask Immediately</p>
                    <p className="text-red-200 text-sm">"What did you do next?"</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {listeningPhase === 'continue' && (
          <>
            <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30 mb-6">
              <p className="text-purple-100 italic mb-4">
                [They continue] "I've been working here for two years and sometimes I wonder if I'm even valued..."
              </p>
              <p className="text-purple-200">Now what?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  showNotification('✅ Excellent! Brief reflection shows understanding');
                  setListeningScore(listeningScore + 1);
                  setListeningPhase('complete');
                }}
                className="w-full p-5 bg-green-900/30 rounded-2xl border-2 border-green-500/30 text-left hover:border-green-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💭</div>
                  <div>
                    <p className="text-white font-bold">Brief Reflection</p>
                    <p className="text-green-200 text-sm">"That sounds really tough"</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => showNotification('⚠️ Redirecting too soon - stay with their story')}
                className="w-full p-5 bg-orange-900/30 rounded-2xl border-2 border-orange-500/30 text-left hover:border-orange-400/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <p className="text-white font-bold">Share Your Story</p>
                    <p className="text-orange-200 text-sm">"I had a manager like that once..."</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {listeningPhase === 'complete' && (
          <div className="text-center py-12">
            <Ear className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Active Listener Unlocked!</h3>
            <div className="max-w-md mx-auto mb-6">
              <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
                <p className="text-purple-300 text-sm mb-2">Listening Score</p>
                <p className="text-5xl font-bold text-white mb-2">{Math.round((listeningScore / 2) * 100)}%</p>
                <p className="text-purple-200 text-sm">Great timing and empathy!</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl border-2 border-green-500/30 mb-6">
              <p className="text-green-200 text-sm mb-2">✅ Achievement Unlocked</p>
              <p className="text-2xl font-bold text-white">"Active Listener"</p>
            </div>

            <button
              onClick={completeStep}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Continue to Real-World Challenge
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Step 7: Real-World Challenge
  const renderStep7 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-400/30 mb-4">
          <Target className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-medium text-orange-200">The Challenge</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          The 7-Minute Challenge
        </h1>
        <p className="text-lg text-purple-200">Apply your skills in the real world</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Your Mission</h3>
        <p className="text-purple-200 mb-8">Have ONE conversation this week that lasts 7+ minutes naturally.</p>

        <div className="space-y-6">
          <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <h4 className="font-bold text-white text-lg">Choose Your Target</h4>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setChallengeSetup({ ...challengeSetup, target: 'coworker' })}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  challengeSetup.target === 'coworker'
                    ? 'bg-purple-600/40 border-2 border-purple-400'
                    : 'bg-purple-900/20 border border-purple-700/30 hover:border-purple-600/50'
                }`}
              >
                <p className="text-white font-medium">💼 Coworker/Classmate</p>
                <p className="text-purple-300 text-sm">Build workplace connections</p>
              </button>
              <button
                onClick={() => setChallengeSetup({ ...challengeSetup, target: 'friend' })}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  challengeSetup.target === 'friend'
                    ? 'bg-purple-600/40 border-2 border-purple-400'
                    : 'bg-purple-900/20 border border-purple-700/30 hover:border-purple-600/50'
                }`}
              >
                <p className="text-white font-medium">👥 Friend You Want to Deepen With</p>
                <p className="text-purple-300 text-sm">Take friendship to next level</p>
              </button>
              <button
                onClick={() => setChallengeSetup({ ...challengeSetup, target: 'new' })}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  challengeSetup.target === 'new'
                    ? 'bg-purple-600/40 border-2 border-purple-400'
                    : 'bg-purple-900/20 border border-purple-700/30 hover:border-purple-600/50'
                }`}
              >
                <p className="text-white font-medium">✨ Someone New</p>
                <p className="text-purple-300 text-sm">Make a fresh connection</p>
              </button>
            </div>
          </div>

          {challengeSetup.target && (
            <>
              <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-white text-lg">Pre-Conversation Prep</h4>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-xl cursor-pointer hover:bg-purple-900/30 transition-all">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <p className="text-white font-medium">Recall 1-2 things about them</p>
                      <p className="text-purple-300 text-sm">What did they mention last time?</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-xl cursor-pointer hover:bg-purple-900/30 transition-all">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <p className="text-white font-medium">Prepare 1 curiosity question</p>
                      <p className="text-purple-300 text-sm">Layer 2+ question ready</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-xl cursor-pointer hover:bg-purple-900/30 transition-all">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <p className="text-white font-medium">Review listening cues</p>
                      <p className="text-purple-300 text-sm">Nod, react, lean in, pause</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-purple-950/30 rounded-2xl border border-purple-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-white text-lg">During Conversation (Checklist)</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
                    <input type="checkbox" />
                    <p className="text-purple-200 text-sm">Used recall to open</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
                    <input type="checkbox" />
                    <p className="text-purple-200 text-sm">Asked Layer 2+ question</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
                    <input type="checkbox" />
                    <p className="text-purple-200 text-sm">Used 3+ listening cues</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
                    <input type="checkbox" />
                    <p className="text-purple-200 text-sm">Let 1 silence breathe</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-xl">
                    <input type="checkbox" />
                    <p className="text-purple-200 text-sm">Lasted 7+ minutes</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => showNotification('📅 Reminder set! We\'ll check in with you')}
                  className="px-6 py-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Set Reminder
                </button>
                <button
                  onClick={completeStep}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  I'm Ready!
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Step 8: Transformation Dashboard
  const renderStep8 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-400/30 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-200">The Proof</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Your Transformation
        </h1>
        <p className="text-lg text-purple-200">Before vs After - See your growth</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Your Connection Capacity</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-red-900/20 rounded-2xl border-2 border-red-500/30">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">BEFORE THIS MODULE</h4>
              <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-red-300 text-sm mb-2">Avg conversation length</p>
                <p className="text-3xl font-bold text-white">{userData.beforeMetrics.avgLength} min</p>
              </div>
              <div>
                <p className="text-red-300 text-sm mb-2">Recall accuracy</p>
                <p className="text-3xl font-bold text-white">{userData.beforeMetrics.recall}%</p>
              </div>
              <div>
                <p className="text-red-300 text-sm mb-2">Curiosity depth</p>
                <p className="text-3xl font-bold text-white">Layer {userData.beforeMetrics.layer}</p>
              </div>
              <div>
                <p className="text-red-300 text-sm mb-2">Connection feeling</p>
                <p className="text-xl font-bold text-white">Surface</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-900/20 rounded-2xl border-2 border-green-500/30">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">AFTER THIS MODULE</h4>
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-green-300 text-sm mb-2">Avg conversation length</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">8.5 min</p>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +165%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-green-300 text-sm mb-2">Recall accuracy</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">85%</p>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +467%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-green-300 text-sm mb-2">Curiosity depth</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">Layer 2-3</p>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +200%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-green-300 text-sm mb-2">Connection feeling</p>
                <p className="text-xl font-bold text-white">Meaningful</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-800/40 to-indigo-800/40 rounded-2xl border-2 border-purple-500/30 mb-8">
          <h4 className="font-bold text-white mb-4 text-lg">Impact Visualization</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 text-sm">Shallow Connections</span>
                <span className="text-red-400 font-bold text-sm">-60%</span>
              </div>
              <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-600 w-[40%]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 text-sm">Deep Connections</span>
                <span className="text-green-400 font-bold text-sm">+250%</span>
              </div>
              <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl border-2 border-yellow-500/40 mb-8 text-center">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-xl text-yellow-100 font-medium mb-2">
            You've unlocked the ability to turn acquaintances into real connections
          </p>
          <p className="text-yellow-200">—in just 7-10 minutes.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-2xl border-2 border-purple-500/30">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              Unlocked Skills
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-purple-200">Strategic Recall</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-purple-200">Layered Curiosity</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-purple-200">Active Listening Mastery</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-purple-200">Sustained Connection</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-800/40 to-blue-800/40 rounded-2xl border-2 border-indigo-500/30">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Unlock className="w-6 h-6 text-indigo-400" />
              Next Modules Unlocked
            </h4>
            <div className="space-y-3">
              <button className="w-full p-3 bg-indigo-900/30 rounded-xl border border-indigo-700/30 hover:border-indigo-600/50 transition-all text-left">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <span className="text-white font-medium">Reading Emotional States</span>
                </div>
              </button>
              <button className="w-full p-3 bg-indigo-900/30 rounded-xl border border-indigo-700/30 hover:border-indigo-600/50 transition-all text-left">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-indigo-400" />
                  <span className="text-white font-medium">Handling Difficult Conversations</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border-2 border-yellow-500/40 mb-6">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div className="text-left">
              <p className="text-yellow-200 text-sm">Achievement Unlocked</p>
              <p className="text-2xl font-bold text-white">Connection Master</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              triggerConfetti();
              showNotification('🎉 Congratulations on completing the module!');
            }}
            className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl inline-flex items-center gap-3"
          >
            <Star className="w-6 h-6" />
            Complete Module
            <Star className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-2xl shadow-2xl border-2 border-purple-400 animate-slide-in">
          <p className="text-white font-medium">{notification}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-purple-300">CONNECTION MASTERY</h2>
            <span className="text-sm text-purple-300">Step {currentStep} of 8</span>
          </div>
          <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
        {currentStep === 7 && renderStep7()}
        {currentStep === 8 && renderStep8()}

       {currentStep > 1 && (
  <div className="mt-4 flex justify-between">
    <button
      onClick={prevStep}
      className="px-3 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg font-medium transition-all flex items-center gap-1"
    >
      <ChevronLeft className="w-4 h-4" />
      Previous
    </button>

    {/* 💥 ADD THIS NAVIGATION BUTTON */}
    {onNext && (
      <div className="mt-0">
        <button
          onClick={onNext}
          className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 rounded-lg font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 text-white"
        >
          <Target className="w-5 h-5" />
          Continue to Next Prep Step
        </button>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  )
};