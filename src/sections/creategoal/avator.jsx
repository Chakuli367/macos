import { useState } from 'react';
import { X, Check } from 'lucide-react';

// Manual SVG imports
import Avatar01 from 'src/AVATORS/01.svg';
import Avatar02 from 'src/AVATORS/02.svg';
import Avatar03 from 'src/AVATORS/03.svg';

export default function AvatarChooser({ onComplete }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [showModal, setShowModal] = useState(true);

  const avatars = [
    { 
      id: 1, 
      name: 'The Quiet Observer', 
      src: Avatar01,
      description: 'For people who overthink every interaction and feel anxious in groups. Prefers one-on-one and needs time to open up.',
      traits: 'Thoughtful • Anxious • Needs reassurance'
    },
    { 
      id: 2, 
      name: 'The Invisible One', 
      src: Avatar02,
      description: 'For people who feel forgotten or overlooked. Wants connection but doesn\'t know how to start or feels too far behind.',
      traits: 'Lonely • Hopeful • Starting from zero'
    },
    { 
      id: 3, 
      name: 'The Former Social', 
      src: Avatar03,
      description: 'For people who used to have friends but lost touch. Feels rusty and worried they\'ve forgotten how to connect.',
      traits: 'Isolated • Nostalgic • Wants to rebuild'
    },
  ];

  const handleConfirm = () => {
    if (!selectedAvatar) return;

    localStorage.setItem('selectedAvatar', JSON.stringify(selectedAvatar));
    console.log('Selected avatar saved:', selectedAvatar);

    setShowModal(false);
  }

  const handleCancel = () => {
    setSelectedAvatar(null);
    setShowModal(false);
  };

  if (!showModal) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center p-4">
        <div className="text-center">
          {selectedAvatar && (
            <div className="mt-6 text-center">
              <p className="text-purple-200 font-medium mb-4 max-w-md mx-auto">
                Got it. This is just so your practice feels more personal—nothing serious.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSelectedAvatar(null)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold transition-all"
                >
                  Try a Different One
                </button>

                <button
                  onClick={() => {
                    if (typeof onComplete === "function") onComplete();
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Thick opaque purple background */}
      <div className="absolute inset-0 bg-purple-950 z-0"></div>

      {/* Modal content */}
      <div className="relative z-10 bg-purple-900 rounded-3xl border-2 border-purple-500 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col items-center">
        
        {/* Header */}
        <div className="bg-purple-900 px-6 py-6 border-b-2 border-purple-500 flex items-center justify-between w-full">
          <div className="text-center flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Pick Your Guide
            </h2>
            <p className="text-purple-300 text-sm">Choose whichever one feels right. You can change this anytime.</p>
          </div>
          <button onClick={handleCancel} className="p-2 hover:bg-purple-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-purple-400" />
          </button>
        </div>

        {/* Avatar Grid with Descriptions */}
        <div className="flex-1 overflow-y-auto px-6 py-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {avatars.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
                onMouseEnter={() => setHoveredAvatar(avatar.id)}
                onMouseLeave={() => setHoveredAvatar(null)}
                className={`flex flex-col items-center gap-4 p-6 rounded-2xl transition-all text-left ${
                  selectedAvatar?.id === avatar.id 
                    ? 'bg-purple-800 ring-4 ring-purple-300 scale-105' 
                    : hoveredAvatar === avatar.id 
                    ? 'bg-purple-850 ring-2 ring-purple-400 scale-102' 
                    : 'bg-purple-900/50 ring-2 ring-purple-500/50'
                }`}
              >
                {/* Avatar Image */}
                <div
                  className={`relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden transition-all mx-auto
                  ${
                    selectedAvatar?.id === avatar.id
                      ? 'ring-4 ring-purple-300 shadow-2xl bg-purple-800'
                      : hoveredAvatar === avatar.id
                      ? 'ring-4 ring-purple-400 shadow-xl bg-purple-800'
                      : 'ring-2 ring-purple-500 bg-purple-900'
                  }`}
                >
                  <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                  {selectedAvatar?.id === avatar.id && (
                    <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center rounded-3xl">
                      <Check className="w-12 h-12 text-white animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Avatar Name */}
                <h3 className={`text-lg font-bold text-center w-full ${
                  selectedAvatar?.id === avatar.id ? 'text-white' : 'text-purple-200'
                }`}>
                  {avatar.name}
                </h3>

                {/* Avatar Description */}
                <p className={`text-sm leading-relaxed text-center ${
                  selectedAvatar?.id === avatar.id ? 'text-purple-100' : 'text-purple-300'
                }`}>
                  {avatar.description}
                </p>

                {/* Traits */}
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {avatar.traits.split(' • ').map((trait, idx) => (
                    <span 
                      key={idx}
                      className={`text-xs px-3 py-1 rounded-full ${
                        selectedAvatar?.id === avatar.id 
                          ? 'bg-purple-700 text-purple-100' 
                          : 'bg-purple-800/50 text-purple-300'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-5 border-t-2 border-purple-500 flex gap-3 justify-center w-full bg-purple-900">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-purple-800 hover:bg-purple-700 rounded-2xl border-2 border-purple-500 text-white font-bold transition-all"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              handleConfirm();
              if (typeof onComplete === "function") onComplete();
            }}
            disabled={!selectedAvatar}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-2xl border-2 border-purple-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            This One Works
          </button>
        </div>
      </div>
    </div>
  );
}