import { useState } from 'react';
import { auth } from '../firebase';

async function notifyTester(email: string): Promise<boolean> {
  const MAX_ATTEMPTS = 10;
  const BASE_DELAY_MS = 1000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const resp = await fetch("https://llmtester.onrender.com/add-tester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": "goalgrid_secret_2024",
        },
        body: JSON.stringify({ email }),
      });

      if (resp.ok) {
        console.log(`✅ Tester notified on attempt ${attempt}`);
        return true;
      }

      const body = await resp.text().catch(() => "(unreadable)");
      console.warn(`⚠️ Attempt ${attempt}/${MAX_ATTEMPTS} got HTTP ${resp.status}: ${body}`);
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt}/${MAX_ATTEMPTS} threw:`, err);
    }

    if (attempt < MAX_ATTEMPTS) {
      const delay = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), 32_000);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error(`❌ Tester webhook failed after ${MAX_ATTEMPTS} attempts for ${email}.`);
  return false;
}

type LoadingPhase = 'idle' | 'sending' | 'verifying' | 'success' | 'redirecting' | 'error';

const PHASE_MESSAGES: Record<LoadingPhase, { emoji: string; title: string; sub: string }> = {
  idle: { emoji: '', title: '', sub: '' },
  sending: {
    emoji: '📨',
    title: 'Sending your request...',
    sub: 'Hang tight, submitting your email',
  },
  verifying: {
    emoji: '🔐',
    title: 'Adding you to beta...',
    sub: 'Securing your spot in GoalGrid testing',
  },
  success: {
    emoji: '🎉',
    title: "You're in!",
    sub: 'Opening the Play Store for you...',
  },
  redirecting: {
    emoji: '🚀',
    title: 'Redirecting to Play Store...',
    sub: 'Get ready to install GoalGrid',
  },
  error: {
    emoji: '😕',
    title: 'Something went wrong',
    sub: "We couldn't add you. Please try again or contact support.",
  },
};

export function TrialExpiredPage() {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<LoadingPhase>('idle');
  const [inputError, setInputError] = useState('');

  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setInputError('Please enter a valid email address');
      return;
    }
    setInputError('');

    // Phase 1: sending
    setPhase('sending');

    // After ~1.5s switch to "verifying" for UX feel
    const verifyTimer = setTimeout(() => {
      setPhase('verifying');
    }, 1500);

    const success = await notifyTester(email.trim());
    clearTimeout(verifyTimer);

    if (!success) {
      setPhase('error');
      return;
    }

    // Phase: success
    setPhase('success');

    // After 1.5s redirect
    setTimeout(() => {
      setPhase('redirecting');
      setTimeout(() => {
        window.location.href = 'https://play.google.com/store/apps/details?id=app.connect.mobile';
      }, 800);
    }, 1500);
  };

  const isLoading = phase === 'sending' || phase === 'verifying' || phase === 'redirecting';
  const isDone = phase === 'success' || phase === 'redirecting';
  const isError = phase === 'error';
  const showLoadingOverlay = phase !== 'idle' && phase !== 'error';

  return (
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '2rem 1.5rem 4rem',
      background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 50%, #0d1a3a 100%)',
      position: 'relative',
    }}>

      {/* ── Loading overlay ── */}
      {showLoadingOverlay && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 50%, #0d1a3a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes spin { to { transform: rotate(360deg) } }
            @keyframes pulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.6; transform:scale(0.95) } }
            @keyframes bounceIn { 0% { opacity:0; transform:scale(0.5) } 70% { transform:scale(1.15) } 100% { opacity:1; transform:scale(1) } }
          `}</style>

          {/* Spinner ring */}
          {(phase === 'sending' || phase === 'verifying') && (
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              border: '3px solid rgba(168,85,247,0.2)',
              borderTop: '3px solid #a855f7',
              animation: 'spin 1s linear infinite',
              marginBottom: '2rem',
            }} />
          )}

          {/* Success checkmark */}
          {(phase === 'success' || phase === 'redirecting') && (
            <div style={{
              fontSize: '4rem',
              animation: 'bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97)',
              marginBottom: '1.5rem',
            }}>
              {PHASE_MESSAGES[phase].emoji}
            </div>
          )}

          <p style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            {PHASE_MESSAGES[phase].title}
          </p>

          <p style={{ opacity: 0.55, fontSize: '0.9rem', maxWidth: '260px', lineHeight: 1.6 }}>
            {PHASE_MESSAGES[phase].sub}
          </p>

          {/* Progress dots */}
          {(phase === 'sending' || phase === 'verifying') && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '1.5rem' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'rgba(168,85,247,0.6)',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Icon */}
      <div style={{ fontSize: '4rem', marginBottom: '1rem', marginTop: '2rem' }}>⏰</div>

      {/* Heading */}
      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        background: 'linear-gradient(90deg, #a855f7, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Your 2-Min Preview Is Up!
      </h1>

      <p style={{ opacity: 0.7, fontSize: '1rem', maxWidth: '300px', lineHeight: 1.6, marginBottom: '0.5rem' }}>
        Loved what you saw? Join our{' '}
        <strong style={{ color: 'white', opacity: 1 }}>free closed internal testing</strong>
        {' '}— full access, no cost, before public launch.
      </p>

      <p style={{ opacity: 0.5, fontSize: '0.8rem', maxWidth: '260px', lineHeight: 1.5, marginBottom: '2rem' }}>
        🔒 Closed beta · 100% free · Limited spots
      </p>

      {/* What you get */}
      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { e: '🔔', t: 'Daily missions to build real confidence' },
          { e: '⚡', t: 'Full access — no time limits' },
          { e: '🔒', t: 'Your plan synced & saved forever' },
          { e: '👥', t: 'Community of people who get it' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'left',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{item.e}</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{item.t}</span>
          </div>
        ))}
      </div>

      {/* ── iOS Coming Soon banner ── */}
      {isIOS && (
        <div style={{
          width: '100%', maxWidth: '300px', marginBottom: '1.5rem',
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: '14px', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          textAlign: 'left',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🍎</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem', color: '#a5b4fc' }}>
              iOS — Coming Soon
            </p>
            <p style={{ opacity: 0.5, fontSize: '0.75rem', lineHeight: 1.5 }}>
              We're working on the App Store version! Drop your email below and we'll notify you the moment it's live.
            </p>
          </div>
        </div>
      )}

      {/* ── Email capture ── */}
      <div style={{
        width: '100%', maxWidth: '300px', marginBottom: '2rem',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(168,85,247,0.25)',
        borderRadius: '16px', padding: '1.25rem',
      }}>
        {isError ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😕</div>
            <p style={{ color: '#f87171', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              Something went wrong
            </p>
            <p style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '1rem' }}>
              We couldn't add you right now. Please try again.
            </p>
            <button
              onClick={() => setPhase('idle')}
              style={{
                padding: '0.6rem 1.5rem',
                background: 'rgba(168,85,247,0.2)',
                border: '1px solid rgba(168,85,247,0.4)',
                borderRadius: '10px', color: 'white',
                fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              {isIOS ? 'Join here for android' : 'Drop your Gmail to get access'}
            </p>
            <p style={{ opacity: 0.5, fontSize: '0.78rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              {isIOS
                ? "Enter your email and we'll ping you the moment GoalGrid hits the App Store."
                : 'We use Gmail to add you directly to the testing group — no spam, just your invite.'}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
              placeholder={isIOS ? 'you@email.com' : 'you@gmail.com'}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', fontSize: '0.9rem', outline: 'none',
                boxSizing: 'border-box', marginBottom: '0.5rem',
              }}
            />
            {inputError && (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{inputError}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: '100%', padding: '0.75rem',
                background: isLoading ? 'rgba(168,85,247,0.4)' : 'linear-gradient(90deg, #a855f7, #ec4899)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '0.95rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {isIOS ? 'Join Beta for android →' : 'Get Beta Access →'}
            </button>
          </>
        )}
      </div>

      {/* Support link */}
      <p style={{ opacity: 0.4, fontSize: '0.8rem', marginBottom: '2.5rem' }}>
        Questions?{' '}
        <a href="mailto:support@goalgrid.app" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Contact support
        </a>
      </p>
    </div>
  );
}
