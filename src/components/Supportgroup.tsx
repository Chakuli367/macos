import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Wind, AlertCircle, Phone, MessageCircle, 
  FileText, Users, Sparkles, ChevronRight, Activity,
  BookOpen, Calendar, TrendingUp, Zap, Shield
} from 'lucide-react';

const SupportToolsHub = ({ onClose, userId }) => {
  const [activeView, setActiveView] = useState('main');
  const [journalEntries, setJournalEntries] = useState([]);
  const [socialLogs, setSocialLogs] = useState([]);
  const [showPanicHelp, setShowPanicHelp] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    mood: 5,
    symptoms: [],
    triggers: '',
    thoughts: '',
    gratitude: ''
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`support-data-${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setJournalEntries(data.journal || []);
      setSocialLogs(data.social || []);
    }
  }, [userId]);

  // Save data to localStorage
  const saveData = (journal, social) => {
    localStorage.setItem(`support-data-${userId}`, JSON.stringify({
      journal,
      social,
      lastUpdated: Date.now()
    }));
  };

  // Main Dashboard View
  const MainView = () => (
    <div className="space-y-6">
      {/* MAIN PANIC HELP BUTTON */}
      <button
        onClick={() => setShowPanicHelp(true)}
        className="w-full py-8 bg-gradient-to-br from-red-500/40 to-pink-500/40 hover:from-red-500/50 hover:to-pink-500/50 backdrop-blur-md border-2 border-red-400/50 rounded-3xl transition-all hover:scale-105 shadow-2xl hover:shadow-red-500/50 group"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform animate-pulse">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">I Need Help Now</h2>
          <p className="text-white/90 text-lg drop-shadow">Tap here if you're struggling</p>
        </div>
      </button>

      {/* Emergency Section */}
      <div className="bg-gradient-to-br from-red-500/30 to-pink-500/30 backdrop-blur-sm border border-red-400/40 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white drop-shadow">Need Help Now?</h3>
            <p className="text-white/90 text-sm drop-shadow">Immediate support available</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveView('crisis')}
            className="px-4 py-3 bg-red-600/80 hover:bg-red-700/90 backdrop-blur-sm text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <Phone className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Crisis Resources</span>
          </button>
          
          <button
            onClick={() => setActiveView('grounding')}
            className="px-4 py-3 bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <Wind className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Grounding</span>
          </button>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Access Tools
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <ToolCard
            icon={<FileText className="w-6 h-6" />}
            title="Journal Entry"
            description="Log your feelings"
            color="purple"
            onClick={() => setActiveView('journal')}
            badge={journalEntries.length}
          />
          
          <ToolCard
            icon={<Users className="w-6 h-6" />}
            title="Social Log"
            description="Track interactions"
            color="blue"
            onClick={() => setActiveView('social')}
            badge={socialLogs.length}
          />
          
          <ToolCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="AI Practice"
            description="Safe conversation"
            color="green"
            onClick={() => setActiveView('ai-chat')}
          />
          
          <ToolCard
            icon={<Activity className="w-6 h-6" />}
            title="Prep Tool"
            description="Before activity"
            color="orange"
            onClick={() => setActiveView('prep')}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 drop-shadow">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Your Progress
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <StatBox label="Journal Entries" value={journalEntries.length} color="purple" />
          <StatBox label="Social Logs" value={socialLogs.length} color="blue" />
          <StatBox label="Streak" value="3 days" color="green" />
        </div>
      </div>
    </div>
  );

  // Crisis Resources View
  const CrisisView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Crisis Resources</h2>
      
      <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">🚨 Emergency Hotlines</h3>
        
        <div className="space-y-3">
          <ResourceCard
            title="National Suicide Prevention Lifeline"
            contact="988"
            description="24/7 crisis support"
            action="Call Now"
            href="tel:988"
          />
          
          <ResourceCard
            title="Crisis Text Line"
            contact="Text HOME to 741741"
            description="Free 24/7 support"
            action="Text Now"
            href="sms:741741&body=HOME"
          />
          
          <ResourceCard
            title="SAMHSA National Helpline"
            contact="1-800-662-4357"
            description="Treatment referral"
            action="Call"
            href="tel:18006624357"
          />
        </div>
      </div>

      <button
        onClick={() => setActiveView('grounding')}
        className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center justify-between"
      >
        <span>Try Grounding Exercises</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  // Grounding Exercises View
  const GroundingView = () => {
    const [countdown, setCountdown] = useState(0);
    const [breathPhase, setBreathPhase] = useState('inhale');

    useEffect(() => {
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown(prev => prev - 1);
          setBreathPhase(prev => {
            if (prev === 'inhale') return 'hold';
            if (prev === 'hold') return 'exhale';
            return 'inhale';
          });
        }, 4000);
        return () => clearInterval(timer);
      }
    }, [countdown]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Grounding Exercises</h2>
        
        {/* 5-4-3-2-1 Technique */}
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">🌟 5-4-3-2-1 Technique</h3>
          <p className="text-white/70 mb-4 text-sm">
            Ground yourself by naming:
          </p>
          
          <div className="space-y-2 text-white/90">
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-400">5</span> things you can see
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-400">4</span> things you can touch
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-400">3</span> things you can hear
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-400">2</span> things you can smell
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-pink-400">1</span> thing you can taste
            </div>
          </div>
        </div>

        {/* Breathing Exercise */}
        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">🌬️ Box Breathing</h3>
          
          {countdown === 0 ? (
            <button
              onClick={() => setCountdown(60)}
              className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
            >
              Start 4-4-4-4 Breathing
            </button>
          ) : (
            <div className="text-center">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${
                breathPhase === 'inhale' ? 'bg-blue-500 scale-110' :
                breathPhase === 'hold' ? 'bg-purple-500 scale-100' :
                'bg-pink-500 scale-90'
              }`}>
                <span className="text-2xl font-bold text-white">
                  {breathPhase === 'inhale' ? 'Breathe In' :
                   breathPhase === 'hold' ? 'Hold' :
                   'Breathe Out'}
                </span>
              </div>
              
              <p className="text-white/70 text-sm">{countdown}s remaining</p>
              
              <button
                onClick={() => setCountdown(0)}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
              >
                Stop
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Journal Entry View
  const JournalView = () => {
    const symptoms = [
      'Anxiety', 'Racing Heart', 'Dizzy', 'Nausea', 
      'Sweating', 'Shaking', 'Brain Fog', 'Fatigue'
    ];

    const saveJournal = () => {
      const newEntry = {
        ...currentEntry,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString(),
        id: Date.now()
      };
      
      const updated = [newEntry, ...journalEntries];
      setJournalEntries(updated);
      saveData(updated, socialLogs);
      
      // Reset form
      setCurrentEntry({
        mood: 5,
        symptoms: [],
        triggers: '',
        thoughts: '',
        gratitude: ''
      });
      
      alert('Journal entry saved! 💜');
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Symptom Journal</h2>
        
        {/* Mood Slider */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">
            How are you feeling? ({currentEntry.mood}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={currentEntry.mood}
            onChange={(e) => setCurrentEntry({...currentEntry, mood: e.target.value})}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>Struggling</span>
            <span>Amazing</span>
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">Physical Symptoms</label>
          <div className="grid grid-cols-2 gap-2">
            {symptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => {
                  const updated = currentEntry.symptoms.includes(symptom)
                    ? currentEntry.symptoms.filter(s => s !== symptom)
                    : [...currentEntry.symptoms, symptom];
                  setCurrentEntry({...currentEntry, symptoms: updated});
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentEntry.symptoms.includes(symptom)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Triggers */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">What triggered this?</label>
          <textarea
            value={currentEntry.triggers}
            onChange={(e) => setCurrentEntry({...currentEntry, triggers: e.target.value})}
            placeholder="Describe the situation..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
        </div>

        {/* Thoughts */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">Your Thoughts</label>
          <textarea
            value={currentEntry.thoughts}
            onChange={(e) => setCurrentEntry({...currentEntry, thoughts: e.target.value})}
            placeholder="What's going through your mind?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
          />
        </div>

        {/* Gratitude */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">One thing you're grateful for</label>
          <input
            type="text"
            value={currentEntry.gratitude}
            onChange={(e) => setCurrentEntry({...currentEntry, gratitude: e.target.value})}
            placeholder="Even small things count..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button
          onClick={saveJournal}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
        >
          Save Journal Entry
        </button>

        {/* Recent Entries */}
        {journalEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-3">Recent Entries</h3>
            <div className="space-y-2">
              {journalEntries.slice(0, 3).map(entry => (
                <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">{entry.date}</span>
                    <span className="text-purple-400 font-semibold">Mood: {entry.mood}/10</span>
                  </div>
                  {entry.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.symptoms.map(s => (
                        <span key={s} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Social Interaction Log View
  const SocialLogView = () => {
    const [newLog, setNewLog] = useState({
      type: '',
      duration: '',
      people: '',
      comfort: 5,
      success: '',
      challenges: '',
      notes: ''
    });

    const saveSocialLog = () => {
      const entry = {
        ...newLog,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString(),
        id: Date.now()
      };
      
      const updated = [entry, ...socialLogs];
      setSocialLogs(updated);
      saveData(journalEntries, updated);
      
      setNewLog({
        type: '',
        duration: '',
        people: '',
        comfort: 5,
        success: '',
        challenges: '',
        notes: ''
      });
      
      alert('Social interaction logged! 🎉');
    };

    const interactionTypes = [
      'One-on-one', 'Small group', 'Large group', 
      'Phone call', 'Video chat', 'Text conversation'
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Log Social Interaction</h2>
        
        {/* Interaction Type */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">Type of Interaction</label>
          <div className="grid grid-cols-2 gap-2">
            {interactionTypes.map(type => (
              <button
                key={type}
                onClick={() => setNewLog({...newLog, type})}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  newLog.type === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & People */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-3">Duration</label>
            <input
              type="text"
              value={newLog.duration}
              onChange={(e) => setNewLog({...newLog, duration: e.target.value})}
              placeholder="e.g., 30 min"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-3">Number of People</label>
            <input
              type="text"
              value={newLog.people}
              onChange={(e) => setNewLog({...newLog, people: e.target.value})}
              placeholder="e.g., 2-3"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Comfort Level */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">
            Comfort Level ({newLog.comfort}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={newLog.comfort}
            onChange={(e) => setNewLog({...newLog, comfort: e.target.value})}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>Very Anxious</span>
            <span>Very Comfortable</span>
          </div>
        </div>

        {/* What Went Well */}
        <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">What went well? 🎉</label>
          <textarea
            value={newLog.success}
            onChange={(e) => setNewLog({...newLog, success: e.target.value})}
            placeholder="Celebrate your wins, no matter how small!"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={3}
          />
        </div>

        {/* Challenges */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">Any challenges?</label>
          <textarea
            value={newLog.challenges}
            onChange={(e) => setNewLog({...newLog, challenges: e.target.value})}
            placeholder="What was difficult?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={saveSocialLog}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
        >
          Save Social Log
        </button>

        {/* Recent Logs */}
        {socialLogs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-3">Recent Interactions</h3>
            <div className="space-y-2">
              {socialLogs.slice(0, 3).map(log => (
                <div key={log.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{log.type}</span>
                    <span className="text-white/60 text-sm">{log.date}</span>
                  </div>
                  <div className="text-blue-400 text-sm">
                    Comfort: {log.comfort}/10 • {log.duration} • {log.people} people
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Panic Attack Helper Component
  const PanicAttackHelper = () => {
    const [breathCycle, setBreathCycle] = useState('breathe-in');
    const [messageIndex, setMessageIndex] = useState(0);

    const affirmations = [
      "You are safe right now",
      "This feeling will pass",
      "You are stronger than you know",
      "Breathe with me",
      "You've overcome this before",
      "You are not alone",
      "This is temporary",
      "You are doing great",
      "Focus on your breath",
      "You are in control"
    ];

    useEffect(() => {
      // Breathing cycle animation
      const breathTimer = setInterval(() => {
        setBreathCycle(prev => {
          if (prev === 'breathe-in') return 'hold';
          if (prev === 'hold') return 'breathe-out';
          return 'breathe-in';
        });
      }, 4000);

      // Change affirmation every 6 seconds
      const messageTimer = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % affirmations.length);
      }, 6000);

      return () => {
        clearInterval(breathTimer);
        clearInterval(messageTimer);
      };
    }, []);

    const balloonScale = 
      breathCycle === 'breathe-in' ? 'scale-150' :
      breathCycle === 'hold' ? 'scale-125' :
      'scale-100';

    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-6">
        {/* Affirmation Text */}
        <div className="mb-12 text-center animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl animate-pulse">
            {affirmations[messageIndex]}
          </h1>
          <p className="text-xl text-white/80 drop-shadow-lg">
            {breathCycle === 'breathe-in' && '🌬️ Breathe in slowly...'}
            {breathCycle === 'hold' && '⏸️ Hold gently...'}
            {breathCycle === 'breathe-out' && '😌 Breathe out slowly...'}
          </p>
        </div>

        {/* Breathing Balloon */}
        <div className="relative mb-16">
          <div
            className={`w-48 h-48 md:w-64 md:h-64 rounded-full transition-all duration-[4000ms] ease-in-out ${balloonScale} ${
              breathCycle === 'breathe-in' ? 'bg-gradient-to-br from-blue-400 to-cyan-300' :
              breathCycle === 'hold' ? 'bg-gradient-to-br from-purple-400 to-pink-300' :
              'bg-gradient-to-br from-pink-400 to-rose-300'
            } shadow-2xl flex items-center justify-center`}
          >
            <div className="text-white text-6xl md:text-7xl drop-shadow-xl">
              {breathCycle === 'breathe-in' && '↑'}
              {breathCycle === 'hold' && '—'}
              {breathCycle === 'breathe-out' && '↓'}
            </div>
          </div>

          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8 max-w-md">
          <p className="text-white/90 text-lg mb-2">
            Follow the circle with your breath
          </p>
          <p className="text-white/70 text-sm">
            In for 4 seconds • Hold for 4 seconds • Out for 4 seconds
          </p>
        </div>

        {/* I'm OK Button */}
        <button
          onClick={() => setShowPanicHelp(false)}
          className="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all hover:scale-110 border-2 border-white/30"
        >
          ✓ Yes, I'm OK Now
        </button>

        {/* Additional help */}
        <p className="mt-6 text-white/60 text-sm">
          Still struggling? Consider calling 988 for crisis support
        </p>
      </div>
    );
  };

  return (
    <>
      {/* Panic Attack Helper Overlay */}
      {showPanicHelp && <PanicAttackHelper />}

      <div className="fixed inset-0 bg-black/60 backdrop-blur-md p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">Support Hub</h1>
                <p className="text-white/80 text-sm drop-shadow">You're not alone in this</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          {activeView !== 'main' && (
            <button
              onClick={() => setActiveView('main')}
              className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm transition-all flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Home
            </button>
          )}

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            {activeView === 'main' && <MainView />}
            {activeView === 'crisis' && <CrisisView />}
            {activeView === 'grounding' && <GroundingView />}
            {activeView === 'journal' && <JournalView />}
            {activeView === 'social' && <SocialLogView />}
            {activeView === 'ai-chat' && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">AI Practice Chat</h2>
                <p className="text-white/60 mb-6">Coming soon! Practice conversations in a safe space.</p>
              </div>
            )}
            {activeView === 'prep' && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Activity Prep Tool</h2>
                <p className="text-white/60 mb-6">Coming soon! Prepare for upcoming social events.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


// Helper Components
const ToolCard = ({ icon, title, description, color, onClick, badge }) => {
  const colorClasses = {
    purple: 'from-purple-500/30 to-purple-600/30 border-purple-400/40 hover:border-purple-400/60 backdrop-blur-sm',
    blue: 'from-blue-500/30 to-blue-600/30 border-blue-400/40 hover:border-blue-400/60 backdrop-blur-sm',
    green: 'from-green-500/30 to-green-600/30 border-green-400/40 hover:border-green-400/60 backdrop-blur-sm',
    orange: 'from-orange-500/30 to-orange-600/30 border-orange-400/40 hover:border-orange-400/60 backdrop-blur-sm'
  };

  return (
    <button
      onClick={onClick}
      className={`relative bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-4 text-left transition-all hover:scale-105 shadow-lg hover:shadow-xl`}
    >
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {badge}
        </div>
      )}
      
      <div className="text-white mb-2">{icon}</div>
      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
      <p className="text-white/60 text-xs">{description}</p>
    </button>
  );
};

const StatBox = ({ label, value, color }) => {
  const colorClasses = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    green: 'text-green-400'
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]} mb-1`}>{value}</div>
      <div className="text-white/60 text-xs">{label}</div>
    </div>
  );
};

const ResourceCard = ({ title, contact, description, action, href }) => (
  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
    <h4 className="text-white font-bold mb-1 drop-shadow">{title}</h4>
    <p className="text-purple-300 font-semibold mb-1 drop-shadow">{contact}</p>
    <p className="text-white/80 text-sm mb-3">{description}</p>
    <a
      href={href}
      className="inline-block px-4 py-2 bg-red-600/80 hover:bg-red-700/90 backdrop-blur-sm text-white rounded-lg text-sm font-semibold transition-all shadow-lg"
    >
      {action}
    </a>
  </div>
);

export { SupportToolsHub };
export default SupportToolsHub;