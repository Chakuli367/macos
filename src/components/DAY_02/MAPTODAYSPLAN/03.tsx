import React, { useState, useEffect, useMemo } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { MapPin, Clock, Users, Target, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Zap, TrendingUp, Navigation, BarChart3, Eye, DoorOpen, Sparkles } from "lucide-react";

interface PageProps {
  onNext: () => void;
  briefingData: Array<{
    location: string;
    time: string;
    energyLevel: number;
    confidenceLevel: number;
    venueIntel?: {
      friendliness_score: number;
      typical_crowd: string;
      noise_level: string;
      social_zones: string;
      best_approach_time: string;
    };
    openers?: Array<{
      text: string;
      difficulty: string;
      success_probability: number;
    }>;
  }>;
}



interface BriefingData {
  location: string;
  time: string;
  energyLevel: number;
  confidenceLevel: number;
  venueIntel?: {
    friendliness_score: number;
    typical_crowd: string;
    noise_level: string;
    social_zones: string[];
    best_approach_time: string;
  };
  openers?: Array<{
    text: string;
    difficulty: string;
    success_probability: number;
  }>;
}

interface UserBriefingProps {
  uid: string;
}


interface LocationPlan {
  location: string;
  goalsSet: boolean;
  targetInteractions: number;
  environmentCues: string[];
  exitStrategy: string;
  difficulty: number;
  startTime: string;
}


// HARDCODED UID - Replace with your actual Firebase user ID
const HARDCODED_UID = "mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2";

const MAPTODAYSPLAN: React.FC<PageProps> = ({ onNext }) => {
  console.log("🔥 UserBriefingPaghgge component MOUNTED");
  
  const [briefingData, setBriefingData] = useState<BriefingData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationPlans, setLocationPlans] = useState<LocationPlan[]>([]);
  const [expandedLocations, setExpandedLocations] = useState<{ [key: string]: boolean }>({});
  const [allPlansComplete, setAllPlansComplete] = useState(false);

  // =========================
  // FETCH DATA FROM FIREBASE
  // =========================
  useEffect(() => {
    const fetchBriefingData = async () => {
      console.log("Starting fetchBriefingData for uid:", HARDCODED_UID);

      try {
        const docRef = doc(db, "users", HARDCODED_UID);
        console.log("Document reference created:", docRef);

        const docSnap = await getDoc(docRef);
        console.log("Document snapshot fetched:", docSnap);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User document data:", data);
          console.log("data.last_briefing:", data?.last_briefing);

          const rawBriefing = data?.last_briefing?.briefing_data;
          console.log("Raw briefing_data from last_briefing:", rawBriefing);
          console.log("Type of rawBriefing:", typeof rawBriefing);
          console.log("Is rawBriefing truthy?:", !!rawBriefing);

          if (rawBriefing) {
            console.log("✅ rawBriefing exists, processing...");
            console.log("rawBriefing.location:", rawBriefing.location);
            console.log("rawBriefing.time:", rawBriefing.time);
            console.log("rawBriefing.venue_intel:", rawBriefing.venue_intel);
            console.log("rawBriefing.openers:", rawBriefing.openers);
            
            // briefing_data is a MAP (object), not an array, so we wrap it
            const formattedData = [{
              location: rawBriefing.location || "Unknown Location",
              time: rawBriefing.time || new Date().toISOString(),
              energyLevel: rawBriefing.energy_level || rawBriefing.energyLevel || 3,
              confidenceLevel: rawBriefing.confidence_level || rawBriefing.confidenceLevel || 3,
              venueIntel: rawBriefing.venue_intel ? {
  friendliness_score: rawBriefing.venue_intel.friendliness_score || 50,
  typical_crowd: rawBriefing.venue_intel.typical_crowd || "General crowd",
  noise_level: rawBriefing.venue_intel.noise_level || "moderate",
  social_zones: rawBriefing.venue_intel.social_zones || "N/A",  // ← Just a string
  best_approach_time: rawBriefing.venue_intel.best_approach_time || "Anytime"
} : undefined,
              openers: rawBriefing.openers || []
            }];
            console.log("Formatted briefing data:", formattedData);
            setBriefingData(formattedData);
          } else {
            console.warn("❌ No briefing_data found in last_briefing for this user.");
            console.log("Full data object:", JSON.stringify(data, null, 2));
            setBriefingData([]);
          }
        } else {
          console.warn("User document does not exist.");
          setBriefingData([]);
        }
      } catch (err) {
        console.error("Error fetching briefing_data:", err);
        setBriefingData([]);
      } finally {
        console.log("Finished fetchBriefingData, setting loading to false");
        setLoading(false);
      }
    };

    fetchBriefingData();
  }, []);

  // =========================
  // HELPER FUNCTIONS
  // =========================
  const calculateDifficulty = (friendlinessScore: number, confidenceLevel: number) => {
    const friendlinessWeight = (friendlinessScore / 100) * 10;
    const confidenceWeight = (confidenceLevel / 5) * 10;
    return Math.max(1, 20 - (friendlinessWeight + confidenceWeight));
  };

  const getDifficultyLabel = (difficulty: number) => 
    difficulty <= 5 ? "Easy" : difficulty <= 12 ? "Medium" : "Challenging";
  
  const getDifficultyColor = (difficulty: number) => 
    difficulty <= 5 ? "from-green-500 to-emerald-600" : 
    difficulty <= 12 ? "from-yellow-500 to-orange-600" : 
    "from-red-500 to-pink-600";

  const getEnvironmentCuesForVenue = (venueIntel?: any): string[] => {
    if (!venueIntel) return [];
    const baseTypes = venueIntel.typical_crowd || "";
    const cues: string[] = [
      "People alone or in pairs (easier to approach)", 
      "Open body language (facing outward, not huddled)", 
      "Making eye contact or smiling"
    ];
    if (venueIntel.noise_level === "loud") {
      cues.push(
        "People standing rather than sitting (more approachable)", 
        "Groups of 2-3 rather than large groups", 
        "Natural gathering spots (bar, entrance areas)"
      );
    }
    if (venueIntel.noise_level === "quiet") {
      cues.push(
        "People not actively working or on laptops", 
        "Relaxed facial expressions and open seating", 
        "Natural pause points (between activities)"
      );
    }
    if (baseTypes.includes("professional") || baseTypes.includes("work")) {
      cues.push("Conversation clusters during breaks", "Name tags or business casual dress");
    }
    if (baseTypes.includes("social") || baseTypes.includes("young")) {
      cues.push("Groups with open formations", "People arriving alone looking for friends");
    }
    return cues;
  };

  const briefingForLocation = (location: string) => briefingData?.find(b => b.location === location);

  // =========================
  // INIT LOCATION PLANS
  // =========================
  useEffect(() => {
    console.log("=== INIT LOCATION PLANS useEffect RUNNING ===");
    console.log("briefingData in useEffect:", briefingData);
    console.log("briefingData length:", briefingData?.length);
    
    if (briefingData && briefingData.length > 0) {
      console.log("✅ briefingData exists and has length > 0, creating plans...");
      
      const plans = briefingData.map((brief, idx) => {
        console.log(`Processing brief ${idx}:`, brief);
        return {
          location: brief.location,
          goalsSet: false,
          targetInteractions: brief.energyLevel <= 2 ? 1 : brief.energyLevel <= 3 ? 2 : 3,
          environmentCues: getEnvironmentCuesForVenue(brief.venueIntel),
          exitStrategy: "",
          difficulty: calculateDifficulty(brief.venueIntel?.friendliness_score || 50, brief.confidenceLevel),
          startTime: new Date(brief.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      
      console.log("Plans created:", plans);
      
      const sorted = [...plans].sort((a, b) => a.difficulty - b.difficulty);
      console.log("Plans sorted:", sorted);
      
      setLocationPlans(sorted);
      setExpandedLocations(sorted.reduce((acc, plan, idx) => ({ ...acc, [plan.location]: idx === 0 }), {}));
      
      console.log("✅ locationPlans state updated");
    } else {
      console.log("❌ briefingData is empty or doesn't exist");
      console.log("briefingData:", briefingData);
    }
  }, [briefingData]);

  // =========================
  // CHECK COMPLETION
  // =========================
  useEffect(() => {
    const complete = locationPlans.length > 0 && 
      locationPlans.every(plan => plan.goalsSet && plan.exitStrategy.trim().length > 0);
    setAllPlansComplete(complete);
  }, [locationPlans]);

  // =========================
  // UPDATE HELPERS
  // =========================
  const toggleLocation = (location: string) => 
    setExpandedLocations(prev => ({ ...prev, [location]: !prev[location] }));
  
  const updateLocationGoal = (location: string, interactions: number) => 
    setLocationPlans(prev => prev.map(plan => 
      plan.location === location ? { ...plan, targetInteractions: interactions, goalsSet: true } : plan
    ));
  
  const updateExitStrategy = (location: string, strategy: string) => 
    setLocationPlans(prev => prev.map(plan => 
      plan.location === location ? { ...plan, exitStrategy: strategy } : plan
    ));

  // =========================
  // RENDER
  // =========================
  console.log("=== RENDER DEBUG ===");
  console.log("loading:", loading);
  console.log("briefingData:", briefingData);
  console.log("briefingData length:", briefingData?.length);
  console.log("locationPlans:", locationPlans);
  console.log("locationPlans length:", locationPlans?.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
        <div className="text-xl text-purple-200">Loading briefing data...</div>
      </div>
    );
  }

  if (!briefingData || briefingData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-xl text-purple-200 mb-4">No briefing data available</p>
          <div className="p-4 bg-purple-900/50 rounded-xl text-left max-w-2xl mx-auto">
            <p className="text-xs text-purple-300 font-mono mb-2">DEBUG:</p>
            <pre className="text-xs text-purple-200 overflow-auto">
              {JSON.stringify({ briefingData, loading }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!locationPlans || locationPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-xl text-purple-200">No locations available</p>
          <p className="text-sm text-purple-400 mt-2">Processing briefing data...</p>
          <div className="mt-6 p-4 bg-purple-900/50 rounded-xl text-left max-w-2xl mx-auto">
            <p className="text-xs text-purple-300 font-mono mb-2">DEBUG INFO:</p>
            <pre className="text-xs text-purple-200 overflow-auto max-h-96">
              {JSON.stringify({
                briefingData: briefingData,
                briefingDataLength: briefingData?.length,
                locationPlans: locationPlans,
                locationPlansLength: locationPlans?.length
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-24">
      <div className="max-w-4xl mx-auto p-6">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Navigation className="w-5 h-5 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">Location Strategy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Your Location Map
          </h1>
          <p className="text-purple-300">
            Plan interactions for each location in order of difficulty (easiest first to build momentum)
          </p>
        </div>

        {/* STRATEGY OVERVIEW */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 mb-8 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-purple-300 font-medium">Locations</p>
              </div>
              <p className="text-3xl font-bold text-white">{locationPlans.length}</p>
            </div>
            <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-400" />
                <p className="text-sm text-purple-300 font-medium">Total Interactions</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {locationPlans.reduce((sum, p) => sum + (p.targetInteractions || 0), 0)}
              </p>
            </div>
            <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <p className="text-sm text-purple-300 font-medium">Completion</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {locationPlans.filter((p) => p.goalsSet && p.exitStrategy).length}/{locationPlans.length}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-2xl border border-purple-400/30">
            <p className="text-sm text-purple-200">
              <strong>Pro tip:</strong> Locations are sorted by difficulty (easiest first). Start with the easiest to build confidence and momentum, then tackle harder ones as your energy increases.
            </p>
          </div>
        </div>

        {/* LOCATION CARDS */}
        <div className="space-y-4 mb-8">
          {locationPlans.map((plan, idx) => {
            const brief = briefingForLocation(plan.location);
            const isComplete = plan.goalsSet && plan.exitStrategy?.trim().length > 0;

            console.log("Rendering plan:", plan, "Briefing:", brief);

            return (
              <div key={plan.location || idx} className="space-y-3">
                {/* LOCATION HEADER */}
                <button
                  onClick={() => toggleLocation(plan.location)}
                  className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl hover:border-purple-400/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getDifficultyColor(plan.difficulty)} flex items-center justify-center text-lg font-bold shadow-lg`}>
                        {idx + 1}
                      </div>
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isComplete ? "bg-green-500 text-white" : "bg-purple-700 text-purple-200"}`}>
                        {isComplete ? <CheckCircle className="w-4 h-4" /> : "○"}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-purple-100 mb-1">{plan.location}</h2>
                      <div className="flex items-center gap-4 text-sm text-purple-300 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {plan.startTime}
                        </div>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(plan.difficulty)} text-xs font-bold text-white`}>
                          {getDifficultyLabel(plan.difficulty)}
                        </div>
                        {brief?.venueIntel && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {brief.venueIntel.friendliness_score || 50}% Friendly
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedLocations[plan.location] ? <ChevronUp className="w-6 h-6 text-purple-400" /> : <ChevronDown className="w-6 h-6 text-purple-400" />}
                </button>



                {/* EXPANDED CONTENT */}
                {expandedLocations[plan.location] && brief && (
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 space-y-6">
                    {/* VENUE INTEL */}
                    {brief.venueIntel && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-purple-100 text-lg flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          Venue Intelligence
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                            <p className="text-xs text-purple-400 mb-1">Typical Crowd</p>
                            <p className="font-semibold text-purple-100">{brief.venueIntel.typical_crowd || "General crowd"}</p>
                          </div>
                          <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                            <p className="text-xs text-purple-400 mb-1">Noise Level</p>
                            <p className="font-semibold text-purple-100">{brief.venueIntel.noise_level || "moderate"}</p>
                          </div>
                          <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 md:col-span-2">
                            <p className="text-xs text-purple-400 mb-1">Best Social Zones</p>
                            <p className="font-semibold text-purple-100">{brief.venueIntel.social_zones || "N/A"}</p>
                          </div>
                          <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30 md:col-span-2">
                            <p className="text-xs text-purple-400 mb-1">Best Time to Approach</p>
                            <p className="font-semibold text-purple-100">{brief.venueIntel.best_approach_time || "Anytime"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* NEXT BUTTON (Flowing Content) */}
        {allPlansComplete && (
          <div className="mt-12 mb-12">
            
          </div>
        )}

                    {/* TOP OPENERS */}
                    {brief?.openers?.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-purple-100 text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-400" />
                          Your Best Openers Here
                        </h3>
                        <div className="space-y-2">
                          {brief.openers.map((opener, idx) => (
                            <div key={idx} className="p-4 bg-purple-950/40 rounded-xl border-l-4 border-purple-500">
                              <p className="font-semibold text-purple-100 mb-1">"{opener.text}"</p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="px-2 py-1 bg-purple-800/50 rounded text-purple-300">{opener.difficulty}</span>
                                <span className="text-purple-400">{opener.success_probability || 70}% success rate</span>
                              </div>
                            </div>
                          ))}
                          <button 
              onClick={onNext} // Calls the function passed via props
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-xl font-bold transition-all duration-300 transform 
                       bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 
                       text-white shadow-lg hover:shadow-green-500/50"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              Mission Briefing Complete - Start Journey
              <DoorOpen className="w-6 h-6" />
            </button>
                        </div>
                      </div>
                    )}

                  

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MAPTODAYSPLAN;