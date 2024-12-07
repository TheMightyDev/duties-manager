export function ProfileHeaderSkeleton() {
	return (
		<>
			<h2 className="sticky top-0 flex h-12  w-full flex-row justify-center gap-2 bg-white/50 p-1 text-xl backdrop-blur-md lg:justify-start">
				<div className={"h-8 w-44  animate-pulse overflow-hidden rounded-xl bg-slate-200 shadow-sm"}>
				</div>
				<div className={"h-8 w-44  animate-pulse overflow-hidden rounded-xl bg-slate-200 shadow-sm"}>
				</div>
			</h2>
		</>
	);
};
