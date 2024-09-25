import jsdom from "jsdom";

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { InputTypeItem, InputTypeWithoutIcon } from "../../types";

type TypeformInputs =
	| "date"
	| "email"
	| "legal"
	| "long_text"
	| "number"
	| "short_text"
	| "phone_number"
	| "website"
	| "yes_no"
	| "rating"
	| "multiple_choice"
	| "nps"
	| "opinion_scale"
	| "statement"
	| "calendly"
	| "contact_info"
	| "dropdown"
	| "file_upload"
	| "group"
	| "matrix"
	| "payment"
	| "picture_choice"
	| "ranking";

export const getByteFormsInputFromTypeformInput = (
	field: FormField
): (InputTypeWithoutIcon | InputTypeWithoutIcon[]) | null | undefined => {
	const commonProps = {
		component: "input",
		label: field.title,
		about: field.properties.description,
		id: field.ref,
		required: field.validations?.required,
		min: field.validations?.min_value,
		max: field.validations?.max_value,
		multiple: field.properties.allow_multiple_selection,
		options: field.properties.choices?.map((choice) => choice.label),
		placeholder: field.title,
		attachment: field.attachment?.href,
	};
	if (field.type === "statement") {
		return {
			type: "text",
			defaultValue: field.title,
			...commonProps,
			component: "layout",
		};
	}
	if (field.type === "website") {
		return {
			type: "url",
			...commonProps,
		};
	}

	if (field.type === "date") {
		return {
			type: "date",
			...commonProps,
		};
	}

	if (field.type === "number") {
		return {
			type: "number",
			...commonProps,
		};
	}

	if (field.type === "short_text") {
		return {
			type: "text",
			...commonProps,
		};
	}

	if (field.type === "long_text") {
		return {
			type: "textarea",
			...commonProps,
		};
	}

	if (field.type === "email") {
		return {
			type: "email",
			...commonProps,
		};
	}

	if (field.type === "legal") {
		return {
			type: "checkbox",
			...commonProps,
		};
	}

	if (field.type === "yes_no") {
		return {
			type: "select",
			...commonProps,
			options: ["Yes", "No"],
		};
	}

	if (field.type === "rating") {
		return {
			type: "rating",
			...commonProps,
			maxLength: field.properties.steps,
		};
	}

	if (field.type === "nps") {
		return {
			type: "rating",
			...commonProps,
			maxLength: field.properties.steps,
		};
	}

	if (field.type === "opinion_scale") {
		return {
			type: "rating",
			...commonProps,
			maxLength: field.properties.steps,
		};
	}

	if (field.type === "dropdown") {
		return {
			type: "select",
			...commonProps,
			options: field.properties.choices?.map((choice) => choice.label),
		};
	}

	if (field.type === "multiple_choice") {
		return {
			type: "select",
			...commonProps,
			multiple: field.properties.allow_multiple_selection,
			options: field.properties.choices?.map((choice) => choice.label),
		};
	}

	if (field.type === "contact_info") {
		return field.properties.fields
			?.map((subfield) => {
				return getByteFormsInputFromTypeformInput(subfield as any);
			})
			.map((item) => ({
				...commonProps,
				...item,
				groupId: field.ref,
			})) as any;
	}

	if (field.type === "group") {
		return field.properties.fields
			?.map((subfield) => {
				return getByteFormsInputFromTypeformInput(subfield as any);
			})
			.map((item) => ({
				...commonProps,
				...item,
				groupId: field.ref,
			})) as any;
	}
};

const mapInputs = (inputs: FormField[]) => {
	return inputs
		.map((input) => {
			const image: InputTypeWithoutIcon | null = input.attachment?.href
				? {
						component: "layout",
						type: "image",
						label:
							input.attachment?.properties?.description ??
							"Image",
						id: input.attachment.href,
						defaultValue: input.attachment.href,
				  }
				: null;
			const byteFormsInput = getByteFormsInputFromTypeformInput(input);
			if (byteFormsInput) {
				if (image) {
					return [byteFormsInput, image];
				}
				return byteFormsInput;
			}
			return null;
		})
		?.flat()
		?.filter((item) => (item as InputTypeWithoutIcon)?.id);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	let url = req.query.url;

	if (!url || typeof url !== "string") {
		return res.status(400).send("No url provided");
	}
	if (!url.includes("typeform")) {
		return res.status(400).send("Invalid URL");
	}

	const page = await axios.get(url);

	const dom = new jsdom.JSDOM(page.data, {
		runScripts: "dangerously",
	});

	// get script tags
	const scripts = dom.window.document.querySelectorAll("script");

	let scriptWithData: HTMLScriptElement | undefined = undefined;
	scripts.forEach((script) => {
		if (script.innerHTML?.includes("window.rendererData = {")) {
			scriptWithData = script;
		}
	});

	if (!scriptWithData) {
		return res.status(400).send("No data found");
	}

	const rendererData: RendererData = dom.window.eval(
		"rendererData"
	) as RendererData;

	return res.status(200).send({
		fields: mapInputs(rendererData.form.fields).filter(
			(field): field is InputTypeItem => field !== null
		),
		form: rendererData.form,
	});
};

export default handler;
// Generated by https://quicktype.io

export interface TypeformResponse {
	rendererData: RendererData;
}

export interface RendererData {
	accountFeatureFlags: AccountFeatureFlags;
	accessScheduling: AccessScheduling;
	analytics: Analytics;
	featureFlags: FeatureFlags;
	form: Form;
	hubspotIntegration: Analytics;
	integrations: any[];
	intents: IntentElement[];
	readingDirection: string;
	messages: { [key: string]: string };
	rootDomNode: string;
	scriptModernSrc: string;
	serverTimestamp: number;
	showBranding: boolean;
	timeToComplete: number;
	features: any[];
	abTests: AbTests;
}

export interface AbTests {
	"AB_PulseSurvey_Respond_RESP-1091": string;
}

export interface AccessScheduling {
	closeScreenData: Analytics;
	isFormClosed: boolean;
}

export interface Analytics {}

export interface AccountFeatureFlags {
	"AB_BrandKit_CRT-808": string;
	"AB_CriticalDataCollection_RESP-2108": string;
	"AB_EnterpriseT1_AutoFireOnEmailVerification_MED-3964": string;
	"AB_ImportWizardV1_PX-902": string;
	"AB_Logo_Resize_And_Positioning_RESP-1874": string;
	"AB_Multi_Language_Forms_RESP-1790": string;
	"AB_Next_Gen_Followups_MVP_PI-1531": string;
	"AB_PausePlanFeedbackPrice_CUCHURN-315": string;
	"AB_PricingVersionFour_AutoFireOnEmailVerification_MED-3756": string;
	"AB_QualityAssessment_GPTModel_PX-764": string;
	"AB_RevampFreeToPayNudges_PX-823": string;
	"AB_ReverseTrialDuration_MED-3658": string;
	"AB_ReverseTrialInitiative_AutoFireOnEmailVerification_MED-3240_v1": string;
	"AB_ShowcaseEnterprise_v2_WEB-6136_FSTRY": string;
	"AB_SmartPublishPaywall_TU-243": string;
	"AB_TheCordButton_UA-2389": string;
	"AB_UndoRedo_CRT-1609": string;
	"CancellationSuccessPage_CUCHURN-138": boolean;
	"DataAccessPlanMigration_MED-3809": boolean;
	"DowngradeToFreePlan_CUCHURN-93": string;
	"EUDataRegion_PROS-293": string;
	"FallPromo2023_MED-4000": string;
	"HelpChat_tier-1_CUCHURN-1": string;
	"HelpChat_tier-2_CUCHURN-1": string;
	"HelpChat_tier-3_CUCHURN-1": string;
	"OS-4299-ssplans-viewer-seats": boolean;
	"PausedPlanPhase3_CUCHURN-230": boolean;
	"RolloutNewAccountFeatureSetHandler_MED-3990": string;
	"UA-491_AccountRestrictions_New": boolean;
	"account.AB_BrandKitEnforcemenToggle_CRT-1595": string;
	"account.ua-2798.feature.workspace-viewer": boolean;
	"account.ua-2845.feature.organization-viewer": boolean;
	"account.ua-3451.feature.organization-viewer-settings": boolean;
	"organization.ua-4144.feature.last-active-column": boolean;
}

export interface FeatureFlags {
	"AB_PreventEarlyCalculations_Personalization_PER-294": boolean;
	"AB_PulseSurvey_Respond_RESP-1091": boolean;
	"AB_Surfaces_Analytics_Migration_INT-3526": boolean;
	"AB_Surfaces_BlockApp_Submission_INT-3440": boolean;
	"CUI-Deprecation_RESP-1735": boolean;
	Renderer_Animation_Improvements: boolean;
	"SP-1317-csp-reporturi": boolean;
	"beta-testers": boolean;
	"cookie-consent-phase-2": boolean;
	"datadog-rum-client-tracking": boolean;
	"dist-94-subdomain-redirect-warning-page": number;
	example: string;
	"res-906-enable-insights-tracking": boolean;
	"track-desktop-activity": boolean;
}

export interface Form {
	id: string;
	type: string;
	title: string;
	workspace: Workspace;
	theme: Theme;
	settings: Settings;
	thankyou_screens: ThankyouScreen[];
	fields: FormField[];
	_links: Links;
}

export interface Links {
	display: string;
	responses: string;
}

export interface FormField {
	id: string;
	title: string;
	ref: string;
	properties: PurpleProperties;
	application?: Application;
	validations?: FluffyValidations;
	type: TypeformInputs;
	applicationInfo?: ApplicationInfo;
	attachment?: FieldAttachment;
	layout?: Layout;
}

export interface Application {
	id: string;
	application_block_id: string;
	installation_id: string;
	iframe_url: string;
	inputs: Input[];
}

export interface Input {
	value: string;
	label: string;
	ref: string;
}

export interface ApplicationInfo {
	logo: string;
	title: string;
}

export interface FieldAttachment {
	type: string;
	href: string;
	properties: AttachmentProperties;
}

export interface AttachmentProperties {
	description: string;
}

export interface Layout {
	type: string;
	attachment: FieldAttachment;
	viewport_overrides: Analytics;
}

export interface PurpleProperties {
	description?: string;
	fields?: PropertiesField[];
	separator?: string;
	structure?: string;
	default_country_code?: string;
	button_text?: string;
	hide_marks?: boolean;
	randomize?: boolean;
	allow_multiple_selection?: boolean;
	allow_other_choice?: boolean;
	vertical_alignment?: boolean;
	choices?: Choice[];
	alphabetical_order?: boolean;
	shape?: string;
	steps?: number;
	start_at_one?: boolean;
}

export interface Choice {
	id: string;
	ref: string;
	label: string;
}

export interface PropertiesField {
	id: string;
	title: string;
	ref: string;
	subfield_key?: string;
	properties: FluffyProperties;
	validations: PurpleValidations;
	type: string;
}

export interface FluffyProperties {
	default_country_code?: string;
	randomize?: boolean;
	allow_multiple_selection?: boolean;
	allow_other_choice?: boolean;
	vertical_alignment?: boolean;
	choices?: Choice[];
}

export interface PurpleValidations {
	required: boolean;
	max_length?: number;
}

export interface FluffyValidations {
	required: boolean;
	min_value?: number;
	max_value?: number;
}

export interface Settings {
	language: string;
	progress_bar: string;
	meta: Meta;
	hide_navigation: boolean;
	is_public: boolean;
	is_trial: boolean;
	show_progress_bar: boolean;
	show_typeform_branding: boolean;
	are_uploads_public: boolean;
	show_time_to_complete: boolean;
	show_number_of_submissions: boolean;
	show_cookie_consent: boolean;
	show_question_number: boolean;
	show_key_hint_on_choices: boolean;
	autosave_progress: boolean;
	free_form_navigation: boolean;
	use_lead_qualification: boolean;
	pro_subdomain_enabled: boolean;
	capabilities: Capabilities;
}

export interface Capabilities {
	e2e_encryption: E2EEncryption;
}

export interface E2EEncryption {
	enabled: boolean;
	modifiable: boolean;
}

export interface Meta {
	allow_indexing: boolean;
}

export interface ThankyouScreen {
	id: string;
	ref: string;
	title: string;
	type: string;
	properties: ThankyouScreenProperties;
	attachment?: ThankyouScreenAttachment;
}

export interface ThankyouScreenAttachment {
	type: string;
	href: string;
}

export interface ThankyouScreenProperties {
	show_button: boolean;
	share_icons: boolean;
	button_mode: string;
	button_text: string;
}

export interface Theme {
	id: string;
	font: string;
	name: string;
	created_at: string;
	updated_at: string;
	has_transparent_button: boolean;
	colors: Colors;
	visibility: string;
	screens: Fields;
	fields: Fields;
	rounded_corners: string;
}

export interface Colors {
	question: string;
	answer: string;
	button: string;
	background: string;
}

export interface Fields {
	font_size: string;
	alignment: string;
}

export interface Workspace {
	href: string;
}

export interface IntentElement {
	id: string;
	intent: IntentEnum;
	score: number;
}

export enum IntentEnum {
	Abstain = "ABSTAIN",
	Legal = "LEGAL",
}
