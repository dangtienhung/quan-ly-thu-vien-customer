'use client';

import {
	BookInfoCard,
	ErrorState,
	LoadingState,
	PageHeader,
	RegistrationForm,
} from '@/features/(main)/books/[slug]/register/components';
import {
	useCreateReservation,
	useReservationsByReader,
} from '@/hooks/reservations';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { physicalCopiesApi } from '@/apis/physical-copies';
import { RegisterLibraryCardDialog } from '@/components/register-library-card-dialog';
import { useBorrowRecordsByStatus } from '@/hooks';
import { useBookBySlug } from '@/hooks/books';
import { useAvailablePhysicalCopiesByBook } from '@/hooks/physical-copies';
import { useReaderByUserId } from '@/hooks/readers';
import { useAuthStore } from '@/stores/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { toast } from 'sonner';

const PhysicalBookRegistrationPage = () => {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const slug = params.slug as string;
	const { user, isAuthenticated } = useAuthStore();

	// Fetch book data
	const {
		data: book,
		isLoading: bookLoading,
		error: bookError,
	} = useBookBySlug(slug);

	// Fetch reader data for current user
	const { data: currentReader } = useReaderByUserId(user?.id || '');

	// lấy ra độc giả đã đặt trước sách
	const { data: reservations } = useReservationsByReader(
		currentReader?.id || '',
		{
			page: 1,
			limit: 100,
			status: 'pending',
		}
	);
	console.log(
		'🚀 ~ PhysicalBookRegistrationPage ~ reservations:',
		reservations
	);

	// Fetch available physical copies for this book
	const { data: availableCopies } = useAvailablePhysicalCopiesByBook(
		book?.id || ''
	);

	// Fetch borrow records for current reader
	const { data: borrowRecords } = useBorrowRecordsByStatus(
		'borrowed',
		{
			page: 1,
			limit: 100,
			readerId: currentReader?.id || '',
		},
		!!currentReader?.id
	);
	const borrowRecordsData = borrowRecords?.data;

	// lấy ra số lượng sách đã gia hạn
	const { data: renewedRecords } = useBorrowRecordsByStatus(
		'renewed',
		{
			page: 1,
			limit: 100,
			readerId: currentReader?.id || '',
		},
		!!currentReader?.id
	);
	const renewedRecordsData = renewedRecords?.data;
	console.log(
		'🚀 ~ PhysicalBookRegistrationPage ~ renewedRecordsData:',
		renewedRecordsData
	);

	// lấy ra số lượng sách quá hạn
	const { data: overdueRecords } = useBorrowRecordsByStatus(
		'overdue',
		{
			page: 1,
			limit: 100,
			readerId: currentReader?.id || '',
		},
		!!currentReader?.id
	);
	const overdueRecordsData = overdueRecords?.data;

	// tính tổng số lượng sách đã mượn
	const totalBorrowed =
		(borrowRecordsData?.length || 0) +
		(renewedRecordsData?.length || 0) +
		(overdueRecordsData?.length || 0) +
		(reservations?.data?.length || 0);
	console.log(
		'🚀 ~ PhysicalBookRegistrationPage ~ totalBorrowed:',
		totalBorrowed
	);

	// Create reservation mutation
	const createReservation = useCreateReservation();

	// Form state
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Check if book is physical
	useEffect(() => {
		if (book && book.book_type !== 'physical') {
			toast.error('Sách này không phải sách vật lý');
			router.push(`/books/${slug}`);
		}
	}, [book, slug, router]);

	// Loading state
	if (bookLoading) {
		return <LoadingState />;
	}

	// Authentication error
	if (!isAuthenticated) {
		return <ErrorState type="auth" />;
	}

	// Book not found error
	if (bookError || !book) {
		return <ErrorState type="book-not-found" />;
	}

	// Not physical book error
	if (book.book_type !== 'physical') {
		return <ErrorState type="not-physical" slug={slug} />;
	}

	// Check if reader card is pending approval (has default dates)
	const isCardPendingApproval =
		currentReader?.cardIssueDate === '1969-01-01' &&
		currentReader?.cardExpiryDate === '1969-12-31';

	// Check if reader card is active
	const isCardActive = currentReader?.isActive === true;

	// No reader card error
	if (!currentReader) {
		return (
			<RegisterLibraryCardDialog
				onSuccess={() => {
					// Invalidate and refetch reader data after successful registration
					queryClient.invalidateQueries({
						queryKey: ['reader', 'user', user?.id],
					});
				}}
			>
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
							<button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
								Đăng ký thẻ thư viện
							</button>
						</div>
					</div>
				</div>
			</RegisterLibraryCardDialog>
		);
	}

	// Card pending approval error
	if (isCardPendingApproval) {
		return <ErrorState type="card-pending" slug={slug} />;
	}

	// Card inactive error
	if (!isCardActive) {
		return <ErrorState type="card-inactive" slug={slug} />;
	}

	// No available copies error
	if (availableCopies?.data && availableCopies.data.length === 0) {
		return <ErrorState type="no-copies" slug={slug} />;
	}

	const handleSubmit = async (borrowDate: string, dueDate: string) => {
		if (!currentReader || !book) return;

		// Kiểm tra xem có sách sẵn sàng để mượn không
		if (!availableCopies?.data || availableCopies.data.length === 0) {
			toast.error('Hiện tại không có sách sẵn sàng để mượn');
			return;
		}

		const availableCopy = availableCopies?.data?.[0];

		// Kiểm tra xem độc giả đã (đặt trước sách và mượn sách) tổng đã bằng tối đa chưa
		if (totalBorrowed >= currentReader?.readerType?.maxBorrowLimit) {
			toast.error(
				'Bạn đã mượn sách tối đa. Vui lòng trả sách để có thể mượn sách tiếp.'
			);
			return;
		}

		try {
			setIsSubmitting(true);

			// Calculate reservation expiry date (2 days from now - ngày hôm đó + 1 ngày nữa)
			const reservationDate = new Date();
			const expiryDate = new Date();
			expiryDate.setDate(expiryDate.getDate() + 1); // 2 days from now

			// Kiểm tra xem độc giả đã mượn tối đa chưa
			// if (borrowRecordsData && borrowRecordsData.length >= currentReader?.readerType?.maxBorrowLimit) {
			// 	toast.error('Bạn đã mượn tối đa 2 sách');
			// 	return;
			// }

			await createReservation.mutateAsync(
				{
					reader_id: currentReader.id,
					book_id: book.id,
					reservation_date: reservationDate.toISOString(),
					expiry_date: expiryDate.toISOString(),
					reader_notes: `Đặt trước sách: ${
						book.title
					} - Ngày mượn dự kiến: ${new Date(borrowDate).toLocaleDateString(
						'vi-VN'
					)}`,
					priority: 1,
					physical_copy_id: availableCopy.id,
				},
				{
					onSuccess: async (response) => {
						console.log('🚀 ~ handleSubmit ~ response:', response);

						try {
							// await borrowRecordsApi.create(payload);
							// Update physical copy status to 'reserved'
							const payloadUpdateStatusPhysicalCopy = {
								status: 'reserved',
								notes: `Mượn sách từ đặt trước: ${book.title} - Độc giả: ${currentReader.fullName}`,
							};
							await physicalCopiesApi.updatePhysicalCopyStatus(
								availableCopy.id,
								payloadUpdateStatusPhysicalCopy
							);

							toast.success('Đặt trước sách đã được tạo thành công!');
							router.push(`/books/${slug}`);
						} catch (error) {
							console.error('Error creating borrow record:', error);
							toast.error('Có lỗi xảy ra khi tạo phiếu mượn sách');
						}
					},
					onError: (error) => {
						console.log('🚀 ~ handleSubmit ~ error:', error);
					},
				}
			);

			router.push(`/books/${slug}`);
		} catch (error) {
			const message =
				error instanceof Error
					? (error as any)?.response?.data?.message
					: 'Có lỗi xảy ra khi đặt trước sách';
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<PageHeader bookSlug={slug} />

				<BookInfoCard
					book={book}
					availableCopiesCount={availableCopies?.data?.length}
				/>

				<RegistrationForm
					bookSlug={slug}
					currentReader={currentReader}
					onSubmit={handleSubmit}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
};

export default PhysicalBookRegistrationPage;
