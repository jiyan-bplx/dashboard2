import { FormRendererProps } from ".";
import { FormItem } from "@api/forms/responses";
import { classNames } from "@utils/index";
import BottomBranding from "./BottomBranding";

const ParentContainer = ({
	children,
	form,
	options,
}: {
	form?: FormItem | null;
	options: FormRendererProps["options"];
	children: React.ReactNode;
}) => {
	return (
		<>
			<div
				suppressHydrationWarning
				className={classNames(
					options?.transparentBackground
						? "bg-transparent"
						: form?.options?.theme === "dark"
						? "bg-black"
						: "bg-gray-50",
					typeof window !== "undefined"
						? window.location === window.parent.location
							? "min-h-screen"
							: ""
						: "",
					options?.embedType === "popup" ? "" : "py-2 md:py-4",
					`rounded-md w-full`
				)}
			>
				<div
					className={classNames(
						options?.transparentBackground
							? "bg-transparent"
							: form?.options?.theme === "dark"
							? "bg-[#212121] border-gray-500 text-white"
							: "bg-white",
						options?.hideBorders ? "" : "border-t border-b",
						form?.options?.form_width === "centered"
							? " max-w-lg md:max-w-2xl xl:max-w-5xl"
							: "max-w-full",
						`rounded py-8 my-8 px-6  mx-auto self-center`
					)}
				>
					{children}
				</div>
				{form?.options?.remove_branding === true ? null : (
					<div className="pt-4">
						<BottomBranding theme={form?.options?.theme} />
					</div>
				)}
			</div>
		</>
	);
};

export default ParentContainer;
