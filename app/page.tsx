import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { FileText } from '@/components/icons';
import { Marked } from '@/components/marked';
import { Reach } from '@/components/reach';
import { LocalTime, StatusDot } from '@/components/status';
import { Container, Eyebrow, Label, SectionHeading, buttonClass } from '@/components/ui';
import portrait from '@/public/portrait-1.png';
import { direction, education, experience, site, toolbox } from '@/lib/site';
import { featuredCaseStudies } from '@/lib/work';

export default function Home() {
  return (
    <>
      <Hero />
      <BeforeNowNext />
      <Work />
      <ExperienceSection />
      <Toolbox />
      <Contact />
    </>
  );
}

function Hero() {
  return (
    <Container className="grid items-center gap-12 pt-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-16">
      <div>
        <p className="text-[1.05rem] text-muted">Hi, I&apos;m {site.firstName}.</p>
        <h1 className="mt-4 text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">
          I make complex systems <mark>legible</mark> to the people who run them.
        </h1>
        <p className="mt-5 max-w-[36em] text-[1.08rem] leading-relaxed text-pretty text-muted">
          I&apos;m a full-stack software engineer going deeper into{' '}
          <mark>backend and distributed systems</mark>. I added a distributed cache to Thanos, a CNCF project,
          in Go, and spent <mark>four years at Phaidra</mark> building tools over thousands of plant sensors.
        </p>
        <Reach className="mt-7" />
      </div>

      <figure className="mx-auto w-full max-w-[17.5rem] lg:mx-0">
        {/* A photo print taped into the page; Open to work is written on its bottom edge. */}
        <div className="relative -rotate-2 border border-line bg-elev p-2.5 pb-10 shadow-card transition-[rotate] duration-300 hover:rotate-0">
          <span aria-hidden className="tape" />
          <Image
            src={portrait}
            alt="Akansha smiling in front of tropical plants"
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 17.5rem, 70vw"
            className="aspect-square w-full object-cover object-[50%_35%]"
          />
          <span className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 font-mono text-[0.74rem] font-medium text-muted">
            <StatusDot /> Open to work
          </span>
        </div>
        <figcaption className="mt-6 font-mono text-[0.74rem] leading-relaxed text-subtle">
          {site.availability}
          <br />
          {site.workMode}
          <br />
          <LocalTime /> in {site.location}
        </figcaption>
      </figure>
    </Container>
  );
}

function BeforeNowNext() {
  return (
    <Container className="mt-20">
      <ol className="bnn" aria-label="Before, now and next">
        {direction.map((d) => (
          <li key={d.label} className={d.label.toLowerCase()}>
            <span className="pin" aria-hidden />
            <p className="label">
              {d.label}
              {d.updated && <span>updated {d.updated}</span>}
            </p>
            <h2>{d.title}</h2>
            <p>
              <Marked text={d.body} />
            </p>
            {d.link && (
              <a href={d.link.href} target="_blank" rel="noreferrer" className="w-fit font-mono underline">
                {d.link.label} ↗
              </a>
            )}
          </li>
        ))}
      </ol>
    </Container>
  );
}

const columns = [
  ['The problem', 'problem'],
  ['What I did', 'did'],
  ['What changed', 'changed'],
] as const;

function Work() {
  return (
    <section aria-labelledby="work-title" className="mt-24 sm:mt-28">
      <Container>
        <div id="work" className="scroll-mt-8" />
        <SectionHeading title="Case studies" id="work-title">
          Two problems I worked on, each written up in full.
        </SectionHeading>

        <div className="mt-8 grid gap-11">
          {featuredCaseStudies.map((c) => (
            <article key={c.slug} className="case-row">
              <div>
                <Eyebrow>{c.eyebrow}</Eyebrow>
                <h3 className="mt-1 text-[1.4rem] leading-tight font-bold tracking-[-0.02em]">
                  <Link href={`/work/${c.slug}`} className="hover:text-accent">
                    {c.title}
                  </Link>
                </h3>
                <Link
                  href={`/work/${c.slug}`}
                  className="group mt-3 inline-block font-mono text-[0.8rem] font-semibold text-accent hover:text-accent-ink"
                >
                  Read the case study{' '}
                  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
              <div className="pao">
                {columns.map(([heading, key], i) => (
                  <div key={key}>
                    <Label>{heading}</Label>
                    <p
                      className={clsx(
                        'mt-1.5 text-[0.95rem] leading-relaxed text-pretty',
                        i === 2 ? 'text-fg' : 'text-muted',
                      )}
                    >
                      <Marked text={c[key]} />
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section aria-labelledby="experience-title" className="mt-24 sm:mt-28">
      <Container className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div id="experience" className="scroll-mt-8" />
          <SectionHeading title="Where I’ve worked" id="experience-title">
            Four years of frontend on a product team, and backend work in Go on a CNCF project.
          </SectionHeading>
          <a href={site.cv} target="_blank" rel="noreferrer" className={buttonClass('secondary', 'mt-5')}>
            <FileText className="size-4" />
            Download CV
          </a>
        </div>

        <ol className="grid gap-4">
          {experience.map((job) => {
            const multi = job.roles.length > 1;
            return (
              <li
                key={job.company}
                className="soft-corners rounded-[18px] border border-line bg-elev p-5 sm:px-7 sm:py-6"
              >
                <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
                  <Image
                    src={job.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-full bg-elev ring-1 ring-line"
                  />
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <h3 className="text-[1.18rem] leading-snug font-bold tracking-[-0.02em]">
                        <a href={job.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                          {job.company}
                        </a>
                      </h3>
                      <p className="font-mono text-[0.72rem] text-subtle">{job.location}</p>
                    </div>
                    <p className="mt-0.5 text-[0.92rem] text-muted">{job.blurb}</p>
                  </div>
                </div>

                <div className={clsx('roles mt-5 grid gap-6 sm:pl-14', multi && 'multi')}>
                  {job.roles.map((role, i) => (
                    <div key={role.title} className="role relative">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                        <h4 className="font-semibold text-fg">
                          {role.title}
                          {multi && i === 0 && (
                            <span className="ml-2 rounded-md bg-ok-soft px-2 py-px align-[0.15em] font-mono text-[0.66rem] font-normal text-ok-ink">
                              promoted
                            </span>
                          )}
                        </h4>
                        <p className="tabular font-mono text-[0.72rem] text-subtle">
                          {role.start} – {role.end}
                        </p>
                      </div>
                      <ul className="mt-2.5 grid gap-2">
                        {role.points.map((point) => (
                          <li
                            key={point}
                            className="relative pl-4 text-[0.95rem] leading-relaxed text-pretty text-muted"
                          >
                            <span
                              className="absolute top-[0.78em] left-0 h-[1.5px] w-2 bg-subtle"
                              aria-hidden
                            />
                            <Marked text={point} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function Toolbox() {
  return (
    <section aria-labelledby="toolbox-title" className="mt-24 sm:mt-28">
      <Container>
        <SectionHeading title="What I work with" id="toolbox-title" />
        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="soft-corners grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2">
            {toolbox.map((group) => (
              <div key={group.group} className="chip-group bg-elev px-6 py-5">
                <h3 className="font-mono text-[0.68rem] font-medium tracking-[0.12em] text-subtle uppercase">
                  {group.group}
                </h3>
                <ul className="mt-3.5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="edu soft-corners rounded-[18px] border border-line px-6 py-5">
            <h3 className="font-mono text-[0.68rem] font-medium tracking-[0.12em] text-subtle uppercase">
              Education
            </h3>
            <p className="mt-3.5 font-semibold text-fg">{education.degree}</p>
            <p className="mt-0.5 text-[0.9rem] text-muted" title={education.fullName}>
              {education.school} · {education.years} · {education.grade}
            </p>
            <p className="mt-2.5 text-[0.86rem] text-subtle">{education.coursework.join(' · ')}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section aria-labelledby="contact-title" className="mt-24 sm:mt-28">
      <Container>
        <div id="contact" className="scroll-mt-8" />
        <div className="max-w-[660px]">
          <h2 id="contact-title" className="text-[1.75rem] font-bold tracking-[-0.025em]">
            Say hello
          </h2>
          <p className="mt-2 text-muted">
            If you&apos;re hiring for a full-stack, backend or distributed systems role, I&apos;d like to hear
            from you. Email is the quickest way to reach me.
          </p>
          <Reach className="mt-6" />
        </div>
      </Container>
    </section>
  );
}
