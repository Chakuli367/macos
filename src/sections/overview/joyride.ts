// ShepherdTourStyled.tsx
import React from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export const runStyledOverviewTour = () => {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      scrollTo: { behavior: 'smooth', block: 'center' },
      classes: 'bg-gradient-to-br from-purple-900/90 to-indigo-900/90 text-purple-100 rounded-2xl shadow-2xl p-6 border-2 border-purple-500',
      arrow: true,
      cancelIcon: {
        enabled: true,
        classes: 'text-purple-300 hover:text-purple-100'
      },
    },
    useModalOverlay: true
  });

  const stepButtons = (backText = 'Back', nextText = 'Next') => [
    { 
      text: backText, 
      classes: 'bg-purple-700/70 text-white font-bold rounded-lg px-4 py-2 hover:bg-purple-700/90 transition-all', 
      action: tour.back 
    },
    { 
      text: nextText, 
      classes: 'bg-purple-500/80 text-white font-bold rounded-lg px-4 py-2 hover:bg-purple-500/100 transition-all', 
      action: tour.next 
    }
  ];

  tour.addStep({
    id: 'welcome',
    text: `Welcome to GoalGrid! This is where your journey begins.`,
    attachTo: { element: '.overview-welcome-header', on: 'bottom' },
    buttons: [{ 
      text: 'Next', 
      classes: 'bg-purple-500/80 text-white font-bold rounded-lg px-4 py-2 hover:bg-purple-500/100 transition-all', 
      action: tour.next 
    }]
  });

  tour.addStep({
    id: 'lesson-hero',
    text: `This is your daily lesson area. Click "Start Lesson" to dive in.`,
    attachTo: { element: '.today-lesson-hero', on: 'bottom' },
    buttons: stepButtons()
  });

  tour.addStep({
    id: 'transformation-slider',
    text: `Transformation stories show real progress. Drag the slider to see Before vs After.`,
    attachTo: { element: '.transformation-slider', on: 'top' },
    buttons: stepButtons()
  });

  tour.addStep({
    id: 'auth-buttons',
    text: `Sign in to sync your progress or sign out when done.`,
    attachTo: { element: '.auth-buttons', on: 'top' },
    buttons: stepButtons()
  });

  tour.addStep({
    id: 'components-grid',
    text: `Here’s your dashboard: track tasks, see progress, chat with the community, and more!`,
    attachTo: { element: '.components-grid', on: 'top' },
    buttons: [
      { 
        text: 'Back', 
        classes: 'bg-purple-700/70 text-white font-bold rounded-lg px-4 py-2 hover:bg-purple-700/90 transition-all', 
        action: tour.back 
      },
      { 
        text: 'Finish', 
        classes: 'bg-amber-400 text-purple-900 font-bold rounded-lg px-4 py-2 hover:bg-amber-300 transition-all', 
        action: tour.complete 
      }
    ]
  });

  tour.start();
};
