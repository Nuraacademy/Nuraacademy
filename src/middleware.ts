import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userId = request.cookies.get('user_id')?.value;
    const { pathname } = request.nextUrl;

    // Define public routes
    const isPublicRoute =
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/classes' ||
        pathname.match(/^\/classes\/[^\/]+\/overview$/) ||
        pathname.startsWith('/api/') || // Allow API routes for now, or protect them separately
        pathname.includes('.'); // Allow static files

    if (!userId && !isPublicRoute) {
        // Redirect to login if trying to access a protected route without session
        const url = new URL('/login', request.url);
        // url.searchParams.set('callbackUrl', pathname); // Optional: add callback URL
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
