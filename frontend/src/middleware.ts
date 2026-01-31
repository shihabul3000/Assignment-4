import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/register' || path === '/login/' || path === '/register/' || path === '/' || path.startsWith('/tutors');

    // If no token and trying to access private route, redirect to login
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based route protection and auth page handling
    if (token && userRole) {
        // Determine the correct dashboard based on role
        let dashboardPath = '/dashboard';
        if (userRole === 'ADMIN') dashboardPath = '/admin';
        if (userRole === 'TUTOR') dashboardPath = '/tutor/dashboard';

        // If trying to access auth pages while logged in, redirect to correct dashboard
        if (path === '/login' || path === '/login/' || path === '/register' || path === '/register/') {
            // Prevent redirect loop by checking if we're already at the destination
            if (path !== dashboardPath && path !== dashboardPath + '/') {
                return NextResponse.redirect(new URL(dashboardPath, request.url));
            }
        }

        // Protect /admin routes
        if (path.startsWith('/admin') && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Protect /tutor routes
        if (path.startsWith('/tutor') && userRole !== 'TUTOR') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Protect /dashboard routes (Student)
        if (path.startsWith('/dashboard') && userRole !== 'STUDENT') {
            const dest = userRole === 'ADMIN' ? '/admin' : '/tutor/dashboard';
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
        '/login/',
        '/register',
        '/register/'
    ],
};
