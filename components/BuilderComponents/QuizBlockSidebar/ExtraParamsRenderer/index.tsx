import React from "react";
import {
	ExtraParamsType,
	InputItemType,
	InputTypes,
} from "../../../../data/Inputs";
import { InputTypeWithoutIcon } from "../../../../types";
import Checkbox from "../../Inputs/Checkbox";
import Input from "../../Inputs/Input";

export const RenderOption = ({
	input,
	fieldKey,
	params,
	changeProperty,
	selectedInput,
}: {
	input: InputItemType | undefined;
	fieldKey: string;
	params: ExtraParamsType;
	selectedInput: InputTypeWithoutIcon;
	changeProperty: (property: { key: string; value: any }) => void;
}) => {
	const itemExtraParams = input?.extra_params?.[fieldKey] ?? params;

	if (itemExtraParams?.showWhen?.(selectedInput) === false) {
		return null;
	}

	const value = selectedInput[fieldKey as keyof InputTypeWithoutIcon];

	if (itemExtraParams.type === "boolean") {
		return (
			<div>
				<Checkbox
					title={itemExtraParams.name}
					checked={value ?? false}
					onChange={(checked) =>
						changeProperty({
							key: fieldKey,
							value: checked,
						})
					}
				/>
			</div>
		);
	}

	if (
		itemExtraParams.type === "string" ||
		itemExtraParams.type === "number"
	) {
		return (
			<div>
				<Input
					type={itemExtraParams.type === "number" ? "number" : "text"}
					value={value}
					onChange={(e) => {
						if (e.target.value === "") {
							changeProperty({
								key: fieldKey,
								value: undefined,
							});
							return;
						}
						if (itemExtraParams.type === "number") {
							changeProperty({
								key: fieldKey,
								value: e.target.valueAsNumber,
							});
						} else {
							changeProperty({
								key: fieldKey,
								value: e.target.value,
							});
						}
					}}
					placeholder={itemExtraParams.description}
					title={itemExtraParams.name}
					label={params.name}
					{...(itemExtraParams.additional || {})}
				/>
			</div>
		);
	}

	return <></>;
};

const ExtraParamsRenderer = ({
	selectedInput,
	changeProperty,
	activeTab,
}: {
	activeTab?: string;
	selectedInput: InputTypeWithoutIcon;
	changeProperty: (property: { key: string; value: any }) => void;
}) => {
	const input = InputTypes?.find(
		(input) =>
			input.type === selectedInput.type &&
			input.component === selectedInput.component &&
			(!input.version || input.version === selectedInput.version)
	);
	return (
		<>
			{input &&
				input.extra_params &&
				Object.keys(input.extra_params)?.map(
					(key) =>
						input.extra_params?.[key] &&
						activeTab === input.extra_params?.[key].category && (
							<div className="my-2" key={key}>
								<RenderOption
									input={input}
									changeProperty={changeProperty}
									selectedInput={selectedInput}
									fieldKey={key}
									params={input.extra_params?.[key]}
								/>
							</div>
						)
				)}
		</>
	);
};

export default ExtraParamsRenderer;
