'use client';

import {
	BooksGrid,
	CategoriesSidebar,
	ResultsInfo,
	SearchBar,
} from '@/features/(main)/books/components';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { useState } from 'react';

export default function BooksPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [expandedSections, setExpandedSections] = useState({
		physical: true,
		ebook: true,
	});

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	const handleClearFilter = () => {
		// Clear search input when filter is cleared
		setSearchQuery('');
	};

	const toggleSection = (section: 'physical' | 'ebook') => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	return (
		<div className="max-w-[1280px] mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Thư viện sách</h1>
				<p className="text-gray-600">
					{searchQuery
						? `Kết quả tìm kiếm cho "${searchQuery}"`
						: 'Khám phá bộ sưu tập sách đa dạng của chúng tôi'}
				</p>
			</div>

			<div className="flex gap-8">
				{/* Sidebar - Categories */}
				<CategoriesSidebar />

				{/* Main Content - Books */}
				<div className="flex-1">
					{/* Search Bar */}
					<SearchBar
						searchQuery={searchQuery}
						onSearchChange={handleSearchChange}
					/>

					{/* Results Info */}
					<ResultsInfo onClearSearch={handleClearFilter} />

					{/* Conditional rendering based on search */}
					{searchQuery ? (
						/* Show regular BooksGrid when searching */
						<BooksGrid />
					) : (
						/* Show collapse sections when not searching */
						<div className="space-y-6">
							{/* Physical Books Section */}
							<div className="border border-gray-200 rounded-lg">
								<button
									onClick={() => toggleSection('physical')}
									className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
								>
									<div className="flex items-center gap-3">
										<h2 className="text-xl font-semibold text-gray-900">
											📚 Sách vật lý
										</h2>
										<span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
											Sách in - Có thể mượn về nhà
										</span>
									</div>
									{expandedSections.physical ? (
										<ChevronDown className="h-5 w-5 text-gray-500" />
									) : (
										<ChevronRight className="h-5 w-5 text-gray-500" />
									)}
								</button>

								{expandedSections.physical && (
									<div className="p-6">
										<div className="mb-4">
											<p className="text-sm text-gray-600">
												Khám phá bộ sưu tập sách in phong phú, có thể mượn về
												nhà để đọc
											</p>
										</div>
										<BooksGrid bookType="physical" />
									</div>
								)}
							</div>

							{/* E-books Section */}
							<div className="border border-gray-200 rounded-lg">
								<button
									onClick={() => toggleSection('ebook')}
									className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
								>
									<div className="flex items-center gap-3">
										<h2 className="text-xl font-semibold text-gray-900">
											💻 Sách điện tử
										</h2>
										<span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
											E-book - Đọc trực tuyến
										</span>
									</div>
									{expandedSections.ebook ? (
										<ChevronDown className="h-5 w-5 text-gray-500" />
									) : (
										<ChevronRight className="h-5 w-5 text-gray-500" />
									)}
								</button>

								{expandedSections.ebook && (
									<div className="p-6">
										<div className="mb-4">
											<p className="text-sm text-gray-600">
												Đọc sách điện tử trực tuyến, tiện lợi mọi lúc mọi nơi
											</p>
										</div>
										<BooksGrid bookType="ebook" />
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
