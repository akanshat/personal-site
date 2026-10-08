import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { GraciePhoto } from '@/components/easter-eggs';
import { Marked } from '@/components/marked';
import { Reach } from '@/components/reach';
import { Container, SectionHeading } from '@/components/ui';
import gracie from '@/public/with-gracie.png';
import portrait from '@/public/portrait-1.png';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${site.name}: a full-stack software engineer going deeper into backend, from Rakuten and Reliance Jio to an LFX Mentorship with Thanos (CNCF) and four years at Phaidra.`,
  alternates: { canonical: '/about' },
};

const habits = [
  {
    title: 'Start from the ambiguity',
    body: 'My first project at Phaidra came with no spec and no agreed idea of how it should work. Much of the job was going back and forth with the people who’d use it until we agreed, and only then building. Later I wrote PRDs myself.',
  },
  {
    title: 'Make the state visible',
    body: 'A problem should be something you see, not something you hunt for. I like interfaces that **show what a system is doing**, not just whether it passed.',
  },
  {
    title: 'Design for the real data size',
    body: 'When a picker crashed on 10,000+ items, virtualization was the first fix and paginated server-side search the lasting one. I chose AG Charts over Highcharts for the same reason: charts had to stay smooth at a million points.',
  },
  {
    title: 'Use AI tools, keep the bar',
    body: 'I use Claude and Cursor every day to move faster on implementation, tests and docs. They don’t replace understanding what I ship.',
  },
];

export default function About() {
  return (
    <Container className="pt-6 sm:pt-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <h1
            data-sparkle="5"
            className="text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance"
          >
            Hi, I&apos;m {site.firstName}.
          </h1>

          <div className="prose-case mt-6 text-[1.08rem]">
            <p>
              I&apos;m a software engineer. I spent four years on the frontend, and I&apos;m now going deeper
              into backend and distributed systems. What ties it together is{' '}
              <mark>making complicated systems understandable</mark>, whether that&apos;s a tool for engineers
              working through thousands of data sources or a cache whose metrics show what it&apos;s doing.
            </p>
            <p>
              I studied Computer Science at IIIT Gwalior. Before graduating I interned at{' '}
              <strong>Rakuten</strong>, building an internal testing tool for QA engineers. At{' '}
              <strong>Reliance Jio</strong> I then led the move of JioMart&apos;s B2B partner app from native
              Android to the responsive web, and set up its design system.
            </p>
            <p>
              Alongside Jio, through the LFX Mentorship, I added groupcache as a cache backend to{' '}
              <Link href="/work/thanos-groupcache">Thanos</Link>, a CNCF project, in Go. It taught me to find
              my way around a large codebase fast, and to learn from how experienced maintainers review code.
            </p>
            <p>
              Then came four years at <strong>Phaidra</strong>, an NVIDIA-backed startup building AI agents
              for data-centre operations, where I was <mark>the first frontend hire</mark>. I rewrote the
              portal&apos;s main chart, owned{' '}
              <Link href="/work/plant-data-mapping">an internal data-mapping tool</Link>, built versioned
              editing on the control side, and chose the charting library for{' '}
              <Link href="/work/million-point-charts">an AI feature</Link> whose charts hold a million points
              per series. Along the way I wrote PRDs and test plans, reviewed API specs and took on-call
              shifts.
            </p>
            <p>
              Since Phaidra I&apos;ve been going deeper on distributed systems: reading{' '}
              <em>Designing Data-Intensive Applications</em> and working through Fly.io&apos;s Gossip Glomers
              challenges <a href="https://github.com/akanshat/maelstrom-engine">in Go</a>. I live in{' '}
              {site.location}, and I&apos;m open to full-stack, backend and distributed systems roles, remote
              or hybrid.
            </p>
          </div>

          <Reach className="mt-7" />
        </div>

        <aside data-sparkle="4" className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:pt-8">
          <Image
            src={portrait}
            alt="Akansha Tiwari, smiling, in front of tropical plants"
            placeholder="blur"
            sizes="(min-width: 1024px) 22rem, 90vw"
            className="portrait aspect-[4/5] w-full rounded-[18px] object-cover"
            priority
          />
          <GraciePhoto src={gracie} alt="Akansha laughing, cheek to cheek with Gracie, a fluffy grey cat" />
        </aside>
      </div>

      <section aria-labelledby="habits" className="mt-24">
        <SectionHeading title="How I work" id="habits">
          Four habits I bring to a team.
        </SectionHeading>
        <div className="mt-6 grid max-w-[660px] gap-6">
          {habits.map((h) => (
            <div key={h.title}>
              <h3 className="text-[1.12rem] leading-snug font-bold tracking-[-0.015em]">{h.title}</h3>
              <p className="mt-1 leading-relaxed text-pretty text-muted">
                <Marked text={h.body} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="colophon" className="mt-24">
        <SectionHeading title="How this site is built" id="colophon" />
        <p className="mt-3 max-w-[660px] leading-relaxed text-muted">
          Next.js and React, in strict TypeScript, styled with Tailwind CSS. The drawings are hand-written
          SVG. Headings are set in Bricolage Grotesque, text in Figtree, and labels and dates in Geist Mono.
          Each visit gets one of four colour palettes, in light or dark.{' '}
          <a href={site.repo} className="link">
            The source is on GitHub.
          </a>
        </p>
      </section>
    </Container>
  );
}
