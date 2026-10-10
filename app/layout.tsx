import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import type { ReactNode } from 'react';

import { CommandPalette } from '@/components/command-palette';
import { ConsoleHello } from '@/components/easter-eggs';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme';
import { site } from '@/lib/site';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
});

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' });

const title = `${site.name} · ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    'Akansha Tiwari',
    'full-stack engineer',
    'backend engineer',
    'distributed systems',
    'frontend engineer',
    'React',
    'TypeScript',
    'Next.js',
    'Go',
    'Thanos',
    'Phaidra',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title, description: site.description },
  icons: {
    // PNG only: the SVG favicon embeds a 750 KB raster.
    icon: [{ url: '/my-favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' }],
    shortcut: '/my-favicon/favicon.ico',
    apple: '/my-favicon/apple-touch-icon.png',
  },
  manifest: '/my-favicon/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1c16' },
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.role,
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'IIIT Gwalior' },
  knowsAbout: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Go',
    'Data visualization',
    'Distributed systems',
  ],
  sameAs: [site.links.github, site.links.linkedin],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${bricolage.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-fg">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CommandPalette />
          <ConsoleHello />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
