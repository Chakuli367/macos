import { useState, useEffect } from "react";

interface TrailerProps {
  onClose: () => void;
}

export default function ConversationTrailer({ onClose }: TrailerProps) {
  const steps = [
  "Your social life isn’t just a story… it’s about to change.",
  "Talk to this AI. Explain your daily interactions, challenges, and goals.",
  "The AI listens, learns, and understands your social patterns.",
  "Then… it generates your personalized 5-day action plan to improve your social life."
];


  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const stepTimer = setTimeout(() => {
      setVisible(false);
      const nextTimer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          onClose(); // auto-close at the end
        }
      }, 1000); // fade-out duration
      return () => clearTimeout(nextTimer);
    }, 4000); // text visible duration
    return () => clearTimeout(stepTimer);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-2xl px-6 text-center">
        <p
          className={`text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-relaxed transition-opacity duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}
