import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import useBuilderStore, { useFormOptionsStore } from "@store/builder";
import { InputTypeWithoutIcon } from "../../../types";
import {
	checkIfMobile,
	classNames,
	generateIdFromName,
	smoothScrollToId,
} from "@utils/index";
import ProBadge from "../../ProBadge";
import InputRenderer from "../InputRenderer";

const InputItem = ({
	input: item,
	onDelete,
	index,
	isSelected,
	isPreview = false,

	disableSorting,
	isAvailable,
}: {
	isAvailable?: boolean;
	input: InputTypeWithoutIcon;
	isSelected?: boolean;
	onDelete: () => void;
	index: number;
	disableSorting?: boolean;
	isPreview?: boolean;
}) => {
	const theme = useFormOptionsStore((state) => state.formOptions.theme);

	const { changeProperty, inputs, setInputs, setSelectedInput } =
		useBuilderStore((state) => state);

	const getQuestionIndex = () => {
		return inputs
			?.filter((input) => input.component === "question")
			.findIndex((e) => e.id === item.id);
	};

	const onSelect = () => setSelectedInput(item);

	const cloneInput = () => {
		if (item.allowOnlyOne) {
			// Check if input of same type exists already
			const exists = inputs.find((item) => item.type === item.type);
			if (exists) {
				toast.error(`You can have only one ${item.label} in your form`);
				return;
			}
		}
		const newInput = {
			...item,
			id: generateIdFromName(
				item.label ?? `${item.type}${inputs.length + 1}`,
				inputs
			),
		};
		setInputs([...inputs, newInput]);

		// if device is mobile, scroll to the input, otherwise, select the input
		if (!checkIfMobile()) {
			setSelectedInput(newInput);
		}

		//wait for the input to be rendered
		setTimeout(() => {
			smoothScrollToId(`input-parent-${newInput.id}`);
		}, 100);
	};

	const {
		attributes,
		listeners,
		over,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		disabled: disableSorting,
		id: item.id,
		data: {
			from: "canvas",
			index,
			input: item,
			id: item?.id,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging
			? over?.data.current?.input?.page !== item.page
				? 0.25
				: 0.5
			: 1,
	};

	if (!item) {
		return null;
	}

	return (
		<div
			style={style}
			ref={setNodeRef}
			className={classNames(
				isSelected ? "bg-opacity-100" : "bg-opacity-0",
				item.width === "half" ? "w-1/2" : "w-full",
				theme === "dark" ? "bg-gray-700" : "bg-indigo-50",
				"py-2 transition-all  duration-300 border border-transparent",
				isPreview
					? "hover:border-transparent"
					: "border-dashed hover:border-gray-400"
			)}
			onClick={onSelect}
			id={`input-parent-${item.id}`}
		>
			<div
				className={classNames(
					isPreview ? "px-6" : "px-1",
					"pt-2 flex items-start space-x-2 group w-full"
				)}
			>
				{isPreview && (
					<div className="flex space-x-2">
						<button
							onClick={onDelete}
							type="button"
							title="Delete Input"
							className={classNames(
								`pt-1 group-hover:opacity-100 transition text-red-500 ${
									isSelected ? "opacity-100" : "opacity-0"
								}`
							)}
						>
							<TrashIcon className="w-3 md:w-4 h-3 md:h-4" />
						</button>
						<button
							onClick={cloneInput}
							type="button"
							title="Clone Input"
							className={classNames(
								theme === "dark"
									? "text-gray-400"
									: "text-black",
								`pt-1 opacity-0 group-hover:opacity-100 transition ${
									isSelected ? "opacity-100" : "opacity-0"
								}`
							)}
						>
							<ClipboardDocumentIcon className="w-3 md:w-4 h-3 md:h-4" />
						</button>
						<button
							onClick={onSelect}
							type="button"
							className={classNames(
								theme === "dark"
									? "text-gray-400"
									: "text-black",
								`pt-1 opacity-0 group-hover:opacity-100 transition ${
									isSelected ? "opacity-100" : "opacity-0"
								}`
							)}
						>
							<Cog6ToothIcon className="w-3 md:w-4 h-3 md:h-4" />
						</button>
					</div>
				)}
				<div className="md:px-2 w-full my-0 py-0 relative">
					<InputRenderer
						questionIndex={getQuestionIndex()}
						changeProperty={changeProperty}
						input={{
							...item,
							readOnly: true,
							isPreview: isPreview ? true : disableSorting,
						}}
					/>
					{!isAvailable && (
						<div className="absolute top-1 right-2 z-10">
							<ProBadge />
						</div>
					)}

					{item.instructions?.length > 0 && (
						<p
							contentEditable
							onBlur={(e) => {
								changeProperty?.({
									key: "instructions",
									value: e.currentTarget.textContent,
								});
							}}
							className={classNames("mt-3 text-xs text-gray-500")}
						>
							{item.instructions}
						</p>
					)}
				</div>

				{isPreview && (
					<div
						{...attributes}
						{...listeners}
						className={classNames(
							theme === "dark" ? "text-gray-400" : "text-black",
							`self-end mb-2 ${
								isSelected ? "opacity-100" : "opacity-0"
							} group-hover:opacity-100 transition`
						)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4 md:w-6 md:h-6"
						>
							<circle cx="9" cy="12" r="1" />
							<circle cx="9" cy="5" r="1" />
							<circle cx="9" cy="19" r="1" />
							<circle cx="15" cy="12" r="1" />
							<circle cx="15" cy="5" r="1" />
							<circle cx="15" cy="19" r="1" />
						</svg>
					</div>
				)}
			</div>
		</div>
	);
};

export default InputItem;
