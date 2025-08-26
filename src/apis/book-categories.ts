import {
	BookCategory,
	CreateBookCategoryRequest,
	SearchBookCategoryQuery,
	UpdateBookCategoryRequest,
} from '@/types/book-categories';
import { PaginatedResponse, PaginationQuery } from '@/types/common';

import instance from '@/configs/instances';

export const BookCategoriesAPI = {
	getAll: async (
		params?: PaginationQuery
	): Promise<PaginatedResponse<BookCategory>> => {
		const res = await instance.get('/book-categories', { params });
		return res.data;
	},

	getAllNoPaginate: async (): Promise<BookCategory[]> => {
		const res = await instance.get('/book-categories/all');
		return res.data;
	},

	search: async (
		params: SearchBookCategoryQuery
	): Promise<PaginatedResponse<BookCategory>> => {
		const res = await instance.get('/book-categories/search', { params });
		return res.data;
	},

	getById: async (id: string): Promise<BookCategory> => {
		const res = await instance.get(`/book-categories/${id}`);
		return res.data;
	},

	create: async (data: CreateBookCategoryRequest): Promise<BookCategory> => {
		const res = await instance.post('/book-categories', data);
		return res.data;
	},

	update: async (
		id: string,
		data: UpdateBookCategoryRequest
	): Promise<BookCategory> => {
		const res = await instance.patch(`/book-categories/${id}`, data);
		return res.data;
	},

	delete: async (id: string): Promise<void> => {
		await instance.delete(`/book-categories/${id}`);
	},
};
