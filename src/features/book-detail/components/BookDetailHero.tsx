'use client';

import { Button } from '@/components/ui/button';
import { useIsAuthenticated, useLoginDialog } from '@/hooks';
import type { BookWithAuthors } from '@/types/books';
import { Book, BookOpen, Eye, Heart, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
	const { isAuthenticated } = useIsAuthenticated();
	const { openLoginDialog, setOnLoginSuccess } = useLoginDialog();
	const router = useRouter();

	const handleReadBook = () => {
		if (!isAuthenticated) {
			// Set callback to increment view and navigate after successful login
			setOnLoginSuccess(() => {
				onIncrementView();
				// Navigate to read book page after successful login
				router.push(`/books/${book.slug}/view`);
			});
			openLoginDialog();
			return; // Stop execution here - don't navigate
		}

		// User is authenticated, proceed with reading
		onIncrementView();
		// Navigate to read book page
		router.push(`/books/${book.slug}/view`);
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
							<div className="flex items-center space-x-2">
								<Heart className="w-4 h-4" />
								<span>chưa có người yêu thích</span>
							</div>
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
									Kho sách: {book.mainCategory?.name || 'Sách giáo khoa'}
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center space-x-4">
							<Button
								onClick={handleReadBook}
								className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
							>
								<BookOpen className="w-4 h-4" />
								<span>ĐỌC SÁCH</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								aria-label="Add to favorites"
								className="text-white hover:text-red-400 hover:bg-white/10 transition-colors p-2"
							>
								<Heart className="w-6 h-6" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BookDetailHero;
