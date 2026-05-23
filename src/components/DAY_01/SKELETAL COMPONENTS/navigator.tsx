import React, { useState } from "react";
import EyeContactTrainer from "./01";
import OpenBodyLanguage from "./01";
import SmileWarmUp from "./02";
import VoiceToneControl from "./03";
import ApproachOpener from "./04";
import ActiveListening from "./05";
import GenuineAppreciation from "./06";
import HandleSilence from "./07"; // This contains FailureTherapy

const skills = [
  { component: EyeContactTrainer, title: "Eye Contact Trainer" },
  { component: OpenBodyLanguage, title: "Open Body Language" },
  { component: SmileWarmUp, title: "Smile Warm-Up" },
  { component: VoiceToneControl, title: "Voice Tone Control" },
  { component: ApproachOpener, title: "Approach Opener" },
  { component: ActiveListening, title: "Active Listening" },
  { component: GenuineAppreciation, title: "Genuine Appreciation" },
  { component: HandleSilence, title: "Handling Silence" },
];

const SkillNavigator = ({ onComplete }) => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const total = skills.length;
  const SkillComponent = skills[currentSkill].component;

  const nextSkill = () => {
    if (currentSkill < total - 1) {
      setCurrentSkill((i) => i + 1);
    } else {
      // Last skill completed! Call onComplete to exit Day1Navigator
      if (onComplete) {
        onComplete(); // This triggers Day1Navigator → ChakuSubpage → Main App next subpage
      }
    }
  };

  const prevSkill = () => setCurrentSkill((i) => Math.max(i - 1, 0));

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-2 mt-4 md:mt-6">
        <div
          className="bg-purple-500 h-2 transition-all duration-300"
          style={{ width: `${((currentSkill + 1) / total) * 100}%` }}
        />
      </div>

      {/* Content Container */}
      <div className="flex-1 w-full md:max-w-4xl flex items-center justify-center overflow-y-auto px-4 sm:px-6 md:px-10 pt-safe pb-28 md:pb-24">
        <SkillComponent onNext={nextSkill} /> {/* ← PASS onNext TO CHILD */}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 left-0 right-0 z-[9999] flex justify-between px-6 md:px-16">
        <button
          onClick={prevSkill}
          disabled={currentSkill === 0}
          className="bg-gray-800/80 backdrop-blur-md px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/90 transition-all font-semibold text-white shadow-lg active:scale-95"
        >
          ← Previous
        </button>

        <button
          onClick={nextSkill}
          className="bg-purple-500/90 backdrop-blur-md px-6 py-3 rounded-xl text-white hover:bg-purple-600/90 transition-all font-semibold shadow-lg active:scale-95"
        >
          {currentSkill === total - 1 ? "Complete! →" : "Next →"}
        </button>
      </div>

      {/* Skill Counter */}
      <div className="fixed bottom-2 left-0 right-0 text-center text-gray-400 text-sm">
        Skill {currentSkill + 1} of {total}: {skills[currentSkill].title}
      </div>
    </div>
  );
};

export default SkillNavigator;