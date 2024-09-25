import {
	Active,
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Transition } from "@headlessui/react";

import { AxiosError } from "axios";
import debounce from "lodash.debounce";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import InputBlock from "@components/BuilderComponents/InputBlock";
import InputItem from "@components/BuilderComponents/InputItem";

import AddNewPageButton from "@components/BuilderComponents/AddNewPageButton";
import BuilderRightSideBar from "@components/BuilderComponents/BuilderRightSidebar";
import BuilderTopBar from "@components/BuilderComponents/BuilderTopBar";
import FormPageInBuilder from "@components/BuilderComponents/FormPageInBuilder";
import QuizNewBlockSidebar from "@components/BuilderComponents/QuizNewBlockSidebar";
import { PrebuiltBlocks } from "../../data/Prebuilt";
import { FormTemplates } from "../../data/Templates";
import useUser from "@hooks/useUser";
import { createForm, editForm, getAllForms, getFormById } from "@api/forms";
import { PageSettings } from "@api/forms/requests";
import { FormItem } from "@api/forms/responses";
import { getPlanLimits } from "@api/subscriptions";
import { BaseResponse } from "@api/types/responses";
import useBuilderStore, {
	useFormOptionsStore,
	useFormPagesStore,
} from "@store/builder";
import { InputTypeItem } from "../../types";
import {
	checkIfMobile,
	generateIdFromName,
	smoothScrollToId,
} from "@utils/index";

type InputTypeWithoutIcon = Omit<InputTypeItem, "icon">;

const FormBuilderPage = () => {
	const {
		setSelectedInput,
		inputs,
		setInputs,
		reset: resetBuilderStore,
	} = useBuilderStore((state) => state);

	const {
		formOptions,
		setFormOptions,
		reset: resetFormOptionsStore,
		changeFormOption,
	} = useFormOptionsStore((state) => state);

	const {
		pages,
		formPages,
		setPages,
		setFormPages,
		reset: resetFormPagesStore,
	} = useFormPagesStore((state) => state);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const router = useRouter();

	useEffect(() => {
		// Reset all stores when component unmounts
		return () => {
			resetFormOptionsStore();
			resetBuilderStore();
			resetFormPagesStore();
		};
	}, []);

	useEffect(() => {
		if (
			router.isReady &&
			router.query.typeform &&
			typeof router.query.typeform === "string"
		) {
			const item = localStorage.getItem(
				`typeform-${router.query.typeform}`
			);
			if (item) {
				const parsedForm = JSON.parse(item);
				setFormTitle(parsedForm.form.title);
				setInputs(
					parsedForm.fields?.filter(
						(item: InputTypeWithoutIcon) => item.id
					)
				);
				toast.success("Form imported successfully");
			}
		}

		if (
			router.isReady &&
			router.query.ai &&
			typeof router.query.ai === "string"
		) {
			const item = localStorage.getItem(`ai-form-${router.query.ai}`);
			if (item) {
				const parsedForm = JSON.parse(item);
				setFormTitle(parsedForm.data.name);
				const formInputs = parsedForm.data.body?.filter(
					(item: InputTypeWithoutIcon) => item.id
				);
				const formPages = parsedForm?.data?.pages ?? [];
				setInputs(formInputs);
				if (formInputs) {
					removeDupsAndSetPages({
						body: formInputs,
						pages: formPages,
					});
				}
				// toast.success("Form imported successfully");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const { data: allCustomForms } = useQuery("forms", getAllForms, {});

	const user = useUser({
		redirect: true,
	});

	const {
		data: selectedForm,
		isLoading,
		refetch,
	} = useQuery(
		["forms", router.query.formId],
		() =>
			router.query.formId
				? getFormById(parseInt(router.query.formId?.toString()))
				: null,
		{
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchInterval: false,
			refetchOnReconnect: false,
			initialData: allCustomForms?.data?.some(
				(item) => item.id?.toString() === router.query.formId
			)
				? {
						status: "success",
						data: allCustomForms?.data?.find(
							(item) =>
								item.id?.toString() === router.query.formId
						),
				  }
				: null,
			retry(failureCount, error) {
				if ((error as AxiosError)?.response?.status === 404) {
					return false;
				}
				return failureCount < 3;
			},
			enabled:
				router.isReady &&
				typeof router.query.formId === "string" &&
				router.query.formId !== null,
			onError(err) {
				if ((err as AxiosError).response?.status === 404) {
					toast.error("Form not found");
					router.push("/quiz-builder");
				}
			},
		}
	);

	const removeDupsAndSetPages = ({
		body,
		pages,
	}: Pick<FormItem, "body" | "pages">) => {
		const pageIndexes = body?.map((item) => item.page ?? 1) as number[];

		// Remove duplicates
		const items = [
			...(new Set(
				pageIndexes
					?.map((i, index) => {
						return typeof i === "number" ? i : index + 1;
					})
					?.sort()
			) as any),
		];

		const pagesList = items
			.map((i, index) => {
				return typeof i === "number" ? i : index + 1;
			})
			?.sort();

		setPages(pagesList);

		if (pagesList.length !== pages?.length) {
			const formPageList: PageSettings[] = pagesList.map((page) => {
				const pageItem = pages?.find((id) => id.page === page);
				if (pageItem) return pageItem;
				return {
					page,
					page_layout: "none",
					page_type: "form",
					cover_image: null,
				} as PageSettings;
			});
			setFormPages(formPageList);
			// console.log({
			// 	pagesList,
			// 	pages,
			// });
			// const itemsNotInPages = pagesList.filter(
			// 	(item) => !pages?.some((e) => e.page === item)
			// );
			// console.log({
			// 	itemsNotInPages,
			// });
		}
	};

	useEffect(() => {
		const data = selectedForm;
		if (
			data &&
			data.status === "success" &&
			typeof router.query.formId === "string"
		) {
			setFormTitle(data.data?.name || "Untitled Form");
			setInputs(data?.data?.body ?? []);

			if (data.data?.options) {
				setFormOptions(data.data.options);
			}

			if (selectedForm?.data?.body) {
				removeDupsAndSetPages({
					pages: selectedForm.data.pages,
					body: selectedForm.data.body,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedForm, router.query.formId]);

	useEffect(() => {
		if (router.isReady && user.data?.data && selectedForm?.data) {
			if (selectedForm.data.user_id !== user.data.data.id) {
				toast.error("You don't have permission to edit this form");
				router.push("/quiz-builder");
			}
		}
	}, [user, selectedForm, router]);

	useEffect(() => {
		if (router.isReady) {
			const template = router.query.template;
			if (template) {
				const selectedTemplate = FormTemplates.find(
					(item) => item.slug === template
				);
				if (selectedTemplate) {
					setInputs(selectedTemplate.inputs);
					setFormTitle(selectedTemplate.name);
				} else {
					router.push("/quiz-builder");
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const [active, setActive] = useState<Active | null>(null);

	function handleDragStart({ active }: DragStartEvent) {
		setActive(active);
	}

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;

		const activePage =
			active?.data.current?.type === "page"
				? active?.data.current.pageId
				: active?.data?.current?.input?.page ?? 1;
		const overPage =
			over?.data.current?.type === "page"
				? over?.data.current.pageId
				: over?.data?.current?.input?.page ?? 1;

		if (
			typeof activePage === "undefined" ||
			typeof overPage === "undefined" ||
			activePage === null ||
			overPage === null ||
			activePage === overPage
		) {
			return;
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		// Get Page of container on which item is dragged onto
		const pageId = over?.data.current?.sortable?.containerId as
			| string
			| undefined;

		if (pageId) {
			const pageNo = parseInt(pageId.replace("page-", ""));
			const page = formPages.find((item) => item.page === pageNo);
			if (page) {
				// Check if page is of type 'cover
				if (page.page_type === "cover") {
					// Only 'layout' items are allowed to be dragged on to cover pages;
					// CHeck if 'active' element has type of layout

					if (active.data?.current?.input?.component !== "layout") {
						toast.error("Cannot add input elements to cover page.");
						return;
					}
				}
			}
		}

		if (active.data.current?.fromSidebar) {
			const oldIndex = over
				? inputs.findIndex((e) => e.id === over?.data.current?.id)
				: inputs.length;

			// add new input after oldIndex
			const newInput = {
				...active.data.current.input,
				index: oldIndex + 1,
				page:
					over?.data.current?.type === "page"
						? over?.data.current.pageId
						: over?.data?.current?.input?.page ?? 1,
				// id: (inputs.length + 1).toString(),
				id: generateIdFromName(
					active.data.current.input.label ??
						`${active.data.current.input.label.type}${
							inputs.length + 1
						}`,
					inputs
				),
			};

			const newInputs = [
				...inputs.slice(0, oldIndex + 1),
				newInput,
				...inputs.slice(oldIndex + 1).map((input) => ({
					...input,
					index: (input as any).index + 1,
				})),
			];

			setInputs(newInputs);
			setSelectedInput(newInput);
		} else {
			// Sorting between form elements, or rearranging
			if (active.id !== over?.id) {
				const oldIndex = inputs.findIndex((e) => e.id === active?.id);
				const newIndex = inputs.findIndex((e) => e.id === over?.id);

				if (over?.data.current?.type === "page") {
					const allInputs = inputs;
					allInputs[oldIndex].page = over.data.current.pageId;
					setInputs(allInputs);
					return;
				} else {
					if (typeof over?.data?.current?.input?.page === "number") {
						inputs[oldIndex].page =
							over?.data?.current?.input?.page;
					}
				}
				const newInputs = arrayMove(inputs, oldIndex, newIndex);

				setInputs(newInputs);
			}
		}
		setActive(null);
	}

	// const computeNewInputs = () => {
	// 	const newInputs: InputTypeWithoutIcon[] = [
	// 		{
	// 			component: "input",
	// 			type: "text",
	// 			label: "Name",
	// 			placeholder: "Enter Name",
	// 			page: 1,
	// 			id: "text",
	// 		},
	// 		{
	// 			component: "input",
	// 			type: "email",
	// 			label: "Email",
	// 			placeholder: "Enter Email",
	// 			page: 1,
	// 			id: "email",
	// 			required: true,
	// 		},
	// 	];

	// 	const combinedInputs = [...inputs, ...newInputs];

	// 	// Sort combined inputs to ensure Name and Email are on top
	// 	return combinedInputs.sort((a, b) => {
	// 		if (a.label === "Name") return -1;
	// 		if (b.label === "Name") return 1;
	// 		if (a.label === "Email") return -1;
	// 		if (b.label === "Email") return 1;
	// 		return 0;
	// 	});
	// };

	// // useEffect to update inputs state once on mount
	// useEffect(() => {
	// 	const updatedInputs = computeNewInputs();
	// 	setInputs(updatedInputs);
	// }, []);

	// useEffect(() => {
	// 	setInputs([
	// 		{
	// 			component: "input",
	// 			type: "text",
	// 			label: "Name",
	// 			placeholder: "Enter Name",
	// 			page: 1,
	// 			id: "text",
	// 		},
	// 		{
	// 			component: "input",
	// 			type: "email",
	// 			label: "Email",
	// 			placeholder: "Enter Email",
	// 			page: 1,
	// 			id: "email",
	// 			required: true,
	// 		},
	// 	]);
	// }, []);

	const addInput = (
		input:
			| Omit<InputTypeWithoutIcon, "id">
			| (typeof PrebuiltBlocks)[number]["inputs"]
	) => {
		if (Array.isArray(input)) {
			const newInputs = input.map((e, index) => ({
				...e,
				label: (e as any).title ?? e.label,
				placeholder: (e as any).title ?? e.label,
				icon: null,
				max: e.type === "file" ? 10_000 : (e as any).max,
				maxLength:
					e.type === "rating"
						? 5
						: e.type === "file"
						? 1
						: e.maxLength,
				defaultValue: e.type === "rating" ? 2 : (e as any).defaultValue,
				index: inputs?.length + (index + 1),
				// id: (inputs?.length + (index + 1)).toString(),
				id: generateIdFromName(
					e.label ?? `${e.type}${inputs?.length + (index + 1)}`,
					inputs
				),
				page: pages.at(-1) ?? 1,
			}));
			setInputs([...inputs, ...(newInputs as any)]);
		} else {
			if (input.allowOnlyOne) {
				// Check if input of same type exists already
				const exists = inputs.find((item) => item.type === input.type);
				if (exists) {
					toast.error(
						`You can have only one ${input.label} in your quiz`
					);
					return;
				}
			}
			const newInput = {
				...input,
				label: input.title ?? input.label,
				placeholder: input.title ?? input.label,
				icon: null,
				page: pages.at(-1) ?? 1,
				max: input.type === "file" ? 10_000 : (input as any).max,
				maxLength:
					input.type === "rating"
						? 5
						: input.type === "file"
						? 1
						: input.maxLength ?? undefined,
				defaultValue:
					input.type === "rating"
						? 2
						: input.defaultValue ?? undefined,
				index: inputs.length + 1,
				// id: (inputs.length + 1).toString(),
				id: generateIdFromName(
					input.label ?? `${input.type}${inputs.length + 1}`,
					inputs
				),
			};
			setInputs([...inputs, newInput]);

			// if device is mobile, scroll to the input, otherwise, select the input
			if (!checkIfMobile()) {
				setSelectedInput(newInput);
			}

			//wait for the input to be rendered
			setTimeout(() => {
				smoothScrollToId(`input-parent-${newInput.id}`);
				document.getElementById(`name-${newInput.id}`)?.focus();
			}, 100);
		}
	};

	const [formTitle, setFormTitle] = useState("My awesome quiz");

	const [showAddBlockSidebar, setShowAddBlockSidebar] = useState(false);

	const form = useForm({});

	const [isCreating, setIsCreating] = useState(false);

	const publishForm = async (options?: {
		draft?: boolean;
		keepSamePage?: boolean;
	}) => {
		try {
			setIsCreating(true);
			// "draft" or "public"
			const visibility =
				options?.draft === true
					? "draft"
					: options?.draft === false
					? "public"
					: formOptions.visibility;

			// Create the form in specific workspace (if workspace id is provided in url query)
			const workspaceId =
				typeof router.query.workspace === "string" &&
				router.query.workspace.length > 0
					? parseInt(router.query.workspace)
					: undefined;

			const res = await createForm({
				workspace_id: workspaceId,
				name: formTitle,
				is_custom: false,
				body: inputs,
				form_type: "quiz",
				pages: formPages,
				options: {
					...formOptions,
					visibility,
				},
			});
			if (res.status === "success" && res.data) {
				toast.success(
					visibility === "draft"
						? `Form saved as draft.`
						: `Form created successfully`
				);
				setIsCreating(false);
				if (!options?.keepSamePage) {
					router.replace("/dashboard");
				} else {
					router.replace(
						{
							pathname: "/quiz-builder",
							query: {
								formId: res.data.id,
								published:
									visibility === "draft" ? false : true,
							},
						},
						undefined,
						{ shallow: true }
					);
				}
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onCreateForm] Response", res);
				setIsCreating(false);
			}
		} catch (err) {
			console.error("[onCreateForm]", err);
			const e = err as AxiosError<BaseResponse<null>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsCreating(false);
		}
	};

	const saveFormChanges = async (options?: {
		draft?: boolean;
		keepSamePage?: boolean;
	}) => {
		try {
			if (typeof router.query.formId !== "string") {
				toast.error("Invalid form id");
				return;
			}

			setIsCreating(true);

			const res = await editForm(parseInt(router.query.formId), {
				name: formTitle,
				form_type: "quiz",
				body: inputs?.map(({ icon, ...rest }: any) => rest),
				is_custom: false,
				pages: formPages,
				workspace_id: selectedForm?.data?.workspace_id,
				options: {
					...formOptions,
					visibility:
						options?.draft === true
							? "draft"
							: options?.draft === false
							? "public"
							: formOptions.visibility,
				},
			});
			if (res.status === "success") {
				toast.success("Changes saved.");
				setIsCreating(false);
				refetch();
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onEditCustomForm] Response", res);
				setIsCreating(false);
			}
		} catch (err) {
			console.error("[onEditCustomForm]", err);
			const e = err as AxiosError<BaseResponse<null>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsCreating(false);
		}
	};

	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	// const canCreateMoreForms = useMemo(() => {
	// 	if (user?.data?.data?.email) {
	// 		if (planLimits?.data) {
	// 			return (
	// 				planLimits?.data?.limits?.max_forms?.value <
	// 				planLimits?.data?.limits?.max_forms?.limit
	// 			);
	// 		}
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// }, [user, planLimits]);

	const isAvailable = (inputKey: string) => {
		return planLimits?.data?.limits?.allowed_inputs?.includes(inputKey);
	};

	const showInputsNotAvailableToast = () => {
		toast.error(
			"Some of the inputs are not available in your plan. Please upgrade to use them"
		);
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedShowInputsNotAvailableToast = useCallback(
		debounce(showInputsNotAvailableToast, 500),
		[]
	);

	const saveForm = async (options?: {
		draft?: boolean;
		keepSamePage?: boolean;
	}) => {
		if (!planLimits?.data?.limits) {
			console.error("[saveForm] No planLimits");
			return;
		}
		// No formId -> Saving a new form -> Check if can create
		// formId and form is already a draft
		// -> Check if new form is publish

		// if (!options?.draft) {
		// 	if (
		// 		!router.query.formId ||
		// 		(router.query.formId &&
		// 			options?.draft !== true &&
		// 			selectedForm?.data?.options?.visibility === "draft")
		// 	) {
		// 		if (!canCreateMoreForms) {
		// 			toast.error(
		// 				"You have reached the maximum number of forms allowed for your plan"
		// 			);
		// 			return;
		// 		}
		// 	}
		// }

		if (inputs.length === 0) {
			toast.error("Please add atleast one input");
			return;
		}

		if (!options?.draft) {
			const areAllAvailable = inputs.some(
				(input) => !isAvailable(input.type)
			);
			if (areAllAvailable) {
				debouncedShowInputsNotAvailableToast();
				return;
			}

			// Check if there is atleast one input where component !== 'question'
			if (inputs.some((item) => item.component !== "question")) {
				if (inputs.some((item) => item.required) === false) {
					toast.error(
						"Please make atleast one input field required."
					);
					return;
				}
			}

			// Select input should have atleast two options
			const selectInputsWithoutOptions = inputs.filter(
				(item) =>
					(item.type === "select" && !item.options) ||
					(item.options && item.options?.length < 2)
			);

			if (selectInputsWithoutOptions.length > 0) {
				toast.error(
					"Please add atleast two options to the dropdown - " +
						selectInputsWithoutOptions[0].label
				);
				setSelectedInput(selectInputsWithoutOptions[0]);
				return;
			}

			// Radio input should have atleast two options
			const radioInputsWithoutOptions = inputs.filter(
				(item) =>
					(item.type === "radio" && !item.options) ||
					(item.options && item.options?.length < 2)
			);

			if (radioInputsWithoutOptions.length > 0) {
				toast.error(
					"Please add atleast two options to the dropdown - " +
						radioInputsWithoutOptions[0].label
				);
				setSelectedInput(radioInputsWithoutOptions[0]);
				return;
			}

			// Check Calendly integration, make sure it has link
			const calendlyInput = inputs.find(
				(item) => item.type === "calendly"
			);
			if (calendlyInput && !(calendlyInput as any).calendlyUrl) {
				toast.error(
					"Please add a Calendly link to the Calendly integration."
				);
				setSelectedInput(calendlyInput);
				return;
			}

			// Check Google Analytics integration, make sure it has tracking id
			const analyticsInput = inputs.find(
				(item) => item.type === "google_analytics"
			);
			if (analyticsInput && !(analyticsInput as any).trackingId) {
				toast.error(
					"Please add a Tracking ID to the Google Analytics widget."
				);
				setSelectedInput(analyticsInput);
				return;
			}

			// Check Cal integration, make sure it has link
			const calInput = inputs.find((item) => item.type === "cal");
			if (calInput && !(calInput as any).calLink) {
				toast.error(
					"Please add a Cal link to the Cal.com integration."
				);
				setSelectedInput(calInput);
				return;
			}

			// Check Image layout input
			const imageLayoutItem = inputs.find(
				(item) => item.component === "layout" && item.type === "image"
			);

			if (imageLayoutItem && !imageLayoutItem.defaultValue) {
				toast.error("Please select an image");
				setSelectedInput(imageLayoutItem);
				return;
			}

			// Check if Select input has atleast one option
			const hasSelect = inputs.find((item) => item.type === "select");
			if (hasSelect) {
				if (!hasSelect.options || hasSelect.options?.length === 0) {
					form.setError(hasSelect.id, {
						message: "Please add atleast one option",
						type: "value",
					});
					form.setFocus(hasSelect.id);
					toast.error(
						"Please add atleast one option to dropdown - " +
							hasSelect.label
					);
					return;
				}
			}

			// Check if Radio input has atleast one option
			const hasRadio = inputs.find((item) => item.type === "radio");
			if (hasRadio) {
				if (!hasRadio.options || hasRadio.options?.length === 0) {
					form.setError(hasRadio.id, {
						message: "Please add atleast one option",
						type: "value",
					});
					form.setFocus(hasRadio.id);
					toast.error(
						"Please add atleast one option to radio button - " +
							hasRadio.label
					);

					return;
				}
			}
		}

		if (typeof router.query.formId === "string") {
			return saveFormChanges(options);
		} else {
			return publishForm(options);
		}
	};

	// If router.query.formId is not empty,
	// -  form is not a draft -> Don't autosave as draft. It will make a public form draft.
	// -  form is a draft -> Autosave (edit)
	// If router.query.formId is empty, create a new form as draft. Replace router.query.formId to newly created formId. Refetch current Form query to get new data

	const autoSaveFormAsDraft = async () => {
		// Check if existing inputs length is not same as form inputs
		if (selectedForm?.data?.body?.length === inputs.length) {
			console.log("Same inputs");
			return;
		}

		if (!user.data?.data?.email) {
			console.warn("[No email]");
			return;
		}

		if (!router.isReady) {
			console.log("Router is not ready");
			return;
		}
		if (
			router.query.formId &&
			selectedForm?.data?.options?.visibility !== "draft"
		) {
			console.warn(
				"[Not autosaving as draft because form is a public form.]"
			);
			// Not autosaving as draft because form is a public form.
			return;
		}

		if (router.query.formId) {
			// return;
		}

		const toastId = toast.loading("Autosaving", {
			duration: 1000,
		});
		saveForm({ draft: true, keepSamePage: true }).finally(() => {
			toast.dismiss(toastId);
		});
	};

	useEffect(() => {
		if (inputs.length >= 1) {
			autoSaveFormAsDraft();
		}
	}, [inputs]);

	return (
		<div className="bg-gray-100 min-h-screen h-full">
			<Toaster />
			<Head>
				<title>Quiz Builder | ByteForms</title>
			</Head>

			<BuilderTopBar
				type={"quiz"}
				formPages={formPages}
				formTitle={
					formTitle && formTitle?.length > 0
						? formTitle
						: "My awesome quiz"
				}
				saveForm={saveForm}
				isCreating={isCreating}
				selectedForm={selectedForm}
				setShowAddBlockSidebar={setShowAddBlockSidebar}
			/>

			<div className="min-h-full h-full">
				<div className="w-full flex justify-between items-stretch h-full min-h-full ">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDragStart={handleDragStart}
					>
						<DragOverlay>
							{active?.data?.current?.from === "sidebar" ? (
								<InputBlock
									index={-1}
									addInput={() => {}}
									input={active.data.current.input}
									isAvailable={isAvailable(
										active.data.current.input.type
									)}
								/>
							) : null}
							{active?.data?.current?.from === "canvas" ? (
								<div className="bg-white">
									<InputItem
										onDelete={() => {}}
										disableSorting
										isAvailable={isAvailable(
											active.data.current.input.type
										)}
										index={active.data.current.index}
										isSelected
										input={active.data.current.input}
									/>
								</div>
							) : null}
						</DragOverlay>
						<div
							className="hidden lg:block bg-white w-72 h-full flex-shrink-0 px-8 py-8 overflow-y-auto overflow-x-hidden"
							style={{
								maxHeight: "calc(100vh - 4rem)",
							}}
						>
							<QuizNewBlockSidebar
								closeSidebar={() =>
									setShowAddBlockSidebar(false)
								}
								addInput={addInput}
							/>
						</div>
						<Transition
							className={
								"lg:hidden z-50 lg:z-auto absolute inset-0 w-screen h-full lg:flex-shrink-0"
							}
							style={{
								marginLeft: "0rem",
							}}
							show={showAddBlockSidebar}
						>
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="fixed w-screen inset-0 bg-black bg-opacity-25" />
							</Transition.Child>
							<Transition.Child
								className={
									"w-screen md:w-1/2 lg:w-72 bg-white max-h-screen overflow-auto px-8 py-8"
								}
								enter="transition linear duration-200 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition linear duration-200 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<QuizNewBlockSidebar
									disableDragDrop
									closeSidebar={() =>
										setShowAddBlockSidebar(false)
									}
									addInput={(input) => {
										addInput(input);
										setShowAddBlockSidebar(false);
									}}
								/>
							</Transition.Child>
						</Transition>
						<div
							className="overflow-auto w-full  min-h-full h-full"
							style={{
								maxHeight: "calc(100vh - 4rem)",
							}}
						>
							<div className="h-full flex flex-col space-y-6 w-full lg:w-3/4 mx-auto py-8">
								<FormProvider {...form}>
									{pages.map((page, pageIndex) => (
										<FormPageInBuilder
											isLoading={
												isLoading || user.isLoading
											}
											key={pageIndex.toString()}
											page={page}
											pageIndex={pageIndex}
											formTitle={formTitle}
											setFormTitle={setFormTitle}
										/>
									))}
									<AddNewPageButton />

									{/* <pre>
										{JSON.stringify(
											{
												formPages,
												selectedPage,
											},
											null,
											4
										)}
									</pre> */}
								</FormProvider>
							</div>
						</div>
						<BuilderRightSideBar isQuiz />
					</DndContext>
				</div>
			</div>
		</div>
	);
};

export default FormBuilderPage;
