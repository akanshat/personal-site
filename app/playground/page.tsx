import type { Metadata } from 'next';

import { TimelineDemo } from '@/components/demos/timeline-demo';
import { Container, Eyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Small interactive toys I built to think through a problem.',
  alternates: { canonical: '/playground' },
};

export default function Playground() {
  return (
    <Container className="pt-6 pb-12 sm:pt-10">
      <Eyebrow>Playground</Eyebrow>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
        Small things I built to think a problem through
      </h1>

      <section aria-labelledby="timeline-toy" className="mt-14">
        <h2 id="timeline-toy" className="text-2xl font-bold tracking-[-0.025em]">
          Values that change over time
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Many systems store a value that is defined differently over time, like a price or a formula. Each
          version is valid for its own period, periods never overlap, and any time no formula covers is
          flagged as uncovered. Blackout windows sit on top and switch it off for a while, whatever is
          underneath. Pick an edge case, then drag the edges.
        </p>
        <div className="mt-8">
          <TimelineDemo />
        </div>
      </section>
    </Container>
  );
}
