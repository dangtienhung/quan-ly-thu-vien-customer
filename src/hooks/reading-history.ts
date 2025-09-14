import type {
	CreateReadingHistoryDto,
	ReadingHistoryQueryParams,
	ReadingSessionsQueryParams,
	UpdateReadingHistoryDto,
	UpdateReadingProgressDto,
} from '@/types/reading-history';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { readingHistoryApi } from '@/apis/reading-history';
import { toast } from 'sonner';

// Query Keys
export const readingHistoryKeys = {
	all: ['reading-history'] as const,
	lists: () => [...readingHistoryKeys.all, 'list'] as const,
	list: (params: ReadingHistoryQueryParams) =>
		[...readingHistoryKeys.lists(), params] as const,
	details: () => [...readingHistoryKeys.all, 'detail'] as const,
	detail: (id: string) => [...readingHistoryKeys.details(), id] as const,
	byReader: (readerId: string, params?: ReadingHistoryQueryParams) =>
		[...readingHistoryKeys.all, 'reader', readerId, params] as const,
	byBook: (bookId: string, params?: ReadingHistoryQueryParams) =>
		[...readingHistoryKeys.all, 'book', bookId, params] as const,
	byReaderAndBook: (readerId: string, bookId: string) =>
		[...readingHistoryKeys.all, 'reader', readerId, 'book', bookId] as const,
	currentlyReading: (readerId: string) =>
		[
			...readingHistoryKeys.all,
			'reader',
			readerId,
			'currently-reading',
		] as const,
	favorites: (readerId: string) =>
		[...readingHistoryKeys.all, 'reader', readerId, 'favorites'] as const,
	sessions: (readerId: string, params?: ReadingSessionsQueryParams) =>
		[
			...readingHistoryKeys.all,
			'reader',
			readerId,
			'sessions',
			params,
		] as const,
};

// Hooks for Reading History
export const useReadingHistory = (params: ReadingHistoryQueryParams = {}) => {
	return useQuery({
		queryKey: readingHistoryKeys.list(params),
		queryFn: () => readingHistoryApi.getAll(params),
	});
};

export const useReadingHistoryById = (id: string) => {
	return useQuery({
		queryKey: readingHistoryKeys.detail(id),
		queryFn: () => readingHistoryApi.getById(id),
		enabled: !!id,
	});
};

export const useReadingHistoryByReader = (
	readerId: string,
	params: ReadingHistoryQueryParams = {}
) => {
	return useQuery({
		queryKey: readingHistoryKeys.byReader(readerId, params),
		queryFn: () => readingHistoryApi.getByReader(readerId, params),
		enabled: !!readerId,
	});
};

export const useReadingHistoryByBook = (
	bookId: string,
	params: ReadingHistoryQueryParams = {}
) => {
	return useQuery({
		queryKey: readingHistoryKeys.byBook(bookId, params),
		queryFn: () => readingHistoryApi.getByBook(bookId, params),
		enabled: !!bookId,
	});
};

export const useReadingHistoryByReaderAndBook = (
	readerId: string,
	bookId: string
) => {
	return useQuery({
		queryKey: readingHistoryKeys.byReaderAndBook(readerId, bookId),
		queryFn: () => readingHistoryApi.getByReaderAndBook(readerId, bookId),
		enabled: !!readerId && !!bookId,
	});
};

export const useCurrentlyReading = (readerId: string) => {
	return useQuery({
		queryKey: readingHistoryKeys.currentlyReading(readerId),
		queryFn: () => readingHistoryApi.getCurrentlyReading(readerId),
		enabled: !!readerId,
	});
};

export const useFavoriteBooks = (readerId: string) => {
	return useQuery({
		queryKey: readingHistoryKeys.favorites(readerId),
		queryFn: () => readingHistoryApi.getFavoriteBooks(readerId),
		enabled: !!readerId,
	});
};

export const useReadingSessions = (
	readerId: string,
	params: ReadingSessionsQueryParams = {}
) => {
	return useQuery({
		queryKey: readingHistoryKeys.sessions(readerId, params),
		queryFn: () => readingHistoryApi.getReadingSessions(readerId, params),
		enabled: !!readerId,
	});
};

// Mutation Hooks
export const useCreateReadingHistory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReadingHistoryDto) =>
			readingHistoryApi.create(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: readingHistoryKeys.all });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Tạo lịch sử đọc thất bại');
		},
	});
};

export const useUpdateReadingHistory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReadingHistoryDto }) =>
			readingHistoryApi.updateById(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: readingHistoryKeys.all });
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.detail(variables.id),
			});
			toast.success('Cập nhật lịch sử đọc thành công');
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Cập nhật lịch sử đọc thất bại'
			);
		},
	});
};

export const useUpdateReadingProgress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			readerId,
			bookId,
			data,
		}: {
			readerId: string;
			bookId: string;
			data: UpdateReadingProgressDto;
		}) => readingHistoryApi.updateProgress(readerId, bookId, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: readingHistoryKeys.all });
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.byReaderAndBook(
					variables.readerId,
					variables.bookId
				),
			});
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.byReader(variables.readerId),
			});
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.sessions(variables.readerId),
			});
			toast.success('Cập nhật tiến độ đọc thành công');
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Cập nhật tiến độ đọc thất bại'
			);
		},
	});
};

export const useMarkAsCompleted = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ readerId, bookId }: { readerId: string; bookId: string }) =>
			readingHistoryApi.markAsCompleted(readerId, bookId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: readingHistoryKeys.all });
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.byReaderAndBook(
					variables.readerId,
					variables.bookId
				),
			});
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.byReader(variables.readerId),
			});
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.currentlyReading(variables.readerId),
			});
			toast.success('Đánh dấu hoàn thành thành công');
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Đánh dấu hoàn thành thất bại'
			);
		},
	});
};

export const useToggleFavorite = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ readerId, bookId }: { readerId: string; bookId: string }) =>
			readingHistoryApi.toggleFavorite(readerId, bookId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: readingHistoryKeys.all });
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.byReaderAndBook(
					variables.readerId,
					variables.bookId
				),
			});
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.byReader(variables.readerId),
			});
			queryClient.invalidateQueries({
				queryKey: readingHistoryKeys.favorites(variables.readerId),
			});
			toast.success(
				data.is_favorite ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích'
			);
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Cập nhật yêu thích thất bại'
			);
		},
	});
};

export const useDeleteReadingHistory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => readingHistoryApi.deleteById(id),
		onSuccess: (data, id) => {
			queryClient.invalidateQueries({ queryKey: readingHistoryKeys.all });
			queryClient.removeQueries({ queryKey: readingHistoryKeys.detail(id) });
			toast.success('Xóa lịch sử đọc thành công');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Xóa lịch sử đọc thất bại');
		},
	});
};
