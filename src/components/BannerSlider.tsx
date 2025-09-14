'use client';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Image from 'next/image';
import type { Swiper as SwiperType } from 'swiper';

interface BannerSliderProps {
	banners: string[];
	interval?: number; // Auto-slide interval in milliseconds
}

const BannerSlider: React.FC<BannerSliderProps> = ({
	banners,
	interval = 5000,
}) => {
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const swiperRef = useRef<SwiperType | null>(null);

	const toggleAutoplay = () => {
		if (swiperRef.current) {
			if (isAutoPlaying) {
				swiperRef.current.autoplay.stop();
			} else {
				swiperRef.current.autoplay.start();
			}
			setIsAutoPlaying(!isAutoPlaying);
		}
	};

	if (!banners || banners.length === 0) {
		return null;
	}

	return (
		<div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg">
			<Swiper
				modules={[Autoplay, Navigation, Pagination]}
				spaceBetween={0}
				slidesPerView={1}
				autoplay={
					isAutoPlaying
						? { delay: interval, disableOnInteraction: false }
						: false
				}
				navigation={{
					nextEl: '.swiper-button-next-custom',
					prevEl: '.swiper-button-prev-custom',
				}}
				pagination={{
					clickable: true,
					bulletClass: 'swiper-pagination-bullet-custom',
					bulletActiveClass: 'swiper-pagination-bullet-active-custom',
				}}
				loop={banners.length > 1}
				onSwiper={(swiper: SwiperType) => {
					swiperRef.current = swiper;
				}}
				className="w-full h-full"
			>
				{banners.map((banner, index) => (
					<SwiperSlide key={index}>
						<div className="relative w-full h-full">
							<Image
								src={banner}
								alt={`Banner ${index + 1}`}
								fill
								className="object-cover"
								priority={index === 0}
								sizes="(max-width: 768px) 100vw, (max-width: 1280px) 1280px, 1280px"
							/>
							{/* Overlay for better text readability */}
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Custom Navigation Buttons */}
			{banners.length > 1 && (
				<>
					<button
						className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl"
						aria-label="Previous banner"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
					<button
						className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl"
						aria-label="Next banner"
					>
						<ChevronRight className="w-6 h-6" />
					</button>
				</>
			)}

			{/* Custom Pagination Dots */}
			{banners.length > 1 && (
				<div className="swiper-pagination-custom absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10" />
			)}
		</div>
	);
};

export default BannerSlider;
