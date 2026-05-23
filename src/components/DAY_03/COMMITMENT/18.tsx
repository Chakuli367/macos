import React from "react";

const COMMIT: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div>
    <h2>COMMIT: Prepare Mentally & Physically</h2>
    <p>
      Repeat posture, breathing, and positive self-talk from Day 1. Practice micro-skills for 5–10 minutes: eye contact, smile, tone, gestures, conversation framework. Visualize executing improved strategies in your Day 3 locations.
    </p>
    <button onClick={onNext}>Next</button>
  </div>
);

export default COMMIT;