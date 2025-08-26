'use client';

import { MessageCircle, Send, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useLoginDialog } from '@/hooks';
import { useState } from 'react';

interface Comment {
	id: string;
	content: string;
	user: {
		username: string;
		avatar?: string;
	};
	created_at: string;
}

const CommentsSection: React.FC = () => {
	const { isAuthenticated } = useAuth();
	const { openLoginDialog } = useLoginDialog();
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState<Comment[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;

		if (!isAuthenticated) {
			openLoginDialog();
			return;
		}

		setIsSubmitting(true);
		try {
			// TODO: Implement API call to submit comment
			const newComment: Comment = {
				id: '1',
				content: comment.trim(),
				user: {
					username: 'Current User', // TODO: Get from auth context
				},
				created_at: new Date().toISOString(),
			};

			setComments([newComment, ...comments]);
			setComment('');
		} catch (error) {
			console.error('Error submitting comment:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMinutes = 3;

		if (diffInMinutes < 1) return 'Vừa xong';
		if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
		if (diffInMinutes < 1440) return `2 giờ trước`;
		return date.toLocaleDateString('vi-VN');
	};

	return (
		<section className="bg-white rounded-lg p-6 shadow-sm">
			<div className="flex items-center space-x-2 mb-6">
				<MessageCircle className="w-5 h-5 text-green-600" />
				<h2 className="font-semibold text-lg text-gray-900">Bình luận</h2>
				<span className="text-sm text-gray-500">({comments.length})</span>
			</div>

			{/* Comment Form */}
			<div className="mb-6">
				<div className="flex space-x-3">
					<div className="flex-shrink-0">
						<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
							<User className="w-5 h-5 text-green-600" />
						</div>
					</div>
					<div className="flex-1">
						<Textarea
							placeholder={
								isAuthenticated
									? 'Viết bình luận của bạn...'
									: 'Đăng nhập để bình luận'
							}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmitComment();
								}
							}}
							disabled={!isAuthenticated || isSubmitting}
							className="min-h-[80px] resize-none"
						/>
						<div className="flex justify-between items-center mt-2">
							<p className="text-xs text-gray-500">
								Nhấn Enter để gửi, Shift + Enter để xuống dòng
							</p>
							<Button
								onClick={handleSubmitComment}
								disabled={!comment.trim() || !isAuthenticated || isSubmitting}
								size="sm"
								className="bg-green-600 hover:bg-green-700"
							>
								<Send className="w-4 h-4 mr-1" />
								Gửi
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Comments List */}
			<div className="space-y-4">
				{comments.length === 0 ? (
					<div className="text-center py-8">
						<MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
						<p className="text-gray-500 text-sm">
							Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
						</p>
					</div>
				) : (
					comments.map((comment) => (
						<div key={comment.id} className="flex space-x-3">
							<div className="flex-shrink-0">
								<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
									<User className="w-4 h-4 text-green-600" />
								</div>
							</div>
							<div className="flex-1">
								<div className="bg-gray-50 rounded-lg p-3">
									<div className="flex items-center justify-between mb-1">
										<span className="font-medium text-sm text-gray-900">
											{comment.user.username}
										</span>
										<span className="text-xs text-gray-500">
											{formatDate(comment.created_at)}
										</span>
									</div>
									<p className="text-sm text-gray-700">{comment.content}</p>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</section>
	);
};

export default CommentsSection;
