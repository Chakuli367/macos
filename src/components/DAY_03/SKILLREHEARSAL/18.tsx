import React from "react";

const SKILLREHEARSAL: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div>
    <h2>Step 3: Learn From What Went Wrong</h2>
    <p>
      Look across all conversations and identify patterns:
      <ul>
        <li>Hesitation before greeting?</li>
        <li>Conversations ending too soon?</li>
        <li>Missed follow-up questions?</li>
      </ul>
      Write 1–2 actionable improvements for each challenge.
    </p>
    <button onClick={onNext}>Next</button>
  </div>
);

export default SKILLREHEARSAL;
