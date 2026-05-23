import { useState } from "react";
import { Brain, Sparkles, Target, Zap, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";

import AIBRAINPhaseFlow from "src/components/AIBRAIN";

import { getApiKeys } from 'src/backend/apikeys';

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const firebaseApp = app;

interface ConversationFlowProps {
  answers: Record<string, string>;
  onComplete?: () => void;
}

const GENERATION_STEPS = [
  { icon: "🔍", text: "Analyzing your goal..." },
  { icon: "📊", text: "Finding similar success patterns..." },
  { icon: "✍️", text: "Creating Day 1: Foundation..." },
  { icon: "✍️", text: "Creating Day 2: Momentum..." },
  { icon: "✍️", text: "Creating Day 3: Breakthrough..." },
  { icon: "✍️", text: "Creating Day 4: Refinement..." },
  { icon: "✍️", text: "Creating Day 5: Commitment..." },
  { icon: "✅", text: "Finalizing your plan..." },
];

const MOCK_PLAN = {
  overview: {
    days: [
      { day: 1, title: "Understand Fundamentals", task: "Read and summarize 3 key articles on your goal topic." },
      { day: 2, title: "Active Practice", task: "Engage in a 15-minute focused practice session." },
      { day: 3, title: "Real-World Application", task: "Apply what you learned in a real situation." },
      { day: 4, title: "Reflection & Adjustment", task: "Review your progress and adjust your approach." },
      { day: 5, title: "Build Consistency", task: "Create a sustainable routine for long-term success." },
    ]
  },
  success: true,
};

export default function ConversationFlow({ answers, onComplete }: ConversationFlowProps) {
  const [showTrailer, setShowTrailer] = useState(true);
  const [showAIBrain, setShowAIBrain] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid || "user_trial";

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

  const handleGenerateBasicPlan = async () => {
    console.log("🚀 Starting basic 5-day plan generation...");
    setIsGeneratingPlan(true);
    setCurrentStep(0);
    setShowSkipWarning(false);

    const goalName = answers["q1"] || Object.values(answers)[0]?.toString().trim() || "personal growth";
    const userAnswers = Object.values(answers);
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
      const apiKeys = await getApiKeys();
      
      if (apiKeys.length === 0) {
        console.warn("⚠️ No API keys available. Using mock plan.");
        data = MOCK_PLAN;
        success = true;
        useMockPlan = true;
      } else {
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

        if (!success) {
          console.warn("⚠️ All API keys failed. Falling back to mock plan.");
          data = MOCK_PLAN;
          success = true;
          useMockPlan = true;
        }
      }

      const overviewToSave = data.overview;

      // Save to Firebase
      const courseId = goalName.toLowerCase().replace(/\s+/g, '_').substring(0, 30);
      const userPlanRef = doc(firestore, "users", userId, "datedcourses", courseId);

      await setDoc(userPlanRef, {
        task_overview: overviewToSave,
        goal_name: goalName,
        user_id: userId,
        course_id: courseId,
        generated_at: serverTimestamp(),
        created_at: serverTimestamp(),
        is_mock_plan: useMockPlan,
        creation_method: "skip_ai_brain",
      });

      console.log(`✅ 5-day task overview saved to Firebase (Mock: ${useMockPlan})`);

      setCurrentStep(GENERATION_STEPS.length);
      await markPlanAsCreated();

      // Small delay to show completion
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err: any) {
      console.error("🔥 handleGenerateBasicPlan error:", err);
      alert(`⚠️ Plan generation failed: ${err.message}`);
    } finally {
      clearInterval(progressInterval);
      setIsGeneratingPlan(false);
    }
  };

  const handleAIBrainComplete = async () => {
    console.log("✅ AI Brain plan completed");
    
    await markPlanAsCreated();
    
    // Navigate to dashboard
    if (onComplete) {
      onComplete();
    } else {
      navigate("/dashboard");
    }
  };

  const handleStartSetup = () => {
    setShowTrailer(false);
    setShowAIBrain(true);
  };

  const handleSkipClick = () => {
    setShowSkipWarning(true);
  };

  const handleConfirmSkip = () => {
    handleGenerateBasicPlan();
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Trailer Screen */}
      {showTrailer && (
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="max-w-4xl w-full animate-fade-in">
            
            {/* Main Card */}
            <div className="bg-gradient-to-br from-purple-900/60 to-purple-800/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8 md:p-12">
              
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl mb-6 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to Set Your Goals?
                </h1>
                
                <p className="text-xl text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
                  Our AI will guide you through creating a personalized 5-day plan to achieve what matters most to you
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personalized Goals</h3>
                  <p className="text-purple-200/70 text-sm">
                    AI analyzes your situation and creates goals tailored specifically to you
                  </p>
                </div>

                <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">5-Day Action Plan</h3>
                  <p className="text-purple-200/70 text-sm">
                    Get a structured plan with daily tasks designed to build momentum
                  </p>
                </div>

                <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quick Setup</h3>
                  <p className="text-purple-200/70 text-sm">
                    Takes just 2-3 minutes to set up your complete personalized plan
                  </p>
                </div>
              </div>

              {/* What You'll Get */}
              <div className="bg-purple-950/40 rounded-2xl p-6 mb-8 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">What you'll get:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-purple-200/90">
                    <div className="w-6 h-6 bg-purple-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-300">✓</span>
                    </div>
                    <span>AI-generated daily tasks based on your specific goals and situation</span>
                  </li>
                  <li className="flex items-start gap-3 text-purple-200/90">
                    <div className="w-6 h-6 bg-purple-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-300">✓</span>
                    </div>
                    <span>Progress tracking to keep you motivated and on track</span>
                  </li>
                  <li className="flex items-start gap-3 text-purple-200/90">
                    <div className="w-6 h-6 bg-purple-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-300">✓</span>
                    </div>
                    <span>Flexible plan that adapts to your pace and feedback</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleStartSetup}
                className="w-full relative group overflow-hidden px-8 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-purple-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Brain className="w-6 h-6" />
                  Let's Set Up Your Goals
                  <Sparkles className="w-5 h-5" />
                </span>
              </button>

              {/* Footer Note */}
              <p className="text-center text-purple-300/60 text-sm mt-6">
                No commitment required • Customize anytime • Takes 2-3 minutes
              </p>

              {/* Skip Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleSkipClick}
                  className="text-purple-400/70 hover:text-purple-300 text-sm font-medium transition-colors underline decoration-dotted"
                >
                  Skip for now
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      {/* AI Brain Setup Modal */}
      {showAIBrain && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[95vh] bg-gradient-to-br from-purple-950/98 to-pink-950/98 rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
            
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-md border-b border-white/20 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Brain Setup</h2>
                    <p className="text-sm text-gray-300">Answer a few questions to create your personalized plan</p>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-full border border-purple-500/30">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span className="text-sm text-purple-200">Creating your plan...</span>
                </div>
              </div>
            </div>

            {/* AI Brain Component - Full Height */}
            <div className="h-full pt-24 pb-6 px-6 overflow-auto">
              <AIBRAINPhaseFlow onComplete={handleAIBrainComplete} />
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}