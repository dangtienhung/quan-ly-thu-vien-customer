'use client';

import type { BookWithAuthors } from '@/types/books';
import { Book, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface RelatedBooksProps {
	books: BookWithAuthors[];
}

const RelatedBooks: React.FC<RelatedBooksProps> = ({ books }) => {
	if (!books || books.length === 0) {
		return (
			<section className="bg-white rounded-lg p-5 shadow-sm">
				<h2 className="font-semibold text-sm mb-4">Sách liên quan</h2>
				<p className="text-gray-500 text-sm">Chưa có sách liên quan</p>
			</section>
		);
	}

	return (
		<section className="bg-white rounded-lg p-5 shadow-sm">
			<h2 className="font-semibold text-sm mb-4">Sách liên quan</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{books.map((book) => (
					<Link
						key={book.id}
						href={`/books/${book.slug}`}
						className="bg-white hover:opacity-80 transition-opacity group"
					>
						<div className="relative aspect-[3/4] rounded-md mb-2 overflow-hidden bg-gray-100">
							{book.cover_image ? (
								<Image
									alt={`Book cover of ${book.title}`}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform"
									fill
									src={book.cover_image}
									sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-gray-200">
									<Book className="w-8 h-8 text-gray-400" />
								</div>
							)}
						</div>
						<h3 className="text-xs font-semibold mb-0.5 line-clamp-2 text-gray-900">
							{book.title}
						</h3>
						<p className="text-[10px] text-gray-500 mb-1 line-clamp-1">
							{book.mainCategory?.name ||
								book.authors?.[0]?.author_name ||
								'Sách'}
						</p>
						<div className="flex items-center space-x-3 text-[10px] text-gray-400">
							<div className="flex items-center space-x-1">
								<Eye className="w-3 h-3" />
								<span>{book.view} lượt xem</span>
							</div>
							<div className="flex items-center space-x-1">
								<Heart className="w-3 h-3" />
								<span>0</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

export default RelatedBooks;
