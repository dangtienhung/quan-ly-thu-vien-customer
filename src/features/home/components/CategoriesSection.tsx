import React from 'react';

const CategoriesSection: React.FC = () => {
	const categories = [
		{
			icon: '📖',
			text: 'Sách giấy',
			color: 'text-green-600',
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
		},
		{
			icon: '📱',
			text: 'Sách điện tử',
			color: 'text-red-600',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
		},
		{
			icon: '🎧',
			text: 'Sách nói',
			color: 'text-orange-500',
			bgColor: 'bg-orange-50',
			borderColor: 'border-orange-200',
		},
		{
			icon: '💻',
			text: 'Bài giảng điện tử',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200',
		},
		{
			icon: '📺',
			text: 'Video',
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
			borderColor: 'border-purple-200',
		},
		{
			icon: '📚',
			text: 'Album ảnh',
			color: 'text-red-600',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
		},
		{
			icon: '⚡',
			text: 'Kỹ năng sống',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200',
		},
	];

	return (
		<section className="max-w-[1280px] mx-auto px-4 py-6">
			<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Danh mục tài liệu
				</h2>

				<div className="relative">
					<div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
						{categories.map((category, index) => (
							<div
								key={index}
								className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[80px]"
							>
								<div
									className={`w-12 h-12 rounded-full border-2 ${category.borderColor} ${category.bgColor} flex items-center justify-center text-xl`}
								>
									{category.icon}
								</div>
								<span className="text-xs text-gray-700 text-center font-medium">
									{category.text}
								</span>
							</div>
						))}
					</div>

					{/* Scroll arrow button */}
					{/* <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
						<ChevronRight className="w-4 h-4 text-gray-600" />
					</button> */}
				</div>
			</div>
		</section>
	);
};

export default CategoriesSection;
