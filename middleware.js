import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  const protectedPaths = [
    '/math',
    '/science',
    '/spanish',
    '/bw',
    '/active'
  ];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    const token = searchParams.get('token');
    const secret = process.env.MY_SECRET_TOKEN;

    if (token !== secret) {
      
      const url = request.nextUrl.clone();
      url.pathname = '/404.html'; 
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/math/:path*',
    '/science/:path*',
    '/spanish/:path*',
    '/bw/:path*',
    '/active/:path*'
  ],
};