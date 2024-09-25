import type { NextPage } from "next";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import DashboardNavbar from "@components/DashboardNavbar";
import PlansPage from "@components/PlansPage";

const DashboardPricingPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Pricing | ByteForms</title>
			</Head>
			<main>
				<DashboardNavbar />
				<Toaster />
				<PlansPage />
			</main>
		</>
	);
};

export default DashboardPricingPage;
