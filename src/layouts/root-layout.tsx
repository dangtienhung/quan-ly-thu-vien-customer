import { AuthProvider } from '@/components/auth';
import React from 'react';
import { Footer, Header } from './components';

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<AuthProvider>
			<div className="bg-white text-gray-900">
				<Header />
				<main>{children}</main>
				<Footer />
			</div>
		</AuthProvider>
	);
};

export default RootLayout;
