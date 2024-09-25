import { Dialog, Transition } from "@headlessui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { editForm, getAllForms } from "@api/forms";
import { FormItem } from "@api/forms/responses";
import { BaseResponse } from "@api/types/responses";
import Loading from "@components/Loading";
import Input from "../../BuilderComponents/Inputs/Input";
type EditCustomFormModalProps = {
	open: boolean;
	onClose: () => void;
	form: FormItem;
};
export default function EditCustomFormModal({
	form,
	open,
	onClose,
}: EditCustomFormModalProps) {
	const [formName, setFormName] = useState(() => form.name);
	const [isCreating, setIsCreating] = useState(false);

	const { refetch } = useQuery({
		queryKey: ["forms"],
		queryFn: getAllForms,
	});

	const onSubmit = async () => {
		if (!formName) return;
		setIsCreating(true);
		try {
			const res = await editForm(form.id, {
				name: formName,
				body: "[]",
				is_custom: true,
			});
			if (res.status === "success") {
				refetch();
				toast.success("Form updated successfully");
				setFormName("");
				onClose();
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onEditCustomForm] Response", res);
			}
			setIsCreating(false);
		} catch (err) {
			console.error("[onEditCustomForm]", err);
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
										Edit form
									</Dialog.Title>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}
									>
										<div className="mt-2">
											<div className="col-span-6 sm:col-span-3">
												<Input
													value={formName}
													onChange={(e) =>
														setFormName(
															e.target.value
														)
													}
													required
													type="text"
													name="form-name"
													id="form-name"
													autoFocus
													placeholder="My awesome form"
													label="Form Name"
												/>
											</div>
										</div>

										<div className="mt-4 flex ">
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
												<span>Save</span>
											</button>
											<button
												type="button"
												className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
												onClick={onClose}
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
