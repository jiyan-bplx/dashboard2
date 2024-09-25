import { API } from "..";
import { sleep } from "@utils/index";
import { BaseResponse } from "../types/responses";
import { CreateCheckoutSessionRequest } from "./requests";
import {
	CreateCheckoutSessionResponse,
	GetActiveSubscriptionResponse,
	GetAllPlansResponse,
	GetCheckoutSessionResponse,
	GetPlanLimitsResponse,
	GetSubscriptionsResponse,
} from "./responses";

export const getSubscriptions = async () => {
	const res = await API.get<GetSubscriptionsResponse>(`/api/subscription`);
	return res.data;
};

export const getAllPlans = async () => {
	const res = await API.get<GetAllPlansResponse>(`/api/plans`);
	return res.data;
};

export const getActiveSubscription = async () => {
	const res = await API.get<GetActiveSubscriptionResponse>(
		`/api/subscription/active`
	);
	return res.data;
};

export const getPlanLimits = async () => {
	const res = await API.get<GetPlanLimitsResponse>(
		`/api/subscription/limits`
	);
	return res.data;
};

export const checkSubscription = async () => {
	const res = await API.get<BaseResponse<boolean>>(`/api/subscription/check`);
	return res.data;
};

export const createCheckoutSession = async (
	data: CreateCheckoutSessionRequest
) => {
	const res = await API.post<CreateCheckoutSessionResponse>(
		`/api/payment/checkout-session`,
		data
	);
	return res.data;
};

export const billingPortalSession = async () => {
	const res = await API.post<CreateCheckoutSessionResponse>(
		`/api/payment/portal`
	);
	return res.data;
};

export const getCheckoutSession = async (sessionId: string) => {
	const res = await API.get<GetCheckoutSessionResponse>(
		`/api/payment/checkout-session?session_id=${sessionId}`
	);
	return res.data;
};
