import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import EducationSection from '@/components/EducationSection';
import ExperienceSection from '@/components/ExperienceSection';
import AchievementsSection from '@/components/AchievementsSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import ScrollToTop from '@/components/ScrollToTop';
import Finale from '@/components/Finale';
import EasterEgg from '@/components/EasterEgg';
import BackgroundEffects from '@/components/BackgroundEffects';
import CustomCursor from '@/components/CustomCursor';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {/* Premium AI/F1-inspired boot sequence — fades out after ~3s */}
      {!loadingDone && (
        <LoadingScreen onComplete={() => setLoadingDone(true)} />
      )}

      {/* Main portfolio — rendered underneath (hidden until loader fades) */}
      <div
        className="min-h-screen bg-background text-foreground"
        style={{
          opacity: loadingDone ? 1 : 0,
          transition: 'opacity 0.5s ease-in',
        }}
      >
        <CustomCursor />
        <BackgroundEffects />
        <EasterEgg />
        <Navbar />
        <ScrollToTop />
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <AchievementsSection />
        <ProjectsSection />
        {/* <BlogSection /> */}
        <SkillsSection />
        <ContactSection />
        <Finale />
      </div>
    </>
  );
};

export default Index;
