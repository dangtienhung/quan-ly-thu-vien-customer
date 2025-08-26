import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useGetBookCategoryDetail } from '@/hooks/book-categories/use-get-book-category-detail';

interface ResultsInfoProps {
	onClearSearch?: () => void;
}

export function ResultsInfo({ onClearSearch }: ResultsInfoProps) {
	const router = useRouter();
	const params = useSearchParams();
	const category = params.get('category') || 'all';
	const searchQuery = params.get('q') || '';

	const handleClearFilter = () => {
		const searchParams = new URLSearchParams(params.toString());
		searchParams.delete('category');
		searchParams.delete('q');
		searchParams.set('page', '1');
		router.push(`/books?${searchParams.toString()}`);

		// Call callback to clear search input
		if (onClearSearch) {
			onClearSearch();
		}
	};

	// get book category detail by id
	const { data: bookCategory } = useGetBookCategoryDetail(category);

	return (
		<div className="mb-6 flex items-center justify-between">
			<p className="text-gray-600">
				{searchQuery && `Kết quả tìm kiếm cho "${searchQuery}"`}
				{category !== 'all' && ` - Danh mục: ${bookCategory?.name}`}
			</p>
			{(category !== 'all' || searchQuery) && (
				<Button variant="outline" size="sm" onClick={handleClearFilter}>
					Xóa bộ lọc
				</Button>
			)}
		</div>
	);
}
