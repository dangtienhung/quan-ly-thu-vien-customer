'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBooks } from '@/hooks';
import { Book, Filter, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FilterOptions {
	search: string;
	category: string;
	language: string;
	bookType: string;
	sortBy: string;
}

const SearchPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [filters, setFilters] = useState<FilterOptions>({
		search: searchParams.get('q') || '',
		category: searchParams.get('category') || '',
		language: searchParams.get('language') || '',
		bookType: searchParams.get('type') || '',
		sortBy: searchParams.get('sort') || 'relevance',
	});
	const [showFilters, setShowFilters] = useState(false);

	// Fetch books with filters
	const { data: booksData, isLoading } = useBooks({
		type: filters.bookType as 'physical' | 'ebook' | undefined,
		main_category_id: filters.category || undefined,
		limit: 20,
	});

	const books = booksData?.data || [];

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();
		if (filters.search) params.set('q', filters.search);
		if (filters.category) params.set('category', filters.category);
		if (filters.language) params.set('language', filters.language);
		if (filters.bookType) params.set('type', filters.bookType);
		if (filters.sortBy) params.set('sort', filters.sortBy);

		const newUrl = params.toString()
			? `/search?${params.toString()}`
			: '/search';
		router.push(newUrl, { scroll: false });
	}, [filters, router]);

	const handleSearch = (value: string) => {
		setFilters((prev) => ({ ...prev, search: value }));
	};

	const clearFilters = () => {
		setFilters({
			search: '',
			category: '',
			language: '',
			bookType: '',
			sortBy: 'relevance',
		});
	};

	const hasActiveFilters = Object.values(filters).some(
		(value) => value && value !== 'relevance'
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center space-x-4">
						<Link
							href="/"
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							<X className="w-5 h-5" />
						</Link>
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<Input
									type="text"
									placeholder="Tìm kiếm sách, tác giả, ISBN..."
									value={filters.search}
									onChange={(e) => handleSearch(e.target.value)}
									className="pl-10 pr-4 py-2 w-full"
								/>
							</div>
						</div>
						<Button
							onClick={() => setShowFilters(!showFilters)}
							variant={showFilters ? 'default' : 'outline'}
							size="sm"
							className="flex items-center space-x-2"
						>
							<Filter className="w-4 h-4" />
							<span>Bộ lọc</span>
						</Button>
					</div>

					{/* Filter Bar */}
					{showFilters && (
						<div className="mt-4 p-4 bg-gray-50 rounded-lg">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Danh mục
									</label>
									<select
										value={filters.category}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												category: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="">Tất cả danh mục</option>
										<option value="textbook">Sách giáo khoa</option>
										<option value="reference">Sách tham khảo</option>
										<option value="literature">Văn học</option>
										<option value="science">Khoa học</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Ngôn ngữ
									</label>
									<select
										value={filters.language}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												language: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="">Tất cả ngôn ngữ</option>
										<option value="vi">Tiếng Việt</option>
										<option value="en">Tiếng Anh</option>
										<option value="fr">Tiếng Pháp</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Loại sách
									</label>
									<select
										value={filters.bookType}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												bookType: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="">Tất cả loại</option>
										<option value="physical">Sách giấy</option>
										<option value="digital">Sách điện tử</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Sắp xếp
									</label>
									<select
										value={filters.sortBy}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												sortBy: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="relevance">Liên quan nhất</option>
										<option value="title">Tên sách A-Z</option>
										<option value="title_desc">Tên sách Z-A</option>
										<option value="date">Mới nhất</option>
										<option value="views">Lượt xem nhiều</option>
									</select>
								</div>
							</div>

							{hasActiveFilters && (
								<div className="mt-4 flex justify-end">
									<Button
										onClick={clearFilters}
										variant="outline"
										size="sm"
										className="text-red-600 border-red-300 hover:bg-red-50"
									>
										Xóa bộ lọc
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Results */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Results Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Kết quả tìm kiếm
						</h1>
						{books.length > 0 && (
							<p className="text-gray-600 mt-1">
								Tìm thấy {books.length} sách
								{filters.search && ` cho "${filters.search}"`}
							</p>
						)}
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={i} className="animate-pulse">
								<div className="bg-gray-200 aspect-[3/4] rounded-lg mb-3"></div>
								<div className="h-4 bg-gray-200 rounded mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-2/3"></div>
							</div>
						))}
					</div>
				)}

				{/* No Results */}
				{!isLoading && books.length === 0 && (
					<div className="text-center py-12">
						<Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Không tìm thấy sách
						</h3>
						<p className="text-gray-600 mb-6">
							{filters.search
								? `Không có kết quả nào cho "${filters.search}". Hãy thử từ khóa khác.`
								: 'Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.'}
						</p>
						<Button onClick={clearFilters} variant="outline">
							Xóa bộ lọc
						</Button>
					</div>
				)}

				{/* Books Grid */}
				{!isLoading && books.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{books.map((book) => (
							<Link
								key={book.id}
								href={`/books/${book.slug}`}
								className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
							>
								<div className="relative aspect-[3/4] rounded-t-lg overflow-hidden">
									{book.cover_image ? (
										<Image
											alt={`Cover of ${book.title}`}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform"
											fill
											src={book.cover_image}
											sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gray-200">
											<Book className="w-12 h-12 text-gray-400" />
										</div>
									)}
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-900 group-hover:text-green-600 transition-colors">
										{book.title}
									</h3>
									<p className="text-xs text-gray-500 mb-2 line-clamp-1">
										{book.authors?.[0]?.author_name || 'Chưa có tác giả'}
									</p>
									<div className="flex items-center justify-between text-xs text-gray-400">
										<span>{book.mainCategory?.name || 'Sách'}</span>
										<span>{book.view} lượt xem</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchPage;
