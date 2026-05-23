import React, { useState, useEffect } from "react";
import { 
  MapPin, Clock, Users, TrendingUp, Lightbulb, Target, 
  Download, Copy, Check, AlertCircle, Battery, ChevronDown, 
  ChevronUp, Sparkles, Eye, MessageCircle, DoorOpen, Shield,
  Zap, BarChart3, Award, FileText, Loader2, RefreshCw
} from "lucide-react";

interface PageProps {
  onNext: () => void;
}

interface VenueIntel {
  name: string;
  type: string;
  typical_crowd: string;
  noise_level: string;
  social_zones: string;
  best_approach_time: string;
  friendliness_score: number;
  current_busyness?: string;
}

interface Opener {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  context: string;
  success_probability: number;
  ai_reasoning: string;
}

interface ScenarioGuide {
  scenario: string;
  likelihood: number;
  approach: string;
  green_signals: string[];
  red_signals: string[];
}

interface ConversationFlow {
  opener: string;
  likely_responses: {
    response: string;
    probability: number;
    your_followup: string;
  }[];
}

export const CONVOPREP: React.FC<PageProps> = ({ onNext }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(3);
  
  // API Response States
  const [venueIntel, setVenueIntel] = useState<VenueIntel | null>(null);
  const [openers, setOpeners] = useState<Opener[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioGuide[]>([]);
  const [conversationFlows, setConversationFlows] = useState<ConversationFlow[]>([]);
  const [cheatSheet, setCheatSheet] = useState<string>("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [briefingGenerated, setBriefingGenerated] = useState(false);
  const [selectedOpener, setSelectedOpener] = useState<string | null>(null);
  const [copiedCheatSheet, setCopiedCheatSheet] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    venueIntel: true,
    openers: true,
    scenarios: false,
    flows: false,
    anxiety: false
  });

  // ============================================================================
  // API INTEGRATION FUNCTIONS
  // ============================================================================
const generateBriefing = async () => {
  console.log("[Briefing] Starting briefing generation...");
  console.log("[Briefing] Current input values:", { location, time, energyLevel, confidenceLevel });

  if (!location) {
    console.warn("[Briefing] Missing location.");
    alert("Please enter location");
    return;
  }

  setLoading(true);
  setBriefingGenerated(false);

  try {
    // Generate a fixed time (current time + 1 hour)
    const fixedTime = new Date();
    fixedTime.setHours(fixedTime.getHours() + 1);
    const formattedTime = fixedTime.toISOString();

    const payload = {
      location,
      time: formattedTime, // Use fixed time instead of state variable
      energy_level: energyLevel,
      confidence_level: confidenceLevel,
      user_id: localStorage.getItem('user_id') || 'mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2',
      user_history: {}
    };

    console.log("[Briefing] Sending request with payload:", payload);

    const response = await fetch('https://one23-u2ck.onrender.com/api/generate-briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    });

    console.log("[Briefing] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Briefing] Error response:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("[Briefing] Raw API response:", data);

    setVenueIntel(data.venue_intel);
    setOpeners(data.openers);
    setScenarios(data.scenarios);
    setConversationFlows(data.conversation_flows);
    setCheatSheet(data.cheat_sheet);

    console.log("[Briefing] Successfully set all briefing data.");
    setBriefingGenerated(true);
  } catch (error) {
    console.error("[Briefing ERROR] Failed to generate briefing:", error);
    alert('Failed to generate briefing. Please try again.');
  } finally {
    console.log("[Briefing] Generation process finished.");
    setLoading(false);
  }
};



const regenerateOpeners = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://one23-u2ck.onrender.com/api/regenerate-openers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          confidence_level: confidenceLevel,
          previous_openers: openers.map(o => o.id)
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setOpeners(data.openers);
    } catch (error) {
      console.error('Failed to regenerate:', error);
      alert('Failed to regenerate openers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveOpenerAsFavorite = async (openerId: string) => {
    try {
      const response = await fetch('https://one23-u2ck.onrender.com/api/save-favorite-opener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id') || 'mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2',
          opener_id: openerId
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      console.log('Opener saved as favorite');
    } catch (error) {
      console.error('Failed to save favorite:', error);
      alert('Failed to save favorite opener.');
    }
  };

  const downloadCheatSheet = () => {
    // TODO: Could enhance this to call backend for formatted PDF
    const blob = new Blob([cheatSheet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission-briefing-${Date.now()}.txt`;
    a.click();
  };

  const copyCheatSheet = () => {
    navigator.clipboard.writeText(cheatSheet);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  // ============================================================================
  // UI HELPER FUNCTIONS
  // ============================================================================

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-pink-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '🌱';
      case 'medium': return '🔥';
      case 'hard': return '💎';
      default: return '⭐';
    }
  };

  const getEnergyLabel = (level: number) => {
    if (level === 1) return 'Very Low - Just observe today';
    if (level === 2) return 'Low - One interaction is enough';
    if (level === 3) return 'Medium - Aim for quality over quantity';
    if (level === 4) return 'High - Try 2-3 conversations';
    return 'Very High - Push your limits!';
  };

  // ============================================================================
  // RENDER: INPUT FORM (Before briefing generated)
  // ============================================================================

  if (!briefingGenerated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Target className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Mission Preparation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Prepare Your Conversation
            </h1>
            <p className="text-lg text-purple-300">
              Let's create a plan for your next conversation
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            
            {/* Location Input */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <MapPin className="w-5 h-5" />
                Where are you going?
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Starbucks on 5th Ave, LA Fitness Downtown, Tech Meetup at WeWork"
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
              <p className="text-sm text-purple-400 mt-2">💡 Be specific: venue name, type, and location</p>
            </div>

            

            {/* Energy Level Slider */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <Battery className="w-5 h-5" />
                Your Energy Level Today
              </label>
              <div className="flex items-center gap-4">
                <span className="text-purple-400">Low</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="flex-1 h-3 bg-purple-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                />
                <span className="text-purple-400">High</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <div 
                    key={level}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      level <= energyLevel 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-purple-900/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-purple-300 mt-3">{getEnergyLabel(energyLevel)}</p>
            </div>

            {/* Confidence Level Slider */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <TrendingUp className="w-5 h-5" />
                Your Confidence Level
              </label>
              <div className="flex items-center gap-4">
                <span className="text-purple-400">Nervous</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  className="flex-1 h-3 bg-purple-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                />
                <span className="text-purple-400">Confident</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <div 
                    key={level}
                    className={`h-2 flex-1 rounded-full transition-all ${

                      level <= confidenceLevel 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-purple-900/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-purple-300 mt-3">
                {confidenceLevel <= 2 && "AI will suggest safer, low-risk openers"}
                {confidenceLevel === 3 && "AI will balance safety and boldness"}
                {confidenceLevel >= 4 && "AI will suggest bolder, engaging openers"}
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateBriefing}
              disabled={loading || !location }
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Your Mission Briefing...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate AI Mission Briefing
                </>
              )}
            </button>

            <p className="text-center text-sm text-purple-400 mt-4">
              This will take 5-10 seconds as AI analyzes your venue
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MISSION BRIEFING (After generation)
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-800/40 backdrop-blur-sm rounded-full border border-green-500/30">
            <Check className="w-5 h-5 text-green-300" />
            <span className="text-sm font-medium text-green-200">Mission Briefing Ready</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Your Mission Briefing
          </h1>
          <p className="text-purple-300 mb-4">{location} • {new Date(time).toLocaleString()}</p>
          
          <button
            onClick={() => {
              setBriefingGenerated(false);
              setLocation("");
              setTime("");
            }}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Change Location/Time
          </button>
        </div>

        {/* Venue Intel Section */}
        {venueIntel && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('venueIntel')}
              className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-100">📍 Venue Intel</h2>
              </div>
              {expandedSections.venueIntel ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>

            {expandedSections.venueIntel && (
              <div className="mt-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="text-purple-400 text-sm mb-1">Typical Crowd</p>
                    <p className="text-white font-semibold">{venueIntel.typical_crowd}</p>
                  </div>
                  <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="text-purple-400 text-sm mb-1">Noise Level</p>
                    <p className="text-white font-semibold">{venueIntel.noise_level}</p>
                  </div>
                  <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="text-purple-400 text-sm mb-1">Best Social Zones</p>
                    <p className="text-white font-semibold">{venueIntel.social_zones}</p>
                  </div>
                  <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <p className="text-purple-400 text-sm mb-1">Best Approach Time</p>
                    <p className="text-white font-semibold">{venueIntel.best_approach_time}</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-green-300 font-semibold">Social Friendliness Score</p>
                    <p className="text-2xl font-bold text-white">{venueIntel.friendliness_score}%</p>
                  </div>
                  <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${venueIntel.friendliness_score}%` }}
                    />
                  </div>
                  <p className="text-sm text-green-400 mt-2">
                    {venueIntel.friendliness_score >= 80 && "🎉 Excellent! People here are typically very open to conversation"}
                    {venueIntel.friendliness_score >= 60 && venueIntel.friendliness_score < 80 && "✅ Good! Moderate social atmosphere"}
                    {venueIntel.friendliness_score < 60 && "⚠️ Lower social environment - be more selective with approaches"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI-Generated Openers Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('openers')}
            className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-100">💬 Your Custom Openers</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  regenerateOpeners();
                }}
                disabled={loading}
                className="p-2 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              {expandedSections.openers ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
          </button>

          {expandedSections.openers && (
            <div className="mt-4 space-y-4">
              {openers.map((opener) => (
                <div
                  key={opener.id}
                  className={`bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedOpener === opener.id
                      ? 'border-purple-400 shadow-xl scale-[1.02]'
                      : 'border-purple-500/20 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedOpener(opener.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getDifficultyIcon(opener.difficulty)}</span>
                      <div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getDifficultyColor(opener.difficulty)} mb-2`}>
                          {opener.difficulty.toUpperCase()}
                        </div>
                        <p className="text-lg font-bold text-white">{opener.text}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{opener.success_probability}%</p>
                      <p className="text-xs text-purple-400">Success Rate</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-purple-300 font-semibold">When to use:</p>
                        <p className="text-purple-200">{opener.context}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-purple-300 font-semibold">AI Insight:</p>
                        <p className="text-purple-200">{opener.ai_reasoning}</p>
                      </div>
                    </div>
                  </div>

                  {selectedOpener === opener.id && (
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveOpenerAsFavorite(opener.id);
                        }}
                        className="w-full py-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Award className="w-5 h-5" />
                        I'll Use This One
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scenario Guides Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('scenarios')}
            className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-100">👀 What to Look For</h2>
            </div>
            {expandedSections.scenarios ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.scenarios && scenarios && (
            <div className="mt-4 space-y-4">
              {scenarios.map((scenario, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{scenario.scenario}</h3>
                    <div className="px-3 py-1 bg-purple-700/50 rounded-full">
                      <p className="text-sm font-bold text-white">{scenario.likelihood}% likely</p>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-purple-950/40 rounded-xl">
                    <p className="text-purple-200">{scenario.approach}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                      <p className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Green Lights (Approach!)
                      </p>
                      <ul className="space-y-1">
                        {scenario.green_signals.map((signal, i) => (
                          <li key={i} className="text-sm text-green-200">• {signal}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                      <p className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Red Lights (Don't Approach)
                      </p>
                      <ul className="space-y-1">
                        {scenario.red_signals.map((signal, i) => (
                          <li key={i} className="text-sm text-red-200">• {signal}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Flows Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('flows')}
            className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-100">🌊 Conversation Flow Predictions</h2>
            </div>
            {expandedSections.flows ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.flows && conversationFlows && (
            <div className="mt-4 space-y-4">
              {conversationFlows.map((flow, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20"
                >
                  <div className="mb-4">
                    <p className="text-purple-400 text-sm mb-2">YOU START WITH:</p>
                    <div className="p-4 bg-blue-900/20 rounded-xl border-l-4 border-blue-400">
                      <p className="text-white font-semibold">"{flow.opener}"</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-purple-300 font-semibold mb-2">THEY MIGHT SAY:</p>
                    {flow.likely_responses.map((response, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="px-2 py-1 bg-purple-700/50 rounded text-xs font-bold">
                            {response.probability}%
                          </div>
                          <div className="flex-1">
                            <div className="p-3 bg-purple-950/40 rounded-xl mb-2">
                              <p className="text-purple-200">"{response.response}"</p>
                            </div>
                            <div className="pl-4 border-l-2 border-green-500/30">
                              <p className="text-green-400 text-sm mb-1">YOUR FOLLOW-UP:</p>
                              <div className="p-3 bg-green-900/20 rounded-xl border border-green-500/30">
                                <p className="text-green-200">"{response.your_followup}"</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anxiety Management Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('anxiety')}
            className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-100">🛡️ What If Things Go Wrong?</h2>
            </div>
            {expandedSections.anxiety ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.anxiety && (
            <div className="mt-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20">
              <div className="space-y-4">
                <div className="p-4 bg-orange-900/20 rounded-xl border-l-4 border-orange-400">
                  <p className="text-orange-300 font-semibold mb-2">😰 "What if they ignore me?"</p>
                  <p className="text-purple-200 text-sm">That's on them, not you. It happens to everyone. Try someone else - each attempt builds confidence.</p>
                </div>

                <div className="p-4 bg-orange-900/20 rounded-xl border-l-4 border-orange-400">
                  <p className="text-orange-300 font-semibold mb-2">😰 "What if I freeze up?"</p>
                  <p className="text-purple-200 text-sm">Use your backup line: "Sorry, lost my train of thought!" Most people find it relatable and endearing.</p>
                </div>

                <div className="p-4 bg-orange-900/20 rounded-xl border-l-4 border-orange-400">
                  <p className="text-orange-300 font-semibold mb-2">😰 "What if the conversation dies?"</p>
                  <p className="text-purple-200 text-sm">You have exit lines ready below! Use one gracefully and feel proud you tried.</p>
                </div>

                <div className="p-4 bg-orange-900/20 rounded-xl border-l-4 border-orange-400">
                  <p className="text-orange-300 font-semibold mb-2">😰 "What if they're rude?"</p>
                  <p className="text-purple-200 text-sm">Rare! But if so: "No worries, have a good one" and move on. Their rudeness reflects them, not you.</p>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-700/30 to-pink-700/30 rounded-xl border border-purple-400/30">
                  <p className="text-white font-bold mb-2">💪 Remember:</p>
                  <p className="text-purple-200 text-sm">Professional actors forget lines. NBA players miss shots. Success = trying, not outcome. Every interaction teaches you something.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cheat Sheet Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-100">📱 Your Pocket Cheat Sheet</h2>
            </div>

            <p className="text-purple-300 mb-4 text-sm">
              Save this to your phone - glance at it before approaching someone!
            </p>

            <div className="bg-purple-950/50 p-5 rounded-xl border border-purple-700/30 mb-4 max-h-64 overflow-y-auto">
              <pre className="text-purple-200 text-sm whitespace-pre-wrap font-mono">
                {cheatSheet}
              </pre>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyCheatSheet}
                className="flex-1 py-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {copiedCheatSheet ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </button>

              <button
                onClick={downloadCheatSheet}
                className="flex-1 py-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download as File
              </button>
            </div>
          </div>
        </div>

        {/* Success Predictions */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md p-6 rounded-3xl border-2 border-green-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-green-100">🎯 Predicted Outcomes</h2>
            </div>

            <p className="text-green-300 mb-4 text-sm">
              Based on your energy level, confidence, venue, and time:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 text-right">
                  <p className="text-2xl font-bold text-white">85%</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[85%]" />
                  </div>
                  <p className="text-sm text-green-200 mt-1">Making eye contact & smiling at 3+ people</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 text-right">
                  <p className="text-2xl font-bold text-white">70%</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[70%]" />
                  </div>
                  <p className="text-sm text-green-200 mt-1">5+ minute conversation</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 text-right">
                  <p className="text-2xl font-bold text-white">50%</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[50%]" />
                  </div>
                  <p className="text-sm text-green-200 mt-1">Exchanging names</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 text-right">
                  <p className="text-2xl font-bold text-white">25%</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[25%]" />
                  </div>
                  <p className="text-sm text-green-200 mt-1">Getting follow-up contact info</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-800/20 rounded-xl border border-green-500/30">
              <p className="text-green-200 text-sm">
                <strong>Today's Goal:</strong> Make eye contact with 3 people and attempt 1 conversation.
                Everything beyond that is a bonus! 🎉
              </p>
            </div>
          </div>
        </div>

        {/* Mission Goals */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-purple-100">⚡ Your Mission Objectives</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-purple-950/40 rounded-xl border-l-4 border-green-500">
                <p className="text-green-400 font-semibold mb-1">✅ BASELINE GOAL (Must Do)</p>
                <p className="text-purple-200 text-sm">Make friendly eye contact with 3 people</p>
              </div>

              <div className="p-4 bg-purple-950/40 rounded-xl border-l-4 border-yellow-500">
                <p className="text-yellow-400 font-semibold mb-1">🎯 TARGET GOAL (Aim For)</p>
                <p className="text-purple-200 text-sm">Have one 2-5 minute conversation</p>
              </div>

              <div className="p-4 bg-purple-950/40 rounded-xl border-l-4 border-purple-500">
                <p className="text-purple-400 font-semibold mb-1">🚀 STRETCH GOAL (If You're Feeling It)</p>
                <p className="text-purple-200 text-sm">Exchange names or get a follow-up connection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="sticky bottom-6 z-10">
          <button
            onClick={onNext}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            <DoorOpen className="w-6 h-6" />
            I'm Ready - Let's Go! 🚀
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a78bfa, #ec4899);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #8b5cf6, #db2777);
        }
      `}</style>
    </div>
  );
}