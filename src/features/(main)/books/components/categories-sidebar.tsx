'use client';

import { BookOpen, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAllBookCategories } from '@/hooks/book-categories';

export function CategoriesSidebar() {
	const router = useRouter();
	const params = useSearchParams();
	const category = params.get('category') || 'all';

	const { bookCategories, isLoading, isError } = useAllBookCategories();

	const handleCategoryChange = (categoryId: string) => {
		router.push(`/books?category=${categoryId}&page=1`);
	};

	return (
		<div className="w-64 flex-shrink-0">
			<Card className="shadow-none !p-0 border-none rounded-none">
				<CardHeader className="!px-0 !pt-0">
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Danh mục
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 !p-0">
					{/* "Tất cả sách" option */}
					<button
						onClick={() => handleCategoryChange('all')}
						className={cn(
							'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors',
							category === 'all'
								? 'bg-blue-50 text-blue-700 border border-blue-200'
								: 'hover:bg-gray-50'
						)}
					>
						<div className="flex items-center gap-3">
							<BookOpen className="h-4 w-4" />
							<span className="font-medium">Tất cả sách</span>
						</div>
						<Badge variant="secondary" className="text-xs">
							{bookCategories?.length || 0}
						</Badge>
					</button>

					{/* Loading state */}
					{isLoading && (
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3"
								>
									<div className="flex items-center gap-3">
										<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
										<div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
									</div>
									<div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
								</div>
							))}
						</div>
					)}

					{/* Error state */}
					{isError && (
						<div className="text-center py-4 text-red-500 text-sm">
							Không thể tải danh mục sách
						</div>
					)}

					{/* Categories from API */}
					{!isLoading &&
						!isError &&
						bookCategories &&
						bookCategories.map((categoryItem) => (
							<button
								key={categoryItem.id}
								onClick={() => handleCategoryChange(categoryItem.id)}
								className={cn(
									'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors',
									category === categoryItem.id
										? 'bg-blue-50 text-blue-700 border border-blue-200'
										: 'hover:bg-gray-50'
								)}
							>
								<div className="flex items-center gap-3">
									<BookOpen className="h-4 w-4" />
									<span className="font-medium">{categoryItem.name}</span>
								</div>
								<Badge variant="secondary" className="text-xs">
									{categoryItem.children?.length || 0}
								</Badge>
							</button>
						))}
				</CardContent>
			</Card>
		</div>
	);
}
