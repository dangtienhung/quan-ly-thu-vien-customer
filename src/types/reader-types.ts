// Reader Types based on reader-types.md documentation
export interface ReaderType {
	id: string;
	typeName: 'student' | 'teacher' | 'staff';
	maxBorrowLimit: number;
	borrowDurationDays: number;
	description?: string;
	lateReturnFinePerDay: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateReaderTypeDto {
	typeName: 'student' | 'teacher' | 'staff';
	maxBorrowLimit: number;
	borrowDurationDays: number;
	description?: string;
	lateReturnFinePerDay: number;
}

export type UpdateReaderTypeDto = Partial<CreateReaderTypeDto>;

export interface ReaderTypesResponse {
	data: ReaderType[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface ReaderTypesQueryParams {
	page?: number;
	limit?: number;
}

export interface ReaderTypeStatistics {
	statistics: Array<{
		typeName: string;
		totalReaders: number;
		activeBorrows: number;
		averageBorrowDuration: number;
		totalFines: number;
	}>;
}

export interface DefaultSettings {
	student: {
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
	teacher: {
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
	staff: {
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
}
