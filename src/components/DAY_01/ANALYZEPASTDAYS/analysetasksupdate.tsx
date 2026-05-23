import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ArrowRight, Star } from 'lucide-react';

export default function SocialReflectionPage() {
  const [introSeen, setIntroSeen] = useState(false);
  const [chatStage, setChatStage] = useState(0);
  const [chats, setChats] = useState(Array(4).fill([]));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [habitStage, setHabitStage] = useState(false);
  const [habitChat, setHabitChat] = useState([]);
  const [habitInput, setHabitInput] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState([3, 3, 3, 3]);
  const [currentEmotion, setCurrentEmotion] = useState(3);
  const scrollRef = useRef(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Scroll to bottom on new chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chats, habitChat, typingText]);

  // Typing effect
  const typeWriter = (text: string, callback?: () => void) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypingText(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 25);
  };

  // Send user message
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    console.log('User input:', text);
    const updated = [...chats];
    updated[chatStage] = [...updated[chatStage], { sender: 'user', text }];
    setChats(updated);
    setInput('');
    setLoading(true);

    const newIntensities = [...emotionIntensity];
    newIntensities[chatStage] = currentEmotion;
    setEmotionIntensity(newIntensities);

    try {
      console.log('Calling reflect-analyze API...');
      const analyzeRes = await fetch('https://one23-u2ck.onrender.com/reflect-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          user_id: 'HmSkqrt9r8OcvZUOIbRcwBTBpuP2',
          course_id: 'social_skills',
          message: text
        })
      });
      const analyzeData = await analyzeRes.json();
      console.log('reflect-analyze response:', analyzeData);

      const rawText = analyzeData.analysis?.raw || '';
      console.log('Raw AI response:', rawText);

      // Extract JSON from AI response
      const jsonMatch = rawText.match(/```json([\s\S]*?)```/);
      let aiJson: any = null;
      let deficiencies: string[] = [];
      let aiAdvice = "Try small steps each day.";

      if (jsonMatch) {
        try {
          aiJson = JSON.parse(jsonMatch[1]);
          console.log('Parsed AI JSON:', aiJson);
          deficiencies = aiJson.weakness_list || [];
          aiAdvice = aiJson.advice || aiAdvice;
        } catch (err) {
          console.error('Failed to parse AI JSON:', err);
        }
      } else {
        console.warn('No JSON block found in AI response.');
      }

      console.log('User deficiencies:', deficiencies);
      console.log('AI advice:', aiAdvice);

      if (deficiencies.length > 0) {
        console.log('Calling reflect-update-tasks API...');
        try {
          const updateRes = await fetch('https://one23-u2ck.onrender.com/reflect-update-tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
              user_id: 'HmSkqrt9r8OcvZUOIbRcwBTBpuP2',
              course_id: 'social_skills',
              user_deficiencies: deficiencies
            })
          });
          const updateData = await updateRes.json();
          console.log('reflect-update-tasks response:', updateData);
        } catch (err) {
          console.error('Error calling reflect-update-tasks:', err);
        }
      } else {
        console.warn('No deficiencies to update, skipping reflect-update-tasks.');
      }

      // Show AI response in chat
      typeWriter(aiAdvice, () => {
        const updated2 = [...updated];
        updated2[chatStage] = [...updated2[chatStage], { sender: 'ai', text: aiAdvice, icon: <Bot className="w-4 h-4" />, keyword: deficiencies.join(', ') }];
        setChats(updated2);
        setLoading(false);
        setShowNext(true);

        if (chatStage === 3) setShowConfetti(true);
        console.log('AI response added to chat:', aiAdvice);
      });

    } catch (err) {
      console.error('Error in sendMessage:', err);
      setLoading(false);
    }
  };

  const handleNextInteraction = () => {
    if (chatStage < 3) {
      setChatStage(chatStage + 1);
      setShowNext(false);
      setCurrentEmotion(3);
    } else {
      setHabitStage(true);
    }
  };

  const sendHabitMessage = () => {
    const text = habitInput.trim();
    if (!text) return;
    const updated = [...habitChat, { sender: 'user', text }];
    setHabitChat(updated);
    setHabitInput('');
    setLoading(true);

    const aiResponse = "Reflect on this habit and think of one small actionable change.";
    setTimeout(() => {
      typeWriter(aiResponse, () => {
        const updated2 = [...updated, { sender: 'ai', text: aiResponse }];
        setHabitChat(updated2);
        setLoading(false);
      });
    }, 800);
  };

  const ChatBubble = ({ sender, text, icon, keyword }) => (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`relative max-w-[80%] px-6 py-4 rounded-3xl shadow-2xl border backdrop-blur-xl ${
        sender === 'user'
          ? 'bg-gradient-to-br from-pink-500/90 via-purple-500/90 to-purple-600/90 text-white border-pink-400/40'
          : 'bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-indigo-900/60 text-purple-50 border-purple-600/40'
      }`}>
        <div className="flex items-start gap-3">
          {sender === 'ai' && (icon || <Bot className="w-6 h-6 opacity-90" />)}
          {sender === 'user' && <User className="w-6 h-6 opacity-90" />}
          <div className="flex-1">
            <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{text}</p>
            {sender === 'ai' && keyword && (
              <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-purple-700/40 rounded-full w-fit">
                <Star className="w-4 h-4" />
                <span className="text-xs font-semibold text-purple-200">{keyword}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const AnimatedBackground = () => (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900" />
  );

  const ProgressJourney = () => (
    <div className="mb-8 flex justify-center items-center">
      <div className="flex items-center gap-4">
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
              i < chatStage
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300'
                : i === chatStage
                ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-300'
                : 'bg-purple-900/50 border-purple-700/50'
            }`}>
              {i < chatStage ? '✓' : i + 1}
            </div>
            {i < 3 && <div className={`h-1 rounded-full ${i < chatStage ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-purple-800/30'}`}></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const InputArea = ({ value, onChange, onSend }) => (
    <div className="mt-5">
      <div className="flex gap-3 items-center backdrop-blur-xl bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-600/40 p-4 rounded-full shadow-2xl">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Share your reflection..."
          className="flex-1 bg-transparent text-white placeholder-purple-300 outline-none px-4 py-2 text-sm md:text-base"
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="p-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  if (!introSeen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
        <AnimatedBackground />
        <div className="text-center z-10 px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text mb-6">
            Your Social Reflection Journey
          </h1>
          <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience your past interactions, receive AI-powered insights, and discover the patterns that shape your social life.
          </p>
          <button
            onClick={() => setIntroSeen(true)}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl text-white font-bold shadow-xl hover:scale-105 transition-all"
          >
            Start Reflection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-start overflow-hidden p-4 md:p-10">
      <AnimatedBackground />
      <ProgressJourney />
      <div ref={scrollRef} className="flex-1 w-full overflow-y-auto space-y-4">
        {chats[chatStage].map((c, i) => (
          <ChatBubble key={i} {...c} />
        ))}
        {habitStage && habitChat.map((c, i) => (
          <ChatBubble key={i} {...c} />
        ))}
        {isTyping && (
          <div className="text-purple-200 italic text-sm md:text-base animate-pulse">
            AI is typing...
          </div>
        )}
      </div>
      {!habitStage && <InputArea value={input} onChange={(e) => setInput(e.target.value)} onSend={sendMessage} />}
      {showNext && !habitStage && (
        <button
          onClick={handleNextInteraction}
          className="mt-4 px-6 py-3 bg-purple-700/70 text-white rounded-3xl shadow-lg font-semibold flex items-center gap-2"
        >
          Next Interaction <ArrowRight className="w-4 h-4" />
        </button>
      )}
      {habitStage && <InputArea value={habitInput} onChange={(e) => setHabitInput(e.target.value)} onSend={sendHabitMessage} />}
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-yellow-300 via-pink-400 to-purple-500 mix-blend-screen animate-pulse opacity-40" />
        </div>
      )}
    </div>
  );
}
