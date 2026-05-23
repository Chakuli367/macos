import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import VoiceTherapySession from './VoiceTherapySession';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

// ── Firebase ──────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  databaseURL: "https://goalgrid-c5e9c-default-rtdb.firebaseio.com",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ── Notification ──────────────────────────────────────────────────────────────

function useNotification() {
  const [msg, setMsg] = useState(null);
  const show = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 3200);
  };
  return [msg, show];
}

// ── Sign-in screen ────────────────────────────────────────────────────────────

function SignInPage({ onSignIn, loading }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0820',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>

        <div style={{
          width: '56px', height: '56px',
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', margin: '0 auto 18px',
          boxShadow: '0 0 36px rgba(124,58,237,0.35)',
        }}>🧠</div>

        <h1 style={{ color: '#f3f0ff', fontSize: '24px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Voice Therapy
        </h1>
        <p style={{ color: 'rgba(196,181,253,0.55)', fontSize: '13.5px', margin: '0 0 28px', lineHeight: 1.65 }}>
          5-minute CBT sessions that end with one real action.
        </p>

        <button
          onClick={onSignIn}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: '#fff', border: 'none', borderRadius: '11px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '14px', color: '#1a1a2e',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function VoiceTherapyPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notification, showNotification] = useNotification();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    try {
      setAuthLoading(true);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      setUser(result.user);
    } catch {
      showNotification('Sign in failed. Try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Loading splash
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0d0820',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '44px', height: '44px',
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          borderRadius: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          animation: 'pulse 1.4s ease-in-out infinite',
          boxShadow: '0 0 28px rgba(124,58,237,0.4)',
        }}>🧠</div>
      </div>
    );
  }

  if (!user) {
    return <SignInPage onSignIn={handleSignIn} loading={authLoading} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d0820 0%, #130a2e 55%, #0a1525 100%)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(13,8,32,0.82)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(167,139,250,0.1)',
        padding: '0 20px',
      }}>
        <div style={{
          maxWidth: '600px', margin: '0 auto',
          height: '50px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px', height: '26px',
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px',
            }}>🧠</div>
            <span style={{ color: '#f3f0ff', fontWeight: '700', fontSize: '13.5px' }}>
              Voice Therapy
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {user?.photoURL
                ? <img src={user.photoURL} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(167,139,250,0.2)' }} />
                : <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User style={{ width: 11, height: 11, color: '#a78bfa' }} />
                  </div>}
              <span style={{ color: 'rgba(196,181,253,0.55)', fontSize: '12px' }}>
                {user?.displayName?.split(' ')[0] || 'You'}
              </span>
            </div>

            <button
              onClick={() => { signOut(auth); setUser(null); }}
              title="Sign out"
              style={{
                width: '28px', height: '28px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '7px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <LogOut style={{ width: 12, height: 12, color: 'rgba(196,181,253,0.4)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Session component ───────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '20px 20px 36px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <VoiceTherapySession
            user={user}
            showNotification={showNotification}
            onPlanCreated={() => showNotification('🎯 Plan saved!')}
          />
        </div>
      </main>

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          color: '#fff', fontWeight: '600', fontSize: '13px',
          padding: '10px 18px', borderRadius: '20px',
          boxShadow: '0 6px 24px rgba(124,58,237,0.4)',
          border: '1px solid rgba(167,139,250,0.25)',
          whiteSpace: 'nowrap', zIndex: 99,
          animation: 'fadeUp 0.25s ease',
        }}>
          {notification}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.94); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}