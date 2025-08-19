export enum UserRole {
	READER = 'reader',
	ADMIN = 'admin',
}

export enum AccountStatus {
	ACTIVE = 'active',
	SUSPENDED = 'suspended',
	BANNED = 'banned',
}

export interface User {
	id: string;
	username: string;
	userCode?: string; // Mã sinh viên/nhân viên
	email: string;
	role: UserRole;
	accountStatus: AccountStatus;
	lastLogin?: string;
	createdAt: string;
	updatedAt: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	user?: User; // Optional since your API might not return user data in login response
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface FilterUsersRequest {
	page?: number;
	limit?: number;
	type?: UserRole;
}

export interface PaginatedUsersResponse {
	data: User[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}
