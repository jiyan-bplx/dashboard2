import { StarIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { classNames, formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type RatingInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> &
	CommonInputProps;
const RatingInput: React.FC<RatingInputProps> = ({
	error,
	theme,
	label,
	hideFieldLabel,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const [rating, setRating] = useState(
		() =>
			(props.maxLength ?? 5) -
				(props.value
					? parseInt(props.value?.toString())
					: parseInt(props.defaultValue?.toString() ?? "2")) ?? 2
	);

	return (
		<div>
			{!hideFieldLabel && (
				<label
					className={classNames(
						theme === "dark" ? "text-[#a1a1a1]" : "text-gray-900",
						"text-xs md:text-sm font-medium leading-6  flex propss-center space-x-1"
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
						<span className="text-red-500 text-xl">*</span>
					)}
				</label>
			)}
			<div className="flex items-start justify-start">
				<div className="flex items-center flex-row-reverse">
					{Array.from({
						length: props.maxLength ?? 5,
					}).map((_, ratingVal) => (
						<StarIcon
							onClick={() => {
								if (props.readOnly) return;
								setRating(ratingVal);
								props.onChange?.({
									target: {
										value:
											(props.maxLength ?? 5) - ratingVal,
									},
								} as any);
							}}
							key={ratingVal}
							className={`${
								(rating ?? 0) <= ratingVal
									? "text-yellow-400"
									: "text-gray-400"
							} w-6 h-6 flex-shrink-0 peer-hover:text-yellow-400 hover:text-yellow-400 peer`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default RatingInput;
