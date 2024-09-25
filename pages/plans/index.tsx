import PlansPage from "@components/PlansPage";
import type { NextPage } from "next";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "@components/Footer";

const PricingPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Pricing | ByteForms</title>
			</Head>
			<main>
				<Navbar />
				<Toaster />
				<PlansPage />
				<Footer />
			</main>
		</>
	);
};

export default PricingPage;
