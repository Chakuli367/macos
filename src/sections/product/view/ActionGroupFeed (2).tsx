import React, { useState } from 'react';
import { Plus, Search, Users, MoreVertical, Bell, Pin, Archive, Settings, User, MessageCircle, Menu, Sparkles, TrendingUp, Flame, Zap, Star, Crown } from 'lucide-react';
import GroupChatApp from './GroupChatApp'; // Your existing component



// Mock groups data
const INITIAL_GROUPS = [
  {
    id: 'group1',
    name: 'Fitness Warriors',
    members: 15,
    activeMembers: 8,
    lastMessage: 'Sarah completed Morning Yoga!',
    lastMessageTime: Date.now() - 300000,
    unreadCount: 3,
    avatar: '💪',
    pinned: true
  },
  {
    id: 'group2',
    name: 'Code Crushers',
    members: 12,
    activeMembers: 5,
    lastMessage: 'New coding challenge posted',
    lastMessageTime: Date.now() - 1800000,
    unreadCount: 0,
    avatar: '💻',
    pinned: false
  },
  {
    id: 'group3',
    name: 'Morning Meditation',
    members: 20,
    activeMembers: 12,
    lastMessage: 'Alex completed Daily Practice',
    lastMessageTime: Date.now() - 3600000,
    unreadCount: 5,
    avatar: '🧘',
    pinned: true
  },
  {
    id: 'group4',
    name: 'Book Club',
    members: 8,
    activeMembers: 4,
    lastMessage: 'Chapter 5 discussion tomorrow',
    lastMessageTime: Date.now() - 7200000,
    unreadCount: 0,
    avatar: '📚',
    pinned: false
  },
  {
    id: 'group5',
    name: 'Study Group',
    members: 10,
    activeMembers: 6,
    lastMessage: 'Maria shared study notes',
    lastMessageTime: Date.now() - 86400000,
    unreadCount: 1,
    avatar: '🎓',
    pinned: false
  }
];

function WhatsAppInterface() {
  const [groups] = useState(INITIAL_GROUPS);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

    const totalActive = groups.reduce((sum, g) => sum + (g.activeMembers || 0), 0);
  const totalUnread = groups.reduce((sum, g) => sum + (g.unreadCount || 0), 0);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'yesterday';
    return `${days}d`;
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedGroups = filteredGroups.filter(g => g.pinned);
  const regularGroups = filteredGroups.filter(g => !g.pinned);



  // If a group is selected, render the GroupChatApp component
  if (selectedGroup) {
    return (
      <div className="h-screen w-full">
        <GroupChatApp 
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          groupMembers={selectedGroup.members}
          activeMembers={selectedGroup.activeMembers}
          onBack={() => setSelectedGroup(null)}
        />
      </div>
    );
  }

  // Groups list view
  return (
    <div className="h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b-2 border-purple-500/30 shadow-2xl">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2.5 hover:bg-purple-700/40 rounded-xl transition-all hover:scale-110 active:scale-95"
              >
                <Menu className="w-6 h-6 text-purple-200" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
                  AccountaBuddy
                </h1>
                <p className="text-xs text-purple-400">{groups.length} groups</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full border border-orange-400/30">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-100">{totalActive}</span>
              </div>
              <button className="p-2.5 hover:bg-purple-700/40 rounded-xl transition-all hover:scale-110 active:scale-95 relative">
                <Bell className="w-5 h-5 text-purple-200" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce-subtle">
                    {totalUnread}
                  </span>
                )}
              </button>
              <button className="p-2.5 hover:bg-purple-700/40 rounded-xl transition-all hover:scale-110 active:scale-95">
                <MoreVertical className="w-5 h-5 text-purple-200" />
              </button>
            </div>
          </div>

          {/* Stats Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-medium text-purple-200">All Groups</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-950/40 rounded-full border border-purple-700/30 flex-shrink-0">
              <Pin className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-medium text-purple-300">{pinnedGroups.length} Pinned</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-950/40 rounded-full border border-purple-700/30 flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-purple-300">{totalActive} Active</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 md:px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
        {/* Pinned Groups */}
        {pinnedGroups.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 px-2 mb-3">
              <Pin className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">Pinned</span>
              <div className="flex-1 h-px bg-gradient-to-r from-pink-500/30 to-transparent" />
            </div>
            <div className="space-y-3">
              {pinnedGroups.map((group, idx) => (
                <GroupItem 
                  key={group.id} 
                  group={group} 
                  onSelect={setSelectedGroup}
                  formatTime={formatTime}
                  isHovered={hoveredGroup === group.id}
                  onHover={setHoveredGroup}
                  animationDelay={idx * 50}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Groups */}
        {regularGroups.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            {pinnedGroups.length > 0 && (
              <div className="flex items-center gap-2 px-2 mb-3 mt-6">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">All Chats</span>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
              </div>
            )}
            <div className="space-y-3">
              {regularGroups.map((group, idx) => (
                <GroupItem 
                  key={group.id} 
                  group={group} 
                  onSelect={setSelectedGroup}
                  formatTime={formatTime}
                  isHovered={hoveredGroup === group.id}
                  onHover={setHoveredGroup}
                  animationDelay={(pinnedGroups.length + idx) * 50}
                />
              ))}
            </div>
          </div>
        )}

        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
              <MessageCircle className="w-12 h-12 text-purple-500/50" />
            </div>
            <p className="text-lg font-medium text-purple-300 mb-2">No groups found</p>
            <p className="text-sm text-purple-400">Try a different search term</p>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-24" />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 z-20 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-bounce-subtle">
        <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      </button>

      {/* Side Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl z-50 shadow-2xl border-r-2 border-purple-500/30 animate-slide-in">
            <div className="bg-gradient-to-r from-purple-800/60 to-pink-800/60 p-6 border-b-2 border-purple-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-purple-900 animate-pulse-slow" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Alex Johnson</p>
                  <p className="text-purple-300 text-sm">alex@example.com</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-purple-400">Pro Member</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <MenuItem icon={<Users />} label="New Group" badge={null} />
              <MenuItem icon={<Bell />} label="Notifications" badge={totalUnread > 0 ? totalUnread : null} />
              <MenuItem icon={<Star />} label="Favorites" badge={pinnedGroups.length} />
              <MenuItem icon={<Archive />} label="Archived" badge={null} />
              <MenuItem icon={<Settings />} label="Settings" badge={null} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-purple-500/30 bg-gradient-to-r from-purple-900/80 to-indigo-900/80">
              <div className="flex items-center justify-between text-xs text-purple-400">
                <span>Version 2.0</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Premium</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        button, input {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}

function GroupItem({ group, onSelect, formatTime, isHovered, onHover, animationDelay }) {
  return (
    <button
      onClick={() => onSelect(group)}
      onMouseEnter={() => onHover(group.id)}
      onMouseLeave={() => onHover(null)}
      className="w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] p-4 animate-fade-in overflow-hidden relative group"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      
      <div className="relative flex items-center gap-3">
        <div className={`w-14 h-14 bg-gradient-to-br ${group.color} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg transform transition-all group-hover:scale-110 group-hover:rotate-6`}>
          {group.avatar}
          {group.pinned && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center animate-pulse-slow">
              <Pin className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white truncate group-hover:text-purple-200 transition-colors">
              {group.name}
            </h3>
            <span className={`text-xs font-semibold ${group.unreadCount > 0 ? 'text-pink-400' : 'text-purple-400'}`}>
              {formatTime(group.lastMessageTime)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-300 truncate flex-1 group-hover:text-purple-200 transition-colors">
              {group.lastMessage}
            </p>
            {group.unreadCount > 0 && (
              <span className="ml-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 shadow-lg animate-bounce-subtle">
                {group.unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-950/50 rounded-full border border-purple-700/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
              <span className="text-xs text-purple-300 font-medium">{group.activeMembers}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-950/50 rounded-full border border-purple-700/30">
              <Users className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">{group.members}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function MenuItem({ icon, label, badge }) {
  return (
    <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-purple-800/40 transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      
      <div className="relative text-purple-300 group-hover:text-purple-100 transition-colors group-hover:scale-110 transform">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className="relative text-purple-200 font-medium group-hover:text-white transition-colors flex-1 text-left">
        {label}
      </span>
      {badge !== null && badge > 0 && (
        <span className="relative bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg">
          {badge}
        </span>
      )}
    </button>
  );
}

export default WhatsAppInterface;