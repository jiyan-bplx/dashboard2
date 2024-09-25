import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import Script from "next/script";
import React from "react";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type CloudflareTurnstileProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

const CloudflareTurnstile = (
	props: CloudflareTurnstileProps & Pick<CommonInputProps, "label" | "theme">
) => {
	const { changeProperty } = useBuilderStore();

	return (
		<div>
			<Script
				src="https://challenges.cloudflare.com/turnstile/v0/api.js"
				async
				defer
			></Script>

			<div className="flex flex-col w-full">
				{process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY && (
					<div
						className="cf-turnstile mb-2"
						data-sitekey={
							process.env
								.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
						}
					></div>
				)}
				<div className="flex items-center space-x-2 ">
					<ShieldCheckIcon className="w-4 h-4 text-green-500" />
					<p
						className="text-sm opacity-80"
						contentEditable={props.readOnly}
						onBlur={(e) => {
							changeProperty?.({
								key: "label",
								value: e.currentTarget.textContent,
							});
						}}
					>
						{props.label ??
							props.placeholder ??
							"Secured with Cloudflare"}
					</p>
					<div>
						<img
							className="w-4 h-4"
							src="/cloudflare_logo.png"
							alt="Cloudflare"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CloudflareTurnstile;
