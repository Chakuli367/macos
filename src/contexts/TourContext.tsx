// src/contexts/TourContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

interface TourContextType {
  startMainTour: () => void;
  startMiniTour: (tourName: string, steps: DriveStep[]) => void;
  registerMiniTour: (name: string, steps: DriveStep[]) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [miniTours, setMiniTours] = useState<Record<string, DriveStep[]>>({});

  const registerMiniTour = (name: string, steps: DriveStep[]) => {
    setMiniTours(prev => ({ ...prev, [name]: steps }));
  };

  const startMiniTour = (tourName: string, steps?: DriveStep[]) => {
    const tourSteps = steps || miniTours[tourName];
    if (!tourSteps) return;

    const miniDriver = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: tourSteps,
      popoverClass: 'driverjs-theme-purple',
      onDestroyStarted: () => {
        miniDriver.destroy();
      }
    });

    setTimeout(() => miniDriver.drive(), 300);
  };

  const startMainTour = () => {
    const mainDriver = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      popoverClass: 'driverjs-theme-purple',
      steps: [
        {
          element: '[data-tour="user-stats"]',
          popover: {
            title: '👋 Welcome to Community!',
            description: 'Here you can see your profile stats - XP, streak, and friends count.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="find-friends-btn"]',
          popover: {
            title: '🔍 Find Friends',
            description: 'Click here to search and add new friends!',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="discover-btn"]',
          popover: {
            title: '🌟 Discover Community',
            description: 'Explore other users in the community.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="groups-section"]',
          popover: {
            title: '👥 Groups Feature',
            description: 'Join or create groups! Click "Start Groups Tour" to learn more.',
            side: 'top',
            align: 'start',
            onNextClick: () => {
              mainDriver.destroy();
              // Trigger mini tour for groups
              setTimeout(() => startMiniTour('groupsTour'), 500);
            }
          }
        },
      ],
      onDestroyStarted: () => {
        mainDriver.destroy();
        localStorage.setItem('mainTourCompleted', 'true');
      }
    });

    setTimeout(() => mainDriver.drive(), 500);
  };

  return (
    <TourContext.Provider value={{ startMainTour, startMiniTour, registerMiniTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
};