'use client';

import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import NotificationDropdown from '@/components/ui/notification-dropdown';
import { useNotifications } from '@/hooks';
import { useAuthStore } from '@/stores/auth-store';
import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();

	const {
		notifications,
		markAsRead,
		markAllAsRead,
		unreadCount,
		loading: notificationsLoading,
		error: notificationsError,
		refresh: refreshNotifications,
		readerId,
	} = useNotifications();

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Prevent hydration mismatch
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		logout();
		setIsDropdownOpen(false);
	};

	// Don't render until mounted to prevent hydration mismatch
	if (!isMounted) {
		return (
			<header className="border-b border-gray-300">
				<div className="max-w-[1280px] mx-auto flex items-center justify-between py-2 px-4">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
					</div>
					<div className="hidden sm:flex space-x-4">
						<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
					</div>
					<div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
				</div>
			</header>
		);
	}

	return (
		<header className="border-b border-gray-300">
			<div className="max-w-[1280px] mx-auto flex items-center justify-between py-2 px-4">
				<Link href="/">
					<div className="flex items-center space-x-2">
						<Image
							alt="Logo trường THPT Hoài Đức A"
							className="w-8 h-8 object-contain"
							height={32}
							src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/537695210_1304240211495265_2418224581590370134_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=s2YVIhCZtSEQ7kNvwF2V05z&_nc_oc=AdmTeXWyuOiTxuQTzxwXlQcU-M6sIcHWgkbvWEmUgit6uGB4sNQZXZaFfVPMOOZdW04&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=o8UOvFxQybsrwwYbR7UjjA&oh=00_AfVLGvH1B12OlfzIL21mqS4sbh6CIUYlFZY00E5Mrt5Cjw&oe=68AF11CD"
							width={32}
							priority
						/>
						<div className="font-semibold text-base leading-none">
							THPT HOÀI ĐỨC A
						</div>
					</div>
				</Link>

				<nav className="hidden sm:flex space-x-6 text-base font-semibold">
					<Link
						className={`transition-colors ${
							pathname === '/'
								? 'text-[#00B14F]'
								: 'text-gray-700 hover:text-[#00B14F]'
						}`}
						href="/"
					>
						Trang chủ
					</Link>
					<Link
						className={`transition-colors ${
							pathname.startsWith('/books')
								? 'text-[#00B14F]'
								: 'text-gray-700 hover:text-[#00B14F]'
						}`}
						href="/books"
					>
						Tài liệu
					</Link>

					<Link
						className={`transition-colors ${
							pathname === '/news'
								? 'text-[#00B14F]'
								: 'text-gray-700 hover:text-[#00B14F]'
						}`}
						href="/news"
					>
						Tin tức
					</Link>
					<Link
						className={`transition-colors ${
							pathname === '/about'
								? 'text-[#00B14F]'
								: 'text-gray-700 hover:text-[#00B14F]'
						}`}
						href="/about"
					>
						Giới thiệu
					</Link>
				</nav>

				<div className="flex items-center space-x-3">
					<button
						aria-label="Search"
						className="text-gray-600 hover:text-gray-900"
					>
						<i className="fas fa-search"></i>
					</button>

					{isAuthenticated && readerId && (
						<NotificationDropdown
							notifications={notifications}
							onMarkAsRead={markAsRead}
							onMarkAllAsRead={markAllAsRead}
						/>
					)}

					{isAuthenticated ? (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors"
							>
								<div className="w-6 h-6 bg-[#00B14F] rounded-full flex items-center justify-center">
									<User className="w-3 h-3 text-white" />
								</div>
								<span className="font-medium text-sm text-gray-700 truncate">
									{user?.username || 'User'}
								</span>
								<ChevronDown
									className={`w-3 h-3 text-gray-500 transition-transform ${
										isDropdownOpen ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{isDropdownOpen && (
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<div className="px-4 py-2 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900">
											{user?.username}
										</p>
										<p className="text-xs text-gray-500">{user?.email}</p>
									</div>

									<Link
										href="/profile"
										className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Settings className="w-4 h-4" />
										<span>Thông tin người dùng</span>
									</Link>

									<button
										onClick={handleLogout}
										className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
									>
										<LogOut className="w-4 h-4" />
										<span>Đăng xuất</span>
									</button>
								</div>
							)}
						</div>
					) : (
						<button
							onClick={() => {
								router.push('/login');
							}}
							className="bg-[#00B14F] text-white cursor-pointer text-base font-semibold rounded-full px-4 py-1 hover:bg-[#009945] transition-colors"
						>
							Đăng nhập
						</button>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
