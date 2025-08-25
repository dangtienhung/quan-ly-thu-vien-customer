import { BookOpen, Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { ReaderWithDetails } from '@/types/readers';
import Link from 'next/link';

interface RegistrationFormProps {
	bookSlug: string;
	currentReader: ReaderWithDetails;
	onSubmit: (borrowDate: string, dueDate: string) => Promise<void>;
	isSubmitting: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
	bookSlug,
	currentReader,
	onSubmit,
	isSubmitting,
}) => {
	// Calculate expected borrow date (default today)
	const [borrowDate, setBorrowDate] = useState(() => {
		return new Date().toISOString().split('T')[0];
	});

	// Calculate expected due date based on borrow date and reader type
	const [dueDate, setDueDate] = useState(() => {
		const date = new Date();
		const durationDays = currentReader.readerType?.borrowDurationDays || 14;
		date.setDate(date.getDate() + durationDays);
		return date.toISOString().split('T')[0];
	});

	// Update due date when borrow date changes
	useEffect(() => {
		if (borrowDate && currentReader.readerType?.borrowDurationDays) {
			const date = new Date(borrowDate);
			date.setDate(
				date.getDate() + currentReader.readerType.borrowDurationDays
			);
			setDueDate(date.toISOString().split('T')[0]);
		}
	}, [borrowDate, currentReader.readerType?.borrowDurationDays]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(borrowDate, dueDate);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Thông tin đặt trước sách
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
							<span className="text-gray-900">{currentReader.fullName}</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Số thẻ thư viện
						</label>
						<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
							<BookOpen className="w-5 h-5 text-gray-400" />
							<span className="text-gray-900">{currentReader.cardNumber}</span>
						</div>
					</div>
				</div>

				{/* Expected Borrow Date */}
				<div>
					<label
						htmlFor="borrowDate"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Ngày mượn dự kiến
					</label>
					<div className="flex items-center space-x-2">
						<Calendar className="w-5 h-5 text-gray-400" />
						<input
							type="date"
							id="borrowDate"
							value={borrowDate}
							onChange={(e) => setBorrowDate(e.target.value)}
							className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							min={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>
					<p className="text-sm text-gray-500 mt-1">
						Ngày bạn muốn mượn sách (tối thiểu từ hôm nay)
					</p>
				</div>

				{/* Expected Due Date (Read-only) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Ngày trả dự kiến
					</label>
					<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
						<Calendar className="w-5 h-5 text-gray-400" />
						<span className="text-gray-900">
							{new Date(dueDate).toLocaleDateString('vi-VN')}
						</span>
					</div>
					<p className="text-sm text-gray-500 mt-1">
						Thời gian mượn tối đa:{' '}
						{currentReader.readerType?.borrowDurationDays || 14} ngày
					</p>
				</div>

				{/* Reservation Information */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h4 className="font-medium text-blue-800 mb-2">
						Thông tin đặt trước:
					</h4>
					<ul className="text-sm text-blue-700 space-y-1">
						<li>• Đặt trước có hiệu lực trong 7 ngày</li>
						<li>• Khi có sách sẵn, thư viện sẽ liên hệ bạn</li>
						<li>• Bạn có thể hủy đặt trước bất cứ lúc nào</li>
						<li>• Đặt trước sẽ tự động hết hạn sau 7 ngày</li>
					</ul>
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
						href={`/books/${bookSlug}`}
						className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Hủy
					</Link>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? 'Đang xử lý...' : 'Đặt trước sách'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegistrationForm;
