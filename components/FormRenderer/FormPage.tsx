// import { RevealList, RevealWrapper } from "next-reveal";
import InputRenderer from "@components/BuilderComponents/InputRenderer";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	Controller,
	FieldValues,
	FormProvider,
	UseFormReturn,
} from "react-hook-form";
import { LoaderIcon } from "react-hot-toast";
import { FormRendererProps } from ".";
import { PageSettings } from "@api/forms/requests";
import { FormItem } from "@api/forms/responses";
import { classNames } from "@utils/index";
import BottomBranding from "./BottomBranding";
const RevealList = dynamic(() =>
	import("next-reveal").then((mod) => mod.RevealList)
);

const RevealListWrapper = ({
	children,
	disableReveal,
	interval,
	delay,
	className,
	...props
}: {
	disableReveal?: boolean;
	children: React.ReactNode;
	interval: number;
	delay?: number;
	className?: string;
}) => {
	if (disableReveal) {
		return <>{children}</>;
	}

	return (
		<RevealList
			className={className}
			delay={delay}
			interval={interval}
			{...props}
		>
			{children}
		</RevealList>
	);
};

const FormPage = ({
	disableReveal,
	index,
	options,
	form,
	page,
	formMethods,
	formPages,
	goToNextPage,
	goToPreviousPage,
	onSubmitForm,
	currentPageSettings,
	readOnly,
}: // pageLayout,
{
	disableReveal?: boolean;
	readOnly?: boolean;
	currentPageSettings: PageSettings | undefined;
	goToPreviousPage: (currPageIndex: number) => void;
	goToNextPage: (currPageIndex: number) => void;
	onSubmitForm: (data: any) => void;
	page: number;
	formPages: number[];
	formMethods: UseFormReturn<FieldValues, any, undefined>;
	options: FormRendererProps["options"];
	index: number;
	form: FormItem & {
		inputs: FormItem["body"];
	};
}) => {
	const { handleSubmit, control } = formMethods;
	const targetRef = useRef<HTMLDivElement>(null); // Specify the type of targetRef

	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	const getQuestionIndex = (item: { id: string }) => {
		return form.inputs
			?.filter((input) => input.component === "question")
			.findIndex((e) => e.id === item.id);
	};

	useEffect(() => {
		const removeClass = () => {
			const divElement = document.getElementById("main-renderer");
			if (divElement) {
				divElement.classList.remove("flex-col");
			}
		};

		if (
			form.options?.page_behaviour === "one_page" &&
			(currentPageSettings?.page_layout == "right-image" ||
				currentPageSettings?.page_layout == "left-image")
		) {
			removeClass();
		} // Call removeClass when component mounts

		// Optionally, you can clean up by removing the class when the component unmounts
		return () => {
			const divElement = document.getElementById("main-renderer");
			if (divElement) {
				divElement.classList.add("flex-col");
			}
		};
	}, []);

	const updateDimensions = () => {
		if (targetRef.current) {
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight,
			});
		}
	};
	useLayoutEffect(() => {
		updateDimensions(); // Update dimensions initially
		window.addEventListener("resize", updateDimensions); // Listen for resize event

		return () => {
			window.removeEventListener("resize", updateDimensions); // Cleanup on component unmount
		};
	}, []);

	return (
		<div
			ref={targetRef}
			className={classNames(
				form.options?.page_behaviour === "one_page"
					? currentPageSettings?.page_layout == "left-image" ||
					  currentPageSettings?.page_layout == "right-image"
						? "form-layout-2 form-layout-right flex  flex-col w-full max-h-[100vh] overflow-hidden"
						: ""
					: "",
				"  "
			)}
		>
			<div
				className={classNames(
					form.options?.page_behaviour === "one_page"
						? currentPageSettings?.page_layout == "right-image" ||
						  currentPageSettings?.page_layout == "left-image"
							? dimensions.width / dimensions.height > 1.1
								? "w-[60%] "
								: " w-full gg"
							: " w-full"
						: "hidden",
					form.options?.theme === "dark"
						? "dark:bg-gray-700"
						: "bg-gray-200",

					currentPageSettings?.page_layout == "left-image"
						? "self-end"
						: "",
					" bg-gray-200 rounded-full h-1.5 "
				)}
			>
				<div
					className="bg-blue-600 h-1.5  rounded-full dark:bg-blue-500"
					style={{
						width:
							((index + 1) /
								formPages?.filter((item) => item !== null)
									?.length) *
								100 +
							"%",
					}}
				></div>
			</div>
			{form.options?.page_behaviour === "one_page" ? (
				<div
					className={classNames(
						dimensions.width / dimensions.height < 1.1
							? ""
							: " hidden ",
						currentPageSettings?.page_layout == "left-image" ||
							currentPageSettings?.page_layout == "right-image"
							? ""
							: "hidden",
						" h-[280px] block  overflow-scroll w-full top-0 flex-shrink-0"
					)}
				>
					<div className="relative w-full h-full">
						<div
							className="absolute inset-0 bg-cover bg-no-repeat bg-center"
							style={{
								backgroundImage:
									currentPageSettings?.cover_image
										? `url('${currentPageSettings.cover_image}')`
										: `url('/default-cover.jpg')`,
							}}
						/>
						{/* Optional: Add overlay or content on top of the image */}
						<div className="absolute inset-0 flex justify-center items-center">
							{/* Your overlay or content goes here */}
						</div>
					</div>
				</div>
			) : (
				<></>
			)}

			<div
				className={classNames(
					form.options?.page_behaviour === "one_page" &&
						(currentPageSettings?.page_layout == "left-image" ||
							currentPageSettings?.page_layout == "right-image")
						? dimensions.width / dimensions.height > 1.1
							? currentPageSettings?.page_layout == "left-image"
								? "self-end w-[60%] h-full flex overflow-y-scroll"
								: "w-[60%] h-full flex overflow-y-scroll"
							: " "
						: " w-full pb-10",
					"",
					"main-form-container  relative  pt-[10px]"
				)}
			>
				<div
					id={`form-page-index-${index}`}
					className={classNames(
						options?.transparentBackground
							? "bg-transparent"
							: form.options?.theme === "dark"
							? "bg-[#111] border-zinc-800"
							: "bg-white",
						form.options?.form_width === "centered"
							? " max-w-lg md:max-w-2xl xl:max-w-3xl"
							: "max-w-full",

						options?.hideBorders ? "" : "border border-t border-b",
						`rounded py-8 my-auto  mx-auto self-center  form-container`
					)}
					style={{}}
				>
					<RevealListWrapper
						disableReveal={disableReveal}
						key={page.toString()}
						interval={100}
						delay={100}
					>
						{index !== 0 ? (
							<button
								type="button"
								onClick={() => goToPreviousPage(index)}
								className="w-full flex items-center mb-5 mx-5 sm:mx-0 px-5 py-2 text-lg text-gray-500  gap-x-2 "
							>
								<svg
									className="w-5 h-5 rtl:rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
									/>
								</svg>
							</button>
						) : (
							<></>
						)}
						{index === 0 || typeof page === "undefined" ? (
							options?.hideTitle ? (
								<></>
							) : (
								<p
									className={classNames(
										form.options?.theme === "dark"
											? "text-gray-100"
											: "text-gray-900",
										"text-xl md:text-3xl font-medium leading-6 mt-10  text-center mb-4 mx-8 px-2"
									)}
									style={{
										overflowWrap: "break-word",
									}}
								>
									{form.name && form.name?.length > 0
										? form.name
										: "My awesome form"}
								</p>
							)
						) : (
							<></>
						)}
					</RevealListWrapper>

					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmitForm)}>
							<RevealListWrapper
								interval={40}
								delay={500}
								disableReveal={disableReveal}
								className="flex flex-wrap space-y-2"
							>
								<AnimatePresence>
									{form.inputs
										?.map((item) => ({
											...item,
											page: item.page ?? 1,
										}))
										?.filter((item) => item.page === page)
										.map((item, index) => (
											<motion.div
												className={classNames(
													form.options?.theme ===
														"dark"
														? "text-gray-50"
														: "text-gray-900",
													item.width === "half"
														? "w-1/2 px-6"
														: "w-full px-6 ",
													item.display === false
														? "pt-0 !-mt-3"
														: "pt-3 group"
												)}
												key={item.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												transition={{
													duration: 0.5,
													delay: index * 0.1,
												}}
											>
												{item.component === "layout" ? (
													<InputRenderer
														key={item.id}
														input={item}
														value={
															item.defaultValue
														}
													/>
												) : (
													<Controller
														name={item.id}
														control={control}
														defaultValue={
															item.defaultValue
														}
														rules={{
															validate: (val) => {
																if (
																	item.type ===
																	"tel"
																) {
																	if (
																		!val ||
																		!val.phone_number
																	) {
																		return item.required
																			? "This field is required"
																			: undefined;
																	}
																	return (
																		/^\d+$/.test(
																			val.phone_number
																		) ||
																		"Please enter a valid phone number"
																	);
																}

																if (
																	item.type ===
																	"number"
																) {
																	if (
																		typeof val ===
																			"undefined" ||
																		val.toString()
																			.length ===
																			0
																	) {
																		return item.required
																			? "This field is required"
																			: undefined;
																	}

																	if (
																		typeof val !==
																		"number"
																	) {
																		return "Please enter a valid number";
																	}
																	return (
																		/^-?\d+$/.test(
																			val?.toString()
																		) ||
																		"Please enter a valid number"
																	);
																}
																if (
																	item.type ===
																	"email"
																) {
																	if (
																		!val ||
																		(
																			val as string
																		)
																			.length ===
																			0
																	) {
																		return item.required
																			? "This field is required"
																			: undefined;
																	}

																	return (
																		/^\S+@\S+\.\S+$/.test(
																			val
																		) ||
																		"Please enter a valid email address"
																	);
																}

																return undefined;
															},
															min: item.min
																? {
																		value: item.min,
																		message: `Minimum value is ${item.min}`,
																  }
																: undefined,
															max: item.max
																? {
																		value: item.max,
																		message: `Maximum value is ${item.max}`,
																  }
																: undefined,
															required:
																item.required
																	? `This field is required`
																	: false,
															minLength:
																item.minLength
																	? {
																			value: item.minLength,
																			message: `Minimum length is ${item.minLength}`,
																	  }
																	: undefined,
															maxLength:
																item.maxLength
																	? {
																			value: item.maxLength,
																			message: `Maximum length is ${item.maxLength}`,
																	  }
																	: undefined,
														}}
														render={({
															field,
															fieldState,
														}) => (
															<div className="">
																<InputRenderer
																	questionIndex={
																		item.component ===
																		"question"
																			? getQuestionIndex(
																					item
																			  )
																			: null
																	}
																	input={{
																		...item,
																		readOnly,
																	}}
																	onBlur={
																		field.onBlur
																	}
																	onChange={
																		field.onChange
																	}
																	value={
																		field.value
																	}
																/>
																{item.display !==
																	false &&
																	item
																		.instructions
																		?.length >
																		0 && (
																		<div
																			className={classNames(
																				"mt-3 text-xs text-gray-500"
																			)}
																		>
																			{
																				item.instructions
																			}
																		</div>
																	)}
																{fieldState.error && (
																	<p className="text-xs text-red-500 mt-2">
																		{
																			fieldState
																				.error
																				.message
																		}
																	</p>
																)}
															</div>
														)}
													/>
												)}
											</motion.div>
										))}

									{typeof page === "undefined" ||
									formPages?.filter((item) => item !== null)
										?.length -
										1 ===
										index ? (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{
												duration: 0.5,
												delay:
													(form.inputs?.length || 0) *
													0.1,
											}}
											className="self-center flex space-x-2 justify-center pt-8 w-full"
										>
											<button
												type="submit"
												className={`button-primary space-x-2 flex items-center`}
											>
												{formMethods.formState
													.isSubmitting && (
													<LoaderIcon />
												)}
												<span>
													{form.options
														?.submit_button_text &&
													form.options
														?.submit_button_text
														?.length !== 0
														? form.options
																?.submit_button_text
														: "Submit"}
												</span>
											</button>
										</motion.div>
									) : form.options?.page_behaviour ===
									  "one_page" ? (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{
												duration: 0.5,
												delay:
													(form.inputs?.length || 0) *
													0.1,
											}}
											className="space-x-2 next-btn w-full flex justify-center pt-12"
										>
											{/* {index !== 0 && (
											<button
												onClick={() =>
													goToPreviousPage(index)
												}
												type="button"
												className={`button-secondary space-x-2 flex items-center`}
											>
												{formMethods.formState
													.isSubmitting && (
													<LoaderIcon />
												)}
												<span>Previous page</span>
											</button>
										)} */}
											{currentPageSettings?.page_type ==
											"cover" ? (
												<button
													onClick={() =>
														goToNextPage(index)
													}
													type="button"
													className={`py-4 mb-8 mx-auto button-primary space-x-2 flex items-center`}
												>
													<span className="text-xl px-4">
														Start
													</span>
												</button>
											) : (
												<button
													onClick={() =>
														goToNextPage(index)
													}
													type="button"
													className={`py-4 mx-6 button-primary space-x-2 flex items-center`}
												>
													<span>Next →</span>
												</button>
											)}
										</motion.div>
									) : (
										<></>
									)}
								</AnimatePresence>
							</RevealListWrapper>
						</form>
						{form?.options?.remove_branding === true ? (
							<></>
						) : (
							<BottomBranding theme={form?.options?.theme} />
						)}
						{formPages?.length === 1 ||
						currentPageSettings?.page_type == "cover" ? (
							<></>
						) : (
							typeof page === "number" && (
								<div className="text-xs text-center mt-4 text-gray-500">
									Page {index + 1} of{" "}
									{
										formPages?.filter(
											(item) => item !== null
										)?.length
									}
								</div>
							)
						)}
					</FormProvider>
				</div>
			</div>
			{form.options?.page_behaviour === "one_page" ? (
				<div
					className={classNames(
						form.options?.page_behaviour === "one_page"
							? currentPageSettings?.page_layout == "left-image"
								? dimensions.width / dimensions.height > 1.1
									? "w-[40%] left-0"
									: "hidden "
								: currentPageSettings?.page_layout ==
								  "right-image"
								? dimensions.width / dimensions.height > 1.1
									? "w-[40%] right-0"
									: "hidden"
								: "hidden"
							: "hidden",

						"side-image isTmtD flex h-full justify-end overflow-hidden fixed "
					)}
				>
					<div className="relative  w-full h-full flex">
						<div
							className="absolute inset-0 bg-cover bg-no-repeat bg-center"
							style={{
								backgroundImage:
									currentPageSettings?.cover_image
										? `url('${currentPageSettings.cover_image}')`
										: `url('/default-cover.jpg')`,
							}}
						/>
						{/* <img
						src={currentPageSettings?.cover_image ?? ''}
						alt="Banner image"
						className="object-cover origin-top-left w-full"
					/> */}
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default FormPage;
