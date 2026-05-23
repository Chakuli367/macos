import { motion } from "framer-motion";
import { Brain, TrendingUp, MessageCircle, Trophy, Star } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Guided Daily Missions",
    description:
      'Get personalized daily challenges like "smile at 3 people" with step-by-step guidance and real-time coaching support. Based on Dale Carnegie\'s proven principles.',
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Interactive Map Experience",
    description:
      'Unlock skill nodes on a game-like map as you complete missions. Each node represents a new social skill learned - from "Genuine Interest" to "Confident Conversations."',
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Role-Play & Live Support",
    description:
      'Practice conversations with our AI chatbot, get feedback on your approach, and build confidence before real-life interactions. Ask: "How do I compliment someone without sounding awkward?"',
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Trophy,
    title: "Achievement & Community System",
    description:
      "Join 5-day challenges with other learners, maintain daily streaks, earn badges, and get supportive feedback from the community.",
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
          Transform Your Social Life with {" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Community Built for Connection
          </span>
        </motion.h3>
        <motion.p
          className="text-slate-300 text-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

          What began as a small accountability group of people supporting each other has grown into something much bigger — a full platform built around community, transformation, and real connection. We started 
          with simple check-ins and encouragement, and now it’s become a space where people come together, share progress, and transform their social lives side by side.
          
          Join the many users building confidence through daily missions,
          gamified progress tracking, and personalized guidance.
        </motion.p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid gap-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 hover:transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
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
      <motion.div
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        data-testid="testimonial-section"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex -space-x-2">
            {testimonialAvatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`User testimonial ${index + 1}`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                data-testid={`avatar-${index}`}
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">2.3k+</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="text-yellow-400 fill-current"
                  size={16}
                />
              ))}
            </div>
            <span className="text-slate-300 text-sm ml-2">4.9/5 rating</span>
          </div>
        </div>
        <blockquote className="text-white font-medium mb-2">
          "I went from barely making eye contact to leading conversations at
          work. GoalGrid made social skills feel achievable with small daily
          steps."
        </blockquote>
        <cite className="text-slate-400 text-sm">
          – A former Social underdog
        </cite>
      </motion.div>
    </div>
  );
}
