
import React from 'react';
import { Users, Zap, MessageCircle, Star } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  icon: React.ReactNode;
  members: number;
  activeNow: number;
  recentMessages: number;
  isFeatured?: boolean;
}

interface GroupGridProps {
  groups: Group[];
  onClickGroup?: (group: Group) => void;
}

const GroupGrid: React.FC<GroupGridProps> = ({ groups, onClickGroup }) => {
  return (
    // Outer container matching the tracker's page background
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:p-10 max-w-6xl mx-auto">

      
      {/* Header for context */}
      <div className="mb-6 md:mb-8 flex items-center gap-3">
        <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-100">
          Social Groups
        </h1>
      </div>

      {/* Grid container with gap and column adjustments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {groups.map(group => (
          <div
            key={group.id}
            onClick={() => onClickGroup?.(group)}
            // Card styling matching the tracker's sections
            className={`
              relative cursor-pointer p-5 md:p-6 
              bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md 
              rounded-3xl border-2 border-purple-500/30 
              shadow-2xl 
              transition-all duration-300 transform 
              hover:scale-[1.02] hover:shadow-3xl
            `}
          >
            {group.isFeatured && (
              // Featured indicator styling
              <div className="absolute top-4 right-4 p-2 bg-yellow-400/20 rounded-full border border-yellow-400/50">
                <Star size={16} className="text-yellow-300 fill-yellow-300" />
              </div>
            )}
            
            {/* Icon and Name */}
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <div className="text-4xl md:text-5xl text-purple-300">
                {group.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-100 truncate">
                {group.name}
              </h3>
            </div>
            
            {/* Stats Pills - Matching the style of the header stats */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-3">
              {/* Members */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-400/30">
                <Users size={14} className="text-green-400" />
                <span className="text-xs font-bold text-green-100">{group.members}</span>
                <span className="text-xs text-green-300 hidden sm:inline">Members</span>
              </div>

              {/* Active Now */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full border border-orange-400/30">
                <Zap size={14} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-100">{group.activeNow}</span>
                <span className="text-xs text-orange-300 hidden sm:inline">Active Now</span>
              </div>
            </div>
            
            {/* Recent Messages */}
            <div className="mt-4 pt-3 border-t border-purple-700/50 flex items-center gap-2 text-sm text-purple-400">
              <MessageCircle size={16} className="text-purple-400" />
              <span className="font-medium">{group.recentMessages} recent messages</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupGrid;
