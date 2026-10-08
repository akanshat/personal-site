'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { site } from '@/lib/site';
import { useMounted } from './theme';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: site.timeZone,
});

/** Local time in India — handy for anyone scheduling across time zones. */
export function LocalTime({ className }: { className?: string }) {
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={clsx('tabular', className)}>
      <time suppressHydrationWarning dateTime={mounted ? now.toISOString() : undefined}>
        {mounted ? timeFormat.format(now) : '--:--'}
      </time>{' '}
      {site.timeZoneLabel}
    </span>
  );
}

export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={clsx('relative inline-flex size-2', className)} aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-50 [animation-duration:2.4s]" />
      <span className="relative inline-flex size-2 rounded-full bg-ok" />
    </span>
  );
}

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  };

  return { copied, copy };
}
