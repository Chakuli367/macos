import React, { useState, useEffect } from "react";
import { 
  Eye, Brain, Users, MessageCircle, TrendingUp, 
  Lightbulb, CheckCircle, ArrowRight, Zap, Target,
  AlertCircle, Smile, Volume2, Trophy, Star,
  ChevronRight, Play, X, Check, Timer, Award,
  Sparkles, ArrowLeft, Home, BarChart3
} from "lucide-react";

type Step = 'blind-test' | 'reveal' | 'learn' | 'practice' | 'challenge' | 'results' | 'action-plan';

interface CueData {
  id: string;
  type: string;
  position: { x: number; y: number };
  label: string;
  explanation: string;
}

interface ScenarioData {
  id: string;
  image: string;
  question: string;
  options: string[];
  correct: number;
  cues: CueData[];
  explanation: string;
}

const SocialCues: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [currentStep, setCurrentStep] = useState<Step>('blind-test');
  const [blindTestAnswer, setBlindTestAnswer] = useState<number | null>(null);
  const [learnedConcepts, setLearnedConcepts] = useState<number>(0);
  const [currentConcept, setCurrentConcept] = useState(0);
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });
  const [currentPracticeLevel, setCurrentPracticeLevel] = useState(0);
  const [foundCues, setFoundCues] = useState<string[]>([]);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeQuestion, setChallengeQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  // Mock scenarios
  const blindTestScenario = {
    question: "What's happening in this conversation?",
    options: [
      "They're having a friendly chat",
      "One person is lying",
      "They're in a disagreement",
      "They just met and feel awkward"
    ],
    correct: 2,
    missedCues: [
      "Crossed arms → Defensiveness",
      "Avoiding eye contact → Discomfort",
      "Leaning away → Creating distance",
      "Forced smile → Fake positivity",
      "Fidgeting hands → Nervousness"
    ]
  };

  const concepts = [
    {
      title: "Eye Contact",
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
      points: [
        "Direct gaze = Confidence/Interest",
        "Looking away = Discomfort/Thinking",
        "Rapid blinking = Stress",
        "Sustained contact = Dominance/Attraction"
      ],
      examples: [
        { img: "👁️", label: "Direct", correct: true },
        { img: "👀", label: "Avoiding", correct: true },
        { img: "😐", label: "Neutral", correct: false }
      ]
    },
    {
      title: "Body Language",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      points: [
        "Open posture = Receptive/Confident",
        "Crossed arms = Defensive/Closed",
        "Leaning in = Interest/Engagement",
        "Leaning away = Discomfort/Disinterest"
      ],
      examples: [
        { img: "🤗", label: "Open", correct: true },
        { img: "🙅", label: "Closed", correct: true },
        { img: "🧍", label: "Neutral", correct: false }
      ]
    },
    {
      title: "Facial Expressions",
      icon: Smile,
      color: "from-yellow-500 to-orange-500",
      points: [
        "Genuine smile = Eyes crinkle",
        "Fake smile = Mouth only",
        "Micro-expressions = True feelings (0.5s)",
        "Jaw tension = Stress/Anger"
      ],
      examples: [
        { img: "😊", label: "Genuine", correct: true },
        { img: "😬", label: "Forced", correct: true },
        { img: "😑", label: "Neutral", correct: false }
      ]
    },
    {
      title: "Vocal Tone",
      icon: Volume2,
      color: "from-green-500 to-emerald-500",
      points: [
        "Rising pitch = Question/Uncertainty",
        "Flat tone = Disinterest/Sadness",
        "Fast pace = Excitement/Anxiety",
        "Slow pace = Thoughtfulness/Sadness"
      ],
      examples: [
        { img: "📈", label: "Rising", correct: true },
        { img: "📉", label: "Flat", correct: true },
        { img: "➡️", label: "Steady", correct: false }
      ]
    },
    {
      title: "Context Awareness",
      icon: Brain,
      color: "from-indigo-500 to-purple-500",
      points: [
        "Same cue, different meanings",
        "Consider environment & relationship",
        "Cultural differences matter",
        "Timing changes interpretation"
      ],
      examples: [
        { img: "🏢", label: "Work", correct: true },
        { img: "🏠", label: "Home", correct: true },
        { img: "🎉", label: "Party", correct: true }
      ]
    }
  ];

  const practiceScenarios = [
    {
      level: 1,
      title: "Single Cue Detection",
      image: "🧑‍💼",
      question: "What cue do you notice?",
      cues: [
        { id: "1", position: { x: 30, y: 40 }, label: "Crossed Arms", correct: true },
        { id: "2", position: { x: 50, y: 30 }, label: "Eye Contact", correct: false },
        { id: "3", position: { x: 45, y: 65 }, label: "Posture", correct: false }
      ]
    },
    {
      level: 1,
      title: "Single Cue Detection",
      image: "👔",
      question: "Identify the social cue",
      cues: [
        { id: "1", position: { x: 45, y: 25 }, label: "Avoiding Gaze", correct: true },
        { id: "2", position: { x: 40, y: 50 }, label: "Hand Position", correct: false },
        { id: "3", position: { x: 55, y: 70 }, label: "Stance", correct: false }
      ]
    },
    {
      level: 2,
      title: "Multi-Cue Recognition",
      image: "👥",
      question: "Find ALL the cues (3 hidden)",
      cues: [
        { id: "1", position: { x: 25, y: 30 }, label: "Person A: Leaning Away", correct: true },
        { id: "2", position: { x: 45, y: 35 }, label: "Person B: Arms Crossed", correct: true },
        { id: "3", position: { x: 65, y: 40 }, label: "Space Between Them", correct: true }
      ]
    }
  ];

  const challengeQuestions = [
    {
      image: "😊",
      question: "What emotion is dominant?",
      options: ["Happy", "Sad", "Angry"],
      correct: 0
    },
    {
      image: "🤔",
      question: "What is this person thinking?",
      options: ["Confused", "Confident", "Worried"],
      correct: 0
    },
    {
      image: "😤",
      question: "How is this person feeling?",
      options: ["Excited", "Frustrated", "Calm"],
      correct: 1
    },
    {
      image: "🙄",
      question: "What does this expression mean?",
      options: ["Agreement", "Skepticism", "Joy"],
      correct: 1
    },
    {
      image: "😬",
      question: "This person is likely...",
      options: ["Comfortable", "Uncomfortable", "Neutral"],
      correct: 1
    },
    {
      image: "🤗",
      question: "The body language suggests...",
      options: ["Openness", "Defensiveness", "Aggression"],
      correct: 0
    },
    {
      image: "🙅",
      question: "This gesture indicates...",
      options: ["Acceptance", "Rejection", "Confusion"],
      correct: 1
    },
    {
      image: "💭",
      question: "This person is probably...",
      options: ["Daydreaming", "Focused", "Anxious"],
      correct: 0
    },
    {
      image: "😎",
      question: "The vibe here is...",
      options: ["Confident", "Nervous", "Sad"],
      correct: 0
    },
    {
      image: "🤝",
      question: "This interaction shows...",
      options: ["Cooperation", "Competition", "Confusion"],
      correct: 0
    }
  ];

  // Challenge timer
  useEffect(() => {
    if (currentStep === 'challenge' && challengeStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && challengeStarted) {
      setCurrentStep('results');
      triggerConfetti();
    }
  }, [timeLeft, challengeStarted, currentStep]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleBlindTestSubmit = () => {
    if (blindTestAnswer !== null) {
      setCurrentStep('reveal');
    }
  };

  const handleConceptNext = () => {
    if (currentConcept < concepts.length - 1) {
      setCurrentConcept(currentConcept + 1);
      setLearnedConcepts(learnedConcepts + 1);
    } else {
      setLearnedConcepts(concepts.length);
      setCurrentStep('practice');
    }
  };

  const handlePracticeAnswer = (cueId: string, correct: boolean) => {
    if (correct) {
      setFoundCues([...foundCues, cueId]);
      setPracticeScore({ correct: practiceScore.correct + 1, total: practiceScore.total + 1 });
    } else {
      setPracticeScore({ correct: practiceScore.correct, total: practiceScore.total + 1 });
    }
  };

  const handlePracticeNext = () => {
    if (currentPracticeLevel < practiceScenarios.length - 1) {
      setCurrentPracticeLevel(currentPracticeLevel + 1);
      setFoundCues([]);
    } else {
      setCurrentStep('challenge');
    }
  };

  const handleChallengeAnswer = (answerIndex: number) => {
    if (answerIndex === challengeQuestions[challengeQuestion].correct) {
      setChallengeScore(challengeScore + 1);
    }
    if (challengeQuestion < challengeQuestions.length - 1) {
      setChallengeQuestion(challengeQuestion + 1);
    } else {
      setCurrentStep('results');
      triggerConfetti();
    }
  };

  const startChallenge = () => {
    setChallengeStarted(true);
    setTimeLeft(60);
    setChallengeScore(0);
    setChallengeQuestion(0);
  };

  // ============================================================================
  // STEP 1: BLIND TEST
  // ============================================================================
  if (currentStep === 'blind-test') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Eye className="w-4 h-4 text-purple-300" />
              <span className="text-xs md:text-sm font-medium text-purple-200">Social Cues Mastery</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              How Good Are You Really?
            </h1>
            <p className="text-base md:text-lg text-purple-300">Let's find out what you're missing...</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <div className="bg-purple-950/50 rounded-2xl aspect-video flex items-center justify-center mb-6 border-2 border-purple-700/30">
              <div className="text-center">
                <div className="text-6xl md:text-8xl mb-4">🗣️💬</div>
                <p className="text-purple-400 text-sm md:text-base">Silent conversation playing...</p>
                <p className="text-purple-500 text-xs mt-2">(Imagine two people talking)</p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{blindTestScenario.question}</h2>

            <div className="space-y-3">
              {blindTestScenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setBlindTestAnswer(idx)}
                  className={`w-full p-4 md:p-5 rounded-2xl font-semibold text-left transition-all border-2 ${
                    blindTestAnswer === idx
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 scale-[1.02]'
                      : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      blindTestAnswer === idx ? 'border-white bg-white' : 'border-purple-500'
                    }`}>
                      {blindTestAnswer === idx && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                    </div>
                    <span className="text-sm md:text-base">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleBlindTestSubmit}
              disabled={blindTestAnswer === null}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
            >
              Submit Answer
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 2: REVEAL
  // ============================================================================
  if (currentStep === 'reveal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-red-300">You Missed A Lot</h1>
            <p className="text-lg text-purple-300">Here's what was really happening...</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <div className="bg-purple-950/50 rounded-2xl aspect-video flex items-center justify-center mb-6 border-2 border-purple-700/30 relative overflow-hidden">
              <div className="text-6xl md:text-8xl">🗣️💬</div>
              <div className="absolute top-4 left-4 bg-red-500/90 px-3 py-2 rounded-lg text-xs md:text-sm font-bold animate-pulse">
                ⚠️ Crossed Arms
              </div>
              <div className="absolute top-4 right-4 bg-orange-500/90 px-3 py-2 rounded-lg text-xs md:text-sm font-bold animate-pulse">
                👁️ Avoiding Eye Contact
              </div>
              <div className="absolute bottom-4 left-4 bg-yellow-500/90 px-3 py-2 rounded-lg text-xs md:text-sm font-bold animate-pulse">
                ↔️ Creating Distance
              </div>
            </div>

            <div className="bg-red-900/20 border-2 border-red-500/30 rounded-2xl p-5 mb-6">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <X className="w-6 h-6" />
                You Caught: 1/5 Major Cues
              </h3>
              <div className="space-y-3">
                {blindTestScenario.missedCues.map((cue, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-purple-200">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{cue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-800/30 border-2 border-purple-500/30 rounded-2xl p-5">
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-lg md:text-xl font-bold text-white mb-2">
                Most people miss 80% of non-verbal communication
              </p>
              <p className="text-purple-300 text-sm md:text-base">
                But you're about to change that. Let's learn what you've been missing your whole life.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('learn')}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              I Want To Learn
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 3: LEARN
  // ============================================================================
  if (currentStep === 'learn') {
    const concept = concepts[currentConcept];
    const Icon = concept.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-300">Learning Progress</span>
              <span className="text-sm font-bold text-purple-200">{currentConcept + 1}/{concepts.length}</span>
            </div>
            <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentConcept + 1) / concepts.length) * 100}%` }}
              />
            </div>
          </div>

          <div className={`bg-gradient-to-br ${concept.color} p-1 rounded-3xl mb-8`}>
            <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-md p-6 md:p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${concept.color} rounded-2xl flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{concept.title}</h2>
                  <p className="text-purple-300 text-sm">Concept {currentConcept + 1} of {concepts.length}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {concept.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-purple-100 text-sm md:text-base">{point}</p>
                  </div>
                ))}
              </div>

              <div className="bg-purple-950/50 rounded-2xl p-6 border-2 border-purple-700/30 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Quick Practice: Identify the Examples
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {concept.examples.map((example, idx) => (
                    <button
                      key={idx}
                      className="p-4 bg-purple-900/40 hover:bg-purple-800/40 rounded-xl border-2 border-purple-700/30 hover:border-purple-500/50 transition-all"
                    >
                      <div className="text-4xl mb-2">{example.img}</div>
                      <p className="text-xs text-purple-300">{example.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConceptNext}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {currentConcept < concepts.length - 1 ? 'Next Concept' : 'Start Practice'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 4: PRACTICE
  // ============================================================================
  if (currentStep === 'practice') {
    const scenario = practiceScenarios[currentPracticeLevel];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{scenario.title}</h1>
                <p className="text-purple-300 text-sm">Level {scenario.level} • Scenario {currentPracticeLevel + 1}/{practiceScenarios.length}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{practiceScore.correct}/{practiceScore.total}</p>
                <p className="text-xs text-purple-300">Score</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <h2 className="text-xl font-bold text-white mb-4">{scenario.question}</h2>

            <div className="bg-purple-950/50 rounded-2xl aspect-video flex items-center justify-center mb-6 border-2 border-purple-700/30 relative">
              <div className="text-8xl">{scenario.image}</div>
              
              {scenario.cues.map((cue) => (
                <button
                  key={cue.id}
                  onClick={() => {
                    handlePracticeAnswer(cue.id, cue.correct);
                    setSelectedHotspot(cue.id);
                    setTimeout(() => setSelectedHotspot(null), 1500);
                  }}
                  disabled={foundCues.includes(cue.id)}
                  className={`absolute w-12 h-12 rounded-full border-4 transition-all ${
                    foundCues.includes(cue.id)
                      ? 'bg-green-500/50 border-green-400 cursor-not-allowed'
                      : 'bg-purple-500/30 border-purple-400 hover:bg-purple-500/50 hover:scale-110 animate-pulse'
                  }`}
                  style={{ left: `${cue.position.x}%`, top: `${cue.position.y}%` }}
                >
                  {foundCues.includes(cue.id) && <Check className="w-6 h-6 text-white m-auto" />}
                </button>
              ))}

              {selectedHotspot && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-2 rounded-lg font-bold animate-bounce">
                  {scenario.cues.find(c => c.id === selectedHotspot)?.correct ? '✓ Correct!' : '✗ Try Again'}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-purple-300 text-sm">
                Found: {foundCues.length}/{scenario.cues.filter(c => c.correct).length} cues
              </p>
              <div className="flex gap-2">
                {scenario.cues.filter(c => c.correct).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full ${
                      idx < foundCues.length ? 'bg-green-400' : 'bg-purple-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handlePracticeNext}
              disabled={foundCues.length < scenario.cues.filter(c => c.correct).length}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
            >
              {currentPracticeLevel < practiceScenarios.length - 1 ? 'Next Scenario' : 'Start Challenge'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 5: CHALLENGE
  // ============================================================================
  if (currentStep === 'challenge') {
    if (!challengeStarted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
              Ready for the Challenge?
            </h1>
            <p className="text-lg md:text-xl text-purple-300 mb-8">
              Test your new skills with 10 rapid-fire questions. You have 60 seconds!
            </p>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-purple-950/40 rounded-2xl border-2 border-purple-700/30">
                  <Timer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white mb-1">60s</p>
                  <p className="text-sm text-purple-300">Time Limit</p>
                </div>
                <div className="text-center p-6 bg-purple-950/40 rounded-2xl border-2 border-purple-700/30">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white mb-1">10</p>
                  <p className="text-sm text-purple-300">Questions</p>
                </div>
              </div>

              <button
                onClick={startChallenge}
                className="w-full px-8 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-2xl font-bold text-xl text-white transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                <Zap className="w-6 h-6" />
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = challengeQuestions[challengeQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="text-center p-4 bg-orange-500/20 rounded-2xl border-2 border-orange-400/30">
                <Timer className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{timeLeft}s</p>
              </div>
              <div className="text-center p-4 bg-purple-500/20 rounded-2xl border-2 border-purple-400/30">
                <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{challengeScore}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-300">Question</p>
              <p className="text-2xl font-bold text-white">{challengeQuestion + 1}/{challengeQuestions.length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <div className="bg-purple-950/50 rounded-2xl aspect-square max-w-md mx-auto flex items-center justify-center mb-8 border-2 border-purple-700/30">
              <div className="text-9xl">{currentQ.image}</div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">{currentQ.question}</h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChallengeAnswer(idx)}
                  className="p-5 md:p-6 bg-purple-950/50 hover:bg-purple-800/50 border-2 border-purple-700/30 hover:border-purple-500/50 rounded-2xl font-bold text-lg transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 6: RESULTS
  // ============================================================================
  if (currentStep === 'results') {
    const accuracy = Math.round((challengeScore / challengeQuestions.length) * 100);
    const improvement = Math.round(((challengeScore / challengeQuestions.length) - 0.2) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="text-9xl animate-bounce">🎉</div>
            </div>
          )}

          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
              Your Transformation
            </h1>
            <p className="text-lg text-purple-300">Look how far you've come!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-red-900/20 border-2 border-red-500/30 rounded-2xl p-6 text-center">
                <p className="text-sm text-red-300 mb-2">DAY 1</p>
                <p className="text-5xl font-bold text-white mb-2">20%</p>
                <p className="text-sm text-purple-300">Awareness</p>
                <div className="h-2 bg-red-950/50 rounded-full overflow-hidden border border-red-700/30 mt-4">
                  <div className="h-full bg-red-500 w-[20%]" />
                </div>
              </div>

              <div className="bg-green-900/20 border-2 border-green-500/30 rounded-2xl p-6 text-center">
                <p className="text-sm text-green-300 mb-2">NOW</p>
                <p className="text-5xl font-bold text-white mb-2">{accuracy}%</p>
                <p className="text-sm text-purple-300">Awareness</p>
                <div className="h-2 bg-green-950/50 rounded-full overflow-hidden border border-green-700/30 mt-4">
                  <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${accuracy}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-800/40 to-pink-800/40 rounded-2xl p-6 mb-6 border-2 border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Your Results
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Challenge Score</span>
                  <span className="text-2xl font-bold text-white">{challengeScore}/{challengeQuestions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Accuracy</span>
                  <span className="text-2xl font-bold text-white">{accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Improvement</span>
                  <span className="text-2xl font-bold text-green-400">+{improvement}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Concepts Learned</span>
                  <span className="text-2xl font-bold text-white">{concepts.length}/5</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border-2 border-yellow-500/30 rounded-2xl p-6 mb-6">
              <Award className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Achievement Unlocked!</h3>
              <p className="text-lg text-yellow-200 mb-1">Social Observer</p>
              <p className="text-sm text-purple-300">
                You're now better at reading social cues than 85% of people! 🎉
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-2xl p-6 border-2 border-purple-700/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                What You've Mastered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {concepts.map((concept, idx) => {
                  const Icon = concept.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-purple-900/40 rounded-xl border border-purple-700/30">
                      <div className={`w-10 h-10 bg-gradient-to-br ${concept.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{concept.title}</p>
                        <div className="h-1 bg-purple-950 rounded-full overflow-hidden mt-1">
                          <div className={`h-full bg-gradient-to-r ${concept.color}`} style={{ width: '100%' }} />
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('action-plan')}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              See Your Action Plan
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 7: ACTION PLAN
  // ============================================================================
  if (currentStep === 'action-plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Take It Outside</h1>
            <p className="text-lg text-purple-300">Your real-world action plan</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl p-6 mb-6 border-2 border-orange-500/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-400" />
                Your Next 3 Conversations
              </h2>
              <p className="text-purple-200 mb-4">Put your new skills to practice. Notice these cues:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <Eye className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-1">1. Eye Contact Patterns</p>
                    <p className="text-sm text-purple-300">Is the person maintaining, avoiding, or shifting their gaze?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-1">2. Body Positioning</p>
                    <p className="text-sm text-purple-300">Are they open, closed, leaning in or away?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <Smile className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-1">3. One Facial Cue</p>
                    <p className="text-sm text-purple-300">Genuine smile? Tension? Micro-expression?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-2xl p-6 border-2 border-purple-700/30 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Quick Reference Unlocked
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-purple-900/40 rounded-xl border border-purple-700/30">
                  <p className="font-bold text-white mb-2">Cue Cheat Sheet</p>
                  <p className="text-xs text-purple-300">Saved to your profile</p>
                </div>
                <div className="p-4 bg-purple-900/40 rounded-xl border border-purple-700/30">
                  <p className="font-bold text-white mb-2">Common Patterns Guide</p>
                  <p className="text-xs text-purple-300">Reference anytime</p>
                </div>
                <div className="p-4 bg-purple-900/40 rounded-xl border border-purple-700/30">
                  <p className="font-bold text-white mb-2">Context Checklist</p>
                  <p className="text-xs text-purple-300">Cultural awareness</p>
                </div>
                <div className="p-4 bg-purple-900/40 rounded-xl border border-purple-700/30">
                  <p className="font-bold text-white mb-2">Advanced Module</p>
                  <p className="text-xs text-purple-300">🔒 Unlocks at Level 5</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-6 mb-6 border-2 border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Track Your Growth
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">1</p>
                  <p className="text-xs text-purple-300">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">5</p>
                  <p className="text-xs text-purple-300">Cues Mastered</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">0</p>
                  <p className="text-xs text-purple-300">Real Applications</p>
                </div>
              </div>
              <p className="text-sm text-purple-300 mt-4 text-center">
                Log your real conversations to level up! 🚀
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onNext}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Return to Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentStep('blind-test');
                  setBlindTestAnswer(null);
                  setCurrentConcept(0);
                  setLearnedConcepts(0);
                  setPracticeScore({ correct: 0, total: 0 });
                  setCurrentPracticeLevel(0);
                  setFoundCues([]);
                  setChallengeScore(0);
                  setChallengeQuestion(0);
                  setChallengeStarted(false);
                  setTimeLeft(60);
                }}
                className="px-6 py-4 bg-purple-950/50 hover:bg-purple-900/50 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Practice Again
              </button>
            </div>
          </div>

          <div className="text-center py-6 border-t-2 border-purple-500/20">
            <p className="text-purple-400 text-sm italic">
              "You now see what 85% of people miss. Keep practicing!" ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SocialCues;