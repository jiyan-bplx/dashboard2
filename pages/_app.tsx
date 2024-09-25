import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			// refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-3Q9F9THD0F"
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-3Q9F9THD0F');
        `}
			</Script>

			<QueryClientProvider client={queryClient} contextSharing>
				<main className={poppins.className}>
					<Component {...pageProps} />
				</main>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
