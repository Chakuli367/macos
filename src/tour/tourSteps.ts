import type { Tour } from 'nextstepjs';

export const tourSteps: Tour[] = [
  {
    tour: 'mainTour',
    steps: [
      {
        icon: <>👋</>,
        title: 'Welcome to Community!',
        content: <>
          Here you can see your profile stats - XP, streak, and friends count.
          This is your home base for tracking your progress!
        </>,
        selector: '#user-stats',
        side: 'bottom',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>🔍</>,
        title: 'Find Friends',
        content: <>
          Click here to search and add new friends to your network.
          Build connections with people who share your goals!
        </>,
        selector: '#find-friends-btn',
        side: 'bottom',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>🌟</>,
        title: 'Discover Community',
        content: <>
          Explore and connect with other users in the community.
          Find people with similar interests and goals!
        </>,
        selector: '#discover-btn',
        side: 'bottom',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>✍️</>,
        title: 'Share Your Journey',
        content: <>
          Use this button to share your progress, wins, and thoughts.
          Your story can inspire others in the community!
        </>,
        selector: '#create-post-btn',
        side: 'left',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
    ],
  },
];