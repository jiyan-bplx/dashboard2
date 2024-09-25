import { Html, Head, Main, NextScript } from "next/document";

const SEO = {
	title: "Free Form Builder - ByteForms",
	description:
		"ByteForms is a form builder that helps you create forms and surveys for free.",
	ogImage: "https://forms.bytesuite.io" + "/og_image.png",
};
export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="icon" href="/byteforms.png" />
				<meta name="title" content={SEO.title} />
				<meta name="description" content={SEO.description} />

				<meta property="og:type" content="website" />

				<meta property="og:title" content={SEO.title} />
				<meta property="og:description" content={SEO.description} />
				<meta property="og:image" content={SEO.ogImage} />

				<meta property="twitter:card" content="summary_large_image" />
				{/* <meta property="twitter:url" content="https://dev.forms.bytesuite.io/form/U9bWS38xOCA" /> */}
				<meta property="twitter:title" content={SEO.title} />
				<meta
					property="twitter:description"
					content={SEO.description}
				/>
				<meta property="twitter:image" content={SEO.ogImage} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
