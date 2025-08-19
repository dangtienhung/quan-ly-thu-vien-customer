import { renewalsApi } from '@/apis/renewals';
import type {
	ApproveRenewalDto,
	CreateRenewalDto,
	RejectRenewalDto,
	RenewalsQueryParams,
	SearchRenewalsParams,
	UpdateRenewalDto,
} from '@/types/renewals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const renewalKeys = {
	all: ['renewals'] as const,
	lists: () => [...renewalKeys.all, 'list'] as const,
	list: (params: RenewalsQueryParams) =>
		[...renewalKeys.lists(), params] as const,
	search: (params: SearchRenewalsParams) =>
		[...renewalKeys.all, 'search', params] as const,
	byStatus: (status: string, params: RenewalsQueryParams) =>
		[...renewalKeys.all, 'status', status, params] as const,
	byBorrow: (borrowId: string, params: RenewalsQueryParams) =>
		[...renewalKeys.all, 'borrow', borrowId, params] as const,
	byLibrarian: (librarianId: string, params: RenewalsQueryParams) =>
		[...renewalKeys.all, 'librarian', librarianId, params] as const,
	stats: () => [...renewalKeys.all, 'stats'] as const,
	details: () => [...renewalKeys.all, 'detail'] as const,
	detail: (id: string) => [...renewalKeys.details(), id] as const,
};

// Hooks for getting renewals
export const useRenewals = (params: RenewalsQueryParams = {}) => {
	return useQuery({
		queryKey: renewalKeys.list(params),
		queryFn: () => renewalsApi.getRenewals(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useSearchRenewals = (params: SearchRenewalsParams) => {
	return useQuery({
		queryKey: renewalKeys.search(params),
		queryFn: () => renewalsApi.searchRenewals(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const useRenewalsByStatus = (
	status: string,
	params: RenewalsQueryParams = {}
) => {
	return useQuery({
		queryKey: renewalKeys.byStatus(status, params),
		queryFn: () => renewalsApi.getRenewalsByStatus(status, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useRenewalsByBorrow = (
	borrowId: string,
	params: RenewalsQueryParams = {}
) => {
	return useQuery({
		queryKey: renewalKeys.byBorrow(borrowId, params),
		queryFn: () => renewalsApi.getRenewalsByBorrow(borrowId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!borrowId,
	});
};

export const useRenewalsByLibrarian = (
	librarianId: string,
	params: RenewalsQueryParams = {}
) => {
	return useQuery({
		queryKey: renewalKeys.byLibrarian(librarianId, params),
		queryFn: () => renewalsApi.getRenewalsByLibrarian(librarianId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!librarianId,
	});
};

export const useRenewalsStats = () => {
	return useQuery({
		queryKey: renewalKeys.stats(),
		queryFn: () => renewalsApi.getRenewalsStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useRenewalById = (id: string) => {
	return useQuery({
		queryKey: renewalKeys.detail(id),
		queryFn: () => renewalsApi.getRenewalById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

// Hooks for creating renewals
export const useCreateRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateRenewalDto) => renewalsApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch renewals lists
			queryClient.invalidateQueries({ queryKey: renewalKeys.lists() });
			queryClient.invalidateQueries({ queryKey: renewalKeys.stats() });
		},
	});
};

// Hooks for updating renewals
export const useUpdateRenewalById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateRenewalDto }) =>
			renewalsApi.updateRenewalById(id, data),
		onSuccess: (updatedRenewal) => {
			// Update the specific renewal in cache
			queryClient.setQueryData(
				renewalKeys.detail(updatedRenewal.id),
				updatedRenewal
			);
			// Invalidate and refetch renewals lists
			queryClient.invalidateQueries({ queryKey: renewalKeys.lists() });
		},
	});
};

// Hooks for approving renewals
export const useApproveRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ApproveRenewalDto }) =>
			renewalsApi.approveRenewal(id, data),
		onSuccess: (updatedRenewal) => {
			// Update the specific renewal in cache
			queryClient.setQueryData(
				renewalKeys.detail(updatedRenewal.id),
				updatedRenewal
			);
			// Invalidate and refetch renewals lists
			queryClient.invalidateQueries({ queryKey: renewalKeys.lists() });
			queryClient.invalidateQueries({ queryKey: renewalKeys.stats() });
		},
	});
};

// Hooks for rejecting renewals
export const useRejectRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RejectRenewalDto }) =>
			renewalsApi.rejectRenewal(id, data),
		onSuccess: (updatedRenewal) => {
			// Update the specific renewal in cache
			queryClient.setQueryData(
				renewalKeys.detail(updatedRenewal.id),
				updatedRenewal
			);
			// Invalidate and refetch renewals lists
			queryClient.invalidateQueries({ queryKey: renewalKeys.lists() });
			queryClient.invalidateQueries({ queryKey: renewalKeys.stats() });
		},
	});
};

// Hooks for deleting renewals
export const useDeleteRenewalById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => renewalsApi.deleteRenewalById(id),
		onSuccess: (_, id) => {
			// Remove the renewal from cache
			queryClient.removeQueries({ queryKey: renewalKeys.detail(id) });
			// Invalidate and refetch renewals lists
			queryClient.invalidateQueries({ queryKey: renewalKeys.lists() });
			queryClient.invalidateQueries({ queryKey: renewalKeys.stats() });
		},
	});
};
