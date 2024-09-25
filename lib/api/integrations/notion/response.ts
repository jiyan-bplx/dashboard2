import { BaseResponse } from "../../types/responses";

export interface GenerateNotionIntegrationURLResponse
	extends BaseResponse<string> {}

export interface NotionPagesListResponse
	extends BaseResponse<NotionPagesList> {}

export interface CreateDatabaseForNotionResponse extends BaseResponse<string> {}
export interface NotionPagesList {
	results: NotionPage[];
	has_more: boolean;
	next_cursor: null;
}

export interface NotionPage {
	id: string;
	title: {
		plain_text: string;
	}[];
	created_time: string;
	created_by: TedBy;
	last_edited_time: string;
	last_edited_by: TedBy;
	parent: Parent;
	archived: boolean;
	url: string;
	properties: Properties;
}

export interface TedBy {
	id: string;
}

export interface Parent {
	type: string;
	workspace: boolean;
}

export interface Properties {
	[key: string]: Property;
}

export interface Property {
	title: any[];
}
