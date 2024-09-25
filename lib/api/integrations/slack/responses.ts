import { BaseResponse } from "../../types/responses";

export interface GenerateSlackIntegrationURLResponse
	extends BaseResponse<string> {}

export interface GetSlackChannelListByIntegrationIdResponse
	extends BaseResponse<SlackChannel[]> {}

export interface SetSlackChannelByIntegrationIdResponse
	extends BaseResponse<null> {}
export interface SlackChannel {
	id: string;
	created: number;
	is_open: boolean;
	is_group: boolean;
	is_shared: boolean;
	is_im: boolean;
	is_ext_shared: boolean;
	is_org_shared: boolean;
	is_pending_ext_shared: boolean;
	is_private: boolean;
	is_mpim: boolean;
	unlinked: number;
	name_normalized: string;
	num_members: number;
	priority: number;
	user: string;
	name: string;
	creator: string;
	is_archived: boolean;
	members: null;
	topic: {
		value: string;
		creator: string;
		last_set: number;
	};
	purpose: {
		value: string;
		creator: string;
		last_set: number;
	};
	is_channel: boolean;
	is_general: boolean;
	is_member: boolean;
	locale: string;
}

export interface SlackWorkspace {
	team_id: string;
	team_name: string;
	channels: ExistingSlackChannel[];
}

export interface ExistingSlackChannel {
	channel_id: string;
	channel_name: string;
	integration_id: string;
}
