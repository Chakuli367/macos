import React, { useState } from "react";
import {
  ChevronRight,
  X,
  Users,
  Trophy,
  Target,
  MessageCircle,
  Star,
  CheckCircle
} from "lucide-react";

interface OnboardingTrailerProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTrailer: React.FC<OnboardingTrailerProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
  {
    icon: Users,
    title: "You’re not the only one",
    description:
      "Everyone here struggles socially. No performers. No confident extroverts. Just people like you trying to feel normal around others.",
    color: "from-purple-600 to-indigo-600",
    features: [
      "Everyone feels awkward here",
      "No pressure to talk or post",
      "You join at your own pace"
    ]
  },
  {
    icon: MessageCircle,
    title: "You don’t have to talk",
    description:
      "You can observe first. Read others’ experiences. Learn what works before you ever say a word.",
    color: "from-indigo-600 to-blue-600",
    features: [
      "Lurk without interacting",
      "See real social attempts",
      "Learn without being seen"
    ]
  },
  {
    icon: Target,
    title: "You’ll know exactly what to do",
    description:
      "No guessing. No vague advice. You get small, clear actions designed for socially anxious people.",
    color: "from-blue-600 to-cyan-600",
    features: [
      "Tiny social experiments",
      "Clear instructions",
      "No forced exposure"
    ]
  },
  {
    icon: CheckCircle,
    title: "This is practice, not judgment",
    description:
      "Nothing here is about being impressive. It’s about trying, failing safely, and slowly building confidence.",
    color: "from-cyan-600 to-purple-600",
    features: [
      "No likes or popularity contests",
      "Progress over perfection",
      "You control how far you go"
    ]
  }
];



  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col">

        {/* Skip */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-purple-300 hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto flex-1">

          {/* Icon */}
          <div
            className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br ${slide.color}`}
          >
            <Icon size={40} className="text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-4">
            {slide.title}
          </h2>

          {/* Description */}
          <p className="text-purple-200 mb-6">
            {slide.description}
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {slide.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-green-400 mt-0.5" size={18} />
                <p className="text-purple-100">{feature}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? "w-8 bg-purple-400"
                    : "w-2 bg-purple-700"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="flex-1 py-3 bg-purple-800/50 rounded-xl text-white"
              >
                Back
              </button>
            )}

            <button
              onClick={nextSlide}
              className={`flex-1 py-3 rounded-xl text-white font-bold bg-gradient-to-r ${slide.color} flex items-center justify-center gap-2`}
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Get Started <Star size={18} />
                </>
              ) : (
                <>
                  Next <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OnboardingTrailer;
