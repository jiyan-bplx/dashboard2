import React from "react";
import { useFormPagesStore } from "@store/builder";

const AddNewPageButton = () => {
	const { pages, setPages, setFormPages, formPages } = useFormPagesStore();
	const addNewPage = () => {
		const noOfPages = pages.at(-1) ?? pages.length;
		setPages([...pages, noOfPages + 1]);
		setFormPages([
			...(formPages ?? []),
			{
				page: noOfPages + 1,
				page_layout: "none",
				page_type: "form",
			},
		]);
	};
	return (
		<div className="mt-2 flex items-center space-x-2 text-gray-600">
			<div className="w-full h-px border border-gray-400 border-dashed " />
			<button
				onClick={addNewPage}
				type="button"
				className="flex-shrink-0 text-sm hover:bg-gray-200 rounded transition px-2 py-2 cursor-pointer"
			>
				+ ADD NEW PAGE HERE
			</button>

			<div className="w-full h-px border border-gray-400 border-dashed " />
		</div>
	);
};

export default AddNewPageButton;
