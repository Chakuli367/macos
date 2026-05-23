import React from "react";

interface PageProps {
  onNext: () => void;
}

export const END: React.FC<PageProps> = ({ onNext }) => {
  return (
    <div className="page">
      <h2>Step 7: End-of-Day Reflection</h2>
      <ul>
        <li>Which locations were easiest? Hardest?</li>
        <li>Which skills worked well? Which need improvement?</li>
        <li>Identify 1–2 adjustments for tomorrow</li>
      </ul>
      <button onClick={onNext}>Finish Day 2</button>
    </div>
  );
};
