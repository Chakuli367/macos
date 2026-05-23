// mentorScriptBlogView.ts
// ✅ UPDATED VERSION - Modular tour with sub-scripts



export const mentorScriptBlogView = [
  // ========================================
  // WELCOME & OVERVIEW
  // ========================================
  {
    target: 'body',
    text: '👋 Welcome to your Anxiety Activity Tracker! This app helps you face fears, track progress, and see your anxiety decrease over time. Let me show you around!',
  },
  
  // ========================================
  // STATS OVERVIEW
  // ========================================
  {
    target: '.grid.grid-cols-2.md\\:grid-cols-4.gap-4.mb-8',
    text: '📊 These are your stats! Track completed activities, your streak, anxiety drops, and variety of activities you\'ve tried.',
  },
  
  // ========================================
  // ACHIEVEMENTS SECTION
  // ========================================
  {
    target: '.bg-gradient-to-br.from-purple-900\\/50.to-indigo-900\\/50:has(.text-2xl.font-bold.text-purple-100:contains("Achievements"))',
    text: '🏆 Unlock achievements as you progress! Each milestone celebrates your courage in facing fears.',
  },
  
  // ========================================
  // QUICK ACTIONS - BREATHING
  // ========================================
  {
    target: '#breathing-button',
    text: '🌬️ Feeling anxious? Click here for instant calming breathing exercises. Go ahead and click it now!',
    waitForSignal: true,
    pauseForModal: 'showBreathing',
    requireModalClose: true,
  },
  {
    target: '.space-y-3',
    text: '💨 Here are proven breathing techniques! Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8.',
    onModalContent: true,
    pauseForModal: 'showBreathing',
    requireModalClose: true,
  },
  {
    target: 'body',
    text: '✅ Great! Let\'s continue the tour!',
    showAfterModalClose: 'showBreathing',
  },
  
  // ========================================
  // THOUGHT REFRAMING
  // ========================================
  {
    target: '[data-tour="reframe-button"]',
    text: '🧠 Click "Reframe Thoughts" to challenge anxious thinking with reality checks. Click it now!',
    waitForSignal: true,
    pauseForModal: 'showReframing',
    requireModalClose: true,
  },
  
  {
    target: '.space-y-4:has(.bg-purple-950\\/50.rounded-2xl)',
    text: '💭 Notice how each anxious thought has a reality-based reframe. When you\'re nervous, come back here! Close this modal when ready.',
    onModalContent: true,
  },
  
  {
    target: 'body',
    text: '✅ Perfect! Now you know where to find thought reframing tools.',
    showAfterModalClose: 'showReframing',
  },
  
  // ========================================
  // DISCOVER ACTIVITIES
  // ========================================
  {
    target: '[data-tour="discover-button"]',
    text: '🔍 Not sure what activities to try? Click "Discover Activities" to explore options! Click it!',
    waitForSignal: true,
    pauseForModal: 'showDiscovery',
    requireModalClose: true,
  },
  
  {
    target: '.space-y-4:has(.bg-purple-950\\/50)',
    text: '📋 Each category shows examples, anxiety level, and social interaction style. Find activities that match your comfort level! Close when ready.',
    onModalContent: true,
    pauseForModal: 'showDiscovery',
    requireModalClose: true,
  },
  
  {
    target: 'body',
    text: '✅ Excellent! You\'ve explored the activity categories.',
    showAfterModalClose: 'showDiscovery',
  },
  
  // ========================================
  // INTERACTION PLANNER - MAIN ENTRY POINT
  // ========================================
  {
    target: '#interaction-planner-button',
    text: '📅 The Interaction Planner is your main tool! It helps you prepare for anxiety-inducing situations. Let\'s explore it! Click here!',
    waitForSignal: true,
    pauseForModal: 'showInteractionPlanner',
    requireModalClose: true,
    waitForCustomEvent: 'inlineTourCompleted',
    // 🎯 This will trigger the sub-tour to start
  },
  
  // After Interaction Planner tour completes, continue here:
  
  // ========================================
  // FLOATING ADD BUTTON
  // ========================================
 
];

// ========================================
// SHORTER TOUR FOR RETURNING USERS
// ========================================
export const mentorScriptBlogViewQuick = [
  {
    target: '.grid.grid-cols-2.md\\:grid-cols-4.gap-4.mb-8',
    text: '📊 Quick reminder - track your progress here!',
  },
  {
    target: '#interaction-planner-button',
    text: '📅 Use the Interaction Planner to schedule and prepare!',
  },
  {
    target: '#breathing-button',
    text: '🌬️ Use breathing exercises before activities!',
  },
  {
    target: 'body',
    text: '💪 Remember: You\'ve survived 100% of your scary situations so far. You got this!',
  },
];