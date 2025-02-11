import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import {
	deleteWorkspace,
	getAllWorkspaces,
	leaveWorkspace,
} from "@api/workspace";

export default function DeleteWorkspaceModal({
	open,
	onClose,
	workspaceId,
}: {
	workspaceId: number;
	open: boolean;
	onClose: () => void;
}) {
	const cancelButtonRef = useRef(null);

	const router = useRouter();

	const { refetch } = useQuery("workspaces", () => getAllWorkspaces());

	const isDeleteOrLeave =
		router.query.delete === "true"
			? "delete"
			: router.query.leave === "true"
			? "leave"
			: null;

	const [isDeleting, setIsDeleting] = useState(false);
	const onDelete = async () => {
		try {
			if (!workspaceId) {
				toast.error("Something went wrong");
				return;
			}
			setIsDeleting(true);
			const res =
				isDeleteOrLeave === "delete"
					? await deleteWorkspace(workspaceId)
					: await leaveWorkspace(workspaceId);
			if (res.status === "success") {
				refetch();
				if (isDeleteOrLeave === "delete") {
					toast.success("Workspace deleted successfully");
				} else {
					toast.success("Left workspace successfully");
				}
				router.push({
					query: {
						...router.query,
						workspace: null,
						edit: null,
						delete: null,
						leave: null,
					},
				});
				// const url = router.query?.next as string;
				// if (url) {
				// 	router.push(url);
				// } else {
				// 	router.push("/");
				// }
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onDeleteWorkspace] Response", res);
			}
			setIsDeleting(false);
		} catch (err) {
			console.error("[onDeleteWorkspace]", err);
			const e = err as AxiosError<any>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message ?? "Something went wrong");
			} else {
				toast.error("Something went wrong");
			}
			setIsDeleting(false);
		}
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={cancelButtonRef}
				onClose={onClose}
			>
				<Toaster />
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
											<ExclamationTriangleIcon
												className="h-6 w-6 text-red-600"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-lg font-medium leading-6 text-gray-900 capitalize"
											>
												{isDeleteOrLeave} Workspace ?
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Are you sure you want to{" "}
													{isDeleteOrLeave} this
													Workspace? This action
													cannot be undone. This will
													permanently delete the
													workspace, including all
													forms and responses{" "}
													{isDeleteOrLeave ===
													"delete"
														? "and remove all members"
														: "from your account"}
													.
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm items-center space-x-1"
										onClick={onDelete}
									>
										{isDeleting && <LoaderIcon />}
										<span className="capitalize">
											{isDeleteOrLeave}
										</span>
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
										onClick={onClose}
										ref={cancelButtonRef}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
