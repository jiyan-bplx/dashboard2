import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Input from "../../BuilderComponents/Inputs/Input";
import Loading from "@components/Loading";
import validator from "validator";
import {
	CreateWorkspaceResponse,
	Workspace,
	WorkspaceInvitedMember,
} from "@api/workspace/responses";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames } from "@utils/index";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import {
	getWorkspaceById,
	getWorkspaceInvitedMembersList,
	getWorkspaceMembersList,
	inviteUsersToWorkspace,
	removeInvitedUserFromWorkspace,
	removeUserFromWorkspace,
	updateWorkspace,
} from "@api/workspace";
import { AxiosError } from "axios";
import { MegaphoneIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useQuery, useQueryClient } from "react-query";
import useUser from "@hooks/useUser";
import { User } from "../../../lib/api/auth/responses";

const WorkspaceEditModal = ({
	open,
	onClose,
	workspace,
}: {
	workspace: Workspace | undefined;
	open: boolean;
	onClose: () => void;
}) => {
	const router = useRouter();
	const { data, isLoading } = useQuery({
		queryKey: ["workspaces", workspace?.id],
		queryFn: () => getWorkspaceById(workspace?.id!),
		initialData: {
			status: "success",
			data: {
				forms: [],
				workspace: workspace!,
			},
		},
	});

	const { data: invites } = useQuery({
		queryKey: ["workspace", "invites", workspace?.id],
		queryFn: () => getWorkspaceInvitedMembersList(workspace?.id!),
	});

	const { data: members } = useQuery({
		queryKey: ["workspace", "members", workspace?.id],
		queryFn: () => getWorkspaceMembersList(workspace?.id!),
	});

	const workspaceMembers = useMemo(() => {
		if (members?.data?.members) {
			return members.data.members;
		} else {
			return [...(workspace?.users ?? []), workspace?.owner] as User[];
		}
	}, [workspace, members]);

	const { data: currentUser } = useUser();
	const [workspaceName, setWorkspaceName] = useState(() => workspace?.name);
	const [description, setDescription] = useState(
		() => workspace?.description
	);

	const client = useQueryClient();

	const isOwnWorkspace = useMemo(
		() => workspace?.owner_id === currentUser?.data?.id,
		[workspace, currentUser]
	);

	const isDefaultWorkspace = useMemo(
		() =>
			workspace?.name.toLowerCase() === "default" &&
			workspace.owner_id === currentUser?.data?.id,
		[workspace, currentUser]
	);
	const [activeTab, setActiveTab] = useState<"DETAILS" | "MEMBERS">(
		"DETAILS"
	);
	useEffect(() => {
		if (workspace) {
			setWorkspaceName(workspace.name);
			setDescription(workspace.description);
		}

		if (
			workspace?.name.toLowerCase() === "default" &&
			workspace.owner_id === currentUser?.data?.id
		) {
			setActiveTab("MEMBERS");
		} else {
			setActiveTab("DETAILS");
		}
	}, [workspace, currentUser]);

	const [isUpdating, setIsUpdating] = useState(false);

	const onSubmit = async () => {
		try {
			setIsUpdating(true);
			const workspaceId = parseInt(router.query.workspace as string);
			const res = await updateWorkspace(workspaceId, {
				name: workspaceName!,
				description,
			});

			if (res.status === "success") {
				toast.success("Workspace updated successfully");
				client.refetchQueries("workspaces");
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[updateWorkspace] Response", res);
			}
			setIsUpdating(false);
		} catch (err) {
			console.error("[updateWorkspace]", err);
			const e = err as AxiosError<CreateWorkspaceResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsUpdating(false);
		}
	};

	const [membersList, setMembersList] = useState<
		{ email: string; permission: string }[]
	>([]);

	const [email, setEmail] = useState("");
	const [permission, setPermission] = useState<"View" | "Edit">("View");
	const deleteEmail = (emailToDelete: string) => {
		setMembersList((prev) => prev.filter((m) => m.email !== emailToDelete));
	};

	const deleteInvitedUser = async (invite: WorkspaceInvitedMember) => {
		try {
			setIsUpdating(true);
			const workspaceId = parseInt(router.query.workspace as string);
			const res = await removeInvitedUserFromWorkspace(
				workspaceId,
				invite.id
			);

			if (res.status === "success") {
				toast.success("Invite revoked successfully");
				client.refetchQueries(["workspace", "invites", workspace?.id]);
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[deleteInvitedUser] Response", res);
			}
			setIsUpdating(false);
		} catch (err) {
			console.error("[deleteInvitedUser]", err);
			const e = err as AxiosError<CreateWorkspaceResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsUpdating(false);
		}
	};

	const deleteUserFromWorkspace = async (
		user: Workspace["users"][number]
	) => {
		try {
			setIsUpdating(true);
			const workspaceId = parseInt(router.query.workspace as string);
			const res = await removeUserFromWorkspace(workspaceId, {
				user_id: user.id,
			});

			if (res.status === "success") {
				toast.success("User removed successfully");
				client.refetchQueries(["workspaces", workspace?.id]);
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[removeUserFromWorkspace] Response", res);
			}
			setIsUpdating(false);
		} catch (err) {
			console.error("[removeUserFromWorkspace]", err);
			const e = err as AxiosError<CreateWorkspaceResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsUpdating(false);
		}
	};

	const checkIfValidEmail = (emailString: string) => {
		if (!emailString) {
			toast.error("Please enter an email address");
			return;
		}

		if (
			!validator.isEmail(emailString) ||
			!emailString.includes("@") ||
			!emailString.includes(".")
		) {
			toast.error("Please enter a valid email address");
			return false;
		}

		const isAlreadyAdded = membersList.some(
			(item) => item.email === emailString
		);
		const isAlreadyAMember = workspaceMembers?.some(
			(member) => member.email === emailString
		);
		if (isAlreadyAdded || isAlreadyAMember) {
			toast.error(`'${emailString}' is already added.`);
			return false;
		}

		const isAlreadyInvited = invites?.data?.some(
			(invite) => invite.email.toLowerCase() === emailString.toLowerCase()
		);

		if (isAlreadyInvited) {
			toast.error(`'${emailString}' is already invited.`);
			return false;
		}

		return true;
	};
	const onAddMember = () => {
		const validEmail = checkIfValidEmail(email);
		if (!validEmail) return;

		setMembersList([
			...membersList,
			{
				email,
				permission,
			},
		]);
		setEmail("");
		// setPermission("View");
	};
	const addMembersToWorkspace = async () => {
		try {
			const members = membersList.map((item) => item.email);

			if (members.length === 0) {
				const validEmail = checkIfValidEmail(email);
				if (!validEmail) return;
				members.push(email);
			}

			setIsUpdating(true);

			const workspaceId = parseInt(router.query.workspace as string);
			const res = await inviteUsersToWorkspace(workspaceId, {
				emails: members,
			});

			if (res.status === "success") {
				toast.success("Members invited successfully");
				setMembersList([]);
				client.refetchQueries(["workspace", "invites", workspace?.id]);
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onAddMembersToWorkspace] Response", res);
			}
			setIsUpdating(false);
		} catch (err) {
			console.error("[onAddMembersToWorkspace]", err);
			const e = err as AxiosError<CreateWorkspaceResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsUpdating(false);
		}
	};

	return (
		<>
			<Toaster />
			<DeleteWorkspaceModal
				open={
					router.query.delete === "true" ||
					router.query.leave === "true"
				}
				workspaceId={workspace?.id!}
				onClose={() => {
					router.replace({
						query: {
							...router.query,
							delete: null,
							leave: null,
						},
					});
				}}
			/>
			<Transition appear show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={onClose}>
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
								<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Edit workspace
									</Dialog.Title>
									<p className="text-sm text-gray-500">
										{isDefaultWorkspace
											? "Personal"
											: workspace?.name}
									</p>

									{!isOwnWorkspace && (
										<div className="mt-4 rounded-lg bg-red-50 p-2 px-4">
											<p className="truncate text-gray-800 text-sm">
												You are not the owner of this
												workspace. You can only view the
												details.
											</p>
										</div>
									)}

									<div className="-mt-1 border-b border-gray-200">
										<nav
											className="-mb-px flex space-x-4"
											aria-label="Tabs"
										>
											{["DETAILS", "MEMBERS"].map(
												(tab) => (
													<button
														onClick={() =>
															setActiveTab(
																tab as any
															)
														}
														key={tab}
														className={classNames(
															activeTab.toLowerCase() ===
																tab.toLowerCase()
																? "border-indigo-500 text-indigo-600"
																: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
															"whitespace-nowrap pt-4 pb-2 px- border-b-2 font-medium text-sm capitalize"
														)}
														aria-current={
															activeTab.toLowerCase() ===
															tab.toLowerCase()
																? "page"
																: undefined
														}
													>
														{tab.toLocaleLowerCase()}
													</button>
												)
											)}
										</nav>
									</div>

									{activeTab === "DETAILS" && (
										<form
											onSubmit={(e) => {
												e.preventDefault();
											}}
										>
											{isDefaultWorkspace && (
												<div className="mt-4 rounded-lg bg-red-50 p-2 px-4">
													<p className="text-gray-800 text-sm">
														You cannot change the
														name of the default
														workspace or delete it
														as its your personal
														workspace.
													</p>
												</div>
											)}

											<div className="mt-4">
												<Input
													disabled={
														isDefaultWorkspace ||
														!isOwnWorkspace
													}
													readOnly={
														isDefaultWorkspace ||
														!isOwnWorkspace
													}
													value={workspaceName}
													onChange={(e) =>
														setWorkspaceName(
															e.target.value
														)
													}
													type="text"
													name="workspace-name"
													id="workspace-name"
													autoFocus
													placeholder="My awesome workspace"
													label="Workspace Name"
												/>
												<p className="text-xs text-gray-500 mt-2">
													You can use your
													organization or company
													name. Keep it simple.
												</p>
											</div>
											<div className="mt-2">
												<Input
													disabled={
														isDefaultWorkspace ||
														!isOwnWorkspace
													}
													readOnly={
														isDefaultWorkspace ||
														!isOwnWorkspace
													}
													type="textarea"
													value={description}
													onChange={(e) =>
														setDescription(
															e.target.value
														)
													}
													name="workspace-desc"
													id="workspace-desc"
													placeholder="My awesome workspace"
													label="Workspace Description"
												/>
											</div>

											<button
												type="submit"
												className="mt-4 justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center space-x-2"
												disabled={
													isDefaultWorkspace ||
													!isOwnWorkspace
												}
												onClick={onSubmit}
											>
												{isUpdating ? (
													<Loading
														size={16}
														color="black"
													/>
												) : null}
												<span>Save</span>
											</button>
											{workspace &&
												currentUser?.data?.id && (
													<div className="mt-2">
														<hr className="mt-4 mb-2" />
														<p className="font-medium mb-2">
															Danger Zone
														</p>
														<Link
															href={{
																query:
																	workspace!
																		.owner_id! ===
																	currentUser.data!
																		.id!
																		? {
																				...router.query,
																				delete: isDefaultWorkspace
																					? null
																					: true,
																		  }
																		: {
																				...router.query,
																				leave: isDefaultWorkspace
																					? null
																					: true,
																		  },
															}}
														>
															<button
																className="button-danger"
																disabled={
																	isDefaultWorkspace
																}
															>
																{workspace?.owner_id ===
																currentUser
																	?.data?.id
																	? "Delete"
																	: "Leave"}{" "}
																workspace
															</button>
														</Link>
														<p className="text-xs text-gray-500 mt-2">
															{workspace?.owner_id ===
															currentUser?.data
																?.id
																? `Delete this
															workspace with all
															of its forms and
															their responses.`
																: `Leave this
																	workspace and remove all forms and responses from your account.`}
														</p>
													</div>
												)}
											<div className="mt-4 flex ">
												<button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
													onClick={onClose}
												>
													Close
												</button>
											</div>
										</form>
									)}
									{activeTab === "MEMBERS" && (
										<div>
											{((workspaceMembers &&
												workspaceMembers.length > 0) ||
												(invites?.data &&
													invites?.data?.length >
														0)) && (
												<>
													<p className="text-xs font-medium text-gray-500 mt-2 mb-1">
														Members
													</p>
													<div className="flex flex-col border-b pb-2 space-y-2">
														{invites?.data?.map(
															(invite) => (
																<div
																	className="flex items-center justify-between"
																	key={`invite-${invite.id}`}
																>
																	<div>
																		<p className="text-sm">
																			{
																				invite.email
																			}
																		</p>
																		<p className="text-xs text-gray-400">
																			Invited
																		</p>
																	</div>
																	<button
																		onClick={() =>
																			deleteInvitedUser(
																				invite
																			)
																		}
																		type="button"
																		className="button-outlined"
																		title="Remove user from workspace"
																	>
																		<TrashIcon className="w-4 h-4 text-red-500" />
																	</button>
																</div>
															)
														)}
														{workspaceMembers?.map(
															(user) => (
																<div
																	className="flex items-center justify-between"
																	key={
																		user.email +
																		user.name
																	}
																>
																	<div>
																		<p className="text-sm flex items-center">
																			<span>
																				{
																					user.name
																				}
																			</span>
																			{user.id ===
																				workspace?.owner_id && (
																				<span className="inline-flex items-center rounded-full bg-gray-200 px-2 ml-1  text-[10px] font-semibold text-gray-800">
																					Owner
																				</span>
																			)}
																		</p>
																		<p className="text-xs text-gray-400">
																			{
																				user.email
																			}
																		</p>
																	</div>
																	{isOwnWorkspace &&
																		user.email !==
																			currentUser
																				?.data
																				?.email && (
																			<button
																				onClick={() =>
																					deleteUserFromWorkspace(
																						user
																					)
																				}
																				type="button"
																				className="button-outlined"
																				title="Remove user from workspace"
																			>
																				<TrashIcon className="w-4 h-4 text-red-500" />
																			</button>
																		)}
																</div>
															)
														)}
													</div>
												</>
											)}

											{isOwnWorkspace && (
												<>
													<p className="text-xs font-medium text-gray-500 mt-2">
														Add Members to your
														workspace
													</p>

													{membersList.length > 0 &&
														membersList.map(
															(member) => (
																<div
																	key={
																		member.email
																	}
																	className="flex items-center space-x-2"
																>
																	<div className="w-full">
																		<Input
																			placeholder="Email address"
																			value={
																				member.email
																			}
																			onChange={(
																				e
																			) => {
																				const newMembersList =
																					membersList.map(
																						(
																							m
																						) => {
																							if (
																								m.email ===
																								member.email
																							) {
																								return {
																									email: e
																										.target
																										.value,
																									permission,
																								};
																							}
																							return m;
																						}
																					);
																				setMembersList(
																					newMembersList
																				);
																			}}
																		/>
																	</div>
																	{/* <div className="mt-1 w-[100px]">
                                                    <Select
                                                        options={["View", "Edit"]}
                                                        value={member.permission}
                                                        onChange={(e) =>
                                                            setPermissionForEmail(
                                                                member.email,
                                                                e.target.value as any
                                                            )
                                                        }
                                                    />
                                                </div> */}
																	<button
																		type="button"
																		className="mt-2 button-danger"
																		onClick={() =>
																			deleteEmail(
																				member.email
																			)
																		}
																	>
																		<TrashIcon className="w-4 h-4 text-red-500" />
																	</button>
																</div>
															)
														)}

													<div
														className={classNames(
															membersList.length ===
																0
																? ""
																: "mt-2",
															" flex items-center space-x-1"
														)}
													>
														<div className="max-w-sm w-full">
															<Input
																placeholder="Email address"
																value={email}
																onChange={(
																	e
																) => {
																	setEmail(
																		e.target
																			.value
																	);
																}}
																onKeyPress={(
																	e
																) => {
																	if (
																		e.key ===
																		"Enter"
																	) {
																		onAddMember();
																	}
																}}
															/>
														</div>
														{/* <div className="mt-1">
                                                <Select
                                                    options={["View", "Edit"]}
                                                    value={permission}
                                                    onChange={(e) =>
                                                        setPermission(
                                                            e.target.value as any
                                                        )
                                                    }
                                                />
                                            </div> */}
													</div>
													<div className="flex items-center space-x-2 mt-2">
														<button
															disabled={
																!isOwnWorkspace
															}
															className="button-secondary space-x-1"
															onClick={
																onAddMember
															}
														>
															<PlusIcon className="h-4 w-4" />
															<span>
																Add another
															</span>
														</button>
														{/* <button className="button-outlined">
                                                Bulk add
                                            </button> */}
													</div>
												</>
											)}
											<div className="mt-4 flex space-x-3">
												{isOwnWorkspace && (
													<button
														type="submit"
														className="justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center space-x-2"
														onClick={
															addMembersToWorkspace
														}
													>
														{isUpdating ? (
															<Loading
																size={16}
																color="black"
															/>
														) : null}
														<span>Save</span>
													</button>
												)}
												<button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
													onClick={onClose}
												>
													Close
												</button>
											</div>
										</div>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default WorkspaceEditModal;
