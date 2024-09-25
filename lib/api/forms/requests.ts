import { InputTypeWithoutIcon } from "../../../types";

export interface DeleteMultipleFormResponsesRequest {
	form_id: number;
	response_ids: number[];
}
export interface CheckFormPasswordRequest {
	form_id: string;
	password: string;
}
export interface FormOptions {
	custom_code?: string | null;
	draft_submissions?: boolean | null;
	email_notifications?: boolean | null;
	confetti_on_submit?: boolean | null;
	collect_ip_on_submission?: boolean | null;
	one_submission_per_email?: boolean | null;
	remove_branding?: boolean | null;
	thank_you_message?: string | null;
	max_submissions?: number | null;
	stop_submissions_after?: string | null;
	submit_button_text?: string | null;
	form_width?: string | null;
	redirect_url?: string | null;
	show_result_after_submit?: boolean | null;
	password?: string | null;
	theme?: string | null;
	visibility?: string | null;
	page_behaviour?: "one_page" | "scroll";
	vertically_centered?: boolean;
}

export interface PageSettings {
	page: number;
	page_type: "cover" | "form" | "thank_you";
	page_layout:
		| "background"
		| "left-image"
		| "right-image"
		| "top-image"
		| "none";
	cover_image?: string | null;
}

type FormCreateRequestCommon = {
	workspace_id?: number;
	name: string;
	options?: FormOptions;
};
export type CreateFormRequest =
	| ({
			body: "[]";
			is_custom: true;
			form_type?: "form";
	  } & FormCreateRequestCommon)
	| ({
			is_custom: false;
			form_type?: "form" | "quiz";
			body: Array<InputTypeWithoutIcon>;
			pages: PageSettings[];
	  } & FormCreateRequestCommon);

export interface CreateFormAnalyticsDataRequests {
	form_id: string;
	open_count: boolean;
	analytics_data: boolean;
	os: string;
	device: string;
	browser: string;
}

export interface ShareFormInEmailRequest {
	emails: string[];
}
