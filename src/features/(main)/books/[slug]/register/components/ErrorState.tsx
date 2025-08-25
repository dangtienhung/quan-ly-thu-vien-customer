import { AlertCircle, BookOpen, Clock, User } from 'lucide-react';

import Link from 'next/link';

interface ErrorStateProps {
	type:
		| 'auth'
		| 'book-not-found'
		| 'not-physical'
		| 'no-reader'
		| 'card-pending'
		| 'card-inactive'
		| 'no-copies';
	slug?: string;
	onRegisterCard?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
	type,
	slug,
	onRegisterCard,
}) => {
	const getErrorConfig = () => {
		switch (type) {
			case 'auth':
				return {
					icon: BookOpen,
					title: 'Cần đăng nhập',
					message: 'Bạn cần đăng nhập để mượn sách này.',
					action: {
						text: 'Đăng nhập',
						href: '/login',
					},
				};
			case 'book-not-found':
				return {
					icon: BookOpen,
					title: 'Không tìm thấy sách',
					message: 'Sách này không tồn tại hoặc đã bị xóa.',
					action: {
						text: 'Về trang chủ',
						href: '/',
					},
				};
			case 'not-physical':
				return {
					icon: BookOpen,
					title: 'Không thể mượn sách này',
					message: 'Sách này không phải sách vật lý.',
					action: {
						text: 'Quay lại trang chi tiết sách',
						href: `/books/${slug}`,
					},
				};
			case 'no-reader':
				return {
					icon: User,
					title: 'Chưa có thẻ thư viện',
					message: 'Bạn cần đăng ký thẻ thư viện để mượn sách.',
					action: {
						text: 'Đăng ký thẻ thư viện',
						type: 'button',
					},
				};
			case 'card-pending':
				return {
					icon: Clock,
					title: 'Thẻ thư viện đang chờ phê duyệt',
					message:
						'Thẻ thư viện của bạn đã được đăng ký nhưng đang chờ quản trị viên phê duyệt. Vui lòng liên hệ thư viện để được hỗ trợ.',
					action: {
						text: 'Quay lại trang chi tiết sách',
						href: `/books/${slug}`,
					},
				};
			case 'card-inactive':
				return {
					icon: AlertCircle,
					title: 'Thẻ thư viện không hoạt động',
					message:
						'Thẻ thư viện của bạn hiện tại không hoạt động. Vui lòng liên hệ thư viện để được kích hoạt lại.',
					action: {
						text: 'Quay lại trang chi tiết sách',
						href: `/books/${slug}`,
					},
				};
			case 'no-copies':
				return {
					icon: BookOpen,
					title: 'Không có sách sẵn sàng',
					message: 'Hiện tại tất cả sách đều đã được mượn hoặc không có sẵn.',
					action: {
						text: 'Quay lại trang chi tiết sách',
						href: `/books/${slug}`,
					},
				};
			default:
				return {
					icon: BookOpen,
					title: 'Có lỗi xảy ra',
					message: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
					action: {
						text: 'Về trang chủ',
						href: '/',
					},
				};
		}
	};

	const config = getErrorConfig();
	const IconComponent = config.icon;

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="w-full max-w-[800px] text-center">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<IconComponent className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						{config.title}
					</h2>
					<p className="text-gray-600 mb-6">{config.message}</p>
					{config.action.type === 'button' ? (
						<button
							onClick={onRegisterCard}
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							{config.action.text}
						</button>
					) : (
						<Link
							href={config.action.href || '/'}
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							{config.action.text}
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default ErrorState;
