import axios, { AxiosResponse } from "axios";
import { API } from "..";
import {
	CheckFormPasswordRequest,
	CreateFormAnalyticsDataRequests,
	CreateFormRequest,
	DeleteMultipleFormResponsesRequest,
	ShareFormInEmailRequest,
} from "./requests";
import {
	CreateFormResponse,
	DeleteFormResponse,
	DeleteFormResponseResponse,
	GetAllFormsResponse,
	GetFormByIdResponse,
	GetFormResponsesResponse,
	SubmitFormResponseResponse,
	CheckFormPasswordResponse,
	GetFormAnalyticsResponse,
	FormItem,
	GetFormResponseByIdResponse,
} from "./responses";
import { TurnstileAPIResponse } from "../../../pages/api/validate-turnstile";
import { BaseResponse } from "../types/responses";

export const checkFormPassword = async (data: CheckFormPasswordRequest) => {
	const res = await API.post<
		any,
		AxiosResponse<CheckFormPasswordResponse>,
		CheckFormPasswordRequest
	>(`/f/check-password`, data);

	return res.data;
};
export const createForm = async (data: CreateFormRequest) => {
	const res = await API.post<
		any,
		AxiosResponse<CreateFormResponse>,
		CreateFormRequest
	>(`/api/form`, data);
	return res.data;
};

export const getAllForms = async () => {
	const res = await API.get<GetAllFormsResponse>(`/api/form`, {});
	return res.data;
};

export const getFormById = async (formId: number) => {
	const res = await API.get<GetFormByIdResponse>(`/api/form/${formId}`);
	return res.data;
};
export const getFormResponseById = async (formResponseId: number) => {
	const res = await API.get<GetFormResponseByIdResponse>(
		`/api/form/response/${formResponseId}`
	);
	return res.data;
};

export const getFormByPublicId = async (
	formPublicId: string,
	headers?: {
		[key: string]: string;
	}
) => {
	const res = await API.get<GetFormByIdResponse>(`/f/${formPublicId}`, {
		headers,
	});
	return res.data;
};

export const deleteFormById = async (formId: number) => {
	const res = await API.delete<DeleteFormResponse>(`/api/form/${formId}`);
	return res.data;
};

export const editForm = async (formId: number, data: CreateFormRequest) => {
	const res = await API.post<GetFormByIdResponse>(
		`/api/form/${formId}`,
		data
	);
	return res.data;
};

export const getFormResponsesForFormId = async (
	formId: number,
	params: {
		limit?: number;
		after?: string | null;
		before?: string | null;
		order?: "asc" | "desc";
		query?: string | null;
	} = {
		limit: 10,
	}
) => {
	const res = await API.get<GetFormResponsesResponse>(
		`/api/form/responses/${formId}`,
		{
			params,
		}
	);
	return res.data;
};

export const deleteFormResponseById = async (formResponseId: string) => {
	const res = await API.delete<DeleteFormResponseResponse>(
		`/api/form/response/${formResponseId}`
	);
	return res.data;
};

export const deleteMultipleFormResponseById = async (
	data: DeleteMultipleFormResponsesRequest
) => {
	const res = await API.post<
		DeleteFormResponseResponse,
		AxiosResponse<DeleteFormResponseResponse>,
		DeleteMultipleFormResponsesRequest
	>(`/api/form/delete-responses/`, data);
	return res.data;
};

export const exportFormResponses = async (
	formId: string | number,
	type: "csv" | "xlsx" | undefined = "csv"
) => {
	const res = await API.get(`/api/form/export/${type}/${formId}`, {
		responseType: "blob",
	});
	return res.data;
};

export const submitFormResponse = async (publicFormId: string, data: any) => {
	const res = await API.post<any, AxiosResponse<SubmitFormResponseResponse>>(
		`/r/${publicFormId}`,
		data
	);
	return res.data;
};

export const getFormAnalytics = async (
	formId: number,
	params: {
		from_date?: string;
		to_date?: string;
	} | null
) => {
	const res = await API.get<any, AxiosResponse<GetFormAnalyticsResponse>>(
		`/api/form/analytics/${formId}`,
		{
			params,
		}
	);
	return res.data;
};

export const createFormAnalytics = async (
	data: CreateFormAnalyticsDataRequests
) => {
	const res = await API.post<
		any,
		AxiosResponse<CreateFormResponse>,
		CreateFormAnalyticsDataRequests
	>(`/a/analytics`, data);
	return res.data;
};

const threshold = 0.6;

export async function validateRecaptcha(recaptchaToken: string): Promise<{
	valid: boolean;
	score: number;
	action: string;
	hostname: string;
	success: boolean;
}> {
	const res = await axios.post(`/api/validate-recaptcha`, {
		token: recaptchaToken,
	});
	return {
		valid: res.data.score >= threshold,
		...res.data,
	};
}

export async function validateTurnstile(
	token: string
): Promise<TurnstileAPIResponse> {
	const res = await axios.post(`/api/validate-turnstile`, {
		token: token,
	});
	return res.data;
}

export const shareFormInEmail = async (
	formId: FormItem["id"],
	data: ShareFormInEmailRequest
) => {
	const res = await API.post<
		BaseResponse<any>,
		AxiosResponse<BaseResponse<any>>,
		ShareFormInEmailRequest
	>(`/api/form/share/${formId}`, data);
	return res.data;
};

export const shareAMPFormInEmail = async (
	formId: FormItem["id"],
	data: ShareFormInEmailRequest
) => {
	const res = await API.post<
		BaseResponse<any>,
		AxiosResponse<BaseResponse<any>>,
		ShareFormInEmailRequest
	>(`/api/form/amp/share/${formId}`, data);
	return res.data;
};
