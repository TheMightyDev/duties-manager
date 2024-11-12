
export function ProfileInfoBoxesSkeleton() {
	const className = "flex flex-col rounded-xl bg-slate-200 p-4 hover:bg-slate-300 flex-1 text-center";
	
	return (
		<div className="flex min-h-80 w-full flex-col gap-2 md:min-w-96">
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
					<span className="text-4xl">0</span>
					<span>חודשים בתפקיד</span>
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
	);
};
