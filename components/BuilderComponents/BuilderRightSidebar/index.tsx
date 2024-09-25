import React, { Fragment } from "react";
import FormOptionsSidebar from "../FormOptionsSidebar";
import { Transition } from "@headlessui/react";
import useBuilderStore, { useFormPagesStore } from "@store/builder";
import { PageSettings } from "@api/forms/requests";
import { InputTypes } from "../../../data/Inputs";
import toast from "react-hot-toast";
import { InputTypeWithoutIcon } from "../../../types";
import QuizOptionsSidebar from "../QuizOptionsSidebar";

const BuilderRightSideBar = ({ isQuiz }: { isQuiz?: boolean }) => {
	const { inputs, setInputs, selectedInput } = useBuilderStore();

	const {
		formPages,
		pages,
		setFormPages,
		setPages,
		setSelectedPage,
		selectedPage,
	} = useFormPagesStore();

	const changeSelectedPage = (page: PageSettings | null) => {
		setSelectedPage(page);

		if (page?.page_type === "cover") {
			// if Page does not have any non-cover elements, don't increase page number by 1
			const hasNonCover = inputs.some((input) => {
				return (
					input.id.includes("cover") === false &&
					input.page === page.page
				);
			});

			// Move all inputs to next page
			const newInputs = inputs.map((input) => {
				if (input.id.includes("cover")) {
					return input;
				} else {
					return {
						...input,
						page: hasNonCover ? (input.page ?? 1) + 1 : input.page,
					};
				}
			});

			// Page type is cover, Page should have an image, description and a button
			// Check if description and image is already present on the page

			// const coverImage = inputs.find((item) => item.type === "image" && item.page === page.page);
			const coverDescription = inputs.find(
				(item) =>
					item.type === "text" &&
					item.page === page.page &&
					item.id === "cover-description"
			);

			if (!coverDescription) {
				const input = InputTypes.find((item) => item.type === "text");
				if (!input) {
					alert("Input not found");
					return;
				}
				if (input.allowOnlyOne) {
					// Check if input of same type exists already
					const exists = inputs.find(
						(item) => item.type === input.type
					);
					if (exists) {
						toast.error(
							`You can have only one ${input.label} in your quiz`
						);
						return;
					}
				}
				const newInput = {
					...input,
					label: input.title ?? input.label,
					placeholder: input.title ?? input.label,
					icon: null,
					page: page.page,
					max: (input as any).max,
					maxLength: input.maxLength ?? undefined,
					defaultValue: "Description (optional)",
					index: inputs.length + 1,
					// id: (inputs.length + 1).toString(),
					id: "cover-description",
				};

				const newList = [...newInputs, newInput];

				setPagesFromInputs(newList);
				setInputs(newList);
			} else {
				setPagesFromInputs(newInputs);
				setInputs([...newInputs]);
			}
		}

		if (page) {
			const pageToChange = formPages?.findIndex(
				(item) => item.page === page.page
			);

			if (typeof pageToChange === "number" && pageToChange !== -1) {
				const tempPages = [...(formPages ?? [])];
				tempPages[pageToChange] = page;
				setFormPages(tempPages);
			} else {
				setFormPages([...(formPages ?? []), page]);
			}
		}
	};

	const setPagesFromInputs = (inputs: InputTypeWithoutIcon[]) => {
		// get unique page numbers
		const pageIndexes = inputs?.map((item) => item.page ?? 1) as number[];
		// Remove duplicates
		const uniquePages = [
			...(new Set(
				pageIndexes
					.map((i, index) => {
						return typeof i === "number" ? i : index + 1;
					})
					?.sort()
			) as any),
		];
		setPages(uniquePages);
	};

	const OptionsSidebar = isQuiz ? QuizOptionsSidebar : FormOptionsSidebar;

	return (
		<>
			<div
				className="bg-white w-72 overflow-auto flex-shrink-0 py-8 hidden md:block h-full min-h-full"
				style={{
					maxHeight: "calc(100vh - 4rem)",
					minHeight: "calc(100vh - 4rem)",
				}}
			>
				<OptionsSidebar
					selectedPage={selectedPage}
					setSelectedPage={changeSelectedPage}
					pages={pages}
				/>
			</div>

			<Transition
				className={
					"lg:hidden z-50 lg:z-auto absolute inset-0 w-screen h-full lg:flex-shrink-0"
				}
				style={{
					marginLeft: "0rem",
				}}
				show={selectedInput ? true : false}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed w-screen inset-0 bg-black bg-opacity-25" />
				</Transition.Child>
				<Transition.Child
					className={
						"w-screen md:w-1/2 lg:w-72 bg-white max-h-screen overflow-auto py-8 h-full min-h-full"
					}
					enter="transition linear duration-200 transform"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition linear duration-200 transform"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<OptionsSidebar
						selectedPage={selectedPage}
						setSelectedPage={setSelectedPage}
						pages={pages}
					/>
				</Transition.Child>
			</Transition>
		</>
	);
};

export default BuilderRightSideBar;
