import React, { useState } from "react";
import WELCOME from "src/components/DAY_03/WELCOMEOBJ/11";
import REVIEWCONV from "src/components/DAY_03/REVIEWCONVOS/12";
import REFLECTSKILLS from "src/components/DAY_03/REFLECTONSKILLS/13";
import PATTERNSMISTAKES from "src/components/DAY_03/IDENITIFYPATTERNS/14";
import PLANLOCATIONS from "src/components/DAY_03/PLANLOCATIONS/15";
import CONVFRAME from "src/components/DAY_03/CONVFRAMEWORK/19";
import MICROGOALS from "src/components/DAY_03/MICROGOALS/16";
import ANXIETYREDUCTION from "src/components/DAY_03/ANXIETYREDUCTION/17";
import MENTALPREP from "./MENTALPREP/17";
import COMMIT from "src/components/DAY_03/COMMITMENT/18";
import SETYOURTIMES from "./SETYOURTIMES/02";

interface Day3ContainerProps {
  onCompleteNavigator?: () => void;
}

const pages = [
  { component: WELCOME, title: "Welcome" },
  { component: CONVFRAME, title: "Conversation Framework" },
  { component: REFLECTSKILLS, title: "Reflect Micro-Skills" },
  { component: SETYOURTIMES, title: "Set Your Times" },
  { component: ANXIETYREDUCTION, title: "Anxiety Reduction" },
  { component: COMMIT, title: "Commitment" },
];

export default function Day3Container({ onCompleteNavigator }: Day3ContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentPage = pages[currentIndex].component;

  const nextPage = () => {
    setCurrentIndex((prev) => {
      if (prev < pages.length - 1) return prev + 1;
      if (onCompleteNavigator) onCompleteNavigator();
      return prev;
    });
  };

  const prevPage = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleLastPageCompletion = () => {
    if (onCompleteNavigator) onCompleteNavigator();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        zIndex: 999999,
      }}
    >
      {/* NAVIGATION BAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 1000002,
        }}
      >
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              color: idx === currentIndex ? "yellow" : "white",
              textDecoration: idx === currentIndex ? "underline" : "none",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              fontWeight: idx === currentIndex ? "bold" : "normal",
            }}
          >
            {page.title}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
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
        <CurrentPage
          onNext={nextPage}
          onCompleteNavigator={currentIndex === pages.length - 1 ? handleLastPageCompletion : undefined}
        />
      </div>

      {/* NEXT / PREVIOUS BUTTONS */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          zIndex: 1000001,
        }}
      >
        <button
          onClick={prevPage}
          disabled={currentIndex === 0}
          style={{
            padding: "12px 24px",
            opacity: currentIndex === 0 ? 0.5 : 1,
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        <button
          onClick={nextPage}
          style={{ padding: "12px 24px" }}
        >
          {currentIndex === pages.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
