import { motion } from "framer-motion";
import { Brain, TrendingUp, MessageCircle, Trophy, Star, Check } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Tiny Daily Missions",
    description:
      "Start small like 'say hi once' or 'notice someone’s smile.' Each mission is broken into tiny steps so you can make progress without pressure.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Your journey feels like a game map. Each small win unlocks the next step. No guessing just a clear path forward.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Get Guidance & Feedback",
    description:
      "Ask questions and get practical tips from others who understand. Practice privately and build confidence at your own pace.",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Trophy,
    title: "Celebrate Wins",
    description:
      "Log your milestones and streaks privately. When ready, share progress with others who’ve been in your shoes.",
    gradient: "from-violet-500 to-violet-600",
  },
];

const testimonialAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  "https://images.unsplash.com/photo-1494790108755-2616b9888882?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
];

export default function FeaturePreview() {
  return (
    <div>
      <div className="text-center lg:text-left mb-8">
  <motion.h3
    className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    Daily Social Practice{" "}
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
      with People Just Like Us
    </span>
  </motion.h3>
  <motion.p
    className="text-slate-400 text-lg mb-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
  >
    Take small, practical steps every day to improve your interactions
  </motion.p>
  <motion.p
    className="text-slate-300 text-xl leading-relaxed"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    Practice in real situations, get guidance from peers, and grow together one small action at a time.
  </motion.p>
</div>


      {/* Reassurance Bar */}
      <motion.div
        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-slate-300">
          <span className="flex items-center space-x-2">
            <Check size={16} className="text-green-400" />
            <span>Work at your own pace</span>
          </span>
          <span className="flex items-center space-x-2">
            <Check size={16} className="text-green-400" />
            <span>No pressure, no judgment</span>
          </span>
          <span className="flex items-center space-x-2">
            <Check size={16} className="text-green-400" />
            <span>Practice privately or with support</span>
          </span>
        </div>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid gap-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 hover:transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 4) }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center`}
              >
                <feature.icon className="text-white text-lg" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Proof */}
      

      {/* Final Reassurance */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p className="text-slate-400 text-sm">
          No cost. No risk. Just you and a community that understands.
        </p>
      </motion.div>
    </div>
  );
}
