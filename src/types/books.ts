// Book Types based on books.md documentation
export interface Book {
	id: string;
	title: string;
	isbn: string;
	publish_year: number;
	edition?: string;
	description?: string;
	cover_image?: string;
	language: string;
	page_count: number;
	book_type: 'physical' | 'ebook';
	physical_type?: 'library_use' | 'borrowable';
	slug: string;
	view: number;
	main_category_id?: string;
	createdAt: string;
	updatedAt: string;
	category_id: string;
}

export interface BookWithAuthors extends Book {
	authors: Array<{
		id: string;
		author_name: string;
		slug: string;
	}>;
	mainCategory?: {
		id: string;
		name: string;
		slug: string;
	};
}

export interface CreateBookDto {
	title: string;
	isbn: string;
	publish_year: number;
	edition?: string;
	description?: string;
	cover_image?: string;
	language: string;
	page_count: number;
	book_type: 'physical' | 'ebook';
	physical_type?: 'library_use' | 'borrowable';
	publisher_id: string;
	category_id: string;
	main_category_id?: string;
	author_ids: string[];
	grade_level_ids?: string[];
}

export type UpdateBookDto = Partial<CreateBookDto>;

export interface UpdateBookViewDto {
	type: 'increment' | 'set';
	value?: number;
}

export interface BooksResponse {
	data: BookWithAuthors[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface BooksQueryParams {
	page?: number;
	limit?: number;
	type?: 'physical' | 'ebook';
	main_category_id?: string;
	category_id?: string;
}

export interface SearchBooksParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface LatestBooksParams {
	limit?: number;
}
