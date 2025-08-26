import { BookCategoriesAPI } from '@/apis/book-categories';
import { PaginationQuery } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

interface UseBookCategoriesOptions {
	params?: PaginationQuery;
	enabled?: boolean;
}

export const useBookCategories = (options: UseBookCategoriesOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['book-categories', params],
		queryFn: () => BookCategoriesAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	return {
		bookCategories: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
