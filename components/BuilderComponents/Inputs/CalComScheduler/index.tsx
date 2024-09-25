import React, { useEffect, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { useFormContext } from "react-hook-form";
import { formatBold } from "@utils/index";
import { CommonInputProps } from "../../../../types";
import useBuilderStore from "@store/builder";

type CalSchedulerProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	calLink: string;
	layout?: "month_view" | "week_view" | "column_view";
	hideEventTypeDetails?: boolean;
	brandColor?: string;
} & CommonInputProps;
const CalScheduler: React.FC<CalSchedulerProps> = ({
	error,
	label,
	hideFieldLabel,
	...props
}) => {
	const { changeProperty } = useBuilderStore();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [isEventScheduled, setIsEventScheduled] = useState(false);

	useEffect(() => {
		(async function () {
			const cal = await getCalApi();
			cal("on", {
				action: "bookingSuccessful",
				callback: (e) => {
					// `data` is properties for the event.
					// `type` is the name of the action
					// `namespace` is the Cal namespace for which the event is fired

					const { data, type, namespace } = e.detail;
					if ((data as any)?.booking?.status === "CANCELLED") {
						setIsEventScheduled(false);
						if (props.id) {
							methods.setValue(props.id, null);
						}
					}

					if ((data as any)?.booking?.status === "ACCEPTED") {
						setIsEventScheduled(true);
						if (props.id) {
							methods.setValue(
								props.id,
								(data as any)?.booking?.eventTypeId
							);
						}
					}

					console.log(e);
				},
			});

			cal("ui", {
				theme: props.theme,
				styles: {
					branding: { brandColor: props.brandColor ?? "#000000" },
				},
				hideEventTypeDetails: props.hideEventTypeDetails,
				layout: props.layout ?? "month_view",
			});
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	const methods = useFormContext();

	return (
		<>
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
					data-cal-link={props.calLink}
					data-cal-config={`{"layout":${
						props.layout ?? "month_view"
					}}`}
					disabled={!props.calLink || isEventScheduled}
					className={`button-secondary ${
						!props.calLink && "opacity-50"
					}`}
					onClick={() => setIsModalOpen(true)}
				>
					{isEventScheduled
						? "Event Scheduled"
						: "Schedule a meeting"}
				</button>

				{!props.calLink && (
					<p className="text-xs text-red-500 mt-1">
						Please add your Cal.com link in the sidebar.
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

export default CalScheduler;
