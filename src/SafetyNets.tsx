import React, { useEffect, useState } from 'react';
import { AlertCircle, Phone } from 'lucide-react';

const SafetyNets = ({ emotionalScore, dailyCheckIns, lastActivityTime }) => {
  const [showDeclineAlert, setShowDeclineAlert] = useState(false);
  const [showInactivityCheck, setShowInactivityCheck] = useState(false);

  // Check for declining pattern
  useEffect(() => {
    const recentScores = dailyCheckIns.slice(0, 3).map(c => c.score);
    const allLow = recentScores.every(s => s <= 3);
    
    if (allLow && recentScores.length >= 3) {
      setShowDeclineAlert(true);
    }
  }, [dailyCheckIns]);

  // Check for inactivity during crisis
  useEffect(() => {
    if (emotionalScore <= 3) {
      const checkInactivity = setTimeout(() => {
        const timeSinceActivity = Date.now() - lastActivityTime;
        if (timeSinceActivity > 10 * 60 * 1000) { // 10 minutes
          setShowInactivityCheck(true);
        }
      }, 10 * 60 * 1000);

      return () => clearTimeout(checkInactivity);
    }
  }, [emotionalScore, lastActivityTime]);

  if (showDeclineAlert) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-gradient-to-br from-red-900 to-orange-900
                     rounded-2xl border-2 border-red-500/50 p-6 shadow-2xl z-50">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">
          We've noticed you're struggling
        </h3>
        <p className="text-red-200 text-sm mb-4">
          Your check-ins have been low for 3 days. Want to connect with a professional?
        </p>
        <div className="space-y-2">
          <a href="tel:988" className="block w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-center font-semibold">
            Call 988 Now
          </a>
          <button 
            onClick={() => setShowDeclineAlert(false)}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
          >
            I'm Managing
          </button>
        </div>
      </div>
    );
  }

  if (showInactivityCheck) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl border-2 border-red-500/50 p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Are you okay?
          </h2>
          <p className="text-red-200 text-center mb-6">
            You went silent during a crisis moment. Tap if you need more help.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => setShowInactivityCheck(false)}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg"
            >
              I'm Okay Now
            </button>
            <a href="tel:988" className="block w-full px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-center text-lg">
              I Need Help
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SafetyNets;