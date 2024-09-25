const generateAmp = (form: GetFormByIdResponse["data"]) => {
	const htmlStart = `<!DOCTYPE html>
    <html ⚡4email data-css-strict>
    <head>
      <meta charset="utf-8" />
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
      <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
      <script async custom-element="amp-bind" src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"></script>

		<style amp4email-boilerplate>
			body {
				visibility: hidden;
			}
		</style>
      	<style amp-custom>
		  h1 {
			text-align: center;
			font-weight: 500;
			margin: 1rem;
		}
		table {
		  padding-right: 1.5rem;
		}
		.sample-form {
			margin-bottom: 2rem;
			display: grid;
			gap: 12px;
			width: auto;
			border: 1px solid rgba(107, 114, 128, 0.2);
			background-color: white;
			max-width: 32rem /* 512px */;
			margin-left: auto;
			border-radius: 0.25rem /* 4px */;
			padding-left: 1.5rem /* 24px */;
			padding-right: 1.5rem /* 24px */;
			padding-top: 0.5rem /* 32px */;
			padding-bottom: 0.5rem /* 32px */;
			margin-right: auto;
		}

		@media (min-width: 768px) {
			.sample-form {
				max-width: 42rem;
			}
		}

		form.amp-form-submit-error > input {
			display: none;
		}

		* {
			font-family: Arial, Helvetica, sans-serif;
		}

		.custom {
			padding-top: 4px;
		}

		.body-parent {
			padding-left: 16px;
			padding-right: 16px;
		}

		.label {
			font-size: 1rem /* 12px */;
			line-height: 1rem /* 16px */;
			font-weight: 500;
			line-height: 1.5rem /* 24px */;
		}

		.required {
			margin-left: 2px;
			color: rgb(239, 68, 68);
			font-size: 1rem /* 16px */;
			line-height: 1.5rem /* 24px */;
		}

		.input {
			color: rgb(17, 24, 39);
			background-color: white;
			border: solid 1px rgb(209, 213, 219);
			display: block;
			width: 100%;
			border-radius: 6px;
			padding-top: 0.5rem /* 8px */;
			padding-bottom: 0.5rem /* 8px */;
			padding-left: 0.75rem /* 12px */;
			padding-right: 0.75rem /* 12px */;
			margin-top: -12px;
		}

		tr > td {
		}

		.field-caption {
			color: rgb(156, 163, 175);
			font-size: 14px;
			margin-top: 4px;
		}

		input[type="submit"] {
		    margin-top: 2rem;
			border-radius: 0.375rem /* 6px */;
			background-color: rgb(79, 70, 229);
			color: white;
			justify-content: center;
			padding-left: 1rem /* 16px */;
			padding-right: 1rem /* 16px */;
			padding-top: 0.5rem /* 8px */;
			padding-bottom: 0.5rem /* 8px */;
			border-color: transparent;
			font-weight: 600;
			line-height: 1rem /* 16px */;
			font-size: 16px;
		}

		.button-secondary {
			display: inline-flex;
			align-items: center;
			border-radius: 0.375rem /* 6px */;
			background-color: rgb(224, 231, 255);
			color: rgb(67, 56, 202);
			justify-content: center;
			padding-left: 1rem /* 16px */;
			padding-right: 1rem /* 16px */;
			padding-top: 0.5rem /* 8px */;
			padding-bottom: 0.5rem /* 8px */;
			border-color: transparent;
			line-height: 1rem /* 16px */;
		   font-size: 12px;
		}

		input[type="submit"]:hover {
			background-color: rgb(67, 56, 202);
		}
		.body-parent {
			padding-left: 1.5rem /* 24px */;
			padding-right: 1.5rem /* 24px */;
			background-color: #f9fafb;
			padding-top: 1.5rem /* 10px */;
			padding-bottom: 1.5rem /* 10px */;
		}
	</style>
    </head>
    <body class="body-parent">
      <form class="sample-form" method="post" action-xhr="https://dev.api.bytesuite.io/ramp/${form?.public_id}">
      <h1>${form?.name}</h1>

      <table style="width:100%">
      `;

	const htmlEnd = `<tr><td align="center"><input type="submit" value="Submit" 
	style="font-size: 12px; text-decoration: none"
	/></td></tr>
    <tr><td align="center"><a href="https://forms.bytesuite.io/form/${
		form?.public_id
	}" class="button-secondary" style="text-decoration: none;" >
      View in browser
    </a></td></tr>

    </table>

    <div submit-success>
        ${
			form?.options?.thank_you_message ??
			"Thank you for submitting the form."
		}
    </div>
    <div submit-error>
      <template type="amp-mustache">
        {{#verifyErrors}}
          <p>{{message}}</p>
        {{/verifyErrors}} {{^verifyErrors}}
          <p>Something went wrong. Try again later?</p>
        {{/verifyErrors}}
        <p>Submission failed</p>
      </template>
    </div>
	<a href="https://forms.bytesuite.io/" style="margin-left: auto; margin-right: auto; margin-top: 20px;">
	<div>
		<amp-img src="https://forms.bytesuite.io/byteformslogo.png"
        width="132"
        height="32"
        alt="ByteForms" style="margin-left: 10px"></amp-img>
	</div>
	<p style="text-align: center; color: rgb(31,41,55); font-size: 0.75rem; margin-left: -12px;">
		<span>Create your own form </span><span class="font-medium underline">for free</span>
	</p>
</a>
  </form>
</body>
</html>`;

	let htmlForm = ``;
	for (let index = 0; index < form!.body!.length; index++) {
		const element = form?.body?.[index] as InputTypeWithoutIcon;

		//         <table style="width:100%">
		//   <tr>
		//     <td>Alfreds Futterkiste</td>
		//   </tr>
		//   <tr>
		//     <td>Centro comercial Moctezuma</td>
		//   </tr>
		// </table>
		const elementStart = `
            <tr>
                <td class="input-container">
                    <p class="label">
                        ${
							element.hideFieldLabel
								? ""
								: `<span>${element.label}</span>`
						}
                        ${
							element.required
								? `<span class="required">*</span>`
								: ""
						}
                    </p>
                </td>
            </tr>`;

		const elementEnd =
			(element.minLength && element.minLength > 0
				? `
<tr style="margin-top: 0px; margin-bottom: 0px;">
	<td>
		<p class="field-caption" style="float: right; margin-bottom: 0px;">
			${
				element.minLength && element.maxLength
					? `${element.minLength}/${element.maxLength} characters`
					: element.minLength
					? `Min. ${element.minLength} characters`
					: element.maxLength
					? `Max. ${element.maxLength} characters`
					: ""
			}
		</p>
	</td>
</tr>
`
				: "") +
			(element.instructions && element.instructions.length > 0
				? `
				<tr style="margin-top: 0px; margin-bottom: 0px;">
                <td>
                    <p class="field-caption">
                        ${element.instructions}
                    </p>
                </td>
            </tr>
        `
				: "") +
			``;
		let elementHtml = ``;

		const commonProps = `
                        id="${element.id}"
                        name="${element.id}"
                        placeholder="${
							typeof element.placeholder === "string" ? "" : ""
						}"
                        ${element.required ? "required" : ""} 
                        ${
							element.defaultValue
								? `value="${element.defaultValue}"`
								: ""
						}
                        ${
							element.minLength
								? `minlength="${element.minLength}"`
								: ""
						}
                        ${
							element.maxLength
								? `maxlength="${element.maxLength}"`
								: ""
						}
                        ${element.min ? `min="${element.min}"` : ""}
                        ${element.max ? `max="${element.max}"` : ""}`;

		switch (element!.type) {
			case "textarea":
				elementHtml += `
                    ${elementStart}
                    <tr style="margin-top: 0px; margin-bottom: 0px;">
                        <td>
                            <textarea class="input" ${commonProps}
                            ></textarea>
                        </td>
                    </tr>
                    ${elementEnd}`;

			case "text":
			case "number":
			case "url":
			case "email":
			case "date":
			case "time":
			case "datetime-local":
			case "week":
			case "month":
			case "year":
			case "range":
				elementHtml += `
                ${elementStart}
            <tr>
                <td>
                    <input class="input" type="${element.type}" ${commonProps}
                    />
                </td>
            </tr>
            ${elementEnd}`;
				break;

			case "rating":
				elementHtml += `
                ${elementStart}
            <tr>
                <td>
                    <input class="input" type="range" ${commonProps}
                    />
                </td>
            </tr>
            ${elementEnd}`;
				break;

			case "switch":
			case "checkbox":
				elementHtml += `
            <tr style="margin-bottom: -10px;">
                <td style="margin-bottom: -10px;">
                    <table style="margin-top: -10px; margin-bottom: -10px;">
                        <tr style="margin-bottom: -10px;">
                            <td style="width: 10px; margin-bottom: -10px;">
                                <input type="checkbox" id="${
									element.id
								}" name="${element.id}" ${
					element.defaultValue === true ? "checked" : ""
				} />
                            </td>
                            <td>
                                <p class="label" style="margin-left: 4px;" >
                                    ${element.label}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
                ${elementEnd}
            </tr>
            `;
				break;

			// case "tel":

			case "select":
				elementHtml += `${elementStart}
            <tr>
                <td class="input-container">
                    <select class="input" name="${element.id}" id="${element.id}">`;
				element.options?.forEach(
					(opt: any) =>
						(elementHtml += `
                            <option value="${opt}" id="${element.id}" ${
							element.defaultValue === opt ? "checked" : ""
						}>${opt}</option>`)
				);
				elementHtml += `
                        </select>
                </td>
            </tr>
            ${elementEnd}`;
				break;
			case "radio":
				elementHtml += `${elementStart}
                `;
				element.options?.forEach(
					(opt: any) =>
						(elementHtml += `
                <tr>
                    <td>
					<table style="margin-top: -10px; margin-bottom: -10px;">
                            <tr>
                                <td style="width: 10px;">
                                    <input type="radio" value="${opt}" id="${
							element.id
						}" name="${element.id}" ${
							element.defaultValue === opt ? "checked" : ""
						}/>
                                </td>
                                <td>
                                    <p class="label" style="margin-left: 4px;" >${opt}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                `)
				);
				elementHtml += `
            </tr>${elementEnd}`;
				break;
			// <input type="radio" id="cat" name="favourite animal" value="cat" checked>
			// <label for="cat">Cat</label>
			// <input type="radio" id="dog" name="favourite animal" value="dog">
			// <label for="dog">Dog</label>
			// <input type="radio" id="other" name="favourite animal" value="other">
			// <label for="other">Other</label>
			default:
				break;
		}

		htmlForm += elementHtml;
	}

	return (
		htmlStart +
		htmlForm +
		`
    ${htmlEnd}`
	);
};

import { NextApiRequest, NextApiResponse } from "next";
import { GetFormByIdResponse } from "@api/forms/responses";
import { InputTypeWithoutIcon } from "../../types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// only post request
	if (req.method !== "POST") {
		res.status(405).end();
		return;
	}

	const form = req.body as GetFormByIdResponse["data"];
	const amp = generateAmp(form);

	res.status(200).send(amp);
};

export default handler;
