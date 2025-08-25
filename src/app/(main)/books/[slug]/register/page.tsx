'use client';

import {
	BookInfoCard,
	ErrorState,
	LoadingState,
	PageHeader,
	RegistrationForm,
} from '@/features/(main)/books/[slug]/register/components';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { RegisterLibraryCardDialog } from '@/components/register-library-card-dialog';
import { User } from 'lucide-react';
import { borrowRecordsApi } from '@/apis/borrow-records';
import { physicalCopiesApi } from '@/apis/physical-copies';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useAvailablePhysicalCopiesByBook } from '@/hooks/physical-copies';
import { useBookBySlug } from '@/hooks/books';
import { useCreateReservation } from '@/hooks/reservations';
import { useQueryClient } from '@tanstack/react-query';
import { useReaderByUserId } from '@/hooks/readers';

const PhysicalBookRegistrationPage = () => {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const slug = params.slug as string;
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();

	// Fetch book data
	const {
		data: book,
		isLoading: bookLoading,
		error: bookError,
	} = useBookBySlug(slug);

	// Fetch reader data for current user
	const { data: currentReader } = useReaderByUserId(user?.id || '');

	// Fetch available physical copies for this book
	const { data: availableCopies } = useAvailablePhysicalCopiesByBook(
		book?.id || ''
	);

	// Create reservation mutation
	const createReservation = useCreateReservation();

	// Form state
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Check if user is authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			toast.error('Bạn cần đăng nhập để mượn sách');
			router.push('/login');
		}
	}, [authLoading, isAuthenticated, router]);

	// Check if book is physical
	useEffect(() => {
		if (book && book.book_type !== 'physical') {
			toast.error('Sách này không phải sách vật lý');
			router.push(`/books/${slug}`);
		}
	}, [book, slug, router]);

	// Loading state
	if (authLoading || bookLoading) {
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

		// Check if there are available copies
		if (!availableCopies?.data || availableCopies.data.length === 0) {
			toast.error('Hiện tại không có sách sẵn sàng để mượn');
			return;
		}

		const availableCopy = availableCopies?.data?.[0];

		setIsSubmitting(true);

		try {
			// Calculate reservation expiry date (2 days from now - ngày hôm đó + 1 ngày nữa)
			const reservationDate = new Date();
			const expiryDate = new Date();
			expiryDate.setDate(expiryDate.getDate() + 1); // 2 days from now

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

						// Payload create borrow record
						const payload = {
							reader_id: currentReader.id,
							copy_id: availableCopy.id,
							borrow_date: borrowDate,
							due_date: dueDate,
							status: 'pending_approval' as const,
							librarian_id: user?.id || '', // Hoặc ID của librarian hiện tại
							borrow_notes: `Mượn sách từ đặt trước: ${book.title}`,
							renewal_count: 0,
						};

						try {
							await borrowRecordsApi.create(payload);
							// Update physical copy status to 'borrowed'
							const payloadUpdateStatusPhysicalCopy = {
								status: 'borrowed',
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
			console.log('🚀 ~ handleSubmit ~ error:', error);
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
