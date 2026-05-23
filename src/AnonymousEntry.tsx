import React, { useState } from 'react';

const AVATARS = ['🌙', '🌊', '🌱', '⭐', '🔥', '❄️', '🌸', '🦋', '🎭', '💫'];

const ANONYMITY_OPTIONS = [
  {
    id: 'full-anonymous',
    icon: '👤',
    title: 'Fully Anonymous',
    description: 'No one can see who you are'
  },
  {
    id: 'first-name-only',
    icon: '👋',
    title: 'First Name Only',
    description: 'Show first name but stay private'
  }
];

const AnonymousEntry = ({ onComplete }) => {
  const [selectedAnonymity, setSelectedAnonymity] = useState('full-anonymous');
  const [selectedAvatar, setSelectedAvatar] = useState('🌙');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            How do you want to show up?
          </h1>
          <p className="text-purple-300">
            You can change this anytime
          </p>
        </div>

        {/* Anonymity Level */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4">Choose your privacy:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANONYMITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnonymity(option.id)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedAnonymity === option.id
                    ? 'bg-purple-600/30 border-purple-400 scale-105'
                    : 'bg-purple-900/30 border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <p className="text-white font-bold mb-1">{option.title}</p>
                <p className="text-purple-300 text-sm">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4">Pick an avatar:</label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {AVATARS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center
                         transition-all transform ${
                  selectedAvatar === avatar
                    ? 'bg-purple-600 scale-110 ring-4 ring-purple-400'
                    : 'bg-purple-900/50 hover:bg-purple-800/50 hover:scale-105'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => onComplete(selectedAnonymity, selectedAvatar)}
          className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl
                   transition-all transform hover:scale-105"
        >
          Enter the Space
        </button>

        <p className="text-center text-purple-400 text-sm mt-6">
          🔒 No signup required yet. We'll ask later if you want to save your progress.
        </p>

      </div>
    </div>
  );
};

export default AnonymousEntry;