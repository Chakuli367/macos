import React from 'react';

const STRUGGLES = [
  { id: 'cant-leave-room', label: "Can't leave my room", icon: '🚪' },
  { id: 'avoiding-people', label: "Avoiding everyone", icon: '👻' },
  { id: 'panic-symptoms', label: "Panic attack symptoms", icon: '💔' },
  { id: 'need-to-vent', label: "Just need to vent", icon: '💨' },
  { id: 'canceled-plans', label: "Had to cancel plans again", icon: '📅' },
  { id: 'something-else', label: "Something else", icon: '💭' }
];

const StruggleIdentification = ({ onStruggleSelected }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            What's happening right now?
          </h1>
          <p className="text-purple-300 text-lg">
            Pick one. No overthinking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STRUGGLES.map((struggle) => (
            <button
              key={struggle.id}
              onClick={() => onStruggleSelected(struggle.label)}
              className="p-6 bg-purple-900/30 hover:bg-purple-800/50 border-2 border-purple-500/30
                       hover:border-purple-400 rounded-2xl transition-all transform hover:scale-105
                       text-left group"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{struggle.icon}</span>
                <span className="text-white text-xl font-semibold group-hover:text-purple-200">
                  {struggle.label}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StruggleIdentification;