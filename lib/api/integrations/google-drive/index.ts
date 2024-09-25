import axios, { AxiosResponse } from "axios";
import { API } from "../..";
import { InitGoogleDriveIntegrationParams } from "./requests";
import {
	GoogleDriveFileUploadResponse,
	InitGoogleDriveIntegrationResponse,
} from "./response";

export const initGoogleDriveIntegration = async (
	data: InitGoogleDriveIntegrationParams
) => {
	const res = await API.post<
		InitGoogleDriveIntegrationResponse,
		AxiosResponse<InitGoogleDriveIntegrationResponse>,
		InitGoogleDriveIntegrationParams
	>("/api/integration/google/drive", data);
	return res.data;
};

export const generateAuthTokenForDrive = async (formId: number) => {
	const res = await API.post(`/api/integration/google/drive`, {
		form_id: formId.toString(),
	});
	return res.data;
};

export const uploadFileToGoogleDrive = async (
	formId: number,
	file: File,
	token: string,
	fieldName?: string
) => {
	const res = await axios.post<GoogleDriveFileUploadResponse>(
		"https://www.googleapis.com/upload/drive/v3/files?uploadType=media",
		file,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return res.data;
};

export const downloadFileFromGoogleDrive = async (
	fileId: string,
	token: string
) => {
	const res = await axios.post(
		`https://www.googleapis.com/drive/v2/files/${fileId}?alt=media`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return res.data;
};
