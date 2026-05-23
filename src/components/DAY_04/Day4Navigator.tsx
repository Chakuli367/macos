import React, { useState } from "react";
import ReviewConvos from "./REVIEWCONVOS/19";
import IntroToDay4 from "./INTROTODAY4/21";
import ConvoFramework from "./CONVOFRAMEWORK/22";
import SkillsForDay4 from "./SKILLSFORDAY4/23";
import Day4ActionPlan from "./DAY4ACTIONPLAN/24";
import EveningReflection from "./EVENINGREFLECTION/25";
import SETYOURTIMES from "./SETYOURTIMES/02";
import AuthenticEngagement from "./AUTHENTICENGAGEMENT/authenticengagement";
import EmotionalControl from "./EMOTIONALCONTROL/emotionalcontrol";
import Consistency from "./CONSISTENCY/consistency";
import ReconnectionRecovery from "./RECONNECTIONRECOVERY/reconnectionrecovery";
import SustainedConnection from "./SUSTAINEDCONNECTION/sustainedconnection";

interface Day4ContainerProps {
  onCompleteNavigator?: () => void;
}

const pages = [
  { component: IntroToDay4, title: "Day 4 Introduction" },
  { component: ReviewConvos, title: "Review Previous Conversations" },
  { component: ConvoFramework, title: "Conversation Framework" },
  { component: AuthenticEngagement, title: "Authentic Engagement" },
  { component: EmotionalControl, title: "Emotional Control" },
  { component: Consistency, title: "Consistency" },
  { component: ReconnectionRecovery, title: "Reconnection Recovery" },
  { component: SustainedConnection, title: "Sustaining Connection" },
  { component: SETYOURTIMES, title: "Set Your Times" },
  { component: Day4ActionPlan, title: "Action Plan" },
  { component: EveningReflection, title: "Evening Reflection & Commit" },
];

export default function Day4Container({ onCompleteNavigator }: Day4ContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentPage = pages[currentIndex].component;

  const nextPage = () => {
    setCurrentIndex((prev) => {
      if (prev < pages.length - 1) {
        return prev + 1;
      }
      if (onCompleteNavigator) onCompleteNavigator();
      return prev;
    });
  };

  const prevPage = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        overflow: "hidden",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          backgroundColor: "transparent",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <CurrentPage onNext={nextPage} onComplete={nextPage} />
      </div>

      {currentIndex > 0 && (
        <button
          onClick={prevPage}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            padding: "6px 12px",
            fontSize: "12px",
            borderRadius: "8px",
            background: "rgba(128, 90, 213, 0.7)",
            color: "white",
            zIndex: 1000001,
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
      )}

      <button
        onClick={nextPage}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "6px 12px",
          fontSize: "12px",
          borderRadius: "8px",
          background: "linear-gradient(to right, #14b8a6, #06b6d4)",
          color: "white",
          zIndex: 1000001,
        }}
      >
        {currentIndex === pages.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
