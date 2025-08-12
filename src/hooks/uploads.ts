import { uploadsApi } from '@/apis/uploads';
import type {
	CreateUploadRequest,
	UpdateUploadRequest,
	Upload,
} from '@/types/uploads';
import { useCallback, useState } from 'react';

// Hook for uploading files
export const useUploadFile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadFile = useCallback(async (data: CreateUploadRequest) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await uploadsApi.uploadFile(data);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Upload thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		uploadFile,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting uploads list
export const useUploads = () => {
	const [uploads, setUploads] = useState<Upload[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUploads = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await uploadsApi.getUploads();
			setUploads(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy danh sách uploads thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		uploads,
		fetchUploads,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting upload by ID
export const useUploadById = (id: string) => {
	const [upload, setUpload] = useState<Upload | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUpload = useCallback(async () => {
		if (!id) return { success: false, error: 'ID không hợp lệ' };

		try {
			setIsLoading(true);
			setError(null);
			const result = await uploadsApi.getUploadById(id);
			setUpload(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy thông tin upload thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	return {
		upload,
		fetchUpload,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting upload by slug
export const useUploadBySlug = (slug: string) => {
	const [upload, setUpload] = useState<Upload | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUpload = useCallback(async () => {
		if (!slug) return { success: false, error: 'Slug không hợp lệ' };

		try {
			setIsLoading(true);
			setError(null);
			const result = await uploadsApi.getUploadBySlug(slug);
			setUpload(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy thông tin upload thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, [slug]);

	return {
		upload,
		fetchUpload,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for downloading files
export const useDownloadFile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const downloadFileById = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const blob = await uploadsApi.downloadFileById(id);
			return { success: true, data: blob };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Download thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const downloadFileBySlug = useCallback(async (slug: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const blob = await uploadsApi.downloadFileBySlug(slug);
			return { success: true, data: blob };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Download thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		downloadFileById,
		downloadFileBySlug,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting file URL
export const useFileUrl = () => {
	const getFileUrl = useCallback((fileName: string) => {
		return uploadsApi.getFileUrl(fileName);
	}, []);

	const getFileUrlWithPath = useCallback((filePath: string) => {
		return uploadsApi.getFileUrlWithPath(filePath);
	}, []);

	return {
		getFileUrl,
		getFileUrlWithPath,
	};
};

// Hook for updating uploads
export const useUpdateUpload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateUpload = useCallback(
		async (id: string, data: UpdateUploadRequest) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await uploadsApi.updateUpload(id, data);
				return { success: true, data: result };
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Cập nhật thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		updateUpload,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for deleting uploads
export const useDeleteUpload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteUpload = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			await uploadsApi.deleteUpload(id);
			return { success: true };
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Xóa thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		deleteUpload,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};
