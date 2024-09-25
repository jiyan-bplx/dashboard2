import { Listbox, Menu, Transition } from "@headlessui/react";
import {
	CheckIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
} from "@heroicons/react/20/solid";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Header,
	Row,
	RowSelectionState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useRouter } from "next/router";
import React, { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import {
	deleteFormResponseById,
	exportFormResponses,
	getAllForms,
	getFormById,
} from "@api/forms";
import { DeleteFormResponseResponse, FormResponse } from "@api/forms/responses";
import { InputTypeWithoutIcon } from "../../types";
import { classNames, getKeysFromObjects } from "@utils/index";
import DeleteSelectedRowsModal from "../Modals/DeleteSelectedRowsModal";
import { FileWithId } from "../BuilderComponents/Inputs/FileUploadInput";
import FormResponseFilesModal from "../Modals/FormResponseFilesModal";
import FormResponseRowModal from "../Modals/FormResponseRowModal";
import Input from "../BuilderComponents/Inputs/Input";
import Select from "../BuilderComponents/Inputs/Select";
import { AxiosError } from "axios";
import { listIntegrationsForFormId } from "@api/integrations/list";

const TableHeader = ({ header }: { header: Header<any, any> }) => {
	return (
		<th
			className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 px-4 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter  capitalize"
			role={"col"}
			key={header.id}
			colSpan={header.colSpan}
		>
			{header.isPlaceholder ? null : (
				<div
					{...{
						className: classNames(
							header.column.getCanSort()
								? "cursor-pointer select-none"
								: "",
							"flex items-center"
						),
						colSpan: header.colSpan,
						style: {
							width: header.getSize(),
						},
					}}
				>
					<div
						className="flex items-center"
						onClick={header.column.getToggleSortingHandler()}
					>
						{flexRender(
							header.column.columnDef.header,
							header.getContext()
						)}

						{header.column.getCanSort() && (
							<div>
								{{
									asc: (
										<ChevronUpIcon className="ml-2 w-4 h-4 transition-all" />
									),
									desc: (
										<ChevronUpIcon className="ml-2 w-4 h-4 rotate-180 transition-all" />
									),
								}[header.column.getIsSorted() as string] ?? (
									<ChevronUpDownIcon className="ml-2 w-4 h-4 rotate-180 transition-all" />
								)}
							</div>
						)}
					</div>

					<div
						{...{
							onMouseDown: header.getResizeHandler(),
							onTouchStart: header.getResizeHandler(),
							className: `resizer ${
								header.column.getIsResizing()
									? "isResizing"
									: ""
							}`,
						}}
					/>
				</div>
			)}
		</th>
	);
};
const TableRow = ({
	row,
	rowIndex,
	rows,
	viewFiles,
}: {
	viewFiles: (data: any) => void;
	row: Row<FormResponse>;
	rowIndex: number;
	rows: Row<FormResponse>[];
}) => {
	return (
		<tr key={row.id}>
			{row.getVisibleCells().map((cell) => {
				return (
					<td
						{...{
							style: {
								width: cell.column.getSize(),
							},
						}}
						key={cell.id}
						className={classNames(
							rowIndex !== rows.length - 1
								? "border-b border-gray-200"
								: "",
							"whitespace-nowrap py-4 text-sm font-medium text-gray-900 text-left px-4 "
						)}
					>
						{cell.getValue()?.toString().includes("data:image") ? (
							<div>
								<img
									src={cell.getValue() as string}
									className="h-20"
									alt="Image Preview"
								/>
							</div>
						) : (cell.getValue() as any)?.type === "files" &&
						  (cell.getValue() as any)?.files ? (
							(cell.getValue() as any)?.files?.length > 0 ? (
								<button
									className="button-secondary"
									onClick={() => viewFiles(cell.getValue())}
								>
									View{" "}
									{(cell.getValue() as any)?.files?.length}{" "}
									File
									{(cell.getValue() as any)?.files?.length > 1
										? "s"
										: ""}
								</button>
							) : (
								<span className="text-xs">
									No files attached
								</span>
							)
						) : (cell.getValue() as any)?.provider &&
						  (cell.getValue() as any)?.name &&
						  (cell.getValue() as any)?.size ? (
							<button
								className="button-secondary"
								onClick={() =>
									viewFiles({
										files: [cell.getValue()],
									})
								}
							>
								View {(cell.getValue() as any)?.files?.length}{" "}
								File
							</button>
						) : (cell.getValue() as any)?.phone_number ||
						  typeof (cell.getValue() as any)?.country_code ===
								"string" ? (
							<>
								{(cell.getValue() as any)?.phone_number ? (
									<p>
										{`${
											(cell.getValue() as any)
												?.country_code ?? ""
										} ${
											(cell.getValue() as any)
												?.phone_number ?? ""
										}`}
									</p>
								) : (
									"-"
								)}
							</>
						) : typeof cell.getValue() === "string" &&
						  (cell.getValue() as string)?.length > 10 ? (
							<p
								className="md:w-48 lg:w-64 xl:w-80 whitespace-pre-wrap"
								style={{
									wordBreak: "break-word",
								}}
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</p>
						) : typeof cell.getValue() === "boolean" ? (
							<p className="">{cell.getValue() ? "Yes" : "No"}</p>
						) : Array.isArray(cell.getValue()) &&
						  (cell.getValue() as any[]).every(
								(i) => typeof i === "string"
						  ) ? (
							<div>
								<p>
									{(cell.getValue() as string[])?.join(", ")}
								</p>
							</div>
						) : typeof cell.getValue() === "object" ? (
							(cell.getValue() as any)?.type ===
							"picture_choice" ? (
								<div className="flex flex-col justify-center items-center space-y-1">
									<img
										className="w-20 h-20"
										src={(cell.getValue() as any)?.value}
										alt={(cell.getValue() as any)?.label}
									/>
									<p className="text-xs text-gray-700">
										{typeof (cell.getValue() as any)
											?.index !== "undefined"
											? `${
													(cell.getValue() as any)
														?.index
											  }. `
											: ""}
										{(cell.getValue() as any)?.label}
									</p>
								</div>
							) : (
								<pre>
									{JSON.stringify(cell.getValue(), null)}
								</pre>
							)
						) : (
							<p
								className=""
								style={{
									// word-break: break-word;
									wordBreak: "break-word",
								}}
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</p>
						)}
					</td>
				);
			})}
		</tr>
	);
};

const CustomFormResponsesTable = ({
	data,
	count,
	perPage,
	pageNo,
	formInputs,
	onPrevious,
	onNext,
	hasNext,
	hasPrevious,
	searchQuery,
	isFetchingResponses,
	setSearchQuery,
	setSelectedSorting,
	selectedSorting,
	setPerPage,
	refetchFormResponses,
	goToFirstPage,
}: {
	goToFirstPage: () => void;
	setSelectedSorting: (val: any) => void;
	selectedSorting: {
		name: string;
		value: string;
	};
	pageNo: number;
	count: number;
	perPage: number;
	formInputs?: InputTypeWithoutIcon[];
	data: FormResponse[];
	onPrevious: () => void;
	onNext: () => void;
	setPerPage: (count: number) => void;
	hasNext?: boolean | null;
	hasPrevious?: boolean | null;
	searchQuery: string;
	isFetchingResponses?: boolean;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	refetchFormResponses: () => void;
}) => {
	const totalPages = count < perPage ? 1 : count / perPage;
	const router = useRouter();

	const { data: allCustomForms } = useQuery("forms", getAllForms, {});

	const formId = router.query.slug?.toString();
	const { data: formData } = useQuery(
		["forms", formId],
		() => (formId ? getFormById(parseInt(formId)) : null),
		{
			initialData: {
				status: "success",
				data: allCustomForms?.data?.find(
					(item) => item.id?.toString() === formId
				),
			},
			enabled: typeof router.query.slug === "string",
		}
	);

	const { data: integrationsList, refetch } = useQuery(
		["integrations", formId],
		() => (formId ? listIntegrationsForFormId(parseInt(formId)) : null)
	);

	const [sorting, setSorting] = React.useState<SortingState>([]);

	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); //manage your own row selection state

	const hasStorageProviders = useMemo(() => {
		const storageProviderNames = ["google_drive", "dropbox"];
		return integrationsList?.data?.some((item) =>
			storageProviderNames.includes(item.integration_type?.toString())
		);
	}, [integrationsList]);

	const continueDelete = async (id: string) => {
		try {
			const res = await deleteFormResponseById(id);
			if (res.status === "success") {
				refetchFormResponses();
				toast.success("Archived response.");
			} else {
				toast.error(res?.message ?? "An error occured");
			}
		} catch (err) {
			console.error("[onArchiveResponse]", err);
			const e = err as AxiosError<DeleteFormResponseResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message ?? "Something went wrong");
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	const onArchiveResponse = async (id: string) => {
		if (hasStorageProviders) {
			return;
		}
		continueDelete(id);
	};

	const onOpenResponse = (id: string) => {
		router.push({
			...router,
			query: {
				...router.query,
				response: id,
			},
		});
	};

	const columns = React.useMemo<ColumnDef<FormResponse>[]>(() => {
		var defaultColumns: ColumnDef<FormResponse, unknown>[] = [
			{
				accessorKey: "id",
				id: "select-col",
				maxSize: 32,
				enableSorting: false,
				enableResizing: false,
				header: ({ table }) => (
					<div className="flex-grow-0 flex-shrink">
						<input
							checked={table.getIsAllRowsSelected()}
							// indeterminate={table.getIsSomeRowsSelected()}
							onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
							type="checkbox"
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
					</div>
				),
				cell: ({ row }) => (
					<div className="flex-grow-0 flex-shrink">
						<input
							type="checkbox"
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							checked={row.getIsSelected()}
							onChange={row.getToggleSelectedHandler()}
						/>
					</div>
				),
			},
		];
		if (formInputs && Array.isArray(formInputs) && formInputs?.length > 0) {
			defaultColumns = [
				...defaultColumns,
				...formInputs
					?.filter(
						(input) =>
							!["recaptcha", "cloudflare_turnstile"].includes(
								input.type
							)
					)
					?.filter((item) => item.component !== "layout")
					?.filter((item) => item.component !== "question")
					.map(
						(input) =>
							({
								accessorKey: `response.${input.id}`,
								header: input.label,
								enableSorting: ![
									"signature",
									"image",
									"file",
								].includes(input.type),
								cell: ({ getValue }) => getValue() ?? "-",
							} as ColumnDef<FormResponse, unknown>)
					),
			];
		} else {
			defaultColumns = [
				...defaultColumns,
				...getKeysFromObjects(
					(data ?? []).map((e) => ({
						...e.response,
					}))
				).map(
					(key) =>
						({
							accessorKey: `response.${key}`,
							header: key,
							cell: ({ getValue }) => getValue() ?? "-",
						} as ColumnDef<FormResponse>)
				),
			];
		}

		if (formData?.data?.form_type === "quiz") {
			defaultColumns = [
				...defaultColumns,
				{
					accessorFn: (row) => `${row?.score}/${row?.total_score}`,
					header: "Score",
					cell: ({ cell }) => <div>{cell?.getValue() as string}</div>,
				},
			];
		}

		return defaultColumns.concat([
			{
				accessorKey: "created_at",
				header: "Created at",
				cell: ({ cell }) =>
					format(
						parseISO(cell.getValue() as string),
						"dd MMM yyyy 'at' HH:mm"
					),
			},
			{
				accessorKey: "id",
				header: "Action",
				enableSorting: false,
				cell: ({ cell }) => (
					<div>
						<button
							className="button-danger"
							onClick={() =>
								onArchiveResponse(cell.getValue() as string)
							}
						>
							Delete
						</button>
						<button
							className="button-outlined ml-2"
							onClick={() =>
								onOpenResponse(cell.getValue() as string)
							}
						>
							View
						</button>
					</div>
				),
			},
		]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, formInputs]);

	const table = useReactTable({
		data: data ?? [],
		columns,
		manualPagination: true,
		onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
		state: {
			rowSelection, //pass the row selection state back to the table instance
			sorting,
		},
		columnResizeMode: "onChange",
		// globalFilterFn: fuzzyFilter,
		onSortingChange: setSorting,
		getRowId: (row) => row.id?.toString(),

		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),

		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
	});

	const downloadCSV = async () => {
		downloadFile("csv");
	};

	const sortOptions = [
		{
			name: "Oldest first",
			value: "oldest",
		},
		{
			name: "Newest first",
			value: "newest",
		},
	];

	const downloadFile = async (type: "csv" | "xlsx") => {
		if (!formId) return;
		try {
			const response = await exportFormResponses(formId, type);
			const href = URL.createObjectURL(response);

			// create "a" HTML element with href to file & click
			const link = document.createElement("a");
			link.href = href;
			link.setAttribute(
				"download",
				`${
					formData?.data?.name ?? ""
				}_${formId}_form_responses_${format(
					new Date(),
					"dd-MM-yyyy hh:mm a"
				)}.${type}`
			);
			document.body.appendChild(link);
			link.click();

			// clean up "a" element & remove ObjectURL
			document.body.removeChild(link);
			URL.revokeObjectURL(href);
			toast.success("File downloaded.");
		} catch (err) {
			console.error("[downloadFile]", err);
			toast.error("Failed to export");
		}
	};
	const downloadExcel = async () => {
		downloadFile("xlsx");
	};

	const [showFiles, setShowFiles] = useState<null | {
		type: "files";
		files: FileWithId[];
	}>(null);

	const viewFiles = (data: { type: "files"; files: FileWithId[] }) => {
		setShowFiles(data);
	};

	const deleteSelectedRows = () => {
		router.push({
			query: {
				...router.query,
				action: "delete-selected",
			},
		});
	};

	const onCloseDeleteSelectedModal = () => {
		router.replace({
			...router,
			query: {
				...router.query,
				action: null,
			},
		});
	};

	return (
		<div>
			<FormResponseRowModal
				viewFiles={viewFiles}
				form={formData?.data}
				response={data?.find(
					(row) => row.id === parseInt(router.query.response as any)
				)}
				open={
					data?.find(
						(row) =>
							row.id === parseInt(router.query.response as any)
					)
						? true
						: false
				}
				onClose={() => {
					router.replace({
						...router,
						query: {
							...router.query,
							response: null,
						},
					});
				}}
			/>

			<DeleteSelectedRowsModal
				rows={rowSelection}
				form_id={parseInt(formId!)}
				refetchFormResponses={() => {
					setRowSelection({});
					refetchFormResponses();
				}}
				open={
					rowSelection &&
					Object.keys(rowSelection).length > 0 &&
					router.query.action === "delete-selected"
				}
				onClose={onCloseDeleteSelectedModal}
			/>

			{formId && (
				<FormResponseFilesModal
					formId={formId}
					setShowFiles={setShowFiles}
					showFiles={showFiles}
				/>
			)}

			{data?.length === 0 && searchQuery.length === 0 ? null : (
				<div className="flex items-center space-x-2">
					<div className="flex items-center space-x-2 w-full flex-grow">
						<div className="w-full flex-grow">
							<Input
								label=""
								placeholder="Search responses"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{Object.keys(rowSelection)?.filter(
						(item) => rowSelection[item]
					)?.length > 0 && (
						<button
							className="button-danger flex-shrink-0 mt-2"
							onClick={deleteSelectedRows}
						>
							Delete selected
						</button>
					)}

					<Menu
						as="div"
						className="relative inline-block text-left mt-2"
					>
						<div>
							<Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
								Export
								<ChevronDownIcon
									className="-mr-1 ml-2 h-3 w-3"
									aria-hidden="true"
								/>
							</Menu.Button>
						</div>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div className="py-1 w-full">
									<Menu.Item>
										{({ active }) => (
											<button
												type="button"
												onClick={downloadCSV}
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"w-full text-left block px-4 py-2 text-sm"
												)}
											>
												CSV
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												type="button"
												onClick={downloadExcel}
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"w-full text-left block px-4 py-2 text-sm"
												)}
											>
												Excel
											</button>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
					<Listbox
						value={selectedSorting}
						onChange={setSelectedSorting}
					>
						<div className="relative mt-1">
							<Listbox.Button
								className="relative cursor-default pl-3 pr-8 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300
							
							inline-flex w-32 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100
							"
							>
								<span className="block truncate">
									{selectedSorting.name}
								</span>
								<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
									<ChevronUpDownIcon
										className="h-4 w-4 text-gray-400"
										aria-hidden="true"
									/>
								</span>
							</Listbox.Button>
							<Transition
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 ring-1 ring-black/5 focus:outline-none text-xs z-50">
									{sortOptions.map((person, personIdx) => (
										<Listbox.Option
											key={personIdx}
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-10 pr-4 ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											value={person}
										>
											<>
												<span
													className={`block truncate ${
														selectedSorting.value ===
														person.value
															? "font-medium"
															: "font-normal"
													}`}
												>
													{person.name}
												</span>
												{selectedSorting.value ===
												person.value ? (
													<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
														<CheckIcon
															className="h-4 w-4"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</Listbox>
				</div>
			)}
			<div className="mt-2 inline-block min-w-full py-2 align-middle overflow-x-auto max-w-full ">
				<div className="">
					<table
						className="min-w-full border-separate"
						// style={{ borderSpacing: 0 }}

						{...{
							style: {
								width: table.getCenterTotalSize(),
							},
						}}
					>
						<thead className="bg-gray-50">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHeader
												key={header.id}
												header={header}
											/>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows?.length === 0 ? (
								<tr>
									<td
										colSpan={table.getAllColumns()?.length}
										className={classNames(
											"whitespace-nowrap py-4 text-sm font-medium text-gray-900 text-left px-4 "
										)}
									>
										No records matching filter.
									</td>
								</tr>
							) : (
								table
									.getRowModel()
									.rows.map((row, rowIndex) => {
										return (
											<TableRow
												viewFiles={viewFiles}
												key={row.id}
												row={row}
												rows={table.getRowModel()?.rows}
												rowIndex={rowIndex}
											/>
										);
									})
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex justify-between">
				<nav
					className="flex flex-wrap items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6 border-b w-full"
					aria-label="Pagination"
				>
					<p className="text-sm">
						Page {pageNo + 1} of{" "}
						{Math.ceil(
							pageNo + 1 > totalPages ? pageNo + 1 : totalPages
						)}
					</p>
					<p className="ml-2 border-l pl-2 text-sm text-gray-700">
						Showing{" "}
						<span className="font-medium">
							{(pageNo + 1) * perPage - perPage + 1}
						</span>{" "}
						to{" "}
						<span className="font-medium">
							{count < (pageNo + 1) * perPage
								? (pageNo + 1) * perPage -
								  perPage +
								  data?.length
								: (pageNo + 1) * perPage}
						</span>{" "}
						of <span className="font-medium">{count}</span> results
					</p>
					{/* <div className="hidden sm:block">
					
				</div> */}
					<div className="flex flex-1 flex-wrap mt-2 md:mt-0 justify-between sm:justify-end">
						<div className="mr-4 flex md:mb-0 mb-4 items-center text-sm">
							<span className="mr-2">Showing </span>
							<Select
								value={perPage.toString()}
								options={["5", "10", "20", "50", "100"]}
								onChange={(e) => {
									setPerPage(parseInt(e.target.value));
								}}
							/>
							<span className="ml-2"> records per page</span>
						</div>
						<button
							type="button"
							disabled={!hasPrevious}
							onClick={onPrevious}
							className={classNames(
								hasPrevious
									? "bg-white font-medium text-gray-700"
									: "bg-gray-100 text-gray-500",
								"relative inline-flex items-center rounded border border-gray-300 px-3 py-1 text-xs  hover:bg-gray-50"
							)}
						>
							Previous
						</button>
						<button
							type="button"
							disabled={!hasNext}
							onClick={onNext}
							className={classNames(
								hasNext
									? "bg-white font-medium text-gray-700"
									: "bg-gray-100 text-gray-500",
								"ml-2 relative inline-flex items-center rounded border border-gray-300 px-3 py-1 text-xs  hover:bg-gray-50"
							)}
						>
							Next
						</button>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default CustomFormResponsesTable;
