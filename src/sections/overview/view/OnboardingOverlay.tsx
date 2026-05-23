import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  onFinish: () => void;
}

const onboardingSteps = [
  {
    title: "Start with a quick chat",
    content: "Answer a few questions about where you're at right now. Takes about 2 minutes.",
    img: "https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/10/Screenshot-2025-10-24-024321.png",
  },
  {
    title: "Get a personalized 5-day plan",
    content: "Based on what you share, we build small steps that fit your actual situation.",
    img: "https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/10/Screenshot-2025-10-24-022105.png",
  },
  {
    title: "Track what works",
    content: "See which actions actually help and adjust as you go.",
    img: "https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/10/Screenshot-2025-10-24-022246.png",
  },
  {
    title: "Keep it simple",
    content: "Everything stays organized in one place. No jumping between apps.",
    img: "https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/10/Screenshot-2025-10-24-023643.png",
  },
  {
    title: "That's it",
    content: "Let's get started.",
    img: "https://goalgrid.wpcomstaging.com/wp-content/uploads/2025/10/Screenshot-2025-10-24-022105.png",
  },
];

const OnboardingOverlay: React.FC<Props> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(meta);

    const preventPinch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener("touchmove", preventPinch, { passive: false });
    document.addEventListener("gesturestart", (e) => e.preventDefault());
    document.addEventListener("gesturechange", (e) => e.preventDefault());
    document.addEventListener("gestureend", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("touchmove", preventPinch);
      document.removeEventListener("gesturestart", (e) => e.preventDefault());
      document.removeEventListener("gesturechange", (e) => e.preventDefault());
      document.removeEventListener("gestureend", (e) => e.preventDefault());
    };
  }, []);

  // Preload ALL images on mount for instant transitions
  useEffect(() => {
    onboardingSteps.forEach((step, index) => {
      const img = new Image();
      img.src = step.img;
      img.onload = () => {
        setImageLoaded(prev => ({ ...prev, [index]: true }));
      };
    });
  }, []);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-950 via-purple-800 to-purple-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-md"></div>

      <div className="relative z-10 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 w-full max-w-4xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Text Section */}
          <div className="flex-1 text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              {step.title}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              {step.content}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              {/* Progress dots */}
              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "bg-purple-400 w-6"
                        : index < currentStep
                        ? "bg-purple-600"
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-sm">
                  {currentStep === onboardingSteps.length - 1 ? "Start" : "Next"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Phone Mockup with instant image loading */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-[60vw] max-w-[260px] aspect-[260/520] bg-black rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700">
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                {imageLoaded[currentStep] ? (
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;