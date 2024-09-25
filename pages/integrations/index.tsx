import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "@components/Footer";
import GetStartedFormModal from "@components/Modals/GetStartedModal";
import ImportFromTypeformModal from "@components/Modals/ImportFromTypeformModal";
import Navbar from "@components/Navbar";
import NewFormModal from "@components/Modals/NewFormModal";
import { IntegrationsList } from "@utils/constants";

const Integration = () => {
	const router = useRouter();
	function closeModal() {
		router.push("/", undefined, { shallow: true });
	}

	return (
		<>
			<Head>
				<title>ByteForms</title>
			</Head>
			<main>
				<Navbar />
				<div className="mx-auto max-w-3xl py-20 sm:py-20 lg:py-20">
					<div className="mt-4">
						<p className="font-medium text-title md:mb-1">
							Discover ByteForm Integrations
						</p>
						<div className="grid mt-4 md:grid-cols-3 gap-5">
							{IntegrationsList?.map((integration) => (
								<div
									className="flex items-center space-x-4"
									key={integration.key}
								>
									<img
										src={integration.icon}
										alt={integration.name}
										className="w-8 h-8"
									/>
									<div>
										<p className="font-medium text-sm md:text-base">
											{integration.name}
										</p>
										<p
											dangerouslySetInnerHTML={{
												__html: integration.description,
											}}
											className="text-xs text-gray-400"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="mt-12 ">
						<div className="w-full">
							<p className="text-center text-xl font-medium">
								Need more integrations?
							</p>
							<p className="text-center text-gray-500">
								Let us know
							</p>
							<iframe
								src="https://forms.bytesuite.io/embed/PQGrXq8jnpe?embedType=iframe&transparentBackground=true&hideTitle=true"
								className="w-full h-[32rem] "
							/>
						</div>
					</div>
				</div>
			</main>

			<ImportFromTypeformModal
				isOpen={router.query.action === "typeform"}
				closeModal={closeModal}
			/>
			<GetStartedFormModal
				isOpen={router.query.action === "new"}
				closeModal={closeModal}
			/>

			<NewFormModal
				closeModal={closeModal}
				isOpen={router.query.new === "true"}
			/>
			<Footer />
		</>
	);
};

export default Integration;
