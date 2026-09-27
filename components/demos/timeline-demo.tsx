'use client';

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import clsx from 'clsx';

/*
 * A from-scratch toy of one dataset's timeline, with made-up data. Time runs
 * left to right from Start to Present. Formula periods never overlap: each is a
 * different formula for a different interval, so uncovered time is the only thing that
 * can go wrong between them. Blackouts are independent time windows and may
 * cover any part of any formula period, or uncovered time.
 */

type Slice = { id: string; start: number; end: number | null; formula: string };
type Blackout = { id: string; start: number; end: number };
type Scenario = { title: string; body: string; slices: Slice[]; blackouts: Blackout[] };

const DAYS = 365; // 1 Jan 2025 → Present
const EPOCH = Date.UTC(2025, 0, 1);

const DATASET = 'dataset_1';
const FORMULA = {
  a: 'x + y',
  b: 'x - z',
  c: 'y - z',
};

const scenarios: Record<string, Scenario> = {
  sketch: {
    title: 'Everything at once',
    body: 'Three formulas with uncovered time between the older two. One blackout spans the boundary between the newer two, and another sits in the uncovered stretch.',
    slices: [
      { id: 's1', start: 0, end: 128, formula: FORMULA.a },
      { id: 's2', start: 152, end: 250, formula: FORMULA.b },
      { id: 's3', start: 250, end: null, formula: FORMULA.c },
    ],
    blackouts: [
      { id: 'x1', start: 212, end: 272 },
      { id: 'x2', start: 134, end: 142 },
    ],
  },
  clean: {
    title: 'Fully covered',
    body: 'Every day from Start to Present has exactly one formula. The newest one is open-ended, so it keeps running until someone ends it.',
    slices: [
      { id: 's1', start: 0, end: 120, formula: FORMULA.a },
      { id: 's2', start: 120, end: 260, formula: FORMULA.b },
      { id: 's3', start: 260, end: null, formula: FORMULA.c },
    ],
    blackouts: [],
  },
  uncovered: {
    title: 'Uncovered time, including a tiny stretch',
    body: 'One uncovered day is less than a pixel at this scale, so it is drawn at a minimum size and still flagged. The newest formula also ends before Present, which leaves the end uncovered.',
    slices: [
      { id: 's1', start: 0, end: 140, formula: FORMULA.a },
      { id: 's2', start: 141, end: 230, formula: FORMULA.b },
      { id: 's3', start: 262, end: 330, formula: FORMULA.c },
    ],
    blackouts: [],
  },
  inside: {
    title: 'Blackout inside one formula',
    body: 'The formula stays valid, but it does not run during the blackout, for example while its data source was being repaired.',
    slices: [
      { id: 's1', start: 0, end: 180, formula: FORMULA.a },
      { id: 's2', start: 180, end: null, formula: FORMULA.b },
    ],
    blackouts: [{ id: 'x1', start: 60, end: 104 }],
  },
  across: {
    title: 'Blackout across a boundary',
    body: 'Blackouts do not care where one formula ends and the next begins. This one takes the end of the older formula and the start of the newer one.',
    slices: [
      { id: 's1', start: 0, end: 180, formula: FORMULA.a },
      { id: 's2', start: 180, end: null, formula: FORMULA.b },
    ],
    blackouts: [{ id: 'x1', start: 150, end: 214 }],
  },
  swallow: {
    title: 'Blackout covers a whole formula',
    body: 'A short formula sits completely inside a blackout, so it never runs. It is still part of the timeline, and still valid for those dates.',
    slices: [
      { id: 's1', start: 0, end: 150, formula: FORMULA.a },
      { id: 's2', start: 150, end: 196, formula: FORMULA.b },
      { id: 's3', start: 196, end: null, formula: FORMULA.c },
    ],
    blackouts: [{ id: 'x1', start: 138, end: 208 }],
  },
  inUncovered: {
    title: 'Blackout over uncovered time',
    body: 'A blackout can sit where there is no formula at all. That time is still flagged as uncovered: a blackout is only a time window, so it does not give it a formula.',
    slices: [
      { id: 's1', start: 0, end: 150, formula: FORMULA.a },
      { id: 's2', start: 200, end: null, formula: FORMULA.b },
    ],
    blackouts: [{ id: 'x1', start: 160, end: 188 }],
  },
};

type ScenarioKey = keyof typeof scenarios;

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const shortFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
const dayMs = 86_400_000;
const fmtDay = (d: number | null) =>
  d === null || d >= DAYS ? 'Present' : dateFmt.format(EPOCH + d * dayMs);
const fmtShort = (d: number | null) =>
  d === null || d >= DAYS ? 'Present' : shortFmt.format(EPOCH + d * dayMs);
const pct = (d: number) => `${(d / DAYS) * 100}%`;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const days = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

const monthTicks = Array.from({ length: 12 }, (_, m) => {
  const d = Math.round((Date.UTC(2025, m, 1) - EPOCH) / dayMs);
  return { d, label: monthFmt.format(EPOCH + d * dayMs) };
}).filter((t) => t.d > 20 && t.d < DAYS - 40); // leave room for the Start and Present labels

type Uncovered = { start: number; end: number };

function findUncovered(slices: Slice[]): Uncovered[] {
  const uncovered: Uncovered[] = [];
  let cursor = 0;
  for (const s of slices) {
    if (s.start > cursor) uncovered.push({ start: cursor, end: s.start });
    cursor = s.end ?? DAYS;
  }
  if (cursor < DAYS) uncovered.push({ start: cursor, end: DAYS });
  return uncovered;
}

/** What actually runs on each stretch of time: a formula, a blackout, or nothing (uncovered). */
function resolve(slices: Slice[], blackouts: Blackout[]) {
  const points = new Set([0, DAYS]);
  for (const s of slices) points.add(s.start).add(s.end ?? DAYS);
  for (const x of blackouts) points.add(x.start).add(x.end);
  const sorted = [...points].filter((p) => p >= 0 && p <= DAYS).sort((a, b) => a - b);
  const segs: { start: number; end: number; kind: 'run' | 'blackout' | 'uncovered'; slice?: number }[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i]!;
    const end = sorted[i + 1]!;
    const mid = (start + end) / 2;
    const slice = slices.findIndex((s) => s.start <= mid && mid < (s.end ?? DAYS));
    const blackedOut = blackouts.some((x) => x.start <= mid && mid < x.end);
    const kind = blackedOut ? 'blackout' : slice === -1 ? 'uncovered' : 'run';
    const last = segs.at(-1);
    if (last && last.kind === kind && last.slice === (kind === 'run' ? slice : undefined)) last.end = end;
    else segs.push({ start, end, kind, slice: kind === 'run' ? slice : undefined });
  }
  return segs;
}

const sliceTone = ['bg-accent', 'bg-ok', 'bg-warn'];

export function TimelineDemo() {
  const [key, setKey] = useState<ScenarioKey>('sketch');
  const [slices, setSlices] = useState<Slice[]>(scenarios.sketch!.slices);
  const [blackouts, setBlackouts] = useState<Blackout[]>(scenarios.sketch!.blackouts);
  const [edited, setEdited] = useState(false);
  const lane = useRef<HTMLDivElement>(null);

  const uncovered = useMemo(() => findUncovered(slices), [slices]);
  const segments = useMemo(() => resolve(slices, blackouts), [slices, blackouts]);
  const totals = useMemo(() => {
    const sum = (kind: string) =>
      segments.filter((s) => s.kind === kind).reduce((n, s) => n + s.end - s.start, 0);
    return {
      run: sum('run'),
      blackout: sum('blackout'),
      uncoveredDays: uncovered.reduce((n, g) => n + g.end - g.start, 0),
    };
  }, [segments, uncovered]);

  const load = (k: ScenarioKey) => {
    setKey(k);
    setSlices(scenarios[k]!.slices);
    setBlackouts(scenarios[k]!.blackouts);
    setEdited(false);
  };

  // Limits keep formula periods from ever overlapping; blackouts only need a positive length.
  const limits = (kind: 'slice' | 'blackout', i: number, edge: 'start' | 'end'): [number, number] => {
    if (kind === 'blackout') {
      const x = blackouts[i]!;
      return edge === 'start' ? [0, x.end - 1] : [x.start + 1, DAYS];
    }
    const s = slices[i]!;
    if (edge === 'start') return [slices[i - 1]?.end ?? 0, (s.end ?? DAYS) - 1];
    return [s.start + 1, slices[i + 1]?.start ?? DAYS];
  };

  const setEdge = (kind: 'slice' | 'blackout', i: number, edge: 'start' | 'end', value: number) => {
    const [lo, hi] = limits(kind, i, edge);
    const v = clamp(Math.round(value), lo, hi);
    setEdited(true);
    if (kind === 'slice') setSlices((all) => all.map((s, j) => (j === i ? { ...s, [edge]: v } : s)));
    else setBlackouts((all) => all.map((x, j) => (j === i ? { ...x, [edge]: v } : x)));
  };

  const drag = (kind: 'slice' | 'blackout', i: number, edge: 'start' | 'end') => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId) || !lane.current) return;
      const r = lane.current.getBoundingClientRect();
      setEdge(kind, i, edge, ((e.clientX - r.left) / r.width) * DAYS);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      const step = e.shiftKey ? 7 : 1;
      const current = kind === 'slice' ? (slices[i]![edge] ?? DAYS) : blackouts[i]![edge];
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setEdge(kind, i, edge, current + step);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setEdge(kind, i, edge, current - step);
      else return;
      e.preventDefault();
    },
  });

  const handle = (
    kind: 'slice' | 'blackout',
    i: number,
    edge: 'start' | 'end',
    value: number,
    label: string,
  ) => {
    const [lo, hi] = limits(kind, i, edge);
    return (
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={lo}
        aria-valuemax={hi}
        aria-valuenow={value}
        aria-valuetext={fmtDay(value)}
        aria-orientation="horizontal"
        {...drag(kind, i, edge)}
        className={clsx(
          'group/h absolute inset-y-4 z-30 flex w-2.5 cursor-ew-resize touch-none items-center justify-center outline-none',
          // Each handle sits just inside its own span, so where two formula periods touch, both edges stay grabbable.
          edge === 'end' && '-translate-x-full',
        )}
        style={{ left: pct(value) }}
      >
        <span className="h-10 w-1 rounded-full bg-line-strong opacity-0 transition-opacity group-hover/h:opacity-100 group-focus-visible/h:bg-accent group-focus-visible/h:opacity-100" />
      </div>
    );
  };

  const current = scenarios[key]!;

  return (
    <div className="overflow-hidden rounded-[26px] bg-elev shadow-card">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 p-4 sm:p-6">
          <div className="flex items-center justify-between font-mono text-xs text-subtle">
            <span>{DATASET}</span>
            <span className="hidden sm:inline">drag any edge · arrow keys work too</span>
          </div>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="min-w-[36rem] px-1">
              {/* Uncovered stretches are flagged above the timeline. */}
              <div className="relative h-7">
                {uncovered.map((g) => (
                  <span
                    key={`label-${g.start}`}
                    className="absolute top-1 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-warn"
                    style={{ left: pct((g.start + g.end) / 2) }}
                  >
                    Uncovered · {days(g.end - g.start)}
                  </span>
                ))}
              </div>

              {/* Lane */}
              <div ref={lane} className="relative h-40">
                {uncovered.map((g) => (
                  <div
                    key={`uncovered-${g.start}`}
                    className="absolute inset-y-0 z-10 -translate-x-1/2 rounded-xl border border-dashed border-warn bg-warn-soft"
                    style={{
                      left: pct((g.start + g.end) / 2),
                      width: `max(6px, ${pct(g.end - g.start)})`,
                    }}
                  />
                ))}

                {slices.map((s, i) => {
                  const len = (s.end ?? DAYS) - s.start;
                  return (
                    <div
                      key={s.id}
                      className="absolute inset-y-0 z-0 overflow-hidden rounded-2xl border border-line-strong bg-bg px-3 pt-3 pb-2"
                      style={{ left: pct(s.start), width: pct(len) }}
                    >
                      <span
                        className={clsx('absolute inset-x-0 top-0 h-1', sliceTone[i % sliceTone.length])}
                      />
                      {len >= 24 && <p className="truncate text-xs font-semibold text-fg">Formula {i + 1}</p>}
                      {len >= 60 && (
                        <>
                          <p className="mt-0.5 truncate font-mono text-[0.66rem] text-subtle">
                            {fmtShort(s.start)} → {fmtShort(s.end)}
                          </p>
                          <p className="mt-2 truncate font-mono text-[0.78rem] text-muted">{s.formula}</p>
                        </>
                      )}
                    </div>
                  );
                })}

                {blackouts.map((x) => (
                  <div
                    key={x.id}
                    className="pointer-events-none absolute top-[5.5rem] bottom-2 z-20 rounded-xl border border-line-strong/70"
                    style={{
                      left: pct(x.start),
                      width: `max(4px, ${pct(x.end - x.start)})`,
                      background:
                        'repeating-linear-gradient(135deg, color-mix(in srgb, var(--fg-subtle) 22%, transparent) 0 6px, color-mix(in srgb, var(--fg-subtle) 10%, transparent) 6px 12px)',
                    }}
                  >
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-elev/90 px-2 py-0.5 font-mono text-[0.62rem] whitespace-nowrap text-muted">
                      blackout · {days(x.end - x.start)}
                    </span>
                  </div>
                ))}

                {slices.map((s, i) => (
                  <div key={`h-${s.id}`}>
                    {handle('slice', i, 'start', s.start, `Start of formula ${i + 1}`)}
                    {s.end !== null && handle('slice', i, 'end', s.end, `End of formula ${i + 1}`)}
                  </div>
                ))}
                {blackouts.map((x, i) => (
                  <div key={`h-${x.id}`}>
                    {handle('blackout', i, 'start', x.start, `Start of blackout ${i + 1}`)}
                    {handle('blackout', i, 'end', x.end, `End of blackout ${i + 1}`)}
                  </div>
                ))}
              </div>

              {/* What actually runs */}
              <p className="mt-4 font-mono text-[0.62rem] text-subtle">what runs</p>
              <div className="relative mt-1 h-2.5 overflow-hidden rounded-full bg-sunken">
                {segments.map((seg) => (
                  <span
                    key={`${seg.start}-${seg.kind}`}
                    title={`${fmtDay(seg.start)} → ${fmtDay(seg.end)}: ${seg.kind === 'run' ? `formula ${seg.slice! + 1}` : seg.kind}`}
                    className={clsx(
                      'absolute inset-y-0',
                      seg.kind === 'run' && sliceTone[seg.slice! % sliceTone.length],
                      seg.kind === 'uncovered' && 'bg-warn/40',
                    )}
                    style={{
                      left: pct(seg.start),
                      width:
                        seg.kind === 'uncovered'
                          ? `max(3px, ${pct(seg.end - seg.start)})`
                          : pct(seg.end - seg.start),
                      background:
                        seg.kind === 'blackout'
                          ? 'repeating-linear-gradient(135deg, var(--fg-subtle) 0 2px, transparent 2px 5px)'
                          : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Axis */}
              <div className="relative mt-3 h-8 border-t border-line-strong" aria-hidden>
                <span className="absolute top-2 left-0 text-xs font-semibold text-ok">Start</span>
                <span className="absolute top-2 right-0 text-xs font-semibold text-ok">Present</span>
                {monthTicks.map((t) => (
                  <span
                    key={t.d}
                    className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] text-subtle"
                    style={{ left: pct(t.d) }}
                  >
                    <span className="h-1.5 w-px bg-line-strong" />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col border-t border-line bg-sunken/40 p-5 lg:border-t-0 lg:border-l">
          <p className="font-mono text-[0.68rem] tracking-[0.14em] text-subtle uppercase">Edge cases</p>
          <div role="radiogroup" aria-label="Edge case" className="mt-3 flex flex-wrap gap-1.5">
            {(Object.keys(scenarios) as ScenarioKey[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={key === k}
                onClick={() => load(k)}
                className={clsx(
                  'rounded-full px-3 py-1 text-xs transition-colors',
                  key === k ? 'bg-fg text-bg' : 'border border-line bg-elev text-muted hover:text-fg',
                )}
              >
                {scenarios[k]!.title}
              </button>
            ))}
          </div>

          <div aria-live="polite" className="mt-5">
            <p className="font-display text-lg leading-snug font-bold tracking-[-0.02em] text-fg">
              {current.title}
              {edited && <span className="ml-2 align-middle text-xs font-normal text-subtle">edited</span>}
            </p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{current.body}</p>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-center lg:grid-cols-1 lg:text-left">
            <div className="rounded-xl bg-elev p-3">
              <dt className="text-[0.72rem] text-subtle">Runs a formula</dt>
              <dd className="mt-0.5 font-display text-lg font-bold text-fg">{days(totals.run)}</dd>
            </div>
            <div className="rounded-xl bg-elev p-3">
              <dt className="text-[0.72rem] text-subtle">Blacked out</dt>
              <dd className="mt-0.5 font-display text-lg font-bold text-fg">{days(totals.blackout)}</dd>
            </div>
            <div className={clsx('rounded-xl p-3', uncovered.length ? 'bg-warn-soft' : 'bg-elev')}>
              <dt className="text-[0.72rem] text-subtle">Uncovered</dt>
              <dd
                className={clsx(
                  'mt-0.5 font-display text-lg font-bold',
                  uncovered.length ? 'text-warn' : 'text-ok',
                )}
              >
                {uncovered.length ? `${uncovered.length} · ${days(totals.uncoveredDays)}` : 'None'}
              </dd>
            </div>
          </dl>

          {edited && (
            <button
              type="button"
              onClick={() => load(key)}
              className="mt-4 h-8 self-start rounded-full border border-line px-3 text-xs text-muted hover:text-fg"
            >
              Reset this case
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
