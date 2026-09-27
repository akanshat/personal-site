import Link from 'next/link';

import { site } from '@/lib/site';
import { GitHub, LinkedIn, Mail } from './icons';
import { Container, Kbd } from './ui';

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p>
            © {new Date().getFullYear()} {site.name}. Built with Next.js, TypeScript and Tailwind CSS.
          </p>
          <p>
            <Link
              href={site.repo}
              className="underline decoration-line-strong underline-offset-4 hover:text-fg"
            >
              Read the source
            </Link>
            <span className="mx-2">·</span>
            Press <Kbd>⌘K</Kbd> or <Kbd>Ctrl K</Kbd> to jump anywhere
          </p>
        </div>
        <ul className="flex items-center gap-1">
          {[
            { href: site.links.github, label: 'GitHub', icon: GitHub },
            { href: site.links.linkedin, label: 'LinkedIn', icon: LinkedIn },
            { href: `mailto:${site.email}`, label: 'Email', icon: Mail },
          ].map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                className="grid size-9 place-items-center rounded-full transition-colors hover:bg-sunken hover:text-fg"
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <Icon className="size-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
