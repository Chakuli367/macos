import React, { useState , useRef , useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  ArrowLeft,
  Heart,
  Target,
  Users,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Brain,
  Trophy,
  Zap,
  Star,
  Swords
} from "lucide-react";
import { SignupForm } from "./signup-form";
import { getApiKeys } from 'src/backend/apikeys';
import AIBRAINPhaseFlow from "src/components/AIBRAIN";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc , serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";


// FIREBASE CONFIG (YOUR ORIGINAL)
const firebaseConfig = {
apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
authDomain: "Connect-c5e9c.firebaseapp.com",
projectId: "Connect-c5e9c",
storageBucket: "Connect-c5e9c.firebasestorage.app",
messagingSenderId: "544004357501",
appId: "1:544004357501:web:4b81a3686422b28534e014",
measurementId: "G-BJQMLK9JJ1",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const firestore = getFirestore(app);



const SignInView = () => {
  // CRITICAL FIX: Move useNavigate to top level of component
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [showAppDownload, setShowAppDownload] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const [answers, setAnswers] = useState({}); // or [] depending on type
  const [showAppPreview, setShowAppPreview] = useState(false);
const [showTrialIntro, setShowTrialIntro] = useState(false);
const [successfulDays, setSuccessfulDays] = useState(0);
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
const [planPreview, setPlanPreview] = useState<any>(null);

  const auth = getAuth();
const userId = auth.currentUser?.uid || "user_trial";
const messagesEndRef = useRef<HTMLDivElement>(null);

const APP_SLIDES = [
  {
    image: new URL('../PHOTOS/01.png', import.meta.url).href,
    title: "Your missions, waiting",
    description: "Every morning you get a tiny, doable social challenge — calibrated to exactly where you are in your journey.",
  },
  {
    image: new URL('../PHOTOS/01.png', import.meta.url).href,
    title: "Watch yourself grow",
    description: "A visual skill map shows you exactly how far you've come — unlocking new challenges as your confidence builds.",
  },
  {
    image: new URL('../PHOTOS/01.png', import.meta.url).href,
    title: "Practice before the real thing",
    description: "Rehearse conversations with our AI coach. Get instant feedback so you walk into every situation ready.",
  },
  {
    image: new URL('../PHOTOS/01.png', import.meta.url).href,
    title: "Every win celebrated",
    description: "Streaks, badges, and milestone moments keep you motivated — because small wins compound into big changes.",
  },
];


 function TrialIntroScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 50%, #0d1a3a 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-2xl shadow-purple-700/40">
          <span className="text-4xl">🚀</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-purple-200 text-xs font-semibold tracking-widest uppercase">
            Early Access — Closed Beta
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
          Try the app first
          <br />
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            see how it works
          </span>
        </h2>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Take a quick look inside and experience how everything works — your plan, practice system, and progress tools. If you like it, you can continue right where you left off.
        </p>

        {/* What you get */}
        <div className="w-full space-y-2 mb-8">
          {[
            { e: "🎯", t: "Build your personalized 5-day plan" },
            { e: "💬", t: "Practice real conversations with AI" },
            { e: "📈", t: "Track your progress as you go" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-left">
              <span className="text-lg">{item.e}</span>
              <span className="text-slate-300 text-sm">{item.t}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-extrabold text-base shadow-2xl shadow-purple-700/40 hover:scale-[1.03] active:scale-[0.98] transition-transform"
        >
          Start Exploring →
        </button>

        {/* Footer */}
        <p className="text-slate-600 text-xs mt-4">
          Jump in and try it out — no setup needed.
        </p>
      </motion.div>
    </motion.div>
  );
}


  function AppPreviewScreen({ onContinue }: { onContinue: () => void }) {
    const [current, setCurrent] = useState(0);
    const [showIntro, setShowIntro] = useState(false);
    const goTo = (idx: number) =>
      setCurrent(Math.max(0, Math.min(idx, APP_SLIDES.length - 1)));
  
    const handleDragEnd = (_: any, info: any) => {
      if (info.offset.x < -50) goTo(current + 1);
      else if (info.offset.x > 50) goTo(current - 1);
    };
  
    const slide = APP_SLIDES[current];
    const isLast = current === APP_SLIDES.length - 1;
  
    return (
      <motion.div
        className="fixed inset-0 z-[9998] flex flex-col items-center justify-center px-5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 50%, #0d1a3a 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-purple-200 text-xs font-semibold tracking-widest uppercase">
              Closed Beta — Limited Spots
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Here's what's inside
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              the app
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Swipe to explore — your plan is already waiting in here
          </p>
        </motion.div>
  
        <div className="relative flex items-center justify-center w-full max-w-xs mb-5 select-none">
          <div className="absolute inset-0 blur-3xl opacity-25 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full scale-75 pointer-events-none" />
  
          {current > 0 && (
            <button
              onClick={() => goTo(current - 1)}
              className="absolute -left-3 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              ‹
            </button>
          )}
  
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="relative z-10"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 55, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -55, scale: 0.94 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="relative w-[200px] h-[400px] bg-slate-900 rounded-[2.5rem] border-[5px] border-slate-700 shadow-2xl overflow-hidden ring-2 ring-white/10">
                <div className="absolute top-0 left-0 right-0 h-7 bg-black/60 z-10 flex items-center justify-center">
                  <div className="w-16 h-3.5 bg-slate-800 rounded-full" />
                </div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full" />
              </div>
            </motion.div>
          </AnimatePresence>
  
          {current < APP_SLIDES.length - 1 && (
            <button
              onClick={() => goTo(current + 1)}
              className="absolute -right-3 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              ›
            </button>
          )}
        </div>
  
        <div className="flex gap-2 mb-5">
          {APP_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-purple-400 w-6" : "bg-white/20 w-2"
              }`}
            />
          ))}
        </div>
  
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "-text"}
            className="text-center max-w-xs mb-7 px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <h3 className="text-white font-bold text-xl mb-1.5">{slide.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
  
        <motion.div
  className="w-full max-w-xs text-center"
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
>
  {isLast ? (
    <>
      <p className="text-slate-500 text-xs mb-3">
        🔒 Closed beta — grab your spot before it fills up
      </p>
      <button
        onClick={() => setShowIntro(true)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-extrabold text-base shadow-2xl shadow-purple-700/40 hover:scale-[1.03] active:scale-[0.98] transition-transform"
      >
  Join Closed Beta →
</button>
      <p className="text-slate-600 text-xs mt-3">
        Your plan is already saved — don't lose access to it
      </p>
    </>
  ) : (
    <button
      onClick={() => goTo(current + 1)}
      className="w-full py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition-colors"
    >
      Next →
    </button>
  )}
</motion.div>
      </motion.div>
    );
  }

  // Quiz questions
  const quizQuestions = [
    {
      id: "struggle",
      question: "what feels hardest when anxiety kicks in?",
      options: [
        { value: "starting", label: "Starting conversations", icon: MessageCircle },
        { value: "friends", label: "Finding people who get me", icon: Users },
        { value: "confidence", label: "Believing I belong", icon: TrendingUp },
        { value: "maintaining", label: "Keeping connections alive", icon: Heart }
      ]
    },
    {
      id: "comfort",
      question: "how does your body feel before a social situation?",
      options: [
        { value: "very_uncomfortable", label: "Heart racing — I'd rather cancel", icon: null },
        { value: "uncomfortable", label: "Pretty anxious, but I push through", icon: null },
        { value: "okay", label: "Depends on the day, honestly", icon: null },
        { value: "comfortable", label: "Mild nerves, mostly okay", icon: null }
      ]
    },
    {
      id: "goal",
      question: "if anxiety wasn't in the way, what would change?",
      options: [
        { value: "casual", label: "I'd just chat without overthinking every word", icon: null },
        { value: "circle", label: "I'd finally feel like I belong somewhere", icon: null },
        { value: "networking", label: "I'd feel excited meeting people, not dread it", icon: null },
        { value: "authentic", label: "I'd show up as myself without second-guessing", icon: null }
      ]
    }
  ];

  
  const detailedFeatures = [
    {
      icon: Brain,
      title: "Daily Practice That Actually Feels Safe",
      description:
        "One tiny step each day. Small enough that anxiety can't block it. Just enough to prove to yourself that you can do this — without the overwhelm.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Watch Your Anxiety Shrink Over Time",
      description:
        "A simple visual map shows your streak. When you can see how far you've come, the next step feels a little less scary. Progress is its own medicine.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: MessageCircle,
      title: "Rehearse Before You're In the Room",
      description:
        "Practice conversations with our AI before real situations. Walk in with a plan, not a blank mind — it genuinely takes the edge off.",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Trophy,
      title: "Showing Up Is the Win",
      description:
        "We celebrate consistency, not perfection. Because showing up when anxiety is loud? That takes real courage. We'll make sure you see that.",
      gradient: "from-violet-500 to-violet-600",
    },
    {
      icon: Target,
      title: "Built Around Your Anxiety, Not a Template",
      description:
        "You pick what to work on. Saying hi to one person? Surviving a party? Whatever your edge is, that's where we start — and build from there.",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Find People Who Actually Get It",
      description:
        "Connect with others on the same path. Not to perform progress — just to share it with people who understand the weight of it. You're not alone in this.",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
setToast({ message, type });
setTimeout(() => setToast(null), 3500);
};

  const MOCK_PLAN = {
  overview: {
    days: [
      { day: 1, title: "Notice & Name", task: "Spot one moment of social anxiety today — just observe it, no judgment." },
      { day: 2, title: "One Breath, One Step", task: "Before any social interaction, take 3 slow breaths. Try it at least once today." },
      { day: 3, title: "Low-Stakes Hello", task: "Say hi to one person you wouldn't normally — cashier, neighbour, classmate." },
      { day: 4, title: "Find Your Mirror", task: "Message someone in your community and share one thing you noticed this week." },
      { day: 5, title: "Reflect & Recharge", task: "Journal: what felt easier than expected? What do you want to try next week?" },
    ]
  },
  success: true,
};


  const GENERATION_STEPS = [
{ icon: "🔍", text: "Reading your anxiety patterns..." },
{ icon: "📊", text: "Finding your calm entry points..." },
{ icon: "✍️", text: "Building Day 1: Notice & Name..." },
{ icon: "✍️", text: "Building Day 2: Breathe & Step..." },
{ icon: "✍️", text: "Building Day 3: Low-Stakes Win..." },
{ icon: "✍️", text: "Building Day 4: Find Your Mirror..." },
{ icon: "✍️", text: "Building Day 5: Reflect & Recharge..." },
{ icon: "✅", text: "Finalizing your calm plan..." },
];

  // ✅ CREATE MOCK PLAN WHEN REACHING PAGE 9
  useEffect(() => {
    if (currentPage !== 9) return; // Only run on page 9
    
    const createMockPlan = async () => {
      try {
        console.log("🔄 Creating 5-day mock plan...");
        
        const courseId = "social_skills";
        const userPlanRef = doc(firestore, "users", userId, "datedcourses", courseId);
        
        await setDoc(userPlanRef, {
          task_overview: MOCK_PLAN.overview,
          goal_name: quizAnswers.struggle || "managing social anxiety",
          user_id: userId,
          course_id: courseId,
          generated_at: serverTimestamp(),
          created_at: serverTimestamp(),
          is_mock_plan: true,
          status: "active",
          completion_rate: 0
        });
        
        console.log("✅ Mock plan created and saved to Firebase");
        showToast("✅ Your 5-day calm plan is ready!", "success");
        
      } catch (error) {
        console.error("❌ Error creating mock plan:", error);
        showToast("⚠️ Could not create plan", "error");
      }
    };
    
    createMockPlan();
  }, [currentPage]); // Run when currentPage changes to 9

  const markPlanAsCreated = async () => {
  try {
  if (!auth.currentUser) {
  console.error("❌ No authenticated user found");
  return;
  }
  const userRef = doc(firestore, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
  planCreated: true,
  planCreatedAt: serverTimestamp(),
  });
  console.log("✅ planCreated set to true");
  } catch (error) {
  console.error("❌ Error marking plan as created:", error);
  }
  };

  const handleGeneratePlan = async () => {
    console.log("🚀 Starting 5-day task overview generation...");
    setIsGeneratingPlan(true);
    setCurrentStep(0);
  
    const userMessages = messages.filter((m) => m.role === "user");
    const userAnswers = Object.values(answers);
    const goalName =
      (userMessages[0]?.content && userMessages[0].content.trim()) ||
      (userAnswers[0] && userAnswers[0].toString().trim()) ||
      "managing social anxiety";
  
    const joinDate = new Date().toISOString().split('T')[0];
    const payload = {
      user_id: userId,
      goal_name: goalName,
      user_answers: userAnswers,
      join_date: joinDate,
    };
  
    // Simulate step-by-step progress
    const progressInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < GENERATION_STEPS.length) return prev + 1;
        return prev;
      });
    }, 1200);
  
    let data: any = null;
    let success = false;
    let useMockPlan = false;
  
    try {
      // Fetch API keys from Firebase
      const apiKeys = await getApiKeys();
      
      if (apiKeys.length === 0) {
        console.warn("⚠️ No API keys available. Using mock plan.");
        data = MOCK_PLAN;
        success = true;
        useMockPlan = true;
      } else {
        // --- API KEY LOOP ---
        for (let i = 0; i < apiKeys.length; i++) {
          const apiKey = apiKeys[i];
  
          try {
            const resp = await fetch(
              "https://pythonbackend-74es.onrender.com/create-task-overview",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
              }
            );
  
            try {
              data = await resp.json();
            } catch (jsonErr) {
              const rawText = await resp.text();
              console.warn(`Invalid JSON with key ${i + 1}:`, rawText);
              continue;
            }
  
            if (!resp.ok || !data.success || !data.overview) {
              console.warn(`API key ${i + 1} failed or invalid response`, data);
              continue;
            }
  
            success = true;
            console.log("✅ Task overview received:", data.overview);
            break;
  
          } catch (err) {
            console.warn(`Request failed with key ${i + 1}:`, err);
          }
        }
        // --- END API KEY LOOP ---
  
        // Fallback to mock plan if all keys failed
        if (!success) {
          console.warn("⚠️ All API keys failed. Falling back to mock plan.");
          data = MOCK_PLAN;
          success = true;
          useMockPlan = true;
        }
      }
  
      const overviewToSave = data.overview;
  
      // Save to Firebase
      const courseId = "social_skills";
      const userPlanRef = doc(firestore, "users", userId, "datedcourses", courseId);
  
      await setDoc(userPlanRef, {
        task_overview: overviewToSave,
        goal_name: goalName,
        user_id: userId,
        course_id: courseId,
        generated_at: serverTimestamp(),
        created_at: serverTimestamp(),
        is_mock_plan: useMockPlan,
      });
  
      console.log(`✅ 5-day task overview saved to Firebase (Mock: ${useMockPlan})`);
  
      setSuccessfulDays(5);
      setCurrentStep(GENERATION_STEPS.length);
      await markPlanAsCreated();
  
      setPlanPreview({
        days: overviewToSave.days || [
          { day: 1, title: "Notice & Name", task: "Spot one moment of anxiety — just observe it" },
          { day: 2, title: "Breathe & Step", task: "3 breaths before any social moment" },
          { day: 3, title: "Low-Stakes Hello", task: "One hi to someone new" },
          { day: 4, title: "Find Your Mirror", task: "Connect with someone on the same path" },
          { day: 5, title: "Reflect & Recharge", task: "Journal what felt easier than expected" },
        ]
      });
  
      showToast(`🌿 Your 5-day calm plan is ready!${useMockPlan ? ' (Using a backup plan)' : ''}`, "success");
  
    } catch (err: any) {
      console.error("🔥 handleGeneratePlan error:", err);
      showToast(`⚠️ Plan generation failed: ${err.message}`, "error");
    } finally {
      clearInterval(progressInterval);
      setIsGeneratingPlan(false);
    }
  };
  
  const pages = [
    // Page 0: Welcome
    {
      component: () => (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          {/* Animated Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 animate-gradient-shift bg-[length:400%_400%]"></div>
          
          {/* Floating Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div 
              className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-6">
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Swords className="text-white text-lg" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Connect</h1>
                </motion.div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
              <motion.div 
                className="max-w-3xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-white" size={40} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    You don't have to white-knuckle every conversation
                  </h1>
                  <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-8">
                    Social anxiety is exhausting. We built something to make it a little easier — one small step at a time.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
                  <p className="text-slate-200 text-lg leading-relaxed mb-4">
                    I used to dread every conversation. The racing thoughts before, the replay loop after. I felt like everyone else just "got it" and I was white-knuckling through every interaction.
                  </p>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Turns out? A lot of people feel exactly this way. And it does get easier — not overnight, but with the right steps and the right people beside you.
                  </p>
                </div>

                <Button
                  onClick={() => setCurrentPage(1)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                >
                  Tell me more
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </motion.div>
            </main>
          </div>
        </div>
      )
    },

    // Page 1: The Problem
    {
      component: () => (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <header className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Swords className="text-white text-lg" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Connect</h1>
                </div>
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-12">
              <motion.div 
                className="max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                  Here's what actually makes anxiety worse...
                </h2>

                <div className="space-y-6 mb-12">
                  <motion.div 
                    className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-slate-200 text-lg leading-relaxed">
                      Most advice tells you to "just put yourself out there." But throwing yourself into overwhelming situations without support doesn't build confidence — it just reinforces the dread.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-slate-200 text-lg leading-relaxed mb-4">
                      Sound familiar?
                    </p>
                    <ul className="space-y-3 text-slate-300 text-lg">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Forcing yourself into situations that left you feeling worse</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Reading tips online that feel fake the moment you try them</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Isolating more because it's just easier than risking it</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-slate-200 text-lg leading-relaxed">
                      What actually works? <span className="text-green-400 font-semibold">Gradual, supported steps — and people beside you who truly understand. Community lowers your threat response. You're not meant to do this alone.</span>
                    </p>
                  </motion.div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setCurrentPage(0)}
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(2)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                  >
                    Okay, I'm listening
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      )
    },

    // Page 2: Name Input
    {
      component: () => (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <header className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Swords className="text-white text-lg" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Connect</h1>
                </div>
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-12">
              <motion.div 
                className="max-w-2xl mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                  Let's make this personal
                </h2>
                <p className="text-slate-300 text-xl text-center mb-12">
                  What should I call you?
                </p>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-lg placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setCurrentPage(1)}
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(3)}
                    disabled={!userName.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg text-lg"
                  >
                    Continue
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      )
    },

    // Pages 3-5: Quiz Questions
    ...quizQuestions.map((q, index) => ({
      component: () => (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <header className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Swords className="text-white text-lg" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Connect</h1>
                </div>
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-12">
              <motion.div 
                className="max-w-3xl mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-12">
                  <div className="flex justify-center space-x-2 mb-8">
                    {quizQuestions.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i <= index ? 'bg-blue-500 w-12' : 'bg-white/20 w-8'
                        }`}
                      />
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {userName}, {q.question}
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Question {index + 1} of {quizQuestions.length}
                  </p>
                </div>

                <div className="grid gap-4 mb-8">
                  {q.options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = quizAnswers[q.id] === option.value;
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, [q.id]: option.value });
                          setTimeout(() => setCurrentPage(currentPage + 1), 300);
                        }}
                        className={`bg-white/5 hover:bg-white/10 backdrop-blur-sm border rounded-2xl p-6 text-left transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-4">
                          {Icon && (
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isSelected 
                                ? 'bg-blue-500' 
                                : 'bg-white/10'
                            }`}>
                              <Icon className="text-white" size={28} />
                            </div>
                          )}
                          {!Icon && (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected 
                                ? 'border-blue-500' 
                                : 'border-white/30'
                            }`}>
                              {isSelected && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                            </div>
                          )}
                          <span className="text-white text-lg">{option.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                  </Button>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      )
    })),

    // Page 6: Processing
    {
      component: () => (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <header className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Swords className="text-white text-lg" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Connect</h1>
                </div>
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-12">
              <motion.div 
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-12">
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Target className="text-white" size={48} />
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Give me a moment, {userName}...
                  </h2>
                  <p className="text-xl text-slate-300">
                    Building something that fits where you're actually starting from
                  </p>
                </div>

                <div className="space-y-4 mb-12">
                  {[
                    "Understanding your anxiety triggers",
                    "Finding your calm entry points",
                    "Mapping your path to connection"
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-slate-300 text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3, duration: 0.5 }}
                    >
                      <CheckCircle className="inline mr-3 text-green-400" size={24} />
                      {text}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                  >
                    Show me
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </motion.div>
              </motion.div>
            </main>
          </div>
        </div>
      )
    },

    // Page 7: Personalized Plan with Features
    {
      component: () => {
        const struggle = quizAnswers.struggle;
        
        let recommendation = {
          title: "Your Calm Starting Point",
          description: "Based on what you shared",
          steps: []
        };

        if (struggle === "starting") {
          recommendation.steps = [
            "Week 1-2: Practice opening lines in low-stakes moments — ordering coffee, thanking someone. Get your nervous system used to initiating safely.",
            "Week 3-4: Extend those moments by one sentence. Keep it light. You're teaching your brain that speaking up is safe.",
            "Week 5+: Carry that safety into conversations with people you actually want in your life."
          ];
        } else if (struggle === "friends") {
          recommendation.steps = [
            "Week 1-2: Find one recurring space with the same people — a class, a club, an online community. Familiarity naturally lowers anxiety.",
            "Week 3-4: Move from co-existing to acknowledging. A nod, a comment. You're warming up the connection.",
            "Week 5+: One low-pressure, easy-to-decline invite. That's how real friendships start."
          ];
        } else if (struggle === "confidence") {
          recommendation.steps = [
            "Week 1-2: Start an evidence log — note every small social moment that went okay. Anxiety exaggerates the bad; this rebalances it.",
            "Week 3-4: One act of self-expression per day. A small opinion. A preference. You existing and having thoughts is enough.",
            "Week 5+: Connect with others in the community who get it. Being witnessed by safe people rebuilds trust in yourself."
          ];
        } else {
          recommendation.steps = [
            "Week 1-2: Identify which connections matter most. Anxiety often makes us go quiet — this is a gentle re-engagement.",
            "Week 3-4: Send one message that isn't a reply. A check-in, a meme, a 'thought of you.' Initiation is a muscle.",
            "Week 5+: Create a small ritual with someone — a regular call, a walking buddy. Consistency feels safe for anxious brains."
          ];
        }

        return (
          <div className="min-h-screen bg-slate-900 overflow-x-hidden">
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
            
            <div className="relative z-10 min-h-screen">
              <header className="p-6">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Swords className="text-white text-lg" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Connect</h1>
                  </div>
                </div>
              </header>

              <main className="px-6 py-12">
                <motion.div 
                  className="max-w-6xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      {userName}, here's how we ease into this
                    </h2>
                    <p className="text-slate-300 text-xl">
                      No deep end. No pressure. Just a realistic, gentle path forward.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                      <Target className="mr-3 text-blue-400" size={32} />
                      {recommendation.title}
                    </h3>
                    
                    <div className="space-y-6">
                      {recommendation.steps.map((step, i) => (
                        <div key={i} className="flex items-start space-x-6">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-400 font-bold text-xl">{i + 1}</span>
                          </div>
                          <p className="text-slate-200 text-lg leading-relaxed pt-2">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 mb-12">
                    <p className="text-slate-200 text-lg leading-relaxed text-center">
                      <span className="text-blue-400 font-semibold">The deal:</span> One small, safe thing each day. No overwhelming yourself, no pressure to perform. And alongside you — a community of people who understand exactly what this feels like.
                    </p>
                  </div>

                  {/* Features Section */}
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                    Here's what's inside
                  </h3>

                  <div className="grid gap-6 mb-12">
                    {detailedFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-200"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                          <div
                            className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center`}
                          >
                            <feature.icon
                              className="text-white"
                              size={32}
                            />
                          </div>

                          <div className="flex-1">
                            <h4 className="text-white font-bold text-xl mb-3">
                              {feature.title}
                            </h4>
                            <p className="text-slate-300 text-base leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      variant="ghost"
                      className="text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" size={20} />
                      Back
                    </Button>
                    <Button
                     onClick={() => {
  setCurrentPage(currentPage + 1);
  handleGeneratePlan();
}}

                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                    >
                      I'm ready — let's go
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </div>
                </motion.div>
              </main>
            </div>
          </div>
        );
      }
    },

    // Page 8: Sign Up
    {
  component: () => (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 animate-gradient-shift bg-[length:400%_400%]"></div>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Swords className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-white">Connect</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div 
            className="max-w-2xl mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {userName}, your calm plan is waiting
              </h2>
              <p className="text-slate-300 text-xl mb-8">
                Create your free account to access it — and meet the people walking the same path
              </p>
            </div>

            {/* This is where the signup form goes */}
            <SignupForm onSignupSuccess={() => {
  console.log("Signup successful!");
  setCurrentPage(currentPage + 1); // Navigate to AI Brain page
}} />

            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back
              </Button>
            </div>
          </motion.div>
        </main>

        <footer className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-white/10 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-slate-400 text-sm">
                  © 2024 Connect. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
},

  // Page 9: AI Brain Component
  {
    component: () => {
      // useEffect moved to top level of SignInView (line ~170)
      
      return (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
          
          <div className="relative z-10 min-h-screen flex flex-col">
            <header className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Swords className="text-white text-lg" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Connect</h1>
                </div>
              </div>
            </header>

            <main className="flex-1 px-6 py-12">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Let's personalize your journey, {userName}
                  </h2>
                  <p className="text-slate-300 text-lg">
                    Share a bit more so we can tailor your experience
                  </p>
                </div>

                <div className="border border-white/20 rounded-2xl overflow-hidden">
                  <AIBRAINPhaseFlow onComplete={() => {
                    console.log("AI Brain flow completed");
                    setCurrentPage(currentPage + 1);
                  }} />
                </div>

                {/* Skip Button */}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => {
                      window.location.href = '/dashboard';
                    }}
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    Skip for now
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }
  },

  // Page 10: Features Summary & Redirect
{
  component: () => {
    // ✅ REMOVED useNavigate from here - using navigate from parent scope
    
    return (
      <React.Fragment>
      <div className="min-h-screen bg-slate-900 overflow-x-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"></div>
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Swords className="text-white text-lg" />
                </div>
                <h1 className="text-2xl font-bold text-white">Connect</h1>
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Star className="text-white" size={40} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  You're all set, {userName}! 🎉
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  Here's what you now have access to:
                </p>
              </div>

              <div className="grid gap-6 mb-12">
                {detailedFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                >
                  Let's begin
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </motion.div>
          </main>
        </div>
      </div>


       {/* App Preview Screen */}
{/* Trial Intro Screen — shows first */}
      {/* App Preview Screen — shows first */}


{/* Trial Intro Screen — shows after, then starts trial */}

      </React.Fragment>
    );
  }
}

  ];

  return (
  <AnimatePresence mode="wait">
    <div key={currentPage}>
      {pages[currentPage]?.component?.() || <div>Loading...</div>}
    </div>

    {/* Page indicator */}
    
  </AnimatePresence>
);
};

export default SignInView;