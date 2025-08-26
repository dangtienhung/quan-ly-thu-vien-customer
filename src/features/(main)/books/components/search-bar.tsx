import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
	return (
		<div className="mb-6">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input
					placeholder="Tìm kiếm sách, tác giả..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-10"
				/>
			</div>
		</div>
	);
}
