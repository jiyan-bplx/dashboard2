import { EyeSlashIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { useQueryClient } from "react-query";
import validator from "validator";
import { getCurrentUser, loginUser } from "@api/auth";
import { LoginResponse } from "@api/auth/responses";
import { getActiveSubscription } from "@api/subscriptions";
import { convertToCamelCase, getFieldMessageFromTag } from "@utils/index";
import { API_URL } from "@utils/constants";
import useUser from "@hooks/useUser";
type LoginFields = {
	email: string;
	password: string;
};
export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const togglePassword = () => setShowPassword(!showPassword);

	const client = useQueryClient();
	const { data: user, isLoading: loadingUser } = useUser();

	useEffect(() => {
		if (!loadingUser && user?.data?.email) {
			const url = router.query?.next as string;
			if (url) {
				router.push(url);
			} else {
				router.push("/dashboard");
			}
		}
	}, [user, loadingUser]);

	const {
		register,
		formState: { isSubmitting, errors },
		handleSubmit,
		setError,
	} = useForm<LoginFields>({});

	const router = useRouter();
	const onSubmit = async (data: LoginFields) => {
		try {
			const res = await loginUser({
				email: data.email,
				password: data.password,
			});
			if (res.status === "success") {
				toast.success("Logged in successfully");

				// Fetch active plans and user data beforehand
				await Promise.all([
					client.fetchQuery({
						queryKey: ["currentUser"],
						queryFn: getCurrentUser,
					}),
					client.fetchQuery({
						queryKey: ["user_plan"],
						queryFn: getActiveSubscription,
					}),
				]);

				const url = router.query?.next as string;
				if (url) {
					router.push(url);
				} else {
					router.push("/dashboard");
				}
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onLogin] Response", res);
			}
		} catch (err) {
			console.error("[onLogin]", err);
			const e = err as AxiosError<LoginResponse>;
			if (e?.response?.data?.message) {
				if (
					e.response.data.message
						.toLowerCase()
						.includes("invalid email or password")
				) {
					setError("password", {
						message: "Invalid email or password",
						type: "value",
					});
					toast.error("Invalid email or password");
				} else {
					toast.error(e.response.data.message);
				}
			} else {
				if (
					e?.response?.data?.errors &&
					e?.response?.data?.errors?.length > 0
				) {
					e.response.data.errors.forEach((error) => {
						setError(
							convertToCamelCase(
								error.field
							) as keyof LoginFields,
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

	return (
		<>
			<Head>
				<title>Login | ByteForms</title>
				<script
					src="https://accounts.google.com/gsi/client"
					async
				></script>
			</Head>
			<Toaster />
			<div
				id="g_id_onload"
				data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
				data-context="signin"
				data-login_uri={`${API_URL}/api/auth/google/onetap/callback`}
				data-auto_select="true"
				data-itp_support="true"
			></div>
			<div className="flex min-h-screen">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<Link href="/">
								<button className="button-outlined flex items-center space-x-2 md:hidden">
									<ArrowLeftIcon className="w-3 h-3" />
									<span>Go back</span>
								</button>
							</Link>
							<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
								Sign in to your account
							</h2>
						</div>

						<div className="mt-8">
							<div>
								<div>
									<p className="text-sm font-medium text-gray-700">
										Sign in with
									</p>

									<div className="mt-1 ">
										<div>
											<a
												href={`${API_URL}/api/auth/google`}
												className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 space-x-1 items-center"
											>
												<span className="">
													Continue with Google
												</span>

												<svg
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
														fill="currentColor"
													/>
												</svg>
											</a>
										</div>
									</div>
								</div>

								<div className="relative mt-6">
									<div
										className="absolute inset-0 flex items-center"
										aria-hidden="true"
									>
										<div className="w-full border-t border-gray-300" />
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="bg-white px-2 text-gray-500">
											Or continue with
										</span>
									</div>
								</div>
							</div>

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
											Email address
										</label>
										<div className="mt-1">
											<input
												{...register("email", {
													required:
														"Please enter your email",
													validate: (val) =>
														validator.isEmail(
															val
														) ||
														"Please enter a valid email",
												})}
												type="email"
												autoComplete="email"
												className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
										{errors?.email?.message && (
											<p className="text-xs text-red-500 mt-2 text-left">
												{errors?.email?.message}
											</p>
										)}
									</div>

									<div className="space-y-1">
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700"
										>
											Password
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
												autoComplete="current-password"
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

									<div className="flex items-center justify-end">
										<div className="text-sm">
											<Link
												href="/forgot-password"
												className="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Forgot your password?
											</Link>
										</div>
									</div>

									<div>
										<button
											disabled={isSubmitting}
											type="submit"
											className=" button-primary w-full justify-center space-x-2 items-center"
										>
											{isSubmitting && <LoaderIcon />}
											<span>Sign in</span>
										</button>
									</div>
									<div className="text-sm">
										<Link
											href="/register"
											className="font-medium text-indigo-600 hover:text-indigo-500"
										>
											Don't have an account ?
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div className="relative hidden w-0 flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="/loginimg.png"
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
