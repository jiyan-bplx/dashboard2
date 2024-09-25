import React, { useState } from "react";
import { classNames, formatBold, isNumber } from "@utils/index";
import NumberInput from "../NumberInput";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type InputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	isPreview?: boolean;
	unique?: boolean;
} & CommonInputProps;
const Input: React.FC<InputProps> = (allProps) => {
	const { changeProperty } = useBuilderStore();

	if (allProps.type === "number") return <NumberInput {...allProps} />;
	const { error, theme, label, unique, isPreview, ...props } = allProps;

	return (
		<div className="">
			{!props.hideFieldLabel &&
				((label && label?.length > 0) || props.required) && (
					<label
						className={classNames(
							theme === "dark"
								? "text-[#a1a1a1]"
								: props.disabled
								? "text-gray-600"
								: "text-gray-900",
							"text-xs md:text-sm font-medium leading-6 flex propss-center space-x-1 ",
							props.required ? "-mb-2" : "-mb-1"
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
							<span className="text-red-500 text-base md:text-xl">
								*
							</span>
						)}
					</label>
				)}
			{props.type === "textarea" ? (
				<textarea
					multiple={props.multiple}
					accept={props.accept}
					about={props.about}
					{...(props as any)}
					value={props.value ?? ""}
					defaultValue={undefined}
					required={undefined}
					minLength={undefined}
					maxLength={undefined}
					className={classNames(
						theme === "dark"
							? "text-gray-200 bg-[#0a0a0a] border-zinc-700 ring-zinc-700"
							: props.disabled
							? "bg-[#ECEFF1] border-transparent ring-transparent text-[#607D8B]"
							: "text-gray-900 bg-white border-gray-300 ring-gray-300",
						"block w-full rounded-md border-0 py-2 px-3 md:px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 mt-2 shadow-sm"
					)}
					placeholder={props.placeholder}
				/>
			) : (
				<div>
					<div
						className={classNames(
							"flex",
							"mt-2"
							// (props.type === "number" &&
							// 	label &&
							// 	label?.length > 0) ||
							// 	props.required
							// 	? "mt-2"
							// 	: ""
						)}
					>
						<input
							type={props.type ?? "text"}
							multiple={props.multiple}
							accept={props.accept}
							about={props.about}
							{...props}
							onChange={(e) => {
								if (props.readOnly) {
									return;
								}
								if (props.type === "range") {
									if (!isNumber(e.target.value.toString())) {
										return;
									}

									props.onChange?.({
										...e,
										target: {
											...e.target,
											name: props.name as string,
											value: parseInt(
												e.target.value
											) as any,
											valueAsNumber: parseInt(
												e.target.value
											),
										},
									} as any);
								} else {
									props.onChange?.(e);
								}
							}}
							value={props.value ?? ""}
							defaultValue={undefined}
							required={undefined}
							min={
								props.min
									? isNumber(props.min?.toString())
										? parseInt(props.min?.toString())
										: [
												"date",
												"time",
												"datetime-local",
										  ].includes(props.type ?? "text")
										? props.min
										: undefined
									: undefined
							}
							max={
								props.max
									? isNumber(props.max?.toString())
										? parseInt(props.max?.toString())
										: [
												"date",
												"time",
												"datetime-local",
										  ].includes(props.type ?? "text")
										? props.max
										: undefined
									: undefined
							}
							minLength={undefined}
							maxLength={undefined}
							className={classNames(
								theme === "dark"
									? "text-gray-200 bg-[#0a0a0a] border-zinc-700 ring-zinc-700"
									: props.disabled
									? "bg-[#ECEFF1] border-transparent ring-transparent text-[#607D8B]"
									: "text-gray-900 bg-white border-gray-300 ring-gray-300",
								props.type === "number" ? "" : "rounded-md",
								`block w-full border-0 py-2 ${
									props.type === "range" ? "" : "px-3 md:px-4"
								} ring-1 ring-inset transform transition-transform duration-300 scale-100 focus:scale-y-110  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm`
							)}
							placeholder={props.placeholder}
						/>
					</div>
					{(props.type === "text" || props.type === "textarea") &&
						(typeof props.minLength !== "undefined" ||
							(typeof props.maxLength !== "undefined" &&
								(props.maxLength as any) !== "")) && (
							<p
								className={classNames(
									theme === "dark"
										? "text-gray-400"
										: "text-gray-500",
									"text-xs mt-2 text-right"
								)}
							>
								{props.minLength
									? `${props.minLength}`
									: "max "}
								{props.minLength && props.maxLength ? "/" : ""}
								{props.maxLength} characters
							</p>
						)}
					{props.type === "range" && (
						<div
							className={classNames(
								theme === "dark"
									? "text-gray-400"
									: "text-gray-500",
								"flex propss-center justify-between text-xs mt-1 "
							)}
						>
							<p>{props.min}</p>

							<p>{props.max}</p>
						</div>
					)}
				</div>
			)}
			{error && (
				<p className="text-xs text-red-500 mt-2 text-right">{error}</p>
			)}
		</div>
	);
};

export default Input;
