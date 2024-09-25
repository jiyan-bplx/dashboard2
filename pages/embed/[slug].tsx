import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import FormRenderer from "@components/FormRenderer";

const FormEmbedAsPopup = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<>
			<Transition
				show={!isOpen}
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="flex items-center mx-4 min-h-full my-4 w-full">
					<button
						onClick={() => setIsOpen(true)}
						className="button-primary"
					>
						Show Form
					</button>
				</div>
			</Transition>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setIsOpen}>
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
								enter="ease-out duration-500"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl  shadow-xl transition-all">
									{children}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};
const FormEmbed = () => {
	const router = useRouter();
	const hideTitle = router.query.hideTitle === "true";
	const hideBorders = router.query.hideBorders === "true";
	const isPreview = router.query.isPreview === "true";
	const transparentBackground = router.query.transparentBackground === "true";
	const embedType = (router.query.embedType as any) || ("iframe" as any);

	return (
		<div className="">
			{embedType === "popup" ? (
				<FormEmbedAsPopup>
					<FormRenderer
						options={{
							hideTitle,
							embedType,
							transparentBackground,
							hideBorders,
						}}
						formId={router.query.slug as string}
					/>
				</FormEmbedAsPopup>
			) : (
				<FormRenderer
					options={{
						hideTitle,
						embedType,
						hideBorders,
						transparentBackground,
					}}
					formId={router.query.slug as string}
				/>
			)}
		</div>
	);
};

export default FormEmbed;
