import { useState } from 'react';
import SectionBlock from './SectionBlock';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

type Category = 'All' | 'Achievement';

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
    title: '32 Public GitHub Repositories',
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

const CATEGORIES: Category[] = ['All', 'Achievement'];

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
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered =
    active === 'All'
      ? achievements
      : achievements.filter((a) => a.category === active);

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

      {/* ── List ─────────────────────────────────────────── */}
      <div className="border-t-2 border-primary">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: idx * 0.07,
            }}
            className="group relative border-b-2 border-primary bg-background overflow-hidden"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* ── Accent fill slides up on hover (desktop only) */}
            <div
              className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out pointer-events-none hidden sm:block"
              aria-hidden="true"
            />

            {/* ── Thumbnail slides in from right on desktop hover */}
            <div
              className="absolute top-0 right-0 h-full w-44 lg:w-56 z-10 overflow-hidden pointer-events-none
                          translate-x-full group-hover:translate-x-0
                          transition-transform duration-500 ease-in-out
                          hidden sm:block"
              aria-hidden="true"
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
              <div
                className={`absolute left-0 top-0 h-full border-l-4 ${categoryBorder[item.category]}`}
              />
            </div>

            {/* ═══════════════════════════════════
                MOBILE layout  (< sm)
                Small thumbnail always visible + stacked text
            ════════════════════════════════════ */}
            <div className="flex sm:hidden items-start gap-3 px-4 py-4 transition-colors">
              {/* Thumbnail */}
              <div className="w-16 h-16 shrink-0 overflow-hidden border-2 border-primary/20">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Text block */}
              <div className="flex-1 min-w-0">
                {/* Category + date on same line */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-mono font-black px-1.5 py-0.5 leading-none ${categoryAccent[item.category]}`}
                  >
                    {item.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[9px] text-foreground/45 tracking-widest uppercase">
                    {item.date}
                  </span>
                </div>
                <h3 className="font-black text-sm leading-snug tracking-tight mb-0.5 line-clamp-2">
                  {item.title}
                </h3>
                <p className="font-mono text-[10px] text-foreground/55 line-clamp-1">
                  {item.issuer}
                </p>
              </div>
            </div>

            {/* ═══════════════════════════════════
                TABLET / DESKTOP layout  (≥ sm)
                Full row
            ════════════════════════════════════ */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-5 lg:py-6 pr-[12rem] lg:pr-[15rem] relative z-20 transition-colors duration-500">
              {/* Index */}
              <span className="font-mono text-xs font-bold text-foreground/30 group-hover:text-primary-foreground/40 transition-colors duration-300 w-6 shrink-0 select-none">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Category pill */}
              <span
                className={`text-[10px] font-mono font-black px-2 py-1 shrink-0 leading-none border border-primary group-hover:border-primary-foreground ${categoryAccent[item.category]} group-hover:bg-primary-foreground group-hover:text-primary transition-all duration-300`}
              >
                {item.category.toUpperCase()}
              </span>

              {/* Title + issuer */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base lg:text-lg leading-tight tracking-tight group-hover:text-primary-foreground transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-foreground/55 group-hover:text-primary-foreground/75 transition-colors duration-300 mt-0.5">
                  {item.issuer}
                </p>
              </div>

              {/* Tag chip — desktop only */}
              <span className="hidden lg:inline-block font-mono text-[10px] border border-primary/20 bg-background/50 group-hover:bg-primary-foreground/10 group-hover:border-primary-foreground/40 px-2 py-1 text-foreground/60 group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                {item.tag}
              </span>

              {/* Date */}
              <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/45 group-hover:text-primary-foreground/60 transition-colors duration-300 shrink-0">
                {item.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 border-b-2 border-primary text-foreground/30">
          <Award className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-mono text-sm">No certificates in this category</p>
        </div>
      )}
    </SectionBlock>
  );
};

export default AchievementsSection;
