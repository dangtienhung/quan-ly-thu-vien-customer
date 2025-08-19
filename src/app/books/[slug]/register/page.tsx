'use client';

import { RegisterLibraryCardDialog } from '@/components/register-library-card-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useBookBySlug } from '@/hooks/books';
import { useCreateBorrowRecord } from '@/hooks/borrow-records';
import { useAvailablePhysicalCopiesByBook } from '@/hooks/physical-copies';
import { useReaderByUserId } from '@/hooks/readers';
import { AlertCircle, BookOpen, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const PhysicalBookRegistrationPage = () => {
	const params = useParams();
	const router = useRouter();
	const slug = params.slug as string;
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();

	// Fetch book data
	const {
		data: book,
		isLoading: bookLoading,
		error: bookError,
	} = useBookBySlug(slug);

	// Fetch reader data for current user
	const { data: currentReader, refetch: refetchReaders } = useReaderByUserId(
		user?.id || ''
	);

	// Fetch available physical copies for this book
	const { data: availableCopies } = useAvailablePhysicalCopiesByBook(
		book?.id || ''
	);
	console.log(
		'🚀 ~ PhysicalBookRegistrationPage ~ availableCopies:',
		availableCopies
	);

	// Create borrow record mutation
	const createBorrowRecord = useCreateBorrowRecord();

	// Form state
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Calculate due date (default 14 days from now)
	const [dueDate, setDueDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() + 14);
		return date.toISOString().split('T')[0];
	});

	// Check if user is authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			toast.error('Bạn cần đăng nhập để mượn sách');
			router.push('/auth/login');
		}
	}, [authLoading, isAuthenticated, router]);

	// Check if book is physical
	useEffect(() => {
		if (book && book.book_type !== 'physical') {
			toast.error('Sách này không phải sách vật lý');
			router.push(`/books/${slug}`);
		}
	}, [book, slug, router]);

	if (authLoading || bookLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
					<p className="text-gray-600">Đang tải thông tin...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Cần đăng nhập
						</h2>
						<p className="text-gray-600 mb-6">
							Bạn cần đăng nhập để mượn sách này.
						</p>
						<Link
							href="/auth/login"
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Đăng nhập
						</Link>
					</div>
				</div>
			</div>
		);
	}

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
							Sách này không tồn tại hoặc đã bị xóa.
						</p>
						<Link
							href="/"
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Về trang chủ
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (book.book_type !== 'physical') {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Không thể mượn sách này
						</h2>
						<p className="text-gray-600 mb-6">
							Sách này không phải sách vật lý.
						</p>
						<Link
							href={`/books/${slug}`}
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Quay lại trang chi tiết sách
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Check if reader card is pending approval (has default dates)
	const isCardPendingApproval =
		currentReader?.cardIssueDate === '1969-01-01' &&
		currentReader?.cardExpiryDate === '1969-12-31';

	// Check if reader card is active
	const isCardActive = currentReader?.isActive === true;

	if (!currentReader) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<User className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Chưa có thẻ thư viện
						</h2>
						<p className="text-gray-600 mb-6">
							Bạn cần đăng ký thẻ thư viện để mượn sách.
						</p>
						<RegisterLibraryCardDialog onSuccess={refetchReaders}>
							<button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
								Đăng ký thẻ thư viện
							</button>
						</RegisterLibraryCardDialog>
					</div>
				</div>
			</div>
		);
	}

	if (isCardPendingApproval) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Thẻ thư viện đang chờ phê duyệt
						</h2>
						<p className="text-gray-600 mb-6">
							Thẻ thư viện của bạn đã được đăng ký nhưng đang chờ quản trị viên
							phê duyệt. Vui lòng liên hệ thư viện để được hỗ trợ.
						</p>
						<Link
							href={`/books/${slug}`}
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Quay lại trang chi tiết sách
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (!isCardActive) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Thẻ thư viện không hoạt động
						</h2>
						<p className="text-gray-600 mb-6">
							Thẻ thư viện của bạn hiện tại không hoạt động. Vui lòng liên hệ
							thư viện để được kích hoạt lại.
						</p>
						<Link
							href={`/books/${slug}`}
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Quay lại trang chi tiết sách
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Check if there are available copies
	if (availableCopies?.data && availableCopies.data.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-[800px] text-center">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Không có sách sẵn sàng
						</h2>
						<p className="text-gray-600 mb-6">
							Hiện tại tất cả sách đều đã được mượn hoặc không có sẵn.
						</p>
						<Link
							href={`/books/${slug}`}
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							Quay lại trang chi tiết sách
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!currentReader || !book) return;

		// Check if there are available copies
		if (!availableCopies?.data || availableCopies.data.length === 0) {
			toast.error('Hiện tại không có sách sẵn sàng để mượn');
			return;
		}

		setIsSubmitting(true);

		try {
			// Use the first available copy
			const availableCopy = availableCopies.data[0];

			await createBorrowRecord.mutateAsync({
				reader_id: currentReader.id,
				copy_id: availableCopy.id,
				borrow_date: new Date().toISOString().split('T')[0],
				due_date: dueDate,
				librarian_id: user?.id || '', // Assuming user is librarian or using their own ID
				borrow_notes: `Đăng ký mượn sách: ${book.title}`,
				status: 'pending_approval',
			});

			toast.success('Yêu cầu mượn sách đã được gửi và đang chờ phê duyệt!');
			router.push(`/books/${slug}`);
		} catch (error) {
			console.error('Error creating borrow record:', error);
			toast.error('Có lỗi xảy ra khi đăng ký mượn sách');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						href={`/books/${slug}`}
						className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
					>
						← Quay lại trang chi tiết sách
					</Link>
					<h1 className="text-3xl font-bold text-gray-900">
						Đăng ký mượn sách
					</h1>
				</div>

				{/* Book Information */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<div className="flex items-start space-x-6">
						{book.cover_image && (
							<img
								src={book.cover_image}
								alt={book.title}
								className="w-24 h-32 object-cover rounded-lg shadow-sm"
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
							{availableCopies?.data && (
								<div className="mt-2">
									<p className="text-sm text-gray-600">
										Số lượng có sẵn:{' '}
										<span className="font-semibold text-green-600">
											{availableCopies.data.length}
										</span>{' '}
										cuốn
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Registration Form */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-6">
						Thông tin đăng ký mượn
					</h3>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Reader Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Họ tên độc giả
								</label>
								<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
									<User className="w-5 h-5 text-gray-400" />
									<span className="text-gray-900">
										{currentReader.fullName}
									</span>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Số thẻ thư viện
								</label>
								<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
									<BookOpen className="w-5 h-5 text-gray-400" />
									<span className="text-gray-900">
										{currentReader.cardNumber}
									</span>
								</div>
							</div>
						</div>

						{/* Borrow Date */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Ngày mượn
							</label>
							<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
								<Calendar className="w-5 h-5 text-gray-400" />
								<span className="text-gray-900">
									{new Date().toLocaleDateString('vi-VN')}
								</span>
							</div>
						</div>

						{/* Due Date */}
						<div>
							<label
								htmlFor="dueDate"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Ngày hẹn trả
							</label>
							<div className="flex items-center space-x-2">
								<Clock className="w-5 h-5 text-gray-400" />
								<input
									type="date"
									id="dueDate"
									value={dueDate}
									onChange={(e) => setDueDate(e.target.value)}
									className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									min={new Date().toISOString().split('T')[0]}
									required
								/>
							</div>
							<p className="text-sm text-gray-500 mt-1">
								Thời gian mượn tối đa:{' '}
								{currentReader.readerType?.borrowDurationDays || 14} ngày
							</p>
						</div>

						{/* Terms and Conditions */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<h4 className="font-medium text-yellow-800 mb-2">
								Điều khoản mượn sách:
							</h4>
							<ul className="text-sm text-yellow-700 space-y-1">
								<li>• Sách phải được trả đúng hạn</li>
								<li>• Giữ gìn sách cẩn thận, không làm hư hỏng</li>
								<li>
									• Phạt trễ hạn:{' '}
									{currentReader.readerType?.lateReturnFinePerDay?.toLocaleString(
										'vi-VN'
									)}{' '}
									VNĐ/ngày
								</li>
								<li>• Liên hệ thư viện nếu có vấn đề gì</li>
							</ul>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end space-x-4">
							<Link
								href={`/books/${slug}`}
								className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Hủy
							</Link>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isSubmitting ? 'Đang xử lý...' : 'Đăng ký mượn sách'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PhysicalBookRegistrationPage;
