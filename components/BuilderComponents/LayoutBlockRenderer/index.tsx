import useBuilderStore from "@store/builder";
import { CommonInputProps, InputTypeWithoutIcon } from "../../../types";
import { classNames } from "@utils/index";
import LayoutImageBlock from "./LayoutImageBlock";
import MapsEmbedBlock from "./MapsEmbedBlock";
import YoutubeEmbedBlock from "./YoutubeEmbedBlock";
const LayoutBlockRenderer = (
	props: InputTypeWithoutIcon & Pick<CommonInputProps, "theme">
) => {
	const { changeProperty } = useBuilderStore();

	const { type, theme, defaultValue } = props;

	if (type === "page_title") {
		return (
			<div className="my-2 ">
				<p
					contentEditable={props.readOnly}
					onBlur={(e) => {
						changeProperty?.({
							key: "defaultValue",
							value: e.currentTarget.textContent,
						});
					}}
					className={classNames(
						theme === "dark" ? "text-gray-100" : "text-gray-600",
						"my-2",
						theme === "dark" ? "text-gray-200 " : "text-gray-900",
						"text-xl md:text-3xl font-medium leading-6 w-full",
						(props as any).left_aligned
							? "text-left"
							: "text-center"
					)}
				>
					{defaultValue}
				</p>
			</div>
		);
	}

	if (type === "divider") {
		return <div className="my-2 border-t border-gray-300"></div>;
	}

	if (type === "text") {
		return (
			<p
				contentEditable={props.readOnly}
				onBlur={(e) => {
					changeProperty?.({
						key: "defaultValue",
						value: e.currentTarget.textContent,
					});
				}}
				className={classNames(
					theme === "dark" ? "text-gray-100" : "text-gray-600",
					"my-2"
				)}
			>
				{defaultValue}
			</p>
		);
	}

	if (type === "image") {
		return <LayoutImageBlock {...props} />;
	}

	if (type === "youtube") {
		return <YoutubeEmbedBlock {...props} />;
	}

	if (type === "gmaps") {
		return <MapsEmbedBlock {...props} />;
	}

	return null;
};

export default LayoutBlockRenderer;
