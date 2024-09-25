import { useRouter } from "next/router";
import { useState } from "react";
import { InputTypeWithoutIcon } from "../../../../types";

const LayoutImageBlock = ({
	component,
	type,
	theme,
	defaultValue,
}: InputTypeWithoutIcon & {
	theme?: string;
}) => {
	const router = useRouter();

	const [imageLoadError, setimageLoadError] = useState(false);

	if (!defaultValue || defaultValue === "") {
		return (
			<div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center flex-col">
				<p className="mb-1">Image Placeholder</p>
				<p className="text-gray-600 text-xs text-center">
					Add your image link from sidebar.
				</p>
			</div>
		);
	}

	return (
		<>
			{imageLoadError ? (
				<div
					className={`my-2 w-full bg-gray-100 rounded aspect-video flex items-center justify-center`}
				>
					{(imageLoadError || !defaultValue) && (
						<p>Failed to fetch image.</p>
					)}
				</div>
			) : (
				<>
					<img
						className={`my-2 w-full bg-gray-100 rounded `}
						src={defaultValue}
						alt=""
						onError={(e) => {
							setimageLoadError(true);
						}}
					/>
				</>
			)}
		</>
	);
};

export default LayoutImageBlock;
