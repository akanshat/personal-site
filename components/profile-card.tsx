'use client';

import Image from 'next/image';
import { useRef, type PointerEvent } from 'react';

import avatar from '@/public/avatar.jpg';
import { experience, site } from '@/lib/site';
import { FileText, GitHub, LinkedIn } from './icons';
import { CopyEmailButton, LocalTime, StatusDot } from './status';

const MAX_TILT = 7; // degrees

/**
 * An ID-badge style card. On a mouse it tilts toward the pointer with a soft
 * sheen; on touch devices or with reduced motion it simply sits still.
 */
export function ProfileCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const setTilt = (x: number, y: number, active: boolean) => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - y) * MAX_TILT}deg`);
      el.style.setProperty('--ry', `${(x - 0.5) * MAX_TILT * 1.3}deg`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      el.dataset.active = active ? 'true' : 'false';
    });
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height, true);
  };

  const onPointerLeave = () => setTilt(0.5, 0.5, false);

  const linkClass =
    'inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-bg text-[0.8rem] font-medium text-muted transition-colors hover:border-accent hover:text-accent';

  return (
    <div className="card-in relative mx-auto w-full max-w-md lg:mr-0">
      {/* A little glitter star, borrowed from the avatar's earring. */}
      <svg
        viewBox="0 0 24 24"
        className="twinkle absolute -top-4 -right-3 z-10 size-9 text-ok drop-shadow-sm"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M12 1.5c.5 4.9 2.7 8.2 9.5 10.5-6.8 2.3-9 5.6-9.5 10.5-.5-4.9-2.7-8.2-9.5-10.5C9.3 9.7 11.5 6.4 12 1.5Z"
        />
      </svg>

      <div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="profile-card group relative overflow-hidden rounded-[1.75rem] border border-line bg-elev shadow-card"
      >
        {/* Sheen that follows the pointer while tilting. */}
        <div className="profile-sheen pointer-events-none absolute inset-0 z-10" aria-hidden />

        {/* Badge slot */}
        <div className="flex justify-center pt-3" aria-hidden>
          <span className="h-1.5 w-14 rounded-full bg-line-strong" />
        </div>

        <div className="flex items-center justify-between gap-3 px-6 pt-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok-soft px-2.5 py-0.5 text-[0.78rem] font-medium text-fg">
            <StatusDot />
            {site.availability}
          </span>
          <span className="font-mono text-[0.75rem] text-subtle">
            <LocalTime />
          </span>
        </div>

        <div className="flex items-center gap-5 px-6 pt-6">
          <Image
            src={avatar}
            alt="Illustrated portrait of Akansha in purple cat-eye sunglasses"
            width={96}
            height={96}
            priority
            className="size-24 shrink-0 rounded-2xl object-cover ring-1 ring-line"
          />
          <div className="min-w-0">
            <p className="font-display text-2xl leading-tight font-bold tracking-[-0.025em]">{site.name}</p>
            <p className="mt-1 text-muted">{site.role}</p>
            <p className="mt-0.5 text-sm text-subtle">{site.location}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-4 border-t border-line px-6 pt-5 pb-6">
          <div>
            <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-subtle uppercase">Stack</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {site.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-line bg-bg px-2 py-0.5 text-[0.82rem] text-fg"
                >
                  {s}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-subtle uppercase">Worked with</dt>
            <dd className="mt-2 flex items-center gap-3">
              <span className="flex -space-x-1.5">
                {experience.map((job) => (
                  <Image
                    key={job.company}
                    src={job.logo}
                    alt=""
                    width={26}
                    height={26}
                    className="size-[26px] rounded-full ring-2 ring-elev"
                  />
                ))}
              </span>
              <span className="text-[0.85rem] text-muted">
                {experience.map((job) => job.company.replace(' (CNCF)', '')).join(' · ')}
              </span>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-subtle uppercase">Currently</dt>
            <dd className="mt-1.5 text-[0.9rem] text-fg">{site.currently}</dd>
          </div>
        </dl>

        <div className="flex gap-2 border-t border-line bg-sunken/50 px-4 py-3">
          <a href={site.links.github} target="_blank" rel="noreferrer" className={linkClass}>
            <GitHub className="size-4" /> GitHub
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={linkClass}>
            <LinkedIn className="size-4" /> LinkedIn
          </a>
          <a href={site.cv} target="_blank" rel="noreferrer" className={linkClass}>
            <FileText className="size-4" /> CV
          </a>
        </div>
        <CopyEmailButton className="flex w-full items-center justify-center gap-2 border-t border-line py-3 text-[0.85rem] text-muted transition-colors hover:bg-sunken hover:text-fg" />
      </div>
    </div>
  );
}
