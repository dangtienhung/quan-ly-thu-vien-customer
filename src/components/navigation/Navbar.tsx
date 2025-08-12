'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAuthenticated, useLoginDialog } from '@/hooks';
import { Book, Heart, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
	const { user, logout } = useAuth();
	const { isAuthenticated } = useIsAuthenticated();
	const { openLoginDialog } = useLoginDialog();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	const handleLogout = () => {
		logout();
		router.push('/');
	};

	return (
		<nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Book className="w-8 h-8 text-green-600" />
						<span className="text-xl font-bold text-gray-900">QLTV</span>
					</Link>

					{/* Search Bar */}
					<div className="flex-1 max-w-2xl mx-8">
						<form onSubmit={handleSearch} className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<Input
								type="text"
								placeholder="Tìm kiếm sách, tác giả, ISBN..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-2 w-full"
							/>
						</form>
					</div>

					{/* Navigation Links */}
					<div className="flex items-center space-x-4">
						{/* Quick Links */}
						<div className="hidden md:flex items-center space-x-6">
							<Link
								href="/"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Trang chủ
							</Link>
							<Link
								href="/search"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Khám phá
							</Link>
						</div>

						{/* User Menu */}
						{isAuthenticated ? (
							<div className="flex items-center space-x-3">
								<Link
									href="/profile"
									className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
								>
									<Heart className="w-5 h-5" />
									<span className="hidden sm:inline">Yêu thích</span>
								</Link>
								<div className="relative group">
									<button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
										<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
											<User className="w-4 h-4 text-green-600" />
										</div>
										<span className="hidden sm:inline">{user?.username}</span>
									</button>
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
										<div className="py-2">
											<Link
												href="/profile"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											>
												Trang cá nhân
											</Link>
											<button
												onClick={handleLogout}
												className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
											>
												Đăng xuất
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<Button
								onClick={openLoginDialog}
								className="bg-green-600 hover:bg-green-700"
							>
								Đăng nhập
							</Button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
