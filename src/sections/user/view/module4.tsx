import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, ArrowRight, ArrowLeft, CheckCircle, 
  AlertTriangle, Lightbulb, Target, Zap, Eye,
  TrendingUp, Users, Smile, Brain, Activity, X,
  Sparkles, Award, BookOpen, ChevronDown, Volume2,
  Heart, Boxes, AlertCircle, PlayCircle, Trophy, Shield
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';
export default function TALKFrameworkNavigator({ lessonContent, onBackToTimeline, onCompleteNavigator }) {
  usePortalDriver();
  const [currentStep, setCurrentStep] = useState(0);
  const [diagnosisData, setDiagnosisData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [weakestComponent, setWeakestComponent] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
      component: IntroStep,
      title: 'Welcome to TALK'
    },
    {
      id: 'diagnosis',
      component: DiagnosisStep,
      title: 'Your Diagnosis'
    },
    {
      id: 'mirror',
      component: MirrorStep,
      title: 'The Mirror'
    },
    {
      id: 'talk_intro',
      component: TALKIntroStep,
      title: 'TALK Framework'
    },
    {
      id: 'tone_deep',
      component: ToneDeepDiveStep,
      title: 'Tone Mastery'
    },
    {
      id: 'attention_deep',
      component: AttentionDeepDiveStep,
      title: 'Attention Tactics'
    },
    {
      id: 'listening_deep',
      component: ListeningDeepDiveStep,
      title: 'Listening Skills'
    },
    {
      id: 'kindness_deep',
      component: KindnessDeepDiveStep,
      title: 'Kindness Techniques'
    },
    {
      id: 'matching_game',
      component: MatchingGameStep,
      title: 'Match the Pattern'
    },
    {
      id: 'scenario_practice',
      component: ScenarioPracticeStep,
      title: 'Practice Scenarios'
    },
    {
      id: 'deep_dive',
      component: DeepDiveStep,
      title: 'Your Weak Point'
    },
    {
      id: 'reframe',
      component: ReframeStep,
      title: 'Reframe Exercise'
    },
    {
      id: 'experiments',
      component: ExperimentsStep,
      title: 'Your Experiments'
    },
    {
      id: 'reflection',
      component: ReflectionStep,
      title: 'Final Reflection'
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <span className="font-semibold">TALK Framework</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-purple-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <p className="text-xs text-slate-400">{steps[currentStep].title}</p>
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
              diagnosisData={diagnosisData}
              setDiagnosisData={setDiagnosisData}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              weakestComponent={weakestComponent}
              setWeakestComponent={setWeakestComponent}
            />
          </motion.div>
        </AnimatePresence>
      </div>

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
            {currentStep === steps.length - 1 ? 'Complete' : ''}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IntroStep({ onNext }) {
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      text: "People don't remember what you said. They remember how the conversation felt.",
      author: "The Truth"
    },
    {
      text: "Charisma isn't what you project. It's what you make others feel about themselves.",
      author: "The Insight"
    },
    {
      text: "The best conversationalists aren't performers. They're detectives.",
      author: "The Shift"
    },
    {
      text: "Your words don't land if your energy is wrong. Energy first, words second.",
      author: "The Priority"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6 relative">
          <MessageSquare className="w-16 h-16 text-white" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-purple-300/30 rounded-full"
            style={{ margin: '-12px' }}
          />
        </div>
      </motion.div>

      <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        The TALK Framework
      </h1>

      <p className="text-xl text-slate-300 text-center mb-4 max-w-2xl mx-auto">
        A practical structure for better conversations. Not confidence theater.
      </p>

      <p className="text-lg text-purple-400 text-center mb-12 font-semibold">
        Evidence-based. Actionable. Designed to fix your actual problems.
      </p>

      {/* Rotating Inspirational Quotes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 mb-12 text-center"
        >
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <p className="text-2xl italic text-slate-200 mb-3">
            "{quotes[currentQuote].text}"
          </p>
          <p className="text-sm text-purple-400 font-semibold">
            — {quotes[currentQuote].author}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
          <X className="w-7 h-7 text-red-400" />
          What This Is NOT
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { text: "Generic advice about 'being yourself'", why: "Not actionable or specific" },
            { text: "Scripts to memorize word-for-word", why: "You'll sound like a robot" },
            { text: "Personality transformation", why: "You don't need to change who you are" },
            { text: "Fake positivity or forced energy", why: "People can smell inauthenticity" },
            { text: "Manipulation tactics", why: "We're building genuine connections" },
            { text: "One-size-fits-all solutions", why: "Every conversation is different" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 bg-red-900/10 border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-colors"
            >
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-slate-200 font-medium mb-1">{item.text}</p>
                <p className="text-sm text-slate-400">{item.why}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
          <CheckCircle className="w-7 h-7 text-green-400" />
          What This IS
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { 
              icon: <Target className="w-6 h-6" />,
              text: "A diagnostic lens for what's actually wrong",
              detail: "Identify your specific conversation breakdowns"
            },
            { 
              icon: <Eye className="w-6 h-6" />,
              text: "Pattern recognition training",
              detail: "See what you couldn't see before"
            },
            { 
              icon: <Zap className="w-6 h-6" />,
              text: "Micro-experiments you can test today",
              detail: "Small, measurable changes with real results"
            },
            { 
              icon: <Brain className="w-6 h-6" />,
              text: "Mental models for reading the room",
              detail: "Understand what's really happening"
            },
            { 
              icon: <Activity className="w-6 h-6" />,
              text: "Real-time adjustment strategies",
              detail: "Course-correct mid-conversation"
            },
            { 
              icon: <TrendingUp className="w-6 h-6" />,
              text: "Evidence-based tactics that work",
              detail: "Based on research, not guru opinions"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 bg-green-900/20 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 hover:bg-green-900/30 transition-all"
            >
              <div className="text-green-400 flex-shrink-0 mt-1">
                {item.icon}
              </div>
              <div>
                <p className="text-slate-200 font-semibold mb-1">{item.text}</p>
                <p className="text-sm text-slate-400">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Big Promise */}
      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 rounded-2xl p-8 border border-purple-500/40 mb-8 text-center">
        <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          The Promise
        </h3>
        <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto mb-4">
          By the end of this module, you'll have a complete framework for diagnosing conversation problems, 
          understanding exactly what you're doing wrong, and knowing precisely what to try next.
        </p>
        <p className="text-lg text-purple-300 font-semibold">
          No guesswork. No hoping for the best. Just clarity and actionable steps.
        </p>
      </div>

      {/* Module Overview - Expandable */}
      <div className="mb-8">
        <button
          onClick={() => setShowModuleDetails(!showModuleDetails)}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl p-6 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-semibold">What You'll Learn in This Module</span>
          </div>
          <motion.div
            animate={{ rotate: showModuleDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-slate-200" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showModuleDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {[
                  { step: 1, title: "Self-Diagnosis", desc: "Pinpoint your exact conversation weak points with precision", icon: <Target className="w-5 h-5" /> },
                  { step: 2, title: "The Mirror", desc: "See yourself as others see you (this will be uncomfortable)", icon: <Eye className="w-5 h-5" /> },
                  { step: 3, title: "TALK Framework", desc: "Learn the 4 components of every successful conversation", icon: <MessageSquare className="w-5 h-5" /> },
                  { step: 4, title: "Tone Mastery", desc: "Match energy without faking it or forcing it", icon: <Volume2 className="w-5 h-5" /> },
                  { step: 5, title: "Attention Command", desc: "Get people to actually want to listen to you", icon: <Eye className="w-5 h-5" /> },
                  { step: 6, title: "Active Listening", desc: "Hear what they mean, not just what they say", icon: <Smile className="w-5 h-5" /> },
                  { step: 7, title: "Authentic Kindness", desc: "Build genuine warmth without being fake", icon: <Heart className="w-5 h-5" /> },
                  { step: 8, title: "Pattern Matching Game", desc: "Interactive exercise to recognize conversation failures", icon: <Boxes className="w-5 h-5" /> },
                  { step: 9, title: "Scenario Practice", desc: "Apply your skills to real-world situations", icon: <PlayCircle className="w-5 h-5" /> },
                  { step: 10, title: "Your Weak Point Deep Dive", desc: "Targeted breakdown of YOUR specific issue", icon: <AlertCircle className="w-5 h-5" /> },
                  { step: 11, title: "Reframe Exercise", desc: "Turn your weaknesses into strengths", icon: <Sparkles className="w-5 h-5" /> },
                  { step: 12, title: "Personalized Experiments", desc: "3 specific tests you can run in 48 hours", icon: <Zap className="w-5 h-5" /> },
                  { step: 13, title: "Reflection & Integration", desc: "Lock in your learnings and commit to action", icon: <Brain className="w-5 h-5" /> }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:border-purple-500/40 hover:bg-slate-800/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-purple-400">{item.icon}</div>
                          <h4 className="font-bold text-slate-200">{item.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Why This Works */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-500/30 text-center">
        <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">Why This Works When Other Advice Doesn't</h3>
        <div className="space-y-3 text-left max-w-2xl mx-auto">
          {[
            "It's diagnostic, not prescriptive. We find YOUR problem, not everyone's.",
            "It gives you experiments, not lectures. You'll test and measure results.",
            "It's based on patterns you can see and fix, not vague personality traits.",
            "You'll get uncomfortable truths, not comfortable lies."
          ].map((reason, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-slate-300">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
           

function DiagnosisStep({ onNext, diagnosisData, setDiagnosisData, setUserProfile, setWeakestComponent }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'struggle_context',
      question: "Where do conversations drain you fastest?",
      options: [
        { value: 'one_on_one', label: 'One-on-one with strangers', weight: { topics: 2, asking: 3 } },
        { value: 'groups', label: 'Group settings', weight: { levity: 3, kindness: 2 } },
        { value: 'work', label: 'Professional contexts', weight: { levity: 2, topics: 3 } },
        { value: 'dating', label: 'Dating or romantic contexts', weight: { asking: 3, levity: 2 } },
        { value: 'texting', label: 'Text conversations', weight: { topics: 2, kindness: 2 } }
      ]
    },
    {
      id: 'what_goes_wrong',
      question: "When conversations stall, what usually happens next?",
      options: [
        { value: 'silence', label: 'Awkward silence. I panic.', weight: { topics: 3, levity: 2 } },
        { value: 'exit', label: 'I find an excuse to leave', weight: { kindness: 2, levity: 3 } },
        { value: 'interview', label: 'I ask more questions but it feels like an interview', weight: { asking: 3, levity: 2 } },
        { value: 'monologue', label: 'They talk, I listen, but I feel invisible', weight: { topics: 2, asking: 3 } },
        { value: 'overthink', label: 'I overthink what to say and say nothing', weight: { topics: 3, kindness: 2 } }
      ]
    },
    {
      id: 'self_perception',
      question: "What do you think the problem is?",
      options: [
        { value: 'boring', label: 'I have nothing interesting to say', weight: { topics: 3, levity: 1 } },
        { value: 'awkward', label: 'I am just awkward', weight: { levity: 3, asking: 2 } },
        { value: 'timing', label: 'My timing is always off', weight: { asking: 2, kindness: 3 } },
        { value: 'invisible', label: 'People dont notice or remember me', weight: { topics: 2, kindness: 3 } },
        { value: 'exhausting', label: 'Conversations feel like work', weight: { asking: 2, levity: 3 } }
      ]
    },
    {
      id: 'response_pattern',
      question: "How do you usually respond when someone shares something personal?",
      options: [
        { value: 'advice', label: 'I try to give advice or solutions', weight: { kindness: 3, asking: 2 } },
        { value: 'redirect', label: 'I redirect to something lighter', weight: { levity: 2, kindness: 3 } },
        { value: 'relate', label: 'I share my own similar experience', weight: { topics: 2, asking: 2 } },
        { value: 'freeze', label: 'I freeze and say something generic', weight: { kindness: 3, levity: 2 } },
        { value: 'ask_more', label: 'I ask follow-up questions', weight: { asking: 1, kindness: 1 } }
      ]
    },
    {
      id: 'energy_shift',
      question: "What makes a conversation suddenly feel easier for you?",
      options: [
        { value: 'shared_thing', label: 'Finding something we both know or care about', weight: { topics: 1, asking: 2 } },
        { value: 'they_laugh', label: 'When they laugh at something I said', weight: { levity: 1, topics: 2 } },
        { value: 'they_ask', label: 'When they ask me questions', weight: { topics: 2, kindness: 2 } },
        { value: 'informal', label: 'When the vibe becomes less formal', weight: { levity: 1, kindness: 2 } },
        { value: 'validation', label: 'When they validate what I said', weight: { kindness: 1, topics: 2 } }
      ]
    }
  ];

  const handleAnswer = (value, weight) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: { value, weight } };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      calculateProfile(newAnswers);
    }
  };

  const calculateProfile = (allAnswers) => {
    const scores = { topics: 0, asking: 0, levity: 0, kindness: 0 };
    
    Object.values(allAnswers).forEach(answer => {
      Object.entries(answer.weight).forEach(([component, weight]) => {
        scores[component] += weight;
      });
    });

    const weakest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    
    setDiagnosisData(allAnswers);
    setWeakestComponent(weakest);
    setUserProfile({
      scores,
      weakest,
      answers: allAnswers
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Situational Diagnosis</h2>
      <p className="text-slate-400 text-center mb-8">
        No labels. Just patterns.
      </p>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-6">
            <h3 className="text-2xl font-semibold mb-6">{questions[currentQuestion].question}</h3>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option.value, option.weight)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full text-left p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-purple-500/50 transition-all"
                >
                  <span className="text-slate-200">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MirrorStep({ userProfile, onNext }) {
  if (!userProfile) return null;

  const profiles = {
    topics: {
      diagnosis: "You don't lack things to say. You exit conversations too early because you think your topics aren't interesting enough.",
      pattern: "You're underestimating how much people want concrete, human topics. You're probably avoiding the specific in favor of the vague.",
      icon: <Target className="w-12 h-12" />
    },
    asking: {
      diagnosis: "You're over-investing in asking questions. Conversations feel polite but flat because you're disappearing behind your curiosity.",
      pattern: "You're treating conversations like interviews. You ask, they answer, you ask again. No one knows what you think or feel.",
      icon: <MessageSquare className="w-12 h-12" />
    },
    levity: {
      diagnosis: "You freeze when you're unsure how much space you're allowed to take. Conversations feel like performance reviews.",
      pattern: "You're treating every exchange like it has stakes. You need permission to relax, but no one's going to give it to you.",
      icon: <Smile className="w-12 h-12" />
    },
    kindness: {
      diagnosis: "You respond literally instead of generously. People don't feel worse around you, but they don't feel seen either.",
      pattern: "You're solving problems instead of acknowledging feelings. You're efficient but not warm.",
      icon: <Users className="w-12 h-12" />
    }
  };

  const profile = profiles[userProfile.weakest];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">What's Actually Happening</h2>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 rounded-2xl p-8 border border-purple-500/30 mb-8"
      >
        <div className="flex items-start gap-6 mb-6">
          <div className="p-4 bg-purple-500/20 rounded-xl text-purple-400">
            {profile.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Your Pattern</h3>
            <p className="text-xl text-slate-200 leading-relaxed mb-4">
              {profile.diagnosis}
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              {profile.pattern}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-400" />
          What This Means
        </h3>
        <p className="text-slate-300 leading-relaxed">
          This isn't about confidence. It's about what you're prioritizing in the moment. 
          You're already doing some things well. But you're blind to what's missing.
        </p>
      </div>

      <p className="text-center text-slate-400 mt-8">
        Now let's fix it.
      </p>
    </div>
  );
}

function TALKIntroStep({ weakestComponent, onNext }) {
  const components = {
    topics: {
      letter: 'T',
      name: 'Topics',
      problem: 'Using vague or status-heavy topics',
      solution: 'Concrete, shared, human topics',
      color: 'from-blue-600 to-cyan-600'
    },
    asking: {
      letter: 'A',
      name: 'Asking',
      problem: 'Asking too many new questions',
      solution: 'Open-ended follow-ups',
      color: 'from-purple-600 to-pink-600'
    },
    levity: {
      letter: 'L',
      name: 'Levity',
      problem: 'Treating conversations like exams',
      solution: 'Light humor and self-awareness',
      color: 'from-yellow-600 to-orange-600'
    },
    kindness: {
      letter: 'K',
      name: 'Kindness',
      problem: 'Responding literally, not generously',
      solution: 'Validate feelings, not just facts',
      color: 'from-green-600 to-emerald-600'
    }
  };

  const focused = components[weakestComponent];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">The TALK Framework</h2>
      <p className="text-xl text-slate-300 text-center mb-12">
        Four components. You're underusing one.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {Object.entries(components).map(([key, comp]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: key === weakestComponent ? 1 : 0.4,
              scale: key === weakestComponent ? 1.05 : 1
            }}
            className={`rounded-xl p-6 border ${
              key === weakestComponent 
                ? 'bg-gradient-to-r ' + comp.color + ' border-white/30' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}
          >
            <div className="text-4xl font-bold mb-2">{comp.letter}</div>
            <div className="text-xl font-semibold mb-1">{comp.name}</div>
          </motion.div>
        ))}
      </div>

      <div className={`bg-gradient-to-r ${focused.color} rounded-2xl p-8 text-white`}>
        <h3 className="text-3xl font-bold mb-6">Your Weakest Component: {focused.name}</h3>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold text-lg">What you're doing</span>
            </div>
            <p className="text-white/90">{focused.problem}</p>
          </div>

          <div className="bg-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6" />
              <span className="font-semibold text-lg">What to do instead</span>
            </div>
            <p className="text-white/90">{focused.solution}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeepDiveStep({ weakestComponent, diagnosisData, onNext }) {
  const deepDives = {
    topics: {
      mistake: "You think your topics are boring, so you default to abstract questions or small talk that goes nowhere.",
      why_it_backfires: "Vague topics create vague responses. 'How's work?' gets 'Fine.' But 'What's been unexpectedly annoying this week?' starts a real conversation.",
      examples: [
        {
          context: "At work",
          bad: '"How was your weekend?"',
          good: '"What\'s something you\'re oddly excited about right now?"',
          why: "Concrete and unexpected. Gives them something specific to grab onto."
        },
        {
          context: "With friends",
          bad: '"What\'s new?"',
          good: '"What\'s been taking up way more mental space than it should?"',
          why: "Human and relatable. Opens the door to real thoughts."
        },
        {
          context: "On dates",
          bad: '"What do you do for fun?"',
          good: '"What\'s something you do that people would find surprisingly boring?"',
          why: "Playful and disarming. Creates permission to be real."
        }
      ]
    },
    asking: {
      mistake: "You keep asking new questions instead of following up. It feels like you're collecting data, not connecting.",
      why_it_backfires: "People feel interviewed, not seen. You're signaling curiosity but not investment. They answer because they're polite, not because they want to.",
      examples: [
        {
          context: "At work",
          bad: '"What do you do?" → They answer → "Where are you from?"',
          good: '"What do you do?" → They answer → "What part of that actually energizes you?"',
          why: "Follow-up shows you're listening, not just filling air."
        },
        {
          context: "With strangers",
          bad: '"Do you travel much?" → "What\'s your favorite place?"',
          good: '"Do you travel much?" → They mention a place → "What made that place stick with you?"',
          why: "You're exploring their answer, not moving to the next topic."
        },
        {
          context: "On dates",
          bad: '"What do you do?" → "Do you like it?" → "Where did you grow up?"',
          good: '"What do you do?" → "How did you end up in that?" → Let them talk',
          why: "Depth over breadth. One thread explored beats five threads skimmed."
        }
      ]
    },
    levity: {
      mistake: "You treat every conversation like it has consequences. You're scanning for mistakes instead of connecting.",
      why_it_backfires: "When you're tense, they're tense. Levity isn't about being funny—it's about reducing social risk. People relax when you signal that imperfection is allowed.",
      examples: [
        {
          context: "When you misspeak",
          bad: "Apologize and move on awkwardly",
          good: '"Okay that came out way weirder than I meant. Let me try again."',
          why: "Self-awareness without self-flagellation. Shows you're human."
        },
        {
          context: "When there's a pause",
          bad: "Panic and ask a random question",
          good: '"I just realized I have no idea where I was going with that."',
          why: "Acknowledging the moment makes it less awkward, not more."
        },
        {
          context: "When they say something serious",
          bad: "Get overly earnest or stay silent",
          good: '"That sounds exhausting. How are you not just screaming into a pillow daily?"',
          why: "Light touch validates without making it heavy. Gives them room to respond how they want."
        }
      ]
    },
    kindness: {
      mistake: "You respond to what people say, not how they feel. You're efficient but not warm.",
      why_it_backfires: "People don't always want solutions. They want to feel heard. When you jump to fixing or advising, you're skipping the step where they feel safe.",
      examples: [
        {
          context: "They share a problem",
          bad: '"Have you tried [solution]?"',
          good: '"That sounds exhausting. How are you even dealing with it?"',
          why: "Acknowledge the feeling first. Solutions come later, if they ask."
        },
        {
          context: "They share excitement",
          bad: '"That\'s cool."',
          good: '"Okay I need to hear more about this. What made you realize you wanted to do it?"',
          why: "Match their energy. Show their excitement matters to you."
        },
        {
          context: "They're venting",
          bad: '"I\'m sure it\'ll work out."',
          good: '"That sounds like a nightmare. What part is the worst?"',
          why: "Don't minimize. Let them fully express it before shifting."
        }
      ]
    }
  };

  const dive = deepDives[weakestComponent];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">What You're Actually Doing Wrong</h2>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-red-400">The Mistake</h3>
        <p className="text-slate-200 text-lg leading-relaxed">{dive.mistake}</p>
      </div>

      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-8 border border-red-500/30 mb-12">
        <h3 className="text-2xl font-bold mb-4 text-orange-400">Why It Backfires</h3>
        <p className="text-slate-200 text-lg leading-relaxed">{dive.why_it_backfires}</p>
      </div>

      <h3 className="text-3xl font-bold mb-6 text-center">Situation-Specific Fixes</h3>

      <div className="space-y-6">
        {dive.examples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <div className="bg-purple-900/30 px-6 py-4 border-b border-slate-700/50">
              <h4 className="text-xl font-bold text-purple-400">{example.context}</h4>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-400">Don't</span>
                </div>
                <p className="text-slate-300">{example.bad}</p>
              </div>

              <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-green-400">Do</span>
                </div>
                <p className="text-slate-300">{example.good}</p>
              </div>

              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-blue-400">Why</span>
                </div>
                <p className="text-slate-300">{example.why}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReframeStep({ weakestComponent, onNext }) {
  const reframes = {
    topics: {
      old: "I have nothing interesting to say",
      new: "I exit conversations too early",
      explanation: "You have topics. You're just abandoning them before they develop. The problem isn't your content—it's your commitment to the thread.",
      icon: <Target className="w-12 h-12" />
    },
    asking: {
      old: "I'm a good listener",
      new: "I disappear behind my questions",
      explanation: "Listening is important. But when you only ask and never share, people don't know you. You're not connecting—you're conducting research.",
      icon: <MessageSquare className="w-12 h-12" />
    },
    levity: {
      old: "I'm awkward",
      new: "I don't signal safety",
      explanation: "Awkwardness isn't a personality trait. It's what happens when you treat every moment like it has stakes. You need to show imperfection is allowed.",
      icon: <Smile className="w-12 h-12" />
    },
    kindness: {
      old: "I'm helpful",
      new: "I respond to words, not people",
      explanation: "Giving advice isn't the same as making someone feel seen. You're solving when you should be acknowledging. Facts without feelings = cold.",
      icon: <Users className="w-12 h-12" />
    }
  };

  const reframe = reframes[weakestComponent];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">Reframe Your Self-Story</h2>

      <p className="text-xl text-slate-300 text-center mb-12">
        The story you tell yourself is keeping you stuck.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-900/30 rounded-2xl p-8 border border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <X className="w-8 h-8 text-red-400" />
            <h3 className="text-2xl font-bold text-red-400">Old Story</h3>
          </div>
          <p className="text-2xl font-semibold text-slate-200 mb-4">"{reframe.old}"</p>
          <p className="text-slate-400">This reduces shame but removes responsibility. It makes you passive.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-900/30 rounded-2xl p-8 border border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-bold text-green-400">New Story</h3>
          </div>
          <p className="text-2xl font-semibold text-slate-200 mb-4">"{reframe.new}"</p>
          <p className="text-slate-400">This is behavioral. It gives you something to change.</p>
        </motion.div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-purple-500/20 rounded-xl text-purple-400">
            {reframe.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">What This Means</h3>
            <p className="text-slate-200 text-lg leading-relaxed">{reframe.explanation}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-300 text-lg">
          You're not broken. You're executing a pattern that doesn't work. 
          <br />
          <span className="text-purple-400 font-semibold">Change the pattern.</span>
        </p>
      </div>
    </div>
  );
}

function ExperimentsStep({ weakestComponent, onNext }) {
  const experiments = {
    topics: [
      {
        situation: "Next conversation with a coworker",
        action: "Instead of 'How was your weekend?', ask 'What's been unexpectedly annoying this week?'",
        notice: "Notice if their response is longer and more specific. Don't judge quality—just notice length and detail.",
        icon: <Activity className="w-6 h-6" />
      },
      {
        situation: "When someone asks you a generic question",
        action: "Give a concrete, specific answer instead of 'good' or 'fine'. Example: 'I've been weirdly obsessed with trying to perfect scrambled eggs.'",
        notice: "Notice if they ask a follow-up. Notice if the conversation continues or dies.",
        icon: <Brain className="w-6 h-6" />
      },
      {
        situation: "In a group setting",
        action: "When someone mentions something vague ('I'm tired'), ask 'What kind of tired? Like physically exhausted or mentally done?'",
        notice: "Notice if they seem relieved someone asked. Notice if others lean in.",
        icon: <Users className="w-6 h-6" />
      }
    ],
    asking: [
      {
        situation: "Next one-on-one conversation",
        action: "Ask one question, then ask only follow-ups for 3 minutes. Don't introduce new topics.",
        notice: "Notice when they relax. Notice when you feel uncomfortable staying on one thread.",
        icon: <Activity className="w-6 h-6" />
      },
      {
        situation: "When someone answers your question",
        action: "Pick one word from their answer and ask about it. Example: They say 'I went hiking.' You say: 'Where do you usually hike?'",
        notice: "Notice if the conversation feels deeper. Notice if they start asking you questions back.",
        icon: <Brain className="w-6 h-6" />
      },
      {
        situation: "When you're about to ask a new question",
        action: "Share something about yourself related to their last answer first. Then ask.",
        notice: "Notice if they seem more interested. Notice if the dynamic shifts from interview to exchange.",
        icon: <MessageSquare className="w-6 h-6" />
      }
    ],
    levity: [
      {
        situation: "Next time there's an awkward pause",
        action: "Say 'Well that was a smooth transition' or 'I just forgot what I was saying' with a light tone.",
        notice: "Notice if they laugh or relax. Notice if the conversation continues more easily after.",
        icon: <Smile className="w-6 h-6" />
      },
      {
        situation: "When you say something that lands weird",
        action: "Acknowledge it: 'That sounded better in my head.' Then move on.",
        notice: "Notice if they seem relieved. Notice if you feel less pressure after acknowledging it.",
        icon: <Activity className="w-6 h-6" />
      },
      {
        situation: "In any conversation that feels tense",
        action: "Make one self-aware observation. Example: 'I'm realizing this sounds way more dramatic than it felt at the time.'",
        notice: "Notice if the vibe shifts. Notice if they start being more casual too.",
        icon: <Brain className="w-6 h-6" />
      }
    ],
    kindness: [
      {
        situation: "When someone shares a problem",
        action: "Say 'That sounds [exhausting/frustrating/complicated]. How are you handling it?' Don't offer advice unless asked.",
        notice: "Notice if they keep talking. Notice if they seem more open.",
        icon: <Users className="w-6 h-6" />
      },
      {
        situation: "When someone shares excitement",
        action: "Match their energy. Say 'That's awesome! What made you decide to do it?' and lean in physically.",
        notice: "Notice if they get more animated. Notice how long they talk.",
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        situation: "When someone is venting",
        action: "Don't minimize. Ask 'What part is the worst?' and let them go deeper before offering perspective.",
        notice: "Notice when they relax. Notice if they thank you even though you didn't 'help'.",
        icon: <Activity className="w-6 h-6" />
      }
    ]
  };

  const userExperiments = experiments[weakestComponent];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">Your Micro-Experiments</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Three tiny actions to test in the next 48 hours. Don't judge results—just notice what changes.
      </p>

      <div className="space-y-6">
        {userExperiments.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  {exp.icon}
                </div>
                <h3 className="text-xl font-bold">Experiment {index + 1}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm font-semibold text-purple-400 mb-2">SITUATION</div>
                <p className="text-slate-200 text-lg">{exp.situation}</p>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-400 mb-2">WHAT TO DO</div>
                <p className="text-slate-200 text-lg">{exp.action}</p>
              </div>

              <div>
                <div className="text-sm font-semibold text-green-400 mb-2">WHAT TO NOTICE</div>
                <p className="text-slate-300">{exp.notice}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-500/30">
        <div className="flex items-start gap-4">
          <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2 text-yellow-400">Critical Point</h3>
            <p className="text-slate-300 text-lg">
              These aren't about succeeding. They're about gathering data. 
              You're testing what changes when you adjust one variable. 
              <span className="text-white font-semibold"> Notice. Don't judge.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReflectionStep({ onNext }) {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitted(true);
    // Simulate API call
    try {
      await fetch('https://backend.com/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection, timestamp: new Date() })
      });
    } catch (error) {
      console.log('Reflection saved locally');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-8"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6">
          <Brain className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <h2 className="text-5xl font-bold text-center mb-6">Final Reflection</h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        One question. Your answer matters more than you think.
      </p>

      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-purple-400">
          After you run your experiments, come back and answer:
        </h3>
        
        <p className="text-xl text-slate-200 mb-6">
          "What changed in the other person when you adjusted your pattern?"
        </p>

        {!submitted ? (
          <div className="space-y-4">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write what you noticed. Not what you hoped would happen—what actually changed in them."
              className="w-full h-40 bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
            
            <button
              onClick={handleSubmit}
              disabled={reflection.trim().length < 20}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                reflection.trim().length < 20
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              Submit Reflection
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900/30 rounded-xl p-6 border border-green-500/30"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 text-center font-semibold text-xl mb-2">Reflection Saved</p>
            <p className="text-slate-300 text-center">
              Come back to this after your experiments. Pattern recognition is the skill.
            </p>
          </motion.div>
        )}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-8">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Eye className="w-8 h-8 text-blue-400" />
          Why This Matters
        </h3>
        <p className="text-slate-300 text-lg leading-relaxed mb-4">
          Most people focus on what they said. You need to focus on what happened in response.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          When you start noticing patterns in how others react to your adjustments, 
          you stop needing scripts. <span className="text-purple-400 font-semibold">You start responding to the moment.</span>
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-8 border border-blue-500/30 text-center">
        <h3 className="text-3xl font-bold mb-4">You're Done With Theory</h3>
        <p className="text-xl text-slate-300 mb-6">
          You know exactly what you're doing wrong, why it happens, and what to try next.
        </p>
        <p className="text-lg text-slate-400 mb-8">
          The only thing left is action. Go test your experiments. Come back with data.
        </p>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all shadow-lg"
        >
          Complete Module
        </button>
      </div>
    </div>
  );
}
// ============================================================================
// NEW INTERACTIVE COMPONENTS - ADDED TO ENHANCE MODULE
// ============================================================================


function ToneDeepDiveStep({ onNext }) {
  const [activeExample, setActiveExample] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(50);

  const toneExamples = [
    {
      id: 0,
      scenario: "Friend shares exciting news about a promotion",
      wrong: { text: "Oh cool, nice.", energy: 15, label: "Flat & dismissive" },
      right: { text: "That's AWESOME! Tell me how it happened — I want every detail.", energy: 80, label: "Matched & engaged" },
      rule: "Match their energy first. They're at 80%. Coming in at 15% signals you don't care.",
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: 1,
      scenario: "Colleague venting about a frustrating project",
      wrong: { text: "Oh it'll be fine! Look on the bright side!", energy: 75, label: "Toxic positivity" },
      right: { text: "That sounds genuinely exhausting. What's the worst part right now?", energy: 35, label: "Calm & grounded" },
      rule: "Toxic positivity invalidates. They need someone in the trench with them, not cheerleading from outside.",
      color: "from-orange-600 to-red-600"
    },
    {
      id: 2,
      scenario: "Someone makes a dry, deadpan joke",
      wrong: { text: "Haha! Oh my god that's hilarious!!", energy: 90, label: "Over-performed" },
      right: { text: "...okay that was genuinely good.", energy: 45, label: "Dry match — earns respect" },
      rule: "Over-laughing at dry humor breaks the spell. Match the register. Subtle appreciation beats forced reaction.",
      color: "from-purple-600 to-pink-600"
    }
  ];

  const energyRules = [
    { range: "0–30%", label: "Somber / Serious", desc: "Grief, deep venting, heavy news. Go quiet and present.", color: "bg-blue-900/40 border-blue-500/40" },
    { range: "30–50%", label: "Calm / Grounded", desc: "Processing, reflecting, casual sharing. Stay level.", color: "bg-cyan-900/40 border-cyan-500/40" },
    { range: "50–70%", label: "Engaged / Warm", desc: "Normal conversation. This is your default zone.", color: "bg-green-900/40 border-green-500/40" },
    { range: "70–90%", label: "Excited / Animated", desc: "Good news, wins, enthusiasm. Match and amplify slightly.", color: "bg-yellow-900/40 border-yellow-500/40" },
    { range: "90–100%", label: "Hyped / Celebratory", desc: "Rare. Big wins. Don't fake it — just be present.", color: "bg-orange-900/40 border-orange-500/40" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 mb-6">
          <Volume2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-5xl font-bold mb-4">Tone Mastery</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Energy matching is the most invisible skill in conversation. Get it wrong and nothing else matters.
        </p>
      </div>

      {/* Core Principle */}
      <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-2xl p-8 border border-blue-500/30 mb-10">
        <div className="flex items-start gap-5">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 flex-shrink-0">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-blue-400">The Core Rule</h3>
            <p className="text-xl text-slate-200 leading-relaxed mb-3">
              Read their energy first. Then land within <span className="text-blue-400 font-bold">±20%</span> of it.
            </p>
            <p className="text-slate-300 leading-relaxed">
              You don't need to match exactly — that feels fake. You need to be close enough that they feel met. Too high and you seem manic. Too low and you seem disengaged. The gap is what breaks connection.
            </p>
          </div>
        </div>
      </div>

      {/* Energy Scale Reference */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-6">Energy Scale Reference</h3>
        <div className="space-y-3">
          {energyRules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-5 border ${rule.color} flex items-center gap-6`}
            >
              <div className="text-xl font-bold text-white w-24 flex-shrink-0">{rule.range}</div>
              <div className="flex-1">
                <div className="font-bold text-white mb-1">{rule.label}</div>
                <div className="text-slate-300 text-sm">{rule.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Examples */}
      <h3 className="text-2xl font-bold mb-6">Tap a scenario to see the difference</h3>
      <div className="space-y-4 mb-10">
        {toneExamples.map((ex) => (
          <motion.div key={ex.id} layout className="rounded-2xl overflow-hidden border border-slate-700/50">
            <button
              onClick={() => setActiveExample(activeExample === ex.id ? null : ex.id)}
              className="w-full text-left bg-slate-800/50 hover:bg-slate-800 p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-200">{ex.scenario}</p>
                <motion.div
                  animate={{ rotate: activeExample === ex.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-6 h-6 text-slate-400" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {activeExample === ex.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 bg-slate-800/30 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <X className="w-5 h-5 text-red-400" />
                          <span className="font-semibold text-red-400">{ex.wrong.label}</span>
                          <span className="ml-auto text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded-full">{ex.wrong.energy}% energy</span>
                        </div>
                        <p className="text-slate-300 italic">"{ex.wrong.text}"</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-green-400">{ex.right.label}</span>
                          <span className="ml-auto text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full">{ex.right.energy}% energy</span>
                        </div>
                        <p className="text-slate-300 italic">"{ex.right.text}"</p>
                      </div>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-200">{ex.rule}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Three Tone Traps */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-8 border border-red-500/30">
        <h3 className="text-2xl font-bold mb-6 text-red-400">The 3 Tone Traps</h3>
        <div className="space-y-4">
          {[
            { trap: "Flat affect", sign: "You sound the same whether they share good news or bad news.", fix: "Consciously shift your voice speed and volume to match the moment." },
            { trap: "Nervous overcorrection", sign: "You laugh too loud, agree too fast, perform enthusiasm you don't feel.", fix: "Do less. A calm, present response lands harder than manufactured energy." },
            { trap: "Misread context", sign: "You bring casual energy to a heavy topic or serious energy to light banter.", fix: "Read the first 10 seconds. Let their opening line tell you the register." }
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/40">
              <div className="font-bold text-orange-400 mb-1">{item.trap}</div>
              <div className="text-sm text-slate-400 mb-2"><span className="text-slate-500">Sign: </span>{item.sign}</div>
              <div className="text-sm text-slate-300"><span className="text-green-400 font-semibold">Fix: </span>{item.fix}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function AttentionDeepDiveStep({ onNext }) {
  const [revealedTip, setRevealedTip] = useState(null);

  const attentionKillers = [
    { killer: "Front-loading context", example: "So I was at work, it was a Tuesday, and my manager — you know the one I mentioned last week — anyway we had this meeting and...", problem: "They're gone by sentence two.", fix: "Lead with the hook. Start with the most interesting part, then fill in context after they're invested." },
    { killer: "Hedging before every statement", example: "I mean, I don't know, it might just be me, but maybe...", problem: "Signals your idea isn't worth hearing before you've said it.", fix: "Just say the thing. Confidence isn't arrogance — it's respecting the listener's time." },
    { killer: "No payoff", example: "So I had the craziest day... [10 minute setup] ...and then I went home.", problem: "Anti-climax trains people to stop investing in your stories.", fix: "Know your punchline before you start. If there's no point, don't tell the story." },
    { killer: "Trailing off mid-thought", example: "And then I realized that maybe the whole thing was... I don't know.", problem: "It's conversational dead air. They don't know if you're done.", fix: "Finish your sentences. If you lose track, pause, then complete the thought." }
  ];

  const hookFormulas = [
    { name: "The Contrast Hook", template: "I used to think [X]. Then [event happened].", example: "I used to think I was a good listener. Then someone told me I'd never once asked a follow-up question." },
    { name: "The Specificity Hook", template: "Last [specific time], [specific thing] happened.", example: "Last Tuesday, I watched someone lose a job offer because of one sentence." },
    { name: "The Stakes Hook", template: "This changed how I [think/act] about [thing].", example: "This changed how I handle every first conversation with someone new." },
    { name: "The Confession Hook", template: "I was wrong about [thing] for [time period].", example: "I was wrong about what makes people want to talk to you for about 10 years." }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6">
          <Eye className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-5xl font-bold mb-4">Attention Command</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          People decide whether to pay attention in the first 8 seconds. Here's how to win those seconds.
        </p>
      </div>

      {/* Core Insight */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-500/30 mb-10">
        <div className="flex items-start gap-5">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 flex-shrink-0">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-purple-400">The Attention Truth</h3>
            <p className="text-xl text-slate-200 leading-relaxed mb-3">
              Attention isn't taken. It's <span className="text-purple-400 font-bold">earned in the opening</span> and <span className="text-purple-400 font-bold">maintained through payoff</span>.
            </p>
            <p className="text-slate-300 leading-relaxed">
              You don't need to be louder, funnier, or more charismatic. You need to signal that what you're about to say is worth the listen — and then deliver. The rest is just execution.
            </p>
          </div>
        </div>
      </div>

      {/* Attention Killers */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-2">The 4 Attention Killers</h3>
        <p className="text-slate-400 mb-6">Tap each one to see the fix.</p>
        <div className="space-y-3">
          {attentionKillers.map((item, i) => (
            <motion.div key={i} layout className="rounded-2xl overflow-hidden border border-slate-700/50">
              <button
                onClick={() => setRevealedTip(revealedTip === i ? null : i)}
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 p-6 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">{i + 1}</div>
                    <span className="text-lg font-semibold text-slate-200">{item.killer}</span>
                  </div>
                  <motion.div animate={{ rotate: revealedTip === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence>
                {revealedTip === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 bg-slate-800/30 space-y-3">
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/40">
                        <div className="text-xs font-semibold text-slate-500 mb-2">SOUNDS LIKE</div>
                        <p className="text-slate-300 italic text-sm">"{item.example}"</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                          <div className="text-xs font-semibold text-red-400 mb-1">WHY IT FAILS</div>
                          <p className="text-slate-300 text-sm">{item.problem}</p>
                        </div>
                        <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                          <div className="text-xs font-semibold text-green-400 mb-1">THE FIX</div>
                          <p className="text-slate-300 text-sm">{item.fix}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hook Formulas */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-2">4 Hook Formulas That Work</h3>
        <p className="text-slate-400 mb-6">Use these to open any story or topic and earn immediate attention.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {hookFormulas.map((formula, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="text-purple-400 font-bold text-sm mb-2">{formula.name}</div>
              <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border border-slate-700/40">
                <p className="text-slate-300 text-sm font-mono">{formula.template}</p>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/20">
                <div className="text-xs font-semibold text-green-400 mb-1">EXAMPLE</div>
                <p className="text-slate-300 text-sm italic">"{formula.example}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The 8-Second Rule */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-8 border border-yellow-500/30">
        <div className="flex items-start gap-5">
          <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-3 text-yellow-400">The 8-Second Rule</h3>
            <p className="text-slate-200 leading-relaxed mb-3">
              When you start talking, the listener is running a silent calculation: <em>"Is this worth my attention?"</em> You have roughly 8 seconds to answer yes.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Not with a performance. With a signal — something specific, unexpected, or emotionally relevant. If your first sentence could come from anyone, they'll treat it like it came from no one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




function ListeningDeepDiveStep({ onNext }) {
  const [activeTab, setActiveTab] = useState('mistakes');

  const listeningMistakes = [
    { mistake: "Planning your response while they're still talking", impact: "You catch the words but miss the meaning. They can feel the gap.", fix: "Stay with their last sentence. Your response will come — trust it." },
    { mistake: "Asking a new question instead of following up", impact: "Signals you're collecting information, not understanding them.", fix: "Reflect back one thing they said before asking anything new." },
    { mistake: "Finishing their sentences", impact: "You're telling them what they think instead of letting them tell you.", fix: "Pause after they stop. Let the silence invite more." },
    { mistake: "Waiting for the 'important part'", impact: "You decide what matters before hearing it all. You'll miss the real point.", fix: "Treat every sentence as potentially the most important one." }
  ];

  const listeningTechniques = [
    {
      name: "The Echo",
      howto: "Repeat the last 2–3 words of what they said with a slight rise in tone.",
      example: { them: "I don't know, it's been a really hard month.", you: "A really hard month?" },
      why: "Invites them to keep going. Feels like genuine curiosity, not interrogation."
    },
    {
      name: "The Label",
      howto: "Name what you're sensing. Start with 'It sounds like...' or 'It seems like...'",
      example: { them: "I just feel like nothing I do at work actually matters.", you: "It sounds like you're feeling invisible there." },
      why: "Naming an emotion makes people feel deeply heard. Don't guess — observe."
    },
    {
      name: "The Pause",
      howto: "After they finish speaking, wait 2–3 full seconds before responding.",
      example: { them: "I just... I don't know what I want anymore.", you: "[2 second pause] What does that feel like to sit with?" },
      why: "The pause signals that you're processing, not just waiting to talk. It makes space for them to add more."
    },
    {
      name: "The Specific Callback",
      howto: "Reference something specific they said earlier in the conversation.",
      example: { them: "You mentioned your sister earlier — is that part of why this feels harder?", you: "" },
      why: "Proves you were actually listening. Nothing builds rapport faster than specific memory."
    }
  ];

  const listenLevels = [
    { level: 1, name: "Passive Hearing", desc: "You hear sounds. You're mostly in your head.", color: "bg-red-900/30 border-red-500/30", text: "text-red-400" },
    { level: 2, name: "Surface Listening", desc: "You follow the content but miss the emotion.", color: "bg-orange-900/30 border-orange-500/30", text: "text-orange-400" },
    { level: 3, name: "Active Listening", desc: "You hear content + emotion. You respond to both.", color: "bg-yellow-900/30 border-yellow-500/30", text: "text-yellow-400" },
    { level: 4, name: "Deep Listening", desc: "You hear what they're not saying. The gap between words.", color: "bg-green-900/30 border-green-500/30", text: "text-green-400" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 mb-6">
          <Smile className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-5xl font-bold mb-4">Active Listening</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Most people are just waiting to talk. Here's how to actually listen — and make people feel it.
        </p>
      </div>

      {/* Listening Levels */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-6">The 4 Levels of Listening</h3>
        <div className="space-y-3">
          {listenLevels.map((lvl, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-5 border ${lvl.color} flex items-center gap-5`}
            >
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xl flex-shrink-0 ${lvl.text} border-current`}>
                {lvl.level}
              </div>
              <div>
                <div className={`font-bold text-lg ${lvl.text}`}>{lvl.name}</div>
                <div className="text-slate-300">{lvl.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-slate-400 text-sm mt-4 text-center">Most people operate at Level 2. Level 3 makes you memorable. Level 4 makes you irreplaceable.</p>
      </div>

      {/* Tab Switcher */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setActiveTab('mistakes')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activeTab === 'mistakes' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
        >
          Common Mistakes
        </button>
        <button
          onClick={() => setActiveTab('techniques')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activeTab === 'techniques' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
        >
          Techniques
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'mistakes' && (
          <motion.div key="mistakes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="space-y-4">
              {listeningMistakes.map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-200 text-lg mb-3">{item.mistake}</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                          <div className="text-xs font-semibold text-red-400 mb-1">IMPACT</div>
                          <p className="text-slate-300 text-sm">{item.impact}</p>
                        </div>
                        <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                          <div className="text-xs font-semibold text-green-400 mb-1">FIX</div>
                          <p className="text-slate-300 text-sm">{item.fix}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'techniques' && (
          <motion.div key="techniques" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="space-y-6">
              {listeningTechniques.map((tech, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50">
                  <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 px-6 py-4 border-b border-slate-700/50">
                    <h4 className="text-xl font-bold text-green-400">{tech.name}</h4>
                    <p className="text-slate-300 text-sm mt-1">{tech.howto}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/40">
                      <div className="text-xs font-semibold text-slate-500 mb-3">IN PRACTICE</div>
                      <div className="space-y-2">
                        {tech.example.them && <div className="flex items-start gap-3"><span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded font-semibold flex-shrink-0 mt-0.5">THEM</span><p className="text-slate-300 italic">"{tech.example.them}"</p></div>}
                        {tech.example.you && <div className="flex items-start gap-3"><span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded font-semibold flex-shrink-0 mt-0.5">YOU</span><p className="text-slate-300 italic">"{tech.example.you}"</p></div>}
                      </div>
                    </div>
                    <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-200 text-sm">{tech.why}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function KindnessDeepDiveStep({ onNext }) {
  const [flippedCard, setFlippedCard] = useState(null);

  const kindnessLevels = [
    { level: "Polite", desc: "You don't hurt people. But you don't reach them either.", example: "Fine. Good. Thanks.", color: "from-slate-700 to-slate-600" },
    { level: "Warm", desc: "You acknowledge what they said. People feel noticed.", example: "That sounds tough. What happened?", color: "from-blue-700 to-cyan-700" },
    { level: "Generous", desc: "You respond to what they meant, not just what they said.", example: "It sounds like you're exhausted. Not just from this — from all of it.", color: "from-purple-700 to-pink-700" },
    { level: "Deep", desc: "You make them feel completely seen. Rare. Remembered.", example: "You said something similar last month. I wonder if this is the same pattern.", color: "from-green-700 to-emerald-700" }
  ];

  const scenarios = [
    {
      situation: "They say: 'I'm fine, just tired.'",
      literal: "Oh okay, yeah rest up.",
      generous: "Tired like physically drained or that 'I'm done with everything' tired?",
      why: "'I'm fine' almost never means fine. The generous response opens a door. They'll walk through it if they want to.",
      icon: <Brain className="w-5 h-5" />
    },
    {
      situation: "They share a win: 'I got the promotion.'",
      literal: "Oh nice, congrats.",
      generous: "That's huge. You've been working toward that for a while — how does it actually feel?",
      why: "People expect flat congratulations. Asking how it FEELS elevates you from polite to present.",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      situation: "They're venting about a person at work",
      literal: "Ugh, some people are just like that. Have you tried talking to HR?",
      generous: "That sounds exhausting. What's the worst part — the situation itself or feeling like no one's in your corner?",
      why: "Solutions land as dismissals when feelings aren't first. Hold the space before offering anything.",
      icon: <Users className="w-5 h-5" />
    },
    {
      situation: "They say: 'I don't know, maybe I'm overthinking it.'",
      literal: "Yeah you probably are. Don't stress.",
      generous: "Or maybe your gut is picking up on something real. What's the actual thing you're worried about?",
      why: "Validating second-guessing shuts them down. Taking their instinct seriously opens them up.",
      icon: <Eye className="w-5 h-5" />
    }
  ];

  const kindnessMisconceptions = [
    { myth: "Kindness means agreeing with everything", truth: "Agreeing when you don't means nothing. Kindness is honest care." },
    { myth: "Kindness means fixing their problems", truth: "Fixing without permission is control. Ask: 'Do you want advice or just to vent?'" },
    { myth: "Kindness is always soft and gentle", truth: "Sometimes the kindest thing is direct honesty delivered with warmth." },
    { myth: "You have to be in a good mood to be kind", truth: "Kindness is a behavior, not a feeling. You can choose it regardless of state." }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 mb-6">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-5xl font-bold mb-4">Authentic Kindness</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Kindness isn't niceness. It's making people feel genuinely seen. Most people never do this.
        </p>
      </div>

      {/* Core Distinction */}
      <div className="bg-gradient-to-r from-pink-900/40 to-red-900/40 rounded-2xl p-8 border border-pink-500/30 mb-10">
        <div className="flex items-start gap-5">
          <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 flex-shrink-0">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-pink-400">Polite vs. Kind</h3>
            <p className="text-xl text-slate-200 leading-relaxed mb-3">
              Polite people don't hurt you. <span className="text-pink-400 font-bold">Kind people make you feel less alone.</span>
            </p>
            <p className="text-slate-300 leading-relaxed">
              Most people are polite. It's easy and automatic. Kindness takes attention — you have to notice what someone actually needs in the moment, then respond to that instead of to your own comfort.
            </p>
          </div>
        </div>
      </div>

      {/* Kindness Levels */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-6">The 4 Levels of Kindness</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {kindnessLevels.map((lvl, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 bg-gradient-to-br ${lvl.color} border border-white/10`}
            >
              <div className="text-2xl font-bold mb-2">{lvl.level}</div>
              <p className="text-white/90 mb-3">{lvl.desc}</p>
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-xs font-semibold text-white/60 mb-1">SOUNDS LIKE</div>
                <p className="text-white italic text-sm">"{lvl.example}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Literal vs Generous */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-2">Literal vs. Generous Responses</h3>
        <p className="text-slate-400 mb-6">The difference between being heard and being truly understood.</p>
        <div className="space-y-4">
          {scenarios.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
            >
              <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
                <div className="text-purple-400">{s.icon}</div>
                <p className="font-semibold text-slate-200">{s.situation}</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                    <div className="text-xs font-semibold text-red-400 mb-2">LITERAL RESPONSE</div>
                    <p className="text-slate-300 italic">"{s.literal}"</p>
                  </div>
                  <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                    <div className="text-xs font-semibold text-green-400 mb-2">GENEROUS RESPONSE</div>
                    <p className="text-slate-300 italic">"{s.generous}"</p>
                  </div>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-200 text-sm">{s.why}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Misconceptions */}
      <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-2xl p-8 border border-slate-600/40">
        <h3 className="text-2xl font-bold mb-6">Kindness Myths — Busted</h3>
        <div className="space-y-4">
          {kindnessMisconceptions.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-slate-400 line-through text-sm mb-1">{item.myth}</p>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-sm">{item.truth}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchingGameStep({ onNext }) {
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const problems = [
    {
      id: 1,
      problem: "Person shares exciting news, you respond with flat 'cool' while checking phone",
      correctAnswer: "Tone",
      explanation: "Energy mismatch. Your 20% energy doesn't match their 80% enthusiasm."
    },
    {
      id: 2,
      problem: "Planning your response while they're still talking",
      correctAnswer: "Listening",
      explanation: "You're in your head instead of present with them."
    },
    {
      id: 3,
      problem: "Starting stories with 5 minutes of context before the hook",
      correctAnswer: "Attention",
      explanation: "You're losing them before getting to the point."
    },
    {
      id: 4,
      problem: "Jumping to solutions when someone vents",
      correctAnswer: "Kindness",
      explanation: "Fixing before validating makes them feel unheard."
    }
  ];

  const components = ['Tone', 'Attention', 'Listening', 'Kindness'];

  const handleMatch = (problemId, component) => {
    setMatches({ ...matches, [problemId]: component });
  };

  const checkAnswers = () => {
    let correct = 0;
    problems.forEach((problem) => {
      if (matches[problem.id] === problem.correctAnswer) correct++;
    });
    setScore(correct);
    setShowResults(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-6">
          <Boxes className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-5xl font-bold mb-4">Pattern Recognition Game</h2>
        <p className="text-xl text-slate-300">Match each problem to its TALK component</p>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {problems.map((problem) => (
            <div key={problem.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <p className="text-lg text-slate-200 mb-4">{problem.problem}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {components.map((component) => (
                  <button
                    key={component}
                    onClick={() => handleMatch(problem.id, component)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      matches[problem.id] === component
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {component}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={checkAnswers}
            disabled={Object.keys(matches).length < problems.length}
            className={`w-full py-4 rounded-xl font-bold text-lg ${
              Object.keys(matches).length < problems.length
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
            }`}
          >
            Check Answers
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-2">Score: {score} / {problems.length}</h3>
          <p className="text-xl text-slate-300 mb-6">
            {score === problems.length ? "Perfect! You're a pattern recognition master!" : "Good effort! Review the explanations below."}
          </p>
          {problems.map((problem) => (
            <div key={problem.id} className="bg-slate-900/50 rounded-xl p-6 mb-4 text-left">
              <p className="text-slate-200 mb-2">{problem.problem}</p>
              <p className="text-purple-400 font-bold">Correct: {problem.correctAnswer}</p>
              <p className="text-slate-400 text-sm mt-2">{problem.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScenarioPracticeStep({ onNext }) {
  const [selectedResponse, setSelectedResponse] = useState(null);

  const scenario = {
    context: "Friend tells you they're thinking about quitting their job to start a business.",
    responses: [
      {
        text: "That's crazy! Are you sure? What about your mortgage?",
        feedback: "You led with judgment. They'll close up now.",
        isGood: false
      },
      {
        text: "Wow, that's a big move. What's got you thinking about it?",
        feedback: "Perfect. You showed curiosity and created space.",
        isGood: true
      }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 mb-6">
          <PlayCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-5xl font-bold mb-4">Scenario Practice</h2>
        <p className="text-xl text-slate-300">Test your judgment in real situations</p>
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-8 border border-blue-500/30 mb-8">
        <h3 className="text-2xl font-bold mb-4">The Situation</h3>
        <p className="text-xl text-slate-200">{scenario.context}</p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-2xl font-bold">How do you respond?</h3>
        {scenario.responses.map((response, index) => (
          <button
            key={index}
            onClick={() => setSelectedResponse(index)}
            className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl p-6 transition-all"
          >
            <p className="text-lg text-slate-200 italic">"{response.text}"</p>
          </button>
        ))}
      </div>

      {selectedResponse !== null && (
        <div className={`rounded-2xl p-8 border-2 ${
          scenario.responses[selectedResponse].isGood
            ? 'bg-green-900/30 border-green-500'
            : 'bg-red-900/30 border-red-500'
        }`}>
          <h3 className="text-2xl font-bold mb-4">
            {scenario.responses[selectedResponse].isGood ? '✓ Great Choice!' : '✗ Not Ideal'}
          </h3>
          <p className="text-lg text-slate-300">{scenario.responses[selectedResponse].feedback}</p>
        </div>
      )}
    </div>
  );
}