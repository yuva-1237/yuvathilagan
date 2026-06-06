import { BookOpen } from 'lucide-react';
import SectionBlock from './SectionBlock';

// BlogSection is currently disabled — no blog URL provided.
// Re-enable in Index.tsx once a blog host is configured.

const BlogSection = () => {
  return (
    <SectionBlock id="blog" title="Latest Writing">
      <div className="flex flex-col gap-8">
        <p className="body-text max-w-2xl">
          Coming soon — blog posts will appear here once a publication is configured.
        </p>
        <div className="col-span-full py-12 text-center border-2 border-black border-dashed opacity-50">
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="font-mono text-sm uppercase tracking-widest">
            No blog posts yet. Check back soon!
          </p>
        </div>
      </div>
    </SectionBlock>
  );
};

export default BlogSection;
