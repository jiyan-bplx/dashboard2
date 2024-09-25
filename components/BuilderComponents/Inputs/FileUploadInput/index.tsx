import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, TrashIcon } from "@heroicons/react/24/outline";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useS3Upload from "@hooks/useS3Upload";
import { getFormById, getFormByPublicId } from "@api/forms";
import { generateS3SignedUrl, setObjectMetadata } from "@api/upload";
import {
	classNames,
	convertKBtoMB,
	formatBold,
	getExtensionFromFileName,
	isNumber,
} from "@utils/index";
import Loading from "@components/Loading";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";
export type FileWithId = {
	id: string;
	file: File;
	name?: string | null;
	size?: number | null;
	uploaded?: boolean | null;
	uploading?: boolean | null;
	provider: "byteforms";
	s3Url?: string | null;
	url?: string | null;
	publicUrl?: string | null;
};
type FileUploadInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	isPreview?: boolean;
} & CommonInputProps;

const FileUploadInput: React.FC<FileUploadInputProps> = ({
	error,
	theme,
	hideFieldLabel,
	label,
	isPreview,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const router = useRouter();

	const formId = (router.query.slug ?? router.query.formId) as string;

	const { data: formData } = useQuery(
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

	// drag state
	const [dragActive, setDragActive] = React.useState(false);

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

	const checkFileSize = (file: File) => {
		const sizeLimit = props.max ? parseInt(props.max?.toString()) : 10_000;
		if (file.size / 1000 > sizeLimit) {
			toast.error(
				"File size is too large, please upload a file less than " +
					convertKBtoMB(sizeLimit)
			);
			return null;
		}
		return file;
	};

	const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);

	const removeFileAtIndex = (index: number) => {
		const allFiles = [...selectedFiles];

		setSelectedFiles(allFiles.filter((_, i) => i !== index));
	};

	const methods = useFormContext();

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
		const toastId = toast.loading("Uploading file...");
		try {
			const fileNameWithIdAndPath = `${formData?.data.user_id}/${formId}/${file.name}`;
			const uploadUrl = await generateS3SignedUrl({
				file_name: fileNameWithIdAndPath,
				form_id: formData?.data.id,
			});

			console.log(uploadUrl);
			if (uploadUrl.data) {
				const res = await uploadFile(file.file, uploadUrl.data);

				toast.success("File uploaded", { id: toastId });

				return {
					...file,
					uploaded: true,
					uploading: false,
					url: res.url,
					s3Url: uploadUrl.data,
					publicUrl: uploadUrl.data,
				};
			} else {
				toast.error("Failed to upload file", { id: toastId });
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

	const uploadFiles = async (files: FileList) => {
		for (const file of files) {
			const fileId = nanoid();
			const fileItem: FileWithId = {
				id: fileId,
				file,
				uploaded: false,
				uploading: true,
				provider: "byteforms",
				name: fileId + "." + getExtensionFromFileName(file.name),
				size: file.size,
			};

			setSelectedFiles((prev) => [...prev, fileItem]);

			let res: FileWithId | null = await uploadToS3(fileItem);

			if (!res) return null;

			setSelectedFiles((prev) => {
				const tempFiles = [...prev];
				const index = tempFiles.findIndex((f) => f.id === fileItem.id);
				if (index !== -1) {
					tempFiles[index] = res!;

					return tempFiles;
				} else {
					return [...prev, res!];
				}
			});

			if (res?.url && formData?.data?.id) {
				await setObjectMetadata({
					// file_name: `${formData?.data.user_id}/${formId}/${fileItem.id}_${fileItem.file.name}`,
					// file_name: fileItem.name
					// 	? fileItem.name
					// 	: fileItem.id + "_" + fileItem.file.name,
					file_name: fileItem.name!,
					file_size: fileItem.file.size,
					form_id: formData?.data?.id,
					storage_provider: "bs3",
					storage_location: `${formData?.data.user_id}/${formId}/`,
					url: res.url ? res.url.toString().split("?")[0] : "",
				});
			}
		}
	};

	const handleFiles = (files: FileList) => {
		if (props.maxLength) {
			if (files.length > props.maxLength) {
				toast.error(
					"You can only upload a maximum of " +
						props.maxLength +
						" files"
				);
				return;
			}

			if (files.length + selectedFiles.length > props.maxLength) {
				toast.error(
					"You can only upload a maximum of " +
						props.maxLength +
						" files"
				);
				return;
			}
		}

		if (files.length > 0) {
			if (files.length === 1) {
				const file = checkFileSize(files[0]);
				if (!file) {
					console.error("[handleFiles] No file");
					return;
				}
			} else {
				for (const file of files) {
					const isValid = checkFileSize(file);
					if (!isValid) {
						console.error("[handleFiles] Invalid file size");
						return;
					}
				}
			}
			return uploadFiles(files);
		}
	};

	const inputRef = React.useRef<HTMLInputElement>(null);

	const onButtonClick = () => {
		inputRef?.current?.click();
	};

	useEffect(() => {
		if (props.id) {
			methods?.setValue(props.id, {
				type: "files",
				files: selectedFiles,
			});
		}
	}, [selectedFiles, methods?.setValue, props.id]);

	return (
		<div>
			{!hideFieldLabel &&
				((label && label?.length > 0) || props.required) && (
					<label
						className={classNames(
							theme === "dark"
								? "text-[#a1a1a1]"
								: "text-gray-900",
							"text-xs md:text-sm font-medium leading-6  flex propss-center space-x-1 -mb-1"
						)}
					>
						<span
							contentEditable={props.readOnly}
							onBlur={(e) => {
								changeProperty?.({
									key: "label",
									value: e.currentTarget.textContent,
								});
							}}
							dangerouslySetInnerHTML={{
								__html: formatBold(label),
							}}
						/>
						{props.required && (
							<span className="text-red-500 text-base md:text-xl">
								*
							</span>
						)}
					</label>
				)}
			<div className="mt-2">
				<button
					className={classNames(
						dragActive ? "shadow bg-white" : "bg-transparent",
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
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<div className="flex text-sm text-gray-600">
							<div className="relative cursor-pointer rounded-md  font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
								<span>
									Upload {props.multiple ? "files" : "a file"}
								</span>
								<input
									ref={inputRef}
									multiple={props.multiple}
									{...props}
									name={props.id}
									disabled={
										props.maxLength
											? props.maxLength ===
											  selectedFiles.length
											: props.disabled
									}
									value={undefined}
									onChange={handleChange}
									type="file"
									className="opacity-0 absolute max-w-full"
								/>
							</div>
							<p className="pl-1">or drag and drop</p>
						</div>
						<p className="text-xs text-gray-500">
							{props.accept} up to{" "}
							{convertKBtoMB(
								props.max
									? parseInt(props.max.toString())
									: 10_000
							)}
						</p>
						{props.multiple && (
							<p className="text-xs text-gray-500">
								Max {props.maxLength} files
							</p>
						)}
					</div>
				</button>
				<div className="mt-4 flex flex-col space-y-2">
					{selectedFiles?.map((file, index) => (
						<div
							key={index}
							className={classNames(
								file.uploading && !file.uploaded
									? "bg-gray-100 animate-pulse"
									: "bg-transparent",
								"flex items-center justify-between"
							)}
						>
							<div className="flex space-x-2 items-center">
								{file?.file.type?.includes("image") ? (
									<img
										className="w-6 h-6 rounded"
										src={URL.createObjectURL(file?.file)}
										alt={file?.file.name}
									/>
								) : (
									<div className="bg-gray-100 rounded w-6 h-6 flex items-center justify-center">
										<DocumentIcon className="w-4 h-4" />
									</div>
								)}
								<p className="text-sm">{file.file.name}</p>
							</div>
							<div className="flex space-x-2 items-center pr-2">
								{file.uploading && !file.uploaded ? (
									<span>
										{/* {progress} */}
										<Loading color="black" size={14} />
									</span>
								) : (
									<>
										{!file.uploading && !file.uploaded ? (
											<ExclamationTriangleIcon
												className="w-4 h-4 text-red-500"
												title="Failed to upload file"
											/>
										) : null}
										<TrashIcon
											onClick={() =>
												removeFileAtIndex(index)
											}
											className="w-4 h-4"
										/>
									</>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
			{error && (
				<p className="text-xs text-red-500 mt-2 text-right">{error}</p>
			)}
		</div>
	);
};

export default FileUploadInput;
