// Borrow Records Types based on brrow-records.md documentation
export interface BorrowRecord {
	id: string;
	reader_id: string;
	copy_id: string;
	borrow_date: string;
	due_date: string;
	return_date?: string;
	status: BorrowStatus;
	librarian_id: string;
	borrow_notes?: string;
	return_notes?: string;
	renewal_count: number;
	createdAt: string;
	updatedAt: string;
}

export interface BorrowRecordWithDetails extends BorrowRecord {
	reader: {
		id: string;
		fullName: string;
		cardNumber: string;
	};
	physicalCopy: {
		id: string;
		barcode: string;
		book: {
			id: string;
			title: string;
			isbn: string;
			cover_image?: string;
		};
	};
	librarian: {
		id: string;
		username: string;
		fullName: string;
	};
}

export type BorrowStatus =
	| 'pending_approval'
	| 'borrowed'
	| 'returned'
	| 'overdue'
	| 'renewed'
	| 'cancelled';

export interface CreateBorrowRecordDto {
	reader_id: string;
	copy_id: string;
	borrow_date: string;
	due_date: string;
	return_date?: string;
	status?: BorrowStatus;
	librarian_id: string;
	borrow_notes?: string;
	return_notes?: string;
	renewal_count?: number;
}

export type UpdateBorrowRecordDto = Partial<CreateBorrowRecordDto>;

export interface BorrowRecordsResponse {
	data: BorrowRecordWithDetails[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface BorrowRecordsQueryParams {
	page?: number;
	limit?: number;
}

export interface SearchBorrowRecordsParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface BorrowRecordsStats {
	total: number;
	borrowed: number;
	returned: number;
	overdue: number;
	renewed: number;
	cancelled: number;
	byMonth: Array<{
		month: string;
		count: number;
	}>;
}

export interface ReturnBookDto {
	returnNotes?: string;
}

export interface RenewBookDto {
	newDueDate: string;
}

export interface ApproveBorrowRecordDto {
	librarianId: string;
	notes?: string;
}

export interface RejectBorrowRecordDto {
	librarianId: string;
	reason: string;
}
