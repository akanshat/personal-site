'use client';

import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import clsx from 'clsx';

import { site } from '@/lib/site';

/** Paw prints walk across the screen, once. Skipped for reduced motion. */
export function pawWalk() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const w = innerWidth;
  const steps = Math.max(8, Math.round(w / 90));
  const y0 = innerHeight * (0.55 + Math.random() * 0.3);
  for (let i = 0; i < steps; i++) {
    const paw = document.createElement('i');
    paw.className = 'paw';
    paw.setAttribute('aria-hidden', 'true');
    paw.style.left = `${Math.round((i + 0.5) * (w / steps))}px`;
    paw.style.top = `${Math.round(y0 + (i % 2 ? -14 : 14) + Math.sin(i / 2) * 18)}px`;
    paw.style.transform = `rotate(${90 + (i % 2 ? -12 : 12)}deg)`;
    paw.style.animationDelay = `${(i * 0.16).toFixed(2)}s`;
    document.body.appendChild(paw);
    window.setTimeout(() => paw.remove(), 2600 + i * 160);
  }
}

declare global {
  interface Window {
    gracie?: () => string;
    hire?: () => string;
    __saidHello?: boolean;
  }
}

/** A hello in the browser console, with two commands to try. */
export function ConsoleHello() {
  useEffect(() => {
    window.gracie = () => {
      pawWalk();
      return 'mrrp. (Gracie walked across your screen.)';
    };
    window.hire = () =>
      `${site.email} · full-stack, backend or distributed systems · ${site.workMode.toLowerCase()} from ${site.location}. Say hello!`;

    if (window.__saidHello) return;
    window.__saidHello = true;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#55712f';
    console.log(
      '%c' +
        [
          '   /\\_/\\ ',
          '  ( o.o )   Hi, you found the console.',
          `   > ^ <    I’m ${site.firstName}. My cat Gracie reviews all my code.`,
          '',
          '  Try  gracie()  or  hire()',
        ].join('\n'),
      `font: 13px/1.5 ui-monospace, Menlo, monospace; color: ${accent};`,
    );
  }, []);

  return null;
}

/** The photo with Gracie on About: she says hello on hover, and walks across the screen on click or tap. */
export function GraciePhoto({ src, alt }: { src: StaticImageData; alt: string }) {
  const [on, setOn] = useState(false);
  const poke = () => {
    setOn((v) => !v);
    pawWalk();
  };

  return (
    <figure
      tabIndex={0}
      aria-describedby="gracie-says"
      onClick={poke}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          poke();
        }
      }}
      onMouseLeave={() => setOn(false)}
      className={clsx(
        'gracie relative -mt-12 mr-0 ml-auto w-[64%] rotate-2 cursor-pointer rounded-xl bg-[var(--t1,var(--bg-elev))] p-[7px] pb-0 shadow-card',
        on && 'on',
      )}
    >
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 1024px) 14rem, 60vw"
        className="aspect-[4/3] w-full rounded-lg object-cover"
      />
      <figcaption className="py-2 text-center font-mono text-[0.72rem] text-muted">with Gracie</figcaption>
      <p id="gracie-says" role="tooltip" className="bubble">
        Mrrp. I&apos;m Gracie. I review every pull request by sitting on the keyboard.
      </p>
    </figure>
  );
}
