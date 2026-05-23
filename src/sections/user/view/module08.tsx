import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, Wind, Shield, AlertCircle, CheckCircle2,
  ArrowRight, ArrowLeft, Trophy, Lightbulb, RefreshCcw,
  Flame, Eye, Timer, Repeat, ChevronRight, Quote,
  RotateCcw, Shuffle, TrendingUp, MessageSquare,
  Pause, Radio, Lock, Unlock, Volume2, Ghost,
  Cpu, Sparkles, Target, Activity, Layers, XCircle,
  SkipForward, BookOpen, Compass, Search, X, Check
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEME = {
  background: "bg-gradient-to-br from-slate-900 via-cyan-900/15 to-slate-950",
  card: "bg-slate-800/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl",
  accent: "text-cyan-400",
  gradient: "from-cyan-500 to-teal-600"
};

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-cyan-900/50 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 px-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-cyan-400" />
        <span className="font-bold text-slate-200 hidden sm:block uppercase tracking-widest text-xs">Overcoming Overthinking</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-md">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded">STAGE {current}/{total}</span>
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
  <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex gap-3 items-start">
    <Lightbulb className="text-cyan-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-slate-400 leading-relaxed italic">{children}</div>
  </div>
);

const Warning = ({ children }) => (
  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3 items-start">
    <AlertCircle className="text-amber-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-amber-200 leading-relaxed font-medium">{children}</div>
  </div>
);

// ─── STEP 1: Intro ────────────────────────────────────────────────────────────

const IntroStep = () => (
  <div className="space-y-12 max-w-4xl mx-auto py-10">
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      className="inline-flex p-6 bg-cyan-500/10 rounded-3xl text-cyan-400 mb-4 shadow-2xl shadow-cyan-500/20 mx-auto"
    >
      <Brain size={64} />
    </motion.div>

    <div className="space-y-6 text-center">
      <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-slate-500 bg-clip-text text-transparent">
        The Loop is a Lie.
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        3am. You're replaying a conversation from four days ago. Editing your words.
        Rewriting what they meant. Building an airtight case for why they hate you now.
        This isn't thinking. This is your brain running a{' '}
        <span className="text-cyan-400 font-bold">broken program on a loop</span> —
        and calling it problem-solving.
      </p>
      <p className="text-lg text-slate-400 max-w-xl mx-auto">
        In this module, you'll understand why the overthinking loop exists, learn to
        recognize when you're in it, and build the exact tools to{' '}
        <span className="text-white font-semibold">shut it down before it consumes your night</span>.
      </p>
    </div>

    <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border-cyan-400/30">
      <div className="flex items-start gap-4 mb-6">
        <Cpu className="text-cyan-400 shrink-0" size={28} />
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Why Overthinking Feels Like Thinking</h3>
          <p className="text-slate-300 leading-relaxed">
            Your brain's default mode network — the system responsible for self-referential thought —
            activates during quiet moments and begins replaying social interactions for what it calls
            <span className="text-cyan-300 font-semibold"> threat assessment</span>. It's scanning for
            danger retroactively. The cruel irony: the more you engage with it, the more convinced it
            becomes there's a real threat to assess. You're not solving anything.
            You're <span className="text-white font-semibold">feeding it evidence that danger exists</span>.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-3xl font-black text-cyan-400 mb-1">73%</div>
          <div className="text-xs text-slate-400">of overthinkers believe replaying conversations helps them prepare — it doesn't</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-teal-400 mb-1">2hrs</div>
          <div className="text-xs text-slate-400">average time socially anxious people spend replaying single interactions</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">0%</div>
          <div className="text-xs text-slate-400">of past conversations have ever been changed by replaying them</div>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          icon: <Search size={24} />,
          label: "Recognize the Loop",
          desc: "Identify the exact thought patterns that signal you've left reality and entered the replay.",
          power: "You can't exit a loop you haven't identified"
        },
        {
          icon: <XCircle size={24} />,
          label: "Break the Loop",
          desc: "Use pattern-interrupts that physically and cognitively stop the replay mid-cycle.",
          power: "Interruption is more powerful than willpower — you can't think your way out of overthinking"
        },
        {
          icon: <SkipForward size={24} />,
          label: "Replace the Loop",
          desc: "Substitute the replay with structured processes that actually resolve the underlying anxiety.",
          power: "Emptying the mind doesn't work. Redirecting it does."
        }
      ].map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="text-left border-cyan-500/10 hover:border-cyan-500/40 transition-all h-full">
            <div className="text-cyan-400 mb-3">{item.icon}</div>
            <p className="font-bold text-white text-lg mb-2">{item.label}</p>
            <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-cyan-300 italic">⚡ {item.power}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    <Tip>
      Overthinking is not a character flaw. It's a misfiring threat-detection system with no
      off switch — until now. This module gives you the switch.
    </Tip>
  </div>
);

// ─── STEP 2: The Loop Anatomy ─────────────────────────────────────────────────

const LoopAnatomyStep = () => {
  const [active, setActive] = useState(0);

  const nodes = [
    {
      id: "trigger",
      label: "Trigger Event",
      color: "cyan",
      icon: <Zap size={20} />,
      title: "The Inciting Moment",
      what: "Something happens in a social situation that your anxiety flags as potentially threatening. A pause before someone replied. A joke that didn't land. An ambiguous expression on someone's face. A conversation that ended too quickly.",
      key: "It doesn't have to be objectively bad — it just has to be ambiguous. Ambiguity is overthinking's fuel.",
      signal: "\"Did that come across wrong?\" / \"Why did they look like that?\"",
      truth: "Ambiguous situations are not evidence of a problem. They're just ambiguous."
    },
    {
      id: "replay",
      label: "The Replay",
      color: "blue",
      icon: <Repeat size={20} />,
      title: "Frame-by-Frame Review",
      what: "Your brain begins rewinding the interaction and replaying it in slow motion. Each viewing is subtly edited — the interpretation gets darker, the flaws get louder, the evidence for the worst-case scenario accumulates.",
      key: "Memory is not a recording. It is reconstructive. Every replay distorts the event slightly toward your emotional state at the time of replay.",
      signal: "\"And then I said... and then they said... but what did they mean when...\"",
      truth: "The version in your head is not what happened. It is what anxiety says happened."
    },
    {
      id: "editing",
      label: "The Re-edit",
      color: "purple",
      icon: <Activity size={20} />,
      title: "Alternative Universe Construction",
      what: "You start writing better versions of the conversation. What you should have said. How you should have responded. The perfect comeback that would have changed everything. This feels productive but is neurologically equivalent to going in circles.",
      key: "Re-editing the past trains your brain to treat imperfection as danger. Every 'what I should have said' reinforces the belief that what you did say was catastrophically wrong.",
      signal: "\"I should have said... If only I'd said... Why didn't I just say...\"",
      truth: "The other version of events exists only in your head and serves only your anxiety."
    },
    {
      id: "verdict",
      label: "The Verdict",
      color: "rose",
      icon: <Target size={20} />,
      title: "Worst-Case Conclusion",
      what: "After enough replays and re-edits, your brain arrives at a conclusion — usually the worst possible interpretation. They think you're awkward. The relationship is damaged. You've confirmed you're bad at this. This verdict feels like clarity but is actually catastrophizing.",
      key: "The verdict feels like you've 'figured something out' — which is why the loop feels productive. You haven't figured anything out. You've built a convincing fiction.",
      signal: "\"I've ruined it.\" / \"They definitely think I'm weird now.\" / \"This is proof I can't do this.\"",
      truth: "A verdict built from distorted replays and imagined alternatives has no evidentiary value."
    },
    {
      id: "refuel",
      label: "The Refuel",
      color: "amber",
      icon: <Radio size={20} />,
      title: "Why It Keeps Going",
      what: "The verdict triggers more anxiety, which triggers more replaying, which produces more evidence for the verdict. The loop feeds itself. Each cycle feels more urgent than the last because your threat-detection system is now fully activated.",
      key: "This is not thinking. This is your brain's fire alarm going off in an empty building — and you keep pressing the test button to see if it's working.",
      signal: "\"Wait, but also remember when... and there was that other time... this is a pattern...\"",
      truth: "The longer the loop runs, the less accurate it becomes. Time inside the loop is time spent moving further from reality."
    }
  ];

  const colorMap = {
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", btn: "bg-cyan-600 border-cyan-400", dot: "bg-cyan-500" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", btn: "bg-blue-600 border-blue-400", dot: "bg-blue-500" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", btn: "bg-purple-600 border-purple-400", dot: "bg-purple-500" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", btn: "bg-rose-600 border-rose-400", dot: "bg-rose-500" },
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", btn: "bg-amber-600 border-amber-400", dot: "bg-amber-500" },
  };

  const n = nodes[active];
  const c = colorMap[n.color];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Anatomy of the Loop</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Overthinking isn't random. It follows a predictable 5-stage cycle.
          Know the cycle, and you can interrupt it at any point.
        </p>
      </div>

      {/* Visual loop diagram */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {nodes.map((node, i) => {
          const nc = colorMap[node.color];
          return (
            <React.Fragment key={i}>
              <button
                onClick={() => setActive(i)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all ${active === i ? `${nc.btn} text-white` : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
              >
                <div className={active === i ? 'text-white' : nc.text}>{node.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">{node.label}</span>
              </button>
              {i < nodes.length - 1 && <ArrowRight className="text-slate-700 shrink-0" size={14} />}
            </React.Fragment>
          );
        })}
        <ArrowRight className="text-slate-700 shrink-0" size={14} />
        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wide px-2">↺ Loop</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
          <Card className={`${c.bg} ${c.border}`}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={c.text}>{n.icon}</div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>Stage {active + 1} of 5</div>
                  <h3 className="text-3xl font-black text-white">{n.title}</h3>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-lg">{n.what}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800">
                  <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2`}>The Critical Insight</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{n.key}</p>
                </div>
                <div className={`${c.bg} border ${c.border} p-5 rounded-xl`}>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Sounds Like</div>
                  <p className="text-slate-200 text-sm italic leading-relaxed">{n.signal}</p>
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase mb-1">The Truth</div>
                  <p className="text-sm text-emerald-200 leading-relaxed">{n.truth}</p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => setActive(s => Math.max(s - 1, 0))} disabled={active === 0}
                  className="px-5 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-semibold disabled:opacity-30 hover:bg-slate-700 transition-all">← Previous</button>
                <button onClick={() => setActive(s => Math.min(s + 1, nodes.length - 1))} disabled={active === nodes.length - 1}
                  className={`px-5 py-2 text-white rounded-xl text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-all ${c.btn.split(' ')[0]}`}>Next →</button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Tip>
        You can interrupt the loop at any stage — not just at the beginning. Even if you're deep in the
        Verdict or Refuel phase, the tools in this module work. It's never too late to exit.
      </Tip>
    </div>
  );
};

// ─── STEP 3: The Pattern Interrupt Lab ───────────────────────────────────────

const InterruptLabStep = () => {
  const [selected, setSelected] = useState(0);

  const interrupts = [
    {
      title: "The Hard Stop",
      when: "The moment you notice the loop starting",
      speed: "Instant",
      color: "cyan",
      icon: <XCircle size={22} />,
      steps: [
        "Say out loud or in your head: \"STOP.\" One word. Firm.",
        "Stand up physically if you're sitting — change your body position.",
        "Name what's happening: \"I am overthinking. This is the loop. It is not real.\"",
        "Do 10 seconds of physical movement — walk, shake out your hands, stretch."
      ],
      why: "The pattern interrupt has to be physical, not just cognitive. Anxiety lives in the body. You can't think your way out of a physical state — you have to move out of it.",
      note: "This feels uncomfortable the first few times because your brain expects to keep replaying. That resistance is the loop fighting back. Push through it."
    },
    {
      title: "The 5-4-3-2-1 Anchor",
      when: "When the loop has taken hold and won't let go",
      speed: "~60 seconds",
      color: "teal",
      icon: <Compass size={22} />,
      steps: [
        "Name 5 things you can see right now in the room.",
        "Name 4 things you can physically feel (fabric, temperature, weight).",
        "Name 3 things you can hear in the environment.",
        "Name 2 things you can smell or taste.",
        "Take 1 slow breath and notice: you are here, not in the replay."
      ],
      why: "Sensory grounding forces your brain's attention out of the past (the replay) and into the present moment. The overthinking loop requires your attention to run. Remove your attention and it starves.",
      note: "This works even in public — you can do this sitting at a table, on public transport, or in bed at night without anyone noticing."
    },
    {
      title: "The Scheduled Worry Window",
      when: "When the loop is persistent and keeps returning",
      speed: "Ongoing strategy",
      color: "blue",
      icon: <Timer size={22} />,
      steps: [
        "Set a specific 15-minute window each day — ideally early evening, never before bed.",
        "When the loop starts outside this window: \"Not now. I'll think about this at 6pm.\"",
        "Write the thought down so your brain knows it won't be lost.",
        "At 6pm, review your list. Most items will feel significantly smaller or irrelevant.",
        "Process only during the window. When time is up, close it."
      ],
      why: "Your brain resists abandoning worrying thoughts because it treats them as unresolved threats. Scheduling them removes the urgency without requiring you to suppress them — which never works anyway.",
      note: "Research by Borkovec shows that scheduled worry windows reduce intrusive thoughts by up to 35% within one week."
    },
    {
      title: "The Reality Test",
      when: "When you've arrived at a catastrophic verdict",
      speed: "5–10 minutes",
      color: "purple",
      icon: <Search size={22} />,
      steps: [
        "Write down the exact verdict your loop is proposing. \"They think I'm annoying.\"",
        "List the actual evidence FOR this (only observable facts, not interpretations).",
        "List the actual evidence AGAINST this (only observable facts).",
        "Ask: \"If a friend told me this story, what would I actually believe?\"",
        "Write a balanced alternative: the most realistic interpretation of events."
      ],
      why: "The loop treats its conclusions as facts. The Reality Test forces your brain to submit its verdict to actual evidence. Almost always, the evidence is thin or absent — and your brain knows it once it's forced to look.",
      note: "Don't do this IN your head. Write it down. Externalizing the thoughts breaks the internal echo chamber that keeps them amplifying."
    },
    {
      title: "The Compassion Reframe",
      when: "When self-criticism is driving the loop",
      speed: "2–3 minutes",
      color: "rose",
      icon: <Sparkles size={22} />,
      steps: [
        "Identify the core shame statement: \"I was so awkward.\" \"I always do this.\"",
        "Ask: \"Would I say this to someone I care about who did the same thing?\"",
        "Write what you would actually say to them — using that exact tone.",
        "Read it back, but addressed to yourself. Out loud if possible.",
        "End with: \"It happened. It's done. I don't have to punish myself for it.\""
      ],
      why: "Overthinking is often self-criticism wearing the mask of analysis. Self-compassion is not weakness or letting yourself off the hook — it's scientifically the most effective way to motivate behavioural change and reduce repetitive negative thought.",
      note: "Research by Kristin Neff shows self-compassion reduces rumination more effectively than self-esteem building or positive self-talk."
    }
  ];

  const colorMap = {
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", active: "bg-cyan-600 border-cyan-400" },
    teal: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", active: "bg-teal-600 border-teal-400" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", active: "bg-blue-600 border-blue-400" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", active: "bg-purple-600 border-purple-400" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", active: "bg-rose-600 border-rose-400" },
  };

  const item = interrupts[selected];
  const c = colorMap[item.color];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Pattern Interrupt Lab</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Five evidence-based techniques for breaking the loop — each suited to a different
          stage of severity. Match the interrupt to the moment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {interrupts.map((t, i) => {
            const ic = colorMap[t.color];
            return (
              <motion.button key={i} onClick={() => setSelected(i)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-5 rounded-xl border transition-all ${selected === i ? `${ic.active} text-white shadow-lg` : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={selected === i ? 'text-white' : ic.text}>{t.icon}</div>
                  <span className="text-[10px] font-bold uppercase opacity-60">{t.speed}</span>
                </div>
                <span className="font-bold text-base block">{t.title}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={selected} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="bg-slate-900 border-cyan-500/30 h-full">
                <div className="space-y-5">
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>Use When</div>
                    <p className="text-slate-300 text-sm">{item.when}</p>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">The Steps</div>
                    <div className="space-y-2">
                      {item.steps.map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                          className="flex gap-3 items-start p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                          <div className={`w-6 h-6 rounded-full ${c.bg} border ${c.border} flex items-center justify-center shrink-0 mt-0.5`}>
                            <span className={`text-[10px] font-black ${c.text}`}>{i + 1}</span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className={`${c.bg} border ${c.border} p-4 rounded-xl`}>
                    <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2`}>Why It Works</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.why}</p>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-start gap-2">
                    <Lightbulb className="text-amber-400 shrink-0 mt-0.5" size={15} />
                    <p className="text-xs text-amber-200 italic leading-relaxed">{item.note}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ─── STEP 4: The Distortion Decoder ──────────────────────────────────────────

const DistortionStep = () => {
  const [flipped, setFlipped] = useState([]);

  const toggle = (i) => setFlipped(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const distortions = [
    {
      name: "Mind Reading",
      example: "\"They went quiet because they were bored of me.\"",
      reality: "People go quiet for hundreds of reasons — distraction, their own anxiety, thinking, looking at something. Their silence is data about their internal state, which you have zero access to. You are not psychic.",
      reframe: "\"I noticed they went quiet. I don't know why. That's all I actually know.\"",
      color: "cyan"
    },
    {
      name: "Fortune Telling",
      example: "\"They're going to think about this and decide they don't like me.\"",
      reality: "You are predicting a future based on a distorted past. You don't know what they'll think. Most people spend very little time thinking about other people's behaviour — they're too busy thinking about their own.",
      reframe: "\"I don't know what they'll think. Most likely they've moved on and so should I.\"",
      color: "blue"
    },
    {
      name: "Catastrophising",
      example: "\"That awkward pause has probably ruined everything.\"",
      reality: "One awkward pause in a social interaction carries approximately zero weight in how people form lasting impressions. You are assigning catastrophic significance to a moment that the other person has almost certainly forgotten.",
      reframe: "\"An awkward pause happened. It's a normal part of human interaction. It means nothing.\"",
      color: "purple"
    },
    {
      name: "Emotional Reasoning",
      example: "\"I feel embarrassed, so something embarrassing must have happened.\"",
      reality: "Feelings are not facts. You can feel embarrassed about something that was objectively fine. Your emotional state is generated by your anxiety, not by an accurate reading of the social situation.",
      reframe: "\"I feel embarrassed. That's my anxiety talking — not a verdict on what actually happened.\"",
      color: "rose"
    },
    {
      name: "Personalisation",
      example: "\"Their weird mood is definitely because of something I did.\"",
      reality: "People's moods are caused by hundreds of factors in their lives that have nothing to do with you. You are making yourself the protagonist of a story you're not even in.",
      reframe: "\"They seemed off. That's about them, not me. I am not the centre of their universe.\"",
      color: "amber"
    },
    {
      name: "Should Statements",
      example: "\"I should have been funnier. I should have said something smarter.\"",
      reality: "Should statements compare your actual self to an idealised version that doesn't exist under real social conditions with real anxiety. Every 'should' is a vote that you are not allowed to be human.",
      reframe: "\"I did what I was capable of in that moment. That is always enough.\"",
      color: "teal"
    }
  ];

  const colorMap = {
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    teal: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Distortion Decoder</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The loop doesn't just replay events — it distorts them through cognitive patterns
          that are clinically documented and completely predictable. Tap each one to see the truth beneath it.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-cyan-900/10 border-cyan-400/20">
        <div className="flex items-start gap-4">
          <Quote className="text-cyan-400 shrink-0" size={32} />
          <div>
            <p className="text-slate-200 text-lg italic mb-2">
              "The mind is a superb instrument if used rightly. Used wrongly, however, it becomes very destructive."
            </p>
            <p className="text-slate-400 text-sm">— Eckhart Tolle, on the thinking mind in overdrive</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {distortions.map((d, i) => {
          const c = colorMap[d.color];
          const isFlipped = flipped.includes(i);
          return (
            <motion.div key={i} layout onClick={() => toggle(i)}
              className={`rounded-2xl border cursor-pointer transition-all overflow-hidden ${isFlipped ? `bg-slate-900 ${c.border}` : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className={`text-xs font-black uppercase tracking-widest ${c.text} mb-1`}>{d.name}</div>
                    <p className="text-slate-300 text-sm italic leading-relaxed">{d.example}</p>
                  </div>
                  <ChevronRight className={`shrink-0 text-slate-500 transition-transform mt-1 ${isFlipped ? 'rotate-90' : ''}`} size={18} />
                </div>
                <AnimatePresence>
                  {isFlipped && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">The Reality</div>
                          <p className="text-sm text-slate-300 leading-relaxed">{d.reality}</p>
                        </div>
                        <div className={`${c.bg} border ${c.border} p-3 rounded-lg`}>
                          <div className={`text-[10px] font-bold uppercase ${c.text} mb-1`}>Reframe It As</div>
                          <p className={`text-sm font-medium italic ${c.text}`}>{d.reframe}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Tip>
        You don't need to remember all 6 distortions. You just need to recognize one phrase:
        "Is this what actually happened — or is this what my anxiety is telling me happened?"
        That question alone can interrupt any distortion pattern.
      </Tip>
    </div>
  );
};

// ─── STEP 5: The Letting Go Protocol ─────────────────────────────────────────

const LettingGoStep = () => {
  const [phase, setPhase] = useState(0);
  const [written, setWritten] = useState({ event: '', feeling: '', learned: '', release: '' });
  const [released, setReleased] = useState(false);

  const fields = [
    {
      key: 'event',
      label: "What actually happened",
      placeholder: "Describe only the observable facts — what was said, what was done. No interpretations.",
      hint: "Stick to what you could have filmed with a camera. No mind-reading allowed here.",
      color: "cyan"
    },
    {
      key: 'feeling',
      label: "What I felt — and why it made sense",
      placeholder: "Name the emotion and validate it without judgment. 'I felt embarrassed because I care about how I come across.'",
      hint: "The feeling was real even if the story around it was distorted. Both things can be true.",
      color: "blue"
    },
    {
      key: 'learned',
      label: "What, if anything, I can take forward",
      placeholder: "Is there one specific, actionable thing to do differently — or is there nothing to learn here? Be honest.",
      hint: "If the only 'lesson' is 'be less anxious' or 'be more perfect' — that's not a lesson. That's the loop dressed up as self-improvement.",
      color: "teal"
    },
    {
      key: 'release',
      label: "My release statement",
      placeholder: "Write: 'This is done. I've processed it. I release it.' In your own words.",
      hint: "This isn't toxic positivity. It's a deliberate neurological signal that the loop has been resolved and can be closed.",
      color: "purple"
    }
  ];

  const colors = {
    cyan: { text: "text-cyan-400", border: "border-cyan-500/30", ring: "focus:ring-cyan-500/30" },
    blue: { text: "text-blue-400", border: "border-blue-500/30", ring: "focus:ring-blue-500/30" },
    teal: { text: "text-teal-400", border: "border-teal-500/30", ring: "focus:ring-teal-500/30" },
    purple: { text: "text-purple-400", border: "border-purple-500/30", ring: "focus:ring-purple-500/30" },
  };

  const allFilled = fields.every(f => written[f.key]?.trim().length > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Letting Go Protocol</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The loop persists because the brain believes it hasn't finished processing the event.
          This structured protocol gives it a formal closure — so it stops searching for one.
        </p>
      </div>

      <Warning>
        Do not skip the writing. Doing this in your head defeats the purpose — the loop already
        lives in your head. Writing it down moves it outside of you, where you can actually look at it.
      </Warning>

      {!released ? (
        <div className="space-y-5">
          {fields.map((field, i) => {
            const c = colors[field.color];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-slate-900 border-slate-800">
                  <div className="space-y-3">
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1`}>Step {i + 1}</div>
                      <label className="text-white font-bold text-lg block">{field.label}</label>
                    </div>
                    <textarea
                      rows={3}
                      value={written[field.key]}
                      onChange={e => setWritten(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className={`w-full bg-slate-800/60 border ${c.border} rounded-xl p-4 text-slate-200 placeholder-slate-600 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 ${c.ring} transition-all`}
                    />
                    <p className={`text-xs italic ${c.text} opacity-70`}>{field.hint}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <motion.button
            onClick={() => allFilled && setReleased(true)}
            whileTap={allFilled ? { scale: 0.98 } : {}}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${allFilled ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-xl shadow-cyan-500/20 hover:opacity-90' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
          >
            <Unlock size={22} />
            {allFilled ? 'Complete the Protocol & Release' : 'Complete all four steps to release'}
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 py-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex p-8 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full text-white shadow-2xl shadow-cyan-500/30"
          >
            <Unlock size={64} />
          </motion.div>
          <div>
            <h3 className="text-4xl font-black text-white mb-3">Protocol Complete.</h3>
            <p className="text-slate-300 text-lg max-w-md mx-auto leading-relaxed">
              You've given your brain the closure it was searching for. The loop has been formally resolved.
              Notice if it tries to restart — and if it does, remind it: <span className="text-cyan-400 italic">"This is done. I already processed it."</span>
            </p>
          </div>
          <button
            onClick={() => { setReleased(false); setWritten({ event: '', feeling: '', learned: '', release: '' }); }}
            className="px-8 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={16} /> Process a different thought
          </button>
        </motion.div>
      )}
    </div>
  );
};

// ─── STEP 6: The Overthinking Audit ──────────────────────────────────────────

const AuditStep = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: "trigger",
      q: "When does your overthinking most often start?",
      options: ["Right after a social interaction", "Late at night trying to sleep", "When I have quiet unstructured time", "When something reminded me of the event"]
    },
    {
      id: "duration",
      q: "How long does a typical loop run before you notice it?",
      options: ["Minutes", "An hour or so", "Several hours", "Days"]
    },
    {
      id: "pattern",
      q: "What does your loop focus on most?",
      options: ["What they thought of me", "What I said wrong", "What I should have said instead", "Whether the relationship is now damaged"]
    },
    {
      id: "escape",
      q: "How do you currently try to stop overthinking?",
      options: ["I distract myself with my phone or TV", "I try to logic my way out of it", "I just wait for it to pass", "I talk to someone about it"]
    },
    {
      id: "body",
      q: "What does overthinking feel like physically for you?",
      options: ["Chest tightness and restlessness", "Can't sleep, mind racing", "Exhaustion and heaviness", "Nothing physical — just mental noise"]
    }
  ];

  const insights = {
    trigger: {
      "Right after a social interaction": "The Hard Stop is your most important tool — interrupting before the loop gains momentum.",
      "Late at night trying to sleep": "The Scheduled Worry Window is critical for you. Move the processing to daytime.",
      "When I have quiet unstructured time": "Structure your quiet time. Idle mind = loop fuel. Plan something absorbing.",
      "When something reminded me of the event": "Anchor triggers work well for you — use 5-4-3-2-1 the moment a trigger fires."
    },
    pattern: {
      "What they thought of me": "The Spotlight Illusion is your core distortion. Others think about you far less than you believe.",
      "What I said wrong": "Should Statements drive your loop. The Compassion Reframe is your highest-value tool.",
      "What I should have said instead": "You're stuck in re-editing. The Reality Test will show you the alternative universe isn't needed.",
      "Whether the relationship is now damaged": "Fortune Telling is your dominant pattern. Catastrophising a future that hasn't happened yet."
    }
  };

  const allAnswered = questions.every(q => answers[q.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Your Overthinking Audit</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Everyone's loop has a different shape. Answer these to get a personalised
          picture of your specific pattern — and which tools will work best for you.
        </p>
      </div>

      {!submitted ? (
        <div className="space-y-6">
          {questions.map((q, qi) => (
            <Card key={qi} className="bg-slate-900 border-slate-800">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Question {qi + 1}</div>
                <p className="text-white font-bold text-lg leading-snug">{q.q}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <motion.button key={oi} whileTap={{ scale: 0.99 }} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${answers[q.id] === opt ? 'bg-cyan-600 border-cyan-400 text-white font-semibold' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          <motion.button
            onClick={() => allAnswered && setSubmitted(true)}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${allAnswered ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-xl hover:opacity-90' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
          >
            {allAnswered ? 'See My Personalised Insights →' : 'Answer all questions to continue'}
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border-cyan-400/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="text-cyan-400" size={22} /> Your Loop Profile
            </h3>
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">{q.q}</div>
                  <div className="text-cyan-300 font-semibold text-sm mb-2">→ {answers[q.id]}</div>
                  {insights[q.id]?.[answers[q.id]] && (
                    <p className="text-slate-400 text-sm leading-relaxed italic">{insights[q.id][answers[q.id]]}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/30">
            <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase">
              <CheckCircle2 size={16} /> Your Priority Stack
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Based on your answers, focus on these tools first:</p>
              <div className="space-y-1 mt-2">
                {answers.trigger && <div className="flex gap-2"><span className="text-emerald-400 font-bold">1.</span> <span>For timing: see your trigger insight above</span></div>}
                {answers.duration === "Days" && <div className="flex gap-2"><span className="text-cyan-400 font-bold">→</span> <span>Duration this long means the Letting Go Protocol is essential for you</span></div>}
                {answers.escape === "I try to logic my way out of it" && <div className="flex gap-2"><span className="text-cyan-400 font-bold">→</span> <span>Logical approaches don't work on emotional loops. Physical interrupts (Hard Stop, 5-4-3-2-1) will serve you better</span></div>}
                {answers.body === "Can't sleep, mind racing" && <div className="flex gap-2"><span className="text-cyan-400 font-bold">→</span> <span>Do the Scheduled Worry Window at 6pm. Never process at night</span></div>}
              </div>
            </div>
          </Card>

          <button onClick={() => { setSubmitted(false); setAnswers({}); }}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
            <RotateCcw size={16} /> Retake Audit
          </button>
        </motion.div>
      )}
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
      situation: "It's 2am. You said something in a group chat six hours ago that got zero response. Your brain is now building a case that everyone found it annoying and is talking about you privately.",
      options: [
        { text: "Keep checking the chat to see if anyone has responded, and analyse the read receipts.", correct: false, feedback: "Checking and re-checking is a compulsion that feeds the loop. Each check provides more ambiguous data for your anxiety to distort." },
        { text: "Reconstruct the entire message in your head, rewrite better versions, and agonise over which was worse.", correct: false, feedback: "Re-editing trains your brain that the original was catastrophically wrong. It wasn't. It got no response. That's all that happened." },
        { text: "Name the distortion: 'This is mind reading and fortune telling. I don't know what anyone thought. I'm going to sleep.' Use the Hard Stop.", correct: true, feedback: "Naming the distortions removes their authority. The Hard Stop physically breaks the loop. Processing this at 2am produces nothing useful — only more distortion." },
        { text: "Send a follow-up message in the group chat to 'fix' it.", correct: false, feedback: "Acting from the loop usually creates the exact social awkwardness you were afraid of. The message that got no response is almost certainly completely fine." }
      ]
    },
    {
      situation: "You replay a conversation from two days ago and become convinced you came across as desperate or needy. The more you replay it, the more certain you become. You've now edited 12 alternative versions of what you should have said.",
      options: [
        { text: "Replay it one more time to try to figure out definitively whether you were needy.", correct: false, feedback: "There is no 'one more replay' that produces clarity. Each replay is a new distortion of the original event. You will never find certainty inside the loop." },
        { text: "Apply the Reality Test: write down what actually happened, what evidence exists that you were needy, and what the realistic alternative interpretation is.", correct: true, feedback: "The Reality Test forces you to submit the verdict to actual evidence. 'I came across as needy' is an interpretation, not a fact. Written evidence almost always shows the verdict is unfounded." },
        { text: "Text the person and casually try to gauge their response to see if they think you were needy.", correct: false, feedback: "Seeking reassurance from others feeds the loop. Even if they say you were fine, the relief lasts minutes before the loop restarts with 'but maybe they were just being nice'." },
        { text: "Decide you were needy and use it as further evidence that you're bad at social situations.", correct: false, feedback: "Accepting a verdict built from distorted replays and re-edits as factual evidence is how the loop becomes a belief system. It is not evidence of anything." }
      ]
    },
    {
      situation: "You're in bed at 11pm and your brain decides now is the perfect time to replay every socially awkward thing you've done in the last three months, building a case that you are fundamentally unlikeable.",
      options: [
        { text: "Engage with the thoughts and try to figure out which ones are 'real problems' versus 'just anxiety'.", correct: false, feedback: "At 11pm, with your prefrontal cortex fatigued and your threat-detection system on high alert, you will not be able to distinguish real problems from anxiety. You are not in a state to evaluate this." },
        { text: "Try to force yourself to think positive thoughts to counter the negative ones.", correct: false, feedback: "Thought suppression creates a rebound effect. The more you try not to think about something, the more present it becomes. Positive thinking is not an interrupt — it's a battle your anxiety will win." },
        { text: "Write down: 'These thoughts are for tomorrow at 6pm. Tonight is not the time.' Then do the 5-4-3-2-1 grounding exercise.", correct: true, feedback: "Scheduling the worry removes the urgency without requiring suppression. The grounding exercise moves your attention into the present. This is the exact protocol for night-time loops." },
        { text: "Open your phone and scroll social media until you fall asleep.", correct: false, feedback: "Distraction delays the loop, it doesn't resolve it. You'll likely wake up and the loop will restart immediately — often with added anxiety from the late-night screen time." }
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
        <div className="inline-flex p-8 bg-cyan-500/10 rounded-full">
          <Trophy className="text-cyan-400" size={64} />
        </div>
        <h3 className="text-3xl font-black text-white">Scenarios Complete</h3>
        <p className="text-slate-300 text-lg">
          You chose the regulated response <span className="text-cyan-400 font-bold">{score}</span> out of <span className="font-bold text-white">{scenarios.length}</span> times.
        </p>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          {score === scenarios.length
            ? "You're thinking in interrupts, not loops. That's the entire skill. Now practice it in the moments when it's hardest."
            : "The options you missed reveal where the loop's pull is still strongest. That's exactly where to direct your practice."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="text-xs text-slate-500 uppercase tracking-widest">Scenario {idx + 1} of {scenarios.length}</div>
        <h2 className="text-4xl font-black text-white">The Loop Just Started. What Do You Do?</h2>
        <p className="text-slate-400">Apply what you've learned. One right answer per scenario.</p>
      </div>

      <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border-cyan-400/30">
        <div className="flex items-start gap-4">
          <Brain className="text-cyan-400 shrink-0 mt-1" size={24} />
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
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
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
      className="inline-block p-8 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full text-white mb-2 shadow-3xl shadow-cyan-500/50"
    >
      <Trophy size={80} />
    </motion.div>

    <div className="space-y-4">
      <h2 className="text-5xl sm:text-6xl font-black text-white">Loop Broken.</h2>
      <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
        The replay will try again. But now you know what it is, how it works, and exactly
        how to interrupt it. The loop's only power was that you didn't know you could turn it off.{' '}
        <span className="text-cyan-400 font-bold">Now you do.</span>
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <Card className="bg-cyan-500/5 border-cyan-500/30">
        <div className="text-3xl font-black text-cyan-400 mb-2">5</div>
        <div className="text-sm text-slate-300">Pattern interrupts across every severity level</div>
      </Card>
      <Card className="bg-teal-500/5 border-teal-500/30">
        <div className="text-3xl font-black text-teal-400 mb-2">6</div>
        <div className="text-sm text-slate-300">Cognitive distortions you can now name and disarm</div>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/30">
        <div className="text-3xl font-black text-emerald-400 mb-2">1</div>
        <div className="text-sm text-slate-300">Protocol to give your brain the closure it was searching for</div>
      </Card>
    </div>

    <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30 text-left">
      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 uppercase text-sm">
        <Flame size={18} /> The 7-Day Loop Log
      </h4>
      <div className="space-y-3 text-slate-300">
        <p className="leading-relaxed">For the next 7 days, keep a simple log:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="text-emerald-400">→</span> <span className="font-semibold text-white">When it started:</span> Time, situation, what triggered it</li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> <span className="font-semibold text-white">Which interrupt I used:</span> What you applied from this module</li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> <span className="font-semibold text-white">How long until it passed:</span> Note the time, not the story</li>
        </ul>
        <p className="text-sm italic text-slate-400 pt-2 border-t border-slate-800">
          After 7 days, look at the pattern. You'll notice: the loops are getting shorter. Not because the anxiety is gone — because you're getting faster at interrupting it.
        </p>
      </div>
    </Card>

    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">What You've Mastered</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm">
        {[
          "Why overthinking feels like problem-solving — and why it never solves anything",
          "The 5-stage loop cycle and where to interrupt it",
          "Five pattern interrupts matched to different stages and severities",
          "Six cognitive distortions your loop uses and how to dismantle them",
          "The Letting Go Protocol for formal closure of a rumination loop",
          "Your personal loop profile and priority tool stack"
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <CheckCircle2 className="text-cyan-400 shrink-0 mt-0.5" size={16} />
            <span className="text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 group mt-8"
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
    <div className={`min-h-screen ${THEME.background} text-slate-100 font-sans selection:bg-cyan-500/40`}>
      <ProgressBar current={step} total={totalSteps} />

      <main className="pt-32 pb-48 px-6 sm:px-12 relative z-10">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            {step === 2 && <LoopAnatomyStep />}
            {step === 3 && <InterruptLabStep />}
            {step === 4 && <DistortionStep />}
            {step === 5 && <LettingGoStep />}
            {step === 6 && <AuditStep />}
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
              className={`flex-1 flex items-center justify-center gap-3 py-6 bg-gradient-to-r ${THEME.gradient} text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50`}>
              {navLabel()} <ArrowRight size={24} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}