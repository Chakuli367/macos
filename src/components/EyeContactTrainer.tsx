import React, { useState, useEffect, useRef } from 'react';
import { Eye, Check, RotateCcw } from 'lucide-react';

// Constants
const MAX_REPS = 1;
const FILL_DURATION = 3000; // milliseconds
const HOLD_DURATION = 2000;
const EMPTY_DURATION = 1000;

// Types
type Phase = 'idle' | 'filling' | 'holding' | 'emptying';

// Name Input Screen Props
interface NameInputScreenProps {
  onStart: (name: string) => void;
}

// Practice Screen Props
interface PracticeScreenProps {
  userName: string;
}

// Custom Hook for Eye Contact Animation
const useEyeAnimation = (
  isActive: boolean,
  onComplete: () => void
) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [fillProgress, setFillProgress] = useState<number>(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive) return;

    let startTime: number | undefined;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (phase === 'filling') {
        setFillProgress(Math.min(100, (elapsed / FILL_DURATION) * 100));
        if (elapsed < FILL_DURATION) animationRef.current = requestAnimationFrame(animate);
        else setPhase('holding');
      } else if (phase === 'holding') {
        if (elapsed >= HOLD_DURATION) setPhase('emptying');
        else animationRef.current = requestAnimationFrame(animate);
      } else if (phase === 'emptying') {
        setFillProgress(Math.max(0, 100 - (elapsed / EMPTY_DURATION) * 100));
        if (elapsed < EMPTY_DURATION) animationRef.current = requestAnimationFrame(animate);
        else onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isActive, phase, onComplete]);

  const start = () => {
    setPhase('filling');
    setFillProgress(0);
  };

  const reset = () => {
    setPhase('idle');
    setFillProgress(0);
  };

  return { phase, fillProgress, start, reset };
};

// Confetti Component
const Confetti: React.FC = () => (
  <div className="confetti-container">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: ['#4A90E2', '#7CB9E8', '#FFD700', '#FF69B4', '#98FB98'][Math.floor(Math.random() * 5)],
        }}
      />
    ))}
  </div>
);

// Name Input Screen
const NameInputScreen: React.FC<NameInputScreenProps> = ({ onStart }) => {
  const [userName, setUserName] = useState<string>('');

  return (
    <div className="eye-contact-screen">
      <div className="name-input-container">
        <div className="icon-wrapper">
          <Eye className="eye-icon" />
        </div>
        <h1 className="title">Eye Contact Trainer</h1>
        <p className="subtitle">Build confidence through consistent eye contact practice</p>

        <div className="input-wrapper">
          <label className="input-label">What's your name?</label>
          <input
            type="text"
            value={userName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="text-input"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onStart(userName)}
          />
        </div>

        <button
          onClick={() => onStart(userName)}
          className="start-button"
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

// Main Practice Screen
const PracticeScreen: React.FC<PracticeScreenProps> = ({ userName }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [reps, setReps] = useState<number>(0);

  const handleComplete = () => {
    setReps(prev => prev + 1);
    if (reps + 1 >= MAX_REPS) {
      setIsActive(false);
      setIsCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 5000);
      animation.start();
    }
  };

  const animation = useEyeAnimation(isActive, handleComplete);

  const startPractice = () => {
    setIsActive(true);
    setReps(0);
    animation.start();
  };

  const resetPractice = () => {
    setIsActive(false);
    setReps(0);
    setIsCompleted(false);
    setShowTip(false);
    animation.reset();
  };

  return (
    <div className="eye-contact-screen">
      {showConfetti && <Confetti />}

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(reps / MAX_REPS) * 100}%` }} />
        </div>
        <p className="progress-text">{reps}/{MAX_REPS} Repetition Complete {isCompleted && '✓'}</p>
      </div>

      <div className="practice-container">
        <div className="instructions">
          <h2 className="instructions-title">
            {isCompleted ? 'Skill Mastered!' : 'Look at the center and hold your gaze'}
          </h2>
          <p className="instructions-subtitle">
            {isCompleted ? `Congratulations ${userName}! You've completed your practice.` : `Say aloud: "Hi, I'm ${userName}. Nice to meet you."`}
          </p>
        </div>

        <div className="circle-container">
          <div className="circle-frame">
            <div className="fill-circle" style={{ height: `${animation.fillProgress}%` }}>
              <div className="wave-effect" />
            </div>
            <div className="center-point" />
            <div className="eye-overlay">
              <Eye className="eye-icon-large" />
            </div>
          </div>

          <div className="phase-indicator">
            {animation.phase === 'idle' && 'Ready to Start'}
            {animation.phase === 'filling' && 'Maintain Gaze'}
            {animation.phase === 'holding' && 'Hold Steady'}
            {animation.phase === 'emptying' && 'Keep Looking'}
            {isCompleted && '✓ Complete!'}
          </div>
        </div>

        {showTip && <div className="tip-box">💡 Pro Tip: Break eye contact naturally every 5-7 seconds.</div>}

        <div className="control-buttons">
          {!isActive && !isCompleted && <button onClick={startPractice}>Start</button>}
          {isActive && <button onClick={() => setIsActive(false)}>Pause</button>}
          {(isCompleted || reps > 0) && <button onClick={resetPractice}>Reset</button>}
        </div>

        {isCompleted && (
          <div className="success-message">
            <Check className="check-icon" />
            <p>Well done, {userName}! You've completed the practice.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const EyeContactTrainer: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(true);

  const handleStart = (name: string) => {
    if (!name.trim()) return;
    setUserName(name);
    setShowNameInput(false);
  };

  return showNameInput ? <NameInputScreen onStart={handleStart} /> : <PracticeScreen userName={userName} />;
};

export default EyeContactTrainer;
