/* eslint-disable react/no-unescaped-entities */
import { Dialog, Transition } from "@headlessui/react";
import {
	XMarkIcon,
	ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { format, parseISO } from "date-fns";
import { FormItem, FormResponse } from "@api/forms/responses";
import { InputTypeWithoutIcon } from "../../../types";
import Link from "next/link";

const RowResponseItem = ({
	input,
	viewFiles,
	response,
}: {
	viewFiles: (value: any) => void;
	input: InputTypeWithoutIcon;
	response: FormResponse;
}) => {
	const value = response?.response?.[input.id];
	return (
		<div>
			<p className="text-sm text-black font-medium mb-1">{input.label}</p>
			{!["recaptcha", "cloudflare_turnstile"].includes(input.type) && (
				<p className="text-sm text-[#232323] ">
					{value?.toString().includes("data:image") ? (
						<div>
							<img
								src={value}
								className="h-20"
								alt="Image Preview"
							/>
						</div>
					) : (value as any)?.type === "files" &&
					  (value as any)?.files ? (
						(value as any)?.files?.length > 0 ? (
							<button
								className="button-secondary"
								onClick={() => viewFiles(value)}
							>
								View {(value as any)?.files?.length} File
								{(value as any)?.files?.length > 1 ? "s" : ""}
							</button>
						) : (
							<span className=" text-gray-500">
								No files attached
							</span>
						)
					) : (value as any)?.provider &&
					  (value as any)?.name &&
					  (value as any)?.size ? (
						<button
							className="button-secondary"
							onClick={() =>
								viewFiles({
									files: [value],
								})
							}
						>
							View {(value as any)?.files?.length} File
						</button>
					) : (value as any)?.phone_number ||
					  typeof (value as any)?.country_code === "string" ? (
						<>
							{(value as any)?.phone_number ? (
								<p>
									{`${(value as any)?.country_code ?? ""} ${
										(value as any)?.phone_number ?? ""
									}`}
								</p>
							) : (
								"-"
							)}
						</>
					) : typeof value === "string" &&
					  (value as string)?.length > 10 ? (
						<p className="md:w-48 lg:w-64 xl:w-80 whitespace-pre-wrap">
							{value}
						</p>
					) : typeof value === "boolean" ? (
						<p className="">{value ? "Yes" : "No"}</p>
					) : typeof value === "object" ? (
						(value as any)?.type === "picture_choice" ? (
							<div className="flex flex-col space-y-1">
								<img
									className="w-1/2"
									src={(value as any)?.value}
									alt={(value as any)?.label}
								/>
								<p className="text-sm text-gray-800">
									{typeof (value as any)?.index !==
									"undefined"
										? `${(value as any)?.index}. `
										: ""}
									{(value as any)?.label}
								</p>
							</div>
						) : (
							<pre>{JSON.stringify(value, null)}</pre>
						)
					) : (
						value ?? "-"
					)}
				</p>
			)}
		</div>
	);
};
export default function FormResponseRowModal({
	open,
	onClose,
	response,
	form,
	viewFiles,
}: {
	form?: FormItem;
	viewFiles: (value: any) => void;
	response?: FormResponse | null;
	open?: boolean;
	onClose: (open: boolean) => void;
}) {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-in-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in-out duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-300"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-300"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md">
									<button
										type="button"
										className="absolute right-8 top-4 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										onClick={() => onClose(false)}
									>
										<span className="sr-only">
											Close panel
										</span>
										<XMarkIcon
											className="h-6 w-6"
											aria-hidden="true"
										/>
									</button>
									<div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6">
											<div className="mt-2 flex items-start justify-between">
												<div>
													<Dialog.Title className="text-lg font-medium text-gray-900">
														Response
													</Dialog.Title>
													{response && (
														<p className="text-sm text-gray-500">
															Submitted at{" "}
															{format(
																parseISO(
																	response.created_at
																),
																"dd/MM/yyyy HH:mm:ss"
															)}
														</p>
													)}
													<Link
														target={"_blank"}
														href={{
															pathname:
																"/form/[slug]/",
															query: {
																slug: form?.public_id,
																response:
																	response?.id,
															},
														}}
														className="button-outlined flex items-center space-x-1 mt-3"
													>
														<span>
															View Filled Form
														</span>
														<ArrowTopRightOnSquareIcon className="w-3 h-3" />
													</Link>
												</div>
											</div>
										</div>
										<div className="mt-4 px-4 sm:px-6 flex flex-col h-full ">
											<div className="border-t py-4 flex-grow">
												<div className="grid gap-y-3">
													{response &&
														form?.body
															?.filter(
																(item) =>
																	item.component !==
																	"layout"
															)
															?.map((input) => (
																<RowResponseItem
																	viewFiles={
																		viewFiles
																	}
																	input={
																		input
																	}
																	response={
																		response
																	}
																	key={input.id?.toString()}
																/>
															))}
												</div>
												{/* <div className="mt-2">
													<p className="text-sm text-black font-medium mb-2">
														JSON
													</p>
													<pre
														className="text-sm text-[#232323]  p-4 rounded border whitespace-pre-wrap"
														style={{
															fontFamily:
																"monospace",
														}}
													>
														{selectedLog?.details}
													</pre>
												</div> */}
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
