export interface GenerateS3SignedURLRequest {
	form_id: number;
	file_name: string;
}

export interface GenerateS3ObjectURLRequest {
	form_id: number;
	file_name: string;
}

export interface SetObjectMetaDataRequest {
	form_id: number;
	file_name: string;
	file_size: number;
	url: string;
	storage_provider: string;
	storage_location: string;
}
