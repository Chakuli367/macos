import React, { useState } from "react";
import ConversationalFlow from "./CONVOFLOW/convoflow";
import Storytelling from "./STORYTELLING/storytelling";
import EMPATHY from "./EMPATHY/empathy";
import Humor from "./HUMOR/humor";

const skills = [
  ConversationalFlow,
  Storytelling,
  EMPATHY,
  
  Humor,
];

const Level2Router: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentSkill = skills[currentIndex];

  const handleNext = () => {
    if (currentIndex < skills.length - 1) setCurrentIndex(currentIndex + 1);
    else alert("You have completed all Level 2 skills!");
  };

  return <CurrentSkill onNext={handleNext} />;
};

export default Level2Router;
