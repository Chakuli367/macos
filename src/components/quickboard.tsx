import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ListTodo,
  Users,
  Headset,
  ChevronRight,
  Trophy,
  Zap,
  X,
  Loader2,
  AlertCircle,
  Heart,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
  task: string;
  difficulty?: string;
}

// ─── Stub helpers (replace with your real Firebase imports) ───────────────────

const getApiKeys = async (): Promise<string[]> => {
  return [];
};

const userId = "demo-user";

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function QuickBoard() {
  const [showLiveSupportModal, setShowLiveSupportModal] = useState(false);

  return (
    <div className="bg-transparent flex justify-center px-3 py-2">
      <div className="w-full max-w-sm space-y-2">
        <Header />
        <MainAction />
        <ActionButtons onLiveSupportClick={() => setShowLiveSupportModal(true)} />
      </div>

      <AnimatePresence>
        {showLiveSupportModal && (
          <LiveSupportModal onClose={() => setShowLiveSupportModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = () => (
  <div className="text-center space-y-0.5">
    <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">
      Your Progress
    </p>
    <h1 className="text-white text-base font-bold">Today's Focus</h1>
  </div>
);

// ─── Main Action ──────────────────────────────────────────────────────────────

const MainAction = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-3"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 rounded-xl bg-purple-500/20">
        <Zap size={14} className="text-purple-300" />
      </div>
      <span className="text-white/40 text-[10px] font-bold tracking-widest">
        ACTIVE LESSON
      </span>
    </div>

    <h2 className="text-white text-base font-bold leading-tight mb-2">
      RESUME <br />
      <span className="text-white/60">your lesson</span>
    </h2>

    <div className="flex items-center justify-between pt-2">
      <div className="flex-1">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Progress</span>
          <span className="text-white font-semibold">65%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
          />
        </div>
      </div>

      <a href="#resume-lesson">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="ml-3 p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600"
        >
          <Play className="text-white" size={16} />
        </motion.button>
      </a>
    </div>
  </motion.div>
);

// ─── Action Buttons ───────────────────────────────────────────────────────────

const ActionButtons = ({ onLiveSupportClick }: { onLiveSupportClick: () => void }) => {
  const segments = [
    { label: "Resume",    sublabel: "lesson", href: "#resume-lesson", icon: <Play size={22} />,     gradient: "from-purple-600 via-purple-500 to-violet-600"   },
    { label: "Tasks",     sublabel: "",        href: "#daily-tasks",   icon: <ListTodo size={22} />, gradient: "from-pink-600 via-pink-500 to-rose-500"         },
    { label: "Community", sublabel: "",        href: "#community",     icon: <Users size={22} />,    gradient: "from-violet-700 via-purple-600 to-purple-700"   },
    { label: "Help",      sublabel: "",        href: null,             icon: <Heart size={22} />,    gradient: "from-pink-700 via-rose-600 to-pink-600"         },
  ];

  return (
    <div className="flex justify-center py-2">
      <div className="relative w-80 h-80">

        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-purple-600/30 blur-xl scale-95" />

        {/* The 4 segments */}
        <div className="absolute inset-0 rounded-full overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/60">

          {/* Top-left: Help */}
          <div
            onClick={onLiveSupportClick}
            className={`absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br ${segments[3].gradient} backdrop-blur-xl cursor-pointer group overflow-hidden
              border-b border-r border-white/10 hover:brightness-110 transition-all duration-300`}
          >
            {/* gloss shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            {/* hover shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pb-3 pr-3">
              <div className="text-white drop-shadow-lg">{segments[3].icon}</div>
              <span className="text-white font-bold text-sm tracking-wide drop-shadow">{segments[3].label}</span>
            </div>
          </div>

          {/* Top-right: Resume */}
          <a href={segments[0].href!} className="absolute top-0 right-0 w-1/2 h-1/2 block group overflow-hidden border-b border-l border-white/10 hover:brightness-110 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${segments[0].gradient} backdrop-blur-xl`} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pb-3 pl-3">
              <div className="text-white drop-shadow-lg">{segments[0].icon}</div>
              <span className="text-white font-bold text-sm tracking-wide drop-shadow">{segments[0].label}</span>
              <span className="text-white/70 text-[11px] -mt-0.5">{segments[0].sublabel}</span>
            </div>
          </a>

          {/* Bottom-left: Community */}
          <a href={segments[2].href!} className="absolute bottom-0 left-0 w-1/2 h-1/2 block group overflow-hidden border-t border-r border-white/10 hover:brightness-110 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${segments[2].gradient} backdrop-blur-xl`} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pt-3 pr-3">
              <div className="text-white drop-shadow-lg">{segments[2].icon}</div>
              <span className="text-white font-bold text-sm tracking-wide drop-shadow">{segments[2].label}</span>
            </div>
          </a>

          {/* Bottom-right: Tasks */}
          <a href={segments[1].href!} className="absolute bottom-0 right-0 w-1/2 h-1/2 block group overflow-hidden border-t border-l border-white/10 hover:brightness-110 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${segments[1].gradient} backdrop-blur-xl`} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pt-3 pl-3">
              <div className="text-white drop-shadow-lg">{segments[1].icon}</div>
              <span className="text-white font-bold text-sm tracking-wide drop-shadow">{segments[1].label}</span>
            </div>
          </a>

          {/* Dividers */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/15 -translate-x-px" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/15 -translate-y-px" />
          </div>
        </div>

        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full z-10
          bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900
          border border-purple-400/30 shadow-lg shadow-purple-900/80
          flex items-center justify-center">
          <span className="text-white/70 text-[10px] font-semibold tracking-widest">today</span>
        </div>

      </div>
    </div>
  );
};


// ─── Live Support Modal ────────────────────────────────────────────────────────

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
type Diff = (typeof DIFFICULTIES)[number];

const LiveSupportModal = ({ onClose }: { onClose: () => void }) => {
  const [taskName, setTaskName] = useState("");
  const [difficulty, setDifficulty] = useState<Diff>("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setError("Please describe your task first.");
      return;
    }

    setError(null);
    setLoading(true);

    const taskObj: Task = { task: taskName.trim(), difficulty };
    const apiKeys = await getApiKeys();

    if (!apiKeys || apiKeys.length === 0) {
      setError("No API keys available. Please contact support.");
      setLoading(false);
      return;
    }

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        const response = await fetch(
          "https://pythonbackend-74es.onrender.com/live-action-support",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              task_name: taskObj.task,
              user_id: userId,
              category: "General life",
              difficulty: taskObj.difficulty || "Medium",
              user_context: {
                anxiety_level: "moderate",
                experience: "beginner",
                specific_challenges: [],
              },
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.warn(`API key ${i + 1} failed:`, data.error || "Unknown error");
          continue;
        }

        if (data.success && data.task) {
          window.location.href = `/connections?task=${encodeURIComponent(
            JSON.stringify(data.task)
          )}`;
          setLoading(false);
          return;
        } else {
          console.warn(`API key ${i + 1} returned invalid response`);
          continue;
        }
      } catch (err) {
        console.warn(`API key ${i + 1} request failed:`, err);
      }
    }

    setError("All API keys failed. Please try again later.");
    setLoading(false);
  };

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl bg-[#0f0c1a] border border-white/10 p-6 space-y-5"
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Headset size={14} className="text-purple-300" />
            </div>
            <h2 className="text-white font-bold text-lg">Live Action Support</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-white/40 text-sm">
          Tell us what you're working on and we'll connect you with live support.
        </p>

        <div className="space-y-2">
          <label className="text-white/50 text-xs font-semibold tracking-widest uppercase">
            What's your task?
          </label>
          <textarea
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g. Write a cover letter for a job application…"
            rows={3}
            className="w-full rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm px-4 py-3 resize-none focus:outline-none focus:border-purple-500/60 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-white/50 text-xs font-semibold tracking-widest uppercase">
            Difficulty
          </label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  difficulty === d
                    ? "text-white"
                    : "bg-white/5 border border-white/10 text-white/40 hover:text-white/60"
                }`}
                style={difficulty === d ? { background: "linear-gradient(135deg, #7b1fa2, #c2185b)" } : {}}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm disabled:opacity-60 transition-opacity"
          style={{ background: "linear-gradient(135deg, #7b1fa2, #c2185b)" }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Connecting…
            </>
          ) : (
            <>
              <Headset size={16} />
              Get Live Support
            </>
          )}
        </motion.button>
      </motion.div>
    </>
  );
};

// ─── Streak (kept for reference) ──────────────────────────────────────────────

export const Streak = () => (
  <a href="#streak">
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #7b1fa2, #c2185b)" }}
      >
        <Trophy className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-white font-semibold">7 Day Streak</p>
        <p className="text-white/30 text-xs">Next reward in 24h</p>
      </div>
      <ChevronRight className="text-white/30" />
    </motion.div>
  </a>
);