// Route protection for /products, /checkout, /receipt
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedPaths = ['/products', '/checkout', '/receipt'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const sessionCookie = request.cookies.get('mini_session');
    
    if (!sessionCookie || sessionCookie.value !== 'true') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*', '/checkout/:path*', '/receipt/:path*'],
};
