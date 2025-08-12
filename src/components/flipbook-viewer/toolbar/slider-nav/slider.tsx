'use client';

import { useEffect, useRef, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import HoverItem from './hover-item';

interface SliderProps {
	maxSlide?: number;
	currentSlide: number;
	onSlideChange: (slide: number) => void;
	totalPages: number;
}

interface SliderProps {
	maxSlide?: number;
	currentSlide: number;
	onSlideChange: (slide: number) => void;
	totalPages: number;
}

const Slider = ({
	maxSlide = 10,
	currentSlide,
	onSlideChange,
	totalPages,
}: SliderProps) => {
	const [value, setValue] = useState(1);
	const [hoverValue, setHoverValue] = useState<number | null>(null);
	const [thumbPosition, setThumbPosition] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
	const sliderRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	// Update thumb position on value & screen size change >>>>>>>>>
	useEffect(() => {
		const updateThumbPosition = () => {
			if (sliderRef.current && !dragging) {
				const sliderRect = sliderRef.current.getBoundingClientRect();
				const sliderWidth = sliderRect.width;
				const newPosition = ((value - 1) / (maxSlide - 1)) * sliderWidth;
				setThumbPosition(newPosition);
			}
		};
		updateThumbPosition();
		window.addEventListener('resize', updateThumbPosition);
		return () => window.removeEventListener('resize', updateThumbPosition);
	}, [value, maxSlide, dragging]);

	// Handle onClick to change slide >>>>>>>>>
	const handleSlideChange = (e: React.MouseEvent) => {
		if (sliderRef.current) {
			const rect = sliderRef.current.getBoundingClientRect();
			const clickedValue = Math.min(
				Math.max(
					1,
					Math.round(
						((e.clientX - rect.left) / rect.width) * (maxSlide - 1) + 1
					)
				),
				maxSlide
			);
			setValue(clickedValue);
		}
	};

	// Handle hover value tooltip >>>>>>>>>
	const handlePointerMove = (e: React.MouseEvent) => {
		if (sliderRef.current && tooltipRef.current && !dragging) {
			const rect = sliderRef.current.getBoundingClientRect();
			const hoverValue = Math.min(
				Math.max(
					1,
					Math.round(
						((e.clientX - rect.left) / rect.width) * (maxSlide - 1) + 1
					)
				),
				maxSlide
			);
			setHoverValue(hoverValue);
			const tooltipWidth =
				tooltipRef.current?.getBoundingClientRect().width || 0;
			const tooltipHeight =
				tooltipRef.current?.getBoundingClientRect().height || 0;
			const tooltipLeft = Math.max(
				0,
				Math.min(
					e.clientX - rect.left - tooltipWidth / 2,
					rect.width - tooltipWidth
				)
			);
			const tooltipTop = Math.max(
				0,
				Math.min(
					e.clientY - rect.top - 20 - tooltipHeight / 2,
					rect.height - tooltipHeight
				)
			);
			setTooltipPosition({ left: tooltipLeft, top: tooltipTop });
		}
	};

	// Hide hover value tooltip >>>>>>>>>
	const handlePointerLeave = () => {
		setHoverValue(null);
	};

	// Hide hover value tooltip on drag end >>>>>>>>>
	useEffect(() => {
		if (!dragging) {
			handlePointerLeave();
		}
	}, [dragging]);

	// Update value on slide change >>>>>>>>>
	useEffect(() => {
		setValue(currentSlide);
	}, [currentSlide]);

	// Update debounced value on slide change >>>>>>>>>
	const debouncedValue = useDebounce(value, 500);
	useEffect(() => {
		onSlideChange(debouncedValue);
	}, [debouncedValue, onSlideChange]);
	return (
		<div className="py-4">
			<div
				ref={sliderRef}
				className="relative w-full h-1 bg-foreground rounded-full"
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				onPointerCancel={handlePointerLeave}
			>
				<div
					className="absolute z-20 size-1 bg-primary rounded-full cursor-pointer"
					style={{ left: thumbPosition }}
					onMouseDown={(e) => {
						setDragging(true);
						const handleMouseMove = (moveEvent: MouseEvent) => {
							if (sliderRef.current) {
								const rect = sliderRef.current.getBoundingClientRect();
								const newPosition = Math.max(
									0,
									Math.min(moveEvent.clientX - rect.left, rect.width)
								);
								const newValue = Math.min(
									Math.max(
										1,
										Math.round((newPosition / rect.width) * (maxSlide - 1) + 1)
									),
									maxSlide
								);
								setValue(newValue);
								setHoverValue(newValue);
								setThumbPosition(newPosition);
							}
						};
						const handleMouseUp = () => {
							setDragging(false);
							document.removeEventListener('mousemove', handleMouseMove);
							document.removeEventListener('mouseup', handleMouseUp);
						};
						document.addEventListener('mousemove', handleMouseMove);
						document.addEventListener('mouseup', handleMouseUp);
					}}
				>
					<div
						className={cn(
							'size-3 hover:size-4 bg-primary absolute -top-1 hover:-top-1.5 -left-1 hover:-left-1.5 rounded-full transition-all',
							dragging && 'w-3 h-3 -left-1.5 -top-1.5 rounded-full'
						)}
					></div>
				</div>
				{/* // Click to change slide >>>>>>>>> */}
				<div
					className="absolute inset-0 cursor-pointer w-full h-3 top-1/2 -translate-y-1/2 bg-transparent"
					onClick={handleSlideChange}
				/>
				{/* // Tooltip for hover value >>>>>>>>> */}
				<div
					ref={tooltipRef}
					className={cn(
						'bg-primary/20 backdrop-blur-sm text-white rounded p-2 text-xs w-fit h-fit',
						hoverValue === null && 'opacity-0 w-0 h-0 select-none'
					)}
					style={{
						position: 'absolute',
						left: tooltipPosition.left,
						bottom: '20px',
					}}
				>
					<HoverItem
						slide={hoverValue}
						totalPages={totalPages}
						totalSlides={maxSlide}
					/>
				</div>
			</div>
		</div>
	);
};

export default Slider;
