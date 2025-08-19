import {
	Notification,
	notificationApi,
	NotificationFilters,
	NotificationStats,
	SendReminderRequest,
	SendReminderResponse,
} from '@/apis/notifications';
import { useEffect, useState } from 'react';

export const useAdminNotifications = (filters?: NotificationFilters) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [stats, setStats] = useState<NotificationStats | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});

	// Load all notifications
	const loadNotifications = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await notificationApi.getAllNotifications(filters);
			setNotifications(response.data);
			setPagination({
				total: response.total,
				page: response.page,
				limit: response.limit,
				totalPages: response.totalPages,
			});
		} catch (error) {
			console.error('Error loading notifications:', error);
			setError('Không thể tải danh sách thông báo');
		} finally {
			setLoading(false);
		}
	};

	// Load notification stats
	const loadStats = async () => {
		try {
			const statsData = await notificationApi.getNotificationStats();
			setStats(statsData);
		} catch (error) {
			console.error('Error loading notification stats:', error);
		}
	};

	// Send reminders
	const sendReminders = async (
		data: SendReminderRequest
	): Promise<SendReminderResponse | null> => {
		try {
			const response = await notificationApi.sendReminders(data);
			// Refresh notifications after sending
			await loadNotifications();
			await loadStats();
			return response;
		} catch (error) {
			console.error('Error sending reminders:', error);
			setError('Không thể gửi thông báo nhắc nhở');
			return null;
		}
	};

	// Delete notification
	const deleteNotification = async (notificationId: string) => {
		try {
			await notificationApi.deleteNotification(notificationId);
			await loadNotifications();
			await loadStats();
		} catch (error) {
			console.error('Error deleting notification:', error);
			setError('Không thể xóa thông báo');
		}
	};

	// Clear all notifications for a reader
	const clearAllReaderNotifications = async (readerId: string) => {
		try {
			await notificationApi.clearAllReaderNotifications(readerId);
			await loadNotifications();
			await loadStats();
		} catch (error) {
			console.error('Error clearing reader notifications:', error);
			setError('Không thể xóa tất cả thông báo của độc giả');
		}
	};

	// Get reader notification stats
	const getReaderStats = async (
		readerId: string
	): Promise<NotificationStats | null> => {
		try {
			const readerStats = await notificationApi.getReaderNotificationStats(
				readerId
			);
			return readerStats;
		} catch (error) {
			console.error('Error loading reader notification stats:', error);
			return null;
		}
	};

	// Load data on mount and when filters change
	useEffect(() => {
		loadNotifications();
		loadStats();
	}, [
		filters?.page,
		filters?.limit,
		filters?.status,
		filters?.type,
		filters?.readerId,
		filters?.startDate,
		filters?.endDate,
	]);

	return {
		notifications,
		loading,
		error,
		stats,
		pagination,
		sendReminders,
		deleteNotification,
		clearAllReaderNotifications,
		getReaderStats,
		refresh: loadNotifications,
		refreshStats: loadStats,
	};
};
