/**
 * LoadingScreen — F1 telemetry / AI system boot-sequence loading overlay.
 * Renders over the entire viewport, animates progress 0→100%, then
 * fades out and calls onComplete so the parent can unmount it.
 */

import { useState, useEffect, useRef } from 'react';

// ── Cycled boot messages ──────────────────────────────────────────────────────
const BOOT_MESSAGES = [
  'Initializing AI Systems...',
  'Loading Machine Learning Models...',
  'Connecting Neural Networks...',
  'Calibrating Data Streams...',
  'Preparing Portfolio Interface...',
  'Optimizing Performance Engine...',
  '[ SYSTEM READY ]',
];

// ── Fake telemetry values that flicker ────────────────────────────────────────
const randTelemetry = () => ({
  cpu: 88 + Math.floor(Math.random() * 10),
  mem: 71 + Math.floor(Math.random() * 12),
  net: 94 + Math.floor(Math.random() * 6),
  rpm: 10_800 + Math.floor(Math.random() * 1_400),
});

// ── Total duration (ms) before the screen fades away ─────────────────────────
const TOTAL_DURATION = 2800;
const FADE_DURATION  = 600;
const HOLD_AFTER     = 350;

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress]   = useState(0);
  const [msgIdx,   setMsgIdx]     = useState(0);
  const [telemetry, setTelemetry] = useState(randTelemetry());
  const [fadeOut,  setFadeOut]    = useState(false);
  const [visible,  setVisible]    = useState(true);

  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number>(0);
  const doneRef  = useRef(false);

  /* ── Progress animation ── */
  useEffect(() => {
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      // Use an easing curve so it starts fast and slows near 100 %
      const linear = Math.min(1, elapsed / TOTAL_DURATION);
      const eased  = linear < 0.5
        ? 2 * linear * linear
        : 1 - Math.pow(-2 * linear + 2, 2) / 2;
      const pct = Math.floor(eased * 100);

      setProgress(pct);
      setMsgIdx(Math.min(
        BOOT_MESSAGES.length - 1,
        Math.floor((pct / 100) * BOOT_MESSAGES.length),
      ));

      if (linear < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, FADE_DURATION);
        }, HOLD_AFTER);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  /* ── Telemetry flicker ── */
  useEffect(() => {
    const id = setInterval(() => setTelemetry(randTelemetry()), 180);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const currentMsg = BOOT_MESSAGES[msgIdx];
  const isReady    = progress === 100;

  return (
    <div
      aria-label="Loading portfolio"
      aria-live="polite"
      role="status"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#030712',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Courier New', 'Courier', monospace",
        color: '#e2e8f0',
        overflow: 'hidden',
        opacity: fadeOut ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
        userSelect: 'none',
      }}
    >
      {/* ── Animated circuit grid ── */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.07,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="ls-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00ff88" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ls-grid)" />
      </svg>

      {/* ── Scanning line ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, hsl(160 84% 39%) 40%, #00ffcc 50%, hsl(160 84% 39%) 60%, transparent 100%)',
          boxShadow: '0 0 18px 3px hsl(160 84% 39% / 0.6)',
          animation: 'ls-scan 2s linear infinite',
          top: 0,
        }}
      />

      {/* ── Corner brackets ── */}
      {[
        { top: 16, left: 16,  borderTop: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
        { top: 16, right: 16, borderTop: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
        { bottom: 16, left: 16,  borderBottom: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
        { bottom: 16, right: 16, borderBottom: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
      ].map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            ...s,
            animation: `ls-corner 1.2s ease-out ${i * 0.1}s both`,
          }}
        />
      ))}

      {/* ── Top status bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 clamp(24px, 5vw, 64px)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(226,232,240,0.4)',
        }}
      >
        <span>BOOT_SEQ v2.4.1</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 8px #00ff88',
              animation: 'ls-pulse 1s ease-in-out infinite',
            }}
          />
          ONLINE
        </span>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          width: '100%',
          maxWidth: 600,
          padding: '0 24px',
        }}
      >
        {/* Name */}
        <div
          style={{
            fontSize: 'clamp(36px, 10vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: '#f1f5f9',
            textAlign: 'center',
            animation: 'ls-fade-up 0.6s ease-out both',
          }}
        >
          YUVA
        </div>
        <div
          style={{
            fontSize: 'clamp(36px, 10vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'rgba(241,245,249,0.18)',
            textAlign: 'center',
            animation: 'ls-fade-up 0.6s ease-out 0.12s both',
          }}
        >
          THILAGAN.
        </div>

        {/* Role tag */}
        <div
          style={{
            marginTop: 16,
            padding: '4px 16px',
            border: '1px solid rgba(0,255,136,0.4)',
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(0,255,136,0.8)',
            animation: 'ls-fade-up 0.6s ease-out 0.25s both',
          }}
        >
          AI Engineer &amp; Data Analyst
        </div>

        {/* ── Progress block ── */}
        <div
          style={{
            marginTop: 48,
            width: '100%',
            animation: 'ls-fade-up 0.6s ease-out 0.4s both',
          }}
        >
          {/* Message */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontSize: 12,
              letterSpacing: '0.05em',
              color: isReady ? '#00ff88' : 'rgba(226,232,240,0.6)',
              transition: 'color 0.3s ease',
              minHeight: 18,
            }}
          >
            <span style={{ color: '#00ff88', marginRight: 2 }}>&gt;</span>
            <span key={currentMsg} style={{ animation: 'ls-blink-in 0.2s ease-out both' }}>
              {currentMsg}
            </span>
          </div>

          {/* Progress bar track */}
          <div
            style={{
              position: 'relative',
              height: 6,
              background: 'rgba(226,232,240,0.08)',
              border: '1px solid rgba(226,232,240,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Fill */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, hsl(160 84% 30%) 0%, hsl(160 84% 50%) 60%, #00ffcc 100%)',
                boxShadow: '0 0 12px 2px hsl(160 84% 39% / 0.7)',
                transition: 'width 0.1s linear',
              }}
            />
            {/* Shimmer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                animation: 'ls-shimmer 1.2s ease-in-out infinite',
              }}
            />
          </div>

          {/* Percentage row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              fontSize: 11,
              letterSpacing: '0.15em',
              color: 'rgba(226,232,240,0.35)',
            }}
          >
            <span>PROGRESS</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: isReady ? '#00ff88' : '#f1f5f9',
                letterSpacing: '-0.02em',
                transition: 'color 0.3s ease',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(progress).padStart(3, ' ')}%
            </span>
          </div>
        </div>

        {/* ── Telemetry bar ── */}
        <div
          style={{
            marginTop: 40,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            animation: 'ls-fade-up 0.6s ease-out 0.55s both',
          }}
        >
          {[
            { label: 'CPU',    value: telemetry.cpu,  unit: '%',    max: 100 },
            { label: 'MEM',    value: telemetry.mem,  unit: '%',    max: 100 },
            { label: 'NET',    value: telemetry.net,  unit: '%',    max: 100 },
            { label: 'RPM',    value: telemetry.rpm,  unit: '',     max: 12000 },
          ].map(({ label, value, unit, max }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(226,232,240,0.3)',
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              {/* Mini bar */}
              <div
                style={{
                  height: 3,
                  background: 'rgba(226,232,240,0.07)',
                  marginBottom: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(value / max) * 100}%`,
                    background: 'hsl(160 84% 42%)',
                    transition: 'width 0.18s linear',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(226,232,240,0.55)',
                  letterSpacing: '0.05em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {unit === '' ? value.toLocaleString() : `${value}${unit}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(226,232,240,0.2)',
        }}
      >
        <span>Neural Net: Active</span>
        <span>|</span>
        <span>Data Streams: Connected</span>
        <span>|</span>
        <span>Portfolio: Loaded</span>
      </div>

      {/* ── Keyframe styles injected via style tag ── */}
      <style>{`
        @keyframes ls-scan {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes ls-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes ls-corner {
          0%   { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ls-fade-up {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ls-blink-in {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes ls-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
