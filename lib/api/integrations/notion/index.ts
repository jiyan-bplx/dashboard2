import { AxiosResponse } from "axios";
import { API } from "../..";
import {
	GenerateNotionIntegrationUrlRequest,
	CreateDatabaseForNotionRequest,
} from "./requests";
import {
	GenerateNotionIntegrationURLResponse,
	NotionPagesListResponse,
	CreateDatabaseForNotionResponse,
} from "./response";

export const generateNotionIntegrationUrl = async (
	data: GenerateNotionIntegrationUrlRequest
) => {
	const res = await API.post<
		GenerateNotionIntegrationURLResponse,
		AxiosResponse<GenerateNotionIntegrationURLResponse>,
		GenerateNotionIntegrationUrlRequest
	>("/api/integration/notion", data);
	return res.data;
};

export const getPagesForNotion = async (integrationId: number) => {
	const res = await API.post<NotionPagesListResponse>(
		"/api/integration/notion/pages",
		{
			integration_id: integrationId,
		}
	);

	return res.data;
};

export const createDatabaseForNotionPage = async (
	data: CreateDatabaseForNotionRequest
) => {
	const res = await API.post<CreateDatabaseForNotionResponse>(
		"/api/integration/notion/database/create",
		data
	);
	return res.data;
};
