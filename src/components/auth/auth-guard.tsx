'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Loader } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { token, isAuthenticated } = useAuthStore();

	useEffect(() => {
		// Danh sách các route không cần authentication
		const publicRoutes = ['/login', '/register', '/forgot-password'];
		const isPublicRoute = publicRoutes.includes(pathname);

		// Nếu không có token và không phải public route
		if (!token && !isPublicRoute) {
			router.push('/login');
			return;
		}

		// Nếu có token và đang ở public route (login, register)
		if (token && isPublicRoute) {
			router.push('/');
			return;
		}
	}, [token, pathname, router]);

	// Hiển thị loading hoặc children tùy thuộc vào trạng thái
	if (
		!isAuthenticated &&
		!['/login', '/register', '/forgot-password'].includes(pathname)
	) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="flex items-center justify-center">
						<Loader className="w-4 h-4 text-primary animate-spin" />
					</div>
					<p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
