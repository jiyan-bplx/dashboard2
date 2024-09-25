import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IntegrationsList } from "@utils/constants";
const GoogleSheetsCallbackPage = () => {
	const router = useRouter();
	useEffect(() => {
		if (router.isReady && router.query.integrationId) {
			setTimeout(() => {
				window.close();
			}, 2000);
		}
	}, [router]);

	return (
		<>
			<Head>
				<title>Connect with Google Sheets | ByteForms</title>
			</Head>
			<div className="container mx-auto py-12 flex flex-col items-center justify-center max-w-lg px-6">
				<p className="font-medium text-4xl text-center">
					Connect with Google Sheets
				</p>
				<p className="text-sm text-gray-500 my-2">
					{
						IntegrationsList?.find(
							(item) => item.key === "google_sheet"
						)?.description
					}
				</p>

				{router.query.integrationId && (
					<div className="mt-2">
						<p className="text-center">Connection successful!</p>
						<p className="text-center text-xs text-gray-500">
							This window will close in few seconds.
						</p>
					</div>
				)}

				<button
					onClick={() => {
						window?.close();
					}}
					type="submit"
					className="button-primary my-4 flex space-x-2 items-center"
				>
					<span>Close Popup</span>
				</button>
				<p className="text-xs mt-8 text-gray-400">
					Integration ID: {router.query.integrationId}
				</p>
			</div>
		</>
	);
};

export default GoogleSheetsCallbackPage;
