import { InputTypeWithoutIcon } from "../../../../types";
import Icons from "../../../Icons";

const MapsEmbedBlock = ({
	component,
	type,
	theme,
	defaultValue,
	...props
}: InputTypeWithoutIcon & {
	theme?: string;
}) => {
	if (!defaultValue || defaultValue === "") {
		return (
			<div className="w-full h-64 bg-gray-200 border rounded flex items-center justify-center flex-col">
				<Icons.Maps width={32} height={32} />
				<p className="mt-2 mb-1">Google Maps Location Embed</p>
				<p className="text-gray-600 text-xs">
					Add your embed link from sidebar.
				</p>
			</div>
		);
	}

	return (
		<div className="my-2">
			<iframe
				className="w-full aspect-video"
				src={defaultValue}
				frameBorder={0}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen={(props as any).allowFullScreen || false}
			></iframe>

			{/* {isLoading ? (
				<div
					className={`my-2 w-full bg-gray-100 rounded aspect-video flex items-center justify-center`}
				>
					<Loading color="black" />
				</div>
			) : !imageData || !(imageData as any)?.data || imageLoadError ? (
				<div
					className={`my-2 w-full bg-gray-100 rounded aspect-video flex items-center justify-center`}
				>
					{(imageLoadError || !(imageData as any)?.data) && (
						<p>Failed to fetch image.</p>
					)}
				</div>
			) : (
				<>
					<img
						className={`my-2 w-full bg-gray-100 rounded `}
						src={(imageData as any)?.data}
						alt=""
						onError={(e) => {
							setimageLoadError(true);
						}}
					/>
				</>
			)} */}
		</div>
	);
};

export default MapsEmbedBlock;
