import type {
	ChangePasswordRequest,
	FilterUsersRequest,
	ForgotPasswordRequest,
	LoginRequest,
	LoginResponse,
	PaginatedUsersResponse,
	ResetPasswordRequest,
	User,
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.message || `HTTP error! status: ${response.status}`
		);
	}
	return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = (token?: string) => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
};

// Authentication APIs
export const authApi = {
	// Login
	login: async (credentials: LoginRequest): Promise<LoginResponse> => {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(credentials),
		});
		return handleResponse(response);
	},

	// Get current user profile
	getCurrentUser: async (token: string): Promise<User> => {
		const response = await fetch(`${API_BASE_URL}/users/me`, {
			method: 'GET',
			headers: getAuthHeaders(token),
		});
		return handleResponse(response);
	},

	// Change password
	changePassword: async (
		data: ChangePasswordRequest,
		token: string
	): Promise<{ message: string }> => {
		const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
			method: 'POST',
			headers: getAuthHeaders(token),
			body: JSON.stringify(data),
		});
		return handleResponse(response);
	},

	// Forgot password
	forgotPassword: async (
		data: ForgotPasswordRequest
	): Promise<{ message: string }> => {
		const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(data),
		});
		return handleResponse(response);
	},

	// Reset password
	resetPassword: async (
		data: ResetPasswordRequest
	): Promise<{ message: string }> => {
		const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(data),
		});
		return handleResponse(response);
	},

	// Get users list (Admin only)
	getUsers: async (
		params: FilterUsersRequest,
		token: string
	): Promise<PaginatedUsersResponse> => {
		const searchParams = new URLSearchParams();

		if (params.page) searchParams.append('page', params.page.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());
		if (params.type) searchParams.append('type', params.type);

		const response = await fetch(
			`${API_BASE_URL}/users?${searchParams.toString()}`,
			{
				method: 'GET',
				headers: getAuthHeaders(token),
			}
		);
		return handleResponse(response);
	},
};
