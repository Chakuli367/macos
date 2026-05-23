import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Google Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Serif+Display:ital@0;1&family=Literata:ital,wght@0,300;0,400;1,300&display=swap');

    :root {
      --ink: #1a1208;
      --paper: #f5efe3;
      --warm: #c8882a;
      --ember: #e85d26;
      --sage: #5a7a5c;
      --dust: #8b7355;
      --cream: #ede5d0;
      --shadow: rgba(26,18,8,0.15);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .tracker-root {
      font-family: 'Literata', Georgia, serif;
      background: var(--paper);
      min-height: 100vh;
      color: var(--ink);
      position: relative;
      overflow-x: hidden;
    }

    .tracker-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(200,136,42,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 80% 90%, rgba(232,93,38,0.06) 0%, transparent 60%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    .content { position: relative; z-index: 1; }

    .display { font-family: 'DM Serif Display', Georgia, serif; }
    .serif { font-family: 'Playfair Display', Georgia, serif; }

    .nav-tab {
      font-family: 'Literata', serif;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.5rem 1rem;
      border: 1.5px solid transparent;
      background: none;
      cursor: pointer;
      color: var(--dust);
      transition: all 0.2s;
      border-radius: 2px;
      white-space: nowrap;
    }
    .nav-tab.active {
      color: var(--ink);
      border-color: var(--warm);
      background: rgba(200,136,42,0.08);
    }
    .nav-tab:hover:not(.active) { color: var(--ink); }

    .card {
      background: rgba(255,252,245,0.85);
      border: 1.5px solid rgba(139,115,85,0.2);
      border-radius: 4px;
      box-shadow: 0 2px 12px var(--shadow), inset 0 1px 0 rgba(255,255,255,0.8);
      backdrop-filter: blur(8px);
    }

    .stat-pill {
      background: var(--cream);
      border: 1px solid rgba(139,115,85,0.25);
      border-radius: 2px;
      padding: 0.75rem 0.5rem;
    }

    .tag-btn {
      font-family: 'Literata', serif;
      font-size: 0.72rem;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      border: 1.5px solid rgba(139,115,85,0.3);
      background: transparent;
      color: var(--dust);
      cursor: pointer;
      transition: all 0.18s;
      letter-spacing: 0.02em;
    }
    .tag-btn.selected {
      background: var(--ink);
      color: var(--paper);
      border-color: var(--ink);
    }
    .tag-btn:hover:not(.selected) {
      border-color: var(--warm);
      color: var(--warm);
    }

    .btn-primary {
      font-family: 'Playfair Display', serif;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      padding: 0.8rem 2rem;
      background: var(--ink);
      color: var(--paper);
      border: none;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 3px 3px 0 var(--warm);
    }
    .btn-primary:hover {
      transform: translate(-1px,-1px);
      box-shadow: 4px 4px 0 var(--warm);
    }
    .btn-primary:active {
      transform: translate(1px,1px);
      box-shadow: 2px 2px 0 var(--warm);
    }

    .btn-secondary {
      font-family: 'Literata', serif;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      padding: 0.6rem 1.4rem;
      background: transparent;
      color: var(--ink);
      border: 1.5px solid var(--ink);
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { background: var(--ink); color: var(--paper); }

    .voice-btn {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: var(--ink);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--paper);
      font-size: 1.5rem;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(26,18,8,0.3);
    }
    .voice-btn.recording {
      background: var(--ember);
      animation: pulse-ring 1.2s ease-out infinite;
    }
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(232,93,38,0.4); }
      70% { box-shadow: 0 0 0 20px rgba(232,93,38,0); }
      100% { box-shadow: 0 0 0 0 rgba(232,93,38,0); }
    }

    .story-card {
      background: var(--ink);
      color: var(--paper);
      border-radius: 4px;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    .story-card::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(200,136,42,0.15);
    }

    .flame {
      display: inline-block;
      animation: flicker 1.5s ease-in-out infinite alternate;
    }
    @keyframes flicker {
      0% { transform: scaleY(1) rotate(-2deg); }
      100% { transform: scaleY(1.08) rotate(2deg); }
    }

    .insight-bubble {
      border-left: 3px solid var(--warm);
      padding: 0.75rem 1rem;
      background: rgba(200,136,42,0.06);
      border-radius: 0 4px 4px 0;
      font-style: italic;
      color: var(--ink);
      font-size: 0.88rem;
      line-height: 1.6;
    }

    .level-input {
      width: 80px;
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      background: transparent;
      border: none;
      border-bottom: 2px solid var(--warm);
      color: var(--ink);
      outline: none;
      padding: 0.25rem;
    }

    .ornament {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--dust);
      opacity: 0.4;
    }
    .ornament::before, .ornament::after {
      content: '';
      flex: 1;
      height: 1px;
      background: currentColor;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(139,115,85,0.3); border-radius: 2px; }
  `}</style>
);

const TRIGGER_TAGS = [
  "social event", "alone time", "rejection", "crowded place",
  "phone call", "quiet day", "work stress", "conflict", "new people", "small win"
];

const MOCK_AI_INSIGHTS = [
  "You consistently spike before social events but recover within hours — that's resilience, not weakness.",
  "Your anxiety is highest mid-week. Consider a 5-min grounding ritual on Tuesday mornings before the day starts.",
  "Every time you took a social action, your post-action anxiety was lower than before. You're rewriting your nervous system.",
  "Three weeks of data shows a downward trend. You're not imagining the progress — the numbers confirm it.",
];

const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI"];

function makeWeekData() {
  return DAYS_SHORT.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return {
      day,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      preLevel: null,
      postLevel: null,
      triggers: [],
      actionTaken: i < 3 ? Math.random() > 0.4 : false,
    };
  });
}

// ── Dial Meter ──────────────────────────────────────────────────────────────
function DialMeter({ value, size = 120, label }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const pct = value !== null ? value / 10 : 0;
  const offset = circ - pct * circ * 0.75;
  const color = value === null ? "#8b7355"
    : value <= 3 ? "#5a7a5c"
    : value <= 6 ? "#c8882a" : "#e85d26";

  return (
    <div style={{ textAlign: "center", width: size }}>
      <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ overflow: "visible" }}>
        <circle cx="50" cy="55" r={r} fill="none" strokeWidth="7"
          stroke="rgba(139,115,85,0.15)" strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={0}
          transform="rotate(135 50 55)" />
        <circle cx="50" cy="55" r={r} fill="none" strokeWidth="7"
          stroke={color} strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={offset}
          transform="rotate(135 50 55)"
          style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
        <text x="50" y="58" textAnchor="middle"
          style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700, fill: "#1a1208" }}>
          {value !== null ? value : "–"}
        </text>
        <text x="50" y="70" textAnchor="middle"
          style={{ fontFamily: "'Literata',serif", fontSize: "0.35rem", letterSpacing: "0.1em", fill: "#8b7355", textTransform: "uppercase" }}>
          {label}
        </text>
      </svg>
    </div>
  );
}

// ── Bar Column ──────────────────────────────────────────────────────────────
function BarColumn({ data, idx, onClick }) {
  const preH = data.preLevel !== null ? `${(data.preLevel / 10) * 100}%` : "0%";
  const postH = data.postLevel !== null ? `${(data.postLevel / 10) * 100}%` : "0%";
  const preColor = data.preLevel === null ? "rgba(139,115,85,0.2)"
    : data.preLevel <= 3 ? "#5a7a5c" : data.preLevel <= 6 ? "#c8882a" : "#e85d26";
  const postColor = data.postLevel === null ? "rgba(139,115,85,0.1)"
    : data.postLevel <= 3 ? "#5a7a5c" : data.postLevel <= 6 ? "#c8882a" : "#e85d26";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", flex: 1, cursor: "pointer" }}
      onClick={() => onClick(idx)}>
      <div style={{ display: "flex", gap: "3px", height: "120px", alignItems: "flex-end", width: "100%", maxWidth: "52px" }}>
        {[{ h: preH, c: preColor, o: 0.75 }, { h: postH, c: postColor, o: 1 }].map((b, bi) => (
          <div key={bi} style={{ flex: 1, height: "120px", background: "rgba(139,115,85,0.1)", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
            <motion.div
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: b.c, opacity: b.o, borderRadius: "2px 2px 0 0" }}
              initial={{ height: 0 }}
              animate={{ height: b.h }}
              transition={{ duration: 0.6, delay: idx * 0.08 + bi * 0.12 }}
            />
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "0.7rem", color: "#1a1208", letterSpacing: "0.1em" }}>{data.day}</div>
        <div style={{ fontSize: "0.6rem", color: "#8b7355" }}>{data.date}</div>
        {data.actionTaken && <div style={{ fontSize: "0.65rem", color: "#5a7a5c", marginTop: "2px" }}>✓</div>}
      </div>
    </div>
  );
}

// ── Courage Graph ───────────────────────────────────────────────────────────
function CourageCorrelation({ weekData }) {
  const pts = weekData.filter(d => d.preLevel !== null);
  if (pts.length < 2) return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#8b7355", fontStyle: "italic", fontSize: "0.85rem" }}>
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

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width="100%" viewBox={`-10 -10 ${W + 20} ${H + 20}`} style={{ overflow: "visible" }}>
        {[0, 2.5, 5, 7.5, 10].map(v => (
          <line key={v} x1={-10} y1={toY(v)} x2={W + 10} y2={toY(v)}
            stroke="rgba(139,115,85,0.12)" strokeWidth="1" />
        ))}
        <path d={prePath} fill="none" stroke="#e85d26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        {postPath && <path d={postPath} fill="none" stroke="#5a7a5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={i * xStep} cy={toY(p.preLevel)} r="4" fill="#e85d26" opacity="0.8" stroke="#f5efe3" strokeWidth="1.5" />
            {p.postLevel !== null && (
              <circle cx={i * xStep} cy={toY(p.postLevel)} r="4" fill="#5a7a5c" stroke="#f5efe3" strokeWidth="1.5" />
            )}
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
        {[{ c: "#e85d26", label: "Before action" }, { c: "#5a7a5c", label: "After action" }].map(l => (
          <span key={l.label} style={{ fontSize: "0.72rem", color: "#8b7355", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ width: 20, height: 2, background: l.c, display: "inline-block", borderRadius: 2 }} /> {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Story Card ──────────────────────────────────────────────────────────────
function StoryCard({ weekData, streak }) {
  const logged = weekData.filter(d => d.preLevel !== null).length;
  const actions = weekData.filter(d => d.actionTaken).length;
  const avg = logged > 0
    ? (weekData.filter(d => d.preLevel !== null).reduce((a, b) => a + b.preLevel, 0) / logged).toFixed(1)
    : null;
  const vals = weekData.filter(d => d.preLevel !== null).map(d => d.preLevel);
  const improving = vals.length >= 2 ? vals[vals.length - 1] < vals[0] : null;

  return (
    <div className="story-card">
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Literata',serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.75rem" }}>
          This Week's Story
        </div>
        <div className="display" style={{ fontSize: "1.6rem", lineHeight: 1.25, marginBottom: "1rem", color: "#f5efe3" }}>
          {logged === 0
            ? "Your story begins\nwhen you log day one."
            : improving
            ? "You showed up,\nand you're already lighter."
            : `${logged} days logged.\nEvery single one counts.`}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.25rem" }}>
          {[
            { label: "Days logged", val: `${logged}/5` },
            { label: "Avg anxiety", val: avg ? `${avg}/10` : "—" },
            { label: "Actions taken", val: actions },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#c8882a" }}>{s.val}</div>
              <div style={{ fontSize: "0.6rem", opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button className="btn-secondary"
          style={{ borderColor: "rgba(245,239,227,0.3)", color: "#f5efe3", fontSize: "0.7rem", padding: "0.5rem 1.2rem" }}
          onClick={() => {
            const text = `This week on Connect: ${logged} days logged, avg anxiety ${avg}/10, ${actions} social actions taken. ${improving ? "Trending down 📉" : "Staying consistent 💪"}`;
            navigator.clipboard?.writeText(text);
          }}>
          Share this week ↗
        </button>
      </div>
    </div>
  );
}

// ── Log Modal ───────────────────────────────────────────────────────────────
function LogModal({ dayData, dayIdx, onSave, onClose }) {
  const [phase, setPhase] = useState("pre");
  const [preLevel, setPreLevel] = useState(dayData.preLevel ?? "");
  const [postLevel, setPostLevel] = useState(dayData.postLevel ?? "");
  const [triggers, setTriggers] = useState(dayData.triggers || []);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const toggleTrigger = t => setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const simulateVoice = () => {
    if (voiceActive) { setVoiceActive(false); return; }
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      setVoiceText("Feeling pretty tense after the team lunch. Wasn't sure what to say.");
      setPreLevel(7);
    }, 2500);
  };

  const handleSave = () => {
    onSave(dayIdx, {
      preLevel: preLevel !== "" ? Number(preLevel) : null,
      postLevel: postLevel !== "" ? Number(postLevel) : null,
      triggers,
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(26,18,8,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 22 }} className="card"
        style={{ width: "100%", maxWidth: 420, padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div className="display" style={{ fontSize: "1.4rem" }}>{dayData.day}</div>
            <div style={{ fontSize: "0.75rem", color: "#8b7355" }}>{dayData.date}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b7355", fontSize: "1.2rem" }}>✕</button>
        </div>

        {/* Phase tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {[{ id: "pre", label: "Before action" }, { id: "post", label: "After action" }].map(p => (
            <button key={p.id} className={`nav-tab ${phase === p.id ? "active" : ""}`}
              onClick={() => setPhase(p.id)} style={{ flex: 1, textAlign: "center" }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Voice */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button className={`voice-btn ${voiceActive ? "recording" : ""}`} onClick={simulateVoice}>
            {voiceActive ? "⏹" : "🎙"}
          </button>
          <div style={{ fontSize: "0.72rem", color: "#8b7355", letterSpacing: "0.08em" }}>
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

        <div className="ornament" style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>or type it</span>
        </div>

        {/* Level input */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#8b7355", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            {phase === "pre" ? "Anxiety before" : "Anxiety after"}
          </div>
          <input className="level-input" type="number" min="0" max="10"
            value={phase === "pre" ? preLevel : postLevel}
            onChange={e => phase === "pre" ? setPreLevel(e.target.value) : setPostLevel(e.target.value)}
            placeholder="0–10" />
          <div style={{ fontSize: "0.65rem", color: "#8b7355", marginTop: "0.35rem" }}>0 = calm · 10 = overwhelming</div>
        </div>

        {/* Triggers */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#8b7355", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            What triggered this?
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {TRIGGER_TAGS.map(tag => (
              <button key={tag} className={`tag-btn ${triggers.includes(tag) ? "selected" : ""}`} onClick={() => toggleTrigger(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%" }} onClick={handleSave}>
          Save this entry
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function AnxietyTracker() {
  const [tab, setTab] = useState("log");
  const [weekData, setWeekData] = useState(makeWeekData);
  const [editingDay, setEditingDay] = useState(null);
  const [streak, setStreak] = useState(3);
  const [nudge, setNudge] = useState("Historically a tougher day for many. A 3-min breathing reset before you start? 🌬");

  const saveDay = (idx, updates) => {
    setWeekData(prev => {
      const next = [...prev];
      const wasEmpty = next[idx].preLevel === null;
      next[idx] = { ...next[idx], ...updates };
      if (wasEmpty && updates.preLevel !== null) setStreak(s => s + 1);
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

  return (
    <>
      <FontLoader />
      <div className="tracker-root">
        <div className="content" style={{ maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <div style={{ fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8b7355", marginBottom: "0.25rem" }}>
                  Connect · Anxiety Tracker
                </div>
                <h1 className="display" style={{ fontSize: "2rem", lineHeight: 1.12, color: "#1a1208" }}>
                  How are you<br /><em>really</em> doing?
                </h1>
              </div>
              <div style={{ textAlign: "center", background: "#1a1208", color: "#f5efe3", borderRadius: "4px", padding: "0.6rem 0.8rem", minWidth: "58px" }}>
                <span className="flame" style={{ fontSize: "1.1rem" }}>🔥</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>{streak}</div>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>streak</div>
              </div>
            </div>

            <AnimatePresence>
              {nudge && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: "0.75rem" }}>
                  <div className="insight-bubble" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span>{nudge}</span>
                    <button onClick={() => setNudge(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b7355", fontSize: "0.9rem", marginLeft: "0.75rem", flexShrink: 0 }}>✕</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", margin: "1.25rem 0" }}>
            {[
              { label: "Avg level", val: avg ? `${avg}/10` : "—" },
              { label: "Trend", val: trend ? { improving: "↘ easing", rising: "↗ rising", stable: "→ stable" }[trend] : "—" },
              { label: "Logged", val: `${logged} / 5` },
            ].map(s => (
              <div key={s.label} className="stat-pill" style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "0.9rem", color: "#1a1208" }}>{s.val}</div>
                <div style={{ fontSize: "0.58rem", color: "#8b7355", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Nav */}
          <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.25rem", overflowX: "auto", paddingBottom: "2px" }}>
            {[
              { id: "log", label: "Daily Log" },
              { id: "courage", label: "Courage Map" },
              { id: "insights", label: "Insights" },
              { id: "story", label: "My Story" },
            ].map(t => (
              <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Panels */}
          <AnimatePresence mode="wait">

            {tab === "log" && (
              <motion.div key="log" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8b7355" }}>This week</div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {[{ c: "#e85d26", l: "Before", o: 0.7 }, { c: "#5a7a5c", l: "After", o: 1 }].map(x => (
                        <span key={x.l} style={{ fontSize: "0.65rem", color: "#8b7355", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ width: 8, height: 8, background: x.c, opacity: x.o, borderRadius: "1px", display: "inline-block" }} /> {x.l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                    {weekData.map((d, i) => (
                      <BarColumn key={i} data={d} idx={i} onClick={setEditingDay} />
                    ))}
                  </div>

                  <button className="btn-primary" style={{ width: "100%" }}
                    onClick={() => { const n = weekData.findIndex(d => d.preLevel === null); setEditingDay(n === -1 ? 4 : n); }}>
                    Log today's anxiety →
                  </button>
                </div>

                {weekData[4].preLevel !== null && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="card" style={{ marginTop: "0.75rem", padding: "1.25rem" }}>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: "0.75rem" }}>Today's reading</div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                      <DialMeter value={weekData[4].preLevel} label="Before" size={110} />
                      {weekData[4].postLevel !== null && <DialMeter value={weekData[4].postLevel} label="After" size={110} />}
                    </div>
                    {weekData[4].triggers.length > 0 && (
                      <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {weekData[4].triggers.map(t => (
                          <span key={t} style={{ fontSize: "0.65rem", background: "rgba(139,115,85,0.12)", borderRadius: "999px", padding: "0.25rem 0.6rem", color: "#8b7355" }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {tab === "courage" && (
              <motion.div key="courage" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="card" style={{ padding: "1.5rem" }}>
                  <div className="display" style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>The Courage Correlation</div>
                  <div style={{ fontSize: "0.8rem", color: "#8b7355", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                    Your anxiety <em>before</em> vs <em>after</em> taking a social action. The gap is your courage, made visible.
                  </div>
                  <CourageCorrelation weekData={weekData} />
                </div>

                <div className="card" style={{ marginTop: "0.75rem", padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: "0.75rem" }}>Actions taken this week</div>
                  {weekData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < 4 ? "1px solid rgba(139,115,85,0.1)" : "none" }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "0.75rem", width: 32, color: "#8b7355" }}>{d.day}</div>
                      <div style={{ flex: 1, height: "6px", background: "rgba(139,115,85,0.12)", borderRadius: "3px", overflow: "hidden" }}>
                        {d.actionTaken && <div style={{ width: "100%", height: "100%", background: "#5a7a5c", borderRadius: "3px" }} />}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: d.actionTaken ? "#5a7a5c" : "#c8b8a0", width: 60, textAlign: "right" }}>
                        {d.actionTaken ? "✓ action" : d.preLevel !== null ? "logged" : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "insights" && (
              <motion.div key="insights" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div className="display" style={{ fontSize: "1.1rem" }}>What your data<br />is telling you</div>
                    <span style={{ fontSize: "0.62rem", background: "rgba(200,136,42,0.12)", color: "#c8882a", border: "1px solid rgba(200,136,42,0.3)", borderRadius: "2px", padding: "0.2rem 0.5rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>AI</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {MOCK_AI_INSIGHTS.map((insight, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="insight-bubble">
                        {insight}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ marginTop: "0.75rem", padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: "0.75rem" }}>Top triggers this week</div>
                  {(() => {
                    const counts = {};
                    weekData.forEach(d => d.triggers.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
                    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    if (sorted.length === 0) return (
                      <div style={{ color: "#8b7355", fontSize: "0.82rem", fontStyle: "italic" }}>
                        Log some entries with triggers to see your patterns emerge
                      </div>
                    );
                    return sorted.map(([tag, count]) => (
                      <div key={tag} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <div style={{ flex: 1, fontSize: "0.8rem" }}>{tag}</div>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {Array.from({ length: count }).map((_, i) => (
                            <div key={i} style={{ width: 8, height: 8, background: "#c8882a", borderRadius: "1px", opacity: 0.6 + i * 0.15 }} />
                          ))}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#8b7355", width: 20, textAlign: "right" }}>{count}×</div>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}

            {tab === "story" && (
              <motion.div key="story" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <StoryCard weekData={weekData} streak={streak} />

                <div className="card" style={{ marginTop: "0.75rem", padding: "1.5rem" }}>
                  <div className="display" style={{ fontSize: "1.05rem", marginBottom: "0.75rem" }}>Remember this</div>
                  <div style={{ fontFamily: "'Literata',serif", fontStyle: "italic", fontSize: "0.88rem", lineHeight: 1.8, color: "#4a3c28" }}>
                    "Anxiety before a social situation isn't a sign something is wrong with you. It's your body preparing to grow. Every time you feel it and act anyway, the gap between fear and action gets smaller."
                  </div>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.68rem", color: "#8b7355" }}>— Connect · Your weekly reflection</div>
                </div>

                <div className="card" style={{ marginTop: "0.75rem", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="flame" style={{ fontSize: "2rem" }}>🔥</span>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.05rem" }}>{streak}-day streak</div>
                    <div style={{ fontSize: "0.75rem", color: "#8b7355", marginTop: "0.15rem" }}>You've shown up {streak} days in a row. That matters more than you know.</div>
                  </div>
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
      </div>
    </>
  );
}