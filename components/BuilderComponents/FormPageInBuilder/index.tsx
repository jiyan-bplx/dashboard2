import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { PageSettings } from "@api/forms/requests";
import useBuilderStore, {
	useFormOptionsStore,
	useFormPagesStore,
} from "@store/builder";
import { classNames } from "@utils/index";
import ImageRendererFromS3 from "../../ImageRendererFromS3";
import FormCanvas from "../FormCanvas";
import FormTitle from "../FormTitle";
const FormPageInBuilder = ({
	page,
	isLoading,
	pageIndex,
	formTitle,
	setFormTitle,
}: {
	page: number;
	pageIndex: number;
	formTitle: string;
	setFormTitle: (title: string) => void;
	isLoading: boolean;
}) => {
	const router = useRouter();

	const inputs = useBuilderStore((state) => state.inputs);
	const setInputs = useBuilderStore((state) => state.setInputs);

	const {
		formPages,
		pages,
		setFormPages,
		setPages,
		setSelectedPage,
		selectedPage,
	} = useFormPagesStore();

	const deletePage = (pageId: number) => {
		const newPages = pages.filter((p) => p !== pageId);
		setPages(newPages);
		const allInputs = inputs.filter((item) => item.page !== pageId);
		setInputs(allInputs);
		setFormPages(formPages.filter((item) => item.page !== pageId));
	};

	const formOptions = useFormOptionsStore((state) => state.formOptions);
	return (
		<div>
			<form
				className={classNames(
					page === selectedPage?.page
						? "border-indigo-500 border shadow"
						: "",
					formOptions.theme === "dark" ? "bg-black" : "bg-white",
					"flex flex-col space-y-2 px-4 md:px-8 py-8 rounded-md shadow w-full"
				)}
			>
				{router.query.formId &&
				typeof router.query.formId === "string" &&
				typeof formPages?.find((e) => e.page === page)?.cover_image ===
					"string" ? (
					<ImageRendererFromS3
						formId={router.query.formId}
						s3url={
							formPages?.find((e) => e.page === page)
								?.cover_image as string
						}
					/>
				) : null}

				{pageIndex === 0 && (
					<div className="w-full relative">
						<FormTitle
							formTitle={formTitle}
							setFormTitle={setFormTitle}
						/>
					</div>
				)}

				<div
					className={classNames(
						formOptions?.theme === "dark"
							? "bg-[#1c1a1f]"
							: "bg-gray-50",
						` rounded-md py-2 md:py-4 w-full `
					)}
				>
					<div
						className={`mx-auto self-center ${
							formOptions?.form_width === "centered"
								? "max-w-lg"
								: "max-w-full"
						}`}
						style={{}}
					>
						{isLoading ? (
							<div className="px-4">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="rounded-md  bg-gray-200 w-full h-12 mb-2 animate-pulse"
									/>
								))}
							</div>
						) : (
							<SortableContext
								id={`page-${page}`}
								items={inputs
									?.filter((item) => {
										if (typeof item.page === "number") {
											return item.page === page;
										} else {
											if (page === 1) return true;
											return false;
										}
									})
									.map((e) => e.id)}
								strategy={verticalListSortingStrategy}
							>
								<FormCanvas
									isQuiz={router.pathname.includes("quiz")}
									disableDrop={
										formPages.find((p) => p.page === page)
											?.page_type === "cover"
									}
									page={page}
								/>
							</SortableContext>
						)}
					</div>
				</div>

				{page === pages.at(-1) && (
					<div className="self-center pt-8">
						<button
							disabled
							type="submit"
							className={`button-primary space-x-2 flex items-center`}
						>
							<span>
								{formOptions?.submit_button_text?.length !== 0
									? formOptions?.submit_button_text
									: "Submit Form"}
							</span>
						</button>
					</div>
				)}
				{formOptions?.remove_branding === true ? null : (
					<div className="">
						<div className="flex pt-2 mb-1 flex-row justify-center items-center">
							{formOptions.theme === "dark" ? (
								<img
									className="block h-8 w-auto"
									src="/byteforms-logo-white.png"
									alt="ByteForms"
								/>
							) : (
								<img
									className="block h-8 w-auto"
									src="/byteformslogo.png"
									alt="ByteForms"
								/>
							)}
						</div>
						<p
							className={classNames(
								formOptions?.theme === "dark"
									? "text-gray-200"
									: "text-gray-800",
								"text-xs text-center"
							)}
						>
							<span>Create your own form </span>
							<span className="font-medium underline">
								for free
							</span>
						</p>
					</div>
				)}
			</form>
			<div className="flex justify-end space-x-2 w-full mt-2">
				{formOptions.page_behaviour === "one_page" && (
					<button className="">
						<Cog6ToothIcon
							onClick={() =>
								setSelectedPage(
									formPages?.find((e) => e.page === page) ?? {
										page: page,
										page_layout: "none",
										page_type: "form",
									}
								)
							}
							className="w-4 h-4 text-gray-500"
						/>
					</button>
				)}

				{pages.length !== 1 && (
					<button className="">
						<TrashIcon
							onClick={() => deletePage(page)}
							className="w-4 h-4 text-red-500"
						/>
					</button>
				)}
			</div>
		</div>
	);
};

export default FormPageInBuilder;
