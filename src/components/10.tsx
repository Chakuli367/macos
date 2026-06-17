import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileCardProps {
  /** Called when the user taps anywhere on the card to go to ProfileView */
  onNavigateToProfile: () => void;
  /** Optional: override the displayed user name */
  userName?: string;
  /** Optional: override the user plan badge ("Free" | "Pro") */
  userPlan?: "Free" | "Pro";
  /** Optional: override the user bio */
  userBio?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI"];

function getMoodColor(v: number | null): string {
  if (v === null) return "#374151";
  if (v <= 3) return "#4ade80";
  if (v <= 6) return "#fbbf24";
  return "#f87171";
}

function makeMiniWeekData() {
  return DAYS_SHORT.map((day, i) => ({
    day,
    preLevel: i < 4 ? Math.floor(Math.random() * 5 + 3) : null,
    actionTaken: i < 4 ? Math.random() > 0.4 : false,
  }));
}

// ─── Mini Mood Bar ─────────────────────────────────────────────────────────────

function MiniMoodBars({ weekData }: { weekData: ReturnType<typeof makeMiniWeekData> }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: 36 }}>
      {weekData.map((d, i) => {
        const barH = d.preLevel !== null ? `${(d.preLevel / 10) * 32}px` : "3px";
        const color = getMoodColor(d.preLevel);
        const isToday = i === 4;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              width: "100%", height: 36, background: "rgba(124,58,237,0.1)",
              borderRadius: "4px 4px 0 0", position: "relative", overflow: "hidden",
            }}>
              <motion.div
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: color, borderRadius: "3px 3px 0 0",
                  boxShadow: d.preLevel !== null ? `0 0 6px ${color}66` : "none",
                }}
                initial={{ height: 0 }}
                animate={{ height: barH }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
            <div style={{
              fontSize: "0.45rem", fontFamily: "'Poppins', sans-serif", fontWeight: 700,
              color: isToday ? "#c084fc" : "#4b5563", letterSpacing: "0.05em",
            }}>
              {d.day[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Companion mini avatar ────────────────────────────────────────────────────

function MiniCompanionDot({ color }: { color: string }) {
  return (
    <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: -4, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        border: `1px solid ${color}44`,
        animation: "mcGlow 3s ease-in-out infinite",
      }} />
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.4))",
        border: `1.5px solid ${color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.9rem", position: "relative", zIndex: 1,
        boxShadow: `0 2px 10px ${color}44`,
      }}>
        🌙
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileCard({
  onNavigateToProfile,
  userName = "Alex",
  userPlan = "Free",
  userBio = "working on showing up for myself",
}: ProfileCardProps) {
  const [weekData] = useState(makeMiniWeekData);
  const streak = 7;
  const logged = weekData.filter(d => d.preLevel !== null).length;
  const vals = weekData.filter(d => d.preLevel !== null).map(d => d.preLevel as number);
  const avg = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  const trend = vals.length < 2 ? null : vals[vals.length - 1] < vals[0] ? "improving" : "stable";

  return (
    <>
      {/* Scoped styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Poppins:wght@600;700;800&display=swap');

        @keyframes mcGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(192,130,252,0.25); }
          50%       { box-shadow: 0 0 24px rgba(192,130,252,0.5); }
        }
        @keyframes profileCardShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes profileOnlinePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }

        .profile-card-root {
          font-family: 'Nunito', 'Poppins', sans-serif;
        }

        .profile-card-wrap {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: linear-gradient(
            135deg,
            rgba(42, 14, 82, 0.97) 0%,
            rgba(68, 22, 116, 0.92) 55%,
            rgba(100, 30, 130, 0.75) 100%
          );
          border: 1px solid rgba(192, 162, 252, 0.25);
          box-shadow: 0 6px 32px rgba(124, 58, 237, 0.28),
                      inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        .profile-card-wrap:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 44px rgba(124, 58, 237, 0.42),
                      inset 0 1px 0 rgba(255, 255, 255, 0.09);
          border-color: rgba(192, 162, 252, 0.45);
        }
        .profile-card-wrap:active {
          transform: translateY(-1px);
        }

        /* "VIEW FULL PROFILE" pill */
        .profile-card-pill {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.62rem; font-weight: 700;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #c084fc;
          background: rgba(124, 58, 237, 0.14);
          border: 1px solid rgba(192, 162, 252, 0.3);
          border-radius: 999px; padding: 3px 10px;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .profile-card-wrap:hover .profile-card-pill {
          background: rgba(124, 58, 237, 0.26);
          border-color: rgba(192, 162, 252, 0.55);
        }

        .profile-card-stat {
          text-align: center;
          padding: 6px 4px;
          background: rgba(124, 58, 237, 0.07);
          border-radius: 10px;
          border: 1px solid rgba(192, 162, 252, 0.1);
        }

        .profile-card-online-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: profileOnlinePulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div className="profile-card-root">
        <motion.div
          className="profile-card-wrap"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={onNavigateToProfile}
          role="button"
          aria-label="Go to Profile"
        >
          {/* ── BG orbs ── */}
          <div style={{
            position: "absolute", top: -40, right: -40, width: 160, height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,130,252,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -20, left: -20, width: 100, height: 100,
            borderRadius: "50%",
            background: "rgba(236,72,153,0.06)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1, padding: "1.1rem 1.1rem 1rem" }}>

            {/* ── Row 1: Avatar + Name/Bio + Arrow ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.9rem" }}>

              {/* User avatar initial */}
              <div style={{
                width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", fontWeight: 800, color: "white",
                boxShadow: "0 3px 12px rgba(124,58,237,0.45)",
              }}>
                {userName[0].toUpperCase()}
              </div>

              {/* Name + bio */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
                    fontSize: "0.95rem", color: "white",
                  }}>
                    {userName}
                  </span>
                  {/* Plan badge */}
                  <span style={{
                    fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "2px 7px", borderRadius: "999px",
                    background: userPlan === "Pro"
                      ? "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.1))"
                      : "rgba(124,58,237,0.15)",
                    border: `1px solid ${userPlan === "Pro" ? "rgba(251,191,36,0.4)" : "rgba(192,162,252,0.3)"}`,
                    color: userPlan === "Pro" ? "#fbbf24" : "#c084fc",
                  }}>
                    {userPlan === "Pro" ? <><Star size={8} style={{ display: "inline", marginRight: 2 }} />Pro</> : "Free"}
                  </span>
                </div>
                <div style={{
                  fontSize: "0.7rem", color: "#9ca3af", marginTop: "1px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {userBio}
                </div>
              </div>

              {/* View profile pill */}
              <div className="profile-card-pill">
                Profile <ChevronRight size={10} />
              </div>
            </div>

            {/* ── Row 2: Companion status + Streak ── */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              marginBottom: "0.85rem",
              padding: "0.6rem 0.75rem",
              background: "rgba(0,0,0,0.18)",
              borderRadius: "14px",
              border: "1px solid rgba(192,162,252,0.12)",
            }}>
              <MiniCompanionDot color="#c084fc" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "0.78rem", fontWeight: 700, color: "white",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Luna
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <div className="profile-card-online-dot" />
                  <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>
                    Active · 14 sessions
                  </span>
                </div>
              </div>
              {/* Streak badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(192,130,252,0.1)",
                border: "1px solid rgba(192,162,252,0.25)",
                borderRadius: "10px",
                padding: "4px 10px",
              }}>
                <span style={{ fontSize: "0.9rem" }}>🔥</span>
                <span style={{
                  fontFamily: "'Poppins', sans-serif", fontWeight: 800,
                  fontSize: "0.88rem", color: "#c084fc",
                }}>
                  {streak}
                </span>
              </div>
            </div>

            {/* ── Row 3: Mood bars + Stats ── */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>

              {/* Mini mood bars */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#6b7280", marginBottom: "4px",
                }}>
                  This week
                </div>
                <MiniMoodBars weekData={weekData} />
              </div>

              {/* Compact stat pills */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 72 }}>
                <div className="profile-card-stat">
                  <div style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                    fontSize: "0.82rem",
                    color: avg ? getMoodColor(parseFloat(avg)) : "#6b7280",
                  }}>
                    {avg ? `${avg}/10` : "—"}
                  </div>
                  <div style={{ fontSize: "0.5rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Avg mood
                  </div>
                </div>
                <div className="profile-card-stat">
                  <div style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                    fontSize: "0.82rem", color: "#c084fc",
                  }}>
                    {logged}/5
                  </div>
                  <div style={{ fontSize: "0.5rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Logged
                  </div>
                </div>
              </div>
            </div>

            {/* ── Row 4: Upgrade banner (Free users only) ── */}
            {userPlan === "Free" && (
              <div style={{
                marginTop: "0.75rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.04))",
                border: "1px solid rgba(251,191,36,0.25)",
                borderRadius: "12px", padding: "0.5rem 0.75rem",
              }}>
                <Star size={12} color="#fbbf24" />
                <span style={{ fontSize: "0.68rem", color: "#fbbf24", fontWeight: 700, flex: 1 }}>
                  Upgrade to Pro — Unlimited sessions · Voice · Memory
                </span>
                <ChevronRight size={12} color="#fbbf24" />
              </div>
            )}

            {/* ── Trend tag (bottom-right, subtle) ── */}
            {trend && (
              <div style={{
                marginTop: "0.6rem",
                display: "flex", justifyContent: "flex-end",
              }}>
                <span style={{
                  fontSize: "0.58rem", fontWeight: 700,
                  color: trend === "improving" ? "#4ade80" : "#fbbf24",
                  background: trend === "improving" ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
                  border: `1px solid ${trend === "improving" ? "rgba(74,222,128,0.25)" : "rgba(251,191,36,0.25)"}`,
                  borderRadius: "999px", padding: "2px 8px",
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  <Sparkles size={8} />
                  {trend === "improving" ? "↘ easing this week" : "→ stable this week"}
                </span>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </>
  );
}