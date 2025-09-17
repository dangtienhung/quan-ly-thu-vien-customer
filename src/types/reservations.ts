// Reservations Types based on reservations.md documentation
export interface Reservation {
	id: string;
	reader_id: string;
	book_id: string;
	reservation_date: string;
	expiry_date: string;
	status: ReservationStatus;
	reader_notes?: string;
	priority: number;
	fulfillment_date?: string;
	fulfilled_by?: string;
	librarian_notes?: string;
	cancelled_date?: string;
	cancelled_by?: string;
	cancellation_reason?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ReservationWithDetails extends Reservation {
	reader: {
		id: string;
		fullName: string;
		cardNumber: string;
	};
	book: {
		id: string;
		title: string;
		isbn: string;
		cover_image?: string;
	};
	fulfilledBy?: {
		id: string;
		username: string;
		fullName: string;
	};
	cancelledBy?: {
		id: string;
		username: string;
		fullName: string;
	};
}

export type ReservationStatus =
	| 'pending'
	| 'fulfilled'
	| 'cancelled'
	| 'expired';

export interface CreateReservationDto {
	reader_id: string;
	book_id: string;
	reservation_date: string;
	expiry_date: string;
	reader_notes?: string;
	priority?: number;
	physical_copy_id?: string;
}

export interface CreateMultipleReservationsDto {
	reservations: CreateReservationDto[];
}

export interface UpdateReservationDto {
	status?: ReservationStatus;
	librarian_notes?: string;
	fulfillment_date?: string;
	fulfilled_by?: string;
	cancelled_date?: string;
	cancelled_by?: string;
	cancellation_reason?: string;
}

export interface ReservationsResponse {
	data: ReservationWithDetails[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface ReservationsQueryParams {
	page?: number;
	limit?: number;
	status?: ReservationStatus;
}

export interface SearchReservationsParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface ExpiringSoonParams {
	days?: number;
	page?: number;
	limit?: number;
}

export interface ReservationsStats {
	total: number;
	pending: number;
	fulfilled: number;
	cancelled: number;
	expired: number;
	byStatus: Array<{
		status: ReservationStatus;
		count: number;
	}>;
	byMonth: Array<{
		month: string;
		count: number;
	}>;
	expiringSoon: number;
}

export interface FulfillReservationDto {
	librarianId: string;
	notes?: string;
}

export interface CancelReservationDto {
	librarianId: string;
	reason?: string;
}

export interface AutoCancelExpiredResponse {
	cancelledCount: number;
}
