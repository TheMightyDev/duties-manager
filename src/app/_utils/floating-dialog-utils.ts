interface XyOffsets {
	xOffsetPx: number;
	yOffsetPx: number;
}

export function calcFloatingDialogLocation({
	rect,
	dialogWidthPx,
}: {
	rect: DOMRect;
	dialogWidthPx: number;
}): XyOffsets {
	// Note that `x` and `y` are the coordinates of the top-left corner
	// By default the dialog opens to the left of the event
	// to adapt to the natural flow of RTL
	let xOffsetPx = rect.x - dialogWidthPx;
	// By the default the dialog opens inline with the event
	let yOffsetPx = rect.y;
			
	console.log("@initial xOffsetPx", xOffsetPx, "@rect.x", rect.x);
			
	// If there's isn't place to the left, tries to the right
	if (xOffsetPx < 0) {
		xOffsetPx = rect.x + rect.width;
	}
			
	// If there isn't enough place to the right as well (how sad)
	if (xOffsetPx + dialogWidthPx > document.documentElement.clientWidth) {
		// We move the dialog to the left edge, but not sticky
		xOffsetPx = rect.x + rect.width - dialogWidthPx;
		// And place it below the element
		yOffsetPx += rect.height;
	}
			
	return {
		xOffsetPx,
		yOffsetPx,
	};
};
