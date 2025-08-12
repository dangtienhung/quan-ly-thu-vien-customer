import { booksApi } from '@/apis/books';
import type {
	BooksQueryParams,
	CreateBookDto,
	LatestBooksParams,
	SearchBooksParams,
	UpdateBookDto,
	UpdateBookViewDto,
} from '@/types/books';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const bookKeys = {
	all: ['books'] as const,
	lists: () => [...bookKeys.all, 'list'] as const,
	list: (params: BooksQueryParams) => [...bookKeys.lists(), params] as const,
	latest: (params: LatestBooksParams) =>
		[...bookKeys.all, 'latest', params] as const,
	search: (params: SearchBooksParams) =>
		[...bookKeys.all, 'search', params] as const,
	details: () => [...bookKeys.all, 'detail'] as const,
	detail: (id: string) => [...bookKeys.details(), id] as const,
	detailBySlug: (slug: string) =>
		[...bookKeys.details(), 'slug', slug] as const,
	detailByIsbn: (isbn: string) =>
		[...bookKeys.details(), 'isbn', isbn] as const,
};

// Hooks for getting books
export const useBooks = (params: BooksQueryParams = {}) => {
	return useQuery({
		queryKey: bookKeys.list(params),
		queryFn: () => booksApi.getBooks(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useLatestBooks = (params: LatestBooksParams = {}) => {
	return useQuery({
		queryKey: bookKeys.latest(params),
		queryFn: () => booksApi.getLatestBooks(params),
		staleTime: 2 * 60 * 1000, // 2 minutes - shorter cache for latest books
	});
};

export const useSearchBooks = (params: SearchBooksParams) => {
	return useQuery({
		queryKey: bookKeys.search(params),
		queryFn: () => booksApi.searchBooks(params),
		staleTime: 2 * 60 * 1000, // 2 minutes
		enabled: !!params.q.trim(),
	});
};

export const useBookById = (id: string) => {
	return useQuery({
		queryKey: bookKeys.detail(id),
		queryFn: () => booksApi.getBookById(id),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!id,
	});
};

export const useBookBySlug = (slug: string) => {
	return useQuery({
		queryKey: bookKeys.detailBySlug(slug),
		queryFn: () => booksApi.getBookBySlug(slug),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!slug,
	});
};

export const useBookByIsbn = (isbn: string) => {
	return useQuery({
		queryKey: bookKeys.detailByIsbn(isbn),
		queryFn: () => booksApi.getBookByIsbn(isbn),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!isbn,
	});
};

// Hooks for creating books
export const useCreateBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateBookDto) => booksApi.create(data),
		onSuccess: () => {
			// Invalidate and refetch books lists and latest books
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
			queryClient.invalidateQueries({ queryKey: [...bookKeys.all, 'latest'] });
		},
	});
};

export const useCreateBulkBooks = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (books: CreateBookDto[]) => booksApi.createBulk(books),
		onSuccess: () => {
			// Invalidate and refetch books lists and latest books
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
			queryClient.invalidateQueries({ queryKey: [...bookKeys.all, 'latest'] });
		},
	});
};

// Hooks for updating books
export const useUpdateBookById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBookDto }) =>
			booksApi.updateBookById(id, data),
		onSuccess: (updatedBook) => {
			// Update the specific book in cache
			queryClient.setQueryData(bookKeys.detail(updatedBook.id), updatedBook);
			// Invalidate and refetch books lists
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

export const useUpdateBookBySlug = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ slug, data }: { slug: string; data: UpdateBookDto }) =>
			booksApi.updateBookBySlug(slug, data),
		onSuccess: (updatedBook) => {
			// Update the specific book in cache
			queryClient.setQueryData(bookKeys.detail(updatedBook.id), updatedBook);
			queryClient.setQueryData(
				bookKeys.detailBySlug(updatedBook.slug),
				updatedBook
			);
			// Invalidate and refetch books lists
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Hooks for deleting books
export const useDeleteBookById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => booksApi.deleteBookById(id),
		onSuccess: (_, id) => {
			// Remove the book from cache
			queryClient.removeQueries({ queryKey: bookKeys.detail(id) });
			// Invalidate and refetch books lists
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

export const useDeleteBookBySlug = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (slug: string) => booksApi.deleteBookBySlug(slug),
		onSuccess: (_, slug) => {
			// Remove the book from cache
			queryClient.removeQueries({ queryKey: bookKeys.detailBySlug(slug) });
			// Invalidate and refetch books lists
			queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
		},
	});
};

// Hooks for updating book views
export const useUpdateBookViewById = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBookViewDto }) =>
			booksApi.updateBookViewById(id, data),
		onSuccess: (updatedBook) => {
			// Update the specific book in cache
			queryClient.setQueryData(bookKeys.detail(updatedBook.id), updatedBook);
			queryClient.setQueryData(
				bookKeys.detailBySlug(updatedBook.slug),
				updatedBook
			);
			queryClient.setQueryData(
				bookKeys.detailByIsbn(updatedBook.isbn),
				updatedBook
			);
		},
	});
};

export const useUpdateBookViewBySlug = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ slug, data }: { slug: string; data: UpdateBookViewDto }) =>
			booksApi.updateBookViewBySlug(slug, data),
		onSuccess: (updatedBook) => {
			// Update the specific book in cache
			queryClient.setQueryData(bookKeys.detail(updatedBook.id), updatedBook);
			queryClient.setQueryData(
				bookKeys.detailBySlug(updatedBook.slug),
				updatedBook
			);
			queryClient.setQueryData(
				bookKeys.detailByIsbn(updatedBook.isbn),
				updatedBook
			);
		},
	});
};

// Utility hooks for common operations
export const useIncrementBookView = () => {
	const updateViewById = useUpdateBookViewById();
	const updateViewBySlug = useUpdateBookViewBySlug();

	return {
		incrementViewById: (id: string) =>
			updateViewById.mutate({ id, data: { type: 'increment' } }),
		incrementViewBySlug: (slug: string) =>
			updateViewBySlug.mutate({ slug, data: { type: 'increment' } }),
		isLoading: updateViewById.isPending || updateViewBySlug.isPending,
	};
};

// Hook for getting books by type
export const useBooksByType = (
	type: 'physical' | 'ebook',
	params: Omit<BooksQueryParams, 'type'> = {}
) => {
	return useBooks({ ...params, type });
};

// Hook for getting books by category
export const useBooksByCategory = (
	categoryId: string,
	params: Omit<BooksQueryParams, 'category_id'> = {}
) => {
	return useBooks({ ...params, category_id: categoryId });
};

// Hook for getting books by main category
export const useBooksByMainCategory = (
	mainCategoryId: string,
	params: Omit<BooksQueryParams, 'main_category_id'> = {}
) => {
	return useBooks({ ...params, main_category_id: mainCategoryId });
};
