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
	// Calculate expected borrow date (default today + 1 day)
	const [borrowDate, setBorrowDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() + 1); // Ngày đặt + 1 ngày
		return date.toISOString().split('T')[0];
	});

	// Calculate expected due date based on borrow date and reader type
	const [dueDate, setDueDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() + 2); // Ngày đặt + 2 ngày (ngày mượn + 1 ngày)
		return date.toISOString().split('T')[0];
	});

	// Update due date when borrow date changes
	useEffect(() => {
		if (borrowDate) {
			const date = new Date(borrowDate);
			date.setDate(date.getDate() + 1); // Ngày mượn + 1 ngày = ngày lấy sách
			setDueDate(date.toISOString().split('T')[0]);
		}
	}, [borrowDate]);

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
						Ngày đặt
					</label>
					<div className="flex items-center space-x-2">
						<Calendar className="w-5 h-5 text-gray-400" />
						<input
							type="date"
							id="borrowDate"
							value={borrowDate}
							onChange={(e) => setBorrowDate(e.target.value)}
							className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							min={(() => {
								const tomorrow = new Date();
								tomorrow.setDate(tomorrow.getDate() + 1);
								return tomorrow.toISOString().split('T')[0];
							})()}
							required
						/>
					</div>
					<p className="text-sm text-gray-500 mt-1">
						Ngày bạn muốn mượn sách (tối thiểu từ ngày mai trở đi)
					</p>
				</div>

				{/* Expected Due Date (Read-only) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Hạn lấy sách
					</label>
					<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
						<Calendar className="w-5 h-5 text-gray-400" />
						<span className="text-gray-900">
							{new Date(dueDate).toLocaleDateString('vi-VN')}
						</span>
					</div>
					<p className="text-sm text-gray-500 mt-1">
						Ngày lấy sách sẽ là ngày mượn sách + 1 ngày (từ{' '}
						{new Date(borrowDate).toLocaleDateString('vi-VN')} đến{' '}
						{new Date(dueDate).toLocaleDateString('vi-VN')})
					</p>
				</div>

				{/* Reservation Information */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h4 className="font-medium text-blue-800 mb-2">
						Thông tin đặt trước:
					</h4>
					<ul className="text-sm text-blue-700 space-y-1">
						<li>• Đặt trước có hiệu lực trong 1 ngày kể từ ngày đặt</li>
						<li>
							• Khi có sách sẵn, thư viện sẽ thông báo qua email hoặc điện thoại
						</li>
						<li>• Bạn có thể hủy đặt trước bất cứ lúc nào trong tài khoản</li>
						<li>• Đặt trước sẽ tự động hết hạn sau 1 ngày nếu không có sách</li>
						<li>• Sau khi đặt trước, bạn có thể mượn sách từ ngày hôm sau</li>
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
						className="px-6 py-3 text-white rounded-lg bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? 'Đang xử lý...' : 'Đặt trước sách'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegistrationForm;
