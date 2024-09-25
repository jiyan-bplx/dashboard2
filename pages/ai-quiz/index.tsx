import { Disclosure } from "@headlessui/react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import GeneratedFormRenderer from "@components/GeneratedFormRenderer";
import Loading from "@components/Loading";
import { generateAiForm } from "@api/ai";
import { GenerateAiFormResponse } from "@api/ai/response";
import { BaseResponse } from "@api/types/responses";
import Head from "next/head";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import TypewriterInput from "@components/TypewriterInput";
import useUser from "@hooks/useUser";
import { logoutUser } from "@api/auth";
import { useRef } from "react";
const FormTemplatesPage = () => {
	const [typewriterContent, setTypewriterContent] = useState("");
	const router = useRouter();
	const { data } = useUser({
		redirect: ["/builder", "/dashboard"].some((route) =>
			router.pathname.includes(route)
		),
	});

	// useEffect(() => {
	// 	const intervalId = setInterval(() => {
	// 		const typewriterDiv = document.querySelector(".Typewriter__wrapper");
	// 		if (typewriterDiv) {
	// 			const content = typewriterDiv.textContent || "";
	// 			setTypewriterContent(content);
	// 		}
	// 	}, 5000);

	// 	return () => clearInterval(intervalId); // Cleanup the interval on component unmount
	// }, []);

	const onLogout = async () => {
		try {
			const res = await logoutUser();
			if (res.status === "success") {
				toast.success("Logged out");
				router.replace("/login");
			} else {
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
			console.error("[onLogout]", error);
		}
	};
	const [isDisabledPrompt, setIsDisabledPrompt] = useState(true);
	const [prompt, setPrompt] = useState("");
	const [pages, setPages] = useState("5");
	const [checked, setChecked] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isError, setIsError] = useState(false);
	const [response, setResponse] = useState<GenerateAiFormResponse | null>(
		null
	);
	const isNotEmptyOrSpaces = (str: string): boolean => {
		return str.trim() !== "";
	};
	const sentences = [
		"quiz for Fourier Transform",
		"quiz for American Civil War",
		"quiz for World War II",
		"quiz for Renaissance Art",
		"quiz for Quantum Mechanics",
		"quiz for French Revolution",
		"quiz for Space Exploration History",
		"quiz for Ancient Egypt",
		"quiz for Environmental Science",
		"quiz for European Capitals",
		"quiz for Literary Classics",
		"quiz for Greek Mythology",
		"quiz for Computer Programming Languages",
		"quiz for Astronomy Discoveries",
		"quiz for Asian Cuisine",
		"quiz for Famous Paintings",
		"quiz for Human Anatomy",
		"quiz for Film History",
		"quiz for Music Theory",
		"quiz for Global Economics",
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

	const editInBuilder = async () => {
		if (response) {
			const id = nanoid();
			localStorage.setItem(`ai-form-${id}`, JSON.stringify(response));
			router.push("/quiz-builder?ai=" + id);
		}
	};
	const divRef = useRef(null);
	const onSubmit = async () => {
		// Check if the div reference exists
		if (divRef.current) {
			// Simulate a click by calling click() on the DOM element
			(divRef.current as HTMLDivElement).click();
			return;
		}

		console.log(prompt);
		if (isNotEmptyOrSpaces(prompt) && prompt.trim() !== "Generate a") {
			setIsCreating(true);
			setIsError(false);
			setResponse(null);
			try {
				const noOfPages =
					pages && pages.length > 0 ? parseInt(pages) : 0;
				const res = await generateAiForm({
					prompt: prompt,
					number_of_pages: isNaN(noOfPages) ? 1 : noOfPages,
					type: "quiz",
				});

				if (res.status === "success") {
					toast.success("Form generated successfully");
					setResponse(res);
				} else {
					setIsError(true);
					toast.error(res.message ?? "An error occured");
					console.error("[onCreateCustomForm] Response", res);
				}
				setIsCreating(false);
			} catch (err) {
				console.error("[onCreateCustomForm]", err);
				const e = err as AxiosError<BaseResponse<null>>;
				if (e?.response?.data?.message) {
					toast.error(e.response.data.message);
				} else {
					toast.error("Something went wrong");
				}
				setIsError(true);
				setIsCreating(false);
			}
		} else {
			toast.error("Enter a valid prompt");
		}
	};
	const disablePromptSuggestion = () => {
		const typewriterDiv = document.querySelector(".Typewriter__wrapper");
		if (typewriterDiv) {
			const content = typewriterDiv.textContent || "";

			setIsDisabledPrompt(false);
			const inputElement = document.getElementById("prompt");
			if (inputElement) {
				inputElement.focus();
			}
			updateInputValue("Generate a " + content);
		}
	};
	const updateInputValue = (constValue: string) => {
		setPrompt(constValue);
	};
	return (
		<div className="bg-gray-50  h-screen overflow-scroll">
			<Head>
				<title>AI Quizes | ByteForms</title>
			</Head>
			<Toaster />
			<Disclosure as="nav" className="bg-white shadow sticky top-0 z-50">
				{({ open }) => (
					<>
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
							<div className="flex h-16 justify-between">
								<div className="flex justify-between">
									<div className="flex flex-shrink-0 items-center">
										<Link href="/">
											<img
												className="block h-8 w-auto"
												src="/byteformslogo.png"
												alt="ByteForms"
											/>
										</Link>

										{/* <img
										className="block h-8 w-auto"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt="Your Company"
									/> */}
									</div>
								</div>
								<div className="flex items-center">
									<div className=" invisible md:visible md:flex items-center">
										{response?.data?.body ? (
											<div className="flex-shrink-0 pl-2">
												<button
													onClick={editInBuilder}
													className="text-white text-xs bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center mx-2"
												>
													Edit in Builder
												</button>
											</div>
										) : null}
									</div>
									<div className="relative z-50 group">
										<button
											id="dropdownHoverButton"
											data-dropdown-toggle="dropdownHover"
											data-dropdown-trigger="hover"
											className="text-white text-xs bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
											type="button"
										>
											Generate Quiz{" "}
											<svg
												className="w-2.5 h-2.5 ms-3"
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 10 6"
											>
												<path
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="m1 1 4 4 4-4"
												/>
											</svg>
										</button>

										<div
											id="dropdownHover"
											className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right absolute right-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none  z-50"
										>
											<ul
												className="text-xs py-2 text-gray-700 flex w-full"
												aria-labelledby="dropdownHoverButton"
											>
												<li className="flex w-full">
													<Link
														href="/ai"
														className="flex w-full px-4 py-2 hover:bg-indigo-100"
													>
														Generate Forms
													</Link>
												</li>
											</ul>
										</div>
									</div>

									<div className="flex items-center">
										{data?.data && (
											<div className="relative z-50 group">
												<button
													type="button"
													className="inline-flex items-center justify-center p-2 text-white focus:outline-none flex-shrink-0"
												>
													<img
														className="ml-2 w-8 h-8 rounded-full border flex-shrink-0"
														src={
															data?.data?.photo
																? data?.data
																		?.photo
																: `https://source.boringavatars.com/beam/120/${data?.data?.name}?colors=0A0310,49007E,FF005B,FF7D10,FFB238`
														}
														alt={data.data?.name}
													/>
												</button>

												<div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right absolute right-0 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none  z-50">
													<div className="py-1">
														<Link
															href="/dashboard"
															className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														>
															Dashboard
														</Link>
														<Link
															href="/profile"
															className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														>
															Account
														</Link>
														<button
															type="button"
															onClick={onLogout}
															className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														>
															Logout
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</Disclosure>
			<div
				className="container relative mx-auto"
				style={{
					height: "calc(100% - 128px)",
				}}
			>
				{isCreating ? (
					<div className="flex h-full  pb-40 px-10 flex-col items-center justify-center">
						<img
							className="block h-40 w-auto mx-auto loader"
							src="/byteplexure-circle.png"
							alt="ByteForms"
						/>

						<p
							className="font-semibold mt-8 text-center"
							style={{ color: "#cdd6e3" }}
						>
							Generating your form using AI
						</p>

						<div
							className="flex flex-col items-center justify-center font-semibold text-center"
							style={{ color: "#cdd6e3" }}
						>
							<div className="dot-loader flex flex-row">
								<div className="dot  animate-bounce">.</div>
								<div className="dot  animate-bounce transition animate-delay-75 mx-1">
									{" "}
									.{" "}
								</div>
								<div className="dot  animate-bounce transition animate-delay-150">
									.
								</div>
							</div>
						</div>
					</div>
				) : response ? (
					isError ? (
						<div className="flex h-full  pb-40 px-10 flex-col items-center justify-center">
							<img
								className="block h-40 w-auto mx-auto"
								src="/byteplexure-circle.png"
								alt="ByteForms"
							/>
							<p
								className="font-semibold mt-8 text-center"
								style={{ color: "#f38b8b" }}
							>
								Somwthing went wrong while generating your form!
							</p>
						</div>
					) : (
						<div
							className=" pt-4"
							style={{ paddingBottom: "300px" }}
						>
							<GeneratedFormRenderer formObject={response} />
						</div>
					)
				) : (
					<div className="flex h-full pb-40 px-10 flex-col items-center justify-center">
						<img
							className="block h-40 w-auto mx-auto"
							src="/byteplexure-circle.png"
							alt="ByteForms"
						/>
						<p
							className="font-semibold mt-8 text-center"
							style={{ color: "#cdd6e3" }}
						>
							Enter prompt to generate quiz using AI
						</p>
					</div>
				)}
			</div>

			<div className="w-full absolute bottom-4 md:bottom-8 z-50 px-4 md:px-10">
				<div className="container  mx-auto">
					<form
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<div className="bg-white shadow-lg rounded-xl ring-1 ring-zinc-300 p-4 md-p-6 md-px-10">
							<div className="flex flex-col">
								<div className="flex md:flex-row flex-col my-4">
									<div className="w-full relative z-0 mr-3 ">
										<input
											value={prompt}
											onChange={(e) =>
												setPrompt(e.target.value)
											}
											required
											type="text"
											id="prompt"
											className="text-gray-900 hidden md:block h-full bg-white rounded-md w-full border-0 py-2 px-3 md:px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm"
										/>
										<textarea
											value={prompt}
											onChange={(e) =>
												setPrompt(e.target.value)
											}
											rows={4}
											wrap="hard"
											required
											id="prompt"
											className="text-gray-900 md:hidden  h-full bg-white rounded-md block w-full border-0 py-2 px-3 md:px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs md:text-sm sm:leading-6 shadow-sm"
										/>
										{isDisabledPrompt ? (
											<div
												id="promptSuggestion"
												ref={divRef}
												onClick={
													disablePromptSuggestion
												}
												className="absolute py-2 px-3 md:px-4 inset-0 flex justify-start items-center z-10"
											>
												<TypewriterInput
													sentences={selectedForms}
												/>
											</div>
										) : (
											<></>
										)}
									</div>
									<div className="flex flex-shrink-0 w-100 md:mt-0 mt-4 md:mb-0 mb-3">
										<div className="flex flex-shrink-0 mr-2">
											<button
												id="states-button"
												data-dropdown-toggle="dropdown-states"
												className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 "
												type="button"
											>
												Questions
											</button>

											<label
												htmlFor="number_of_pages"
												className="sr-only"
											>
												Any
											</label>
											<input
												type="number"
												max={30}
												min={1}
												id="number_of_pages"
												value={pages}
												onChange={(e) =>
													setPages(e.target.value)
												}
												className="w-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 border-s-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
											/>
										</div>
									</div>
									<div className="flex">
										<button
											disabled={isCreating || !checked}
											type="submit"
											className="relative w-min text-center ml-0 md-ml-3 justify-center inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											onClick={onSubmit}
										>
											{isCreating ? (
												<>
													<Loading
														size={16}
														color="white"
													/>
													<span className="ms-2">
														{" "}
														Generating{" "}
													</span>
												</>
											) : (
												<span> Generate </span>
											)}
										</button>
										<div className="ml-2 visible md:invisible md:hidden flex items-center">
											{response?.data?.body ? (
												<div className="flex-shrink-0">
													<button
														onClick={editInBuilder}
														className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													>
														Edit in Builder
													</button>
												</div>
											) : null}
										</div>
									</div>
								</div>

								<div className="text-xs text-gray-500 flex">
									<input
										type="checkbox"
										className="mr-2"
										required
										id="agree_policy"
										onChange={(e) => {
											setChecked(!checked);
										}}
										checked={checked}
									/>
									<p>
										I agree with the{" "}
										<a
											className=" text-indigo-500"
											href={
												"https://www.byteplexure.com/byteforms-terms"
											}
										>
											{" "}
											Privacy policy{" "}
										</a>
										of Byteforms and opt-in for data sharing
										to third party AI models.
									</p>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default FormTemplatesPage;
