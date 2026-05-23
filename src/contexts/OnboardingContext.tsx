// src/contexts/OnboardingContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  actionCompleted: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  setCurrentStep: (step: number) => void;
  setActionCompleted: (completed: boolean) => void;
  skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    
    // Auto-start onboarding for new users
    if (!hasCompletedOnboarding) {
      // Small delay to let the app render first
      setTimeout(() => {
        setIsActive(true);
      }, 1000);
    }
  }, []);

  const startOnboarding = () => {
    setCurrentStep(0);
    setActionCompleted(false);
    setIsActive(true);
    localStorage.removeItem('onboarding_completed');
  };

  const completeOnboarding = () => {
    setIsActive(false);
    setCurrentStep(0);
    setActionCompleted(false);
    localStorage.setItem('onboarding_completed', 'true');
    
    // Track completion in analytics
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track('Onboarding Completed');
    }
  };

  const skipOnboarding = () => {
    setIsActive(false);
    setCurrentStep(0);
    setActionCompleted(false);
    localStorage.setItem('onboarding_completed', 'true');
    
    // Track skip in analytics
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track('Onboarding Skipped', { step: currentStep });
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        actionCompleted,
        startOnboarding,
        completeOnboarding,
        setCurrentStep,
        setActionCompleted,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
};