import React, { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check
} from "lucide-react";

const STORYTELLING: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  // Add these to the existing useState declarations at the top of STORYTELLING component
const [aiAnalysis, setAiAnalysis] = useState<any>(null);
const [cheatSheetIndex, setCheatSheetIndex] = useState(0);
const [analyzing, setAnalyzing] = useState(false);
const [currentMechanicPage, setCurrentMechanicPage] = useState(0);
const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [practiceStory, setPracticeStory] = useState("");
  const [expandedMechanic, setExpandedMechanic] = useState<string | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  // Add this function inside the STORYTELLING component
const analyzeWithAI = async () => {
  if (practiceStory.length < 50) {
    alert("Please write at least 50 characters before getting AI feedback.");
    return;
  }

  setAnalyzing(true);
  setAnalysisError(null);
  setAiAnalysis(null);

  try {
    const response = await fetch("https://one23-u2ck.onrender.com/api/judge-story", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "HfwcJgkyNNb3T3UdWRDbrCiRQuS2", //prop passed to component
        storyText: practiceStory,
        scenario: scenarios[currentScenarioIndex].title,
        scenarioContext: scenarios[currentScenarioIndex].context,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.analysis) {
      setAiAnalysis(data.analysis);
    } else {
      throw new Error(data.error || "Analysis failed");
    }
  } catch (error: any) {
    console.error("AI analysis error:", error);
    setAnalysisError(error.message || "Failed to analyze story. Please try again.");
  } finally {
    setAnalyzing(false);
  }
};

  const badStory = `"So uh, I was at the gym yesterday. I went there and I was lifting weights. There was this guy next to me and he was lifting a lot. Like really a lot. I was lifting less than him. Then I did some cardio. Then I left. It was an interesting experience. I've been going to the gym for a while now and I keep doing the same thing every time. Anyway, that's my gym story."`;

  const goodStory = `"You know that feeling when you walk into a room and you're clearly the weakest person there? That was me on day one at the gym. I remember standing there, and this guy next to me casually lifted 3x what I was lifting. For a second I thought 'why am I even here?' But then the instructor said something that changed everything—he said 'everyone here started exactly where you are.' I realized it wasn't about being the best, it was just about showing up. Have you ever had a moment like that where you almost gave up on something?"`;

  const mechanics = [
    {
      id: "hook",
      title: "Hook - First 10 Seconds",
      bad: "No hook, rambling intro",
      good: "Opens with curiosity: 'You know that feeling when you're the weakest person in the room?'",
      why: "Grabs attention immediately. Makes listener curious about what happens next.",
    },
    {
      id: "relatable",
      title: "Relatable Emotion",
      bad: "Self-focused facts ('I was lifting weights')",
      good: "Universal feeling: 'That moment of self-doubt'",
      why: "Listener sees themselves in your story. Not about your gym, about THEIR insecurities.",
    },
    {
      id: "details",
      title: "Specific Details",
      bad: "Generic ('a guy was lifting a lot')",
      good: "Concrete ('this guy casually lifted 3x what I was lifting')",
      why: "Specific details make the story real. Listener can picture it.",
    },
    {
      id: "stakes",
      title: "Clear Stakes",
      bad: "No stakes ('it was interesting')",
      good: "Real stakes ('I almost quit')",
      why: "Stakes create tension. Makes listener invested in the outcome.",
    },
    {
      id: "resolution",
      title: "Resolution & Lesson",
      bad: "Unclear ending ('I kept doing the same thing')",
      good: "Clear lesson ('It's not about being best, just about showing up')",
      why: "Listener walks away with something meaningful, not just a plot.",
    },
    {
      id: "bridge",
      title: "The Bridge - Ask About THEM",
      bad: "No bridge. Story ends about you.",
      good: "Ends with question: 'Have you ever felt that way?'",
      why: "Turns monologue into dialogue. Shifts focus to them. Builds real connection.",
    },
  ];

  const scenarios = [
    {
      title: "Cooking Class Scenario",
      prompt: "You're at a cooking class. Someone new asks: 'What made you interested in cooking?' Tell a 60-90 second story.",
      context: "Focus on relatable emotion—maybe fear of failure, discovery, or connection.",
    },
    {
      title: "Gym Scenario",
      prompt: "You're at the gym. Someone notices you're new and asks: 'What brought you here?' Tell your story.",
      context: "Make it about your struggle or motivation, not just facts.",
    },
    {
      title: "Book Club Scenario",
      prompt: "At a book club, someone asks: 'What drew you to reading?' Share your story.",
      context: "Connect it to an emotion or moment, not just 'I like books.'",
    },
  ];

  const practiceStoryScore = () => {
    let score = 0;
    const checks = {
      hasHook: practiceStory.toLowerCase().includes("when") || practiceStory.toLowerCase().includes("ever"),
      hasDetail: practiceStory.length > 100,
      hasEmotion: practiceStory.toLowerCase().includes("felt") || practiceStory.toLowerCase().includes("wondered"),
      hasLesson: practiceStory.toLowerCase().includes("learned") || practiceStory.toLowerCase().includes("realized"),
      hasBridge: practiceStory.toLowerCase().includes("you") && practiceStory.toLowerCase().includes("?"),
    };

    Object.values(checks).forEach(check => {
      if (check) score += 20;
    });

    return { score, checks };
  };

  const feedbackData = practiceStoryScore();

  const cheatSheet = [
    { element: "Hook", template: "Start with a question or curious statement: 'Have you ever...?' or 'You know that feeling when...?'" },
    { element: "Relatable Emotion", template: "Name the universal feeling: fear, joy, doubt, discovery, excitement" },
    { element: "Specific Detail", template: "One concrete detail: '3x weight' not 'a lot'" },
    { element: "Stakes", template: "Why care? 'I almost quit' not 'it was interesting'" },
    { element: "Resolution", template: "Clear ending: 'I learned that X'" },
    { element: "Bridge", template: "End with THEM: 'Have you ever felt that?'" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* HEADER */}
<div className="mb-8 md:mb-12 text-center"> {/* ADDED text-center HERE */}
  <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
    <span className="text-xs md:text-sm font-medium text-purple-200">Storytelling Mastery</span>
  </div>

  {/* h1 centering kept as mx-auto w-fit to ensure the gradient text width is minimal */}
  <h1 className="mx-auto w-fit text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
    Master Connection Through Stories
  </h1>

  <p className="text-base md:text-lg text-purple-200">
    Learn the difference between boring and magnetic stories. The key: make it about THEM, not you.
  </p>
</div>

        {/* PHASE 1: BAD STORY */}
        {currentPhase === 1 && (
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-red-900/40 to-purple-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-red-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-red-200 mb-4 flex items-center gap-2">
                <X className="w-6 h-6" />
                The Problem Story (What NOT to Do)
              </h2>

              <div className="bg-purple-950/50 p-6 rounded-2xl border-l-4 border-red-500 mb-4">
                <p className="text-purple-100 italic text-base leading-relaxed max-h-40 overflow-y-auto">{badStory}</p>
              </div>

              <div className="bg-red-950/30 p-4 rounded-xl border border-red-700/30">
                <h3 className="font-bold text-red-200 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  What's Wrong Here?
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-red-200">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>No hook:</strong> Starts with 'so uh' and facts, not curiosity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-red-200">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>Self-focused:</strong> About what they did, not how they felt</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-red-200">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>Generic details:</strong> 'a guy', 'a lot'—no specifics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-red-200">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>No stakes:</strong> 'It was interesting'—why should they care?</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-red-200">
                    <span className="text-red-400 mt-1">✗</span>
                    <span><strong>No bridge:</strong> Ends about you, never asks about them</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setCurrentPhase(2)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              See the Better Version
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* PHASE 2: GOOD STORY */}
        {currentPhase === 2 && (
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-green-900/40 to-purple-900/40 backdrop-blur-md p-6 rounded-3xl border-2 border-green-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-green-200 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                The Connected Story (What TO Do)
              </h2>

              <div className="bg-purple-950/50 p-6 rounded-2xl border-l-4 border-green-500 mb-4">
                <p className="text-purple-100 italic text-base leading-relaxed max-h-40 overflow-y-auto">{goodStory}</p>
              </div>

              <div className="bg-green-950/30 p-4 rounded-xl border border-green-700/30">
                <h3 className="font-bold text-green-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  What Works Here?
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-green-200">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Hook:</strong> 'You know that feeling...'—immediate curiosity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-green-200">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Relatable emotion:</strong> Self-doubt that everyone feels</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-green-200">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Specific details:</strong> '3x weight', 'instructor said'—vivid</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-green-200">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Clear stakes:</strong> 'almost quit'—listener knows what's at risk</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-green-200">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Bridge:</strong> Ends with question about THEM</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setCurrentPhase(3)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              Learn the 6 Mechanics
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* PHASE 3: MECHANICS - CONVERTED TO MULTI-PAGE VIEW */}
{currentPhase === 3 && (
  // Assuming 'currentMechanicPage' is a local state variable (e.g., initialized to 0) in the parent component
  // For this example, I will assume a way to manage the page index, let's call the setter 'setCurrentMechanicPage'
  // I will also assume 'mechanics' array is defined and accessible.
  <div className="space-y-6 mb-8">
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-6 text-center">The 6 Mechanics of a Great Story</h2>

      {/* MECHANIC DISPLAY CARD (Multi-page form replacement) */}
      <div className="space-y-4">
        {/* Assume currentMechanicPage is the index (0-5) of the mechanic to show */}
        {mechanics[currentMechanicPage] && (
          <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30 space-y-4">
            
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-pink-300">Mechanic {currentMechanicPage + 1} of {mechanics.length}</p>
              <h3 className="text-xl font-bold text-white mt-1">{mechanics[currentMechanicPage].title}</h3>
            </div>

            {/* Bad Version */}
            <div>
              <p className="text-xs text-red-300 font-bold mb-1">❌ Bad Version:</p>
              <p className="text-sm text-purple-200 italic">"{mechanics[currentMechanicPage].bad}"</p>
            </div>
            
            {/* Good Version - Updated from green to indigo theme */}
            <div>
              <p className="text-xs text-indigo-300 font-bold mb-1">✅ Good Version:</p>
              <p className="text-sm text-purple-200 italic">"{mechanics[currentMechanicPage].good}"</p>
            </div>
            
            {/* Why This Works */}
            <div className="p-3 bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-xl border border-purple-500/30">
              <p className="text-xs text-purple-300 font-bold mb-1">💡 Why This Works:</p>
              <p className="text-sm text-purple-100">{mechanics[currentMechanicPage].why}</p>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-between items-center mt-6">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentMechanicPage(prev => Math.max(0, prev - 1))}
          disabled={currentMechanicPage === 0}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            currentMechanicPage === 0
              ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600/50 hover:bg-indigo-500/50 text-white'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Next/Finish Button */}
        <button
          onClick={() => {
            if (currentMechanicPage < mechanics.length - 1) {
              // Go to next page
              setCurrentMechanicPage(prev => prev + 1);
            } else {
              // All pages reviewed, move to next phase
              setCurrentPhase(4);
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-white hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-2"
        >
          {currentMechanicPage < mechanics.length - 1 ? (
            <>
              Next Mechanic
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Finish & Practice
              <Check className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>

    {/* The main phase button is now contextually replaced by the pagination 'Next' button above,
        but keeping the original button logic to move to Phase 4 for completeness if needed. */}
    {/* I'll remove the original button to avoid redundancy, as the pagination handles progression. */}
    {/* The original button was:
      <button
        onClick={() => setCurrentPhase(4)}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
      >
        Practice Your Story
        <ChevronRight className="w-6 h-6" />
      </button>
    */}
  </div>
)}

        {/* PHASE 4: PRACTICE - Updated with AI button */}
{currentPhase === 4 && (
  <div className="space-y-6 mb-8">
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-2">{scenarios[currentScenarioIndex].title}</h2>
      <p className="text-purple-300 text-sm mb-4">{scenarios[currentScenarioIndex].context}</p>

      <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-700/30 mb-6">
        <p className="font-bold text-purple-100 mb-3">{scenarios[currentScenarioIndex].prompt}</p>
      </div>

      <textarea
        value={practiceStory}
        onChange={(e) => {
          setPracticeStory(e.target.value);
          setAiAnalysis(null); // Clear analysis when editing
        }}
        placeholder="Write your story here (60-90 seconds = 150-200 words)..."
        className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none text-base"
        rows={6}
      />

      {/* Basic Feedback (existing) */}
      {practiceStory.length > 0 && !aiAnalysis && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-green-200">Quick Score</p>
              <p className="text-3xl font-bold text-green-300">{feedbackData.score}%</p>
            </div>
            <div className="w-full h-2 bg-green-950/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${feedbackData.score}%` }}
              />
            </div>
          </div>

          {/* Existing basic checks grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border-2 ${feedbackData.checks.hasHook ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
              <p className="text-xs font-bold mb-1">{feedbackData.checks.hasHook ? "✓" : "✗"} Hook</p>
              <p className="text-xs text-purple-200">{feedbackData.checks.hasHook ? "Great opening!" : "Start with 'Have you ever...?'"}</p>
            </div>
            <div className={`p-3 rounded-xl border-2 ${feedbackData.checks.hasEmotion ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
              <p className="text-xs font-bold mb-1">{feedbackData.checks.hasEmotion ? "✓" : "✗"} Emotion</p>
              <p className="text-xs text-purple-200">{feedbackData.checks.hasEmotion ? "Relatable feelings!" : "Name the emotion they'll feel"}</p>
            </div>
            <div className={`p-3 rounded-xl border-2 ${feedbackData.checks.hasDetail ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
              <p className="text-xs font-bold mb-1">{feedbackData.checks.hasDetail ? "✓" : "✗"} Details</p>
              <p className="text-xs text-purple-200">{feedbackData.checks.hasDetail ? "Good length!" : "Add specific details"}</p>
            </div>
            <div className={`p-3 rounded-xl border-2 ${feedbackData.checks.hasLesson ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
              <p className="text-xs font-bold mb-1">{feedbackData.checks.hasLesson ? "✓" : "✗"} Lesson</p>
              <p className="text-xs text-purple-200">{feedbackData.checks.hasLesson ? "Clear takeaway!" : "End with what you learned"}</p>
            </div>
            <div className={`p-3 rounded-xl border-2 md:col-span-2 ${feedbackData.checks.hasBridge ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
              <p className="text-xs font-bold mb-1">{feedbackData.checks.hasBridge ? "✓" : "✗"} Bridge Back</p>
              <p className="text-xs text-purple-200">{feedbackData.checks.hasBridge ? "Nice! Asks about them!" : "End with a question for THEM"}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Button */}
      {practiceStory.length > 0 && !aiAnalysis && (
        <button
          onClick={analyzeWithAI}
          disabled={analyzing}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              Getting AI Expert Feedback...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Get AI Expert Feedback
            </>
          )}
        </button>
      )}

      {/* Error Display */}
      {analysisError && (
        <div className="mt-6 p-4 bg-red-900/30 rounded-xl border-2 border-red-500/30">
          <p className="text-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {analysisError}
          </p>
          <button
            onClick={analyzeWithAI}
            className="mt-3 text-sm text-red-300 hover:text-red-100 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* AI Analysis Display */}
      {aiAnalysis && (
        <div className="mt-6 space-y-6">
          {/* Overall Score */}
          <div className="p-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-3xl border-2 border-blue-500/30">
            <h3 className="text-2xl font-bold text-blue-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              AI Expert Analysis
            </h3>

            <div className="p-4 bg-blue-950/40 rounded-xl mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-blue-200">Overall Score</p>
                <p className="text-4xl font-bold text-blue-300">{aiAnalysis.overallScore}/100</p>
              </div>
              <div className="w-full h-3 bg-blue-950/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                  style={{ width: `${aiAnalysis.overallScore}%` }}
                />
              </div>
            </div>

            {/* Mechanics Breakdown */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-bold text-blue-200 mb-3">Detailed Breakdown:</p>
              
              {Object.entries(aiAnalysis.mechanics || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-purple-100 capitalize">{key}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      value.score >= 80 ? "bg-green-500/20 text-green-300" :
                      value.score >= 60 ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>
                      {value.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-purple-300">{value.feedback}</p>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30 mb-4">
                <p className="text-sm font-bold text-green-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  What's Working Well:
                </p>
                <ul className="space-y-1">
                  {aiAnalysis.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="text-xs text-green-200 flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {aiAnalysis.improvements && aiAnalysis.improvements.length > 0 && (
              <div className="p-4 bg-orange-900/20 rounded-xl border border-orange-500/30 mb-4">
                <p className="text-sm font-bold text-orange-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  How to Improve:
                </p>
                <ul className="space-y-1">
                  {aiAnalysis.improvements.map((improvement: string, idx: number) => (
                    <li key={idx} className="text-xs text-orange-200 flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rewritten Version */}
            {aiAnalysis.rewrittenVersion && (
              <div className="p-5 bg-purple-900/30 rounded-xl border-l-4 border-purple-500">
                <p className="text-sm font-bold text-purple-200 mb-3">AI-Improved Version:</p>
                <p className="text-sm text-purple-100 italic leading-relaxed">
                  "{aiAnalysis.rewrittenVersion}"
                </p>
              </div>
            )}

            {/* Analyze Again Button */}
            <button
              onClick={() => {
                setAiAnalysis(null);
                setPracticeStory("");
              }}
              className="w-full mt-6 px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 border-2 border-purple-500/30 rounded-2xl font-bold text-base text-purple-200 transition-all"
            >
              Write Another Story
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {!aiAnalysis && currentScenarioIndex < scenarios.length - 1 && (
        <button
          onClick={() => {
            setCurrentScenarioIndex(currentScenarioIndex + 1);
            setPracticeStory("");
            setAiAnalysis(null);
          }}
          className="w-full mt-6 px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 border-2 border-purple-500/30 rounded-2xl font-bold text-base text-purple-200 transition-all"
        >
          Try Next Scenario
        </button>
      )}

      {!aiAnalysis && currentScenarioIndex === scenarios.length - 1 && practiceStory.length > 0 && (
        <button
          onClick={() => setCurrentPhase(5)}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
        >
          Get Your Cheat Sheet
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  </div>
)}

        {/* PHASE 5: CHEAT SHEET - CONVERTED TO MULTI-PAGE VIEW */}
{currentPhase === 5 && (
  // Assuming 'cheatSheetIndex' is a state variable initialized to 0
  <div className="space-y-6 mb-8">
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-100 mb-2 text-center">Your Storytelling Cheat Sheet</h2>
      <p className="text-purple-300 text-sm mb-6 text-center">Keep this handy for your next conversation</p>

      {/* MULTI-PAGE CHEAT SHEET DISPLAY */}
      <div className="space-y-4 mb-8">
        {cheatSheet[cheatSheetIndex] && (
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-xl">
            
            {/* Page Indicator */}
            <p className="text-xs font-semibold text-pink-300 mb-4 text-center">
              Element {cheatSheetIndex + 1} of {cheatSheet.length}
            </p>
            
            {/* Current Cheat Sheet Item */}
            <div className="p-5 bg-purple-950/50 rounded-2xl border border-purple-700/30">
              <p className="text-lg font-bold text-white mb-2">{cheatSheet[cheatSheetIndex].element}</p>
              <p className="text-sm text-purple-300 italic">"{cheatSheet[cheatSheetIndex].template}"</p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              
              {/* Previous Button */}
              <button
                onClick={() => setCheatSheetIndex(prev => Math.max(0, prev - 1))}
                disabled={cheatSheetIndex === 0}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  cheatSheetIndex === 0
                    ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600/50 hover:bg-indigo-500/50 text-white'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {/* Next Button */}
              <button
                onClick={() => setCheatSheetIndex(prev => Math.min(cheatSheet.length - 1, prev + 1))}
                disabled={cheatSheetIndex === cheatSheet.length - 1}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  cheatSheetIndex === cheatSheet.length - 1
                    ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-600/50 hover:bg-pink-500/50 text-white'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* END MULTI-PAGE CHEAT SHEET DISPLAY */}

      <div className="p-5 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-2xl border-2 border-purple-500/30 mb-8">
        <p className="text-base font-bold text-purple-100 mb-3">The Golden Rule</p>
        <p className="text-sm text-purple-200 leading-relaxed">
          A great story isn't about you. It's about making 
THEM
 see themselves in your experience. The story is the vehicle. The bridge is the destination. Always end by asking about 
THEM
.
        </p>
      </div>

      {/* Main navigation button only shows once all cheat sheet items are reviewed */}
      {cheatSheetIndex === cheatSheet.length - 1 && (
        <button
          onClick={onNext}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all text-white"
        >
          Ready to Tell Stories
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      
      {/* Optionally, if you want the main button to show regardless, or for the final 'next' click: */}
      {/* If you want the main button to handle the final progression:
      {cheatSheetIndex === cheatSheet.length - 1 && (
        <button
          onClick={onNext}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-xl transition-all"
        >
          Ready to Tell Stories
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      */}

    </div>
  </div>
)}

        {/* BACK BUTTON */}
        {currentPhase > 1 && (
          <button
            onClick={() => setCurrentPhase(currentPhase - 1)}
            className="mt-6 flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default STORYTELLING;