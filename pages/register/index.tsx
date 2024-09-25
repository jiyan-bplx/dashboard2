import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { SignupRequest } from "@api/auth/requests";
import { API_URL } from "@utils/constants";
import { registerUser } from "@api/auth";
import { RegisterResponse } from "@api/auth/responses";
import { convertToCamelCase, getFieldMessageFromTag } from "@utils/index";
import validator from "validator";
import Head from "next/head";
import { EyeSlashIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import useUser from "@hooks/useUser";
type SignupFields = SignupRequest;
export default function RegisterPage() {
	const {
		register,
		formState: { isSubmitting, errors },
		handleSubmit,
		getValues,
		setError,
	} = useForm<SignupFields>({
		criteriaMode: "all",
	});

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

	const router = useRouter();
	const onSubmit = async (data: SignupFields) => {
		try {
			const res = await registerUser({
				email: data.email,
				password: data.password,
				name: data.name,
				passwordConfirm: data.passwordConfirm,
			});
			if (res.status === "success") {
				toast.success("Signed up successfully");
				const url = router.query?.next as string;

				if (url) {
					router.push("/login?next=" + url);
				} else {
					router.push("/login");
				}
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onRegister] Response", res);
			}
		} catch (err) {
			console.error("[onRegister]", err);
			const e = err as AxiosError<RegisterResponse>;
			if (e?.response?.data?.message) {
				if (e.response.data.message.includes("email already exists")) {
					setError("email", {
						message: "This email is already registered",
						type: "value",
					});
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
							) as keyof SignupFields,
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

	const [showPassword, setShowPassword] = useState(false);
	const togglePassword = () => setShowPassword(!showPassword);
	return (
		<>
			<Toaster />
			<Head>
				<title>Register | ByteForms</title>
			</Head>
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
								Create an account
							</h2>
							<p className="mt-2 text-sm text-gray-600">
								It only takes a few minutes to get set up.
							</p>
						</div>

						<div className="mt-8">
							<div>
								<div>
									<p className="text-sm font-medium text-gray-700">
										Sign up with
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
											htmlFor="name"
											className="block text-sm font-medium text-gray-700"
										>
											Name
										</label>
										<div className="mt-1">
											<input
												id="name"
												{...register("name", {
													required:
														"Please enter your name",
												})}
												autoComplete="name"
												className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
										{errors?.name?.message && (
											<p className="text-xs text-red-500 mt-2 text-left">
												{errors?.name?.message}
											</p>
										)}
									</div>
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
										<div className="mt-1">
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
												type="password"
												autoComplete="new-password"
												className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
										{errors?.password?.message && (
											<p className="text-xs text-red-500 mt-2 text-left">
												{errors?.password?.message}
											</p>
										)}
									</div>

									<div className="space-y-1">
										<label
											htmlFor="passwordConfirm"
											className="block text-sm font-medium text-gray-700"
										>
											Confirm Password
										</label>
										<div className="mt-1 relative">
											<input
												{...register(
													"passwordConfirm",
													{
														required:
															"Please confirm your password",
														// Should be same as 'password' field
														validate: (value) => {
															return (
																value ===
																	getValues()[
																		"password"
																	] ||
																"Passwords don't match"
															);
														},
													}
												)}
												type={
													showPassword
														? "text"
														: "password"
												}
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
										{errors?.passwordConfirm?.message && (
											<p className="text-xs text-red-500 mt-2 text-left">
												{
													errors?.passwordConfirm
														?.message
												}
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
											<span>Sign up</span>
										</button>
									</div>
									<div className="text-sm">
										<Link
											href="/login"
											className="font-medium text-indigo-600 hover:text-indigo-500"
										>
											Already have an account ?
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
