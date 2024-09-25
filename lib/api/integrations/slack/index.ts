import { AxiosResponse } from "axios";
import { API } from "../..";
import {
	GenerateSlackIntegrationUrlRequest,
	SetSlackChannelByIntegrationIdRequest,
	GetSlackChannelListByIntegrationIdRequest,
	SetExistingSlackIntegrationRequest,
} from "./requests";
import {
	GenerateSlackIntegrationURLResponse,
	GetSlackChannelListByIntegrationIdResponse,
	SetSlackChannelByIntegrationIdResponse,
} from "./responses";

export const generateSlackIntegrationUrl = async (
	data: GenerateSlackIntegrationUrlRequest
) => {
	const res = await API.post<
		GenerateSlackIntegrationURLResponse,
		AxiosResponse<GenerateSlackIntegrationURLResponse>,
		GenerateSlackIntegrationUrlRequest
	>("/api/integration/slack", data);
	return res.data;
};

export const getChannelListByIntegrationId = async (
	data: GetSlackChannelListByIntegrationIdRequest
) => {
	const res = await API.post<
		GetSlackChannelListByIntegrationIdResponse,
		AxiosResponse<GetSlackChannelListByIntegrationIdResponse>,
		GetSlackChannelListByIntegrationIdRequest
	>("/api/integration/slack/channel-list", data);
	return res.data;
};

export const setChannelByIntegrationId = async (
	data: SetSlackChannelByIntegrationIdRequest
) => {
	const res = await API.post<
		SetSlackChannelByIntegrationIdResponse,
		AxiosResponse<SetSlackChannelByIntegrationIdResponse>,
		SetSlackChannelByIntegrationIdRequest
	>("/api/integration/slack/set-channel", data);
	return res.data;
};

export const getExistingSlackIntegration = async () => {
	const res = await API.get("/api/integration/slack/existing");
	return res.data;
};

export const setExistingSlackIntegration = async (
	data: SetExistingSlackIntegrationRequest
) => {
	const res = await API.post("/api/integration/slack/existing", data);
	return res.data;
};
