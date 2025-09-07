import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

import { BookCard } from './book-card';
import { BookOpen } from 'lucide-react';
import { useBooks } from '@/hooks';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useRouter } from 'next/navigation';

interface BooksGridProps {
	bookType?: 'physical' | 'ebook';
}

export function BooksGrid({ bookType }: BooksGridProps) {
	const router = useRouter();
	const params = useQueryParams();
	const page = params.page ? parseInt(params.page) : 1;

	const queryBooks = {
		page: params.page ? parseInt(params.page) : 1,
		limit: params.limit ? parseInt(params.limit) : 12,
		main_category_id: params.category === 'all' ? undefined : params.category,
		type:
			bookType ||
			(params.type === 'all'
				? undefined
				: (params.type as 'physical' | 'ebook')),
		q: params.q,
	};

	const { data: booksResponse, isLoading, isError } = useBooks(queryBooks);

	const books = booksResponse?.data || [];
	const pagination = booksResponse?.pagination;

	const handlePageChange = (newPage: number) => {
		const searchParams = new URLSearchParams(params.toString());
		searchParams.set('page', newPage.toString());
		router.push(`/books?${searchParams.toString()}`);
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, index) => (
						<div key={index} className="space-y-3">
							<div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded animate-pulse" />
								<div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center py-12">
				<BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Đã xảy ra lỗi
				</h3>
				<p className="text-gray-600">
					Không thể tải danh sách sách. Vui lòng thử lại sau.
				</p>
			</div>
		);
	}

	if (books.length === 0) {
		const getEmptyMessage = () => {
			if (bookType === 'physical') {
				return {
					title: 'Chưa có sách vật lý',
					description: 'Hiện tại chưa có sách in nào trong danh mục này',
				};
			} else if (bookType === 'ebook') {
				return {
					title: 'Chưa có sách điện tử',
					description: 'Hiện tại chưa có e-book nào trong danh mục này',
				};
			} else {
				return {
					title: 'Không tìm thấy sách',
					description: 'Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác',
				};
			}
		};

		const emptyMessage = getEmptyMessage();

		return (
			<div className="text-center py-12">
				<BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					{emptyMessage.title}
				</h3>
				<p className="text-gray-600">{emptyMessage.description}</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Books Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{books.map((book) => (
					<BookCard key={book.id} book={book} />
				))}
			</div>

			{/* Pagination - Only show when not in collapse mode */}
			{!bookType && pagination && pagination.totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						{/* Previous Button */}
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (page > 1) {
										handlePageChange(page - 1);
									}
								}}
								className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>

						{/* Page Numbers */}
						{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
							(pageNum) => {
								// Show first page, last page, current page, and pages around current
								const shouldShow =
									pageNum === 1 ||
									pageNum === pagination.totalPages ||
									(pageNum >= page - 1 && pageNum <= page + 1);

								if (!shouldShow) {
									// Show ellipsis
									if (pageNum === page - 2 || pageNum === page + 2) {
										return (
											<PaginationItem key={`ellipsis-${pageNum}`}>
												<PaginationEllipsis />
											</PaginationItem>
										);
									}
									return null;
								}

								return (
									<PaginationItem key={pageNum}>
										<PaginationLink
											href="#"
											onClick={(e) => {
												e.preventDefault();
												handlePageChange(pageNum);
											}}
											isActive={pageNum === page}
										>
											{pageNum}
										</PaginationLink>
									</PaginationItem>
								);
							}
						)}

						{/* Next Button */}
						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (page < pagination.totalPages) {
										handlePageChange(page + 1);
									}
								}}
								className={
									page >= pagination.totalPages
										? 'pointer-events-none opacity-50'
										: ''
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
