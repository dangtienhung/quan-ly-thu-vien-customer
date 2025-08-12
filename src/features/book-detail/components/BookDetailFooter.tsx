import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BookDetailFooter: React.FC = () => {
	return (
		<footer className="bg-[#1f2d3d] text-gray-300 mt-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
				<div className="col-span-2 space-y-3">
					<Image
						alt="Logo of THPT Chuyên Hà Nội - Amsterdam, blue and white school emblem"
						className="w-10 h-10 object-contain"
						height={40}
						src="https://storage.googleapis.com/a1aa/image/a751ae02-0028-4039-fd60-eecd4fcc4c7c.jpg"
						width={40}
					/>
					<p className="text-xs font-semibold uppercase leading-none">
						Thư viện điện tử
					</p>
					<p className="text-xs font-bold uppercase leading-none">
						THPT CHUYÊN HÀ NỘI - AMSTERDAM
					</p>
					<p className="text-[10px]">Email: c23hanoi-ams@hanoiedu.vn</p>
					<p className="text-[10px]">Điện thoại: 0916150585</p>
					<p className="text-[10px]">
						Website: chuyenhanoiamsterdam.thuvien.edu.vn
					</p>
				</div>
				<div className="space-y-2 text-[10px]">
					<h3 className="font-semibold text-gray-200 mb-2">Tài liệu</h3>
					<ul className="space-y-1">
						<li>
							<Link className="hover:text-white" href="/">
								Sách điện tử
							</Link>
						</li>
						<li>
							<Link className="hover:text-white" href="/">
								Sách nói
							</Link>
						</li>
						<li>
							<Link className="hover:text-white" href="/">
								Bài giảng điện tử
							</Link>
						</li>
						<li>
							<Link className="hover:text-white" href="/">
								Album
							</Link>
						</li>
						<li>
							<Link className="hover:text-white" href="/">
								Video
							</Link>
						</li>
					</ul>
				</div>
				<div className="space-y-2 text-[10px]">
					<h3 className="font-semibold text-gray-200 mb-2">Tin tức</h3>
					<ul className="space-y-1">
						<li>
							<Link className="hover:text-white" href="/">
								Giới thiệu
							</Link>
						</li>
						<li>
							<Link className="hover:text-white" href="/">
								Tin nhà trường
							</Link>
						</li>
					</ul>
				</div>
				<div className="text-[10px] flex flex-col justify-center items-end space-y-1">
					<p>1 lượt online</p>
					<p>45.274 tổng lượt truy cập</p>
				</div>
			</div>
			<div className="bg-[#172433] text-gray-400 text-[9px] text-center py-2">
				Copyright © 2024 Quảng Ích Corp. All rights reserved.
			</div>
		</footer>
	);
};

export default BookDetailFooter;
