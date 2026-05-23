// Add these imports at the top
import { 
  MessageCircle, ArrowRight, ArrowLeft, CheckCircle, 
  Users, Coffee, Smile, TrendingUp, Lightbulb,
  X, Play, Volume2, VolumeX, Target, Zap,
  Award, ThumbsUp, AlertCircle, BookOpen, Brain,
  Heart, Wind, Shield, Sparkles, Send, Loader, Bot
} from 'lucide-react';
import { useState } from 'react';
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


// Social Anxiety Support Component
function SocialAnxietyStep({ onNext }) {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);

  const techniques = [
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600',
      description: 'Anchor yourself in the present moment',
      steps: [
        '5 things you can SEE around you',
        '4 things you can TOUCH',
        '3 things you can HEAR',
        '2 things you can SMELL',
        '1 thing you can TASTE'
      ],
      whenToUse: 'Before entering a social situation when you feel overwhelmed'
    },
    {
      id: 'breathing',
      title: 'Box Breathing',
      icon: <Wind className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      description: 'Calm your nervous system instantly',
      steps: [
        'Breathe IN for 4 counts',
        'HOLD for 4 counts',
        'Breathe OUT for 4 counts',
        'HOLD for 4 counts',
        'Repeat 4 times'
      ],
      whenToUse: 'Right before approaching someone or when anxiety spikes'
    },
    {
      id: 'reframing',
      title: 'Thought Reframing',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-green-600 to-emerald-600',
      description: 'Challenge anxious thoughts',
      steps: [
        'Anxious thought: "They\'ll think I\'m boring"',
        'Challenge: "Can I read minds? No."',
        'Reframe: "I\'m interested in them, that\'s what matters"',
        'Evidence: "Most people appreciate friendly conversation"',
        'Action: "I\'ll focus on being curious, not impressive"'
      ],
      whenToUse: 'When negative self-talk starts before/during conversations'
    },
    {
      id: 'exposure',
      title: 'Gradual Exposure Ladder',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-orange-600 to-red-600',
      description: 'Build confidence step by step',
      steps: [
        'Level 1: Smile at a stranger',
        'Level 2: Say "excuse me" or "thank you"',
        'Level 3: Ask a quick question (time, directions)',
        'Level 4: Make a contextual comment',
        'Level 5: Have a 2-minute conversation'
      ],
      whenToUse: 'Your weekly practice plan - master each level before moving up'
    },
    {
      id: 'affirmations',
      title: 'Power Affirmations',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-yellow-600 to-amber-600',
      description: 'Reprogram your self-talk',
      steps: [
        '"I am worthy of connection"',
        '"Awkwardness is temporary, growth is permanent"',
        '"I don\'t need to be perfect, just present"',
        '"Every conversation is practice, not a test"',
        '"I bring value by being genuinely curious"'
      ],
      whenToUse: 'Every morning and before social events'
    },
    {
      id: 'physical',
      title: 'Body Reset Techniques',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-indigo-600 to-violet-600',
      description: 'Release physical tension',
      steps: [
        'Shake out your hands for 10 seconds',
        'Roll your shoulders back 5 times',
        'Do 10 power poses (hands on hips, chest out)',
        'Splash cold water on your face',
        'Jump up and down 5 times'
      ],
      whenToUse: 'In the bathroom before a social event'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">
        Social Anxiety Support Toolkit
      </h2>
      
      <p className="text-xl text-slate-300 text-center mb-12">
        Feeling nervous before conversations is <span className="text-blue-400 font-semibold">completely normal</span>. 
        These techniques help you manage anxiety and build confidence over time.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {techniques.map((technique) => (
          <motion.button
            key={technique.id}
            onClick={() => setSelectedTechnique(selectedTechnique === technique.id ? null : technique.id)}
            whileHover={{ scale: 1.02 }}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedTechnique === technique.id
                ? 'border-blue-500 bg-slate-800/80'
                : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${technique.color} flex items-center justify-center mb-4 text-white`}>
              {technique.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{technique.title}</h3>
            <p className="text-slate-400 text-sm">{technique.description}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTechnique && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
          >
            {(() => {
              const technique = techniques.find(t => t.id === selectedTechnique);
              return (
                <>
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${technique.color} text-white`}>
                      {technique.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{technique.title}</h3>
                      <p className="text-slate-300 text-lg">{technique.description}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-blue-400">How to do it:</h4>
                    <div className="space-y-3">
                      {technique.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-400 font-bold">{index + 1}</span>
                          </div>
                          <p className="text-slate-300 pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
                    <h4 className="text-lg font-semibold mb-2 text-purple-400 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      When to use this:
                    </h4>
                    <p className="text-slate-300">{technique.whenToUse}</p>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
        <div className="flex items-start gap-4">
          <Heart className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2 text-green-400">Remember</h3>
            <p className="text-slate-300 leading-relaxed">
              Social anxiety doesn't mean you're broken—it means you care about connections. 
              These techniques aren't about eliminating nervousness, they're about 
              <span className="text-blue-400 font-semibold"> managing it so you can show up anyway</span>. 
              Progress over perfection. 💚
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Practice Component
function AIPracticeStep({ onNext }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const scenarios = [
    {
      id: 'coffee_shop',
      title: 'Coffee Shop Encounter',
      description: 'Practice starting a conversation while waiting in line',
      icon: <Coffee className="w-8 h-8" />,
      color: 'from-amber-600 to-orange-600',
      difficulty: 'Easy',
      aiPersonality: 'friendly and relaxed, someone who enjoys chatting',
      context: 'You\'re both waiting in line at a busy coffee shop'
    },
    {
      id: 'gym',
      title: 'Gym Small Talk',
      description: 'Connect with someone at the gym',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-red-600 to-pink-600',
      difficulty: 'Medium',
      aiPersonality: 'focused but approachable, into fitness',
      context: 'You\'re both at the gym, they just finished using equipment you need'
    },
    {
      id: 'networking',
      title: 'Networking Event',
      description: 'Professional mingling practice',
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600',
      difficulty: 'Hard',
      aiPersonality: 'professional but friendly, open to networking',
      context: 'You\'re at a networking event and see someone standing alone'
    }
  ];

  const startConversation = async (scenario) => {
    setSelectedScenario(scenario);
    setConversationStarted(true);
    setConversationHistory([]);
    setFeedback(null);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are roleplaying as ${scenario.aiPersonality} in this scenario: ${scenario.context}. 

The user will practice starting a conversation with you. Respond naturally and realistically as this character would. Keep responses brief (1-2 sentences) to simulate real conversation flow. Be helpful but don't make it too easy - respond as a real person would, including occasional short answers that require the user to keep the conversation going.

Start by simply existing in the scene - don't initiate conversation, wait for the user to approach you.`
          }]
        })
      });

      const data = await response.json();
      const aiMessage = data.content.find(block => block.type === 'text')?.text || 'Hey there!';
      
      setConversationHistory([
        { role: 'system', content: `[Scene: ${scenario.context}]` },
        { role: 'ai', content: aiMessage }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setConversationHistory([
        { role: 'system', content: `[Scene: ${scenario.context}]` },
        { role: 'ai', content: '*Person is quietly waiting, looking at their phone*' }
      ]);
    }

    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: userInput }
    ];
    setConversationHistory(newHistory);
    setUserInput('');
    setIsLoading(true);

    try {
      const conversationForAPI = newHistory
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.content
        }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: conversationForAPI
        })
      });

      const data = await response.json();
      const aiMessage = data.content.find(block => block.type === 'text')?.text || 'Interesting!';
      
      setConversationHistory([
        ...newHistory,
        { role: 'ai', content: aiMessage }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setConversationHistory([
        ...newHistory,
        { role: 'ai', content: 'That\'s cool!' }
      ]);
    }

    setIsLoading(false);
  };

  const getFeedback = async () => {
    setIsLoading(true);

    try {
      const conversationText = conversationHistory
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'You' : 'Them'}: ${msg.content}`)
        .join('\n');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Analyze this small talk conversation and provide constructive feedback. Focus on:
1. What they did well
2. What they could improve
3. One specific tip for next time

Conversation:
${conversationText}

Provide encouraging, specific feedback in a friendly tone.`
          }]
        })
      });

      const data = await response.json();
      const feedbackText = data.content.find(block => block.type === 'text')?.text || 'Great job practicing!';
      
      setFeedback(feedbackText);
    } catch (error) {
      console.error('Error:', error);
      setFeedback('Great job practicing! Keep working on being natural and curious.');
    }

    setIsLoading(false);
  };

  const resetConversation = () => {
    setSelectedScenario(null);
    setConversationStarted(false);
    setConversationHistory([]);
    setFeedback(null);
    setUserInput('');
  };

  if (!conversationStarted) {
    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6">
          AI Conversation Practice
        </h2>
        
        <p className="text-xl text-slate-300 text-center mb-12">
          Practice with an AI partner in realistic scenarios. Get instant feedback and build confidence in a safe space.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50"
            >
              <div className={`bg-gradient-to-br ${scenario.color} p-6`}>
                <div className="text-white mb-4">
                  {scenario.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{scenario.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  scenario.difficulty === 'Easy' ? 'bg-green-500/20 text-green-200' :
                  scenario.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-200' :
                  'bg-red-500/20 text-red-200'
                }`}>
                  {scenario.difficulty}
                </span>
              </div>
              
              <div className="p-6">
                <p className="text-slate-300 mb-6">{scenario.description}</p>
                <button
                  onClick={() => startConversation(scenario)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  Start Practice
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-400" />
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">1</div>
              <h4 className="font-semibold mb-2">Choose a scenario</h4>
              <p className="text-slate-400 text-sm">Pick a situation you want to practice</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">2</div>
              <h4 className="font-semibold mb-2">Have a conversation</h4>
              <p className="text-slate-400 text-sm">Type responses like you would in real life</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">3</div>
              <h4 className="font-semibold mb-2">Get feedback</h4>
              <p className="text-slate-400 text-sm">Learn what worked and how to improve</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{selectedScenario.title}</h2>
          <p className="text-slate-400">{selectedScenario.context}</p>
        </div>
        <button
          onClick={resetConversation}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Change Scenario
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 mb-6 h-96 overflow-y-auto p-6">
        {conversationHistory.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'system' ? 'text-center' : ''}`}>
            {message.role === 'system' ? (
              <div className="text-slate-500 italic text-sm">{message.content}</div>
            ) : (
              <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'ai' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}>
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-slate-700 text-slate-100 p-4 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!feedback ? (
        <>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your response..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!userInput.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-6 py-4 rounded-xl font-medium transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {conversationHistory.filter(m => m.role !== 'system').length >= 6 && (
            <button
              onClick={getFeedback}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-medium transition-all"
            >
              Get Feedback on This Conversation
            </button>
          )}
        </>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-400" />
            Your Feedback
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 whitespace-pre-wrap">{feedback}</p>
          </div>
          <button
            onClick={resetConversation}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-medium transition-all"
          >
            Try Another Scenario
          </button>
        </div>
      )}
    </div>
  );
}

export default SocialAnxietyStep;