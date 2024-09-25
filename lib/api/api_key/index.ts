import { API } from "..";
import { BaseResponse } from "../types/responses";
import { ApiKeyUpdateData } from "./requests";
import { GenerateAPIKeyResponse, ListAPIKeyResponse } from "./responses";

export const generateAPIKey = async (name: string) => {
	const res = await API.post<GenerateAPIKeyResponse>("/api/key/generate", {
		name,
	});
	return res.data;
};

export const listAPIKeys = async () => {
	const res = await API.get<ListAPIKeyResponse>("/api/key");
	return res.data;
};

export const updateApiKey = async (keyId: number, data: ApiKeyUpdateData) => {
	const res = await API.post<BaseResponse<null>>(
		"/api/key/update/" + keyId,
		data
	);
	return res.data;
};

export const deleteApiKey = async (keyId: number) => {
	const res = await API.delete<BaseResponse<null>>("/api/key/" + keyId);
	return res.data;
};
