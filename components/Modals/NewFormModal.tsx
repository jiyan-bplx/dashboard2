import { Dialog, Transition } from "@headlessui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { createForm, getAllForms } from "@api/forms";
import { BaseResponse } from "@api/types/responses";
import Loading from "../Loading";
import { getActiveSubscription, getPlanLimits } from "@api/subscriptions";
import useUser from "@hooks/useUser";
import Input from "../BuilderComponents/Inputs/Input";
import { getAllWorkspaces } from "@api/workspace";
type NewFormModalProps = {
	isOpen: boolean;
	closeModal: () => void;
};
export default function NewFormModal({
	isOpen,
	closeModal,
}: NewFormModalProps) {
	const [formName, setFormName] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const { data, isLoading } = useUser({
		redirect: false,
	});

	const router = useRouter();

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	// const canCreateMoreForms = useMemo(() => {
	// 	if (data?.data) {
	// 		if (planLimits?.data) {
	// 			return (
	// 				planLimits?.data?.limits?.max_forms?.value <
	// 				planLimits?.data?.limits?.max_forms?.limit
	// 			);
	// 		}
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// }, [data, planLimits]);

	const { refetch } = useQuery({
		queryKey: ["workspaces"],
		queryFn: getAllWorkspaces,
	});

	const onSubmit = async () => {
		// if (!canCreateMoreForms) {
		// 	toast.error(
		// 		"You have reached the maximum number of forms allowed for your plan"
		// 	);
		// 	return;
		// }
		if (!formName) return;
		setIsCreating(true);
		try {
			const res = await createForm({
				name: formName,
				is_custom: true,
				body: "[]",
				form_type: "form",
			});
			if (res.status === "success" && res.data) {
				toast.success("Form created successfully");
				router.replace(`/dashboard/${res.data.id}/edit`);
				refetch();
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onCreateCustomForm] Response", res);
			}
			setIsCreating(false);
		} catch (err) {
			console.error("[onCreateCustomForm]", err);
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
										Create a new Website
									</Dialog.Title>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}
									>
										<div className="mt-2">
											<div className="col-span-6 sm:col-span-3">
												<Input
													label="Form Name"
													value={formName}
													onChange={(e) =>
														setFormName(
															e.target.value
														)
													}
													type="text"
													name="form-name"
													id="form-name"
													autoFocus
													placeholder="My awesome form"
												/>
											</div>
										</div>

										<div className="mt-4 flex items-center space-x-2">
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
												<span>Create</span>
											</button>
											<button
												type="button"
												className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
												onClick={closeModal}
											>
												Cancel
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
