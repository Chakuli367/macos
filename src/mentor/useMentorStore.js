import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { driver } from 'driver.js';

// ✅ Inject Driver CSS inline with PROPER pointer events
const injectDriverCSS = () => {
  const styleId = 'driver-inline-css';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .driver-overlay {
      background: rgba(0, 0, 0, 0.75) !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 999998 !important;
      pointer-events: none !important;
    }
    
    #driver-highlighted-element-stage,
    .driver-highlighted-element-stage {
      position: absolute !important;
      z-index: 999999 !important;
      background: transparent !important;
      outline: 4px solid rgba(168, 85, 247, 0.8) !important;
      outline-offset: 2px !important;
      border-radius: 8px !important;
      pointer-events: auto !important;
      box-shadow: 
        0 0 0 4px rgba(168, 85, 247, 0.4),
        0 0 0 5000px rgba(0, 0, 0, 0.75) !important;
    }
    
    .driver-popover {
      background: linear-gradient(135deg, #7c3aed, #a855f7) !important;
      color: white !important;
      padding: 20px !important;
      border-radius: 12px !important;
      z-index: 10000000 !important;
      pointer-events: auto !important;
      position: fixed !important;
      min-width: 300px !important;
      max-width: 400px !important;
    }
    
    .driver-popover-title {
      color: #fde047 !important;
      font-weight: bold !important;
      margin-bottom: 8px !important;
      font-size: 18px !important;
    }
    
    .driver-popover-description {
      color: #f5f3ff !important;
      line-height: 1.5 !important;
      margin-bottom: 12px !important;
    }
    
    .driver-popover-footer {
      display: flex !important;
      gap: 8px !important;
      justify-content: flex-end !important;
      margin-top: 12px !important;
    }
    
    .driver-popover-next-btn {
      background: linear-gradient(135deg, #10b981, #059669) !important;
      color: white !important;
      border: none !important;
      padding: 10px 20px !important;
      border-radius: 8px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      pointer-events: auto !important;
      z-index: 10000001 !important;
      position: relative !important;
    }
    
    .driver-popover-next-btn:hover {
      background: linear-gradient(135deg, #059669, #047857) !important;
      transform: scale(1.05) !important;
    }
    
    /* Make sure Driver overlay doesn't block buttons */
    #driver-popover-item,
    .driver-popover-item {
      pointer-events: auto !important;
      z-index: 10000000 !important;
    }
    
    /* Fix the overlay path to not block */
    svg path {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
  console.log('✅ Driver CSS injected');
};

// ✅ Remove Driver CSS
const removeDriverCSS = () => {
  const styleId = 'driver-inline-css';
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
    console.log('✅ Driver CSS removed');
  }
};

// ✅ Force remove ALL Driver.js elements from DOM
const forceRemoveDriverElements = () => {
  // Remove all driver-related elements
  const selectors = [
    '.driver-overlay',
    '.driver-popover',
    '.driver-popover-item',
    '#driver-popover-item',
    '.driver-highlighted-element-stage',
    '#driver-highlighted-element-stage',
    '[class*="driver-"]',
    '[id*="driver-"]'
  ];
  
  selectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
        console.log('🗑️ Removed element:', selector);
      });
    } catch (e) {
      console.log('⚠️ Could not remove:', selector, e);
    }
  });
  
  console.log('✅ All Driver.js elements force-removed');
};


export const useMentorStore = create(
  persist(
    (set, get) => ({
      active: false,
      stepIndex: 0,
      script: [],
      target: null,
      waiting: false,
      currentDriver: null,
      modalCloseObserver: null,
      modalCloseInterval: null,
      modalStates: {}, // ✅ Track modal states from React
      
      // 🆕 SUB-TOUR SUPPORT
      mainScript: [], // Store the main script
      subTourStack: [], // Stack to track nested sub-tours
      isInSubTour: false,

      startJourney: (script) => {
        console.log('🎯 useMentorStore.startJourney called');
        console.log('📜 Script:', script);
        
        set({ 
          active: true, 
          stepIndex: 0, 
          script, 
          mainScript: script, // Store the main script
          target: script[0]?.target || null,
          waiting: false,
          modalCloseObserver: null,
          modalCloseInterval: null,
          subTourStack: [],
          isInSubTour: false,
        });
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          get().showCurrentStep();
        }, 100);
      },

      // 🆕 Start a sub-tour
      startSubTour: (subScript, returnToStep) => {
        console.log('🎯 Starting sub-tour!', { subScript, returnToStep });
        
        const { script, stepIndex } = get();
        
        // Push current state onto stack
        set({ 
          subTourStack: [...get().subTourStack, { 
            script, 
            stepIndex: returnToStep 
          }],
          script: subScript,
          stepIndex: 0,
          isInSubTour: true,
          target: subScript[0]?.target || null,
        });
        
        // Start showing the sub-tour
        setTimeout(() => {
          get().showCurrentStep();
        }, 300);
      },

      // 🆕 End sub-tour and return to main tour
      endSubTour: () => {
        console.log('🔙 Ending sub-tour, returning to main tour');
        
        const { subTourStack } = get();
        
        if (subTourStack.length === 0) {
          console.log('⚠️ No sub-tour to end, continuing normally');
          return;
        }
        
        // Pop the previous state
        const previousState = subTourStack[subTourStack.length - 1];
        const newStack = subTourStack.slice(0, -1);
        
        set({
          script: previousState.script,
          stepIndex: previousState.stepIndex,
          subTourStack: newStack,
          isInSubTour: newStack.length > 0,
          target: previousState.script[previousState.stepIndex]?.target || null,
        });
        
        // Continue with the next step in the main tour
        setTimeout(() => {
          get().nextStep();
        }, 300);
      },

      // ✅ Update modal states from React
      setModalStates: (states) => {
        console.log('📊 Modal states updated:', states);
        set({ modalStates: states });
      },

      // ✅ FIXED: Step index setter that accepts both number and function
      setStepIndex: (newIndexOrFunction) => {
        const currentIndex = get().stepIndex;
        
        // Determine new index
        let newIndex;
        if (typeof newIndexOrFunction === 'function') {
          // It's a function updater like: setStepIndex(prev => prev + 1)
          newIndex = newIndexOrFunction(currentIndex);
        } else {
          // It's a direct value like: setStepIndex(5)
          newIndex = newIndexOrFunction;
        }
        
        console.log(`🔄 setStepIndex called: ${currentIndex} → ${newIndex}`);
        
        // Validation
        if (typeof newIndex !== 'number') {
          console.error('❌ setStepIndex: Invalid index type:', typeof newIndex, newIndex);
          return;
        }
        
        if (isNaN(newIndex)) {
          console.error('❌ setStepIndex: Index is NaN');
          return;
        }
        
        // Update the step index
        set({ stepIndex: newIndex });
        console.log('✅ Step index updated to:', newIndex);
      },


      showCurrentStep: () => {
        const { stepIndex, script, modalStates } = get();
        
        if (stepIndex >= script.length) {
          console.log('🎓 Journey/Sub-tour complete');
          
          // 🆕 Check if we're in a sub-tour
          if (get().isInSubTour) {
            get().endSubTour();
            return;
          }
          
          get().stop();
          return;
        }

        const step = script[stepIndex];
        console.log(`🎬 Showing step ${stepIndex}:`, step);

        // ✅ PAUSE FOR MODAL
        if (step.pauseForModal) {
          console.log('⏸️ Pausing - waiting for modal to close:', step.pauseForModal);
          set({ waiting: true });
          get().waitForModalClose(step.pauseForModal);
          return;
        }

        // ✅ SHOW AFTER MODAL CLOSE
        if (step.showAfterModalClose) {
          console.log('⏸️ This step should show after modal close:', step.showAfterModalClose);
          // Don't show yet - the waitForModalClose handler will find this step
          return;
        }

        // ✅ WAIT FOR MODAL TO OPEN
        if (step.waitForModalOpen) {
          console.log('⏳ Waiting for modal to open:', step.waitForModalOpen);
          set({ waiting: true });
          get().waitForModalOpen(step.waitForModalOpen, step.customEventToWaitFor);
          return;
        }

        // ✅ TRIGGER SUB-TOUR
        if (step.triggerSubTour) {
          console.log('🎯 Triggering sub-tour:', step.triggerSubTour);
          set({ waiting: true });
          get().triggerSubTour(step.triggerSubTour, stepIndex + 1);
          return;
        }

        // ✅ NORMAL STEP
        if (!step.target) {
          console.log('⏩ No target - skipping to next step');
          get().nextStep();
          return;
        }

        // ✅ Try to find the element
        let element = null;
        let attempts = 0;
        const maxAttempts = 20;

        const tryFind = () => {
          attempts++;
          
          try {
            element = document.querySelector(step.target);
          } catch (e) {
            console.warn(`⚠️ Invalid selector: ${step.target}`, e);
          }

          if (element) {
            console.log(`✅ Found element on attempt ${attempts}:`, element);

            // ✅ Scroll element into view
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'center' 
            });

            // ✅ Inject CSS before creating driver
            injectDriverCSS();

            setTimeout(() => {
              const driverObj = driver({
                showProgress: false,
                showButtons: ['next'],
                nextBtnText: step.nextBtnText || 'Got it →',
                prevBtnText: '',
                doneBtnText: '',
                onDestroyStarted: () => {
                  console.log('🧹 Driver destroy started');
                  driverObj.destroy();
                  set({ currentDriver: null });
                  
                  // ✅ Move to next step AFTER driver is destroyed
                  setTimeout(() => {
                    get().nextStep();
                  }, 100);
                },
                steps: [{
                  element: step.target,
                  popover: {
                    title: step.title,
                    description: step.description,
                    side: step.side || 'bottom',
                    align: step.align || 'center',
                  }
                }]
              });

              set({ currentDriver: driverObj });
              driverObj.drive();
              
            }, step.delay || 500);

          } else if (attempts < maxAttempts) {
            console.log(`⏳ Attempt ${attempts}/${maxAttempts} - element not found yet:`, step.target);
            setTimeout(tryFind, 200);
          } else {
            console.log(`❌ Element not found after ${maxAttempts} attempts:`, step.target);
            console.log('⏩ Skipping to next step');
            get().nextStep();
          }
        };

        tryFind();
      },

      // ✅ Trigger a sub-tour based on name
      triggerSubTour: (subTourName, returnToStep) => {
        console.log('🎯 Attempting to trigger sub-tour:', subTourName);
        
        // Define available sub-tours here
        const subTours = {
          'dashboard-create-goal': [
            {
              target: '[data-tour="create-goal-button"]',
              title: '📝 Create Your First Goal',
              description: 'Click here to create your first goal!',
              nextBtnText: 'Show me →',
              delay: 300,
            },
            // Add more steps as needed
          ],
        };

        const subTourScript = subTours[subTourName];
        
        if (!subTourScript) {
          console.error('❌ Sub-tour not found:', subTourName);
          set({ waiting: false });
          get().nextStep();
          return;
        }

        // Wait a bit to ensure any modals/transitions are done
        setTimeout(() => {
          set({ waiting: false });
          get().startSubTour(subTourScript, returnToStep);
        }, 500);
      },

      // ✅ Enhanced sub-tour trigger with timeout
      triggerSubTourWithTimeout: (subTourName, returnToStep, timeoutMs = 5000) => {
        console.log('🎯 Triggering sub-tour with timeout:', { subTourName, timeoutMs });
        
        set({ waiting: true });
        
        // Set a timeout to force-resume if sub-tour doesn't start
        setTimeout(() => {
          if (get().waiting) {
            console.log('⏰ Sub-tour timeout - forcing resume');
            set({ waiting: false });
            get().startSubTour(subTourScript, returnToStep);
          }
        }, timeoutMs);
      },

      // ✅ Wait for modal to OPEN, then show the next step (which should be inside the modal)
waitForModalOpen: (modalStateName, customEventToWaitFor) => {
  console.log('👁️  Waiting for modal to open:', modalStateName);
  
  const checkModalOpened = () => {
    const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/60, .fixed.inset-0[class*="bg-black/60"]');
    const modalContent = document.querySelector('.fixed.inset-0.bg-black\\/60 > div');
    
    if (modals.length > 0 && modalContent) {
      console.log('✅ Modal opened!');
      set({ waiting: false });
      
      // ⭐ If we need to wait for a custom event (inline tour), set up listener
      if (customEventToWaitFor) {
        console.log('⏳ Waiting for custom event:', customEventToWaitFor);
        
        const eventHandler = (event) => {
          console.log('✅ Custom event received:', customEventToWaitFor);
          window.removeEventListener(customEventToWaitFor, eventHandler);
          
          // Now start watching for modal close
          setTimeout(() => {
            get().waitForModalClose(modalStateName);
          }, 500);
        };
        
        window.addEventListener(customEventToWaitFor, eventHandler);
        
        // Timeout fallback (if user has already seen tour)
        setTimeout(() => {
          window.removeEventListener(customEventToWaitFor, eventHandler);
          console.log('⏰ Custom event timeout - continuing anyway');
          get().waitForModalClose(modalStateName);
        }, 1000); // Short timeout since tour might be skipped
        
      } else {
        // Normal flow - no custom event to wait for
        setTimeout(() => {
          get().nextStep();
          
          setTimeout(() => {
            get().waitForModalClose(modalStateName);
          }, 800);
        }, 500);
      }
      
      return true;
    }
    
    return false;
  };
  
  // Check immediately
  if (checkModalOpened()) return;
  
  // Set up observer to watch for modal appearing
  const observer = new MutationObserver(() => {
    if (checkModalOpened()) {
      observer.disconnect();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Fallback timeout (5 seconds)
  setTimeout(() => {
    observer.disconnect();
    if (get().waiting) {
      console.log('⏰ Modal open timeout - forcing resume');
      set({ waiting: false });
      get().nextStep();
    }
  }, 5000);
},

      // ✅ Wait for modal to close using setInterval
      waitForModalClose: (modalStateName) => {
        console.log('🔵 Starting modal close watcher for:', modalStateName);
        
        // Check if modal is actually open RIGHT NOW before starting the watcher
        const modalsNow = document.querySelectorAll('.fixed.inset-0[class*="bg-black"]');
        let wasOpen = modalsNow.length > 0;
        
        console.log(`🔵 Initial state: ${wasOpen ? 'OPEN' : 'CLOSED'}`);
        
        if (!wasOpen) {
          console.log('🔵 ⚠️  Modal already closed, not starting watcher');
          return;
        }
        
        let checkCount = 0;
        
        // Use setInterval for more reliable checking
        const checkInterval = setInterval(() => {
          checkCount++;
          const modals = document.querySelectorAll('.fixed.inset-0[class*="bg-black"]');
          const isOpen = modals.length > 0;
          
          console.log(`🔵 Check #${checkCount}: Modals = ${modals.length}, wasOpen = ${wasOpen}, isOpen = ${isOpen}`);
          
          // Detect transition from open to closed
          if (wasOpen && !isOpen) {
            console.log('🔵 ✅✅✅ MODAL CLOSED! ✅✅✅');
            clearInterval(checkInterval);
            
            // Find and show the next step
            setTimeout(() => {
              const { stepIndex, script } = get();
              
              console.log('🔵 Current step index:', stepIndex);
              console.log('🔵 Looking for showAfterModalClose:', modalStateName);
              
              // Search for the step that should show after modal close
              for (let i = stepIndex + 1; i < script.length; i++) {
                const step = script[i];
                console.log(`🔵 Step ${i}:`, {
                  showAfterModalClose: step.showAfterModalClose,
                  matches: step.showAfterModalClose === modalStateName
                });
                
                if (step.showAfterModalClose === modalStateName) {
                  console.log('🔵 ✅ FOUND IT! Advancing to step', i);
                  set({ 
                    stepIndex: i, 
                    target: step.target,
                    waiting: false,
                    modalCloseInterval: null
                  });
                  get().showCurrentStep();
                  return;
                }
              }
              
              console.log('🔵 No matching step found, advancing normally');
              set({ waiting: false, modalCloseInterval: null });
              get().nextStep();
            }, 400);
          }
          
          wasOpen = isOpen;
        }, 300); // Check every 300ms
        
        // Store interval ID for cleanup
        set({ modalCloseInterval: checkInterval });
        
        // Cleanup after 30 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log('🔵 Timeout - stopping modal watcher');
          set({ modalCloseInterval: null });
        }, 30000);
      },

      nextStep: () => {
        const { stepIndex, script } = get();
        const currentStep = script[stepIndex];

        // ✅ BLOCK if current step requires modal to be closed
        if (currentStep?.requireModalClose && currentStep?.pauseForModal) {
          const modals = document.querySelectorAll('.fixed.inset-0[class*="bg-black"]');
          if (modals.length > 0) {
            console.log('🚫 BLOCKED: Modal must be closed before advancing!');
            return; // Don't advance!
          }
        }

        const nextIndex = stepIndex + 1;

        console.log(`➡️  Moving from step ${stepIndex} to ${nextIndex}`);

        if (nextIndex >= script.length) {
          console.log('🎓 Script complete');
          
          // 🆕 Check if we're in a sub-tour
          if (get().isInSubTour) {
            get().endSubTour();
            return;
          }
          
          get().stop();
          return;
        }

        set({ stepIndex: nextIndex, target: script[nextIndex].target });
        get().showCurrentStep();
      },

      stop: () => {
        console.log('🛑 Stopping mentor journey');
        const { currentDriver, modalCloseObserver, modalCloseInterval } = get();
        
        // ✅ Destroy current driver instance
        if (currentDriver) {
          try {
            currentDriver.destroy();
            console.log('✅ Driver instance destroyed');
          } catch (e) {
            console.log('⚠️  Error destroying driver on stop:', e);
          }
        }
        
        // ✅ Disconnect modal observers
        if (modalCloseObserver) {
          modalCloseObserver.disconnect();
          console.log('✅ Modal observer disconnected');
        }
        
        // ✅ Clear modal close interval
        if (modalCloseInterval) {
          clearInterval(modalCloseInterval);
          console.log('✅ Modal close interval cleared');
        }
        
        // ✅ Remove Driver CSS from DOM
        removeDriverCSS();
        
        // ✅ Force remove any lingering Driver.js elements
        forceRemoveDriverElements();
        
        // ✅ Reset all state
        set({ 
          active: false, 
          stepIndex: 0, 
          script: [], 
          mainScript: [],
          target: null, 
          waiting: false,
          currentDriver: null,
          modalCloseObserver: null,
          modalCloseInterval: null,
          modalStates: {},
          subTourStack: [],
          isInSubTour: false,
        });
        
        console.log('✅ Mentor journey completely stopped and cleaned up');
      },

      // ✅ Manual signal (kept for backwards compatibility)
      sendSignal: () => {
        const { waiting } = get();
        if (waiting) {
          console.log('✅ Manual signal received');
          set({ waiting: false });
          get().nextStep();
        }
      },
    }),
    {
      name: 'mentor-storage',
    }
  )
);