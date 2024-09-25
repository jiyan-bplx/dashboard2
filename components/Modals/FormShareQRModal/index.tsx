import { Dialog, Transition } from "@headlessui/react";
import { ShareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { QRCodeCanvas } from "qrcode.react";
import { ClipboardEventHandler, Fragment, useState } from "react";
import toast from "react-hot-toast";
import { FormItem } from "@api/forms/responses";
import { classNames } from "@utils/index";
import Input from "../../BuilderComponents/Inputs/Input";
import validator from "validator";
import { AxiosError } from "axios";
import { BaseResponse } from "@api/types/responses";
import { shareAMPFormInEmail, shareFormInEmail } from "../../../lib/api/forms";
const tabs = [
	{
		title: "QR Code",
	},
	{
		title: "Send via email",
	},
	{
		title: "Embed in email",
		beta: true,
	},
];
const FormShareModal = ({
	open,
	setOpen,
	selectedForm,
}: {
	selectedForm: FormItem | null;
	open: boolean;
	setOpen: (open: boolean) => void;
}) => {
	const getLink = (includeProtocol = true) => {
		return (
			(includeProtocol ? `${window.location.protocol}//` : "") +
			`${window.location.host}/form/${selectedForm?.public_id}`
		);
	};
	const copyFormLink = async () => {
		if (!selectedForm) return;
		// Check if browser supports clipboard
		if (!navigator.clipboard) {
			toast.error("Your browser does not support clipboard");
			return;
		}

		// Copy to clipboard
		await navigator.clipboard.writeText(getLink());
		toast.success("Link copied to clipboard");

		if (navigator.share === undefined) return;
		navigator.share({
			title: selectedForm?.name + " - ByteForms",
			url: getLink(),
			text: "I have shared a Form with you using ByteForms. Click the link below to fill",
		});
	};

	const getQrPng = () => {
		const element = document.getElementById("qrCode");

		if (!element) return;

		const canvas = element as HTMLCanvasElement;
		const pngUrl = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/png");

		return pngUrl;
	};

	const downloadQR = async () => {
		const pngUrl = getQrPng();
		if (!pngUrl) return;
		const downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = `${selectedForm?.name}_QR_Code.png`;

		document.body.appendChild(downloadLink);
		downloadLink.click();

		document.body.removeChild(downloadLink);
	};

	const copyQrCode = async () => {
		const pngUrl = getQrPng();
		if (!pngUrl) return;

		if (!navigator.clipboard) {
			console.log("Clipboard not supported");
			toast.error("Your browser does not support clipboard");
			return;
		}

		console.log(pngUrl);

		try {
			if ("write" in navigator.clipboard) {
				await navigator.clipboard.write([
					new ClipboardItem({
						"image/png": new File([pngUrl], "QR_Code.png", {
							type: "image/png",
						}),
					}),
				]);
				toast.success("QR Code copied to clipboard");
				// Image copied as image.
			} else {
			}
		} catch (err) {
			console.error(`[copyQrCode]`, err);
		}
	};

	const shareQR = async () => {
		const pngUrl = getQrPng();
		if (!pngUrl) return;

		if (navigator.share === undefined) {
			toast.error("Sharing is not supported on this browser.");
			return;
		}
		navigator.share({
			title: selectedForm?.name + " - ByteForms",
			url: `${window.location.protocol}//${window.location.host}/r/${selectedForm?.public_id}`,
			text: "Fill this form",
			files: [new File([pngUrl], "QR_Code.png", { type: "image/png" })],
		});
	};

	function shareOnLinkedIn() {
		var url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(
			getLink(false)
		)}`;
		window.open(
			url,
			"",
			"menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
		);
		return false;
	}

	function shareOnReddit() {
		copyFormLink();
		var url = `https://www.reddit.com/submit?url=${encodeURIComponent(
			getLink()
		)}`;
		window.open(
			url,
			"",
			"menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
		);
	}

	function shareOnFB() {
		var url = `https://www.facebook.com/sharer/sharer.php?u=${getLink()}&t=I have shared '${
			selectedForm?.name
		}' with you using ByteForms. Click the link below to fill`;
		window.open(
			url,
			"",
			"menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
		);
		return false;
	}

	function shareOnTwitter() {
		var url = `https://twitter.com/intent/tweet?url=${getLink()}&text=I have shared '${
			selectedForm?.name
		}' with you using ByteForms. Click the link below to fill`;
		window.open(url, "TwitterWindow", "width=600,height=300");
		return false;
	}

	const [activeTab, setActiveTab] = useState(tabs.at(0)!.title);
	const [emails, setEmails] = useState<string[]>([]);
	const [email, setEmail] = useState("");

	const handleDelete = (item: string) => {
		setEmails((prev) => prev.filter((e) => e !== item));
	};

	const handlePasteEmail: ClipboardEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();
		const paste = e.clipboardData.getData("text");
		const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

		if (emails) {
			const toBeAdded = emails.filter((email) => !isInList(email));

			setEmails((prev) => [...prev, ...toBeAdded]);
		}
	};

	const handleKeyDownEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Enter" ||
			e.key === " " ||
			e.key === "," ||
			e.key === "Tab"
		) {
			if (isValid(email)) {
				e.preventDefault();
				setEmails((prev) => [...prev, email]);
				setEmail("");
			}
		}
	};

	const sendEmail = async () => {
		try {
			let emailsList: string[] | undefined;
			if (emails.length === 0) {
				if (email.length > 0) {
					if (validator.isEmail(email)) {
						emailsList = [email];
					} else {
						toast.error("Please enter a valid email");
					}
				} else {
					toast.error("Please enter atleast one email");
				}
			} else {
				emailsList = emails;
			}

			if (!emailsList) return;
			if (!selectedForm) return;
			let res: BaseResponse<any> | undefined;
			if (activeTab === tabs.at(1)?.title) {
				res = await shareFormInEmail(selectedForm.id, {
					emails: emailsList,
				});
			} else if (activeTab === tabs.at(2)?.title) {
				res = await shareAMPFormInEmail(selectedForm.id, {
					emails: emailsList,
				});
			}

			if (res?.status === "success") {
				toast.success("Form shared.");
				setEmail("");
				setEmails([]);
			} else {
				toast.error(res?.message ?? "An error occured");
			}
		} catch (err) {
			console.error("[onSendEmail]", err);
			const e = err as AxiosError<BaseResponse<any>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message ?? "Something went wrong");
			} else {
				toast.error("Something went wrong");
			}
		}
	};
	function isValid(email: string) {
		let error = null;

		if (isInList(email)) {
			error = `${email} has already been added.`;
		}

		if (!isEmail(email)) {
			error = `${email} is not a valid email address.`;
		}

		if (error) {
			toast.error(error);
			return false;
		}

		return true;
	}

	const isEmail = (text: string) => {
		return validator.isEmail(text);
	};

	function isInList(text: string) {
		return emails.includes(text);
	}

	const onClose = () => {
		setEmail("");
		setEmails([]);
		setActiveTab(tabs.at(0)!.title);
		setOpen(false);
	};
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div>
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<ShareIcon
											className="h-6 w-6 text-green-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900"
										>
											Share Form
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-left font-medium text-sm mb-2">
												Form Link
											</p>
											<div className="relative mt-1 rounded-md shadow-sm">
												{typeof window !==
													"undefined" && (
													<input
														onClick={copyFormLink}
														readOnly
														type="text"
														name="account-number"
														id="account-number"
														value={`${window?.location.protocol}//${window?.location.host}/form/${selectedForm?.public_id}`}
														className="block w-full rounded-md border-gray-300 pr-10 sm:text-sm py-2 pl-2 bg-gray-50 border outline-none cursor-pointer"
														placeholder="000-00-0000"
													/>
												)}
												<div className="absolute inset-y-0 right-0 flex items-center pr-3  z-50">
													<ClipboardIcon
														onClick={copyFormLink}
														className="h-5 w-5 text-gray-400 cursor-pointer"
														aria-hidden="true"
													/>
												</div>
											</div>
											<p className="text-xs text-gray-400 self-start text-start mt-1">
												Tap to copy
											</p>
										</div>

										<div className="flex items-center justify-start mt-2  space-x-2">
											<button
												onClick={shareOnTwitter}
												type="button"
												className="bg-gray-200 rounded-full flex items-center justify-center w-9 h-9 text-gray-600 hover:text-black transition"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 16 16"
													id="twitter"
													className="w-4 h-4"
													fill="currentColor"
												>
													<path d="M16 3.539a6.839 6.839 0 0 1-1.89.518 3.262 3.262 0 0 0 1.443-1.813 6.555 6.555 0 0 1-2.08.794 3.28 3.28 0 0 0-5.674 2.243c0 .26.022.51.076.748a9.284 9.284 0 0 1-6.761-3.431 3.285 3.285 0 0 0 1.008 4.384A3.24 3.24 0 0 1 .64 6.578v.036a3.295 3.295 0 0 0 2.628 3.223 3.274 3.274 0 0 1-.86.108 2.9 2.9 0 0 1-.621-.056 3.311 3.311 0 0 0 3.065 2.285 6.59 6.59 0 0 1-4.067 1.399c-.269 0-.527-.012-.785-.045A9.234 9.234 0 0 0 5.032 15c6.036 0 9.336-5 9.336-9.334 0-.145-.005-.285-.012-.424A6.544 6.544 0 0 0 16 3.539z"></path>
												</svg>
											</button>

											<button
												id="linked-in"
												type="button"
												onClick={shareOnLinkedIn}
												className="bg-gray-200 rounded-full flex items-center justify-center w-9 h-9 text-gray-600 hover:text-black transition"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 32 32"
													id="linked"
													className="w-4 h-4"
													fill="currentColor"
												>
													<path d="M32 31.292V19.46c0-6.34-3.384-9.29-7.896-9.29-3.641 0-5.273 2.003-6.182 3.409v-2.924h-6.86c.091 1.937 0 20.637 0 20.637h6.86V19.767c0-.615.044-1.232.226-1.672.495-1.233 1.624-2.509 3.518-2.509 2.483 0 3.475 1.892 3.475 4.666v11.041H32v-.001zM3.835 7.838c2.391 0 3.882-1.586 3.882-3.567C7.673 2.247 6.227.707 3.881.707S0 2.246 0 4.271c0 1.981 1.489 3.567 3.792 3.567h.043zm3.43 23.454V10.655H.406v20.637h6.859z"></path>
												</svg>
											</button>
											<button
												onClick={shareOnFB}
												id="facebook-share"
												type="button"
												className="bg-gray-200 rounded-full flex items-center justify-center w-9 h-9 text-gray-600 hover:text-black transition"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													id="facebook"
													className="w-5 h-5"
													fill="currentColor"
												>
													<path d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z"></path>
												</svg>
											</button>
											<button
												id="reddit-btn"
												onClick={shareOnReddit}
												type="button"
												className="bg-gray-200 rounded-full flex items-center justify-center w-9 h-9 text-gray-600 hover:text-black transition"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-5 h-5"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z" />
												</svg>
											</button>
										</div>

										<div className="mt-2 border-b border-gray-200">
											<nav
												className="-mb-px flex space-x-4"
												aria-label="Tabs"
											>
												{tabs.map((tab) => (
													<button
														onClick={() =>
															setActiveTab(
																tab.title
															)
														}
														key={tab.title}
														className={classNames(
															activeTab.toLowerCase() ===
																tab.title.toLowerCase()
																? "border-indigo-500 text-indigo-600"
																: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
															"whitespace-nowrap pt-4 pb-2 px- border-b-2 font-medium text-sm flex items-center space-x-1"
														)}
														aria-current={
															activeTab.toLowerCase() ===
															tab.title.toLowerCase()
																? "page"
																: undefined
														}
													>
														<span>{tab.title}</span>
														{tab.beta && (
															<div className="text-[10px] group z-10">
																<div className="flex flex-col relative">
																	<div className=" bg-indigo-200 px-2 rounded-full text-gray-700 font-medium">
																		Beta
																	</div>
																	<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded group-hover:opacity-100 transition duration-500 absolute top-0 left-0 w-40 mt-6">
																		This
																		feature
																		is in
																		beta.
																		Please
																		report
																		any
																		issues.
																	</span>
																</div>
															</div>
														)}
													</button>
												))}
											</nav>
										</div>
										{activeTab === "QR Code" && (
											<div className="flex flex-col items-center mt-3">
												<p className="font-medium">
													Share QR Code
												</p>
												<p className="mb-2 text-sm text-gray-700">
													Share this QR Code to allow
													people to scan it using
													mobile devices and access
													your form.
												</p>

												{typeof window !==
													"undefined" && (
													<QRCodeCanvas
														id="qrCode"
														className=""
														value={`${window?.location.protocol}//${window?.location.host}/form/${selectedForm?.public_id}`}
													/>
												)}

												<div className="mt-4 flex space-x-2 items-center">
													<button
														onClick={downloadQR}
														className="button-primary"
													>
														Download
													</button>
													{/* <button
													onClick={copyQrCode}
													className="button-secondary"
												>
													Copy
												</button> */}
													<button
														onClick={shareQR}
														className="button-secondary"
													>
														Share
													</button>
												</div>
											</div>
										)}

										{activeTab === tabs.at(2)?.title && (
											<div className="flex flex-col mt-2 items-start">
												<p className="text-sm text-gray-500 font-medium text-left">
													Embed your form in Email and
													allow users to fill it
													directly from their email
													client.
												</p>
												<p className="text-sm text-gray-500 font-medium text-left">
													Supported in FairMail,
													Gmail, Yahoo Mail.
												</p>
												<p className="text-sm text-gray-600  mt-1  -mb-2 font-medium text-left">
													This feature is still in
													Beta. Please report if you
													encounter any issues.
												</p>
											</div>
										)}
										{(activeTab === "Send via email" ||
											activeTab ===
												tabs.at(2)?.title) && (
											<div className="flex flex-col">
												{emails.length > 0 && (
													<div className="flex flex-wrap gap-2 mt-4">
														{emails.map((email) => (
															<div
																className="text-sm flex items-center space-x-1 rounded-full bg-gray-200 px-2"
																key={email}
															>
																<p>{email}</p>
																<button
																	type="button"
																	onClick={() =>
																		handleDelete(
																			email
																		)
																	}
																>
																	<XMarkIcon className="w-3 h-3" />
																</button>
															</div>
														))}
													</div>
												)}
												<div className="mt-4">
													<Input
														className="mt-3"
														type="email"
														required
														placeholder="Type or paste email addresses and press `Enter`..."
														label="Emails"
														onKeyDown={
															handleKeyDownEmail
														}
														onChange={(e) =>
															setEmail(
																e.target.value
															)
														}
														onPaste={
															handlePasteEmail
														}
														value={email}
													/>
												</div>
												{/* <div className="mt-2">
													<Input
														className="mt-3"
														placeholder="Subject"
														label="Subject"
													/>
												</div>

												<div className="mt-2">
													<Input
														placeholder="Message"
														label="Message"
													/>
												</div> */}
											</div>
										)}
									</div>
								</div>
								<div className="mt-5 sm:mt-6 flex justify-between">
									<button
										type="button"
										className="button-outlined"
										onClick={onClose}
									>
										Close
									</button>
									{(activeTab === "Send via email" ||
										activeTab === tabs.at(2)?.title) && (
										<button
											className="button-primary"
											onClick={sendEmail}
											disabled={
												emails.length === 0 &&
												email.length === 0
											}
										>
											Send email
										</button>
									)}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default FormShareModal;
