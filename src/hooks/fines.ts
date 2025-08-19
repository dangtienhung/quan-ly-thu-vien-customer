import { finesApi } from '@/apis/fines';
import type {
	CreateFineDto,
	CreateOverdueFineDto,
	FinesQueryParams,
	PayFineDto,
	SearchFinesParams,
	UpdateFineDto,
	WaiveFineDto,
} from '@/types/fines';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const fineKeys = {
	all: ['fines'] as const,
	lists: () => [...fineKeys.all, 'list'] as const,
	list: (params: FinesQueryParams) => [...fineKeys.lists(), params] as const,
	search: (params: SearchFinesParams) =>
		[...fineKeys.all, 'search', params] as const,
	byStatus: (status: string, params: FinesQueryParams) =>
		[...fineKeys.all, 'status', status, params] as const,
	byType: (type: string, params: FinesQueryParams) =>
		[...fineKeys.all, 'type', type, params] as const,
	byBorrow: (borrowId: string, params: FinesQueryParams) =>
		[...fineKeys.all, 'borrow', borrowId, params] as const,
	overdue: (params: FinesQueryParams) =>
		[...fineKeys.all, 'overdue', params] as const,
	stats: () => [...fineKeys.all, 'stats'] as const,
	details: () => [...fineKeys.all, 'detail'] as const,
	detail: (id: string) => [...fineKeys.details(), id] as const,
};

// Hooks for getting fines
export const useFines = (params: FinesQueryParams = {}) => {
	return useQuery({
		queryKey: fineKeys.list(params),
		queryFn: () => finesApi.getFines(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useSearchFines = (params: SearchFinesParams) => {
	return useQuery({
		queryKey: fineKeys.search(params),
		queryFn: () => finesApi.searchFines(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const useFinesByStatus = (
	status: string,
	params: FinesQueryParams = {}
) => {
	return useQuery({
		queryKey: fineKeys.byStatus(status, params),
		queryFn: () => finesApi.getFinesByStatus(status, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useFinesByType = (type: string, params: FinesQueryParams = {}) => {
	return useQuery({
		queryKey: fineKeys.byType(type, params),
		queryFn: () => finesApi.getFinesByType(type, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useFinesByBorrow = (
	borrowId: string,
	params: FinesQueryParams = {}
) => {
	return useQuery({
		queryKey: fineKeys.byBorrow(borrowId, params),
		queryFn: () => finesApi.getFinesByBorrow(borrowId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!borrowId,
	});
};

export const useOverdueFines = (params: FinesQueryParams = {}) => {
	return useQuery({
		queryKey: fineKeys.overdue(params),
		queryFn: () => finesApi.getOverdueFines(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for overdue fines
	});
};

export const useFinesStats = () => {
	return useQuery({
		queryKey: fineKeys.stats(),
		queryFn: () => finesApi.getFinesStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useFineById = (id: string) => {
	return useQuery({
		queryKey: fineKeys.detail(id),
		queryFn: () => finesApi.getFineById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

// Hooks for creating fines
export const useCreateFine = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateFineDto) => finesApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch fines lists
			queryClient.invalidateQueries({ queryKey: fineKeys.lists() });
			queryClient.invalidateQueries({ queryKey: fineKeys.stats() });
		},
	});
};

export const useCreateOverdueFine = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			borrowId,
			data,
		}: {
			borrowId: string;
			data: CreateOverdueFineDto;
		}) => finesApi.createOverdueFine(borrowId, data),
		onSuccess: () => {
			// Invalidate and refetch fines lists
			queryClient.invalidateQueries({ queryKey: fineKeys.lists() });
			queryClient.invalidateQueries({ queryKey: fineKeys.stats() });
		},
	});
};

// Hooks for updating fines
export const useUpdateFineById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateFineDto }) =>
			finesApi.updateFineById(id, data),
		onSuccess: (updatedFine) => {
			// Update the specific fine in cache
			queryClient.setQueryData(fineKeys.detail(updatedFine.id), updatedFine);
			// Invalidate and refetch fines lists
			queryClient.invalidateQueries({ queryKey: fineKeys.lists() });
		},
	});
};

// Hooks for paying fines
export const usePayFine = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PayFineDto }) =>
			finesApi.payFine(id, data),
		onSuccess: (updatedFine) => {
			// Update the specific fine in cache
			queryClient.setQueryData(fineKeys.detail(updatedFine.id), updatedFine);
			// Invalidate and refetch fines lists
			queryClient.invalidateQueries({ queryKey: fineKeys.lists() });
			queryClient.invalidateQueries({ queryKey: fineKeys.stats() });
		},
	});
};

// Hooks for waiving fines
export const useWaiveFine = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: WaiveFineDto }) =>
			finesApi.waiveFine(id, data),
		onSuccess: (updatedFine) => {
			// Update the specific fine in cache
			queryClient.setQueryData(fineKeys.detail(updatedFine.id), updatedFine);
			// Invalidate and refetch fines lists
			queryClient.invalidateQueries({ queryKey: fineKeys.lists() });
			queryClient.invalidateQueries({ queryKey: fineKeys.stats() });
		},
	});
};

// Hooks for deleting fines
export const useDeleteFineById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => finesApi.deleteFineById(id),
		onSuccess: (_, id) => {
			// Remove the fine from cache
			queryClient.removeQueries({ queryKey: fineKeys.detail(id) });
			// Invalidate and refetch fines lists
			queryClient.invalidateQueries({ queryKey: fineKeys.lists() });
			queryClient.invalidateQueries({ queryKey: fineKeys.stats() });
		},
	});
};
