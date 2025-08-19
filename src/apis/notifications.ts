import instance from '@/configs/instances';

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'due_date_reminder' | 'overdue_notice' | 'general';
	status: 'pending' | 'sent' | 'read' | 'failed';
	metadata?: {
		bookTitle?: string;
		dueDate?: string;
		daysUntilDue?: number;
		[s: string]: any;
	};
	read_at?: string;
	sent_at?: string;
	error_message?: string;
	created_at: string;
	updated_at: string;
}

export interface NotificationResponse {
	data: Notification[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateNotificationRequest {
	title: string;
	message: string;
	recipientIds?: string[];
}

export interface SendReminderRequest {
	daysBeforeDue?: number;
	customMessage?: string;
	readerId?: string;
}

export interface SendReminderResponse {
	success: boolean;
	message: string;
	totalReaders: number;
	notificationsSent: number;
	details: Array<{
		readerId: string;
		readerName: string;
		bookTitle: string;
		dueDate: string;
		daysUntilDue: number;
	}>;
}

export interface NotificationStats {
	total: number;
	byStatus: Array<{ status: string; count: number }>;
	byType: Array<{ type: string; count: number }>;
	byDate: Array<{ date: string; count: number }>;
}

export interface NotificationFilters {
	page?: number;
	limit?: number;
	status?: 'pending' | 'sent' | 'read' | 'failed';
	type?: 'due_date_reminder' | 'overdue_notice' | 'general';
	readerId?: string;
	startDate?: string;
	endDate?: string;
}

export const notificationApi = {
	// ===== ADMIN ENDPOINTS =====

	// Admin gửi thông báo nhắc nhở
	sendReminders: async (
		data: SendReminderRequest
	): Promise<SendReminderResponse> => {
		const response = await instance.post(
			'/borrow-records/send-reminders',
			data
		);
		return response.data;
	},

	// Admin lấy danh sách tất cả thông báo
	getAllNotifications: async (
		filters?: NotificationFilters
	): Promise<NotificationResponse> => {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					params.append(key, value.toString());
				}
			});
		}
		const response = await instance.get(`/notifications?${params.toString()}`);
		return response.data;
	},

	// Admin lấy thống kê thông báo
	getNotificationStats: async (): Promise<NotificationStats> => {
		const response = await instance.get('/notifications/stats');
		return response.data;
	},

	// Admin lấy thống kê thông báo của độc giả
	getReaderNotificationStats: async (
		readerId: string
	): Promise<NotificationStats> => {
		const response = await instance.get(
			`/notifications/reader/${readerId}/stats`
		);
		return response.data;
	},

	// Admin xóa thông báo
	deleteNotification: async (notificationId: string): Promise<void> => {
		await instance.delete(`/notifications/${notificationId}`);
	},

	// Admin xóa tất cả thông báo của độc giả
	clearAllReaderNotifications: async (readerId: string): Promise<void> => {
		await instance.delete(`/notifications/reader/${readerId}/clear-all`);
	},

	// ===== READER ENDPOINTS =====

	// Độc giả xem thông báo của mình
	getReaderNotifications: async (
		readerId: string,
		filters?: Pick<NotificationFilters, 'page' | 'limit' | 'status'>
	): Promise<NotificationResponse> => {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					params.append(key, value.toString());
				}
			});
		}
		const response = await instance.get(
			`/notifications/reader/${readerId}?${params.toString()}`
		);
		return response.data;
	},

	// Độc giả xem số thông báo chưa đọc
	getReaderUnreadCount: async (
		readerId: string
	): Promise<{ unreadCount: number }> => {
		const response = await instance.get(
			`/notifications/reader/${readerId}/unread-count`
		);
		return response.data;
	},

	// Độc giả đánh dấu thông báo đã đọc
	markNotificationAsRead: async (notificationId: string): Promise<void> => {
		await instance.patch(`/notifications/${notificationId}/read`);
	},

	// Độc giả đánh dấu tất cả thông báo đã đọc
	markAllReaderNotificationsAsRead: async (readerId: string): Promise<void> => {
		await instance.patch(`/notifications/reader/${readerId}/read-all`);
	},
};
