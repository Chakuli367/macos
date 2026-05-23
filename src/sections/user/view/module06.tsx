import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Brain, Zap, Shield, Wind, AlertCircle, CheckCircle2,
  ArrowRight, ArrowLeft, Trophy, Lightbulb, RefreshCcw,
  Activity, Flame, Target, Eye, Timer, Layers, Repeat,
  TrendingUp, ChevronRight, Quote, Compass, Award
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';

// --- Global Theme & UI Components ---

const THEME = {
  background: "bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-950",
  card: "bg-slate-800/40 backdrop-blur-md border border-rose-500/20 rounded-2xl",
  accent: "text-rose-400",
  gradient: "from-rose-500 to-pink-600"
};

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-rose-900/50 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 px-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-rose-400" />
        <span className="font-bold text-slate-200 hidden sm:block uppercase tracking-widest text-xs">Managing the Fear Response</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-md">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded">STAGE {current}/{total}</span>
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
  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex gap-3 items-start">
    <Lightbulb className="text-rose-400 shrink-0 mt-1" size={18} />
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
      className="inline-flex p-6 bg-rose-500/10 rounded-3xl text-rose-400 mb-4 shadow-2xl shadow-rose-500/20 mx-auto"
    >
      <Heart size={64} />
    </motion.div>

    <div className="space-y-6 text-center">
      <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-rose-200 to-slate-500 bg-clip-text text-transparent">
        Your Body Isn't Broken.
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        That racing heart, the frozen mind, the urge to flee — that's not weakness.
        That's your nervous system doing exactly what it was built to do. The problem isn't the{' '}
        <span className="text-rose-400 font-bold">fear</span> — it's that nobody taught you how to{' '}
        <span className="italic font-semibold text-rose-300">work with it</span> instead of against it.
      </p>
      <p className="text-lg text-slate-400 max-w-xl mx-auto">
        In this module, you'll learn to understand your fear response at a biological level — and use
        that knowledge to calm your body <span className="text-white font-semibold">before it takes over</span>.
      </p>
    </div>

    <Card className="bg-gradient-to-br from-rose-900/20 to-slate-900 border-rose-400/30">
      <div className="flex items-start gap-4 mb-6">
        <Brain className="text-rose-400 shrink-0" size={28} />
        <div>
          <h3 className="text-xl font-bold text-white mb-2">What's Actually Happening Inside You</h3>
          <p className="text-slate-300 leading-relaxed">
            When social anxiety hits, your amygdala — the brain's alarm system — fires before your
            rational brain even has a chance to respond. This is called an{' '}
            <span className="font-semibold text-rose-300">amygdala hijack</span>. Adrenaline floods your
            body in milliseconds. This isn't a character flaw. It's ancient survival code running
            in a modern world. And like any code, it can be{' '}
            <span className="text-white font-semibold">overridden</span>.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-3xl font-black text-rose-400 mb-1">0.07s</div>
          <div className="text-xs text-slate-400">How fast your amygdala fires before you even think</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-pink-400 mb-1">90 sec</div>
          <div className="text-xs text-slate-400">How long adrenaline physically lasts if you don't refuel it</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">4–7x</div>
          <div className="text-xs text-slate-400">Calmer heart rate achievable with controlled breathing in 60 seconds</div>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          icon: <Zap size={24} />,
          label: "Recognize It",
          desc: "Identify the exact moment your fear response fires — before it takes over.",
          power: "Awareness breaks the automatic cycle before it escalates"
        },
        {
          icon: <Wind size={24} />,
          label: "Regulate It",
          desc: "Use physiology-backed tools to calm your nervous system in real-time.",
          power: "Your breath is a direct remote control to your nervous system"
        },
        {
          icon: <Shield size={24} />,
          label: "Redirect It",
          desc: "Transform fear energy into presence — so anxiety becomes fuel, not fog.",
          power: "The same adrenaline that freezes you can make you magnetic"
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="text-left border-rose-500/10 hover:border-rose-500/40 transition-all h-full">
            <div className="text-rose-400 mb-3">{item.icon}</div>
            <p className="font-bold text-white text-lg mb-2">{item.label}</p>
            <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-rose-300 italic">⚡ {item.power}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    <Tip>
      By the end of this module, you'll be able to identify your personal fear triggers, interrupt the
      anxiety spiral within seconds, and enter any social situation feeling grounded — not perfect, just present.
    </Tip>
  </div>
);

// ─── STEP 2: The Fear Map ─────────────────────────────────────────────────────

const FearMapStep = () => {
  const [selected, setSelected] = useState(null);

  const signals = [
    {
      category: "Body Signals",
      color: "rose",
      icon: <Heart size={20} />,
      items: [
        { name: "Racing heart", meaning: "Adrenaline surge — your body is preparing to act. This is energy, not danger." },
        { name: "Shaky hands or voice", meaning: "Excess adrenaline causing fine motor tremor. It's almost invisible to others — they see passion, not panic." },
        { name: "Dry mouth", meaning: "Blood redirected away from digestion to muscles. Swallow, sip water, keep moving." },
        { name: "Chest tightness", meaning: "Shallow breathing is restricting your ribcage. One slow exhale begins to reverse this immediately." }
      ]
    },
    {
      category: "Mind Signals",
      color: "indigo",
      icon: <Brain size={20} />,
      items: [
        { name: "Mind going blank", meaning: "Prefrontal cortex (rational brain) temporarily offline. Not stupidity — biology. It comes back in seconds." },
        { name: "Catastrophic thoughts", meaning: "Amygdala pattern-matching to worst-case scenarios. These are predictions, not facts." },
        { name: "Hyperawareness of self", meaning: "Your spotlight effect is on. But research shows others are far less focused on you than you think." },
        { name: "Time distortion", meaning: "Anxiety slows perceived time. That pause that felt like 10 seconds? It was 2." }
      ]
    },
    {
      category: "Behaviour Signals",
      color: "amber",
      icon: <Eye size={20} />,
      items: [
        { name: "Wanting to escape", meaning: "Avoidance is your nervous system's short-term fix. It works once, then makes everything worse." },
        { name: "Over-explaining yourself", meaning: "Anxiety filling silence with words. Silence is not a problem — it's often power." },
        { name: "Mirroring too aggressively", meaning: "Trying to people-please to reduce threat. It reads as nervous, not likeable." },
        { name: "Laughing nervously", meaning: "Tension release valve. Naming it disarms it: 'I laugh when I'm nervous — sorry, I'm weirdly excited about this.'" }
      ]
    }
  ];

  const colorMap = {
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", activeBg: "bg-rose-600", activeBorder: "border-rose-400" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", activeBg: "bg-indigo-600", activeBorder: "border-indigo-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", activeBg: "bg-amber-600", activeBorder: "border-amber-400" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Your Personal Fear Map</h2>
        <p className="text-xl text-slate-300 italic max-w-2xl mx-auto">
          You can't interrupt what you don't recognize. These are your body's alarm signals — and what they actually mean.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-rose-900/10 border-rose-400/20">
        <div className="flex items-start gap-4">
          <Quote className="text-rose-400 shrink-0" size={32} />
          <div>
            <p className="text-slate-200 text-lg italic mb-2">
              "The goal is not to eliminate anxiety — it's to stop letting anxiety make decisions for you."
            </p>
            <p className="text-slate-400 text-sm">— The core principle of fear regulation</p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {signals.map((group, gi) => {
          const c = colorMap[group.color];
          return (
            <div key={gi}>
              <div className={`flex items-center gap-2 mb-3 ${c.text}`}>
                {group.icon}
                <span className="font-bold uppercase text-sm tracking-widest">{group.category}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const isOpen = selected === key;
                  return (
                    <motion.div
                      key={ii}
                      onClick={() => setSelected(isOpen ? null : key)}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        isOpen ? `${c.activeBg} ${c.activeBorder}` : `bg-slate-900/50 ${c.border} hover:bg-slate-900`
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-semibold text-sm ${isOpen ? 'text-white' : 'text-slate-300'}`}>{item.name}</span>
                        <ChevronRight className={`shrink-0 transition-transform ${isOpen ? 'rotate-90 text-white' : c.text}`} size={16} />
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-sm text-white/80 mt-3 leading-relaxed overflow-hidden"
                          >
                            {item.meaning}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Tip>
        Most people have 2–3 signals that always show up first. Once you know YOUR sequence,
        you can catch the fear response at stage 1 instead of stage 5.
      </Tip>
    </div>
  );
};

// ─── STEP 3: Breathing Lab ────────────────────────────────────────────────────

const BreathingLab = () => {
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | inhale | hold | exhale | hold2
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  const techniques = [
    {
      id: "box",
      name: "Box Breathing",
      tagline: "Used by Navy SEALs before high-stress operations",
      pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
      when: "Before walking into a social situation",
      why: "Equalizes all four breath phases, creating immediate nervous system symmetry and mental calm.",
      color: "rose"
    },
    {
      id: "478",
      name: "4-7-8 Method",
      tagline: "The fastest way to activate your parasympathetic system",
      pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
      when: "Mid-panic, when anxiety has already hit",
      why: "The extended exhale triggers the vagus nerve, which directly signals your heart to slow down.",
      color: "indigo"
    },
    {
      id: "physiological",
      name: "Physiological Sigh",
      tagline: "Stanford's #1 fastest stress relief technique",
      pattern: { inhale: 2, hold1: 1, exhale: 6, hold2: 0 },
      when: "In the middle of a conversation when you feel overwhelmed",
      why: "A double inhale maximally inflates your lungs and purges CO2, creating instant calm in seconds.",
      color: "emerald"
    }
  ];

  const colorMap = {
    rose: { ring: "ring-rose-500", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", active: "bg-rose-600" },
    indigo: { ring: "ring-indigo-500", text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30", active: "bg-indigo-600" },
    emerald: { ring: "ring-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", active: "bg-emerald-600" },
  };

  const selectedTech = techniques.find(t => t.id === active);

  useEffect(() => {
    if (!selectedTech || phase === 'idle') return;
    const p = selectedTech.pattern;
    const sequence = [
      { phase: 'inhale', dur: p.inhale },
      ...(p.hold1 ? [{ phase: 'hold', dur: p.hold1 }] : []),
      { phase: 'exhale', dur: p.exhale },
      ...(p.hold2 ? [{ phase: 'hold2', dur: p.hold2 }] : []),
    ];

    let idx = 0;
    let remaining = sequence[0].dur;
    setPhase(sequence[0].phase);
    setCount(sequence[0].dur);

    const interval = setInterval(() => {
      remaining--;
      setCount(remaining);
      if (remaining <= 0) {
        idx = (idx + 1) % sequence.length;
        if (idx === 0) setCycle(c => c + 1);
        remaining = sequence[idx].dur;
        setPhase(sequence[idx].phase);
        setCount(sequence[idx].dur);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase === 'idle' ? null : active, phase === 'idle' ? phase : null]);

  const startBreathing = (id) => {
    setActive(id);
    setPhase('start');
    setCycle(0);
    setTimeout(() => setPhase('inhale'), 100);
  };

  const stopBreathing = () => {
    setActive(null);
    setPhase('idle');
    setCount(0);
    setCycle(0);
  };

  const phaseLabels = {
    inhale: { label: "Breathe In", color: "text-rose-300" },
    hold: { label: "Hold", color: "text-indigo-300" },
    exhale: { label: "Breathe Out", color: "text-emerald-300" },
    hold2: { label: "Hold", color: "text-amber-300" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Breathing Toolkit</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Your breath is the only part of your nervous system you can consciously control.
          That makes it your most powerful anxiety interrupt.
        </p>
      </div>

      {active && selectedTech ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8 py-8"
        >
          <div className="text-center">
            <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">{selectedTech.name}</div>
            <div className={`text-2xl font-bold ${phaseLabels[phase]?.color || 'text-white'}`}>
              {phaseLabels[phase]?.label || '...'}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.8 : 1,
              }}
              transition={{ duration: selectedTech.pattern[phase === 'inhale' ? 'inhale' : phase === 'exhale' ? 'exhale' : 'hold1'] || 1, ease: "linear" }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-rose-500/30 to-pink-600/20 border-2 border-rose-500/50 flex items-center justify-center"
            >
              <span className="text-5xl font-black text-white">{count}</span>
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-rose-500/5 animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          <div className="text-center">
            <div className="text-sm text-slate-500">Cycle {cycle + 1}</div>
          </div>

          <button
            onClick={stopBreathing}
            className="px-8 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-semibold hover:bg-slate-700 transition-all"
          >
            Stop
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techniques.map((t) => {
            const c = colorMap[t.color];
            return (
              <Card key={t.id} className={`${c.bg} ${c.border} flex flex-col justify-between gap-4`}>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2`}>{t.when}</div>
                  <h3 className="text-xl font-black text-white mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-400 italic mb-4">{t.tagline}</p>
                  <div className="flex gap-3 mb-4">
                    {[
                      { label: "In", val: t.pattern.inhale },
                      ...(t.pattern.hold1 ? [{ label: "Hold", val: t.pattern.hold1 }] : []),
                      { label: "Out", val: t.pattern.exhale },
                      ...(t.pattern.hold2 ? [{ label: "Hold", val: t.pattern.hold2 }] : []),
                    ].map((seg, i) => (
                      <div key={i} className="flex-1 text-center bg-slate-900/50 rounded-lg py-2">
                        <div className="text-lg font-black text-white">{seg.val}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{seg.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{t.why}</p>
                </div>
                <button
                  onClick={() => startBreathing(t.id)}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all ${c.active} hover:opacity-90 flex items-center justify-center gap-2`}
                >
                  <Wind size={18} /> Start Exercise
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <Warning>
        Don't practice these for the first time in a high-anxiety situation. Do them daily for 5 minutes so your
        nervous system recognizes the pattern and responds faster when you need it most.
      </Warning>
    </div>
  );
};

// ─── STEP 4: The 90-Second Rule ───────────────────────────────────────────────

const NinetySecondStep = () => {
  const [stage, setStage] = useState(0);

  const stages = [
    {
      time: "0–15s",
      title: "The Trigger",
      color: "rose",
      icon: <Zap size={24} />,
      body: "Your amygdala detects a social 'threat' — being introduced to strangers, speaking up in a group, someone looking at you. It fires before you can think. Your body floods with adrenaline.",
      action: "Do nothing. Don't fight it. Just notice: \"There it is. My body is preparing to act.\" Naming it immediately reduces its power.",
      mantra: "\"This is chemistry, not truth.\""
    },
    {
      time: "15–45s",
      title: "The Peak",
      color: "orange",
      icon: <Flame size={24} />,
      body: "Adrenaline hits its maximum. Heart pounding, thoughts racing, urge to escape is loudest right here. This is the moment most people act on anxiety — they flee, go silent, or overcompensate.",
      action: "Use the Physiological Sigh: double inhale through the nose, long exhale through the mouth. Do this ONCE. Your vagus nerve activates. The peak begins to drop.",
      mantra: "\"I can tolerate this for 90 seconds.\""
    },
    {
      time: "45–90s",
      title: "The Decline",
      color: "amber",
      icon: <TrendingUp size={24} />,
      body: "If you don't refuel the panic with more fearful thoughts, the adrenaline physically clears your bloodstream. You didn't stop the fear — your body processed it.",
      action: "Redirect attention outward. Ask a genuine question. Notice one physical detail about your environment. Curiosity is the antidote to self-consciousness.",
      mantra: "\"I'm through the worst of it.\""
    },
    {
      time: "90s+",
      title: "The Window",
      color: "emerald",
      icon: <Shield size={24} />,
      body: "Your rational brain is back online. You can think clearly. This is not courage — this is neurochemistry. You didn't overcome fear. You waited it out. And that's all it takes.",
      action: "Now engage. Make eye contact. Speak first. You'll notice your voice is steadier, your thoughts are clearer. This is your natural state returning.",
      mantra: "\"This is what the other side of fear feels like.\""
    }
  ];

  const colorMap = {
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", btn: "bg-rose-600" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", btn: "bg-orange-600" },
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", btn: "bg-amber-600" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", btn: "bg-emerald-600" },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The 90-Second Rule</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Dr. Jill Bolte Taylor discovered that any emotion — including panic — has a physiological
          lifespan of just 90 seconds. After that, you're choosing to keep it going.
        </p>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {stages.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <button
              key={i}
              onClick={() => setStage(i)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                stage === i ? `${c.btn} ${c.border} text-white` : `bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600`
              }`}
            >
              {s.time}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {(() => {
            const s = stages[stage];
            const c = colorMap[s.color];
            return (
              <Card className={`${c.bg} ${c.border}`}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={c.text}>{s.icon}</div>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>{s.time}</div>
                      <h3 className="text-3xl font-black text-white">{s.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-lg">{s.body}</p>

                  <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800">
                    <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2`}>What To Do</div>
                    <p className="text-slate-200 leading-relaxed">{s.action}</p>
                  </div>

                  <div className={`${c.bg} border ${c.border} p-4 rounded-xl text-center`}>
                    <div className="text-xs text-slate-500 uppercase mb-1">Your Mantra</div>
                    <div className={`text-xl font-bold italic ${c.text}`}>{s.mantra}</div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setStage(s => Math.max(s - 1, 0))}
                      disabled={stage === 0}
                      className="px-5 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-semibold disabled:opacity-30 hover:bg-slate-700 transition-all"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setStage(s => Math.min(s + 1, stages.length - 1))}
                      disabled={stage === stages.length - 1}
                      className={`px-5 py-2 ${c.btn} text-white rounded-xl text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-all`}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </Card>
            );
          })()}
        </motion.div>
      </AnimatePresence>

      <Tip>
        The next time you feel anxiety peak, say to yourself: "This is adrenaline. It lasts 90 seconds.
        I just need to not make it worse." That single thought can change everything.
      </Tip>
    </div>
  );
};

// ─── STEP 5: Redirect Toolkit ─────────────────────────────────────────────────

const RedirectStep = () => {
  const [selected, setSelected] = useState(0);

  const tools = [
    {
      title: "The Anchor",
      when: "When mind goes blank or you spiral into your head",
      method: "Feel 5 physical sensations right now: feet on floor, shirt on skin, temperature of air, weight of your hands, sound in the room.",
      why: "Sensory grounding forces your brain out of future-catastrophizing and back into the present moment. You cannot be anxious and fully sensory at the same time.",
      example: "You walk into a party. Mind floods with 'everyone's looking at me'. Stop. Feel your shoes on the floor. Take one breath. Now you're here.",
      icon: <Compass size={24} />,
      color: "rose"
    },
    {
      title: "The Curiosity Switch",
      when: "When self-consciousness peaks and you feel exposed",
      method: "Shift your mental question from 'How am I coming across?' to 'What is this person actually like?'",
      why: "Self-consciousness and curiosity cannot exist simultaneously in the brain. Genuine interest in others is the fastest exit from your own head.",
      example: "You're talking to someone and notice yourself monitoring every word. Ask yourself: 'What's the most interesting thing about this person I don't know yet?'",
      icon: <Eye size={24} />,
      color: "indigo"
    },
    {
      title: "The Reframe",
      when: "Before entering a feared social situation",
      method: "Replace 'I have to perform well here' with 'I'm here to notice one interesting thing.'",
      why: "Performance anxiety comes from high-stakes framing. Lowering the perceived cost removes the threat signal that triggers your amygdala.",
      example: "Before a networking event: instead of 'I need to make connections', try 'I'm just going to find one person who's interesting and talk to them.'",
      icon: <Repeat size={24} />,
      color: "emerald"
    },
    {
      title: "The Vulnerability Drop",
      when: "When anxiety is visibly affecting you and you can't hide it",
      method: "Name it briefly and move on. 'I get weirdly nervous in groups — anyway, what were you saying?' ",
      why: "The moment you name your anxiety openly, its power over you collapses. People respond with warmth, not judgment. Authenticity disarms anxiety.",
      example: "Voice shaking during a conversation: 'Sorry, I always get a bit nervous talking to new people — I'm actually really enjoying this though.'",
      icon: <Heart size={24} />,
      color: "pink"
    }
  ];

  const colorMap = {
    rose: { text: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/20", active: "bg-rose-600 border-rose-400" },
    indigo: { text: "text-indigo-400", bg: "bg-indigo-500/5", border: "border-indigo-500/20", active: "bg-indigo-600 border-indigo-400" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20", active: "bg-emerald-600 border-emerald-400" },
    pink: { text: "text-pink-400", bg: "bg-pink-500/5", border: "border-pink-500/20", active: "bg-pink-600 border-pink-400" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Redirect Toolkit</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Once you've calmed the body, you need to redirect the mind. These four tools break the anxiety loop in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {tools.map((t, i) => {
            const c = colorMap[t.color];
            return (
              <motion.button
                key={i}
                onClick={() => setSelected(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-5 rounded-xl border transition-all ${selected === i ? c.active + ' text-white shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Tool {i + 1}</span>
                <span className="font-bold text-base">{t.title}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {(() => {
                const t = tools[selected];
                const c = colorMap[t.color];
                return (
                  <Card className="bg-slate-900 border-rose-500/40 h-full">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className={c.text}>{t.icon}</div>
                        <div>
                          <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>Use When</div>
                          <p className="text-slate-300 text-sm">{t.when}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">The Method</span>
                        <div className={`${c.bg} border ${c.border} p-4 rounded-lg`}>
                          <p className="text-slate-200 leading-relaxed">{t.method}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Why This Works</span>
                        <p className="text-sm text-slate-300 leading-relaxed">{t.why}</p>
                      </div>

                      <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Real Scenario</span>
                        <p className="text-sm text-slate-200 italic leading-relaxed">{t.example}</p>
                      </div>
                    </div>
                  </Card>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ─── STEP 6: Scenario Simulator ───────────────────────────────────────────────

const ScenarioSimulator = ({ onComplete }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const scenarios = [
    {
      situation: "You walk into a party alone. You don't know anyone. Your heart starts racing the moment you step through the door.",
      options: [
        { text: "Pull out your phone to look busy and wait for someone to approach you.", correct: false, feedback: "This avoidance behaviour signals social anxiety and makes engagement less likely. It also removes your ability to redirect attention outward." },
        { text: "Say to yourself: 'This is adrenaline, it'll pass in 90 seconds' and do one physiological sigh.", correct: true, feedback: "Naming the sensation reduces its power. The breath activates your parasympathetic system. Now you're working WITH your biology, not against it." },
        { text: "Force yourself to talk to the first person you see as fast as possible to 'get it over with'.", correct: false, feedback: "Acting from peak anxiety usually produces stilted, self-conscious interaction. Waiting 90 seconds first means you engage from a calmer baseline." },
        { text: "Leave and tell yourself you'll try again another time.", correct: false, feedback: "Every avoidance teaches your nervous system that the situation IS dangerous. This makes it worse next time. The 90-second rule exists for this exact moment." }
      ]
    },
    {
      situation: "You're in a group conversation and you want to contribute something. But every time you're about to speak, someone else does. You feel invisible and start to overthink.",
      options: [
        { text: "Keep waiting for the 'perfect moment' that never comes and say nothing.", correct: false, feedback: "Perfect moments don't exist in group conversations. Waiting amplifies self-consciousness and trains inaction." },
        { text: "Raise your voice slightly to cut in, even mid-sentence.", correct: false, feedback: "This can work, but without a calm baseline it often comes out too aggressive or too apologetic. Body regulation comes first." },
        { text: "Apply The Curiosity Switch — shift from 'when can I speak' to 'what are they actually saying' and find a genuine thread.", correct: true, feedback: "When you're genuinely listening, the right moment to contribute appears naturally. You also come across as engaged, not nervous." },
        { text: "Leave the group and find a one-on-one conversation instead.", correct: false, feedback: "This is a valid strategy, but it's avoidance if done from anxiety. Applied from calmness, it's smart. Know which one you're doing." }
      ]
    },
    {
      situation: "You can feel your hands shaking slightly while talking to someone you find intimidating. You're convinced they can see it and are judging you.",
      options: [
        { text: "Abruptly end the conversation to hide it.", correct: false, feedback: "Avoidance confirms to your brain that the situation was a real threat. The shaking will be worse next time." },
        { text: "Over-explain your nervousness in detail, apologizing repeatedly.", correct: false, feedback: "Over-explanation makes the other person more aware, not less. It also signals low self-trust, which is contagious." },
        { text: "Use The Anchor: feel your feet on the ground and take a subtle slow exhale to self-regulate.", correct: true, feedback: "Sensory grounding pulls you out of self-monitoring and back into presence. The shaking reduces naturally as adrenaline clears." },
        { text: "Say lightly: 'I always get a bit nervous — anyway, I was saying...' and continue.", correct: true, feedback: "The Vulnerability Drop works here too. Naming it openly takes its power away. Both this and The Anchor are strong choices." }
      ]
    }
  ];

  const current = scenarios[scenarioIdx];

  const choose = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setRevealed(true);
    if (current.options[idx].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (scenarioIdx < scenarios.length - 1) {
      setScenarioIdx(i => i + 1);
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
        <div className="inline-flex p-8 bg-rose-500/10 rounded-full">
          <Trophy className="text-rose-400" size={64} />
        </div>
        <h3 className="text-3xl font-black text-white">Scenarios Complete</h3>
        <p className="text-slate-300 text-lg">You chose the regulated response {score} out of {scenarios.length} times.</p>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {score === scenarios.length
            ? "You're internalizing the framework. The more you practice the logic, the faster it becomes instinct."
            : "The responses you missed reveal where your default patterns still pull toward avoidance. That awareness is the first step to changing them."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="text-xs text-slate-500 uppercase tracking-widest">Scenario {scenarioIdx + 1} of {scenarios.length}</div>
        <h2 className="text-4xl font-black text-white">Real-Time Decision Lab</h2>
        <p className="text-slate-400">What would you actually do?</p>
      </div>

      <Card className="bg-gradient-to-br from-rose-900/20 to-slate-900 border-rose-400/30">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-rose-400 shrink-0 mt-1" size={24} />
          <p className="text-lg text-slate-200 leading-relaxed">{current.situation}</p>
        </div>
      </Card>

      <div className="space-y-3">
        {current.options.map((opt, i) => {
          let borderClass = "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700";
          if (revealed) {
            if (opt.correct) borderClass = "border-emerald-500 bg-emerald-500/10 text-white";
            else if (chosen === i) borderClass = "border-red-500 bg-red-500/10 text-red-200";
            else borderClass = "border-slate-800 bg-slate-900/30 text-slate-500 opacity-50";
          }

          return (
            <motion.div key={i} whileTap={{ scale: 0.99 }}>
              <button
                onClick={() => choose(i)}
                className={`w-full text-left p-5 rounded-xl border transition-all ${borderClass}`}
              >
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
                    {revealed && chosen === i && !opt.correct && (
                      <p className="text-sm text-red-300 mt-2 leading-relaxed">{opt.feedback}</p>
                    )}
                    {revealed && opt.correct && (
                      <p className="text-sm text-emerald-300 mt-2 leading-relaxed">{opt.feedback}</p>
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
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            {scenarioIdx < scenarios.length - 1 ? "Next Scenario" : "See Results"} <ArrowRight size={18} />
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
      className="inline-block p-8 bg-gradient-to-br from-rose-600 to-pink-600 rounded-full text-white mb-2 shadow-3xl shadow-rose-500/50"
    >
      <Shield size={80} />
    </motion.div>

    <div className="space-y-4">
      <h2 className="text-5xl sm:text-6xl font-black text-white">Fear Regulated.</h2>
      <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
        You haven't eliminated anxiety — you've learned to work <span className="text-rose-400 font-bold">with</span> it.
        That's not just better. It's the only thing that actually works.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <Card className="bg-rose-500/5 border-rose-500/30">
        <div className="text-3xl font-black text-rose-400 mb-2">12</div>
        <div className="text-sm text-slate-300">Fear signals decoded</div>
      </Card>
      <Card className="bg-pink-500/5 border-pink-500/30">
        <div className="text-3xl font-black text-pink-400 mb-2">3</div>
        <div className="text-sm text-slate-300">Breathing tools you can use right now</div>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/30">
        <div className="text-3xl font-black text-emerald-400 mb-2">90s</div>
        <div className="text-sm text-slate-300">The only window you need to survive</div>
      </Card>
    </div>

    <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30 text-left">
      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 uppercase text-sm">
        <Flame size={18} /> The 7-Day Challenge
      </h4>
      <div className="space-y-3 text-slate-300">
        <p className="leading-relaxed">
          For the next 7 days, pick one small social situation daily that triggers mild anxiety. Apply the 90-second rule:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="text-emerald-400">→</span> Name the sensation: <span className="font-semibold text-white">"This is adrenaline."</span></li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> Do one <span className="font-semibold text-white">Physiological Sigh</span></li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> Apply <span className="font-semibold text-white">The Curiosity Switch</span> and engage</li>
        </ul>
        <p className="text-sm italic text-slate-400 pt-2 border-t border-slate-800">
          Start absurdly small. Ordering coffee. Saying hi to a neighbour. Each win rewires your nervous system's threat map.
        </p>
      </div>
    </Card>

    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">What You've Mastered</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm">
        {[
          "The neuroscience of the fear response — why it's not your fault",
          "Your personal fear signal map: body, mind, and behaviour",
          "Three physiology-backed breathing tools for instant calm",
          "The 90-second rule and how to survive the anxiety peak",
          "Four real-time redirect tools that break the anxiety loop",
          "How to name anxiety openly without it destroying you"
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <CheckCircle2 className="text-rose-400 shrink-0 mt-0.5" size={16} />
            <span className="text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 group mt-8"
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
    <div className={`min-h-screen ${THEME.background} text-slate-100 font-sans selection:bg-rose-500/40`}>
      <ProgressBar current={step} total={totalSteps} />

      <main className="pt-32 pb-32 px-6 sm:px-12 relative z-10">
        {/* Background Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            {step === 2 && <FearMapStep />}
            {step === 3 && <BreathingLab />}
            {step === 4 && <NinetySecondStep />}
            {step === 5 && <RedirectStep />}
            {step === 6 && <ScenarioSimulator onComplete={nextStep} />}
            {step === 7 && <ClosingStep />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
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
              className={`flex-1 flex items-center justify-center gap-3 py-6 bg-gradient-to-r ${THEME.gradient} text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50`}
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