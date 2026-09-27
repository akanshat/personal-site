'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import clsx from 'clsx';

import avatar from '@/public/avatar.jpg';
import { scrollToCurrentHash } from '@/lib/scroll-to-hash';
import { site } from '@/lib/site';
import { OPEN_PALETTE_EVENT } from './command-palette';
import { Search } from './icons';
import { ThemeToggle } from './theme';
import { Container, Kbd } from './ui';

const nav = [
  { href: '/#work', label: 'Work', match: '/work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/about', label: 'About', match: '/about' },
  { href: '/playground', label: 'Playground', match: '/playground' },
];

const subscribeNoop = () => () => {};

function useIsMac() {
  return useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isMac = useIsMac();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 border-b transition-[background-color,border-color] duration-200',
        scrolled ? 'border-line bg-bg/80 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center gap-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-full pr-2"
          aria-label={`${site.name}, home`}
        >
          <Image
            src={avatar}
            alt=""
            width={32}
            height={32}
            priority
            className="size-8 shrink-0 rounded-full ring-1 ring-line transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="hidden text-[0.95rem] font-semibold tracking-tight sm:inline">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="ml-auto">
          <ul className="flex items-center gap-0.5 text-sm">
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
                      'rounded-full px-3 py-2 transition-colors',
                      active ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="hidden h-9 items-center gap-2 rounded-full border border-line bg-elev/60 pr-1.5 pl-3 text-sm text-subtle transition-colors hover:border-line-strong hover:text-fg md:flex"
            aria-label="Open command menu"
          >
            <Search className="size-3.5" />
            <span>Jump to</span>
            <span className="flex gap-0.5" suppressHydrationWarning>
              <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg md:hidden"
            aria-label="Open command menu"
          >
            <Search className="size-[18px]" />
          </button>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
