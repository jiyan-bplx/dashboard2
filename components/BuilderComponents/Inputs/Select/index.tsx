import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import { classNames, formatBold } from "@utils/index";
import Input from "../Input";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type SelectProps = {
	title?: string;
	required?: boolean;
	multiple?: boolean;
	options: string[];
	placeholder?: string;
	defaultValue?: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	id?: string;
	value?: string | number | readonly string[] | undefined;
	other_option?: boolean;
} & CommonInputProps;
const Select: React.FC<SelectProps> = ({
	onChange,
	options,
	title,
	hideFieldLabel,
	required,
	multiple,
	placeholder,
	defaultValue,
	id,
	theme,
	value,
	other_option,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const placeholderOrTitle = useMemo(() => {
		if (placeholder && placeholder.length > 0) return placeholder;
		if (title && title.length > 0) return title;
		return null;
	}, [placeholder, title]);

	const [showOther, setShowOther] = useState(false);

	useEffect(() => {
		// if value is not in options, show other
		if (value && !options.includes(value as string)) {
			setShowOther(true);
		} else {
			setShowOther(false);
		}
	}, [value, options]);

	const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === placeholderOrTitle) {
			onChange({ ...e, target: { ...e.target, value: null } } as any);
		} else {
			onChange(e);
		}
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
						className=""
						dangerouslySetInnerHTML={{
							__html: formatBold(title),
						}}
					/>
					{required && (
						<span className="text-red-500 text-base md:text-xl">
							*
						</span>
					)}
				</label>
			)}
			<div className="relative">
				<select
					id={title}
					required={required}
					multiple={multiple}
					// placeholder={placeholder}
					name={title}
					onChange={props.readOnly ? () => {} : onChangeHandler}
					value={
						value
							? options.includes(value.toString())
								? value
								: "other_option"
							: defaultValue
							? defaultValue
							: placeholderOrTitle ?? ""
					}
					className={classNames(
						theme === "dark"
							? "text-gray-200 bg-[#0a0a0a] border-zinc-700 ring-zinc-700"
							: "text-gray-900 bg-white border-gray-300 ring-gray-300",
						"mt-1 block w-full border-gray-300 py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none rounded-md border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm select-without-chevron",
						id && id.length > 0 ? `select-${id}` : ""
					)}
				>
					<>
						{placeholderOrTitle && (
							<option
								key={placeholderOrTitle}
								value={placeholderOrTitle}
								disabled={required}
							>
								{placeholderOrTitle}{" "}
								{!defaultValue ? "(None)" : ""}
							</option>
						)}
						{options?.map((opt, i) => (
							<option key={i} value={opt}>
								{opt}
							</option>
						))}
						{other_option && (
							<option value="other_option">Other</option>
						)}
					</>
				</select>
				<ChevronDownIcon className="w-3 h-3 absolute top-1/2 -translate-y-1/2 z-10 right-2" />
			</div>
			{showOther && other_option && (
				<Input
					placeholder="Type your answer here"
					value={value === "other_option" ? "" : value}
					onChange={onChange as any}
					autoFocus
				/>
			)}
		</div>
	);
};

export default Select;
