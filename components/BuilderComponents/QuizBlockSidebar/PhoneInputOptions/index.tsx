import { InputTypeWithoutIcon } from "../../../../types";
import ExtraParamsRenderer from "../ExtraParamsRenderer";

const PhoneInputOptions = ({
	activeTab,
	selectedInput,
	changeProperty,
}: {
	activeTab?: string;
	selectedInput: InputTypeWithoutIcon;
	changeProperty: (property: { key: string; value: any }) => void;
}) => {
	return (
		<ExtraParamsRenderer
			activeTab={activeTab}
			changeProperty={changeProperty}
			selectedInput={selectedInput}
		/>
	);
};

export default PhoneInputOptions;
