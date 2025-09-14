'use client';

import { useEffect, useState } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export function RouteDebug() {
	const { token, user, isAuthenticated } = useAuthStore();
	const router = useRouter();
	const [currentPath, setCurrentPath] = useState('');
	const [redirectHistory, setRedirectHistory] = useState<string[]>([]);

	useEffect(() => {
		setCurrentPath(window.location.pathname);
	}, []);

	useEffect(() => {
		const handleRouteChange = () => {
			const newPath = window.location.pathname;
			setCurrentPath(newPath);
			setRedirectHistory((prev) => [
				...prev,
				`${new Date().toLocaleTimeString()}: ${newPath}`,
			]);
		};

		// Listen for route changes
		window.addEventListener('popstate', handleRouteChange);

		return () => {
			window.removeEventListener('popstate', handleRouteChange);
		};
	}, []);

	// Log all state changes
	useEffect(() => {
		console.log('🔍 Route Debug - State Change:', {
			timestamp: new Date().toLocaleTimeString(),
			pathname: currentPath,
			isAuthenticated,
			hasToken: !!token,
			hasUser: !!user,
			tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
		});
	}, [currentPath, isAuthenticated, token, user]);

	if (process.env.NODE_ENV !== 'development') {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50 max-h-96 overflow-y-auto">
			<h3 className="font-bold mb-2">🔍 Route Debug</h3>
			<div className="space-y-1 mb-4">
				<div>
					<strong>Current Path:</strong> {currentPath}
				</div>
				<div>
					<strong>isAuthenticated:</strong> {isAuthenticated ? '✅' : '❌'}
				</div>
				<div>
					<strong>hasToken:</strong> {token ? '✅' : '❌'}
				</div>
				<div>
					<strong>hasUser:</strong> {user ? '✅' : '❌'}
				</div>
				<div>
					<strong>token:</strong>{' '}
					{token ? `${token.substring(0, 20)}...` : 'null'}
				</div>
			</div>

			<div>
				<strong>Redirect History:</strong>
				<div className="max-h-32 overflow-y-auto text-xs">
					{redirectHistory.map((entry, index) => (
						<div key={index} className="text-gray-300">
							{entry}
						</div>
					))}
				</div>
			</div>

			<button
				onClick={() => setRedirectHistory([])}
				className="mt-2 px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs"
			>
				Clear History
			</button>
		</div>
	);
}
