import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  Cpu,
  Wrench,
  Zap,
  Layers,
  Box,
  Brain,
  Database,
  LineChart,
  Cloud,
  Globe,
} from 'lucide-react';
import SectionBlock from './SectionBlock';
import GithubGraph from './GithubGraph';
import { playHover } from '@/hooks/useSoundEffects';

const skillCategories = [
  {
    title: 'Core Programming',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-blue-50',
    skills: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'Software Engineering'],
  },
  {
    title: 'Generative AI & LLMs',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-pink-50',
    skills: [
      'Generative AI',
      'Large Language Models (LLMs)',
      'Retrieval-Augmented Generation (RAG)',
      'RAG Pipelines',
      'Agentic AI',
      'Multi-Agent Systems',
      'AI Chatbots',
      'LangChain',
      'LlamaIndex',
      'Hugging Face',
      'Prompt Engineering',
      'Prompt Optimization',
      'Semantic Search',
      'Embeddings',
    ],
  },
  {
    title: 'Machine Learning & AI Core',
    icon: <Cpu className="w-5 h-5" />,
    color: 'bg-green-50',
    skills: [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing (NLP)',
      'Computer Vision',
      'PyTorch',
      'TensorFlow',
      'Scikit-Learn',
      'OpenCV',
      'YOLO',
      'Fine-Tuning',
      'Model Evaluation',
      'Model Deployment',
      'AI System Design',
      'AI Automation',
    ],
  },
  {
    title: 'Web & API Development',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-orange-50',
    skills: [
      'HTML',
      'CSS',
      'ReactJS',
      'Bootstrap',
      'FastAPI',
      'REST APIs',
      'Webflow',
      'Framer',
      'SEO',
    ],
  },
  {
    title: 'Databases & Vector Storage',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-purple-50',
    skills: [
      'SQL',
      'Database Design',
      'Vector Databases',
      'ChromaDB',
      'FAISS',
      'Pinecone',
      'MongoDB',
      'PostgreSQL',
      'Redis',
    ],
  },
  {
    title: 'Data & Analytics',
    icon: <LineChart className="w-5 h-5" />,
    color: 'bg-cyan-50',
    skills: [
      'Data Analysis',
      'Data Visualization',
      'Streamlit',
      'Power BI',
      'Excel',
    ],
  },
  {
    title: 'Cloud & MLOps',
    icon: <Cloud className="w-5 h-5" />,
    color: 'bg-teal-50',
    skills: [
      'AWS',
      'Azure',
      'Google Cloud Platform',
      'Docker',
      'Kubernetes',
      'MLOps',
      'MLflow',
      'CI/CD',
      'DevOps',
      'Git',
      'GitHub',
      'Figma',
      'UI/UX Design',
    ],
  },
  {
    title: 'Soft Skills',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-gray-50',
    skills: [
      'Communication',
      'Team Collaboration',
      'Problem Solving',
      'Leadership',
      'Adaptability',
    ],
  },
];

const SkillsSection = () => {
  return (
    <SectionBlock id="skills" title="Technical Arsenal">
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Skill Modules */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-50px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div
                onMouseEnter={playHover}
                className="group border-2 border-foreground p-4 sm:p-6 bg-background h-full relative rounded-none shadow-brutal-3d hover:shadow-brutal-3d-hover transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 border-2 border-foreground bg-foreground text-background group-hover:bg-background group-hover:text-foreground transition-colors rounded-none">
                    {category.icon}
                  </div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 border border-foreground/10 text-[11px] font-mono hover:border-foreground hover:bg-foreground/5 transition-all cursor-default rounded-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Final "Load" Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <div
              onMouseEnter={playHover}
              className="h-full border-2 border-foreground p-4 sm:p-6 bg-foreground/5 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-all rounded-none"
            >
              <Box className="w-8 h-8 mb-4 opacity-20" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium">
                // Always Learning...
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Activity Section */}
        <motion.div
          className="w-full pt-8 md:pt-12 border-t-4 border-foreground border-dashed"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-none animate-pulse" />
                Live Pulse
              </h3>
              <div className="h-[2px] flex-1 bg-foreground/10"></div>
            </div>
            <GithubGraph />
          </div>
        </motion.div>
      </div>
    </SectionBlock>
  );
};

export default SkillsSection;
