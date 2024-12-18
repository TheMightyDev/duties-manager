export const checkIfOnlyWhitespaceStr = (str: string) => !/\S/.test(str);

export function splitToLinesAndFilterEmpty(str: string): string[] {
	return str
		.split(/\r?\n/g)
		.filter((line) => !checkIfOnlyWhitespaceStr(line));
}
