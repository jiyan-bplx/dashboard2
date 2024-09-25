import { InputTypeWithoutIcon } from "../../../types";
import { BaseResponse } from "../types/responses";
import { FormOptions, PageSettings } from "./requests";

export interface GetFormAnalyticsResponse
	extends BaseResponse<FormAnalyticsResponseItem> {}

export interface AnalyticsDataItem {
	by_country: {
		country: string;
		count: number;
	}[];
	by_date: {
		date: string;
		count: number;
	}[];
}

export interface FormAnalyticsResponseItem {
	analytics_data?: AnalyticsDataItem | null;
	open_count: number;
	submission_count: number;
}

export interface CheckFormPasswordResponse extends BaseResponse<null> {}
export interface DeleteFormResponse extends BaseResponse<null> {}
export interface GetFormByIdResponse extends BaseResponse<FormItem> {}
export interface GetFormResponseByIdResponse
	extends BaseResponse<FormResponse> {}
export interface GetAllFormsResponse extends BaseResponse<FormItem[]> {}

export interface DeleteFormResponseResponse extends BaseResponse<FormItem> {}
export interface CreateFormResponse extends BaseResponse<FormItem> {}
export interface FormItem {
	id: number;
	name: string;
	user_id: number;
	public_id: string;
	body: InputTypeWithoutIcon[] | undefined | null;
	pages: PageSettings[] | undefined | null;
	is_custom?: boolean;
	form_type?: "form" | "quiz";
	created_at: string;
	updated_at: string;
	options?: FormOptions;
	workspace_id?: number;
}

export interface FormResponse {
	created_at: string;
	id: number;
	response: {
		[key: string]: any;
	};
	score?: number;
	total_score?: number;
	updated_at: string;
}

export interface GetFormResponsesResponse extends BaseResponse<FormResponse[]> {
	count: number;
	cursor?: {
		after: string | null;
		before: string | null;
	};
}

export interface SubmitFormResponseResponse extends BaseResponse<null> {}
