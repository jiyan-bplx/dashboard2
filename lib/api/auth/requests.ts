import { Address } from "../../../types";

export type LoginRequest = {
	email: string;
	password: string;
};

export interface SignupRequest {
	email: string;
	name: string;
	password: string;
	passwordConfirm: string;
	photo?: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}

export interface SendVerificationEmailRequest {
	email: string;
}

export interface EditUserRequest {
	name?: string | null;
	address?: Address | null;

	requested_gdpr?: boolean | null;
	requested_hippa?: boolean | null;
	data_center_location?: string | null;
}
