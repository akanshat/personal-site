import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { site } from './site';

export const ogSize = { width: 1200, height: 630 };

/** Shared social card, so every page shares with a consistent, legible preview. */
export async function renderOg({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  /** Optional word inside `title` to set in the italic serif accent. */
  accent?: string;
}) {
  const [sans, mono, serif, avatar] = await Promise.all([
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/InstrumentSerif-Italic.woff')),
    readFile(join(process.cwd(), 'public/avatar.jpg'), 'base64'),
  ]);

  const words = title.split(' ');
  const bars = [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0];

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: '#0c0b10',
        backgroundImage: 'radial-gradient(rgba(236,235,241,0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
        color: '#ecebf1',
        fontFamily: 'Geist',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${avatar}`}
          width={72}
          height={72}
          style={{ borderRadius: 999, border: '2px solid #363241' }}
          alt=""
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 30 }}>{site.name}</div>
          <div style={{ fontSize: 20, color: '#a7a3b2', fontFamily: 'Geist Mono' }}>{eyebrow}</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          fontSize: 64,
          lineHeight: 1.1,
          letterSpacing: -2,
          maxWidth: 1040,
        }}
      >
        {words.map((word, i) =>
          accent && word.replace(/[.,]/g, '') === accent ? (
            <span
              key={i}
              style={{
                fontFamily: 'Instrument Serif',
                fontStyle: 'italic',
                color: '#a98cff',
                letterSpacing: 0,
                fontSize: 72,
                marginRight: 15,
              }}
            >
              {word}
            </span>
          ) : (
            <span key={i} style={{ marginRight: 15 }}>
              {word}
            </span>
          ),
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {bars.map((b, i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: b ? 18 : 3,
                borderRadius: 3,
                background: b === 1 ? '#a98cff' : b === 2 ? '#fbbf24' : '#363241',
              }}
            />
          ))}
        </div>
        <div style={{ fontFamily: 'Geist Mono', fontSize: 22, color: '#a7a3b2' }}>akansha.site</div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Geist', data: sans, weight: 600, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
        { name: 'Instrument Serif', data: serif, weight: 400, style: 'italic' },
      ],
    },
  );
}
