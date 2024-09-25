import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import useUser from "@hooks/useUser";
import { sendVerificationEmail, verifyEmail } from "@api/auth";
import { AxiosError } from "axios";
import { BaseResponse } from "@api/types/responses";

export default function VerifyEmailPage() {
	const {
		data: userData,
		isLoading,
		refetch,
	} = useUser({
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
					toast.error("Something went wrong!");
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

	const router = useRouter();

	const token = router.query.token;
	const [error, setError] = useState<string | null>(null);

	const [isVerifying, setIsLoading] = useState(false);

	const verifyUserEmail = async () => {
		if (!token || typeof token !== "string" || token.length === 0) {
			toast.error("Invalid token");
			setError("Invalid Token");
			return;
		}
		try {
			setError(null);
			setIsLoading(true);

			const res = await verifyEmail(token);
			setIsLoading(false);

			if (res?.status === "success") {
				setError(null);
				toast.success("Email verified successfully");
				refetch();
				const url = router.query?.next as string;
				if (url) {
					router.push(url);
				} else {
					router.push("/dashboard");
				}
			} else {
				setError(res.message ?? "Something went wrong");
				toast.error("Something went wrong!");
			}
		} catch (error) {
			setIsLoading(false);
			console.error("[verifyUserEmail]", error);
			toast.error(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
			setError(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
		}
	};

	useEffect(() => {
		if (router.isReady) {
			verifyUserEmail();
		}
	}, [token, router]);

	return (
		<>
			<Head>
				<title>Verify your email | ByteForms</title>
			</Head>
			<Toaster />
			<div className="flex min-h-screen">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div className="mt-6 flex items-center justify-start space-x-2">
							<h2 className="text-3xl font-bold tracking-tight text-gray-900">
								Verifying your email
							</h2>
							{isVerifying && (
								<LoaderIcon
									style={{
										width: 16,
										height: 16,
									}}
								/>
							)}
						</div>
						{error && <p className="mt-4 text-red-500">{error}</p>}

						{!isLoading && !isVerifying && (
							<div className="mt-8">
								<div className="mt-6">
									{userData?.data?.email && (
										<div>
											<button
												disabled={sending || isLoading}
												onClick={resendEmail}
												className="button-secondary w-full justify-center space-x-2 items-center"
											>
												{(sending || isLoading) && (
													<LoaderIcon />
												)}
												<span>
													Resend verification link
												</span>
											</button>
										</div>
									)}
									<Link
										href="/login"
										className="justify-center flex button-outlined w-full mt-4"
									>
										<span>Back to login</span>
									</Link>
								</div>
							</div>
						)}
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
