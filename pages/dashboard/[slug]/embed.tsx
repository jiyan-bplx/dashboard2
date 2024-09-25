import { Switch } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PopoverFromBottom from "@components/PopoverFromBottom";
import Select from "@components/BuilderComponents/Inputs/Select";
import { classNames } from "@utils/index";

const FormEmbedOptions = () => {
	const router = useRouter();

	const [formType, setFormType] = useState("Inline");

	const [showFormTitle, setShowFormTitle] = useState(true);
	const [transparentBackground, setTransparentBackground] = useState(false);
	const [hideBorders, setHideBorders] = useState(false);

	const goBack = () => {
		router.back();
		// router.push(`/dashboard/${router.query.slug}/edit`);
	};

	const [showCode, setShowCode] = useState(false);
	const copyEmbedCode = () => {
		// Check window width
		if (window.innerWidth < 768) {
			setShowMobileCode(true);
		} else {
			setShowCode(true);
		}
	};

	const formLink = useMemo(
		() =>
			typeof window !== "undefined"
				? `${window.location.protocol}//${window.location.host}/embed/${
						router.query.slug
				  }?embedType=${
						formType === "Inline" ? "iframe" : "popup"
				  }&transparentBackground=${transparentBackground}&hideTitle=${
						showFormTitle ? "false" : "true"
				  }&hideBorders=${hideBorders}`
				: "",
		[
			hideBorders,
			showFormTitle,
			formType,
			transparentBackground,
			router.query.slug,
		]
	);

	const copyFormLink = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(formLink);
		}
		toast.success("Link copied!");
	};

	const FormPreview = () => {
		return (
			<div
				suppressHydrationWarning
				className={classNames("md:px-8 md:py-8 lg:ml-96 bg-gray-100 ")}
			>
				<p className="text-gray-500 text-xl font-semibold">
					Form Preview
				</p>
				<div className="mt-8 bg-gray-300 h-8 w-5/6 md:w-64 rounded" />
				<div className="mt-2 bg-gray-300 h-8 w-2/3 md:w-96 rounded" />
				<div className="mt-4 bg-gray-300 h-20 w-full rounded" />
				<div className="hidden md:block mt-4 bg-gray-300 h-12 w-2/3 rounded" />
				{typeof window !== "undefined" && (
					<iframe
						suppressHydrationWarning
						className="bg-gray-50 w-full min-h-screen mt-4"
						src={
							formLink +
							(formLink.includes("?") ? "&" : "?") +
							"isPreview=true"
						}
					/>
				)}
				<div className="mt-4 bg-gray-300 h-20 w-full rounded" />
				<div className="mt-4 bg-gray-300 h-12 w-2/3 rounded" />
				<div className="mt-2 bg-gray-300 h-8 w-5/6 md:w-96 rounded" />
			</div>
		);
	};

	const [showMobilePreview, setShowMobilePreview] = useState(false);
	const [showMobileCode, setShowMobileCode] = useState(false);
	return (
		<div className="">
			<Head>
				<title>Embed your Form | ByteForms</title>
			</Head>
			<Toaster />
			<div className="flex flex-col w-full  ">
				<div className="px-8 py-8 border-r lg:min-h-screen lg:fixed inset-0 w-full lg:w-96 bg-white  ">
					<div className="flex items-center justify-between">
						<p className="font-medium text-xl mb-4">Embed Form</p>
						<XMarkIcon className="w-6 h-6" onClick={goBack} />
					</div>

					{showCode ? (
						<button
							className="button-outlined w-full mb-5 text-center items-center justify-center"
							onClick={() => setShowCode(false)}
						>
							Show Preview
						</button>
					) : (
						<>
							<button
								className="button-primary w-full mb-5 text-center items-center justify-center"
								onClick={copyEmbedCode}
							>
								Show Embed Code
							</button>
						</>
					)}
					<button
						className="button-secondary w-full mb-5 text-center items-center justify-center"
						onClick={copyFormLink}
					>
						Copy Form Link
					</button>
					<Select
						title="Form Type"
						value={formType}
						options={["Inline", "Popup"]}
						onChange={(e) => setFormType(e.target.value)}
					/>

					<div className="mt-4">
						<Switch.Group
							as="div"
							className="flex items-center justify-between"
						>
							<span className="flex flex-grow flex-col">
								<Switch.Label
									as="span"
									className="text-sm font-medium text-gray-900"
									passive
								>
									Transparent Background
								</Switch.Label>
							</span>
							<Switch
								checked={transparentBackground}
								onChange={setTransparentBackground}
								className={classNames(
									transparentBackground
										? "bg-indigo-600"
										: "bg-gray-200",
									"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								)}
							>
								<span
									aria-hidden="true"
									className={classNames(
										transparentBackground
											? "translate-x-5"
											: "translate-x-0",
										"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
									)}
								/>
							</Switch>
						</Switch.Group>
					</div>

					<div className="mt-4">
						<Switch.Group
							as="div"
							className="flex items-center justify-between"
						>
							<span className="flex flex-grow flex-col">
								<Switch.Label
									as="span"
									className="text-sm font-medium text-gray-900"
									passive
								>
									Show Form title
								</Switch.Label>
							</span>
							<Switch
								checked={showFormTitle}
								onChange={setShowFormTitle}
								className={classNames(
									showFormTitle
										? "bg-indigo-600"
										: "bg-gray-200",
									"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								)}
							>
								<span
									aria-hidden="true"
									className={classNames(
										showFormTitle
											? "translate-x-5"
											: "translate-x-0",
										"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
									)}
								/>
							</Switch>
						</Switch.Group>
					</div>

					<div className="mt-4">
						<Switch.Group
							as="div"
							className="flex items-center justify-between"
						>
							<span className="flex flex-grow flex-col">
								<Switch.Label
									as="span"
									className="text-sm font-medium text-gray-900"
									passive
								>
									Hide Borders
								</Switch.Label>
							</span>
							<Switch
								checked={hideBorders}
								onChange={setHideBorders}
								className={classNames(
									hideBorders
										? "bg-indigo-600"
										: "bg-gray-200",
									"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								)}
							>
								<span
									aria-hidden="true"
									className={classNames(
										hideBorders
											? "translate-x-5"
											: "translate-x-0",
										"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
									)}
								/>
							</Switch>
						</Switch.Group>
					</div>

					<button
						className="mt-4 md:hidden button-secondary w-full mb-5 text-center items-center justify-center"
						onClick={() => setShowMobilePreview(true)}
					>
						Show preview
					</button>
				</div>

				<div className="block md:hidden">
					<PopoverFromBottom
						show={showMobilePreview}
						onClose={setShowMobilePreview}
					>
						<FormPreview />
					</PopoverFromBottom>

					<PopoverFromBottom
						show={showMobileCode}
						onClose={setShowMobileCode}
					>
						<div
							className={classNames("bg-gray-100")}
							style={{
								maxWidth: "calc(100vw - 32px)",
							}}
						>
							<pre
								className="bg-gray-100 p-4 rounded whitespace-pre-wrap"
								suppressHydrationWarning
							>
								{typeof window !== "undefined" && (
									<code>
										{`
<iframe src="${formLink}"
/>
`}
									</code>
								)}
							</pre>
						</div>
					</PopoverFromBottom>
				</div>

				<div className="hidden md:block ">
					{showCode ? (
						<div
							className={classNames(
								"px-8 py-8 lg:ml-96 bg-gray-100"
							)}
						>
							<pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
								{typeof window !== "undefined" && (
									<code>
										{`
<iframe
    src="${formLink}"
/>
`}
									</code>
								)}
							</pre>
						</div>
					) : (
						<FormPreview />
					)}
				</div>
			</div>
		</div>
	);
};

export default FormEmbedOptions;
