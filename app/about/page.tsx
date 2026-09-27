import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { FileText, GitHub, LinkedIn } from '@/components/icons';
import { CopyEmailButton } from '@/components/status';
import { Container, Eyebrow, TextLink, buttonClass } from '@/components/ui';
import gracie from '@/public/with-gracie.png';
import portrait from '@/public/portrait-1.png';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${site.name}: a software engineer moving from frontend toward backend, from Rakuten and Reliance Jio to Thanos (CNCF) and four years at Phaidra.`,
  alternates: { canonical: '/about' },
};

const principles = [
  {
    title: 'Start from the ambiguity',
    body: 'My first project at Phaidra came with no spec and no agreed idea of how it should work. Much of the job was going back and forth with the people who’d use it until we agreed, and only then building. Later I wrote PRDs myself.',
  },
  {
    title: 'Make the state visible',
    body: 'A problem should be something you see, not something you hunt for. I like interfaces that show what a system is doing, not just whether it passed.',
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

const colophon = [
  ['Framework', 'Next.js 16 (App Router), React 19'],
  ['Language', 'TypeScript, strict mode'],
  ['Styling', 'Tailwind CSS v4 with CSS-variable design tokens, light and dark'],
  ['Diagrams', 'Hand-written SVG and React, with no chart or UI libraries'],
  ['Quality', 'Lint, typecheck and build in CI; accessibility-checked in both themes'],
  ['Type', 'Geist, Geist Mono and Instrument Serif'],
];

export default function About() {
  return (
    <Container className="pt-12 sm:pt-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <div>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
            Hi, I&apos;m <span className="font-extrabold text-accent">Akansha</span>.
          </h1>

          <div className="prose-case mt-8 max-w-[42rem] text-[1.08rem]">
            <p>
              I&apos;m a software engineer. I spent four years on the frontend, and I&apos;m now moving toward
              backend and distributed systems. What ties it together for me is making complicated systems
              understandable, whether that&apos;s a tool for engineers working through thousands of data
              sources or a cache that shows, through its metrics, what it&apos;s doing.
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
              my way around a large codebase fast and to learn from how experienced maintainers review code.
            </p>
            <p>
              Then came four years at <strong>Phaidra</strong>, an NVIDIA-backed startup building AI agents
              for data-center operations, where I was the first frontend hire. I started by reviewing and
              refactoring contractor code and rewriting the portal&apos;s main chart. After that I owned{' '}
              <Link href="/work/plant-data-mapping">an internal data-mapping tool</Link>, built versioned
              editing on the control side, and chose the charting library for{' '}
              <Link href="/work/million-point-charts">an AI feature</Link> whose charts hold a million points
              per series. Along the way I wrote PRDs and test plans, reviewed API specs and took on-call
              shifts.
            </p>
            <p>
              I&apos;m drawn to problems where reliability and observability aren&apos;t optional, where good
              engineering directly affects the people using it. Since Phaidra I&apos;ve been going deeper on
              distributed systems: reading <em>Designing Data-Intensive Applications</em> and working through
              Fly.io&apos;s Gossip Glomers challenges{' '}
              <a href="https://github.com/akanshat/maelstrom-engine">in Go</a>.
            </p>
            <p>I&apos;m based in {site.location}.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <CopyEmailButton className={buttonClass('primary')} />
            <a href={site.cv} target="_blank" rel="noreferrer" className={buttonClass('secondary')}>
              <FileText className="size-4" /> CV
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('secondary')}
            >
              <LinkedIn className="size-4" /> LinkedIn
            </a>
            <a href={site.links.github} target="_blank" rel="noreferrer" className={buttonClass('secondary')}>
              <GitHub className="size-4" /> GitHub
            </a>
          </div>
        </div>

        <aside className="lg:pt-10">
          <div className="lg:sticky lg:top-24">
            <figure className="overflow-hidden rounded-3xl border border-line bg-elev p-2 shadow-card">
              <Image
                src={portrait}
                alt="Akansha Tiwari, smiling, in front of tropical plants"
                placeholder="blur"
                sizes="(min-width: 1024px) 22rem, 90vw"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
                priority
              />
            </figure>
            <figure className="relative -mt-12 mr-2 ml-auto w-[68%] rotate-2 rounded-2xl border border-line bg-elev p-2 pb-0 shadow-card sm:-mt-16">
              <Image
                src={gracie}
                alt="Akansha laughing, cheek to cheek with Gracie, a fluffy grey cat"
                placeholder="blur"
                sizes="(min-width: 1024px) 15rem, 60vw"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <figcaption className="py-2 text-center font-display text-[1.05rem] font-medium text-muted">
                With Gracie
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>

      <section aria-labelledby="principles" className="mt-24">
        <Eyebrow>
          <span className="text-accent">01</span>
          <span className="mx-2" aria-hidden>
            /
          </span>
          How I work
        </Eyebrow>
        <h2 id="principles" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Four habits I bring to a team
        </h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p.title} className="bg-elev p-6 sm:p-7">
              <p className="font-mono text-xs text-accent">0{i + 1}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="colophon" className="mt-24">
        <Eyebrow>
          <span className="text-accent">02</span>
          <span className="mx-2" aria-hidden>
            /
          </span>
          Colophon
        </Eyebrow>
        <h2 id="colophon" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          How this site is built
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          <TextLink href={site.repo}>The source is on GitHub</TextLink>.
        </p>
        <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {colophon.map(([k, v]) => (
            <div key={k} className="border-t border-line pt-4">
              <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-subtle uppercase">{k}</dt>
              <dd className="mt-1.5 text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}
