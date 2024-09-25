import ExtraParamsRenderer from "../ExtraParamsRenderer";

type PageTitleOptionsProps = {
	selectedInput: any;
	activeTab?: string;
	changeProperty: any;
};
const PageTitleOptions = ({
	changeProperty,
	selectedInput,
	activeTab,
}: PageTitleOptionsProps) => {
	return (
		<ExtraParamsRenderer
			activeTab={activeTab}
			changeProperty={changeProperty}
			selectedInput={selectedInput}
		/>
	);
};

export default PageTitleOptions;
