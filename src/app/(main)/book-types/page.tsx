'use client';

import BannerSlider from '@/components/BannerSlider';
import { BookSection } from '@/features/home/components';
import { useBooksByType } from '@/hooks/books';

const BookTypes = () => {
	// Banner images
	const banners = ['/banners/1.jpg', '/banners/2.jpg'];

	// Fetch physical books (sách giấy)
	const { data: physicalBooks, isLoading: isLoadingPhysical } = useBooksByType(
		'physical',
		{
			limit: 10,
		}
	);

	// Fetch ebooks (sách điện tử)
	const { data: ebooks, isLoading: isLoadingEbooks } = useBooksByType('ebook', {
		limit: 10,
	});

	// Transform API data to match BookSection component format
	const transformBookData = (books: any[] | undefined) => {
		return (
			books?.map((book) => ({
				title: book.title,
				image: book.cover_image || '/placeholder-book.jpg',
				category:
					book.mainCategory?.name || book.authors?.[0]?.author_name || 'Sách',
				listens: `${book.view} lượt xem`,
				likes: '0', // API doesn't have likes field yet
				slug: book.slug, // Add slug for navigation
			})) || []
		);
	};

	return (
		<div className="max-w-[1280px] mx-auto py-8">
			{/* Banner Slider */}
			<div className="mb-12">
				<BannerSlider banners={banners} interval={5000} />
			</div>

			{/* Physical Books Section */}
			<div className="mb-8">
				<BookSection
					title="Sách giấy"
					books={transformBookData(physicalBooks?.data)}
					isLoading={isLoadingPhysical}
					href="/books?type=physical"
				/>
			</div>

			{/* E-books Section */}
			<div className="mb-8">
				<BookSection
					title="Sách điện tử"
					books={transformBookData(ebooks?.data)}
					isLoading={isLoadingEbooks}
					href="/books?type=ebook"
				/>
			</div>
		</div>
	);
};

export default BookTypes;
