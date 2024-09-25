import Input from "../../Inputs/Input";

type RazorpayPaymentButtonOptionsProps = {
	selectedInput: any;
	changeProperty: any;
};
const RazorpayPaymentButtonOptions = ({
	changeProperty,
	selectedInput,
}: RazorpayPaymentButtonOptionsProps) => {
	return (
		<div>
			<div className="my-2">
				<Input
					type="url"
					name="paymentButtonId"
					id="paymentButtonId"
					label="Razorpay Payment Button Id"
					required
					placeholder="Razorpay Payment Button Id"
					value={selectedInput.paymentButtonId}
					onChange={(e) => {
						changeProperty({
							key: "paymentButtonId",
							value: e.target.value,
						});
					}}
				/>
			</div>
			<div className="my-2">
				<Input
					type="url"
					name="paymentButtonText"
					id="paymentButtonText"
					label="Razorpay Payment Button Text"
					required
					placeholder="Razorpay Payment Button Id"
					value={selectedInput.paymentButtonText}
					onChange={(e) => {
						changeProperty({
							key: "paymentButtonText",
							value: e.target.value,
						});
					}}
				/>
			</div>
		</div>
	);
};

export default RazorpayPaymentButtonOptions;
