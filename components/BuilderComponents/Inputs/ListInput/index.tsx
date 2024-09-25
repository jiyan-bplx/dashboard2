import { TrashIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { memo, useEffect, useState } from "react";
import { CommonInputProps } from "../../../../types";
import { classNames, formatBold } from "@utils/index";
import Input from "../Input";
import useBuilderStore from "@store/builder";

type ListInputProps = {
	title: string;
	name?: string;
	value?: string;
	required?: boolean;
	checked?: boolean;
	onChange: (checked: boolean) => void;
} & CommonInputProps;

const ListInput: React.FC<ListInputProps> = ({
	title,
	onChange,
	checked,
	error,
	theme,
	label,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const [items, setItems] = useState<string[]>([]);

	useEffect(() => {
		if (props.value) {
			setItems(props.value.split(","));
		}
	}, [props.value]);

	const deleteItem = (index: number) => {
		const newItems = [...items];
		newItems.splice(index, 1);
		setItems(newItems);

		onChange?.({
			target: {
				name: props.name as string,
				value: newItems.join(","),
			},
		} as any);
	};

	const onAddOption = () => {
		const newItems = [...items];
		newItems.push("Option " + (newItems.length + 1));
		setItems([...newItems]);

		onChange?.({
			target: {
				name: props.name as string,
				value: newItems.join(","),
			},
		} as any);
	};

	const changeItem = (e: any, index: number, item: string) => {
		const newItems = [...items];
		newItems[index] = item;
		setItems(newItems);
		onChange?.({
			...e,
			target: {
				...e.target,
				name: props.name as string,
				value: newItems.join(","),
			},
		});
	};

	return (
		<div className="">
			{!props.hideFieldLabel &&
				((label && label?.length > 0) || props.required) && (
					<label
						className={classNames(
							theme === "dark"
								? "text-[#a1a1a1]"
								: "text-gray-900",
							"text-xs md:text-sm font-medium leading-6 flex propss-center space-x-1 ",
							props.required ? "-mb-2" : "-mb-1"
						)}
					>
						<span
							contentEditable={props.readOnly}
							onBlur={(e) => {
								changeProperty?.({
									key: "label",
									value: e.currentTarget.textContent,
								});
							}}
							dangerouslySetInnerHTML={{
								__html: formatBold(label),
							}}
						/>
						{props.required && (
							<span className="text-red-500 text-base md:text-xl">
								*
							</span>
						)}
					</label>
				)}
			<div className="flex flex-col mt-2">
				<p className="text-sm text-gray-600">Add items to this list</p>
				{items.map((item, index) => (
					<div
						className="flex items-center space-x-2 flex-row"
						key={index.toString()}
					>
						<div className="w-full">
							<Input
								placeholder="Item 1"
								value={item}
								onChange={(e) =>
									changeItem(e, index, e.target.value)
								}
								readOnly={props.readOnly}
							/>
						</div>
						<button
							type="button"
							className="button-secondary h-full mt-2"
							disabled={props.readOnly}
						>
							<TrashIcon
								onClick={() => {
									deleteItem(index);
								}}
								className="w-4 h-4 text-red-500"
							/>
						</button>
					</div>
				))}
				<button
					type="button"
					className="button-secondary flex space-x-1 items-start self-start mt-2"
					onClick={onAddOption}
					disabled={props.readOnly}
				>
					<PlusIcon className="w-4 h-4" />
					<span>Add item</span>
				</button>
			</div>
			{error && (
				<p className="text-xs text-red-500 mt-2 text-right">{error}</p>
			)}
		</div>
	);
};

export default memo(ListInput);
