import SectionBlock from './SectionBlock';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Data Analyst Intern',
    company: 'CodeAlpha',
    period: '[2026]',
    description:
      'Analyzed 50K+ records using Python, SQL, and Excel. Automated reporting workflows reducing manual effort by 35%. Performed Exploratory Data Analysis (EDA) and generated actionable business insights.',
  },
  {
    role: 'UI Developer Intern',
    company: 'Thenam Software Solutions',
    period: '[2025]',
    description:
      'Converted wireframes into responsive web applications. Developed reusable UI components. Improved overall usability and user experience.',
  },
  {
    role: 'Graphic Designer Intern',
    company: 'Thenam Software Solutions',
    period: '[2026]',
    description:
      'Designed visually engaging graphics and marketing materials. Created brand-consistent designs across digital platforms. Enhanced user engagement through effective visual communication.',
  },
  {
    role: 'Software Developer Intern',
    company: 'Slesea Digital',
    period: '[2025]',
    description:
      'Built and optimized web application features. Developed responsive interfaces using HTML, CSS, and JavaScript.',
  },
];

const ExperienceSection = () => (
  <SectionBlock id="experience" title="Experience">
    <div className="space-y-8 md:space-y-12">
      {experiences.map((exp, idx) => (
        <motion.div
          key={exp.role}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: idx * 0.08 }}
          className="relative pl-8 md:pl-0 border-l md:border-l-0 border-foreground/20 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-8 md:pb-12 last:pb-0"
        >
          <div className="md:text-right md:pr-8 md:border-r border-foreground/20 relative">
            <div className="hidden md:block absolute top-1 -right-[5px] w-[9px] h-[9px] rounded-none bg-foreground"></div>
            <div className="md:hidden absolute top-1 -left-[5px] w-[9px] h-[9px] rounded-none bg-foreground"></div>

            <h4 className="font-mono text-xs tracking-widest text-foreground/60 uppercase mb-1">
              {exp.period}
            </h4>
            <h3 className="font-bold text-base md:text-lg">{exp.company}</h3>
          </div>

          <div className="mt-2 md:mt-0">
            <h3 className="text-base font-bold text-foreground md:hidden mb-2">
              {exp.role}
            </h3>
            <h3 className="text-lg font-bold text-foreground hidden md:block mb-3">
              {exp.role}
            </h3>
            <p className="body-text text-sm">{exp.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </SectionBlock>
);

export default ExperienceSection;
