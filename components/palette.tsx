'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { DEFAULT_PALETTE, palettes, setPalette, type PaletteId } from '@/lib/palettes';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-pal'] });
  return () => observer.disconnect();
}

function readPalette(): PaletteId {
  const id = document.documentElement.getAttribute('data-pal');
  return palettes.some((p) => p.id === id) ? (id as PaletteId) : DEFAULT_PALETTE;
}

/** The palette the head script picked for this visit. */
export function usePalette() {
  return useSyncExternalStore(subscribe, readPalette, () => DEFAULT_PALETTE);
}

/** "Today's colours: Matcha & sakura · shuffle" in the footer. */
export function PaletteShuffle() {
  const current = usePalette();
  const name = palettes.find((p) => p.id === current)!.name;

  const shuffle = () => {
    const others = palettes.filter((p) => p.id !== current);
    setPalette(others[Math.floor(Math.random() * others.length)]!.id);
  };

  return (
    <span>
      Today&apos;s colours: <span className="text-fg">{name}</span> ·{' '}
      <button type="button" onClick={shuffle} data-burst className="link">
        ↻ shuffle
      </button>
    </span>
  );
}

const SPARK_COLOURS = ['var(--gl1)', 'var(--gl2)', 'var(--gl3)', 'var(--gl4)', 'var(--gold)', '#ffffff'];
const BURST_COLOURS = ['#ffd98a', '#f9b8cb', '#b9d6ff', '#dcc4ff', '#d9a53c', '#ffffff'];

/**
 * Only for the glitter palette: twinkling stars around elements marked
 * data-sparkle="<count>", and a small burst when a data-burst control is clicked.
 */
export function Glitter() {
  const palette = usePalette();
  const pathname = usePathname();

  useEffect(() => {
    if (palette !== 'glitter') return;
    const added: HTMLElement[] = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    document.querySelectorAll<HTMLElement>('[data-sparkle]').forEach((host) => {
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      const count = Number(host.dataset.sparkle) || 4;
      for (let i = 0; i < count; i++) {
        const spark = document.createElement('i');
        spark.className = 'spark';
        spark.setAttribute('aria-hidden', 'true');
        const onSide = rand() < 0.5;
        spark.style.left = `${onSide ? (rand() < 0.5 ? -2 + rand() * 6 : 92 + rand() * 8) : rand() * 100}%`;
        spark.style.top = `${onSide ? rand() * 100 : rand() < 0.5 ? -14 + rand() * 10 : 96 + rand() * 10}%`;
        spark.style.setProperty('--sz', `${Math.round(8 + rand() * 9)}px`);
        spark.style.setProperty('--c', SPARK_COLOURS[Math.floor(rand() * SPARK_COLOURS.length)]!);
        spark.style.setProperty('--d', `${(-rand() * 2.6).toFixed(2)}s`);
        host.appendChild(spark);
        added.push(spark);
      }
    });

    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-burst]');
      if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const box = target.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('i');
        p.className = 'burst';
        p.style.left = `${cx}px`;
        p.style.top = `${cy}px`;
        p.style.background = BURST_COLOURS[i % BURST_COLOURS.length]!;
        document.body.appendChild(p);
        const angle = ((Math.PI * 2) / 18) * i + Math.random() * 0.3;
        const dist = 30 + Math.random() * 40;
        const dx = (Math.cos(angle) * dist).toFixed(1);
        const dy = (Math.sin(angle) * dist + 14).toFixed(1);
        p.animate(
          [
            { transform: 'translate(-50%, -50%) scale(1) rotate(0)', opacity: 1 },
            {
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.4) rotate(180deg)`,
              opacity: 0,
            },
          ],
          { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' },
        ).onfinish = () => p.remove();
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      added.forEach((n) => n.remove());
      document.removeEventListener('click', onClick);
    };
  }, [palette, pathname]);

  return null;
}
