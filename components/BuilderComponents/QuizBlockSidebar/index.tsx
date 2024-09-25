import {
	CheckIcon,
	PhotoIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InputTypes } from "../../../data/Inputs";
import useBuilderStore from "@store/builder";
import { classNames } from "@utils/index";
import BulkAddOptionsModal from "../../Modals/BulkAddOptionsModal";
import MediaGalleryModal from "../../Modals/MediaGalleryModal";
import Checkbox from "../Inputs/Checkbox";
import FileInputWithPreview from "../Inputs/FileInputWithPreview";
import Input from "../Inputs/Input";
import NumberInput from "../Inputs/NumberInput";
import Select from "../Inputs/Select";
import Switch from "../Inputs/Switch";
import FieldConditionsBlock from "./FieldConditionsBlock";
import FileUploadOptions from "./FileUploadOptions";
import PageTitleOptions from "./PageTitleOptions";
import PhoneInputOptions from "./PhoneInputOptions";
import PictureChoiceInputOptions from "./PictureChoiceInputOptions";
import McqPictureChoiceInputOptions from "./McqPictureChoiceInputOptions";
import toast from "react-hot-toast";
import { Key } from "react";

const QuizBlockSidebar = ({ isAvailable }: { isAvailable?: boolean }) => {
	const { selectedInput, setSelectedInput, inputs, changeProperty } =
		useBuilderStore((state) => state);

	const [showMediaGallery, setShowMediaGallery] = useState(false);
	const openMediaGallery = () => setShowMediaGallery(true);
	const [hasImage, setHasImage] = useState(
		() =>
			typeof selectedInput?.image === "string" &&
			selectedInput?.image?.length > 0
	);
	useEffect(() => {
		if (selectedInput?.image && selectedInput?.image?.length > 0) {
			setHasImage(true);
		} else {
			setHasImage(false);
		}
	}, [selectedInput?.image]);

	const onChangeMultiline = (checked: boolean) => {
		const newType = checked ? "textarea" : "text";

		changeProperty({
			key: "type",
			value: newType,
		});
	};

	const getWeek = (currentDate: Date) => {
		const startDate = new Date(currentDate.getFullYear(), 0, 1);
		const days = Math.floor(
			((currentDate as any) - (startDate as any)) / (24 * 60 * 60 * 1000)
		);
		const weekNumber = Math.ceil(days / 7);

		return weekNumber;
	};

	const getNewValForDateTime = () => {
		let newVal = new Date().toISOString().substring(0, 10);

		if (selectedInput?.type === "time") {
			newVal = new Date().toISOString().substring(11, 16);
		} else if (selectedInput?.type === "datetime-local") {
			newVal = new Date().toISOString().substring(0, 16);
		} else if (selectedInput?.type === "week") {
			newVal = `${new Date().getFullYear()}-W${getWeek(new Date())
				.toString()
				.padStart(2, "0")}`;
		} else if (selectedInput?.type === "month") {
			newVal = new Date().toISOString().substring(0, 7);
		} else if (selectedInput?.type === "date") {
			newVal = new Date().toISOString().substring(0, 10);
		}
		return newVal;
	};

	const disabledPastDates = useMemo(() => {
		if (!selectedInput) {
			return false;
		}

		const newVal = getNewValForDateTime();
		return selectedInput.min === newVal;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedInput]);

	const disabledFutureDates = useMemo(() => {
		if (!selectedInput) {
			return false;
		}

		const newVal = getNewValForDateTime();
		return selectedInput.max === newVal;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedInput]);

	const onChangeDisableFutureDates = (checked: boolean) => {
		const newVal = getNewValForDateTime();

		changeProperty({
			key: "max",
			value: checked ? newVal : undefined,
		});
	};

	function generateRandomString(length = 3) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		let result = "";
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charactersLength);
			result += characters[randomIndex];
		}

		return result;
	}

	const onChangeDisablePastDates = (checked: boolean) => {
		const newVal = getNewValForDateTime();

		changeProperty({
			key: "min",
			value: checked ? newVal : undefined,
		});
	};
	const onToggleAnswer = (item: string, index?: number) => {
		const indexToEdit = inputs.findIndex((e) => e.id === selectedInput?.id);
		let prevAnswers = [...(inputs[indexToEdit]["answer"] ?? [])];

		if (prevAnswers.includes(item)) {
			prevAnswers = prevAnswers.filter((answer) => answer !== item);
		} else {
			prevAnswers = [...prevAnswers, item];
		}

		changeProperty({
			key: "answer",
			value: prevAnswers,
		});
	};
	const deleteOptionAtIndex = (index: number) => {
		if (!selectedInput) {
			return;
		}

		const inputToEdit = inputs.find((e) => e.id === selectedInput.id);

		let newItems = [...(inputToEdit?.["options"] ?? [])];
		let newAnswers = [...(inputToEdit?.["answer"] ?? [])];

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

	const [showBulkAdd, setShowBulkAdd] = useState(false);

	const onBulkAddShow = () => setShowBulkAdd(true);

	const onAddOption = (option: string | string[], index?: number) => {
		if (!selectedInput) {
			return;
		}

		const inputToEdit = inputs.find((e) => e.id === selectedInput.id);
		let newOptions = [...(inputToEdit?.["options"] ?? [])];

		if (typeof index === "number") {
			if (typeof option === "string") {
				newOptions[index] = option;
			}
		} else {
			if (typeof option === "string") {
				newOptions.push(option);
			} else if (Array.isArray(option)) {
				newOptions = [...newOptions, ...option];
			}
		}

		changeProperty({
			key: "options",
			value: newOptions,
		});
	};

	const [activeTab, setActiveTab] = useState<"basic" | "design" | "logic">(
		"basic"
	);

	if (!selectedInput) return null;

	return (
		<div className="w-full h-full min-h-full">
			{showBulkAdd && (
				<BulkAddOptionsModal
					closeModal={() => setShowBulkAdd(false)}
					isOpen={showBulkAdd}
					onAdd={onAddOption}
				/>
			)}

			<div className="flex justify-between items-center mb-4 px-8 ">
				<div className="">
					<p className="text-base font-semibold leading-6 text-gray-900">
						Edit block
					</p>
					<p className="text-xs text-gray-700">
						{
							InputTypes.find(
								(item) => item.type === selectedInput.type
							)?.label
						}
					</p>
				</div>
				<XMarkIcon
					onClick={() => setSelectedInput(null)}
					className="h-6 w-6"
					aria-hidden="true"
				/>
			</div>

			<div className="px-8">
				{!isAvailable && (
					<div className="mb-4 flex flex-col items-start bg-indigo-50 border border-indigo-400 p-3 rounded-md">
						<p className="text-indigo-600 text-sm font-medium mb-1">
							Pro field
						</p>
						<p className="text-xs text-indigo-500">
							You'll need to{" "}
							<Link
								href={"/profile/pricing"}
								className="underline"
							>
								upgrade your plan
							</Link>{" "}
							to publish a form with this input block.
						</p>
					</div>
				)}
			</div>
			<div className="mb-4">
				<div className="flex items-center justify-between space-x-4 text-sm border-b  border-b-gray-300 px-8">
					{["basic", "design", "logic"].map((tab) => (
						<button
							key={tab}
							className={classNames(
								activeTab === tab
									? "text-gray-900 border-b-2 border-b-black"
									: "text-gray-400",
								" capitalize pb-2 w-1/3 text-center "
							)}
							onClick={() => setActiveTab(tab as any)}
						>
							{tab}
						</button>
					))}
				</div>
			</div>

			<div className="px-8 h-full min-h-full">
				{activeTab === "basic" && (
					<>
						{(selectedInput.component === "input" ||
							(selectedInput.component === "special_input" &&
								["calendly", "cal", "recaptcha"].includes(
									selectedInput.type
								))) && (
							<div className="">
								<Input
									label="Label"
									type="text"
									name="name"
									id={`name-${selectedInput.id}`}
									placeholder="Field Name"
									value={selectedInput.label ?? ""}
									onChange={(e) => {
										changeProperty({
											key: "label",
											value: e.target.value,
										});
									}}
								/>
							</div>
						)}

						{selectedInput.component === "input" &&
							(selectedInput?.type === "text" ||
								selectedInput?.type === "textarea") && (
								<div className="my-2">
									<Checkbox
										title="Multiline"
										checked={
											selectedInput.type === "textarea"
										}
										onChange={onChangeMultiline}
									/>
								</div>
							)}

						{(selectedInput.component === "input" ||
							[
								"razorpay_payment_button",
								"calendly",
								"cal",
							].includes(selectedInput.type)) &&
							(!["checkbox", "recaptcha", "switch"].includes(
								selectedInput.type
							) ? (
								<div className="my-2">
									<Checkbox
										title="Required"
										checked={
											selectedInput.required ?? false
										}
										onChange={(checked) =>
											changeProperty({
												key: "required",
												value: checked,
											})
										}
									/>
								</div>
							) : (
								!["range", "recaptcha"].includes(
									selectedInput.type
								) && (
									<div className="my-2">
										<Checkbox
											title="Checked by default"
											checked={
												(selectedInput as any)
													.defaultValue ?? false
											}
											onChange={(checked) => {
												changeProperty({
													key: "defaultValue",
													value: checked
														? checked
														: undefined,
												});
											}}
										/>
									</div>
								)
							))}

						{/* {selectedInput.component === "input" &&
					["phone", "email", "text", "number", "url"].includes(
						selectedInput.type
					) && (
						<div className="my-2">
							<Checkbox
								title="Unique"
								checked={selectedInput.unique ?? false}
								onChange={(checked) =>
									changeProperty({
										key: "unique",
										value: checked,
									})
								}
							/>
							<p className="text-xs my-1 text-gray-500">
								Allow only one submission per value of this
								field
							</p>
						</div>
					)} */}

						{["number", "range"].includes(selectedInput.type) ? (
							<>
								<div className="mt-2">
									<NumberInput
										label="Min value"
										type="number"
										name="min"
										id="min"
										placeholder="Min. Value"
										value={selectedInput.min ?? ""}
										onChange={(e) => {
											const val = [
												"range",
												"number",
												"rating",
											].includes(selectedInput.type)
												? e.target.value?.toString() &&
												  e.target.value?.toString()
														.length > 0
													? parseInt(e.target.value)
													: null
												: e.target.value;
											changeProperty({
												key: "min",
												value: val,
											});
										}}
									/>
								</div>

								<div className="mt-2">
									<NumberInput
										label="Max Value"
										type="number"
										name="max"
										id="max"
										placeholder="Max Value"
										value={selectedInput.max ?? ""}
										onChange={(e) => {
											const val = [
												"range",
												"number",
												"rating",
											].includes(selectedInput.type)
												? e.target.value?.toString() &&
												  e.target.value?.toString()
													? parseInt(e.target.value)
													: null
												: e.target.value;
											changeProperty({
												key: "max",
												value: val,
											});
										}}
									/>
								</div>
							</>
						) : (
							selectedInput.component === "input" &&
							![
								"checkbox",
								"switch",
								"signature",
								"file",
								"radio",
								"select",
								"time",
								"range",
								"date",
								"datetime",
								"datetime-local",
								"week",
								"month",
								"calendly",
								"razorpay_payment_button",
								"year",
								"recaptcha",
								"picture_choice",
							].includes(selectedInput.type) && (
								<>
									<p className="block text-sm font-medium text-gray-700">
										{selectedInput.type === "list"
											? "Options"
											: "Character"}{" "}
										Limit
									</p>
									<div className="grid grid-cols-1 gap-2 pb-2">
										{selectedInput.type !== "rating" && (
											<div className="mt-2">
												<NumberInput
													label="Minimum"
													type="number"
													name="minLength"
													id="minLength"
													min={0}
													placeholder={
														"Min. " +
														(selectedInput.type ===
														"list"
															? "Options"
															: "Length")
													}
													max={
														selectedInput.maxLength
													}
													value={
														selectedInput.minLength ??
														""
													}
													onChange={(e) => {
														if (
															typeof e.target
																.value ===
																"undefined" ||
															(e.target.value?.toString() &&
																e.target.value?.toString()
																	.length ===
																	0)
														) {
															changeProperty({
																key: "minLength",
																value: undefined,
															});
															return;
														}
														if (
															parseInt(
																e.target.value
															) >= 0
														) {
															// if (
															// 	selectedInput.maxLength
															// ) {
															// 	if (
															// 		selectedInput.maxLength <
															// 		parseInt(
															// 			e.target
															// 				.value
															// 		)
															// 	) {
															// 		return;
															// 	}
															// }
															changeProperty({
																key: "minLength",
																value: parseInt(
																	e.target
																		.value
																),
															});
														}
													}}
												/>
											</div>
										)}

										<div className="mt-2 ">
											<NumberInput
												label="Maximum"
												type="number"
												name="maxLength"
												min={selectedInput.minLength}
												id="maxLength"
												placeholder={
													"Max. " +
													(selectedInput.type ===
													"list"
														? "Options"
														: "Length")
												}
												value={
													selectedInput.maxLength ??
													""
												}
												onChange={(e) => {
													if (
														!e.target.value ||
														(e.target.value?.toString() &&
															e.target.value?.toString()
																.length === 0)
													) {
														changeProperty({
															key: "maxLength",
															value: undefined,
														});
														return;
													}
													if (
														parseInt(
															e.target.value
														) > 0
													) {
														changeProperty({
															key: "maxLength",
															value: parseInt(
																e.target.value
															),
														});
													}
												}}
											/>
										</div>
									</div>
								</>
							)
						)}

						{selectedInput.component === "input" &&
							![
								"checkbox",
								"switch",
								"file",
								"time",
								"range",
								"date",
								"datetime",
								"datetime-local",
								"calendly",
								"week",
								"month",
								"year",
								"razorpay_payment_button",
								"signature",
							].includes(selectedInput.type) && (
								<>
									{!["rating", "picture_choice"].includes(
										selectedInput.type
									) && (
										<div className="mt-2">
											<Input
												label="Placeholder"
												type="text"
												name="placeholder"
												id="placeholder"
												placeholder="Field placeholder"
												value={
													selectedInput.placeholder ??
													""
												}
												onChange={(e) => {
													changeProperty({
														key: "placeholder",
														value: e.target.value,
													});
												}}
											/>
										</div>
									)}
									{!["recaptcha"].includes(
										selectedInput.type
									) &&
										([
											"radio",
											"select",
											"picture_choice",
										].includes(selectedInput.type) ? (
											<div className="mt-2">
												<Select
													defaultValue={undefined}
													value={
														selectedInput.defaultValue
													}
													placeholder="Select default value"
													title="Default Value"
													options={[
														"None",
														...(Array.isArray(
															selectedInput.options
														) &&
														selectedInput.options
															.length > 0
															? typeof selectedInput.options?.at(
																	0
															  ) === "object"
																? selectedInput.options.map(
																		(opt) =>
																			(
																				opt as any
																			)
																				.label
																  )
																: selectedInput.options
															: []),
													]}
													onChange={(val) => {
														changeProperty({
															key: "defaultValue",
															value:
																val.target
																	.value ===
																"None"
																	? null
																	: val.target
																			.value,
														});
													}}
												/>
											</div>
										) : (
											<div className="mt-2">
												<div className="mt-1">
													{[
														"range",
														"number",
														"rating",
													].includes(
														selectedInput.type
													) ? (
														<NumberInput
															label="Default value"
															max={
																selectedInput.type ===
																"rating"
																	? selectedInput.maxLength ??
																	  5
																	: selectedInput.max
															}
															min={
																selectedInput.type ===
																"rating"
																	? selectedInput.minLength ??
																	  5
																	: selectedInput.min
															}
															name="defaultValue"
															id="defaultValue"
															placeholder="Default Value"
															value={
																selectedInput.defaultValue ??
																""
															}
															onChange={(e) => {
																const val = [
																	"range",
																	"number",
																	"rating",
																].includes(
																	selectedInput.type
																)
																	? e.target
																			.value &&
																	  e.target
																			.value
																			.length >
																			0
																		? parseInt(
																				e
																					.target
																					.value
																		  )
																		: null
																	: e.target
																			.value;
																changeProperty({
																	key: "defaultValue",
																	value: val,
																});
															}}
														/>
													) : (
														<Input
															type={
																selectedInput.type ===
																"rating"
																	? "number"
																	: "text"
															}
															max={
																selectedInput.type ===
																"rating"
																	? selectedInput.maxLength ??
																	  5
																	: undefined
															}
															name="defaultValue"
															id="defaultValue"
															placeholder="Default Value"
															label="Default Value"
															value={
																selectedInput.defaultValue ??
																""
															}
															onChange={(e) => {
																const val = [
																	"range",
																	"number",
																	"rating",
																].includes(
																	selectedInput.type
																)
																	? e.target
																			.value &&
																	  e.target
																			.value
																			.length >
																			0
																		? parseInt(
																				e
																					.target
																					.value
																		  )
																		: null
																	: e.target
																			.value;
																changeProperty({
																	key: "defaultValue",
																	value: val,
																});
															}}
														/>
													)}
												</div>
											</div>
										))}
								</>
							)}
						{selectedInput.component == "question" ? (
							<>
								<p className="text-xs md:text-sm font-medium leading-6 flex mt-4 mb-2">
									Image
								</p>
								<div className="mb-6">
									{selectedInput.image && (
										<div>
											<img
												src={selectedInput.image}
												className="w-full aspect-video rounded mb-2"
												alt={`${selectedInput.title} Image`}
											/>
										</div>
									)}
									<div className="flex items-center space-x-2 w-full">
										<button
											onClick={openMediaGallery}
											className={classNames(
												"button-secondary space-x-2 w-full",
												selectedInput.image
													? ""
													: "w-full text-center justify-center"
											)}
										>
											<PhotoIcon className="w-4 h-4" />
											<span>
												{selectedInput.image
													? "Change"
													: "Add image"}
											</span>
										</button>
										{selectedInput.image && (
											<button
												onClick={() => {
													changeProperty({
														key: "image",
														value: null,
													});
												}}
												className="w-full button-danger space-x-2"
											>
												<TrashIcon className="w-4 h-4" />
												<span>Remove</span>
											</button>
										)}
									</div>

									<MediaGalleryModal
										onSuccess={(file) => {
											if (!file.s3Url) return;
											changeProperty({
												key: "image",
												value: file.s3Url,
											});
										}}
										open={showMediaGallery}
										onClose={() =>
											setShowMediaGallery(false)
										}
									/>
								</div>
							</>
						) : (
							<></>
						)}
						{selectedInput.display !== false &&
							selectedInput.type !== "page_title" && (
								<div className="mt-2">
									<label
										htmlFor="instructions"
										className="block text-sm font-medium text-gray-700"
									>
										{selectedInput.component === "layout" &&
										selectedInput.type === "image"
											? "Description"
											: "Instructions/Description"}
									</label>
									<div className="mt-1">
										<textarea
											rows={
												selectedInput.type === "text"
													? 3
													: 1
											}
											name="instructions"
											id="instructions"
											className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 shadow-sm"
											placeholder={
												selectedInput.component ===
													"layout" &&
												selectedInput.type === "image"
													? "Description"
													: "Instructions/Description"
											}
											value={
												selectedInput.instructions ?? ""
											}
											onChange={(e) => {
												changeProperty({
													key: "instructions",
													value: e.target.value,
												});
											}}
										/>
									</div>
								</div>
							)}

						{[
							"time",
							"date",
							"datetime",
							"datetime-local",
							"week",
							"month",
							"year",
						].includes(selectedInput.type) && (
							<div className="mt-4 border-t pt-2">
								<p className="text-sm font-medium mb-4">
									Date Options
								</p>
								<Checkbox
									title="Disable past dates"
									checked={disabledPastDates}
									onChange={onChangeDisablePastDates}
								/>

								<div className="mt-2">
									<Checkbox
										title="Disable future dates"
										checked={disabledFutureDates}
										onChange={onChangeDisableFutureDates}
									/>
								</div>
							</div>
						)}
						{selectedInput.display !== false &&
							selectedInput.component !== "question" &&
							selectedInput.component !== "layout" &&
							["checkbox", "recaptcha", "switch"].includes(
								selectedInput.type
							) === false && (
								<div className="mt-4">
									<Checkbox
										title="Hide field label"
										checked={selectedInput.hideFieldLabel}
										onChange={(checked) => {
											changeProperty({
												key: "hideFieldLabel",
												value: checked,
											});
										}}
									/>
								</div>
							)}
						{selectedInput.component == "question" ? (
							<div className="mt-4">
								<div className="mt-1">
									<Input
										label="Marks"
										min={0}
										type="number"
										name="marks"
										id="marks"
										value={selectedInput.marks ?? ""}
										onChange={(e) => {
											changeProperty({
												key: "marks",
												value: e.target.value,
											});
										}}
									/>
								</div>
							</div>
						) : (
							<></>
						)}
						{selectedInput.component === "question" &&
							(selectedInput.type === "select" ||
								selectedInput.type === "radio") && (
								<div className="mt-4 border-t pt-2">
									<p className="text-sm font-medium mb-4 capitalize">
										{selectedInput.type} Options
									</p>
									{selectedInput.type === "select" && (
										<Checkbox
											title="Multiple selection"
											checked={selectedInput.multiple}
											onChange={(checked) => {
												changeProperty({
													key: "multiple",
													value: checked,
												});
											}}
										/>
									)}
									<p className="text-sm font-medium mt-4 mb-4">
										Options
									</p>
									{selectedInput.options?.map(
										(item: string, index: number) => (
											<div
												key={index}
												className="flex items-center space-x-2 my-1"
											>
												<input
													name={`option-${index}`}
													value={item}
													type="text"
													onChange={(e) => {
														onAddOption(
															e.target.value,
															index
														);
													}}
													className={`input ${
														selectedInput.answer?.includes(
															item
														)
															? "!ring-green-500"
															: "ring-gray-300"
													}`}
													placeholder="Option"
												/>
												<button
													type="button"
													className={`bg-gray-500 bg-opacity-10 rounded flex items-center justify-center w-8 h-8 hover:bg-opacity-20 hover:bg-green-400 text-green-500 ${
														selectedInput.answer?.includes(
															item
														)
															? "!bg-opacity-50 !bg-green-500 !text-white"
															: ""
													}`}
													onClick={() =>
														onToggleAnswer(
															item,
															index
														)
													}
												>
													<CheckIcon className="w-4 h-4" />
												</button>
												<button
													onClick={() =>
														deleteOptionAtIndex(
															index
														)
													}
													type="button"
													className="bg-gray-100 rounded flex items-center justify-center w-8 h-8 text-red-500"
												>
													<TrashIcon className="w-4 h-4" />
												</button>
											</div>
										)
									)}
									<div className="flex items-center justify-between mt-4 mb-4">
										<form
											onSubmit={(e) => {
												e.preventDefault();
												onAddOption(
													`Option ${generateRandomString()}`
												);
											}}
											className="flex items-center space-x-2 "
										>
											{/* <input
								name={`option`}
								type="text"
								className="input"
								placeholder="Option"
							/> */}
											<button
												id={`add-option-mcq-${selectedInput.id}`}
												type="submit"
												className="button-secondary space-x-1"
											>
												<PlusIcon className="w-4 h-4" />
												<span>Add Option</span>
											</button>
										</form>
										<button
											className="button-text"
											onClick={onBulkAddShow}
										>
											Bulk add
										</button>
									</div>
									{selectedInput.type === "select" && (
										<div className="mt-2 mb-4">
											<Switch
												title="'Other' option"
												checked={
													(selectedInput as any)
														.other_option
												}
												onChange={(checked) => {
													changeProperty({
														key: "other_option",
														value: checked,
													});
												}}
											/>
										</div>
									)}
								</div>
							)}
					</>
				)}

				{selectedInput.component === "input" &&
					selectedInput.type === "picture_choice" && (
						<PictureChoiceInputOptions
							activeTab={activeTab}
							changeProperty={changeProperty}
							selectedInput={selectedInput}
						/>
					)}

				{selectedInput.component === "question" &&
					selectedInput.type === "picture_choice" && (
						<McqPictureChoiceInputOptions
							activeTab={activeTab}
							changeProperty={changeProperty}
							selectedInput={selectedInput}
						/>
					)}

				{selectedInput.component === "input" &&
					selectedInput.type === "tel" && (
						<PhoneInputOptions
							activeTab={activeTab}
							changeProperty={changeProperty}
							selectedInput={selectedInput}
						/>
					)}

				{selectedInput.type === "file" && (
					<FileUploadOptions
						activeTab={activeTab}
						selectedInput={selectedInput}
						changeProperty={changeProperty}
					/>
				)}

				{selectedInput.component === "layout" && (
					<>
						{selectedInput.type === "page_title" && (
							<PageTitleOptions
								activeTab={activeTab}
								changeProperty={changeProperty}
								selectedInput={selectedInput}
							/>
						)}

						{selectedInput.type === "text" && (
							<div className="mt-2">
								<label
									htmlFor="defaultValue"
									className="block text-sm font-medium text-gray-700"
								>
									{selectedInput.type === "text"
										? "Text"
										: "Image URL"}
								</label>
								<div className="mt-1">
									<textarea
										rows={
											selectedInput.type === "text"
												? 4
												: 1
										}
										name="defaultValue"
										id="defaultValue"
										className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 shadow-sm"
										placeholder={
											selectedInput.type === "text"
												? "Default Value"
												: "Image URL"
										}
										value={selectedInput.defaultValue ?? ""}
										onChange={(e) => {
											changeProperty({
												key: "defaultValue",
												value: e.target.value,
											});
										}}
									/>
								</div>
							</div>
						)}
					</>
				)}

				{activeTab === "design" && (
					<>
						{selectedInput.display !== false && (
							<div className="mt-2">
								<Select
									placeholder={
										selectedInput.component === "layout"
											? "Block width"
											: "Input width"
									}
									options={["full", "half"]}
									value={selectedInput.width ?? "full"}
									onChange={(val) => {
										changeProperty({
											key: "width",
											value: val.target.value.toLowerCase(),
										});
									}}
									title={
										selectedInput.component === "layout"
											? "Block width"
											: "Input width"
									}
								/>
							</div>
						)}
					</>
				)}
				{selectedInput.type === "image" && (
					<div className="mt-2">
						<p className="text-sm font-medium mb-4">Image</p>
						<FileInputWithPreview
							disableMetadata
							onRemoveFile={() => {
								changeProperty({
									key: "defaultValue",
									value: null,
								});
							}}
							value={selectedInput.defaultValue}
							fileNamePrefix={selectedInput.id}
							onSuccess={(res) => {
								changeProperty({
									key: "defaultValue",
									value: res.s3Url,
								});
							}}
						/>
					</div>
				)}

				{activeTab === "logic" &&
					[
						"text",
						"textarea",
						"number",
						"tel",
						"checkbox",
						"switch",
						"select",
						"radio",
						"rating",
						"url",
						"email",
						"date",
						"time",
						"datetime-local",
						"range",
					].includes(selectedInput.type) &&
					selectedInput.component === "input" && (
						<div className="mt-4 flex-grow">
							<p className="font-medium text-sm text-gray-700">
								Conditions
							</p>
							{selectedInput.conditions?.map((cnd, i) => (
								<FieldConditionsBlock
									key={i}
									index={i}
									condition={cnd}
									selectedInput={selectedInput}
									changeProperty={changeProperty}
									inputs={inputs}
								/>
							))}
							<FieldConditionsBlock
								selectedInput={selectedInput}
								changeProperty={changeProperty}
								inputs={inputs}
							/>
						</div>
					)}
			</div>
		</div>
	);
};

export default QuizBlockSidebar;
