import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, Check, X, Sparkles, Users, Zap, BookOpen,
  ChevronRight, ChevronLeft, ArrowRight
} from "lucide-react";

// ─── Color tokens (from screenshot palette) ───────────────────────────────────
// BG deep:     #1A1040
// BG card:     #2D1B4E
// BG inner:    #3D1F6E
// Purple acc:  #7B3FE4
// Pink CTA:    #E91E8C  →  #FF2D8A
// Orange bdr:  #FF6B35
// Text muted:  #B39DDB
// Text dim:    #7B5EA7

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingData {
  struggles: string[];
  customStruggle: string;
  aspirations: string[];
  customAspiration: string;
  programDays: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STRUGGLE_TILES = [
  { emoji: "👀", label: "Avoid eye contact" },
  { emoji: "🧊", label: "Freeze in groups" },
  { emoji: "🤐", label: "Struggle to start convos" },
  { emoji: "😰", label: "Dread social events" },
  { emoji: "🫥", label: "Feel invisible in rooms" },
  { emoji: "📵", label: "Ghost people out of anxiety" },
];

const ASPIRATION_TILES = [
  { emoji: "🗣️", label: "Start conversations easily" },
  { emoji: "✨", label: "Own any room I walk into" },
  { emoji: "🤝", label: "Build real friendships" },
  { emoji: "🎤", label: "Speak up confidently" },
  { emoji: "🌟", label: "Be memorable & magnetic" },
  { emoji: "💼", label: "Network like a pro" },
];

const PROGRAM_OPTIONS = [14, 21, 30, 60];

// ─── Shared UI bits ───────────────────────────────────────────────────────────

const SelectionTile = ({
  emoji, label, selected, onClick,
}: { emoji: string; label: string; selected: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className="relative flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left w-full transition-all"
    style={{
      background: selected
        ? "linear-gradient(135deg, rgba(123,63,228,0.55), rgba(233,30,140,0.35))"
        : "rgba(61,31,110,0.5)",
      border: selected
        ? "1.5px solid rgba(233,30,140,0.7)"
        : "1.5px solid rgba(123,63,228,0.25)",
    }}
  >
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: "#E91E8C" }}
      >
        <Check className="w-2.5 h-2.5 text-white" />
      </motion.div>
    )}
    <span className="text-lg">{emoji}</span>
    <span className="text-xs font-semibold leading-tight" style={{ color: selected ? "#fff" : "#B39DDB" }}>
      {label}
    </span>
  </motion.button>
);

// ─── Step 1: Struggles ────────────────────────────────────────────────────────

const StepStruggles = ({
  data, onChange, onNext,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
}) => {
  const toggle = (label: string) => {
    const s = data.struggles.includes(label)
      ? data.struggles.filter((x) => x !== label)
      : [...data.struggles, label];
    onChange({ struggles: s });
  };
  const canContinue = data.struggles.length > 0 || data.customStruggle.trim().length > 2;

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #3D1F6E, #2D1B4E)", border: "1.5px solid rgba(123,63,228,0.5)" }}
        >
          <span className="text-2xl">🪞</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1.5">Where are you right now?</h2>
        <p className="text-sm" style={{ color: "#7B5EA7" }}>Select everything that resonates. No judgment.</p>
      </div>

      {/* Tiles grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {STRUGGLE_TILES.map((t) => (
          <SelectionTile
            key={t.label}
            {...t}
            selected={data.struggles.includes(t.label)}
            onClick={() => toggle(t.label)}
          />
        ))}
      </div>

      {/* Custom input */}
      <div className="mb-6">
        <input
          value={data.customStruggle}
          onChange={(e) => onChange({ customStruggle: e.target.value })}
          placeholder="Or describe it in your own words…"
          className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-800 focus:outline-none transition-all"
          style={{
            background: "rgba(61,31,110,0.4)",
            border: "1.5px solid rgba(123,63,228,0.3)",
          }}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-35"
        style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ─── Step 2: Aspirations ──────────────────────────────────────────────────────

const StepAspirations = ({
  data, onChange, onNext, onBack,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const toggle = (label: string) => {
    const a = data.aspirations.includes(label)
      ? data.aspirations.filter((x) => x !== label)
      : [...data.aspirations, label];
    onChange({ aspirations: a });
  };
  const canContinue = data.aspirations.length > 0 || data.customAspiration.trim().length > 2;

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #E91E8C33, #7B3FE433)", border: "1.5px solid rgba(233,30,140,0.5)" }}
        >
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1.5">Who are you becoming?</h2>
        <p className="text-sm" style={{ color: "#7B5EA7" }}>Your future self is already in here. Pick what calls to you.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {ASPIRATION_TILES.map((t) => (
          <SelectionTile
            key={t.label}
            {...t}
            selected={data.aspirations.includes(t.label)}
            onClick={() => toggle(t.label)}
          />
        ))}
      </div>

      <div className="mb-6">
        <input
          value={data.customAspiration}
          onChange={(e) => onChange({ customAspiration: e.target.value })}
          placeholder="Paint your own picture…"
          className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-800 focus:outline-none transition-all"
          style={{
            background: "rgba(61,31,110,0.4)",
            border: "1.5px solid rgba(123,63,228,0.3)",
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-4 px-5 rounded-2xl font-semibold text-sm flex items-center gap-1.5 transition-all active:scale-95"
          style={{ background: "rgba(61,31,110,0.5)", color: "#B39DDB", border: "1.5px solid rgba(123,63,228,0.3)" }}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-35"
          style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Step 3: Commit screen ────────────────────────────────────────────────────

const StepCommit = ({
  data, onChange, onStart, onBack,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
  onStart: () => void;
  onBack: () => void;
}) => {
  const beforeSummary =
    data.customStruggle.trim() ||
    (data.struggles.length > 0 ? data.struggles.slice(0, 2).join(", ") : "Your current self");
  const afterSummary =
    data.customAspiration.trim() ||
    (data.aspirations.length > 0 ? data.aspirations.slice(0, 2).join(", ") : "Your future self");

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-white mb-1">Your transformation</h2>
        <p className="text-sm" style={{ color: "#7B5EA7" }}>This is your why. Come back to it every day.</p>
      </div>

      {/* Goal poster */}
      <div className="flex gap-2.5 mb-5 items-stretch">
        {/* Before */}
        <div
          className="flex-1 rounded-2xl p-4 flex flex-col justify-between"
          style={{
            background: "rgba(26,16,64,0.9)",
            border: "1.5px solid rgba(123,63,228,0.25)",
          }}
        >
          <div
            className="text-[9px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "rgba(179,157,219,0.45)" }}
          >
            Where I am now
          </div>
          <p className="text-xs leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
            {beforeSummary}
          </p>
          <div className="w-5 h-5 rounded-full mt-3" style={{ background: "rgba(123,63,228,0.2)" }} />
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </motion.div>
        </div>

        {/* After */}
        <div
          className="flex-1 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(123,63,228,0.45), rgba(233,30,140,0.3))",
            border: "1.5px solid rgba(233,30,140,0.55)",
          }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(233,30,140,0.85)" }}>
            Who I'm becoming
          </div>
          <p className="text-xs leading-relaxed font-semibold text-white">{afterSummary}</p>
          <motion.div
            className="w-5 h-5 rounded-full mt-3"
            style={{ background: "rgba(233,30,140,0.4)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Program length */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{ background: "rgba(61,31,110,0.45)", border: "1.5px solid rgba(123,63,228,0.3)" }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#7B5EA7" }}>
          Choose your program length
        </div>
        <div className="flex gap-2">
          {PROGRAM_OPTIONS.map((days) => (
            <motion.button
              key={days}
              whileTap={{ scale: 0.93 }}
              onClick={() => onChange({ programDays: days })}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background:
                  data.programDays === days
                    ? "linear-gradient(135deg, #7B3FE4, #E91E8C)"
                    : "rgba(26,16,64,0.7)",
                color: data.programDays === days ? "#fff" : "#7B5EA7",
                border:
                  data.programDays === days
                    ? "none"
                    : "1.5px solid rgba(123,63,228,0.2)",
              }}
            >
              {days}d
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 mb-3 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7B3FE4 0%, #E91E8C 100%)" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
        <Sparkles className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Start my {data.programDays}-day journey</span>
      </motion.button>

      <button
        onClick={onBack}
        className="w-full py-2 text-sm font-medium"
        style={{ color: "#7B5EA7" }}
      >
        ← Go back
      </button>
    </motion.div>
  );
};

// ─── Onboarding Shell ─────────────────────────────────────────────────────────

const STEP_LABELS = ["Now", "Becoming", "Commit"];

const Onboarding = ({ onComplete }: { onComplete: (d: OnboardingData) => void }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    struggles: [],
    customStruggle: "",
    aspirations: [],
    customAspiration: "",
    programDays: 30,
  });

  const update = (d: Partial<OnboardingData>) => setData((p) => ({ ...p, ...d }));

  return (
    <div
      className="flex flex-col items-center justify-start px-4"
      style={{ background: "transparent" }}
    >
      {/* Logo mark */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
        >
          <Users className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white tracking-wide">SocialOS</span>
      </div>

      {/* Step pip track */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                animate={{
                  background:
                    i < step
                      ? "linear-gradient(135deg, #7B3FE4, #E91E8C)"
                      : i === step
                      ? "rgba(123,63,228,0.5)"
                      : "rgba(61,31,110,0.5)",
                  borderColor:
                    i <= step ? "rgba(233,30,140,0.6)" : "rgba(123,63,228,0.2)",
                }}
                style={{ border: "1.5px solid" }}
              >
                {i < step ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <span style={{ color: i === step ? "#fff" : "#7B5EA7" }}>{i + 1}</span>
                )}
              </motion.div>
              <span
                className="text-[9px] font-semibold uppercase tracking-widest"
                style={{ color: i === step ? "#B39DDB" : "#7B5EA7" }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className="w-8 h-0.5 rounded mb-4"
                style={{
                  background: i < step ? "linear-gradient(90deg, #7B3FE4, #E91E8C)" : "rgba(61,31,110,0.6)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step card */}
      <div
        className="w-full max-w-sm rounded-3xl p-5 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #2D1B4E 0%, #1E1040 100%)",
          border: "1.5px solid rgba(123,63,228,0.4)",
          boxShadow: "0 24px 60px rgba(123,63,228,0.25)",
        }}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepStruggles
              data={data}
              onChange={update}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepAspirations
              data={data}
              onChange={update}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepCommit
              data={data}
              onChange={update}
              onStart={() => onComplete(data)}
              onBack={() => setStep(1)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  beforeText: string;
  afterText: string;
  onSave: (before: string, after: string) => void;
  onClose: () => void;
}

const EditModal = ({ beforeText, afterText, onSave, onClose }: EditModalProps) => {
  const [before, setBefore] = useState(beforeText);
  const [after, setAfter] = useState(afterText);
  const beforeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { beforeRef.current?.focus(); }, []);

  const handleSave = () => {
    if (before.trim() && after.trim()) { onSave(before.trim(), after.trim()); onClose(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: "rgba(10,5,30,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="w-full max-w-md rounded-3xl p-5"
        style={{
          background: "linear-gradient(160deg, #2D1B4E, #1A1040)",
          border: "1.5px solid rgba(233,30,140,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-pink-400" /> Edit your goals
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4 text-purple-300" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(179,157,219,0.45)" }}>
            Where you are now
          </label>
          <textarea
            ref={beforeRef}
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            rows={2}
            placeholder="e.g. Avoiding eye contact, dreading group chats…"
            className="w-full resize-none rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-800 focus:outline-none transition-all"
            style={{ background: "rgba(61,31,110,0.4)", border: "1.5px solid rgba(123,63,228,0.3)" }}
          />
        </div>

        <div className="mb-5">
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(233,30,140,0.75)" }}>
            Who you're becoming
          </label>
          <textarea
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            rows={2}
            placeholder="e.g. Starting conversations, thriving in social settings…"
            className="w-full resize-none rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-800 focus:outline-none transition-all"
            style={{ background: "rgba(61,31,110,0.4)", border: "1.5px solid rgba(233,30,140,0.35)" }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: "rgba(61,31,110,0.5)", color: "#B39DDB", border: "1.5px solid rgba(123,63,228,0.25)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!before.trim() || !after.trim()}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
          >
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Path Stat Item ───────────────────────────────────────────────────────────

const PathItem = ({
  icon, value, total, label, accent = "purple",
}: {
  icon: React.ReactNode;
  value: number;
  total: number;
  label: string;
  accent?: "purple" | "pink" | "green";
}) => {
  const isComplete = value >= total;
  const colors = {
    purple: { bg: "rgba(123,63,228,0.2)", border: "rgba(123,63,228,0.4)", text: "#B39DDB" },
    pink: { bg: "rgba(233,30,140,0.18)", border: "rgba(233,30,140,0.35)", text: "#F472B6" },
    green: { bg: "rgba(52,211,153,0.18)", border: "rgba(52,211,153,0.35)", text: "#34D399" },
  };
  const c = isComplete ? colors.green : colors[accent];

  return (
    <div
      className="flex-1 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5"
      style={{ background: c.bg, border: `1.5px solid ${c.border}` }}
    >
      <div>{icon}</div>
      <div className="text-base font-bold leading-none text-white">
        {value}<span className="text-[10px] font-normal ml-0.5" style={{ color: "rgba(179,157,219,0.4)" }}>/{total}</span>
      </div>
      <div className="text-[10px] leading-tight" style={{ color: "rgba(179,157,219,0.5)" }}>{label}</div>
    </div>
  );
};

// ─── Transformation Card ──────────────────────────────────────────────────────

interface CardProps {
  onboardingData: OnboardingData;
  currentDay?: number;
  streak?: number;
  completedLessons?: number;
  completedActions?: number;
  completedConnections?: number;
  todayContext?: string;
  onGoalsUpdate?: (before: string, after: string) => void;
}

const TransformationCard = ({
  onboardingData,
  currentDay = 1,
  streak = 1,
  completedLessons = 0,
  completedActions = 0,
  completedConnections = 0,
  todayContext = "You're building the ability to hold a spontaneous group conversation without freezing up. Today's task is a direct step toward that.",
  onGoalsUpdate,
}: CardProps) => {
  const beforeText =
    onboardingData.customStruggle.trim() ||
    (onboardingData.struggles.length > 0 ? onboardingData.struggles.join(", ") : "Where you started");
  const afterText =
    onboardingData.customAspiration.trim() ||
    (onboardingData.aspirations.length > 0 ? onboardingData.aspirations.join(", ") : "Your transformed self");

  const [before, setBefore] = useState(beforeText);
  const [after, setAfter] = useState(afterText);
  const [editOpen, setEditOpen] = useState(false);
  const [barAnimated, setBarAnimated] = useState(false);

  const totalDays = onboardingData.programDays;
  const totalLessons = totalDays;
  const totalActions = Math.round(totalDays / 2);
  const totalConnections = Math.round(totalDays / 6);
  const pct = Math.round((currentDay / totalDays) * 100);

  useEffect(() => {
    const t = setTimeout(() => setBarAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #2D1B4E 0%, #1E1040 60%, #160D35 100%)",
          border: "1.5px solid rgba(123,63,228,0.45)",
          boxShadow: "0 24px 60px rgba(123,63,228,0.2), 0 0 0 1px rgba(233,30,140,0.1)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,107,53,0.2)", border: "1.5px solid rgba(255,107,53,0.45)" }}
          >
            <span>🔥</span>
            <span className="text-xs font-bold" style={{ color: "#FF6B35" }}>{streak}-day streak</span>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 active:scale-95 transition-all"
            style={{ background: "rgba(233,30,140,0.18)", border: "1.5px solid rgba(233,30,140,0.4)" }}
          >
            <Pencil className="w-3 h-3 text-pink-400" />
            <span className="text-xs font-semibold text-pink-400">Edit goals</span>
          </button>
        </div>

        <div className="px-4 pt-3 pb-5 space-y-4">
          {/* Label */}
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(179,157,219,0.55)" }}>
            Your transformation
          </div>

          {/* Before / After */}
          <div className="flex gap-2 items-stretch">
            <div
              className="flex-1 rounded-2xl p-3"
              style={{ background: "rgba(26,16,64,0.85)", border: "1.5px solid rgba(123,63,228,0.2)" }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(179,157,219,0.4)" }}>Now</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={before}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {before}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-3 h-3 text-white" />
              </motion.div>
            </div>

            <div
              className="flex-1 rounded-2xl p-3 relative overflow-hidden"
              style={{
                background: "linear-gradient(140deg, rgba(123,63,228,0.4), rgba(233,30,140,0.25))",
                border: "1.5px solid rgba(233,30,140,0.55)",
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="flex items-center gap-1.5 mb-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#E91E8C" }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(233,30,140,0.85)" }}>
                  Day {totalDays} you
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={after}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-semibold leading-relaxed text-white"
                >
                  {after}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(61,31,110,0.6)" }}>
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: "linear-gradient(90deg, #7B3FE4, #E91E8C)" }}
                initial={{ width: "0%" }}
                animate={{ width: barAnimated ? `${pct}%` : "0%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 1.3 }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px]" style={{ color: "rgba(179,157,219,0.45)" }}>Day {currentDay} of {totalDays}</span>
              <span className="text-[10px] font-bold" style={{ color: "#E91E8C" }}>{pct}% there</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(123,63,228,0.2)" }} />

          {/* Path items */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(179,157,219,0.55)" }}>
              What gets you there
            </div>
            <div className="flex gap-2">
              <PathItem
                icon={<BookOpen className="w-4 h-4 mx-auto" style={{ color: "#B39DDB" }} />}
                value={completedLessons} total={totalLessons}
                label="Lessons" accent="purple"
              />
              <PathItem
                icon={<Zap className="w-4 h-4 mx-auto text-pink-400" />}
                value={completedActions} total={totalActions}
                label="Actions" accent="pink"
              />
              <PathItem
                icon={<Users className="w-4 h-4 mx-auto text-green-400" />}
                value={completedConnections} total={totalConnections}
                label="Connections" accent="green"
              />
            </div>
          </div>

          {/* Why today */}
          <div
            className="rounded-2xl p-3.5 flex items-start gap-3"
            style={{ background: "rgba(123,63,228,0.2)", border: "1.5px solid rgba(123,63,228,0.4)" }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(179,157,219,0.75)" }}>
              <span className="font-bold" style={{ color: "#B39DDB" }}>Why today matters — </span>
              {todayContext}
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editOpen && (
          <EditModal
            beforeText={before}
            afterText={after}
            onSave={(b, a) => { setBefore(b); setAfter(a); onGoalsUpdate?.(b, a); }}
            onClose={() => setEditOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  if (!onboardingData) {
    return <Onboarding onComplete={(d) => setOnboardingData(d)} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-start px-4"
      style={{ background: "transparent" }}
    >
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7B3FE4, #E91E8C)" }}
          >
            <Users className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">SocialOS</span>
        </div>
        <button
          onClick={() => setOnboardingData(null)}
          className="text-[10px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(61,31,110,0.5)", color: "#7B5EA7", border: "1.5px solid rgba(123,63,228,0.25)" }}
        >
          Restart
        </button>
      </div>

      <div className="w-full max-w-sm">
        <TransformationCard
          onboardingData={onboardingData}
          currentDay={1}
          streak={1}
          completedLessons={0}
          completedActions={0}
          completedConnections={0}
        />
      </div>
    </div>
  );
}