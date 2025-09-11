import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
	if (typeof document === 'undefined') return null;

	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null;
	}
	return null;
};

export const useSyncAuth = () => {
	const { token, setToken } = useAuthStore();

	useEffect(() => {
		// Chỉ sync khi chưa có token trong store
		if (!token) {
			const cookieToken = getCookie('token');
			if (cookieToken) {
				setToken(cookieToken);
			}
		}
	}, [token, setToken]);
};
