'use client';

import clsx from 'clsx';

import { site } from '@/lib/site';
import { useCopy } from './status';

/** The email address, shown in full with a copy button, then CV, LinkedIn and GitHub. */
export function Reach({ className }: { className?: string }) {
  const { copied, copy } = useCopy(site.email);
  return (
    <div className={clsx('flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[0.78rem]', className)}>
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-[10px] border-[1.5px] border-fg py-1.5 pr-1.5 pl-3.5">
        <span className="[overflow-wrap:anywhere] select-all">{site.email}</span>
        <button
          type="button"
          onClick={copy}
          data-burst
          className="rounded-md bg-fg px-2.5 py-1 text-[0.72rem] text-bg transition-colors hover:bg-accent hover:text-accent-fg"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied' : ''}
        </span>
      </span>
      <a href={site.cv} target="_blank" rel="noreferrer" className="link">
        CV
      </a>
      <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="link">
        LinkedIn
      </a>
      <a href={site.links.github} target="_blank" rel="noreferrer" className="link">
        GitHub
      </a>
    </div>
  );
}
