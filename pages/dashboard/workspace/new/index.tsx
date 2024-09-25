import { TrashIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import DashboardNavbar from "@components/DashboardNavbar";
import Input from "@components/BuilderComponents/Inputs/Input";
import Loading from "@components/Loading";
import useUser from "@hooks/useUser";
import validator from "validator";
import { createWorkspace, inviteUsersToWorkspace } from "@api/workspace";
import { CreateWorkspaceResponse } from "@api/workspace/responses";

const NewWorkspacePage = () => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const { data: user } = useUser();

	const [showMembersPage, setShowMembersPage] = useState(false);
	const [membersList, setMembersList] = useState<
		{ email: string; permission: string }[]
	>([]);

	const [email, setEmail] = useState("");
	const [permission, setPermission] = useState<"View" | "Edit">("View");
	const [isLoading, setIsLoading] = useState(false);

	const createNewWorkspace = async () => {
		try {
			setIsLoading(true);
			const res = await createWorkspace({
				name,
				description,
			});

			if (res.data?.id) {
				toast.success("Workspace created successfully");
				router.replace({
					query: {
						workspace: res.data.id,
					},
				});
				setShowMembersPage(true);
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onCreateWorkspace] Response", res);
			}
			setIsLoading(false);
		} catch (err) {
			console.error("[onCreateWorkspace]", err);
			const e = err as AxiosError<CreateWorkspaceResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsLoading(false);
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

		if (isAlreadyAdded) {
			toast.error(`'${emailString}' is already added.`);
			return false;
		}

		return true;
	};

	const addMembersToWorkspace = async () => {
		try {
			const members = membersList.map((item) => item.email);

			if (members.length === 0) {
				const validEmail = checkIfValidEmail(email);
				if (!validEmail) return;
				members.push(email);
			}

			setIsLoading(true);
			const workspaceId = parseInt(router.query.workspace as string);
			const res = await inviteUsersToWorkspace(workspaceId, {
				emails: members,
			});

			if (res.status === "success") {
				toast.success("Members invited successfully");
				router.push("/dashboard", {
					query: {
						workspace: workspaceId,
					},
				});
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onAddMembersToWorkspace] Response", res);
			}
			setIsLoading(false);
		} catch (err) {
			console.error("[onAddMembersToWorkspace]", err);
			const e = err as AxiosError<CreateWorkspaceResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsLoading(false);
		}
	};
	const onContinue = async () => {
		if (!name) {
			toast.error("Please enter a name for your workspace");
			return;
		}

		if (
			typeof router.query.workspace === "string" &&
			router.query.workspace
		) {
			await addMembersToWorkspace();
		} else {
			await createNewWorkspace();
		}
	};

	const setPermissionForEmail = (email: string, permission: string) => {
		const memberIndex = membersList.findIndex(
			(item) => item.email === email
		);
		if (memberIndex !== -1) {
			const newMemeberList = [...membersList];
			newMemeberList[memberIndex].permission = permission;
			setMembersList(newMemeberList);
		}
	};

	const deleteEmail = (emailToDelete: string) => {
		setMembersList((prev) => prev.filter((m) => m.email !== emailToDelete));
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

	return (
		<>
			<Toaster />
			<Head>
				<title>New Workspace - ByteForms</title>
			</Head>
			<main className="w-full overflow-x-hidden">
				<DashboardNavbar />
				<div className="mx-auto container py-12 sm:py-12 lg:py-16 w-full max-w-6xl px-6">
					{showMembersPage ? (
						<div>
							<h1 className="text-2xl font-medium">
								Add members to your workspace
							</h1>
							<p className="text-gray-500 font-light text-sm mt-1 pb-1">
								Invite people to collaborate in your workspace
							</p>
							<div>
								{membersList.length > 0 && (
									<p className="text-xs font-medium text-gray-500 mt-2">
										Members
									</p>
								)}
								{membersList.map((member) => (
									<div
										key={member.email}
										className="flex items-center space-x-2"
									>
										<div className="w-full">
											<Input
												placeholder="Email address"
												value={member.email}
												onChange={(e) => {
													const newMembersList =
														membersList.map((m) => {
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
														});
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
												deleteEmail(member.email)
											}
										>
											<TrashIcon className="w-4 h-4 text-red-500" />
										</button>
									</div>
								))}
								<div className="mt-4 flex items-center space-x-1">
									<div className="max-w-sm w-full">
										<Input
											placeholder="Email address"
											value={email}
											onChange={(e) => {
												setEmail(e.target.value);
											}}
											onKeyPress={(e) => {
												if (e.key === "Enter") {
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
										className="button-secondary space-x-1"
										onClick={onAddMember}
									>
										<PlusIcon className="h-4 w-4" />
										<span>Save & add another</span>
									</button>
									{/* <button className="button-outlined">
										Bulk add
									</button> */}
								</div>
							</div>
						</div>
					) : (
						<div>
							<h1 className="text-2xl font-medium">
								Give your workspace a name
							</h1>
							<p className="text-gray-500 font-light text-sm mt-1 pb-1">
								Add a name & optional description for
								identifying your workspace
							</p>
							<Input
								placeholder={
									user?.data?.name
										? `${user?.data?.name}'s Workspace`
										: "Your workspace name"
								}
								value={name}
								// onKeyPress={(e) => {
								// 	if (e.key === "Enter") {
								// 		onContinue();
								// 	}
								// }}
								onChange={(e) => setName(e.target.value)}
							/>

							<Input
								type="textarea"
								placeholder={"Workspace description"}
								value={description}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										onContinue();
									}
								}}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					)}
					<button
						className="button-primary mt-4 space-x-2"
						disabled={isLoading}
						onClick={onContinue}
					>
						{isLoading && <Loading size={14} />}
						<span>Continue</span>
					</button>
				</div>
			</main>
		</>
	);
};

export default NewWorkspacePage;
