'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAuthenticated } from '@/hooks';
import {
	Book,
	BookOpen,
	Clock,
	Heart,
	LogOut,
	Settings,
	User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
	const { user, logout } = useAuth();
	const { isAuthenticated } = useIsAuthenticated();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<
		'profile' | 'history' | 'favorites'
	>('profile');
	const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
	const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBook[]>([]);

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
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
								<button
									onClick={() => setActiveTab('favorites')}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										activeTab === 'favorites'
											? 'bg-green-100 text-green-700'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									<Heart className="w-4 h-4" />
									<span>Sách yêu thích</span>
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
									<div className="pt-4 border-t border-gray-200">
										<Button
											variant="outline"
											className="flex items-center space-x-2"
										>
											<Settings className="w-4 h-4" />
											<span>Cập nhật thông tin</span>
										</Button>
									</div>
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
