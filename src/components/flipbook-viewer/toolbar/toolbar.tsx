'use client';

import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { useCallback, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import useScreenSize from '@/hooks/use-screensize';
import keyboardjs from 'keyboardjs';
import Share from '../share';
import SliderNav from './slider-nav/slider-nav';
import Zoom from './zoom';

interface PdfDetails {
	totalPages: number;
	width: number;
	height: number;
}

interface ViewerStates {
	currentPageIndex: number;
	zoomScale: number;
}

interface ToolbarProps {
	flipbookRef: React.RefObject<any>;
	containerRef: React.RefObject<HTMLDivElement>;
	screenfull: any;
	pdfDetails: PdfDetails;
	viewerStates: ViewerStates;
	shareUrl?: string;
	disableShare?: boolean;
}

const Toolbar = ({
	flipbookRef,
	containerRef,
	screenfull,
	pdfDetails,
	viewerStates,
	shareUrl,
	disableShare,
}: ToolbarProps) => {
	const { width: screenWidth } = useScreenSize();
	const pagesInFlipView =
		(viewerStates.currentPageIndex + 1) % 2 === 0 &&
		viewerStates.currentPageIndex + 1 !== pdfDetails.totalPages
			? `${viewerStates.currentPageIndex + 1} - ${
					viewerStates.currentPageIndex + 2
			  }`
			: viewerStates.currentPageIndex + 1;

	// Full screen >>>>>>>>>
	const fullScreen = useCallback(() => {
		if (screenfull.isEnabled) {
			screenfull.toggle(containerRef.current, { navigationUI: 'hide' });
		}
		screenfull.on('error', () => {
			alert('Failed to enable fullscreen');
		});
	}, [screenfull, containerRef]);

	// Keyboard shortcuts >>>>>>>>>
	useEffect(() => {
		const handleRight = () => flipbookRef.current?.pageFlip().flipNext();
		const handleLeft = () => flipbookRef.current?.pageFlip().flipPrev();

		keyboardjs.bind('right', null, handleRight);
		keyboardjs.bind('left', null, handleLeft);
		// keyboardjs.bind('f', null, fullScreen);

		return () => {
			keyboardjs.unbind('right', null, handleRight);
			keyboardjs.unbind('left', null, handleLeft);
			// keyboardjs.unbind('f', null, fullScreen);
		};
	}, [flipbookRef, fullScreen]);

	return (
		<div className="px-3 w-full bg-background">
			<SliderNav
				flipbookRef={flipbookRef}
				pdfDetails={pdfDetails}
				viewerStates={viewerStates}
				screenWidth={screenWidth}
			/>
			<div className="flex items-center gap-2 pb-2 max-xl:pt-2">
				<div className="hidden lg:block flex-1"></div>
				<Button
					onClick={() => {
						if (flipbookRef.current) {
							screenWidth < 768
								? flipbookRef.current.pageFlip().turnToPrevPage()
								: flipbookRef.current.pageFlip().flipPrev();
						}
					}}
					disabled={viewerStates.currentPageIndex === 0}
					variant="secondary"
					size="icon"
					className="size-8 min-w-8"
				>
					<ChevronLeft className="size-4 min-w-4" />
				</Button>
				<Button
					onClick={() => {
						if (flipbookRef.current) {
							screenWidth < 768
								? flipbookRef.current.pageFlip().turnToNextPage()
								: flipbookRef.current.pageFlip().flipNext();
						}
					}}
					disabled={
						viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 ||
						viewerStates.currentPageIndex === pdfDetails?.totalPages - 2
					}
					variant="secondary"
					size="icon"
					className="size-8 min-w-8"
				>
					<ChevronRight className="size-4 min-w-4" />
				</Button>
				<Zoom zoomScale={viewerStates.zoomScale} screenWidth={screenWidth} />
				{!disableShare && shareUrl && (
					<Share asChild={false} shareUrl={shareUrl}>
						{null}
					</Share>
				)}
				<Button
					onClick={fullScreen}
					variant="secondary"
					size="icon"
					className="size-8 min-w-8"
				>
					{screenfull.isEnabled && screenfull.isFullscreen ? (
						<Minimize className="size-4 min-w-4" />
					) : (
						<Maximize className="size-4 min-w-4" />
					)}
				</Button>
				<div className="flex-1"></div>
				{pdfDetails?.totalPages > 0 && (
					<p className="text-sm font-medium">
						{pagesInFlipView} of {pdfDetails?.totalPages}
					</p>
				)}
			</div>
		</div>
	);
};

export default Toolbar;
