import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
	CheckIcon,
	ChevronDownIcon,
	MinusIcon,
} from "@heroicons/react/24/outline";
import { addMonths, addYears, format } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useAllPlans, { Feature } from "@hooks/useAllPlans";
import useUser from "@hooks/useUser";
import { createCheckoutSession, getPlanLimits } from "@api/subscriptions";
import { classNames, isNumber } from "@utils/index";
import Loading from "../Loading";

const currencies = [
	{ name: "INR", symbol: "₹" },
	{ name: "USD", symbol: "$" },
];
const PlansPage = ({ showNewPlan }: { showNewPlan?: boolean }) => {
	const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
	const { data, features: sections, getSubFeaturesForPlan } = useAllPlans();

	const { data: userData } = useUser();

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

	const selectedTier = useMemo(
		() =>
			(
				router.query.plan ?? data?.data?.at(0)?.stripe_price_id
			)?.toString(),
		[router, data]
	);

	const billingType = useMemo(
		() => router.query.billingType?.toString() ?? "monthly",
		[router.query]
	);

	const filteredPlans = useMemo(() => {
		if (!router.isReady || !data?.data) {
			return [];
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
			});
	}, [router, data, billingType, selectedCurrency]);

	const selectedPlan = useMemo(
		() => data?.data?.find((tier) => tier.stripe_price_id === selectedTier),
		[selectedTier, data]
	);

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits,
		{
			enabled: isSignedIn,
		}
	);

	const getCurrentPlan = () => {
		if (!planLimits) {
			return "Free";
		}
		return planLimits?.data?.limits?.stripe_price_id;
	};

	useEffect(() => {
		if (router.isReady) {
			if (
				planLimits?.data?.limits?.stripe_price_id &&
				!router.query.plan
			) {
				router.replace({
					query: {
						plan: planLimits?.data?.limits?.stripe_price_id,
						billingType:
							planLimits.data.limits.pricing_per.toUpperCase() ===
							"Y"
								? "yearly"
								: "monthly",
					},
				});
			}
		}
	}, [planLimits, router]);

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
			toast.error((err as any)?.response?.message ?? "An error occured");
		} finally {
			setLoadingPayment(false);
		}
	};

	useEffect(() => {
		if (router.isReady && typeof router.query.price_id === "string") {
			startPayment(router.query.price_id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const scrollToFeatureComparison = () => {
		const el = document.getElementById("feature-comparison");
		if (el) {
			window.scrollTo({
				behavior: "smooth",
				top: 100,
			});
			// el.scrollIntoView({
			// 	behavior: "smooth",
			// 	inline: "end",
			// });
		}
		// el?.scrollIntoView({ behavior: "smooth", block: "end" });
	};

	return (
		<>
			<Head>
				<title>Pricing | ByteForms</title>
			</Head>

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
			<div className="flex mx-auto container px-1 md:px-6 py-12 sm:py-12 lg:py-16 w-full max-w-7xl">
				<div className="flex flex-col w-full">
					<div className="grid md:grid-cols-3 grid-cols-1 ">
						<div
							className={classNames(
								showNewPlan
									? "col-span-1 md:col-span-2"
									: "col-span-1 md:col-span-3",
								""
							)}
						>
							<div className="flex items-center justify-between sm:mt-8">
								<div className="flex w-min self-center rounded-lg bg-gray-100 p-0.5 ">
									<Link
										href={{
											query: {
												...router.query,
												billingType: "monthly",
											},
										}}
										className={classNames(
											billingType === "monthly"
												? "bg-white border-gray-200 text-gray-900"
												: "border-transparent text-gray-700",
											"relative w-1/2  whitespace-nowrap rounded-md border py-2 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-indigo-500  px-8 text-center"
										)}
									>
										Monthly
									</Link>
									<Link
										href={{
											query: {
												...router.query,
												billingType: "yearly",
											},
										}}
										className={classNames(
											billingType === "yearly"
												? "bg-white border-gray-200 text-gray-900"
												: "border-transparent text-gray-700",
											"relative ml-0.5 w-min whitespace-nowrap rounded-md border py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500  px-8 text-center"
										)}
									>
										Yearly
									</Link>
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
							<div
								className={`grid md:grid-cols-2 lg:grid-cols-4`}
							>
								{router.isReady &&
									data?.data
										?.filter((tier) => {
											return (
												billingType
													.toString()
													.toUpperCase()
													.charAt(0) ===
												tier.pricing_per.toUpperCase()
											);
										})
										?.filter((item) => {
											return (
												item.currency.toLowerCase() ===
												selectedCurrency.name.toLowerCase()
											);
										})
										?.map((tier) => (
											<Link
												href={
													(isSignedIn
														? "/profile/pricing?plan="
														: "/register?plan=") +
													tier.stripe_price_id +
													"&billingType=" +
													billingType
												}
												key={tier.stripe_price_id}
												className={classNames(
													selectedTier ===
														tier.stripe_price_id
														? "border-2 border-indigo-700 "
														: "border",
													"divide-y hover:bg-indigo-50 divide-gray-200 mt-4 rounded-lg   shadow-sm mx-1 md:mx-2 p-4"
												)}
											>
												<div className="flex flex-col justify-between h-full w-full">
													<h2 className="font-medium mb-1">
														{tier.plan}
													</h2>
													<p className="text-xs text-gray-500">
														{tier.description}
													</p>

													<div>
														<h1 className="font-medium text-3xl mt-5">
															{tier.pricing ===
															0 ? (
																<span>
																	FREE
																</span>
															) : (
																<>
																	<span>
																		{tier.pricing /
																			100}{" "}
																		{
																			selectedCurrency.symbol
																		}{" "}
																	</span>
																	<span className="text-sm fw-400 text-gray-400">
																		/
																		{billingType ===
																		"yearly"
																			? "yr"
																			: "mo"}
																	</span>
																</>
															)}
														</h1>
													</div>
													{tier.pricing !== 0 && (
														<>
															<span className="text-xs text-gray-500">
																Billed{" "}
																{billingType}
															</span>
														</>
													)}

													<div>
														<Link
															href={
																getCurrentPlan() ===
																tier.stripe_price_id
																	? "#"
																	: (isSignedIn
																			? "/profile/pricing?plan="
																			: "/register?plan=") +
																	  tier.stripe_price_id +
																	  "&billingType=" +
																	  billingType
															}
															className={classNames(
																selectedTier ===
																	tier.stripe_price_id
																	? "button-secondary"
																	: "button-outlined",
																"block mt-4 "
															)}
														>
															{getCurrentPlan() ===
															tier.stripe_price_id ? (
																"Your current plan"
															) : (
																<span>
																	Get{" "}
																	{tier.pricing ===
																	0
																		? "started for free"
																		: billingType}
																</span>
															)}
														</Link>
													</div>
													<ul
														role="list"
														className="mt-6 space-y-2"
													>
														{sections
															?.map(
																(item) =>
																	item.features
															)
															?.flat()
															?.filter(
																(item) =>
																	item.tiers[
																		tier
																			.stripe_price_id
																	] === true
															)
															?.slice(0, 4)
															?.map(
																(
																	feature,
																	index
																) => (
																	<li
																		className="flex space-x-2"
																		key={`${feature.name}_${index}`}
																	>
																		{feature
																			.tiers[
																			tier
																				.stripe_price_id
																		] ===
																		true ? (
																			<CheckIcon
																				className="h-5 w-5 text-green-500"
																				aria-hidden="true"
																			/>
																		) : (
																			<MinusIcon
																				className="h-5 w-5 text-gray-400"
																				aria-hidden="true"
																			/>
																		)}

																		<span className="text-xs text-gray-500">
																			{
																				feature.name
																			}
																		</span>
																	</li>
																)
															)}
													</ul>
													<Link
														href="#feature-comparison"
														className="text-xs text-green-700 mt-2"
													>
														See all features
													</Link>
												</div>
											</Link>
										))}
							</div>
							<Link href={"https://www.bytesuite.io/support"}>
								<div className="border divide-y hover:bg-indigo-50 divide-gray-200 mt-4 rounded-lg   shadow-sm mx-1 md:mx-2 p-4">
									<div className="flex flex-row justify-between h-full w-full">
										<div className="flex flex-col">
											<h2 className="font-medium mb-1">
												Enterprise Plan
											</h2>
											<p className="text-xs text-gray-500">
												Get enterprise grade scale and
												support! <br />
												Contact us to get customised
												pricing based on your needs.
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
						</div>
						{showNewPlan && (
							<div>
								<div className="hover:shadow-xl h-min hover:ring-1 hover:ring-black/10 border border-gray-200 bg-white mt-4 mx-1 md:mx-2 p-4 rounded-md shadow col-span-1 md:col-span-2">
									<div className="flex flex-col justify-between h-full w-full">
										<div className="">
											<h2 className="font-medium mb-4">
												{getCurrentPlan() ===
												selectedTier
													? "Your current plan"
													: "Your New Plan"}
											</h2>
											<hr className="h-px my-1 mb-3 bg-gray-300 border-0"></hr>
											<h2>
												<span className="text-indigo-500">
													{selectedPlan?.plan}{" "}
												</span>
												<span className="capitalize">
													(
													{selectedPlan?.pricing_per ===
													"Y"
														? "yearly"
														: "monthly"}
													)
												</span>
											</h2>

											<p className="text-sm text-gray-500">
												{isNumber(
													getSubFeaturesForPlan(
														selectedTier ?? "Free",
														"number_of_responses"
													)?.toString()
												)
													? Intl.NumberFormat().format(
															getSubFeaturesForPlan(
																selectedTier ??
																	"Free",
																"number_of_responses"
															) as any
													  )
													: getSubFeaturesForPlan(
															selectedTier ??
																"Free",
															"number_of_responses"
													  )}{" "}
												responses per month
											</p>
										</div>
										<hr className="h-px my-4 mt-4 bg-gray-300 border-0"></hr>
										<p className="text-sm font-medium mb-1">
											Total
										</p>
										<h1 className="font-medium mb-1 text-xl">
											{selectedPlan?.pricing === 0 ? (
												"FREE"
											) : (
												<span>
													{(selectedPlan?.pricing ??
														0) / 100}{" "}
													{selectedCurrency.symbol}
												</span>
											)}
										</h1>

										{selectedPlan?.pricing !== 0 && (
											<>
												<hr className="h-px my-2 mb-6 bg-gray-300 border-0"></hr>
												<ul className="list-disc mx-3">
													<li className="text-sm text-gray-400">
														You'll pay{" "}
														{selectedPlan?.pricing
															? selectedPlan?.pricing /
															  100
															: 0}{" "}
														{
															selectedCurrency.symbol
														}{" "}
														now, which is prorated
														for the current billing
														period.
													</li>
													<li className="text-sm text-gray-400">
														Your plan is billed{" "}
														{billingType} and will
														renew for{" "}
														{selectedPlan?.pricing
															? selectedPlan?.pricing /
															  100
															: 0}{" "}
														{
															selectedCurrency.symbol
														}{" "}
														(plus any applicable
														taxes and minus any
														discounts) on{" "}
														{format(
															billingType ===
																"monthly"
																? addMonths(
																		new Date(),
																		1
																  )
																: addYears(
																		new Date(),
																		1
																  ),
															"MMM dd, yyyy"
														)}
														.
													</li>
													<li className="text-sm text-gray-400">
														You can cancel any time.
													</li>
												</ul>
											</>
										)}
										{selectedPlan?.pricing === 0 &&
										userData?.data?.id
											? null
											: getCurrentPlan() !==
													selectedTier &&
											  selectedPlan && (
													<>
														<hr className="h-px my-2 mt-6 bg-gray-300 border-0"></hr>
														<button
															onClick={() =>
																startPayment(
																	selectedPlan.stripe_price_id as string
																)
															}
															className="button-primary my-2 space-x-1 text-center "
														>
															<span className="text-center mx-auto">
																Get{" "}
																{
																	selectedPlan?.plan
																}
															</span>
														</button>
													</>
											  )}
									</div>
								</div>
							</div>
						)}
					</div>

					<div
						id="feature-comparison"
						className="mx-auto max-w-7xl bg-white py-16 sm:py-12 sm:px-6 lg:px-8 mt-5"
					>
						<div className="text-xs text-center w-full flex items-center flex-col text-gray-700 mb-4 md:mb-8">
							<p className="">Plan comparison</p>
							<ChevronDownIcon className="w-4 h-4" />
						</div>

						{/* Mobile only */}
						<div className="mx-auto max-w-2xl space-y-16 md:hidden">
							{router.isReady &&
								filteredPlans?.map((tier, tierIdx) => (
									<section key={tier.stripe_price_id}>
										<div className="mb-8 px-6 sm:px-4 ">
											<h2 className="text-lg font-medium leading-6 text-gray-900">
												{tier.plan}
											</h2>
											<p className="mt-4">
												<span className="text-4xl font-bold tracking-tight text-gray-900">
													{selectedCurrency.symbol}
													{tier.pricing / 100}
												</span>{" "}
												<span className="text-base font-medium text-gray-500">
													/
													{billingType === "yearly"
														? "yr"
														: "mo"}
												</span>
											</p>
											<p className="mt-4 text-sm text-gray-500">
												{tier.description}
											</p>

											{tier.pricing === 0 &&
											userData?.data?.id ? null : (
												<Link
													href={
														getCurrentPlan() ===
														tier.stripe_price_id
															? "#"
															: (isSignedIn
																	? "/profile/pricing?plan="
																	: "/register?plan=") +
															  tier.stripe_price_id +
															  "&billingType=" +
															  billingType
													}
													className={classNames(
														"mt-6 w-full",
														getCurrentPlan() ===
															tier.stripe_price_id
															? "button-secondary"
															: "button-primary"
													)}
												>
													<p className="w-full text-center">
														{getCurrentPlan() ===
														tier.stripe_price_id
															? "Your current plan"
															: tier.pricing === 0
															? "Get started for free"
															: `Buy ${tier.plan}`}
													</p>
												</Link>
											)}
										</div>

										{sections?.map((section, index) => (
											<table
												key={`${section.name}_${index}`}
												className="w-full"
											>
												<caption className="border-t border-gray-200 bg-gray-50 py-3 px-6 text-left text-sm font-medium text-gray-900 sm:px-4">
													{section.name}
												</caption>
												<thead>
													<tr>
														<th
															className="sr-only"
															scope="col"
														>
															Feature
														</th>
														<th
															className="sr-only"
															scope="col"
														>
															Included
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{section.features.map(
														(feature, subIndex) => (
															<tr
																key={`${feature.name}_${subIndex}`}
																className="border-t border-gray-200"
															>
																<th
																	className="py-5 px-6 text-center text-sm font-normal text-gray-500 sm:px-4"
																	scope="row"
																>
																	{
																		feature.name
																	}
																</th>
																<td className="py-5 pr-6 sm:pr-4">
																	{typeof feature
																		.tiers[
																		tier
																			.stripe_price_id
																	] ===
																	"string" ? (
																		<span className="block text-right text-sm text-gray-700">
																			{
																				feature
																					.tiers[
																					tier
																						.stripe_price_id
																				]
																			}
																		</span>
																	) : (
																		<>
																			{feature
																				.tiers[
																				tier
																					.stripe_price_id
																			] ===
																			true ? (
																				<CheckIcon
																					className="ml-auto h-5 w-5 text-green-500"
																					aria-hidden="true"
																				/>
																			) : (
																				<MinusIcon
																					className="ml-auto h-5 w-5 text-gray-400"
																					aria-hidden="true"
																				/>
																			)}

																			<span className="sr-only">
																				{feature
																					.tiers[
																					tier
																						.stripe_price_id
																				] ===
																				true
																					? "Yes"
																					: "No"}
																			</span>
																		</>
																	)}
																</td>
															</tr>
														)
													)}
												</tbody>
											</table>
										))}

										<div
											className={classNames(
												tierIdx <
													(data?.data
														? data?.data?.length - 1
														: 0)
													? "py-5 border-b"
													: "pt-5",
												"border-t border-gray-200 px-6 sm:px-4"
											)}
										>
											<Link
												href={
													getCurrentPlan() ===
													tier.stripe_price_id
														? "#"
														: (isSignedIn
																? "/profile/pricing?plan="
																: "/register?plan=") +
														  tier.stripe_price_id +
														  "&billingType=" +
														  billingType
												}
												className={classNames(
													"mt-6 w-full",
													getCurrentPlan() ===
														tier.stripe_price_id
														? "button-secondary"
														: "button-primary"
												)}
											>
												<p className="w-full text-center">
													{getCurrentPlan() ===
													tier.stripe_price_id
														? "Your current plan"
														: tier.pricing === 0
														? "Get started for free"
														: `Buy ${tier.plan}`}
												</p>
											</Link>
										</div>
									</section>
								))}
						</div>

						{/* md+ */}

						<div className="hidden md:block">
							<table className="h-px w-full table-fixed">
								<caption className="sr-only">
									Pricing plan comparison
								</caption>
								<thead className="">
									<tr>
										<th
											className="px-6 pb-4 text-left text-sm font-medium text-gray-900"
											scope="col"
										>
											<span className="sr-only">
												Feature by
											</span>
											<span>Plans</span>
										</th>
										{filteredPlans?.map((tier) => (
											<th
												key={tier.stripe_price_id}
												className="px-6 pb-4 text-left text-lg font-medium leading-6 text-gray-900"
												scope="col"
											>
												{tier.plan}
											</th>
										))}
									</tr>
								</thead>

								<tbody className="divide-y divide-gray-200 border-t border-gray-200">
									<tr>
										<th
											className="py-8 px-6 text-left align-top text-sm font-medium text-gray-900"
											scope="row"
										>
											Pricing
										</th>
										{filteredPlans?.map((tier) => (
											<td
												key={tier.stripe_price_id}
												className="h-full py-8 px-4"
											>
												<div className="h-full justify-between flex flex-col">
													<div>
														<p>
															<span className="text-3xl lg:text-4xl md:font-semibold lg:font-bold tracking-tight text-gray-900">
																{
																	selectedCurrency.symbol
																}
																{tier.pricing /
																	100}
															</span>{" "}
															<span className="text-sm tracking-tight lg:text-base font-medium text-gray-500">
																/
																{billingType ===
																"yearly"
																	? "yr"
																	: "mo"}
															</span>
														</p>
														<p className="mt-4 mb-4 text-sm text-gray-500">
															{tier.description}
														</p>
													</div>
													{tier.pricing === 0 &&
													userData?.data
														?.id ? null : (
														<Link
															href={
																getCurrentPlan() ===
																tier.stripe_price_id
																	? "#"
																	: "?plan=" +
																	  tier.stripe_price_id +
																	  "&billingType=" +
																	  billingType
															}
															className={classNames(
																"mt-6 ",
																getCurrentPlan() ===
																	tier.stripe_price_id
																	? "button-secondary"
																	: "button-primary"
															)}
														>
															<p className="text-center w-full">
																{getCurrentPlan() ===
																tier.stripe_price_id
																	? "Your current plan"
																	: tier.pricing ===
																	  0
																	? "Get started for free"
																	: `Buy ${tier.plan}`}
															</p>
														</Link>
													)}
												</div>
											</td>
										))}
									</tr>

									{sections?.map((section, index) => (
										<Fragment
											key={`${section.name}_${index}`}
										>
											<tr>
												<th
													className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900"
													colSpan={5}
													scope="colgroup"
												>
													{section.name}
												</th>
											</tr>

											{section.features
												?.map((f) => {
													const allowedTiers =
														Object.keys(
															f.tiers
														)?.filter((tier) =>
															filteredPlans.some(
																(p) =>
																	p.stripe_price_id ===
																	tier
															)
														);
													return {
														...f,
														tiers: allowedTiers.reduce(
															function (
																result: Feature["tiers"],
																item
															) {
																result[item] =
																	f.tiers[
																		item
																	]; //a, b, c
																return result;
															},
															{}
														),
													} as Feature;
												})
												.map((feature, index) => (
													<tr
														id={`${feature.name}_${index}`}
														key={`${feature.name}_${index}`}
													>
														<th
															className="py-5 px-6 text-left text-sm font-normal text-gray-500"
															scope="row"
														>
															{feature.name}
														</th>
														{router.isReady &&
															filteredPlans?.map(
																(tier) => (
																	<td
																		key={
																			tier.stripe_price_id
																		}
																		id={
																			tier.stripe_price_id
																		}
																		className="py-5 px-6"
																	>
																		{typeof feature
																			.tiers[
																			tier
																				.stripe_price_id
																		] ===
																		"string" ? (
																			<span className="flex justify-center text-sm text-gray-700">
																				{
																					feature
																						.tiers[
																						tier
																							.stripe_price_id
																					]
																				}
																			</span>
																		) : (
																			<>
																				{feature
																					.tiers[
																					tier
																						.stripe_price_id
																				] ===
																				true ? (
																					<div className="flex justify-center">
																						<CheckIcon
																							className="h-5 w-5 text-green-500"
																							aria-hidden="true"
																						/>
																					</div>
																				) : (
																					<div className="flex justify-center">
																						<MinusIcon
																							className="h-5 w-5 text-gray-400"
																							aria-hidden="true"
																						/>
																					</div>
																				)}

																				<span className="sr-only">
																					{feature
																						.tiers[
																						tier
																							.stripe_price_id
																					] ===
																					true
																						? "Included"
																						: "Not included"}{" "}
																					in{" "}
																					{
																						tier.stripe_price_id
																					}
																				</span>
																			</>
																		)}
																	</td>
																)
															)}
													</tr>
												))}
										</Fragment>
									))}
								</tbody>
								<tfoot>
									<tr className="border-t border-gray-200">
										<th className="sr-only" scope="row">
											Choose your plan
										</th>
										{filteredPlans?.map((tier) => (
											<td
												key={tier.stripe_price_id}
												className="px-6 pt-5"
											>
												<Link
													href={
														tier.pricing === 0 &&
														userData?.data?.id
															? "#"
															: getCurrentPlan() ===
															  tier.stripe_price_id
															? "#"
															: "?plan=" +
															  tier.stripe_price_id +
															  "&billingType=" +
															  billingType
													}
													className={classNames(
														tier.pricing === 0 &&
															userData?.data?.id
															? "button-outlined !bg-gray-100 !text-opacity-70"
															: getCurrentPlan() ===
															  tier.stripe_price_id
															? "button-secondary"
															: "button-primary",
														"mt-6 w-full"
													)}
												>
													<p className="w-full text-center">
														{getCurrentPlan() ===
														tier.stripe_price_id
															? "Your current plan"
															: tier.pricing === 0
															? "Get started for free"
															: `Buy ${tier.plan}`}
													</p>
												</Link>
											</td>
										))}
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PlansPage;
