import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/login' || path === '/register' || path === '/' || path.startsWith('/tutors');

    // If no token and trying to access private route, redirect to login
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists and trying to access auth pages, redirect to dashboard (simplified)
    // Ideally we verify the token role here, but we can't decode it easily without a library on edge
    // For now, we trust the client-side redirect in useAuth for role or just let them access
    if (token && (path === '/login' || path === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/tutor/:path*',
        '/admin/:path*',
        '/login',
        '/register'
    ],
};
