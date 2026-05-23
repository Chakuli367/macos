import { useEffect } from 'react';
import { useMentorStore } from 'src/store/useMentorStore';

export function usePortalDriver(isActive = true) {
  const { active, stepIndex, script } = useMentorStore();

  useEffect(() => {
    if (!isActive || !active || !script[stepIndex]) return;

    const { target, text, signal } = script[stepIndex];

    const checkAndHighlight = () => {
      const targetElement = document.querySelector(target);

      if (!targetElement) {
        setTimeout(checkAndHighlight, 200);
        return;
      }

      import('driver.js').then(({ driver }) => {
        const driverInstance = driver({
          animate: true,
          opacity: 0.75,
          padding: 20,
          allowClose: false,
          showButtons: [],
        });

        driverInstance.highlight({
          element: target,
          popover: {
            title: 'Step ' + (stepIndex + 1),
            description: text,
            position: 'top',
            showButtons: [],
          },
        });

        if (signal) {
          const handleSignal = () => {
            window.removeEventListener(signal, handleSignal);
            driverInstance.destroy();
            useMentorStore.getState().nextStep();
          };
          window.addEventListener(signal, handleSignal);
        } else {
          const handleClick = () => {
            targetElement.removeEventListener('click', handleClick);
            driverInstance.destroy();
            useMentorStore.getState().nextStep();
          };
          targetElement.addEventListener('click', handleClick);
        }
      });
    };

    setTimeout(checkAndHighlight, 100);
  }, [active, stepIndex, script, isActive]);
}