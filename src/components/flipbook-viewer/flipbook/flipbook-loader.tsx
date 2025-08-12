import { forwardRef, memo, useCallback } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import useScreenSize from '@/hooks/use-screensize';
import { cn } from '@/lib/utils';
import HTMLFlipBook from 'react-pageflip';
import PdfPage from './pdf-page';

const MemoizedPdfPage = memo(PdfPage);

interface FlipbookLoaderProps {
	pdfDetails: {
		totalPages: number;
		width: number;
		height: number;
	};
	scale: number;
	viewerStates: {
		currentPageIndex: number;
		zoomScale: number;
	};
	setViewerStates: (states: {
		currentPageIndex: number;
		zoomScale: number;
	}) => void;
	viewRange: [number, number];
	setViewRange: (range: [number, number]) => void;
}

const FlipbookLoader = forwardRef<any, FlipbookLoaderProps>(
	(
		{
			pdfDetails,
			scale,
			viewerStates,
			setViewerStates,
			viewRange,
			setViewRange,
		},
		ref
	) => {
		const { width } = useScreenSize();
		const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);
		// Check if page is in View range or in view window >>>>>>>>
		const isPageInViewRange = (index: number) => {
			return index >= viewRange[0] && index <= viewRange[1];
		};
		const isPageInView = (index: number) => {
			return (
				viewerStates.currentPageIndex === index ||
				viewerStates.currentPageIndex + 1 === index
			);
		};

		// Update pageViewRange on page flip >>>>>>>>
		const onFlip = useCallback(
			(e: any) => {
				let newViewRange: [number, number];
				if (e.data > viewerStates.currentPageIndex) {
					newViewRange = [
						viewRange[0],
						Math.max(Math.min(e.data + 4, pdfDetails.totalPages), viewRange[1]),
					];
				} else if (e.data < viewerStates.currentPageIndex) {
					newViewRange = [
						Math.min(Math.max(e.data - 4, 0), viewRange[0]),
						viewRange[1],
					];
				} else {
					newViewRange = viewRange;
				}
				setViewRange(newViewRange);
				setViewerStates({
					...viewerStates,
					currentPageIndex: e.data,
				});
			},
			[
				viewerStates,
				viewRange,
				setViewRange,
				setViewerStates,
				pdfDetails.totalPages,
			]
		);

		return (
			<div className="relative">
				{/* @ts-ignore */}
				<HTMLFlipBook
					ref={ref}
					key={scale}
					startPage={viewerStates.currentPageIndex}
					width={pdfDetails.width * scale * 5}
					height={pdfDetails.height * scale * 5}
					size="stretch"
					drawShadow={false}
					flippingTime={700}
					usePortrait={false}
					showCover={true}
					showPageCorners={false}
					onFlip={onFlip}
					disableFlipByClick={width < 768 ? true : false}
					className={cn(
						viewerStates.zoomScale > 1 &&
							'pointer-events-none md:pointer-events-none'
					)}
				>
					{Array.from({ length: pdfDetails.totalPages }, (_, index) => (
						<MemoizedPdfPage
							key={index}
							height={pdfDetails.height * scale}
							zoomScale={debouncedZoom}
							page={index + 1}
							isPageInViewRange={isPageInViewRange(index)}
							isPageInView={isPageInView(index)}
						/>
					))}
				</HTMLFlipBook>
				{/* <p className="text-background absolute z-50 top-0 -left-10">{viewRange[0] + '-' + viewRange[1]}</p> */}
			</div>
		);
	}
);

FlipbookLoader.displayName = 'FlipbookLoader';

export default FlipbookLoader;
