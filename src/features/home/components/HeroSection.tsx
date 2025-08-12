import Image from 'next/image';
import React from 'react';

const HeroSection: React.FC = () => {
	return (
		<section className="relative bg-gradient-to-b from-[#6a5f5f] via-[#6a5f5f]/70 to-[#0f1f2a] text-white">
			<div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
				{/* Left: Book cover */}
				<div className="flex-shrink-0 basis-[376px] max-w-[376px]">
					<div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
						<Image
							alt="Bìa sách Cáo, Thỏ và Gà trống minh họa các con vật hoạt hình trong rừng"
							className="object-cover"
							fill
							sizes="(max-width: 768px) 100vw, 376px"
							src="https://storage.googleapis.com/a1aa/image/dd68c161-d2c4-4804-bdf6-c6adb5b0980a.jpg"
							priority
						/>
					</div>
				</div>

				{/* Center: Book info */}
				<div className="flex-1 max-w-xl">
					<h2 className="font-bold text-lg sm:text-2xl md:text-3xl mb-2">
						Cáo, Thỏ, Gà Trống
					</h2>
					<div className="flex items-center space-x-2 text-sm sm:text-base mb-2">
						<div className="flex items-center space-x-1">
							<i className="fas fa-headphones-alt"></i>
							<span>71.9 nghìn lượt</span>
						</div>
						<div className="flex items-center space-x-1">
							<i className="fas fa-book"></i>
							<span>12 lượt thích</span>
						</div>
					</div>
					<div className="text-sm sm:text-base mb-1">
						<span className="font-semibold">Thể loại:</span>
						Sách nói
					</div>
					<div className="text-sm sm:text-base mb-4">
						<span className="font-semibold">Hình thức:</span>
						Sách nói
					</div>
					<button className="bg-[#00B14F] text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-1 flex items-center space-x-2 hover:bg-[#009a43]">
						<i className="fas fa-play"></i>
						<span>NGHE NGAY</span>
					</button>
				</div>

				{/* Right: List of books */}
				<div className="flex flex-col space-y-3 w-full max-w-xs">
					{[
						{
							title: 'Cáo, Thỏ, Gà Trống',
							image:
								'https://storage.googleapis.com/a1aa/image/dd68c161-d2c4-4804-bdf6-c6adb5b0980a.jpg',
							listens: '69.9 nghìn lượt',
							likes: '10 lượt thích',
						},
						{
							title: 'Bài tập toán Tập 2',
							image:
								'https://storage.googleapis.com/a1aa/image/923ce43a-5dfd-4618-d72d-c6f1e09f70ce.jpg',
							description:
								'Số lượng bài tập | Thể loại: Sách bài tập và bổ trợ chương trình THPT',
						},
						{
							title: 'Vật lý',
							image:
								'https://storage.googleapis.com/a1aa/image/a99b220e-2eb4-424c-0841-0cd71799f4cc.jpg',
							description:
								'Số lượng bài tập | Thể loại: Sách bài tập và bổ trợ chương trình THPT',
						},
						{
							title: 'Lịch sử',
							image:
								'https://storage.googleapis.com/a1aa/image/c7fb5630-5416-418b-bc12-9e6e251af101.jpg',
							description:
								'Số lượng bài tập | Thể loại: Sách bài tập và bổ trợ chương trình THPT',
						},
						{
							title: 'Đại số và giải tích',
							image:
								'https://storage.googleapis.com/a1aa/image/2c936dcf-6bb0-4b44-ffc4-09848e214a59.jpg',
						},
					].map((book, index) => (
						<div
							key={index}
							className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-opacity-30"
						>
							<Image
								alt={`Bìa sách ${book.title}`}
								className="w-12 h-12 rounded"
								height={48}
								src={book.image}
								width={48}
							/>
							<div className="flex-1">
								<div className="font-semibold text-sm sm:text-base text-white truncate">
									{book.title}
								</div>
								{book.listens ? (
									<div className="text-xs sm:text-sm text-gray-300 flex items-center space-x-2">
										<span>
											<i className="fas fa-headphones-alt"></i>
											{book.listens}
										</span>
										<span>
											<i className="fas fa-book"></i>
											{book.likes}
										</span>
									</div>
								) : (
									<div className="text-xs sm:text-sm text-gray-300">
										{book.description}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
