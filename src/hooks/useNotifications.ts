import {
	Notification,
	NotificationFilters,
	notificationApi,
} from '@/apis/notifications';
import { useEffect, useState } from 'react';

import { readersApi } from '@/apis/readers';
import { useAuth } from '@/contexts/AuthContext';

export const useNotifications = (filters?: NotificationFilters) => {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [readerId, setReaderId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});

	// Get reader ID from user ID
	useEffect(() => {
		const getReaderId = async () => {
			if (!user?.id) {
				setReaderId(null);
				return;
			}

			try {
				const reader = await readersApi.getReaderByUserId(user.id);
				setReaderId(reader.id);
			} catch (error: any) {
				// Check if it's a 404 error (reader not found)
				if (error?.response?.status === 404) {
					// User doesn't have a reader yet, this is normal
					setReaderId(null);
					setError(null);
				} else {
					// Other errors should be logged
					console.error('Error getting reader ID:', error);
					setError('Không thể tải thông tin người đọc');
					setReaderId(null);
				}
			}
		};

		getReaderId();
	}, [user?.id]);

	// Load notifications
	useEffect(() => {
		const loadNotifications = async () => {
			if (!readerId) return;

			setLoading(true);
			setError(null);
			try {
				const response = await notificationApi.getReaderNotifications(
					readerId,
					{
						page: filters?.page || 1,
						limit: filters?.limit || 10,
						status: filters?.status,
					}
				);
				setNotifications(response.data);
				setPagination({
					total: response.total,
					page: response.page,
					limit: response.limit,
					totalPages: response.totalPages,
				});
			} catch (error) {
				console.error('Error loading notifications:', error);
				setError('Không thể tải thông báo');
			} finally {
				setLoading(false);
			}
		};

		loadNotifications();
	}, [readerId, filters?.page, filters?.limit, filters?.status]);

	// Mark notification as read
	const markAsRead = async (id: string) => {
		if (!readerId) return;

		try {
			await notificationApi.markNotificationAsRead(id);
			setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === id
						? {
								...notification,
								status: 'read',
								read_at: new Date().toISOString(),
						  }
						: notification
				)
			);
		} catch (error) {
			console.error('Error marking notification as read:', error);
			setError('Không thể đánh dấu thông báo đã đọc');
		}
	};

	// Mark all notifications as read
	const markAllAsRead = async () => {
		if (!readerId) return;

		try {
			await notificationApi.markAllReaderNotificationsAsRead(readerId);
			setNotifications((prev) =>
				prev.map((notification) => ({
					...notification,
					status: 'read',
					read_at: new Date().toISOString(),
				}))
			);
		} catch (error) {
			console.error('Error marking all notifications as read:', error);
			setError('Không thể đánh dấu tất cả thông báo đã đọc');
		}
	};

	// Get unread count
	const unreadCount = notifications.filter(
		(notification) => notification.status !== 'read'
	).length;

	// Refresh notifications
	const refresh = async () => {
		if (!readerId) return;

		setLoading(true);
		setError(null);
		try {
			const response = await notificationApi.getReaderNotifications(readerId, {
				page: filters?.page || 1,
				limit: filters?.limit || 10,
				status: filters?.status,
			});
			setNotifications(response.data);
			setPagination({
				total: response.total,
				page: response.page,
				limit: response.limit,
				totalPages: response.totalPages,
			});
		} catch (error) {
			console.error('Error refreshing notifications:', error);
			setError('Không thể tải thông báo');
		} finally {
			setLoading(false);
		}
	};

	return {
		notifications,
		loading,
		error,
		unreadCount,
		markAsRead,
		markAllAsRead,
		refresh,
		pagination,
		readerId,
	};
};
