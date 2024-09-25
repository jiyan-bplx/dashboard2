import { BaseResponse } from "../../types/responses";

export interface InitDropboxIntegrationResponse extends BaseResponse<string> {}

export interface DropboxFileUploadResponse {
	name: string;
	path_lower: string;
	path_display: string;
	id: string;
	client_modified: string;
	server_modified: string;
	rev: string;
	size: number;
	is_downloadable: boolean;
	content_hash: string;
}
