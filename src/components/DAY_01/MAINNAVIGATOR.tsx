import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

import FindAPlace01 from "src/components/DAY_01/FINDAPLACE/01";
import SetYourTimes02 from "src/components/DAY_01/SETYOURTIMES/02";
import HelpWithAnxiety03 from "src/components/DAY_01/HELPWITHTHEIRANXIETY/03";
import YouAreNotAlone from "src/components/DAY_01/YOUARENOTALONE/youarenotalone";
import SocialReflectionPage from "src/components/DAY_01/ANALYZEPASTDAYS/analysetasksupdate";
import AIChatInterface from "src/components/AIBRAIN";
import PersonalizedLearning from "./DAY1LEARNOR";

// Skills
import OpenBodyLanguage from "src/components/DAY_01/SKELETAL COMPONENTS/01";
import SmileWarmUp from "src/components/DAY_01/SKELETAL COMPONENTS/02";
import VoiceToneControl from "src/components/DAY_01/SKELETAL COMPONENTS/03";
import ApproachOpener from "src/components/DAY_01/SKELETAL COMPONENTS/04";
import ActiveListening from "src/components/DAY_01/SKELETAL COMPONENTS/05";
import GenuineAppreciation from "src/components/DAY_01/SKELETAL COMPONENTS/06";
import HandleSilence from "src/components/DAY_01/SKELETAL COMPONENTS/07";

// === Fullscreen wrapper
const FullScreenWrapper = ({ children }) => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      background: "black",
      color: "white",
      overflowY: "auto",
      overflowX: "hidden",
    }}
  >
    {children}
  </div>
);

const Day1Navigator = forwardRef(({ onCompleteNavigator }, ref) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const scrollContainerRef = useRef(null);
  const hasLoadedInitialProgress = useRef(false);

  // ===== Load saved progress =====
  useEffect(() => {
    const loadProgress = async () => {
      if (!auth.currentUser) {
        setIsLoadingProgress(false);
        hasLoadedInitialProgress.current = true;
        return;
      }
      const uid = auth.currentUser.uid;
      try {
        const refDoc = doc(db, "users", uid, "progress", "day1_navigator");
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const idx = snap.data().pageIndex || 0;
          setPageIndex(idx);
        }
      } catch (e) {
        console.error("Error loading progress:", e);
      } finally {
        setIsLoadingProgress(false);
        hasLoadedInitialProgress.current = true;
      }
    };
    loadProgress();
  }, []);

  // ===== Save progress =====
  useEffect(() => {
    const saveProgress = async () => {
      if (!auth.currentUser || !hasLoadedInitialProgress.current) return;
      const uid = auth.currentUser.uid;
      try {
        const refDoc = doc(db, "users", uid, "progress", "day1_navigator");
        await setDoc(
          refDoc,
          {
            pageIndex,
            lastUpdated: new Date().toISOString(),
            course: "social_skills",
            day: 1,
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Error saving progress:", e);
      }
    };
    saveProgress();
  }, [pageIndex]);

  // ===== Full screen hijack =====
  useEffect(() => {
    const original = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      appDisplay: "",
    };
    const appRoot = document.getElementById("root");
    if (appRoot) {
      original.appDisplay = appRoot.style.display;
      appRoot.style.display = "none";
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      if (appRoot) appRoot.style.display = original.appDisplay || "";
      document.body.style.overflow = original.bodyOverflow;
      document.documentElement.style.overflow = original.htmlOverflow;
    };
  }, []);

  // ===== NEXT PAGE FUNCTION (auto scroll to top) =====
  const nextPage = () => {
    setPageIndex((p) => Math.min(p + 1, pages.length - 1));
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleComplete = () => onCompleteNavigator?.();
  const handleQuit = () => {
    if (window.confirm("Your progress is saved. Exit?")) onCompleteNavigator?.();
  };

  const pages = [
    <FullScreenWrapper key="aibrain"><AIChatInterface onComplete={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="youarenotalone"><YouAreNotAlone onComplete={nextPage} /></FullScreenWrapper>,
    //<FullScreenWrapper key="times"><SetYourTimes02 onComplete={nextPage} /></FullScreenWrapper>,
    //<FullScreenWrapper key="anxiety"><HelpWithAnxiety03 onComplete={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="body"><OpenBodyLanguage onNext={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="smile"><SmileWarmUp onNext={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="voice"><VoiceToneControl onNext={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="approach"><ApproachOpener onNext={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="listen"><ActiveListening onNext={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="appreciation"><GenuineAppreciation onNext={nextPage} /></FullScreenWrapper>,
    <FullScreenWrapper key="silence"><HandleSilence onNext={handleComplete} /></FullScreenWrapper>,
  ];

  const pageNames = [
    "AI Brain",
    "You Are Not Alone",
    "Set Your Times",
    "Help With Anxiety",
    "Open Body Language",
    "Smile Warm-Up",
    "Voice Tone Control",
    "Approach Opener",
    "Active Listening",
    "Genuine Appreciation",
    "Handling Silence",
  ];

  useImperativeHandle(ref, () => ({
    nextPage,
    isLastPage: pageIndex === pages.length - 1,
  }));

  if (isLoadingProgress) {
    return ReactDOM.createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(135deg,#1e1b4b,#312e81)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999999,
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid rgba(168,85,247,0.3)",
            borderTop: "4px solid #a855f7",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "white", marginTop: "20px", fontWeight: "600" }}>
          Loading your progress...
        </p>
        <style>{`
          @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
        `}</style>
      </div>,
      document.body
    );
  }

  const overlay = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        zIndex: 9999999,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 10000000,
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setPageIndex((i) => Math.max(i - 1, 0))}
            disabled={pageIndex === 0}
            style={{
              padding: "6px 12px",
              background: pageIndex === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.08)",
              color: pageIndex === 0 ? "rgba(255,255,255,0.3)" : "white",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: "12px",
              fontWeight: "500",
              cursor: pageIndex === 0 ? "default" : "pointer",
            }}
          >
            ← Prev
          </button>

          <button
            onClick={nextPage}
            disabled={pageIndex === pages.length - 1}
            style={{
              padding: "6px 12px",
              background:
                pageIndex === pages.length - 1
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.08)",
              color: pageIndex === pages.length - 1 ? "rgba(255,255,255,0.3)" : "white",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: "12px",
              fontWeight: "500",
              cursor: pageIndex === pages.length - 1 ? "default" : "pointer",
            }}
          >
            Next →
          </button>

          <button
            onClick={handleQuit}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            ✕ Quit
          </button>
        </div>
      </div>

      {/* Fullscreen page content */}
      <div
        ref={scrollContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {pages[pageIndex]}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "rgba(75,85,99,0.5)",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#a855f7,#ec4899)",
            width: `${((pageIndex + 1) / pages.length) * 100}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Page name */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "12px",
          border: "1px solid rgba(168,85,247,0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        {pageNames[pageIndex]}
      </div>
    </div>
  );

  const portalTarget = document.getElementById("navigator-root") || document.body;
  return ReactDOM.createPortal(overlay, portalTarget);
});

export default Day1Navigator;
