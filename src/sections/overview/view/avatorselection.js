import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

// Utility: dynamically import all SVGs from folder
const importAvatars = () => {
  const context = require.context('../AVATORS', false, /\.svg$/);
  return context.keys().map((key, idx) => ({
    id: idx + 1,
    name: `Avatar ${idx + 1}`,
    src: context(key),
    xp: 10 + idx * 5, // XP per avatar
    unlockXp: idx * 20, // XP required to unlock
    badge: idx % 3 === 0 ? '🏆' : null, // simple badge example
  }));
};

export default function AvatarChooser() {
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setAvatars(importAvatars());

    // Restore saved avatar & XP
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) setSelectedAvatar(JSON.parse(savedAvatar));
    const savedXp = localStorage.getItem('userXp');
    if (savedXp) setXp(Number(savedXp));
  }, []);

  const handleSelect = (avatar) => {
    if (xp < avatar.unlockXp) return; // locked avatar
    setSelectedAvatar(avatar);
    localStorage.setItem('selectedAvatar', JSON.stringify(avatar));
    setShowConfetti(true);

    // Increment XP
    const newXp = xp + avatar.xp;
    setXp(newXp);
    localStorage.setItem('userXp', newXp);

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleCancel = () => setShowModal(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Choose Your Avatar
            </h2>
            <p className="text-purple-300 text-sm">Pick one that represents you</p>
          </div>
          <button onClick={handleCancel} className="p-2 hover:bg-purple-800/50 rounded-lg">
            <X className="w-6 h-6 text-purple-400" />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {avatars.map((avatar) => {
              const locked = xp < avatar.unlockXp;
              return (
                <motion.button
                  key={avatar.id}
                  onMouseEnter={() => setHoveredAvatar(avatar.id)}
                  onMouseLeave={() => setHoveredAvatar(null)}
                  onClick={() => handleSelect(avatar)}
                  className={`relative flex items-center justify-center rounded-xl border-2 border-transparent transition-all ${
                    locked ? 'opacity-40 cursor-not-allowed' : 'hover:border-purple-400'
                  }`}
                  whileHover={!locked ? { scale: 1.1 } : {}}
                  whileTap={!locked ? { scale: 0.95 } : {}}
                >
                  <img src={avatar.src} alt={avatar.name} className="w-20 h-20" />
                  {selectedAvatar?.id === avatar.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl animate-pulse">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {avatar.badge && (
                    <div className="absolute top-1 left-1 text-sm animate-bounce">{avatar.badge}</div>
                  )}
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white/80 bg-black/50 rounded-xl">
                      Unlock at {avatar.unlockXp} XP
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Avatar Preview */}
        {selectedAvatar && (
          <div className="bg-purple-800/70 p-4 rounded-2xl flex flex-col items-center gap-3 mx-6 mb-6">
            <div className="relative w-32 h-32">
              <img src={selectedAvatar.src} alt={selectedAvatar.name} className="w-full h-full rounded-2xl" />
              <Check className="absolute top-1 right-1 w-6 h-6 text-green-400" />
            </div>
            <p className="text-white font-bold text-xl">{selectedAvatar.name}</p>
            <p className="text-purple-200">Total XP: {xp}</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold"
            >
              Choose Another
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
