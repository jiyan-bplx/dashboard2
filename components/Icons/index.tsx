import { SVGProps } from "react";

const Icons = {
	Switch: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
			{...props}
		>
			<rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
			<circle cx="16" cy="12" r="2" />
		</svg>
	),
	Maps: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
			<circle cx="12" cy="8" r="2" />
			<path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835" />
		</svg>
	),
	Youtube: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
			<path d="m10 15 5-3-5-3z" />
		</svg>
	),
	RazorpayPaymentButton: (
		props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
	) => (
		<svg
			viewBox="0 0 1896 401"
			focusable="false"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fill="#3395FF"
				d="M122.63 105.7l-15.75 57.97 90.15-58.3-58.96 219.98 59.88.05L285.05.48"
			></path>
			<path d="M25.6 232.92L.8 325.4h122.73l50.22-188.13L25.6 232.92m426.32-81.42c-3 11.15-8.78 19.34-17.4 24.57-8.6 5.22-20.67 7.84-36.25 7.84h-49.5l17.38-64.8h49.5c15.56 0 26.25 2.6 32.05 7.9 5.8 5.3 7.2 13.4 4.22 24.6m51.25-1.4c6.3-23.4 3.7-41.4-7.82-54-11.5-12.5-31.68-18.8-60.48-18.8H324.4l-66.5 248.1h53.67l26.8-100h35.2c7.9 0 14.12 1.3 18.66 3.8 4.55 2.6 7.22 7.1 8.04 13.6l9.58 82.6h57.5l-9.32-77c-1.9-17.2-9.77-27.3-23.6-30.3 17.63-5.1 32.4-13.6 44.3-25.4a92.6 92.6 0 0 0 24.44-42.5m130.46 86.4c-4.5 16.8-11.4 29.5-20.73 38.4-9.34 8.9-20.5 13.3-33.52 13.3-13.26 0-22.25-4.3-27-13-4.76-8.7-4.92-21.3-.5-37.8 4.42-16.5 11.47-29.4 21.17-38.7 9.7-9.3 21.04-13.95 34.06-13.95 13 0 21.9 4.5 26.4 13.43 4.6 8.97 4.7 21.8.2 38.5zm23.52-87.8l-6.72 25.1c-2.9-9-8.53-16.2-16.85-21.6-8.34-5.3-18.66-8-30.97-8-15.1 0-29.6 3.9-43.5 11.7-13.9 7.8-26.1 18.8-36.5 33-10.4 14.2-18 30.3-22.9 48.4-4.8 18.2-5.8 34.1-2.9 47.9 3 13.9 9.3 24.5 19 31.9 9.8 7.5 22.3 11.2 37.6 11.2a82.4 82.4 0 0 0 35.2-7.7 82.11 82.11 0 0 0 28.4-21.2l-7 26.16h51.9L709.3 149h-52zm238.65 0H744.87l-10.55 39.4h87.82l-116.1 100.3-9.92 37h155.8l10.55-39.4h-94.1l117.88-101.8m142.4 52c-4.67 17.4-11.6 30.48-20.75 39-9.15 8.6-20.23 12.9-33.24 12.9-27.2 0-36.14-17.3-26.86-51.9 4.6-17.2 11.56-30.13 20.86-38.84 9.3-8.74 20.57-13.1 33.82-13.1 13 0 21.78 4.33 26.3 13.05 4.52 8.7 4.48 21.67-.13 38.87m30.38-80.83c-11.95-7.44-27.2-11.16-45.8-11.16-18.83 0-36.26 3.7-52.3 11.1a113.09 113.09 0 0 0-41 32.06c-11.3 13.9-19.43 30.2-24.42 48.8-4.9 18.53-5.5 34.8-1.7 48.73 3.8 13.9 11.8 24.6 23.8 32 12.1 7.46 27.5 11.17 46.4 11.17 18.6 0 35.9-3.74 51.8-11.18 15.9-7.48 29.5-18.1 40.8-32.1 11.3-13.94 19.4-30.2 24.4-48.8 5-18.6 5.6-34.84 1.8-48.8-3.8-13.9-11.7-24.6-23.6-32.05m185.1 40.8l13.3-48.1c-4.5-2.3-10.4-3.5-17.8-3.5-11.9 0-23.3 2.94-34.3 8.9-9.46 5.06-17.5 12.2-24.3 21.14l6.9-25.9-15.07.06h-37l-47.7 176.7h52.63l24.75-92.37c3.6-13.43 10.08-24 19.43-31.5 9.3-7.53 20.9-11.3 34.9-11.3 8.6 0 16.6 1.97 24.2 5.9m146.5 41.1c-4.5 16.5-11.3 29.1-20.6 37.8-9.3 8.74-20.5 13.1-33.5 13.1s-21.9-4.4-26.6-13.2c-4.8-8.85-4.9-21.6-.4-38.36 4.5-16.75 11.4-29.6 20.9-38.5 9.5-8.97 20.7-13.45 33.7-13.45 12.8 0 21.4 4.6 26 13.9 4.6 9.3 4.7 22.2.28 38.7m36.8-81.4c-9.75-7.8-22.2-11.7-37.3-11.7-13.23 0-25.84 3-37.8 9.06-11.95 6.05-21.65 14.3-29.1 24.74l.18-1.2 8.83-28.1h-51.4l-13.1 48.9-.4 1.7-54 201.44h52.7l27.2-101.4c2.7 9.02 8.2 16.1 16.6 21.22 8.4 5.1 18.77 7.63 31.1 7.63 15.3 0 29.9-3.7 43.75-11.1 13.9-7.42 25.9-18.1 36.1-31.9 10.2-13.8 17.77-29.8 22.6-47.9 4.9-18.13 5.9-34.3 3.1-48.45-2.85-14.17-9.16-25.14-18.9-32.9m174.65 80.65c-4.5 16.7-11.4 29.5-20.7 38.3-9.3 8.86-20.5 13.27-33.5 13.27-13.3 0-22.3-4.3-27-13-4.8-8.7-4.9-21.3-.5-37.8 4.4-16.5 11.42-29.4 21.12-38.7 9.7-9.3 21.05-13.94 34.07-13.94 13 0 21.8 4.5 26.4 13.4 4.6 8.93 4.63 21.76.15 38.5zm23.5-87.85l-6.73 25.1c-2.9-9.05-8.5-16.25-16.8-21.6-8.4-5.34-18.7-8-31-8-15.1 0-29.68 3.9-43.6 11.7-13.9 7.8-26.1 18.74-36.5 32.9-10.4 14.16-18 30.3-22.9 48.4-4.85 18.17-5.8 34.1-2.9 47.96 2.93 13.8 9.24 24.46 19 31.9 9.74 7.4 22.3 11.14 37.6 11.14 12.3 0 24.05-2.56 35.2-7.7a82.3 82.3 0 0 0 28.33-21.23l-7 26.18h51.9l47.38-176.7h-51.9zm269.87.06l.03-.05h-31.9c-1.02 0-1.92.05-2.85.07h-16.55l-8.5 11.8-2.1 2.8-.9 1.4-67.25 93.68-13.9-109.7h-55.08l27.9 166.7-61.6 85.3h54.9l14.9-21.13c.42-.62.8-1.14 1.3-1.8l17.4-24.7.5-.7 77.93-110.5 65.7-93 .1-.06h-.03z"></path>
		</svg>
	),
	GoogleAnalytics: (
		props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
	) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="svg4243"
			version="1.1"
			viewBox="0 0 154.87004 154.87004"
			height="16"
			width="16"
			{...props}
		>
			<g
				style={{
					strokeWidth: 0.281805,
				}}
				transform="matrix(3.5485559,0,0,3.5485559,-174.94921,-339.18037)"
				id="g6628"
			>
				<path
					id="path3806"
					d="m 76.058007,100.6907 v 32.10778 c 0,3.5954 2.478016,5.59454 5.108055,5.59454 2.432408,0 5.108056,-1.70269 5.108056,-5.59454 v -31.86454 c 0,-3.291347 -2.432407,-5.351293 -5.108056,-5.351293 -2.675648,0 -5.108055,2.272782 -5.108055,5.108053 z m 0,0"
					style={{
						fill: "#f8ab00",
						fillOpacity: 1,
						fillRule: "nonzero",
						stroke: "none",
						strokeWidth: 0.281805,
					}}
				/>
				<path
					id="path3808"
					d="m 62.679765,116.98783 v 15.81065 c 0,3.5954 2.478016,5.59454 5.108056,5.59454 2.432407,0 5.108056,-1.70269 5.108056,-5.59454 v -15.56741 c 0,-3.29135 -2.432408,-5.35129 -5.108056,-5.35129 -2.675648,0 -5.108056,2.27278 -5.108056,5.10805 z m 0,0"
					style={{
						fill: "#e37300",
						fillOpacity: 1,
						fillRule: "nonzero",
						stroke: "none",
						strokeWidth: 0.281805,
					}}
				/>
				<path
					id="path3810"
					d="m 59.517636,133.28496 c 0,2.82008 -2.287983,5.10806 -5.108056,5.10806 -2.820073,0 -5.108056,-2.28798 -5.108056,-5.10806 0,-2.82007 2.287983,-5.10805 5.108056,-5.10805 2.820073,0 5.108056,2.28798 5.108056,5.10805"
					style={{
						fill: "#e37300",
						fillOpacity: 1,
						fillRule: "nonzero",
						stroke: "none",
						strokeWidth: 0.281805,
					}}
				/>
			</g>
		</svg>
	),
	Cal: () => (
		<img
			src="https://cal.com/favicon-32x32.png"
			className="w-4 h-4"
			alt="Cal.com"
		/>
	),
	Calendly: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 40 40"
			{...props}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M27.4166 25.9298C26.1216 27.0554 24.5105 28.4566 21.5764 28.4566H19.8247C17.7043 28.4566 15.7759 27.702 14.3955 26.3307C13.0478 24.9914 12.3043 23.1595 12.3043 21.1702V18.8179C12.3043 16.8286 13.0466 14.9955 14.3955 13.6574C15.7759 12.286 17.7043 11.5314 19.8247 11.5314H21.5764C24.5105 11.5314 26.1216 12.9326 27.4166 14.0582C28.7596 15.2263 29.9199 16.2348 33.0098 16.2348C33.4898 16.2348 33.9605 16.1969 34.4183 16.1245C34.4148 16.1153 34.4113 16.1073 34.4078 16.0981C34.224 15.6513 34.0073 15.2125 33.758 14.7887L31.6914 11.2776C29.7958 8.05585 26.2914 6.07227 22.5002 6.07227H18.367C14.5758 6.07227 11.0714 8.05699 9.17577 11.2776L7.10922 14.7887C5.21359 18.0105 5.21359 21.9787 7.10922 25.1993L9.17577 28.7105C11.0714 31.9322 14.5758 33.9158 18.367 33.9158H22.5002C26.2914 33.9158 29.7958 31.9311 31.6914 28.7105L33.758 25.1993C34.0073 24.7744 34.224 24.3367 34.4078 23.89C34.4113 23.8808 34.4148 23.8727 34.4183 23.8635C33.9605 23.7912 33.491 23.7533 33.0098 23.7533C29.9199 23.7533 28.7596 24.7617 27.4166 25.9298Z"
				fill="#006BFF"
			/>
			<path
				d="M21.5767 13.6621H19.825C16.5982 13.6621 14.4766 15.9236 14.4766 18.818V21.1703C14.4766 24.0647 16.597 26.3262 19.825 26.3262H21.5767C26.2788 26.3262 25.91 21.6228 33.0101 21.6228C33.6904 21.6228 34.3624 21.6837 35.0169 21.8031C35.2324 20.6075 35.2324 19.3831 35.0169 18.1863C34.3624 18.3058 33.6904 18.3666 33.0101 18.3666C25.91 18.3655 26.2788 13.6621 21.5767 13.6621Z"
				fill="#006BFF"
			/>
			<path
				d="M39.095 23.5203C37.882 22.6428 36.491 22.0708 35.0157 21.8009C35.0134 21.8124 35.0122 21.8239 35.0099 21.8354C34.8834 22.5245 34.6867 23.2033 34.4174 23.8614C35.662 24.059 36.8095 24.5184 37.7895 25.2225C37.786 25.2328 37.7836 25.2432 37.7801 25.2547C37.2146 27.0556 36.3622 28.7532 35.2476 30.298C34.1458 31.8233 32.8145 33.166 31.2889 34.2881C28.1217 36.6186 24.3492 37.8498 20.3776 37.8498C17.9188 37.8498 15.535 37.3778 13.2916 36.4474C11.1243 35.5481 9.17718 34.2605 7.50402 32.6192C5.83086 30.9779 4.51835 29.0679 3.60156 26.9419C2.65317 24.7412 2.17194 22.4028 2.17194 19.9908C2.17194 17.5788 2.65317 15.2403 3.60156 13.0397C4.51835 10.9137 5.83086 9.0036 7.50402 7.3623C9.17718 5.721 11.1243 4.43346 13.2916 3.53414C15.535 2.6038 17.9188 2.13174 20.3776 2.13174C24.3492 2.13174 28.1217 3.36301 31.2889 5.69345C32.8145 6.81559 34.1458 8.15827 35.2476 9.68356C36.3622 11.2284 37.2146 12.926 37.7801 14.7269C37.7836 14.7384 37.7871 14.7487 37.7895 14.7591C36.8095 15.4631 35.662 15.9237 34.4174 16.1201C34.6867 16.7794 34.8846 17.4593 35.0099 18.1485C35.0122 18.16 35.0134 18.1703 35.0157 18.1818C36.491 17.9119 37.8808 17.3399 39.095 16.4624C40.2576 15.6182 40.0328 14.6649 39.856 14.0998C37.293 5.93464 29.542 0 20.3776 0C9.12334 0 0 8.94962 0 19.9896C0 31.0296 9.12334 39.9793 20.3776 39.9793C29.542 39.9793 37.293 34.0446 39.856 25.8795C40.0328 25.3178 40.2588 24.3645 39.095 23.5203Z"
				fill="#006BFF"
			/>
			<path
				d="M34.4187 16.1224C33.9609 16.1948 33.4914 16.2327 33.0102 16.2327C29.9203 16.2327 28.76 15.2242 27.417 14.0561C26.122 12.9305 24.5109 11.5293 21.5767 11.5293H19.8251C17.7047 11.5293 15.7763 12.2839 14.3959 13.6553C13.0482 14.9945 12.3047 16.8265 12.3047 18.8158V21.1681C12.3047 23.1574 13.047 24.9905 14.3959 26.3286C15.7763 27.6999 17.7047 28.4546 19.8251 28.4546H21.5767C24.5109 28.4546 26.122 27.0533 27.417 25.9277C28.76 24.7596 29.9203 23.7512 33.0102 23.7512C33.4902 23.7512 33.9609 23.7891 34.4187 23.8614C34.688 23.2033 34.8847 22.5234 35.0112 21.8354C35.0135 21.8239 35.0147 21.8124 35.017 21.8009C34.3625 21.6815 33.6904 21.6206 33.0102 21.6206C25.9101 21.6206 26.2789 26.324 21.5767 26.324H19.8251C16.5983 26.324 14.4766 24.0624 14.4766 21.1681V18.8158C14.4766 15.9214 16.5971 13.6599 19.8251 13.6599H21.5767C26.2789 13.6599 25.9101 18.3633 33.0102 18.3633C33.6904 18.3633 34.3625 18.3024 35.017 18.1829C35.0147 18.1715 35.0135 18.1611 35.0112 18.1496C34.8859 17.4616 34.688 16.7817 34.4187 16.1224Z"
				fill="#0AE8F0"
			/>
			<path
				d="M34.4187 16.1224C33.9609 16.1948 33.4914 16.2327 33.0102 16.2327C29.9203 16.2327 28.76 15.2242 27.417 14.0561C26.122 12.9305 24.5109 11.5293 21.5767 11.5293H19.8251C17.7047 11.5293 15.7763 12.2839 14.3959 13.6553C13.0482 14.9945 12.3047 16.8265 12.3047 18.8158V21.1681C12.3047 23.1574 13.047 24.9905 14.3959 26.3286C15.7763 27.6999 17.7047 28.4546 19.8251 28.4546H21.5767C24.5109 28.4546 26.122 27.0533 27.417 25.9277C28.76 24.7596 29.9203 23.7512 33.0102 23.7512C33.4902 23.7512 33.9609 23.7891 34.4187 23.8614C34.688 23.2033 34.8847 22.5234 35.0112 21.8354C35.0135 21.8239 35.0147 21.8124 35.017 21.8009C34.3625 21.6815 33.6904 21.6206 33.0102 21.6206C25.9101 21.6206 26.2789 26.324 21.5767 26.324H19.8251C16.5983 26.324 14.4766 24.0624 14.4766 21.1681V18.8158C14.4766 15.9214 16.5971 13.6599 19.8251 13.6599H21.5767C26.2789 13.6599 25.9101 18.3633 33.0102 18.3633C33.6904 18.3633 34.3625 18.3024 35.017 18.1829C35.0147 18.1715 35.0135 18.1611 35.0112 18.1496C34.8859 17.4616 34.688 16.7817 34.4187 16.1224Z"
				fill="#0AE8F0"
			/>
		</svg>
	),
	ReCaptcha: () => (
		<img className="w-4 h-4" src="/recaptcha.png" alt="ReCaptcha" />
	),
	CloudflareTurnstile: () => (
		<img className="w-4 h-4" src="/cloudflare_logo.png" alt="Cloudflare" />
	),
	TextInput: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="20" height="12" x="2" y="6" rx="2" />
			<path d="M12 12h.01" />
			<path d="M17 12h.01" />
			<path d="M7 12h.01" />
		</svg>
	),
	Range: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4"
			{...props}
		>
			<line x1="21" x2="14" y1="4" y2="4" />
			<line x1="10" x2="3" y1="4" y2="4" />
			<line x1="21" x2="12" y1="12" y2="12" />
			<line x1="8" x2="3" y1="12" y2="12" />
			<line x1="21" x2="16" y1="20" y2="20" />
			<line x1="12" x2="3" y1="20" y2="20" />
			<line x1="14" x2="14" y1="2" y2="6" />
			<line x1="8" x2="8" y1="10" y2="14" />
			<line x1="16" x2="16" y1="18" y2="22" />
		</svg>
	),
	DateTime: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
			<path d="M16 2v4" />
			<path d="M8 2v4" />
			<path d="M3 10h5" />
			<path d="M17.5 17.5 16 16.25V14" />
			<path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
		</svg>
	),
	TextBlock: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-text"
		>
			<path d="M17 6.1H3" />
			<path d="M21 12.1H3" />
			<path d="M15.1 18H3" />
		</svg>
	),
	Signature: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="m12 19 7-7 3 3-7 7-3-3z" />
			<path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
			<path d="m2 2 7.586 7.586" />
			<circle cx="11" cy="11" r="2" />
		</svg>
	),
};

export default Icons;
