import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { apiKeys } from 'src/backend/keys/apiKeys';
import { getApiKeys } from "@/backend/apikeys";
import { MessageCircle, Send, CheckCircle, Star, Sparkles, Target, TrendingUp, Award, Clock, Zap, ChevronRight, Volume2, Mic, XCircle, Trophy, Flame } from "lucide-react";

// Types
interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: number;
}

interface ScenarioOption {
  id: string;
  text: string;
  isGenuine: boolean;
  feedback: string;
  xp: number;
}

interface Scenario {
  id: string;
  context: string;
  situation: string;
  character: string;
  options: ScenarioOption[];
}

// Flow stages
type FlowStage = 'intro' | 'chat' | 'scenario' | 'reflection' | 'mission' | 'complete';

// Mock AI Responses
const AI_RESPONSES = {
  greeting: "Hi! I'm your Genuine Appreciation coach. 🌟 Tell me about a recent interaction where you wanted to show appreciation but weren't sure how to express it genuinely.",
  followUp1: "That's a great example! What specific qualities or actions did this person demonstrate that you appreciated?",
  followUp2: "Excellent insight! Now, how could you express this in a way that feels authentic to you?",
  encouragement: "That's much more genuine! Specific appreciation makes people feel truly seen. Ready to practice with a real scenario?",
  scenarioIntro: "Let's practice! Here's a realistic situation you might encounter..."
};

// Scenarios
const SCENARIOS: Scenario[] = [
  {
    id: 'scenario1',
    context: 'workplace',
    situation: 'Your coworker Sarah stayed late last night to help you meet a tight deadline. The project was successful.',
    character: '👩‍💼',
    options: [
      {
        id: 'opt1',
        text: "Thanks for your help!",
        isGenuine: false,
        feedback: "This is polite but generic. It doesn't acknowledge what Sarah specifically did or the impact it had.",
        xp: 5
      },
      {
        id: 'opt2',
        text: "Sarah, I really appreciate you staying late to help with the analytics section. Your attention to detail caught errors I completely missed, and it made our presentation so much stronger.",
        isGenuine: true,
        feedback: "Perfect! This is genuine because it's specific (analytics section), acknowledges the sacrifice (staying late), recognizes a quality (attention to detail), and explains the impact (stronger presentation).",
        xp: 25
      },
      {
        id: 'opt3',
        text: "You're such a team player, Sarah!",
        isGenuine: false,
        feedback: "While positive, this is a surface-level compliment. It doesn't reference specific actions or show you truly noticed what she did.",
        xp: 10
      }
    ]
  },
  {
    id: 'scenario2',
    context: 'personal',
    situation: 'Your friend remembered your job interview and texted you asking how it went, even though they were dealing with their own stressful week.',
    character: '🧑‍🤝‍🧑',
    options: [
      {
        id: 'opt1',
        text: "Thanks for checking in!",
        isGenuine: false,
        feedback: "Too brief. Doesn't acknowledge that they made time despite their own stress.",
        xp: 5
      },
      {
        id: 'opt2',
        text: "I really appreciate that you remembered and reached out, especially knowing you've had a tough week yourself. It means a lot that you made space to care about what's going on with me.",
        isGenuine: true,
        feedback: "Excellent! You acknowledged their specific action (reaching out), recognized their context (tough week), and explained the emotional impact (means a lot).",
        xp: 25
      },
      {
        id: 'opt3',
        text: "You're the best friend ever!",
        isGenuine: false,
        feedback: "Hyperbolic and vague. Genuine appreciation is about specific observations, not generic superlatives.",
        xp: 10
      }
    ]
  }
];

interface GenuineAppreciationProps {
  onNext: () => void;
}

const GenuineAppreciation: React.FC<GenuineAppreciationProps> = ({ onNext }) => {
  const [stage, setStage] = useState<FlowStage>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [chatStep, setChatStep] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [reflection, setReflection] = useState('');
  const [missionTarget, setMissionTarget] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showScenarioButton, setShowScenarioButton] = useState(false);
  const [apiKeys, setApiKeys] = useState<string[]>([]);

useEffect(() => {
  async function loadKeys() {
    const keys = await getApiKeys();
    setApiKeys(keys);
  }
  loadKeys();
}, []);

  useEffect(() => {
    if (stage === 'chat' && messages.length === 0) {
      addBotMessage(AI_RESPONSES.greeting);
    }
  }, [stage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (content: string) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: Date.now()
      }]);
    }, 500);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now()
    }]);
  };

  
// Replace the handleSendMessage function with this corrected version:
const handleSendMessage = async () => {
  if (!userInput.trim()) return;

  addUserMessage(userInput);
  const currentMessage = userInput;
  setUserInput('');
  setIsLoading(true);

  let success = false;
  let result: any = null;

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    try {
      const response = await fetch('https://pythonbackend-74es.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          user_id: "HfwcJgkyNNb3T3UdWRDbrCiRQuS2",
          message: currentMessage,
          session_id: "some_session",
          api_key: "the_api_key",
          goal_name: "genuine-appreciation"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`API key ${i + 1} failed:`, errorText);
        continue; // try next key
      }

      result = await response.json();
      console.log(`✅ API Response with key ${i + 1}:`, result);
      success = true;
      break; // exit loop on success
    } catch (err) {
      console.warn(`🔥 Request failed with API key ${i + 1}:`, err);
    }
  }

  if (success && result) {
    if (result.reply) {
      addBotMessage(result.reply);

      // Update conversation state
      if (result.next_state) setChatStep(prev => prev + 1);

      // Show scenario button if final state reached
      if (chatStep >= 2 || result.next_state === 'action') setShowScenarioButton(true);
    } else {
      addBotMessage("Sorry, I didn't receive a proper response. Please try again.");
    }
  } else {
    console.warn('⚠️ All API keys failed, sending fallback message.');
    addBotMessage("Sorry, I'm having trouble connecting. Please check your internet and try again.");
  }

  setIsLoading(false);
};


  const handleStartScenario = () => {
    setStage('scenario');
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    const option = SCENARIOS[currentScenario].options.find(o => o.id === optionId);
    if (option) {
      setTotalXP(prev => prev + option.xp);
      
      if (option.isGenuine) {
        triggerConfetti();
      }
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setStage('reflection');
    }
  };

  const handleSaveReflection = () => {
    if (reflection.trim()) {
      setStage('mission');
    }
  };

  const handleSetMission = () => {
    if (missionTarget.trim()) {
      setStage('complete');
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // INTRO STAGE
  if (stage === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-2xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-medium text-amber-200">Core Social Skill</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Genuine Appreciation
          </h1>
          
          <p className="text-lg md:text-xl text-purple-200 max-w-xl mb-8">
            Express sincere appreciation—notice real qualities, not surface compliments.
          </p>

          {/* Hero Card */}
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-amber-400/30 shadow-2xl mb-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-8xl md:text-9xl mb-6 animate-bounce">❤️</div>
            
            {/* Stats Pills */}
            <div className="flex gap-3 justify-center flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-full border border-purple-500/30">
                <Target className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-200">Difficulty: Medium</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-900/50 rounded-full border border-green-500/30">
                <Trophy className="w-4 h-4 text-green-300" />
                <span className="text-sm text-green-200">Up to 50 XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/50 rounded-full border border-blue-500/30">
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-200">~5 mins</span>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 mb-8">
            <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              What You'll Learn
            </h3>
            <ul className="space-y-3 text-purple-200">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>How to express appreciation that feels authentic and specific</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Practice with realistic scenarios and get instant feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Create a personal action plan for your relationships</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={() => setStage('chat')}
            className="w-full px-6 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-lg font-bold shadow-xl flex items-center justify-center gap-2"
          >
            Start AI Coach Session
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // CHAT STAGE
  if (stage === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-100">AI Coach Session</h2>
            </div>
            <p className="text-purple-300 text-sm">Share your thoughts openly - this helps personalize your learning</p>
          </div>

          {/* Chat Messages */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-purple-950/50 border border-purple-700/30 text-purple-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            {chatStep < 3 ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response..."
                  className="flex-1 px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleStartScenario}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
              >
                Ready! Start Scenario Practice
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}

            {/* Skip Chat Button - Shows after first message exchange */}
            {messages.length >= 2 && chatStep < 3 && (
              <button
                onClick={handleStartScenario}
                className="w-full py-3 text-sm text-purple-400 hover:text-purple-300 transition-all flex items-center justify-center gap-2 bg-purple-950/30 rounded-xl border border-purple-700/30 hover:border-purple-600/50"
              >
                Skip to Practice Scenarios
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SCENARIO STAGE
  if (stage === 'scenario') {
    const scenario = SCENARIOS[currentScenario];
    const selectedOpt = scenario.options.find(o => o.id === selectedOption);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm font-medium">Scenario {currentScenario + 1} of {SCENARIOS.length}</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-700/30 rounded-full border border-purple-500/30">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-200">{totalXP} XP</span>
              </div>
            </div>
            <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentScenario + 1) / SCENARIOS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario Card */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{scenario.character}</div>
              <div className="inline-block px-4 py-2 bg-purple-700/30 rounded-full border border-purple-500/30 mb-4">
                <span className="text-sm text-purple-200 capitalize">{scenario.context}</span>
              </div>
              <p className="text-lg text-purple-100 leading-relaxed">{scenario.situation}</p>
            </div>

            <h3 className="text-xl font-bold text-purple-100 mb-4">How would you respond?</h3>
            
            <div className="space-y-3">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !showFeedback && handleSelectOption(option.id)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedOption === option.id
                      ? option.isGenuine
                        ? 'bg-green-900/30 border-green-500/50 shadow-lg'
                        : 'bg-red-900/30 border-red-500/50'
                      : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50 hover:bg-purple-900/40'
                  } ${showFeedback && selectedOption !== option.id ? 'opacity-50' : ''}`}
                >
                  <p className="text-purple-100">{option.text}</p>
                  {showFeedback && selectedOption === option.id && (
                    <div className="mt-3 pt-3 border-t border-purple-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        {option.isGenuine ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`font-bold ${option.isGenuine ? 'text-green-300' : 'text-red-300'}`}>
                          {option.isGenuine ? 'Excellent!' : 'Not quite'}
                        </span>
                        <span className="ml-auto text-yellow-300 font-bold">+{option.xp} XP</span>
                      </div>
                      <p className="text-sm text-purple-200">{option.feedback}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {showFeedback && (
            <Button
              onClick={handleNextScenario}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
            >
              {currentScenario < SCENARIOS.length - 1 ? 'Next Scenario' : 'Continue to Reflection'}
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // REFLECTION STAGE
  if (stage === 'reflection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-700/30 rounded-full border border-purple-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-purple-200">Personal Reflection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-purple-100">Time to Apply This</h2>
            <p className="text-purple-200">Reflection deepens learning and helps you remember</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 p-8 mb-6">
            <label className="block text-lg font-bold text-purple-100 mb-3">
              Think of someone in your life who deserves appreciation. What specific qualities or actions do you value about them?
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Example: My friend Alex always remembers small details about my life, like asking how my presentation went even weeks later. This shows they truly listen and care..."
              className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none min-h-[200px]"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-purple-400">{reflection.length} characters</span>
              <span className="text-xs text-purple-500">Aim for at least 100 characters</span>
            </div>
          </div>

          <Button
            onClick={handleSaveReflection}
            disabled={reflection.length < 50}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Save & Continue
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // MISSION STAGE
  if (stage === 'mission') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-700/30 rounded-full border border-orange-500/30">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-200">Today's Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-purple-100">Make It Real</h2>
            <p className="text-purple-200">Knowledge without action is just entertainment</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 backdrop-blur-md rounded-3xl border-2 border-orange-500/30 p-8 mb-6">
            <div className="text-6xl text-center mb-6">🎯</div>
            
            <label className="block text-lg font-bold text-purple-100 mb-3">
              Who will you express genuine appreciation to today?
            </label>
            <input
              type="text"
              value={missionTarget}
              onChange={(e) => setMissionTarget(e.target.value)}
              placeholder="Their name..."
              className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 mb-4"
            />

            <div className="bg-purple-950/30 rounded-2xl border border-purple-700/30 p-4">
              <p className="text-sm text-purple-200 mb-3">
                <strong className="text-purple-100">Your Challenge:</strong> Within the next 24 hours, express genuine appreciation to this person using the principles you learned.
              </p>
              <ul className="space-y-2 text-sm text-purple-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Be specific about what they did</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Acknowledge the qualities you appreciate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Explain the positive impact it had on you</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleSetMission}
            disabled={!missionTarget.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Accept Mission
            <Zap className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // COMPLETE STAGE
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Skill Unlocked!
          </h2>
          <p className="text-xl text-purple-200">You've mastered Genuine Appreciation</p>
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 p-8 mb-8">
          <h3 className="text-2xl font-bold text-purple-100 mb-6">Your Results</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-950/30 rounded-2xl border border-purple-700/30 p-4">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{totalXP}</p>
              <p className="text-sm text-purple-300">Total XP Earned</p>
            </div>
            
            <div className="bg-purple-950/30 rounded-2xl border border-purple-700/30 p-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{SCENARIOS.length}</p>
              <p className="text-sm text-purple-300">Scenarios Completed</p>
            </div>
          </div>

          <div className="bg-amber-900/20 rounded-2xl border border-amber-500/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-amber-200">Active Mission</span>
            </div>
            <p className="text-purple-100">Express appreciation to <strong className="text-white">{missionTarget}</strong></p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 p-8 mb-8">
          <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            What's Next?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3 p-4 bg-purple-950/30 rounded-2xl border border-purple-700/30">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold">1</span>
              </div>
              <div>
                <p className="font-bold text-purple-100 mb-1">Complete Your Mission</p>
                <p className="text-sm text-purple-300">Reach out to {missionTarget} within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-950/30 rounded-2xl border border-purple-700/30">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <div>
                <p className="font-bold text-purple-100 mb-1">Reflect on the Experience</p>
                <p className="text-sm text-purple-300">Notice how both you and they respond</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-950/30 rounded-2xl border border-purple-700/30">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <div>
                <p className="font-bold text-purple-100 mb-1">Continue Learning</p>
                <p className="text-sm text-purple-300">Move on to the next social skill</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Card */}
        <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 backdrop-blur-md rounded-3xl border-2 border-pink-500/30 p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div className="text-left">
              <p className="font-bold text-pink-100 mb-2">Pro Tip</p>
              <p className="text-sm text-pink-200">
                Genuine appreciation is most powerful when it's specific and unexpected. 
                Don't wait for special occasions—the random Tuesday compliment often means the most.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onNext}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
        >
          Continue to Next Skill
          <ChevronRight className="w-5 h-5" />
        </Button>

        <p className="text-sm text-purple-400 mt-4">
          You can always revisit this skill to practice more scenarios
        </p>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce-slow 1s ease-in-out infinite;
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default GenuineAppreciation;