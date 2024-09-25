import useBuilderStore from "@store/builder";
import ExtraParamsRenderer from "../ExtraParamsRenderer";

const PhoneInputOptions = ({ activeTab }: { activeTab?: string }) => {
	const { changeProperty, selectedInput } = useBuilderStore((state) => state);
	if (!selectedInput) return null;
	return (
		<ExtraParamsRenderer
			activeTab={activeTab}
			changeProperty={changeProperty}
			selectedInput={selectedInput}
		/>
	);
};

export default PhoneInputOptions;
