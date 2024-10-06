import React from "react";

interface FloatingDialogClassicHeader {
	handleClose: () => void;
}

export const FloatingDialogClassicHeader: React.FC<FloatingDialogClassicHeader> = ({ handleClose }) => {
	return (
		<header className="flex justify-end p-0 md:rounded-t-xl ">
			<button
				onClick={handleClose}
				className="m-1 size-10 rounded-full hover:bg-gray-200"
			>
				X
			</button>
		</header>
	);
};
