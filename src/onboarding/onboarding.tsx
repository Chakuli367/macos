import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';

export default function OnboardingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const [run, setRun] = useState(true);

  const steps = {
    '/dashboard': [
      { target: '#welcome', content: 'This is your dashboard.' },
    ],
    '/lessons': [
      { target: '#lesson-card', content: 'These are your lessons.' },
    ],
    '/progress': [
      { target: '#progress-chart', content: 'Track your growth here.' },
    ],
  };

  const currentSteps = steps[location.pathname] || [];

  useEffect(() => {
    if (location.pathname === '/dashboard') setRun(true);
  }, [location]);

  const handleJoyrideCallback = (data: any) => {
    const { status, index, type } = data;
    if (status === 'finished' || type === 'tour:end') {
      if (location.pathname === '/dashboard') navigate('/lessons');
      else if (location.pathname === '/lessons') navigate('/progress');
      else if (location.pathname === '/progress') {
        localStorage.setItem('onboarded', 'true');
      }
    }
  };

  return (
    <Joyride
      steps={currentSteps}
      run={run}
      continuous
      callback={handleJoyrideCallback}
    />
  );
}
