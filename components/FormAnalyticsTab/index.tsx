import { ArrowUturnRightIcon } from "@heroicons/react/20/solid";
import {
	CalendarIcon,
	DocumentCheckIcon,
	EyeIcon,
	PresentationChartBarIcon,
	PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from "recharts";
import "react-tooltip/dist/react-tooltip.css";

import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

import { GetFormByIdResponse } from "@api/forms/responses";

import { format, parseISO, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { CountryCodesPhoneNo } from "../../data/CountryCodesPhone";
import { getFormAnalytics } from "@api/forms";
import MapChart from "./MapChart";
import { MapGeoItem } from "../../types";

type ValuePiece = Date | null;

type Value = [ValuePiece, ValuePiece];

const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
	const { active, payload, label } = props;
	if (active && payload && payload.length) {
		return (
			<div className="bg-white px-4 py-2 shadow rounded-[4px] text-black">
				<p className="capitalize text-left text-sm">
					<span className="font-light">
						{props.payload?.at(0)?.name}:{" "}
					</span>
					<span className="font-medium">
						{format(
							new Date(props.payload?.at(0)?.payload?.date),
							"dd MMM yy"
						)}
					</span>
				</p>
				<p className="text-sm text-gray-600">
					{props.payload?.at(0)?.payload?.count} Form Views
				</p>
			</div>
		);
	}

	return null;
};

const FormAnalyticsTab = ({
	formId,
	data,
	publicId,
}: {
	data?: GetFormByIdResponse;
	formId: number;
	publicId?: string;
}) => {
	const [dateRange, onChange] = useState<Value>([
		subMonths(new Date(), 1),
		new Date(),
	]);

	const { data: analyticsData, isLoading } = useQuery(
		["analytics", formId, dateRange],
		() =>
			getFormAnalytics(
				formId,
				dateRange && dateRange?.length === 2
					? {
							from_date: dateRange[0]?.toISOString(),
							to_date: dateRange[1]?.toISOString(),
					  }
					: null
			)
	);

	const views = useMemo(() => {
		return Math.max(
			analyticsData?.data?.open_count ?? 0,
			analyticsData?.data?.submission_count ?? 0
		);
	}, [analyticsData]);

	const isCountryInAnalytics = (name: string) => {
		const countryCode = CountryCodesPhoneNo.find(
			(e) => e.name === name
		)?.code;

		return analyticsData?.data?.analytics_data?.by_country?.find(
			(c) => c.country === countryCode
		);
	};

	const [hoveredCountry, setHoveredCountry] = useState<
		(MapGeoItem & { x: any; y: any }) | null
	>(null);

	return (
		<div className="mt-4">
			<div className="flex items-center justify-between  mb-4">
				<p className="font-medium text-title">Form Analytics</p>
				<div className="flex items-center space-x-1 button-outlined !py-1 !pr-0 !pl-2">
					<DateRangePicker
						format="yyyy/MM/dd"
						onChange={(v) => {
							onChange(v as Value);
						}}
						calendarClassName={"!border-gray-300 rounded shadow-lg"}
						value={dateRange}
						className={""}
						calendarIcon={() => {
							return <CalendarIcon className="w-4 h-4" />;
						}}
					/>
				</div>
			</div>
			{data?.data?.options?.visibility === "draft" ||
			data?.data?.is_custom ? (
				<div className=" text-caption">
					<p>
						Form analytics is not available for{" "}
						{data?.data?.options?.visibility === "draft"
							? "draft"
							: "custom"}{" "}
						forms.
					</p>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 gap-4 md:col-span-3 w-full">
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="flex flex-col justify-between shadow-sm rounded-xl border bg-card text-card-foreground">
								<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
									<div className="text-sm font-medium">
										<div className="leading-none tracking-tight text-xl font-medium flex  items-center">
											<p>Form Views</p>
										</div>
									</div>
									<EyeIcon className="w-6 h-6 text-gray-400" />
								</div>
								<div className="p-6 pt-0">
									{isLoading ? (
										<div className="w-20 bg-gray-100 rounded h-6" />
									) : (
										<div className="text-2xl font-bold">
											{views}
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col justify-between shadow-sm rounded-xl border bg-card text-card-foreground ">
								<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
									<div className="text-sm font-medium">
										<div className="leading-none tracking-tight text-xl font-medium flex  items-center">
											<p>Submissions</p>
										</div>
									</div>
									<DocumentCheckIcon className="w-6 h-6 text-gray-400" />
								</div>
								<div className="p-6 pt-0">
									{isLoading ? (
										<div className="w-20 bg-gray-100 rounded h-6" />
									) : (
										<div className="text-2xl font-bold">
											{analyticsData?.data
												?.submission_count ?? 0}
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col justify-between shadow-sm rounded-xl border bg-card text-card-foreground ">
								<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
									<div className="text-sm font-medium">
										<div className="leading-none tracking-tight text-xl font-medium flex  items-center">
											<p>Conversion Rate</p>
										</div>
									</div>
									<PresentationChartLineIcon className="w-6 h-6 text-gray-400" />
								</div>
								<div className="p-6 pt-0">
									{isLoading ? (
										<div className="w-20 bg-gray-100 rounded h-6" />
									) : (
										<div className="text-2xl font-bold">
											{views === 0
												? 0
												: (
														((analyticsData?.data
															?.submission_count ??
															0) *
															100) /
														(views ?? 0)
												  )?.toFixed(1)}
											%
										</div>
									)}
								</div>
							</div>
							<div className="flex flex-col justify-between shadow-sm rounded-xl border bg-card text-card-foreground ">
								<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
									<div className="text-sm font-medium">
										<div className="leading-none tracking-tight text-xl font-medium flex  items-center">
											<p>Bounce Rate</p>
										</div>
									</div>
									<ArrowUturnRightIcon className="w-6 h-6 text-gray-400" />
								</div>
								<div className="p-6 pt-0">
									{isLoading ? (
										<div className="w-20 bg-gray-100 rounded h-6" />
									) : (
										<div className="text-red-500 text-2xl font-bold">
											{views === 0
												? 0
												: (
														(((views ?? 0) -
															(analyticsData?.data
																?.submission_count ??
																0)) *
															100) /
														(views ?? 0)
												  )?.toFixed(1)}
											%
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="mt-6 flex flex-col justify-between shadow-sm rounded-xl border bg-card text-card-foreground">
						<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
							<div className="text-sm font-medium">
								<div className="leading-none tracking-tight text-xl font-medium flex  items-center">
									<p>Form Views</p>
								</div>
							</div>
							<EyeIcon className="w-6 h-6 text-gray-400" />
						</div>
						<div className="w-full h-96">
							{(
								analyticsData?.data?.analytics_data?.by_date ??
								[]
							).length === 0 ? (
								<div className="w-full h-96 px-6 py-6 ">
									<div className=" w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center flex-col space-y-2">
										<PresentationChartBarIcon className="w-20 h-20 text-gray-400" />
										<span className="mt-2 block text-sm font-medium text-gray-900">
											{" "}
											No data available
										</span>
									</div>
								</div>
							) : (
								<ResponsiveContainer className="w-full h-96">
									<BarChart
										width={500}
										height={300}
										data={
											analyticsData?.data?.analytics_data
												?.by_date ?? []
										}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											opacity={0.5}
										/>
										<XAxis
											dataKey="date"
											style={{
												fontSize: 14,
											}}
											tickFormatter={(val) => {
												return format(
													parseISO(val),
													"yyyy/MM/dd"
												);
											}}
										/>
										<YAxis
											dataKey={"count"}
											style={{
												fontSize: 14,
											}}
										/>

										<Tooltip
											content={(props) => (
												<CustomTooltip {...props} />
											)}
										/>
										<Legend />
										<Bar dataKey="date" fill="#8884d8" />
										<Bar dataKey="count" fill="#82ca9d" />
									</BarChart>
								</ResponsiveContainer>
							)}
						</div>
					</div>
					<div className="mt-6 flex flex-col justify-between shadow-sm rounded-xl border ">
						<MapChart
							isCountryInAnalytics={isCountryInAnalytics}
							setHoveredCountry={setHoveredCountry}
						/>
					</div>

					<ReactTooltip
						id="my-tooltip"
						position={{
							x: hoveredCountry?.x,
							y: hoveredCountry?.y,
						}}
						// content={hoveredCountry?.properties.name}
						render={({ content, activeAnchor }) => {
							const country = CountryCodesPhoneNo.find(
								(item) =>
									item.name ===
									hoveredCountry?.properties.name
							);
							return (
								<div>
									<p className="text-xs">Views</p>
									<div className="mt-2 flex items-center  justify-between space-x-4">
										<div>
											<span>{country?.flag} </span>
											<span>{country?.name}</span>
										</div>
										<div>
											{hoveredCountry
												? isCountryInAnalytics(
														hoveredCountry
															?.properties.name
												  )?.count ?? 0
												: 0}
										</div>
									</div>
								</div>
							);
						}}
					/>
				</>
			)}
		</div>
	);
};

export default FormAnalyticsTab;
