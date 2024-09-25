import { AxiosResponse } from "axios";
import { API } from "../..";
import { ConnectWebhookToFormRequest } from "./requests";
import { ConnectWebhookToFormResponse } from "./responses";

export const connectWebhookToForm = async (
	data: ConnectWebhookToFormRequest
) => {
	const res = await API.post<
		ConnectWebhookToFormResponse,
		AxiosResponse<ConnectWebhookToFormResponse>,
		ConnectWebhookToFormRequest
	>("/api/integration/webhook", data);
	return res.data;
};
