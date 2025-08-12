import instance from '@/configs/instances';
import type {
	CreateUploadRequest,
	UpdateUploadRequest,
	Upload,
} from '@/types/uploads';

// API functions
export const uploadsApi = {
	// 1. Upload file
	uploadFile: async (data: CreateUploadRequest): Promise<Upload> => {
		const formData = new FormData();
		formData.append('file', data.file);
		if (data.fileName) {
			formData.append('fileName', data.fileName);
		}

		const response = await instance.post('/uploads/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	},

	// 2. Get all uploads
	getUploads: async (): Promise<Upload[]> => {
		const response = await instance.get('/uploads');
		return response.data;
	},

	// 3. Get upload by ID
	getUploadById: async (id: string): Promise<Upload> => {
		const response = await instance.get(`/uploads/${id}`);
		return response.data;
	},

	// 4. Get upload by slug
	getUploadBySlug: async (slug: string): Promise<Upload> => {
		const response = await instance.get(`/uploads/slug/${slug}`);
		return response.data;
	},

	// 5. Download file by ID
	downloadFileById: async (id: string): Promise<Blob> => {
		const response = await instance.get(`/uploads/${id}/download`, {
			responseType: 'blob',
		});
		return response.data;
	},

	// 6. Download file by slug
	downloadFileBySlug: async (slug: string): Promise<Blob> => {
		const response = await instance.get(`/uploads/slug/${slug}/download`, {
			responseType: 'blob',
		});
		return response.data;
	},

	// 7. Get file URL for direct access
	getFileUrl: (fileName: string): string => {
		const baseURL =
			process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
		return `${baseURL}/uploads/f/${fileName}`;
	},

	// 8. Get file URL for direct access with full path
	getFileUrlWithPath: (filePath: string): string => {
		const baseURL =
			process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
		return `${baseURL}/uploads/file/${filePath}`;
	},

	// 9. Update upload
	updateUpload: async (
		id: string,
		data: UpdateUploadRequest
	): Promise<Upload> => {
		const response = await instance.patch(`/uploads/${id}`, data);
		return response.data;
	},

	// 10. Delete upload
	deleteUpload: async (id: string): Promise<void> => {
		await instance.delete(`/uploads/${id}`);
	},

	// 11. Import file
	importFile: async (fileName: string): Promise<Upload> => {
		const response = await instance.post(`/uploads/import/${fileName}`);
		return response.data;
	},

	// 12. Import all files
	importAllFiles: async (): Promise<Upload[]> => {
		const response = await instance.post('/uploads/import-all');
		return response.data;
	},
};
