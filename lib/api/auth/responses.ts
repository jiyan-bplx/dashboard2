import { Address } from "../../../types";
import { BaseResponse } from "../types/responses";

export interface LoginResponse extends BaseResponse<null> {}
export interface CurrentUserResponse extends BaseResponse<User> {}

export type RegisterResponse = CurrentUserResponse;

export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	provider: string;
	photo: string;
	verified: boolean;
	stripe_customer_id: string;
	address: Address | null;
	created_at: string;
	updated_at: string;
	data_center_location?: string | null;
	requested_hippa?: boolean | null;
	requested_gdpr?: boolean | null;
}

export interface ForgotPasswordResponse extends BaseResponse<null> {}
export interface SendVerificationEmailResponse extends BaseResponse<null> {}
export interface ResetPasswordResponse extends BaseResponse<null> {}
