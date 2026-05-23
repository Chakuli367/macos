import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle, Circle, Lock, BookOpen, Zap, Star, Sparkles,
  X, ChevronRight, Plus, Trophy, Target, Edit3, Check, Flame
} from "lucide-react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Task {
  description: string;
  done: boolean;
  difficulty?: 'easy' | 'medium' | 'hard' | 'default';
  timeSpent?: number;
  notes?: string;
}

interface Achievement {
  text: string;
  earnedAt: string;
}

interface DayPlan {
  id: number;
  date?: string;
  title: string;
  status: "locked" | "unlocked" | "completed" | "current";
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  xpReward: number;
  achievements: Achievement[];
  goal: string;
}

export default function Profileplan() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [savingStates, setSavingStates] = useState<Record<number, boolean>>({});

  // Modal editing state
  const [newTaskText, setNewTaskText] = useState("");
  const [newAchievementText, setNewAchievementText] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const goalInputRef = useRef<HTMLInputElement>(null);

  const getDayName = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  const openModal = (plan: DayPlan) => {
    setSelectedDay({ ...plan });
    setNewTaskText("");
    setNewAchievementText("");
    setEditingGoal(false);
    setGoalDraft(plan.goal || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDay(null);
  };

  // ── Auth listener ──────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user.uid);
      else { setCurrentUser(null); setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  // ── Fetch from Firestore ──────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const fetchTasks = async () => {
      try {
        const docRef = doc(db, `users/${currentUser}/datedcourses/life_skills`);
        const snap = await getDoc(docRef);
        if (!snap.exists()) { setLoading(false); return; }

        const courseData = snap.data();
        if (!courseData.task_overview?.days) { setLoading(false); return; }

        const days = courseData.task_overview.days;
        const today = new Date(); today.setHours(0, 0, 0, 0);

        const plans: DayPlan[] = days.map((day: any, index: number) => {
          const dayDate = new Date(day.date); dayDate.setHours(0, 0, 0, 0);
          const completedTasksCount = day.tasks.filter((t: any) => t.done === true).length;
          const totalTasksCount = day.tasks.length;
          const isFullyCompleted = completedTasksCount === totalTasksCount && totalTasksCount > 0;

          let status: DayPlan["status"];
          if (isFullyCompleted) status = "completed";
          else if (dayDate.getTime() === today.getTime()) status = "current";
          else if (dayDate < today) status = "unlocked";
          else if (index === 0) status = "unlocked";
          else {
            const prevDay = days[index - 1];
            const prevDone = prevDay.tasks.every((t: any) => t.done === true);
            status = prevDone ? "unlocked" : "locked";
          }

          return {
            id: day.day,
            date: day.date,
            title: day.title,
            status,
            tasks: day.tasks as Task[],
            completedTasks: completedTasksCount,
            totalTasks: totalTasksCount,
            xpReward: 150 + (day.day - 1) * 25,
            achievements: day.achievements || [],
            goal: day.goal || "",
          };
        });

        setDayPlans(plans);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [currentUser]);

  // ── Persist a single day back to Firestore ─────────────────────
  const persistDay = async (updatedPlan: DayPlan) => {
    if (!currentUser) return;
    setSavingStates(s => ({ ...s, [updatedPlan.id]: true }));
    try {
      const docRef = doc(db, `users/${currentUser}/datedcourses/life_skills`);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return;
      const courseData = snap.data();
      const days = [...courseData.task_overview.days];
      const idx = days.findIndex((d: any) => d.day === updatedPlan.id);
      if (idx === -1) return;
      days[idx] = {
        ...days[idx],
        tasks: updatedPlan.tasks,
        achievements: updatedPlan.achievements,
        goal: updatedPlan.goal,
      };
      await updateDoc(docRef, { "task_overview.days": days });
    } catch (e) {
      console.error("Error saving:", e);
    } finally {
      setSavingStates(s => ({ ...s, [updatedPlan.id]: false }));
    }
  };

  // ── Sync selectedDay → dayPlans ────────────────────────────────
  const syncToList = (updated: DayPlan) => {
    const completedCount = updated.tasks.filter(t => t.done).length;
    const totalCount = updated.tasks.length;
    const isFullyCompleted = completedCount === totalCount && totalCount > 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dayDate = updated.date ? new Date(updated.date) : null;
    if (dayDate) dayDate.setHours(0, 0, 0, 0);

    let status: DayPlan["status"] = updated.status;
    if (isFullyCompleted) status = "completed";
    else if (dayDate && dayDate.getTime() === today.getTime()) status = "current";

    const synced = { ...updated, completedTasks: completedCount, totalTasks: totalCount, status };
    setDayPlans(prev => prev.map(d => d.id === synced.id ? synced : d));
    setSelectedDay(synced);
    return synced;
  };

  // ── Task toggle ────────────────────────────────────────────────
  const toggleTask = (taskIndex: number) => {
    if (!selectedDay) return;
    const updatedTasks = selectedDay.tasks.map((t, i) =>
      i === taskIndex ? { ...t, done: !t.done } : t
    );
    const updated = { ...selectedDay, tasks: updatedTasks };
    const synced = syncToList(updated);
    persistDay(synced);
  };

  // ── Add new task ───────────────────────────────────────────────
  const addTask = () => {
    if (!selectedDay || !newTaskText.trim()) return;
    const newTask: Task = { description: newTaskText.trim(), done: false };
    const updated = { ...selectedDay, tasks: [...selectedDay.tasks, newTask] };
    const synced = syncToList(updated);
    persistDay(synced);
    setNewTaskText("");
  };

  // ── Add achievement ────────────────────────────────────────────
  const addAchievement = () => {
    if (!selectedDay || !newAchievementText.trim()) return;
    const newAch: Achievement = {
      text: newAchievementText.trim(),
      earnedAt: new Date().toISOString(),
    };
    const updated = { ...selectedDay, achievements: [...(selectedDay.achievements || []), newAch] };
    const synced = syncToList(updated);
    persistDay(synced);
    setNewAchievementText("");
  };

  // ── Save goal ──────────────────────────────────────────────────
  const saveGoal = () => {
    if (!selectedDay) return;
    const updated = { ...selectedDay, goal: goalDraft };
    const synced = syncToList(updated);
    persistDay(synced);
    setEditingGoal(false);
  };

  // ── Remove achievement ─────────────────────────────────────────
  const removeAchievement = (achIndex: number) => {
    if (!selectedDay) return;
    const updated = {
      ...selectedDay,
      achievements: selectedDay.achievements.filter((_, i) => i !== achIndex),
    };
    const synced = syncToList(updated);
    persistDay(synced);
  };

  // ── Loading screen ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
          </div>
          <p className="text-purple-300 text-lg font-medium animate-pulse">Loading your journey map...</p>
        </div>
      </div>
    );
  }

  const totalXP = dayPlans.reduce((sum, p) => p.status === "completed" ? sum + p.xpReward : sum, 0);
  const totalCompleted = dayPlans.filter(p => p.status === "completed").length;

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-6xl ml-0 mr-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
            <span className="text-sm font-medium text-purple-200">Your Learning Journey</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Preview Your Journey Timeline
          </h1>
          <p className="text-purple-300 text-lg max-w-2xl mx-auto">
            Track progress, log achievements, and set daily goals
          </p>

          {/* XP & streak summary */}
          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-bold text-sm">{totalXP} XP earned</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full">
              <Flame className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-bold text-sm">{totalCompleted} days completed</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-16">
          <svg className="absolute left-0 top-0 h-full w-16 md:w-24" viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ height: '100%' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M 30 0 Q 50 100, 30 200 Q 10 300, 30 400 Q 50 500, 30 600 Q 10 700, 30 800 Q 50 900, 30 1000"
              fill="none" stroke="url(#lineGradient)" strokeWidth="3" className="animate-draw-path" />
          </svg>

          <div className="space-y-8 md:space-y-12">
            {dayPlans.map((plan, index) => {
              const progressPercent = plan.totalTasks ? (plan.completedTasks / plan.totalTasks) * 100 : 0;
              const dayName = getDayName(plan.date);
              const achievementCount = plan.achievements?.length || 0;

              return (
                <div key={plan.id}
                  className="flex flex-col md:flex-row items-start gap-4 md:gap-8 animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.15}s` }}>

                  {/* Node */}
                  <div className="relative z-10 flex items-center gap-3 -ml-8 md:-ml-16">
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 flex-shrink-0 ${
                      plan.status === "completed"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/50"
                        : plan.status === "current"
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50 animate-glow"
                        : plan.status === "unlocked"
                        ? "bg-gradient-to-br from-indigo-800 to-purple-800 border-indigo-500/50"
                        : "bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-700/30"
                    } ${hoveredCard === plan.id ? 'scale-110' : 'scale-100'}`}
                      onMouseEnter={() => setHoveredCard(plan.id)}
                      onMouseLeave={() => setHoveredCard(null)}>
                      {plan.status === "completed" && <CheckCircle className="w-7 h-7 md:w-10 md:h-10 text-white" />}
                      {plan.status === "current" && <Zap className="w-7 h-7 md:w-10 md:h-10 text-white animate-bounce" />}
                      {plan.status === "unlocked" && <Circle className="w-7 h-7 md:w-10 md:h-10 text-purple-300" />}
                      {plan.status === "locked" && <Lock className="w-7 h-7 md:w-10 md:h-10 text-purple-600" />}
                    </div>
                    <div className="md:hidden">
                      <p className="text-purple-200 text-sm font-bold">{dayName}</p>
                      <p className="text-xs text-purple-400">Day {index + 1}</p>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 min-w-0 w-full ml-6 md:ml-0">
                    <div className="hidden md:block mb-2">
                      <p className="text-purple-300 text-sm font-medium">
                        {dayName && <span className="font-bold text-purple-200">{dayName}</span>}
                        {dayName && " • "}
                        Day {index + 1} of {dayPlans.length}
                      </p>
                      <p className="text-xs text-purple-400">{plan.date}</p>
                    </div>

                    <div className={`group bg-gradient-to-br backdrop-blur-md rounded-2xl border transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                      plan.status === "completed"
                        ? "from-green-900/40 to-emerald-900/40 border-green-500/40 hover:border-green-400/60 hover:shadow-xl hover:shadow-green-500/20"
                        : plan.status === "current"
                        ? "from-purple-900/60 to-pink-900/60 border-purple-500/50 hover:border-purple-400/70 hover:shadow-xl hover:shadow-purple-500/30"
                        : plan.status === "unlocked"
                        ? "from-indigo-900/40 to-purple-900/40 border-indigo-500/30 hover:border-indigo-400/50"
                        : "from-purple-950/60 to-indigo-950/60 border-purple-700/20 opacity-75"
                    }`}
                      onClick={() => openModal(plan)}
                      onMouseEnter={() => setHoveredCard(plan.id)}
                      onMouseLeave={() => setHoveredCard(null)}>

                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              plan.status === "completed" ? "bg-green-500/20"
                              : plan.status === "current" ? "bg-purple-500/20"
                              : "bg-purple-800/20"}`}>
                              <BookOpen className={`w-5 h-5 ${
                                plan.status === "completed" ? "text-green-400"
                                : plan.status === "current" ? "text-purple-400"
                                : "text-purple-600"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-sm leading-tight mb-1 truncate">{plan.title}</h3>
                              <div className="flex items-center gap-2 text-xs flex-wrap">
                                <span className="text-purple-300">{plan.completedTasks}/{plan.totalTasks} tasks</span>
                                <span className="text-purple-500">•</span>
                                <span className="text-yellow-400 flex items-center gap-1">
                                  <Star className="w-2 h-2" />{plan.xpReward}
                                </span>
                                {achievementCount > 0 && (
                                  <>
                                    <span className="text-purple-500">•</span>
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <Trophy className="w-2 h-2" />{achievementCount}
                                    </span>
                                  </>
                                )}
                                {plan.goal && (
                                  <>
                                    <span className="text-purple-500">•</span>
                                    <span className="text-cyan-400 flex items-center gap-1">
                                      <Target className="w-2 h-2" /> goal set
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              plan.status === "completed" ? "bg-green-500/20 text-green-300"
                              : plan.status === "current" ? "bg-purple-500/20 text-purple-300"
                              : "bg-purple-800/20 text-purple-400"}`}>
                              {Math.round(progressPercent)}%
                            </div>
                            <ChevronRight className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 bg-purple-950/50 rounded-full overflow-hidden mt-3">
                          <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                            plan.status === "completed" ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : plan.status === "current" ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}
                            style={{ width: `${progressPercent}%` }} />
                        </div>

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

      {/* ── MODAL ──────────────────────────────────────────────── */}
      {modalOpen && selectedDay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}>
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-2xl border border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/30 animate-scale-in"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="p-6 border-b border-purple-500/30 sticky top-0 bg-purple-900/95 backdrop-blur-md z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${
                      selectedDay.status === "completed" ? "bg-green-500/20"
                      : selectedDay.status === "current" ? "bg-purple-500/20"
                      : "bg-purple-800/20"}`}>
                      <BookOpen className={`w-5 h-5 ${
                        selectedDay.status === "completed" ? "text-green-400"
                        : selectedDay.status === "current" ? "text-purple-400"
                        : "text-purple-600"}`} />
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm">{getDayName(selectedDay.date)} • Day {selectedDay.id}</p>
                      <p className="text-xs text-purple-400">{selectedDay.date}</p>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedDay.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-purple-800/40 rounded-full text-purple-300">
                      {selectedDay.completedTasks}/{selectedDay.totalTasks} tasks
                    </span>
                    <span className="px-3 py-1 bg-yellow-900/40 rounded-full text-yellow-400 flex items-center gap-1">
                      <Star className="w-4 h-4" />{selectedDay.xpReward} XP
                    </span>
                    {savingStates[selectedDay.id] && (
                      <span className="px-3 py-1 bg-indigo-900/40 rounded-full text-indigo-300 text-xs animate-pulse">saving…</span>
                    )}
                  </div>
                </div>
                <button onClick={closeModal} className="flex-shrink-0 p-2 hover:bg-purple-800/50 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-purple-300" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">

              {/* ── GOAL SECTION ── */}
              <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Day Goal
                  </h3>
                  {!editingGoal && (
                    <button onClick={() => { setEditingGoal(true); setGoalDraft(selectedDay.goal || ""); setTimeout(() => goalInputRef.current?.focus(), 50); }}
                      className="text-xs text-cyan-400 hover:text-cyan-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-cyan-900/30 transition-colors">
                      <Edit3 className="w-3 h-3" /> {selectedDay.goal ? "Edit" : "Set goal"}
                    </button>
                  )}
                </div>
                {editingGoal ? (
                  <div className="flex gap-2">
                    <input ref={goalInputRef} type="text" value={goalDraft} onChange={e => setGoalDraft(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveGoal()}
                      placeholder="What do you want to achieve today?"
                      className="flex-1 bg-cyan-900/30 border border-cyan-500/40 rounded-lg px-3 py-2 text-sm text-white placeholder-cyan-700 outline-none focus:border-cyan-400" />
                    <button onClick={saveGoal} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors">
                      <Check className="w-4 h-4 text-white" />
                    </button>
                    <button onClick={() => setEditingGoal(false)} className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-purple-300" />
                    </button>
                  </div>
                ) : (
                  <p className={`text-sm ${selectedDay.goal ? "text-white" : "text-cyan-700 italic"}`}>
                    {selectedDay.goal || "No goal set yet — tap Set goal to add one"}
                  </p>
                )}
              </div>

              {/* ── TASKS SECTION ── */}
              <div>
                <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Tasks
                </h3>
                <div className="space-y-2">
                  {selectedDay.tasks.map((task, taskIndex) => (
                    <div key={taskIndex}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group ${
                        selectedDay.status === "locked" ? "bg-purple-900/20 opacity-50" : "bg-purple-800/30 hover:bg-purple-800/50"}`}>
                      {/* Checkbox */}
                      <button
                        disabled={selectedDay.status === "locked"}
                        onClick={() => toggleTask(taskIndex)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                          task.done
                            ? "bg-green-500 border-green-500"
                            : selectedDay.status === "locked"
                            ? "bg-purple-900/50 border-purple-700/30"
                            : "bg-transparent border-purple-500/60 hover:border-purple-400 hover:scale-110"}`}>
                        {task.done && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <p className={`text-sm flex-1 leading-relaxed pt-0.5 ${
                        task.done ? "text-purple-400 line-through" : "text-purple-100"}`}>
                        {task.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Task */}
                {selectedDay.status !== "locked" && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTask()}
                      placeholder="Add a new task…"
                      className="flex-1 bg-purple-900/40 border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-600 outline-none focus:border-purple-400 transition-colors" />
                    <button onClick={addTask}
                      className="p-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors flex items-center gap-1">
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── ACHIEVEMENTS SECTION ── */}
              <div>
                <h3 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Achievements
                </h3>

                {selectedDay.achievements && selectedDay.achievements.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {selectedDay.achievements.map((ach, achIndex) => (
                      <div key={achIndex}
                        className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-500/20 rounded-xl group">
                        <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-amber-100">{ach.text}</p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            {new Date(ach.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <button onClick={() => removeAchievement(achIndex)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-amber-900/40 rounded-lg transition-all">
                          <X className="w-3 h-3 text-amber-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-700 italic mb-3">No achievements logged yet</p>
                )}

                {/* Add Achievement */}
                {selectedDay.status !== "locked" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAchievementText}
                      onChange={e => setNewAchievementText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addAchievement()}
                      placeholder="Log something you achieved today…"
                      className="flex-1 bg-amber-900/20 border border-amber-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-amber-800 outline-none focus:border-amber-500 transition-colors" />
                    <button onClick={addAchievement}
                      className="p-2.5 bg-amber-700 hover:bg-amber-600 rounded-xl transition-colors">
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Status banners */}
              {selectedDay.status === "current" && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                  <p className="text-sm font-semibold text-purple-300 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" /> Active Now — Keep Going!
                  </p>
                </div>
              )}
              {selectedDay.status === "locked" && (
                <div className="p-4 bg-purple-900/30 border border-purple-700/30 rounded-xl text-center">
                  <p className="text-sm text-purple-400 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Complete previous days to unlock
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-in-left { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scale-in { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes draw-path { to{stroke-dashoffset:0} }
        @keyframes glow {
          0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.5)}
          50%{box-shadow:0 0 30px rgba(139,92,246,0.8),0 0 40px rgba(236,72,153,0.5)}
        }
        .animate-fade-in{animation:fade-in 0.3s ease-out forwards}
        .animate-slide-in-left{animation:slide-in-left 0.8s ease-out forwards;opacity:0}
        .animate-scale-in{animation:scale-in 0.3s ease-out forwards}
        .animate-draw-path{stroke-dasharray:2000;stroke-dashoffset:2000;animation:draw-path 3s ease-in-out forwards}
        .animate-glow{animation:glow 2s ease-in-out infinite}
      `}</style>
    </div>
  );
}