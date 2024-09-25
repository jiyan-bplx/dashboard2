import {
	ArrowPathIcon,
	ChatBubbleBottomCenterIcon,
	CloudArrowUpIcon,
	Cog6ToothIcon,
	FingerPrintIcon,
	LockClosedIcon,
} from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "@components/Footer";
import GetStartedFormModal from "@components/Modals/GetStartedModal";
import ImportFromTypeformModal from "@components/Modals/ImportFromTypeformModal";
import Navbar from "@components/Navbar";
import NewFormModal from "@components/Modals/NewFormModal";
import { SparklesIcon } from "@heroicons/react/24/outline";
import TypewriterInput from "@components/TypewriterInput";
import { RevealList, RevealWrapper } from "next-reveal";
const sentences = [
	"registration form for an event.",
	"feedback form for a product or service.",
	"job application form for a company.",
	"customer satisfaction survey form.",
	"volunteer sign-up form for a non-profit organization.",
	"contact form for a business website.",
	"subscription form for a newsletter.",
	"travel expense reimbursement form.",
	"medical history form for a healthcare provider.",
	"project proposal submission form.",
	"reservation form for a restaurant.",
	"scholarship application form for an educational institution.",
	"workshop registration form.",
	"donation form for a charity.",
	"request for quote (RFQ) form for a business.",
	"user feedback form for a software application.",
	"release of liability waiver form.",
	"membership application form for a club or association.",
	"survey form for market research.",
	"order form for an online store.",
];
function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
const shuffledForms = shuffleArray([...sentences]);
const selectedForms = shuffledForms.slice(0, 5);
const features = [
	{
		name: "Effortlessly Create Custom Forms",
		description:
			"From surveys and contact forms to registration and feedback, design the perfect form that aligns with your goals. Start building your forms today!		",
		icon: CloudArrowUpIcon,
	},
	{
		name: "Data Validation and Spam Protection",
		description:
			"After your form is submitted through JavaScript forms or HTML forms, ByteForms validates your data server-side. We employ captcha to shield you from spam, ensuring that only genuine submissions reach your inbox.",
		icon: LockClosedIcon,
	},
	{
		name: "Effortlessly View and Manage Responses",
		description:
			"All form submissions are efficiently stored in the ByteForms Inbox. Here, you can easily view submissions, access daily analytics reports, and export your data to CSV or JSON formats for further analysis.		",
		icon: ArrowPathIcon,
	},
	{
		name: "Seamless Integration with an Array of Services.",
		description:
			"Through direct integrations, we seamlessly route your data to its destination without the need for third-party services, ensuring your data gets where it needs to be.",
		icon: FingerPrintIcon,
	},
	{
		name: "Integration for Slack",
		description: `Send all the data from from submissions as messages to the Slack channels of your choice. <a href="https://forms.bytesuite.io/integrations/slack" class="text-blue-500 hover:underline">Click here</a> to learn more.`,
		icon: ChatBubbleBottomCenterIcon,
	},
	{
		name: "Seamless Online Payment Collection.",
		description:
			"Effortlessly collect payments online through your forms, simplifying transactions and boosting efficiency. (Coming Soon)",
		icon: Cog6ToothIcon,
	},
];

const Home: NextPage = () => {
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
				<div className="relative px-6 lg:px-8">
					<div className="mx-auto  py-20 sm:py-20 lg:py-32">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div className="md:mr-20 mr-0">
								<RevealWrapper
									scale={0.3}
									delay={800}
									duration={400}
									distance="0px"
									origin="center"
								>
									<div className="hidden sm:mb-8 sm:flex justify-center sm:justify-start">
										<div className="flex flex-row relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
											<SparklesIcon className="w-4 h-4 mx-2 my-1" />
											Introducing our new AI tool{" "}
											<Link
												href="/ai?prompt=true"
												className="font-semibold text-indigo-600 "
											>
												{" "}
												<div className="mx-2">
													<span
														className="absolute inset-0"
														aria-hidden="true"
													/>
													Generate A Form{" "}
													<span aria-hidden="true">
														&rarr;
													</span>
												</div>
											</Link>
										</div>
									</div>
								</RevealWrapper>
								<RevealWrapper>
									<div className="text-center md:text-left">
										<h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
											Build{" "}
											<span className="text-pink-500">
												{" "}
												unlimited{" "}
											</span>{" "}
											number of forms in minutes, for{" "}
											<span className="text-violet-500">
												{" "}
												Free{" "}
											</span>
											{/* <span className="font-bold">
											Byte
											<span className="text-indigo-700">
												Forms
											</span>
										</span> */}
										</h1>
										<p className="mt-6 text-lg leading-8 text-gray-600">
											All-in-one solution for form
											creation, submission management, and
											data integration. Experience the
											difference today!
										</p>
										<div className="mt-10 flex items-center justify-center md:justify-start gap-x-6">
											<RevealWrapper
												scale={0.3}
												delay={800}
												duration={400}
												distance="0px"
												origin="center"
											>
												<Link
													href="/?action=new"
													className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 space-x-2"
												>
													<span>New Form</span>
													<span
														className="text-indigo-200"
														aria-hidden="true"
													>
														&rarr;
													</span>
												</Link>
											</RevealWrapper>
											{/* <RevealWrapper
												scale={0.3}
												delay={800}
												duration={400}
												distance="0px"
												origin="center"
											>
												<Link
													href="/plans"
													className="text-base font-semibold leading-7 text-gray-900"
												>
													Pricing
												</Link>
											</RevealWrapper> */}
										</div>
									</div>
								</RevealWrapper>
							</div>
							<div className="z-0 relative hidden lg:block w-full">
								<div className="bg-white ai-landing z-10 ring-1 ring-gray-900/10 shadow-lg rounded-xl p-6 px-10">
									<div className="flex flex-col ">
										<div className="w-full relative z-0 mr-3 ">
											<div className="bg-white  rounded-md  w-full border-0 md:px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm  mb-4 py-3 px-3 inset-0 flex justify-start items-center z-10">
												<TypewriterInput
													sentences={selectedForms}
												/>
											</div>
										</div>
										<div className="flex flex-shrink-0 w-100 md:mt-0 mt-4">
											<div className="flex flex-shrink-0">
												<button
													id="states-button"
													data-dropdown-toggle="dropdown-states"
													className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 "
													type="button"
												>
													Pages
												</button>

												<label
													htmlFor="number_of_pages"
													className="sr-only"
												>
													Any
												</label>
												<select
													disabled
													id="number_of_pages"
													className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 border-s-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
												>
													<option value="0">
														Any
													</option>
													<option value="1">1</option>
													<option value="2">2</option>
													<option value="3">3</option>
													<option value="4">4</option>
												</select>
											</div>
											<Link
												href={"/ai"}
												className="relative w-full text-center ml-3 justify-center inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											>
												Generate
											</Link>
										</div>
									</div>
								</div>

								<div className="tilted-box">
									<div className="tilted-box-inner  animate-pulse  bg-white shadow-lg rounded-xl p-6  h-full aspect-w-9 aspect-h-16">
										<div className="space-y-5 rounded-2xl bg-white/5 p-4">
											<div className="h-12 mb-4 rounded-lg bg-slate-300"></div>
											<div className="space-y-3">
												<div className="h-3 w-3/5 animation-pulse rounded-lg bg-slate-300"></div>
												<div className="h-3 w-4/5 rounded-lg bg-slate-200"></div>
												<div className="h-3 w-2/5 rounded-lg bg-slate-200"></div>
											</div>
											<div className="space-y-3">
												<div className="h-3 w-3/5 rounded-lg bg-slate-300 "></div>
												<div className="h-3 w-4/5 rounded-lg bg-slate-200"></div>
												<div className="h-3 w-2/5 rounded-lg bg-slate-200"></div>
											</div>
											<div className="space-y-3">
												<div className="h-3 w-3/5 rounded-lg bg-slate-300"></div>
												<div className="h-3 w-4/5 rounded-lg bg-slate-200"></div>
												<div className="h-3 w-2/5 rounded-lg bg-slate-200"></div>
											</div>
											<div className="mt-8">
												<div className="h-10 mx-auto w-2/5 rounded-lg bg-indigo-300"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
						<svg
							className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
							viewBox="0 0 1155 678"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
								fillOpacity=".3"
								d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							/>
							<defs>
								<linearGradient
									id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
									x1="1155.49"
									x2="-78.208"
									y1=".177"
									y2="474.645"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#9089FC" />
									<stop offset={1} stopColor="#FF80B5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>
				<div className="relative px-6 lg:px-8 mt-2">
					<div className=" pb-24 sm:pb-32">
						<RevealWrapper distance="Z">
							<div className="relative overflow-hidden pt-16">
								<div className="mx-auto max-w-7xl px-6 lg:px-8">
									<img
										src="/formbuilder.png"
										alt="App screenshot"
										className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
										width={2432}
										height={1442}
									/>
									<div
										className="relative"
										aria-hidden="true"
									>
										<div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
									</div>
								</div>
							</div>
						</RevealWrapper>
						<div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
							<dl>
								<RevealList
									interval={200}
									delay={500}
									className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
								>
									{features.map((feature) => (
										<div
											key={feature.name}
											className="relative pl-9"
										>
											<dt className="inline font-semibold text-gray-900">
												<feature.icon
													className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
													aria-hidden="true"
												/>
												{feature.name}
											</dt>{" "}
											<dd
												dangerouslySetInnerHTML={{
													__html: feature.description,
												}}
												className="inline"
											>
												{/* {feature.description} */}
											</dd>
										</div>
									))}
								</RevealList>
							</dl>
						</div>
					</div>
				</div>

				<div className="relative px-6 lg:px-8 mt-2">
					<div className="grid md:grid-cols-3 grid-cols-1 ">
						{/* <div className="col-span-3 md:col-span-3 mb-4">
							<div className="flex flex-col md:flex-row ai-form-sect mt-5">
								<div className="p-4 flex flex-col md:p-6 lg:p-8">
									<div className="">
										<h1 className="text-2xl font-semibold ">
											🚀 Revolutionize Your Forms with AI!
										</h1>
									</div>

									<p className="pt-4 max-w-2xl">
										Generate forms using simple prompts that
										describe your needs. Save time and
										effort with custon AI-generated forms
										that make form creation a matter of few
										clicks.
									</p>
									<div>
										<Link
											href="/ai"
											className="button-primary mt-10"
										>
											<SparklesIcon className="w-4 h-4 mx-2 md:w-6 md:h-6" />{" "}
											Generate Forms using AI
										</Link>
									</div>
								</div>
								<div className="demo-screen pt-6">
									<div className="relative overflow-hidden pt-4">
										<div className="mx-auto max-w-7xl px-6 lg:px-8">
											<img
												src="/aiform.png"
												alt="App screenshot"
												className="mb-[-12%] rounded-3xl shadow-2xl ring-1 ring-gray-900/10"
												width={2432}
												height={1442}
											/>
										</div>
									</div>
								</div>
							</div>
						</div> */}
						<div className="col-span-3 md:col-span-3">
							<div className="flex flex-col integrations-sect">
								<div className="p-4 md:p-6 lg:p-8">
									<div className="text-center">
										<h1 className="text-2xl text-center font-semibold">
											Integrations
										</h1>
									</div>

									<p className="pt-4 text-center mx-auto max-w-2xl">
										Connect your forms seamlessly with
										dozens of popular 3rd-party services.
										Byteforms integrations ensure your data
										is delivered to the right destinations.
										<br />
										<br />
										<Link
											href="/integrations"
											className="text-base mt-1 leading-7 text-gray-900"
										>
											See All integrations &rarr;
										</Link>
									</p>
								</div>
								<div className="integration-logos"></div>
							</div>
						</div>
						<div className="col-span-3 md:col-span-1 md:mr-1">
							<div className="flex flex-col payment-form-sect mt-5">
								<div className="p-4 md:p-6 lg:p-8">
									<div className="">
										<h1 className="text-base mt-1 leading-7 text-gray-100 opacity-75">
											Coming Soon
										</h1>
										<h1 className="text-2xl font-semibold text-white">
											Seamless Payments with Secure
											Payment Forms
										</h1>
									</div>

									<p className="pt-4 max-w-2xl text-white opacity-75">
										Unlock the simplicity of online
										transactions with our intuitive payment
										forms. Whether you're running an
										e-commerce store, collecting donations,
										or managing event registrations, our
										customizable forms ensure a seamless and
										secure payment process for you and your
										customers.
										<br />
										<br />
									</p>
								</div>
							</div>
						</div>
						<div className="col-span-3 md:col-span-1 md:mx-2">
							<div className="flex flex-col calender-form-sect mt-5">
								<div className="p-4 md:p-6 lg:p-8">
									<div className="">
										<h1 className="text-2xl font-semibold ">
											Calendar Appointment Organization
										</h1>
									</div>

									<p className="pt-4 max-w-2xl">
										Easily manage your calendar appointments
										and bookings directly through your
										forms, streamlining your scheduling
										process.
									</p>
								</div>
								<div className="demo-screen">
									<div className="relative overflow-hidden pt-0">
										<div className="mx-auto max-w-7xl px-6 lg:px-8">
											<img
												src="/calender-form.png"
												alt="App screenshot"
												className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
												width={2432}
												height={1442}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-span-3 md:col-span-1 md:mx-2">
							<div className="flex flex-col password-form-sect mt-5">
								<div className="p-4 md:p-6 lg:p-8">
									<div className="">
										<h1 className="text-2xl font-semibold ">
											Password-Protected Forms
										</h1>
									</div>

									<p className="pt-4 max-w-2xl">
										Secure your ByteForms with password
										protection, ensuring only authorized
										users can access and submit data.
									</p>
								</div>
								<div className="demo-screen">
									<div className="relative overflow-hidden pt-4">
										<div className="mx-auto max-w-7xl px-6 lg:px-8">
											<img
												src="/password.png"
												alt="App screenshot"
												className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
												width={2432}
												height={1442}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white">
					<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
						<h2 className="text-4xl font-bold tracking-tight text-gray-900">
							Ready to dive in?
							<br />
							Start your free trial today.
						</h2>
						<div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
							<Link
								href="/?action=new"
								className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Get started
							</Link>
							<Link
								href="/plans"
								className="text-base font-semibold leading-7 text-gray-900"
							>
								Pricing <span aria-hidden="true">→</span>
							</Link>
						</div>
					</div>
				</div>
			</main>

			<ImportFromTypeformModal
				isOpen={router.query.action === "typeform"}
				closeModal={() =>
					router.push({
						query: {
							...router.query,
							action: "new",
						},
					})
				}
			/>
			<GetStartedFormModal
				isOpen={router.query.action === "new"}
				closeModal={() =>
					router.push({
						query: {
							...router.query,
							action: undefined,
						},
					})
				}
			/>

			<NewFormModal
				closeModal={() =>
					router.push({
						query: {
							...router.query,
							action: "new",
							new: undefined,
						},
					})
				}
				isOpen={router.query.new === "true"}
			/>
			<Footer />
		</>
	);
};

export default Home;
