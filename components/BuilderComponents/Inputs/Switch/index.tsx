import React from "react";
import { classNames } from "@utils/index";
import Toggle from "../Toggle";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type SwitchProps = {
	title: string;
	checked?: boolean;
	onChange: (checked: boolean) => void;
} & CommonInputProps;
const Switch: React.FC<SwitchProps> = ({
	title,
	onChange,
	checked,
	theme,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	return (
		<div className="relative flex items-start justify-between">
			<div className="text-sm">
				<label
					contentEditable={props.readOnly}
					onBlur={(e) => {
						changeProperty?.({
							key: "label",
							value: e.currentTarget.textContent,
						});
					}}
					htmlFor={title}
					className={classNames(
						theme === "dark" ? "text-[#a1a1a1]" : "text-gray-900",
						"font-medium hover:bg-gray-200 transition"
					)}
				>
					{title}
				</label>
			</div>
			<div className="flex h-5 items-center">
				<Toggle
					enabled={checked ? true : false}
					onChangeState={onChange}
				/>
			</div>
		</div>
	);
};

export default Switch;
