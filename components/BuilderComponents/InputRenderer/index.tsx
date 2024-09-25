import CalScheduler from "@components/BuilderComponents/Inputs/CalComScheduler";
import CalendlyScheduler from "@components/BuilderComponents/Inputs/CalendlyScheduler";
import Checkbox from "@components/BuilderComponents/Inputs/Checkbox";
import CloudflareTurnstile from "@components/BuilderComponents/Inputs/CloudflareTurnstile";
import FileUploadInput from "@components/BuilderComponents/Inputs/FileUploadInput";
import GoogleAnalytics from "@components/BuilderComponents/Inputs/GoogleAnalytics";
import Input from "@components/BuilderComponents/Inputs/Input";
import ListInput from "@components/BuilderComponents/Inputs/ListInput";
import PictureChoiceInput from "@components/BuilderComponents/Inputs/PictureChoiceInput";
import RadioInput from "@components/BuilderComponents/Inputs/RadioInput";
import RatingInput from "@components/BuilderComponents/Inputs/RatingInput";
import RazorpayPaymentButton from "@components/BuilderComponents/Inputs/RazorpayPaymentButton";
import ReCaptcha from "@components/BuilderComponents/Inputs/ReCaptcha";
import Select from "@components/BuilderComponents/Inputs/Select";
import SignatureInput from "@components/BuilderComponents/Inputs/SignatureInput";
import Switch from "@components/BuilderComponents/Inputs/Switch";
import TelephoneInput from "@components/BuilderComponents/Inputs/TelephoneInput";
import LayoutBlockRenderer from "@components/BuilderComponents/LayoutBlockRenderer";
import McqEditor from "@components/McqEditor";
import { InputTypeWithoutIcon } from "../../../types";
import McqPictureEditor from "../Inputs/McqPictureEditor";

const InputRenderer = ({
	input: item,
	...props
}: {
	questionIndex?: number | null;
	input: InputTypeWithoutIcon & { readOnly?: boolean; isPreview?: boolean };
	changeProperty?: ({ key, value }: { key: string; value: any }) => void;
} & Pick<
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>,
	"onChange" | "value" | "onBlur" | "onFocus"
>) => {
	switch (item.component) {
		case "layout":
			return <LayoutBlockRenderer {...item} {...props} />;
		case "question":
			switch (item.type) {
				case "radio":
					return (
						<McqEditor
							// @ts-ignore
							answer={item.answer ?? []}
							marks={item.marks}
							options={item.options ?? []}
							image={item.image}
							onChange={(props.onChange as any) ?? (() => {})}
							{...item}
							{...props}
							title={item.label}
						/>
					);
				case "picture_choice":
					return (
						<McqPictureEditor
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
							title={item.label}
						/>
					);
			}
		case "input":
			if (item.display === false && !item.readOnly) return null;
			switch (item.type) {
				case "list":
					return (
						<ListInput
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
						/>
					);
				case "switch":
					return (
						<Switch
							title={item.label}
							checked={props.value ? true : false}
							{...item}
							{...props}
							onChange={(props.onChange as any) ?? (() => {})}
						/>
					);

				case "checkbox":
					return (
						<Checkbox
							title={item.label}
							checked={props.value ? true : false}
							{...item}
							{...props}
							onChange={(props.onChange as any) ?? (() => {})}
						/>
					);
				case "select":
					return (
						<Select
							required={item.required}
							multiple={item.multiple}
							placeholder={item.placeholder}
							options={item.options ?? []}
							defaultValue={item.defaultValue}
							onChange={(props.onChange as any) ?? (() => {})}
							{...item}
							{...props}
							title={item.label}
						/>
					);

				case "radio":
					return (
						<RadioInput
							required={item.required}
							options={item.options ?? []}
							defaultValue={item.defaultValue}
							onChange={(props.onChange as any) ?? (() => {})}
							{...item}
							{...props}
							title={item.label}
						/>
					);

				case "signature":
					return (
						<SignatureInput
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...props}
						/>
					);
				case "file":
					return (
						<FileUploadInput
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
						/>
					);
				case "rating":
					return (
						<RatingInput
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
						/>
					);
				case "tel":
					return (
						<TelephoneInput
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
						/>
					);
				case "picture_choice":
					return (
						<PictureChoiceInput
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
						/>
					);
				default:
					return (
						<Input
							{...(item as any)}
							onChange={props.onChange ?? (() => {})}
							{...item}
							{...props}
						/>
					);
			}
		case "special_input":
			switch (item.type) {
				case "razorpay_payment_button":
					return (
						<RazorpayPaymentButton {...(item as any)} {...props} />
					);
				case "cal":
					return <CalScheduler {...(item as any)} {...props} />;
				case "calendly":
					return <CalendlyScheduler {...(item as any)} {...props} />;
				case "cloudflare_turnstile":
					return (
						<CloudflareTurnstile {...(item as any)} {...props} />
					);
				case "recaptcha":
					return <ReCaptcha {...(item as any)} {...props} />;
				case "google_analytics":
					return <GoogleAnalytics {...(item as any)} {...props} />;
			}
	}

	return null;
};

export default InputRenderer;
