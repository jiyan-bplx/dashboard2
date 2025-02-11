export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const IntegrationsList = [
	{
		name: "Webhooks",
		key: "webhook",
		description: "Send events for new submissions to HTTP endpoints",
		icon: "/webhook_icon.svg",
		status: "active",
	},
	{
		name: "Discord",
		key: "discord",
		description: "Send a Discord message on submissions",
		icon: "/discord_icon.svg",
		status: "active",
	},
	{
		name: "Telegram",
		key: "telegram",
		description: "Send Telegram message on submission",
		status: "active",
		icon: "/telegram_icon.svg",
	},
	{
		name: "Notion",
		status: "active",
		key: "notion",
		description: "Save submissions to Notion",
		icon: "/notion_icon.svg",
	},
	{
		name: "Slack",
		key: "slack",
		status: "active",
		description: `Send Slack message for new submission. <a href="https://forms.bytesuite.io/integrations/slack" class="text-blue-500 hover:underline">Click here</a> to learn more.`,
		icon: "/slack_icon.svg",
	},
	{
		name: "Drive",
		key: "google_drive",
		type: "storage",
		status: "active",
		description: "Save files to Drive",
		icon: "/drive_icon.png",
	},
	{
		status: "active",
		name: "Google Sheets",
		key: "google_sheet",
		description: "Save submissions to Google Sheets",
		icon: "/google_sheets_icon.svg",
	},

	{
		name: "Dropbox",
		type: "storage",
		key: "dropbox",
		status: "active",
		description: "Save files to Dropbox",
		icon: "/dropbox_icon.png",
	},

	{
		name: "Jira",
		key: "jira",
		status: "active",
		description: "Save submissions to Jira",
		icon: "/jira_icon.svg",
		link: "https://zapier.com/apps/byteforms/integrations/jira-software-cloud/1727098/create-jira-software-cloud-issues-for-new-submissions-in-byteforms",
	},
	{
		name: "Trello",
		key: "trello",
		description: "Create a new card for each submission",
		status: "active",
		icon: "/trello_icon.svg",
		link: "https://zapier.com/apps/byteforms/integrations/trello",
	},
	{
		name: "Zapier",
		key: "zapier",
		description: "Integrate with 2000+ apps using Zapier",
		icon: "/zapier_icon.png",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations",
	},
	{
		name: "Excel",
		key: "excel",
		description: "Save new form submissions to Excel",
		icon: "/excel_logo.png",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/excel",
	},
	{
		name: "Airtable",
		key: "airtable",
		description: "Save new form submissions to Airtable",
		icon: "/airtable.png",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/airtable",
	},
	{
		name: "Google Calendar",
		key: "google_calendar",
		description:
			"Create new events in Google Calendar for new form submissions ",
		icon: "/google_calendar.svg",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/google-calendar/1727108/create-google-calendar-events-for-new-byteforms-submissions",
	},
	{
		name: "PDF Monkey",
		key: "pdf_monkey",
		description: "Generate PDF from new form submissions ",
		icon: "/pdf_monkey.jpeg",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/pdfmonkey/1727102/generate-documents-in-pdfmonkey-from-new-byteforms-submissions",
	},
	{
		name: "Hubspot",
		key: "hubspot",
		description: "Create contact in Hubspot for new form submissions",
		icon: "/hubspot.jpeg",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/hubspot",
	},
	{
		name: "Mailchimp",
		key: "mailchimp",
		description: "Sync data with Mailchimp for new form submissions",
		icon: "/mailchimp_logo.jpg",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/mailchimp",
	},
	{
		name: "SMS",
		key: "sms",
		description: "Send SMS Messages for new form submissions",
		icon: "/sms_logo.png",
		status: "active",
		link: "https://zapier.com/apps/byteforms/integrations/sms/1727105/send-sms-messages-for-new-byteforms-submissions",
	},
];
