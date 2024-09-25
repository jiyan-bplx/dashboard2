import useBuilderStore from "@store/builder";
import Input from "../../Inputs/Input";
import ExtraParamsRenderer from "../ExtraParamsRenderer";

type MapsEmbedOptionsProps = {
	activeTab?: string;
};
const MapsEmbedOptions = ({ activeTab }: MapsEmbedOptionsProps) => {
	const { changeProperty, selectedInput } = useBuilderStore((state) => state);

	if (!selectedInput) return null;
	return (
		<div className="">
			{activeTab === "basic" && (
				<div className="my-2 ">
					<Input
						type="url"
						name="defaultValue"
						id="defaultValue"
						required
						label="Place URL"
						placeholder="https://www.google.com/maps/embed?pb=!"
						value={selectedInput.defaultValue}
						onChange={(e) => {
							changeProperty({
								key: "defaultValue",
								value: e.target.value,
							});
						}}
					/>
				</div>
			)}

			<ExtraParamsRenderer
				changeProperty={changeProperty}
				selectedInput={selectedInput}
			/>
		</div>
	);
};

export default MapsEmbedOptions;
