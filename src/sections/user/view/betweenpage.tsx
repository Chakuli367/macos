import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import { useState } from 'react';

export default function FirstLessonPrompt({ onStartLesson, user }) {
  const [showCommitment, setShowCommitment] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white relative overflow-hidden flex items-center justify-center">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showCommitment ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <Rocket className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Day 1
            </h1>

            <p className="text-lg text-slate-300 mb-8">
              23 minutes · 10 stages
            </p>

            <motion.button
              onClick={() => setShowCommitment(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg px-12 py-4 rounded-xl shadow-lg transition-all"
            >
              Begin <ArrowRight className="inline ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Ready to start?
            </h2>

            <button
              onClick={onStartLesson}
              className="w-full text-lg px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all"
            >
              Start Lesson <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
