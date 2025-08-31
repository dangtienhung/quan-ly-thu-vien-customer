'use client';

import { useBookBySlug, useEBooksByBook, useFileUrl } from '@/hooks';
import { BookOpen, FileText } from 'lucide-react';
import { use, useEffect, useState } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const FlipbookViewer = dynamic(
	() => import('@/components/flipbook-viewer/flipbook-viewer'),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		),
	}
);

interface BookReadingPageProps {
	params: Promise<{
		slug: string;
	}>;
}

const BookReadingPage: React.FC<BookReadingPageProps> = ({ params }) => {
	const { slug } = use(params);
	const { isAuthenticated } = useAuthStore();

	// Fetch book data using React Query
	const {
		data: book,
		isLoading: bookLoading,
		error: bookError,
	} = useBookBySlug(slug);

	// Fetch ebooks by book ID using React Query
	const {
		data: ebooksData,
		isLoading: ebooksLoading,
		error: ebooksError,
	} = useEBooksByBook(book?.id || '', {});

	const { getFileUrl } = useFileUrl();
	const [isLoading, setIsLoading] = useState(true);
	const [selectedEBook, setSelectedEBook] = useState<any>(null);
	console.log('🚀 ~ BookReadingPage ~ selectedEBook:', selectedEBook);

	// Extract ebooks from the response
	const ebooks = ebooksData?.data || [];
	console.log('🚀 ~ BookReadingPage ~ ebooks:', ebooks);

	useEffect(() => {
		if (ebooksLoading) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [ebooksLoading]);

	useEffect(() => {
		// Set the first ebook as selected when ebooks are loaded
		if (ebooks.length > 0 && !selectedEBook) {
			setSelectedEBook(ebooks[0]);
		}
	}, [ebooks, selectedEBook]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4 animate-pulse" />
					<p className="text-gray-600">Đang tải sách...</p>
				</div>
			</div>
		);
	}

	// Show access denied message if not authenticated
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Truy cập bị từ chối
						</h2>
						<p className="text-gray-600 mb-6">
							Bạn cần đăng nhập để đọc sách này.
						</p>
						<div className="space-y-3">
							<Link
								href={`/books/${slug}`}
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
							>
								Quay lại trang chi tiết sách
							</Link>
							<Link
								href="/"
								className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
							>
								Về trang chủ
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show loading while fetching book data
	if (bookLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
					<p className="text-gray-600">Đang tải thông tin sách...</p>
				</div>
			</div>
		);
	}

	// Show error if book not found
	if (bookError || !book) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Không tìm thấy sách
						</h2>
						<p className="text-gray-600 mb-6">
							{bookError?.message ||
								String(bookError) ||
								'Sách này không tồn tại hoặc đã bị xóa.'}
						</p>
						<div className="space-y-3">
							<Link
								href="/"
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
							>
								Về trang chủ
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show loading while fetching ebooks
	if (ebooksLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
					<p className="text-gray-600">Đang tải file ebook...</p>
				</div>
			</div>
		);
	}

	// Show error if no ebooks found
	if (ebooksError || ebooks.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Không có file ebook
						</h2>
						<p className="text-gray-600 mb-6">
							{ebooksError?.message || 'Sách này chưa có file ebook để đọc.'}
						</p>
						<div className="space-y-3">
							<Link
								href={`/books/${slug}`}
								className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
							>
								Quay lại trang chi tiết sách
							</Link>
							<Link
								href="/"
								className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
							>
								Về trang chủ
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Get PDF URL from selected ebook
	const pdfUrl = selectedEBook
		? getFileUrl(selectedEBook.file_path.split('/').pop() || '')
		: '';
	console.log('🚀 ~ pdfUrl:', pdfUrl);

	return (
		<div className="min-h-screen bg-white">
			{/* Main Content - PDF Viewer */}
			<main className="h-[calc(100vh-4rem)]">
				{pdfUrl && (
					<FlipbookViewer
						pdfUrl={pdfUrl}
						shareUrl={pdfUrl}
						// pdfUrl={`/demo.pdf`}
						// shareUrl={`/demo.pdf`}
						className="h-full"
					/>
				)}
			</main>
		</div>
	);
};

export default BookReadingPage;
