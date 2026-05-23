import React, { useState, useEffect, useRef } from 'react';
import { Brain, CheckCircle, Sparkles, ArrowRight, Send, Target } from 'lucide-react';

export default function PHYSICALENVPREP({ onNext }: { onNext: () => void }) {
  // Chat phase management
  const [currentPhase, setCurrentPhase] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(true);
  const chatEndRef = useRef(null);
  
  // Data collection
  const [userData, setUserData] = useState({
    eventType: '',
    eventTime: '',
    eventLocation: '',
    outfits: [],
    checklist: [],
    travelTime: '',
    transport: '',
    bufferTime: '',
    emergencyPlans: false,
    confidenceLevel: 0
  });

  // Chat phases structure
  const chatPhases = [
    {
      id: 'welcome',
      question: "Hi! 👋 I'm your Event Prep Assistant. I'll help you prepare for your upcoming event step by step. Ready to get started?",
      type: 'confirmation'
    },
    {
      id: 'event_type',
      question: "Great! Let's start. What type of event are you attending? (casual hangout, formal event, date, networking, family gathering, or something else)",
      type: 'text'
    },
    {
      id: 'event_time',
      question: "What time is your event? (Please provide in HH:MM format, like 19:00)",
      type: 'time'
    },
    {
      id: 'event_location',
      question: "Where will the event take place?",
      type: 'text'
    },
    {
      id: 'outfit_planning',
      question: "Now let's think about what you'll wear. Have you decided on an outfit? If yes, describe it briefly. If not, that's okay too!",
      type: 'text'
    },
    {
      id: 'outfit_confidence',
      question: "On a scale of 1-5, how confident do you feel about your outfit choice? (1 = not confident, 5 = very confident)",
      type: 'number'
    },
    {
      id: 'essential_items',
      question: "Let's make sure you don't forget anything! I'll help you create a checklist. What items do you want to bring? (You can list multiple items separated by commas, like: phone, wallet, keys, water bottle)",
      type: 'list'
    },
    {
      id: 'travel_time',
      question: "How long does it take you to travel to the venue? (in minutes)",
      type: 'number'
    },
    {
      id: 'transport_mode',
      question: "How are you planning to get there? (car, walk, public transit, bike, or other)",
      type: 'text'
    },
    {
      id: 'buffer_time',
      question: "How much buffer time do you want before the event? (in minutes - I recommend at least 10-15 minutes)",
      type: 'number'
    },
    {
      id: 'emergency_prep',
      question: "Would you like me to share some polite exit lines and conversation starters in case you need them? (yes/no)",
      type: 'confirmation'
    },
    {
      id: 'confidence_boost',
      question: "Before we finish, let's do a quick confidence check. On a scale of 1-10, how anxious do you feel about this event right now?",
      type: 'number'
    },
    {
      id: 'summary',
      question: "Perfect! Let me summarize everything we've prepared...",
      type: 'summary'
    }
  ];

  // Initialize chat on mount
  useEffect(() => {
    setChatMessages([
      { role: 'assistant', message: chatPhases[0].question }
    ]);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Calculate departure time
  const calculateDepartureTime = () => {
    if (!userData.eventTime || !userData.travelTime || !userData.bufferTime) return '--:--';
    const [hours, minutes] = userData.eventTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes - parseInt(userData.travelTime) - parseInt(userData.bufferTime);
    const departHours = Math.floor(totalMinutes / 60);
    const departMinutes = totalMinutes % 60;
    return `${String(departHours).padStart(2, '0')}:${String(departMinutes).padStart(2, '0')}`;
  };

  // Generate final summary
  const generateSummary = () => {
    const departTime = calculateDepartureTime();
    
    return `
🎉 **Your Event Preparation Summary**

📅 **Event Details:**
• Type: ${userData.eventType}
• Time: ${userData.eventTime}
• Location: ${userData.eventLocation}

👔 **Outfit:**
• ${userData.outfits[0] || 'Not specified'}
• Confidence Level: ${userData.confidenceLevel}/5

✅ **Items to Bring:**
${userData.checklist.map(item => `• ${item}`).join('\n')}

🚗 **Logistics:**
• Transportation: ${userData.transport}
• Travel Time: ${userData.travelTime} minutes
• Buffer Time: ${userData.bufferTime} minutes
• **Departure Time: ${departTime}** ⏰

${userData.emergencyPlans ? '🛡️ Emergency resources have been provided above!' : ''}

You're all set! You've prepared thoroughly and you're ready for this event. Remember: you've got this! 💪

Ready to continue your journey?
    `;
  };

  // Process user response and move to next phase
  const processResponse = (response) => {
    const phase = chatPhases[currentPhase];
    
    // Store user data based on phase
    switch(phase.id) {
      case 'welcome':
        break;
      case 'event_type':
        setUserData(prev => ({ ...prev, eventType: response }));
        break;
      case 'event_time':
        setUserData(prev => ({ ...prev, eventTime: response }));
        break;
      case 'event_location':
        setUserData(prev => ({ ...prev, eventLocation: response }));
        break;
      case 'outfit_planning':
        setUserData(prev => ({ ...prev, outfits: [response] }));
        break;
      case 'outfit_confidence':
        setUserData(prev => ({ ...prev, confidenceLevel: parseInt(response) }));
        break;
      case 'essential_items':
        const items = response.split(',').map(item => item.trim()).filter(item => item);
        setUserData(prev => ({ ...prev, checklist: items }));
        break;
      case 'travel_time':
        setUserData(prev => ({ ...prev, travelTime: response }));
        break;
      case 'transport_mode':
        setUserData(prev => ({ ...prev, transport: response }));
        break;
      case 'buffer_time':
        setUserData(prev => ({ ...prev, bufferTime: response }));
        break;
      case 'emergency_prep':
        setUserData(prev => ({ ...prev, emergencyPlans: response.toLowerCase().includes('yes') }));
        break;
      case 'confidence_boost':
        // Store anxiety level
        break;
    }

    // Move to next phase
    if (currentPhase < chatPhases.length - 1) {
      setCurrentPhase(prev => prev + 1);
      setIsAiThinking(true);
      
      // Show next question after brief delay
      setTimeout(() => {
        setIsAiThinking(false);
        const nextPhase = chatPhases[currentPhase + 1];
        
        if (nextPhase.id === 'summary') {
          // Generate summary
          const summary = generateSummary();
          setChatMessages(prev => [...prev, { role: 'assistant', message: summary }]);
          setAwaitingInput(false);
        } else if (nextPhase.id === 'emergency_prep' && phase.id === 'buffer_time') {
          // Ask emergency prep question
          setChatMessages(prev => [...prev, { role: 'assistant', message: nextPhase.question }]);
        } else if (nextPhase.id === 'confidence_boost' && userData.emergencyPlans) {
          // Show emergency resources first
          const emergencyInfo = `
🛡️ **Emergency Toolkit**

📋 **Polite Exit Lines:**
• "I need to make an important call"
• "I'm not feeling well, I should head home"
• "I have an early morning tomorrow"
• "Emergency came up, I need to leave"
• "I promised to check in with family"

💬 **Conversation Starters:**
• "What's been the highlight of your week?"
• "Have you been working on any interesting projects?"
• "What do you like to do in your free time?"
• "Have you discovered any good shows/books lately?"
• "What brought you here today?"
          `;
          setChatMessages(prev => [...prev, 
            { role: 'assistant', message: emergencyInfo },
            { role: 'assistant', message: nextPhase.question }
          ]);
        } else {
          setChatMessages(prev => [...prev, { role: 'assistant', message: nextPhase.question }]);
        }
      }, 800);
    }
  };

  // Send user message
  const sendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    
    // Process the response
    processResponse(userMessage);
    
    // Clear input
    setUserMessage('');
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Progress calculation
  const progressPercentage = Math.round((currentPhase / (chatPhases.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
        <div className="px-4 md:px-6 lg:px-10 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-purple-100">Event Prep Chat</span>
                <p className="text-xs text-purple-300">Step {currentPhase + 1} of {chatPhases.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
                <Target className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-bold text-purple-100">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
        <div className="space-y-4 pb-32">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-md text-white border-2 border-purple-500/30 shadow-xl'
              }`}>
                <p className="whitespace-pre-line text-base leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
          
          {isAiThinking && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-md rounded-2xl p-5 border-2 border-purple-500/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="sticky bottom-0 bg-gradient-to-t from-purple-950 via-purple-900/95 to-transparent backdrop-blur-xl border-t-2 border-purple-500/30 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {awaitingInput ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1 bg-purple-950/80 text-white placeholder-white/40 border-2 border-purple-500/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-base"
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={!userMessage.trim()}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-800 disabled:to-pink-800 disabled:cursor-not-allowed text-white rounded-2xl transition-all shadow-xl disabled:shadow-none"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onNext}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl text-xl font-bold transition-all duration-300 transform 
              bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 
              text-white shadow-2xl hover:shadow-green-500/50 hover:scale-[1.02]"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              Preparation Complete - Start Journey
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        html {
          scroll-behavior: smooth;
        }

        button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}