import {
  Github,
  Linkedin,
  InstagramIcon,
  Mail,
  Heart,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  instagram: InstagramIcon,
  blog: BookOpen,
};

const Finale = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="relative w-full bg-background border-t-8 border-foreground pt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center">
        {/* CTA Headline */}
        <motion.div
          className="relative mb-10 md:mb-20 text-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-base sm:text-xl md:text-3xl font-black uppercase tracking-tight italic z-10 relative">
            Transforming Ideas into{' '}
            <span className="inline-block bg-foreground px-3 py-1 text-background not-italic tracking-normal shadow-[6px_6px_0px_0px] shadow-foreground/20">
              Intelligent
            </span>{' '}
            Digital Experiences.
          </p>
        </motion.div>

        {/* Social Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full mb-12 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.id];
            if (!Icon) return null;
            return (
              <motion.a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="group flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border-2 border-foreground bg-background hover:bg-foreground transition-all duration-300 shadow-[8px_8px_0px_0px] shadow-foreground/30 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] rounded-none"
              >
                <Icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:text-background transition-colors duration-300" />
                <span className="mt-2 sm:mt-3 md:mt-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-black group-hover:text-background">
                  {link.label}
                </span>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Status + Tagline */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-center px-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border-2 border-green-500 rounded-none">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-none mr-1.5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
              Available for Freelance Projects
            </span>
          </div>
          <p className="text-xs font-mono text-foreground/70 uppercase tracking-widest leading-loose max-w-sm">
            Engineering intelligent systems for a digital-first future.
          </p>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-background pt-8 pb-16 md:pb-10 px-4 sm:px-6 mt-auto border-t border-foreground/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 opacity-70">
          <p className="text-[10px] md:text-[11px] font-mono text-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] text-center md:text-left">
            © {currentYear} {PROFILE.name}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] md:text-[11px] font-mono text-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] text-center md:text-right font-medium">
            <span className="whitespace-nowrap">Designed & Engineered</span>
            <span className="flex items-center gap-2">
              <span>with</span>
              <Heart className="w-3.5 h-3.5 text-foreground fill-foreground animate-heartbeat inline-block" />
              <span>by {PROFILE.alias}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Finale;
