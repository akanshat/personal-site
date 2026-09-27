import Link from 'next/link';
import type { ReactNode } from 'react';

import type { CaseStudy } from '@/lib/work';
import { ArrowLeft, ArrowRight } from './icons';
import { Container, Eyebrow, Tag } from './ui';

export function CaseStudyHeader({
  study,
  facts,
}: {
  study: CaseStudy;
  facts: { label: string; value: ReactNode }[];
}) {
  return (
    <header className="relative overflow-hidden">
      <div className="bg-dots mask-fade-b pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container className="pt-10 pb-12 sm:pt-16">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          All work
        </Link>
        <Eyebrow className="mt-10">
          {study.org} · {study.context}
        </Eyebrow>
        <h1 className="mt-3 max-w-4xl text-[2.3rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-[3.4rem]">
          {study.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">
          {study.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {study.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-bg p-4 sm:p-5">
              <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-subtle uppercase">{f.label}</dt>
              <dd className="mt-2 text-[0.92rem] leading-snug text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </header>
  );
}

export function CaseSection({
  index,
  title,
  children,
  id,
}: {
  index: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Container className="grid gap-4 py-10 sm:py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-mono text-[0.72rem] tracking-[0.14em] text-subtle uppercase">
            <span className="text-accent">{index}</span>
            <span className="mx-2" aria-hidden>
              /
            </span>
            {title}
          </h2>
        </div>
        <div className="prose-case max-w-[42rem]">{children}</div>
      </Container>
    </section>
  );
}

export function DemoSection({
  id,
  intro,
  note = 'made-up data · illustrative only',
  children,
}: {
  id: string;
  intro: ReactNode;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label="Interactive demo"
      className="scroll-mt-20 border-y border-line bg-sunken/40 py-12 sm:py-16"
    >
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-mono text-[0.72rem] tracking-[0.14em] text-subtle uppercase">
              <span className="text-accent">Try it</span>
              <span className="mx-2" aria-hidden>
                /
              </span>
              Interactive demo
            </h2>
            <p className="mt-3 max-w-2xl text-muted">{intro}</p>
          </div>
          <p className="shrink-0 rounded-full border border-line bg-elev px-3 py-1 font-mono text-[0.68rem] text-subtle">
            {note}
          </p>
        </div>
        {children}
      </Container>
    </section>
  );
}

/** A decision, what it bought, and what it cost. */
export function Decision({ title, children, cost }: { title: string; children: ReactNode; cost: ReactNode }) {
  return (
    <div className="not-prose mt-8 overflow-hidden rounded-2xl border border-line bg-elev first:mt-0">
      <div className="p-5 sm:p-6">
        <h3 className="text-[1.05rem] font-semibold tracking-tight text-fg">{title}</h3>
        <div className="mt-2 space-y-3 text-[0.98rem] leading-relaxed text-muted">{children}</div>
      </div>
      <div className="border-t border-line bg-sunken/60 px-5 py-3.5 text-[0.9rem] leading-relaxed text-muted sm:px-6">
        <span className="mr-2 font-mono text-[0.68rem] tracking-[0.14em] text-warn uppercase">Trade-off</span>
        {cost}
      </div>
    </div>
  );
}

export function Outcome({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="not-prose grid gap-3 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
      {items.map((i) => (
        <li key={i.value} className="rounded-2xl border border-line bg-elev p-5 before:hidden">
          <p className="font-medium text-fg">{i.value}</p>
          <p className="mt-1 text-[0.92rem] leading-relaxed text-muted">{i.label}</p>
        </li>
      ))}
    </ul>
  );
}

export function NextCase({ next }: { next: CaseStudy }) {
  return (
    <Container className="mt-16">
      <Link
        href={`/work/${next.slug}`}
        className="group flex flex-col gap-2 rounded-2xl border border-line bg-elev p-6 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div>
          <Eyebrow>Next case study</Eyebrow>
          <p className="mt-2 text-xl font-semibold tracking-tight">{next.title}</p>
          <p className="mt-1 text-sm text-muted">
            {next.org} · {next.context}
          </p>
        </div>
        <ArrowRight className="size-6 text-subtle transition-all group-hover:translate-x-1 group-hover:text-accent" />
      </Link>
    </Container>
  );
}
