import { useEffect, useState } from 'react';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from 'src/theme/theme-provider';
import { usePathname } from 'src/routes/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import BottomNav from './MobileNav';
import mixpanel from 'mixpanel-browser';
import './styles/onboarding.css';

type AppProps = {
  children: React.ReactNode;
};

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const APP_BACKGROUND = 'linear-gradient(135deg, #240046, #330066)';

function useScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
}

export default function App({ children }: AppProps) {
  useScrollToTop();

  const pathname = usePathname();
  const navigate = useNavigate();

  const [user, loading] = useAuthState(auth);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    mixpanel.init('3f57bf9b5f5d11792f52742c157e9004', {
      autocapture: true,
      record_sessions_percent: 100,
    });
  }, []);

  useEffect(() => {
    if (!loading && authInitialized) {
      if (user) {
        mixpanel.identify(user.uid);
        mixpanel.people.set({
          $email: user.email,
          $name: user.displayName || 'User',
          uid: user.uid,
        });
      }
      mixpanel.track('Page View', {
        page: pathname,
        uid: user?.uid,
      });
    }
  }, [pathname, loading, authInitialized, user]);

  useEffect(() => {
    const init = async () => {
      if (loading) return;

      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        let data;

        if (!snap.exists()) {
          data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'User',
            createdAt: new Date().toISOString(),
          };
          await setDoc(ref, data);
        } else {
          data = snap.data();
          await setDoc(ref, { lastLogin: new Date().toISOString() }, { merge: true });
        }

        localStorage.setItem('goalgrid_auth', JSON.stringify(data));
        setUserData(data);
      } else {
        localStorage.clear();
        setUserData(null);

        const publicPaths = ['/sign-in', '/onboarding'];
        const isPublic = publicPaths.some(p => pathname.startsWith(p));
        if (!isPublic) navigate('/sign-in');
      }

      setAuthInitialized(true);
    };

    init();
  }, [user, loading, pathname]);

  // ─── Loading Screen ───────────────────────────────────────────────────────
  if (loading || !authInitialized) {
    return (
      <ThemeProvider>
        <CssBaseline />
        <div
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: APP_BACKGROUND,
          }}
        >
          <div
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: APP_BACKGROUND,
              borderRadius: '2rem',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="loading-spinner"
              style={{
                width: '4rem',
                height: '4rem',
                border: '0.25rem solid rgba(168,85,247,0.3)',
                borderTop: '0.25rem solid #a855f7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // ─── Main App ─────────────────────────────────────────────────────────────
  return (
    <ThemeProvider>
      <CssBaseline />

      {/* Outer: fills viewport, centers the screen */}
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: APP_BACKGROUND,
        }}
      >
        {/* ── Phone Screen Container ── */}
        <div
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            background: APP_BACKGROUND,
            borderRadius: '2rem',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            position: 'relative',
          }}
        >
          {/* Scrollable content area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              position: 'relative',
              background: APP_BACKGROUND,
            }}
          >
            {children}
          </div>

          {/* Bottom Nav */}
          <BottomNav />
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          html {
            font-size: 13px;
          }

          body {
            font-size: 1rem;
            line-height: 1.5;
          }
        `}
      </style>
    </ThemeProvider>
  );
}