'use client';

import {
	SendReminderRequest,
	SendReminderResponse,
} from '@/apis/notifications';
import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

interface SendReminderFormProps {
	onSuccess?: (response: SendReminderResponse) => void;
	onCancel?: () => void;
	onSendReminders: (
		data: SendReminderRequest
	) => Promise<SendReminderResponse | null>;
}

const SendReminderForm: React.FC<SendReminderFormProps> = ({
	onSuccess,
	onCancel,
	onSendReminders,
}) => {
	const [formData, setFormData] = useState<SendReminderRequest>({
		daysBeforeDue: 2,
		customMessage: '',
		readerId: '',
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await onSendReminders(formData);
			if (response) {
				onSuccess?.(response);
				setFormData({ daysBeforeDue: 2, customMessage: '', readerId: '' });
			}
		} catch (error) {
			console.error('Error sending reminders:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="daysBeforeDue">Số ngày trước khi đến hạn</Label>
				<Input
					id="daysBeforeDue"
					type="number"
					min="1"
					max="7"
					value={formData.daysBeforeDue}
					onChange={(e) =>
						setFormData({
							...formData,
							daysBeforeDue: parseInt(e.target.value),
						})
					}
					placeholder="2"
					required
				/>
				<p className="text-xs text-gray-500 mt-1">
					Nhập số ngày trước khi sách đến hạn trả (1-7 ngày)
				</p>
			</div>

			<div>
				<Label htmlFor="customMessage">Nội dung thông báo tùy chỉnh</Label>
				<Textarea
					id="customMessage"
					value={formData.customMessage}
					onChange={(e) =>
						setFormData({ ...formData, customMessage: e.target.value })
					}
					placeholder="Sách của bạn sắp đến hạn trả trong {days} ngày tới. Vui lòng trả sách đúng hạn."
					rows={3}
				/>
				<p className="text-xs text-gray-500 mt-1">
					Để trống để sử dụng nội dung mặc định
				</p>
			</div>

			<div>
				<Label htmlFor="readerId">ID độc giả cụ thể (tùy chọn)</Label>
				<Input
					id="readerId"
					value={formData.readerId}
					onChange={(e) =>
						setFormData({ ...formData, readerId: e.target.value })
					}
					placeholder="UUID của độc giả"
				/>
				<p className="text-xs text-gray-500 mt-1">
					Để trống để gửi cho tất cả độc giả sắp đến hạn
				</p>
			</div>

			<div className="flex space-x-2">
				<Button type="submit" disabled={loading}>
					{loading ? 'Đang gửi...' : 'Gửi thông báo nhắc nhở'}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel}>
					Hủy
				</Button>
			</div>
		</form>
	);
};

export default SendReminderForm;
