'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';

const TransformWrapper = dynamic(
	() =>
		import('react-zoom-pan-pinch').then((mod) => ({
			default: mod.TransformWrapper,
		})),
	{
		ssr: false,
	}
);

import Flipbook from './flipbook/flipbook';
import PdfLoading from './pad-loading/pdf-loading';
import Toolbar from './toolbar/toolbar';

import screenfull from 'screenfull';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipbookViewerProps {
	pdfUrl: string;
	shareUrl?: string;
	className?: string;
	disableShare?: boolean;
}

interface PdfDetails {
	totalPages: number;
	width: number;
	height: number;
}

interface ViewerStates {
	currentPageIndex: number;
	zoomScale: number;
}

const FlipbookViewer = ({
	pdfUrl,
	shareUrl,
	className,
	disableShare,
}: FlipbookViewerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const flipbookRef = useRef<HTMLDivElement>(null);
	const [pdfLoading, setPdfLoading] = useState(true);
	const [pdfDetails, setPdfDetails] = useState<PdfDetails | null>(null);
	const [viewerStates, setViewerStates] = useState<ViewerStates>({
		currentPageIndex: 0,
		zoomScale: 1,
	});

	// Setting pdf details on document load >>>>>>>>>
	const onDocumentLoadSuccess = useCallback(async (document: any) => {
		try {
			const pageDetails = await document.getPage(1);
			setPdfDetails({
				totalPages: document.numPages,
				width: pageDetails.view[2],
				height: pageDetails.view[3],
			});
			setPdfLoading(false);
		} catch (error) {
			console.error('Error loading document:', error);
		}
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('relative h-full w-full overflow-hidden', className)}
		>
			{pdfLoading && <PdfLoading />}
			<Document
				file={pdfUrl}
				onLoadSuccess={onDocumentLoadSuccess}
				loading={<></>}
				className={cn('h-full w-full', className)}
			>
				{pdfDetails && !pdfLoading && (
					<TransformWrapper
						doubleClick={{ disabled: true }}
						pinch={{ step: 2 }}
						disablePadding={viewerStates?.zoomScale <= 1}
						initialScale={1}
						minScale={1}
						maxScale={5}
						onTransformed={({ state }) =>
							setViewerStates({ ...viewerStates, zoomScale: state.scale })
						}
					>
						<div className="w-full relative flex flex-col justify-between h-full">
							<Flipbook
								viewerStates={viewerStates}
								setViewerStates={setViewerStates}
								flipbookRef={flipbookRef as React.RefObject<HTMLDivElement>}
								pdfDetails={pdfDetails}
							/>
							<Toolbar
								viewerStates={viewerStates}
								containerRef={containerRef as React.RefObject<HTMLDivElement>}
								flipbookRef={flipbookRef as React.RefObject<HTMLDivElement>}
								screenfull={screenfull}
								pdfDetails={pdfDetails}
								shareUrl={shareUrl}
								disableShare={disableShare}
							/>
						</div>
					</TransformWrapper>
				)}
			</Document>
		</div>
	);
};

export default FlipbookViewer;
