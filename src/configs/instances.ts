import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor
instance.interceptors.request.use(
	(config) => {
		// Thêm token vào header nếu cần
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(new Error(error?.message || 'Request error'))
);

// Response interceptor
instance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Xử lý lỗi toàn cục (ví dụ: thông báo, redirect, ...)
		console.log('🚀 ~ error.response:', error.response);
		if (error.response && error.response.status === 401) {
			// Xóa accessToken khỏi localStorage
			// localStorage.removeItem('accessToken');
			// Chuyển hướng về trang login
			// window.location.href = '/login';
		}
		return Promise.reject(new Error(error?.message || 'Response error'));
	}
);

export default instance;
