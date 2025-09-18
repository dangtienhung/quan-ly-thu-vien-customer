import type {
	ApproveBorrowRecordDto,
	BorrowRecordsQueryParams,
	CreateBorrowRecordDto,
	RejectBorrowRecordDto,
	RenewBookDto,
	ReturnBookDto,
	SearchBorrowRecordsParams,
	UpdateBorrowRecordDto,
} from '@/types/borrow-records';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { borrowRecordsApi } from '@/apis/borrow-records';

// Query keys
export const borrowRecordKeys = {
	all: ['borrow-records'] as const,
	lists: () => [...borrowRecordKeys.all, 'list'] as const,
	list: (params: BorrowRecordsQueryParams) =>
		[...borrowRecordKeys.lists(), params] as const,
	search: (params: SearchBorrowRecordsParams) =>
		[...borrowRecordKeys.all, 'search', params] as const,
	byStatus: (status: string, params: BorrowRecordsQueryParams) =>
		[...borrowRecordKeys.all, 'status', status, params] as const,
	byReader: (readerId: string, params: BorrowRecordsQueryParams) =>
		[...borrowRecordKeys.all, 'reader', readerId, params] as const,
	overdue: (params: BorrowRecordsQueryParams) =>
		[...borrowRecordKeys.all, 'overdue', params] as const,
	pendingApproval: (params: BorrowRecordsQueryParams) =>
		[...borrowRecordKeys.all, 'pending-approval', params] as const,
	stats: () => [...borrowRecordKeys.all, 'stats'] as const,
	details: () => [...borrowRecordKeys.all, 'detail'] as const,
	detail: (id: string) => [...borrowRecordKeys.details(), id] as const,
};

// Hooks for getting borrow records
export const useBorrowRecords = (params: BorrowRecordsQueryParams = {}) => {
	return useQuery({
		queryKey: borrowRecordKeys.list(params),
		queryFn: () => borrowRecordsApi.getBorrowRecords(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useSearchBorrowRecords = (params: SearchBorrowRecordsParams) => {
	return useQuery({
		queryKey: borrowRecordKeys.search(params),
		queryFn: () => borrowRecordsApi.searchBorrowRecords(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const useBorrowRecordsByStatus = (
	status: string,
	params: BorrowRecordsQueryParams = {},
	enabled = true
) => {
	return useQuery({
		queryKey: borrowRecordKeys.byStatus(status, params),
		queryFn: () => borrowRecordsApi.getBorrowRecordsByStatus(status, params),
		enabled,
	});
};

export const useBorrowRecordsByReader = (
	readerId: string,
	params: BorrowRecordsQueryParams = {}
) => {
	return useQuery({
		queryKey: borrowRecordKeys.byReader(readerId, params),
		queryFn: () => borrowRecordsApi.getBorrowRecordsByReader(readerId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!readerId,
	});
};

export const useOverdueBorrowRecords = (
	params: BorrowRecordsQueryParams = {}
) => {
	return useQuery({
		queryKey: borrowRecordKeys.overdue(params),
		queryFn: () => borrowRecordsApi.getOverdueBorrowRecords(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for overdue records
	});
};

export const usePendingApprovalBorrowRecords = (
	params: BorrowRecordsQueryParams = {}
) => {
	return useQuery({
		queryKey: borrowRecordKeys.pendingApproval(params),
		queryFn: () => borrowRecordsApi.getPendingApprovalBorrowRecords(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for pending records
	});
};

export const useBorrowRecordsStats = () => {
	return useQuery({
		queryKey: borrowRecordKeys.stats(),
		queryFn: () => borrowRecordsApi.getBorrowRecordsStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useBorrowRecordById = (id: string) => {
	return useQuery({
		queryKey: borrowRecordKeys.detail(id),
		queryFn: () => borrowRecordsApi.getBorrowRecordById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

// Hooks for creating borrow records
export const useCreateBorrowRecord = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateBorrowRecordDto) => borrowRecordsApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.stats() });
		},
	});
};

// Hooks for updating borrow records
export const useUpdateBorrowRecordById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBorrowRecordDto }) =>
			borrowRecordsApi.updateBorrowRecordById(id, data),
		onSuccess: (updatedRecord) => {
			// Update the specific record in cache
			queryClient.setQueryData(
				borrowRecordKeys.detail(updatedRecord.id),
				updatedRecord
			);
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
		},
	});
};

// Hooks for returning books
export const useReturnBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ReturnBookDto }) =>
			borrowRecordsApi.returnBook(id, data),
		onSuccess: (updatedRecord) => {
			// Update the specific record in cache
			queryClient.setQueryData(
				borrowRecordKeys.detail(updatedRecord.id),
				updatedRecord
			);
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.stats() });
		},
	});
};

// Hooks for renewing books
export const useRenewBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RenewBookDto }) =>
			borrowRecordsApi.renewBook(id, data),
		onSuccess: (updatedRecord) => {
			// Update the specific record in cache
			queryClient.setQueryData(
				borrowRecordKeys.detail(updatedRecord.id),
				updatedRecord
			);
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.stats() });
		},
	});
};

// Hooks for approving borrow records
export const useApproveBorrowRecord = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ApproveBorrowRecordDto }) =>
			borrowRecordsApi.approveBorrowRecord(id, data),
		onSuccess: (updatedRecord) => {
			// Update the specific record in cache
			queryClient.setQueryData(
				borrowRecordKeys.detail(updatedRecord.id),
				updatedRecord
			);
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: borrowRecordKeys.pendingApproval({}),
			});
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.stats() });
		},
	});
};

// Hooks for rejecting borrow records
export const useRejectBorrowRecord = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RejectBorrowRecordDto }) =>
			borrowRecordsApi.rejectBorrowRecord(id, data),
		onSuccess: (updatedRecord) => {
			// Update the specific record in cache
			queryClient.setQueryData(
				borrowRecordKeys.detail(updatedRecord.id),
				updatedRecord
			);
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: borrowRecordKeys.pendingApproval({}),
			});
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.stats() });
		},
	});
};

// Hooks for deleting borrow records
export const useDeleteBorrowRecordById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => borrowRecordsApi.deleteBorrowRecordById(id),
		onSuccess: (_, id) => {
			// Remove the record from cache
			queryClient.removeQueries({ queryKey: borrowRecordKeys.detail(id) });
			// Invalidate and refetch borrow records lists
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.lists() });
			queryClient.invalidateQueries({ queryKey: borrowRecordKeys.stats() });
		},
	});
};
