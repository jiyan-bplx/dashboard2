import { XMarkIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { InputTypes } from "../../../data/Inputs";
import { PrebuiltBlocks } from "../../../data/Prebuilt";
import { getPlanLimits } from "@api/subscriptions";
import Input from "../Inputs/Input";
import InputBlock from "../InputBlock";
import { InputTypeWithoutIcon } from "../../../types";

const NewBlockSidebar = ({
	addInput,
	closeSidebar,
	disableDragDrop,
}: {
	disableDragDrop?: boolean;
	closeSidebar: () => void;
	addInput: (
		input:
			| Omit<InputTypeWithoutIcon, "id">
			| (typeof PrebuiltBlocks)[number]["inputs"]
	) => void;
}) => {
	const { data: planLimits, isLoading: isLoadingLimits } = useQuery(
		"plan_limits",
		getPlanLimits
	);

	const isAvailable = (inputKey: string) => {
		return planLimits?.data?.limits?.allowed_inputs?.includes(inputKey);
	};

	const onAdd = (
		inputItem:
			| (typeof InputTypes)[number]
			| (typeof PrebuiltBlocks)[number]["inputs"]
	) => {
		if (Array.isArray(inputItem)) {
			const notAvailable = inputItem.some(
				(item) => !isAvailable(item.type)
			);
			if (notAvailable) {
				toast.error(
					"Some of the inputs are not available in your plan."
				);
			}
			addInput(inputItem);
		} else {
			const { icon, ...input } = inputItem;
			addInput(input);
			if (!isAvailable(input.type)) {
				toast.error(
					"This input is not supported in your plan. Please upgrade to use this input."
				);
			}
		}
	};

	const [search, setSearch] = useState("");

	const sortInputByVersionAndRemoveDuplicates = (
		inputs: typeof InputTypes
	): typeof InputTypes => {
		// Use reduce to accumulate latest versions
		const latestVersions = inputs.reduce((acc: any, block) => {
			const key = `${block.component}-${block.type}-${block.label}`;

			// Check if the key already exists in the accumulator
			if (acc.hasOwnProperty(key)) {
				// If the current version is higher, update it
				if (acc[key].version < (block.version ?? 0)) {
					acc[key] = block;
				}
			} else {
				// If the key doesn't exist, add it to the accumulator
				acc[key] = block;
			}

			return acc;
		}, {});

		// Convert latestVersions object back to an array
		const result = Object.values(latestVersions);

		return result as typeof InputTypes;
	};

	const InputBlocks = useMemo(() => {
		const items = InputTypes.filter((item) => item.component === "input");
		if (search?.length > 1) {
			return items.filter((item) =>
				item.label.toLowerCase().includes(search.toLowerCase().trim())
			);
		}
		return sortInputByVersionAndRemoveDuplicates(items);
	}, [search]);

	const SpecialInputBlocks = useMemo(() => {
		const items = InputTypes.filter(
			(item) => item.component === "special_input"
		);
		if (search?.length > 1) {
			return items.filter((item) =>
				item.label.toLowerCase().includes(search.toLowerCase().trim())
			);
		}
		return sortInputByVersionAndRemoveDuplicates(items);
	}, [search]);

	const LayoutBlocks = useMemo(() => {
		const items = InputTypes.filter((item) => item.component === "layout");
		if (search?.length > 1) {
			return items.filter((item) =>
				item.label.toLowerCase().includes(search.toLowerCase().trim())
			);
		}
		return sortInputByVersionAndRemoveDuplicates(items);
	}, [search]);

	const FilteredPrebuiltBlocks = useMemo(() => {
		const items = PrebuiltBlocks;
		if (search?.length > 1) {
			return items.filter(
				(item) =>
					item.title
						.toLowerCase()
						.includes(search.toLowerCase().trim()) ||
					item.inputs.some((el) =>
						el.label
							.toLowerCase()
							.includes(search.toLowerCase().trim())
					)
			);
		}
		return items;
	}, [search]);
	return (
		<div className="">
			<div className="flex items-center justify-between">
				<p className="mb-4 text-base font-semibold leading-6 text-gray-900">
					Add blocks from here
				</p>
				<XMarkIcon
					onClick={closeSidebar}
					className="h-6 w-6 lg:hidden"
					aria-hidden="true"
				/>
			</div>
			<Input
				label=""
				placeholder="Search"
				className=""
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			{InputBlocks?.length > 0 && (
				<>
					<p className="text-sm text-gray-500 my-3">Inputs</p>
					<div className="grid grid-cols-2 gap-2">
						{InputBlocks.map((input, index) => (
							<InputBlock
								index={index}
								addInput={() => onAdd(input)}
								input={input}
								disableDragDrop={disableDragDrop}
								key={index}
								isAvailable={isAvailable(input.type)}
							/>
						))}
					</div>
				</>
			)}
			{SpecialInputBlocks?.length > 0 && (
				<>
					<p className="text-sm text-gray-500 my-3">Special Inputs</p>
					<div className="grid grid-cols-2 gap-2">
						{SpecialInputBlocks.map((input, index) => (
							<InputBlock
								disableDragDrop={disableDragDrop}
								index={index}
								addInput={() => onAdd(input)}
								input={input}
								key={index}
								isAvailable={isAvailable(input.type)}
							/>
						))}
					</div>
				</>
			)}

			{LayoutBlocks?.length > 0 && (
				<>
					<p className="text-sm text-gray-500 my-3">Layouts</p>
					<div className="grid grid-cols-2 gap-2">
						{LayoutBlocks.map((input, index) => (
							<InputBlock
								disableDragDrop={disableDragDrop}
								index={index}
								addInput={() => onAdd(input)}
								input={input}
								key={input.type}
								isAvailable={isAvailable(input.type)}
							/>
						))}
					</div>
				</>
			)}
			{FilteredPrebuiltBlocks?.length > 0 && (
				<>
					<p className="text-sm text-gray-500 my-3">
						Prebuilt Blocks
					</p>
					<div className="grid grid-cols-2 gap-2">
						{FilteredPrebuiltBlocks.map((item, index) => (
							<div
								onClick={() => onAdd(item.inputs)}
								key={index}
								className="bg-gray-100 hover:shadow hover:bg-white   rounded px-4 py-4 w-full h-full transition-colors cursor-pointer"
							>
								<div>{item.icon}</div>
								<p className="mt-3 text-sm">{item.title}</p>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default NewBlockSidebar;
