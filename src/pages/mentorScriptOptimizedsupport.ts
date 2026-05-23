export const mentorScriptOptimizedsupportFINAL = [
  {
    target: '[data-tour="community-header"]',
    text: '👋 Welcome! Let\'s explore by actually interacting with real posts!',
  },
  
  {
    target: '[data-tour="all-posts-tab"]',
    text: '🔍 Click "All Posts" to see the feed!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="feed"]',
    text: '📰 These are real posts from the community. Let\'s interact with the first one!',
  },
  
  {
    target: '[data-tour="feed"] [data-tour="relate-button"]',
    text: '💗 Click "I relate" on this post! This shows the author you understand their struggle.',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
  target: '[data-tour="feed"] [data-tour="expand-post"]',  // ✅ Back to this
  text: '📖 Click "Read more" to see the full story!',
  waitForSignal: true,
},
  
  {
    target: '[data-tour="activities-tab"]',
    text: '🎯 Now click "Community Activities"!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="feed"]',
    text: '🎯 These are real activities members are planning. Join them!',
  },
  
  {
    target: '[data-tour="support-tab"]',
    text: '🆘 Click "Need Support"!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="add-solution"]',
    text: '💡 Click "Share what worked for you" to help someone!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="add-comment"]',
    text: '💬 Or click "Add a comment" to offer encouragement!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="solutions-tab"]',
    text: '💡 Click "Solutions"!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="bookmark-button"]',
    text: '🔖 Click "Following" to bookmark solutions you want to try!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="journeys-tab"]',
    text: '🛤️ Click "Journeys"!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="feed"]',
    text: '📈 Follow members\' progress and cheer them on!',
  },
  
  {
    target: '[data-tour="challenges-tab"]',
    text: '🎯 Click "Challenges"!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="accept-challenge"]',
    text: '⚡ Click "Accept Challenge" to join the community in this goal!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="partners-tab"]',
    text: '🤝 Click "My Partners"!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="find-partner-btn"]',
    text: '🔍 Click here to browse potential accountability partners!',
    waitForSignal: true,  // ✅ ADD THIS
  },
  
  {
    target: '[data-tour="community-header"]',
    text: '✨ Awesome! You\'ve learned how to:\n• React to posts (💗 I relate)\n• Expand posts to read more\n• Comment and offer solutions\n• Join activities and challenges\n• Find accountability partners\n\nWelcome to the community! 💜',
  },
];
