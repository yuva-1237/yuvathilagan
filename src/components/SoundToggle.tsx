import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import useSoundEffects from '@/hooks/useSoundEffects';

const SoundToggle = () => {
  const { setMasterVolume, getMasterVolume, playClick, playHover } =
    useSoundEffects();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('site_muted');
    if (saved === 'true') {
      setIsMuted(true);
      setMasterVolume(0);
    }
  }, [setMasterVolume]);

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setMasterVolume(newMuted ? 0 : 0.8);
    localStorage.setItem('site_muted', String(newMuted));
    if (!newMuted) {
      // Small feedback sound when unmuting
      setTimeout(() => playClick(), 50);
    }
  };

  return (
    <button
      onClick={toggleSound}
      onMouseEnter={playHover}
      className="p-2 border-2 border-primary bg-background hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-300 shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 rounded-none flex items-center justify-center"
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
};

export default SoundToggle;
