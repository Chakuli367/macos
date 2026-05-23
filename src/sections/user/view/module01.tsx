import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, ArrowRight, ArrowLeft, CheckCircle, 
  Users, Coffee, Smile, TrendingUp, Lightbulb,
  X, Play, Volume2, VolumeX, Target, Zap,
  Award, ThumbsUp, AlertCircle, BookOpen, Brain,
  Sparkles, Send, Loader, RefreshCw, Star
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';
// ============================================================================
// CONFIGURATION - UPDATE WITH YOUR BACKEND URL
// ============================================================================
const API_BASE_URL = 'http://localhost:8000/api/small-talk'; // Change this to your backend

// ============================================================================
// MAIN NAVIGATOR COMPONENT
// ============================================================================
export default function SmallTalkNavigator({ lessonContent, onCompleteNavigator }) {
  usePortalDriver();
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    personality: null,
    interests: [],
    fearLevel: null,
    conversationStyle: null
  });
  const [xp, setXp] = useState(0);
  const [completedModules, setCompletedModules] = useState({});
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const addXP = (amount) => {
    setXp(prev => prev + amount);
  };

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
    { id: 'intro', component: IntroModule },
    { id: 'why', component: WhySmallTalkModule },
    { id: 'personality', component: PersonalityQuizModule },
    { id: 'foundation', component: FoundationModule },
    { id: 'opener_generator', component: AIOpenerGeneratorModule },
    { id: 'conversation_sim', component: AIConversationSimulatorModule },
    { id: 'scenario_analyzer', component: ScenarioAnalyzerModule },
    { id: 'recovery', component: RecoveryModule },
    { id: 'body_language', component: BodyLanguageModule },
    { id: 'daily_mission', component: DailyMissionModule }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">AI Small Talk Mastery</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">{xp} XP</span>
              </div>
              <span className="text-sm text-slate-400">
                {currentStep + 1} / {steps.length}
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
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              addXP={addXP}
              xp={xp}
              completedModules={completedModules}
              setCompletedModules={setCompletedModules}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 p-4">
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
            Back
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
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all"
          >
            {currentStep === steps.length - 1 ? 'Complete' : ''}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 1: INTRO
// ============================================================================
function IntroModule({ onNext, addXP }) {
  useEffect(() => {
    addXP(10);
  }, []);

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
        AI-Powered Small Talk Mastery
      </h1>

      <p className="text-xl text-slate-300 text-center mb-12 max-w-2xl mx-auto">
        Master the art of conversation with AI-powered practice, personalized coaching, and real-time feedback.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI Coach",
            description: "Get personalized conversation strategies"
          },
          {
            icon: <MessageCircle className="w-8 h-8" />,
            title: "Live Practice",
            description: "Simulate real conversations with AI"
          },
          {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Track Progress",
            description: "Earn XP and level up your skills"
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
        <h3 className="text-2xl font-bold mb-4 text-center">What You'll Master</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "AI-generated conversation openers",
            "Live conversation simulation",
            "Past interaction analysis",
            "Personalized daily challenges",
            "Body language mastery",
            "Recovery from awkward moments"
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

// ============================================================================
// MODULE 2: WHY SMALL TALK
// ============================================================================
function WhySmallTalkModule({ onNext, addXP }) {
  const [selectedMyth, setSelectedMyth] = useState(null);

  useEffect(() => {
    addXP(15);
  }, []);

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

// ============================================================================
// MODULE 3: PERSONALITY QUIZ (AI-ENHANCED)
// ============================================================================
function PersonalityQuizModule({ onNext, userProfile, setUserProfile, addXP }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 'social_energy',
      question: "How do you feel after social interactions?",
      options: [
        { value: 'energized', label: "Energized and excited", emoji: "⚡" },
        { value: 'neutral', label: "Fine, depends on the situation", emoji: "😊" },
        { value: 'drained', label: "Tired and need alone time", emoji: "😴" }
      ]
    },
    {
      id: 'conversation_comfort',
      question: "When meeting someone new, you usually:",
      options: [
        { value: 'initiate', label: "Start the conversation first", emoji: "🚀" },
        { value: 'responsive', label: "Wait for them to speak, then engage", emoji: "👋" },
        { value: 'anxious', label: "Feel nervous and overthink what to say", emoji: "😰" }
      ]
    },
    {
      id: 'preferred_topics',
      question: "You prefer conversations about:",
      options: [
        { value: 'deep', label: "Deep topics (dreams, beliefs, ideas)", emoji: "🧠" },
        { value: 'fun', label: "Light topics (hobbies, entertainment)", emoji: "🎉" },
        { value: 'practical', label: "Practical topics (work, plans)", emoji: "📋" }
      ]
    },
    {
      id: 'biggest_fear',
      question: "Your biggest fear in conversations:",
      options: [
        { value: 'awkward_silence', label: "Awkward silences", emoji: "😬" },
        { value: 'boring', label: "Being boring or uninteresting", emoji: "😑" },
        { value: 'judgment', label: "Being judged or rejected", emoji: "😨" }
      ]
    }
  ];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzePersonality(newAnswers);
    }
  };

  const analyzePersonality = async (finalAnswers) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-personality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });

      if (!response.ok) throw new Error('Failed to analyze personality');

      const data = await response.json();
      setResult(data);
      setUserProfile({
        ...userProfile,
        personality: data.personality_type,
        conversationStyle: data.conversation_style,
        strengths: data.strengths,
        areas_to_work_on: data.areas_to_work_on
      });
      addXP(50);
    } catch (error) {
      console.error('Error analyzing personality:', error);
      // Fallback to local analysis
      const localResult = {
        personality_type: "Thoughtful Communicator",
        conversation_style: "You think before you speak and value meaningful connections",
        strengths: ["Good listener", "Thoughtful responses", "Genuine interest"],
        areas_to_work_on: ["Starting conversations", "Small talk confidence", "Handling silences"]
      };
      setResult(localResult);
      setUserProfile({
        ...userProfile,
        personality: localResult.personality_type,
        conversationStyle: localResult.conversation_style
      });
      addXP(50);
    }

    setIsAnalyzing(false);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <Brain className="w-20 h-20 text-blue-400" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Analyzing Your Conversation Style...</h2>
        <p className="text-slate-400">AI is creating your personalized profile</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <h2 className="text-4xl font-bold text-center mb-4">Your Conversation Profile</h2>
        <p className="text-2xl text-center text-blue-400 font-semibold mb-8">{result.personality_type}</p>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
          <p className="text-xl text-slate-300 text-center">{result.conversation_style}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
              <ThumbsUp className="w-6 h-6" />
              Your Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths?.map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
              <Target className="w-6 h-6" />
              Areas to Develop
            </h3>
            <ul className="space-y-2">
              {result.areas_to_work_on?.map((area, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-300">
                  <Zap className="w-4 h-4 text-blue-400" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Discover Your Conversation Style</h2>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <Brain className="w-8 h-8 text-purple-400" />
        <p className="text-xl text-slate-300">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <h3 className="text-2xl font-bold mb-8 text-center">{question.question}</h3>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-6 rounded-xl bg-slate-800/50 border-2 border-slate-700/50 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{option.emoji}</span>
                <span className="text-lg text-slate-200">{option.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-12 rounded-full transition-all ${
              index <= currentQuestion ? 'bg-purple-500' : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 4: FOUNDATION (F.O.R.D.) - Enhanced with AI examples
// ============================================================================
function FoundationModule({ onNext, addXP }) {
  useEffect(() => {
    addXP(20);
  }, []);

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

                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConversationTopics;

function AIOpenerGeneratorModule({ onNext, userProfile, addXP }) {
  const [selectedContext, setSelectedContext] = useState('coffee_shop');
  const [openers, setOpeners] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customContext, setCustomContext] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const contexts = [
    { id: 'coffee_shop', label: 'Coffee Shop', emoji: '☕', color: 'from-amber-600 to-orange-600' },
    { id: 'gym', label: 'Gym', emoji: '💪', color: 'from-red-600 to-pink-600' },
    { id: 'party', label: 'Party/Social Event', emoji: '🎉', color: 'from-purple-600 to-pink-600' },
    { id: 'work', label: 'Work Event', emoji: '💼', color: 'from-blue-600 to-cyan-600' },
    { id: 'park', label: 'Park/Outdoor', emoji: '🌳', color: 'from-green-600 to-emerald-600' },
    { id: 'transport', label: 'Public Transport', emoji: '🚇', color: 'from-slate-600 to-gray-600' }
  ];

  const generateOpeners = async (context) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate-openers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: context,
          personality: userProfile.personality || 'friendly',
          count: 8
        })
      });

      if (!response.ok) throw new Error('Failed to generate openers');

      const data = await response.json();
      setOpeners(data.openers || []);
      addXP(30);
    } catch (error) {
      console.error('Error generating openers:', error);
      // Fallback openers
      setOpeners([
        { text: "Hey! Have you been here before? Any recommendations?", quality: "best", reason: "Asks for help and shows genuine interest" },
        { text: "This place is packed today! Must be good, right?", quality: "good", reason: "Contextual observation, invites agreement" },
        { text: "I love the vibe here. Do you come here often?", quality: "good", reason: "Positive observation, opens conversation" },
        { text: "Mind if I sit here? Everywhere else is taken!", quality: "good", reason: "Direct, honest, low pressure" }
      ]);
      addXP(30);
    }

    setIsGenerating(false);
  };

  const handleGenerateCustom = async () => {
    if (!customContext.trim()) return;
    await generateOpeners(customContext);
    setShowCustomInput(false);
  };

  useEffect(() => {
    generateOpeners(selectedContext);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">AI Opener Generator</h2>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-yellow-400" />
        <p className="text-xl text-slate-300">
          Get personalized conversation starters for any situation
        </p>
      </div>

      {/* Context Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Choose Your Context</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {contexts.map((context) => (
            <motion.button
              key={context.id}
              onClick={() => {
                setSelectedContext(context.id);
                generateOpeners(context.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedContext === context.id
                  ? `bg-gradient-to-r ${context.color} border-white/50`
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="text-4xl mb-2">{context.emoji}</div>
              <div className="text-sm font-medium">{context.label}</div>
            </motion.button>
          ))}
        </div>

        {/* Custom Context */}
        <div className="mt-4">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full p-4 rounded-xl border-2 border-dashed border-slate-600 hover:border-blue-500 transition-all text-slate-400 hover:text-blue-400"
            >
              + Custom Context
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g., 'waiting in line at the grocery store'"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateCustom()}
              />
              <button
                onClick={handleGenerateCustom}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all"
              >
                Generate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generated Openers */}
      {isGenerating ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sparkles className="w-16 h-16 text-blue-400" />
          </motion.div>
          <p className="text-slate-400">AI is crafting perfect openers for you...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Personalized Openers</h3>
            <button
              onClick={() => generateOpeners(selectedContext)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>

          {openers.map((opener, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 ${
                opener.quality === 'best'
                  ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  opener.quality === 'best' ? 'bg-green-500/20' : 'bg-blue-500/20'
                }`}>
                  <MessageCircle className={`w-6 h-6 ${
                    opener.quality === 'best' ? 'text-green-400' : 'text-blue-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-lg text-slate-200 mb-2">"{opener.text}"</p>
                  {opener.reason && (
                    <p className="text-sm text-slate-400">
                      <strong className="text-blue-400">Why it works:</strong> {opener.reason}
                    </p>
                  )}
                  {opener.quality === 'best' && (
                    <div className="mt-2 flex items-center gap-2 text-green-400 text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Top Pick
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          Pro Tip
        </h3>
        <p className="text-slate-300">
          Don't memorize these word-for-word! Use them as inspiration and adapt to your natural speaking style. 
          The best opener is one that feels authentic to you.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 6: AI CONVERSATION SIMULATOR
// ============================================================================
function AIConversationSimulatorModule({ onNext, userProfile, addXP }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [conversationContext, setConversationContext] = useState('coffee_shop');
  const [score, setScore] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const scenarios = [
    { id: 'coffee_shop', label: 'Coffee Shop', description: "You're in line at a busy cafe" },
    { id: 'gym', label: 'Gym', description: "Someone just finished using equipment you need" },
    { id: 'party', label: 'Party', description: "You're at a friend's party, standing near drinks" }
  ];

  const startConversation = async () => {
    setHasStarted(true);
    setIsAITyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/start-simulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: conversationContext,
          personality: userProfile.personality
        })
      });

      if (!response.ok) throw new Error('Failed to start simulation');

      const data = await response.json();
      setMessages([{ role: 'ai', content: data.opening_message || "Hey there! Nice day, huh?" }]);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setMessages([{ role: 'ai', content: "Hey there! Nice day, huh?" }]);
    }

    setIsAITyping(false);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput('');
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setIsAITyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/simulate-conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_history: messages,
          user_message: userMessage,
          context: conversationContext
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.ai_reply }]);
      setScore(data.score);
      setTurnCount(prev => prev + 1);

      if (turnCount >= 4) {
        addXP(50);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      const fallbackReplies = [
        "That's interesting! Tell me more about that.",
        "Oh cool! I've been wanting to try that too.",
        "Nice! How long have you been into that?"
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      setMessages(prev => [...prev, { role: 'ai', content: randomReply }]);
    }

    setIsAITyping(false);
  };

  const resetConversation = () => {
    setMessages([]);
    setUserInput('');
    setScore(null);
    setTurnCount(0);
    setHasStarted(false);
  };

  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6">Live Conversation Practice</h2>
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <MessageCircle className="w-8 h-8 text-blue-400" />
          <p className="text-xl text-slate-300">
            Practice with AI in realistic scenarios
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Choose Your Scenario</h3>
          
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => setConversationContext(scenario.id)}
                whileHover={{ scale: 1.02 }}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                  conversationContext === scenario.id
                    ? 'bg-blue-900/40 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <h4 className="text-xl font-bold mb-2">{scenario.label}</h4>
                <p className="text-slate-400">{scenario.description}</p>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={startConversation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-xl transition-all"
          >
            Start Conversation 🚀
          </motion.button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            How It Works
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>AI plays the role of a real person in the scenario</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Respond naturally, as you would in real life</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Get real-time feedback on your conversation skills</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Conversation Practice</h2>
        <button
          onClick={resetConversation}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Score Display */}
      {score && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Current Flow Score:</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${score.overall}%` }}
                />
              </div>
              <span className="text-2xl font-bold text-green-400">{score.overall}/100</span>
            </div>
          </div>
          {score.feedback && (
            <p className="mt-2 text-sm text-slate-400">{score.feedback}</p>
          )}
        </motion.div>
      )}

      {/* Chat Messages */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6 h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}>
                <p>{message.content}</p>
              </div>
            </motion.div>
          ))}
          
          {isAITyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-700 text-slate-400 p-4 rounded-2xl">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your response..."
          className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          disabled={isAITyping}
        />
        <button
          onClick={sendMessage}
          disabled={isAITyping || !userInput.trim()}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>

      {turnCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30 text-center"
        >
          <Award className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2 text-green-400">Great Job!</h3>
          <p className="text-slate-300">You've completed a full conversation. Keep practicing to improve!</p>
        </motion.div>
      )}
    </div>
  );
}

// TO BE CONTINUED IN PART 3...
// Next modules: ScenarioAnalyzerModule, RecoveryModule, BodyLanguageModule, DailyMissionModule

export { AIOpenerGeneratorModule, AIConversationSimulatorModule };

function ScenarioAnalyzerModule({ onNext, addXP }) {
  const [userStory, setUserStory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeScenario = async () => {
    if (!userStory.trim()) return;
    
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-past-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: userStory })
      });

      if (!response.ok) throw new Error('Failed to analyze scenario');

      const data = await response.json();
      setAnalysis(data);
      addXP(40);
    } catch (error) {
      console.error('Error analyzing scenario:', error);
      // Fallback analysis
      setAnalysis({
        what_went_wrong: [
          "The timing might not have been ideal",
          "The conversation topic may not have resonated",
          "Body language cues weren't read properly"
        ],
        what_to_do_differently: [
          "Start with a contextual observation about the environment",
          "Read their body language - are they open to conversation?",
          "Have a graceful exit strategy if they're not interested"
        ],
        recovery_strategies: [
          "If you get one-word answers, try a completely different topic",
          "Use humor to acknowledge the awkwardness",
          "It's okay to politely exit if the vibe isn't right"
        ],
        encouragement: "Remember, even the best conversationalists have awkward moments. The key is learning from them!"
      });
      addXP(40);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Learn From Past Conversations</h2>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <Brain className="w-8 h-8 text-purple-400" />
        <p className="text-xl text-slate-300">
          AI will analyze what happened and how to improve
        </p>
      </div>

      {!analysis ? (
        <>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-6">
            <h3 className="text-xl font-semibold mb-4">Describe a Past Awkward Moment</h3>
            <p className="text-slate-400 mb-6">
              Think of a time when a conversation didn't go well. What happened? Be as detailed as possible.
            </p>
            
            <textarea
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              placeholder="Example: I tried talking to someone at the gym, but they just gave one-word answers and seemed uncomfortable. I asked about their workout routine, but they said 'fine' and put their headphones back in..."
              className="w-full h-48 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />

            <motion.button
              onClick={analyzeScenario}
              disabled={isAnalyzing || !userStory.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  AI is Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze With AI
                </>
              )}
            </motion.button>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Example Situations
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Someone gave one-word answers at a party</li>
              <li>• Awkward silence after your opener</li>
              <li>• They seemed annoyed when you approached</li>
              <li>• Conversation died after 30 seconds</li>
            </ul>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* What Went Wrong */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-2xl p-6 border border-red-500/30">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-8 h-8" />
              What Likely Went Wrong
            </h3>
            <ul className="space-y-3">
              {analysis.what_went_wrong?.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What To Do Differently */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-400">
              <Target className="w-8 h-8" />
              What To Do Differently Next Time
            </h3>
            <ul className="space-y-3">
              {analysis.what_to_do_differently?.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recovery Strategies */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-green-400">
              <Zap className="w-8 h-8" />
              How To Recover In The Moment
            </h3>
            <ul className="space-y-3">
              {analysis.recovery_strategies?.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 text-center">
            <Award className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-lg text-slate-300">{analysis.encouragement}</p>
          </div>

          <button
            onClick={() => {
              setAnalysis(null);
              setUserStory('');
            }}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all"
          >
            Analyze Another Situation
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// MODULE 8: RECOVERY (Keep from original, enhanced)
// ============================================================================
function RecoveryModule({ onNext, addXP }) {
  useEffect(() => {
    addXP(25);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Handling Awkward Moments</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Every conversation has awkward moments. The difference? 
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

// ============================================================================
// MODULE 9: BODY LANGUAGE (Keep from original)
// ============================================================================
function BodyLanguageModule({ onNext, addXP }) {
  const [activeTab, setActiveTab] = useState('do');

  useEffect(() => {
    addXP(25);
  }, []);

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

// ============================================================================
// MODULE 10: DAILY MISSION (AI-Generated Challenges)
// ============================================================================
function DailyMissionModule({ onNext, userProfile, addXP }) {
  const [mission, setMission] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  const generateMission = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/daily-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personality: userProfile.personality,
          skill_level: 'beginner'
        })
      });

      if (!response.ok) throw new Error('Failed to generate mission');

      const data = await response.json();
      setMission(data);
    } catch (error) {
      console.error('Error generating mission:', error);
      // Fallback missions
      const fallbackMissions = [
        {
          title: "The Coffee Shop Connection",
          description: "Start 1 conversation with someone in line at a coffee shop",
          difficulty: "Easy",
          tips: [
            "Comment on the menu or the wait time",
            "Ask for a recommendation",
            "Keep it brief - 30 seconds is perfect"
          ],
          xp_reward: 100
        },
        {
          title: "The Compliment Challenge",
          description: "Give 2 genuine compliments to strangers today",
          difficulty: "Medium",
          tips: [
            "Be specific (not just 'nice shirt')",
            "Make it about something they chose",
            "Don't expect a long conversation"
          ],
          xp_reward: 150
        }
      ];
      setMission(fallbackMissions[Math.floor(Math.random() * fallbackMissions.length)]);
    }

    setIsGenerating(false);
  };

  useEffect(() => {
    generateMission();
  }, []);

  const acceptMission = () => {
    setHasAccepted(true);
    addXP(mission?.xp_reward || 100);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <Target className="w-20 h-20 text-blue-400" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Generating Your Personalized Mission...</h2>
        <p className="text-slate-400">AI is creating the perfect challenge for you</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 mb-6">
          <Trophy className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <h2 className="text-5xl font-bold text-center mb-6">Your Daily Mission</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Knowledge without action is just entertainment. Let's make this real.
      </p>

      {mission && (
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30 mb-8">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-3xl font-bold text-blue-400">{mission.title}</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              mission.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
              mission.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {mission.difficulty}
            </span>
          </div>

          <p className="text-xl text-slate-200 mb-6">{mission.description}</p>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Tips for Success
            </h4>
            <ul className="space-y-2">
              {mission.tips?.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
            <span className="text-slate-300">Reward:</span>
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
              <Award className="w-6 h-6" />
              +{mission.xp_reward} XP
            </div>
          </div>
        </div>
      )}

      {!hasAccepted ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center space-y-4"
        >
          <button
            onClick={acceptMission}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl transition-all shadow-2xl shadow-yellow-500/30"
          >
            Accept Mission! 🚀
          </button>
          <button
            onClick={generateMission}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all"
          >
            Generate New Mission
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4 text-green-400">Mission Accepted!</h3>
          <p className="text-xl text-slate-300 mb-6">
            You're ready. Go make it happen today. It doesn't have to be perfect—it just has to happen.
          </p>
          <p className="text-lg text-slate-400">
            Remember: Every person you admire who's great at conversation was once exactly where you are now. 
            The difference? <span className="text-blue-400 font-semibold">They started.</span>
          </p>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h4 className="text-lg font-semibold mb-4">Quick Reference</h4>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">F.O.R.D. Topics</p>
                <p className="text-sm text-slate-300">Family, Occupation, Recreation, Dreams</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-cyan-400 font-semibold mb-2">Best Openers</p>
                <p className="text-sm text-slate-300">Contextual, Compliments, Direct Questions</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Export all modules
export {
  ScenarioAnalyzerModule,
  RecoveryModule,
  BodyLanguageModule,
  DailyMissionModule
};
