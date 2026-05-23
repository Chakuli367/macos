// src/pages/profile.tsx
import { CONFIG } from 'src/config-global';
import ProfileView from 'src/sections/profile/view/ProfileView'; // default import
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function Page() {
  useEffect(() => {
    // Disable pinch-to-zoom / double-tap zoom
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    }

    // Optional: prevent gestures on touch devices
    const preventGesture = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('gesturestart', preventGesture);
    return () => {
      document.removeEventListener('gesturestart', preventGesture);
    };
  }, []);

  return (
    <>
      <title>{`Profile - ${CONFIG.appName}`}</title>
      <ProfileView />
    </>
  );
}
