import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.nextUrl.searchParams.get('token');
  const secret = process.env.MY_SECRET_TOKEN;

  const protectedPaths = ['/math', '/science', '/spanish', '/bw', '/active'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && token !== secret) {
    const url = req.nextUrl.clone();
    url.pathname = '/404.html';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};