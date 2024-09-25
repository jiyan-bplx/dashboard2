import React, { useState } from "react";
import { useQuery } from "react-query";
import { getS3ObjectUrl } from "@api/upload";

const ImageRendererFromS3 = ({
	formId,
	s3url: value,
}: {
	s3url: string;
	formId: string;
}) => {
	const [imageLoadError, setimageLoadError] = useState(false);

	const { data: imageData, isLoading: isLoadingFile } = useQuery(
		["image_layout", value, formId],
		() => {
			if (value.includes("aws.com")) {
				return getS3ObjectUrl({
					file_name: value!.substring(
						value!.indexOf("aws.com") + "aws.com".length + 1
					),
					form_id: parseInt(formId?.toString()),
				});
			} else {
				return {
					data: value,
					status: "success",
				} as any;
			}
		},
		{
			enabled: typeof value === "string" && typeof formId === "string",
		}
	);
	return (
		<div>
			{!imageData?.data || imageLoadError ? (
				<div
					className={`my-2 w-full bg-gray-100 rounded aspect-video flex items-center justify-center`}
				>
					{(imageLoadError || !imageData?.data) && (
						<p>Failed to fetch image.</p>
					)}
				</div>
			) : (
				<img
					className={`my-2 w-full bg-gray-100 rounded `}
					src={imageData?.data}
					alt=""
					onError={(e) => {
						setimageLoadError(true);
					}}
				/>
			)}
		</div>
	);
};

export default ImageRendererFromS3;
