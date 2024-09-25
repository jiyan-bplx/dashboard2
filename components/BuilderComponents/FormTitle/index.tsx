import { PencilIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { useFormOptionsStore } from "@store/builder";
import { classNames } from "@utils/index";
const FormTitle = ({
	formTitle,
	setFormTitle,
}: {
	formTitle: string;
	setFormTitle: (formTitle: string) => void;
}) => {
	const { formOptions } = useFormOptionsStore();
	const formTitleRef = useRef<HTMLInputElement>(null);

	const [isFormTitleFocused, setIsFormTitleFocused] = useState(false);

	const focusFormTitle = () => {
		setIsFormTitleFocused(true);
		formTitleRef.current?.focus();
	};

	return (
		<>
			<input
				maxLength={50}
				className={classNames(
					formOptions.theme === "dark"
						? "text-gray-200 bg-[#000]"
						: "text-gray-900 bg-white",
					"text-xl md:text-3xl font-medium leading-6 text-center w-full"
				)}
				ref={formTitleRef}
				value={formTitle ?? "My awesome form"}
				onFocus={() => {
					setIsFormTitleFocused(true);
				}}
				onBlur={() => {
					setIsFormTitleFocused(false);
				}}
				onChange={(e) => setFormTitle(e.target.value)}
			/>
			{!isFormTitleFocused && (
				<button
					type="button"
					className={classNames(
						formOptions.theme === "dark"
							? "text-gray-200 border-gray-500 bg-gray-600"
							: "text-gray-900 border-gray-300 bg-white",
						"absolute bg-opacity-10 bg-blur-md  bg-clip-padding backdrop-blur-md border  rounded-3xl shadow-lg h-[30px] w-[30px] right-0 top-1/2 -translate-y-1/2 z-10"
					)}
					onClick={focusFormTitle}
				>
					<PencilIcon className="w-3 md:w-4 h-3 md:h-4 mx-auto" />
				</button>
			)}
		</>
	);
};

export default FormTitle;
