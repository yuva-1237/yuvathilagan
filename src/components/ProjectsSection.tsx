import { useState, useRef } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionBlock from './SectionBlock';
import { Badge } from './ui/badge';
import { playHover, playClick } from '@/hooks/useSoundEffects';

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterKey = 'all' | 'ai' | 'web' | 'data';

interface Project {
  title: string;
  isNew?: boolean;
  description: string;
  tags: string[];
  categories: FilterKey[];
  githubUrl: string;
  liveUrl?: string;
}

// ─── Filter definitions ───────────────────────────────────────────────────────
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI & ML' },
  { key: 'web', label: 'Web' },
  { key: 'data', label: 'Data Analytics' },
];

// ─── Project data ────────────────────────────────────────────────────────────
const projects: Project[] = [
  {
    title: 'Exam Forge',
    isNew: true,
    description:
      'Premium exam platform built with TypeScript and modern UI patterns, delivered as a live GitHub Pages deployment for immersive learning workflows.',
    tags: ['TypeScript', 'React', 'UI Design', 'GitHub Pages', 'Web App'],
    categories: ['web'],
    githubUrl: 'https://github.com/yuva-1237/exam-forge',
    liveUrl: 'https://yuva-1237.github.io/exam-forge/',
  },
  {
    title: 'FIFA World Cup EDA',
    description:
      'Data analytics project using Python, pandas, matplotlib, and seaborn to uncover historical FIFA World Cup trends, correlations, and tournament insights.',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Data Analytics'],
    categories: ['data'],
    githubUrl: 'https://github.com/yuva-1237/EDA',
  },
  {
    title: 'Amazon Reviews Sentiment Analysis',
    description:
      'NLP pipeline for classifying Amazon review sentiment with TextBlob, delivering text analysis and visualization of positive, neutral, and negative trends.',
    tags: [
      'Python',
      'NLP',
      'TextBlob',
      'Machine Learning',
      'Sentiment Analysis',
    ],
    categories: ['ai', 'data'],
    githubUrl: 'https://github.com/yuva-1237/SentimentAnalysis_Using_NLP',
  },
  {
    title: 'FIFA Web Scraper',
    description:
      'Playwright-powered automation workflow that scrapes, cleans, and exports FIFA World Cup tournament data into analysis-ready datasets.',
    tags: [
      'Python',
      'Playwright',
      'Web Scraping',
      'Automation',
      'Data Pipeline',
    ],
    categories: ['data', 'web'],
    githubUrl: 'https://github.com/yuva-1237/Web_scraping',
  },
  {
    title: 'FIFA Data Visualization',
    description:
      'Visual storytelling for FIFA World Cup history using Python charting tools and statistical dashboards to make data-driven insights accessible.',
    tags: ['Python', 'Pandas', 'Visualization', 'Seaborn', 'FIFA Analytics'],
    categories: ['data'],
    githubUrl: 'https://github.com/yuva-1237/Data_Visualization',
  },
  {
    title: 'Python Quiz Game',
    description:
      'Interactive Python quiz experience deployed on Vercel, designed for engaging learning and real-time quiz completion.',
    tags: ['Python', 'Interactive', 'Quiz', 'Vercel', 'Game'],
    categories: ['web'],
    githubUrl: 'https://github.com/yuva-1237/python-basic-quiz-game',
  },
];

// ─── Card enter/exit variants ─────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.96,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter));

  return (
    <SectionBlock id="projects" title="Projects">
      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => {
          const count =
            f.key === 'all'
              ? projects.length
              : projects.filter((p) => p.categories.includes(f.key)).length;

          const isActive = activeFilter === f.key;

          return (
            <button
              key={f.key}
              id={`filter-${f.key}`}
              onClick={() => {
                playClick();
                setActiveFilter(f.key);
              }}
              onMouseEnter={playHover}
              aria-pressed={isActive}
              aria-label={`Filter by ${f.label} (${count} projects)`}
              className={[
                'relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border-2 font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-none select-none',
                isActive
                  ? 'bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                  : 'bg-background text-foreground border-foreground/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)] hover:border-foreground hover:shadow-[4px_4px_0px_0px] hover:shadow-foreground/40 hover:-translate-x-[1px] hover:-translate-y-[1px]',
              ].join(' ')}
            >
              <span>{f.label}</span>
              {/* Live count pill */}
              <span
                className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black rounded-none border transition-colors duration-200',
                  isActive
                    ? 'bg-background text-foreground border-background/40'
                    : 'bg-foreground/8 text-foreground border-foreground/10',
                ].join(' ')}
              >
                {count}
              </span>

              {/* Active indicator — animated underline */}
              {isActive && (
                <motion.span
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}

        {/* Total label */}
        <span className="ml-auto self-center font-mono text-[10px] text-foreground/40 uppercase tracking-widest hidden sm:block">
          {filtered.length} / {projects.length} shown
        </span>
      </div>

      {/* ── Project Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="w-full h-full"
              onMouseEnter={playHover}
            >
              <div className="group relative w-full h-full border-2 border-foreground px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-300 bg-background rounded-none min-h-[360px] sm:min-h-[480px]">
                {/* "Latest Work" badge */}
                {project.isNew && (
                  <div className="absolute -top-3 -right-3 bg-foreground text-background px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-foreground z-10 rotate-3 group-hover:rotate-0 transition-transform">
                    LATEST WORK
                  </div>
                )}

                <div>
                  {/* Category dots */}
                  <div className="flex gap-1.5 mb-4">
                    {project.categories.map((cat) => {
                      const match = FILTERS.find((f) => f.key === cat);
                      return match ? (
                        <span
                          key={cat}
                          title={match.label}
                          className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-foreground/10 bg-foreground/5 text-foreground/50"
                        >
                          {match.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-black text-foreground leading-tight text-lg sm:text-xl">
                      {project.title}
                    </h3>
                  </div>

                  <p className="body-text mb-8 font-normal leading-relaxed text-foreground/80 text-xs line-clamp-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.slice(0, 8).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="font-mono text-[9px] font-bold border border-black/5 bg-black/5 px-2 py-0.5 rounded-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 8 && (
                      <span className="text-[9px] font-bold opacity-30">
                        +{project.tags.length - 8}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    aria-label={`View ${project.title} source code on GitHub`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-foreground bg-background text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px] shadow-foreground/50 hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-foreground hover:text-background"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Source
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      aria-label={`View ${project.title} live demo`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-foreground bg-foreground text-background text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px] shadow-foreground/50 hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-background hover:text-foreground"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state — when no projects match */}
        {filtered.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full py-20 text-center"
          >
            <p className="font-mono text-sm uppercase tracking-widest text-foreground/40">
              No projects in this category yet.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── GitHub Link ── */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <a
          href="https://github.com/yuva-1237"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClick}
          className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-1 hover:gap-5 transition-all w-fit"
        >
          <Github className="w-4 h-4" />
          Explore Original Repositories
        </a>
      </motion.div>
    </SectionBlock>
  );
};

export default ProjectsSection;
