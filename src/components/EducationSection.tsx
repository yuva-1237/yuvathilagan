import SectionBlock from './SectionBlock';
import { motion } from 'framer-motion';

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  description?: string[];
}

const education: EducationItem[] = [
  {
    degree: 'Bachelor of Engineering (B.E.) – Computer Science and Engineering',
    school: 'Prathyusha Engineering College, Anna University',
    year: 'Expected Graduation: June 2028',
    description: [
      'Pursuing an undergraduate degree focused on core computer science concepts and engineering practices.',
      'Developing expertise in Machine Learning, NLP, Data Analytics, and Full Stack Development.',
      'Actively participating in academic projects and technical hackathons.',
    ],
  },
];

const EducationSection = () => (
  <SectionBlock id="education" title="Education">
    <div className="space-y-10">
      {education.map((item, idx) => (
        <motion.div
          key={item.degree}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
          className="border-l-2 border-foreground/20 pl-6 py-2 hover:border-foreground transition-colors duration-300"
        >
          <h3 className="text-base md:text-lg font-bold text-foreground">
            {item.degree}
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-2">
            <span className="text-sm font-medium text-foreground">
              {item.school}
            </span>
            <span className="hidden md:inline text-foreground/20">•</span>
            <span className="font-mono text-xs text-foreground/60">
              {item.year}
            </span>
          </div>
          {item.description && (
            <ul className="mt-4 space-y-2 list-disc list-outside pl-4 text-sm text-foreground/80">
              {item.description.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                  className="leading-relaxed"
                >
                  {point}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </div>
  </SectionBlock>
);

export default EducationSection;
