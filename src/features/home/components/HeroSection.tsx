import { BookWithAuthors } from '@/types/books';
import Image from 'next/image';
import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useBooks } from '@/hooks/books';
import { useRouter } from 'next/navigation';

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
							<i className="fas fa-eye"></i>
							<span>{featuredBook?.view || 0} lượt xem</span>
						</div>
						<div className="flex items-center space-x-1">
							<i className="fas fa-book"></i>
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
						<i className="fas fa-play"></i>
						<span>
							{featuredBook?.book_type === 'ebook' ? 'ĐỌC NGAY' : 'MƯỢN NGAY'}
						</span>
					</button>
				</div>

				{/* Right: List of books */}
				<div className="w-full max-w-sm mx-auto md:mx-0">
					{/* Books list with glass effect */}
					<div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
						{sidebarBooks.map((book: BookWithAuthors, index: number) => (
							<div
								key={book.id}
								className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
							>
								{/* Book cover with glass effect */}
								<div className="relative flex-shrink-0">
									<div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
									<Image
										alt={`Bìa sách ${book.title}`}
										className="relative w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
										height={64}
										src={book.cover_image || '/placeholder-book.jpg'}
										width={64}
									/>
									{/* Ranking badge */}
									<div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
										<span className="text-xs font-bold text-white">
											{index + 1}
										</span>
									</div>
								</div>

								{/* Book info */}
								<div className="flex-1 min-w-0">
									<div
										className="font-semibold text-sm text-white truncate group-hover:text-purple-200 transition-colors cursor-pointer"
										onClick={() => handleBookClick(book.slug)}
									>
										{book.title}
									</div>
									<div className="flex items-center space-x-4 mt-2">
										<div className="flex items-center space-x-1 text-xs text-white/70">
											<i className="fas fa-eye text-blue-300"></i>
											<span>{book.view}</span>
										</div>
										<div className="flex items-center space-x-1 text-xs text-white/70">
											<i className="fas fa-book text-pink-300"></i>
											<span>{book.page_count}</span>
										</div>
									</div>
									<div className="text-xs text-white/50 mt-1 truncate">
										{book.mainCategory?.name ||
											book.category?.category_name ||
											'Chưa phân loại'}
									</div>
								</div>

								{/* Arrow indicator */}
								<div className="flex-shrink-0">
									<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
										<i className="fas fa-chevron-right text-white/60 text-xs group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
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
