import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/login' || path === '/register' || path === '/' || path.startsWith('/tutors');

    // If no token and trying to access private route, redirect to login
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based route protection
    if (token && userRole) {
        // Protect /admin
        if (path.startsWith('/admin') && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Protect /tutor
        if (path.startsWith('/tutor') && userRole !== 'TUTOR') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Protect /dashboard (Student)
        if (path.startsWith('/dashboard') && userRole !== 'STUDENT') {
            const dest = userRole === 'ADMIN' ? '/admin' : '/tutor/dashboard';
            return NextResponse.redirect(new URL(dest, request.url));
        }

        // If trying to access auth pages while logged in, redirect to correct dashboard
        if (path === '/login' || path === '/register') {
            let dest = '/dashboard'; // default student
            if (userRole === 'ADMIN') dest = '/admin';
            if (userRole === 'TUTOR') dest = '/tutor/dashboard';
            return NextResponse.redirect(new URL(dest, request.url));
        }
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
