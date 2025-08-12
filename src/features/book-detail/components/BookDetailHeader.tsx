'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BookDetailHeader: React.FC = () => {
	return (
		<header className="bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex items-center justify-between h-16">
					<div className="flex items-center space-x-4">
						<Link className="flex items-center space-x-2" href="/">
							<Image
								alt="Logo of THPT Chuyên Hà Nội - Amsterdam, blue and white school emblem"
								className="w-10 h-10 object-contain"
								height={40}
								src="https://storage.googleapis.com/a1aa/image/a751ae02-0028-4039-fd60-eecd4fcc4c7c.jpg"
								width={40}
							/>
							<div className="hidden sm:block leading-tight">
								<p className="text-xs font-semibold text-gray-900 uppercase leading-none">
									Thư viện điện tử
								</p>
								<p className="text-xs font-bold text-gray-900 leading-none">
									THPT CHUYÊN HÀ NỘI - AMSTERDAM
								</p>
							</div>
						</Link>
					</div>
					<div className="hidden md:flex space-x-6 text-sm font-semibold text-gray-900">
						<Link className="hover:text-green-600" href="/">
							Trang chủ
						</Link>
						<Link className="text-green-600" href="/">
							Tài liệu
						</Link>
						<Link className="hover:text-green-600" href="/">
							Giới thiệu sách
						</Link>
						<Link className="hover:text-green-600" href="/">
							Tin tức
						</Link>
						<Link className="hover:text-green-600" href="/">
							Giới thiệu
						</Link>
						<Link className="hover:text-green-600" href="/">
							Liên kết Website
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						<button
							aria-label="Search"
							className="text-gray-600 hover:text-gray-900 focus:outline-none"
						>
							<Search className="w-5 h-5" />
						</button>
						<button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded-full">
							Đăng nhập
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default BookDetailHeader;
