export interface EBook {
	id: string;
	book_id: string;
	file_path: string;
	file_size: number;
	file_format: string;
	download_count: number;
	created_at: string;
	updated_at: string;
	book?: {
		id: string;
		title: string;
		slug: string;
		isbn?: string;
		cover_image?: string;
		authors?: Array<{
			id: string;
			author_name: string;
		}>;
	};
}

export interface CreateEBookRequest {
	book_id: string;
	file_path: string;
	file_size: number;
	file_format: string;
}

export interface CreateManyEBooksRequest {
	ebooks: Array<{
		file_path: string;
		file_size: number;
		file_format: string;
	}>;
}

export interface UpdateEBookRequest {
	book_id?: string;
	file_path?: string;
	file_size?: number;
	file_format?: string;
}

export interface UpdateEBookFileInfoRequest {
	file_path: string;
	file_size: number;
	file_format: string;
}

export interface EBooksResponse {
	data: EBook[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface EBookResponse {
	data: EBook;
}

export interface EBookStats {
	total: number;
	totalDownloads: number;
	totalSize: number;
	byFormat: Array<{
		format: string;
		count: number;
		totalSize: number;
	}>;
	popularEbooks: Array<{
		id: string;
		title: string;
		downloads: number;
	}>;
	recentUploads: Array<{
		id: string;
		title: string;
		uploadDate: string;
	}>;
}

export interface EBookStatsResponse {
	data: EBookStats;
}

export interface DeleteManyEBooksRequest {
	ids: string[];
}

// Query parameters for filtering
export interface EBooksQueryParams {
	page?: number;
	limit?: number;
	q?: string; // search query
	format?: string;
	minSize?: number;
	maxSize?: number;
	minDownloads?: number;
	authorId?: string;
	categoryId?: string;
	bookId?: string;
}

// File formats supported
export type EBookFormat = 'PDF' | 'EPUB' | 'MOBI' | 'AZW' | 'TXT' | 'DOCX';
