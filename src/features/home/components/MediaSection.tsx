import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MediaItem {
	title: string;
	image: string;
	category: string;
	views: string;
	likes: string;
}

interface MediaSectionProps {
	title: string;
	items: MediaItem[];
	gridCols?: string;
}

const MediaSection: React.FC<MediaSectionProps> = ({
	title,
	items,
	gridCols = 'grid-cols-2 sm:grid-cols-3',
}) => {
	return (
		<section className="max-w-[1280px] mx-auto px-4 mb-8">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-semibold text-base sm:text-lg">{title}</h3>
				<Link
					className="text-green-600 text-xs sm:text-sm font-semibold hover:underline"
					href="#"
				>
					Xem tất cả &gt;
				</Link>
			</div>
			<div className={`grid ${gridCols} gap-3`}>
				{items.map((item, index) => (
					<div
						key={index}
						className="flex flex-col space-y-1 w-[140px] sm:w-auto"
					>
						<Image
							alt={`Hình minh họa ${item.title}`}
							className="rounded"
							height={100}
							src={item.image}
							width={140}
						/>
						<div className="font-semibold text-xs sm:text-sm truncate">
							{item.title}
						</div>
						<div className="text-gray-500 text-[9px] sm:text-xs">
							{item.category}
						</div>
						<div className="flex space-x-2 text-gray-400 text-[8px] sm:text-[10px]">
							<span>{item.views}</span>
							<span>{item.likes}</span>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default MediaSection;
