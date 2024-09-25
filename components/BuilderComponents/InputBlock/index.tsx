import { useDraggable } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { InputTypeItem } from "../../../types";

const InputBlock = ({
	input,
	index,
	addInput,
	isAvailable,
	disableDragDrop,
}: {
	disableDragDrop?: boolean;
	isAvailable?: boolean;
	input: Omit<InputTypeItem, "id">;
	addInput: () => void;
	index: number;
}) => {
	const id = useRef(nanoid());

	const { listeners, setNodeRef, transform } = useDraggable({
		id: id.current,
		disabled: disableDragDrop,
		data: {
			input,
			from: "sidebar",
			fromSidebar: true,
		},
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined;

	return (
		<div
			ref={setNodeRef}
			style={{
				...style,
			}}
			{...listeners}
			onClick={addInput}
			className="bg-gray-100 hover:shadow hover:bg-white   rounded px-4 py-4 w-full h-full transition-colors cursor-pointer relative"
		>
			<div>
				<div>{input.icon}</div>
				<p className="mt-3 text-sm">{input.label}</p>
			</div>
			{!isAvailable && (
				<div className="text-[10px] absolute top-1 right-2 z-10">
					<div className="group relative flex flex-col items-end">
						<div className=" bg-indigo-500 px-2 rounded-full text-white">
							Pro
						</div>
						<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded mt-1 group-hover:opacity-100 transition duration-500">
							This feature is not available in your plan
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default InputBlock;
