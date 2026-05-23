import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Avatar, Message } from "@shared/schema";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import apiKeysData from "../apikeys.json";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// ---------------- FIREBASE ----------------
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const firestore = getFirestore(app);

// ---------------- TYPES ----------------
interface ConversationFlowProps {
  avatar: Avatar | null;
  isLoading: boolean;
  progress: number;
  answers: Record<string, string>;
}

const avatarStyles = {
  Skyler: { gradient: "from-blue-400 to-blue-600" },
  Raven: { gradient: "from-purple-400 to-purple-600" },
  Phoenix: { gradient: "from-orange-400 to-red-600" },
};

// ---------------- COMPONENT ----------------
export default function ConversationFlow({
  avatar,
  isLoading,
  progress,
  answers,
}: ConversationFlowProps) {
  const style = avatar ? avatarStyles[avatar] : null;
  const [messages, setMessages] = useState<Message[]>([]); // <--- self-sustaining
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<Plan | null>(null);
  const [typingMessages, setTypingMessages] = useState<Record<string, string>>(
    {},
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const userId = "user_demo";
  const [localLoading, setLocalLoading] = useState(false);

  const apiKeys = apiKeysData.keys;

  // ---------------- SCROLL TO BOTTOM ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessages]);

  // ---------------- TYPEWRITER EFFECT ----------------
  useEffect(() => {
    const latestAI = messages.filter((m) => m.role === "assistant").pop();
    if (!latestAI || typingMessages[latestAI.id]) return;

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTypingMessages((prev) => ({
        ...prev,
        [latestAI.id]: latestAI.content.slice(0, idx),
      }));
      if (idx >= latestAI.content.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [messages]);

  // Generate plan for a specific day
  const handleGeneratePlan = async () => {
    console.log("🚀 Starting full 5-day plan generation...");
    setIsGeneratingPlan(true);

    try {
      const userMessages = messages.filter((m) => m.role === "user");
      const userAnswers = Object.values(answers);
      const goalName =
        userMessages[0]?.content || userAnswers[0] || "social skills";

      for (let day = 1; day <= 5; day++) {
        console.log(`🔹 Generating plan for Day ${day}...`);
        const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        console.log("🔑 Using API key:", apiKey);

        const payload = {
          user_id: "user_demo",
          goal_name: goalName,
          user_answers: userAnswers,
        };

        console.log("📦 Payload:", payload);

        try {
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

          console.log(
            `🌐 Response status for Day ${day}:`,
            resp.status,
            resp.statusText,
          );

          const data = await resp.json();
          console.log(`✅ Response data for Day ${day}:`, data);

          if (!data.plan) throw new Error("No plan returned from server");

          // Save each day's plan to Firestore
          const userPlanRef = doc(firestore, "plans", `user_day_${day}`);
          await setDoc(userPlanRef, {
            plan: data.plan,
            goal_name: goalName,
            generated_at: serverTimestamp(),
            created_at: serverTimestamp(),
          });

          // Add message to chat after each day
          const dayMessage: Message = {
            id: (Date.now() + day).toString(),
            role: "assistant",
            content: `✅ Plan for Day ${day} created.`,
          };
          setMessages((prev) => [...prev, dayMessage]);
        } catch (err) {
          console.error(`🔥 Error generating plan for Day ${day}:`, err);
          const errorMessage: Message = {
            id: (Date.now() + day + 100).toString(),
            role: "assistant",
            content: `⚠️ Failed to generate plan for Day ${day}.`,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }

      // After all 5 days
      const finalMessage: Message = {
        id: (Date.now() + 1000).toString(),
        role: "assistant",
        content: "🎉 Your entire 5-day plan is created!",
      };
      setMessages((prev) => [...prev, finalMessage]);

      console.log("⏹️ Full 5-day plan generation finished.");
    } catch (error) {
      console.error("🔥 handleGeneratePlan error:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSend = () => {
    if (!inputValue.trim() || isLoading || localLoading) return;
    handleSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendMessage = async (msgContent: string) => {
    console.log("📨 Sending message:", msgContent);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msgContent,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLocalLoading(true);

    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    console.log("🔑 Using API key:", apiKey);

    try {
      const payload = {
        user_id: userId,
        message: msgContent,
        goal_name: answers["q1"] || "social skills",
        answers,
      };
      console.log("📦 Payload being sent:", payload);

      const resp = await fetch("https://one23-u2ck.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("🌐 Response status:", resp.status, resp.statusText);

      const rawText = await resp.text();
      console.log("📥 Raw response text:", rawText);

      let data: any;
      try {
        data = JSON.parse(rawText);
        console.log("✅ Parsed JSON response:", data);
      } catch (e) {
        console.error("❌ Failed to parse JSON, returning raw text. Error:", e);
        data = { reply: rawText };
      }

      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I understand. Tell me more.",
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("🔥 Fetch failed with error:", err);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting to the AI right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      console.log("✅ Finished handleSendMessage cycle");
      setLocalLoading(false);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-800">
      {/* AI Response Card */}
      <div
        className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-[700px] p-6 rounded-2xl shadow-2xl break-words whitespace-pre-wrap transition-all duration-300"
        style={{
          background: "linear-gradient(to right, #f0f4ff, #dbeafe)",
          minHeight: "80px",
        }}
      >
        {messages.length > 0 ? (
          <p className="text-black text-base sm:text-lg">
            {(() => {
              const latestAI = messages
                .filter((m) => m.role === "assistant")
                .slice(-1)[0];
              return latestAI
                ? typingMessages[latestAI.id] || ""
                : "Hey! what is it that you exactly want to achieve in your social life or social skills?";
            })()}
          </p>
        ) : (
          <p>
            Hey! what is it that you exactly want to achieve in your social life
            or social skills?
          </p>
        )}
      </div>

      {/* Generate Plan Button */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
        <Button
          onClick={() => handleGeneratePlan(1)}
          disabled={isLoading || isGeneratingPlan}
          size="sm"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg"
        >
          ⚡ Generate Plan
        </Button>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-[700px] flex gap-2 items-center pointer-events-auto">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] resize-none bg-gray-800 text-white border-gray-700 rounded-xl p-2"
        />
        <Button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1"
        >
          ✉️
        </Button>
      </div>
    </div>
  );
}
