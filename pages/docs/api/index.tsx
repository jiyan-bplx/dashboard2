import React from "react";
import Navbar from "@components/Navbar";
import Head from "next/head";
import Link from "next/link";
import { CodeBlock, atomOneLight } from "react-code-blocks";
import toast from "react-hot-toast";
import { ClipboardIcon } from "@heroicons/react/24/outline";

const ApiEndpointItem = ({
	description,
	endpoint,
	code,
	outputDescription,
	response,
}: {
	response: any;
	outputDescription: string;
	code: string;
	endpoint: string;
	description: string;
}) => {
	return (
		<div>
			<h4 className="font-medium  mt-4 mb-2">{endpoint}</h4>
			<p className="text-gray-500">{description}</p>
			<CodeBlockWithClipboard code={code} lang="bash" />

			<p className="text-gray-500">{outputDescription}</p>
			<CodeBlockWithClipboard
				code={JSON.stringify(response, null, 4)}
				lang="json"
			/>
		</div>
	);
};

const CodeBlockWithClipboard = ({
	code,
	lang,
}: {
	code: string;
	lang: string;
}) => {
	const copyCodeToClipboard = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(code);
			toast.success("Copied to clipboard");
		} else {
			toast.error("Your browser does not support copying to clipboard");
		}
	};

	return (
		<div
			className="relative bg-[#FAFAFA]"
			style={{
				minHeight: "46px",
			}}
		>
			<button
				className="button-outlined absolute right-2 top-2 "
				onClick={copyCodeToClipboard}
			>
				<ClipboardIcon className="w-4 h-4" />
			</button>
			<CodeBlock
				showLineNumbers={false}
				text={code}
				language={lang}
				theme={atomOneLight}
			/>
		</div>
	);
};
const ApiDocumentation = () => {
	return (
		<>
			<Head>
				<title>API Documentation | ByteForms</title>
			</Head>
			<Navbar />
			<div className="container mx-auto my-16">
				<h1 className="text-3xl font-medium text-center ">
					API Documentation
				</h1>
				<div className="grid grid-cols-6 divide-x mt-8">
					<div className="col-span-1 flex flex-col space-y-2 px-4">
						<Link href="#api_key">API Keys</Link>
						<Link href="#authentication">Authentication</Link>
						<Link href="#errors">Errors</Link>
						<Link href="#endpoints">Endpoints</Link>
						<Link href="#models">Models</Link>
					</div>
					<div className="col-span-5 px-4">
						<h2 className="font-medium text-xl mb-2">REST API</h2>
						<p className="text-gray-500">
							The REST API allows you to send and fetch data from
							a ByteForms form. You can use the API from a script,
							server, or anywhere other than a browser that can
							make HTTP requests.
						</p>

						<h3
							className="font-medium text-lg mt-4 mb-2"
							id="api_key"
						>
							API Keys
						</h3>
						<p className="text-gray-500">
							The API uses API Key, that allows you to access the
							ByteForms API. You can create an API Key from the{" "}
							<Link
								target="_blank"
								href="/profile?tab=account&action=new_api_key"
								className="text-blue-600"
							>
								Account Page
							</Link>
							. API Key is a secret key that should be kept secure
							and should not be shared with anyone. You can create
							multiple API Keys with different names for
							identifying purposes.
						</p>

						<h3
							className="font-medium text-lg mt-4 mb-2"
							id="authentication"
						>
							Authentication
						</h3>
						<p className="text-gray-500">
							ByteForms uses basic authentication for API
							requests. You need to send the API Key in the
							Authorization header of the request. There is no
							need to prefix the API Key with "Bearer". Here is an
							example of how to send the API Key in the
							Authorization header using curl:
						</p>
						<CodeBlockWithClipboard
							code={`curl -X GET "https://api.forms.bytesuite.io/api/form" -H "Authorization: YOUR_API_KEY"`}
							lang="bash"
						/>

						<h3
							className="font-medium text-lg mt-4 mb-2"
							id="errors"
						>
							Errors
						</h3>
						<p className="text-gray-500">
							API errors will return a JSON response with the
							following structure:
						</p>
						<CodeBlockWithClipboard
							code={JSON.stringify(
								{
									message: "You are not logged in",
									status: "fail",
								},
								null,
								4
							)}
							lang="json"
						/>

						<h3
							className="font-medium text-lg mt-4 mb-2"
							id="endpoints"
						>
							Endpoints
						</h3>
						<ApiEndpointItem
							endpoint="GET /api/form"
							description="Returns all the forms created by the user."
							outputDescription="The output will be an array of FormItems"
							code={`curl -X GET "https://api.forms.bytesuite.io/api/form" -H "Authorization: YOUR_API_KEY"`}
							response={{
								data: ["FormItems"],
								status: "success",
							}}
						/>

						<ApiEndpointItem
							endpoint="GET /api/form/{formId}"
							description="Get a specific form using its Id."
							outputDescription="The output will be an FormItem"
							code={`curl -X GET "https://api.forms.bytesuite.io/api/form/{formId}" -H "Authorization: YOUR_API_KEY"`}
							response={{
								data: "FormItem",
								status: "success",
							}}
						/>

						<ApiEndpointItem
							endpoint="GET /api/form/responses/{formId}"
							description="Get responses for a specific form using its Id. You can add additional query parameters like limit (number), order ('asc'/'desc'), query (string), after/before(cursor), etc. to paginate and filter the responses."
							outputDescription="The output will be an array of FormResponseItems."
							code={`curl -X GET "https://api.forms.bytesuite.io/api/form/responses/{formId}" -H "Authorization: YOUR_API_KEY"`}
							response={{
								count: 1,
								cursor: {
									after: null,
									before: null,
								},
								data: ["FormResponseItems"],
								status: "success",
							}}
						/>

						<h3
							className="font-medium text-lg mt-4 mb-2"
							id="models"
						>
							Models
						</h3>

						<h4 className="font-medium  mt-4 mb-2">Form Item</h4>
						{/* <p className="text-gray-500">
							Returns all the forms created by the user.
						</p> */}
						<CodeBlockWithClipboard
							code={JSON.stringify(
								{
									id: 1,
									public_id: "U9bWSax8xO",
									name: "My awesome form",
									body: [
										{
											component: "input",
											type: "text",
											label: "Text",
											placeholder: "Text",
											page: 1,
											index: 0,
											id: "text",
											required: true,
										},
										{
											component: "input",
											type: "tel",
											label: "Phone",
											minLength: 5,
											maxLength: 15,
											placeholder: "Phone",
											page: 1,
											index: 1,
											id: "phone",
											includeCountryCode: false,
										},
										{
											component: "input",
											type: "email",
											label: "Email",
											placeholder: "Email",
											page: 1,
											index: 3,
											id: "email",
										},
									],
									pages: null,
									is_custom: false,
									options: "FormOptions",
									user_id: 1,
									created_at: "2024-01-31T13:23:51.300722Z",
									updated_at: "2024-03-08T04:18:09.322579Z",
									deleted_at: null,
								},
								null,
								4
							)}
							lang="json"
						/>

						<h4 className="font-medium  mt-4 mb-2">Form Options</h4>
						<CodeBlockWithClipboard
							code={JSON.stringify(
								{
									one_submission_per_email: false,
									thank_you_message:
										"Thank you! Your response has been submitted.",
									max_submissions: 0,
									stop_submissions_after: null,
									submit_button_text: "Submit",
									form_width: "centered",
									redirect_url: "",
									password: "",
									theme: "light",
									visibility: "public",
									page_behaviour: "scroll",
									custom_code: "",
									draft_submissions: true,
									remove_branding: false,
									email_notifications: false,
								},
								null,
								4
							)}
							lang="json"
						/>

						<h4 className="font-medium  mt-4 mb-2">
							Form Response Item
						</h4>
						<CodeBlockWithClipboard
							code={`{
		id: 1,
		form_id: 1,
		response: {
			"Field_key": "Field_Value",
			...Other form fields and values
		},
		options: {
			ip: "IP_ADDRESS",
		},
		created_at: "2024-04-15T17:36:40.577929Z",
		updated_at: "2024-04-15T17:36:40.577929Z",
		deleted_at: null,
}`}
							lang="json"
						/>
						<p className="text-sm text-gray-500 my-2">
							Certain fields like File, ReCaptcha, Calendly, etc
							have a different structure in response property, in
							the form of a JSON Object.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ApiDocumentation;
