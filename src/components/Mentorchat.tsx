import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageCircle, X, RefreshCw } from 'lucide-react';
import { db } from "../lib/firebase";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface MentorChatProps {
  onClose?: () => void;
}

const MentorChat: React.FC<MentorChatProps> = ({ onClose }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = 'https://pythonbackend-74es.onrender.com'; // Replace with your actual backend URL
  const GROQ_API_KEY = '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'; // Replace with your API key

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentUser) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/mentor-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          user_id: currentUser,
          message: userMessage.content,
          conversation_id: conversationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Update conversation ID if this is first message
      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      // Add AI response to messages
      const aiMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      console.error('Mentor chat error:', err);
      setError(err.message || 'Something went wrong. Try again?');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "oops something broke on my end 😅 can you try sending that again?",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Start new conversation
  const startNewChat = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/mentor-chat/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: currentUser })
      });

      const data = await response.json();
      
      if (data.success) {
        setConversationId(data.conversation_id);
        setMessages([]);
        setError('');
      }
    } catch (err) {
      console.error('Failed to start new chat:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 text-white">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-md border-b border-purple-500/30 px-6 py-4 flex items-center justify-between shadow-lg shadow-purple-500/20 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-glow">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-purple-900"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">alex</h2>
            <p className="text-xs text-purple-300">your mentor who gets it</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-white px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-300 border border-transparent hover:border-purple-500/30"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">new chat</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-white p-2 rounded-lg hover:bg-purple-800/50 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in-up">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-glow">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              hey, i'm alex 👋
            </h3>
            <p className="text-purple-300 max-w-md leading-relaxed">
              i've been through the anxiety, the career confusion, the whole "everyone has it figured out except me" thing. let's talk about what's going on with you?
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-left`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 transition-all duration-300 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                  : 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 text-purple-100 border border-purple-500/30 shadow-lg shadow-purple-900/30 backdrop-blur-sm hover:border-purple-400/50'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded-2xl px-5 py-4 border border-purple-500/30 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-2 animate-fade-in">
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-md border-t border-purple-500/30 px-6 py-4 shadow-lg shadow-purple-900/50">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="what's on your mind?"
              disabled={isLoading || !currentUser}
              className="w-full px-5 py-3 pr-12 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all disabled:bg-purple-950/50 disabled:cursor-not-allowed text-sm backdrop-blur-sm"
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || !currentUser}
            className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0 hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-xs text-purple-400 mt-3 text-center">
          press enter to send • shift + enter for new line
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 40px rgba(236, 72, 153, 0.5); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default MentorChat;