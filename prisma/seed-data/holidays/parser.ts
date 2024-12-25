import jewishHolidays from "./jewish-holidays-2023-2026.json";

console.log("@jewishHolidays", jewishHolidays);

const parsedData = jewishHolidays.items
	// According to a religious person, this "fast" isn't actually followed upon religious people
	.filter((item) => item.title !== "Ta’anit Bechorot")
	.map((item) => ({
		name: item.title,
		date: item.date,
		hebrewName: item.hebrew,
		category: item.category,
		subCategory: item.subcat,
	}));

console.log("@parsedData", parsedData);
