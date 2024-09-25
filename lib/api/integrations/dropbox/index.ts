import { AxiosResponse } from "axios";
import { API } from "../..";
import { InitDropboxIntegrationParams } from "./requests";
import { InitDropboxIntegrationResponse } from "./response";

export const initDropboxIntegration = async (
	data: InitDropboxIntegrationParams
) => {
	const res = await API.post<
		InitDropboxIntegrationResponse,
		AxiosResponse<InitDropboxIntegrationResponse>,
		InitDropboxIntegrationParams
	>("/api/integration/dropbox", data);
	return res.data;
};
