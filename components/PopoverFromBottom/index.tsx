import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";

const PopoverFromBottom = ({
	children,
	show,
	onClose,
}: {
	children: React.ReactNode;
	show: boolean;
	onClose: (show: boolean) => void;
}) => {
	return (
		<Transition.Root show={show} as={Fragment}>
			<Dialog as="div" className="relative z-40" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="transition-opacity ease-linear duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
				</Transition.Child>

				<div className="fixed inset-0 z-40 flex">
					<Transition.Child
						as={Fragment}
						enter="transition ease-in-out duration-300 transform"
						enterFrom="translate-y-full"
						enterTo="translate-y-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-y-0"
						leaveTo="translate-y-full"
					>
						<Dialog.Panel className="relative mt-8 rounded flex w-full flex-1 flex-col bg-gray-100">
							<Transition.Child
								as={Fragment}
								enter="ease-in-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in-out duration-300"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="p-4 overflow-y-auto max-h-screen">
									<div className="absolute right-4">
										<XMarkIcon
											className="w-6 h-6"
											onClick={() => onClose(false)}
										/>
									</div>
									{children}
								</div>
							</Transition.Child>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default PopoverFromBottom;
