import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import React from "react";
import { classNames, formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";
import { useRouter } from "next/router";
import Input from "../Input";

type McqPictureChoiceInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	options?: { value: string; label: string }[];
	marks?: number;
	questionIndex?: number | null;
	title?: string;
	answer: string;
	image?: string;
	isPreview?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & CommonInputProps &
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
const McqPictureEditor: React.FC<McqPictureChoiceInputProps> = ({
	error,
	theme,
	label,
	hideFieldLabel,
	image,
	options,
	answer,
	questionIndex,
	marks,
	title,
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
	const onToggleAnswer = (item: string, index?: number) => {
		let prevAnswers = [];

		if (answer) {
			prevAnswers.push(item);
		}

		changeProperty({
			key: "answer",
			value: prevAnswers,
		});
	};
	return (
		<div>
			{!hideFieldLabel && (
				<label
					className={classNames(
						theme === "dark" ? "text-[#a1a1a1]" : "text-gray-900",
						"text-xs md:text-sm font-medium leading-6 propss-center space-x-1"
					)}
				>
					<div className="flex flex-col">
						{/* <span
						className=""
						contentEditable={props.readOnly}
						onBlur={(e) => {
							props.changeProperty?.({
								key: "label",
								value: e.currentTarget.textContent,
							});
						}}
					> */}
						<div
							className={`flex flex-row w-100 justify-between ${
								questionIndex == 0 ? "mt-10" : ""
							}`}
						>
							<span className="text-xs">
								Question {(questionIndex ?? 0) + 1} :
							</span>
							<span className="text-xs text-gray-500 italic">
								<span>{marks ?? 0}</span> point
								{marks === 1 ? "" : "s"}
							</span>
						</div>

						{props.isPreview ? (
							<Input
								onChange={(e) => {
									if (e.target.value) {
										changeProperty({
											key: "label",
											value: e.target.value,
										});
									}
								}}
								type="text"
								placeholder="Enter Your Question"
								id="text"
								value={title}
							/>
						) : (
							<span className="text-lg">{title}</span>
						)}
					</div>
				</label>
			)}
			{image ? (
				<div className="flex items-center my-5 justify-center w-full h-full">
					<img
						src={image}
						alt="Placeholder Image"
						className="h-84 max-w-sm object-contain rounded-lg"
					/>
				</div>
			) : (
				<></>
			)}
			<div className="flex items-start justify-start mt-2">
				<div className="grid grid-cols-2 gap-4">
					{options?.map((option, index) => (
						<div className="relative" key={index}>
							<button
								type="button"
								onClick={() => {
									if (props.readOnly) return;
									props.onChange?.({
										target: {
											// value: {
											// type: "picture_choice",
											// index: index + 1,
											// ...option,
											// },
											value: option.label,
										},
									} as any);
								}}
								key={index.toString()}
								className={`border flex items-center justify-center flex-col py-4 px-3 rounded border-gray-300 relative hover:shadow transition
								${
									answer?.includes(option.label)
										? props.isPreview
											? "!border-green-400 border-2 "
											: ""
										: ""
								}`}
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
										checked={props.value === option.label}
										onChange={(e) => {
											if (props.readOnly) return;
											if (e.target.checked) {
												props.onChange?.({
													target: {
														// value: {
														// 	type: "picture_choice",
														// 	index: index + 1,
														// 	...option,
														// },
														value: option.label,
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
							{props.isPreview ? (
								<button
									onClick={() =>
										onToggleAnswer(option.label, index)
									}
									type="button"
									className={`top-8 left-6 absolute z-100 bg-gray-200 bg-opacity-100 rounded flex items-center justify-center w-8 h-8  text-green-600 ${
										answer?.includes(option.label)
											? "!bg-opacity-100 !bg-green-500 !text-white"
											: ""
									}`}
								>
									<CheckIcon className="w-4 h-4" />
								</button>
							) : (
								<></>
							)}
						</div>
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

export default McqPictureEditor;
