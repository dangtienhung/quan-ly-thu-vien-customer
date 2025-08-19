import instance from '@/configs/instances';
import type {
	ApproveBorrowRecordDto,
	BorrowRecordWithDetails,
	BorrowRecordsQueryParams,
	BorrowRecordsResponse,
	BorrowRecordsStats,
	CreateBorrowRecordDto,
	RejectBorrowRecordDto,
	RenewBookDto,
	ReturnBookDto,
	SearchBorrowRecordsParams,
	UpdateBorrowRecordDto,
} from '@/types/borrow-records';

// API functions
export const borrowRecordsApi = {
	// 1. Create new borrow record
	create: async (
		data: CreateBorrowRecordDto
	): Promise<BorrowRecordWithDetails> => {
		const response = await instance.post('/borrow-records', data);
		return response.data;
	},

	// 2. Get borrow records list with pagination
	getBorrowRecords: async (
		params: BorrowRecordsQueryParams = {}
	): Promise<BorrowRecordsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/borrow-records?${queryParams.toString()}`
		);
		return response.data;
	},

	// 3. Search borrow records
	searchBorrowRecords: async (
		params: SearchBorrowRecordsParams
	): Promise<BorrowRecordsResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/borrow-records/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 4. Get borrow records by status
	getBorrowRecordsByStatus: async (
		status: string,
		params: BorrowRecordsQueryParams = {}
	): Promise<BorrowRecordsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/borrow-records/status/${status}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get borrow records by reader
	getBorrowRecordsByReader: async (
		readerId: string,
		params: BorrowRecordsQueryParams = {}
	): Promise<BorrowRecordsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/borrow-records/reader/${readerId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 6. Get overdue borrow records
	getOverdueBorrowRecords: async (
		params: BorrowRecordsQueryParams = {}
	): Promise<BorrowRecordsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/borrow-records/overdue?${queryParams.toString()}`
		);
		return response.data;
	},

	// 7. Get borrow records statistics
	getBorrowRecordsStats: async (): Promise<BorrowRecordsStats> => {
		const response = await instance.get('/borrow-records/stats');
		return response.data;
	},

	// 8. Get borrow record by ID
	getBorrowRecordById: async (id: string): Promise<BorrowRecordWithDetails> => {
		const response = await instance.get(`/borrow-records/${id}`);
		return response.data;
	},

	// 9. Update borrow record by ID
	updateBorrowRecordById: async (
		id: string,
		data: UpdateBorrowRecordDto
	): Promise<BorrowRecordWithDetails> => {
		const response = await instance.patch(`/borrow-records/${id}`, data);
		return response.data;
	},

	// 10. Return book
	returnBook: async (
		id: string,
		data: ReturnBookDto
	): Promise<BorrowRecordWithDetails> => {
		const response = await instance.patch(`/borrow-records/${id}/return`, data);
		return response.data;
	},

	// 11. Renew book
	renewBook: async (
		id: string,
		data: RenewBookDto
	): Promise<BorrowRecordWithDetails> => {
		const response = await instance.patch(`/borrow-records/${id}/renew`, data);
		return response.data;
	},

	// 12. Get pending approval borrow records
	getPendingApprovalBorrowRecords: async (
		params: BorrowRecordsQueryParams = {}
	): Promise<BorrowRecordsResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/borrow-records/pending-approval?${queryParams.toString()}`
		);
		return response.data;
	},

	// 13. Approve borrow record
	approveBorrowRecord: async (
		id: string,
		data: ApproveBorrowRecordDto
	): Promise<BorrowRecordWithDetails> => {
		const response = await instance.patch(
			`/borrow-records/${id}/approve`,
			data
		);
		return response.data;
	},

	// 14. Reject borrow record
	rejectBorrowRecord: async (
		id: string,
		data: RejectBorrowRecordDto
	): Promise<BorrowRecordWithDetails> => {
		const response = await instance.patch(`/borrow-records/${id}/reject`, data);
		return response.data;
	},

	// 15. Delete borrow record by ID
	deleteBorrowRecordById: async (id: string): Promise<void> => {
		await instance.delete(`/borrow-records/${id}`);
	},
};
