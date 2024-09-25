import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { useQuery } from "react-query";
import { PageSettings } from "@api/forms/requests";
import { getPlanLimits } from "@api/subscriptions";
import { Plan } from "@api/subscriptions/responses";
import { isNumber } from "@utils/index";
import EditBlockSidebar from "../EditBlockSidebar";
import Input from "../Inputs/Input";

import { format, parseISO } from "date-fns";
import useBuilderStore, { useFormOptionsStore } from "@store/builder";
import EditPageSidebar from "../EditPageSidebar";
import Select from "../Inputs/Select";
import Switch from "../Inputs/Switch";

const FormOptionsSidebar = ({
	selectedPage,
	setSelectedPage,
	pages,
}: {
	selectedPage?: PageSettings | null;
	setSelectedPage: (page: PageSettings | null) => void;
	pages: number[];
}) => {
	const { selectedInput, inputs } = useBuilderStore((state) => state);

	const isQuiz = inputs.some((item) => item.component === "question");
	const { changeFormOption, formOptions } = useFormOptionsStore();

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	const isAvailable = (inputKey: keyof Plan) => {
		return (
			Object.keys(planLimits?.data?.limits ?? {}).some(
				(item) => item === inputKey
			) && ((planLimits?.data?.limits as any)?.[inputKey] as any)
		);
	};

	const isAvailableInput = (inputType: string) => {
		return planLimits?.data?.limits?.allowed_inputs?.includes(inputType);
	};

	if (selectedPage) {
		return (
			<EditPageSidebar
				pages={pages}
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
			/>
		);
	}

	if (selectedInput) {
		return (
			<EditBlockSidebar
				isAvailable={
					isAvailableInput(selectedInput.type as any) ? true : false
				}
			/>
		);
	}

	return (
		<>
			<div className="w-full px-4">
				<Input
					label="Submit Button text"
					value={formOptions.submit_button_text ?? "Submit"}
					onChange={(e) => {
						changeFormOption({
							submit_button_text: e.target.value,
						});
					}}
				/>

				<div className="mt-2">
					<div className="relative">
						<Input
							readOnly={
								isAvailable("stop_submissions_after")
									? false
									: true
							}
							label="Maximum Submissions"
							value={formOptions.max_submissions?.toString()}
							onChange={(e) => {
								changeFormOption({
									max_submissions: isNumber(e.target.value)
										? parseInt(e.target.value)
										: undefined,
								});
							}}
						/>
						{!isAvailable("stop_submissions_after") && (
							<div className="text-[10px] absolute top-0 right-2">
								<div className="group relative flex flex-col items-end">
									<div className=" bg-indigo-500 px-2 rounded-full text-white">
										Pro
									</div>
									<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded mt-1 group-hover:opacity-100 transition duration-500 absolute z-10 w-28">
										This feature is not available in your
										plan
									</span>
								</div>
							</div>
							// <StarIcon className="absolute top-1 right-2 w-3 z-10 h-3 text-amber-600" />
						)}
					</div>
				</div>
				<div className="mt-2">
					<div className="relative">
						<Input
							readOnly={
								isAvailable("stop_submissions_after")
									? false
									: true
							}
							type="datetime-local"
							label="Stop submissions after"
							// "2024-03-18T23:04"
							value={
								formOptions.stop_submissions_after
									? format(
											parseISO(
												formOptions.stop_submissions_after
											),
											"yyyy-MM-dd'T'HH:mm"
									  )
									: ""
							}
							onChange={(e) => {
								changeFormOption({
									stop_submissions_after: new Date(
										e.target.value
									).toISOString(),
								});
							}}
						/>
						{!isAvailable("stop_submissions_after") && (
							<div className="text-[10px] absolute top-0 right-2">
								<div className="group relative flex flex-col items-end">
									<div className=" bg-indigo-500 px-2 rounded-full text-white">
										Pro
									</div>
									<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded mt-1 group-hover:opacity-100 transition duration-500 absolute z-10 w-28">
										This feature is not available in your
										plan
									</span>
								</div>
							</div>
							// <StarIcon className="absolute top-1 right-2 w-3 z-10 h-3 text-amber-600" />
						)}
					</div>
				</div>
				{Object.keys(inputs)
					?.map((key) => inputs[parseInt(key)])
					?.flat()
					?.some((item) => item.type === "email") && (
					<div className="my-3">
						<Switch
							checked={
								formOptions.one_submission_per_email ?? false
							}
							onChange={(checked) => {
								changeFormOption({
									one_submission_per_email: checked,
								});
							}}
							title="One submission per email"
						/>
					</div>
				)}
				<div className="mt-4 border-t pt-3">
					<Select
						placeholder={"Select form width"}
						options={["Full Width", "Centered"]}
						defaultValue={
							formOptions.form_width === "full"
								? "Full Width"
								: "Centered"
						}
						onChange={(val) => {
							if (val.target.value === "Full Width") {
								changeFormOption({
									form_width: "full",
								});
							} else if (val.target.value === "Centered") {
								changeFormOption({
									form_width: "centered",
								});
							}
						}}
						title={"Form Width"}
					/>
				</div>
				<div className="mt-2">
					<Select
						placeholder={"Vertical alignment"}
						options={["Top", "Centered"]}
						defaultValue={
							formOptions.vertically_centered ? "Centered" : "Top"
						}
						onChange={(val) => {
							if (val.target.value === "Top") {
								changeFormOption({
									vertically_centered: false,
								});
							} else if (val.target.value === "Centered") {
								changeFormOption({
									vertically_centered: true,
								});
							}
						}}
						title={"Vertical alignment"}
					/>
				</div>

				<div className="mt-2">
					<Select
						placeholder={"Form Theme"}
						options={[
							// "auto",
							"light",
							"dark",
						]}
						defaultValue={formOptions.theme ?? "light"}
						onChange={(val) => {
							changeFormOption({
								theme: val.target.value,
							});
						}}
						title={"Form Theme"}
					/>
				</div>

				{pages?.length > 1 && (
					<div className="my-3">
						<Select
							placeholder={"Form Pages Behaviour"}
							options={[
								// "auto",
								"One page at a time",
								"All pages as list",
							]}
							defaultValue={
								formOptions?.page_behaviour === "one_page"
									? "One page at a time"
									: "All pages as list"
							}
							onChange={(val) => {
								changeFormOption({
									page_behaviour:
										val.target.value ===
										"One page at a time"
											? "one_page"
											: "scroll",
								});
							}}
							title={"Form Pages Behaviour"}
						/>
					</div>
				)}

				{/* <div className="my-3 flex items-center">
						<label
							className={classNames(
								"text-gray-900",
								"text-xs md:text-sm font-medium leading-6  flex propss-center space-x-1 -mb-1"
							)}
						>
							<span className="">
								Collect IP address on submission
							</span>
						</label>
						<Switch
							checked={
								formOptions.collect_ip_on_submission ?? false
							}
							onChange={(checked) => {
								changeFormOption({
									collect_ip_on_submission: checked,
								});
							}}
							className={classNames(
								formOptions.collect_ip_on_submission
									? "bg-indigo-600"
									: "bg-gray-200",
								"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							)}
						>
							<span
								className={classNames(
									formOptions.collect_ip_on_submission
										? "translate-x-5"
										: "translate-x-0",
									"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
								)}
							>
								<span
									className={classNames(
										formOptions.collect_ip_on_submission
											? "opacity-0 ease-out duration-100"
											: "opacity-100 ease-in duration-200",
										"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
									)}
									aria-hidden="true"
								>
									<svg
										className="h-3 w-3 text-gray-400"
										fill="none"
										viewBox="0 0 12 12"
									>
										<path
											d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
								<span
									className={classNames(
										formOptions.collect_ip_on_submission
											? "opacity-100 ease-in duration-200"
											: "opacity-0 ease-out duration-100",
										"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
									)}
									aria-hidden="true"
								>
									<svg
										className="h-3 w-3 text-indigo-600"
										fill="currentColor"
										viewBox="0 0 12 12"
									>
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div> */}

				<div className="mt-2">
					<Select
						placeholder={"Form Visibility"}
						options={[
							// "auto",
							"public",
							"draft",
						]}
						defaultValue={formOptions.visibility ?? "public"}
						onChange={(val) => {
							changeFormOption({
								visibility: val.target.value,
							});
						}}
						title={"Form Visibility"}
					/>
					<p className="text-xs mt-1 text-gray-600">
						'Public' form will be accessible by anyone having a
						link. A 'Draft' form is only accessible by you.
					</p>
				</div>
				<div className="mt-4">
					<Input
						type={"textarea"}
						placeholder="Message after submission"
						label="Message after submission"
						value={
							formOptions?.thank_you_message &&
							formOptions.thank_you_message?.length > 0
								? formOptions.thank_you_message ??
								  "Thank you! Your response has been submitted."
								: "Thank you! Your response has been submitted."
						}
						onChange={(e) => {
							changeFormOption({
								thank_you_message: e.target.value,
							});
						}}
					/>
					<p className="mt-2 text-xs text-gray-600">
						Message to display to your users after they submit a
						response.
					</p>
				</div>

				<div className="mt-4">
					<Input
						type="url"
						placeholder="Redirect URL"
						label="Redirect URL"
						value={formOptions.redirect_url ?? ""}
						onChange={(e) => {
							changeFormOption({
								redirect_url: e.target.value,
							});
						}}
					/>
					<p className="mt-2 text-xs text-gray-600">
						URL to redirect to after form is submitted.
					</p>
					<p className="mt-1 text-xs text-gray-600">
						Leave blank to disable.
					</p>
				</div>

				<div className="mt-4">
					<div className="relative">
						<Input
							readOnly={
								isAvailable("password_protected") ? false : true
							}
							placeholder="Password Protect your forms"
							label="Form Password"
							value={formOptions.password ?? ""}
							onChange={(e) => {
								changeFormOption({
									password: e.target.value,
								});
							}}
						/>
						{!isAvailable("password_protected") && (
							// <StarIcon className="absolute top-2 right-2 w-3 z-10 h-3 text-amber-600" />
							<div className="text-[10px] absolute top-0 right-2">
								<div className="group relative flex flex-col items-end">
									<div className=" bg-indigo-500 px-2 rounded-full text-white">
										Pro
									</div>
									<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded mt-1 group-hover:opacity-100 transition duration-500 absolute z-10 w-28">
										This feature is not available in your
										plan
									</span>
								</div>
							</div>
						)}
					</div>
					<p className="mt-2 text-xs text-gray-600">
						Password protect your form to prevent unauthorized
						submissions.
					</p>
					<p className="mt-1 text-xs text-gray-600">
						Leave blank to disable.
					</p>
				</div>

				{isQuiz && (
					<div className="mt-4 border-t pt-2">
						<Switch
							checked={formOptions.confetti_on_submit ?? false}
							onChange={(checked) => {
								changeFormOption({
									confetti_on_submit: checked,
								});
							}}
							title="Show results after submit"
						/>
						<p className="text-xs text-gray-500">
							Show results after quiz submission.
						</p>
					</div>
				)}

				<div className="mt-4">
					<Switch
						checked={formOptions.confetti_on_submit ?? false}
						onChange={(checked) => {
							changeFormOption({
								confetti_on_submit: checked,
							});
						}}
						title="Show confetti on submit"
					/>
					<p className="text-xs text-gray-500">
						Show confetti animation on form submission.
					</p>
				</div>

				<div className="mt-4 border-t pt-2">
					<div className="flex items-center space-x-2">
						<CodeBracketIcon className="w-4 h-4" />
						<p className="text-xs md:text-sm font-medium leading-6 flex">
							Custom Code
						</p>
						{!isAvailable("custom_code") && (
							<div className="text-[10px]">
								<div className="group relative flex flex-col items-end">
									<div className=" bg-indigo-500 px-2 rounded-full text-white">
										Pro
									</div>
									<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded mt-1 group-hover:opacity-100 transition duration-500 absolute z-10 w-28">
										This feature is not available in your
										plan
									</span>
								</div>
							</div>
							// <StarIcon className="w-3 z-10 h-3 text-amber-600" />
						)}
					</div>

					<div className="mt-4">
						<Input
							readOnly={isAvailable("custom_code") ? false : true}
							placeholder="Custom Code"
							label="Custom Code"
							type="textarea"
							{...{
								rows: 5,
							}}
							value={formOptions.custom_code ?? ""}
							onChange={(e) => {
								changeFormOption({
									custom_code: e.target.value,
								});
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default FormOptionsSidebar;
