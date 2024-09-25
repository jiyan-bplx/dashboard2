import { EyeSlashIcon } from "@heroicons/react/20/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import validator from "validator";
import { editForm, getFormById } from "@api/forms";
import { CreateFormRequest, FormOptions } from "@api/forms/requests";
import { getPlanLimits } from "@api/subscriptions";
import { Plan } from "@api/subscriptions/responses";
import Input from "../BuilderComponents/Inputs/Input";
import Loading from "../Loading";
import ProBadge from "../ProBadge";
import Toggle from "../BuilderComponents/Inputs/Toggle";
import { format, parseISO } from "date-fns";
import { planLimitsToNumber } from "@utils/index";
import { getWorkspaceById } from "@api/workspace";
import useUser from "@hooks/useUser";
const FormSettingsTab = ({ formId }: { formId: number }) => {
	const router = useRouter();
	const { data: user } = useUser();
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

	const [formOptions, setFormOptions] = useState<FormOptions>({
		collect_ip_on_submission: false,
		email_notifications: false,
		redirect_url: "",
		draft_submissions: false,
		stop_submissions_after: null,
	});

	const [passwordEnabled, setPasswordEnabled] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const togglePassword = () => setShowPassword(!showPassword);

	const { data, refetch } = useQuery(
		["forms", formId],
		() => getFormById(formId),
		{
			enabled: typeof formId === "number",
		}
	);

	const { data: workspace } = useQuery({
		queryKey: ["workspaces", data?.data?.workspace_id],
		queryFn: () =>
			data?.data?.workspace_id
				? getWorkspaceById(data?.data?.workspace_id)
				: null,
		enabled: !!data?.data?.workspace_id,
	});

	const editFormMutation = useMutation<
		Awaited<ReturnType<typeof editForm>>,
		Awaited<ReturnType<typeof editForm>>,
		{ formId: number; data: CreateFormRequest }
	>({
		mutationFn: (v) => editForm(v.formId, v.data),
		mutationKey: "editForm",
		onMutate: () => {
			refetch();
		},
	});

	useEffect(() => {
		if (data && data.data?.options) {
			setFormOptions(data.data?.options);
		}
	}, [data]);

	const saveFormSettings = async () => {
		if (!data?.data) {
			toast.error("There was an error saving your form");
			return;
		}

		if (formOptions.redirect_url && formOptions.redirect_url?.length > 0) {
			const isUrl = validator.isURL(formOptions.redirect_url);
			if (!isUrl) {
				toast.error("Please enter a valid Redirect URL");
				return;
			}
		}

		if (formOptions.stop_submissions_after) {
			formOptions.stop_submissions_after = new Date(
				formOptions.stop_submissions_after
			).toISOString();
		}
		try {
			const res = await editFormMutation.mutateAsync({
				data: {
					form_type: data.data.form_type ?? "form",
					is_custom: data.data.is_custom as any,
					name: data.data.name,
					pages: data.data.pages ?? [],
					body: (data.data.is_custom
						? "[]"
						: data.data.body
						? data.data.body
						: "[]") as any,
					options: formOptions,
				},
				formId,
			});
			if (res.status === "success") {
				toast.success("Form options updated!");
			} else {
				toast.error(
					res.message || "There was an error saving your changes!"
				);
				return;
			}
		} catch (err) {
			toast.error(
				(err as any).message ||
					"There was an error saving your changes!"
			);
		}
	};

	return (
		<div className="overflow-x-hiiden w-full">
			<h1 className="text-title mt-4">Form Settings</h1>

			{data?.data?.is_custom === false && (
				<>
					<div className="flex flex-col w-full">
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4">
								<div>
									<div className="flex items-center space-x-2">
										<p className="font-medium text-sm md:text-base">
											Redirect on completition
										</p>
									</div>
									<p className="text-xs text-gray-400">
										Redirect to a custom URL when someone
										completes your form
									</p>
								</div>
							</div>
							<Toggle
								title="Redirect on submission"
								enabled={formOptions.redirect_url !== ""}
								onChangeState={(state) => {
									if (state) {
										setFormOptions((prev) => ({
											...prev,
											redirect_url: "https://",
										}));
									} else {
										setFormOptions((prev) => ({
											...prev,
											redirect_url: "",
										}));
									}
								}}
							/>
						</div>

						{formOptions.redirect_url !== "" && (
							<div className="mt-2">
								<Input
									type="url"
									value={formOptions.redirect_url ?? ""}
									onChange={(e) =>
										setFormOptions({
											...formOptions,
											redirect_url: e.target.value,
										})
									}
									placeholder="https://example.com"
								/>
							</div>
						)}
					</div>

					<div className="flex flex-col w-full">
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4">
								<div>
									<div className="flex items-center space-x-2">
										<p className="font-medium text-sm md:text-base">
											Message after submission
										</p>
									</div>
									<p className="text-xs text-gray-400">
										Show users a message after submitting
										the form
									</p>
								</div>
							</div>
							<Toggle
								title="Message after submission"
								enabled={formOptions.thank_you_message !== ""}
								onChangeState={(state) => {
									if (state) {
										setFormOptions((prev) => ({
											...prev,
											thank_you_message:
												"Thank you! Your response has been submitted.",
										}));
									} else {
										setFormOptions((prev) => ({
											...prev,
											thank_you_message: null,
										}));
									}
								}}
							/>
						</div>

						{formOptions.thank_you_message !== "" && (
							<div className="mt-2">
								<Input
									type="textarea"
									value={formOptions.thank_you_message ?? ""}
									onChange={(e) =>
										setFormOptions({
											...formOptions,
											thank_you_message: e.target.value,
										})
									}
									placeholder="Thank you! Your response has been submitted."
								/>
							</div>
						)}
					</div>
					<div className="flex flex-col w-full">
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4">
								<div>
									<div className="flex items-center space-x-2">
										<p className="font-medium text-sm md:text-base">
											Stop form submissions after a
											specific date
										</p>
										{!isAvailable(
											"stop_submissions_after"
										) && <ProBadge />}
									</div>
									<p className="text-xs text-gray-400">
										Close your form for new submissions{" "}
										{formOptions.stop_submissions_after !==
										null
											? "after"
											: ""}
									</p>
								</div>
							</div>
							<Toggle
								title="Stop form submissions"
								enabled={
									formOptions.stop_submissions_after !== null
								}
								onChangeState={(state) => {
									if (isAvailable("stop_submissions_after")) {
										if (state) {
											setFormOptions((prev) => ({
												...prev,
												stop_submissions_after:
													new Date()
														.toISOString()
														.substring(0, 10),
											}));
										} else {
											setFormOptions((prev) => ({
												...prev,
												stop_submissions_after: null,
											}));
										}
									}
								}}
							/>
						</div>

						{formOptions.stop_submissions_after !== null && (
							<div className="mt-2">
								<Input
									type="datetime-local"
									min={format(
										new Date(),
										"yyyy-MM-dd'T'hh:mm"
									)}
									value={
										formOptions.stop_submissions_after
											? format(
													parseISO(
														formOptions.stop_submissions_after
													),
													"yyyy-MM-dd'T'hh:mm"
											  )
											: ""
									}
									onChange={(e) => {
										setFormOptions({
											...formOptions,
											stop_submissions_after:
												e.target.value,
										});
									}}
									placeholder={new Date().toDateString()}
								/>
							</div>
						)}
					</div>
					<div className="flex flex-col w-full">
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4">
								<div>
									<div className="flex items-center space-x-2">
										<p className="font-medium text-sm md:text-base">
											Stop form submissions after a
											specific amount of submissions
										</p>
										{!isAvailable(
											"stop_submissions_after"
										) && <ProBadge />}
									</div>
									<p className="text-xs text-gray-400">
										Close your form for new submissions{" "}
										{formOptions.max_submissions !== null
											? "after"
											: ""}
									</p>
								</div>
							</div>
							<Toggle
								title="Stop form submissions"
								enabled={
									formOptions.max_submissions &&
									formOptions.max_submissions > 0
										? true
										: false
								}
								onChangeState={(state) => {
									if (isAvailable("stop_submissions_after")) {
										if (state) {
											setFormOptions((prev) => ({
												...prev,
												max_submissions: 1000,
											}));
										} else {
											setFormOptions((prev) => ({
												...prev,
												max_submissions: null,
											}));
										}
									}
								}}
							/>
						</div>

						{formOptions.max_submissions &&
						formOptions.max_submissions > 0 ? (
							<div className="mt-2">
								<Input
									type="number"
									min={1}
									max={planLimitsToNumber(
										planLimits?.data?.limits
											?.number_of_responses?.limit
									)}
									value={formOptions.max_submissions ?? ""}
									onChange={(e) =>
										setFormOptions({
											...formOptions,
											max_submissions: parseInt(
												e.target.value
											),
										})
									}
									placeholder={"Max submissions limit"}
								/>
							</div>
						) : null}
						{formOptions.max_submissions &&
						typeof planLimitsToNumber(
							planLimits?.data?.limits?.number_of_responses?.limit
						) === "number" &&
						formOptions.max_submissions >
							planLimits?.data?.limits?.number_of_responses
								?.limit! ? (
							<p className="text-sm text-gray-500 mt-1">
								Your plan has a limit of{" "}
								{
									planLimits?.data?.limits
										?.number_of_responses?.limit
								}{" "}
								responses per month. You won't be able to access
								responses over the usage quota.
							</p>
						) : null}
					</div>
				</>
			)}
			<div className="flex items-center justify-between mt-4">
				<div className="flex items-center space-x-4">
					<div>
						<div className="flex items-center space-x-2">
							<p className="font-medium text-sm md:text-base">
								Email Notifications
							</p>
							{!isAvailable("email_notifications") && (
								<ProBadge />
							)}
						</div>
						<p className="text-xs text-gray-400">
							Get notified when someone submits a response to your
							form
						</p>
					</div>
				</div>
				<Toggle
					title="Email notifications"
					enabled={formOptions.email_notifications ?? false}
					onChangeState={(val) => {
						if (isAvailable("draft_submissions")) {
							setFormOptions((prev) => ({
								...prev,
								email_notifications: val,
							}));
						}
					}}
				/>
			</div>
			{data?.data?.is_custom === false && (
				<>
					<div className="flex items-center justify-between mt-4">
						<div className="flex items-center space-x-4">
							<div>
								<div className="flex items-center space-x-2">
									<p className="font-medium text-sm md:text-base">
										Save draft submissions
									</p>
									{!isAvailable("draft_submissions") && (
										<ProBadge />
									)}
								</div>
								<p className="text-xs text-gray-400">
									Persist draft submissions in the browser
								</p>
							</div>
						</div>
						<Toggle
							title="Draft submissions"
							enabled={formOptions.draft_submissions ?? false}
							onChangeState={(val) => {
								if (isAvailable("draft_submissions")) {
									setFormOptions((prev) => ({
										...prev,
										draft_submissions: val,
									}));
								}
							}}
						/>
					</div>

					<div className="flex flex-col w-full">
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4">
								<div>
									<div className="flex items-center space-x-2">
										<p className="font-medium text-sm md:text-base">
											Protect your form with a password
										</p>
										{!isAvailable("password_protected") && (
											<ProBadge />
										)}
									</div>
									<p className="text-xs text-gray-400">
										Ask for a password before users can view
										your form
									</p>
								</div>
							</div>
							<Toggle
								title="Password Protected"
								enabled={passwordEnabled}
								onChangeState={(state) => {
									if (isAvailable("password_protected")) {
										setPasswordEnabled(state);
									}
								}}
							/>
						</div>

						{passwordEnabled && (
							<div className="mt-2 relative">
								<input
									onChange={(e) =>
										setFormOptions({
											...formOptions,
											password: e.target.value,
										})
									}
									placeholder="Password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								/>
								{showPassword ? (
									<EyeSlashIcon
										className="w-5 h-5 absolute right-2 top-2 text-gray-600"
										onClick={togglePassword}
									/>
								) : (
									<EyeIcon
										className="w-5 h-5 absolute right-2 top-2 text-gray-600"
										onClick={togglePassword}
									/>
								)}
								{/* <Input
								type="text"
								value={formOptions.password ?? ""}
								onChange={(e) =>
									setFormOptions({
										...formOptions,
										password: e.target.value,
									})
								}
								placeholder={"Password"}
							/> */}
							</div>
						)}
					</div>

					<div>
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4">
								<div>
									<div className="flex items-center space-x-2 relative">
										<p className="font-medium text-sm md:text-base">
											Remove ByteForms branding
										</p>
										{!isAvailable("remove_branding") && (
											<ProBadge />
										)}
									</div>
								</div>
							</div>
							<Toggle
								title="Remove ByteForms Branding"
								enabled={
									isAvailable("remove_branding")
										? (formOptions as any).remove_branding
										: false
								}
								onChangeState={(state) => {
									if (isAvailable("remove_branding")) {
										setFormOptions((prev) => ({
											...prev,
											remove_branding: state,
										}));
									}
								}}
							/>
						</div>
						{!isAvailable("remove_branding") && (
							<p className="text-sm text-gray-400">
								Upgrade to a paid plan to remove branding
							</p>
						)}
					</div>
				</>
			)}
			{/* <div className="flex items-center justify-between mt-4">
				<div className="flex items-center space-x-4">
					<div>
						<div className="flex items-center space-x-2">
							<p className="font-medium text-sm md:text-base">
								Collect IP address of respondents
							</p>
						</div>
						<p className="text-xs text-gray-400">
							Store the IP address of respondents for each
							submission
						</p>
					</div>
				</div>
				<Toggle
					title="Collect IP"
					enabled={formOptions.collect_ip_on_submission ?? false}
					onChangeState={(val) => {
						setFormOptions((prev) => ({
							...prev,
							collect_ip_on_submission: val,
						}));
					}}
				/>
			</div> */}

			<button
				disabled={editFormMutation.isLoading}
				className="button-primary mt-4 space-x-2"
				onClick={saveFormSettings}
			>
				{editFormMutation.isLoading && (
					<Loading color="white" size={12} />
				)}
				<span>Save changes</span>
			</button>

			{data?.data?.user_id === user?.data?.id && (
				<>
					<p className="border-t mt-6  pt-2 font-medium">Workspace</p>
					<p className="text-sm text-gray-600">
						This form is part of the '
						{workspace?.data?.workspace?.name}' workspace.
					</p>
					<Link
						scroll={false}
						href={{
							query: {
								...router.query,
								action: "workspace-transfer",
							},
						}}
						className="mt-4 button-secondary"
					>
						Change form workspace
					</Link>
				</>
			)}

			<p className="border-t mt-4  pt-2 font-medium">Danger zone</p>
			<div className="flex items-center space-x-2">
				<Link
					href={{
						query: {
							...router.query,
							action: "delete",
						},
					}}
					scroll={false}
					className="mt-4 button-danger"
				>
					Delete Form
				</Link>
				<Link
					scroll={false}
					href={{
						query: {
							...router.query,
							action: "edit",
						},
					}}
					className="mt-4 button-secondary"
				>
					Edit Form
				</Link>
			</div>
		</div>
	);
};

export default FormSettingsTab;
