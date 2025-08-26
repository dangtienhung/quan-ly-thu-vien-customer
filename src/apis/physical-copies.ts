import type {
	CreatePhysicalCopyDto,
	PhysicalCopiesQueryParams,
	PhysicalCopiesResponse,
	PhysicalCopiesStats,
	PhysicalCopyWithDetails,
	SearchPhysicalCopiesParams,
	UpdatePhysicalCopyDto,
} from '@/types/physical-copies';

import instance from '@/configs/instances';

// API functions
export const physicalCopiesApi = {
	// 1. Create new physical copy
	create: async (
		data: CreatePhysicalCopyDto
	): Promise<PhysicalCopyWithDetails> => {
		const response = await instance.post('/physical-copies', data);
		return response.data;
	},

	// 2. Get physical copies list with pagination
	getPhysicalCopies: async (
		params: PhysicalCopiesQueryParams = {}
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.status) queryParams.append('status', params.status);
		if (params.condition) queryParams.append('condition', params.condition);
		if (params.location) queryParams.append('location', params.location);

		const response = await instance.get(
			`/physical-copies?${queryParams.toString()}`
		);
		return response.data;
	},

	// 3. Search physical copies
	searchPhysicalCopies: async (
		params: SearchPhysicalCopiesParams
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/physical-copies/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 4. Get physical copies by book
	getPhysicalCopiesByBook: async (
		bookId: string,
		params: PhysicalCopiesQueryParams = {}
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.status) queryParams.append('status', params.status);
		if (params.condition) queryParams.append('condition', params.condition);

		const response = await instance.get(
			`/physical-copies/book/${bookId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get available physical copies by book
	getAvailablePhysicalCopiesByBook: async (
		bookId: string,
		params: PhysicalCopiesQueryParams = {}
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/physical-copies/book/${bookId}/available`,
			{ params: queryParams }
		);
		return response.data;
	},

	// 6. Get physical copies by status
	getPhysicalCopiesByStatus: async (
		status: string,
		params: PhysicalCopiesQueryParams = {}
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/physical-copies/status/${status}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 7. Get physical copies by condition
	getPhysicalCopiesByCondition: async (
		condition: string,
		params: PhysicalCopiesQueryParams = {}
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/physical-copies/condition/${condition}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 8. Get physical copies by location
	getPhysicalCopiesByLocation: async (
		location: string,
		params: PhysicalCopiesQueryParams = {}
	): Promise<PhysicalCopiesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/physical-copies/location/${location}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 9. Get physical copies statistics
	getPhysicalCopiesStats: async (): Promise<PhysicalCopiesStats> => {
		const response = await instance.get('/physical-copies/stats');
		return response.data;
	},

	// 10. Get physical copy by ID
	getPhysicalCopyById: async (id: string): Promise<PhysicalCopyWithDetails> => {
		const response = await instance.get(`/physical-copies/${id}`);
		return response.data;
	},

	// 11. Get physical copy by barcode
	getPhysicalCopyByBarcode: async (
		barcode: string
	): Promise<PhysicalCopyWithDetails> => {
		const response = await instance.get(`/physical-copies/barcode/${barcode}`);
		return response.data;
	},

	// 12. Update physical copy by ID
	updatePhysicalCopyById: async (
		id: string,
		data: UpdatePhysicalCopyDto
	): Promise<PhysicalCopyWithDetails> => {
		const response = await instance.patch(`/physical-copies/${id}`, data);
		return response.data;
	},

	// 13. Update physical copy status
	updatePhysicalCopyStatus: async (
		id: string,
		data: { status: string; notes?: string }
	): Promise<PhysicalCopyWithDetails> => {
		const response = await instance.patch(
			`/physical-copies/${id}/status`,
			data
		);
		return response.data;
	},

	// 14. Delete physical copy by ID
	deletePhysicalCopyById: async (id: string): Promise<void> => {
		await instance.delete(`/physical-copies/${id}`);
	},
};
