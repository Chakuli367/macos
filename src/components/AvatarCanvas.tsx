import { useRef } from 'react';
import { useThreeAvatar } from '../hooks/useThreeAvatar';

type Mode = 'idle' | 'listening' | 'thinking' | 'speaking';

// ── Mode → label shown under the avatar ──────────────────────
const MODE_LABEL: Record<Mode, string> = {
  idle:      'tap to speak',
  listening: 'listening...',
  thinking:  'thinking...',
  speaking:  'speaking',
};

// ── Mode → ring color ─────────────────────────────────────────
const MODE_RING: Record<Mode, string> = {
  idle:      'rgba(124,58,237,0.25)',
  listening: 'rgba(14,165,233,0.5)',
  thinking:  'rgba(245,158,11,0.4)',
  speaking:  'rgba(16,185,129,0.5)',
};

const MODE_RING_SOLID: Record<Mode, string> = {
  idle:      'rgba(124,58,237,0.6)',
  listening: 'rgba(14,165,233,0.9)',
  thinking:  'rgba(245,158,11,0.8)',
  speaking:  'rgba(16,185,129,0.9)',
};

interface AvatarCanvasProps {
  mode:      Mode;
  orbLevel:  number;
  onTap:     () => void;
  size?:     number;
}

export default function AvatarCanvas({
  mode,
  orbLevel,
  onTap,
  size = 260,
}: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialise Three.js scene
  useThreeAvatar({ canvasRef, mode, orbLevel });

  const ringScale  = 1 + (orbLevel - 1) * 1.8;
  const isAnimRing = mode === 'listening' || mode === 'speaking';

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '14px',
        userSelect:     'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ── Outer tap target + ring ──────────────────────── */}
      <div
        onClick={onTap}
        style={{
          position:       'relative',
          width:          `${size}px`,
          height:         `${size}px`,
          cursor:         mode === 'thinking' ? 'default' : 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Outermost glow ring — pulses with orbLevel */}
        <div style={{
          position:     'absolute',
          inset:        `-${12 * ringScale}px`,
          borderRadius: '50%',
          border:       `1.5px solid ${MODE_RING[mode]}`,
          transition:   'border-color 0.5s ease, inset 0.08s ease',
          pointerEvents: 'none',
          animation:    isAnimRing ? 'avatarRingPulse 1.4s ease-in-out infinite' : 'none',
        }} />

        {/* Middle ring */}
        <div style={{
          position:     'absolute',
          inset:        '-4px',
          borderRadius: '50%',
          border:       `1px solid ${MODE_RING_SOLID[mode]}`,
          transition:   'border-color 0.5s ease',
          pointerEvents: 'none',
        }} />

        {/* Canvas — Three.js renders here */}
        <canvas
          ref={canvasRef}
          style={{
            width:        '100%',
            height:       '100%',
            borderRadius: '50%',
            display:      'block',
            background:   'transparent',
          }}
          width={size * (window.devicePixelRatio || 1)}
          height={size * (window.devicePixelRatio || 1)}
        />

        {/* Thinking spinner overlay */}
        {mode === 'thinking' && (
          <div style={{
            position:     'absolute',
            inset:        '-8px',
            borderRadius: '50%',
            border:       '2px solid transparent',
            borderTopColor: 'rgba(245,158,11,0.8)',
            animation:    'avatarSpin 1s linear infinite',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* ── Mode label ───────────────────────────────────── */}
      <span style={{
        fontSize:      '11px',
        fontWeight:    700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color:         MODE_RING_SOLID[mode],
        transition:    'color 0.4s ease',
      }}>
        {MODE_LABEL[mode]}
      </span>

      {/* ── Keyframe animations ──────────────────────────── */}
      <style>{`
        @keyframes avatarRingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.06); }
        }
        @keyframes avatarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}