import React, { useEffect, useState } from "react";
import { classNames } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type RadioProps = {
	title?: string;
	required?: boolean;
	options: string[];

	defaultValue?: string;

	correctAnswer?: string[];

	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & CommonInputProps &
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
const RadioInput: React.FC<RadioProps> = ({
	onChange,
	options,
	title,
	required,
	hideFieldLabel,
	defaultValue,
	theme,
	correctAnswer,
	...props
}) => {
	const { changeProperty } = useBuilderStore();
	const generateRandomNumber = () => {
		// Generate a random 4-digit number
		return Math.floor(1000 + Math.random() * 9000);
	};
	const [randomNumber, setRandomNumber] = useState(generateRandomNumber());

	useEffect(() => {
		setRandomNumber(generateRandomNumber());
	}, []);
	return (
		<div>
			{!hideFieldLabel && (
				<label
					className={classNames(
						theme === "dark" ? "text-[#a1a1a1]" : "text-gray-900",
						"text-xs md:text-sm font-medium leading-6 flex propss-center space-x-1"
					)}
				>
					<span
						className=""
						contentEditable={props.readOnly}
						onBlur={(e) => {
							changeProperty?.({
								key: "label",
								value: e.currentTarget.textContent,
							});
						}}
					>
						{title}
					</span>
					{required && (
						<span className="text-red-500 text-base md:text-xl">
							*
						</span>
					)}
				</label>
			)}
			<fieldset className="mt-1">
				<legend className="sr-only">{title}</legend>
				<div
					className="grid grid-cols-1 gap-y-2"
					style={{
						gridTemplateColumns: "max-content",
					}}
				>
					{options.map((option) => (
						<div
							key={option}
							className={`flex items-center border rounded-lg px-4 py-2 border-gray-300 shadow-sm ${
								correctAnswer?.includes(option) &&
								props.readOnly
									? "!border-green-500 !shadow-lg !shadow-green-600/20"
									: "!border-gray-300"
							} ${
								option === props.value &&
								props.readOnly &&
								!correctAnswer?.includes(option)
									? "!border-red-500 !shadow-lg !shadow-red-600/20"
									: ""
							}`}
						>
							<input
								id={option + randomNumber}
								name={props.name}
								type="radio"
								onChange={props.readOnly ? () => {} : onChange}
								value={option}
								checked={
									props.value
										? option === props.value
										: option === defaultValue
								}
								className={classNames(
									"h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 hover:opacity-100 transition",
									(
										props.value
											? option === props.value
											: option === defaultValue
									)
										? "opacity-100"
										: "opacity-50"
								)}
							/>
							<label
								htmlFor={option + randomNumber}
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
					))}
				</div>
			</fieldset>
		</div>
	);
};

export default RadioInput;
