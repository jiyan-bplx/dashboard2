import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FormTemplates } from "../../../data/Templates";
import FormRenderer from "../../FormRenderer";
import Link from "next/link";
import { useRouter } from "next/router";
type TemplatePreviewModalProps = {
	isOpen: boolean;
	template: (typeof FormTemplates)[number] | undefined;
	closeModal: () => void;
};
export default function TemplatePreviewModal({
	isOpen,
	template,
	closeModal,
}: TemplatePreviewModalProps) {
	const router = useRouter();
	return (
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
							<Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white py-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="px-6 text-lg font-medium leading-6 text-gray-900"
								>
									'{template?.name}' Template Preview
								</Dialog.Title>

								<div
									className="mt-2 overflow-y-auto px-6"
									style={{
										maxHeight: "calc(100vh - 200px)",
									}}
								>
									{template && (
										<FormRenderer
											templateSlug={template.slug}
											isTemplatePreview
											options={{}}
											formInitialData={
												{
													data: {
														options: {
															remove_branding:
																true,
														},
														name: template!.name,
														body: template!.inputs,
													},
												} as any
											}
										/>
									)}
								</div>

								<div className="px-6 mt-4 flex items-center justify-end space-x-2">
									<Link
										href={{
											pathname: `/builder`,
											query: {
												workspace:
													router.query.workspace,
												template: template?.slug,
											},
										}}
										replace
										className="button-primary"
									>
										<span>Use this template</span>
									</Link>
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
										onClick={closeModal}
									>
										Back
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
