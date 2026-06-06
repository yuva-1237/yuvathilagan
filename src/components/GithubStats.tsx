import React from 'react';
import TiltCard from './ui/TiltCard';
import { playHover } from '@/hooks/useSoundEffects';

const GithubStats = () => {
  const username = 'yuva-1237';

  // Using the 'react' theme which perfectly matches the user's screenshot
  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=react&hide_border=false`;
  const langsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=react&hide_border=false`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 w-full">
      <TiltCard maxTilt={5}>
        <div
          onMouseEnter={playHover}
          className="border-2 md:border-4 border-foreground bg-[#1a1b27] shadow-brutal-3d p-2 h-full flex items-center justify-center overflow-hidden"
        >
          <img
            src={statsUrl}
            alt="GitHub Stats"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </TiltCard>

      <TiltCard maxTilt={5}>
        <div
          onMouseEnter={playHover}
          className="border-2 md:border-4 border-foreground bg-[#1a1b27] shadow-brutal-3d p-2 h-full flex items-center justify-center overflow-hidden"
        >
          <img
            src={langsUrl}
            alt="Top Languages"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </TiltCard>
    </div>
  );
};

export default GithubStats;
