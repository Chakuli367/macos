import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, Lock, BookOpen, Zap, Star, Sparkles, X, ChevronRight } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import {  auth } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";

interface DayPlan {
  id: number;
  date?: string;
  title: string;
  status: "locked" | "unlocked" | "completed" | "current";
  tasks: string[];
  completedTasks: number;
  totalTasks: number;
  xpReward: number;
}

// Define the structure of a single Task object (from 01.tsx)
interface Task {
  task: string;
  done: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'default';
  timeSpent: number;
  notes: string;
  // Add any other properties your Task objects have
}

// Define the structure of a single Lesson/Day object (from 01.tsx)
interface Lesson {
  id: string;
  date: string;
  title: string;
  dayNumber: number;
  unlocked: boolean;
  motivationalQuote: string;
  summary: string;
  xpPerTask: number;
  tasks: Task[];
}

// Define the component's props
export interface TaskOverviewProps {
  dayData: Lesson | null; // Assuming dayData is a Lesson object or null if loading/not found
  // Add other props if the component takes any (e.g., loading status, handlers)
}

export default function DuolingoProgressMap() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  const getDayName = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  const openModal = (plan: DayPlan) => {
    setSelectedDay(plan);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDay(null);
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user.uid);
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!currentUser) return;

  const fetchTasks = async () => {
    try {
      // ============ LOOK SPECIFICALLY AT life_skills DOCUMENT ============
      const socialSkillsDocRef = doc(db, `users/${currentUser}/datedcourses/life_skills`);
      const socialSkillsDoc = await getDoc(socialSkillsDocRef);

      if (!socialSkillsDoc.exists()) {
        console.log("No life_skills document found");
        setLoading(false);
        return;
      }

      const courseData = socialSkillsDoc.data();
      console.log("📚 Course data:", courseData);

      // ============ READ FROM task_overview.days ============
      if (!courseData.task_overview || !courseData.task_overview.days) {
        console.log("No task_overview found");
        setLoading(false);
        return;
      }

      const days = courseData.task_overview.days;
      console.log("✅ Found", days.length, "days");
      // Calculate today's date for status determination
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Transform task_overview.days to DayPlan format
      const plans: DayPlan[] = days.map((day, index) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);

        // Extract task descriptions
        const tasksArray = day.tasks.map((t: any) => t.description || "");
        
        // Count completed tasks
        const completedTasksCount = day.tasks.filter((t: any) => t.done === true).length;
        const totalTasksCount = day.tasks.length;
        const isFullyCompleted = completedTasksCount === totalTasksCount;

        // Determine status based on date and completion
        let status: DayPlan["status"];
        
        if (isFullyCompleted) {
          status = "completed";
        } else if (dayDate.getTime() === today.getTime()) {
          status = "current";
        } else if (dayDate < today) {
          status = "unlocked"; // Past dates that aren't complete
        } else if (index === 0) {
          status = "unlocked"; // First day is always unlocked
        } else {
          // Check if previous day is complete
          const prevDay = days[index - 1];
          const prevDayComplete = prevDay.tasks.every((t: any) => t.done === true);
          status = prevDayComplete ? "unlocked" : "locked";
        }

        return {
          id: day.day,
          date: day.date,
          title: day.title,
          status,
          tasks: tasksArray,
          completedTasks: completedTasksCount,
          totalTasks: totalTasksCount,
          xpReward: 150 + (day.day - 1) * 25,
        };
      });

      console.log("📊 Transformed plans:", plans);
      setDayPlans(plans);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTasks();
}, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-purple-300 text-lg font-medium animate-pulse">Loading your journey map...</p>
        </div>
      </div>
    );
  }

  const totalXP = dayPlans.reduce((sum, plan) => 
    plan.status === "completed" ? sum + plan.xpReward : sum, 0
  );
  const totalTasks = dayPlans.reduce((sum, plan) => 
    plan.status === "completed" ? sum + plan.completedTasks : sum, 0
  );

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-6xl ml-0 mr-auto">
        
        {/* Header Section with Stats */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30 animate-fade-in">
            <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
            <span className="text-sm font-medium text-purple-200">Your Learning Journey</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent animate-fade-in-up">
            Preview Your Journey Timeline
          </h1>
          
          <p className="text-purple-300 text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Track your progress through each day's challenges and unlock new skills
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-16">
          {/* Curvy Vertical Line on Left */}
          <svg
            className="absolute left-0 top-0 h-full w-16 md:w-24"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            style={{ height: '100%' }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M 30 0 Q 50 100, 30 200 Q 10 300, 30 400 Q 50 500, 30 600 Q 10 700, 30 800 Q 50 900, 30 1000"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              className="animate-draw-path"
            />
          </svg>

          <div className="space-y-8 md:space-y-12">
            {dayPlans.map((plan, index) => {
              const progressPercent = plan.totalTasks
                ? (plan.completedTasks / plan.totalTasks) * 100
                : 0;
              const dayName = getDayName(plan.date);

              return (
                <div
                  key={plan.id}
                  className="flex flex-col md:flex-row items-start gap-4 md:gap-8 animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Timeline Node - Standalone on Mobile */}
                  <div className="relative z-10 flex items-center gap-3 -ml-8 md:-ml-16">
                    <div
                      className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 flex-shrink-0 ${
                        plan.status === "completed"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/50 animate-pulse-slow"
                          : plan.status === "current"
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50 animate-glow"
                          : plan.status === "unlocked"
                          ? "bg-gradient-to-br from-indigo-800 to-purple-800 border-indigo-500/50"
                          : "bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-700/30"
                      } ${hoveredCard === plan.id ? 'scale-110' : 'scale-100'}`}
                      onMouseEnter={() => setHoveredCard(plan.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {plan.status === "completed" && (
                        <CheckCircle className="w-7 h-7 md:w-10 md:h-10 text-white animate-check" />
                      )}
                      {plan.status === "current" && (
                        <Zap className="w-7 h-7 md:w-10 md:h-10 text-white animate-bounce" />
                      )}
                      {plan.status === "unlocked" && (
                        <Circle className="w-7 h-7 md:w-10 md:h-10 text-purple-300" />
                      )}
                      {plan.status === "locked" && (
                        <Lock className="w-7 h-7 md:w-10 md:h-10 text-purple-600" />
                      )}
                    </div>
                    
                    {/* Day info next to node on mobile */}
                    <div className="md:hidden">
                      <p className="text-purple-200 text-sm font-bold">
                        {dayName}
                      </p>
                      <p className="text-xs text-purple-400">Day {index + 1}</p>
                    </div>
                  </div>

                  {/* Card - Below node on mobile, beside on desktop */}
                  <div className="flex-1 min-w-0 w-full ml-6 md:ml-0">
                    {/* Day Label above card - Desktop only */}
                    <div className="hidden md:block mb-2">
                      <p className="text-purple-300 text-sm font-medium">
                        {dayName && <span className="font-bold text-purple-200">{dayName}</span>}
                        {dayName && " • "}
                        Day {index + 1} of {dayPlans.length}
                      </p>
                      <p className="text-xs text-purple-400">{plan.date}</p>
                    </div>

                    <div
                      className={`group bg-gradient-to-br backdrop-blur-md rounded-2xl border transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                        plan.status === "completed"
                          ? "from-green-900/40 to-emerald-900/40 border-green-500/40 hover:border-green-400/60 hover:shadow-xl hover:shadow-green-500/20"
                          : plan.status === "current"
                          ? "from-purple-900/60 to-pink-900/60 border-purple-500/50 hover:border-purple-400/70 hover:shadow-xl hover:shadow-purple-500/30 animate-pulse-border"
                          : plan.status === "unlocked"
                          ? "from-indigo-900/40 to-purple-900/40 border-indigo-500/30 hover:border-indigo-400/50"
                          : "from-purple-950/60 to-indigo-950/60 border-purple-700/20 opacity-75"
                      }`}
                      onClick={() => openModal(plan)}
                      onMouseEnter={() => setHoveredCard(plan.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Card Content - Horizontal Layout */}
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          {/* Left: Icon + Title */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                              plan.status === "completed"
                                ? "bg-green-500/20"
                                : plan.status === "current"
                                ? "bg-purple-500/20 group-hover:rotate-12"
                                : "bg-purple-800/20"
                            }`}>
                              <BookOpen className={`w-5 h-5 ${
                                plan.status === "completed"
                                  ? "text-green-400"
                                  : plan.status === "current"
                                  ? "text-purple-400"
                                  : "text-purple-600"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-sm leading-tight mb-1 truncate">
                                {plan.title}
                              </h3>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-purple-300">
                                  {plan.completedTasks}/{plan.totalTasks} tasks
                                </span>
                                <span className="text-purple-500">•</span>
                                <span className="text-yellow-400 flex items-center gap-1">
                                  <Star className="w-2 h-2" />
                                  {plan.xpReward}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right: Percentage + Arrow */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              plan.status === "completed"
                                ? "bg-green-500/20 text-green-300"
                                : plan.status === "current"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-purple-800/20 text-purple-400"
                            }`}>
                              {Math.round(progressPercent)}%
                            </div>
                            <ChevronRight className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 bg-purple-950/50 rounded-full overflow-hidden mt-3">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                              plan.status === "completed"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : plan.status === "current"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-shimmer"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        {/* Mobile date - shown below card */}
                        <p className="text-xs text-purple-400 mt-2 md:hidden">{plan.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal */}
      {modalOpen && selectedDay && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl border border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/30 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-purple-500/30 sticky top-0 bg-purple-900/95 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${
                      selectedDay.status === "completed"
                        ? "bg-green-500/20"
                        : selectedDay.status === "current"
                        ? "bg-purple-500/20"
                        : "bg-purple-800/20"
                    }`}>
                      <BookOpen className={`w-5 h-5 ${
                        selectedDay.status === "completed"
                          ? "text-green-400"
                          : selectedDay.status === "current"
                          ? "text-purple-400"
                          : "text-purple-600"
                      }`} />
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm">
                        {getDayName(selectedDay.date)} • Day {selectedDay.id}
                      </p>
                      <p className="text-xs text-purple-400">{selectedDay.date}</p>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedDay.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-purple-800/40 rounded-full text-purple-300">
                      {selectedDay.completedTasks}/{selectedDay.totalTasks} tasks
                    </span>
                    <span className="px-3 py-1 bg-yellow-900/40 rounded-full text-yellow-400 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {selectedDay.xpReward} XP
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      selectedDay.status === "completed"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : selectedDay.status === "current"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-purple-800/20 text-purple-400 border border-purple-700/30"
                    }`}>
                      {Math.round((selectedDay.completedTasks / selectedDay.totalTasks) * 100)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="flex-shrink-0 p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-purple-300" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable Tasks */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-3">
                {selectedDay.tasks.map((task, taskIndex) => {
                  const isCompleted = taskIndex < selectedDay.completedTasks;
                  
                  return (
                    <div
                      key={taskIndex}
                      className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 ${
                        selectedDay.status === "locked"
                          ? "bg-purple-900/20 opacity-50"
                          : "bg-purple-800/30 hover:bg-purple-800/50"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500"
                          : selectedDay.status === "locked"
                          ? "bg-purple-900/50 border-2 border-purple-700/30"
                          : "bg-purple-800/50 border-2 border-purple-600/50"
                      }`}>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <p className={`text-base flex-1 leading-relaxed ${
                        isCompleted
                          ? "text-purple-300 line-through opacity-75"
                          : selectedDay.status === "locked"
                          ? "text-purple-500"
                          : "text-purple-100"
                      }`}>
                        {task}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Status Info */}
              {selectedDay.status === "current" && (
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                  <p className="text-sm font-semibold text-purple-300 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Active Now - Keep Going!
                  </p>
                </div>
              )}
              {selectedDay.status === "locked" && (
                <div className="mt-6 p-4 bg-purple-900/30 border border-purple-700/30 rounded-xl text-center">
                  <p className="text-sm text-purple-400 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Complete previous days to unlock
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes draw-path {
          to { stroke-dashoffset: 0; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 40px rgba(236, 72, 153, 0.5); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes pulse-border {
          0%, 100% { border-color: rgba(139, 92, 246, 0.5); }
          50% { border-color: rgba(139, 92, 246, 0.8); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes check {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        .animate-draw-path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: draw-path 3s ease-in-out forwards;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }

        .animate-check {
          animation: check 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}