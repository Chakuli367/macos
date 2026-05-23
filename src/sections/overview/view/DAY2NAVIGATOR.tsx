import React, { useState } from "react";
import { default as MORNINGPREP } from "src/components/DAY_02/MORNINGPREP/01"; // Morning Prep
import { default as REVIEWSKILLS } from "src/components/DAY_02/REVIEWSKILLS/02"; // Review Skills
import { default as MAPTODAYSPLAN } from "src/components/DAY_02/MAPTODAYSPLAN/03"; // Map Today's Plan
import { default as CONVOPREP } from "src/components/DAY_02/CONVOPREP/04"; // Conversation Prep
import { default as PHYSICALENVPREP } from "src/components/DAY_02/PHYSICALENVPREP/05"; // Physical Environment Prep
import { default as TRACKINGINTERACTIONS } from "src/components/DAY_02/TRACKINGINTERACTIONS/06"; // Tracking Interactions
import { default as END } from "src/components/DAY_02/END/07"; // End of Day Wrap-Up


const pages = [
  { component: MORNINGPREP, title: "Morning Prep" },
  { component: REVIEWSKILLS, title: "Review Skills" },
  { component: CONVOPREP, title: "Conversation Prep" },
  { component: MAPTODAYSPLAN, title: "Map Today's Plan" },
  { component: PHYSICALENVPREP, title: "Physical & Env Prep" },
  { component: TRACKINGINTERACTIONS, title: "Tracking Interactions" },
  { component: END, title: "End of Day Reflection" },
];

export const Day2Container: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentPage = pages[currentIndex].component;

  const nextPage = () => {
    if (currentIndex < pages.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const prevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="day2-container">
      <div className="progress">
        Day 2: {currentIndex + 1} / {pages.length} - {pages[currentIndex].title}
      </div>
      <CurrentPage onNext={nextPage} />
      {currentIndex > 0 && <button onClick={prevPage}>Back</button>}
    </div>
  );
};
