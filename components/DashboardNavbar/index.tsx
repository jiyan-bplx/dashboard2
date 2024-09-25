// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { Fragment, useEffect } from "react";
// import toast from "react-hot-toast";
// import useUser from "@hooks/useUser";
// import { logoutUser } from "@api/auth";
// import { classNames } from "@utils/index";
// import FreePlanBanner from "../FreePlanBanner";
// import { useQueryClient } from "react-query";
// import VerifyEmailBanner from "../VerifyEmailBanner";

// const DashboardLinkItems = [
// 	{
// 		name: "Dashboard",
// 		href: "/dashboard",
// 	},
// 	// {
// 	// 	name: "Team",
// 	// 	href: "/dashboard/team",
// 	// },
// 	{
// 		name: "Pricing",
// 		href: "/profile/pricing",
// 	},
// 	{
// 		name: "AI Forms",
// 		href: "/ai",
// 	},
// 	{
// 		name: "Contact Us",
// 		href: "/contact",
// 	},
// ];
// export default function DashboardNavbar() {
// 	const router = useRouter();

// 	const { data: userData, isLoading } = useUser({
// 		redirect: true,
// 	});

// 	useEffect(() => {
// 		if (!isLoading && userData?.data) {
// 			if (!userData?.data?.address?.line1) {
// 				const url = router.query?.next as string;
// 				if (url) {
// 					router.push("/profile/address?next=" + url);
// 				} else {
// 					router.push("/profile/address");
// 				}
// 			}

// 			if (!userData?.data?.verified) {
// 				const url = router.query?.next as string;
// 				if (url) {
// 					router.push("/email-verification?next=" + url);
// 				} else {
// 					router.push("/email-verification");
// 				}
// 			}
// 		}
// 	}, [userData, isLoading]);

// 	const client = useQueryClient();
// 	const onLogout = async () => {
// 		try {
// 			const res = await logoutUser();
// 			if (res.status === "success") {
// 				client.removeQueries();
// 				toast.success("Logged out");
// 			} else {
// 				// toast.error("Something went wrong");
// 			}
// 		} catch (error) {
// 			// toast.error("Something went wrong");
// 			console.error("[onLogout]", error);
// 		} finally {
// 			router.replace("/login");
// 		}
// 	};

// 	const isCurrentRoute = (path: string) => {
// 		return router.asPath.includes(path);
// 	};

// 	return (
// 		<>
// 			{userData?.data && !userData?.data?.verified && (
// 				<VerifyEmailBanner />
// 			)}
// 			{userData?.data?.verified && <FreePlanBanner />}
// 			<Disclosure as="nav" className="bg-white shadow">
// 				{({ open }) => (
// 					<>
// 						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// 							<div className="flex h-16 justify-between">
// 								<div className="flex">
// 									<div className="-ml-2 mr-2 flex items-center md:hidden">
// 										{/* Mobile menu button */}
// 										<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
// 											<span className="sr-only">
// 												Open main menu
// 											</span>
// 											{open ? (
// 												<XMarkIcon
// 													className="block h-6 w-6"
// 													aria-hidden="true"
// 												/>
// 											) : (
// 												<Bars3Icon
// 													className="block h-6 w-6"
// 													aria-hidden="true"
// 												/>
// 											)}
// 										</Disclosure.Button>
// 									</div>
// 									<div className="flex flex-shrink-0 items-center">
// 										<Link
// 											href="/dashboard"
// 											className="inline-flex"
// 										>
// 											<span className="sr-only">
// 												ByteForms
// 											</span>
// 											<img
// 												className="block h-8 w-auto"
// 												src="/byteformslogo.png"
// 												alt="ByteForms"
// 											/>
// 										</Link>
// 									</div>
// 									<div className="hidden md:ml-6 md:flex md:space-x-8">
// 										{/* Current: "border-indigo-500 text-gray-900", Default: "" */}
// 										{DashboardLinkItems?.map((item) => (
// 											<Link
// 												suppressHydrationWarning
// 												key={item.href}
// 												href={item.href}
// 												className={classNames(
// 													isCurrentRoute(item.href)
// 														? "border-indigo-500 text-gray-900 hover:text-gray-700"
// 														: "border-transparent text-gray-500 ",
// 													"inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium  text-gray-500 hover:border-gray-300 hover:text-gray-700"
// 												)}
// 											>
// 												{item.name}
// 											</Link>
// 										))}
// 									</div>
// 								</div>
// 								<div className="flex items-center">
// 									{/* <div className="flex-shrink-0">
// 									<button
// 										type="button"
// 										className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
// 									>
// 										<PlusIcon
// 											className="-ml-1 mr-2 h-5 w-5"
// 											aria-hidden="true"
// 										/>
// 										<span>New Job</span>
// 									</button>
// 								</div> */}
// 									<div className=" md:ml-4 md:flex md:flex-shrink-0 md:items-center">
// 										{/* <button
// 										type="button"
// 										className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
// 									>
// 										<span className="sr-only">
// 											View notifications
// 										</span>
// 										<BellIcon
// 											className="h-6 w-6"
// 											aria-hidden="true"
// 										/>
// 									</button> */}

// 										{/* Profile dropdown */}
// 										<Menu
// 											as="div"
// 											className="relative ml-3"
// 										>
// 											<div>
// 												<Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
// 													<span className="sr-only">
// 														Open user menu
// 													</span>
// 													<img
// 														className="h-8 w-8 rounded-full"
// 														src={
// 															userData?.data
// 																?.photo
// 																? userData?.data
// 																		?.photo
// 																: `https://source.boringavatars.com/beam/120/${userData?.data?.name}?colors=0A0310,49007E,FF005B,FF7D10,FFB238`
// 														}
// 														alt={
// 															userData?.data?.name
// 														}
// 													/>
// 												</Menu.Button>
// 											</div>
// 											<Transition
// 												as={Fragment}
// 												enter="transition ease-out duration-200"
// 												enterFrom="transform opacity-0 scale-95"
// 												enterTo="transform opacity-100 scale-100"
// 												leave="transition ease-in duration-75"
// 												leaveFrom="transform opacity-100 scale-100"
// 												leaveTo="transform opacity-0 scale-95"
// 											>
// 												<Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
// 													<div className="flex space-x-2 px-4 py-2 border-b max-w-full  items-center justify-start">
// 														<img
// 															className="h-8 w-8 rounded-full"
// 															src={
// 																userData?.data
// 																	?.photo
// 																	? userData
// 																			?.data
// 																			?.photo
// 																	: `https://source.boringavatars.com/beam/120/${userData?.data?.name}?colors=0A0310,49007E,FF005B,FF7D10,FFB238`
// 															}
// 															alt={
// 																userData?.data
// 																	?.name
// 															}
// 														/>
// 														<div
// 															style={{
// 																maxWidth: `calc(100% - 2rem)`,
// 															}}
// 														>
// 															<p className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
// 																{
// 																	userData
// 																		?.data
// 																		?.name
// 																}
// 															</p>
// 															<p className="text-xs text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
// 																{
// 																	userData
// 																		?.data
// 																		?.email
// 																}
// 															</p>
// 														</div>
// 													</div>
// 													<Menu.Item>
// 														<Link
// 															href="/profile"
// 															className={classNames(
// 																"hover:bg-gray-100",
// 																"block mt-2 px-4 py-2 text-sm text-gray-700"
// 															)}
// 														>
// 															Account Settings
// 														</Link>
// 													</Menu.Item>

// 													<Menu.Item>
// 														<Link
// 															href="/integrations"
// 															className={classNames(
// 																"hover:bg-gray-100",
// 																"block px-4 py-2 text-sm text-gray-700"
// 															)}
// 														>
// 															Integrations
// 														</Link>
// 													</Menu.Item>

// 													<Menu.Item>
// 														<Link
// 															href="https://bytesuite.io/support"
// 															className={classNames(
// 																"hover:bg-gray-100",
// 																"block px-4 py-2 text-sm text-gray-700"
// 															)}
// 														>
// 															Help
// 														</Link>
// 													</Menu.Item>

// 													<Menu.Button
// 														onClick={onLogout}
// 														className={classNames(
// 															"hover:bg-gray-100 block px-4 py-2 text-sm text-red-700 w-full text-left "
// 														)}
// 													>
// 														Sign out
// 													</Menu.Button>
// 												</Menu.Items>
// 											</Transition>
// 										</Menu>
// 									</div>
// 								</div>
// 							</div>
// 						</div>

// 						<Disclosure.Panel className="md:hidden">
// 							<div className="space-y-1 pt-2 pb-3">
// 								{DashboardLinkItems?.map((item) => (
// 									<Disclosure.Button
// 										key={item.href}
// 										className={classNames(
// 											isCurrentRoute(item.href)
// 												? "bg-indigo-50 border-indigo-500 text-indigo-700 "
// 												: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
// 											"block  py-2 pl-3 pr-4 text-sm border-l-4 text-indigo-700 sm:pl-5 sm:pr-6 w-full text-left"
// 										)}
// 									>
// 										<Link href={item.href}>
// 											{item.name}
// 										</Link>
// 									</Disclosure.Button>
// 								))}
// 							</div>
// 						</Disclosure.Panel>
// 					</>
// 				)}
// 			</Disclosure>
// 		</>
// 	);
// }

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import toast from "react-hot-toast";
import useUser from "@hooks/useUser";
import { logoutUser } from "@api/auth";
import { classNames } from "@utils/index";
import FreePlanBanner from "../FreePlanBanner";
import { useQueryClient } from "react-query";
import VerifyEmailBanner from "../VerifyEmailBanner";
import NewWebsiteButton from "@components/ButtonsNav";

const DashboardLinkItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  // Uncomment if you want to include Team
  // {
  //   name: "Team",
  //   href: "/dashboard/team",
  // },
  {
    name: "Pricing",
    href: "/profile/pricing",
  },
  {
    name: "AI_Forms",
    href: "/ai",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Docs",
    href: "http://localhost:3001/",
  },
];

export default function DashboardNavbar() {
  const router = useRouter();
  const { data: userData, isLoading } = useUser({ redirect: true });

  useEffect(() => {
    if (!isLoading && userData?.data) {
      if (!userData?.data?.address?.line1) {
        const url = router.query?.next as string;
        if (url) {
          router.push("/profile/address?next=" + url);
        } else {
          router.push("/profile/address");
        }
      }

      if (!userData?.data?.verified) {
        const url = router.query?.next as string;
        if (url) {
          router.push("/email-verification?next=" + url);
        } else {
          router.push("/email-verification");
        }
      }
    }
  }, [userData, isLoading]);

  const client = useQueryClient();
  const onLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.status === "success") {
        client.removeQueries();
        toast.success("Logged out");
      } else {
        // toast.error("Something went wrong");
      }
    } catch (error) {
      // toast.error("Something went wrong");
      console.error("[onLogout]", error);
    } finally {
      router.replace("/login");
    }
  };

  const isCurrentRoute = (path: string) => {
    return router.asPath.includes(path);
  };

  return (
    <>
      {userData?.data && !userData?.data?.verified && <VerifyEmailBanner />}
      {userData?.data?.verified && <FreePlanBanner />}
      <Disclosure as="nav" className="b">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/dashboard" className="inline-flex">
                      <span className="sr-only">ByteForms</span>
                      <img className="block h-8 w-auto" src="/byteformslogo.png" alt="ByteForms" />
                    </Link>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    {DashboardLinkItems?.map((item) => (
                      <Link
                        suppressHydrationWarning
                        key={item.href}
                        href={item.href}
                        className={classNames(
                          isCurrentRoute(item.href)
                            ? "border-indigo-500 text-gray-900 hover:text-gray-700"
                            : "border-transparent text-gray-500 ",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {/* Add the button here */}
					<NewWebsiteButton />
                    {/* <button
                      className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => alert('Button clicked!')}
                    >
                      New Button
                    </button> */}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={userData?.data?.photo ? userData?.data?.photo : `https://source.boringavatars.com/beam/120/${userData?.data?.name}?colors=0A0310,49007E,FF005B,FF7D10,FFB238`}
                            alt={userData?.data?.name}
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="flex space-x-2 px-4 py-2 border-b max-w-full items-center justify-start">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={userData?.data?.photo ? userData?.data?.photo : `https://source.boringavatars.com/beam/120/${userData?.data?.name}?colors=0A0310,49007E,FF005B,FF7D10,FFB238`}
                              alt={userData?.data?.name}
                            />
                            <div style={{ maxWidth: `calc(100% - 2rem)` }}>
                              <p className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">{userData?.data?.name}</p>
                              <p className="text-xs text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">{userData?.data?.email}</p>
                            </div>
                          </div>
                          <Menu.Item>
                            <Link href="/profile" className={classNames("hover:bg-gray-100", "block mt-2 px-4 py-2 text-sm text-gray-700")}>
                              Account Settings
                            </Link>
                          </Menu.Item>

                          <Menu.Item>
                            <Link href="/integrations" className={classNames("hover:bg-gray-100", "block px-4 py-2 text-sm text-gray-700")}>
                              Integrations
                            </Link>
                          </Menu.Item>

                          <Menu.Item>
                            <Link href="https://bytesuite.io/support" className={classNames("hover:bg-gray-100", "block px-4 py-2 text-sm text-gray-700")}>
                              Help
                            </Link>
                          </Menu.Item>

                          <Menu.Button
                            onClick={onLogout}
                            className={classNames("hover:bg-gray-100 block px-4 py-2 text-sm text-red-700 w-full text-left")}
                          >
                            Sign out
                          </Menu.Button>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {DashboardLinkItems?.map((item) => (
                  <Disclosure.Button
                    key={item.href}
                    className={classNames(
                      isCurrentRoute(item.href)
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 "
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                      "block py-2 pl-3 pr-4 text-sm border-l-4 text-indigo-700 sm:pl-5 sm:pr-6 w-full text-left"
                    )}
                  >
                    <Link href={item.href}>
                      {item.name}
                    </Link>
                  </Disclosure.Button>
                ))}
                {/* Mobile button if needed */}
				
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
