import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, ArrowRight, ArrowLeft, CheckCircle, 
  Users, Coffee, Smile, TrendingUp, Lightbulb,
  X, Play, Volume2, VolumeX, Target, Zap,
  Award, ThumbsUp, AlertCircle, BookOpen, Brain
} from 'lucide-react';

export default function SmallTalkNavigator12({ lessonContent, onBackToTimeline, onCompleteNavigator}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [scenarioProgress, setScenarioProgress] = useState({});
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = async () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    // Call BOTH completion handlers (one of them will be defined)
    if (onCompleteNavigator) {
      await onCompleteNavigator();
    }
    if (onBackToTimeline) {
      await onBackToTimeline();
    }
  }
};
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      id: 'intro',
      component: IntroStep
    },
    {
      id: 'why_small_talk',
      component: WhySmallTalkStep
    },
    {
      id: 'foundation',
      component: FoundationStep
    },
    {
      id: 'opener_types',
      component: OpenerTypesStep
    },
    {
      id: 'practice_scenarios',
      component: PracticeScenariosStep
    },
    {
      id: 'recovery',
      component: RecoveryStep
    },
    {
      id: 'body_language',
      component: BodyLanguageStep
    },
    {
      id: 'challenge',
      component: ChallengeStep
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">Small Talk Fundamentals</span>
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
                  <Volume2 className="w-5 h-5 text-blue-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
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

      {/* Navigation Buttons */}
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
                    ? 'w-8 bg-blue-500'
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
  onClick={handleNext}
  className="
    flex items-center gap-3
    bg-gradient-to-r from-blue-600 to-cyan-600
    hover:from-blue-700 hover:to-cyan-700
    text-white
    px-8 py-4
    text-lg font-semibold
    rounded-2xl
    transition-all
    -mt-6
  "
>
  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
  <ArrowRight className="w-6 h-6" />
</button>

        </div>
      </div>
    </div>
  );
}

// Step Components

function IntroStep({ onNext }) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 mb-6">
          <MessageCircle className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Master Small Talk
      </h1>

      <p className="text-xl text-slate-300 text-center mb-12 max-w-2xl mx-auto">
        Small talk isn't small at all. It's the gateway to every meaningful connection you'll ever make.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <Users className="w-8 h-8" />,
            title: "Connect Instantly",
            description: "Break the ice with anyone, anywhere"
          },
          {
            icon: <Smile className="w-8 h-8" />,
            title: "Feel Confident",
            description: "Never run out of things to say"
          },
          {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Build Relationships",
            description: "Turn strangers into friends"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="text-blue-400 mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-400">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-500/30">
        <h3 className="text-2xl font-bold mb-4 text-center">What You'll Learn</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Opening conversations naturally",
            "Keeping conversations flowing",
            "Reading social cues",
            "Handling awkward silences",
            "Making people feel comfortable",
            "Transitioning to deeper topics"
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

function WhySmallTalkStep({ onNext }) {
  const [selectedMyth, setSelectedMyth] = useState(null);

  const myths = [
    {
      myth: "Small talk is fake and meaningless",
      truth: "Small talk is the social lubricant that allows deeper conversations to happen. It's how we test compatibility and build trust before opening up.",
      icon: <AlertCircle className="w-6 h-6" />
    },
    {
      myth: "You need to be naturally outgoing",
      truth: "Small talk is a skill, not a personality trait. Introverts often become better at it because they observe more and speak with intention.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      myth: "It's all about being funny or clever",
      truth: "The best small talk is about being genuinely curious. Ask questions, listen actively, and show interest. That's it.",
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Why Small Talk Matters</h2>
      
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <p className="text-xl text-slate-300 leading-relaxed mb-6">
          Every deep friendship, romantic relationship, and professional connection started with small talk. 
          It's not about the weather—it's about <span className="text-blue-400 font-semibold">creating comfort</span> and 
          <span className="text-cyan-400 font-semibold"> establishing rapport</span>.
        </p>
        
        <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            The Real Purpose
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Signal that you're <strong>safe and friendly</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Find <strong>common ground</strong> quickly</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Create <strong>emotional warmth</strong> before going deeper</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Give both people time to <strong>relax and open up</strong></span>
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-center">Common Myths Busted</h3>
      <div className="space-y-4">
        {myths.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedMyth(selectedMyth === index ? null : index)}
            className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border cursor-pointer transition-all ${
              selectedMyth === index
                ? 'border-blue-500 bg-blue-900/20'
                : 'border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedMyth === index ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2 flex items-center justify-between">
                  <span>❌ Myth: {item.myth}</span>
                  <motion.div
                    animate={{ rotate: selectedMyth === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </h4>
                
                <AnimatePresence>
                  {selectedMyth === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-slate-700 mt-4">
                        <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          ✅ Truth:
                        </p>
                        <p className="text-slate-300">{item.truth}</p>
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

function FoundationStep({ onNext }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">The Foundation: F.O.R.D.</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        When you don't know what to talk about, remember <span className="text-blue-400 font-bold">F.O.R.D.</span> - 
        four topics that work anywhere, with anyone.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[
          {
            letter: "F",
            title: "Family",
            examples: [
              "Do you have siblings?",
              "Where did you grow up?",
              "Are you close with your family?"
            ],
            color: "from-blue-600 to-blue-800"
          },
          {
            letter: "O",
            title: "Occupation",
            examples: [
              "What do you do?",
              "How did you get into that?",
              "What's the best part of your work?"
            ],
            color: "from-cyan-600 to-cyan-800"
          },
          {
            letter: "R",
            title: "Recreation",
            examples: [
              "What do you do for fun?",
              "Got any hobbies?",
              "Seen any good shows lately?"
            ],
            color: "from-teal-600 to-teal-800"
          },
          {
            letter: "D",
            title: "Dreams",
            examples: [
              "What's next for you?",
              "Any exciting plans coming up?",
              "Where would you love to travel?"
            ],
            color: "from-blue-700 to-purple-700"
          }
        ].map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <div className={`bg-gradient-to-r ${topic.color} p-6`}>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{topic.letter}</span>
                </div>
                <h3 className="text-3xl font-bold text-white">{topic.title}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-slate-400 text-sm mb-4">Example questions:</p>
              <ul className="space-y-2">
                {topic.examples.map((example, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">"{example}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-yellow-400" />
          Pro Tip
        </h3>
        <p className="text-slate-300 text-lg">
          Don't just ask questions like an interview. Share something about yourself first, 
          then ask them. <span className="text-blue-400 font-semibold">Example:</span> "I just started 
          getting into hiking on weekends—do you have any outdoor hobbies?"
        </p>
      </div>
    </div>
  );
}

function OpenerTypesStep({ onNext }) {
  const [selectedType, setSelectedType] = useState('contextual');

  const openerTypes = {
    contextual: {
      title: "Contextual (Best)",
      description: "Comment on the shared environment",
      examples: [
        "This line is crazy, right?",
        "Have you been to this place before?",
        "What do you think of the event so far?"
      ],
      icon: <Coffee className="w-8 h-8" />,
      color: "text-green-400"
    },
    compliment: {
      title: "Compliment",
      description: "Genuine, specific appreciation",
      examples: [
        "That's a cool jacket—where'd you get it?",
        "Your dog is adorable! What breed?",
        "I love your energy—you seem like fun!"
      ],
      icon: <ThumbsUp className="w-8 h-8" />,
      color: "text-blue-400"
    },
    question: {
      title: "Direct Question",
      description: "Simple and honest",
      examples: [
        "Hey, do you know if there's WiFi here?",
        "Have you tried the coffee here before?",
        "Is this seat taken?"
      ],
      icon: <MessageCircle className="w-8 h-8" />,
      color: "text-purple-400"
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Conversation Openers</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        The best openers are <span className="text-blue-400 font-semibold">natural, relevant, and low-pressure</span>. 
        Here are three types that work every time.
      </p>

      <div className="flex gap-4 mb-8 justify-center flex-wrap">
        {Object.keys(openerTypes).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedType === type
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {openerTypes[type].title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          <div className="flex items-start gap-6 mb-6">
            <div className={`p-4 rounded-xl bg-slate-700/50 ${openerTypes[selectedType].color}`}>
              {openerTypes[selectedType].icon}
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{openerTypes[selectedType].title}</h3>
              <p className="text-slate-400 text-lg">{openerTypes[selectedType].description}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              Examples:
            </h4>
            <div className="space-y-3">
              {openerTypes[selectedType].examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
                >
                  <p className="text-slate-200 text-lg">"{example}"</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-6 border border-red-500/30">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-red-400">
          <X className="w-6 h-6" />
          What NOT to Do
        </h3>
        <ul className="space-y-2 text-slate-300">
          <li>❌ "You come here often?" (cliché)</li>
          <li>❌ "What's your sign?" (cringe)</li>
          <li>❌ Starting with complaints or negativity</li>
          <li>❌ Overly personal questions right away</li>
        </ul>
      </div>
    </div>
  );
}

function PracticeScenariosStep({ onNext, scenarioProgress, setScenarioProgress }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenarios = [
    {
      context: "Coffee Shop Line",
      situation: "You're waiting in line at a busy coffee shop. The person in front of you seems friendly.",
      options: [
        {
          text: "Wow, this line is long! Do you come here often?",
          quality: "good",
          feedback: "Good! You acknowledged the shared experience. You could make it even better by adding energy or a follow-up."
        },
        {
          text: "*Say nothing and check your phone*",
          quality: "bad",
          feedback: "You missed an easy opportunity! Small talk starts with noticing the moment."
        },
        {
          text: "This wait is brutal—what do you usually order here? I'm new and could use a recommendation!",
          quality: "best",
          feedback: "Perfect! You acknowledged the context, asked for help (which people love), and opened the door for conversation naturally."
        }
      ]
    },
    {
      context: "Gym / Workout Space",
      situation: "Someone just finished using equipment you're waiting for. They smile at you.",
      options: [
        {
          text: "*Nod and take the equipment silently*",
          quality: "bad",
          feedback: "Missed opportunity! A simple comment could turn this into a workout buddy."
        },
        {
          text: "Thanks! You were killing it—how long have you been training?",
          quality: "best",
          feedback: "Excellent! You gave a genuine compliment and opened the door to conversation without being pushy."
        },
        {
          text: "Thanks. Nice weather today, huh?",
          quality: "good",
          feedback: "Okay, but not contextual. You're at the gym—talk about fitness! It's more natural."
        }
      ]
    },
    {
      context: "Social Event",
      situation: "You're at a party where you only know the host. Someone is standing alone near the drinks.",
      options: [
        {
          text: "*Walk over* Hey! How do you know [host's name]?",
          quality: "best",
          feedback: "Perfect! You found common ground immediately and made them feel comfortable by approaching first."
        },
        {
          text: "*Smile and stand nearby, hoping they talk first*",
          quality: "bad",
          feedback: "Passive approach rarely works. Be the one who breaks the ice!"
        },
        {
          text: "This party is kind of boring, right?",
          quality: "bad",
          feedback: "Never start with negativity! It kills the vibe immediately."
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
    } else {
      onNext();
    }
  };

  const scenario = scenarios[currentScenario];
  const selectedOption = selectedResponse !== null ? scenario.options[selectedResponse] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Practice Scenarios</h2>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <Target className="w-8 h-8 text-blue-400" />
        <p className="text-xl text-slate-300">
          Scenario {currentScenario + 1} of {scenarios.length}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-400">{scenario.context}</h3>
        <p className="text-slate-200 text-lg">{scenario.situation}</p>
      </div>

      <h4 className="text-xl font-semibold mb-4">How would you respond?</h4>

      <div className="space-y-4 mb-8">
        {scenario.options.map((option, index) => {
          const isSelected = selectedResponse === index;
          let borderColor = 'border-slate-700/50';
          let bgColor = 'bg-slate-800/50';

          if (showFeedback && isSelected) {
            if (option.quality === 'best') {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-900/20';
            }else if (option.quality === 'good') {
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
                          <p className="text-green-400 font-semibold mb-2">Excellent Choice!</p>
                          <p className="text-slate-300">{option.feedback}</p>
                        </div>
                      </>
                    )}
                    {option.quality === 'good' && (
                      <>
                        <ThumbsUp className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-yellow-400 font-semibold mb-2">Good Effort!</p>
                          <p className="text-slate-300">{option.feedback}</p>
                        </div>
                      </>
                    )}
                    {option.quality === 'bad' && (
                      <>
                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-red-400 font-semibold mb-2">Could Be Better</p>
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
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all"
          >
            {currentScenario === scenarios.length - 1 ? 'Continue' : 'Next Scenario'}
          </button>
        </motion.div>
      )}
    </div>
  );
}

function RecoveryStep({ onNext }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Handling Awkward Moments</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Every conversation has awkward moments. The difference between amateurs and pros? 
        <span className="text-blue-400 font-semibold"> Pros know how to recover.</span>
      </p>

      <div className="space-y-6">
        {[
          {
            problem: "Awkward Silence",
            solution: "Acknowledge it with humor",
            example: '"Well, that was a natural pause! So... what got you interested in [topic]?"',
            icon: <MessageCircle className="w-8 h-8" />
          },
          {
            problem: "They Give One-Word Answers",
            solution: "Switch topics or share more yourself",
            example: '"Cool, cool. Hey, totally different question—have you traveled anywhere fun lately?"',
            icon: <ArrowRight className="w-8 h-8" />
          },
          {
            problem: "You Accidentally Say Something Weird",
            solution: "Own it and laugh",
            example: '"Okay that came out wrong, haha! What I meant was..."',
            icon: <Smile className="w-8 h-8" />
          },
          {
            problem: "Running Out of Things to Say",
            solution: "Use the conversation thread technique",
            example: 'Pick ANY word they said and ask about it. "You mentioned hiking—where do you usually go?"',
            icon: <Lightbulb className="w-8 h-8" />
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-xl bg-red-900/30 text-red-400 flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-red-400">
                  Problem: {item.problem}
                </h3>
                <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                  <p className="text-green-400 font-semibold mb-2">Solution: {item.solution}</p>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-slate-300 italic">"{item.example}"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-400" />
          Golden Rule
        </h3>
        <p className="text-slate-300 text-lg leading-relaxed">
          The secret to recovery isn't pretending nothing happened—it's 
          <span className="text-blue-400 font-semibold"> acknowledging it lightly and moving forward</span>. 
          People respect honesty and humor way more than fake smoothness.
        </p>
      </div>
    </div>
  );
}

function BodyLanguageStep({ onNext }) {
  const [activeTab, setActiveTab] = useState('do');

  const bodyLanguageTips = {
    do: [
      {
        title: "Smile Genuinely",
        description: "A real smile engages your eyes. It signals warmth and approachability.",
        icon: <Smile className="w-6 h-6" />
      },
      {
        title: "Maintain Eye Contact",
        description: "Look at them while they talk, glance away occasionally. Shows you're engaged.",
        icon: <Target className="w-6 h-6" />
      },
      {
        title: "Face Them Directly",
        description: "Turn your body toward them. It shows you're giving them your full attention.",
        icon: <Users className="w-6 h-6" />
      },
      {
        title: "Use Open Gestures",
        description: "Keep arms uncrossed, hands visible. Open posture = open to conversation.",
        icon: <ThumbsUp className="w-6 h-6" />
      },
      {
        title: "Mirror Their Energy",
        description: "Match their tone and pace. If they're relaxed, be relaxed. If excited, match it.",
        icon: <TrendingUp className="w-6 h-6" />
      }
    ],
    dont: [
      {
        title: "Cross Your Arms",
        description: "Creates a barrier. Makes you seem closed off or defensive.",
        icon: <X className="w-6 h-6" />
      },
      {
        title: "Check Your Phone",
        description: "Instant conversation killer. Shows they're not worth your attention.",
        icon: <X className="w-6 h-6" />
      },
      {
        title: "Look Around Constantly",
        description: "Makes them feel like you're looking for someone better to talk to.",
        icon: <X className="w-6 h-6" />
      },
      {
        title: "Stand Too Close/Too Far",
        description: "Respect personal space. Arm's length is usually comfortable.",
        icon: <X className="w-6 h-6" />
      },
      {
        title: "Force Fake Enthusiasm",
        description: "Be authentic. Forced energy is uncomfortable for everyone.",
        icon: <X className="w-6 h-6" />
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Body Language Matters</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        What you say is important, but <span className="text-blue-400 font-semibold">how you say it</span> matters even more. 
        Your body language can make or break a conversation.
      </p>

      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setActiveTab('do')}
          className={`px-8 py-4 rounded-xl font-medium text-lg transition-all ${
            activeTab === 'do'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          ✅ Do This
        </button>
        <button
          onClick={() => setActiveTab('dont')}
          className={`px-8 py-4 rounded-xl font-medium text-lg transition-all ${
            activeTab === 'dont'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          ❌ Avoid This
        </button>
      </div>

      <div className="space-y-4">
        {bodyLanguageTips[activeTab].map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-xl p-6 border ${
              activeTab === 'do'
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-red-900/20 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg flex-shrink-0 ${
                activeTab === 'do'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {tip.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                <p className="text-slate-300">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-400" />
          Remember
        </h3>
        <p className="text-slate-300 text-lg leading-relaxed">
          Body language isn't about perfection—it's about <span className="text-blue-400 font-semibold">being present</span>. 
          If you're genuinely interested in the person and the conversation, your body language will naturally reflect that.
        </p>
      </div>
    </div>
  );
}

function ChallengeStep({ onNext }) {
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 mb-6">
          <Award className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <h2 className="text-5xl font-bold text-center mb-6">Your Challenge</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Knowledge without action is just entertainment. Let's make this real.
      </p>

      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30 mb-8">
        <h3 className="text-3xl font-bold mb-6 text-center text-blue-400">The 3-Conversation Challenge</h3>
        
        <div className="space-y-6">
          {[
            {
              number: "1",
              title: "Start 1 conversation today",
              description: "Coffee shop, elevator, gym—anywhere. Use what you learned.",
              difficulty: "Easy"
            },
            {
              number: "2",
              title: "Start 2 conversations tomorrow",
              description: "Build momentum. Notice how much easier the second one feels.",
              difficulty: "Medium"
            },
            {
              number: "3",
              title: "Start 3 conversations this week",
              description: "By the third day, it'll feel natural. You're building a skill.",
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold">{step.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      step.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      step.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {step.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          Quick Reference Guide
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-blue-400">Remember F.O.R.D.</h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Family</li>
              <li>• Occupation</li>
              <li>• Recreation</li>
              <li>• Dreams</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3 text-cyan-400">Best Openers</h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Contextual comments</li>
              <li>• Genuine compliments</li>
              <li>• Simple questions</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <h4 className="text-lg font-semibold mb-3 text-green-400">When It Gets Awkward</h4>
          <p className="text-slate-300">
            Acknowledge it with humor, switch topics, or use the thread technique. 
            The pro move is being comfortable with imperfection.
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
      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl transition-all shadow-2xl shadow-yellow-500/30"
    >
      I Accept the Challenge! 🚀
    </button>
  </motion.div>
) : (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30 text-center"
  >
    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
    <h3 className="text-3xl font-bold mb-4 text-green-400">Challenge Accepted!</h3>
    <p className="text-xl text-slate-300 mb-6">
      You're ready. Go start a conversation today. It doesn't have to be perfect—it just has to happen.
    </p>
    <p className="text-lg text-slate-400 mb-6">
      Remember: Every person you admire who's great at conversation was once exactly where you are now. 
      The difference? <span className="text-blue-400 font-semibold">They started.</span>
    </p>
    <button
      onClick={onNext}
      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
    >
      Complete Module ✨
    </button>
  </motion.div>
)}

    </div>
  );
}