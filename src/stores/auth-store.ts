import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper functions for cookie management
const setCookie = (name: string, value: string, days: number = 7) => {
	if (typeof document !== 'undefined') {
		const expires = new Date();
		expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
	}
};

const deleteCookie = (name: string) => {
	if (typeof document !== 'undefined') {
		// Xóa cookie với nhiều cách để đảm bảo chắc chắn
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
		console.log('🗑️ Cookie deleted:', name);
	}
};

interface AuthState {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	login: (token: string, user: User | null) => void;
	logout: () => void;
	setToken: (token: string) => void;
	setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			isAuthenticated: false,

			login: (token: string, user: User | null) => {
				set({
					token,
					user,
					isAuthenticated: true,
				});
				// Lưu token vào cookie để middleware có thể đọc được
				setCookie('token', token, 7);
			},

			logout: () => {
				console.log('🚪 Logging out...');
				set({
					token: null,
					user: null,
					isAuthenticated: false,
				});
				// Xóa token khỏi cookie
				deleteCookie('token');
				console.log('✅ Logout completed');
			},

			setToken: (token: string) => {
				set({ token, isAuthenticated: !!token });
				// Cập nhật cookie khi set token
				setCookie('token', token, 7);
			},

			setUser: (user: User) => {
				set({ user });
			},
		}),
		{
			name: 'auth-storage', // localStorage key
			partialize: (state) => ({
				token: state.token,
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
