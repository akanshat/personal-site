import type { StaticImageData } from 'next/image';

import phaidraLogo from '@/public/logos/phaidra-logo.png';
import thanosLogo from '@/public/logos/thanos-logo.png';
import jioLogo from '@/public/logos/jio-logo.png';
import rakutenLogo from '@/public/logos/rakuten.png';

/**
 * Single source of truth for everything personal on the site.
 * Update copy here rather than in components. Wrap key words in **double
 * asterisks** and they render with the pencil underline (see components/marked.tsx).
 */
export const site = {
  name: 'Akansha Tiwari',
  firstName: 'Akansha',
  role: 'Full-stack software engineer',
  url: 'https://www.akansha.site',
  email: 'akanshat1999@gmail.com',
  location: 'India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  availability: 'Full-stack and backend roles',
  workMode: 'Remote or hybrid',
  cv: '/CV/Akansha_Tiwari_SWE.pdf',
  repo: 'https://github.com/akanshat/personal-site',
  links: {
    github: 'https://github.com/akanshat',
    linkedin: 'https://www.linkedin.com/in/akansha-tiwari-10/',
  },
  description:
    'Akansha Tiwari is a full-stack software engineer going deeper into backend and distributed systems. LFX mentee with Thanos (CNCF) in Go; four years at Phaidra.',
} as const;

export type Role = {
  title: string;
  start: string;
  end: string;
  points: string[];
};

export type Experience = {
  company: string;
  href: string;
  logo: StaticImageData;
  location: string;
  blurb: string;
  roles: Role[];
};

export const experience: Experience[] = [
  {
    company: 'Phaidra',
    href: 'https://www.phaidra.ai',
    logo: phaidraLogo,
    location: 'Remote',
    blurb: 'NVIDIA-backed startup building AI agents for data-center operations. I worked on the frontend.',
    roles: [
      {
        title: 'Software Engineer II',
        start: 'Jul 2023',
        end: 'Jan 2026',
        points: [
          'Chose AG Charts over Highcharts for an AI feature that answers questions with charts of six or more series at **around a million points each**, and built its charts.',
          'Built versioned editing for part of the product’s control side, so users could change, review and roll back their settings safely.',
          'Wrote PRDs, which were rare at Phaidra, and test plans for my features; reviewed backend API specs and worked with design on flows.',
          'Reviewed code, fixed broken pipelines and tests, took on-call shifts, and helped QA engineers get their Cypress tests running.',
        ],
      },
      {
        title: 'Software Engineer I',
        start: 'Dec 2021',
        end: 'Jul 2023',
        points: [
          'Joined as the **first frontend hire**. Reviewed and refactored contractor code, then rewrote the main chart in the customer portal.',
          'Owned an internal data-mapping tool for solution engineers, from an open brief to production, designed so people who don’t write code could use it.',
          'Kept it fast as plants grew to thousands of components: virtualized the heaviest views, paginated the tables, and moved a 10,000+ item picker onto a paginated search API, with pagination and filters kept in the URL.',
        ],
      },
    ],
  },
  {
    company: 'LFX Mentorship with Thanos (CNCF)',
    href: 'https://thanos.io',
    logo: thanosLogo,
    location: 'Remote · open source',
    blurb:
      'Open-source, highly available Prometheus with long-term storage. A Cloud Native Computing Foundation project.',
    roles: [
      {
        title: 'Mentee',
        start: 'Sep 2021',
        end: 'Nov 2021',
        points: [
          "Added groupcache, later migrated to galaxycache, as an **embedded distributed cache backend** for Thanos Store's caching bucket in Go (PR #4818, 26 commits).",
          'Worked through review: moved to galaxycache, added Prometheus metrics and end-to-end tests. Released in Thanos v0.25.',
        ],
      },
    ],
  },
  {
    company: 'Reliance Jio',
    href: 'https://www.jio.com',
    logo: jioLogo,
    location: 'Mumbai, India',
    blurb: 'India’s largest telecom operator. I worked on JioMart’s B2B partner platform.',
    roles: [
      {
        title: 'Software Engineer',
        start: 'Jul 2021',
        end: 'Nov 2021',
        points: [
          '**Led the migration** of the JioMart B2B partner app from native Android to a responsive web app, keeping full functional parity across platforms.',
          "Shipped production features for a large-scale B2B partner onboarding platform, set up the product's design system, and wrote its tests.",
        ],
      },
    ],
  },
  {
    company: 'Rakuten',
    href: 'https://global.rakuten.com',
    logo: rakutenLogo,
    location: 'Bangalore, India',
    blurb: 'Global e-commerce and internet services company.',
    roles: [
      {
        title: 'Software Engineer Intern',
        start: 'Jan 2021',
        end: 'Jun 2021',
        points: [
          'Built an internal testing tool that let QA engineers define automated test plans and test steps.',
          'Took part in product requirement planning and design reviews alongside the full-time team.',
        ],
      },
    ],
  },
];

export const education = {
  school: 'IIIT Gwalior',
  fullName: 'Atal Bihari Vajpayee Indian Institute of Information Technology and Management',
  degree: 'B.Tech, Computer Science',
  years: '2017 – 2021',
  grade: 'CGPA 8.08 / 10',
  coursework: [
    'Data structures & algorithms',
    'Operating systems',
    'Computer networks',
    'Systems programming',
  ],
};

export const toolbox: { group: string; items: string[] }[] = [
  {
    group: 'Backend & data',
    items: ['Node.js', 'Go', 'REST APIs', 'PostgreSQL', 'MongoDB', 'Prometheus'],
  },
  {
    group: 'Frontend',
    items: [
      'TypeScript',
      'React',
      'Next.js',
      'AG Charts',
      'Redux',
      'Tailwind CSS',
      'Material UI',
      'Sass',
      'Vite',
      'Webpack',
    ],
  },
  {
    group: 'Quality & delivery',
    items: ['Playwright', 'Unit testing', 'CI/CD', 'Docker'],
  },
  {
    group: 'AI in the workflow',
    items: ['Cursor', 'Claude', 'LangChain', 'RAG'],
  },
];

/**
 * Before / Now / Next, under the home intro.
 * Bump Now's `updated` whenever it changes, so visitors can tell how fresh it is.
 */
export const direction: {
  label: 'Before' | 'Now' | 'Next';
  title: string;
  body: string;
  updated?: string;
  link?: { href: string; label: string };
}[] = [
  {
    label: 'Before',
    title: 'Four years of frontend at Phaidra',
    body: 'First frontend hire at an NVIDIA-backed startup. I built the tools engineers used to map **thousands of plant sensors** and read charts at **a million points per series**.',
  },
  {
    label: 'Now',
    title: 'Going deeper on distributed systems',
    updated: 'Sep 2026',
    body: 'Reading Designing Data-Intensive Applications and working through **Fly.io’s Gossip Glomers challenges in Go**.',
    link: { href: 'https://github.com/akanshat/maelstrom-engine', label: 'akanshat/maelstrom-engine' },
  },
  {
    label: 'Next',
    title: 'A full-stack or backend role',
    body: 'Full-stack, backend or distributed systems work, remote or hybrid from India. I’d bring **four years of shipping product** with a team, and a growing depth in Go.',
  },
];
