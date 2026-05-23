import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Zap, Target, BookOpen, Clock, CheckCircle2,
  AlertCircle, X, ChevronDown, ChevronUp, AlarmClock,
  Sparkles, Flame, Trophy, Loader2, Star, Bell
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface ActivityConfig {
  id: "community" | "challenge" | "plan" | "lesson";
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  borderColor: string;
  bgColor: string;
  xp: number;
  desc: string;
  accentText: string;
  timerBg: string;
  timerBorder: string;
  timerText: string;
}

interface ScheduledTimes {
  community?: string;
  challenge?: string;
  plan?: string;
  lesson?: string;
}

interface DoneState {
  community: boolean;
  challenge: boolean;
  plan: boolean;
  lesson: boolean;
}

interface ToastState {
  message: string;
  type: "success" | "info" | "error";
}

interface DailyHubProps {
  userId: string;
  userName?: string;
  apiKey?: string;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BACKEND = "https://pythonbackend-j1yp.onrender.com";
const STORAGE_KEY_DONE = "dailyhub_done";
const STORAGE_KEY_TIMES = "dailyhub_times";
const STORAGE_KEY_DATE = "dailyhub_date";

const ACTIVITIES: ActivityConfig[] = [
  {
    id: "community",
    label: "Community",
    sublabel: "Connect with others",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-violet-600 to-indigo-600",
    glowColor: "shadow-violet-500/40",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-950/20",
    accentText: "text-violet-300",
    timerBg: "bg-violet-600/25",
    timerBorder: "border-violet-400/60",
    timerText: "text-violet-200",
    xp: 20,
    desc: "Share your progress and cheer someone on today. Accountability lives in community.",
  },
  {
    id: "challenge",
    label: "Challenge",
    sublabel: "Today's quick win",
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-orange-500 to-amber-500",
    glowColor: "shadow-orange-500/40",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-950/15",
    accentText: "text-orange-300",
    timerBg: "bg-orange-600/25",
    timerBorder: "border-orange-400/60",
    timerText: "text-orange-200",
    xp: 30,
    desc: "A bite-sized social challenge to push your comfort zone just a little further.",
  },
  {
    id: "plan",
    label: "My Plan",
    sublabel: "AI-crafted task",
    icon: <Target className="w-5 h-5" />,
    gradient: "from-sky-500 to-indigo-500",
    glowColor: "shadow-sky-500/40",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-950/15",
    accentText: "text-sky-300",
    timerBg: "bg-sky-600/25",
    timerBorder: "border-sky-400/60",
    timerText: "text-sky-200",
    xp: 50,
    desc: "Do the next task from your personalized 5-day roadmap.",
  },
  {
    id: "lesson",
    label: "Lesson",
    sublabel: "Level up your skills",
    icon: <BookOpen className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "shadow-emerald-500/40",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-950/15",
    accentText: "text-emerald-300",
    timerBg: "bg-emerald-600/25",
    timerBorder: "border-emerald-400/60",
    timerText: "text-emerald-200",
    xp: 40,
    desc: "Read today's insight and apply it in the real world.",
  },
];

// ─────────────────────────────────────────────
// DAILY RESET HELPERS
// ─────────────────────────────────────────────
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function loadPersistedState() {
  try {
    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const today = getTodayStr();
    if (savedDate !== today) {
      localStorage.setItem(STORAGE_KEY_DATE, today);
      localStorage.removeItem(STORAGE_KEY_DONE);
      return {
        done: { community: false, challenge: false, plan: false, lesson: false },
        times: JSON.parse(localStorage.getItem(STORAGE_KEY_TIMES) || "{}"),
      };
    }
    return {
      done: JSON.parse(localStorage.getItem(STORAGE_KEY_DONE) || "{}"),
      times: JSON.parse(localStorage.getItem(STORAGE_KEY_TIMES) || "{}"),
    };
  } catch {
    return {
      done: { community: false, challenge: false, plan: false, lesson: false },
      times: {},
    };
  }
}

// ─────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────
interface Particle {
  id: number; x: number; y: number; vx: number; vy: number;
  color: string; size: number; rotation: number; rotationSpeed: number;
  shape: "rect" | "circle" | "triangle"; opacity: number;
}

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ["#a855f7","#ec4899","#f97316","#06b6d4","#10b981","#f59e0b","#6366f1","#e879f9"];
    particlesRef.current = Array.from({ length: 160 }, (_, i) => ({
      id: i, x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 10, rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      shape: (["rect","circle","triangle"] as const)[Math.floor(Math.random() * 3)],
      opacity: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDone = true;
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.vy += 0.08; p.y += p.vy; p.rotation += p.rotationSpeed;
        if (p.y > canvas.height - 100) p.opacity -= 0.015;
        if (p.opacity > 0) allDone = false;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
        else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -p.size / 2); ctx.lineTo(p.size / 2, p.size / 2); ctx.lineTo(-p.size / 2, p.size / 2); ctx.closePath(); ctx.fill(); }
        ctx.restore();
      });
      if (!allDone) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[200]" />;
}

// ─────────────────────────────────────────────
// COMPACT CLOCK FACE
// ─────────────────────────────────────────────
function ClockFace({ time }: { time: Date }) {
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const hourDeg = (h % 12) * 30 + m * 0.5;
  const minDeg = m * 6 + s * 0.1;
  const secDeg = s * 6;

  const hand = (deg: number, length: number, width: number, color: string) => {
    const rad = (deg - 90) * (Math.PI / 180);
    const x2 = 50 + length * Math.cos(rad);
    const y2 = 50 + length * Math.sin(rad);
    return <line x1="50" y1="50" x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  };

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="rgba(15,5,40,0.3)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
      {[...Array(12)].map((_, i) => {
        const rad = (i * 30 - 90) * (Math.PI / 180);
        const r1 = 40; const r2 = i % 3 === 0 ? 33 : 37;
        return <line key={i}
          x1={50 + r1 * Math.cos(rad)} y1={50 + r1 * Math.sin(rad)}
          x2={50 + r2 * Math.cos(rad)} y2={50 + r2 * Math.sin(rad)}
          stroke={i % 3 === 0 ? "rgba(167,139,250,0.9)" : "rgba(139,92,246,0.35)"}
          strokeWidth={i % 3 === 0 ? 2 : 1} />;
      })}
      {hand(hourDeg, 21, 3.5, "#c4b5fd")}
      {hand(minDeg, 31, 2.5, "#e9d5ff")}
      {hand(secDeg, 35, 1.2, "#f472b6")}
      <circle cx="50" cy="50" r="3.5" fill="#7c3aed" />
      <circle cx="50" cy="50" r="1.5" fill="#f9a8d4" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: ToastState["type"]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-bold text-white max-w-xs w-full
        ${type === "success" ? "bg-emerald-900/80 border-emerald-400/50 shadow-emerald-500/30"
          : type === "error" ? "bg-rose-900/80 border-rose-400/50 shadow-rose-500/30"
          : "bg-purple-900/80 border-purple-400/50 shadow-purple-500/30"}`}
    >
      {type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />}
      {type === "error" && <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />}
      {type === "info" && <Sparkles className="w-4 h-4 text-purple-300 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// INLINE TIME PICKER
// ─────────────────────────────────────────────
function InlineTimePicker({ act, currentTime, onSave }: {
  act: ActivityConfig; currentTime?: string; onSave: (time: string) => void;
}) {
  const [val, setVal] = useState(currentTime ?? "09:00");
  const QUICK = ["08:00", "12:00", "18:00", "21:00"];

  return (
    <div className={`mt-3 p-3.5 rounded-2xl border-2 ${act.timerBorder} ${act.timerBg} space-y-3`}>
      <div className="flex items-center gap-2">
        <AlarmClock className={`w-3.5 h-3.5 ${act.timerText}`} />
        <p className={`text-[11px] uppercase tracking-widest font-black ${act.timerText}`}>Choose task time</p>
      </div>
      <input
        type="time" value={val} onChange={e => setVal(e.target.value)}
        className={`w-full border-2 ${act.timerBorder} rounded-xl px-3 py-2.5 text-xl font-black ${act.timerText} outline-none bg-black/20 focus:bg-black/30 transition-all [color-scheme:dark]`}
      />
      <div className="grid grid-cols-4 gap-1.5">
        {QUICK.map(t => (
          <button key={t} onClick={() => setVal(t)}
            className={`py-2 rounded-xl border-2 text-[11px] font-black transition-all
              ${val === t ? `${act.timerBg} ${act.timerBorder} ${act.timerText} scale-105 shadow-lg` : `bg-black/20 border-white/10 text-white/50 hover:bg-black/30 hover:border-white/20`}`}>
            {t}
          </button>
        ))}
      </div>
      <button
        onClick={() => onSave(val)}
        className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${act.gradient} text-white text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg`}
      >
        <AlarmClock className="w-3.5 h-3.5" />
        <span>Save reminder for {val}</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ACTIVITY TILE (compact square, no expanding drawer)
// ─────────────────────────────────────────────
function ActivityTile({ act, scheduledTime, isDone, planTask, onToggle, onSaveTime }: {
  act: ActivityConfig; scheduledTime?: string; isDone: boolean;
  planTask?: string | null; onToggle: () => void; onSaveTime: (time: string) => void;
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {/* TILE */}
      <motion.div
        layout
        whileTap={{ scale: 0.97 }}
        className={`relative rounded-2xl border transition-all duration-300 p-3 flex flex-col gap-2 select-none
          ${isDone
            ? "border-emerald-500/40 bg-emerald-950/25 shadow-lg shadow-emerald-500/10"
            : `${act.borderColor} ${act.bgColor}`
          }`}
      >
        {/* Done checkmark overlay */}
        {isDone && (
          <div className="absolute top-2.5 right-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0
          bg-gradient-to-br ${isDone ? "from-emerald-600 to-teal-600 shadow-emerald-500/30" : `${act.gradient} ${act.glowColor}`}`}>
          {isDone ? <CheckCircle2 className="w-4.5 h-4.5" /> : act.icon}
        </div>

        {/* Label + XP */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-black leading-tight ${isDone ? "text-emerald-300" : "text-white"}`}>
            {act.label}
          </p>
          <p className={`text-[10px] mt-0.5 font-bold ${isDone ? "text-emerald-500/70" : `${act.accentText} opacity-70`}`}>
            +{act.xp} XP
          </p>
        </div>

        {/* Bottom row: timer + mark done */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation();
              setShowTimePicker(v => !v);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all hover:scale-105
              ${scheduledTime
                ? "bg-emerald-900/50 border-emerald-400/70 text-emerald-300"
                : `${act.timerBg} ${act.timerBorder} ${act.timerText}`
              }`}
          >
            <AlarmClock className="w-3 h-3" />
            <span>{scheduledTime ?? "Set"}</span>
          </button>

          <button
            onClick={onToggle}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-black transition-all hover:scale-[1.02] relative overflow-hidden group
              ${isDone
                ? "bg-emerald-900/40 border border-emerald-500/30 text-emerald-300"
                : `bg-gradient-to-r ${act.gradient} text-white shadow-md border border-transparent`
              }`}
          >
            {!isDone && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            )}
            <span className="relative z-10 flex items-center gap-1">
              {isDone
                ? <><CheckCircle2 className="w-3 h-3" /> Undo</>
                : <><Star className="w-3 h-3" /> Done</>
              }
            </span>
          </button>
        </div>
      </motion.div>

      {/* TIME PICKER — renders below the tile, full width of the tile column */}
      <AnimatePresence>
        {showTimePicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <InlineTimePicker
              act={act} currentTime={scheduledTime}
              onSave={(t) => { onSaveTime(t); setShowTimePicker(false); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// ALL DONE BANNER
// ─────────────────────────────────────────────
function AllDoneBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 18 }}
      className="relative rounded-3xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-yellow-950/50 via-orange-950/40 to-pink-950/50 p-4 text-center shadow-2xl shadow-yellow-900/30"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-pink-600/10 to-purple-600/5 pointer-events-none" />
      <div className="relative z-10 space-y-1.5">
        <div className="text-3xl mb-1">🎉</div>
        <p className="text-base font-black text-white">Day Complete!</p>
        <p className="text-xs text-yellow-300/70">You crushed all 4 activities. Streak extended!</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-black text-yellow-300">+140 XP earned today</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function DailyHub({ userId, userName, apiKey }: DailyHubProps) {
  const [now, setNow] = useState(new Date());

  const initialState = loadPersistedState();
  const [done, setDone] = useState<DoneState>({
    community: initialState.done.community ?? false,
    challenge: initialState.done.challenge ?? false,
    plan: initialState.done.plan ?? false,
    lesson: initialState.done.lesson ?? false,
  });
  const [times, setTimes] = useState<ScheduledTimes>(initialState.times ?? {});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevDoneCount = useRef(0);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => {
      const newNow = new Date();
      setNow(newNow);
      if (newNow.getHours() === 0 && newNow.getMinutes() === 0 && newNow.getSeconds() === 0) {
        const fresh = { community: false, challenge: false, plan: false, lesson: false };
        setDone(fresh);
        localStorage.setItem(STORAGE_KEY_DATE, getTodayStr());
        localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(fresh));
        prevDoneCount.current = 0;
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(done));
  }, [done]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIMES, JSON.stringify(times));
  }, [times]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!showConfetti) return;
    const t = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(t);
  }, [showConfetti]);



  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  }, []);

  function toggleDone(id: ActivityConfig["id"]) {
    setDone(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const act = ACTIVITIES.find(a => a.id === id)!;
      if (!prev[id]) showToast(`+${act.xp} XP — ${act.label} complete!`, "success");
      const newCount = Object.values(next).filter(Boolean).length;
      if (newCount === ACTIVITIES.length && prevDoneCount.current < ACTIVITIES.length) {
        setTimeout(() => setShowConfetti(true), 300);
      }
      prevDoneCount.current = newCount;
      return next;
    });
  }

  function saveTime(actId: ActivityConfig["id"], time: string) {
    setTimes(prev => ({ ...prev, [actId]: time }));
    const act = ACTIVITIES.find(a => a.id === actId)!;
    showToast(`${act.label} scheduled for ${time}`, "info");
    if (apiKey) {
      fetch(`${BACKEND}/tasks/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, task_id: `${actId}_daily`, scheduled_time: time }),
      }).catch(() => {});
    }
  }

  const h = now.getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = h < 12 ? "🌅" : h < 17 ? "☀️" : "🌙";
  const doneCount = Object.values(done).filter(Boolean).length;
  const totalXP = ACTIVITIES.reduce((s, a) => s + (done[a.id] ? a.xp : 0), 0);
  const progressPct = Math.round((doneCount / ACTIVITIES.length) * 100);
  const allDone = doneCount === ACTIVITIES.length;

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const timeStr = `${String(h % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;

  return (
    <div className="bg-transparent text-white px-4 pt-4 pb-0">
      <Confetti active={showConfetti} />

      <div className="max-w-sm mx-auto space-y-0">

        {/* ── COMPACT HERO: CLOCK + GREETING + PROGRESS ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-purple-950/20 rounded-3xl border border-purple-500/20 p-4 overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <ClockFace time={now} />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-sm font-black text-white leading-tight">
                  {greetEmoji} {greeting}{userName ? `, ${userName}` : ""}!
                </p>
                <p className="text-[11px] text-purple-400/60 font-medium">{dateStr} · {timeStr}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-purple-400/60 font-bold uppercase tracking-wide">
                    {doneCount}/{ACTIVITIES.length} done
                  </span>
                  <span className="text-[10px] text-purple-300 font-black">{totalXP} XP</span>
                </div>
                <div className="h-2 bg-purple-900/40 rounded-full overflow-hidden border border-purple-800/30">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>

                <div className="flex gap-1.5 pt-0.5">
                  {ACTIVITIES.map(a => (
                    <motion.div
                      key={a.id}
                      animate={{ scale: done[a.id] ? [1, 1.4, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${done[a.id] ? "bg-gradient-to-r from-violet-500 to-pink-500" : "bg-purple-900/60"}`}
                    />
                  ))}
                </div>
              </div>

              {!allDone && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-orange-950/30 border border-orange-500/20 w-fit">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="text-[10px] text-orange-300/80 font-bold">Keep streak alive</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── PLAN LOADING ── */}

        {/* ── 2×2 ACTIVITY TILE GRID ── */}
        <div>
          <p className="text-[10px] text-purple-400/40 uppercase tracking-[2px] px-1 font-bold mb-2">Today's Activities</p>
          <div className="grid grid-cols-2 gap-2.5">
            {ACTIVITIES.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <ActivityTile
                  act={act}
                  scheduledTime={times[act.id as keyof ScheduledTimes]}
                  isDone={done[act.id as keyof DoneState]}
                  onToggle={() => toggleDone(act.id)}
                  onSaveTime={(t) => saveTime(act.id, t)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── ALL DONE BANNER ── */}
        <AnimatePresence>
          {allDone && <AllDoneBanner />}
        </AnimatePresence>

      </div>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}