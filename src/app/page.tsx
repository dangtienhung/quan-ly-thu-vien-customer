'use client';

import {
	BannerSection,
	BookSection,
	CategoriesSection,
	HeroSection,
} from '@/features/home/components';
import { useBooksByType, useLatestBooks } from '@/hooks/books';

import RootLayoutShell from '@/layouts/root-layout';

const HomePage = () => {
	// Fetch latest books (sách mới thêm)
	const { data: latestBooks, isLoading: isLoadingLatest } = useLatestBooks({
		limit: 5,
	});

	// Fetch physical books (sách giấy)
	const { data: physicalBooks, isLoading: isLoadingPhysical } = useBooksByType(
		'physical',
		{
			limit: 5,
		}
	);

	// Fetch ebooks (sách điện tử)
	const { data: ebooks, isLoading: isLoadingEbooks } = useBooksByType('ebook', {
		limit: 5,
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
		<RootLayoutShell>
			<div>
				<HeroSection />
				<CategoriesSection />
				<BookSection
					title="Sách mới thêm"
					books={transformBookData(latestBooks)}
					isLoading={isLoadingLatest}
					href="/books"
				/>
				<BannerSection />
				<BookSection
					title="Sách giấy"
					books={transformBookData(physicalBooks?.data)}
					isLoading={isLoadingPhysical}
					href="/books?type=physical"
				/>
				<BookSection
					title="Sách điện tử"
					books={transformBookData(ebooks?.data)}
					isLoading={isLoadingEbooks}
					href="/books?type=ebook"
				/>
			</div>
		</RootLayoutShell>
	);
};

export default HomePage;
