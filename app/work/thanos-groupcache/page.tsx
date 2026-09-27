import type { Metadata } from 'next';

import { CaseSection, CaseStudyHeader, DemoSection, NextCase, Outcome } from '@/components/case-study';
import { GroupcacheDemo } from '@/components/demos/groupcache-demo';
import { site } from '@/lib/site';
import { getCaseStudy } from '@/lib/work';

const { study, next } = getCaseStudy('thanos-groupcache');

const PR = 'https://github.com/thanos-io/thanos/pull/4818';
const BLOG = 'https://giedrius.blog/2022/03/04/distributed-systems-magic-groupcache-in-thanos/';

export const metadata: Metadata = {
  title: study.title,
  description: study.summary,
  alternates: { canonical: `/work/${study.slug}` },
  openGraph: { title: `${study.title} · ${site.name}`, description: study.summary },
};

export default function Page() {
  return (
    <article>
      <CaseStudyHeader
        study={study}
        facts={[
          {
            label: 'Pull request',
            value: (
              <a className="underline decoration-accent underline-offset-4 hover:text-accent" href={PR}>
                thanos-io/thanos #4818
              </a>
            ),
          },
          { label: 'Size', value: '26 commits' },
          { label: 'Merged', value: 'January 2022 · released in v0.25' },
          { label: 'Language', value: 'Go' },
        ]}
      />

      <CaseSection index="01" title="Context">
        <p>
          <a href="https://thanos.io">Thanos</a> turns Prometheus into a highly available metrics system with
          long-term storage, and it&apos;s a CNCF project. Its <strong>Store Gateway</strong> serves
          historical data straight from object storage such as S3 or GCS. Object storage is slow and bills per
          request, so Store puts a caching bucket in front of it.
        </p>
        <p>
          Before this change, caching meant running a separate service such as memcached or Redis. That&apos;s
          another system to deploy and operate, and it has a blind spot: when several Store instances miss on
          the same key at the same time, each one goes to object storage for it.
        </p>
        <p>
          I picked this up through the Linux Foundation&apos;s LFX Mentorship program (September to November
          2021): add <a href="https://github.com/golang/groupcache">groupcache</a> as an embedded, distributed
          cache backend.
        </p>
      </CaseSection>

      <DemoSection
        id="demo"
        note="simplified · illustrative diagram"
        intro={
          <>
            Three Store instances get the same query at once. Step through it with a shared external cache,
            then switch to groupcache and watch the bucket reads.
          </>
        }
      >
        <GroupcacheDemo />
      </DemoSection>

      <CaseSection index="02" title="What I built">
        <ul>
          <li>
            Implemented Thanos&apos;s cache interface on top of groupcache, and added a new{' '}
            <code>cachekey</code> package for the keys the caching bucket uses.
          </li>
          <li>Wired it in as a selectable backend for the Store caching bucket.</li>
          <li>
            Migrated the implementation from groupcache to{' '}
            <a href="https://github.com/thanos-community/galaxycache">galaxycache</a> after maintainer review,
            which also brought TTL support.
          </li>
          <li>
            Instrumented it with Prometheus metrics, and wrote end-to-end tests that check cache hits and
            loads.
          </li>
        </ul>
      </CaseSection>

      <CaseSection index="03" title="Working in review">
        <p>
          It was a large change to a production codebase I was new to. It went through 26 commits and several
          rounds of review with three maintainers, and their feedback covered a lot of ground: switch the
          underlying library, restructure where configuration lived, remove duplication, get the metrics
          semantics right, and make the end-to-end tests reliable.
        </p>
        <p>
          What it taught me was <strong>ramping up quickly in a large codebase</strong> and working
          maintainers&apos; feedback into a change without losing its thread.
        </p>
      </CaseSection>

      <CaseSection index="04" title="Outcome">
        <Outcome
          items={[
            {
              value: 'Merged',
              label: 'Merged into thanos-io/thanos on 6 January 2022.',
            },
            {
              value: 'Released in v0.25',
              label: 'Listed in the release changelog: “Store: Add Groupcache as a cache backend.”',
            },
            {
              value: 'One less service',
              label:
                'Gave Thanos users a way to cache across Store peers in-process, with no memcached to run.',
            },
          ]}
        />
        <p>
          Further reading: <a href={PR}>the pull request</a> and{' '}
          <a href={BLOG}>“Distributed Systems Magic: Groupcache in Thanos”</a> on Giedrius Statkevičius&apos;s
          blog.
        </p>
      </CaseSection>

      <NextCase next={next} />
    </article>
  );
}
