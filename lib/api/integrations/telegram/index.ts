import { AxiosResponse } from "axios";
import { API } from "../..";
import { GenerateTelegramAuthCodeRequest } from "./requests";
import { GenerateTelegramAuthCodeResponse } from "./responses";

export const generateTelegramAuthCode = async (
	data: GenerateTelegramAuthCodeRequest
) => {
	const res = await API.post<
		GenerateTelegramAuthCodeResponse,
		AxiosResponse<GenerateTelegramAuthCodeResponse>,
		GenerateTelegramAuthCodeRequest
	>("/api/integration/telegram", data);
	return res.data;
};
