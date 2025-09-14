import { LoginRequest, UserRole } from '@/types/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

import { authApi } from '@/apis/auth';
import { useAuthStore } from '@/stores/auth-store';

export const useAuth = () => {
	const { token, user, isAuthenticated, login, logout } = useAuthStore();

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
		onSuccess: async (data: any) => {
			// Lưu token trước
			login(data.access_token, null);

			// Sau đó lấy thông tin user
			try {
				const user = await authApi.getCurrentUser(data.access_token);

				// Kiểm tra nếu user có role admin
				if (user.role === UserRole.ADMIN) {
					console.log('🚫 Admin user detected, logging out...');

					// Xóa token và user data ngay lập tức
					logout();

					// Xóa thêm localStorage và cookie để đảm bảo
					if (typeof window !== 'undefined') {
						localStorage.removeItem('auth-storage');
						localStorage.removeItem('redirectAfterLogin');

						// Xóa cookie token
						document.cookie =
							'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
						document.cookie =
							'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=' +
							window.location.hostname +
							';';
						document.cookie =
							'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.' +
							window.location.hostname +
							';';
					}

					// Throw error để prevent login
					throw new Error(
						'Tài khoản admin không thể đăng nhập vào ứng dụng khách hàng. Vui lòng sử dụng tài khoản độc giả.'
					);
				}

				useAuthStore.getState().setUser(user);
			} catch (error) {
				// Nếu là admin error, re-throw để UI hiển thị
				if (error instanceof Error && error.message.includes('admin')) {
					throw error;
				}
				console.error('Failed to get user info:', error);
			}
		},
	});

	// Logout mutation - tự xử lý logout local
	const logoutMutation = useMutation({
		mutationFn: () => Promise.resolve(), // Không gọi API logout
		onSuccess: () => {
			logout();
		},
	});

	// Get current user query
	const currentUserQuery = useQuery({
		queryKey: ['currentUser'],
		queryFn: () => authApi.getCurrentUser(token!),
		enabled: !!token, // Chỉ chạy khi có token
		retry: false,
	});

	return {
		// State
		token,
		user,
		isAuthenticated,

		// Mutations
		login: loginMutation.mutate,
		logout: logoutMutation.mutate,

		// Loading states
		isLoggingIn: loginMutation.isPending,
		isLoggingOut: logoutMutation.isPending,

		// Error states
		loginError: loginMutation.error,
		logoutError: logoutMutation.error,

		// Current user
		currentUser: currentUserQuery.data,
		isLoadingUser: currentUserQuery.isLoading,
		userError: currentUserQuery.error,
	};
};
