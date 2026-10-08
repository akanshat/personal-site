import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { site } from './site';

export const ogSize = { width: 1200, height: 630 };

/* Social cards always use the Matcha & sakura palette, so shared links look the same everywhere. */
const C = {
  bg: '#fbf9f3',
  fg: '#2c2a22',
  muted: '#5a5747',
  rule: '#e9e5d6',
  accent: '#55712f',
  pencil: '#f3b3c3',
  tints: ['#e4ecd2', '#fbe1e8', '#efe3d2', '#fbf3d4'],
};

/** Shared social card, so every page shares with a consistent, legible preview. */
export async function renderOg({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  /** Optional word inside `title` to underline in pencil. */
  accent?: string;
}) {
  const [sans, mono, avatar] = await Promise.all([
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf')),
    readFile(join(process.cwd(), 'public/avatar.jpg'), 'base64'),
  ]);

  const words = title.split(' ');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: C.bg,
        color: C.fg,
        fontFamily: 'Geist',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${avatar}`}
          width={72}
          height={72}
          style={{ borderRadius: 999, border: `3px solid ${C.pencil}` }}
          alt=""
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 30 }}>{site.name}</div>
          <div style={{ fontSize: 20, color: C.muted, fontFamily: 'Geist Mono' }}>{eyebrow}</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          fontSize: 66,
          lineHeight: 1.1,
          letterSpacing: -2,
          maxWidth: 1040,
        }}
      >
        {words.map((word, i) =>
          accent && word.replace(/[.,]/g, '') === accent ? (
            <span key={i} style={{ marginRight: 16, borderBottom: `6px solid ${C.pencil}` }}>
              {word}
            </span>
          ) : (
            <span key={i} style={{ marginRight: 16 }}>
              {word}
            </span>
          ),
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {C.tints.map((t) => (
            <div key={t} style={{ width: 54, height: 18, borderRadius: 99, background: t }} />
          ))}
        </div>
        <div style={{ fontFamily: 'Geist Mono', fontSize: 22, color: C.accent }}>akansha.site</div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Geist', data: sans, weight: 600, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
