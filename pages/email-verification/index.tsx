import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import useUser from "@hooks/useUser";
import { sendVerificationEmail } from "@api/auth";
import { AxiosError } from "axios";
import { BaseResponse } from "@api/types/responses";

export default function EmailVerificationPage() {
	const { data: userData, isLoading } = useUser({
		redirect: true,
	});

	const [sending, setSending] = useState(false);

	const resendEmail = async () => {
		if (userData?.data?.email) {
			try {
				setSending(true);
				const res = await sendVerificationEmail(userData?.data?.email);
				setSending(false);

				if (res?.status === "success") {
					toast.success("Email sent");
				} else {
					toast.error("Something went wrong 1");
				}
			} catch (error) {
				setSending(false);
				toast.error(
					(error as AxiosError<BaseResponse<null>>)?.response?.data
						?.message ?? "Something went wrong"
				);
			}
		} else {
			toast.error("Something went wrong");
		}
	};

	return (
		<>
			<Head>
				<title>Verify your email | ByteForms</title>
			</Head>
			<Toaster />
			<div className="flex min-h-screen">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
								Verify your email to continue
							</h2>
							<p className="text-gray-500 mt-2">
								We have sent an email with a verification link
								to your email address{" "}
								{userData?.data?.email
									? `(${userData?.data?.email})`
									: ""}
								. Please check your email and click on the link
								to verify your email.
							</p>
						</div>

						<div className="mt-8">
							<div className="mt-6">
								<div>
									<button
										disabled={sending || isLoading}
										onClick={resendEmail}
										className="button-secondary w-full justify-center space-x-2 items-center"
									>
										{(sending || isLoading) && (
											<LoaderIcon />
										)}
										<span>Resend verification link</span>
									</button>
								</div>
								<Link
									href="/login"
									className="justify-center flex button-outlined w-full mt-4"
								>
									<span>Back to login</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="relative hidden w-0 flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
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
