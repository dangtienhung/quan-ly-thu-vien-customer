'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useReaderTypes } from '@/hooks/reader-types';
import { useCreateReader } from '@/hooks/readers';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

interface RegisterLibraryCardDialogProps {
	children: React.ReactNode;
	onSuccess?: () => void;
}

// Zod schema for form validation
const registerFormSchema = z.object({
	fullName: z
		.string()
		.min(1, 'Họ tên là bắt buộc')
		.min(2, 'Họ tên phải có ít nhất 2 ký tự'),
	dob: z.string().min(1, 'Ngày sinh là bắt buộc'),
	gender: z.enum(['male', 'female', 'other']),
	address: z.string().min(1, 'Địa chỉ là bắt buộc'),
	phone: z
		.string()
		.min(1, 'Số điện thoại là bắt buộc')
		.regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
	cardNumber: z.string().min(1, 'Số thẻ là bắt buộc'),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export const RegisterLibraryCardDialog = ({
	children,
	onSuccess,
}: RegisterLibraryCardDialogProps) => {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch reader types to get student type
	const { data: readerTypesData } = useReaderTypes();
	const studentType = readerTypesData?.data?.find(
		(type) => type.typeName === 'student'
	);

	// Create reader mutation
	const createReader = useCreateReader();

	// Form state
	const [formData, setFormData] = useState<RegisterFormData>({
		fullName: user?.username || '',
		dob: '',
		gender: 'male',
		address: '',
		phone: '',
		cardNumber: user?.userCode || user?.username || '', // Use userCode as default, fallback to username
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Helper function to get error message for a field
	const getFieldError = (
		fieldName: keyof RegisterFormData
	): string | undefined => {
		return errors[fieldName];
	};

	const validateForm = (): boolean => {
		const result = registerFormSchema.safeParse(formData);

		if (result.success) {
			setErrors({});
			return true;
		} else {
			const newErrors: Record<string, string> = {};
			result.error.issues.forEach((issue: z.ZodIssue) => {
				const fieldName = issue.path[0] as string;
				newErrors[fieldName] = issue.message;
			});
			setErrors(newErrors);
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		if (!user || !studentType) {
			toast.error('Không thể đăng ký thẻ thư viện');
			return;
		}

		setIsSubmitting(true);

		try {
			await createReader.mutateAsync({
				fullName: formData.fullName,
				dob: formData.dob,
				gender: formData.gender,
				address: formData.address,
				phone: formData.phone,
				userId: user.id,
				readerTypeId: studentType.id,
				cardNumber: formData.cardNumber,
				cardIssueDate: '1969-01-01', // Default date for inactive card
				cardExpiryDate: '1969-12-31', // Default date for inactive card (after issue date)
			});

			toast.success('Đăng ký thẻ thư viện thành công! Vui lòng chờ phê duyệt.');
			setOpen(false);
			setFormData({
				fullName: user?.username || '',
				dob: '',
				gender: 'male',
				address: '',
				phone: '',
				cardNumber: user?.userCode || user?.username || '',
			});
			setErrors({});
			onSuccess?.(); // Call onSuccess callback if provided
		} catch (error) {
			console.error('Error creating reader:', error);
			toast.error('Có lỗi xảy ra khi đăng ký thẻ thư viện');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CreditCard className="w-5 h-5" />
						Đăng ký thẻ thư viện
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Info Alert */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
							<div className="text-sm text-blue-800">
								<p className="font-medium mb-1">Thông tin quan trọng:</p>
								<ul className="space-y-1">
									<li>• Thẻ sẽ được tạo với trạng thái không hoạt động</li>
									<li>
										• Loại độc giả mặc định: <strong>Student</strong>
									</li>
									<li>• Số thẻ sẽ là mã Học Sinh của bạn</li>
									<li>• Cần liên hệ thư viện để kích hoạt thẻ</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Registration Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Full Name */}
						<div className="space-y-2">
							<Label htmlFor="fullName">Họ tên</Label>
							<Input
								id="fullName"
								value={formData.fullName}
								onChange={(e) =>
									setFormData({ ...formData, fullName: e.target.value })
								}
								placeholder="Nhập họ tên đầy đủ"
								className="w-full"
								disabled
							/>
							{getFieldError('fullName') && (
								<p className="text-sm text-red-600">
									{getFieldError('fullName')}
								</p>
							)}
						</div>

						{/* Date of Birth */}
						<div className="space-y-2">
							<Label htmlFor="dob">Ngày sinh</Label>
							<Input
								id="dob"
								type="date"
								value={formData.dob}
								onChange={(e) =>
									setFormData({ ...formData, dob: e.target.value })
								}
								className="w-full"
							/>
							{getFieldError('dob') && (
								<p className="text-sm text-red-600">{getFieldError('dob')}</p>
							)}
						</div>

						{/* Gender */}
						<div className="space-y-2">
							<Label htmlFor="gender">Giới tính</Label>
							<select
								id="gender"
								value={formData.gender}
								onChange={(e) =>
									setFormData({
										...formData,
										gender: e.target.value as 'male' | 'female' | 'other',
									})
								}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="male">Nam</option>
								<option value="female">Nữ</option>
								<option value="other">Khác</option>
							</select>
						</div>

						{/* Address */}
						<div className="space-y-2">
							<Label htmlFor="address">Địa chỉ</Label>
							<Input
								id="address"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								placeholder="Nhập địa chỉ đầy đủ"
								className="w-full"
							/>
							{getFieldError('address') && (
								<p className="text-sm text-red-600">
									{getFieldError('address')}
								</p>
							)}
						</div>

						{/* Phone */}
						<div className="space-y-2">
							<Label htmlFor="phone">Số điện thoại</Label>
							<Input
								id="phone"
								value={formData.phone}
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								placeholder="Nhập số điện thoại"
								className="w-full"
							/>
							{getFieldError('phone') && (
								<p className="text-sm text-red-600">{getFieldError('phone')}</p>
							)}
						</div>

						{/* Card Number */}
						<div className="space-y-2">
							<Label htmlFor="cardNumber">Số thẻ thư viện (Mã Học Sinh)</Label>
							<Input
								id="cardNumber"
								value={formData.cardNumber}
								onChange={(e) =>
									setFormData({ ...formData, cardNumber: e.target.value })
								}
								placeholder="Nhập mã Học Sinh"
								className="w-full"
								disabled
							/>
							{getFieldError('cardNumber') && (
								<p className="text-sm text-red-600">
									{getFieldError('cardNumber')}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isSubmitting}
							>
								Hủy
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-blue-600 hover:bg-blue-700"
							>
								{isSubmitting ? 'Đang đăng ký...' : 'Đăng ký thẻ'}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};
