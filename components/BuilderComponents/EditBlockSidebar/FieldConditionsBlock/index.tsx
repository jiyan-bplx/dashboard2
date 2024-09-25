import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FieldConditionType, InputTypeWithoutIcon } from "../../../../types";
import Select from "../../Inputs/Select";
import Input from "../../Inputs/Input";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import AutoComplete from "../../Inputs/AutoComplete";
const stringItems = [
	// String
	"contains",
	"does not contain",
	"starts with",
	"does not start with",
	"ends with",
	"does not end with",
];

const numberItems = [
	// Number
	"greater than",
	"less than",
	"greater than or equal to",
	"less than or equal to",
];

const FieldConditionsBlock = ({
	selectedInput,
	inputs,
	changeProperty,
	condition: cndValue,
	index,
}: {
	condition?: FieldConditionType | null;
	index?: number | null;
	selectedInput: InputTypeWithoutIcon;
	inputs: InputTypeWithoutIcon[];
	changeProperty: (p: { key: string; value: any }) => void;
}) => {
	const [condition, setCondition] = useState(
		() => cndValue?.condition || "equals"
	);
	const [conditionValue, setConditionValue] = useState<
		string | number | null | undefined
	>(() => cndValue?.conditionValue || null);

	const [actionElement, setActionElement] = useState<string | null>(
		() => cndValue?.actionElement || null
	);
	const [action, setAction] = useState(() => cndValue?.action || "hidden");

	const onRemoveCondition = () => {
		if (index !== null) {
			const prevConditions = selectedInput.conditions ?? [];
			changeProperty({
				key: "conditions",
				value: prevConditions.filter((_, i) => i !== index),
			});
		}
	};
	const onAddCondition = (props?: {
		i?: number;
		action?: string;
		actionElement?: string;
		condition?: string;
		conditionValue?: string | number;
	}) => {
		if (!["is empty", "is not empty"].includes(condition)) {
			if (
				conditionValue === null ||
				typeof conditionValue === "undefined" ||
				conditionValue === "" ||
				(typeof conditionValue === "string" &&
					conditionValue.length === 0)
			) {
				toast.error(
					`Please set a condition value for '${selectedInput.label}' in field conditions.`
				);
				document.getElementById("condition-value")?.focus();
				return;
			}
		}

		if (!actionElement) {
			toast.error(
				`Please set an action for '${selectedInput.label}' in field conditions.`
			);
			(
				document.getElementsByClassName(
					"select-action-element"
				)?.[0] as any
			)?.focus();
			return;
		}

		const prevConditions = selectedInput.conditions ?? [];

		const val = {
			condition,
			conditionValue: conditionValue ?? undefined,
			action,
			actionElement,
		};
		if (typeof props?.i === "number") {
			const { i, condition, action, actionElement, conditionValue } =
				props;

			prevConditions[i] = {
				...val,
				condition: condition ?? val.condition,
				action: action ?? val.action,
				actionElement: actionElement ?? val.actionElement,
				conditionValue: conditionValue ?? val.conditionValue,
			};
			changeProperty({
				key: "conditions",
				value: [...prevConditions],
			});
			return;
		} else {
			changeProperty({
				key: "conditions",
				value: [...prevConditions, val],
			});
		}
		setCondition("equals");
		setConditionValue(null);
		setAction("hidden");
		setActionElement(null);
	};
	const conditionOptions = useMemo(() => {
		if (
			selectedInput.type === "checkbox" ||
			selectedInput.type === "switch"
		) {
			return ["is empty", "is not empty"];
		}

		if (selectedInput.type === "rating" || selectedInput.type === "range") {
			return [...numberItems, "equals", "does not equal"];
		}

		const common = [
			"equals",
			"does not equal",
			"is empty",
			"is not empty",

			// "is any of",
			// "is not any of",
		];

		return [
			...common,
			...(selectedInput.type === "number" ? numberItems : stringItems),
		];
	}, [selectedInput.type]);
	return (
		<div
			id="field-conditions"
			className={`field-conditions-container-${actionElement}`}
		>
			<div className="mt-2 flex flex-wrap items-center gap-2">
				<p
					className="flex-shrink-0 text-sm max-w-full"
					style={{
						overflowWrap: "break-word",
					}}
				>
					If '{selectedInput.label}'
				</p>
				<Select
					defaultValue={condition ?? undefined}
					onChange={(e) => {
						setCondition(e.target.value);
						if (cndValue && typeof index === "number") {
							onAddCondition({
								i: index,
								condition: e.target.value,
							});
						}
					}}
					options={conditionOptions}
				/>
			</div>
			{[
				"equals",
				"does not equal",

				// "is any of",
				// "is not any of",

				...stringItems,
				...numberItems,
			].includes(condition) &&
				!["checkbox"].includes(selectedInput.type) && (
					<div className="mt-2">
						<Input
							id="condition-value"
							placeholder="Condition value"
							label=""
							value={conditionValue ?? ""}
							onChange={(e) => {
								setConditionValue(e.target.value);
								if (cndValue && typeof index === "number") {
									onAddCondition({
										i: index,
										conditionValue: e.target.value,
									});
								}
							}}
							max={
								selectedInput.max ??
								selectedInput.type === "rating"
									? selectedInput.maxLength
									: undefined
							}
							min={
								selectedInput.min ??
								selectedInput.type === "rating"
									? 1
									: undefined
							}
							type={
								["select", "radio"].includes(selectedInput.type)
									? "text"
									: ["range", "rating"].includes(
											selectedInput.type
									  )
									? "number"
									: selectedInput.type
							}
						/>
					</div>
				)}
			<div
				className="mt-2 flex flex-col items- -x-2"
				id={`action-element-container-${actionElement}`}
			>
				<p className="text-sm flex-shrink-0">Then make</p>

				<AutoComplete
					id="action-element"
					placeholder="Select action element"
					data={inputs}
					onSelect={(item) => {
						setActionElement(item.id as string);
						if (cndValue && typeof index === "number") {
							onAddCondition({
								i: index,
								actionElement: item.id as string,
							});
						}
					}}
					value={
						actionElement
							? inputs.find((item) => item.id === actionElement)
							: null
					}
					getLabel={(item) => (item as any)?.label}
					getVal={(item) => (item as any)?.id}
				/>
			</div>
			<div className="mt-2">
				<Select
					id="action"
					defaultValue={action ?? undefined}
					onChange={(e) => {
						setAction(e.target.value);
						if (cndValue && typeof index === "number") {
							onAddCondition({
								i: index,
								action: e.target.value,
							});
						}
					}}
					options={[
						"hidden",
						"shown",
						"required",
						"optional",
						"disabled",
					]}
				/>
			</div>
			{cndValue ? (
				<div>
					<div className="flex justify-end">
						<button
							id={`conditions-submit-btn-${actionElement}`}
							className="button-danger mt-4 "
							onClick={onRemoveCondition}
						>
							<MinusIcon className="w-4 h-4 mr-1" />
							Remove
						</button>
					</div>
					<hr className="w-full h-px bg-black mt-4 mb-2" />
				</div>
			) : (
				<div className="flex justify-end">
					<button
						className="button-secondary mt-4 "
						onClick={() => onAddCondition()}
					>
						<PlusIcon className="w-4 h-4 mr-1" />
						Save & Add more
					</button>
				</div>
			)}
		</div>
	);
};

export default FieldConditionsBlock;
