import RootLayoutShell from '@/layouts/root-layout';
import React from 'react';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <RootLayoutShell>{children}</RootLayoutShell>;
}
