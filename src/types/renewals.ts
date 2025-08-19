// Renewals Types based on renewals.md documentation
export interface Renewal {
	id: string;
	borrow_id: string;
	renewal_date: string;
	new_due_date: string;
	librarian_id: string;
	reason?: string;
	librarian_notes?: string;
	renewal_number: number;
	status: RenewalStatus;
	createdAt: string;
	updatedAt: string;
}

export interface RenewalWithDetails extends Renewal {
	borrowRecord: {
		id: string;
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
			};
		};
	};
	librarian: {
		id: string;
		username: string;
		fullName: string;
	};
}

export type RenewalStatus = 'approved' | 'pending' | 'rejected';

export interface CreateRenewalDto {
	borrow_id: string;
	renewal_date: string;
	new_due_date: string;
	librarian_id: string;
	reason?: string;
	librarian_notes?: string;
	renewal_number: number;
	status?: RenewalStatus;
}

export type UpdateRenewalDto = Partial<CreateRenewalDto>;

export interface RenewalsResponse {
	data: RenewalWithDetails[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface RenewalsQueryParams {
	page?: number;
	limit?: number;
}

export interface SearchRenewalsParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface RenewalsStats {
	total: number;
	approved: number;
	pending: number;
	rejected: number;
	byMonth: Array<{
		month: string;
		count: number;
	}>;
}

export interface ApproveRenewalDto {
	librarianNotes?: string;
}

export interface RejectRenewalDto {
	librarianNotes?: string;
}
