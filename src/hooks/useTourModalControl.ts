// useTourModalControl.ts - COMPLETE FIXED VERSION
import { useEffect, useRef } from 'react';
import { useMentorStore } from 'src/store/useMentorStore';

interface ModalStates {
  [key: string]: boolean;
}

interface TourStep {
  target: string;
  text: string;
  pauseForModal?: string;
  requireModalClose?: boolean;
  onModalContent?: boolean;
  showAfterModalClose?: string;
  [key: string]: any;
}

interface UseTourModalControlProps {
  currentStepIndex: number;
  tourSteps: TourStep[];
  modalStates: ModalStates;
  isTourActive: boolean;
}

/**
 * Hook to control tour progression based on modal open/close state
 * Prevents advancing to next step until required modals are closed
 */
export const useTourModalControl = ({
  currentStepIndex,
  tourSteps,
  modalStates,
  isTourActive,
}: UseTourModalControlProps) => {
  const previousModalStates = useRef<ModalStates>({ ...modalStates });
  const blockedStepIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!isTourActive) {
      blockedStepIndex.current = null;
      return;
    }

    const currentStep = tourSteps[currentStepIndex];
    if (!currentStep) return;

    // Check if current step requires modal to be closed before proceeding
    if (currentStep.requireModalClose && currentStep.pauseForModal) {
      const modalKey = currentStep.pauseForModal;
      const isModalCurrentlyOpen = modalStates[modalKey];

      // Block progression if modal is open
      if (isModalCurrentlyOpen) {
        blockedStepIndex.current = currentStepIndex;
      }
    }

    // Check if a modal just closed
    Object.keys(modalStates).forEach((modalKey) => {
      const wasOpen = previousModalStates.current[modalKey];
      const isOpen = modalStates[modalKey];

      // Modal just closed
      if (wasOpen && !isOpen) {
        // Find the next step that should show after this modal closes
        const nextStepIndex = findNextStepAfterModalClose(
          currentStepIndex,
          tourSteps,
          modalKey
        );

        if (nextStepIndex !== null && blockedStepIndex.current !== null) {
          // Unblock and move to next appropriate step
          blockedStepIndex.current = null;
          
          // ✅ Set step index and show step using store
          useMentorStore.setState({ stepIndex: nextStepIndex });
          useMentorStore.getState().showCurrentStep();
        }
      }
    });

    // Update previous states
    previousModalStates.current = { ...modalStates };
  }, [currentStepIndex, tourSteps, modalStates, isTourActive]);

  return {
    isBlocked: blockedStepIndex.current !== null,
    blockedAtStep: blockedStepIndex.current,
  };
};

/**
 * Find the next step that should be shown after a modal closes
 */
function findNextStepAfterModalClose(
  currentIndex: number,
  steps: TourStep[],
  closedModalKey: string
): number | null {
  for (let i = currentIndex + 1; i < steps.length; i++) {
    const step = steps[i];
    
    if (step.showAfterModalClose === closedModalKey) {
      return i;
    }
    
    if (step.pauseForModal && step.requireModalClose) {
      break;
    }
  }

  return currentIndex + 1 < steps.length ? currentIndex + 1 : null;
}

/**
 * Helper hook to determine if a step should be shown based on modal state
 */
export const useShouldShowStep = (
  step: TourStep,
  modalStates: ModalStates
): boolean => {
  if (step.showAfterModalClose) {
    const modalKey = step.showAfterModalClose;
    return !modalStates[modalKey];
  }

  if (step.onModalContent && step.pauseForModal) {
    const modalKey = step.pauseForModal;
    return modalStates[modalKey] === true;
  }

  return true;
};

/**
 * Hook to automatically skip steps that shouldn't be shown
 * based on current modal states
 */
export const useSkipHiddenSteps = (
  currentStepIndex: number,
  tourSteps: TourStep[],
  modalStates: ModalStates,
  isTourActive: boolean
) => {
  useEffect(() => {
    if (!isTourActive) return;

    const currentStep = tourSteps[currentStepIndex];
    if (!currentStep) return;

    const shouldShow = useShouldShowStep(currentStep, modalStates);

    if (!shouldShow) {
      // Find next step that should be shown
      let nextIndex = currentStepIndex + 1;
      while (nextIndex < tourSteps.length) {
        const nextStep = tourSteps[nextIndex];
        if (useShouldShowStep(nextStep, modalStates)) {
          // ✅ Set step index and show step using store
          useMentorStore.setState({ stepIndex: nextIndex });
          useMentorStore.getState().showCurrentStep();
          return;
        }
        nextIndex++;
      }
    }
  }, [currentStepIndex, tourSteps, modalStates, isTourActive]);
};