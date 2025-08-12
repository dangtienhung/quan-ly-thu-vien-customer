'use client';

import {
	BannerSection,
	BookSection,
	CategoriesSection,
	HeroSection,
	MediaSection,
} from '@/features/home/components';
import { useBooksByType, useLatestBooks } from '@/hooks/books';

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

	// Dữ liệu sách nói
	const audioBooks = [
		{
			title: 'Cáo, Thỏ, Gà Trống',
			image:
				'https://storage.googleapis.com/a1aa/image/6e438c08-4078-4351-54ee-f6a44a1170c1.jpg',
			category: 'Sách nói',
			listens: '71.9 nghìn',
			likes: '1',
		},
		{
			title: 'Truyện Sự tích Trầu cau',
			image:
				'https://storage.googleapis.com/a1aa/image/f884f163-aef6-4084-f30d-02fdbfdc45aa.jpg',
			category: 'Sách nói',
			listens: '12 lượt nghe',
			likes: '0',
		},
		{
			title: 'Truyện cổ tích Tấm Cám',
			image:
				'https://storage.googleapis.com/a1aa/image/3a7d2aee-35ac-4e13-dd5e-25550514ccc2.jpg',
			category: 'Sách nói',
		},
		{
			title: 'Truyện Cây Khế',
			image:
				'https://storage.googleapis.com/a1aa/image/decc7df5-1abd-4914-6c88-5308de272531.jpg',
			category: 'Sách nói',
		},
		{
			title: 'Cô bé quàng khăn đỏ',
			image:
				'https://storage.googleapis.com/a1aa/image/48802e36-3b69-431a-c3df-539db8a3eed8.jpg',
			category: 'Sách nói',
		},
	];

	// Dữ liệu bài giảng điện tử
	const lectures = [
		{
			title: 'Khám phá cung trăng',
			image:
				'https://storage.googleapis.com/a1aa/image/f58e4d61-73d5-41db-efe4-507ac14276e9.jpg',
			category: 'Bài giảng điện tử',
			views: '2.4 nghìn lượt',
			likes: '0',
		},
		{
			title: 'Sử dụng an toàn đồ dùng trong gia đình',
			image:
				'https://storage.googleapis.com/a1aa/image/f58e4d61-73d5-41db-efe4-507ac14276e9.jpg',
			category: 'Bài giảng điện tử',
			views: '3.4 nghìn lượt',
			likes: '0',
		},
	];

	// Dữ liệu video
	const videos = [
		{
			title: 'Hai đường thẳng song song: Thuộc kiểm song song',
			image:
				'https://storage.googleapis.com/a1aa/image/c6f73c0e-4e72-46b2-98a1-f673070f1a7c.jpg',
			category: 'Video',
			views: '3.8k lượt xem',
			likes: '0',
		},
		{
			title: 'Lăng trụ đứng tam giác: Kỹ năng lắp thước ráp linh hoạt',
			image:
				'https://storage.googleapis.com/a1aa/image/c6f73c0e-4e72-46b2-98a1-f673070f1a7c.jpg',
			category: 'Video',
			views: '0',
			likes: '0',
		},
		{
			title: 'Hình hộp chữ nhật và hình lập phương: Bộ lịch vạn niên',
			image:
				'https://storage.googleapis.com/a1aa/image/c6f73c0e-4e72-46b2-98a1-f673070f1a7c.jpg',
			category: 'Video',
			views: '0',
			likes: '0',
		},
		{
			title: 'Tỉ lệ thức và dãy tỉ số bằng nhau: Thuốc thắng triểm mến',
			image:
				'https://storage.googleapis.com/a1aa/image/c6f73c0e-4e72-46b2-98a1-f673070f1a7c.jpg',
			category: 'Video',
			views: '0',
			likes: '0',
		},
	];

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
		<div>
			<HeroSection />
			<CategoriesSection />
			<BookSection
				title="Sách mới thêm"
				books={transformBookData(latestBooks)}
				isLoading={isLoadingLatest}
			/>
			<BannerSection />
			<BookSection
				title="Sách giấy"
				books={transformBookData(physicalBooks?.data)}
				isLoading={isLoadingPhysical}
			/>
			<BookSection
				title="Sách điện tử"
				books={transformBookData(ebooks?.data)}
				isLoading={isLoadingEbooks}
			/>
			<BookSection title="Sách nói" books={audioBooks} />
			<MediaSection title="Bài giảng điện tử" items={lectures} />
			<MediaSection
				title="Video"
				items={videos}
				gridCols="grid-cols-2 sm:grid-cols-4"
			/>
		</div>
	);
};

export default HomePage;
