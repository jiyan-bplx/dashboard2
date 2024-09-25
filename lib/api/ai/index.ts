import { AxiosResponse } from "axios";
import { API } from "..";
import { GenerateAiFormRequest } from "./requests";
import { GenerateAiFormResponse } from "./response";

export const generateAiForm = async (data: GenerateAiFormRequest) => {
	const res = await API.post<
		any,
		AxiosResponse<GenerateAiFormResponse>,
		GenerateAiFormRequest
	>(`/api/ai/generate-form`, data);
	return res.data;
};
