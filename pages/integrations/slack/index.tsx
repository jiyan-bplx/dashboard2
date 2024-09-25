import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Footer from "@components/Footer";
import GetStartedFormModal from "@components/Modals/GetStartedModal";
import ImportFromTypeformModal from "@components/Modals/ImportFromTypeformModal";
import Navbar from "@components/Navbar";
import NewFormModal from "@components/Modals/NewFormModal";
import { listIntegrationsForFormId } from "@api/integrations/list";

const SlackGuide = ({ formId }: { formId: number }) => {
	const { data, refetch } = useQuery(["integrations", formId], () =>
		listIntegrationsForFormId(formId)
	);

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
				<div className="relative overflow-hidden bg-white py-16">
					<div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:[overflow-anchor:none]">
						<div
							className="relative mx-auto h-full max-w-prose text-lg"
							aria-hidden="true"
						>
							<svg
								className="absolute top-12 left-full translate-x-32 transform"
								width={404}
								height={384}
								fill="none"
								viewBox="0 0 404 384"
							>
								<defs>
									<pattern
										id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
										x={0}
										y={0}
										width={20}
										height={20}
										patternUnits="userSpaceOnUse"
									>
										<rect
											x={0}
											y={0}
											width={4}
											height={4}
											className="text-gray-200"
											fill="currentColor"
										/>
									</pattern>
								</defs>
								<rect
									width={404}
									height={384}
									fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
								/>
							</svg>
							<svg
								className="absolute top-1/2 right-full -translate-y-1/2 -translate-x-32 transform"
								width={404}
								height={384}
								fill="none"
								viewBox="0 0 404 384"
							>
								<defs>
									<pattern
										id="f210dbf6-a58d-4871-961e-36d5016a0f49"
										x={0}
										y={0}
										width={20}
										height={20}
										patternUnits="userSpaceOnUse"
									>
										<rect
											x={0}
											y={0}
											width={4}
											height={4}
											className="text-gray-200"
											fill="currentColor"
										/>
									</pattern>
								</defs>
								<rect
									width={404}
									height={384}
									fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
								/>
							</svg>
							<svg
								className="absolute bottom-12 left-full translate-x-32 transform"
								width={404}
								height={384}
								fill="none"
								viewBox="0 0 404 384"
							>
								<defs>
									<pattern
										id="d3eb07ae-5182-43e6-857d-35c643af9034"
										x={0}
										y={0}
										width={20}
										height={20}
										patternUnits="userSpaceOnUse"
									>
										<rect
											x={0}
											y={0}
											width={4}
											height={4}
											className="text-gray-200"
											fill="currentColor"
										/>
									</pattern>
								</defs>
								<rect
									width={404}
									height={384}
									fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
								/>
							</svg>
						</div>
					</div>
					<div className="relative px-6 lg:px-8">
						<div className="mx-auto max-w-prose text-lg">
							<h1>
								<span className="block text-center text-lg font-semibold text-indigo-600">
									Integration Guide
								</span>
								<span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
									Installing Integration for Slack
								</span>
							</h1>
							<p className="mt-8 mb-4 text-xl leading-8 text-gray-500">
								Go to integrations tab under your form you want
								to connect to Slack and click on the connect
								button for Integration for Slack in the list of
								integrations.
							</p>
							<figure className="my-3">
								<img
									className="w-full rounded-lg shadow"
									src="/slack1.png"
									alt=""
									width={1310}
									height={873}
								/>
							</figure>
							<p className="mt-8 mb-4 text-xl leading-8 text-gray-500">
								Sign in to the Slack workspace you want to
								connect to ByteForms
							</p>
							<figure className="my-3">
								<img
									className="w-full rounded-lg shadow"
									src="/slack2.png"
									alt=""
									width={1310}
									height={873}
								/>
							</figure>
							<p className="mt-8 mb-4 text-xl leading-8 text-gray-500">
								Select the channel in the workspace you want
								ByteForms to connect to.
							</p>
							<figure className="my-3">
								<img
									className="w-full rounded-lg shadow"
									src="/slack3.png"
									alt=""
									width={1310}
									height={873}
								/>
							</figure>
							<p className="mt-8 mb-4 text-xl leading-8 text-gray-500">
								You can now see Integration for Slack under the
								integrations tab under your form. You can
								disable or uninstall this integration from here.
							</p>
							<figure className="my-3">
								<img
									className="w-full rounded-lg shadow"
									src="/slack4.png"
									alt=""
									width={1310}
									height={873}
								/>
							</figure>
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

export default SlackGuide;
