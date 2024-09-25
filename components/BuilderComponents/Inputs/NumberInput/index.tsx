import React from "react";
import { classNames, formatBold, isNumber } from "@utils/index";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import useBuilderStore from "@store/builder";

type InputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	theme?: "light" | "dark";
	label?: string;
	error?: string;
	unique?: boolean;
	hideFieldLabel?: boolean;
	isPreview?: boolean;
};
const NumberInput: React.FC<InputProps> = ({
	error,
	theme,
	label,
	unique,
	isPreview,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const incrementValue = () => {
		let value;

		if (typeof props.max !== "undefined") {
			console.log({
				max: props.max,
				value: props.value,
			});
			value = Math.min(
				(props.value ? parseInt(props.value.toString()) : 0) + 1,
				parseInt(props.max?.toString())
			);
		} else {
			value =
				(typeof props.value !== "undefined"
					? props.value.toString().length === 0
						? 0
						: parseInt(props.value.toString())
					: 0) + 1;
		}

		props.onChange?.({
			target: {
				name: props.name as string,
				value: value as any,
				valueAsNumber: value,
			},
		} as any);
	};

	const decrementValue = () => {
		let value;

		if (typeof props.min !== "undefined") {
			value = Math.max(
				(props.value ? parseInt(props.value.toString()) : 0) - 1,
				parseInt(props.min?.toString())
			);
		} else {
			value =
				(typeof props.value !== "undefined"
					? props.value.toString().length === 0
						? 0
						: parseInt(props.value.toString())
					: 0) - 1;
		}

		props.onChange?.({
			target: {
				name: props.name as string,
				value: value as any,
				valueAsNumber: value,
			},
		} as any);
	};
	return (
		<div className="">
			{!props.hideFieldLabel &&
				((label && label?.length > 0) || props.required) && (
					<label
						className={classNames(
							theme === "dark"
								? "text-[#a1a1a1]"
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
			<div>
				<div className={classNames("flex", "mt-2")}>
					<button
						onClick={decrementValue}
						type="button"
						className={classNames(
							theme === "dark"
								? "text-gray-200 bg-[#0a0a0a] hover:bg-gray-900 border-zinc-700"
								: "text-gray-900 bg-white hover:bg-gray-100 border-gray-300",
							"relative ml-px inline-flex items-center space-x-2 rounded-l-md border border-r-0 px-2 py-2 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						)}
						disabled={props.readOnly}
					>
						<MinusIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</button>

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
							console.log(e.target.value);
							if (e.target.value.toString().length === 0) {
								props.onChange?.({
									...e,
									target: {
										...e.target,
										name: props.name as string,
										value: undefined,
										valueAsNumber: undefined,
									},
								} as any);
								return;
							}
							if (!isNumber(e.target.value.toString())) {
								return;
							}

							let valAsNumber = parseInt(e.target.value);

							if (
								typeof props.min !== "undefined" &&
								valAsNumber < parseInt(props.min.toString())
							) {
								valAsNumber = parseInt(props.min.toString());
							}

							if (
								typeof props.max !== "undefined" &&
								valAsNumber > parseInt(props.max.toString())
							) {
								valAsNumber = parseInt(props.max.toString());
							}

							props.onChange?.({
								...e,
								target: {
									...e.target,
									name: props.name as string,
									value: valAsNumber,
									valueAsNumber: valAsNumber,
								},
							} as any);
						}}
						value={props.value ?? ""}
						defaultValue={undefined}
						required={undefined}
						min={
							typeof props.min !== "undefined"
								? isNumber(props.min?.toString())
									? parseInt(props.min?.toString())
									: undefined
								: undefined
						}
						max={
							typeof props.max !== "undefined"
								? isNumber(props.max?.toString())
									? parseInt(props.max?.toString())
									: undefined
								: undefined
						}
						minLength={undefined}
						maxLength={undefined}
						className={classNames(
							theme === "dark"
								? "text-gray-200 bg-[#0a0a0a] border-zinc-700 ring-zinc-700"
								: "text-gray-900 bg-white border-gray-300 ring-gray-300",
							`block w-full border-r-0 border-l-0 rounded-none py-2 ${
								props.type === "range" ? "" : "px-3 md:px-4"
							} ring-1 ring-inset transform transition-transform duration-300 scale-100 focus:scale-y-110  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm`
						)}
						placeholder={props.placeholder}
					/>
					<button
						onClick={incrementValue}
						type="button"
						className={classNames(
							theme === "dark"
								? "text-gray-200 bg-[#0a0a0a] hover:bg-gray-900 border-zinc-700"
								: "text-gray-900 bg-white hover:bg-gray-100 border-gray-300",
							"relative -ml-px inline-flex items-center space-x-2 rounded-r-md border  px-2 py-2 text-sm font-medium text-gray-700  focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						)}
						disabled={props.readOnly}
					>
						<PlusIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</button>
				</div>
			</div>
			{error && (
				<p className="text-xs text-red-500 mt-2 text-right">{error}</p>
			)}
		</div>
	);
};

export default NumberInput;
