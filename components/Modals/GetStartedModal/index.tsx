// import { Dialog, Transition } from "@headlessui/react";
// import {
// 	ArrowDownTrayIcon,
// 	DocumentMagnifyingGlassIcon,
// 	PlusIcon,
// 	SparklesIcon,
// } from "@heroicons/react/24/solid";
// import Link from "next/link";
// import { Fragment, useMemo } from "react";
// import { Toaster } from "react-hot-toast";
// import { useQuery } from "react-query";
// import useUser from "@hooks/useUser";
// import { getPlanLimits } from "@api/subscriptions";
// import useAllPlans from "@hooks/useAllPlans";
// import {
// 	classNames,
// 	objectToUrlParams,
// 	planLimitsToNumber,
// } from "@utils/index";
// import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/router";
// type GetStartedFormModalProps = {
// 	isOpen: boolean;
// 	closeModal: () => void;
// };
// export default function GetStartedFormModal({
// 	isOpen,
// 	closeModal,
// }: GetStartedFormModalProps) {
// 	const { data, isLoading: isLoadingUser } = useUser({
// 		redirect: false,
// 	});

// 	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
// 		"plan_limits",
// 		getPlanLimits
// 	);

// 	const {
// 		data: allPlans,
// 		features: sections,
// 		getSubFeaturesForPlan,
// 	} = useAllPlans();

// 	const nextPlan = useMemo(() => {
// 		const plansSortedByPrice = allPlans?.data?.sort(
// 			(a, b) => a.pricing - b.pricing
// 		);

// 		const currPlanIndex = plansSortedByPrice?.findIndex(
// 			(plan) =>
// 				plan.stripe_price_id ===
// 				planLimits?.data?.subscription.stripe_price_id
// 		);

// 		const nextIndex =
// 			typeof currPlanIndex === "number"
// 				? currPlanIndex === plansSortedByPrice?.length
// 					? plansSortedByPrice?.length - 1
// 					: currPlanIndex + 1
// 				: -1;

// 		return plansSortedByPrice?.at(nextIndex);
// 	}, [allPlans, planLimits]);

// 	const router = useRouter();

// 	const canCreateMoreForms = true;
// 	// const canCreateMoreForms = useMemo(() => {
// 	// 	if (data?.data?.email) {
// 	// 		if (planLimits?.data) {
// 	// 			return (
// 	// 				planLimits?.data?.limits?.max_forms?.value <
// 	// 				planLimits?.data?.limits?.max_forms?.limit
// 	// 			);
// 	// 		}
// 	// 		return false;
// 	// 	} else {
// 	// 		return true;
// 	// 	}
// 	// }, [data, planLimits]);

// 	return (
// 		<>
// 			<Toaster />
// 			<Transition appear show={isOpen} as={Fragment}>
// 				<Dialog as="div" className="relative z-10" onClose={closeModal}>
// 					<Transition.Child
// 						as={Fragment}
// 						enter="ease-out duration-300"
// 						enterFrom="opacity-0"
// 						enterTo="opacity-100"
// 						leave="ease-in duration-200"
// 						leaveFrom="opacity-100"
// 						leaveTo="opacity-0"
// 					>
// 						<div className="fixed inset-0 bg-black bg-opacity-25" />
// 					</Transition.Child>

// 					<div className="fixed inset-0 overflow-y-auto py-10">
// 						<div className="flex min-h-full items-center justify-center p-4">
// 							<Transition.Child
// 								as={Fragment}
// 								enter="ease-out duration-300"
// 								enterFrom="opacity-0 scale-95"
// 								enterTo="opacity-100 scale-100"
// 								leave="ease-in duration-200"
// 								leaveFrom="opacity-100 scale-100"
// 								leaveTo="opacity-0 scale-95"
// 							>
// 								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-white shadow-xl transition-all">
// 									{router.query.upgrade === "true" ? (
// 										<div className=" grid grid-cols-7 p-0">
// 											<div className="col-span-4 p-8">
// 												<Dialog.Title
// 													as="h3"
// 													className="text-xl font-medium leading-6 text-gray-900 "
// 												>
// 													Upgrade to{" "}
// 													{nextPlan?.plan
// 														? `${nextPlan?.plan} to `
// 														: " "}
// 													keep using ByteForms
// 												</Dialog.Title>
// 												{planLimitsToNumber(
// 													planLimits?.data?.limits
// 														?.number_of_responses
// 														?.limit
// 												) && (
// 													<p className=" mt-3 text-sm text-gray-500">
// 														You are on our free
// 														plan. You can receive
// 														upto{" "}
// 														{planLimits?.data
// 															?.limits
// 															?.number_of_responses
// 															?.limit ?? 0}{" "}
// 														responses.
// 													</p>
// 												)}
// 												<div className="mt-4 flex items-center space-x-3">
// 													<Link
// 														className="button-primary"
// 														href={
// 															"/profile/pricing?plan=" +
// 															nextPlan?.stripe_price_id
// 														}
// 													>
// 														Upgrade Plan
// 													</Link>
// 													<Link
// 														className="button-outlined"
// 														href={{
// 															...router,
// 															query: {
// 																...router.query,
// 																upgrade: false,
// 															},
// 														}}
// 													>
// 														Go back
// 													</Link>
// 												</div>
// 											</div>
// 											<div className="col-span-3 bg-gray-100 w-full h-full p-8">
// 												<p className="text-sm font-medium">
// 													Included with the{" "}
// 													{nextPlan?.plan} plan
// 												</p>
// 												<div className="mt-3 flex flex-col space-y-2 ">
// 													{nextPlan?.stripe_price_id &&
// 														sections
// 															?.map((e) =>
// 																e.features?.flat()
// 															)
// 															?.filter(
// 																(features) => {
// 																	const item =
// 																		features?.find(
// 																			(
// 																				f
// 																			) =>
// 																				f
// 																					.tiers[
// 																					nextPlan
// 																						?.stripe_price_id
// 																				]
// 																		);

// 																	return (
// 																		typeof item !==
// 																		"undefined"
// 																	);
// 																}
// 															)
// 															?.map((item) => {
// 																return item.filter(
// 																	(e) =>
// 																		typeof e
// 																			.tiers[
// 																			nextPlan
// 																				?.stripe_price_id
// 																		] !==
// 																		"boolean"
// 																);
// 															})
// 															?.flat()
// 															?.slice(0, 5)
// 															.map(
// 																(
// 																	feature,
// 																	subIndex
// 																) => (
// 																	<div
// 																		key={`${feature.name}_${subIndex}`}
// 																		className="grid grid-cols-5"
// 																	>
// 																		{typeof feature
// 																			.tiers[
// 																			nextPlan
// 																				?.stripe_price_id
// 																		] ===
// 																		"boolean" ? (
// 																			<CheckIcon
// 																				className="h-5 w-5 flex-shrink-0 text-green-500"
// 																				aria-hidden="true"
// 																			/>
// 																		) : (
// 																			<p className="text-sm">
// 																				{
// 																					feature
// 																						.tiers[
// 																						nextPlan
// 																							?.stripe_price_id
// 																					]
// 																				}
// 																			</p>
// 																		)}
// 																		<span className="text-sm text-gray-500 col-span-4">
// 																			{
// 																				feature.name
// 																			}
// 																		</span>
// 																	</div>
// 																)
// 															)}
// 												</div>

// 												<p className="text-sm font-medium mt-8 ">
// 													Other features
// 												</p>
// 												<div className="flex mt-4 flex-wrap gap-x-2 gap-y-2">
// 													{nextPlan?.stripe_price_id &&
// 														sections
// 															?.map((e) =>
// 																e.features?.flat()
// 															)
// 															?.filter(
// 																(features) => {
// 																	const item =
// 																		features?.find(
// 																			(
// 																				f
// 																			) =>
// 																				f
// 																					.tiers[
// 																					nextPlan
// 																						?.stripe_price_id
// 																				]
// 																		);

// 																	return (
// 																		typeof item !==
// 																		"undefined"
// 																	);
// 																}
// 															)
// 															?.map((item) => {
// 																return item.filter(
// 																	(e) =>
// 																		e.tiers[
// 																			nextPlan
// 																				?.stripe_price_id
// 																		] ===
// 																		true
// 																);
// 															})
// 															?.flat()
// 															?.slice(0, 5)
// 															?.map((feat) => (
// 																<div
// 																	key={
// 																		feat.key
// 																	}
// 																	className="bg-[#dfdfdf] px-2 py-1 rounded-md"
// 																>
// 																	<p className="text-[11px]">
// 																		{
// 																			feat.name
// 																		}
// 																	</p>
// 																</div>
// 															))}
// 												</div>
// 											</div>
// 										</div>
// 									) : (
// 										<div className="p-6 align-middle">
// 											<Dialog.Title
// 												as="h3"
// 												className="text-lg font-medium leading-6 text-gray-900 text-left"
// 											>
// 												How do you want to start?
// 											</Dialog.Title>
// 											<Link
// 												href={
// 													data?.data?.email
// 														? {
// 																pathname: "/ai",
// 																query: {
// 																	workspace:
// 																		router
// 																			.query
// 																			.workspace,
// 																},
// 														  }
// 														: "/login?next=/ai"
// 												}
// 												className={classNames(
// 													"border border-dashed border-gray-300 col-span-2 rounded-md px-6 py-6 flex flex-row items-center mt-4"
// 												)}
// 											>
// 												<div className="bg-cyan-100 flex p-2 md:p-4 rounded-md self-center ">
// 													<SparklesIcon className="w-4 h-4 md:w-6 md:h-6" />
// 													{/* <ArrowDownTrayIcon /> */}
// 												</div>
// 												<div className="flex flex-col ms-6 ">
// 													<p className="font-medium md:text-lg ">
// 														Generate using AI
// 													</p>
// 													<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 ">
// 														Use AI to create forms
// 													</p>
// 												</div>
// 											</Link>

// 											{!isLoadingLimits &&
// 												!isLoadingUser &&
// 												!canCreateMoreForms && (
// 													<div className="flex items-center justify-between border-b p-4 border-dashed mt-4">
// 														<p className="font-medium">
// 															Upgrade to{" "}
// 															{nextPlan?.plan} to
// 															create more forms
// 														</p>
// 														<Link
// 															className="button-primary mt-2"
// 															href={
// 																"/profile/pricing?plan=" +
// 																nextPlan?.stripe_price_id
// 															}
// 														>
// 															Upgrade Plan
// 														</Link>
// 													</div>
// 												)}
// 											<div className="mt-4 grid md:grid-cols-2 gap-5">
// 												<Link
// 													href={
// 														!canCreateMoreForms
// 															? {
// 																	query: {
// 																		...router.query,
// 																		upgrade:
// 																			true,
// 																	},
// 															  }
// 															: data?.data?.email
// 															? {
// 																	pathname:
// 																		"/builder",
// 																	query: {
// 																		workspace:
// 																			router
// 																				.query
// 																				.workspace,
// 																		new: true,
// 																		// "/builder?new=true"
// 																	},
// 															  }
// 															: "/login?next=/builder?new=true" +
// 															  (router.query
// 																	.workspace
// 																	? `&workspace=${router.query.workspace}`
// 																	: "")
// 													}
// 													className="bg-gray-50 rounded-md px-6 py-6 flex flex-col items-center"
// 												>
// 													<div className="bg-red-100 flex p-2 md:p-4 rounded-md self-center mb-2 md:mb-4">
// 														<PlusIcon className="w-4 h-4 md:w-6 md:h-6" />
// 													</div>
// 													<p className="font-medium md:text-lg text-center">
// 														Build a new form
// 													</p>
// 													<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 text-center">
// 														Use our form builder to
// 														create your form
// 													</p>
// 												</Link>

// 												<Link
// 													href={
// 														!canCreateMoreForms
// 															? {
// 																	query: {
// 																		...router.query,
// 																		upgrade:
// 																			true,
// 																	},
// 															  }
// 															: data?.data?.email
// 															? {
// 																	query: {
// 																		...router.query,
// 																		action: undefined,
// 																		new: true,
// 																	},
// 															  }
// 															: {
// 																	pathname:
// 																		"/login",
// 																	query: {
// 																		next: objectToUrlParams(
// 																			{
// 																				...router.query,
// 																				new: true,
// 																			}
// 																		),
// 																	},
// 															  }
// 													}
// 													className="bg-gray-50 rounded-md px-6 py-6 flex flex-col items-center"
// 												>
// 													<div className="bg-indigo-100 flex p-2 md:p-4 rounded-md self-center mb-2 md:mb-4">
// 														<ArrowDownTrayIcon className="w-4 h-4 md:w-6 md:h-6" />
// 													</div>
// 													<p className="font-medium md:text-lg text-center">
// 														Bring your own HTML Form
// 													</p>
// 													<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 text-center">
// 														Get responses from your
// 														pre-existing form, on
// 														your website
// 													</p>
// 												</Link>

// 												<Link
// 													href={
// 														!canCreateMoreForms
// 															? {
// 																	query: {
// 																		...router.query,
// 																		upgrade:
// 																			true,
// 																	},
// 															  }
// 															: data?.data?.email
// 															? {
// 																	pathname:
// 																		"/templates",
// 																	query: router.query,
// 															  }
// 															: "/login?next=/templates"
// 													}
// 													className="bg-gray-50 rounded-md px-6 py-6 flex flex-col items-center"
// 												>
// 													<div className="bg-purple-100 flex p-2 md:p-4 rounded-md self-center mb-2 md:mb-4">
// 														<DocumentMagnifyingGlassIcon className="w-4 h-4 md:w-6 md:h-6" />
// 													</div>
// 													<p className="font-medium md:text-lg text-center">
// 														Choose from a template
// 													</p>
// 													<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 text-center">
// 														Browse from our list of
// 														form templates to get
// 														started
// 													</p>
// 												</Link>
// 												<Link
// 													href={
// 														!canCreateMoreForms
// 															? {
// 																	query: {
// 																		...router.query,
// 																		upgrade:
// 																			true,
// 																	},
// 															  }
// 															: data?.data?.email
// 															? {
// 																	query: {
// 																		...router.query,
// 																		action: "typeform",
// 																	},
// 															  }
// 															: {
// 																	pathname:
// 																		"/login",
// 																	query: {
// 																		next: objectToUrlParams(
// 																			{
// 																				...router.query,
// 																				action: "typeform",
// 																			}
// 																		),
// 																	},
// 															  }
// 													}
// 													className="bg-gray-50 rounded-md px-6 py-6 flex flex-col items-center"
// 												>
// 													<div className="bg-indigo-100 flex p-2 md:p-4 rounded-md self-center mb-2 md:mb-4">
// 														<svg
// 															xmlns="http://www.w3.org/2000/svg"
// 															width="33"
// 															className="w-4 h-4 md:w-6 md:h-6"
// 															height="22"
// 															fill="none"
// 														>
// 															<path
// 																fill="#1A1A19"
// 																fill-rule="evenodd"
// 																d="M0 5.34C0 1.82 1.39 0 3.72 0c2.34 0 3.73 1.82 3.73 5.34V16c0 3.52-1.4 5.34-3.73 5.34S0 19.52 0 16V5.34ZM25.08 0h-7.7c-6.9 0-7.44 2.98-7.44 6.96l-.01 7.42c0 4.14.52 6.96 7.48 6.96h7.67c6.92 0 7.43-2.97 7.43-6.94V6.97c0-3.99-.53-6.97-7.43-6.97Z"
// 																clip-rule="evenodd"
// 															></path>
// 														</svg>
// 														{/* <ArrowDownTrayIcon /> */}
// 													</div>
// 													<p className="font-medium md:text-lg text-center">
// 														Import from Typeform
// 													</p>
// 													<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 text-center">
// 														Migrate forms from
// 														TypeForm into ByteForms
// 													</p>
// 												</Link>
// 											</div>
// 										</div>
// 									)}
// 								</Dialog.Panel>
// 							</Transition.Child>
// 						</div>
// 					</div>
// 				</Dialog>
// 			</Transition>
// 		</>
// 	);
// }

// import React, { useState, useEffect } from 'react';
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";

// interface CompanyInfoModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
// }

// export default function CompanyInfoModal({ isOpen, closeModal }: CompanyInfoModalProps) {
//   const [companyName, setCompanyName] = useState('');
//   const [companyDescription, setCompanyDescription] = useState('');
//   const [showCard, setShowCard] = useState(false);

//   useEffect(() => {
//     const storedInfo = localStorage.getItem('companyInfo');
//     if (storedInfo) {
//       const { name, description } = JSON.parse(storedInfo);
//       setCompanyName(name);
//       setCompanyDescription(description);
//       setShowCard(true);
//     }
//   }, []);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const companyInfo = { name: companyName, description: companyDescription };
// 	console.log(companyInfo);
//     localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
//     setShowCard(true);
//     closeModal();
//   };

//   return (
//     <>
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900"
//                   >
//                     Company Information
//                   </Dialog.Title>
//                   <form onSubmit={handleSubmit} className="mt-4">
//                     <div className="mb-4">
//                       <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
//                       <input
//                         type="text"
//                         id="companyName"
//                         value={companyName}
//                         onChange={(e) => setCompanyName(e.target.value)}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                         required
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">Company Description</label>
//                       <textarea
//                         id="companyDescription"
//                         value={companyDescription}
//                         onChange={(e) => setCompanyDescription(e.target.value)}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                         rows={3}
//                         required
//                       ></textarea>
//                     </div>
//                     <div className="mt-4">
//                       <button
//                         type="submit"
//                         className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                       >
//                         Save Company Info
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

// 	  {showCard && (
//   <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//     <a href="#">
//       <img className="p-8 rounded-t-lg" src="/docs/images/products/apple-watch.png" alt="product image" />
//     </a>
//     <div className="px-5 pb-5">
//       <a href="#">
//         <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//           {companyName}
//         </h5>
//       </a>
//       <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//         {companyDescription}
//       </p>
//       <div className="flex items-center mt-2.5 mb-5">
//         <div className="flex items-center space-x-1 rtl:space-x-reverse">
//           {/* Star icons */}
//           <svg
//             className="w-4 h-4 text-gray-200 dark:text-gray-600"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="currentColor"
//             viewBox="0 0 22 20"
//           >
//             <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//           </svg>
//         </div>
//         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">5.0</span>
//       </div>
//       <div className="flex items-center justify-between">
//         <span className="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
//         <a
//           href="#"
//           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//         >
//           Add to cart
//         </a>
//       </div>
//     </div>
//   </div>
// )}

//     </>
//   );
// }


'use client';
import React, { useState, useEffect, Fragment, ReactNode } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon, CogIcon } from '@heroicons/react/24/solid';

interface CompanyInfo {
  isLive: true;
  visitorCount: ReactNode;
  name: string;
  description: string;
  website: string; // Add the website property
}

interface CompanyInfoModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function CompanyInfoModal({ isOpen, closeModal }: CompanyInfoModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyInfoList, setCompanyInfoList] = useState<CompanyInfo[]>([]);
  const [isLive, setIsLive] = useState(false); // State to manage live status

//when new company is added firstly his setislive should be false and then after 1 seconds it should be true for every new company
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsLive(true);
//     }, 1000);
// 	setIsLive(false);
//     return () => clearInterval(interval);
//   }, []);


  
//   //make a setinterval of 2 seconds to change the status of the company

//   useEffect(() => {
// 	const interval = setInterval(() => {
// 	//   setIsLive((prevStatus) => !prevStatus);
// 	setIsLive(true);
// 	}, 1000);

// 	return () => clearInterval(interval);
//   }, []);














  // Check localStorage for saved company info on modal open
  useEffect(() => {
    const storedInfo = localStorage.getItem('companyInfoList');
    if (storedInfo) {
      setCompanyInfoList(JSON.parse(storedInfo));
    }
  }, [isOpen]); // Trigger this effect when modal is opened

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCompanyInfo = { name: companyName, description: companyDescription };

    // Save new company info in the list
    const updatedList = [newCompanyInfo, ...companyInfoList];
    setCompanyInfoList(updatedList);

    // Save to localStorage
    localStorage.setItem('companyInfoList', JSON.stringify(updatedList));

    // Clear input fields
    setCompanyName('');
    setCompanyDescription('');

    closeModal(); // Close the modal after submission
  };

  const handleLivestatus = () => {
	setIsLive(true);
  }

  const handleDelete = (index: number) => {
    const updatedList = companyInfoList.filter((_, i) => i !== index);
    setCompanyInfoList(updatedList);

    // Update localStorage after deletion
    localStorage.setItem('companyInfoList', JSON.stringify(updatedList));
  };

  return (
    <>
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
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-800 mb-4"
                  >
                    Company Information
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-600">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-600">
                        Company Description
                      </label>
                      <textarea
                        id="companyDescription"
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        rows={4}
                        placeholder="Enter company description"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Display the cards in a grid layout */}
	  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {companyInfoList.map((info, index) => (
    <div key={index} className="max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out">
      {/* Image section with Live badge */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={"https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80"} // Replace with dynamic image URL
          alt={info.name}
        />
        <div className="absolute top-2 left-2 bg-black px-3 py-1 rounded-full flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className="text-white text-sm font-semibold">
            {isLive ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Company Name */}
        <h3 className="text-lg font-bold text-black mb-2">
          {info.name}
        </h3>

        {/* Website */}
        <p className="text-gray-700 mb-2">
          <a href={info.website} className="text-blue-500 hover:underline">
          Byteforms.com

          </a>
        </p>

        {/* Visitor Count */}
        <p className="text-gray-500 text-sm">
          {info.visitorCount} 200K Visitors
        </p>
		<button onClick={handleLivestatus} className="text-sm text-black-500">Change Status</button>
	
      </div>
    </div>
  ))}
</div>

    </>
  );
}
