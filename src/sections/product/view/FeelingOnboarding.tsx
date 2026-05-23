import React, { useState } from 'react';
import { Heart, Lightbulb, Target, TrendingUp, ArrowRight, Sparkles, Check } from 'lucide-react';

const FeelingOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [selectedPostTypes, setSelectedPostTypes] = useState([]);

  const FEELINGS = [
    { 
      id: 'overwhelmed', 
      emoji: '😰', 
      label: 'Overwhelmed', 
      description: 'Everything feels too much right now',
      color: 'from-red-600 to-orange-600',
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-500/10'
    },
    { 
      id: 'anxious', 
      emoji: '😟', 
      label: 'Anxious', 
      description: 'Worried about social situations',
      color: 'from-yellow-600 to-amber-600',
      borderColor: 'border-yellow-500/50',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      id: 'stuck', 
      emoji: '😔', 
      label: 'Stuck', 
      description: "Don't know how to move forward",
      color: 'from-blue-600 to-indigo-600',
      borderColor: 'border-blue-500/50',
      bgColor: 'bg-blue-500/10'
    },
    { 
      id: 'motivated', 
      emoji: '💪', 
      label: 'Motivated', 
      description: 'Ready to take action and improve',
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500/50',
      bgColor: 'bg-green-500/10'
    },
    { 
      id: 'curious', 
      emoji: '🤔', 
      label: 'Curious', 
      description: 'Want to learn and explore',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500/50',
      bgColor: 'bg-purple-500/10'
    },
    { 
      id: 'struggling', 
      emoji: '😣', 
      label: 'Struggling', 
      description: 'Having a really tough time',
      color: 'from-rose-600 to-red-600',
      borderColor: 'border-rose-500/50',
      bgColor: 'bg-rose-500/10'
    },
  ];

  const POST_TYPE_RECOMMENDATIONS = {
    overwhelmed: [
      { 
        type: 'struggle-solution', 
        icon: '🆘',
        title: 'Get Support',
        reason: 'Get support from people who understand',
        color: 'from-red-600 to-pink-600'
      },
      { 
        type: 'what-worked', 
        icon: '💡',
        title: 'See Solutions',
        reason: 'See solutions that helped others',
        color: 'from-green-600 to-emerald-600'
      },
    ],
    anxious: [
      { 
        type: 'journey-tracker', 
        icon: '🛤️',
        title: 'Recovery Journeys',
        reason: 'See how others overcame anxiety',
        color: 'from-purple-600 to-indigo-600'
      },
      { 
        type: 'what-worked', 
        icon: '💡',
        title: 'Proven Solutions',
        reason: 'Try techniques that worked for others',
        color: 'from-green-600 to-emerald-600'
      },
    ],
    stuck: [
      { 
        type: 'micro-challenge', 
        icon: '🎯',
        title: 'Small Challenges',
        reason: 'Start with tiny steps forward',
        color: 'from-cyan-600 to-blue-600'
      },
      { 
        type: 'what-worked', 
        icon: '💡',
        title: 'Breakthrough Stories',
        reason: 'Learn what helped people get unstuck',
        color: 'from-green-600 to-emerald-600'
      },
    ],
    motivated: [
      { 
        type: 'micro-challenge', 
        icon: '🎯',
        title: 'Take Challenges',
        reason: 'Join community challenges',
        color: 'from-cyan-600 to-blue-600'
      },
      { 
        type: 'journey-tracker', 
        icon: '🛤️',
        title: 'Start Your Journey',
        reason: 'Document and share your progress',
        color: 'from-purple-600 to-indigo-600'
      },
    ],
    curious: [
      { 
        type: 'journey-tracker', 
        icon: '🛤️',
        title: 'Success Stories',
        reason: 'Explore transformation journeys',
        color: 'from-purple-600 to-indigo-600'
      },
      { 
        type: 'what-worked', 
        icon: '💡',
        title: 'Learn Strategies',
        reason: 'Discover what works for social anxiety',
        color: 'from-green-600 to-emerald-600'
      },
    ],
    struggling: [
      { 
        type: 'struggle-solution', 
        icon: '🆘',
        title: 'Get Help Now',
        reason: 'Connect with supportive community',
        color: 'from-red-600 to-pink-600'
      },
      { 
        type: 'journey-tracker', 
        icon: '🛤️',
        title: 'Hope Stories',
        reason: "See you're not alone",
        color: 'from-purple-600 to-indigo-600'
      },
    ],
  };

  const handleFeelingSelect = (feeling) => {
    setSelectedFeeling(feeling);
    setStep(2);
  };

  const togglePostType = (postType) => {
    if (selectedPostTypes.includes(postType)) {
      setSelectedPostTypes(selectedPostTypes.filter(t => t !== postType));
    } else {
      setSelectedPostTypes([...selectedPostTypes, postType]);
    }
  };

  const handleContinue = () => {
    onComplete({
      feeling: selectedFeeling,
      postTypes: selectedPostTypes.length > 0 ? selectedPostTypes : null
    });
  };

  const recommendations = selectedFeeling ? POST_TYPE_RECOMMENDATIONS[selectedFeeling.id] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        
        {/* Step 1: How are you feeling? */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-6xl mb-4">💜</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                How are you feeling right now?
              </h1>
              <p className="text-purple-300 text-lg">
                Let's personalize your feed to help you the most
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {FEELINGS.map((feeling) => (
                <button
                  key={feeling.id}
                  onClick={() => handleFeelingSelect(feeling)}
                  className={`p-6 rounded-2xl border-2 ${feeling.borderColor} ${feeling.bgColor} 
                    hover:scale-105 transition-all duration-300 text-left group
                    hover:shadow-xl hover:shadow-purple-500/20`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform">
                      {feeling.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {feeling.label}
                      </h3>
                      <p className="text-purple-300 text-sm">
                        {feeling.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => onComplete({ feeling: null, postTypes: null })}
              className="w-full mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-purple-300 font-medium transition-all"
            >
              Skip - Show me everything
            </button>
          </div>
        )}

        {/* Step 2: What would help? */}
        {step === 2 && selectedFeeling && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-6xl mb-4">{selectedFeeling.emoji}</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                You're feeling {selectedFeeling.label.toLowerCase()}
              </h1>
              <p className="text-purple-300 text-lg">
                What would help you right now? (Choose all that apply)
              </p>
            </div>

            <div className="space-y-4 mt-8">
              {recommendations.map((rec) => {
                const isSelected = selectedPostTypes.includes(rec.type);
                return (
                  <button
                    key={rec.type}
                    onClick={() => togglePostType(rec.type)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300
                      ${isSelected 
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30' 
                        : 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{rec.icon}</div>
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                          {rec.title}
                          {isSelected && (
                            <Check className="w-5 h-5 text-green-400" />
                          )}
                        </h3>
                        <p className="text-purple-300">
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-all"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
              >
                {selectedPostTypes.length > 0 ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Show me these posts
                  </>
                ) : (
                  <>
                    Show me everything
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeelingOnboarding;