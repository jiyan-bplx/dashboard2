import { Dialog, Transition } from "@headlessui/react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@components/Loading";
type ConnectTelegramModalProps = {
	isOpen: boolean;
	code: string;
	closeModal: () => void;
};
export default function ConnectTelegramModal({
	isOpen,
	code,
	closeModal,
}: ConnectTelegramModalProps) {
	const [isCreating, setIsCreating] = useState(false);

	const copyCodeToClipboard = async () => {
		// Check if clipboard is supported
		if (!navigator.clipboard) {
			// console.error("Clipboard not supported");
			toast.error(
				"We couldn't copy the code to your clipboard. Please copy it manually."
			);
			return;
		}
		await navigator.clipboard.writeText(`/code ${code}`);
		toast.success(
			"Code copied to clipboard. You can now send it in your Telegram bot's chat."
		);
	};
	return (
		<>
			<Toaster />
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									{/* <Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Connect with Telegram
									</Dialog.Title> */}
									<div className="flex items-center space-x-4">
										<img
											src={"/telegram_icon.svg"}
											alt={"Telegram"}
											className="w-10 h-10"
										/>
										<div className="flex items-center space-x-1">
											{[1, 2, 3].map((i) => (
												<div
													key={i}
													className="w-1 h-1 bg-gray-400 rounded-full"
												/>
											))}
										</div>
										<p className="font-medium text-xl my-0 py-0">
											ByteForms
										</p>
									</div>
									<p className="mt-1 text-sm text-gray-500">
										Send Telegram Messages for new
										submissions.
									</p>

									<div className="flex items-center justify-between mt-4">
										<p>If you have Telegram installed</p>

										<Link
											href={`tg://msg?text=/code ${code}&to=@byteformsbot`}
											className="button-secondary"
										>
											{isCreating ? (
												<Loading
													size={16}
													color="black"
												/>
											) : null}
											<span>Click here to Connect</span>
										</Link>
									</div>
									<div className="flex flex-col mb-4 items-start mt-4">
										<p>
											If you don't have Telegram
											installed, copy the code below and
											send the message to our bot
										</p>
										<div className="flex items-start justify-start space-x-2 mt-4">
											<button
												onClick={copyCodeToClipboard}
												className="bg-gray-50 px-4 text-sm h-auto self-stretch  border rounded border-dashed flex items-center justify-center"
											>
												<p className="flex-grow">
													/code {code}
												</p>
												<ClipboardIcon className="ml-4 w-4 h-4 opacity-50 hover:opacity-100 cursor-pointer" />
											</button>
											<Link
												href="https://t.me/ByteFormsBot?start=start"
												className="button-secondary"
												onClick={closeModal}
											>
												Message @ByteFormsBot
											</Link>
										</div>
									</div>

									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
										onClick={closeModal}
									>
										Close
									</button>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
