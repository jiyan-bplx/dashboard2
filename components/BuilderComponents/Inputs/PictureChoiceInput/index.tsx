import { PlusIcon } from "@heroicons/react/20/solid";
import React from "react";
import { classNames, formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";
import { useRouter } from "next/router";

type PictureChoiceInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	options?: { value: string; label: string }[];
} & CommonInputProps;
const PictureChoiceInput: React.FC<PictureChoiceInputProps> = ({
	error,
	theme,
	label,
	hideFieldLabel,
	options,
	...props
}) => {
	const { changeProperty } = useBuilderStore();
	const router = useRouter();

	const onAddOption = () => {
		setTimeout(() => {
			//
			const divElement = document.getElementById(
				`add-option-picture-choice-${props.id}`
			);
			divElement?.click();
		}, 100);
	};
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
			<div className="flex items-start justify-start mt-2">
				<div className="grid grid-cols-2 gap-4">
					{options?.map((option, index) => (
						<button
							type="button"
							onClick={() => {
								if (props.readOnly) return;
								props.onChange?.({
									target: {
										value: {
											type: "picture_choice",
											index: index + 1,
											...option,
										},
									},
								} as any);
							}}
							key={index.toString()}
							className="border flex items-center justify-center flex-col py-4 px-3 rounded border-gray-300 relative hover:shadow transition"
						>
							<img
								src={option.value}
								alt={option.label}
								className="aspect-square object-cover rounded "
							/>

							<div className="flex mt-2 self-start justify-start space-x-2">
								<input
									type="radio"
									name={props.id}
									checked={
										(props.value as any)?.value ===
										option.value
									}
									onChange={(e) => {
										if (props.readOnly) return;
										if (e.target.checked) {
											props.onChange?.({
												target: {
													value: {
														type: "picture_choice",
														index: index + 1,
														...option,
													},
												},
											} as any);
										}
									}}
								/>
								<p className=" text-sm text-gray-600">
									{option.label}
								</p>
							</div>
						</button>
					))}
					{props.readOnly && !router.query?.response && (
						<button
							type="button"
							onClick={onAddOption}
							className="border flex items-center justify-center flex-col py-4 px-3 rounded border-gray-300"
						>
							<div className=" bg-indigo-100 w-full aspect-square flex items-center justify-center">
								<PlusIcon className="w-8 h-8 text-indigo-600" />
							</div>
							<p className="mt-2 text-sm text-gray-600">
								Add option
							</p>
						</button>
					)}
					{/* {Array.from({
						length: props.maxLength ?? 5,
					}).map((_, ratingVal) => (
						<StarIcon
							onClick={() => {
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
					))} */}
				</div>
			</div>
		</div>
	);
};

export default PictureChoiceInput;
