import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, Wind, Shield, AlertCircle, CheckCircle2,
  ArrowRight, ArrowLeft, Trophy, Lightbulb, RefreshCcw,
  Activity, Flame, Target, Eye, Timer, Layers, Repeat,
  ChevronRight, Quote, Compass, Award, MessageSquare,
  Volume2, VolumeX, Shuffle, Ghost, Sparkles, TrendingUp,
  Cpu, Radio, Pause, Play, RotateCcw, Lock, Unlock
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';

// --- Global Theme & UI Components ---

const THEME = {
  background: "bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-950",
  card: "bg-slate-800/40 backdrop-blur-md border border-violet-500/20 rounded-2xl",
  accent: "text-violet-400",
  gradient: "from-violet-500 to-purple-600"
};

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-violet-900/50 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 px-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Ghost className="w-5 h-5 text-violet-400" />
        <span className="font-bold text-slate-200 hidden sm:block uppercase tracking-widest text-xs">When Your Mind Goes Blank</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-md">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <span className="text-[10px] font-mono text-violet-400 font-bold bg-violet-500/10 px-2 py-1 rounded">STAGE {current}/{total}</span>
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
  <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl flex gap-3 items-start">
    <Lightbulb className="text-violet-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-slate-400 leading-relaxed italic">{children}</div>
  </div>
);

const Warning = ({ children }) => (
  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3 items-start">
    <AlertCircle className="text-amber-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-amber-200 leading-relaxed font-medium">{children}</div>
  </div>
);

// ─── STEP 1: Intro ───────────────────────────────────────────────────────────

const IntroStep = () => (
  <div className="space-y-12 max-w-4xl mx-auto py-10">
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      className="inline-flex p-6 bg-violet-500/10 rounded-3xl text-violet-400 mb-4 shadow-2xl shadow-violet-500/20 mx-auto"
    >
      <Ghost size={64} />
    </motion.div>

    <div className="space-y-6 text-center">
      <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-slate-500 bg-clip-text text-transparent">
        The Blank isn't you.
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        One moment you're functioning. The next — nothing. Your mind empties mid-sentence.
        Someone asks a question and you can hear silence where your thoughts should be.
        This isn't stupidity. This isn't a personality flaw. This is your{' '}
        <span className="text-violet-400 font-bold">prefrontal cortex going temporarily offline</span>{' '}
        because your brain decided you were in danger.
      </p>
      <p className="text-lg text-slate-400 max-w-xl mx-auto">
        In this module, you'll understand exactly why it happens — and build a concrete
        toolkit so that the next time your mind blanks,{' '}
        <span className="text-white font-semibold">you know exactly what to do in the next 5 seconds</span>.
      </p>
    </div>

    <Card className="bg-gradient-to-br from-violet-900/20 to-slate-900 border-violet-400/30">
      <div className="flex items-start gap-4 mb-6">
        <Cpu className="text-violet-400 shrink-0" size={28} />
        <div>
          <h3 className="text-xl font-bold text-white mb-2">What's Actually Happening in Your Brain</h3>
          <p className="text-slate-300 leading-relaxed">
            Your prefrontal cortex — the part responsible for language, memory retrieval, and coherent
            thought — is the first thing that goes offline during an amygdala hijack. Blood flow
            literally redirects away from it toward your survival systems. You're not forgetting what
            to say. You're in a{' '}
            <span className="font-semibold text-violet-300">temporary cortical shutdown</span>.
            The good news: it's reversible in seconds with the right interrupts.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-3xl font-black text-violet-400 mb-1">&lt;3s</div>
          <div className="text-xs text-slate-400">How fast the blank can hit once anxiety spikes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-purple-400 mb-1">100%</div>
          <div className="text-xs text-slate-400">Of people experience this — including public speakers, comedians, CEOs</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">5 sec</div>
          <div className="text-xs text-slate-400">Average time to recover with the right interrupt technique</div>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          icon: <Cpu size={24} />,
          label: "Understand It",
          desc: "Know exactly what's shutting down and why — so the blank stops feeling catastrophic.",
          power: "Understanding defuses the second wave of panic that makes blanks last longer"
        },
        {
          icon: <Radio size={24} />,
          label: "Interrupt It",
          desc: "Use 5-second verbal and physical patterns to reboot your prefrontal cortex on the spot.",
          power: "The right phrase buys you the time your brain needs to come back online"
        },
        {
          icon: <Layers size={24} />,
          label: "Bridge It",
          desc: "Master recovery phrases that sound natural — not panicked — while you find your footing.",
          power: "Nobody notices the blank. They notice how you handle what comes after it."
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="text-left border-violet-500/10 hover:border-violet-500/40 transition-all h-full">
            <div className="text-violet-400 mb-3">{item.icon}</div>
            <p className="font-bold text-white text-lg mb-2">{item.label}</p>
            <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-violet-300 italic">⚡ {item.power}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    <Tip>
      The blank feels like it lasts forever. To the other person, it's almost always under 3 seconds.
      Your entire job in this module is learning how to survive those 3 seconds with composure.
    </Tip>
  </div>
);

// ─── STEP 2: The Anatomy of a Blank ──────────────────────────────────────────

const AnatomyStep = () => {
  const [phase, setPhase] = useState(0);

  const phases = [
    {
      id: "trigger",
      time: "0.0s",
      title: "The Trigger",
      color: "violet",
      icon: <Zap size={22} />,
      brain: "Amygdala fires",
      what: "Something social registers as a threat: a question directed at you, a pause in conversation, eye contact from someone intimidating, feeling put on the spot.",
      internal: "Your amygdala sends a distress signal before your conscious mind has processed what's happening.",
      body: "Subtle adrenaline spike. Pupils dilate slightly. Breathing changes.",
      mistake: "Trying to push through and answer immediately — this makes the blank worse."
    },
    {
      id: "shutdown",
      time: "0.5–2s",
      title: "Cortical Shutdown",
      color: "purple",
      icon: <Cpu size={22} />,
      brain: "Prefrontal cortex goes offline",
      what: "Blood flow redirects from your language and memory centers to your survival systems. This is the actual blank — not forgetfulness, but temporary cortical unavailability.",
      internal: "Your word-retrieval system, working memory, and logical sequencing all go quiet simultaneously.",
      body: "Possible: slight dizziness, feeling of time slowing, hyper-awareness of the silence.",
      mistake: "Saying 'um' repeatedly or looking panicked — this signals distress and extends the blank."
    },
    {
      id: "spiral",
      time: "2–5s",
      title: "The Panic Spiral",
      color: "rose",
      icon: <AlertCircle size={22} />,
      brain: "Meta-anxiety kicks in",
      what: "You become anxious about being anxious. 'I've gone blank, they can see it, I look stupid, this is getting worse.' This second layer of anxiety re-feeds the amygdala and extends the shutdown.",
      internal: "This is where most people lose control of the situation. The blank itself was manageable. The spiral about the blank is what causes real damage.",
      body: "Heart rate spikes again. Possible redness, increased shaking, urge to look away.",
      mistake: "Apologizing excessively or explaining that your mind 'went blank' — this turns 3 seconds into 30."
    },
    {
      id: "recovery",
      time: "5–10s",
      title: "The Recovery Window",
      color: "emerald",
      icon: <Sparkles size={22} />,
      brain: "Prefrontal cortex reboots",
      what: "If you don't escalate the spiral, your cortex begins to come back online. Words start returning. The pathway is clear — but only if you bought yourself time instead of panicking.",
      internal: "This is where your toolkit matters. The right bridge phrase in the spiral phase creates space for this recovery to happen naturally.",
      body: "Breathing normalizes. Thoughts begin to cohere. The blank resolves.",
      mistake: "Thinking you 'failed' because it happened at all. The blank is not the problem. The recovery is the skill."
    }
  ];

  const colorMap = {
    violet: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30", btn: "bg-violet-600 border-violet-400" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", btn: "bg-purple-600 border-purple-400" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", btn: "bg-rose-600 border-rose-400" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", btn: "bg-emerald-600 border-emerald-400" },
  };

  const p = phases[phase];
  const c = colorMap[p.color];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Anatomy of a Blank</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The blank happens in four distinct phases. Understanding each one is the first step to interrupting it.
        </p>
      </div>

      {/* Timeline nav */}
      <div className="flex gap-2 justify-center flex-wrap">
        {phases.map((ph, i) => {
          const bc = colorMap[ph.color];
          return (
            <button
              key={i}
              onClick={() => setPhase(i)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                phase === i ? `${bc.btn} text-white` : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {ph.time}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className={`${c.bg} ${c.border}`}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={c.text}>{p.icon}</div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>{p.time} — {p.brain}</div>
                  <h3 className="text-3xl font-black text-white">{p.title}</h3>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-lg">{p.what}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800">
                  <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2`}>Inside Your Brain</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{p.internal}</p>
                </div>
                <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Physical Signs</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <div className="text-xs font-bold text-red-400 uppercase mb-1">Common Mistake</div>
                  <p className="text-sm text-red-200">{p.mistake}</p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setPhase(s => Math.max(s - 1, 0))}
                  disabled={phase === 0}
                  className="px-5 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-semibold disabled:opacity-30 hover:bg-slate-700 transition-all"
                >← Previous</button>
                <button
                  onClick={() => setPhase(s => Math.min(s + 1, phases.length - 1))}
                  disabled={phase === phases.length - 1}
                  className={`px-5 py-2 text-white rounded-xl text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-all ${c.btn.split(' ')[0]}`}
                >Next →</button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Tip>
        The spiral phase (2–5s) is the real enemy — not the blank itself. If you can stay calm through
        the spiral, the recovery happens automatically. Your only job is not making it worse.
      </Tip>
    </div>
  );
};

// ─── STEP 3: The Bridge Phrase Arsenal ───────────────────────────────────────

const BridgePhraseStep = () => {
  const [category, setCategory] = useState(0);
  const [copied, setCopied] = useState(null);

  const categories = [
    {
      label: "Buy Time Naturally",
      color: "violet",
      icon: <Timer size={18} />,
      desc: "These phrases buy your brain 3–5 seconds without sounding stalled. Use them the moment you feel the blank coming.",
      phrases: [
        {
          phrase: "That's a really good question — let me think about that for a second.",
          why: "Complimenting the question sounds thoughtful, not frozen. The pause that follows reads as consideration, not panic.",
          tone: "Warm & deliberate"
        },
        {
          phrase: "Hmm. I want to give you a real answer rather than a quick one.",
          why: "Reframes the pause as intentional quality. You're not stuck — you're being thorough.",
          tone: "Confident & sincere"
        },
        {
          phrase: "Give me one second — I want to answer this properly.",
          why: "Directly buys time without explanation. Delivered calmly, it reads as someone who takes the conversation seriously.",
          tone: "Direct & composed"
        },
        {
          phrase: "I know what I want to say, I'm just finding the right way to say it.",
          why: "Signals that thoughts exist, just not words yet. Completely true during a blank — and completely believable.",
          tone: "Self-aware & honest"
        }
      ]
    },
    {
      label: "Redirect the Question",
      color: "purple",
      icon: <Repeat size={18} />,
      desc: "When you genuinely can't retrieve an answer, redirect attention without it being obvious that's what you're doing.",
      phrases: [
        {
          phrase: "I'm curious what made you ask that — can you tell me more?",
          why: "Turns the question back with genuine curiosity. Gives you time to think while also gathering more context to answer better.",
          tone: "Curious & engaging"
        },
        {
          phrase: "Before I answer — what's your take on it?",
          why: "Especially useful in discussions. Hears their view first, which can cue your own response and make you look collaborative.",
          tone: "Conversational & smart"
        },
        {
          phrase: "That depends on a few things — what angle are you coming from?",
          why: "Sounds like sophisticated thinking. Meanwhile you're using the extra time to figure out what you actually want to say.",
          tone: "Thoughtful & nuanced"
        },
        {
          phrase: "I've got a few thoughts — which part interests you most?",
          why: "Makes it sound like you have too much to say, not too little. Narrows the scope while you gather yourself.",
          tone: "Confident & specific"
        }
      ]
    },
    {
      label: "Name It & Own It",
      color: "emerald",
      icon: <Unlock size={18} />,
      desc: "Sometimes the most powerful move is radical honesty. Naming the blank out loud removes its power entirely — and almost always lands with warmth.",
      phrases: [
        {
          phrase: "I had a thought and completely lost it — hold on.",
          why: "Universally relatable. Everyone has experienced this. It creates immediate human connection instead of shame.",
          tone: "Relatable & light"
        },
        {
          phrase: "Sorry, I do this sometimes — I go blank when I'm really engaged in something.",
          why: "Reframes the blank as a sign of engagement, not incompetence. Turns your weakness into a character trait.",
          tone: "Disarming & reframing"
        },
        {
          phrase: "I just completely blanked — can you ask me again?",
          why: "Direct and honest. People almost always respond with warmth and patience. Zero judgment in 95% of cases.",
          tone: "Honest & brave"
        },
        {
          phrase: "You know what, I want to come back to this — I had something and I lost it.",
          why: "Defers the answer gracefully, showing you want to give it proper attention rather than a half-baked response.",
          tone: "Thoughtful & self-aware"
        }
      ]
    },
    {
      label: "Physical Reset First",
      color: "amber",
      icon: <Wind size={18} />,
      desc: "Before any words, sometimes you need a 2-second physical reset that's invisible to others but reboots your brain.",
      phrases: [
        {
          phrase: "[Take one slow exhale through the mouth, then speak]",
          why: "The exhale activates your parasympathetic system. Your prefrontal cortex starts coming back online in 2–3 seconds. Don't rush it.",
          tone: "Physical interrupt"
        },
        {
          phrase: "[Feel your feet on the ground, then look at the person and nod slowly]",
          why: "The nod signals you heard them. The grounding pulls you out of your head. Buys 3 seconds that look like thoughtful engagement.",
          tone: "Grounding + buying time"
        },
        {
          phrase: "[Take a sip of drink if one is present, then respond]",
          why: "Completely natural pause mechanism. Nobody questions it. Gives your brain a full 3–5 seconds with zero social cost.",
          tone: "Environmental anchor"
        },
        {
          phrase: "[Repeat their last 3 words back to them as a question]",
          why: "'...You went freelance?' Instantly buys time while showing you were listening. Requires no original thought — just echo.",
          tone: "Echo technique"
        }
      ]
    }
  ];

  const colorMap = {
    violet: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", active: "bg-violet-600 border-violet-400" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", active: "bg-purple-600 border-purple-400" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", active: "bg-emerald-600 border-emerald-400" },
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", active: "bg-amber-600 border-amber-400" },
  };

  const cat = categories[category];
  const c = colorMap[cat.color];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Bridge Phrase Arsenal</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          16 ready-to-use phrases across 4 categories. You don't invent these in the moment —
          you have them loaded and ready to fire.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat, i) => {
          const bc = colorMap[cat.color];
          return (
            <button
              key={i}
              onClick={() => setCategory(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                category === i ? `${bc.active} text-white` : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-4"
        >
          <div className={`p-4 ${c.bg} border ${c.border} rounded-xl`}>
            <p className={`text-sm ${c.text} font-medium`}>{cat.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cat.phrases.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-violet-500/30 transition-all h-full flex flex-col justify-between gap-4">
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${c.text} mb-2`}>{item.tone}</div>
                    <p className="text-white font-semibold leading-relaxed mb-3 text-lg italic">
                      "{item.phrase}"
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.why}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(item.phrase);
                      setCopied(i);
                      setTimeout(() => setCopied(null), 2000);
                    }}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all self-start ${
                      copied === i
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : `${c.bg} ${c.border} ${c.text} hover:opacity-80`
                    }`}
                  >
                    {copied === i ? '✓ Copied' : 'Copy phrase'}
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Warning>
        Pick 2–3 phrases that feel natural to YOUR voice and practice saying them out loud before you need them.
        Your brain won't access a phrase it's never said — even if you've read it a hundred times.
      </Warning>
    </div>
  );
};

// ─── STEP 4: The 5-Second Reboot ─────────────────────────────────────────────

const RebootStep = () => {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStepState] = useState(0);
  const [count, setCount] = useState(5);
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef(null);

  const steps = [
    { label: "FEEL", instruction: "Feel your feet flat on the floor. Press them down.", color: "violet", seconds: 2 },
    { label: "EXHALE", instruction: "One long exhale through your mouth. Empty your lungs.", color: "purple", seconds: 3 },
    { label: "LOOK", instruction: "Make eye contact or look at one object in the room.", color: "indigo", seconds: 2 },
    { label: "NOD", instruction: "Nod slowly once. It signals presence and buys one more second.", color: "blue", seconds: 2 },
    { label: "SPEAK", instruction: "Open with your chosen bridge phrase. Your brain is back.", color: "emerald", seconds: 2 },
  ];

  const colorMap = {
    violet: "from-violet-600 to-violet-800",
    purple: "from-purple-600 to-purple-800",
    indigo: "from-indigo-600 to-indigo-800",
    blue: "from-blue-600 to-blue-800",
    emerald: "from-emerald-600 to-emerald-800",
  };

  const start = () => {
    setRunning(true);
    setComplete(false);
    setCurrentStepState(0);
    setCount(steps[0].seconds);
  };

  const reset = () => {
    setRunning(false);
    setComplete(false);
    setCurrentStepState(0);
    setCount(5);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!running) return;
    let remaining = steps[currentStep].seconds;
    setCount(remaining);
    intervalRef.current = setInterval(() => {
      remaining--;
      setCount(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        if (currentStep < steps.length - 1) {
          setCurrentStepState(s => s + 1);
        } else {
          setRunning(false);
          setComplete(true);
        }
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, currentStep]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The 5-Second Reboot Protocol</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          When the blank hits, run this sequence. It takes 11 seconds total and is completely
          invisible to anyone watching. Practice it now so your body knows it cold.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-violet-900/20 to-slate-900 border-violet-400/30">
        <div className="flex items-start gap-4">
          <Quote className="text-violet-400 shrink-0" size={32} />
          <div>
            <p className="text-slate-200 text-lg italic mb-2">
              "The pause that feels eternal to you is invisible to them. Your only job is not to fill it with panic."
            </p>
            <p className="text-slate-400 text-sm">— The core principle of blank recovery</p>
          </div>
        </div>
      </Card>

      {!running && !complete && (
        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[s.color]} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">{s.label} — {s.seconds}s</div>
                <p className="text-slate-200 font-medium">{s.instruction}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {running && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8 py-10"
        >
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className={`text-3xl font-black bg-gradient-to-r ${colorMap[steps[currentStep].color]} bg-clip-text text-transparent mb-2`}>
              {steps[currentStep].label}
            </div>
            <p className="text-slate-300 text-xl max-w-sm mx-auto leading-relaxed">
              {steps[currentStep].instruction}
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-36 h-36 rounded-full bg-gradient-to-br ${colorMap[steps[currentStep].color]} flex items-center justify-center shadow-2xl`}
            >
              <span className="text-6xl font-black text-white">{count}</span>
            </motion.div>
          </div>

          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i <= currentStep ? 'bg-violet-400 w-8' : 'bg-slate-700 w-4'}`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {complete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 space-y-4"
        >
          <div className="inline-flex p-6 bg-emerald-500/10 rounded-full mb-2">
            <CheckCircle2 className="text-emerald-400" size={56} />
          </div>
          <h3 className="text-3xl font-black text-white">Reboot Complete.</h3>
          <p className="text-slate-300 text-lg max-w-md mx-auto">
            That's 11 seconds. Invisible to anyone watching. And your brain is now back online.
          </p>
        </motion.div>
      )}

      <div className="flex justify-center gap-4">
        {!running && (
          <button
            onClick={start}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white rounded-2xl font-black text-lg transition-all shadow-xl"
          >
            <Play size={22} /> {complete ? 'Run Again' : 'Run the Protocol'}
          </button>
        )}
        {running && (
          <button
            onClick={reset}
            className="flex items-center gap-3 px-8 py-4 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={18} /> Reset
          </button>
        )}
      </div>

      <Tip>
        Run this protocol 3 times right now, back to back. Muscle memory is built through repetition,
        not reading. Your nervous system needs to have done this before it can do it under pressure.
      </Tip>
    </div>
  );
};

// ─── STEP 5: The Spotlight Illusion Lab ──────────────────────────────────────

const SpotlightStep = () => {
  const [revealed, setRevealed] = useState([]);

  const toggle = (i) => setRevealed(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const myths = [
    {
      myth: "Everyone noticed I went blank.",
      truth: "Research by Thomas Gilovich at Cornell found people consistently overestimate how much others notice their mistakes by 3–5x. In a blank lasting under 5 seconds, the other person is almost certainly thinking about what they're going to say next.",
      stat: "3–5x overestimation",
      statColor: "violet"
    },
    {
      myth: "They could see how nervous I was.",
      truth: "Studies show observers rate speakers' anxiety significantly lower than the speakers rate their own. What feels like obvious shaking, redness, or hesitation is almost always imperceptible from the outside.",
      stat: "Significantly lower",
      statColor: "purple"
    },
    {
      myth: "Going blank makes me look stupid.",
      truth: "When people pause to think, observers typically rate them as more thoughtful and considered — not less intelligent. The pause reads as deliberation, not incompetence, unless you visibly panic.",
      stat: "More thoughtful",
      statColor: "indigo"
    },
    {
      myth: "If I blank once, it'll happen all night.",
      truth: "Blanks are acute events triggered by specific anxiety spikes. Successfully recovering from one reduces the anxiety baseline, making subsequent blanks less likely — not more. Every recovery builds the pattern.",
      stat: "Each recovery helps",
      statColor: "blue"
    },
    {
      myth: "A confident person would never go blank.",
      truth: "Professional actors, TED speakers, and stand-up comedians all experience blanks. The difference isn't that they don't freeze — it's that they have practiced recovery protocols and trust them. That's the whole skill.",
      stat: "Universal experience",
      statColor: "emerald"
    },
    {
      myth: "If I can't think of anything to say, I have nothing interesting to offer.",
      truth: "The blank is a memory retrieval failure, not a content failure. The thoughts exist. The anxiety temporarily blocked the path to them. This has nothing to do with your intelligence, personality, or worth as a conversationalist.",
      stat: "Retrieval, not content",
      statColor: "amber"
    }
  ];

  const statColors = {
    violet: "text-violet-400",
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Spotlight Illusion</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Half the suffering comes from what you believe others are thinking. These beliefs are almost
          always wrong. Tap each one to see what's actually true.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-violet-900/10 border-violet-400/20">
        <div className="flex items-start gap-4">
          <Eye className="text-violet-400 shrink-0" size={28} />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">The Spotlight Effect</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Psychologists call it the Spotlight Effect: our tendency to believe we are being noticed,
              observed, and evaluated far more than we actually are. This cognitive bias is amplified
              tenfold by social anxiety. The spotlight you feel? Is almost always off.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {myths.map((item, i) => {
          const open = revealed.includes(i);
          return (
            <motion.div
              key={i}
              layout
              onClick={() => toggle(i)}
              className={`rounded-xl border cursor-pointer transition-all overflow-hidden ${
                open ? 'bg-slate-900 border-violet-500/40' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${open ? 'bg-emerald-500' : 'bg-red-500/20 border border-red-500/40'}`}>
                    {open ? <CheckCircle2 size={14} className="text-white" /> : <AlertCircle size={14} className="text-red-400" />}
                  </div>
                  <p className={`font-semibold ${open ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    "{item.myth}"
                  </p>
                </div>
                <ChevronRight className={`shrink-0 text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`} size={18} />
              </div>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3">
                      <div className="border-t border-slate-800 pt-4">
                        <div className={`text-xs font-bold uppercase tracking-widest ${statColors[item.statColor]} mb-2`}>
                          Research Says: {item.stat}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.truth}</p>
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
        Next time you blank, ask yourself: "Is the catastrophic story I'm telling myself actually true —
        or is it my anxiety's prediction?" Your anxiety is not a reliable narrator.
      </Tip>
    </div>
  );
};

// ─── STEP 6: Scenario Simulator ───────────────────────────────────────────────

const ScenarioSimulator = ({ onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const scenarios = [
    {
      situation: "Someone asks you a direct question in a group setting. Your mind empties completely. Four people are watching you. Two seconds pass in total silence.",
      options: [
        { text: "Say 'uh... um...' repeatedly while desperately trying to find words.", correct: false, feedback: "Filler sounds like um/uh escalate your own anxiety and signal panic to others. They extend the blank rather than ending it." },
        { text: "Feel feet on the floor, take one slow exhale, then say: 'That's a good question — let me think about that for a second.'", correct: true, feedback: "The physical reset slows your nervous system. The bridge phrase covers the remaining pause with intention. Nobody saw a blank — they saw consideration." },
        { text: "Laugh nervously and say 'Sorry, sorry, I completely forgot what I was going to say — sorry about that.'", correct: false, feedback: "Three apologies make the blank the focus of everyone's attention. Naming it briefly once is fine; escalating it is not." },
        { text: "Change the subject abruptly to something unrelated.", correct: false, feedback: "A non-sequitur reads as stranger than a pause. It confuses rather than recovers." }
      ]
    },
    {
      situation: "You're mid-sentence telling a story and completely lose the thread. You genuinely cannot remember where you were going.",
      options: [
        { text: "Keep talking and make up an ending even though it doesn't make sense.", correct: false, feedback: "Incoherent storytelling is more damaging than stopping. Honesty here is always the stronger move." },
        { text: "Stop and say: 'I had a point and completely lost it — anyway, the main thing was...' and jump to your conclusion.", correct: true, feedback: "Naming the blank briefly and pivoting to the conclusion is smooth and relatable. You still delivered a complete story — just without the middle you forgot." },
        { text: "Say 'I'll come back to this' and go completely silent for 10 seconds.", correct: false, feedback: "Silence without a bridge phrase creates awkwardness. The pause needs something to land on." },
        { text: "Ask someone else a question to distract from the fact you lost your train of thought.", correct: false, feedback: "Deflecting mid-story feels odd. A brief acknowledgment followed by a conclusion is far smoother." }
      ]
    },
    {
      situation: "You meet someone new and they ask 'So, tell me about yourself.' You blank completely. Nothing comes. You can feel yourself starting to panic about the panic.",
      options: [
        { text: "Give a robotic, pre-memorized elevator pitch in a rushed monotone.", correct: false, feedback: "Scripted responses under panic sound inauthentic and often make the panic worse, not better. The energy doesn't match." },
        { text: "Say: 'Honestly, I always go blank at this question — what do you actually want to know?'", correct: true, feedback: "The Vulnerability Drop works beautifully here. It's honest, charming, and immediately makes it collaborative. You've turned your blank into an opening." },
        { text: "Say 'I'm not very interesting' and deflect to asking about them.", correct: false, feedback: "Self-deprecation in this specific way signals low self-worth, which people unconsciously mirror. Never narrate yourself as uninteresting." },
        { text: "Look at the floor and say 'um, well, I guess... I don't really know where to start' and trail off.", correct: false, feedback: "This combination of physical withdrawal and verbal trailing signals deep discomfort without any recovery. It extends the awkwardness without resolution." }
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
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-6 py-12"
      >
        <div className="inline-flex p-8 bg-violet-500/10 rounded-full">
          <Trophy className="text-violet-400" size={64} />
        </div>
        <h3 className="text-3xl font-black text-white">Scenarios Complete</h3>
        <p className="text-slate-300 text-lg">
          You chose the regulated response <span className="text-violet-400 font-bold">{score}</span> out of <span className="font-bold text-white">{scenarios.length}</span> times.
        </p>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          {score === scenarios.length
            ? "You're starting to think in recovery mode, not panic mode. That's the entire shift."
            : "The options you missed show where your default instincts still run toward avoidance or over-explanation. Awareness of the pattern is how you change it."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="text-xs text-slate-500 uppercase tracking-widest">Scenario {idx + 1} of {scenarios.length}</div>
        <h2 className="text-4xl font-black text-white">Real-Time Decision Lab</h2>
        <p className="text-slate-400">The blank just happened. What do you do?</p>
      </div>

      <Card className="bg-gradient-to-br from-violet-900/20 to-slate-900 border-violet-400/30">
        <div className="flex items-start gap-4">
          <Ghost className="text-violet-400 shrink-0 mt-1" size={24} />
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
                  {revealed && (
                    opt.correct
                      ? <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                      : chosen === i
                        ? <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                        : <div className="w-[18px]" />
                  )}
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
          <button
            onClick={next}
            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            {idx < scenarios.length - 1 ? "Next Scenario" : "See Results"} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── STEP 7: Closing ──────────────────────────────────────────────────────────

const ClosingStep = () => (
  <div className="max-w-3xl mx-auto text-center space-y-10 py-12">
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="inline-block p-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full text-white mb-2 shadow-3xl shadow-violet-500/50"
    >
      <Trophy size={80} />
    </motion.div>

    <div className="space-y-4">
      <h2 className="text-5xl sm:text-6xl font-black text-white">Blank? Handled.</h2>
      <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
        The blank will happen again. But now you have a protocol, a phrase, and the truth about
        what others actually see. The blank was never the problem.{' '}
        <span className="text-violet-400 font-bold">Not knowing what to do after it</span> was.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <Card className="bg-violet-500/5 border-violet-500/30">
        <div className="text-3xl font-black text-violet-400 mb-2">16</div>
        <div className="text-sm text-slate-300">Bridge phrases ready to deploy</div>
      </Card>
      <Card className="bg-purple-500/5 border-purple-500/30">
        <div className="text-3xl font-black text-purple-400 mb-2">11s</div>
        <div className="text-sm text-slate-300">The full reboot protocol, start to finish</div>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/30">
        <div className="text-3xl font-black text-emerald-400 mb-2">6</div>
        <div className="text-sm text-slate-300">Anxiety myths dismantled with evidence</div>
      </Card>
    </div>

    <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30 text-left">
      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 uppercase text-sm">
        <Flame size={18} /> The 3-Day Drill
      </h4>
      <div className="space-y-3 text-slate-300">
        <p className="leading-relaxed">
          For the next 3 days, practise one thing daily:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="text-emerald-400">→</span> <span className="font-semibold text-white">Day 1:</span> Choose 2 bridge phrases and say them out loud 10 times each.</li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> <span className="font-semibold text-white">Day 2:</span> Run the 5-Second Reboot Protocol 5 times before sleeping.</li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> <span className="font-semibold text-white">Day 3:</span> In one conversation, intentionally pause for 3 seconds before answering a question.</li>
        </ul>
        <p className="text-sm italic text-slate-400 pt-2 border-t border-slate-800">
          Day 3 is the most important. You need to discover, from experience, that a 3-second pause is not the catastrophe your brain insists it is.
        </p>
      </div>
    </Card>

    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">What You've Mastered</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm">
        {[
          "The four phases of a blank — and what's happening in your brain at each one",
          "Why the spiral after the blank is more dangerous than the blank itself",
          "16 bridge phrases across 4 categories for every type of blank",
          "The 5-Second Reboot Protocol — invisible to others, powerful for you",
          "The Spotlight Illusion: why others notice far less than you think",
          "How to turn a blank into a moment of authentic connection"
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <CheckCircle2 className="text-violet-400 shrink-0 mt-0.5" size={16} />
            <span className="text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 group mt-8"
    >
      <RefreshCcw className="group-hover:rotate-180 transition-transform duration-500" size={24} />
      Finish Module
    </button>
  </div>
);

// ─── Main App Controller ──────────────────────────────────────────────────────

export default function App() {
  usePortalDriver();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const navLabel = () => {
    if (step === 5) return "TAKE THE SCENARIO TEST";
    if (step === 6) return "CONTINUE TEST";
    return "CONTINUE JOURNEY";
  };

  return (
    <div className={`min-h-screen ${THEME.background} text-slate-100 font-sans selection:bg-violet-500/40`}>
      <ProgressBar current={step} total={totalSteps} />

      <main className="pt-32 pb-48 px-6 sm:px-12 relative z-10">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            {step === 1 && <IntroStep />}
            {step === 2 && <AnatomyStep />}
            {step === 3 && <BridgePhraseStep />}
            {step === 4 && <RebootStep />}
            {step === 5 && <SpotlightStep />}
            {step === 6 && <ScenarioSimulator onComplete={nextStep} />}
            {step === 7 && <ClosingStep />}
          </motion.div>
        </AnimatePresence>
      </main>

      {step < totalSteps && (
        <div className="fixed bottom-0 left-0 right-0 px-8 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] flex justify-center pointer-events-none z-50">
          <div className="flex gap-4 max-w-4xl w-full pointer-events-auto items-center">
            {step > 1 && (
              <motion.button
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center p-5 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-3xl transition-all backdrop-blur-md shadow-xl"
              >
                <ArrowLeft size={24} />
              </motion.button>
            )}
            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-3 py-6 bg-gradient-to-r ${THEME.gradient} text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50`}
            >
              {navLabel()}
              <ArrowRight size={24} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}