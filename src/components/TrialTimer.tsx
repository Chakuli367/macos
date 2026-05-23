import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSecondsRemaining } from "@/lib/trialTimer";

export function TrialTimer() {
  const [seconds, setSeconds] = useState(getSecondsRemaining());
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const start = sessionStorage.getItem("trial_start_time");

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleExpired = useCallback(() => {
    setShowExpiredModal(true);
  }, []);

  useEffect(() => {
    if (!start) return;
    const interval = setInterval(() => {
      const remaining = getSecondsRemaining();
      setSeconds(remaining);

      if (remaining === 60) {
        setWarningText("1 minute left in your free trial");
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
      }
      if (remaining === 30) {
        setWarningText("30 seconds left — grab the app to keep going!");
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
      }
      if (remaining === 0) {
        clearInterval(interval);
        handleExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [handleExpired, start]);

  // Don't render at all if trial never started
  if (!start) return null;

  const timerColor =
    seconds <= 30
      ? "text-red-400 border-red-500/40 bg-red-500/10"
      : seconds <= 60
      ? "text-orange-400 border-orange-500/40 bg-orange-500/10"
      : "text-purple-300 border-purple-500/30 bg-purple-500/10";

  return (
    <>
      {/* Floating timer pill */}
      <motion.div
        className={`fixed bottom-20 right-4 z-[9990] flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md shadow-xl cursor-default ${timerColor}`}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <span className={`w-2 h-2 rounded-full ${seconds <= 30 ? "bg-red-400" : "bg-purple-400"} animate-pulse`} />
        <span className="text-sm font-bold tracking-wide font-mono">{fmt(seconds)}</span>
        <span className="text-xs opacity-70">trial</span>
      </motion.div>

      {/* Warning toast */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="fixed bottom-32 right-4 z-[9991] bg-slate-900 border border-orange-500/40 rounded-2xl px-5 py-3 shadow-2xl max-w-[260px]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <p className="text-orange-300 text-sm font-medium">⏳ {warningText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expired modal */}
      <AnimatePresence>
        {showExpiredModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
            style={{ backdropFilter: "blur(16px)", background: "rgba(10,5,30,0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center shadow-xl">
                <span className="text-4xl">⏰</span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-purple-200 text-xs font-semibold tracking-widest uppercase">Trial ended</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                Your 2 mins are up!
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Hope you loved it. Get the app to pick up right where you left off, every single day.
              </p>

              <div className="space-y-2 mb-6 text-left">
                {[
                  { e: "🔔", t: "Daily reminders to stay on track" },
                  { e: "⚡", t: "Full access — no time limits" },
                  { e: "🔒", t: "Your plan synced & saved forever" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <span className="text-lg">{item.e}</span>
                    <span className="text-slate-300 text-sm">{item.t}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://play.google.com/store/apps/details?id=app.connect.mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-5 py-4 bg-white text-gray-900 font-bold text-base rounded-2xl shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-transform mb-3"
              >
                <svg className="w-7 h-7" viewBox="0 0 512 512">
                  <path fill="#4CAF50" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
                  <path fill="#FF3D00" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.1-256L47 0z"/>
                  <path fill="#FFD600" d="M401.4 233.7l-87.8-50.4-66.7 64.7 66.7 64.7 89.2-51.1c12.8-7.4 12.8-20.6-1.4-28z"/>
                  <path fill="#FF3D00" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 leading-none">Get it on</div>
                  <div className="text-base font-extrabold leading-tight">Google Play</div>
                </div>
              </a>
              <p className="text-slate-600 text-xs">🍎 iOS coming soon</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}