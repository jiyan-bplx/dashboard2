import { MapIcon, UserIcon } from "@heroicons/react/24/outline";

export const PrebuiltBlocks = [
	{
		title: "Name",
		icon: <UserIcon className="w-4 h-4" />,
		inputs: [
			{
				component: "input",
				type: "text",
				label: "First Name",
				required: true,
				width: "half",
				placeholder: "First name",
			},
			{
				component: "input",
				width: "half",
				type: "text",
				label: "Last Name",
				required: true,
				placeholder: "Last name",
			},
		],
	},
	{
		title: "Address",
		icon: <MapIcon className="w-4 h-4" />,
		inputs: [
			{
				component: "layout",
				type: "text",
				label: "Address",
				defaultValue: "Address",
			},
			{
				component: "input",
				type: "text",
				label: "Address Line 1",
				required: true,
				placeholder: "Flat/Floor/Apartment",
			},
			{
				component: "input",
				type: "text",
				label: "Address Line 2",
				required: true,
				placeholder: "Area/Locality",
			},
			{
				component: "input",
				type: "text",
				width: "half",
				label: "City",
				required: true,
				placeholder: "City",
			},
			{
				component: "input",
				type: "text",
				label: "Pincode",
				width: "half",
				required: true,
				maxLength: 6,
				minLength: 6,
				placeholder: "Pincode",
			},
			{
				component: "input",
				type: "text",
				label: "State",
				required: true,
				placeholder: "State",
			},
		],
	},
];
