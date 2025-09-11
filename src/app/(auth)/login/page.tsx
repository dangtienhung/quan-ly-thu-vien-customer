'use client';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema - giống với LoginDialog
const loginSchema = z.object({
	username: z.string().min(1, 'Mã người dùng không được để trống'),
	password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const { login, isLoading, error } = useLogin();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const result = await login(data);
			if (result.success) {
				// Kiểm tra xem có URL redirect được lưu không
				const redirectUrl = localStorage.getItem('redirectAfterLogin');
				if (redirectUrl) {
					// Xóa URL redirect khỏi localStorage
					localStorage.removeItem('redirectAfterLogin');
					// Redirect về trang ban đầu
					router.push(redirectUrl);
				} else {
					// Nếu không có URL redirect, về trang chủ
					router.push('/');
					setTimeout(() => {
						window.location.href = '/';
					}, 1000);
				}
				// Reset form
				form.reset();
			}
		} catch (error) {
			// Error is handled by the login hook
		}
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative"
			style={{
				backgroundImage: `url('/background.jpg')`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<div className="absolute inset-0 bg-black opacity-60"></div>
			<div className="w-full max-w-md z-10">
				<div className="bg-white rounded-lg shadow-xl p-8">
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<Image
								// src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/537695210_1304240211495265_2418224581590370134_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=s2YVIhCZtSEQ7kNvwF2V05z&_nc_oc=AdmTeXWyuOiTxuQTzxwXlQcU-M6sIcHWgkbvWEmUgit6uGB4sNQZXZaFfVPMOOZdW04&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=o8UOvFxQybsrwwYbR7UjjA&oh=00_AfVLGvH1B12OlfzIL21mqS4sbh6CIUYlFZY00E5Mrt5Cjw&oe=68AF11CD"
								src="/logo.jpg"
								alt="Logo trường THPT Hoài Đức A"
								width={80}
								height={80}
								className="rounded-full object-cover"
							/>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
						<p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
					</div>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						autoComplete="off"
					>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Tài khoản đăng nhập
							</label>
							<Input
								id="username"
								placeholder="Tài khoản đăng nhập"
								className="h-12 rounded"
								{...form.register('username')}
							/>
							{form.formState.errors.username && (
								<p className="mt-1 text-sm text-red-600">
									{form.formState.errors.username.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Mật khẩu
							</label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Mật khẩu"
									className="h-12 rounded pr-10"
									{...form.register('password')}
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
							{form.formState.errors.password && (
								<p className="mt-1 text-sm text-red-600">
									{form.formState.errors.password.message}
								</p>
							)}
						</div>

						{/* Error message - giống với LoginDialog */}
						{error && (
							<div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
								{error}
							</div>
						)}

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded h-12"
						>
							{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</Button>
					</form>

					{/* Additional links - giống với LoginDialog */}
					<div className="text-center mt-4">
						<Link
							href="/forgot-password"
							className="text-sm text-blue-600 hover:text-blue-800 underline"
						>
							Quên mật khẩu?
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
