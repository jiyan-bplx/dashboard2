import { AxiosResponse } from "axios";
import { API } from "..";
import {
	GenerateS3ObjectURLRequest,
	GenerateS3SignedURLRequest,
	SetObjectMetaDataRequest,
} from "./requests";

import {
	GenerateS3SignedURLResponse,
	GetAccountUsedSpaceResponse,
	SetObjectMetaDataResponse,
} from "./responses";

export const generateS3SignedUrl = async (data: GenerateS3SignedURLRequest) => {
	const res = await API.post<
		GenerateS3SignedURLRequest,
		AxiosResponse<GenerateS3SignedURLResponse>
	>(`/api/upload/get-presigned-url`, data);
	return res.data;
};

export const uploadToS3 = async (url: string, file: File) => {
	const res = await API.post<
		GenerateS3SignedURLRequest,
		GenerateS3SignedURLResponse
	>(`/api/upload/get-presigned-url`);
	return res.data;
};

export const getS3ObjectUrl = async (data: GenerateS3ObjectURLRequest) => {
	const res = await API.post<
		GenerateS3SignedURLRequest,
		AxiosResponse<GenerateS3SignedURLResponse>
	>(`/api/upload/get-object-presigned-url`, {
		...data,
		file_name: decodeURI(data.file_name),
	});
	return res.data;
};

export const getAccountUsedSpace = async () => {
	const res = await API.get<
		GetAccountUsedSpaceResponse,
		AxiosResponse<GetAccountUsedSpaceResponse>
	>(`/api/upload/get-used-space-by-user`);
	return res.data;
};

export const setObjectMetadata = async (data: SetObjectMetaDataRequest) => {
	const res = await API.post<
		SetObjectMetaDataRequest,
		AxiosResponse<SetObjectMetaDataResponse>
	>(`/api/upload/set-object-meta-data`, data);
	return res.data;
};
