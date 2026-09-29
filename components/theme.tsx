'use client';

import { ThemeProvider as NextThemes, useTheme } from 'next-themes';
import { useSyncExternalStore, type ReactNode } from 'react';

import { Moon, Sun } from './icons';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

const noop = () => () => { };

/** True after hydration; avoids theme-dependent markup mismatching the server. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function useToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  return {
    resolvedTheme,
    toggle: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, toggle } = useToggleTheme();
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Toggle theme'}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg"
    >
      {/* Both icons render; CSS picks one so there is no flash before hydration. */}
      <Sun className="size-[18px] dark:hidden" />
      <Moon className="hidden size-[18px] dark:block" />
    </button>
  );
}
