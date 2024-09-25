import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import parseISO from "date-fns/parseISO";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import DashboardNavbar from "@components/DashboardNavbar";
import DeleteAccountModal from "@components/Modals/DeleteAccountModal";
import Loading from "@components/Loading";
import Select from "@components/BuilderComponents/Inputs/Select";
import useAllPlans from "@hooks/useAllPlans";
import useUser from "@hooks/useUser";
import {
	editUser,
	getDataCenterLocations,
	sendPasswordResetEmail,
} from "@api/auth";
import { EditUserRequest } from "@api/auth/requests";
import {
	getActiveSubscription,
	getPlanLimits,
	getSubscriptions,
} from "@api/subscriptions";
import { getAccountUsedSpace } from "@api/upload";
import { AxiosError } from "axios";
import { BaseResponse } from "@api/types/responses";
import { listAPIKeys } from "@api/api_key";
import GenerateApiKeyModal from "@components/Modals/GenerateApiKeyModal";
import DeleteApiKeyModal from "@components/Modals/DeleteApiKeyModal";
import { differenceInDays } from "date-fns";
import { classNames, planLimitsToNumber } from "@utils/index";

const Tabs = [
	{
		name: "plan-details",
		label: "Plan details",
	},
	{
		name: "data",
		label: "Data",
	},
	{
		name: "account",
		label: "Account",
	},
];

const ProfileInfoSection = () => {
	const formTitleRef = useRef<HTMLInputElement>(null);

	const [isFormTitleFocused, setIsFormTitleFocused] = useState(false);

	const focusFormTitle = () => {
		setIsFormTitleFocused(true);
		formTitleRef.current?.focus();
	};
	const [userName, setUserName] = useState("Hello user");

	const { data } = useUser();

	useEffect(() => {
		if (data && data.data) {
			setUserName(data.data.name);
		}
	}, [data]);

	const { mutateAsync: saveProfile, isLoading: isSavingProfile } =
		useMutation({
			mutationFn: editUser,
		});

	const saveProfileChanges = async () => {
		try {
			const res = await saveProfile({
				name: userName,
			});
			if (res.status === "success") {
				toast.success("Profile updated");
			} else {
				console.error("[editProfile]", res);
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
			console.error("[editProfile]", error);
		}
	};

	return (
		<div className="bg-white mx-1 p-4 rounded-md md:rounded-lg shadow">
			<div className="grid md:grid-cols-2 grid-cols-1 w-full">
				<div className="flex items-center space-x-4">
					<div className=" flex-shrink-0 relative inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full dark:bg-gray-600">
						<img
							className="absolute w-full h-full border-2 border-white rounded-full dark:border-gray-800"
							src={
								data?.data?.photo
									? data?.data?.photo
									: `https://source.boringavatars.com/beam/120/${data?.data?.name}?colors=0A0310,49007E,FF005B,FF7D10,FFB238`
							}
							alt={data?.data?.name}
						/>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center">
							<input
								ref={formTitleRef}
								className="min-w-max text-gray-900 bg-white text-lg font-medium leading-6 w-full"
								value={userName ?? "Form Title"}
								onFocus={() => {
									setIsFormTitleFocused(true);
								}}
								onBlur={() => {
									setIsFormTitleFocused(false);
								}}
								onChange={(e) => setUserName(e.target.value)}
							/>
							{!isFormTitleFocused && (
								<button type="button" onClick={focusFormTitle}>
									<PencilIcon className="w-3 md:w-4 h-3 md:h-4 " />
								</button>
							)}
						</div>
						<p className="text-sm font-medium text-gray-500 hover:text-gray-700">
							{data?.data?.email}
						</p>
					</div>
				</div>

				<div className="flex justify-end w-full mt-2 md:mt-0 flex-wrap ">
					{data?.data?.name !== userName && !isFormTitleFocused ? (
						<button
							className="button-primary mx-2 my-2"
							onClick={saveProfileChanges}
						>
							Save Changes
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
};

const ProfileDetailsSection = () => {
	const { features, data: plans } = useAllPlans();

	const { data: userSubscription } = useQuery(
		"user_plan",
		getActiveSubscription
	);

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	const isOnLastPlan = useMemo(() => {
		if (plans?.data && plans.data?.length > 0) {
			const plansSortedByPrice = plans?.data.sort((a, b) => {
				return a.pricing - b.pricing;
			});
			return (
				plansSortedByPrice.at(-1)?.stripe_price_id ===
				userSubscription?.data?.subscription?.stripe_price_id
			);
		}
		return false;
	}, [plans, userSubscription]);

	const { data: usedSpace } = useQuery("used_space", getAccountUsedSpace);

	const getPlanByPriceId = (priceId: string) => {
		return plans?.data?.find((plan) => plan.stripe_price_id === priceId);
	};

	const getSubscriptionTypeFromDuration = (duration: number) => {
		// 1 month -> 28, 29, 30, 31 days
		if (duration <= 31) {
			return {
				duration: 1,
				type: "month",
			};
		} else if (duration <= 366) {
			return {
				duration: 1,
				type: "year",
			};
		}
	};

	const { data: invoices, isLoading: isLoadingSubscriptions } = useQuery(
		"subscriptions",
		getSubscriptions
	);

	const currentPlan = useMemo(() => {
		if (!planLimits) {
			return "free";
		}
		return planLimits?.data?.limits.plan;
	}, [planLimits]);

	const FeaturesList = useMemo(
		() =>
			userSubscription?.data?.subscription?.stripe_price_id
				? features
						?.map((item) => item.features)
						.flat()
						?.filter((feature) => {
							if (
								typeof feature.tiers?.[
									userSubscription?.data?.subscription
										?.stripe_price_id as any
								] === "boolean"
							) {
								return (
									feature.tiers?.[
										userSubscription?.data?.subscription
											?.stripe_price_id as any
									] === true
								);
							}
							return (
								typeof feature.tiers?.[
									userSubscription?.data?.subscription
										?.stripe_price_id as any
								] !== "undefined"
							);
						})
				: [],
		[userSubscription, features]
	);
	return (
		<div className="">
			{/* <p className="mt-1 text-sm leading-6 text-gray-600">
				This information will be displayed publicly so be careful what
				you share.
			</p> */}
			<div className="grid md:grid-cols-3 grid-cols-1">
				{/* <div className="hover:ring-black/10 border border-gray-200 bg-white mt-4 mx-1 md:mx-2 p-4 rounded-md shadow ">
					<div className="flex flex-col justify-between h-full w-full">
						<div className="">
							<h2 className="font-medium mb-4">
								Billing Details
							</h2>
							<p className="text-sm text-gray-500">
								Name or Company Name
							</p>
							<p className="text-sm font-medium mb-3">
								{user?.data?.data.name}
							</p>
							<p className="text-sm text-gray-500">
								Street Address
							</p>
							<p className="text-sm font-medium mb-3">
								Ghorepade peth 539
							</p>
							<p className="text-sm text-gray-500">
								Postal City, Country
							</p>
							<p className="text-sm font-medium mb-3">
								411042, Pune, India
							</p>
						</div>

						<div className="flex md:justify-end w-full mt-8 md:mt-0 flex-wrap ">
							<button className="button-secondary my-2 space-x-1">
								<span>Edit Billing Details</span>
							</button>
						</div>
					</div>
				</div>
				<div className=" hover:ring-black/10 border border-gray-200 bg-white mt-4 mx-1 md:mx-2 p-4 rounded-md shadow ">
					<div className="flex flex-col justify-between h-full w-full">
						<div className="">
							<h2 className="font-medium mb-4">
								Payment Details
							</h2>
							<p className="text-sm text-gray-500">
								You haven't added any billing information yet
							</p>
						</div>

						<div className="flex md:justify-end w-full mt-8 md:mt-0 flex-wrap ">
							<button className="button-secondary my-2 space-x-1">
								<span>Edit Payment Details</span>
							</button>
						</div>
					</div>
				</div> */}
				<div className="w-full col-span-2">
					<div className="h-min  hover:ring-black/10 border border-gray-200 bg-white mt-4 mx-1 md:mx-2 p-4 rounded-md shadow col-span-1 md:col-span-2">
						<div className="flex flex-col justify-between h-full w-full">
							<div className="">
								<h2 className="font-medium mb-4">
									ByteForms{" "}
									<span className="ml-1 text-indigo-500 capitalize">
										{currentPlan}
									</span>
								</h2>
								{userSubscription?.data?.subscription
									?.start_date && (
									<p className="text-sm text-gray-500">
										You have been on this plan for{" "}
										{formatDistance(
											new Date(
												userSubscription?.data
													?.subscription?.start_date *
													1000
											),
											new Date(),
											{
												addSuffix: false,
											}
										)}
									</p>
								)}
							</div>
							{/* <hr className="h-px my-8 bg-gray-300 border-0"></hr>
							<p className="text-sm font-medium mb-3">Forms</p>
							<div className="w-full bg-indigo-100 rounded-full overflow-hidden">
								<div
									className="bg-indigo-500 text-xs font-medium text-white text-center leading-none rounded-full py-1 h-5 px-1 whitespace-nowrap"
									style={{
										width: `${
											(Math.min(
												planLimits?.data?.limits
													?.max_forms?.value ?? 0,
												planLimits?.data?.limits
													?.max_forms?.limit ?? 100
											) /
												(planLimits?.data?.limits
													?.max_forms?.limit ??
													100)) *
											100
										}%`,
									}}
								>
									{planLimits?.data?.limits?.max_forms?.value}
									/
									{planLimits?.data?.limits?.max_forms?.limit}
								</div>
							</div> */}
							{/* <hr className="h-px my-8 bg-gray-300 border-0"></hr>
							<p className="text-sm font-medium mb-3">
								Responses
							</p>
							<div className="w-full bg-indigo-100 rounded-full overflow-hidden">
								<div
									className="bg-indigo-500 text-xs font-medium text-white text-center leading-none rounded-full py-1 h-5 px-1 whitespace-nowrap"
									style={{
										width: `${
											(Math.min(
												planLimits?.data?.limits
													?.number_of_responses
													?.value ?? 0,
												planLimitsToNumber(
													planLimits?.data?.limits
														?.number_of_responses
														?.limit
												) ?? 100
											) /
												(planLimitsToNumber(
													planLimits?.data?.limits
														?.number_of_responses
														?.limit
												) ?? 100)) *
											100
										}%`,
									}}
								>
									{
										planLimits?.data?.limits
											?.number_of_responses?.value
									}
									/
									{planLimitsToNumber(
										planLimits?.data?.limits
											?.number_of_responses?.limit
									) ?? "Unlimited"}
								</div>
							</div> */}
							{/* {userSubscription?.data?.subscription?.end_date && (
								<p className="text-sm text-gray-500 mt-2">
									Your responses reset on{" "}
									{format(
										new Date(
											userSubscription?.data?.subscription
												?.end_date * 1000
										),
										"MMM dd, yyyy 'at' hh:mm a"
									)}
								</p>
							)} */}
							{/* <hr className="h-px my-8 bg-gray-300 border-0"></hr> */}

							<p className="text-sm font-medium my-3">
								Storage Used
							</p>
							<div className="w-full bg-indigo-100 rounded-full overflow-hidden">
								<div
									className="bg-indigo-500 text-xs font-medium text-white text-center leading-none rounded-full py-1 h-5 px-1 whitespace-nowrap"
									style={{
										width: `${
											(Math.min(
												usedSpace?.data
													? usedSpace?.data /
															(1024 * 1024)
													: 0,
												planLimits?.data?.limits
													?.total_upload_limit ?? 100
											) /
												(planLimits?.data?.limits
													?.total_upload_limit ??
													100)) *
											100
										}%`,
									}}
								>
									{usedSpace?.data
										? (
												usedSpace?.data /
												(1024 * 1024)
										  ).toFixed(1)
										: 0}
									/
									{
										planLimits?.data?.limits
											?.total_upload_limit
									}{" "}
									MB
								</div>
							</div>

							<hr className="h-px my-8 bg-gray-300 border-0"></hr>
							{!isOnLastPlan && (
								<div className="flex md:justify-end w-full mt-8 md:mt-0 flex-wrap ">
									<Link
										href="/profile/pricing"
										className="button-primary my-2 space-x-1"
									>
										<span>Upgrade</span>
									</Link>
								</div>
							)}
						</div>
					</div>
					<div className=" hover:ring-black/10 border border-gray-200 bg-white mt-4 mx-1 md:mx-2 p-4 rounded-md shadow ">
						<div className="flex flex-col justify-between h-full w-full">
							<div className="">
								<h2 className="font-medium mb-4">Invoices</h2>
								{!isLoadingSubscriptions &&
									(invoices?.data?.length === 0 ||
										!invoices?.data) && (
										<p className="text-sm text-gray-500">
											You haven't had any invoices yet
										</p>
									)}

								<div className="flex flex-col space-y-4">
									{invoices?.data
										?.sort((a, b) => b.id - a.id)
										.filter(
											(item) =>
												!item.status.includes(
													"incomplete"
												)
										)
										.map((item) => (
											<div
												key={item.id}
												className="justify-between grid grid-cols-5"
											>
												<div className="col-span-3">
													<p className="text-sm text-gray-800">
														{
															getPlanByPriceId(
																item.stripe_price_id
															)?.plan
														}{" "}
														Plan -{" "}
														{format(
															item.start_date *
																1000,
															"MMM yyyy"
														)}
													</p>
													<p className="text-xs text-gray-500 capitalize">
														{getSubscriptionTypeFromDuration(
															differenceInDays(
																item.end_date *
																	1000,
																item.start_date *
																	1000
															)
														)?.type + "ly"}
													</p>
												</div>
												<div>
													<p className="text-sm  text-gray-800">
														{format(
															parseISO(
																item.created_at
															),
															"MMM dd, yyyy"
														)}
													</p>
												</div>
												<div className="mx-auto">
													{item.status ===
													"active" ? (
														<span className="inline-flex items-center rounded-full bg-green-50 px-[10px] py-[2px] text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20 capitalize">
															{item.status}
														</span>
													) : (
														<span className="inline-flex items-center rounded-full bg-red-50 px-[10px] py-[2px] text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-600/10 capitalize">
															{item.status}
														</span>
													)}
												</div>
												{/* <div>
												<p className="font-medium text-gray-600 text-xs">
													Validity
												</p>
												<p className="text-sm">
													{format(
														new Date(
															item?.start_date *
																1000
														),
														"MMM dd, yyyy"
													)}{" "}
													-{" "}
													{format(
														new Date(
															item?.end_date *
																1000
														),
														"MMM dd, yyyy"
													)}
												</p>
											</div> */}
											</div>
										))}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="divide-y divide-gray-200 mt-4 rounded-lg border border-gray-200 shadow-sm mx-1 md:mx-2 p-4">
					<div className="flex flex-col justify-between h-full w-full">
						<div className="">
							<h2 className="font-medium mb-4">
								Your {currentPlan} Plan Includes
							</h2>

							<ul role="list" className="mt-2 space-y-3">
								{userSubscription?.data?.subscription
									?.stripe_price_id &&
									FeaturesList?.map((feature, index) => (
										<li
											className="grid grid-cols-12 "
											key={feature.name}
										>
											<div className="col-span-5 lg:col-span-3">
												{typeof feature.tiers?.[
													userSubscription?.data
														?.subscription
														?.stripe_price_id as any
												] === "boolean" ? (
													<CheckIcon
														className="h-5 w-5 flex-shrink-0 text-green-500"
														aria-hidden="true"
													/>
												) : (
													<p className="text-sm">
														{
															feature.tiers?.[
																userSubscription
																	?.data
																	?.subscription
																	?.stripe_price_id as any
															]
														}
													</p>
												)}
											</div>
											<span className="text-sm text-gray-500 col-span-7 lg:col-span-9">
												{feature.name}
											</span>
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Home: NextPage = () => {
	const router = useRouter();
	const changeActiveTab = (tabName: string) => {
		router.push({
			query: {
				tab: tabName,
				slug: router.query.slug,
			},
		});
	};

	const activeTab = useMemo(
		() => router.query.tab ?? Tabs?.at(0)?.name,
		[router?.query?.tab]
	);

	const [dataCenterLocation, changeDataCenterLocation] =
		useState("New York, USA");
	const [enableHIPAA, setEnableHIPAA] = useState<boolean>(false);
	const [enableGDPR, setEnableGDPR] = useState<boolean>(false);

	const user = useUser();

	const { data: apiKeysData, isLoading: loadingApiKeys } = useQuery(
		"api_keys",
		listAPIKeys
	);

	const { mutateAsync, isLoading: isSendingPasswordResetEmail } = useMutation(
		{
			mutationFn: sendPasswordResetEmail,
		}
	);

	const resetPassword = async () => {
		try {
			if (!user.data?.data?.email) {
				return;
			}
			const res = await mutateAsync(user.data?.data.email);
			if (res.status === "success") {
				toast.success("Password reset email sent");
			} else {
				console.error("[resetPassword]", res);
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
			console.error("[resetPassword]", error);
		}
	};

	useEffect(() => {
		if (!user.isLoading && user.data?.data) {
			setEnableHIPAA(user.data.data.requested_hippa ?? false);
			setEnableGDPR(user.data.data.requested_gdpr ?? false);
			changeDataCenterLocation(
				user.data.data.data_center_location ?? "New York, USA"
			);
		}
	}, [user.data, user.isLoading]);

	const editProfileMutation = useMutation<
		Awaited<ReturnType<typeof editUser>>,
		Awaited<ReturnType<typeof editUser>>,
		EditUserRequest
	>({
		mutationFn: (v) => editUser(v),
		mutationKey: "editUser",
		onMutate: () => {
			user.refetch();
		},
	});

	const saveProfile = async () => {
		if (!user.data?.data) {
			toast.error("There was an error saving your data");
			return;
		}

		const res = await editProfileMutation.mutateAsync({
			data_center_location: dataCenterLocation,
			requested_hippa: enableHIPAA,
			requested_gdpr: enableGDPR,
		});
		if (res.status === "success") {
			toast.success("Profile updated!");
		} else {
			toast.error(
				res.message || "There was an error saving your changes!"
			);
			return;
		}
	};
	const { data: dataCenterLocations, isLoading: loadingDataCenters } =
		useQuery("data-center-locations", {
			queryFn: getDataCenterLocations,
		});

	const closeDeleteModal = () => {
		router.push(
			{
				query: {
					tab: router.query.tab,
					slug: router.query.slug,
				},
			},
			undefined,
			{ scroll: false }
		);
	};

	return (
		<>
			<Toaster />
			<Head>
				<title>ByteForms</title>
			</Head>
			<main>
				<DashboardNavbar />

				<DeleteAccountModal
					open={router.query.action === "delete"}
					onClose={closeDeleteModal}
				/>

				<GenerateApiKeyModal
					open={router.query.action === "new_api_key"}
					onClose={closeDeleteModal}
				/>

				<DeleteApiKeyModal
					keyId={parseInt(router.query.id as string)}
					open={router.query.action === "delete_api_key"}
					onClose={closeDeleteModal}
				/>

				<div className="mx-auto container py-8 w-full max-w-6xl">
					<h2 className="text-base px-4 md:px-6 font-semibold leading-7 text-gray-900">
						Profile
					</h2>
					<div className="">
						<div className="mt-4 md:rounded-2xl aurora h-32" />
						<div className="w-full px-3 md:px-6 -translate-y-1/2 -mb-12 md:-mb-0">
							<ProfileInfoSection />
						</div>
						<div className="px-4 md:px-8">
							<div className="flex items-center space-x-4 border-b">
								{Tabs?.map((tab) => (
									<button
										onClick={() =>
											changeActiveTab(tab.name)
										}
										type="button"
										className={`border-b-2 ${
											activeTab === tab.name
												? "text-black border-b-black"
												: "text-gray-400 border-b-transparent"
										} pb-3 hover:text-black transition`}
										key={tab.name}
									>
										{tab.label}
									</button>
								))}
							</div>

							<div className="mt-4">
								{activeTab === "plan-details" && (
									<ProfileDetailsSection />
								)}

								{activeTab === "account" && (
									<div className="text-sm">
										<div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
											<div className="flex items-center space-x-2">
												<p className="font-medium text-sm">
													Name
												</p>
											</div>

											<p>{user.data?.data?.name}</p>
										</div>

										<div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
											<div className="flex items-center space-x-2">
												<p className="font-medium text-sm">
													Email
												</p>
											</div>

											<p>{user.data?.data?.email}</p>
										</div>
										<div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
											<div className="flex items-center space-x-2">
												<p className="font-medium text-sm">
													Address
												</p>
											</div>

											{user.data?.data?.address?.line1 ? (
												<div className="md:text-right md:max-w-sm ">
													<p>
														{
															user.data?.data
																?.address?.line1
														}
													</p>
													<p>
														{
															user.data?.data
																?.address?.line2
														}
													</p>
													<p>
														{
															user.data?.data
																?.address?.city
														}{" "}
														-{" "}
														{
															user.data?.data
																?.address
																?.postal_code
														}
														,{" "}
														{
															user.data?.data
																?.address?.state
														}
														,{" "}
														{
															user.data?.data
																?.address
																?.country
														}
													</p>
													<Link
														href={
															"/profile/address?edit=true"
														}
														scroll={false}
														className="mt-4 button-outlined"
													>
														Edit Address
													</Link>
												</div>
											) : (
												<p>Not Provided</p>
											)}
										</div>

										<div className="flex items-center space-x-2">
											<button
												onClick={resetPassword}
												className="button-secondary mt-4"
											>
												{isSendingPasswordResetEmail && (
													<Loading
														color="black"
														size={12}
													/>
												)}
												<span>Reset Password</span>
											</button>
										</div>

										<p className="border-t mt-6  pt-4 font-medium">
											API Key
										</p>
										<p className="text-gray-500 text-sm">
											These are your private API key to be
											used with the REST API. With the API
											key, you can send and retrieve data
											using scripts or a server. Keep them
											private!
										</p>

										<div>
											<div className="mt-4">
												{loadingApiKeys && (
													<div className="flex flex-col space-y-2">
														<div className="w-full h-8 bg-gray-100 animate-pulse rounded-md"></div>
														<div className="w-full h-8 bg-gray-100 animate-pulse rounded-md"></div>
														<div className="w-full h-8 bg-gray-100 animate-pulse rounded-md"></div>
													</div>
												)}
												{apiKeysData?.data?.length ===
												0 ? (
													<div>
														<p>
															You don't have any
															API keys yet
														</p>
													</div>
												) : (
													<div className="flex flex-col space-y-4">
														{apiKeysData?.data?.map(
															(keyItem) => (
																<div
																	key={
																		keyItem.id
																	}
																	className="flex justify-between"
																>
																	<div>
																		<p>
																			{
																				keyItem.name
																			}
																		</p>
																		<p className="text-xs text-gray-600 mt-1">
																			{format(
																				parseISO(
																					keyItem.created_at
																				),
																				"dd/MM/yyyy hh:mm a"
																			)}
																		</p>
																	</div>
																	<Link
																		href={{
																			query: {
																				...router.query,
																				action: "delete_api_key",
																				id: keyItem.id,
																			},
																		}}
																		scroll={
																			false
																		}
																		className="text-red-500"
																	>
																		<TrashIcon className="w-4 h-4" />
																	</Link>
																</div>
															)
														)}
													</div>
												)}
											</div>
											<div className="flex space-x-2">
												<Link
													scroll={false}
													href={{
														query: {
															...router.query,
															action: "new_api_key",
														},
													}}
													className="button-secondary mt-4"
												>
													Generate a new API Key
												</Link>
												<Link
													scroll={false}
													href={"/docs/api"}
													className="button-outlined mt-4"
												>
													API Documentation
												</Link>
											</div>
										</div>

										<p className="border-t mt-4  pt-4 font-medium">
											Danger zone
										</p>
										<div className="flex items-center space-x-2">
											<Link
												href={{
													query: {
														...router.query,
														action: "delete",
													},
												}}
												scroll={false}
												className="mt-4 button-danger"
											>
												Delete Account
											</Link>
										</div>
									</div>
								)}

								{activeTab === "data" && (
									<div>
										<div className="flex items-center justify-between mt-4">
											<div className="flex items-center space-x-4">
												<div>
													<div className="flex items-center space-x-2">
														<p className="font-medium text-sm md:text-base">
															HIPAA Compliance
														</p>
													</div>
													<p className="text-xs text-gray-400">
														Request for a HIPAA
														compliant account
													</p>
												</div>
											</div>

											<button
												onClick={() =>
													setEnableHIPAA(!enableHIPAA)
												}
												className={
													enableHIPAA
														? "button-outlined"
														: "button-secondary"
												}
											>
												{enableHIPAA
													? "Requested"
													: "Request HIPAA"}
											</button>
										</div>

										<div className="flex items-center justify-between mt-4">
											<div className="flex items-center space-x-4">
												<div>
													<div className="flex items-center space-x-2">
														<p className="font-medium text-sm md:text-base">
															GDPR Compliance
														</p>
													</div>
													<p className="text-xs text-gray-400">
														Request for a GDPR
														compliant account
													</p>
												</div>
											</div>

											<button
												onClick={() =>
													setEnableGDPR(!enableGDPR)
												}
												className={
													enableGDPR
														? "button-outlined"
														: "button-secondary"
												}
											>
												{enableGDPR
													? "Requested"
													: "Request GDPR"}
											</button>
										</div>

										<div className="flex items-center justify-between mt-4">
											<div className="flex items-center space-x-4">
												<div>
													<div className="flex items-center space-x-2">
														<p className="font-medium text-sm md:text-base">
															Data center location
														</p>
													</div>
													<p className="text-xs text-gray-400">
														Store your data in a
														specific location
													</p>
												</div>
											</div>

											<div>
												<Select
													options={
														dataCenterLocations?.data?.map(
															(item) => item.name
														) ?? []
													}
													onChange={(val) =>
														changeDataCenterLocation(
															val?.target.value
														)
													}
													defaultValue={
														dataCenterLocation ??
														dataCenterLocations?.data
															?.map(
																(item) =>
																	item.name
															)
															?.at(0)
													}
												/>
											</div>
										</div>

										<button
											disabled={
												editProfileMutation.isLoading
											}
											className="button-primary mt-4 space-x-2"
											onClick={saveProfile}
										>
											{editProfileMutation.isLoading && (
												<Loading
													color="white"
													size={12}
												/>
											)}
											<span>Save changes</span>
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
