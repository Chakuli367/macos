import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Users, BookOpen, ArrowRight } from "lucide-react";
import GoalPlannerMain from "@/components/whtsurgoal/GoalPlannerMain";
import Onboardingquiz from "./Onboardingquiz";
import { useOnboarding } from "src/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { auth } from "src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import AvatarChooser from "./avator";



export default function CreateGoalView() {
  const [showGoalPlanner, setShowGoalPlanner] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAvatarChooser, setShowAvatarChooser] = useState(false);

  const [checkingStatus, setCheckingStatus] = useState(true);
  const { markGoalComplete, onboardingStatus } = useOnboarding();
  const navigate = useNavigate();

  const handleConfirm = async () => {
  if (!selectedAvatar) return;

  try {
    localStorage.setItem('selectedAvatar', JSON.stringify(selectedAvatar));
    console.log('Selected avatar saved:', selectedAvatar);
  } catch (e) {
    console.error('Failed to save avatar:', e);
  }

  setShowModal(false);

  if (typeof onComplete === 'function') {
    setTimeout(() => {
      onComplete();
    }, 50);
  }
};


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User authenticated:', user.email, 'UID:', user.uid);
        setCurrentUser(user);
      } else {
        console.log('❌ No user authenticated');
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (onboardingStatus?.goalCreated) {
        console.log('🚫 Goal already completed, redirecting to dashboard');
        navigate('/', { replace: true });
      } else {
        setCheckingStatus(false);
      }
    }
  }, [authLoading, onboardingStatus, navigate]);

  useEffect(() => {
  if (!authLoading && !checkingStatus && currentUser) {
    // Auto-show avatar chooser for logged-in users
    setShowAvatarChooser(true);
  }
}, [authLoading, checkingStatus, currentUser]);


  // MINIMAL VISUAL LANDING PAGE
  // Auto-redirect to avatar chooser
useEffect(() => {
  if (!authLoading && !checkingStatus) {
    if (currentUser) {
      setShowAvatarChooser(true);
    } else {
      navigate("/sign-in");
    }
  }
}, [authLoading, checkingStatus, currentUser, navigate]);


const handleStartJourney = () => {
  if (!currentUser) {
    navigate("/sign-in");
    return;
  }
  setShowAvatarChooser(true);
};


  const handleAvatarSelected = () => {
  console.log("🎨 Avatar selected, moving to quiz...");
  setShowAvatarChooser(false);
  setShowQuiz(true);
};


    const handleQuizComplete = async () => {
  try {
    const userId = currentUser!.uid;
    console.log(`📝 Marking goal complete for user: ${userId}`);

    await markGoalComplete();
    console.log("✅ Onboarding quiz completed");

    await new Promise(resolve => setTimeout(resolve, 500));
    navigate(`/conversation/${userId}`, { replace: true });
  } catch (error) {
    console.error("Error completing quiz:", error);
    if (currentUser?.uid) navigate(`/conversation/${currentUser.uid}`, { replace: true });
  }
};


  const handleGoalPlannerClose = () => {
    setShowGoalPlanner(false);
    if (currentUser && currentUser.uid) {
      console.log(`🚀 Redirecting to /conversation/${currentUser.uid}`);
      navigate(`/conversation/${currentUser.uid}`, { replace: true });
    } else {
      console.error("❌ No authenticated user found, redirecting to sign-in");
      navigate('/sign-in');
    }
  };

   if (authLoading || checkingStatus) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking status...</p>
        </div>
      </div>
    );
  }

  if (showAvatarChooser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <AvatarChooser onComplete={handleAvatarSelected} />
      </div>
    );
  }

  if (showQuiz) {
    return (
      <Onboardingquiz 
        onComplete={handleQuizComplete} 
        className="font-poppins rounded-lg"
      />
    );
  }

  if (showGoalPlanner) {
    return <GoalPlannerMain onClose={handleGoalPlannerClose} />;
  }


return (
  <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);
}