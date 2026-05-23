import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Brain, Zap, Heart, AlertCircle, CheckCircle2,
  ArrowRight, ArrowLeft, Trophy, Lightbulb, RefreshCcw,
  Flame, Eye, Timer, Repeat, ChevronRight, Quote,
  RotateCcw, TrendingUp, MessageSquare, Lock, Unlock,
  Volume2, Target, Activity, Layers, XCircle, SkipForward,
  BookOpen, Compass, Search, X, Check, Battery, BatteryLow,
  UserX, Users, Slash, Hand, Wind, Cpu, Sparkles, Radio,
  BarChart2, Sun, Moon, Minus, Plus, AlertTriangle
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEME = {
  background: "bg-gradient-to-br from-slate-900 via-amber-900/15 to-slate-950",
  card: "bg-slate-800/40 backdrop-blur-md border border-amber-500/20 rounded-2xl",
  accent: "text-amber-400",
  gradient: "from-amber-500 to-orange-600"
};

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-amber-900/50 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 px-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-amber-400" />
        <span className="font-bold text-slate-200 hidden sm:block uppercase tracking-widest text-xs">Setting Emotional Boundaries</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-md">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">STAGE {current}/{total}</span>
    </div>
  </div>
);

const Card = ({ children, className = "", onClick }) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01 } : {}}
    onClick={onClick}
    className={`${THEME.card} p-6 sm:p-8 ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </motion.div>
);

const Tip = ({ children }) => (
  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3 items-start">
    <Lightbulb className="text-amber-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-slate-400 leading-relaxed italic">{children}</div>
  </div>
);

const Warning = ({ children }) => (
  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 items-start">
    <AlertCircle className="text-red-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-red-200 leading-relaxed font-medium">{children}</div>
  </div>
);

// ─── STEP 1: Intro ────────────────────────────────────────────────────────────

const IntroStep = () => (
  <div className="space-y-12 max-w-4xl mx-auto py-10">
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      className="inline-flex p-6 bg-amber-500/10 rounded-3xl text-amber-400 mb-4 shadow-2xl shadow-amber-500/20 mx-auto"
    >
      <Shield size={64} />
    </motion.div>

    <div className="space-y-6 text-center">
      <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-slate-500 bg-clip-text text-transparent">
        You're allowed to protect yourself.
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        You leave social situations completely drained. You say yes when every part of you
        screams no. You absorb other people's emotions like a sponge and carry them home.
        You apologise for existing in spaces. This isn't kindness —
        it's what happens when anxiety{' '}
        <span className="text-amber-400 font-bold">convinces you that your needs don't matter</span>{' '}
        as much as everyone else's comfort.
      </p>
      <p className="text-lg text-slate-400 max-w-xl mx-auto">
        Emotional boundaries aren't walls. They're the invisible infrastructure that lets you
        engage with people without being{' '}
        <span className="text-white font-semibold">consumed by them</span>.
      </p>
    </div>

    <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900 border-amber-400/30">
      <div className="flex items-start gap-4 mb-6">
        <Battery className="text-amber-400 shrink-0" size={28} />
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Why Anxiety Destroys Boundaries</h3>
          <p className="text-slate-300 leading-relaxed">
            Social anxiety creates a fundamental belief: that other people's emotional states
            are your responsibility. If someone is uncomfortable, you caused it. If there's
            tension, you must fix it. If someone is unhappy, you need to make it better —
            even at the cost of yourself. This belief doesn't come from generosity.
            It comes from{' '}
            <span className="font-semibold text-amber-300">fear of what happens if you don't</span>.
            Boundaries are the practice of separating their emotions from your responsibility.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-3xl font-black text-amber-400 mb-1">68%</div>
          <div className="text-xs text-slate-400">of people with anxiety report chronic social exhaustion from boundary violations</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-orange-400 mb-1">4x</div>
          <div className="text-xs text-slate-400">more likely to experience burnout without clear emotional boundaries in place</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">↑ 40%</div>
          <div className="text-xs text-slate-400">increase in social enjoyment reported after learning to enforce basic limits</div>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          icon: <Eye size={24} />,
          label: "Know Your Limits",
          desc: "Identify where your emotional energy actually goes — and what drains it fastest.",
          power: "You can't protect what you haven't mapped"
        },
        {
          icon: <MessageSquare size={24} />,
          label: "Speak Your Limits",
          desc: "Learn the exact language to set boundaries without apologising, over-explaining, or causing conflict.",
          power: "A boundary without language is just resentment building silently"
        },
        {
          icon: <Shield size={24} />,
          label: "Hold Your Limits",
          desc: "Navigate the guilt, pushback, and anxiety that comes when you enforce a boundary for the first time.",
          power: "The first time is the hardest. It gets easier every single time after that."
        }
      ].map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="text-left border-amber-500/10 hover:border-amber-500/40 transition-all h-full">
            <div className="text-amber-400 mb-3">{item.icon}</div>
            <p className="font-bold text-white text-lg mb-2">{item.label}</p>
            <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-amber-300 italic">⚡ {item.power}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    <Tip>
      Setting a boundary is not selfish. It is the only way to show up fully for others
      without secretly resenting them for taking what you never said you couldn't give.
    </Tip>
  </div>
);

// ─── STEP 2: The Energy Drain Map ─────────────────────────────────────────────

const EnergyDrainStep = () => {
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const drains = [
    {
      id: "rescuing",
      category: "The Emotional Rescuer",
      icon: <Heart size={20} />,
      color: "rose",
      desc: "Feeling responsible for managing other people's emotional states. Compulsively trying to fix discomfort, conflict, or sadness in the room — even when it's not yours to fix.",
      signs: ["You monitor everyone's mood in a group", "You change your behaviour based on others' unspoken emotions", "You feel guilty when someone near you is upset, even if you didn't cause it"]
    },
    {
      id: "approval",
      category: "The Approval Loop",
      icon: <Users size={20} />,
      color: "amber",
      desc: "Constantly seeking signals that people like you, approve of you, or aren't annoyed by you. Each ambiguous reaction drains energy as you process it for threat.",
      signs: ["You check others' expressions constantly for signs of disapproval", "You replay interactions for evidence that you've offended someone", "You change your opinion or personality based on who you're with"]
    },
    {
      id: "oversharing",
      category: "The Over-Explainer",
      icon: <Volume2 size={20} />,
      color: "orange",
      desc: "Feeling compelled to justify, explain, and provide rationale for every decision, opinion, or boundary you express — as though your existence requires constant defence.",
      signs: ["You say sorry before stating an opinion", "You over-explain why you can't do something", "You feel anxiety when someone questions a decision you've made"]
    },
    {
      id: "absorbing",
      category: "The Emotional Sponge",
      icon: <Radio size={20} />,
      color: "purple",
      desc: "Involuntarily absorbing and internalising the emotional states of people around you. You arrive feeling fine and leave feeling heavy without knowing why.",
      signs: ["You feel drained after being around stressed or negative people", "You catch other people's moods whether you want to or not", "You need significant alone time to decompress after social situations"]
    },
    {
      id: "peacekeeper",
      category: "The Conflict Avoider",
      icon: <Slash size={20} />,
      color: "blue",
      desc: "Suppressing your own needs, opinions, or discomfort to avoid any possibility of conflict or disappointment. The energy cost of constant suppression is enormous.",
      signs: ["You agree with things you fundamentally disagree with", "You don't speak up when someone crosses a line with you", "You feel resentment building but express it as nothing"]
    },
    {
      id: "performer",
      category: "The Social Performer",
      icon: <Sparkles size={20} />,
      color: "teal",
      desc: "Treating every social interaction as a performance where you must appear a certain way. The effort of performing rather than being is exhausting at a neurological level.",
      signs: ["You feel like a different person in social situations vs alone", "You rehearse what you'll say before interactions", "You feel relief — not pleasure — when social events end"]
    }
  ];

  const colorMap = {
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", btn: "bg-rose-600" },
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", btn: "bg-amber-600" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", btn: "bg-orange-600" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", btn: "bg-purple-600" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", btn: "bg-blue-600" },
    teal: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30", btn: "bg-teal-600" },
  };

  const allRated = drains.every(d => ratings[d.id] !== undefined);

  const topDrains = allRated
    ? [...drains].sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0)).slice(0, 2)
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Your Energy Drain Map</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Before you can set limits, you need to know exactly where your energy is going.
          Rate how much each pattern costs you personally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {drains.map((drain) => {
          const c = colorMap[drain.color];
          const rating = ratings[drain.id];
          return (
            <Card key={drain.id} className={`${c.bg} ${c.border} space-y-4`}>
              <div className="flex items-center gap-3">
                <div className={c.text}>{drain.icon}</div>
                <div className={`text-xs font-black uppercase tracking-widest ${c.text}`}>{drain.category}</div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{drain.desc}</p>
              <div className="space-y-1">
                {drain.signs.map((sign, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-400">
                    <span className={`${c.text} mt-0.5 shrink-0`}>→</span>
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">How much does this drain you?</div>
                <div className="flex gap-2">
                  {['Barely', 'Sometimes', 'Often', 'Constantly'].map((label, i) => (
                    <button key={i} onClick={() => setRatings(prev => ({ ...prev, [drain.id]: i }))}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${rating === i ? `${c.btn} border-transparent text-white` : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {allRated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900 border-amber-400/40">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Battery className="text-amber-400" size={22} /> Your Biggest Drains
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Based on your ratings, these patterns cost you the most energy. The rest of this module
                is specifically calibrated to help you address them.
              </p>
              <div className="space-y-3">
                {topDrains.map((d, i) => {
                  const c = colorMap[d.color];
                  return (
                    <div key={i} className={`flex items-center gap-4 p-4 ${c.bg} border ${c.border} rounded-xl`}>
                      <div className={`text-2xl font-black ${c.text}`}>#{i + 1}</div>
                      <div className={c.text}>{d.icon}</div>
                      <div>
                        <div className="font-bold text-white">{d.category}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Focus here first</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tip>
        Most people with social anxiety have 2–3 dominant drain patterns. Trying to fix all six
        simultaneously is overwhelming and counterproductive. Know your top two. Work there first.
      </Tip>
    </div>
  );
};

// ─── STEP 3: Boundaries vs Walls ─────────────────────────────────────────────

const BoundaryVsWallStep = () => {
  const [active, setActive] = useState(null);

  const comparisons = [
    {
      scenario: "Party / group event",
      wall: "Shutting down and going silent when you feel overwhelmed",
      boundary: "Saying: 'I need 10 minutes — I'm going to step outside briefly.'",
      wallWhy: "Walls are invisible. No one knows what's happening and can't respond to it. You get isolation, they get confusion.",
      boundaryWhy: "A boundary communicates your need clearly while maintaining the relationship. It protects you AND preserves connection."
    },
    {
      scenario: "Social plans / invitations",
      wall: "Saying yes to plans you don't want, then cancelling last minute",
      boundary: "Saying at the time: 'That doesn't work for me, but let's find something that does.'",
      wallWhy: "Late cancellation damages trust and costs you more anxiety than the original situation would have.",
      boundaryWhy: "An upfront no is kinder than a yes that becomes a no. It respects both your energy and their planning."
    },
    {
      scenario: "Uncomfortable conversations",
      wall: "Smiling and nodding through a topic that makes you deeply uncomfortable",
      boundary: "Saying: 'I'd rather not go there — can we talk about something else?'",
      wallWhy: "Performing comfort you don't feel drains energy AND builds resentment toward the person who made you uncomfortable.",
      boundaryWhy: "A simple redirect is not rude. It's honest. Most people appreciate knowing where the line is."
    },
    {
      scenario: "Emotional support requests",
      wall: "Absorbing a friend's crisis for hours until you're empty, then avoiding them",
      boundary: "Saying: 'I'm here for you and I want to support you — I also need to be honest that I have about 30 minutes of capacity right now.'",
      wallWhy: "Giving without limit leads to resentment and eventual withdrawal. You can't maintain relationships from empty.",
      boundaryWhy: "Honest capacity communication is an act of respect. You're protecting the relationship, not abandoning the person."
    },
    {
      scenario: "Being talked over / interrupted",
      wall: "Letting someone talk over you repeatedly and stewing in silent frustration",
      boundary: "Saying: 'I'd like to finish my point — ' and continuing to speak.",
      wallWhy: "Silence reads as consent. The behaviour continues. Your resentment builds. The dynamic solidifies.",
      boundaryWhy: "A gentle but firm verbal boundary changes the dynamic immediately. It doesn't require confrontation — just presence."
    },
    {
      scenario: "Opinion / values disagreement",
      wall: "Agreeing with an opinion you fundamentally disagree with to avoid tension",
      boundary: "Saying: 'I actually see it differently — I think...' and stating your view calmly.",
      wallWhy: "Suppressed opinions create suppressed identity. Over time, you stop knowing what you actually think.",
      boundaryWhy: "Disagreement expressed calmly is not conflict. It's authenticity — and it's what real relationships are made of."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Boundaries vs Walls</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          People with anxiety often confuse the two. Walls isolate. Boundaries protect while
          keeping connection intact. Tap each scenario to see the difference.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-amber-900/10 border-amber-400/20">
        <div className="flex items-start gap-4">
          <Quote className="text-amber-400 shrink-0" size={32} />
          <div>
            <p className="text-slate-200 text-lg italic mb-2">
              "Daring to set boundaries is about having the courage to love ourselves, even when we risk disappointing others."
            </p>
            <p className="text-slate-400 text-sm">— Brené Brown, researcher on vulnerability and connection</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {comparisons.map((item, i) => {
          const isOpen = active === i;
          return (
            <motion.div key={i} layout onClick={() => setActive(isOpen ? null : i)}
              className={`rounded-2xl border cursor-pointer transition-all overflow-hidden ${isOpen ? 'bg-slate-900 border-amber-500/40' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center justify-between gap-4 p-5">
                <div className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded ${isOpen ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                  {item.scenario}
                </div>
                <ChevronRight className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={18} />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-wide">
                            <XCircle size={14} /> The Wall
                          </div>
                          <p className="text-slate-200 font-medium italic text-sm">"{item.wall}"</p>
                          <p className="text-red-300 text-xs leading-relaxed">{item.wallWhy}</p>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wide">
                            <Shield size={14} /> The Boundary
                          </div>
                          <p className="text-slate-200 font-medium italic text-sm">"{item.boundary}"</p>
                          <p className="text-emerald-300 text-xs leading-relaxed">{item.boundaryWhy}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <Tip>
        Every boundary has three components: what you need, how you'll communicate it, and what
        you'll do if it's not respected. You only need the first two to start. The third comes with practice.
      </Tip>
    </div>
  );
};

// ─── STEP 4: The Boundary Language Lab ───────────────────────────────────────

const LanguageLabStep = () => {
  const [category, setCategory] = useState(0);
  const [copied, setCopied] = useState(null);

  const categories = [
    {
      label: "Declining Without Explaining",
      icon: <Hand size={18} />,
      color: "amber",
      desc: "You do not owe anyone a reason for your no. A boundary stated without justification is not rude — it is self-respecting. These phrases decline clearly and kindly without opening a negotiation.",
      phrases: [
        { phrase: "That doesn't work for me, but thank you for thinking of me.", when: "Any invitation or request you don't want to accept", why: "'Doesn't work for me' is personal and inarguable — it doesn't invite problem-solving or guilt-tripping.", tone: "Warm & final" },
        { phrase: "I'm going to sit this one out.", when: "Group activities, events, or requests for participation", why: "Short, casual, and requires no explanation. The confidence in its brevity is itself a signal that no debate is needed.", tone: "Light & decided" },
        { phrase: "I'm not able to commit to that right now.", when: "Requests for your time, energy, or ongoing involvement", why: "'Right now' makes it situational, not permanent — reduces the other person's need to take it personally.", tone: "Honest & soft" },
        { phrase: "I need to pass on this one.", when: "Repeated invitations from someone who doesn't take first nos well", why: "Phrasing it as your need removes the focus from their request and places it on your reality.", tone: "Clear & self-centred (in the healthy sense)" }
      ]
    },
    {
      label: "Limiting Emotional Labour",
      icon: <Battery size={18} />,
      color: "orange",
      desc: "You can be a supportive person AND have a limit on how much emotional weight you carry. These phrases honour both the relationship and your capacity.",
      phrases: [
        { phrase: "I'm really here for you. I also want to be honest that I have about [time] before I need to step away.", when: "When a friend or family member is in crisis and needs extended support", why: "Time-bounding support is not abandonment. It's honesty that protects the relationship long-term.", tone: "Caring & boundaried" },
        { phrase: "I can listen — I just want to be upfront that I'm not in the best headspace to give advice today.", when: "When you're drained but want to show up for someone", why: "Sets the type of support you can give, not whether you can give any. Prevents you from being responsible for solutions you don't have capacity to provide.", tone: "Honest & supportive" },
        { phrase: "I care about you a lot. I'm also noticing this conversation is going to a place I can't follow today.", when: "When a conversation becomes heavy beyond your current capacity", why: "Naming it as a 'today' limitation removes permanence and models emotional self-awareness.", tone: "Gentle & clear" },
        { phrase: "I want to be the kind of friend who's actually present when we talk — which means I need to be honest when I'm running low.", when: "With close relationships where you want to explain the why behind your limit", why: "Connects the boundary to your commitment to the relationship. Turns 'I can't' into 'I want to show up well for you'.", tone: "Relational & warm" }
      ]
    },
    {
      label: "Redirecting Conversations",
      icon: <Repeat size={18} />,
      color: "blue",
      desc: "You are allowed to steer a conversation away from topics that drain, upset, or violate your comfort — without making it a confrontation.",
      phrases: [
        { phrase: "I'd rather not get into that — can we talk about something else?", when: "Topics that are triggering, invasive, or make you deeply uncomfortable", why: "Direct without being aggressive. 'Can we' makes it collaborative rather than a rejection of the person.", tone: "Simple & honest" },
        { phrase: "That's a bit personal for me — I'll keep that one close.", when: "Questions about your personal life, finances, relationships, or mental health you don't want to discuss", why: "Gentle, slightly humorous framing reduces tension. It sounds human rather than defensive.", tone: "Light & boundaried" },
        { phrase: "I'm going to step back from this particular conversation.", when: "Group discussions or debates that are escalating or draining", why: "Signals exit without drama. Makes your withdrawal intentional rather than disappearance.", tone: "Calm & decisive" },
        { phrase: "I notice we keep coming back to this. I think I need it to be off the table for a while.", when: "Recurring conversation topics with close relationships that exhaust you", why: "Naming the pattern without blame. 'For a while' is less threatening than 'forever'.", tone: "Assertive & measured" }
      ]
    },
    {
      label: "Holding Under Pressure",
      icon: <Shield size={18} />,
      color: "rose",
      desc: "The hardest part of boundaries isn't saying them — it's repeating them calmly when someone pushes back. These phrases hold the line without escalating.",
      phrases: [
        { phrase: "I understand you see it differently. My answer is still no.", when: "When someone argues with, challenges, or tries to negotiate your boundary", why: "Validates their perspective without changing yours. 'Still' signals the answer was final the first time.", tone: "Firm & non-defensive" },
        { phrase: "I hear you. This isn't up for discussion.", when: "When someone persists past a first or second no", why: "Brief. No room to negotiate. Delivered calmly, it signals that pressure will not work.", tone: "Final & composed" },
        { phrase: "I've said what I need to say. I'm not going to keep going back and forth on this.", when: "Circular arguments where the other person refuses to accept the boundary", why: "Removes the fuel for the argument. You're refusing because you've been clear — not because you're upset.", tone: "Steady & closed" },
        { phrase: "I know this is disappointing. I'm still not able to change my answer.", when: "When someone is visibly upset or uses guilt as leverage", why: "Acknowledges their emotion without taking responsibility for it. You can be compassionate AND immovable.", tone: "Empathetic & firm" }
      ]
    }
  ];

  const colorMap = {
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", active: "bg-amber-600 border-amber-400" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", active: "bg-orange-600 border-orange-400" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", active: "bg-blue-600 border-blue-400" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", active: "bg-rose-600 border-rose-400" },
  };

  const cat = categories[category];
  const c = colorMap[cat.color];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Boundary Language Lab</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          16 ready-to-use phrases across 4 categories. Boundaries without language are just
          unexpressed resentment. These give you the words.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat, i) => {
          const bc = colorMap[cat.color];
          return (
            <button key={i} onClick={() => setCategory(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${category === i ? `${bc.active} text-white` : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={category} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
          <div className={`p-4 ${c.bg} border ${c.border} rounded-xl`}>
            <p className={`text-sm ${c.text} font-medium`}>{cat.desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cat.phrases.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/30 transition-all h-full flex flex-col justify-between gap-4">
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${c.text} mb-2`}>{item.tone}</div>
                    <p className="text-white font-semibold leading-relaxed mb-2 text-lg italic">"{item.phrase}"</p>
                    <div className={`text-xs font-bold uppercase ${c.text} mb-1 mt-3`}>Use when</div>
                    <p className="text-slate-400 text-xs mb-2">{item.when}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.why}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard?.writeText(item.phrase); setCopied(i); setTimeout(() => setCopied(null), 2000); }}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all self-start ${copied === i ? 'bg-emerald-600 border-emerald-400 text-white' : `${c.bg} ${c.border} ${c.text} hover:opacity-80`}`}>
                    {copied === i ? '✓ Copied' : 'Copy phrase'}
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Warning>
        Do not memorise phrases. Practise them in low-stakes situations first — with acquaintances,
        in shops, with people you barely know. The goal is for the language to feel natural, not rehearsed.
        Natural comes from repetition.
      </Warning>
    </div>
  );
};

// ─── STEP 5: The Guilt Decoder ────────────────────────────────────────────────

const GuiltDecoderStep = () => {
  const [open, setOpen] = useState(null);

  const guilts = [
    {
      thought: "If I say no, they'll think I don't care about them.",
      truth: "Your no is about your capacity, not your care. People who interpret a boundary as a rejection of them are confusing your limits with your feelings. One has nothing to do with the other.",
      reframe: "I care about this person AND I have limits. Both are true simultaneously.",
      color: "amber", label: "The Caring Guilt"
    },
    {
      thought: "I should be able to handle this — other people manage fine.",
      truth: "You don't know what other people are managing privately. Comparing your internal experience to others' external presentation is always a losing comparison. Your limits are your limits — they don't need to be justified by comparison.",
      reframe: "My capacity is what it is. It's not a moral failing that I have limits.",
      color: "orange", label: "The Comparison Guilt"
    },
    {
      thought: "They need me. I can't let them down.",
      truth: "You cannot be someone's primary emotional resource indefinitely without destroying yourself. A boundary that preserves your functioning keeps you available to them long-term. Burning yourself out is not devotion — it's unsustainable.",
      reframe: "Setting a limit now means I can actually be there for them next time too.",
      color: "rose", label: "The Saviour Guilt"
    },
    {
      thought: "I'll seem selfish or difficult if I speak up.",
      truth: "People who enforce boundaries consistently are not seen as difficult — they are seen as reliable. People who have no limits are eventually seen as people-pleasers who can't be trusted to be honest. Boundaries build respect, not resentment.",
      reframe: "Saying what I need is not selfishness. It's self-respect. Those are different things.",
      color: "purple", label: "The Selfishness Guilt"
    },
    {
      thought: "They got upset, which means I did something wrong.",
      truth: "Someone being upset by your boundary is their emotional response — not evidence that your boundary was wrong. You are responsible for communicating your needs clearly and kindly. You are not responsible for managing how other people feel about your limits.",
      reframe: "Their discomfort is theirs. I communicated clearly and kindly. That's all I can do.",
      color: "blue", label: "The Upset Guilt"
    },
    {
      thought: "A good person wouldn't need to protect themselves like this.",
      truth: "Good people have limits. The most compassionate people have the clearest boundaries — because they've learned that sustainable care requires self-preservation. A boundary is not a flaw in your character. It is evidence of your self-awareness.",
      reframe: "Protecting my energy is what lets me be the kind of person I want to be.",
      color: "teal", label: "The Character Guilt"
    }
  ];

  const colorMap = {
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    teal: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Guilt Decoder</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Guilt after setting a boundary is almost universal for anxious people. It's not a signal
          that you did something wrong — it's anxiety protecting its territory. Tap each guilt thought to dismantle it.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-amber-900/10 border-amber-400/20">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-amber-400 shrink-0" size={28} />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Guilt Is Not a Compass</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              For people with anxiety, guilt activates the moment they prioritise themselves —
              regardless of whether the action was actually wrong. Guilt trained you to put others
              first as a survival mechanism. That training is outdated. Guilt after a boundary
              means the boundary was necessary — not that it was harmful.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {guilts.map((item, i) => {
          const c = colorMap[item.color];
          const isOpen = open === i;
          return (
            <motion.div key={i} layout onClick={() => setOpen(isOpen ? null : i)}
              className={`rounded-2xl border cursor-pointer transition-all overflow-hidden ${isOpen ? `bg-slate-900 ${c.border}` : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${c.text}`}>{item.label}</div>
                  <p className={`text-sm font-medium italic truncate ${isOpen ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    "{item.thought}"
                  </p>
                </div>
                <ChevronRight className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={18} />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 space-y-4">
                      <div className="border-t border-slate-800 pt-4">
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{item.truth}</p>
                        <div className={`${c.bg} border ${c.border} p-4 rounded-xl`}>
                          <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2`}>Your New Thought</div>
                          <p className={`text-sm font-semibold italic ${c.text}`}>{item.reframe}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <Tip>
        The guilt doesn't disappear immediately after you set a boundary. It lingers. That's normal.
        Your job isn't to feel no guilt — it's to act despite the guilt and observe that the feared
        outcome doesn't materialise. Each time it doesn't, the guilt signal weakens.
      </Tip>
    </div>
  );
};

// ─── STEP 6: The Recharge Protocol ───────────────────────────────────────────

const RechargeStep = () => {
  const [selected, setSelected] = useState(0);

  const protocols = [
    {
      title: "Pre-Event Boundary Setting",
      icon: <Sun size={22} />,
      color: "amber",
      when: "Before entering a social situation",
      tagline: "Decide your limits before anxiety decides them for you",
      steps: [
        { action: "Set a time limit", detail: "Know in advance how long you're staying. Tell yourself: 'I'm staying for 90 minutes maximum.' Having an exit time removes the open-ended dread." },
        { action: "Identify your exit phrase", detail: "Choose a natural-sounding exit before you arrive. 'I have an early morning tomorrow' / 'I promised myself an early night.' Pick one. Stick to it." },
        { action: "Set one limit on what you'll share", detail: "Decide in advance what topics are off-limits. You don't have to explain or defend this — just know it. Knowing your limit in advance reduces the anxiety of deciding in the moment." },
        { action: "Give yourself permission to leave", detail: "Explicitly say to yourself before you go: 'I am allowed to leave when I need to. Leaving is not failure.' This sounds simple. It changes everything." }
      ]
    },
    {
      title: "Mid-Event Recovery",
      icon: <Activity size={22} />,
      color: "orange",
      when: "When you're overwhelmed mid-situation",
      tagline: "You don't have to white-knuckle through the whole event",
      steps: [
        { action: "The 5-Minute Exit", detail: "Excuse yourself to the bathroom. Stand alone for 5 minutes. No phone — just quiet. This is not avoidance. It is resetting your nervous system mid-event." },
        { action: "Reduce your radius", detail: "Move from a large group to a smaller one. Or find one person to talk to one-on-one. Smaller social units require significantly less energy to navigate." },
        { action: "Name it to yourself", detail: "Say internally: 'I am overstimulated right now. This is temporary. I don't have to fix it — just ride it.' Naming reduces the second wave of panic." },
        { action: "Anchor to one task", detail: "Give yourself a concrete micro-mission: 'I'm going to get a drink and find one person to say something genuine to.' Specific tasks combat the formless anxiety of open-ended socialising." }
      ]
    },
    {
      title: "Post-Event Decompression",
      icon: <Moon size={22} />,
      color: "blue",
      when: "After returning from a social situation",
      tagline: "Recovery is not weakness — it's the cost of showing up",
      steps: [
        { action: "Give yourself a transition window", detail: "Don't immediately jump to other tasks. Give yourself 15–30 minutes of complete decompression: quiet, alone, low stimulation. This is neurological processing, not laziness." },
        { action: "Physical release", detail: "Move your body. Walk, stretch, shower. Social exhaustion stores itself physically. Movement helps discharge the residual tension the interaction left in your system." },
        { action: "The one-sentence debrief", detail: "Write or say one sentence only: 'I did [X] tonight and it cost me [Y] but I managed it.' No analysis. No replay. One sentence. Done. Resist the loop's invitation." },
        { action: "Tomorrow permission", detail: "If post-event analysis starts: 'I'll think about that tomorrow at [specific time].' Schedule it. Let it go for tonight. Your brain needs to believe the thought won't be lost — that's why it keeps returning." }
      ]
    }
  ];

  const colorMap = {
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", active: "bg-amber-600 border-amber-400", num: "bg-amber-600" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", active: "bg-orange-600 border-orange-400", num: "bg-orange-600" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", active: "bg-blue-600 border-blue-400", num: "bg-blue-600" },
  };

  const p = protocols[selected];
  const c = colorMap[p.color];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Energy Recharge Protocol</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Boundaries aren't only about what you say to others. They include how you manage
          your own energy before, during, and after social situations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {protocols.map((proto, i) => {
          const pc = colorMap[proto.color];
          return (
            <motion.button key={i} onClick={() => setSelected(i)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl border transition-all text-left ${selected === i ? `${pc.active} text-white` : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <div className={`mb-2 ${selected === i ? 'text-white' : pc.text}`}>{proto.icon}</div>
              <div className="font-black text-base mb-1">{proto.title}</div>
              <div className="text-xs opacity-70">{proto.when}</div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selected} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <Card className={`bg-slate-900 ${c.border}`}>
            <div className="space-y-6">
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>{p.when}</div>
                <h3 className="text-2xl font-black text-white mb-1">{p.title}</h3>
                <p className={`text-sm italic ${c.text}`}>{p.tagline}</p>
              </div>
              <div className="space-y-3">
                {p.steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className={`w-8 h-8 rounded-lg ${c.num} flex items-center justify-center text-white font-black text-sm shrink-0`}>{i + 1}</div>
                    <div>
                      <div className="text-sm font-bold text-white mb-1">{step.action}</div>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Tip>
        The Post-Event Decompression is the most skipped step — and the most important for people
        with anxiety. Without a formal decompression, the residual energy of the interaction becomes
        fuel for the overthinking loop. Give yourself the transition time.
      </Tip>
    </div>
  );
};

// ─── STEP 7: Scenario Simulator ───────────────────────────────────────────────

const ScenarioSimulator = ({ onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const scenarios = [
    {
      situation: "A friend calls you at 9pm in emotional crisis. You're completely depleted from a long day and already in bed. They need to talk for hours. You feel immediate guilt for even considering not picking up.",
      options: [
        { text: "Pick up and give everything you have regardless of your state, then lie awake exhausted and resentful.", correct: false, feedback: "Giving from empty doesn't serve them — it produces a diminished version of your support and leaves you burned out. This pattern makes you less available over time, not more." },
        { text: "Ignore the call completely and feel guilty all night.", correct: false, feedback: "A wall instead of a boundary. Total withdrawal with no communication. You're still giving them nothing AND paying the anxiety cost of guilt all night." },
        { text: "Answer and say: 'I'm really glad you called. I want to be honest — I'm running on empty tonight. I can give you 20 minutes of real presence. Is that helpful, or would it be better to talk tomorrow when I'm actually here for you?'", correct: true, feedback: "This is the boundary. You showed up, you were honest about your capacity, you gave them agency, and you offered a genuine alternative. That's care with a limit — not abandonment." },
        { text: "Text back: 'Can't talk, sorry' with no further explanation.", correct: false, feedback: "Abrupt and unexplained. Creates confusion and hurt without protecting the relationship. A brief explanation preserves the connection a wall would damage." }
      ]
    },
    {
      situation: "You're at a family gathering. A relative keeps asking invasive questions about your job, relationship status, and finances. Everyone around the table can hear. You can feel yourself shrinking.",
      options: [
        { text: "Answer everything asked, overshare out of anxiety, and feel violated afterward.", correct: false, feedback: "Over-disclosing from anxiety is not connection — it's a boundary collapse. You feel worse afterward because nothing was protected." },
        { text: "Give short deflecting answers and change the subject each time, hoping they'll stop.", correct: false, feedback: "This is a wall — invisible and ineffective. Deflecting without naming the limit keeps you in a reactive loop for the whole event." },
        { text: "Answer once, then: 'I'll keep that one close — what's happening with you lately?' and redirect attention.", correct: true, feedback: "Light, socially smooth, and boundaried. The redirect to them is both a genuine change of subject and a signal that you're not opening that door. It's graceful, not aggressive." },
        { text: "Say loudly: 'I find these questions really intrusive and I'd appreciate it if you'd stop.'", correct: false, feedback: "Accurate — but the public confrontation escalates unnecessarily. The quiet redirect achieves the same result without making it a scene." }
      ]
    },
    {
      situation: "You've said no to a social event. The organiser texts back: 'Come on, you always do this. You need to make more effort. It'll be good for you.' You feel the familiar pull to cave and apologise.",
      options: [
        { text: "Apologise extensively, make an excuse, and agree to come even though you don't want to.", correct: false, feedback: "Caving to guilt reinforces that pressure works on you. The next invitation will come with the same pressure — and more. You've trained the interaction." },
        { text: "Ignore the message entirely.", correct: false, feedback: "A wall. No communication. They're left to interpret silence, which is often harsher than a brief honest response." },
        { text: "Send: 'I hear you. My answer is still no. Let's find another time that works for both of us.' — then send nothing else regardless of what comes back.", correct: true, feedback: "The Holding Under Pressure phrase in action. You acknowledged their message without engaging the guilt-trip. You offered a genuine alternative. And then you stopped. No further justification needed." },
        { text: "Send a detailed explanation of exactly why you can't come, listing all your reasons.", correct: false, feedback: "Over-explaining invites negotiation of each reason. Your no does not require a defence. A detailed explanation says you need their agreement. You don't." }
      ]
    }
  ];

  const current = scenarios[idx];

  const choose = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    setRevealed(true);
    if (current.options[i].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (idx < scenarios.length - 1) {
      setIdx(i => i + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      setDone(true);
      onComplete?.();
    }
  };

  if (done) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="inline-flex p-8 bg-amber-500/10 rounded-full">
          <Trophy className="text-amber-400" size={64} />
        </div>
        <h3 className="text-3xl font-black text-white">Scenarios Complete</h3>
        <p className="text-slate-300 text-lg">
          You chose the boundaried response <span className="text-amber-400 font-bold">{score}</span> out of <span className="font-bold text-white">{scenarios.length}</span> times.
        </p>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          {score === scenarios.length
            ? "You're thinking in boundaries, not in collapse or walls. That's the full shift. Now practise it where it counts — in real moments with real stakes."
            : "The scenarios you missed show where guilt and anxiety are still making decisions for you. Those are exactly where to practise first."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="text-xs text-slate-500 uppercase tracking-widest">Scenario {idx + 1} of {scenarios.length}</div>
        <h2 className="text-4xl font-black text-white">The Boundary Is Being Tested. What Do You Do?</h2>
        <p className="text-slate-400">One right answer. Apply what you've learned.</p>
      </div>

      <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900 border-amber-400/30">
        <div className="flex items-start gap-4">
          <Shield className="text-amber-400 shrink-0 mt-1" size={24} />
          <p className="text-lg text-slate-200 leading-relaxed">{current.situation}</p>
        </div>
      </Card>

      <div className="space-y-3">
        {current.options.map((opt, i) => {
          let cls = "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700";
          if (revealed) {
            if (opt.correct) cls = "border-emerald-500 bg-emerald-500/10 text-white";
            else if (chosen === i) cls = "border-red-500 bg-red-500/10 text-red-200";
            else cls = "border-slate-800 bg-slate-900/30 text-slate-500 opacity-40";
          }
          return (
            <motion.div key={i} whileTap={{ scale: 0.99 }}>
              <button onClick={() => choose(i)} className={`w-full text-left p-5 rounded-xl border transition-all ${cls}`}>
                <div className="flex items-start gap-3">
                  {revealed && (opt.correct ? <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} /> : chosen === i ? <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} /> : <div className="w-[18px]" />)}
                  <div>
                    <p className="font-medium leading-relaxed">{opt.text}</p>
                    {revealed && (opt.correct || chosen === i) && (
                      <p className={`text-sm mt-2 leading-relaxed ${opt.correct ? 'text-emerald-300' : 'text-red-300'}`}>{opt.feedback}</p>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {revealed && (
        <div className="flex justify-end">
          <button onClick={next}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
            {idx < scenarios.length - 1 ? "Next Scenario" : "See Results"} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── STEP 8: Closing ──────────────────────────────────────────────────────────

const ClosingStep = () => (
  <div className="max-w-3xl mx-auto text-center space-y-10 py-12">
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="inline-block p-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full text-white mb-2 shadow-3xl shadow-amber-500/50"
    >
      <Trophy size={80} />
    </motion.div>

    <div className="space-y-4">
      <h2 className="text-5xl sm:text-6xl font-black text-white">Energy Protected.</h2>
      <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
        You don't have to choose between being a good person and protecting yourself.
        In fact, the boundaries you set are what make it possible to{' '}
        <span className="text-amber-400 font-bold">keep showing up</span> —
        for others, and for yourself.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <Card className="bg-amber-500/5 border-amber-500/30">
        <div className="text-3xl font-black text-amber-400 mb-2">16</div>
        <div className="text-sm text-slate-300">Boundary phrases ready to use across 4 categories</div>
      </Card>
      <Card className="bg-orange-500/5 border-orange-500/30">
        <div className="text-3xl font-black text-orange-400 mb-2">6</div>
        <div className="text-sm text-slate-300">Guilt patterns dismantled with their reframes</div>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/30">
        <div className="text-3xl font-black text-emerald-400 mb-2">3</div>
        <div className="text-sm text-slate-300">Energy recharge protocols: before, during, and after</div>
      </Card>
    </div>

    <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30 text-left">
      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 uppercase text-sm">
        <Flame size={18} /> The 14-Day Boundary Ladder
      </h4>
      <div className="space-y-3 text-slate-300">
        <p className="leading-relaxed">Start with the smallest possible boundary and work up:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="text-emerald-400 font-black">Days 1–3:</span><span>Decline one low-stakes request without over-explaining. A shop, an acquaintance, an email.</span></li>
          <li className="flex gap-2"><span className="text-emerald-400 font-black">Days 4–7:</span><span>Redirect one conversation topic that makes you uncomfortable. Once per day.</span></li>
          <li className="flex gap-2"><span className="text-emerald-400 font-black">Days 8–11:</span><span>Implement the Pre-Event and Post-Event protocols for any social situation you attend.</span></li>
          <li className="flex gap-2"><span className="text-emerald-400 font-black">Days 12–14:</span><span>Hold one limit when someone pushes back. Use the Holding Under Pressure phrases. Don't explain further.</span></li>
        </ul>
        <p className="text-sm italic text-slate-400 pt-2 border-t border-slate-800">
          By day 14, you'll have evidence — from your own life — that boundaries don't destroy relationships.
          They clarify them. And that's the only thing that actually removes the fear of setting them.
        </p>
      </div>
    </Card>

    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">What You've Mastered</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm">
        {[
          "The 6 energy drain patterns and which ones cost you most",
          "The difference between a wall and a boundary — and why it matters",
          "16 boundary phrases across declining, limiting, redirecting, and holding",
          "6 guilt patterns and the reframes that dismantle them",
          "The Before, During, and After recharge protocol for social events",
          "How to hold a boundary when someone pushes back without escalating"
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <CheckCircle2 className="text-amber-400 shrink-0 mt-0.5" size={16} />
            <span className="text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>

    <button onClick={() => window.location.reload()}
      className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 group mt-8">
      <RefreshCcw className="group-hover:rotate-180 transition-transform duration-500" size={24} />
      Finish Module
    </button>
  </div>
);

// ─── Main App Controller ──────────────────────────────────────────────────────

export default function App() {
  usePortalDriver();
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const navLabel = () => {
    if (step === 6) return "TAKE THE SCENARIO TEST";
    if (step === 7) return "CONTINUE TEST";
    return "CONTINUE JOURNEY";
  };

  return (
    <div className={`min-h-screen ${THEME.background} text-slate-100 font-sans selection:bg-amber-500/40`}>
      <ProgressBar current={step} total={totalSteps} />

      <main className="pt-32 pb-48 px-6 sm:px-12 relative z-10">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5, ease: "circOut" }}>
            {step === 1 && <IntroStep />}
            {step === 2 && <EnergyDrainStep />}
            {step === 3 && <BoundaryVsWallStep />}
            {step === 4 && <LanguageLabStep />}
            {step === 5 && <GuiltDecoderStep />}
            {step === 6 && <RechargeStep />}
            {step === 7 && <ScenarioSimulator onComplete={nextStep} />}
            {step === 8 && <ClosingStep />}
          </motion.div>
        </AnimatePresence>
      </main>

      {step < totalSteps && (
        <div className="fixed bottom-0 left-0 right-0 px-8 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] flex justify-center pointer-events-none z-50">
          <div className="flex gap-4 max-w-4xl w-full pointer-events-auto items-center">
            {step > 1 && (
              <motion.button onClick={prevStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center p-5 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-3xl transition-all backdrop-blur-md shadow-xl">
                <ArrowLeft size={24} />
              </motion.button>
            )}
            <motion.button onClick={nextStep} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-3 py-6 bg-gradient-to-r ${THEME.gradient} text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50`}>
              {navLabel()} <ArrowRight size={24} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}