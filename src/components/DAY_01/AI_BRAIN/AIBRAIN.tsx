import React, { useEffect, useState, useRef } from "react";
import { Send, User, Bot, Loader2, CheckCircle, Download, Sparkles, Calendar, MapPin, Target, Zap } from "lucide-react";
import { getApiKeys } from "../backend/apikeys";
import firebaseServices from "@/sections/user/view/firebase-services";
const API_BASE = "https://pythonbackend-74es.onrender.com";



export default function AIBRAINPhaseFlow({ onComplete }) {
  const [userId, setUserId] = useState(() => {
  const stored = localStorage.getItem("user_id");
  if (stored) return stored;
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
});

  // ADD these three new state vars alongside phase4Step
const [phase1Step, setPhase1Step] = useState(1);
const [phase2Step, setPhase2Step] = useState(1);
const [phase3Step, setPhase3Step] = useState(1);
  const [phase, setPhase] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [taskOverview, setTaskOverview] = useState(null);
  // Add this with your other useState declarations
const [confirmationSummary, setConfirmationSummary] = useState(null);

  const [apiKeys, setApiKeys] = useState<string[]>([]);
const [loadingKeys, setLoadingKeys] = useState(true);


  const [touchpointInput, setTouchpointInput] = useState("");
  const [stressPeakInput, setStressPeakInput] = useState("");
  
  // ✅ FIXED: Phase 1 data structure matches backend expectations
  const [phase1Data, setPhase1Data] = useState({
    main_problem: "",
    where_happens: "",
    how_feels: "",
    impact: ""
  });

  // ✅ FIXED: Phase 2 data structure matches backend expectations
  const [phase2Data, setPhase2Data] = useState({
    skill_assessment: {
      eye_contact: "",
      small_talk: "",
      reading_cues: "",
      active_listening: "",
      humor: ""
    },
    past_attempts: "",
    biggest_struggle: ""
  });

  // ✅ FIXED: Phase 3 data structure matches backend expectations
  const [phase3Data, setPhase3Data] = useState({
    practice_locations: ["", "", ""],
    available_times: "",
    commitment_level: 5,
    top_anxiety: "",
    support_system: ""
  });

  // ✅ FIXED: Phase 4 data structure matches backend expectations
  // At the top of your component where you initialize phase4Data state:
// ✅ UPDATED phase4Data state (add to your component)
const [phase4Data, setPhase4Data] = useState({
  // EXISTING FIELDS
  weekly_schedule: {
    monday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
    tuesday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
    wednesday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
    thursday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
    friday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
    saturday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
    sunday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" }
  },
  existing_social_touchpoints: [],
  stress_peaks: [],
  energy_peak: "",
  stressed_days: [],
  morning_routine: "",
  lunch_routine: "",
  evening_routine: "",
  work_touchpoints: [],
  regular_social: "",
  hardest_time: "",
  
  // NEW FIELDS FOR BETTER EXTRACTION
  daily_strangers: "",
  daily_regulars: [],
  forced_interactions: [],
  proximity_spaces: [],
  digital_vs_irl: "",
  eating_habits: "",
  commute_type: "",
  commute_regulars: "",
  weekend_routine: "",
  group_chats: [],
  who_initiates: "",
  same_route_daily: ""
});

const [phase4Step, setPhase4Step] = useState(1);


  const messagesEndRef = useRef(null);

  useEffect(() => {
  pushBotMessage("Hey! I'm Jordan. I used to be that person who'd rehearse conversations in the shower, then freeze when actually talking to people. Took me years to figure this out. Ready to start?");
}, []);

  useEffect(() => {
  let mounted = true;

  async function loadKeys() {
    try {
      const keys = await getApiKeys();
      if (mounted) setApiKeys(keys);
    } catch (e) {
      console.error("Failed to load API keys", e);
    } finally {
      if (mounted) setLoadingKeys(false);
    }
  }

  loadKeys();
  return () => { mounted = false; };
}, []);

  useEffect(() => {
  localStorage.setItem("user_id", userId);
}, [userId]);

  const initSession = async (customSessionId = null) => {
    setLoading(true);
    setErrorText(null);
    
    const idToUse = customSessionId || userId;
    
    try {
      console.log("🔄 Initializing session:", idToUse);
      
      const res = await fetch(`${API_BASE}/init-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: idToUse
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} — ${txt}`);
      }

      const data = await res.json();
      console.log("✅ Session initialized:", data);
      
      // ✅ Verify session was created
      if (!data.success) {
        throw new Error("Session initialization failed");
      }
      
      setPhase(data.phase || 1);
      
      if (data.message) {
        pushBotMessage(data.message);
      }
    } catch (err) {
      console.error("❌ Init error:", err);
      setErrorText(String(err?.message || err));
      pushBotMessage(`⚠️ Init error: ${String(err?.message || err)}`);
    } finally {
      setLoading(false);
    }
  };


  const restartSession = () => {
  const newId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  console.log("🔄 Restarting with new session:", newId);
  setUserId(newId);
  setPhase(1);
  setMessages([]);
  setPlanGenerated(false);
  setCourseId(null);
  setTaskOverview(null);
  setErrorText(null);
  
  // Reset all phase data
  setPhase1Data({
    main_problem: "",
    where_happens: "",
    how_feels: "",
    impact: ""
  });
  
  setPhase2Data({
    skill_assessment: {
      eye_contact: "",
      small_talk: "",
      reading_cues: "",
      active_listening: "",
      humor: ""
    },
    past_attempts: "",
    biggest_struggle: ""
  });
  
  setPhase3Data({
    practice_locations: ["", "", ""],
    available_times: "",
    commitment_level: 5,
    top_anxiety: "",
    support_system: ""
  });
  
  setPhase4Data({
    weekly_schedule: {
      monday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
      tuesday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
      wednesday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
      thursday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
      friday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
      saturday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" },
      sunday: { morning: "", afternoon: "", evening: "", energy: "", stress: "" }
    },
    existing_social_touchpoints: [],
    stress_peaks: [],
    energy_peak: "",
    stressed_days: [],
    morning_routine: "",
    lunch_routine: "",
    evening_routine: "",
    work_touchpoints: [],
    regular_social: "",
    hardest_time: ""
  });

  pushBotMessage("Hey! I'm Jordan. Ready to start fresh?");
};

  function pushBotMessage(text) {
    setMessages(prev => [...prev, { 
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, 
      role: "assistant", 
      content: text, 
      timestamp: Date.now() 
    }]);
  }

  function pushUserMessage(text) {
    setMessages(prev => [...prev, { 
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, 
      role: "user", 
      content: text, 
      timestamp: Date.now() 
    }]);
  }

 const submitPhase1 = async (e) => {
  e?.preventDefault?.();
  setLoading(true);
  setErrorText(null);
  
  try {
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys[apiKeys.length - 1];

    const submissionSummary = `Problem: ${phase1Data.main_problem}\nWhere: ${phase1Data.where_happens}\nFeeling: ${phase1Data.how_feels}\nImpact: ${phase1Data.impact}`;
    pushUserMessage(submissionSummary);

    console.log("📤 Submitting Phase 1:", phase1Data);

    const res = await fetch(`${API_BASE}/submit-phase-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        phase: 1,
        form_data: phase1Data,
        api_key: apiKey
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status} — ${txt}`);
    }

    const data = await res.json();
    console.log("✅ Phase 1 response:", data);
    
    if (data.response) {
      pushBotMessage(data.response);
    }
    
    if (data.ready_for_next_phase && data.phase) {
      console.log(`✅ Advancing to phase ${data.phase}`);
      setPhase(data.phase);
    }
  } catch (err) {
    console.error("❌ Submit error:", err);
    setErrorText(String(err?.message || err));
    pushBotMessage(`⚠️ Submit error: ${String(err?.message || err)}`);
  } finally {
    setLoading(false);
  }
};


const submitPhase2 = async (e) => {
  e?.preventDefault?.();
  setLoading(true);
  setErrorText(null);
  
  try {
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys[apiKeys.length - 1];

    const submissionSummary = `Past attempts: ${phase2Data.past_attempts}\nSkills: Eye contact=${phase2Data.skill_assessment.eye_contact}, Small talk=${phase2Data.skill_assessment.small_talk}\nStruggle: ${phase2Data.biggest_struggle}`;
    pushUserMessage(submissionSummary);

    console.log("📤 Submitting Phase 2:", phase2Data);

    const res = await fetch(`${API_BASE}/submit-phase-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        phase: 2,
        form_data: phase2Data,
        api_key: apiKey
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status} — ${txt}`);
    }

    const data = await res.json();
    console.log("✅ Phase 2 response:", data);
    
    if (data.response) {
      pushBotMessage(data.response);
    }
    
    if (data.ready_for_next_phase) {
      setPhase(data.phase || 3);
    }
  } catch (err) {
    console.error("❌ Submit error:", err);
    setErrorText(String(err?.message || err));
    pushBotMessage(`⚠️ Submit error: ${String(err?.message || err)}`);
  } finally {
    setLoading(false);
  }
};

const submitPhase3 = async (e) => {
  e?.preventDefault?.();
  setLoading(true);
  setErrorText(null);
  
  try {
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys[apiKeys.length - 1];

    const locationsList = phase3Data.practice_locations.filter(l => l.trim());
    const submissionSummary = `Locations: ${locationsList.join(", ")}\nTimes: ${phase3Data.available_times}\nCommitment: ${phase3Data.commitment_level}/10\nTop anxiety: ${phase3Data.top_anxiety}`;
    pushUserMessage(submissionSummary);

    console.log("📤 Submitting Phase 3:", phase3Data);

    const res = await fetch(`${API_BASE}/submit-phase-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        phase: 3,
        form_data: phase3Data,
        api_key: apiKey
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status} — ${txt}`);
    }

    const data = await res.json();
    console.log("✅ Phase 3 response:", data);
    
    if (data.response) {
      pushBotMessage(data.response);
    }
    
    if (data.ready_for_next_phase) {
      setPhase(data.phase || 4);
    }
  } catch (err) {
    console.error("❌ Submit error:", err);
    setErrorText(String(err?.message || err));
    pushBotMessage(`⚠️ Submit error: ${String(err?.message || err)}`);
  } finally {
    setLoading(false);
  }
};

const submitPhase4 = async (e) => {
  e?.preventDefault?.();
  setLoading(true);
  setErrorText(null);
  
  try {
    // Transform phase4Data to match backend expectations
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys[apiKeys.length - 1];

    const transformedData = {
      ...phase4Data,
      weekly_schedule: {
        monday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'morning' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Monday') ? 'high' : 'low'
        },
        tuesday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'afternoon' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Tuesday') ? 'high' : 'low'
        },
        wednesday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'morning' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Wednesday') ? 'high' : 'low'
        },
        thursday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'afternoon' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Thursday') ? 'high' : 'low'
        },
        friday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'evening' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Friday') ? 'high' : 'low'
        },
        saturday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'morning' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Saturday') ? 'high' : 'low'
        },
        sunday: {
          morning: phase4Data.morning_routine,
          afternoon: phase4Data.lunch_routine,
          evening: phase4Data.evening_routine,
          energy: phase4Data.energy_peak === 'evening' ? 'high' : 'medium',
          stress: phase4Data.stressed_days?.includes('Sunday') ? 'high' : 'low'
        }
      },
      existing_social_touchpoints: phase4Data.work_touchpoints || [],
      stress_peaks: [phase4Data.hardest_time].filter(Boolean)
    };

    const submissionSummary = `Schedule: Detailed weekly breakdown\nSocial touchpoints: ${transformedData.existing_social_touchpoints.join(", ")}\nStress peaks: ${transformedData.stress_peaks.join(", ")}`;
    pushUserMessage(submissionSummary);

    console.log("📤 Submitting Phase 4:", transformedData);
    console.log("🆔 User ID being sent:", userId);

    const res = await fetch(`${API_BASE}/submit-phase-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        phase: 4,
        form_data: transformedData,
        api_key: apiKey
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status} — ${txt}`);
    }

    const data = await res.json();
    console.log("✅ Phase 4 response:", data);
    
    if (data.response) {
      pushBotMessage(data.response);
    }
    
    if (data.ready_for_next_phase) {
      setPhase(data.phase || 5);
      pushBotMessage("Ready for confirmation. Review everything and let me know if it looks good or if you want to change anything.");
    }
  } catch (err) {
    console.error("❌ Submit error:", err);
    setErrorText(String(err?.message || err));
    pushBotMessage(`⚠️ Submit error: ${String(err?.message || err)}`);
  } finally {
    setLoading(false);
  }
};


const sendChatMessage = async () => {
  if (!inputMessage.trim() || isLoadingChat) return;
  
  pushUserMessage(inputMessage);
  const messageToSend = inputMessage;
  setInputMessage("");
  setIsLoadingChat(true);

  try {
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys[apiKeys.length - 1];

    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_id: userId,
        message: messageToSend, 
        api_key: apiKey 
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status} — ${txt}`);
    }

    const data = await res.json();
const botResp = data.response || data.message || JSON.stringify(data);
pushBotMessage(botResp);

// ✅ NEW: Capture confirmation summary
if (data.confirmation_summary) {
  setConfirmationSummary(data.confirmation_summary);
}

if (data.task_overview) {
  setTaskOverview(data.task_overview);
}

if (data.course_id) {
  setCourseId(data.course_id);
}

if (data.plan_generated || data.phase >= 6 || data.complete) {
  setPlanGenerated(true);
  setPhase(6);
}
  } catch (err) {
    console.error("❌ Chat error:", err);
    setErrorText(String(err?.message || err));
    pushBotMessage(`⚠️ Chat error: ${String(err?.message || err)}`);
  } finally {
    setIsLoadingChat(false);
  }
};


const handleExportSession = () => {
  try {
    const exportData = {
      user_id: userId,  // ✅ Changed from session_id
      timestamp: new Date().toISOString(),
      messages,
      currentPhase: phase,
      courseId,
      taskOverview
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-${userId}.json`;  // ✅ Changed filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushBotMessage("✅ Session exported.");
  } catch (err) {
    console.error("export err", err);
    pushBotMessage(`⚠️ Export failed: ${String(err)}`);
  }
};

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

const renderPhase1Form = () => {
  const steps = [
    {
      question: "What's your main challenge right now?",
      field: "main_problem",
      options: [
        "I can't start conversations with strangers",
        "I freeze up in group settings",
        "I struggle to keep conversations going",
        "I feel anxious around new people"
      ]
    },
    {
      question: "Where does this happen most?",
      field: "where_happens",
      options: ["At work or school", "At social events", "With strangers in public", "With people I've just met"]
    },
    {
      question: "How does it feel in the moment?",
      field: "how_feels",
      options: ["My mind goes blank", "I feel my heart racing", "I overthink everything I say", "I just want to escape"]
    },
    {
      question: "What has this cost you?",
      field: "impact",
      options: ["Missing out on friendships", "Feeling left out at work/school", "Avoiding social events", "Feeling invisible"]
    }
  ];

  const current = steps[phase1Step - 1];
  const isLast = phase1Step === steps.length;
  const canProceed = !!phase1Data[current.field];

  return (
    <div className="space-y-6">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < phase1Step ? 'bg-purple-500 w-8' : 'bg-white/20 w-4'}`} />
        ))}
      </div>

      {/* Single question */}
      <div key={phase1Step} className="animate-fade-in">
        <p className="text-lg font-semibold mb-5">{current.question}</p>
        <div className="space-y-2">
          {current.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setPhase1Data({ ...phase1Data, [current.field]: option });
              }}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase1Data[current.field] === option
                  ? 'bg-purple-600 border-2 border-purple-400'
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Next / Submit button — only shows when answered */}
      {canProceed && (
        <button
          type="button"
          onClick={() => {
            if (isLast) submitPhase1();
            else setPhase1Step(s => s + 1);
          }}
          disabled={loading}
          className="w-full py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition text-lg"
        >
          {loading ? "..." : isLast ? "Submit →" : "Next →"}
        </button>
      )}
    </div>
  );
};

const renderPhase2Form = () => {
  const steps = [
    { type: "choice", question: "What have you tried before?", field: "past_attempts",
      options: ["Nothing, this is my first time", "Watched videos or read articles", "Tried therapy or counseling", "Tried but nothing worked"] },
    { type: "rating", question: "How's your eye contact?", skillKey: "eye_contact" },
    { type: "rating", question: "How's your small talk?", skillKey: "small_talk" },
    { type: "rating", question: "How well do you read body language?", skillKey: "reading_cues" },
    { type: "choice", question: "What's your biggest struggle?", field: "biggest_struggle",
      options: ["Starting conversations", "Keeping conversations going", "Making eye contact", "Not feeling awkward"] }
  ];

  const current = steps[phase2Step - 1];
  const isLast = phase2Step === steps.length;

  const canProceed = current.type === "rating"
    ? !!phase2Data.skill_assessment[current.skillKey]
    : !!phase2Data[current.field];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < phase2Step ? 'bg-purple-500 w-8' : 'bg-white/20 w-4'}`} />
        ))}
      </div>

      <div key={phase2Step}>
        <p className="text-lg font-semibold mb-2">{current.question}</p>

        {current.type === "choice" && (
          <div className="space-y-2">
            {current.options.map(option => (
              <button key={option} type="button"
                onClick={() => setPhase2Data({ ...phase2Data, [current.field]: option })}
                className={`w-full p-4 rounded-xl text-left transition ${
                  phase2Data[current.field] === option ? 'bg-purple-600 border-2 border-purple-400' : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}>
                {option}
              </button>
            ))}
          </div>
        )}

        {current.type === "rating" && (
          <div>
            <p className="text-sm text-gray-400 mb-4">1 = needs work · 5 = pretty good</p>
            <div className="flex gap-3 justify-center">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                  onClick={() => setPhase2Data({ ...phase2Data, skill_assessment: { ...phase2Data.skill_assessment, [current.skillKey]: n }})}
                  className={`w-14 h-14 rounded-xl text-xl font-bold transition ${
                    phase2Data.skill_assessment[current.skillKey] === n ? 'bg-purple-600 scale-110' : 'bg-white/10 hover:bg-white/20'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {canProceed && (
        <button type="button"
          onClick={() => { if (isLast) submitPhase2(); else setPhase2Step(s => s + 1); }}
          disabled={loading}
          className="w-full py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition text-lg">
          {loading ? "..." : isLast ? "Submit →" : "Next →"}
        </button>
      )}
    </div>
  );
};



const renderPhase3Form = () => {
  const steps = [
    { id: "locations" },
    { id: "available_times" },
    { id: "commitment_level" },
    { id: "top_anxiety" },
    { id: "support_system" }
  ];

  const totalSteps = steps.length;
  const currentId = steps[phase3Step - 1].id;
  const isLast = phase3Step === totalSteps;

  const canProceed = () => {
    if (currentId === "locations") return !!phase3Data.practice_locations[0]?.trim() && !!phase3Data.practice_locations[1]?.trim();
    if (currentId === "commitment_level") return true; // slider always has a value
    if (currentId === "support_system") return !!phase3Data.support_system?.trim();
    return !!phase3Data[currentId];
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex gap-2 justify-center">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < phase3Step ? "bg-purple-500 w-8" : "bg-white/20 w-4"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div key={phase3Step} className="animate-fade-in">

        {currentId === "locations" && (
          <div>
            <p className="text-lg font-semibold mb-1">Where do you go regularly?</p>
            <p className="text-sm text-gray-400 mb-4">Places where you see the same people</p>
            {[0, 1].map((idx) => (
              <input
                key={idx}
                type="text"
                value={phase3Data.practice_locations[idx] || ""}
                onChange={(e) => {
                  const newLocs = [...phase3Data.practice_locations];
                  newLocs[idx] = e.target.value;
                  setPhase3Data({ ...phase3Data, practice_locations: newLocs });
                }}
                placeholder={idx === 0 ? "E.g., Coffee shop" : "E.g., Gym"}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 mb-3 focus:outline-none focus:border-purple-400"
              />
            ))}
          </div>
        )}

        {currentId === "available_times" && (
          <div>
            <p className="text-lg font-semibold mb-4">When can you practice for 5 minutes?</p>
            <div className="space-y-2">
              {[
                "Mornings (before work/school)",
                "Lunch break",
                "After work/school",
                "Weekends"
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPhase3Data({ ...phase3Data, available_times: option })}
                  className={`w-full p-4 rounded-xl text-left transition ${
                    phase3Data.available_times === option
                      ? "bg-purple-600 border-2 border-purple-400"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentId === "commitment_level" && (
          <div>
            <p className="text-lg font-semibold mb-2">How committed are you?</p>
            <p className="text-sm text-gray-400 mb-6">Be honest — this shapes your plan intensity</p>
            <div className="text-center text-6xl font-bold mb-4 text-purple-300">
              {phase3Data.commitment_level}
              <span className="text-2xl text-gray-400">/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={phase3Data.commitment_level}
              onChange={(e) =>
                setPhase3Data({ ...phase3Data, commitment_level: parseInt(e.target.value) })
              }
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Just curious</span>
              <span>All in</span>
            </div>
          </div>
        )}

        {currentId === "top_anxiety" && (
          <div>
            <p className="text-lg font-semibold mb-4">What scares you most about talking to people?</p>
            <div className="space-y-2">
              {[
                "People will think I'm weird",
                "I'll say something stupid",
                "I'll freeze up completely",
                "People will reject me"
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPhase3Data({ ...phase3Data, top_anxiety: option })}
                  className={`w-full p-4 rounded-xl text-left transition ${
                    phase3Data.top_anxiety === option
                      ? "bg-purple-600 border-2 border-purple-400"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentId === "support_system" && (
          <div>
            <p className="text-lg font-semibold mb-2">Do you have anyone in your corner?</p>
            <p className="text-sm text-gray-400 mb-4">Friend, partner, family — or just say "no one"</p>
            <input
              type="text"
              value={phase3Data.support_system}
              onChange={(e) => setPhase3Data({ ...phase3Data, support_system: e.target.value })}
              placeholder='E.g., "My friend Alex" or "No one right now"'
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {phase3Step > 1 && (
          <button
            type="button"
            onClick={() => setPhase3Step((s) => s - 1)}
            className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition"
          >
            ← Back
          </button>
        )}
        {canProceed() && (
          <button
            type="button"
            onClick={() => {
              if (isLast) submitPhase3();
              else setPhase3Step((s) => s + 1);
            }}
            disabled={loading}
            className="flex-1 py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition text-lg disabled:opacity-50"
          >
            {loading ? "..." : isLast ? "Submit →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
};


  // Step 1: Energy & Stress Patterns
 
// ✅ UPDATED renderPhase4Form function
const renderPhase4Form = () => {
  const totalSteps = 6;

  // Shared progress bar component
  const ProgressDots = ({ current }: { current: number }) => (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? "bg-purple-500 w-8" : "bg-white/20 w-4"
          }`}
        />
      ))}
    </div>
  );

  // ─── STEP 1: Energy & Stress ───────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <ProgressDots current={1} />

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">When do you have energy?</h3>
        <p className="text-sm text-gray-400 mt-2">
          This helps us schedule practice at the right times
        </p>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          What time of day are you most energized?
        </label>
        <div className="space-y-2">
          {[
            { value: "morning", label: "Morning (6am–12pm)", icon: "🌅" },
            { value: "afternoon", label: "Afternoon (12pm–6pm)", icon: "☀️" },
            { value: "evening", label: "Evening (6pm–10pm)", icon: "🌆" },
          ].map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, energy_peak: value })}
              className={`w-full p-4 rounded-xl text-left transition flex items-center gap-3 ${
                phase4Data.energy_peak === value
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Which days are you most stressed?
        </label>
        <p className="text-sm text-gray-400 mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day) => {
              const isSelected = phase4Data.stressed_days?.includes(day) || false;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const current = phase4Data.stressed_days || [];
                    const updated = isSelected
                      ? current.filter((d) => d !== day)
                      : [...current, day];
                    setPhase4Data({ ...phase4Data, stressed_days: updated });
                  }}
                  className={`p-3 rounded-lg transition ${
                    isSelected
                      ? "bg-red-600 border-2 border-red-400"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {day}
                </button>
              );
            }
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPhase4Step(2)}
        disabled={!phase4Data.energy_peak || !phase4Data.stressed_days?.length}
        className="w-full py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );

  // ─── STEP 2: Daily Routine ─────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-6">
      <ProgressDots current={2} />

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Your typical day</h3>
        <p className="text-sm text-gray-400 mt-2">Where do you already go regularly?</p>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">Morning routine</label>
        <div className="space-y-2">
          {[
            "Coffee shop on commute",
            "Gym before work",
            "Breakfast spot",
            "Walk/commute",
            "None — go straight to work/school",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, morning_routine: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.morning_routine === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">Lunch time</label>
        <div className="space-y-2">
          {[
            "Cafeteria/food court with coworkers",
            "Grab food alone outside",
            "Eat at desk",
            "Gym during lunch",
            "No real lunch break",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, lunch_routine: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.lunch_routine === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">After work/school</label>
        <div className="space-y-2">
          {[
            "Gym/fitness",
            "Grocery shopping",
            "Coffee shop or cafe",
            "Straight home",
            "Varies day to day",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, evening_routine: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.evening_routine === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPhase4Step(1)}
          className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setPhase4Step(3)}
          disabled={
            !phase4Data.morning_routine ||
            !phase4Data.lunch_routine ||
            !phase4Data.evening_routine
          }
          className="flex-1 py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );

  // ─── STEP 3: Social Touchpoints ────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="space-y-6">
      <ProgressDots current={3} />

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Where do you see people?</h3>
        <p className="text-sm text-gray-400 mt-2">Times you're already around others</p>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          At work/school, when do you interact?
        </label>
        <div className="space-y-2">
          {[
            "Morning standup or team meeting",
            "Lunch break with coworkers",
            "Hallway/break room encounters",
            "End of day check-ins",
            "I mostly work alone",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                const current = phase4Data.work_touchpoints || [];
                const isSelected = current.includes(option);
                const updated = isSelected
                  ? current.filter((t) => t !== option)
                  : [...current, option];
                setPhase4Data({ ...phase4Data, work_touchpoints: updated });
              }}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.work_touchpoints?.includes(option)
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    phase4Data.work_touchpoints?.includes(option)
                      ? "border-purple-300 bg-purple-500"
                      : "border-white/40"
                  }`}
                >
                  {phase4Data.work_touchpoints?.includes(option) && "✓"}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Do you have any regular social events?
        </label>
        <p className="text-sm text-gray-400 mb-3">Weekly classes, meetups, sports, etc.</p>
        <div className="space-y-2">
          {[
            "Yes — weekly class or group",
            "Yes — casual weekly hangout",
            "Sometimes — monthly events",
            "No regular social events",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, regular_social: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.regular_social === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Hardest time of week for you?
        </label>
        <input
          type="text"
          value={phase4Data.hardest_time || ""}
          onChange={(e) => setPhase4Data({ ...phase4Data, hardest_time: e.target.value })}
          placeholder="E.g., Monday mornings, Friday afternoons..."
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPhase4Step(2)}
          className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setPhase4Step(4)}
          disabled={!phase4Data.work_touchpoints?.length || !phase4Data.regular_social}
          className="flex-1 py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );

  // ─── STEP 4: Daily Micro-interactions ─────────────────────────────────────
  const renderStep4 = () => (
    <div className="space-y-6">
      <ProgressDots current={4} />

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Daily micro-interactions</h3>
        <p className="text-sm text-gray-400 mt-2">Who do you see every day?</p>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          How many strangers do you see daily?
        </label>
        <div className="space-y-2">
          {[
            { value: "0-5", label: "0–5 people (work from home, rarely go out)" },
            { value: "5-20", label: "5–20 people (some commute, occasional errands)" },
            { value: "20-50", label: "20–50 people (busy commute, office job)" },
            { value: "50+", label: "50+ people (public transit, retail, busy city)" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, daily_strangers: value })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.daily_strangers === value
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Who do you see EVERY day?
        </label>
        <p className="text-sm text-gray-400 mb-3">Select all that apply</p>
        <div className="space-y-2">
          {[
            "Coffee shop barista",
            "Building doorman/security",
            "Coworkers/classmates",
            "Gym staff/regulars",
            "Neighbors",
            "Bus driver/commute people",
            "No one — different people daily",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                const current = phase4Data.daily_regulars || [];
                const isSelected = current.includes(option);
                const updated = isSelected
                  ? current.filter((r) => r !== option)
                  : [...current, option];
                setPhase4Data({ ...phase4Data, daily_regulars: updated });
              }}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.daily_regulars?.includes(option)
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    phase4Data.daily_regulars?.includes(option)
                      ? "border-purple-300 bg-purple-500"
                      : "border-white/40"
                  }`}
                >
                  {phase4Data.daily_regulars?.includes(option) && "✓"}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Do you take the same route/go to same places daily?
        </label>
        <div className="space-y-2">
          {[
            "Yes — exact same routine every day",
            "Mostly — same places but varies slightly",
            "No — always different routes/places",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, same_route_daily: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.same_route_daily === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPhase4Step(3)}
          className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setPhase4Step(5)}
          disabled={!phase4Data.daily_strangers || !phase4Data.same_route_daily}
          className="flex-1 py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );

  // ─── STEP 5: Communication Style ───────────────────────────────────────────
  const renderStep5 = () => (
    <div className="space-y-6">
      <ProgressDots current={5} />

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Your communication style</h3>
        <p className="text-sm text-gray-400 mt-2">How do you interact now?</p>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Do you HAVE to talk to anyone for work/school?
        </label>
        <p className="text-sm text-gray-400 mb-3">Select all that apply</p>
        <div className="space-y-2">
          {[
            "Daily presentations or reports",
            "Customer service / client calls",
            "Team check-ins or standups",
            "Teaching or tutoring",
            "No required speaking",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                const current = phase4Data.forced_interactions || [];
                const isSelected = current.includes(option);
                const updated = isSelected
                  ? current.filter((f) => f !== option)
                  : [...current, option];
                setPhase4Data({ ...phase4Data, forced_interactions: updated });
              }}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.forced_interactions?.includes(option)
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    phase4Data.forced_interactions?.includes(option)
                      ? "border-purple-300 bg-purple-500"
                      : "border-white/40"
                  }`}
                >
                  {phase4Data.forced_interactions?.includes(option) && "✓"}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          How do you communicate most?
        </label>
        <div className="space-y-2">
          {[
            "90% text/email, 10% face-to-face",
            "70% text/email, 30% face-to-face",
            "50/50 digital and in-person",
            "Mostly face-to-face, some text",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, digital_vs_irl: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.digital_vs_irl === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Who initiates conversations with YOU?
        </label>
        <div className="space-y-2">
          {[
            "Coworkers/classmates reach out often",
            "Only close friends initiate",
            "Family initiates, no one else",
            "Almost no one initiates with me",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, who_initiates: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.who_initiates === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPhase4Step(4)}
          className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setPhase4Step(6)}
          disabled={!phase4Data.digital_vs_irl || !phase4Data.who_initiates}
          className="flex-1 py-4 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );

  // ─── STEP 6: Proximity & Habits ────────────────────────────────────────────
  const renderStep6 = () => (
    <div className="space-y-6">
      <ProgressDots current={6} />

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Your proximity to people</h3>
        <p className="text-sm text-gray-400 mt-2">Where are you physically near others?</p>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Where do you sit/spend time near people?
        </label>
        <p className="text-sm text-gray-400 mb-3">Select all that apply</p>
        <div className="space-y-2">
          {[
            "Open office / shared workspace",
            "Classroom / lecture hall",
            "Coffee shop tables",
            "Gym locker room / equipment area",
            "Public transit",
            "Waiting areas (doctor, DMV, etc.)",
            "I'm usually alone",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                const current = phase4Data.proximity_spaces || [];
                const isSelected = current.includes(option);
                const updated = isSelected
                  ? current.filter((p) => p !== option)
                  : [...current, option];
                setPhase4Data({ ...phase4Data, proximity_spaces: updated });
              }}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.proximity_spaces?.includes(option)
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    phase4Data.proximity_spaces?.includes(option)
                      ? "border-purple-300 bg-purple-500"
                      : "border-white/40"
                  }`}
                >
                  {phase4Data.proximity_spaces?.includes(option) && "✓"}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">
          Do you eat alone or with others?
        </label>
        <div className="space-y-2">
          {[
            "Always eat alone",
            "Usually alone, sometimes with others",
            "Usually with others, sometimes alone",
            "Always with a group",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, eating_habits: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.eating_habits === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">How do you commute?</label>
        <div className="space-y-2">
          {[
            "Drive alone",
            "Carpool with coworkers/friends",
            "Public transit (see same people)",
            "Public transit (different people daily)",
            "Walk/bike",
            "Work from home",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, commute_type: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.commute_type === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium mb-3">Weekend routine?</label>
        <div className="space-y-2">
          {[
            "Stay home mostly",
            "Run errands (grocery, gym, etc.)",
            "Social events or outings",
            "Mix of alone time and social",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPhase4Data({ ...phase4Data, weekend_routine: option })}
              className={`w-full p-4 rounded-xl text-left transition ${
                phase4Data.weekend_routine === option
                  ? "bg-purple-600 border-2 border-purple-400"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPhase4Step(5)}
          className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={
            loading ||
            !phase4Data.eating_habits ||
            !phase4Data.commute_type ||
            !phase4Data.weekend_routine
          }
          className="flex-1 py-4 bg-green-600 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "🚀 Create My Plan"}
        </button>
      </div>
    </div>
  );

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={submitPhase4} className="max-w-2xl mx-auto">
      {phase4Step === 1 && renderStep1()}
      {phase4Step === 2 && renderStep2()}
      {phase4Step === 3 && renderStep3()}
      {phase4Step === 4 && renderStep4()}
      {phase4Step === 5 && renderStep5()}
      {phase4Step === 6 && renderStep6()}
    </form>
  );
};






  const renderPlanSummary = () => {
    if (!taskOverview) return null;

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold">Your 5-Day Plan is Ready! 🎉</h2>
          </div>
          
          <div className="space-y-3">
            {taskOverview.days?.slice(0, 5).map((day, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    {day.day}
                  </div>
                  <h3 className="font-semibold">{day.title}</h3>
                </div>
                {day.tasks?.map((task, tidx) => (
                  <p key={tidx} className="text-sm text-gray-300 ml-11">{task.description}</p>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={() => onComplete?.()}
            className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition"
          >
            Next Step
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 to-pink-950 text-white">
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Jordan</h1>
            <p className="text-xs text-gray-300">Your AI Coach — Phase {phase}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{messages.length} messages</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className={`${msg.role === 'user' ? 'bg-white/10' : 'bg-white/5'} backdrop-blur-xl border border-white/10 p-3 rounded-2xl`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                <span>Jordan is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {phase === 1 && (
          <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 mt-4">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Phase 1: What's the Problem?
            </h2>
            {errorText && <pre className="text-xs p-2 bg-red-900/40 rounded mb-4 whitespace-pre-wrap">{errorText}</pre>}
            {renderPhase1Form()}
          </div>
        )}

        {phase === 2 && (
          <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 mt-4">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Phase 2: Skills Assessment
            </h2>
            {errorText && <pre className="text-xs p-2 bg-red-900/40 rounded mb-4 whitespace-pre-wrap">{errorText}</pre>}
            {renderPhase2Form()}
          </div>
        )}

        {phase === 3 && (
          <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 mt-4">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Phase 3: Logistics & Commitment
            </h2>
            {errorText && <pre className="text-xs p-2 bg-red-900/40 rounded mb-4 whitespace-pre-wrap">{errorText}</pre>}
            {renderPhase3Form()}
          </div>
        )}

        {phase === 4 && (
          <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 mt-4">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Phase 4: Schedule Optimization
            </h2>
            {errorText && <pre className="text-xs p-2 bg-red-900/40 rounded mb-4 whitespace-pre-wrap">{errorText}</pre>}
            {renderPhase4Form()}
          </div>
        )}

        {phase === 5 && !planGenerated && (
  <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 mt-4">
    <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
      <CheckCircle className="w-6 h-6 text-yellow-400" />
      Phase 5: Confirm Your Plan
    </h2>

    {/* ✅ Show confirmation summary when received */}
    {confirmationSummary ? (
      <div className="space-y-3 mb-6">
        <p className="text-sm text-gray-300 mb-4">
          Jordan has summarized everything. Review below and type <strong>"yes"</strong> to generate your plan, or tell Jordan what to change.
        </p>

        {/* Problem */}
        {confirmationSummary.problem && (
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase mb-1">Your Problem</p>
            <p className="text-sm">{confirmationSummary.problem}</p>
          </div>
        )}

        {/* Skill Focus */}
        {confirmationSummary.skill_focus && (
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase mb-1">Skill Focus</p>
            <p className="text-sm">{confirmationSummary.skill_focus}</p>
          </div>
        )}

        {/* Locations */}
        {confirmationSummary.locations?.length > 0 && (
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase mb-1">Practice Locations</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {confirmationSummary.locations.map((loc, i) => (
                <span key={i} className="bg-purple-600/50 px-3 py-1 rounded-full text-sm">
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        {confirmationSummary.schedule && (
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase mb-1">Schedule</p>
            <p className="text-sm">{confirmationSummary.schedule}</p>
          </div>
        )}

        {/* Commitment */}
        {confirmationSummary.commitment && (
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase mb-1">Commitment Level</p>
            <p className="text-sm font-bold text-purple-300">{confirmationSummary.commitment}</p>
          </div>
        )}

        {/* Quick confirm button */}
        <button
          onClick={() => {
            setInputMessage("yes, looks good");
            setTimeout(() => sendChatMessage(), 100);
          }}
          className="w-full py-3 bg-green-600 rounded-xl font-semibold hover:bg-green-700 transition mt-2"
        >
          ✅ Looks Good — Generate My Plan!
        </button>
      </div>
    ) : (
      /* ✅ Loading state while waiting for summary */
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-400" />
        <p className="text-gray-400 text-sm">Jordan is reviewing your answers...</p>
        <p className="text-gray-500 text-xs mt-2">Type anything to get your confirmation summary</p>
      </div>
    )}
  </div>
)}

        {(phase === 5 || phase === 6) && taskOverview && renderPlanSummary()}
      </div>

      <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/20">
        {phase >= 5 ? (
          <div>
            <div className="mb-3 flex gap-2">
              <button 
                onClick={handleExportSession} 
                className="py-2 px-4 bg-white/10 rounded-xl hover:bg-white/20 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Session
              </button>
              {planGenerated && (
                <button 
                  onClick={() => onComplete?.()} 
                  className="py-2 px-4 bg-green-600 rounded-xl hover:bg-green-700 transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Next Step !
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={e => { 
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    sendChatMessage(); 
                  } 
                }}
                placeholder="Type a message to Jordan..."
                className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none resize-none"
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
        ) : (
          <div className="flex gap-2 justify-between items-center">
            <div className="text-xs text-gray-300">Phase {phase} of 4 — Frontend forms</div>
            <div className="flex gap-2">
              <button 
                onClick={restartSession} 
                className="px-3 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition"
              >
                Restart Session
              </button>
              <button 
                onClick={handleExportSession} 
                className="px-3 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}