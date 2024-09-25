import { BaseResponse } from "../types/responses";

export interface Plan {
	id: number;
	description?: string;
	stripe_price_id: string;
	plan: string;
	currency: string;
	pricing: number;
	pricing_per: string;
	max_forms: number;
	number_of_responses: number;
	allowed_integrations: string[];
	per_file_upload_limit: number;
	total_upload_limit: number;
	remove_branding: boolean;
	password_protected: boolean;
	stop_submissions_after: boolean;
	allowed_inputs: string[];
	email_notifications: boolean;
	draft_submissions: boolean;
	custom_code: boolean;
	support?: string;
	integration_support?: boolean;
}

export interface GetAllPlansResponse extends BaseResponse<Plan[]> {}

export interface GetActiveSubscriptionResponse
	extends BaseResponse<ActiveSubscriptionResponse> {}

export interface GetPlanLimitsResponse
	extends BaseResponse<PlanLimitsResponse> {}

export interface PlanLimitsResponse {
	limits: Limits;
	subscription: Subscription;
}

export interface Limits {
	allowed_inputs: string[];
	allowed_integrations: string[];
	draft_submissions: boolean;
	email_notifications: boolean;
	id: number;
	max_forms: MaxForms;
	number_of_responses: MaxForms;
	password_protected: boolean;
	per_file_upload_limit: number;
	plan: string;
	pricing: number;
	pricing_per: string;
	remove_branding: boolean;
	stop_submissions_after: boolean;
	stripe_price_id: string;
	total_upload_limit: number;
}

export interface MaxForms {
	limit: number;
	value: number;
}

export interface ActiveSubscriptionResponse {
	subscription: Subscription;
}

export interface MaxForms {
	limit: number;
	value: number;
}

export interface Subscription {
	id: number;
	user_id: string;
	stripe_subscription_id: string;
	stripe_customer_id: string;
	stripe_price_id: string;
	start_date: number;
	end_date: number;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at: null;
}

export interface GetSubscriptionsResponse
	extends BaseResponse<Subscription[]> {}

export interface GetSubscriptionResponse extends BaseResponse<Subscription> {}

export interface CreateCheckoutSessionResponse extends BaseResponse<string> {}

export interface GetCheckoutSessionResponse
	extends BaseResponse<CheckoutSession> {}

export interface CheckoutSession {
	after_expiration: null;
	allow_promotion_codes: boolean;
	amount_subtotal: number;
	amount_total: number;
	automatic_tax: AutomaticTax;
	billing_address_collection: string;
	cancel_url: string;
	client_reference_id: string;
	client_secret: string;
	consent: null;
	consent_collection: null;
	created: number;
	currency: string;
	currency_conversion: null;
	customer: Customer;
	customer_creation: string;
	customer_details: CustomerDetails;
	customer_email: string;
	custom_fields: any[];
	custom_text: CustomText;
	expires_at: number;
	id: string;
	invoice: Invoice;
	invoice_creation: null;
	line_items: null;
	livemode: boolean;
	locale: string;
	metadata: Metadata;
	mode: string;
	object: string;
	payment_intent: null;
	payment_link: null;
	payment_method_collection: string;
	payment_method_configuration_details: PaymentMethodConfigurationDetails;
	payment_method_options: null;
	payment_method_types: string[];
	payment_status: string;
	phone_number_collection: PhoneNumberCollection;
	recovered_from: string;
	redirect_on_completion: string;
	return_url: string;
	setup_intent: null;
	shipping_address_collection: null;
	shipping_cost: null;
	shipping_details: null;
	shipping_options: any[];
	status: string;
	submit_type: string;
	subscription: StripeSubscription;
	success_url: string;
	tax_id_collection: null;
	total_details: TotalDetails;
	ui_mode: string;
	url: string;
}

export interface AutomaticTax {
	enabled: boolean;
	status: string;
}

export interface CustomText {
	shipping_address: null;
	submit: null;
	terms_of_service_acceptance: null;
}

export interface Customer {
	address: null;
	balance: number;
	cash_balance: null;
	created: number;
	currency: string;
	default_source: null;
	deleted: boolean;
	delinquent: boolean;
	description: string;
	discount: null;
	email: string;
	id: string;
	invoice_credit_balance: null;
	invoice_prefix: string;
	invoice_settings: null;
	livemode: boolean;
	metadata: null;
	name: string;
	next_invoice_sequence: number;
	object: string;
	phone: string;
	preferred_locales: null;
	shipping: null;
	sources: null;
	subscriptions: null;
	tax: null;
	tax_exempt: string;
	tax_ids: null;
	test_clock: null;
}

export interface CustomerDetails {
	address: Address;
	email: string;
	name: string;
	phone: string;
	tax_exempt: string;
	tax_ids: any[];
}

export interface Address {
	city: string;
	country: string;
	line1: string;
	line2: string;
	postal_code: string;
	state: string;
}

export interface Invoice {
	account_country: string;
	account_name: string;
	account_tax_ids: null;
	amount_due: number;
	amount_paid: number;
	amount_remaining: number;
	amount_shipping: number;
	application: null;
	application_fee_amount: number;
	attempt_count: number;
	attempted: boolean;
	auto_advance: boolean;
	automatic_tax: null;
	billing_reason: string;
	charge: null;
	collection_method: string;
	created: number;
	currency: string;
	customer: null;
	customer_address: null;
	customer_email: string;
	customer_name: string;
	customer_phone: string;
	customer_shipping: null;
	customer_tax_exempt: null;
	customer_tax_ids: null;
	custom_fields: null;
	default_payment_method: null;
	default_source: null;
	default_tax_rates: null;
	deleted: boolean;
	description: string;
	discount: null;
	discounts: null;
	due_date: number;
	effective_at: number;
	ending_balance: number;
	footer: string;
	from_invoice: null;
	hosted_invoice_url: string;
	id: string;
	invoice_pdf: string;
	last_finalization_error: null;
	latest_revision: null;
	lines: null;
	livemode: boolean;
	metadata: null;
	next_payment_attempt: number;
	number: string;
	object: string;
	on_behalf_of: null;
	paid: boolean;
	paid_out_of_band: boolean;
	payment_intent: null;
	payment_settings: null;
	period_end: number;
	period_start: number;
	post_payment_credit_notes_amount: number;
	pre_payment_credit_notes_amount: number;
	quote: null;
	receipt_number: string;
	rendering: null;
	rendering_options: null;
	shipping_cost: null;
	shipping_details: null;
	starting_balance: number;
	statement_descriptor: string;
	status: string;
	status_transitions: null;
	subscription: null;
	subscription_details: null;
	subscription_proration_date: number;
	subtotal: number;
	subtotal_excluding_tax: number;
	tax: number;
	test_clock: null;
	threshold_reason: null;
	total: number;
	total_discount_amounts: null;
	total_excluding_tax: number;
	total_tax_amounts: null;
	transfer_data: null;
	webhooks_delivered_at: number;
}

export interface Metadata {}

export interface PaymentMethodConfigurationDetails {
	id: string;
	parent: string;
}

export interface PhoneNumberCollection {
	enabled: boolean;
}

export interface StripeSubscription {
	application: null;
	application_fee_percent: number;
	automatic_tax: null;
	billing_cycle_anchor: number;
	billing_thresholds: null;
	cancel_at: number;
	cancel_at_period_end: boolean;
	canceled_at: number;
	cancellation_details: null;
	collection_method: string;
	created: number;
	currency: string;
	current_period_end: number;
	current_period_start: number;
	customer: null;
	days_until_due: number;
	default_payment_method: null;
	default_source: null;
	default_tax_rates: null;
	description: string;
	discount: null;
	ended_at: number;
	id: string;
	items: null;
	latest_invoice: null;
	livemode: boolean;
	metadata: null;
	next_pending_invoice_item_invoice: number;
	object: string;
	on_behalf_of: null;
	pause_collection: null;
	payment_settings: null;
	pending_invoice_item_interval: null;
	pending_setup_intent: null;
	pending_update: null;
	schedule: null;
	start_date: number;
	status: string;
	test_clock: null;
	transfer_data: null;
	trial_end: number;
	trial_settings: null;
	trial_start: number;
}

export interface TotalDetails {
	amount_discount: number;
	amount_shipping: number;
	amount_tax: number;
	breakdown: null;
}
