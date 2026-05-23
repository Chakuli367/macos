import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCw, Volume2, Check, Clock, AlertCircle, Ear, Zap, Heart, MessageSquare, Focus } from 'lucide-react';

const ActiveListening = ({ onNext }) => {
  const [stage, setStage] = useState(0);
  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(() => {
  const saved = localStorage.getItem('completedChallenges');
  return saved ? new Set(JSON.parse(saved)) : new Set();
});


  const ScenarioMCQ = ({ challengeType, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [finishedChallenges, setFinishedChallenges] = useState({
  casual: false,
  problem: false,
  conflict: false,
  vulnerable: false
});
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());


  const scenarios = {
    casual: [
      {
        situation: "Your coworker mentions they had a rough weekend.",
        question: "What's the best response using LEAPS?",
        options: [
          { text: "Oh that sucks. My weekend was great though! I went hiking and...", correct: false, feedback: "This shifts focus to you instead of listening to them. Remember: Listen first!" },
          { text: "That's too bad. Well, at least it's Monday now!", correct: false, feedback: "This dismisses their feelings. Where's the empathy?" },
          { text: "I'm sorry to hear that. What happened?", correct: true, feedback: "Perfect! You empathized and asked an open question. This invites them to share more." },
          { text: "*Nods and stays silent*", correct: false, feedback: "While silence can be good, asking a follow-up shows genuine interest." }
        ],
        leapsFocus: "E (Empathize) + A (Ask)"
      },
      {
        situation: "A friend is excitedly telling you about their new hobby. They keep going on and on.",
        question: "How do you show active listening?",
        options: [
          { text: "Check your phone occasionally while nodding", correct: false, feedback: "Multitasking breaks the L in LEAPS - Listen fully!" },
          { text: "Interrupt to share your similar experience", correct: false, feedback: "Don't interrupt! Let them finish, then respond." },
          { text: "Maintain eye contact, nod, and ask 'What do you love most about it?'", correct: true, feedback: "Excellent! You're listening with your body language and asking curious questions." },
          { text: "Say 'That's cool' and change the subject", correct: false, feedback: "This shows you're not really listening or interested." }
        ],
        leapsFocus: "L (Listen) + A (Ask)"
      },
      {
        situation: "Your colleague shares: 'I've been feeling overwhelmed with the new project timeline.'",
        question: "What should you do next?",
        options: [
          { text: "So what I'm hearing is you're stressed about the timeline. Is that right?", correct: true, feedback: "Perfect! You summarized to confirm understanding - that's the S in LEAPS!" },
          { text: "Everyone feels that way. You'll be fine!", correct: false, feedback: "This minimizes their feelings instead of validating them." },
          { text: "You should talk to the manager about it.", correct: false, feedback: "Jumping to solutions too quickly. Pause and confirm you understand first." },
          { text: "Why did you take on so much work?", correct: false, feedback: "'Why' questions can sound accusatory. Use 'what' or 'how' instead." }
        ],
        leapsFocus: "S (Summarize) + P (Pause)"
      }
    ],
    problem: [
      {
        situation: "A friend says: 'I'm thinking about quitting my job but I'm not sure if it's the right move.'",
        question: "What's your best response?",
        options: [
          { text: "You should definitely quit! Life's too short to be unhappy.", correct: false, feedback: "Too quick to advise. First, understand their situation fully." },
          { text: "Tell me more about what's making you consider leaving.", correct: true, feedback: "Great! You're asking open-ended questions to understand deeply before advising." },
          { text: "Have you updated your resume yet?", correct: false, feedback: "This assumes they've decided. Don't jump ahead - explore their feelings first." },
          { text: "I quit my job last year and it was the best decision!", correct: false, feedback: "Making it about you. Keep focus on them and their unique situation." }
        ],
        leapsFocus: "A (Ask) + L (Listen)"
      },
      {
        situation: "Someone is venting: 'My manager never appreciates my work. I stay late, I meet deadlines, and nothing!'",
        question: "How do you respond with empathy?",
        options: [
          { text: "That must feel really frustrating. It sounds like you're putting in a lot of effort.", correct: true, feedback: "Perfect! You validated their emotion and reflected what you heard." },
          { text: "Maybe you're being too sensitive?", correct: false, feedback: "This invalidates their feelings. Never tell someone how they should feel." },
          { text: "All managers are like that. Don't take it personally.", correct: false, feedback: "Generalizing dismisses their specific experience." },
          { text: "What do you want me to do about it?", correct: false, feedback: "Defensive and unhelpful. They need empathy, not defensiveness." }
        ],
        leapsFocus: "E (Empathize)"
      },
      {
        situation: "After listening to a complex problem, you're not sure you understood everything.",
        question: "What should you do?",
        options: [
          { text: "Pretend you understood and give generic advice", correct: false, feedback: "Never fake understanding! It breaks trust." },
          { text: "Let me make sure I understand - you're dealing with X and Y, and you're concerned about Z. Did I get that right?", correct: true, feedback: "Excellent! Summarizing shows you listened and gives them a chance to clarify." },
          { text: "That's complicated. Good luck with that!", correct: false, feedback: "This abandons them. If confused, ask clarifying questions!" },
          { text: "Just move on and hope they don't notice", correct: false, feedback: "Honesty builds trust. It's okay to admit confusion and ask for clarification." }
        ],
        leapsFocus: "S (Summarize) + A (Ask)"
      }
    ],
    conflict: [
      {
        situation: "Someone says: 'I can't believe you support that political candidate. How could you?'",
        question: "How do you respond to keep dialogue open?",
        options: [
          { text: "Well, I can't believe YOU support the other one!", correct: false, feedback: "Fighting back escalates conflict. Stay curious, not defensive." },
          { text: "I'd love to understand your perspective better. What concerns you most about my candidate?", correct: true, feedback: "Perfect! You stayed curious and invited them to share their viewpoint." },
          { text: "Let's just not talk about politics.", correct: false, feedback: "Avoiding the topic doesn't build understanding or connection." },
          { text: "You're just brainwashed by the media.", correct: false, feedback: "Attacking them ends the conversation and damages the relationship." }
        ],
        leapsFocus: "A (Ask) + P (Pause)"
      },
      {
        situation: "During a debate, someone makes a point you strongly disagree with. You feel your anger rising.",
        question: "What's the LEAPS approach?",
        options: [
          { text: "Immediately interrupt to correct them", correct: false, feedback: "Interrupting shows you're not listening. Let them finish first." },
          { text: "Take a breath, let them finish, then say: 'I see it differently, but help me understand your reasoning.'", correct: true, feedback: "Excellent! You paused, stayed open, and asked to understand before responding." },
          { text: "Roll your eyes and check your phone", correct: false, feedback: "Body language matters. This shows disrespect, not listening." },
          { text: "Raise your voice to make your point", correct: false, feedback: "Volume doesn't make you right. It just shuts down dialogue." }
        ],
        leapsFocus: "P (Pause) + L (Listen)"
      },
      {
        situation: "After a heated exchange, they say: 'You never listen to me! You just wait for your turn to talk!'",
        question: "How do you respond?",
        options: [
          { text: "That's not true! I always listen to you!", correct: false, feedback: "Getting defensive proves their point. This is a moment to reflect." },
          { text: "You're right, I could be listening better. Can we start over? I want to really hear you.", correct: true, feedback: "Amazing! You acknowledged their feeling and committed to better listening." },
          { text: "Fine, I won't say anything then.", correct: false, feedback: "Passive-aggressive responses damage relationships further." },
          { text: "Well maybe if you made more sense, I'd listen!", correct: false, feedback: "Insulting them escalates conflict. Take responsibility for your part." }
        ],
        leapsFocus: "E (Empathize) + S (Summarize)"
      }
    ],
    vulnerable: [
      {
        situation: "Someone shares: 'I've been feeling really lonely lately, even though I'm surrounded by people.'",
        question: "How do you create space for vulnerability?",
        options: [
          { text: "That's weird. You have so many friends!", correct: false, feedback: "This invalidates their experience. Loneliness isn't about quantity of people." },
          { text: "*Pause* That sounds really hard. Do you want to tell me more about what that feels like?", correct: true, feedback: "Perfect! You validated, paused, and invited them deeper without judgment." },
          { text: "Have you tried joining more activities?", correct: false, feedback: "Offering solutions too quickly. They need to be heard first." },
          { text: "I feel lonely sometimes too!", correct: false, feedback: "While relating can help, don't shift focus to yourself immediately." }
        ],
        leapsFocus: "E (Empathize) + P (Pause) + A (Ask)"
      },
      {
        situation: "A friend is crying while sharing a painful experience. Long silences occur.",
        question: "What's the best approach?",
        options: [
          { text: "Fill every silence with words to make it less awkward", correct: false, feedback: "Silence allows them to process emotions. Don't fear it!" },
          { text: "Change the subject to cheer them up", correct: false, feedback: "They need to feel their feelings, not avoid them." },
          { text: "Sit with them in silence, maybe place a hand on their shoulder, and let them take their time", correct: true, feedback: "Beautiful! Silence and presence are powerful forms of listening." },
          { text: "Tell them to stop crying and move on", correct: false, feedback: "Emotions need to be felt, not suppressed. This damages trust." }
        ],
        leapsFocus: "P (Pause) + E (Empathize)"
      },
      {
        situation: "Someone confides: 'I'm scared I'm not good enough for this new role. What if I fail?'",
        question: "How do you respond to their vulnerability?",
        options: [
          { text: "Don't be silly, you'll be fine!", correct: false, feedback: "Dismissing their fear. Their feelings are real and valid." },
          { text: "It sounds like you're carrying a lot of self-doubt about this. That fear makes sense - it's a big step. What specifically worries you most?", correct: true, feedback: "Excellent! You validated their fear, normalized it, and invited them to go deeper." },
          { text: "Everyone feels imposter syndrome. Get over it.", correct: false, feedback: "Harsh and dismissive. Vulnerability requires gentleness." },
          { text: "Why would you think that?", correct: false, feedback: "'Why' can sound judgmental. Use 'what' instead to explore their thoughts." }
        ],
        leapsFocus: "E (Empathize) + S (Summarize) + A (Ask)"
      }
    ]
  };

  const currentScenarios = scenarios[challengeType];
  const currentScenario = currentScenarios[currentQuestion];
  const progress = ((currentQuestion + 1) / currentScenarios.length) * 100;

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
    
    const isCorrect = currentScenario.options[optionIndex].correct;
    setAnswers([...answers, isCorrect]);
  };

  const markChallengeComplete = (type: string) => {
  setCompletedChallenges((prev) => {
    const updated = new Set(prev);
    updated.add(type);
    localStorage.setItem('completedChallenges', JSON.stringify([...updated]));
    return updated;
  });
};

  const handleNext = () => {
  if (selectedAnswer === null) return;

  const isLast = currentQuestion === currentScenarios.length - 1;

  if (!isLast) {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    return;
  }

  // LAST SCENARIO → Finish
  const score = answers.filter(a => a).length;
  const percentage = (score / currentScenarios.length) * 100;

  onComplete(percentage, answers);
};




  const getChallengeColor = () => {
    switch(challengeType) {
      case 'casual': return { gradient: 'from-blue-600 to-cyan-600', bg: 'from-blue-800/40 to-cyan-800/40', border: 'border-blue-500/30' };
      case 'problem': return { gradient: 'from-orange-600 to-amber-600', bg: 'from-orange-800/40 to-amber-800/40', border: 'border-orange-500/30' };
      case 'conflict': return { gradient: 'from-red-600 to-rose-600', bg: 'from-red-800/40 to-rose-800/40', border: 'border-red-500/30' };
      case 'vulnerable': return { gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-800/40 to-pink-800/40', border: 'border-purple-500/30' };
      default: return { gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-800/40 to-pink-800/40', border: 'border-purple-500/30' };
    }
  };

  const colors = getChallengeColor();

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          className="text-purple-300 hover:text-purple-100 transition-colors"
        >
          ← Back to scenarios
        </button>
        <span className="text-purple-300">
          Question {currentQuestion + 1} of {currentScenarios.length}
        </span>
      </div>

      <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scenario Card */}
      <div className={`p-8 bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-3xl border-2 ${colors.border}`}>
        
        {/* LEAPS Focus Badge */}
        <div className="inline-block px-4 py-2 bg-purple-950/50 rounded-full border border-purple-500/30 mb-6">
          <p className="text-xs font-bold text-purple-300">LEAPS Focus: {currentScenario.leapsFocus}</p>
        </div>

        {/* Situation */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-purple-300 mb-3">SITUATION:</h3>
          <p className="text-lg text-white italic leading-relaxed">"{currentScenario.situation}"</p>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-purple-300 mb-3">YOUR RESPONSE:</h3>
          <p className="text-xl font-bold text-white">{currentScenario.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentScenario.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = option.correct;
            const showCorrect = showFeedback && isCorrect;
            const showWrong = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                onClick={() => !showFeedback && handleAnswer(idx)}
                disabled={showFeedback}
                className={`w-full p-5 text-left rounded-2xl border-2 transition-all ${
                  showCorrect 
                    ? 'bg-green-500/20 border-green-500/50' 
                    : showWrong 
                    ? 'bg-red-500/20 border-red-500/50'
                    : isSelected
                    ? 'bg-purple-600/30 border-purple-400/50'
                    : 'bg-purple-950/30 border-purple-500/20 hover:border-purple-400/40 hover:bg-purple-800/30'
                } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    showCorrect 
                      ? 'border-green-400 bg-green-500/30 text-green-200'
                      : showWrong
                      ? 'border-red-400 bg-red-500/30 text-red-200'
                      : 'border-purple-400/50 text-purple-300'
                  }`}>
                    {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1">
                    <p className={`${showFeedback ? 'text-white' : 'text-purple-100'}`}>
                      {option.text}
                    </p>
                    {showFeedback && isSelected && (
                      <p className={`mt-3 text-sm ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                        {option.feedback}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {showFeedback && (
          <button
            onClick={handleNext}
            className={`w-full mt-6 px-8 py-4 bg-gradient-to-r ${colors.gradient} hover:opacity-90 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2`}
          >
            {currentQuestion < currentScenarios.length - 1 ? 'Next Question' : 'See Results'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

  const stages = [
    {
      title: "Active Listening",
      subtitle: "Master the Art of Focused Attention",
      description: "Focus fully on the other person. Nod, mirror expressions, and respond thoughtfully.",
      color: "from-violet-600 to-purple-600",
      accentColor: "violet"
    },
    {
      title: "The LEAPS Framework",
      subtitle: "A Simple Framework You'll Remember",
      description: "Use this framework to master active listening in any conversation:",
      color: "from-purple-600 to-fuchsia-600",
      accentColor: "purple",
      framework: [
        {
          letter: "L",
          word: "LISTEN",
          icon: Ear,
          description: "Stop what you're doing. Put away your phone. Give them your complete attention.",
          tips: ["Close unnecessary tabs", "Face them directly", "Minimize distractions"]
        },
        {
          letter: "E",
          word: "EMPATHIZE",
          icon: Heart,
          description: "Try to feel what they're feeling. Notice their emotions, tone, and body language.",
          tips: ["Watch their facial expressions", "Notice their energy level", "Feel their emotional state"]
        },
        {
          letter: "A",
          word: "ASK",
          icon: MessageSquare,
          description: "Ask genuine questions that show you're curious and invested in understanding.",
          tips: ["Ask 'Tell me more about...'", "Use 'How did that make you feel?'", "Avoid 'why' questions (too accusatory)"]
        },
        {
          letter: "P",
          word: "PAUSE",
          icon: Focus,
          description: "Wait before responding. Let silence breathe. Don't fill every gap with words.",
          tips: ["Count to 2-3 in your head", "Let them finish completely", "Resist planning your response"]
        },
        {
          letter: "S",
          word: "SUMMARIZE",
          icon: Zap,
          description: "Mirror back what you heard to confirm understanding and show you were truly listening.",
          tips: ["Say 'So what I'm hearing is...'", "Ask 'Is that right?'", "Validate their feelings first"]
        }
      ]
    },
    {
      title: "Why Active Listening Matters",
      subtitle: "The Science & Impact",
      description: "Understanding the power behind the skill",
      color: "from-fuchsia-600 to-pink-600",
      accentColor: "fuchsia",
      whyContent: [
        {
          title: "Builds Trust Instantly",
          description: "People trust those who listen. It signals that they matter and their thoughts are valuable.",
          icon: Heart
        },
        {
          title: "Reveals Hidden Information",
          description: "Most people's real concerns emerge after they're fully heard. Active listening uncovers them.",
          icon: Zap
        },
        {
          title: "Reduces Conflict",
          description: "Most conflicts happen because people don't feel heard. Listening defuses tension quickly.",
          icon: MessageSquare
        },
        {
          title: "Improves Your Response",
          description: "When you truly listen first, your responses are smarter, more relevant, and more helpful.",
          icon: Focus
        }
      ]
    },
    {
      title: "Practice Challenge",
      subtitle: "Ready to Try?",
      description: "Have a 5-minute conversation using the LEAPS framework. Then reflect on how it went.",
      color: "from-pink-600 to-rose-600",
      accentColor: "pink"
    }
  ];

  const advancedTips = [
    { title: "The 70/30 Rule", description: "Let them talk 70% of the time. You should only talk 30%. This feels unnatural at first but builds trust." },
    { title: "Notice Micro-Expressions", description: "Facial expressions reveal true emotions. Sadness, anger, and joy flash across faces in 0.5 seconds." },
    { title: "Match Their Energy", description: "If they're excited, show excitement. If they're thoughtful, be thoughtful. It builds rapport unconsciously." },
    { title: "Avoid These Killers", description: "Don't interrupt, don't check your phone, don't think about your response, don't make it about you." },
    { title: "Use Strategic Silence", description: "Silence after they finish gives them space to add more. Many will go deeper if you let them." },
    { title: "Notice What They Skip", description: "People often avoid certain topics. That's where the real feelings are. Gently come back to those." }
  ];

  const handleSkip = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
    } else {
      onNext();
    }
  };

  const handleReset = () => {
    setStage(0);
    setReflection('');
    setRating(0);
    setCompleted(false);
  };

  const handleComplete = () => {
    if (stage === stages.length - 1 && reflection.trim()) {
      setCompleted(true);
    }
  };

  const currentStage = stages[stage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 text-white flex flex-col relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" />
      
      {/* Header */}
      <div className="relative z-10 sticky top-0 bg-gradient-to-r from-purple-900/80 to-fuchsia-900/80 backdrop-blur-md border-b border-purple-500/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Ear className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-100">Active Listening</h1>
              <p className="text-xs text-purple-300">Stage {stage + 1} of {stages.length}</p>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
          >
            <RotateCw className="w-5 h-5 text-purple-300" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-purple-950/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          {/* Stage 0: Introduction */}
          {stage === 0 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-3 mb-8">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                  {currentStage.title}
                </h2>
                <p className="text-xl text-purple-300">{currentStage.subtitle}</p>
              </div>

              <div className="relative">
                <div className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-violet-500/30 shadow-2xl">
                  <Ear className="w-32 h-32 md:w-40 md:h-40 text-violet-300" />
                </div>
              </div>

              <p className="text-lg text-purple-200 max-w-md mx-auto leading-relaxed">
                {currentStage.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10 text-sm">
                <div className="p-4 bg-violet-500/20 rounded-2xl border border-violet-500/30">
                  <div className="text-3xl mb-2">⏱️</div>
                  <p className="text-violet-200 font-medium">5 min</p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-purple-200 font-medium">Beginner</p>
                </div>
                <div className="p-4 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-500/30">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-fuchsia-200 font-medium">High Impact</p>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <button
                  onClick={handleSkip}
                  className="w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  Learn the Framework
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="w-full px-8 py-3 bg-purple-900/50 hover:bg-purple-900/70 border-2 border-purple-500/30 rounded-2xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {showTips ? 'Hide' : 'Show'} Advanced Tips
                </button>
              </div>

              {showTips && (
                <div className="mt-6 p-6 bg-purple-950/50 rounded-2xl border-2 border-purple-500/30 space-y-4 text-left">
                  {advancedTips.map((tip, i) => (
                    <div key={i} className="pb-4 border-b border-purple-700/30 last:border-0 last:pb-0">
                      <h4 className="font-bold text-purple-100 mb-1 text-sm">{tip.title}</h4>
                      <p className="text-sm text-purple-300">{tip.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stage 1: LEAPS Framework */}
          {stage === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                  {currentStage.title}
                </h2>
                <p className="text-purple-300 mb-4">{currentStage.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentStage.framework.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-6 bg-gradient-to-br from-purple-800/40 to-fuchsia-800/40 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all hover:shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{item.letter}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-purple-100 mb-2">{item.word}</h3>
                          <p className="text-purple-300 mb-3">{item.description}</p>
                          <div className="space-y-1">
                            {item.tips.map((tip, tipIdx) => (
                              <div key={tipIdx} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <p className="text-purple-200">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 bg-purple-950/50 rounded-2xl border-2 border-purple-500/20 mt-8">
                <h4 className="font-bold text-purple-100 mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                  Remember: LEAPS
                </h4>
                <p className="text-purple-200 text-sm">
                  This framework is designed to be memorable. Think "LEAPS" every time you enter a conversation where you want to truly connect. It'll become second nature.
                </p>
              </div>

              <button
                onClick={handleSkip}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                See Why It Matters
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Stage 2: Why It Matters */}
          {stage === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
                  {currentStage.title}
                </h2>
                <p className="text-purple-300">{currentStage.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStage.whyContent.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-6 bg-gradient-to-br from-fuchsia-800/40 to-pink-800/40 backdrop-blur-sm rounded-2xl border-2 border-fuchsia-500/30 hover:border-fuchsia-400/50 transition-all hover:shadow-xl"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Icon className="w-6 h-6 text-fuchsia-300 flex-shrink-0 mt-1" />
                        <h3 className="text-lg font-bold text-fuchsia-100">{item.title}</h3>
                      </div>
                      <p className="text-sm text-purple-200">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl border-2 border-pink-500/30">
                <p className="text-purple-200 text-sm">
                  <span className="font-bold text-pink-100">The Bottom Line:</span> Active listeners are trusted more, promoted more often, and have stronger relationships. It's one of the most valuable skills you can develop.
                </p>
              </div>

              <button
                onClick={handleSkip}
                className="w-full px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Start Practice Challenge
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Stage 3: Practice & Reflection */}
          {/* Stage 3: Practice & Reflection */}
{stage === 3 && (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center space-y-2 mb-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent">
        {currentStage.title}
      </h2>
      <p className="text-purple-300">{currentStage.subtitle}</p>
    </div>

    {!selectedChallenge ? (
      <>
        <p className="text-center text-purple-200 mb-6">
          Choose a scenario to practice your active listening skills:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['casual','problem','conflict','vulnerable'].map((type) => {
            const isCompleted = completedChallenges.has(type);
            const config = {
              casual: { emoji: '💬', title: 'Casual Chat', desc: 'Navigate everyday conversations effectively', from: 'blue-800/40', to: 'cyan-800/40', border: 'blue-500/30' },
              problem: { emoji: '🤝', title: 'Help Solve a Problem', desc: 'Support someone facing challenges', from: 'orange-800/40', to: 'amber-800/40', border: 'orange-500/30' },
              conflict: { emoji: '🔥', title: 'Navigate Disagreement', desc: 'Handle differing viewpoints gracefully', from: 'red-800/40', to: 'rose-800/40', border: 'red-500/30' },
              vulnerable: { emoji: '❤️', title: 'Deepen Vulnerability', desc: 'Create space for meaningful connection', from: 'purple-800/40', to: 'pink-800/40', border: 'purple-500/30' },
            }[type];

            return (
              <button
                key={type}
                onClick={() => setSelectedChallenge(type)}
                className={`
                  p-6 backdrop-blur-sm rounded-2xl border-2 transition-all text-left group
                  ${isCompleted 
                    ? 'bg-green-600/30 border-green-500/50 hover:bg-green-500/40' 
                    : `bg-gradient-to-br from-${config.from} to-${config.to} border-${config.border} hover:scale-105 hover:border-opacity-50`}
                `}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{config.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{config.title}</h3>
                <p className="text-sm mb-3">{config.desc}</p>
              </button>
            )
          })}
        </div>
      </>
    ) : (
      <ScenarioMCQ
        challengeType={selectedChallenge}
        onComplete={(score, answers) => {
          setRating(Math.ceil(score / 20));

          setCompletedChallenges(prev => {
            const newSet = new Set(prev);
            newSet.add(selectedChallenge);

            // All challenges done?
            if (['casual','problem','conflict','vulnerable'].every(c => newSet.has(c))) {
              setCompleted(true);
            } else {
              // Not all done → return home
              setSelectedChallenge(null);
            }

            return newSet;
          });
        }}
        onBack={() => setSelectedChallenge(null)}
      />
    )}

    {completed && (
      <div className="text-center space-y-6 p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl border-2 border-green-500/30 mt-6">
        <div className="text-7xl">🎉</div>
        <div>
          <h3 className="text-3xl font-bold text-green-100 mb-2">Well Done!</h3>
          <p className="text-green-200">You've practiced active listening through all scenarios.</p>
        </div>
        <div className="flex gap-2 text-2xl justify-center">
          {[...Array(rating)].map((_, i) => <span key={i}>⭐</span>)}
        </div>
        <p className="text-purple-200 text-sm">
          Score: {(rating / 5 * 100).toFixed(0)}% - {rating === 5 ? 'Excellent!' : rating >= 4 ? 'Great job!' : rating >= 3 ? 'Good effort!' : 'Keep practicing!'}
        </p>
        <button
          onClick={onNext}
          className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
        >
          Next Skill
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    )}
  </div>
)}

        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ActiveListening;