import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      z-index: 1000000 !important;
      pointer-events: auto !important;
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
    }
    
    .driver-popover-next-btn:hover {
      background: linear-gradient(135deg, #059669, #047857) !important;
      transform: scale(1.05) !important;
    }
  `;
  document.head.appendChild(style);
  console.log('✅ Driver CSS injected');
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

      startJourney: (script) => {
        console.log('🎯 useMentorStore.startJourney called');
        console.log('📜 Script:', script);
        
        set({ 
          active: true, 
          stepIndex: 0, 
          script, 
          target: script[0]?.target || null,
          waiting: false
        });
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          get().showCurrentStep();
        }, 100);
      },

      showCurrentStep: () => {
        const { stepIndex, script } = get();
        
        if (stepIndex >= script.length) {
          console.log('🎓 Journey complete');
          get().stop();
          return;
        }

        const currentStep = script[stepIndex];
        console.log(`📍 Showing step ${stepIndex + 1}/${script.length}:`, currentStep.text);

        const waitForElement = (selector, timeout = 3000) => {
          return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
              resolve(element);
              return;
            }

            const observer = new MutationObserver(() => {
              const element = document.querySelector(selector);
              if (element) {
                observer.disconnect();
                resolve(element);
              }
            });

            observer.observe(document.body, {
              childList: true,
              subtree: true
            });

            setTimeout(() => {
              observer.disconnect();
              reject(new Error(`Element not found: ${selector}`));
            }, timeout);
          });
        };

        waitForElement(currentStep.target).then(() => {
          setTimeout(() => {
            import('driver.js').then(({ driver }) => {
              injectDriverCSS();
              
              const driverInstance = driver({
                animate: true,
                opacity: 0.75,
                padding: 20,
                allowClose: false,
                showButtons: [],
                disableActiveInteraction: false,
              });
              
              set({ currentDriver: driverInstance });
              
              const needsWait = currentStep.waitForSignal;
              
              driverInstance.highlight({
                element: currentStep.target,
                popover: {
                  title: `Step ${stepIndex + 1}`,
                  description: currentStep.text,
                  position: 'top',
                  showButtons: needsWait ? [] : ['next'],
                  onNextClick: needsWait ? undefined : () => {
                    driverInstance.destroy();
                    get().nextStep();
                  }
                }
              });
              
              // ✅ If this step needs to wait for user interaction
              if (needsWait) {
                set({ waiting: true });
                console.log('⏸️ Waiting for user to click button...');
                
                // Attach click listener to the highlighted element
                setTimeout(() => {
                  const highlightedStage = document.getElementById('driver-highlighted-element-stage');
                  const originalElement = document.querySelector(currentStep.target);
                  
                  let clickHandled = false;
                  
                  const handleClick = (e) => {
                    if (clickHandled) return;
                    clickHandled = true;
                    
                    console.log('🎉 User clicked the button!');
                    
                    // Clean up listeners
                    if (highlightedStage) {
                      highlightedStage.removeEventListener('click', handleClick);
                    }
                    if (originalElement) {
                      originalElement.removeEventListener('click', handleClick, true);
                    }
                    
                    // Destroy current highlight
                    driverInstance.destroy();
                    
                    // ✅ If there's a modal to wait for, set up observer
                    if (currentStep.pauseForModal) {
                      console.log('👀 Setting up modal close observer for:', currentStep.pauseForModal);
                      get().waitForModalClose(currentStep.pauseForModal);
                    } else {
                      // No modal, just move to next step
                      setTimeout(() => {
                        set({ waiting: false });
                        get().nextStep();
                      }, 300);
                    }
                  };
                  
                  if (highlightedStage) {
                    highlightedStage.addEventListener('click', handleClick);
                  }
                  if (originalElement) {
                    originalElement.addEventListener('click', handleClick, true);
                  }
                }, 300);
              }
            });
          }, 500);
        }).catch((error) => {
          console.error('❌ Element not found:', error);
          // Skip to next step if element not found
          get().nextStep();
        });
      },

      // ✅ NEW: Wait for modal to close, then auto-resume
      waitForModalClose: (modalStateName) => {
        console.log('👁️ Watching for modal close:', modalStateName);
        
        // Set up a MutationObserver to watch for modal disappearance
        const checkModalClosed = () => {
          // Look for modals (they have class "fixed inset-0 bg-black/60")
          const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/60');
          
          if (modals.length === 0) {
            console.log('✅ Modal closed! Resuming tour...');
            set({ waiting: false });
            
            // Small delay then continue
            setTimeout(() => {
              get().nextStep();
            }, 500);
            
            return true;
          }
          
          return false;
        };
        
        // Check immediately
        if (checkModalClosed()) return;
        
        // Set up observer
        const observer = new MutationObserver(() => {
          if (checkModalClosed()) {
            observer.disconnect();
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Fallback timeout (30 seconds)
        setTimeout(() => {
          observer.disconnect();
          if (get().waiting) {
            console.log('⏰ Modal close timeout - forcing resume');
            set({ waiting: false });
            get().nextStep();
          }
        }, 30000);
      },

      nextStep: () => {
        const { stepIndex, script } = get();
        const nextIndex = stepIndex + 1;

        console.log(`➡️ Moving from step ${stepIndex} to ${nextIndex}`);

        if (nextIndex >= script.length) {
          console.log('🎓 Journey complete');
          get().stop();
          return;
        }

        set({ stepIndex: nextIndex, target: script[nextIndex].target });
        get().showCurrentStep();
      },

      stop: () => {
        console.log('🛑 Stopping mentor journey');
        const { currentDriver } = get();
        if (currentDriver) {
          currentDriver.destroy();
        }
        set({ 
          active: false, 
          stepIndex: 0, 
          script: [], 
          target: null, 
          waiting: false,
          currentDriver: null
        });
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