import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles, Target, Brain, Eye, Zap, TrendingUp, Award, ArrowRight, ArrowLeft, CheckCircle, X, Lightbulb, Users, Heart, Coffee, Play, Volume2, Edit3, Trophy, Flame, Star, BookOpen, RefreshCw, Clock, ChevronRight, ChevronDown, Send, Share2 } from 'lucide-react';

const ConversationalFlow: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [practiceInputs, setPracticeInputs] = useState<{[key: number]: string}>({});
  const [conversationProfile, setConversationProfile] = useState({
    challenge: '',
    style: '',
    comfortZone: '',
    goal: '',
    frequency: ''
  });
  const [weeklyProgress, setWeeklyProgress] = useState<boolean[]>(Array(30).fill(false));
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState('');
  const [expandedTechnique, setExpandedTechnique] = useState<number | null>(null);
  const [simulatorStep, setSimulatorStep] = useState(0);
  const [simulatorScore, setSimulatorScore] = useState(0);
  const [conversationEnergy, setConversationEnergy] = useState(50);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const totalSteps = 10;
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
  const conversationPyramid = [
    {
      level: 'Deep',
      emoji: '🏔️',
      description: 'Vulnerable & Meaningful',
      examples: ['Values', 'Dreams', 'Fears', 'Life philosophy'],
      risk: 'High reward, high trust needed',
      color: 'from-purple-600 to-pink-600'
    },
    {
      level: 'Medium',
      emoji: '⛰️',
      description: 'Personal & Engaging',
      examples: ['Opinions', 'Experiences', 'Interests', 'Passions'],
      risk: 'Balanced - where connections form',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      level: 'Surface',
      emoji: '🏖️',
      description: 'Safe & Easy',
      examples: ['Weather', 'Surroundings', 'Events', 'Small talk'],
      risk: 'Low risk, low depth',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const conversationEngines = [
    {
      id: 1,
      emoji: '🎣',
      title: 'The Hook Engine',
      description: 'Ask engaging questions',
      formula: 'Open-ended > Closed-ended',
      bad: 'Do you like your job?',
      good: 'What\'s the most interesting thing about your work?',
      why: 'Open questions invite stories, not yes/no answers',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 2,
      emoji: '👂',
      title: 'The Listening Engine',
      description: 'Active listening + callbacks',
      formula: 'Listen → Pick detail → Ask follow-up',
      bad: 'Cool',
      good: 'Oh nice! What trail did you do?',
      why: 'Shows you\'re actually listening and care about details',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      emoji: '🔄',
      title: 'The Connection Engine',
      description: 'Relate your experiences',
      formula: '"That reminds me of..." / "Similar to when I..."',
      bad: 'Okay',
      good: 'Same! I found this amazing Thai place last week. Are you into spicy food?',
      why: 'Creates shared ground and keeps momentum',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 4,
      emoji: '✨',
      title: 'The Story Engine',
      description: 'Share mini-stories, not facts',
      formula: 'Context → Event → Feeling',
      bad: 'I went to Japan',
      good: 'I went to Japan last year and got completely lost in Tokyo—but ended up at this tiny ramen shop that changed my life',
      why: 'Stories are memorable and emotionally engaging',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const transitionTechniques = [
    {
      id: 1,
      name: 'The Bridge',
      formula: '"Speaking of [topic]... that reminds me of [new topic]"',
      example: 'Speaking of travel... have you seen the new documentary on...',
      when: 'Natural segue exists',
      difficulty: 'Easy'
    },
    {
      id: 2,
      name: 'Question Pivot',
      formula: 'Answer → Ask related but different question',
      example: '"I\'m in marketing. But honestly, I\'m more excited about my side project. Do you have any passion projects?"',
      when: 'Want to shift while staying conversational',
      difficulty: 'Easy'
    },
    {
      id: 3,
      name: 'The Callback',
      formula: 'Reference earlier + new direction',
      example: 'Earlier you mentioned loving coffee—do you have a favorite spot in the city?',
      when: 'Deepening existing thread',
      difficulty: 'Medium'
    },
    {
      id: 4,
      name: 'Observation Shift',
      formula: 'Comment on environment → New topic',
      example: 'This music is great... actually, do you go to concerts much?',
      when: 'Current topic dying',
      difficulty: 'Easy'
    },
    {
      id: 5,
      name: 'The Meta Move',
      formula: 'Acknowledge the shift openly',
      example: '"Random question, but..." / "This might be off-topic, but..."',
      when: 'Dramatic shift but stay authentic',
      difficulty: 'Medium'
    },
    {
      id: 6,
      name: 'Story Bridge',
      formula: '"That reminds me of this funny thing..."',
      example: 'Share quick relevant story leading to new topic',
      when: 'Natural storytelling opportunity',
      difficulty: 'Medium'
    },
    {
      id: 7,
      name: 'Energy Reset',
      formula: '"Hey, can I ask you something completely different?"',
      example: 'Direct but friendly pivot',
      when: 'Conversation stalling',
      difficulty: 'Hard'
    }
  ];

  const deadEndScenarios = [
    {
      id: 1,
      title: 'The Interrogation',
      conversation: [
        { speaker: 'You', text: 'Where are you from?' },
        { speaker: 'Them', text: 'Chicago' },
        { speaker: 'You', text: 'Do you like it?' },
        { speaker: 'Them', text: 'Yeah' },
        { speaker: 'You', text: 'Cool' }
      ],
      problem: 'Closed questions + no follow-through',
      fix: 'Ask open questions: "What do you love most about Chicago?" or "What brought you to [current city]?"'
    },
    {
      id: 2,
      title: 'The Monologue',
      problem: 'Talking too long without checking in',
      fix: 'Pause every 30-60 seconds, ask "Does that make sense?" or "Have you experienced something similar?"'
    },
    {
      id: 3,
      title: 'The Weak Response',
      examples: ['Cool', 'Nice', 'That\'s good'],
      problem: 'Gives nothing to build on',
      fix: 'Add a question or relate: "That\'s cool! What got you interested in that?"'
    }
  ];

  const exitStrategies = [
    {
      id: 1,
      name: 'Time Constraint',
      example: 'I have to run to [meeting/event], but this was great!',
      tone: 'Honest, clear, positive',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 2,
      name: 'Future Bridge',
      example: 'Let\'s continue this over coffee sometime! Can I grab your number?',
      tone: 'Shows interest in future',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 3,
      name: 'Introduction Exit',
      example: 'I want to introduce you to someone—let me grab them',
      tone: 'Social proof + natural end',
      rating: '⭐⭐⭐⭐'
    },
    {
      id: 4,
      name: 'Gratitude Close',
      example: 'This was really insightful, thanks for sharing!',
      tone: 'Validates conversation',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 5,
      name: 'Honest Redirect',
      example: 'I should mingle a bit, but great talking to you!',
      tone: 'Direct but kind',
      rating: '⭐⭐⭐⭐'
    }
  ];

  const simulatorScenarios = [
    {
      id: 'coffee',
      title: 'Coffee Shop Small Talk',
      icon: '☕',
      difficulty: 'Beginner',
      description: 'Strike up a conversation with someone waiting for their order'
    },
    {
      id: 'networking',
      title: 'Networking Event',
      icon: '🤝',
      difficulty: 'Intermediate',
      description: 'Meet new professional contacts'
    },
    {
      id: 'party',
      title: 'Party with Strangers',
      icon: '🎉',
      difficulty: 'Intermediate',
      description: 'Navigate a social gathering'
    },
    {
      id: 'catchup',
      title: 'Catching Up',
      icon: '👋',
      difficulty: 'Easy',
      description: 'Reconnect with an old acquaintance'
    }
  ];

  const conversationFlow = {
    coffee: [
      {
        step: 0,
        ai: 'You\'re in line at a coffee shop. The person next to you is looking at the menu.',
        options: [
          { text: 'Say nothing', score: 0, feedback: 'Missed opportunity!', energy: -10 },
          { text: '"This place has so many options, right? Do you have a go-to order?"', score: 10, feedback: 'Great opener! Observational + question', energy: 20 },
          { text: '"Hi"', score: 3, feedback: 'Too vague, needs more', energy: 5 }
        ]
      },
      {
        step: 1,
        ai: 'They respond: "Usually a cappuccino, but I\'m tempted by their seasonal drink. You come here often?"',
        options: [
          { text: '"Yeah"', score: 0, feedback: 'Dead end - no follow-up', energy: -10 },
          { text: '"A few times! The seasonal drinks are hit or miss, but when they\'re good, they\'re amazing. What draws you to cappuccinos?"', score: 10, feedback: 'Excellent! Shared opinion + follow-up question', energy: 20 },
          { text: '"I like coffee"', score: 2, feedback: 'Too generic', energy: 0 }
        ]
      },
      {
        step: 2,
        ai: 'They say: "I love the foam art honestly. There\'s something calming about it."',
        options: [
          { text: '"Cool"', score: 0, feedback: 'Weak response, conversation dying', energy: -15 },
          { text: '"I totally get that! There\'s almost a ritual to it. Do you make coffee at home or mostly get it out?"', score: 10, feedback: 'Perfect! Validates feeling + natural pivot', energy: 20 },
          { text: '"I don\'t really notice the art"', score: 1, feedback: 'Dismissive of their interest', energy: -5 }
        ]
      }
    ]
  };

  // RENDER FUNCTIONS FOR EACH STEP

  const renderStep0 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center space-y-4 md:space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800/40 backdrop-blur-sm rounded-full border border-blue-500/30">
          <MessageCircle className="w-5 h-5 text-pink-300" />
          <span className="text-sm font-medium text-white">Master Conversation Flow</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
    Never Run Out of Things to Say
</h1>
        
        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
          Master the art of smooth, engaging conversations in just 8 minutes
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-red-500/30 shadow-xl text-center">
          <div className="text-5xl mb-3">😰</div>
          <h3 className="font-bold text-white mb-2">Conversations Die?</h3>
          <p className="text-sm text-red-300">Awkward silences after 2 minutes</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/50 to-yellow-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-orange-500/30 shadow-xl text-center">
          <div className="text-5xl mb-3">🤐</div>
          <h3 className="font-bold text-white mb-2">Don't Know What to Say?</h3>
          <p className="text-sm text-orange-300">Running out of topics constantly</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/50 to-green-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-yellow-500/30 shadow-xl text-center">
          <div className="text-5xl mb-3">😶</div>
          <h3 className="font-bold text-white mb-2">Bad at Topic Shifts?</h3>
          <p className="text-sm text-yellow-300">Can't transition smoothly</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-blue-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">You'll Master:</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Keep conversations flowing</p>
              <p className="text-sm text-white">Never run out of things to say</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Transition topics smoothly</p>
              <p className="text-sm text-white">7 proven techniques</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Active listening skills</p>
              <p className="text-sm text-white">Actually hear what people say</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Exit gracefully</p>
              <p className="text-sm text-white">Leave great impressions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl text-center">
        <TrendingUp className="w-12 h-12 text-pink-400 mx-auto mb-3" />
        <p className="text-lg text-purple-200">
          Join <span className="font-bold text-white">10,000+</span> people who've transformed their conversation skills
        </p>
      </div>

      <button
    onClick={nextStep}
    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 text-white"
>
    Learn the Flow
    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
</button>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Conversation Pyramid</h2>
        <p className="text-lg text-white">Understanding conversation depth</p>
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-blue-500/30 shadow-xl">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Pyramid Visual */}
            <div className="space-y-4">
              {conversationPyramid.map((level, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
                  className={`cursor-pointer transition-all duration-300 ${
                    idx === 0 ? 'w-full' : idx === 1 ? 'w-5/6 mx-auto' : 'w-2/3 mx-auto'
                  }`}
                >
                  <div className={`bg-gradient-to-r ${level.color}/30 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-500/30 hover:border-blue-400/50 transition-all shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{level.emoji}</span>
                        <h3 className="text-xl font-bold text-white">{level.level}</h3>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-blue-400 transition-transform ${selectedCard === idx ? 'rotate-90' : ''}`} />
                    </div>
                    <p className="text-blue-200 mb-2">{level.description}</p>
                    
                    {selectedCard === idx && (
                      <div className="mt-4 space-y-3 animate-slide-down">
                        <div className="p-3 bg-blue-950/50 rounded-xl">
                          <p className="text-sm text-blue-300 mb-2 font-semibold">Examples:</p>
                          <div className="flex flex-wrap gap-2">
                            {level.examples.map((ex, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-800/50 rounded-full text-sm text-blue-200 border border-blue-600/30">
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-950/50 rounded-xl">
                          <p className="text-sm text-blue-200">
                            <span className="font-semibold">Risk Level:</span> {level.risk}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-yellow-500/30 shadow-xl">
        <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-3">Key Principle</h3>
        <p className="text-yellow-200 leading-relaxed">
          Conversations should move UP the pyramid, not jump levels. Start surface, build trust, then go deeper. 
          Jumping straight to deep topics can feel intense or forced.
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-pink-400" />
          Practice: Match the Level
        </h3>
        <p className="text-purple-300 mb-4">Which pyramid level do these belong to?</p>
        
        <div className="space-y-3">
          {[
            { text: '"Nice weather today"', correct: 'Surface' },
            { text: '"What are your career goals?"', correct: 'Medium' },
            { text: '"What keeps you up at night?"', correct: 'Deep' },
            { text: '"Have you tried the coffee here?"', correct: 'Surface' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <p className="text-white mb-2 italic">"{item.text}"</p>
              <div className="flex gap-2">
                {['Surface', 'Medium', 'Deep'].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      if (level === item.correct) {
                        showNotification('✅ Correct!');
                      } else {
                        showNotification('❌ Try again!');
                      }
                    }}
                    className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-sm text-purple-200 border border-purple-600/30 transition-all"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

     <button
    onClick={nextStep}
    className="w-full px-6 py-4 bg-gradient-to-r from-purple-700 to-violet-900 rounded-2xl font-bold hover:from-purple-600 hover:to-violet-800 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
>
    Next: The 4 Conversation Engines
    <ArrowRight className="w-5 h-5" />
</button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        {/* Title updated to white text */}
        <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The 4 Conversation Engines</h2>
        <p className="text-lg text-purple-300">What makes conversations flow</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {conversationEngines.map((engine) => (
          <div
            key={engine.id}
            // Card background and border updated to purple/pink
            className={`bg-gradient-to-br ${engine.color}/20 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl hover:scale-105 transition-transform cursor-pointer`}
            onClick={() => setSelectedCard(selectedCard === engine.id ? null : engine.id)}
          >
            <div className="text-5xl mb-3">{engine.emoji}</div>
            <h3 className="text-xl font-bold text-white mb-2">{engine.title}</h3>
            {/* Description text color updated */}
            <p className="text-purple-300 mb-3">{engine.description}</p>
            
            {/* Formula box updated to purple/violet theme */}
            <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-700/30 mb-3">
              <p className="text-sm text-purple-400 font-semibold mb-1">Formula:</p>
              <p className="text-white text-sm">{engine.formula}</p>
            </div>

            {selectedCard === engine.id && (
              <div className="space-y-3 animate-slide-down">
                {/* Bad/Good examples left as Red/Green for universal color meaning */}
                <div className="p-4 bg-red-950/30 rounded-xl border border-red-600/30">
                  <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                    <X className="w-4 h-4" /> Bad Example:
                  </p>
                  <p className="text-red-200 italic">"{engine.bad}"</p>
                </div>

                <div className="p-4 bg-green-950/30 rounded-xl border border-green-600/30">
                  <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Good Example:
                  </p>
                  <p className="text-green-200 italic">"{engine.good}"</p>
                </div>

                {/* 'Why it works' box updated to purple theme */}
                <div className="p-3 bg-purple-900/30 rounded-xl">
                  <p className="text-xs text-purple-300">
                    <span className="font-semibold">Why it works:</span> {engine.why}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Practice Section remains purple/pink */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-pink-400" />
          Practice: Convert Questions
        </h3>
        <p className="text-purple-300 mb-4">Turn these closed questions into open-ended ones:</p>

        <div className="space-y-4">
          {[
            { closed: 'Do you like your job?', open: 'What do you enjoy most about your work?' },
            { closed: 'Did you have a good weekend?', open: 'What was the highlight of your weekend?' },
            { closed: 'Are you busy?', open: 'What have you been working on lately?' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <p className="text-sm text-red-400 mb-2">❌ Closed: "{item.closed}"</p>
              <input
                type="text"
                value={practiceInputs[`q${idx}`] || ''}
                onChange={(e) => setPracticeInputs({...practiceInputs, [`q${idx}`]: e.target.value})}
                placeholder="Write your open-ended version..."
                // Input styling updated to purple
                className="w-full px-4 py-3 bg-purple-900/50 border-2 border-purple-600/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 mb-2"
              />
              {practiceInputs[`q${idx}`] && practiceInputs[`q${idx}`].length > 10 && (
                <div className="p-3 bg-green-900/30 rounded-lg border border-green-600/30">
                  <p className="text-sm text-green-400 flex items-center gap-1 mb-1">
                    <CheckCircle className="w-4 h-4" /> Great! Here's a pro version:
                  </p>
                  <p className="text-green-200 text-sm italic">"{item.open}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Button updated to purple gradient */}
      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: Topic Transition Toolkit
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);

  const renderStep3 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        {/* Icon color changed from cyan-400 to pink-400 */}
        <Share2 className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        {/* Heading and sub-heading text colors updated */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Topic Transition Toolkit</h2>
        <p className="text-lg text-purple-300">7 ways to shift topics smoothly</p>
      </div>

      <div className="space-y-4">
        {transitionTechniques.map((technique) => (
          <div
            key={technique.id}
            // Card background and border updated to purple/violet/pink
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedTechnique(expandedTechnique === technique.id ? null : technique.id)}
              // Button hover color updated
              className="w-full p-6 text-left hover:bg-purple-800/20 transition-all flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-white">{technique.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    technique.difficulty === 'Easy' ? 'bg-green-600/30 text-green-300 border border-green-500/30' :
                    technique.difficulty === 'Medium' ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30' :
                    'bg-red-600/30 text-red-300 border border-red-500/30'
                  }`}>
                    {technique.difficulty}
                  </span>
                </div>
                {/* Formula text color updated */}
                <p className="text-purple-300">{technique.formula}</p>
              </div>
              {/* Chevron icon color updated */}
              <ChevronRight className={`w-6 h-6 text-pink-400 transition-transform ${expandedTechnique === technique.id ? 'rotate-90' : ''}`} />
            </button>

            {expandedTechnique === technique.id && (
              <div className="px-6 pb-6 space-y-3">
                {/* Example box updated to purple/pink theme */}
                <div className="p-4 bg-pink-950/50 rounded-xl border border-pink-700/30">
                  <p className="text-sm text-pink-300 mb-2 font-semibold">Example:</p>
                  <p className="text-white italic">"{technique.example}"</p>
                </div>

                {/* When to use box updated to purple/violet theme */}
                <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
                  <p className="text-sm text-purple-300 mb-2 font-semibold">When to use:</p>
                  <p className="text-white">{technique.when}</p>
                </div>

                {/* Practice box uses existing purple theme and is unchanged */}
                <div className="p-4 bg-purple-900/30 rounded-xl border-2 border-purple-600/30">
                  <p className="text-sm text-purple-300 mb-3">Try it yourself:</p>
                  <input
                    type="text"
                    value={practiceInputs[`tech${technique.id}`] || ''}
                    onChange={(e) => setPracticeInputs({...practiceInputs, [`tech${technique.id}`]: e.target.value})}
                    placeholder={`Use "${technique.name}" technique here...`}
                    className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                  />
                  {practiceInputs[`tech${technique.id}`] && practiceInputs[`tech${technique.id}`].length > 15 && (
                    <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-600/30">
                      <p className="text-sm text-green-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Excellent! You're getting the hang of it!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pro Tip Box - Using the existing yellow theme for 'lightbulb' tip for good contrast/meaning */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-yellow-500/30 shadow-xl">
        <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-3">Pro Tip</h3>
        <p className="text-yellow-200 leading-relaxed">
          Master 2-3 techniques that feel natural to YOU. Don't force all 7. The best conversationalists make transitions feel effortless because they've practiced their favorites thousands of times.
        </p>
      </div>

      {/* Button updated to purple gradient */}
      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: Spot Dead Ends
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);


  const renderStep4 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        {/* Heading and sub-heading text updated to white/purple */}
        <Eye className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Dead End Detector</h2>
        <p className="text-lg text-purple-300">Spot & fix conversation killers</p>
      </div>

      <div className="space-y-6">
        {deadEndScenarios.map((scenario) => (
          <div
            key={scenario.id}
            // Scenarios remain red/orange themed as they deal with 'problems'
            className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-red-500/30 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <X className="w-6 h-6 text-red-400" />
              {scenario.title}
            </h3>

            {scenario.conversation && (
              <div className="space-y-2 mb-4">
                {scenario.conversation.map((line, idx) => (
                  <div key={idx} className={`p-3 rounded-xl ${
                    // Changed 'You' (blue) to purple and 'Other' remains purple
                    line.speaker === 'You' 
                      ? 'bg-violet-950/50 border border-violet-700/30 ml-8' 
                      : 'bg-purple-950/50 border border-purple-700/30 mr-8'
                  }`}>
                    <p className="text-xs text-gray-400 mb-1">{line.speaker}:</p>
                    <p className="text-white">{line.text}</p>
                  </div>
                ))}
              </div>
            )}

            {scenario.examples && (
              <div className="mb-4 p-4 bg-red-950/30 rounded-xl border border-red-700/30">
                <p className="text-sm text-red-300 mb-2">Common weak responses:</p>
                <div className="flex flex-wrap gap-2">
                  {scenario.examples.map((ex, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-800/50 rounded-full text-sm text-red-200">
                      "{ex}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-red-950/50 rounded-xl border border-red-700/30 mb-4">
              <p className="text-sm text-red-400 font-semibold mb-2">❌ Problem:</p>
              <p className="text-red-200">{scenario.problem}</p>
            </div>

            <div className="p-4 bg-green-950/30 rounded-xl border border-green-600/30">
              <p className="text-sm text-green-400 font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Fix:
              </p>
              <p className="text-green-200">{scenario.fix}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FORD Method box updated to purple/pink theme */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        {/* Icon and text updated */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-pink-400" />
          The FORD Method (Emergency Backup)
        </h3>
        <p className="text-purple-300 mb-4">When stuck, always have these 4 topics ready:</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* F - Family box updated to purple theme */}
          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
            <h4 className="font-bold text-purple-200 mb-2">F - Family</h4>
            <p className="text-sm text-purple-300">"Do you have siblings?" / "Where's your family from?"</p>
          </div>
          {/* O - Occupation box updated to violet theme */}
          <div className="p-4 bg-violet-950/50 rounded-xl border border-violet-700/30">
            <h4 className="font-bold text-violet-200 mb-2">O - Occupation</h4>
            <p className="text-sm text-violet-300">"What do you do?" / "How did you get into that?"</p>
          </div>
          {/* R - Recreation box updated to pink theme */}
          <div className="p-4 bg-pink-950/50 rounded-xl border border-pink-700/30">
            <h4 className="font-bold text-pink-200 mb-2">R - Recreation</h4>
            <p className="text-sm text-pink-300">"What do you do for fun?" / "Any hobbies?"</p>
          </div>
          {/* D - Dreams box updated to indigo theme */}
          <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-700/30">
            <h4 className="font-bold text-indigo-200 mb-2">D - Dreams</h4>
            <p className="text-sm text-indigo-300">"What are you working toward?" / "Any exciting plans?"</p>
          </div>
        </div>
      </div>

      {/* Button updated to purple gradient */}
      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: The Listening Lab
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);


  const renderStep5 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        {/* Heading and sub-heading text updated to white/purple */}
        <Volume2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Listening Lab</h2>
        <p className="text-lg text-purple-300">Active listening - the secret weapon</p>
      </div>

      {/* The 3 Levels of Listening box (colors left as R/Y/G for category) */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">The 3 Levels of Listening</h3>
        
        <div className="space-y-4">
          {/* Level 1: Red (Unchanged) */}
          <div className="p-6 bg-red-950/30 rounded-2xl border-2 border-red-600/30">
            <div className="flex items-center gap-3 mb-3">
              <X className="w-8 h-8 text-red-400" />
              <div>
                <h4 className="text-xl font-bold text-white">Level 1: Waiting to Talk</h4>
                <p className="text-sm text-red-300">The conversation killer</p>
              </div>
            </div>
            <ul className="space-y-2 text-red-200">
              <li>• Thinking about what you'll say next</li>
              <li>• Missing important details</li>
              <li>• Surface-level engagement</li>
            </ul>
          </div>

          {/* Level 2: Yellow (Unchanged) */}
          <div className="p-6 bg-yellow-950/30 rounded-2xl border-2 border-yellow-600/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Level 2: Hearing Words</h4>
                <p className="text-sm text-yellow-300">Better, but not deep</p>
              </div>
            </div>
            <ul className="space-y-2 text-yellow-200">
              <li>• Processing what they say</li>
              <li>• Basic comprehension</li>
              <li>• Decent but misses subtext</li>
            </ul>
          </div>

          {/* Level 3: Green (Unchanged) */}
          <div className="p-6 bg-green-950/30 rounded-2xl border-2 border-green-600/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="text-xl font-bold text-white">Level 3: Deep Listening</h4>
                <p className="text-sm text-green-300">The master level</p>
              </div>
            </div>
            <ul className="space-y-2 text-green-200">
              <li>• Hearing words + emotions + subtext</li>
              <li>• Noticing energy shifts</li>
              <li>• True understanding and connection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Reflection Technique box updated to purple/pink theme */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          {/* Icon updated to pink */}
          <Brain className="w-6 h-6 text-pink-400" />
          The Reflection Technique
        </h3>
        
        {/* Formula box updated to pink theme */}
        <div className="p-4 bg-pink-950/50 rounded-xl border border-pink-700/30 mb-4">
          <p className="text-pink-300 mb-2 font-semibold">Formula:</p>
          <p className="text-white">"So what I'm hearing is... [paraphrase]. Is that right?"</p>
        </div>

        {/* Benefits boxes updated to purple theme */}
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-purple-950/50 rounded-xl text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-purple-200 text-sm">Shows you're listening</p>
          </div>
          <div className="p-3 bg-purple-950/50 rounded-xl text-center">
            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-purple-200 text-sm">Builds trust</p>
          </div>
          <div className="p-3 bg-purple-950/50 rounded-xl text-center">
            <Target className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-purple-200 text-sm">Clarifies meaning</p>
          </div>
        </div>

        {/* Practice box remains purple (no changes needed) */}
        <div className="p-4 bg-purple-900/30 rounded-xl border-2 border-purple-600/30">
          <p className="text-sm text-purple-300 mb-3">Practice: Write a reflection response</p>
          <p className="text-white mb-3 italic">"I've been feeling overwhelmed with work lately. There's just so much on my plate."</p>
          <input
            type="text"
            value={practiceInputs['reflection'] || ''}
            onChange={(e) => setPracticeInputs({...practiceInputs, reflection: e.target.value})}
            placeholder="Your reflection..."
            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
          />
          {practiceInputs['reflection'] && practiceInputs['reflection'].length > 20 && (
            <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-600/30">
              <p className="text-sm text-green-300 mb-2">Great! Example:</p>
              <p className="text-green-200 italic">"So it sounds like you're dealing with a lot right now and feeling stretched thin. Is that accurate?"</p>
            </div>
          )}
        </div>
      </div>

      {/* "What to Track" box uses original orange/red theme for visual contrast (Unchanged) */}
      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-orange-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">What to Track While Listening</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Eye contact shifts',
            'Energy level changes',
            'Pace of speech',
            'Word choice (excited vs. neutral)',
            'Topics they light up about',
            'Topics they avoid'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-orange-950/50 rounded-xl border border-orange-700/30">
              <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <p className="text-orange-200">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button updated to purple gradient */}
      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: Build Momentum
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);

  const renderStep6 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        {/* Icon color updated from green to pink */}
        <TrendingUp className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        {/* Heading and sub-heading text updated to white/purple */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Momentum Builder</h2>
        <p className="text-lg text-purple-300">Keep energy high & flowing</p>
      </div>

      {/* Conversation Energy Map box updated to purple/pink theme */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Conversation Energy Map</h3>
        {/* Map elements updated to purple/pink shades */}
        <div className="relative h-48 bg-purple-950/50 rounded-xl border border-purple-700/30 p-4">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-purple-600"></div>
          <div className="absolute left-4 bottom-4 right-4 h-0.5 bg-purple-600"></div>
          <div className="absolute left-8 bottom-8 text-xs text-purple-400">Time →</div>
          <div className="absolute left-2 top-2 text-xs text-purple-400 -rotate-90 origin-left">Energy ↑</div>
          <div className="absolute left-12 bottom-8 right-8 top-8">
            <div className="relative h-full">
              <div className="absolute inset-0 flex items-center">
                {/* Energy bar gradient remains distinct for visual meaning */}
                <div className="w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
              </div>
              <div className="absolute top-0 right-0">
                {/* Goal indicator updated to pink/purple */}
                <div className="px-3 py-1 bg-pink-600 rounded-full text-xs text-white font-bold">
                  Goal: Keep it here! ⚡
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: 'Yes-And Principle',
            emoji: '🎭',
            description: 'Accept + add to it (from improv)',
            example: 'Them: "I love hiking"\nYou: "That\'s awesome! I\'ve been wanting to get into it—what got you started?"',
            color: 'from-purple-600 to-pink-600'
          },
          {
            title: 'Energy Match',
            emoji: '🔋',
            description: 'Mirror their enthusiasm level',
            // Color updated from blue/cyan to violet/indigo
            color: 'from-violet-600 to-indigo-600'
          },
          {
            title: 'Curiosity Chain',
            emoji: '🔗',
            description: 'Each answer sparks next question',
            example: '"Marketing" → "What type?" → "Social media" → "Favorite platform?"',
            color: 'from-orange-600 to-yellow-600'
          },
          {
            title: 'Shared Discovery',
            emoji: '🔍',
            description: 'Explore topics together',
            example: '"I don\'t know either—what do you think?" (No pressure to have answers)',
            // Color updated from green/emerald to pink/red
            color: 'from-pink-600 to-red-600'
          },
          {
            title: 'Callback Loop',
            emoji: '🔄',
            description: 'Reference earlier topics',
            example: '"Like you said earlier about loving coffee..." (Shows you were listening)',
            color: 'from-red-600 to-pink-600'
          },
          {
            title: 'Vulnerable Share',
            emoji: '💝',
            description: 'Authentic moment = energy boost',
            example: '"Honestly, I struggle with..." (Invites them to open up too)',
            color: 'from-pink-600 to-purple-600'
          }
        ].map((technique, idx) => (
          <div
            key={idx}
            // Border updated from blue-500/30 to purple-500/30
            className={`bg-gradient-to-br ${technique.color}/20 backdrop-blur-md p-6 rounded-2xl border-2 border-purple-500/30 shadow-xl hover:scale-105 transition-transform cursor-pointer`}
            onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
          >
            <div className="text-4xl mb-3">{technique.emoji}</div>
            <h4 className="text-lg font-bold text-white mb-2">{technique.title}</h4>
            {/* Description text color updated */}
            <p className="text-purple-300 mb-3">{technique.description}</p>
            {selectedCard === idx && (
              // Example box updated to purple/violet theme
              <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                <p className="text-xs text-purple-400 mb-1">Example:</p>
                <p className="text-sm text-purple-200 whitespace-pre-line">{technique.example}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Master Tip Box (Left as Yellow/Orange for visual contrast/meaning) */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-yellow-500/30 shadow-xl">
        <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-3">Master Tip</h3>
        <p className="text-yellow-200 leading-relaxed">
          High-energy conversations aren't about being loud or hyperactive. They're about mutual engagement, curiosity, and making the other person feel heard. Match their energy, don't force yours.
        </p>
      </div>

      {/* Button updated to purple gradient */}
      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: Exit Gracefully
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);

 const renderStep7 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        {/* Icon color updated from blue-400 to pink-400 */}
        <Share2 className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        {/* Heading and sub-heading text updated to white/purple */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Exit Strategy</h2>
        <p className="text-lg text-purple-300">End conversations gracefully</p>
      </div>

      {/* Why This Matters box updated to purple/pink theme */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Why This Matters</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Reason boxes updated to purple theme */}
          <div className="p-4 bg-purple-950/50 rounded-xl text-center">
            <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Awkward exits = bad impression</p>
          </div>
          <div className="p-4 bg-purple-950/50 rounded-xl text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Smooth exits = want to talk again</p>
          </div>
          <div className="p-4 bg-purple-950/50 rounded-xl text-center">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Knowing when = social intelligence</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white mb-4">5 Graceful Exits</h3>
        {exitStrategies.map((strategy) => (
          <div
            key={strategy.id}
            // Strategy card background and border updated to purple/violet
            className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-2xl border-2 border-purple-500/30 shadow-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-bold text-white">{strategy.name}</h4>
              <span className="text-yellow-400">{strategy.rating}</span>
            </div>
            {/* Example box updated to purple/violet theme */}
            <div className="p-4 bg-violet-950/50 rounded-xl border border-violet-700/30 mb-3">
              <p className="text-purple-200 italic">"{strategy.example}"</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Tone tag updated to purple theme */}
              <div className="px-3 py-1 bg-purple-800/50 rounded-full text-xs text-purple-200">
                {strategy.tone}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What NOT to Do box remains red/orange (unchanged) */}
      <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-red-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <X className="w-6 h-6 text-red-400" />
          What NOT to Do
        </h3>
        <div className="space-y-2">
          {[
            'Ghost or fade away without saying anything',
            'Fake a phone call',
            'Look distracted then suddenly run off',
            'Long awkward pause then abruptly leave',
            'Make excuses that sound dishonest'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-red-950/50 rounded-xl border border-red-700/30">
              <X className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button updated to purple gradient */}
      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: Live Practice Simulator
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);

  const renderStep8 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <Play className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Conversation Simulator</h2>
        <p className="text-lg text-purple-300">Put it all together - live practice</p>
      </div>

      {!selectedScenario ? (
        <>
          {/* Scenario selection box updated from green to indigo theme */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Choose Your Scenario</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {simulatorScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenario(scenario.id);
                    setSimulatorStep(0);
                    setSimulatorScore(0);
                    setConversationEnergy(50);
                  }}
                  className="p-6 bg-indigo-950/50 rounded-2xl border-2 border-indigo-600/30 hover:border-indigo-400/50 transition-all text-left hover:scale-105"
                >
                  <div className="text-4xl mb-3">{scenario.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{scenario.title}</h4>
                  <p className="text-sm text-indigo-300 mb-3">{scenario.description}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    // Difficulty tags updated from green/blue to purple/indigo shades
                    scenario.difficulty === 'Beginner' ? 'bg-indigo-600/30 text-indigo-300' :
                    scenario.difficulty === 'Easy' ? 'bg-purple-600/30 text-purple-300' :
                    'bg-yellow-600/30 text-yellow-300'
                  }`}>
                    {scenario.difficulty}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Simulator main panel updated to purple/violet theme (kept from previous step) */}
          <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-purple-300">Score</p>
                  <p className="text-2xl font-bold text-white">{simulatorScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm text-purple-300">Energy</p>
                  <div className="w-32 h-2 bg-purple-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        // Energy bar colors: Green (High) updated to Indigo
                        conversationEnergy > 60 ? 'bg-indigo-500' :
                        conversationEnergy > 30 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${conversationEnergy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-violet-950/50 rounded-xl border border-violet-700/30 mb-4">
              <p className="text-violet-200">{conversationFlow.coffee[simulatorStep]?.ai}</p>
            </div>

            <div className="space-y-3">
              {conversationFlow.coffee[simulatorStep]?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSimulatorScore(simulatorScore + option.score);
                    setConversationEnergy(Math.max(0, Math.min(100, conversationEnergy + option.energy)));
                    showNotification(option.feedback);
                    if (simulatorStep < conversationFlow.coffee.length - 1) {
                      setTimeout(() => setSimulatorStep(simulatorStep + 1), 1500);
                    } else {
                      setTimeout(() => {
                        triggerConfetti();
                        showNotification('Scenario complete! 🎉');
                      }, 1500);
                    }
                  }}
                  className="w-full p-4 bg-pink-900/30 hover:bg-pink-800/40 rounded-xl border-2 border-pink-600/30 hover:border-pink-400/50 transition-all text-left"
                >
                  <p className="text-white">{option.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Complete box updated from green to indigo theme */}
          {simulatorStep >= conversationFlow.coffee.length - 1 && (
            <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Scenario Complete!</h3>
              <p className="text-indigo-300 mb-4">Final Score: {simulatorScore} points</p>
              <button
                onClick={() => {
                  setSelectedScenario(null);
                  setSimulatorStep(0);
                  setSimulatorScore(0);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all text-white"
              >
                Try Another Scenario
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={nextStep}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl font-bold hover:from-purple-500 hover:to-violet-700 transition-all shadow-xl flex items-center justify-center gap-2 text-white"
      >
        Next: Your Blueprint
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
);

  const renderStep9 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-blue-100 mb-3">Your Conversation Blueprint</h2>
        <p className="text-lg text-blue-300">Personalized strategy just for you</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Quick Assessment</h3>
        
        <div className="space-y-6">
          <div>
            <p className="text-purple-300 mb-3 font-semibold">1. Your biggest challenge?</p>
            <div className="grid md:grid-cols-2 gap-3">
              {['Starting conversations', 'Keeping them going', 'Transitioning topics', 'Reading social cues', 'Ending gracefully'].map((option) => (
                <button
                  key={option}
                  onClick={() => setConversationProfile({...conversationProfile, challenge: option})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    conversationProfile.challenge === option
                      ? 'bg-purple-600/50 border-purple-400'
                      : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  <p className="text-white">{option}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 mb-3 font-semibold">2. Your conversation style?</p>
            <div className="grid md:grid-cols-2 gap-3">
              {['Mostly listen', 'Balanced back-and-forth', 'Mostly talk', 'Depends on the person'].map((option) => (
                <button
                  key={option}
                  onClick={() => setConversationProfile({...conversationProfile, style: option})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    conversationProfile.style === option
                      ? 'bg-pink-600/50 border-pink-400'
                      : 'bg-pink-950/50 border-pink-700/30 hover:border-pink-500/50'
                  }`}
                >
                  <p className="text-white">{option}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 mb-3 font-semibold">3. Your comfort zone?</p>
            <div className="grid md:grid-cols-2 gap-3">
              {['One-on-one only', 'Small groups (2-4)', 'Any size group', 'Prefer avoiding (for now)'].map((option) => (
                <button
                  key={option}
                  onClick={() => setConversationProfile({...conversationProfile, comfortZone: option})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    conversationProfile.comfortZone === option
                      ? 'bg-cyan-600/50 border-cyan-400'
                      : 'bg-cyan-950/50 border-cyan-700/30 hover:border-cyan-500/50'
                  }`}
                >
                  <p className="text-white">{option}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {conversationProfile.challenge && conversationProfile.style && conversationProfile.comfortZone && (
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-blue-500/30 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-10 h-10 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Your Personal Blueprint</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-950/50 rounded-2xl border border-blue-700/30">
              <h4 className="font-bold text-blue-200 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Your Starting Strength
              </h4>
              <p className="text-white">
                {conversationProfile.style === 'Mostly listen' ? 'Active listening - you already have the foundation!' :
                 conversationProfile.style === 'Balanced back-and-forth' ? 'Natural conversationalist - great instincts!' :
                 'High energy - you bring enthusiasm!'}
              </p>
            </div>

            <div className="p-6 bg-cyan-950/50 rounded-2xl border border-cyan-700/30">
              <h4 className="font-bold text-cyan-200 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Growth Area
              </h4>
              <p className="text-white">{conversationProfile.challenge}</p>
            </div>

            <div className="p-6 bg-purple-950/50 rounded-2xl border border-purple-700/30 md:col-span-2">
              <h4 className="font-bold text-purple-200 mb-3">3 Techniques to Focus On First:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-200">
                  <ChevronRight className="w-4 h-4" />
                  <span>The Hook Engine (open-ended questions)</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200">
                  <ChevronRight className="w-4 h-4" />
                  <span>The Bridge Technique (smooth transitions)</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200">
                  <ChevronRight className="w-4 h-4" />
                  <span>The Reflection Technique (active listening)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* 💥 ADD THIS NAVIGATION BUTTON */}
{onNext && (
  <div className="mt-12">
    <button
      onClick={onNext}
      // Gradient updated from teal/cyan to purple/violet, and text remains white
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-500 hover:to-violet-700 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 text-white"
    >
      <Target className="w-6 h-6" />
      Continue to Next Prep Step
    </button>
  </div>
)}
    </div>
  );

  const renderStep10 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-blue-100 mb-3">Your 30-Day Mastery Plan</h2>
        <p className="text-lg text-blue-300">Transform your conversation skills</p>
      </div>

      <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-green-500/30 shadow-xl">
        <div className="space-y-6">
          {[
            {
              week: 'Week 1: Foundation',
              days: [
                'Day 1-2: Practice open-ended questions',
                'Day 3-4: Active listening exercises',
                'Day 5-7: Use one transition technique per day'
              ],
              color: 'from-blue-600 to-cyan-600'
            },
            {
              week: 'Week 2: Building Flow',
              days: [
                'Day 8-10: Yes-and principle in every conversation',
                'Day 11-13: Share mini-stories instead of facts',
                'Day 14: Reflection day (journal what worked)'
              ],
              color: 'from-purple-600 to-pink-600'
            },
            {
              week: 'Week 3: Advanced Skills',
              days: [
                'Day 15-17: Maintain 3+ topic shifts smoothly',
                'Day 18-20: Practice callbacks in conversations',
                'Day 21: Mid-challenge review'
              ],
              color: 'from-orange-600 to-red-600'
            },
            {
              week: 'Week 4: Mastery',
              days: [
                'Day 22-24: Have 5-minute+ conversations with strangers',
                'Day 25-27: Practice graceful exits',
                'Day 28-30: Integrate all techniques naturally'
              ],
              color: 'from-green-600 to-emerald-600'
            }
          ].map((week, weekIdx) => (
            <div key={weekIdx} className={`bg-gradient-to-r ${week.color}/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-500/30`}>
              <h3 className="text-xl font-bold text-white mb-4">{week.week}</h3>
              <div className="space-y-3">
                {week.days.map((day, dayIdx) => {
                  const dayNumber = weekIdx * 7 + dayIdx;
                  return (
                    <div key={dayIdx} className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newProgress = [...weeklyProgress];
                          newProgress[dayNumber] = !newProgress[dayNumber];
                          setWeeklyProgress(newProgress);
                          if (newProgress[dayNumber]) {
                            showNotification('Day completed! 🎉');
                          }
                        }}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          weeklyProgress[dayNumber]
                            ? 'bg-green-600 border-green-400'
                            : 'bg-blue-950/50 border-blue-600/30 hover:border-blue-400/50'
                        }`}
                      >
                        {weeklyProgress[dayNumber] && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <p className={`${weeklyProgress[dayNumber] ? 'text-green-300 line-through' : 'text-blue-200'}`}>
                        {day}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-pink-400" />
          Bonus Resources
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">50 Conversation Starters</p>
          </div>
          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
            <Play className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Video Examples</p>
          </div>
          <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
            <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-purple-200">Practice Mode</p>
          </div>
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-10 rounded-3xl border-2 border-blue-500/30 shadow-2xl text-center">
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform!</h3>
        <div className="max-w-md mx-auto mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-950/50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-blue-200">Learned 7 transitions</p>
            </div>
            <div className="p-4 bg-blue-950/50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-blue-200">Mastered 4 engines</p>
            </div>
            <div className="p-4 bg-blue-950/50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-blue-200">Practiced live scenarios</p>
            </div>
            <div className="p-4 bg-blue-950/50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-blue-200">Created your blueprint</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-cyan-900/30 rounded-2xl border border-cyan-600/30 mb-6">
          <p className="text-lg text-cyan-200 italic">
            "Great conversations aren't about saying the right thing—they're about being genuinely curious about people."
          </p>
        </div>

        <button
          onClick={() => {
            triggerConfetti();
            setTimeout(onNext, 1500);
          }}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto"
        >
          Continue Your Journey
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  // Main render function
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-fuchsia-900">
    
      {/* Progress Bar */}
      {/* Progress Bar */}
<div className="max-w-4xl mx-auto mb-8">
    <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white">Step {currentStep + 1} of {totalSteps}</span>
        <span className="text-sm text-white">{Math.round(progress)}% Complete</span>
    </div>
    <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
        <div 
            className="h-full bg-gradient-to-r from-purple-600 to-violet-800 transition-all duration-500"
            style={{ width: `${progress}%` }}
        />
    </div>
</div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 rounded-xl shadow-2xl border-2 border-green-400/30">
            <p className="text-white font-semibold">{notification}</p>
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
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
        {currentStep === 10 && renderStep10()}

        {/* Navigation */}
        {currentStep > 0 && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-blue-900/50 hover:bg-blue-800 rounded-xl border-2 border-blue-600/30 hover:border-blue-500/50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
          </div>
        )}
      </div>
      
       {/* Floating Next Button */}
      {currentStep < totalSteps - 1 && (
        <button
          onClick={nextStep}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 transition-all flex items-center justify-center group"
          title="Next Step"
        >
          <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConversationalFlow;