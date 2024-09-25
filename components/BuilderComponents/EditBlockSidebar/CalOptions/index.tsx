import useBuilderStore from "@store/builder";
import Input from "../../Inputs/Input";

type CalOptionsProps = {
	activeTab?: string;
};
const CalOptions = ({ activeTab }: CalOptionsProps) => {
	const { changeProperty, selectedInput } = useBuilderStore((state) => state);

	if (!selectedInput) return null;
	return (
		<div>
			{activeTab === "basic" && (
				<div className="my-2">
					<Input
						label="Cal.com Event Url"
						required
						type="url"
						name="calLink"
						id="calLink"
						placeholder="Cal.com Event Url"
						value={(selectedInput as any).calLink}
						onChange={(e) => {
							changeProperty({
								key: "calLink",
								value: e.target.value,
							});
						}}
					/>
				</div>
			)}

			{/* <div className="mt-4 mb-4">
				<p className="text-sm font-medium mb-2">Hide Event Type</p>
				<Checkbox
					title="Hide Event Type"
					checked={
						(selectedInput.calendlyProps as PageSettings)
							?.hideEventTypeDetails
					}
					onChange={(checked) => {
						changeProperty({
							key: "calendlyProps",
							value: {
								...selectedInput.calendlyProps,
								hideEventTypeDetails: checked,
							},
						});
					}}
				/>
			</div>

			<div className="mt-4 mb-4">
				<p className="text-sm font-medium mb-2">Hide Landing Page</p>
				<Checkbox
					title="Hide Landing Page"
					checked={
						(selectedInput.calendlyProps as PageSettings)
							?.hideLandingPageDetails
					}
					onChange={(checked) => {
						changeProperty({
							key: "calendlyProps",
							value: {
								...selectedInput.calendlyProps,
								hideLandingPageDetails: checked,
							},
						});
					}}
				/>
			</div>

			<div className="mt-4 mb-4">
				<p className="text-sm font-medium mb-2">Hide GDPR Banner</p>
				<Checkbox
					title="Hide GDPR Banner"
					checked={selectedInput.calendlyProps?.hideGdprBanner}
					onChange={(checked) => {
						changeProperty({
							key: "calendlyProps",
							value: {
								...selectedInput.calendlyProps,
								hideGdprBanner: checked,
							},
						});
					}}
				/>
			</div> */}
		</div>
	);
};

export default CalOptions;
