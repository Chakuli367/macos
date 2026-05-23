// App.jsx
import { useEffect, useRef } from 'react';
import SmallTalkNavigator from './smalltalk';

function App(onBackToTimeline) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Enter fullscreen on mount
    const enterFullscreen = async () => {
      try {
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          } else if (containerRef.current.webkitRequestFullscreen) {
            await containerRef.current.webkitRequestFullscreen();
          } else if (containerRef.current.mozRequestFullScreen) {
            await containerRef.current.mozRequestFullScreen();
          } else if (containerRef.current.msRequestFullscreen) {
            await containerRef.current.msRequestFullscreen();
          }
        }
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    };

    enterFullscreen();

    // Exit fullscreen on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        zIndex: 9999,
        backgroundColor: '#0f172a'
      }}
    >
      <SmallTalkNavigator 
        lessonContent={{}}
        onBackToTimeline={() => {
          console.log('Navigator completed!');
          // Exit fullscreen on completion
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
        }}
      />
    </div>
  );
}

export default App;