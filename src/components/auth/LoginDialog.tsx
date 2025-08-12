'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form validation schema
const loginSchema = z.object({
	username: z.string().min(1, 'Mã người dùng không được để trống'),
	password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, isLoading, error, clearError } = useLogin();

	// Initialize form with react-hook-form
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const result = await login(data);
			if (result.success) {
				onSuccess?.();
				onClose();
				// Reset form
				form.reset();
			}
		} catch (error) {
			// Error is handled by the login hook
		}
	};

	const handleClose = () => {
		clearError();
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					{/* Custom Header with Logo */}
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 -m-6 mb-6 p-6 text-white rounded-t-lg">
						<div className="flex items-center space-x-3">
							{/* Logo placeholder */}
							<div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">HA</span>
							</div>
							<div>
								<DialogTitle className="text-lg font-semibold text-white">
									THƯ VIỆN ĐIỆN TỬ
								</DialogTitle>
								<DialogDescription className="text-sm opacity-90 text-white">
									THPT CHUYÊN HÀ NỘI - AMSTERDAM
								</DialogDescription>
							</div>
						</div>
					</div>

					<DialogTitle className="text-lg font-medium text-gray-900 text-center">
						Đăng nhập thư viện điện tử
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Username field */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mã người dùng</FormLabel>
									<FormControl>
										<Input placeholder="Mã người dùng" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password field */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mật khẩu</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? 'text' : 'password'}
												placeholder="Mật khẩu"
												className="pr-10"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
											>
												{showPassword ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Error message */}
						{error && (
							<div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
								{error}
							</div>
						)}

						{/* Submit button */}
						<Button
							type="submit"
							disabled={isLoading || !form.formState.isValid}
							className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
						>
							{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</Button>
					</form>
				</Form>

				{/* Additional links */}
				<div className="text-center">
					<Button
						type="button"
						variant="link"
						className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
						onClick={() => {
							// TODO: Implement forgot password
							console.log('Forgot password clicked');
						}}
					>
						Quên mật khẩu?
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;
