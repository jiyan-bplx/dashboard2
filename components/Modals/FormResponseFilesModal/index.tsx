import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";
import { FileWithId } from "../../BuilderComponents/Inputs/FileUploadInput";
import toast from "react-hot-toast";
import axios from "axios";

const FormResponseFilesModal = ({
	showFiles,
	setShowFiles,
	formId,
}: {
	showFiles: {
		type: "files";
		files: FileWithId[];
	} | null;
	setShowFiles: (a: any) => void;
	formId: string;
}) => {
	const viewFile = async (file: FileWithId) => {
		downloadFile(file, false);
	};
	const downloadFile = async (file: FileWithId, download?: boolean) => {
		if (!formId) {
			toast.error("There was an error fetching form data");
			return;
		}
		const toastId = toast.loading("Downloading file...");
		if (!file.name) {
			toast.error("File not found.", { id: toastId });
			return;
		}

		const url = file.url
			? file.url?.split("?")[0]
			: file.s3Url?.split("?")[0];

		if (url) {
			await saveFile(url, file.name, download);
			toast.success("File downloaded.", { id: toastId });
		} else {
			toast.error("Failed to download the file.", {
				id: toastId,
			});
		}
	};

	const saveFile = async (
		data: any,
		fileName: string,
		download?: boolean
	) => {
		return new Promise(async (resolve, reject) => {
			const link = document.createElement("a");

			let href;
			if (typeof data === "string") {
				// href = data;
				const res = await axios.get(data, {
					responseType: "blob",
				});
				const blob = new Blob([res.data], {
					type: res.headers["content-type"],
				});
				href = URL.createObjectURL(blob);
			} else {
				href = URL.createObjectURL(data);
			}

			// create "a" HTML element with href to file & click
			link.href = href;
			link.target = "_blank";
			link.title = fileName;
			if (download) {
				link.download = fileName;
			}
			document.body.appendChild(link);
			link.click();

			// clean up "a" element & remove ObjectURL
			document.body.removeChild(link);
			URL.revokeObjectURL(href);

			resolve(true);
		});
	};
	return (
		<Transition.Root show={showFiles ? true : false} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={() => setShowFiles(null)}
			>
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

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-300 sm:duration-300"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-300 sm:duration-300"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md">
									<div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-gray-900">
													Attachments
												</Dialog.Title>
												<div className="ml-3 flex h-7 items-center">
													<button
														type="button"
														className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
														onClick={() =>
															setShowFiles(null)
														}
													>
														<span className="sr-only">
															Close panel
														</span>
														<XMarkIcon
															className="h-6 w-6"
															aria-hidden="true"
														/>
													</button>
												</div>
											</div>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{showFiles && (
												<div className="sm:col-span-2">
													<dd className="mt-1 text-sm text-gray-900">
														<ul
															role="list"
															className="divide-y divide-gray-200 rounded-md border border-gray-200"
														>
															{showFiles?.files?.map(
																(file) => (
																	<li
																		key={
																			file.id
																		}
																		className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
																	>
																		<div className="flex w-0 flex-1 items-center">
																			<PaperClipIcon
																				className="h-5 w-5 flex-shrink-0 text-gray-400"
																				aria-hidden="true"
																			/>
																			<span className="ml-2 w-0 flex-1 truncate">
																				{file.name ??
																					file.id}
																			</span>
																		</div>
																		<div className="ml-4 flex-shrink-0 space-x-2">
																			<button
																				onClick={() =>
																					viewFile(
																						file
																					)
																				}
																				className="font-medium text-indigo-600 hover:text-indigo-500"
																			>
																				View
																			</button>
																			<button
																				onClick={() =>
																					downloadFile(
																						file,
																						true
																					)
																				}
																				className="font-medium text-indigo-600 hover:text-indigo-500"
																			>
																				Download
																			</button>
																		</div>
																	</li>
																)
															)}
														</ul>
													</dd>
												</div>
											)}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default FormResponseFilesModal;
