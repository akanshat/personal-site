'use client';

import { useEffect, useId, useState } from 'react';
import clsx from 'clsx';

import { Pause, Play } from '../icons';

type Mode = 'external' | 'groupcache';
type Arrow = {
  from: [number, number];
  to: [number, number];
  tone?: 'accent' | 'alarm' | 'ok';
  label?: string;
};

const STORES = [
  { id: 'A', x: 130 },
  { id: 'B', x: 320 },
  { id: 'C', x: 510 },
];
const STORE_Y = 140;
const QUERY_Y = 40;
const BOTTOM_Y = 282;
const CACHE_X = 170;
const BUCKET_X = 470;

const top = (x: number) => [x, STORE_Y - 22] as [number, number];
const bottom = (x: number) => [x, STORE_Y + 22] as [number, number];

const steps: Record<
  Mode,
  { title: string; body: string; arrows: Arrow[]; gets: number; answered?: boolean }[]
> = {
  external: [
    {
      title: 'Three identical queries arrive',
      body: 'A dashboard refresh fans out: each Store instance is asked for the same block of data at the same moment.',
      arrows: STORES.map((s) => ({ from: [s.x, QUERY_Y + 16], to: top(s.x) })),
      gets: 0,
    },
    {
      title: 'All three miss the shared cache',
      body: 'Each Store checks memcached independently. Nothing is there yet, so all three get a miss.',
      arrows: STORES.map((s) => ({
        from: bottom(s.x),
        to: [CACHE_X + (s.x - 320) * 0.25, BOTTOM_Y - 20],
        tone: 'alarm',
        label: 'miss',
      })),
      gets: 0,
    },
    {
      title: 'Each Store fetches from object storage itself',
      body: 'Nothing coordinates the misses, so the same object is read from the bucket three times. That is slower, and on S3 or GCS every read costs money.',
      arrows: STORES.map((s) => ({
        from: bottom(s.x),
        to: [BUCKET_X + (s.x - 320) * 0.25, BOTTOM_Y - 20],
        tone: 'accent',
      })),
      gets: 3,
    },
    {
      title: 'Three writes back to the cache',
      body: 'Each Store writes the same value to memcached. It works, but it did three times the work, and memcached is one more service to run.',
      arrows: STORES.map((s) => ({
        from: bottom(s.x),
        to: [CACHE_X + (s.x - 320) * 0.25, BOTTOM_Y - 20],
        tone: 'ok',
        label: 'set',
      })),
      gets: 3,
      answered: true,
    },
  ],
  groupcache: [
    {
      title: 'Three identical queries arrive',
      body: 'Same fan-out as before. But now the cache lives inside the Store processes themselves, and they know about each other as peers.',
      arrows: STORES.map((s) => ({ from: [s.x, QUERY_Y + 16], to: top(s.x) })),
      gets: 0,
    },
    {
      title: 'Everyone agrees B owns this key',
      body: 'Each Store hashes the key onto the same ring and gets the same answer: B is the owner. A and C ask B instead of going to the bucket.',
      arrows: [
        { from: [190, STORE_Y], to: [258, STORE_Y], tone: 'accent', label: 'ask B' },
        { from: [450, STORE_Y], to: [382, STORE_Y], tone: 'accent', label: 'ask B' },
      ],
      gets: 0,
    },
    {
      title: 'B loads it from object storage once',
      body: 'B misses, so it fills the cache from the bucket, and concurrent requests for the same key wait on that single load instead of each starting their own.',
      arrows: [{ from: bottom(320), to: [BUCKET_X - 40, BOTTOM_Y - 20], tone: 'accent' }],
      gets: 1,
    },
    {
      title: 'B answers everyone',
      body: 'One bucket read serves all three queries, with no separate cache service to operate. The next request for this key is a hit on B.',
      arrows: [
        { from: [258, STORE_Y + 8], to: [190, STORE_Y + 8], tone: 'ok' },
        { from: [382, STORE_Y + 8], to: [450, STORE_Y + 8], tone: 'ok' },
      ],
      gets: 1,
      answered: true,
    },
  ],
};

const toneColor = { accent: 'var(--accent)', alarm: 'var(--alarm)', ok: 'var(--ok)' } as const;

export function GroupcacheDemo() {
  const [mode, setMode] = useState<Mode>('groupcache');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const markerId = useId().replace(/:/g, '');

  const current = steps[mode][step]!;
  const last = steps[mode].length - 1;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (step < last) setStep(step + 1);
      else setPlaying(false);
    }, 2200);
    return () => window.clearTimeout(id);
  }, [playing, step, last]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setStep(0);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-elev shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-sunken/60 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="size-2 rounded-full bg-ok" aria-hidden />
          thanos-store · caching bucket
        </div>
        <div
          role="radiogroup"
          aria-label="Cache backend"
          className="flex rounded-full border border-line bg-bg p-0.5 text-xs"
        >
          {(
            [
              ['external', 'Before: memcached'],
              ['groupcache', 'After: groupcache'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              onClick={() => switchMode(m)}
              className={clsx(
                'rounded-full px-3 py-1 transition-colors',
                mode === m ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="border-line p-3 sm:p-5 lg:border-r">
          <svg
            viewBox="0 0 640 320"
            className="h-auto w-full"
            role="img"
            aria-label={`${current.title}. Object storage reads so far: ${current.gets}.`}
          >
            <defs>
              {(['accent', 'alarm', 'ok', 'muted'] as const).map((tone) => (
                <marker
                  key={tone}
                  id={`${markerId}-${tone}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 10 5 0 10z" fill={tone === 'muted' ? 'var(--fg-muted)' : toneColor[tone]} />
                </marker>
              ))}
            </defs>

            {/* Queries */}
            {STORES.map((s) => (
              <g key={`q${s.id}`}>
                <rect
                  x={s.x - 42}
                  y={QUERY_Y - 16}
                  width="84"
                  height="32"
                  rx="16"
                  fill="var(--bg-sunken)"
                  stroke="var(--border-strong)"
                />
                <text
                  x={s.x}
                  y={QUERY_Y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="var(--font-mono)"
                  fill="var(--fg-muted)"
                >
                  {current.answered ? '✓ answered' : 'query'}
                </text>
              </g>
            ))}

            {/* Peer ring hint in groupcache mode */}
            {mode === 'groupcache' && (
              <path
                d={`M ${STORES[0]!.x} ${STORE_Y - 30} Q 320 ${STORE_Y - 78} ${STORES[2]!.x} ${STORE_Y - 30}`}
                fill="none"
                stroke="var(--border-strong)"
                strokeDasharray="3 5"
              />
            )}

            {/* Stores */}
            {STORES.map((s) => {
              const owner = mode === 'groupcache' && s.id === 'B' && step >= 1;
              return (
                <g key={s.id}>
                  <rect
                    x={s.x - 62}
                    y={STORE_Y - 22}
                    width="124"
                    height="44"
                    rx="10"
                    fill={owner ? 'var(--accent-soft)' : 'var(--bg-elev)'}
                    stroke={owner ? 'var(--accent)' : 'var(--border-strong)'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={s.x}
                    y={STORE_Y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontFamily="var(--font-mono)"
                    fill="var(--fg)"
                  >
                    store {s.id}
                  </text>
                  {owner && (
                    <text
                      x={s.x}
                      y={STORE_Y + 40}
                      textAnchor="middle"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fill="var(--accent)"
                    >
                      owns hash(key)
                    </text>
                  )}
                </g>
              );
            })}

            {/* Cache service (or its absence) */}
            <g opacity={mode === 'external' ? 1 : 0.45}>
              <rect
                x={CACHE_X - 80}
                y={BOTTOM_Y - 20}
                width="160"
                height="40"
                rx="8"
                fill="var(--bg-sunken)"
                stroke="var(--border-strong)"
                strokeDasharray={mode === 'external' ? undefined : '4 4'}
              />
              <text
                x={CACHE_X}
                y={BOTTOM_Y + 5}
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-mono)"
                fill="var(--fg-muted)"
              >
                {mode === 'external' ? 'memcached' : 'no cache service'}
              </text>
              {mode === 'groupcache' && (
                <line
                  x1={CACHE_X - 70}
                  y1={BOTTOM_Y + 14}
                  x2={CACHE_X + 70}
                  y2={BOTTOM_Y - 14}
                  stroke="var(--fg-subtle)"
                />
              )}
            </g>

            {/* Object storage */}
            <rect
              x={BUCKET_X - 90}
              y={BOTTOM_Y - 20}
              width="180"
              height="40"
              rx="8"
              fill="var(--bg-sunken)"
              stroke="var(--border-strong)"
            />
            <text
              x={BUCKET_X}
              y={BOTTOM_Y + 5}
              textAnchor="middle"
              fontSize="12"
              fontFamily="var(--font-mono)"
              fill="var(--fg-muted)"
            >
              object storage
            </text>

            {/* Active arrows */}
            {current.arrows.map((a, i) => {
              const tone = a.tone ?? 'muted';
              const color = tone === 'muted' ? 'var(--fg-muted)' : toneColor[tone];
              const [x1, y1] = a.from;
              const [x2, y2] = a.to;
              return (
                <g key={`${mode}-${step}-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth="2"
                    className="flow"
                    markerEnd={`url(#${markerId}-${tone})`}
                  />
                  {a.label && (
                    <text
                      x={(x1 + x2) / 2 + (y1 === y2 ? 0 : 8)}
                      y={(y1 + y2) / 2 - (y1 === y2 ? 8 : 0)}
                      textAnchor={y1 === y2 ? 'middle' : 'start'}
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fill={color}
                    >
                      {a.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="flex flex-col border-t border-line bg-sunken/40 p-4 sm:p-5 lg:border-t-0">
          <p className="font-mono text-[0.68rem] tracking-widest text-subtle uppercase">
            Step {step + 1} of {last + 1}
          </p>
          <div aria-live="polite" className="mt-2">
            <p className="font-semibold text-fg">{current.title}</p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{current.body}</p>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-line bg-elev p-3">
              <dt className="text-[0.72rem] text-subtle">Bucket reads</dt>
              <dd
                className={clsx(
                  'mt-1 font-mono text-2xl font-medium',
                  current.gets > 1 ? 'text-alarm' : 'text-fg',
                )}
              >
                {current.gets}
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-elev p-3">
              <dt className="text-[0.72rem] text-subtle">Services to run</dt>
              <dd className="mt-1 text-[0.85rem] leading-snug text-fg">
                {mode === 'external' ? 'Thanos + memcached' : 'Thanos only'}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex items-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="h-8 rounded-full border border-line px-3 text-xs text-muted hover:text-fg disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(last, s + 1))}
              disabled={step === last}
              className="h-8 rounded-full border border-line px-3 text-xs text-muted hover:text-fg disabled:opacity-40"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => {
                if (!playing && step === last) setStep(0);
                setPlaying((p) => !p);
              }}
              className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-full bg-fg px-3 text-xs font-medium text-bg hover:bg-accent hover:text-accent-fg"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>
          <div className="mt-3 flex gap-1" aria-hidden>
            {steps[mode].map((_, i) => (
              <span
                key={i}
                className={clsx('h-1 flex-1 rounded-full', i <= step ? 'bg-accent' : 'bg-line')}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
