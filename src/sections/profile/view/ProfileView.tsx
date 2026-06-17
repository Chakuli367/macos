import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Settings, ChevronRight, Zap, Star, BookOpen, Lock } from "lucide-react";

// ─── Fonts & Global Styles ────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: transparent;
      --surface: rgba(42,20,80,0.9);
      --surface2: rgba(55,25,100,0.7);
      --border: rgba(192,162,252,0.2);
      --border2: rgba(192,162,252,0.4);
      --purple: #c084fc;
      --purple-dark: #7c3aed;
      --purple-mid: #a855f7;
      --pink: #f472b6;
      --orange: #fb923c;
      --green: #4ade80;
      --amber: #fbbf24;
      --red: #f87171;
      --muted: #8b7ab8;
      --text: #f0e8ff;
      --text2: #d8c8f8;
      --text3: #a990d0;
    }

    body { background: transparent; }

    .profile-root {
      font-family: 'Nunito', 'Poppins', sans-serif;
      background: transparent;
      min-height: 100vh;
      color: var(--text);
      position: relative;
      overflow-x: hidden;
    }

    .display { font-family: 'Poppins', sans-serif; font-weight: 800; }

    /* ── Glass Cards (from ProfileView) ── */
    .glass-card {
      background: rgba(42,20,80,0.75);
      border: 1px solid rgba(192,162,252,0.2);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
    }
    .glass-card-hover { transition: all 0.2s; }
    .glass-card-hover:hover {
      border-color: rgba(192,162,252,0.45);
      box-shadow: 0 8px 32px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.07);
      transform: translateY(-1px);
    }

    /* ── Buttons ── */
    .btn-primary {
      font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 700;
      letter-spacing: 0.02em; padding: 0.9rem 2rem;
      background: linear-gradient(135deg, #ec4899, #f97316);
      color: white; border: none; border-radius: 999px; cursor: pointer;
      transition: all 0.2s; box-shadow: 0 4px 20px rgba(236,72,153,0.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(236,72,153,0.55); }
    .btn-primary:active { transform: translateY(0); }

    .btn-secondary {
      font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 700;
      padding: 0.65rem 1.5rem;
      background: rgba(192,162,252,0.15); color: var(--purple);
      border: 1px solid rgba(192,162,252,0.35); border-radius: 999px;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-secondary:hover { background: rgba(192,162,252,0.25); border-color: rgba(192,162,252,0.6); }

    /* ── Nav Tabs (from 02.tsx style) ── */
    .nav-tab {
      font-family: 'Nunito', sans-serif; font-size: 0.68rem; font-weight: 700;
      letter-spacing: 0.04em; text-transform: uppercase;
      padding: 0.5rem 0.85rem; border: 1px solid transparent;
      background: none; cursor: pointer; color: var(--muted);
      transition: all 0.2s; border-radius: 10px; white-space: nowrap;
    }
    .nav-tab.active {
      color: white; border-color: rgba(192,162,252,0.5);
      background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.3));
    }
    .nav-tab:hover:not(.active) { color: var(--text2); background: rgba(255,255,255,0.06); }

    /* ── Tag buttons ── */
    .tag-btn {
      font-family: 'Nunito', sans-serif; font-size: 0.75rem; font-weight: 700;
      padding: 0.4rem 0.9rem; border-radius: 999px;
      border: 1px solid rgba(192,162,252,0.3); background: rgba(124,58,237,0.1);
      color: var(--text3); cursor: pointer; transition: all 0.18s;
    }
    .tag-btn.selected {
      background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.35));
      color: white; border-color: rgba(192,162,252,0.6);
    }
    .tag-btn:hover:not(.selected) { border-color: rgba(192,162,252,0.5); color: var(--text2); }

    /* ── Misc ── */
    .insight-bubble {
      border-left: 3px solid var(--purple-mid); padding: 0.85rem 1rem;
      background: rgba(124,58,237,0.1); border-radius: 0 14px 14px 0;
      color: var(--text2); font-size: 0.88rem; font-weight: 500; line-height: 1.7;
    }
    .gradient-text {
      background: linear-gradient(135deg, #c084fc, #f472b6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .flame { display: inline-block; animation: flicker 1.5s ease-in-out infinite alternate; }
    .achievement-badge {
      background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05));
      border: 1px solid rgba(251,191,36,0.3); border-radius: 16px; padding: 1rem;
    }
    .achievement-badge.earned {
      background: linear-gradient(135deg, rgba(251,191,36,0.22), rgba(251,191,36,0.08));
      border-color: rgba(251,191,36,0.55);
    }
    .achievement-badge.locked { opacity: 0.38; filter: grayscale(0.5); }

    /* ── Companion card glow ── */
    .companion-glow { animation: companionGlow 3s ease-in-out infinite; }

    /* ── Quick link cards (02.tsx style) ── */
    .quick-link {
      background: rgba(42,20,80,0.75);
      border: 1px solid rgba(192,162,252,0.2);
      border-radius: 16px; padding: 1rem 1.1rem;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 0.75rem;
      backdrop-filter: blur(20px);
    }
    .quick-link:hover {
      border-color: rgba(192,162,252,0.5);
      background: rgba(55,25,100,0.85);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(124,58,237,0.25);
    }

    /* ── 02.tsx animations ── */
    @keyframes fade-in { from { opacity:0; transform:translateY(-20px);} to { opacity:1; transform:translateY(0);} }
    @keyframes fade-in-up { from { opacity:0; transform:translateY(30px);} to { opacity:1; transform:translateY(0);} }
    @keyframes slide-in-left { from { opacity:0; transform:translateX(-30px);} to { opacity:1; transform:translateX(0);} }
    @keyframes scale-in { from { opacity:0; transform:scale(0.92);} to { opacity:1; transform:scale(1);} }
    @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.4);} 50%{box-shadow:0 0 35px rgba(139,92,246,0.75), 0 0 50px rgba(236,72,153,0.4);} }
    @keyframes pulse-slow { 0%,100%{opacity:1;} 50%{opacity:0.75;} }
    @keyframes pulse-border { 0%,100%{border-color:rgba(139,92,246,0.45);} 50%{border-color:rgba(139,92,246,0.85);} }
    @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
    @keyframes companionGlow { 0%,100%{box-shadow:0 0 30px rgba(192,130,252,0.3), inset 0 0 40px rgba(124,58,237,0.08);} 50%{box-shadow:0 0 55px rgba(192,130,252,0.55), inset 0 0 60px rgba(236,72,153,0.1);} }
    @keyframes flicker { 0%{transform:scaleY(1) rotate(-2deg);} 100%{transform:scaleY(1.08) rotate(2deg);} }
    @keyframes floatUp { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-8px);} }
    @keyframes orbitSpin { from{transform:rotate(0deg) translateX(60px) rotate(0deg);} to{transform:rotate(360deg) translateX(60px) rotate(-360deg);} }

    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
    .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; opacity:0; }
    .animate-slide-in-left { animation: slide-in-left 0.6s ease-out forwards; opacity:0; }
    .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
    .animate-glow { animation: glow 2.5s ease-in-out infinite; }
    .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
    .animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }
    .animate-shimmer { background-size:200% 100%; animation: shimmer 2s linear infinite; }
    .companion-float { animation: floatUp 4s ease-in-out infinite; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(192,162,252,0.35); border-radius: 4px; }
  `}</style>
);

// ─── Data / Constants ─────────────────────────────────────────────────────────
const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI"];

const ACHIEVEMENTS = [
  { id: 'first_log', title: 'First Step', desc: 'Logged your very first entry', icon: '🌟', threshold: 1, type: 'logged' },
  { id: 'three_logs', title: 'Building Momentum', desc: 'Logged 3 days in a row', icon: '🔥', threshold: 3, type: 'streak' },
  { id: 'action_hero', title: 'Action Hero', desc: 'Took action despite anxiety', icon: '⚡', threshold: 1, type: 'action' },
  { id: 'courage_drop', title: 'Anxiety Slayer', desc: 'Anxiety dropped after taking action', icon: '🗡️', threshold: 1, type: 'drop' },
  { id: 'week_warrior', title: 'Week Warrior', desc: 'Logged every day this week', icon: '👑', threshold: 5, type: 'logged' },
];

const MOCK_AI_INSIGHTS = [
  "You consistently spike before social events but recover within hours — that's resilience, not weakness.",
  "Your mood is highest mid-week. Consider a 5-min grounding ritual on Tuesday mornings.",
  "Every time you talked it out, your post-session mood was lower than before. You're rewiring patterns.",
  "Three weeks of data shows a downward trend. You're not imagining the progress — the numbers confirm it.",
];

const COMPANION_PERSONAS = [
  { id: "calm", label: "Calm · Listener · Honest", emoji: "🌙", color: "#c084fc" },
  { id: "warm", label: "Warm · Playful · Gentle", emoji: "☀️", color: "#f472b6" },
  { id: "direct", label: "Direct · Grounded · Clear", emoji: "⚡", color: "#4ade80" },
];

function makeWeekData() {
  return DAYS_SHORT.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return {
      day,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      preLevel: i < 3 ? Math.floor(Math.random() * 5 + 3) : null,
      postLevel: i < 2 ? Math.floor(Math.random() * 3 + 1) : null,
      actionTaken: i < 3 ? Math.random() > 0.4 : false,
    };
  });
}

function getMoodColor(v) {
  if (v === null) return '#6b7280';
  if (v <= 3) return '#4ade80';
  if (v <= 6) return '#fbbf24';
  return '#f87171';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AchievementsPanel({ weekData, streak }) {
  const logged = weekData.filter(d => d.preLevel !== null).length;
  const actions = weekData.filter(d => d.actionTaken).length;
  const hasDrop = weekData.some(d => d.preLevel !== null && d.postLevel !== null && d.postLevel < d.preLevel);
  const isEarned = (a) => {
    if (a.type === 'logged') return logged >= a.threshold;
    if (a.type === 'streak') return streak >= a.threshold;
    if (a.type === 'action') return actions >= a.threshold;
    if (a.type === 'drop') return hasDrop;
    return false;
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
      {ACHIEVEMENTS.map(a => {
        const earned = isEarned(a);
        return (
          <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`achievement-badge ${earned ? "earned" : "locked"}`}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{a.icon}</div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: earned ? "#fbbf24" : "#6b7280", marginBottom: "0.15rem" }}>{a.title}</div>
            <div style={{ fontSize: "0.68rem", color: earned ? "#d1d5db" : "#4b5563", lineHeight: 1.4 }}>{a.desc}</div>
            {earned && <div style={{ fontSize: "0.6rem", color: "#4ade80", marginTop: "0.35rem", letterSpacing: "0.08em" }}>✓ EARNED</div>}
          </motion.div>
        );
      })}
    </div>
  );
}

function StoryCard({ weekData, streak }) {
  const logged = weekData.filter(d => d.preLevel !== null).length;
  const vals = weekData.filter(d => d.preLevel !== null).map(d => d.preLevel);
  const improving = vals.length >= 2 ? vals[vals.length - 1] < vals[0] : null;
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.15) 50%, rgba(236,72,153,0.15) 100%)",
      border: "1px solid rgba(124,58,237,0.4)", borderRadius: "20px", padding: "1.75rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(124,58,237,0.1)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c084fc", marginBottom: "0.75rem" }}>This Week's Story</div>
        <div className="display" style={{ fontSize: "1.5rem", lineHeight: 1.25, marginBottom: "1.25rem", color: "white" }}>
          {logged === 0 ? "Your story begins\nwhen you log day one."
            : improving ? "You showed up,\nand you're already lighter."
            : `${logged} days checked in.\nEvery single one counts.`}
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          {[
            { val: logged, label: "check-ins" },
            { val: weekData.filter(d => d.actionTaken).length, label: "actions taken" },
            { val: `${streak}🔥`, label: "day streak" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "white" }}>{s.val}</div>
              <div style={{ fontSize: "0.65rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Compact 5-day mood bar strip
function MoodStrip({ weekData, onDayClick }) {
  return (
    <div style={{ display: "flex", gap: "0.35rem", alignItems: "flex-end" }}>
      {weekData.map((d, i) => {
        const isToday = i === 4;
        const barH = d.preLevel !== null ? `${(d.preLevel / 10) * 64}px` : "4px";
        const color = getMoodColor(d.preLevel);
        return (
          <div key={i} onClick={() => onDayClick && onDayClick(i)}
            style={{ flex: 1, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: "100%", height: "68px", background: "rgba(124,58,237,0.1)", borderRadius: "6px 6px 0 0", position: "relative", overflow: "hidden" }}>
              <motion.div
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: color, borderRadius: "4px 4px 0 0", boxShadow: d.preLevel !== null ? `0 0 8px ${color}66` : "none" }}
                initial={{ height: 0 }} animate={{ height: barH }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.58rem", fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: isToday ? "#c084fc" : "#6b7280", letterSpacing: "0.08em" }}>{d.day}</div>
              {d.actionTaken && <div style={{ fontSize: "0.5rem", color: "#4ade80" }}>✓</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Companion avatar illustration
function CompanionAvatar({ persona, size = 100 }) {
  const p = COMPANION_PERSONAS.find(x => x.id === persona) || COMPANION_PERSONAS[0];
  return (
    <div className="companion-float" style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute", inset: -8, borderRadius: "50%",
        background: `radial-gradient(circle, ${p.color}22 0%, transparent 70%)`,
        border: `1.5px solid ${p.color}44`,
        animation: "companionGlow 3s ease-in-out infinite",
      }} />
      {/* Orbiting dot */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 8, height: 8,
        marginTop: -4, marginLeft: -4,
        borderRadius: "50%", background: p.color,
        boxShadow: `0 0 10px ${p.color}`,
        animation: "orbitSpin 5s linear infinite",
        transformOrigin: "0 0",
      }} />
      {/* Core avatar */}
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: `linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.4))`,
        border: `2px solid ${p.color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, position: "relative", zIndex: 1,
        backdropFilter: "blur(10px)",
        boxShadow: `0 4px 24px ${p.color}44, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}>
        {p.emoji}
      </div>
    </div>
  );
}

// Customize companion drawer
function CompanionDrawer({ companion, onClose, onSave }) {
  const [name, setName] = useState(companion.name);
  const [persona, setPersona] = useState(companion.persona);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(3,7,18,0.85)", backdropFilter: "blur(14px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="glass-card"
        style={{ width: "100%", maxWidth: 480, padding: "1.75rem", borderColor: "rgba(192,162,252,0.35)" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div className="display" style={{ fontSize: "1.25rem", color: "white" }}>Customize your companion</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", color: "#9ca3af", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.6rem" }}>Companion name</div>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Give them a name..."
            style={{
              width: "100%", padding: "0.75rem 1rem",
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(192,162,252,0.25)",
              borderRadius: "12px", color: "white", fontFamily: "'Nunito',sans-serif",
              fontSize: "0.95rem", outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.75rem" }}>Personality</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {COMPANION_PERSONAS.map(p => (
              <div key={p.id} onClick={() => setPersona(p.id)}
                style={{
                  padding: "0.9rem 1rem", borderRadius: "14px", cursor: "pointer", transition: "all 0.2s",
                  border: `1px solid ${persona === p.id ? p.color + "66" : "rgba(192,162,252,0.18)"}`,
                  background: persona === p.id ? `${p.color}14` : "rgba(42,20,80,0.4)",
                  display: "flex", alignItems: "center", gap: "0.85rem",
                }}>
                <span style={{ fontSize: "1.4rem" }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: persona === p.id ? p.color : "#d8c8f8" }}>{p.label}</div>
                </div>
                {persona === p.id && <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "white" }}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%" }} onClick={() => { onSave({ name, persona }); onClose(); }}>
          Save companion ✓
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProfileView({
  onNavigateToSessions,
  onNavigateToLessons,
}: {
  onNavigateToSessions?: () => void;
  onNavigateToLessons?: () => void;
}) {
  const [tab, setTab] = useState<"insights" | "growth" | "story">("insights");
  const [weekData, setWeekData] = useState(makeWeekData);
  const [streak, setStreak] = useState(7);
  const [showCustomize, setShowCustomize] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [companion, setCompanion] = useState({ name: "Luna", persona: "calm", sessions: 14 });
  const [showSettings, setShowSettings] = useState(false);

  // User profile state
  const user = { name: "Alex", plan: "Free", bio: "working on showing up for myself" };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const logged = weekData.filter(d => d.preLevel !== null).length;
  const avg = logged > 0
    ? (weekData.filter(d => d.preLevel !== null).reduce((a: number, b: any) => a + b.preLevel, 0) / logged).toFixed(1)
    : null;
  const vals = weekData.filter(d => d.preLevel !== null).map(d => d.preLevel);
  const trend = vals.length < 2 ? null : vals[vals.length - 1] < vals[0] ? "improving" : vals[vals.length - 1] > vals[0] ? "rising" : "stable";
  const trendDisplay: Record<string, { label: string; color: string }> = {
    improving: { label: "↘ easing", color: "#4ade80" },
    rising: { label: "↗ rising", color: "#f87171" },
    stable: { label: "→ stable", color: "#fbbf24" },
  };

  const currentPersona = COMPANION_PERSONAS.find(p => p.id === companion.persona) || COMPANION_PERSONAS[0];
  const lastTalked = "2 hours ago";

  return (
    <>
      <FontLoader />
      <div className="profile-root">
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>

          {/* ── ① USER PROFILE STRIP ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="animate-fade-in"
            style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>

            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", fontWeight: 800, color: "white",
              boxShadow: "0 4px 14px rgba(124,58,237,0.45)",
            }}>
              {user.name[0]}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="display" style={{ fontSize: "1rem", color: "white" }}>{user.name}</span>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "2px 8px", borderRadius: "999px",
                  background: user.plan === "Pro" ? "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.1))" : "rgba(124,58,237,0.15)",
                  border: `1px solid ${user.plan === "Pro" ? "rgba(251,191,36,0.4)" : "rgba(192,162,252,0.3)"}`,
                  color: user.plan === "Pro" ? "#fbbf24" : "#c084fc",
                }}>
                  {user.plan}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.bio}</div>
            </div>

            {/* Settings gear */}
            <button onClick={() => setShowSettings(s => !s)}
              style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", flexShrink: 0, transition: "all 0.2s" }}>
              <Settings size={16} />
            </button>
          </motion.div>

          {/* ── ② COMPANION HERO CARD ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="animate-fade-in-up"
            style={{ animationDelay: "0.1s", marginBottom: "1rem" }}>

            <div className="companion-glow" style={{
              background: "linear-gradient(135deg, rgba(42,14,82,0.97) 0%, rgba(68,22,116,0.92) 55%, rgba(100,30,130,0.75) 100%)",
              border: `1px solid ${currentPersona.color}44`,
              borderRadius: "24px", padding: "1.5rem",
              position: "relative", overflow: "hidden",
              boxShadow: `0 8px 40px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.07)`,
            }}>
              {/* BG orb */}
              <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${currentPersona.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(236,72,153,0.06)", pointerEvents: "none" }} />

              <div style={{ display: "flex", gap: "1.1rem", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                <CompanionAvatar persona={companion.persona} size={88} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Label */}
                  <div style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: currentPersona.color, marginBottom: "0.2rem", opacity: 0.85 }}>
                    your ai companion
                  </div>

                  {/* Name */}
                  <div className="display" style={{ fontSize: "1.65rem", lineHeight: 1.1, color: "white", marginBottom: "0.25rem" }}>
                    {companion.name}
                  </div>

                  {/* Persona traits */}
                  <div style={{ fontSize: "0.7rem", color: currentPersona.color, marginBottom: "0.6rem", opacity: 0.9 }}>
                    {currentPersona.label}
                  </div>

                  {/* Status line */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                    <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Last talked {lastTalked} · {companion.sessions} sessions</span>
                  </div>

                  {/* Primary CTA */}
                  <button className="btn-primary animate-glow"
                    onClick={onNavigateToSessions}
                    style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "0.88rem" }}>
                    Talk to {companion.name} →
                  </button>
                </div>
              </div>

              {/* Customize link */}
              <button onClick={() => setShowCustomize(true)}
                style={{ marginTop: "1rem", width: "100%", background: "rgba(192,162,252,0.08)", border: "1px solid rgba(192,162,252,0.2)", borderRadius: "12px", padding: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#a990d0", fontSize: "0.75rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, transition: "all 0.2s", position: "relative", zIndex: 1 }}>
                <Sparkles size={13} />
                Customize companion
              </button>
            </div>
          </motion.div>

          {/* ── ③ MOOD WEEK STRIP ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card animate-slide-in-left"
            style={{ padding: "1.25rem", marginBottom: "0.85rem", animationDelay: "0.2s" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
              <div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280" }}>This week</div>
                <div className="display" style={{ fontSize: "1.05rem", color: "white", marginTop: "0.1rem" }}>Your mood check-ins</div>
              </div>
              <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
                {trend && (
                  <span style={{ fontSize: "0.72rem", color: trendDisplay[trend].color, fontWeight: 700, background: `${trendDisplay[trend].color}18`, padding: "2px 10px", borderRadius: "999px", border: `1px solid ${trendDisplay[trend].color}33` }}>
                    {trendDisplay[trend].label}
                  </span>
                )}
                <span className="flame" style={{ fontSize: "1rem" }}>🔥</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#c084fc" }}>{streak}</span>
              </div>
            </div>

            <MoodStrip weekData={weekData} onDayClick={null} />

            {/* Compact stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
              {[
                { label: "Avg mood", val: avg ? `${avg}/10` : "—", color: avg ? getMoodColor(parseFloat(avg)) : "#6b7280" },
                { label: "Logged", val: `${logged}/5`, color: "#c084fc" },
                { label: "Actions", val: `${weekData.filter(d => d.actionTaken).length}`, color: "#4ade80" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "0.6rem 0.4rem", background: "rgba(124,58,237,0.07)", borderRadius: "10px", border: "1px solid rgba(192,162,252,0.1)" }}>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: "0.55rem", color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.1rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── ④ TABS: INSIGHTS / GROWTH / STORY ────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {/* Tab bar */}
            <div style={{
              display: "flex", gap: "0.25rem", marginBottom: "0.85rem",
              background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "4px",
            }}>
              {[
                { id: "insights" as const, label: "✦ Insights" },
                { id: "growth" as const, label: "🏆 Growth" },
                { id: "story" as const, label: "📖 My Story" },
              ].map(t => (
                <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={{ flex: 1 }}>
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* INSIGHTS */}
              {tab === "insights" && (
                <motion.div key="insights" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                  <div className="glass-card" style={{ padding: "1.4rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div className="display" style={{ fontSize: "1.1rem", color: "white" }}>What your data<br />is telling you</div>
                      <span style={{ fontSize: "0.58rem", background: "rgba(124,58,237,0.15)", color: "#c084fc", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "6px", padding: "0.2rem 0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {MOCK_AI_INSIGHTS.map((insight, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="insight-bubble">
                          {insight}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Top triggers */}
                  <div className="glass-card" style={{ padding: "1.25rem" }}>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.85rem" }}>Top mood triggers this week</div>
                    {["social event", "work stress", "alone time"].map((tag, i) => (
                      <div key={tag} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.55rem" }}>
                        <div style={{ flex: 1, fontSize: "0.82rem", color: "#d1d5db" }}>{tag}</div>
                        <div style={{ width: `${80 - i * 20}px`, height: 6, background: "linear-gradient(90deg, #7c3aed, #a855f7)", borderRadius: "3px", boxShadow: "0 0 6px rgba(124,58,237,0.4)" }} />
                        <div style={{ fontSize: "0.7rem", color: "#6b7280", width: 20, textAlign: "right" }}>{3 - i}×</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* GROWTH */}
              {tab === "growth" && (
                <motion.div key="growth" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                  <div className="glass-card" style={{ padding: "1.4rem", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>Growth markers</div>
                    <AchievementsPanel weekData={weekData} streak={streak} />
                  </div>

                  <div className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span className="flame" style={{ fontSize: "2rem" }}>🔥</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "white" }}>{streak}-day streak</div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.15rem" }}>You've shown up {streak} days in a row. That matters.</div>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#c084fc", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", padding: "0.4rem 0.75rem", background: "rgba(124,58,237,0.08)", cursor: "pointer" }}>Share</div>
                  </div>
                </motion.div>
              )}

              {/* STORY */}
              {tab === "story" && (
                <motion.div key="story" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                  <StoryCard weekData={weekData} streak={streak} />
                  <div className="glass-card" style={{ marginTop: "0.75rem", padding: "1.4rem" }}>
                    <div className="display" style={{ fontSize: "1rem", color: "white", marginBottom: "0.75rem" }}>Remember this</div>
                    <div className="insight-bubble" style={{ borderColor: "#c084fc" }}>
                      The moments you feel it and talk it out anyway — those are the moments your nervous system learns it can survive. Every session is evidence.
                    </div>
                    <div style={{ marginTop: "0.5rem", fontSize: "0.68rem", color: "#6b7280" }}>— {companion.name} · Your weekly reflection</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── ⑤ QUICK LINKS ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "1rem" }}>

            {/* Sessions */}
            <div className="quick-link animate-slide-in-left" style={{ animationDelay: "0.4s" }} onClick={onNavigateToSessions}>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.25))", border: "1px solid rgba(192,162,252,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={16} color="#c084fc" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "white" }}>Sessions</div>
                <div style={{ fontSize: "0.68rem", color: "#6b7280" }}>Talk, breathe, log</div>
              </div>
              <ChevronRight size={14} color="#6b7280" />
            </div>

            {/* Lessons */}
            <div className="quick-link animate-slide-in-left" style={{ animationDelay: "0.48s" }} onClick={onNavigateToLessons}>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(249,115,22,0.2))", border: "1px solid rgba(236,72,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BookOpen size={16} color="#f472b6" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "white" }}>Lessons</div>
                <div style={{ fontSize: "0.68rem", color: "#6b7280" }}>Science & skills</div>
              </div>
              <ChevronRight size={14} color="#6b7280" />
            </div>

            {/* Upgrade CTA — only show if Free */}
            {user.plan === "Free" && (
              <div className="quick-link animate-slide-in-left"
                style={{ animationDelay: "0.56s", gridColumn: "1 / -1", background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.05))", borderColor: "rgba(251,191,36,0.3)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Star size={16} color="#fbbf24" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fbbf24" }}>Upgrade to Pro</div>
                  <div style={{ fontSize: "0.68rem", color: "#92764a" }}>Unlimited sessions · Voice · Memory</div>
                </div>
                <ChevronRight size={14} color="#fbbf24" />
              </div>
            )}
          </motion.div>

        </div>

        {/* ── CUSTOMIZE DRAWER ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showCustomize && (
            <CompanionDrawer
              companion={companion}
              onClose={() => setShowCustomize(false)}
              onSave={(updates) => {
                setCompanion(prev => ({ ...prev, ...updates }));
                showNotif(`✓ ${updates.name} is ready to chat`);
              }}
            />
          )}
        </AnimatePresence>

        {/* ── NOTIFICATION ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              style={{
                position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(168,85,247,0.95))",
                color: "white", padding: "0.85rem 1.75rem", borderRadius: "999px",
                boxShadow: "0 4px 24px rgba(124,58,237,0.5)", fontSize: "0.85rem",
                fontFamily: "'Nunito',sans-serif", fontWeight: 600, zIndex: 200,
                border: "1px solid rgba(192,162,252,0.4)", whiteSpace: "nowrap",
              }}>
              {notification}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}