import { Disclosure } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "@hooks/useUser";
import { logoutUser } from "@api/auth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { BaseResponse } from "@api/types/responses";

export default function Navbar() {
	const router = useRouter();
	const { data } = useUser({
		redirect: ["/builder", "/dashboard"].some((route) =>
			router.pathname.includes(route)
		),
	});

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

	return (
		<Disclosure as="nav" className="bg-white shadow">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex justify-between">
								<div className="-ml-2 mr-2 flex items-center md:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
										<span className="sr-only">
											Open main menu
										</span>
										{open ? (
											<XMarkIcon
												className="block h-6 w-6"
												aria-hidden="true"
											/>
										) : (
											<Bars3Icon
												className="block h-6 w-6"
												aria-hidden="true"
											/>
										)}
									</Disclosure.Button>
								</div>
								<div className="flex flex-shrink-0 items-center">
									<Link href="/" className="inline-flex">
										<span className="sr-only">
											ByteForms
										</span>
										<img
											className="block h-8 w-auto"
											src="/byteformslogo.png"
											alt="ByteForms"
										/>
									</Link>
									<div className="hidden md:ml-6 md:flex md:space-x-4">
										<Link
											href="https://bytesuite.io/"
											className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
										>
											ByteSuite
										</Link>

										{/* <Link
										href="/builder"
										className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
									>
										Build your form
									</Link> */}
										<Link
											href="/integrations"
											className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
										>
											Integrations
										</Link>
										<Link
											href="/templates"
											className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
										>
											Templates
										</Link>
										<Link
											href="/plans"
											className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
										>
											Pricing
										</Link>
										<Link
											href="/ai"
											className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
										>
											AI Forms
										</Link>
										<Link
											href="/ai"
											className="inline-flex items-center border-b-2 border-transparent hover:border-indigo-500 transition px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
										>
											AI Forms
										</Link>
									</div>
								</div>
							</div>
							<div className="flex items-center">
								<div className="flex-shrink-0 pl-4 hidden md:block">
									{!data?.data && (
										<Link
											href={"/login"}
											className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											{"Login"}
										</Link>
									)}
								</div>
								<div className="flex-shrink-0 pl-2 md:pl-4">
									{!data?.data && (
										<Link
											href={"/register"}
											className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											<PlusIcon
												className="-ml-1 mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5"
												aria-hidden="true"
											/>
											<span>Try For Free</span>
										</Link>
									)}
								</div>

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
														? data?.data?.photo
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

					<Disclosure.Panel className="md:hidden">
						<div className="space-y-1 pt-2 pb-3">
							{/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}

							<Disclosure.Button
								as="a"
								href="/integrations"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm md:text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
							>
								Integrations
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/templates"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm md:text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
							>
								Templates
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/plans"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm md:text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
							>
								Pricing
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="/ai"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm md:text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
							>
								AI Forms
							</Disclosure.Button>
							{data?.data && (
								<Disclosure.Button
									onClick={onLogout}
									className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-sm md:text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
								>
									Log Out
								</Disclosure.Button>
							)}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
