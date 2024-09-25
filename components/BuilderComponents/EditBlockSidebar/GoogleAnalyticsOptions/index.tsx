import useBuilderStore from "@store/builder";
import Input from "../../Inputs/Input";

type GoogleAnalyticsOptionsProps = {
	activeTab?: string;
};
const GoogleAnalyticsOptions = ({ activeTab }: GoogleAnalyticsOptionsProps) => {
	const { changeProperty, selectedInput } = useBuilderStore((state) => state);

	if (!selectedInput) return null;

	return (
		<div>
			{activeTab === "basic" && (
				<div className="my-2">
					<Input
						label="Google Analytics Tracking ID"
						type="url"
						name="trackingId"
						id="trackingId"
						required
						placeholder="G-XXXXXXXXXX"
						value={(selectedInput as any).trackingId}
						onChange={(e) => {
							changeProperty({
								key: "trackingId",
								value: e.target.value,
							});
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default GoogleAnalyticsOptions;
