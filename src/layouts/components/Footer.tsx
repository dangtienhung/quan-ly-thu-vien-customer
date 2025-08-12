import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="bg-[#1f2d3d] text-gray-300 text-xs sm:text-sm">
			<div className="max-w-[1280px] mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<Image
							alt="Logo trường THPT Chuyên Hà Nội - Amsterdam"
							className="w-8 h-8 object-contain"
							height={32}
							src="https://storage.googleapis.com/a1aa/image/0583a14f-d17e-4985-f93c-dd1e62b6abfe.jpg"
							width={32}
							loading="lazy"
						/>
						<div className="font-semibold text-white text-[10px] sm:text-xs leading-none">
							THPT CHUYÊN HÀ NỘI - AMSTERDAM
						</div>
					</div>
					<div className="text-[9px] sm:text-xs leading-tight">
						Email: c3chuyenhanoi@amsterdam.edu.vn
					</div>
					<div className="text-[9px] sm:text-xs leading-tight">
						Điện thoại: 0243 1234567
					</div>
					<div className="text-[9px] sm:text-xs leading-tight">
						Website: c3chuyenhanoi.amsterdam.edu.vn
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<h4 className="font-semibold text-white text-xs sm:text-sm mb-1">
							Tài liệu
						</h4>
						<ul className="space-y-1 text-[9px] sm:text-xs">
							<li>
								<Link className="hover:underline" href="#">
									Sách giấy
								</Link>
							</li>
							<li>
								<Link className="hover:underline" href="#">
									Sách điện tử
								</Link>
							</li>
							<li>
								<Link className="hover:underline" href="#">
									Bài giảng điện tử
								</Link>
							</li>
							<li>
								<Link className="hover:underline" href="#">
									Album
								</Link>
							</li>
							<li>
								<Link className="hover:underline" href="#">
									Khác
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-1">
						<h4 className="font-semibold text-white text-xs sm:text-sm mb-1">
							Tin tức
						</h4>
						<ul className="space-y-1 text-[9px] sm:text-xs">
							<li>
								<Link className="hover:underline" href="#">
									Sự kiện
								</Link>
							</li>
							<li>
								<Link className="hover:underline" href="#">
									Tin mới đăng
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="text-right text-[9px] sm:text-xs text-gray-400">
					<div>3 người online</div>
					<div>45.272 tổng lượt truy cập</div>
				</div>
			</div>

			<div className="border-t border-gray-600 text-center py-2 text-[8px] sm:text-[10px] text-gray-500">
				Copyright © 2024. Được phát triển bởi Công ty TNHH Công nghệ Giáo dục
				Velo
			</div>
		</footer>
	);
};

export default Footer;
