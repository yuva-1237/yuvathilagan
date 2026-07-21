import { useState, useEffect } from 'react';
import SectionBlock from './SectionBlock';
import { Award } from 'lucide-react';
import Carousel, { CarouselItemData } from './ReactBitsCarousel';
import { motion } from 'framer-motion';

type Category = 'All' | 'Achievement' | 'Certification';

interface AchievementData {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  category: Exclude<Category, 'All'>;
  tag: string;
  skills: string[];
}

const achievements: AchievementData[] = [
  {
    title: 'Multi-Domain Internship Experience',
    issuer: 'Professional Development',
    date: '2026',
    description:
      'Completed internships across Data Analytics, UI Development, Graphic Design, and Software Development to build cross-functional technical expertise.',
    image:
      'https://placehold.co/600x400/000000/FFFFFF/png?text=Internship+Experience',
    category: 'Achievement',
    tag: 'Internships',
    skills: ['Data Analytics', 'UI Development', 'Graphic Design', 'Software Development'],
  },
  {
    title: 'Academic Project Leadership',
    issuer: 'Team Collaboration',
    date: '2026',
    description:
      'Led academic project teams through planning, execution, and delivery while mentoring peers and maintaining high quality standards.',
    image:
      'https://placehold.co/600x400/000000/FFFFFF/png?text=Project+Leadership',
    category: 'Achievement',
    tag: 'Leadership',
    skills: ['Team Leadership', 'Project Planning', 'Mentoring', 'Agile'],
  },
  {
    title: 'Hackathon & Technical Event Participation',
    issuer: 'Professional Growth',
    date: 'Ongoing',
    description:
      'Participated in hackathons and technical events to strengthen problem solving, rapid prototyping, and collaborative innovation skills.',
    image: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Hackathons',
    category: 'Achievement',
    tag: 'Innovation',
    skills: ['Rapid Prototyping', 'Hackathons', 'Problem Solving', 'Collaboration'],
  },
  {
    title: 'Professional Certifications',
    issuer: 'Skill Development',
    date: 'Ongoing',
    description:
      'Pursued targeted certifications in Data Analytics, Full Stack Development, Python, SQL, AI Fundamentals, Java, and C/C++ to strengthen technical foundations.',
    image: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Certifications',
    category: 'Achievement',
    tag: 'Certification',
    skills: ['Full Stack', 'Python', 'SQL', 'AI Fundamentals', 'Java', 'C/C++'],
  },
  {
    title: 'Technical Certification Portfolio',
    issuer: 'Professional Credentials',
    date: 'Ongoing',
    description:
      'Completed certification pathways across analytics, AI, software development, programming, and database technologies for a well-rounded technical profile.',
    image:
      'https://placehold.co/600x400/000000/FFFFFF/png?text=Technical+Certifications',
    category: 'Achievement',
    tag: 'Certification',
    skills: ['Data Analytics', 'AI', 'Database Technologies', 'Programming'],
  },
  {
    title: 'Communication & Collaboration',
    issuer: 'Soft Skills',
    date: 'Ongoing',
    description:
      'Demonstrated strong collaboration, communication, presentation, and negotiation skills across team-based projects and internship environments.',
    image: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Communication',
    category: 'Achievement',
    tag: 'Soft Skills',
    skills: ['Communication', 'Presentation', 'Negotiation', 'Team Collaboration'],
  },
  {
    title: 'Time Management & Adaptability',
    issuer: 'Workplace Readiness',
    date: 'Ongoing',
    description:
      'Managed deadlines effectively while adapting to shifting priorities and project requirements in both academic and internship settings.',
    image:
      'https://placehold.co/600x400/000000/FFFFFF/png?text=Time+Management',
    category: 'Achievement',
    tag: 'Productivity',
    skills: ['Time Management', 'Prioritization', 'Workplace Readiness', 'Adaptability'],
  },
  {
    title: '30+ Public GitHub Repositories',
    issuer: 'GitHub Portfolio',
    date: 'Ongoing',
    description:
      'Maintains a growing GitHub portfolio with 32 public repositories across Python, TypeScript, JavaScript, HTML, and CSS.',
    image:
      'https://placehold.co/600x400/000000/FFFFFF/png?text=GitHub+Portfolio',
    category: 'Achievement',
    tag: 'Repositories',
    skills: ['Git/GitHub', 'Open Source', 'Repository Management', 'Version Control'],
  },
  {
    title: 'Data Analytics Leadership',
    issuer: 'GitHub Projects',
    date: '2026',
    description:
      'Built exploratory analytics and visualization workstreams for FIFA World Cup datasets, turning raw data into actionable insights.',
    image: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Data+Analytics',
    category: 'Achievement',
    tag: 'Data',
    skills: ['Exploratory Data Analysis', 'Data Visualization', 'Pandas', 'FIFA Analytics'],
  },
  {
    title: 'Web Deployment & Automation',
    issuer: 'GitHub Projects',
    date: '2026',
    description:
      'Developed premium web applications and automation systems including a live exam platform and a Playwright-based data scraper.',
    image: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Web+Deployment',
    category: 'Achievement',
    tag: 'Web',
    skills: ['Web Deployment', 'Automation', 'Playwright', 'Web Scraping'],
  },
];

const CATEGORIES: Category[] = ['All', 'Achievement', 'Certification'];

const AchievementsSection = () => {
  const [active, setActive] = useState<Category>('All');
  const [carouselWidth, setCarouselWidth] = useState(880);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        // Mobile: 92% of viewport
        setCarouselWidth(Math.floor(w * 0.92));
      } else if (w < 1024) {
        // Tablet: 700px
        setCarouselWidth(700);
      } else if (w < 1440) {
        // Laptop: 800px
        setCarouselWidth(800);
      } else {
        // Desktop: 880px
        setCarouselWidth(880);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered =
    active === 'All'
      ? achievements
      : achievements.filter((a) => a.category === active);

  // Map achievements to include an id that matches their position in the array
  const carouselItems: CarouselItemData[] = filtered.map((a) => ({
    ...a,
    id: achievements.indexOf(a),
  }));

  return (
    <SectionBlock id="achievements" title="">
      {/* Custom Header Section */}
      <div className="flex flex-col items-center md:items-start mb-[clamp(12px,2.5vw,24px)] select-none">
        <motion.h2
          className="section-title text-center md:text-left mb-3"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Achievements.
        </motion.h2>

        <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-foreground/60">
          <Award className="w-4 h-4 text-primary shrink-0 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
            {achievements.length} Achievements
          </span>
          <span className="font-mono text-xs text-foreground/40">
            / {filtered.length} shown
          </span>
        </div>
      </div>

      {/* Filter pills — grid on mobile (equal width), flex on desktop */}
      <div className="mb-8 pb-6 border-b border-primary/20">
        <div className="grid grid-cols-3 md:flex md:flex-row gap-3 w-full md:w-auto justify-center md:justify-start">
          {CATEGORIES.map((cat) => {
            const displayLabel = cat === 'All' ? 'ALL' : cat === 'Achievement' ? 'ACHIEVEMENTS' : 'CERTIFICATIONS';
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase h-[44px] px-3 sm:px-6 rounded-[8px] border-[1.5px] transition-all duration-300 flex items-center justify-center select-none cursor-pointer ${
                  active === cat
                    ? 'bg-primary text-primary-foreground border-primary font-black shadow-[0_0_14px_var(--portfolio-accent-hex)]'
                    : 'bg-transparent text-foreground/60 border-primary/25 hover:border-primary/80 hover:text-foreground hover:-translate-y-[2px] hover:shadow-[0_0_10px_var(--portfolio-accent-hex)]'
                }`}
                style={{
                  minHeight: '44px',
                }}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Carousel Container ─────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="relative border-t border-primary/20 pt-8 pb-6 flex items-center justify-center">
          <div className="w-full flex items-center justify-center h-[460px] sm:h-[500px] md:h-[540px] lg:h-[600px] relative overflow-visible">
            <Carousel
              items={carouselItems}
              baseWidth={carouselWidth}
              autoplay={true}
              autoplayDelay={4000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          </div>
        </div>
      ) : (
        /* ── Empty state */
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 border-t border-b border-primary/20 text-foreground/30">
          <Award className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-mono text-sm">No certificates in this category</p>
        </div>
      )}
    </SectionBlock>
  );
};

export default AchievementsSection;
