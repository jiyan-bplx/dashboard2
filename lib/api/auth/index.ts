import { AxiosResponse } from "axios";
import { API } from "..";
import { BaseResponse } from "../types/responses";
import {
	EditUserRequest,
	LoginRequest,
	ResetPasswordRequest,
	SignupRequest,
	SendVerificationEmailRequest,
} from "./requests";
import {
	CurrentUserResponse,
	ForgotPasswordResponse,
	LoginResponse,
	RegisterResponse,
	SendVerificationEmailResponse,
} from "./responses";

export const registerUser = async (data: SignupRequest) => {
	const res = await API.post<
		any,
		AxiosResponse<RegisterResponse>,
		SignupRequest
	>(`/api/auth/register`, data);
	return res.data;
};

export const loginUser = async (data: LoginRequest) => {
	const res = await API.post<any, AxiosResponse<LoginResponse>, LoginRequest>(
		`/api/auth/login`,
		data
	);
	return res.data;
};

export const getCurrentUser = async () => {
	const res = await API.get<CurrentUserResponse>(`/api/user/me`);
	return res.data;
};

export const logoutUser = async () => {
	const res = await API.get<BaseResponse<null>>(`/api/auth/logout`);
	return res.data;
};

export const deleteAccount = async (data: { password: string }) => {
	const res = await API.post<BaseResponse<null>>(`/api/user/delete-me`, data);
	return res.data;
};

export const sendPasswordResetEmail = async (email: string) => {
	const res = await API.post<ForgotPasswordResponse>(
		`/api/auth/forgot-password`,
		{ email }
	);
	return res.data;
};

export const sendVerificationEmail = async (email: string) => {
	const res = await API.post<
		any,
		AxiosResponse<SendVerificationEmailResponse>,
		SendVerificationEmailRequest
	>(`/api/auth/send-verification-email`, { email });
	return res.data;
};

export const verifyEmail = async (token: string) => {
	const res = await API.post<BaseResponse<null>>(`/api/auth/verify-email`, {
		token,
	});
	return res.data;
};

export const editUser = async (data: EditUserRequest) => {
	const res = await API.post<CurrentUserResponse>(`/api/user/me`, data);
	return res.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
	const res = await API.post<BaseResponse<null>>(
		`/api/auth/reset-password`,
		data
	);
	return res.data;
};

export const getDataCenterLocations = async () => {
	return {
		data: [
			{
				name: "New York, USA",
				id: "ny3",
			},
		],
	};
};
