import { PaperClipIcon } from "@heroicons/react/20/solid";
import {
	CalendarDaysIcon,
	CheckCircleIcon,
	ChevronUpDownIcon,
	ClockIcon,
	DocumentIcon,
	HashtagIcon,
	MinusIcon,
	PhoneIcon,
	PhotoIcon,
	QueueListIcon,
	StarIcon,
	StopCircleIcon,
} from "@heroicons/react/24/outline";
import { AtSymbolIcon } from "@heroicons/react/24/solid";
import { InputItemExtraProps, InputTypeWithoutIcon } from "../types";
import Icons from "@components/Icons";
import { InputHTMLAttributes } from "react";

export type ExtraParamsType = {
	name: string;
	required?: boolean | null;
	type?: "string" | "number" | "boolean";
	description?: string;
	placeholder?: string;
	additional?: InputHTMLAttributes<HTMLInputElement>;
	showWhen?: (input: InputTypeWithoutIcon) => boolean;
	category: "basic" | "design";
};
export type InputItemType = Omit<InputItemExtraProps, "id"> & {
	component: string;
	type: string;
	label: string;
	title?: string;
	icon: any;
	allowOnlyOne?: boolean;
	// WIP
	tags?: string[];
	category?: keyof typeof InputCategories;
	description?: string;
	version?: number;
	extra_params?: {
		[key: string]: ExtraParamsType;
	};
	marks?: number;
};

export const InputCategories = {
	time: {
		label: "Time",
		icon: <ClockIcon className="w-4 h-4" />,
	},
	rating_ranking: {
		label: "Rating & Ranking",
		icon: <StarIcon className="w-4 h-4" />,
	},
	misc: {
		label: "Miscellaneous",
	},
	text: {
		label: "Text",
		icon: <Icons.TextInput />,
	},
	contact_info: {
		label: "Contact Info",
	},
	media: {
		label: "Media",
	},
	choices: {
		label: "Choices",
	},
	layout: {
		label: "Layout",
	},
	analytics: {
		label: "Analytics",
	},
	scheduling: {
		label: "Scheduling",
	},
	protection: {
		label: "Protection",
	},
};

const LayoutBlocks: InputItemType[] = [
	{
		component: "layout",
		type: "divider",
		label: "Divider",
		icon: <MinusIcon className="w-4 h-4" />,
		category: "layout",
	},
	{
		component: "layout",
		type: "page_title",
		category: "layout",
		label: "Page Title",
		defaultValue: "Page Title",
		icon: <Icons.TextBlock />,
		extra_params: {
			left_aligned: {
				category: "design",
				name: "Left Aligned",
				description:
					"Align the text in the left of the page title block",
				required: false,
				type: "boolean",
			},
		},
	},
	{
		component: "layout",
		type: "text",
		category: "layout",
		label: "Text Block",
		defaultValue:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni laboriosam in ipsam ex, doloribus qui sed minima impedit doloremque ullam aliquam nobis velit cumque rem tenetur beatae at earum sit!",
		icon: <Icons.TextBlock />,
	},
	{
		component: "layout",
		type: "image",
		category: "media",
		label: "Image",
		icon: <PhotoIcon className="w-4 h-4" />,
	},
	{
		component: "layout",
		type: "youtube",
		category: "media",
		label: "Youtube Video",
		description: `Embed YouTube videos in your form`,
		icon: <Icons.Youtube />,
		extra_params: {
			privacy_mode: {
				category: "basic",
				name: "Privacy-enhanced mode.",
				description:
					"Enable privacy-enhanced mode for YouTube embeds (No cookies until clicked)",
				required: false,
				type: "boolean",
			},
			hideControls: {
				category: "basic",
				name: "Hide controls",
				description: "Hide video controls",
				required: false,
				type: "boolean",
			},
		},
	},
	{
		component: "layout",
		type: "gmaps",
		category: "media",
		label: "Google Maps Location",
		description: `Show a Place on map in your form`,
		icon: <Icons.Maps />,
	},
];
const SpecialInputs: InputItemType[] = [
	// {
	// 	component: "special_input",
	// 	type: "razorpay_payment_button",
	// 	label: "Razorpay Payment Button",
	// 	icon: <Icons.RazorpayPaymentButton />,
	// },

	{
		component: "special_input",
		type: "google_analytics",
		label: "Google Analytics",
		allowOnlyOne: true,
		category: "analytics",
		instructions:
			"Google Analytics tracking code will be added to your form.",
		title: "Google Analytics",
		display: false,
		extra_params: {
			tracking_id: {
				category: "basic",
				name: "Google Trackind ID",
				required: true,
				type: "string",
			},
		},
		icon: <Icons.GoogleAnalytics />,
		tags: ["analytics"],
	},
	{
		component: "special_input",
		type: "cal",
		label: "Cal.com",
		allowOnlyOne: true,
		category: "scheduling",
		instructions:
			"You can schedule a meeting with me by clicking the button above.",
		title: "Schedule a meeting (Cal.com)",
		icon: <Icons.Cal />,

		tags: ["calendar", "schedule", "meeting", "event"],
	},
	{
		component: "special_input",
		type: "calendly",
		allowOnlyOne: true,
		category: "scheduling",
		label: "Calendly",
		tags: ["calendar", "schedule", "meeting", "event"],
		instructions:
			"You can schedule a meeting with me by clicking the button above.",
		title: "Schedule a meeting",
		icon: <Icons.Calendly />,
	},
	{
		component: "special_input",
		type: "recaptcha",
		allowOnlyOne: true,
		label: "ReCaptcha",
		category: "protection",
		title: "Secured with ReCaptcha",
		placeholder: "Secured with ReCaptcha",
		icon: <Icons.ReCaptcha />,
	},
	{
		component: "special_input",
		type: "cloudflare_turnstile",
		allowOnlyOne: true,
		category: "protection",
		label: "Cloudflare Turnstile",
		title: "Secured with Cloudflare",
		placeholder: "Secured with Cloudflare",
		icon: <Icons.CloudflareTurnstile />,
	},
];
const QuestionBlocks: InputItemType[] = [
	{
		component: "question",
		type: "radio",
		label: "MCQ",
		category: "choices",
		icon: <StopCircleIcon className="w-4 h-4" />,
		options: ["Option A", "Option B", "Option C", "Option D"],
		answer: ["Option A", "Option C"],
		image: "",
		marks: 1,
	},
	{
		component: "question",
		type: "picture_choice",
		label: "Picture MCQ",
		options: [
			{
				value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Z3JhZGllbnQtYmFja2dyb3VuZC18fHx8fHwxNzEzODg1MDgx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
				label: "Option 1",
			},
			{
				value: "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kJTIwd2F2ZSUyMHBhdHRlcm4lMjBhYnN0cmFjdCUyMHdhbGxwYXBlciUyMGFydHxlbnwwfDB8MHx8fDA%3D",
				label: "Option 2",
			},
			{
				value: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kJTIwd2F2ZSUyMHBhdHRlcm4lMjBhYnN0cmFjdCUyMHdhbGxwYXBlciUyMGFydHxlbnwwfDB8MHx8fDA%3D",
				label: "Option 3",
			},
		] as any,
		title: "Choose an image",
		category: "choices",
		image: "",
		icon: <StopCircleIcon className="w-4 h-4" />,
		answer: "Option 1",
		marks: 1,
	},
];
export const InputTypes: InputItemType[] = [
	...LayoutBlocks,
	...SpecialInputs,
	...QuestionBlocks,
	{
		component: "input",
		type: "text",
		label: "Text",
		category: "text",
		icon: <Icons.TextInput />,
	},
	{
		component: "input",
		type: "number",
		label: "Number",
		category: "text",
		icon: <HashtagIcon className="w-4 h-4" />,
		min: 0,
	},
	{
		component: "input",
		type: "tel",
		label: "Phone",
		category: "contact_info",
		minLength: 5,
		maxLength: 15,
		includeCountryCode: false,
		version: 1,
		extra_params: {
			includeCountryCode: {
				category: "basic",
				name: "Include Country Code",
				description: "Include country code in the phone number",
				required: false,
				type: "boolean",
			},
		},
		icon: <PhoneIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "tel",
		version: 2,
		label: "Phone",
		category: "contact_info",
		placeholder: "Phone v2",
		minLength: 5,
		maxLength: 15,
		includeCountryCode: false,
		extra_params: {
			includeCountryCode: {
				category: "basic",
				name: "Include Country Code",
				description: "Include country code in the phone number",
				required: false,
				type: "boolean",
			},
			allowed_country_codes: {
				category: "basic",
				showWhen: (input) => input.includeCountryCode === true,
				name: "Allowed Countries",
				placeholder: "+91, +1, +44, +61, +971",
				description:
					"Allow only specific country codes (Comma separated values)",
				required: false,
				type: "string",
			},
		},
		icon: <PhoneIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "url",
		label: "Link",
		icon: <PaperClipIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "email",
		label: "Email",
		category: "contact_info",
		icon: <AtSymbolIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "list",
		label: "List Input",
		category: "choices",
		icon: <QueueListIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "signature",
		label: "Signature",
		icon: <Icons.Signature />,
	},
	{
		component: "input",
		type: "date",
		label: "Date",
		category: "time",
		icon: <CalendarDaysIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "time",
		label: "Time",
		category: "time",
		icon: <ClockIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "datetime-local",
		label: "Datetime",
		category: "time",
		icon: <Icons.DateTime />,
	},
	{
		component: "input",
		type: "checkbox",
		category: "choices",
		label: "Checkbox",
		icon: <CheckCircleIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "switch",
		category: "choices",
		label: "Switch",
		icon: <Icons.Switch className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "rating",
		label: "Rating",
		maxLength: 5,
		category: "rating_ranking",
		defaultValue: 2,
		icon: <StarIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "range",
		label: "Slider",
		min: 1,
		category: "rating_ranking",
		max: 10,
		icon: <Icons.Range />,
	},
	{
		component: "input",
		type: "file",
		label: "File",
		icon: <DocumentIcon className="w-4 h-4" />,
		version: 1,
		extra_params: {
			multiple: {
				name: "Multiple files",
				description: "Allow multiple files to be uploaded",
				required: false,
				type: "boolean",
				category: "basic",
			},
		},
	},
	{
		component: "input",
		type: "file",
		label: "File",
		icon: <DocumentIcon className="w-4 h-4" />,
		version: 2,
		extra_params: {
			accept: {
				name: "Allowed file types",
				description: "Comma separated file types",
				required: false,
				category: "basic",
				type: "string",
			},
			multiple: {
				name: "Multiple files",
				description: "Allow multiple files to be uploaded",
				category: "basic",
				required: false,
				type: "boolean",
			},
			// required: {
			// 	name: "Required",
			// 	description: "Allow multiple files to be uploaded",
			// 	required: false,
			// 	type: "boolean",
			// },
		},
	},
	{
		component: "input",
		type: "file",
		label: "File",
		icon: <DocumentIcon className="w-4 h-4" />,
		version: 3,
		extra_params: {
			accept: {
				name: "Allowed file types",
				description: "Comma separated file types",
				category: "basic",
				required: false,
				type: "string",
			},
			multiple: {
				name: "Multiple files",
				description: "Allow multiple files to be uploaded",
				category: "basic",
				required: false,
				type: "boolean",
			},
			maxLength: {
				placeholder: "Maximum no. of files",
				showWhen: (input) => input.multiple === true,
				name: "Max no. of files",
				description: "Maximum no. of files",
				category: "basic",
				required: false,
				type: "number",
				additional: {
					max: 10,
					min: 1,
				},
			},
			// required: {
			// 	name: "Required",
			// 	description: "Allow multiple files to be uploaded",
			// 	required: false,
			// 	type: "boolean",
			// },
		},
	},
	{
		component: "input",
		type: "select",
		label: "Dropdown",
		category: "choices",
		options: ["Option 1", "Option 2"],
		icon: <ChevronUpDownIcon className="w-4 h-4" />,
	},
	{
		component: "input",
		type: "radio",
		label: "Radio",
		category: "choices",
		icon: <StopCircleIcon className="w-4 h-4" />,
		options: ["Option 1", "Option 2"],
	},
	{
		component: "input",
		type: "picture_choice",
		label: "Picture Choice",
		options: [
			{
				value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Z3JhZGllbnQtYmFja2dyb3VuZC18fHx8fHwxNzEzODg1MDgx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
				label: "Option 1",
			},
			{
				value: "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kJTIwd2F2ZSUyMHBhdHRlcm4lMjBhYnN0cmFjdCUyMHdhbGxwYXBlciUyMGFydHxlbnwwfDB8MHx8fDA%3D",
				label: "Option 2",
			},
			{
				value: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kJTIwd2F2ZSUyMHBhdHRlcm4lMjBhYnN0cmFjdCUyMHdhbGxwYXBlciUyMGFydHxlbnwwfDB8MHx8fDA%3D",
				label: "Option 3",
			},
		] as any,
		title: "Choose an image",
		category: "choices",
		icon: <Icons.TextInput />,
	},
];
