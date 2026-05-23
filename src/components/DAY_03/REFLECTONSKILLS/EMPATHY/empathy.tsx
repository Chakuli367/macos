import React, { useState } from "react";
import {
  Heart,
  Brain,
  Users,
  MessageCircle,
  Target,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Volume2,
  Eye,
  Smile,
  Frown,
  Meh,
  Angry,
  AlertCircle,
  Zap,
  TrendingUp,
  BookOpen,
  Sparkles,
} from "lucide-react";

const EMPATHY: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [userMotivation, setUserMotivation] = useState<string | null>(null);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [emotionQuizScore, setEmotionQuizScore] = useState(0);
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [scenarioResponses, setScenarioResponses] = useState<Record<string, string>>({});
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const [conversationPath, setConversationPath] = useState<string[]>([]);
  const [empathyMeter, setEmpathyMeter] = useState(50);
  const [dailyChallenge, setDailyChallenge] = useState<string | null>(null);

  // PHASE 0: Assessment Questions
  const assessmentQuestions = [
    {
      question: "A friend cancels plans last minute. Your first thought is:",
      options: [
        { text: "They're so unreliable", score: 0 },
        { text: "I wonder if something happened", score: 1 },
        { text: "I'll check if they're okay", score: 2 },
      ],
    },
    {
      question: "When someone shares a problem, you usually:",
      options: [
        { text: "Give them immediate solutions", score: 0 },
        { text: "Share a similar story about yourself", score: 1 },
        { text: "Ask them how they're feeling about it", score: 2 },
      ],
    },
    {
      question: "Someone at work snaps at you. You think:",
      options: [
        { text: "They're being rude to me", score: 0 },
        { text: "Maybe they're having a bad day", score: 1 },
        { text: "I wonder what's really bothering them", score: 2 },
      ],
    },
    {
      question: "A family member seems distant. You:",
      options: [
        { text: "Wait for them to talk to you", score: 0 },
        { text: "Ask 'Are you okay?'", score: 1 },
        { text: "Say 'You seem off. Want to talk about what's going on?'", score: 2 },
      ],
    },
    {
      question: "When someone cries in front of you, you:",
      options: [
        { text: "Feel uncomfortable and change topics", score: 0 },
        { text: "Say 'Don't cry, it'll be okay'", score: 1 },
        { text: "Sit with them quietly and let them feel it", score: 2 },
      ],
    },
  ];

  // Motivations
  const motivations = [
    { id: "friends", label: "Deeper friendships", icon: <Users className="w-5 h-5" /> },
    { id: "work", label: "Better at work relationships", icon: <Target className="w-5 h-5" /> },
    { id: "romantic", label: "Romantic connections", icon: <Heart className="w-5 h-5" /> },
    { id: "family", label: "Family understanding", icon: <Heart className="w-5 h-5" /> },
  ];

  // PHASE 1: Emotion Recognition
  const emotionQuiz = [
    { image: "😊", emotion: "Happy", correct: "Happy", difficulty: 1 },
    { image: "😢", emotion: "Sad", correct: "Sad", difficulty: 1 },
    { image: "😤", emotion: "Frustrated", correct: "Frustrated", difficulty: 2 },
    { image: "😰", emotion: "Anxious", correct: "Anxious", difficulty: 2 },
    { image: "😶", emotion: "Numb", correct: "Numb", difficulty: 3 },
    { image: "🙂", emotion: "Forcing smile (nervous)", correct: "Nervous", difficulty: 3 },
  ];

  // PHASE 2: Perspective Scenarios
  const perspectiveScenarios = [
    {
      situation: "Your friend cancels plans last minute",
      yourThought: "They don't value my time",
      actualReason: "They just got bad news about a family member",
      empathetic: "Something urgent must have come up",
    },
    {
      situation: "Your coworker snaps at you",
      yourThought: "They're being unprofessional",
      actualReason: "They're dealing with a sick child at home",
      empathetic: "They seem stressed—probably overwhelmed",
    },
    {
      situation: "Your partner is being distant",
      yourThought: "They're losing interest in me",
      actualReason: "They're anxious about a work performance review",
      empathetic: "Something is weighing on them",
    },
  ];

  // PHASE 3: Response Builder
  const responseScenarios = [
    {
      situation: "Friend says: 'I feel like I'm failing at everything'",
      options: [
        { text: "You're being too hard on yourself", type: "dismissive", feedback: "This minimizes their feelings" },
        { text: "Here's what you should do...", type: "fixing", feedback: "They need validation first, not solutions" },
        { text: "I felt the same way once...", type: "self-centered", feedback: "This shifts focus to you, not them" },
        { text: "That sounds really overwhelming. Tell me more", type: "empathetic", feedback: "Perfect! You validated and invited them to share" },
      ],
    },
    {
      situation: "Coworker says: 'I'm so angry about this project'",
      options: [
        { text: "Just calm down", type: "dismissive", feedback: "Never tell someone how to feel" },
        { text: "Let me fix this for you", type: "fixing", feedback: "They need to vent, not be rescued" },
        { text: "I hate this project too", type: "self-centered", feedback: "This is about your feelings, not theirs" },
        { text: "I can see you're upset. What happened?", type: "empathetic", feedback: "Great! You acknowledged and explored" },
      ],
    },
  ];

  // PHASE 4: Empathetic Phrases
  const phraseBank = {
    sad: [
      "I'm here for you",
      "That must be really painful",
      "Do you want to talk about it or just have company?",
      "I can't imagine how hard this is",
    ],
    angry: [
      "I can see you're upset. Help me understand why",
      "That sounds frustrating",
      "Your feelings make sense to me",
      "What would help right now?",
    ],
    anxious: [
      "What's worrying you most right now?",
      "That sounds stressful. What would help?",
      "I'm here. Let's figure this out together",
      "It's okay to feel overwhelmed",
    ],
  };

  // PHASE 5: Role-Play Conversation
  const rolePlayScenario = {
    context: "Your friend just went through a breakup",
    messages: [
      {
        id: 1,
        from: "friend",
        text: "I just don't understand what went wrong. I thought we were happy.",
        responses: [
          { text: "They didn't deserve you anyway", impact: -20, feedback: "Dismisses their feelings and the relationship" },
          { text: "You'll find someone better", impact: -10, feedback: "Minimizes their current pain" },
          { text: "That must feel so confusing. What are you feeling right now?", impact: 20, feedback: "Perfect validation and exploration" },
        ],
      },
      {
        id: 2,
        from: "friend",
        text: "I keep blaming myself. Maybe I wasn't good enough.",
        responses: [
          { text: "Stop thinking like that", impact: -20, feedback: "Dismisses their thoughts" },
          { text: "Here's what you should have done...", impact: -15, feedback: "Offers unwanted criticism" },
          { text: "It sounds like you're really hurting. Breakups aren't about being 'good enough'", impact: 20, feedback: "Validates pain and reframes gently" },
        ],
      },
    ],
  };

  // Daily Challenges
  const dailyChallenges = [
    "Ask someone 'How are you really doing?' and listen for 3 full minutes",
    "When someone shares a problem, don't give advice. Just validate their feelings",
    "Notice 3 emotions in others today and name them silently to yourself",
    "Use the phrase 'That must be hard' at least once today",
    "Before judging someone's behavior, ask yourself 'What might they be going through?'",
  ];

  const handleAssessmentAnswer = (score: number) => {
    setAssessmentScore(assessmentScore + score);
    setSelectedAnswer(null);
  };

  const handleEmotionGuess = (guess: string) => {
    const current = emotionQuiz[currentEmotionIndex];
    if (guess === current.correct) {
      setEmotionQuizScore(emotionQuizScore + 1);
    }
    // Always increment to show results after last question
    setCurrentEmotionIndex(currentEmotionIndex + 1);
  };

  const toggleSavePhrase = (phrase: string) => {
    if (savedPhrases.includes(phrase)) {
      setSavedPhrases(savedPhrases.filter(p => p !== phrase));
    } else {
      setSavedPhrases([...savedPhrases, phrase]);
    }
  };

  const handleConversationChoice = (response: any) => {
    setConversationPath([...conversationPath, response.text]);
    setEmpathyMeter(Math.max(0, Math.min(100, empathyMeter + response.impact)));
  };

  const selectDailyChallenge = () => {
    const random = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
    setDailyChallenge(random);
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 text-white pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* HEADER */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-rose-800/40 backdrop-blur-sm rounded-full border border-rose-500/30 text-center">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-300" />
            <span className="text-xs md:text-sm font-medium text-rose-200">Empathy Mastery</span>
          </div>

         <div className="text-center">
  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-rose-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
    Transform Your Relationships
  </h1>
</div>

          <p className="text-base md:text-lg text-rose-200">
            Master the skill that makes you unforgettable. Learn empathy through practice, not theory.
          </p>
        </div>

        {/* PHASE 0: INITIAL ASSESSMENT */}
{currentPhase === 0 && (
  <div className="space-y-6 mb-8">
    {/* Main Container updated from rose to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-pink-400" /> {/* Icon color changed */}
        Quick Empathy Assessment
      </h2>
      
      <p className="text-purple-200 mb-6">Answer honestly—there are no wrong answers. This helps us personalize your journey.</p>

      {selectedAnswer === null && assessmentScore === 0 && (
        <div className="space-y-4">
          <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
            <p className="text-purple-100 font-semibold mb-4">{assessmentQuestions[0].question}</p>
            <div className="space-y-3">
              {assessmentQuestions[0].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAnswer(option.text);
                    handleAssessmentAnswer(option.score);
                  }}
                  // Button updated from rose to violet/purple
                  className="w-full p-4 bg-violet-800/30 hover:bg-violet-700/40 rounded-xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-left text-white"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {assessmentScore > 0 && assessmentScore < 10 && (
        <div className="space-y-4">
          {/* Progress bar updated from rose/purple to violet/pink */}
          <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 p-4 rounded-xl border border-violet-500/30 mb-4">
            <p className="text-sm text-violet-200">Question {Math.floor(assessmentScore / 2) + 1} of 5</p>
          </div>
          <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
            <p className="text-purple-100 font-semibold mb-4">
              {assessmentQuestions[Math.floor(assessmentScore / 2)].question}
            </p>
            <div className="space-y-3">
              {assessmentQuestions[Math.floor(assessmentScore / 2)].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAssessmentAnswer(option.score)}
                  // Button updated from rose to violet/purple
                  className="w-full p-4 bg-violet-800/30 hover:bg-violet-700/40 rounded-xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-left text-white"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {assessmentScore >= 10 && !userMotivation && (
        <div className="space-y-6">
          {/* Score box updated from green/emerald to indigo/violet */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-violet-500/20 p-5 rounded-xl border border-indigo-500/30">
            <p className="text-2xl font-bold text-indigo-300 mb-2">Your Empathy Score: {assessmentScore}/10</p>
            <p className="text-sm text-indigo-200">
              {assessmentScore < 4 && "You have room to grow—and that's okay! Empathy is a skill."}
              {assessmentScore >= 4 && assessmentScore < 7 && "You're on the right track! Let's sharpen your skills."}
              {assessmentScore >= 7 && "You're naturally empathetic! Let's make you a master."}
            </p>
          </div>

          <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
            <p className="text-purple-100 font-semibold mb-4">What do you want to improve most?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {motivations.map((motivation) => (
                <button
                  key={motivation.id}
                  onClick={() => setUserMotivation(motivation.id)}
                  // Button updated from rose to violet/purple
                  className="p-4 bg-violet-800/30 hover:bg-violet-700/40 rounded-xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all flex items-center gap-3 text-left"
                >
                  {/* Assuming motivation.icon components are color-neutral or use generic text colors */}
                  {motivation.icon} 
                  <span className="text-white">{motivation.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {userMotivation && (
        <button
          onClick={() => setCurrentPhase(1)}
          // Button updated from rose/pink to purple/pink (keeping the existing purple theme)
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
        >
          Start Your Empathy Journey
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  </div>
)}

        {/* PHASE 1: WHY EMPATHY MATTERS */}
{currentPhase === 1 && (
  <div className="space-y-6 mb-8">
    {/* Main Container updated to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
        <Brain className="w-6 h-6 text-pink-400" /> {/* Icon color updated */}
        The Science: Mirror Neurons
      </h2>

      {/* Content box updated to purple/violet */}
      <div className="bg-purple-950/50 p-6 rounded-2xl border-l-4 border-violet-500 mb-6">
        <p className="text-purple-100 text-base leading-relaxed mb-4">
          Your brain has a superpower: <span className="font-bold text-pink-300">mirror neurons</span>. When you see someone in pain, your brain fires the same neurons as if YOU were in pain.
        </p>
        <p className="text-purple-200 text-sm">
          This means empathy isn't something you need to learn—you already have it. We're just going to activate it.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-5 rounded-xl border border-purple-500/30 mb-6">
        <p className="text-sm font-bold text-purple-200 mb-3">Same Conversation, Different Outcomes:</p>
        
        <div className="space-y-4">
          {/* WITHOUT EMPATHY box updated from red/rose to red/purple (for consistency but keeping 'bad' color) */}
          <div className="bg-red-900/30 p-4 rounded-xl border-l-4 border-red-500">
            <p className="text-xs font-bold text-red-300 mb-2">WITHOUT EMPATHY</p>
            <p className="text-sm text-purple-100 italic mb-2">"I had the worst day at work."</p>
            <p className="text-sm text-red-200">"Oh that sucks. Want to get food?"</p>
            <p className="text-xs text-red-300 mt-2">→ Person feels unheard and shuts down</p>
          </div>

          {/* WITH EMPATHY box updated from green to indigo/violet (the 'good' color for this theme) */}
          <div className="bg-indigo-900/30 p-4 rounded-xl border-l-4 border-indigo-500">
            <p className="text-xs font-bold text-indigo-300 mb-2">WITH EMPATHY</p>
            <p className="text-sm text-purple-100 italic mb-2">"I had the worst day at work."</p>
            <p className="text-sm text-indigo-200">"That sounds really tough. What happened?"</p>
            <p className="text-xs text-indigo-300 mt-2">→ Person feels seen and opens up</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentPhase(2)}
        // BUTTON KEPT BRIGHT PINK/PURPLE
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
      >
        Learn to Read Emotions
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  </div>
)}

{/* PHASE 2: EMOTION RECOGNITION */}
{currentPhase === 2 && (
  <div className="space-y-6 mb-8">
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
        <Eye className="w-6 h-6 text-pink-400" />
        Emotion Recognition Game
      </h2>

      <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 p-4 rounded-xl border border-violet-500/30 mb-6">
        <p className="text-sm text-violet-200">
          Question {currentEmotionIndex + 1} of {emotionQuiz.length} | Score: {emotionQuizScore}/{emotionQuiz.length}
        </p>
      </div>

      {currentEmotionIndex < emotionQuiz.length && (
        <div className="space-y-6">
          <div className="bg-purple-950/50 p-8 rounded-2xl border border-purple-700/30 flex flex-col items-center">
            <div className="text-8xl mb-6">{emotionQuiz[currentEmotionIndex].image}</div>
            <p className="text-purple-200 text-lg">What emotion is this person feeling?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Happy", "Sad", "Angry", "Anxious", "Frustrated", "Nervous", "Numb"].map((emotion) => (
              <button
                key={emotion}
                onClick={(e) => {
                  e.preventDefault();
                  handleEmotionGuess(emotion);
                }}
                className="p-4 bg-violet-800/30 hover:bg-violet-700/40 rounded-xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-white font-semibold cursor-pointer active:scale-95"
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentEmotionIndex >= emotionQuiz.length && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500/20 to-violet-500/20 p-5 rounded-xl border border-indigo-500/30">
            <p className="text-2xl font-bold text-indigo-300 mb-2">
              You got {emotionQuizScore} out of {emotionQuiz.length} correct!
            </p>
            {/* 💥 ADDED NEW TEXT BLOCK HERE */}
            <p className="text-sm text-indigo-200 mb-3">
              Did that seem very childish? Well, that's actually the only skill you need to identify 
basic moods
. If you could do that, you're good!
            </p>
            {/* Existing text below the new text */}
            <p className="text-sm text-indigo-200">
              {emotionQuizScore >= 5 ? "Excellent! You're already good at reading emotions." : "Keep practicing—this skill improves with awareness."}
            </p>
          </div>

          <button
            onClick={() => setCurrentPhase(3)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
          >
            Learn Perspective-Taking
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  </div>
)}

        {/* PHASE 3: PERSPECTIVE SCENARIOS */}
{currentPhase === 3 && (
  <div className="space-y-6 mb-8">
    {/* Main Container updated to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-pink-400" /> {/* Icon color updated */}
        Walk in Their Shoes
      </h2>

      <p className="text-purple-200 mb-6 text-sm">Your first assumption is usually wrong. Let's see why.</p>

      {currentScenarioIndex < perspectiveScenarios.length && (
        <div className="space-y-4">
          {/* Content Card updated to purple/violet */}
          <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
            <p className="text-purple-100 font-semibold mb-4">
              Scenario: {perspectiveScenarios[currentScenarioIndex].situation}
            </p>
            
            <div className="space-y-3">
              {/* Your First Thought (Red/Bad) - KEPT RED FOR NEGATIVE CONNOTATION, changed BG to violet */}
              <div className="p-4 bg-red-900/30 rounded-xl border-l-4 border-red-500">
                <p className="text-xs font-bold text-red-300 mb-1">Your First Thought:</p>
                <p className="text-sm text-red-200">{perspectiveScenarios[currentScenarioIndex].yourThought}</p>
              </div>

              {/* What's Actually Happening (Purple/Neutral) - KEPT PURPLE */}
              <div className="p-4 bg-purple-900/30 rounded-xl border-l-4 border-purple-500">
                <p className="text-xs font-bold text-purple-300 mb-1">What's Actually Happening:</p>
                <p className="text-sm text-purple-200">{perspectiveScenarios[currentScenarioIndex].actualReason}</p>
              </div>

              {/* Empathetic Interpretation (Green/Good) - CHANGED TO INDIGO */}
              <div className="p-4 bg-indigo-900/30 rounded-xl border-l-4 border-indigo-500">
                <p className="text-xs font-bold text-indigo-300 mb-1">Empathetic Interpretation:</p>
                <p className="text-sm text-indigo-200">{perspectiveScenarios[currentScenarioIndex].empathetic}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (currentScenarioIndex < perspectiveScenarios.length - 1) {
                setCurrentScenarioIndex(currentScenarioIndex + 1);
              } else {
                setCurrentPhase(4);
              }
            }}
            // Button KEPT BRIGHT PINK/PURPLE
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
          >
            {currentScenarioIndex < perspectiveScenarios.length - 1 ? "Next Scenario" : "Learn What to Say"}
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  </div>
)}

{/* PHASE 4: RESPONSE BUILDER */}
{currentPhase === 4 && (
  <div className="space-y-6 mb-8">
    {/* Main Container updated to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-pink-400" /> {/* Icon color updated */}
        What to Actually Say
      </h2>

      <p className="text-purple-200 mb-6 text-sm">Choose the empathetic response. See why others fail.</p>

      {scenarioResponses[responseScenarios[0]?.situation] === undefined && (
        <div className="space-y-4">
          {/* Scenario Question box updated to purple */}
          <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 mb-4">
            <p className="text-purple-100 font-semibold">{responseScenarios[0]?.situation}</p>
          </div>

          <div className="space-y-3">
            {responseScenarios[0]?.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setScenarioResponses({
                    ...scenarioResponses,
                    [responseScenarios[0].situation]: option.type,
                  });
                }}
                // Button updated from rose to violet/purple
                className="w-full p-4 bg-violet-800/30 hover:bg-violet-700/40 rounded-xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-left text-white"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {scenarioResponses[responseScenarios[0]?.situation] && (
        <div className="space-y-4">
          {/* Scenario Question box updated to purple */}
          <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 mb-4">
            <p className="text-purple-100 font-semibold">{responseScenarios[0]?.situation}</p>
          </div>

          {responseScenarios[0]?.options.map((option, idx) => {
            const isCorrect = option.type === "empathetic";
            
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  isCorrect
                    // Correct/Green updated to Indigo/Violet
                    ? "bg-indigo-900/30 border-indigo-500/50"
                    // Incorrect/Red updated to Red/Violet
                    : "bg-red-900/30 border-red-500/50"
                }`}
              >
                <p className="text-sm text-purple-100 mb-2">{option.text}</p>
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-xs text-purple-200">{option.feedback}</p>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setCurrentPhase(5)}
            // Button KEPT BRIGHT PINK/PURPLE
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
          >
            Get Your Phrase Bank
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  </div>
)}

        {/* PHASE 5: PHRASE BANK */}
        {currentPhase === 5 && (
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-rose-900/40 to-purple-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-rose-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-rose-100 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Your Empathetic Phrase Bank
              </h2>

              <p className="text-rose-200 mb-6 text-sm">Save your favorites to use in real conversations</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-rose-100 mb-3 flex items-center gap-2">
                    <Frown className="w-5 h-5 text-blue-400" />
                    When Someone is Sad
                  </h3>
                  <div className="space-y-2">
                    {phraseBank.sad.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-rose-950/40 rounded-xl border border-rose-700/30"
                      >
                        <p className="text-sm text-rose-100">{phrase}</p>
                        <button
                          onClick={() => toggleSavePhrase(phrase)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            savedPhrases.includes(phrase)
                              ? "bg-green-600 text-white"
                              : "bg-rose-800/50 text-rose-200 hover:bg-rose-700/50"
                          }`}
                        >
                          {savedPhrases.includes(phrase) ? "Saved ✓" : "Save"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-rose-100 mb-3 flex items-center gap-2">
                    <Angry className="w-5 h-5 text-red-400" />
                    When Someone is Angry
                  </h3>
                  <div className="space-y-2">
                    {phraseBank.angry.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-rose-950/40 rounded-xl border border-rose-700/30"
                      >
                        <p className="text-sm text-rose-100">{phrase}</p>
                        <button
                          onClick={() => toggleSavePhrase(phrase)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            savedPhrases.includes(phrase)
                              ? "bg-green-600 text-white"
                              : "bg-rose-800/50 text-rose-200 hover:bg-rose-700/50"
                          }`}
                        >
                          {savedPhrases.includes(phrase) ? "Saved ✓" : "Save"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-rose-100 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    When Someone is Anxious
                  </h3>
                  <div className="space-y-2">
                    {phraseBank.anxious.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-rose-950/40 rounded-xl border border-rose-700/30"
                      >
                        <p className="text-sm text-rose-100">{phrase}</p>
                        <button
                          onClick={() => toggleSavePhrase(phrase)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            savedPhrases.includes(phrase)
                              ? "bg-green-600 text-white"
                              : "bg-rose-800/50 text-rose-200 hover:bg-rose-700/50"
                          }`}
                        >
                          {savedPhrases.includes(phrase) ? "Saved ✓" : "Save"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {savedPhrases.length > 0 && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
                    <p className="text-sm font-bold text-green-300 mb-2">
                      ✓ You've saved {savedPhrases.length} phrases
                    </p>
                    <p className="text-xs text-green-200">
                      Use these in your next conversation!
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentPhase(6)}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-rose-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                Practice Real Conversations
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 6: ROLE-PLAY */}
        {currentPhase === 6 && (
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-rose-900/40 to-purple-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-rose-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-rose-100 mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Interactive Role-Play
              </h2>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30 mb-6">
                <p className="text-sm text-purple-200">
                  <strong>Scenario:</strong> {rolePlayScenario.context}
                </p>
              </div>

              <div className="bg-rose-950/50 p-4 rounded-2xl border border-rose-700/30 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-rose-200">Empathy Meter</p>
                  <p className="text-lg font-bold text-rose-100">{empathyMeter}%</p>
                </div>
                <div className="w-full h-3 bg-rose-950/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      empathyMeter >= 70
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : empathyMeter >= 40
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                    }`}
                    style={{ width: `${empathyMeter}%` }}
                  />
                </div>
              </div>

              {conversationPath.length < rolePlayScenario.messages.length && (
                <div className="space-y-4">
                  <div className="bg-purple-950/40 p-4 rounded-xl border-l-4 border-purple-500">
                    <p className="text-sm text-purple-300 mb-1 font-semibold">Your Friend:</p>
                    <p className="text-rose-100">
                      {rolePlayScenario.messages[conversationPath.length].text}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-rose-200 font-semibold">How do you respond?</p>
                    {rolePlayScenario.messages[conversationPath.length].responses.map((response, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleConversationChoice(response)}
                        className="w-full p-4 bg-rose-800/30 hover:bg-rose-700/40 rounded-xl border-2 border-rose-500/30 hover:border-rose-400/50 transition-all text-left text-rose-100"
                      >
                        {response.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conversationPath.length > 0 && conversationPath.length < rolePlayScenario.messages.length && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-xl border border-purple-500/30">
                  <p className="text-xs text-purple-300 font-bold mb-1">Feedback:</p>
                  <p className="text-sm text-purple-100">
                    {rolePlayScenario.messages[conversationPath.length - 1].responses.find(
                      r => r.text === conversationPath[conversationPath.length - 1]
                    )?.feedback}
                  </p>
                </div>
              )}

              {conversationPath.length >= rolePlayScenario.messages.length && (
                <div className="space-y-4">
                  <div className={`p-5 rounded-xl border-2 ${
                    empathyMeter >= 70
                      ? "bg-green-500/20 border-green-500/50"
                      : empathyMeter >= 40
                      ? "bg-yellow-500/20 border-yellow-500/50"
                      : "bg-red-500/20 border-red-500/50"
                  }`}>
                    <p className="text-lg font-bold text-rose-100 mb-2">
                      {empathyMeter >= 70 && "🎉 Excellent Empathy!"}
                      {empathyMeter >= 40 && empathyMeter < 70 && "💡 Good Effort!"}
                      {empathyMeter < 40 && "🤔 Keep Practicing!"}
                    </p>
                    <p className="text-sm text-rose-200">
                      {empathyMeter >= 70 && "Your friend felt truly heard and supported. This is how deep connections are built."}
                      {empathyMeter >= 40 && empathyMeter < 70 && "You validated some feelings, but there's room to go deeper. Try asking more open-ended questions."}
                      {empathyMeter < 40 && "Your responses shut the conversation down. Remember: validate first, advise later (if at all)."}
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentPhase(7)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-rose-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    Create Your Empathy Plan
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
{/* PHASE 7: DAILY CHALLENGES */}
{currentPhase === 7 && (
  <div className="space-y-6 mb-8">
    {/* Main Container updated to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
        <Zap className="w-6 h-6 text-pink-400" /> {/* Icon color updated */}
        Your Personal Empathy Plan
      </h2>

      <p className="text-purple-200 mb-6 text-sm">
        Empathy becomes automatic through daily practice. Here's your mission.
      </p>

      <div className="space-y-4">
        {/* Daily Challenges Box updated to purple/violet */}
        <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
          <p className="text-sm font-bold text-purple-200 mb-3">Daily Micro-Challenges</p>
          
          {!dailyChallenge && (
            <button
              onClick={selectDailyChallenge}
              // Button KEPT BRIGHT PINK/PURPLE
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 transition-all text-white"
            >
              <Sparkles className="w-5 h-5" />
              Get Today's Challenge
            </button>
          )}

          {dailyChallenge && (
            <div className="p-4 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-xl border-2 border-purple-500/30">
              <p className="text-purple-100 font-semibold mb-2">Today's Challenge:</p>
              <p className="text-sm text-purple-200">{dailyChallenge}</p>
            </div>
          )}
        </div>

        {/* Progress Box updated from green/emerald to indigo/violet */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-violet-500/20 p-5 rounded-xl border border-indigo-500/30">
          <p className="text-sm font-bold text-indigo-300 mb-3">Your Progress So Far:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-200">{emotionQuizScore}/{emotionQuiz.length}</p>
              <p className="text-xs text-indigo-300">Emotions Recognized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-200">{savedPhrases.length}</p>
              <p className="text-xs text-indigo-300">Phrases Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-200">{empathyMeter}%</p>
              <p className="text-xs text-indigo-300">Empathy Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-200">100%</p>
              <p className="text-xs text-indigo-300">Module Complete</p>
            </div>
          </div>
        </div>

        {/* 4-Step Formula Box updated to purple/violet */}
        <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
          <p className="text-sm font-bold text-purple-200 mb-3">The 4-Step Empathy Formula</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              {/* Numbers updated to purple-600 */}
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div>
                <p className="text-sm font-semibold text-purple-100">Observe</p>
                <p className="text-xs text-purple-300">What did you see/hear?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="text-sm font-semibold text-purple-100">Interpret</p>
                <p className="text-xs text-purple-300">What might they be feeling?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-semibold text-purple-100">Validate</p>
                <p className="text-xs text-purple-300">Acknowledge their emotion</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
              <div>
                <p className="text-sm font-semibold text-purple-100">Respond</p>
                <p className="text-xs text-purple-300">Say/do something helpful</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentPhase(8)}
        // Button KEPT BRIGHT PINK/PURPLE
        className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
      >
        Complete & Get Certificate
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  </div>
)}

{/* PHASE 8: GRADUATION */}
{currentPhase === 8 && (
  <div className="space-y-6 mb-8">
    {/* Main Container updated to purple/indigo */}
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <div className="text-center mb-6">
        {/* Award icon updated from yellow to pink */}
        <Award className="w-16 h-16 mx-auto mb-4 text-pink-400" />
        <h2 className="text-3xl font-bold text-purple-100 mb-2">You're Empathy Trained!</h2>
        <p className="text-purple-200 text-sm">
          You've completed the journey. Now go practice in the real world.
        </p>
      </div>

      {/* Score Box updated from yellow/orange to indigo/violet */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-violet-500/20 p-6 rounded-2xl border-2 border-indigo-500/30 mb-6">
        <p className="text-lg font-bold text-indigo-200 mb-4 text-center">Your Before & After</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-indigo-300 mb-1">Starting Score</p>
            <p className="text-3xl font-bold text-indigo-200">{assessmentScore}/10</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-indigo-300 mb-1">Final Score</p>
            <p className="text-3xl font-bold text-indigo-200">{Math.min(10, assessmentScore + 3)}/10</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {/* Trending icon updated to pink for highlight */}
          <TrendingUp className="w-5 h-5 text-pink-400" />
          <p className="text-sm text-pink-300 font-semibold">
            +{Math.min(3, 10 - assessmentScore)} points improvement!
          </p>
        </div>
      </div>

      {/* Core Principles Box updated to purple/violet */}
      <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 mb-6">
        <p className="text-sm font-bold text-purple-200 mb-3">The 5 Core Principles (Never Forget)</p>
        <div className="space-y-2 text-sm text-purple-100">
          <p>✓ <strong>Pause before judging</strong> - Everyone has a reason</p>
          <p>✓ <strong>Feelings are facts</strong> - Don't dismiss them</p>
          <p>✓ <strong>Listen more than you speak</strong> - 70/30 rule</p>
          <p>✓ <strong>Validate before solving</strong> - They need to feel heard first</p>
          <p>✓ <strong>Empathy is a choice</strong> - You can always choose it</p>
        </div>
      </div>

      {/* Mission Box KEPT in the purple/pink gradient */}
      <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 p-5 rounded-xl border border-purple-500/30 mb-6">
        <p className="text-base font-bold text-purple-100 mb-3">Your First Mission:</p>
        <p className="text-sm text-purple-200">
          Within the next 24 hours, have ONE empathetic conversation using what you learned. 
          Use the 4-step formula. Use a phrase from your bank. Make someone feel truly heard.
        </p>
      </div>

      <button
        onClick={onNext}
        // Button KEPT BRIGHT PINK/PURPLE
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
      >
        Complete & Start Practicing
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  </div>
)}

        {/* BACK BUTTON */}
        {currentPhase > 0 && currentPhase < 8 && (
          <button
            onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
            className="mt-6 flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default EMPATHY;