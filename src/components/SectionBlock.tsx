import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionBlockProps {
  id: string;
  title: string;
  children: ReactNode;
}

const SectionBlock = ({ id, title, children }: SectionBlockProps) => {
  return (
    <section
      id={id}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-24 lg:py-32"
    >
      {/* Title — drops down from top as you scroll into view */}
      <motion.h2
        className="section-title mb-6 md:mb-10 lg:mb-12"
        initial={{ opacity: 0, y: -60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}.
      </motion.h2>

      {/* Content — rises up from bottom as you scroll into view */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionBlock;
