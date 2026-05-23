import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import BookAnimation from "./BookAnimation";
import type { Message, Plan } from "@shared/schema";
import apiKeysData from "./apikeys.json";
import { useNavigate } from "react-router-dom";

type FlowStep =
  | "intro"
  | "questions"
  | "reinforce"
  | "friendGoals"
  | "peopleSlider"
  | "peopleDetails"
  | "conversation"
  | "complete";

type Question = {
  id: string;
  text: string;
  options: { text: string; reinforce: string }[];
};

// ---------------- QUIZ QUESTIONS (DETAILED & IMPROVED) ----------------
const quizQuestions: Question[] = [
  {
    id: "q1",
    text: "How often do you initiate conversations with people you don’t know?",
    options: [
      {
        text: "Almost never 😅",
        reinforce:
          "Recognizing this is the first step! Small starts lead to big growth 🌱",
      },
      {
        text: "Sometimes 🤔",
        reinforce: "Great! Even occasional steps build confidence.",
      },
      {
        text: "Often 🙂",
        reinforce: "Awesome! You’re comfortable taking social initiative.",
      },
      {
        text: "Always 😎",
        reinforce: "Fantastic! You thrive in connecting with new people.",
      },
    ],
  },
  {
    id: "q2",
    text: "When you meet someone new, what details do you naturally notice or remember?",
    options: [
      {
        text: "Just their name 😅",
        reinforce: "Names are key! Let’s work on noticing deeper details too.",
      },
      {
        text: "Name + appearance 🤔",
        reinforce: "Good! Observing visual details helps you connect.",
      },
      {
        text: "Name + interests/what they say 🙂",
        reinforce: "Excellent! You notice what truly matters.",
      },
      {
        text: "I remember a lot about them 😎",
        reinforce: "Impressive! You’re naturally attentive and engaging.",
      },
    ],
  },
  {
    id: "q3",
    text: "Which social situations make you feel most uncomfortable?",
    options: [
      {
        text: "Meeting strangers 😳",
        reinforce:
          "It’s normal! We’ll help you approach new people with confidence.",
      },
      {
        text: "Large groups 🤔",
        reinforce: "Small steps can make you feel at ease in crowds.",
      },
      {
        text: "Work/Networking events 😅",
        reinforce:
          "We can transform these situations into opportunities for connection.",
      },
      {
        text: "Most social settings 😓",
        reinforce:
          "No worries, we’ll start with manageable interactions first.",
      },
    ],
  },
  {
    id: "q4",
    text: "After meeting someone, how often do you maintain contact or follow up?",
    options: [
      {
        text: "Never 😅",
        reinforce: "Follow-ups are a skill! We’ll build that habit together.",
      },
      {
        text: "Sometimes 🤔",
        reinforce: "Good! Consistency will strengthen your connections.",
      },
      {
        text: "Often 🙂",
        reinforce: "Excellent! Regular follow-ups show care and commitment.",
      },
      {
        text: "Always 😎",
        reinforce: "Amazing! You naturally maintain strong connections.",
      },
    ],
  },
  {
    id: "q5",
    text: "What is the most challenging part of socializing for you?",
    options: [
      {
        text: "Not knowing what to say 😓",
        reinforce: "Conversation starters will help you feel more prepared.",
      },
      {
        text: "Feeling awkward 😳",
        reinforce:
          "Awkwardness is normal; practice makes interactions smoother.",
      },
      {
        text: "Fear of rejection 😢",
        reinforce: "We’ll build confidence and resilience step by step.",
      },
      {
        text: "Keeping conversations going 🤔",
        reinforce:
          "You’ll learn natural ways to maintain engaging conversations.",
      },
    ],
  },
  {
    id: "q6",
    text: "Why do you want to improve your social skills?",
    options: [
      {
        text: "Make more friends 🙂",
        reinforce: "Awesome! Expanding your social circle is empowering.",
      },
      {
        text: "Strengthen current friendships 💛",
        reinforce: "Perfect! Deep, meaningful connections matter.",
      },
      {
        text: "Career / Networking 🚀",
        reinforce: "Great! Social skills can open professional opportunities.",
      },
      {
        text: "Personal growth 🌱",
        reinforce:
          "Amazing! Developing social skills is a lifelong investment.",
      },
    ],
  },
  {
    id: "q7",
    text: "How do you think others perceive you in social settings?",
    options: [
      {
        text: "Shy / quiet 😅",
        reinforce:
          "Understanding perceptions helps you adjust interactions wisely.",
      },
      {
        text: "Friendly but awkward 🤔",
        reinforce:
          "Small adjustments can boost both confidence and likability.",
      },
      {
        text: "Confident 🙂",
        reinforce: "Great! Keep building on your positive impression.",
      },
      {
        text: "Outgoing / likable 😎",
        reinforce: "Fantastic! You naturally make others feel comfortable.",
      },
    ],
  },
  {
    id: "q8",
    text: "How do you usually feel after social interactions?",
    options: [
      {
        text: "Drained or anxious 😓",
        reinforce:
          "We’ll explore ways to make socializing energizing rather than exhausting.",
      },
      {
        text: "Neutral 🤔",
        reinforce: "Good! Awareness of your energy can guide how you interact.",
      },
      {
        text: "Happy or satisfied 🙂",
        reinforce: "Excellent! You already enjoy connecting with others.",
      },
      {
        text: "Excited and energized 😎",
        reinforce: "Amazing! Social interactions are a strength for you.",
      },
    ],
  },
  {
    id: "q9",
    text: "When conflicts or misunderstandings occur, how do you typically respond?",
    options: [
      {
        text: "Avoid or stay quiet 😅",
        reinforce: "We’ll work on expressing yourself calmly and confidently.",
      },
      {
        text: "Feel awkward but try to clarify 🤔",
        reinforce:
          "Good! Learning structured approaches can help resolve conflicts smoothly.",
      },
      {
        text: "Address directly and politely 🙂",
        reinforce: "Excellent! You manage misunderstandings maturely.",
      },
      {
        text: "Comfortable handling and resolving 😎",
        reinforce:
          "Fantastic! You have strong interpersonal problem-solving skills.",
      },
    ],
  },
  {
    id: "q10",
    text: "How comfortable are you giving and receiving compliments?",
    options: [
      {
        text: "Very uncomfortable 😅",
        reinforce:
          "Complimenting is a social skill; we’ll practice it together.",
      },
      {
        text: "Somewhat comfortable 🤔",
        reinforce: "Good! Small steps make this natural over time.",
      },
      {
        text: "Comfortable 🙂",
        reinforce: "Excellent! You can express appreciation easily.",
      },
      {
        text: "Very confident 😎",
        reinforce:
          "Amazing! You strengthen relationships with genuine appreciation.",
      },
    ],
  },
];

interface GoalPlannerMainProps {
  onClose?: () => void;
  className?: string;
}

export default function GoalPlannerMain({
  onClose,
  className,
}: GoalPlannerMainProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reinforcement, setReinforcement] = useState<string | null>(null);
  const [friendGoal, setFriendGoal] = useState(0);
  const [numContacts, setNumContacts] = useState(0);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<
    { name: string; relation: string }[]
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<Plan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const apiKeys = apiKeysData.keys;
  const navigate = useNavigate();

  const handleAnswer = (option: { text: string; reinforce: string }) => {
    const question = quizQuestions[currentQuestionIndex];
    setQuizAnswers({ ...quizAnswers, [question.id]: option.text });
    setReinforcement(option.reinforce);

    setTimeout(() => {
      setReinforcement(null);
      if (currentQuestionIndex + 1 < quizQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep("friendGoals");
      }
    }, 1500);
  };

  const handleFriendGoalNext = () => {
    setCurrentStep("peopleSlider");
  };

  const handlePeopleNext = () => {
    if (numContacts === 0) setCurrentStep("conversation");
    else setCurrentStep("peopleDetails");
  };

  const handleContactSubmit = (name: string, relation: string) => {
    setContacts([...contacts, { name, relation }]);
    if (currentContactIndex + 1 < numContacts) {
      setCurrentContactIndex(currentContactIndex + 1);
    } else {
      setCurrentStep("conversation");
    }
  };

  const handleGeneratePlan = async (day: number = 1) => {
    setIsGeneratingPlan(true);
    try {
      const payload = {
        user_id: "user_demo",
        goal_name: quizAnswers["q2"] || "social skills",
        user_answers: Object.values(quizAnswers),
      };
      const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

      const resp = await fetch(
        `https://one23-u2ck.onrender.com/final-plan-day${day}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const raw = await resp.text();
      const data = JSON.parse(raw);
      if (!data || !data.plan) throw new Error("No plan returned");
      setGeneratedPlan(data.plan);
      setCurrentStep("complete");
    } catch (err) {
      alert("Failed to generate plan. Try again later.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const progressPercent =
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div
      className={`w-full h-full min-h-screen p-6 sm:p-8 text-white flex flex-col items-center justify-start overflow-auto ${className}`}
    >
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-transparent hover:bg-white/10 transition"
        >
          X
        </Button>
      )}

      <AnimatePresence mode="wait">
        {reinforcement ? (
          <motion.div
            key="reinforce"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-lg sm:text-xl font-semibold text-yellow-400 animate-pulse mt-20"
          >
            {reinforcement}
          </motion.div>
        ) : (
          <motion.div
            key={currentStep + currentQuestionIndex + currentContactIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl"
          >
            {currentStep === "intro" && (
              <div className="text-center space-y-6 mt-20">
                <BookAnimation />
                <h1 className="text-4xl font-bold text-white">
                  Welcome to GoalGrid
                </h1>
                <p className="text-lg text-gray-300">
                  Let’s build your personalized social skills journey.
                </p>
                <Button
                  onClick={() => {
                    setCurrentStep("questions");
                    setCurrentQuestionIndex(0);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

            {currentStep === "questions" &&
              quizQuestions[currentQuestionIndex] && (
                <div className="space-y-6 text-center mt-12">
                  <div className="relative h-5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-green-400 rounded-full"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold mt-4">
                    {quizQuestions[currentQuestionIndex].text}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {quizQuestions[currentQuestionIndex].options.map((opt) => (
                      <motion.div
                        key={opt.text}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition text-white font-semibold"
                        onClick={() => handleAnswer(opt)}
                      >
                        {opt.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            {currentStep === "friendGoals" && (
              <div className="space-y-6 text-center mt-12">
                <h2 className="text-2xl font-semibold">
                  How many friends do you want us to help you make?
                </h2>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={friendGoal}
                  onChange={(e) => setFriendGoal(Number(e.target.value))}
                  className="w-full"
                />
                <p className="font-semibold">{friendGoal} people</p>
                <Button
                  disabled={friendGoal === 0}
                  onClick={handleFriendGoalNext}
                >
                  Next
                </Button>
              </div>
            )}

            {currentStep === "peopleSlider" && (
              <div className="space-y-6 text-center mt-12">
                <h2 className="text-2xl font-semibold">
                  How many people do you currently interact with whom you
                  consider to be a part of your life?
                </h2>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={numContacts}
                  onChange={(e) => setNumContacts(Number(e.target.value))}
                  className="w-full"
                />
                <p className="font-semibold">{numContacts} people</p>
                <Button disabled={numContacts === 0} onClick={handlePeopleNext}>
                  Next
                </Button>
              </div>
            )}

            {currentStep === "peopleDetails" && (
              <div className="space-y-6 text-center mt-12">
                <h2 className="text-2xl font-semibold">
                  Tell me about person {currentContactIndex + 1}
                </h2>
                <input
                  type="text"
                  placeholder="Their name"
                  className="border rounded p-2 w-full bg-white/5"
                  onChange={(e) =>
                    (contacts[currentContactIndex] = {
                      ...contacts[currentContactIndex],
                      name: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="How do you know them?"
                  className="border rounded p-2 w-full bg-white/5"
                  onChange={(e) =>
                    (contacts[currentContactIndex] = {
                      ...contacts[currentContactIndex],
                      relation: e.target.value,
                    })
                  }
                />
                <Button
                  onClick={() =>
                    handleContactSubmit(
                      contacts[currentContactIndex]?.name || "",
                      contacts[currentContactIndex]?.relation || "",
                    )
                  }
                >
                  Next
                </Button>
              </div>
            )}

            {currentStep === "conversation" && (
              <div className="text-center mt-20">
                <h2 className="text-2xl font-semibold mb-6">
                  Ready to chat with your AI guide?
                </h2>
                <Button
                  onClick={() =>
                    navigate(`/conversation`, {
                      state: { messages, quizAnswers, contacts, friendGoal },
                    })
                  }
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold"
                >
                  Start Conversation
                </Button>
              </div>
            )}

            {currentStep === "complete" && (
              <div className="text-center space-y-6 mt-12">
                <h2 className="text-3xl font-bold">Your Journey Begins Now!</h2>
                <PlanDisplay plan={generatedPlan || null} userId="demoUserId" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
