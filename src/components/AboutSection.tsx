import SectionBlock from './SectionBlock';
import AnimatedAvatar from './AnimatedAvatar';
import { BookOpen, MapPin, Github, Code, Cpu, Brain, LineChart } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const AboutSection = () => {
  return (
    <SectionBlock id="about" title="About me">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
        {/* Left Column - Avatar & Quick Specs */}
        <motion.div
          className="w-full lg:w-auto flex flex-col items-center shrink-0"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedAvatar />

          {/* Neobrutalist Info Card */}
          <div className="w-full sm:max-w-[256px] mt-6 border-2 border-foreground bg-background p-4 font-mono text-xs space-y-2.5 shadow-brutal rounded-none">
            <div className="flex justify-between border-b border-foreground/10 pb-1.5">
              <span className="text-foreground/50">NAME:</span>
              <span className="font-bold">YUVATHILAGAN</span>
            </div>
            <div className="flex justify-between border-b border-foreground/10 pb-1.5">
              <span className="text-foreground/50">ROLE:</span>
              <span className="font-bold text-right">AI & DATA ANALYST</span>
            </div>
            <div className="flex items-center justify-between border-b border-foreground/10 pb-1.5">
              <span className="text-foreground/50 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> LOC:
              </span>
              <span className="font-bold">INDIA (IST)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/50 flex items-center gap-1">
                <Github className="w-3.5 h-3.5" /> GITHUB:
              </span>
              <a
                href="https://github.com/yuva-1237"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:bg-foreground hover:text-background px-1 transition-colors duration-150"
              >
                @yuva-1237
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Bio, Stats & Methodology */}
        <div className="flex-1 w-full">
          <div className="space-y-6">
            {[
              'I am a Computer Science Engineering student with expertise in Python, SQL, Machine Learning, NLP, and Data Analytics.',
              'I have experience in developing AI applications, dashboards, and web-based solutions through various internships and academic projects.',
              'My core focus is on building data-driven insights and AI-powered tools that solve complex problems efficiently and cleanly.',
            ].map((text, i) => (
              <motion.p
                key={i}
                className="body-text max-w-3xl"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 md:mt-10">
            {[
              { value: '1+', label: 'Years of Experience' },
              { value: '5+', label: 'Projects Completed' },
              { value: '100%', label: 'Code Quality Focus' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                className="border-2 border-foreground bg-background p-2 sm:p-4 shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none"
              >
                <div className="font-mono text-2xl sm:text-3xl font-black">{stat.value}</div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-foreground/50 mt-1 leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Principles Section */}
          <motion.div
            className="mt-6 md:mt-8 border-2 border-foreground bg-background p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(var(--brutal-black-rgb),1)] rounded-none"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <h3 className="font-mono text-xs font-bold tracking-[0.2em] uppercase mb-6 pb-2 border-b-2 border-foreground/20 flex items-center gap-2">
              <Code className="w-4 h-4" />
              // CORE WORKFLOW PRINCIPLES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Brain className="w-3.5 h-3.5 shrink-0" />,
                  title: 'Problem Solving',
                  desc: 'Identify challenges and develop practical AI-driven solutions.',
                },
                {
                  icon: <LineChart className="w-3.5 h-3.5 shrink-0" />,
                  title: 'Data-Driven Thinking',
                  desc: 'Make decisions based on analysis, experimentation, and insights.',
                },
                {
                  icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
                  title: 'Continuous Learning',
                  desc: 'Adapt to emerging technologies and continuously improve skills.',
                },
                {
                  icon: <Cpu className="w-3.5 h-3.5 shrink-0" />,
                  title: 'Scalable Development',
                  desc: 'Build reliable, maintainable, and production-ready systems.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="space-y-2"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                >
                  <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed font-light pl-5">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default AboutSection;
