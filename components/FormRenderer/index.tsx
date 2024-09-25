import { Transition } from "@headlessui/react";
import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

import {
	FieldValues,
	UseFormSetValue,
	UseFormWatch,
	useForm,
	useWatch,
} from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import {
	getFormByPublicId,
	getFormResponseById,
	submitFormResponse,
	validateRecaptcha,
	validateTurnstile,
} from "@api/forms";
import {
	classNames,
	convertToCamelCase,
	dataUrlToFile,
	getFieldMessageFromTag,
	matchConditionAndValue,
} from "@utils/index";
import FormPasswordModal from "../Modals/FormPasswordModal";

import { nanoid } from "nanoid";
import useS3Upload from "@hooks/useS3Upload";
import useUser from "@hooks/useUser";
import { FormItem, GetFormByIdResponse } from "@api/forms/responses";
import { generateS3SignedUrl } from "@api/upload";
import { InputTypeWithoutIcon } from "../../types";
import { FileWithId } from "../BuilderComponents/Inputs/FileUploadInput";
import FormPage from "./FormPage";
import ParentContainer from "./ParentContainer";

export type FormRendererProps =
	| {
			formId: string;
			templateSlug?: never;
			isTemplatePreview?: never;
			options?: {
				hideBorders?: boolean;
				hideTitle?: boolean;
				embedType?: "iframe" | "popup";
				transparentBackground?: boolean;
			};
			formInitialData?: GetFormByIdResponse | null;
			responseID?: string | null;
	  }
	| {
			formId?: never;
			templateSlug: string;
			isTemplatePreview: true;
			options?: {
				hideBorders?: boolean;
				hideTitle?: boolean;
				embedType?: "iframe" | "popup";
				transparentBackground?: boolean;
			};
			formInitialData?: GetFormByIdResponse | null;
	  };

const FormPersist = ({
	formId,
	watch,
	setValue,
}: {
	formId: string;
	watch: UseFormWatch<FieldValues>;
	setValue: UseFormSetValue<FieldValues>;
}) => {
	useFormPersist(formId, {
		watch,
		setValue,
		storage: window?.localStorage, // default window.sessionStorage
	});

	return <></>;
};

const FormRenderer = ({
	options,
	formInitialData,
	...props
}: FormRendererProps) => {
	const formId = (props as any).formId;
	const responseID = (props as any).responseID;
	const templateSlug = (props as any).templateSlug;
	const isTemplatePreview = (props as any).isTemplatePreview;

	const { data, isLoading, error, isFetching } = useQuery(
		["forms", formId ?? templateSlug],
		() => (isTemplatePreview ? formInitialData : getFormByPublicId(formId)),
		{
			initialData: formInitialData,
			enabled: typeof formId === "string",
		}
	);

	const user = useUser();

	useEffect(() => {
		if (
			!isLoading &&
			data &&
			!user.isLoading &&
			data.data?.options?.visibility === "draft" &&
			user?.data?.data?.id !== data.data.user_id &&
			data.data?.options?.visibility === "draft" &&
			user?.data?.data?.id !== data.data.user_id
		) {
			// The form is a draft, and being access by other user/not signed in user
			toast.error("You don't have permission to access this form");
		}
	}, [data, isLoading, user]);

	const [form, setForm] = useState<
		| (FormItem & {
				inputs: FormItem["body"];
		  })
		| null
	>(() =>
		data?.data
			? {
					...data.data,
					inputs: data.data.body,
			  }
			: formInitialData?.data
			? {
					...formInitialData.data,
					inputs: formInitialData.data.body,
			  }
			: null
	);

	const formMethods = useForm();

	const { watch, setValue, control, getValues, setError, reset } =
		formMethods;

	const formResponse = null;

	const { data: formResponseData } = useQuery(
		["response", responseID],
		() => {
			return getFormResponseById(responseID);
		},
		{
			enabled: typeof responseID === "string",
		}
	);
	useEffect(() => {
		if (data?.data) {
			setForm({
				...data.data,
				inputs: data.data.body,
			});

			data.data.body?.forEach((input) => {
				if (input.defaultValue) {
					setValue(input.id, input.defaultValue);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.data]);

	useEffect(() => {
		if (formResponseData?.data?.response) {
			reset({
				...formResponseData?.data?.response,
			});
		}
	}, [formResponseData]);

	const formValues = useWatch({
		control: control,
	});

	useEffect(() => {
		Object.keys(formValues)?.forEach((key) => {
			// Get input
			const inputItem = [...(data?.data?.body || [])]?.find(
				(item) => item.id === key
			);
			if (inputItem?.conditions && inputItem?.conditions?.length > 0) {
				const originalInputs = (data?.data?.body ?? [])?.map(
					(item) => ({ ...item })
				);

				const newInputs: InputTypeWithoutIcon[] = (
					[] as InputTypeWithoutIcon[]
				).concat(originalInputs);
				inputItem.conditions?.forEach((condition) => {
					const val = formValues[key];
					const res = matchConditionAndValue({
						condition: condition.condition,
						fieldValue: val,
						value: condition.conditionValue,
					});

					const fieldIndex = newInputs?.findIndex(
						(el) => el.id === condition.actionElement
					);
					if (
						newInputs &&
						fieldIndex !== -1 &&
						typeof fieldIndex === "number"
					) {
						switch (condition.action) {
							case "hidden":
								newInputs[fieldIndex].required = res
									? false
									: data?.data?.body?.[fieldIndex].required;

								newInputs[fieldIndex].display = res
									? false
									: data?.data?.body?.[fieldIndex].display;

								break;

							case "shown":
								newInputs[fieldIndex].required =
									data?.data?.body?.[fieldIndex].required;

								newInputs[fieldIndex].display = res
									? true
									: data?.data?.body?.[fieldIndex].display;
								break;

							case "disabled":
								setValue(condition.actionElement, undefined);
								newInputs[fieldIndex].required = res
									? false
									: data?.data?.body?.[fieldIndex].required;
								newInputs[fieldIndex].disabled = res
									? true
									: data?.data?.body?.[fieldIndex].disabled;
								newInputs[fieldIndex].readOnly = res
									? true
									: data?.data?.body?.[fieldIndex].readOnly;
								break;
							case "enabled":
								newInputs[fieldIndex].required =
									data?.data?.body?.[fieldIndex].required;
								newInputs[fieldIndex].disabled = res
									? false
									: data?.data?.body?.[fieldIndex].disabled;
								newInputs[fieldIndex].readOnly = res
									? false
									: data?.data?.body?.[fieldIndex].readOnly;
								break;

							case "required":
								newInputs[fieldIndex].required = res
									? true
									: data?.data?.body?.[fieldIndex].required;

								break;
							case "optional":
								newInputs[fieldIndex].required = res
									? false
									: data?.data?.body?.[fieldIndex].required;

								break;
						}

						setForm(
							(prev) =>
								({
									...prev,
									inputs: newInputs,
									body: newInputs,
								} as any)
						);
					}
				});
			}
		});
	}, [formValues, data?.data]);

	const generateReCaptchaToken = async (): Promise<string> => {
		return new Promise((resolve, reject) => {
			if (typeof window === "undefined" || !(window as any).grecaptcha) {
				return reject(new Error("ReCaptcha not loaded"));
			}
			(window as any).grecaptcha.ready(() => {
				(window as any).grecaptcha
					.execute(
						process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
						{
							action: "submit",
						}
					)
					.then((token: string) => {
						localStorage.setItem("RECAPTCHA_TOKEN", token);
						resolve(token);
					});
			});
		});
	};

	const isReCaptchaEnabled = useMemo(() => {
		return data?.data?.body?.find((el) => el.type === "recaptcha");
	}, [data]);

	const isTurnstileEnabled = useMemo(() => {
		return data?.data?.body?.find(
			(el) => el.type === "cloudflare_turnstile"
		);
	}, [data]);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();
	const [submitted, setSubmitted] = useState(false);

	const { progress, uploadFile, uploadedUrl } = useS3Upload();

	const onSubmitForm = async (data: { [key: string]: any }) => {
		try {
			if (formResponseData?.data?.response) {
				return;
			}
			if (!form?.id) {
				toast.error("Form not found");
				return;
			}

			// Select input value must be one of the options
			const selectInputs = form?.body?.filter(
				(item) => item.type === "select"
			);

			if (selectInputs) {
				const invalidSelects = selectInputs.filter((item) => {
					const value = getValues(item.id);
					if ((item as any).other_option) {
						if (value === "other_option") {
							setError(item.id, {
								message: "Please enter an answer.",
							});
							return true;
						}
						return false;
					}
					if (value) {
						const options = item.options;
						if (!options?.includes(value)) {
							setError(item.id, {
								message: "Please select a valid option",
							});
							return true;
						}
					}
					return false;
				});

				if (invalidSelects?.length > 0) {
					return;
				}
			}

			// Radio input value must be one of the options
			const radioInputs = form?.body?.filter(
				(item) => item.type === "radio"
			);

			if (radioInputs) {
				const invalidRadios = radioInputs.filter((item) => {
					if (item?.answer && item.answer?.length > 0) return false;
					const value = getValues(item.id);
					if (value) {
						const options = item.options;
						return !options?.includes(value);
					}
					return false;
				});

				if (invalidRadios?.length > 0) {
					invalidRadios?.forEach((input) => {
						setError(input.id, {
							message: "Please select a valid option",
						});
					});
					return;
				}
			}

			setIsSubmitting(true);
			if (isReCaptchaEnabled) {
				const token = await generateReCaptchaToken();
				if (!token) {
					toast.error(
						"Failed to validate ReCaptcha. Please refresh the page and try again"
					);
					setIsSubmitting(false);

					return;
				} else {
					const isValid = await validateRecaptcha(token);
					if (!isValid?.valid) {
						toast.error(
							"Failed to validate ReCaptcha. Please refresh the page and try again"
						);
						setIsSubmitting(false);
						return;
					}
					data.recaptcha = {
						...isValid,
						type: "recaptcha",
					};
					setValue("recaptcha.action", isValid.action);
					setValue("recaptcha.score", isValid.score);
					setValue("recaptcha.hostname", isValid.hostname);
				}
			}

			if (isTurnstileEnabled) {
				const turnstileWidgets = document.getElementsByName(
					"cf-turnstile-response"
				);
				if (turnstileWidgets?.length === 0) {
					console.error(
						"[getTurnstileElements] No turnstile widgets were found"
					);
					return;
				}
				const turnstileValue = (turnstileWidgets[0] as HTMLInputElement)
					?.value;

				if (!turnstileValue) {
					toast.error(
						"Failed to validate Cloudflare Captcha. Please refresh the page and try again"
					);
					setIsSubmitting(false);
					return;
				} else {
					const isValid = await validateTurnstile(turnstileValue);
					if (!isValid?.success) {
						toast.error(
							"Failed to validate Cloudflare Captcha. Please refresh the page and try again"
						);
						setIsSubmitting(false);
						return;
					}
					data.turnstile = {
						...isValid,
						type: "turnstile",
					};
					setValue("turnstile", isValid);
				}
			}

			// Check if there are any files to upload
			const fileUploadInputs = form?.body?.filter(
				(item) => item.type === "file"
			);

			if (fileUploadInputs) {
				const pendingUploads = fileUploadInputs.some((item) => {
					const fileItems = data[item.id] as {
						type: "files";
						files: FileWithId[];
					};
					return fileItems?.files?.some((file) => !file.uploaded);
				});

				if (pendingUploads) {
					toast.error(
						"Please wait for all files to finish uploading"
					);
					setIsSubmitting(false);
					return;
				}
			}

			const signatureInputs = form?.body?.filter(
				(input) => input.type === "signature"
			);
			if (signatureInputs && signatureInputs?.length > 0) {
				await Promise.all(
					signatureInputs.map(async (input) => {
						const value = getValues(input.id);
						if (value) {
							const fileId = nanoid();
							const fileItem = dataUrlToFile(
								value,
								`${fileId}-${input.id}-signature-${form.id}.png`
							);

							if (fileItem) {
								const uploadUrl = await generateS3SignedUrl({
									file_name: `${form?.user_id}/${formId}/${fileId}-${input.id}-signature-${form.id}.png`,
									form_id: form.id,
								});

								if (uploadUrl.data) {
									const res = await uploadFile(
										fileItem,
										uploadUrl.data
									);

									if (res.url) {
										data[input.id] = {
											id: fileId,
											provider: "byteforms",
											publicUrl: res.url
												.toString()
												.split("?")[0],
											url: res.url
												.toString()
												.split("?")[0],
											s3Url: res.url
												.toString()
												.split("?")[0],
											name: `${form?.user_id}/${formId}/${fileId}-${input.id}-signature-${form.id}.png`,
											size: fileItem.size,
										} as FileWithId;
									} else {
										console.error(
											"[onSubmit] Failed to upload signature",
											res
										);
										return;
									}
								} else {
									toast.error(
										"There was an error saving your response."
									);
									console.error(
										"[onSubmit] Failed to create file upload url for signature"
									);
									return;
								}
							} else {
								toast.error(
									"There was an error saving your response."
								);
								console.error(
									"[onSubmit] Failed to create file from signature"
								);
								return;
							}
						} else {
							// toast.error(
							// 	"There was an error saving your response."
							// );
							// console.error("[onSubmit] Signature has no value");
							// return;
						}
					})
				);
			}

			// Don't send layout blocks, hidden inputs, disabled inputs
			const inputsToSubmit = form?.body
				?.filter((item) => {
					return item.component !== "layout";
				})
				?.filter((item) => {
					if (
						item.type === "recaptcha" ||
						item.type === "cloudflare_turnstile"
					) {
						return true;
					}
					return item.display !== false;
				})
				?.filter((item) => {
					return item.disabled !== false;
				})
				?.map((item) => item.id);

			const postData = inputsToSubmit?.reduce(
				(acc, key) => ({
					...acc,
					[key]: data[key],
				}),
				{}
			);

			// If there is a "tel" input, check if it is of type object and has a key 'phone_number', with a non-blank value
			// Otherwise, set the input id to null in the postData

			const telInputs = form?.body?.filter(
				(input) => input.type === "tel"
			);

			if (telInputs) {
				telInputs.forEach((input) => {
					const value = getValues(input.id);

					if (
						value &&
						typeof value === "object" &&
						value.phone_number
					) {
						if (value.phone_number.length === 0) {
							if (
								typeof (postData as any)[input.id] ===
								"undefined"
							) {
								(postData as any)[input.id] = {
									country_code: "",
								};
							} else if (
								typeof (postData as any)[input.id] === "object"
							) {
								(postData as any)[input.id].country_code = "";
							}
						}
					} else {
						if (
							typeof (postData as any)[input.id] === "undefined"
						) {
							(postData as any)[input.id] = {
								country_code: "",
							};
						} else if (
							typeof (postData as any)[input.id] === "object"
						) {
							(postData as any)[input.id].country_code = "";
						}
					}
				});
			}
			const res = await submitFormResponse(form?.public_id, postData);
			if (res.status === "success") {
				setIsSubmitting(false);
				setSubmitted(true);
				const message =
					form.options?.thank_you_message &&
					form.options?.thank_you_message?.length > 0
						? form.options?.thank_you_message
						: "Form submitted";
				toast.success(message);

				// clear form persistence
				localStorage.removeItem(form.public_id);

				if (
					form?.options?.redirect_url &&
					typeof form?.options?.redirect_url === "string" &&
					form?.options?.redirect_url?.length > 0
				) {
					setTimeout(() => {
						toast.success("Redirecting...");
						const url = form.options!.redirect_url!;
						router.push(
							url.includes("http") ? url : `http://${url}`
						);
					}, 1000);
				}
			} else {
				toast.error("There was an error submitting the form.");
				console.error("[onSubmit]", res);
			}
			setIsSubmitting(false);
		} catch (err) {
			console.error("[onSubmit]", err);
			const e = err as AxiosError<any>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				if (
					e?.response?.data?.errors &&
					e?.response?.data?.errors?.length > 0
				) {
					e.response.data.errors.forEach((error: any) => {
						if (error.field && error.tag) {
							setError(convertToCamelCase(error.field) as any, {
								message: getFieldMessageFromTag(
									error.tag,
									error.field
								),
							});
						}
					});
				} else {
					toast.error("Something went wrong");
				}
			}
			setIsSubmitting(false);
		}
	};

	const [isFormOpen, setIsFormOpen] = useState(false);

	const [activePageIndex, setActivePageIndex] = useState(0);

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
		// if (form?.options?.page_behaviour === "scroll") {
		const formPageItem = document.getElementById(
			`form-page-index-${currPageIndex - 1}`
		);
		window.scrollTo({
			top: formPageItem?.offsetTop,
			behavior: "smooth",
		});
		// }
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
			// if (form?.options?.page_behaviour === "scroll") {
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

	useEffect(() => {
		if (
			form?.options?.custom_code &&
			form.options.custom_code?.length > 0
		) {
			const head =
				document.head || document.getElementsByTagName("head")[0];

			// Custom code can include script, style, meta, and link tags.
			// Set innerHtml
			head.innerHTML = head.innerHTML + form.options.custom_code;
		}
	}, [form]);

	const [loadFormPersistence, setLoadFormPersistence] = useState(false);

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			!isLoading &&
			data?.data?.options?.draft_submissions === true
		) {
			setLoadFormPersistence(true);
		}
	}, [isLoading, data]);

	if (
		form?.options?.password === "******" &&
		!isFormOpen &&
		typeof form?.public_id === "string"
	) {
		return (
			<FormPasswordModal
				formId={parseInt(router.query.slug as string)}
				publicId={form.public_id}
				closeModal={() => {}}
				isOpen={true}
				onSuccess={() => {
					setIsFormOpen(true);
				}}
			/>
		);
	}

	if (
		submitted &&
		(!form?.options?.redirect_url ||
			form?.options.redirect_url.length === 0)
	) {
		return (
			<>
				<Head>
					<title>
						{`Submitted - ${
							form?.name && form?.name?.length > 0
								? form?.name
								: "Loading Form"
						} | ByteForms`}
					</title>
					<meta
						name="description"
						content={
							(form as any)?.description &&
							(form as any)?.description?.length > 0
								? (form as any)?.description
								: "ByteForms is a form builder that helps you create forms and surveys for free."
						}
					/>
				</Head>

				<ParentContainer form={form} options={options}>
					<>
						{form?.options?.confetti_on_submit && (
							<div
								suppressHydrationWarning
								className="absolute top-1/2 left-1/2"
							>
								{typeof window !== "undefined" && (
									<ConfettiExplosion
										{...{
											force: 0.8,
											duration: 3000,
											particleCount: 250,
											width: window.innerWidth,
										}}
									/>
								)}
							</div>
						)}
						<p>{form?.options?.thank_you_message}</p>

						<button
							className="button-primary mt-4"
							onClick={() => window.close()}
						>
							Close
						</button>
					</>
				</ParentContainer>
			</>
		);
	}

	if (
		!isLoading &&
		data &&
		!user.isLoading &&
		data.data?.options?.visibility === "draft" &&
		user?.data?.data?.id !== data.data.user_id &&
		data.data?.options?.visibility === "draft" &&
		user?.data?.data?.id !== data.data.user_id
	) {
		return (
			<>
				<Head>
					<title>Access denied | ByteForms</title>
				</Head>
				<Toaster />

				<ParentContainer form={form} options={options}>
					<>
						<p>You don't have permission to access this form.</p>
						<button
							className="button-primary mt-4"
							onClick={() => window.close()}
						>
							Close
						</button>
					</>
				</ParentContainer>
			</>
		);
	}

	if (isLoading) {
		return (
			<>
				<Head>
					<title>{`Loading Form | ByteForms`}</title>
					<meta
						name="description"
						content={
							"ByteForms is a form builder that helps you create forms and surveys for free."
						}
					/>
				</Head>

				<ParentContainer
					form={
						{
							...form,
							options: {
								...form?.options,
								form_width: "centered",
							},
						} as any
					}
					options={options}
				>
					<>
						<div className="w-full h-8 bg-gray-200 animate-pulse rounded-md" />

						<div className="w-2/3 h-4 mt-8 bg-gray-200 animate-pulse delay-100 rounded-md" />
						<div className="w-full h-8 mt-2 bg-gray-200 animate-pulse rounded-md delay-100" />

						<div className="w-2/5 h-4 mt-8 bg-gray-200 animate-pulse rounded-md delay-400" />
						<div className="w-full h-12 mt-2 bg-gray-200 animate-pulse rounded-md delay-400" />

						<div className="flex items-center space-x-4 w-full">
							<div className="w-full">
								<div className="w-2/5 h-4 mt-8 bg-gray-200 animate-pulse rounded-md delay-[600]" />
								<div className="w-full h-6 mt-2 bg-gray-200 animate-pulse rounded-md delay-[600]" />
							</div>
							<div className="w-full">
								<div className="w-2/5 h-4 mt-8 bg-gray-200 animate-pulse rounded-md delay-[1000]" />
								<div className="w-full h-6 mt-2 bg-gray-200 animate-pulse rounded-md delay-[1000]" />
							</div>
						</div>
					</>
				</ParentContainer>
			</>
		);
	}

	if (!isLoading && error) {
		return (
			<>
				<Head>
					<title>{`Form not found | ByteForms`}</title>
					<meta
						name="description"
						content={
							"ByteForms is a form builder that helps you create forms and surveys for free."
						}
					/>
				</Head>

				<ParentContainer
					form={
						{
							...form,
							options: {
								...form?.options,
								form_width: "centered",
							},
						} as any
					}
					options={options}
				>
					<>
						<p className="text-xl font-bold">Form not found</p>
						<p className="mt-2  text-sm text-gray-600">
							The form link you have opened is not valid. We could
							not find a form with that link. Please make sure
							that it is correct.
						</p>

						<button
							className="button-secondary mt-4"
							onClick={() => window.close()}
						>
							Close
						</button>
					</>
				</ParentContainer>
			</>
		);
	}

	const pageTitle = `${
		form?.name && form?.name?.length > 0 ? form?.name : "Loading Form"
	} | ByteForms`;

	return (
		<>
			{typeof window !== "undefined" &&
				!isLoading &&
				loadFormPersistence && (
					<FormPersist
						watch={watch}
						formId={formId}
						setValue={setValue}
					/>
				)}

			<Head>
				<title>{pageTitle}</title>
				<meta name="title" content={pageTitle} />

				<meta
					name="description"
					content={
						(form as any)?.description &&
						(form as any)?.description?.length > 0
							? (form as any)?.description
							: "ByteForms is a form builder that helps you create forms and surveys for free."
					}
				/>

				<meta name="title" content={pageTitle} />
				<meta
					name="description"
					content={
						(form as any)?.description &&
						(form as any)?.description?.length > 0
							? (form as any)?.description
							: "ByteForms is a form builder that helps you create forms and surveys for free."
					}
				/>

				<meta property="og:type" content="website" />

				<meta property="og:title" content={pageTitle} />
				<meta
					property="og:description"
					content={
						(form as any)?.description &&
						(form as any)?.description?.length > 0
							? (form as any)?.description
							: "ByteForms is a form builder that helps you create forms and surveys for free."
					}
				/>
				<meta
					property="og:image"
					content={encodeURI(
						`https://cdn.statically.io/og/theme=dark/${pageTitle}.jpg`
					)}
				/>

				<meta property="twitter:card" content="summary_large_image" />
				{/* <meta property="twitter:url" content="https://dev.forms.bytesuite.io/form/U9bWS38xOCA" /> */}
				<meta property="twitter:title" content={pageTitle} />
				<meta
					property="twitter:description"
					content={
						(form as any)?.description &&
						(form as any)?.description?.length > 0
							? (form as any)?.description
							: "ByteForms is a form builder that helps you create forms and surveys for free."
					}
				/>
				<meta
					property="twitter:image"
					content={encodeURI(
						`https://cdn.statically.io/og/theme=dark/${pageTitle}.jpg`
					)}
				/>
			</Head>

			<div
				id="main-renderer"
				suppressHydrationWarning
				className={classNames(
					options?.transparentBackground
						? "bg-transparent"
						: form?.options?.theme === "dark"
						? "bg-black"
						: "bg-gray-50",
					router.asPath.includes("/embed")
						? "h-full"
						: " min-h-screen",
					form?.options?.vertically_centered
						? "flex w-full flex-col justify-center"
						: "",
					options?.embedType === "popup" ? "" : " md:py-0",
					`w-full flex flex-col`
				)}
			>
				<Toaster />

				{!isLoading &&
				options &&
				form?.options?.remove_branding ===
					true ? null : options?.embedType === "popup" ? null : (
					<div className="pointer-events-none fixed right-0 flex bottom-8 z-50">
						<Transition
							appear={true}
							show
							className={classNames("shadow-xl  duration-500")}
							enter="transition linear  transform"
							enterFrom="translate-x-full"
							enterTo="translate-x-0"
							leave="transition linear  transform"
							leaveFrom="translate-x-0"
							leaveTo="translate-x-full"
						>
							<div
								className=" px-4 py-2 border rounded"
								style={{
									background:
										"linear-gradient(45deg, #5f46e530, #7795e2c7)",
									backdropFilter: "blur(1px)",
									borderColor: "#aeaae9",
								}}
							>
								<Link
									href={
										process.env.NEXT_PUBLIC_WEBSITE_URL ??
										"https://dev.forms.bytesuite.io"
									}
								>
									<p className="text-white text-sm font-medium text-right">
										Powered by Byte
										<span className="text-white font-semibold">
											Forms
										</span>
									</p>
									<p className="text-gray-100 text-xs text-right">
										<span>Create your own form </span>
										<span className="font-medium underline">
											for free
										</span>
									</p>
								</Link>
							</div>
						</Transition>
					</div>
				)}

				{form &&
					formPages
						?.filter((item) => item !== null)
						?.sort()
						?.map(
							(page, index) =>
								(!form.options?.page_behaviour ||
									(form.options?.page_behaviour ===
										"one_page" &&
										index === activePageIndex) ||
									form.options?.page_behaviour ===
										"scroll") && (
									<FormPage
										disableReveal={isTemplatePreview}
										key={page ?? index}
										formPages={formPages}
										form={form}
										options={options}
										index={index}
										page={page}
										currentPageSettings={data?.data?.pages?.find(
											(e) => e.page === page
										)}
										formMethods={formMethods}
										goToNextPage={goToNextPage}
										goToPreviousPage={goToPreviousPage}
										onSubmitForm={onSubmitForm}
										readOnly={
											formResponseData?.data?.response
												? true
												: false
										}
									/>
								)
						)}
			</div>
		</>
	);
};

export default FormRenderer;
