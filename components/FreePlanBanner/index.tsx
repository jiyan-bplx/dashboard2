import Link from "next/link";
import { useQuery } from "react-query";
import { getPlanLimits } from "@api/subscriptions";

const FreePlanBanner = () => {
	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	if (planLimits?.data?.limits?.plan?.toLowerCase() !== "free") return null;

	return (
		<div className="bg-[#ffffff] hover:bg-[#FF3660]">
			<div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="font-medium text-white text-xs md:text-sm">
						<span className="">
							You are on our free plan. Upgrade to use all
							features.
							{/* You can receive upto{" "}
							{planLimits?.data?.limits?.number_of_responses
								?.limit ?? 0}{" "} responses. */}
						</span>
						<span className="ml-2 inline-block">
							<Link
								href="/profile/pricing"
								className="font-mediumtext-white underline"
							>
								View pricing
								<span aria-hidden="true"> &rarr;</span>
							</Link>
						</span>
					</p>
				</div>
				<div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
					<button
						type="button"
						className="flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
					>
						<span className="sr-only">Dismiss</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FreePlanBanner;
