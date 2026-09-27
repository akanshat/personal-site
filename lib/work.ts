export type CaseStudy = {
  slug: string;
  title: string;
  shortTitle: string;
  org: string;
  context: string;
  summary: string;
  tags: string[];
  /** Headline number or phrase for the work card. */
  stat: string;
  statLabel: string;
  facts: [label: string, value: string][];
  interactive?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'thanos-groupcache',
    title: 'Groupcache for Thanos Store',
    shortTitle: 'Thanos · groupcache',
    org: 'Thanos · CNCF',
    context: 'LFX Mentorship, open source',
    summary:
      'A pull request to a CNCF project: an embedded, distributed cache that fetches each object from storage once, however many queries ask for it at the same time. It was merged after three maintainers reviewed it and shipped in Thanos v0.25.',
    tags: ['Go', 'Distributed systems', 'Caching', 'Open source'],
    stat: '#4818',
    statLabel: 'merged into Thanos and released in v0.25',
    facts: [
      ['Size', '26 commits'],
      ['Language', 'Go'],
    ],
    interactive: true,
  },
  {
    slug: 'plant-data-mapping',
    title: 'Mapping Plant Data at Scale',
    shortTitle: 'Plant Data Mapping',
    org: 'Phaidra',
    context: 'Software Engineer I',
    summary:
      'My first project at Phaidra: an internal tool engineers used to map a plant’s data. It came with no spec. I owned the product and UI side, and kept it fast as plants grew to thousands of components.',
    tags: ['React', 'TypeScript', 'Virtualization', 'Product design'],
    stat: '1,000s',
    statLabel: 'of components per plant, and it still had to feel fast',
    facts: [
      ['My part', 'Product & UI'],
      ['Stack', 'React · TypeScript'],
    ],
  },
  {
    slug: 'million-point-charts',
    title: 'Charts at a Million Points',
    shortTitle: 'Million-Point Charts',
    org: 'Phaidra',
    context: 'Software Engineer II',
    summary:
      'An AI feature that answered questions with charts, some holding six or more series of about a million points each. I chose the charting library and built the charts.',
    tags: ['React', 'TypeScript', 'AG Charts', 'Performance'],
    stat: '6 × 1M',
    statLabel: 'six or more series per chart, around a million points in each',
    facts: [
      ['My part', 'Charts + library choice'],
      ['Stack', 'React · AG Charts'],
    ],
  },
];

export function getCaseStudy(slug: string) {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index === -1) throw new Error(`Unknown case study: ${slug}`);
  const study = caseStudies[index]!;
  const next = caseStudies[(index + 1) % caseStudies.length]!;
  return { study, next, index };
}
