import { BookOpen, CheckCircle, Eye, FileText, Play } from 'lucide-react';

import { useBooks } from '@/hooks/books';
import { useAuthStore } from '@/stores/auth-store';
import { BookWithAuthors } from '@/types/books';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const HeroSection: React.FC = () => {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();

	// Lấy sách được xem nhiều nhất (ebook)
	const { data: popularEbooks, isLoading: isLoadingEbooks } = useBooks({
		type: 'ebook',
		view: 'desc',
		limit: 1,
	});

	// Lấy danh sách sách phổ biến cho sidebar
	const { data: popularBooks, isLoading: isLoadingBooks } = useBooks({
		view: 'desc',
		limit: 5,
	});

	const featuredBook = popularEbooks?.data?.[0];
	const sidebarBooks = popularBooks?.data || [];

	// Function để navigate đến trang chi tiết sách
	const handleBookClick = (bookSlug: string) => {
		router.push(`/books/${bookSlug}`);
	};

	// Function để handle button "ĐỌC NGAY" / "MƯỢN NGAY"
	const handleReadBook = () => {
		if (!featuredBook) return;

		if (!isAuthenticated) {
			// Lưu URL hiện tại vào localStorage để redirect sau khi đăng nhập
			const currentPath = window.location.pathname;
			localStorage.setItem('redirectAfterLogin', currentPath);

			// Redirect sang trang login
			router.push('/login');
			return;
		}

		// User is authenticated, proceed with reading
		if (featuredBook.book_type === 'ebook') {
			// Navigate to ebook reading page
			router.push(`/books/${featuredBook.slug}/view`);
		} else if (featuredBook.book_type === 'physical') {
			// Navigate to physical book registration page
			router.push(`/books/${featuredBook.slug}/register`);
		}
	};

	if (isLoadingEbooks || isLoadingBooks) {
		return (
			<section className="relative bg-gradient-to-b from-[#6a5f5f] via-[#6a5f5f]/70 to-[#0f1f2a] text-white">
				<div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
						<p>Đang tải dữ liệu...</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="relative bg-gradient-to-b from-[#6a5f5f] via-[#6a5f5f]/70 to-[#0f1f2a] text-white">
			<div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
				{/* Left: Book cover */}
				<div className="flex-shrink-0 basis-[376px] max-w-[376px]">
					<div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
						<Image
							alt={
								featuredBook
									? `Bìa sách ${featuredBook.title}`
									: 'Bìa sách mặc định'
							}
							className="object-cover"
							fill
							sizes="(max-width: 768px) 100vw, 376px"
							src={featuredBook?.cover_image || '/placeholder-book.jpg'}
							priority
						/>
					</div>
				</div>

				{/* Center: Book info */}
				<div className="flex-1 max-w-xl">
					<h2
						className="font-bold text-lg sm:text-2xl md:text-3xl mb-2 cursor-pointer hover:text-blue-300 transition-colors duration-200"
						onClick={() => featuredBook && handleBookClick(featuredBook.slug)}
					>
						{featuredBook?.title || 'Không có sách nào'}
					</h2>
					<div className="flex items-center space-x-2 text-sm sm:text-base mb-2">
						<div className="flex items-center space-x-1">
							<Eye className="w-4 h-4" />
							<span>{featuredBook?.view || 0} lượt xem</span>
						</div>
						<div className="flex items-center space-x-1">
							<BookOpen className="w-4 h-4" />
							<span>{featuredBook?.page_count || 0} trang</span>
						</div>
					</div>
					<div className="text-sm sm:text-base mb-1">
						<span className="font-semibold">Thể loại:</span>
						{featuredBook?.mainCategory?.name ||
							featuredBook?.category?.category_name ||
							'Chưa phân loại'}
					</div>
					<div className="text-sm sm:text-base mb-4">
						<span className="font-semibold">Hình thức:</span>
						{featuredBook?.book_type === 'ebook'
							? 'Sách điện tử'
							: 'Sách vật lý'}
					</div>
					<button
						onClick={handleReadBook}
						className="bg-[#00B14F] text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-1 flex items-center space-x-2 hover:bg-[#009a43]"
					>
						<Play className="w-4 h-4" />
						<span>
							{featuredBook?.book_type === 'ebook' ? 'ĐỌC NGAY' : 'MƯỢN NGAY'}
						</span>
					</button>
				</div>

				{/* Right: List of books */}
				<div className="w-full max-w-sm mx-auto md:mx-0">
					{/* Books list with clean card design */}
					<div
						className="space-y-4 max-h-[600px] overflow-y-auto transparent-scrollbar"
						style={{
							scrollbarWidth: 'thin',
							scrollbarColor: 'transparent transparent',
						}}
					>
						{sidebarBooks.map((book: BookWithAuthors, index: number) => (
							<div
								key={book.id}
								// className="group bg-white rounded-xl p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100"
								className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
								onClick={() => handleBookClick(book.slug)}
							>
								{/* Book cover */}
								<div className="flex-shrink-0">
									<Image
										alt={`Bìa sách ${book.title}`}
										className="w-16 h-[90px] rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
										height={90}
										src={book.cover_image || '/placeholder-book.jpg'}
										width={64}
									/>
								</div>

								{/* Book info */}
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-white text-sm truncate transition-colors">
										{book.title}
									</h3>
									<div className="flex items-center space-x-2 mt-1">
										{/* Book type icon and text */}
										<div className="flex items-center space-x-1 text-xs text-white">
											{book.book_type === 'ebook' ? (
												<>
													<CheckCircle className="w-3 h-3" />
													<span>Sách điện tử</span>
												</>
											) : (
												<>
													<FileText className="w-3 h-3" />
													<span>Sách vật lý</span>
												</>
											)}
										</div>
									</div>
									<div className="text-xs text-white mt-1 truncate">
										Thể loại:{' '}
										{book.mainCategory?.name ||
											book.category?.category_name ||
											'Chưa phân loại'}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
