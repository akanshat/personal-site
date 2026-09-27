import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';
import { caseStudies } from '@/lib/work';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.7 },
    { url: `${site.url}/playground`, lastModified: now, priority: 0.5 },
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, lastModified: now, priority: 0.9 })),
  ];
}
