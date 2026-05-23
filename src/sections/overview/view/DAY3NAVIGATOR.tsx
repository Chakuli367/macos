import React, { useState } from "react";
import { default as WELCOME } from "./11"; // Welcome & Objective
import { default as REVIEWCONV } from "./12"; // Review All Conversations
import { default as REFLECTSKILLS } from "./13"; // Reflection on Micro-Skills
import { default as PATTERNSMISTAKES } from "./14"; // Identify Patterns & Mistakes
import { default as PLANLOCATIONS } from "./15"; // Plan Your Locations
import { default as MICROGOALS } from "./16"; // Set Micro-Goals
import { default as ANXIETYREDUCTION } from "./17"; // Anxiety Reduction & Skill Rehearsal
import { default as COMMIT } from "./18"; // Reflection & Commitment

const pages = [
  { component: WELCOME, title: "Welcome & Objective" },
  { component: REVIEWCONV, title: "Review Conversations" },
  { component: REFLECTSKILLS, title: "Reflect Micro-Skills" },
  { component: PATTERNSMISTAKES, title: "Identify Patterns & Mistakes" },
  { component: PLANLOCATIONS, title: "Plan Locations" },
  { component: MICROGOALS, title: "Set Micro-Goals" },
  { component: ANXIETYREDUCTION, title: "Prepare Mentally & Physically" },
  { component: COMMIT, title: "Reflection & Commitment" },
];

export const Day3Container: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentPage = pages[currentIndex].component;

  const nextPage = () => {
    if (currentIndex < pages.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const prevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="day3-container">
      <div className="progress">
        Day 3: {currentIndex + 1} / {pages.length} - {pages[currentIndex].title}
      </div>
      <CurrentPage onNext={nextPage} />
      {currentIndex > 0 && <button onClick={prevPage}>Back</button>}
    </div>
  );
};
