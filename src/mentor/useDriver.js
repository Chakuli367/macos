// src/mentor/useDriver.js
import { driver } from 'driver.js';  // ✅ STATIC IMPORT - FIX FOR CAPACITOR
import 'driver.js/dist/driver.css';
import './driver-custom.css';

let isDriverActive = false;

export const startDriver = (steps) => {
  if (isDriverActive) {
    console.log('⏭ Driver already running, skipping');
    return;
  }
  
  isDriverActive = true;
  console.log('🚀 startDriver called');
  
  try {
    // ✅ NO MORE import('driver.js') - USE STATIC IMPORT
    const driverInstance = driver({
      animate: true,
      opacity: 0.75,
      padding: 20,
      showProgress: true,
      steps: steps.map(step => ({
        element: step.target,
        popover: {
          description: step.text,
          position: 'bottom',
        }
      })),
      onDestroyed: () => {
        isDriverActive = false; // Reset when tour ends
      }
    });
    
    driverInstance.drive();
  } catch (error) {
    console.error('❌ Failed to start driver:', error);
    isDriverActive = false;
  }
};

export const stopDriver = () => {
  console.log('Stop called');
};

export const testDriver = () => {
  try {
    // ✅ NO MORE import('driver.js') - USE STATIC IMPORT
    const testInstance = driver({
      animate: true,
      opacity: 0.75,
      padding: 20,
    });
    
    testInstance.highlight({
      element: 'body',
      popover: {
        title: 'Test',
        description: 'This is a test!',
        position: 'top',
      }
    });
  } catch (error) {
    console.error('❌ Failed to test driver:', error);
  }
};