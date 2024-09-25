import {
	ChevronRightIcon,
	MegaphoneIcon,
	XMarkIcon,
} from "@heroicons/react/20/solid";
import {
	CheckIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	Cog6ToothIcon,
	DocumentMinusIcon,
	DocumentPlusIcon,
	FunnelIcon,
	PlusIcon,
	UserCircleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";

import { Listbox, Popover, Transition } from "@headlessui/react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { useQuery } from "react-query";
import Input from "@components/BuilderComponents/Inputs/Input";
import DashboardNavbar from "@components/DashboardNavbar";
import GetStartedFormModal from "@components/Modals/GetStartedModal";
import ImportFromTypeformModal from "@components/Modals/ImportFromTypeformModal";
import NewFormModal from "@components/Modals/NewFormModal";
import UsageLimitReachedModal from "@components/Modals/UsageLimitReachedModal";
import WorkspaceEditModal from "@components/Modals/WorkspaceEditModal";
import WorkspaceInvitesModal from "@components/Modals/WorkspaceInvitesModal";
import useUser from "@hooks/useUser";
import { FormItem } from "@api/forms/responses";
import { getAllWorkspaces, getWorkspaceInvites } from "@api/workspace";
import { Workspace } from "@api/workspace/responses";
import { classNames } from "@utils/index";
import ProjectLimitBanner from "@components/ProjectNavLimiter";

const FormItemRow = ({ form }: { form: FormItem }) => {
	

	return (
		<li>
			<div className="group relative flex items-start space-x-3 py-4">
				<div className="min-w-0 flex-1">
					<div className="text-sm flex items-center space-x-2 mb-1 font-medium text-gray-900">
						<Link href={`/dashboard/${form.id}/edit`}>
							<span
								className="absolute inset-0"
								aria-hidden="true"
							/>
							{form.name}
						</Link>
						{form.is_custom && (
							<>
								<span className="inline-flex items-center rounded-full bg-blue-100 px-2  text-[10px] font-medium text-blue-800">
									Custom
								</span>
							</>
						)}
						{form.options?.visibility === "draft" && (
							<>
								<span className="inline-flex items-center rounded-full bg-gray-200 px-2  text-[10px] font-semibold text-gray-800">
									Draft
								</span>
							</>
						)}
						{form.form_type === "quiz" && (
							<>
								<span className="inline-flex items-center rounded-full bg-gray-200 px-2  text-[10px] font-semibold text-gray-800">
									Quiz
								</span>
							</>
						)}
					</div>
					<p className="text-xs text-gray-500">
						Created:{" "}
						{format(
							parseISO(form.created_at),
							"dd MMM yyyy 'at' HH:mm"
						)}
					</p>
				</div>
				<div className="flex-shrink-0 self-center">
					<ChevronRightIcon
						className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
						aria-hidden="true"
					/>
				</div>
			</div>
		</li>
	);
};
const CustomFormsPage = () => {
	const [query, setQuery] = useState("");
	// const { data, isLoading } = useQuery("forms", getAllForms, {});
	const { data: user, isLoading: loadingUser } = useUser();
	const { data: workspaces, isLoading: isLoading } = useQuery(
		"workspaces",
		getAllWorkspaces
	);
	const router = useRouter();

	const isOwnWorkspace = (workspace: Workspace) => {
		if (!workspace || !user?.data) return false;
		return workspace.owner_id === user?.data?.id;
	};
	const isOwnPersonalWorkspace = (workspace: Workspace) => {
		if (!workspace || !user?.data) return false;
		return (
			workspace.name.toLowerCase() === "default" &&
			isOwnWorkspace(workspace)
		);
	};
	const activeWorkspace = useMemo(() => {
		if (
			router.query.workspace &&
			typeof router.query.workspace === "string"
		) {
			// If workspace is selected, get workspaceId from Url, and get that workspace data from list
			const item = workspaces?.data?.workspaces?.find(
				(workspace) =>
					workspace.id === parseInt(router.query.workspace as string)
			);
			return {
				workspace: item,
				forms: workspaces?.data?.forms?.filter(
					(form) => form.workspace_id === item?.id
				),
			};
		} else {
			// If no workspace is selected, get the workspace with 'default' name
			const item = workspaces?.data?.workspaces?.find((workspace) =>
				isOwnPersonalWorkspace(workspace)
			);
			return {
				workspace: item,
				// forms in that workspace
				forms: workspaces?.data?.forms?.filter(
					(form) => form.workspace_id === item?.id
				),
			};
		}
	}, [router.query.workspace, workspaces]);

	// change whenever activeWorkspace changes
	const formsListData = useMemo(
		() => ({
			data: activeWorkspace?.forms,
		}),
		[activeWorkspace]
	);

	function closeModal() {
		// Remove 'action' from query
		const { action, ...query } = router.query;
		router.replace({
			...router,
			query: query,
		});
	}

	const [showLimitReachedModal, setShowLimitReachedModal] = useState(false);
	const closeLimitReachedModal = () => {
		setShowLimitReachedModal(false);
	};

	const { data: invites } = useQuery({
		queryKey: ["workspace", "invites"],
		queryFn: () => getWorkspaceInvites(),
	});

	const [formFilters, setFormFilters] = useState<string[]>([]);

	const filteredData = useMemo(() => {
		if (!formsListData?.data) return [];

		return formsListData.data
			.filter((item) => {
				// Search for name
				if (!query || query.length === 0) return true;
				return item.name.toLowerCase().includes(query.toLowerCase());
			})
			?.filter((item) => {
				if (formFilters.length === 0) return true;
				// Return 'custom' form
				if (formFilters.includes("custom") && item.is_custom) {
					return true;
				}

				// Return 'draft' forms
				if (
					formFilters.includes("drafts") &&
					item.options?.visibility === "draft"
				)
					return true;
				return false;
			})
			?.sort((a, b) => {
				// Sort by created_at datetime
				return (
					parseISO(b.created_at).getTime() -
					parseISO(a.created_at).getTime()
				);
			});
	}, [formsListData, query, formFilters]);

	const closeInvitesModal = () => {
		router.replace({
			query: {
				...router.query,
				action: null,
			},
		});
	};
	const [showCard, setShowCard] = useState(true);
	return (
		<>
			<Head>
				<title>Dashboard - ByteForms</title>
			</Head>
			<main className="w-full overflow-x-hidden h-full min-h-full bg-zinc-100">
				<DashboardNavbar />

				<WorkspaceInvitesModal
					isOpen={router.query.action === "invites"}
					invites={invites?.data ?? []}
					closeModal={closeInvitesModal}
				/>

				<div className="mx-auto container py-12 sm:py-12 lg:py-16 w-full max-w-6xl px-6 flex flex-col h-full min-h-full">
					{invites?.data && invites?.data?.length > 0 && (
						<div className="rounded-lg border border-indigo-300 bg-indigo-50 bg-opacity-5 p-2 shadow-lg mb-4">
							<div className="flex flex-wrap items-center justify-between">
								<div className="flex w-0 flex-1 items-center">
									<span className="flex rounded-lg bg-indigo-800 p-2">
										<MegaphoneIcon
											className="h-4 w-4 text-white"
											aria-hidden="true"
										/>
									</span>
									<p className="ml-3 truncate text-sm text-gray-600">
										<span className="">
											You've been invited to join a
											workspace
										</span>
									</p>
								</div>
								<div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
									<Link
										scroll={false}
										href={{
											query: {
												action: "invites",
											},
										}}
										className="button-secondary"
									>
										View
									</Link>
								</div>
							</div>
						</div>
					)}
					<div className="flex items-center justify-between">
						<Popover className="relative">
							{({ open, close }) => (
								<>
									<div className="flex items-center space-x-2 ">
										<Popover.Button className="outline-none flex items-center space-x-2 ">
											<h2 className="text-lg font-medium text-gray-900">
												{loadingUser &&
												!activeWorkspace.workspace
													? "Your"
													: isOwnPersonalWorkspace(
															activeWorkspace?.workspace!
													  )
													? "Personal"
													: `${activeWorkspace.workspace?.name}`}{" "}
												{activeWorkspace.workspace?.name
													.toLowerCase()
													.includes("workspace")
													? ""
													: "Workspace"}
											</h2>
											{loadingUser ? null : open ? (
												<ChevronUpIcon className="w-4 h-4" />
											) : (
												<ChevronUpDownIcon className="w-4 h-4" />
											)}
										</Popover.Button>
										<Link
											href={{
												pathname: "/dashboard",
												query: {
													edit: true,
													workspace:
														activeWorkspace
															.workspace?.id,
												},
											}}
										>
											<Cog6ToothIcon className="w-4 h-4 text-gray-500" />
										</Link>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="opacity-0 translate-y-1"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in duration-150"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 translate-y-1"
									>
										<Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-sm transform px-4 sm:px-0 ">
											<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5   bg-white py-4">
												<div>
													<p className="px-4 pb-2 text-xs text-gray-500 font-medium">
														Workspaces
													</p>

													{workspaces?.data?.workspaces?.map(
														(workspace) => (
															<Link
																onClick={close}
																key={
																	workspace.id
																}
																href={{
																	pathname:
																		"/dashboard",
																	query: {
																		workspace:
																			workspace.id,
																	},
																}}
																// If same as activeWorkspace, show check icon and color background to gray
																className={classNames(
																	activeWorkspace
																		.workspace
																		?.id ===
																		workspace.id
																		? "bg-gray-100"
																		: "",
																	"flex text-xs items-center justify-between  px-4 py-3 w-full"
																)}
															>
																<p
																	className="flex items-center"
																	// default is shown as personal
																>
																	<span>
																		{isOwnPersonalWorkspace(
																			workspace
																		)
																			? `Personal`
																			: workspace.name}
																	</span>
																	<span>
																		{isOwnPersonalWorkspace(
																			workspace
																		) ? (
																			<UserCircleIcon className="w-4 h-4 text-gray-500 ml-1" />
																		) : (
																			workspace.owner_id !==
																				user
																					?.data
																					?.id && (
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					viewBox="0 0 24 24"
																					fill="none"
																					stroke="currentColor"
																					strokeWidth={
																						2
																					}
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					className="w-3 h-3 text-gray-500 ml-1"
																				>
																					<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
																					<path d="m21 3-9 9" />
																					<path d="M15 3h6v6" />
																				</svg>
																			)
																		)}
																	</span>
																</p>
																{activeWorkspace
																	.workspace
																	?.id ===
																	workspace.id && (
																	<CheckIcon className="w-4 h-4" />
																)}
															</Link>
														)
													)}

													<hr className="mt-2" />
													<Link
														href={{
															pathname:
																"/dashboard",
															query: {
																edit: true,
																workspace:
																	activeWorkspace
																		.workspace
																		?.id,
															},
														}}
														className="flex text-xs items-center justify-between hover:bg-gray-100 px-4 py-3 -mb-2 mt-1 w-full transition"
													>
														<p>Manage workspace</p>
														<Cog6ToothIcon className="w-4 h-4" />
													</Link>
													<Link
														href="/dashboard/workspace/new"
														className="flex text-xs items-center justify-between hover:bg-gray-100 px-4 py-3 -mb-3 w-full transition"
													>
														<p>
															Create a new
															workspace
														</p>
														<PlusIcon className="w-4 h-4" />
													</Link>
												</div>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
						{activeWorkspace?.workspace &&
							isOwnWorkspace(activeWorkspace?.workspace) && (
								<div className="flex">
									<Link
										href={{
											pathname: "/quiz-builder",
											query: {
												...router.query,
												workspace:
													router.query.workspace,
											},
										}}
										// className="text-indigo-700 hover:text-white border border-indigo-700 hover:bg-indigo-800  focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:border-indigo-400 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 dark:focus:ring-indigo-900"
									>
										
										{/* <span aria-hidden="true"></span> */}
									</Link>
									{/* {console.log(router.query)} */}
									<Link 
										href={{
											query: {
												...router.query,
												
												action: "new",
											},
										}}
										shallow
										scroll={false}
										className="button-primary bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
									>
										Create a new Websitte
										{/* {console.log(router.query)}		 */}
										<span aria-hidden="true"> &rarr;</span>
									</Link>
								</div>
							)}
					</div>

					<div className="mt-4 flex space-x-3 items-center">
						<div className="w-full">
							{/* <Input
								placeholder="Search"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/> */}
							<ProjectLimitBanner projectCount={5} />
						</div>
					
					</div>

					

					<ImportFromTypeformModal
						isOpen={router.query.action === "typeform"}
						closeModal={closeModal}
					/>

					<GetStartedFormModal
						isOpen={router.query.action === "new"}
						closeModal={closeModal}
					/>

					<NewFormModal
						closeModal={() =>
							router.replace({
								...router,
								query: {
									...router.query,
									new: null,
								},
							})
						}
						isOpen={router.query.new === "true"}
					/>

					<UsageLimitReachedModal
						isOpen={showLimitReachedModal}
						closeModal={closeLimitReachedModal}
					/>
					{activeWorkspace.workspace?.id && (
						<WorkspaceEditModal
							workspace={activeWorkspace.workspace}
							open={
								router.query.workspace &&
								router.query.edit === "true"
									? true
									: false
							}
							onClose={() => {
								router.replace({
									...router,
									query: {
										...router.query,
										edit: null,
									},
								});
							}}
						/>
					)}


				</div>
				
			</main>


		</>
	);
};

export default CustomFormsPage;
