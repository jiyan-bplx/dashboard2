import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import Loading from "@components/Loading";
import { getCheckoutSession } from "@api/subscriptions";
import { format } from "date-fns";

const getSymbolFromCurrency = (currency: string): string => {
	try {
		const currencyFormatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		});
		const currencySymbol = currencyFormatter.formatToParts(1)[0].value;
		return currencySymbol;
	} catch (error) {
		console.error(`Error getting currency symbol for ${"en-US"}: ${error}`);
		return "";
	}
};

const PaymentSuccessPage = () => {
	const router = useRouter();

	const { data, isLoading } = useQuery({
		queryKey: ["checkout-session"],
		queryFn: () => getCheckoutSession(router.query.session_id as string),
		enabled: typeof router.query.session_id === "string",
		retry: false,
	});
	useEffect(() => {
		if (router.isReady && !router.query.session_id) {
			toast.error("No session ID provided");
			// router.push("/");
		}
	}, [router]);

	const printInvoice = () => {
		window.print();
	};

	return (
		<div className="bg-gray-100">
			<Toaster />
			{/* <p>PaymentSuccessPage</p>
			Session ID: {router.query.session_id} */}

			<div className=" flex items-center justify-center h-full min-h-screen">
				<div className="rounded-md overflow-hidden h-full max-w-md w-full z-[60] bg-white shadow-xl  mx-auto ">
					<div className="relative overflow-hidden min-h-[8rem] text-center bg-[url('https://preline.co/assets/svg/component/abstract-bg-1.svg')] bg-no-repeat bg-center">
						<figure className="absolute inset-x-0 bottom-0">
							<svg
								preserveAspectRatio="none"
								xmlns="http://www.w3.org/2000/svg"
								x="0px"
								y="0px"
								viewBox="0 0 1920 100.1"
							>
								<path
									fill="currentColor"
									className="fill-white "
									d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
								></path>
							</svg>
						</figure>
					</div>

					<div className="relative z-10 -mt-12">
						<span className="mx-auto flex justify-center items-center w-[62px] h-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm ">
							<svg
								className="w-6 h-6"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
								<path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
							</svg>
						</span>
					</div>

					<div>
						{!router.query.session_id ? (
							<div className="text-center mt-4">
								<p>Invalid Request.</p>
								<p>No session id was provided</p>
								<Link
									className="button-primary my-4"
									href="/pricing"
								>
									Try again
								</Link>
							</div>
						) : isLoading ? (
							<div className="flex flex-col items-center mt-4 mb-8">
								<p>Checking your subscription</p>
								<Loading size={20} color="black" />
							</div>
						) : !data?.data ? (
							<div className="flex flex-col items-center mt-4 mb-8">
								<p className="text-red-500">
									Failed to fetch Invoice details
								</p>
								<Link href="/" className="mt-4 button-primary">
									Go back Home
								</Link>
							</div>
						) : (
							<div className="p-4 sm:p-7 overflow-y-auto">
								<div className="text-center">
									<h3 className="text-lg font-semibold text-gray-800 ">
										Payment {data?.data?.status}
									</h3>
									<p className="text-sm text-gray-500">
										Invoice {data.data?.invoice.id}
									</p>
								</div>

								<div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
									<div>
										<span className="block text-xs uppercase text-gray-500">
											Amount paid:
										</span>
										<span className="block text-sm font-medium text-gray-800 ">
											{getSymbolFromCurrency(
												data?.data?.currency ?? "usd"
											)}
											{data?.data?.amount_total / 100}
										</span>
									</div>

									<div>
										<span className="block text-xs uppercase text-gray-500">
											Date paid:
										</span>
										<span className="block text-sm font-medium text-gray-800 ">
											{format(
												data?.data?.created ??
													new Date(),
												"dd/MM/yyyy hh:mm a"
											)}
										</span>
									</div>

									<div>
										<span className="block text-xs uppercase text-gray-500">
											Payment method:
										</span>
										<div className="flex items-center gap-x-2">
											<span className="block text-sm font-medium text-gray-800 capitalize ">
												{data?.data?.payment_method_types?.join(
													", "
												)}
											</span>
										</div>
									</div>
								</div>

								<div className="mt-5 sm:mt-10">
									<h4 className="text-xs font-semibold uppercase text-gray-800 ">
										Summary
									</h4>

									<ul className="mt-3 flex flex-col">
										<li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg ">
											<div className="flex items-center justify-between w-full">
												<span>
													Subscription Charges
												</span>
												<span>
													{getSymbolFromCurrency(
														data?.data?.currency ??
															"usd"
													)}
													{data?.data
														?.amount_subtotal / 100}
												</span>
											</div>
										</li>
										<li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg ">
											<div className="flex items-center justify-between w-full">
												<span>Tax</span>
												<span>
													{getSymbolFromCurrency(
														data?.data?.currency ??
															"usd"
													)}
													{data?.data?.total_details
														.amount_tax / 100}
												</span>
											</div>
										</li>
										<li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg ">
											<div className="flex items-center justify-between w-full">
												<span>Amount paid</span>
												<span>
													{getSymbolFromCurrency(
														data?.data?.currency ??
															"usd"
													)}
													{data?.data?.amount_total /
														100}
												</span>
											</div>
										</li>
									</ul>
								</div>

								<div className="mt-5 flex justify-end gap-x-2 print:hidden">
									<button
										onClick={printInvoice}
										className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
									>
										<svg
											className="flex-shrink-0 w-4 h-4"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline points="6 9 6 2 18 2 18 9" />
											<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
											<rect
												width="12"
												height="8"
												x="6"
												y="14"
											/>
										</svg>
										Print
									</button>
									<button className="button-secondary">
										<Link href="/dashboard">
											Go to Dashboard
										</Link>
									</button>
								</div>

								<div className="mt-5 sm:mt-10">
									<p className="text-sm text-gray-500">
										If you have any questions, please
										contact us at{" "}
										<a
											className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
											href="#"
										>
											support@bytesuite.io
										</a>
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccessPage;
