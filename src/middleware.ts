import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Danh sách các route không cần authentication
	const publicRoutes = [
		'/login',
		'/register',
		'/forgot-password',
		'/reset-password',
	];

	// Danh sách các route cần authentication (private routes)
	const privateRoutes = [
		'/',
		'/profile',
		'/books',
		'/borrow-records',
		'/reservations',
		'/notifications',
		'/settings',
		'/dashboard',
		'/admin',
		'/librarian',
	];

	// Kiểm tra xem route hiện tại có phải là public route không
	const isPublicRoute = publicRoutes.includes(pathname);

	// Kiểm tra xem route hiện tại có phải là private route không
	const isPrivateRoute = privateRoutes.includes(pathname);

	// Lấy token từ cookie
	const token = request.cookies.get('token')?.value;

	// Nếu đang ở private route và không có token -> redirect to login
	if (isPrivateRoute && !token) {
		const loginUrl = new URL('/login', request.url);
		return NextResponse.redirect(loginUrl);
	}

	// Nếu có token và đang ở public route -> redirect to home
	if (token && isPublicRoute) {
		const homeUrl = new URL('/', request.url);
		return NextResponse.redirect(homeUrl);
	}

	return NextResponse.next();
}

// Cấu hình matcher để middleware chạy trên tất cả routes trừ static files
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
