import { Dialog, Transition } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import Head from "next/head";
import { Fragment, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { checkFormPassword } from "@api/forms";
import { BaseResponse } from "@api/types/responses";
import Loading from "@components/Loading";
type FormPasswordModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	formId: number;
	publicId: string;
	onSuccess: () => void;
};
export default function FormPasswordModal({
	isOpen,
	closeModal,
	onSuccess,
	formId,
	publicId,
}: FormPasswordModalProps) {
	const [password, setFormPassword] = useState("");
	const [isChecking, setIsChecking] = useState(false);

	const onSubmit = async () => {
		if (!password) return;
		setIsChecking(true);
		try {
			const res = await checkFormPassword({
				password: password,
				form_id: publicId,
			});
			if (res.status === "success") {
				toast.success("Authentication succesful.");
				closeModal();
				onSuccess();
				// refetch();
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onCheckFormPassword] Response", res);
			}
			setIsChecking(false);
		} catch (err) {
			console.error("[onCheckFormPassword]", err);
			const e = err as AxiosError<BaseResponse<null>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsChecking(false);
		}
	};
	return (
		<>
			<Head>
				<title>This form is password protected | ByteForms</title>
			</Head>
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
									<div className="flex items-center justify-center flex-col mb-3">
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
											<LockClosedIcon
												className="h-6 w-6 text-red-600"
												aria-hidden="true"
											/>
										</div>

										<Dialog.Title
											as="h3"
											className="mt-3 text-lg font-medium leading-6 text-gray-900"
										>
											This form is password protected.
										</Dialog.Title>
										<p className="text-xs text-gray-600 mt-2">
											Please enter the password to access
											the form.
										</p>
									</div>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}
									>
										<div className="mt-2">
											<div className="col-span-6 sm:col-span-3">
												<input
													value={password}
													onChange={(e) =>
														setFormPassword(
															e.target.value
														)
													}
													required
													type="password"
													name="password"
													id="password"
													autoFocus
													placeholder="Form Password"
													className="mt-1 block w-full bg-gray-100 h-8 px-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div>
										</div>

										<div className="mt-4 flex items-center space-x-2 justify-end">
											<button
												type="submit"
												className="button-primary flex items-center space-x-2"
												onClick={onSubmit}
											>
												{isChecking ? (
													<Loading
														size={16}
														color="black"
													/>
												) : null}
												<span>Continue</span>
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
