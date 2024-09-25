import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CountryCodesPhoneNo } from "../../../../data/CountryCodesPhone";
import { classNames, formatBold } from "@utils/index";
import { InputTypes } from "../../../../data/Inputs";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type InputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	unique?: boolean;
	isPreview?: boolean;
	includeCountryCode?: boolean;
	extra_params?: (typeof InputTypes)[number]["extra_params"];
} & CommonInputProps;

const TelephoneInputRenderer = ({
	props,
	theme,
	label,
	field,
	AllowedCountryCodes,
}: {
	props: InputProps;
	AllowedCountryCodes: typeof CountryCodesPhoneNo;
	field: {
		value?: string;
	};
} & CommonInputProps) => {
	return (
		<div className="h-full pb-1 md:pb-0">
			<Listbox
				value={props.value}
				onChange={(val) => {
					props.onChange?.({
						target: {
							name: props.name as string,
							value: {
								...(props.value as any),
								country_code: val,
							},
						},
					} as any);
				}}
			>
				<div className="relative mt-1 h-full pb-1 md:pb-0">
					<Listbox.Button
						className={classNames(
							theme === "dark"
								? "text-gray-200 bg-[#0a0a0a] border-zinc-700"
								: "text-gray-900 bg-white border-gray-300",
							(label && label?.length > 0) || props.required
								? "mt-2"
								: "",
							"rounded-l-md",
							`relative pl-3 md:pl-4 block w-full py-1.5 border border-r-0  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm pr-8 h-full md:h-auto`
						)}
					>
						<span className="block truncate">
							{(props.value as any)?.country_code ?? field.value}
						</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronDownIcon
								className="h-4 w-4 text-gray-400"
								aria-hidden="true"
							/>
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute mt-1 max-h-60 w-96 flex-grow overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
							{AllowedCountryCodes.map((country, personIdx) => (
								<Listbox.Option
									key={personIdx}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active
												? "bg-amber-100 text-amber-900"
												: "text-gray-900"
										}`
									}
									value={country.dial_code}
								>
									{({ selected }) => (
										<>
											<span
												className={`block ${
													selected
														? "font-medium"
														: "font-normal"
												}`}
											>
												{country.name} {country.flag} (
												{country.dial_code})
											</span>
											{selected ? (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
													<CheckIcon
														className="h-5 w-5"
														aria-hidden="true"
													/>
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};

const TelephoneInput: React.FC<InputProps> = ({
	error,
	theme,
	label,
	unique,
	includeCountryCode,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const allowedCodes = (props as any)?.["allowed_country_codes"] as any;
	const methods = useFormContext();
	const AllowedCountryCodes = useMemo(
		() =>
			CountryCodesPhoneNo?.filter((item) => {
				if (allowedCodes && allowedCodes?.length > 0) {
					const codesSplit = allowedCodes
						.split(",")
						?.map((e: string) => e.trim());
					if (codesSplit?.includes(item.dial_code)) {
						return true;
					} else {
						return false;
					}
				}
				return true;
			}),
		[allowedCodes]
	);
	return (
		<>
			{((label && label?.length > 0) || props.required) && (
				<label
					className={classNames(
						theme === "dark" ? "text-[#a1a1a1]" : "text-gray-900",
						"text-xs md:text-sm font-medium leading-6  flex propss-center space-x-1 -mb-1"
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
				<div
					className={classNames(
						"flex",
						(props.type === "number" &&
							label &&
							label?.length > 0) ||
							props.required
							? "mt-2"
							: ""
					)}
				>
					{includeCountryCode && (
						<div>
							{props.isPreview ? (
								<TelephoneInputRenderer
									AllowedCountryCodes={AllowedCountryCodes}
									field={{
										value:
											AllowedCountryCodes?.find(
												(e) => e.code === "US"
											)?.dial_code ??
											AllowedCountryCodes?.at(0)
												?.dial_code,
									}}
									label={label}
									props={props}
									theme={theme}
								/>
							) : (
								<Controller
									control={methods?.control}
									name={`${props.id}.country_code`}
									defaultValue={
										AllowedCountryCodes?.find(
											(e) => e.code === "US"
										)?.dial_code ??
										AllowedCountryCodes?.at(0)?.dial_code
									}
									render={({ field }) => (
										<TelephoneInputRenderer
											AllowedCountryCodes={
												AllowedCountryCodes
											}
											field={field}
											label={label}
											props={props}
											theme={theme}
										/>
									)}
								/>
							)}
						</div>
					)}

					<input
						type={props.type ?? "text"}
						multiple={props.multiple}
						accept={props.accept}
						about={props.about}
						{...props}
						onChange={(e) => {
							props.onChange?.({
								...e,
								target: {
									...e.target,
									name: props.name as string,
									value: {
										country_code: (props.value as any)
											?.country_code
											? (props.value as any)?.country_code
											: includeCountryCode
											? "+1"
											: undefined,
										phone_number: e.target.value,
									},
								},
							} as any);
						}}
						value={(props.value as any)?.phone_number ?? ""}
						defaultValue={undefined}
						required={undefined}
						minLength={props.minLength}
						maxLength={props.maxLength}
						className={classNames(
							theme === "dark"
								? "text-gray-200 bg-[#0a0a0a] border-zinc-700 "
								: "text-gray-900 bg-white border-gray-300 ",
							props.type === "number"
								? " "
								: (label && label?.length > 0) || props.required
								? "mt-2"
								: "",
							includeCountryCode
								? "rounded-r-md rounded-l-none"
								: "rounded-md",
							`block w-full py-1.5 ${
								props.type === "range" ? "" : "px-3 md:px-4"
							} border  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm`
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
							{props.minLength ? `${props.minLength}` : "max "}
							{props.minLength && props.maxLength ? "/" : ""}
							{props.maxLength} characters
						</p>
					)}
			</div>
			{error && (
				<p className="text-xs text-red-500 mt-2 text-right">{error}</p>
			)}
		</>
	);
};

export default TelephoneInput;
