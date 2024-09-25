import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { InputTypeWithoutIcon } from "../../../types";
import Input from "../../BuilderComponents/Inputs/Input";
import { PencilIcon } from "@heroicons/react/24/outline";
import FileInputWithPreview from "../../BuilderComponents/Inputs/FileInputWithPreview";
import { FileWithId } from "../../BuilderComponents/Inputs/FileUploadInput";
type PictureChoiceOptionModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	selectedInput: InputTypeWithoutIcon;
	optionIndex: number;
	option?: {
		label: string;
		value: string;
	};
	changeProperty: (property: { key: string; value: any }) => void;
};
export default function PictureChoiceOptionModal({
	closeModal,
	isOpen,
	changeProperty,
	option,
	selectedInput,
	optionIndex,
}: PictureChoiceOptionModalProps) {
	const [label, setLabel] = useState("");
	const [imageUrl, setImageUrl] = useState(() => option?.value);
	const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(
		() => option?.value
	);

	useEffect(() => {
		setLabel(
			option?.label ??
				`New Option ${(selectedInput.options ?? [])?.length + 1}`
		);
		setImageUrl(option?.value);
		setUploadedUrl(option?.value);
	}, [option]);

	const onSubmit = async () => {
		if (!label || label.length === 0) {
			toast.error("Please enter a valid label.");
			return;
		}
		if (!uploadedUrl || uploadedUrl.length === 0) {
			toast.error("Please select an image");
			return;
		}
		const newOptions = [...(selectedInput.options ?? [])];
		if (newOptions[optionIndex] as any) {
			(newOptions[optionIndex] as any).value = uploadedUrl;
			(newOptions[optionIndex] as any).label = label;
		}
		changeProperty({ key: "options", value: newOptions });
		closeModal();
	};

	const onChangeImage = (file: FileWithId) => {
		if (file.url) {
			setImageUrl(URL.createObjectURL(file.file));
			setUploadedUrl(file.url);
		}
	};
	return (
		<>
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
										Edit image option
									</Dialog.Title>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}
									>
										<div className="mt-2">
											<Input
												label="Option Label"
												value={label}
												placeholder="Label"
												onChange={(e) =>
													setLabel(e.target.value)
												}
											/>
										</div>

										<div className="mt-4">
											<label
												htmlFor="value"
												className="block text-sm font-medium text-gray-700"
											>
												Image
											</label>
											<div className="mt-1 relative">
												<img
													src={imageUrl}
													alt={label}
													className="aspect-square object-cover rounded w-full"
												/>
												<div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
													<FileInputWithPreview
														enableCrop
														buttonTitle="Change image"
														onSuccess={
															onChangeImage
														}
													/>
												</div>
											</div>
										</div>

										<div className="mt-4 flex items-center space-x-2">
											<button
												type="submit"
												disabled={
													label.length === 0 ||
													!uploadedUrl ||
													uploadedUrl?.length === 0
												}
												className="button-primary"
												onClick={onSubmit}
											>
												<span>Save</span>
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
