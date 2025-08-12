import { cn } from '@/lib/utils';
import { Book, Loader2 } from 'lucide-react';

interface LoadingProps {
	variant?: 'default' | 'book' | 'spinner';
	size?: 'sm' | 'md' | 'lg';
	text?: string;
	className?: string;
}

const Loading: React.FC<LoadingProps> = ({
	variant = 'default',
	size = 'md',
	text,
	className,
}) => {
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
	};

	const textSizes = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
	};

	if (variant === 'book') {
		return (
			<div
				className={cn(
					'flex flex-col items-center justify-center p-8',
					className
				)}
			>
				<Book
					className={cn('animate-pulse text-green-600 mb-4', sizeClasses[size])}
				/>
				{text && (
					<p className={cn('text-gray-600 text-center', textSizes[size])}>
						{text}
					</p>
				)}
			</div>
		);
	}

	if (variant === 'spinner') {
		return (
			<div
				className={cn(
					'flex flex-col items-center justify-center p-8',
					className
				)}
			>
				<Loader2
					className={cn('animate-spin text-green-600 mb-4', sizeClasses[size])}
				/>
				{text && (
					<p className={cn('text-gray-600 text-center', textSizes[size])}>
						{text}
					</p>
				)}
			</div>
		);
	}

	// Default skeleton loading
	return (
		<div className={cn('animate-pulse', className)}>
			<div className="space-y-4">
				<div className="bg-gray-200 rounded-lg h-4 w-3/4"></div>
				<div className="bg-gray-200 rounded-lg h-4 w-1/2"></div>
				<div className="bg-gray-200 rounded-lg h-4 w-5/6"></div>
			</div>
		</div>
	);
};

export default Loading;
