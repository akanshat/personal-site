import { ogSize, renderOg } from '@/lib/og';
import { site } from '@/lib/site';

export const alt = `${site.name}, ${site.role}`;
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    eyebrow: `${site.role} · React · TypeScript · Node · Go`,
    title: 'I make complex systems legible to the people who run them.',
    accent: 'legible',
  });
}
