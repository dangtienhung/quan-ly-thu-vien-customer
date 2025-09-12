'use client';

import {
	AlertCircle,
	Book,
	BookOpen,
	Calendar,
	CheckCircle,
	Clock,
	Heart,
	LogOut,
	User,
	XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useBorrowRecordsByReader } from '@/hooks/borrow-records';
import { useReaderByUserId } from '@/hooks/readers';
import { useAuthStore } from '@/stores/auth-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReadingHistory {
	id: string;
	book: {
		id: string;
		title: string;
		cover_image?: string;
		slug: string;
	};
	last_read_at: string;
	progress: number;
}

interface FavoriteBook {
	id: string;
	book: {
		id: string;
		title: string;
		cover_image?: string;
		slug: string;
		authors?: Array<{ author_name: string }>;
	};
	added_at: string;
}

const ProfilePage = () => {
	const { user, logout, isAuthenticated } = useAuthStore();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<
		'profile' | 'history' | 'favorites' | 'borrowings'
	>('profile');
	const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
	const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBook[]>([]);

	// Fetch reader data for current user
	const { data: currentReader } = useReaderByUserId(user?.id || '');

	// Fetch borrow records for current reader
	const { data: borrowRecordsData } = useBorrowRecordsByReader(
		currentReader?.id || '',
		{ limit: 50 }
	);

	// Redirect if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/');
		}
	}, [isAuthenticated, router]);

	const handleLogout = () => {
		logout();
		router.push('/');
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const getStatusInfo = (status: string) => {
		switch (status) {
			case 'pending_approval':
				return {
					label: 'Chờ phê duyệt',
					icon: AlertCircle,
					color: 'text-yellow-600',
					bgColor: 'bg-yellow-100',
				};
			case 'borrowed':
				return {
					label: 'Đang mượn',
					icon: BookOpen,
					color: 'text-blue-600',
					bgColor: 'bg-blue-100',
				};
			case 'returned':
				return {
					label: 'Đã trả',
					icon: CheckCircle,
					color: 'text-green-600',
					bgColor: 'bg-green-100',
				};
			case 'overdue':
				return {
					label: 'Quá hạn',
					icon: XCircle,
					color: 'text-red-600',
					bgColor: 'bg-red-100',
				};
			case 'renewed':
				return {
					label: 'Đã gia hạn',
					icon: Calendar,
					color: 'text-purple-600',
					bgColor: 'bg-purple-100',
				};
			default:
				return {
					label: 'Không xác định',
					icon: AlertCircle,
					color: 'text-gray-600',
					bgColor: 'bg-gray-100',
				};
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">
						Vui lòng đăng nhập để xem trang cá nhân
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto py-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-gray-900">Trang cá nhân</h1>
						<Button
							onClick={handleLogout}
							variant="outline"
							className="text-red-600 border-red-300 hover:bg-red-50"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Đăng xuất
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6">
							{/* User Info */}
							<div className="text-center mb-6">
								<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<User className="w-10 h-10 text-green-600" />
								</div>
								<h2 className="text-lg font-semibold text-gray-900 mb-1">
									{user?.username || 'Người dùng'}
								</h2>
								<p className="text-sm text-gray-500">{user?.email}</p>
							</div>

							{/* Navigation Tabs */}
							<nav className="space-y-2">
								<button
									onClick={() => setActiveTab('profile')}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										activeTab === 'profile'
											? 'bg-green-100 text-green-700'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									<User className="w-4 h-4" />
									<span>Thông tin cá nhân</span>
								</button>
								<button
									onClick={() => setActiveTab('history')}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										activeTab === 'history'
											? 'bg-green-100 text-green-700'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									<Clock className="w-4 h-4" />
									<span>Lịch sử đọc</span>
								</button>
								{/* <button
									onClick={() => setActiveTab('favorites')}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										activeTab === 'favorites'
											? 'bg-green-100 text-green-700'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									<Heart className="w-4 h-4" />
									<span>Sách yêu thích</span>
								</button> */}
								<button
									onClick={() => setActiveTab('borrowings')}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										activeTab === 'borrowings'
											? 'bg-green-100 text-green-700'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									<BookOpen className="w-4 h-4" />
									<span>Mượn trả sách</span>
								</button>
							</nav>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3">
						{/* Profile Tab */}
						{activeTab === 'profile' && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">
									Thông tin cá nhân
								</h3>
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Tên đăng nhập
											</label>
											<p className="text-sm text-gray-900">{user?.username}</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Email
											</label>
											<p className="text-sm text-gray-900">{user?.email}</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Vai trò
											</label>
											<p className="text-sm text-gray-900">
												{user?.role === 'admin'
													? 'Quản trị viên'
													: 'Người dùng'}
											</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Ngày tham gia
											</label>
											<p className="text-sm text-gray-900">
												{user?.createdAt
													? formatDate(user.createdAt)
													: 'Chưa có thông tin'}
											</p>
										</div>
									</div>
									{/* <div className="pt-4 border-t border-gray-200">
										<Button
											variant="outline"
											className="flex items-center space-x-2"
										>
											<Settings className="w-4 h-4" />
											<span>Cập nhật thông tin</span>
										</Button>
									</div> */}
								</div>
							</div>
						)}

						{/* Reading History Tab */}
						{activeTab === 'history' && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">
									Lịch sử đọc sách
								</h3>
								{readingHistory.length === 0 ? (
									<div className="text-center py-12">
										<BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500 mb-4">
											Chưa có lịch sử đọc sách
										</p>
										<Link
											href="/"
											className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
										>
											<Book className="w-4 h-4" />
											<span>Khám phá sách</span>
										</Link>
									</div>
								) : (
									<div className="space-y-4">
										{readingHistory.map((item) => (
											<Link
												key={item.id}
												href={`/books/${item.book.slug}`}
												className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
											>
												<div className="relative w-16 h-20 rounded overflow-hidden bg-gray-200">
													{item.book.cover_image ? (
														<Image
															alt={item.book.title}
															className="w-full h-full object-cover"
															fill
															src={item.book.cover_image}
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center">
															<Book className="w-6 h-6 text-gray-400" />
														</div>
													)}
												</div>
												<div className="flex-1">
													<h4 className="font-medium text-gray-900 mb-1">
														{item.book.title}
													</h4>
													<p className="text-sm text-gray-500 mb-2">
														Đọc lần cuối: {formatDate(item.last_read_at)}
													</p>
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div
															className="bg-green-600 h-2 rounded-full"
															style={{ width: `${item.progress}%` }}
														></div>
													</div>
													<p className="text-xs text-gray-500 mt-1">
														Tiến độ: {item.progress}%
													</p>
												</div>
											</Link>
										))}
									</div>
								)}
							</div>
						)}

						{/* Favorites Tab */}
						{activeTab === 'favorites' && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">
									Sách yêu thích
								</h3>
								{favoriteBooks.length === 0 ? (
									<div className="text-center py-12">
										<Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500 mb-4">Chưa có sách yêu thích</p>
										<Link
											href="/"
											className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
										>
											<Book className="w-4 h-4" />
											<span>Khám phá sách</span>
										</Link>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
										{favoriteBooks.map((item) => (
											<Link
												key={item.id}
												href={`/books/${item.book.slug}`}
												className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
											>
												<div className="relative aspect-[3/4] overflow-hidden">
													{item.book.cover_image ? (
														<Image
															alt={item.book.title}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform"
															fill
															src={item.book.cover_image}
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center bg-gray-200">
															<Book className="w-12 h-12 text-gray-400" />
														</div>
													)}
												</div>
												<div className="p-4">
													<h4 className="font-medium text-sm mb-1 line-clamp-2 text-gray-900 group-hover:text-green-600 transition-colors">
														{item.book.title}
													</h4>
													<p className="text-xs text-gray-500 mb-2 line-clamp-1">
														{item.book.authors?.[0]?.author_name ||
															'Chưa có tác giả'}
													</p>
													<p className="text-xs text-gray-400">
														Thêm vào: {formatDate(item.added_at)}
													</p>
												</div>
											</Link>
										))}
									</div>
								)}
							</div>
						)}

						{/* Borrowings Tab */}
						{activeTab === 'borrowings' && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">
									Lịch sử mượn trả sách
								</h3>
								{!currentReader ? (
									<div className="text-center py-12">
										<AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500 mb-4">
											Bạn chưa có thẻ thư viện
										</p>
										<Link
											href="/"
											className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
										>
											<Book className="w-4 h-4" />
											<span>Đăng ký thẻ thư viện</span>
										</Link>
									</div>
								) : !borrowRecordsData?.data ||
								  borrowRecordsData.data.length === 0 ? (
									<div className="text-center py-12">
										<BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500 mb-4">
											Chưa có lịch sử mượn trả sách
										</p>
										<Link
											href="/"
											className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
										>
											<Book className="w-4 h-4" />
											<span>Khám phá sách</span>
										</Link>
									</div>
								) : (
									<div className="space-y-4">
										{borrowRecordsData.data.map((record) => {
											const statusInfo = getStatusInfo(record.status);
											const StatusIcon = statusInfo.icon;

											return (
												<div
													key={record.id}
													className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
												>
													<div className="flex items-start space-x-4">
														{/* Book Cover */}
														<div className="relative w-16 h-20 rounded overflow-hidden bg-gray-200 flex-shrink-0">
															{record.physicalCopy.book.cover_image ? (
																<Image
																	alt={record.physicalCopy.book.title}
																	className="w-full h-full object-cover"
																	fill
																	src={record.physicalCopy.book.cover_image}
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center">
																	<Book className="w-6 h-6 text-gray-400" />
																</div>
															)}
														</div>

														{/* Book Info */}
														<div className="flex-1 min-w-0">
															<div className="flex items-start justify-between mb-2">
																<h4 className="font-medium text-gray-900 truncate">
																	{record.physicalCopy.book.title}
																</h4>
																<div
																	className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
																>
																	<StatusIcon className="w-3 h-3" />
																	<span>{statusInfo.label}</span>
																</div>
															</div>

															<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
																<div>
																	<span className="font-medium">
																		Ngày mượn:
																	</span>{' '}
																	{formatDate(record.borrow_date)}
																</div>
																<div>
																	<span className="font-medium">Hạn trả:</span>{' '}
																	{formatDate(record.due_date)}
																</div>
																{record.return_date && (
																	<div>
																		<span className="font-medium">
																			Ngày trả:
																		</span>{' '}
																		{formatDate(record.return_date)}
																	</div>
																)}
																<div>
																	<span className="font-medium">
																		Số lần gia hạn:
																	</span>{' '}
																	{record.renewal_count}
																</div>
															</div>

															{/* {record.borrow_notes && (
																<div className="mt-2">
																	<p className="text-sm text-gray-500">
																		<span className="font-medium">
																			Ghi chú:
																		</span>{' '}
																		{record.borrow_notes}
																	</p>
																</div>
															)} */}

															{/* {record.return_notes && (
																<div className="mt-1">
																	<p className="text-sm text-gray-500">
																		<span className="font-medium">
																			Ghi chú trả:
																		</span>{' '}
																		{record.return_notes}
																	</p>
																</div>
															)} */}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
