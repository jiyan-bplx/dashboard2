import { AxiosResponse } from "axios";
import { API } from "../..";
import { GenerateDiscordIntegrationUrlRequest } from "./requests";
import { GenerateDiscordIntegrationUrlResponse } from "./responses";

export const generateDiscordIntegrationUrl = async (
	data: GenerateDiscordIntegrationUrlRequest
) => {
	const res = await API.post<
		GenerateDiscordIntegrationUrlResponse,
		AxiosResponse<GenerateDiscordIntegrationUrlResponse>,
		GenerateDiscordIntegrationUrlRequest
	>("/api/integration/discord", data);
	return res.data;
};
