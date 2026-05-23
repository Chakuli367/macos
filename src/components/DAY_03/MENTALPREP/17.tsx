import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Target, Award, CheckCircle, Zap, Heart, 
  ArrowRight, Play, TrendingUp, Brain, Mic, Volume2,
  ChevronRight, Clock, Flame, MessageCircle, Send,
  RotateCcw, Star, Trophy, Smile, Meh, Frown, Battery,
  Eye, Users, Coffee, Briefcase, Home, PartyPopper
} from 'lucide-react';

// 💥 ADD THIS INTERFACE
interface REVIEWCONVProps {
    onNext?: () => void;
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const MOOD_OPTIONS = [
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-red-500 to-orange-500' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-gray-500 to-gray-600' },
  { id: 'excited', emoji: '😊', label: 'Excited', color: 'from-green-500 to-emerald-500' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'from-blue-500 to-indigo-500' },
];

const CONTEXTS = [
  { id: 'party', label: 'Party', icon: <PartyPopper className="w-5 h-5" /> },
  { id: 'networking', label: 'Networking Event', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'coffee', label: 'Coffee Shop', icon: <Coffee className="w-5 h-5" /> },
  { id: 'casual', label: 'Casual Hangout', icon: <Users className="w-5 h-5" /> },
];

const OPENERS = {
  party: [
    "How do you know the host?",
    "This party is awesome! Are you having fun?",
    "Great music tonight, right?"
  ],
  networking: [
    "What brings you to this event?",
    "What do you do?",
    "How's your experience been so far?"
  ],
  coffee: [
    "Do you come here often?",
    "That looks good! What did you order?",
    "Great atmosphere here, right?"
  ],
  casual: [
    "What have you been up to lately?",
    "How's your week going?",
    "Any fun plans coming up?"
  ]
};

const MISSIONS = [
  { id: 'm1', text: 'Start 3 conversations', xp: 100, icon: '💬' },
  { id: 'm2', text: 'Ask 5 follow-up questions', xp: 100, icon: '❓' },
  { id: 'm3', text: 'Exchange contact with someone new', xp: 150, icon: '📱' },
  { id: 'm4', text: 'Hold eye contact for 3+ seconds', xp: 75, icon: '👁️' },
  { id: 'm5', text: 'Share a personal story', xp: 125, icon: '📖' },
];

const REFRAMES = [
  {
    worry: "What if I say something stupid?",
    reframe: "Every conversation is practice. Nobody remembers one awkward line. They remember how you made them feel."
  },
  {
    worry: "What if they don't like me?",
    reframe: "You can't be everyone's cup of tea, and that's perfectly fine. Focus on being genuine, not universally liked."
  },
  {
    worry: "What if there's an awkward silence?",
    reframe: "Silences are natural! Use them to think of follow-up questions. Most people find brief pauses comfortable."
  },
  {
    worry: "I'm not interesting enough",
    reframe: "Everyone has unique experiences and perspectives. Curiosity about others makes you interesting, not just your stories."
  }
];

const AI_COACH_RESPONSES = {
  anxious: [
    "I hear you. That nervous energy you're feeling? It's actually your body preparing to perform. Let's channel it into excitement.",
    "Take a deep breath with me. In for 4... hold for 4... out for 6. Your brain literally can't be anxious and breathing deeply at the same time.",
    "Here's the truth: Everyone at that event is thinking about themselves, not judging you. You're free to be yourself.",
    "What if I told you that 73% of people feel the exact same way you do before social events? You're not alone in this."
  ],
  worried: [
    "Let me reframe that worry for you: Every 'what if' you're thinking can also go amazingly well. Focus on positive possibilities.",
    "That thought pattern? It's just your brain trying to protect you. Thank it, then gently remind it you've got this.",
    "I've helped thousands through this exact feeling. Want to know the secret? Everyone's too worried about themselves to judge you.",
    "Your worry shows you care. That's a strength. Now let's turn that care into curiosity about others."
  ],
  general: [
    "You're doing the work right now - preparing mindfully. That already puts you ahead of 90% of people.",
    "Remember: The goal isn't to be perfect. It's to be present and genuine.",
    "I believe in you. You've had good conversations before. You'll have them again today.",
    "One conversation at a time. One person at a time. You don't have to conquer the whole room."
  ]
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MENTALPREP({ onNext }: REVIEWCONVProps) {
  const [phase, setPhase] = useState(1);
  const [mood, setMood] = useState('');
  const [context, setContext] = useState('');
  const [selectedMission, setSelectedMission] = useState('');
  const [powerPoseTimer, setPowerPoseTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [completedPhases, setCompletedPhases] = useState([]);
  const [xp, setXp] = useState(0);
  const [recording, setRecording] = useState(false);
  const [selectedOpener, setSelectedOpener] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [visualizationStep, setVisualizationStep] = useState(0);
  
  // AI Chat states
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Power Pose Timer
  useEffect(() => {
    if (timerActive && powerPoseTimer > 0) {
      const interval = setInterval(() => {
        setPowerPoseTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (powerPoseTimer === 0 && timerActive) {
      setTimerActive(false);
      setXp(xp + 25);
      completePhase(2);
    }
  }, [timerActive, powerPoseTimer]);

  // Visualization auto-advance
  useEffect(() => {
    if (phase === 3 && visualizationStep < 5) {
      const timer = setTimeout(() => {
        setVisualizationStep(visualizationStep + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, visualizationStep]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Initialize AI chat with greeting
  useEffect(() => {
    if (phase === 6 && chatMessages.length === 0) {
      setTimeout(() => {
        setChatMessages([{
          sender: 'ai',
          text: "Hey! I'm your confidence coach. I can feel you might be nervous about the upcoming interaction. Want to talk about what's on your mind? 💙",
          timestamp: Date.now()
        }]);
      }, 500);
    }
  }, [phase]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const completePhase = (phaseNum) => {
    if (!completedPhases.includes(phaseNum)) {
      setCompletedPhases([...completedPhases, phaseNum]);
    }
  };

  const nextPhase = () => {
    completePhase(phase);
    setPhase(phase + 1);
  };

  const startPowerPose = () => {
    setTimerActive(true);
    setPowerPoseTimer(30);
  };

  const handleMoodSelect = (moodId) => {
    setMood(moodId);
    completePhase(1);
  };

  const handleContextSelect = (contextId) => {
    setContext(contextId);
  };

  const handleMissionSelect = (missionId) => {
    setSelectedMission(missionId);
    const mission = MISSIONS.find(m => m.id === missionId);
    if (mission) {
      completePhase(5);
    }
  };

  const simulateRecording = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setXp(xp + 15);
    }, 3000);
  };

  const handleShake = () => {
    setShakeCount(shakeCount + 1);
    if (shakeCount >= 4) {
      completePhase(7);
      setXp(xp + 50);
    }
  };

  const nextOpener = () => {
    if (context && OPENERS[context]) {
      setSelectedOpener((selectedOpener + 1) % OPENERS[context].length);
    }
  };

  // AI Chat Handler
  const sendMessage = () => {
    if (!userInput.trim()) return;

    const newUserMessage = {
      sender: 'user',
      text: userInput,
      timestamp: Date.now()
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setUserInput('');
    setAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      const lowerInput = userInput.toLowerCase();
      
      if (lowerInput.includes('nervous') || lowerInput.includes('anxious') || lowerInput.includes('scared')) {
        aiResponse = AI_COACH_RESPONSES.anxious[Math.floor(Math.random() * AI_COACH_RESPONSES.anxious.length)];
      } else if (lowerInput.includes('what if') || lowerInput.includes('worry') || lowerInput.includes('afraid')) {
        aiResponse = AI_COACH_RESPONSES.worried[Math.floor(Math.random() * AI_COACH_RESPONSES.worried.length)];
      } else {
        aiResponse = AI_COACH_RESPONSES.general[Math.floor(Math.random() * AI_COACH_RESPONSES.general.length)];
      }

      const aiMessage = {
        sender: 'ai',
        text: aiResponse,
        timestamp: Date.now()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setAiTyping(false);
    }, 1500);
  };

  // ============================================================================
  // PHASE RENDERERS
  // ============================================================================

  const renderPhase1 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Brain className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 1: Check Your State</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          How Are You Feeling?
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Your warmup will adapt to your current mood
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleMoodSelect(option.id)}
            className={`p-6 md:p-8 rounded-3xl border-2 transition-all text-center ${
              mood === option.id
                ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 scale-105'
                : 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30 hover:border-purple-400/50'
            }`}
          >
            <div className="text-5xl md:text-6xl mb-4">{option.emoji}</div>
            <p className="text-lg md:text-xl font-bold text-white">{option.label}</p>
          </button>
        ))}
      </div>

      {mood && (
        <button
          onClick={nextPhase}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const renderPhase2 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-800/40 backdrop-blur-sm rounded-full border border-orange-500/30">
          <Zap className="w-5 h-5 text-orange-300" />
          <span className="text-sm font-medium text-orange-200">Step 2: Power Pose</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
          Strike Your Power Pose
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          2 minutes of power posing increases confidence by 20%
        </p>
      </div>

      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-orange-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(251, 146, 60, 0.2)" strokeWidth="8"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#fb923c" 
                strokeWidth="8"
                strokeDasharray={`${(1 - powerPoseTimer / 30) * 283} 283`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
              <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-3xl md:text-4xl font-bold fill-white">
                {powerPoseTimer}
              </text>
            </svg>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <p className="text-white text-base md:text-lg">Stand tall, shoulders back</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <p className="text-white text-base md:text-lg">Hands on hips or arms raised</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <p className="text-white text-base md:text-lg">Take up space confidently</p>
            </div>
          </div>

          {!timerActive ? (
            <button
              onClick={startPowerPose}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-red-500 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start 30-Second Pose
            </button>
          ) : (
            <div className="text-center">
              <p className="text-xl text-orange-200 font-medium animate-pulse">Hold your pose...</p>
            </div>
          )}
        </div>

        {powerPoseTimer === 0 && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <p className="text-2xl font-bold text-white">Amazing! +25 XP</p>
            <button
              onClick={nextPhase}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPhase3 = () => {
    const visualizationSteps = [
      "Close your eyes and take a deep breath...",
      `You walk into ${context ? CONTEXTS.find(c => c.id === context)?.label.toLowerCase() : 'the event'}...`,
      "You see someone interesting nearby...",
      "You smile... they smile back...",
      "You approach with confidence...",
      "You start a great conversation!"
    ];

    return (
      <div className="space-y-6 md:space-y-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-800/40 backdrop-blur-sm rounded-full border border-blue-500/30">
            <Eye className="w-5 h-5 text-blue-300" />
            <span className="text-sm font-medium text-blue-200">Step 3: Visualization</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            Picture Success
          </h1>
          <p className="text-base md:text-lg text-purple-200">
            Mental rehearsal activates the same brain regions as real experience
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-blue-500/30 shadow-2xl min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl md:text-7xl mb-8 animate-pulse">🎬</div>
            <p className="text-2xl md:text-3xl font-bold text-white mb-6 min-h-[80px]">
              {visualizationSteps[visualizationStep] || visualizationSteps[0]}
            </p>
            
            <div className="flex justify-center gap-2 mb-8">
              {visualizationSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx <= visualizationStep ? 'bg-blue-400' : 'bg-blue-900'
                  }`}
                />
              ))}
            </div>

            {visualizationStep >= 5 && (
              <button
                onClick={() => {
                  completePhase(3);
                  nextPhase();
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto"
              >
                I Feel Ready
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPhase4 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-800/40 backdrop-blur-sm rounded-full border border-green-500/30">
          <MessageCircle className="w-5 h-5 text-green-300" />
          <span className="text-sm font-medium text-green-200">Step 4: Opener Arsenal</span>
        </div>
       <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
    Practice Your Openers
</h1>
        <p className="text-base md:text-lg text-purple-200">
          Say it out loud to build muscle memory
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <label className="text-white font-bold mb-4 block text-lg">Choose your context:</label>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {CONTEXTS.map((ctx) => (
              <button
    key={ctx.id}
    onClick={() => handleContextSelect(ctx.id)}
    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
        context === ctx.id
            ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400'
            : 'bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50'
    }`}
>
    {/* 💡 ICON SIZE INCREASED TO w-10 h-10 (40px) */}
    <div className="w-10 h-10 flex items-center justify-center">
        {ctx.icon}
    </div>
    <span className="text-white text-sm md:text-base font-medium">{ctx.label}</span>
</button>
            ))}
          </div>
        </div>

        {context && (
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                "{OPENERS[context][selectedOpener]}"
              </h3>
              
              <div className="flex gap-3 justify-center mb-6">
                <button
                  onClick={simulateRecording}
                  disabled={recording}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center gap-3 ${
                    recording
                      ? 'bg-red-600 animate-pulse'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                  }`}
                >
                  {recording ? (
                    <>
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      Say It Out Loud
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={nextOpener}
                className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mx-auto text-sm md:text-base"
              >
                <RotateCcw className="w-4 h-4" />
                Try Another Opener
              </button>
            </div>

            <div className="p-4 bg-green-500/10 rounded-xl border border-green-400/30 text-center">
              <p className="text-green-100 text-sm md:text-base">
                💡 <strong>Pro Tip:</strong> Tone matters more than words. Smile as you say it!
              </p>
            </div>
          </div>
        )}
      </div>

      {context && (
        <button
          onClick={nextPhase}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const renderPhase5 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-pink-800/40 backdrop-blur-sm rounded-full border border-pink-500/30">
          <RotateCcw className="w-5 h-5 text-pink-300" />
          <span className="text-sm font-medium text-pink-200">Step 5: Anxiety Reframe</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">
          Reframe Your Worries
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Flip anxious thoughts into confident ones
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {REFRAMES.map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <p className="text-sm text-red-400 font-medium mb-2">😰 Anxious Thought:</p>
                <p className="text-lg md:text-xl text-white font-bold mb-4">"{item.worry}"</p>
                
                <div className="flex justify-center my-6">
                  <div className="text-4xl animate-bounce">🔄</div>
                </div>
                
                <p className="text-sm text-green-400 font-medium mb-2">✅ Confident Reframe:</p>
                <p className="text-lg md:text-xl text-white font-bold">"{item.reframe}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={nextPhase}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        Talk to AI Coach
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderPhase6 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-cyan-800/40 backdrop-blur-sm rounded-full border border-cyan-500/30">
          <MessageCircle className="w-5 h-5 text-cyan-300" />
          <span className="text-sm font-medium text-cyan-200">Step 6: AI Confidence Coach</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
          Talk Through Your Anxiety
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Your personal coach is here to help calm your nerves
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-cyan-500/20 border-2 border-cyan-400/30 text-cyan-100'
                }`}
              >
                <p className="text-sm md:text-base">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {aiTyping && (
            <div className="flex justify-start">
              <div className="bg-cyan-500/20 border-2 border-cyan-400/30 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-purple-950/50 border-t-2 border-purple-500/30">
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-sm md:text-base"
            />
            <button
              onClick={sendMessage}
              disabled={!userInput.trim() || aiTyping}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setUserInput("I'm really nervous about this");
                setTimeout(sendMessage, 100);
              }}
              className="px-3 py-2 bg-purple-800/40 hover:bg-purple-700/60 rounded-xl text-xs md:text-sm text-purple-200 border border-purple-500/30 transition-all"
            >
              I'm nervous 😰
            </button>
            <button
              onClick={() => {
                setUserInput("What if I say something stupid?");
                setTimeout(sendMessage, 100);
              }}
              className="px-3 py-2 bg-purple-800/40 hover:bg-purple-700/60 rounded-xl text-xs md:text-sm text-purple-200 border border-purple-500/30 transition-all"
            >
              What if I mess up? 😬
            </button>
            <button
              onClick={() => {
                setUserInput("I don't feel ready");
                setTimeout(sendMessage, 100);
              }}
              className="px-3 py-2 bg-purple-800/40 hover:bg-purple-700/60 rounded-xl text-xs md:text-sm text-purple-200 border border-purple-500/30 transition-all"
            >
              Not ready yet 😔
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={nextPhase}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        I Feel Better - Continue
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderPhase7 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-800/40 backdrop-blur-sm rounded-full border border-amber-500/30">
          <Target className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-medium text-amber-200">Step 7: Mission Briefing</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
          Choose Your Sidequest
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Pick one focused side quest for today
        </p>
      </div>

      <div className="space-y-4">
        {MISSIONS.map((mission) => (
          <button
            key={mission.id}
            onClick={() => handleMissionSelect(mission.id)}
            className={`w-full p-6 md:p-8 rounded-3xl border-2 transition-all text-left ${
              selectedMission === mission.id
                ? 'bg-gradient-to-br from-amber-600/50 to-orange-600/50 border-amber-400 scale-105'
                : 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30 hover:border-purple-400/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{mission.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{mission.text}</h3>
                <div className="flex items-center gap-3 text-purple-300">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">+{mission.xp} XP</span>
                </div>
              </div>
              {selectedMission === mission.id && (
                <CheckCircle className="w-8 h-8 text-green-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedMission && (
        <button
          onClick={nextPhase}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          Lock In Mission
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const renderPhase8 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-red-800/40 backdrop-blur-sm rounded-full border border-red-500/30">
          <Zap className="w-5 h-5 text-red-300" />
          <span className="text-sm font-medium text-red-200">Step 8: Energy Boost</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-red-200 via-orange-200 to-red-300 bg-clip-text text-transparent">
          Release the Nerves!
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Shake your phone to release nervous energy
        </p>
      </div>

      <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-red-500/30 shadow-2xl">
        <div className="text-center">
          <div className="text-8xl md:text-9xl mb-8 animate-bounce">
            📱
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Shake Count: {shakeCount}/5
          </h2>
          
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full ${
                  idx < shakeCount ? 'bg-orange-400' : 'bg-orange-900'
                }`}
              />
            ))}
          </div>

          {shakeCount < 5 ? (
            <button
              onClick={handleShake}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-bold text-xl hover:from-orange-500 hover:to-red-500 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              <Zap className="w-6 h-6" />
              Shake It Out!
            </button>
          ) : (
            <div className="space-y-6">
              <div className="text-6xl">🎉</div>
              <h3 className="text-3xl font-bold text-white">YOU'RE READY! 💪</h3>
              <div className="space-y-3 max-w-md mx-auto text-left p-6 bg-purple-950/40 rounded-2xl border-2 border-purple-500/30">
                <p className="text-white text-lg">Remember:</p>
                <div className="space-y-2 text-purple-200">
                  <p>✅ Everyone's a little nervous</p>
                  <p>✅ You've practiced your openers</p>
                  <p>✅ One conversation at a time</p>
                  <p>✅ You've got this! 🔥</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {shakeCount >= 5 && (
        <button
          onClick={nextPhase}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-xl flex items-center justify-center gap-2 animate-pulse"
        >
          ENTER THE ZONE 🚀
        </button>
      )}
    </div>
  );

  const renderPhase9 = () => {
    const selectedMissionObj = MISSIONS.find(m => m.id === selectedMission);
    
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="text-center mb-8">
          <div className="text-6xl md:text-8xl mb-6">🏆</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
            You're All Set!
          </h1>
          <p className="text-lg md:text-xl text-purple-200">
            Warmup Complete - Time to shine! ✨
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Your Quick Reference Card</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-purple-950/40 rounded-2xl border-2 border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3">📋 Your Side Quest Today:</h3>
              <p className="text-xl md:text-2xl font-bold text-white">{selectedMissionObj?.icon} {selectedMissionObj?.text}</p>
            </div>

            {context && (
              <div className="p-6 bg-purple-950/40 rounded-2xl border-2 border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-3">🗣️ Your Go-To Openers:</h3>
                <div className="space-y-2">
                  {OPENERS[context].map((opener, idx) => (
                    <p key={idx} className="text-white text-base md:text-lg">• "{opener}"</p>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-purple-950/40 rounded-2xl border-2 border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3">💡 If You Get Stuck:</h3>
              <div className="space-y-2 text-white">
                <p>→ "Tell me more about that"</p>
                <p>→ "How did you get into that?"</p>
                <p>→ "What's been the highlight?"</p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border-2 border-green-400/50 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                
                <div>
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{completedPhases.length}</p>
                  <p className="text-sm text-purple-300">Steps Done</p>
                </div>
                <div>
                  <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-purple-300">Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md p-6 rounded-2xl border-2 border-amber-400/50 text-center">
          <p className="text-lg md:text-xl font-bold text-white mb-2">
            💪 You've completed your warmup ritual!
          </p>
          <p className="text-purple-200 text-sm md:text-base">
            Come back and do this before every social event to build confidence over time.
          </p>
        </div>

        {/*<button
          onClick={() => {
            setPhase(1);
            setCompletedPhases([]);
            setMood('');
            setContext('');
            setSelectedMission('');
            setPowerPoseTimer(30);
            setShakeCount(0);
            setSelectedOpener(0);
            setVisualizationStep(0);
            setChatMessages([]);
          }}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Start New Warmup
        </button>*/}

        {/* 💥 ADD THIS NAVIGATION BUTTON */}
        {onNext && (
    <div className="mt-12">
        <button
            onClick={onNext}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 text-white"
        >
            <Target className="w-6 h-6" />
            Continue to Next Prep Step
        </button>
    </div>
)}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const totalPhases = 9;
  const progress = (phase / totalPhases) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Header */}
        {phase < 9 && (
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <span className="text-sm md:text-base text-purple-300 font-medium">Social Confidence Warmup</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-800/40 rounded-full border border-purple-500/30">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm md:text-base font-bold text-white">{xp} XP</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm md:text-base text-purple-300 font-medium">Progress</span>
              <span className="text-sm md:text-base text-purple-300 font-medium">Step {phase} of {totalPhases - 1}</span>
            </div>
            <div className="h-3 md:h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Phase Content */}
        {phase === 1 && renderPhase1()}
        {phase === 2 && renderPhase2()}
        {phase === 3 && renderPhase3()}
        {phase === 4 && renderPhase4()}
        {phase === 5 && renderPhase5()}
        {phase === 6 && renderPhase6()}
        {phase === 7 && renderPhase7()}
        {phase === 8 && renderPhase8()}
        {phase === 9 && renderPhase9()}
      </div>

      <style>{`
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

        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        button, a, input, select, textarea {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        button {
          -webkit-user-select: none;
          user-select: none;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
  
}