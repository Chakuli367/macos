import React, { useState } from "react";
import { ChevronRight, X, School, Target, Eye, CheckCircle } from "lucide-react";

interface OnboardingTrailerProps {
  onComplete: () => void;
  onSkip: () => void;
}

const LessonsOnboardingTrailer: React.FC<OnboardingTrailerProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const slides = [
    {
      icon: School,
      title: "This is for socially anxious people",
      description: "These lessons are made for people who overthink conversations, feel awkward, or don’t know what to say.",
      color: "from-purple-600 to-indigo-600",
      features: ["No confidence required", "No fake positivity", "No pressure to perform"]
    },
    {
      icon: Target,
      title: "You’ll get clear instructions",
      description: "Each lesson tells you exactly what to do, what to say, and what usually happens next.",
      color: "from-indigo-600 to-blue-600",
      features: ["Step-by-step guidance", "Real social examples", "No vague advice"]
    },
    {
      icon: Eye,
      title: "You can go at your pace",
      description: "Read quietly, repeat lessons, or stop anytime. Nothing is timed or forced.",
      color: "from-blue-600 to-cyan-600",
      features: ["Pause whenever you want", "Repeat lessons freely", "No deadlines"]
    },
    {
      icon: CheckCircle,
      title: "This is practice, not judgment",
      description: "Mistakes are expected here. The goal is progress, not being impressive.",
      color: "from-cyan-600 to-purple-600",
      features: ["No scoring", "No comparison", "Small progress counts"]
    },
    {
      // Quiz Slide
      icon: School,
      title: "Quick Self-Reflection Quiz",
      description: "Answer these to understand yourself better and how these lessons will help you.",
      color: "from-purple-500 to-pink-500",
      features: [], // We'll render quiz instead
      isQuiz: true
    }
  ];

  const quizQuestions = [
    { id: "overthink", question: "Do you often overthink what to say in conversations?" },
    { id: "avoid", question: "Do you avoid social situations because of fear or anxiety?" },
    { id: "improve", question: "Are you motivated to improve your social skills?" }
  ];

  const handleQuizChange = (id: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [id]: value }));
  };

  const submitQuiz = () => setQuizSubmitted(true);

  const nextSlide = () => {
    if (slides[currentSlide]?.isQuiz && !quizSubmitted) return; // prevent moving forward before submitting
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else onComplete();
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col">

        <button onClick={onSkip} className="absolute top-4 right-4 text-purple-300 hover:text-white">
          <X size={22} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto flex-1">

          <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br ${slide.color}`}>
            <Icon size={40} className="text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
          <p className="text-purple-200 mb-6">{slide.description}</p>

          {slide.isQuiz ? (
            <div className="space-y-6">
              {!quizSubmitted ? (
                <>
                  {quizQuestions.map(q => (
                    <div key={q.id}>
                      <p className="text-purple-100 mb-2">{q.question}</p>
                      <select
                        value={quizAnswers[q.id] || ""}
                        onChange={e => handleQuizChange(q.id, e.target.value)}
                        className="w-full p-2 rounded-md bg-purple-800 text-white"
                      >
                        <option value="">Select...</option>
                        <option value="yes">Yes</option>
                        <option value="sometimes">Sometimes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  ))}
                  <button
                    onClick={submitQuiz}
                    className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <div className="bg-purple-900 p-4 rounded-xl text-white">
                  <h3 className="text-xl font-bold mb-2">Your Insights:</h3>
                  <ul className="list-disc list-inside">
                    {quizAnswers.overthink === "yes" && <li>You tend to overthink conversations. These lessons will help you feel more natural.</li>}
                    {quizAnswers.avoid === "yes" && <li>You may avoid social situations. Step-by-step practice can reduce anxiety.</li>}
                    {quizAnswers.improve === "yes" && <li>Your motivation is your strongest tool for progress.</li>}
                    {!Object.values(quizAnswers).some(a => a === "yes") && <li>You’re already managing your social interactions well. These lessons can refine your skills further.</li>}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {slide.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-0.5" size={18} />
                  <p className="text-purple-100">{feature}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-purple-400" : "w-2 bg-purple-700"}`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            {currentSlide > 0 && (
              <button onClick={prevSlide} className="flex-1 py-3 bg-purple-800/50 rounded-xl text-white">Back</button>
            )}
            <button onClick={nextSlide} className={`flex-1 py-3 rounded-xl text-white font-bold bg-gradient-to-r ${slide.color} flex items-center justify-center gap-2`}>
              {currentSlide === slides.length - 1 ? "Start Lessons" : <>Next <ChevronRight size={18} /></>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LessonsOnboardingTrailer;
