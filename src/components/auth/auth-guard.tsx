'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/auth-store';

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { token, isAuthenticated } = useAuthStore();

	// useEffect(() => {
	// 	// Danh sách các route không cần authentication
	// 	const publicRoutes = ['/login', '/register', '/forgot-password'];
	// 	const isPublicRoute = publicRoutes.includes(pathname);

	// 	// Nếu không có token và không phải public route
	// 	if (!token && !isPublicRoute) {
	// 		router.push('/login');
	// 		return;
	// 	}

	// 	// Nếu có token và đang ở public route (login, register)
	// 	if (token && isPublicRoute) {
	// 		router.push('/');
	// 		return;
	// 	}
	// }, [token, pathname, router]);

	// Hiển thị loading hoặc children tùy thuộc vào trạng thái
	if (
		!isAuthenticated &&
		!['/login', '/register', '/forgot-password'].includes(pathname)
	) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
