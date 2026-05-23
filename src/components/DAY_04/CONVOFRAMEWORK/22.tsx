import React, { useState, useEffect } from 'react';
import {  ArrowRight , ChevronRight, ChevronDown, Copy, Check, MessageSquare, Brain, Zap, Target, RotateCcw, Lock, Trophy, Star, TrendingUp, Award, Flame, CheckCircle, BarChart2, Users, Heart, X, Sparkles } from 'lucide-react';

interface REVIEWCONVProps {
    onNext?: () => void;
}

const CONVOUPGRADE: React.FC<REVIEWCONVProps> = ({ onNext }) => {
  const [phase, setPhase] = useState('welcome');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [scenarioChoice, setScenarioChoice] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);
  const [copiedScript, setCopiedScript] = useState(null);
  const [practiceAttempts, setPracticeAttempts] = useState([]);
  const [visitedLessons, setVisitedLessons] = useState([]);
  const [unlockedLessons, setUnlockedLessons] = useState([0, 1, 2, 3]);
  const [userLevel, setUserLevel] = useState('beginner');
  const [userGoal, setUserGoal] = useState(null);
  const [skillScores, setSkillScores] = useState({
    opening: 0,
    listening: 0,
    deepening: 0,
    followup: 0
  });
  const [conversationsStarted, setConversationsStarted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [currentAssessmentQ, setCurrentAssessmentQ] = useState(0);
  const [branchingPath, setBranchingPath] = useState([]);
  const [conversationAnalysis, setConversationAnalysis] = useState('');
  const [dailyMission, setDailyMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  const lessons = [
    {
      id: 'foundation',
      title: 'Opening Lines That Feel Natural',
      duration: '3 min read + 2 min practice',
      level: 1,
      requiredScore: 0,
      skillType: 'opening',
      micro: 'The key: Comment on something shared, ask one question.',
      tips: [
        { label: 'Shared observation', detail: '"I noticed you mentioned coding—what got you interested in that?"' },
        { label: 'Genuine, not scripted', detail: 'Avoid: "So what do you do?" Better: "What keeps you busy?" (softer)' },
        { label: 'Body language', detail: 'Face them, slight lean in, eye contact 60% of the time' }
      ],
      scripts: [
        'At a meetup: "I haven\'t been to one of these in forever. First time here?"',
        'With a coworker: "I saw you working on that project—what\'s the trickiest part?"',
        'Reconnecting: "It\'s been a while! How\'ve you been spending your time lately?"'
      ],
      practicePrompts: [
        'Someone is standing alone at a coffee shop event. What do you say?',
        'You\'re in an elevator with a coworker you\'ve never talked to. Break the ice.',
        'A friend brings someone new to game night. Introduce yourself.'
      ]
    },
    {
      id: 'listening',
      title: 'Active Listening (The Underrated Superpower)',
      duration: '3 min read + 2 min practice',
      level: 2,
      requiredScore: 0,
      skillType: 'listening',
      micro: 'People want to be heard more than they want to talk. Show you\'re actually listening.',
      tips: [
        { label: 'The nod + pause', detail: 'Nod, then stay quiet for 2 seconds. They\'ll keep talking.' },
        { label: 'Reflect back', detail: 'Say: "So you\'re saying..." It shows you\'re tracking.' },
        { label: 'Ask about details, not facts', detail: 'Instead of "What\'s your job?", ask "What\'s the best part of your day at work?"' }
      ],
      scripts: [
        'Them: "I\'m stressed about my project." You: "What\'s making it stressful specifically?"',
        'Them: "I just got back from hiking." You: "What was your favorite moment on the trail?"',
        'Them: "I\'m learning guitar." You: "What\'s been the hardest thing to get right?"'
      ],
      practicePrompts: [
        'They say: "Work has been crazy." Respond with a follow-up question.',
        'They mention loving a hobby. Show you\'re listening and want to know more.',
        'They seem upset about something. Ask about their feelings, not just facts.'
      ]
    },
    {
      id: 'deepening',
      title: 'Moving from Small Talk to Real Connection',
      duration: '4 min read + 3 min practice',
      level: 3,
      requiredScore: 0,
      skillType: 'deepening',
      micro: 'The bridge: Ask about feelings, not just facts. Reference what they said earlier.',
      tips: [
        { label: 'Reference earlier', detail: 'Mid-conversation: "Earlier you mentioned you love hiking—is that your main way to relax?"' },
        { label: 'Ask feeling-based questions', detail: '"How did that make you feel?" vs "What happened?"' },
        { label: 'Share briefly', detail: 'After they answer: "I get that—I feel similar when..." (30 seconds max)' }
      ],
      scripts: [
        'Them: "I\'m thinking about changing jobs." You: "What\'s making you feel ready for a change?"',
        'Them: "I started therapy." You: "How\'s that been going for you?" Then: "I\'ve thought about it too."',
        'Them: "My family\'s complicated." You: "Do you feel comfortable talking about it?" (invites sharing)'
      ],
      practicePrompts: [
        'You\'ve been chatting for 10 minutes about surface topics. How do you deepen?',
        'They mentioned something personal earlier. Circle back to it naturally.',
        'The conversation feels shallow. Ask something that reveals values or feelings.'
      ]
    },
    {
      id: 'followup',
      title: 'The Casual Follow-Up (Turning One Chat into a Relationship)',
      duration: '3 min read + 2 min practice',
      level: 4,
      requiredScore: 0,
      skillType: 'followup',
      micro: 'Low-pressure invitations. Make it easy for them to say yes (or no).',
      tips: [
        { label: 'Specific but casual', detail: '"Coffee next week?" beats "Want to hang out sometime?"' },
        { label: 'Give an out', detail: '"No pressure, but coffee this Saturday? Let me know—I\'m flexible."' },
        { label: 'Reference your conversation', detail: '"You mentioned loving that café—want to check it out?"' }
      ],
      scripts: [
        'After chatting: "This was really nice. Coffee sometime?" (Leave it vague if you\'re nervous)',
        'Via text later: "Hey, that conversation was great. Free Tuesday or Wednesday?"',
        'In person: "I really enjoyed talking with you. Would love to do it again—maybe this week?"'
      ],
      practicePrompts: [
        'You had a great conversation at a party. How do you follow up the next day?',
        'Someone seems interested but busy. Suggest something without being pushy.',
        'You want to reconnect with someone after months. Craft the text.'
      ]
    }
  ];

  const scenarios = [
    {
      id: 'meetup',
      title: 'At a Meetup/Event (You\'re Nervous)',
      level: 1,
      setting: 'Coffee shop, tech meetup. 5 people mingling. You don\'t know anyone.',
      starter: 'Someone is standing alone near the refreshments.',
      depth: 0,
      choices: [
        {
          text: '"Hi, first time here?"',
          feedback: 'Good! Low stakes, shows interest. They\'ll likely engage.',
          score: 85,
          nextStep: 'Now they say "Yeah, kind of nervous." What do you do?',
          depth: 1,
          followChoices: [
            { 
              text: '"Me too! What brought you here?"', 
              feedback: 'Perfect. Honest + curious. They\'ll open up.', 
              score: 90,
              depth: 2,
              nextStep: 'They say "I\'m trying to learn more about AI." Continue the conversation.',
              followChoices: [
                { text: '"That\'s awesome! What aspect interests you most?"', feedback: '🎯 Excellent depth! You\'re building real connection.', score: 95, depth: 3 },
                { text: '"Cool! I\'m into that too."', feedback: 'Good but now ask about them: "What got you interested?"', score: 70, depth: 3 }
              ]
            },
            { text: '"Don\'t worry, everyone\'s friendly here."', feedback: 'Reassuring but shifts focus. Try asking about them instead.', score: 60, depth: 2 },
          ]
        },
        {
          text: '"I\'m [Your Name]. What brings you here?"',
          feedback: 'Solid. Direct, shows vulnerability by introducing yourself first.',
          score: 80,
          depth: 1,
          nextStep: 'They say "I code, thought I\'d meet people." What\'s your move?',
          followChoices: [
            { text: '"That\'s cool. What kind of coding?"', feedback: 'Good—keeps them talking. Now you listen.', score: 85, depth: 2 },
            { text: '"Oh nice, I code too!"', feedback: 'True, but now pivot: ask them about their work, not yours yet.', score: 65, depth: 2 },
          ]
        }
      ]
    },
    {
      id: 'coworker',
      title: 'Reconnecting with an Old Friend (Via Text)',
      level: 2,
      setting: 'You haven\'t talked to them in 6 months. You\'re both busy.',
      starter: 'You want to suggest catching up without being weird.',
      depth: 0,
      choices: [
        {
          text: '"Hey! Been a minute. Coffee sometime?"',
          feedback: 'Perfect. Acknowledges time gap, casual invite, no pressure.',
          score: 90,
          depth: 1,
          nextStep: 'They respond "Yeah! Maybe in a few weeks?" How do you respond?',
          followChoices: [
            { text: '"Cool, I\'ll check in soon!"', feedback: 'Great. Genuine interest without neediness.', score: 90, depth: 2 },
            { text: 'Don\'t reply right away', feedback: 'Understandable but risky. Better: "Cool, I\'ll send dates next week!"', score: 40, depth: 2 },
          ]
        },
        {
          text: '"Yo! Long time no see. What\'s up?"',
          feedback: 'Casual but vague. Add a specific invite to show intent.',
          score: 65,
          depth: 1,
          nextStep: 'They reply "Not much, you?" Continue...',
          followChoices: [
            { text: '"Same. Want to grab coffee next week?"', feedback: '✓ Good recovery! Specific invitation.', score: 85, depth: 2 },
            { text: '"Just working a lot haha"', feedback: 'Small talk territory. Make a concrete plan or the conversation dies.', score: 50, depth: 2 },
          ]
        }
      ]
    }
  ];

  const assessmentQuestions = [
    {
      q: "Someone approaches you at a party. Your first thought is:",
      options: [
        { text: "Oh no, what do I say?", level: 'beginner', points: 1 },
        { text: "I can handle small talk but it feels awkward", level: 'intermediate', points: 2 },
        { text: "I'm comfortable chatting but want deeper connections", level: 'advanced', points: 3 }
      ]
    },
    {
      q: "When someone shares something personal, you usually:",
      options: [
        { text: "Feel uncomfortable and change the subject", level: 'beginner', points: 1 },
        { text: "Nod and say 'that's tough' but don't know what to ask", level: 'intermediate', points: 2 },
        { text: "Ask follow-up questions about their feelings", level: 'advanced', points: 3 }
      ]
    },
    {
      q: "After a good conversation with someone new, you:",
      options: [
        { text: "Hope they reach out but don't follow up", level: 'beginner', points: 1 },
        { text: "Say 'we should hang out!' but never make plans", level: 'intermediate', points: 2 },
        { text: "Suggest something specific within a few days", level: 'advanced', points: 3 }
      ]
    },
    {
      q: "How do you feel about silence in conversations?",
      options: [
        { text: "Terrified. I scramble to fill it immediately", level: 'beginner', points: 1 },
        { text: "Uncomfortable but I can tolerate brief pauses", level: 'intermediate', points: 2 },
        { text: "Comfortable. Silence can be natural", level: 'advanced', points: 3 }
      ]
    },
    {
      q: "Your biggest challenge in conversations is:",
      options: [
        { text: "Starting them - I freeze up", level: 'beginner', points: 1 },
        { text: "Moving past small talk", level: 'intermediate', points: 2 },
        { text: "Maintaining connections over time", level: 'advanced', points: 3 }
      ]
    }
  ];

  const goalOptions = [
    { id: 'new_friends', text: 'Make 1-2 new friends this month', icon: Users },
    { id: 'deeper', text: 'Have deeper talks with existing friends', icon: Heart },
    { id: 'networking', text: 'Network confidently at events', icon: Target },
    { id: 'dating', text: 'Feel more confident in dating scenarios', icon: MessageSquare }
  ];

  const dailyMissions = [
    { text: "Compliment a stranger today", difficulty: 'easy', points: 10 },
    { text: "Ask someone 'How are you really doing?' instead of just 'How are you?'", difficulty: 'medium', points: 20 },
    { text: "Text someone you haven't talked to in 3+ months", difficulty: 'medium', points: 20 },
    { text: "In your next conversation, ask 3 follow-up questions before sharing about yourself", difficulty: 'hard', points: 30 },
    { text: "Start a conversation with someone new today", difficulty: 'medium', points: 25 }
  ];

  const achievementsList = [
    { id: 'first_practice', title: 'First Steps', desc: 'Complete your first practice', icon: '🎯' },
    { id: 'three_practices', title: 'Building Momentum', desc: 'Complete 3 practice sessions', icon: '🔥' },
    { id: 'lesson_complete', title: 'Knowledge Seeker', desc: 'Complete your first lesson', icon: '📚' },
    { id: 'first_mission', title: 'Real World Warrior', desc: 'Complete your first daily mission', icon: '⚡' },
    { id: 'week_streak', title: 'Consistency King', desc: '7 day practice streak', icon: '👑' },
    { id: 'scenario_master', title: 'Scenario Master', desc: 'Score 90+ on any scenario', icon: '🌟' }
  ];

  useEffect(() => {
    if (!dailyMission) {
      const randomMission = dailyMissions[Math.floor(Math.random() * dailyMissions.length)];
      setDailyMission(randomMission);
    }
  }, []);

  useEffect(() => {
    const newAchievements = [...achievements];
    
    if (practiceAttempts.length >= 1 && !achievements.find(a => a.id === 'first_practice')) {
      const achievement = { ...achievementsList.find(a => a.id === 'first_practice'), unlocked: true };
      newAchievements.push(achievement);
      setNewAchievement(achievement);
    }
    if (practiceAttempts.length >= 1 && !achievements.find(a => a.id === 'three_practices')) {
      const achievement = { ...achievementsList.find(a => a.id === 'three_practices'), unlocked: true };
      newAchievements.push(achievement);
      setNewAchievement(achievement);
    }
    if (completedMissions.length >= 1 && !achievements.find(a => a.id === 'first_mission')) {
      const achievement = { ...achievementsList.find(a => a.id === 'first_mission'), unlocked: true };
      newAchievements.push(achievement);
      setNewAchievement(achievement);
    }
    if (streak >= 7 && !achievements.find(a => a.id === 'week_streak')) {
      const achievement = { ...achievementsList.find(a => a.id === 'week_streak'), unlocked: true };
      newAchievements.push(achievement);
      setNewAchievement(achievement);
    }
    
    if (newAchievements.length !== achievements.length) {
      setAchievements(newAchievements);
    }
  }, [practiceAttempts, completedMissions, streak]);

  const analyzeResponse = (text, skillType) => {
    const words = text.trim().split(/\s+/);
    const hasQuestion = text.includes('?');
    const hasPersonal = /\b(i|me|my|myself)\b/i.test(text);
    const hasFeeling = /\b(feel|felt|feeling|think|thought|believe)\b/i.test(text);
    const hasFollowUp = /\b(what|how|why|when|where|tell me)\b/i.test(text);
    
    let score = 50;
    let tips = [];
    
    if (skillType === 'opening') {
      if (hasQuestion) score += 20;
      else tips.push('Try adding a question to engage them');
      
      if (words.length >= 5 && words.length <= 15) score += 15;
      else if (words.length < 5) tips.push('Add a bit more - make it conversational');
      else tips.push('Keep it shorter - you want them to respond');
      
      if (!text.toLowerCase().includes('hi') && !text.toLowerCase().includes('hey')) score += 15;
      else tips.push('Go beyond "hi/hey" - reference something specific');
    }
    
    if (skillType === 'listening') {
      if (hasFollowUp) score += 25;
      else tips.push('Ask a follow-up question to show you\'re listening');
      
      if (hasFeeling) score += 20;
      else tips.push('Try asking about their feelings, not just facts');
      
      if (!hasPersonal || hasQuestion) score += 15;
      else tips.push('Focus on them, not yourself yet');
    }
    
    if (skillType === 'deepening') {
      if (hasFeeling) score += 25;
      else tips.push('Ask about emotions: "How did that make you feel?"');
      
      if (hasPersonal && hasQuestion) score += 20;
      else tips.push('Share briefly about yourself, then ask about them');
      
      if (words.length >= 10) score += 10;
      else tips.push('Go deeper - ask something that reveals values or feelings');
    }
    
    if (skillType === 'followup') {
      const hasSpecific = /\b(tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|tonight|week|weekend)\b/i.test(text);
      if (hasSpecific) score += 30;
      else tips.push('Be specific about when - "Tuesday or Wednesday?"');
      
      const hasCasual = /\b(maybe|if|pressure|flexible|whenever)\b/i.test(text);
      if (hasCasual) score += 15;
      else tips.push('Give them an easy out: "No pressure, but..."');
    }
    
    score = Math.min(100, Math.max(0, score));
    
    return { score, tips, hasQuestion, hasPersonal, hasFeeling, wordCount: words.length };
  };

  // Inside the CONVOUPGRADE component function:

// State for general notifications (based on the snippet you provided in a previous turn)
const [notification, setNotification] = useState<string>(''); 
// ... other states ...

// Notification helper function (Add this early!)
const showNotification = (message: string) => {
  setNotification(message);
  // Clear notification after 3 seconds
  setTimeout(() => setNotification(''), 3000); 
};

  const handlePracticeSubmit = async (
  currentLessonId: number,
  userInput: string,
  scenario: any, // Use the correct type for your scenario object
  skillType: string
) => {
    // --- Existing Analysis Simulation/API Call ---
    // NOTE: Keep all your existing logic for generating the 'analysis' object,
    // updating the 'feedback' state, and adding the attempt to 'practiceAttempts'.
    
    // Example placeholder for the simulated analysis object
    // You should use the actual logic from your file here.
    const analysis = {
        score: Math.floor(Math.random() * 100), // Placeholder score
        summary: 'Your message was clear but lacked a hook. Try self-deprecating humor!',
        keyPoints: ['Hook', 'Clarity']
    };

    // ---------------------------------------------
    // --- MODIFIED LESSON UNLOCK LOGIC (Requirement Removed) ---
    // ---------------------------------------------

    // 1. Update the overall conversation history and feedback
    setFeedback(analysis);
    setUserInput(userInput); // Assuming you reset or update userInput after submission

    // 2. Unconditionally unlock the next lesson
    setUnlockedLessons(prev => {
        const nextLessonId = currentLessonId + 1;

        if (!prev.includes(nextLessonId)) {
            // Unlock and notify
            showNotification(`Practice submitted! Lesson ${nextLessonId + 1} Unlocked! 🎉`);
            return [...prev, nextLessonId];
        }
        // Notify user about the practice itself
        showNotification(`Practice submitted! Score: ${analysis.score}%. Keep refining your skills!`);
        return prev;
    });

    // 3. Update the historical log (practiceAttempts)
    setPracticeAttempts(prev => [
        ...prev,
        {
            text: userInput,
            score: analysis.score,
            skillType: skillType,
            timestamp: new Date().toLocaleTimeString(),
        },
    ]);
};

  const handleScenarioChoice = (choice) => {
    setBranchingPath([...branchingPath, choice]);
    setScenarioChoice(choice);
    setFeedback({
      message: choice.feedback,
      score: choice.score,
      nextStep: choice.nextStep,
      followChoices: choice.followChoices,
      depth: choice.depth
    });
    
    if (choice.score >= 85) {
      const avgScore = Math.round((skillScores.opening + choice.score) / 2);
      setSkillScores({ ...skillScores, opening: avgScore });
    }

    if (choice.score >= 90 && !achievements.find(a => a.id === 'scenario_master')) {
      const achievement = { ...achievementsList.find(a => a.id === 'scenario_master'), unlocked: true };
      setAchievements([...achievements, achievement]);
      setNewAchievement(achievement);
    }
  };

  const completeMission = () => {
    if (dailyMission && !completedMissions.includes(dailyMission.text)) {
      setCompletedMissions([...completedMissions, dailyMission.text]);
      setConversationsStarted(conversationsStarted + 1);
      setShowMissionComplete(true);
      
      setTimeout(() => {
        setShowMissionComplete(false);
        const remaining = dailyMissions.filter(m => !completedMissions.includes(m.text));
        if (remaining.length > 0) {
          setDailyMission(remaining[Math.floor(Math.random() * remaining.length)]);
        }
      }, 2000);
    }
  };

  const analyzeConversation = () => {
    if (!conversationAnalysis.trim()) return;
    
    const lines = conversationAnalysis.split('\n').filter(l => l.trim());
    const questionCount = (conversationAnalysis.match(/\?/g) || []).length;
    const youLines = lines.filter(l => l.toLowerCase().startsWith('you:') || l.toLowerCase().startsWith('me:')).length;
    const themLines = lines.length - youLines;
    
    const ratio = youLines / (themLines || 1);
    
    let analysis = {
      questionCount,
      youLines,
      themLines,
      ratio,
      feedback: []
    };
    
    if (ratio > 2) {
      analysis.feedback.push('⚠️ You talked a lot more than them. Try listening more.');
    } else if (ratio < 0.5) {
      analysis.feedback.push('💡 You let them dominate. Share more about yourself to build connection.');
    } else {
      analysis.feedback.push('✓ Good balance between talking and listening!');
    }
    
    if (questionCount < 2) {
      analysis.feedback.push('❓ Only ' + questionCount + ' questions. Ask more to keep them engaged.');
    } else if (questionCount >= 3) {
      analysis.feedback.push('✓ Great use of questions to show curiosity!');
    }
    
    const hasDeepWords = /\b(feel|felt|why|struggle|excited|worried|dream|hope|fear)\b/i.test(conversationAnalysis);
    if (hasDeepWords) {
      analysis.feedback.push('🎯 You went beyond surface level - excellent depth!');
    } else {
      analysis.feedback.push('💭 Try asking about feelings or motivations to deepen connection.');
    }
    
    setFeedback({ analysis });
  };

  // WELCOME PHASE
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 pt-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-6 animate-pulse">
              Conversation Gym
            </h1>
            <p className="text-purple-200 text-xl md:text-2xl mb-4">Train Your Social Skills Like a Pro Athlete</p>
            <p className="text-purple-300 text-lg">Learn • Practice • Level Up • Apply</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-500/30">
              <Brain className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-blue-100 mb-2">Smart Learning</h3>
              <p className="text-blue-200 text-sm">AI-powered feedback on every practice attempt</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30">
              <Target className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-purple-100 mb-2">Real Scenarios</h3>
              <p className="text-purple-200 text-sm">Practice situations you'll actually face</p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-500/30">
              <TrendingUp className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-pink-100 mb-2">Track Progress</h3>
              <p className="text-pink-200 text-sm">See your skills improve with every session</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-4 text-center">What's Holding You Back?</h2>
            <p className="text-purple-300 text-center mb-6">Let's figure out where to start your journey</p>
            <button 
              onClick={() => setPhase('assessment')}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-3"
            >
              Take 2-Minute Assessment <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-purple-400 text-sm">
            <p>✓ No signup required • ✓ Practice safely • ✓ Build real confidence</p>
          </div>
        </div>
      </div>
    );
  }

  // ASSESSMENT PHASE
  if (phase === 'assessment') {
    const currentQ = assessmentQuestions[currentAssessmentQ];
    const progress = ((currentAssessmentQ + 1) / assessmentQuestions.length) * 100;

    if (currentAssessmentQ >= assessmentQuestions.length) {
      const totalPoints = assessmentAnswers.reduce((sum, a) => sum + a.points, 0);
      const avgPoints = totalPoints / assessmentAnswers.length;
      
      let level = 'beginner';
      if (avgPoints >= 2.5) level = 'advanced';
      else if (avgPoints >= 1.8) level = 'intermediate';
      
      setTimeout(() => {
        setUserLevel(level);
        setPhase('goals');
      }, 2000);

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-purple-100 mb-4">Assessment Complete!</h2>
              <p className="text-purple-300 text-lg">Analyzing your responses...</p>
            </div>
            <div className="bg-purple-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30">
              <p className="text-purple-200">Your personalized learning path is being created</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm">Question {currentAssessmentQ + 1} of {assessmentQuestions.length}</span>
              <span className="text-purple-300 text-sm">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-purple-900/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-purple-500/30">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100 mb-8">{currentQ.q}</h2>
            
            <div className="space-y-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAssessmentAnswers([...assessmentAnswers, { 
  question: currentQ.q, 
  answer: option.text, 
  points: option.points, 
  level: option.level || 'beginner'  // This should work since all options have level defined
}]);
                    setCurrentAssessmentQ(currentAssessmentQ + 1);
                  }}
                  className="w-full text-left p-5 bg-gradient-to-r from-purple-800/40 to-indigo-800/40 hover:from-purple-700/60 hover:to-indigo-700/60 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all group"
                >
                  <p className="text-purple-100 font-medium group-hover:text-white transition-colors">{option.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GOALS PHASE
  if (phase === 'goals') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/50 mb-6">
              <p className="text-green-300 font-bold">
                You're {userLevel === 'beginner' ? 'a Beginner' : userLevel === 'intermediate' ? 'an Intermediate' : 'Advanced'}!
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-4">What's Your Goal?</h2>
            <p className="text-purple-300 text-lg">We'll personalize your learning path based on this</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {goalOptions.map((goal) => {
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    setUserGoal(goal.id);
                    setPhase('overview');
                    setStreak(1);
                  }}
                  className="p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all text-left group hover:scale-105"
                >
                  <Icon className="w-10 h-10 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
                  <p className="text-lg font-bold text-purple-100 group-hover:text-white transition-colors">{goal.text}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30">
            <p className="text-purple-200 text-center">
              ✨ Your personalized program starts with <strong>Level 1: Foundation</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // OVERVIEW PHASE (Main Dashboard)
  if (phase === 'overview') {
    const totalSkillAvg = Math.round((skillScores.opening + skillScores.listening + skillScores.deepening + skillScores.followup) / 4);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-purple-100">Your Journey</h1>
              <p className="text-purple-300">Level {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}</p>
            </div>
            <button 
              onClick={() => setPhase('dashboard')}
              className="px-6 py-3 bg-purple-800/50 hover:bg-purple-800/70 rounded-2xl border border-purple-500/30 flex items-center gap-2 transition-all"
            >
              <BarChart2 className="w-5 h-5" /> Stats
            </button>
          </div>

          

          {dailyMission && (
    // Outer Box: Amber/Orange theme
    <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-amber-500/30 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Mission Details Block (Left/Top) */}
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-bold text-amber-100">Daily Mission</h3>
                    <span className="px-3 py-1 bg-amber-500/20 rounded-full text-xs font-semibold text-amber-300 ml-auto md:ml-0">
                        {dailyMission.difficulty}
                    </span>
                </div>
                
                {/* Mission Text (The main goal) */}
                <p className="text-lg text-amber-50 font-medium">{dailyMission.text}</p>
                
                {/* Reward XP */}
                <p className="text-sm text-amber-300 flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Reward: <span className="font-bold text-amber-200">+{dailyMission.points} XP</span>
                </p>
            </div>
            
            {/* Action Button Block (Right/Bottom) */}
            <button
                onClick={completeMission}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-lg flex-shrink-0"
            >
                Complete Mission
            </button>
        </div>
    </div>
)}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-100 mb-4">Learning Path</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {lessons.map((lesson, idx) => {
  // Early return if lesson is undefined
  if (!lesson) return null;
  
  const isUnlocked = unlockedLessons.includes(idx);
  const isComplete = skillScores[lesson.skillType] >= 30;
                
  return (
    <div 
      key={lesson.id || `lesson-${idx}`}
      className={`relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 transition-all ${
        isUnlocked 
          ? 'border-purple-500/30 hover:border-purple-400/50 cursor-pointer hover:scale-102' 
          : 'border-gray-700/30 opacity-50'
      }`}
      onClick={() => {
  if (isUnlocked) {
    setCurrentLesson(idx);
    setPhase('lesson');
    // Mark lesson as visited
    if (!visitedLessons.includes(idx)) {
      setVisitedLessons([...visitedLessons, idx]);
    }
  }
}}
    >
      {!isUnlocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
      )}
      {isComplete && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-purple-200">
            {lesson.level || 0}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-purple-100 mb-1">{lesson.title}</h3>
          <p className="text-sm text-purple-300">{lesson.micro}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-purple-400">{lesson.duration}</p>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-purple-900/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${skillScores[lesson.skillType] || 0}%` }}
            />
          </div>
          <span className="text-xs text-purple-300">
            {skillScores[lesson.skillType] || 0}%
          </span>
        </div>
      </div>
    </div>
  );
})}
            </div>
          </div>

          
          {visitedLessons.length >= 1 && (
  <div className="mt-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-green-500/30 text-center">
    <h3 className="text-2xl font-bold text-green-100 mb-3">🎉 All Lessons Explored!</h3>
    <p className="text-green-300 mb-4">You've visited all 4 core lessons. Ready to put it all together?</p>
    <button
       onClick={() => {
        setCurrentLesson(currentLesson + 1);
        setExpandedTip(null);
        setCopiedScript(null);
        onNext();
      }}
      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all shadow-lg"
    >
      Move On to Real Scenarios →
    </button>
  </div>
)}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setPhase('analyzer')}
              className="p-6 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-3xl border-2 border-blue-500/30 hover:border-blue-400/50 transition-all text-left group"
            >
              <MessageSquare className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-blue-100 mb-2">Analyze Past Conversation</h3>
              <p className="text-sm text-blue-300">Get AI feedback on a real conversation you had</p>
            </button>
            
            
          </div>
        </div>

        {/* Achievement Modal */}
        {showAchievementModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-purple-500/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-purple-100">Your Achievements</h2>
                <button onClick={() => setShowAchievementModal(false)} className="text-purple-300 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {achievementsList.map((achievement) => {
                  const isUnlocked = achievements.find(a => a.id === achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-yellow-500/50' 
                          : 'bg-gray-900/40 border-gray-700/30 opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-1">{achievement.title}</h3>
                      <p className="text-sm text-purple-300">{achievement.desc}</p>
                      {isUnlocked && (
                        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" /> Unlocked!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mission Complete Popup */}
        {showMissionComplete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white px-8 py-6 rounded-3xl shadow-2xl animate-bounce border-4 border-white/30">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">Mission Complete!</p>
                  <p className="text-sm">+{dailyMission?.points} XP</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Achievement Popup */}
        {newAchievement && (
          <div className="fixed bottom-8 right-8 bg-gradient-to-br from-yellow-500 to-amber-500 text-white p-6 rounded-3xl shadow-2xl border-4 border-white/30 animate-bounce z-50">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{newAchievement.icon}</div>
              <div>
                <p className="text-sm font-bold text-yellow-100">Achievement Unlocked!</p>
                <p className="text-xl font-bold">{newAchievement.title}</p>
                <p className="text-sm text-yellow-100">{newAchievement.desc}</p>
              </div>
              <button onClick={() => setNewAchievement(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LESSON PHASE
  // LESSON PHASE
if (phase === 'lesson') {
  const lesson = lessons[currentLesson];
  
  // Safety check: redirect if lesson doesn't exist
  if (!lesson) {
    setPhase('overview');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setPhase('overview')} className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-6 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Dashboard
        </button>

        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
              <span className="text-xl font-bold text-purple-200">{lesson.level || 0}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-purple-100">{lesson.title}</h1>
                <p className="text-sm text-purple-400">{lesson.duration}</p>
              </div>
            </div>
            
            <p className="text-lg text-purple-300 mb-6 bg-purple-950/30 p-4 rounded-2xl border border-purple-700/30">
              💡 {lesson.micro}
            </p>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-purple-100">Key Techniques</h3>
              {lesson.tips.map((tip, idx) => (
                <div key={idx} className="bg-purple-950/30 rounded-2xl border border-purple-700/30 overflow-hidden">
                  <button 
                    onClick={() => setExpandedTip(expandedTip === idx ? null : idx)} 
                    className="w-full p-4 flex items-center justify-between hover:bg-purple-950/50 transition-colors"
                  >
                    <span className="font-bold text-purple-100">{tip.label}</span>
                    {expandedTip === idx ? <ChevronDown className="w-5 h-5 text-purple-400" /> : <ChevronRight className="w-5 h-5 text-purple-400" />}
                  </button>
                  {expandedTip === idx && (
                    <div className="px-4 pb-4 pt-0 text-purple-300 border-t border-purple-700/30">
                      <p className="italic mt-3">{tip.detail}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-purple-100 mb-3">Example Scripts (Copy & Use)</h3>
              <div className="space-y-3">
                {lesson.scripts.map((script, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 p-4 rounded-2xl border border-purple-500/30 flex items-start justify-between group">
                    <p className="text-purple-100">{script}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(script);
                        setCopiedScript(idx);
                        setTimeout(() => setCopiedScript(null), 2000);
                      }} 
                      className="ml-3 flex-shrink-0"
                    >
                      {copiedScript === idx ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setPhase('practice')} 
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" /> Practice This Now
              </button>
              {currentLesson < lessons.length - 1 && unlockedLessons.includes(currentLesson + 1) && (
                <button 
                  onClick={() => {
                    setCurrentLesson(currentLesson + 1);
                    setExpandedTip(null);
                    setCopiedScript(null);
                  }} 
                  className="px-6 py-4 bg-purple-800/50 hover:bg-purple-800/70 rounded-2xl font-bold transition-all border border-purple-500/30"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PRACTICE PHASE
  if (phase === 'practice') {
    const lesson = lessons[currentLesson];
    const practicePrompt = lesson.practicePrompts[practiceAttempts.length % lesson.practicePrompts.length];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setPhase('lesson')} className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-6 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" /> Back to Lesson
          </button>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-purple-100">Practice Zone</h2>
                <p className="text-sm text-purple-400">Skill: {lesson.skillType.charAt(0).toUpperCase() + lesson.skillType.slice(1)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 p-5 rounded-2xl border-2 border-indigo-500/30 mb-6">
              <p className="text-indigo-200 mb-2"><strong>Scenario:</strong></p>
              <p className="text-indigo-100 text-lg">{practicePrompt}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-purple-200 mb-3">Your Response:</label>
              <textarea 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                placeholder="Type what you would say... Be natural, be you." 
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none transition-all" 
                rows={4} 
              />
              <p className="text-xs text-purple-400 mt-2">💡 Tip: {lesson.micro}</p>
            </div>
            <button 
        onClick={handlePracticeSubmit} 
        // FIX: Ensures the button is disabled if userInput is null/undefined OR just whitespace.
        disabled={!userInput || !userInput.trim()} 
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Zap className="w-5 h-5" /> Get AI Feedback
      </button>

        <button 
        onClick={() => {
          setCurrentLesson(currentLesson + 1);
          setPhase('lesson');
          setPracticeAttempts([]);
          setFeedback(null);
        }} 
        // Using w-full and the same padding/font size as the first button for consistency
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        Next Lesson <ArrowRight className="w-5 h-5" />
      </button>

            {feedback && (
              <div className="mt-6 p-5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border-2 border-green-500/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-green-100 font-bold text-lg">Feedback</p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-green-100">{feedback.score}%</div>
                    {feedback.score >= 90 && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />}
                  </div>
                </div>
                <p className="text-green-50 mb-3">{feedback.message}</p>
                {feedback.tips && feedback.tips.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-500/30">
                    <p className="text-xs text-green-200 font-bold mb-2">Next Level Tips:</p>
                    <ul className="text-sm text-green-100 space-y-1">
                      {feedback.tips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-100">Your Attempts ({practiceAttempts.length})</h3>
                <button 
                  onClick={() => {
                    setPracticeAttempts([]);
                    setFeedback(null);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {practiceAttempts.map((attempt, idx) => (
                  <div key={idx} className="bg-purple-950/30 p-3 rounded-lg border border-purple-700/30">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-purple-300 text-sm flex-1">{attempt.text}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          attempt.score >= 10? 'bg-green-500/20 text-green-300' :
                          attempt.score >= 10? 'bg-blue-500/20 text-blue-300' :
                          attempt.score >= 10? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-orange-500/20 text-orange-300'
                        }`}>
                          {attempt.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-purple-400 text-xs mt-1">{attempt.timestamp}</p>
                  </div>
                ))}
              </div>
              
              {practiceAttempts.length >= 1 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/50">
                  <p className="text-purple-200 mb-3">🎉 Great practice! Ready for the next step?</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setPhase('overview')} 
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-all"
                    >
                      Back to Dashboard
                    </button>
                    {currentLesson < lessons.length - 1 && unlockedLessons.includes(currentLesson + 1) && (
                      <button 
                        onClick={() => {
                          setCurrentLesson(currentLesson + 1);
                          setPhase('lesson');
                          setPracticeAttempts([]);
                          setFeedback(null);
                        }} 
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCENARIO PHASE
  if (phase === 'scenario') {
    const scenario = scenarios[currentScenario];
    const currentChoices = feedback?.followChoices || scenario.choices;
    const currentDepth = feedback?.depth || 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => {
              setPhase('overview');
              setBranchingPath([]);
              setFeedback(null);
            }} 
            className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-6 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" /> Back to Dashboard
          </button>

          <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-indigo-500/30 mb-6">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-100 mb-2">{scenario.title}</h2>
              <p className="text-indigo-300 text-sm mb-4">{scenario.setting}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-indigo-900/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(currentDepth / 3) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-indigo-300">Depth: {currentDepth}/3</span>
              </div>
            </div>

            {branchingPath.length === 0 && (
              <div className="bg-gradient-to-r from-blue-800/40 to-indigo-800/40 p-5 rounded-2xl border border-blue-500/30 mb-6">
                <p className="text-blue-100 text-lg"><strong>Situation:</strong> {scenario.starter}</p>
              </div>
            )}

            {feedback && (
              <div className="mb-6 p-5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border-2 border-green-500/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-green-100 font-bold">Feedback</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    feedback.score >= 90 ? 'bg-green-500/30 text-green-200' :
                    feedback.score >= 75 ? 'bg-blue-500/30 text-blue-200' :
                    'bg-yellow-500/30 text-yellow-200'
                  }`}>
                    {feedback.score}%
                  </span>
                </div>
                <p className="text-green-50 mb-3">{feedback.message}</p>
                {feedback.nextStep && (
                  <div className="mt-3 pt-3 border-t border-green-500/30">
                    <p className="text-green-200 italic">{feedback.nextStep}</p>
                  </div>
                )}
              </div>
            )}

            {currentChoices && currentChoices.length > 0 && (
              <div className="space-y-3">
                <p className="text-indigo-200 font-bold mb-3">What do you say?</p>
                {currentChoices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleScenarioChoice(choice)}
                    className="w-full text-left p-5 bg-gradient-to-r from-indigo-800/40 to-blue-800/40 hover:from-indigo-700/60 hover:to-blue-700/60 rounded-2xl border-2 border-indigo-500/30 hover:border-indigo-400/50 transition-all group"
                  >
                    <p className="text-indigo-100 font-medium group-hover:text-white transition-colors">{choice.text}</p>
                  </button>
                ))}
              </div>
            )}

            {currentDepth >= 3 && (
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border-2 border-purple-500/50">
                <div className="text-center mb-4">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-purple-100 mb-2">Scenario Complete!</h3>
                  <p className="text-purple-300">You navigated the full conversation</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setBranchingPath([]);
                      setFeedback(null);
                    }} 
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => setPhase('overview')} 
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {branchingPath.length > 0 && (
              <div className="mt-8 pt-6 border-t border-indigo-700/30">
                <h3 className="text-lg font-bold text-indigo-100 mb-3">Conversation Path</h3>
                <div className="space-y-2">
                  {branchingPath.map((choice, idx) => (
                    <div key={idx} className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-700/30">
                      <p className="text-indigo-300 text-sm">{choice.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          choice.score >= 90 ? 'bg-green-500/20 text-green-300' :
                          choice.score >= 75 ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {choice.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ANALYZER PHASE
  if (phase === 'analyzer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => {
              setPhase('overview');
              setConversationAnalysis('');
              setFeedback(null);
            }} 
            className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-6 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" /> Back to Dashboard
          </button>

          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-3xl font-bold text-blue-100">Conversation Analyzer</h2>
                <p className="text-sm text-blue-300">Paste a recent conversation and get AI feedback</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-blue-200 mb-3">
                Paste Your Conversation
                <span className="text-xs font-normal text-blue-400 ml-2">(Format: "You: ..." and "Them: ...")</span>
              </label>
              <textarea 
                value={conversationAnalysis} 
                onChange={(e) => setConversationAnalysis(e.target.value)} 
                placeholder={"You: Hey! How have you been?\nThem: Pretty good, just busy with work.\nYou: What's been keeping you busy?\nThem: Working on a big project..."} 
                className="w-full px-4 py-3 bg-blue-950/50 border-2 border-blue-500/30 rounded-2xl text-white placeholder-blue-400 focus:outline-none focus:border-blue-400 resize-none transition-all font-mono text-sm" 
                rows={12} 
              />
            </div>

            <button 
              onClick={analyzeConversation} 
              disabled={!conversationAnalysis.trim()} 
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Brain className="w-5 h-5" /> Analyze Conversation
            </button>

            {feedback?.analysis && (
              <div className="mt-6 p-5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border-2 border-cyan-500/50">
                <h3 className="text-xl font-bold text-cyan-100 mb-4">Analysis Results</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-cyan-950/30 p-4 rounded-xl">
                    <p className="text-xs text-cyan-400 mb-1">Your Lines</p>
                    <p className="text-2xl font-bold text-cyan-100">{feedback.analysis.youLines}</p>
                  </div>
                  <div className="bg-cyan-950/30 p-4 rounded-xl">
                    <p className="text-xs text-cyan-400 mb-1">Their Lines</p>
                    <p className="text-2xl font-bold text-cyan-100">{feedback.analysis.themLines}</p>
                  </div>
                  <div className="bg-cyan-950/30 p-4 rounded-xl">
                    <p className="text-xs text-cyan-400 mb-1">Questions Asked</p>
                    <p className="text-2xl font-bold text-cyan-100">{feedback.analysis.questionCount}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {feedback.analysis.feedback.map((item, idx) => (
                    <div key={idx} className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-700/30">
                      <p className="text-cyan-100">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD PHASE (Full Stats)
  if (phase === 'dashboard') {
    const totalSkillAvg = Math.round((skillScores.opening + skillScores.listening + skillScores.deepening + skillScores.followup) / 4);
    const totalPractices = practiceAttempts.length;
    const avgPracticeScore = totalPractices > 0 
      ? Math.round(practiceAttempts.reduce((sum, a) => sum + a.score, 0) / totalPractices) 
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setPhase('overview')} 
            className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-6 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" /> Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-100 mb-2">Your Progress</h1>
            <p className="text-purple-300">Level: {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-md p-6 rounded-2xl border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-purple-100">{totalSkillAvg}%</span>
              </div>
              <p className="text-purple-300 text-sm">Average Skill Score</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-md p-6 rounded-2xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <Brain className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-blue-100">{totalPractices}</span>
              </div>
              <p className="text-blue-300 text-sm">Total Practice Sessions</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-md p-6 rounded-2xl border border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <MessageSquare className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-green-100">{conversationsStarted}</span>
              </div>
              <p className="text-green-300 text-sm">Conversations Started</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 backdrop-blur-md p-6 rounded-2xl border border-orange-500/30">
              <div className="flex items-center justify-between mb-3">
                <Flame className="w-8 h-8 text-orange-400" />
                <span className="text-3xl font-bold text-orange-100">{streak}</span>
              </div>
              <p className="text-orange-300 text-sm">Day Streak</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30">
              <h3 className="text-2xl font-bold text-purple-100 mb-6 flex items-center gap-2">
                <BarChart2 className="w-6 h-6" /> Skill Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(skillScores).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 capitalize">{skill}</span>
                      <span className="text-purple-100 font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-blue-500/30">
              <h3 className="text-2xl font-bold text-blue-100 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6" /> Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-blue-950/30 p-4 rounded-xl border border-blue-700/30 flex items-center gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-blue-100">{achievement.title}</p>
                      <p className="text-xs text-blue-300">{achievement.desc}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-blue-300 text-center py-8">No achievements yet. Keep practicing!</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-indigo-500/30">
            <h3 className="text-2xl font-bold text-indigo-100 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Recent Practice History
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {practiceAttempts.slice(-10).reverse().map((attempt, idx) => (
                <div key={idx} className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-700/30">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-indigo-200 text-sm flex-1">{attempt.text}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                      attempt.score >= 90 ? 'bg-green-500/20 text-green-300' :
                      attempt.score >= 75 ? 'bg-blue-500/20 text-blue-300' :
                      attempt.score >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {attempt.score}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-400 capitalize">{attempt.skillType}</span>
                    <span className="text-xs text-indigo-400">{attempt.timestamp}</span>
                  </div>
                </div>
              ))}
              {practiceAttempts.length === 0 && (
                <p className="text-indigo-300 text-center py-8">No practice history yet. Start your first lesson!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CONVOUPGRADE;