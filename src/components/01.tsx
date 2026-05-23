import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import {
  Trophy, Flame, Sparkles, RefreshCw, Check, ChevronLeft, ChevronRight,
  Zap, Target, Award, Clock, TrendingUp, Lock, CheckCircle2,
  AlertCircle, Lightbulb, RotateCcw, Play, Pause, Heart, MessageCircle,
  Calendar, X, Plus, Edit3, Trash2, AlarmClock, Save, Pencil,
  GripVertical, CheckSquare, Timer, MapPin, Loader2
} from "lucide-react";
import Confetti from "react-confetti";
import { apiKeys } from 'src/backend/keys/apiKeys';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getApiKeys } from 'src/backend/apikeys';

const BACKEND = "https://pythonbackend-j1yp.onrender.com";

// ============ FIREBASE CONFIG ============
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ============ TYPES ============
type Difficulty = 'easy' | 'medium' | 'hard' | 'default';
type ComfortLevel = 'easy' | 'moderate' | 'challenging';

interface Task {
  task: string;
  done: boolean;
  difficulty: Difficulty;
  timeSpent: number;
  notes: string;
  scheduled_time?: string;
  scheduled_date?: string;
  location?: string;
  estimatedTime?: string;
  comfortLevel?: ComfortLevel;
  id?: string;
  is_custom?: boolean;
}

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

interface FirestoreLesson {
  title?: string;
  quote?: string;
  motivation?: string;
  summary?: string;
  tasks: Record<string, any> | Task[] | undefined;
}

interface LessonsByDate {
  [date: string]: FirestoreLesson;
}

// ============ HELPERS ============
const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return 'from-emerald-500 to-teal-500';
    case 'medium': return 'from-amber-500 to-orange-500';
    case 'hard': return 'from-rose-500 to-pink-600';
    default: return 'from-violet-500 to-purple-600';
  }
};

const getDifficultyXPMultiplier = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return 1;
    case 'medium': return 1.5;
    case 'hard': return 2;
    default: return 1;
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const determineDifficulty = (taskText: string): Difficulty => {
  const lowerTask = taskText.toLowerCase();
  if (lowerTask.includes('review') || lowerTask.includes('reflect') || lowerTask.includes('schedule') || lowerTask.includes('take a few minutes')) return 'easy';
  if (lowerTask.includes('practice') || lowerTask.includes('connect') || lowerTask.includes('reach out') || lowerTask.includes('write')) return 'medium';
  return 'hard';
};

const determineDifficultyFromDay = (dayNumber: number): Difficulty => {
  if (dayNumber === 1) return 'easy';
  if (dayNumber <= 3) return 'medium';
  return 'hard';
};

// ============ API CALLS ============
const callTaskAPI = async (endpoint: string, body: object) => {
  const res = await fetch(`${BACKEND}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
};

// ============ TOAST ============
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-bold text-white max-w-xs w-full
      ${type === 'success' ? 'bg-emerald-900/80 border-emerald-400/50 shadow-emerald-500/30' :
        type === 'error' ? 'bg-rose-900/80 border-rose-400/50 shadow-rose-500/30' :
        'bg-purple-900/80 border-purple-400/50 shadow-purple-500/30'}`}
  >
    {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />}
    {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />}
    {type === 'info' && <Sparkles className="w-4 h-4 text-purple-300 flex-shrink-0" />}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
  </motion.div>
);

// ============ ADD TASK MODAL ============
const AddTaskModal = ({ dayNumber, userId, onClose, onAdded }: {
  dayNumber: number;
  userId: string;
  onClose: () => void;
  onAdded: (task: any) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [comfortLevel, setComfortLevel] = useState<ComfortLevel>('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await callTaskAPI('/tasks/add', {
        user_id: userId,
        day: dayNumber,
        title: title.trim(),
        description: description.trim(),
        scheduled_time: scheduledTime,
        scheduled_date: scheduledDate,
        location: location.trim(),
        estimatedTime: estimatedTime.trim(),
        comfortLevel,
        xp: 30
      });
      onAdded(data.new_task);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/40 rounded-3xl p-5 w-full max-w-md shadow-2xl shadow-purple-900/50 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Add New Task</h3>
              <p className="text-purple-400 text-[10px]">Day {dayNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-purple-900/60 border border-purple-500/30 flex items-center justify-center hover:bg-purple-800/60 transition-colors">
            <X className="w-3.5 h-3.5 text-purple-300" />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Title */}
          <div>
            <label className="text-purple-300 text-xs font-bold mb-1.5 block">Task Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Practice at the coffee shop"
              className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-purple-300 text-xs font-bold mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What do you need to do?"
              rows={2}
              className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 transition-all resize-none"
            />
          </div>

          {/* Time & Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-purple-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <AlarmClock className="w-3 h-3" /> Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-violet-400 transition-all"
              />
            </div>
            <div>
              <label className="text-purple-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-violet-400 transition-all"
              />
            </div>
          </div>

          {/* Location & Duration row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-purple-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Starbucks"
                className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-white text-xs placeholder-purple-500 focus:outline-none focus:border-violet-400 transition-all"
              />
            </div>
            <div>
              <label className="text-purple-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <Timer className="w-3 h-3" /> Est. Time
              </label>
              <input
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value)}
                placeholder="e.g. 20 min"
                className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-white text-xs placeholder-purple-500 focus:outline-none focus:border-violet-400 transition-all"
              />
            </div>
          </div>

          {/* Comfort Level */}
          <div>
            <label className="text-purple-300 text-xs font-bold mb-2 block">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'moderate', 'challenging'] as ComfortLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setComfortLevel(level)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all capitalize
                    ${comfortLevel === level
                      ? level === 'easy' ? 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200 shadow-lg shadow-emerald-500/20'
                      : level === 'moderate' ? 'bg-amber-500/30 border-amber-400/60 text-amber-200 shadow-lg shadow-amber-500/20'
                      : 'bg-rose-500/30 border-rose-400/60 text-rose-200 shadow-lg shadow-rose-500/20'
                      : 'bg-purple-950/50 border-purple-500/20 text-purple-400 hover:border-purple-400/40'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-900/30 border border-rose-500/30 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <p className="text-rose-300 text-xs">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-bold hover:bg-purple-900/60 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white text-sm font-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============ EDIT TASK MODAL ============
const EditTaskModal = ({ task, taskId, userId, onClose, onSaved }: {
  task: Task;
  taskId: string;
  userId: string;
  onClose: () => void;
  onSaved: (updates: Partial<Task>) => void;
}) => {
  const [title, setTitle] = useState(task.task);
  const [scheduledTime, setScheduledTime] = useState(task.scheduled_time || '');
  const [scheduledDate, setScheduledDate] = useState(task.scheduled_date || '');
  const [location, setLocation] = useState(task.location || '');
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime || '');
  const [comfortLevel, setComfortLevel] = useState<ComfortLevel>((task.comfortLevel as ComfortLevel) || 'moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      const updates: any = {
        title: title.trim(),
        comfortLevel,
      };
      if (scheduledTime) updates.scheduled_time = scheduledTime;
      if (scheduledDate) updates.scheduled_date = scheduledDate;
      if (location.trim()) updates.location = location.trim();
      if (estimatedTime.trim()) updates.estimatedTime = estimatedTime.trim();

      await callTaskAPI('/tasks/edit', { user_id: userId, task_id: taskId, updates });
      onSaved({ ...updates, task: updates.title });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 w-full max-w-md shadow-2xl shadow-indigo-900/50 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Edit Task</h3>
              <p className="text-indigo-400 text-[10px]">Update your task details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-800/60 transition-colors">
            <X className="w-3.5 h-3.5 text-indigo-300" />
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="text-indigo-300 text-xs font-bold mb-1.5 block">Task Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-white text-sm placeholder-indigo-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-indigo-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <AlarmClock className="w-3 h-3" /> Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="text-indigo-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-indigo-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Starbucks"
                className="w-full px-3 py-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-white text-xs placeholder-indigo-500 focus:outline-none focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="text-indigo-300 text-xs font-bold mb-1.5 block flex items-center gap-1">
                <Timer className="w-3 h-3" /> Est. Time
              </label>
              <input
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value)}
                placeholder="e.g. 20 min"
                className="w-full px-3 py-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-white text-xs placeholder-indigo-500 focus:outline-none focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-indigo-300 text-xs font-bold mb-2 block">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'moderate', 'challenging'] as ComfortLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setComfortLevel(level)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all capitalize
                    ${comfortLevel === level
                      ? level === 'easy' ? 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200'
                      : level === 'moderate' ? 'bg-amber-500/30 border-amber-400/60 text-amber-200'
                      : 'bg-rose-500/30 border-rose-400/60 text-rose-200'
                      : 'bg-indigo-950/50 border-indigo-500/20 text-indigo-400 hover:border-indigo-400/40'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-900/30 border border-rose-500/30 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <p className="text-rose-300 text-xs">{error}</p>
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-bold hover:bg-indigo-900/60 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl text-white text-sm font-black shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============ SCHEDULE QUICK MODAL ============
const ScheduleModal = ({ task, taskId, userId, onClose, onScheduled }: {
  task: Task;
  taskId: string;
  userId: string;
  onClose: () => void;
  onScheduled: (time: string, date: string) => void;
}) => {
  const [scheduledTime, setScheduledTime] = useState(task.scheduled_time || '');
  const [scheduledDate, setScheduledDate] = useState(task.scheduled_date || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickTimes = ['07:00', '09:00', '12:00', '15:00', '18:00', '20:00'];

  const handleSchedule = async () => {
    if (!scheduledTime) { setError('Please select a time'); return; }
    setLoading(true);
    setError('');
    try {
      await callTaskAPI('/tasks/schedule', {
        user_id: userId,
        task_id: taskId,
        scheduled_time: scheduledTime,
        ...(scheduledDate && { scheduled_date: scheduledDate })
      });
      onScheduled(scheduledTime, scheduledDate);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-500/40 rounded-3xl p-5 w-full max-w-sm shadow-2xl shadow-teal-900/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/40">
              <AlarmClock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Schedule Task</h3>
              <p className="text-teal-400 text-[10px] max-w-[150px] truncate">{task.task}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-teal-900/60 border border-teal-500/30 flex items-center justify-center hover:bg-teal-800/60 transition-colors">
            <X className="w-3.5 h-3.5 text-teal-300" />
          </button>
        </div>

        {/* Quick time picks */}
        <div className="mb-4">
          <p className="text-teal-300 text-xs font-bold mb-2">Quick Pick</p>
          <div className="grid grid-cols-3 gap-2">
            {quickTimes.map(t => (
              <button
                key={t}
                onClick={() => setScheduledTime(t)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all
                  ${scheduledTime === t
                    ? 'bg-teal-500/30 border-teal-400/60 text-teal-200 shadow-lg shadow-teal-500/20'
                    : 'bg-teal-950/50 border-teal-500/20 text-teal-400 hover:border-teal-400/40'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-teal-300 text-xs font-bold mb-1.5 block">Custom Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-teal-950/60 border border-teal-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
          <div>
            <label className="text-teal-300 text-xs font-bold mb-1.5 block">Date (opt.)</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-teal-950/60 border border-teal-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-900/30 border border-rose-500/30 rounded-xl mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <p className="text-rose-300 text-xs">{error}</p>
          </div>
        )}

        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-teal-950/60 border border-teal-500/30 rounded-xl text-teal-300 text-sm font-bold hover:bg-teal-900/60 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl text-white text-sm font-black shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlarmClock className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Set Time'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============ DELETE CONFIRM ============
const DeleteConfirm = ({ taskTitle, isCustom, onConfirm, onCancel, loading }: {
  taskTitle: string;
  isCustom: boolean;
  onConfirm: (force: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border border-rose-500/40 rounded-3xl p-5 w-full max-w-sm shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-base font-black text-white mb-1">Delete Task?</h3>
        <p className="text-rose-200/70 text-xs leading-relaxed">
          "<span className="text-white font-semibold">{taskTitle}</span>"
          {!isCustom && <><br /><span className="text-amber-300 font-bold">⚠ This is an AI-generated task</span></>}
        </p>
      </div>
      <div className="flex gap-2.5">
        <button onClick={onCancel} className="flex-1 py-2.5 bg-rose-950/60 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-bold hover:bg-rose-900/60 transition-all">
          Cancel
        </button>
        <button
          onClick={() => onConfirm(!isCustom)}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl text-white text-sm font-black shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ============ ONBOARDING ============
const OnboardingScreen = ({ onDismiss }) => (
  <div className="relative h-full bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 flex items-center justify-center p-3 overflow-hidden rounded-2xl">
    <div className="max-w-sm w-full relative z-10">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <motion.div animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </motion.div>
        </div>
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-2xl font-black mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent leading-tight">
          Welcome! 👋
        </motion.h1>
        <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-purple-200 mb-1 font-medium leading-relaxed">
          This is where you start your day
        </motion.p>
      </motion.div>
      <motion.button initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={onDismiss} className="relative w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl font-black text-white text-lg shadow-xl shadow-purple-500/60 transition-all border-2 border-purple-400/50 overflow-hidden group">
        <span className="relative z-10 flex items-center justify-center gap-2">Let's Go! 🚀</span>
      </motion.button>
    </div>
  </div>
);

// ============ MAIN COMPONENT ============
export default function TodayActionCard() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [openRegenDialog, setOpenRegenDialog] = useState(false);
  const [regenInstructions, setRegenInstructions] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);
  const [loadingLiveSupport, setLoadingLiveSupport] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [expandedTaskNote, setExpandedTaskNote] = useState(null);
  const [taskNotes, setTaskNotes] = useState({});
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dayTasks, setDayTasks] = useState<Lesson[]>([]);
  const [nextActionTime, setNextActionTime] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firestoreDocId, setFirestoreDocId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // ── New modal states ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<{ task: Task; taskId: string } | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<{ task: Task; taskId: string; taskIndex: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ task: Task; taskId: string; taskIndex: number } | null>(null);
  const [deletingTask, setDeletingTask] = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Task action mode: 'view' | 'manage' ──
  const [taskMode, setTaskMode] = useState<'view' | 'manage'>('view');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { setUserId(user.uid); }
      else { setUserId(null); setError("Please log in to view your tasks"); setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchTasksFromFirestore = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, `users/${userId}/datedcourses`, 'life_skills');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) { setError("No life_skills course found."); setLoading(false); return; }
        const data = docSnap.data();
        setFirestoreDocId('life_skills');
        if (!data.task_overview || !data.task_overview.days) { setError("No task_overview found."); setLoading(false); return; }
        const transformedTasks = transformTaskOverview(data.task_overview.days);
        setDayTasks(transformedTasks);
        const today = new Date().toISOString().split("T")[0];
        const todayIndex = transformedTasks.findIndex(day => day.date === today);
        setCurrentDayIndex(todayIndex >= 0 ? todayIndex : transformedTasks.reduce((lastIdx, day, idx) => day.unlocked ? idx : lastIdx, 0));
        setLoading(false);
      } catch (err) { setError(`Error loading tasks: ${err.message}`); setLoading(false); }
    };
    fetchTasksFromFirestore();
  }, [userId]);

  useEffect(() => {
    const hasSeenThisSession = sessionStorage.getItem('hasSeenOnboarding');
    if (!hasSeenThisSession && dayTasks.length > 0) setTimeout(() => setShowOnboarding(true), 2000);
  }, [dayTasks]);

  const handleDismissOnboarding = () => { sessionStorage.setItem('hasSeenOnboarding', 'true'); setShowOnboarding(false); };

  const transformTaskOverview = (days: any[]): Lesson[] => {
    return days.map((day: any, index: number): Lesson => {
      const prevDayComplete = index === 0 || days[index - 1].tasks.every(t => t.done === true);
      const tasksArray = day.tasks.map((task: any): Task => ({
        task: task.description || task.task || '',
        done: task.done || false,
        difficulty: determineDifficultyFromDay(day.day),
        timeSpent: task.timeSpent || 0,
        notes: task.notes || '',
        scheduled_time: task.scheduled_time || '',
        scheduled_date: task.scheduled_date || '',
        location: task.location || '',
        estimatedTime: task.estimatedTime || '',
        comfortLevel: task.comfortLevel || 'moderate',
        id: task.id || `day${day.day}_task_${index}`,
        is_custom: task.is_custom || false,
      }));
      return { id: `day${day.day}`, date: day.date, title: day.title, dayNumber: day.day, unlocked: prevDayComplete, motivationalQuote: `Day ${day.day} - ${day.title}`, summary: day.summary, xpPerTask: 20, tasks: tasksArray };
    });
  };

  const updateFirestore = async (updatedDayTasks: Lesson[]) => {
    if (!userId || !firestoreDocId) return;
    try {
      const docRef = doc(db, `users/${userId}/datedcourses`, firestoreDocId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      if (data.task_overview && data.task_overview.days) {
        const updatedOverview = {
          ...data.task_overview,
          days: data.task_overview.days.map((day, dayIdx) => {
            const matchingDay = updatedDayTasks.find(d => d.date === day.date);
            if (!matchingDay) return day;
            return { ...day, tasks: day.tasks.map((task, taskIdx) => ({ ...task, done: matchingDay.tasks[taskIdx]?.done || false, timeSpent: matchingDay.tasks[taskIdx]?.timeSpent || 0, notes: matchingDay.tasks[taskIdx]?.notes || '' })) };
          })
        };
        await updateDoc(docRef, { task_overview: updatedOverview });
      }
    } catch (err) { console.error("Error updating Firestore:", err); throw err; }
  };

  useEffect(() => {
    let interval;
    if (activeTimer !== null) { interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000); }
    return () => { if (interval) clearInterval(interval); };
  }, [activeTimer]);

  useEffect(() => {
    if (!nextActionTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((nextActionTime - now) / 1000);
      setCountdownSeconds(Math.max(0, diff));
      if (diff <= 0) { const nextTime = new Date(); nextTime.setMinutes(nextTime.getMinutes() + 45); setNextActionTime(nextTime); }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextActionTime]);

  const currentDay = dayTasks[currentDayIndex] || { tasks: [], date: new Date().toISOString(), xpPerTask: 0, dayNumber: 1, title: "Loading...", unlocked: false, motivationalQuote: "", summary: "" };
  const completedTasks = currentDay.tasks ? currentDay.tasks.filter(t => t.done).length : 0;
  const totalTasks = currentDay.tasks ? currentDay.tasks.length : 0;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isAllCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const canAccessDay = currentDay.unlocked;

  const stats = useMemo(() => {
    let totalXP = 0, totalDaysCompleted = 0, totalTimeSpent = 0, currentStreak = 0, taskCount = 0;
    const sortedDays = [...dayTasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const today = new Date().setHours(0, 0, 0, 0);
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      const day = sortedDays[i];
      const dayDate = new Date(day.date).setHours(0, 0, 0, 0);
      if (dayDate > today) continue;
      const isDayComplete = day.tasks.filter(t => t.done).length === day.tasks.length && day.tasks.length > 0;
      const expectedDate = today - (currentStreak * 86400000);
      if (dayDate === expectedDate && isDayComplete) currentStreak++;
      else if (currentStreak > 0) break;
    }
    for (const day of sortedDays) {
      if (day.tasks.filter(t => t.done).length === day.tasks.length && day.tasks.length > 0) totalDaysCompleted++;
      day.tasks.forEach(task => { if (task.done) { totalXP += day.xpPerTask * getDifficultyXPMultiplier(task.difficulty); taskCount++; if (task.timeSpent) totalTimeSpent += task.timeSpent; } });
    }
    return { totalXP, totalDaysCompleted, currentStreak, averageTaskTime: taskCount > 0 ? Math.round(totalTimeSpent / taskCount) : 0, totalTimeSpent };
  }, [dayTasks]);

  const handleTaskToggle = async (dayDate: string, taskIndex: number) => {
    if (!userId || !firestoreDocId) return;
    const currentDayObj = dayTasks.find(d => d.date === dayDate);
    if (!currentDayObj || !currentDayObj.tasks || taskIndex == null) return;
    const task = currentDayObj.tasks[taskIndex];
    const newDoneStatus = !task.done;
    const updatedDayTasks = dayTasks.map(day => {
      if (day.date !== dayDate) return day;
      const newTasks = [...day.tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], done: newDoneStatus };
      return { ...day, tasks: newTasks };
    });
    setDayTasks(updatedDayTasks);
    if (activeTimer === taskIndex) { setActiveTimer(null); setTimerSeconds(0); }
    try {
      await updateFirestore(updatedDayTasks);
      if (newDoneStatus && completedTasks + 1 === totalTasks) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
        const currentIdx = updatedDayTasks.findIndex(d => d.date === dayDate);
        const nextDayIndex = currentIdx + 1;
        if (nextDayIndex < updatedDayTasks.length) {
          setDayTasks(updatedDayTasks.map((day, idx) => idx === nextDayIndex ? { ...day, unlocked: true } : day));
        }
      }
    } catch (err) { setDayTasks(dayTasks); }
  };

  const handleDayChange = (index: number) => {
    if (index < 0 || index >= dayTasks.length) return;
    if (!dayTasks[index].unlocked) return;
    setCurrentTaskIndex(0);
    setCurrentDayIndex(index);
    setTaskMode('view');
  };

  const handleGetLiveSupport = async (taskObj: Task, taskIndex: number) => {
    setLoadingLiveSupport(true);
    const apiKeysArr = await getApiKeys();
    if (!apiKeysArr || apiKeysArr.length === 0) { alert('No API keys available.'); setLoadingLiveSupport(false); return; }
    for (let i = 0; i < apiKeysArr.length; i++) {
      const apiKey = apiKeysArr[i];
      try {
        const response = await fetch(`${BACKEND}/live-action-support`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({ task_name: taskObj.task, user_id: userId, category: "General life", difficulty: taskObj.difficulty || "Medium", user_context: { anxiety_level: "moderate", experience: "beginner", specific_challenges: [] } })
        });
        const data = await response.json();
        if (!response.ok) continue;
        if (data.success && data.task) { window.location.href = `/connections?task=${encodeURIComponent(JSON.stringify(data.task))}`; setLoadingLiveSupport(false); return; }
      } catch (error) { console.warn(`API key ${i + 1} request failed:`, error); }
    }
    alert('All API keys failed. Please try again later.');
    setLoadingLiveSupport(false);
  };

  const handleStartTimer = async (taskIndex: number) => {
    if (activeTimer === taskIndex) {
      const timeToSave = timerSeconds;
      const updatedDayTasks = dayTasks.map((day, idx) => {
        if (idx !== currentDayIndex) return day;
        const newTasks = [...day.tasks];
        newTasks[taskIndex] = { ...newTasks[taskIndex], timeSpent: (newTasks[taskIndex].timeSpent || 0) + timeToSave };
        return { ...day, tasks: newTasks };
      });
      setDayTasks(updatedDayTasks);
      try { await updateFirestore(updatedDayTasks); } catch (err) { console.error("Error saving timer:", err); }
      setActiveTimer(null); setTimerSeconds(0);
    } else {
      setActiveTimer(taskIndex);
      setTimerSeconds(dayTasks[currentDayIndex].tasks[taskIndex].timeSpent || 0);
    }
  };

  const handleResetDay = async () => {
    if (!userId || !firestoreDocId) return;
    if (!confirm(`Reset all tasks for "${currentDay.title}"?`)) return;
    const updatedDayTasks = dayTasks.map((day, idx) => {
      if (idx !== currentDayIndex) return day;
      return { ...day, tasks: day.tasks.map(t => ({ ...t, done: false, timeSpent: 0, notes: '' })) };
    });
    setDayTasks(updatedDayTasks);
    setActiveTimer(null); setTimerSeconds(0); setTaskNotes({});
    try { await updateFirestore(updatedDayTasks); } catch (err) { console.error("Error resetting day:", err); }
  };

  const handleAddNote = async (taskIndex: number) => {
    if (!userId || !firestoreDocId) return;
    const note = taskNotes[taskIndex] || '';
    const updatedDayTasks = dayTasks.map((day, idx) => {
      if (idx !== currentDayIndex) return day;
      const newTasks = [...day.tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], notes: note };
      return { ...day, tasks: newTasks };
    });
    setDayTasks(updatedDayTasks);
    try { await updateFirestore(updatedDayTasks); } catch (err) { console.error("Error updating note:", err); }
    setExpandedTaskNote(null);
    setTaskNotes(prev => { const n = { ...prev }; delete n[taskIndex]; return n; });
  };

  // ── NEW: Handle task added from modal ──
  const handleTaskAdded = (newTask: any) => {
    setShowAddModal(false);
    // Refresh from backend
    const refreshTasks = async () => {
      try {
        const data = await callTaskAPI('/tasks/get', { user_id: userId });
        if (data.days) {
          const transformed = transformTaskOverview(data.days);
          setDayTasks(transformed);
        }
      } catch (e) { console.error(e); }
    };
    refreshTasks();
    showToast('Task added successfully! 🎉', 'success');
  };

  // ── NEW: Handle task edited ──
  const handleTaskEdited = (updates: Partial<Task>) => {
    if (!showEditModal) return;
    const taskId = showEditModal.taskId;
    setDayTasks(prev => prev.map((day, dIdx) => {
      if (dIdx !== currentDayIndex) return day;
      return { ...day, tasks: day.tasks.map(t => t.id === taskId ? { ...t, ...updates, task: updates.title || t.task } : t) };
    }));
    setShowEditModal(null);
    showToast('Task updated! ✏️', 'success');
  };

  // ── NEW: Handle task scheduled ──
  const handleTaskScheduled = (time: string, date: string) => {
    if (!showScheduleModal) return;
    const { taskId, taskIndex } = showScheduleModal;
    setDayTasks(prev => prev.map((day, dIdx) => {
      if (dIdx !== currentDayIndex) return day;
      const newTasks = [...day.tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], scheduled_time: time, scheduled_date: date };
      return { ...day, tasks: newTasks };
    }));
    setShowScheduleModal(null);
    showToast(`Scheduled for ${time}${date ? ' on ' + date : ''}! ⏰`, 'success');
  };

  // ── NEW: Handle task deleted ──
  const handleTaskDelete = async (force: boolean) => {
    if (!showDeleteConfirm || !userId) return;
    const { taskId, taskIndex } = showDeleteConfirm;
    setDeletingTask(true);
    try {
      await callTaskAPI('/tasks/delete', { user_id: userId, task_id: taskId, force });
      setDayTasks(prev => prev.map((day, dIdx) => {
        if (dIdx !== currentDayIndex) return day;
        const newTasks = day.tasks.filter((_, tIdx) => tIdx !== taskIndex);
        return { ...day, tasks: newTasks };
      }));
      if (currentTaskIndex >= dayTasks[currentDayIndex].tasks.length - 1) setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1));
      setShowDeleteConfirm(null);
      showToast('Task deleted.', 'info');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setDeletingTask(false);
    }
  };

  if (loading) return (
    <div className="bg-transparent flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-white text-sm font-semibold">Loading your tasks...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-transparent flex items-center justify-center p-3">
      <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-4 max-w-sm text-center">
        <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
        <p className="text-red-200 text-sm">{error}</p>
      </div>
    </div>
  );

  if (dayTasks.length === 0) return (
    <div className="bg-transparent flex items-center justify-center p-3">
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-2xl p-4 max-w-sm text-center">
        <Lightbulb className="w-6 h-6 text-purple-400 mx-auto mb-2" />
        <p className="text-purple-200 text-sm">Create your first course to get started!</p>
      </div>
    </div>
  );

  if (showOnboarding) return <OnboardingScreen onDismiss={handleDismissOnboarding} />;

  const taskObj = currentDay.tasks[currentTaskIndex];
  const isTimerActive = activeTimer === currentTaskIndex;
  const displayTime = isTimerActive ? timerSeconds : (taskObj?.timeSpent || 0);

  return (
    <div className="relative h-full bg-transparent p-2.5 sm:p-3">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showAddModal && (
          <AddTaskModal
            dayNumber={currentDay.dayNumber}
            userId={userId}
            onClose={() => setShowAddModal(false)}
            onAdded={handleTaskAdded}
          />
        )}
        {showEditModal && (
          <EditTaskModal
            task={showEditModal.task}
            taskId={showEditModal.taskId}
            userId={userId}
            onClose={() => setShowEditModal(null)}
            onSaved={handleTaskEdited}
          />
        )}
        {showScheduleModal && (
          <ScheduleModal
            task={showScheduleModal.task}
            taskId={showScheduleModal.taskId}
            userId={userId}
            onClose={() => setShowScheduleModal(null)}
            onScheduled={handleTaskScheduled}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirm
            taskTitle={showDeleteConfirm.task.task}
            isCustom={showDeleteConfirm.task.is_custom || false}
            onConfirm={handleTaskDelete}
            onCancel={() => setShowDeleteConfirm(null)}
            loading={deletingTask}
          />
        )}
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Countdown banner */}
      {nextActionTime && countdownSeconds > 0 && currentDay.tasks.filter(t => !t.done).length > 0 && (
        <div className="w-full mb-3">
          <div className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-500 shadow-lg ${countdownSeconds < 300 ? 'border-pink-500/50' : 'border-purple-500/40'}`}>
            <div className={`absolute inset-0 opacity-30 ${countdownSeconds < 300 ? 'bg-gradient-to-br from-pink-700 via-red-700 to-pink-900' : 'bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-900'}`} />
            <div className="relative z-10 flex items-center justify-between px-3 py-2 gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">{currentDay.title}</h3>
                <p className="text-purple-200 text-xs">{completedTasks}/{totalTasks} Tasks</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-black/40 rounded-lg border border-white/10">
                  <span className={`font-mono text-sm font-black tracking-widest tabular-nums ${countdownSeconds < 300 ? 'text-pink-400' : 'text-white'}`}>
                    {Math.floor((countdownSeconds % 3600) / 60).toString().padStart(2, '0')}:{(countdownSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button onClick={() => setNextActionTime(null)} className="p-1 text-gray-400 hover:text-white rounded transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 mb-2 px-3.5 py-2 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-md rounded-2xl border border-purple-400/50 shadow-lg shadow-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-sm font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Your Learning Squad</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          </div>
          <h1 className="text-sm flex items-center justify-center gap-2">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent font-bold">Your Today's Tasks</span>
          </h1>
        </motion.div>

        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden shadow-lg">

          {/* Card header */}
          <div className="bg-gradient-to-br from-purple-800/60 to-pink-900/60 backdrop-blur-sm p-4 border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold text-white">{currentDay.title}</h3>
                  <span className="px-2 py-0.5 bg-purple-900/50 rounded-full text-purple-200 text-xs font-medium">Day {currentDay.dayNumber}</span>
                </div>
              </div>
              <p className="text-purple-200 text-xs font-medium">{completedTasks}/{totalTasks} Tasks</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-2.5 bg-purple-950/50">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-r-2xl transition-all duration-500 shadow-md shadow-purple-500/40" style={{ width: `${progressPercent}%` }} />
            {progressPercent > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white drop-shadow">{Math.round(progressPercent)}%</span>
              </div>
            )}
          </div>

          <div className="p-3">

            {/* Day navigation */}
            <div className="flex items-center justify-between mb-4 gap-1.5">
              <button onClick={() => handleDayChange(currentDayIndex - 1)} disabled={currentDayIndex === 0} className="flex items-center justify-center gap-0.5 min-w-[30px] h-7 px-2 bg-purple-900/50 border border-purple-500/30 rounded-2xl text-white text-xs font-semibold hover:bg-purple-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <div className="flex gap-1.5 overflow-x-auto flex-1 px-0.5 scrollbar-hide">
                {dayTasks.map((day, idx) => (
                  <button key={idx} onClick={() => handleDayChange(idx)} disabled={!day.unlocked} className={`relative flex-shrink-0 transition-all ${idx === currentDayIndex ? "w-8 h-8" : "w-6 h-6"}`}>
                    {idx === currentDayIndex ? (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-500/40 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{day.dayNumber}</span>
                      </div>
                    ) : (
                      <div className={`w-full h-full rounded-2xl transition-all ${day.unlocked ? "bg-purple-500/50 hover:bg-purple-400/70 hover:scale-110 cursor-pointer" : "bg-purple-900/30 cursor-not-allowed"}`}>
                        {!day.unlocked && <Lock className="w-3 h-3 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={() => handleDayChange(currentDayIndex + 1)} disabled={currentDayIndex === dayTasks.length - 1 || !dayTasks[currentDayIndex + 1]?.unlocked} className="flex items-center justify-center gap-0.5 min-w-[30px] h-7 px-2 bg-purple-900/50 border border-purple-500/30 rounded-2xl text-white text-xs font-semibold hover:bg-purple-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Locked day */}
            {!canAccessDay && (
              <div className="mb-3 p-3 bg-purple-950/50 border border-purple-500/30 rounded-2xl text-center">
                <Lock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <h4 className="text-sm font-bold text-white">Day Locked</h4>
                <p className="text-purple-300 text-xs">Complete all tasks from previous days to unlock!</p>
              </div>
            )}

            {/* Tasks */}
            {canAccessDay && currentDay.tasks.length > 0 && (
              <div className="mb-3">

                {/* Mode toggle + task counter row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-900/40 backdrop-blur-sm rounded-full border border-purple-500/30">
                      <Target className="w-3 h-3 text-purple-300" />
                      <span className="text-white font-semibold text-xs">Task {currentTaskIndex + 1}/{currentDay.tasks.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* ── MODE TOGGLE ── */}
                    <div className="flex items-center bg-purple-950/60 border border-purple-500/20 rounded-xl p-0.5">
                      <button
                        onClick={() => setTaskMode('view')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all
                          ${taskMode === 'view' ? 'bg-purple-600/60 text-white shadow' : 'text-purple-400 hover:text-purple-200'}`}
                      >
                        <CheckSquare className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => setTaskMode('manage')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all
                          ${taskMode === 'manage' ? 'bg-violet-600/60 text-white shadow' : 'text-purple-400 hover:text-purple-200'}`}
                      >
                        <Edit3 className="w-3 h-3" /> Manage
                      </button>
                    </div>

                    {/* Prev/Next task */}
                    <button onClick={() => setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1))} disabled={currentTaskIndex === 0} className="flex items-center gap-0.5 px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded-2xl text-white text-xs font-semibold hover:bg-purple-800/50 hover:scale-105 transition-all disabled:opacity-30">
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button onClick={() => setCurrentTaskIndex(Math.min(currentDay.tasks.length - 1, currentTaskIndex + 1))} disabled={currentTaskIndex === currentDay.tasks.length - 1} className="flex items-center gap-0.5 px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded-2xl text-white text-xs font-semibold hover:bg-purple-800/50 hover:scale-105 transition-all disabled:opacity-30">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* ── SPOTLIGHT TASK ── */}
                {taskObj && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentDayIndex}-${currentTaskIndex}-${taskMode}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-xl rounded-2xl" />

                      <div className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 ${
                        taskObj.done
                          ? "bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-400/60 shadow-lg shadow-green-500/20"
                          : "bg-gradient-to-br from-purple-900/60 via-indigo-900/50 to-purple-900/60 border-purple-400/50 shadow-lg shadow-purple-500/20"
                      }`}>

                        {/* Checkbox + title */}
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <button
                            onClick={e => { e.stopPropagation(); handleTaskToggle(currentDay.date, currentTaskIndex); }}
                            className={`min-w-[20px] w-5 h-5 flex items-center justify-center transition-all flex-shrink-0 border-2 rounded ${taskObj.done ? "bg-green-500 border-green-400" : "bg-transparent border-purple-400 hover:border-purple-300"}`}
                          >
                            {taskObj.done && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-white text-base leading-relaxed break-words transition-all ${taskObj.done ? "line-through opacity-60" : ""}`}>
                              {taskObj.task}
                            </p>
                            {!taskObj.done && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-400/40 rounded-full animate-pulse">
                                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                                  <span className="text-yellow-200 text-[10px] font-bold">Current Focus</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meta badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          {taskObj.difficulty && (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black text-white bg-gradient-to-r ${getDifficultyColor(taskObj.difficulty)} shadow`}>
                              {taskObj.difficulty.toUpperCase()}
                            </span>
                          )}
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-full shadow">
                            <Zap className="w-3 h-3 text-yellow-300" />
                            <span className="text-white font-black text-[10px]">{Math.round(currentDay.xpPerTask * getDifficultyXPMultiplier(taskObj.difficulty))} XP</span>
                          </div>
                          {/* Scheduled time badge */}
                          {taskObj.scheduled_time && (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-800/40 border border-teal-500/30 rounded-full shadow">
                              <AlarmClock className="w-3 h-3 text-teal-300" />
                              <span className="text-teal-100 font-bold text-[10px]">{taskObj.scheduled_time}{taskObj.scheduled_date ? ` · ${taskObj.scheduled_date}` : ''}</span>
                            </div>
                          )}
                          {/* Location badge */}
                          {taskObj.location && (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-800/40 border border-indigo-500/30 rounded-full shadow">
                              <MapPin className="w-3 h-3 text-indigo-300" />
                              <span className="text-indigo-100 font-bold text-[10px]">{taskObj.location}</span>
                            </div>
                          )}
                          {displayTime > 0 && (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-800/50 border border-purple-500/30 rounded-full shadow">
                              <Clock className="w-3 h-3 text-purple-300" />
                              <span className="text-white font-bold text-[10px]">{formatTime(displayTime)}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {taskObj.notes && (
                          <div className="mt-2 p-2.5 bg-purple-950/50 border border-purple-600/30 rounded-xl">
                            <div className="flex items-start gap-1.5 mb-1">
                              <MessageCircle className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                              <span className="text-purple-300 font-bold text-[10px]">Notes:</span>
                            </div>
                            <p className="text-purple-100 text-[10px] leading-relaxed pl-4">{taskObj.notes}</p>
                          </div>
                        )}

                        {/* Add Note expanded */}
                        {expandedTaskNote === currentTaskIndex && (
                          <div className="mt-2 p-3 bg-purple-950/50 border border-purple-500/30 rounded-xl" onClick={e => e.stopPropagation()}>
                            <textarea
                              value={taskNotes[currentTaskIndex] || taskObj.notes || ''}
                              onChange={e => setTaskNotes({ ...taskNotes, [currentTaskIndex]: e.target.value })}
                              placeholder="Add reflection, learnings, or notes..."
                              className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/30 rounded-xl text-white text-xs placeholder-purple-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20 resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleAddNote(currentTaskIndex)} className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xs font-bold text-white">Save Note</button>
                              <button onClick={() => { setExpandedTaskNote(null); setTaskNotes(prev => { const n = { ...prev }; delete n[currentTaskIndex]; return n; }); }} className="flex-1 px-3 py-2 bg-purple-900/60 rounded-xl text-xs font-bold text-white border border-purple-500/30">Cancel</button>
                            </div>
                          </div>
                        )}

                        {/* ─── VIEW MODE BUTTONS ─── */}
                        {taskMode === 'view' && (
                          <button
                            onClick={e => { e.stopPropagation(); handleGetLiveSupport(taskObj, currentTaskIndex); }}
                            disabled={loadingLiveSupport}
                            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl text-white text-sm font-black shadow-lg shadow-purple-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-2.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                            <span className="relative z-10 flex items-center gap-2">
                              {loadingLiveSupport ? (<><Loader2 className="w-4 h-4 animate-spin" /> Loading AI Coach...</>) : <>Start task now!</>}
                            </span>
                          </button>
                        )}

                        {/* ─── MANAGE MODE BUTTONS ─── */}
                        {taskMode === 'manage' && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 space-y-2"
                          >
                            {/* Row 1: Edit + Schedule */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setShowEditModal({ task: taskObj, taskId: taskObj.id || `day${currentDay.dayNumber}_task` })}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-indigo-600/80 to-blue-600/80 hover:from-indigo-500 hover:to-blue-500 border border-indigo-400/40 rounded-xl text-white text-xs font-black shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit Task
                              </button>
                              <button
                                onClick={() => setShowScheduleModal({ task: taskObj, taskId: taskObj.id || `day${currentDay.dayNumber}_task`, taskIndex: currentTaskIndex })}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-teal-600/80 to-cyan-600/80 hover:from-teal-500 hover:to-cyan-500 border border-teal-400/40 rounded-xl text-white text-xs font-black shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all"
                              >
                                <AlarmClock className="w-3.5 h-3.5" /> Schedule
                              </button>
                            </div>

                            {/* Row 2: Add Note + Delete */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setExpandedTaskNote(expandedTaskNote === currentTaskIndex ? null : currentTaskIndex)}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-purple-800/60 hover:bg-purple-700/60 border border-purple-500/30 rounded-xl text-white text-xs font-bold hover:scale-[1.02] transition-all"
                              >
                                <MessageCircle className="w-3.5 h-3.5" /> Add Note
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm({ task: taskObj, taskId: taskObj.id || `day${currentDay.dayNumber}_task`, taskIndex: currentTaskIndex })}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-900/60 hover:bg-rose-800/60 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-bold hover:scale-[1.02] transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* ── ADD TASK BUTTON ── */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-purple-500/40 hover:border-violet-400/60 rounded-2xl text-purple-400 hover:text-violet-300 text-xs font-bold transition-all hover:bg-violet-500/5 group"
                >
                  <div className="w-5 h-5 rounded-lg bg-purple-800/50 group-hover:bg-violet-600/50 border border-purple-500/30 flex items-center justify-center transition-all">
                    <Plus className="w-3 h-3" />
                  </div>
                  Add Custom Task to Day {currentDay.dayNumber}
                </motion.button>
              </div>
            )}

            {/* Day complete */}
            {canAccessDay && isAllCompleted && (
              <div className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl font-bold text-white text-sm shadow shadow-yellow-500/30 animate-pulse">
                <Award className="w-4 h-4" />🎉 Day Complete!
              </div>
            )}
          </div>
        </div>

        {/* Stats Modal */}
        {showStatsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3" onClick={() => setShowStatsModal(false)}>
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/30 rounded-2xl p-4 max-w-sm w-full shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Your Progress</h3>
                </div>
                <button onClick={() => setShowStatsModal(false)} className="p-1.5 hover:bg-purple-800/50 rounded-lg transition-colors"><X className="w-4 h-4 text-white" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />, label: "Total XP", value: stats.totalXP },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />, label: "Days Done", value: stats.totalDaysCompleted },
                  { icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, label: "Streak", value: stats.currentStreak },
                  { icon: <Clock className="w-3.5 h-3.5 text-blue-400" />, label: "Avg Time", value: formatTime(stats.averageTaskTime) },
                ].map((stat, i) => (
                  <div key={i} className="p-2.5 bg-purple-950/30 rounded-2xl border border-purple-500/20">
                    <div className="flex items-center gap-1.5 mb-1">{stat.icon}<span className="text-purple-300 text-[10px]">{stat.label}</span></div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-500/20">
                <div className="flex items-center gap-1.5 mb-2"><Calendar className="w-3.5 h-3.5 text-purple-400" /><h4 className="text-xs font-bold text-white">Daily Progress</h4></div>
                <div className="space-y-1.5">
                  {dayTasks.map((day, idx) => {
                    const completed = day.tasks.filter(t => t.done).length;
                    const total = day.tasks.length;
                    const percent = total > 0 ? (completed / total) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-purple-300 text-[10px] font-medium w-12">Day {day.dayNumber}</span>
                        <div className="flex-1 h-4 bg-purple-950/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${percent}%` }}>
                            {percent > 20 && <span className="text-[9px] font-bold text-white">{completed}/{total}</span>}
                          </div>
                        </div>
                        {day.unlocked ? (percent === 100 ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />) : <Lock className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}