'use client';

import { useIncrementBookView } from '@/hooks/books';
import { ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';

interface Book {
	title: string;
	image: string;
	category: string;
	views?: string;
	likes?: string;
	listens?: string;
	slug?: string; // Add slug for navigation
}

interface BookSectionProps {
	title: string;
	books: Book[];
	gridCols?: string;
	isLoading?: boolean;
}

const BookSection: React.FC<BookSectionProps> = ({
	title,
	books,
	isLoading = false,
}) => {
	const sliderRef = useRef<HTMLDivElement>(null);
	const { incrementViewBySlug } = useIncrementBookView();

	const scrollByAmount = (direction: 'left' | 'right') => {
		const container = sliderRef.current;
		if (!container) return;
		const amount = container.clientWidth; // page by viewport width
		container.scrollBy({
			left: direction === 'left' ? -amount : amount,
			behavior: 'smooth',
		});
	};

	const handleBookClick = (book: Book) => {
		if (book.slug) {
			incrementViewBySlug(book.slug);
		}
	};

	// Loading skeleton
	const LoadingSkeleton = () => (
		<div className="flex gap-4 overflow-x-auto no-scrollbar">
			{Array.from({ length: 5 }).map((_, index) => (
				<div
					key={index}
					className="w-[230px] sm:w-[260px] lg:w-[280px] xl:w-[300px] flex-none"
				>
					<div className="flex h-full flex-col space-y-2">
						<div
							className="relative overflow-hidden rounded-lg bg-gray-200 animate-pulse"
							style={{ aspectRatio: '3 / 4' }}
						/>
						<div className="h-4 bg-gray-200 rounded animate-pulse" />
						<div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
						<div className="mt-auto flex items-center space-x-3">
							<div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
							<div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
						</div>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<section className="max-w-[1280px] mx-auto px-4 mb-8">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-semibold text-base sm:text-lg">{title}</h3>
				<Link
					className="text-green-600 text-xs sm:text-sm font-semibold hover:underline"
					href="#"
				>
					Xem tất cả &gt;
				</Link>
			</div>

			<div className="relative">
				{isLoading ? (
					<LoadingSkeleton />
				) : (
					<>
						<div
							ref={sliderRef}
							className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory items-stretch"
							style={{ scrollbarWidth: 'none' }}
						>
							{books.map((book, index) => (
								<Link
									key={index}
									href={book.slug ? `/books/${book.slug}` : '#'}
									onClick={() => handleBookClick(book)}
									className="w-[230px] sm:w-[260px] lg:w-[280px] xl:w-[300px] flex-none snap-start"
								>
									<div className="flex h-full flex-col space-y-2 cursor-pointer hover:opacity-80 transition-opacity">
										<div
											className="relative overflow-hidden rounded-lg bg-gray-100"
											style={{ aspectRatio: '3 / 4' }}
										>
											<Image
												alt={`Bìa sách ${book.title}`}
												src={book.image}
												fill
												className="absolute inset-0 object-cover"
												sizes="(min-width: 1280px) 300px, (min-width: 1024px) 280px, (min-width: 640px) 260px, 230px"
												priority={index < 2}
											/>
										</div>
										<div className="font-semibold text-sm sm:text-base line-clamp-2">
											{book.title}
										</div>
										<div className="text-gray-500 text-xs sm:text-sm line-clamp-1">
											{book.category}
										</div>
										<div className="mt-auto flex items-center space-x-3 text-gray-400 text-xs">
											{book.listens && (
												<div className="flex items-center space-x-1">
													<Eye className="w-3.5 h-3.5" />
													<span>{book.listens}</span>
												</div>
											)}
											{book.views && !book.listens && (
												<div className="flex items-center space-x-1">
													<Eye className="w-3.5 h-3.5" />
													<span>{book.views}</span>
												</div>
											)}
											{book.likes && (
												<div className="flex items-center space-x-1">
													<Heart className="w-3.5 h-3.5" />
													<span>{book.likes}</span>
												</div>
											)}
											{!book.likes && !book.views && !book.listens && (
												<div className="flex items-center space-x-3">
													<div className="flex items-center space-x-1">
														<Eye className="w-3.5 h-3.5" />
														<span>0</span>
													</div>
													<div className="flex items-center space-x-1">
														<Heart className="w-3.5 h-3.5" />
														<span>0</span>
													</div>
												</div>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>

						{books.length > 0 && (
							<>
								<button
									type="button"
									aria-label="Scroll left"
									onClick={() => scrollByAmount('left')}
									className="flex absolute -left-4 top-[40%] z-10 w-8 h-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>
								<button
									type="button"
									aria-label="Scroll right"
									onClick={() => scrollByAmount('right')}
									className="flex absolute -right-4 top-[40%] z-10 w-8 h-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default BookSection;
