// Physical Copies Types based on SYSTEM-BE.md documentation
export interface PhysicalCopy {
	id: string;
	book_id: string;
	barcode: string;
	status: PhysicalCopyStatus;
	current_condition: PhysicalCopyCondition;
	condition_details?: string;
	purchase_date: string;
	purchase_price: number;
	location: string;
	notes?: string;
	last_checkup_date?: string;
	is_archived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PhysicalCopyWithDetails extends PhysicalCopy {
	book: {
		id: string;
		title: string;
		isbn: string;
		cover_image?: string;
	};
}

export type PhysicalCopyStatus =
	| 'available'
	| 'borrowed'
	| 'reserved'
	| 'damaged'
	| 'lost'
	| 'maintenance';

export type PhysicalCopyCondition = 'new' | 'good' | 'worn' | 'damaged';

export interface CreatePhysicalCopyDto {
	book_id: string;
	barcode: string;
	status?: PhysicalCopyStatus;
	current_condition?: PhysicalCopyCondition;
	condition_details?: string;
	purchase_date: string;
	purchase_price: number;
	location: string;
	notes?: string;
	last_checkup_date?: string;
	is_archived?: boolean;
}

export type UpdatePhysicalCopyDto = Partial<CreatePhysicalCopyDto>;

export interface PhysicalCopiesResponse {
	data: PhysicalCopyWithDetails[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface PhysicalCopiesQueryParams {
	page?: number;
	limit?: number;
	status?: PhysicalCopyStatus;
	condition?: PhysicalCopyCondition;
	location?: string;
}

export interface SearchPhysicalCopiesParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface PhysicalCopiesStats {
	total: number;
	available: number;
	borrowed: number;
	reserved: number;
	damaged: number;
	lost: number;
	maintenance: number;
	byCondition: Array<{
		condition: PhysicalCopyCondition;
		count: number;
	}>;
	byLocation: Array<{
		location: string;
		count: number;
	}>;
}
