import { useState, useEffect } from 'react';
import SectionBlock from './SectionBlock';
import { Award } from 'lucide-react';
import Carousel, { CarouselItemData } from './ReactBitsCarousel';

type Category = 'All' | 'Achievement' | 'Certification';

const achievements: {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  category: Exclude<Category, 'All'>;
  tag: string;
}[] = [
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
  },
];

const CATEGORIES: Category[] = ['All', 'Achievement', 'Certification'];

const categoryAccent: Record<Exclude<Category, 'All'>, string> = {
  Certification: 'bg-primary text-primary-foreground',
  Achievement: 'bg-primary text-primary-foreground',
};

const categoryBorder: Record<Exclude<Category, 'All'>, string> = {
  Certification: 'border-primary',
  Achievement: 'border-primary',
};

const AchievementsSection = () => {
  const [active, setActive] = useState<Category>('All');
  const [carouselWidth, setCarouselWidth] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setCarouselWidth(300);
      } else if (window.innerWidth < 768) {
        setCarouselWidth(340);
      } else if (window.innerWidth < 1024) {
        setCarouselWidth(380);
      } else {
        setCarouselWidth(420);
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
    <SectionBlock id="achievements" title="Achievements">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="mb-8 pb-6 border-b-2 border-primary/20 space-y-4">
        {/* Stats row */}
        <div className="flex items-center gap-3">
          <Award className="w-4 h-4 shrink-0" />
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
            {achievements.length} Achievements
          </span>
          <span className="font-mono text-xs text-foreground/45">
            / {filtered.length} shown
          </span>
        </div>

        {/* Filter pills — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3 sm:px-4 py-1.5 border-2 transition-all duration-200 whitespace-nowrap shrink-0 ${
                active === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)]'
                  : 'bg-background text-foreground border-primary/25 hover:border-primary hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Carousel Container ─────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="relative border-t-2 border-primary pt-10 pb-6 flex items-center justify-center min-h-[500px]">
          <div style={{ height: '480px', position: 'relative' }} className="w-full flex items-center justify-center">
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
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 border-t-2 border-b-2 border-primary text-foreground/30">
          <Award className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-mono text-sm">No certificates in this category</p>
        </div>
      )}
    </SectionBlock>
  );
};

export default AchievementsSection;
