import React, { useEffect, useState, useRef } from "react";
import { Send, User, Bot, Loader2, CheckCircle, Download, Sparkles, Heart, Brain, Clock } from "lucide-react";
import { getApiKeys } from "../backend/apikeys";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { startTrial } from "@/lib/trialTimer";

const API_BASE = "https://pythonbackend-j1yp.onrender.com";

// ============ FIREBASE CONFIG ============
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ============ CONDITION CATALOG (fallback — backend sends live copy) ============
const FALLBACK_CONDITIONS = [
  { id: "anxiety",      label: "Anxiety",            emoji: "😰", description: "Worry, panic, overthinking",            category: "mental_health" },
  { id: "depression",   label: "Depression",          emoji: "🌧",  description: "Low mood, emptiness, no motivation",   category: "mental_health" },
  { id: "stress",       label: "Stress & Burnout",    emoji: "🔥", description: "Overwhelm, exhaustion, pressure",       category: "mental_health" },
  { id: "loneliness",   label: "Loneliness",          emoji: "🫧", description: "Feeling disconnected or isolated",      category: "mental_health" },
  { id: "anger",        label: "Anger & Frustration", emoji: "⚡", description: "Irritability, rage, resentment",        category: "mental_health" },
  { id: "grief",        label: "Grief & Loss",        emoji: "🕊",  description: "Loss of a person, relationship, or chapter", category: "mental_health" },
  { id: "trauma",       label: "Trauma & PTSD",       emoji: "🧩", description: "Flashbacks, hypervigilance, past wounds", category: "mental_health" },
  { id: "ocd",          label: "OCD",                 emoji: "🔁", description: "Intrusive thoughts, compulsions, rituals", category: "mental_health" },
  { id: "relationship", label: "Relationship Issues", emoji: "💔", description: "Conflict, breakups, communication",    category: "relationships" },
  { id: "social_anxiety", label: "Social Anxiety",   emoji: "👥", description: "Fear of judgment, avoidance, shyness", category: "relationships" },
  { id: "family",       label: "Family Stress",       emoji: "🏠", description: "Parent, sibling, or household tension", category: "relationships" },
  { id: "self_esteem",  label: "Self-Esteem",         emoji: "🪞", description: "Self-doubt, shame, not feeling enough", category: "identity" },
  { id: "purpose",      label: "Purpose & Direction", emoji: "🧭", description: "Lost, stuck, unsure what you want",    category: "identity" },
  { id: "identity",     label: "Identity & Belonging",emoji: "🌈", description: "Who am I? Where do I fit?",           category: "identity" },
  { id: "sleep",        label: "Sleep Problems",      emoji: "🌙", description: "Insomnia, nightmares, exhaustion",    category: "lifestyle" },
  { id: "adhd",         label: "ADHD & Focus",        emoji: "🎯", description: "Distraction, impulsivity, overwhelm", category: "lifestyle" },
  { id: "eating",       label: "Eating & Body Image", emoji: "🍃", description: "Difficult relationship with food or body", category: "lifestyle" },
];

const CATEGORY_LABELS: Record<string, string> = {
  mental_health: "Mental Health",
  relationships: "Relationships",
  identity: "Life & Identity",
  lifestyle: "Physical & Lifestyle",
};

// ============ PHASE LABELS ============
const PHASE_INFO = [
  { num: 0, label: "What's going on?",       icon: Heart },
  { num: 1, label: "Shape your companion",  icon: Sparkles },
  { num: 2, label: "Share your world",      icon: Brain },
  { num: 3, label: "Set your rhythm",       icon: Clock },
  { num: 4, label: "Confirm & launch",      icon: CheckCircle },
];

export default function AIBRAINPhaseFlow({ onComplete }) {
  const [userId, setUserId] = useState("");
  const [phase, setPhase] = useState(0);          // 0 = condition selector, 1–4 = chat, 5 = done
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [companionProfile, setCompanionProfile] = useState<any>(null);
  const [confirmationSummary, setConfirmationSummary] = useState<any>(null);

  // Phase 0 state
  const [conditionCatalog, setConditionCatalog] = useState(FALLBACK_CONDITIONS);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [primaryCondition, setPrimaryCondition] = useState<string>("");
  const [customIssue, setCustomIssue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        initSession(user.uid);
      } else {
        setUserId("");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function pushBotMessage(text: string) {
    setMessages(prev => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "assistant",
      content: text,
      timestamp: Date.now()
    }]);
  }

  function pushUserMessage(text: string) {
    setMessages(prev => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      content: text,
      timestamp: Date.now()
    }]);
  }

  // ── Init session ──────────────────────────────────────────────────────────
  const initSession = async (uid: string) => {
    try {
      const res = await fetch(`${API_BASE}/init-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid })
      });
      const data = await res.json();
      if (data.condition_catalog) setConditionCatalog(data.condition_catalog);
      // If reconnecting mid-flow, jump to correct phase
      if (data.reconnected && data.phase > 0) {
        setPhase(data.phase);
      }
    } catch (err) {
      console.warn("Init session warning:", err);
    }
  };

  // ── Phase 0: Submit condition selection ──────────────────────────────────
  const submitConditions = async () => {
    if (!selectedConditions.length) return;
    setLoading(true);
    setErrorText(null);
    try {
      const res = await fetch(`${API_BASE}/select-conditions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          conditions: selectedConditions,
          primary_condition: primaryCondition || selectedConditions[0],
          custom_issue: customIssue || undefined
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setPhase(1);
        // Trigger Phase 1 opening message via chat
        await triggerPhase1Opening();
      }
    } catch (err: any) {
      setErrorText(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  // ── Trigger Phase 1 opening without user input ───────────────────────────
  const triggerPhase1Opening = async () => {
    setIsLoadingChat(true);
    try {
      const keys = await getApiKeys();
      const apiKey = keys[keys.length - 1];
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: "hello",   // minimal trigger — backend has context from phase 0
          api_key: apiKey
        })
      });
      const data = await res.json();
      const botResp = data.response || data.message;
      if (botResp) pushBotMessage(botResp);
      if (data.phase && data.phase !== phase) setPhase(data.phase);
    } catch (err) {
      pushBotMessage("Hey! I know what you're dealing with. Let's set up your companion — this is just a few quick questions. Ready?");
    } finally {
      setIsLoadingChat(false);
    }
  };

  // ── Poll job until done ───────────────────────────────────────────────────
  const pollJob = async (jobId: string) => {
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 500));
      try {
        const res = await fetch(`${API_BASE}/job-status/${jobId}`);
        if (!res.ok) continue;
        const job = await res.json();
        if (job.status === "done") return job;
        if (job.status === "error") throw new Error(job.error || "Job failed");
      } catch (e) { continue; }
    }
    throw new Error("Timed out waiting for a response. Please try again.");
  };

  // ── Chat (phases 1–4) ─────────────────────────────────────────────────────
  const sendChatMessage = async () => {
    if (!inputMessage.trim() || isLoadingChat) return;
    const text = inputMessage.trim();
    setInputMessage("");
    pushUserMessage(text);
    setIsLoadingChat(true);
    setErrorText(null);

    try {
      const keys = await getApiKeys();
      const apiKey = keys[keys.length - 1];

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: text, api_key: apiKey })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} — ${txt}`);
      }

      const data = await res.json();
      const botResp = data.response || data.message || "";
      if (botResp) pushBotMessage(botResp);

      if (data.confirmation_summary) setConfirmationSummary(data.confirmation_summary);

      if (data.companion_profile) {
        setCompanionProfile(data.companion_profile);
      }

      if (data.phase !== undefined) {
        setPhase(data.phase);
      }

      if (data.complete || data.companion_activated) {
        setPhase(5);
      }

    } catch (err: any) {
      setErrorText(String(err?.message || err));
      pushBotMessage(`⚠️ ${String(err?.message || err)}`);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const handleExportSession = () => {
    try {
      const blob = new Blob([JSON.stringify({ userId, messages, phase, companionProfile, confirmationSummary }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `companion-session-${userId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("export err", err);
    }
  };

  // ── Condition toggle ──────────────────────────────────────────────────────
  const toggleCondition = (id: string) => {
    setSelectedConditions(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(c => c !== id);
        if (primaryCondition === id) setPrimaryCondition(next[0] || "");
        return next;
      }
      const next = [...prev, id];
      if (!primaryCondition) setPrimaryCondition(id);
      return next;
    });
  };

  // ── Grouped catalog ───────────────────────────────────────────────────────
  const grouped = conditionCatalog.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, typeof conditionCatalog>);

  // ============ RENDER: Phase 0 — Condition Selector ========================
  const renderPhase0 = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div className="text-4xl mb-3">🌿</div>
          <h2 className="text-2xl font-bold mb-2">What are you dealing with?</h2>
          <p className="text-gray-400 text-sm">Select everything that feels true right now. No judgment.</p>
        </div>

        {/* Category groups */}
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {CATEGORY_LABELS[category] || category}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
              {items.map(cond => {
                const isSelected = selectedConditions.includes(cond.id);
                const isPrimary = primaryCondition === cond.id;
                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => toggleCondition(cond.id)}
                    onDoubleClick={() => { if (isSelected) setPrimaryCondition(cond.id); }}
                    className={`relative p-4 rounded-2xl text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-purple-600/80 border-2 border-purple-400 shadow-lg shadow-purple-900/40"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {isPrimary && isSelected && (
                      <span className="absolute top-2 right-2 text-xs bg-yellow-500/80 text-black px-1.5 py-0.5 rounded-full font-semibold">
                        main
                      </span>
                    )}
                    <div className="text-2xl mb-1">{cond.emoji}</div>
                    <div className="font-semibold text-sm">{cond.label}</div>
                    <div className="text-xs text-gray-300 mt-0.5 leading-tight">{cond.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Primary condition selector (shows when 2+ selected) */}
        {selectedConditions.length >= 2 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-sm font-medium mb-3">Which one is hitting hardest right now?</p>
            <div className="flex flex-wrap gap-2">
              {selectedConditions.map(id => {
                const cond = conditionCatalog.find(c => c.id === id);
                if (!cond) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPrimaryCondition(id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      primaryCondition === id
                        ? "bg-yellow-500 text-black font-semibold"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {cond.emoji} {cond.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom input toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowCustomInput(v => !v)}
            className="text-sm text-purple-300 hover:text-purple-200 underline underline-offset-2 transition"
          >
            {showCustomInput ? "Hide" : "+ Something else not listed?"}
          </button>
          {showCustomInput && (
            <textarea
              value={customIssue}
              onChange={e => setCustomIssue(e.target.value)}
              placeholder="Describe in your own words..."
              rows={3}
              className="mt-3 w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
            />
          )}
        </div>

        {/* Error */}
        {errorText && (
          <div className="bg-red-900/40 border border-red-700/50 rounded-xl p-3 text-sm text-red-300">
            {errorText}
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={submitConditions}
          disabled={!selectedConditions.length || loading || !userId}
          className="w-full py-4 bg-purple-600 rounded-2xl font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Setting up...
            </span>
          ) : (
            `Continue →`
          )}
        </button>

        {!userId && (
          <p className="text-center text-xs text-gray-500">Loading your account...</p>
        )}
      </div>
    </div>
  );

  // ============ RENDER: Phases 1–4 — Chat ===================================
  const renderChat = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-3">

          {/* Phase progress pills */}
          <div className="flex gap-1.5 justify-center flex-wrap mb-4 pt-2">
            {PHASE_INFO.filter(p => p.num >= 1 && p.num <= 4).map(p => (
              <div key={p.num} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                phase === p.num
                  ? "bg-purple-600 text-white"
                  : phase > p.num
                  ? "bg-green-800/60 text-green-300"
                  : "bg-white/5 text-gray-500"
              }`}>
                {phase > p.num ? "✓" : `${p.num}`} {p.label}
              </div>
            ))}
          </div>

          {/* Messages */}
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                msg.role === "user" ? "bg-gray-700" : "bg-gradient-to-br from-purple-500 to-pink-500"
              }`}>
                {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`${msg.role === "user" ? "bg-white/10" : "bg-white/5"} backdrop-blur-xl border border-white/10 p-3 rounded-2xl`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoadingChat && (
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl">
                <span className="text-sm text-gray-300">thinking...</span>
              </div>
            </div>
          )}

          {/* Phase 4: confirmation summary card */}
          {phase === 4 && confirmationSummary && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 mt-2">
              <p className="text-sm font-semibold text-purple-300">Your companion profile</p>
              {confirmationSummary.companion_name && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase w-28">Name</span>
                  <span className="text-sm font-medium">{confirmationSummary.companion_name}</span>
                </div>
              )}
              {confirmationSummary.companion_persona && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase w-28">Vibe</span>
                  <span className="text-sm font-medium capitalize">{confirmationSummary.companion_persona}</span>
                </div>
              )}
              {confirmationSummary.support_style && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase w-28">Support style</span>
                  <span className="text-sm font-medium capitalize">{confirmationSummary.support_style}</span>
                </div>
              )}
              {confirmationSummary.check_in_frequency && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase w-28">Check-ins</span>
                  <span className="text-sm font-medium capitalize">{confirmationSummary.check_in_frequency.replace(/_/g, " ")}</span>
                </div>
              )}
              {confirmationSummary.memory_snapshot && (
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase mb-1">What I remember about you</p>
                  <p className="text-sm leading-relaxed">{confirmationSummary.memory_snapshot}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setInputMessage("yes, looks good");
                  setTimeout(() => {
                    setInputMessage("");
                    pushUserMessage("yes, looks good");
                    // send directly
                    (async () => {
                      setIsLoadingChat(true);
                      try {
                        const keys = await getApiKeys();
                        const apiKey = keys[keys.length - 1];
                        const res = await fetch(`${API_BASE}/chat`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ user_id: userId, message: "yes, looks good", api_key: apiKey })
                        });
                        const data = await res.json();
                        if (data.response || data.message) pushBotMessage(data.response || data.message);
                        if (data.companion_profile) setCompanionProfile(data.companion_profile);
                        if (data.complete || data.companion_activated || data.phase === 5) setPhase(5);
                      } catch (e) {
                        pushBotMessage("✨ You're all set!");
                        setPhase(5);
                      } finally {
                        setIsLoadingChat(false);
                      }
                    })();
                  }, 50);
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition text-sm"
              >
                ✅ Looks good — activate my companion!
              </button>
            </div>
          )}

          {errorText && (
            <div className="bg-red-900/40 border border-red-700/50 rounded-xl p-3 text-sm text-red-300 max-w-2xl mx-auto">
              {errorText}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/20">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none text-sm"
            rows={1}
          />
          <button
            onClick={sendChatMessage}
            disabled={!inputMessage.trim() || isLoadingChat}
            className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl disabled:opacity-40 hover:from-purple-600 hover:to-pink-600 transition"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
  );

  // ============ RENDER: Phase 5 — Companion Active ==========================
  const renderDone = () => (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-6xl">✨</div>
        <h2 className="text-2xl font-bold">
          {companionProfile?.companion_name || "Your companion"} is ready
        </h2>
        <p className="text-gray-300 text-sm">
          Your companion has been fully configured and activated. Head to the sessions page to start your first conversation.
        </p>

        {companionProfile && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
            {companionProfile.companion_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Name</span>
                <span className="font-semibold">{companionProfile.companion_name}</span>
              </div>
            )}
            {companionProfile.companion_persona && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Personality</span>
                <span className="capitalize">{companionProfile.companion_persona}</span>
              </div>
            )}
            {companionProfile.conditions?.primary && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Primary focus</span>
                <span className="capitalize">{companionProfile.conditions.primary.replace(/_/g, " ")}</span>
              </div>
            )}
            {companionProfile.schedule?.check_in_frequency && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Check-ins</span>
                <span className="capitalize">{companionProfile.schedule.check_in_frequency.replace(/_/g, " ")}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleExportSession}
            className="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => { startTrial?.(); onComplete?.(); }}
            className="flex-1 py-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <CheckCircle className="w-4 h-4" />
            Start Session →
          </button>
        </div>
      </div>
    </div>
  );

  // ============ MAIN RENDER =================================================
  const currentPhaseInfo = PHASE_INFO.find(p => p.num === Math.min(phase, 4)) || PHASE_INFO[0];
  const PhaseIcon = currentPhaseInfo.icon;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <PhaseIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">
              {phase === 0 ? "Companion Setup" : phase === 5 ? "All Set!" : `Phase ${phase} of 4`}
            </h1>
            <p className="text-xs text-gray-400">{currentPhaseInfo.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase > 0 && phase < 5 && (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={`h-1.5 w-6 rounded-full transition-all ${
                  n <= phase ? "bg-purple-400" : "bg-white/15"
                }`} />
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 ml-1">{messages.length > 0 ? `${messages.length} msgs` : ""}</p>
        </div>
      </div>

      {/* Body */}
      {phase === 0 && renderPhase0()}
      {phase >= 1 && phase <= 4 && renderChat()}
      {phase === 5 && renderDone()}
    </div>
  );
}