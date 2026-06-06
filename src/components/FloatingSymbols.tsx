import { memo } from 'react';

const symbols = [
  '</>', '{}', '[]', '()', '=>', '&&', '||', '01', '10', '0x',
  '#!', '**', '/*', '*/', '%%', '++', '--', '!=', '==',
  'AI', 'ML', 'NLP', 'SQL', 'API',
  'import', 'const', 'async', 'await', 'return',
  '∑', '∂', '∞', 'λ', 'π', 'Δ',
  '0xFF', '404', '200', '0b1010',
];

// Deterministic pseudo-random seeded by index to avoid layout shift
const seededRand = (seed: number, max: number, min = 0) => {
  const x = Math.sin(seed + 1) * 10000;
  return min + ((x - Math.floor(x)) * (max - min));
};

const TOTAL = 44;
const animClasses = ['float-sym-a', 'float-sym-b', 'float-sym-c', 'float-sym-d'];

interface SymbolItem {
  text: string;
  left: string;
  top: string;
  fontSize: string;
  duration: string;
  delay: string;
  animClass: string;
}

const items: SymbolItem[] = Array.from({ length: TOTAL }, (_, i) => ({
  text: symbols[i % symbols.length],
  left: `${seededRand(i * 7 + 0, 98, 1).toFixed(2)}%`,
  top: `${seededRand(i * 7 + 1, 105, -5).toFixed(2)}%`,
  fontSize: `${seededRand(i * 7 + 2, 15, 10).toFixed(1)}px`,
  duration: `${seededRand(i * 7 + 3, 42, 18).toFixed(1)}s`,
  delay: `-${seededRand(i * 7 + 4, 22, 0).toFixed(1)}s`,
  animClass: animClasses[i % 4],
}));

const Symbol = memo(({ item }: { item: SymbolItem }) => (
  <span
    className={`absolute font-mono select-none pointer-events-none ${item.animClass}`}
    style={{
      left: item.left,
      top: item.top,
      fontSize: item.fontSize,
      animationDuration: item.duration,
      animationDelay: item.delay,
      color: 'currentColor',
      opacity: 0.12,
    }}
    aria-hidden="true"
  >
    {item.text}
  </span>
));
Symbol.displayName = 'Symbol';

const FloatingSymbols = () => (
  <div
    className="fixed inset-0 z-0 overflow-hidden pointer-events-none text-foreground"
    aria-hidden="true"
  >
    {items.map((item, i) => (
      <Symbol key={i} item={item} />
    ))}
  </div>
);

export default FloatingSymbols;
