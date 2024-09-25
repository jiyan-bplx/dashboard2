import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "react-query";
import { generateAPIKey } from "@api/api_key";
import Input from "../../BuilderComponents/Inputs/Input";
import toast from "react-hot-toast";
import Loading from "@components/Loading";
import { ClipboardIcon } from "@heroicons/react/24/outline";

export default function GenerateApiKeyModal({
	open,
	onClose,
}: {
	open?: boolean;
	onClose: () => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [key, setKey] = useState<null | string>(null);

	const [keyName, setKeyName] = useState("");

	const client = useQueryClient();

	const copyToClipboard = () => {
		if (!key) return;
		navigator.clipboard.writeText(key);
		toast.success("API key copied to clipboard");
	};

	const onGenerate = async () => {
		if (isLoading) return;
		if (!keyName || keyName.length < 2) return;
		try {
			setIsLoading(true);
			const res = await generateAPIKey(keyName);
			if (res.data?.key) {
				setKey(res.data.key);
				client.refetchQueries("api_keys");
			} else {
				setKey(null);
				toast.error("Failed to generate API key");
			}
			setIsLoading(false);
		} catch (err) {
			toast.error("Failed to generate API key");
			setIsLoading(false);
			console.error("[generateApiKey]", err);
		}
	};

	return (
		<Transition.Root show={open} as={Fragment}>
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<div>
									{key && key?.length > 0 && (
										<div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
											<CheckIcon
												className="h-6 w-6 text-green-600"
												aria-hidden="true"
											/>
										</div>
									)}
									<div className="">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900"
										>
											{key && key?.length > 0
												? "Here's your API Key"
												: "Generate API Key"}
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500">
												{key && key?.length > 0
													? "You can use this key to authenticate your requests."
													: "Enter a name for your API key."}
											</p>

											{key && key?.length > 0 ? (
												<div>
													<p className="text-sm mt-1">
														This key will{" "}
														<b className="text-red-500">
															not
														</b>{" "}
														be shown again. Make
														sure to copy it now.
													</p>
													<div className="border rounded-md text-center mt-2 text-sm py-2">
														<code>{key}</code>
													</div>
												</div>
											) : (
												<div>
													<Input
														placeholder="Key name"
														value={keyName}
														onChange={(e) =>
															setKeyName(
																e.target.value
															)
														}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-6">
									{key && key?.length > 0 ? (
										<button
											type="button"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm items-center space-x-2"
											// onClick={onClose}
											onClick={copyToClipboard}
										>
											<ClipboardIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
											<span>Copy API Key</span>
										</button>
									) : (
										<button
											type="button"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm items-center space-x-2"
											// onClick={onClose}
											onClick={onGenerate}
											disabled={
												isLoading ||
												!keyName ||
												keyName.length < 2
											}
										>
											{isLoading && <Loading size={12} />}
											<span>Generate API Key</span>
											{/* Go back to dashboard */}
										</button>
									)}
									<button
										className="button-outlined mt-2 w-full items-center flex flex-col"
										onClick={onClose}
									>
										<span>Close</span>
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
