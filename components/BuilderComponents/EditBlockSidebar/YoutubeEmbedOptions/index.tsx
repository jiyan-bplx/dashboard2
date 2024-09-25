import useBuilderStore from "@store/builder";
import Input from "../../Inputs/Input";
import ExtraParamsRenderer from "../ExtraParamsRenderer";

type YoutubeEmbedOptionsProps = {
	activeTab?: string;
};
const YoutubeEmbedOptions = ({ activeTab }: YoutubeEmbedOptionsProps) => {
	const { changeProperty, selectedInput } = useBuilderStore((state) => state);

	if (!selectedInput) return null;
	return (
		<div className="border-b">
			{activeTab === "basic" && (
				<div className="my-2 ">
					<Input
						type="url"
						name="defaultValue"
						id="defaultValue"
						required
						label="Youtube Video URL"
						placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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

export default YoutubeEmbedOptions;
