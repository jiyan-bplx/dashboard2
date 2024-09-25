import { useMemo } from "react";
import { useQuery } from "react-query";
import { getAllPlans } from "@api/subscriptions";
import { GetAllPlansResponse } from "@api/subscriptions/responses";
import { capitalize } from "@utils/index";
import { IntegrationsList } from "@utils/constants";

export interface Feature {
	name: string;
	key?: string;
	tiers: { [key: string]: boolean | string }; // This type allows for boolean or string values
}

export interface Section {
	name: string;
	key?: string;
	features: Feature[];
}

const useAllPlans = () => {
	const { data } = useQuery("plans", getAllPlans);
	const features = useMemo(() => {
		if (data?.data) {
			const usageQuotas: Section = {
				key: "usage-quotas",
				name: "Usage Quotas",
				features: [
					{
						key: "max_forms",
						name: "Forms",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce((a, v) => ({ ...a, [v]: "Unlimited" }), {}),
					},
					{
						key: "max_questions",
						name: "Inputs",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce((a, v) => ({ ...a, [v]: "Unlimited" }), {}),
					},
					// {
					// 	key: "max_forms",
					// 	name: "Max forms",
					// 	tiers: data?.data
					// 		?.map((item) => item.stripe_price_id)
					// 		.reduce(
					// 			(a, v) => ({
					// 				...a,
					// 				[v]: data?.data
					// 					?.find(
					// 						(item) => item.stripe_price_id === v
					// 					)
					// 					?.max_forms?.toString(),
					// 			}),
					// 			{}
					// 		),
					// },
					{
						name: "Monthly Responses",
						key: "number_of_responses",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]:
										data?.data
											?.find(
												(item) =>
													item.stripe_price_id === v
											)
											?.number_of_responses?.toString() ===
										"-1"
											? "Unlimited"
											: data?.data
													?.find(
														(item) =>
															item.stripe_price_id ===
															v
													)
													?.number_of_responses?.toString(),
								}),
								{}
							),
					},
				],
			};

			const features: Section = {
				key: "features",
				name: "Features",
				features: [
					// {
					// 	key: "payments",
					// 	name: "Payments",
					// 	tiers: data?.data
					// 		?.map((item) => item.stripe_price_id)
					// 		.reduce(
					// 			(a, v) => ({
					// 				...a,
					// 				[v]: data?.data?.find(
					// 					(item) => item.stripe_price_id === v
					// 				)?.payments,
					// 			}),
					// 			{}
					// 		),
					// },
					{
						key: "file_uploads",
						name: "File Uploads",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.per_file_upload_limit
										? true
										: false,
								}),
								{}
							),
					},
					{
						key: "file_upload_limit",
						name: "File Size Limit (MB)",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data
										?.find(
											(item) => item.stripe_price_id === v
										)
										?.per_file_upload_limit?.toString(),
								}),
								{}
							),
					},
					{
						key: "total_upload_limit",
						name: "Total File Size Limit (MB)",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data
										?.find(
											(item) => item.stripe_price_id === v
										)
										?.total_upload_limit?.toString(),
								}),
								{}
							),
					},
					{
						name: "Remove Byteforms Branding",
						key: "remove_branding",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.remove_branding,
								}),
								{}
							),
					},
					{
						name: "Embed Forms",
						key: "embed",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]:
										(
											data?.data?.find(
												(item) =>
													item.stripe_price_id === v
											) as any
										)?.embed ?? true,
								}),
								{}
							),
					},
					{
						name: "Password Protected Forms",
						key: "password_protected",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.password_protected,
								}),
								{}
							),
					},

					{
						name: "Draft submissions",
						key: "draft_submissions",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.draft_submissions,
								}),
								{}
							),
					},
				],
			};

			const analytics: Section = {
				name: "Reporting",
				features: [
					{
						name: "Analytics",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.stop_submissions_after,
								}),
								{}
							),
					},
					{
						name: "Export",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.stop_submissions_after,
								}),
								{}
							),
					},
					{
						name: "Drop-off rates",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.stop_submissions_after,
								}),
								{}
							),
					},
				],
			};

			const automation: Section = {
				key: "automation",
				name: "Automation",
				features: [
					{
						name: "Email Notifications",
						key: "email_notifications",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.email_notifications,
								}),
								{}
							),
					},
					// {
					// 	name: "Auto notify respondents",
					// 	key: "auto_notify_respondents",
					// 	tiers: data?.data
					// 		?.map((item) => item.stripe_price_id)
					// 		.reduce(
					// 			(a, v) => ({
					// 				...a,
					// 				[v]: data?.data?.find(
					// 					(item) => item.stripe_price_id === v
					// 				)?.email_notifications,
					// 			}),
					// 			{}
					// 		),
					// },
					{
						name: "Maximum submission limit",
						key: "stop_submissions_after",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.stop_submissions_after,
								}),
								{}
							),
					},
				],
			};

			const integrations: Section = {
				name: "Integrations",
				key: "integrations",
				features: IntegrationsList.map((integration) => ({
					name: integration.name,
					key: integration.key,
					tiers: data?.data
						?.map((item) => item.stripe_price_id)
						.reduce(
							(a, v) => ({
								...a,
								[v]: data?.data
									?.find((item) => item.stripe_price_id === v)
									?.allowed_integrations?.includes(
										integration.key
									),
							}),
							{}
						) as any,
				})),
			};

			const support: Section = {
				name: "Support",
				features: [
					{
						name: "Support",
						key: "support",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: capitalize(
										data?.data?.find(
											(item) => item.stripe_price_id === v
										)?.support || ""
									),
								}),
								{}
							),
					},
					{
						name: "Integration Support",
						key: "integration_support",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v, index) => ({
									...a,
									[v]: data?.data?.find(
										(item) => item.stripe_price_id === v
									)?.integration_support,
								}),
								{}
							),
					},
				],
			};

			const developer: Section = {
				name: "Developer",
				features: [
					{
						key: "api_access",
						name: "API Access",
						tiers: data?.data
							?.map((item) => item.stripe_price_id)
							.reduce(
								(a, v) => ({
									...a,
									[v]: true,
								}),
								{}
							),
					},
				],
			};
			return [
				usageQuotas,
				features,
				automation,
				integrations,
				analytics,
				developer,
				support,
			];
		}
		return [];
	}, [data]);

	const getSubFeaturesForPlan = (plan: string, featureKey: string) => {
		const featureItem = features?.map((item) => item.features)?.flat();
		const planItem = featureItem?.find(
			(feat) => feat.key === featureKey
		)?.tiers;
		if (!planItem) return null;
		const planKey = Object.keys(planItem)?.find(
			(key) => key.toLowerCase() === plan.toLowerCase()
		);
		if (!planKey) return null;
		return planItem[planKey];
	};

	return {
		data: data
			? ({
					...data,
					data: data?.data?.sort((a, b) => {
						return a.pricing - b.pricing;
					}),
			  } as GetAllPlansResponse)
			: undefined,
		features,
		getSubFeaturesForPlan,
	};
};

export default useAllPlans;
