import React from "react";
import { PageSettings } from "react-calendly/typings/calendly";
import Checkbox from "../../Inputs/Checkbox";
import Input from "../../Inputs/Input";
import useBuilderStore from "@store/builder";

type CalendlyOptionsProps = {
	activeTab?: string;
};
const CalendlyOptions = ({ activeTab }: CalendlyOptionsProps) => {
	const { changeProperty, selectedInput } = useBuilderStore((state) => state);

	if (!selectedInput) return null;

	return (
		<div>
			{activeTab === "basic" && (
				<>
					<div className="my-2">
						<Input
							label="Calendly Event link"
							type="url"
							name="calendlyUrl"
							id="calendlyUrl"
							required
							placeholder="Calendly Event Url"
							value={(selectedInput as any).calendlyUrl}
							onChange={(e) => {
								changeProperty({
									key: "calendlyUrl",
									value: e.target.value,
								});
							}}
						/>
					</div>

					<div className="mt-4 mb-4">
						<p className="text-sm font-medium mb-2">
							Hide Event Type
						</p>
						<Checkbox
							title="Hide Event Type"
							checked={
								(
									(selectedInput as any)
										.calendlyProps as PageSettings
								)?.hideEventTypeDetails
							}
							onChange={(checked) => {
								changeProperty({
									key: "calendlyProps",
									value: {
										...(selectedInput as any).calendlyProps,
										hideEventTypeDetails: checked,
									},
								});
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default CalendlyOptions;
