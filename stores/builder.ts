import { create, useStore } from "zustand";
import { InputTypeWithoutIcon } from "../types";
import { FormOptions, PageSettings } from "@api/forms/requests";
import { TemporalState, temporal } from "zundo";

interface FormOptionsState {
	formOptions: FormOptions;
	setFormOptions: (options: FormOptions) => void;
	changeFormOption: (val: { [key: string]: any }) => void;
	reset: () => void;
}

interface FormPagesState {
	selectedPage?: PageSettings | null;
	formPages: PageSettings[];
	pages: number[];

	setFormPages: (pages: PageSettings[]) => void;
	setSelectedPage: (page: PageSettings | null) => void;
	setPages: (pages: number[]) => void;
	reset: () => void;
}

interface BuilderStoreState {
	inputs: InputTypeWithoutIcon[];
	setInputs: (inputs: InputTypeWithoutIcon[]) => void;
	addInput: (input: InputTypeWithoutIcon) => void;
	removeInput: (input: InputTypeWithoutIcon) => void;

	// ChangeProperty of selected input
	changeProperty: (prop: { key: string; value: any }) => void;

	selectedInput: InputTypeWithoutIcon | null;
	setSelectedInput: (input: InputTypeWithoutIcon | null) => void;

	changeInput: (input: InputTypeWithoutIcon) => void;
	reset: () => void;
}

const InitialFormOptionsState: FormOptions = {
	max_submissions: null,
	submit_button_text: "Submit",
	form_width: "centered",
	password: null,
	custom_code: null,
	collect_ip_on_submission: false,
	one_submission_per_email: false,
	redirect_url: null,
	stop_submissions_after: null,
	vertically_centered: false,
	thank_you_message: "Thank you! Your response has been submitted.",
	theme: null,
	confetti_on_submit: false,
	page_behaviour: "one_page",
};

export const useFormOptionsStore = create<FormOptionsState>((set) => ({
	formOptions: InitialFormOptionsState,
	reset: () => {
		set({ formOptions: InitialFormOptionsState });
	},
	setFormOptions: (formOptions) => set({ formOptions }),
	changeFormOption: (val: { [key: string]: any }) =>
		set((state) => ({
			formOptions: {
				...state.formOptions,
				...val,
			},
		})),
}));

const useBuilderStore = create<BuilderStoreState>()(
	temporal(
		(set) => ({
			inputs: [
				// {
				// 	component: "input",
				// 	type: "text",
				// 	label: "Name",
				// 	placeholder: "Enter Name",
				// 	page: 1,
				// 	index: 1,
				// 	id: "text",
				// },
				// {
				// 	component: "input",
				// 	type: "email",
				// 	label: "Email",
				// 	placeholder: "Enter Email",
				// 	page: 1,
				// 	index: 2,
				// 	id: "email",
				// },
			],

			setInputs: (inputs) => set({ inputs }),
			addInput: (input: InputTypeWithoutIcon) =>
				set((state) => ({ inputs: [...state.inputs, input] })),
			removeInput: (input: InputTypeWithoutIcon) =>
				set((state) => ({
					inputs: state.inputs.filter((i) => i.id !== input.id),
				})),

			selectedInput: null,
			setSelectedInput: (input) => set({ selectedInput: input }),

			changeInput: (input) => {
				set((state) => ({
					inputs: state.inputs.map((i) =>
						i.id === input.id ? input : i
					),
				}));
			},

			changeProperty: ({ key, value }) => {
				set((state) => {
					// If no input is selected, return the state as is
					if (!state.selectedInput) return state;

					const tempInputs = [...state.inputs];
					const indexToEdit = tempInputs.findIndex(
						(e) => e.id === state.selectedInput?.id
					);
					if (indexToEdit === -1) {
						console.error(
							"[changeProperty] indexToEdit not found",
							{
								key,
								value,
								selectedInput: state.selectedInput,
								inputs: state.inputs,
							}
						);
						return state;
					}
					let newId = state.selectedInput.id;
					if (tempInputs[indexToEdit]) {
						(tempInputs[indexToEdit] as any)[key] = value;
					}

					return {
						...state,
						inputs: tempInputs,
						selectedInput: {
							...state.selectedInput,
							id:
								key === "label"
									? newId
									: state.selectedInput.id,
							[key]: value,
						},
					};
				});
			},
			reset: () => {
				set({ inputs: [], selectedInput: null });
			},
		}),
		{
			limit: 100,
			partialize: (state) => {
				return {
					inputs: state.inputs,
					// selectedInput: state.selectedInput,
				};
			},
		}
	)
);

export const useBuilderStoreWithUndoRedo = <T>(
	selector: (state: TemporalState<Pick<BuilderStoreState, "inputs">>) => T,
	equality?: (a: T, b: T) => boolean
) => useStore(useBuilderStore.temporal, selector, equality);

export const useFormPagesStore = create<FormPagesState>()(
	temporal(
		(set) => ({
			pages: [1],
			formPages: [
				{
					page: 1,
					page_layout: "none",
					page_type: "form",
				},
			],
			setFormPages: (pages) => set({ formPages: pages }),

			selectedPage: null,
			setSelectedPage: (page) => set({ selectedPage: page }),
			setPages: (pages) => set({ pages }),
			reset: () => {
				set({
					pages: [1],
					formPages: [
						{
							page: 1,
							page_layout: "none",
							page_type: "form",
						},
					],
					selectedPage: null,
				});
			},
		}),
		{
			limit: 100,
			partialize: (state) => {
				return {
					formPages: state.formPages,
				};
			},
		}
	)
);

export const useFormPagesStoreWithUndoRedo = <T>(
	selector: (state: TemporalState<Pick<FormPagesState, "formPages">>) => T,
	equality?: (a: T, b: T) => boolean
) => useStore(useFormPagesStore.temporal, selector, equality);

export default useBuilderStore;
