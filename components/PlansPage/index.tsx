import { Disclosure, Listbox, Transition } from "@headlessui/react";
import {
	CheckIcon,
	ChevronUpDownIcon,
	PlusIcon,
} from "@heroicons/react/20/solid";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useAllPlans from "../../hooks/useAllPlans";
import useUser from "../../hooks/useUser";
import {
	createCheckoutSession,
	getPlanLimits,
} from "../../lib/api/subscriptions";
import { classNames } from "../../utils";
import Loading from "../Loading";
const FreeFeatures = [
	{
		name: "Unlimited Forms",
		description: `Create unlimited forms with unlimited fields. No restrictions on the number of forms you can create.`,
	},
	{
		name: "Unlimited submissions",
		description: `No restrictions on the number of submissions you can receive. `,
	},
	{
		name: "Unlimited Inputs/Questions",
		description: `Add as many questions as you want to your form. No restrictions on the number of questions you can add.`,
	},
	{
		name: "AI Form Builder",
		description: `Create forms in minutes with our AI form builder. `,
	},
	{
		name: "Draft Submissions",
		description: `Resume in-progress submissions later. `,
	},
	{
		name: "File Uploads",
		description: `Allow users to upload files with their submissions. `,
	},
	{
		name: "Form Templates",
		description: `Choose from a variety of form templates to get started quickly. `,
	},
	{
		name: "Embed Forms",
		description: `Embed forms on your website/in a popup or share them via a link. `,
	},
	{
		name: "Field Conditions",
		description: `Add conditional logic to your form fields to perform custom logic based on user input. `,
	},
	{
		name: "Custom Success Message",
		description: `Show a custom success message after form submission. `,
	},
	{
		name: "Redirect After Submission",
		description: `Redirect users to a custom URL after form submission. `,
	},
	{
		name: "Form Analytics",
		description: `Track form views, submissions, and conversion rates. `,
	},
	{
		name: "Export Submissions",
		description: `Export form submissions to CSV/Excel. `,
	},
	{
		name: "API Access",
		description: `Access form data via API. `,
	},
	{
		name: "Integrations",
		description: `Integrate with Zapier, Google Sheets, Notion, Slack, Google Drive, and more. `,
	},
	{
		name: "Quiz Forms",
		description: `Create quiz forms with scoring and correct answers. `,
	},
	{
		name: "AMP Forms",
		description: `Create and share AMP forms that users can fill out directly from Email Clients. `,
	},
	{
		name: "And many more",
	},
];

const PaidFeatures = [
	{
		title: "Submission Limits",
		description: "Limit the number of submissions a form can receive.",
	},
	{
		title: "Email Notifications",
		description: "Get notified via email when a form is submitted.",
	},
	{
		title: "Remove Branding",
		description: "Remove ByteForms branding from your forms.",
	},
	{
		title: "Password Protected Forms",
		description: "Protect your forms with a password.",
	},
	{
		title: "Increase File Upload Size",
		description: "Increase the file upload size limit.",
	},
	{
		title: "Priority Support",
		description: "Get priority support from our team.",
	},
	{
		title: "Custom Domains",
		description: `Use your own domain to host forms. `,
	},
];

const faqs = [
	{
		question: `Are there any hidden fees?`,
		answer: `No, there are no hidden fees. You only pay the amount mentioned on the pricing page + taxes (varies by country).`,
	},
	{
		question: `Can I cancel my subscription?`,
		answer: `Yes, you can cancel your subscription anytime. Your subscription will be active until the end of the billing period.`,
	},
	{
		question: `Can I change my plan?`,
		answer: `Yes, you can change your plan at any time. Your new plan will be effective immediately.`,
	},
	{
		question: `Do you offer refunds?`,
		answer: `We do not offer refunds. However, you can cancel your subscription anytime.`,
	},
	{
		question: `Can I upgrade/downgrade my plan?`,
		answer: `Yes, you can upgrade/downgrade your plan at any time. Your new plan will be effective immediately.`,
	},
	// {
	// 	question: `Do you offer custom plans?`,
	// 	answer: `Yes, we offer custom plans for enterprise customers. Contact us for more information.`,
	// },
	{
		question: `Are there any limits on the free plan?`,
		answer: `We offer unlimited forms, submissions and file uploads within fair usage limits. For high volume usage, consider upgrading to a paid plan.`,
	},
];

const currencies = [
	{ name: "INR", symbol: "₹" },
	{ name: "USD", symbol: "$" },
];
const PlansPage: NextPage = () => {
	const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

	const { data, features: sections, getSubFeaturesForPlan } = useAllPlans();

	const { data: userData } = useUser({ redirect: false });

	useEffect(() => {
		if (!userData?.data) {
			setSelectedCurrency({ name: "USD", symbol: "$" });
			return;
		} else {
			if (userData?.data?.address?.country === "IN") {
				setSelectedCurrency({ name: "INR", symbol: "₹" });
				return;
			} else {
				setSelectedCurrency({ name: "USD", symbol: "$" });
				return;
			}
		}
	}, [userData]);

	const isSignedIn = useMemo(
		() => (userData?.data?.email ? true : false),
		[userData]
	);

	const router = useRouter();
	const billingType = useMemo(
		() => router.query.billingType?.toString() ?? "monthly",
		[router.query]
	);
	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits,
		{
			enabled: isSignedIn,
			onSuccess: (data) => {
				if (!router.query.plan && data?.data) {
					router.replace(
						{
							query: {
								...router.query,
								billingType:
									data?.data?.limits.pricing_per.toUpperCase() ===
									"Y"
										? "yearly"
										: "monthly",
							},
						},
						undefined,
						{ scroll: false }
					);
				}
			},
		}
	);

	const currentPlan = useMemo(() => {
		if (!planLimits) {
			return "Free";
		}
		return planLimits?.data?.limits?.stripe_price_id;
	}, [planLimits]);

	const [loadingPayment, setLoadingPayment] = useState(false);

	const startPayment = async (price_id: string) => {
		try {
			setLoadingPayment(true);
			const res = await createCheckoutSession({
				price_id,
			});

			if (res.data) {
				router.push(res.data);
			}
		} catch (err) {
			console.error("[startPayment]", err);
			toast.error(
				(err as any)?.response?.data?.message ?? "An error occured"
			);
		} finally {
			setLoadingPayment(false);
		}
	};

	const proPlan = useMemo(() => {
		if (!router.isReady || !data?.data) {
			return null;
		}
		return data?.data
			?.filter((tier) => {
				return (
					billingType.toString().toUpperCase().charAt(0) ===
					tier.pricing_per.toUpperCase()
				);
			})
			?.filter((item) => {
				return (
					item.currency.toLowerCase() ===
					selectedCurrency.name.toLowerCase()
				);
			})
			?.sort((a, b) => b.pricing - a.pricing)
			?.at(0);
	}, [router, data, billingType, selectedCurrency]);

	useEffect(() => {
		if (router.isReady && typeof router.query.plan === "string") {
			startPayment(router.query.plan);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	return (
		<div className="bg-gradient-to-b from-white to-gray-50">
			{loadingPayment && (
				<div
					className="fixed h-screen bg-black inset-0 flex items-center justify-center max-w-screen bg-opacity-50"
					style={{
						zIndex: 1000,
					}}
				>
					<Loading />
				</div>
			)}
			<div className="flex flex-col mx-auto container px-1 md:px-6 py-12 sm:py-12 lg:py-16 w-full max-w-6xl ">
				<h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl text-center max-w-6xl mx-auto">
					Build <span className="text-pink-500"> unlimited </span>{" "}
					number of forms in minutes, for{" "}
					<span className="text-violet-500 relative">
						{" "}
						<span>Free</span>
						<span
							className="absolute top-full left-0 inset-0"
							style={{
								// flip vertically
								transform: "scaleY(-1)",
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 1213 73"
								fill="rgb(139,92,246)"
								className="w-full"
							>
								<path d="M1212.41 5.51c3.05 12.87-22.36 11.93-30.26 15.68-94.32 20.51-269.09 32.42-365.48 37.51-77.91 3.82-155.66 9.93-233.67 11.67-57.49 2.56-115.05-.19-172.57 1.58-121.28.91-243.17 1.88-363.69-13.33-12.51-2.64-25.8-2.92-37.77-7.45-30.66-21.42 26.02-21.53 38.52-19.26 359.95 29.05 364.68 27.36 638.24 17.85 121-3.78 241.22-19.21 426.76-41.46 4.72-.65 9.18 3.56 8.45 8.36a941.74 941.74 0 0 0 54.29-9.21c9.33-2.33 18.7-4.56 27.95-7.19a7.59 7.59 0 0 1 9.23 5.24Z"></path>
							</svg>
						</span>
					</span>
				</h1>
				<p className="mt-6  leading-8 text-gray-600 text-center max-w-lg mx-auto">
					All-in-one solution for form creation, submission
					management, and data integration. Experience the difference
					today!
				</p>

				<div className="shadow-xl border mt-5 px-6 md:px-12  rounded-lg w-full py-4 pb-8 bg-white">
					<p className="text-center mt-4 w-full text-xl font-semibold ">
						Whats included ?
					</p>
					{/* <PlansPage /> */}
					<div>
						<dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-3 mt-12 lg:gap-y-8">
							{FreeFeatures.map((feature, index) => (
								<div
									key={feature.name}
									className="relative pl-9"
								>
									<dt className="font-semibold text-gray-900">
										<div className="absolute top-1 left-0">
											{index ===
											FreeFeatures.length - 1 ? (
												<PlusIcon
													className="h-5 w-5 text-indigo-500"
													aria-hidden="true"
												/>
											) : (
												<CheckIcon
													className="h-5 w-5 text-indigo-500"
													aria-hidden="true"
												/>
											)}
										</div>
										<span className="text-sm">
											{feature.name}
										</span>
									</dt>
									<dd className="text-gray-500 text-xs">
										{feature.description}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>

				<div className="mt-16">
					<h2 className="text-3xl text-center font-medium">
						Want more ?
					</h2>
					<p className="text-center mt-4 text-gray-500">
						Upgrade to our premium plan to get access to more
						features.{" "}
					</p>
				</div>

				<div className="border rounded-xl mt-6 shadow bg-white  grid grid-cols-12 overflow-hidden">
					<div className="md:col-span-9 col-span-12 px-4 md:px-8 py-6 md:py-10">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-xl font-semibold">
									Pro Plan
								</p>
								<p className="text-sm text-gray-600">
									All the features of the free plan plus:
								</p>
							</div>
							{userData?.data ? null : (
								<Listbox
									value={selectedCurrency}
									onChange={setSelectedCurrency}
								>
									<div className="relative mt-1 mr-3">
										<Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
											<span className="block truncate">
												{selectedCurrency.name}
											</span>
											<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
												<ChevronUpDownIcon
													className="h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
											</span>
										</Listbox.Button>
										<Transition
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
										>
											<Listbox.Options className="absolute mt-1 max-h-60 w-28 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
												{currencies.map(
													(person, personIdx) => (
														<Listbox.Option
															key={personIdx}
															className={({
																active,
															}) =>
																`relative cursor-default select-none py-2 pl-10 pr-4 ${
																	active
																		? "bg-amber-100 text-amber-900"
																		: "text-gray-900"
																}`
															}
															value={person}
														>
															<>
																<span
																	className={`block truncate ${
																		selectedCurrency.name ===
																		person.name
																			? "font-medium"
																			: "font-normal"
																	}`}
																>
																	{
																		person.name
																	}
																</span>
																{selectedCurrency.name ===
																person.name ? (
																	<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
																		<CheckIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																	</span>
																) : null}
															</>
														</Listbox.Option>
													)
												)}
											</Listbox.Options>
										</Transition>
									</div>
								</Listbox>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
							{PaidFeatures.map((feature) => (
								<div key={feature.title}>
									<div className="flex items-center mt-4">
										<CheckIcon className="h-5 w-5 text-indigo-500" />
										<p className="ml-2 text-gray-800 text-sm font-medium">
											{feature.title}
										</p>
									</div>
									<p className="text-xs text-gray-500 ml-7">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
					<div
						className=" md:col-span-3 col-span-12 h-full flex flex-col py-4 px-4"
						style={{
							background:
								"linear-gradient(118deg, #9954f2, #6701ef)",
						}}
					>
						<div className="flex w-min self-center  justify-center rounded-lg bg-transparent border py-0.5">
							<Link
								scroll={false}
								href={{
									query: {
										...router.query,
										billingType: "monthly",
									},
								}}
								className={classNames(
									billingType === "monthly"
										? "bg-white border-gray-200 text-gray-900"
										: "border-transparent text-gray-300",
									"relative w-1/2  whitespace-nowrap rounded-md border py-2 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-indigo-500  px-8 text-center"
								)}
							>
								Monthly
							</Link>
							<Link
								scroll={false}
								href={{
									query: {
										...router.query,
										billingType: "yearly",
									},
								}}
								className={classNames(
									billingType === "yearly"
										? "bg-white border-gray-200 text-gray-900"
										: "border-transparent text-gray-300",
									"relative ml-0.5 w-min whitespace-nowrap rounded-md border py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500  px-8 text-center"
								)}
							>
								Yearly
							</Link>
						</div>
						<div className="flex items-center justify-center flex-grow">
							<div>
								<p className="text-white text-5xl mt-4">
									<span className="font-semibold">
										{proPlan?.pricing
											? proPlan?.pricing / 100
											: 0}
										{selectedCurrency.symbol}{" "}
									</span>
									<span className="text-sm fw-400 text-gray-100">
										/
										{billingType === "yearly" ? "yr" : "mo"}
									</span>
								</p>
								<p className="text-xs text-gray-200 text-center mt-2">
									Cancel anytime
								</p>
							</div>
						</div>
						{proPlan &&
							(currentPlan === proPlan.stripe_price_id ? (
								<div className="button-outlined text-center items-center justify-center !py-3 !bg-gray-800 !text-gray-100 !border-0 !rounded-lg">
									<p>Current plan</p>
								</div>
							) : (
								<Link
									href={
										(isSignedIn
											? "/profile/pricing?plan="
											: "/register?plan=") +
										proPlan.stripe_price_id +
										"&billingType=" +
										billingType
									}
									className="button-outlined text-center items-center justify-center !py-3 !bg-black !text-white !border-0 !rounded-lg"
								>
									<span className="text-sm">Get started</span>
								</Link>
							))}
					</div>
				</div>
				{/* <div className="mt-5">
					<Link href={"https://www.bytesuite.io/support"}>
						<div className="border divide-y hover:bg-indigo-50 divide-gray-200 mt-4 rounded-lg shadow-sm  p-4">
							<div className="flex flex-row justify-between h-full w-full">
								<div className="flex flex-col">
									<h2 className="font-medium mb-1">
										Enterprise Plan
									</h2>
									<p className="text-xs text-gray-500">
										Get enterprise grade scale and support!{" "}
										<br />
										Contact us to get customised pricing
										based on your needs.
									</p>
									<div>
										<span className="button-outlined block mt-4 ">
											Get Enterprise Plan
										</span>
									</div>
								</div>
								<div className="flex flex-col justify-between">
									<ul
										role="list"
										className="mt-6 md:mt-0 space-y-2"
									>
										<li className="flex space-x-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												aria-hidden="true"
												className="h-5 w-5 text-green-500"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 12.75l6 6 9-13.5"
												></path>
											</svg>
											<span className="text-xs text-gray-500">
												Tailored response limits
											</span>
										</li>
										<li className="flex space-x-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												aria-hidden="true"
												className="h-5 w-5 text-green-500"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 12.75l6 6 9-13.5"
												></path>
											</svg>
											<span className="text-xs text-gray-500">
												Tailored storage limits
											</span>
										</li>
										<li className="flex space-x-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												aria-hidden="true"
												className="h-5 w-5 text-green-500"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 12.75l6 6 9-13.5"
												></path>
											</svg>
											<span className="text-xs text-gray-500">
												VIP support
											</span>
										</li>
										<li className="flex space-x-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												aria-hidden="true"
												className="h-5 w-5 text-green-500"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 12.75l6 6 9-13.5"
												></path>
											</svg>
											<span className="text-xs text-gray-500">
												Custom Domains
											</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</Link>
				</div> */}

				<div className="py-24">
					<div className="mx-auto  divide-y divide-gray-900/10">
						<h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
							Frequently asked questions
						</h2>
						<dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
							{faqs.map((faq) => (
								<Disclosure
									as="div"
									key={faq.question}
									className="pt-6"
								>
									{({ open }) => (
										<>
											<dt>
												<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
													<span className="text-base font-semibold leading-7">
														{faq.question}
													</span>
													<span className="ml-6 flex h-7 items-center">
														{open ? (
															<PlusSmallIcon
																className="h-6 w-6"
																aria-hidden="true"
															/>
														) : (
															<MinusSmallIcon
																className="h-6 w-6"
																aria-hidden="true"
															/>
														)}
													</span>
												</Disclosure.Button>
											</dt>
											<Disclosure.Panel
												as="dd"
												className="mt-2 pr-12"
											>
												<p className="text-base leading-7 text-gray-600">
													{faq.answer}
												</p>
											</Disclosure.Panel>
										</>
									)}
								</Disclosure>
							))}
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlansPage;
