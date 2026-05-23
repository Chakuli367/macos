import React, { useState } from "react";
import ConversationalFlow from "./CONVOFLOW/convoflow";
import Storytelling from "./STORYTELLING/storytelling";
import Empathy from "./EMPATHY/empathy";
import SocialCues from "./SOCIALCUES/socialcues";
import Humor from "./HUMOR/humor";

interface Level2RouterProps {
  onComplete?: () => void;
}

const skills = [
  ConversationalFlow,
  Storytelling,
  Empathy,
  Humor,
];

const Level2Router: React.FC<Level2RouterProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentSkill = skills[currentIndex];

  const handleNext = () => {
    if (currentIndex < skills.length - 1) {
      console.log(`✅ Skill ${currentIndex + 1} complete! Moving to skill ${currentIndex + 2}`);
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("✅ All Level 2 skills completed! Calling onComplete...");
      onCompleteNavigator();
    }
  };

  const onCompleteNavigator = () => {
    console.log("🚀 Level2Router calling onComplete");
    if (onComplete) {
      onComplete(); // This triggers the parent
    } else {
      console.error("❌ onComplete is not defined in Level2Router!");
    }
  };

  return (
    <CurrentSkill 
      onNext={handleNext} 
      onCompleteNavigator={onCompleteNavigator} 
    />
  );
};

export default Level2Router;