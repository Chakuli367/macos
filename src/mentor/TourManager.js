// src/mentor/TourManager.js
// 🎯 CENTRALIZED TOUR CONTROL SYSTEM - Full visibility and control

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './driver-custom.css';

class TourManager {
  constructor() {
    // State
    this.currentTour = null;
    this.currentStep = 0;
    this.driverInstance = null;
    this.isActive = false;
    this.tourHistory = [];
    this.listeners = new Set();
    
    // Debug mode
    this.debugMode = true;
    
    // Initialize debug panel
    if (this.debugMode) {
      this.initDebugPanel();
    }
  }

  // ============================================
  // CORE TOUR CONTROL
  // ============================================

  /**
   * Start a new tour
   * @param {Object} tourConfig - Tour configuration
   * @param {string} tourConfig.id - Unique tour ID
   * @param {string} tourConfig.name - Human-readable tour name
   * @param {Array} tourConfig.steps - Array of tour steps
   */
  startTour(tourConfig) {
    this.log('🎬 Starting tour:', tourConfig.name);
    
    // Validate
    if (!tourConfig.id || !tourConfig.steps) {
      this.error('❌ Invalid tour config:', tourConfig);
      return false;
    }

    // Stop any existing tour
    if (this.isActive) {
      this.log('⚠️ Stopping existing tour first');
      this.stopTour();
    }

    // Set state
    this.currentTour = {
      id: tourConfig.id,
      name: tourConfig.name,
      steps: tourConfig.steps,
      startedAt: new Date(),
      metadata: tourConfig.metadata || {}
    };
    this.currentStep = 0;
    this.isActive = true;

    // Add to history
    this.tourHistory.push({
      id: tourConfig.id,
      name: tourConfig.name,
      startedAt: this.currentTour.startedAt,
      status: 'started'
    });

    // Notify listeners
    this.notifyListeners();

    // Start showing steps
    this.showCurrentStep();

    return true;
  }

  /**
   * Stop the current tour
   */
  stopTour() {
    this.log('🛑 Stopping tour');

    // Destroy driver instance
    if (this.driverInstance) {
      try {
        this.driverInstance.destroy();
      } catch (e) {
        this.error('Error destroying driver:', e);
      }
      this.driverInstance = null;
    }

    // Update history
    if (this.currentTour) {
      const historyEntry = this.tourHistory.find(t => t.id === this.currentTour.id && !t.endedAt);
      if (historyEntry) {
        historyEntry.endedAt = new Date();
        historyEntry.status = 'stopped';
        historyEntry.completedSteps = this.currentStep;
        historyEntry.totalSteps = this.currentTour.steps.length;
      }
    }

    // Clear state
    this.currentTour = null;
    this.currentStep = 0;
    this.isActive = false;

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Go to next step
   */
  nextStep() {
    if (!this.isActive) {
      this.warn('⚠️ No active tour');
      return;
    }

    const nextIndex = this.currentStep + 1;

    this.log(`➡️ Moving to step ${nextIndex + 1}/${this.currentTour.steps.length}`);

    if (nextIndex >= this.currentTour.steps.length) {
      this.log('✅ Tour completed!');
      this.completeTour();
      return;
    }

    this.currentStep = nextIndex;
    this.notifyListeners();
    this.showCurrentStep();
  }

  /**
   * Go to previous step
   */
  previousStep() {
    if (!this.isActive) {
      this.warn('⚠️ No active tour');
      return;
    }

    if (this.currentStep === 0) {
      this.warn('⚠️ Already at first step');
      return;
    }

    this.currentStep--;
    this.log(`⬅️ Moving to step ${this.currentStep + 1}/${this.currentTour.steps.length}`);
    this.notifyListeners();
    this.showCurrentStep();
  }

  /**
   * Jump to specific step
   */
  goToStep(stepIndex) {
    if (!this.isActive) {
      this.warn('⚠️ No active tour');
      return;
    }

    if (stepIndex < 0 || stepIndex >= this.currentTour.steps.length) {
      this.error('❌ Invalid step index:', stepIndex);
      return;
    }

    this.currentStep = stepIndex;
    this.log(`🎯 Jumping to step ${stepIndex + 1}/${this.currentTour.steps.length}`);
    this.notifyListeners();
    this.showCurrentStep();
  }

  /**
   * Complete the current tour
   */
  completeTour() {
    if (this.currentTour) {
      const historyEntry = this.tourHistory.find(t => t.id === this.currentTour.id && !t.endedAt);
      if (historyEntry) {
        historyEntry.endedAt = new Date();
        historyEntry.status = 'completed';
        historyEntry.completedSteps = this.currentTour.steps.length;
        historyEntry.totalSteps = this.currentTour.steps.length;
      }
    }

    this.stopTour();
  }

  // ============================================
  // STEP RENDERING
  // ============================================

  showCurrentStep() {
    if (!this.isActive || !this.currentTour) {
      this.warn('⚠️ Cannot show step - no active tour');
      return;
    }

    const step = this.currentTour.steps[this.currentStep];
    
    this.log(`📍 Showing step ${this.currentStep + 1}/${this.currentTour.steps.length}:`, step);

    // Destroy previous driver instance
    if (this.driverInstance) {
      try {
        this.driverInstance.destroy();
      } catch (e) {
        // Ignore
      }
    }

    // Wait for element if needed
    this.waitForElement(step.target, 5000)
      .then(() => {
        this.renderStep(step);
      })
      .catch((error) => {
        this.error(`❌ Element not found: ${step.target}`, error);
        
        // Auto-skip to next step after 2 seconds
        setTimeout(() => {
          this.warn('⏭️ Auto-skipping to next step...');
          this.nextStep();
        }, 2000);
      });
  }

  renderStep(step) {
    try {
      // Create driver instance
      this.driverInstance = driver({
        animate: true,
        smoothScroll: true,
        showProgress: true,
        allowClose: false,
        disableActiveInteraction: step.disableInteraction !== false,
        
        onDestroyed: () => {
          this.log('🔄 Driver instance destroyed');
        },
        
        onPopoverRender: (popover, { config, state }) => {
          this.log('🎨 Popover rendered');
        }
      });

      // Highlight the element
      this.driverInstance.highlight({
        element: step.target,
        popover: {
          title: step.title || `Step ${this.currentStep + 1}`,
          description: step.text,
          side: step.position || 'bottom',
          align: step.align || 'center',
          showButtons: this.createStepButtons(step),
          onNextClick: () => {
            this.handleStepAction(step, 'next');
          },
          onPrevClick: () => {
            this.previousStep();
          }
        }
      });

      this.log('✅ Step rendered successfully');

    } catch (error) {
      this.error('❌ Failed to render step:', error);
    }
  }

  createStepButtons(step) {
    const buttons = [];

    // Previous button
    if (this.currentStep > 0) {
      buttons.push('previous');
    }

    // Custom action button
    if (step.actionButton) {
      buttons.push({
        text: step.actionButton.text || 'Action',
        onClick: () => {
          this.handleStepAction(step, 'action');
        }
      });
    }

    // Next/Done button
    if (this.currentStep < this.currentTour.steps.length - 1) {
      buttons.push('next');
    } else {
      buttons.push({
        text: 'Done',
        onClick: () => {
          this.completeTour();
        }
      });
    }

    return buttons;
  }

  handleStepAction(step, actionType) {
    this.log(`🎬 Step action: ${actionType}`, step);

    // Execute step action if defined
    if (step.onAction) {
      try {
        step.onAction(actionType, this);
      } catch (error) {
        this.error('❌ Step action failed:', error);
      }
    }

    // Default behavior based on action type
    switch (actionType) {
      case 'next':
        if (step.requireAction) {
          this.warn('⚠️ Step requires action before proceeding');
          return;
        }
        this.nextStep();
        break;
        
      case 'action':
        if (step.actionButton?.onClick) {
          step.actionButton.onClick(this);
        }
        break;
        
      default:
        this.log('Unknown action type:', actionType);
    }
  }

  // ============================================
  // UTILITIES
  // ============================================

  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // Check if element already exists
      const element = document.querySelector(selector);
      if (element) {
        this.log(`✅ Element found immediately: ${selector}`);
        resolve(element);
        return;
      }

      this.log(`⏳ Waiting for element: ${selector}`);

      // Set up observer
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          this.log(`✅ Element found: ${selector}`);
          observer.disconnect();
          clearTimeout(timeoutId);
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Timeout
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        this.warn(`⏰ Timeout waiting for element: ${selector}`);
        reject(new Error(`Element not found: ${selector}`));
      }, timeout);
    });
  }

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        this.error('❌ Listener error:', error);
      }
    });
    
    // Update debug panel
    if (this.debugMode) {
      this.updateDebugPanel();
    }
  }

  getState() {
    return {
      isActive: this.isActive,
      currentTour: this.currentTour,
      currentStep: this.currentStep,
      currentStepData: this.currentTour?.steps[this.currentStep] || null,
      progress: this.currentTour ? {
        current: this.currentStep + 1,
        total: this.currentTour.steps.length,
        percentage: ((this.currentStep + 1) / this.currentTour.steps.length) * 100
      } : null,
      history: this.tourHistory
    };
  }

  // ============================================
  // DEBUG TOOLS
  // ============================================

  initDebugPanel() {
    // Create debug panel element
    const panel = document.createElement('div');
    panel.id = 'tour-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: #0f0;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 11px;
      z-index: 999999999;
      min-width: 250px;
      max-width: 350px;
      max-height: 400px;
      overflow-y: auto;
      display: none;
    `;
    document.body.appendChild(panel);

    // Keyboard shortcut to toggle (Ctrl + Shift + D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    });

    this.debugPanel = panel;
    this.updateDebugPanel();
  }

  updateDebugPanel() {
    if (!this.debugPanel) return;

    const state = this.getState();
    
    this.debugPanel.innerHTML = `
      <div style="border-bottom: 1px solid #0f0; padding-bottom: 8px; margin-bottom: 8px;">
        <strong>🎯 TOUR DEBUG PANEL</strong>
        <div style="font-size: 9px; color: #888;">Press Ctrl+Shift+D to toggle</div>
      </div>
      
      <div style="margin-bottom: 8px;">
        <strong>Status:</strong> ${state.isActive ? '🟢 ACTIVE' : '🔴 INACTIVE'}
      </div>
      
      ${state.currentTour ? `
        <div style="margin-bottom: 8px;">
          <strong>Tour:</strong> ${state.currentTour.name}
          <div style="color: #888; font-size: 10px;">ID: ${state.currentTour.id}</div>
        </div>
        
        <div style="margin-bottom: 8px;">
          <strong>Progress:</strong> ${state.progress.current}/${state.progress.total} (${state.progress.percentage.toFixed(0)}%)
          <div style="background: #333; height: 4px; border-radius: 2px; margin-top: 4px;">
            <div style="background: #0f0; height: 100%; width: ${state.progress.percentage}%; border-radius: 2px;"></div>
          </div>
        </div>
        
        <div style="margin-bottom: 8px;">
          <strong>Current Step:</strong>
          <div style="color: #ff0; font-size: 10px; margin-top: 4px;">
            Target: ${state.currentStepData?.target || 'N/A'}
          </div>
          <div style="color: #0ff; font-size: 10px;">
            Text: ${state.currentStepData?.text?.substring(0, 50) || 'N/A'}...
          </div>
        </div>
        
        <div style="display: flex; gap: 4px; margin-top: 8px;">
          <button onclick="window.tourManager.previousStep()" style="flex: 1; padding: 4px; background: #333; color: #fff; border: 1px solid #0f0; border-radius: 4px; cursor: pointer; font-size: 10px;">◀ Prev</button>
          <button onclick="window.tourManager.nextStep()" style="flex: 1; padding: 4px; background: #333; color: #fff; border: 1px solid #0f0; border-radius: 4px; cursor: pointer; font-size: 10px;">Next ▶</button>
          <button onclick="window.tourManager.stopTour()" style="flex: 1; padding: 4px; background: #c00; color: #fff; border: 1px solid #f00; border-radius: 4px; cursor: pointer; font-size: 10px;">■ Stop</button>
        </div>
      ` : `
        <div style="color: #888; font-style: italic;">No active tour</div>
      `}
      
      <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #333;">
        <strong>History:</strong> ${state.history.length} tours
        ${state.history.slice(-3).reverse().map(t => `
          <div style="font-size: 10px; color: #888; margin-top: 4px;">
            ${t.name} - ${t.status}
          </div>
        `).join('')}
      </div>
    `;
  }

  log(...args) {
    if (this.debugMode) {
      console.log('[TourManager]', ...args);
    }
  }

  warn(...args) {
    console.warn('[TourManager]', ...args);
  }

  error(...args) {
    console.error('[TourManager]', ...args);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  getCurrentTourInfo() {
    return this.getState();
  }

  getTourHistory() {
    return this.tourHistory;
  }

  isStepComplete(stepIndex) {
    return this.currentStep > stepIndex;
  }

  canGoNext() {
    return this.isActive && this.currentStep < this.currentTour.steps.length - 1;
  }

  canGoPrevious() {
    return this.isActive && this.currentStep > 0;
  }
}

// Create singleton instance
const tourManager = new TourManager();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.tourManager = tourManager;
}

export default tourManager;