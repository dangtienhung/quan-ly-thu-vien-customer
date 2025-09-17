import type {
	CancelReservationDto,
	CreateMultipleReservationsDto,
	CreateReservationDto,
	ExpiringSoonParams,
	FulfillReservationDto,
	ReservationsQueryParams,
	SearchReservationsParams,
	UpdateReservationDto,
} from '@/types/reservations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { reservationsApi } from '@/apis/reservations';

// Query keys
export const reservationKeys = {
	all: ['reservations'] as const,
	lists: () => [...reservationKeys.all, 'list'] as const,
	list: (params: ReservationsQueryParams) =>
		[...reservationKeys.lists(), params] as const,
	search: (params: SearchReservationsParams) =>
		[...reservationKeys.all, 'search', params] as const,
	byStatus: (status: string, params: ReservationsQueryParams) =>
		[...reservationKeys.all, 'status', status, params] as const,
	byReader: (readerId: string, params: ReservationsQueryParams) =>
		[...reservationKeys.all, 'reader', readerId, params] as const,
	byBook: (bookId: string, params: ReservationsQueryParams) =>
		[...reservationKeys.all, 'book', bookId, params] as const,
	expiringSoon: (params: ExpiringSoonParams) =>
		[...reservationKeys.all, 'expiring-soon', params] as const,
	expired: (params: ReservationsQueryParams) =>
		[...reservationKeys.all, 'expired', params] as const,
	stats: () => [...reservationKeys.all, 'stats'] as const,
	details: () => [...reservationKeys.all, 'detail'] as const,
	detail: (id: string) => [...reservationKeys.details(), id] as const,
};

// Hooks for getting reservations
export const useReservations = (params: ReservationsQueryParams = {}) => {
	return useQuery({
		queryKey: reservationKeys.list(params),
		queryFn: () => reservationsApi.getReservations(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useSearchReservations = (params: SearchReservationsParams) => {
	return useQuery({
		queryKey: reservationKeys.search(params),
		queryFn: () => reservationsApi.searchReservations(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const useReservationsByStatus = (
	status: string,
	params: ReservationsQueryParams = {}
) => {
	return useQuery({
		queryKey: reservationKeys.byStatus(status, params),
		queryFn: () => reservationsApi.getReservationsByStatus(status, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useReservationsByReader = (
	readerId: string,
	params: ReservationsQueryParams = {}
) => {
	return useQuery({
		queryKey: reservationKeys.byReader(readerId, params),
		queryFn: () => reservationsApi.getReservationsByReader(readerId, params),
		enabled: !!readerId,
	});
};

export const useReservationsByBook = (
	bookId: string,
	params: ReservationsQueryParams = {}
) => {
	return useQuery({
		queryKey: reservationKeys.byBook(bookId, params),
		queryFn: () => reservationsApi.getReservationsByBook(bookId, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!bookId,
	});
};

export const useExpiringSoonReservations = (
	params: ExpiringSoonParams = {}
) => {
	return useQuery({
		queryKey: reservationKeys.expiringSoon(params),
		queryFn: () => reservationsApi.getExpiringSoon(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for expiring reservations
	});
};

export const useExpiredReservations = (
	params: ReservationsQueryParams = {}
) => {
	return useQuery({
		queryKey: reservationKeys.expired(params),
		queryFn: () => reservationsApi.getExpiredReservations(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for expired reservations
	});
};

export const useReservationsStats = () => {
	return useQuery({
		queryKey: reservationKeys.stats(),
		queryFn: () => reservationsApi.getReservationsStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useReservationById = (id: string) => {
	return useQuery({
		queryKey: reservationKeys.detail(id),
		queryFn: () => reservationsApi.getReservationById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

// Hooks for creating reservations
export const useCreateReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReservationDto) => reservationsApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: reservationKeys.stats() });
		},
	});
};

export const useCreateMultipleReservations = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMultipleReservationsDto) =>
			reservationsApi.createMultiple(data),
		onSuccess: () => {
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: reservationKeys.stats() });
		},
	});
};

// Hooks for updating reservations
export const useUpdateReservationById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReservationDto }) =>
			reservationsApi.updateReservationById(id, data),
		onSuccess: (updatedReservation) => {
			// Update the specific reservation in cache
			queryClient.setQueryData(
				reservationKeys.detail(updatedReservation.id),
				updatedReservation
			);
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
		},
	});
};

// Hooks for fulfilling reservations
export const useFulfillReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: FulfillReservationDto }) =>
			reservationsApi.fulfillReservation(id, data),
		onSuccess: (updatedReservation) => {
			// Update the specific reservation in cache
			queryClient.setQueryData(
				reservationKeys.detail(updatedReservation.id),
				updatedReservation
			);
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: reservationKeys.stats() });
		},
	});
};

// Hooks for canceling reservations
export const useCancelReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CancelReservationDto }) =>
			reservationsApi.cancelReservation(id, data),
		onSuccess: (updatedReservation) => {
			// Update the specific reservation in cache
			queryClient.setQueryData(
				reservationKeys.detail(updatedReservation.id),
				updatedReservation
			);
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: reservationKeys.stats() });
		},
	});
};

// Hooks for auto canceling expired reservations
export const useAutoCancelExpired = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => reservationsApi.autoCancelExpired(),
		onSuccess: () => {
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: reservationKeys.stats() });
		},
	});
};

// Hooks for deleting reservations
export const useDeleteReservationById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => reservationsApi.deleteReservationById(id),
		onSuccess: (_, id) => {
			// Remove the reservation from cache
			queryClient.removeQueries({ queryKey: reservationKeys.detail(id) });
			// Invalidate and refetch reservations lists
			queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: reservationKeys.stats() });
		},
	});
};
