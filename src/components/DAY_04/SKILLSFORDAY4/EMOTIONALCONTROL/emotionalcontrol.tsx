import React, { useState, useEffect } from 'react';
import { Brain, Heart, Zap, Target, CheckCircle, TrendingUp, Award, Flame, AlertCircle, Lightbulb, Play, RotateCcw, ChevronRight, Star, Trophy, Lock, Sparkles } from 'lucide-react';

const EmotionalControl = ({ onNext }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProgress, setUserProgress] = useState({
    completedSteps: [],
    practiceAttempts: 0,
    reflections: [],
    totalXP: 0,
    confidence: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [scenarioFeedback, setScenarioFeedback] = useState(null);
  const [reflectionInput, setReflectionInput] = useState('');

  const scenarios = [
    {
      situation: "You're mid-conversation and suddenly forget what you were saying. There's an awkward 5-second pause.",
      badResponse: "Panic, apologize profusely, and mentally spiral",
      goodResponse: "Smile, take a breath, say 'Let me gather my thoughts' and continue naturally",
      tip: "Pauses are normal. Your reaction matters more than the pause itself."
    },
    {
      situation: "Someone doesn't laugh at your joke. The silence feels crushing.",
      badResponse: "Over-explain the joke or apologize repeatedly",
      goodResponse: "Laugh it off yourself with 'Tough crowd!' and smoothly change topics",
      tip: "Not every joke lands. Confidence through the miss is what people remember."
    },
    {
      situation: "You ask someone to hang out and they decline without offering another time.",
      badResponse: "Take it personally and avoid them afterward",
      goodResponse: "Say 'No worries! Let me know if you're free another time' and move on",
      tip: "Rejection is data, not a verdict on your worth. Their 'no' opens space for someone's 'yes'."
    }
  ];

  const steps = [
    {
      id: 'intro',
      title: 'Why Emotional Control Matters',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 rounded-2xl border-2 border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Brain className="w-7 h-7 text-purple-400" />
              The Hidden Superpower
            </h3>
            <p className="text-purple-100 text-lg leading-relaxed mb-4">
              Most people think social skills are about <span className="font-bold text-pink-300">what you say</span>. 
              But the real game-changer? <span className="font-bold text-purple-300">How you feel while saying it</span>.
            </p>
            <div className="bg-purple-950/50 p-4 rounded-xl border border-purple-700/30">
              <p className="text-purple-200 italic">
                "Between stimulus and response, there is a space. In that space lies your power."
              </p>
              <p className="text-purple-400 text-sm mt-2">— Viktor Frankl</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 p-5 rounded-xl border-2 border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-400 mb-3" />
              <h4 className="font-bold text-white mb-2">Without Control</h4>
              <ul className="text-red-200 text-sm space-y-2">
                <li>• Awkward moments spiral into anxiety</li>
                <li>• One rejection ruins your whole day</li>
                <li>• Fear prevents you from trying again</li>
                <li>• Social interactions feel exhausting</li>
              </ul>
            </div>

            <div className="bg-green-900/20 p-5 rounded-xl border-2 border-green-500/30">
              <Zap className="w-6 h-6 text-green-400 mb-3" />
              <h4 className="font-bold text-white mb-2">With Control</h4>
              <ul className="text-green-200 text-sm space-y-2">
                <li>• Awkward moments become funny stories</li>
                <li>• Rejection becomes valuable feedback</li>
                <li>• Confidence compounds over time</li>
                <li>• Social interactions energize you</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
            <Lightbulb className="w-6 h-6 text-yellow-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Key Insight</h4>
            <p className="text-purple-100">
              You can't control what happens to you, but you can control how quickly you recover. 
              That recovery speed is what separates socially confident people from everyone else.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'science',
      title: 'The Science Behind It',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-2xl border-2 border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Heart className="w-7 h-7 text-pink-400" />
              Your Brain on Awkwardness
            </h3>
            <p className="text-purple-100 mb-4">
              When something awkward happens, your amygdala (fear center) activates in milliseconds. 
              But here's the secret: <span className="font-bold text-pink-300">you have a 90-second window</span> before 
              it becomes a full stress response.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="bg-purple-950/30 p-5 rounded-xl border border-purple-700/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">The Amygdala Hijack (0-3 seconds)</h4>
                  <p className="text-purple-200 text-sm mb-2">
                    Your brain detects social threat → immediate fear response → fight/flight activated
                  </p>
                  <div className="bg-red-900/20 px-3 py-2 rounded-lg text-red-300 text-xs">
                    This is automatic and not your fault
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/30 p-5 rounded-xl border border-purple-700/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">The Critical Window (3-90 seconds)</h4>
                  <p className="text-purple-200 text-sm mb-2">
                    Your prefrontal cortex can override the fear → rational thinking kicks in → you choose your response
                  </p>
                  <div className="bg-yellow-900/20 px-3 py-2 rounded-lg text-yellow-300 text-xs">
                    This is where your power lives
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/30 p-5 rounded-xl border border-purple-700/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">The Recovery (90+ seconds)</h4>
                  <p className="text-purple-200 text-sm mb-2">
                    With practice, you build neural pathways → faster recovery → genuine confidence emerges
                  </p>
                  <div className="bg-green-900/20 px-3 py-2 rounded-lg text-green-300 text-xs">
                    This becomes automatic with repetition
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl border border-purple-500/30">
            <Target className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="font-bold text-white mb-2">The Goal</h4>
            <p className="text-purple-100">
              Reduce your emotional recovery time from <span className="line-through text-red-300">5 minutes</span> → 
              <span className="font-bold text-green-300"> 5 seconds</span>. That's a 60x improvement in social resilience.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'techniques',
      title: 'Master the 3-Step Recovery',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 p-6 rounded-2xl border-2 border-pink-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400" />
              The 3-Step Recovery Protocol
            </h3>
            <p className="text-purple-100 mb-4">
              Use this exact sequence when awkwardness strikes. With practice, it becomes instant.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-950/30 p-6 rounded-2xl border-2 border-purple-700/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-white text-xl shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">BREATHE (Physical Reset)</h4>
                  <p className="text-purple-200 mb-3">
                    Take ONE deep breath through your nose (4 seconds in, 4 seconds out). This interrupts your stress response.
                  </p>
                </div>
              </div>
              <div className="bg-cyan-900/20 p-4 rounded-xl border border-cyan-700/30">
                <p className="text-cyan-200 text-sm font-medium mb-2">Why it works:</p>
                <p className="text-cyan-300 text-sm">
                  Deep breathing activates your vagus nerve, which signals safety to your amygdala. 
                  Your body literally can't panic and deep breathe at the same time.
                </p>
              </div>
            </div>

            <div className="bg-purple-950/30 p-6 rounded-2xl border-2 border-purple-700/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-white text-xl shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">REFRAME (Mental Reset)</h4>
                  <p className="text-purple-200 mb-3">
                    Replace "This is awful" with "This is data." Awkwardness is feedback, not failure.
                  </p>
                </div>
              </div>
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-700/30">
                <p className="text-purple-200 text-sm font-medium mb-2">Mental scripts to practice:</p>
                <ul className="text-purple-300 text-sm space-y-1">
                  <li>• "Everyone has awkward moments. I'm human."</li>
                  <li>• "Pauses are thinking time, not dead air."</li>
                  <li>• "This person's reaction tells me about them, not me."</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-950/30 p-6 rounded-2xl border-2 border-purple-700/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-white text-xl shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">REDIRECT (Behavioral Reset)</h4>
                  <p className="text-purple-200 mb-3">
                    Immediately take a small action. Smile, ask a question, or change the subject. Movement breaks the freeze.
                  </p>
                </div>
              </div>
              <div className="bg-green-900/20 p-4 rounded-xl border border-green-700/30">
                <p className="text-green-200 text-sm font-medium mb-2">Quick redirects:</p>
                <ul className="text-green-300 text-sm space-y-1">
                  <li>• Smile and say "Anyway..." then continue</li>
                  <li>• Ask them a question to shift focus</li>
                  <li>• Acknowledge it lightly: "Well, that was awkward!" (laugh)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-5 rounded-xl border border-yellow-500/30">
            <Flame className="w-6 h-6 text-orange-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Pro Tip</h4>
            <p className="text-orange-100">
              The first 5 times will feel mechanical. By the 20th time, it becomes your default response. 
              You're literally rewiring your brain.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'practice',
      title: 'Interactive Practice',
      icon: Play,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-6 rounded-2xl border-2 border-orange-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Play className="w-7 h-7 text-orange-400" />
              Real Scenario Practice
            </h3>
            <p className="text-orange-100 mb-2">
              Let's practice with actual awkward situations. You'll see a scenario and choose how to respond.
            </p>
            <p className="text-orange-200 text-sm italic">
              No judgment here—this is your safe space to mess up and learn.
            </p>
          </div>

          {!practiceMode ? (
            <div className="text-center py-12 bg-purple-950/30 rounded-2xl border-2 border-purple-700/30">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Ready to Practice?</h4>
              <p className="text-purple-200 mb-6 max-w-md mx-auto">
                You'll work through 3 common awkward scenarios and learn the best recovery techniques.
              </p>
              <button
                onClick={() => setPracticeMode(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl font-bold text-lg transition-all shadow-xl flex items-center gap-3 mx-auto"
              >
                <Play className="w-6 h-6" />
                Start Practice Session
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {scenarios.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                        idx === currentScenario
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white scale-110 shadow-xl'
                          : idx < currentScenario
                          ? 'bg-green-500/30 text-green-300 border-2 border-green-500/50'
                          : 'bg-purple-900/30 text-purple-400 border-2 border-purple-700/30'
                      }`}
                    >
                      {idx < currentScenario ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setPracticeMode(false);
                    setCurrentScenario(0);
                    setScenarioFeedback(null);
                  }}
                  className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5 text-purple-400" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2 text-lg">Scenario {currentScenario + 1}</h4>
                    <p className="text-purple-100">{scenarios[currentScenario].situation}</p>
                  </div>
                </div>

                {!scenarioFeedback ? (
                  <div className="space-y-3">
                    <p className="text-purple-200 font-medium mb-3">How would you recover from this?</p>
                    
                    <button
                      onClick={() => {
                        setScenarioFeedback('bad');
                        setUserProgress(prev => ({
                          ...prev,
                          practiceAttempts: prev.practiceAttempts + 1
                        }));
                      }}
                      className="w-full p-4 bg-red-900/20 hover:bg-red-900/30 border-2 border-red-500/30 hover:border-red-500/50 rounded-xl text-left transition-all"
                    >
                      <p className="text-red-200 font-medium">{scenarios[currentScenario].badResponse}</p>
                    </button>

                    <button
                      onClick={() => {
                        setScenarioFeedback('good');
                        setUserProgress(prev => ({
                          ...prev,
                          practiceAttempts: prev.practiceAttempts + 1,
                          totalXP: prev.totalXP + 50,
                          confidence: Math.min(prev.confidence + 15, 100)
                        }));
                      }}
                      className="w-full p-4 bg-green-900/20 hover:bg-green-900/30 border-2 border-green-500/30 hover:border-green-500/50 rounded-xl text-left transition-all"
                    >
                      <p className="text-green-200 font-medium">{scenarios[currentScenario].goodResponse}</p>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-5 rounded-xl border-2 ${
                      scenarioFeedback === 'good'
                        ? 'bg-green-900/20 border-green-500/50'
                        : 'bg-orange-900/20 border-orange-500/50'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        {scenarioFeedback === 'good' ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <h4 className="font-bold text-green-100 text-lg">Great Choice! 🎉</h4>
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-6 h-6 text-orange-400" />
                            <h4 className="font-bold text-orange-100 text-lg">Learning Opportunity</h4>
                          </>
                        )}
                      </div>
                      <p className={scenarioFeedback === 'good' ? 'text-green-200' : 'text-orange-200'}>
                        {scenarios[currentScenario].tip}
                      </p>
                    </div>

                    <div className="bg-purple-950/30 p-4 rounded-xl border border-purple-700/30">
                      <p className="text-purple-200 text-sm mb-2 font-medium">Notice how the good response uses:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-300">1</span>
                          </div>
                          <p className="text-purple-300 text-sm">Physical reset (breath/smile)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-300">2</span>
                          </div>
                          <p className="text-purple-300 text-sm">Mental reframe (normalizing)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-green-300">3</span>
                          </div>
                          <p className="text-purple-300 text-sm">Behavioral redirect (move forward)</p>
                        </div>
                      </div>
                    </div>

                    {currentScenario < scenarios.length - 1 ? (
                      <button
                        onClick={() => {
                          setCurrentScenario(currentScenario + 1);
                          setScenarioFeedback(null);
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3"
                      >
                        Next Scenario
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setUserProgress(prev => ({
                            ...prev,
                            completedSteps: [...prev.completedSteps, 'practice']
                          }));
                          setCurrentStep(4);
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3"
                      >
                        Complete Practice
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'reflection',
      title: 'Personal Reflection',
      icon: Lightbulb,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-2xl border-2 border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lightbulb className="w-7 h-7 text-yellow-400" />
              Reflection: Your Personal Pattern
            </h3>
            <p className="text-purple-100">
              Understanding your unique triggers is key. Let's identify what makes YOU lose emotional control.
            </p>
          </div>

          <div className="bg-purple-950/30 p-6 rounded-2xl border-2 border-purple-700/30">
            <h4 className="font-bold text-white mb-4">Think of your last awkward social moment:</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2 font-medium">What happened?</label>
                <textarea
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="Describe the situation briefly..."
                  className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-700/30">
                  <p className="text-blue-200 font-medium mb-2 text-sm">What did you do?</p>
                  <p className="text-blue-300 text-xs">Your immediate reaction</p>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-700/30">
                  <p className="text-purple-200 font-medium mb-2 text-sm">What did it cost you?</p>
                  <p className="text-purple-300 text-xs">Confidence? Connection?</p>
                </div>
                <div className="bg-green-900/20 p-4 rounded-xl border border-green-700/30">
                  <p className="text-green-200 font-medium mb-2 text-sm">What would you do now?</p>
                  <p className="text-green-300 text-xs">Using the 3-step protocol</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (reflectionInput.trim()) {
                    setUserProgress(prev => ({
                      ...prev,
                      reflections: [...prev.reflections, reflectionInput],
                      completedSteps: [...prev.completedSteps, 'reflection'],
                      totalXP: prev.totalXP + 100
                    }));
                    setReflectionInput('');
                    triggerConfetti();
                  }
                }}
                disabled={!reflectionInput.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-5 h-5" />
                Save Reflection (+100 XP)
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-5 rounded-xl border border-yellow-500/30">
            <Target className="w-6 h-6 text-orange-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Why This Matters</h4>
            <p className="text-orange-100">
              Self-awareness is the first step to mastery. By identifying your patterns, you can catch yourself earlier in the spiral and apply the recovery protocol faster.
            </p>
          </div>

          {userProgress.reflections.length > 0 && (
            <div className="bg-green-900/20 p-5 rounded-xl border-2 border-green-500/30">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h4 className="font-bold text-white">Reflection Saved! 🎉</h4>
              </div>
              <p className="text-green-200 text-sm">
                Great work! You've just taken the first step toward rewiring your emotional responses. 
                Review this reflection weekly to track your growth.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'action-plan',
      title: '21-Day Action Plan',
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 p-6 rounded-2xl border-2 border-emerald-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
              Your 21-Day Mastery Plan
            </h3>
            <p className="text-emerald-100 mb-2">
              Emotional control is a skill, not a trait. Here's your roadmap to make it automatic.
            </p>
            <p className="text-emerald-200 text-sm italic">
              Research shows it takes 21 days to form a new habit. Let's build yours.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-950/30 p-5 rounded-2xl border-2 border-purple-700/30">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <span className="text-2xl font-bold text-white">1-7</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Week 1: Awareness Phase</h4>
                  <p className="text-purple-200 mb-3 text-sm">
                    Goal: Notice your emotional reactions without trying to change them yet.
                  </p>
                  <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-700/30">
                    <p className="text-blue-200 font-medium mb-2 text-sm">Daily Practice:</p>
                    <ul className="text-blue-300 text-sm space-y-1">
                      <li>• Journal one awkward moment each day (2 min)</li>
                      <li>• Rate your emotional intensity (1-10)</li>
                      <li>• Note how long it took you to recover</li>
                      <li>• No judgment—just observe the pattern</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/30 p-5 rounded-2xl border-2 border-purple-700/30">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <span className="text-xl font-bold text-white">8-14</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Week 2: Application Phase</h4>
                  <p className="text-purple-200 mb-3 text-sm">
                    Goal: Apply the 3-step protocol in real situations (even if it feels awkward).
                  </p>
                  <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-700/30">
                    <p className="text-purple-200 font-medium mb-2 text-sm">Daily Practice:</p>
                    <ul className="text-purple-300 text-sm space-y-1">
                      <li>• Use the protocol 3x daily (set phone reminders)</li>
                      <li>• Practice on SMALL awkward moments first</li>
                      <li>• Track: Did I breathe? Reframe? Redirect?</li>
                      <li>• Celebrate every attempt (not just successes)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/30 p-5 rounded-2xl border-2 border-purple-700/30">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <span className="text-xl font-bold text-white">15-21</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Week 3: Integration Phase</h4>
                  <p className="text-purple-200 mb-3 text-sm">
                    Goal: Make emotional control your default response (automatic).
                  </p>
                  <div className="bg-green-900/20 p-4 rounded-xl border border-green-700/30">
                    <p className="text-green-200 font-medium mb-2 text-sm">Daily Practice:</p>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• Seek out mildly challenging social situations</li>
                      <li>• Notice how much faster you recover now</li>
                      <li>• Compare Week 3 recovery time vs Week 1</li>
                      <li>• Share your progress with someone you trust</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Pro Tips for Success
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <p className="text-purple-200 font-medium mb-2 text-sm">✅ Do This</p>
                <ul className="text-purple-300 text-xs space-y-1">
                  <li>• Start with easy situations</li>
                  <li>• Practice when you're calm too</li>
                  <li>• Track your wins in writing</li>
                  <li>• Be patient with yourself</li>
                </ul>
              </div>
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <p className="text-red-200 font-medium mb-2 text-sm">❌ Avoid This</p>
                <ul className="text-red-300 text-xs space-y-1">
                  <li>• Expecting perfection immediately</li>
                  <li>• Avoiding awkwardness completely</li>
                  <li>• Beating yourself up for mistakes</li>
                  <li>• Skipping the reflection step</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-5 rounded-xl border border-yellow-500/30">
            <Award className="w-6 h-6 text-yellow-400 mb-3" />
            <h4 className="font-bold text-white mb-2">What Success Looks Like</h4>
            <p className="text-orange-100 text-sm">
              By Day 21, awkward moments that used to ruin your day will become minor blips. 
              You won't be fearless—you'll just recover so fast that fear won't matter anymore.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'You\'re Ready!',
      icon: Trophy,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 p-6 rounded-2xl border-2 border-yellow-500/30 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Congratulations! 🎉
            </h3>
            <p className="text-yellow-100 text-lg mb-2">
              You've completed the Emotional Control Mastery program!
            </p>
            <p className="text-yellow-200 text-sm">
              You now have the tools to handle any awkward situation with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-900/30 p-5 rounded-2xl border-2 border-purple-500/30 text-center">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-7 h-7 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{userProgress.completedSteps.length}</p>
              <p className="text-purple-300 text-sm">Steps Completed</p>
            </div>

            <div className="bg-purple-900/30 p-5 rounded-2xl border-2 border-purple-500/30 text-center">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-7 h-7 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{userProgress.totalXP}</p>
              <p className="text-purple-300 text-sm">XP Earned</p>
            </div>

            <div className="bg-purple-900/30 p-5 rounded-2xl border-2 border-purple-500/30 text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{userProgress.practiceAttempts}</p>
              <p className="text-purple-300 text-sm">Practice Scenarios</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border-2 border-purple-500/30">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              What You've Learned
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-purple-950/30 p-4 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Why emotional control is your secret weapon</p>
                  <p className="text-purple-300 text-xs mt-1">It's not what happens, it's how fast you recover</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-purple-950/30 p-4 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">The neuroscience behind awkwardness</p>
                  <p className="text-purple-300 text-xs mt-1">Your 90-second window to change the outcome</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-purple-950/30 p-4 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">The 3-step recovery protocol</p>
                  <p className="text-purple-300 text-xs mt-1">Breathe → Reframe → Redirect</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-purple-950/30 p-4 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Your personal triggers and patterns</p>
                  <p className="text-purple-300 text-xs mt-1">Self-awareness accelerates growth</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-purple-950/30 p-4 rounded-xl border border-purple-700/30">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">A 21-day action plan for mastery</p>
                  <p className="text-purple-300 text-xs mt-1">From aware to automatic in 3 weeks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-5 rounded-xl border border-green-500/30">
            <Sparkles className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Your Next Steps</h4>
            <ol className="text-emerald-100 text-sm space-y-2">
              <li>1. Save your reflection notes somewhere you'll revisit</li>
              <li>2. Set a daily reminder to practice the 3-step protocol</li>
              <li>3. Start your 21-day challenge TODAY (not tomorrow)</li>
              <li>4. Share what you learned with someone who needs it</li>
              <li>5. Come back to this whenever you need a refresh</li>
            </ol>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onNext}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl transition-all shadow-2xl flex items-center gap-3 mx-auto hover:scale-105"
            >
              <Trophy className="w-6 h-6" />
              Complete & Continue
              <ChevronRight className="w-6 h-6" />
            </button>
            <p className="text-purple-400 text-sm mt-4 italic">
              "The only way to do great work is to love what you do." — Steve Jobs
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  useEffect(() => {
    if (currentStep === steps.length - 1) {
      triggerConfetti();
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* PROGRESS HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Emotional Control Mastery
              </h1>
              <p className="text-purple-300">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-800/40 rounded-full border border-purple-500/30 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-white">{userProgress.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-800/40 rounded-full border border-purple-500/30">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-bold text-white">{userProgress.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-purple-950/50 rounded-full overflow-hidden border-2 border-purple-700/30 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* STEP NAVIGATION */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = userProgress.completedSteps.includes(step.id) || idx < currentStep;
              const isCurrent = idx === currentStep;
              const isLocked = idx > currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => !isLocked && setCurrentStep(idx)}
                  disabled={isLocked}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all min-w-[200px] ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 scale-105 shadow-xl'
                      : isCompleted
                      ? 'bg-green-600/30 border-green-500/50 hover:bg-green-600/40'
                      : 'bg-purple-900/20 border-purple-700/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCurrent
                      ? 'bg-white/20'
                      : isCompleted
                      ? 'bg-green-500/30'
                      : 'bg-purple-800/30'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-300" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-purple-500" />
                    ) : (
                      <Icon className="w-6 h-6 text-purple-300" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-purple-200'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-purple-300">Step {idx + 1}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{currentStepData.title}</h2>
              <p className="text-purple-300 text-sm">Deep dive into mastery</p>
            </div>
          </div>

          {currentStepData.content}
        </div>

        {/* NAVIGATION BUTTONS */}
        {currentStep < steps.length - 1 && (
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 py-4 bg-purple-900/50 hover:bg-purple-800/50 border-2 border-purple-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                Previous
              </button>
            )}
            <button
              onClick={() => {
                setUserProgress(prev => ({
                  ...prev,
                  completedSteps: [...new Set([...prev.completedSteps, currentStepData.id])],
                  totalXP: prev.totalXP + 25,
                  confidence: Math.min(prev.confidence + 10, 100)
                }));
                setCurrentStep(currentStep + 1);
              }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CONFETTI */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmotionalControl;