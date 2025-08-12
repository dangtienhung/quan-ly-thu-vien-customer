import { ebooksApi } from '@/apis/ebooks';
import type {
	CreateEBookRequest,
	CreateManyEBooksRequest,
	DeleteManyEBooksRequest,
	EBooksQueryParams,
	UpdateEBookFileInfoRequest,
	UpdateEBookRequest,
} from '@/types/ebooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const ebookKeys = {
	all: ['ebooks'] as const,
	lists: () => [...ebookKeys.all, 'list'] as const,
	list: (params: EBooksQueryParams) => [...ebookKeys.lists(), params] as const,
	details: () => [...ebookKeys.all, 'detail'] as const,
	detail: (id: string) => [...ebookKeys.details(), id] as const,
	byBook: (bookId: string, params?: Omit<EBooksQueryParams, 'bookId'>) =>
		[...ebookKeys.all, 'byBook', bookId, params] as const,
	search: (query: string, params?: Omit<EBooksQueryParams, 'q'>) =>
		[...ebookKeys.all, 'search', query, params] as const,
	byFormat: (format: string, params?: Omit<EBooksQueryParams, 'format'>) =>
		[...ebookKeys.all, 'byFormat', format, params] as const,
	bySizeRange: (
		minSize: number,
		maxSize: number,
		params?: Omit<EBooksQueryParams, 'minSize' | 'maxSize'>
	) => [...ebookKeys.all, 'bySizeRange', minSize, maxSize, params] as const,
	popular: (limit?: number) => [...ebookKeys.all, 'popular', limit] as const,
	recent: (limit?: number) => [...ebookKeys.all, 'recent', limit] as const,
	byDownloads: (
		minDownloads: number,
		params?: Omit<EBooksQueryParams, 'minDownloads'>
	) => [...ebookKeys.all, 'byDownloads', minDownloads, params] as const,
	byAuthor: (authorId: string, params?: Omit<EBooksQueryParams, 'authorId'>) =>
		[...ebookKeys.all, 'byAuthor', authorId, params] as const,
	byCategory: (
		categoryId: string,
		params?: Omit<EBooksQueryParams, 'categoryId'>
	) => [...ebookKeys.all, 'byCategory', categoryId, params] as const,
	stats: () => [...ebookKeys.all, 'stats'] as const,
};

// Get ebooks list
export const useEBooks = (params: EBooksQueryParams = {}) => {
	return useQuery({
		queryKey: ebookKeys.list(params),
		queryFn: () => ebooksApi.getEBooks(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Search ebooks
export const useSearchEBooks = (
	query: string,
	params: Omit<EBooksQueryParams, 'q'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.search(query, params),
		queryFn: () => ebooksApi.searchEBooks(query, params),
		enabled: !!query,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
};

// Get ebooks by format
export const useEBooksByFormat = (
	format: string,
	params: Omit<EBooksQueryParams, 'format'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.byFormat(format, params),
		queryFn: () => ebooksApi.getEBooksByFormat(format, params),
		enabled: !!format,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get ebooks by size range
export const useEBooksBySizeRange = (
	minSize: number,
	maxSize: number,
	params: Omit<EBooksQueryParams, 'minSize' | 'maxSize'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.bySizeRange(minSize, maxSize, params),
		queryFn: () => ebooksApi.getEBooksBySizeRange(minSize, maxSize, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get popular ebooks
export const usePopularEBooks = (limit: number = 10) => {
	return useQuery({
		queryKey: ebookKeys.popular(limit),
		queryFn: () => ebooksApi.getPopularEBooks(limit),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get recent ebooks
export const useRecentEBooks = (limit: number = 10) => {
	return useQuery({
		queryKey: ebookKeys.recent(limit),
		queryFn: () => ebooksApi.getRecentEBooks(limit),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get ebooks by download count
export const useEBooksByDownloads = (
	minDownloads: number,
	params: Omit<EBooksQueryParams, 'minDownloads'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.byDownloads(minDownloads, params),
		queryFn: () => ebooksApi.getEBooksByDownloads(minDownloads, params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get ebooks by author
export const useEBooksByAuthor = (
	authorId: string,
	params: Omit<EBooksQueryParams, 'authorId'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.byAuthor(authorId, params),
		queryFn: () => ebooksApi.getEBooksByAuthor(authorId, params),
		enabled: !!authorId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get ebooks by category
export const useEBooksByCategory = (
	categoryId: string,
	params: Omit<EBooksQueryParams, 'categoryId'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.byCategory(categoryId, params),
		queryFn: () => ebooksApi.getEBooksByCategory(categoryId, params),
		enabled: !!categoryId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get ebooks by book
export const useEBooksByBook = (
	bookId: string,
	params: Omit<EBooksQueryParams, 'bookId'> = {}
) => {
	return useQuery({
		queryKey: ebookKeys.byBook(bookId, params),
		queryFn: () => ebooksApi.getEBooksByBook(bookId, params),
		enabled: !!bookId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get ebook by ID
export const useEBookById = (id: string) => {
	return useQuery({
		queryKey: ebookKeys.detail(id),
		queryFn: () => ebooksApi.getEBookById(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get ebook stats
export const useEBookStats = () => {
	return useQuery({
		queryKey: ebookKeys.stats(),
		queryFn: () => ebooksApi.getEBookStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Create ebook mutation
export const useCreateEBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateEBookRequest) => ebooksApi.createEBook(data),
		onSuccess: () => {
			// Invalidate and refetch ebooks list
			queryClient.invalidateQueries({ queryKey: ebookKeys.lists() });
		},
	});
};

// Create many ebooks mutation
export const useCreateManyEBooks = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			bookId,
			data,
		}: {
			bookId: string;
			data: CreateManyEBooksRequest;
		}) => ebooksApi.createManyEBooks(bookId, data),
		onSuccess: (_, { bookId }) => {
			// Invalidate ebooks list and specific book ebooks
			queryClient.invalidateQueries({ queryKey: ebookKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ebookKeys.byBook(bookId) });
		},
	});
};

// Update ebook mutation
export const useUpdateEBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateEBookRequest }) =>
			ebooksApi.updateEBook(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific ebook and ebooks list
			queryClient.invalidateQueries({ queryKey: ebookKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: ebookKeys.lists() });
		},
	});
};

// Update ebook file info mutation
export const useUpdateEBookFileInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateEBookFileInfoRequest;
		}) => ebooksApi.updateEBookFileInfo(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific ebook
			queryClient.invalidateQueries({ queryKey: ebookKeys.detail(id) });
		},
	});
};

// Increment downloads mutation
export const useIncrementDownloads = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => ebooksApi.incrementDownloads(id),
		onSuccess: (_, id) => {
			// Invalidate specific ebook and popular ebooks
			queryClient.invalidateQueries({ queryKey: ebookKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: ebookKeys.popular() });
			queryClient.invalidateQueries({ queryKey: ebookKeys.stats() });
		},
	});
};

// Delete ebook mutation
export const useDeleteEBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => ebooksApi.deleteEBook(id),
		onSuccess: () => {
			// Invalidate ebooks list and stats
			queryClient.invalidateQueries({ queryKey: ebookKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ebookKeys.stats() });
		},
	});
};

// Delete many ebooks mutation
export const useDeleteManyEBooks = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeleteManyEBooksRequest) =>
			ebooksApi.deleteManyEBooks(data),
		onSuccess: () => {
			// Invalidate ebooks list and stats
			queryClient.invalidateQueries({ queryKey: ebookKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ebookKeys.stats() });
		},
	});
};
