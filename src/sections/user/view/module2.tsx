import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, ArrowLeft, CheckCircle, 
  Users, Clock, AlertCircle, Target, TrendingUp,
  X, Play, Volume2, VolumeX, Flame, Brain,
  Award, ThumbsUp, Shield, Footprints, Eye,
  UserPlus, MessageSquare, Timer, Sparkles
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';
export default function EnteringInteractionsModule({ lessonContent, onCompleteNavigator }) {
  usePortalDriver();
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [scenarioProgress, setScenarioProgress] = useState({});
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteNavigator();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 'intro', component: IntroStep },
    { id: 'permission_myth', component: PermissionMythStep },
    { id: 'three_second_rule', component: ThreeSecondRuleStep },
    { id: 'context_entries', component: ContextEntriesStep },
    { id: 'group_dynamics', component: GroupDynamicsStep },
    { id: 'practice_scenarios', component: PracticeScenariosStep },
    { id: 'anxiety_fuel', component: AnxietyFuelStep },
    { id: 'challenge', component: ChallengeStep }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="font-semibold">Entering Interactions</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={() => setIsSoundOn(!isSoundOn)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                {isSoundOn ? (
                  <Volume2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-32 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              onNext={handleNext}
              onBack={handleBack}
              userResponses={userResponses}
              setUserResponses={setUserResponses}
              scenarioProgress={scenarioProgress}
              setScenarioProgress={setScenarioProgress}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 0
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-purple-500'
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all -mt-6"
          >
            {currentStep === steps.length - 1 ? 'Done' : ''}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Step Components

function IntroStep() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6">
          <Zap className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        The First Move
      </h1>

      <p className="text-xl text-slate-300 text-center mb-12 max-w-2xl mx-auto">
        You don't have a conversation problem. You have a <span className="text-purple-400 font-bold">starting</span> problem.
      </p>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-center">The Real Barrier</h3>
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          Most people think they're bad at conversations. Wrong. They never get to the conversation because they can't break the inertia of <span className="text-red-400 font-semibold">starting</span>.
        </p>
        <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/30">
          <p className="text-slate-200 text-lg italic">
            "I know what to say... I just can't make myself walk over."
          </p>
          <p className="text-slate-400 mt-2">— Every person ever</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <Footprints className="w-8 h-8" />,
            title: "Break Inertia",
            description: "Turn thinking into action in 3 seconds"
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "No Permission Needed",
            description: "Stop waiting for the 'perfect moment'"
          },
          {
            icon: <Flame className="w-8 h-8" />,
            title: "Use Anxiety",
            description: "Turn nervous energy into momentum"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="text-purple-400 mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-400">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 text-center">What You'll Master</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Starting without overthinking",
            "Approaching strangers naturally",
            "Entering group conversations",
            "Reading 'approachability' signals",
            "Using context as your reason",
            "Turning anxiety into action"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionMythStep() {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      myth: "I need a reason to talk to them",
      reality: "Humans are social. Wanting to connect IS the reason.",
      example: "You don't need to borrow a pen or ask for directions. 'Hey, I'm [name]' is enough.",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      myth: "They'll think I'm weird for approaching",
      reality: "Most people are flattered someone took interest. Social courage is attractive.",
      example: "The regret of not approaching lasts longer than 10 seconds of awkwardness.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      myth: "I'll interrupt or bother them",
      reality: "If they're open to it, you'll know in 5 seconds. If not, you politely exit.",
      example: "Everyone understands social rejection. It's not personal, it's situational.",
      icon: <Eye className="w-6 h-6" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">The Permission Myth</h2>
      
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <p className="text-xl text-slate-300 leading-relaxed mb-6">
          You're waiting for permission that will never come. There's no sign, no invitation, no "right time." 
          <span className="text-purple-400 font-semibold"> You just go.</span>
        </p>
        
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            The Truth
          </h3>
          <p className="text-slate-200 text-lg">
            People aren't thinking about you as much as you think. They're in their own heads, worried about the same things. 
            <strong className="text-purple-400"> Your approach is a gift</strong> — it breaks their boredom and makes them feel interesting.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-center">Stop Waiting For...</h3>
      <div className="space-y-4">
        {scenarios.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedScenario(selectedScenario === index ? null : index)}
            className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border cursor-pointer transition-all ${
              selectedScenario === index
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedScenario === index ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2 flex items-center justify-between">
                  <span>❌ {item.myth}</span>
                  <motion.div
                    animate={{ rotate: selectedScenario === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </h4>
                
                <AnimatePresence>
                  {selectedScenario === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-slate-700 mt-4">
                        <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          ✅ Reality:
                        </p>
                        <p className="text-slate-300 mb-3">{item.reality}</p>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                          <p className="text-slate-300 italic text-sm">{item.example}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ThreeSecondRuleStep() {
  const [countdown, setCountdown] = useState(null);

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">The 3-Second Rule</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        You have <span className="text-purple-400 font-bold">3 seconds</span> between noticing someone and starting the approach. 
        After that, your brain will talk you out of it.
      </p>

      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 mb-8 text-center">
        <Timer className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-4">Try It Now</h3>
        <p className="text-slate-300 mb-6">When the timer hits zero, you GO. No thinking. Just move.</p>
        
        {countdown === null ? (
          <button
            onClick={startCountdown}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all"
          >
            Start Countdown
          </button>
        ) : countdown > 0 ? (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-9xl font-bold text-purple-400"
          >
            {countdown}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold text-green-400"
          >
            GO! 🚀
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
          <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
            <X className="w-6 h-6" />
            What Happens After 3 Seconds
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li>• "What if they're busy?"</li>
            <li>• "I don't know what to say..."</li>
            <li>• "Maybe they want to be alone"</li>
            <li>• "I'll look stupid"</li>
          </ul>
          <p className="mt-4 text-slate-400 italic text-sm">Your brain manufactures excuses to keep you safe (and lonely).</p>
        </div>

        <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
          <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            What Happens In 3 Seconds
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li>• You see someone</li>
            <li>• You think "I should say hi"</li>
            <li>• You IMMEDIATELY move</li>
            <li>• Words figure themselves out</li>
          </ul>
          <p className="mt-4 text-slate-400 italic text-sm">Your body leads, your brain follows. That's the trick.</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-400" />
          Why This Works
        </h3>
        <p className="text-slate-300 text-lg leading-relaxed">
          Overthinking is the enemy. The 3-second rule bypasses your prefrontal cortex (the part that panics) and activates your instincts. 
          <strong className="text-purple-400"> Motion creates emotion</strong> — you feel confident AFTER you move, not before.
        </p>
      </div>
    </div>
  );
}

function ContextEntriesStep() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Context-Based Entries</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Your environment gives you everything you need. <span className="text-purple-400 font-semibold">Use what's around you</span> as your opener.
      </p>

      <div className="grid gap-6 mb-8">
        {[
          {
            location: "Coffee Shop / Cafe",
            context: "Shared space, casual atmosphere",
            openers: [
              "Hey, have you tried their [drink]? I'm trying to decide",
              "Excuse me, is this seat taken?",
              "This place is packed today — must be good, right?"
            ],
            color: "from-amber-600 to-orange-700"
          },
          {
            location: "Gym / Fitness Class",
            context: "Shared activity, common goal",
            openers: [
              "Are you done with this? Mind if I work in?",
              "Hey, I've seen you here before — what's your routine?",
              "First time at this class? I have no idea what I'm doing"
            ],
            color: "from-red-600 to-pink-700"
          },
          {
            location: "Waiting in Line",
            context: "Forced proximity, shared experience",
            openers: [
              "This line is insane, right?",
              "Do you know what this wait is usually like?",
              "I've been eyeing that [item] — is it worth it?"
            ],
            color: "from-blue-600 to-cyan-700"
          },
          {
            location: "Event / Social Gathering",
            context: "Everyone's there to socialize",
            openers: [
              "Hey! How do you know [host/organizer]?",
              "Is this your first time at one of these?",
              "I'm trying to meet new people — I'm [name]"
            ],
            color: "from-purple-600 to-pink-700"
          }
        ].map((scenario, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <div className={`bg-gradient-to-r ${scenario.color} p-6`}>
              <h3 className="text-2xl font-bold text-white mb-2">{scenario.location}</h3>
              <p className="text-white/80">{scenario.context}</p>
            </div>
            
            <div className="p-6">
              <p className="text-slate-400 text-sm mb-4 font-semibold">Example Openers:</p>
              <div className="space-y-3">
                {scenario.openers.map((opener, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-slate-200">"{opener}"</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Target className="w-8 h-8 text-purple-400" />
          The Pattern
        </h3>
        <p className="text-slate-300 text-lg leading-relaxed">
          Notice the pattern? Every opener references the <strong>shared context</strong>. You're not pulling conversation out of thin air — 
          you're commenting on what's already there. This makes it feel natural, not forced.
        </p>
      </div>
    </div>
  );
}

function GroupDynamicsStep() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Entering Group Conversations</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Groups feel scarier, but they're often <span className="text-purple-400 font-semibold">easier</span>. 
        There's less pressure on you individually.
      </p>

      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Reading the Group</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
            <h4 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Open Groups (Approach!)
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>• People facing outward</li>
              <li>• Open body language</li>
              <li>• Scanning the room</li>
              <li>• Laughing/animated</li>
              <li>• At social events</li>
            </ul>
          </div>

          <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
            <h4 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
              <X className="w-6 h-6" />
              Closed Groups (Skip)
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Tight circle, inward facing</li>
              <li>• Serious/intense conversation</li>
              <li>• Avoiding eye contact</li>
              <li>• Whispering</li>
              <li>• Obviously private</li>
            </ul>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-center">The 3-Step Entry</h3>
      
      <div className="space-y-6">
        {[
          {
            step: "1",
            title: "Hover Nearby",
            description: "Position yourself close enough to be noticed, but not intruding. Listen for 10-15 seconds.",
            tip: "This signals you're interested without forcing yourself in."
          },
          {
            step: "2",
            title: "Make Eye Contact & Smile",
            description: "Someone will notice you. When they do, smile or nod. This is your 'permission.'",
            tip: "If no one acknowledges you after 20 seconds, they're closed. Move on."
          },
          {
            step: "3",
            title: "Comment on the Topic",
            description: "Jump in with a relevant comment or question about what they're discussing.",
            tip: "Example: 'Sorry to jump in — I overheard you talking about [topic]. I've been wondering the same thing!'"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-white">{item.step}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-300 mb-3">{item.description}</p>
                <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                  <p className="text-purple-300 text-sm italic">💡 {item.tip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-6 border border-red-500/30">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-red-400">
          <X className="w-6 h-6" />
          Don't Do This
        </h3>
        <ul className="space-y-2 text-slate-300">
          <li>❌ Push your way into the center</li>
          <li>❌ Start talking without acknowledging the current topic</li>
          <li>❌ Interrupt mid-sentence</li>
          <li>❌ Stay if you're clearly not welcome</li>
        </ul>
      </div>
    </div>
  );
}

function PracticeScenariosStep({ scenarioProgress, setScenarioProgress }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenarios = [
    {
      context: "Bookstore / Library",
      situation: "Someone is browsing the same section as you. You've made brief eye contact.",
      stakes: "Low Stakes",
      options: [
        {
          text: "*Look away and pretend to browse*",
          quality: "bad",
          feedback: "You missed an easy opportunity. Low stakes = perfect practice. The worst that happens is... nothing."
        },
        {
          text: "*Wait for them to say something first*",
          quality: "bad",
          feedback: "Passive waiting rarely works. Be the one who makes the first move."
        },
        {
          text: "Hey, have you read anything good lately? I'm looking for recommendations.",
          quality: "best",
          feedback: "Perfect! Context-based, low-pressure, and invites them to share (which people love). You used the 3-second rule."
        }
      ]
    },
    {
      context: "Dog Park",
      situation: "Your dogs are playing together. The other owner is watching and smiling.",
      stakes: "Low Stakes",
      options: [
        {
          text: "They're having fun! What's your dog's name?",
          quality: "best",
          feedback: "Excellent! The dogs give you a natural reason to talk. You capitalized on the shared context immediately."
        },
        {
          text: "*Smile back but stay silent*",
          quality: "bad",
          feedback: "You had the perfect setup and didn't take it. This is as easy as it gets — the dogs did the work for you!"
        },
        {
          text: "Nice dog. Is it friendly?",
          quality: "good",
          feedback: "Decent start, but a bit cautious. The dogs are already playing — you could be warmer and more enthusiastic."
        }
      ]
    },
    {
      context: "Networking Event",
      situation: "You're standing alone. Someone else is also alone nearby, looking at their phone.",
      stakes: "Medium Stakes",
      options: [
        {
          text: "*Stay on your phone and hope someone approaches you*",
          quality: "bad",
          feedback: "You're at a networking event — everyone's there to meet people. This is the time to be bold, not passive."
        },
        {
          text: "Hey! I'm terrible at these things — I'm [name]. What brings you here?",
          quality: "best",
          feedback: "Perfect! Self-deprecating humor + direct introduction + open question. You made it easy for them to respond."
        },
        {
          text: "*Walk over* Do you know where the bathroom is?",
          quality: "bad",
          feedback: "Using a fake reason undermines your confidence. Just introduce yourself — that's literally why you're both there."
        }
      ]
    },
    {
      context: "Grocery Store",
      situation: "Someone is staring at the same product you're looking at.",
      stakes: "Low Stakes",
      options: [
        {
          text: "Have you tried this before? I can't decide if it's worth it.",
          quality: "best",
          feedback: "Great! You asked for help (people love helping) and used the shared context naturally."
        },
        {
          text: "*Grab your item and leave quickly*",
          quality: "bad",
          feedback: "It's just groceries — there's zero risk here. You could've made someone's boring errand a little more interesting."
        },
        {
          text: "Hey, random question — do you live around here?",
          quality: "bad",
          feedback: "Too direct and not contextual. It feels forced. Stick to what's in front of you (the product)."
        }
      ]
    }
  ];

  const handleSelectResponse = (index) => {
    setSelectedResponse(index);
    setShowFeedback(true);
    setScenarioProgress({
      ...scenarioProgress,
      [currentScenario]: index
    });
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedResponse(null);
      setShowFeedback(false);
    }
  };

  const scenario = scenarios[currentScenario];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Practice Scenarios</h2>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <Target className="w-8 h-8 text-purple-400" />
        <p className="text-xl text-slate-300">
          Scenario {currentScenario + 1} of {scenarios.length}
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-purple-400">{scenario.context}</h3>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            scenario.stakes === 'Low Stakes' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {scenario.stakes}
          </span>
        </div>
        <p className="text-slate-200 text-lg">{scenario.situation}</p>
      </div>

      <h4 className="text-xl font-semibold mb-4">What do you do?</h4>

      <div className="space-y-4 mb-8">
        {scenario.options.map((option, index) => {
          const isSelected = selectedResponse === index;
          let borderColor = 'border-slate-700/50';
          let bgColor = 'bg-slate-800/50';

          if (showFeedback && isSelected) {
            if (option.quality === 'best') {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-900/20';
            } else if (option.quality === 'good') {
              borderColor = 'border-yellow-500';
              bgColor = 'bg-yellow-900/20';
            } else {
              borderColor = 'border-red-500';
              bgColor = 'bg-red-900/20';
            }
          }

          return (
            <motion.button
              key={index}
              onClick={() => !showFeedback && handleSelectResponse(index)}
              disabled={showFeedback}
              whileHover={!showFeedback ? { scale: 1.02 } : {}}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${borderColor} ${bgColor} ${
                !showFeedback ? 'hover:border-slate-600 cursor-pointer' : 'cursor-default'
              }`}
            >
              <p className="text-slate-200 text-lg mb-3">{option.text}</p>
              
              {showFeedback && isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 border-t border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    {option.quality === 'best' && (
                      <>
                        <Award className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-green-400 font-semibold mb-2">Excellent!</p>
                          <p className="text-slate-300">{option.feedback}</p>
                        </div>
                      </>
                    )}
                    {option.quality === 'good' && (
                      <>
                        <ThumbsUp className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-yellow-400 font-semibold mb-2">Good Start</p>
                          <p className="text-slate-300">{option.feedback}</p>
                        </div>
                      </>
                    )}
                    {option.quality === 'bad' && (
                      <>
                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-red-400 font-semibold mb-2">Missed Opportunity</p>
                          <p className="text-slate-300">{option.feedback}</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleNextScenario}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all"
          >
            {currentScenario === scenarios.length - 1 ? 'Continue' : 'Next Scenario'}
          </button>
        </motion.div>
      )}
    </div>
  );
}

function AnxietyFuelStep() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Anxiety Is Fuel, Not Fear</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Stop trying to eliminate nervousness. <span className="text-purple-400 font-semibold">Use it.</span>
      </p>

      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center">The Reframe</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
            <h4 className="text-xl font-bold mb-4 text-red-400">Old Story</h4>
            <p className="text-slate-300 italic mb-4">"I'm anxious because I'm scared. Something bad will happen."</p>
            <p className="text-slate-400 text-sm">This makes you freeze.</p>
          </div>

          <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
            <h4 className="text-xl font-bold mb-4 text-green-400">New Story</h4>
            <p className="text-slate-300 italic mb-4">"I'm anxious because my body is preparing me for action. I'm alive."</p>
            <p className="text-slate-400 text-sm">This makes you move.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {[
          {
            symptom: "Racing Heart",
            reframe: "Your body is pumping energy to your muscles. You're ready to perform.",
            icon: <Flame className="w-8 h-8" />
          },
          {
            symptom: "Sweaty Palms",
            reframe: "Your body is cooling itself for action. Athletes feel this before games.",
            icon: <Zap className="w-8 h-8" />
          },
          {
            symptom: "Tight Chest",
            reframe: "You're breathing faster to get more oxygen. Your body is optimizing.",
            icon: <TrendingUp className="w-8 h-8" />
          },
          {
            symptom: "Mind Racing",
            reframe: "Your brain is hyper-alert. This is peak awareness, not panic.",
            icon: <Brain className="w-8 h-8" />
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-xl bg-purple-900/30 text-purple-400 flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-2 text-purple-400">{item.symptom}</h4>
                <p className="text-slate-300 text-lg">{item.reframe}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          The Science
        </h3>
        <p className="text-slate-300 text-lg leading-relaxed">
          Anxiety and excitement are <strong>physiologically identical</strong>. Same heart rate, same adrenaline, same symptoms. 
          The only difference is <span className="text-purple-400 font-semibold">the story you tell yourself</span>. 
          Tell yourself you're excited instead of scared, and your performance improves.
        </p>
      </div>
    </div>
  );
}

function ChallengeStep() {
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6">
          <Award className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <h2 className="text-5xl font-bold text-center mb-6">The Micro-Approach Challenge</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        You don't need to have full conversations yet. Just <span className="text-purple-400 font-bold">approach</span>.
      </p>

      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <h3 className="text-3xl font-bold mb-6 text-center text-purple-400">The 5-Day Plan</h3>
        
        <div className="space-y-6">
          {[
            {
              day: "Day 1",
              goal: "Make eye contact + smile at 3 strangers",
              why: "No words needed. Just break the barrier of ignoring people.",
              difficulty: "Super Easy"
            },
            {
              day: "Day 2",
              goal: "Say 'hey' or 'hello' to 3 people",
              why: "Add one word. That's it. Build the reflex.",
              difficulty: "Easy"
            },
            {
              day: "Day 3",
              goal: "Ask 1 person a contextual question",
              why: "Use your environment. 'Is this seat taken?' counts.",
              difficulty: "Medium"
            },
            {
              day: "Day 4",
              goal: "Start 2 brief interactions (10-30 seconds)",
              why: "You're not trying to make friends. Just initiate and exit.",
              difficulty: "Medium"
            },
            {
              day: "Day 5",
              goal: "Approach someone in a group setting",
              why: "Level up. Use the 3-step entry you learned.",
              difficulty: "Challenge"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">{step.day.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold">{step.goal}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      step.difficulty === 'Super Easy' ? 'bg-blue-500/20 text-blue-400' :
                      step.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      step.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {step.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-2">{step.why}</p>
                  <p className="text-slate-500 text-sm italic">Day {step.day.split(' ')[1]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Eye className="w-8 h-8 text-purple-400" />
          Success Criteria
        </h3>
        
        <div className="space-y-4 text-slate-300">
          <p className="text-lg">
            ✅ <strong>Success = You approached</strong> (regardless of outcome)
          </p>
          <p className="text-lg">
            ❌ <strong>Failure = You saw the opportunity and didn't take it</strong>
          </p>
          <p className="text-slate-400 mt-6 italic">
            The conversation doesn't matter yet. You're training your nervous system to stop freezing. 
            Motion is the goal, not connection.
          </p>
        </div>
      </div>

      {!acceptedChallenge ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <button
            onClick={() => setAcceptedChallenge(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl transition-all shadow-2xl shadow-purple-500/30"
          >
            Start Day 1 Today 🚀
          </button>
          <p className="text-slate-400 mt-4">Just 3 smiles. You can do this.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4 text-green-400">You're Ready!</h3>
          <p className="text-xl text-slate-300 mb-6">
            Go make eye contact with 3 people today. Don't overthink it. See someone, count "3-2-1," and smile.
          </p>
          <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/30">
            <p className="text-lg text-slate-300">
              <strong className="text-purple-400">Remember:</strong> The 3-second rule beats overthinking every time. 
              Your body knows what to do — just move.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}