import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import {
	setChannelByIntegrationId,
	getChannelListByIntegrationId,
} from "@api/integrations/slack";
import { SlackChannel } from "@api/integrations/slack/responses";
import { classNames } from "@utils/index";
const SlackIntegrationCallback = () => {
	const router = useRouter();

	const { data, isLoading, error } = useQuery({
		queryKey: ["slack-channels-list", router.query.integrationId],
		enabled: !!router.query.integrationId,
		queryFn: () =>
			getChannelListByIntegrationId({
				integration_id: parseInt(router.query.integrationId as string),
			}),
	});

	const [query, setQuery] = useState("");
	const [selectedPerson, setSelectedPerson] = useState<SlackChannel | null>(
		null
	);

	const filteredPeople =
		query === ""
			? data?.data ?? []
			: (data?.data ?? [])?.filter((person) => {
					return person.name
						.toLowerCase()
						.includes(query.toLowerCase());
			  });

	const [isSubmitting, setIsSubmitting] = useState(false);
	const onSubmit = async () => {
		if (!selectedPerson) {
			toast.error("Please select a channel or DM");
			return;
		}
		toast.dismiss();
		setIsSubmitting(true);

		const res = await setChannelByIntegrationId({
			channel_id: selectedPerson.id,
			channel_name: selectedPerson.name,
			integration_id: parseInt(router.query.integrationId as string),
		});

		setIsSubmitting(false);

		if (res.status === "success") {
			toast.success("Integration for Slack successfully connected");
			window?.close();
			router.replace("/");
			return;
		} else {
			toast.error(res.message ?? "An error occured");
		}
	};
	return (
		<>
			<Head>
				<title>Connect with Slack | ByteForms</title>
			</Head>
			<Toaster />
			<div className="container mx-auto py-12 flex flex-col items-center justify-center max-w-lg px-6">
				<p className="font-medium text-4xl">Connect with Slack</p>
				<p className="text-sm text-gray-500 my-2">
					Send Slack messages for new submissions.
				</p>

				<div className="mt-4 flex flex-col items-start justify-start self-start min-w-full">
					{router.isReady && !router.query.integrationId && (
						<div>
							<p className="text-xs mt-8 text-gray-400">
								Invalid request. Please try again.
							</p>
						</div>
					)}
					{isLoading ? (
						<div className="flex flex-col items-center justify-center w-full">
							<LoaderIcon
								style={{
									width: 20,
									height: 20,
								}}
							/>
							<p className="mt-1 text-gray-600">
								Loading your channels
							</p>
						</div>
					) : router.query.integrationId ? (
						error || !data?.data ? (
							<div className="flex flex-col items-center justify-center w-full">
								<p className="text-red-500">
									{(error as any)?.response?.data?.message ??
										"An error occured."}
								</p>
								<Link
									className="button-outlined mt-2"
									href={{
										pathname: "/dashboard",
									}}
								>
									Go back
								</Link>
								{(error as any)?.response?.status === 401 && (
									<Link
										className="button-primary mt-2"
										href={{
											pathname: "/login",
											query: {
												next: router.asPath,
											},
										}}
									>
										Login
									</Link>
								)}
							</div>
						) : (
							<Combobox
								as="div"
								className={"w-full"}
								value={selectedPerson}
								onChange={setSelectedPerson}
							>
								<Combobox.Label className="block text-sm font-medium text-gray-700">
									Select a channel or DM
								</Combobox.Label>
								<div className="relative mt-1 w-full">
									<Combobox.Input
										className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
										onChange={(event) =>
											setQuery(event.target.value)
										}
										displayValue={(person) =>
											(person as SlackChannel)?.name
										}
									/>
									<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
										<ChevronUpDownIcon
											className="h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
									</Combobox.Button>

									{filteredPeople.length > 0 && (
										<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
											{filteredPeople.map((person) => (
												<Combobox.Option
													key={person.id}
													value={person}
													className={({ active }) =>
														classNames(
															"relative cursor-default select-none py-2 pl-3 pr-9",
															active
																? "bg-indigo-600 text-white"
																: "text-gray-900"
														)
													}
												>
													{({ active, selected }) => (
														<>
															<span
																className={classNames(
																	"block truncate",
																	selected
																		? "font-semibold"
																		: ""
																)}
															>
																#{person.name}
															</span>

															{selected && (
																<span
																	className={classNames(
																		"absolute inset-y-0 right-0 flex items-center pr-4",
																		active
																			? "text-white"
																			: "text-indigo-600"
																	)}
																>
																	<CheckIcon
																		className="h-5 w-5"
																		aria-hidden="true"
																	/>
																</span>
															)}
														</>
													)}
												</Combobox.Option>
											))}
										</Combobox.Options>
									)}
								</div>
							</Combobox>
						)
					) : null}
				</div>

				{!isLoading && data?.data && (
					<button
						disabled={isSubmitting}
						type="submit"
						onClick={onSubmit}
						className="button-primary my-4 flex space-x-2 items-center"
					>
						{isSubmitting && <LoaderIcon />}
						<span>Connect with Slack</span>
					</button>
				)}
				{router.query.integrationId && (
					<p className="text-xs mt-8 text-gray-400">
						Integration ID: {router.query.integrationId}
					</p>
				)}
			</div>
		</>
	);
};

export default SlackIntegrationCallback;
