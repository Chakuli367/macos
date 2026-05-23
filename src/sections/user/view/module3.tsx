import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, MessageSquare, Repeat, Activity, Heart, 
  ArrowRight, ArrowLeft, CheckCircle2, AlertCircle,
  Trophy, Lightbulb, UserCircle2, Sparkles, 
  ChevronRight, RefreshCcw, Quote, Compass,
  Layers, Ghost, Flame, Target, Share2, 
  Ear, MessageCircle, FastForward, Link,
  Brain, Users, BookOpen, Timer, Award,
  TrendingUp, Shuffle, Eye, Volume2, MessageSquareText
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';

// --- Global Theme & UI Components ---

const THEME = {
  background: "bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-950",
  card: "bg-slate-800/40 backdrop-blur-md border border-purple-500/20 rounded-2xl",
  accent: "text-purple-400",
  gradient: "from-purple-500 to-indigo-600"
};

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-purple-900/50 p-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        <span className="font-bold text-slate-200 hidden sm:block uppercase tracking-widest text-xs">Module 3: Depth & Momentum</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-md">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-1 rounded">STAGE {current}/{total}</span>
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
  <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl flex gap-3 items-start">
    <Lightbulb className="text-purple-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-slate-400 leading-relaxed italic">{children}</div>
  </div>
);

const Warning = ({ children }) => (
  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 items-start">
    <AlertCircle className="text-red-400 shrink-0 mt-1" size={18} />
    <div className="text-sm text-red-200 leading-relaxed font-medium">{children}</div>
  </div>
);

// --- Steps ---

const IntroStep = () => (
  <div className="space-y-12 max-w-4xl mx-auto py-10">
    <motion.div 
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      className="inline-flex p-6 bg-purple-500/10 rounded-3xl text-purple-400 mb-4 shadow-2xl shadow-purple-500/20 mx-auto"
    >
      <FastForward size={64} />
    </motion.div>
    
    <div className="space-y-6 text-center">
      <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-slate-500 bg-clip-text text-transparent">
        Momentum Mastery.
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Stop acting like an investigator. Start acting like a <span className="text-purple-400 font-bold">partner</span>. Most conversations die because they lack <span className="italic font-semibold text-purple-300">Depth Velocity</span> — the ability to go deeper, faster, without feeling forced.
      </p>
      <p className="text-lg text-slate-400 max-w-xl mx-auto">
        In this module, you'll master the three fundamental techniques that separate forgettable small talk from magnetic conversations that people <span className="text-white font-semibold">remember for weeks</span>.
      </p>
    </div>

    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-400/30">
      <div className="flex items-start gap-4 mb-6">
        <Brain className="text-purple-400 shrink-0" size={28} />
        <div>
          <h3 className="text-xl font-bold text-white mb-2">The Science of Momentum</h3>
          <p className="text-slate-300 leading-relaxed">
            Research shows that conversations typically die within 3-4 exchanges unless one person actively creates <span className="font-semibold text-purple-300">emotional continuity</span>. The problem? Most people rely on questions, which create interrogation energy. The solution? Reflective statements that build bridges, not barriers.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-3xl font-black text-purple-400 mb-1">73%</div>
          <div className="text-xs text-slate-400">of conversations end because someone asks "so what do you do?"</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-indigo-400 mb-1">2.4x</div>
          <div className="text-xs text-slate-400">longer conversations when using reflection vs questions</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">89%</div>
          <div className="text-xs text-slate-400">of people remember how you made them feel, not what you said</div>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { 
          icon: <Repeat size={24}/>, 
          label: "Mirroring", 
          desc: "Reflecting emotional states and energy patterns, not just repeating words.",
          power: "Makes people feel deeply understood at a subconscious level"
        },
        { 
          icon: <Layers size={24}/>, 
          label: "Stacking", 
          desc: "Identifying multiple conversation hooks and weaving them into rich branches.",
          power: "Prevents conversations from becoming linear and predictable"
        },
        { 
          icon: <Link size={24}/>, 
          label: "Bridging", 
          desc: "Transitioning between topics smoothly without awkward pauses or forced pivots.",
          power: "Creates the feeling of effortless flow that characterizes great chemistry"
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="text-left border-purple-500/10 hover:border-purple-500/40 transition-all h-full">
            <div className="text-purple-400 mb-3">{item.icon}</div>
            <p className="font-bold text-white text-lg mb-2">{item.label}</p>
            <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-purple-300 italic">⚡ {item.power}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    <Tip>
      By the end of this module, you'll be able to take any conversation from surface-level to personally meaningful in under 60 seconds — without making the other person feel interrogated or uncomfortable.
    </Tip>
  </div>
);

const ReflectionLab = () => {
  const [selected, setSelected] = useState(0);
  
  const tools = [
    {
      title: "The Emotional Mirror",
      formula: "That sounds [Emotion] + because [Character Read]",
      example: "That sounds exhausting because you're clearly someone who gives 100% to everything you touch.",
      logic: "Validates their character, not just the situation. People crave being seen for WHO they are, not just WHAT they're going through.",
      breakdown: {
        emotion: "exhausting",
        technique: "Character attribution",
        why: "Instead of just acknowledging the feeling, you're making it about their identity as someone who cares deeply"
      },
      avoid: "That sounds hard. How do you manage it?",
      whyBad: "Generic sympathy + question = therapy session, not connection"
    },
    {
      title: "The Cold Read",
      formula: "I bet you're the type of person who...",
      example: "I bet you're the type of person who thrives in chaos but secretly loves a quiet weekend in.",
      logic: "Provokes a reaction. People love being analyzed (if it's positive/neutral). This creates instant intrigue and gives them permission to self-disclose.",
      breakdown: {
        emotion: "curiosity + validation",
        technique: "Dual-nature observation",
        why: "Shows you're paying attention to nuance, not surface details"
      },
      avoid: "Oh yeah? What do you do for fun?",
      whyBad: "Lazy question that makes them do all the work"
    },
    {
      title: "The 'Why' Projection",
      formula: "It seems like you value [X] over [Y]",
      example: "It seems like you value the impact of your work more than just the title on your desk.",
      logic: "Moves from Surface (What) to Depth (Values). This is how you skip small talk entirely.",
      breakdown: {
        emotion: "seen + understood",
        technique: "Value inference",
        why: "You're reading between the lines and reflecting what truly matters to them"
      },
      avoid: "So do you like your job?",
      whyBad: "Binary yes/no question that kills momentum instantly"
    },
    {
      title: "The Energy Match",
      formula: "Reflect their energy level + add slight amplification",
      example: "Wait, that's actually insane! So you just quit and moved to Bali with no backup plan?",
      logic: "Matching energy creates rapport. Slight amplification shows you're engaged and gives them permission to be more expressive.",
      breakdown: {
        emotion: "excitement + validation",
        technique: "Emotional amplification",
        why: "When you match and raise their energy, they feel heard AND energized to continue"
      },
      avoid: "Oh that's cool. What made you do that?",
      whyBad: "Flat affect + question = emotional mismatch that kills their enthusiasm"
    },
    {
      title: "The Pattern Recognition",
      formula: "This reminds me of [Similar pattern in their story]",
      example: "This reminds me of what you said earlier about hating routine — you're someone who needs novelty to feel alive.",
      logic: "Shows you're actively listening across the entire conversation, not just responding to the last thing said.",
      breakdown: {
        emotion: "seen + remembered",
        technique: "Narrative threading",
        why: "Demonstrates you're tracking themes, which makes them feel truly listened to"
      },
      avoid: "Yeah, so what happened next?",
      whyBad: "Shows you're just waiting for your turn to talk, not actively processing"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Reflection Toolkit</h2>
        <p className="text-xl text-slate-300 italic max-w-2xl mx-auto">
          Statements build bridges. Questions build walls. Master these five techniques to become the person everyone wants to talk to.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-purple-900/10 border-purple-400/20">
        <div className="flex items-start gap-4">
          <Quote className="text-purple-400 shrink-0" size={32} />
          <div>
            <p className="text-slate-200 text-lg italic mb-2">
              "People don't remember what you said. They remember how you made them feel understood."
            </p>
            <p className="text-slate-400 text-sm">— The fundamental principle of memorable conversations</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {tools.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-5 rounded-xl border transition-all ${selected === i ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <span className="text-[10px] font-bold uppercase opacity-60 block mb-1">Technique {i+1}</span>
              <span className="font-bold text-base">{t.title}</span>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-900 border-purple-500/40 h-full">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-2">The Formula</span>
                    <p className="text-xl font-mono text-indigo-300 bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/20">
                      {tools[selected].formula}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">In Action</span>
                    <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                      <p className="text-lg italic text-slate-200 mb-3">"{tools[selected].example}"</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-slate-500 uppercase mb-1">Emotion</div>
                          <div className="text-emerald-300 font-semibold">{tools[selected].breakdown.emotion}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 uppercase mb-1">Technique</div>
                          <div className="text-emerald-300 font-semibold">{tools[selected].breakdown.technique}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 uppercase mb-1">Impact</div>
                          <div className="text-emerald-300 font-semibold">Deep Connection</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Why This Works</span>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{tools[selected].logic}</p>
                    <p className="text-xs text-purple-300 italic">{tools[selected].breakdown.why}</p>
                  </div>

                  <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                      <div>
                        <div className="text-xs text-red-300 font-bold uppercase mb-2">Don't Say This Instead:</div>
                        <p className="text-slate-300 italic mb-2">"{tools[selected].avoid}"</p>
                        <p className="text-xs text-slate-400">{tools[selected].whyBad}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Tip>
        Practice one technique per conversation today. Notice how people's body language changes when you reflect instead of question. You'll see their shoulders relax, they'll lean in, and suddenly they're sharing things they didn't plan to say.
      </Tip>
    </div>
  );
};

const MatchingGame = () => {
  const [matches, setMatches] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [wrongMatches, setWrongMatches] = useState({});

  const scenarios = [
    { id: 1, scenario: "I just started learning guitar and I'm terrible at it", response: "There's something humble about being a beginner. That takes guts." },
    { id: 2, scenario: "I hate my job but I can't quit because I need the money", response: "It seems like you value security, but part of you is dying for something more meaningful." },
    { id: 3, scenario: "I'm going to Thailand next month, super excited!", response: "Wait, that's amazing! First time in Southeast Asia or are you chasing something specific there?" },
    { id: 4, scenario: "I've been feeling really lonely since I moved to this city", response: "That's the paradox of new cities — surrounded by millions, but feeling invisible." },
    { id: 5, scenario: "I love running marathons, just finished my 5th one", response: "I bet you're the type who needs a challenge to feel alive, not just maintenance." }
  ];

  const shuffledResponses = [...scenarios].sort(() => Math.random() - 0.5);

  const handleLeftClick = (id) => {
    if (matches[id]) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (responseId) => {
    if (!selectedLeft) return;
    
    const isCorrect = selectedLeft === responseId;
    
    if (isCorrect) {
      setMatches({ ...matches, [selectedLeft]: responseId });
      setSelectedLeft(null);
      
      if (Object.keys(matches).length + 1 === scenarios.length) {
        setTimeout(() => setCompleted(true), 500);
      }
    } else {
      setWrongMatches({ ...wrongMatches, [`${selectedLeft}-${responseId}`]: true });
      setTimeout(() => {
        setWrongMatches({});
        setSelectedLeft(null);
      }, 1000);
    }
  };

  const isMatched = (responseId) => Object.values(matches).includes(responseId);
  const isWrong = (leftId, rightId) => wrongMatches[`${leftId}-${rightId}`];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">Match the Response</h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Connect each statement with the best reflective response. This isn't about being "correct" — it's about recognizing patterns that create depth.
        </p>
      </div>

      {!completed ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare size={16} />
                They Say...
              </div>
              {scenarios.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={matches[item.id]}
                  whileHover={!matches[item.id] ? { scale: 1.02 } : {}}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    matches[item.id] 
                      ? 'bg-emerald-500/20 border-emerald-500/50 opacity-50' 
                      : selectedLeft === item.id 
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg' 
                        : 'bg-slate-900 border-slate-700 hover:border-purple-500/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm leading-relaxed italic">"{item.scenario}"</span>
                    {matches[item.id] && <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquareText size={16} />
                You Respond...
              </div>
              {shuffledResponses.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleRightClick(item.id)}
                  disabled={isMatched(item.id)}
                  whileHover={!isMatched(item.id) ? { scale: 1.02 } : {}}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    isMatched(item.id) 
                      ? 'bg-emerald-500/20 border-emerald-500/50 opacity-50' 
                      : isWrong(selectedLeft, item.id)
                        ? 'bg-red-500/20 border-red-500 animate-shake'
                        : 'bg-slate-900 border-slate-700 hover:border-indigo-500/50 text-slate-300'
                  }`}
                >
                  <span className="text-sm leading-relaxed">{item.response}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
              <Target className="text-purple-400" size={18} />
              <span className="text-slate-300 font-medium">
                {Object.keys(matches).length} / {scenarios.length} matched
              </span>
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 py-12"
        >
          <div className="inline-flex p-8 bg-emerald-500/10 rounded-full">
            <Trophy className="text-emerald-400" size={64} />
          </div>
          <h3 className="text-3xl font-black text-white">Perfect Match!</h3>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            You've identified the key patterns. Notice how each response validates emotion + adds depth, rather than just asking follow-up questions.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const StackingLab = () => {
  const [selectedHook, setSelectedHook] = useState(null);
  const prompt = "I've been **learning to surf** in **Portugal**, it's **terrifying** but I love the **community** there.";
  
  const branches = {
    "learning to surf": {
      depth: "Values & Growth",
      response: "There's something humble about being a beginner at something physically demanding. Did you pick it up to challenge yourself, or just for the fun of it?",
      transition: "Reminds me of when I tried rock climbing—total disaster, but that first success is like a drug.",
      why: "Focuses on their relationship with growth and discomfort, not just the activity itself",
      nextLevel: "What is it about being a beginner that you think appeals to you? Some people hate that feeling."
    },
    "Portugal": {
      depth: "Environment & Lifestyle",
      response: "Portugal has this 'End of the World' energy, especially on the coast. I bet it feels like you're miles away from real life when you're there.",
      transition: "I've always wondered if the slower pace of life there makes it hard to come back to the city.",
      why: "Captures the FEELING of the place, not just geographic facts",
      nextLevel: "Are you someone who thrives in that slower energy, or do you need it as a contrast to your regular chaos?"
    },
    "terrifying": {
      depth: "Fear & Courage",
      response: "That's the thing about doing scary stuff — you're either running toward something or away from something. Sounds like you're chasing the fear intentionally.",
      transition: "I feel that. Sometimes I need to do something that scares me just to feel alive.",
      why: "Acknowledges the emotional complexity rather than dismissing it with 'oh that's normal'",
      nextLevel: "Do you find that you're more yourself when you're uncomfortable, or is that just me projecting?"
    },
    "community": {
      depth: "Connection & Belonging",
      response: "Interesting that you led with 'community' — not the waves, not the travel itself. Sounds like that's what actually matters to you.",
      transition: "I think people underestimate how hard it is to find genuine community as an adult.",
      why: "Highlights a value they might not have realized they revealed, which creates instant depth",
      nextLevel: "What is it about that community specifically? Is it the shared struggle, or something else?"
    }
  };

  const allHooks = Object.keys(branches);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Stacking Method</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Every sentence contains multiple "hooks" — conversation threads you can pull. Beginners grab the first one. Experts see all of them and choose strategically.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-400/30">
        <div className="flex items-start gap-4 mb-6">
          <Layers className="text-purple-400 shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">How Stacking Works</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              When someone speaks, they're giving you multiple conversation threads simultaneously. Most people pick the safest, most obvious one. Great conversationalists scan for the hook that reveals the most about WHO the person is, not just WHAT they're doing.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              The goal: Create the feeling that you "get them" in a way others don't, because you're responding to the subtext, not just the text.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900 border-indigo-500/40">
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-3">The Prompt</span>
          <p 
            className="text-xl text-slate-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: prompt.replace(/\*\*(.*?)\*\*/g, '<span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded font-semibold">$1</span>') }}
          />
        </div>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-sm text-slate-400 mb-4">Click on any highlighted hook to explore that conversation branch:</p>
          <div className="flex flex-wrap gap-2">
            {allHooks.map((hook) => (
              <button
                key={hook}
                onClick={() => setSelectedHook(hook)}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  selectedHook === hook 
                    ? 'bg-purple-600 border-purple-400 text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500/50'
                }`}
              >
                {hook}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {selectedHook && (
          <motion.div
            key={selectedHook}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-slate-900 to-indigo-900/10 border-indigo-500/40">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-indigo-400 uppercase mb-2">Depth Layer</div>
                    <div className="text-2xl font-black text-white">{branches[selectedHook].depth}</div>
                  </div>
                  <div className="px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                    <div className="text-xs text-indigo-300 font-semibold">HOOK: {selectedHook}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-emerald-400 uppercase">Your Response</div>
                    <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                      <p className="text-slate-200 italic leading-relaxed">"{branches[selectedHook].response}"</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Why this works:</span> {branches[selectedHook].why}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-purple-400 uppercase">Transition Path</div>
                    <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/20">
                      <p className="text-slate-200 italic leading-relaxed">"{branches[selectedHook].transition}"</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      This creates connection through <span className="font-semibold text-slate-300">shared vulnerability</span>, not interrogation.
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-bold text-indigo-300 uppercase mb-2">Next Level Move</div>
                  <p className="text-slate-300 italic">"{branches[selectedHook].nextLevel}"</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedHook && (
        <div className="text-center">
          <p className="text-slate-400 italic">Select a hook above to see the depth analysis</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-emerald-300 mb-2 text-sm">Expert Move</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Notice how none of these responses are questions? That's intentional. You're making observations and sharing connections, which invites them to elaborate naturally.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-500/5 border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-400 shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-red-300 mb-2 text-sm">Common Mistake</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Beginners grab the safest hook (Portugal) and ask "Oh cool, how long are you there for?" This keeps the conversation at tourist-guide level instead of human level.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const TransitionMatrix = () => {
  const [selectedTransition, setSelectedTransition] = useState(null);

  const transitions = [
    {
      name: "The Callback",
      description: "Reference something they said 5-10 minutes ago",
      example: "Wait, this reminds me of what you said about hating routine — you're someone who needs unpredictability to feel alive, aren't you?",
      power: "Shows you're actively listening across the entire conversation, not just reacting to the last thing said",
      when: "Use when you want to demonstrate deep attention and create narrative continuity",
      avoid: "Overusing it or calling back to something from 2 seconds ago (that's just repeating)"
    },
    {
      name: "The Assumption Bridge",
      description: "Make a bold (positive) assumption to pivot topics",
      example: "You strike me as someone who's always had a creative side, even if you don't show it at work. Am I off-base?",
      power: "Invites them to correct or confirm, which opens new conversation territory naturally",
      when: "Use when you want to shift topics without it feeling forced",
      avoid: "Making negative assumptions or ones that feel like you're trying too hard to impress"
    },
    {
      name: "The Shared Struggle",
      description: "Find universal human experiences to bridge topics",
      example: "That's the thing about being in your late 20s though, right? Everyone expects you to have it figured out, but most people are just winging it.",
      power: "Creates instant relatability and permission to be more vulnerable",
      when: "Use when conversation feels superficial and you want to go deeper",
      avoid: "Being pessimistic or making it about YOUR struggles instead of the shared human experience"
    },
    {
      name: "The Time-Jump",
      description: "Move the conversation to past or future versions of them",
      example: "Where do you see yourself in this whole journey five years from now? Not the LinkedIn answer — the real one.",
      power: "Bypasses surface-level small talk and gets to their actual values/fears/dreams",
      when: "Use when you've built enough rapport and want to accelerate intimacy",
      avoid: "Using this too early or in a way that feels like a job interview"
    },
    {
      name: "The Contrast Pivot",
      description: "Juxtapose two aspects of their life to create tension",
      example: "It's interesting — you work in finance but all your hobbies are creative. Do you feel like those are two different versions of yourself?",
      power: "Highlights contradictions they might not have articulated, which feels profound",
      when: "Use when you've noticed multiple facets of their identity",
      avoid: "Making them feel judged for inconsistencies"
    },
    {
      name: "The Meta Comment",
      description: "Comment on the conversation itself",
      example: "I feel like we just went from surface-level to 'therapy session' in about 30 seconds. Is that normal for you or did I just unlock something?",
      power: "Creates self-awareness and makes the intimacy itself part of the shared experience",
      when: "Use when the conversation has reached unexpected depth",
      avoid: "Over-explaining or making it awkward by being too analytical"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white">The Transition Matrix</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Great conversations feel effortless because transitions are invisible. Here's how to move between topics without awkward pauses or "so anyway..." moments.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border-indigo-400/30">
        <div className="flex items-start gap-4">
          <Share2 className="text-indigo-400 shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Why Transitions Matter</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              The difference between an awkward conversation and a flowing one isn't about WHAT you say — it's about HOW you move between topics. Bad transitions feel jarring. Good transitions feel inevitable.
            </p>
            <p className="text-slate-400 text-sm">
              Master these six transition techniques and you'll never have another "so... yeah..." moment again.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transitions.map((t, i) => (
          <motion.button
            key={i}
            onClick={() => setSelectedTransition(i)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left p-6 rounded-xl border transition-all ${
              selectedTransition === i 
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-400 shadow-lg shadow-indigo-500/30' 
                : 'bg-slate-900 border-slate-700 hover:border-indigo-500/50'
            }`}
          >
            <div className="text-xs font-bold text-indigo-300 uppercase mb-2">Technique {i + 1}</div>
            <div className="font-bold text-lg text-white mb-2">{t.name}</div>
            <div className="text-sm text-slate-400">{t.description}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTransition !== null && (
          <motion.div
            key={selectedTransition}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-slate-900 to-indigo-900/10 border-indigo-500/40">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{transitions[selectedTransition].name}</h3>
                  <p className="text-slate-400">{transitions[selectedTransition].description}</p>
                </div>

                <div className="bg-emerald-500/5 p-5 rounded-lg border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-400 uppercase mb-2">Example in Action</div>
                  <p className="text-slate-200 text-lg italic leading-relaxed">"{transitions[selectedTransition].example}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-bold text-purple-400 uppercase mb-2">Why This Is Powerful</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{transitions[selectedTransition].power}</p>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-400 uppercase mb-2">When to Use It</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{transitions[selectedTransition].when}</p>
                  </div>
                </div>

                <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-bold text-red-300 uppercase mb-1">Warning</div>
                      <p className="text-slate-300 text-sm">{transitions[selectedTransition].avoid}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTransition === null && (
        <div className="text-center">
          <p className="text-slate-400 italic">Click any transition technique above to see detailed breakdown</p>
        </div>
      )}
    </div>
  );
};

const MomentumSimulator = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const challenges = [
    {
      speaker: "I'm thinking about quitting my job and traveling for a year. Everyone thinks I'm crazy.",
      options: [
        { 
          text: "That sounds exciting! Where are you planning to go?", 
          correct: false, 
          msg: "Too surface-level. You ignored the real hook: 'everyone thinks I'm crazy' — that's where the depth is." 
        },
        { 
          text: "Sounds like you're at a crossroads where what everyone expects from you isn't aligning with what you actually want. That's a lonely place to be.", 
          correct: true, 
          msg: "Perfect. You acknowledged the emotional conflict (external pressure vs internal desire) and validated the difficulty without giving advice." 
        },
        { 
          text: "You should definitely do it! Life's too short to not take risks.", 
          correct: false, 
          msg: "Advice-giving mode. They didn't ask for permission — they're processing conflict. Be a mirror, not a coach." 
        },
        { 
          text: "Why do you think people are saying that?", 
          correct: false, 
          msg: "Question mode. You're making them do all the emotional labor instead of offering a reflection first." 
        }
      ]
    },
    {
      speaker: "I've been feeling really disconnected from my friends lately. Like we're all just... existing next to each other.",
      options: [
        { 
          text: "That's the weird thing about growing up — friendships that used to feel effortless start requiring work, and nobody really teaches you how to navigate that shift.", 
          correct: true, 
          msg: "Excellent. You normalized the feeling (it's not just them) and framed it as a universal life phase transition." 
        },
        { 
          text: "Have you tried reaching out to them more often?", 
          correct: false, 
          msg: "Generic advice that ignores the emotional nuance. They're not asking for solutions — they're sharing a feeling." 
        },
        { 
          text: "Yeah, that happens sometimes. Friendships go through phases.", 
          correct: false, 
          msg: "Dismissive. You minimized their experience instead of validating it." 
        },
        { 
          text: "It sounds like you're someone who craves deep connection, and surface-level interactions drain you more than they energize you.", 
          correct: true, 
          msg: "Great character read. You're making it about their values, not just the circumstance." 
        }
      ]
    },
    {
      speaker: "I keep starting projects and never finishing them. I don't know what's wrong with me.",
      options: [
        { 
          text: "You just need to work on your discipline and set better goals.", 
          correct: false, 
          msg: "Coach mode. They're expressing self-doubt, not asking for a productivity lecture." 
        },
        { 
          text: "Nothing's 'wrong' with you. It sounds like you're more interested in the exploration phase than the execution phase — and that's not a flaw, it's just how you're wired.", 
          correct: true, 
          msg: "Perfect reframe. You validated their pattern while removing the shame they were attaching to it." 
        },
        { 
          text: "What kind of projects are you starting?", 
          correct: false, 
          msg: "Dodging the vulnerability. They just admitted self-criticism — respond to that first." 
        },
        { 
          text: "I bet the chase excites you more than the finish line. You're hunting for something that makes you feel alive, not just checking boxes.", 
          correct: true, 
          msg: "Excellent cold read. You're giving them language for something they felt but couldn't articulate." 
        }
      ]
    },
    {
      speaker: "I just got promoted, but honestly? I feel like I'm faking my way through it. Like everyone's going to realize I don't know what I'm doing.",
      options: [
        { 
          text: "Congrats on the promotion! I'm sure you'll figure it out.", 
          correct: false, 
          msg: "You completely ignored the vulnerability. They're experiencing imposter syndrome and you gave them a LinkedIn comment." 
        },
        { 
          text: "That's imposter syndrome. It's super common, you're fine.", 
          correct: false, 
          msg: "Labeling without connecting. Saying 'it's normal' doesn't make them feel seen — it makes them feel generic." 
        },
        { 
          text: "The people who are actually faking it never worry about whether they're faking it. The fact that you're questioning yourself means you care about being legitimate — that's the opposite of a fraud.", 
          correct: true, 
          msg: "Brilliant reframe. You turned their fear into evidence of their integrity." 
        },
        { 
          text: "Sounds like you value competence and authenticity, and right now you're in a space where you can't fully deliver on both. That gap is stressful.", 
          correct: true, 
          msg: "Excellent values-based reflection. You're naming the internal conflict instead of dismissing it." 
        }
      ]
    },
    {
      speaker: "I've been traveling solo for three months now. Best decision I ever made, but I'd be lying if I said I don't feel lonely sometimes.",
      options: [
        { 
          text: "Solo travel is incredible for self-discovery. Where have you been so far?", 
          correct: false, 
          msg: "You acknowledged the positive but ignored the vulnerability. They're trusting you with the lonely part — honor that." 
        },
        { 
          text: "That's the paradox of solo travel — you're surrounded by new experiences, but you have no one to process them with. That loneliness hits different than just being alone at home.", 
          correct: true, 
          msg: "Expert level. You acknowledged the loneliness and articulated WHY it's uniquely difficult, which shows deep understanding." 
        },
        { 
          text: "Oh, solo travel is great! You should try to find some hostels to meet people.", 
          correct: false, 
          msg: "Advice-giving mode. They're not asking for solutions — they're sharing a complex emotional truth." 
        },
        { 
          text: "It sounds like you're someone who needs both freedom and connection, and right now you've chosen freedom at the expense of the other. That trade-off is heavier than people realize.", 
          correct: true, 
          msg: "Perfect. You named the trade-off they're wrestling with and validated that it's genuinely difficult." 
        }
      ]
    }
  ];

  const handleChoice = (opt) => {
    setFeedback(opt);
    setTimeout(() => {
      if (opt.correct) {
        if (stage < challenges.length - 1) {
          setStage(s => s + 1);
          setFeedback(null);
        } else {
          onComplete();
        }
      } else {
        setFeedback(null);
      }
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-2xl font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <Ghost size={24} /> Momentum Duel
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-mono text-sm">{stage + 1}/{challenges.length}</span>
          <div className="flex gap-1">
            {challenges.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= stage ? 'bg-purple-400' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
      </div>

      <Card className="bg-slate-900 border-purple-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <MessageCircle size={120} />
        </div>
        <div className="relative z-10 flex gap-6 items-start">
          <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
            <UserCircle2 className="text-white" size={32} />
          </div>
          <div className="space-y-3 flex-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">They confide in you...</span>
            <p className="text-2xl text-slate-100 leading-relaxed italic">"{challenges[stage].speaker}"</p>
            <p className="text-sm text-slate-500">Choose the response that creates depth without advice-giving or interrogation</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {challenges[stage].options.map((opt, i) => (
          <motion.button
            key={i}
            disabled={feedback !== null}
            onClick={() => handleChoice(opt)}
            whileHover={feedback === null ? { scale: 1.01 } : {}}
            className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${
              feedback === opt 
                ? (opt.correct ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20') 
                : 'bg-slate-900 border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span className={`text-base leading-relaxed ${feedback === opt ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'}`}>
                {opt.text}
              </span>
              <div className={`shrink-0 transition-all ${feedback === opt ? 'scale-110' : 'group-hover:translate-x-1'}`}>
                {feedback === opt ? (
                  opt.correct ? <CheckCircle2 className="text-emerald-400" size={24} /> : <AlertCircle className="text-red-400" size={24} />
                ) : (
                  <ChevronRight className="text-slate-600" size={20} />
                )}
              </div>
            </div>
            <AnimatePresence>
              {feedback === opt && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  className="pt-4 mt-4 border-t border-white/10"
                >
                  <div className={`text-sm font-medium leading-relaxed ${opt.correct ? 'text-emerald-100' : 'text-red-100'}`}>
                    {opt.msg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <Tip>
        Notice the pattern: The best responses validate emotion + add insight, without asking questions or giving advice. That's the momentum formula.
      </Tip>
    </div>
  );
};

const ClosingStep = () => (
  <div className="max-w-3xl mx-auto text-center space-y-10 py-12">
    <motion.div 
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="inline-block p-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full text-white mb-2 shadow-3xl shadow-purple-500/50"
    >
      <Trophy size={80} />
    </motion.div>
    
    <div className="space-y-4">
      <h2 className="text-5xl sm:text-6xl font-black text-white">Momentum Unlocked.</h2>
      <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
        You've graduated from <span className="text-red-400 line-through">Interrogator</span> to <span className="text-emerald-400 font-bold">Partner</span>. Depth is no longer a destination — it's a habit you can activate in any conversation.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      <Card className="bg-purple-500/5 border-purple-500/30">
        <div className="text-3xl font-black text-purple-400 mb-2">5</div>
        <div className="text-sm text-slate-300">Reflection techniques mastered</div>
      </Card>
      <Card className="bg-indigo-500/5 border-indigo-500/30">
        <div className="text-3xl font-black text-indigo-400 mb-2">6</div>
        <div className="text-sm text-slate-300">Transition methods learned</div>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/30">
        <div className="text-3xl font-black text-emerald-400 mb-2">∞</div>
        <div className="text-sm text-slate-300">Possibilities unlocked</div>
      </Card>
    </div>

    <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30 text-left">
      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 uppercase text-sm">
        <Flame size={18} /> The 48-Hour Challenge
      </h4>
      <div className="space-y-3 text-slate-300">
        <p className="leading-relaxed">
          For the next 48 hours, <span className="font-bold text-white">ban yourself from asking questions</span> in the first 2 minutes of any conversation. Instead:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="text-emerald-400">→</span> Use a <span className="font-semibold text-white">Cold Read</span> or <span className="font-semibold text-white">Emotional Mirror</span></li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> Stack at least 2 hooks from what they say</li>
          <li className="flex gap-2"><span className="text-emerald-400">→</span> Practice one transition technique per conversation</li>
        </ul>
        <p className="text-sm italic text-slate-400 pt-2 border-t border-slate-800">
          Watch their eyes change when they feel genuinely seen. That's when you'll know you've unlocked it.
        </p>
      </div>
    </Card>

    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">What You've Mastered</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm">
        <div className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <CheckCircle2 className="text-purple-400 shrink-0 mt-0.5" size={16} />
          <span className="text-slate-300">How to reflect emotions instead of interrogating</span>
        </div>
        <div className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <CheckCircle2 className="text-purple-400 shrink-0 mt-0.5" size={16} />
          <span className="text-slate-300">The art of identifying and stacking conversation hooks</span>
        </div>
        <div className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <CheckCircle2 className="text-purple-400 shrink-0 mt-0.5" size={16} />
          <span className="text-slate-300">Six transition techniques for seamless topic flow</span>
        </div>
        <div className="flex gap-3 items-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <CheckCircle2 className="text-purple-400 shrink-0 mt-0.5" size={16} />
          <span className="text-slate-300">How to create depth without making it feel forced</span>
        </div>
      </div>
    </div>
    
    <button 
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 group mt-8"
    >
      <RefreshCcw className="group-hover:rotate-180 transition-transform duration-500" size={24} />
      Finish Module
    </button>
  </div>
);

// --- Main App Controller ---

export default function App() {
  usePortalDriver();
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div className={`min-h-screen ${THEME.background} text-slate-100 font-sans selection:bg-purple-500/40`}>
      <ProgressBar current={step} total={totalSteps} />
      
      <main className="pt-32 pb-32 px-6 sm:px-12 relative z-10">
        {/* Background Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            {step === 2 && <ReflectionLab />}
            {step === 3 && <MatchingGame />}
            {step === 4 && <StackingLab />}
            {step === 5 && <TransitionMatrix />}
            {step === 6 && <MomentumSimulator onComplete={nextStep} />}
            {step === 7 && <MomentumSimulator onComplete={nextStep} />}
            {step === 8 && <ClosingStep />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {step < totalSteps && (
        <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none z-50">
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
              className={`flex-1 flex items-center justify-center gap-3 py-6 bg-gradient-to-r ${THEME.gradient} text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50`}
            >
              {step === 6 || step === 7 ? "CONTINUE TEST" : step === 5 ? "TAKE THE FINAL TEST" : "CONTINUE JOURNEY"}
              <ArrowRight size={24} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}