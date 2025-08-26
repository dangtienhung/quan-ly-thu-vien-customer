'use client';

import {
	BooksGrid,
	CategoriesSidebar,
	ResultsInfo,
	SearchBar,
} from '@/features/(main)/books/components';

import { useState } from 'react';

export default function BooksPage() {
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	const handleClearFilter = () => {
		// Clear search input when filter is cleared
		setSearchQuery('');
	};

	return (
		<div className="max-w-[1280px] mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Thư viện sách</h1>
				<p className="text-gray-600">
					Khám phá bộ sưu tập sách đa dạng của chúng tôi
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

					{/* Books Grid */}
					<BooksGrid />
				</div>
			</div>
		</div>
	);
}
