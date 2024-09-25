import Link from "next/link";
import { classNames } from "@utils/index";

const BottomBranding = ({ theme }: { theme?: string | null }) => {
	return (
		<div className="w-full mt-4 flex items-center justify-center">
			<Link
				href={
					process.env.NEXT_PUBLIC_WEBSITE_URL ??
					"https://dev.forms.bytesuite.io"
				}
			>
				<div className="flex pt-2 mb-1 flex-row justify-center items-center">
					{theme === "dark" ? (
						<img
							className="block h-8 w-auto"
							src="/byteforms-logo-white.png"
							alt="ByteForms"
						/>
					) : (
						<img
							className="block h-8 w-auto"
							src="/byteformslogo.png"
							alt="ByteForms"
						/>
					)}
				</div>
				<p
					className={classNames(
						theme === "dark" ? "text-gray-200" : "text-gray-800",
						"text-xs text-center"
					)}
				>
					<span>Create your own form </span>
					<span className="font-medium underline">for free</span>
				</p>
			</Link>
		</div>
	);
};

export default BottomBranding;
