import { format } from "date-fns";

export function formatDate(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

export function getAllMonthNames({
	locale,
	format,
}: {
	locale: string;
	format: "long" | "short" | "narrow" | "numeric" | "2-digit";
}): string[] {
	const formatter = new Intl.DateTimeFormat(locale, {
		month: format,
		timeZone: "UTC",
	});
	
	const months = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map(month => {
		return new Date(
			// Any year would work
			2017, month, 1
		);
	});

	return months.map(date => formatter.format(date));
}

export function getWeekday({
	date,
	locale,
}: {
	date: Date;
	locale: string;
}) {
	const formatterWeekday = new Intl.DateTimeFormat(locale, {
		weekday: "narrow",
	});

	return formatterWeekday.format(date);
}

export function getDateFormatted({
	date,
	locale,
}: {
	date: Date;
	locale: string;
}): string {
	const formatter = new Intl.DateTimeFormat(locale, {
		dateStyle: "long",
		// hour: "2-digit",
		// weekday: "short",
		timeZone: "UTC",
	});
	
	return formatter.format(date) + " " + getWeekday({
		date,
		locale,
	});
}

function padZero(num: number): string {
	return (num < 10) ? `0${String(num)}` : String(num);
}

/**
 * Returns a string with the date formatted as HH:MM (e.g. 09:05)
 */
export function formatHhMm(date: Date): string {
	return `${padZero(date.getUTCHours())}:${padZero(date.getUTCMinutes())}`;
}
