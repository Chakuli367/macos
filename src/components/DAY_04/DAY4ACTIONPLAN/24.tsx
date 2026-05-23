import React, { useState, useMemo } from "react";
import {
  Target,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Trash2,
  Eye,
  MessageCircle,
  Brain,
  Shield,
  Award,
  ChevronRight,
} from "lucide-react";

interface LocationGoal {
  location: string;
  targetInteractions: number;
  interactionRange: { min: number; max: number };
  conversationDepth: "greeting" | "small_talk" | "deep";
  focusedSkills: string[];
  followUpStrategy: string;
  backupStrategy: string;
  minimumViableInteraction: string;
  successCriteria: string;
  difficulty: number;
  friendlinessScore: number;
  confidence: number;
}

const DAY4PLAN: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [goals, setGoals] = useState<LocationGoal[]>([
    {
      location: "A BOOK CLUB",
      targetInteractions: 3,
      interactionRange: { min: 2, max: 4 },
      conversationDepth: "small_talk",
      focusedSkills: ["active_listening", "asking_questions"],
      followUpStrategy: "Exchange contact info if conversation goes well",
      backupStrategy: "Smile and say nice to meet you, no pressure",
      minimumViableInteraction: "Just greet one person and ask about a book",
      successCriteria: "Had at least one genuine 2-3 min conversation",
      difficulty: 5,
      friendlinessScore: 80,
      confidence: 3,
    },
    {
      location: "The Local Cooking Studio",
      targetInteractions: 4,
      interactionRange: { min: 3, max: 5 },
      conversationDepth: "small_talk",
      focusedSkills: ["eye_contact", "compliments"],
      followUpStrategy: "Suggest grabbing coffee after if vibes are good",
      backupStrategy: "Just focus on the cooking, no forced interaction",
      minimumViableInteraction: "Compliment one person's dish",
      successCriteria: "Made someone laugh or got a genuine smile",
      difficulty: 3,
      friendlinessScore: 85,
      confidence: 3.5,
    },
    {
      location: "Community Gym - Group Fitness",
      targetInteractions: 2,
      interactionRange: { min: 1, max: 3 },
      conversationDepth: "greeting",
      focusedSkills: ["eye_contact", "body_language"],
      followUpStrategy: "Say hi at the next class if you see them",
      backupStrategy: "Just focus on your workout, that's enough",
      minimumViableInteraction: "One genuine smile and 'hey'",
      successCriteria: "Felt comfortable in the environment",
      difficulty: 6,
      friendlinessScore: 70,
      confidence: 2.5,
    },
  ]);

  const [expandedLocation, setExpandedLocation] = useState<string | null>(goals[0]?.location || null);

  const skills = [
    { id: "eye_contact", label: "Eye Contact" },
    { id: "active_listening", label: "Active Listening" },
    { id: "asking_questions", label: "Asking Questions" },
    { id: "compliments", label: "Genuine Compliments" },
    { id: "body_language", label: "Open Body Language" },
    { id: "follow_up", label: "Follow-up Skills" },
  ];

  const depthLevels = [
    { id: "greeting", label: "Greeting", desc: "Hello, how's it going?" },
    { id: "small_talk", label: "Small Talk", desc: "2-3 min chat" },
    { id: "deep", label: "Deep Talk", desc: "Genuine connection" },
  ];

  const updateGoal = (location: string, updates: Partial<LocationGoal>) => {
    setGoals(goals.map(g => g.location === location ? { ...g, ...updates } : g));
  };

  const removeGoal = (location: string) => {
    setGoals(goals.filter(g => g.location !== location));
  };

  const toggleSkill = (location: string, skillId: string) => {
    const goal = goals.find(g => g.location === location);
    if (!goal) return;

    const updated = goal.focusedSkills.includes(skillId)
      ? goal.focusedSkills.filter(s => s !== skillId)
      : [...goal.focusedSkills, skillId];

    updateGoal(location, { focusedSkills: updated });
  };

  const getSuccessProbability = (goal: LocationGoal): number => {
    const baseScore = goal.friendlinessScore;
    const confidenceBoost = goal.confidence * 5;
    const skillPrep = goal.focusedSkills.length * 5;
    const strategyBoost = goal.backupStrategy.trim() ? 10 : 0;
    return Math.min(100, baseScore + confidenceBoost + skillPrep + strategyBoost);
  };

  const getRecommendedInteractions = (difficulty: number, confidence: number): { min: number; max: number } => {
    if (difficulty <= 3 && confidence >= 3) return { min: 3, max: 5 };
    if (difficulty <= 5 && confidence >= 2.5) return { min: 2, max: 4 };
    if (difficulty >= 6 || confidence < 2.5) return { min: 1, max: 2 };
    return { min: 2, max: 3 };
  };

  const isComplete = goals.length > 0 && goals.every(
    g => g.focusedSkills.length > 0 && g.followUpStrategy.trim() && g.backupStrategy.trim()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* HEADER */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">Step 5 of 5</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Set Your Connection Goals
          </h1>

          <p className="text-base md:text-lg text-purple-200">
            Define realistic, adaptive goals for each location with built-in backup strategies.
          </p>
        </div>

        {/* GOALS SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl border-2 border-purple-500/30">
            <p className="text-xs md:text-sm text-purple-300 font-medium mb-2">Locations</p>
            <p className="text-3xl md:text-4xl font-bold text-white">{goals.length}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl border-2 border-blue-500/30">
            <p className="text-xs md:text-sm text-purple-300 font-medium mb-2">Total Targets</p>
            <p className="text-3xl md:text-4xl font-bold text-white">
              {goals.reduce((sum, g) => sum + g.targetInteractions, 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-800/60 to-purple-900/60 backdrop-blur-sm p-4 md:p-5 rounded-2xl border-2 border-green-500/30">
            <p className="text-xs md:text-sm text-purple-300 font-medium mb-2">Prep</p>
            <p className="text-3xl md:text-4xl font-bold text-white">
              {goals.filter(g => g.focusedSkills.length > 0).length}/{goals.length}
            </p>
          </div>
        </div>

        {/* GOAL CARDS */}
        <div className="space-y-4 mb-8">
          {goals.map((goal) => {
            const successProb = getSuccessProbability(goal);
            const recommended = getRecommendedInteractions(goal.difficulty, goal.confidence);
            const isExpanded = expandedLocation === goal.location;

            return (
              <div key={goal.location} className="space-y-3">
                {/* HEADER CARD */}
                <button
                  onClick={() => setExpandedLocation(isExpanded ? null : goal.location)}
                  className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-3xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all flex items-center justify-between group"
                >
                  <div className="text-left flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{goal.location}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                        <Users className="w-4 h-4 text-blue-300" />
                        <span className="text-xs md:text-sm text-blue-200 font-medium">
                          {goal.interactionRange.min}-{goal.interactionRange.max} people
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                        <Zap className="w-4 h-4 text-purple-300" />
                        <span className="text-xs md:text-sm text-purple-200 font-medium">{goal.focusedSkills.length} skills</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <Award className="w-4 h-4 text-green-300" />
                        <span className="text-xs md:text-sm text-green-200 font-medium">{Math.round(successProb)}% success</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded ? <ChevronUp className="w-6 h-6 text-purple-400" /> : <ChevronDown className="w-6 h-6 text-purple-400" />}
                </button>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 space-y-6">
                    
                    {/* 1. INTERACTION TARGET WITH SMART SUGGESTIONS */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-purple-100 text-lg">Interaction Target</h4>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full border border-blue-500/30">
                          Suggested: {recommended.min}-{recommended.max}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-purple-300 mb-2 block">Minimum (Backup Goal)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={goal.interactionRange.min}
                            onChange={(e) => updateGoal(goal.location, {
                              interactionRange: { ...goal.interactionRange, min: parseInt(e.target.value) }
                            })}
                            className="w-full h-2 bg-purple-950/50 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-xs text-purple-400 mt-1">If energy drops: {goal.interactionRange.min} person minimum</p>
                        </div>

                        <div>
                          <label className="text-sm text-purple-300 mb-2 block">Target</label>
                          <input
                            type="range"
                            min={goal.interactionRange.min}
                            max="10"
                            value={goal.targetInteractions}
                            onChange={(e) => updateGoal(goal.location, { targetInteractions: parseInt(e.target.value) })}
                            className="w-full h-2 bg-purple-950/50 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-sm font-bold text-white mt-2">Goal: {goal.targetInteractions} people</p>
                        </div>

                        <div>
                          <label className="text-sm text-purple-300 mb-2 block">Stretch</label>
                          <input
                            type="range"
                            min={goal.targetInteractions}
                            max="10"
                            value={goal.interactionRange.max}
                            onChange={(e) => updateGoal(goal.location, {
                              interactionRange: { ...goal.interactionRange, max: parseInt(e.target.value) }
                            })}
                            className="w-full h-2 bg-purple-950/50 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-xs text-purple-400 mt-1">If feeling great: reach for {goal.interactionRange.max}</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. CONVERSATION DEPTH */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-purple-100 text-lg">Conversation Depth</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {depthLevels.map((level) => (
                          <button
                            key={level.id}
                            onClick={() => updateGoal(goal.location, { conversationDepth: level.id as any })}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                              goal.conversationDepth === level.id
                                ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400/50 text-white"
                                : "bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50"
                            }`}
                          >
                            <p className="font-bold text-sm mb-1">{level.label}</p>
                            <p className="text-xs text-purple-200">{level.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3 & 6. FOCUSED SKILLS */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-purple-100 text-lg">Skills to Focus On</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {skills.map((skill) => (
                          <button
                            key={skill.id}
                            onClick={() => toggleSkill(goal.location, skill.id)}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-left ${
                              goal.focusedSkills.includes(skill.id)
                                ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400/50"
                                : "bg-purple-950/40 border-purple-700/30 hover:border-purple-600/50"
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                              goal.focusedSkills.includes(skill.id) ? "text-white" : "text-purple-500"
                            }`} />
                            <span className="text-xs md:text-sm font-medium">{skill.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. FOLLOW-UP STRATEGY */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-purple-100 text-lg">If Conversation Goes Well...</h4>
                      <textarea
                        value={goal.followUpStrategy}
                        onChange={(e) => updateGoal(goal.location, { followUpStrategy: e.target.value })}
                        placeholder="Exchange contact? Suggest next hangout? Invite to event?"
                        className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none text-sm"
                        rows={2}
                      />
                    </div>

                    {/* 8. BACKUP & MINIMUM VIABLE STRATEGIES */}
                    <div className="space-y-4 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                      <h4 className="font-bold text-purple-100 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-orange-400" />
                        Adaptive Strategies
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-purple-300 mb-2 block">Minimum Viable</label>
                          <p className="text-xs text-purple-400 mb-2">What counts as success if you're nervous?</p>
                          <textarea
                            value={goal.minimumViableInteraction}
                            onChange={(e) => updateGoal(goal.location, { minimumViableInteraction: e.target.value })}
                            placeholder="E.g., just smile, say hello, ask one question..."
                            className="w-full px-3 py-2 bg-purple-950/60 border border-purple-700/30 rounded-lg text-white placeholder-purple-400 focus:outline-none text-sm resize-none"
                            rows={1}
                          />
                        </div>

                        <div>
                          <label className="text-sm text-purple-300 mb-2 block">Backup Plan</label>
                          <p className="text-xs text-purple-400 mb-2">If energy crashes or crowd feels overwhelming</p>
                          <textarea
                            value={goal.backupStrategy}
                            onChange={(e) => updateGoal(goal.location, { backupStrategy: e.target.value })}
                            placeholder="E.g., observe, sit quietly, focus on the activity..."
                            className="w-full px-3 py-2 bg-purple-950/60 border border-purple-700/30 rounded-lg text-white placeholder-purple-400 focus:outline-none text-sm resize-none"
                            rows={1}
                          />
                        </div>

                        <div>
                          <label className="text-sm text-purple-300 mb-2 block">Success Criteria</label>
                          <p className="text-xs text-purple-400 mb-2">How will you know this went well?</p>
                          <textarea
                            value={goal.successCriteria}
                            onChange={(e) => updateGoal(goal.location, { successCriteria: e.target.value })}
                            placeholder="E.g., had a genuine laugh, felt comfortable, one good conversation..."
                            className="w-full px-3 py-2 bg-purple-950/60 border border-purple-700/30 rounded-lg text-white placeholder-purple-400 focus:outline-none text-sm resize-none"
                            rows={1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUCCESS PROBABILITY */}
                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-green-200">Success Probability</p>
                        <p className="text-2xl font-bold text-green-300">{Math.round(successProb)}%</p>
                      </div>
                      <div className="w-full h-2 bg-green-950/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${successProb}%` }}
                        />
                      </div>
                      <p className="text-xs text-green-300 mt-2">Based on location friendliness, prep, & backup strategies</p>
                    </div>

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() => removeGoal(goal.location)}
                      className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-700/50 rounded-lg text-red-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Goal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NEXT BUTTON */}
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl transition-all"
        >
          <ChevronRight className="w-6 h-6" />
          Complete Step 5 - Ready to Go!
        </button>

        {!isComplete && (
          <p className="text-center text-sm text-purple-400 mt-4">
            Set skills & strategies for all {goals.length} location{goals.length !== 1 ? 's' : ''} to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default DAY4PLAN;