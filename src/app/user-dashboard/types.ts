interface RangeSelection<T> {
	start: T;
	end: T;
}

export type DatesSelection = RangeSelection<Date>;
