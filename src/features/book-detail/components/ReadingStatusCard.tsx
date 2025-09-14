'use client';

import {
	useReadingHistoryByReaderAndBook,
	useToggleFavorite,
} from '@/hooks/reading-history';
import { BookOpen, Clock, Heart, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useReaderByUserId } from '@/hooks/readers';
import { useAuthStore } from '@/stores/auth-store';
import type { BookWithAuthors } from '@/types/books';
import React from 'react';

interface ReadingStatusCardProps {
	book: BookWithAuthors;
}

const ReadingStatusCard: React.FC<ReadingStatusCardProps> = ({ book }) => {
	const { user, isAuthenticated } = useAuthStore();

	// Get reader info by user ID
	const { data: reader } = useReaderByUserId(user?.id || '');

	// Get reading history for this book
	const { data: readingHistory, isLoading } = useReadingHistoryByReaderAndBook(
		reader?.id || '',
		book.id
	);

	// Toggle favorite mutation
	const toggleFavoriteMutation = useToggleFavorite();

	// Don't show if not authenticated or no reader
	if (!isAuthenticated || !reader) {
		return null;
	}

	// Don't show for physical books
	if (book.book_type !== 'ebook') {
		return null;
	}

	// Don't show if no reading history
	if (isLoading || !readingHistory) {
		return null;
	}

	const handleToggleFavorite = () => {
		if (reader?.id) {
			toggleFavoriteMutation.mutate({
				readerId: reader.id,
				bookId: book.id,
			});
		}
	};

	const formatReadingTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	const getStatusColor = (status: string): string => {
		switch (status) {
			case 'reading':
				return 'text-blue-600 bg-blue-50';
			case 'completed':
				return 'text-green-600 bg-green-50';
			case 'paused':
				return 'text-yellow-600 bg-yellow-50';
			case 'abandoned':
				return 'text-red-600 bg-red-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const getStatusText = (status: string): string => {
		switch (status) {
			case 'reading':
				return 'Đang đọc';
			case 'completed':
				return 'Đã hoàn thành';
			case 'paused':
				return 'Tạm dừng';
			case 'abandoned':
				return 'Bỏ dở';
			default:
				return 'Chưa đọc';
		}
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
			<div className="flex items-start justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900 flex items-center">
					<BookOpen className="w-5 h-5 mr-2 text-blue-600" />
					Trạng thái đọc sách
				</h3>
				<Button
					onClick={handleToggleFavorite}
					disabled={toggleFavoriteMutation.isPending}
					variant="ghost"
					size="sm"
					className={`p-2 rounded-full transition-colors ${
						readingHistory.is_favorite
							? 'text-red-500 hover:text-red-600 hover:bg-red-50'
							: 'text-gray-400 hover:text-red-500 hover:bg-red-50'
					}`}
				>
					<Heart
						className={`w-5 h-5 ${
							readingHistory.is_favorite ? 'fill-current' : ''
						}`}
					/>
				</Button>
			</div>

			<div className="space-y-4">
				{/* Reading Status */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Trạng thái:</span>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
							readingHistory.status
						)}`}
					>
						{getStatusText(readingHistory.status)}
					</span>
				</div>

				{/* Current Page */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Trang hiện tại:</span>
					<span className="text-sm font-medium text-gray-900">
						{readingHistory.current_page} / {book.page_count || 'N/A'}
					</span>
				</div>

				{/* Progress Bar */}
				{book.page_count && (
					<div className="space-y-2">
						<div className="flex justify-between text-xs text-gray-500">
							<span>Tiến độ</span>
							<span>
								{Math.round(
									(readingHistory.current_page / book.page_count) * 100
								)}
								%
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{
									width: `${Math.min(
										(readingHistory.current_page / book.page_count) * 100,
										100
									)}%`,
								}}
							/>
						</div>
					</div>
				)}

				{/* Reading Time */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600 flex items-center">
						<Clock className="w-4 h-4 mr-1" />
						Thời gian đọc:
					</span>
					<span className="text-sm font-medium text-gray-900">
						{formatReadingTime(readingHistory.total_reading_time_seconds)}
					</span>
				</div>

				{/* Last Read */}
				{readingHistory.last_read_at && (
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Lần đọc cuối:</span>
						<span className="text-sm text-gray-900">
							{new Date(readingHistory.last_read_at).toLocaleDateString(
								'vi-VN'
							)}
						</span>
					</div>
				)}

				{/* Favorite Status */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600 flex items-center">
						<Star className="w-4 h-4 mr-1" />
						Yêu thích:
					</span>
					<span className="text-sm font-medium text-gray-900">
						{readingHistory.is_favorite ? 'Có' : 'Không'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ReadingStatusCard;
