import { BookOpen } from 'lucide-react';

const LoadingState = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
				<p className="text-gray-600">Đang tải thông tin...</p>
			</div>
		</div>
	);
};

export default LoadingState;
