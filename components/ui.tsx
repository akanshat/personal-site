import Link from 'next/link';
import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={clsx('mx-auto w-full max-w-[1080px] px-5', className)} {...props} />;
}

/** Small monospace label for dates, sources and section kickers. */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p className={clsx('font-mono text-[0.72rem] tracking-[0.02em] text-subtle', className)} {...props} />
  );
}

/** Uppercase mono label, used above short columns and inside cards. */
export function Label({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={clsx(
        'font-mono text-[0.68rem] font-medium tracking-[0.1em] text-subtle uppercase',
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  title,
  id,
  children,
  className,
}: {
  title: string;
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 id={id} className="text-[1.75rem] leading-tight font-bold tracking-[-0.025em] text-balance">
        {title}
      </h2>
      {children && <p className="mt-1.5 text-muted">{children}</p>}
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-fg text-bg hover:bg-accent hover:text-accent-fg',
  secondary: 'border-[1.5px] border-fg text-fg hover:bg-fg hover:text-bg',
  ghost: 'text-muted hover:text-fg hover:bg-sunken',
};

export function buttonClass(variant: ButtonVariant = 'secondary', className?: string) {
  return clsx(
    'inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 font-mono text-[0.78rem] whitespace-nowrap transition-colors duration-150',
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
        'inline-flex items-center rounded-md bg-sunken px-2 py-0.5 font-mono text-[0.7rem] text-muted',
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
  return <Link className={clsx('link', className)} {...props} />;
}
