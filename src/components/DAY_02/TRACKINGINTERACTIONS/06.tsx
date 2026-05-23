import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ChevronLeft, ChevronRight, Clock, Star, MessageCircle, CheckCircle, AlertCircle, Sparkles, MapPin, User, Zap, Heart } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Coffee } from "lucide-react";


interface PageProps {
  onCompleteNavigator: () => void;
  locationData?: Array<{ location: string }>;
  uid: string;
}

interface NavigatorProps {
  onNext?: () => void; // parent callback to open next subpage
}

interface InteractionData {
  personName: string;
  location: string;
  durationMinutes: number;
  comfortLevel: number;
  engagementLevel: number;
  naturalness: number;
  theirInterest: number;
  openerUsed: string;
  whatWentWell: string;
  whatWasHardest: string;
  wouldApproachAgain: boolean;
  followUpNotes: string;
}

const REFLECTION_QUESTIONS = [
  {
    id: "whatWentWell",
    label: "What went well?",
    placeholder: "What made this interaction successful? (e.g., they laughed, good flow, natural topic)",
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: "whatWasHardest",
    label: "What was hardest?",
    placeholder: "What felt awkward or difficult? (e.g., initial nervousness, ran out of things to say)",
    icon: <AlertCircle className="w-5 h-5" />
  },
  {
    id: "followUpNotes",
    label: "Follow-up ideas",
    placeholder: "Any potential next steps? (e.g., exchange contact, meet again, specific conversation topic)",
    icon: <MessageCircle className="w-5 h-5" />
  }
];


interface ComeBackLaterProps {
  onProceed: () => void;
}


function ComeBackLater({ onProceed }: { onProceed: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-800/40 backdrop-blur-sm rounded-full border-2 border-purple-500/30 mb-6">
            <Clock className="w-10 h-10 text-purple-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Ready to Connect?
          </h1>
          <p className="text-xl text-purple-300">
            First, go out and have a conversation!
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl space-y-6 mb-8">
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Go to Your Location</h3>
                <p className="text-purple-300 text-sm">
                  Head to a coffee shop, park, or anywhere you planned to meet people
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Start a Conversation</h3>
                <p className="text-purple-300 text-sm">
                  Use one of your prepared openers and talk to someone new
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Come Back Here</h3>
                <p className="text-purple-300 text-sm">
                  Return to this form to track your interaction and reflect on how it went
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-2xl border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="font-bold text-white text-lg">Pro Tip</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Keep this page open or bookmarked! The form will be here waiting for you after your conversation. 
              The fresher the memory, the better your reflection will be.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onProceed}
            className="w-full px-6 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            I Already Had a Conversation - Let's Log It!
            <ArrowRight className="w-6 h-6" />
          </button>

          <p className="text-center text-purple-400 text-sm">
            Click above only after you've had an interaction to track
          </p>
        </div>

        <div className="mt-8 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30 text-center">
          <Coffee className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-purple-300 text-sm">
            Remember: Every conversation is practice. Don't overthink it - just go say hi! 👋
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrackingInteractions({onNext, onCompleteNavigator,  locationData = [], uid }: PageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showComeBackScreen, setShowComeBackScreen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<InteractionData>({
    personName: "",
    location: locationData[0]?.location || "",
    durationMinutes: 5,
    comfortLevel: 3,
    engagementLevel: 3,
    naturalness: 3,
    theirInterest: 3,
    openerUsed: "",
    whatWentWell: "",
    whatWasHardest: "",
    wouldApproachAgain: true,
    followUpNotes: ""
  });

  const [completed, setCompleted] = useState(false);

  const updateField = (key: keyof InteractionData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const isPageValid = () => {
    if (currentPage === 1) {
      return data.personName.trim().length > 0 && data.location.trim().length > 0 && data.durationMinutes > 0;
    }
    if (currentPage === 2) {
      return true;
    }
    if (currentPage === 3) {
      return data.whatWentWell.trim().length > 0 && data.whatWasHardest.trim().length > 0;
    }
    return false;
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  
const handleJustSave = async () => {
  setSaving(true);
  const uid = "mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2";
  try {
    console.log("💾 Just saving interaction (no navigation)...");
    console.log("UID:", uid);
    console.log("Data to save:", data);
    
    if (!uid) {
      throw new Error("User ID is missing");
    }
    
    // Save to Firestore
    const interactionRef = await addDoc(collection(db, "users", uid, "interactions"), {
      personName: data.personName,
      location: data.location,
      durationMinutes: data.durationMinutes,
      comfortLevel: data.comfortLevel,
      engagementLevel: data.engagementLevel,
      naturalness: data.naturalness,
      theirInterest: data.theirInterest,
      openerUsed: data.openerUsed,
      whatWentWell: data.whatWentWell,
      whatWasHardest: data.whatWasHardest,
      wouldApproachAgain: data.wouldApproachAgain,
      followUpNotes: data.followUpNotes,
      avgQuality: Math.round((data.comfortLevel + data.engagementLevel + data.naturalness + data.theirInterest) / 4),
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    
    console.log("✅ Saved to Firestore with ID:", interactionRef.id);
    alert("✅ Interaction saved! You can continue or exit.");
    
  } catch (error: any) {
    console.error("❌ Error saving interaction:", error);
    alert(`Failed to save interaction: ${error.message || 'Unknown error'}`);
  } finally {
    setSaving(false);
  }
};

 
  const handle12Submit = async (shouldFinish: boolean = false) => {
    setSaving(true);
    const uid  = "mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2";
    try {
      console.log("🔄 Starting save process...");
      console.log("UID:", uid);
      console.log("Data to save:", data);
      console.log("Should finish after save:", shouldFinish);
      
      if (!uid) {
        throw new Error("User ID is missing");
      }
      
      // Simulate Firebase save (replace with actual Firebase code)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ Interaction saved successfully!");
      alert("✅ Interaction saved successfully!");
      
      // Reset form
      setCompleted(false);
      setCurrentPage(1);
      setData({
        personName: "",
        location: locationData[0]?.location || "",
        durationMinutes: 5,
        comfortLevel: 3,
        engagementLevel: 3,
        naturalness: 3,
        theirInterest: 3,
        openerUsed: "",
        whatWentWell: "",
        whatWasHardest: "",
        wouldApproachAgain: true,
        followUpNotes: ""
      });
      
      // Only call onComplete if user clicked "Save & Finish"
      if (shouldFinish) {
        console.log("🚀 Calling onComplete() to finish...");
        onCompleteNavigator();
      } else {
        console.log("♻️ Staying in form to log another interaction");
      }
    } catch (error: any) {
      console.error("❌ Error saving interaction:", error);
      alert(`Failed to save interaction: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const getMetricColor = (value: number) => {
    if (value <= 2) return "from-red-500 to-orange-600";
    if (value === 3) return "from-yellow-500 to-orange-600";
    return "from-green-500 to-emerald-600";
  };

  const getMetricLabel = (value: number) => {
    if (value === 1) return "Very Low";
    if (value === 2) return "Low";
    if (value === 3) return "Neutral";
    if (value === 4) return "High";
    return "Very High";
  };

  if (showComeBackScreen) {
  return <ComeBackLater onProceed={() => setShowComeBackScreen(false)} />;
}

  // PAGE 1: BASIC INFO
  if (currentPage === 1 && !completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <User className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Page 1 of 3</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Who Did You Meet?
            </h1>
            <p className="text-purple-300">Tell us about the interaction you just had</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl space-y-6">
            
            <div>
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <User className="w-5 h-5 text-purple-400" />
                Person's Name or Pseudonym
              </label>
              <input
                type="text"
                value={data.personName}
                onChange={(e) => updateField("personName", e.target.value)}
                placeholder="e.g., Sarah, Red jacket guy, Barista John"
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-lg"
              />
              <p className="text-xs text-purple-400 mt-2">Use first name, nickname, or description if you don't know their name</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                Location
              </label>
              <select
                value={data.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-lg"
              >
                <option value="">Select location...</option>
                {locationData.map(loc => (
                  <option key={loc.location} value={loc.location}>{loc.location}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <Clock className="w-5 h-5 text-purple-400" />
                How Long Did You Talk? (minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={data.durationMinutes}
                  onChange={(e) => updateField("durationMinutes", parseInt(e.target.value))}
                  className="flex-1 h-3 bg-purple-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                />
                <div className="w-16 px-4 py-2 bg-purple-950/50 rounded-xl border border-purple-700/30 text-center">
                  <p className="text-2xl font-bold text-white">{data.durationMinutes}</p>
                  <p className="text-xs text-purple-400">min</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-purple-500/20">
              <button
                disabled
                className="flex-1 px-6 py-4 bg-purple-800/40 rounded-2xl font-bold text-lg transition-all opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!isPageValid()}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAGE 2: QUALITY METRICS
  if (currentPage === 2 && !completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 pb-24">
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Page 2 of 3</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              How Did It Feel?
            </h1>
            <p className="text-purple-300">Rate different aspects of the interaction</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-purple-200 font-semibold">
                  <Heart className="w-5 h-5 text-red-400" />
                  Your Comfort Level
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getMetricColor(data.comfortLevel)} text-white`}>
                  {getMetricLabel(data.comfortLevel)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => updateField("comfortLevel", num)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
                      data.comfortLevel === num
                        ? `bg-gradient-to-r ${getMetricColor(num)} border-transparent text-white`
                        : 'bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-purple-400">1 = Very anxious, 5 = Completely relaxed</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-purple-200 font-semibold">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  How Engaged Were They?
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getMetricColor(data.engagementLevel)} text-white`}>
                  {getMetricLabel(data.engagementLevel)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => updateField("engagementLevel", num)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
                      data.engagementLevel === num
                        ? `bg-gradient-to-r ${getMetricColor(num)} border-transparent text-white`
                        : 'bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-purple-400">1 = Disengaged/dismissive, 5 = Fully engaged/eager to talk</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-purple-200 font-semibold">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  How Natural Did It Feel?
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getMetricColor(data.naturalness)} text-white`}>
                  {getMetricLabel(data.naturalness)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => updateField("naturalness", num)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
                      data.naturalness === num
                        ? `bg-gradient-to-r ${getMetricColor(num)} border-transparent text-white`
                        : 'bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-purple-400">1 = Forced/awkward, 5 = Smooth/authentic flow</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-purple-200 font-semibold">
                  <Star className="w-5 h-5 text-purple-400" />
                  How Interested Did They Seem?
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getMetricColor(data.theirInterest)} text-white`}>
                  {getMetricLabel(data.theirInterest)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => updateField("theirInterest", num)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
                      data.theirInterest === num
                        ? `bg-gradient-to-r ${getMetricColor(num)} border-transparent text-white`
                        : 'bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-purple-400">1 = Seemed uninterested, 5 = Seemed very interested</p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-purple-500/20">
              <button
                onClick={handlePrev}
                className="flex-1 px-6 py-4 bg-purple-800/40 hover:bg-purple-700/40 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAGE 3: REFLECTION QUESTIONS
  if (currentPage === 3 && !completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 pb-24">
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
              <MessageCircle className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Page 3 of 3</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              What Did You Learn?
            </h1>
            <p className="text-purple-300">Reflect on what happened</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl space-y-6">
            
            <div>
              <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Which Opener Did You Use?
              </label>
              <textarea
                value={data.openerUsed}
                onChange={(e) => updateField("openerUsed", e.target.value)}
                placeholder="Type or paste the exact opener you used..."
                className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                rows={2}
              />
            </div>

            {REFLECTION_QUESTIONS.map((question) => (
              <div key={question.id}>
                <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                  {question.icon}
                  {question.label}
                </label>
                <textarea
                  value={data[question.id as keyof InteractionData] as string}
                  onChange={(e) => updateField(question.id as keyof InteractionData, e.target.value)}
                  placeholder={question.placeholder}
                  className="w-full px-5 py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                  rows={3}
                />
              </div>
            ))}

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-purple-200 font-semibold">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Would You Approach Them Again?
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateField("wouldApproachAgain", true)}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                    data.wouldApproachAgain
                      ? 'bg-green-500/20 border-green-400/50 text-green-100'
                      : 'bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateField("wouldApproachAgain", false)}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                    !data.wouldApproachAgain
                      ? 'bg-red-500/20 border-red-400/50 text-red-100'
                      : 'bg-purple-950/40 border-purple-700/30 text-purple-300 hover:border-purple-600/50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-purple-500/20">
  <button
    onClick={handlePrev}
    className="flex-1 px-6 py-4 bg-purple-800/40 hover:bg-purple-700/40 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
  >
    <ChevronLeft className="w-5 h-5" />
    Previous
  </button>
  <button
    onClick={() => {
      console.log("🔘 Complete button clicked on Page 3");
      handleNext();
    }}
    disabled={!isPageValid()}
    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
  >
    Complete
    <CheckCircle className="w-5 h-5" />
  </button>
</div>

{/* Additional Save Options */}
<div className="space-y-3 pt-6 border-t border-purple-500/20">
  <p className="text-purple-300 text-sm text-center mb-2">Or save without completing the review:</p>
  
  <button
    onClick={() => {
      console.log("🔘 Just Save button clicked");
      handleJustSave();
    }}
    disabled={saving || !isPageValid()}
    className="w-full px-6 py-4 bg-blue-800/40 hover:bg-blue-700/40 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
  >
    {saving ? (
      <>
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Star className="w-5 h-5" />
        Just Save & Stay Here
      </>
    )}
  </button>

  <button
    onClick={() => {
      console.log("🔘 Save & Finish button clicked from Page 3");
      handle12Submit(true);
    }}
    disabled={saving || !isPageValid()}
    className="w-full px-6 py-4 bg-purple-800/40 hover:bg-purple-700/40 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {saving ? (
      <>
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <CheckCircle className="w-5 h-5" />
        Save & Exit
      </>
    )}
  </button>
</div>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETION SCREEN
  if (completed) {
    const avgQuality = Math.round((data.comfortLevel + data.engagementLevel + data.naturalness + data.theirInterest) / 4);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-800/40 backdrop-blur-sm rounded-full border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-sm font-medium text-green-200">Interaction Logged</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 bg-clip-text text-transparent">
              Great Job!
            </h1>
            <p className="text-purple-300">Your interaction has been recorded and analyzed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-purple-500/30 shadow-2xl space-y-6 mb-8">
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                <p className="text-purple-400 text-sm mb-1">Person</p>
                <p className="text-xl font-bold text-white">{data.personName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <p className="text-purple-400 text-sm mb-1">Duration</p>
                  <p className="text-xl font-bold text-white">{data.durationMinutes} min</p>
                </div>
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-700/30">
                  <p className="text-purple-400 text-sm mb-1">Overall Quality</p>
                  <p className="text-xl font-bold text-white">{avgQuality}/5</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-purple-500/20">
              <p className="text-purple-200 font-semibold mb-3">Breakdown:</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Your Comfort</span>
                  <span className="font-bold text-white">{data.comfortLevel}/5</span>
                </div>
                <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getMetricColor(data.comfortLevel)}`} style={{ width: `${(data.comfortLevel / 5) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Their Engagement</span>
                  <span className="font-bold text-white">{data.engagementLevel}/5</span>
                </div>
                <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getMetricColor(data.engagementLevel)}`} style={{ width: `${(data.engagementLevel / 5) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Naturalness</span>
                  <span className="font-bold text-white">{data.naturalness}/5</span>
                </div>
                <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getMetricColor(data.naturalness)}`} style={{ width: `${(data.naturalness / 5) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Their Interest</span>
                  <span className="font-bold text-white">{data.theirInterest}/5</span>
                </div>
                <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getMetricColor(data.theirInterest)}`} style={{ width: `${(data.theirInterest / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            {(data.whatWentWell || data.whatWasHardest) && (
              <div className="space-y-4 pt-6 border-t border-purple-500/20">
                <p className="text-purple-200 font-semibold">Key Learnings:</p>
                
                {data.whatWentWell && (
                  <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <p className="text-green-400 font-semibold text-sm mb-2">What Went Well</p>
                    <p className="text-green-100 text-sm">{data.whatWentWell}</p>
                  </div>
                )}

                {data.whatWasHardest && (
                  <div className="p-4 bg-orange-900/20 rounded-xl border border-orange-500/30">
                    <p className="text-orange-400 font-semibold text-sm mb-2">What Was Hardest</p>
                    <p className="text-orange-100 text-sm">{data.whatWasHardest}</p>
                  </div>
                )}

                {data.followUpNotes && (
                  <div className="p-4 bg-purple-800/20 rounded-xl border border-purple-500/30">
                    <p className="text-purple-300 font-semibold text-sm mb-2">Follow-up Ideas</p>
                    <p className="text-purple-100 text-sm">{data.followUpNotes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-6 border-t border-purple-500/20">
              <div className={`p-4 rounded-xl border-2 ${
                data.wouldApproachAgain
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-red-900/20 border-red-500/30'
              }`}>
                <p className={`font-semibold text-sm mb-1 ${data.wouldApproachAgain ? 'text-green-400' : 'text-red-400'}`}>
                  Approach Them Again?
                </p>
                <p className={`text-sm ${data.wouldApproachAgain ? 'text-green-100' : 'text-red-100'}`}>
                  {data.wouldApproachAgain ? 'Yes - this connection is worth pursuing' : 'No - probably won\'t approach them again'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
  <button
    onClick={() => {
      console.log("🔘 Save & Log Another button clicked");
      handle12Submit(false);
    }}
    disabled={saving}
    className="w-full px-6 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {saving ? (
      <>
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <CheckCircle className="w-6 h-6" />
        Save & Log Another
      </>
    )}
  </button>
  
  <button
    onClick={() => {
      console.log("🔘 Save & Finish button clicked");
      handle12Submit(true);
    }}
    disabled={saving}
    className="w-full px-6 py-4 bg-purple-800/40 hover:bg-purple-700/40 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Save & Finish
  </button>

  <button
    onClick={() => {
      console.log("🔘 Just Save button clicked");
      handleJustSave();
    }}
    disabled={saving}
    className="w-full px-6 py-4 bg-blue-800/40 hover:bg-blue-700/40 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
  >
    {saving ? (
      <>
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Star className="w-5 h-5" />
        Just Save (Stay Here)
      </>
    )}
  </button>
</div>
        </div>
      </div>
    );
  }



}