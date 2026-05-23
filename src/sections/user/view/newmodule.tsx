import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Trophy, Lock, Play, ChevronRight, Calendar,
  Clock, Zap, Target, Brain, Sparkles, Award, Layers
} from 'lucide-react';
import { usePortalDriver } from 'src/hooks/usePortalDriver';
// Example: How to structure your topic-based modules
const topicModules = [
  {
    id: 'conversation_mastery',
    title: 'Conversation Mastery',
    description: 'Master the art of engaging conversations',
    icon: '💬',
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/40',
    lessons: [
      {
        id: 'small_talk',
        title: 'Small Talk Fundamentals',
        summary: 'Learn to start and maintain casual conversations effortlessly',
        duration: '25 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'deep_conversations',
        title: 'Deep Conversations',
        summary: 'Move beyond surface-level and create meaningful connections',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'confidence_building',
    title: 'Confidence Building',
    description: 'Build unshakeable self-confidence',
    icon: '🦁',
    color: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/40',
    lessons: [
      {
        id: 'body_language',
        title: 'Body Language Power',
        summary: 'Command respect through powerful body language',
        duration: '20 min',
        xp: 150,
        completed: false,
        locked: false
      },
      {
        id: 'voice_control',
        title: 'Voice & Tone Mastery',
        summary: 'Speak with authority and magnetism',
        duration: '25 min',
        xp: 175,
        completed: false,
        locked: true
      }
    ]
  },
  {
    id: 'emotional_intelligence',
    title: 'Emotional Intelligence',
    description: 'Understand and manage emotions effectively',
    icon: '🧠',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/40',
    lessons: [
      {
        id: 'empathy_skills',
        title: 'Empathy & Understanding',
        summary: 'Connect deeply by understanding others\' emotions',
        duration: '30 min',
        xp: 200,
        completed: false,
        locked: false
      }
    ]
  }
];

// Component to display topic modules
function TopicModulesSection({ modules, onSelectLesson }) {
  usePortalDriver();
  const [expandedModule, setExpandedModule] = useState(null);

  return (
    <div className="mt-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Layers className="w-10 h-10 text-purple-400" />
          <h2 className="text-4xl font-bold text-white">Topic Modules</h2>
        </div>
        <p className="text-slate-400 text-lg">
          Deep-dive into specific skills at your own pace
        </p>
      </motion.div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <TopicModuleCard
            key={module.id}
            module={module}
            index={index}
            isExpanded={expandedModule === module.id}
            onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
            onSelectLesson={onSelectLesson}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Topic Module Card
function TopicModuleCard({ module, index, isExpanded, onToggle, onSelectLesson }) {
  usePortalDriver();
  const completedCount = module.lessons.filter(l => l.completed).length;
  const totalCount = module.lessons.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <div
        className={`bg-gradient-to-br ${module.color} bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border-2 ${module.borderColor} cursor-pointer transition-all hover:scale-[1.02]`}
        onClick={onToggle}
      >
        {/* Module Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{module.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{module.title}</h3>
              <p className="text-slate-400 text-sm">{module.description}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-6 h-6 text-slate-400" />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{completedCount}/{totalCount} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r ${module.color}`}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{totalCount} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>+{module.lessons.reduce((sum, l) => sum + l.xp, 0)} XP</span>
          </div>
        </div>
      </div>

      {/* Expanded Lessons List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            {module.lessons.map((lesson, lessonIndex) => (
              <TopicLessonCard
                key={lesson.id}
                lesson={lesson}
                moduleColor={module.color}
                onSelect={() => onSelectLesson(lesson, module)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Individual Lesson Card within Topic Module
function TopicLessonCard({ lesson, moduleColor, onSelect }) {
  usePortalDriver();
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={!isLocked ? { scale: 1.02, x: 10 } : {}}
      className={`relative group bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer ${
        isCompleted
          ? 'border-green-500/50 bg-green-500/5'
          : isLocked
          ? 'border-slate-700/40 opacity-60 cursor-not-allowed'
          : 'border-slate-700/50 hover:border-slate-600'
      }`}
      onClick={() => !isLocked && onSelect()}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isCompleted
              ? 'bg-green-500/20'
              : isLocked
              ? 'bg-slate-700/20'
              : `bg-gradient-to-br ${moduleColor} bg-opacity-20`
          }`}
        >
          {isCompleted ? (
            <Trophy className="w-6 h-6 text-green-400" />
          ) : isLocked ? (
            <Lock className="w-6 h-6 text-slate-400" />
          ) : (
            <Target className="w-6 h-6 text-purple-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold mb-1">{lesson.title}</h4>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{lesson.summary}</p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>+{lesson.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          {isCompleted ? (
            <div className="px-3 py-2 bg-green-500/20 rounded-lg text-green-400 text-xs font-medium">
              Completed
            </div>
          ) : isLocked ? (
            <div className="px-3 py-2 bg-slate-700/20 rounded-lg text-slate-500 text-xs font-medium">
              Locked
            </div>
          ) : (
            <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1">
              Start
              <Play className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Demo Component
export default function TopicModulesSection() {
  usePortalDriver();
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleSelectLesson = (lesson, module) => {
    console.log('Selected:', lesson, 'from module:', module);
    setSelectedLesson({ lesson, module });
    // Here you would navigate to the lesson view
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Day-wise lessons would be here */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-xl text-white mb-2">5-Day Journey (Day-wise lessons above)</h3>
          <p className="text-slate-400 text-sm">Your daily structured path appears here...</p>
        </div>

        {/* Topic Modules Section */}
        <TopicModulesSection
          modules={topicModules}
          onSelectLesson={handleSelectLesson}
        />

        {/* Selection Display */}
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-xl shadow-2xl max-w-sm"
          >
            <p className="font-bold mb-1">Selected:</p>
            <p className="text-sm">{selectedLesson.lesson.title}</p>
            <p className="text-xs text-purple-200">from {selectedLesson.module.title}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}