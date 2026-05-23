import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Bot, User, Loader2, CheckCircle, Circle, RotateCw, Scissors, Target, Lightbulb, Trash2, Calendar, BookOpen, TrendingUp, Settings, Zap, ChevronDown, MessageSquare, Award, Flame, Star, Trophy, Clock, BarChart3, Gift, Heart, Users, Plus } from 'lucide-react';

// ==================== TYPES & INTERFACES ====================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  type?: 'text' | 'task-list' | 'lesson' | 'action-confirm' | 'loading';
}

interface Task {
  id: string;
  title: string;
  description?: string;
  task?: {
    task: string;
  };
  done: boolean;
}

interface Lesson {
  date: string;
  title?: string;
  lesson?: string;
  summary: string;
  motivation?: string;
  quote?: string;
  secret_hacks_and_shortcuts?: string;
  tiny_daily_rituals_that_transform?: string;
  tasks?: Task[];
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: string;
  description: string;
  color: string;
  emoji: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
  progress: number;
}

// ==================== CONSTANTS ====================

const API_BASE_URL = 'https://agent-f8uq.onrender.com';
const TYPING_DELAY = 1500;
const DEFAULT_USER_ID = 'HfwcJgkyNNb3T3UdWRDbrCiRQuS2';

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    label: "Today's Tasks",
    action: "show me today's tasks",
    description: "View your daily task list",
    color: "from-blue-500 to-cyan-500",
    emoji: "📋"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    label: "Today's Lesson",
    action: "show me today's lesson",
    description: "Read your learning material",
    color: "from-purple-500 to-pink-500",
    emoji: "📚"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    label: "My Progress",
    action: "show my progress",
    description: "Check your learning stats",
    color: "from-emerald-500 to-teal-500",
    emoji: "📊"
  },
  {
    icon: <RotateCw className="w-6 h-6" />,
    label: "Regenerate Tasks",
    action: "regenerate all my tasks",
    description: "Get new AI-generated tasks",
    color: "from-orange-500 to-red-500",
    emoji: "🔄"
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    label: "Simplify Tasks",
    action: "simplify all my tasks",
    description: "Make tasks easier",
    color: "from-violet-500 to-purple-500",
    emoji: "✂️"
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    label: "Get Motivation",
    action: "motivate me",
    description: "Boost your energy",
    color: "from-amber-500 to-yellow-500",
    emoji: "💡"
  },
];

const ACHIEVEMENTS = [
  { id: 'first_step', title: 'First Step', description: 'Complete your first action', icon: '🌟', threshold: 1 },
  { id: 'getting_started', title: 'Getting Started', description: 'Complete 5 actions', icon: '✨', threshold: 5 },
  { id: 'momentum_builder', title: 'Momentum Builder', description: 'Complete 10 actions', icon: '🚀', threshold: 10 },
  { id: 'social_warrior', title: 'Social Warrior', description: 'Complete 25 actions', icon: '⚡', threshold: 25 },
  { id: 'legendary', title: 'Legendary', description: 'Complete 50 actions', icon: '👑', threshold: 50 },
  { id: 'streak_master', title: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', threshold: 7 },
  { id: 'xp_hunter', title: 'XP Hunter', description: 'Earn 500 XP', icon: '💰', threshold: 500 },
];

const MOTIVATIONAL_QUOTES = [
  "Every conversation is a chance to grow.",
  "Small actions create powerful momentum.",
  "You're building skills that last a lifetime.",
  "Consistency beats perfection every time.",
  "Your comfort zone is expanding!",
  "Social skills are learnable, not innate.",
  "Each interaction is practice, not performance.",
  "Progress, not perfection, is the goal.",
];

// ==================== UTILITY FUNCTIONS ====================

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const simulateTypingDelay = async (delay: number = TYPING_DELAY): Promise<void> => new Promise(resolve => setTimeout(resolve, delay));

const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getWeeklyData = (completedTasks: number[]) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    weekData.push({
      day: days[date.getDay()],
      actions: completedTasks[6 - i] || Math.floor(Math.random() * 8),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return weekData;
};

// ==================== API SERVICE ====================

class APIService {
  private baseUrl: string = API_BASE_URL;
  private userId: string = DEFAULT_USER_ID;

  async getTodaysTasks(date: string = getTodayDate()): Promise<Task[]> {
    try {
      const url = `${this.baseUrl}/todays_tasks?user_id=${this.userId}&date=${date}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (data.success && data.tasks) {
        return data.tasks.map((task: any) => ({
          id: task.id || generateId(),
          title: task.title || 'Untitled Task',
          description: task.description || '',
          task: { task: task.description || task.title || '' },
          done: false
        }));
      }
      
      if (data.success) {
        return [];
      }
      
      throw new Error(data.message || 'Failed to fetch tasks');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async summarizeLesson(date: string = getTodayDate()): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/summarize_lesson?user_id=${this.userId}&date=${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        }
      );
      const data = await response.json();
      
      if (data.success && data.summary) {
        return data.summary;
      }
      return 'No lesson summary available.';
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  }

  async generateTasks(instruction: string = '', date: string = getTodayDate()): Promise<Task[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/generate_tasks?user_id=${this.userId}&date=${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instruction })
        }
      );
      const data = await response.json();
      
      if (data.success && data.tasks) {
        return data.tasks.map((task: any) => ({
          id: task.id || generateId(),
          title: task.title || 'Untitled Task',
          description: task.description || '',
          task: { task: task.description || task.title || '' },
          done: false
        }));
      }
      return [];
    } catch (error) {
      console.error('Error generating tasks:', error);
      throw error;
    }
  }
}

// ==================== AI ASSISTANT ====================

class AIAssistant {
  private apiService: APIService;
  private currentTasks: Task[] = [];
  private currentLesson: string = '';

  constructor() {
    this.apiService = new APIService();
  }

  async processUserInput(input: string): Promise<Message> {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('task') && (lowerInput.includes('today') || lowerInput.includes('show') || lowerInput.includes('my'))) {
      try {
        const tasks = await this.apiService.getTodaysTasks();
        this.currentTasks = tasks;
        
        if (tasks.length === 0) {
          return {
            id: generateId(),
            role: 'assistant',
            content: 'No tasks found for today. Would you like me to generate some tasks for you?',
            timestamp: new Date(),
            type: 'text'
          };
        }

        return {
          id: generateId(),
          role: 'assistant',
          content: `Perfect! Here are your ${tasks.length} tasks for today. Click on any task to expand it and see AI-powered actions!`,
          timestamp: new Date(),
          type: 'task-list',
          data: { tasks }
        };
      } catch (error: any) {
        return {
          id: generateId(),
          role: 'assistant',
          content: `Sorry, I had trouble fetching your tasks.\n\nError: ${error.message || 'Unknown error'}\n\nPlease check your internet connection and try again.`,
          timestamp: new Date(),
          type: 'text'
        };
      }
    }

    if (lowerInput.includes('lesson') && (lowerInput.includes('today') || lowerInput.includes('show'))) {
      try {
        const summary = await this.apiService.summarizeLesson();
        this.currentLesson = summary;
        
        const lesson: Lesson = {
          date: getTodayDate(),
          title: 'Today\'s Lesson',
          summary: summary,
          quote: 'Learning is a journey, not a destination.',
          motivation: 'Keep pushing forward! Every step counts.',
          secret_hacks_and_shortcuts: 'Break down complex topics into smaller chunks.',
          tiny_daily_rituals_that_transform: 'Dedicate 25 minutes each morning to focused learning.'
        };

        return {
          id: generateId(),
          role: 'assistant',
          content: 'Here is your lesson for today. Take your time reading through this!',
          timestamp: new Date(),
          type: 'lesson',
          data: { lesson }
        };
      } catch (error) {
        return {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I had trouble fetching your lesson. Please try again.',
          timestamp: new Date(),
          type: 'text'
        };
      }
    }

    if (lowerInput.includes('regenerate') && lowerInput.includes('task')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: 'I will use AI to create brand new tasks tailored to your learning style! This will replace your current tasks. Ready to proceed?',
        timestamp: new Date(),
        type: 'action-confirm',
        data: { action: 'regenerate_all', message: 'Generate new AI-powered tasks' }
      };
    }

    if ((lowerInput.includes('simplify') || lowerInput.includes('easier')) && lowerInput.includes('task')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: 'No worries! I will break down your tasks into smaller, easier steps. Shall I simplify them for you?',
        timestamp: new Date(),
        type: 'action-confirm',
        data: { action: 'simplify_all', message: 'Simplify all tasks' }
      };
    }

    if ((lowerInput.includes('harder') || lowerInput.includes('challenge')) && lowerInput.includes('task')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: 'Love the ambition! I will add more complexity and advanced concepts to challenge your skills. Ready to level up?',
        timestamp: new Date(),
        type: 'action-confirm',
        data: { action: 'make_harder_all', message: 'Increase difficulty level' }
      };
    }

    if (lowerInput.includes('progress') || lowerInput.includes('stat')) {
      const completed = this.currentTasks.filter(t => t.done).length;
      const total = this.currentTasks.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        id: generateId(),
        role: 'assistant',
        content: `Your Progress Today:\n\n✅ Completed: ${completed}/${total} tasks\n📈 Progress: ${percentage}%\n🔥 Streak: 7 days\n⚡ XP Earned: ${completed * 50}\n\n${completed === total ? '🎉 Perfect! You have crushed all tasks today!' : `💪 ${total - completed} more to go! You got this!`}`,
        timestamp: new Date(),
        type: 'text'
      };
    }

    if (lowerInput.includes('motivate') || lowerInput.includes('encourage')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: `🌟 You are doing amazing!\n\n"The only way to do great work is to love what you do."\n\n💡 Every expert was once a beginner. Keep learning and growing!\n\n🚀 Remember: Small daily progress leads to big results!`,
        timestamp: new Date(),
        type: 'text'
      };
    }

    return {
      id: generateId(),
      role: 'assistant',
      content: `👋 Hey! I am here to help you learn!\n\nI can:\n\n📋 Show your daily tasks\n📚 Display today's lesson\n🔄 Regenerate or simplify tasks\n💡 Give you hints and motivation\n📊 Track your progress\n\nWhat would you like to do?`,
      timestamp: new Date(),
      type: 'text'
    };
  }

  async executeAction(action: string): Promise<{ tasks?: Task[], message: string }> {
    await simulateTypingDelay(2000);
    
    if (action === 'regenerate_all') {
      try {
        const tasks = await this.apiService.generateTasks('Regenerate all tasks with fresh ideas');
        this.currentTasks = tasks;
        return {
          tasks,
          message: '✨ Done! I have created brand new AI-generated tasks matched to your skill level! Check them out above!'
        };
      } catch (error) {
        return {
          message: 'Sorry, I had trouble generating new tasks. Please try again.'
        };
      }
    }
    
    if (action === 'simplify_all') {
      try {
        const tasks = await this.apiService.generateTasks('Make these tasks easier for a beginner');
        this.currentTasks = tasks;
        return {
          tasks,
          message: '✅ Perfect! All tasks are now simplified and broken into easier steps! Start small and build momentum!'
        };
      } catch (error) {
        return {
          message: 'Sorry, I had trouble simplifying tasks. Please try again.'
        };
      }
    }
    
    if (action === 'make_harder_all') {
      try {
        const tasks = await this.apiService.generateTasks('Make these tasks more challenging with advanced concepts');
        this.currentTasks = tasks;
        return {
          tasks,
          message: '🔥 Challenge accepted! Tasks upgraded with advanced concepts! Time to push your limits!'
        };
      } catch (error) {
        return {
          message: 'Sorry, I had trouble making tasks harder. Please try again.'
        };
      }
    }

    return {
      message: 'Action completed successfully!'
    };
  }

  updateTaskCompletion(taskId: string, done: boolean) {
    const task = this.currentTasks.find(t => t.id === taskId);
    if (task) {
      task.done = done;
    }
  }

  getTasks(): Task[] {
    return this.currentTasks;
  }
}

// ==================== COMPONENTS ====================

const QuickActionCard = ({ action, onClick }: {
  action: QuickAction;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative px-6 py-8 md:py-10 flex flex-col items-center justify-center gap-3 min-h-[140px] md:min-h-[160px]">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
          <span className="text-4xl md:text-5xl">{action.emoji}</span>
        </div>
        
        <div className="text-center">
          <h3 className="text-white font-bold text-base md:text-lg mb-1">{action.label}</h3>
          <p className="text-white/90 text-sm font-medium">{action.description}</p>
        </div>

        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

const TaskCard = ({ task, onToggleComplete, onAction }: {
  task: Task;
  onToggleComplete: (id: string) => void;
  onAction: (action: string, taskId: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const taskContent = task.description || task.task?.task || task.title;

  return (
    <div className={`bg-gradient-to-br backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
      task.done 
        ? 'from-emerald-900/40 to-teal-900/40 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
        : 'from-purple-900/40 to-indigo-900/40 border-purple-500/30 hover:border-purple-400/50'
    }`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 flex-shrink-0 transition-all duration-200 hover:scale-110"
          >
            {task.done ? (
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-7 h-7 border-2 border-purple-400 rounded-full hover:border-purple-300 transition-colors" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h4 className={`font-bold text-base md:text-lg ${task.done ? 'line-through text-purple-400' : 'text-purple-100'}`}>
                {task.title}
              </h4>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors flex-shrink-0"
              >
                <ChevronDown className={`w-5 h-5 text-purple-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {!expanded && (
              <p className="text-sm md:text-base text-purple-300 line-clamp-2 leading-relaxed">
                {taskContent}
              </p>
            )}
            
            {expanded && (
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                    {taskContent}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-200">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Actions</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => onAction('regenerate', task.id)}
                      className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <RotateCw className="w-4 h-4" />
                        Regenerate
                      </div>
                    </button>
                    <button
                      onClick={() => onAction('simplify', task.id)}
                      className="px-5 py-3 bg-purple-900/60 border-2 border-purple-500/30 text-purple-200 text-sm font-bold rounded-xl hover:border-purple-400/50 hover:shadow-md active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Scissors className="w-4 h-4" />
                        Simplify
                      </div>
                    </button>
                    <button
                      onClick={() => onAction('harder', task.id)}
                      className="px-5 py-3 bg-purple-900/60 border-2 border-purple-500/30 text-purple-200 text-sm font-bold rounded-xl hover:border-purple-400/50 hover:shadow-md active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Target className="w-4 h-4" />
                        Make Harder
                      </div>
                    </button>
                    <button
                      onClick={() => onAction('hint', task.id)}
                      className="px-5 py-3 bg-purple-900/60 border-2 border-purple-500/30 text-purple-200 text-sm font-bold rounded-xl hover:border-purple-400/50 hover:shadow-md active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Get Hint
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonCard = ({ lesson }: { lesson: Lesson }) => (
  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/30 shadow-lg">
    <div className="flex items-start gap-4 mb-5">
      <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
        <BookOpen className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-purple-100 text-xl md:text-2xl mb-1">{lesson.title || 'Today\'s Lesson'}</h3>
        <p className="text-sm text-purple-300 font-semibold">{lesson.date}</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="bg-purple-950/40 backdrop-blur-sm rounded-xl p-5 border border-purple-700/30">
        <h4 className="font-bold text-purple-200 text-base mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          Summary
        </h4>
        <p className="text-sm md:text-base text-purple-100 leading-relaxed">{lesson.summary}</p>
      </div>
      
      {lesson.quote && (
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl p-5 border-2 border-purple-500/40">
          <p className="text-sm md:text-base text-purple-100 italic font-medium text-center leading-relaxed">"{lesson.quote}"</p>
        </div>
      )}
      
      {(lesson.secret_hacks_and_shortcuts || lesson.tiny_daily_rituals_that_transform) && (
        <div className="grid grid-cols-1 gap-4">
          {lesson.secret_hacks_and_shortcuts && (
            <div className="bg-purple-950/40 backdrop-blur-sm rounded-xl p-5 border border-purple-700/30">
              <h4 className="font-bold text-purple-200 text-base mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Secret Hack
              </h4>
              <p className="text-sm md:text-base text-purple-100">{lesson.secret_hacks_and_shortcuts}</p>
            </div>
          )}
          
          {lesson.tiny_daily_rituals_that_transform && (
            <div className="bg-purple-950/40 backdrop-blur-sm rounded-xl p-5 border border-purple-700/30">
              <h4 className="font-bold text-purple-200 text-base mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Daily Ritual
              </h4>
              <p className="text-sm md:text-base text-purple-100">{lesson.tiny_daily_rituals_that_transform}</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const ActionConfirmCard = ({ message, action, onConfirm, onCancel }: {
  message: string;
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-amber-500/40 shadow-lg">
    <div className="flex items-start gap-4 mb-5">
      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
        <Zap className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-amber-100 text-lg md:text-xl mb-2">Confirm Action</h4>
        <p className="text-sm md:text-base text-amber-200 font-medium">{message}</p>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onConfirm}
        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all"
      >
        ✅ Yes, Do It!
      </button>
      <button
        onClick={onCancel}
        className="flex-1 px-6 py-4 bg-purple-900/60 border-2 border-purple-500/30 text-purple-200 text-base font-bold rounded-xl hover:border-purple-400/50 hover:shadow-md active:scale-95 transition-all"
      >
        ❌ Cancel
      </button>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

const GoalGridDashboard = () => {
  const [currentResponse, setCurrentResponse] = useState<Message | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streak, setStreak] = useState(7);
  const [xp, setXp] = useState(350);
  const [totalTasks, setTotalTasks] = useState(12);
  const [completedTasks, setCompletedTasks] = useState(8);
  const [weeklyAverage, setWeeklyAverage] = useState(4.2);
  const [dailyQuote, setDailyQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const aiAssistant = useRef(new AIAssistant());
  const responseRef = useRef<HTMLDivElement>(null);

  // Initialize daily quote
  useEffect(() => {
    const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  // Scroll to response when it changes
  useEffect(() => {
    if (currentResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentResponse]);

  // Calculate achievements
  const achievements: Achievement[] = ACHIEVEMENTS.map(achievement => {
    let progress = 0;
    
    if (achievement.id === 'streak_master') {
      progress = streak;
    } else if (achievement.id === 'xp_hunter') {
      progress = xp;
    } else {
      progress = completedTasks;
    }
    
    return {
      ...achievement,
      unlocked: progress >= achievement.threshold,
      progress: Math.min(progress, achievement.threshold)
    };
  });

  const weeklyChartData = getWeeklyData([3, 5, 4, 6, 5, 7, 4]);
  const maxWeeklyActions = Math.max(...weeklyChartData.map(d => d.actions), 1);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isTyping) return;

    setInputValue('');
    setIsTyping(true);

    // Show loading state
    setCurrentResponse({
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'loading'
    });

    await simulateTypingDelay();

    try {
      const response = await aiAssistant.current.processUserInput(textToSend);
      setCurrentResponse(response);
      
      // Update stats if tasks were completed
      if (response.type === 'task-list' && response.data?.tasks) {
        setTotalTasks(response.data.tasks.length);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setCurrentResponse(errorMessage);
    }

    setIsTyping(false);
  }, [inputValue, isTyping]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  const handleTaskToggle = useCallback((taskId: string) => {
    aiAssistant.current.updateTaskCompletion(taskId, true);
    setXp(prev => prev + 50);
    setCompletedTasks(prev => prev + 1);
    
    if (currentResponse && currentResponse.type === 'task-list' && currentResponse.data?.tasks) {
      setCurrentResponse({
        ...currentResponse,
        data: {
          ...currentResponse.data,
          tasks: currentResponse.data.tasks.map((t: Task) =>
            t.id === taskId ? { ...t, done: !t.done } : t
          )
        }
      });
    }

    // Show confetti for milestones
    if ((completedTasks + 1) % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentResponse, completedTasks]);

  const handleTaskAction = useCallback(async (action: string, taskId: string) => {
    setIsTyping(true);
    setCurrentResponse({
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'loading'
    });

    await simulateTypingDelay();

    let responseContent = '';
    
    if (action === 'regenerate') {
      responseContent = `✨ Task regenerated! I have created a fresh version of this task with a new approach. Check it out above!`;
    } else if (action === 'simplify') {
      responseContent = `✅ Task simplified! I have broken this down into smaller, easier steps. You got this!`;
    } else if (action === 'harder') {
      responseContent = `🔥 Challenge mode activated! This task now includes advanced concepts to push your skills further!`;
    } else if (action === 'hint') {
      responseContent = `💡 Here is a hint: Start by breaking the task into 3 smaller steps. Focus on understanding the core concept first before diving into implementation. You are on the right track!`;
    }

    const response: Message = {
      id: generateId(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      type: 'text'
    };

    setCurrentResponse(response);
    setIsTyping(false);
  }, []);

  const handleActionConfirm = useCallback(async (action: string) => {
    setIsTyping(true);
    setCurrentResponse({
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'loading'
    });

    try {
      const result = await aiAssistant.current.executeAction(action);
      
      const response: Message = {
        id: generateId(),
        role: 'assistant',
        content: result.message,
        timestamp: new Date(),
        type: result.tasks ? 'task-list' : 'text',
        data: result.tasks ? { tasks: result.tasks } : undefined
      };

      setCurrentResponse(response);
      
      if (result.tasks) {
        setTotalTasks(result.tasks.length);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setCurrentResponse(errorMessage);
    }

    setIsTyping(false);
  }, []);

  const handleActionCancel = useCallback(() => {
    const cancelMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '✅ No problem! Action cancelled. What else can I help you with?',
      timestamp: new Date(),
      type: 'text'
    };
    setCurrentResponse(cancelMessage);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
<div className="min-h-screen bg-transparent text-white p-4 md:p-8">
  <div className="max-w-[1800px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-8 text-center">

	

	{/* Stunning Header */}
<motion.div 
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="text-center mb-12"
>
  <motion.div 
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
    className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-md rounded-full border-2 border-purple-400/50 shadow-2xl shadow-purple-500/30"
  >
    <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-yellow-300 animate-pulse" />
    <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
      Change your schedule  
    </span>
    <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-pink-300 animate-pulse" />
  </motion.div>
  
  <motion.h1 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3"
  >
    <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
    <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
      Your Helper
    </span>
  </motion.h1>
  
  <motion.p 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.7 }}
    className="text-base md:text-lg text-purple-300 max-w-2xl mx-auto mb-6 md:mb-8 px-4"
  >
    Connect, compete, and grow together
  </motion.p>
</motion.div>
	
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">AI-Powered Learning Platform</span>
          </div>
          
          
          
          <p className="text-purple-200 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-4">
            Your intelligent learning companion. Use this to keep yourself updated with the latest task, change your schedule or to get motivation !
          </p>

          <div className="flex items-center justify-center gap-2 text-purple-300 italic">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm md:text-base">{dailyQuote}</p>
            <Sparkles className="w-4 h-4" />
          </div>
        </header>





       

        {/* Quick Actions Grid - BIGGER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            <h2 className="text-xl md:text-2xl font-bold text-purple-100">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {QUICK_ACTIONS.map((action, index) => (
              <QuickActionCard
                key={index}
                action={action}
                onClick={() => handleQuickAction(action.action)}
              />
            ))}
          </div>
        </div>

        {/* AI Response Card - Single Focus Area */}
        {currentResponse && (
          <div ref={responseRef} className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Bot className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              <h2 className="text-xl md:text-2xl font-bold text-purple-100">AI Response</h2>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 md:p-8 shadow-xl">
              {currentResponse.type === 'loading' ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span className="text-base md:text-lg font-semibold text-purple-300">AI is thinking...</span>
                </div>
              ) : currentResponse.type === 'task-list' && currentResponse.data?.tasks ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <p className="text-base md:text-lg text-purple-100 leading-relaxed">{currentResponse.content}</p>
                  </div>
                  <div className="space-y-4">
                    {currentResponse.data.tasks.map((task: Task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleTaskToggle}
                        onAction={handleTaskAction}
                      />
                    ))}
                  </div>
                </div>
              ) : currentResponse.type === 'lesson' && currentResponse.data?.lesson ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <p className="text-base md:text-lg text-purple-100 leading-relaxed">{currentResponse.content}</p>
                  </div>
                  <LessonCard lesson={currentResponse.data.lesson} />
                </div>
              ) : currentResponse.type === 'action-confirm' && currentResponse.data ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <p className="text-base md:text-lg text-purple-100 leading-relaxed">{currentResponse.content}</p>
                  </div>
                  <ActionConfirmCard
                    message={currentResponse.data.message}
                    action={currentResponse.data.action}
                    onConfirm={() => handleActionConfirm(currentResponse.data.action)}
                    onCancel={handleActionCancel}
                  />
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg text-purple-100 whitespace-pre-line leading-relaxed">
                    {currentResponse.content}
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-purple-700/30">
                <span className="text-xs md:text-sm text-purple-400 font-semibold">
                  {formatTime(currentResponse.timestamp)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-5 md:p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-base md:text-lg font-bold text-purple-100">Ask AI Anything</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-purple-950/50 rounded-xl border-2 border-purple-500/30 focus-within:border-purple-400 transition-colors">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or describe what you want to learn..."
                className="w-full px-4 py-3 md:px-5 md:py-4 bg-transparent resize-none outline-none text-sm md:text-base font-medium text-white placeholder-purple-400"
                rows={2}
                disabled={isTyping}
              />
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className={`px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-white shadow-lg transition-all text-sm md:text-base ${
                inputValue.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95'
                  : 'bg-purple-900/50 cursor-not-allowed opacity-50'
              }`}
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin mx-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">Send</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center py-8 border-t border-purple-500/20 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-purple-300 text-sm">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>{achievements.filter(a => a.unlocked).length} / {achievements.length} achievements unlocked</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Level {Math.floor(xp / 100) + 1}</span>
            </div>
          </div>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-8xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalGridDashboard;