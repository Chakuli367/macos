import React, { useState } from "react";
import SETYOURTIMES from "./SETYOURTIMES/02";
import REVIEWSKILLS from "src/components/DAY_02/REVIEWSKILLS/02";
import PATTERNSMISTAKES from "./IDENTIFYPATTERMS/14";
import SustainedConnection from "./SUSTAINEDCONNECTION/sustainedconnection";
import MAPTODAYSPLAN from "src/components/DAY_02/MAPTODAYSPLAN/03";
import TrackingInteractions from "src/components/DAY_02/TRACKINGINTERACTIONS/06";

interface Day2ContainerProps {
  onComplete?: () => void;
  onCompleteNavigator?: () => void;
}

const pages = [
  { component: SETYOURTIMES },
  { component: REVIEWSKILLS },
  { component: PATTERNSMISTAKES },
  { component: SustainedConnection },
  { component: MAPTODAYSPLAN },
  { component: TrackingInteractions },
];

export default function Day2Container({ onComplete, onCompleteNavigator }: Day2ContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentPage = pages[currentIndex].component;

  const nextPage = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (onComplete) onComplete();
      if (onCompleteNavigator) onCompleteNavigator();
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

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
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <CurrentPage onNext={nextPage} />
      </div>

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
