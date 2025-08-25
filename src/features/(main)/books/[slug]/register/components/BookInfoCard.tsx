import type { BookWithAuthors } from '@/types/books';
import Image from 'next/image';

interface BookInfoCardProps {
	book: BookWithAuthors;
	availableCopiesCount?: number;
}

const BookInfoCard: React.FC<BookInfoCardProps> = ({
	book,
	availableCopiesCount,
}) => {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<div className="flex items-start space-x-6">
				{book.cover_image && (
					<Image
						src={book.cover_image}
						alt={book.title}
						className="w-24 h-32 object-cover rounded-lg shadow-sm"
						width={96}
						height={128}
					/>
				)}
				<div className="flex-1">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						{book.title}
					</h2>
					<p className="text-gray-600 mb-2">
						Tác giả:{' '}
						{book.authors?.map((author) => author.author_name).join(', ')}
					</p>
					<p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
					<p className="text-gray-600 mb-2">
						Năm xuất bản: {book.publish_year}
					</p>
					<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
						Sách vật lý
					</div>
					{availableCopiesCount !== undefined && (
						<div className="mt-2">
							<p className="text-sm text-gray-600">
								Số lượng có sẵn:{' '}
								<span className="font-semibold text-green-600">
									{availableCopiesCount}
								</span>{' '}
								cuốn
							</p>
							{availableCopiesCount === 0 && (
								<p className="text-sm text-orange-600 mt-1">
									⚠️ Hiện tại không có sách sẵn. Bạn có thể đặt trước để được ưu
									tiên khi có sách.
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookInfoCard;
