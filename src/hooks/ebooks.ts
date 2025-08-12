import { ebooksApi } from '@/apis/ebooks';
import type {
	CreateEBookRequest,
	CreateManyEBooksRequest,
	DeleteManyEBooksRequest,
	EBook,
	EBooksQueryParams,
	EBookStats,
	UpdateEBookFileInfoRequest,
	UpdateEBookRequest,
} from '@/types/ebooks';
import { useCallback, useState } from 'react';

// Hook for creating ebook
export const useCreateEBook = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createEBook = useCallback(async (data: CreateEBookRequest) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ebooksApi.createEBook(data);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Tạo ebook thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		createEBook,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for creating many ebooks
export const useCreateManyEBooks = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createManyEBooks = useCallback(
		async (bookId: string, data: CreateManyEBooksRequest) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await ebooksApi.createManyEBooks(bookId, data);
				return { success: true, data: result };
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Tạo nhiều ebook thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		createManyEBooks,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting ebooks list
export const useEBooks = () => {
	const [ebooks, setEBooks] = useState<EBook[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEBooks = useCallback(async (params: EBooksQueryParams = {}) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ebooksApi.getEBooks(params);
			setEBooks(result.data);
			setTotal(result.total);
			setPage(result.page);
			setLimit(result.limit);
			setTotalPages(result.totalPages);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy danh sách ebooks thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		ebooks,
		total,
		page,
		limit,
		totalPages,
		fetchEBooks,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for searching ebooks
export const useSearchEBooks = () => {
	const [searchResults, setSearchResults] = useState<EBook[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const searchEBooks = useCallback(
		async (query: string, params: Omit<EBooksQueryParams, 'q'> = {}) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await ebooksApi.searchEBooks(query, params);
				setSearchResults(result.data);
				setTotal(result.total);
				setPage(result.page);
				setLimit(result.limit);
				setTotalPages(result.totalPages);
				return { success: true, data: result };
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Tìm kiếm ebooks thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		searchResults,
		total,
		page,
		limit,
		totalPages,
		searchEBooks,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting ebooks by book ID
export const useEBooksByBook = (bookId: string) => {
	const [ebooks, setEBooks] = useState<EBook[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEBooksByBook = useCallback(
		async (params: Omit<EBooksQueryParams, 'bookId'> = {}) => {
			if (!bookId) return { success: false, error: 'Book ID không hợp lệ' };

			try {
				setIsLoading(true);
				setError(null);
				const result = await ebooksApi.getEBooksByBook(bookId, params);
				setEBooks(result.data);
				setTotal(result.total);
				setPage(result.page);
				setLimit(result.limit);
				setTotalPages(result.totalPages);
				return { success: true, data: result };
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Lấy ebooks theo sách thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[bookId]
	);

	return {
		ebooks,
		total,
		page,
		limit,
		totalPages,
		fetchEBooksByBook,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting ebook by ID
export const useEBookById = (id: string) => {
	const [ebook, setEBook] = useState<EBook | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEBook = useCallback(async () => {
		if (!id) return { success: false, error: 'ID không hợp lệ' };

		try {
			setIsLoading(true);
			setError(null);
			const result = await ebooksApi.getEBookById(id);
			setEBook(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy thông tin ebook thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	return {
		ebook,
		fetchEBook,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting popular ebooks
export const usePopularEBooks = () => {
	const [popularEBooks, setPopularEBooks] = useState<EBook[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPopularEBooks = useCallback(async (limit: number = 10) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ebooksApi.getPopularEBooks(limit);
			setPopularEBooks(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy ebooks phổ biến thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		popularEBooks,
		fetchPopularEBooks,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting recent ebooks
export const useRecentEBooks = () => {
	const [recentEBooks, setRecentEBooks] = useState<EBook[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchRecentEBooks = useCallback(async (limit: number = 10) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ebooksApi.getRecentEBooks(limit);
			setRecentEBooks(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy ebooks mới nhất thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		recentEBooks,
		fetchRecentEBooks,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for getting ebook stats
export const useEBookStats = () => {
	const [stats, setStats] = useState<EBookStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ebooksApi.getEBookStats();
			setStats(result);
			return { success: true, data: result };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Lấy thống kê ebooks thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		stats,
		fetchStats,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for updating ebook
export const useUpdateEBook = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateEBook = useCallback(
		async (id: string, data: UpdateEBookRequest) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await ebooksApi.updateEBook(id, data);
				return { success: true, data: result };
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Cập nhật ebook thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		updateEBook,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for updating ebook file info
export const useUpdateEBookFileInfo = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateEBookFileInfo = useCallback(
		async (id: string, data: UpdateEBookFileInfoRequest) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await ebooksApi.updateEBookFileInfo(id, data);
				return { success: true, data: result };
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: 'Cập nhật thông tin file thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		updateEBookFileInfo,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for incrementing downloads
export const useIncrementDownloads = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const incrementDownloads = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			await ebooksApi.incrementDownloads(id);
			return { success: true };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Tăng lượt tải thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		incrementDownloads,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for deleting ebook
export const useDeleteEBook = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteEBook = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			await ebooksApi.deleteEBook(id);
			return { success: true };
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Xóa ebook thất bại';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		deleteEBook,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};

// Hook for deleting many ebooks
export const useDeleteManyEBooks = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteManyEBooks = useCallback(
		async (data: DeleteManyEBooksRequest) => {
			try {
				setIsLoading(true);
				setError(null);
				await ebooksApi.deleteManyEBooks(data);
				return { success: true };
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Xóa nhiều ebook thất bại';
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		deleteManyEBooks,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};
