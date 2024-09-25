import { Dialog, Transition } from "@headlessui/react";
import { ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FormItem } from "@api/forms/responses";
import { classNames } from "@utils/index";
import { WorkspaceInviteItem } from "@api/workspace/responses";

type WorkspaceInvitesModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	invites: WorkspaceInviteItem[];
};
export default function WorkspaceInvitesModal({
	isOpen,
	closeModal,
	invites,
}: WorkspaceInvitesModalProps) {
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
								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-white shadow-xl transition-all">
									<div className="p-6 align-middle">
										<div className="flex items-start justify-between">
											<Dialog.Title
												as="h1"
												className="text-2xl font-medium leading-6 text-gray-900 text-left mb-2 mt-2"
											>
												You've been invited to join{" "}
												{invites.length === 1
													? "a"
													: "following"}{" "}
												workspace
												{invites.length === 1
													? ""
													: "s"}
											</Dialog.Title>
											<button onClick={closeModal}>
												<XMarkIcon className="w-5 h-5" />
											</button>
										</div>

										{invites.map((invite) => (
											<div
												key={invite.id}
												className={classNames(
													"border border-dashed border-gray-300 col-span-2 rounded-md px-6 py-6 flex flex-row items-center mt-4 justify-between"
												)}
											>
												<div className="flex flex-col ">
													<p className="font-medium md:text-lg ">
														{invite.Workspace.name
															?.length > 0
															? invite.Workspace
																	.name
															: "Untitled workspace"}
													</p>
													{invite.Workspace
														.description &&
														invite.Workspace
															.description
															.length > 0 && (
															<span className="text-xs md:text-sm text-gray-500 font-light ">
																{
																	invite
																		.Workspace
																		.description
																}
															</span>
														)}
													<p>
														<span className="text-xs md:text-sm text-gray-500 font-light ">
															Invited by:{" "}
														</span>
														<span className="text-xs md:text-sm text-gray-800 font-light ">
															{
																invite.InvitedBy
																	?.name
															}{" "}
															(
															{
																invite.InvitedBy
																	?.email
															}
															)
														</span>
													</p>
												</div>
												<Link
													href={
														`/workspaces/invite?token=` +
														invite.token
													}
													className="button-primary"
												>
													Accept invite
												</Link>
											</div>
										))}
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
