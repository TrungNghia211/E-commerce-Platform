import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  scope: string;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/shop') {
    const token = request.cookies.get('sessionToken')?.value;

    if (!token)
      return NextResponse.redirect(new URL('/login', request.url));

    try {
      const decoded = jwtDecode<JWTPayload>(token);
    
      const roles = decoded.scope.split(' ');
      if (!roles.includes('SELLER'))
        return NextResponse.redirect(new URL('/shop/create-shop', request.url));

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/shop',
}; 