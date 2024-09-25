import { useState } from "react";
import { CodeBlock, atomOneLight } from "react-code-blocks";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { getFormById, getFormResponsesForFormId } from "@api/forms";
import { API_URL } from "@utils/constants";
import CustomFormResponsesTable from "../CustomFormResponsesTable";

const CustomFormResponsesTab = ({ formId }: { formId: number }) => {
	const { data, isLoading } = useQuery(
		["forms", formId],
		() => getFormById(formId),
		{
			enabled: typeof formId === "number",
		}
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [pageIndex, setPageIndex] = useState(0);
	const [after, setAfter] = useState<string | null>(null);
	const [before, setBefore] = useState<string | null>(null);

	const [selectedSorting, setSelectedSorting] = useState({
		name: "Oldest first",
		value: "oldest",
	});

	const [perPage, setPerPage] = useState(10);

	const goToFirstPage = () => {
		setPageIndex(0);
		setBefore(null);
		setAfter(null);
	};

	const updatePerPage = (value: number) => {
		setPerPage(value);
		goToFirstPage();
	};

	const {
		data: formResponses,
		isLoading: isLoadingResponses,
		isFetching: isFetchingResponses,
		refetch: refetchFormResponses,
	} = useQuery(
		[
			"form-responses",
			formId,
			pageIndex,
			searchQuery,
			perPage,
			selectedSorting.value,
		],
		() =>
			getFormResponsesForFormId(formId, {
				limit: perPage,
				after: after,
				before,
				query: searchQuery?.length > 0 ? searchQuery : null,
				order: selectedSorting.value === "oldest" ? "desc" : "asc",
			}),
		{
			enabled: !!formId,
			keepPreviousData: true,
		}
	);

	const onPrevious = () => {
		if (pageIndex > 0) {
			setPageIndex((prev) => prev - 1);
			setBefore(formResponses?.cursor?.before ?? null);
			setAfter(null);
		}
	};

	const onNext = () => {
		setPageIndex((prev) => prev + 1);
		setBefore(null);
		setAfter(formResponses?.cursor?.after ?? null);
	};

	const FORM_INTEGRATION_CODE = `<form action="${API_URL}/r/${data?.data?.public_id}" method="post">
	<!-- Replace these inputs with your own. Make sure they have a "name" attribute! -->
	<input type="text" name="name" value="Roscoe Jones" />
	<input type="email" name="email" value="roscoe@example.com" />
	
	<button type="submit">
		<span>Send</span>
	</button>
</form>`;

	const copyCodeToClipboard = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(FORM_INTEGRATION_CODE);
			toast.success("Copied to clipboard");
		} else {
			toast.error("Your browser does not support copying to clipboard");
		}
	};

	return (
		<>
			<div className="mt-3">
				{isLoadingResponses ? (
					[1, 2, 3].map((i) => (
						<div
							key={i}
							className="rounded-md  bg-gray-200 w-full h-12 mb-2 animate-pulse"
						/>
					))
				) : (
					<>
						{(formResponses?.data?.length === 0 ||
							!formResponses?.data) &&
						searchQuery.length === 0 ? null : (
							<CustomFormResponsesTable
								selectedSorting={selectedSorting}
								setSelectedSorting={setSelectedSorting}
								setPerPage={updatePerPage}
								perPage={perPage}
								pageNo={pageIndex}
								count={
									formResponses?.count ??
									formResponses?.data?.length ??
									0
								}
								searchQuery={searchQuery}
								isFetchingResponses={isFetchingResponses}
								setSearchQuery={setSearchQuery}
								onPrevious={onPrevious}
								onNext={onNext}
								goToFirstPage={goToFirstPage}
								formInputs={data?.data?.body ?? []}
								hasNext={!!formResponses?.cursor?.after}
								hasPrevious={!!formResponses?.cursor?.before}
								data={formResponses?.data ?? []}
								refetchFormResponses={refetchFormResponses}
							/>
						)}
					</>
				)}

				{data?.data &&
					(formResponses?.data?.length === 0 ||
						!formResponses?.data) &&
					searchQuery.length === 0 && (
						<div className="text-center py-6 border-b">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									vectorEffect="non-scaling-stroke"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								No responses yet.
							</h3>
							{data?.data?.is_custom && (
								<p className="mt-1 text-sm text-gray-500">
									Make sure you have correctly integrated the
									form using the documentation below.
								</p>
							)}
						</div>
					)}
				{data?.data?.is_custom && (
					<div className="pt-4">
						<p className="mb-4 font-medium text-xl">
							Integrate with your Form
						</p>
						<div>
							{/* <p>No responses yet.</p> */}
							<p>
								Use this &lt;form&gt; tag to make your form. Any
								input, textarea, select elements with names will
								be saved to ByteForms when the form is
								submitted.
							</p>

							<div className="relative">
								<button
									className="button-outlined absolute right-4 top-4"
									onClick={copyCodeToClipboard}
								>
									Copy
								</button>
								<CodeBlock
									showLineNumbers={false}
									text={FORM_INTEGRATION_CODE}
									language="html"
									theme={atomOneLight}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default CustomFormResponsesTab;
