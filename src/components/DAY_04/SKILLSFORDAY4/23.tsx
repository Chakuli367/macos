import React, { useState } from "react";

// Import each skill page (create placeholder files if not already done)
import Consistency from "./CONSISTENCY/consistency";
import AuthenticEngagement from "./AUTHENTICENGAGEMENT/authenticengagement";
import EmotionalControl from "./EMOTIONALCONTROL/emotionalcontrol";
import  ReconnectionRecovery from "./RECONNECTIONRECOVERY/reconnectionrecovery";
import SustainedConnection from "./SUSTAINEDCONNECTION/sustainedconnection";

const DAY4SkillsRouter: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const skillsPages = [
    Consistency,
    AuthenticEngagement,
    EmotionalControl,
    ReconnectionRecovery,
    SustainedConnection,
  ];

  const [page, setPage] = useState(0);
  const CurrentSkill = skillsPages[page];

 const nextPage = () => {
  setPage((p) => {
    if (p < skillsPages.length - 1) return p + 1;
    if (onComplete && typeof onComplete === "function") onComplete();
    return p;
  });
};

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white transition-all duration-700 overflow-hidden">
      {/* Step Indicator */}
      <div className="absolute top-6 text-sm font-semibold opacity-80">
        Skill {page + 1} / {skillsPages.length}
      </div>

      {/* Current Skill Page */}
      <div className="w-full max-w-3xl p-4 md:p-8 transition-opacity duration-500">
        <CurrentSkill onNext={nextPage} />
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 flex gap-4">
        {page > 0 && (
          <button
            onClick={prevPage}
            className="px-6 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-xl font-semibold transition-all duration-300"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextPage}
          className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-xl font-semibold transition-all duration-300"
        >
          {page === skillsPages.length - 1 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default DAY4SkillsRouter;
