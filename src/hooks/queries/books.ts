import { booksApi } from '@/apis/books';
import type {
	BooksQueryParams,
	CreateBookDto,
	UpdateBookDto,
	UpdateBookViewDto,
} from '@/types/books';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const bookKeys = {
	all: ['books'] as const,
	lists: () => [...bookKeys.all, 'list'] as const,
	list: (params: BooksQueryParams) => [...bookKeys.lists(), params] as const,
	details: () => [...bookKeys.all, 'detail'] as const,
	detail: (id: string) => [...bookKeys.details(), id] as const,
	bySlug: (slug: string) => [...bookKeys.details(), 'slug', slug] as const,
	byIsbn: (isbn: string) => [...bookKeys.details(), 'isbn', isbn] as const,
	latest: (params?: { limit?: number }) =>
		[...bookKeys.all, 'latest', params] as const,
	search: (params: { q: string; page?: number; limit?: number }) =>
		[...bookKeys.all, 'search', params] as const,
};

// Get books list
export const useBooks = (params: BooksQueryParams = {}) => {
	return useQuery({
		queryKey: bookKeys.list(params),
		queryFn: () => booksApi.getBooks(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get latest books
export const useLatestBooks = (params: { limit?: number } = {}) => {
	return useQuery({
		queryKey: bookKeys.latest(params),
		queryFn: () => booksApi.getLatestBooks(params),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Search books
export const useSearchBooks = (params: {
	q: string;
	page?: number;
	limit?: number;
}) => {
	return useQuery({
		queryKey: bookKeys.search(params),
		queryFn: () => booksApi.searchBooks(params),
		enabled: !!params.q,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
};

// Get book by ID
export const useBookById = (id: string) => {
	return useQuery({
		queryKey: bookKeys.detail(id),
		queryFn: () => booksApi.getBookById(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get book by slug
export const useBookBySlug = (slug: string) => {
	return useQuery({
		queryKey: bookKeys.bySlug(slug),
		queryFn: () => booksApi.getBookBySlug(slug),
		enabled: !!slug,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get book by ISBN
export const useBookByIsbn = (isbn: string) => {
	return useQuery({
		queryKey: bookKeys.byIsbn(isbn),
		queryFn: () => booksApi.getBookByIsbn(isbn),
		enabled: !!isbn,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Create book mutation
export const useCreateBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateBookDto) => booksApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch books list
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Update book by ID mutation
export const useUpdateBookById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBookDto }) =>
			booksApi.updateBookById(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific book and books list
			queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Update book by slug mutation
export const useUpdateBookBySlug = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ slug, data }: { slug: string; data: UpdateBookDto }) =>
			booksApi.updateBookBySlug(slug, data),
		onSuccess: (_, { slug }) => {
			// Invalidate specific book and books list
			queryClient.invalidateQueries({ queryKey: bookKeys.bySlug(slug) });
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Delete book by ID mutation
export const useDeleteBookById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => booksApi.deleteBookById(id),
		onSuccess: () => {
			// Invalidate books list
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Delete book by slug mutation
export const useDeleteBookBySlug = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (slug: string) => booksApi.deleteBookBySlug(slug),
		onSuccess: () => {
			// Invalidate books list
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Create multiple books mutation
export const useCreateBulkBooks = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (books: CreateBookDto[]) => booksApi.createBulk(books),
		onSuccess: () => {
			// Invalidate books list
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Update book view count by ID mutation
export const useUpdateBookViewById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBookViewDto }) =>
			booksApi.updateBookViewById(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific book
			queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
		},
	});
};

// Update book view count by slug mutation
export const useUpdateBookViewBySlug = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ slug, data }: { slug: string; data: UpdateBookViewDto }) =>
			booksApi.updateBookViewBySlug(slug, data),
		onSuccess: (_, { slug }) => {
			// Invalidate specific book
			queryClient.invalidateQueries({ queryKey: bookKeys.bySlug(slug) });
		},
	});
};
