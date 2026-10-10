import Link from 'next/link';
import type { ReactNode } from 'react';

import type { CaseStudy } from '@/lib/work';
import { Marked } from './marked';
import { Container, Eyebrow, Label } from './ui';

/* Every case study is a reading column of up to 660px, with notes in the margin beside it. */
const columns = 'grid gap-y-5 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-x-14';

export function CaseStudyHeader({
  study,
  facts,
}: {
  study: CaseStudy;
  facts: { label: string; value: ReactNode }[];
}) {
  return (
    <header>
      <Container className={`${columns} pt-6 sm:pt-8`}>
        <div>
          <Link
            href="/#work"
            className="group inline-flex items-center gap-1.5 font-mono text-[0.8rem] font-semibold text-accent hover:text-accent-ink"
          >
            <span aria-hidden className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            All case studies
          </Link>
          <h1 className="mt-8 text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">
            {study.title}
          </h1>
          <Eyebrow className="mt-3">
            {study.org} · {study.context}
          </Eyebrow>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-pretty text-muted">
            <Marked text={study.summary} />
          </p>
        </div>
        <dl className="grid content-end gap-3 font-mono max-lg:grid-cols-2 lg:pb-2">
          {facts.map((f) => (
            <div key={f.label} className="border-l-2 border-line pl-3">
              <dt className="text-[0.66rem] tracking-[0.06em] text-subtle uppercase">{f.label}</dt>
              <dd className="text-[0.8rem] text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </header>
  );
}

/** A section of the write-up; `note` sits in the margin beside it (and below it on phones). */
export function CaseSection({
  title,
  note,
  children,
  id,
}: {
  title: string;
  note?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <Container className={`${columns} pt-14 sm:pt-16`}>
        <div>
          <h2 className="text-[1.5rem] leading-tight font-bold tracking-[-0.022em]">{title}</h2>
          <div className="prose-case mt-3">{children}</div>
        </div>
        {note && (
          <aside className="grid content-start gap-3.5 font-mono text-[0.74rem] leading-relaxed text-subtle lg:pt-12 [&_b]:font-semibold [&_b]:text-muted [&>p]:border-t [&>p]:border-line [&>p]:pt-2">
            {note}
          </aside>
        )}
      </Container>
    </section>
  );
}

export function DemoSection({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} aria-label="Interactive demo" className="scroll-mt-8">
      <Container className="pt-14 sm:pt-16">{children}</Container>
    </section>
  );
}

/** A decision, what it bought, and what it cost. */
export function Decision({ title, children, cost }: { title: string; children: ReactNode; cost: ReactNode }) {
  return (
    <div className="not-prose soft-corners overflow-hidden rounded-[18px] border border-line bg-elev">
      <div className="p-5 sm:p-6">
        <h3 className="text-[1.08rem] font-bold tracking-[-0.015em] text-fg">{title}</h3>
        <div className="mt-2 space-y-3 text-[0.98rem] leading-relaxed text-muted">{children}</div>
      </div>
      <div className="border-t border-line bg-sunken px-5 py-3.5 text-[0.9rem] leading-relaxed text-muted sm:px-6">
        <span className="mr-2 font-mono text-[0.68rem] tracking-[0.1em] text-fg uppercase">Trade-off</span>
        {cost}
      </div>
    </div>
  );
}

/** What changed, as label / detail rows. */
export function Outcome({ items }: { items: { value: string; label: ReactNode }[] }) {
  return (
    <ul className="not-prose grid gap-3.5">
      {items.map((i) => (
        <li
          key={i.value}
          className="grid gap-0.5 border-t border-line pt-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
        >
          <b className="font-semibold text-fg">{i.value}</b>
          <span className="text-muted">{i.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function NextCase({ next }: { next: CaseStudy }) {
  return (
    <Container className="mt-20">
      <Link
        href={`/work/${next.slug}`}
        className="group flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t-[3px] border-[var(--cs-rule,var(--fg))] pt-4"
      >
        <div>
          <Label>Next case study</Label>
          <p className="mt-1 font-display text-[1.4rem] leading-tight font-bold tracking-[-0.02em] group-hover:text-accent">
            {next.title}
          </p>
          <Eyebrow className="mt-1">{next.eyebrow}</Eyebrow>
        </div>
        <span className="font-mono text-[0.8rem] font-semibold text-accent">
          Read it{' '}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </Container>
  );
}
