import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="p-2 border-2 border-primary bg-background text-foreground transition-all duration-300 shadow-brutal rounded-none flex items-center justify-center opacity-60 pointer-events-none"
      aria-label="Theme toggle disabled"
      disabled
    >
      <span className="sr-only">Theme switching removed</span>
      <span className="w-4 h-4 block rounded-full bg-emerald-400" />
    </button>
  );
};

export default ThemeToggle;
