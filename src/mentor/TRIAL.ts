export const mentorScriptProductsPageFixed = [
  {
    journeyName: 'products-page',
    target: '#community-top-bar',  // ✅ Correct target (actual component ID)
    text: 'Welcome! This section shows your community connections and support network.',
    waitForSignal: true,
  signal: 'products:ready'
  },
  {
    target: '#community-top-bar',
    text: 'This is the Social Avoidance community - a safe space to share experiences and get support.',
    waitForSignal: true,
    signal: 'COMMUNITY_VIEWED',
    noOverlay: true,  // ✅ ADD THIS
  },
  {
    target: '#community-filters',
    text: 'Use these filters to find the type of posts you need...',
  },
  {
    target: '#community-feed',
    text: 'Here you can see real experiences from others...',
  },
];
