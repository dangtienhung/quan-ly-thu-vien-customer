import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
			},

			logout: () => {
				set({
					token: null,
					user: null,
					isAuthenticated: false,
				});
			},

			setToken: (token: string) => {
				set({ token, isAuthenticated: !!token });
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
