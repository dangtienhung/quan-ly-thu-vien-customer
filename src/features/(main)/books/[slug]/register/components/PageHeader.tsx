import Link from 'next/link';

interface PageHeaderProps {
	bookSlug: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ bookSlug }) => {
	return (
		<div className="mb-8">
			<Link
				href={`/books/${bookSlug}`}
				className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
			>
				← Quay lại trang chi tiết sách
			</Link>
			<h1 className="text-3xl font-bold text-gray-900">Đặt trước sách</h1>
		</div>
	);
};

export default PageHeader;
