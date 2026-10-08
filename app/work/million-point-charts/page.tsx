import type { Metadata } from 'next';

import { CaseSection, CaseStudyHeader, Decision, NextCase, Outcome } from '@/components/case-study';
import { plain } from '@/components/marked';
import { site } from '@/lib/site';
import { getCaseStudy } from '@/lib/work';

const { study, next } = getCaseStudy('million-point-charts');

export const metadata: Metadata = {
  title: study.title,
  description: plain(study.summary),
  alternates: { canonical: `/work/${study.slug}` },
  openGraph: { title: `${study.title} · ${site.name}`, description: plain(study.summary) },
};

export default function Page() {
  return (
    <article>
      <CaseStudyHeader
        study={study}
        facts={[
          { label: 'My part', value: 'The charts, and the library behind them' },
          { label: 'Level', value: 'Software Engineer II' },
          { label: 'Data', value: '6+ series × ~1M points each' },
          { label: 'Stack', value: 'React · TypeScript · AG Charts' },
        ]}
      />

      <CaseSection
        title="The problem"
        note={
          <p>
            <b>A note.</b> This was internal product work, so the details of the product stay private. What
            follows is the shape of the problem and my part in it, at the level I can share publicly.
          </p>
        }
      >
        <p>
          One of Phaidra&apos;s AI features answered questions about plant data with charts. Those charts were
          big: <strong>six or more series, with around a million points in each</strong>.
        </p>
        <p>
          The whole point of the feature was to look at the data, so a chart that stutters at that size
          isn&apos;t usable. We were using Highcharts, and the question was whether to keep it.
        </p>
      </CaseSection>

      <CaseSection title="What I did">
        <Decision
          title="AG Charts over Highcharts"
          cost={<>Moving off a library the team already knew, and learning a new API.</>}
        >
          <p>
            I chose AG Charts because it handled data at this size smoothly and quickly, and because it could
            be customised far enough to fit inside chat answers.
          </p>
        </Decision>

        <Decision
          title="Build it into the live feature"
          cost={<>It had to work with the real backend and real data from the start.</>}
        >
          <p>
            I built the charts into the feature itself, connected to the real AI backend and real data. Doing
            it on the real feature also showed the other developers how easily AG Charts could replace
            Highcharts.
          </p>
        </Decision>
      </CaseSection>

      <CaseSection title="Outcome">
        <Outcome
          items={[
            {
              value: 'AG Charts, chosen for scale',
              label: 'The charting library for the feature, chosen for data at a million points per series.',
            },
            {
              value: 'Built on the real feature',
              label:
                'Real questions, real backend, real data, which let the team see how easily the switch would go.',
            },
          ]}
        />
      </CaseSection>

      <NextCase next={next} />
    </article>
  );
}
