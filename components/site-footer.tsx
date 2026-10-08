import Link from 'next/link';

import { site } from '@/lib/site';
import { PaletteShuffle } from './palette';
import { LocalTime } from './status';
import { Container, Kbd } from './ui';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="flex flex-wrap justify-between gap-x-6 gap-y-3 py-7 pb-10 font-mono text-[0.72rem] text-subtle">
        <span>
          © {new Date().getFullYear()} {site.name} · <LocalTime /> in {site.location}
        </span>
        <PaletteShuffle />
        <span>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted underline hover:text-fg"
          >
            GitHub
          </a>{' '}
          ·{' '}
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-muted underline hover:text-fg"
          >
            LinkedIn
          </a>{' '}
          ·{' '}
          <Link href={site.repo} className="text-muted underline hover:text-fg">
            source
          </Link>{' '}
          · <Kbd>⌘K</Kbd> to jump anywhere
        </span>
      </Container>
    </footer>
  );
}
