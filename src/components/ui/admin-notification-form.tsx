'use client';

import {
	CreateNotificationRequest,
	notificationApi,
} from '@/apis/notifications';
import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

interface AdminNotificationFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
}

const AdminNotificationForm: React.FC<AdminNotificationFormProps> = ({
	onSuccess,
	onCancel,
}) => {
	const [formData, setFormData] = useState<CreateNotificationRequest>({
		title: '',
		message: '',
		recipientIds: [],
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await notificationApi.createNotification(formData);
			setFormData({ title: '', message: '', recipientIds: [] });
			onSuccess?.();
		} catch (error) {
			console.error('Error creating notification:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="title">Tiêu đề thông báo</Label>
				<Input
					id="title"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					placeholder="Nhập tiêu đề thông báo"
					required
				/>
			</div>

			<div>
				<Label htmlFor="message">Nội dung thông báo</Label>
				<Textarea
					id="message"
					value={formData.message}
					onChange={(e) =>
						setFormData({ ...formData, message: e.target.value })
					}
					placeholder="Nhập nội dung thông báo"
					rows={4}
					required
				/>
			</div>

			<div className="flex space-x-2">
				<Button type="submit" disabled={loading}>
					{loading ? 'Đang gửi...' : 'Gửi thông báo'}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel}>
					Hủy
				</Button>
			</div>
		</form>
	);
};

export default AdminNotificationForm;
