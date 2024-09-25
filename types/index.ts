import { InputTypes } from "../data/Inputs";

export type FieldConditionType = {
	action: string;
	actionElement: string;
	condition: string;
	conditionValue?: string | number;
};
export type InputItemExtraProps = {
	placeholder?: string;
	id: string;
	minLength?: number;
	maxLength?: number;
	min?: number | string;
	max?: number | string;
	includeCountryCode?: boolean;
	pattern?: string;
	checked?: boolean;
	defaultValue?: any;
	instructions?: any;
	multiple?: boolean;
	accept?: string;
	required?: boolean;
	hideFieldLabel?: boolean;
	unique?: boolean;
	about?: string;
	width?: "full" | "half";
	options?: string[] | any;
	answer?: string[] | string;
	image?: string;
	page?: number;
	display?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	conditions?: FieldConditionType[];
};
export type InputTypeItem = (typeof InputTypes)[number] & InputItemExtraProps;
export type InputTypeWithoutIcon = Omit<InputTypeItem, "icon">;
export interface CommonInputProps {
	label?: string;
	theme?: "light" | "dark";
	error?: string;
	hideFieldLabel?: boolean;
	readOnly?: boolean;
}

export interface Address {
	line1: string;
	line2?: string | null;
	city: string;
	country: string;
	postal_code: string;
	state: string;
}

export interface MapGeoItem {
	type: string;
	id: string;
	properties: Properties;
	geometry: Geometry;
	rsmKey: string;
	svgPath: string;
}

export interface Geometry {
	type: string;
	coordinates: Array<Array<number[]>>;
}

export interface Properties {
	name: string;
}
