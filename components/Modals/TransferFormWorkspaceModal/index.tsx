import { Dialog, Transition } from "@headlessui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { editForm, getAllForms } from "@api/forms";
import { FormItem } from "@api/forms/responses";
import { BaseResponse } from "@api/types/responses";
import Loading from "@components/Loading";
import Input from "../../BuilderComponents/Inputs/Input";
import useUser from "@hooks/useUser";
import { changeFormWorkspace, getAllWorkspaces } from "@api/workspace";
import AutoComplete from "../../BuilderComponents/Inputs/AutoComplete";
import { Workspace } from "@api/workspace/responses";
type TransferFormWorkspaceModalProps = {
	open: boolean;
	onClose: () => void;
	form: FormItem;
};
export default function TransferFormWorkspaceModal({
	form,
	open,
	onClose,
}: TransferFormWorkspaceModalProps) {
	const [selectedWorkspace, setSelectedWorkspace] =
		useState<Workspace | null>(null);

	const {
		data: workspaces,
		isLoading: isLoading,
		refetch: refetchWorkspaces,
	} = useQuery("workspaces", getAllWorkspaces, {
		onSuccess: (data) => {
			setSelectedWorkspace(
				data?.data?.workspaces?.find(
					(w) => w.id === form.workspace_id
				) ?? null
			);
			// alert(data.status);
		},
	});

	const [isCreating, setIsCreating] = useState(false);

	const client = useQueryClient();

	const onSubmit = async () => {
		if (!selectedWorkspace) return;
		setIsCreating(true);
		try {
			const res = await changeFormWorkspace(
				form.id,
				selectedWorkspace?.id
			);
			if (res.status === "success") {
				client.refetchQueries(["forms", form.id]);
				toast.success("Form transferred successfully");
				onClose();
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onTransferWorkspace] Response", res);
			}
			setIsCreating(false);
		} catch (err) {
			console.error("[onTransferWorkspace]", err);
			const e = err as AxiosError<BaseResponse<null>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsCreating(false);
		}
	};
	return (
		<>
			<Toaster />
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
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Change form workspace
									</Dialog.Title>

									<div className="mt-2 mb-5">
										<AutoComplete
											placeholder="Select workspace"
											data={
												workspaces?.data?.workspaces?.filter(
													(w) =>
														w.id !==
														form.workspace_id
												) ?? []
											}
											onSelect={(item) => {
												setSelectedWorkspace(item);
											}}
											value={selectedWorkspace}
											getLabel={(item) => item?.name}
											getVal={(item) =>
												item?.id.toString()
											}
										/>
										<p className="text-sm text-gray-600 mt-4">
											Changing the workspace will remove
											the form from the current workspace
											and add it to the selected
											workspace, along with all the
											responses.
										</p>
									</div>

									<div className="mt-2 flex ">
										<button
											type="submit"
											className="justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center space-x-2"
											onClick={onSubmit}
										>
											{isCreating ? (
												<Loading
													size={16}
													color="black"
												/>
											) : null}
											<span>Transfer</span>
										</button>
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={onClose}
										>
											Cancel
										</button>
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
