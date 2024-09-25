import { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LoaderIcon } from "react-hot-toast";
import { classNames } from "@utils/index";

import { GenerateAiFormResponse } from "@api/ai/response";
import InputRenderer from "../BuilderComponents/InputRenderer";
type FormRendererProps = {
	formObject: GenerateAiFormResponse;
};

const GeneratedFormRenderer = ({ formObject: data }: FormRendererProps) => {
	const form = useMemo(
		() =>
			data?.data
				? {
						...data.data,
						inputs: data.data.body,
				  }
				: null,
		[data]
	);

	const formMethods = useForm({});

	const [, setActivePageIndex] = useState(0);

	const formPages: number[] | null = useMemo(() => {
		if (form?.body) {
			const pageIndexes = form?.body?.map(
				(item) => item.page ?? 1
			) as number[];
			// Remove duplicates
			const items = [
				...(new Set(
					pageIndexes
						.map((i, index) => {
							return typeof i === "number" ? i : index + 1;
						})
						?.sort()
				) as any),
			];

			return items;
		}
		return null;
	}, [form]);

	const goToPreviousPage = (currPageIndex: number) => {
		setActivePageIndex(currPageIndex - 1);
		// if (form?.options?.pageBehaviour === "scroll") {
		const formPageItem = document.getElementById(
			`form-page-index-${currPageIndex - 1}`
		);
		window.scrollTo({
			top: formPageItem?.offsetTop,
			behavior: "smooth",
		});
		// }
	};
	const getQuestionIndex = (item: { id: string }) => {
		return form?.inputs
			?.filter((input) => input.component === "question")
			.findIndex((e) => e.id === item.id);
	};
	const goToNextPage = async (currPageIndex: number) => {
		const inputIdsOnCurrentPage = form?.body
			?.filter((input) => {
				return input.page === formPages?.[currPageIndex];
			})
			?.map((input) => input.id);

		const isValid = await formMethods.trigger(inputIdsOnCurrentPage);
		if (isValid) {
			setActivePageIndex(currPageIndex + 1);
			// if (form?.options?.pageBehaviour === "scroll") {
			// Scroll to form page
			const formPageItem = document.getElementById(
				`form-page-index-${currPageIndex + 1}`
			);
			window.scrollTo({
				top: formPageItem?.offsetTop,
				behavior: "smooth",
			});
			// }
		}
	};

	return (
		<>
			{form &&
				formPages
					?.filter((item) => item !== null)
					?.sort()
					?.map((page, index) => (
						<div
							id={`form-page-index-${index}`}
							key={page ?? index}
							className="bg-white centered max-w-lg md:max-w-lg xl:max-w-xl border-t border-b rounded py-8 my-8 mx-auto self-center"
						>
							{index === 0 ? (
								<div className="flex items-center justify-center">
									<p className=" text-gray-900 text-xl md:text-3xl font-medium leading-6  text-center w-full mb-4">
										{form.name && form.name?.length > 0
											? form.name
											: "Form Title"}
									</p>
								</div>
							) : null}

							<FormProvider {...formMethods}>
								<form action="#">
									<div className="flex flex-wrap space-y-2">
										{form.inputs
											?.map((item) => ({
												...item,
												page: item.page ?? 1,
											}))
											?.filter(
												(item) => item.page === page
											)

											.map((item, index) => (
												<div
													className={classNames(
														"text-gray-900",
														item.width === "half"
															? "w-1/2 px-6"
															: "w-full px-6 ",
														"pt-2 group"
													)}
													key={item.id}
												>
													{item.component ===
													"layout" ? (
														<InputRenderer
															changeProperty={() => {}}
															key={item.id}
															input={item}
															value={
																item.defaultValue
															}
														/>
													) : (
														<Controller
															name={item.id}
															control={
																formMethods.control
															}
															defaultValue={
																item.defaultValue
															}
															rules={{
																validate: (
																	val
																) => {
																	if (
																		item.type ===
																		"tel"
																	) {
																		if (
																			!val
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
																			!val
																		) {
																			return item.required
																				? "This field is required"
																				: undefined;
																		}
																		return (
																			/^\d+$/.test(
																				val
																			) ||
																			"Please enter a valid number"
																		);
																	}
																	if (
																		item.type ===
																		"email"
																	) {
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
																		changeProperty={() => {}}
																		input={
																			item
																		}
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
													{item.instructions?.length >
														0 && (
														<div
															className={classNames(
																"mt-3 text-xs text-gray-500"
															)}
														>
															{item.instructions}
														</div>
													)}
												</div>
											))}
									</div>
									{typeof page === "undefined" ||
									formPages?.filter((item) => item !== null)
										?.length -
										1 ===
										index ? (
										<div className="self-center flex space-x-2 justify-center pt-8">
											{index !== 0 && (
												<button
													onClick={() =>
														goToPreviousPage(index)
													}
													type="button"
													className={`!bg-opacity-30  !text-indigo-500 !border !border-solid !border-indigo-500  button-primary space-x-2 flex items-center`}
												>
													<span>Previous page</span>
												</button>
											)}
											<button
												type="submit"
												className={`button-primary space-x-2 flex items-center`}
											>
												{formMethods.formState
													.isSubmitting && (
													<LoaderIcon />
												)}
												<span>Submit</span>
											</button>
										</div>
									) : (
										<div className="self-center space-x-2 flex justify-center pt-8">
											{index !== 0 && (
												<button
													onClick={() =>
														goToPreviousPage(index)
													}
													type="button"
													className={`!bg-opacity-30  !text-indigo-500 !border !border-solid !border-indigo-500  button-primary space-x-2 flex items-center`}
												>
													{formMethods.formState
														.isSubmitting && (
														<LoaderIcon />
													)}
													<span>Previous page</span>
												</button>
											)}
											<button
												onClick={() =>
													goToNextPage(index)
												}
												type="button"
												className={`button-secondary space-x-2 flex items-center`}
											>
												{formMethods.formState
													.isSubmitting && (
													<LoaderIcon />
												)}
												<span>Next page</span>
											</button>
										</div>
									)}
								</form>
							</FormProvider>
						</div>
					))}
		</>
	);
};

export default GeneratedFormRenderer;
