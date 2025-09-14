import { PaginatedResponse } from './common';

// Enums
export type ReadingStatus = 'reading' | 'completed' | 'paused' | 'abandoned';
export type SessionStatus = 'active' | 'completed' | 'abandoned';

// Reading History Entity
export interface ReadingHistory {
	id: string;
	reader_id: string;
	book_id: string;
	status: ReadingStatus;
	current_page: number;
	total_reading_time_seconds: number;
	last_read_at: Date | null;
	is_favorite: boolean;
	created_at: Date;
	updated_at: Date;

	// Relations
	reader?: {
		id: string;
		user_id: string;
		user?: {
			id: string;
			email: string;
			full_name: string;
		};
	};
	book?: {
		id: string;
		title: string;
		slug: string;
		isbn: string;
		page_count: number;
		cover_image: string;
		authors?: Array<{
			id: string;
			name: string;
		}>;
		mainCategory?: {
			id: string;
			name: string;
		};
	};
}

// Reading Session Entity
export interface ReadingSession {
	id: string;
	reader_id: string;
	book_id: string;
	started_at: Date;
	ended_at: Date | null;
	duration_seconds: number;
	start_page: number;
	end_page: number;
	status: SessionStatus;
	device: string | null;
	created_at: Date;
	updated_at: Date;

	// Relations
	reader?: {
		id: string;
		user_id: string;
		user?: {
			id: string;
			email: string;
			full_name: string;
		};
	};
	book?: {
		id: string;
		title: string;
		slug: string;
		isbn: string;
		page_count: number;
	};
}

// DTOs
export interface CreateReadingHistoryDto {
	reader_id: string;
	book_id: string;
	status?: ReadingStatus;
	current_page?: number;
	total_reading_time_seconds?: number;
	is_favorite?: boolean;
}

export interface UpdateReadingHistoryDto {
	status?: ReadingStatus;
	current_page?: number;
	total_reading_time_seconds?: number;
	is_favorite?: boolean;
}

export interface UpdateReadingProgressDto {
	current_page: number;
	session_duration?: number;
	session_notes?: string;
	device?: string;
}

// Query Parameters
export interface ReadingHistoryQueryParams {
	page?: number;
	limit?: number;
}

export interface ReadingSessionsQueryParams {
	page?: number;
	limit?: number;
}

// Response Types
export type ReadingHistoryResponse = PaginatedResponse<ReadingHistory>;
export type ReadingSessionsResponse = PaginatedResponse<ReadingSession>;
export type ReadingHistoryList = ReadingHistory[];
export type ReadingSessionsList = ReadingSession[];
