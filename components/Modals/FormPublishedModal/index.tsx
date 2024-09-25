import { Dialog, Transition } from "@headlessui/react";
import { ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FormItem } from "@api/forms/responses";
import { classNames } from "@utils/index";

type FormPublishedModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	selectedForm: FormItem;
};
export default function FormPublishedModal({
	isOpen,
	closeModal,
	selectedForm,
}: FormPublishedModalProps) {
	const getLink = (includeProtocol = true) => {
		return (
			(includeProtocol ? `${window.location.protocol}//` : "") +
			`${window.location.host}/form/${selectedForm?.public_id}`
		);
	};
	const copyFormLink = async () => {
		if (!selectedForm) return;
		// Check if browser supports clipboard
		if (!navigator.clipboard) {
			toast.error("Your browser does not support clipboard");
			return;
		}

		// Copy to clipboard
		await navigator.clipboard.writeText(getLink());
		toast.success("Link copied to clipboard");

		if (navigator.share === undefined) return;
		navigator.share({
			title: selectedForm?.name + " - ByteForms",
			url: getLink(),
			text: "I have shared a Form with you using ByteForms. Click the link below to fill",
		});
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

					<div className="fixed inset-0 overflow-y-auto py-10">
						<div className="flex min-h-full items-center justify-center p-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-white shadow-xl transition-all">
									<div className="p-6 align-middle">
										<div className="flex items-start justify-between">
											<Dialog.Title
												as="h1"
												className="text-2xl font-medium leading-6 text-gray-900 text-left mb-7 mt-2"
											>
												Yay! Your form is published! 🎉
											</Dialog.Title>
											<button onClick={closeModal}>
												<XMarkIcon className="w-5 h-5" />
											</button>
										</div>
										<div>
											<div className="mt-2">
												<p className="text-left font-medium text-sm mb-1">
													Your Form Link
												</p>
												<div className="relative rounded-md shadow-sm">
													{typeof window !==
														"undefined" && (
														<input
															onClick={
																copyFormLink
															}
															readOnly
															type="text"
															name="account-number"
															id="account-number"
															value={`${window?.location.protocol}//${window?.location.host}/form/${selectedForm?.public_id}`}
															className="block w-full rounded-md border-gray-300 pr-10 sm:text-sm py-2 pl-2 bg-gray-50 border outline-none cursor-pointer"
															placeholder="000-00-0000"
														/>
													)}
													<div className="absolute inset-y-0 right-0 flex items-center pr-3  z-50">
														<ClipboardIcon
															onClick={
																copyFormLink
															}
															className="h-5 w-5 text-gray-400 cursor-pointer"
															aria-hidden="true"
														/>
													</div>
												</div>
												<p className="text-xs text-gray-400 self-start text-start mt-1">
													Tap to copy
												</p>
											</div>
										</div>
										<p className="font-medium text-lg mt-4">
											Next steps
										</p>
										<Link
											href={`dashboard/${selectedForm.public_id}/embed`}
											className={classNames(
												"border border-dashed border-gray-300 col-span-2 rounded-md px-6 py-6 flex flex-row items-center mt-4"
											)}
										>
											<div className="bg-cyan-100 flex p-2 md:p-4 rounded-md self-center ">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
													className="w-4 h-4 md:w-6 md:h-6"
												>
													<rect
														x="2"
														y="4"
														width="20"
														height="16"
														rx="2"
													/>
													<path d="M10 4v4" />
													<path d="M2 8h20" />
													<path d="M6 4v4" />
												</svg>
												{/* <ArrowDownTrayIcon /> */}
											</div>
											<div className="flex flex-col ms-6 ">
												<p className="font-medium md:text-lg ">
													Embed form
												</p>
												<p className="text-xs md:text-sm text-gray-500 font-light ">
													Embed your form in your
													website
												</p>
											</div>
										</Link>
										<Link
											href={`dashboard/${selectedForm.id}/edit?tab=INTEGRATIONS`}
											className={classNames(
												"border border-dashed border-gray-300 col-span-2 rounded-md px-6 py-6 flex flex-row items-center mt-4"
											)}
										>
											<div className="bg-indigo-100 flex p-2 md:p-4 rounded-md self-center ">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-4 h-4 md:w-6 md:h-6"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect
														width="7"
														height="7"
														x="14"
														y="3"
														rx="1"
													/>
													<path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
												</svg>
											</div>
											<div className="flex flex-col ms-6 ">
												<p className="font-medium md:text-lg ">
													Setup Integrations
												</p>
												<p className="text-xs md:text-sm text-gray-500 font-light ">
													Connect your form with 10+
													integrations
												</p>
											</div>
										</Link>
										<Link
											href={`dashboard/${selectedForm.id}/edit?tab=RESPONSES`}
											className={classNames(
												"border border-dashed border-gray-300 col-span-2 rounded-md px-6 py-6 flex flex-row items-center mt-4"
											)}
										>
											<div className="bg-green-100 flex p-2 md:p-4 rounded-md self-center ">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
													className="w-4 h-4 md:w-6 md:h-6"
												>
													<path d="M21 6H3" />
													<path d="M10 12H3" />
													<path d="M10 18H3" />
													<circle
														cx="17"
														cy="15"
														r="3"
													/>
													<path d="m21 19-1.9-1.9" />
												</svg>
											</div>
											<div className="flex flex-col ms-6 ">
												<p className="font-medium md:text-lg ">
													View Responses
												</p>
												<p className="text-xs md:text-sm text-gray-500 font-light ">
													View received form
													submissions
												</p>
											</div>
										</Link>
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
