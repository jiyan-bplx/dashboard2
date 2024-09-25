import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Toaster } from "react-hot-toast";
import { FormOptions } from "@api/forms/requests";
import { useFormOptionsStore } from "@store/builder";
type BuilderFormSelectorModalProps = {
	isOpen: boolean;
	closeModal: () => void;
};
export default function BuilderFormSelectorModal({
	isOpen,
	closeModal,
}: BuilderFormSelectorModalProps) {
	const { changeFormOption } = useFormOptionsStore((state) => state);

	const onSelectFormType = (type: FormOptions["page_behaviour"]) => {
		changeFormOption({
			page_behaviour: type,
		});
		closeModal();
	};

	const standardForm = () => {
		onSelectFormType("scroll");
	};
	const onePageAtATimeForm = () => {
		onSelectFormType("one_page");
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

					<div className="fixed inset-0 overflow-y-auto py-10">
						<div className="flex min-h-full items-center justify-center p-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md bg-white shadow-xl transition-all">
									<div className="p-6 align-middle">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900 text-left"
										>
											What type of form are you looking to
											create ?
										</Dialog.Title>

										<div className="mt-4 grid grid-cols-2 gap-5 items-stretch">
											<button
												onClick={standardForm}
												className="hover:border-gray-200 border border-transparent transition bg-gray-50 rounded-md px-6 py-6 flex flex-col items-center"
											>
												<div className="bg-red-100 flex p-4 md:p-6 rounded-md self-center mb-2 md:mb-4 w-full">
													<div
														className="bg-white w-full h-full rounded p-4"
														style={{
															aspectRatio:
																15 / 16,
														}}
													>
														<div className="bg-gray-200 w-full h-4 rounded-sm"></div>
														<div className="flex items-center space-x-1 mt-3">
															<div className="bg-gray-200 h-2 rounded-sm w-1/3"></div>
															<div className="bg-gray-200 h-2 rounded-sm w-1/2"></div>
														</div>
														<div className="bg-gray-200 h-2 rounded-sm mt-2 w-1/2"></div>
														<div className="bg-gray-200 h-2 rounded-sm mt-2 w-1/4"></div>
														<div className="bg-gray-200 h-2 rounded-sm mt-2 w-1/3"></div>
														<div className="bg-gray-200 h-2 rounded-sm mt-2 w-1/2"></div>
														<div className="bg-gray-200 h-2 rounded-sm mt-2 w-full"></div>
														<div className="bg-indigo-300 rounded-sm w-12 h-3 mt-3"></div>
													</div>
												</div>
												<p className="font-medium md:text-lg text-center">
													Standard Form
												</p>
												<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 text-center">
													Single page or multi-page
													forms, with multiple inputs
													per page.
												</p>
											</button>

											<button
												className="hover:border-gray-200 border border-transparent transition bg-gray-50 rounded-md px-6 py-6 flex flex-col items-center justify-between"
												onClick={onePageAtATimeForm}
											>
												<div className="bg-indigo-100 p-4 md:p-6 rounded-md self-center mb-2 md:mb-4 w-full h-full flex flex-col  justify-center">
													<div
														className="bg-white w-full rounded p-4 "
														style={{
															aspectRatio: 16 / 9,
														}}
													>
														<div className="flex items-center justify-start space-x-2">
															<div className="w-1/2">
																<div className="flex items-center space-x-1">
																	<div className="bg-gray-200 h-[6px] rounded-sm w-1/3"></div>
																	<div className="bg-gray-200 h-[6px] rounded-sm w-1/2"></div>
																</div>
																<div className="bg-gray-200 h-[6px] rounded-sm mt-[6px] w-1/2"></div>
																<div className="bg-gray-200 h-[6px] rounded-sm mt-[6px] w-4/5"></div>
																<div className="bg-indigo-300 rounded-sm w-8 h-[6px] mt-[6px]"></div>
															</div>
															<div className="bg-gray-200 aspect-square w-1/2 rounded"></div>
														</div>
													</div>
												</div>
												<div>
													<p className="font-medium md:text-lg text-center">
														One question at a time
													</p>
													<p className="text-xs md:text-sm text-gray-500 font-light mt-1 md:mt-2 text-center">
														Create multi-page form
														that displays only one
														question at a a time to
														the user.
													</p>
												</div>
											</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
