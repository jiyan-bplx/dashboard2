import { TrashIcon } from "@heroicons/react/20/solid";
import { InputTypeWithoutIcon } from "../../../../types";
import ExtraParamsRenderer from "../ExtraParamsRenderer";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PictureChoiceOptionModal from "../../../Modals/PictureChoiceOptionModal";
import { InputTypes } from "../../../../data/Inputs";

const PictureChoiceInputOptions = ({
	selectedInput,
	changeProperty,
	activeTab,
}: {
	activeTab?: string;
	selectedInput: InputTypeWithoutIcon;
	changeProperty: (property: { key: string; value: any }) => void;
}) => {
	const [showAddModal, setShowAddModal] = useState<null | number>(null);
	const onAddOption = () => {
		const images = InputTypes.find(
			(item) => item.type === "picture_choice"
		)?.options?.map((e: any) => (e as any).value);
		if (images === undefined) return;
		// Select a random image
		const randomImage = images[Math.floor(Math.random() * images.length)];
		const newOptions = [
			...(selectedInput.options || []),
			{
				label: "Option " + ((selectedInput.options?.length || 0) + 1),
				value: randomImage,
			},
		];
		changeProperty({ key: "options", value: newOptions });
	};

	return (
		<div>
			<PictureChoiceOptionModal
				optionIndex={showAddModal ?? 0}
				isOpen={typeof showAddModal === "number"}
				closeModal={() => setShowAddModal(null)}
				selectedInput={selectedInput}
				changeProperty={changeProperty}
				option={selectedInput.options?.at(showAddModal || 0) as any}
			/>
			{activeTab === "basic" && (
				<div className="mt-2">
					<label
						htmlFor="max"
						className="block text-sm font-medium text-gray-700"
					>
						Options
					</label>
					<div className="mt-1 grid grid-cols-1 gap-2">
						{selectedInput.options?.map(
							(option: any, index: number) => (
								<div
									key={index.toString()}
									className="border flex items-center py-2 px-2 rounded border-gray-300 relative justify-between"
								>
									<div className="flex items-center">
										<img
											src={(option as any).value}
											alt={(option as any).label}
											className="aspect-square object-cover rounded w-8"
										/>

										<p className=" text-xs text-gray-600 ml-2">
											{(option as any).label}
										</p>
									</div>
									<div className="flex space-x-1">
										<button
											className="flex text-white items-center justify-center space-x-2 button-secondary !px-2"
											type="button"
											onClick={() =>
												setShowAddModal(index)
											}
										>
											<PencilIcon className="w-3 h-3" />
										</button>
										<button
											onClick={() => {
												const newOptions =
													selectedInput.options?.filter(
														(o: any, i: number) =>
															i !== index
													);
												changeProperty({
													key: "options",
													value: newOptions,
												});
											}}
											className="flex text-white items-center justify-center space-x-2 button-danger !px-2"
											type="button"
										>
											<TrashIcon className="w-3 h-3" />
										</button>
									</div>
								</div>
							)
						)}
						<button
							id={`add-option-picture-choice-${selectedInput.id}`}
							type="button"
							onClick={onAddOption}
							className="border items-center mt-4 flex p-2 rounded border-gray-300"
						>
							<div className="w-8 h-8 bg-indigo-100  aspect-square flex items-center justify-center">
								<PlusIcon className="w-4 h-4 text-indigo-600" />
							</div>
							<p className="ml-2 text-xs text-gray-600">
								Add option
							</p>
						</button>
					</div>
				</div>
			)}
			<ExtraParamsRenderer
				changeProperty={changeProperty}
				selectedInput={selectedInput}
			/>
		</div>
	);
};

export default PictureChoiceInputOptions;
