import React, { useEffect, useState } from "react";
import { AlertCircle, Phone, MessageSquare, Users } from "lucide-react";

const CrisisIntervention = ({ onPeerSupportRequested, onResourceUsed }) => {
  const [breathingAnimation, setBreathingAnimation] = useState(false);

  useEffect(() => {
    setBreathingAnimation(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Calming Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 ${
          breathingAnimation ? "animate-pulse" : ""
        }`}
        style={{ animationDuration: "4s" }}
      />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-3">
            You're in crisis. Let's get you help.
          </h1>
          <p className="text-red-200 text-lg">
            Take a slow breath. You're not alone.
          </p>
        </div>

        {/* Resources */}
        <div className="space-y-4 mb-8">

          {/* 988 Call */}
          <a
            href="tel:988"
            onClick={onResourceUsed}
            className="block p-6 bg-red-600 hover:bg-red-500 rounded-2xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <Phone className="w-8 h-8" />
              <div>
                <p className="font-bold text-xl mb-1">Call 988 Now</p>
                <p className="text-red-100 text-sm">
                  24/7 Suicide & Crisis Lifeline
                </p>
              </div>
            </div>
          </a>

          {/* Crisis Text */}
          <a
            href="sms:741741&body=HOME"
            onClick={onResourceUsed}
            className="block p-6 bg-orange-600 hover:bg-orange-500 rounded-2xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <MessageSquare className="w-8 h-8" />
              <div>
                <p className="font-bold text-xl mb-1">Text HOME to 741741</p>
                <p className="text-orange-100 text-sm">Crisis Text Line</p>
              </div>
            </div>
          </a>

          {/* Peer Support */}
          <button
            onClick={onPeerSupportRequested}
            className="w-full p-6 bg-purple-600 hover:bg-purple-500 rounded-2xl transition-all transform hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8" />
              <div>
                <p className="font-bold text-xl mb-1">
                  I need peer support RIGHT NOW
                </p>
                <p className="text-purple-100 text-sm">
                  Alert available peers who can talk
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Breathing Guide */}
        <div className="p-6 bg-indigo-900/50 rounded-2xl border-2 border-indigo-500/30">
          <p className="text-indigo-200 text-center mb-4">
            While you decide, try this:
          </p>
          <div className="text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-full bg-indigo-500 ${
                breathingAnimation ? "animate-ping" : ""
              }`}
              style={{ animationDuration: "4s" }}
            />
            <p className="text-white mt-4">Breathe with the circle</p>
            <p className="text-indigo-300 text-sm">
              In for 4, hold for 4, out for 4
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CrisisIntervention;
