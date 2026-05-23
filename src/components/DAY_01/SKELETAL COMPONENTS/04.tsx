import { useState, useEffect } from 'react';
import { Sparkles, Trophy, Flame, Target, Award, CheckCircle, Star, TrendingUp, MessageCircle, Users, Heart, Zap, Volume2, RefreshCw, ArrowRight, ArrowLeft, Coffee, Dumbbell, BookOpen, PartyPopper, Lock, Play, CheckCheck, XCircle, ChevronRight, BarChart3 } from 'lucide-react';

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const SCENARIOS = [
  {
    id: 'coffee',
    title: 'Coffee Shop',
    icon: Coffee,
    difficulty: 'easy',
    xp: 10,
    context: "You're in line at a coffee shop and notice someone reading an interesting book.",
    goodOpeners: [
      { text: "That book looks interesting! What's it about?", confidence: 95, feedback: "Perfect! Book-based openers show genuine interest." },
      { text: "Nice choice of coffee shop - this place has great vibes!", confidence: 85, feedback: "Great! Environment-based openers are friendly and low-pressure." },
      { text: "Is that book any good? I've been looking for something new to read.", confidence: 90, feedback: "Excellent! Shows vulnerability and invites conversation." }
    ],
    badOpeners: [
      { text: "You come here often?", confidence: 40, feedback: "Too cliché. Try something more specific to the context." },
      { text: "Can I have your number?", confidence: 20, feedback: "Way too forward! Build rapport first." }
    ],
    tip: "Reference something in the environment - it creates instant common ground.",
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'gym',
    title: 'Gym',
    icon: Dumbbell,
    difficulty: 'medium',
    xp: 25,
    context: "Someone is doing an exercise you've been wanting to learn at the gym.",
    goodOpeners: [
      { text: "Hey, that form looks great! Any tips for a beginner?", confidence: 92, feedback: "Perfect! Compliment + asking for help builds instant rapport." },
      { text: "I've been trying to master that exercise - how long did it take you?", confidence: 88, feedback: "Excellent! Shows humility and invites them to share expertise." },
      { text: "Do you mind if I ask about your technique? It looks really smooth.", confidence: 90, feedback: "Great approach! Genuine interest and respect for their skill." }
    ],
    badOpeners: [
      { text: "You're doing that wrong.", confidence: 15, feedback: "Never criticize! This kills any chance of positive conversation." },
      { text: "Are you single?", confidence: 10, feedback: "Completely inappropriate for the gym setting." }
    ],
    tip: "Compliment their skill, then ask for advice - people love to help!",
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'bookstore',
    title: 'Bookstore',
    icon: BookOpen,
    difficulty: 'easy',
    xp: 10,
    context: "You see someone browsing the same section you're interested in.",
    goodOpeners: [
      { text: "Have you read anything good from this section?", confidence: 93, feedback: "Perfect! Simple, relevant, and invites recommendations." },
      { text: "I'm trying to find my next read - any recommendations?", confidence: 91, feedback: "Excellent! Shows openness and values their opinion." },
      { text: "This author is amazing! Have you read their other books?", confidence: 89, feedback: "Great! Shared enthusiasm creates instant connection." }
    ],
    badOpeners: [
      { text: "Do you actually read all these books?", confidence: 35, feedback: "Sounds condescending. Assume positive intent!" },
      { text: "Reading is boring, don't you think?", confidence: 5, feedback: "Why would you say this in a bookstore? Completely counterproductive." }
    ],
    tip: "Shared interests make conversations effortless - lean into the context!",
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'party',
    title: 'Party/Event',
    icon: PartyPopper,
    difficulty: 'medium',
    xp: 25,
    context: "You're at a social gathering and see someone standing alone near the drinks table.",
    goodOpeners: [
      { text: "How do you know [host's name]?", confidence: 94, feedback: "Classic and effective! The universal party opener." },
      { text: "First time at one of these events? The energy is pretty cool!", confidence: 87, feedback: "Great! Acknowledges potential newness and shares positive vibe." },
      { text: "What brings you here tonight?", confidence: 90, feedback: "Perfect! Open-ended and naturally leads to deeper conversation." }
    ],
    badOpeners: [
      { text: "Why are you alone?", confidence: 30, feedback: "Sounds judgmental. Never point out someone's solitude!" },
      { text: "Want to get out of here?", confidence: 20, feedback: "Too forward before any rapport. Build connection first!" }
    ],
    tip: "At events, everyone expects to meet new people - use that momentum!",
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'networking',
    title: 'Networking Event',
    icon: Users,
    difficulty: 'hard',
    xp: 50,
    context: "You're at a professional networking event and want to approach someone interesting.",
    goodOpeners: [
      { text: "What brings you to this event tonight?", confidence: 92, feedback: "Perfect! Professional, open-ended, and context-appropriate." },
      { text: "I loved the speaker's presentation - what did you think?", confidence: 90, feedback: "Excellent! References shared experience and invites opinion." },
      { text: "What field are you in? I'm always curious about different industries.", confidence: 88, feedback: "Great! Shows genuine curiosity without being pushy." }
    ],
    badOpeners: [
      { text: "Can I pitch you my business idea?", confidence: 25, feedback: "Too aggressive! Build rapport before pitching anything." },
      { text: "These events are so boring, right?", confidence: 15, feedback: "Negative energy repels people. Stay positive!" }
    ],
    tip: "Professional settings require respect - ask about their work with genuine interest.",
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'dog_park',
    title: 'Dog Park',
    icon: Heart,
    difficulty: 'easy',
    xp: 10,
    context: "A friendly dog comes up to you and their owner follows.",
    goodOpeners: [
      { text: "Your dog is adorable! What's their name?", confidence: 96, feedback: "Perfect! Dog owners LOVE talking about their pets." },
      { text: "They seem so friendly! How old are they?", confidence: 94, feedback: "Excellent! Shows interest and gives them a chance to share stories." },
      { text: "I love this breed! Any tips for someone considering getting one?", confidence: 91, feedback: "Great! Compliment + asking for advice = instant connection." }
    ],
    badOpeners: [
      { text: "Is your dog aggressive?", confidence: 20, feedback: "Negative framing. Start positive!" },
      { text: "Dogs are okay, I guess.", confidence: 10, feedback: "Why are you at a dog park with that attitude?!" }
    ],
    tip: "Pet owners are the easiest people to talk to - their pets are built-in conversation starters!",
    color: 'from-red-500 to-pink-600'
  }
];

const ACHIEVEMENTS = [
  { id: 'first_approach', title: 'First Words', description: 'Complete your first approach', icon: '🌟', threshold: 1, xpReward: 50 },
  { id: 'confidence_builder', title: 'Confidence Builder', description: 'Practice 5 approaches', icon: '✨', threshold: 5, xpReward: 100 },
  { id: 'social_butterfly', title: 'Social Butterfly', description: 'Master all contexts', icon: '🦋', threshold: 6, xpReward: 200 },
  { id: 'perfectionist', title: 'Perfectionist', description: 'Get 95%+ confidence on 10 approaches', icon: '💎', threshold: 10, xpReward: 300 },
  { id: 'streak_master', title: 'Streak Master', description: 'Practice 3 days in a row', icon: '🔥', threshold: 3, xpReward: 150 },
];

const MOTIVATIONAL_QUOTES = [
  "Every conversation starts with a single word.",
  "Confidence is built through practice, not perfection.",
  "The best time to start was yesterday. The next best time is now.",
  "Social skills are like muscles - they grow stronger with use.",
  "You miss 100% of the conversations you don't start.",
  "Awkwardness is temporary. Regret lasts longer.",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ApproachOpener10X({ onNext }) {
  const [stage, setStage] = useState('home'); // home, scenario-select, practice, feedback, stats
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [shuffledOpeners, setShuffledOpeners] = useState([]);
  const [selectedOpener, setSelectedOpener] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [unlockedScenarios, setUnlockedScenarios] = useState(['coffee', 'bookstore', 'dog_park']);
  const [dailyQuote, setDailyQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userPlaces, setUserPlaces] = useState([]);
  const [aiOpeners, setAiOpeners] = useState([]);
  const [showIntroPopup, setShowIntroPopup] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
    
    // Simulate backend API call to get user's frequented places
    // In production, replace this with actual API call
    setTimeout(() => {
      setUserPlaces([
        {
          id: 'place_1',
          name: 'Starbucks on Main Street',
          type: 'Coffee Shop',
          visits: 23,
          lastVisit: 'Today',
          icon: Coffee,
          color: 'from-amber-500 to-orange-600',
          context: 'A busy coffee shop where you go every morning'
        },
        {
          id: 'place_2',
          name: 'Lifetime Fitness',
          type: 'Gym',
          visits: 15,
          lastVisit: 'Yesterday',
          icon: Dumbbell,
          color: 'from-green-500 to-emerald-600',
          context: 'Your regular gym where you work out 3x per week'
        },
        {
          id: 'place_3',
          name: 'Central Park',
          type: 'Park',
          visits: 8,
          lastVisit: '3 days ago',
          icon: Heart,
          color: 'from-green-400 to-teal-500',
          context: 'The park where you jog on weekends'
        }
      ]);
    }, 500);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // AI Opener Generation (simulated)
  const generateAIOpeners = async (place) => {
    setLoadingAI(true);
    setSelectedPlace(place);
    
    // Simulate AI API call
    // In production, replace with actual API endpoint:
    // const response = await fetch('/api/generate-openers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ place: place.name, type: place.type, context: place.context })
    // });
    // const data = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    // Simulated AI-generated openers based on place type
    const openersMap = {
      'Coffee Shop': [
        {
          opener: "I love their cold brew here - have you tried it?",
          reasoning: "References the specific location and a popular item, creating instant common ground",
          confidence: 92,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "This place gets so crowded in the mornings! Do you usually come at this time?",
          reasoning: "Acknowledges shared experience and invites conversation about routines",
          confidence: 88,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "I've been meaning to try their seasonal drinks - any recommendations?",
          reasoning: "Shows openness and asks for their expertise, making them feel valued",
          confidence: 90,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "Is this your regular spot too? I'm here almost every day!",
          reasoning: "Establishes potential for being 'regulars' together, building familiarity",
          confidence: 85,
          difficulty: 'medium',
          xp: 25
        },
        {
          opener: "That book/laptop setup looks productive! Working on something exciting?",
          reasoning: "Compliments their presence while showing genuine interest in their activities",
          confidence: 87,
          difficulty: 'medium',
          xp: 25
        }
      ],
      'Gym': [
        {
          opener: "I see you here a lot - you're really consistent! What's your secret?",
          reasoning: "Acknowledges their dedication and asks for advice, which people love to give",
          confidence: 91,
          difficulty: 'medium',
          xp: 25
        },
        {
          opener: "That's impressive form on the deadlift! How long have you been training?",
          reasoning: "Specific compliment shows you're knowledgeable and observant",
          confidence: 89,
          difficulty: 'medium',
          xp: 25
        },
        {
          opener: "Do you follow a specific program? I'm looking to switch things up.",
          reasoning: "Asks for their expertise while showing you're serious about fitness",
          confidence: 86,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "The energy here during peak hours is intense! Do you prefer morning or evening workouts?",
          reasoning: "Shared observation about the gym environment creates instant rapport",
          confidence: 84,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "I'm training for [goal] - looks like you might have some experience with that?",
          reasoning: "Shows vulnerability and positions them as someone who can help",
          confidence: 88,
          difficulty: 'medium',
          xp: 25
        }
      ],
      'Park': [
        {
          opener: "Beautiful day for a jog! Do you run this route often?",
          reasoning: "Positive observation plus question about routine creates natural conversation",
          confidence: 90,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "I love this park - it's so peaceful in the mornings. Are you a regular here too?",
          reasoning: "Shares your appreciation while looking for common ground",
          confidence: 87,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "That's a great running pace! Are you training for anything specific?",
          reasoning: "Compliment plus genuine interest in their fitness goals",
          confidence: 85,
          difficulty: 'medium',
          xp: 25
        },
        {
          opener: "I'm trying to find new running trails - any recommendations around here?",
          reasoning: "Asks for local knowledge, positioning them as an expert",
          confidence: 88,
          difficulty: 'easy',
          xp: 10
        },
        {
          opener: "The sunset from this spot is incredible! First time catching it at this hour?",
          reasoning: "Shared appreciation of beauty creates emotional connection",
          confidence: 86,
          difficulty: 'easy',
          xp: 10
        }
      ]
    };

    const generatedOpeners = openersMap[place.type] || openersMap['Coffee Shop'];
    
    setAiOpeners(generatedOpeners);
    setLoadingAI(false);
    setStage('ai-openers');
  };

  const handleOpenerSelect = (opener, isGood) => {
    setSelectedOpener({ ...opener, isGood });
    
    const newPractice = {
      scenarioId: selectedScenario.id,
      opener: opener.text,
      confidence: opener.confidence,
      timestamp: Date.now(),
      xp: isGood ? selectedScenario.xp : Math.floor(selectedScenario.xp * 0.5)
    };

    setPracticeHistory([...practiceHistory, newPractice]);
    
    const xpGained = newPractice.xp;
    setTotalXP(totalXP + xpGained);
    
    if (isGood && opener.confidence >= 90) {
      triggerConfetti();
    }
    
    // Unlock new scenarios
    if (practiceHistory.length === 2 && !unlockedScenarios.includes('gym')) {
      setUnlockedScenarios([...unlockedScenarios, 'gym']);
      showNotification('🎉 New scenario unlocked: Gym!');
    }
    if (practiceHistory.length === 4 && !unlockedScenarios.includes('party')) {
      setUnlockedScenarios([...unlockedScenarios, 'party']);
      showNotification('🎉 New scenario unlocked: Party!');
    }
    if (practiceHistory.length === 6 && !unlockedScenarios.includes('networking')) {
      setUnlockedScenarios([...unlockedScenarios, 'networking']);
      showNotification('🎉 New scenario unlocked: Networking!');
    }
    
    setStage('feedback');
  };

  const completedAchievements = ACHIEVEMENTS.filter(achievement => {
    if (achievement.id === 'first_approach') return practiceHistory.length >= 1;
    if (achievement.id === 'confidence_builder') return practiceHistory.length >= 5;
    if (achievement.id === 'social_butterfly') return new Set(practiceHistory.map(p => p.scenarioId)).size >= 6;
    if (achievement.id === 'perfectionist') return practiceHistory.filter(p => p.confidence >= 95).length >= 10;
    return false;
  });

  const level = Math.floor(totalXP / 100) + 1;
  const xpForNextLevel = (level * 100) - totalXP;
  const todayPractices = practiceHistory.filter(p => {
    const today = new Date().setHours(0, 0, 0, 0);
    return p.timestamp >= today;
  }).length;

  // ============================================================================
  // HOME SCREEN
  // ============================================================================

  if (stage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">

        {/* INTRO POPUP */}
        {showIntroPopup && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl border border-purple-500/40 shadow-xl max-w-sm w-full p-4 relative scale-95">
      
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Approach Opener Pro
        </h2>
        <p className="text-purple-200 text-sm">
          Your social skills training module
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-3 p-3 bg-purple-950/40 rounded-xl border border-purple-600/20">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Conversation Openers</h3>
            <p className="text-xs text-purple-200">Learn openers for real-life places.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-950/40 rounded-xl border border-purple-600/20">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AI Personalization</h3>
            <p className="text-xs text-purple-200">Openers tailored to your routine.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-950/40 rounded-xl border border-purple-600/20">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Build Confidence</h3>
            <p className="text-xs text-purple-200">Earn XP and track progress.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-950/40 rounded-xl border border-purple-600/20">
          <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Instant Feedback</h3>
            <p className="text-xs text-purple-200">See confidence scores instantly.</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowIntroPopup(false)}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
      >
        Start
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  </div>
)}

 

        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
              <span className="text-xs md:text-sm font-medium text-purple-200">Social Skills Mastery</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Approach Opener Pro
            </h1>
            
            <p className="text-sm md:text-base text-purple-200 italic mb-6">
              "{dailyQuote}"
            </p>
          </div>

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-4 rounded-2xl border-2 border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-purple-300 text-xs font-medium">Level</span>
              </div>
              <p className="text-3xl font-bold text-white">{level}</p>
              <p className="text-purple-400 text-xs">{totalXP} XP</p>
            </div>

            <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-4 rounded-2xl border-2 border-pink-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-purple-300 text-xs font-medium">Streak</span>
              </div>
              <p className="text-3xl font-bold text-white">{currentStreak}</p>
              <p className="text-purple-400 text-xs">days</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-4 rounded-2xl border-2 border-indigo-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-purple-300 text-xs font-medium">Today</span>
              </div>
              <p className="text-3xl font-bold text-white">{todayPractices}</p>
              <p className="text-purple-400 text-xs">practices</p>
            </div>
          </div>

          {/* MAIN ACTION CARD */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-6 md:p-8 mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Start Practice</h2>
                <p className="text-sm text-purple-300">Choose a scenario to master</p>
              </div>
            </div>

            <button
              onClick={() => setStage('scenario-select')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Begin Training
            </button>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-purple-100">Achievements</h2>
              <span className="text-sm text-purple-400">({completedAchievements.length}/{ACHIEVEMENTS.length})</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map(achievement => {
                const unlocked = completedAchievements.includes(achievement);
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      unlocked 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-xl' 
                        : 'bg-purple-950/40 border-purple-700/30 opacity-60'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <p className="text-sm font-bold text-purple-100 mb-1">{achievement.title}</p>
                    {unlocked && <p className="text-xs text-green-400">+{achievement.xpReward} XP</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STATS BUTTON */}
          <button
            onClick={() => setStage('stats')}
            className="w-full py-4 bg-purple-950/30 rounded-2xl border-2 border-purple-500/20 hover:border-purple-400/50 transition-all flex items-center justify-center gap-2 text-purple-300 font-medium mb-4"
          >
            <BarChart3 className="w-5 h-5" />
            View Detailed Stats
          </button>

          <button
  onClick={onNext}
  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-base md:text-lg transition-all shadow-xl flex items-center justify-center gap-2 border-2 border-green-400/50 hover:scale-105 active:scale-95"
>
  <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
  <span>Complete Module & Continue</span>
  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
</button>

          {/* MY PLACES BUTTON */}
          <button
            onClick={() => setStage('my-places')}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl border-2 border-indigo-500/30 transition-all flex items-center justify-center gap-2 text-white font-bold shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            AI Openers for My Places
          </button>
        </div>

        {/* NOTIFICATION */}
        {notification && (
          <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-up border-2 border-purple-400/50 backdrop-blur-sm z-50">
            <p className="font-bold text-center">{notification}</p>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // MY PLACES SCREEN
  // ============================================================================

  if (stage === 'my-places') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStage('home')}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-800/40 backdrop-blur-sm rounded-full border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-200">AI-Powered Personalization</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-3">Your Places</h2>
            <p className="text-purple-300 text-sm md:text-base">Get AI-generated openers for places you actually visit</p>
          </div>

          {userPlaces.length === 0 ? (
            <div className="text-center py-16 bg-purple-900/20 rounded-3xl border-2 border-purple-500/20">
              <Users className="w-20 h-20 text-purple-500/50 mx-auto mb-4" />
              <p className="text-purple-300 text-lg mb-2 font-medium">Loading your places...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {userPlaces.map(place => {
                const Icon = place.icon;
                return (
                  <button
                    key={place.id}
                    onClick={() => generateAIOpeners(place)}
                    disabled={loadingAI}
                    className="p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 hover:border-indigo-400/50 hover:scale-105 transition-all text-left shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${place.color} rounded-2xl flex items-center justify-center shadow-xl mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                    <p className="text-sm text-purple-300 mb-4">{place.context}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-purple-800/50 rounded-full border border-purple-700/30 text-purple-200">
                          {place.visits} visits
                        </span>
                        <span className="text-purple-400">{place.lastVisit}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-purple-700/30 flex items-center gap-2 text-indigo-300 font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Generate AI Openers</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* INFO BOX */}
          <div className="mt-8 p-5 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-indigo-500/30">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-2">How This Works</h4>
                <p className="text-sm text-purple-200 leading-relaxed">
                  Our AI analyzes your frequently visited places and generates personalized conversation openers 
                  based on the specific context, environment, and social dynamics of each location. Each opener 
                  comes with reasoning so you understand <em>why</em> it works!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // AI OPENERS SCREEN
  // ============================================================================

  if (stage === 'ai-openers') {
    const Icon = selectedPlace?.icon || Sparkles;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => {
              setStage('my-places');
              setSelectedPlace(null);
              setAiOpeners([]);
            }}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Places
          </button>

          {/* LOADING STATE */}
          {loadingAI && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Generating AI Openers...</h3>
              <p className="text-purple-300">Analyzing context and creating personalized suggestions</p>
            </div>
          )}

          {/* RESULTS */}
          {!loadingAI && aiOpeners.length > 0 && (
            <>
              {/* PLACE HEADER */}
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-indigo-500/30 shadow-2xl mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedPlace.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedPlace.name}</h2>
                    <p className="text-sm text-purple-300">{selectedPlace.type} • {selectedPlace.visits} visits</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-700/30">
                  <p className="text-purple-200 text-sm">{selectedPlace.context}</p>
                </div>
              </div>

              {/* AI GENERATED OPENERS */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-2xl font-bold text-purple-100">AI-Generated Openers</h3>
                </div>

                <div className="space-y-4">
                  {aiOpeners.map((opener, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-5 md:p-6 rounded-2xl border-2 border-purple-500/20 hover:border-indigo-400/50 transition-all shadow-lg hover:shadow-xl"
                    >
                      {/* DIFFICULTY & XP BADGE */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          opener.difficulty === 'easy' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {opener.difficulty === 'easy' ? '🌱 Easy' : '🔥 Medium'}
                        </span>
                        <span className="px-3 py-1 bg-purple-700/40 rounded-full text-xs font-bold text-purple-200 border border-purple-600/30">
                          +{opener.xp} XP
                        </span>
                        <span className="ml-auto text-2xl font-bold text-white">{opener.confidence}%</span>
                      </div>

                      {/* OPENER TEXT */}
                      <div className="mb-4 p-4 bg-indigo-950/30 rounded-xl border border-indigo-700/30">
                        <p className="text-white text-base md:text-lg font-medium">"{opener.opener}"</p>
                      </div>

                      {/* AI REASONING */}
                      <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
                        <div className="flex items-start gap-2 mb-2">
                          <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
                          <p className="text-xs font-bold text-indigo-300 uppercase tracking-wide">Why This Works</p>
                        </div>
                        <p className="text-sm text-purple-200 leading-relaxed">{opener.reasoning}</p>
                      </div>

                      {/* CONFIDENCE METER */}
                      <div className="mt-4">
                        <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden border border-purple-700/30">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                            style={{ width: `${opener.confidence}%` }}
                          />
                        </div>
                      </div>

                      {/* TRY IT BUTTON */}
                      <button
                        onClick={() => {
                          // Log this as a practice
                          const newPractice = {
                            scenarioId: 'ai_custom',
                            opener: opener.opener,
                            confidence: opener.confidence,
                            timestamp: Date.now(),
                            xp: opener.xp,
                            place: selectedPlace.name
                          };
                          setPracticeHistory([...practiceHistory, newPractice]);
                          setTotalXP(totalXP + opener.xp);
                          showNotification(`🎉 +${opener.xp} XP! Opener saved to your practice log`);
                          
                          if (opener.confidence >= 90) {
                            triggerConfetti();
                          }
                        }}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        I'll Try This One!
                      </button>

                      
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 gap-4">
                
                <button
  onClick={onNext}
  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-base md:text-lg transition-all shadow-xl flex items-center justify-center gap-2 border-2 border-green-400/50 hover:scale-105 active:scale-95"
>
  <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
  <span>Complete Module & Continue</span>
  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
</button>

</div>
              <div className="grid grid-cols-2 gap-4">
                
                <button
                  onClick={() => generateAIOpeners(selectedPlace)}
                  className="px-6 py-4 bg-purple-950/50 hover:bg-purple-900/50 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>

                <button
                  onClick={() => {
                    setSelectedPlace(null);
                    setAiOpeners([]);
                    setStage('my-places');
                  }}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  Choose Another Place
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* CONFETTI */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}

        {/* NOTIFICATION */}
        {notification && (
          <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-up border-2 border-purple-400/50 backdrop-blur-sm z-50">
            <p className="font-bold text-center">{notification}</p>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // SCENARIO SELECT
  // ============================================================================

  if (stage === 'scenario-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStage('home')}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-2">Choose Your Scenario</h2>
          <p className="text-purple-300 mb-8">Pick a context to practice conversation openers</p>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {SCENARIOS.map(scenario => {
              const Icon = scenario.icon;
              const isLocked = !unlockedScenarios.includes(scenario.id);
              const completedCount = practiceHistory.filter(p => p.scenarioId === scenario.id).length;
              
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
  if (!isLocked) {
    setSelectedScenario(scenario);
    // Shuffle openers once when scenario is selected
    const allOpeners = [...scenario.goodOpeners, ...scenario.badOpeners];
    const shuffled = allOpeners.sort(() => Math.random() - 0.5);
    setShuffledOpeners(shuffled);
    setStage('practice');
  }
}}
                  disabled={isLocked}
                  className={`relative p-6 rounded-3xl border-2 text-left transition-all shadow-xl ${
                    isLocked
                      ? 'bg-purple-950/40 border-purple-700/30 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30 hover:border-purple-400/50 hover:scale-105 backdrop-blur-md'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-purple-500" />
                    </div>
                  )}
                  
                  <div className={`w-14 h-14 bg-gradient-to-br ${scenario.color} rounded-2xl flex items-center justify-center shadow-xl mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                  <p className="text-sm text-purple-300 mb-4">{scenario.context}</p>

                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      scenario.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      scenario.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {scenario.difficulty === 'easy' ? '🌱' : scenario.difficulty === 'medium' ? '🔥' : '💎'} {scenario.difficulty}
                    </span>
                    <span className="text-purple-400">+{scenario.xp} XP</span>
                    {completedCount > 0 && (
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {completedCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PRACTICE SCREEN
  // ============================================================================

  if (stage === 'practice') {
    const Icon = selectedScenario.icon;
    const allOpeners = shuffledOpeners;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => {
              setStage('scenario-select');
              setSelectedScenario(null);
            }}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* SCENARIO HEADER */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${selectedScenario.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedScenario.title}</h2>
                <p className="text-sm text-purple-300">+{selectedScenario.xp} XP per approach</p>
              </div>
            </div>

            <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-700/30 mb-4">
              <p className="text-purple-200 text-sm md:text-base">{selectedScenario.context}</p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200"><strong>Pro Tip:</strong> {selectedScenario.tip}</p>
            </div>
          </div>

          {/* OPENER OPTIONS */}
          <h3 className="text-xl font-bold text-purple-100 mb-4">Choose Your Opener:</h3>
          
          <div className="space-y-3">
            {allOpeners.map((opener, idx) => {
              const isGood = selectedScenario.goodOpeners.includes(opener);
              return (
                <button
                  key={idx}
                  onClick={() => handleOpenerSelect(opener, isGood)}
                  className="w-full p-5 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 hover:from-purple-800/50 hover:to-indigo-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/20 hover:border-purple-400/50 transition-all text-left shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-700/50 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                      <span className="text-white font-bold text-sm">{idx + 1}</span>
                    </div>
                    <p className="text-white text-base flex-1 pt-1">"{opener.text}"</p>
                    <ChevronRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // FEEDBACK SCREEN
  // ============================================================================

  if (stage === 'feedback') {
    const isGood = selectedOpener.isGood;
    const Icon = selectedScenario.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* RESULT CARD */}
          <div className={`bg-gradient-to-br backdrop-blur-md p-8 rounded-3xl border-2 shadow-2xl mb-6 text-center ${
            isGood 
              ? 'from-green-900/50 to-emerald-900/50 border-green-500/30' 
              : 'from-orange-900/50 to-red-900/50 border-orange-500/30'
          }`}>
            {isGood ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <CheckCheck className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Excellent Choice! 🎉</h2>
                <p className="text-green-200 mb-4">You're building real social confidence!</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Room for Improvement</h2>
                <p className="text-orange-200 mb-4">Every mistake is a learning opportunity!</p>
              </>
            )}

            {/* CONFIDENCE METER */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-200 font-medium">Confidence Rating</span>
                <span className="text-2xl font-bold text-white">{selectedOpener.confidence}%</span>
              </div>
              <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    selectedOpener.confidence >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    selectedOpener.confidence >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${selectedOpener.confidence}%` }}
                />
              </div>
            </div>

            {/* YOUR OPENER */}
            <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-700/30 mb-4">
              <p className="text-purple-300 text-sm mb-2 font-medium">Your Opener:</p>
              <p className="text-white text-lg">"{selectedOpener.text}"</p>
            </div>

            {/* FEEDBACK */}
            <div className={`p-4 rounded-2xl border ${
              isGood ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'
            }`}>
              <p className={`text-sm ${isGood ? 'text-green-200' : 'text-orange-200'}`}>
                <strong>Feedback:</strong> {selectedOpener.feedback}
              </p>
            </div>

            {/* XP GAINED */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl border border-purple-400/30">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">+{isGood ? selectedScenario.xp : Math.floor(selectedScenario.xp * 0.5)} XP</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSelectedOpener(null);
                setStage('practice');
              }}
              className="px-6 py-4 bg-purple-950/50 hover:bg-purple-900/50 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={() => {
                setSelectedScenario(null);
                setSelectedOpener(null);
                setStage('scenario-select');
              }}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              Next Scenario
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedScenario(null);
              setSelectedOpener(null);
              setStage('home');
            }}
            className="w-full mt-4 py-3 text-purple-300 hover:text-purple-200 transition-all font-medium"
          >
            Back to Home
          </button>
        </div>

        {/* CONFETTI */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STATS SCREEN
  // ============================================================================

  if (stage === 'stats') {
    const scenarioBreakdown = SCENARIOS.map(scenario => {
      const count = practiceHistory.filter(p => p.scenarioId === scenario.id).length;
      const avgConfidence = count > 0 
        ? Math.round(practiceHistory.filter(p => p.scenarioId === scenario.id).reduce((sum, p) => sum + p.confidence, 0) / count)
        : 0;
      return { ...scenario, count, avgConfidence };
    }).filter(s => s.count > 0);

    const totalPractices = practiceHistory.length;
    const avgConfidence = totalPractices > 0
      ? Math.round(practiceHistory.reduce((sum, p) => sum + p.confidence, 0) / totalPractices)
      : 0;
    const highConfidenceCount = practiceHistory.filter(p => p.confidence >= 90).length;
    const successRate = totalPractices > 0 ? Math.round((highConfidenceCount / totalPractices) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStage('home')}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-8">Your Statistics</h2>

          {/* OVERVIEW STATS */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Total</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{totalPractices}</p>
              <p className="text-purple-400 text-sm">practices</p>
            </div>

            <div className="bg-gradient-to-br from-green-800/60 to-emerald-900/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-green-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-purple-300 text-sm font-medium">Avg Score</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{avgConfidence}%</p>
              <p className="text-purple-400 text-sm">confidence</p>
            </div>

            <div className="bg-gradient-to-br from-blue-800/60 to-indigo-900/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-blue-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-purple-300 text-sm font-medium">Success</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{successRate}%</p>
              <p className="text-purple-400 text-sm">rate</p>
            </div>

            <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-pink-500/30 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-purple-300 text-sm font-medium">Total XP</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{totalXP}</p>
              <p className="text-purple-400 text-sm">Level {level}</p>
            </div>
          </div>

          {/* SCENARIO BREAKDOWN */}
          {scenarioBreakdown.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-purple-100">Scenario Breakdown</h3>
              </div>

              <div className="space-y-4">
                {scenarioBreakdown.map(scenario => {
                  const Icon = scenario.icon;
                  return (
                    <div key={scenario.id} className="p-4 bg-purple-950/30 rounded-2xl border border-purple-700/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${scenario.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{scenario.title}</h4>
                          <p className="text-sm text-purple-400">{scenario.count} practices • {scenario.avgConfidence}% avg</p>
                        </div>
                      </div>
                      <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden border border-purple-700/30">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            scenario.avgConfidence >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            scenario.avgConfidence >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                          style={{ width: `${scenario.avgConfidence}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RECENT HISTORY */}
          {practiceHistory.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-purple-100">Recent Practice</h3>
              </div>

              <div className="space-y-3">
                {practiceHistory.slice(-5).reverse().map((practice, idx) => {
                  const scenario = SCENARIOS.find(s => s.id === practice.scenarioId);
                  const Icon = scenario?.icon || Target;
                  const timeAgo = Math.floor((Date.now() - practice.timestamp) / 60000);
                  const timeStr = timeAgo < 1 ? 'Just now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;

                  return (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-purple-950/30 rounded-2xl border border-purple-700/30">
                      <div className={`w-10 h-10 bg-gradient-to-br ${scenario?.color || 'from-purple-500 to-pink-500'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm">{scenario?.title || 'Unknown'}</p>
                        <p className="text-purple-400 text-xs">{practice.confidence}% confidence • {timeStr}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-green-400 font-bold text-sm">+{practice.xp} XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalPractices === 0 && (
            <div className="text-center py-16 bg-purple-900/20 rounded-3xl border-2 border-purple-500/20">
              <Target className="w-20 h-20 text-purple-500/50 mx-auto mb-4" />
              <p className="text-purple-300 text-lg mb-2 font-medium">No practice data yet</p>
              <p className="text-purple-400 mb-6">Start practicing to see your stats!</p>
              <button
                onClick={() => setStage('scenario-select')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-xl"
              >
                Start Practicing
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Custom CSS for animations
const styles = `
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
`;