import { ogSize, renderOg } from '@/lib/og';
import { getCaseStudy } from '@/lib/work';

const { study } = getCaseStudy('thanos-groupcache');

export const alt = study.title;
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({ eyebrow: `Case study · ${study.org}`, title: study.title });
}
