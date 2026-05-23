
import React, { useState, useEffect } from 'react';
import {
  Users, MessageCircle, CheckCircle, Clock, Target, 
  Zap, Activity, TrendingUp, Coffee, UserPlus, Send,
  Eye, EyeOff, Lightbulb, Calendar, ArrowRight, Share2,
  AlertCircle, Award, Flame, Star, Video, X, Play, Pause
} from 'lucide-react';

const EnhancedCommunity = () => {
  const [currentView, setCurrentView] = useState('onboarding'); // onboarding, matcher, dashboard, action
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    struggles: [],
    socialContexts: [],
    energyLevel: 'moderate',
    commitmentLevel: 'weekly'
  });
  const [currentPartner, setCurrentPartner] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Mock data for matched partner
  const mockPartner = {
    id: 1,
    name: 'Alex',
    avatar: '🧑',
    timezone: 'EST',
    sharedStruggles: ['Being talked over', 'Group invisibility', 'Following through'],
    currentStreak: 3,
    partnerSince: '2 weeks',
    commitment: 'Every Wednesday & Sunday, 7 PM',
    lastAction: 'Started a conversation at work lunch',
    reliabilityScore: 94
  };

  // Specific, real-world actions
  const actionLibrary = [
    {
      id: 1,
      category: 'group-presence',
      title: 'Add one sentence to a group conversation',
      description: 'Within 5 minutes of a group conversation starting, say one sentence. Any sentence. It doesn\'t have to be brilliant.',
      context: 'Work meeting, friend hangout, class discussion',
      difficulty: 'starter',
      timeCommit: '30 seconds',
      why: 'Break the "invisible person" pattern. Your voice = you exist.',
      partnerRole: 'Your partner will do the same action this week and share how it went.'
    },
    {
      id: 2,
      category: 'initiation',
      title: 'Send the first message in a group chat',
      description: 'Post something—a question, meme, or comment—in a group chat before anyone else does.',
      context: 'Group chat with friends, work Slack, Discord server',
      difficulty: 'starter',
      timeCommit: '2 minutes',
      why: 'Practice being the initiator, not just the responder.',
      partnerRole: 'Your partner picks their own group chat and does the same.'
    },
    {
      id: 3,
      category: 'follow-through',
      title: 'Follow up on something someone mentioned',
      description: 'Someone mentioned something (an interest, event, problem). Message them about it within 48 hours.',
      context: 'After any conversation where someone shared something',
      difficulty: 'intermediate',
      timeCommit: '5 minutes',
      why: 'Shows you were listening. Makes people feel seen. Makes YOU visible.',
      partnerRole: 'Your partner will do this too and report back their experience.'
    },
    {
      id: 4,
      category: 'group-presence',
      title: 'Make eye contact with 3 different people',
      description: 'In a group setting, deliberately make eye contact with 3 people while they\'re talking.',
      context: 'Any group of 4+ people',
      difficulty: 'intermediate',
      timeCommit: 'During conversation',
      why: 'Physical presence matters. Eye contact = engagement = visibility.',
      partnerRole: 'Partner does this in their own group setting this week.'
    },
    {
      id: 5,
      category: 'initiation',
      title: 'Suggest a plan (even if it doesn\'t happen)',
      description: 'Suggest doing something specific with someone. "Want to grab coffee Thursday?" Doesn\'t matter if they say no.',
      context: 'With anyone you\'ve talked to at least twice',
      difficulty: 'challenging',
      timeCommit: '1 minute',
      why: 'Practice being the chooser, not just the chosen.',
      partnerRole: 'Partner makes their own suggestion to someone this week.'
    },
    {
      id: 6,
      category: 'boundary',
      title: 'Disagree with something small',
      description: 'When someone says something you don\'t agree with, voice a different opinion. Keep it light and brief.',
      context: 'Group discussion, 1-on-1 conversation',
      difficulty: 'challenging',
      timeCommit: '30 seconds',
      why: 'You don\'t have to agree with everything to be liked. Disagreement = having a self.',
      partnerRole: 'Partner practices the same—speaking their actual opinion.'
    },
    {
      id: 7,
      category: 'group-presence',
      title: 'Stay in the room 5 minutes longer than you want to',
      description: 'When you feel the urge to leave a social situation, stay for 5 more minutes. Don\'t force talking, just stay.',
      context: 'Any group gathering where you feel the flight impulse',
      difficulty: 'intermediate',
      timeCommit: '5 minutes',
      why: 'Your presence matters even when you\'re not talking. Visibility ≠ constant performance.',
      partnerRole: 'Partner also practices staying present when uncomfortable.'
    },
    {
      id: 8,
      category: 'follow-through',
      title: 'Show up to something you said you\'d attend',
      description: 'Someone invited you to something. You said maybe/yes. Actually go.',
      context: 'Casual hangout, group event, party invitation',
      difficulty: 'challenging',
      timeCommit: 'The event duration',
      why: 'Following through = people learn they can count on you = you become real to them.',
      partnerRole: 'Partner commits to showing up to something they\'ve been avoiding.'
    }
  ];

  // ONBOARDING COMPONENT
  const Onboarding = () => {
    const struggles = [
      { id: 'talked-over', label: 'Being talked over or interrupted', icon: '🔇' },
      { id: 'group-invisible', label: 'Feeling invisible in groups', icon: '👻' },
      { id: 'never-chosen', label: 'Never being the "chosen" person', icon: '💔' },
      { id: 'conversation-stall', label: 'Running out of things to say', icon: '😶' },
      { id: 'follow-through', label: 'Not following through on social plans', icon: '🚫' },
      { id: 'replaying', label: 'Replaying conversations obsessively', icon: '🔄' },
      { id: 'small-talk', label: 'Small talk feels exhausting/fake', icon: '😮‍💨' },
      { id: 'initiation', label: 'Never initiating, always responding', icon: '⏸️' }
    ];

    const contexts = [
      { id: 'work', label: 'Work/Professional settings', icon: '💼' },
      { id: 'friend-groups', label: 'Friend groups (3+ people)', icon: '👥' },
      { id: 'parties', label: 'Parties/Large gatherings', icon: '🎉' },
      { id: 'online', label: 'Online communities/Discord/Gaming', icon: '💻' },
      { id: 'dating', label: 'Dating/Romantic contexts', icon: '❤️' },
      { id: 'family', label: 'Family gatherings', icon: '👨‍👩‍👧‍👦' }
    ];

    const toggleSelection = (field, value) => {
      setUserProfile(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(v => v !== value)
          : [...prev[field], value]
      }));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Step {onboardingStep} of 4</span>
              <span className="text-slate-400 text-sm">{Math.round((onboardingStep / 4) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(onboardingStep / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border-2 border-slate-700 rounded-2xl p-8">
            {onboardingStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Let's be honest.</h2>
                <p className="text-slate-300 text-lg mb-8">
                  This isn't about "curing" social anxiety. It's about not being invisible anymore.
                  <br/><br/>
                  Which of these actually describe your experience?
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {struggles.map(struggle => (
                    <button
                      key={struggle.id}
                      onClick={() => toggleSelection('struggles', struggle.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        userProfile.struggles.includes(struggle.id)
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{struggle.icon}</span>
                        <span className="font-medium">{struggle.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setOnboardingStep(2)}
                  disabled={userProfile.struggles.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                    disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Where does this show up?</h2>
                <p className="text-slate-300 text-lg mb-8">
                  Select the contexts where you feel most invisible or replaceable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {contexts.map(context => (
                    <button
                      key={context.id}
                      onClick={() => toggleSelection('socialContexts', context.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        userProfile.socialContexts.includes(context.id)
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{context.icon}</span>
                        <span className="font-medium">{context.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    disabled={userProfile.socialContexts.length === 0}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                      disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Here's the deal.</h2>
                <p className="text-slate-300 text-lg mb-6">
                  You'll be matched with ONE person who shares your struggles.
                  <br/><br/>
                  Every week, you'll both commit to doing the SAME small, specific action in your real lives.
                  <br/><br/>
                  Then you'll check in with each other about how it went.
                </p>

                <div className="bg-slate-700/30 border-2 border-slate-600 rounded-xl p-6 mb-8">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Why this works
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>You're not doing it alone—someone else is doing the exact same thing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Actions are specific and small—no vague "be more confident" garbage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>You'll actually follow through because someone's expecting to hear from you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Your partner gets it—they know what "invisible" feels like</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <label className="block text-white font-semibold mb-3">
                    How much can you realistically commit?
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'twice-week', label: 'Twice a week', desc: 'Check-ins every 3-4 days' },
                      { id: 'weekly', label: 'Once a week', desc: 'One action, one check-in per week' },
                      { id: 'biweekly', label: 'Every two weeks', desc: 'Slower pace, still consistent' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setUserProfile({ ...userProfile, commitmentLevel: option.id })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          userProfile.commitmentLevel === option.id
                            ? 'bg-blue-600 border-blue-400'
                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <p className="text-white font-semibold mb-1">{option.label}</p>
                        <p className="text-slate-300 text-sm">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(4)}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                      rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                  >
                    Find My Partner
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Finding your match...</h2>
                  <p className="text-slate-400">Looking for someone with similar struggles and schedule</p>
                </div>

                <div className="bg-slate-700/30 border-2 border-slate-600 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Matching based on:</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Shared struggles: {userProfile.struggles.length} selected
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Similar contexts: {userProfile.socialContexts.join(', ')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Commitment level: {userProfile.commitmentLevel}
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setCurrentPartner(mockPartner);
                    setCurrentView('matcher');
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                    rounded-xl font-bold text-white transition-all"
                >
                  View Match
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // PARTNER MATCH VIEW
  const PartnerMatchView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-800/50 border-2 border-slate-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                {mockPartner.avatar}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Meet {mockPartner.name}</h2>
              <p className="text-slate-400">Your accountability partner</p>
            </div>

            <div className="bg-slate-700/30 border-2 border-slate-600 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                What you have in common
              </h3>
              <div className="space-y-3">
                {mockPartner.sharedStruggles.map((struggle, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    {struggle}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  Timezone
                </div>
                <p className="text-white font-semibold">{mockPartner.timezone}</p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Star className="w-4 h-4" />
                  Reliability
                </div>
                <p className="text-white font-semibold">{mockPartner.reliabilityScore}%</p>
              </div>
            </div>

            <div className="bg-blue-900/20 border-2 border-blue-500/50 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold mb-3">Your commitment together:</h3>
              <p className="text-blue-200 mb-4">{mockPartner.commitment}</p>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">1.</span>
                  <span>Each week, you'll both do the same action in your real lives</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">2.</span>
                  <span>You'll check in with each other about how it went</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">3.</span>
                  <span>No judgment—just honest sharing and mutual support</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              Start Partnership
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // MAIN DASHBOARD
  const Dashboard = () => {
    const [showActionSelect, setShowActionSelect] = useState(false);

    const currentWeekActions = [
      {
        ...actionLibrary[0],
        status: 'completed',
        yourNotes: 'Added a comment in the standup meeting about the project timeline. Heart was racing but I did it.',
        partnerNotes: 'Spoke up in a Discord voice chat. Felt awkward but nobody seemed to care.',
        completedDate: '2 days ago'
      },
      {
        ...actionLibrary[2],
        status: 'in-progress',
        assignedDate: 'Today',
        dueDate: 'In 5 days'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Your Partnership</h1>
            <p className="text-slate-400">with {mockPartner.name}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Flame className="w-4 h-4" />
                Current Streak
              </div>
              <p className="text-3xl font-bold text-white">{mockPartner.currentStreak} weeks</p>
            </div>
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <CheckCircle className="w-4 h-4" />
                Actions Completed
              </div>
              <p className="text-3xl font-bold text-white">12</p>
            </div>
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Clock className="w-4 h-4" />
                Partnership
              </div>
              <p className="text-3xl font-bold text-white">{mockPartner.partnerSince}</p>
            </div>
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Follow-through
              </div>
              <p className="text-3xl font-bold text-white">92%</p>
            </div>
          </div>

          {/* This Week's Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">This Week's Actions</h2>
              <button
                onClick={() => setShowActionSelect(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Pick New Action
              </button>
            </div>

            <div className="space-y-4">
              {currentWeekActions.map((action, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-800/50 border-2 rounded-xl p-6 ${
                    action.status === 'completed'
                      ? 'border-green-500/50'
                      : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{action.title}</h3>
                        {action.status === 'completed' && (
                          <span className="px-3 py-1 bg-green-600/20 border border-green-500/50 rounded-full text-green-200 text-sm font-semibold">
                            ✓ Completed
                          </span>
                        )}
                        {action.status === 'in-progress' && (
                          <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-200 text-sm font-semibold">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mb-3">{action.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">
                          <strong className="text-white">Context:</strong> {action.context}
                        </span>
                        <span className="text-slate-400">
                          <strong className="text-white">Time:</strong> {action.timeCommit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {action.status === 'completed' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-600">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-2 font-semibold">You shared:</p>
                        <p className="text-slate-200 text-sm italic">"{action.partnerNotes}"</p>
                        <p className="text-slate-400 text-xs mt-2">{action.completedDate}</p>
                      </div>
                    </div>
                  )}

                  {action.status === 'in-progress' && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-slate-300 text-sm">
                          <strong className="text-white">Due:</strong> {action.dueDate}
                        </p>
                        <p className="text-slate-300 text-sm">
                          {mockPartner.name} is also working on this
                        </p>
                      </div>
                      <button
                        onClick={() => setActionInProgress(action)}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark as Done & Share Experience
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Partner Updates */}
          <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Recent from {mockPartner.name}
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-300 mb-2">"{mockPartner.lastAction}"</p>
                <p className="text-slate-500 text-sm">3 days ago</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-300 mb-2">"Had a rough week with the group project. Felt invisible again. But I stayed in the room like we planned."</p>
                <p className="text-slate-500 text-sm">1 week ago</p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>

          {/* Action Library Modal */}
          {showActionSelect && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-slate-800 rounded-2xl border-2 border-slate-700 max-w-4xl w-full my-8">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Choose Your Next Action</h2>
                      <p className="text-slate-400 text-sm">Both you and {mockPartner.name} will do this action this week</p>
                    </div>
                    <button
                      onClick={() => setShowActionSelect(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {actionLibrary.map(action => {
                      const difficultyColors = {
                        starter: 'green',
                        intermediate: 'yellow',
                        challenging: 'red'
                      };
                      const color = difficultyColors[action.difficulty];

                      return (
                        <div
                          key={action.id}
                          className="bg-slate-700/30 border-2 border-slate-600 hover:border-blue-500 rounded-xl p-6 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">{action.title}</h3>
                                <span className={`px-3 py-1 bg-${color}-600/20 border border-${color}-500/50 rounded-full text-${color}-200 text-xs font-semibold`}>
                                  {action.difficulty}
                                </span>
                              </div>
                              <p className="text-slate-300 mb-3">{action.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="text-slate-400">Context: </span>
                              <span className="text-white">{action.context}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-slate-400">Time needed: </span>
                              <span className="text-white">{action.timeCommit}</span>
                            </div>
                          </div>

                          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-3">
                            <p className="text-blue-200 text-sm">
                              <strong>Why this matters:</strong> {action.why}
                            </p>
                          </div>

                          <div className="bg-slate-600/30 border border-slate-500/30 rounded-lg p-3 mb-4">
                            <p className="text-slate-300 text-sm">
                              <strong className="text-white">Partner commitment:</strong> {action.partnerRole}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setShowActionSelect(false);
                              // In real app, would save this action
                            }}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                          >
                            <Target className="w-5 h-5" />
                            Commit to This Action
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Complete Action Modal */}
          {actionInProgress && (
            <CompleteActionModal 
              action={actionInProgress}
              partner={mockPartner}
              onClose={() => setActionInProgress(null)}
            />
          )}
        </div>
      </div>
    );
  };

  // COMPLETE ACTION MODAL
  const CompleteActionModal = ({ action, partner, onClose }) => {
    const [experience, setExperience] = useState('');
    const [feltVisible, setFeltVisible] = useState(null);
    const [wouldDoAgain, setWouldDoAgain] = useState(null);

    const handleSubmit = () => {
      // In real app, would save to database
      alert('Experience shared with ' + partner.name + '!');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-2xl border-2 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">How did it go?</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4">
              <p className="text-white font-semibold mb-1">Your action:</p>
              <p className="text-slate-300">{action.title}</p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                What happened? Be honest—no performance needed.
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="E.g., 'I tried to add something to the conversation but got talked over. Felt shitty but at least I tried.' or 'Actually spoke up and people listened. Felt weird but good.'"
                rows={6}
                className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Did you feel more visible/present than usual?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'yes', label: 'Yes', icon: '👍' },
                  { id: 'kinda', label: 'Kinda', icon: '🤷' },
                  { id: 'no', label: 'Not really', icon: '👎' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setFeltVisible(option.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      feltVisible === option.id
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Would you do something like this again?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'yes', label: 'Yes' },
                  { id: 'no', label: 'No' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setWouldDoAgain(option.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      wouldDoAgain === option.id
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-200 text-sm flex items-start gap-2">
                <Eye className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                  {partner.name} will see your response. They're doing the same action and will share their experience too.
                </span>
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!experience.trim() || feltVisible === null || wouldDoAgain === null}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Share with {partner.name}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // RENDER LOGIC
  return (
    <div>
      {currentView === 'onboarding' && <Onboarding />}
      {currentView === 'matcher' && <PartnerMatchView />}
      {currentView === 'dashboard' && <Dashboard />}
    </div>
  );
};

export default EnhancedCommunity;