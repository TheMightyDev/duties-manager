export enum UploadProgress {
	NOTHING_SUBMITTED,
	ERRONEOUS_DATA,
	CAN_BE_UPLOADED,
	UPLOAD_DONE,
}

export interface InitialParseResults {
	errorMessages: string[];
	/** Array of the parsed data of each line, if the parsing failed, the value is `undefined` */
	parsedInfoJson: string;
}
