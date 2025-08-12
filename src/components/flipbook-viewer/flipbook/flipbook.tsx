'use client';

import { memo, useCallback, useEffect, useState } from 'react';

import useRefSize from '@/hooks/use-ref-size';
import { cn } from '@/lib/utils';
import { TransformComponent } from 'react-zoom-pan-pinch';
import screenfull from 'screenfull';
import FlipbookLoader from './flipbook-loader';

interface FlipbookProps {
	viewerStates: {
		currentPageIndex: number;
		zoomScale: number;
	};
	setViewerStates: (states: {
		currentPageIndex: number;
		zoomScale: number;
	}) => void;
	flipbookRef: React.RefObject<HTMLDivElement>;
	pdfDetails: {
		totalPages: number;
		width: number;
		height: number;
	};
}

const Flipbook = memo(
	({
		viewerStates,
		setViewerStates,
		flipbookRef,
		pdfDetails,
	}: FlipbookProps) => {
		const { ref, width, height, refreshSize } = useRefSize();
		const [scale, setScale] = useState(1); // Max scale for flipbook
		const [wrapperCss, setWrapperCss] = useState({});
		const [viewRange, setViewRange] = useState<[number, number]>([0, 4]);

		// Calculate scale when pageSize or dimensions change >>>>>>>>
		useEffect(() => {
			if (pdfDetails && width && height) {
				const calculatedScale = Math.min(
					width / (2 * pdfDetails.width),
					height / pdfDetails.height
				);
				setScale(calculatedScale);
				setWrapperCss({
					width: `${pdfDetails.width * calculatedScale * 2}px`,
					height: `${pdfDetails.height * calculatedScale}px`,
				});
			}
		}, [pdfDetails, width, height]);

		// Refresh flipbook size & page range on window resize >>>>>>>>
		const shrinkPageLoadingRange = useCallback(() => {
			setViewRange([
				Math.max(viewerStates.currentPageIndex - 2, 0),
				Math.min(viewerStates.currentPageIndex + 2, pdfDetails.totalPages),
			]);
		}, [viewerStates.currentPageIndex, pdfDetails.totalPages, setViewRange]);

		const handleFullscreenChange = useCallback(() => {
			shrinkPageLoadingRange();
			refreshSize();
		}, [shrinkPageLoadingRange, refreshSize]);

		useEffect(() => {
			if (screenfull) {
				screenfull.on('change', handleFullscreenChange);
			}
			// Clean up the event listener
			return () => {
				if (screenfull) {
					screenfull.off('change', handleFullscreenChange);
				}
			};
		}, [handleFullscreenChange]);

		return (
			<div
				ref={ref}
				className={cn(
					'relative h-full w-full bg-transparent flex justify-center items-center overflow-hidden',
					screenfull?.isFullscreen &&
						'h-[calc(100vh-5.163rem)] xs:h-[calc(100vh-5.163rem)] lg:h-[calc(100vh-5.163rem)] xl:h-[calc(100vh-4.66rem)]'
				)}
			>
				<TransformComponent
					wrapperStyle={{ width: '100%', height: '100%' }}
					contentStyle={{ width: '100%', height: '100%' }}
				>
					<div className="overflow-hidden flex justify-center items-center h-full w-full">
						{pdfDetails && scale && (
							<div style={wrapperCss}>
								<FlipbookLoader
									ref={flipbookRef}
									pdfDetails={pdfDetails}
									scale={scale}
									viewRange={viewRange}
									setViewRange={setViewRange}
									viewerStates={viewerStates}
									setViewerStates={setViewerStates}
								/>
							</div>
						)}
					</div>
				</TransformComponent>
			</div>
		);
	}
);

Flipbook.displayName = 'Flipbook';
export default Flipbook;
