import { API } from "../..";
import {
	ListIntegrationsForFormResponse,
	UpdateIntegrationByIdResponse,
	DeleteIntegrationByIdResponse,
} from "./responses";
import { UpdateIntegrationByIdRequest } from "./requests";
import { AxiosResponse } from "axios";

export const listIntegrationsForFormId = async (formId: number) => {
	const res = await API.get<ListIntegrationsForFormResponse>(
		`/api/integration/form/${formId}`
	);
	return res.data;
};

export const toggleIntegrationStateById = async (
	integrationId: string,
	data: UpdateIntegrationByIdRequest
) => {
	const res = await API.post<
		any,
		AxiosResponse<UpdateIntegrationByIdResponse>,
		any
	>(`/api/integration/${integrationId}`, data);
	return res.data;
};

export const deleteIntegrationById = async (integrationId: string) => {
	const res = await API.delete<DeleteIntegrationByIdResponse>(
		`/api/integration/${integrationId}`
	);
	return res.data;
};
