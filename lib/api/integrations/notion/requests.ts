export interface GenerateNotionIntegrationUrlRequest {
	form_id: number;
}

export interface CreateDatabaseForNotionRequest {
	integration_id: number;
	page_id: string;
}
