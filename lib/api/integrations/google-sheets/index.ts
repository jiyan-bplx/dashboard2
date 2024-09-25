import { AxiosResponse } from "axios";
import { API } from "../..";
import { GenerateGoogleSheetsIntegrationUrlRequest } from "./requests";
import { GenerateGoogleSheetsIntegrationURLResponse } from "./response";

export const generateGoogleSheetsIntegrationUrl = async (
	data: GenerateGoogleSheetsIntegrationUrlRequest
) => {
	const res = await API.post<
		GenerateGoogleSheetsIntegrationURLResponse,
		AxiosResponse<GenerateGoogleSheetsIntegrationURLResponse>,
		GenerateGoogleSheetsIntegrationUrlRequest
	>("/api/integration/google/sheets", data);
	return res.data;
};
