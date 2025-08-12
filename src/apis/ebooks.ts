import instance from '@/configs/instances';
import type {
	CreateEBookRequest,
	CreateManyEBooksRequest,
	DeleteManyEBooksRequest,
	EBook,
	EBooksQueryParams,
	EBookStats,
	UpdateEBookFileInfoRequest,
	UpdateEBookRequest,
} from '@/types/ebooks';

// API functions
export const ebooksApi = {
	// 1. Create ebook
	createEBook: async (data: CreateEBookRequest): Promise<EBook> => {
		const response = await instance.post('/ebooks', data);
		return response.data;
	},

	// 2. Create many ebooks
	createManyEBooks: async (
		bookId: string,
		data: CreateManyEBooksRequest
	): Promise<EBook[]> => {
		const response = await instance.post(`/ebooks/book/${bookId}/many`, data);
		return response.data;
	},

	// 3. Get all ebooks with pagination and filtering
	getEBooks: async (
		params: EBooksQueryParams = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.format) queryParams.append('format', params.format);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(`/ebooks?${queryParams.toString()}`);
		return response.data;
	},

	// 4. Search ebooks
	searchEBooks: async (
		query: string,
		params: Omit<EBooksQueryParams, 'q'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		queryParams.append('q', query);
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.format) queryParams.append('format', params.format);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(
			`/ebooks/search?${queryParams.toString()}`
		);
		return response.data;
	},

	// 5. Get ebooks by format
	getEBooksByFormat: async (
		format: string,
		params: Omit<EBooksQueryParams, 'format'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(
			`/ebooks/format/${format}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 6. Get ebooks by size range
	getEBooksBySizeRange: async (
		minSize: number,
		maxSize: number,
		params: Omit<EBooksQueryParams, 'minSize' | 'maxSize'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		queryParams.append('minSize', minSize.toString());
		queryParams.append('maxSize', maxSize.toString());
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.format) queryParams.append('format', params.format);
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(
			`/ebooks/size-range?${queryParams.toString()}`
		);
		return response.data;
	},

	// 7. Get popular ebooks
	getPopularEBooks: async (limit: number = 10): Promise<EBook[]> => {
		const response = await instance.get(`/ebooks/popular?limit=${limit}`);
		return response.data;
	},

	// 8. Get recent ebooks
	getRecentEBooks: async (limit: number = 10): Promise<EBook[]> => {
		const response = await instance.get(`/ebooks/recent?limit=${limit}`);
		return response.data;
	},

	// 9. Get ebooks by download count
	getEBooksByDownloads: async (
		minDownloads: number,
		params: Omit<EBooksQueryParams, 'minDownloads'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.format) queryParams.append('format', params.format);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(
			`/ebooks/downloads/${minDownloads}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 10. Get ebooks by author
	getEBooksByAuthor: async (
		authorId: string,
		params: Omit<EBooksQueryParams, 'authorId'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.format) queryParams.append('format', params.format);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(
			`/ebooks/author/${authorId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 11. Get ebooks by category
	getEBooksByCategory: async (
		categoryId: string,
		params: Omit<EBooksQueryParams, 'categoryId'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.format) queryParams.append('format', params.format);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.bookId) queryParams.append('bookId', params.bookId);

		const response = await instance.get(
			`/ebooks/category/${categoryId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 12. Get ebooks by book
	getEBooksByBook: async (
		bookId: string,
		params: Omit<EBooksQueryParams, 'bookId'> = {}
	): Promise<{
		data: EBook[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.q) queryParams.append('q', params.q);
		if (params.format) queryParams.append('format', params.format);
		if (params.minSize)
			queryParams.append('minSize', params.minSize.toString());
		if (params.maxSize)
			queryParams.append('maxSize', params.maxSize.toString());
		if (params.minDownloads)
			queryParams.append('minDownloads', params.minDownloads.toString());
		if (params.authorId) queryParams.append('authorId', params.authorId);
		if (params.categoryId) queryParams.append('categoryId', params.categoryId);

		const response = await instance.get(
			`/ebooks/book/${bookId}?${queryParams.toString()}`
		);
		return response.data;
	},

	// 13. Get ebook by ID
	getEBookById: async (id: string): Promise<EBook> => {
		const response = await instance.get(`/ebooks/${id}`);
		return response.data;
	},

	// 14. Get ebook stats
	getEBookStats: async (): Promise<EBookStats> => {
		const response = await instance.get('/ebooks/stats');
		return response.data;
	},

	// 15. Update ebook
	updateEBook: async (id: string, data: UpdateEBookRequest): Promise<EBook> => {
		const response = await instance.patch(`/ebooks/${id}`, data);
		return response.data;
	},

	// 16. Update ebook file info
	updateEBookFileInfo: async (
		id: string,
		data: UpdateEBookFileInfoRequest
	): Promise<EBook> => {
		const response = await instance.patch(`/ebooks/${id}/file-info`, data);
		return response.data;
	},

	// 17. Increment download count
	incrementDownloads: async (id: string): Promise<void> => {
		await instance.post(`/ebooks/${id}/increment-downloads`);
	},

	// 18. Delete ebook
	deleteEBook: async (id: string): Promise<void> => {
		await instance.delete(`/ebooks/${id}`);
	},

	// 19. Delete many ebooks
	deleteManyEBooks: async (data: DeleteManyEBooksRequest): Promise<void> => {
		await instance.delete('/ebooks/batch', { data });
	},
};
