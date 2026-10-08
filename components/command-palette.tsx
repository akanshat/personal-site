'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';

import { scrollToCurrentHash } from '@/lib/scroll-to-hash';
import { site } from '@/lib/site';
import { caseStudies } from '@/lib/work';
import { ArrowRight, ArrowUpRight, Copy, FileText, GitHub, LinkedIn, Moon, Search } from './icons';
import { useCopy } from './status';
import { useToggleTheme } from './theme';
import { Kbd } from './ui';

export const OPEN_PALETTE_EVENT = 'palette:open';

type Action =
  { type: 'go'; href: string } | { type: 'open'; href: string } | { type: 'copy' } | { type: 'theme' };

type Command = {
  id: string;
  group: 'Navigate' | 'Case studies' | 'Actions' | 'Elsewhere';
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  action: Action;
};

/** Commands are plain data; behaviour lives in one event-time `run` function. */
const COMMANDS: Command[] = [
  { id: 'home', group: 'Navigate', label: 'Home', icon: <ArrowRight />, action: { type: 'go', href: '/' } },
  {
    id: 'work',
    group: 'Navigate',
    label: 'Case studies',
    icon: <ArrowRight />,
    action: { type: 'go', href: '/#work' },
  },
  {
    id: 'exp',
    group: 'Navigate',
    label: 'Experience',
    keywords: 'cv resume jobs',
    icon: <ArrowRight />,
    action: { type: 'go', href: '/#experience' },
  },
  {
    id: 'about',
    group: 'Navigate',
    label: 'About',
    icon: <ArrowRight />,
    action: { type: 'go', href: '/about' },
  },
  {
    id: 'contact',
    group: 'Navigate',
    label: 'Contact',
    icon: <ArrowRight />,
    action: { type: 'go', href: '/#contact' },
  },
  ...caseStudies.map<Command>((c) => ({
    id: c.slug,
    group: 'Case studies',
    label: c.title,
    hint: c.org,
    keywords: c.tags.join(' '),
    icon: <ArrowRight />,
    action: { type: 'go', href: `/work/${c.slug}` },
  })),
  {
    id: 'copy',
    group: 'Actions',
    label: 'Copy email address',
    hint: site.email,
    keywords: 'mail contact hire',
    icon: <Copy />,
    action: { type: 'copy' },
  },
  {
    id: 'cv',
    group: 'Actions',
    label: 'Download CV (PDF)',
    keywords: 'resume',
    icon: <FileText />,
    action: { type: 'open', href: site.cv },
  },
  {
    id: 'theme',
    group: 'Actions',
    label: 'Toggle light / dark theme',
    keywords: 'dark mode',
    icon: <Moon />,
    action: { type: 'theme' },
  },
  {
    id: 'gh',
    group: 'Elsewhere',
    label: 'GitHub',
    hint: '@akanshat',
    icon: <GitHub />,
    action: { type: 'open', href: site.links.github },
  },
  {
    id: 'li',
    group: 'Elsewhere',
    label: 'LinkedIn',
    icon: <LinkedIn />,
    action: { type: 'open', href: site.links.linkedin },
  },
  {
    id: 'src',
    group: 'Elsewhere',
    label: 'Source code of this site',
    keywords: 'repo',
    icon: <ArrowUpRight />,
    action: { type: 'open', href: site.repo },
  },
];

/** Subsequence match with a small bonus for contiguous and word-start hits. */
function score(query: string, text: string) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let total = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      streak++;
      total += 1 + streak + (ti === 0 || t[ti - 1] === ' ' ? 2 : 0);
      qi++;
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? total : 0;
}

export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const { copied, copy } = useCopy(site.email);
  const { toggle } = useToggleTheme();

  const close = useCallback(() => dialogRef.current?.close(), []);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery('');
    setActive(0);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);

  const run = (command: Command) => {
    const { action } = command;
    if (action.type === 'copy') return void copy();
    if (action.type === 'theme') return toggle();
    close();
    if (action.type === 'go') {
      if (!scrollToCurrentHash(action.href)) router.push(action.href);
    } else window.open(action.href, '_blank', 'noopener,noreferrer');
  };

  const results = useMemo(
    () =>
      COMMANDS.map((c) => ({ c, s: score(query, `${c.label} ${c.group} ${c.keywords ?? ''}`) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => (query ? b.s - a.s : 0))
        .map((r, i, arr) => ({ ...r.c, header: !query && (i === 0 || arr[i - 1]!.c.group !== r.c.group) })),
    [query],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    const onOpen = () => open();
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [close, open]);

  // Keep the highlighted option visible while arrowing through the list.
  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = results[active];
      if (picked) run(picked);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command menu"
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="fixed inset-x-0 top-[12vh] bottom-auto mx-auto my-0 w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line-strong bg-elev p-0 text-fg shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 shrink-0 text-subtle" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
          aria-autocomplete="list"
          placeholder="Where to? Try “timeline”, “cv” or “dark”"
          className="h-13 w-full bg-transparent text-[0.95rem] outline-none placeholder:text-subtle"
          spellCheck={false}
        />
        <Kbd>esc</Kbd>
      </div>
      <ul
        id={listId}
        role="listbox"
        aria-label="Commands"
        className="max-h-[min(60vh,24rem)] overflow-y-auto p-2"
      >
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-subtle">No matches for “{query}”.</li>
        )}
        {results.map((c, i) => {
          const header = c.header ? c.group : null;
          return (
            <li key={c.id} role="presentation">
              {header && (
                <div className="px-3 pt-3 pb-1.5 font-mono text-[0.68rem] tracking-[0.12em] text-subtle uppercase">
                  {header}
                </div>
              )}
              <div
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => run(c)}
                className={clsx(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm [&_svg]:size-4 [&_svg]:shrink-0',
                  i === active
                    ? 'bg-accent-soft text-fg [&_svg]:text-accent'
                    : 'text-muted [&_svg]:text-subtle',
                )}
              >
                {c.icon}
                <span className="truncate">{c.id === 'copy' && copied ? 'Copied!' : c.label}</span>
                {c.hint && <span className="ml-auto truncate font-mono text-xs text-subtle">{c.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-subtle">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> to select
        </span>
      </div>
    </dialog>
  );
}
