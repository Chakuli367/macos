import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

type OnboardingExplanationProps = {
  title: string;
  description: string;
};

export function OnboardingExplanation({ title, description }: OnboardingExplanationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const hasShownRef = useRef(false);

  console.log('🎯 OnboardingExplanation RENDER', {
    title,
    show,
    hasShown: hasShownRef.current,
    searchParams: searchParams.toString(),
    onboardingParam: searchParams.get('onboarding'),
    fullURL: window.location.href
  });

  useEffect(() => {
    console.log('⚡ useEffect FIRED', {
      onboardingParam: searchParams.get('onboarding'),
      hasShown: hasShownRef.current,
      currentShow: show
    });

    const onboardingParam = searchParams.get('onboarding');
    
    if (onboardingParam === 'true') {
      console.log('✅ ONBOARDING=TRUE DETECTED!');
      
      if (!hasShownRef.current) {
        console.log('🎬 SHOWING EXPLANATION BOX');
        hasShownRef.current = true;
        setShow(true);
        
        // Remove the parameter immediately (clean URL)
        setTimeout(() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('onboarding');
          setSearchParams(newParams, { replace: true });
          console.log('🧹 URL CLEANED');
        }, 100);
        
        // Auto-hide after 5 seconds
        const hideTimer = setTimeout(() => {
          console.log('⏰ AUTO-HIDING after 5s');
          setShow(false);
        }, 5000);
        
        return () => {
          console.log('🧼 Cleanup timer');
          clearTimeout(hideTimer);
        };
      } else {
        console.log('⚠️ Already shown, skipping');
      }
    } else {
      console.log('❌ No onboarding param or not "true":', onboardingParam);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const handleOnboardingComplete = () => {
      console.log('🎉 onboardingComplete event received');
      setShow(false);
      hasShownRef.current = true;
    };

    window.addEventListener('onboardingComplete', handleOnboardingComplete);
    return () => window.removeEventListener('onboardingComplete', handleOnboardingComplete);
  }, []);

  console.log('🚦 RENDER DECISION:', show ? 'SHOWING BOX' : 'HIDING (returning null)');

  if (!show) {
    return null;
  }

  console.log('✨ RENDERING EXPLANATION BOX NOW!');

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