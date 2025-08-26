import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import type { BookWithAuthors } from '@/types/books';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BookCardProps {
	book: BookWithAuthors;
}

export function BookCard({ book }: BookCardProps) {
	const coverImage = book.cover_image || '/images/default-book-cover.jpg';

	return (
		<Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
			<div className="aspect-[3/4] overflow-hidden">
				<Link href={`/books/${book.slug}`} className="w-full h-full">
					<Image
						height={100}
						width={100}
						src={coverImage}
						alt={book.title}
						className="w-full h-[300px] object-cover"
					/>
				</Link>
			</div>
			<CardContent className="p-4 flex flex-col flex-1">
				<div className="mb-3">
					<Link href={`/books/${book.slug}`} className="w-full h-full">
						<h3 className="font-semibold mb-1 line-clamp-2">{book.title}</h3>
					</Link>
				</div>

				{/* Book Info - All items in one row */}
				<div className="flex items-center justify-between mt-auto pt-2">
					<div className="flex items-center gap-2">
						<BookOpen className="h-4 w-4 text-gray-500" />
						<span className="text-sm text-gray-600">
							{book.page_count} trang
						</span>
					</div>
					<div className="flex items-center gap-2">
						{/* {book.mainCategory && (
							<Badge variant="outline" className="text-xs">
								{book.mainCategory.name}
							</Badge>
						)} */}
						<Badge
							variant={book.book_type === 'physical' ? 'default' : 'secondary'}
							className="text-xs"
						>
							{book.book_type === 'physical' ? 'Sách giấy' : 'E-book'}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
