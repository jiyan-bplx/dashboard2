/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl:
		process.env.NEXT_PUBLIC_WEBSITE_URL || "https://forms.bytesuite.io",
	generateRobotsTxt: true,
	exclude: [
		"/verify-email",
		"/success",
		"/reset-password",
		"/profile/*",
		"/email-verification",
		"/dashboard",
		"/integrations/callback/*",
	],
};
