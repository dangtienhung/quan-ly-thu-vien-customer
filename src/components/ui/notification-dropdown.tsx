'use client';

import { Notification } from '@/apis/notifications';
import { Bell, Check } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface NotificationDropdownProps {
	notifications?: Notification[];
	onMarkAsRead?: (id: string) => void;
	onMarkAllAsRead?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	notifications = [],
	onMarkAsRead,
	onMarkAllAsRead,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const unreadCount = notifications.filter(
		(notification) => notification.status !== 'read'
	).length;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) {
			return 'Vừa xong';
		} else if (diffInHours < 24) {
			return `${diffInHours} giờ trước`;
		} else {
			const diffInDays = Math.floor(diffInHours / 24);
			return `${diffInDays} ngày trước`;
		}
	};

	const handleMarkAsRead = (id: string) => {
		onMarkAsRead?.(id);
	};

	const handleMarkAllAsRead = () => {
		onMarkAllAsRead?.();
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
				aria-label="Thông báo"
			>
				<Bell className="w-5 h-5" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
					<div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
						<h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
						{unreadCount > 0 && (
							<button
								onClick={handleMarkAllAsRead}
								className="text-xs text-blue-600 hover:text-blue-800"
							>
								Đánh dấu tất cả đã đọc
							</button>
						)}
					</div>

					{notifications.length === 0 ? (
						<div className="px-4 py-8 text-center text-gray-500">
							<Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
							<p className="text-sm">Không có thông báo mới</p>
						</div>
					) : (
						<div className="space-y-1">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
										notification.status !== 'read' ? 'bg-blue-50' : ''
									}`}
									onClick={() => handleMarkAsRead(notification.id)}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2">
												<h4 className="text-sm font-medium text-gray-900 truncate">
													{notification.title}
												</h4>
												{notification.status !== 'read' && (
													<span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
												)}
											</div>
											<p className="text-xs text-gray-600 mt-1 line-clamp-2">
												{notification.message}
											</p>
											<div className="flex items-center justify-between mt-2">
												<span className="text-xs text-gray-500">
													{notification.type === 'due_date_reminder'
														? 'Nhắc nhở trả sách'
														: notification.type === 'overdue_notice'
														? 'Thông báo quá hạn'
														: 'Thông báo chung'}
												</span>
												<span className="text-xs text-gray-400">
													{formatDate(notification.created_at)}
												</span>
											</div>
											{notification.metadata?.bookTitle && (
												<div className="mt-1">
													<span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
														Sách: {notification.metadata.bookTitle}
													</span>
												</div>
											)}
										</div>
										{notification.status !== 'read' && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleMarkAsRead(notification.id);
												}}
												className="ml-2 p-1 text-gray-400 hover:text-gray-600"
											>
												<Check className="w-3 h-3" />
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}

					{notifications.length > 0 && (
						<div className="px-4 py-2 border-t border-gray-100">
							<button
								onClick={() => setIsOpen(false)}
								className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
							>
								Xem tất cả thông báo
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
