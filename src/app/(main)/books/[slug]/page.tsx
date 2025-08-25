'use client';

import {
	BookDetailHero,
	BookIntroduction,
	RelatedBooks,
} from '@/features/book-detail/components';
import {
	useBookBySlug,
	useBooksByCategory,
	useIncrementBookView,
} from '@/hooks/books';
import { useParams, useRouter } from 'next/navigation';

const BookDetailPage = () => {
	const params = useParams();
	const router = useRouter();
	const slug = params.slug as string;

	// Fetch book data
	const { data: book, isLoading, error } = useBookBySlug(slug);
	console.log('🚀 ~ BookDetailPage ~ book:', book);

	// Fetch related books (same category)
	const { data: relatedBooks } = useBooksByCategory(
		book?.mainCategory?.id || '',
		{ limit: 5 }
	);

	// Increment view count
	const { incrementViewBySlug } = useIncrementBookView();

	// Handle book type navigation
	// useEffect(() => {
	// 	if (book) {
	// 		if (book.book_type === 'ebook') {
	// 			// Navigate to ebook reading page
	// 			router.push(`/books/${slug}/view`);
	// 		} else if (book.book_type === 'physical') {
	// 			// Navigate to physical book registration page
	// 			router.push(`/books/${slug}/register`);
	// 		}
	// 	}
	// }, [book, slug, router]);

	const handleIncrementView = () => {
		if (slug) {
			incrementViewBySlug(slug);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Đang tải thông tin sách...</p>
				</div>
			</div>
		);
	}

	if (error || !book) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">
						Không tìm thấy sách
					</h1>
					<p className="text-gray-600">
						Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
					</p>
				</div>
			</div>
		);
	}

	// Filter out the current book from related books
	const filteredRelatedBooks =
		relatedBooks?.data?.filter((relatedBook) => relatedBook.id !== book.id) ||
		[];

	return (
		<div className="bg-gray-100 text-gray-700">
			<BookDetailHero book={book} onIncrementView={handleIncrementView} />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
				<BookIntroduction book={book} />
				{/* <CommentsSection /> */}
				<RelatedBooks books={filteredRelatedBooks} />
			</main>
		</div>
	);
};

export default BookDetailPage;
