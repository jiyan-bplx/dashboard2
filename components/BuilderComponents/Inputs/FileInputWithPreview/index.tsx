import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { ChangeEventHandler, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useS3Upload from "@hooks/useS3Upload";
import { getFormById, getFormByPublicId } from "@api/forms";
import { generateS3SignedUrl, setObjectMetadata } from "@api/upload";
import { getExtensionFromFileName, isNumber } from "@utils/index";
import { FileWithId } from "../FileUploadInput";
import ImagePreviewModal from "../../../Modals/ImagePreviewModal";

function FileInputWithPreview({
	fileNamePrefix,
	disableMetadata,
	onSuccess,
	value,
	onRemoveFile,
	buttonTitle,
	enableCrop,
}: {
	enableCrop?: boolean;
	buttonTitle?: string;
	disableMetadata?: boolean;
	onRemoveFile?: () => void;
	value?: string;
	fileNamePrefix?: string;
	onSuccess: (file: FileWithId) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const openFileDialog = () => {
		inputRef.current?.click();
	};

	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	let handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		let file = event.target.files?.[0];
		if (file) {
			// Check if file size is greater than 10MB
			if (file.size > 10 * 1024 * 1024) {
				toast.error("File size should be less than 10MB");
				return;
			}
			setSelectedFile(file);
			if (file.type.includes("image")) {
				setIsPreviewOpen(true);
			}
		} else {
			toast.error("No file selected");
		}
	};

	const closePreviewModal = () => {
		setIsPreviewOpen(false);
	};

	const router = useRouter();

	const formId = (router.query.slug ?? router.query.formId) as string;

	const {
		data: formData,
		isLoading,
		error,
	} = useQuery(
		["forms", formId ?? router.query.template],
		() => {
			if (isNumber(formId)) {
				return getFormById(parseInt(formId));
			} else {
				return getFormByPublicId(formId);
			}
		},
		{
			enabled: router.query.template ? false : typeof formId === "string",
		}
	);
	const { progress, uploadFile, uploadedUrl } = useS3Upload();

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
				// file_name: formData.data.user_id + "/" + formId + "/" + file.id + "_" + file.file.name,
				form_id: formData?.data.id,
			});

			if (uploadUrl.data) {
				const res = await uploadFile(file.file, uploadUrl.data);

				toast.success("Image uploaded", { id: toastId });

				return {
					...file,
					uploaded: true,
					url: res.url.toString().split("?")[0],
					s3Url: uploadUrl.data.toString().split("?")[0],
					publicUrl: uploadUrl.data.toString().split("?")[0],
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
			const fileId = nanoid();
			const fileItem: FileWithId = {
				id: fileId,
				file,
				uploaded: false,
				uploading: true,
				provider: "byteforms",
				name: `${
					fileNamePrefix ?? "image"
				}_${fileId}.${getExtensionFromFileName(file.name)}`,
				size: file.size,
			};
			const res = await uploadToS3(fileItem);

			if (!res) {
				toast.error("Error uploading image");
				return null;
			}

			if (!disableMetadata) {
				if (res?.url && formData?.data?.id) {
					await setObjectMetadata({
						file_name: fileItem.name!,
						file_size: fileItem.file.size,
						form_id: formData?.data?.id,
						storage_provider: "bs3",
						storage_location: `${formData?.data.user_id}/${formId}/`,
						url: res.url ? res.url.toString().split("?")[0] : "",
					});
				}
			}

			closePreviewModal();
			onSuccess(res);
		} catch (error) {
			toast.error("Error uploading image");
			console.error(error);
		}
	};

	const [imageLoadError, setimageLoadError] = useState(false);

	return (
		<div>
			<input
				ref={inputRef}
				type="file"
				onChange={handleFileChange}
				className="hidden"
				accept="image/*"
			/>
			{value ? (
				<div>
					{isLoading || !value || imageLoadError ? (
						<div
							className={`my-2 w-full bg-gray-100 rounded aspect-video flex items-center justify-center`}
						>
							{(imageLoadError || !value) && (
								<p>Failed to fetch image.</p>
							)}
						</div>
					) : (
						<img
							className={`my-2 w-full bg-gray-100 rounded `}
							src={value}
							alt=""
							onError={(e) => {
								setimageLoadError(true);
							}}
						/>
					)}
					<button
						onClick={onRemoveFile}
						className="button-outlined space-x-2"
					>
						<XMarkIcon className="w-4 h-4" />
						<span>Remove file</span>
					</button>
				</div>
			) : (
				<button
					onClick={openFileDialog}
					className="button-secondary space-x-2"
				>
					<PhotoIcon className="w-4 h-4" />
					<span>{buttonTitle ?? "Upload image"}</span>
				</button>
			)}

			<ImagePreviewModal
				file={selectedFile}
				enableCrop={enableCrop}
				onUpload={onUpload}
				isOpen={
					isPreviewOpen &&
					selectedFile &&
					selectedFile?.type?.includes("image")
						? true
						: false
				}
				closeModal={closePreviewModal}
			/>
		</div>
	);
}

export default FileInputWithPreview;
