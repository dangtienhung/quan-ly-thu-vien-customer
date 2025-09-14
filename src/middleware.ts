import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	console.log('🚀 ~ middleware ~ pathname:', pathname);

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

	// Danh sách các pattern dynamic routes cần authentication
	const privateRoutePatterns = [
		/^\/books\/[^\/]+\/register$/, // /books/[slug]/register
		/^\/books\/[^\/]+\/view$/, // /books/[slug]/view
		/^\/books\/[^\/]+$/, // /books/[slug] - chi tiết sách
		/^\/profile\/[^\/]+$/, // /profile/[id]
		/^\/borrow-records\/[^\/]+$/, // /borrow-records/[id]
		/^\/reservations\/[^\/]+$/, // /reservations/[id]
	];

	// Kiểm tra xem route hiện tại có phải là public route không
	const isPublicRoute = publicRoutes.includes(pathname);

	// Kiểm tra xem route hiện tại có phải là private route không
	// Bao gồm cả exact match và dynamic routes
	const isExactPrivateRoute = privateRoutes.includes(pathname);
	const isDynamicPrivateRoute = privateRoutePatterns.some((pattern) =>
		pattern.test(pathname)
	);
	const isPrivateRoute = isExactPrivateRoute || isDynamicPrivateRoute;

	console.log('🚀 ~ middleware ~ isExactPrivateRoute:', isExactPrivateRoute);
	console.log(
		'🚀 ~ middleware ~ isDynamicPrivateRoute:',
		isDynamicPrivateRoute
	);
	console.log('🚀 ~ middleware ~ isPrivateRoute:', isPrivateRoute);

	// Lấy token từ cookie
	const token = request.cookies.get('token')?.value;
	console.log('🚀 ~ middleware ~ token:', token);
	console.log('🚀 ~ middleware ~ hasToken:', !!token);
	console.log(
		'🚀 ~ middleware ~ token:',
		token ? `${token.substring(0, 20)}...` : 'null'
	);

	// Nếu đang ở private route và không có token -> redirect to login
	if (isPrivateRoute && !token) {
		console.log(
			'🚫 Redirecting to login - no token for private route:',
			pathname
		);
		const loginUrl = new URL('/login', request.url);
		return NextResponse.redirect(loginUrl);
	}

	// Allow access to private routes with valid token
	if (isPrivateRoute && token) {
		console.log('✅ Allowing access to private route:', pathname);
		return NextResponse.next();
	}

	// Nếu có token và đang ở public route -> chỉ redirect nếu đang ở login page
	// Không redirect nếu đang ở các public routes khác như register, forgot-password
	if (token && isPublicRoute && pathname === '/login') {
		console.log(
			'🏠 Redirecting to home - has token but on login page:',
			pathname
		);
		const homeUrl = new URL('/', request.url);
		return NextResponse.redirect(homeUrl);
	}

	console.log('✅ Allowing access to route:', pathname);
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
