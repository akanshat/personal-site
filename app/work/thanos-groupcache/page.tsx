import type { Metadata } from 'next';

import { CaseSection, CaseStudyHeader, DemoSection, NextCase, Outcome } from '@/components/case-study';
import { GroupcacheDemo } from '@/components/demos/groupcache-demo';
import { plain } from '@/components/marked';
import { site } from '@/lib/site';
import { getCaseStudy } from '@/lib/work';

const { study, next } = getCaseStudy('thanos-groupcache');

const PR = 'https://github.com/thanos-io/thanos/pull/4818';
const BLOG = 'https://giedrius.blog/2022/03/04/distributed-systems-magic-groupcache-in-thanos/';

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
          {
            label: 'Pull request',
            value: (
              <a className="link" href={PR}>
                thanos-io/thanos #4818
              </a>
            ),
          },
          { label: 'Size', value: '26 commits' },
          { label: 'Language', value: 'Go' },
          { label: 'Shipped', value: 'Merged 6 Jan 2022, released in v0.25' },
        ]}
      />

      <CaseSection
        title="The problem"
        note={
          <>
            <p>
              <b>Store Gateway.</b> The Thanos component that reads old blocks of metrics from a bucket and
              answers queries over them.
            </p>
            <p>
              <b>When.</b> September to November 2021, through the Linux Foundation&apos;s LFX Mentorship.
            </p>
          </>
        }
      >
        <p>
          <a href="https://thanos.io">Thanos</a> turns Prometheus into a highly available metrics system with
          long-term storage. Its <strong>Store Gateway</strong> serves historical data straight from object
          storage such as S3 or GCS. Object storage is slow and bills per request, so Store puts a caching
          bucket in front of it.
        </p>
        <p>
          Before this change, caching meant running a separate service such as memcached or Redis. That&apos;s
          another system to deploy and operate, and it has a blind spot:{' '}
          <mark>
            when several Store instances miss on the same key at the same time, each one goes to object
            storage for it.
          </mark>
        </p>
      </CaseSection>

      <DemoSection id="demo">
        <GroupcacheDemo />
      </DemoSection>

      <CaseSection
        title="What I did"
        note={
          <p>
            <b>Why groupcache.</b> Each Store instance holds part of the cache in its own memory, and peers
            ask each other before going to the bucket. There&apos;s no separate cache service to run.
          </p>
        }
      >
        <ul>
          <li>
            Implemented Thanos&apos;s cache interface on top of{' '}
            <a href="https://github.com/golang/groupcache">groupcache</a>, and added a <code>cachekey</code>{' '}
            package for the keys the caching bucket uses.
          </li>
          <li>Wired it in as a backend you can choose for the Store caching bucket.</li>
          <li>
            Moved the implementation from groupcache to{' '}
            <a href="https://github.com/thanos-community/galaxycache">galaxycache</a> after review, which also
            brought TTL support.
          </li>
          <li>Added Prometheus metrics, and wrote end-to-end tests that check cache hits and loads.</li>
        </ul>
      </CaseSection>

      <CaseSection title="Working through review">
        <p>
          It was a large change to a production codebase I was new to. It went through 26 commits and several
          rounds of review, and the feedback covered a lot: switch the underlying library, restructure where
          configuration lived, remove duplication, get the metrics right, and make the end-to-end tests
          reliable.
        </p>
        <p>
          What I took from it was how to <mark>get up to speed in a large codebase quickly</mark>, and how to
          work feedback into a change without losing its thread.
        </p>
      </CaseSection>

      <CaseSection title="What changed">
        <Outcome
          items={[
            { value: 'Merged', label: 'Into thanos-io/thanos on 6 January 2022.' },
            {
              value: 'Released in v0.25',
              label: 'Listed in the changelog as “Store: Add Groupcache as a cache backend.”',
            },
            {
              value: 'One less service',
              label: (
                <>
                  Thanos users can <mark>cache across Store peers in-process</mark>, with no memcached to run.
                </>
              ),
            },
          ]}
        />
        <p>
          Further reading: <a href={PR}>the pull request</a>, and{' '}
          <a href={BLOG}>“Distributed Systems Magic: Groupcache in Thanos”</a> on Giedrius Statkevičius&apos;s
          blog.
        </p>
      </CaseSection>

      <NextCase next={next} />
    </article>
  );
}
