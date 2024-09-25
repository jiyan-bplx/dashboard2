import React, { useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { classNames, dataUrlToFile, formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type SignatureInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> &
	CommonInputProps;
const SignatureInput: React.FC<SignatureInputProps> = ({
	error,
	label,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	useEffect(() => {
		if (props.value) {
			let jsonValue = JSON.parse(JSON.stringify(props.value));
			signatureCanvasRef.current?.fromDataURL(jsonValue?.publicUrl);
			setIsSigned(true);
		}

		if (signatureCanvasRef?.current) {
			if (props.readOnly) {
				signatureCanvasRef.current.off();
			} else {
				signatureCanvasRef.current.on();
			}
		}
	}, [props.value, props.readOnly]);

	const signatureCanvasRef = React.useRef<SignatureCanvas>(null);
	const [isSigned, setIsSigned] = useState(false);
	const onClear = () => {
		setIsSigned(false);
		signatureCanvasRef.current?.clear();
	};
	return (
		<>
			{!props.hideFieldLabel && (
				<label
					className={classNames(
						props.theme === "dark"
							? "text-[#a1a1a1]"
							: "text-gray-900",
						"text-xs md:text-sm font-medium leading-6 flex propss-center space-x-1"
					)}
				>
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
						<span className="text-red-500  text-xl">*</span>
					)}
				</label>
			)}
			<div className="flex flex-col">
				<div className="relative w-full aspect-video max-w-full 2xl:max-w-[512px] max-h-[128px] md:max-h-[192px] xl:max-h-[256px]">
					<SignatureCanvas
						ref={signatureCanvasRef}
						onBegin={(e) => {
							// setIsSigned(false);
						}}
						onEnd={(e) => {
							setIsSigned(true);
							props.onChange?.({
								target: {
									value: signatureCanvasRef?.current?.toDataURL(),
								},
							} as any);
						}}
						penColor={
							props.color ?? props.theme === "dark"
								? "rgb(147, 197, 253)"
								: "blue"
						}
						canvasProps={{
							// width: 512,
							// height: 256,
							className: classNames(
								props.theme === "dark"
									? "text-gray-100 bg-[#0a0a0a]"
									: "bg-indigo-50 text-gray-900",
								`block rounded-md border-0 py-1.5  placeholder:text-gray-400  sm:text-sm sm:leading-6 mt-2  w-full h-full`
							),
						}}
					/>

					{!isSigned && (
						<p
							className={classNames(
								props.theme === "dark"
									? "text-gray-100 "
									: "text-gray-900",
								"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:text-sm text-xs "
							)}
						>
							Sign here
						</p>
					)}
				</div>

				{isSigned && (
					<button
						type="button"
						className="mt-4 button-secondary self-end"
						onClick={onClear}
						disabled={props.readOnly}
					>
						Clear
					</button>
				)}
			</div>
			{props.required && !isSigned && (
				<p className="text-xs text-red-500 mt-2 text-right">
					Signature is required.
				</p>
			)}
			{error && (
				<p className="text-xs text-red-500 mt-2 text-right">{error}</p>
			)}
		</>
	);
};

export default SignatureInput;
