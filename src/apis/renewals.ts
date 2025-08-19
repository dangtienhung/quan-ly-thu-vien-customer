import instance from '@/configs/instances';
import type {
	ApproveRenewalDto,
	CreateRenewalDto,
	RejectRenewalDto,
	RenewalWithDetails,
	RenewalsQueryParams,
	RenewalsResponse,
	RenewalsStats,
	SearchRenewalsParams,
	UpdateRenewalDto,
} from '@/types/renewals';

// API functions
export const renewalsApi = {
	// 1. Create new renewal
	create: async (data: CreateRenewalDto): Promise<RenewalWithDetails> => {
		const response = await instance.post('/renewals', data);
		return response.data;
	},

	// 2. Get renewals list with pagination
	getRenewals: async (
		params: RenewalsQueryParams = {}
	): Promise<RenewalsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(`/renewals?${queryParams.toString()}`);
		return response.data;
	},

	// 3. Search renewals
	searchRenewals: async (
		params: SearchRenewalsParams
	): Promise<RenewalsResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/renewals/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 4. Get renewals by status
	getRenewalsByStatus: async (
		status: string,
		params: RenewalsQueryParams = {}
	): Promise<RenewalsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/renewals/status/${status}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get renewals by borrow record
	getRenewalsByBorrow: async (
		borrowId: string,
		params: RenewalsQueryParams = {}
	): Promise<RenewalsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/renewals/borrow/${borrowId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 6. Get renewals by librarian
	getRenewalsByLibrarian: async (
		librarianId: string,
		params: RenewalsQueryParams = {}
	): Promise<RenewalsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/renewals/librarian/${librarianId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 7. Get renewals statistics
	getRenewalsStats: async (): Promise<RenewalsStats> => {
		const response = await instance.get('/renewals/stats');
		return response.data;
	},

	// 8. Get renewal by ID
	getRenewalById: async (id: string): Promise<RenewalWithDetails> => {
		const response = await instance.get(`/renewals/${id}`);
		return response.data;
	},

	// 9. Update renewal by ID
	updateRenewalById: async (
		id: string,
		data: UpdateRenewalDto
	): Promise<RenewalWithDetails> => {
		const response = await instance.patch(`/renewals/${id}`, data);
		return response.data;
	},

	// 10. Approve renewal
	approveRenewal: async (
		id: string,
		data: ApproveRenewalDto
	): Promise<RenewalWithDetails> => {
		const response = await instance.patch(`/renewals/${id}/approve`, data);
		return response.data;
	},

	// 11. Reject renewal
	rejectRenewal: async (
		id: string,
		data: RejectRenewalDto
	): Promise<RenewalWithDetails> => {
		const response = await instance.patch(`/renewals/${id}/reject`, data);
		return response.data;
	},

	// 12. Delete renewal by ID
	deleteRenewalById: async (id: string): Promise<void> => {
		await instance.delete(`/renewals/${id}`);
	},
};
