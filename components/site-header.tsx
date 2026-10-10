'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { scrollToCurrentHash } from '@/lib/scroll-to-hash';
import { site } from '@/lib/site';
import { OPEN_PALETTE_EVENT } from './command-palette';
import { Blossom, Search } from './icons';
import { ThemeToggle } from './theme';
import { Container } from './ui';

const nav = [
  { href: '/#work', label: 'work', match: '/work' },
  { href: '/#experience', label: 'experience' },
  { href: '/about', label: 'about', match: '/about' },
  { href: '/playground', label: 'playground', match: '/playground' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header>
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-6">
        <Link
          href="/"
          className="group mr-auto flex items-center gap-2 font-display text-[1.15rem] font-bold tracking-[-0.02em] text-fg"
        >
          <Blossom className="size-[1.15em] transition-transform duration-500 ease-out group-hover:rotate-[72deg]" />
          {site.name}
        </Link>

        <nav aria-label="Primary" className="order-last w-full sm:order-none sm:w-auto">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[0.78rem]">
            {nav.map((item) => {
              const active = item.match ? pathname.startsWith(item.match) : false;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      if (scrollToCurrentHash(item.href)) e.preventDefault();
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'decoration-fg decoration-[1.5px] underline-offset-[5px] hover:text-fg hover:underline',
                      active ? 'text-fg underline' : 'text-muted',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href={site.cv}
                target="_blank"
                rel="noreferrer"
                className="text-muted decoration-fg decoration-[1.5px] underline-offset-[5px] hover:text-fg hover:underline"
              >
                CV
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg"
            aria-label="Open command menu"
            title="Jump anywhere (⌘K)"
          >
            <Search className="size-[18px]" />
          </button>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
