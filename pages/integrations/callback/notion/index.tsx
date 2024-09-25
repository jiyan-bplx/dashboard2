import { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import AutoComplete from "@components/BuilderComponents/Inputs/AutoComplete";
import {
	createDatabaseForNotionPage,
	getPagesForNotion,
} from "@api/integrations/notion";
import { NotionPage } from "@api/integrations/notion/response";
import { BaseResponse } from "@api/types/responses";
import { IntegrationsList } from "@utils/constants";
import Loading from "@components/Loading";
const NotionCallbackPage = () => {
	const router = useRouter();

	const integrationId = router.query.integrationId;

	const { data, isLoading, error } = useQuery(
		["notion_pages", integrationId],
		{
			enabled: typeof integrationId === "string",
			queryFn: () =>
				typeof integrationId === "string"
					? getPagesForNotion(parseInt(integrationId?.toString()))
					: null,
		}
	);

	const [selectedPage, setSelectedPage] = useState<NotionPage | null>(null);

	const [isCreating, setIsCreating] = useState(false);

	const onContinue = async () => {
		if (!selectedPage) {
			toast.error("Please select a page to continue");
			return;
		}

		if (typeof integrationId !== "string") {
			console.error("Integration ID not found", integrationId);
			return;
		}
		try {
			setIsCreating(true);
			const res = await createDatabaseForNotionPage({
				integration_id: parseInt(integrationId?.toString()),
				page_id: selectedPage.id,
			});

			if (res.status === "success") {
				toast.success("Integration connected successfully");
				setIsCreating(false);
				setTimeout(() => {
					window.close();
				}, 2000);
			} else {
				setIsCreating(false);
				toast.error(res.message ?? "An error occured");
				console.error("[createDBforNotion] Response", res);
			}
		} catch (err) {
			setIsCreating(false);

			console.error("[createDBforNotion]", err);
			const e = err as AxiosError<BaseResponse<any>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message ?? "Something went wrong");
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	const getLabelFromPage = (page: NotionPage) => {
		if (!page) return "-";
		if (page.title && Array.isArray(page.title) && page.title.length > 0) {
			return page.title?.at(0)?.plain_text;
		}

		return page.properties?.title?.title?.at(0)?.plain_text ?? "Untitled";
	};

	return (
		<>
			<Head>
				<title>Connect with Notion | ByteForms</title>
			</Head>
			<div className="container mx-auto py-12 flex flex-col items-center justify-center max-w-lg px-6">
				<p className="font-medium text-4xl text-center">
					Connect with Notion
				</p>
				<p className="text-sm text-gray-500 my-2">
					{
						IntegrationsList?.find((item) => item.key === "notion")
							?.description
					}
				</p>

				<Toaster />
				<div className="mb-4">
					<AutoComplete
						isLoading={isLoading}
						label="Select a page"
						data={
							data?.data?.results?.filter(
								(item) => item.parent.type === "workspace"
							) || []
						}
						getLabel={(item) => getLabelFromPage(item)}
						getVal={(item) => item.id}
						onSelect={setSelectedPage}
						value={selectedPage}
					/>
				</div>

				<button
					className="button-primary items-center space-x-1"
					disabled={!selectedPage}
					onClick={onContinue}
				>
					{isCreating && <Loading size={12} />}
					<span>Continue</span>
				</button>

				{/* <button
					onClick={() => {
						window?.close();
					}}
					type="submit"
					className="button-primary my-4 flex space-x-2 items-center"
				>
					<span>Close Popup</span>
				</button> */}
				<p className="text-xs mt-8 text-gray-400">
					Integration ID: {router.query.integrationId}
				</p>
			</div>
		</>
	);
};

export default NotionCallbackPage;
