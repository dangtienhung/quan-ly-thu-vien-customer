'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLoginDialog } from '@/hooks';
import React from 'react';

const AuthTest: React.FC = () => {
	const { user, isAuthenticated, isLoading, logout } = useAuth();
	const { openLoginDialog } = useLoginDialog();

	if (isLoading) {
		return (
			<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<p className="text-blue-600">Đang tải thông tin đăng nhập...</p>
			</div>
		);
	}

	return (
		<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
			<h3 className="text-lg font-semibold mb-4">Auth Test Component</h3>

			{isAuthenticated ? (
				<div className="space-y-3">
					<div className="bg-green-50 border border-green-200 rounded p-3">
						<p className="text-green-800 font-medium">✅ Đã đăng nhập</p>
					</div>

					<div className="bg-white border border-gray-200 rounded p-3">
						<h4 className="font-medium mb-2">Thông tin người dùng:</h4>
						<div className="space-y-1 text-sm">
							<p>
								<strong>Username:</strong> {user?.username}
							</p>
							<p>
								<strong>Email:</strong> {user?.email}
							</p>
							<p>
								<strong>Role:</strong> {user?.role}
							</p>
							<p>
								<strong>Status:</strong> {user?.accountStatus}
							</p>
							<p>
								<strong>ID:</strong> {user?.id}
							</p>
						</div>
					</div>

					<button
						onClick={logout}
						className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
					>
						Đăng xuất
					</button>
				</div>
			) : (
				<div className="space-y-3">
					<div className="bg-yellow-50 border border-yellow-200 rounded p-3">
						<p className="text-yellow-800 font-medium">❌ Chưa đăng nhập</p>
					</div>

					<button
						onClick={openLoginDialog}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
					>
						Đăng nhập
					</button>
				</div>
			)}
		</div>
	);
};

export default AuthTest;
