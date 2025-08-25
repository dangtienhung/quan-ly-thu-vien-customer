import { AuthProvider } from '@/components/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Đăng nhập | Trường trung học phổ thông Hoài Đức A',
	description: 'Đăng nhập vào hệ thống thư viện trường THPT Hoài Đức A',
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen">
			<AuthProvider>{children}</AuthProvider>
		</div>
	);
}
