'use client';

import {
	useCreateReadingHistory,
	useReadingHistoryByReaderAndBook,
} from '@/hooks/reading-history';
import { Book, BookOpen, Eye, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useReaderByUserId } from '@/hooks/readers';
import { useAuthStore } from '@/stores/auth-store';
import type { BookWithAuthors } from '@/types/books';
import Image from 'next/image';
import React from 'react';

interface BookDetailHeroProps {
	book: BookWithAuthors;
	onIncrementView: () => void;
}

// Utility function to format view numbers
const formatViewCount = (count: number): string => {
	if (count < 1000) {
		return count.toString();
	} else if (count < 1000000) {
		return `${(count / 1000).toFixed(1)}K`.replace('.0', '');
	} else {
		return `${(count / 1000000).toFixed(1)}M`.replace('.0', '');
	}
};

const BookDetailHero: React.FC<BookDetailHeroProps> = ({
	book,
	onIncrementView,
}) => {
	const params = useParams();
	const slug = params.slug as string;

	const { isAuthenticated, user } = useAuthStore();
	const router = useRouter();

	// Get reader info by user ID
	const { data: reader } = useReaderByUserId(user?.id || '');

	// Reading History hooks
	const createReadingHistoryMutation = useCreateReadingHistory();
	const { data: existingReadingHistory } = useReadingHistoryByReaderAndBook(
		reader?.id || '',
		book.id
	);

	const handleReadBook = async () => {
		if (!isAuthenticated) {
			// Lưu URL hiện tại vào localStorage để redirect sau khi đăng nhập
			const currentPath = window.location.pathname;
			localStorage.setItem('redirectAfterLogin', currentPath);

			// Redirect sang trang login
			router.push('/login');
			return;
		}

		// User is authenticated, proceed with reading
		onIncrementView();

		if (book) {
			if (book.book_type === 'ebook') {
				// Tạo hoặc cập nhật lịch sử đọc cho ebook
				if (reader?.id) {
					// if (!existingReadingHistory) {
					// Tạo lịch sử đọc mới nếu chưa có
					createReadingHistoryMutation.mutate({
						reader_id: reader.id,
						book_id: book.id,
						status: 'reading',
						current_page: 1,
						total_reading_time_seconds: 0,
						is_favorite: false,
					});
					// }
					// Nếu đã có lịch sử đọc, không cần tạo mới, chỉ navigate
				}

				// Navigate to ebook reading page
				router.push(`/books/${slug}/view`);
			} else if (book.book_type === 'physical') {
				// Navigate to physical book registration page
				router.push(`/books/${slug}/register`);
			}
		}
	};

	// Safe author names extraction
	const authorNames =
		book.authors?.map((author) => author.author_name).join(' - ') ||
		'Chưa có thông tin tác giả';

	return (
		<section
			aria-label="Book detail hero section with background blur"
			className="relative min-h-[500px]"
		>
			{/* Background Image */}
			<Image
				alt={`Background image for ${book.title}`}
				className="w-full h-full object-cover object-center brightness-75"
				fill
				src={book.cover_image || '/placeholder-book.jpg'}
				priority
			/>

			{/* Breadcrumb Navigation */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
				<nav className="text-white text-sm">
					<span>
						Trang chủ / Tài liệu / Sách điện tử / Chi tiết sách điện từ
					</span>
				</nav>
			</div>

			{/* Main Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 pt-8 lg:pt-16">
				{/* Book Cover - Left Side */}
				<div className="flex-shrink-0">
					<div className="relative w-64 h-80 lg:w-72 lg:h-96 transform rotate-1 shadow-2xl">
						<Image
							alt={`Cover of ${book.title}`}
							className="w-full h-full object-cover rounded-lg"
							fill
							src={book.cover_image || '/placeholder-book.jpg'}
							priority
						/>
					</div>
				</div>

				{/* Book Details - Right Side */}
				<div className="flex-1 max-w-2xl">
					<div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 lg:p-8 text-white">
						{/* Book Title */}
						<h1 className="text-3xl lg:text-4xl font-bold mb-4">
							{book.title}
						</h1>

						{/* Engagement Metrics */}
						<div className="flex items-center space-x-6 mb-4 text-sm">
							<div className="flex items-center space-x-2">
								<Eye className="w-4 h-4" />
								<span>{formatViewCount(book.view)} lượt xem</span>
							</div>
							{/* <div className="flex items-center space-x-2">
								<Heart className="w-4 h-4" />
								<span>chưa có người yêu thích</span>
							</div> */}
						</div>

						{/* Authors */}
						<div className="mb-4">
							<div className="flex items-start space-x-2 text-sm">
								<User className="w-4 h-4 mt-0.5 flex-shrink-0" />
								<div>
									<span className="font-medium">Tác giả: </span>
									<span>{authorNames}</span>
								</div>
							</div>
						</div>

						{/* Book Category */}
						<div className="mb-6">
							<div className="flex items-center space-x-2 text-sm">
								<Book className="w-4 h-4" />
								<span>
									Thể loại: {book.mainCategory?.name || 'Sách giáo khoa'}
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center space-x-4">
							<Button
								onClick={handleReadBook}
								disabled={createReadingHistoryMutation.isPending}
								className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<BookOpen className="w-4 h-4" />
								<span>
									{createReadingHistoryMutation.isPending
										? 'ĐANG XỬ LÝ...'
										: book?.book_type === 'ebook'
										? 'ĐỌC SÁCH'
										: 'ĐẶT MƯỢN'}
								</span>
							</Button>
							{/* <Button
								variant="ghost"
								size="sm"
								aria-label="Add to favorites"
								className="text-white hover:text-red-400 hover:bg-white/10 transition-colors p-2"
							>
								<Heart className="w-6 h-6" />
							</Button> */}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BookDetailHero;
