import { useState, useRef, useEffect } from 'react';
import { BookOpen, User, Sparkles, ArrowRight, Loader2, Brain, Lightbulb, Target, Send, CheckCircle } from 'lucide-react';

export default function PersonalizedLearning({ onNext }) {
  const [step, setStep] = useState('topic'); // topic, questions, learning
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [lesson, setLesson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentQuestion, lesson]);

  // MOCK DATA FOR DIFFERENT TOPICS
  const mockQuestionsData = {
    'quantum physics': [
      "What's your current profession or field of study?",
      "What hobbies or activities do you enjoy in your free time?",
      "Have you studied any physics before? If so, what level?",
      "What's your main goal for learning about quantum physics?",
      "Can you describe a situation where you'd find this knowledge useful?"
    ],
    'cooking': [
      "What's your current cooking experience level?",
      "What type of cuisine are you most interested in?",
      "Do you cook for yourself, family, or as a hobby?",
      "What's your biggest challenge in the kitchen right now?",
      "What's your ultimate cooking goal?"
    ],
    'machine learning': [
      "What's your programming background?",
      "What's your current profession or field of work?",
      "Have you worked with data or statistics before?",
      "What specific problem do you want to solve with ML?",
      "What's your learning timeline and goals?"
    ],
    'default': [
      "What's your current knowledge level about this topic?",
      "What's your profession or main daily activity?",
      "What hobbies or interests do you have?",
      "Why do you want to learn about this topic?",
      "How do you plan to apply this knowledge in your life?"
    ]
  };

  const mockLessonsData = {
    'quantum physics-software engineer': `# Your Personalized Quantum Physics Journey 🚀

Hey there! I noticed you're a software engineer who loves gaming and wants to understand quantum computing. Let me explain quantum physics in a way that'll click for you!

## 1. Superposition: Like Git Branches for Reality

You know how in Git, a branch exists in multiple states until you commit? Quantum superposition is similar! A quantum particle exists in ALL possible states simultaneously until you "observe" it (like running your code).

**Your Example:** Imagine your game character's position isn't determined until the frame renders - it exists in all possible positions at once. That's superposition!

## 2. Quantum Entanglement: The Ultimate API

Think of entangled particles as two microservices that are SO connected, changing one instantly affects the other - no matter the distance. No REST calls needed, no latency!

**Your Gaming Connection:** In multiplayer games, imagine if player actions could sync INSTANTLY without network delay. That's what entanglement would enable!

## 3. Wave-Particle Duality: Polymorphism in Physics

Just like an object in OOP can behave as different types, light behaves as BOTH a wave AND a particle depending on how you "call" it. The measurement method is like calling different methods on the same object.

## 4. Uncertainty Principle: The Debug Paradox

In debugging, sometimes adding a print statement changes the bug's behavior (Heisenberg would love this!). In quantum physics, measuring a particle's position makes its momentum uncertain, and vice versa.

**Practical Application:** When you work on quantum computing algorithms, this principle means you'll need to design probabilistic systems - like coding with randomness built-in!

## 5. Your Next Steps

Since you want to understand quantum computing:
1. Explore Qiskit (IBM's quantum computing framework) - it's like TensorFlow for quantum!
2. Try quantum circuit design - it's visual, like building flowcharts
3. Study quantum algorithms: Shor's (breaks encryption!) and Grover's (superfast search)

The gaming industry is starting to explore quantum computing for procedural generation and AI. You're learning this at the perfect time!

Ready to dive deeper? Start with Qiskit tutorials - they're designed for developers like you! 🎮⚛️`,

    'cooking-beginner': `# Your Personalized Cooking Adventure! 🍳

I see you're just starting out and want to cook healthy meals for yourself. Perfect! Let's build your cooking skills like leveling up in a game.

## Level 1: Master the Basics (Your Foundation)

Since you mentioned you struggle with timing, let's fix that first:

**The One-Pan Wonder Technique**
- Start with dishes where everything cooks together (less timing stress!)
- Example: Sheet pan chicken with vegetables - everything goes in at once
- Set ONE timer and you're done

## Level 2: Understanding Heat (Your Superpower)

You said your food often burns or is undercooked. Here's the secret:

**Low and Slow vs. Hot and Fast**
- Veggies you mentioned (broccoli, carrots): Medium-high heat, 5-7 mins
- Chicken breast: Medium heat, covered, 6-8 mins per side
- Rice: Low heat, lid on, 18 mins (walk away!)

## Level 3: Your Weekly Meal Prep Strategy

Since you want to save time during your busy work week:

**Sunday Prep (90 minutes total):**
1. Cook a big batch of rice (30 mins hands-off)
2. Roast 4 chicken breasts (25 mins hands-off)
3. Cut raw veggies for the week (20 mins)
4. Make a simple sauce (15 mins)

Mix and match all week! Monday: rice bowl. Tuesday: chicken wrap. Wednesday: veggie stir-fry.

## Your Personal Recipe to Start

Based on your goal of "healthy and simple":

**The Lazy Buddha Bowl**
- Cooked rice (from your prep!)
- Sliced chicken (from your prep!)
- Raw cucumber, tomatoes (from your prep!)
- Drizzle with olive oil + lemon
- Done in 5 minutes!

## Next Steps for YOU

1. Buy these 5 tools: good knife, cutting board, non-stick pan, baking sheet, rice cooker
2. Practice your one-pan meals this week
3. Master 3 recipes before learning more

You mentioned wanting to impress at dinner parties eventually - you're building toward that! One dish at a time. 🌟`,

    'default': `# Your Personalized Learning Journey 🎯

Thank you for sharing about yourself! I've crafted this lesson specifically for your background and goals.

## Understanding the Fundamentals

Based on your current knowledge level, let's start with the core concepts that matter most to YOU.

## Connecting to Your Experience

Since you mentioned [your profession/hobby], here's how this topic directly applies:
- Real-world examples from your field
- Practical applications you'll encounter
- Skills that complement what you already know

## Your Personalized Practice Plan

Given your goals and timeline:

**Week 1-2:** Foundation building
- Focus on core concepts
- Daily practice exercises
- Track your progress

**Week 3-4:** Advanced applications
- Apply to your specific use case
- Build real projects
- Solve actual problems you face

## Next Steps Tailored for You

1. Start with [specific action related to their goals]
2. Practice using [tools/resources relevant to their field]
3. Apply this to [their mentioned situation]

Remember, you're learning this because [their stated reason]. Keep that goal in mind - it'll keep you motivated!

Your unique background in [their field] gives you a special advantage. Use it! 🚀`
  };

  const generateQuestions = () => {
    setLoading(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      const topicLower = topic.toLowerCase();
      let selectedQuestions = mockQuestionsData.default;

      // Match topic to mock data
      if (topicLower.includes('quantum') || topicLower.includes('physics')) {
        selectedQuestions = mockQuestionsData['quantum physics'];
      } else if (topicLower.includes('cook') || topicLower.includes('food') || topicLower.includes('recipe')) {
        selectedQuestions = mockQuestionsData.cooking;
      } else if (topicLower.includes('machine learning') || topicLower.includes('ml') || topicLower.includes('ai')) {
        selectedQuestions = mockQuestionsData['machine learning'];
      }

      setQuestions(selectedQuestions);
      setStep('questions');
      setLoading(false);
    }, 1500);
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: currentAnswer
    }));
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateLesson();
    }
  };

  const generateLesson = () => {
    setLoading(true);
    setError('');
    setStep('learning');

    // Simulate API delay
    setTimeout(() => {
      const topicLower = topic.toLowerCase();
      let selectedLesson = mockLessonsData.default;

      // Check for quantum physics + software engineer
      if ((topicLower.includes('quantum') || topicLower.includes('physics')) && 
          answers[0]?.toLowerCase().includes('software')) {
        selectedLesson = mockLessonsData['quantum physics-software engineer'];
      } 
      // Check for cooking + beginner
      else if ((topicLower.includes('cook') || topicLower.includes('food')) && 
               (answers[0]?.toLowerCase().includes('beginner') || answers[0]?.toLowerCase().includes('none'))) {
        selectedLesson = mockLessonsData['cooking-beginner'];
      }
      // Use default but personalize with their answers
      else {
        selectedLesson = mockLessonsData.default
          .replace('[your profession/hobby]', answers[0] || 'your background')
          .replace('[their profession/hobby]', answers[1] || 'your interests')
          .replace('[their field]', answers[0] || 'your field')
          .replace('[specific action related to their goals]', answers[3] || 'the basics')
          .replace('[tools/resources relevant to their field]', 'relevant tools')
          .replace('[their mentioned situation]', answers[4] || 'real-world scenarios')
          .replace('[their stated reason]', answers[3] || 'your goals');
      }

      setLesson(selectedLesson);
      setLoading(false);
    }, 2000);
  };

  const handleStartOver = () => {
    setStep('topic');
    setTopic('');
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setCurrentAnswer('');
    setLesson('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white bubbly-font">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
        <div className="px-4 md:px-6 lg:px-10 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-purple-100">Personalized Learning</h1>
                <p className="text-xs md:text-sm text-purple-300">AI-Powered Custom Education</p>
              </div>
               {/* NEXT BUTTON TO MOVE TO NEXT PAGE */}
<div className="p-4 flex justify-center">
  <button
    onClick={onNext}
    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-lg font-bold rounded-2xl shadow-xl transition-all"
  >
    Next →
  </button>
</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm font-bold text-green-100">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 md:px-6 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto w-full flex-1">

          {/* STEP 1: TOPIC INPUT */}
          {step === 'topic' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-4">
                  <BookOpen className="w-12 h-12 text-purple-300" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  What do you want to learn?
                </h2>
                <p className="text-lg text-purple-300">
                  I'll create a personalized lesson just for you
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 backdrop-blur-xl border-2 border-purple-400/40 p-8 rounded-3xl shadow-2xl">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && topic.trim() && generateQuestions()}
                  placeholder="e.g., Quantum Physics, Spanish Cooking, Machine Learning..."
                  className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-lg transition-all"
                />

                <button
                  onClick={generateQuestions}
                  disabled={!topic.trim() || loading}
                  className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      Start Learning
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>

              {/* DEMO HINT */}
              <div className="bg-purple-800/20 border border-purple-500/30 rounded-2xl p-4 text-center">
                <p className="text-purple-300 text-sm">
                  💡 <span className="font-bold">Try:</span> "Quantum Physics" or "Cooking" for demo lessons!
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border-2 border-red-400/40 rounded-2xl p-4 text-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: QUESTIONS */}
          {step === 'questions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-800/40 rounded-full border border-purple-500/40 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span className="text-purple-200 font-semibold">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Tell me about yourself
                </h2>
                <p className="text-purple-300">
                  This helps me personalize your learning experience
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden border border-purple-500/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Previous Answers */}
              {Object.entries(answers).map(([idx, answer]) => (
                <div key={idx} className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-purple-300 mb-1">{questions[idx]}</p>
                      <p className="text-white">{answer}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Current Question */}
              <div className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 backdrop-blur-xl border-2 border-purple-400/40 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{currentQuestion + 1}</span>
                  </div>
                  <p className="text-xl text-white font-semibold flex-1 pt-1">
                    {questions[currentQuestion]}
                  </p>
                </div>

                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnswerSubmit();
                    }
                  }}
                  placeholder="Type your answer here... (Shift+Enter for new line)"
                  className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-base resize-none transition-all"
                  rows={4}
                />

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim()}
                  className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-6 h-6" />
                    </>
                  ) : (
                    <>
                      Generate My Lesson
                      <Sparkles className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* STEP 3: LEARNING */}
          {step === 'learning' && (
            <div className="space-y-6 animate-fade-in">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-6">
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Creating Your Personalized Lesson...
                  </h2>
                  <p className="text-lg text-purple-300">
                    Analyzing your background and crafting custom content
                  </p>
                  <div className="flex justify-center gap-2 mt-6">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl mb-4">
                      <Target className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      Your Personalized Lesson
                    </h2>
                    <p className="text-lg text-purple-300">
                      Customized just for you about <span className="text-pink-400 font-bold">{topic}</span>
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-500/30 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500/20 rounded-full blur-xl"></div>
                    
                    <div className="bg-gradient-to-br from-purple-900/70 via-indigo-900/70 to-purple-900/70 backdrop-blur-xl border-2 border-purple-400/40 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-shimmer"></div>
                      
                      <div className="relative z-10 prose prose-invert prose-purple max-w-none">
                        <div className="text-white whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                          {lesson}
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-purple-400/20 rounded-tr-3xl"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-purple-400/20 rounded-bl-3xl"></div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartOver}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    Learn Something New
                  </button>
                </>
              )}

              {error && (
                <div className="bg-red-500/20 border-2 border-red-400/40 rounded-2xl p-4 text-red-200">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

        .bubbly-font {
          font-family: 'Fredoka', sans-serif;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        textarea {
          scrollbar-width: thin;
          scrollbar-color: #a78bfa transparent;
        }

        textarea::-webkit-scrollbar {
          width: 6px;
        }

        textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #a78bfa;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}