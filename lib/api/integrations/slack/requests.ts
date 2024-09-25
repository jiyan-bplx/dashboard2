export interface GenerateSlackIntegrationUrlRequest {
	form_id: number;
}

export interface GetSlackChannelListByIntegrationIdRequest {
	integration_id: number;
}

export interface SetSlackChannelByIntegrationIdRequest {
	integration_id: number;
	channel_id: string;
	channel_name: string;
}

export interface SetExistingSlackIntegrationRequest {
	form_id: number;
	integration_id: number;
}
