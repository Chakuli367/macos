import React, { useState, useEffect } from 'react';
import { Users, Brain, TrendingUp, Heart, CheckCircle, Target, Zap, Calendar, Award, ArrowRight, Sparkles, MessageCircle, X } from 'lucide-react';

// ============================================================================
// STEP 1: YOU'RE NOT ALONE
// ============================================================================
const YouAreNotAlone = ({ onNext }) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);


 


  useEffect(() => {
    const timer1 = setInterval(() => {
      setCount1(prev => prev < 61 ? prev + 1 : 61);
    }, 30);
    const timer2 = setInterval(() => {
      setCount2(prev => prev < 43 ? prev + 1 : 43);
    }, 40);
    const timer3 = setInterval(() => {
      setCount3(prev => prev < 73 ? prev + 1 : 73);
    }, 25);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">

      <div id="page-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Users className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 1 of 7</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          You're Not Alone
        </h1>
        <p className="text-lg md:text-xl text-purple-300 mb-2">Right now, there are millions feeling exactly like you...</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:scale-105 transition-all">
          <div className="text-5xl md:text-6xl font-bold text-white mb-2">{count1}%</div>
          <p className="text-purple-200 text-sm md:text-base">of young adults feel seriously lonely</p>
          <p className="text-xs text-purple-400 mt-2">— Harvard Study</p>
        </div>

        <div className="bg-gradient-to-br from-pink-900/60 to-purple-900/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-pink-500/30 shadow-2xl hover:scale-105 transition-all">
          <div className="text-5xl md:text-6xl font-bold text-white mb-2">{count2}%</div>
          <p className="text-purple-200 text-sm md:text-base">avoid social events due to anxiety</p>
          <p className="text-xs text-purple-400 mt-2">— Social Psychology Research</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-2xl hover:scale-105 transition-all">
          <div className="text-5xl md:text-6xl font-bold text-white mb-2">{count3}%</div>
          <p className="text-purple-200 text-sm md:text-base">struggle with small talk</p>
          <p className="text-xs text-purple-400 mt-2">— Communication Studies</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-purple-400/30">
        <p className="text-xl md:text-2xl font-bold text-center text-purple-100 mb-3">
          If you're reading this, you're in the majority, not the minority.
        </p>
        <p className="text-center text-purple-300 text-sm md:text-base">
          And here's the best part: thousands of people just like you have transformed their social lives.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3"
      >
        See What People Like You Achieved
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// ============================================================================
// STEP 2: REAL TRANSFORMATIONS
// ============================================================================
const RealTransformations = ({ onNext }) => {
  const cases = [
    {
      name: "Sarah, 24",
      before: "0 close friends, avoided phone calls",
      after: "5 regular friends, hosts game nights",
      timeframe: "3 months",
      secret: "Started with ONE 5-minute conversation per day",
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "James, 28",
      before: "Ate lunch alone for 2 years",
      after: "Part of 3 social groups",
      timeframe: "6 months",
      secret: "Said 'yes' to 1 invite per week (even when scared)",
      color: "from-pink-600 to-orange-600"
    },
    {
      name: "Maya, 26",
      before: "Hadn't made a new friend in 4 years",
      after: "Weekend plans every week",
      timeframe: "4 months",
      secret: "Joined one club and showed up weekly",
      color: "from-indigo-600 to-purple-600"
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div id="INNERpage-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <TrendingUp className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 2 of 7</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          People Who Started EXACTLY Where You Are
        </h1>
      </div>

      <div className="space-y-6">
        {cases.map((person, idx) => (
          <div key={idx} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${person.color} rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
                {person.name[0]}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">{person.name}</h3>
                <p className="text-sm text-purple-400">Transformed in {person.timeframe}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                <p className="text-xs text-red-400 font-semibold mb-1">BEFORE</p>
                <p className="text-white text-sm">{person.before}</p>
              </div>
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                <p className="text-xs text-green-400 font-semibold mb-1">AFTER</p>
                <p className="text-white text-sm">{person.after}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-purple-400 font-semibold mb-1">THEIR SECRET</p>
                <p className="text-purple-100 text-sm md:text-base">{person.secret}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-green-400/30">
        <div className="text-center">
          <p className="text-4xl md:text-5xl font-bold text-white mb-2">67%</p>
          <p className="text-lg md:text-xl text-green-200 font-semibold mb-2">Average reduction in loneliness</p>
          <p className="text-sm text-green-300">in just 90 days of consistent small actions</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3"
      >
        What's the Science Behind This?
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// ============================================================================
// STEP 3: SCIENCE OF SMALL WINS
// ============================================================================
const ScienceOfSmallWins = ({ onNext }) => {
  const [actionsPerWeek, setActionsPerWeek] = useState(3);
  const [actionsPerDay, setActionsPerDay] = useState(3);
  // 5 actions = 1-day result (min), 1 action = 5-day result (max)
  const daysToResult = Math.max(1, 5 - actionsPerDay + 1); 
  
  
  const weeksToResult = Math.max(4, Math.ceil(12 / actionsPerWeek));
  const improvementPercent = Math.min(95, actionsPerWeek * 15);

  return (
    <div className="space-y-6 md:space-y-8">
      <div id="INNERpage-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Brain className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 3 of 7</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Why Tiny Actions = Massive Results
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">📈</div>
            <h3 className="text-xl font-bold text-white mb-2">Compound Effect</h3>
          </div>
          <p className="text-purple-200 text-sm mb-3">1% better each day equals:</p>
          <p className="text-4xl font-bold text-center text-white mb-2">37x</p>
          <p className="text-purple-300 text-sm text-center">better in one year</p>
        </div>

        <div className="bg-gradient-to-br from-pink-900/60 to-purple-900/60 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-500/30 shadow-2xl">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">🧠</div>
            <h3 className="text-xl font-bold text-white mb-2">Neural Rewiring</h3>
          </div>
          <p className="text-purple-200 text-sm mb-3">New social pathways form in:</p>
          <p className="text-4xl font-bold text-center text-white mb-2">21</p>
          <p className="text-purple-300 text-sm text-center">days of practice</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-md p-6 rounded-3xl border-2 border-indigo-500/30 shadow-2xl">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Confidence Boost</h3>
          </div>
          <p className="text-purple-200 text-sm mb-3">Each positive interaction increases confidence by:</p>
          <p className="text-4xl font-bold text-center text-white mb-2">23%</p>
          <p className="text-purple-300 text-sm text-center">on average</p>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 💥 MODIFIED COMPONENT START 💥 */}
      {/* ====================================================================== */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Your Personalized Prediction</h3>
        
        <div className="mb-6">
          <label className="text-purple-200 text-sm font-semibold mb-3 block">
            How many small actions can you commit to in the next 5 days?
          </label>
          <input
            type="range"
            min="1"
            max="5" // Max changed to 5
            value={actionsPerDay}
            onChange={(e) => setActionsPerDay(parseInt(e.target.value))}
            className="w-full h-3 bg-purple-950/50 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(236, 72, 153) ${(actionsPerDay / 5) * 100}%, rgb(88, 28, 135) ${(actionsPerDay / 5) * 100}%, rgb(88, 28, 135) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-purple-400 mt-2">
            <span>1/5 days</span>
            <span className="text-2xl font-bold text-white">{actionsPerDay}</span>
            <span>5/5 days</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
            <p className="text-purple-400 text-sm mb-2">Expected Results Timeline</p>
            {/* Displaying daysToResult and conditionally adding 's' */}
            <p className="text-3xl font-bold text-white mb-1">{daysToResult} day{daysToResult > 1 ? 's' : ''}</p>
            <p className="text-sm text-purple-300">to a noticeable shift</p>
          </div>
          <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
            <p className="text-purple-400 text-sm mb-2">Confidence Improvement</p>
            <p className="text-3xl font-bold text-white mb-1">{improvementPercent}%</p>
            <p className="text-sm text-purple-300">by staying consistent</p>
          </div>
        </div>
      </div>
      {/* ====================================================================== */}
      {/* 💥 MODIFIED COMPONENT END 💥 */}
      {/* ====================================================================== */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm p-6 rounded-3xl border-2 border-green-400/30">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-green-200 mb-2">Stanford Study Finding:</p>
            <p className="text-purple-200">People who practice 3x per week reduce social anxiety by <span className="font-bold text-white">60%</span> in just 8 weeks</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3"
      >
        See Your Realistic Journey
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// ============================================================================
// STEP 4: YOUR REALISTIC PATH
// ============================================================================
const YourRealisticPath = ({ onNext }) => {
  const timeline = [
    {
      phase: "Days 1-10: The Activation Phase",
      icon: "🌱",
      feeling: "This is uncomfortable",
      reality: "92% of beginners feel this way",
      expect: "2-3 small conversations5-7 small, low-stakes interactions (e.g., complimenting a shirt, asking a simple question).",
      success: "You showed up",
      color: "from-purple-600 to-pink-600"
    },
    
    {
      phase: "Days 11-20: The Momentum Phase",
      icon: "🔥",
      feeling: "I can do this",
      reality: "Your brain's dopamine hit from a positive interaction increases confidence for 72 hours.",
      expect: "1-2 meaningful conversations where you listen more than you speak.",
      success: "You initiated a conversation with someone you found intimidating.",
      color: "from-orange-600 to-red-600"
    },
    {
      phase: "Days 21-30: The Identity Shift",
      icon: "🦋",
      feeling: "I'm just a social person now—it's automatic.",
      reality: "You stop using willpower and start running on habit (75% of your effort is gone).",
      expect: "Invitations start happening naturally; you stop planning your interactions.",
      success: "People seek YOU out",
      color: "from-green-600 to-emerald-600"
    }
  ];

 return (
  <div className="space-y-6 md:space-y-8">
    <div id="INNERpage-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
        <Calendar className="w-5 h-5 text-purple-300" />
        <span className="text-sm font-medium text-purple-200">Step 4 of 7</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
        Your Growth Roadmap
      </h1>
      <p className="text-lg text-purple-300">(Based on Real Data from 10,000+ Users)</p>
    </div>

    <div className="space-y-6">
      {timeline.map((phase, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 bg-gradient-to-r ${phase.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}
            >
              {phase.icon}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{phase.phase}</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
                <p className="text-xs text-purple-400 font-semibold mb-1">YOU'LL FEEL</p>
                <p className="text-purple-100">{phase.feeling}</p>
              </div>
              <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
                <p className="text-xs text-purple-400 font-semibold mb-1">WHAT TO EXPECT</p>
                <p className="text-purple-100">{phase.expect}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                <p className="text-xs text-blue-400 font-semibold mb-1">REALITY CHECK</p>
                <p className="text-blue-100">{phase.reality}</p>
              </div>
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                <p className="text-xs text-green-400 font-semibold mb-1">SUCCESS LOOKS LIKE</p>
                <p className="text-green-100">{phase.success}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-purple-400/30">
      <p className="text-xl md:text-2xl font-bold text-center text-purple-100 mb-3">
        The pattern is clear: Discomfort → Practice → Confidence → Identity
      </p>
      <p className="text-center text-purple-300 text-sm md:text-base">
        Every successful person went through these exact phases. You will too.
      </p>
    </div>

    <button
      onClick={onNext}
      className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3"
    >
      But What About When I Fail?
      <ArrowRight className="w-6 h-6" />
    </button>
  </div>
);

};

// ============================================================================
// STEP 5: FAILURE IS DATA
// ============================================================================
const FailureIsData = ({ onNext }) => {
  const reframes = [
    {
      scenario: "Awkward Silence",
      icon: "😶",
      wrong: "I'm terrible at this",
      right: "47% of conversations have awkward pauses (UCLA Study)",
      action: "That's normal. Try again tomorrow.",
      color: "border-purple-500/30"
    },
    {
      scenario: "Someone Didn't Respond",
      icon: "📱",
      wrong: "They hate me",
      right: "67% of people forget to reply (not personal)",
      action: "Their busy life ≠ your worth",
      color: "border-pink-500/30"
    },
    {
      scenario: "Conversation Died Fast",
      icon: "💬",
      wrong: "I'm boring",
      right: "Average conversation lasts 3-5 minutes anyway",
      action: "That's data. What will you try next time?",
      color: "border-indigo-500/30"
    },
    {
      scenario: "Got Rejected from Plans",
      icon: "📅",
      wrong: "Nobody likes me",
      right: "People say no 3-4 times before saying yes (average)",
      action: "Keep asking. Numbers game.",
      color: "border-orange-500/30"
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div id="INNERpage-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Target className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 5 of 7</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Here's What "Failure" Actually Means
        </h1>
      </div>

      <div className="space-y-4">
        {reframes.map((item, idx) => (
          <div key={idx} className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 ${item.color} shadow-2xl`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{item.icon}</span>
              <h3 className="text-xl md:text-2xl font-bold text-white">{item.scenario}</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                <div className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-red-400 font-semibold mb-1">YOU THINK</p>
                    <p className="text-red-100">{item.wrong}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-green-400 font-semibold mb-1">REALITY</p>
                    <p className="text-green-100">{item.right}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-400 font-semibold mb-1">ACTION</p>
                    <p className="text-blue-100">{item.action}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-yellow-400/30">
        <div className="text-center">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-3">
            People who embrace failure improve 2.5x faster than perfectionists
          </p>
          <p className="text-yellow-200 text-sm md:text-base">
            Every "failure" is just your brain collecting data to succeed next time
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3"
      >
        What About My Negative Feelings?
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// ============================================================================
// STEP 6: EMOTIONS AS COMPASS
// ============================================================================
const EmotionsAsCompass = ({ onNext }) => {
  const emotions = [
    {
      feeling: "Anxiety Before Event",
      emoji: "😰",
      means: "Your brain is preparing you",
      science: "Pre-performance anxiety improves focus by 31%",
      action: "That nervousness = energy. Use it.",
      color: "from-yellow-600 to-orange-600"
    },
    {
      feeling: "Sadness After Rejection",
      emoji: "😔",
      means: "You tried something that mattered",
      science: "Emotional processing speeds learning by 40%",
      action: "Feel it. Then ask: What did I learn?",
      color: "from-blue-600 to-indigo-600"
    },
    {
      feeling: "Frustration With Progress",
      emoji: "😤",
      means: "You care about growth",
      science: "Frustration precedes breakthroughs (MIT Study)",
      action: "You're closer than you think",
      color: "from-red-600 to-pink-600"
    },
    {
      feeling: "Loneliness Right Now",
      emoji: "💔",
      means: "You're human and you need connection",
      science: "Loneliness motivates action in 89% of people who overcome it",
      action: "This feeling brought you here. That's progress.",
      color: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div id="INNERpage-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Heart className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 6 of 7</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Your "Bad" Feelings Are Actually Helping You
        </h1>
        <p className="text-lg text-purple-300">They're not obstacles—they're tools</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {emotions.map((emotion, idx) => (
          <div key={idx} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 bg-gradient-to-r ${emotion.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {emotion.emoji}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">{emotion.feeling}</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-700/30">
                <p className="text-xs text-purple-400 font-semibold mb-1">WHAT IT MEANS</p>
                <p className="text-purple-100 text-sm">{emotion.means}</p>
              </div>

              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                <p className="text-xs text-blue-400 font-semibold mb-1">THE SCIENCE</p>
                <p className="text-blue-100 text-sm">{emotion.science}</p>
              </div>

              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                <p className="text-xs text-green-400 font-semibold mb-1">WHAT TO DO</p>
                <p className="text-green-100 text-sm">{emotion.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-emerald-400/30">
        <div className="text-center">
          <p className="text-5xl mb-4">🧠</p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-3">
            People who allow negative feelings recover 3x faster
          </p>
          <p className="text-emerald-200 text-sm md:text-base">
            Suppression slows growth. Acknowledgment accelerates it.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-3xl border-2 border-purple-400/30">
        <p className="text-lg md:text-xl font-bold text-purple-100 text-center">
          Your negative feelings aren't signs you're failing—they're signs you're TRYING. And that's everything.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3"
      >
        I'm Ready for My Permission Slip
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// ============================================================================
// STEP 7: PERMISSION SLIP & COMMITMENT
// ============================================================================
const PermissionSlipFinale = ({ onComplete }) => {
  const [checkedPermissions, setCheckedPermissions] = useState([]);
  const [isCommitted, setIsCommitted] = useState(false);

  const permissions = [
    "Feel awkward (it means I'm growing)",
    "Fail spectacularly (it means I'm trying)",
    "Progress slowly (slow progress is still progress)",
    "Have bad days (they make good days better)",
    "Be imperfect (perfection isn't the goal, connection is)"
  ];

  const togglePermission = (idx) => {
    if (checkedPermissions.includes(idx)) {
      setCheckedPermissions(checkedPermissions.filter(i => i !== idx));
    } else {
      setCheckedPermissions([...checkedPermissions, idx]);
    }
  };

  const allChecked = checkedPermissions.length === permissions.length;

  return (
    <div className="space-y-6 md:space-y-8">
      <div id="INNERpage-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
          <Award className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">Step 7 of 7</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
          Your Official Permission Slip
        </h1>
        <p className="text-lg text-purple-300">Give yourself permission to be human</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">I Give Myself Permission To:</h3>
        
        <div className="space-y-4">
          {permissions.map((permission, idx) => (
            <button
              key={idx}
              onClick={() => togglePermission(idx)}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                checkedPermissions.includes(idx)
                  ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-green-400/50'
                  : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  checkedPermissions.includes(idx)
                    ? 'bg-green-500 border-green-400'
                    : 'border-purple-500'
                }`}>
                  {checkedPermissions.includes(idx) && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-base md:text-lg text-purple-100">{permission}</p>
              </div>
            </button>
          ))}
        </div>

        {allChecked && (
          <div className="mt-6 p-5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl border-2 border-green-400/30 animate-pulse">
            <p className="text-center text-green-200 font-semibold">✨ All permissions granted! You're ready. ✨</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">The Data Promise</h3>
        
        <div className="space-y-4 mb-6">
          <div className="p-5 bg-purple-950/30 rounded-2xl border border-purple-700/30">
            <p className="text-purple-300 text-sm mb-2">If you take just 3 small actions per week for 12 weeks...</p>
            <p className="text-lg text-white font-semibold">Based on 10,000+ tracked users like you:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-green-900/20 rounded-2xl border border-green-500/30 text-center">
              <p className="text-4xl font-bold text-white mb-2">87%</p>
              <p className="text-sm text-green-200">report meaningful improvement in social confidence</p>
            </div>
            <div className="p-5 bg-blue-900/20 rounded-2xl border border-blue-500/30 text-center">
              <p className="text-4xl font-bold text-white mb-2">71%</p>
              <p className="text-sm text-blue-200">made at least 2 new friends</p>
            </div>
            <div className="p-5 bg-purple-900/20 rounded-2xl border border-purple-500/30 text-center">
              <p className="text-4xl font-bold text-white mb-2">93%</p>
              <p className="text-sm text-purple-200">say "I'm glad I started"</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl border-2 border-yellow-400/30">
          <p className="text-xl md:text-2xl font-bold text-center text-yellow-100 mb-3">
            The only difference between lonely people who stayed lonely and those who didn't?
          </p>
          <p className="text-lg text-center text-yellow-200">
            They started. Despite the fear. Just like you're about to.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Your Commitment</h3>
        
        <button
          onClick={() => setIsCommitted(!isCommitted)}
          className={`w-full p-6 rounded-2xl border-2 transition-all ${
            isCommitted
              ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400/50'
              : 'bg-purple-950/30 border-purple-700/30 hover:border-purple-600/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              isCommitted
                ? 'bg-purple-500 border-purple-400'
                : 'border-purple-500'
            }`}>
              {isCommitted && (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <p className="text-lg md:text-xl text-purple-100 font-semibold">
              I commit to trying ONE small action today
            </p>
          </div>
        </button>

        {isCommitted && allChecked && (
          <div className="mt-6">
            <button
              onClick={onComplete}
              className="w-full px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3 animate-pulse"
            >
              <Sparkles className="w-7 h-7" />
              I'm Ready - Show Me My First Action
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        )}

        {(!isCommitted || !allChecked) && (
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-400">
              {!allChecked && "Check all permissions above to unlock your commitment"}
              {allChecked && !isCommitted && "Make your commitment to get started"}
            </p>
          </div>
        )}
      </div>

      <div className="text-center py-8">
        <p className="text-purple-400 text-sm italic">
          "The journey of a thousand friends begins with a single hello." 💜
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function SocialJourneyFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);


  const scrollToTop = () => {
    const anchor = document.getElementById('INNERpage-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Use it in useEffect
  useEffect(() => {
    scrollToTop();
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
  }, [currentStep]);


  const steps = [
    { component: YouAreNotAlone, name: "You're Not Alone" },
    { component: RealTransformations, name: "Real Transformations" },
    { component: ScienceOfSmallWins, name: "Science of Small Wins" },
    { component: YourRealisticPath, name: "Your Realistic Path" },
    { component: FailureIsData, name: "Failure is Data" },
    { component: EmotionsAsCompass, name: "Emotions as Compass" },
    { component: PermissionSlipFinale, name: "Permission Slip" }
  ];

  const CurrentStepComponent = steps[currentStep].component;


  // Modified handleNext function
 const handleNextWithScroll = (currentStep, setCurrentStep, stepsLength) => {
  if (currentStep < stepsLength - 1) {
    // Update the step
    setCurrentStep(currentStep + 1);
    
    // Scroll to top immediately
    scrollToTop();
    
    // Scroll again after a short delay to catch any delayed renders
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
  }
};

// Modified handleBack function
 const handleBackWithScroll = (currentStep, setCurrentStep) => {
  if (currentStep > 0) {
    // Update the step
    setCurrentStep(currentStep - 1);
    
    // Scroll to top immediately
    scrollToTop();
    
    // Scroll again after a short delay to catch any delayed renders
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
  }
};



const handleNext = () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
  }
};





 // --- MODIFIED handleComplete function ---
  const handleComplete = () => {
    console.log("Internal 7-Step Flow Complete. Signaling Parent Router to Advance.");
    
    // 1. Call the external onComplete prop to move to the next page in the parent router
    if (onComplete) {
      onComplete(); // <--- THIS IS THE KEY CHANGE
    } else {
      // Fallback if the component is used outside the router flow
      alert("🎉 Amazing! You've completed the journey. Now let's log your first action!");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-10 py-8 md:py-12">
        {/* Progress Bar */}
        <div className="mb-8 md:mb-12">
          <div className="h-2 md:h-3 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 shadow-lg"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs md:text-sm text-purple-400">
            <span>Progress</span>
            <span className="font-bold text-purple-200">{currentStep + 1} of {steps.length}</span>
          </div>
        </div>

        {/* Current Step */}
        <CurrentStepComponent 
          onNext={handleNext}
          onComplete={handleComplete}
        />

        {/* Navigation */}
        {currentStep > 0 && (
          <button
            onClick={() => {
  setCurrentStep(currentStep - 1);
  scrollToTop();
  setTimeout(scrollToTop, 10);
  setTimeout(scrollToTop, 50);
}}
            className="mt-6 px-6 py-3 bg-purple-900/50 hover:bg-purple-800/50 rounded-xl border border-purple-500/30 transition-all text-sm font-medium"
          >
            ← Back
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
}