import type {
	CreatePhysicalCopyDto,
	PhysicalCopiesQueryParams,
	SearchPhysicalCopiesParams,
	UpdatePhysicalCopyDto,
} from '@/types/physical-copies';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { physicalCopiesApi } from '@/apis/physical-copies';

// Query keys
export const physicalCopyKeys = {
	all: ['physical-copies'] as const,
	lists: () => [...physicalCopyKeys.all, 'list'] as const,
	list: (params: PhysicalCopiesQueryParams) =>
		[...physicalCopyKeys.lists(), params] as const,
	search: (params: SearchPhysicalCopiesParams) =>
		[...physicalCopyKeys.all, 'search', params] as const,
	byBook: (bookId: string, params: PhysicalCopiesQueryParams) =>
		[...physicalCopyKeys.all, 'book', bookId, params] as const,
	availableByBook: (bookId: string, params: PhysicalCopiesQueryParams) =>
		[...physicalCopyKeys.all, 'book', bookId, 'available', params] as const,
	byStatus: (status: string, params: PhysicalCopiesQueryParams) =>
		[...physicalCopyKeys.all, 'status', status, params] as const,
	byCondition: (condition: string, params: PhysicalCopiesQueryParams) =>
		[...physicalCopyKeys.all, 'condition', condition, params] as const,
	byLocation: (location: string, params: PhysicalCopiesQueryParams) =>
		[...physicalCopyKeys.all, 'location', location, params] as const,
	stats: () => [...physicalCopyKeys.all, 'stats'] as const,
	details: () => [...physicalCopyKeys.all, 'detail'] as const,
	detail: (id: string) => [...physicalCopyKeys.details(), id] as const,
	byBarcode: (barcode: string) =>
		[...physicalCopyKeys.details(), 'barcode', barcode] as const,
};

// Hooks for getting physical copies
export const usePhysicalCopies = (params: PhysicalCopiesQueryParams = {}) => {
	return useQuery({
		queryKey: physicalCopyKeys.list(params),
		queryFn: () => physicalCopiesApi.getPhysicalCopies(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useSearchPhysicalCopies = (params: SearchPhysicalCopiesParams) => {
	return useQuery({
		queryKey: physicalCopyKeys.search(params),
		queryFn: () => physicalCopiesApi.searchPhysicalCopies(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const usePhysicalCopiesByBook = (
	bookId: string,
	params: PhysicalCopiesQueryParams = {}
) => {
	return useQuery({
		queryKey: physicalCopyKeys.byBook(bookId, params),
		queryFn: () => physicalCopiesApi.getPhysicalCopiesByBook(bookId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!bookId,
	});
};

export const useAvailablePhysicalCopiesByBook = (
	bookId: string,
	params: PhysicalCopiesQueryParams = {}
) => {
	return useQuery({
		queryKey: physicalCopyKeys.availableByBook(bookId, params),
		queryFn: () =>
			physicalCopiesApi.getAvailablePhysicalCopiesByBook(bookId, params),
		enabled: !!bookId,
	});
};

export const usePhysicalCopiesByStatus = (
	status: string,
	params: PhysicalCopiesQueryParams = {}
) => {
	return useQuery({
		queryKey: physicalCopyKeys.byStatus(status, params),
		queryFn: () => physicalCopiesApi.getPhysicalCopiesByStatus(status, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const usePhysicalCopiesByCondition = (
	condition: string,
	params: PhysicalCopiesQueryParams = {}
) => {
	return useQuery({
		queryKey: physicalCopyKeys.byCondition(condition, params),
		queryFn: () =>
			physicalCopiesApi.getPhysicalCopiesByCondition(condition, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const usePhysicalCopiesByLocation = (
	location: string,
	params: PhysicalCopiesQueryParams = {}
) => {
	return useQuery({
		queryKey: physicalCopyKeys.byLocation(location, params),
		queryFn: () =>
			physicalCopiesApi.getPhysicalCopiesByLocation(location, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const usePhysicalCopiesStats = () => {
	return useQuery({
		queryKey: physicalCopyKeys.stats(),
		queryFn: () => physicalCopiesApi.getPhysicalCopiesStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const usePhysicalCopyById = (id: string) => {
	return useQuery({
		queryKey: physicalCopyKeys.detail(id),
		queryFn: () => physicalCopiesApi.getPhysicalCopyById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

export const usePhysicalCopyByBarcode = (barcode: string) => {
	return useQuery({
		queryKey: physicalCopyKeys.byBarcode(barcode),
		queryFn: () => physicalCopiesApi.getPhysicalCopyByBarcode(barcode),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!barcode,
	});
};

// Hooks for creating physical copies
export const useCreatePhysicalCopy = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreatePhysicalCopyDto) => physicalCopiesApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch physical copies lists
			queryClient.invalidateQueries({ queryKey: physicalCopyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: physicalCopyKeys.stats() });
		},
	});
};

// Hooks for updating physical copies
export const useUpdatePhysicalCopyById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePhysicalCopyDto }) =>
			physicalCopiesApi.updatePhysicalCopyById(id, data),
		onSuccess: (updatedCopy) => {
			// Update the specific copy in cache
			queryClient.setQueryData(
				physicalCopyKeys.detail(updatedCopy.id),
				updatedCopy
			);
			// Invalidate and refetch physical copies lists
			queryClient.invalidateQueries({ queryKey: physicalCopyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: physicalCopyKeys.stats() });
		},
	});
};

// Hooks for deleting physical copies
export const useDeletePhysicalCopyById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => physicalCopiesApi.deletePhysicalCopyById(id),
		onSuccess: (_, id) => {
			// Remove the copy from cache
			queryClient.removeQueries({ queryKey: physicalCopyKeys.detail(id) });
			// Invalidate and refetch physical copies lists
			queryClient.invalidateQueries({ queryKey: physicalCopyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: physicalCopyKeys.stats() });
		},
	});
};
