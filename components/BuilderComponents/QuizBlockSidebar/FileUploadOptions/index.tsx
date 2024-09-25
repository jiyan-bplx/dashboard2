import { InputTypeWithoutIcon } from "../../../../types";
import ExtraParamsRenderer from "../ExtraParamsRenderer";

const FileUploadOptions = ({
	selectedInput,
	changeProperty,
	activeTab,
}: {
	activeTab?: string;
	selectedInput: InputTypeWithoutIcon;
	changeProperty: (property: { key: string; value: any }) => void;
}) => {
	return (
		<div>
			{activeTab === "basic" && (
				<div className="mt-2">
					<label
						htmlFor="max"
						className="block text-sm font-medium text-gray-700"
					>
						Max File Size
					</label>
					<div className="mt-1">
						<div className="relative mt-1 rounded-md shadow-sm">
							<input
								type="number"
								name="max"
								min={1}
								max={10_000}
								id="max"
								placeholder="Maximum Size"
								value={selectedInput.max ?? ""}
								onChange={(e) => {
									let size = !e.target.valueAsNumber
										? 10_000
										: e.target.valueAsNumber;

									if (size > 10_000) {
										size = 10_000;
									}
									changeProperty({
										key: "max",
										value: size,
									});
								}}
								className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6 mt-2 shadow-sm"
							/>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
								<span
									className="text-gray-500 sm:text-sm"
									id="price-currency"
								>
									KB
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
			<ExtraParamsRenderer
				changeProperty={changeProperty}
				selectedInput={selectedInput}
			/>
		</div>
	);
};

export default FileUploadOptions;
