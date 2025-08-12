'use client';

import { Book, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center space-x-2 mb-4">
							<Book className="w-8 h-8 text-green-400" />
							<span className="text-xl font-bold">
								QLTV - Hệ thống quản lý thư viện
							</span>
						</div>
						<p className="text-gray-300 mb-4 max-w-md">
							Hệ thống quản lý thư viện số hiện đại, cung cấp kho tài liệu phong
							phú và trải nghiệm đọc sách trực tuyến tốt nhất cho người dùng.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Facebook"
							>
								<svg
									className="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Twitter"
							>
								<svg
									className="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="YouTube"
							>
								<svg
									className="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
								</svg>
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Trang chủ
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Tìm kiếm sách
								</Link>
							</li>
							<li>
								<Link
									href="/profile"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Trang cá nhân
								</Link>
							</li>
							<li>
								<Link
									href="/docs"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Tài liệu
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<MapPin className="w-5 h-5 text-green-400" />
								<span className="text-gray-300">
									123 Đường ABC, Quận XYZ, TP.HCM
								</span>
							</div>
							<div className="flex items-center space-x-3">
								<Phone className="w-5 h-5 text-green-400" />
								<span className="text-gray-300">(84) 28-1234-5678</span>
							</div>
							<div className="flex items-center space-x-3">
								<Mail className="w-5 h-5 text-green-400" />
								<span className="text-gray-300">info@qltv.edu.vn</span>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 mt-8 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 text-sm">
							© 2024 QLTV. Tất cả quyền được bảo lưu.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							<Link
								href="#"
								className="text-gray-400 hover:text-white text-sm transition-colors"
							>
								Chính sách bảo mật
							</Link>
							<Link
								href="#"
								className="text-gray-400 hover:text-white text-sm transition-colors"
							>
								Điều khoản sử dụng
							</Link>
							<Link
								href="#"
								className="text-gray-400 hover:text-white text-sm transition-colors"
							>
								Sơ đồ trang web
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
