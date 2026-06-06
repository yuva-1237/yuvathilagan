/**
 * ColorPaletteCustomizer
 * Compact accent-colour picker that appears in the Navbar.
 * Replaces the dark/light mode ThemeToggle.
 */

import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useAccentColor, PALETTE_OPTIONS } from '@/hooks/useAccentColor';
import { playClick, playHover } from '@/hooks/useSoundEffects';

const ColorPaletteCustomizer = () => {
  const { palette, setPalette } = useAccentColor();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative" style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        id="palette-customizer-btn"
        onClick={() => {
          playClick();
          setOpen((v) => !v);
        }}
        onMouseEnter={playHover}
        aria-label="Change accent colour palette"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="p-2 border-2 border-primary bg-background hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-300 shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 rounded-none flex items-center justify-center"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Palette dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Accent colour options"
          className="absolute right-0 top-full mt-2 z-[200] border-2 border-foreground bg-background shadow-brutal-lg p-3 rounded-none animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ minWidth: '160px' }}
        >
          {/* Header */}
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40 mb-2.5 select-none">
            Accent Colour
          </p>

          {/* Swatches */}
          <div className="flex flex-col gap-1.5">
            {PALETTE_OPTIONS.map((option) => {
              const isActive = palette === option.key;
              return (
                <button
                  key={option.key}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    playClick();
                    setPalette(option.key);
                    // delay close for a small visual feedback moment
                    setTimeout(() => setOpen(false), 120);
                  }}
                  onMouseEnter={playHover}
                  className={[
                    'flex items-center gap-2.5 px-2 py-1.5 w-full text-left transition-all duration-200 rounded-none',
                    isActive
                      ? 'bg-foreground/10 border border-foreground/40'
                      : 'hover:bg-foreground/5 border border-transparent',
                  ].join(' ')}
                >
                  {/* Colour swatch */}
                  <span
                    className="w-4 h-4 rounded-none border-2 border-foreground/20 shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: option.hex,
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: isActive ? `0 0 8px ${option.hex}88` : 'none',
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-foreground">
                    {option.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto font-mono text-[8px] text-foreground/50 uppercase">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer accent preview bar */}
          <div
            className="mt-3 h-0.5 w-full rounded-none transition-all duration-500"
            style={{
              backgroundColor: `hsl(var(--portfolio-accent))`,
              boxShadow: `0 0 8px hsl(var(--portfolio-accent) / 0.6)`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPaletteCustomizer;
