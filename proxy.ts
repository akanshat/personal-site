import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The playground has no public URL. It is only served at the path set in the
// PLAYGROUND_PATH env var, which lives in the host's settings, not in the repo.
// If the env var is unset, the playground is unreachable.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.PLAYGROUND_PATH?.replace(/^\/+|\/+$/g, '');

  if (secret && pathname === `/${secret}`) {
    return NextResponse.rewrite(new URL('/playground', request.url));
  }

  if (pathname === '/playground' || pathname.startsWith('/playground/')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
};
