import { useEffect, useState } from 'react';

type OnboardingExplanationProps = {
  title: string;
  description: string;
};

export function OnboardingExplanation({ title, description }: OnboardingExplanationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show when navigated by onboarding
    const handleOnboardingNavigation = () => {
      setShow(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShow(false), 5000);
    };

    // Hide when onboarding completes
    const handleOnboardingComplete = () => {
      setShow(false);
    };

    window.addEventListener('onboardingNavigation', handleOnboardingNavigation);
    window.addEventListener('onboardingComplete', handleOnboardingComplete);
    
    return () => {
      window.removeEventListener('onboardingNavigation', handleOnboardingNavigation);
      window.removeEventListener('onboardingComplete', handleOnboardingComplete);
    };
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10001,
          pointerEvents: 'none',
        }}
      />
      
      {/* Explanation Box */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10002,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          padding: '32px',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeInScale 0.5s ease-out',
        }}
      >
        <style>
          {`
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}
        </style>
        <h2
          style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            lineHeight: '1.6',
            textAlign: 'center',
            margin: 0,
          }}
        >
          {description}
        </p>
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
          }}
        >
          Auto-advancing in 5 seconds...
        </div>
      </div>
    </>
  );
}