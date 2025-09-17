import type {
	AutoCancelExpiredResponse,
	CancelReservationDto,
	CreateMultipleReservationsDto,
	CreateReservationDto,
	ExpiringSoonParams,
	FulfillReservationDto,
	ReservationWithDetails,
	ReservationsQueryParams,
	ReservationsResponse,
	ReservationsStats,
	SearchReservationsParams,
	UpdateReservationDto,
} from '@/types/reservations';

import instance from '@/configs/instances';

// API functions
export const reservationsApi = {
	// 1. Create new reservation
	create: async (
		data: CreateReservationDto
	): Promise<ReservationWithDetails> => {
		const response = await instance.post('/reservations', data);
		return response.data;
	},

	// 2. Create multiple reservations
	createMultiple: async (
		data: CreateMultipleReservationsDto
	): Promise<{
		created: ReservationWithDetails[];
		failed: Array<{
			index: number;
			error: string;
			data: any;
		}>;
		total: number;
		successCount: number;
		failureCount: number;
	}> => {
		const response = await instance.post('/reservations/bulk', data);
		return response.data;
	},

	// 3. Get reservations list with pagination
	getReservations: async (
		params: ReservationsQueryParams = {}
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reservations?${queryParams.toString()}`
		);
		return response.data;
	},

	// 4. Search reservations
	searchReservations: async (
		params: SearchReservationsParams
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reservations/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get reservations by status
	getReservationsByStatus: async (
		status: string,
		params: ReservationsQueryParams = {}
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reservations/status/${status}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 6. Get reservations by reader
	getReservationsByReader: async (
		readerId: string,
		params: ReservationsQueryParams = {}
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(`/reservations/reader/${readerId}`, {
			params,
		});
		return response.data;
	},

	// 7. Get reservations by book
	getReservationsByBook: async (
		bookId: string,
		params: ReservationsQueryParams = {}
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reservations/book/${bookId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 8. Get expiring soon reservations
	getExpiringSoon: async (
		params: ExpiringSoonParams = {}
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.days) queryParams.append('days', params.days.toString());
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reservations/expiring-soon?${queryParams.toString()}`
		);
		return response.data;
	},

	// 9. Get expired reservations
	getExpiredReservations: async (
		params: ReservationsQueryParams = {}
	): Promise<ReservationsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reservations/expired?${queryParams.toString()}`
		);
		return response.data;
	},

	// 10. Get reservations statistics
	getReservationsStats: async (): Promise<ReservationsStats> => {
		const response = await instance.get('/reservations/stats');
		return response.data;
	},

	// 11. Get reservation by ID
	getReservationById: async (id: string): Promise<ReservationWithDetails> => {
		const response = await instance.get(`/reservations/${id}`);
		return response.data;
	},

	// 12. Update reservation by ID
	updateReservationById: async (
		id: string,
		data: UpdateReservationDto
	): Promise<ReservationWithDetails> => {
		const response = await instance.patch(`/reservations/${id}`, data);
		return response.data;
	},

	// 13. Fulfill reservation
	fulfillReservation: async (
		id: string,
		data: FulfillReservationDto
	): Promise<ReservationWithDetails> => {
		const response = await instance.patch(`/reservations/${id}/fulfill`, data);
		return response.data;
	},

	// 14. Cancel reservation
	cancelReservation: async (
		id: string,
		data: CancelReservationDto
	): Promise<ReservationWithDetails> => {
		const response = await instance.patch(`/reservations/${id}/cancel`, data);
		return response.data;
	},

	// 15. Auto cancel expired reservations
	autoCancelExpired: async (): Promise<AutoCancelExpiredResponse> => {
		const response = await instance.post('/reservations/auto-cancel-expired');
		return response.data;
	},

	// 16. Delete reservation by ID
	deleteReservationById: async (id: string): Promise<void> => {
		await instance.delete(`/reservations/${id}`);
	},
};
