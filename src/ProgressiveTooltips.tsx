import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TOOLTIPS = [
  {
    trigger: 'afterReading3Posts',
    title: "Ready to share?",
    message: "You've been here a few minutes. People want to hear from you.",
    action: "Share Something",
    position: "bottom-right"
  },
  {
    trigger: 'after1stPost',
    title: "🎉 Live Chat Unlocked!",
    message: "23 people chatting right now. Join anytime.",
    feature: "liveChat"
  },
  {
    trigger: 'after3Reactions',
    title: "Safe People Unlocked!",
    message: "Save people whose support feels right.",
    feature: "safePeople"
  }
];

const ProgressiveTooltips = ({ unlockedFeatures, onFeatureUnlocked }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Logic to show tooltips based on user actions
  // This would connect to your app state

  if (!activeTooltip) return null;

  return (
    <div className="fixed bottom-24 right-8 max-w-sm bg-gradient-to-br from-purple-900 to-indigo-900
                   rounded-2xl border-2 border-purple-500/50 p-6 shadow-2xl z-50 animate-slide-up">
      <button
        onClick={() => setActiveTooltip(null)}
        className="absolute top-2 right-2 text-purple-300 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold text-white mb-2">{activeTooltip.title}</h3>
      <p className="text-purple-200 text-sm mb-4">{activeTooltip.message}</p>

      {activeTooltip.action && (
        <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold">
          {activeTooltip.action}
        </button>
      )}
    </div>
  );
};

export default ProgressiveTooltips;