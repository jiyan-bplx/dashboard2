import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
type BulkAddOptionsModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	onAdd: (options: string[]) => void;
};
export default function BulkAddOptionsModal({
	onAdd,
	isOpen,
	closeModal,
}: BulkAddOptionsModalProps) {
	const [options, setOptions] = useState("");
	const splitOptions = useMemo(
		() =>
			options
				.split(/[\n,]/)
				.map((item) => item.trim())
				.filter((e) => e.length > 0),
		[options]
	);

	const onSubmit = async () => {
		if (
			!splitOptions ||
			splitOptions.length === 0 ||
			!options ||
			options.length === 0
		) {
			toast.error("Please enter a valid options list.");
			return;
		}
		onAdd(splitOptions);
		closeModal();
	};
	return (
		<>
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
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Bulk add options
									</Dialog.Title>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}
									>
										<div className="mt-2">
											<div className="col-span-6 sm:col-span-3">
												<label
													htmlFor="options"
													className="block text-sm  text-gray-700 mb-2"
												>
													Insert many options at once
													by typing a list of options
													separated with commas or new
													lines.
												</label>
												<textarea
													value={options}
													onChange={(e) =>
														setOptions(
															e.target.value
														)
													}
													required
													name="options"
													id="options"
													rows={4}
													autoFocus
													placeholder="Option 1, Option 2, Option 3"
													className="mt-1 block w-full bg-gray-100 px-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
												/>
											</div>
										</div>

										<div className="mt-4 flex items-center space-x-2">
											<button
												type="submit"
												disabled={
													splitOptions.length === 0
												}
												className="button-primary"
												onClick={onSubmit}
											>
												<span>
													Add {splitOptions.length}
												</span>
											</button>
											<button
												type="button"
												className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
												onClick={closeModal}
											>
												Cancel
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
