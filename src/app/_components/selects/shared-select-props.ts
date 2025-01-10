export interface SharedSelectProps<T> {
	availableValues?: T[];
	currentValue?: T;
	defaultValue?: T;
	handleValueChange: (value: T) => void;
}
