import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, EyeIcon, LinkIcon } from "@heroicons/react/20/solid";
import { ClipboardDocumentIcon, HomeIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createForm } from "@api/forms";
import { PageSettings } from "@api/forms/requests";
import { FormItem, GetFormByIdResponse } from "@api/forms/responses";
import { BaseResponse } from "@api/types/responses";
import useBuilderStore, {
	useFormOptionsStore,
	useBuilderStoreWithUndoRedo,
	useFormPagesStoreWithUndoRedo,
} from "@store/builder";
import { classNames } from "@utils/index";
import Loading from "@components/Loading";
const BuilderTopBar = ({
	formTitle,
	setShowAddBlockSidebar,
	selectedForm,
	formPages,
	saveForm,
	isCreating,
	type,
}: {
	type?: FormItem["form_type"];
	isCreating: boolean;
	formTitle: string;
	setShowAddBlockSidebar: (val: boolean) => void;
	selectedForm?: GetFormByIdResponse | null;
	formPages: PageSettings[];
	saveForm: (options?: { draft: boolean }) => void;
}) => {
	const router = useRouter();

	const formOptions = useFormOptionsStore((state) => state.formOptions);
	const inputs = useBuilderStore((state) => state.inputs);

	const {
		undo: doUndo,
		redo: doRedo,
		pastStates,
		futureStates,
	} = useBuilderStoreWithUndoRedo((state) => state);

	const {
		undo: undoPages,
		redo: redoPages,
		pastStates: pastStatesPages,
		futureStates: futureStatesPages,
	} = useFormPagesStoreWithUndoRedo((state) => state);

	const canUndo = !!pastStates.length;
	const canRedo = !!futureStates.length;

	const undo = useCallback(() => {
		doUndo(2);
	}, [doUndo]);

	const redo = useCallback(() => {
		doRedo(2);
	}, [doRedo]);

	// keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
				if (e.shiftKey) {
					redo();
				} else {
					undo();
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [undo, redo]);

	const saveAsDraft = () => {
		saveForm({
			draft: true,
		});
	};

	const [isCreatingDuplicate, setIsCreatingDuplicate] = useState(false);

	const copyFormLink = () => {
		const link = `${window.location.origin}/form/${selectedForm?.data?.public_id}`;
		navigator.clipboard.writeText(link);
		toast.success("Link copied to clipboard");
	};
	const duplicateForm = async () => {
		try {
			setIsCreatingDuplicate(true);

			const res = await createForm({
				name: `${formTitle} - Duplicate`,
				is_custom: false,
				form_type: type ?? "form",
				pages: formPages,
				body: inputs?.map(({ icon, ...rest }: any) => rest),
				options: {
					...formOptions,
					visibility: "draft",
				},
			});
			if (res.status === "success" && res.data) {
				toast.success(`Form saved as draft.`);
				setIsCreatingDuplicate(false);
				router.replace(
					{
						pathname: "/quiz-builder",
						query: {
							formId: res.data.id,
						},
					},
					undefined,
					{ shallow: true }
				);
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onDuplicateForm] Response", res);
				setIsCreatingDuplicate(false);
			}
		} catch (err) {
			console.error("[onDuplicateForm]", err);
			const e = err as AxiosError<BaseResponse<null>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
			setIsCreatingDuplicate(false);
		}
	};
	return (
		<>
			<div className="max-w-screen h-16 bg-white border-b flex items-center justify-center px-2 md:px-4">
				<div className="absolute left-4 flex flex-row space-x-2">
					<Link
						className="button-outlined space-x-1"
						href={"/dashboard"}
					>
						<HomeIcon className="w-4 h-4" />
						<span className="hidden lg:block">Dashboard</span>
					</Link>
					<button
						disabled={canUndo ? false : true}
						className={classNames(
							canUndo ? "" : "opacity-70",
							"button-outlined"
						)}
						title="Undo"
						onClick={undo}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4"
						>
							<path d="M3 7v6h6" />
							<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
						</svg>
					</button>
					<button
						disabled={canRedo ? false : true}
						onClick={redo}
						className={classNames(
							canRedo ? "" : "opacity-70",
							"button-outlined -scale-x-100"
						)}
						title="Redo"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4"
						>
							<path d="M3 7v6h6" />
							<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
						</svg>
					</button>
					<button
						className="button-secondary block lg:hidden"
						onClick={() => setShowAddBlockSidebar(true)}
					>
						Add block
					</button>
				</div>
				<div className="hidden lg:flex space-x-2">
					<p className="text-sm md:text-base">{formTitle}</p>
					{formOptions?.visibility === "draft" && (
						<>
							<span className="inline-flex items-center rounded-full bg-gray-200 px-2  text-[10px] font-semibold text-gray-800">
								Draft
							</span>
						</>
					)}
				</div>
				<div className="absolute right-4 flex flex-row space-x-2 md:space-x-3">
					{typeof router.query.formId === "string" &&
						router.query.formId && (
							<>
								<button
									onClick={duplicateForm}
									disabled={isCreatingDuplicate}
									title="Clone Form"
									className="button-outlined space-x-1"
								>
									{isCreatingDuplicate ? (
										<Loading size={16} color="black" />
									) : (
										<ClipboardDocumentIcon className="w-5 h-4" />
									)}
									<p className="hidden md:block">Clone</p>
								</button>
								<Link
									href={`/form/${selectedForm?.data?.public_id}?isPreview=true`}
									target="_blank"
									title="Form Preview"
									className="button-secondary space-x-1"
								>
									<EyeIcon className="w-5 h-4" />
									<p className="hidden md:block">Preview</p>
								</Link>
								<button
									onClick={copyFormLink}
									title="Copy Form"
									className="button-outlined space-x-1"
								>
									<LinkIcon className="w-5 h-4" />
								</button>
							</>
						)}
					<div className="inline-flex rounded-md shadow-sm">
						<button
							disabled={isCreating}
							onClick={() => saveForm()}
							type="button"
							className="inline-flex items-center border border-transparent bg-indigo-600 px-2 lg:px-4 py-[0.35rem] lg:py-2 text-xs lg:text-sm lg:font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative  rounded-l-md  border-gray-300 focus:z-10 focus:border-indigo-500 space-x-1"
						>
							{isCreating && <Loading size={16} color="white" />}
							<span suppressHydrationWarning>
								{selectedForm?.data ? "Save" : "Publish"}
							</span>
						</button>
						<Menu as="div" className="relative -ml-px block">
							<Menu.Button className="relative inline-flex items-center rounded-r-md border border-indigo-400 bg-indigo-600 px-2 lg:px-4 py-[0.35rem] lg:py-2 h-full text-sm font-medium text-gray-100 hover:bg-indigo-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
								<span className="sr-only">Open options</span>
								<ChevronDownIcon
									className="h-4 lg:h-5 w-4 lg:w-5"
									aria-hidden="true"
								/>
							</Menu.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="absolute right-0 z-50 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div className="py-1 w-full">
										<Menu.Item key={"Save & Publish"}>
											{({ active }) => (
												<button
													onClick={() =>
														saveForm({
															draft: false,
														})
													}
													type="button"
													className={classNames(
														active
															? "bg-gray-100 text-gray-900"
															: "text-gray-700",
														"block px-4 py-2 text-sm w-full text-left"
													)}
												>
													Save & Publish
												</button>
											)}
										</Menu.Item>
										<Menu.Item key={"Save to drafts"}>
											{({ active }) => (
												<button
													onClick={saveAsDraft}
													type="button"
													className={classNames(
														active
															? "bg-gray-100 text-gray-900"
															: "text-gray-700",
														"block px-4 py-2 text-sm w-full text-left"
													)}
												>
													Save to drafts
												</button>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				</div>
			</div>
			<div className="bg-indigo-100 p-4 -mb-8 text-sm text-gray-700 block lg:hidden">
				Please create this form on a device with a larger screen for a
				better experience.
			</div>
		</>
	);
};

export default BuilderTopBar;
