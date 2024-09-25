import React, { useEffect, useState } from "react";
import { classNames } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type CheckboxProps = {
	title: string;
	isPreview?: boolean;
	checked?: boolean;
	onChange: (checked: boolean) => void;
} & CommonInputProps;
const Checkbox: React.FC<CheckboxProps> = ({
	title,
	onChange,
	checked = false,
	isPreview,
	theme,
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
		<div className="relative flex items-start">
			<div className="flex h-5 items-center">
				<input
					checked={checked}
					// disabled={props.readOnly}
					onChange={(e) => {
						if (!props.readOnly) {
							onChange(e.target.checked);
						}
					}}
					id={title + randomNumber}
					name={title + randomNumber}
					type="checkbox"
					className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
			</div>
			<div className="ml-3 text-sm">
				<label
					contentEditable={isPreview}
					onBlur={(e) => {
						changeProperty?.({
							key: "label",
							value: e.currentTarget.textContent,
						});
					}}
					htmlFor={title + randomNumber}
					className={classNames(
						theme === "dark" ? "text-[#a1a1a1]" : "text-gray-900",
						"font-medium"
					)}
				>
					{title}
				</label>
			</div>
		</div>
	);
};

export default Checkbox;
