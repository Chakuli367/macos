import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Flame, Trophy, ChevronRight, Sparkles, Star, Zap, MessageCircle, Crown } from "lucide-react";
import { db } from "./firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

interface ActionBuddy {
  id: string;
  name: string;
  avatar: string;
  league: string;
  streak: number;
  points: number;
  isOnline: boolean;
  actionLevel: number;
}

export interface ActionBuddiesProps {
  buddies: ActionBuddy[];
}

const mockBuddies = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=1",
    league: "💠",
    streak: 45,
    points: 2850,
    isOnline: true,
    actionLevel: 5,
  },
  {
    id: "2",
    name: "Alex Kumar",
    avatar: "https://i.pravatar.cc/150?img=2",
    league: "💎",
    streak: 32,
    points: 2100,
    isOnline: true,
    actionLevel: 4,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=3",
    league: "🥇",
    streak: 28,
    points: 1750,
    isOnline: false,
    actionLevel: 3,
  },
  {
    id: "4",
    name: "Marcus Johnson",
    avatar: "https://i.pravatar.cc/150?img=4",
    league: "🥈",
    streak: 15,
    points: 980,
    isOnline: true,
    actionLevel: 2,
  },
];

const ActionBuddies = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [buddies, setBuddies] = useState<ActionBuddy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(5));
        const querySnapshot = await getDocs(q);
        
        const fetchedBuddies: ActionBuddy[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedBuddies.push({
            id: doc.id, // This is the UID
            name: data.name || data.displayName || "Unknown User",
            avatar: data.avatar || data.photoURL || `https://i.pravatar.cc/150?u=${doc.id}`,
            league: data.league || "🥉",
            streak: data.streak || 0,
            points: data.points || 0,
            isOnline: data.isOnline || false,
            actionLevel: data.actionLevel || 1,
          });
        });
        
        setBuddies(fetchedBuddies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        // Fallback to mock data if Firebase fails
        setBuddies(mockBuddies);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full min-h-screen bg-transparent p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 opacity-0"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [360, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 opacity-0"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded-full border border-purple-400/50 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Your Action Buddies
            </span>
            <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3"
          >
            <Users className="w-8 h-8 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Action Buddies Hub
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-purple-300 max-w-2xl mx-auto mb-8"
          >
            Partner up. Take action. Level up together.
          </motion.p>
        </motion.div>

        {/* Buddy Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-between mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Sparkles className="w-12 h-12 text-purple-400" />
                </motion.div>
                <p className="text-purple-300 mt-4">Loading your action buddies...</p>
              </div>
            ) : buddies.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-purple-300">No buddies found. Start connecting!</p>
              </div>
            ) : (
              buddies.map((buddy, index) => (
                <motion.div
                  key={buddy.id}
                  whileHover={{ scale: 1.03 }}
                  onHoverStart={() => setHoveredId(buddy.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="relative bg-gradient-to-br from-purple-900/80 to-indigo-900/80 p-6 rounded-3xl border-2 border-purple-500/30 shadow-2xl"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-purple-400/50 shadow-2xl"
                      />
                      {buddy.isOnline && (
                        <motion.span 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 border-4 border-purple-900 rounded-full"
                        />
                      )}
                      <div className="absolute -bottom-2 -right-2 text-3xl">{buddy.league}</div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{buddy.name}</h3>
                      <p className="text-xs text-purple-300 mb-2 font-mono">UID: {buddy.id}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < buddy.actionLevel ? 'fill-yellow-400 text-yellow-400' : 'text-purple-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-orange-600/30 rounded-xl border border-orange-500/40">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="font-bold text-white text-lg">{buddy.streak}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-600/30 rounded-xl border border-yellow-500/40">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="font-bold text-white text-lg">{buddy.points}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold text-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm border border-white/20"
                        >
                          <Zap className="w-4 h-4" />
                          Join Action
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20  rounded-full border border-purple-400/30">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-purple-200 font-medium">
              Join <span className="font-bold text-white">1,234 Action Buddies</span> leveling up daily
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActionBuddies;