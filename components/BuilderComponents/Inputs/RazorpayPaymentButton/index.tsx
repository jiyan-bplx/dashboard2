import React, { useState, useEffect } from "react";
import { formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type RazorpayPaymentButtonProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	paymentButtonText?: string;
	paymentButtonId: string;
} & CommonInputProps;
// Demo Payment Button Id: pl_LatgEd6cmU5N1L
const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
	error,
	label,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	useEffect(() => {
		if (!mounted) return;
		if (!props.paymentButtonId) return;
		// Check if script is already there

		const Script = document.createElement("script");
		//id should be same as given to form element
		const Form = document.getElementById("paymentForm");
		Script.setAttribute(
			"src",
			"https://checkout.razorpay.com/v1/payment-button.js"
		);
		Script.setAttribute("data-payment_button_id", props.paymentButtonId);
		Script.setAttribute(
			"data-button_text",
			props.paymentButtonText ?? "Pay Now"
		);

		// Remove form if already exists
		if (Form && Form.children.length > 0) {
			Form.removeChild(Form.children[0]);
		}
		if (Form && props.paymentButtonId) {
			Form.appendChild(Script);
		}

		// Remove the script when component unmounts
		return () => {
			if (Form && props.paymentButtonId) {
				Form.removeChild(Script);
			}
		};
	}, [mounted, props.paymentButtonId, props.paymentButtonText]);

	return (
		<>
			<div>
				<label className="text-xs md:text-sm font-medium leading-6 text-gray-900 flex propss-center space-x-1 mb-1">
					<span
						contentEditable={props.readOnly}
						onBlur={(e) => {
							changeProperty?.({
								key: "label",
								value: e.currentTarget.textContent,
							});
						}}
						dangerouslySetInnerHTML={{
							__html: formatBold(label),
						}}
					/>
					{props.required && (
						<span className="text-red-500 text-base md:text-xl my-0 py-0">
							*
						</span>
					)}
				</label>
				{props.paymentButtonId ? (
					<>{mounted ? <form id="paymentForm"></form> : null}</>
				) : (
					<p className="text-xs mt-1 md:text-sm text-red-500">
						Provide your Payment Button Id from the sidebar.
					</p>
				)}
			</div>
		</>
	);
};

export default RazorpayPaymentButton;
