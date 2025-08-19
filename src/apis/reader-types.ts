import instance from '@/configs/instances';
import type {
	CreateReaderTypeDto,
	DefaultSettings,
	ReaderType,
	ReaderTypeStatistics,
	ReaderTypesQueryParams,
	ReaderTypesResponse,
	UpdateReaderTypeDto,
} from '@/types/reader-types';

// API functions
export const readerTypesApi = {
	// 1. Create new reader type
	create: async (data: CreateReaderTypeDto): Promise<ReaderType> => {
		const response = await instance.post('/reader-types', data);
		return response.data;
	},

	// 2. Get reader types list with pagination
	getReaderTypes: async (
		params: ReaderTypesQueryParams = {}
	): Promise<ReaderTypesResponse> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());

		const response = await instance.get(
			`/reader-types?${queryParams.toString()}`
		);
		return response.data;
	},

	// 3. Get reader type by ID
	getReaderTypeById: async (id: string): Promise<ReaderType> => {
		const response = await instance.get(`/reader-types/${id}`);
		return response.data;
	},

	// 4. Update reader type by ID
	updateReaderTypeById: async (
		id: string,
		data: UpdateReaderTypeDto
	): Promise<ReaderType> => {
		const response = await instance.patch(`/reader-types/${id}`, data);
		return response.data;
	},

	// 5. Delete reader type by ID
	deleteReaderTypeById: async (id: string): Promise<void> => {
		await instance.delete(`/reader-types/${id}`);
	},

	// 6. Get reader types statistics
	getReaderTypesStatistics: async (): Promise<ReaderTypeStatistics> => {
		const response = await instance.get('/reader-types/statistics');
		return response.data;
	},

	// 7. Get default settings
	getDefaultSettings: async (): Promise<DefaultSettings> => {
		const response = await instance.get('/reader-types/default-settings');
		return response.data;
	},
};
