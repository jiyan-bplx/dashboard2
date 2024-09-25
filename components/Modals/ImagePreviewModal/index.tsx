import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { blobToFile, classNames } from "@utils/index";
import ImageCropper from "./ImageCropper";
type ImagePreviewModalProps = {
	isOpen: boolean;
	file: File | null;
	closeModal: () => void;
	onUpload: (file: File) => void;
	enableCrop?: boolean;
};
export default function ImagePreviewModal({
	isOpen,
	file,
	closeModal,
	onUpload,
	enableCrop,
}: ImagePreviewModalProps) {
	const [croppedUrl, setCroppedUrl] = useState<Blob | null>(null);
	const imageUrl = useMemo(
		() => (file ? URL.createObjectURL(file) : null),
		[file]
	);

	const uploadFile = () => {
		if (file) {
			if (enableCrop && croppedUrl) {
				const newFile = blobToFile(croppedUrl, file.name);
				onUpload(newFile);
			} else {
				onUpload(file);
			}
		} else {
			alert("No file");
		}
	};
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={closeModal}>
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

					<div className="fixed inset-0">
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
								<Dialog.Panel className="max-w-2xl transform overflow-x-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all overflow-y-hidden min-h-full h-full w-full">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Upload image
									</Dialog.Title>
									{enableCrop && (
										<p className="text-sm text-gray-600">
											Crop the image to fit the desired
											size.
										</p>
									)}

									{file && imageUrl && (
										<div className="mt-2 relative w-full h-full min-h-full">
											{enableCrop ? (
												<ImageCropper
													src={imageUrl}
													setCroppedUrl={
														setCroppedUrl
													}
												/>
											) : (
												<img
													src={imageUrl}
													alt="preview"
													className="max-h-[70vh] object-contain shadow mt-2"
												/>
											)}
										</div>
									)}
									<div className="flex justify-end mt-4 items-center space-x-2">
										<button
											onClick={closeModal}
											className="inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Cancel
										</button>
										<button
											onClick={uploadFile}
											className={classNames(
												"button-primary"
											)}
										>
											{enableCrop ? "Continue & " : ""}
											Upload
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
