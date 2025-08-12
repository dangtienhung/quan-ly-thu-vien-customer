import instance from '@/configs/instances';
import type {
	BooksQueryParams,
	BooksResponse,
	BookWithAuthors,
	CreateBookDto,
	LatestBooksParams,
	SearchBooksParams,
	UpdateBookDto,
	UpdateBookViewDto,
} from '@/types/books';

// API functions
export const booksApi = {
	// 1. Create new book
	create: async (data: CreateBookDto): Promise<BookWithAuthors> => {
		const response = await instance.post('/books', data);
		return response.data;
	},

	// 2. Get books list with pagination and filters
	getBooks: async (params: BooksQueryParams = {}): Promise<BooksResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.type) queryParams.append('type', params.type);
		if (params.main_category_id)
			queryParams.append('main_category_id', params.main_category_id);
		if (params.category_id)
			queryParams.append('category_id', params.category_id);

		const response = await instance.get(`/books?${queryParams.toString()}`);
		return response.data;
	},

	// 3. Get latest books
	getLatestBooks: async (
		params: LatestBooksParams = {}
	): Promise<BookWithAuthors[]> => {
		const queryParams = new URLSearchParams();
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/books/latest?${queryParams.toString()}`
		);
		return response.data;
	},

	// 4. Search books
	searchBooks: async (params: SearchBooksParams): Promise<BooksResponse> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', params.q);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/books/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get book by ISBN
	getBookByIsbn: async (isbn: string): Promise<BookWithAuthors> => {
		const response = await instance.get(`/books/isbn/${isbn}`);
		return response.data;
	},

	// 6. Get book by ID
	getBookById: async (id: string): Promise<BookWithAuthors> => {
		const response = await instance.get(`/books/${id}`);
		return response.data;
	},

	// 7. Get book by slug
	getBookBySlug: async (slug: string): Promise<BookWithAuthors> => {
		const response = await instance.get(`/books/slug/${slug}`);
		return response.data;
	},

	// 8. Update book by ID
	updateBookById: async (
		id: string,
		data: UpdateBookDto
	): Promise<BookWithAuthors> => {
		const response = await instance.patch(`/books/${id}`, data);
		return response.data;
	},

	// 9. Update book by slug
	updateBookBySlug: async (
		slug: string,
		data: UpdateBookDto
	): Promise<BookWithAuthors> => {
		const response = await instance.patch(`/books/slug/${slug}`, data);
		return response.data;
	},

	// 10. Delete book by ID
	deleteBookById: async (id: string): Promise<void> => {
		await instance.delete(`/books/${id}`);
	},

	// 11. Delete book by slug
	deleteBookBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/books/slug/${slug}`);
	},

	// 12. Create multiple books
	createBulk: async (books: CreateBookDto[]): Promise<BookWithAuthors[]> => {
		const response = await instance.post('/books/bulk', books);
		return response.data;
	},

	// 13. Update book view count by ID
	updateBookViewById: async (
		id: string,
		data: UpdateBookViewDto
	): Promise<BookWithAuthors> => {
		const response = await instance.patch(`/books/${id}/view`, data);
		return response.data;
	},

	// 14. Update book view count by slug
	updateBookViewBySlug: async (
		slug: string,
		data: UpdateBookViewDto
	): Promise<BookWithAuthors> => {
		const response = await instance.patch(`/books/slug/${slug}/view`, data);
		return response.data;
	},
};
