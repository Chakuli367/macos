import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, ThumbsUp, MessageCircle, Zap, Heart, TrendingUp, Award, ChevronRight, CheckCircle, Star, Lightbulb, Users, Target, ArrowRight, Play, BookOpen, Brain, Laugh, Shield, Coffee, Send, Eye, Flame, Trophy, ArrowLeft, Check, X, RefreshCw, Timer, Edit3, Loader2 } from 'lucide-react';


interface Humorprops {
  onCompleteNavigator?: () => void; 
}

const Humor: React.FC<Humorprops> = ({ onCompleteNavigator }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [practiceInputs, setPracticeInputs] = useState<{[key: number]: string}>({});
  const [humorProfile, setHumorProfile] = useState({
    comfortLevel: '',
    naturalStyle: '',
    biggestFear: ''
  });
  const [dailyProgress, setDailyProgress] = useState<boolean[]>(Array(7).fill(false));
  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedFormula, setExpandedFormula] = useState<number | null>(null);
  const [creationExercises, setCreationExercises] = useState<{[key: number]: string}>({});
  const [observationInputs, setObservationInputs] = useState<string[]>(['', '', '']);
  const [notification, setNotification] = useState('');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  // 2. State to manage the user feedback/notification banner (e.g., "Correct!").
  // This state holds the message and is useful for functions like 'showNotification'.
  // You might need a separate boolean to control visibility (e.g., isNotificationVisible).
  const [notificationMessage, setNotificationMessage] = useState(null);
  
  // Optional but recommended: Tracks if the current scenario has been answered correctly.
  // This can be an array of booleans/objects if you need to remember the state across steps.
  

  const prevScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1);
      setNotificationMessage(null); // Clear notification on navigation
    }
  };

  const nextScenario = () => {
    if (currentScenarioIndex < totalScenarios - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setNotificationMessage(null); // Clear notification on navigation
    }
  };
  
  // Function to display the notification (used in option buttons)


  const totalSteps = 9;
  const progress = ((completedSteps.length) / totalSteps) * 100;

  // Notification helper
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Mark step as complete
  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
      showNotification('Step completed! 🎉');
    }
  };

  // Navigate steps
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    completeStep(currentStep);
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  // Confetti trigger
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Data structures
  const humorBenefits = [
    {
      icon: Brain,
      title: "Builds Instant Rapport",
      description: "Shared laughter creates immediate connection and trust",
      stat: "60% more likeable",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Diffuses Tension",
      description: "Turns awkward moments into memorable ones",
      stat: "3x easier conversations",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Makes You Memorable",
      description: "People remember how you made them feel",
      stat: "85% recall rate",
      color: "from-orange-500 to-red-500"
    }
  ];

  const humorTypes = [
    {
      id: 1,
      emoji: "🎭",
      title: "Self-Deprecating",
      description: "Laughing at yourself",
      when: "Breaking ice, showing humility",
      example: "I'm so bad with directions, I get lost in my own house",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      emoji: "👀",
      title: "Observational",
      description: "Pointing out funny everyday things",
      when: "Casual conversations",
      example: "Why do we park in driveways and drive on parkways?",
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: 3,
      emoji: "😏",
      title: "Playful Teasing",
      description: "Light, friendly jabs",
      when: "With friends, building rapport",
      example: "Oh, you're a morning person? We can't be friends (with a smile)",
      color: "from-green-600 to-emerald-600"
    },
    {
      id: 4,
      emoji: "🔄",
      title: "Callbacks",
      description: "Referencing earlier jokes",
      when: "Deepening connection",
      example: "Bringing back an inside joke from earlier",
      color: "from-orange-600 to-yellow-600"
    },
    {
      id: 5,
      emoji: "⚡",
      title: "Situational",
      description: "Finding humor in the moment",
      when: "Spontaneous opportunities",
      example: "Coffee spills → 'Well, that's one way to wake up'",
      color: "from-red-600 to-pink-600"
    }
  ];

  const goldenRules = [
    { rule: "Punch up, not down", description: "Make yourself the butt of jokes, not others", icon: "✅" },
    { rule: "Read the room", description: "Is this the right moment?", icon: "✅" },
    { rule: "Avoid: Politics, religion, appearance", description: "Keep it safe and inclusive", icon: "✅" },
    { rule: "Start small", description: "Test waters with mild humor", icon: "✅" },
    { rule: "Watch reactions", description: "Adjust if they're uncomfortable", icon: "✅" },
    { rule: "When in doubt, don't", description: "Better safe than sorry", icon: "✅" }
  ];

  const humorFormulas = [
    {
      id: 1,
      emoji: "🔀",
      title: "The Twist Formula",
      pattern: "Setup expectation → Subvert it",
      how: "Take normal situation → Add unexpected ending",
      example: {
        setup: "I'm on a seafood diet...",
        twist: "...I see food and I eat it"
      },
      practice: "I'm really good at sleeping...",
      answer: "...I can do it with my eyes closed"
    },
    {
      id: 2,
      emoji: "🔍",
      title: "Exaggeration Formula",
      pattern: "Take truth → Amplify to absurd level",
      how: '"So [adjective] that [impossible consequence]"',
      example: {
        setup: "My room is messy",
        twist: "My room is so messy, I found last year's Christmas presents"
      },
      practice: "I'm really tired today...",
      answer: "...I'm so tired I could sleep through a fire alarm"
    },
    {
      id: 3,
      emoji: "🎯",
      title: "Observational Pattern",
      pattern: "Notice everyday absurdity",
      how: '"Why do we..." or "Isn\'t it weird that..."',
      example: {
        setup: "Observation",
        twist: "Why do we say 'heads up' when we want you to duck?"
      },
      practice: "Look around - find ONE absurd thing",
      answer: "Why do we call it rush hour when nothing moves?"
    },
    {
      id: 4,
      emoji: "🪞",
      title: "Self-Awareness Formula",
      pattern: "Point out your own quirk lovingly",
      how: '"I\'m the type of person who..."',
      example: {
        setup: "Self-reflection",
        twist: "I'm the type who practices conversations in the shower"
      },
      practice: "What's something slightly embarrassing about you?",
      answer: "I have a PhD in overthinking minor social interactions"
    },
    {
      id: 5,
      emoji: "🔄",
      title: "The Callback Formula",
      pattern: "Reference earlier moment + add new twist",
      how: "Memory + 'speaking of which' + connection",
      example: {
        setup: "Earlier: Friend spilled coffee",
        twist: "Later: 'Should we get coffee? Or should coffee get YOU?' 😏"
      },
      practice: "Use something from earlier",
      answer: "Shows you're listening + creates inside jokes"
    }
  ];

  const scenarios = [
    {
      id: 1,
      title: "First Day at Work",
      situation: "You walk into the break room and spill coffee on your shirt",
      options: [
        { text: "Say nothing and leave awkwardly", correct: false, feedback: "Avoiding makes it more awkward" },
        { text: "Well, this is how I make a good first impression!", correct: true, feedback: "Perfect! Self-deprecating humor that acknowledges the moment" },
        { text: "Blame the coffee machine loudly", correct: false, feedback: "Deflecting doesn't build rapport" },
        { text: "Make a joke about someone else", correct: false, feedback: "Never punch down or redirect embarrassment" }
      ]
    },
    {
      id: 2,
      title: "Group Conversation",
      situation: "Someone mentions they're terrible at cooking",
      options: [
        { text: "I once burned water. Beat that!", correct: true, feedback: "Great! Playful one-upmanship builds connection" },
        { text: "Yeah, you probably shouldn't cook then", correct: false, feedback: "This sounds judgmental, not playful" },
        { text: "Change the subject", correct: false, feedback: "Missed opportunity to connect" },
        { text: "Just nod silently", correct: false, feedback: "Engagement creates relationships" }
      ]
    },
    {
      id: 3,
      title: "Awkward Silence",
      situation: "Elevator ride with colleague, awkward silence",
      options: [
        { text: "So... weather, huh?", correct: true, feedback: "Meta-humor! Acknowledging the cliché makes it funny" },
        { text: "Stare at phone", correct: false, feedback: "Missed connection opportunity" },
        { text: "Make political comment", correct: false, feedback: "Too risky for casual interactions" },
        { text: "This silence is deafening", correct: true, feedback: "Acknowledging awkwardness diffuses it!" }
      ]
    }
  ];

  const practicePrompts = [
    {
      id: 1,
      prompt: "You forgot someone's name at a party",
      placeholder: "What would you say?",
      suggestion: "I'm terrible with names, but I never forget a face... or in this case, a drink choice!"
    },
    {
      id: 2,
      prompt: "Friend teases you about being late (again)",
      placeholder: "Your playful comeback?",
      suggestion: "I'm not late, I'm just on island time... unfortunately we're not on an island"
    },
    {
      id: 3,
      prompt: "Someone mentions they love a TV show you've never heard of",
      placeholder: "How do you respond with humor?",
      suggestion: "I'm so behind on shows, I'm still catching up on the 90s"
    }
  ];

  const spotTheHumorScenarios = [
    {
      id: 1,
      title: "Work Meeting",
      situation: "Zoom call freezes on your weird face mid-sentence",
      question: "Where's the humor opportunity?",
      options: [
        { text: "In the technical failure", correct: false },
        { text: "In YOUR reaction to it", correct: true },
        { text: "In blaming Zoom", correct: false }
      ],
      lesson: "Humor lives in YOUR response, not the situation itself",
      example: "Well, at least you get to admire my best angle"
    },
    {
      id: 2,
      title: "Social Gathering",
      situation: "Everyone's talking about a TV show you haven't seen",
      question: "What's the humor angle?",
      highlight: "The contrast/your outsider status",
      formula: "Exaggeration",
      example: "I'm so behind on TV, I'm still waiting for the next season of Friends"
    },
    {
      id: 3,
      title: "Daily Life",
      situation: "You're bad at remembering names",
      question: "Where's the relatability?",
      highlight: "Universal experience",
      formula: "Self-awareness",
      example: "I'm terrible with names but great with faces... by great, I mean I'll recognize you but call you the wrong name"
    }
  ];

  const [scenarioStatus, setScenarioStatus] = useState(
    spotTheHumorScenarios.map(() => ({ 
      answered: false, 
      correct: false 
    }))
  );

  // --- Functions to manage state (to be called by your buttons) ---

  const totalScenarios = spotTheHumorScenarios.length;

  const dailyMissions = [
    "Use one self-deprecating comment today",
    "Make an observational comment about weather/traffic",
    "Playfully tease a friend (with a smile)",
    "Reference a callback from earlier conversation",
    "Find humor in a mistake you make",
    "Practice 'yes, and...' improv thinking",
    "Combine 2 humor types in one conversation"
  ];

  // RENDER FUNCTIONS FOR EACH STEP

  const renderStep0 = () => (
  <div className="space-y-6 md:space-y-8">
    <div className="text-center space-y-4 md:space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
        <Sparkles className="w-5 h-5 text-pink-300" /> {/* Icon color updated */}
        <span className="text-sm font-medium text-purple-200">Master Social Humor</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
        Unlock the Power of Humor
      </h1>
      
      <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
        Learn the science-backed skill that makes you 60% more likeable in just 5 minutes
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
      {/* Box 1 (Already purple/pink) */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl text-center">
        <div className="text-5xl mb-3">😰</div>
        <h3 className="font-bold text-white mb-2">Feel Awkward?</h3>
        <p className="text-sm text-purple-300">Conversations feel flat and forced</p>
      </div>

      {/* Box 2 updated from blue/cyan to indigo/violet */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-indigo-500/30 shadow-xl text-center">
        <div className="text-5xl mb-3">🤐</div>
        <h3 className="font-bold text-white mb-2">Unsure What to Say?</h3>
        <p className="text-sm text-indigo-300">Miss opportunities to connect</p>
      </div>

      {/* Box 3 updated from orange/red to pink/fuchsia */}
      <div className="bg-gradient-to-br from-pink-900/50 to-fuchsia-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-500/30 shadow-xl text-center">
        <div className="text-5xl mb-3">😶</div>
        <h3 className="font-bold text-white mb-2">Want to Stand Out?</h3>
        <p className="text-sm text-pink-300">Be memorable, not forgettable</p>
      </div>
    </div>

    {/* Learn To Box updated from green/emerald to indigo/purple */}
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-indigo-500/30 shadow-2xl text-center">
      <Zap className="w-16 h-16 text-pink-400 mx-auto mb-4" /> {/* Icon color updated */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">You'll Learn To:</h2>
      <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" /> {/* Check color updated */}
          <div>
            <p className="text-white font-semibold">Create humor from scratch</p>
            <p className="text-sm text-indigo-300">Using proven formulas</p> {/* Text color updated */}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" /> {/* Check color updated */}
          <div>
            <p className="text-white font-semibold">Read situations instantly</p>
            <p className="text-sm text-indigo-300">Know when & what to say</p> {/* Text color updated */}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" /> {/* Check color updated */}
          <div>
            <p className="text-white font-semibold">Build genuine connections</p>
            <p className="text-sm text-indigo-300">Through authentic humor</p> {/* Text color updated */}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" /> {/* Check color updated */}
          <div>
            <p className="text-white font-semibold">Practice risk-free</p>
            <p className="text-sm text-indigo-300">With real scenarios</p> {/* Text color updated */}
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={nextStep}
      // Button KEPT BRIGHT PINK/PURPLE
      className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group text-white"
    >
      Let's Begin
      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const renderStep1 = () => (
  <div className="space-y-6 md:space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Why Humor Matters</h2>
      <p className="text-lg text-purple-300">The science behind social connection</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {humorBenefits.map((benefit, idx) => (
        <div
          key={idx}
          // Dynamic color kept, but border and base colors are purple
          className={`bg-gradient-to-br ${benefit.color}/20 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl hover:scale-105 transition-transform cursor-pointer`}
          onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
        >
          <benefit.icon className="w-12 h-12 md:w-16 md:h-16 text-pink-400 mb-4" /> {/* Icon color updated */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{benefit.title}</h3>
          <p className="text-purple-200 mb-4">{benefit.description}</p>
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/20">
            <p className="text-2xl font-bold text-white">{benefit.stat}</p>
          </div>
          {selectedCard === idx && (
            <div className="mt-4 p-4 bg-purple-950/50 rounded-xl border border-purple-500/30">
              <p className="text-sm text-purple-200">
                {idx === 0 && "Research shows people who use appropriate humor are perceived as more confident, intelligent, and trustworthy."}
                {idx === 1 && "Humor releases tension by creating a shared positive experience, making difficult conversations easier."}
                {idx === 2 && "People remember emotional moments. Laughter creates positive associations with YOU."}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Neuroscience Box updated to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-8 h-8 text-pink-400" /> {/* Icon color updated */}
        <h3 className="text-xl md:text-2xl font-bold text-white">The Neuroscience</h3>
      </div>
      <p className="text-purple-200 leading-relaxed">
        When we laugh with someone, our brains release oxytocin (the bonding hormone) and dopamine (the reward chemical). 
        This creates a neurological association between that person and positive feelings, making us naturally want to spend more time with them.
      </p>
    </div>

    <button
      onClick={nextStep}
      // Button KEPT BRIGHT PINK/PURPLE
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
    >
      Next: Learn Humor Types
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

const renderStep2 = () => (
  <div className="space-y-6 md:space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Your Humor Arsenal</h2>
      <p className="text-lg text-purple-300">5 styles you can use anywhere</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {humorTypes.map((type) => (
        <div
          key={type.id}
          // Dynamic color kept, but border and base colors are purple
          className={`bg-gradient-to-br ${type.color}/20 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl hover:scale-105 transition-all cursor-pointer`}
          onClick={() => setSelectedCard(selectedCard === type.id ? null : type.id)}
        >
          <div className="text-5xl mb-3">{type.emoji}</div>
          <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
          <p className="text-sm text-purple-300 mb-2">{type.description}</p>
          <div className="inline-block px-3 py-1 bg-purple-800/50 rounded-full border border-purple-600/30 mb-3">
            <p className="text-xs text-purple-200">When: {type.when}</p>
          </div>
          {selectedCard === type.id && (
            <div className="mt-4 p-4 bg-purple-950/50 rounded-xl border border-purple-500/30">
              <p className="text-sm font-semibold text-purple-100 mb-2">Example:</p>
              <p className="text-sm text-purple-200 italic">"{type.example}"</p>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Pro Tip Box updated from blue/cyan to indigo/violet */}
    <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl">
      <Lightbulb className="w-8 h-8 text-pink-400 mb-4" /> {/* Icon color updated */}
      <h3 className="text-xl font-bold text-white mb-3">Pro Tip</h3>
      <p className="text-indigo-200">
        Start with self-deprecating and observational humor—they're the safest and most universally appreciated. 
        Once you're comfortable, add playful teasing with close friends.
      </p>
    </div>

    <button
      onClick={nextStep}
      // Button KEPT BRIGHT PINK/PURPLE
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
    >
      Next: The Golden Rules
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

const renderStep3 = () => (
  <div className="space-y-6 md:space-y-8">
    <div className="text-center mb-8">
      <Shield className="w-16 h-16 text-pink-400 mx-auto mb-4" /> {/* Icon color updated */}
      <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">The Golden Rules</h2>
      <p className="text-lg text-purple-300">Stay safe, kind, and effective</p>
    </div>

    <div className="space-y-4">
      {goldenRules.map((rule, idx) => (
        <div
          key={idx}
          // Rule Boxes updated to purple/indigo
          className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-purple-500/30 shadow-xl hover:border-purple-400/50 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl text-pink-400">{rule.icon}</div> {/* Icon color added */}
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">{rule.rule}</h3>
              <p className="text-purple-300">{rule.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Never Joke About Box updated from red/orange to red/fuchsia (to keep red for negative) */}
    <div className="bg-gradient-to-br from-red-900/30 to-fuchsia-900/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-red-500/30 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <X className="w-8 h-8 text-red-400" />
        <h3 className="text-xl font-bold text-white">Never Joke About:</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {['Politics', 'Religion', 'Physical appearance', 'Sensitive topics', 'Others\' insecurities', 'Recent tragedies'].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-red-300">
            <X className="w-4 h-4" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Safe Zones Box updated from green/emerald to indigo/violet */}
    <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-8 h-8 text-pink-400" /> {/* Icon color updated */}
        <h3 className="text-xl font-bold text-white">Safe Zones:</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {['Your own mistakes', 'Universal experiences', 'Everyday observations', 'Pop culture (neutral)', 'Weather & traffic', 'Shared situations'].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-indigo-300">
            <CheckCircle className="w-4 h-4" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={nextStep}
      // Button KEPT BRIGHT PINK/PURPLE
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
    >
      Next: Learn to CREATE Humor
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

const renderStep4 = () => (
  <div className="space-y-6 md:space-y-8">
    <div className="text-center mb-8">
      {/* Mini badge updated from yellow to pink */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-800/40 backdrop-blur-sm rounded-full border border-pink-500/30 mb-4">
        <Zap className="w-5 h-5 text-pink-300" />
        <span className="text-sm font-medium text-pink-200">Master Skill</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">The Humor Formula</h2>
      <p className="text-lg text-purple-300">Learn to CREATE humor from scratch</p>
    </div>

    {/* Part A: The 5 Formulas */}
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-pink-400" />
        The 5 Humor Formfgfs
      </h3>

      {humorFormulas.map((formula) => (
        <div
          key={formula.id}
          // Formula Boxes updated to purple/indigo
          className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-xl overflow-hidden"
        >
          <button
            onClick={() => setExpandedFormula(expandedFormula === formula.id ? null : formula.id)}
            className="w-full p-6 text-left hover:bg-purple-800/20 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{formula.emoji}</span>
              <div>
                <h4 className="text-xl font-bold text-white">{formula.title}</h4>
                <p className="text-sm text-purple-300">{formula.pattern}</p>
              </div>
            </div>
            {expandedFormula === formula.id ? (
              <ChevronRight className="w-6 h-6 text-pink-400 rotate-90 transition-transform" /> 
            ) : (
              <ChevronRight className="w-6 h-6 text-pink-400" /> 
            )}
          </button>

          {expandedFormula === formula.id && (
            <div className="px-6 pb-6 space-y-4">
              <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
                <p className="text-sm text-purple-300 mb-2">How it works:</p>
                <p className="text-white font-medium">{formula.how}</p>
              </div>

              <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-700/30">
                <p className="text-sm text-indigo-300 mb-2">Example:</p>
                <p className="text-white italic mb-1">"{formula.example.setup}"</p>
                <p className="text-pink-300 font-semibold">"{formula.example.twist}"</p>
              </div>

              <div className="p-4 bg-purple-900/30 rounded-xl border-2 border-purple-600/30">
                <p className="text-sm text-purple-300 mb-3">Your turn to practice:</p>
                <p className="text-white font-medium mb-3">{formula.practice}</p>
                <input
                  type="text"
                  value={creationExercises[formula.id] || ''}
                  onChange={(e) => setCreationExercises({...creationExercises, [formula.id]: e.target.value})}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-pink-400"
                />
                {creationExercises[formula.id] && creationExercises[formula.id].length > 5 && (
                  // Success Message kept green for positive feedback
                  <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-600/30">
                    <p className="text-sm text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Great! Here's a pro example:
                    </p>
                    <p className="text-white mt-2 italic">"{formula.answer}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Part B: Spot the Humor Opportunity */}

    <div className="mt-8 space-y-4">

      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">

        <Eye className="w-6 h-6 text-pink-400" /> {/* Icon color updated */}

        The Humor Detective

      </h3>

      <p className="text-purple-300 mb-6">Train your eye to spot opportunities in everyday moments</p>



      {spotTheHumorScenarios.map((scenario, idx) => (

        <div

          key={scenario.id}

          // Scenario Boxes updated from blue/cyan to indigo/violet

          className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-indigo-500/30 shadow-xl"

        >

          <div className="flex items-start gap-3 mb-4">

            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0"> {/* Number background updated */}

              <span className="text-white font-bold">{idx + 1}</span>

            </div>

            <div className="flex-1">

              <h4 className="text-xl font-bold text-white mb-2">{scenario.title}</h4>

              <p className="text-indigo-200 mb-3">{scenario.situation}</p>

              <p className="text-indigo-300 text-sm font-semibold mb-3">{scenario.question}</p>

             

              {scenario.options && (

                <div className="space-y-2 mb-4">

                  {scenario.options.map((option, optIdx) => (

                    <button

                      key={optIdx}

                      onClick={() => {

                        if (option.correct) {

                          showNotification('Correct! 🎉');

                        } else {

                          showNotification('Not quite. Try again!');

                        }

                      }}

                      className={`w-full p-3 text-left rounded-xl border-2 transition-all ${

                        option.correct

                          // Correct/Green updated to Green/Indigo

                          ? 'bg-green-900/30 border-green-500/30 hover:bg-green-900/50'

                          // Incorrect/Blue updated to Indigo/Violet

                          : 'bg-indigo-950/30 border-violet-700/30 hover:bg-indigo-900/40'

                      }`}

                    >

                      <span className="text-white">{option.text}</span>

                    </button>

                  ))}

                </div>

              )}



              <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-700/30">

                <p className="text-sm text-indigo-300 mb-2">💡 Lesson:</p>

                <p className="text-white font-medium mb-3">{scenario.lesson}</p>

                <p className="text-sm text-indigo-300 mb-1">Example response:</p>

                <p className="text-indigo-200 italic">"{scenario.example}"</p>

              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

    {/* Part C: The Humor Gym */}
    <div className="mt-8 space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-6 h-6 text-pink-400" /> {/* Icon color updated */}
        The Humor Gym
      </h3>
      <p className="text-purple-300 mb-6">Build your own jokes using the formulas</p>

      {/* Observational Challenge Box updated from orange/red to pink/fuchsia */}
      <div className="bg-gradient-to-br from-pink-900/50 to-fuchsia-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-pink-500/30 shadow-xl">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-pink-400" /> {/* Icon color updated */}
          Observational Challenge
        </h4>
        <p className="text-pink-200 mb-4">Look around right now. Find 3 funny observations about everyday life:</p>
        
        <div className="space-y-3">
          {[0, 1, 2].map((idx) => (
            <div key={idx}>
              <input
                type="text"
                value={observationInputs[idx]}
                onChange={(e) => {
                  const newInputs = [...observationInputs];
                  newInputs[idx] = e.target.value;
                  setObservationInputs(newInputs);
                }}
                placeholder={`Observation ${idx + 1}: Why do we... / Isn't it weird that...`}
                // Input styling updated to pink/fuchsia
                className="w-full px-4 py-3 bg-pink-950/50 border-2 border-pink-500/30 rounded-xl text-white placeholder-pink-400 focus:outline-none focus:border-pink-400"
              />
            </div>
          ))}
        </div>

        {observationInputs.filter(i => i.length > 10).length === 3 && (
          // Success Message kept green for positive feedback
          <div className="mt-4 p-4 bg-green-900/30 rounded-xl border border-green-600/30">
            <p className="text-green-300 flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" />
              Excellent! You're thinking like a comedian!
            </p>
            <p className="text-sm text-green-200">Pro examples:</p>
            <ul className="text-sm text-green-200 mt-2 space-y-1">
              <li>• "Why do we call it 'rush hour' when nothing moves?"</li>
              <li>• "Isn't it weird that we say 'sleep like a baby' when babies wake up every 2 hours?"</li>
              <li>• "Why do we press harder on the remote when we know the batteries are dead?"</li>
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* Part D: Quick Reference Toolkit */}
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-pink-400" />
        Humor Toolkit - Quick Starters
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* All Toolkit sections updated to purple base */}
        <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
          <h4 className="font-bold text-purple-200 mb-3">Self-Deprecating:</h4>
          <ul className="space-y-2 text-sm text-purple-300">
            <li>• "I'm so [adjective] that..."</li>
            <li>• "My talent for [X] is impressive... impressively bad"</li>
            <li>• "I have a black belt in [embarrassing thing]"</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
          <h4 className="font-bold text-pink-200 mb-3">Observational:</h4>
          <ul className="space-y-2 text-sm text-pink-300">
            <li>• "Isn't it weird that..."</li>
            <li>• "Why is it that whenever..."</li>
            <li>• "I love how we all pretend..."</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
          <h4 className="font-bold text-indigo-200 mb-3">Situational:</h4> {/* Text color updated */}
          <ul className="space-y-2 text-sm text-indigo-300"> {/* Text color updated */}
            <li>• "Well, that's one way to..."</li>
            <li>• "And that's why I'm not allowed to..."</li>
            <li>• "This is going exactly as planned... said no one ever"</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
          <h4 className="font-bold text-violet-200 mb-3">Playful Teasing:</h4> {/* Text color updated */}
          <ul className="space-y-2 text-sm text-violet-300"> {/* Text color updated */}
            <li>• "Oh, you're one of THOSE people who..."</li>
            <li>• "I see you're showing off your [skill] again"</li>
            <li>• "Let me guess, you're also..."</li>
          </ul>
        </div>
      </div>

      {/* Humor Check Box updated from yellow to pink */}
      <div className="mt-6 p-4 bg-pink-900/30 rounded-xl border border-pink-600/30">
        <h4 className="font-bold text-pink-200 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          The 3-Second Humor Check
        </h4>
        <div className="space-y-2 text-sm text-pink-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Does it feel authentic to YOU?</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Would you laugh if someone else said it?</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Is it kind? (Punch up, not down)</span>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={nextStep}
      // Button KEPT BRIGHT PINK/PURPLE
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
    >
      Next: Practice with Real Scenarios
      <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);


  const renderStep5 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Real Scenarios</h2>
        <p className="text-lg text-purple-300">Choose the best response - get instant feedback</p>
      </div>

      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-purple-200 mb-4">{scenario.situation}</p>
              </div>
            </div>

            <div className="space-y-3">
              {scenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuizAnswers({...quizAnswers, [scenario.id]: String.fromCharCode(65 + idx)});
                    if (option.correct) {
                      showNotification('✅ Correct!');
                    } else {
                      showNotification('❌ Try again!');
                    }
                  }}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    quizAnswers[scenario.id] === String.fromCharCode(65 + idx)
                      ? option.correct
                        ? 'bg-green-900/40 border-green-500/50'
                        : 'bg-red-900/40 border-red-500/50'
                      : 'bg-purple-950/30 border-purple-700/30 hover:bg-purple-900/40 hover:border-purple-600/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-purple-300">{String.fromCharCode(65 + idx)})</span>
                    <span className="text-white flex-1">{option.text}</span>
                    {quizAnswers[scenario.id] === String.fromCharCode(65 + idx) && (
                      option.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )
                    )}
                  </div>
                  {quizAnswers[scenario.id] === String.fromCharCode(65 + idx) && (
                    <div className={`mt-3 p-3 rounded-lg ${option.correct ? 'bg-green-950/50' : 'bg-red-950/50'}`}>
                      <p className={`text-sm ${option.correct ? 'text-green-300' : 'text-red-300'}`}>
                        {option.feedback}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-500/30">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Key Takeaway
        </h3>
        <p className="text-blue-200">
          Notice how the best responses acknowledge the situation with self-awareness or playfulness. 
          They don't ignore it or deflect blame. Owning the moment with humor builds instant connection.
        </p>
      </div>

      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        Next: Practice Lab
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Practice Lab</h2>
        <p className="text-lg text-purple-300">Create your own responses - get AI feedback</p>
      </div>

      <div className="space-y-6">
        {practicePrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <Edit3 className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{prompt.prompt}</h3>
                <textarea
                  value={practiceInputs[prompt.id] || ''}
                  onChange={(e) => setPracticeInputs({...practiceInputs, [prompt.id]: e.target.value})}
                  placeholder={prompt.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                />
                {practiceInputs[prompt.id] && practiceInputs[prompt.id].length > 10 && (
                  <div className="mt-4 p-4 bg-green-900/30 rounded-xl border border-green-600/30">
                    <p className="text-sm text-green-300 flex items-center gap-2 mb-2">
                      <ThumbsUp className="w-4 h-4" />
                      Great effort! Here's a pro suggestion:
                    </p>
                    <p className="text-white italic">"{prompt.suggestion}"</p>
                    <p className="text-xs text-green-200 mt-2">
                      💡 Notice how it combines self-awareness with playful exaggeration
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 rounded-3xl border-2 border-yellow-500/30">
        <Lightbulb className="w-8 h-8 text-yellow-400 mb-3" />
        <h3 className="font-bold text-white mb-2">Pro Tip</h3>
        <p className="text-yellow-200">
          Your first attempt doesn't have to be perfect. Humor is about practice and refinement. 
          The more you try, the more natural it becomes!
        </p>
      </div>

      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        Next: Your Humor Profile
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Your Humor Profile</h2>
        <p className="text-lg text-purple-300">Get personalized recommendations</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">1. What's your comfort level?</h3>
          <div className="grid gap-3">
            {[
              { value: 'beginner', emoji: '🌱', label: 'Beginner', desc: 'Play it safe' },
              { value: 'intermediate', emoji: '🔥', label: 'Intermediate', desc: 'Ready to experiment' },
              { value: 'advanced', emoji: '💎', label: 'Advanced', desc: 'Confident with timing' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setHumorProfile({...humorProfile, comfortLevel: option.value})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  humorProfile.comfortLevel === option.value
                    ? 'bg-purple-700/50 border-purple-400'
                    : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{option.label}</p>
                    <p className="text-sm text-purple-300">{option.desc}</p>
                  </div>
                  {humorProfile.comfortLevel === option.value && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-pink-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">2. What's your natural style?</h3>
          <div className="grid gap-3">
            {[
              { value: 'self-deprecating', emoji: '🎭', label: 'Self-deprecating', desc: 'Humble, relatable' },
              { value: 'observational', emoji: '👀', label: 'Observational', desc: 'Witty, clever' },
              { value: 'playful', emoji: '😏', label: 'Playful', desc: 'Teasing, energetic' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setHumorProfile({...humorProfile, naturalStyle: option.value})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  humorProfile.naturalStyle === option.value
                    ? 'bg-pink-700/50 border-pink-400'
                    : 'bg-pink-950/30 border-pink-700/30 hover:border-pink-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{option.label}</p>
                    <p className="text-sm text-pink-300">{option.desc}</p>
                  </div>
                  {humorProfile.naturalStyle === option.value && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-blue-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">3. Your biggest fear?</h3>
          <div className="grid gap-3">
            {[
              { value: 'offending', emoji: '😰', label: 'Offending someone', desc: 'Play it safe with self-deprecating humor' },
              { value: 'silence', emoji: '🤐', label: 'Awkward silence after joke', desc: 'Start with observational comments' },
              { value: 'flat', emoji: '🎯', label: 'Joke falling flat', desc: 'Test waters with mild humor first' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setHumorProfile({...humorProfile, biggestFear: option.value})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  humorProfile.biggestFear === option.value
                    ? 'bg-blue-700/50 border-blue-400'
                    : 'bg-blue-950/30 border-blue-700/30 hover:border-blue-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{option.label}</p>
                    <p className="text-sm text-blue-300">{option.desc}</p>
                  </div>
                  {humorProfile.biggestFear === option.value && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {humorProfile.comfortLevel && humorProfile.naturalStyle && humorProfile.biggestFear && (
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30 shadow-xl">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Your Humor Blueprint</h3>
            <p className="text-green-200">Personalized just for you!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-950/50 rounded-xl border border-green-700/30">
              <h4 className="font-bold text-green-200 mb-2">Your Recommended Style:</h4>
              <p className="text-white">
                {humorProfile.naturalStyle === 'self-deprecating' && '🎭 Self-Deprecating - Humble & Relatable'}
                {humorProfile.naturalStyle === 'observational' && '👀 Observational - Witty & Clever'}
                {humorProfile.naturalStyle === 'playful' && '😏 Playful - Teasing & Energetic'}
              </p>
            </div>

            <div className="p-4 bg-green-950/50 rounded-xl border border-green-700/30">
              <h4 className="font-bold text-green-200 mb-2">Best Starting Scenarios:</h4>
              <p className="text-white">
                {humorProfile.comfortLevel === 'beginner' && 'One-on-one conversations, familiar settings'}
                {humorProfile.comfortLevel === 'intermediate' && 'Small groups, social gatherings'}
                {humorProfile.comfortLevel === 'advanced' && 'Any situation - you\'re ready!'}
              </p>
            </div>

            <div className="p-4 bg-green-950/50 rounded-xl border border-green-700/30">
              <h4 className="font-bold text-green-200 mb-2">What to Avoid:</h4>
              <p className="text-white">
                {humorProfile.biggestFear === 'offending' && 'Skip controversial topics, stick to self-humor'}
                {humorProfile.biggestFear === 'silence' && 'Avoid forced punchlines, use natural observations'}
                {humorProfile.biggestFear === 'flat' && 'Start subtle, build as you read the room'}
              </p>
            </div>

            <div className="p-4 bg-green-950/50 rounded-xl border border-green-700/30">
              <h4 className="font-bold text-green-200 mb-2">Your Starter Lines:</h4>
              <p className="text-white text-sm">
                {humorProfile.naturalStyle === 'self-deprecating' && '"I\'m so bad at [X], I could teach a masterclass in what NOT to do"'}
                {humorProfile.naturalStyle === 'observational' && '"Isn\'t it funny how we all [universal experience]?"'}
                {humorProfile.naturalStyle === 'playful' && '"Oh, you\'re one of those people who [playful observation]"'}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={nextStep}
        disabled={!humorProfile.comfortLevel || !humorProfile.naturalStyle || !humorProfile.biggestFear}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next: Your Action Plan
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Your 7-Day Action Plan</h2>
        <p className="text-lg text-purple-300">Daily missions to build your humor muscle</p>
      </div>

      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-orange-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-400" />
          Progressive Challenge
        </h3>
        <p className="text-orange-200 mb-6">Each day builds on the last. Check them off as you go!</p>

        <div className="space-y-3">
          {dailyMissions.map((mission, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                dailyProgress[idx]
                  ? 'bg-green-900/40 border-green-500/50'
                  : 'bg-orange-950/30 border-orange-700/30 hover:border-orange-600/50'
              }`}
              onClick={() => {
                const newProgress = [...dailyProgress];
                newProgress[idx] = !newProgress[idx];
                setDailyProgress(newProgress);
                if (newProgress[idx]) {
                  showNotification(`Day ${idx + 1} complete! 🎉`);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  dailyProgress[idx] ? 'bg-green-500' : 'bg-orange-700'
                }`}>
                  {dailyProgress[idx] ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-bold mb-1 ${dailyProgress[idx] ? 'text-green-300' : 'text-white'}`}>
                    Day {idx + 1}
                  </p>
                  <p className={dailyProgress[idx] ? 'text-green-200 line-through' : 'text-orange-200'}>
                    {mission}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {dailyProgress.filter(d => d).length === 7 && (
          <div className="mt-6 p-6 bg-yellow-900/40 rounded-2xl border-2 border-yellow-500/50 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-xl font-bold text-yellow-200 mb-2">🎉 Challenge Complete! 🎉</p>
            <p className="text-yellow-300">You're now a certified humor practitioner!</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-purple-500/30 shadow-xl text-center">
          <BookOpen className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">Bonus Resource</h4>
          <p className="text-sm text-purple-300">50 Conversation Starters with Humor</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-blue-500/30 shadow-xl text-center">
          <Play className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">Watch & Learn</h4>
          <p className="text-sm text-blue-300">Comedians Who Use Different Styles</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-green-500/30 shadow-xl text-center">
          <Zap className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">Practice Mode</h4>
          <p className="text-sm text-green-300">Virtual Scenarios to Test Skills</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Mental Models for Daily Practice
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
            <h4 className="font-bold text-purple-200 mb-2">The "What If?" Game</h4>
            <p className="text-sm text-purple-300">Take any boring situation and ask "What if this were EXTREMELY that?"</p>
          </div>

          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
            <h4 className="font-bold text-purple-200 mb-2">The Contrast Finder</h4>
            <p className="text-sm text-purple-300">Notice when reality ≠ expectation. That gap = humor opportunity</p>
          </div>

          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
            <h4 className="font-bold text-purple-200 mb-2">The Absurdity Highlighter</h4>
            <p className="text-sm text-purple-300">Point out things we accept as normal but are actually weird</p>
          </div>

          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
            <h4 className="font-bold text-purple-200 mb-2">The Pattern Breaker</h4>
            <p className="text-sm text-purple-300">Notice patterns in conversations, then break them playfully</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          nextStep();
          if (onCompleteNavigator) {
            onCompleteNavigator();
          }
        }}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        Complete Your dJourney
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep9 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center space-y-6">
        <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
          Congratulations!
        </h1>
        <p className="text-xl md:text-2xl text-purple-200">
          You've Mastered the Art of Humor
        </p>
      </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Achievement Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-green-900/30 rounded-xl border border-green-600/30">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Learned 5 Humor Types</p>
                <p className="text-sm text-green-300">From self-deprecating to callbacks</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-900/30 rounded-xl border border-green-600/30">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Mastered Creation Formulas</p>
                <p className="text-sm text-green-300">Build humor from scratch</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-900/30 rounded-xl border border-green-600/30">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Practiced Real Scenarios</p>
                <p className="text-sm text-green-300">Tested your skills safely</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-900/30 rounded-xl border border-green-600/30">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Created Your Profile</p>
                <p className="text-sm text-green-300">Personalized strategy ready</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-yellow-900/30 rounded-2xl border-2 border-yellow-500/30 text-center">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-xl font-bold text-yellow-200 mb-2">Badge Unlocked</p>
            <p className="text-2xl font-bold text-white mb-1">🎭 Humor Apprentice</p>
            <p className="text-sm text-yellow-300">Ready for your 7-day challenge</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-blue-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Remember
          </h3>
          <p className="text-blue-200 text-lg leading-relaxed italic">
            "Humor isn't about being funny—it's about being human. It's about connecting, 
            acknowledging shared experiences, and showing vulnerability. You now have the tools. 
            The rest is practice."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-purple-500/30 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-2xl font-bold text-white mb-1">5</p>
            <p className="text-sm text-purple-300">Humor Formulas Mastered</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-orange-500/30 text-center">
            <div className="text-3xl mb-2">💪</div>
            <p className="text-2xl font-bold text-white mb-1">7</p>
            <p className="text-sm text-orange-300">Days of Practice Ahead</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-green-500/30 text-center">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-2xl font-bold text-white mb-1">∞</p>
            <p className="text-sm text-green-300">Possibilities Unlocked</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Your Next Steps:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-purple-200">Start your 7-day challenge today—pick one mission</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-purple-200">Keep the humor formulas handy—reference them before social situations</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-purple-200">Practice one formula per week until it feels natural</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p className="text-purple-200">Remember: Progress over perfection. Every attempt is practice!</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (onCompleteNavigator) {
              onCompleteNavigator();
            }
            showNotification('Ready for your next adventure! 🚀');
          }}
          className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
        >
          Continue Your Journey
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-purple-400 text-sm italic">
          "The best time to start was yesterday. The second best time is now." 🌟
        </p>
      </div>
    );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-purple-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-xl">
        <div className="px-4 md:px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-purple-200">Humor Mastery</span>
              </div>
              <span className="text-sm font-bold text-purple-200">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto">
        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
        {currentStep === 7 && renderStep7()}
        {currentStep === 8 && renderStep8()}
        {currentStep === 9 && renderStep9()}

        {/* Navigation */}
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-purple-900/50 hover:bg-purple-800/50 rounded-xl border-2 border-purple-500/30 font-semibold transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        )}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-up border-2 border-purple-400/50 backdrop-blur-sm z-50">
          <p className="font-bold text-center">{notification}</p>
        </div>
      )}

    

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
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Humor;