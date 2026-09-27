import Link from 'next/link';
import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={clsx('mx-auto w-full max-w-6xl px-5 sm:px-8', className)} {...props} />;
}

/** Small monospace label — the "instrument panel" voice of the site. */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={clsx('font-mono text-[0.72rem] tracking-[0.14em] text-subtle uppercase', className)}
      {...props}
    />
  );
}

export function SectionHeading({
  index,
  title,
  id,
  children,
  className,
}: {
  index: string;
  title: string;
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <Eyebrow>
          <span className="text-accent">{index}</span>
          <span className="mx-2" aria-hidden>
            /
          </span>
          {title}
        </Eyebrow>
        <h2 id={id} className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {children}
        </h2>
      </div>
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-fg text-bg hover:bg-accent hover:text-accent-fg shadow-card',
  secondary: 'border border-line-strong bg-elev text-fg hover:border-accent hover:text-accent',
  ghost: 'text-muted hover:text-fg hover:bg-sunken',
};

export function buttonClass(variant: ButtonVariant = 'secondary', className?: string) {
  return clsx(
    'inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150',
    buttonStyles[variant],
    className,
  );
}

export function ButtonLink({
  variant = 'secondary',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.7rem] text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={clsx(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-line-strong bg-sunken px-1 font-mono text-[0.68rem] text-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(
        'text-fg underline decoration-accent/60 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent',
        className,
      )}
      {...props}
    />
  );
}
