import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { ArrowDown, ArrowRight, ArrowUpRight, FileText, GitHub, LinkedIn } from '@/components/icons';
import { CopyEmailButton } from '@/components/status';
import { Legible } from '@/components/legible';
import { ProfileCard } from '@/components/profile-card';
import { Container, Eyebrow, SectionHeading, Tag, buttonClass } from '@/components/ui';
import { direction, education, experience, site, toolbox } from '@/lib/site';
import { caseStudies } from '@/lib/work';

// "Now" is the big violet tile; "Before" and "Next" sit beside it.
const directionStyles = {
  Before: { tile: 'bg-elev', dot: 'bg-line-strong', label: 'text-subtle', body: 'text-muted' },
  Now: {
    tile: 'relative overflow-hidden bg-accent text-accent-fg justify-end min-h-72 md:order-first md:row-span-2',
    dot: 'bg-accent-fg',
    label: 'text-accent-fg/80',
    body: 'text-accent-fg/80',
  },
  Next: { tile: 'bg-ok-soft', dot: 'bg-ok', label: 'text-subtle', body: 'text-muted' },
} as const;

// Tints for the number tile on each case study card, in list order.
const caseTints = ['bg-warn-soft', 'bg-ok-soft', 'bg-accent-soft'];

export default function Home() {
  return (
    <>
      <Hero />
      <Direction />
      <Work />
      <ExperienceSection />
      <Toolbox />
      <Contact />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-dots mask-fade-b pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container className="grid items-center gap-12 pt-12 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:pb-24">
        <div>
          <p className="text-lg font-medium text-accent sm:text-xl">Hi, I&apos;m Akansha.</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
            I make complex systems <Legible word="legible" className="font-extrabold text-accent" /> to the
            people who run them.
          </h1>
          <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-pretty text-muted">
            Software engineer moving from frontend toward backend and distributed systems. I added a
            distributed cache to Thanos, a CNCF project, in Go, and spent four years at{' '}
            <a
              href="https://www.phaidra.ai"
              className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            >
              Phaidra
            </a>{' '}
            building tools over thousands of plant sensors and charts at a million points per series.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Plain <a>: next/link ignores clicks when the URL already ends in #work. */}
            <a href="#work" className={buttonClass('primary')}>
              See selected work
              <ArrowDown className="size-4" />
            </a>
            <a href={site.cv} className={buttonClass('secondary')} target="_blank" rel="noreferrer">
              <FileText className="size-4" />
              CV
            </a>
          </div>
        </div>

        <ProfileCard />
      </Container>
    </section>
  );
}

function Direction() {
  return (
    <Container>
      <ol className="grid gap-3.5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {direction.map((d, i) => {
          const style = directionStyles[d.label];
          return (
            <li
              key={d.label}
              style={{ animationDelay: `${150 + i * 100}ms` }}
              className={clsx(
                'bento-pop group flex flex-col gap-2.5 rounded-[26px] p-6 transition-transform duration-300 hover:scale-[1.015] sm:p-7',
                style.tile,
              )}
            >
              {d.label === 'Now' && (
                <span
                  className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full border-[40px] border-accent-fg/10 transition-transform duration-700 group-hover:translate-x-[-12px] group-hover:translate-y-3 group-hover:scale-110"
                  aria-hidden
                />
              )}
              <p className={clsx('relative flex items-center gap-2.5 text-sm font-semibold', style.label)}>
                <span className={clsx('size-2 rounded-full', style.dot)} aria-hidden />
                {d.label}
                {d.updated && <span className="ml-auto font-normal">Updated {d.updated}</span>}
              </p>
              <h2
                className={clsx(
                  'relative leading-tight font-bold tracking-[-0.025em] text-balance',
                  d.label === 'Now' ? 'text-3xl sm:text-[2.1rem]' : 'text-xl',
                )}
              >
                {d.title}
              </h2>
              <p className={clsx('relative text-[0.95rem] leading-relaxed text-pretty', style.body)}>
                {d.body}
              </p>
              {d.link && (
                <a
                  href={d.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="relative flex w-fit items-center gap-1 pt-1 font-mono text-[0.8rem] underline decoration-current/40 underline-offset-4 hover:decoration-current"
                >
                  {d.link.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </Container>
  );
}

function Work() {
  return (
    <section aria-labelledby="work-title" className="mt-24 sm:mt-32">
      <Container>
        <div id="work" className="scroll-mt-24" />
        <SectionHeading index="01" title="Selected work" id="work-title">
          Three problems, told as case studies
        </SectionHeading>
        <p className="mt-3 max-w-2xl text-muted">
          One open-source contribution in Go to a CNCF project, and two from my four years at Phaidra, written
          at the level I can share publicly.
        </p>

        <ol className="mt-10 grid gap-5">
          {caseStudies.map((c, i) => {
            return (
              <li key={c.slug}>
                <Link
                  href={`/work/${c.slug}`}
                  className="group grid gap-3.5 rounded-[26px] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
                >
                  <div className="flex flex-col rounded-[26px] bg-elev p-6 sm:p-8">
                    <Eyebrow>
                      <span className="text-accent">0{i + 1}</span>
                      <span className="mx-2" aria-hidden>
                        /
                      </span>
                      {c.org} · {c.context}
                    </Eyebrow>
                    <h3 className="mt-4 text-xl font-bold tracking-[-0.025em] text-balance sm:text-2xl">
                      {c.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-pretty text-muted">{c.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {c.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <p className="mt-auto flex items-center gap-1.5 pt-7 text-sm font-medium text-fg">
                      Read the case study
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                    </p>
                  </div>
                  <div
                    className={clsx(
                      'relative flex min-h-48 flex-col justify-between gap-8 overflow-hidden rounded-[26px] p-6 transition-transform duration-300 group-hover:scale-[1.02] group-hover:rotate-[1.5deg] sm:p-8',
                      caseTints[i % caseTints.length],
                    )}
                  >
                    <div className="bg-dots absolute inset-0 opacity-50" aria-hidden />
                    <div className="relative">
                      <p className="font-display text-4xl font-bold tracking-[-0.03em] text-fg sm:text-5xl">
                        {c.stat}
                      </p>
                      <p className="mt-2 max-w-xs text-[0.9rem] leading-snug text-muted">{c.statLabel}</p>
                    </div>
                    <dl className="relative grid grid-cols-2 gap-4 border-t border-line pt-4">
                      {c.facts.map(([label, value]) => (
                        <div key={label}>
                          <dt className="font-mono text-[0.66rem] tracking-[0.14em] text-subtle uppercase">
                            {label}
                          </dt>
                          <dd className="mt-1 text-[0.9rem] text-fg">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {c.interactive && (
                      <span className="absolute top-4 right-4 rounded-full border border-line bg-elev/90 px-2 py-0.5 font-mono text-[0.66rem] text-subtle">
                        interactive diagram
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section aria-labelledby="experience-title" className="mt-24 sm:mt-32">
      <Container className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div id="experience" className="scroll-mt-24" />
          <SectionHeading index="02" title="Experience" id="experience-title">
            Where I&apos;ve worked
          </SectionHeading>
          <p className="mt-3 text-muted">
            Four years of frontend on a product team, and backend work in Go on a CNCF project.
          </p>
          <a href={site.cv} target="_blank" rel="noreferrer" className={buttonClass('secondary', 'mt-6')}>
            <FileText className="size-4" />
            Download CV
          </a>
        </div>

        <ol className="relative space-y-4">
          {experience.map((job) => (
            <li key={job.company} className="rounded-2xl border border-line bg-elev p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <Image
                  src={job.logo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full ring-1 ring-line-strong"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 hover:text-accent"
                      >
                        {job.company}
                        <ArrowUpRight className="size-3.5 text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </h3>
                    <p className="font-mono text-xs text-subtle">{job.location}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{job.blurb}</p>
                </div>
              </div>

              <div className="mt-5 space-y-6 sm:pl-14">
                {job.roles.map((role, i) => (
                  <div key={role.title} className="relative">
                    {job.roles.length > 1 && (
                      <>
                        {i < job.roles.length - 1 && (
                          <span
                            className="absolute top-4 -bottom-6 -left-[2.25rem] hidden w-px bg-line-strong sm:block"
                            aria-hidden
                          />
                        )}
                        <span
                          className={
                            'absolute top-[0.4rem] -left-[2.5625rem] hidden size-2.5 rounded-full border-2 sm:block ' +
                            (i === 0 ? 'border-accent bg-accent' : 'border-line-strong bg-elev')
                          }
                          aria-hidden
                        />
                      </>
                    )}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <h4 className="font-medium text-fg">
                        {role.title}
                        {job.roles.length > 1 && i === 0 && (
                          <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 align-middle font-mono text-[0.66rem] font-normal text-accent">
                            promoted
                          </span>
                        )}
                      </h4>
                      <p className="tabular font-mono text-xs text-subtle">
                        {role.start} – {role.end}
                      </p>
                    </div>
                    <ul className="mt-2.5 space-y-2 text-[0.94rem] leading-relaxed text-muted">
                      {role.points.map((point) => (
                        <li key={point} className="relative pl-4 text-pretty">
                          <span className="absolute top-[0.7em] left-0 h-px w-2 bg-line-strong" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Toolbox() {
  return (
    <section aria-labelledby="toolbox-title" className="mt-24 sm:mt-32">
      <Container>
        <SectionHeading index="03" title="Toolbox" id="toolbox-title">
          What I work with
        </SectionHeading>
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {toolbox.map((group) => (
              <div key={group.group} className="bg-elev p-6">
                <h3 className="font-mono text-[0.72rem] tracking-[0.14em] text-subtle uppercase">
                  {group.group}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-line bg-bg px-2 py-1 text-[0.85rem] text-fg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-line bg-elev p-6">
              <h3 className="font-mono text-[0.72rem] tracking-[0.14em] text-subtle uppercase">Education</h3>
              <p className="mt-4 font-medium text-fg">{education.degree}</p>
              <p className="mt-1 text-sm text-muted" title={education.fullName}>
                {education.school} · {education.years} · {education.grade}
              </p>
              <p className="mt-3 text-sm text-subtle">{education.coursework.join(' · ')}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section aria-labelledby="contact-title" className="mt-24 sm:mt-32">
      <Container>
        <div id="contact" className="scroll-mt-24" />
        <div className="relative overflow-hidden rounded-3xl border border-line bg-elev px-6 py-14 sm:px-12 sm:py-20">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="relative">
            <div className="max-w-2xl">
              <Eyebrow>
                <span className="text-accent">04</span>
                <span className="mx-2" aria-hidden>
                  /
                </span>
                Contact
              </Eyebrow>
              <h2
                id="contact-title"
                className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl"
              >
                Want to work together? <span className="font-extrabold text-accent">Say hello.</span>
              </h2>
              <p className="mt-5 text-lg text-muted">
                I&apos;m based in {site.location} ({site.timeZoneLabel}). Email is the fastest way to reach
                me.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CopyEmailButton className={buttonClass('primary', 'h-11 px-5')} />
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClass('secondary', 'h-11')}
                >
                  <LinkedIn className="size-4" />
                  LinkedIn
                </a>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClass('secondary', 'h-11')}
                >
                  <GitHub className="size-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
