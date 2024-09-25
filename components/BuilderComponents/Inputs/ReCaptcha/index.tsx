import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import React from "react";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type ReCaptchaProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

const ReCaptcha = (
	props: ReCaptchaProps & Pick<CommonInputProps, "label" | "theme">
) => {
	const { changeProperty } = useBuilderStore();

	return (
		<div>
			<Head>
				<script
					src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}`}
				></script>
			</Head>
			<div className="flex items-center space-x-2">
				<ShieldCheckIcon className="w-4 h-4 text-green-500" />
				<p
					className="text-sm text-gray-500 opacity-80"
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
						"Secured with ReCaptcha"}
				</p>
			</div>
		</div>
	);
};

export default ReCaptcha;
