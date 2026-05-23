import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Sparkles, ChevronRight, ChevronLeft, Brain, Target, TrendingUp, CheckCircle, Lightbulb, Calendar, MapPin, Clipboard, Star, Zap, ArrowRight, Download, Move } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Message {
  role: 'ai' | 'user';
  content: string;
}

interface Mistake {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  examples: string[];
  signs: string[];
  impactScore: number;
  fixStrategies: string[];
  practiceChallenge: string;
  estimatedImprovement: number;
  masteryTimeline: string;
}

interface ActionPlan {
  mistakeId: number;
  what: string;
  when: string;
  where: string;
  how: string[];
  measure: string[];
}

interface MindMapNode {
  id: number;
  title: string;
  x: number;
  y: number;
  severity: 'high' | 'medium' | 'low';
  fixed: boolean;
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const MISTAKES: Mistake[] = [
  {
    id: 1,
    title: "Monologuing (Talking Too Much About Yourself)",
    shortTitle: "Monologuing",
    description: "Dominating conversations by talking excessively about yourself without giving others space to share. This makes conversations feel one-sided and can push people away.",
    examples: [
      "Sharing a 10-minute story about your day without pausing",
      "Responding to someone's story with 'That reminds me of when I...' and launching into your own tale",
      "Answering 'How are you?' with a lengthy monologue"
    ],
    signs: [
      "People's eyes glaze over or they check their phone",
      "You rarely get asked follow-up questions",
      "Conversations feel exhausting for others",
      "You do 80%+ of the talking"
    ],
    impactScore: 8,
    fixStrategies: [
      "Use the 70/30 rule: Listen 70%, talk 30%",
      "After sharing, ask 'What about you?'",
      "Set a 2-minute timer for your stories",
      "Count questions asked vs statements made"
    ],
    practiceChallenge: "In your next 3 conversations, aim to ask 5 questions before sharing your own story",
    estimatedImprovement: 1.5,
    masteryTimeline: "2-3 weeks with daily practice"
  },
  {
    id: 2,
    title: "Not Asking Follow-Up Questions",
    shortTitle: "No Follow-Ups",
    description: "When someone shares something, you acknowledge it briefly ('cool', 'nice') but don't dig deeper. This makes conversations feel shallow and shows you're not truly engaged.",
    examples: [
      "Them: 'I just got back from Japan!' You: 'Cool.' [changes topic]",
      "Them: 'I've been really stressed lately.' You: 'That sucks.' [silence]",
      "Missing chances to ask 'How?', 'Why?', 'What was that like?'"
    ],
    signs: [
      "Conversations never go deep",
      "People share less with you over time",
      "Topics change rapidly without exploration",
      "You feel like you don't really know people"
    ],
    impactScore: 9,
    fixStrategies: [
      "Use the 5W1H method: Who, What, When, Where, Why, How",
      "Practice 'Tell me more about...'",
      "Show genuine curiosity: 'That's interesting, what made you...'",
      "Before changing topics, ask at least 2 follow-ups"
    ],
    practiceChallenge: "For each statement someone makes, ask at least ONE follow-up question before responding with your own story",
    estimatedImprovement: 2.0,
    masteryTimeline: "3-4 weeks with consistent practice"
  },
  {
    id: 3,
    title: "Awkward Silence Panic",
    shortTitle: "Silence Panic",
    description: "Feeling intense discomfort during natural pauses in conversation, leading to desperate topic changes, nervous rambling, or freezing up completely.",
    examples: [
      "Blurting out random facts when there's a 3-second pause",
      "Saying 'So...' repeatedly while scrambling for topics",
      "Feeling your heart race during brief silences",
      "Filling every pause with 'um', 'yeah', or nervous laughter"
    ],
    signs: [
      "You feel anxious during any pause",
      "You prepare your next sentence while others are talking",
      "Conversations feel exhausting and forced",
      "You say things you regret in panic moments"
    ],
    impactScore: 7,
    fixStrategies: [
      "Reframe: Silence = reflection time, not failure",
      "Practice 3-second pause before responding",
      "Have 3 go-to transition topics ready",
      "Use silence for active listening signals (nodding, eye contact)"
    ],
    practiceChallenge: "Intentionally create 3-second pauses in your next conversation. Notice how it feels and how others react.",
    estimatedImprovement: 1.2,
    masteryTimeline: "4-6 weeks of gradual exposure"
  },
  {
    id: 4,
    title: "Poor Eye Contact",
    shortTitle: "Eye Contact",
    description: "Either avoiding eye contact entirely, staring intensely without breaks, or constantly looking away. This signals disinterest, anxiety, or dishonesty even when unintended.",
    examples: [
      "Looking at your phone while someone is talking",
      "Staring at their forehead or over their shoulder",
      "Never breaking eye contact (too intense)",
      "Eyes darting around the room nervously"
    ],
    signs: [
      "People ask if you're listening or interested",
      "Conversations feel disconnected",
      "You feel anxious about where to look",
      "Others seem uncomfortable during talks"
    ],
    impactScore: 8,
    fixStrategies: [
      "Use 50/70 rule: 50% eye contact when speaking, 70% when listening",
      "Look at the triangle: eyes and nose area",
      "Break eye contact naturally by looking down/away briefly",
      "Practice with video calls first (less intense)"
    ],
    practiceChallenge: "During your next conversation, maintain eye contact for 3-4 seconds, look away briefly, then return. Repeat this pattern.",
    estimatedImprovement: 1.8,
    masteryTimeline: "2-3 weeks with daily awareness"
  },
  {
    id: 5,
    title: "Not Reading Social Cues",
    shortTitle: "Missing Cues",
    description: "Failing to notice when someone is bored, uncomfortable, wants to leave, or has lost interest. You overstay your welcome or push conversations past their natural end.",
    examples: [
      "Continuing to talk when someone is checking their watch",
      "Missing 'I should get going' hints",
      "Not noticing short, disengaged responses",
      "Ignoring crossed arms, stepping back, or looking away"
    ],
    signs: [
      "People make excuses to leave",
      "You often feel surprised when conversations end abruptly",
      "Others seem relieved when talks conclude",
      "You're told you 'talked their ear off'"
    ],
    impactScore: 7,
    fixStrategies: [
      "Watch for energy drops: short answers, less enthusiasm",
      "Check time signals: watch checking, phone looking",
      "Ask directly: 'Do you have time to chat?'",
      "Set mental time limits: 5-10 min for casual chats"
    ],
    practiceChallenge: "In your next 3 conversations, intentionally look for 2 disengagement signals and wrap up within 1 minute of noticing them.",
    estimatedImprovement: 1.3,
    masteryTimeline: "3-4 weeks of active observation"
  },
  {
    id: 6,
    title: "Interrupting / Not Listening Actively",
    shortTitle: "Interrupting",
    description: "Cutting people off mid-sentence, waiting for your turn to talk instead of truly listening, or thinking about your response while they're still speaking.",
    examples: [
      "Finishing someone's sentences for them",
      "Starting to talk before they're done",
      "Saying 'Yeah, yeah' impatiently",
      "Planning your response instead of absorbing their words"
    ],
    signs: [
      "People say 'Can I finish?' or stop mid-sentence",
      "You miss key details in conversations",
      "Others seem frustrated after talking with you",
      "You can't remember what was just said"
    ],
    impactScore: 9,
    fixStrategies: [
      "Use the 3-second rule: Wait 3 seconds after they finish",
      "Practice reflection: 'So what I'm hearing is...'",
      "Focus on their words, not your response",
      "Nod and use 'mm-hmm' to show listening without interrupting"
    ],
    practiceChallenge: "In your next conversation, wait 3 full seconds after someone finishes speaking before you respond. Count in your head.",
    estimatedImprovement: 2.2,
    masteryTimeline: "2-3 weeks with mindful practice"
  }
];

const AI_PROMPTS: { [key: number]: string[] } = {
  1: [
    "Tell me about a recent conversation where you felt like you talked a lot. What percentage of the time do you think you were speaking?",
    "When someone shares something with you, what's your first instinct - to relate it to your own experience or ask them more about theirs?",
    "Do people often check their phones or seem distracted when you're talking? How does that make you feel?"
  ],
  2: [
    "Think of the last conversation you had. How many follow-up questions did you ask?",
    "When someone says 'I had a rough day,' what do you typically say next?",
    "Do your conversations tend to jump from topic to topic, or do you explore subjects deeply?"
  ],
  3: [
    "How do you feel when there's a pause in conversation? Rate your anxiety from 1-10.",
    "What goes through your mind during those quiet moments?",
    "Have you ever said something you regretted just to fill silence?"
  ],
  4: [
    "Where do you typically look when someone is talking to you?",
    "Do you feel anxious about eye contact? What specifically makes you uncomfortable?",
    "Have people ever commented on your eye contact - too much or too little?"
  ],
  5: [
    "Tell me about a time a conversation ended abruptly. Looking back, what signs did you miss?",
    "How do you usually know when someone wants to end a conversation?",
    "Do you often feel surprised when people have to leave?"
  ],
  6: [
    "Do you find yourself planning what to say while others are talking?",
    "How often do people have to ask you to let them finish?",
    "After a conversation, can you usually recall the details of what the other person said?"
  ]
};

const AI_RESPONSES: { [key: number]: { [key: string]: string } } = {
  1: {
    high: "It sounds like you might be dominating conversations. That's really common! The good news is you're aware of it. Let's work on the 70/30 rule together.",
    medium: "You seem to have some balance, but there's room for improvement. Let's focus on making conversations more reciprocal.",
    low: "Great awareness! You seem to understand the importance of balance. Let's fine-tune your skills even more."
  },
  2: {
    high: "I notice you might be missing opportunities to deepen connections. Follow-up questions are powerful - let's practice together!",
    medium: "You're asking some questions, but we can make your conversations much richer. Ready to level up?",
    low: "Nice! You understand the value of curiosity. Let's refine your question-asking technique."
  },
  3: {
    high: "That silence anxiety is totally normal! Many people feel this way. The key is reframing silence as natural, not awkward.",
    medium: "You have some discomfort with pauses. Let's practice getting comfortable with brief silences.",
    low: "You seem relatively comfortable with silence - that's great! Let's make sure you can handle any length of pause."
  },
  4: {
    high: "Eye contact can feel really vulnerable. You're not alone in struggling with this. Let's break it down into manageable steps.",
    medium: "You're somewhat aware of eye contact, but let's make it feel more natural and confident.",
    low: "Good eye contact awareness! Let's optimize the timing and intensity for maximum connection."
  },
  5: {
    high: "Reading social cues is a learnable skill! Once you know what to look for, it becomes second nature.",
    medium: "You're catching some signals but missing others. Let's sharpen your observation skills.",
    low: "Nice social awareness! Let's make sure you're catching even the subtle cues."
  },
  6: {
    high: "Interrupting is often unconscious - awareness is the first step! Let's build your active listening muscles.",
    medium: "You're somewhat aware when you interrupt. Let's make listening your default mode.",
    low: "Great listening foundation! Let's refine your technique to make others feel truly heard."
  }
};

interface REVIEWCONVProps {
    onNext?: () => void;
}
// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PATTERNSMISTAKES({ onNext }: REVIEWCONVProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ [key: number]: Message[] }>({});
  const [showChat, setShowChat] = useState(false);

  const [userInput, setUserInput] = useState('');
  const [assessmentComplete, setAssessmentComplete] = useState<{ [key: number]: boolean }>({});
  const [userLevel, setUserLevel] = useState<{ [key: number]: 'high' | 'medium' | 'low' }>({});
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([]);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mindMapRef = useRef<HTMLDivElement>(null);

  const currentMistake = MISTAKES[currentPage];

  // Initialize chat for current mistake
  useEffect(() => {
    if (!chatMessages[currentMistake.id]) {
      setChatMessages(prev => ({
        ...prev,
        [currentMistake.id]: [{
          role: 'ai',
          content: `Hi! I'm here to help you understand if you struggle with "${currentMistake.shortTitle}". Let's have an honest conversation. ${AI_PROMPTS[currentMistake.id][0]}`
        }]
      }));
    }
  }, [currentMistake.id]);

  // Initialize mind map nodes
  useEffect(() => {
    if (mindMapNodes.length === 0) {
      const nodes: MindMapNode[] = MISTAKES.map((mistake, idx) => ({
        id: mistake.id,
        title: mistake.shortTitle,
        x: 150 + (idx % 3) * 250,
        y: 100 + Math.floor(idx / 3) * 200,
        severity: mistake.impactScore >= 8 ? 'high' : mistake.impactScore >= 6 ? 'medium' : 'low',
        fixed: false
      }));
      setMindMapNodes(nodes);
    }
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...(chatMessages[currentMistake.id] || []),
      { role: 'user' as const, content: userInput }
    ];

    // Simple AI response logic
    const messageCount = newMessages.filter(m => m.role === 'user').length;
    let aiResponse = '';

    if (messageCount === 1) {
      aiResponse = AI_PROMPTS[currentMistake.id][1] || "Tell me more about that...";
    } else if (messageCount === 2) {
      aiResponse = AI_PROMPTS[currentMistake.id][2] || "I see. One more question...";
    } else if (messageCount === 3) {
      // Determine user level based on responses
      const level = determineLevel(userInput);
      setUserLevel(prev => ({ ...prev, [currentMistake.id]: level }));
      setAssessmentComplete(prev => ({ ...prev, [currentMistake.id]: true }));
      aiResponse = AI_RESPONSES[currentMistake.id][level];
    } else {
      aiResponse = "That's really insightful. Would you like to see your personalized action plan?";
    }

    newMessages.push({ role: 'ai', content: aiResponse });
    setChatMessages(prev => ({ ...prev, [currentMistake.id]: newMessages }));
    setUserInput('');
  };

  const determineLevel = (input: string): 'high' | 'medium' | 'low' => {
    const lowIndicators = ['sometimes', 'occasionally', 'aware', 'working on', 'trying'];
    const highIndicators = ['always', 'never', 'can\'t', 'struggle', 'anxious', 'worried'];
    
    const lowerInput = input.toLowerCase();
    const hasLow = lowIndicators.some(word => lowerInput.includes(word));
    const hasHigh = highIndicators.some(word => lowerInput.includes(word));
    
    if (hasHigh) return 'high';
    if (hasLow) return 'low';
    return 'medium';
  };

  const generateActionPlan = () => {
    const plan: ActionPlan = {
      mistakeId: currentMistake.id,
      what: `Reduce ${currentMistake.shortTitle} by implementing proven techniques`,
      when: 'Daily practice for the next 21 days (habit formation period)',
      where: 'Start with low-stakes environments: casual chats with friends, family dinners, coffee shop small talk',
      how: currentMistake.fixStrategies,
      measure: [
        'Track conversations in a journal daily',
        `Aim for ${currentMistake.estimatedImprovement}+ star improvement in quality`,
        'Ask a trusted friend for feedback weekly',
        'Self-rate improvement on 1-10 scale'
      ]
    };

    setActionPlans(prev => {
      const existing = prev.find(p => p.mistakeId === currentMistake.id);
      if (existing) return prev;
      return [...prev, plan];
    });
    setShowActionPlan(true);
  };

  const handleNodeDragStart = (nodeId: number) => {
    setDraggingNode(nodeId);
  };

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (draggingNode === null || !mindMapRef.current) return;
    
    const rect = mindMapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMindMapNodes(prev => prev.map(node => 
      node.id === draggingNode ? { ...node, x, y } : node
    ));
  };

  const handleNodeDragEnd = () => {
    setDraggingNode(null);
  };

  const toggleNodeFixed = (nodeId: number) => {
    setMindMapNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, fixed: !node.fixed } : node
    ));
  };

  const exportMindMap = () => {
    // Simple export - in production, use html2canvas or similar
    const data = JSON.stringify(mindMapNodes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation-mistakes-mindmap.json';
    a.click();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (showMindMap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
                Mistake Mind Map
              </h1>
              <p className="text-purple-200">Visualize connections between your conversation challenges</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportMindMap}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={() => setShowMindMap(false)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-all"
              >
                Back to Lessons
              </button>
            </div>
          </div>

          <div
            ref={mindMapRef}
            className="relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 p-8"
            style={{ height: '600px' }}
            onMouseMove={handleNodeDrag}
            onMouseUp={handleNodeDragEnd}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
              {mindMapNodes.map((node, idx) => {
                if (idx === 0) return null;
                const prevNode = mindMapNodes[idx - 1];
                return (
                  <line
                    key={`line-${node.id}`}
                    x1={prevNode.x + 60}
                    y1={prevNode.y + 40}
                    x2={node.x + 60}
                    y2={node.y + 40}
                    stroke="rgba(167, 139, 250, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {mindMapNodes.map(node => (
              <div
                key={node.id}
                className={`absolute cursor-move transition-all ${
                  node.fixed ? 'ring-4 ring-green-400' : ''
                } ${
                  node.severity === 'high'
                    ? 'bg-red-900/60 border-red-500/50'
                    : node.severity === 'medium'
                    ? 'bg-orange-900/60 border-orange-500/50'
                    : 'bg-green-900/60 border-green-500/50'
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: '120px',
                  height: '80px'
                }}
                onMouseDown={() => handleNodeDragStart(node.id)}
                onClick={() => toggleNodeFixed(node.id)}
              >
                <div className="p-3 rounded-2xl border-2 backdrop-blur-sm h-full flex flex-col items-center justify-center text-center">
                  <Move className="w-4 h-4 mb-1 text-purple-300" />
                  <p className="text-xs font-bold text-white">{node.title}</p>
                  {node.fixed && (
                    <CheckCircle className="w-4 h-4 mt-1 text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl border-2 border-purple-500/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-purple-100 mb-2">How to use:</h3>
                <ul className="text-sm text-purple-300 space-y-1">
                  <li>• <strong>Drag nodes</strong> to reorganize by priority</li>
                  <li>• <strong>Click nodes</strong> to mark as "fixed" (green ring)</li>
                  <li>• <strong>Red = High impact</strong>, Orange = Medium, Green = Low severity</li>
                  <li>• <strong>Export</strong> to save your personalized map</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = actionPlans.find(p => p.mistakeId === currentMistake.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">AI Conversation Coach</span>
          </div>
          
          <div class="text-center mx-auto max-w-2xl">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
        Master Your Conversation Skills
    </h1>
    <p className="text-base md:text-lg text-purple-200">
        Identify and fix the 6 most common conversation mistakes with AI guidance
    </p>
</div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-purple-300">
              Mistake {currentPage + 1} of {MISTAKES.length}
            </span>
            <button
              onClick={() => setShowMindMap(true)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              <Brain className="w-4 h-4" />
              View Mind Map
            </button>
          </div>
          <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${((currentPage + 1) / MISTAKES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* MAIN CONTENT CARD */}
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-6 md:p-8 mb-6">
          
          {/* MISTAKE HEADER */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
              <span className="text-2xl md:text-3xl font-bold text-white">{currentPage + 1}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentMistake.title}</h2>
              <p className="text-purple-200 text-sm md:text-base">{currentMistake.description}</p>
            </div>
          </div>

          {/* WHAT IS IT */}
          <div className="mb-6 p-5 bg-purple-950/40 rounded-2xl border border-purple-700/30">
            <h3 className="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Examples of This Mistake
            </h3>
            <ul className="space-y-2">
              {currentMistake.examples.map((example, idx) => (
                <li key={idx} className="text-sm text-purple-200 flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SIGNS YOU'RE DOING THIS */}
          <div className="mb-6 p-5 bg-orange-950/40 rounded-2xl border border-orange-700/30">
            <h3 className="text-lg font-bold text-orange-100 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Signs You're Making This Mistake
            </h3>
            <ul className="space-y-2">
              {currentMistake.signs.map((sign, idx) => (
                <li key={idx} className="text-sm text-orange-200 flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IMPACT PREDICTION */}
          <div className="mb-6 p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border border-green-700/30">
            <h3 className="text-lg font-bold text-green-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Impact Prediction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-950/40 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs text-green-300 font-medium">Quality Improvement</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">+{currentMistake.estimatedImprovement}</p>
                <p className="text-xs text-green-300">stars in conversation quality</p>
              </div>
              <div className="p-4 bg-green-950/40 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-green-300 font-medium">Mastery Timeline</span>
                </div>
                <p className="text-xl font-bold text-white mb-1">{currentMistake.masteryTimeline}</p>
                <p className="text-xs text-green-300">with consistent practice</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-950/30 rounded-lg">
              <p className="text-sm text-green-200">
                <strong>ROI Calculation:</strong> Fixing this mistake will improve your average conversation quality by <strong>{currentMistake.estimatedImprovement} stars</strong>. 
                With an impact score of <strong>{currentMistake.impactScore}/10</strong>, this is {currentMistake.impactScore >= 8 ? 'HIGH' : currentMistake.impactScore >= 6 ? 'MEDIUM' : 'LOW'} priority.
              </p>
            </div>
          </div>

          {/* AI CHAT INTERFACE (Popup Version) */}
<div className="mb-6">
  <button
    onClick={() => setShowChat(true)}
    className="w-full px-6 py-4 bg-gradient-to-r from-purple-700 to-pink-600 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 hover:from-purple-600 hover:to-pink-500 transition-all"
  >
    <Brain className="w-6 h-6 text-purple-200" />
    Chat with Your AI Coach
  </button>

  {showChat && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-indigo-900/70 to-purple-900/70 rounded-3xl border-2 border-indigo-500/30 p-5 md:p-6 w-[90%] max-w-lg relative">
        <button
          onClick={() => setShowChat(false)}
          className="absolute top-3 right-3 text-purple-300 hover:text-white"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-purple-100 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Chat with Your AI Coach
        </h3>

        {/* Chat Messages */}
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {(chatMessages[currentMistake.id] || []).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-purple-600/40 border border-purple-400/30'
                      : 'bg-indigo-800/40 border border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-purple-200">
                      {msg.role === 'user' ? 'You' : 'AI Coach'}
                    </span>
                  </div>
                  <p className="text-sm text-white">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {!assessmentComplete[currentMistake.id] ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim()}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-green-900/30 rounded-xl border border-green-500/30">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-green-200 font-medium">
              Assessment Complete! Ready to see your action plan?
            </p>
            <button
              onClick={generateActionPlan}
              className="mt-3 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-sm hover:from-green-500 hover:to-emerald-500 transition-all"
            >
              Generate Action Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</div>


          {/* HOW TO FIX IT */}
          <div className="mb-6 p-5 bg-blue-950/40 rounded-2xl border border-blue-700/30">
            <h3 className="text-lg font-bold text-blue-100 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              How to Fix This Mistake
            </h3>
            <ul className="space-y-2">
              {currentMistake.fixStrategies.map((strategy, idx) => (
                <li key={idx} className="text-sm text-blue-200 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PRACTICE CHALLENGE */}
          <div className="p-5 bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-2xl border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-400" />
              Your Practice Challenge
            </h3>
            <p className="text-sm text-purple-200 mb-4">{currentMistake.practiceChallenge}</p>
            <div className="flex items-center gap-2 text-xs text-purple-300">
              <Calendar className="w-4 h-4" />
              <span>Complete this challenge over the next 7 days</span>
            </div>
          </div>
        </div>

        {/* ACTION PLAN MODAL */}
        {showActionPlan && currentPlan && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl border-2 border-purple-500/30 p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Clipboard className="w-8 h-8 text-purple-400" />
                  Your Action Plan
                </h2>
                <button
                  onClick={() => setShowActionPlan(false)}
                  className="text-purple-400 hover:text-purple-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* WHAT */}
                <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
                  <h3 className="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    What: Goal
                  </h3>
                  <p className="text-purple-200">{currentPlan.what}</p>
                </div>

                {/* WHEN */}
                <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
                  <h3 className="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    When: Schedule
                  </h3>
                  <p className="text-purple-200">{currentPlan.when}</p>
                </div>

                {/* WHERE */}
                <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
                  <h3 className="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    Where: Practice Environments
                  </h3>
                  <p className="text-purple-200">{currentPlan.where}</p>
                </div>

                {/* HOW */}
                <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
                  <h3 className="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    How: Techniques
                  </h3>
                  <ul className="space-y-2">
                    {currentPlan.how.map((technique, idx) => (
                      <li key={idx} className="text-purple-200 flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                        <span>{technique}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* MEASURE */}
                <div className="p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border border-green-700/30">
                  <h3 className="text-lg font-bold text-green-100 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Measure: Success Metrics
                  </h3>
                  <ul className="space-y-2">
                    {currentPlan.measure.map((metric, idx) => (
                      <li key={idx} className="text-green-200 flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowActionPlan(false)}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Got It! Let's Practice
              </button>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
<div className="flex items-center justify-between gap-4">
  <button
    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
    disabled={currentPage === 0}
    className="p-2.5 bg-purple-800/40 hover:bg-purple-700/40 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="Previous"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>

  <div className="flex gap-2">
    {MISTAKES.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentPage(idx)}
        className={`w-3 h-3 rounded-full transition-all ${
          idx === currentPage
            ? 'bg-purple-400 w-8'
            : 'bg-purple-700/50 hover:bg-purple-600/50'
        }`}
        aria-label={`Go to page ${idx + 1}`}
      />
    ))}
  </div>

  <button
    onClick={() => setCurrentPage(Math.min(MISTAKES.length - 1, currentPage + 1))}
    disabled={currentPage === MISTAKES.length - 1}
    className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="Next"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
</div>

        {/* FOOTER SUMMARY */}
<div className="mt-8 p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-3xl border-2 border-purple-500/20">
  <div className="flex items-start gap-4">
    <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
    <div className="flex-1">
      <h3 className="font-bold text-purple-100 text-lg mb-2">Your Progress</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-purple-300">
        <div>
          <span className="font-bold text-white">{Object.keys(assessmentComplete).length}</span> / {MISTAKES.length} assessed
        </div>
        <div>
          <span className="font-bold text-white">{actionPlans.length}</span> action plans created
        </div>
        <div>
          <span className="font-bold text-white">{mindMapNodes.filter(n => n.fixed).length}</span> mistakes conquered
        </div>
      </div> {/* closes grid */}
    </div> {/* closes flex-1 div */}
  </div> {/* closes flex items-start gap-4 */}
</div> {/* closes FOOTER SUMMARY */}

{/* CONTINUE BUTTON */}
{onNext && (
  <div className="mt-6">
    <button
      onClick={onNext}
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-white"
    >
      Continue to Next Prep Step
      <Target className="w-6 h-6" />
    </button>
  </div> 
)}
</div> {/* closes the parent container (the one you originally had at the end) */}

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

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(124, 58, 237, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.7);
        }
      `}</style>
    </div>
  );
}