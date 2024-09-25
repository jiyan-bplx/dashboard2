import { Popover, Switch, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { LinkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { useQueryClient } from "react-query";
import { toggleIntegrationStateById } from "@api/integrations/list";
import {
	Integration,
	ListIntegrationsForFormResponse,
} from "@api/integrations/list/responses";
import { classNames } from "@utils/index";
import { IntegrationsList } from "@utils/constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
const ConnectedIntegrationListItem = ({
	integration,
}: {
	integration: Integration;
}) => {
	const client = useQueryClient();

	const [enabled, setEnabled] = useState(() => integration?.is_active);
	const getIntegration = (integration_type: string) => {
		return IntegrationsList?.find(
			(integration) => integration.key === integration_type
		);
	};

	const onChangeState = async (state: boolean) => {
		setEnabled(state);
		await toggleIntegrationStateById(integration.id, {
			is_active: state,
		});
		client.setQueryData<ListIntegrationsForFormResponse>(
			["integrations", integration.form_id],
			(oldData) => {
				const integrations = oldData?.data ?? [];
				return {
					data: integrations.map((item) => {
						if (item.id === integration.id) {
							return {
								...item,
								is_active: state,
							};
						}
						return item;
					}),
				} as ListIntegrationsForFormResponse;
			}
		);
	};

	const router = useRouter();
	const onDeleteIntegration = () => {
		router.push(
			{
				query: {
					...router.query,
					integration: integration.id,
					action: "delete-integration",
				},
			},
			undefined,
			{ scroll: false }
		);
	};

	const getIntegrationSubtitle = (integration: Integration) => {
		if (integration.integration_type === "webhook") {
			return integration.token;
		}

		if (integration.integration_type === "slack") {
			if (typeof integration.integration === "object") {
				return integration.integration?.channel_name;
			}
		}

		return getIntegration(integration.integration_type)?.description;
	};

	return (
		<div
			className="flex items-center space-x-4 justify-between"
			key={integration.id}
		>
			<div className="flex items-center space-x-4">
				<img
					src={getIntegration(integration.integration_type)?.icon}
					alt={getIntegration(integration.integration_type)?.name}
					className="w-6 h-6"
				/>
				<div>
					<div className="flex items-center space-x-2">
						<p className="font-medium">
							{getIntegration(integration.integration_type)?.name}
						</p>

						{integration.connected ? (
							<>
								<div
									className={classNames(
										integration.connected
											? "bg-green-500"
											: "bg-red-400",
										"w-2 h-2 rounded-full"
									)}
								/>

								{integration.error &&
									integration.error?.length > 0 && (
										<div className="relative ">
											<a
												className={classNames(
													"cursor-pointer inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 ",
													integration.integration_type +
														integration.id.toString() +
														"tooltipError"
												)}
											>
												Error
											</a>
											<ReactTooltip
												anchorSelect={
													"." +
													integration.integration_type +
													integration.id.toString() +
													"tooltipError"
												}
												className="rounded-lg shadow-lg ring-1 ring-black/5 bg-white text-black text-sm p-4 max-w-sm"
												opacity={1}
												style={{
													backgroundColor: "white",

													opacity: 1,
												}}
												render={({}) => {
													return (
														<div className="text-gray-800">
															{integration.error &&
															integration.error
																?.length > 0
																? integration.error
																: "There is an issue with this integration"}
														</div>
													);
												}}
											/>
										</div>
									)}
							</>
						) : (
							<div className="relative group">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-4 h-4 text-red-500 cursor-pointer"
								>
									<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
									<path d="M12 9v4" />
									<path d="M12 17h.01" />
								</svg>
								<div className="hidden group-hover:block absolute z-10 mt-3 w-screen max-w-sm transform ">
									<div className="rounded-lg shadow-lg ring-1 ring-black/5 bg-white text-black text-sm p-4">
										{integration.error &&
										integration.error?.length > 0
											? integration.error
											: "There is an issue with this integration"}
									</div>
								</div>
							</div>
						)}
					</div>
					<p className="text-xs text-gray-400">
						{getIntegrationSubtitle(integration)}
					</p>
					{integration.integration_type === "google_sheet" &&
						typeof integration.integration === "object" &&
						integration.integration?.sheet_url && (
							<a
								className="items-center space-x-1 mt-2 inline-flex rounded order border-transparent bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								href={integration.integration.sheet_url}
								target="_blank"
							>
								<span>View</span>
								<LinkIcon className="w-3" />
							</a>
						)}
					{/* <button
								type="button"
								onClick={() => onConnect(integration.key)}
								className={`mt-2 button-secondary`}
							>
								Connect
							</button> */}
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<TrashIcon
					onClick={onDeleteIntegration}
					className="w-4 h-4 text-red-500"
				/>
				<Switch
					checked={enabled}
					onChange={onChangeState}
					className={classNames(
						enabled ? "bg-indigo-600" : "bg-gray-200",
						"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					)}
				>
					<span className="sr-only">Use setting</span>
					<span
						className={classNames(
							enabled ? "translate-x-5" : "translate-x-0",
							"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
						)}
					>
						<span
							className={classNames(
								enabled
									? "opacity-0 ease-out duration-100"
									: "opacity-100 ease-in duration-200",
								"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
							)}
							aria-hidden="true"
						>
							<svg
								className="h-3 w-3 text-gray-400"
								fill="none"
								viewBox="0 0 12 12"
							>
								<path
									d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span
							className={classNames(
								enabled
									? "opacity-100 ease-in duration-200"
									: "opacity-0 ease-out duration-100",
								"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
							)}
							aria-hidden="true"
						>
							<svg
								className="h-3 w-3 text-indigo-600"
								fill="currentColor"
								viewBox="0 0 12 12"
							>
								<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
							</svg>
						</span>
					</span>
				</Switch>
			</div>
		</div>
	);
};

export default ConnectedIntegrationListItem;
