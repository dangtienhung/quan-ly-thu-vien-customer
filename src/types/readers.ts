// Readers Types based on readers.md documentation
export interface Reader {
	id: string;
	fullName: string;
	dateOfBirth: string;
	gender: 'male' | 'female' | 'other';
	address: string;
	phone: string;
	userId: string;
	readerTypeId: string;
	cardNumber: string;
	cardIssueDate: string;
	cardExpiryDate: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ReaderWithDetails extends Reader {
	user: {
		id: string;
		username: string;
		email: string;
	};
	readerType: {
		id: string;
		typeName: string;
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
}

export interface CreateReaderDto {
	fullName: string;
	dob: string;
	gender: 'male' | 'female' | 'other';
	address: string;
	phone: string;
	userId: string;
	readerTypeId: string;
	cardNumber?: string;
	cardIssueDate?: string;
	cardExpiryDate: string;
}

export type UpdateReaderDto = Partial<Omit<CreateReaderDto, 'userId'>>;

export interface ReadersResponse {
	data: ReaderWithDetails[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface ReadersQueryParams {
	page?: number;
	limit?: number;
}

export interface SearchReadersParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface ReaderExpiringSoonParams {
	days?: number;
	page?: number;
	limit?: number;
}

export interface RenewCardDto {
	newExpiryDate: string;
}

export interface CardExpiryCheck {
	isExpired: boolean;
	daysUntilExpiry: number;
	expiryDate: string;
}
