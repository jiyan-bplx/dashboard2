import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { resetPassword } from "@api/auth";
import { ResetPasswordResponse } from "@api/auth/responses";
import { convertToCamelCase, getFieldMessageFromTag } from "@utils/index";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
type FormFields = {
	password: string;
};
export default function ResetPasswordPage() {
	const {
		register,
		formState: { isSubmitting, errors },
		handleSubmit,
		setError,
	} = useForm<FormFields>({});

	const router = useRouter();
	const onSubmit = async (data: FormFields) => {
		try {
			const res = await resetPassword({
				password: data.password,
				token: router.query.token as string,
			});
			if (res.status === "success") {
				toast.success("Password Reset successfully");
				const url = router.query?.next as string;
				if (url) {
					router.push(url);
				} else {
					router.push("/login");
				}
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onPasswordReset] Response", res);
			}
		} catch (err) {
			console.error("[onPasswordReset]", err);
			const e = err as AxiosError<ResetPasswordResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				if (
					e?.response?.data?.errors &&
					e?.response?.data?.errors?.length > 0
				) {
					e.response.data.errors.forEach((error) => {
						setError(
							convertToCamelCase(error.field) as keyof FormFields,
							{
								message: getFieldMessageFromTag(
									error.tag,
									error.field
								),
							}
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

	const [showPassword, setShowPassword] = useState(false);
	const togglePassword = () => setShowPassword(!showPassword);

	return (
		<>
			<Head>
				<title>Reset Password | ByteForms</title>
			</Head>
			<Toaster />
			<div className="flex min-h-screen">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
								Reset Password
							</h2>
							{isTokenValid && (
								<p className="text-gray-500">
									Set a new password
								</p>
							)}
						</div>

						{isTokenValid ? (
							<div className="mt-8">
								<div className="mt-6">
									<form
										onSubmit={handleSubmit(onSubmit)}
										className="space-y-6"
									>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700"
											>
												New Password
											</label>
											<div className="mt-1 relative">
												<input
													{...register("password", {
														required:
															"Please enter your password",
														minLength: {
															value: 8,
															message:
																"Password must be atleast 8 characters long",
														},
													})}
													type={
														showPassword
															? "text"
															: "password"
													}
													placeholder="Enter your password"
													autoComplete="new-password"
													className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
												/>
												{showPassword ? (
													<EyeSlashIcon
														className="w-5 h-5 absolute right-2 top-2 text-gray-600"
														onClick={togglePassword}
													/>
												) : (
													<EyeIcon
														className="w-5 h-5 absolute right-2 top-2 text-gray-600"
														onClick={togglePassword}
													/>
												)}
											</div>
											{errors?.password?.message && (
												<p className="text-xs text-red-500 mt-2 text-left">
													{errors?.password?.message}
												</p>
											)}
										</div>

										<div>
											<button
												disabled={isSubmitting}
												type="submit"
												className=" button-primary w-full justify-center space-x-2 items-center"
											>
												{isSubmitting && <LoaderIcon />}
												<span>Reset your password</span>
											</button>
											<Link
												href="/login"
												className="justify-center flex button-outlined w-full mt-4"
											>
												<span>Back to login</span>
											</Link>
										</div>
									</form>
								</div>
							</div>
						) : (
							<div>
								<p className="mt-4 text-red-500">
									The password reset link is invalid. Please
									make sure you are using the correct link.
								</p>
								<p className="text-gray-500">
									Or request a new password recovery link.
								</p>
								<Link
									href="/forgot-password"
									className="button-primary w-full items-center justify-center mt-4"
								>
									Request a new link
								</Link>
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
