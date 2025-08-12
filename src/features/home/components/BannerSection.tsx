'use client';

import { Headphones, Heart } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const BannerSection: React.FC = () => {
	return (
		<section className="max-w-[1280px] mx-auto px-4 mb-10">
			<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/40 backdrop-blur-xl">
				{/* Background visual */}
				<Image
					alt="Nền banner mềm với gradient"
					className="object-cover opacity-30 -z-10"
					fill
					sizes="100vw"
					src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1974&auto=format&fit=crop"
					priority
				/>

				<div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 p-5 md:p-8 lg:p-10">
					{/* Cover */}
					<div className="md:col-span-5 lg:col-span-4 flex items-center justify-center">
						<div className="relative w-full max-w-[420px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
							<Image
								alt="Bìa sách Cáo, Thỏ, Gà Trống"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 420px"
								src="https://storage.googleapis.com/a1aa/image/a2eaa805-0bfe-4c09-d01c-de95d5d039d5.jpg"
								priority
							/>
						</div>
					</div>

					{/* Details */}
					<div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
						<h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
							Cáo, Thỏ, Gà Trống
						</h1>

						<div className="mt-4 flex items-center gap-6 text-sm text-white/80">
							<div className="inline-flex items-center gap-2">
								<Headphones className="h-5 w-5" />
								<span>8 lượt nghe</span>
							</div>
							<div className="inline-flex items-center gap-2">
								<Heart className="h-5 w-5" />
								<span>1 lượt thích</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/90">
							<p>
								<span className="text-white/70">Thể loại:</span> Sách nói
							</p>
							<p>
								<span className="text-white/70">Hình thức:</span> Sách nói
							</p>
						</div>

						<div className="mt-7">
							<button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-white font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300">
								<Headphones className="h-5 w-5" />
								<span>NGHE ĐẦY ĐỦ</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BannerSection;
