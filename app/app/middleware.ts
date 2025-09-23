import { NextResponse } from 'next/server';

export function middleware(req) {
  // Add any middleware logic here, such as authentication checks or logging
  return NextResponse.next();
}

// Specify the paths where the middleware should be applied
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/repairs/:path*'],
};