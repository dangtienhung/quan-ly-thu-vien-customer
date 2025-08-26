import type {
	CardExpiryCheck,
	CreateReaderDto,
	ReaderExpiringSoonParams,
	ReaderWithDetails,
	ReadersQueryParams,
	ReadersResponse,
	RenewCardDto,
	SearchReadersParams,
	UpdateReaderDto,
} from '@/types/readers';

import instance from '@/configs/instances';

// API functions
export const readersApi = {
	// 1. Create new reader
	create: async (data: CreateReaderDto): Promise<ReaderWithDetails> => {
		const response = await instance.post('/readers', data);
		return response.data;
	},

	// 2. Get readers list with pagination
	getReaders: async (
		params: ReadersQueryParams = {}
	): Promise<ReadersResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(`/readers?${queryParams.toString()}`);
		return response.data;
	},

	// 3. Search readers
	searchReaders: async (
		params: SearchReadersParams
	): Promise<ReadersResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/readers/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 4. Get expired cards
	getExpiredCards: async (
		params: ReadersQueryParams = {}
	): Promise<ReadersResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/readers/expired-cards?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get expiring soon cards
	getExpiringSoon: async (
		params: ReaderExpiringSoonParams = {}
	): Promise<ReadersResponse> => {
		const queryParams = new URLSearchParams();
		if (params.days) queryParams.append('days', params.days.toString());
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/readers/expiring-soon?${queryParams.toString()}`
		);
		return response.data;
	},

	// 6. Generate new card number
	generateCardNumber: async (): Promise<{ cardNumber: string }> => {
		const response = await instance.get('/readers/generate-card-number');
		return response.data;
	},

	// 7. Get readers by type
	getReadersByType: async (
		readerTypeId: string,
		params: ReadersQueryParams = {}
	): Promise<ReadersResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/readers/type/${readerTypeId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 8. Get reader by ID
	getReaderById: async (id: string): Promise<ReaderWithDetails> => {
		const response = await instance.get(`/readers/${id}`);
		return response.data;
	},

	// 9. Get reader by user ID
	getReaderByUserId: async (userId: string): Promise<ReaderWithDetails> => {
		const response = await instance.get(`/readers/user/${userId}`);
		return response.data;
	},

	// 10. Get reader by card number
	getReaderByCardNumber: async (
		cardNumber: string
	): Promise<ReaderWithDetails> => {
		const response = await instance.get(`/readers/card/${cardNumber}`);
		return response.data;
	},

	// 11. Update reader by ID
	updateReaderById: async (
		id: string,
		data: UpdateReaderDto
	): Promise<ReaderWithDetails> => {
		const response = await instance.patch(`/readers/${id}`, data);
		return response.data;
	},

	// 12. Activate reader card
	activateReaderCard: async (id: string): Promise<ReaderWithDetails> => {
		const response = await instance.patch(`/readers/${id}/activate`);
		return response.data;
	},

	// 13. Deactivate reader card
	deactivateReaderCard: async (id: string): Promise<ReaderWithDetails> => {
		const response = await instance.patch(`/readers/${id}/deactivate`);
		return response.data;
	},

	// 14. Check card expiry
	checkCardExpiry: async (id: string): Promise<CardExpiryCheck> => {
		const response = await instance.get(`/readers/${id}/check-expiry`);
		return response.data;
	},

	// 15. Renew reader card
	renewReaderCard: async (
		id: string,
		data: RenewCardDto
	): Promise<ReaderWithDetails> => {
		const response = await instance.patch(`/readers/${id}/renew-card`, data);
		return response.data;
	},

	// 16. Delete reader by ID
	deleteReaderById: async (id: string): Promise<void> => {
		await instance.delete(`/readers/${id}`);
	},
};
