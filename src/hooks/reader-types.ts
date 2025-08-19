import { readerTypesApi } from '@/apis/reader-types';
import type {
	CreateReaderTypeDto,
	ReaderTypesQueryParams,
	UpdateReaderTypeDto,
} from '@/types/reader-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const readerTypeKeys = {
	all: ['reader-types'] as const,
	lists: () => [...readerTypeKeys.all, 'list'] as const,
	list: (params: ReaderTypesQueryParams) =>
		[...readerTypeKeys.lists(), params] as const,
	stats: () => [...readerTypeKeys.all, 'stats'] as const,
	defaultSettings: () => [...readerTypeKeys.all, 'default-settings'] as const,
	details: () => [...readerTypeKeys.all, 'detail'] as const,
	detail: (id: string) => [...readerTypeKeys.details(), id] as const,
};

// Hooks for getting reader types
export const useReaderTypes = (params: ReaderTypesQueryParams = {}) => {
	return useQuery({
		queryKey: readerTypeKeys.list(params),
		queryFn: () => readerTypesApi.getReaderTypes(params),
		staleTime: 10 * 60 * 1000, // 10 minutes - reader types don't change often
	});
};

export const useReaderTypeById = (id: string) => {
	return useQuery({
		queryKey: readerTypeKeys.detail(id),
		queryFn: () => readerTypesApi.getReaderTypeById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

export const useReaderTypesStatistics = () => {
	return useQuery({
		queryKey: readerTypeKeys.stats(),
		queryFn: () => readerTypesApi.getReaderTypesStatistics(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useDefaultSettings = () => {
	return useQuery({
		queryKey: readerTypeKeys.defaultSettings(),
		queryFn: () => readerTypesApi.getDefaultSettings(),
		staleTime: 30 * 60 * 1000, // 30 minutes - default settings rarely change
	});
};

// Hooks for creating reader types
export const useCreateReaderType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReaderTypeDto) => readerTypesApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch reader types lists
			queryClient.invalidateQueries({ queryKey: readerTypeKeys.lists() });
			queryClient.invalidateQueries({ queryKey: readerTypeKeys.stats() });
		},
	});
};

// Hooks for updating reader types
export const useUpdateReaderTypeById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReaderTypeDto }) =>
			readerTypesApi.updateReaderTypeById(id, data),
		onSuccess: (updatedReaderType) => {
			// Update the specific reader type in cache
			queryClient.setQueryData(
				readerTypeKeys.detail(updatedReaderType.id),
				updatedReaderType
			);
			// Invalidate and refetch reader types lists
			queryClient.invalidateQueries({ queryKey: readerTypeKeys.lists() });
			queryClient.invalidateQueries({ queryKey: readerTypeKeys.stats() });
		},
	});
};

// Hooks for deleting reader types
export const useDeleteReaderTypeById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => readerTypesApi.deleteReaderTypeById(id),
		onSuccess: (_, id) => {
			// Remove the reader type from cache
			queryClient.removeQueries({ queryKey: readerTypeKeys.detail(id) });
			// Invalidate and refetch reader types lists
			queryClient.invalidateQueries({ queryKey: readerTypeKeys.lists() });
			queryClient.invalidateQueries({ queryKey: readerTypeKeys.stats() });
		},
	});
};
