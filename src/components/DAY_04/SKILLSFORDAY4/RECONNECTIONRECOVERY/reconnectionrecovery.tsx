import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Heart, Brain,
  MessageCircle, Users, Clock, Target, Shield, Zap, Award,
  TrendingUp, Lightbulb, BookOpen, Send, Calendar, Eye,
  AlertTriangle, ThumbsUp, Meh, ThumbsDown, Copy, Download,
  Sparkles, Trophy, Flame, Star, ChevronDown, ChevronUp, Play
} from 'lucide-react';

// ============================================================================
// DATA & CONSTANTS
// ============================================================================

const SETBACK_CATEGORIES = {
  communication: {
    id: 'communication',
    title: 'Communication Breakdowns',
    icon: '💬',
    color: 'from-blue-500 to-cyan-500',
    options: [
      'Awkward silence that killed momentum',
      'Said something that landed wrong',
      'Conversation fizzled out awkwardly',
      'Misread social cues badly'
    ]
  },
  commitment: {
    id: 'commitment',
    title: 'Commitment Failures',
    icon: '📅',
    color: 'from-purple-500 to-pink-500',
    options: [
      'Ghosted someone unintentionally',
      'Cancelled plans (maybe multiple times)',
      "Didn't follow up after promising to",
      'Disappeared from group/friendship'
    ]
  },
  boundary: {
    id: 'boundary',
    title: 'Boundary Violations',
    icon: '🚧',
    color: 'from-orange-500 to-red-500',
    options: [
      'Overshared too much too soon',
      'Pushed too hard for connection',
      "Crossed a line you didn't see",
      'Made someone uncomfortable'
    ]
  },
  missed: {
    id: 'missed',
    title: 'Missed Opportunities',
    icon: '⏰',
    color: 'from-yellow-500 to-orange-500',
    options: [
      "Didn't speak up when you should have",
      'Let a connection fade from neglect',
      'Avoided someone after initial awkwardness',
      'Froze in a social moment'
    ]
  },
  conflict: {
    id: 'conflict',
    title: 'Conflict/Tension',
    icon: '⚡',
    color: 'from-red-500 to-pink-500',
    options: [
      'Had a disagreement that ended badly',
      'Left something unresolved',
      'Created tension in group dynamic',
      'Damaged trust somehow'
    ]
  }
};

const RECOVERY_METHODS = {
  quickReturn: {
    id: 'quickReturn',
    title: 'The Quick Return',
    icon: '⚡',
    difficulty: 'EASY',
    successRate: 85,
    when: 'Minor awkwardness, within 24h',
    strategy: 'Act like nothing happened, just re-engage',
    steps: [
      'Wait 2-6 hours (let the moment breathe)',
      'Text/message about unrelated topic',
      'Be casual, not apologetic',
      'If they respond normally → you\'re golden',
      'If they\'re cold → wait 24h, try next method'
    ],
    examples: [
      'Yo, did you see [relevant topic]?',
      'Random thought: [share something]',
      'Hey! How\'d that [thing they mentioned] go?'
    ]
  },
  naturalReturn: {
    id: 'naturalReturn',
    title: 'The Natural Return',
    icon: '🌊',
    difficulty: 'MEDIUM',
    successRate: 70,
    when: 'You ghosted/disappeared, 3-7 days passed',
    strategy: 'Show up in natural context, no grand explanation',
    steps: [
      'Pick a natural re-entry point',
      'Show up confidently (fake it till you make it)',
      'Greet them warmly but not desperately',
      'Engage briefly, don\'t force deep conversation',
      'Let it rebuild naturally over 2-3 interactions'
    ],
    examples: [
      'Hey! Been swamped, how are you?',
      'Good to see you! What\'ve you been up to?',
      'I know it\'s been a minute, let\'s catch up soon'
    ]
  },
  briefAcknowledgment: {
    id: 'briefAcknowledgment',
    title: 'The Brief Acknowledgment',
    icon: '🎯',
    difficulty: 'MEDIUM',
    successRate: 75,
    when: 'Medium awkwardness, both know something was off',
    strategy: 'Name it briefly, then move forward',
    steps: [
      'Lead with the acknowledgment (don\'t wait)',
      'Keep it SHORT (1-2 sentences max)',
      'Don\'t over-explain or justify',
      'Shift immediately to normal topic',
      'Give them space to respond naturally'
    ],
    examples: [
      'Hey, I think I came on too strong last time. How\'s your week going?',
      'That got awkward, my bad! Anyway, [new topic]',
      'I\'ve been thinking about our chat - probably overshared haha. But hey, [pivot]'
    ]
  },
  fullRepair: {
    id: 'fullRepair',
    title: 'The Full Repair',
    icon: '🔧',
    difficulty: 'HARD',
    successRate: 60,
    when: 'Significant breach, trust damaged',
    strategy: 'Genuine acknowledgment + changed behavior',
    steps: [
      'Take responsibility (no excuses/justifications)',
      'Show you understand the impact',
      'Apologize sincerely (not performatively)',
      'State what you\'ll do differently',
      'Give them control of the pace',
      'Follow through with actions, not just words'
    ],
    examples: [
      'I crossed a line when [specific action]. I see now how that affected you. I\'m sorry. Going forward, I\'ll [specific change]. No pressure to respond - whenever you\'re ready.'
    ]
  },
  freshStart: {
    id: 'freshStart',
    title: 'The Fresh Start',
    icon: '🌅',
    difficulty: 'HARD',
    successRate: 50,
    when: 'Long time passed, or complete reset needed',
    strategy: 'Acknowledge the gap, propose new terms',
    steps: [
      'Accept the past is past (don\'t rehash)',
      'Express genuine interest in NOW',
      'Propose specific, low-stakes interaction',
      'Be okay if they decline (no guilt)',
      'If they engage, start slow and consistent'
    ],
    examples: [
      'It\'s been forever! I\'ve been thinking about you. Want to grab coffee sometime? No pressure.',
      'I know we fell out of touch. I\'d love to reconnect if you\'re open to it. How\'s life?',
      'Different chapter now, but I value you. Coffee/call sometime?'
    ]
  }
};

const RELATIONSHIP_TYPES = [
  { id: 'close-friend', label: 'Close Friend', icon: '💙' },
  { id: 'new-friend', label: 'New Friend/Acquaintance', icon: '🌟' },
  { id: 'romantic', label: 'Romantic Interest', icon: '💗' },
  { id: 'colleague', label: 'Colleague/Professional', icon: '💼' },
  { id: 'family', label: 'Family Member', icon: '👨‍👩‍👧' },
  { id: 'group', label: 'Group/Community Member', icon: '👥' }
];

const MOTIVATIONAL_QUOTES = [
  'Recovery is not about perfection—it\'s about showing up.',
  'Every awkward moment is a chance to practice resilience.',
  'The courage to reconnect is the foundation of lasting relationships.',
  'Your anxiety about the situation is worse than the situation itself.',
  'Relationships grow stronger through repair, not perfection.',
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ReconnectionRecovery: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  // ============================================================================
  // STATE - PHASE TRACKING
  // ============================================================================
  const [currentPhase, setCurrentPhase] = useState(1);
  const [quote, setQuote] = useState('');

  // ============================================================================
  // STATE - PHASE 1: DIAGNOSTIC
  // ============================================================================
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSetback, setSelectedSetback] = useState('');
  const [severityLevel, setSeverityLevel] = useState(5);
  const [userPerspective, setUserPerspective] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // ============================================================================
  // STATE - PHASE 2: EDUCATION
  // ============================================================================
  const [selectedMethod, setSelectedMethod] = useState('');
  const [expandedMethod, setExpandedMethod] = useState('');
  const [understandsFramework, setUnderstandsFramework] = useState(false);

  // ============================================================================
  // STATE - PHASE 3: PERSONALIZATION
  // ============================================================================
  const [relationshipType, setRelationshipType] = useState('');
  const [relationshipHistory, setRelationshipHistory] = useState('');
  const [theirReaction, setTheirReaction] = useState('');
  const [biggestFear, setBiggestFear] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('text');
  const [toneLevel, setToneLevel] = useState(50);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTiming, setSelectedTiming] = useState('');

  // ============================================================================
  // STATE - PHASE 4: CONFIDENCE
  // ============================================================================
  const [pastWins, setPastWins] = useState(['', '', '']);
  const [confidenceBefore, setConfidenceBefore] = useState(3);
  const [confidenceAfter, setConfidenceAfter] = useState(3);
  const [worstCase, setWorstCase] = useState('');
  const [canSurvive, setCanSurvive] = useState(false);

  // ============================================================================
  // STATE - PHASE 5: EXECUTION
  // ============================================================================
  const [commitments, setCommitments] = useState<string[]>([]);
  const [accountabilityMethod, setAccountabilityMethod] = useState('');
  const [readyToSend, setReadyToSend] = useState(false);

  // ============================================================================
  // STATE - PHASE 6 & 7
  // ============================================================================
  const [showQuickRef, setShowQuickRef] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPhase]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const phaseProgress = useMemo(() => (currentPhase / 7) * 100, [currentPhase]);

  const severityLabel = useMemo(() => {
    if (severityLevel <= 3) return { text: 'Minor Hiccup', icon: '🌱', color: 'text-green-400', recovery: 'EASY MODE' };
    if (severityLevel <= 6) return { text: 'Noticeable Awkward', icon: '😬', color: 'text-yellow-400', recovery: 'STANDARD APPROACH' };
    if (severityLevel <= 8) return { text: 'Significant Misstep', icon: '😰', color: 'text-orange-400', recovery: 'REQUIRES STRATEGY' };
    return { text: 'Major Breach', icon: '🚨', color: 'text-red-400', recovery: 'CAREFUL RECONSTRUCTION' };
  }, [severityLevel]);

  const recommendedMethod = useMemo(() => {
    if (!selectedCategory) return null;
    if (severityLevel <= 3) return 'quickReturn';
    if (selectedCategory === 'commitment') return 'naturalReturn';
    if (severityLevel <= 6) return 'briefAcknowledgment';
    if (severityLevel <= 8) return 'fullRepair';
    return 'freshStart';
  }, [selectedCategory, severityLevel]);

  const generatedMessages = useMemo(() => {
    if (!selectedMethod || !relationshipType) return [];
    
    const method = RECOVERY_METHODS[selectedMethod as keyof typeof RECOVERY_METHODS];
    const casual = toneLevel < 40;
    const sincere = toneLevel > 60;
    
    return method.examples.map((example, idx) => ({
      id: idx,
      text: example,
      tone: casual ? 'casual' : sincere ? 'sincere' : 'balanced'
    }));
  }, [selectedMethod, relationshipType, toneLevel]);

  const isPhase1Complete = selectedCategory && selectedSetback && userPerspective.length > 10;
  const isPhase2Complete = selectedMethod && understandsFramework;
  const isPhase3Complete = relationshipType && selectedChannel && customMessage.length > 10;
  const isPhase4Complete = confidenceAfter >= 7;
  const isPhase5Complete = commitments.length >= 4 && accountabilityMethod;

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleNextPhase = () => {
    if (currentPhase === 1 && !isPhase1Complete) {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }
    if (currentPhase === 2 && !isPhase2Complete) {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }
    if (currentPhase === 3 && !isPhase3Complete) {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }
    
    setCurrentPhase(prev => Math.min(prev + 1, 7));
  };

  const handlePrevPhase = () => {
    setCurrentPhase(prev => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    const recoveryData = {
      diagnostic: { selectedCategory, selectedSetback, severityLevel, userPerspective },
      method: selectedMethod,
      personalization: { relationshipType, customMessage, selectedChannel, selectedTiming },
      confidence: { before: confidenceBefore, after: confidenceAfter },
      execution: { commitments, accountabilityMethod }
    };
    
    console.log('Recovery Plan:', recoveryData);
    onNext();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadPlan = () => {
    const plan = `
═══════════════════════════════════════
    MY RECOVERY PLAN
═══════════════════════════════════════

SITUATION: ${selectedSetback}
SEVERITY: ${severityLevel}/10 - ${severityLabel.text}

SELECTED METHOD: ${RECOVERY_METHODS[selectedMethod as keyof typeof RECOVERY_METHODS]?.title}
WHY: ${RECOVERY_METHODS[selectedMethod as keyof typeof RECOVERY_METHODS]?.strategy}

MY MESSAGE:
${customMessage}

WHEN I'LL SEND IT: ${selectedTiming}

═══════════════════════════════════════
Created: ${new Date().toLocaleDateString()}
═══════════════════════════════════════
    `;
    
    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-plan.txt';
    a.click();
  };

  // ============================================================================
  // RENDER: PHASE INDICATOR
  // ============================================================================
  const renderPhaseIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">
            Phase {currentPhase} of 7
          </span>
        </div>
        <span className="text-sm font-bold text-purple-200">{Math.round(phaseProgress)}%</span>
      </div>
      
      <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500"
          style={{ width: `${phaseProgress}%` }}
        />
      </div>

      {/* Phase Names */}
      <div className="grid grid-cols-7 gap-1 mt-3">
        {['Diagnostic', 'Education', 'Plan', 'Confidence', 'Execute', 'Track', 'Integrate'].map((name, idx) => (
          <div 
            key={idx}
            className={`text-xs text-center py-1 rounded ${
              currentPhase === idx + 1 
                ? 'bg-purple-600/50 text-white font-bold' 
                : currentPhase > idx + 1 
                  ? 'text-green-400' 
                  : 'text-purple-500'
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 1 - DIAGNOSTIC
  // ============================================================================
  const renderPhase1 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-blue-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Diagnostic & Validation</h2>
            <p className="text-sm text-purple-300">Let's understand what happened</p>
          </div>
        </div>
        <p className="text-purple-200 italic">"{quote}"</p>
      </div>

      {/* Setback Type Selector */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          What kind of setback was this?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.values(SETBACK_CATEGORIES).map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedSetback('');
              }}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                selectedCategory === category.id
                  ? `bg-gradient-to-br ${category.color} border-white/50 scale-105`
                  : 'bg-purple-950/50 border-purple-700/30 hover:border-purple-600/50'
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="font-bold text-white mb-1">{category.title}</div>
              <div className="text-xs text-purple-300">{category.options.length} scenarios</div>
            </button>
          ))}
        </div>

        {/* Specific Scenario */}
        {selectedCategory && (
          <div className="space-y-3 animate-slide-up">
            <label className="block text-sm font-medium text-purple-300">Select the specific situation:</label>
            {SETBACK_CATEGORIES[selectedCategory as keyof typeof SETBACK_CATEGORIES].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSetback(option)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedSetback === option
                    ? 'bg-purple-600/50 border-purple-400 scale-[1.02]'
                    : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedSetback === option && <CheckCircle className="w-5 h-5 text-green-400" />}
                  <span className="text-sm text-purple-100">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Severity Assessment */}
      {selectedSetback && (
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
          <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            How bad was it really?
          </h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-purple-300">Impact Level</span>
              <span className={`text-2xl font-bold ${severityLabel.color}`}>
                {severityLevel}/10 {severityLabel.icon}
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={severityLevel}
              onChange={(e) => setSeverityLevel(parseInt(e.target.value))}
              className="w-full h-3 bg-purple-950/50 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  rgb(34 197 94) 0%, 
                  rgb(234 179 8) 30%, 
                  rgb(249 115 22) 60%, 
                  rgb(239 68 68) 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-purple-400 mt-2">
              <span>Minor</span>
              <span>Moderate</span>
              <span>Significant</span>
              <span>Major</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 ${
            severityLevel <= 3 ? 'bg-green-900/30 border-green-500/30' :
            severityLevel <= 6 ? 'bg-yellow-900/30 border-yellow-500/30' :
            severityLevel <= 8 ? 'bg-orange-900/30 border-orange-500/30' :
            'bg-red-900/30 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{severityLabel.icon}</span>
              <div>
                <div className={`font-bold ${severityLabel.color}`}>{severityLabel.text}</div>
                <div className="text-sm text-purple-300">Recovery: {severityLabel.recovery}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Perspective */}
      {selectedSetback && (
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
          <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            What happened from your perspective?
          </h3>
          
          <textarea
            value={userPerspective}
            onChange={(e) => setUserPerspective(e.target.value)}
            placeholder="Describe what happened in your own words... (This helps us understand the full context)"
            className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
            rows={4}
          />
          <div className="text-xs text-purple-400 mt-2">
            {userPerspective.length}/500 characters • Min 10 to continue
          </div>
        </div>
      )}

      {/* Validation Stats */}
      {selectedSetback && (
        <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-md p-6 rounded-2xl border-2 border-green-500/30 animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-6 h-6 text-green-400" />
            <h4 className="font-bold text-white">You're Not Alone</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">94%</div>
              <div className="text-xs text-purple-300">experienced this</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">78%</div>
              <div className="text-xs text-purple-300">recovered successfully</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">845</div>
              <div className="text-xs text-purple-300">recovered this week</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 2 - EDUCATION
  // ============================================================================
  const renderPhase2 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">The Recovery Framework</h2>
            <p className="text-sm text-purple-300">Learn the mental model for ALL future recoveries</p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          3 Key Principles
        </h3>

        <div className="space-y-4">
          <div className="p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">1️⃣</span>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2">RECONNECTION ≠ PERFECTION</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">❌</span>
                    <span className="text-purple-300">"I need to fix everything and make it perfect"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✅</span>
                    <span className="text-purple-100">"I just need to show up again naturally"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">2️⃣</span>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2">TIMING BEATS TECHNIQUE</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">❌</span>
                    <span className="text-purple-300">Wait until you have the "perfect" thing to say</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✅</span>
                    <span className="text-purple-100">A "good enough" message sent soon beats a perfect one sent never</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">3️⃣</span>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2">MATCH THE MAGNITUDE</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">❌</span>
                    <span className="text-purple-300">Write a novel apology for minor awkwardness</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✅</span>
                    <span className="text-purple-100">Small issues = light touch, big issues = genuine repair</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 5 Methods */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" />
          The 5 Recovery Methods
        </h3>

        <div className="space-y-3">
          {Object.entries(RECOVERY_METHODS).map(([key, method]) => (
            <div key={key} className="bg-purple-950/30 rounded-xl border border-purple-700/30 overflow-hidden">
              <button
                onClick={() => setExpandedMethod(expandedMethod === key ? '' : key)}
                className="w-full p-5 flex items-center justify-between hover:bg-purple-900/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{method.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-white mb-1">{method.title}</div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        method.difficulty === 'EASY' ? 'bg-green-600/30 text-green-300' :
                        method.difficulty === 'MEDIUM' ? 'bg-yellow-600/30 text-yellow-300' :
                        'bg-red-600/30 text-red-300'
                      }`}>
                        {method.difficulty}
                      </span>
                      <span className="text-purple-400">{method.successRate}% success</span>
                      <span className="text-purple-500">→ {method.when}</span>
                    </div>
                  </div>
                </div>
                {expandedMethod === key ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
              </button>

              {expandedMethod === key && (
                <div className="p-5 pt-0 animate-slide-up">
                  <div className="bg-purple-900/30 p-4 rounded-lg mb-4">
                    <div className="text-sm font-medium text-purple-200 mb-1">Strategy:</div>
                    <div className="text-purple-100">{method.strategy}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-purple-200 mb-3">Steps:</div>
                    <ol className="space-y-2">
                      {method.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-purple-100">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-600/50 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-purple-200 mb-3">Example Messages:</div>
                    <div className="space-y-2">
                      {method.examples.map((example, idx) => (
                        <div key={idx} className="p-3 bg-purple-950/50 rounded-lg border border-purple-700/30 text-sm text-purple-100">
                          "{example}"
                        </div>
                      ))}
                    </div>
                  </div>

                  {recommendedMethod === key && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                        RECOMMENDED FOR YOUR SITUATION
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Method Selector */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Select Your Recovery Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(RECOVERY_METHODS).map(([key, method]) => (
            <button
              key={key}
              onClick={() => setSelectedMethod(key)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMethod === key
                  ? 'bg-purple-600/50 border-purple-400 scale-105'
                  : recommendedMethod === key
                    ? 'bg-green-900/30 border-green-500/50 hover:border-green-400'
                    : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{method.icon}</span>
                <div className="font-bold text-white">{method.title}</div>
              </div>
              {recommendedMethod === key && (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <Star className="w-3 h-3" />
                  Recommended
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Understanding Check */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">Quick Check: Do you understand the framework?</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setUnderstandsFramework(true)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              understandsFramework
                ? 'bg-green-600/50 border-green-400'
                : 'bg-purple-950/30 border-purple-700/30 hover:border-green-500/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">Yes, I get it!</span>
            </div>
          </button>
          <button
            onClick={() => setUnderstandsFramework(false)}
            className="flex-1 p-4 rounded-xl border-2 bg-purple-950/30 border-purple-700/30 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold">Need clarification</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 3 - PERSONALIZATION
  // ============================================================================
  const renderPhase3 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-900/50 to-orange-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-pink-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Craft Your Approach</h2>
            <p className="text-sm text-purple-300">Personalize your recovery message</p>
          </div>
        </div>
      </div>

      {/* Relationship Context */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          What's your relationship?
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {RELATIONSHIP_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setRelationshipType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                relationshipType === type.id
                  ? 'bg-purple-600/50 border-purple-400 scale-105'
                  : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium text-white">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Context Questions */}
      {relationshipType && (
        <>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
            <h3 className="text-xl font-bold text-purple-100 mb-4">Tell me more context</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  How long have you known each other?
                </label>
                <textarea
                  value={relationshipHistory}
                  onChange={(e) => setRelationshipHistory(e.target.value)}
                  placeholder="e.g., Met 2 months ago at work, been texting regularly..."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  How did they react to the setback? (if you know)
                </label>
                <textarea
                  value={theirReaction}
                  onChange={(e) => setTheirReaction(e.target.value)}
                  placeholder="e.g., They seemed confused, or I haven't heard from them since..."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  What's your biggest fear about reaching out?
                </label>
                <textarea
                  value={biggestFear}
                  onChange={(e) => setBiggestFear(e.target.value)}
                  placeholder="e.g., That they'll think I'm weird, or they'll reject me completely..."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Channel Selection */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
            <h3 className="text-xl font-bold text-purple-100 mb-4">How will you reach out?</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['text', 'dm', 'in-person', 'call'].map(channel => (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedChannel === channel
                      ? 'bg-purple-600/50 border-purple-400 scale-105'
                      : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="text-sm font-medium text-white capitalize">{channel}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Calibration */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
            <h3 className="text-xl font-bold text-purple-100 mb-4">Set your tone</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-purple-300">Casual</span>
                <span className="text-sm text-purple-300">Sincere</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={toneLevel}
                onChange={(e) => setToneLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-purple-950/50 rounded-full appearance-none cursor-pointer"
              />
              
              <div className="text-center mt-3 text-sm">
                <span className={`font-bold ${
                  toneLevel < 40 ? 'text-blue-400' :
                  toneLevel > 60 ? 'text-pink-400' :
                  'text-purple-400'
                }`}>
                  {toneLevel < 40 ? '😎 Light & Breezy' :
                   toneLevel > 60 ? '💙 Genuine & Heartfelt' :
                   '⚖️ Balanced'}
                </span>
              </div>
            </div>
          </div>

          {/* Generated Messages */}
          {generatedMessages.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
              <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Suggested Messages
              </h3>

              <div className="space-y-3 mb-4">
                {generatedMessages.map((msg) => (
                  <div key={msg.id} className="group relative">
                    <button
                      onClick={() => setCustomMessage(msg.text)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        customMessage === msg.text
                          ? 'bg-purple-600/50 border-purple-400'
                          : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-sm text-purple-100 mb-2">"{msg.text}"</div>
                          <div className="text-xs text-purple-400 capitalize">{msg.tone} tone</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(msg.text);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-purple-700/50 rounded-lg"
                        >
                          <Copy className="w-4 h-4 text-purple-300" />
                        </button>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-xs text-purple-400 text-center">
                💡 Select one or write your own below
              </div>
            </div>
          )}

          {/* Custom Message */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
            <h3 className="text-xl font-bold text-purple-100 mb-4">Your final message</h3>
            
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write or edit your message here..."
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
              rows={5}
            />
            <div className="text-xs text-purple-400 mt-2">
              {customMessage.length}/500 characters
            </div>
          </div>

          {/* Timing */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 animate-slide-up">
            <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              When will you send it?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'now', label: 'Right Now', icon: '⚡', desc: 'Strike while motivated' },
                { id: '1hour', label: 'In 1 Hour', icon: '⏰', desc: 'Let it sit briefly' },
                { id: 'tonight', label: 'Tonight', icon: '🌙', desc: 'Evening vibes' },
                { id: 'tomorrow', label: 'Tomorrow', icon: '☀️', desc: 'Fresh perspective' }
              ].map(timing => (
                <button
                  key={timing.id}
                  onClick={() => setSelectedTiming(timing.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTiming === timing.id
                      ? 'bg-purple-600/50 border-purple-400 scale-105'
                      : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{timing.icon}</span>
                    <div className="font-bold text-white">{timing.label}</div>
                  </div>
                  <div className="text-xs text-purple-400 ml-11">{timing.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 4 - CONFIDENCE BUILDING
  // ============================================================================
  const renderPhase4 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Build Your Confidence</h2>
            <p className="text-sm text-purple-300">You've got this - here's proof</p>
          </div>
        </div>
      </div>

      {/* Confidence Assessment - Before */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">How confident were you BEFORE this session?</h3>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
            <button
              key={level}
              onClick={() => setConfidenceBefore(level)}
              className={`p-3 rounded-xl border-2 transition-all ${
                confidenceBefore === level
                  ? 'bg-blue-600/50 border-blue-400 scale-110'
                  : 'bg-purple-950/30 border-purple-700/30 hover:border-blue-500/50'
              }`}
            >
              <div className="text-lg font-bold text-white">{level}</div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-purple-400">
          <span>😰 Terrified</span>
          <span>😎 Totally confident</span>
        </div>
      </div>

      {/* Past Wins */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Remind yourself: You've recovered before
        </h3>
        
        <div className="space-y-3">
          {pastWins.map((win, idx) => (
            <div key={idx}>
              <label className="block text-sm text-purple-300 mb-2">
                Recovery Win #{idx + 1}
              </label>
              <input
                type="text"
                value={win}
                onChange={(e) => {
                  const newWins = [...pastWins];
                  newWins[idx] = e.target.value;
                  setPastWins(newWins);
                }}
                placeholder={`e.g., ${idx === 0 ? 'Fixed awkward moment with roommate' : idx === 1 ? 'Reconnected after ghosting a friend' : 'Apologized to coworker'}`}
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
          <div className="text-sm text-green-300">
            💪 You've navigated {pastWins.filter(w => w.length > 0).length} similar situations. You can do this too.
          </div>
        </div>
      </div>

      {/* Worst Case Reality Check */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Worst-Case Reality Check
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-purple-300 mb-2">
              What's the absolute WORST that could realistically happen?
            </label>
            <textarea
              value={worstCase}
              onChange={(e) => setWorstCase(e.target.value)}
              placeholder="e.g., They don't respond, or they say they're not interested..."
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          </div>

          <div className="p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={canSurvive}
                onChange={(e) => setCanSurvive(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-purple-500 bg-purple-950/50"
              />
              <span className="text-sm text-purple-100">
                ✅ I can survive this outcome (it won't destroy me)
              </span>
            </label>
          </div>

          {canSurvive && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl animate-slide-up">
              <div className="text-sm text-green-300">
                🎯 Exactly. The worst case is survivable. Which means you have nothing to lose by trying.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Assessment - After */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">How confident are you NOW?</h3>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
            <button
              key={level}
              onClick={() => setConfidenceAfter(level)}
              className={`p-3 rounded-xl border-2 transition-all ${
                confidenceAfter === level
                  ? 'bg-green-600/50 border-green-400 scale-110'
                  : 'bg-purple-950/30 border-purple-700/30 hover:border-green-500/50'
              }`}
            >
              <div className="text-lg font-bold text-white">{level}</div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-purple-400 mb-4">
          <span>😰 Still worried</span>
          <span>😎 Ready to go</span>
        </div>

        {confidenceAfter > confidenceBefore && (
          <div className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-bold text-green-300">
                +{confidenceAfter - confidenceBefore} Confidence Boost!
              </span>
            </div>
            <div className="text-sm text-purple-200">
              That's what knowledge does - it transforms anxiety into action.
            </div>
          </div>
        )}

        {confidenceAfter >= 7 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl animate-slide-up">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-purple-100">
                You're ready. Let's do this. 🚀
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mental Rehearsal */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-pink-400" />
          Mental Rehearsal
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-purple-900/30 rounded-xl">
            <div className="text-sm font-medium text-purple-200 mb-2">Visualize:</div>
            <ol className="space-y-2 text-sm text-purple-100">
              <li className="flex gap-2">
                <span>1.</span>
                <span>You hit send on your message</span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>
                <span>You feel relief that you took action</span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>
                <span>Whatever happens, you handled it with courage</span>
              </li>
            </ol>
          </div>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <div className="text-sm text-blue-200">
              💭 Close your eyes for 10 seconds and picture yourself feeling proud after sending this. You've got this.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 5 - EXECUTION
  // ============================================================================
  const renderPhase5 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-orange-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Time to Execute</h2>
            <p className="text-sm text-purple-300">Make the commitment, then take action</p>
          </div>
        </div>
      </div>

      {/* Pre-Flight Check */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Pre-Flight Check
        </h3>

        <div className="space-y-3">
          {[
            { id: 'message', label: 'My message is ready', value: customMessage.length > 10 },
            { id: 'tone', label: 'The tone feels right', value: relationshipType !== '' },
            { id: 'timing', label: 'I know when I\'ll send it', value: selectedTiming !== '' },
            { id: 'confidence', label: 'I feel confident enough (7+)', value: confidenceAfter >= 7 }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                item.value
                  ? 'bg-green-900/30 border-green-500/30'
                  : 'bg-purple-950/30 border-purple-700/30'
              }`}
            >
              {item.value ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              )}
              <span className="text-sm text-purple-100">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Your Plan */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" />
          Your Recovery Plan
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-purple-900/30 rounded-xl">
            <div className="text-xs text-purple-400 mb-1">MESSAGE</div>
            <div className="text-sm text-purple-100 italic">"{customMessage}"</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-900/30 rounded-xl">
              <div className="text-xs text-purple-400 mb-1">METHOD</div>
              <div className="text-sm text-white font-medium">
                {RECOVERY_METHODS[selectedMethod as keyof typeof RECOVERY_METHODS]?.title || 'Not selected'}
              </div>
            </div>
            <div className="p-4 bg-purple-900/30 rounded-xl">
              <div className="text-xs text-purple-400 mb-1">CHANNEL</div>
              <div className="text-sm text-white font-medium capitalize">{selectedChannel}</div>
            </div>
          </div>

          <div className="p-4 bg-purple-900/30 rounded-xl">
            <div className="text-xs text-purple-400 mb-1">TIMING</div>
            <div className="text-sm text-white font-medium capitalize">
              {selectedTiming.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(customMessage)}
              className="flex-1 p-4 bg-blue-600/30 border-2 border-blue-500/50 rounded-xl hover:bg-blue-600/40 transition-all flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5" />
              <span className="font-medium">Copy Message</span>
            </button>
            <button
              onClick={downloadPlan}
              className="flex-1 p-4 bg-purple-600/30 border-2 border-purple-500/50 rounded-xl hover:bg-purple-600/40 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commitments */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Make Your Commitment
        </h3>

        <div className="space-y-3">
          {[
            'I will send this message within my chosen timeframe',
            'I will not overthink or edit it 50 more times',
            'I will accept whatever outcome happens',
            'I will be proud of myself for taking action',
            'I will track the outcome to learn from it'
          ].map((commitment, idx) => (
            <label
              key={idx}
              className="flex items-start gap-3 p-4 bg-purple-950/30 rounded-xl border-2 border-purple-700/30 cursor-pointer hover:border-orange-500/50 transition-all"
            >
              <input
                type="checkbox"
                checked={commitments.includes(commitment)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCommitments([...commitments, commitment]);
                  } else {
                    setCommitments(commitments.filter(c => c !== commitment));
                  }
                }}
                className="w-5 h-5 mt-0.5 rounded border-2 border-purple-500 bg-purple-950/50 flex-shrink-0"
              />
              <span className="text-sm text-purple-100">{commitment}</span>
            </label>
          ))}
        </div>

        {commitments.length === 5 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl animate-slide-up">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-orange-300">
                Full commitment achieved! You're locked in. 🔥
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Accountability */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">Accountability Method</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'self', label: 'Self-Accountability', icon: '💪', desc: 'I trust myself' },
            { id: 'friend', label: 'Tell a Friend', icon: '👥', desc: 'Share with someone' },
            { id: 'calendar', label: 'Calendar Reminder', icon: '📅', desc: 'Set an alarm' },
            { id: 'journal', label: 'Journal Entry', icon: '📝', desc: 'Write it down' }
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setAccountabilityMethod(method.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                accountabilityMethod === method.id
                  ? 'bg-purple-600/50 border-purple-400 scale-105'
                  : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{method.icon}</span>
                <div className="font-bold text-white">{method.label}</div>
              </div>
              <div className="text-xs text-purple-400 ml-11">{method.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Final Action */}
      <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Ready to Execute?
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-purple-900/30 rounded-xl text-center">
            <div className="text-sm text-purple-200 mb-4">
              You've done the work. You have a plan. You've built your confidence. 
              <br />
              <strong className="text-purple-100">Now it's time to take action.</strong>
            </div>
          </div>

          <button
            onClick={() => setReadyToSend(true)}
            disabled={commitments.length < 4 || !accountabilityMethod}
            className={`w-full p-6 rounded-2xl font-bold text-lg transition-all ${
              commitments.length >= 4 && accountabilityMethod
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white scale-100 hover:scale-105'
                : 'bg-purple-950/50 text-purple-600 cursor-not-allowed'
            }`}
          >
            {readyToSend ? '✅ Committed!' : '🚀 I\'m Ready - Let\'s Go!'}
          </button>

          {readyToSend && (
            <div className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl animate-slide-up text-center">
              <div className="text-sm text-green-300 mb-3">
                ✨ Excellent. Now go send that message. Come back after to log the outcome.
              </div>
              <div className="text-xs text-purple-400">
                Remember: Action beats anxiety. You've got this. 💪
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 6 - TRACKING
  // ============================================================================
  const renderPhase6 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-blue-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Track Your Outcome</h2>
            <p className="text-sm text-purple-300">Learning happens in the reflection</p>
          </div>
        </div>
      </div>

      {/* Did You Send It? */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">Did you send the message?</h3>

        <div className="grid grid-cols-2 gap-4">
          <button className="p-6 rounded-xl border-2 border-green-500/50 bg-green-900/30 hover:bg-green-900/40 transition-all">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-white">Yes, I sent it!</div>
            <div className="text-xs text-green-300 mt-1">Track the outcome</div>
          </button>
          <button className="p-6 rounded-xl border-2 border-orange-500/50 bg-orange-900/30 hover:bg-orange-900/40 transition-all">
            <div className="text-3xl mb-2">⏸️</div>
            <div className="font-bold text-white">Not yet</div>
            <div className="text-xs text-orange-300 mt-1">Come back when ready</div>
          </button>
        </div>
      </div>

      {/* Outcome Tracking */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">What happened?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-5 rounded-xl border-2 border-green-500/50 bg-green-900/30 hover:bg-green-900/40 transition-all text-center">
            <div className="text-4xl mb-2">😊</div>
            <div className="font-bold text-white mb-1">Positive Response</div>
            <div className="text-xs text-green-300">They responded well!</div>
          </button>
          <button className="p-5 rounded-xl border-2 border-yellow-500/50 bg-yellow-900/30 hover:bg-yellow-900/40 transition-all text-center">
            <div className="text-4xl mb-2">😐</div>
            <div className="font-bold text-white mb-1">Neutral/No Response</div>
            <div className="text-xs text-yellow-300">Waiting or lukewarm</div>
          </button>
          <button className="p-5 rounded-xl border-2 border-red-500/50 bg-red-900/30 hover:bg-red-900/40 transition-all text-center">
            <div className="text-4xl mb-2">😔</div>
            <div className="font-bold text-white mb-1">Negative Response</div>
            <div className="text-xs text-red-300">Didn't go as hoped</div>
          </button>
        </div>
      </div>

      {/* Reflection */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Reflection Questions
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              What did you learn from this experience?
            </label>
            <textarea
              placeholder="Even if it didn't go perfectly, what insights did you gain?"
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              What would you do differently next time?
            </label>
            <textarea
              placeholder="Be specific about what you'd adjust..."
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* XP & Achievements */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          You Earned XP!
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 text-center">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-sm font-bold text-white">+50 XP</div>
            <div className="text-xs text-purple-400">Took Action</div>
          </div>
          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 text-center">
            <div className="text-3xl mb-1">💪</div>
            <div className="text-sm font-bold text-white">+25 XP</div>
            <div className="text-xs text-purple-400">Courage Bonus</div>
          </div>
          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 text-center">
            <div className="text-3xl mb-1">🧠</div>
            <div className="text-sm font-bold text-white">+15 XP</div>
            <div className="text-xs text-purple-400">Learned Framework</div>
          </div>
          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 text-center">
            <div className="text-3xl mb-1">📝</div>
            <div className="text-sm font-bold text-white">+10 XP</div>
            <div className="text-xs text-purple-400">Tracked Outcome</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl text-center">
          <div className="font-bold text-yellow-300 mb-1">🏆 Total: +100 XP</div>
          <div className="text-xs text-purple-300">You're leveling up your social recovery skills!</div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: PHASE 7 - INTEGRATION
  // ============================================================================
  const renderPhase7 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Integration & Mastery</h2>
            <p className="text-sm text-purple-300">You now have a framework for life</p>
          </div>
        </div>
      </div>

      {/* Meta-Learning */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-pink-400" />
          Meta-Learning Insights
        </h3>

        <div className="space-y-4">
          <div className="p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="font-bold text-purple-100 mb-2">🎯 The Pattern You Just Learned:</div>
            <ol className="space-y-2 text-sm text-purple-200">
              <li>1. <strong>Diagnose</strong> the situation accurately</li>
              <li>2. <strong>Learn</strong> the framework/methods</li>
              <li>3. <strong>Personalize</strong> to your specific context</li>
              <li>4. <strong>Build confidence</strong> before acting</li>
              <li>5. <strong>Execute</strong> with commitment</li>
              <li>6. <strong>Track & reflect</strong> on outcomes</li>
              <li>7. <strong>Integrate</strong> the learning</li>
            </ol>
          </div>

          <div className="p-5 bg-blue-900/30 rounded-xl border border-blue-700/30">
            <div className="font-bold text-blue-200 mb-2">💡 This Framework Works For:</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-100">
              <div>• Social recoveries</div>
              <div>• Difficult conversations</div>
              <div>• Apologies</div>
              <div>• Boundary setting</div>
              <div>• Conflict resolution</div>
              <div>• Reconnections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            Quick Reference Card
          </h3>
          <button
            onClick={() => setShowQuickRef(!showQuickRef)}
            className="px-4 py-2 bg-purple-600/50 border border-purple-400 rounded-lg hover:bg-purple-600/60 transition-all flex items-center gap-2"
          >
            {showQuickRef ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{showQuickRef ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {showQuickRef && (
          <div className="space-y-3 animate-slide-up">
            <div className="p-4 bg-purple-950/30 rounded-xl">
              <div className="font-bold text-purple-200 mb-2">🌅 Fresh Start (long gap/reset)</div>
              <div className="text-sm text-purple-300">Accept the past → Express interest in NOW → Low-stakes proposal</div>
            </div>
          </div>
        )}

        <button
          onClick={downloadPlan}
          className="w-full mt-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Download className="w-5 h-5" />
          Download Quick Reference
        </button>
      </div>

      {/* Future Scenarios */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" />
          Prepare for Future Scenarios
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="font-bold text-white mb-2">If they respond positively:</div>
            <ul className="space-y-1 text-sm text-purple-200">
              <li>• Acknowledge their grace in responding</li>
              <li>• Don't over-apologize or rehash</li>
              <li>• Move forward naturally</li>
              <li>• Be consistent going forward</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="font-bold text-white mb-2">If they don't respond:</div>
            <ul className="space-y-1 text-sm text-purple-200">
              <li>• Wait 5-7 days minimum before following up</li>
              <li>• One follow-up max, then let it go</li>
              <li>• Remember: You did your part</li>
              <li>• Their response is about them, not you</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="font-bold text-white mb-2">If they respond negatively:</div>
            <ul className="space-y-1 text-sm text-purple-200">
              <li>• Accept their boundary with grace</li>
              <li>• Thank them for their honesty</li>
              <li>• Don't argue or justify</li>
              <li>• Learn and move forward</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Your Growth */}
      <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-green-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Your Growth Stats
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-purple-950/30 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">+{confidenceAfter - confidenceBefore}</div>
            <div className="text-xs text-purple-300">Confidence Gained</div>
          </div>
          <div className="p-4 bg-purple-950/30 rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">5</div>
            <div className="text-xs text-purple-300">Methods Learned</div>
          </div>
          <div className="p-4 bg-purple-950/30 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">1</div>
            <div className="text-xs text-purple-300">Recovery Executed</div>
          </div>
          <div className="p-4 bg-purple-950/30 rounded-xl text-center">
            <div className="text-3xl font-bold text-pink-400 mb-1">100</div>
            <div className="text-xs text-purple-300">XP Earned</div>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-green-300 text-lg">Achievement Unlocked!</span>
          </div>
          <div className="text-purple-100 text-sm mb-2">
            <strong>"The Reconnector"</strong> - Completed your first full recovery journey
          </div>
          <div className="text-purple-300 text-xs">
            You now have a repeatable framework for handling social setbacks. This is a life skill.
          </div>
        </div>
      </div>

      {/* Final Wisdom */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Final Wisdom
        </h3>

        <div className="space-y-4">
          <div className="p-5 bg-purple-950/30 rounded-xl border border-purple-700/30">
            <div className="text-purple-100 mb-3">
              "The quality of your relationships isn't determined by never making mistakes—it's determined by how you handle them when you do."
            </div>
            <div className="text-sm text-purple-400 italic">
              Remember this every time you face a setback.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-purple-950/30 rounded-xl text-center">
              <div className="text-3xl mb-2">💪</div>
              <div className="text-sm font-bold text-white mb-1">Courage</div>
              <div className="text-xs text-purple-400">You showed up</div>
            </div>
            <div className="p-4 bg-purple-950/30 rounded-xl text-center">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-sm font-bold text-white mb-1">Wisdom</div>
              <div className="text-xs text-purple-400">You learned</div>
            </div>
            <div className="p-4 bg-purple-950/30 rounded-xl text-center">
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-sm font-bold text-white mb-1">Growth</div>
              <div className="text-xs text-purple-400">You evolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-100 mb-4">What's Next?</h3>

        <div className="space-y-3">
          <button className="w-full p-5 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-500 hover:to-blue-500 transition-all text-left">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <div className="flex-1">
                <div className="font-bold text-white mb-1">Start Another Recovery</div>
                <div className="text-sm text-green-100">Have another situation to handle?</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>

          <button className="w-full p-5 bg-purple-950/30 border-2 border-purple-700/30 rounded-xl hover:border-purple-600/50 transition-all text-left">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <div className="flex-1">
                <div className="font-bold text-white mb-1">Review Your Progress</div>
                <div className="text-sm text-purple-300">See all your past recoveries</div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400" />
            </div>
          </button>

          <button className="w-full p-5 bg-purple-950/30 border-2 border-purple-700/30 rounded-xl hover:border-purple-600/50 transition-all text-left">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              <div className="flex-1">
                <div className="font-bold text-white mb-1">Join the Community</div>
                <div className="text-sm text-purple-300">Share wins & learn from others</div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Completion Badge */}
      <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-yellow-500/30 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <div className="text-2xl font-bold text-yellow-300 mb-2">
          Journey Complete!
        </div>
        <div className="text-purple-200 mb-4">
          You've mastered the art of reconnection recovery.
        </div>
        <div className="text-sm text-purple-400">
          Badge earned: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: NAVIGATION
  // ============================================================================
  const renderNavigation = () => (
    <div className="flex items-center justify-between gap-4 mt-8">
      <button
        onClick={handlePrevPhase}
        disabled={currentPhase === 1}
        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
          currentPhase === 1
            ? 'bg-purple-950/30 text-purple-600 cursor-not-allowed'
            : 'bg-purple-700/50 hover:bg-purple-700/70 text-white border-2 border-purple-500/50'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {currentPhase < 7 ? (
        <button
          onClick={handleNextPhase}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all flex items-center gap-2 text-white"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={handleFinish}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 rounded-xl font-bold transition-all flex items-center gap-2 text-white"
        >
          Finish
          <CheckCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-purple-950/50 backdrop-blur-md px-6 py-3 rounded-full border-2 border-purple-500/30 mb-4">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Reconnection Recovery System
            </span>
          </div>
          <p className="text-purple-300 text-sm">
            Your complete framework for recovering from social setbacks
          </p>
        </div>

        {/* Phase Indicator */}
        {renderPhaseIndicator()}

        {/* Validation Alert */}
        {showValidation && (
          <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-500/50 rounded-xl animate-slide-up">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">Please complete all required fields before continuing.</span>
            </div>
          </div>
        )}

        {/* Phase Content */}
        <div className="mb-8">
          {currentPhase === 1 && renderPhase1()}
          {currentPhase === 2 && renderPhase2()}
          {currentPhase === 3 && renderPhase3()}
          {currentPhase === 4 && renderPhase4()}
          {currentPhase === 5 && renderPhase5()}
          {currentPhase === 6 && renderPhase6()}
          {currentPhase === 7 && renderPhase7()}
        </div>

        {/* Navigation */}
        {renderNavigation()}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-purple-400">
          <p>💜 Built with care for better connections</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APP WRAPPER
// ============================================================================

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(true);

  return (
    <div>
      {showApp ? (
        <ReconnectionRecovery onNext={() => setShowApp(false)} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-bold mb-4">Journey Complete!</h2>
            <p className="text-purple-300 mb-6">You're ready to reconnect with confidence.</p>
            <button
              onClick={() => setShowApp(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold"
            >
              Start New Recovery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReconnectionRecovery;