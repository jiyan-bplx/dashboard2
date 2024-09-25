import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import useAllPlans from "@hooks/useAllPlans";
import useUser from "@hooks/useUser";
import { getPlanLimits } from "@api/subscriptions";
import { getAccountUsedSpace } from "@api/upload";
import { classNames } from "@utils/index";
type UsageLimitReachedModalProps = {
	isOpen: boolean;
	closeModal: () => void;
};

const UsageLimitItem = ({
	title,
	value,
	limit,
}: {
	title: string;
	value: any;
	limit: any;
}) => {
	const is90Percent = useMemo(() => {
		return value >= (limit * 90) / 100;
	}, [value, limit]);
	return (
		<div
			className={classNames(
				value === limit
					? "text-red-500"
					: is90Percent
					? "text-orange-500"
					: "text-gray-800",
				"flex items-center justify-between mt-3  text-sm"
			)}
		>
			<div>{title}</div>
			<p>
				{value}/{limit}
			</p>
		</div>
	);
};
export default function UsageLimitReachedModal({
	isOpen,
	closeModal,
}: UsageLimitReachedModalProps) {
	const { data, isLoading: isLoadingUser } = useUser({
		redirect: false,
	});
	const { data: usedSpace } = useQuery("used_space", getAccountUsedSpace);

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	const {
		data: allPlans,
		features: sections,
		getSubFeaturesForPlan,
	} = useAllPlans();

	const nextPlan = useMemo(() => {
		const plansSortedByPrice = allPlans?.data?.sort(
			(a, b) => a.pricing - b.pricing
		);

		const currPlanIndex = plansSortedByPrice?.findIndex(
			(plan) =>
				plan.stripe_price_id ===
				planLimits?.data?.subscription.stripe_price_id
		);

		const nextIndex =
			typeof currPlanIndex === "number"
				? currPlanIndex === plansSortedByPrice?.length
					? plansSortedByPrice?.length - 1
					: currPlanIndex + 1
				: -1;

		return plansSortedByPrice?.at(nextIndex);
	}, [allPlans, planLimits]);

	const router = useRouter();

	return (
		<>
			<Toaster />
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-white shadow-xl transition-all">
									<div className=" grid grid-cols-7 p-0">
										<div className="col-span-4 p-8">
											<Dialog.Title
												as="h3"
												className="text-xl font-medium leading-6 text-gray-900 "
											>
												Upgrade to{" "}
												{nextPlan?.plan
													? `${nextPlan?.plan} to `
													: " "}
												keep using ByteForms
											</Dialog.Title>
											<p className="mt-3 text-sm text-gray-500">
												You are on our free plan. Your
												usage limit is reached.
											</p>

											<div className="flex flex-col space-y-2">
												{/* <UsageLimitItem
													limit={
														planLimits?.data?.limits
															?.max_forms?.limit
													}
													value={
														planLimits?.data?.limits
															?.max_forms?.value
													}
													title="Max forms"
												/> */}
												{/* <UsageLimitItem
													limit={
														planLimits?.data?.limits
															?.number_of_responses
															?.limit
													}
													value={
														planLimits?.data?.limits
															?.number_of_responses
															?.value
													}
													title="Responses"
												/> */}

												<UsageLimitItem
													limit={`${planLimits?.data?.limits?.total_upload_limit} MB`}
													value={
														usedSpace?.data
															? (
																	usedSpace?.data /
																	(1024 *
																		1024)
															  ).toFixed(1)
															: 0
													}
													title="Storage Used"
												/>
											</div>

											<div className="mt-4 flex items-center space-x-3">
												<Link
													className="button-primary"
													href={
														"/profile/pricing?plan=" +
														nextPlan?.stripe_price_id
													}
												>
													Upgrade Plan
												</Link>
												<button
													className="button-outlined"
													onClick={closeModal}
												>
													Go back
												</button>
											</div>
										</div>
										<div className="col-span-3 bg-gray-100 w-full h-full p-8">
											<p className="text-sm font-medium">
												Included with the{" "}
												{nextPlan?.plan} plan
											</p>
											<div className="mt-3 flex flex-col space-y-2 ">
												{nextPlan?.stripe_price_id &&
													sections
														?.map((e) =>
															e.features?.flat()
														)
														?.filter((features) => {
															const item =
																features?.find(
																	(f) =>
																		f.tiers[
																			nextPlan
																				?.stripe_price_id
																		]
																);

															return (
																typeof item !==
																"undefined"
															);
														})
														?.map((item) => {
															return item.filter(
																(e) =>
																	typeof e
																		.tiers[
																		nextPlan
																			?.stripe_price_id
																	] !==
																	"boolean"
															);
														})
														?.flat()
														?.slice(0, 5)
														.map(
															(
																feature,
																subIndex
															) => (
																<div
																	key={`${feature.name}_${subIndex}`}
																	className="grid grid-cols-5"
																>
																	{typeof feature
																		.tiers[
																		nextPlan
																			?.stripe_price_id
																	] ===
																	"boolean" ? (
																		<CheckIcon
																			className="h-5 w-5 flex-shrink-0 text-green-500"
																			aria-hidden="true"
																		/>
																	) : (
																		<p className="text-sm">
																			{
																				feature
																					.tiers[
																					nextPlan
																						?.stripe_price_id
																				]
																			}
																		</p>
																	)}
																	<span className="text-sm text-gray-500 col-span-4">
																		{
																			feature.name
																		}
																	</span>
																</div>
															)
														)}
											</div>

											<p className="text-sm font-medium mt-8 ">
												Other features
											</p>
											<div className="flex mt-4 flex-wrap gap-x-2 gap-y-2">
												{nextPlan?.stripe_price_id &&
													sections
														?.map((e) =>
															e.features?.flat()
														)
														?.filter((features) => {
															const item =
																features?.find(
																	(f) =>
																		f.tiers[
																			nextPlan
																				?.stripe_price_id
																		]
																);

															return (
																typeof item !==
																"undefined"
															);
														})
														?.map((item) => {
															return item.filter(
																(e) =>
																	e.tiers[
																		nextPlan
																			?.stripe_price_id
																	] === true
															);
														})
														?.flat()
														?.slice(0, 5)
														?.map((feat) => (
															<div
																key={feat.key}
																className="bg-[#dfdfdf] px-2 py-1 rounded-md"
															>
																<p className="text-[11px]">
																	{feat.name}
																</p>
															</div>
														))}
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
