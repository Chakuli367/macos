import { useEffect } from 'react';
import { useMentorStore } from 'src/store/useMentorStore';
import { startDriver, stopDriver } from './useDriver';
import './MentorLayer.css'; // optional CSS for bubble animations

export default function MentorLayer() {
  const { active, stepIndex, script, nextStep, stop } = useMentorStore();

  // auto-start Driver.js if active and script changes
  useEffect(() => {
    if (active && script.length > 0) {
      startDriver(script);
    }
    return () => stopDriver();
  }, [active, script]);

  if (!active || script.length === 0) return null;

  const currentStep = script[stepIndex];

  return (
    <div className="mentor-layer">
      {/* Floating bubble */}
      <div className="mentor-bubble animate-bounce">
        <div className="mentor-text">{currentStep.text}</div>
        <div className="mentor-buttons">
          <button
            className="mentor-btn"
            onClick={nextStep}
          >
            Next
          </button>
          <button
            className="mentor-btn mentor-skip"
            onClick={stop}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
