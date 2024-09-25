import { Switch } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { PageSettings } from "@api/forms/requests";
import { classNames } from "@utils/index";
import MediaGalleryModal from "../../Modals/MediaGalleryModal";

const EditPageSidebar = ({
	selectedPage,
	pages,
	setSelectedPage,
}: {
	pages: number[];
	selectedPage: PageSettings;
	setSelectedPage: (page: PageSettings | null) => void;
}) => {
	const [showMediaGallery, setShowMediaGallery] = useState(false);
	const openMediaGallery = () => setShowMediaGallery(true);
	const [hasImage, setHasImage] = useState(
		() =>
			typeof selectedPage.cover_image === "string" &&
			selectedPage.cover_image?.length > 0
	);

	useEffect(() => {
		if (
			selectedPage?.cover_image &&
			selectedPage?.cover_image?.length > 0
		) {
			setHasImage(true);
		} else {
			setHasImage(false);
		}
	}, [selectedPage?.cover_image]);

	return (
		<div className="w-full px-4">
			<div className="flex justify-between items-center ">
				<p className="mb-4 text-base font-semibold leading-6 text-gray-900">
					Edit Page
				</p>
				<XMarkIcon
					onClick={() => setSelectedPage(null)}
					className="h-6 w-6"
					aria-hidden="true"
				/>
			</div>

			<div>
				{selectedPage.page === pages.at(0) && (
					<>
						<p className="text-xs md:text-sm font-medium leading-6 flex mb-2">
							Page Type
						</p>

						<div className="flex items-center text-sm mb-2 border rounded overflow-hidden divide-x">
							<button
								onClick={() =>
									setSelectedPage({
										...selectedPage,
										page_type: "cover",
									})
								}
								className={classNames(
									selectedPage.page_type === "cover"
										? "bg-blue-500 font-medium text-white"
										: "text-gray-500",
									"py-1 w-1/2 items-center flex justify-center"
								)}
							>
								Cover Page
							</button>
							<button
								onClick={() =>
									setSelectedPage({
										...selectedPage,
										page_type: "form",
									})
								}
								className={classNames(
									selectedPage.page_type === "form"
										? "bg-blue-500 font-medium text-white"
										: "text-gray-500",
									"py-1 w-1/2 items-center flex justify-center"
								)}
							>
								Form Page
							</button>
						</div>
					</>
				)}
				<div className="flex items-center justify-between pt-2">
					<p className="text-xs md:text-sm font-medium leading-6 flex mb-2">
						Image
					</p>

					<Switch
						checked={hasImage}
						onChange={(v) => {
							setHasImage(v);
							setSelectedPage({
								...selectedPage,
								page_layout: v ? "background" : "none",
								cover_image: v
									? selectedPage.cover_image
									: null,
							});
						}}
						className={classNames(
							hasImage ? "bg-indigo-600" : "bg-gray-200",
							"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						)}
					>
						<span className="sr-only">Use setting</span>
						<span
							className={classNames(
								hasImage ? "translate-x-5" : "translate-x-0",
								"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
							)}
						>
							<span
								className={classNames(
									hasImage
										? "opacity-0 ease-out duration-100"
										: "opacity-100 ease-in duration-200",
									"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
								)}
								aria-hidden="true"
							>
								<svg
									className="h-3 w-3 text-gray-400"
									fill="none"
									viewBox="0 0 12 12"
								>
									<path
										d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span
								className={classNames(
									hasImage
										? "opacity-100 ease-in duration-200"
										: "opacity-0 ease-out duration-100",
									"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
								)}
								aria-hidden="true"
							>
								<svg
									className="h-3 w-3 text-indigo-600"
									fill="currentColor"
									viewBox="0 0 12 12"
								>
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
				</div>

				{hasImage && (
					<>
						<p className="text-xs md:text-sm font-medium leading-6 flex mb-2">
							Page Layout
						</p>
						<div className="flex justify-start mb-3">
							<div className="grid gap-x-3 gap-y-3 !grid-cols-4">
								<button
									onClick={() =>
										setSelectedPage({
											...selectedPage,
											page_layout: "left-image",
										})
									}
									className={classNames(
										selectedPage.page_layout ===
											"left-image"
											? "ring-blue-400 ring-2 border-blue-500 text-blue-500"
											: "border-gray-300 ring-blue-200 text-gray-200",
										" flex justify-center items-center border rounded overflow-hidden cursor-pointer   hover:ring-2"
									)}
								>
									<svg
										width="56"
										height="38"
										viewBox="0 0 56 38"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="21"
											y="6"
											width="30"
											height="26"
											rx="2"
											fill="currentColor"
										></rect>
										<rect
											width="16"
											height="38"
											fill="#d1d5db"
										></rect>
									</svg>
								</button>
								<div
									onClick={() =>
										setSelectedPage({
											...selectedPage,
											page_layout: "right-image",
										})
									}
									className={classNames(
										selectedPage.page_layout ===
											"right-image"
											? "ring-blue-400 ring-2 border-blue-500 text-blue-500"
											: "border-gray-300 ring-blue-200 text-gray-200",
										" flex justify-center items-center border rounded overflow-hidden cursor-pointer   hover:ring-2"
									)}
								>
									<svg
										width="56"
										height="38"
										viewBox="0 0 56 38"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="5"
											y="6"
											width="30"
											height="26"
											rx="2"
											fill="currentColor"
										></rect>
										<rect
											x="40"
											width="16"
											height="38"
											fill="#d1d5db"
										></rect>
									</svg>
								</div>
							</div>
						</div>

						<>
							<p className="text-xs md:text-sm font-medium leading-6 flex mt-4 mb-2">
								Cover Image
							</p>
							<div>
								<button
									onClick={openMediaGallery}
									className="button-secondary space-x-2"
								>
									<PhotoIcon className="w-4 h-4" />
									<span>
										{selectedPage.cover_image
											? "Change"
											: "Add"}{" "}
										image
									</span>
								</button>

								<MediaGalleryModal
									onSuccess={(file) => {
										if (!file.s3Url) return;
										setSelectedPage({
											...selectedPage,
											cover_image: file.s3Url,
										});
									}}
									open={showMediaGallery}
									onClose={() => setShowMediaGallery(false)}
								/>
								{/* <FileInputWithPreview
									onRemoveFile={() => {
										setSelectedPage({
											...selectedPage,
											cover_image: null,
										});
									}}
									value={
										selectedPage.cover_image ?? undefined
									}
									onSuccess={(file) => {
										if (!file.s3Url) return;
										setSelectedPage({
											...selectedPage,
											cover_image: file.s3Url,
										});
									}}
								/> */}
							</div>
						</>
					</>
				)}
			</div>
		</div>
	);
};

export default EditPageSidebar;
