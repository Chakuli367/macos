import React, { useState } from "react";
import ReviewConvos from "src/components/DAY_04/REVIEWCONVOS/19";
import EmotionalDebrief from "src/components/DAY_04/EMOTIONALDEBREIF/20";
import IntroToDay4 from "src/components/DAY_04/INTROTODAY4/21";
import ConvoFramework from "src/components/DAY_04/CONVOFRAMEWORK/22";
import SkillsForDay4 from "src/components/DAY_04/SKILLSFORDAY4/23";
import Day4ActionPlan from "src/components/DAY_04/DAY4ACTIONPLAN/24";
import EveningReflection from "src/components/DAY_04/EVENINGREFLECTION/25";


const pages = [
  <ReviewConvos key="review" />,
  <EmotionalDebrief key="emotional" />,
  <IntroToDay4 key="intro" />,
  <ConvoFramework key="framework" />,
  <SkillsForDay4 key="skills" />,
  <Day4ActionPlan key="plan" />,
  <EveningReflection key="evening" />,
];

const DAY4NAV: React.FC = () => {
  const [page, setPage] = useState(0);

  const nextPage = () => setPage((p) => Math.min(p + 1, pages.length - 1));
  const prevPage = () => setPage((p) => Math.max(p - 1, 0));

  return (
    <div className="day-navigator">
      <div className="page-container">{pages[page]}</div>

      <div className="nav-controls">
        <button onClick={prevPage} disabled={page === 0}>
          ← Back
        </button>
        <span>Page {page + 1} / {pages.length}</span>
        <button onClick={nextPage} disabled={page === pages.length - 1}>
          Next →
        </button>
      </div>

      <div className="progress-bar" style={{ height: "6px", background: "#eee", marginTop: "12px", borderRadius: "3px" }}>
        <div
          style={{
            height: "100%",
            width: `${((page + 1) / pages.length) * 100}%`,
            background: "linear-gradient(90deg, #4F46E5, #06B6D4)",
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export default DAY4NAV;
