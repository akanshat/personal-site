export type CaseStudy = {
  slug: string;
  title: string;
  shortTitle: string;
  org: string;
  context: string;
  /** Small line above the title on the home page. */
  eyebrow: string;
  /** Lede on the case study page; **key words** get the pencil underline. */
  summary: string;
  tags: string[];
  /** The three short columns on the home page. */
  problem: string;
  did: string;
  changed: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'thanos-groupcache',
    title: 'Groupcache for Thanos Store',
    shortTitle: 'Thanos · groupcache',
    org: 'LFX Mentorship with Thanos (CNCF)',
    context: 'Go · open source',
    eyebrow: 'LFX Mentorship with Thanos (CNCF) · Go',
    summary:
      'A pull request to a CNCF project. It adds an embedded, distributed cache that fetches each object from storage **once, however many queries ask for it** at the same time.',
    tags: ['Go', 'Distributed systems', 'Caching', 'Open source'],
    problem:
      'When many queries asked Thanos Store for the same object at once, **each one went to object storage**.',
    did: 'Added groupcache, later moved to galaxycache, as a cache backend in Go, with Prometheus metrics and end-to-end tests.',
    changed:
      'Thanos users can **cache across Store peers in-process**, with no separate cache service to run.',
  },
  {
    slug: 'plant-data-mapping',
    title: 'Mapping plant data at scale',
    shortTitle: 'Plant data mapping',
    org: 'Phaidra',
    context: 'Software Engineer I',
    eyebrow: 'Phaidra · React · TypeScript',
    summary:
      'My first project at Phaidra: an internal tool engineers used to map a plant’s data. It came with no spec. I owned the product and UI side, and **kept it fast as plants grew to thousands of components**.',
    tags: ['React', 'TypeScript', 'Virtualization', 'Product design'],
    problem:
      'Engineers had to map a plant’s data with no spec, and plants grew to **thousands of components**.',
    did: 'Owned the product and UI. Virtualized the heaviest views, paginated the tables, and moved a 10,000+ item picker onto a paginated search API.',
    changed: 'A tool that **stayed fast at plant scale**, built so people who don’t write code could use it.',
  },
  {
    slug: 'million-point-charts',
    title: 'Charts at a million points',
    shortTitle: 'Million-point charts',
    org: 'Phaidra',
    context: 'Software Engineer II',
    eyebrow: 'Phaidra · React · AG Charts',
    summary:
      'An AI feature that answered questions with charts, some holding **six or more series of about a million points each**. I chose the charting library and built the charts.',
    tags: ['React', 'TypeScript', 'AG Charts', 'Performance'],
    problem:
      'An AI feature needed to answer questions with charts of six or more series, **around a million points each**.',
    did: 'Compared charting libraries, chose AG Charts over Highcharts, and built the charts.',
    changed: 'Charts that hold **about a million points per series** inside the product.',
  },
];

export function getCaseStudy(slug: string) {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index === -1) throw new Error(`Unknown case study: ${slug}`);
  const study = caseStudies[index]!;
  const next = caseStudies[(index + 1) % caseStudies.length]!;
  return { study, next, index };
}
