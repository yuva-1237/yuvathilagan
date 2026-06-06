/**
 * useAccentColor — Portfolio accent colour palette manager.
 * Persists the selected colour in localStorage and applies it
 * as a --portfolio-accent CSS custom property on :root so that
 * any component can consume it without re-rendering.
 */

import { useState, useEffect } from 'react';

export type AccentPalette = 'emerald' | 'cyan' | 'blue' | 'purple' | 'orange';

export interface PaletteOption {
  key: AccentPalette;
  label: string;
  hex: string; // swatch colour
  hsl: string; // raw HSL values for CSS custom property (no hsl() wrapper)
  /** Theme-aware colour levels for the GitHub calendar (dark mode) */
  calendarDark: [string, string, string, string, string];
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  {
    key: 'emerald',
    label: 'Emerald',
    hex: '#10b981',
    hsl: '160 84% 39%',
    calendarDark: ['#033a16', '#0f5323', '#196c2e', '#2ea043', '#39d353'],
  },
  {
    key: 'cyan',
    label: 'Cyan',
    hex: '#06b6d4',
    hsl: '189 94% 43%',
    calendarDark: ['#003640', '#00546b', '#007897', '#00a3c4', '#00d4ff'],
  },
  {
    key: 'blue',
    label: 'Blue',
    hex: '#3b82f6',
    hsl: '217 91% 60%',
    calendarDark: ['#0d1a4a', '#1d3ea8', '#2563eb', '#60a5fa', '#bfdbfe'],
  },
  {
    key: 'purple',
    label: 'Purple',
    hex: '#8b5cf6',
    hsl: '263 70% 65%',
    calendarDark: ['#1e1040', '#3d1f78', '#5b21b6', '#7c3aed', '#a78bfa'],
  },
  {
    key: 'orange',
    label: 'Orange',
    hex: '#f97316',
    hsl: '25 95% 53%',
    calendarDark: ['#3d1500', '#7c2d12', '#b45309', '#d97706', '#fb923c'],
  },
];

const STORAGE_KEY = 'portfolio-accent';
const DEFAULT: AccentPalette = 'emerald';

/** Apply accent colour CSS vars to :root — called without triggering re-renders */
export const applyAccent = (key: AccentPalette): void => {
  const option = PALETTE_OPTIONS.find((p) => p.key === key);
  if (!option) return;
  const root = document.documentElement;
  root.style.setProperty('--portfolio-accent', option.hsl);
  root.style.setProperty('--portfolio-accent-hex', option.hex);
  root.style.setProperty('--accent', option.hsl);
  root.style.setProperty('--accent-border', option.hsl);
  root.style.setProperty('--accent-glow', option.hsl);
};

export const useAccentColor = () => {
  const [palette, setPaletteState] = useState<AccentPalette>(() => {
    if (typeof window === 'undefined') return DEFAULT;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AccentPalette | null;
      return PALETTE_OPTIONS.some((p) => p.key === stored) ? stored! : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  // Apply on mount so the colour is always set even before first interaction
  useEffect(() => {
    applyAccent(palette);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setPalette = (key: AccentPalette) => {
    applyAccent(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // ignore storage errors
    }
    setPaletteState(key);
  };

  return { palette, setPalette, options: PALETTE_OPTIONS };
};
