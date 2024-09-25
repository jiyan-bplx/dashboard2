import { BaseResponse } from "../../types/responses";
export interface UpdateIntegrationByIdResponse extends BaseResponse<null> {}
export interface DeleteIntegrationByIdResponse extends BaseResponse<null> {}
export interface ListIntegrationsForFormResponse {
	data: Integration[];
	status: string;
}

export interface Integration {
	id: string;
	form_id: number;
	integration_type: string;
	token: string;
	error?: string | null;
	integration:
		| string
		| null
		| {
				[key: string]: any;
		  };
	connected: boolean;
	created_at: string;
	updated_at: string;
	is_active: boolean;
}
