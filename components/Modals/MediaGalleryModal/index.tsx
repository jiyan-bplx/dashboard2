import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { generateAPIKey } from "@api/api_key";
import Input from "../../BuilderComponents/Inputs/Input";
import Loading from "@components/Loading";
import { FileWithId } from "../../BuilderComponents/Inputs/FileUploadInput";
import { nanoid } from "nanoid";
import { API_URL } from "@utils/constants";
import {
	classNames,
	convertKBtoMB,
	getExtensionFromFileName,
	isNumber,
} from "@utils/index";
import useS3Upload from "@hooks/useS3Upload";
import { generateS3SignedUrl } from "@api/upload";
import { useRouter } from "next/router";
import { getFormById, getFormByPublicId } from "@api/forms";

export default function MediaGalleryModal({
	open,
	onClose,
	onSuccess,
}: {
	onSuccess: (file: Pick<FileWithId, "s3Url" | "url" | "publicUrl">) => void;
	open?: boolean;
	onClose: () => void;
}) {
	const [activeTab, setActiveTab] = useState<string>("upload");

	// drag state
	const [dragActive, setDragActive] = useState(false);

	// handle drag events
	const handleDrag: React.DragEventHandler<HTMLButtonElement> = function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop: React.DragEventHandler<HTMLButtonElement> = function (e) {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			// at least one file has been dropped so do something
			handleFiles(e.dataTransfer.files);
		}
	};

	// triggers when file is selected with click
	const handleChange: React.ChangeEventHandler<HTMLInputElement> = function (
		e
	) {
		e.preventDefault();

		if (e.target.files && e.target.files[0]) {
			// at least one file has been selected so do something
			handleFiles(e.target.files);
		}
	};
	const images = [
		{
			src: "https://rare-gallery.com/mocahbig/409879-liquid-4K-abstract.jpg",
			alt: "Image 1",
		},
		{
			src: "https://wallpapersmug.com/download/3840x2400/fbe513/abstract-liquid-mixture.jpg",
			alt: "Image 2",
		},
		{
			src: "https://img.freepik.com/free-photo/abstract-backdrop-with-smooth-wave-pattern-vibrant-multi-colored-silk-generated-by-artificial-intelligence_188544-240272.jpg?size=1080&ext=jpg&ga=GA1.1.1700460183.1712620800&semt=ais",
			alt: "Image 3",
		},
		// Add more images as needed
	];

	const checkFileSize = (file: File) => {
		const sizeLimit = 10_000;
		if (file.size / 1000 > sizeLimit) {
			toast.error(
				"File size is too large, please upload a file less than " +
					convertKBtoMB(sizeLimit)
			);
			return null;
		}
		return file;
	};

	const router = useRouter();

	const formId = (router.query.slug ?? router.query.formId) as string;

	const {
		data: formData,
		isLoading,
		error,
	} = useQuery(
		["forms", formId],
		() => {
			if (isNumber(formId)) {
				return getFormById(parseInt(formId));
			} else {
				return getFormByPublicId(formId);
			}
		},
		{
			enabled: typeof formId === "string",
		}
	);

	const [text, setText] = useState(() => formData?.data?.name);
	const { progress, uploadFile, uploadedUrl } = useS3Upload();

	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const uploadToS3 = async (file: FileWithId): Promise<FileWithId> => {
		if (typeof formData?.data?.id !== "number") {
			toast.error("There was an error fetching form details");
			return {
				...file,
				uploaded: false,
				uploading: false,
			};
		}
		if (!file.file.name) {
			toast.error("Invalid file");
			return {
				...file,
				uploaded: false,
				uploading: false,
			};
		}
		const toastId = toast.loading("Uploading image...");
		try {
			const fileNameWithIdAndPath = `${formData?.data.user_id}/${formId}/${file.name}`;
			const uploadUrl = await generateS3SignedUrl({
				file_name: fileNameWithIdAndPath,
				form_id: formData?.data.id,
			});

			if (uploadUrl.data) {
				const res = await uploadFile(file.file, uploadUrl.data);

				toast.success("Image uploaded", { id: toastId });

				return {
					...file,
					uploaded: true,
					url: res.url,
					publicUrl: uploadUrl.data,
					s3Url: res.url.toString().split("?")[0],
					uploading: false,
				};
			} else {
				toast.error("Failed to upload image", { id: toastId });
				return {
					...file,
					uploaded: false,
					uploading: false,
				};
			}
		} catch (error) {
			toast.error("Error uploading file", { id: toastId });
			console.error(error);
			return {
				...file,
				uploaded: false,
				uploading: false,
			};
		}
	};

	const onUpload = async (file: File) => {
		if (typeof formData?.data?.id !== "number") {
			toast.error("There was an error fetching form details. ");
			return;
		}

		try {
			setFile(file);
			setIsUploading(true);

			const fileId = nanoid();
			const fileItem: FileWithId = {
				id: fileId,
				file,
				uploaded: false,
				uploading: true,
				provider: "byteforms",
				name: `cover_image_${fileId}.${getExtensionFromFileName(
					file.name
				)}`,
				size: file.size,
			};

			const res = await uploadToS3(fileItem);

			if (!res) {
				setIsUploading(false);
				setFile(null);
				toast.error("Error uploading image");
				return null;
			}

			if (res.s3Url) {
				setIsUploading(false);
				onSuccess(res);
				onClose();
				setFile(null);
			}
		} catch (error) {
			toast.error("Error uploading image");
			console.error(error);
			setIsUploading(false);
			setFile(null);
		}
	};

	const handleFiles = (files: FileList) => {
		if (files.length === 0) return;
		if (files.length > 1) {
			toast.error("You can only upload a maximum of " + 1 + " files");
			return;
		}

		if (files.length === 1) {
			const file = checkFileSize(files[0]);
			if (!file) {
				console.error("[handleFiles] No file");
				return;
			}
			return onUpload(files[0]);
		}
	};

	const inputRef = useRef<HTMLInputElement>(null);

	const onButtonClick = () => {
		inputRef?.current?.click();
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
								<div className="">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Media Gallery
									</Dialog.Title>
									<div className="border-b border-gray-200">
										<nav
											className="-mb-px flex space-x-8"
											aria-label="Tabs"
										>
											{[
												"Upload",
												"Based on Title",
												"Default",
											].map((tab) => (
												<button
													onClick={() =>
														setActiveTab(tab)
													}
													key={tab}
													className={classNames(
														activeTab.toLowerCase() ===
															tab.toLowerCase()
															? "border-indigo-500 text-indigo-600"
															: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
														"whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
													)}
													aria-current={
														activeTab.toLowerCase() ===
														tab.toLowerCase()
															? "page"
															: undefined
													}
												>
													{tab}
												</button>
											))}
										</nav>
									</div>
									{activeTab.toLowerCase() === "upload" && (
										<div className="">
											{file ? (
												<div className="relative rounded-md overflow-hidden mt-2">
													<img
														alt="uploaded image"
														src={URL.createObjectURL(
															file
														)}
													/>
													{isUploading && (
														<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black bg-opacity-50 flex items-center justify-center flex-col text-white">
															<Loading />
															<span>
																Uploading
															</span>
														</div>
													)}
												</div>
											) : (
												<div className="mt-2">
													<button
														className={classNames(
															dragActive
																? "shadow bg-white"
																: "bg-transparent",
															"flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 w-full"
														)}
														type="button"
														onClick={onButtonClick}
														onDragEnter={handleDrag}
														onDragLeave={handleDrag}
														onDragOver={handleDrag}
														onDrop={handleDrop}
													>
														<div className="space-y-1 text-center">
															<svg
																className="mx-auto h-12 w-12 text-gray-400"
																stroke="currentColor"
																fill="none"
																viewBox="0 0 48 48"
																aria-hidden="true"
															>
																<path
																	d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
																	strokeWidth={
																		2
																	}
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
															<div className="flex text-sm text-gray-600">
																<div className="relative cursor-pointer rounded-md  font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
																	<span>
																		Upload{" "}
																	</span>
																	<input
																		ref={
																			inputRef
																		}
																		value={
																			undefined
																		}
																		onChange={
																			handleChange
																		}
																		type="file"
																		className="opacity-0 absolute max-w-full"
																	/>
																</div>
																<p className="pl-1">
																	or drag and
																	drop an
																	image
																</p>
															</div>
															<p className="text-xs text-gray-500">
																JPG, PNG, or
																GIF. up to{" "}
																{convertKBtoMB(
																	10_000
																)}
															</p>
														</div>
													</button>
												</div>
											)}
										</div>
									)}
									{activeTab.toLowerCase() ===
										"based on title" && (
										<div className="mt-2">
											<Input
												placeholder="Enter text here"
												value={text}
												onChange={(e) =>
													setText(e.target.value)
												}
											/>
											<button
												className="mt-2"
												onClick={() => {
													onSuccess({
														publicUrl: `https://cdn.statically.io/og/theme=dark/${
															text ??
															formData?.data?.name
														}.jpg`,
														s3Url: `https://cdn.statically.io/og/theme=dark/${
															text ??
															formData?.data?.name
														}.jpg`,
														url: `https://cdn.statically.io/og/theme=dark/${
															text ??
															formData?.data?.name
														}.jpg`,
													});
													onClose();
												}}
											>
												<img
													className="bg-gray-50 rounded aspect-video"
													src={`https://cdn.statically.io/og/theme=dark/${
														text ??
														formData?.data?.name
													}.jpg`}
													alt={
														text ??
														formData?.data?.name
													}
												/>
											</button>
										</div>
									)}
									{activeTab.toLowerCase() === "default" && (
										<div className="mt-4">
											<div className="grid grid-cols-3 gap-1">
												{images.map((image, index) => (
													<button
														type="button"
														onClick={() => {
															onSuccess({
																publicUrl:
																	image.src,
																s3Url: image.src,
																url: image.src,
															});
															onClose();
														}}
														key={index}
														className="relative w-full hover:border-2 hover:border-blue-600 h-[110px] flex"
													>
														<img
															src={image.src}
															alt={image.alt}
															className="object-cover  w-full h-full"
															// onClick={() =>
															// 	onSelect(image)
															// }
														/>
														{/* <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex justify-center items-center">
															<p className="text-white font-semibold">
																Click to select
															</p>
														</div> */}
													</button>
												))}
											</div>
										</div>
									)}
								</div>
								<div className="mt-5 sm:mt-6">
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
