'use client';

import { authApi } from '@/apis/auth';
import type { AuthState, LoginRequest, User } from '@/types/auth';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useReducer,
} from 'react';

// Action types
type AuthAction =
	| { type: 'LOGIN_START' }
	| { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
	| { type: 'LOGIN_FAILURE'; payload: string }
	| { type: 'LOGOUT' }
	| { type: 'LOAD_USER_START' }
	| { type: 'LOAD_USER_SUCCESS'; payload: User }
	| { type: 'LOAD_USER_FAILURE' }
	| { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'LOGIN_START':
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case 'LOGIN_FAILURE':
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: action.payload,
			};
		case 'LOGOUT':
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			};
		case 'LOAD_USER_START':
			return {
				...state,
				isLoading: true,
			};
		case 'LOAD_USER_SUCCESS':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case 'LOAD_USER_FAILURE':
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
			};
		case 'CLEAR_ERROR':
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
};

// Context
interface AuthContextType extends AuthState {
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => void;
	loadUser: () => Promise<void>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Load token from localStorage on mount
	useEffect(() => {
		const token = localStorage.getItem('auth_token');
		if (token) {
			dispatch({ type: 'LOAD_USER_START' });
			loadUserFromToken(token);
		} else {
			dispatch({ type: 'LOAD_USER_FAILURE' });
		}
	}, []);

	// Load user from token
	const loadUserFromToken = async (token: string) => {
		try {
			const user = await authApi.getCurrentUser(token);
			dispatch({ type: 'LOAD_USER_SUCCESS', payload: user });
		} catch (error) {
			localStorage.removeItem('auth_token');
			dispatch({ type: 'LOAD_USER_FAILURE' });
		}
	};

	// Login function
	const login = async (credentials: LoginRequest) => {
		try {
			dispatch({ type: 'LOGIN_START' });
			const response = await authApi.login(credentials);

			// Save token to localStorage
			localStorage.setItem('auth_token', response.access_token);

			let user: User;

			// Check if user data is included in the response
			if (response.user) {
				user = response.user;
			} else {
				// Fetch user data using the token
				user = await authApi.getCurrentUser(response.access_token);
			}

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user, token: response.access_token },
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Đăng nhập thất bại';
			dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
			throw error;
		}
	};

	// Logout function
	const logout = () => {
		localStorage.removeItem('auth_token');
		dispatch({ type: 'LOGOUT' });
	};

	// Load user function
	const loadUser = async () => {
		const token = localStorage.getItem('auth_token');
		if (!token) {
			dispatch({ type: 'LOAD_USER_FAILURE' });
			return;
		}

		try {
			dispatch({ type: 'LOAD_USER_START' });
			const user = await authApi.getCurrentUser(token);
			dispatch({ type: 'LOAD_USER_SUCCESS', payload: user });
		} catch (error) {
			localStorage.removeItem('auth_token');
			dispatch({ type: 'LOAD_USER_FAILURE' });
		}
	};

	// Clear error function
	const clearError = () => {
		dispatch({ type: 'CLEAR_ERROR' });
	};

	const value: AuthContextType = {
		...state,
		login,
		logout,
		loadUser,
		clearError,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
