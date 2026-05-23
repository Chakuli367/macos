import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  MapPin,
  Users,
  Heart,
  ChevronRight,
  CheckCircle2,
  Plus,
  X,
  Clock,
  AlertCircle,
  Eye,
  Loader2,
} from "lucide-react";

interface YesterdayLocation {
  location: string;
  timeSpent?: number;
  interactionsHad?: number;
  success?: "great" | "okay" | "difficult";
  notes?: string;
}

interface SelectedLocation {
  location: string;
  isRepeat: boolean;
  reasoning: string;
  order: number;
}

const HARDCODED_UID = "mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2";

const PLANLOCATIONS: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [loading, setLoading] = useState(true);
  const [yesterdayLocations, setYesterdayLocations] = useState<YesterdayLocation[]>([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>([]);
  const [showNewLocationForm, setShowNewLocationForm] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [briefingData, setBriefingData] = useState<BriefingData[] | null>(null);
  const [newLocationReasoning, setNewLocationReasoning] = useState("");

   useEffect(() => {
    const fetchYesterdayLocations = async () => {
      console.log("Starting fetchYesterdayLocations for uid:", HARDCODED_UID);

      try {
        const docRef = doc(db, "users", HARDCODED_UID);
        console.log("Document reference created:", docRef);

        const docSnap = await getDoc(docRef);
        console.log("Document snapshot fetched:", docSnap);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User document data:", data);

          const rawLocations = data?.yesterday_locations || data?.location_history || [];
          console.log("Raw locations:", rawLocations);
          console.log("Type of rawLocations:", typeof rawLocations);
          console.log("Is rawLocations array?:", Array.isArray(rawLocations));

          if (Array.isArray(rawLocations) && rawLocations.length > 0) {
            console.log("✅ rawLocations exists and is array, processing...");
            
            const formattedLocations = rawLocations.map((loc: any) => ({
              location: loc.location || "Unknown Location",
              timeSpent: loc.time_spent || loc.timeSpent || 0,
              interactionsHad: loc.interactions_had || loc.interactionsHad || 0,
              success: loc.success || null,
              notes: loc.notes || "",
              venueIntel: loc.venue_intel ? {
                friendliness_score: loc.venue_intel.friendliness_score || 50,
                typical_crowd: loc.venue_intel.typical_crowd || "General crowd",
                noise_level: loc.venue_intel.noise_level || "moderate",
                social_zones: loc.venue_intel.social_zones || "N/A",
                best_approach_time: loc.venue_intel.best_approach_time || "Anytime",
                type: loc.venue_intel.type || "Venue",
                name: loc.venue_intel.name || loc.location
              } : undefined,
              scenarios: loc.scenarios || [],
              conversation_flows: loc.conversation_flows || [],
              openers: loc.openers || []
            }));
            
            console.log("Formatted locations:", formattedLocations);
            setYesterdayLocations(formattedLocations);
          } else {
            console.warn("❌ No yesterday_locations array found for this user.");
            console.log("Full data object:", JSON.stringify(data, null, 2));
            
            // Mock data for testing
            const mockLocations = [
              {
                location: "A BOOK CLUB",
                timeSpent: 45,
                interactionsHad: 3,
                success: "great",
                notes: "Good conversations, comfortable atmosphere",
                venueIntel: {
                  typical_crowd: "Book enthusiasts, likely readers, and writers",
                  social_zones: "Near the bookshelves, around the refreshments, or during group discussions",
                  best_approach_time: "During breaks between discussions or while people are browsing books",
                  noise_level: "moderate",
                  type: "Literary Event",
                  friendliness_score: 80,
                  name: "Book Club"
                },
                scenarios: [
                  {
                    likelihood: 55,
                    approach: "Keep it brief and friendly, respect their time",
                    scenario: "They look interested but seem busy",
                    green_signals: ["making eye contact", "smiling", "nodding along"],
                    red_signals: ["checking phone constantly", "headphones in", "rushed body language"]
                  },
                  {
                    likelihood: 45,
                    approach: "Ask genuine questions about them, find common ground",
                    scenario: "They respond but seem hesitant",
                    green_signals: ["answering your questions", "asking you questions back", "relaxing posture"],
                    red_signals: ["one-word answers", "looking away", "stepping back"]
                  }
                ],
                conversation_flows: [
                  {
                    opener: "What brings you to this book club?",
                    likely_responses: [
                      {
                        response: "I'm a fan of [author/genre].",
                        probability: 40,
                        your_followup: "That's great! Have you read any of their other works?"
                      },
                      {
                        response: "I'm just looking for something new to read.",
                        probability: 30,
                        your_followup: "Well, there are some great books on the shelves here. Have you found anything that catches your eye?"
                      },
                      {
                        response: "I'm not sure, I was just invited by a friend.",
                        probability: 30,
                        your_followup: "No worries! It's always great to meet new people. What do you think of the discussion so far?"
                      }
                    ]
                  }
                ],
                openers: [
                  {
                    difficulty: "easy",
                    success_probability: 70,
                    text: "What brings you to this book club?",
                    ai_reasoning: "This is a gentle and relevant question that shows interest in the other person"
                  },
                  {
                    difficulty: "medium",
                    success_probability: 60,
                    text: "I noticed you're reading [book title]. What do you think of it so far?",
                    ai_reasoning: "This shows you've taken an interest in their reading material and invites a discussion"
                  },
                  {
                    difficulty: "hard",
                    success_probability: 50,
                    text: "If you could recommend one book to everyone here, what would it be and why?",
                    ai_reasoning: "This is a bold question that can lead to a deeper conversation, but may require some thought"
                  }
                ]
              },
              {
                location: "The Local Cooking Studio",
                timeSpent: 60,
                interactionsHad: 4,
                success: "great",
                notes: "Met 2 people in the class, exchanged numbers with one",
                venueIntel: {
                  typical_crowd: "Food enthusiasts, cooking learners",
                  social_zones: "Around the cooking stations, during breaks",
                  best_approach_time: "Before class starts or during breaks",
                  noise_level: "moderate",
                  type: "Cooking Class",
                  friendliness_score: 85,
                  name: "Cooking Studio"
                },
                scenarios: [],
                conversation_flows: [],
                openers: []
              },
              {
                location: "Community Gym - Group Fitness",
                timeSpent: 50,
                interactionsHad: 2,
                success: "okay",
                notes: "Talked to one person before class, felt rushed",
                venueIntel: {
                  typical_crowd: "Fitness enthusiasts, gym members",
                  social_zones: "Near equipment, before/after class",
                  best_approach_time: "After class when people are cooling down",
                  noise_level: "loud",
                  type: "Gym",
                  friendliness_score: 70,
                  name: "Community Gym"
                },
                scenarios: [],
                conversation_flows: [],
                openers: []
              }
            ];
            
            console.log("Using mock locations for testing");
            setYesterdayLocations(mockLocations);
          }
        } else {
          console.warn("User document does not exist.");
          setYesterdayLocations([]);
        }
      } catch (err) {
        console.error("Error fetching yesterday locations:", err);
        setYesterdayLocations([]);
      } finally {
        console.log("Finished fetchYesterdayLocations, setting loading to false");
        setLoading(false);
      }
    };

    fetchYesterdayLocations();
  }, []);
    

  const acceptLocation = () => {
    const currentLoc = yesterdayLocations[currentLocationIndex];
    const newSelected = {
      location: currentLoc.location,
      isRepeat: true,
      reasoning: `Repeating from yesterday: ${currentLoc.interactionsHad} interactions, ${currentLoc.success === "great" ? "went great!" : "room to improve"}`,
      order: selectedLocations.length + 1,
    };

    setSelectedLocations([...selectedLocations, newSelected]);

    if (currentLocationIndex < yesterdayLocations.length - 1) {
      setCurrentLocationIndex(currentLocationIndex + 1);
    } else {
      setShowNewLocationForm(true);
    }
  };

  const rejectLocation = () => {
    setShowNewLocationForm(true);
  };

  const addNewLocation = () => {
    if (!newLocationName.trim() || !newLocationReasoning.trim()) return;

    setSelectedLocations([
      ...selectedLocations,
      {
        location: newLocationName,
        isRepeat: false,
        reasoning: newLocationReasoning,
        order: selectedLocations.length + 1,
      }
    ]);

    setNewLocationName("");
    setNewLocationReasoning("");
    setShowNewLocationForm(false);

    if (currentLocationIndex < yesterdayLocations.length - 1) {
      setCurrentLocationIndex(currentLocationIndex + 1);
    }
  };

  const removeSelected = (index: number) => {
    setSelectedLocations(selectedLocations.filter((_, i) => i !== index).map((loc, idx) => ({
      ...loc,
      order: idx + 1,
    })));
  };

  const isComplete = selectedLocations.length === 3;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  // PHASE 1: REVIEW YESTERDAY LOCATIONS
  if (yesterdayLocations.length > 0 && selectedLocations.length < 3 && currentLocationIndex < yesterdayLocations.length && !showNewLocationForm) {
    const currentLoc = yesterdayLocations[currentLocationIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-24">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 h-screen flex flex-col justify-between">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Eye className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
              <span className="text-xs md:text-sm font-medium text-purple-200">Step 4 of 5</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Review Yesterday
            </h1>

            <p className="text-purple-300 text-sm md:text-base">
              Location {currentLocationIndex + 1} of {yesterdayLocations.length}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="w-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-purple-500/30 shadow-2xl">
              <div className="text-center space-y-6">
                <MapPin className="w-16 h-16 md:w-20 md:h-20 text-purple-400 mx-auto" />
                
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{currentLoc.location}</h2>
                  <p className="text-purple-300 text-sm md:text-base">Should you return here tomorrow?</p>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-purple-500/30">
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-blue-400">{currentLoc.interactionsHad}</p>
                    <p className="text-xs md:text-sm text-purple-300">Interactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-green-400">{currentLoc.timeSpent}m</p>
                    <p className="text-xs md:text-sm text-purple-300">Time Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl">
                      {currentLoc.success === "great" ? "✅" : currentLoc.success === "okay" ? "⚠️" : "❌"}
                    </p>
                    <p className="text-xs md:text-sm text-purple-300">{currentLoc.success || "Not rated"}</p>
                  </div>
                </div>

                {currentLoc.notes && (
                  <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-700/30">
                    <p className="text-sm text-purple-200 italic">"{currentLoc.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={acceptLocation}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              <CheckCircle2 className="w-6 h-6" />
              Use This Tomorrow
            </button>

            <button
              onClick={rejectLocation}
              className="w-full px-6 py-4 bg-purple-800/50 hover:bg-purple-700/50 border-2 border-purple-500/30 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
              <X className="w-6 h-6" />
              Choose Different
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 2: ADD NEW LOCATION
  if (showNewLocationForm && selectedLocations.length < 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-24">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Add a New Location
            </h1>
            <p className="text-purple-300 text-sm md:text-base">
              {selectedLocations.length}/3 locations selected
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl space-y-5 mb-8">
            <div>
              <label className="block text-sm font-bold text-purple-200 mb-2">Location Name</label>
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Coffee shop, park, gym..."
                className="w-full px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-200 mb-2">Why this location?</label>
              <textarea
                value={newLocationReasoning}
                onChange={(e) => setNewLocationReasoning(e.target.value)}
                placeholder="Ease of interaction? Good for meeting people? Interested in the activity?"
                className="w-full px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={addNewLocation}
              disabled={!newLocationName.trim() || !newLocationReasoning.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              <Plus className="w-6 h-6" />
              Add Location
            </button>
          </div>

          {selectedLocations.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-3xl border-2 border-purple-500/20">
              <h3 className="font-bold text-purple-100 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Selected So Far ({selectedLocations.length}/3)
              </h3>

              <div className="space-y-3">
                {selectedLocations.map((loc, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-purple-950/40 rounded-xl border border-purple-700/30">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-lg mb-1">{idx + 1}. {loc.location}</p>
                      <p className="text-xs md:text-sm text-purple-300">{loc.reasoning}</p>
                    </div>
                    <button
                      onClick={() => removeSelected(idx)}
                      className="p-2 hover:bg-red-900/50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PHASE 3: REVIEW & COMPLETE
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white pb-24">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Your Plan for Tomorrow
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            {selectedLocations.map((loc, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-5 md:p-6 rounded-3xl border-2 border-purple-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                    {loc.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{loc.location}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {loc.isRepeat && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-200 text-xs rounded-full border border-green-500/50">
                          Repeated from Yesterday
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-200">{loc.reasoning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onNext}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all"
          >
            <ChevronRight className="w-6 h-6" />
            Complete Step 4
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex items-center justify-center">
      <AlertCircle className="w-12 h-12 text-red-400 mr-4" />
      <p className="text-lg text-red-200">No location history found</p>
    </div>
  );
};

export default PLANLOCATIONS;