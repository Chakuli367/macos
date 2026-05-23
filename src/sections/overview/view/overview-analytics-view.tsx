import React, { useState, useEffect , useRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db  } from "./firebase";
import DailyPhotoCircle from "src/components/photo"
import { getStoredAuth, isAuthenticated } from '@/utils/auth';
import { useMentorStore } from 'src/store/useMentorStore';
import { testDriver } from 'src/mentor/useDriver';
import { Shield } from 'lucide-react';
import { SupportToolsHub } from 'src/components/Supportgroup';
import MentorChat from '@/components/Mentorchat';
import { auth, signInWithGoogle, logOut  } from '../../../firebase';
import { 
  Sparkles, Zap, Heart, Share2, ChevronLeft, ChevronRight, Users,
  X , HeartIcon
} from 'lucide-react';
import Avatar01 from 'src/AVATORS/01.svg';
import Avatar02 from 'src/AVATORS/02.svg';
import Avatar03 from 'src/AVATORS/03.svg';
import AvatarChooser from './avator';
import LiveCoach from './BUDDYCHAT'
import IRLConnectionsHub from './irlconnections'
import TransformationCard from 'src/components/transform'
import IRLConnectionsValueHero from './HerosectionIRL'
import EnhancedTaskHub from './liveactionsupport'
import HeroSection from './HerosectionLive';
import OnboardingOverlay from "./OnboardingOverlay";
import socialCityMap from 'src/components/actionmap';
import { Capacitor } from '@capacitor/core';
import Communityfeed from "src/sections/product/view/Communityfeed"
import QuickBoard from "@/components/quickboard";
import AnxietyTracker from '@/components/Tracker';
import App from "src/sections/user/view/module1"

const avatars = [Avatar01, Avatar02, Avatar03];

import { DashboardContent } from 'src/layouts/dashboard';
import TodayActionCard from 'src/components/01';
import DuolingoProgressMap from 'src/components/02';
import GoalGridChatbot from 'src/components/03';
import FriendsCommunity from "src/components/04";
import TodayLessonHero from 'src/components/05';
import MiniTaskTracker from 'src/components/tasktrackersmall';
import { runStyledOverviewTour } from './joyride';
import EyeContactTrainer from 'src/components/07';
import Day1Navigator from "src/components/DAY_01/MAINNAVIGATOR";
import DailyHub from 'src/components/09';

const randomIndex = Math.floor(Math.random() * avatars.length);
const selectedAvatar = avatars[randomIndex];


export function OverviewAnalyticsView() {
  const mapRef = useRef<HTMLDivElement>(null); 
  const [highlight, setHighlight] = useState(false);
  const [user, loading, authError] = useAuthState(auth);
  const [testDay, setTestDay] = useState(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showMentorChat, setShowMentorChat] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSupportHub, setShowSupportHub] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const startJourney = useMentorStore((s) => s.startJourney);
  const [showTour, setShowTour] = useState(false);
  const [showAppDownload, setShowAppDownload] = useState(false);

  const [userSignupStatus, setUserSignupStatus] = useState({
    isNewUser: false,
    hasCompletedOnboarding: false,
    hasPlan: false,
    hasCompletedAnyDay: false,
    accountAge: null as number | null,
    totalInteractions: 0,
    isFullySetup: false
  });

  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log("User UID:", currentUser.uid);
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "Navigate to Timeline" && mapRef.current) {
        setShowTip(true);
        mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlight(true);
        setTimeout(() => setHighlight(false), 2000);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const analyzeUserStatus = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const planRef = doc(db, `users/${user.uid}/datedcourses`, 'social_skills');
        const planSnap = await getDoc(planRef);
        const completedDaysRef = collection(db, `users/${user.uid}/completedDays`);
        const completedDaysSnap = await getDocs(completedDaysRef);
        const createdAt = userSnap.exists() 
          ? new Date(userSnap.data().createdAt).getTime()
          : new Date().getTime();
        const accountAgeInDays = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24));
        const signupStatus = {
          isNewUser: !userSnap.exists() || accountAgeInDays < 1,
          hasCompletedOnboarding: userSnap.exists() && userSnap.data().onboardingDone === true,
          hasPlan: planSnap.exists(),
          hasCompletedAnyDay: !completedDaysSnap.empty,
          accountAge: accountAgeInDays,
          totalInteractions: completedDaysSnap.size,
          isFullySetup: userSnap.exists() && 
                        userSnap.data().onboardingDone === true && 
                        planSnap.exists()
        };
        setUserSignupStatus(signupStatus);
        if (userSnap.exists() && !userSnap.data().onboardingDone) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('❌ Error analyzing user status:', error);
      }
    };
    analyzeUserStatus();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const checkDatedCourses = async () => {
      const docRef = doc(db, `users/${user.uid}/datedcourses`, 'life_skills');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setShowOverlay(true);
        setTimeout(() => {
          window.location.href = `/conversation/${user.uid}`;
        }, 3000);
      }
    };
    checkDatedCourses();
  }, [user]);

  useEffect(() => {
    const seen = localStorage.getItem("supportHubTourSeen");
    if (!seen) {
      setShowTour(true);
    }
  }, []);

  const closeTour = () => {
    localStorage.setItem("supportHubTourSeen", "true");
    setShowTour(false);
  };

  const handleFinish = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { onboardingDone: true }, { merge: true });
    }
    setShowOnboarding(false);
  };

  const handleStartLesson = (lesson) => {
    const dayNumber = lesson.dayNumber || lesson.day || (lesson.index + 1) || 1;
    const lessonIndex = parseInt(dayNumber) - 1;
    const dataToStore = {
      lessonIndex: lessonIndex,
      dayNumber: dayNumber,
      timestamp: Date.now()
    };
    sessionStorage.setItem('autoOpenLesson', JSON.stringify(dataToStore));
    setTimeout(() => {
      window.location.href = `/user`;
    }, 3000);
  };

  if (isHubOpen) {
    return (
      <div className="fixed inset-0 z-[1000] overflow-y-auto bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
        <IRLConnectionsHub onClose={() => setIsHubOpen(false)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 to-indigo-950 text-white text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 px-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 text-center shadow-xl animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-white mb-4">Welcome to GoalGrid</h1>
          <p className="text-purple-200 mb-8 text-lg">
            Sign in to start your journey toward better connections and personal growth.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:scale-105 hover:shadow-pink-400/50 transition-transform duration-300"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="w-full px-6 py-3 bg-white/20 text-white font-semibold rounded-full shadow-inner hover:bg-white/30 transition-colors duration-300"
          >
            First Time User? Sign Up
          </button>
          <p className="mt-6 text-purple-300 text-sm">
            I promise to never sell your data. Hope this helps you as much as it helped me!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
      `}</style>

      {/* ── No Plan Found Overlay ── */}
      {showOverlay && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 text-white p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">No Plan Found</h1>
          <p className="text-lg mb-6">Go create your plan to get started!</p>
          <button
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            onClick={() => window.location.href = `/conversation/${user.uid}`}
          >
            Create Your Plan
          </button>
        </div>
      )}

      {/* ── Onboarding Overlay ── */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl overflow-y-auto bg-gradient-to-br from-purple-900 to-indigo-900 text-white shadow-2xl p-6 sm:p-8">
            <OnboardingOverlay onFinish={handleFinish} />
          </div>
        </div>
      )}

      {/* ── App Download Overlay ── */}

      {/* ── Main Dashboard ── */}
      <DashboardContent maxWidth={false}>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

            {/* ── Header ── */}
            <div className="mb-4 pt-2">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-4 w-full">

                  {/* Avatar + Greeting */}
                  <div className="flex items-center gap-6 min-w-0">
                    <img
                      src={selectedAvatar}
                      alt="Avatar"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-white/20 shadow-lg backdrop-blur-sm flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
                        Welcome back, {user?.displayName || 'User'}!
                      </h1>
                      <p className="text-white/80 mt-2 text-base sm:text-lg">
                        Let's continue your journey
                      </p>
                    </div>
                  </div>

                  {/* SOS Card */}
                  <button
                    onClick={() => setShowSupportHub(true)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-purple-900/50 border border-purple-500/40 hover:bg-purple-800/60 hover:border-purple-400/60 transition-all duration-200 text-left group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-b from-purple-500 to-purple-700 border-b-4 border-purple-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Shield className="w-6 h-6 text-white stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">Feeling overwhelmed or unsafe?</p>
                      <p className="text-purple-300 text-xs mt-0.5">Tap to open your Support Hub — help is always here</p>
                    </div>
                    <div className="flex-shrink-0 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-xs font-black tracking-wide shadow">
                      SOS
                    </div>
                  </button>

                </div>
              </div>

              {/* ── Main Content Grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column */}
                <div className="lg:col-span-2">

  <DailyHub />


  <TransformationCard />

  {/* Mentor Card */}
  

  {/* Today's Lesson */}
  <div className="mt-8 tour-today-action-card" id="resume-lesson">
    <TodayLessonHero
      onStartLesson={handleStartLesson}
      activeDay={testDay}
    />
  </div>

  {/* Daily Tasks */}
  <div className="mt-8 tour-today-action-card" id="daily-tasks">
    <TodayActionCard />
  </div>

</div>


                {/* Right Column */}
                <div className="space-y-8">

                  <div className="relative mx-0 rounded-3xl overflow-hidden border border-purple-500/30">
    <div className="relative h-48 overflow-hidden flex items-end justify-center">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-purple-500/30 rounded-full blur-2xl" />

      <img
        src="/PHOTOS/mentor.svg"
        alt=""
        className="relative z-10 h-52 w-52 object-contain object-bottom scale-125 translate-y-4"
      />
    </div>

    <div className="px-6 pb-8 pt-4 flex flex-col items-center gap-4 text-center">
      <p className="text-purple-200 text-sm font-medium">
        Feeling stuck or overwhelmed?
      </p>

      <button
        onClick={() => setShowMentorChat(true)}
        className="
          w-full relative px-10 py-4
          bg-purple-600 hover:bg-purple-500
          text-white font-extrabold text-lg
          rounded-2xl
          transition-all duration-100
          border-b-[6px] border-purple-800
          shadow-[0_20px_40px_-10px_rgba(147,51,234,0.5)]
          hover:-translate-y-1 hover:border-b-[8px]
          active:translate-y-[4px] active:border-b-[2px]
          before:absolute before:inset-0 before:rounded-2xl
          before:bg-white/10 before:opacity-0
          hover:before:opacity-100
        "
      >
        Talk to Someone who gets it!
      </button>
    </div>
  </div>

                  {/* Progress Map */}
                  <div className="tour-duolingo-progress-map" ref={mapRef}>
                    <div className="sticky top-6">
                      {showTip && (
                        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl shadow-2xl p-8 max-w-lg mx-4 text-center border border-purple-500/40 animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-4">Your 5-Day Plan</h2>
                            <p className="text-base mb-4">
                              This section helps you preview your next 5 days – each day's focus,
                              lessons, and challenges appear here.
                            </p>
                            <p className="text-base mb-8">
                              Explore it at your own pace. You can always come back here to track
                              progress or restart your plan.
                            </p>
                            <button
                              onClick={() => {
                                setShowTip(false);
                                todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }}
                              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-white transition-all"
                            >
                              Got it, what's next?
                            </button>
                          </div>
                        </div>
                      )}

                      <div
                        id="progress"
                        className={`transition-all duration-700 rounded-2xl overflow-hidden ${
                          highlight
                            ? "ring-4 ring-purple-500/70 shadow-[0_0_40px_rgba(168,85,247,0.6)] scale-[1.02]"
                            : ""
                        }`}
                      >
                        <DuolingoProgressMap />
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </DashboardContent>
    </>
  );
};