import { useMutation, useQuery } from '@tanstack/react-query';

import { authApi } from '@/apis/auth';
import { useAuthStore } from '@/stores/auth-store';
import { LoginRequest } from '@/types/auth';

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
				useAuthStore.getState().setUser(user);
			} catch (error) {
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
