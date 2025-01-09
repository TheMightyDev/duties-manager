
interface XyOffsets {
	xOffsetPx: number;
	yOffsetPx: number;
}

/**
 * Calculates the x and y coordinates in screen, where the floating dialog will be placed, aligned to the event mark. The function takes into account the dimensions of the screen and the floating dialog, and attempts to place the dialog so it will be displayed in its entirety without cuts.
 *
 * The x and y coordinates are the ones of the top-left edge of the dialog, as marked by the A:
 * A-------
 * |			|
 * --------
 *
 * Tries to place the floating dialog just after the event mark, in the flow of the specified text direction. E.g., if the text direction is `"ltr"`, it will attempt the floating dialog to the right, because it's read just after the event (the flow is left to right). For `"rtl"`, it's the opposite.
 *
 * @param eventMarkRect The return value of `getBoundingClientRect()` on the event mark on the calendar
 * @param floatingDialogRect The return value of `getBoundingClientRect()` on the floating dialog container
 * @param textDir (optional) expects either `"ltr"` or `"rtl"` (default)
 *
 * @returns desired x and y coordinates of the top-left edge of the dialog. The coordinates are offsets from the screen top-left edge.
 */
export function calcFloatingDialogLocation({
	eventMarkRect,
	floatingDialogRect,
	textDir = "rtl",
}: {
	eventMarkRect: DOMRect;
	floatingDialogRect?: DOMRect;
	// TODO: Implement different floating dialog placements based on text direction
	textDir?: "ltr" | "rtl";
}): XyOffsets {
	if (!floatingDialogRect) throw new Error("You must assign a ref to the floating dialog container, and pass the return value of `getBoundingClientRect()` on that element");
	
	const dialogWidthPx = floatingDialogRect.width;
	const dialogHeightPx = floatingDialogRect.height;
	// Note that `x` and `y` are the coordinates of the top-left corner
	// By default the dialog opens to the left of the event
	// to adapt to the natural flow of RTL
	let xOffsetPx = eventMarkRect.x - dialogWidthPx;
	// By the default the dialog opens inline with the event
	let yOffsetPx = eventMarkRect.y;
	if (textDir === "ltr") {
		throw new Error("Calculating the floating dialog position for `\"ltr\"` text direction isn't yet implemented");
	}
	if (textDir === "rtl") {
	// If there's isn't place to the left, tries to the right
		if (xOffsetPx < 0) {
			xOffsetPx = eventMarkRect.x + eventMarkRect.width;
		}
	
		// If there isn't enough place to the right as well (how sad)
		if (xOffsetPx + dialogWidthPx > document.documentElement.clientWidth) {
		// We move the dialog to the left edge, but not sticky
			xOffsetPx = eventMarkRect.x + eventMarkRect.width - dialogWidthPx;
			// And place it below the element
			yOffsetPx += eventMarkRect.height;
		}
	
		// If there isn't enough place to the bottom as well (embarrassing)
		//   A-----------
		//   |					|
		//   |					|
		// --- screen edge ----
		//   |					|
		//   ------------
		if (yOffsetPx + dialogHeightPx > document.documentElement.clientHeight) {
			yOffsetPx -= (dialogHeightPx - eventMarkRect.height);
		}
	}

	return {
		xOffsetPx,
		yOffsetPx,
	};
};
