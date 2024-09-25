import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import useUser from "@hooks/useUser";
import { BaseResponse } from "@api/types/responses";
import { acceptWorkspaceInvite } from "@api/workspace";
import { getFieldMessageFromTag } from "@utils/index";

export default function WorkspaceInvitePage() {
	const [isAccepting, setIsAccepting] = useState(false);

	const { data: user } = useUser({
		redirect: true,
	});

	const router = useRouter();
	const onSubmit = async () => {
		try {
			setIsAccepting(true);
			const res = await acceptWorkspaceInvite(
				router.query.token as string
			);
			if (res.status === "success") {
				setIsAccepting(false);
				toast.success("Workspace accepted successfully");
				const url = router.query?.next as string;
				if (url) {
					router.push(url);
				} else {
					router.push("/dashboard");
				}
			} else {
				setIsAccepting(false);
				toast.error(res.message ?? "An error occured");
				console.error("[onAcceptWorkspaceInvite] Response", res);
			}
		} catch (err) {
			setIsAccepting(false);
			console.error("[onAcceptWorkspaceInvite]", err);
			const e = err as AxiosError<BaseResponse<string>>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				if (
					e?.response?.data?.errors &&
					e?.response?.data?.errors?.length > 0
				) {
					e.response.data.errors.forEach((error) => {
						toast.error(
							getFieldMessageFromTag(error.tag, error.field)
						);
					});
				} else {
					toast.error("Something went wrong");
				}
			}
		}
	};

	const [isTokenValid, setIsTokenValid] = useState(true);
	useEffect(() => {
		if (router.isReady) {
			if (!router.query.token) {
				setIsTokenValid(false);
			}
		}
	}, [router]);

	return (
		<>
			<Head>
				<title>Accept workspace invite | ByteForms</title>
			</Head>
			<Toaster />
			<div className="flex min-h-screen">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
								Accept workspace invite
							</h2>
							{isTokenValid && (
								<p className="text-gray-500">Join workspace</p>
							)}
						</div>

						{isTokenValid ? (
							<div className="mt-8">
								<div className="mt-6">
									<div>
										<button
											disabled={isAccepting}
											onClick={() => onSubmit()}
											className=" button-primary w-full justify-center space-x-2 items-center"
										>
											{isAccepting && <LoaderIcon />}
											<span>
												Join as '{user?.data?.email}'
											</span>
										</button>
										<Link
											href="/dashboard"
											className="justify-center flex button-outlined w-full mt-4"
										>
											<span>Back to dashboard</span>
										</Link>
									</div>
								</div>
							</div>
						) : (
							<div>
								<p className="mt-4 text-red-500">
									This workspace invite link is invalid.
									Please make sure you are using the correct
									link.
								</p>
								<p className="text-gray-500">
									Or request a new invite.
								</p>
							</div>
						)}
					</div>
				</div>
				<div className="relative hidden w-0 flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1440&q=80"
						alt=""
					/>
					<div className="relative">
						<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
							<p className="text-2xl font-medium md:w-1/2 text-white ">
								Create beautiful forms and share them anywhere
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
