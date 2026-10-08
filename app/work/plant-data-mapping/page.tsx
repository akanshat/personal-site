import type { Metadata } from 'next';

import { CaseSection, CaseStudyHeader, Decision, NextCase, Outcome } from '@/components/case-study';
import { plain } from '@/components/marked';
import { site } from '@/lib/site';
import { getCaseStudy } from '@/lib/work';

const { study, next } = getCaseStudy('plant-data-mapping');

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
          { label: 'My part', value: 'Product and UI, from an open brief to production' },
          { label: 'Level', value: 'Software Engineer I' },
          { label: 'Worked with', value: 'Solution engineers, design and backend' },
          { label: 'Stack', value: 'React · TypeScript' },
        ]}
      />

      <CaseSection
        title="The problem"
        note={
          <p>
            <b>A note.</b> This was internal product work, so the details of the product stay private. What
            follows is how I approached it, at the level I can share publicly.
          </p>
        }
      >
        <p>
          Before Phaidra&apos;s AI can work with a plant, the plant&apos;s data has to be mapped. Solution
          engineers did that mapping, plant by plant, in an internal tool.
        </p>
        <p>
          This was the first project I owned, and it came with no spec and no agreed idea of how it should
          work. <strong>My part was the product and UI side:</strong> working out with the engineers who would
          use it what they needed, then building it.
        </p>
      </CaseSection>

      <CaseSection title="How I approached it">
        <Decision
          title="Start from the people using it"
          cost={<>A slower start, with weeks of back-and-forth before much code.</>}
        >
          <p>
            With no spec, I went back and forth with the solution engineers until we agreed on how it should
            work, then built it in pieces they could try early.
          </p>
        </Decision>

        <Decision title="Make problems visible" cost={<>More UI to build than a plain form.</>}>
          <p>
            The engineers&apos; main job was spotting what was missing or wrong. I designed the UI so problems
            showed up at a glance, instead of hiding in long lists of values.
          </p>
        </Decision>

        <Decision
          title="No code required"
          cost={<>The UI had to cover everything the underlying logic could do.</>}
        >
          <p>
            The people doing the mapping weren&apos;t programmers, so the tool let them build what they needed
            by picking and combining options instead of writing code.
          </p>
        </Decision>

        <Decision
          title="Size the UI for the real data"
          cost={<>Every search is now a round trip to the backend, and the UI has to handle that.</>}
        >
          <p>
            Some plants had more than 10,000 data sources, and a picker dialog crashed. Virtualization fixed
            the rendering. Then the backend team built a paginated search API, and I moved the picker onto it,
            keeping pagination and filters in the URL so a search survives a reload and can be shared. As
            plants grew to thousands of components, I paginated the tables and virtualized the heaviest views.
          </p>
        </Decision>
      </CaseSection>

      <CaseSection title="Outcome">
        <Outcome
          items={[
            { value: 'No code required', label: 'Engineers could do the mapping without writing code.' },
            {
              value: 'Problems at a glance',
              label: 'Missing or broken pieces stood out instead of hiding in lists.',
            },
            { value: 'Held up at scale', label: 'Stayed usable as plants reached thousands of components.' },
          ]}
        />
      </CaseSection>

      <NextCase next={next} />
    </article>
  );
}
