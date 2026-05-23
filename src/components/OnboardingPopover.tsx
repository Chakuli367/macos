// src/components/OnboardingPopover.tsx
import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, Button, LinearProgress } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useOnboardingContext } from '../contexts/OnboardingContext';
import { onboardingSteps } from '../config/onboardingSteps';
import { useOnboarding } from '../hooks/useOnboarding';
import ReactDOM from 'react-dom';

export const OnboardingPopover: React.FC = () => {
  // Call the hook to set up the onboarding logic
  useOnboarding();
  
  const { 
    isActive, 
    currentStep, 
    setCurrentStep, 
    completeOnboarding,
    actionCompleted,
    skipOnboarding 
  } = useOnboardingContext();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  // Calculate popover position
  useEffect(() => {
    if (!isActive || !step) return;

    if (step.popover.side === 'center') {
      setIsVisible(true);
      return;
    }

    if (step.element) {
      const updatePosition = () => {
        const element = document.querySelector(step.element!);
        if (element) {
          const rect = element.getBoundingClientRect();
          const popoverWidth = 320;
          const popoverHeight = 250;
          const offset = 16;

          let top = 0;
          let left = 0;

          switch (step.popover.side) {
            case 'top':
              top = rect.top - popoverHeight - offset;
              left = rect.left + rect.width / 2 - popoverWidth / 2;
              break;
            case 'bottom':
              top = rect.bottom + offset;
              left = rect.left + rect.width / 2 - popoverWidth / 2;
              break;
            case 'left':
              top = rect.top + rect.height / 2 - popoverHeight / 2;
              left = rect.left - popoverWidth - offset;
              break;
            case 'right':
              top = rect.top + rect.height / 2 - popoverHeight / 2;
              left = rect.right + offset;
              break;
          }

          // Ensure popover stays within viewport
          const padding = 16;
          top = Math.max(padding, Math.min(top, window.innerHeight - popoverHeight - padding));
          left = Math.max(padding, Math.min(left, window.innerWidth - popoverWidth - padding));

          setPosition({ top, left });
          setIsVisible(true);
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isActive, currentStep, step]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive || !step || !isVisible) return null;

  const isCentered = step.popover.side === 'center';
  const hasRequiredAction = !!step.requiredAction;
  const canProceed = !hasRequiredAction || actionCompleted;

  const popoverContent = (
    <>
      {/* Backdrop overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 99998,
          pointerEvents: 'none',
        }}
      />

      {/* Popover */}
      <Paper
        className="onboarding-popover"
        elevation={8}
        sx={{
          position: 'fixed',
          width: isCentered ? '90%' : '320px',
          maxWidth: isCentered ? '500px' : '320px',
          maxHeight: '80vh',
          overflowY: 'auto',
          top: isCentered ? '50%' : `${Math.max(20, position.top - 100)}px`,
          left: isCentered ? '50%' : `${position.left}px`,
          transform: isCentered ? 'translate(-50%, -50%)' : 'none',
          zIndex: 99999,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(36, 0, 70, 0.98), rgba(51, 0, 102, 0.98))',
          border: '2px solid rgba(251, 191, 36, 0.6)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 60px rgba(251, 191, 36, 0.3)',
          animation: 'onboardingFadeIn 0.3s ease-in',
        }}
      >
        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 4,
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#fbbf24',
            }
          }}
        />

        <Box p={3}>
          {/* Close button - only show if skip is allowed */}
          {step.allowSkip !== false && (
            <Button
              onClick={skipOnboarding}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 'auto',
                color: 'rgba(233, 213, 255, 0.6)',
                zIndex: 1,
              }}
            >
              <Close />
            </Button>
          )}

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              color: '#fbbf24',
              fontWeight: 700,
              mb: 1.5,
              pr: step.allowSkip !== false ? 4 : 0,
            }}
          >
            {step.popover.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(233, 213, 255, 0.9)',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {step.popover.description}
          </Typography>

          {/* Required Action Indicator */}
          {hasRequiredAction && !actionCompleted && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#fbbf24',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                ⚡ Action Required - Follow the instruction above
              </Typography>
            </Box>
          )}

          {/* Action Completed Indicator */}
          {hasRequiredAction && actionCompleted && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#22c55e',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                ✓ Great job! Moving to next step...
              </Typography>
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box display="flex" gap={1} justifyContent="space-between" mt={2}>
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              sx={{
                color: 'rgba(233, 213, 255, 0.6)',
                '&:disabled': {
                  color: 'rgba(233, 213, 255, 0.3)',
                }
              }}
            >
              Back
            </Button>

            <Box display="flex" gap={1} alignItems="center">
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(233, 213, 255, 0.6)',
                }}
              >
                {currentStep + 1} / {onboardingSteps.length}
              </Typography>

              {/* Next button - only show if no required action */}
              {!hasRequiredAction && (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={!canProceed}
                  sx={{
                    backgroundColor: '#fbbf24',
                    color: '#240046',
                    fontWeight: 700,
                    '&:hover': {
                      backgroundColor: '#f59e0b',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(251, 191, 36, 0.3)',
                      color: 'rgba(36, 0, 70, 0.5)',
                    }
                  }}
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Add animations */}
      <style>
        {`
          @keyframes onboardingFadeIn {
            from {
              opacity: 0;
              transform: ${isCentered ? 'translate(-50%, -45%) scale(0.9)' : 'scale(0.9)'};
            }
            to {
              opacity: 1;
              transform: ${isCentered ? 'translate(-50%, -50%) scale(1)' : 'scale(1)'};
            }
          }
        `}
      </style>
    </>
  );

  // Render to body using portal to ensure it's on top of everything
  return ReactDOM.createPortal(popoverContent, document.body);
};