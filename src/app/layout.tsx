import './globals.css';

import { AuthGuard } from '@/components/auth/auth-guard';
import QueryClientProviders from '@/components/providers/query-client-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-poppins',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Trường Trung học Phổ thông Hoài Đức A',
	description: 'Trường Trung học Phổ thông Hoài Đức A',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi" suppressHydrationWarning>
			<body
				className={`${poppins.variable} antialiased`}
				suppressHydrationWarning
			>
				<QueryClientProviders>
					<AuthGuard>{children}</AuthGuard>
					<Toaster />
				</QueryClientProviders>
			</body>
		</html>
	);
}
