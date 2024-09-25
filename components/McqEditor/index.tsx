import { CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import React from "react";
import { CommonInputProps } from "../../types";
import { classNames } from "@utils/index";
import useBuilderStore from "@store/builder";
import Input from "../BuilderComponents/Inputs/Input";
import RadioInput from "../BuilderComponents/Inputs/RadioInput";
import Checkbox from "../BuilderComponents/Inputs/Checkbox";
import toast from "react-hot-toast";

type RadioProps = {
	title?: string;
	questionIndex?: number | null;
	required?: boolean;
	options: string[];
	marks?: number;
	defaultValue?: string;
	answer: string[];
	image?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isPreview?: boolean;
} & CommonInputProps &
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;

const McqOptionsEditor = ({
	answer,
	id,
	options,
}: {
	answer: string[];
	id: string;
	options: string[];
}) => {
	const onAddOption = () => {
		setTimeout(() => {
			//
			const divElement = document.getElementById(`add-option-mcq-${id}`);
			divElement?.click();
		}, 100);
	};

	const { changeProperty, selectedInput } = useBuilderStore();

	const deleteOptionAtIndex = (index: number) => {
		if (selectedInput?.id != id) {
			return;
		}

		let newItems = [...options];
		let newAnswers = [...answer];

		if (newItems.length <= 2) {
			toast.error("Questions should have two options at least.");
			return;
		}

		const deletedOption = newItems[index];

		// Remove the deleted option from the newAnswers array
		newAnswers = newAnswers.filter((item) => item !== deletedOption);

		// Remove the option at the specified index
		newItems.splice(index, 1);

		// Ensure newAnswers has at least one item
		if (newAnswers.length === 0) {
			newAnswers.push(newItems[0]);
		}

		// Update the options property
		changeProperty({
			key: "options",
			value: newItems,
		});

		// Update the answer property
		changeProperty({
			key: "answer",
			value: newAnswers,
		});

		console.log(newItems);
	};

	const onToggleAnswer = (item: string, index?: number) => {
		let prevAnswers = answer ?? [];

		if (prevAnswers.includes(item)) {
			if (prevAnswers.length > 1) {
				prevAnswers = prevAnswers.filter((answer) => answer !== item);
			} else {
				toast.error("Questions should have one answer at least.");
			}
		} else {
			prevAnswers = [...prevAnswers, item];
		}

		changeProperty({
			key: "answer",
			value: prevAnswers,
		});
	};

	const onChangeAnswerOption = (
		newVal: string,
		index: number,
		item: string
	) => {
		const newItems = [...options];

		const prevOption = options.at(index);

		newItems[index] = newVal;
		changeProperty({
			key: "options",
			value: newItems,
		});

		if (prevOption) {
			const isAnswer = answer?.indexOf(prevOption);
			if (isAnswer !== -1) {
				const newAnswers = [...answer];
				newAnswers[isAnswer] = newVal;
				changeProperty({
					key: "answer",
					value: newAnswers,
				});
			}
		}
	};

	return (
		<div>
			<p className="text-sm mt-4 mb-1">Answers</p>
			{options?.map((item, index) => (
				<div key={index} className="flex items-center space-x-2 my-1">
					<input
						name={`option-${index}`}
						value={item}
						type="text"
						onChange={(e) => {
							onChangeAnswerOption(e.target.value, index, item);
						}}
						className={`input ${
							answer?.includes(item)
								? "!ring-green-500"
								: "ring-gray-300"
						}`}
						placeholder="Option"
					/>
					<button
						onClick={() => onToggleAnswer(item, index)}
						type="button"
						className={`bg-gray-500 bg-opacity-10 rounded flex items-center justify-center w-8 h-8 hover:bg-opacity-20 hover:bg-green-400 text-green-500 ${
							answer?.includes(item)
								? "!bg-opacity-50 !bg-green-500 !text-white"
								: ""
						}`}
					>
						<CheckIcon className="w-4 h-4" />
					</button>
					<button
						onClick={() => deleteOptionAtIndex(index)}
						type="button"
						className="bg-gray-500 bg-opacity-10 rounded flex items-center justify-center w-8 h-8 text-red-500"
					>
						<TrashIcon className="w-4 h-4" />
					</button>
				</div>
			))}
			<button
				type="button"
				onClick={onAddOption}
				className="button-secondary my-3 space-x-1"
			>
				<PlusIcon className="w-4 h-4" />
				<span>Add Option</span>
			</button>
		</div>
	);
};
const McqEditor: React.FC<RadioProps> = ({
	onChange,
	options,
	marks,
	answer,
	image,
	title,
	required,
	hideFieldLabel,
	defaultValue,
	theme,
	questionIndex,
	...props
}) => {
	const { changeProperty, selectedInput } = useBuilderStore();

	const onChangeOptionCheckbox = (checked: boolean, option: string) => {
		let selectedOptions: string[] = [];
		if (typeof props.value === "string") {
			selectedOptions = props.value.split(",");
		} else if (Array.isArray(props.value)) {
			selectedOptions = props.value;
		} else if (typeof props.value === "undefined") {
			selectedOptions = [];
		}

		if (checked) {
			selectedOptions.push(option as string);
		} else {
			selectedOptions = selectedOptions.filter(
				(option) => option !== option
			);
		}

		onChange({
			target: {
				value: selectedOptions as any,
			},
		} as any);

		// const selectedOptions = props.value
		// onChange({
		// 	target: {
		// 		value:
		// 	}
		// })
	};

	return (
		<div>
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
			{props.isPreview ? (
				<McqOptionsEditor
					answer={answer}
					options={options}
					id={props.id!}
				/>
			) : (
				<fieldset className="mt-1 mb-10">
					<legend className="sr-only">{title}</legend>

					<div className="space-y-1 mt-1 sm:flex flex-col">
						{answer.length === 1 ? (
							<RadioInput
								options={options}
								onChange={onChange}
								value={props.value}
								readOnly={props.readOnly}
								correctAnswer={answer}
							/>
						) : (
							<div>
								<p className="text-xs text-gray-500 mb-2 italic">
									Select all that apply
								</p>
								<div
									className="grid grid-cols-1 gap-y-2"
									style={{
										gridTemplateColumns: "max-content",
									}}
								>
									{options.map((option) => (
										<div
											key={option}
											className={`flex items-center border rounded-lg px-4 py-2 border-gray-300 shadow-sm max-w-[300px] ${
												answer?.includes(option) &&
												props.readOnly
													? "!border-green-500 !shadow-lg !shadow-green-600/20"
													: "!border-gray-300"
											}`}
										>
											<Checkbox
												title={option}
												isPreview={props.isPreview}
												readOnly={props.readOnly}
												onChange={(checked) =>
													onChangeOptionCheckbox(
														checked,
														option
													)
												}
												checked={(
													props.value as
														| string
														| string[]
												)?.includes(option)}
											/>
										</div>
									))}
								</div>
							</div>
						)}

						{/* {options.map((option) => (
							<div key={option} className="flex items-center">
								<input
									id={option}
									name={props.name}
									type="radio"
									onChange={onChange}
									value={option}
									checked={
										props.value
											? option === props.value
											: option === defaultValue
									}
									className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
								<label
									htmlFor={option}
									className={classNames(
										theme === "dark"
											? "text-gray-300"
											: "text-gray-700",
										"ml-3 block text-sm font-medium"
									)}
								>
									{option}
								</label>
							</div>
						))} */}
					</div>
				</fieldset>
			)}
		</div>
	);
};

export default McqEditor;
