import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profileplan from "../../../components/08";

// ─── Google Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

   :root {
  --bg: transparent;
  --bg2: transparent;
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

body {
  background: transparent;
}

.tracker-root {
  font-family: 'Nunito', 'Poppins', sans-serif;
  background: transparent;
  min-height: 100vh;
  color: var(--text);
  position: relative;
  overflow-x: hidden;
}



    .content { position: relative; z-index: 1; }
    .display { font-family: 'Poppins', sans-serif; font-weight: 800; }
    .serif { font-family: 'Nunito', sans-serif; font-weight: 700; }

    .glass-card {
      background: rgba(42,20,80,0.75);
      border: 1px solid rgba(192,162,252,0.2);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
    }

    .glass-card-hover {
      transition: all 0.2s;
    }
    .glass-card-hover:hover {
      border-color: rgba(192,162,252,0.45);
      box-shadow: 0 8px 32px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.07);
      transform: translateY(-1px);
    }

    .nav-tab {
      font-family: 'Nunito', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.5rem 0.85rem;
      border: 1px solid transparent;
      background: none;
      cursor: pointer;
      color: var(--muted);
      transition: all 0.2s;
      border-radius: 10px;
      white-space: nowrap;
    }
    .nav-tab.active {
      color: white;
      border-color: rgba(192,162,252,0.5);
      background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.3));
    }
    .nav-tab:hover:not(.active) { color: var(--text2); background: rgba(255,255,255,0.06); }

    .btn-primary {
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 0.9rem 2rem;
      background: linear-gradient(135deg, #ec4899, #f97316);
      color: white;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(236,72,153,0.4);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(236,72,153,0.55);
    }
    .btn-primary:active { transform: translateY(0); }

    .btn-secondary {
      font-family: 'Nunito', sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.65rem 1.5rem;
      background: rgba(192,162,252,0.15);
      color: var(--purple);
      border: 1px solid rgba(192,162,252,0.35);
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { background: rgba(192,162,252,0.25); border-color: rgba(192,162,252,0.6); }

    .btn-danger {
      font-family: 'Nunito', sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.65rem 1.5rem;
      background: rgba(248,113,113,0.15);
      color: var(--red);
      border: 1px solid rgba(248,113,113,0.35);
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-danger:hover { background: rgba(248,113,113,0.25); }

    .tag-btn {
      font-family: 'Nunito', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(192,162,252,0.3);
      background: rgba(124,58,237,0.1);
      color: var(--text3);
      cursor: pointer;
      transition: all 0.18s;
    }
    .tag-btn.selected {
      background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.35));
      color: white;
      border-color: rgba(192,162,252,0.6);
    }
    .tag-btn:hover:not(.selected) { border-color: rgba(192,162,252,0.5); color: var(--text2); }

    .voice-btn {
      width: 68px; height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899, #f97316);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(236,72,153,0.45);
    }
    .voice-btn:hover { transform: scale(1.05); box-shadow: 0 6px 28px rgba(236,72,153,0.65); }
    .voice-btn.recording {
      background: linear-gradient(135deg, #dc2626, #ef4444);
      animation: pulse-ring 1.2s ease-out infinite;
      box-shadow: 0 4px 20px rgba(239,68,68,0.4);
    }
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(236,72,153,0.6); }
      70% { box-shadow: 0 0 0 22px rgba(236,72,153,0); }
      100% { box-shadow: 0 0 0 0 rgba(236,72,153,0); }
    }

    .level-input {
      width: 90px;
      text-align: center;
      font-family: 'Poppins', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: rgba(124,58,237,0.12);
      border: 2px solid rgba(192,162,252,0.35);
      border-radius: 16px;
      color: var(--purple);
      outline: none;
      padding: 0.5rem;
      transition: all 0.2s;
    }
    .level-input:focus { border-color: rgba(192,162,252,0.7); box-shadow: 0 0 0 3px rgba(124,58,237,0.2); }

    .insight-bubble {
      border-left: 3px solid var(--purple-mid);
      padding: 0.85rem 1rem;
      background: rgba(124,58,237,0.1);
      border-radius: 0 14px 14px 0;
      color: var(--text2);
      font-size: 0.88rem;
      font-weight: 500;
      line-height: 1.7;
    }

    .flame {
      display: inline-block;
      animation: flicker 1.5s ease-in-out infinite alternate;
    }
    @keyframes flicker {
      0% { transform: scaleY(1) rotate(-2deg); }
      100% { transform: scaleY(1.08) rotate(2deg); }
    }

    .gradient-text {
      background: linear-gradient(135deg, #c084fc, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .gradient-text-green {
      background: linear-gradient(135deg, #4ade80, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .breath-ring {
      border-radius: 50%;
      background: rgba(124,58,237,0.15);
      border: 2px solid rgba(192,162,252,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.1s;
    }

    .achievement-badge {
      background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05));
      border: 1px solid rgba(251,191,36,0.3);
      border-radius: 16px;
      padding: 1rem;
    }
    .achievement-badge.earned {
      background: linear-gradient(135deg, rgba(251,191,36,0.22), rgba(251,191,36,0.08));
      border-color: rgba(251,191,36,0.55);
    }
    .achievement-badge.locked {
      opacity: 0.38;
      filter: grayscale(0.5);
    }

    .slider-track {
      width: 100%;
      height: 10px;
      border-radius: 999px;
      background: rgba(124,58,237,0.25);
      outline: none;
      -webkit-appearance: none;
      cursor: pointer;
    }
    .slider-track::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 24px; height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899, #f97316);
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(236,72,153,0.5);
      border: 2px solid rgba(255,255,255,0.3);
    }
    .slider-track::-moz-range-thumb {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899, #f97316);
      cursor: pointer;
      border: 2px solid rgba(255,255,255,0.3);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(192,162,252,0.35); border-radius: 4px; }

    .glow-purple { box-shadow: 0 0 30px rgba(124,58,237,0.2); }
    .glow-green { box-shadow: 0 0 30px rgba(74,222,128,0.15); }
  `}</style>
);

const TRIGGER_TAGS = [
  "social event", "alone time", "rejection", "crowded place",
  "phone call", "quiet day", "work stress", "conflict", "new people", "small win",
  "presentation", "first time", "group setting", "performance"
];

const MOCK_AI_INSIGHTS = [
  "You consistently spike before social events but recover within hours — that's resilience, not weakness.",
  "Your anxiety is highest mid-week. Consider a 5-min grounding ritual on Tuesday mornings before the day starts.",
  "Every time you took a social action, your post-action anxiety was lower than before. You're rewriting your nervous system.",
  "Three weeks of data shows a downward trend. You're not imagining the progress — the numbers confirm it.",
];

const ACHIEVEMENTS = [
  { id: 'first_log', title: 'First Step', desc: 'Logged your very first entry', icon: '🌟', threshold: 1, type: 'logged' },
  { id: 'three_logs', title: 'Building Momentum', desc: 'Logged 3 days in a row', icon: '🔥', threshold: 3, type: 'streak' },
  { id: 'action_hero', title: 'Action Hero', desc: 'Took action despite anxiety', icon: '⚡', threshold: 1, type: 'action' },
  { id: 'courage_drop', title: 'Anxiety Slayer', desc: 'Anxiety dropped after taking action', icon: '🗡️', threshold: 1, type: 'drop' },
  { id: 'week_warrior', title: 'Week Warrior', desc: 'Logged every day this week', icon: '👑', threshold: 5, type: 'logged' },
];

const BREATHING_EXERCISES = [
  { name: '4-7-8 Breathing', icon: '🌊', inhale: 4, hold: 7, exhale: 8, color: '#c084fc', benefit: 'Deep nervous system reset' },
  { name: 'Box Breathing', icon: '📦', inhale: 4, hold: 4, exhale: 4, holdOut: 4, color: '#4ade80', benefit: 'Used by Navy SEALs for stress control' },
  { name: 'Quick Calm', icon: '💨', inhale: 2, hold: 1, exhale: 4, color: '#fbbf24', benefit: 'Fast anxiety relief in 60 seconds' },
];

const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI"];

function makeWeekData() {
  return DAYS_SHORT.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return {
      day,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      preLevel: null, postLevel: null,
      triggers: [], actionTaken: i < 3 ? Math.random() > 0.4 : false,
      reflection: "",
    };
  });
}

function getAnxietyColor(v) {
  if (v === null) return '#6b7280';
  if (v <= 3) return '#4ade80';
  if (v <= 6) return '#fbbf24';
  return '#f87171';
}

function getAnxietyLabel(v) {
  if (v === null) return '—';
  if (v <= 2) return 'Calm';
  if (v <= 4) return 'Mild';
  if (v <= 6) return 'Moderate';
  if (v <= 8) return 'High';
  return 'Intense';
}

// ── Dial Meter ──────────────────────────────────────────────────────────────
function DialMeter({ value, size = 120, label }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const pct = value !== null ? value / 10 : 0;
  const offset = circ - pct * circ * 0.75;
  const color = getAnxietyColor(value);

  return (
    <div style={{ textAlign: "center", width: size }}>
      <svg width={size} height={size * 0.85} viewBox="0 0 100 85" style={{ overflow: "visible" }}>
        <circle cx="50" cy="58" r={r} fill="none" strokeWidth="7"
          stroke="rgba(124,58,237,0.12)" strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={0} transform="rotate(135 50 58)" />
        {value !== null && (
          <circle cx="50" cy="58" r={r} fill="none" strokeWidth="7"
            stroke={color} strokeLinecap="round"
            strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
            strokeDashoffset={offset} transform="rotate(135 50 58)"
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color}88)` }} />
        )}
        <text x="50" y="62" textAnchor="middle"
          style={{ fontFamily: "'Poppins',sans-serif", fontSize: "1.5rem", fontWeight: 700, fill: color }}>
          {value !== null ? value : "–"}
        </text>
        <text x="50" y="74" textAnchor="middle"
          style={{ fontFamily: "'Nunito',sans-serif", fontSize: "0.32rem", letterSpacing: "0.15em", fill: "#9ca3af", textTransform: "uppercase" }}>
          {label}
        </text>
      </svg>
      <div style={{ fontSize: "0.62rem", color, fontFamily: "'Nunito',sans-serif", letterSpacing: "0.08em", marginTop: "-4px" }}>
        {getAnxietyLabel(value)}
      </div>
    </div>
  );
}

// ── Bar Column ──────────────────────────────────────────────────────────────
function BarColumn({ data, idx, onClick, isToday }) {
  const preH = data.preLevel !== null ? `${(data.preLevel / 10) * 100}%` : "0%";
  const postH = data.postLevel !== null ? `${(data.postLevel / 10) * 100}%` : "0%";

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        flex: 1, cursor: "pointer", padding: "0.5rem 0.25rem",
        borderRadius: "10px", transition: "all 0.2s",
        background: isToday ? "rgba(124,58,237,0.06)" : "transparent",
        border: isToday ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
      }}
      onClick={() => onClick(idx)}
    >
      <div style={{ display: "flex", gap: "3px", height: "100px", alignItems: "flex-end", width: "100%", maxWidth: "48px" }}>
        {[
          { h: preH, color: getAnxietyColor(data.preLevel), opacity: 0.8 },
          { h: postH, color: data.postLevel !== null ? getAnxietyColor(data.postLevel) : '#374151', opacity: 0.6 }
        ].map((b, bi) => (
          <div key={bi} style={{
            flex: 1, height: "100px", background: "rgba(124,58,237,0.08)",
            borderRadius: "4px 4px 0 0", position: "relative", overflow: "hidden"
          }}>
            <motion.div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: b.color, opacity: b.opacity, borderRadius: "4px 4px 0 0",
                boxShadow: data.preLevel !== null ? `0 0 8px ${b.color}66` : "none",
              }}
              initial={{ height: 0 }}
              animate={{ height: b.h }}
              transition={{ duration: 0.7, delay: idx * 0.08 + bi * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700,
          fontSize: "0.65rem", color: isToday ? "#c084fc" : "#9ca3af",
          letterSpacing: "0.1em"
        }}>{data.day}</div>
        <div style={{ fontSize: "0.58rem", color: "#6b7280" }}>{data.date}</div>
        {data.actionTaken && <div style={{ fontSize: "0.6rem", color: "#4ade80", marginTop: "2px" }}>✓</div>}
      </div>
    </div>
  );
}

// ── Courage Graph ──────────────────────────────────────────────────────────
function CourageGraph({ weekData }) {
  const pts = weekData.filter(d => d.preLevel !== null);
  if (pts.length < 2) return (
    <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#6b7280", fontStyle: "italic", fontSize: "0.85rem" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📊</div>
      Log more days to reveal your courage pattern
    </div>
  );

  const W = 280, H = 100;
  const xStep = W / (pts.length - 1 || 1);
  const toY = v => H - (v / 10) * H;

  const prePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${i * xStep},${toY(p.preLevel)}`).join(" ");
  const postPts = pts.filter(p => p.postLevel !== null);
  const postPath = postPts.length > 1
    ? postPts.map((p, i) => {
        const xi = pts.indexOf(p);
        return `${i === 0 ? "M" : "L"}${xi * xStep},${toY(p.postLevel)}`;
      }).join(" ")
    : null;

  const areaPath = pts.length > 1
    ? `${prePath} L${(pts.length - 1) * xStep},${H} L0,${H} Z`
    : null;

  return (
    <div>
      <svg width="100%" viewBox={`-10 -10 ${W + 20} ${H + 25}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.01" />
          </linearGradient>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {[0, 2.5, 5, 7.5, 10].map(v => (
          <g key={v}>
            <line x1={-10} y1={toY(v)} x2={W + 10} y2={toY(v)} stroke="rgba(124,58,237,0.08)" strokeWidth="1" />
            <text x={-12} y={toY(v) + 4} textAnchor="end" style={{ fontSize: "0.28rem", fill: "#4b5563" }}>{v}</text>
          </g>
        ))}

        {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
        <path d={prePath} fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-purple)" />
        {postPath && <path d={postPath} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-green)" />}

        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={i * xStep} cy={toY(p.preLevel)} r="5" fill="#c084fc" stroke="#030712" strokeWidth="2" />
            {p.postLevel !== null && (
              <circle cx={i * xStep} cy={toY(p.postLevel)} r="5" fill="#4ade80" stroke="#030712" strokeWidth="2" />
            )}
            <text x={i * xStep} y={H + 16} textAnchor="middle" style={{ fontSize: "0.3rem", fill: "#6b7280", letterSpacing: "0.1em" }}>
              {p.day}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "0.75rem" }}>
        {[{ c: "#c084fc", label: "Before action" }, { c: "#4ade80", label: "After action" }].map(l => (
          <span key={l.label} style={{ fontSize: "0.72rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 20, height: 2.5, background: l.c, display: "inline-block", borderRadius: 2, boxShadow: `0 0 6px ${l.c}88` }} /> {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function getLoggedDays(weekData) {
  return weekData.filter((d) => d.preLevel !== null);
}

function getAverageDrop(loggedDays) {
  const drops = loggedDays
    .filter((d) => d.postLevel !== null)
    .map((d) => d.preLevel - d.postLevel);
  if (!drops.length) return null;
  return (drops.reduce((sum, value) => sum + value, 0) / drops.length).toFixed(1);
}

function getTopTriggerEntries(weekData) {
  const counts = {};
  weekData.forEach((day) => {
    day.triggers.forEach((trigger) => {
      counts[trigger] = (counts[trigger] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }));
}

function getSuggestedReset(level) {
  if (level <= 3) {
    return {
      label: "Steady enough to stretch",
      action: "Send one low-pressure message or ask one simple question today.",
      color: "#4ade80",
    };
  }
  if (level <= 6) {
    return {
      label: "Regulate, then engage",
      action: "Do one minute of box breathing, then take one tiny social action within the hour.",
      color: "#fbbf24",
    };
  }
  return {
    label: "Safety first, then a micro-step",
    action: "Ground with breath or cold water, then lower the goal to eye contact, a wave, or one sentence.",
    color: "#f87171",
  };
}

// ── Anxiety Education Cards (science-backed knowledge bites) ──────────────
const ANXIETY_SCIENCE_CARDS = [
  {
    id: "window",
    icon: "🧠",
    title: "Window of Tolerance",
    color: "#c084fc",
    short: "Your nervous system has a sweet spot for growth.",
    full: "When anxiety is too low, you're not challenged. When it's too high, you freeze. The sweet spot in between — your 'window of tolerance' — is where real social growth happens. Your goal isn't zero anxiety. It's learning to act inside your window.",
    actionPrompt: "Rate where you feel you are right now:",
    actionLabels: ["Too low (bored)", "In the window ✓", "Too high (frozen)"],
  },
  {
    id: "amygdala",
    icon: "⚡",
    title: "The Amygdala Hijack",
    color: "#f472b6",
    short: "Your brain's alarm is louder than it needs to be.",
    full: "Social anxiety fires the same brain alarm as physical danger. Your amygdala can't always tell the difference between a saber-tooth tiger and an awkward conversation. But every time you act despite the alarm, you literally train it to fire less.",
    actionPrompt: "How many times did you act despite the alarm this week?",
    actionLabels: ["0 — this is new info", "1–2 times", "3+ times 🔥"],
  },
  {
    id: "habituation",
    icon: "📉",
    title: "Habituation",
    color: "#4ade80",
    short: "Anxiety always drops if you stay in the moment long enough.",
    full: "Anxiety is not permanent. Research shows it peaks within 10 minutes and drops on its own — even if you do nothing. Avoidance breaks this cycle. Staying through the discomfort teaches your brain: 'I survived. This isn't dangerous.'",
    actionPrompt: "Did you notice anxiety drop after staying in a situation?",
    actionLabels: ["Not yet", "Once or twice", "Yes, clearly"],
  },
  {
    id: "self-compassion",
    icon: "💜",
    title: "Self-Compassion > Self-Criticism",
    color: "#fbbf24",
    short: "Being hard on yourself makes anxiety worse, not better.",
    full: "Studies show self-criticism activates the same threat response as social danger. People who practice self-compassion recover from anxious moments faster and take more social risks. Treating yourself kindly is a performance strategy, not weakness.",
    actionPrompt: "What is your inner voice usually like after a hard social moment?",
    actionLabels: ["Harsh critic", "Mixed", "Pretty kind"],
  },
];

const TRIGGER_PLAYBOOK_EXTENDED = {
  "social event": {
    title: "Before a social event",
    icon: "🎉",
    microAction: "Arrive 5 minutes early and find one safe anchor point — the drinks table, a wall edge, or the host.",
    reframe: "You don't need to impress everyone. You only need one grounded first minute.",
    scienceNote: "Anticipatory anxiety peaks before the event — the moment you walk in, it drops. Your brain is lying about how bad it will be.",
  },
  "group setting": {
    title: "In a group setting",
    icon: "👥",
    microAction: "Use one bridge question: 'How do you know everyone here?' or 'What brought you here today?'",
    reframe: "Groups feel fast because your brain is scanning for danger. Slow the moment down with one simple question.",
    scienceNote: "Asking questions shifts your focus outward — the single fastest way to reduce self-monitoring anxiety.",
  },
  "new people": {
    title: "Meeting new people",
    icon: "🤝",
    microAction: "Focus on their name plus one follow-up question instead of thinking about your own performance.",
    reframe: "Curiosity lowers pressure better than trying to be interesting.",
    scienceNote: "People remember how you made them feel, not what you said. Genuine interest is your most powerful social tool.",
  },
  "phone call": {
    title: "Before a phone call",
    icon: "📞",
    microAction: "Write three bullets: why you're calling, one question, one close-out sentence.",
    reframe: "A structured call is easier on your nervous system than improvising everything.",
    scienceNote: "Having a script reduces working memory load, freeing cognitive resources to actually listen.",
  },
  "work stress": {
    title: "When work stress spills socially",
    icon: "💼",
    microAction: "Take one 90-second reset before replying or joining a conversation.",
    reframe: "Stress makes connection feel heavier than it is. Reset first, then engage.",
    scienceNote: "Stress hormones from unrelated sources amplify social anxiety. A brief reset can literally clear the bloodstream.",
  },
  default: {
    title: "When anxiety spikes",
    icon: "🌊",
    microAction: "Name the moment, rate it out of 10, then take one tiny outward action within 5 minutes.",
    reframe: "Relief comes faster when you pair awareness with a small action.",
    scienceNote: "Labeling an emotion ('I feel anxious') reduces amygdala activation. Naming it is already doing something.",
  },
};

const MICRO_CHALLENGES = [
  { id: "mc1", icon: "👋", title: "The Wave", desc: "Wave or nod at one person you'd normally avoid eye contact with.", xp: 10, difficulty: "Beginner" },
  { id: "mc2", icon: "💬", title: "One Sentence", desc: "Say one sentence to someone you don't normally talk to.", xp: 20, difficulty: "Easy" },
  { id: "mc3", icon: "❓", title: "Ask It", desc: "Ask one genuine question in a group conversation.", xp: 30, difficulty: "Medium" },
  { id: "mc4", icon: "📱", title: "The Call", desc: "Make one phone call instead of texting.", xp: 40, difficulty: "Medium" },
  { id: "mc5", icon: "🙋", title: "Volunteer", desc: "Volunteer to speak first or go next in any group setting.", xp: 60, difficulty: "Hard" },
  { id: "mc6", icon: "🎯", title: "Cold Start", desc: "Start a conversation with a complete stranger.", xp: 80, difficulty: "Hard" },
];

function AnxietySupportHub({ weekData, onLogNow, onReviewDay }) {
  const [focus, setFocus] = useState("pattern");
  const [expandedCard, setExpandedCard] = useState(null);
  const [cardResponses, setCardResponses] = useState({});
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [challengeFeedback, setChallengeFeedback] = useState(null);
  const [activeTriggerKey, setActiveTriggerKey] = useState("default");

  const loggedDays = getLoggedDays(weekData);
  const avgPre = loggedDays.length
    ? (loggedDays.reduce((sum, day) => sum + day.preLevel, 0) / loggedDays.length).toFixed(1)
    : null;
  const avgDrop = getAverageDrop(loggedDays);
  const actionDays = loggedDays.filter((day) => day.actionTaken).length;
  const topTriggers = getTopTriggerEntries(weekData);
  const recoveryWins = loggedDays.filter((day) => day.postLevel !== null && day.postLevel < day.preLevel).length;
  const today = weekData[4];
  const currentLevel = today.preLevel ?? (avgPre ? Math.round(parseFloat(avgPre)) : 5);
  const resetPlan = getSuggestedReset(currentLevel);

  const totalXP = completedChallenges.reduce((sum, id) => {
    const ch = MICRO_CHALLENGES.find(c => c.id === id);
    return sum + (ch?.xp ?? 0);
  }, 0);

  const handleCardResponse = (cardId, responseIdx) => {
    setCardResponses(prev => ({ ...prev, [cardId]: responseIdx }));
  };

  const handleCompleteChallenge = (id) => {
    if (completedChallenges.includes(id)) return;
    setCompletedChallenges(prev => [...prev, id]);
    const ch = MICRO_CHALLENGES.find(c => c.id === id);
    setChallengeFeedback(`+${ch.xp} XP — ${ch.title} complete! 🔥`);
    setTimeout(() => setChallengeFeedback(null), 2500);
  };

  const difficultyColor = { Beginner: "#4ade80", Easy: "#a3e635", Medium: "#fbbf24", Hard: "#f87171" };

  const activeTrigger = topTriggers.length > 0
    ? (activeTriggerKey === "default" ? topTriggers[0].name : activeTriggerKey)
    : "default";
  const triggerGuide = TRIGGER_PLAYBOOK_EXTENDED[activeTrigger] || TRIGGER_PLAYBOOK_EXTENDED.default;

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {/* Header Card */}
      <div
        className="glass-card"
        style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, rgba(33,11,66,0.98) 0%, rgba(56,17,104,0.92) 55%, rgba(92,28,124,0.72) 100%)",
          border: "1px solid rgba(216,180,254,0.24)",
          boxShadow: "0 18px 48px rgba(64,18,122,0.32)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(236,72,153,0.08)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "flex-start", marginBottom: "1rem", position: "relative" }}>
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a78bfa", marginBottom: "0.35rem" }}>
              Anxiety Support Hub
            </div>
            <div className="display" style={{ fontSize: "1.18rem", color: "white", lineHeight: 1.15 }}>
              Your week, decoded
            </div>
            <div style={{ fontSize: "0.8rem", color: "#d8c8f8", lineHeight: 1.55, marginTop: "0.35rem" }}>
              Patterns, science, challenges — tools you can use right now.
            </div>
          </div>
          <button className="btn-secondary" onClick={onLogNow} style={{ padding: "0.6rem 0.95rem", flexShrink: 0 }}>
            Log now
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
          {[
            { label: "Avg level", value: avgPre ? `${avgPre}` : "—", sub: "/10", color: avgPre ? getAnxietyColor(parseFloat(avgPre)) : "#a78bfa" },
            { label: "Recovery wins", value: `${recoveryWins}`, sub: "", color: "#4ade80" },
            { label: "Avg drop", value: avgDrop ? `${avgDrop}` : "—", sub: " pts", color: "#fbbf24" },
            { label: "XP earned", value: `${totalXP}`, sub: "", color: "#f472b6" },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "0.75rem 0.5rem", borderRadius: "14px", background: "rgba(17,24,39,0.25)", border: "1px solid rgba(192,162,252,0.14)", textAlign: "center" }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                {stat.value}<span style={{ fontSize: "0.6rem", opacity: 0.7 }}>{stat.sub}</span>
              </div>
              <div style={{ fontSize: "0.58rem", color: "#b8a4de", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: "0.2rem", lineHeight: 1.2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: "0.3rem", overflowX: "auto", paddingBottom: "2px" }}>
        {[
          { id: "pattern", label: "📊 Patterns" },
          { id: "science", label: "🧠 Science" },
          { id: "triggers", label: "⚡ Triggers" },
          { id: "challenges", label: "🎯 Challenges" },
          { id: "reset", label: "🌊 Reset now" },
        ].map((item) => (
          <button
            key={item.id}
            className={`nav-tab ${focus === item.id ? "active" : ""}`}
            onClick={() => setFocus(item.id)}
            style={{ minWidth: "fit-content", fontSize: "0.65rem" }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* PATTERN TAB */}
      {focus === "pattern" && (
        <motion.div key="pattern" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: "1.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
              <div>
                <div className="display" style={{ fontSize: "1.05rem", color: "white", marginBottom: "0.25rem" }}>Your anxiety curve</div>
                <div style={{ fontSize: "0.78rem", color: "#b8a4de", lineHeight: 1.6 }}>
                  Purple = before. Green = after action. Tap a day to review it.
                </div>
              </div>
              <div style={{ fontSize: "0.7rem", color: "#4ade80", fontWeight: 700, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "8px", padding: "0.3rem 0.6rem", whiteSpace: "nowrap" }}>
                {actionDays} action {actionDays === 1 ? "day" : "days"}
              </div>
            </div>

            <CourageGraph weekData={weekData} />

            <div style={{ display: "flex", gap: "0.4rem", marginTop: "1.1rem" }}>
              {weekData.map((day, idx) => {
                const logged = day.preLevel !== null;
                const delta = day.postLevel !== null ? day.preLevel - day.postLevel : null;
                return (
                  <button key={idx} onClick={() => onReviewDay(idx)} style={{
                    flex: 1, padding: "0.65rem 0.4rem", borderRadius: "12px", border: "1px solid",
                    borderColor: logged ? "rgba(192,162,252,0.25)" : "rgba(192,162,252,0.1)",
                    background: logged ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.04)",
                    cursor: "pointer", color: "inherit", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "0.6rem", fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: logged ? "#c084fc" : "#4b5563", letterSpacing: "0.08em" }}>{day.day}</div>
                    {logged ? (
                      <>
                        <div style={{ fontSize: "0.85rem", fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: getAnxietyColor(day.preLevel), marginTop: "0.2rem" }}>{day.preLevel}</div>
                        {delta !== null && (
                          <div style={{ fontSize: "0.6rem", color: delta > 0 ? "#4ade80" : "#f87171", marginTop: "0.1rem" }}>
                            {delta > 0 ? `↓${delta}` : `↑${Math.abs(delta)}`}
                          </div>
                        )}
                        {day.actionTaken && <div style={{ fontSize: "0.55rem", color: "#4ade80", marginTop: "0.1rem" }}>✓</div>}
                      </>
                    ) : (
                      <div style={{ fontSize: "0.65rem", color: "#374151", marginTop: "0.3rem" }}>—</div>
                    )}
                  </button>
                );
              })}
            </div>

            {loggedDays.length > 0 && (
              <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280" }}>Recent entries</div>
                {loggedDays.slice(-3).reverse().map((day, index) => {
                  const delta = day.postLevel !== null ? day.preLevel - day.postLevel : null;
                  return (
                    <button
                      key={`${day.day}-${index}`}
                      onClick={() => onReviewDay(weekData.findIndex((e) => e.day === day.day && e.date === day.date))}
                      style={{ textAlign: "left", width: "100%", padding: "0.85rem 1rem", borderRadius: "14px", border: "1px solid rgba(192,162,252,0.12)", background: "rgba(12,10,27,0.35)", cursor: "pointer", color: "inherit" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#f5edff" }}>{day.day} · {day.date}</div>
                          <div style={{ fontSize: "0.72rem", color: "#b8a4de", marginTop: "0.18rem" }}>
                            {delta !== null
                              ? delta > 0 ? `Down ${delta} pt${delta === 1 ? "" : "s"} after action — real evidence.`
                              : "Held steady after showing up. That counts."
                              : "Tap to log how you felt after."}
                          </div>
                        </div>
                        <div style={{ color: delta !== null && delta > 0 ? "#4ade80" : "#c084fc", fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                          {delta !== null ? `${day.preLevel}→${day.postLevel}` : "Add after"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* SCIENCE TAB */}
      {focus === "science" && (
        <motion.div key="science" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#b8a4de", lineHeight: 1.65, padding: "0 0.25rem" }}>
              Tap any card to understand the science behind what you feel — then tell us where you are.
            </div>
            {ANXIETY_SCIENCE_CARDS.map((card) => {
              const isOpen = expandedCard === card.id;
              const response = cardResponses[card.id];
              return (
                <motion.div
                  key={card.id}
                  layout
                  className="glass-card glass-card-hover"
                  style={{
                    padding: "1.1rem 1.15rem",
                    border: `1px solid ${isOpen ? card.color + "44" : "rgba(192,162,252,0.18)"}`,
                    background: isOpen
                      ? `linear-gradient(135deg, ${card.color}0d 0%, rgba(22,10,44,0.92) 100%)`
                      : "rgba(42,20,80,0.72)",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedCard(isOpen ? null : card.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "12px", flexShrink: 0,
                      background: `${card.color}18`, border: `1px solid ${card.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
                    }}>{card.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "white" }}>{card.title}</div>
                      <div style={{ fontSize: "0.74rem", color: "#b8a4de", marginTop: "0.1rem" }}>{card.short}</div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: card.color, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</div>
                    {response !== undefined && <div style={{ fontSize: "0.65rem", color: "#4ade80", fontWeight: 700, flexShrink: 0 }}>✓</div>}
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${card.color}22` }}>
                          <div style={{ fontSize: "0.82rem", color: "#e8deff", lineHeight: 1.72, marginBottom: "1rem" }}>{card.full}</div>
                          <div style={{ fontSize: "0.72rem", color: card.color, fontWeight: 700, marginBottom: "0.6rem", letterSpacing: "0.05em" }}>{card.actionPrompt}</div>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            {card.actionLabels.map((label, i) => (
                              <button
                                key={i}
                                onClick={() => handleCardResponse(card.id, i)}
                                style={{
                                  flex: 1, minWidth: "fit-content", padding: "0.55rem 0.75rem", borderRadius: "12px", border: "1px solid",
                                  borderColor: response === i ? card.color : "rgba(192,162,252,0.2)",
                                  background: response === i ? `${card.color}22` : "rgba(124,58,237,0.06)",
                                  color: response === i ? card.color : "#b8a4de",
                                  fontSize: "0.72rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                                  cursor: "pointer", transition: "all 0.18s",
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          {response !== undefined && (
                            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                              className="insight-bubble"
                              style={{ marginTop: "0.85rem", borderColor: card.color }}>
                              {response === 0
                                ? "Good awareness. Knowing where you are is step one. Keep observing."
                                : response === 1
                                ? "You are building real insight. This awareness compounds over time."
                                : "That is genuine growth. Your nervous system is learning."}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TRIGGERS TAB */}
      {focus === "triggers" && (
        <motion.div key="triggers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: "1.35rem" }}>
            <div className="display" style={{ fontSize: "1.05rem", color: "white", marginBottom: "0.3rem" }}>What sets it off</div>
            <div style={{ fontSize: "0.78rem", color: "#b8a4de", lineHeight: 1.6, marginBottom: "1rem" }}>
              Select a trigger for a specific micro-action, reframe, and the science behind why it affects you.
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
              {(topTriggers.length
                ? topTriggers
                : Object.keys(TRIGGER_PLAYBOOK_EXTENDED).filter(k => k !== "default").map(k => ({ name: k, count: 0 }))
              ).map((item) => (
                <button
                  key={item.name}
                  className={`tag-btn ${activeTrigger === item.name ? "selected" : ""}`}
                  onClick={() => setActiveTriggerKey(item.name)}
                >
                  {TRIGGER_PLAYBOOK_EXTENDED[item.name]?.icon || "•"} {item.name}
                  {item.count > 0 && <span style={{ opacity: 0.6, marginLeft: "4px" }}>x{item.count}</span>}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrigger}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{
                  padding: "1.1rem",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, rgba(34,12,58,0.92), rgba(69,28,109,0.65))",
                  border: "1px solid rgba(216,180,254,0.22)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>{triggerGuide.icon}</span>
                  <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#f472b6" }}>
                    {triggerGuide.title}
                  </div>
                </div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.18)" }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#f472b6", marginBottom: "0.3rem" }}>⚡ Micro-action</div>
                    <div style={{ fontSize: "0.8rem", color: "#f3e8ff", lineHeight: 1.65 }}>{triggerGuide.microAction}</div>
                  </div>
                  <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.18)" }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#c084fc", marginBottom: "0.3rem" }}>💭 Reframe</div>
                    <div style={{ fontSize: "0.8rem", color: "#d8c8f8", lineHeight: 1.65 }}>{triggerGuide.reframe}</div>
                  </div>
                  <div style={{ padding: "0.85rem", borderRadius: "12px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#4ade80", marginBottom: "0.3rem" }}>🧠 Why it works</div>
                    <div style={{ fontSize: "0.78rem", color: "#d1fae5", lineHeight: 1.65 }}>{triggerGuide.scienceNote}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* CHALLENGES TAB */}
      {focus === "challenges" && (
        <motion.div key="challenges" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: "1.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
              <div>
                <div className="display" style={{ fontSize: "1.05rem", color: "white", marginBottom: "0.25rem" }}>Daily micro-challenges</div>
                <div style={{ fontSize: "0.78rem", color: "#b8a4de", lineHeight: 1.5 }}>
                  Each rep trains your nervous system. Complete one today.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "1.1rem", fontWeight: 700 }} className="gradient-text">{totalXP} XP</div>
                <div style={{ fontSize: "0.58rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>earned</div>
              </div>
            </div>

            <div style={{ marginBottom: "1.15rem" }}>
              <div style={{ height: 6, borderRadius: "999px", background: "rgba(124,58,237,0.15)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalXP / 240) * 100, 100)}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #ec4899, #f97316)", borderRadius: "999px", boxShadow: "0 0 8px rgba(236,72,153,0.4)" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.58rem", color: "#4b5563", marginTop: "0.3rem" }}>
                <span>0</span><span>Level up at 240 XP</span>
              </div>
            </div>

            <div style={{ display: "grid", gap: "0.55rem" }}>
              {MICRO_CHALLENGES.map((ch) => {
                const done = completedChallenges.includes(ch.id);
                return (
                  <motion.div
                    key={ch.id}
                    layout
                    style={{
                      padding: "0.95rem 1rem",
                      borderRadius: "16px",
                      border: `1px solid ${done ? "rgba(74,222,128,0.3)" : "rgba(192,162,252,0.14)"}`,
                      background: done ? "rgba(74,222,128,0.06)" : "rgba(12,10,27,0.35)",
                      display: "flex", gap: "0.85rem", alignItems: "center",
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
                      background: done ? "rgba(74,222,128,0.15)" : "rgba(124,58,237,0.12)",
                      border: `1px solid ${done ? "rgba(74,222,128,0.3)" : "rgba(124,58,237,0.2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                    }}>{done ? "✓" : ch.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.84rem", color: done ? "#4ade80" : "white" }}>{ch.title}</div>
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, color: difficultyColor[ch.difficulty], background: `${difficultyColor[ch.difficulty]}18`, padding: "0.2rem 0.55rem", borderRadius: "999px", border: `1px solid ${difficultyColor[ch.difficulty]}33` }}>
                          {ch.difficulty}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#b8a4de", marginTop: "0.15rem", lineHeight: 1.45 }}>{ch.desc}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.65rem", color: "#f472b6", fontWeight: 700 }}>+{ch.xp} XP</span>
                        {!done ? (
                          <button
                            onClick={() => handleCompleteChallenge(ch.id)}
                            style={{
                              padding: "0.35rem 0.85rem", borderRadius: "999px", border: "1px solid rgba(236,72,153,0.4)",
                              background: "rgba(236,72,153,0.1)", color: "#f472b6", fontSize: "0.7rem",
                              fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                            }}
                          >
                            Mark done
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.68rem", color: "#4ade80", fontWeight: 700 }}>Complete 🎉</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {challengeFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: "fixed", bottom: "6rem", left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, rgba(236,72,153,0.95), rgba(249,115,22,0.95))",
                  color: "white", padding: "0.75rem 1.5rem", borderRadius: "999px",
                  boxShadow: "0 4px 24px rgba(236,72,153,0.5)", fontSize: "0.85rem",
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, zIndex: 200,
                }}>
                {challengeFeedback}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* RESET TAB */}
      {focus === "reset" && (
        <motion.div key="reset" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: "1.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div className="display" style={{ fontSize: "1.05rem", color: "white", marginBottom: "0.25rem" }}>What to do right now</div>
                <div style={{ fontSize: "0.78rem", color: "#b8a4de", lineHeight: 1.6 }}>
                  Based on today's level — your nervous system's best next move.
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: resetPlan.color }}>{currentLevel}<span style={{ fontSize: "0.7rem", opacity: 0.7 }}>/10</span></div>
                <div style={{ fontSize: "0.58rem", color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase" }}>today</div>
              </div>
            </div>

            <div style={{
              padding: "0.95rem 1.1rem", borderRadius: "18px", marginBottom: "1rem",
              background: `${resetPlan.color}12`, border: `1px solid ${resetPlan.color}33`,
            }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.92rem", color: resetPlan.color, marginBottom: "0.3rem" }}>{resetPlan.label}</div>
              <div style={{ fontSize: "0.8rem", color: "#f3e8ff", lineHeight: 1.65 }}>{resetPlan.action}</div>
            </div>

            <div style={{ display: "grid", gap: "0.55rem" }}>
              {[
                {
                  icon: "🏷️",
                  title: "Step 1 — Name it",
                  body: "Say out loud or write: 'I feel anxious at a X/10 right now.' Naming an emotion reduces amygdala activation immediately.",
                  color: "#c084fc",
                },
                {
                  icon: "🌬️",
                  title: "Step 2 — Breathe (60 seconds)",
                  body: "Four counts in, four hold, four out. One minute of this shifts your nervous system from threat to recovery mode.",
                  color: "#4ade80",
                },
                {
                  icon: "⚡",
                  title: "Step 3 — Smallest step",
                  body: "Do not wait to feel calm. Choose the tiniest social action available: eye contact, a message, one sentence. Action creates the calm.",
                  color: "#fbbf24",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "0.9rem 1rem", borderRadius: "16px",
                    background: "rgba(12,10,27,0.35)", border: "1px solid rgba(192,162,252,0.12)",
                    display: "flex", gap: "0.85rem", alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: "0.1rem",
                    background: `${item.color}18`, border: `1px solid ${item.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem",
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.84rem", color: item.color, marginBottom: "0.2rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.77rem", color: "#cfc1ee", lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={onLogNow}
              style={{ width: "100%", marginTop: "1.1rem", fontSize: "0.88rem" }}
            >
              Log how you feel after →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}


// ── Breathing Exercise ─────────────────────────────────────────────────────
function BreathingExercise() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | inhale | hold | exhale | holdOut
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [ringSize, setRingSize] = useState(100);
  const timerRef = useRef(null);
  const ex = BREATHING_EXERCISES[selected];

  const stop = () => {
    clearInterval(timerRef.current);
    setPhase("idle");
    setCountdown(0);
    setRingSize(100);
  };

  const start = () => {
    setCycles(0);
    let currentPhase = "inhale";
    let current = ex.inhale;
    setPhase("inhale");
    setCountdown(ex.inhale);
    setRingSize(150);

    timerRef.current = setInterval(() => {
      current--;
      setCountdown(current);

      if (current <= 0) {
        if (currentPhase === "inhale") {
          if (ex.hold && ex.hold > 0) {
            currentPhase = "hold";
            current = ex.hold;
            setPhase("hold");
            setCountdown(ex.hold);
          } else {
            currentPhase = "exhale";
            current = ex.exhale;
            setPhase("exhale");
            setCountdown(ex.exhale);
            setRingSize(80);
          }
        } else if (currentPhase === "hold") {
          currentPhase = "exhale";
          current = ex.exhale;
          setPhase("exhale");
          setCountdown(ex.exhale);
          setRingSize(80);
        } else if (currentPhase === "exhale") {
          if (ex.holdOut && ex.holdOut > 0) {
            currentPhase = "holdOut";
            current = ex.holdOut;
            setPhase("holdOut");
            setCountdown(ex.holdOut);
          } else {
            currentPhase = "inhale";
            current = ex.inhale;
            setPhase("inhale");
            setCountdown(ex.inhale);
            setRingSize(150);
            setCycles(c => c + 1);
          }
        } else if (currentPhase === "holdOut") {
          currentPhase = "inhale";
          current = ex.inhale;
          setPhase("inhale");
          setCountdown(ex.inhale);
          setRingSize(150);
          setCycles(c => c + 1);
        }
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const phaseLabel = { idle: "Ready", inhale: "Breathe In", hold: "Hold", exhale: "Breathe Out", holdOut: "Hold" };
  const phaseColor = { idle: "#c084fc", inhale: "#4ade80", hold: "#fbbf24", exhale: "#c084fc", holdOut: "#fbbf24" };

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {BREATHING_EXERCISES.map((e, i) => (
          <button key={i} className={`tag-btn ${selected === i ? "selected" : ""}`}
            onClick={() => { stop(); setSelected(i); }}>
            {e.icon} {e.name}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "0.5rem", fontStyle: "italic" }}>{ex.benefit}</div>
        
        {/* Breathing ring */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", margin: "0.5rem 0" }}>
          <div style={{
            width: `${ringSize}px`, height: `${ringSize}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${phaseColor[phase]}18 0%, transparent 70%)`,
            border: `2px solid ${phaseColor[phase]}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: phase !== "idle" ? `0 0 40px ${phaseColor[phase]}33` : "none",
            transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
          }}>
            <div style={{
              width: `${ringSize * 0.65}px`, height: `${ringSize * 0.65}px`,
              borderRadius: "50%",
              background: `${phaseColor[phase]}18`,
              border: `1.5px solid ${phaseColor[phase]}44`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "2rem", fontWeight: 700, color: phaseColor[phase] }}>
                {phase === "idle" ? "✦" : countdown}
              </div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: phaseColor[phase], opacity: 0.8 }}>
                {phaseLabel[phase]}
              </div>
            </div>
          </div>
        </div>

        {cycles > 0 && (
          <div style={{ fontSize: "0.75rem", color: "#4ade80", marginBottom: "0.5rem" }}>
            ✓ {cycles} {cycles === 1 ? "cycle" : "cycles"} complete
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          {phase === "idle"
            ? <button className="btn-primary" onClick={start}>Begin Exercise</button>
            : <button className="btn-danger" onClick={stop}>Stop</button>
          }
        </div>
      </div>
    </div>
  );
}

// ── Story Card ─────────────────────────────────────────────────────────────
function StoryCard({ weekData, streak }) {
  const logged = weekData.filter(d => d.preLevel !== null).length;
  const actions = weekData.filter(d => d.actionTaken).length;
  const avg = logged > 0
    ? (weekData.filter(d => d.preLevel !== null).reduce((a, b) => a + b.preLevel, 0) / logged).toFixed(1)
    : null;
  const vals = weekData.filter(d => d.preLevel !== null).map(d => d.preLevel);
  const improving = vals.length >= 2 ? vals[vals.length - 1] < vals[0] : null;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.15) 50%, rgba(236,72,153,0.15) 100%)",
      border: "1px solid rgba(124,58,237,0.4)",
      borderRadius: "20px",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(124,58,237,0.1)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(236,72,153,0.08)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c084fc", marginBottom: "0.75rem" }}>
          This Week's Story
        </div>
        <div className="display" style={{ fontSize: "1.7rem", lineHeight: 1.2, marginBottom: "1.25rem", color: "white" }}>
          {logged === 0
            ? "Your story begins\nwhen you log day one."
            : improving
            ? "You showed up,\nand you're already lighter."
            : `${logged} days logged.\nEvery single one counts.`}
        </div>
        <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Days logged", val: `${logged}/5` },
            { label: "Avg anxiety", val: avg ? `${avg}/10` : "—" },
            { label: "Actions taken", val: actions },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#c084fc" }}>{s.val}</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "white" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button className="btn-secondary" onClick={() => {
          const text = `This week on Connect: ${logged} days logged, avg anxiety ${avg}/10, ${actions} social actions taken.`;
          navigator.clipboard?.writeText(text);
        }}>
          Share this week ↗
        </button>
      </div>
    </div>
  );
}

// ── Log Modal ──────────────────────────────────────────────────────────────
function LogModal({ dayData, dayIdx, onSave, onClose }) {
  const [phase, setPhase] = useState("pre");
  const [preLevel, setPreLevel] = useState(dayData.preLevel ?? 5);
  const [postLevel, setPostLevel] = useState(dayData.postLevel ?? 5);
  const [triggers, setTriggers] = useState(dayData.triggers || []);
  const [reflection, setReflection] = useState(dayData.reflection || "");
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [hasPreLog, setHasPreLog] = useState(dayData.preLevel !== null);
  const [hasPostLog, setHasPostLog] = useState(dayData.postLevel !== null);

  const toggleTrigger = t => setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const simulateVoice = () => {
    if (voiceActive) { setVoiceActive(false); return; }
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      setVoiceText("Feeling pretty tense after the team lunch. Wasn't sure what to say.");
      setPreLevel(7);
      setHasPreLog(true);
    }, 2500);
  };

  const handleSave = () => {
    onSave(dayIdx, {
      preLevel: hasPreLog ? Number(preLevel) : null,
      postLevel: hasPostLog ? Number(postLevel) : null,
      triggers,
      reflection,
    });
    onClose();
  };

  const currentLevel = phase === "pre" ? preLevel : postLevel;
  const color = getAnxietyColor(currentLevel);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(3,7,18,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}>
      <motion.div initial={{ y: 30, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }} className="glass-card"
        style={{ width: "100%", maxWidth: 430, padding: "1.75rem", maxHeight: "92vh", overflowY: "auto", borderColor: "rgba(124,58,237,0.3)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div className="display" style={{ fontSize: "1.5rem", color: "white" }}>{dayData.day}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{dayData.date}</div>
          </div>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", color: "#9ca3af", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
            ✕
          </button>
        </div>

        {/* Phase Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "4px" }}>
          {[{ id: "pre", label: "Before Action" }, { id: "post", label: "After Action" }].map(p => (
            <button key={p.id}
              onClick={() => setPhase(p.id)}
              style={{
                flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", cursor: "pointer",
                fontFamily: "'Nunito',sans-serif", fontSize: "0.72rem", letterSpacing: "0.05em",
                background: phase === p.id ? "rgba(124,58,237,0.25)" : "transparent",
                color: phase === p.id ? "#c084fc" : "#6b7280",
                transition: "all 0.2s",
              }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Voice */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button className={`voice-btn ${voiceActive ? "recording" : ""}`} onClick={simulateVoice}>
            {voiceActive ? "⏹" : "🎙"}
          </button>
          <div style={{ fontSize: "0.72rem", color: "#6b7280", letterSpacing: "0.06em" }}>
            {voiceActive ? "Listening…" : "Tap to speak your level"}
          </div>
          <AnimatePresence>
            {voiceText && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="insight-bubble" style={{ width: "100%" }}>
                "{voiceText}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slider input */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {phase === "pre" ? "Anxiety before action" : "Anxiety after action"}
            </div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "1.4rem", fontWeight: 700, color, transition: "color 0.3s" }}>
              {currentLevel}/10
              <span style={{ fontSize: "0.7rem", fontFamily: "'Nunito',sans-serif", fontWeight: 400, color, marginLeft: "0.35rem", opacity: 0.8 }}>
                {getAnxietyLabel(currentLevel)}
              </span>
            </div>
          </div>
          <input
            type="range" min="0" max="10" step="1" className="slider-track"
            value={phase === "pre" ? preLevel : postLevel}
            onChange={e => {
              const v = parseInt(e.target.value);
              if (phase === "pre") { setPreLevel(v); setHasPreLog(true); }
              else { setPostLevel(v); setHasPostLog(true); }
            }}
            style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${currentLevel * 10}%, rgba(124,58,237,0.2) ${currentLevel * 10}%, rgba(124,58,237,0.2) 100%)` }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#6b7280", marginTop: "0.35rem" }}>
            <span>😊 Calm</span><span>😐 Moderate</span><span>😰 Overwhelming</span>
          </div>
        </div>

        {/* Triggers */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            What triggered this?
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {TRIGGER_TAGS.map(tag => (
              <button key={tag} className={`tag-btn ${triggers.includes(tag) ? "selected" : ""}`} onClick={() => toggleTrigger(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Reflection */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Any thoughts or reflections?
          </div>
          <textarea value={reflection} onChange={e => setReflection(e.target.value)}
            placeholder="What happened? What surprised you?"
            rows={3}
            style={{
              width: "100%", padding: "0.75rem 1rem",
              background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "10px", color: "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem",
              outline: "none", resize: "none", lineHeight: 1.6,
            }} />
        </div>

        <button className="btn-primary" style={{ width: "100%" }} onClick={handleSave}>
          Save Entry ✓
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Achievement Card ───────────────────────────────────────────────────────
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
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: earned ? "#fbbf24" : "#6b7280", marginBottom: "0.15rem" }}>
              {a.title}
            </div>
            <div style={{ fontSize: "0.68rem", color: earned ? "#d1d5db" : "#4b5563", lineHeight: 1.4 }}>{a.desc}</div>
            {earned && <div style={{ fontSize: "0.6rem", color: "#4ade80", marginTop: "0.35rem", letterSpacing: "0.08em" }}>✓ EARNED</div>}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ProfileView() {
  const [tab, setTab] = useState("log");
  const [weekData, setWeekData] = useState(makeWeekData);
  const [editingDay, setEditingDay] = useState(null);
  const [streak, setStreak] = useState(3);
  const [nudge, setNudge] = useState("Historically a tougher day for many. A 3-min breathing reset before you start? 🌬");
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const saveDay = (idx, updates) => {
    setWeekData(prev => {
      const next = [...prev];
      const wasEmpty = next[idx].preLevel === null;
      next[idx] = { ...next[idx], ...updates };
      if (wasEmpty && updates.preLevel !== null) {
        setStreak(s => s + 1);
        showNotification("🌟 Entry saved! Keep going!");
      } else {
        showNotification("✓ Updated successfully");
      }
      return next;
    });
  };

  const logged = weekData.filter(d => d.preLevel !== null).length;
  const avg = logged > 0
    ? (weekData.filter(d => d.preLevel !== null).reduce((a, b) => a + b.preLevel, 0) / logged).toFixed(1)
    : null;
  const vals = weekData.filter(d => d.preLevel !== null).map(d => d.preLevel);
  const trend = vals.length < 2 ? null
    : vals[vals.length - 1] < vals[0] ? "improving"
    : vals[vals.length - 1] > vals[0] ? "rising" : "stable";

  const trendDisplay = { improving: { label: "↘ easing", color: "#4ade80" }, rising: { label: "↗ rising", color: "#f87171" }, stable: { label: "→ stable", color: "#fbbf24" } };

  return (
    <>
      <FontLoader />
      <div className="tracker-root">
        <div className="content" style={{ maxWidth: 500, margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7c3aed", marginBottom: "0.3rem" }}>
                  Connect · Anxiety Tracker
                </div>
                <h1 className="display" style={{ fontSize: "2.1rem", lineHeight: 1.1, color: "white" }}>
                  How are you<br /><em className="gradient-text">really</em> doing?
                </h1>
              </div>
              <div style={{
                textAlign: "center",
                background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.15))",
                border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: "14px", padding: "0.75rem 1rem", minWidth: "64px",
              }}>
                <span className="flame" style={{ fontSize: "1.2rem" }}>🔥</span>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#c084fc", lineHeight: 1 }}>{streak}</div>
                <div style={{ fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280" }}>streak</div>
              </div>
            </div>

            <AnimatePresence>
              {nudge && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: "0.75rem" }}>
                  <div className="insight-bubble" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span>{nudge}</span>
                    <button onClick={() => setNudge(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "0.9rem", marginLeft: "0.75rem", flexShrink: 0 }}>✕</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", margin: "1.25rem 0" }}>
            {[
              { label: "Avg level", val: avg ? `${avg}/10` : "—", color: avg ? getAnxietyColor(parseFloat(avg)) : "#6b7280" },
              { label: "Trend", val: trend ? trendDisplay[trend].label : "—", color: trend ? trendDisplay[trend].color : "#6b7280" },
              { label: "Logged", val: `${logged}/5`, color: "#c084fc" },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ textAlign: "center", padding: "0.85rem 0.5rem" }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "0.58rem", color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.15rem" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Nav */}
          <div style={{
            display: "flex", gap: "0.25rem", marginBottom: "1.25rem",
            overflowX: "auto", paddingBottom: "2px",
            background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "4px",
          }}>
            {[
              { id: "log", label: "📋 Log" },
              { id: "courage", label: "🧭 Support" },
              { id: "breathe", label: "🌊 Breathe" },
              { id: "insights", label: "✦ Insights" },
              { id: "story", label: "📖 Story" },
            ].map(t => (
              <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Panels */}
          <AnimatePresence mode="wait">

            {tab === "log" && (
              <motion.div key="log" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280" }}>This week</div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {[{ c: "#c084fc", l: "Before" }, { c: "#4ade80", l: "After" }].map(x => (
                        <span key={x.l} style={{ fontSize: "0.62rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ width: 8, height: 8, background: x.c, borderRadius: "2px", display: "inline-block", boxShadow: `0 0 4px ${x.c}88` }} /> {x.l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                    {weekData.map((d, i) => (
                      <BarColumn key={i} data={d} idx={i} onClick={setEditingDay} isToday={i === 4} />
                    ))}
                  </div>

                  <button className="btn-primary" style={{ width: "100%" }}
                    onClick={() => { const n = weekData.findIndex(d => d.preLevel === null); setEditingDay(n === -1 ? 4 : n); }}>
                    Log today's anxiety →
                  </button>
                </div>

                {weekData[4].preLevel !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-card" style={{ padding: "1.25rem" }}>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.75rem" }}>
                      Today's reading
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                      <DialMeter value={weekData[4].preLevel} label="Before" size={115} />
                      {weekData[4].postLevel !== null && <DialMeter value={weekData[4].postLevel} label="After" size={115} />}
                    </div>
                    {weekData[4].preLevel !== null && weekData[4].postLevel !== null && (
                      <div style={{
                        marginTop: "1rem", padding: "0.75rem", borderRadius: "10px",
                        background: weekData[4].postLevel < weekData[4].preLevel
                          ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                        border: `1px solid ${weekData[4].postLevel < weekData[4].preLevel ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                        textAlign: "center", fontSize: "0.8rem",
                        color: weekData[4].postLevel < weekData[4].preLevel ? "#4ade80" : "#f87171",
                      }}>
                        {weekData[4].postLevel < weekData[4].preLevel
                          ? `↘ Dropped ${weekData[4].preLevel - weekData[4].postLevel} points after action — courage at work ✓`
                          : "You showed up anyway. That's what matters."}
                      </div>
                    )}
                    {weekData[4].triggers.length > 0 && (
                      <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {weekData[4].triggers.map(t => (
                          <span key={t} style={{
                            fontSize: "0.65rem", background: "rgba(124,58,237,0.1)",
                            borderRadius: "999px", padding: "0.25rem 0.65rem",
                            color: "#c084fc", border: "1px solid rgba(124,58,237,0.2)"
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {tab === "courage" && (
              <motion.div key="courage" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <AnxietySupportHub
                  weekData={weekData}
                  onLogNow={() => {
                    const n = weekData.findIndex(d => d.preLevel === null);
                    setEditingDay(n === -1 ? 4 : n);
                  }}
                  onReviewDay={(idx) => setEditingDay(idx)}
                />

                <div className="glass-card" style={{ padding: "1.5rem", marginTop: "0.75rem" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>
                    Growth markers
                  </div>
                  <AchievementsPanel weekData={weekData} streak={streak} />
                </div>
              </motion.div>
            )}

            {tab === "breathe" && (
              <motion.div key="breathe" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "0.75rem" }}>
                  <div className="display" style={{ fontSize: "1.15rem", color: "white", marginBottom: "0.35rem" }}>Breathing Exercises</div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                    Use before anxiety spikes. Your nervous system responds to breath.
                  </div>
                  <BreathingExercise />
                </div>

                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>
                    5-4-3-2-1 Grounding
                  </div>
                  {[
                    { n: 5, label: "things you can see", icon: "👁" },
                    { n: 4, label: "things you can touch", icon: "✋" },
                    { n: 3, label: "things you can hear", icon: "👂" },
                    { n: 2, label: "things you can smell", icon: "👃" },
                    { n: 1, label: "thing you can taste", icon: "👅" },
                  ].map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0", borderBottom: i < 4 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#c084fc"
                      }}>{step.n}</div>
                      <span style={{ fontSize: "0.85rem", color: "#d1d5db" }}>
                        {step.icon} {step.n} {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "insights" && (
              <motion.div key="insights" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div className="display" style={{ fontSize: "1.15rem", color: "white" }}>What your data<br />is telling you</div>
                    <span style={{
                      fontSize: "0.58rem", background: "rgba(124,58,237,0.15)", color: "#c084fc",
                      border: "1px solid rgba(124,58,237,0.3)", borderRadius: "6px",
                      padding: "0.2rem 0.5rem", letterSpacing: "0.1em", textTransform: "uppercase"
                    }}>AI</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {MOCK_AI_INSIGHTS.map((insight, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="insight-bubble">
                        {insight}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>
                    Top triggers this week
                  </div>
                  {(() => {
                    const counts = {};
                    weekData.forEach(d => d.triggers.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
                    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    if (sorted.length === 0) return (
                      <div style={{ color: "#6b7280", fontSize: "0.82rem", fontStyle: "italic", textAlign: "center", padding: "1rem" }}>
                        Log entries with triggers to see your patterns emerge
                      </div>
                    );
                    return sorted.map(([tag, count], i) => (
                      <div key={tag} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                        <div style={{ flex: 1, fontSize: "0.82rem", color: "#d1d5db" }}>{tag}</div>
                        <div style={{ width: `${(count / sorted[0][1]) * 80}px`, height: 6, background: "linear-gradient(90deg, #7c3aed, #a855f7)", borderRadius: "3px", transition: "width 0.5s", boxShadow: "0 0 6px rgba(124,58,237,0.4)" }} />
                        <div style={{ fontSize: "0.7rem", color: "#6b7280", width: 20, textAlign: "right" }}>{count}×</div>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}

            {tab === "story" && (
              <motion.div key="story" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <StoryCard weekData={weekData} streak={streak} />

                <div className="glass-card" style={{ marginTop: "0.75rem", padding: "1.5rem" }}>
                  <div className="display" style={{ fontSize: "1.05rem", color: "white", marginBottom: "0.75rem" }}>Remember this</div>
                  <div className="insight-bubble" style={{ borderColor: "#c084fc" }}>
                    Anxiety before a social situation isn't a sign something is wrong with you. It's your body preparing to grow. Every time you feel it and act anyway, the gap between fear and action gets smaller.
                  </div>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.68rem", color: "#6b7280" }}>— Connect · Your weekly reflection</div>
                </div>

                <div className="glass-card" style={{ marginTop: "0.75rem", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="flame" style={{ fontSize: "2rem" }}>🔥</span>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "white" }}>{streak}-day streak</div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.15rem" }}>
                      You've shown up {streak} days in a row. That matters more than you know.
                    </div>
                  </div>
                  <div style={{
                    marginLeft: "auto", fontSize: "0.7rem", color: "#c084fc",
                    border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px",
                    padding: "0.4rem 0.75rem", background: "rgba(124,58,237,0.08)", cursor: "pointer"
                  }}>Share</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {editingDay !== null && (
            <LogModal dayData={weekData[editingDay]} dayIdx={editingDay} onSave={saveDay} onClose={() => setEditingDay(null)} />
          )}
        </AnimatePresence>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              style={{
                position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(168,85,247,0.95))",
                color: "white", padding: "0.85rem 1.75rem", borderRadius: "999px",
                boxShadow: "0 4px 24px rgba(124,58,237,0.5)", fontSize: "0.85rem",
                fontFamily: "'Nunito',sans-serif", fontWeight: 600, zIndex: 200,
                border: "1px solid rgba(192,162,252,0.4)",
              }}>
              {notification}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}