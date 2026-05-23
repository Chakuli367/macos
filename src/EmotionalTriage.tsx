import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const EmotionalTriage = ({ onScoreSelected }) => {
  const [score, setScore] = useState(5);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            You don't have to explain
          </h1>
          <p className="text-2xl text-purple-300">
            We get it.
          </p>
        </div>

        {/* Slider */}
        <div className="mb-12">
          <label className="block text-center text-xl text-white mb-8">
            How are you feeling right now?
          </label>
          
          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full h-4 bg-purple-900/50 rounded-lg appearance-none cursor-pointer
                     slider-thumb:w-8 slider-thumb:h-8 slider-thumb:bg-purple-500 slider-thumb:rounded-full"
          />

          <div className="flex justify-between mt-4 text-sm">
            <span className="text-red-400 font-semibold">Crisis</span>
            <span className="text-yellow-400">Struggling</span>
            <span className="text-green-400 font-semibold">Okay</span>
          </div>

          {/* Score Display */}
          <div className="text-center mt-8">
            <div className={`inline-block px-8 py-4 rounded-2xl text-6xl font-bold
              ${score <= 3 ? 'bg-red-900/30 text-red-300' : 
                score <= 6 ? 'bg-yellow-900/30 text-yellow-300' : 
                'bg-green-900/30 text-green-300'}`}>
              {score}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => onScoreSelected(score)}
          className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl
                   transition-all transform hover:scale-105"
        >
          Continue
        </button>

        {/* Anonymous Note */}
        <p className="text-center text-purple-400 text-sm mt-6">
          🔒 No signup required. Stay anonymous if you want.
        </p>
      </div>
    </div>
  );
};

export default EmotionalTriage;