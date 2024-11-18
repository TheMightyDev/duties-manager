
// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";
	
export function ProfileInfoBoxesSkeleton() {
	const className = "flex flex-col rounded-xl bg-slate-200 p-4 hover:bg-slate-300 flex-1 text-center ";
	
	return (
		<div>
			<h2 className="sticky top-0 h-12 bg-white/50 p-1 text-xl backdrop-blur-md">
				<div className={"w-30 overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm " + shimmer}>
				</div>
			</h2>
			<div className={"flex min-h-80 w-full flex-col gap-2 md:min-w-96 relative overflow-hidden " + shimmer}>
				<div className="flex flex-row gap-2">
					<div className={className}>
						<span className="text-4xl">0.00</span>
						<span>ניקוד משוקלל</span>
					</div>
					<div className={className}>
						<p><span className="text-4xl">0</span><span className="text-xl">/10</span></p>
						<span>דירוג בתפקיד</span>
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<div className={className}>
						<div className="m-auto my-2 h-8 w-14 rounded-xl bg-gray-300"></div>
						<div className="h-4 w-full rounded-xl bg-gray-300"></div>
					</div>
					<div className="bg-slate-300">
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<div className={className}>
						<span className="text-4xl">0</span>
						<span>שמירות ביום חול</span>
					</div>
					<div className={className}>
						<span className="text-4xl">0</span>
						<span>שמירות בסופ"ש</span>
					</div>
					<div className={className}>
						<p><span className="text-4xl">0</span>נק'</p>
						<span>תורנויות נוספות</span>
					</div>
				</div>
			</div>
		</div>
	);
};
