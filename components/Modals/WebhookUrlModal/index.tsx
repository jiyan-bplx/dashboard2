import { Dialog, Transition } from "@headlessui/react";
import { AxiosError } from "axios";
import { Fragment, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import { listIntegrationsForFormId } from "@api/integrations/list";
import { connectWebhookToForm } from "@api/integrations/webhook";
import { BaseResponse } from "@api/types/responses";
import Loading from "@components/Loading";
import Input from "../../BuilderComponents/Inputs/Input";
type WebhookUrlModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	formId: number;
};
export default function WebhookUrlModal({
	isOpen,
	closeModal,
	formId,
}: WebhookUrlModalProps) {
	const [webhookUrl, setWebhookUrl] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const { data, refetch } = useQuery(["integrations", formId], () =>
		listIntegrationsForFormId(formId)
	);

	const onSubmit = async () => {
		if (!webhookUrl || webhookUrl.length === 0) {
			toast.error("Please enter a valid webhook url");
			return;
		}
		if (
			data?.data.some(
				(item) =>
					item.integration_type === "webhook" &&
					item.token === webhookUrl
			)
		) {
			toast.error("This webhook url is already connected");
			return;
		}
		setIsCreating(true);
		try {
			const res = await connectWebhookToForm({
				url: webhookUrl,
				form_id: formId,
			});
			if (res.status === "success") {
				toast.success("Webhook connected successfully");
				setWebhookUrl("");
				closeModal();
				refetch();
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onConnectWebhookToForm] Response", res);
			}
			setIsCreating(false);
		} catch (err) {
			console.error("[onConnectWebhookToForm]", err);
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
										Add a Webhook endpoint
									</Dialog.Title>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}
									>
										<div className="mt-2">
											<div className="col-span-6 sm:col-span-3">
												<label
													htmlFor="webhookUrl"
													className="block text-sm  text-gray-700 mb-2"
												>
													Webhooks allow you to
													receive HTTP POST requests
													to a URL for new form
													submissions
												</label>
												<Input
													value={webhookUrl}
													onChange={(e) =>
														setWebhookUrl(
															e.target.value
														)
													}
													type="url"
													name="webhookUrl"
													id="webhookUrl"
													autoFocus
													placeholder="https://example.com/webhook"
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
												<span>Connect</span>
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
