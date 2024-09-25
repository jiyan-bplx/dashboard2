import { InputTypeWithoutIcon } from "../../../../types";
import { createUrlWithParams } from "@utils/index";
import Icons from "../../../Icons";

const getVideoIdFromString = (url?: string) => {
	// https://www.youtube.com/watch?v=videoId
	// https://www.youtube.com/embed/videoId
	// DQw4w9WgXcQ

	if (!url) {
		return "";
	}

	if (url.includes("youtube.com/watch?v=")) {
		const videoIdWithParams = url.split("youtube.com/watch?v=")[1];

		// Change the first occurence of & to ? to append more params
		if (videoIdWithParams.includes("&")) {
			const [videoId, ...params] = videoIdWithParams.split("&");
			return `${videoId}?${params.join("&")}`;
		}
		return videoIdWithParams;
	}

	if (url.includes("youtube.com/embed/")) {
		return url.split("youtube.com/embed/")[1];
	}

	return url;
};

const YoutubeEmbedBlock = ({
	component,
	type,
	theme,
	defaultValue,
	...props
}: InputTypeWithoutIcon & {
	theme?: string;
}) => {
	const videoId = getVideoIdFromString(defaultValue);
	if (!defaultValue || defaultValue === "") {
		return (
			<div className="w-full h-64 bg-gray-200 border rounded flex items-center justify-center flex-col">
				<Icons.Youtube width={32} height={32} />
				<p className="mt-2 mb-1">Youtube Video Placeholder</p>
				<p className="text-gray-600 text-xs">
					Add your video link from sidebar.
				</p>
			</div>
		);
	}

	const privacy_mode = (props as any).privacy_mode as boolean;

	return (
		<div className="my-2">
			<iframe
				className="w-full aspect-video"
				src={createUrlWithParams(
					`https://www.youtube${
						privacy_mode ? "-nocookie" : ""
					}.com/embed/${videoId}`,
					{
						// 0 means hide, 1 means show
						controls: (props as any).hideControls ? 0 : 1,
					},
					videoId?.includes("&") ? "&" : "?"
				)}
				title="YouTube video player"
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

export default YoutubeEmbedBlock;
