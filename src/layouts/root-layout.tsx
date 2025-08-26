import { Footer, Header } from './components';

import { AuthProvider } from '@/components/auth';
import React from 'react';

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<AuthProvider>
			<div className="bg-white text-gray-900 min-h-screen flex flex-col">
				<Header />
				<main className="flex-1">{children}</main>
				<Footer />
			</div>
		</AuthProvider>
	);
};

export default RootLayout;
