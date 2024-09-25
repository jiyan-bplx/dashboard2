import Head from "next/head";
import React from "react";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";
import { useRouter } from "next/router";

type GoogleAnalyticsProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

const GoogleAnalytics = (
	props: GoogleAnalyticsProps & {
		display?: boolean;
		trackingId?: string | null;
		isPreview?: boolean;
	} & CommonInputProps
) => {
	const { changeProperty } = useBuilderStore();
	const router = useRouter();

	return (
		<div>
			<Head>
				{props.trackingId && !props.readOnly && (
					<>
						<script
							src={`https://www.googletagmanager.com/gtag/js?id=${props.trackingId}`}
						/>
						<script id="google-analytics">
							{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${props.trackingId}');
        `}
						</script>
					</>
				)}
			</Head>

			{(props.display !== false || props.readOnly) &&
				!router.query?.response && (
					<>
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
							{props.label}
						</p>
						{!props.trackingId && (
							<p className="text-xs text-red-500 mt-1">
								Please add your Analytics Tracking ID in the
								sidebar.
							</p>
						)}
					</>
				)}
		</div>
	);
};

export default GoogleAnalytics;
