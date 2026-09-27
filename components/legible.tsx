import clsx from 'clsx';

/**
 * A word that starts out of focus and sharpens letter by letter, like a lens
 * finding focus. Hovering it refocuses. Pure CSS: no JS, SSR-safe, and it
 * falls back to static text under prefers-reduced-motion.
 */
export function Legible({ word, className }: { word: string; className?: string }) {
  return (
    <span className={clsx('legible', className)}>
      <span className="sr-only">{word}</span>
      <span aria-hidden className="inline-block whitespace-nowrap">
        {word.split('').map((char, i) => (
          <span key={i} className="legible-char inline-block" style={{ animationDelay: `${250 + i * 75}ms` }}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
