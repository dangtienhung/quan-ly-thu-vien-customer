import instance from '@/configs/instances';
import type {
	CreateFineDto,
	CreateOverdueFineDto,
	FineWithDetails,
	FinesQueryParams,
	FinesResponse,
	FinesStats,
	PayFineDto,
	SearchFinesParams,
	UpdateFineDto,
	WaiveFineDto,
} from '@/types/fines';

// API functions
export const finesApi = {
	// 1. Create new fine
	create: async (data: CreateFineDto): Promise<FineWithDetails> => {
		const response = await instance.post('/fines', data);
		return response.data;
	},

	// 2. Create overdue fine automatically
	createOverdueFine: async (
		borrowId: string,
		data: CreateOverdueFineDto
	): Promise<FineWithDetails> => {
		const response = await instance.post(`/fines/overdue/${borrowId}`, data);
		return response.data;
	},

	// 3. Get fines list with pagination
	getFines: async (params: FinesQueryParams = {}): Promise<FinesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(`/fines?${queryParams.toString()}`);
		return response.data;
	},

	// 4. Search fines
	searchFines: async (params: SearchFinesParams): Promise<FinesResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/fines/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get fines by status
	getFinesByStatus: async (
		status: string,
		params: FinesQueryParams = {}
	): Promise<FinesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/fines/status/${status}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 6. Get fines by type
	getFinesByType: async (
		type: string,
		params: FinesQueryParams = {}
	): Promise<FinesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/fines/type/${type}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 7. Get fines by borrow record
	getFinesByBorrow: async (
		borrowId: string,
		params: FinesQueryParams = {}
	): Promise<FinesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/fines/borrow/${borrowId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 8. Get overdue fines
	getOverdueFines: async (
		params: FinesQueryParams = {}
	): Promise<FinesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/fines/overdue?${queryParams.toString()}`
		);
		return response.data;
	},

	// 9. Get fines statistics
	getFinesStats: async (): Promise<FinesStats> => {
		const response = await instance.get('/fines/stats');
		return response.data;
	},

	// 10. Get fine by ID
	getFineById: async (id: string): Promise<FineWithDetails> => {
		const response = await instance.get(`/fines/${id}`);
		return response.data;
	},

	// 11. Update fine by ID
	updateFineById: async (
		id: string,
		data: UpdateFineDto
	): Promise<FineWithDetails> => {
		const response = await instance.patch(`/fines/${id}`, data);
		return response.data;
	},

	// 12. Pay fine
	payFine: async (id: string, data: PayFineDto): Promise<FineWithDetails> => {
		const response = await instance.patch(`/fines/${id}/pay`, data);
		return response.data;
	},

	// 13. Waive fine
	waiveFine: async (
		id: string,
		data: WaiveFineDto
	): Promise<FineWithDetails> => {
		const response = await instance.patch(`/fines/${id}/waive`, data);
		return response.data;
	},

	// 14. Delete fine by ID
	deleteFineById: async (id: string): Promise<void> => {
		await instance.delete(`/fines/${id}`);
	},
};
