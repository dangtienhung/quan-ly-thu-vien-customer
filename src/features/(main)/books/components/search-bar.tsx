import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [inputValue, setInputValue] = useState(searchQuery);

	// Sync input value with searchQuery prop
	useEffect(() => {
		setInputValue(searchQuery);
	}, [searchQuery]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			// Create new URLSearchParams
			const params = new URLSearchParams(searchParams.toString());

			if (inputValue.trim()) {
				// Add search query to URL
				params.set('q', inputValue.trim());
			} else {
				// Remove search query from URL if empty
				params.delete('q');
			}

			// Reset to page 1 when searching
			params.set('page', '1');

			// Navigate to new URL
			router.push(`/books?${params.toString()}`);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		onSearchChange(value);
	};

	return (
		<div className="mb-6">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input
					placeholder="Tìm kiếm sách, tác giả..."
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					className="pl-10"
				/>
			</div>
		</div>
	);
}
