'use client';

import NotificationDropdown from '@/components/ui/notification-dropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginDialog, useNotifications } from '@/hooks';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

const Header: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuth();
	const { openLoginDialog } = useLoginDialog();
	const {
		notifications,
		markAsRead,
		markAllAsRead,
		unreadCount,
		loading: notificationsLoading,
		error: notificationsError,
		refresh: refreshNotifications,
	} = useNotifications();
	console.log('🚀 ~ Header ~ notifications:', notifications);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

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

	return (
		<header className="border-b border-gray-300">
			<div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-2 text-[10px] sm:text-xs">
				<div className="flex items-center space-x-2">
					<Image
						alt="Logo trường THPT Chuyên Hà Nội - Amsterdam"
						className="w-8 h-8 object-contain"
						height={32}
						src="https://storage.googleapis.com/a1aa/image/0583a14f-d17e-4985-f93c-dd1e62b6abfe.jpg"
						width={32}
						priority
					/>
					<div className="font-semibold text-[10px] sm:text-xs leading-none">
						THPT CHUYÊN HÀ NỘI - AMSTERDAM
					</div>
				</div>

				<nav className="hidden sm:flex space-x-4 text-[10px] sm:text-xs font-semibold">
					<Link className="text-[#00B14F] hover:underline" href="/">
						Trang chủ
					</Link>
					<Link className="hover:underline" href="#">
						Tài liệu
					</Link>
					<Link className="hover:underline" href="#">
						Giáo trình sách
					</Link>
					<Link className="hover:underline" href="#">
						Tin tức
					</Link>
					<Link className="hover:underline" href="#">
						Giới thiệu
					</Link>
					<Link className="hover:underline" href="#">
						Liên hệ Website
					</Link>
				</nav>

				<div className="flex items-center space-x-3">
					<button
						aria-label="Search"
						className="text-gray-600 hover:text-gray-900"
					>
						<i className="fas fa-search"></i>
					</button>

					{isAuthenticated && (
						<>
							{notificationsError && (
								<div className="text-xs text-red-500 mr-2">
									{notificationsError}
								</div>
							)}
							<NotificationDropdown
								notifications={notifications}
								onMarkAsRead={markAsRead}
								onMarkAllAsRead={markAllAsRead}
							/>
						</>
					)}

					{isAuthenticated ? (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors"
							>
								<div className="w-6 h-6 bg-[#00B14F] rounded-full flex items-center justify-center">
									<User className="w-3 h-3 text-white" />
								</div>
								<span className="font-medium text-gray-700 max-w-[100px] truncate">
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
							onClick={openLoginDialog}
							className="bg-[#00B14F] text-white text-[10px] sm:text-xs font-semibold rounded-full px-4 py-1 hover:bg-[#009945] transition-colors"
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
