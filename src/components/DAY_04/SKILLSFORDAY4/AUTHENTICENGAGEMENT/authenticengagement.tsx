import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, TrendingUp, Target, CheckCircle, Clock, MessageCircle, Volume2, Heart, Zap, Play, Pause, RotateCcw, Award, Lightbulb, BarChart3, Users } from 'lucide-react';

interface ConversationLog {
  id: number;
  person: string;
  duration: string;
  selfFocusScore: number;
  speedRating: number;
  naturalMoments: number;
  reflection: string;
  timestamp: Date;
}

interface Session {
  id: number;
  startTime: Date;
  endTime?: Date;
  naturalMoments: number;
  pauseCount: number;
  deepQuestions: number;
  speechQuality: number;
  duration?: number;
  quality?: number;
}

interface BaselineAssessment {
  performFreq?: string;
  blockers?: string[];
}

interface Props {
  onNext: () => void;
}

const AuthenticEngagement = ({ onNext }: Props) => {
  const [phase, setPhase] = useState('education');
  const [educationStep, setEducationStep] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [sessionPhase, setSessionPhase] = useState('idle');
  const [metrics, setMetrics] = useState({
    pauseCount: 0,
    speedScore: 50,
    emotionalHonesty: 0,
    naturalMoments: 0,
    performanceSlips: 0
  });
  const [baselineAssessment, setBaselineAssessment] = useState<BaselineAssessment | null>(null);
  const [conversationLogs, setConversationLogs] = useState<ConversationLog[]>([]);
  const [newLog, setNewLog] = useState({
    person: '',
    duration: '',
    selfFocusScore: 5,
    speedRating: 5,
    naturalMoments: 0,
    reflection: ''
  });
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    let interval;
    if (isTracking && sessionPhase === 'active') {
      interval = setInterval(() => setSessionTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, sessionPhase]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // PHASE 1: EDUCATION
  // ============================================================================

  const performFreqOptions = [
    'Rarely - I\'m mostly authentic',
    'Sometimes - maybe 30% of the time',
    'Often - pretty frequently',
    'Constantly - I\'m always on'
  ];

  const blockerOptions = [
    'Fear of judgment',
    'Old habits',
    'Uncertainty what to say',
    'Past rejection or criticism',
    'All of the above'
  ];

  const educationContent = [
    {
      title: 'What is Authentic Engagement?',
      type: 'intro',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-900/40 p-6 rounded-2xl border border-purple-700/50">
            <h3 className="text-2xl font-bold text-white mb-3">The Core Shift</h3>
            <p className="text-purple-100 text-lg mb-4">Authentic engagement is when you stop asking:</p>
            <div className="bg-red-900/50 p-4 rounded-xl border-l-4 border-red-500 mb-4">
              <p className="text-red-100 font-semibold">"What will they think of me?"</p>
            </div>
            <p className="text-purple-100 text-lg mb-4">And start asking:</p>
            <div className="bg-green-900/50 p-4 rounded-xl border-l-4 border-green-500">
              <p className="text-green-100 font-semibold">"What is this person actually experiencing?"</p>
            </div>
          </div>
          <p className="text-purple-200 text-base">This shift doesn't make you less likeable—it makes you MORE magnetic because people feel genuinely seen.</p>
        </div>
      )
    },
    {
      title: 'The Four Pillars of Authenticity',
      type: 'framework',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-5 rounded-2xl border border-blue-600/50">
            <div className="flex gap-3 mb-3">
              <Volume2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-lg">Pillar 1: Speech Pace</h4>
                <p className="text-blue-100 text-sm mt-1">Speak slower and more grounded. Rushing = managing impressions. Slowing down = processing genuinely.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 p-5 rounded-2xl border border-emerald-600/50">
            <div className="flex gap-3 mb-3">
              <Lightbulb className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-lg">Pillar 2: Curiosity Shift</h4>
                <p className="text-emerald-100 text-sm mt-1">Ask about THEM, not to impress. Replace "Will they like me?" with "What do they actually experience?"</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 p-5 rounded-2xl border border-pink-600/50">
            <div className="flex gap-3 mb-3">
              <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-lg">Pillar 3: Presence Over Performance</h4>
                <p className="text-pink-100 text-sm mt-1">Stop monitoring yourself. When you forget you're being watched, that's when real connection happens.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 p-5 rounded-2xl border border-amber-600/50">
            <div className="flex gap-3 mb-3">
              <Pause className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-lg">Pillar 4: Comfort with Silence</h4>
                <p className="text-amber-100 text-sm mt-1">Silence isn't awkward—it's thinking. Genuine people pause. Performers fill every gap.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Performing vs. Authentic: Real Examples',
      type: 'comparison',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/40 p-5 rounded-2xl border border-red-600/50">
              <h4 className="font-bold text-red-200 mb-3 flex items-center gap-2"><span className="text-2xl">❌</span> Performing</h4>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold text-red-100">Pace:</span> <span className="text-red-200">Fast, energetic, filling silence</span></p>
                <p><span className="font-semibold text-red-100">Questions:</span> <span className="text-red-200">"That's so cool! I do that too!"</span></p>
                <p><span className="font-semibold text-red-100">Focus:</span> <span className="text-red-200">"Do they like me?"</span></p>
                <p><span className="font-semibold text-red-100">Energy:</span> <span className="text-red-200">Exhausting, calculating</span></p>
              </div>
            </div>

            <div className="bg-green-900/40 p-5 rounded-2xl border border-green-600/50">
              <h4 className="font-bold text-green-200 mb-3 flex items-center gap-2"><span className="text-2xl">✓ Authentic</span></h4>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold text-green-100">Pace:</span> <span className="text-green-200">Slower, thoughtful, with pauses</span></p>
                <p><span className="font-semibold text-green-100">Questions:</span> <span className="text-green-200">"Tell me more about that. What did that feel like?"</span></p>
                <p><span className="font-semibold text-green-100">Focus:</span> <span className="text-green-200">"What are they experiencing?"</span></p>
                <p><span className="font-semibold text-green-100">Energy:</span> <span className="text-green-200">Effortless, natural, energizing</span></p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 p-5 rounded-2xl border border-purple-600/50">
            <p className="text-purple-100 text-sm">
              <span className="font-semibold text-purple-200">The paradox:</span> When you stop trying to be liked, people like you MORE. Why? Because they can finally relax around you too.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Your Starting Point',
      type: 'assessment',
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-purple-200 font-semibold mb-3">How often do you catch yourself performing in conversations?</label>
            <div className="space-y-2">
              {performFreqOptions.map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-purple-900/40 rounded-xl border border-purple-600/30 cursor-pointer hover:border-purple-500/50 transition-all">
                  <input
                    type="radio"
                    name="performFreq"
                    value={option}
                    checked={baselineAssessment?.performFreq === option}
                    onChange={(e) => setBaselineAssessment(prev => ({ ...prev, performFreq: e.target.value }))}
                    className="w-4 h-4"
                  />
                  <span className="text-purple-100 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-purple-200 font-semibold mb-3">What blocks you from being authentic?</label>
            <div className="space-y-2">
              {blockerOptions.map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-purple-900/40 rounded-xl border border-purple-600/30 cursor-pointer hover:border-purple-500/50 transition-all">
                  <input
                    type="checkbox"
                    checked={baselineAssessment?.blockers?.includes(option) || false}
                    onChange={(e) => setBaselineAssessment(prev => ({
                      ...prev,
                      blockers: e.target.checked 
                        ? [...(prev?.blockers || []), option]
                        : (prev?.blockers || []).filter(b => b !== option)
                    }))}
                    className="w-4 h-4"
                  />
                  <span className="text-purple-100 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-green-900/30 p-4 rounded-xl border border-green-600/50">
            <p className="text-green-100 text-sm">
              <span className="font-semibold">Good news:</span> Authenticity is a skill. You're about to practice it and measure your progress. Ready?
            </p>
          </div>
        </div>
      )
    }
  ];

  // ============================================================================
  // PHASE 2: AI PRACTICE
  // ============================================================================

  const startAISession = () => {
    setCurrentSession({
      id: Date.now(),
      startTime: new Date(),
      naturalMoments: 0,
      pauseCount: 0,
      deepQuestions: 0,
      speechQuality: 50
    });
    setSessionPhase('active');
    setIsTracking(true);
    setSessionTimer(0);
  };

  const recordNaturalMoment = () => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        naturalMoments: prev.naturalMoments + 1
      };
    });
    setMetrics(prev => ({
      ...prev,
      naturalMoments: prev.naturalMoments + 1,
      emotionalHonesty: Math.min(100, prev.emotionalHonesty + 8)
    }));
  };

  const recordSlowedDownResponse = () => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pauseCount: prev.pauseCount + 1
      };
    });
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
      speedScore: Math.min(100, prev.speedScore + 5)
    }));
  };

  const recordDeepQuestion = () => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        deepQuestions: prev.deepQuestions + 1
      };
    });
  };

  const endAISession = () => {
    const quality = Math.min(
      100,
      (currentSession.naturalMoments * 15) +
      (currentSession.pauseCount * 5) +
      (currentSession.deepQuestions * 10)
    );

    const session = {
      ...currentSession,
      endTime: new Date(),
      duration: sessionTimer,
      quality
    };

    setSessions(prev => [...prev, session]);
    setCurrentSession(null);
    setSessionPhase('complete');
    setIsTracking(false);
  };

  // ============================================================================
  // PHASE 3: REAL-WORLD TRACKING
  // ============================================================================

  const addConversationLog = () => {
    if (!newLog.person.trim() || !newLog.duration) return;

    const log = {
      id: Date.now(),
      ...newLog,
      timestamp: new Date()
    };

    setConversationLogs(prev => [...prev, log]);
    setNewLog({
      person: '',
      duration: '',
      selfFocusScore: 5,
      speedRating: 5,
      naturalMoments: 0,
      reflection: ''
    });
  };

  const deleteLog = (id) => {
    setConversationLogs(prev => prev.filter(log => log.id !== id));
  };

  // Analytics calculations
  const avgAuthenticityScore = conversationLogs.length > 0
    ? (conversationLogs.reduce((sum, log) => sum + (10 - log.selfFocusScore + log.speedRating), 0) / conversationLogs.length).toFixed(1)
    : 0;

  const totalNaturalMoments = conversationLogs.reduce((sum, log) => sum + log.naturalMoments, 0);

  const trend = conversationLogs.length >= 2
  ? (conversationLogs.at(-1)?.selfFocusScore ?? 0) < (conversationLogs[0]?.selfFocusScore ?? 0) 
      ? 'improving' 
      : 'needs-work'
  : null;


  // ============================================================================
  // RENDERING
  // ============================================================================

  if (phase === 'education') {
    const current = educationContent[educationStep];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
                Authentic Engagement
              </h1>
              <span className="text-purple-400 text-sm font-semibold">Step {educationStep + 1} of {educationContent.length}</span>
            </div>
            <div className="h-1 bg-purple-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((educationStep + 1) / educationContent.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <h2 className="text-3xl font-bold text-purple-100 mb-6">{current.title}</h2>
            {current.content}
          </div>

          <div className="flex gap-4 md:gap-6">
            <button
              onClick={() => setEducationStep(Math.max(0, educationStep - 1))}
              disabled={educationStep === 0}
              className="flex-1 px-6 py-4 bg-purple-900/60 hover:bg-purple-800/60 disabled:opacity-50 rounded-2xl font-semibold transition-all border border-purple-600/50"
            >
              Previous
            </button>

            {educationStep === educationContent.length - 1 && baselineAssessment?.performFreq ? (
              <button
                onClick={() => setPhase('practice')}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-semibold transition-all shadow-lg"
              >
                Start Practice Sessions
              </button>
            ) : (
              <button
                onClick={() => setEducationStep(Math.min(educationContent.length - 1, educationStep + 1))}
                disabled={educationStep === educationContent.length - 1 && !baselineAssessment?.performFreq}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-2xl font-semibold transition-all shadow-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'practice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Practice Mode
            </h1>
            <button
              onClick={() => setPhase('realworld')}
              className="px-6 py-3 bg-purple-900/60 hover:bg-purple-800/60 rounded-xl font-semibold transition-all text-sm"
            >
              Skip to Real World
            </button>
          </div>

          {!currentSession && sessionPhase === 'idle' && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-purple-100 mb-4">AI Conversation Simulator</h2>
              <p className="text-purple-300 mb-6">Have a 3-5 minute conversation with an AI designed to help you practice authentic engagement. The AI will:</p>
              
              <ul className="space-y-2 mb-8 text-purple-200 text-sm">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" /> Detect when you slow down and provide feedback</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" /> Reward genuine curiosity with warmth</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" /> Help you get comfortable with silence</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" /> Measure your authenticity in real-time</li>
              </ul>

              <button
                onClick={startAISession}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Conversation
              </button>
            </div>
          )}

         

          {sessions.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-purple-100 mb-6">Your Practice Sessions</h2>
              
              <div className="space-y-4">
                {sessions.map(session => (
                  <div key={session.id} className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-purple-100">{new Date(session.startTime).toLocaleDateString()}</p>
                      <p className="text-2xl font-bold text-white">{session.quality.toFixed(0)}<span className="text-sm text-purple-300">/100</span></p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <p className="text-purple-400">Duration</p>
                        <p className="font-bold text-white">{formatTime(session.duration)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-400">Authentic Moments</p>
                        <p className="font-bold text-white">{session.naturalMoments}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-400">Pauses</p>
                        <p className="font-bold text-white">{session.pauseCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sessions.length >= 3 && (
                <button
                  onClick={() => setPhase('realworld')}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-lg"
                >
                  Ready for Real Conversations
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'realworld') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-2">
              Real-World Tracking
            </h1>
            <p className="text-purple-300">Log your conversations and track your authentic engagement progress</p>
          </div>

          {/* Add Conversation */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">Log a Conversation</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-purple-200 font-semibold mb-2">Who did you talk with?</label>
                <input
                  type="text"
                  value={newLog.person}
                  onChange={(e) => setNewLog(prev => ({ ...prev, person: e.target.value }))}
                  placeholder="e.g., Friend, Colleague, Family member"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-600/30 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-semibold mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newLog.duration}
                  onChange={(e) => setNewLog(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 15"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-600/30 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-semibold mb-3">Self-Focus vs. Other-Focus</label>
                <p className="text-purple-400 text-sm mb-3">How much were you thinking about their impression vs. actually listening?</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-red-400 font-semibold">Self-Focused</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newLog.selfFocusScore}
                    onChange={(e) => setNewLog(prev => ({ ...prev, selfFocusScore: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-green-400 font-semibold">Other-Focused</span>
                </div>
                <p className="text-center text-white font-bold mt-2">{newLog.selfFocusScore}/10</p>
              </div>

              <div>
                <label className="block text-purple-200 font-semibold mb-3">Speech Pace</label>
                <p className="text-purple-400 text-sm mb-3">Did you slow down and speak more grounded?</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-red-400 font-semibold">Rushed</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newLog.speedRating}
                    onChange={(e) => setNewLog(prev => ({ ...prev, speedRating: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-green-400 font-semibold">Grounded</span>
                </div>
                <p className="text-center text-white font-bold mt-2">{newLog.speedRating}/10</p>
              </div>

              <div>
                <label className="block text-purple-200 font-semibold mb-2">Natural Moments Count</label>
                <input
                  type="number"
                  min="0"
                  value={newLog.naturalMoments}
                  onChange={(e) => setNewLog(prev => ({ ...prev, naturalMoments: parseInt(e.target.value) || 0 }))}
                  placeholder="How many times did you feel genuine?"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-600/30 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-semibold mb-2">Reflection</label>
                <textarea
                  value={newLog.reflection}
                  onChange={(e) => setNewLog(prev => ({ ...prev, reflection: e.target.value }))}
                  placeholder="What did you notice? When did you feel most authentic?"
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-600/30 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-purple-400 resize-none h-24"
                />
              </div>

              <button
                onClick={addConversationLog}
                disabled={!newLog.person.trim() || !newLog.duration}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Log Conversation
              </button>
            </div>
          </div>

          {/* Analytics Dashboard */}
          {conversationLogs.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-100">Your Analytics</h2>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {showAnalytics ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
              </div>

              {showAnalytics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 text-center">
                      <p className="text-purple-400 text-sm font-semibold">Avg Authenticity Score</p>
                      <p className="text-4xl font-bold text-white mt-2">{avgAuthenticityScore}<span className="text-lg text-purple-300">/10</span></p>
                    </div>

                    <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 text-center">
                      <p className="text-purple-400 text-sm font-semibold">Total Conversations</p>
                      <p className="text-4xl font-bold text-white mt-2">{conversationLogs.length}</p>
                    </div>

                    <div className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 text-center">
                      <p className="text-purple-400 text-sm font-semibold">Natural Moments</p>
                      <p className="text-4xl font-bold text-white mt-2">{totalNaturalMoments}</p>
                    </div>
                  </div>

                  {trend && (
                    <div className={`p-5 rounded-2xl border-2 ${trend === 'improving' ? 'bg-green-900/30 border-green-600/50' : 'bg-yellow-900/30 border-yellow-600/50'}`}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${trend === 'improving' ? 'text-green-400' : 'text-yellow-400'}`} />
                        <p className={`font-semibold ${trend === 'improving' ? 'text-green-200' : 'text-yellow-200'}`}>
                          {trend === 'improving' 
                            ? 'Your authenticity is improving! You\'re getting more other-focused over time.'
                            : 'Keep practicing! You\'re building the skill of authentic engagement.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Conversation History */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">Conversation History</h2>

            {conversationLogs.length === 0 ? (
              <div className="text-center py-12 bg-purple-950/30 rounded-2xl border-2 border-purple-700/30">
                <Users className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
                <p className="text-purple-300 text-lg font-semibold mb-2">No conversations logged yet</p>
                <p className="text-purple-400">Log your first real conversation above to start tracking your progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversationLogs.map(log => (
                  <div 
                    key={log.id}
                    className="bg-purple-950/50 p-5 rounded-2xl border border-purple-700/30 hover:border-purple-600/50 transition-all cursor-pointer"
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{log.person}</h3>
                        <p className="text-purple-400 text-sm">{log.timestamp.toLocaleDateString()} • {log.duration} min</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                          <p className="text-white font-bold">{((10 - log.selfFocusScore + log.speedRating) / 2).toFixed(1)}<span className="text-sm text-purple-200">/10</span></p>
                        </div>
                      </div>
                    </div>

                    {expandedLog === log.id && (
                      <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-600/30 mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-purple-400 text-xs font-semibold uppercase">Self-Focus</p>
                            <p className="text-white font-bold">{log.selfFocusScore}/10 (Other-Focused)</p>
                          </div>
                          <div>
                            <p className="text-purple-400 text-xs font-semibold uppercase">Speech Pace</p>
                            <p className="text-white font-bold">{log.speedRating}/10 (Grounded)</p>
                          </div>
                        </div>
                        {log.naturalMoments > 0 && (
                          <div>
                            <p className="text-purple-400 text-xs font-semibold uppercase">Authentic Moments</p>
                            <p className="text-white font-bold">{log.naturalMoments}</p>
                          </div>
                        )}
                        {log.reflection && (
                          <div>
                            <p className="text-purple-400 text-xs font-semibold uppercase">Your Reflection</p>
                            <p className="text-purple-200 text-sm mt-1">{log.reflection}</p>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLog(log.id);
                          }}
                          className="w-full mt-4 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-600/50 rounded-lg text-red-300 font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progression Markers */}
          <div className="mt-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">Your Progress</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-purple-100">Learned the 4 pillars of authentic engagement</span>
              </div>

              {sessions.length >= 1 && (
                <div className="flex items-center gap-3 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-purple-100">Completed {sessions.length} AI practice session{sessions.length > 1 ? 's' : ''}</span>
                </div>
              )}

              {conversationLogs.length >= 1 && (
                <div className="flex items-center gap-3 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-purple-100">Logged {conversationLogs.length} real conversation{conversationLogs.length > 1 ? 's' : ''}</span>
                </div>
              )}

              {conversationLogs.length >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-purple-950/50 rounded-xl border border-purple-700/30">
                  <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-purple-100 font-semibold">Milestone: 5 Conversations Tracked</span>
                </div>
              )}

              {avgAuthenticityScore > 7 && conversationLogs.length >= 3 && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl border border-green-600/50">
                  <Award className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-green-100 font-semibold">Achievement: High Authenticity Score!</span>
                </div>
              )}
            </div>

            <button
              onClick={onNext}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-lg"
            >
              Continue to Next Step
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default AuthenticEngagement;