// src/config/onboardingSteps.ts

export type OnboardingAction = {
  type: 'click' | 'navigate' | 'input';
  target?: string;
  value?: string;
  nextPath?: string;
};

export type OnboardingStep = {
  element?: string;
  popover: {
    title: string;
    description: string;
    side: 'top' | 'bottom' | 'left' | 'right' | 'center';
    align?: 'start' | 'center' | 'end';
  };
  requiredAction?: OnboardingAction;
  allowSkip?: boolean;
  highlightElement?: boolean;
  disableOtherElements?: boolean;
};

export const onboardingSteps: OnboardingStep[] = [
  {
    // Welcome modal - centered on screen
    popover: {
      title: 'Welcome to GG! 🎯',
      description: 'Let me show you around in just 60 seconds. Click "Next" to begin your interactive tour!',
      side: 'center',
      align: 'center',
    },
    allowSkip: false,
  },
  {
    // Step 1: Force user to click the Dashboard tab
    element: '#dashboard-tab',
    popover: {
      title: 'What now? 🏠',
      description: 'First, let\'s explore your home base. **Click on this tab** to see what\'s happening.',
      side: 'top',
    },
    requiredAction: {
      type: 'click',
      target: '#dashboard-tab',
    },
    highlightElement: true,
    disableOtherElements: true,
    allowSkip: false,
  },
 
  {
    // Step 4: Force user to navigate to Tips tab
    element: '#goals-tab',
    popover: {
      title: 'Tips and Tricks 💬',
      description: 'Great! Now **click here** to discover conversation starters and social guidance.',
      side: 'top',
    },
    requiredAction: {
      type: 'click',
      target: '#goals-tab',
    },
    highlightElement: true,
    disableOtherElements: true,
    allowSkip: false,
  },
  {
    // Step 6: Force interaction with connect button
    element: '#connect-button',
    popover: {
      title: 'Start Connecting 🤝',
      description: '**Click this button** to see people you can connect with!',
      side: 'bottom',
    },
    requiredAction: {
      type: 'click',
      target: '#connect-button',
    },
    highlightElement: true,
    disableOtherElements: true,
    allowSkip: false,
  },
  {
    // Step 7: Navigate to Activities tab
    element: '#navigate-button',
    popover: {
      title: 'What do I try? ✅',
      description: '**Click here** to discover new activities and experiences.',
      side: 'top',
    },
    requiredAction: {
      type: 'navigate',
      target: '#navigate-button',
      nextPath: '/blog',
    },
    highlightElement: true,
    disableOtherElements: true,
    allowSkip: false,
  },
  {
    // Step 3: After page loads, click another button
    element: '#action-button-on-new-page',
    popover: {
      title: 'Take Action 🎯',
      description: 'Perfect! Now **click this button** on the new page.',
      side: 'bottom',
    },
    requiredAction: {
      type: 'click',
      target: '#action-button-on-new-page',
    },
    highlightElement: true,
    disableOtherElements: true,
    allowSkip: false,
  },
  {
    // Step 8: Navigate to Profile tab
    element: '#whats-wrong',
    popover: {
      title: "My Profile 🧠",
      description: '**Click here** to access your profile and settings.',
      side: 'top',
    },
    requiredAction: {
      type: 'click',
      target: '#whats-wrong',
    },
    highlightElement: true,
    disableOtherElements: true,
    allowSkip: false,
  },
  {
    // Final step - completion
    popover: {
      title: "You're All Set! 🚀",
      description: 'Congratulations! You\'ve completed the tour. Start creating goals and tracking your progress. You can restart this tour anytime from your profile settings.',
      side: 'center',
      align: 'center',
    },
    allowSkip: false,
  },
];