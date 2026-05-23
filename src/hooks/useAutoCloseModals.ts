// useAutoCloseModals.ts
// Hook to automatically close modals that don't have inner tour paths

import { useEffect, useRef } from 'react';

// ============================================================================
// CONFIGURATION - Edit these to control auto-close behavior
// ============================================================================

const AUTO_CLOSE_MODALS: { [key: string]: boolean } = {
  // Modals WITH inner tours (will NOT auto-close)
  showBreathing: false,
  showReframing: false,
  showDiscovery: false,
  showInteractionPlanner: false,
  showExposureHierarchy: false,
  showPrepKit: false,
  
  // Add NEW modals here and set to `true` to enable auto-close
  // Example:
  // showNewModal: true,  // Will auto-close after 3 seconds
};

const AUTO_CLOSE_DELAY = 3000; // 3 seconds

// ============================================================================
// TYPES
// ============================================================================

interface ModalStates {
  showBreathing: boolean;
  showReframing: boolean;
  showDiscovery: boolean;
  showInteractionPlanner: boolean;
  showExposureHierarchy: boolean;
  showPrepKit: boolean;
  [key: string]: boolean;
}

interface SetterFunctions {
  setShowBreathing: (value: boolean) => void;
  setShowReframing: (value: boolean) => void;
  setShowDiscovery: (value: boolean) => void;
  setShowInteractionPlanner: (value: boolean) => void;
  setShowExposureHierarchy: (value: boolean) => void;
  setShowPrepKit: (value: boolean) => void;
  [key: string]: (value: boolean) => void;
}

interface UseAutoCloseModalsProps {
  modalStates: ModalStates;
  setterFunctions: SetterFunctions;
  isTourActive: boolean;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook to automatically close modals that don't have inner tour content
 * 
 * @param modalStates - Object containing all modal state values
 * @param setterFunctions - Object containing all modal setter functions
 * @param isTourActive - Whether the tour is currently active
 * 
 * @example
 * useAutoCloseModals({
 *   modalStates: {
 *     showBreathing,
 *     showReframing,
 *     showDiscovery,
 *     // ... other modals
 *   },
 *   setterFunctions: {
 *     setShowBreathing,
 *     setShowReframing,
 *     setShowDiscovery,
 *     // ... other setters
 *   },
 *   isTourActive: tourIsRunning
 * });
 */
export const useAutoCloseModals = ({
  modalStates,
  setterFunctions,
  isTourActive,
}: UseAutoCloseModalsProps) => {
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const previousStates = useRef<ModalStates>({ ...modalStates });

  useEffect(() => {
    // Only run auto-close logic if tour is active
    if (!isTourActive) {
      // Clear any pending timeouts if tour stops
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = {};
      return;
    }

    // Check each modal state
    Object.keys(modalStates).forEach((modalKey) => {
      const isCurrentlyOpen = modalStates[modalKey];
      const wasPreviouslyOpen = previousStates.current[modalKey];
      const shouldAutoClose = AUTO_CLOSE_MODALS[modalKey] === true;

      // If modal just opened and should auto-close
      if (isCurrentlyOpen && !wasPreviouslyOpen && shouldAutoClose) {
        // Clear any existing timeout for this modal
        if (timeoutRefs.current[modalKey]) {
          clearTimeout(timeoutRefs.current[modalKey]);
        }

        // Set new timeout to auto-close
        timeoutRefs.current[modalKey] = setTimeout(() => {
          const setterFunction = setterFunctions[`set${modalKey.charAt(0).toUpperCase()}${modalKey.slice(1)}`];
          if (setterFunction) {
            setterFunction(false);
          }
          delete timeoutRefs.current[modalKey];
        }, AUTO_CLOSE_DELAY);
      }

      // If modal was manually closed, clear its timeout
      if (!isCurrentlyOpen && wasPreviouslyOpen && timeoutRefs.current[modalKey]) {
        clearTimeout(timeoutRefs.current[modalKey]);
        delete timeoutRefs.current[modalKey];
      }
    });

    // Update previous states
    previousStates.current = { ...modalStates };

    // Cleanup function
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [modalStates, setterFunctions, isTourActive]);
};

/**
 * Alternative simpler version that takes individual modal states
 * Use this if you prefer not to pass objects
 */
export const useAutoCloseModal = (
  modalKey: string,
  isOpen: boolean,
  setIsOpen: (value: boolean) => void,
  isTourActive: boolean
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousOpen = useRef(isOpen);

  useEffect(() => {
    if (!isTourActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const shouldAutoClose = AUTO_CLOSE_MODALS[modalKey] === true;

    // If modal just opened and should auto-close
    if (isOpen && !previousOpen.current && shouldAutoClose) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to auto-close
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        timeoutRef.current = null;
      }, AUTO_CLOSE_DELAY);
    }

    // If modal was manually closed, clear timeout
    if (!isOpen && previousOpen.current && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    previousOpen.current = isOpen;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, setIsOpen, modalKey, isTourActive]);
};