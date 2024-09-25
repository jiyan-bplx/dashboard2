import { memo } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
	ZoomableGroup,
} from "react-simple-maps";
import colors from "tailwindcss/colors";
import { MapGeoItem } from "../../types";

const MapChart = ({
	setHoveredCountry,
	isCountryInAnalytics,
}: {
	setHoveredCountry: (geo: (MapGeoItem & { x: any; y: any }) | null) => void;
	isCountryInAnalytics: (name: string) => any;
}) => {
	return (
		<ComposableMap
			projection={"geoMercator"}
			className="w-full h-full"
			projectionConfig={{
				center: [0, 44],
				scale: 128,
			}}
		>
			<Geographies geography={"/countries.map.json"}>
				{({ geographies }) =>
					geographies.map((geo) => {
						const found = isCountryInAnalytics(geo.properties.name);

						return (
							<Geography
								className="active:border-none outline-none"
								onMouseEnter={(e) => {
									setHoveredCountry({
										...geo,
										x: e.clientX,
										y: e?.clientY,
									});
								}}
								onMouseMove={(e) => {
									setHoveredCountry({
										...geo,
										x: e.clientX,
										y: e.clientY,
									});
								}}
								onMouseLeave={() => setHoveredCountry(null)}
								key={geo.rsmKey}
								data-tooltip-id="my-tooltip"
								data-tooltip-place="top"
								geography={geo}
								fill={found ? colors.indigo[500] : "#DDDDDD"}
								style={{
									hover: {
										fill: colors.blue[500],
									},
								}}
								stroke="#fff"
							/>
						);
					})
				}
			</Geographies>
		</ComposableMap>
	);
};

export default memo(MapChart);
