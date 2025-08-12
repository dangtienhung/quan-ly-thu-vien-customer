import { authApi } from '@/apis/auth';
import { useAuth } from '@/contexts/AuthContext';
import type {
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	ResetPasswordRequest,
} from '@/types/auth';
import { useCallback } from 'react';

// Hook for login functionality
export const useLogin = () => {
	const { login, isLoading, error, clearError } = useAuth();

	const handleLogin = useCallback(
		async (credentials: LoginRequest) => {
			try {
				clearError();
				await login(credentials);
				return { success: true };
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
				};
			}
		},
		[login, clearError]
	);

	return {
		login: handleLogin,
		isLoading,
		error,
		clearError,
	};
};

// Hook for logout functionality
export const useLogout = () => {
	const { logout } = useAuth();

	const handleLogout = useCallback(() => {
		logout();
	}, [logout]);

	return {
		logout: handleLogout,
	};
};

// Hook for change password functionality
export const useChangePassword = () => {
	const { token } = useAuth();

	const changePassword = useCallback(
		async (data: ChangePasswordRequest) => {
			if (!token) {
				throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
			}

			try {
				const response = await authApi.changePassword(data, token);
				return { success: true, message: response.message };
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Đổi mật khẩu thất bại',
				};
			}
		},
		[token]
	);

	return {
		changePassword,
	};
};

// Hook for forgot password functionality
export const useForgotPassword = () => {
	const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
		try {
			const response = await authApi.forgotPassword(data);
			return { success: true, message: response.message };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Gửi email đặt lại mật khẩu thất bại',
			};
		}
	}, []);

	return {
		forgotPassword,
	};
};

// Hook for reset password functionality
export const useResetPassword = () => {
	const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
		try {
			const response = await authApi.resetPassword(data);
			return { success: true, message: response.message };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại',
			};
		}
	}, []);

	return {
		resetPassword,
	};
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
	const { isAuthenticated, isLoading } = useAuth();

	return {
		isAuthenticated,
		isLoading,
	};
};

// Hook to get current user
export const useCurrentUser = () => {
	const { user, isAuthenticated } = useAuth();

	return {
		user,
		isAuthenticated,
	};
};

// Hook to check if user is admin
export const useIsAdmin = () => {
	const { user } = useAuth();

	return {
		isAdmin: user?.role === 'admin',
		user,
	};
};
