// Fines Types based on fines.md documentation
export interface Fine {
	id: string;
	borrow_id: string;
	fine_amount: number;
	paid_amount: number;
	fine_date: string;
	payment_date?: string;
	reason: FineType;
	description?: string;
	status: FineStatus;
	overdue_days?: number;
	daily_rate?: number;
	librarian_notes?: string;
	reader_notes?: string;
	due_date?: string;
	payment_method?: PaymentMethod;
	transaction_id?: string;
	createdAt: string;
	updatedAt: string;
}

export interface FineWithDetails extends Fine {
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
}

export type FineType = 'overdue' | 'damage' | 'lost' | 'administrative';
export type FineStatus = 'unpaid' | 'paid' | 'partially_paid' | 'waived';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online';

export interface CreateFineDto {
	borrow_id: string;
	fine_amount: number;
	paid_amount?: number;
	fine_date: string;
	payment_date?: string;
	reason: FineType;
	description?: string;
	status?: FineStatus;
	overdue_days?: number;
	daily_rate?: number;
	librarian_notes?: string;
	reader_notes?: string;
	due_date?: string;
	payment_method?: PaymentMethod;
	transaction_id?: string;
}

export type UpdateFineDto = Partial<CreateFineDto>;

export interface FinesResponse {
	data: FineWithDetails[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface FinesQueryParams {
	page?: number;
	limit?: number;
}

export interface SearchFinesParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface FinesStats {
	total: number;
	unpaid: number;
	paid: number;
	partially_paid: number;
	waived: number;
	totalAmount: number;
	totalPaid: number;
	totalUnpaid: number;
	byType: Array<{
		type: FineType;
		count: number;
		amount: number;
	}>;
	byMonth: Array<{
		month: string;
		count: number;
		amount: number;
	}>;
}

export interface CreateOverdueFineDto {
	overdueDays: number;
	dailyRate?: number;
}

export interface PayFineDto {
	amount: number;
	paymentMethod: PaymentMethod;
	transactionId?: string;
}

export interface WaiveFineDto {
	librarianNotes?: string;
}
