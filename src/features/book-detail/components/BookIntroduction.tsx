import type { BookWithAuthors } from '@/types/books';
import React from 'react';

interface BookIntroductionProps {
	book: BookWithAuthors;
}

const BookIntroduction: React.FC<BookIntroductionProps> = ({ book }) => {
	// Safe author names extraction
	const authorNames =
		book.authors?.map((author) => author.author_name).join(' - ') ||
		'Chưa có thông tin tác giả';

	return (
		<section className="bg-white rounded-lg p-6 shadow-sm">
			<h2 className="font-semibold text-lg mb-4 text-gray-900">
				Giới thiệu sách
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Book Cover */}
				<div className="flex justify-center md:justify-start">
					<div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-lg">
						<img
							alt={`Cover of ${book.title}`}
							className="w-full h-full object-cover"
							src={book.cover_image || '/placeholder-book.jpg'}
						/>
					</div>
				</div>

				{/* Book Information */}
				<div className="space-y-3">
					<div className="flex items-start space-x-2">
						<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
							Nhan đề:
						</span>
						<span className="text-sm text-gray-900">{book.title}</span>
					</div>

					<div className="flex items-start space-x-2">
						<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
							Tác giả:
						</span>
						<span className="text-sm text-gray-900">{authorNames}</span>
					</div>

					{book.description && (
						<div className="flex items-start space-x-2">
							<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
								Mô tả:
							</span>
							<span className="text-sm text-gray-900">{book.description}</span>
						</div>
					)}

					{book.isbn && (
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
								ISBN:
							</span>
							<span className="text-sm text-gray-900">{book.isbn}</span>
						</div>
					)}

					{book.publish_year && (
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
								Năm xuất bản:
							</span>
							<span className="text-sm text-gray-900">{book.publish_year}</span>
						</div>
					)}

					{book.language && (
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
								Ngôn ngữ:
							</span>
							<span className="text-sm text-gray-900">{book.language}</span>
						</div>
					)}

					{book.page_count && (
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
								Số trang:
							</span>
							<span className="text-sm text-gray-900">{book.page_count}</span>
						</div>
					)}

					{book.book_type && (
						<div className="flex items-center space-x-2">
							<span className="font-semibold text-sm text-gray-700 min-w-[80px]">
								Loại sách:
							</span>
							<span className="text-sm text-gray-900">
								{book.book_type === 'physical' ? 'Sách giấy' : 'Sách điện tử'}
							</span>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default BookIntroduction;
