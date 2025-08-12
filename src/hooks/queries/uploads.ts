import { uploadsApi } from '@/apis/uploads';
import type { CreateUploadRequest, UpdateUploadRequest } from '@/types/uploads';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const uploadKeys = {
	all: ['uploads'] as const,
	lists: () => [...uploadKeys.all, 'list'] as const,
	list: () => [...uploadKeys.lists()] as const,
	details: () => [...uploadKeys.all, 'detail'] as const,
	detail: (id: string) => [...uploadKeys.details(), id] as const,
	bySlug: (slug: string) => [...uploadKeys.details(), 'slug', slug] as const,
};

// Get uploads list
export const useUploads = () => {
	return useQuery({
		queryKey: uploadKeys.list(),
		queryFn: () => uploadsApi.getUploads(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Get upload by ID
export const useUploadById = (id: string) => {
	return useQuery({
		queryKey: uploadKeys.detail(id),
		queryFn: () => uploadsApi.getUploadById(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get upload by slug
export const useUploadBySlug = (slug: string) => {
	return useQuery({
		queryKey: uploadKeys.bySlug(slug),
		queryFn: () => uploadsApi.getUploadBySlug(slug),
		enabled: !!slug,
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Upload file mutation
export const useUploadFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateUploadRequest) => uploadsApi.uploadFile(data),
		onSuccess: () => {
			// Invalidate and refetch uploads list
			queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
		},
	});
};

// Update upload mutation
export const useUpdateUpload = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUploadRequest }) =>
			uploadsApi.updateUpload(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific upload and uploads list
			queryClient.invalidateQueries({ queryKey: uploadKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
		},
	});
};

// Delete upload mutation
export const useDeleteUpload = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => uploadsApi.deleteUpload(id),
		onSuccess: () => {
			// Invalidate uploads list
			queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
		},
	});
};

// Import file mutation
export const useImportFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (fileName: string) => uploadsApi.importFile(fileName),
		onSuccess: () => {
			// Invalidate uploads list
			queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
		},
	});
};

// Import all files mutation
export const useImportAllFiles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => uploadsApi.importAllFiles(),
		onSuccess: () => {
			// Invalidate uploads list
			queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
		},
	});
};

// Download file by ID mutation (for tracking purposes)
export const useDownloadFileById = () => {
	return useMutation({
		mutationFn: (id: string) => uploadsApi.downloadFileById(id),
	});
};

// Download file by slug mutation (for tracking purposes)
export const useDownloadFileBySlug = () => {
	return useMutation({
		mutationFn: (slug: string) => uploadsApi.downloadFileBySlug(slug),
	});
};

// Utility hook for getting file URLs
export const useFileUrl = () => {
	const getFileUrl = (fileName: string): string => {
		return uploadsApi.getFileUrl(fileName);
	};

	const getFileUrlWithPath = (filePath: string): string => {
		return uploadsApi.getFileUrlWithPath(filePath);
	};

	return {
		getFileUrl,
		getFileUrlWithPath,
	};
};
