/**
 * GithubGraph — GitHub contribution calendar with:
 *  • Accent-colour-aware theme (reads --portfolio-accent-hex CSS var)
 *  • Full mobile responsiveness (horizontal-scroll container, no overflow)
 *  • Smooth hover effects on desktop
 *  • Preserved GitHub-style contribution appearance
 */

import { useEffect, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import TiltCard from './ui/TiltCard';
import { playHover } from '@/hooks/useSoundEffects';
import { PALETTE_OPTIONS } from '@/hooks/useAccentColor';
import type { AccentPalette } from '@/hooks/useAccentColor';

// ── Derive GitHub calendar colour levels from the active palette ───────────────
const getCalendarTheme = (key: AccentPalette) => {
  const option = PALETTE_OPTIONS.find((p) => p.key === key);
  const dark = option?.calendarDark ?? PALETTE_OPTIONS[0].calendarDark;
  // react-github-calendar expects theme arrays with exactly 2 or 5 colours.
  // Use the precomputed dark palette steps directly to avoid passing 6 colours.
  return {
    light: dark as [string, string, string, string, string],
    dark: dark as [string, string, string, string, string],
  };
};

// ── Read currently active palette from localStorage ───────────────────────────
const getStoredPalette = (): AccentPalette => {
  try {
    const v = localStorage.getItem('portfolio-accent') as AccentPalette | null;
    return PALETTE_OPTIONS.some((p) => p.key === v) ? v! : 'emerald';
  } catch {
    return 'emerald';
  }
};

// ── Shared graph content ──────────────────────────────────────────────────────
const GraphContent = ({ isMobile }: { isMobile?: boolean }) => {
  const [mounted, setMounted] = useState(false);
  const [palette, setPalette] = useState<AccentPalette>('emerald');
  const [accentHex, setAccentHex] = useState('#10b981');

  useEffect(() => {
    setMounted(true);
    setPalette(getStoredPalette());

    // Read hex from CSS variable (updated by useAccentColor hook)
    const hex =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--portfolio-accent-hex')
        .trim() || '#10b981';
    setAccentHex(hex);

    // Listen for palette changes via storage events (multi-tab sync)
    const onStorage = () => {
      setPalette(getStoredPalette());
      const h =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--portfolio-accent-hex')
          .trim() || '#10b981';
      setAccentHex(h);
    };
    window.addEventListener('storage', onStorage);
    // Also poll every 300 ms so same-tab changes are caught
    const id = setInterval(onStorage, 300);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(id);
    };
  }, []);

  const calendarTheme = mounted
    ? getCalendarTheme(palette)
    : getCalendarTheme('emerald');

  return (
    <div
      onMouseEnter={!isMobile ? playHover : undefined}
      className="border-2 md:border-4 border-foreground p-4 md:p-8 bg-background text-foreground shadow-brutal-3d"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b-2 border-foreground/20 pb-4">
        <h3 className="font-mono text-lg sm:text-xl font-bold uppercase tracking-tighter">
          GitHub Activity_
        </h3>
        <div className="flex items-center gap-2 font-mono text-[10px] text-foreground/50 uppercase">
          <span
            className="w-2 h-2 rounded-none animate-pulse"
            style={{ backgroundColor: accentHex }}
          />
          Synced with GitHub Server
        </div>
      </div>

      {/* Calendar scroll container */}
      <div className="relative">
        <div
          className="overflow-x-auto pb-3 scrollbar-hide snap-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* min-w prevents the calendar from collapsing on very narrow screens;
              it stays scrollable without breaking the page layout */}
          <div
            className="transition-transform"
            style={{ minWidth: isMobile ? 340 : 600 }}
          >
            {mounted && (
              <GitHubCalendar
                username="yuva-1237"
                colorScheme="dark"
                style={{ fontFamily: 'monospace', color: 'currentColor' }}
                theme={calendarTheme}
                blockSize={isMobile ? 9 : 12}
                blockMargin={isMobile ? 2 : 3}
                fontSize={isMobile ? 10 : 12}
              />
            )}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-2 text-[10px] font-mono text-foreground/40 uppercase">
          <span>← Swipe to view →</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase text-foreground/60">
        <div className="flex items-center gap-3">
          <span>Total Contributions:</span>
          <span className="font-black text-foreground">1.2K+</span>
        </div>
        <div className="hidden sm:block">// Real-time contributions</div>
      </div>
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
const GithubGraph = () => (
  <div className="w-full">
    {/* Desktop — with tilt effect */}
    <TiltCard
      className="w-full max-w-4xl mx-auto hidden md:block"
      maxTilt={8}
      perspective={1500}
      scale={1.02}
    >
      <GraphContent />
    </TiltCard>

    {/* Mobile / tablet — static for stability */}
    <div className="md:hidden w-full">
      <GraphContent isMobile />
    </div>
  </div>
);

export default GithubGraph;
