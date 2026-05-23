import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const Onboarding = () => {
  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_complete');
    
    if (!hasCompletedOnboarding) {
      startOnboarding();
    }
  }, []);

  const startOnboarding = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      
      // Lock the screen - force interaction
      allowClose: false,
      overlayClickNext: false,
      disableActiveInteraction: false, // Allow clicking highlighted element
      
      // Styling
      popoverClass: 'driverjs-theme',
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      
      onDestroyed: () => {
        // Mark as complete when tour ends
        localStorage.setItem('onboarding_complete', 'true');
      },
      
      steps: [
        {
          element: '#app-root', // or any main container
          popover: {
            title: 'Welcome! 👋',
            description: 'Let me show you around. This will only take a minute.',
            side: 'center',
            align: 'center'
          }
        },
        {
          element: '#settings-icon', // Replace with your actual element ID
          popover: {
            title: 'Settings',
            description: 'Access your settings here.',
            side: 'left'
          }
        },
        {
          popover: {
            title: 'All Done! 🎉',
            description: 'You're ready to go. Enjoy the app!',
            side: 'center',
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  };

  return null; // This component doesn't render anything
};

export default Onboarding;