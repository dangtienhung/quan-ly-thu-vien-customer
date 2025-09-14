import type {
	CreateReadingHistoryDto,
	ReadingHistory,
	ReadingHistoryList,
	ReadingHistoryQueryParams,
	ReadingHistoryResponse,
	ReadingSessionsQueryParams,
	ReadingSessionsResponse,
	UpdateReadingHistoryDto,
	UpdateReadingProgressDto,
} from '@/types/reading-history';

import instance from '@/configs/instances';

// API functions
export const readingHistoryApi = {
	// 1. Create new reading history
	create: async (data: CreateReadingHistoryDto): Promise<ReadingHistory> => {
		const response = await instance.post('/reading-history', data);
		return response.data;
	},

	// 2. Get all reading history with pagination
	getAll: async (
		params: ReadingHistoryQueryParams = {}
	): Promise<ReadingHistoryResponse> => {
		const response = await instance.get('/reading-history', {
			params,
		});
		return response.data;
	},

	// 3. Get reading history by reader ID
	getByReader: async (
		readerId: string,
		params: ReadingHistoryQueryParams = {}
	): Promise<ReadingHistoryResponse> => {
		const response = await instance.get(`/reading-history/reader/${readerId}`, {
			params,
		});
		return response.data;
	},

	// 4. Get reading history by book ID
	getByBook: async (
		bookId: string,
		params: ReadingHistoryQueryParams = {}
	): Promise<ReadingHistoryResponse> => {
		const response = await instance.get(`/reading-history/book/${bookId}`, {
			params,
		});
		return response.data;
	},

	// 5. Get specific reading history (reader + book)
	getByReaderAndBook: async (
		readerId: string,
		bookId: string
	): Promise<ReadingHistory> => {
		const response = await instance.get(
			`/reading-history/reader/${readerId}/book/${bookId}`
		);
		return response.data;
	},

	// 6. Get currently reading books for a reader
	getCurrentlyReading: async (
		readerId: string
	): Promise<ReadingHistoryList> => {
		const response = await instance.get(
			`/reading-history/reader/${readerId}/currently-reading`
		);
		return response.data;
	},

	// 7. Get favorite books for a reader
	getFavoriteBooks: async (readerId: string): Promise<ReadingHistoryList> => {
		const response = await instance.get(
			`/reading-history/reader/${readerId}/favorites`
		);
		return response.data;
	},

	// 8. Get reading sessions for a reader
	getReadingSessions: async (
		readerId: string,
		params: ReadingSessionsQueryParams = {}
	): Promise<ReadingSessionsResponse> => {
		const response = await instance.get(
			`/reading-history/reader/${readerId}/sessions`,
			{
				params,
			}
		);
		return response.data;
	},

	// 9. Update reading progress
	updateProgress: async (
		readerId: string,
		bookId: string,
		data: UpdateReadingProgressDto
	): Promise<ReadingHistory> => {
		const response = await instance.patch(
			`/reading-history/reader/${readerId}/book/${bookId}/progress`,
			data
		);
		return response.data;
	},

	// 10. Mark book as completed
	markAsCompleted: async (
		readerId: string,
		bookId: string
	): Promise<ReadingHistory> => {
		const response = await instance.patch(
			`/reading-history/reader/${readerId}/book/${bookId}/complete`
		);
		return response.data;
	},

	// 11. Toggle favorite status
	toggleFavorite: async (
		readerId: string,
		bookId: string
	): Promise<ReadingHistory> => {
		const response = await instance.patch(
			`/reading-history/reader/${readerId}/book/${bookId}/favorite`
		);
		return response.data;
	},

	// 12. Get reading history by ID
	getById: async (id: string): Promise<ReadingHistory> => {
		const response = await instance.get(`/reading-history/${id}`);
		return response.data;
	},

	// 13. Update reading history by ID
	updateById: async (
		id: string,
		data: UpdateReadingHistoryDto
	): Promise<ReadingHistory> => {
		const response = await instance.patch(`/reading-history/${id}`, data);
		return response.data;
	},

	// 14. Delete reading history by ID
	deleteById: async (id: string): Promise<void> => {
		await instance.delete(`/reading-history/${id}`);
	},
};
