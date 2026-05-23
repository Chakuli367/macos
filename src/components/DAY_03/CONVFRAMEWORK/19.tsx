import { useState, useEffect } from 'react';
import { 
  Sparkles, Trophy, Target, Award, CheckCircle, Star, 
  MessageCircle, Users, Zap, ArrowRight, Play, 
  TrendingUp, Brain, Coffee, Briefcase, Heart,
  ChevronRight, Clock, Flame, Book, Download
} from 'lucide-react';

// 💥 ADD THIS INTERFACE
interface REVIEWCONVProps {
    onNext?: () => void;
}
// ============================================================================
// CONSTANTS & DATA
// ============================================================================

import {  User, User2 } from "lucide-react";

const SCENARIOS = [
  {
    id: 1,
    title: "Coffee Shop Small Talk",
    context: "You're in line at a coffee shop, someone comments on the long wait",
    icon: <Coffee className="w-6 h-6" />,
    conversations: [
      {
        id: 'a',
        messages: [
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "Wow, this line is crazy today!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Yeah" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "..." }
        ],
        outcome: 'awkward',
        missing: 'exploration'
      },
      {
        id: 'b',
        messages: [
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "Wow, this line is crazy today!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Right? Do you come here often?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "First time actually!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Cool" }
        ],
        outcome: 'surface',
        missing: 'deepening'
      },
      {
        id: 'c',
        messages: [
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "Wow, this line is crazy today!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Right? Do you come here often?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "First time actually!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Oh nice! What made you try this place?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "Friend recommended it. They have the best pastries apparently!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "That's awesome! I'm here for the same reason. What do you do around here?" }
        ],
        outcome: 'great',
        missing: null
      }
    ]
  },
  {
    id: 2,
    title: "Networking Event",
    context: "You're at a professional mixer, standing near the refreshments",
    icon: <Briefcase className="w-6 h-6" />,
    conversations: [
      {
        id: 'a',
        messages: [
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Hey, I'm Alex" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "Hi, I'm Jordan" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Nice to meet you" }
        ],
        outcome: 'awkward',
        missing: 'exploration'
      },
      {
        id: 'b',
        messages: [
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "How do you know the host?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "I work with them" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "What do you do?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "I'm in marketing" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Cool" }
        ],
        outcome: 'surface',
        missing: 'deepening'
      },
      {
        id: 'c',
        messages: [
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "How do you know the host?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "I work with them" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Oh nice! What do you do?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "I'm in marketing" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "That's interesting! What kind of marketing?" },
          { person: 'Them', icon: <User2 className="inline w-4 h-4 mr-1" />, text: "Digital campaigns for tech startups. It's pretty exciting!" },
          { person: 'You', icon: <User className="inline w-4 h-4 mr-1" />, text: "Wow, tell me more! What's the most challenging part?" }
        ],
        outcome: 'great',
        missing: null
      }
    ]
  }
];

const INTERACTIVE_SCENARIOS = [
  {
    id: 'practice1',
    title: "Colleague Small Talk",
    context: "A colleague mentions they're working on something",
    difficulty: 'medium',
    situation: {
      setup: "You're at the office kitchen",
      theirIcon: <User2 className="inline w-4 h-4 mr-1" />,
      yourIcon: <User className="inline w-4 h-4 mr-1" />,
      theirMessage: "I'm working on a big project this week"
    },
    options: [
      { text: "Cool", phase: 'none', xp: 0, feedback: "❌ Conversation killer! No follow-up = awkward ending", nextMsg: "*awkward silence*" },
      { text: "What kind of project?", phase: 'exploration', xp: 15, feedback: "✅ Good! You're exploring, but can go deeper", nextMsg: "It's a client presentation for our biggest account" },
      { text: "Tell me more! What's the most challenging part?", phase: 'deepening', xp: 30, feedback: "🌟 Perfect! You're deepening the conversation!", nextMsg: "The timeline is tight, but I'm excited about the creative direction!" }
    ]
  },
  {
    id: 'practice2',
    title: "Friend Catch-up",
    context: "A friend shares weekend plans",
    difficulty: 'easy',
    situation: {
      setup: "Texting with a friend",
      theirIcon: <User2 className="inline w-4 h-4 mr-1" />,
      yourIcon: <User className="inline w-4 h-4 mr-1" />,
      theirMessage: "Going hiking this weekend!"
    },
    options: [
      { text: "Nice", phase: 'none', xp: 0, feedback: "❌ Too short! Show interest", nextMsg: "..." },
      { text: "Where are you hiking?", phase: 'exploration', xp: 15, feedback: "✅ Great question! Keep it going", nextMsg: "Thinking about the trails near Blue Lake" },
      { text: "That sounds amazing! What made you pick hiking?", phase: 'deepening', xp: 30, feedback: "🌟 Excellent! You're connecting deeply!", nextMsg: "I've been stressed lately, need to reset in nature you know?" }
    ]
  },
  {
    id: 'practice3',
    title: "First Date",
    context: "They mention their hobby",
    difficulty: 'hard',
    situation: {
      setup: "Coffee date, getting to know each other",
      theirIcon: <User2 className="inline w-4 h-4 mr-1" />,
      yourIcon: <User className="inline w-4 h-4 mr-1" />,
      theirMessage: "I recently started learning guitar"
    },
    options: [
      { text: "That's cool", phase: 'none', xp: 0, feedback: "❌ Generic response. Show genuine interest!", nextMsg: "*checks phone*" },
      { text: "How long have you been playing?", phase: 'exploration', xp: 15, feedback: "✅ Good start! But there's more to discover", nextMsg: "About 3 months now" },
      { text: "That's awesome! What inspired you to start? Any songs you're excited to learn?", phase: 'deepening', xp: 30, feedback: "🌟 Perfect! Multi-layered question creates connection!", nextMsg: "Actually, I've always loved music but was scared to try. Now I'm obsessed!" }
    ]
  }
];


const CONVERSATION_PHASES = [
  {
    phase: 'opening',
    icon: '🚪',
    title: 'Opening',
    description: 'The first impression - greeting + hook',
    examples: [
      'Question-based: "How do you know the host?"',
      'Context-based: "This event is amazing!"',
      'Direct: "Hey! I\'m [name]"'
    ],
    tips: 'Start with energy and genuine interest',
    color: 'from-gray-700 to-gray-600'
  },
  {
    phase: 'exploration',
    icon: '🔍',
    title: 'Exploration',
    description: 'Surface-level discovery - basic questions',
    examples: [
      '"What do you do?"',
      '"How long have you been here?"',
      '"Where are you from?"'
    ],
    tips: 'Ask open-ended questions to find common ground',
    color: 'from-purple-500 to-pink-500'
  },
  {
    phase: 'deepening',
    icon: '💎',
    title: 'Deepening',
    description: 'Where real connection happens - follow-ups + stories',
    examples: [
      '"Tell me more about that!"',
      '"What\'s the most challenging part?"',
      '"How did you get into that?"'
    ],
    tips: 'This is where most people fail. Go deeper!',
    color: 'from-orange-500 to-red-500'
  },
  {
    phase: 'closing',
    icon: '👋',
    title: 'Closing',
    description: 'Leave a positive impression - summary + next step',
    examples: [
      '"This was great! Let\'s grab coffee sometime"',
      '"Really enjoyed chatting! Here\'s my card"',
      '"Thanks for the chat! See you around"'
    ],
    tips: 'End with intention, not awkwardness',
    color: 'from-green-500 to-emerald-500'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CONVFRAME({ onNext }: REVIEWCONVProps) {
  const [phase, setPhase] = useState(1);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [practiceScenario, setPracticeScenario] = useState(0);
  const [userChoices, setUserChoices] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    strengths: [],
    weaknesses: [],
    naturalStyle: ''
  });
  const [timer, setTimer] = useState(5);
  const [timerActive, setTimerActive] = useState(false);

  // Timer for practice scenarios
  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timer]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleConvoSelect = (convoId, outcome, missing) => {
    setSelectedConvo(convoId);
    setShowFeedback(true);
    
    // Track user's pattern recognition
    const choice = { scenario: currentScenario, outcome, missing, correct: missing !== null };
    setUserChoices([...userChoices, choice]);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  const handlePracticeChoice = (option) => {
    setTimerActive(false);
    setShowFeedback(true);
    
    const choice = {
      scenario: practiceScenario,
      phase: option.phase,
      xp: option.xp
    };
    
    setUserChoices([...userChoices, choice]);
    setXp(xp + option.xp);
    
    if (option.phase === 'deepening') {
      setStreak(streak + 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (practiceScenario < INTERACTIVE_SCENARIOS.length - 1) {
        setPracticeScenario(practiceScenario + 1);
        setTimer(5);
      } else {
        analyzeUserProfile();
        setPhase(6);
      }
    }, 3000);
  };

  const analyzeUserProfile = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const deepeningCount = userChoices.filter(c => c.phase === 'deepening').length;
      const explorationCount = userChoices.filter(c => c.phase === 'exploration').length;
      const noneCount = userChoices.filter(c => c.phase === 'none').length;

      let strengths = [];
      let weaknesses = [];
      let style = '';

      if (deepeningCount >= 2) {
        strengths.push('Deepening Phase');
        style = 'Deep Connector';
      } else if (explorationCount >= 2) {
        strengths.push('Exploration Phase');
        style = 'Curious Questioner';
        weaknesses.push('Deepening Phase - Need more follow-ups');
      } else {
        weaknesses.push('Deepening Phase - Practice follow-up questions');
        weaknesses.push('Exploration Phase - Ask more open questions');
        style = 'Developing';
      }

      if (deepeningCount === 0) {
        weaknesses.push('Following up deeply on responses');
      }

      setUserProfile({ strengths, weaknesses, naturalStyle: style });
      setAnalyzing(false);
    }, 2000);
  };

  const nextPhase = () => {
    setPhase(phase + 1);
    if (phase === 4) {
      setTimer(5);
      setTimerActive(true);
    }
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedConvo(null);
    } else {
      nextPhase();
    }
  };

  // ============================================================================
  // PHASE RENDERERS
  // ============================================================================

  const renderPhase1 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
          <span className="text-xs md:text-sm font-medium text-purple-200">Conversation Detective</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          What Makes Conversations Work?
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Watch these 3 conversations. Can you spot the difference?
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          {SCENARIOS[currentScenario].icon}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{SCENARIOS[currentScenario].title}</h2>
            <p className="text-sm md:text-base text-purple-300">{SCENARIOS[currentScenario].context}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {SCENARIOS[currentScenario].conversations.map((convo, idx) => (
            <button
              key={convo.id}
              onClick={() => handleConvoSelect(convo.id, convo.outcome, convo.missing)}
              className={`p-5 md:p-6 rounded-2xl border-2 transition-all text-left ${
                selectedConvo === convo.id
                  ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 scale-105'
                  : 'bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm md:text-base font-bold text-purple-300">Version {idx + 1}</span>
                {convo.outcome === 'great' && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                {convo.outcome === 'surface' && <Star className="w-5 h-5 text-orange-400" />}
                {convo.outcome === 'awkward' && <Star className="w-5 h-5 text-gray-500" />}
              </div>

              <div className="space-y-3">
                {convo.messages.map((msg, i) => (
                  <div key={i} className={`${msg.person === 'You' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block px-4 py-2 rounded-2xl text-sm md:text-base ${
                      msg.person === 'You' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-800/60 text-purple-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {selectedConvo === convo.id && showFeedback && (
                <div className={`mt-4 p-3 rounded-xl border-2 ${
                  convo.outcome === 'great' 
                    ? 'bg-green-500/20 border-green-400/50 text-green-100'
                    : convo.outcome === 'surface'
                    ? 'bg-orange-500/20 border-orange-400/50 text-orange-100'
                    : 'bg-red-500/20 border-red-400/50 text-red-100'
                }`}>
                  <p className="text-sm font-medium">
                    {convo.outcome === 'great' && '✅ Perfect! All phases included'}
                    {convo.outcome === 'surface' && '⚠️ Missing: Deepening Phase'}
                    {convo.outcome === 'awkward' && '❌ Missing: Follow-up Questions'}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={nextScenario}
          disabled={!selectedConvo}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
        >
          {currentScenario < SCENARIOS.length - 1 ? 'Next Scenario' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          The Pattern You Just Discovered
        </h1>
        <p className="text-base md:text-lg text-purple-200">
          Every great conversation follows the same structure
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-red-900/40 to-purple-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-red-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Awkward Conversations</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <p className="text-purple-200 text-sm md:text-base mb-2">Opening ✓</p>
              <p className="text-purple-400 text-xs md:text-sm">Started, but...</p>
            </div>
            <div className="p-4 bg-purple-950/40 rounded-xl border border-red-700/50">
              <p className="text-red-200 text-sm md:text-base mb-2">No Exploration ✗</p>
              <p className="text-red-400 text-xs md:text-sm">Skipped questions!</p>
            </div>
            <div className="p-4 bg-purple-950/40 rounded-xl border border-red-700/50">
              <p className="text-red-200 text-sm md:text-base mb-2">No Deepening ✗</p>
              <p className="text-red-400 text-xs md:text-sm">Never went deeper</p>
            </div>
            <div className="p-4 bg-purple-950/40 rounded-xl border border-red-700/50">
              <p className="text-red-200 text-sm md:text-base mb-2">Abrupt End ✗</p>
              <p className="text-red-400 text-xs md:text-sm">Awkward silence</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-purple-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Great Conversations</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-gray-
500/20 to-gray-
500/20 rounded-xl border border-white
400/50">
              <p className="text-white text-sm md:text-base mb-2">🚪 Opening</p>
              <p className="text-gray-200 text-xs md:text-sm">"How do you know the host?"</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/50">
              <p className="text-purple-100 text-sm md:text-base mb-2">🔍 Exploration</p>
              <p className="text-purple-300 text-xs md:text-sm">"What do you do?"</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/50">
              <p className="text-orange-100 text-sm md:text-base mb-2">💎 Deepening</p>
              <p className="text-orange-300 text-xs md:text-sm">"Tell me more about that!"</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/50">
              <p className="text-green-100 text-sm md:text-base mb-2">👋 Closing</p>
              <p className="text-green-300 text-xs md:text-sm">"Let's grab coffee!"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl text-center">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Key Insight</h3>
        <p className="text-base md:text-lg text-purple-200 max-w-2xl mx-auto">
          Most conversations fail at the <span className="text-orange-400 font-bold">Deepening Phase</span>. 
          That's where you ask follow-up questions and share stories. Master this, master conversations!
        </p>
      </div>

      <button
        onClick={nextPhase}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        Let's Practice This
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderPhase3 = () => {
    const scenario = INTERACTIVE_SCENARIOS[practiceScenario];
    
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-800/40 backdrop-blur-sm rounded-full border border-orange-500/30">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-orange-300" />
            <span className="text-xs md:text-sm font-medium text-orange-200">Practice Mode</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-red-200 to-pink-300 bg-clip-text text-transparent">
            Your Turn: Choose Wisely
          </h1>
          <p className="text-base md:text-lg text-purple-200">
            Scenario {practiceScenario + 1} of {INTERACTIVE_SCENARIOS.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{scenario.title}</h2>
              <p className="text-sm md:text-base text-purple-300">{scenario.situation.setup}</p>
            </div>
            
          </div>

          {timerActive && (
            <div className="mb-6 p-4 bg-orange-500/20 border-2 border-orange-400/50 rounded-2xl">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-6 h-6 text-orange-300" />
                <span className="text-3xl font-bold text-orange-100">{timer}s</span>
              </div>
              <p className="text-center text-sm text-orange-200 mt-2">Quick! Like a real conversation</p>
            </div>
          )}

          <div className="p-6 bg-purple-950/40 rounded-2xl border border-purple-700/30 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-200" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-400 mb-1">Them:</p>
                <p className="text-base md:text-lg text-white">{scenario.situation.theirMessage}</p>
              </div>
            </div>
          </div>

          {!showFeedback ? (
            <div className="space-y-3">
              <p className="text-sm md:text-base text-purple-300 mb-3">What's your response?</p>
              {scenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handlePracticeChoice(option);
                  }}
                  disabled={timerActive && timer === 0}
                  className="w-full p-5 bg-gradient-to-br from-purple-800/40 to-indigo-800/40 hover:from-purple-700/60 hover:to-indigo-700/60 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-left shadow-lg disabled:opacity-50"
                >
                  <p className="text-base md:text-lg text-white font-medium mb-2">{option.text}</p>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-purple-400">
                    {option.xp > 0 && (
                      <>
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>+{option.xp} XP</span>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {scenario.options.map((option, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border-2 ${
                  userChoices[userChoices.length - 1]?.phase === option.phase
                    ? option.phase === 'deepening'
                      ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400/50'
                      : option.phase === 'exploration'
                      ? 'bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border-orange-400/50'
                      : 'bg-gradient-to-br from-red-500/30 to-pink-500/30 border-red-400/50'
                    : 'bg-purple-950/20 border-purple-700/20 opacity-50'
                }`}>
                  <p className="text-base md:text-lg text-white font-medium mb-2">{option.text}</p>
                  {userChoices[userChoices.length - 1]?.phase === option.phase && (
                    <>
                      <p className="text-sm md:text-base text-white/90 mb-2">{option.feedback}</p>
                      <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-700/30 mt-3">
                        <p className="text-sm text-purple-200 mb-1">Their response:</p>
                        <p className="text-sm md:text-base text-white">{option.nextMsg}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {streak > 0 && (
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md p-4 rounded-2xl border-2 border-orange-400/50 flex items-center justify-center gap-3">
            <Flame className="w-6 h-6 text-orange-400" />
            <p className="text-white font-bold">{streak} Deepening Streak! 🔥</p>
          </div>
        )}
      </div>
    );
  };

  const renderPhase4 = () => (
    <div className="space-y-6 md:space-y-8">
      {analyzing ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Analyzing Your Style...</h2>
          <p className="text-purple-300">Identifying patterns in your choices</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Your Conversation Style Profile
            </h1>
            <p className="text-base md:text-lg text-purple-200">
              Based on your choices, here's what we discovered
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Your Strengths</h2>
              </div>
              {userProfile.strengths.length > 0 ? (
                <div className="space-y-3">
                  {userProfile.strengths.map((strength, idx) => (
                    <div key={idx} className="p-4 bg-green-500/10 rounded-xl border border-green-400/30">
                      <p className="text-green-100 text-sm md:text-base">✅ {strength}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-300 text-sm md:text-base">Keep practicing to build strengths!</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-orange-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Growth Opportunities</h2>
              </div>
              <div className="space-y-3">
                {userProfile.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="p-4 bg-orange-500/10 rounded-xl border border-orange-400/30">
                    <p className="text-orange-100 text-sm md:text-base">🎯 {weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-purple-200">Your Natural Style</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{userProfile.naturalStyle}</h2>
              <p className="text-purple-300 text-sm md:text-base max-w-2xl mx-auto">
                {userProfile.naturalStyle === 'Deep Connector' && 'You naturally ask follow-up questions and create deep connections. This is rare and valuable!'}
                {userProfile.naturalStyle === 'Curious Questioner' && 'You ask good questions but can go deeper. Practice the Deepening Phase to unlock stronger connections.'}
                {userProfile.naturalStyle === 'Developing' && 'You\'re building foundational skills. Focus on asking more questions and following up on responses.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{xp}</p>
                <p className="text-xs md:text-sm text-purple-300">Total XP Earned</p>
              </div>
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{streak}</p>
                <p className="text-xs md:text-sm text-purple-300">Deepening Streak</p>
              </div>
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{userChoices.length}</p>
                <p className="text-xs md:text-sm text-purple-300">Scenarios Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Book className="w-6 h-6 text-indigo-400" />
              Your Personalized Practice Plan
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-700/30">
                <p className="text-indigo-300 text-sm font-medium mb-2">This Week's Focus:</p>
                <p className="text-white text-base md:text-lg font-bold">
                  {userProfile.weaknesses[0] || 'Master the Deepening Phase'}
                </p>
              </div>
              <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-700/30">
                <p className="text-indigo-300 text-sm font-medium mb-2">Daily Goal:</p>
                <p className="text-white text-base">Ask 1 follow-up question in every conversation</p>
              </div>
              <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-700/30">
                <p className="text-indigo-300 text-sm font-medium mb-2">Trigger Phrase:</p>
                <p className="text-white text-base">"Tell me more about that..."</p>
              </div>
            </div>
          </div>

          <button
            onClick={nextPhase}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-base md:text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            See the Perfect Conversation Architecture
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );

  const renderPhase5 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-800/40 backdrop-blur-sm rounded-full border border-amber-500/30">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-medium text-amber-200">The Master Blueprint</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
          The Architecture of Perfect Conversations
        </h1>
        <p className="text-base md:text-lg text-purple-200 max-w-3xl mx-auto">
          Every great conversation follows this proven structure. Master these 4 phases and transform your social life.
        </p>
      </div>

      <div className="space-y-6">
        {CONVERSATION_PHASES.map((phase, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-700/40 via-purple-800/40 to-purple-900/40 p-1">
              <div className="bg-purple-950/90 backdrop-blur-sm p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl md:text-6xl">{phase.icon}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        Phase {idx + 1}: {phase.title}
                      </h2>
                    </div>
                    <p className="text-base md:text-lg text-purple-200">{phase.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                      Example Phrases
                    </h3>
                    {phase.examples.map((example, i) => (
                      <div key={i} className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                        <p className="text-purple-100 text-sm md:text-base">{example}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-2xl border-2 border-purple-500/30">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Pro Tip
                    </h3>
                    <p className="text-purple-100 text-sm md:text-base leading-relaxed">{phase.tips}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border-2 border-amber-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 md:w-20 md:h-20 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            The Complete Conversation Flow
          </h2>
          <p className="text-purple-200 text-base md:text-lg max-w-2xl mx-auto">
            Watch how all 4 phases connect to create memorable interactions
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white
400/50">
              <span className="text-xl">🚪</span>
            </div>
            <div className="flex-1 p-4 bg-gray-500/10 rounded-xl border border-white
400/30">
              <p className="text-white font-medium text-sm md:text-base">"Hey! How do you know the host?"</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ChevronRight className="w-6 h-6 text-purple-400 rotate-90" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-purple-400/50">
              <span className="text-xl">🔍</span>
            </div>
            <div className="flex-1 p-4 bg-purple-500/10 rounded-xl border border-purple-400/30">
              <p className="text-purple-100 font-medium text-sm md:text-base">"What do you do? How long have you been in the industry?"</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ChevronRight className="w-6 h-6 text-purple-400 rotate-90" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-orange-400/50">
              <span className="text-xl">💎</span>
            </div>
            <div className="flex-1 p-4 bg-orange-500/10 rounded-xl border border-orange-400/30">
              <p className="text-orange-100 font-medium text-sm md:text-base">"That sounds fascinating! What's the most challenging project you've worked on?"</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ChevronRight className="w-6 h-6 text-purple-400 rotate-90" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-400/50">
              <span className="text-xl">👋</span>
            </div>
            <div className="flex-1 p-4 bg-green-500/10 rounded-xl border border-green-400/30">
              <p className="text-green-100 font-medium text-sm md:text-base">"This was great chatting! Let's grab coffee sometime - here's my card!"</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border-2 border-purple-400/50 text-center">
          <p className="text-xl md:text-2xl font-bold text-white mb-2">
            Duration: 5-10 minutes
          </p>
          <p className="text-purple-200 text-sm md:text-base">
            Result: Real connection, memorable impression, potential friendship or opportunity
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-2xl border-2 border-purple-500/30 text-center">
          <Award className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">{userChoices.length}</p>
          <p className="text-sm md:text-base text-purple-300">Scenarios Completed</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-2xl border-2 border-purple-500/30 text-center">
          <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">{xp}</p>
          <p className="text-sm md:text-base text-purple-300">XP Earned</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-2xl border-2 border-purple-500/30 text-center">
          <Brain className="w-10 h-10 text-pink-400 mx-auto mb-3" />
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">Master</p>
          <p className="text-sm md:text-base text-purple-300">Level Unlocked</p>
        </div>
      </div>

      {/* 💥 ADD THIS NAVIGATION BUTTON */}
        {onNext && (
    <div className="mt-12">
        <button
            onClick={onNext}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-500 hover:to-violet-700 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 text-white"
        >
            <Target className="w-6 h-6" />
            Continue to Next Prep Step
        </button>
    </div>
)}
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm md:text-base text-purple-300 font-medium">Progress</span>
            <span className="text-sm md:text-base text-purple-300 font-medium">Phase {phase} of 5</span>
          </div>
          <div className="h-3 md:h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(phase / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Phase Content */}
        {phase === 1 && renderPhase1()}
        {phase === 2 && renderPhase2()}
        {phase === 3 && renderPhase3()}
        {phase === 4 && renderPhase4()}
        {phase === 5 && renderPhase5()}
        {phase === 6 && renderPhase5()}
      </div>

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

        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        button, a, input, select, textarea {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        button {
          -webkit-user-select: none;
          user-select: none;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #a78bfa;
          outline-offset: 2px;
        }

        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}