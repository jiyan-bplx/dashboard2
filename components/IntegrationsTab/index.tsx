import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { useQuery } from "react-query";
import { generateDiscordIntegrationUrl } from "@api/integrations/discord";
import { initDropboxIntegration } from "@api/integrations/dropbox";
import { initGoogleDriveIntegration } from "@api/integrations/google-drive";
import { generateGoogleSheetsIntegrationUrl } from "@api/integrations/google-sheets";
import { listIntegrationsForFormId } from "@api/integrations/list";
import { generateNotionIntegrationUrl } from "@api/integrations/notion";
import {
	generateSlackIntegrationUrl,
	getExistingSlackIntegration,
} from "@api/integrations/slack";
import { generateTelegramAuthCode } from "@api/integrations/telegram";
import { getPlanLimits } from "@api/subscriptions";
import { BaseResponse } from "@api/types/responses";
import { getCenterFromWidthAndHeight } from "@utils/index";
import ConnectTelegramModal from "../Modals/ConnectTelegramModal";
import ConnectedIntegrationListItem from "../ConnectedIntegrationListItem";
import DeleteIntegrationModal from "../Modals/DeleteIntegrationModal";
import WebhookUrlModal from "../Modals/WebhookUrlModal";
import { IntegrationsList } from "@utils/constants";
import { LinkIcon } from "@heroicons/react/20/solid";

const IntegrationsTab = ({ formId }: { formId: number }) => {
	const router = useRouter();

	const { data, refetch } = useQuery(["integrations", formId], () =>
		listIntegrationsForFormId(formId)
	);

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	const [connecting, setConnecting] = useState<string | null>(null);
	const onConnect = async (integrationSlug: string) => {
		try {
			setConnecting(integrationSlug);
			const center = getCenterFromWidthAndHeight({ w: 500, h: 500 });
			switch (integrationSlug) {
				case "google_drive":
					const googleDriveRes = await initGoogleDriveIntegration({
						form_id: formId,
					});

					if (googleDriveRes.data) {
						// res.data will be a url
						const googleDriveOpener = window.open(
							googleDriveRes.data,
							"googleDrive",
							`width=500,height=500,left=${center.left},top=${center.top}`
						);

						// Check if the popup is opened successfully
						if (googleDriveOpener) {
							refetch();
						} else {
							alert(
								"Popup blocked! Please enable popups for this site."
							);
						}
					}
					setConnecting(null);
					return;
				case "zapier":
				case "google_calendar":
				case "airtable":
				case "excel":
				case "sms":
				case "hubspot":
				case "mailchimp":
				case "pdf_monkey":
				case "trello":
				case "jira":
					const integration = IntegrationsList.find(
						(item) => item.key === integrationSlug
					);
					window.open(integration?.link, "_blank");
					setConnecting(null);

					return;
				case "dropbox":
					const dropboxRes = await initDropboxIntegration({
						form_id: formId,
					});

					if (dropboxRes.data) {
						// res.data will be a url
						const dropboxOpener = window.open(
							dropboxRes.data,
							"dropbox",
							`width=500,height=500,left=${center.left},top=${center.top}`
						);

						// Check if the popup is opened successfully
						if (dropboxOpener) {
							refetch();
						} else {
							alert(
								"Popup blocked! Please enable popups for this site."
							);
						}
					}
					setConnecting(null);
					return;
				case "google_sheet":
					const sheetsRes = await generateGoogleSheetsIntegrationUrl({
						form_id: formId,
					});

					if (sheetsRes.data) {
						// res.data will be a url
						const sheetOpener = window.open(
							sheetsRes.data,
							"google_sheet",
							`width=500,height=500,left=${center.left},top=${center.top}`
						);

						// Check if the popup is opened successfully
						if (sheetOpener) {
							toast.success(
								"Google Sheets integration successfully connected"
							);
							refetch();
						} else {
							alert(
								"Popup blocked! Please enable popups for this site."
							);
						}
					}
					setConnecting(null);
					return;
				case "notion":
					const notionRes = await generateNotionIntegrationUrl({
						form_id: formId,
					});

					if (notionRes.data) {
						// res.data will be a url
						const sheetOpener = window.open(
							notionRes.data,
							"notion",
							`width=500,height=500,left=${center.left},top=${center.top}`
						);

						// Check if the popup is opened successfully
						if (sheetOpener) {
						} else {
							alert(
								"Popup blocked! Please enable popups for this site."
							);
						}
					}
					setConnecting(null);
					return;
				case "telegram":
					const telegramRes = await generateTelegramAuthCode({
						form_id: formId,
					});

					if (telegramRes.data) {
						router.push({
							query: {
								...router.query,
								integration: "telegram",
								code: telegramRes.data,
							},
						});
					} else {
						toast.error(
							telegramRes.message || "Something went wrong!"
						);
					}
					setConnecting(null);

					break;
				case "webhook":
					return router.push({
						query: {
							...router.query,
							integration: "webhook",
						},
					});
				case "discord":
					const discordRes = await generateDiscordIntegrationUrl({
						form_id: formId,
					});
					if (discordRes.data) {
						// res.data will be a url
						const discordOpener = window.open(
							discordRes.data,
							"discord",
							`width=500,height=500,left=${center.left},top=${center.top}`
						);

						// Check if the popup is opened successfully
						if (discordOpener) {
						} else {
							alert(
								"Popup blocked! Please enable popups for this site."
							);
						}
					}
					setConnecting(null);

					break;

				case "slack":
					// Check if there is an existing slack integration
					const slackIntegration =
						await getExistingSlackIntegration();

					if (
						slackIntegration.status === "success" &&
						slackIntegration.data
					) {
						const slackOpener = window.open(
							`/integrations/slack/existing?formId=${formId}`,
							"Slack",
							`width=500,height=500,left=${center.left},top=${center.top}`
						);

						// Check if the popup is opened successfully
						if (slackOpener) {
						} else {
							alert(
								"Popup blocked! Please enable popups for this site."
							);
						}
					} else {
						const res = await generateSlackIntegrationUrl({
							form_id: formId,
						});
						if (res.data) {
							// res.data will be a url
							const slackOpener = window.open(
								res.data,
								"Slack",
								`width=500,height=500,left=${center.left},top=${center.top}`
							);

							// Check if the popup is opened successfully
							if (slackOpener) {
							} else {
								alert(
									"Popup blocked! Please enable popups for this site."
								);
							}
						}
					}
					setConnecting(null);

					break;

				default:
					break;
			}
			setConnecting(null);
		} catch (error) {
			setConnecting(null);
			console.error("[onConnect]", error);
			toast.error(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
		}
	};

	const filteredIntegrations = useMemo(() => data?.data, [data]);

	return (
		<div className="mt-4">
			<WebhookUrlModal
				isOpen={router.query.integration === "webhook"}
				closeModal={() => {
					router.push({
						query: {
							...router.query,
							integration: undefined,
						},
					});
					setConnecting(null);
				}}
				formId={formId}
			/>

			{router.query.code && (
				<ConnectTelegramModal
					isOpen={router.query.integration === "telegram"}
					closeModal={() => {
						router.push({
							query: {
								...router.query,
								code: null,
								integration: undefined,
							},
						});
						setConnecting(null);
					}}
					code={router.query.code as string}
				/>
			)}

			<DeleteIntegrationModal
				formId={formId}
				onClose={() => {
					router.push({
						query: {
							...router.query,
							code: null,
							action: null,
							integration: undefined,
						},
					});
					setConnecting(null);
				}}
				open={
					router.query.action === "delete-integration" &&
					typeof router.query.integration === "string"
				}
			/>

			{filteredIntegrations && (
				<div className="mb-4 border-b pb-4">
					<p className="font-medium text-title mb-2 md:mb-4">
						Your integrations
					</p>
					{filteredIntegrations?.length > 0 ? (
						<div className="flex flex-col space-y-4">
							{filteredIntegrations.map((integration) => (
								<ConnectedIntegrationListItem
									key={integration.id}
									integration={integration}
								/>
							))}
						</div>
					) : (
						<div>
							<p className="text-caption">
								You haven't connected any integrations yet.
							</p>
						</div>
					)}
				</div>
			)}

			<p className="font-medium text-title md:mb-4">
				Discover integrations
			</p>
			<div className="grid mt-4 md:grid-cols-3 gap-5">
				{IntegrationsList?.map((integration) => (
					<div
						className="flex items-start space-x-4"
						key={integration.key}
					>
						<img
							src={integration.icon}
							alt={integration.name}
							className="w-8 h-8 mt-1"
						/>
						<div>
							<p className="font-medium text-sm md:text-base">
								{integration.name}
							</p>
							<p
								className="text-xs text-gray-400"
								dangerouslySetInnerHTML={{
									__html: integration.description,
								}}
							/>
							{integration.status === "active" ? (
								planLimits?.data?.limits?.allowed_integrations?.includes(
									integration.key
								) ? (
									<button
										type="button"
										disabled={
											connecting === integration.key
										}
										onClick={() =>
											onConnect(integration.key)
										}
										className={`flex items-center space-x-2 mt-2 button-secondary`}
									>
										{connecting === integration.key && (
											<LoaderIcon />
										)}
										<span>Connect</span>
									</button>
								) : (
									<button
										type="button"
										disabled={
											connecting === integration.key
										}
										onClick={() =>
											onConnect(integration.key)
										}
										className={`flex items-center space-x-2 mt-2 button-secondary`}
									>
										{connecting === integration.key && (
											<LoaderIcon />
										)}
										<span>Connect</span>
										{integration.link && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												className="w-3 h-3"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
												<path d="m21 3-9 9" />
												<path d="M15 3h6v6" />
											</svg>
										)}
									</button>
									// <Link
									// 	className={`flex items-center space-x-2 mt-2 button-secondary`}
									// 	href="/profile/pricing"
									// >
									// 	Upgrade to connect
									// </Link>
								)
							) : (
								<p
									className={`flex items-center space-x-2 mt-2 button-outlined`}
								>
									Coming soon!
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default IntegrationsTab;
