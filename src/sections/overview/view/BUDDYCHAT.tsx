import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, CheckCircle, AlertCircle, Trophy, Target, Users, X, ChevronRight, Heart, Zap, Star, Send, ArrowRight, PartyPopper, ThumbsUp, Lightbulb, Shield, TrendingUp } from 'lucide-react';

// ============================================================================
// TIPS DATABASE - Context-Aware Guidance
// ============================================================================

const TIPS_DATABASE = {
  buddy: {
    beginner: {
      preparation: {
        title: "Choose Your Buddy Wisely",
        message: "Pick someone you feel comfortable with. It doesn't have to be your closest friend - just someone you'd like to connect with better!",
        icon: Users,
        type: "encouragement",
        actionButtons: [
          { label: "I've chosen someone", action: "next" },
          { label: "Need help deciding", action: "help" }
        ]
      },
      beforeChat: {
        title: "Before You Message",
        message: "Think about one thing you know they enjoy. Asking about their interests shows you care and makes conversation easier!",
        icon: Lightbulb,
        type: "hint",
        examples: ["How's your garden doing?", "Still playing guitar?", "How was that movie?"],
        warning: "Remember: curiosity, not interrogation! 😊"
      },
      duringChat: {
        title: "Active Listening Mode",
        message: "Focus on truly listening, not just waiting for your turn to speak. Ask follow-up questions based on what they share.",
        icon: MessageCircle,
        type: "live-guidance",
        quickTips: [
          "Ask 'why' or 'how' questions",
          "Reflect back what you heard",
          "Share something related from your life"
        ]
      },
      afterChat: {
        title: "Reflection Time! 🎉",
        message: "You did it! How did that conversation feel? Even if it was awkward, you practiced - that's what matters.",
        icon: Trophy,
        type: "reflection",
        questions: [
          "What went well?",
          "What surprised you?",
          "What would you do differently next time?"
        ]
      }
    },
    advanced: {
      preparation: {
        title: "Level Up Challenge",
        message: "Consider someone you'd like to strengthen your connection with, or someone slightly outside your comfort zone.",
        icon: Target,
        type: "challenge",
        actionButtons: [
          { label: "I'm ready", action: "next" },
          { label: "Show me tips", action: "help" }
        ]
      },
      beforeChat: {
        title: "Deep Connection Strategy",
        message: "Go beyond surface-level. Ask about their recent challenges, goals, or what's been on their mind lately.",
        icon: Heart,
        type: "advanced-hint",
        examples: ["What's been challenging you lately?", "What are you excited about?", "How are you really doing?"]
      },
      duringChat: {
        title: "Vulnerability Practice",
        message: "Share something genuine about yourself. Vulnerability builds deeper trust and authentic connection.",
        icon: Shield,
        type: "live-guidance",
        quickTips: [
          "Share a recent struggle",
          "Talk about what you're learning",
          "Express genuine appreciation"
        ]
      },
      afterChat: {
        title: "Advanced Reflection",
        message: "Analyze the depth of connection. Did you both share authentically? What emotional tone emerged?",
        icon: TrendingUp,
        type: "reflection",
        questions: [
          "How vulnerable were you?",
          "What deepened the connection?",
          "What's your next step with them?"
        ]
      }
    }
  }
};

// ============================================================================
// LIVE COACH COMPONENT
// ============================================================================

const LiveCoach = ({ taskType, currentStep, userLevel, onStepComplete, visible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const currentTip = TIPS_DATABASE[taskType]?.[userLevel]?.[currentStep];
  const Icon = currentTip?.icon || Sparkles;

  useEffect(() => {
    if (visible && !isExpanded) {
      const pulse = setInterval(() => {
        setPulseCount(prev => prev + 1);
      }, 2000);
      return () => clearInterval(pulse);
    }
  }, [visible, isExpanded]);

  const handleAction = (action) => {
    if (action === "next") {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onStepComplete();
        setIsExpanded(false);
      }, 1500);
    } else if (action === "help") {
      // Show additional help
      setIsExpanded(true);
    }
  };

  if (!visible || !currentTip) return null;

  return (
    <>
      {/* Floating Coach Bubble */}
      {!isExpanded && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
          <button
            onClick={() => setIsExpanded(true)}
            className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl border-2 border-purple-400/50 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
            {pulseCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white text-xs font-bold">
                !
              </div>
            )}
          </button>
        </div>
      )}

      {/* Expanded Coach Panel */}
      {isExpanded && (
        <div className="fixed inset-x-4 bottom-6 md:right-6 md:left-auto md:w-96 z-50 animate-slide-up">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Coach</h3>
                  <p className="text-xs text-purple-300 capitalize">{userLevel} Mode</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-purple-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-bold text-white text-lg mb-2">{currentTip.title}</h4>
                <p className="text-purple-200 text-sm leading-relaxed">{currentTip.message}</p>
              </div>

              {/* Examples */}
              {currentTip.examples && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">Try saying:</p>
                  {currentTip.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                      <MessageCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-purple-200 italic">"{example}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Tips */}
              {currentTip.quickTips && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">Quick Tips:</p>
                  {currentTip.quickTips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <p className="text-sm text-purple-200">{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Warning */}
              {currentTip.warning && (
                <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
                  <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-200">{currentTip.warning}</p>
                </div>
              )}

              {/* Questions */}
              {currentTip.questions && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">Reflect on:</p>
                  {currentTip.questions.map((question, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                      <span className="text-purple-400 font-bold text-sm">{idx + 1}.</span>
                      <p className="text-sm text-purple-200">{question}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {currentTip.actionButtons && (
                <div className="flex gap-3 pt-2">
                  {currentTip.actionButtons.map((button, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(button.action)}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                        button.action === "next"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500"
                          : "bg-purple-950/50 text-purple-300 border-2 border-purple-700/30 hover:border-purple-600/50"
                      }`}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Default Continue Button */}
              {!currentTip.actionButtons && currentStep !== "afterChat" && (
                <button
                  onClick={() => handleAction("next")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Got it! Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <PartyPopper className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
            <p className="text-3xl font-bold text-white">Great job!</p>
            <p className="text-purple-300 mt-2">Moving to next step...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// ============================================================================
// BUDDY TASK DEMO PAGE
// ============================================================================

export default function BuddyTaskDemo() {
  const [currentStep, setCurrentStep] = useState('preparation');
  const [userLevel, setUserLevel] = useState('beginner');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showCoach, setShowCoach] = useState(true);
  const [buddyName, setBuddyName] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [reflection, setReflection] = useState({ q1: '', q2: '', q3: '' });
  const [xpEarned, setXpEarned] = useState(0);

  const steps = ['preparation', 'beforeChat', 'duringChat', 'afterChat'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleStepComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      setXpEarned(50);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { type: 'user', text: chatMessage }]);
    setChatMessage('');
    
    // Simulate buddy response
    setTimeout(() => {
      const responses = [
        "That's a great question! Well, I've been...",
        "Thanks for asking! Actually...",
        "You know what's funny about that?",
        "I really appreciate you checking in!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { type: 'buddy', text: randomResponse }]);
    }, 1500);
  };

  const handleCompleteReflection = () => {
    if (reflection.q1 && reflection.q2 && reflection.q3) {
      setXpEarned(50);
      setShowCoach(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
        <div className="px-4 md:px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-purple-100">Buddy Task</h1>
                <p className="text-sm text-purple-300">Connect with someone meaningful</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserLevel(userLevel === 'beginner' ? 'advanced' : 'beginner')}
                className="px-4 py-2 bg-purple-800/40 hover:bg-purple-700/40 rounded-xl border border-purple-500/30 transition-all text-sm font-medium"
              >
                {userLevel === 'beginner' ? '🌱 Beginner' : '💎 Advanced'}
              </button>
              <button
                onClick={() => setShowCoach(!showCoach)}
                className="p-2 bg-purple-800/40 hover:bg-purple-700/40 rounded-xl border border-purple-500/30 transition-all"
              >
                <Sparkles className={`w-5 h-5 ${showCoach ? 'text-yellow-400' : 'text-purple-400'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-10 max-w-4xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-purple-200">Progress</p>
            <p className="text-sm font-bold text-purple-200">{Math.round(progress)}%</p>
          </div>
          <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-purple-400">
            {steps.map((step, idx) => (
              <span key={step} className={completedSteps.includes(step) ? 'text-green-400 font-bold' : ''}>
                {step.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'preparation' && (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Buddy</h2>
            <input
              type="text"
              value={buddyName}
              onChange={(e) => setBuddyName(e.target.value)}
              placeholder="Enter their name..."
              className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-base transition-all mb-4"
            />
            <button
              onClick={handleStepComplete}
              disabled={!buddyName.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {currentStep === 'beforeChat' && (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Prepare Your Message</h2>
            <p className="text-purple-200 mb-6">You're about to message {buddyName || 'your buddy'}. Review the coach's tips, then click ready!</p>
            <div className="flex gap-3">
              <button
                onClick={handleStepComplete}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                I'm Ready!
                <ThumbsUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 'duringChat' && (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Chat with {buddyName || 'Your Buddy'}</h2>
            
            {/* Chat History */}
            <div className="bg-purple-950/50 rounded-2xl border border-purple-700/30 p-4 mb-4 h-64 overflow-y-auto space-y-3">
              {chatHistory.length === 0 ? (
                <p className="text-purple-400 text-center py-8">Start the conversation...</p>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl max-w-xs ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-purple-800/50 text-purple-100'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 text-sm transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleStepComplete}
              disabled={chatHistory.length < 2}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
            >
              Finish Conversation
              <CheckCircle className="w-6 h-6" />
            </button>
          </div>
        )}

        {currentStep === 'afterChat' && !xpEarned && (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Reflection Time 🎉</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-purple-200 mb-2">What went well?</label>
                <textarea
                  value={reflection.q1}
                  onChange={(e) => setReflection({ ...reflection, q1: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-200 mb-2">What surprised you?</label>
                <textarea
                  value={reflection.q2}
                  onChange={(e) => setReflection({ ...reflection, q2: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-200 mb-2">What would you do differently?</label>
                <textarea
                  value={reflection.q3}
                  onChange={(e) => setReflection({ ...reflection, q3: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={handleCompleteReflection}
                disabled={!reflection.q1 || !reflection.q2 || !reflection.q3}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
              >
                Complete Task
                <Trophy className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* XP Reward Screen */}
        {xpEarned > 0 && (
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md p-8 rounded-3xl border-2 border-yellow-500/50 shadow-2xl text-center">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-4">Task Complete! 🎉</h2>
            <p className="text-2xl font-bold text-yellow-400 mb-4">+{xpEarned} XP</p>
            <p className="text-purple-200 mb-6">You connected with {buddyName}! Every conversation is practice.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl"
            >
              Start New Task
            </button>
          </div>
        )}

      </div>

      {/* Live Coach */}
      <LiveCoach
        taskType="buddy"
        currentStep={currentStep}
        userLevel={userLevel}
        onStepComplete={handleStepComplete}
        visible={showCoach && !xpEarned}
      />

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
}