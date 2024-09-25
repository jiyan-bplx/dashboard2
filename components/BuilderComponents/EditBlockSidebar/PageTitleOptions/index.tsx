import useBuilderStore from "@store/builder";
import ExtraParamsRenderer from "../ExtraParamsRenderer";

type PageTitleOptionsProps = {
	activeTab?: string;
};
const PageTitleOptions = ({ activeTab }: PageTitleOptionsProps) => {
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

export default PageTitleOptions;
