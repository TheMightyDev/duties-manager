export function MaterialDesignInput() {
	return (
		<div className="w-72">
			<div className="relative h-10 w-full min-w-[200px]">
				<input
					className="peer size-full rounded-[7px] border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder:opacity-0 placeholder-shown:border placeholder-shown:border-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 focus:placeholder:opacity-100 disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-50"
					placeholder=" "
				/>
				<label className="pointer-events-none absolute -top-1.5 left-0 flex size-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-gray-200 before:transition-all before:content-['_'] after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:grow after:rounded-tr-md after:border-r after:border-t after:border-gray-200 after:transition-all after:content-['_'] peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500">Username</label>
			</div>
		</div>
	);
}
