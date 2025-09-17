import type {
	CreateReaderDto,
	ReaderExpiringSoonParams,
	ReadersQueryParams,
	RenewCardDto,
	SearchReadersParams,
	UpdateReaderDto,
} from '@/types/readers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { readersApi } from '@/apis/readers';

// Query keys
export const readerKeys = {
	all: ['readers'] as const,
	lists: () => [...readerKeys.all, 'list'] as const,
	list: (params: ReadersQueryParams) =>
		[...readerKeys.lists(), params] as const,
	search: (params: SearchReadersParams) =>
		[...readerKeys.all, 'search', params] as const,
	expiredCards: (params: ReadersQueryParams) =>
		[...readerKeys.all, 'expired-cards', params] as const,
	expiringSoon: (params: ReaderExpiringSoonParams) =>
		[...readerKeys.all, 'expiring-soon', params] as const,
	byType: (readerTypeId: string, params: ReadersQueryParams) =>
		[...readerKeys.all, 'type', readerTypeId, params] as const,
	cardNumber: () => [...readerKeys.all, 'card-number'] as const,
	details: () => [...readerKeys.all, 'detail'] as const,
	detail: (id: string) => [...readerKeys.details(), id] as const,
	byUserId: (userId: string) =>
		[...readerKeys.details(), 'user', userId] as const,
	byCardNumber: (cardNumber: string) =>
		[...readerKeys.details(), 'card', cardNumber] as const,
	cardExpiry: (id: string) => [...readerKeys.details(), id, 'expiry'] as const,
};

// Hooks for getting readers
export const useReaders = (params: ReadersQueryParams = {}) => {
	return useQuery({
		queryKey: readerKeys.list(params),
		queryFn: () => readersApi.getReaders(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useSearchReaders = (params: SearchReadersParams) => {
	return useQuery({
		queryKey: readerKeys.search(params),
		queryFn: () => readersApi.searchReaders(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const useExpiredCards = (params: ReadersQueryParams = {}) => {
	return useQuery({
		queryKey: readerKeys.expiredCards(params),
		queryFn: () => readersApi.getExpiredCards(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for expired cards
	});
};

export const useExpiringSoon = (params: ReaderExpiringSoonParams = {}) => {
	return useQuery({
		queryKey: readerKeys.expiringSoon(params),
		queryFn: () => readersApi.getExpiringSoon(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for expiring cards
	});
};

export const useReadersByType = (
	readerTypeId: string,
	params: ReadersQueryParams = {}
) => {
	return useQuery({
		queryKey: readerKeys.byType(readerTypeId, params),
		queryFn: () => readersApi.getReadersByType(readerTypeId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!readerTypeId,
	});
};

export const useGenerateCardNumber = () => {
	return useQuery({
		queryKey: readerKeys.cardNumber(),
		queryFn: () => readersApi.generateCardNumber(),
		staleTime: 0, // No cache for generated card numbers
		enabled: false, // Only fetch when explicitly called
	});
};

export const useReaderById = (id: string) => {
	return useQuery({
		queryKey: readerKeys.detail(id),
		queryFn: () => readersApi.getReaderById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

export const useReaderByUserId = (userId: string) => {
	return useQuery({
		queryKey: readerKeys.byUserId(userId),
		queryFn: () => readersApi.getReaderByUserId(userId),
		enabled: !!userId,
	});
};

export const useReaderByCardNumber = (cardNumber: string) => {
	return useQuery({
		queryKey: readerKeys.byCardNumber(cardNumber),
		queryFn: () => readersApi.getReaderByCardNumber(cardNumber),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!cardNumber,
	});
};

export const useCheckCardExpiry = (id: string) => {
	return useQuery({
		queryKey: readerKeys.cardExpiry(id),
		queryFn: () => readersApi.checkCardExpiry(id),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!id,
	});
};

// Hooks for creating readers
export const useCreateReader = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReaderDto) => readersApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch readers lists
			queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
		},
	});
};

// Hooks for updating readers
export const useUpdateReaderById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReaderDto }) =>
			readersApi.updateReaderById(id, data),
		onSuccess: (updatedReader) => {
			// Update the specific reader in cache
			queryClient.setQueryData(
				readerKeys.detail(updatedReader.id),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byUserId(updatedReader.userId),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byCardNumber(updatedReader.cardNumber),
				updatedReader
			);
			// Invalidate and refetch readers lists
			queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
		},
	});
};

// Hooks for activating/deactivating reader cards
export const useActivateReaderCard = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => readersApi.activateReaderCard(id),
		onSuccess: (updatedReader) => {
			// Update the specific reader in cache
			queryClient.setQueryData(
				readerKeys.detail(updatedReader.id),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byUserId(updatedReader.userId),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byCardNumber(updatedReader.cardNumber),
				updatedReader
			);
			// Invalidate and refetch readers lists
			queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
		},
	});
};

export const useDeactivateReaderCard = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => readersApi.deactivateReaderCard(id),
		onSuccess: (updatedReader) => {
			// Update the specific reader in cache
			queryClient.setQueryData(
				readerKeys.detail(updatedReader.id),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byUserId(updatedReader.userId),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byCardNumber(updatedReader.cardNumber),
				updatedReader
			);
			// Invalidate and refetch readers lists
			queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
		},
	});
};

// Hooks for renewing reader cards
export const useRenewReaderCard = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RenewCardDto }) =>
			readersApi.renewReaderCard(id, data),
		onSuccess: (updatedReader) => {
			// Update the specific reader in cache
			queryClient.setQueryData(
				readerKeys.detail(updatedReader.id),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byUserId(updatedReader.userId),
				updatedReader
			);
			queryClient.setQueryData(
				readerKeys.byCardNumber(updatedReader.cardNumber),
				updatedReader
			);
			// Invalidate and refetch readers lists
			queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
		},
	});
};

// Hooks for deleting readers
export const useDeleteReaderById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => readersApi.deleteReaderById(id),
		onSuccess: (_, id) => {
			// Remove the reader from cache
			queryClient.removeQueries({ queryKey: readerKeys.detail(id) });
			// Invalidate and refetch readers lists
			queryClient.invalidateQueries({ queryKey: readerKeys.lists() });
		},
	});
};
