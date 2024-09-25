const formData = [
	{
		name: "First name",
		type: "text",
		required: true,
		max: "",
		width: "half",
		min: "",
		maxLength: "80",
		minLength: "",
		pattern: "",
	},
	{
		name: "Last name",
		type: "text",
		width: "half",
		required: true,
		max: "",
		min: "",
		maxLength: "100",
		minLength: "",
		pattern: "",
	},
	{
		name: "Email",
		type: "text",
		required: true,
		max: "",
		min: "",
		maxLength: "",
		minLength: "",
		pattern: "^\\S+@\\S+$",
	},
	{
		name: "Mobile number",
		type: "tel",
		required: true,
		max: "",
		min: "",
		maxLength: "12",
		minLength: "6",
		pattern: "",
	},
	{
		name: "Title",
		type: "select",
		required: true,
		max: "",
		min: "",
		maxLength: "",
		minLength: "",
		pattern: "",
		options: "Mr;Mrs;Miss;Dr",
	},
	{
		name: "Developer",
		type: "radio",
		required: true,
		max: "",
		min: "",
		maxLength: "",
		minLength: "",
		pattern: "",
		options: "Yes;No",
	},
];

export default formData;
