import type { PaginationQuery } from '@/types/common';

export type BookCategory = {
	id: string;
	name: string;
	parent_id?: string | null;
	parent?: { id: string; name: string } | null;
	children?: Array<{ id: string; name: string }>;
	created_at: string;
	updated_at: string;
};

export type CreateBookCategoryRequest = {
	name: string;
	parent_id?: string | null;
};

export type UpdateBookCategoryRequest = {
	name?: string;
	parent_id?: string | null;
};

export type SearchBookCategoryQuery = PaginationQuery & {
	q?: string;
};
