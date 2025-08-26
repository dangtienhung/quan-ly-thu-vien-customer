import { BookCategoriesAPI } from '@/apis/book-categories';
import { useQuery } from '@tanstack/react-query';

export const useGetBookCategoryDetail = (id: string) => {
	return useQuery({
		queryKey: ['book-category', id],
		queryFn: () => BookCategoriesAPI.getById(id),
	});
};
