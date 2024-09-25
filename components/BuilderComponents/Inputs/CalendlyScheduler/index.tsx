import React, { useState } from "react";
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import { PageSettings, Prefill } from "react-calendly/typings/calendly";
import { useFormContext } from "react-hook-form";
import { formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type CalendlySchedulerProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	calendlyUrl: string;
	calendlyProps?: PageSettings;
	prefill?: Prefill;
} & CommonInputProps;
const CalendlyScheduler: React.FC<CalendlySchedulerProps> = ({
	error,
	label,
	hideFieldLabel,
	...props
}) => {
	const { changeProperty } = useBuilderStore();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const onModalClose = (e: any) => {
		setIsModalOpen(false);
	};

	const [isEventScheduled, setIsEventScheduled] = useState(false);

	const methods = useFormContext();

	useCalendlyEventListener({
		onEventScheduled: (e) => {
			setIsEventScheduled(true);
			if (props.id) {
				// props.onChange?.({
				// 	target: {
				// 		value: e.data.payload.event.uri,
				// 	},
				// } as any);
				methods.setValue(props.id, e.data.payload.event.uri);
			}
		},
	});

	return (
		<>
			{props.calendlyUrl && typeof window !== "undefined" && (
				<PopupModal
					open={isModalOpen}
					onModalClose={onModalClose}
					prefill={props.prefill}
					pageSettings={props.calendlyProps}
					url={props.calendlyUrl}
					rootElement={document.getElementById("__next") as any}
				/>
			)}

			<div>
				{!hideFieldLabel && (
					<label className="text-xs md:text-sm font-medium leading-6 text-gray-900 flex propss-center space-x-1 mb-2">
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
				)}
				<button
					type="button"
					disabled={!props.calendlyUrl || isEventScheduled}
					className={`button-secondary ${
						!props.calendlyUrl && "opacity-50"
					}`}
					onClick={() => setIsModalOpen(true)}
				>
					{isEventScheduled
						? "Event Scheduled"
						: "Schedule a meeting"}
				</button>

				{!props.calendlyUrl && (
					<p className="text-xs text-red-500 mt-1">
						Please add your Calendly URL in the sidebar.
					</p>
				)}
				{isEventScheduled && (
					<p className="text-xs text-gray-500 mt-1">
						You have scheduled a meeting. You will receive an email
						with the details shortly.
					</p>
				)}
			</div>
		</>
	);
};

export default CalendlyScheduler;
